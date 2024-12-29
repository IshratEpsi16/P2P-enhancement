const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const submissionModel = require("../../../../models/api/v1/pendingApplication/approveRejectProfileNewInfo");
const profilePendingModel = require("../../../../models/api/v1/pendingApplication/pendingProfileUpdate");
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
const isEmpty = require("is-empty");
const logger = require("../../../../common/api/v1/logger");

router.post(
  `/approve-reject`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    try {
      let finalData = {};
      let whereUserData = {};
      let updateUserData = {};
      let whereDetailsData = {};
      let updateDetailsData = {};
      let whereInfoLogData = {};
      let updateInfoLogData = {};
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
      let activeStatus = "ACTIVE";
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
        ACTION_CODE: req.body.ACTION_CODE,
        USER_ID: req.body.SUPPLIER_ID,
        STAGE_ID: req.body.STAGE_ID,
        STAGE_LEVEL: req.body.STAGE_LEVEL,
        ACTION_ID: req.body.ACTION_ID,
        ID: req.body.ID,
        TABLE_NAME: req.body.TABLE_NAME,
        NOTE: req.body.NOTE,
        PROFILE_NEW_INFO_UID: req.body.PROFILE_NEW_INFO_UID,
        IS_INITIATOR: req.body.IS_INITIATOR,
      };
      console.log(reqData);

      if (isEmpty(reqData.ID))
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Please Give ID/PK Column.",
        });
      if (isEmpty(reqData.PROFILE_NEW_INFO_UID))
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Please Give UID.",
        });

      if (
        reqData.ACTION_CODE === undefined ||
        reqData.ACTION_CODE === "" ||
        reqData.ACTION_CODE === null
      )
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Please Give Action Code.",
        });

      if (isEmpty(reqData.USER_ID))
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Please Give Supplier ID.",
        });
      if (isEmpty(reqData.TABLE_NAME))
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Please Table Name.",
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

      Object.entries(reqData).forEach(([key, value]) => {
        if (value && key == "USER_ID") {
          whereUserData[key] = value;
        }
      });
      // Object.entries(reqData).forEach(([key, value]) => {
      //   if (value && key == "ID" && value && key == "USER_ID") {
      //     whereDetailsData[key] = value;
      //   }
      // });
      whereDetailsData.ID = reqData.ID;
      //whereDetailsData.USER_ID = reqData.USER_ID;
      updateUserData.LAST_UPDATED_BY = userId;

      // Object.entries(reqData).forEach(([key, value]) => {
      //   if (value && key !== "USER_ID" && value && key !== "ITEMS") {
      //     updateData[key] = value;
      //   }
      // });

      //! If Initiator
      if (reqData.IS_INITIATOR === "Y") {
        //TODO: If rejected
        if (reqData.ACTION_CODE == 0) {
          updateUserData.NEW_INFO_TEMPLATE_ID = reqData.STAGE_ID;
          updateUserData.NEW_INFO_STAGE_LEVEL = 1;
          updateUserData.NEW_INFO_STATUS = "DRAFT";
          updateUserData.NEW_INFO_INITIATOR_STATUS = statusReject;

          //!Info Log Table
          updateInfoLogData.APPROVER_STATUS = statusReject;
          updateInfoLogData.TEMPLATE_ID = reqData.STAGE_ID;
          updateInfoLogData.TEMPLATE_STAGE_LEVEL = reqData.STAGE_LEVEL;
          whereInfoLogData.ACTION_ID = reqData.ACTION_ID;

          //! Update In User Table
          let userQueryResultForReg = await submissionModel.userTableUpdate(
            updateUserData,
            whereUserData
          );

          console.log(userQueryResultForReg);

          if (userQueryResultForReg.rowsAffected > 0) {
            value.update_message = "User Table Updated";
            value.update_status = 200;
            insertHistory.STAGE_ID = reqData.STAGE_ID;
            insertHistory.STAGE_LEVEL = reqData.STAGE_LEVEL;
            insertHistory.ACTION_CODE = reqData.ACTION_CODE;
            insertHistory.OBJECT_ID = reqData.USER_ID;
            insertHistory.OBJECT_TYPE_CODE = "PUN"; //Profile Update New
            insertHistory.APPROVER_ID = userId;
            insertHistory.CREATED_BY = userId;
            insertHistory.NOTE = reqData.NOTE;
            insertHistory.USER_ID = reqData.USER_ID;
            if (!isEmpty(reqData.PROFILE_NEW_INFO_UID)) {
              insertHistory.PROFILE_UPDATE_UID = reqData.PROFILE_NEW_INFO_UID;
            }

            let userQueryResultForHistory = await csApprovalModel.insertHistory(
              insertHistory
            );
            //XXP2P_SUPPLIER_BANK,XXP2P_SUPPLIER_SITE,XXP2P_SUPPLIER_CONTACT_PERSON_DTLS
            if (userQueryResultForHistory.rowsAffected > 0) {
              value.history_message = "History Inserted";
              value.history_status = 200;
              updateDetailsData.ACTIVE_STATUS = statusReject;

              let detailsTableQuery = await submissionModel.detailsTableUpdate(
                reqData.TABLE_NAME,
                updateDetailsData,
                whereDetailsData
              );

              //!Update On Info Log
              let infoLogTableQuery = await submissionModel.infoLogTableUpdate(
                updateInfoLogData,
                whereInfoLogData
              );

              console.log(detailsTableQuery);
              if (detailsTableQuery.rowsAffected > 0) {
                value.log_message = "Rejected Successfully.";
                value.log_status = 200;
              }
            }
          }
          return res.status(value.update_status).json(value);
        }

        //TODO: If Approved
        if (reqData.ACTION_CODE === 1) {
          updateUserData.NEW_INFO_TEMPLATE_ID = reqData.STAGE_ID;
          updateUserData.NEW_INFO_STAGE_LEVEL = 1;
          updateUserData.NEW_INFO_STATUS = statusInProcess;
          updateUserData.NEW_INFO_INITIATOR_STATUS = statusApproved;

          //!Info Log Table
          updateInfoLogData.APPROVER_STATUS = statusReject;
          updateInfoLogData.TEMPLATE_ID = reqData.STAGE_ID;
          updateInfoLogData.TEMPLATE_STAGE_LEVEL = reqData.STAGE_LEVEL;
          whereInfoLogData.ACTION_ID = reqData.ACTION_ID;

          //! Update In User Table
          let userQueryResultForReg = await submissionModel.userTableUpdate(
            updateUserData,
            whereUserData
          );

          console.log(userQueryResultForReg);

          if (userQueryResultForReg.rowsAffected > 0) {
            value.update_message = "User Table Updated";
            value.update_status = 200;
            insertHistory.STAGE_ID = reqData.STAGE_ID;
            insertHistory.STAGE_LEVEL = reqData.STAGE_LEVEL;
            insertHistory.ACTION_CODE = reqData.ACTION_CODE;
            insertHistory.OBJECT_ID = reqData.USER_ID;
            insertHistory.OBJECT_TYPE_CODE = "PUN"; //Profile Update New
            insertHistory.APPROVER_ID = userId;
            insertHistory.CREATED_BY = userId;
            insertHistory.NOTE = reqData.NOTE;
            insertHistory.USER_ID = reqData.USER_ID;
            if (!isEmpty(reqData.PROFILE_NEW_INFO_UID)) {
              insertHistory.PROFILE_UPDATE_UID = reqData.PROFILE_NEW_INFO_UID;
            }

            let userQueryResultForHistory = await csApprovalModel.insertHistory(
              insertHistory
            );
            if (userQueryResultForHistory.rowsAffected > 0) {
              value.log_message = "Approved Successfully.";
              value.log_status = 200;
              return res.status(value.update_status).json(value);
            }
          } else value.log_message = "Something went wrong. Please try again.";
          value.log_status = 400;
          return res.status(value.update_status).json(value);
        }
      }

      //TODO: If rejected
      if (reqData.ACTION_CODE == 0 && reqData.IS_INITIATOR === "N") {
        updateUserData.NEW_INFO_TEMPLATE_ID = reqData.STAGE_ID;
        updateUserData.NEW_INFO_STAGE_LEVEL = 1;
        updateUserData.NEW_INFO_STATUS = statusReject;

        //!Info Log Table
        updateInfoLogData.APPROVER_STATUS = statusReject;
        updateInfoLogData.TEMPLATE_ID = reqData.STAGE_ID;
        updateInfoLogData.TEMPLATE_STAGE_LEVEL = reqData.STAGE_LEVEL;
        whereInfoLogData.ACTION_ID = reqData.ACTION_ID;

        //! Update In User Table
        let userQueryResultForReg = await submissionModel.userTableUpdate(
          updateUserData,
          whereUserData
        );

        console.log(userQueryResultForReg);

        if (userQueryResultForReg.rowsAffected > 0) {
          value.update_message = "User Table Updated";
          value.update_status = 200;
          insertHistory.STAGE_ID = reqData.STAGE_ID;
          insertHistory.STAGE_LEVEL = reqData.STAGE_LEVEL;
          insertHistory.ACTION_CODE = reqData.ACTION_CODE;
          insertHistory.OBJECT_ID = reqData.USER_ID;
          insertHistory.OBJECT_TYPE_CODE = "PUN"; //Profile Update New
          insertHistory.APPROVER_ID = userId;
          insertHistory.CREATED_BY = userId;
          insertHistory.NOTE = reqData.NOTE;
          insertHistory.USER_ID = reqData.USER_ID;
          if (!isEmpty(reqData.PROFILE_NEW_INFO_UID)) {
            insertHistory.PROFILE_UPDATE_UID = reqData.PROFILE_NEW_INFO_UID;
          }

          let userQueryResultForHistory = await csApprovalModel.insertHistory(
            insertHistory
          );
          //XXP2P_SUPPLIER_BANK,XXP2P_SUPPLIER_SITE,XXP2P_SUPPLIER_CONTACT_PERSON_DTLS
          if (userQueryResultForHistory.rowsAffected > 0) {
            value.history_message = "History Inserted";
            value.history_status = 200;
            updateDetailsData.ACTIVE_STATUS = statusReject;

            let detailsTableQuery = await submissionModel.detailsTableUpdate(
              reqData.TABLE_NAME,
              updateDetailsData,
              whereDetailsData
            );

            //!Update On Info Log
            let infoLogTableQuery = await submissionModel.infoLogTableUpdate(
              updateInfoLogData,
              whereInfoLogData
            );

            console.log(detailsTableQuery);
            if (detailsTableQuery.rowsAffected > 0) {
              value.log_message = "Information Updated Successfully.";
              value.log_status = 200;
            }
          }
        }
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
        userId,
        "Profile Update"
        //templateName
      );
      await commonObject.makeArrayObject(hierarchyListQueryResult);
      // console.log(`hierarchyList =`);
      console.log(hierarchyListQueryResult);
      //TODO: Finding next stage from my stage
      if (hierarchyListQueryResult.queryResult.finalData.length > 0) {
        nextStageLevel = await findNextDifferentStageLevel(
          hierarchyListQueryResult.queryResult.finalData,
          reqData.STAGE_LEVEL
        );
      }
      console.log(`nextStageLevel = ${nextStageLevel}`);
      console.log(`shifat`);

      //TODO: Update on user table

      //if (isAlreadyActioned == 0) {
      if (nextStageLevel == null && reqData.IS_INITIATOR === "N") {
        updateUserData.NEW_INFO_TEMPLATE_ID = reqData.STAGE_ID;
        updateUserData.NEW_INFO_STAGE_LEVEL = 1;

        updateUserData.NEW_INFO_STATUS =
          reqData.ACTION_CODE == 1 ? statusApproved : statusInProcess;

        //!Info Log Table
        updateInfoLogData.APPROVER_STATUS =
          reqData.ACTION_CODE == 1 ? statusApproved : statusInProcess;
        updateInfoLogData.TEMPLATE_ID = reqData.STAGE_ID;
        updateInfoLogData.TEMPLATE_STAGE_LEVEL = reqData.STAGE_LEVEL;
        whereInfoLogData.ACTION_ID = reqData.ACTION_ID;

        //! Update In User Table
        let userQueryResultForReg = await submissionModel.userTableUpdate(
          updateUserData,
          whereUserData
        );

        console.log(userQueryResultForReg);

        if (userQueryResultForReg.rowsAffected > 0) {
          value.update_message = "User Table Updated";
          value.update_status = 200;
          insertHistory.STAGE_ID = reqData.STAGE_ID;
          insertHistory.STAGE_LEVEL = reqData.STAGE_LEVEL;
          insertHistory.ACTION_CODE = reqData.ACTION_CODE;
          insertHistory.OBJECT_ID = reqData.USER_ID;
          insertHistory.OBJECT_TYPE_CODE = "PUN"; //Profile Update New
          insertHistory.APPROVER_ID = userId;
          insertHistory.CREATED_BY = userId;
          insertHistory.NOTE = reqData.NOTE;
          insertHistory.USER_ID = reqData.USER_ID;
          if (!isEmpty(reqData.PROFILE_NEW_INFO_UID)) {
            insertHistory.PROFILE_UPDATE_UID = reqData.PROFILE_NEW_INFO_UID;
          }

          let userQueryResultForHistory = await csApprovalModel.insertHistory(
            insertHistory
          );
          //XXP2P_SUPPLIER_BANK,XXP2P_SUPPLIER_SITE,XXP2P_SUPPLIER_CONTACT_PERSON_DTLS
          if (userQueryResultForHistory.rowsAffected > 0) {
            value.history_message = "History Inserted";
            value.history_status = 200;
            updateDetailsData.ACTIVE_STATUS =
              reqData.ACTION_CODE == 1 ? activeStatus : statusInProcess;

            let detailsTableQuery = await submissionModel.detailsTableUpdate(
              reqData.TABLE_NAME,
              updateDetailsData,
              whereDetailsData
            );
            //!Update On Info Log
            let infoLogTableQuery = await submissionModel.infoLogTableUpdate(
              updateInfoLogData,
              whereInfoLogData
            );

            console.log(detailsTableQuery);
            if (detailsTableQuery.rowsAffected > 0) {
              value.log_message = "Information Updated Successfully.";
              value.log_status = 200;
            }
          }
        }
        return res.status(value.update_status).json(value);
      }
      //! If more approver
      if (nextStageLevel != null && reqData.IS_INITIATOR === "N") {
        updateUserData.NEW_INFO_TEMPLATE_ID = reqData.STAGE_ID;
        updateUserData.NEW_INFO_STAGE_LEVEL = nextStageLevel;

        updateUserData.NEW_INFO_STATUS =
          reqData.ACTION_CODE == 1 ? statusInProcess : statusReject;

        //!Info Log Table
        updateInfoLogData.APPROVER_STATUS =
          reqData.ACTION_CODE == 1 ? statusInProcess : statusReject;
        updateInfoLogData.TEMPLATE_ID = reqData.STAGE_ID;
        updateInfoLogData.TEMPLATE_STAGE_LEVEL = nextStageLevel;
        whereInfoLogData.ACTION_ID = reqData.ACTION_ID;

        //! Update In User Table
        let userQueryResultForReg = await submissionModel.userTableUpdate(
          updateUserData,
          whereUserData
        );

        console.log(userQueryResultForReg);

        if (userQueryResultForReg.rowsAffected > 0) {
          value.update_message = "User Table Updated";
          value.update_status = 200;
          insertHistory.STAGE_ID = reqData.STAGE_ID;
          insertHistory.STAGE_LEVEL = reqData.STAGE_LEVEL;
          insertHistory.ACTION_CODE = reqData.ACTION_CODE;
          insertHistory.OBJECT_ID = reqData.USER_ID;
          insertHistory.OBJECT_TYPE_CODE = "PUN"; //Profile Update New
          insertHistory.APPROVER_ID = userId;
          insertHistory.CREATED_BY = userId;
          insertHistory.NOTE = reqData.NOTE;
          insertHistory.USER_ID = reqData.USER_ID;
          if (!isEmpty(reqData.PROFILE_NEW_INFO_UID)) {
            insertHistory.PROFILE_UPDATE_UID = reqData.PROFILE_NEW_INFO_UID;
          }

          let userQueryResultForHistory = await csApprovalModel.insertHistory(
            insertHistory
          );
          //XXP2P_SUPPLIER_BANK,XXP2P_SUPPLIER_SITE,XXP2P_SUPPLIER_CONTACT_PERSON_DTLS
          if (userQueryResultForHistory.rowsAffected > 0) {
            value.history_message = "History Inserted";
            value.history_status = 200;
            updateDetailsData.ACTIVE_STATUS =
              reqData.ACTION_CODE == 1 ? statusInProcess : statusInProcess;

            let detailsTableQuery = await submissionModel.detailsTableUpdate(
              reqData.TABLE_NAME,
              updateDetailsData,
              whereDetailsData
            );
            //!Update On Info Log
            let infoLogTableQuery = await submissionModel.infoLogTableUpdate(
              updateInfoLogData,
              whereInfoLogData
            );

            console.log(detailsTableQuery);
            if (detailsTableQuery.rowsAffected > 0) {
              value.log_message = "Information Updated Successfully.";
              value.log_status = 200;
            }
          }
        }
        return res.status(value.update_status).json(value);
      }
    } catch (error) {
      logger.error(error);
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
