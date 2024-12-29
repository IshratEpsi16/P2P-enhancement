const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const commonModel = require("./../../../../models/api/v1/common/supplierSyncFromEBS");
//const getUserRolePermission = require("../authentication/authorization_role_permission");
const {
  userPermissionAuthorization,
  userRoleAuthorization,
} = require("../../../../middleware/authorization");
const isEmpty = require("is-empty");

router.post(
  `/supplier-sync-from-ebs`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    try {
      let reqBody = {
        SUPPLIER_ID: req.body.SUPPLIER_ID,
      };
      if (isEmpty(reqBody.SUPPLIER_ID)) {
        return res.status(400).json({
          message: "Please Give Supplier ID.",
          status: 400,
        });
      }

      let value = {
        message: `Success`,
        status: 200,
      };

      // Total Count
      let result = await commonModel.supplierSync(reqBody.SUPPLIER_ID);
      console.log(result);
      if(result === undefined){
        return res.status(400).json({
            message: "Supplier Not Synced.",
            status: 400,
          });
      }
      else
      return res.status(200).json({
        message: "Supplier Synced.",
        status: 200,
      });
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

module.exports = router;
