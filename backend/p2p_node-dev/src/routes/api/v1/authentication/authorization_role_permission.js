const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const autorizationRoles = require("./../../../../models/api/v1/authentication/authorization_role_permission");

let getUserRoles = async (userId) => {
  try {
    userId = userId;
    console.log(userId);
    let userRoleQueryResult = await autorizationRoles.empRoles(userId);
    await commonObject.makeArrayObject(userRoleQueryResult);
    return userRoleQueryResult.queryResult.finalData;
  } catch (error) {
    if (!userRoleQueryResult) {
      data.queryResult = {};
    }
    userRoleQueryResult = {};

    return false;
  }
};

let getUserPermission = async (userId) => {
  try {
    userId = userId;
    let userPermissionsQueryResult = await autorizationRoles.empRolePermissions(userId);

    await commonObject.makeArrayObject(userPermissionsQueryResult);
    //console.log(userRoleQueryResult.queryResult.finalData);
    return userPermissionsQueryResult.queryResult.finalData;
  } catch (error) {
    if (!userPermissionsQueryResult) {
      data.queryResult = {};
    }
    userPermissionsQueryResult = {};

    return false;
  }
};

// router.post(`/sync-to-web`, verifyToken, async (req, res) => {
//   try {
//     let value = {
//       message: "",
//       status: 400,
//     };

//     let userInsertionQueryResult = await autorizationRoles.empRoles(userId);
//     return res.status(value.status).json(value);
//   } catch (error) {
//     console.error("Error querying database:", error);
//     res.status(500).json({ error: "Database query error" });
//   }
// });

module.exports = { getUserRoles, getUserPermission };
