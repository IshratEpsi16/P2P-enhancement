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
const hierarchyModel = require("./../../../../models/api/v1/common/hierarchyByModule");
const templateNameModel = require("./../../../../models/api/v1/common/findTemplateName");

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
        SUBMISSION_STATUS: 'SUBMIT',
        APPROVAL_STATUS: req.body.APPROVAL_STATUS,
        IS_REG_COMPLETE: 0,
        ACTION_CODE: req.body.ACTION_CODE,
        USER_ID: req.body.SUPPLIER_ID,
        STAGE_ID: req.body.STAGE_ID,
        NOTE: req.body.NOTE,
        STAGE_LEVEL: req.body.STAGE_LEVEL,
        ACTION_ID: req.body.ACTION_ID,
      };

      if (isEmpty(reqData.STAGE_ID))
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Please Give Stage ID.",
        });

      if (isEmpty(reqData.APPROVAL_STATUS))
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Please Give Approval Status.",
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
      //TODO: Status by action Code
      // if (reqData.ACTION_CODE == 1) {
      //   statusByCode = "APPROVED";
      //   reqData.APPROVAL_STATUS = statusByCode;
      // } else if (reqData.ACTION_CODE == 0) {
      //   statusByCode = "REJECTED";
      //   reqData.APPROVAL_STATUS = statusByCode;
      // }

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
      //console.log(hierarchyListQueryResult.queryResult.finalData);
      //TODO: Listing Stage Level Where Level are Same
      let stageLevelArray =
        await hierarchyListQueryResult.queryResult.finalData.map(
          (item) => item.STAGE_LEVEL
        );
      //console.log(`stageLevelArray${stageLevelArray}`);
      //let myStage = await stageLevelArray.filter((item) =>item === reqData.STAGE_ID);
      //TODO: Finding My Stage into Stage Level
      myStage = await stageLevelArray.includes(parseInt(reqData.STAGE_LEVEL));
      //console.log(reqData.STAGE_LEVEL);
      //console.log(myStage);

      let filteredArray =
        await hierarchyListQueryResult.queryResult.finalData.filter(
          (item) => item.STAGE_LEVEL === parseInt(reqData.STAGE_LEVEL)
        );
      //console.log(filteredArray);
      //TODO: Finding is there any must approver in my stage
      let mustApprovedArray = filteredArray.filter(
        (item) => item.IS_MUST_APPROVE === 1
      );

      //TODO: Finding is there any must approver in my stage
      let mustApprovedArrayLength = 0;
      for (let i = 0; i < mustApprovedArray.length; i++) {
        if (mustApprovedArray[i].IS_MUST_APPROVE == 1) {
          mustApprovedArrayLength = mustApprovedArrayLength + 1;
        }
      }
      console.log(
        `inital mustApprovedArrayLength = ${mustApprovedArrayLength}`
      );

      //console.log(mustApprovedArray);
      //TODO: Checking must approver is already approved/reject or not
      let mustApproversActionedLength = 0;
      if (mustApprovedArray.length > 0) {
        for (let i = 0; i < mustApprovedArray.length; i++) {
          let userQueryResultForCheckExist =
            await submissionModel.approveRejectSubmissionCheckExist(
              reqData.USER_ID,
              mustApprovedArray[i].STAGE_ID,
              mustApprovedArray[i].STAGE_LEVEL,
              mustApprovedArray[i].APPROVER_ID
            );

          await commonObject.makeArrayObject(userQueryResultForCheckExist);
          let rowObject = await commonObject.convertArrayToObject(
            userQueryResultForCheckExist.queryResult.finalData
          );
          isMustPersonApproved = rowObject.TOTAL;
          if (isMustPersonApproved == 1) {
            mustApproversActionedLength = mustApproversActionedLength + 1;
          }
          console.log(isMustPersonApproved);
        }
      }
      console.log(`mustApproved = ${isMustPersonApproved}`);
      //TODO: Checking anyone is approved/reject or not
      if (isMustPersonApproved == 0) {
        for (let i = 0; i < filteredArray.length; i++) {
          let userQueryResultForCheckExist =
            await submissionModel.approveRejectSubmissionCheckExist(
              reqData.USER_ID,
              filteredArray[i].STAGE_ID,
              filteredArray[i].STAGE_LEVEL,
              filteredArray[i].APPROVER_ID
            );

          await commonObject.makeArrayObject(userQueryResultForCheckExist);
          let rowObject = await commonObject.convertArrayToObject(
            userQueryResultForCheckExist.queryResult.finalData
          );
          isAnyoneApproved = rowObject.TOTAL;
        }
      }

      //TODO: Finding next stage from my stage
      let nextStageLevel;
      if (mustApprovedArray.length > 0) {
        if (isMustPersonApproved == 1) {
          nextStageLevel = await findNextDifferentStageLevel(
            hierarchyListQueryResult.queryResult.finalData,
            reqData.STAGE_LEVEL
          );
        }
      } else if (isAnyoneApproved == 1) {
        nextStageLevel = await findNextDifferentStageLevel(
          hierarchyListQueryResult.queryResult.finalData,
          reqData.STAGE_LEVEL
        );
      }
      console.log(nextStageLevel);
      //TODO: All Approvers are approved/reject or not
      let allApproversActioned = false;
      if (mustApprovedArray.length > 0) {
        if (
          mustApprovedArrayLength.length ==
            mustApproversActionedLength.length &&
          nextStageLevel != null
        ) {
          allApproversActioned = true;
          //reqData.STAGE_LEVEL = nextStageLevel;
        }
      }
      console.log(`allApproversActioned = ${allApproversActioned}`);
      console.log(`STAGE_LEVEL = ${reqData.STAGE_LEVEL}`);

      ////

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
        return res.status(200).send({
          message: "You Already Approved/Reject this!",
          status: 200,
        });
      }

      //TODO: No body left in hierarchy
      if (
        (reqData.ACTION_CODE == 1 && nextStageLevel == null) ||
        allApproversActioned ||
        mustApprovedArray.length == 0
      ) {
        reqData.IS_REG_COMPLETE = 1;
        reqData.APPROVAL_STATUS = "APPROVED";
        reqData.STAGE_LEVEL = reqData.STAGE_LEVEL;
      }

      if (
        (reqData.ACTION_CODE == 0 && nextStageLevel == null) ||
        allApproversActioned ||
        mustApprovedArray.length == 0
      ) {
        reqData.IS_REG_COMPLETE = 0;
        reqData.APPROVAL_STATUS = "REJECTED";
        reqData.STAGE_LEVEL = reqData.STAGE_LEVEL;
      }
      console.log(`APPROVAL_STATUS= ${reqData.APPROVAL_STATUS}`);
      console.log(`STAGE_LEVEL = ${reqData.STAGE_LEVEL}`);
      //TODO: History add
      if (
        isAlreadyActioned == 0 ||
        (value.registration_stage_status == 200 &&
          (value.update_status == 200 || value.registration_status == 200))
      ) {
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

      //TODO: Again Checking Must approver
      if (mustApprovedArray.length > 0) {
        for (let i = 0; i < mustApprovedArray.length; i++) {
          let userQueryResultForCheckExist =
            await submissionModel.approveRejectSubmissionCheckExist(
              reqData.USER_ID,
              mustApprovedArray[i].STAGE_ID,
              mustApprovedArray[i].STAGE_LEVEL,
              mustApprovedArray[i].APPROVER_ID
            );

          await commonObject.makeArrayObject(userQueryResultForCheckExist);
          let rowObject = await commonObject.convertArrayToObject(
            userQueryResultForCheckExist.queryResult.finalData
          );
          isMustPersonApproved = rowObject.TOTAL;
          if (isMustPersonApproved == 1) {
            mustApproversActionedLength = mustApproversActionedLength + 1;
          }
          console.log(`isMustPersonApproved = ${isMustPersonApproved}`);
        }
      }
      //TODO: Again Checking next level
      if (mustApprovedArray.length > 0) {
        if (isMustPersonApproved == 1) {
          nextStageLevel = await findNextDifferentStageLevel(
            hierarchyListQueryResult.queryResult.finalData,
            reqData.STAGE_LEVEL
          );
          allApproversActioned = true;
        }
      } else if (isAnyoneApproved == 1) {
        nextStageLevel = await findNextDifferentStageLevel(
          hierarchyListQueryResult.queryResult.finalData,
          reqData.STAGE_LEVEL
        );
      }
      // if (mustApprovedArray.length > 0) {
      //   if (
      //     mustApprovedArrayLength.length ==
      //       mustApproversActionedLength.length &&
      //     nextStageLevel != null
      //   ) {
      //     console.log(`in this if`);
      //     allApproversActioned = true;
      //     //reqData.STAGE_LEVEL = nextStageLevel;
      //   }
      // }
      console.log(`nextStageLevel=${nextStageLevel}`);
      console.log(`allApproversActioned=${allApproversActioned}`);
      if (
        allApproversActioned &&
        mustApprovedArray.length > 0 &&
        nextStageLevel != null
      ) {
        console.log(`IN PROCESS`);
        reqData.APPROVAL_STATUS = "IN PROCESS";
      } else if (isEmpty(nextStageLevel) || mustApprovedArray.length == 0) {
        if (isAlreadyActioned == 0) {
          reqData.APPROVAL_STATUS = "APPROVED";
          reqData.STAGE_LEVEL = reqData.STAGE_LEVEL;
          nextStageLevel = reqData.STAGE_LEVEL;
          reqData.SUBMISSION_STATUS = 'DRAFT';
          console.log(`app`);
        }
      }
      //console.log(reqData.APPROVAL_STATUS);
      //console.log(`anyone=${isAlreadyActioned}`);
      console.log(`mustApprovedArray=${mustApprovedArray.length}`);
      console.log(`allApproversActioned=${allApproversActioned}`);
      //TODO: Level Update no need
      // if(nextStageLevel==null){
      //   reqData.STAGE_LEVEL = reqData.STAGE_LEVEL;
      // }
      console.log(`STAGE_LEVEL = ${reqData.STAGE_LEVEL}`);
      //TODO: For Profile Update
      if (!isEmpty(reqData.ACTION_ID) && isAlreadyActioned == 0) {
        let userQueryResultForUpdate =
          await submissionModel.approveRejectSubmissionUserTableForUpdate(
            userId,
            reqData.STAGE_ID,
            reqData.STAGE_LEVEL,
            reqData.SUBMISSION_STATUS,
            reqData.APPROVAL_STATUS
          );
        console.log(userQueryResultForUpdate);
        value.update_message = userQueryResultForUpdate.outBinds.MESSAGE;
        value.update_status = userQueryResultForUpdate.outBinds.STATUS;
      }
      //TODO: For Profile Update
      if (!isEmpty(reqData.ACTION_ID) && isAlreadyActioned == 0) {
        let userQueryResultForLog =
          await submissionModel.approveRejectSubmissionLogTable(
            reqData.ACTION_ID,
            reqData.STAGE_ID,
            reqData.STAGE_LEVEL,
            reqData.APPROVAL_STATUS
          );
        console.log(userQueryResultForLog);
        value.log_message = userQueryResultForLog.outBinds.MESSAGE;
        value.log_status = userQueryResultForLog.outBinds.STATUS;
      }
      //TODO: Update next
      if (value.registration_status == 200) {
        if (mustApprovedArray.length > 0) {
          if (allApproversActioned) {
            console.log("update is calling mut approver");
            let userQueryResultForReg =
              await submissionModel.updateNextLevelUserTableForReg(
                reqData.USER_ID,
                reqData.STAGE_ID,
                reqData.STAGE_LEVEL,
                nextStageLevel,
                reqData.IS_REG_COMPLETE,
                reqData.APPROVAL_STATUS,
                reqData.SUBMISSION_STATUS
              );
            console.log(userQueryResultForReg);
            value.registration_stage_message =
              userQueryResultForReg.outBinds.MESSAGE;
            value.registration_stage_status =
              userQueryResultForReg.outBinds.STATUS;
          }
        } else if (mustApprovedArray.length == 0 && isAlreadyActioned == 0) {
          console.log("update is calling any approver");
          let userQueryResultForReg =
            await submissionModel.updateNextLevelUserTableForReg(
              reqData.USER_ID,
              reqData.STAGE_ID,
              reqData.STAGE_LEVEL,
              nextStageLevel,
              reqData.IS_REG_COMPLETE,
              reqData.APPROVAL_STATUS,
              reqData.SUBMISSION_STATUS
            );
          console.log(userQueryResultForReg);
          value.registration_stage_message =
            userQueryResultForReg.outBinds.MESSAGE;
          value.registration_stage_status =
            userQueryResultForReg.outBinds.STATUS;
        }
      }
      

      return res.status(200).json(value);
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
