const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../../../common/api/v1/common");
const model = require("../../../../../../models/api/v1/common/systemSetup");
//const getUserRolePermission = require("../authentication/authorization_role_permission");
const isEmpty = require("is-empty");
const {
  userPermissionAuthorization,
  userRoleAuthorization,
} = require("../../../../../../middleware/authorization");

router.post(
  `/supplier-maintenance-mode`,
  verifyToken,
  async (req, res) => {
    userId = req.user ? req.user.USER_ID : null;
    try {
      let value = {
        message: `Supplier Maintenance Mode`,
        status: 200,
        data: {},
      };

      let reqData = {
        OBJECT_VALUE: req.body.OBJECT_VALUE,
      };

      if (isEmpty(reqData.OBJECT_VALUE)) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Please Give Value.",
        });
      }

      let queryResult = await model.maintenanceMode(reqData.OBJECT_VALUE);
      await commonObject.makeArrayObject(queryResult);
      let rowObject = await commonObject.convertArrayToObject(
        queryResult.queryResult.finalData
      );
      value.data = rowObject;
      return res.status(200).json(value);
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

router.post(
  `/supplier-maintenance-mode-change`,
  verifyToken,
  userPermissionAuthorization(['SupMaintenanceMode']),
  async (req, res) => {
    try {
    let userId = req.user ? req.user.USER_ID : null;
      let whereData = {};
      let updateData = {};
      let finalData = {};
      let value = {
        message: ``,
        status: 200,
      };

      let reqData = {
        OBJECT_TYPE: req.body.OBJECT_TYPE,
        OBJECT_VALUE: req.body.OBJECT_VALUE,
      };

      if (isEmpty(reqData.OBJECT_TYPE)) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Please Give Object Type.",
        });
      }

      if (isEmpty(reqData.OBJECT_VALUE)) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Please Give Object Value.",
        });
      }
    //   finalData.OBJECT_TYPE = "SUPPLIER_MAINTENANCE_MODE";
    //   finalData.OBJECT_VALUE = "N";
      whereData.OBJECT_TYPE = `'${reqData.OBJECT_TYPE}'`;
      updateData.OBJECT_VALUE = reqData.OBJECT_VALUE;
      //updateData.CREATED_BY = 1;
      updateData.LAST_UPDATED_BY = userId;

      let queryResult = await model.updateMaintenanceMode(
        updateData,
        whereData
      );
      if (queryResult.rowsAffected > 0) {
        value.message = "Information Updated Successfully.";
        value.status = 200;
        return res.status(value.status).json(value);
      } else {
        value.message = "Information Not Updated. Please Try Again.";
        value.status = 500;
        return res.status(value.status).json(value);
      }
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

module.exports = router;
