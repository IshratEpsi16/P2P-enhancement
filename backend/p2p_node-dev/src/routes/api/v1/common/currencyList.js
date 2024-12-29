const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const currencyList = require("./../../../../models/api/v1/common/currencyList");
const p2pCache = require("../../../../common/api/v1/cache");
//const getUserRolePermission = require("../authentication/authorization_role_permission");
const isEmpty = require("is-empty");
router.get(`/currency-list`, verifyToken, async (req, res) => {
  const cachedLocationArray = p2pCache.get("currencyArray") || [];
  try {
    let value = {
      message: `Currency List`,
      status: 200,
      data: [],
    };

    if (!isEmpty(cachedLocationArray)) {
      value.data = cachedLocationArray;
      return res.status(200).json(value);
    } else {
      // Currency List
      let queryResult = await currencyList.currencyList();
      await commonObject.makeArrayObject(queryResult);
      value.data = queryResult.queryResult.finalData;
      return res.status(200).json(value);
    }
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(`/currency-name-by-id`, verifyToken, async (req, res) => {
  try {
    let value = {
      message: `Currency List`,
      status: 200,
      data: {},
    };

    let reqData = {
      CURRENCY_CODE: req.body.CURRENCY_CODE,
    };
    if (isEmpty(reqData.CURRENCY_CODE)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Please Give Currency Code.",
      });
    }

    // Currency List
    let queryResult = await currencyList.currencyNameById(
      reqData.CURRENCY_CODE
    );
    await commonObject.makeArrayObject(queryResult);
    let rowObject = await commonObject.convertArrayToObject(
      queryResult.queryResult.finalData
    );
    value.data = rowObject;
    return res.status(200).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

module.exports = router;
