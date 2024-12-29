const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const model = require("./../../../../models/api/v1/common/userPasswordReset");
const {
  userRoleAuthorization,
} = require("../../../../middleware/authorization");
const isEmpty = require("is-empty");

router.post(
  `/user-password-reset`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    let updateData = {};
    let whereData = {};
    try {
      userId = req.user ? req.user.USER_ID : null;
      let value = {
        message: ``,
        status: 0,
      };
      let hashPassword = await commonObject.hashPassword("123456");
      let reqData = {
        USER_ID: req.body.USER_ID,
      };
      if (isEmpty(reqData.USER_ID)) {
        return res
          .status(400)
          .send({ message: "Please Give User ID.", status: 400 });
      }
      updateData.USER_PASSWORD = hashPassword;
      updateData.IS_NEW_USER = 1;
      updateData.LAST_UPDATED_BY = userId;

      whereData.USER_ID = reqData.USER_ID;

      let queryResultUpdate = await model.passwordReset(updateData, whereData);
      if (queryResultUpdate.rowsAffected > 0) {
        value.message = "Password Reset Successfully.";
        value.status = 200;
        return res.status(value.status).json(value);
      } else value.message = "Password Not Reset. Please Try Again";
      value.status = 400;
      return res.status(value.status).json(value);
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

router.post(`/change-own-password`, verifyToken, async (req, res) => {
  let updateData = {};
  let whereData = {};
  try {
    userId = req.user ? req.user.USER_ID : null;
    console.log("userId", userId);
    let value = {
      message: ``,
      status: 0,
    };

    let reqData = {
      OLD_PASSWORD: req.body.OLD_PASSWORD,
      NEW_PASSWORD: req.body.NEW_PASSWORD,
    };
    if (isEmpty(reqData.OLD_PASSWORD)) {
      return res
        .status(400)
        .send({ message: "Please Give Current Password.", status: 400 });
    }
    if (isEmpty(reqData.NEW_PASSWORD)) {
      return res
        .status(400)
        .send({ message: "Please Give New Password.", status: 400 });
    }

    let newPass = await commonObject.hashPassword(reqData.NEW_PASSWORD);
    let oldPassResult = await model.getOldPassword(userId);

    await commonObject.makeArrayObject(oldPassResult);
    let rowObject = await commonObject.convertArrayToObject(
      oldPassResult.queryResult.finalData
    );
    let comparePasswords = await commonObject.comparePasswords(
      reqData.OLD_PASSWORD,
      rowObject.USER_PASSWORD
    );
    if (!comparePasswords) {
      value.message =
        "The password you entered does not match your current password. Please try again.";
      value.status = 400;
      return res.status(value.status).json(value);
    }

    updateData.USER_PASSWORD = newPass;
    whereData.USER_ID = userId;

    let queryResultUpdate = await model.passwordReset(updateData, whereData);
    if (queryResultUpdate.rowsAffected > 0) {
      value.message = "Password Reset Successfully.";
      value.status = 200;
      return res.status(value.status).json(value);
    } else value.message = "Password Not Reset. Please Try Again";
    value.status = 400;
    return res.status(value.status).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});


router.post(
  `/user-info-update`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    let updateData = {};
    let whereData = {};
    try {
      let value = {
        message: ``,
        status: 0,
      };
      let reqData = {
        USER_ID: req.body.USER_ID,
        COLUMN_NAME: req.body.COLUMN_NAME,
        VALUE: req.body.VALUE
      };
      if (isEmpty(reqData.USER_ID)) {
        return res
          .status(400)
          .send({ message: "Please Give User ID.", status: 400 });
      }
      if (isEmpty(reqData.COLUMN_NAME)) {
        return res
          .status(400)
          .send({ message: "Please Give Column Name.", status: 400 });
      }
      if (isEmpty(reqData.VALUE)) {
        return res
          .status(400)
          .send({ message: "Please Give Value.", status: 400 });
      }
      updateData[reqData.COLUMN_NAME] = reqData.VALUE;

      whereData.USER_ID = reqData.USER_ID;

      let queryResultUpdate = await model.updateUserInfo(updateData, whereData);
      if (queryResultUpdate.rowsAffected > 0) {
        value.message = "Information Updated Successfully.";
        value.status = 200;
        return res.status(value.status).json(value);
      } else value.message = "Information Not Updated! Please Try Again";
      value.status = 400;
      return res.status(value.status).json(value);
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

module.exports = router;