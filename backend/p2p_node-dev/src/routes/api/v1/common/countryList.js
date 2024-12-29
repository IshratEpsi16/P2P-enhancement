const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const countryList = require("./../../../../models/api/v1/common/countryList");
//const getUserRolePermission = require("../authentication/authorization_role_permission");
//const cache = require("../../../../middleware/nodeCache");
const NodeCache = require("node-cache");
const cache = new NodeCache();
const isEmpty = require("is-empty");


router.get(`/country-list`,verifyToken, async (req, res) => {
 
  try {
    const cacheKey = 'country-list';
    let value = {
      message: `Country List`,
      status: 200,
      data: [],
    };
    // Check if data is cached
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        console.log('Data retrieved from cache');
        value.data = cachedData;
        return res.status(200).json(value);
    }

    // Bank List
    let queryResult = await countryList.countryList();
    await commonObject.makeArrayObject(queryResult);
    value.data = queryResult.queryResult.finalData;
    // Cache the fetched data
    cache.set(cacheKey, value.data, /* optional TTL */ 60); // Cache for 60 seconds

    console.log('Data fetched from database or API');

    return res.status(200).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(`/country-list-code`,verifyToken, async (req, res) => {
 
  try {
    const cacheKey = 'country-list';
    let value = {
      message: `Country List`,
      status: 200,
      data: [],
    };
    // Check if data is cached
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        console.log('Data retrieved from cache');
        value.data = cachedData;
        return res.status(200).json(value);
    }

    // Bank List
    let queryResult = await countryList.countryList();
    await commonObject.makeArrayObject(queryResult);
    value.data = queryResult.queryResult.finalData;
    // Cache the fetched data
    cache.set(cacheKey, value.data, /* optional TTL */ 60); // Cache for 60 seconds

    console.log('Data fetched from database or API');

    return res.status(200).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

module.exports = router;
