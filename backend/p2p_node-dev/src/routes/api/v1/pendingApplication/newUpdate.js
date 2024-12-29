const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const submissionModel = require("../../../../models/api/v1/pendingApplication/submission");
const isEmpty = require("is-empty");
const {
  userRoleAuthorization,
} = require("../../../../middleware/authorization");
const hierarchyModel = require("../../../../models/api/v1/common/hierarchyByModule");
const templateNameModel = require("../../../../models/api/v1/common/findTemplateName");
const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");


router.post(
    `/approve-reject`,
    verifyToken,
    userRoleAuthorization,
    async (req, res) => {
      try {
        let templateName;
        let isMustPersonApproved;
        let isAnyoneApproved;
        let myStage;
        let isAlreadyActioned;
        let statusByCode;
        let nextStageLevel;
        let currentStageLevel;
        let statusApproved = "APPROVED";
        let statusInProcess = "IN PROCESS";
        let statusReject = "REJECTED";
  
        let value = {
          registration_status: 400,
          registration_stage_status: 400,
          update_status: 400,
          history_status: 400,
          log_status: 400,
          registration_message: "",
          registration_stage_message: ".",
          update_message: "",
          history_message: "",
          log_message: "",
        };
        userId = req.user ? req.user.USER_ID : null;
  
        let reqData = {
          SUBMISSION_STATUS: req.body.SUBMISSION_STATUS,
          APPROVAL_STATUS: req.body.APPROVAL_STATUS,
          IS_REG_COMPLETE: req.body.IS_REG_COMPLETE,
          ACTION_CODE: req.body.ACTION_CODE,
          USER_ID: req.body.SUPPLIER_ID,
          STAGE_ID: req.body.STAGE_ID,
          NOTE: req.body.NOTE,
          STAGE_LEVEL: req.body.STAGE_LEVEL,
          ACTION_ID: req.body.ACTION_ID,
        };
  
        if (isEmpty(reqData.ACTION_ID))
          return res.status(400).send({
            success: false,
            status: 400,
            message: "Please Give Action ID.",
          });
  
        if (isEmpty(reqData.STAGE_ID))
          return res.status(400).send({
            success: false,
            status: 400,
            message: "Please Give Stage ID.",
          });
  
        if (isEmpty(reqData.SUBMISSION_STATUS))
          return res.status(400).send({
            success: false,
            status: 400,
            message: "Please Give Submission Status.",
          });
  
        let validateDataCheck = await commonObject.characterLimitCheck(
          reqData.NOTE,
          "APPROVAL NOTE"
        );
  
        if (validateDataCheck.success == false)
          return res.status(400).send({
            success: false,
            status: 400,
            message: validateDataCheck.message,
          });
        reqData.NOTE = validateDataCheck.data;
  
        //TODO: Set Current Stage
        currentStageLevel = reqData.STAGE_LEVEL;
        //TODO: Check the requestor is already Approved/Reject this
        let userQueryResultForCheckExist =
          await submissionModel.approveRejectSubmissionCheckExist(
            reqData.USER_ID,
            reqData.STAGE_ID,
            reqData.STAGE_LEVEL,
            userId
          );
  
        await commonObject.makeArrayObject(userQueryResultForCheckExist);
        let rowObject = await commonObject.convertArrayToObject(
          userQueryResultForCheckExist.queryResult.finalData
        );
        isAlreadyActioned = rowObject.TOTAL;
  
        if (isAlreadyActioned == 1) {
          let connectionP2pORACLE = await getPool();
          await connectionP2pORACLE.close();
          return res.status(400).send({
            message: "You Already Approved/Reject this!",
            status: 400,
          });
        }
  
        //TODO: If rejected
        if (reqData.ACTION_CODE == 0 || reqData.APPROVAL_STATUS == statusReject) {
          let userQueryResultForReg =
            await submissionModel.approveRejectSubmissionUserTableForReg(
              reqData.USER_ID,
              reqData.STAGE_ID,
              1,
              "DRAFT",
              statusReject,
              0
            );
          console.log(userQueryResultForReg);
          value.registration_message = userQueryResultForReg.outBinds.MESSAGE;
          value.registration_status = userQueryResultForReg.outBinds.STATUS;
          if (value.registration_status == 200) {
            let userQueryResultForLog =
              await submissionModel.approveRejectSubmissionLogTable(
                reqData.ACTION_ID,
                reqData.STAGE_ID,
                reqData.STAGE_LEVEL,
                statusReject
              );
            console.log(userQueryResultForLog);
            value.log_message = userQueryResultForLog.outBinds.MESSAGE;
            value.log_status = userQueryResultForLog.outBinds.STATUS;
          }
          if (value.registration_status == 200) {
            let userQueryResultForHistory =
              await submissionModel.approveRejectSubmissionHistory(
                userId,
                reqData.ACTION_CODE,
                reqData.USER_ID,
                reqData.STAGE_ID,
                reqData.NOTE,
                reqData.STAGE_LEVEL
              );
            console.log(userQueryResultForHistory);
            value.history_message = userQueryResultForHistory.outBinds.MESSAGE;
            value.history_status = userQueryResultForHistory.outBinds.STATUS;
          }
  
          return res.status(value.registration_status).json(value);
        }
  
        ////TODO: hierarchy by module name
        let templateNameQueryResult = await templateNameModel.templateName(
          reqData.STAGE_ID
        );
        await commonObject.makeArrayObject(templateNameQueryResult);
        templateName = await commonObject.convertArrayToObject(
          templateNameQueryResult.queryResult.finalData
        );
        //TODO: Template Name
        templateName = templateName.APPROVAL_STAGE_NAME;
  
        ////
        //TODO: hierarchy by Template name
        let hierarchyListQueryResult = await hierarchyModel.approverList(
          reqData.USER_ID,
          templateName
        );
        await commonObject.makeArrayObject(hierarchyListQueryResult);
        console.log(`hierarchyList =`);
        console.log(hierarchyListQueryResult.queryResult.finalData);
        //TODO: Finding next stage from my stage
        if (hierarchyListQueryResult.queryResult.finalData.length > 0) {
          nextStageLevel = await findNextDifferentStageLevel(
            hierarchyListQueryResult.queryResult.finalData,
            reqData.STAGE_LEVEL
          );
        }
        console.log(`nextStageLevel = ${nextStageLevel}`);
  
        //TODO: Update on user table
  
        if (isAlreadyActioned == 0) {
          if (nextStageLevel == null) {
            //TODO On User Table
            let userQueryResultForReg =
              await submissionModel.approveRejectSubmissionUserTableForReg(
                reqData.USER_ID,
                reqData.STAGE_ID,
                reqData.STAGE_LEVEL,
                "DRAFT",
                reqData.ACTION_CODE == 1 ? statusApproved : statusReject,
                reqData.ACTION_CODE == 1 ? 1 : 0
              );
            console.log(userQueryResultForReg);
            value.registration_message = userQueryResultForReg.outBinds.MESSAGE;
            value.registration_status = userQueryResultForReg.outBinds.STATUS;
            //TODO ON Log Table
            if (value.registration_status == 200) {
              let userQueryResultForLog =
                await submissionModel.approveRejectSubmissionLogTable(
                  reqData.ACTION_ID,
                  reqData.STAGE_ID,
                  reqData.STAGE_LEVEL,
                  reqData.ACTION_CODE == 1 ? statusApproved : statusReject
                );
              console.log(userQueryResultForLog);
              value.log_message = userQueryResultForLog.outBinds.MESSAGE;
              value.log_status = userQueryResultForLog.outBinds.STATUS;
            }
            //TODO On History Table
            if (value.registration_status == 200) {
              let userQueryResultForHistory =
                await submissionModel.approveRejectSubmissionHistory(
                  userId,
                  reqData.ACTION_CODE,
                  reqData.USER_ID,
                  reqData.STAGE_ID,
                  reqData.NOTE,
                  reqData.STAGE_LEVEL
                );
              console.log(userQueryResultForHistory);
              value.history_message = userQueryResultForHistory.outBinds.MESSAGE;
              value.history_status = userQueryResultForHistory.outBinds.STATUS;
            }
            return res.status(value.registration_status).json(value);
          }
          if (nextStageLevel != null) {
            //TODO On User Table
            let userQueryResultForReg =
              await submissionModel.approveRejectSubmissionUserTableForReg(
                reqData.USER_ID,
                reqData.STAGE_ID,
                nextStageLevel,
                reqData.SUBMISSION_STATUS,
                reqData.ACTION_CODE == 1 ? statusApproved : statusReject,
                reqData.IS_REG_COMPLETE
              );
            console.log(`result = ${userQueryResultForReg}`);
            value.registration_message = userQueryResultForReg.outBinds.MESSAGE;
            value.registration_status = userQueryResultForReg.outBinds.STATUS;
            //TODO ON Log Table
            if (value.registration_status == 200) {
              let userQueryResultForLog =
                await submissionModel.approveRejectSubmissionLogTable(
                  reqData.ACTION_ID,
                  reqData.STAGE_ID,
                  reqData.STAGE_LEVEL,
                  reqData.ACTION_CODE == 1 ? statusApproved : statusReject
                );
              console.log(userQueryResultForLog);
              value.log_message = userQueryResultForLog.outBinds.MESSAGE;
              value.log_status = userQueryResultForLog.outBinds.STATUS;
            }
            //TODO On History Table
            if (value.registration_status == 200) {
              let userQueryResultForHistory =
                await submissionModel.approveRejectSubmissionHistory(
                  userId,
                  reqData.ACTION_CODE,
                  reqData.USER_ID,
                  reqData.STAGE_ID,
                  reqData.NOTE,
                  reqData.STAGE_LEVEL
                );
              console.log(userQueryResultForHistory);
              value.history_message = userQueryResultForHistory.outBinds.MESSAGE;
              value.history_status = userQueryResultForHistory.outBinds.STATUS;
            }
            return res.status(value.registration_status).json(value);
          }
        }
      } catch (error) {
        console.error("Error querying database:", error);
        res.status(500).json({ error: "Database query error" });
      }
    }
  );
  
  function findNextDifferentStageLevel(dataArray, currentStageLevel) {
    const uniqueLevels = [
      ...new Set(dataArray.map((item) => parseInt(item.STAGE_LEVEL))),
    ];
  
    const sortedLevels = uniqueLevels.sort((a, b) => a - b);
    const currentIndex = sortedLevels.indexOf(parseInt(currentStageLevel));
  
    if (currentIndex !== -1) {
      let nextIndex = currentIndex + 1;
      while (
        nextIndex < sortedLevels.length &&
        sortedLevels[nextIndex] === currentStageLevel
      ) {
        nextIndex++;
      }
  
      return nextIndex < sortedLevels.length ? sortedLevels[nextIndex] : null;
    }
  
    return null;
  }
  

module.exports = router;
