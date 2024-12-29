const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const submissionModel = require("../../../../models/api/v1/supplierApproval/submission");
const isEmpty = require("is-empty");
const {
  userRoleAuthorization,
} = require("../../../../middleware/authorization");

router.post(
  `/submission`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    try {
      let value = {
        message: "",
        status: 400,
      };
      userId = req.user ? req.user.USER_ID : null;

      let reqBody = {
        SUBMISSION_STATUS: req.body.SUBMISSION_STATUS,
        APPROVAL_STATUS: req.body.APPROVAL_STATUS,
        REG_TEMPLATE_ID: req.body.REG_TEMPLATE_ID,
        REG_TEMPLATE_STAGE_LEVEL: req.body.REG_TEMPLATE_STAGE_LEVEL,
        PROFILE_UPDATE_TEMPLATE_ID: req.body.PROFILE_UPDATE_TEMPLATE_ID,
        PROFILE_UPDATE_TEMPLATE_STAGE_LEVEL:
        req.body.PROFILE_UPDATE_TEMPLATE_STAGE_LEVEL,
        PROFILE_UPDATE_STATUS: req.body.PROFILE_UPDATE_STATUS,
      };

      if (isEmpty(reqBody.SUBMISSION_STATUS))
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Please Give Submission Status.",
        });
        

      let userQueryResult = await submissionModel.submissionUpdate(
        userId,
        reqBody.SUBMISSION_STATUS,
        reqBody.APPROVAL_STATUS,
        reqBody.REG_TEMPLATE_ID,
        reqBody.REG_TEMPLATE_STAGE_LEVEL,
        reqBody.PROFILE_UPDATE_TEMPLATE_ID,
        reqBody.PROFILE_UPDATE_TEMPLATE_STAGE_LEVEL,
        reqBody.PROFILE_UPDATE_STATUS
      );
      //console.log(userInsertionQueryResult);
      value.message = userQueryResult.outBinds.MESSAGE;
      value.status = userQueryResult.outBinds.STATUS;
      return res.status(value.status).json(value);
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

module.exports = router;
