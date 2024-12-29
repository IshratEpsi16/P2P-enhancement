const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const commonObject = require("../../../../common/api/v1/common");
const myInfoModel = require("./../../../../models/api/v1/authentication/my_info");
const rfqModel = require("../../../../models/api/v1/pr2po/pr/rfqPreparation");
const isEmpty = require("is-empty");
const p2pCache = require("../../../../common/api/v1/cache");
const currencyList = require("./../../../../models/api/v1/common/currencyList");
router.post(`/my-info`, verifyToken, async (req, res) => {
  try {
    let filepath = `${process.env.backend_url}${process.env.profile_pic1_file_path_name}`;
    let filepath1 = `${process.env.backend_url}${process.env.profile_pic_file_path_name}`;
    let { DEVICE } = req.body;
    let userId = req.user ? req.user.USER_ID : null;

    let value = {
      message: `User Info`,
      status: 200,
      data: {},
      profile_pic_supplier: filepath,
      profile_pic_buyer: filepath1,
      Menu: [],
      Permission: [],
    };

    let userQueryResult = await myInfoModel.myInfoUserCheck(userId);
    await commonObject.makeArrayObject(userQueryResult);
    let rowObject = await commonObject.convertArrayToObject(
      userQueryResult.queryResult.finalData
    );
    value.data = rowObject;

    if (userQueryResult.rows.length === 0) {
      return res.status(401).json({
        message: `User not found!`,
        status: 401,
      });
    }

    // Query for the menu
    let menuByUserQuery = await myInfoModel.myInfoUserMenu(
      rowObject.USER_ID,
      DEVICE
    );
    await commonObject.makeArrayObject(menuByUserQuery);
    value.Menu = menuByUserQuery.queryResult.finalData;

    // Query for the permission
    let permissionByUserQuery = await myInfoModel.myInfoUserPermission(
      rowObject.USER_ID
    );
    await commonObject.makeArrayObject(permissionByUserQuery);
    value.Permission = permissionByUserQuery.queryResult.finalData;

    // Function to update cache in the background
    const updateCacheInBackground = () => {
      setImmediate(async () => {
        try {
          // Location List
          if (isEmpty(p2pCache.get("locationArray"))) {
            let queryResultList = await rfqModel.locationList();
            await commonObject.makeArrayObject(queryResultList);
            p2pCache.set("locationArray", queryResultList.queryResult.finalData);
          }

          // Currency List
          if (isEmpty(p2pCache.get("currencyArray"))) {
            let queryResultList = await currencyList.currencyList();
            await commonObject.makeArrayObject(queryResultList);
            p2pCache.set("currencyArray", queryResultList.queryResult.finalData);
          }
        } catch (error) {
          console.error("Error updating cache in background:", error);
        }
      });
    };

    // Start the background cache update process
    updateCacheInBackground();

    // Send the response immediately without waiting for cache updates
    return res.status(200).json(value);

  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

module.exports = router;
