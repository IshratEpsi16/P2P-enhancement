const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const submissionModel = require("../../../../models/api/v1/pendingApplication/submission");
const profilePendingModel = require("./../../../../models/api/v1/pendingApplication/pendingProfileUpdate");
const isEmpty = require("is-empty");
const {
  userRoleAuthorization,
} = require("../../../../middleware/authorization");
const hierarchyModel = require("../../../../models/api/v1/common/hierarchyByModule");
const templateNameModel = require("../../../../models/api/v1/common/findTemplateName");
const csApprovalModel = require("../../../../models/api/v1/csCreation/csApproval");
const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const logger = require("../../../../common/api/v1/logger");

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
      let insertHistory = {};

      let value = {
        update_status: 400,
        history_status: 400,
        log_status: 400,
        update_message: "",
        history_message: "",
        log_message: "",
      };
      userId = req.user ? req.user.USER_ID : null;

      let reqData = {
        SUBMISSION_STATUS: req.body.SUBMISSION_STATUS,
        APPROVAL_STATUS: req.body.APPROVAL_STATUS,
        ACTION_CODE: req.body.ACTION_CODE,
        USER_ID: req.body.SUPPLIER_ID,
        STAGE_ID: req.body.STAGE_ID,
        NOTE: req.body.NOTE,
        STAGE_LEVEL: req.body.STAGE_LEVEL,
        ACTION_ID: req.body.ACTION_ID,
        PROFILE_UPDATE_UID: req.body.PROFILE_UPDATE_UID,
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
      // let userQueryResultForCheckExist =
      //   await submissionModel.approveRejectSubmissionCheckExist(
      //     reqData.USER_ID,
      //     reqData.STAGE_ID,
      //     reqData.STAGE_LEVEL,
      //     userId
      //   );

      // await commonObject.makeArrayObject(userQueryResultForCheckExist);
      // let rowObject = await commonObject.convertArrayToObject(
      //   userQueryResultForCheckExist.queryResult.finalData
      // );
      // isAlreadyActioned = rowObject.TOTAL;
      // console.log(`isAlreadyActioned=${isAlreadyActioned}`);

      // if (isAlreadyActioned == 1) {
      //   let connectionP2pORACLE = await getPool();
      //   await connectionP2pORACLE.close();
      //   return res.status(400).send({
      //     message: "You Already Approved/Reject this!",
      //     status: 400,
      //   });
      // }

      //TODO: If rejected
      if (reqData.ACTION_CODE == 0) {
        let userQueryResultForReg =
          await submissionModel.approveRejectSubmissionUserTableForUpdate(
            reqData.USER_ID,
            reqData.STAGE_ID,
            1,
            "DRAFT",
            statusReject
          );
        console.log(userQueryResultForReg);
        value.update_message = 'Rejected Successfully.'; //userQueryResultForReg.outBinds.MESSAGE;
        value.update_status = userQueryResultForReg.outBinds.STATUS;
        if (value.update_status == 200) {
          insertHistory.STAGE_ID = reqData.STAGE_ID;
          insertHistory.STAGE_LEVEL = reqData.STAGE_LEVEL;
          insertHistory.ACTION_CODE = reqData.ACTION_CODE;
          insertHistory.OBJECT_ID = reqData.USER_ID;
          insertHistory.OBJECT_TYPE_CODE = "PU";
          insertHistory.APPROVER_ID = userId;
          insertHistory.CREATED_BY = userId;
          insertHistory.NOTE = reqData.NOTE;
          insertHistory.USER_ID = reqData.USER_ID;
          if (!isEmpty(reqData.PROFILE_UPDATE_UID)) {
            insertHistory.PROFILE_UPDATE_UID = reqData.PROFILE_UPDATE_UID;
          }

          let userQueryResultForHistory = await csApprovalModel.insertHistory(
            insertHistory
          );
          if (userQueryResultForHistory.rowsAffected > 0) {
            value.history_message = "History Inserted";
            value.history_status = 200;
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
        }

        // if (value.registration_status == 200) {
        //   let userQueryResultForHistory =
        //     await submissionModel.approveRejectSubmissionHistory(
        //       userId,
        //       reqData.ACTION_CODE,
        //       reqData.USER_ID,
        //       reqData.STAGE_ID,
        //       reqData.NOTE,
        //       reqData.STAGE_LEVEL
        //     );
        //   console.log(userQueryResultForHistory);
        //   value.history_message = userQueryResultForHistory.outBinds.MESSAGE;
        //   value.history_status = userQueryResultForHistory.outBinds.STATUS;
        // }

        return res.status(value.update_status).json(value);
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
        "Profile Update"
        //templateName
      );
      await commonObject.makeArrayObject(hierarchyListQueryResult);
      // console.log(`hierarchyList =`);
      // console.log(hierarchyListQueryResult.queryResult.finalData);
      //TODO: Finding next stage from my stage
      if (hierarchyListQueryResult.queryResult.finalData.length > 0) {
        nextStageLevel = await findNextDifferentStageLevel(
          hierarchyListQueryResult.queryResult.finalData,
          reqData.STAGE_LEVEL
        );
      }
      console.log(`nextStageLevel = ${nextStageLevel}`);
      console.log(`shifat`);

      //!Check Data Left on update table
      //   let supplierListQueryResult =
      //   await profilePendingModel.pendingProfileUpdateDetails(
      //     reqData.STAGE_ID,
      //     reqData.STAGE_LEVEL,
      //     reqData.USER_ID,
      //     "IN PROCESS"
      //   );
      // await commonObject.makeArrayObject(supplierListQueryResult);
      // console.log(`supplierListQueryResult `);
      // console.log(supplierListQueryResult.queryResult.totalData);

      //TODO: Update on user table

      //if (isAlreadyActioned == 0) {
      if (nextStageLevel == null) {
        //TODO On User Table
        let userQueryResultForReg =
          await submissionModel.approveRejectSubmissionUserTableForUpdate(
            reqData.USER_ID,
            reqData.STAGE_ID,
            1,
            "DRAFT",
            reqData.ACTION_CODE == 1 ? statusApproved : statusReject
          );
        console.log(userQueryResultForReg);
        value.registration_message = userQueryResultForReg.outBinds.MESSAGE;
        value.registration_status = userQueryResultForReg.outBinds.STATUS;
        //   //TODO On History Table
        if (userQueryResultForReg.outBinds.STATUS == 200) {
          insertHistory.STAGE_ID = reqData.STAGE_ID;
          insertHistory.STAGE_LEVEL = reqData.STAGE_LEVEL;
          insertHistory.ACTION_CODE = reqData.ACTION_CODE;
          insertHistory.OBJECT_ID = reqData.USER_ID;
          insertHistory.OBJECT_TYPE_CODE = "PU";
          insertHistory.APPROVER_ID = userId;
          insertHistory.CREATED_BY = userId;
          insertHistory.NOTE = reqData.NOTE;
          insertHistory.USER_ID = reqData.USER_ID;
          if (!isEmpty(reqData.PROFILE_UPDATE_UID)) {
            insertHistory.PROFILE_UPDATE_UID = reqData.PROFILE_UPDATE_UID;
          }

          let userQueryResultForHistory = await csApprovalModel.insertHistory(
            insertHistory
          );
          if (userQueryResultForHistory.rowsAffected > 0) {
            value.history_message = "History Inserted";
            value.history_status = 200;
          }
          // let userQueryResultForHistory =
          //   await submissionModel.approveRejectSubmissionHistory(
          //     userId,
          //     reqData.ACTION_CODE,
          //     reqData.USER_ID,
          //     reqData.STAGE_ID,
          //     reqData.NOTE,
          //     reqData.STAGE_LEVEL
          //   );
          // console.log(userQueryResultForHistory);
          // value.history_message = userQueryResultForHistory.outBinds.MESSAGE;
          // value.history_status = userQueryResultForHistory.outBinds.STATUS;
        }
        //   //TODO ON Log Table
        if (userQueryResultForReg.outBinds.STATUS == 200) {
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
        let supplierListQueryResult =
          await profilePendingModel.pendingProfileUpdateDetails(
            reqData.STAGE_ID,
            1,
            reqData.USER_ID,
            "IN PROCESS"
          );

        await commonObject.makeArrayObject(supplierListQueryResult);
        console.log(supplierListQueryResult.queryResult.finalData);
        if (supplierListQueryResult.queryResult.finalData.length == 0) {
          //TODO On User Table
          let userQueryResultForReg =
            await submissionModel.approveRejectSubmissionUserTableForUpdate(
              reqData.USER_ID,
              reqData.STAGE_ID,
              1,
              "DRAFT",
              reqData.ACTION_CODE == 1 ? statusApproved : statusReject
            );
          console.log(userQueryResultForReg);
        } else {
          //TODO On User Table
          let userQueryResultForReg =
            await submissionModel.approveRejectSubmissionUserTableForUpdate(
              reqData.USER_ID,
              reqData.STAGE_ID,
              1,
              "SUBMIT",
              "IN PROCESS"
            );
          console.log(userQueryResultForReg);
        }
        value.update_message = 'Approved Successfully.';//"Information Updated Successfully";
        value.update_status = 200;
        return res.status(value.update_status).json(value);
      }
      //! If more approver
      if (nextStageLevel != null) {
        //TODO On User Table
        let userQueryResultForUpdate =
          await submissionModel.approveRejectSubmissionUserTableForUpdate(
            reqData.USER_ID,
            reqData.STAGE_ID,
            nextStageLevel,
            "SUBMIT",
            "IN PROCESS"
            //reqData.ACTION_CODE == 1 ? statusApproved : statusReject
          );
        console.log(`userQueryResultForUpdate`);
        console.log(userQueryResultForUpdate);

        //   //TODO On History Table
        if (userQueryResultForUpdate.outBinds.STATUS == 200) {
          insertHistory.STAGE_ID = reqData.STAGE_ID;
          insertHistory.STAGE_LEVEL = reqData.STAGE_LEVEL;
          insertHistory.ACTION_CODE = reqData.ACTION_CODE;
          insertHistory.OBJECT_ID = reqData.USER_ID;
          insertHistory.OBJECT_TYPE_CODE = "PU";
          insertHistory.APPROVER_ID = userId;
          insertHistory.CREATED_BY = userId;
          insertHistory.NOTE = reqData.NOTE;
          insertHistory.USER_ID = reqData.USER_ID;
          if (!isEmpty(reqData.PROFILE_UPDATE_UID)) {
            insertHistory.PROFILE_UPDATE_UID = reqData.PROFILE_UPDATE_UID;
          }

          let userQueryResultForHistory = await csApprovalModel.insertHistory(
            insertHistory
          );
          if (userQueryResultForHistory.rowsAffected > 0) {
            value.history_message = "History Inserted";
            value.history_status = 200;
          }
          // let userQueryResultForHistory =
          //   await submissionModel.approveRejectSubmissionHistory(
          //     userId,
          //     reqData.ACTION_CODE,
          //     reqData.USER_ID,
          //     reqData.STAGE_ID,
          //     reqData.NOTE,
          //     reqData.STAGE_LEVEL
          //   );
          // console.log(userQueryResultForHistory);
          // value.history_message = userQueryResultForHistory.outBinds.MESSAGE;
          // value.history_status = userQueryResultForHistory.outBinds.STATUS;
        }
        //   //TODO ON Log Table
        if (userQueryResultForUpdate.outBinds.STATUS == 200) {
          let userQueryResultForLog =
            await submissionModel.approveRejectSubmissionLogTable(
              reqData.ACTION_ID,
              reqData.STAGE_ID,
              nextStageLevel,
              "IN PROCESS"
              //reqData.ACTION_CODE == 1 ? statusApproved : statusReject
            );
          console.log(userQueryResultForLog);
          value.log_message = userQueryResultForLog.outBinds.MESSAGE;
          value.log_status = userQueryResultForLog.outBinds.STATUS;
        }

        value.update_message = 'Approved Successfully.';//"Information Updated Successfully";
        value.update_status = 200;
        return res.status(value.update_status).json(value);
      }
      // if (nextStageLevel != null) {
      //   //TODO On User Table
      //   let userQueryResultForReg =
      //     await submissionModel.approveRejectSubmissionUserTableForReg(
      //       reqData.USER_ID,
      //       reqData.STAGE_ID,
      //       nextStageLevel,
      //       reqData.SUBMISSION_STATUS,
      //       reqData.ACTION_CODE == 1 ? statusApproved : statusReject,
      //       reqData.IS_REG_COMPLETE
      //     );
      //   console.log(`result = ${userQueryResultForReg}`);
      //   value.registration_message = userQueryResultForReg.outBinds.MESSAGE;
      //   value.registration_status = userQueryResultForReg.outBinds.STATUS;
      //   //TODO ON Log Table
      //   if (value.registration_status == 200) {
      //     let userQueryResultForLog =
      //       await submissionModel.approveRejectSubmissionLogTable(
      //         reqData.ACTION_ID,
      //         reqData.STAGE_ID,
      //         reqData.STAGE_LEVEL,
      //         reqData.ACTION_CODE == 1 ? statusApproved : statusReject
      //       );
      //     console.log(userQueryResultForLog);
      //     value.log_message = userQueryResultForLog.outBinds.MESSAGE;
      //     value.log_status = userQueryResultForLog.outBinds.STATUS;
      //   }
      //   //TODO On History Table
      // if (value.registration_status == 200) {
      //   let userQueryResultForHistory =
      //     await submissionModel.approveRejectSubmissionHistory(
      //       userId,
      //       reqData.ACTION_CODE,
      //       reqData.USER_ID,
      //       reqData.STAGE_ID,
      //       reqData.NOTE,
      //       reqData.STAGE_LEVEL
      //     );
      //   console.log(userQueryResultForHistory);
      //   value.history_message = userQueryResultForHistory.outBinds.MESSAGE;
      //   value.history_status = userQueryResultForHistory.outBinds.STATUS;
      // }
      //   return res.status(value.registration_status).json(value);
      // }
      //}
    } catch (error) {
      logger.error(error);
      console.error("Error querying database:", error);
      value.update_message = error;//"Information Updated Successfully";
      value.update_status = 500;
      res.status(500).json(value);
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
