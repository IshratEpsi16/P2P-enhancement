const express = require("express");
const router = express.Router();
router.use(express.json());
const oracledb = require("oracledb");
const jwt = require("jsonwebtoken");
const verifyToken = require("../../../../../middleware/jwtValidation");
const commonObject = require("../../../../../common/api/v1/common");
const inviteModel = require("../../../../../models/api/v1/supplierRegistration/invitation/invitationHistory");

router.post(`/invitation-history`, verifyToken, async (req, res) => {

  try {
    let reqData = {
      DATE_FROM: req.body.DATE_FROM,
      DATE_TO: req.body.DATE_TO,
      P_OFFSET: req.body.OFFSET,
      P_LIMIT: req.body.LIMIT,
    };
    let value = {
      message: `Invitation History List`,
      status: 200,
      total: 0,
      data: [],
    };

    // Query distinct role types
    const userResultTotal = await inviteModel.invitationHistoryTotal(
      reqData.DATE_FROM,
      reqData.DATE_TO
    );

    await commonObject.makeArrayObject(userResultTotal);
    let rowObject = await commonObject.convertArrayToObject(userResultTotal.queryResult.finalData);
    value.total = rowObject.TOTAL;

    // Query distinct role types
    const userResult = await inviteModel.invitationHistory(
      reqData.DATE_FROM,
      reqData.DATE_TO,
      reqData.P_OFFSET,
      reqData.P_LIMIT
    );
    await commonObject.makeArrayObject(userResult);
    value.data = userResult.queryResult.finalData;

    return res.status(200).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  } 
});

module.exports = router;
