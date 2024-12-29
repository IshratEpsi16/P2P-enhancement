const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const registrationPendingModel = require("./../../../../models/api/v1/pendingApplication/pendingRegistration");
//const getUserRolePermission = require("../authentication/authorization_role_permission");
const {
  userPermissionAuthorization,
  userRoleAuthorization,
} = require("../../../../middleware/authorization");
const isEmpty = require("is-empty");

router.post(
  `/registration-list`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    let filepath1 = `${process.env.backend_url}${process.env.profile_pic1_file_path_name}`;
    let filepath2 = `${process.env.backend_url}${process.env.profile_pic2_file_path_name}`;
    let reqData = {
      APPROVAL_STATUS: req.body.APPROVAL_STATUS,
      SEARCH_VALUE: req.body.SEARCH_VALUE,
    };
    userId = req.user ? req.user.USER_ID : null;
    try {
      let value = {
        message: `Supplier List`,
        status: 200,
        total: 0,
        profile_pic1: filepath1,
        profile_pic2: filepath2,
        data: [],
      };
      // Total Count
      let rowObject;
      let initiatorSupplierListQueryResultTotal =
        await registrationPendingModel.initiatorPendingRegistrationTotal(
          userId,
          reqData.APPROVAL_STATUS,
          reqData.SEARCH_VALUE
        );
      await commonObject.makeArrayObject(initiatorSupplierListQueryResultTotal);
       rowObject = await commonObject.convertArrayToObject(
        initiatorSupplierListQueryResultTotal.queryResult.finalData
      );
      if (
        isEmpty(initiatorSupplierListQueryResultTotal.queryResult.finalData)
      ) {
        // Total Count
        let supplierListQueryResultTotal =
          await registrationPendingModel.pendingRegistrationTotal(
            userId,
            reqData.APPROVAL_STATUS,
            reqData.SEARCH_VALUE
          );
        await commonObject.makeArrayObject(supplierListQueryResultTotal);
         rowObject = await commonObject.convertArrayToObject(
          supplierListQueryResultTotal.queryResult.finalData
        );
      }
      value.total = rowObject.TOTAL;

      //List Of Value
      let initiatorSupplierListQueryResult =
        await registrationPendingModel.initiatorPendingRegistration(
          userId,
          reqData.APPROVAL_STATUS,
          reqData.SEARCH_VALUE
        );
      await commonObject.makeArrayObject(initiatorSupplierListQueryResult);
      value.data = initiatorSupplierListQueryResult.queryResult.finalData;

      // It will call when no pending list in initiator end.
      if (isEmpty(initiatorSupplierListQueryResult.queryResult.finalData)) {
        let supplierListQueryResult =
          await registrationPendingModel.pendingRegistration(
            userId,
            reqData.APPROVAL_STATUS,
            reqData.SEARCH_VALUE
          );
        await commonObject.makeArrayObject(supplierListQueryResult);
        value.data = supplierListQueryResult.queryResult.finalData;
      }
      return res.status(200).json(value);
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

module.exports = router;
