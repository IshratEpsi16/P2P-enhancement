const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const historyModel = require("./../../../../models/api/v1/common/approveHistoryByModule");
//const getUserRolePermission = require("../authentication/authorization_role_permission");
//const cache = require("../../../../middleware/nodeCache");
const isEmpty = require("is-empty");

router.post(`/approve-history-by-module`, verifyToken, async (req, res) => {
  try {
    let finalData = {};
    let value = {
      message: `History List`,
      status: 200,
      data: [],
    };

    let reqData = {
      OBJECT_ID: req.body.OBJECT_ID,
      OBJECT_TYPE_CODE: req.body.OBJECT_TYPE_CODE,
    };
    if (isEmpty(reqData.OBJECT_ID)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Please Give Object ID.",
      });
    }

    if (isEmpty(reqData.OBJECT_TYPE_CODE)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Please Give Object Type Code.",
      });
    }
    finalData.OBJECT_ID = reqData.OBJECT_ID;
    finalData.OBJECT_TYPE_CODE = reqData.OBJECT_TYPE_CODE;

    // History List
    let queryResult = await historyModel.historyByModule(finalData);
    await commonObject.makeArrayObject(queryResult);
    value.data = queryResult.queryResult.finalData;

    return res.status(200).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

module.exports = router;
