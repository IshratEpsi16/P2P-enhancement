const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const empSyncModel = require("./../../../../models/api/v1/employeeSync/sync_to_web");
const {
  userRoleAuthorization,
} = require("../../../../middleware/authorization");
const isEmpty = require("is-empty");

router.post(
  `/sync-to-web`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    try {
      let findData = {};
      let finalData = {};
      let updateData = {};
      let whereData = {};
      let userInsertionQueryResult = {};
      let value = {
        message: "",
        status: 400,
      };
      userId = req.user ? req.user.USER_ID : null;

      // Function to hash a password

      let hashPassword = await commonObject.hashPassword("123456");
      //console.log(hashPassword);

      let reqBody = {
        USER_NAME: req.body.USER_NAME,
        EMPLOYEE_ID: req.body.EMPLOYEE_ID,
        FULL_NAME: req.body.EMPLOYEE_NAME,
        START_DATE: req.body.START_DATE,
        END_DATE: req.body.END_DATE,
        BUYER_ID: req.body.BUYER_ID,
        EMAIL_ADDRESS: req.body.EMAIL_ADDRESS,
        BUSINESS_GROUP_ID: req.body.BUSINESS_GROUP_ID,
        DEPARTMENT: req.body.DEPARTMENT,
      };
      reqBody.USER_TYPE = "Buyer";
      reqBody.APPROVAL_STATUS = "APPROVED";
      reqBody.USER_ACTIVE_STATUS = 1;
      reqBody.IS_NEW_USER = 1;

      if (!isEmpty(reqBody.USER_NAME)) findData.USER_NAME = reqBody.USER_NAME;
      if (!isEmpty(reqBody.EMPLOYEE_ID))
        findData.EMPLOYEE_ID = reqBody.EMPLOYEE_ID;
      if (!isEmpty(reqBody.BUYER_ID)) findData.BUYER_ID;

      let queryUserFind = await empSyncModel.findUser(reqBody.BUYER_ID);
      await commonObject.makeArrayObject(queryUserFind);
      //console.log(queryUserFind.queryResult.finalData);
      let rowObject = await commonObject.convertArrayToObject(
        queryUserFind.queryResult.finalData
      );
      console.log("User ID: ", rowObject.USER_ID);
      whereData.USER_ID = rowObject.USER_ID;
      if (
        isEmpty(queryUserFind.queryResult.finalData) ||
        rowObject.USER_ID === undefined
      ) {
        finalData.USER_NAME = reqBody.USER_NAME;
        finalData.CREATED_BY = userId;
        finalData.FULL_NAME = reqBody.FULL_NAME;
        finalData.START_DATE = reqBody.START_DATE;
        finalData.END_DATE = reqBody.END_DATE;
        finalData.BUYER_ID = reqBody.BUYER_ID;
        finalData.EMAIL_ADDRESS = reqBody.EMAIL_ADDRESS;
        finalData.BUSINESS_GROUP_ID = reqBody.BUSINESS_GROUP_ID;
        finalData.USER_PASSWORD = hashPassword;
        finalData.USER_TYPE = reqBody.USER_TYPE;
        finalData.DEPARTMENT = reqBody.DEPARTMENT;
        Object.entries(reqBody).forEach(([key, value]) => {
          if (!isEmpty(value)) {
            // Check for START_DATE and convert it to a Date object
            if (key === "START_DATE") {
              finalData[key] = new Date(value);
            }
            // Check for END_DATE and convert it to a Date object
            else if (key === "END_DATE") {
              finalData[key] = new Date(value);
            }
            // Modify USER_NAME if applicable
            else if (key === "USER_NAME") {
              finalData[key] = "b" + value;
            }
            // For other keys, retain the original value
            else {
              finalData[key] = value;
            }
          }
        });

        //console.log(finalData);
        //if (queryUserFind == undefined || isEmpty(queryUserFind)) {

        userInsertionQueryResult = await empSyncModel.empInsert(finalData);

        //console.log(userInsertionQueryResult);
        if (
          userInsertionQueryResult.rowsAffected > 0 &&
          !isEmpty(userInsertionQueryResult.outBinds)
        ) {
          value.message = "User Created Successfully.";
          value.status = 200;
          return res.status(value.status).json(value);
        }
        // }

        // let userInsertionQueryResult = await empSyncModel.empInsert(
        //   userId,
        //   "b" + reqBody.USER_NAME,
        //   reqBody.EMPLOYEE_ID,
        //   reqBody.FULL_NAME,
        //   reqBody.START_DATE,
        //   reqBody.END_DATE,
        //   reqBody.BUYER_ID,
        //   reqBody.EMAIL_ADDRESS,
        //   reqBody.BUSINESS_GROUP_ID,
        //   hashPassword
        // );
      }
      if (
        !isEmpty(queryUserFind.queryResult.finalData) &&
        !isEmpty(rowObject.USER_ID)
      ) {
        Object.entries(reqBody).forEach(([key, value]) => {
          if (
            !isEmpty(value) &&
            key != "START_DATE" &&
            key != "END_DATE" &&
            key != "USER_TYPE" &&
            key != "APPROVAL_STATUS" &&
            key != "USER_ACTIVE_STATUS" &&
            key != "IS_NEW_USER"
          ) {
            if (key === "USER_NAME" && !isEmpty(value)) {
              let userName = String(value); // Convert value to a string
              if (!userName.startsWith("b")) {
                updateData[key] = `b${userName}`;
              } else {
                updateData[key] = userName;
              }
            } else if (key != "USER_NAME" && !isEmpty(value)) {
              updateData[key] = value;
            }
          }
        });
        console.log(updateData);
        let updateUserQuery = await empSyncModel.update(updateData, whereData);
        if (updateUserQuery.rowsAffected > 0) {
          value.message = "User Information Updated Successfully.";
          value.status = 200;
          return res.status(value.status).json(value);
        }
      }
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

module.exports = router;
