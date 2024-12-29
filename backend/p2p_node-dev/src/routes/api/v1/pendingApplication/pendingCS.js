const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const csModel = require("../../../../models/api/v1/csCreation/csCreation");
//const getUserRolePermission = require("../authentication/authorization_role_permission");
const {
  userPermissionAuthorization,
  userRoleAuthorization,
} = require("../../../../middleware/authorization");
const isEmpty = require("is-empty");

router.post(`/list`, verifyToken, userRoleAuthorization, async (req, res) => {
  try {
    let finalData = {};
    let value = {
      message: `CS List`,
      status: 200,
      data: [],
    };
    userId = req.user ? req.user.USER_ID : null;
    let reqData = {
      FROM_DATE: req.body.FROM_DATE,
      TO_DATE: req.body.TO_DATE,
      CS_STATUS: req.body.CS_STATUS,
      OFFSET: req.body.OFFSET,
      LIMIT: req.body.LIMIT,
    };

    // List
    let queryResultList = await csModel.csPendingList(
      userId,
      reqData.FROM_DATE,
      reqData.TO_DATE,
      reqData.CS_STATUS,
      reqData.OFFSET,
      reqData.LIMIT
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
