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
const axios = require("axios");
const createPO = require("../../../../common/api/v1/createPO");
const logger = require("./../../../../../src/common/api/v1/logger"); // Import the logger

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
      let statusCancel = "CANCEL";
      let updateData = {};
      let whereData = {};
      let insertHistory = {};
      let poList = [];

      let value = {
        update_status: 400,
        history_status: 400,
        update_message: "",
        history_message: "",
      };
      userId = req.user ? req.user.USER_ID : null;

      let reqData = {
        CS_ID: req.body.CS_ID,
        ACTION_CODE: req.body.ACTION_CODE,
        STAGE_ID: req.body.STAGE_ID,
        STAGE_LEVEL: req.body.STAGE_LEVEL,
        NOTE: req.body.NOTE,
      };

      if (isEmpty(reqData.CS_ID))
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Please Give CS ID.",
        });

      if (isEmpty(reqData.STAGE_ID))
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Please Give Stage ID.",
        });

      if (isEmpty(reqData.STAGE_LEVEL))
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Please Give Stage Level.",
        });
      if (isEmpty(reqData.ACTION_CODE))
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Please Give Action Code.",
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

      Object.entries(reqData).forEach(([key, value]) => {
        if (value && key == "CS_ID") {
          whereData[key] = value;
        }
      });

      // Object.entries(reqData).forEach(([key, value]) => {
      //   if (
      //     value &&
      //     key == "CS_STATUS"
      //   ) {
      //     updateData[key] = value;
      //   }
      // });
      if (reqData.ACTION_CODE == 0) {
        updateData.CS_STATUS = statusReject;
        updateData.TEMPLATE_ID = reqData.STAGE_ID;
        updateData.TEMPLATE_STAGE_LEVEL = reqData.STAGE_LEVEL;
        updateData.LAST_UPDATED_BY = userId;
      }

      //TODO: If rejected
      if (reqData.ACTION_CODE === 0) {
        let csHeaderResult = await csApprovalModel.csHeaderUpdate(
          updateData,
          whereData
        );
        //console.log(csHeaderResult);
        if (csHeaderResult.rowsAffected > 0) {
          insertHistory.STAGE_ID = reqData.STAGE_ID;
          insertHistory.STAGE_LEVEL = reqData.STAGE_LEVEL;
          insertHistory.ACTION_CODE = 0;
          insertHistory.OBJECT_ID = reqData.CS_ID;
          insertHistory.OBJECT_TYPE_CODE = "CS";
          insertHistory.APPROVER_ID = userId;
          insertHistory.CREATED_BY = userId;
          insertHistory.USER_ID = userId;
          insertHistory.NOTE = reqData.NOTE;
          //insertHistory.LAST_UPDATED_BY = userId;
          //insertHistory.LAST_UPDATED_DATE = new Date();

          let queryResultForHistory = await csApprovalModel.insertHistory(
            insertHistory
          );
          console.log(queryResultForHistory);
          if (queryResultForHistory.rowsAffected > 0) {
            value.history_message = "History Inserted.";
            value.history_status = 200;
          }
          //console.log(queryResultForHistory.outBinds[0][0]);
        }
        value.update_message = "CS Rejected Successfully.";
        value.update_status = 200;

        return res.status(value.update_status).json(value);
      }

      //TODO: If Canceled
      if (reqData.ACTION_CODE === 2) {
        updateData.CS_STATUS = statusCancel;
        updateData.TEMPLATE_ID = reqData.STAGE_ID;
        updateData.TEMPLATE_STAGE_LEVEL = reqData.STAGE_LEVEL;
        updateData.LAST_UPDATED_BY = userId;

        //Update CS Header Table
        let csHeaderResult = await csApprovalModel.csHeaderUpdate(
          updateData,
          whereData
        );
        //console.log(csHeaderResult);
        if (csHeaderResult.rowsAffected > 0) {
          insertHistory.STAGE_ID = reqData.STAGE_ID;
          insertHistory.STAGE_LEVEL = reqData.STAGE_LEVEL;
          insertHistory.ACTION_CODE = 0;
          insertHistory.OBJECT_ID = reqData.CS_ID;
          insertHistory.OBJECT_TYPE_CODE = "CS";
          insertHistory.APPROVER_ID = userId;
          insertHistory.CREATED_BY = userId;
          insertHistory.USER_ID = userId;
          insertHistory.NOTE = reqData.NOTE;
          //insertHistory.LAST_UPDATED_BY = userId;
          //insertHistory.LAST_UPDATED_DATE = new Date();

          let queryResultForHistory = await csApprovalModel.insertHistory(
            insertHistory
          );
          console.log(queryResultForHistory);
          if (queryResultForHistory.rowsAffected > 0) {
            value.history_message = "History Inserted.";
            value.history_status = 200;
          }
          //console.log(queryResultForHistory.outBinds[0][0]);
        }
        value.update_message = "CS Rejected Successfully.";
        value.update_status = 200;

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
        "CS Approval"
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

      //isAlreadyActioned == 0;

      if (nextStageLevel == null) {
        if (reqData.ACTION_CODE == 0) {
          updateData.CS_STATUS = statusReject;
          updateData.TEMPLATE_ID = reqData.STAGE_ID;
          updateData.TEMPLATE_STAGE_LEVEL = reqData.STAGE_LEVEL;
          updateData.LAST_UPDATED_BY = userId;
          insertHistory.NOTE = reqData.NOTE;
        }
        if (reqData.ACTION_CODE == 1) {
          updateData.CS_STATUS = statusApproved;
          updateData.TEMPLATE_ID = reqData.STAGE_ID;
          updateData.TEMPLATE_STAGE_LEVEL = reqData.STAGE_LEVEL;
          updateData.LAST_UPDATED_BY = userId;
          insertHistory.NOTE = reqData.NOTE;
        }
        //TODO On CS Header Table
        let csHeaderResult = await csApprovalModel.csHeaderUpdate(
          updateData,
          whereData
        );
        console.log(csHeaderResult);
        //   //TODO On History Table
        if (csHeaderResult.rowsAffected > 0) {
          insertHistory.STAGE_ID = reqData.STAGE_ID;
          insertHistory.STAGE_LEVEL = reqData.STAGE_LEVEL;
          insertHistory.ACTION_CODE = reqData.ACTION_CODE;
          insertHistory.OBJECT_ID = reqData.CS_ID;
          insertHistory.OBJECT_TYPE_CODE = "CS";
          insertHistory.APPROVER_ID = userId;
          insertHistory.CREATED_BY = userId;
          insertHistory.NOTE = reqData.NOTE;

          let queryResultForHistory = await csApprovalModel.insertHistory(
            insertHistory
          );
          console.log(queryResultForHistory);
          value.history_message = "History Inserted.";
          value.history_status = 200;
        }
        if (
          csHeaderResult.rowsAffected > 0 &&
          updateData.CS_STATUS == statusApproved &&
          reqData.ACTION_CODE == 1
        ) {
       /*   let poHeaderList = [];
          let poCreateResult = await csApprovalModel.poCreate(reqData.CS_ID);
          console.log(poCreateResult);
          console.log(poCreateResult.outBinds.MESSAGE);
          poHeaderList.push(poCreateResult.outBinds.MESSAGE);
          //console.log(poHeaderList);
          if (
            isEmpty(poCreateResult.outBinds.MESSAGE) ||
            poCreateResult.outBinds.MESSAGE === undefined
          ) {
            logger.info(error);
            logger.error(error);
          }*/
          let poDetailsResult = await csApprovalModel.poDetails(reqData.CS_ID);
          await commonObject.makeArrayObject(poDetailsResult);
          console.log("RFQ: ", poDetailsResult.queryResult.finalData);
          // Filter out empty objects
          let filteredData = poDetailsResult.queryResult.finalData.filter((obj) =>
            Object.values(obj).some((value) => value !== "")
          );
          console.log("RFQ: ", filteredData);
          // RFQ Details for PO
          let rfqHeaderDetailsResult = await csApprovalModel.rfqHeaderDetails(
            filteredData[0].RFQ_ID
          );
          await commonObject.makeArrayObject(rfqHeaderDetailsResult);
          let rfqHeaderDetailsObject = await commonObject.convertArrayToObject(
            rfqHeaderDetailsResult.queryResult.finalData
          );
          //console.log("RFQ Header Details: ", rfqHeaderDetailsObject);

          //Email Preparation
          const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Adjust the content type if needed
          };
          const bodyDetails = `<br><br>
          I am pleased to inform you that your company has been awarded a new Purchase Order (PO) with our organization. Congratulations on this achievement!

          We look forward to continuing our successful partnership and are confident in your ability to deliver as always.

          Please feel free to reach out if you have any questions regarding the PO.<br><br>`;

          for (const item of filteredData) {
            rfqHeaderDetailsObject.PO_NUMBER = item.PO_NUMBER;
            rfqHeaderDetailsObject.ORGANIZATION_NAME = item.ORGANIZATION_NAME;
            rfqHeaderDetailsObject.SITE_ADDRESS = item.SITE_ADDRESS;

            let rfqItemDetailsResult = await csApprovalModel.rfqItemDetails(
              reqData.CS_ID,
              item.PO_NUMBER
            );
            await commonObject.makeArrayObject(rfqItemDetailsResult);

            if (!isEmpty(rfqHeaderDetailsObject)) {
              let pdf = await createPO.createInvoiceTable2(
                rfqHeaderDetailsObject,
                rfqItemDetailsResult.queryResult.finalData
              );
            }

            //console.log("item: ", item);

            let body = `Dear ${item.ORGANIZATION_NAME},${bodyDetails}`;
            // Define the payload data
            let email = "";
            if (isEmpty(item.EMAIL_ADDRESS)) email = item.ADDITIONAL_EMAIL;
            else email = item.EMAIL_ADDRESS;

            const payloadAxios = {
              EMAIL_TO: [email],
              EMAIL_SUBJECT:
                "Congratulations on Being Awarded the New Purchase Order",
              EMAIL_BODY: body,
              PO_NUMBER: item.PO_NUMBER,
            };
            console.log("email: ", email);

            // Make a POST request to another endpoint with payload data
            if (!isEmpty(email)) {
              const response = await axios.post(
                "http://localhost:3000/api/v1/common/send-po",
                payloadAxios,
                { headers }
              );
            }
          }

          ///console.log(poList);
        }

        value.update_message = "Information Updated Successfully";
        value.update_status = 200;
        return res.status(value.update_status).json(value);
      }
      //! If more approver
      if (nextStageLevel != null) {
        //TODO On CS Header table
        if (reqData.ACTION_CODE == 0) {
          updateData.CS_STATUS = statusReject;
          updateData.TEMPLATE_ID = reqData.STAGE_ID;
          updateData.TEMPLATE_STAGE_LEVEL = reqData.STAGE_LEVEL;
          updateData.LAST_UPDATED_BY = userId;
          insertHistory.NOTE = reqData.NOTE;
        }
        if (reqData.ACTION_CODE == 1) {
          updateData.CS_STATUS = statusInProcess;
          updateData.TEMPLATE_ID = reqData.STAGE_ID;
          updateData.TEMPLATE_STAGE_LEVEL = nextStageLevel;
          updateData.LAST_UPDATED_BY = userId;
          insertHistory.NOTE = reqData.NOTE;
        }
        //TODO On CS Header Table
        let csHeaderResult = await csApprovalModel.csHeaderUpdate(
          updateData,
          whereData
        );
        console.log(csHeaderResult);

        //   //TODO On History Table
        if (csHeaderResult.rowsAffected > 0) {
          insertHistory.STAGE_ID = reqData.STAGE_ID;
          insertHistory.STAGE_LEVEL = reqData.STAGE_LEVEL;
          insertHistory.ACTION_CODE = reqData.ACTION_CODE;
          insertHistory.OBJECT_ID = reqData.CS_ID;
          insertHistory.OBJECT_TYPE_CODE = "CS";
          insertHistory.APPROVER_ID = userId;
          insertHistory.CREATED_BY = userId;
          insertHistory.NOTE = reqData.NOTE;

          let queryResultForHistory = await csApprovalModel.insertHistory(
            insertHistory
          );
          console.log(queryResultForHistory);
          value.history_message = "History Inserted.";
          value.history_status = 200;
        }

        value.update_message = "Information Updated Successfully";
        value.update_status = 200;
        return res.status(value.update_status).json(value);
      }
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

router.get(
  `/approver-list`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    try {
      let finalData = {};
      let value = {
        message: `CS Approver List`,
        status: 200,
        data: [],
      };
      //userId = req.user ? req.user.USER_ID : null;
      let reqData = {
        RFQ_ID: req.body.RFQ_ID,
      };
      if (isEmpty(reqData.RFQ_ID)) {
        return res
          .status(400)
          .send({ message: "Please Give RFQ ID", status: 400 });
      }
      finalData.RFQ_ID = reqData.RFQ_ID;

      // Total Count
      // let queryResultTotal = await csModel.rfiTotal(
      //   reqData.RFQ_ID
      // );
      // await commonObject.makeArrayObject(queryResultTotal);
      // let rowObject = await commonObject.convertArrayToObject(
      //   queryResultTotal.queryResult.finalData
      // );
      //value.total = rowObject.TOTAL;
      // List
      let queryResultList = await csModel.itemList(finalData);
      await commonObject.makeArrayObject(queryResultList);
      value.data = queryResultList.queryResult.finalData;
      value.total = queryResultList.queryResult.finalData.length;
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
