const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const expenseModel = require("./../../../../models/api/v1/common/expenseType");
//const getUserRolePermission = require("../authentication/authorization_role_permission");
const {
  userPermissionAuthorization,
  userRoleAuthorization,
} = require("../../../../middleware/authorization");

router.get(
  `/invoice-expense-type`,
  verifyToken,
  async (req, res) => {
    try {
      let value = {
        message: `Expense Types`,
        status: 200,
        data: [],
      };

      // Total Count
      let queryResult = await expenseModel.expenseType();
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
