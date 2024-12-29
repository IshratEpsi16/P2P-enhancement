const express = require("express");
const router = express.Router();
router.use(express.json());
const oracledb = require("oracledb");
const commonObject = require("../../../../../common/api/v1/common");
const baseurl = process.env.VERSION_1;
const accModel = require("../../../../../models/api/v1/supplierRegistrationMain/account_creation");
const isEmpty = require("is-empty");

router.post(`/account-creation`, async (req, res) => {
  let connection;

  try {
    // Create a database connection
    connection = req.dbConnection;
    let finalData = {};
    let reqData = {
      USER_NAME: req.body.USER_NAME,
      EMAIL_ADDRESS: req.body.EMAIL_ADDRESS,
      MOBILE_NUMBER: req.body.MOBILE_NUMBER,
      PASSWORD: req.body.PASSWORD,
      BUSINESS_GROUP_ID: req.body.BUSINESS_GROUP_ID,
      INITIATOR_ID: req.body.INITIATOR_ID,
    };

    let hashPassword = await commonObject.hashPassword(reqData.PASSWORD);
    finalData.USER_NAME = reqData.USER_NAME;
    finalData.EMAIL_ADDRESS = reqData.EMAIL_ADDRESS;
    finalData.MOBILE_NUMBER = reqData.MOBILE_NUMBER;
    finalData.BUSINESS_GROUP_ID = reqData.BUSINESS_GROUP_ID;
    finalData.INITIATOR_ID = reqData.INITIATOR_ID;
    finalData.USER_PASSWORD = hashPassword;
    finalData.USER_TYPE = "Supplier";
    finalData.APPROVAL_STATUS = "IN PROCESS";
    finalData.USER_ACTIVE_STATUS = 1;
    finalData.IS_NEW_USER = 0;
    finalData.START_DATE = new Date();
    finalData.IS_REG_COMPLETE = 0;
    finalData.SUBMISSION_STATUS = "DRAFT";
    finalData.PROFILE_UPDATE_STATUS = "DRAFT";
    finalData.NEW_INFO_INITIATOR_ID = reqData.INITIATOR_ID;
    console.log(finalData);
    // Query distinct role types
    // RFQ Creation

    let queryResultEmail = await accModel.checkEmail(reqData.EMAIL_ADDRESS);
    await commonObject.makeArrayObject(queryResultEmail);
    if (queryResultEmail.queryResult.finalData.length > 0) {
      let value = {
        message: `Email ${reqData.EMAIL_ADDRESS} Already Exist.`,
        status: 400,
      };
      return res.status(400).json(value);
    }

    // let queryResultMobile = await accModel.checkMobile(reqData.MOBILE_NUMBER);
    // await commonObject.makeArrayObject(queryResultMobile);
    // if (!isEmpty(queryResultMobile.queryResult.finalData)) {
    //   let value = {
    //     message: `Email ${reqData.MOBILE_NUMBER} Already Exist.`,
    //     status: 400,
    //   };
    //   return res.status(400).json(value);
    // }
    let queryResult = await accModel.accountCreation(finalData);
    console.log(queryResult);
    if (queryResult.rowsAffected > 0) {
      let value = {
        message: "Account Created Successfully.",
        status: 200,
      };
      return res.status(200).json(value);
    } else {
      let value = {
        message: "Account Not Created.",
        status: 400,
      };
      return res.status(400).json(value);
    }
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log("Oracle Database connection closed.");
      } catch (err) {
        console.error("Error closing Oracle Database connection:", err);
      }
    }
  }
});

module.exports = router;
