const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const emailModel = require("./../../../../models/api/v1/common/sendEmail");
//const getUserRolePermission = require("../authentication/authorization_role_permission");
const {
  userPermissionAuthorization,
  userRoleAuthorization,
} = require("../../../../middleware/authorization");
const isEmpty = require("is-empty");

router.post(
  `/email-send`,
  verifyToken,
  async (req, res) => {
    let reqData = {
      EMAIL: req.body.EMAIL,
      NAME: req.body.NAME,
      SUBJECT: req.body.SUBJECT,
      P_BODY: req.body.BODY,
    };

    try {
      let value = {
        message: ``,
        status: 400,
      };

      if (
        isEmpty(reqData.EMAIL) ||
        isEmpty(reqData.NAME) ||
        isEmpty(reqData.SUBJECT) ||
        isEmpty(reqData.P_BODY)
      ) {
        let errorMessages = [
          "Email is required.",
          "Name is required.",
          "Subject is required.",
          "Email Body is required.",
          // Add more messages if needed
        ];

        let emptyFields = [];

        if (isEmpty(reqData.EMAIL)) emptyFields.push("Email");
        if (isEmpty(reqData.NAME)) emptyFields.push("Name");
        if (isEmpty(reqData.SUBJECT)) emptyFields.push("Subject");
        if (isEmpty(reqData.P_BODY)) emptyFields.push("Body");

        let msg = `The following fields are required: ${emptyFields.join(
          ", "
        )}`;

        let value = {
          message: msg,
          status: 400,
        };

        return res.status(400).json(value);
      }

      let queryResult = await emailModel.sendEmail(
        reqData.EMAIL,
        reqData.NAME,
        reqData.SUBJECT,
        reqData.P_BODY
      );
      value.message = queryResult.outBinds.MESSAGE;
      value.status = queryResult.outBinds.STATUS;
      return res.status(200).json(value);
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

module.exports = router;
