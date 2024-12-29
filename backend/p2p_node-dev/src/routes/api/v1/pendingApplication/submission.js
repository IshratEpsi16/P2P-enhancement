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
const {
  getPool,
  getGeneral,
} = require("./../../../../connections/api/v1/connection");

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
        APPROVAL_TYPE: req.body.APPROVAL_TYPE,
        SUBMISSION_STATUS: req.body.SUBMISSION_STATUS,
        APPROVAL_STATUS: req.body.APPROVAL_STATUS,
        IS_REG_COMPLETE: req.body.IS_REG_COMPLETE,
        ACTION_CODE: req.body.ACTION_CODE,
        USER_ID: req.body.SUPPLIER_ID,
        STAGE_ID: req.body.STAGE_ID,
        NOTE: req.body.NOTE,
        STAGE_LEVEL: req.body.STAGE_LEVEL,
      };

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
        return res.status(200).json(value);
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
      //TODO: Listing Stage Level
      let stageLevelArray =
        await hierarchyListQueryResult.queryResult.finalData.map(
          (item) => item.STAGE_LEVEL
        );
      console.log(`Stage Level Array =`);
      console.log(stageLevelArray);
      //let myStage = await stageLevelArray.filter((item) =>item === reqData.STAGE_ID);
      //TODO: Finding My Stage into Stage Level
      myStage = await stageLevelArray.includes(parseInt(reqData.STAGE_LEVEL));
      //console.log(reqData.STAGE_LEVEL);
      console.log(`myStage = ${myStage}`);

      let filteredArray =
        await hierarchyListQueryResult.queryResult.finalData.filter(
          (item) => item.STAGE_LEVEL === parseInt(reqData.STAGE_LEVEL)
        );
      console.log(`filtered Array of My Stage =`);
      console.log(filteredArray);
      //TODO: Finding is there any must approver in my stage
      let mustApprovedArray = filteredArray.filter(
        (item) => item.IS_MUST_APPROVE === 1
      );
      console.log(`Must Approved Array from My Stage = `);
      console.log(mustApprovedArray);
      console.log(`Me As Must Approver = `);
      let meAsMustApprover = filteredArray.filter(
        (item) => item.APPROVER_ID === userId
      );
      console.log(meAsMustApprover);
      if (
        meAsMustApprover.length > 0 &&
        mustApprovedArray.length == 1 &&
        isAlreadyActioned == 0
      ) {
        if (nextStageLevel == null) {
          if (reqData.ACTION_CODE == 1) {
            reqData.APPROVAL_STATUS = statusApproved;
            reqData.IS_REG_COMPLETE = 1;
            reqData.STAGE_LEVEL = currentStageLevel;
            nextStageLevel = currentStageLevel;
          } else if (reqData.ACTION_CODE == 0) {
            reqData.APPROVAL_STATUS = statusReject;
            reqData.IS_REG_COMPLETE = 0;
            reqData.STAGE_LEVEL = 1;
            nextStageLevel = 1;
          }
        } else if (nextStageLevel != null) {
          if (reqData.ACTION_CODE == 1) {
            reqData.APPROVAL_STATUS = statusInProcess;
            reqData.IS_REG_COMPLETE = 0;
            reqData.STAGE_LEVEL = nextStageLevel;
          } else if (reqData.ACTION_CODE == 0) {
            reqData.APPROVAL_STATUS = statusReject;
            reqData.IS_REG_COMPLETE = 0;
            reqData.STAGE_LEVEL = 1;
            nextStageLevel = 1;
          }
        }
      }

      if (
        isEmpty(meAsMustApprover) &&
        isEmpty(mustApprovedArray) &&
        nextStageLevel == null
      ) {
        if (reqData.ACTION_CODE == 1) {
          reqData.APPROVAL_STATUS = statusApproved;
          reqData.IS_REG_COMPLETE = 1;
          reqData.STAGE_LEVEL = currentStageLevel;
          nextStageLevel = currentStageLevel;
        } else if (reqData.ACTION_CODE == 0) {
          reqData.APPROVAL_STATUS = statusReject;
          reqData.IS_REG_COMPLETE = 0;
          reqData.STAGE_LEVEL = 1;
          nextStageLevel = 1;
        }
      } else if (meAsMustApprover > 0 && nextStageLevel == null) {
        if (reqData.ACTION_CODE == 1) {
          reqData.APPROVAL_STATUS = statusApproved;
          reqData.IS_REG_COMPLETE = 1;
          reqData.STAGE_LEVEL = currentStageLevel;
          nextStageLevel = currentStageLevel;
        } else if (reqData.ACTION_CODE == 0) {
          reqData.APPROVAL_STATUS = statusReject;
          reqData.IS_REG_COMPLETE = 0;
          reqData.STAGE_LEVEL = 1;
          nextStageLevel = 1;
        }
      }

      //TODO: Finding is there any must approver in my stage
      let mustApprovedArrayLength = 0;
      if (!isEmpty(mustApprovedArray)) {
        console.log(`mustApprovedArray`);
        for (let i = 0; i < mustApprovedArray.length; i++) {
          if (mustApprovedArray[i].IS_MUST_APPROVE == 1) {
            mustApprovedArrayLength = mustApprovedArrayLength + 1;
          }
        }
      }
      console.log(`mustApprovedArrayLength = ${mustApprovedArrayLength}`);

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
          console.log(`Is Must Person Approved = ${isMustPersonApproved}`);
        }
      }
      console.log(`Must Approver Approved = ${isMustPersonApproved}`);
      //TODO: Checking anyone is approved/reject or not
      if (isEmpty(mustApprovedArray)) {
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
        console.log(`Is Anyone Already Approved = ${isAnyoneApproved}`);
      }
      //mainList = hierarchyListQueryResult.queryResult.finalData;

      //TODO: All Must Approvers are approved/reject or not
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

      //TODO: Update on user table

      // if (isAlreadyActioned == 0) {
      //   let userQueryResultForReg =
      //     await submissionModel.approveRejectSubmissionUserTableForReg(
      //       reqData.USER_ID,
      //       reqData.STAGE_ID,
      //       reqData.STAGE_LEVEL,
      //       reqData.SUBMISSION_STATUS,
      //       reqData.APPROVAL_STATUS,
      //       reqData.IS_REG_COMPLETE
      //     );
      //   console.log(userQueryResultForReg);
      //   value.registration_message = userQueryResultForReg.outBinds.MESSAGE;
      //   value.registration_status = userQueryResultForReg.outBinds.STATUS;
      // }
      //TODO: History add
      // if (
      //   isAlreadyActioned == 0 ||
      //   (value.registration_stage_status == 200 &&
      //     (value.update_status == 200 || value.registration_status == 200))
      // ) {
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
      //TODO: Again Checking Must approver
      // if (mustApprovedArray.length > 0) {
      //   for (let i = 0; i < mustApprovedArray.length; i++) {
      //     let userQueryResultForCheckExist =
      //       await submissionModel.approveRejectSubmissionCheckExist(
      //         reqData.USER_ID,
      //         mustApprovedArray[i].STAGE_ID,
      //         mustApprovedArray[i].STAGE_LEVEL,
      //         mustApprovedArray[i].APPROVER_ID
      //       );

      //     await commonObject.makeArrayObject(userQueryResultForCheckExist);
      //     let rowObject = await commonObject.convertArrayToObject(
      //       userQueryResultForCheckExist.queryResult.finalData
      //     );
      //     isMustPersonApproved = rowObject.TOTAL;
      //     if (isMustPersonApproved == 1) {
      //       mustApproversActionedLength = mustApproversActionedLength + 1;
      //     }
      //     console.log(`isMustPersonApproved = ${isMustPersonApproved}`);
      //   }
      // }
      //TODO: Checking anyone is approved/reject or not
      // if (filteredArray.length > 0) {
      //   for (let i = 0; i < filteredArray.length; i++) {
      //     console.log(`Approver = ${filteredArray[i].APPROVER_ID}`);
      //     console.log(`STAGE_LEVEL = ${filteredArray[i].STAGE_LEVEL}`);

      //     let userQueryResultForCheckExist =
      //       await submissionModel.approveRejectSubmissionCheckExist(
      //         reqData.USER_ID,
      //         filteredArray[i].STAGE_ID,
      //         filteredArray[i].STAGE_LEVEL,
      //         filteredArray[i].APPROVER_ID
      //       );

      //     await commonObject.makeArrayObject(userQueryResultForCheckExist);
      //     let rowObject = await commonObject.convertArrayToObject(
      //       userQueryResultForCheckExist.queryResult.finalData
      //     );
      //     isAnyoneApproved = rowObject.TOTAL;

      //     console.log(`Is Anyone Already Approved = ${isAnyoneApproved}`);

      //     if (isAnyoneApproved === 1) {
      //       // Break the loop if anyone is already approved
      //       break;
      //     }
      //   }
      // }

      console.log(`last nextStageLevel = ${nextStageLevel}`);
      //TODO: No body left in hierarchy
      /*if (
        reqData.ACTION_CODE == 1 &&
        nextStageLevel == null &&
        allApproversActioned == true &&
        !isEmpty(mustApprovedArray)
      ) {
        console.log(`1if`);
        reqData.IS_REG_COMPLETE = 1;
        reqData.APPROVAL_STATUS = "APPROVED";
        reqData.STAGE_LEVEL = reqData.STAGE_LEVEL;
        reqData.SUBMISSION_STATUS = "DRAFT";
      } else if (
        reqData.ACTION_CODE == 1 &&
        nextStageLevel == null &&
        isAnyoneApproved == 1
      ) {
        console.log(`11if`);
        reqData.IS_REG_COMPLETE = 1;
        reqData.APPROVAL_STATUS = "APPROVED";
        reqData.STAGE_LEVEL = reqData.STAGE_LEVEL;
        reqData.SUBMISSION_STATUS = "DRAFT";
      } else if (
        reqData.ACTION_CODE == 0 && nextStageLevel == null &&
        allApproversActioned == true &&
        isEmpty(mustApprovedArray)
      ) {
        console.log(`2if`);
        reqData.IS_REG_COMPLETE = 0;
        reqData.APPROVAL_STATUS = "REJECTED";
        reqData.STAGE_LEVEL = reqData.STAGE_LEVEL;
        nextStageLevel = reqData.STAGE_LEVEL;
      } else if (
        reqData.ACTION_CODE == 1 &&
        nextStageLevel != null &&
        nextStageLevel > reqData.STAGE_LEVEL &&
        isEmpty(mustApprovedArray)
      ) {
        console.log(`3if`);
        reqData.IS_REG_COMPLETE = 0;
        reqData.APPROVAL_STATUS = "IN PROCESS";
        reqData.STAGE_LEVEL = reqData.STAGE_LEVEL;
      } else if (
        allApproversActioned == true &&
        mustApprovedArray.length > 0 &&
        nextStageLevel != null
      ) {
        console.log(`4if`);
        reqData.APPROVAL_STATUS = "IN PROCESS";
      }
      */

      // else if (isEmpty(nextStageLevel) || mustApprovedArray.length == 0) {
      //   if (isAlreadyActioned == 0) {
      //     reqData.APPROVAL_STATUS = "APPROVED";
      //     reqData.STAGE_LEVEL = reqData.STAGE_LEVEL;
      //     nextStageLevel = reqData.STAGE_LEVEL;
      //     reqData.SUBMISSION_STATUS = "DRAFT";
      //     console.log(`app`);
      //   }
      // }
      console.log(`should`);
      // Update next
      /*if (value.registration_status == 200) {
        if (mustApprovedArray.length > 0) {
          if (allApproversActioned) {
            if (isEmpty(nextStageLevel)) {
              nextStageLevel = reqData.STAGE_LEVEL;
            }

            console.log("update is calling must approver");
            console.log(reqData.APPROVAL_STATUS);
            console.log(reqData.IS_REG_COMPLETE);
            console.log(reqData.STAGE_LEVEL);
            console.log(nextStageLevel);
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
        } else if (isAnyoneApproved == 1) {
          console.log("update is calling any approver");
          console.log(reqData.APPROVAL_STATUS);
          console.log(reqData.IS_REG_COMPLETE);
          console.log(reqData.STAGE_LEVEL);
          console.log(nextStageLevel);
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
      */

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
