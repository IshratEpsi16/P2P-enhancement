const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const profilePendingModel = require("./../../../../models/api/v1/pendingApplication/pendingProfileUpdate");
const {
  userRoleAuthorization,
} = require("../../../../middleware/authorization");
const isEmpty = require("is-empty");
const imageFilePathFinder = require("./../../../../common/api/v1/imageFilePathFinder");
const bankModel = require("../../../../models/api/v1/supplierBank");
const loginModel = require("./../../../../models/api/v1/authentication/login");

router.post(
  `/profile-update-list`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    let filepath1 = `${process.env.backend_url}${process.env.profile_pic1_file_path_name}`;
    let filepath2 = `${process.env.backend_url}${process.env.profile_pic2_file_path_name}`;
    let reqData = {
      APPROVAL_STATUS: req.body.APPROVAL_STATUS,
      SEARCH_VALUE: req.body.SEARCH_VALUE,
    };
    userId = req.user ? req.user.USER_ID : null;
    console.log(reqData);
    try {
      let value = {
        message: `Supplier List`,
        status: 200,
        total: 0,
        profile_pic1: filepath1,
        profile_pic2: filepath2,
        data: [],
      };

      let initiatorResultTotal =
        await profilePendingModel.pendingProfileUpdateTotalInitiator(
          userId,
          reqData.APPROVAL_STATUS,
          reqData.SEARCH_VALUE
        );

      let initiatorResult =
        await profilePendingModel.pendingProfileUpdateInitiator(
          userId,
          reqData.APPROVAL_STATUS,
          reqData.SEARCH_VALUE
        );

      await commonObject.makeArrayObject(initiatorResult);

      if (initiatorResult.queryResult.finalData.length > 0) {
        console.log("first");
        await commonObject.makeArrayObject(initiatorResultTotal);
        let rowObject = await commonObject.convertArrayToObject(
          initiatorResultTotal.queryResult.finalData
        );
        value.total = rowObject.TOTAL;
        value.data = initiatorResult.queryResult.finalData;
        for (let i = 0; i < value.data.length; i++) {
          let result = await loginModel.initiatorStatus(
            value.data[i].INITIATOR_ID,
            value.data[i].SUPPLIER_ID,
            "PU",
            value.data[i].PROFILE_UPDATE_UID
          );
          await commonObject.makeArrayObject(result);
          value.data[i].INITIATOR_STATUS = result.queryResult.finalData[0];
        }
        return res.status(200).json(value);
      }

      // Total Count
      let supplierListQueryResultTotal =
        await profilePendingModel.pendingProfileUpdateTotal(
          userId,
          reqData.APPROVAL_STATUS,
          reqData.SEARCH_VALUE
        );
      await commonObject.makeArrayObject(supplierListQueryResultTotal);
      let rowObject = await commonObject.convertArrayToObject(
        supplierListQueryResultTotal.queryResult.finalData
      );
      value.total = rowObject.TOTAL;
      //List
      let supplierListQueryResult =
        await profilePendingModel.pendingProfileUpdate(
          userId,
          reqData.APPROVAL_STATUS,
          reqData.SEARCH_VALUE
        );
      await commonObject.makeArrayObject(supplierListQueryResult);

      value.data = supplierListQueryResult.queryResult.finalData;
      for (let i = 0; i < value.data.length; i++) {
        let result = await loginModel.initiatorStatus(
          value.data[i].INITIATOR_ID,
          value.data[i].SUPPLIER_ID,
          "PU",
          value.data[i].PROFILE_UPDATE_UID
        );
        await commonObject.makeArrayObject(result);
        value.data[i].INITIATOR_STATUS = result.queryResult.finalData[0];
      }
      return res.status(200).json(value);
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

router.post(
  `/details`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    let reqData = {
      STAGE_ID: req.body.STAGE_ID,
      STAGE_LEVEL: req.body.STAGE_LEVEL,
      SUPPLIER_ID: req.body.SUPPLIER_ID,
      APPROVER_STATUS: req.body.APPROVER_STATUS,
    };
    //userId = req.user ? req.user.USER_ID : null;

    try {
      let value = {
        message: `Details`,
        status: 200,
        data: [],
      };
      if (isEmpty(reqData.STAGE_ID)) {
        let value = {
          message: `Enter Stage ID`,
          status: 400,
        };
        return res.status(400).json(value);
      } else if (isEmpty(reqData.STAGE_LEVEL)) {
        let value = {
          message: `Enter Stage Level`,
          status: 400,
        };
        return res.status(400).json(value);
      } else if (isEmpty(reqData.SUPPLIER_ID)) {
        let value = {
          message: `Enter Supplier ID`,
          status: 400,
        };
        return res.status(400).json(value);
      } else {
        let supplierListQueryResult =
          await profilePendingModel.pendingProfileUpdateDetails(
            reqData.STAGE_ID,
            reqData.STAGE_LEVEL,
            reqData.SUPPLIER_ID,
            reqData.APPROVER_STATUS
          );

        await commonObject.makeArrayObject(supplierListQueryResult);
        if (supplierListQueryResult.queryResult.finalData.length > 0) {
          for (
            let i = 0;
            i < supplierListQueryResult.queryResult.finalData.length;
            i++
          ) {
            let columnName =
              supplierListQueryResult.queryResult.finalData[i].COLUMN_NAME;
            let tableName =
              supplierListQueryResult.queryResult.finalData[i].TABLE_NAME;
            if (tableName == "XXP2P_SUPPLIER_BANK") {
              let queryResult = await bankModel.getDataByWhereCondition({
                id: supplierListQueryResult.queryResult.finalData[i]
                  .PK_COLUMN_VALUE,
              });
              await commonObject.makeArrayObject(queryResult);
              let rowObject = await commonObject.convertArrayToObject(
                queryResult.queryResult.finalData
              );
              supplierListQueryResult.queryResult.finalData[i].DETAILS =
                rowObject;
            }

            // Check if COLUMN_NAME contains 'FILE_NAME'
            if (columnName.includes("FILE_NAME")) {
              let filepath = await imageFilePathFinder.filePathFinder(
                columnName
              );

              // Check if filepath is not equal to "No file path found!"
              if (filepath !== "No file path found!") {
                supplierListQueryResult.queryResult.finalData[i].FILE_PATH =
                  filepath;
              }
            }
          }
        }
        value.data = supplierListQueryResult.queryResult.finalData;
        return res.status(200).json(value);
      }
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

router.post(
  `/approve-reject`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    let reqData = {
      ACTION_ID: req.body.ACTION_ID,
      ACTION_CODE: req.body.ACTION_CODE,
      USER_ID: req.body.SUPPLIER_ID,
      STAGE_ID: req.body.STAGE_ID,
      STAGE_LEVEL: req.body.STAGE_LEVEL,
      NOTE: req.body.NOTE,
      PROFILE_UPDATE_UID: req.body.PROFILE_UPDATE_UID,
      IS_INITIATOR: req.body.IS_INITIATOR,
    };
    console.log(reqData);
    userId = req.user ? req.user.USER_ID : null;

    try {
      let value = {
        message: ``,
        status: 0,
      };
      if (isEmpty(Number(reqData.ACTION_ID))) {
        let value = {
          message: `Please Give Action ID.`,
          status: 400,
        };
        return res.status(400).json(value);
      }
      if (isEmpty(Number(reqData.USER_ID))) {
        let value = {
          message: `Please Give Supplier ID.`,
          status: 400,
        };
        return res.status(400).json(value);
      }
      if (isEmpty(Number(reqData.STAGE_ID))) {
        let value = {
          message: `Please Give Stage ID.`,
          status: 400,
        };
        return res.status(400).json(value);
      }
      if (isEmpty(Number(reqData.STAGE_LEVEL))) {
        let value = {
          message: `Please Give Stage ID.`,
          status: 400,
        };
        return res.status(400).json(value);
      }
      if (isEmpty(Number(reqData.PROFILE_UPDATE_UID))) {
        let value = {
          message: `Please Give UID.`,
          status: 400,
        };
        return res.status(400).json(value);
      }
      if (isEmpty(Number(reqData.ACTION_CODE))) {
        let value = {
          message: `Please Give Action Code.`,
          status: 400,
        };
        return res.status(400).json(value);
      } else {
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

        //! Api Call

        let result = await profilePendingModel.approveReject(
          reqData.ACTION_ID,
          reqData.ACTION_CODE,
          reqData.USER_ID,
          userId,
          "Profile Update",
          reqData.STAGE_LEVEL,
          reqData.STAGE_ID,
          reqData.NOTE,
          reqData.IS_INITIATOR,
          reqData.PROFILE_UPDATE_UID
        );
        console.log(result);
        value.message = result.outBinds.MESSAGE;
        value.status = result.outBinds.STATUS;

        return res.status(value.status).json(value);
      }
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

module.exports = router;
