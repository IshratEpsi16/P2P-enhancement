const express = require("express");
const router = express.Router();
router.use(express.json());
const oracledb = require("oracledb");
require("dotenv").config();
const commonObject = require("../../../../common/api/v1/common");
const isEmpty = require("is-empty");
const loginModel = require("./../../../../models/api/v1/authentication/login");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.post(`/login`, async (req, res) => {
  let currentTime = await commonObject.getTodayDateTime();
  const today = new Date();
  let { EMAIL, USER_PASS } = req.body; // Get username and password from request body
  // let hashPassword = await commonObject.hashPassword('123456');
  // console.log(hashPassword);
  // Function to compare password with hashed password

  // Validate USER_NAME and USER_PASS
  if (!req.body.EMAIL || !req.body.USER_PASS) {
    let value = {
      message: "Email/User ID and Password are required!",
      status: 400,
    };
    return res.status(400).json(value);
  }
  //let emailCheck = await commonObject.emailChecker(EMAIL);
  //console.log(emailCheck);
  // let passwordCheck = await commonObject.passwordChecker(USER_PASS);
  // console.log(passwordCheck);
  // if (!emailCheck) {
  //   let value = {
  //     message: "Invalid email format!",
  //     status: 400,
  //   };
  //   return res.status(400).json(value);
  // } else
  // if (!passwordCheck) {
  //   let value = {
  //     message: "Invalid password format!",
  //     status: 400,
  //   };
  //   return res.status(400).json(value);
  // }

  let queryResult = await loginModel.loginWithEmail(EMAIL);
  //console.log(queryResult);
  await commonObject.makeArrayObject(queryResult);
  //console.log(queryResult.queryResult.finalData);
  let rowObject = await commonObject.convertArrayToObject(
    queryResult.queryResult.finalData
  );
  //console.log(rowObject.USER_PASSWORD);
  if (queryResult.rows.length === 0) {
    // User not found
    let value = {
      message: `User not found!`,
      status: 401,
    };
    //res.status(200).json(value);
    return res.status(401).json(value);
  }
  let comparePasswords = await commonObject.comparePasswords(
    USER_PASS,
    rowObject.USER_PASSWORD
  );
  console.log(comparePasswords);
  if (!comparePasswords) {
    // Password does not match
    let value = {
      message: "Password does not match!",
      status: 401,
    };
    return res.status(401).json(value);
  } else if (comparePasswords) {
    //console.log(`rowObject`,rowObject);
    //console.log(`comparePasswords`);
    if (rowObject.USER_ACTIVE_STATUS == 0) {
      let value = {
        message: `User Is Not Active`,
        status: 401,
      };
      return res.status(401).json(value);
    } else if (rowObject.START_DATE <= today && rowObject.END_DATE != "") {
      if (rowObject.START_DATE <= today && today >= rowObject.END_DATE) {
        let value = {
          message: `User activation date is expire`,
          status: 401,
        };
        return res.status(401).json(value);
      }
    } else if (
      rowObject.APPROVAL_STATUS != "APPROVED" &&
      rowObject.USER_TYPE == "Buyer"
    ) {
      let value = {
        message: `User is not Approved`,
        status: 401,
      };
      return res.status(401).json(value);
    } else {
      console.log(`user details`, rowObject);
      //console.log(`USER_TYPE`,rowObject.USER_TYPE);

      let queryBasicInfo,
        initiatorStatusResult,
        initiatorStatusResultPUN,
        rowObjectBasic,
        initiatorStatusResultObject,
        initiatorStatusResultObjectPUN = {};

      if (rowObject.USER_TYPE == "Supplier") {
        [queryBasicInfo, initiatorStatusResult, initiatorStatusResultPUN] =
          await Promise.all([
            loginModel.getBasicInfo(rowObject.USER_ID),
            loginModel.initiatorStatus(
              rowObject.INITIATOR_ID,
              rowObject.USER_ID,
              "PU",
              rowObject.PROFILE_UPDATE_UID
            ),
            loginModel.initiatorStatus(
              rowObject.NEW_INFO_INITIATOR_ID,
              rowObject.USER_ID,
              "PUN",
              rowObject.PROFILE_NEW_INFO_UID
            ),
          ]);
        Promise.all([
          commonObject.makeArrayObject(queryBasicInfo),
          commonObject.makeArrayObject(initiatorStatusResult),
          commonObject.makeArrayObject(initiatorStatusResultPUN),
        ]);
        //queryBasicInfo = await loginModel.getBasicInfo(rowObject.USER_ID);

        //await commonObject.makeArrayObject(queryBasicInfo);

        [
          rowObjectBasic,
          initiatorStatusResultObject,
          initiatorStatusResultObjectPUN,
        ] = await Promise.all([
          commonObject.convertArrayToObject(
            queryBasicInfo.queryResult.finalData
          ),
          commonObject.convertArrayToObject(
            initiatorStatusResult.queryResult.finalData
          ),
          commonObject.convertArrayToObject(
            initiatorStatusResultPUN.queryResult.finalData
          ),
        ]);
      }

      const payload = {
        USER_ID: rowObject.USER_ID,
        APPROVAL_STATUS: rowObject.APPROVAL_STATUS,
        USER_ACTIVE_STATUS: rowObject.USER_ACTIVE_STATUS,
        IS_NEW_USER: rowObject.IS_NEW_USER,
        EMPLOYEE_ID: rowObject.EMPLOYEE_ID,
        SUPPLIER_ID: rowObject.SUPPLIER_ID,
        SUBMISSION_STATUS: rowObject.SUBMISSION_STATUS,
        USER_TYPE: rowObject.USER_TYPE,
        ...(rowObject.USER_TYPE == "Buyer" && { BUYER_ID: rowObject.BUYER_ID }),
        ...(rowObject.USER_TYPE == "Supplier" && { BUYER_ID: 0 }),
        ...(rowObject.USER_TYPE == "Supplier" && {
          PROFILE_UPDATE_UID: rowObject.PROFILE_UPDATE_UID,
          ...(rowObject.USER_TYPE == "Supplier" && {
            WELCOME_MSG: `Dear <b>${rowObjectBasic.ORGANIZATION_NAME}</b> welcome to our P2P Supplier Portal.`,
          }),
        }),
        ...(rowObject.USER_TYPE == "Supplier" && {
          PROFILE_NEW_INFO_UID: rowObject.PROFILE_NEW_INFO_UID,
          ...(rowObject.USER_TYPE == "Supplier" && {
            WELCOME_MSG: `Dear <b>${rowObjectBasic.ORGANIZATION_NAME}</b> welcome to our P2P Supplier Portal.`,
          }),
        }),
        ...(rowObject.USER_TYPE == "Supplier" && {
          IS_WLC_MSG_SHOWN: rowObject.IS_WLC_MSG_SHOWN,
        }),
        ...(rowObject.USER_TYPE == "Supplier" && {
          VENDOR_ID: rowObject.VENDOR_ID,
        }),
        //USER_NAME: rowObject.USER_NAME,
        //FULL_NAME: rowObject.FULL_NAME,
        IS_REG_COMPLETE: rowObject.IS_REG_COMPLETE,
        ...(rowObject.USER_TYPE !== "Buyer" && {
          BUSINESS_GROUP_ID: rowObject.BUSINESS_GROUP_ID,
        }),
        ...(rowObject.USER_TYPE == "Supplier" && {
          INITIATOR_STATUS: initiatorStatusResultObject,
        }),
        ...(rowObject.USER_TYPE == "Supplier" && {
          NEW_INFO_INITIATOR_STATUS: initiatorStatusResultObjectPUN,
        }),
        // Add more data as needed
      };
      //console.log(payload);
      //const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: `${process.env.JWT_EXPIR}`,
      });
      let queryResult = await loginModel.loginTimeUpdate(rowObject.USER_ID);
      if (rowObject.USER_TYPE == "Supplier") {
        if (
          rowObject.IS_WLC_MSG_SHOWN == 0 &&
          !isEmpty(rowObject.VENDOR_ID) &&
          !isEmpty(rowObject.SUPPLIER_ID)
        ) {
          let queryResultMsg = await loginModel.updateMsgShownStatus(
            rowObject.USER_ID
          );
          //console.log(queryResultMsg);
        }
      }
      //console.log(queryResult);

      // Password matches
      let value = {
        message: `Login Successful`,
        status: 200,
        token: token,
        isBuyer: rowObject.USER_TYPE === "Buyer" ? 1 : 0,
      };
      return res.status(200).json(value);
    }
  }
});
module.exports = router;
