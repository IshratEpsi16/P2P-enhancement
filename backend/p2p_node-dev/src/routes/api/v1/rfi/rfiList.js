const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const rfiList = require("./../../../../models/api/v1/rfi/rfiList");
//const getUserRolePermission = require("../authentication/authorization_role_permission");
const {
  userPermissionAuthorization,
  userRoleAuthorization,
} = require("../../../../middleware/authorization");

router.post(`/list`, verifyToken, userRoleAuthorization, async (req, res) => {
  let filepath = `${process.env.backend_url}${process.env.profile_pic_file_path_name}`;
  try {
    let value = {
      message: `RFI List`,
      status: 200,
      PROFILE_PIC: filepath,
      total: 0,
      data: [],
    };
    //userId = req.user ? req.user.USER_ID : null;
    let reqData = {
      INITIATOR_ID: req.body.INITIATOR_ID,
      VIEWER_ID: req.body.VIEWER_ID,
      VIEWER_ACTION: req.body.VIEWER_ACTION,
      OBJECT_ID: req.body.OBJECT_ID,
      OBJECT_TYPE: req.body.OBJECT_TYPE,
    };

    // Total Count
    let queryResultTotal = await rfiList.rfiTotal(
      reqData.VIEWER_ID,
      reqData.VIEWER_ACTION,
      reqData.INITIATOR_ID,
      reqData.OBJECT_ID,
      reqData.OBJECT_TYPE
    );
    await commonObject.makeArrayObject(queryResultTotal);
    let rowObject = await commonObject.convertArrayToObject(
      queryResultTotal.queryResult.finalData
    );
    value.total = rowObject.TOTAL;
    // List
    let queryResultList = await rfiList.rfiList(
      reqData.VIEWER_ID,
      reqData.VIEWER_ACTION,
      reqData.INITIATOR_ID,
      reqData.OBJECT_ID,
      reqData.OBJECT_TYPE
    );
    await commonObject.makeArrayObject(queryResultList);
    value.data = queryResultList.queryResult.finalData;
    return res.status(200).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

module.exports = router;
