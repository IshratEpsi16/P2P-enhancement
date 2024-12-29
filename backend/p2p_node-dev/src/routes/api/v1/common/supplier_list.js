const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const supplierList = require("./../../../../models/api/v1/common/supplier_list");
//const getUserRolePermission = require("../authentication/authorization_role_permission");
const {
  userPermissionAuthorization,
  userRoleAuthorization,
} = require("../../../../middleware/authorization");
const isEmpty = require("is-empty");

router.post(`/list`, verifyToken, userRoleAuthorization, async (req, res) => {
  let filepath1 = `${process.env.backend_url}${process.env.profile_pic1_file_path_name}`;
  let filepath2 = `${process.env.backend_url}${process.env.profile_pic2_file_path_name}`;
  let reqData = {
    USER_ACTIVE_STATUS: req.body.USER_ACTIVE_STATUS,
    APPROVAL_STATUS: req.body.APPROVAL_STATUS,
    SUBMISSION_STATUS: req.body.SUBMISSION_STATUS,
    IS_REG_COMPLETE: req.body.IS_REG_COMPLETE,
    SEARCH_VALUE: req.body.SEARCH_VALUE,
    OFFSET: req.body.OFFSET,
    LIMIT: req.body.LIMIT,
  };

  try {
    let value = {
      message: `Supplier List`,
      status: 200,
      total: 0,
      profile_pic1: filepath1,
      profile_pic2: filepath2,
      data: [],
    };

    if (
      reqData.OFFSET == null ||
      reqData.OFFSET == "" ||
      isEmpty(reqData.OFFSET)
    ) {
      value.message = "PLease give offset.";
      value.status = 400;
      return res.status(value.status).json(value);
    }
    if (isEmpty(reqData.LIMIT)) {
      value.message = "PLease give limit.";
      value.status = 400;
      return res.status(value.status).json(value);
    }
    if (reqData.OFFSET == 1) reqData.OFFSET = 0;

    // Total Count
    let totalCountQueryResult = await supplierList.supplierTotalCount(
      reqData.USER_ACTIVE_STATUS,
      reqData.APPROVAL_STATUS,
      reqData.SUBMISSION_STATUS,
      reqData.IS_REG_COMPLETE,
      reqData.SEARCH_VALUE
    );
    await commonObject.makeArrayObject(totalCountQueryResult);
    let rowObject = await commonObject.convertArrayToObject(
      totalCountQueryResult.queryResult.finalData
    );
    value.total = rowObject.TOTAL;

    // Total Count
    let supplierListQueryResult = await supplierList.supplierList(
      reqData.USER_ACTIVE_STATUS,
      reqData.APPROVAL_STATUS,
      reqData.SUBMISSION_STATUS,
      reqData.IS_REG_COMPLETE,
      reqData.SEARCH_VALUE,
      reqData.OFFSET,
      reqData.LIMIT
    );
    await commonObject.makeArrayObject(supplierListQueryResult);
    value.data = supplierListQueryResult.queryResult.finalData;
    return res.status(200).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

module.exports = router;
