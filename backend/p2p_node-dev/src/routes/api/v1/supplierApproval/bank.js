const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();

const bankModel = require("../../../../models/api/v1/supplierApproval/supplierBank");
const commonObject = require("../../../../common/api/v1/common");
const fileUploaderCommonObject = require("../../../../common/api/v1/fileUploader");

const verifyToken = require("../../../../middleware/jwtValidation");
const {
  userRoleAuthorization,
} = require("../../../../middleware/authorization");
require("dotenv").config();

let supplier_check_file_path = `${process.env.backend_url}${process.env.supplier_check_file_path_name}`;

router.post("/list", [verifyToken, userRoleAuthorization], async (req, res) => {
  let userId = req.body.USER_ID;

  let result = {
    message: `Supplier Bank List`,
    status: 200,
    success: true,
    data: [],
  };

  // let queryResult = await bankModel.getList();
  let queryResult = await bankModel.getDataByWhereCondition({
    user_id: userId,
  });
  await commonObject.makeArrayObject(queryResult);
  result.data = queryResult.queryResult.finalData;

  return res.status(200).send(result);
});

router.post("/details", [verifyToken], async (req, res) => {
  let userId = req.body.USER_ID;
  let id = req.body.id;
  if (isEmpty(userId)) {
    return res
      .status(404)
      .send({ success: false, status: 404, message: "Please give user id" });
  }
  if (isEmpty(id)) {
    return res
      .status(404)
      .send({ success: false, status: 404, message: "Please give id" });
  }

  let result = {
    message: `Supplier Bank Details`,
    status: 200,
    success: true,
    data: {},
    supplier_check_file_path,
  };

  let queryResult = await bankModel.getDataByWhereCondition(
    { user_id: userId, id: id },
    { id: "DESC" },
    1
  );

  if (isEmpty(queryResult) || queryResult.rows.length < 1)
    return res
      .status(404)
      .send({ success: false, status: 404, message: "No data found" });
  await commonObject.makeArrayObject(queryResult);
  let rowObject = await commonObject.convertArrayToObject(
    queryResult.queryResult.finalData
  );
  result.data = rowObject;

  return res.status(200).send(result);
});

module.exports = router;
