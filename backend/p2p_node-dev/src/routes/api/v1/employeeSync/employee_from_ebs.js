const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const empSyncModel = require("./../../../../models/api/v1/employeeSync/employee_from_ebs");
//const getUserRolePermission = require("../authentication/authorization_role_permission");
const {userPermissionAuthorization,userRoleAuthorization} = require("../../../../middleware/authorization");

router.post(`/employee_from_ebs`, verifyToken,userRoleAuthorization, async (req, res) => {
  try {
    //let userRoles = await getUserRolePermission.getUserRoles(req);
    //let userPermission = await getUserRolePermission.getUserPermission(req);
    //console.log(userRoles);
    //console.log(userPermission);
    //roleVerify.userRoleAuthorization(userRoles,res);
    let reqBody = {
      SEARCH_FIELD: req.body.SEARCH_FIELD,
      P_OFFSET: req.body.P_OFFSET,
      P_LIMIT: req.body.P_LIMIT,
    };

    let value = {
      message: `Success`,
      status: 200,
      total: 0,
      data: [],
    };

    // Total Count
    let totalCountQueryResult = await empSyncModel.empSyncTotalCount(
      reqBody.SEARCH_FIELD
    );
    console.log(totalCountQueryResult);
    await commonObject.makeArrayObject(totalCountQueryResult);
    let rowObject = await commonObject.convertArrayToObject(
      totalCountQueryResult.queryResult.finalData
    );
    value.total = rowObject.TOTAL;
    // User List
    let userListQueryResult = await empSyncModel.empList(
      reqBody.SEARCH_FIELD,
      reqBody.P_OFFSET,
      reqBody.P_LIMIT
    );
    await commonObject.makeArrayObject(userListQueryResult);
    //console.log(userListQueryResult.queryResult.finalData);
    value.data = userListQueryResult.queryResult.finalData;
    return res.status(200).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

module.exports = router;
