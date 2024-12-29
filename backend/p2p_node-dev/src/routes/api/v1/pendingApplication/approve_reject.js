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
const csApprovalModel = require("../../../../models/api/v1/csCreation/csApproval");
const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const logger = require("../../../../common/api/v1/logger");
const axios = require("axios");

router.post(
  `/approve-reject`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    try {
      let token = req.headers.authorization;
      token = req.headers.authorization.split(" ")[1];
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
        INITIATOR: req.body.INITIATOR,
      };
      console.log(reqData);

      if (isEmpty(reqData.STAGE_ID) && reqData.INITIATOR == "N")
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

      //TODO: If Initiator then inserting approve history.
      if (reqData.INITIATOR == "Y") {
        insertHistory.STAGE_ID = reqData.STAGE_ID;
        insertHistory.STAGE_LEVEL = reqData.STAGE_LEVEL;
        insertHistory.ACTION_CODE = reqData.ACTION_CODE;
        insertHistory.OBJECT_ID = reqData.USER_ID;
        insertHistory.OBJECT_TYPE_CODE = "ISR";
        insertHistory.APPROVER_ID = userId;
        insertHistory.CREATED_BY = userId;
        insertHistory.NOTE = reqData.NOTE;
        insertHistory.USER_ID = reqData.USER_ID;

        let userQueryResultForHistory = await csApprovalModel.insertHistory(
          insertHistory
        );

        // let userQueryResultForHistory =
        //   await submissionModel.approveRejectSubmissionHistory(
        //     userId,
        //     reqData.ACTION_CODE,
        //     reqData.USER_ID,
        //     reqData.STAGE_ID,
        //     reqData.NOTE,
        //     reqData.STAGE_LEVEL
        //   );
        if (userQueryResultForHistory.rowsAffected > 0) {
          value.history_message = "History Inserted";
          value.history_status = 200;
        }

        if (
          reqData.ACTION_CODE == 0
        ) {
          let userQueryResultForReg =
            await submissionModel.approveRejectSubmissionUserTableForReg(
              reqData.USER_ID,
              reqData.STAGE_ID,
              1,
              "DRAFT",
              'REJECTED',
              0
            );
          console.log(userQueryResultForReg);
        }

        reqData.ACTION_CODE == 0
          ? value.registration_message =  "Application Rejected Successfully"
          : value.registration_message = "Application Approved Successfully";

        return res.status(value.registration_status).json(value);
      } else {
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

        // if (isAlreadyActioned == 1) {
        //   let connectionP2pORACLE = await getPool();
        //   await connectionP2pORACLE.close();
        //   return res.status(400).send({
        //     message: "You Already Approved/Reject this!",
        //     status: 400,
        //   });
        // }

        //TODO: If rejected
        if (
          reqData.ACTION_CODE == 0
        ) {
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
            insertHistory.STAGE_ID = reqData.STAGE_ID;
            insertHistory.STAGE_LEVEL = reqData.STAGE_LEVEL;
            insertHistory.ACTION_CODE = reqData.ACTION_CODE;
            insertHistory.OBJECT_ID = reqData.USER_ID;
            insertHistory.OBJECT_TYPE_CODE = "SR";
            insertHistory.APPROVER_ID = userId;
            insertHistory.CREATED_BY = userId;
            insertHistory.NOTE = reqData.NOTE;
            insertHistory.USER_ID = reqData.USER_ID;

            let userQueryResultForHistory = await csApprovalModel.insertHistory(
              insertHistory
            );

            // let userQueryResultForHistory =
            //   await submissionModel.approveRejectSubmissionHistory(
            //     userId,
            //     reqData.ACTION_CODE,
            //     reqData.USER_ID,
            //     reqData.STAGE_ID,
            //     reqData.NOTE,
            //     reqData.STAGE_LEVEL
            //   );
            console.log(userQueryResultForHistory);
            if (userQueryResultForHistory.rowsAffected > 0) {
              value.history_message = "History Inserted";
              value.history_status = 200;
            }
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
          'Supplier Approval'
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

        //if (isAlreadyActioned == 0) {
        if (nextStageLevel == null) {
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
          if (value.registration_status == 200) {
            insertHistory.STAGE_ID = reqData.STAGE_ID;
            insertHistory.STAGE_LEVEL = reqData.STAGE_LEVEL;
            insertHistory.ACTION_CODE = reqData.ACTION_CODE;
            insertHistory.OBJECT_ID = reqData.USER_ID;
            insertHistory.OBJECT_TYPE_CODE = "SR";
            insertHistory.APPROVER_ID = userId;
            insertHistory.CREATED_BY = userId;
            insertHistory.NOTE = reqData.NOTE;
            insertHistory.USER_ID = reqData.USER_ID;

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
            console.log(userQueryResultForHistory);
            // value.history_message =
            //   userQueryResultForHistory.outBinds.MESSAGE;
            // value.history_status = userQueryResultForHistory.outBinds.STATUS;
          }
          if (
            value.registration_status == 200 &&
            value.history_status == 200 &&
            reqData.ACTION_CODE == 1
          ) {
            let userQuery = await submissionModel.supplierSyncProcess();
            console.log(`Submission`);
            console.log(userQuery);
            console.log(userQuery.outBinds.MESSAGE);
            if (userQuery.outBinds.MESSAGE == "Supplier created successfully") {
              let queryResult = await submissionModel.getSupplierInfo(
                reqData.USER_ID
              );
              console.log(queryResult);
              await commonObject.makeArrayObject(queryResult);
              let rowObject = await commonObject.convertArrayToObject(
                queryResult.queryResult.finalData
              );

              if (
                !isEmpty(rowObject.SUPPLIER_ID) &&
                !isEmpty(rowObject.VENDOR_ID) &&
                rowObject.IS_REG_COMPLETE == 1
              ) {
                // Define the request headers with the token
                const headers = {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json", // Adjust the content type if needed
                };
                let body = `Dear ${rowObject.ORGANIZATION_NAME},<br><br>
            We are thrilled to welcome you to the SSGIL family! It is an honor to have you as our esteemed partner, 
            and we are excited about the opportunities that lie ahead for both our organizations.<br><br>
            At SSGIL, we pride ourselves on fostering strong, collaborative relationships with our partners. 
            Your decision to join us is a testament to the potential for mutual growth and success that we both see in this partnership. 
            We are committed to ensuring that our collaboration is productive, efficient, and rewarding.<br><br>
            As we embark on this journey together, please feel free to reach out to us with any questions, suggestions, or concerns. 
            Our dedicated team is here to support you every step of the way, ensuring a seamless and positive experience.<br><br>
            We look forward to working closely with you and achieving great things together.<br><br>`;

                // Define the payload data
                const payloadAxios = {
                  EMAIL_TO: [rowObject.EMAIL_ADDRESS],
                  EMAIL_SUBJECT:
                    "Welcome to SSGIL – Let's Build a Prosperous Partnership Together!",
                  EMAIL_BODY: body,
                };

                // Make a POST request to another endpoint with payload data
                const response = await axios.post(
                  "http://localhost:3000/api/v1/common/common-email",
                  payloadAxios,
                  { headers }
                );
                console.log(response.data);
              }
            }
          }
          return res.status(200).json(value);
        }
        if (nextStageLevel != null) {
          let userQueryResultForReg =
            await submissionModel.approveRejectSubmissionUserTableForReg(
              reqData.USER_ID,
              reqData.STAGE_ID,
              nextStageLevel,
              reqData.SUBMISSION_STATUS,
              reqData.ACTION_CODE == 1 ? statusInProcess : statusApproved,
              reqData.IS_REG_COMPLETE
            );
          //console.log(`result = ${userQueryResultForReg}`);
          value.registration_message = userQueryResultForReg.outBinds.MESSAGE;
          value.registration_status = userQueryResultForReg.outBinds.STATUS;
          if (value.registration_status == 200) {
            insertHistory.STAGE_ID = reqData.STAGE_ID;
            insertHistory.STAGE_LEVEL = reqData.STAGE_LEVEL;
            insertHistory.ACTION_CODE = reqData.ACTION_CODE;
            insertHistory.OBJECT_ID = reqData.USER_ID;
            insertHistory.OBJECT_TYPE_CODE = "SR";
            insertHistory.APPROVER_ID = userId;
            insertHistory.CREATED_BY = userId;
            insertHistory.NOTE = reqData.NOTE;
            insertHistory.USER_ID = reqData.USER_ID;

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
            console.log(userQueryResultForHistory);
            // value.history_message =
            //   userQueryResultForHistory.outBinds.MESSAGE;
            // value.history_status = userQueryResultForHistory.outBinds.STATUS;
          }
          return res.status(value.registration_status).json(value);
        }
        //}
      }
    } catch (error) {
      logger.error(
        `approve_reject.js -> Supplier Registration Approval Approve-Reject: ${error}`
      );
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
