const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const ouModel = require("./../../../../models/api/v1/common/ouListAsBG");
//const getUserRolePermission = require("../authentication/authorization_role_permission");

const isEmpty = require("is-empty");

router.get(`/ou-list`, verifyToken, async (req, res) => {
  try {
    userId = req.user ? req.user.USER_ID : null;
    let finalData = {};
    let value = {
      message: `Operating Unit List`,
      status: 200,
      data: [],
    };
    finalData.USER_ID = userId;

    // OU List
    let queryResult = await ouModel.ouList(finalData);
    console.log(queryResult);
    await commonObject.makeArrayObject(queryResult);
    value.data = queryResult.queryResult.finalData;
    return res.status(200).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

module.exports = router;
