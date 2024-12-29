const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const submissionModel = require("./../../../../models/api/v1/supplierRegistrationMain/submission");
const isEmpty = require("is-empty");
router.post(`/submission`, verifyToken, async (req, res) => {
  try {
    let value = {
      message: "",
      status: 400,
    };
    userId = req.user ? req.user.USER_ID : null;

    let reqBody = {
      SUBMISSION_STATUS: req.body.SUBMISSION_STATUS,
    };

    if (isEmpty(reqBody.SUBMISSION_STATUS))
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Please give submission status.",
      });
    
      let userQueryResult = await submissionModel.submissionUpdate(
        userId,
        reqBody.SUBMISSION_STATUS
      );
      //console.log(userInsertionQueryResult);
      value.message = userQueryResult.outBinds.MESSAGE;
      value.status = userQueryResult.outBinds.STATUS;
      return res.status(value.status).json(value);
    
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

module.exports = router;
