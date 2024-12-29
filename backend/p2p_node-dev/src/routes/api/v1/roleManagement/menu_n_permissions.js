const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const {
  userRoleAuthorization,
} = require("../../../../middleware/authorization");
const commonObject = require("../../../../common/api/v1/common");
const menuNPermission = require("./../../../../models/api/v1/roleManagement/menu_n_permissions");
const baseurl = process.env.VERSION_1;
router.get(
  `/all-menu-permissions`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    let connection;

    try {
      let result = {
        message: `Menu and Permissions`,
        status: 200,
        data: [],
      };

      const role = {
        Permission: [],
        Menu: [],
      };

      // Query permissions for the current role
      let allMenuQueryResult = await menuNPermission.allMenu();
      await commonObject.makeArrayObject(allMenuQueryResult);
      role.Menu = allMenuQueryResult.queryResult.finalData;

      // Query permissions for the current role
      let allPermissionQueryResult = await menuNPermission.allPermissions();
      await commonObject.makeArrayObject(allPermissionQueryResult);
      role.Permission = allPermissionQueryResult.queryResult.finalData;

      result.data.push(role);

      res.status(200).json(result);
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    } finally {
      if (connection) {
        try {
          await connection.close();
          console.log("Oracle Database connection closed.");
        } catch (err) {
          console.error("Error closing Oracle Database connection:", err);
        }
      }
    }
  }
);

module.exports = router;
