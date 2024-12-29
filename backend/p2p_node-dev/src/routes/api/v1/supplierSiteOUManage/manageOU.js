const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const supplierSiteOUManageModel = require("../../../../models/api/v1/supplierSiteOUManage/add");
const commonObject = require("../../../../common/api/v1/common");
const verifyToken = require("../../../../middleware/jwtValidation");
const {
  userPermissionAuthorization,
  userRoleAuthorization,
} = require("../../../../middleware/authorization");
const oracledb = require("oracledb");

router.post("/add", [verifyToken, userRoleAuthorization], async (req, res) => {
  let value = {
    message: `Success`,
    status: 200,
  };
  let finalData = {};

  let userId = req.decoded.USER_ID;
  let reqData = {
    SITE_ID: req.body.SITE_ID,
    ORGANIZATION_ID: req.body.ORGANIZATION_ID,
    ACTION_CODE: req.body.ACTION_CODE,
    NOTE: req.body.NOTE,
  };

  if (isEmpty(reqData.SITE_ID))
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Please give Site ID.",
    });
  if (isEmpty(reqData.ORGANIZATION_ID))
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Please give Org ID.",
    });
  if (isEmpty(reqData.ACTION_CODE))
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Please give Action Code.",
    });
  if (isEmpty(reqData.NOTE))
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Please give note",
    });
  let validateDataCheck = await commonObject.characterLimitCheck(
    reqData.NOTE,
    "VIEWER NOTE"
  );

  if (validateDataCheck.success == false)
    return res.status(400).send({
      success: false,
      status: 400,
      message: validateDataCheck.message,
    });

  finalData.NOTE = validateDataCheck.data;
  finalData.SITE_ID = reqData.SITE_ID;
  finalData.CREATED_BY = userId;
  finalData.ACTION_CODE = reqData.ACTION_CODE;
  finalData.ORGANIZATION_ID = reqData.ORGANIZATION_ID;

  let queryResultData = await supplierSiteOUManageModel.addNew(finalData);
  console.log(queryResultData);
  if (
    !queryResultData ||
    queryResultData.rowsAffected == undefined ||
    queryResultData.rowsAffected < 1
  )
    return res.status(500).send({
      success: false,
      status: 500,
      message: "Something Wrong in system database.",
    });
  return res.status(200).send({
    "success": true,
    "status": 200,
    "message": "Supplier successfully add"
});
});

router.post(
  "/history-list",
  [verifyToken, userRoleAuthorization],
  async (req, res) => {
    let userId = req.decoded.USER_ID;
    let id = isEmpty(req.body.id) ? 0 : req.body.id;

    let result = {
      message: `Supplier OU Manage History`,
      status: 200,
      success: true,
      data: [],
    };
    let reqData = {
      P_OFFSET: req.body.P_OFFSET,
      P_LIMIT: req.body.P_LIMIT,
    };

    let queryResult = await supplierSiteOUManageModel.history(reqData.P_OFFSET);

    await commonObject.makeArrayObject(queryResult); // pass reference
    result.data = queryResult.queryResult.finalData;
    return res.status(200).send(result);
  }
);

module.exports = router;
