const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const approvalStageList = require("./../../../../models/api/v1/common/approvalStage");
//const getUserRolePermission = require("../authentication/authorization_role_permission");
const {
  userPermissionAuthorization,
  userRoleAuthorization,
} = require("../../../../middleware/authorization");
const isEmpty = require("is-empty");

router.get(`/list`, verifyToken, async (req, res) => {
  try {
    let value = {
      message: `Approval Stage List`,
      status: 200,
      data: [],
    };

    // Stage List
    let approvalStageListQuery = await approvalStageList.approvalStageList();
    await commonObject.makeArrayObject(approvalStageListQuery);
    value.data = approvalStageListQuery.queryResult.finalData;
    return res.status(200).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(`/update`, verifyToken, async (req, res) => {
  try {
    let value = {
      message: ``,
      status: 200,
    };

    let reqData = {
      SUPPLIER_ID: req.body.SUPPLIER_ID,
      AS_ID: req.body.AS_ID,
    };
    if (isEmpty(reqData.SUPPLIER_ID)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Please Give Supplier ID.",
      });
    }

    if (isEmpty(reqData.AS_ID)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Please Give Stage ID.",
      });
    }

    // Stage List
    let approvalStageListQuery = await approvalStageList.approvalStageUpdate(
      reqData.AS_ID,
      reqData.SUPPLIER_ID
    );

    console.log(approvalStageListQuery.rowsAffected);
    approvalStageListQuery.rowsAffected == 1
      ? (value.message = "Stage Updated Successfully")
      : "No data updated!";

    return res.status(200).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

module.exports = router;
