const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const empList = require("./../../../../models/api/v1/common/employee_list");
//const getUserRolePermission = require("../authentication/authorization_role_permission");
const {
  userPermissionAuthorization,
  userRoleAuthorization,
} = require("../../../../middleware/authorization");

router.get(
  `/employees`,
  verifyToken,
  userRoleAuthorization,
  //userPermissionAuthorization(['CreateRFQ']),
  async (req, res) => {
    let filepath = `${process.env.backend_url}${process.env.profile_pic_file_path_name}`;
    try {
      let value = {
        message: `Employees`,
        status: 200,
        profile_pic:filepath,
        data: [],
      };

      // Total Count
      let queryResult = await empList.employeeList();
      await commonObject.makeArrayObject(queryResult);
      value.data = queryResult.queryResult.finalData;
      return res.status(200).json(value);
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

module.exports = router;
