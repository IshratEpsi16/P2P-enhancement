const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const submitModel = require("./../../../../models/api/v1/supplierProfileUpdate/profile_update_submit");
//const getUserRolePermission = require("../authentication/authorization_role_permission");
const {
  supplierPermissionAuthorization
} = require("../../../../middleware/authorization");

router.post(`/submit`, verifyToken,async (req, res) => {
  try {
    //let userRoles = await getUserRolePermission.getUserRoles(req);
    //let userPermission = await getUserRolePermission.getUserPermission(req);
    //console.log(userRoles);
    //console.log(userPermission);
    //roleVerify.userRoleAuthorization(userRoles,res);
    let reqData = {
      APPROVER_STATUS: req.body.APPROVER_STATUS
    };
    console.log(reqData);
    userId = req.user ? req.user.USER_ID : null;

    let value = {
      message: `Success`,
      status: 200,
    };
    // User List
    let userListQueryResult = await submitModel.submitUpdate(
      reqData.APPROVER_STATUS,
      userId
    );
    console.log(userListQueryResult);
    value.message = userListQueryResult.outBinds.MESSAGE;
    value.status = userListQueryResult.outBinds.STATUS;
    return res.status(value.status).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

module.exports = router;
