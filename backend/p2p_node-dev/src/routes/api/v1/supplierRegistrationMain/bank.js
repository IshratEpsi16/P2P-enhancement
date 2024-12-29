const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();

const bankModel = require("../../../../models/api/v1/supplierBank");
const commonObject = require("../../../../common/api/v1/common");
const fileUploaderCommonObject = require("../../../../common/api/v1/fileUploader");

const verifyToken = require("../../../../middleware/jwtValidation");

require("dotenv").config();

let supplier_check_file_path = `${process.env.backend_url}${process.env.supplier_check_file_path_name}`;

router.post("/add", [verifyToken], async (req, res) => {
  let userId = req.decoded.USER_ID; // now fix, but it will dynamic;

  let reqData = {
    USER_ID: userId,
    ACCOUNT_NAME: req.body.account_name,
    ACCOUNT_NUMBER: req.body.account_number,
    BANK_NAME: req.body.bank_name,
    BANK_PARTY_ID: req.body.bank_party_id,
    BRANCH_NAME: req.body.branch_name,
    BRANCH_PARTY_ID: req.body.branch_party_id,
    CURRENCY_CODE: req.body.currency_code,
    MULTI_CURRENCY_ALLOWED_FLAG: req.body.multi_currency_allowed_flag,
    PAYMENT_MULTI_CURRENCY_FLAG: req.body.payment_multi_currency_flag,
    ROUTING_SWIFT_CODE: req.body.routing_swift_code,
    SWIFT_CODE: req.body.swift_code,
    //"SITE_ID": req.body.site_id,
    ACTIVE_STATUS: req.body.active_status,
  };

  let id = req.body.id;
  let willUpdate = false;
  let finalData = {};
  let currentTime = await commonObject.getTodayDateTime();

  if (!isEmpty(id)) {
    let validateId = await commonObject.checkItsNumber(id);

    if (validateId.success == false)
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Id should be integer.",
      });
    else id = validateId.data;

    //  check row is exit or not
    let existingData = await bankModel.getDataByWhereCondition({
      id: id,
      user_id: userId,
    });

    if (isEmpty(existingData.rows))
      return res
        .status(404)
        .send({ success: false, status: 404, message: "No data found" });

    willUpdate = true;
  }

  let validateDataCheck = await commonObject.characterLimitCheck(
    reqData.ACCOUNT_NAME,
    "ACCOUNT NAME"
  );

  if (validateDataCheck.success == false)
    return res.status(400).send({
      success: false,
      status: 400,
      message: validateDataCheck.message,
    });

  finalData.ACCOUNT_NAME = validateDataCheck.data;

  // validateDataCheck = await commonObject.characterLimitCheck(reqData.ACCOUNT_NUMBER, "ACCOUNT NUMBER");
  // if (validateDataCheck.success == false)
  //     return res.status(400).send({ "success": false, "status": 400, "message": validateDataCheck.message });

  finalData.ACCOUNT_NUMBER = reqData.ACCOUNT_NUMBER;

  // validateDataCheck = await commonObject.characterLimitCheck(reqData.BANK_NAME, "BANK NAME");
  // if (validateDataCheck.success == false)
  //     return res.status(400).send({ "success": false, "status": 400, "message": validateDataCheck.message });

  finalData.BANK_NAME = reqData.BANK_NAME;

  // validateDataCheck = await commonObject.characterLimitCheck(reqData.BRANCH_NAME, "BRANCH NAME");
  // if (validateDataCheck.success == false)
  //     return res.status(400).send({ "success": false, "status": 400, "message": validateDataCheck.message });

  finalData.BRANCH_NAME = reqData.BRANCH_NAME;

  // if (isEmpty(reqData.SITE_ID)) return res.status(400).send({ "success": false, "status": 400, "message": "Please give site id." });

  // let validateId = await commonObject.checkItsNumber(reqData.SITE_ID);
  // if (validateId.success == false) return res.status(400).send({ "success": false, "status": 400, "message": "Site id should be number." });
  // finalData.SITE_ID = validateId.data;

  // validateDataCheck = await commonObject.characterLimitCheck(reqData.ROUTING_SWIFT_CODE, "ROUTING_SWIFT_CODE");
  // if (validateDataCheck.success == false)
  //     return res.status(400).send({ "success": false, "status": 400, "message": validateDataCheck.message });

  finalData.ROUTING_SWIFT_CODE = reqData.ROUTING_SWIFT_CODE;

  if (req.files && Object.keys(req.files).length > 0 && req.files.cheque_file) {
    let fileUploadCode = {};

    fileUploadCode = await fileUploaderCommonObject.uploadFile(
      req,
      "chequeFile",
      "cheque_file"
    );

    if (fileUploadCode.success == false)
      return res
        .status(400)
        .send({ success: false, status: 400, message: fileUploadCode.message });

    finalData.CHEQUE_FILE_NAME = fileUploadCode.fileName;
    finalData.CHEQUE_FILE_ORIGINAL_NAME = fileUploadCode.fileOriginalName;
  }
  if (!isEmpty(reqData.BANK_PARTY_ID)) {
    finalData.BANK_PARTY_ID = reqData.BANK_PARTY_ID;
  }
  // return res
  //   .status(400)
  //   .send({ success: false, status: 400, message: "Please Bank Party ID." });
  if (!isEmpty(reqData.BRANCH_PARTY_ID)) {
    finalData.BRANCH_PARTY_ID = reqData.BRANCH_PARTY_ID;
  }
  // return res
  //   .status(400)
  //   .send({
  //     success: false,
  //     status: 400,
  //     message: "Please Branch Party ID.",
  //   }

  finalData.CURRENCY_CODE = reqData.CURRENCY_CODE;
  finalData.MULTI_CURRENCY_ALLOWED_FLAG = reqData.MULTI_CURRENCY_ALLOWED_FLAG;
  finalData.PAYMENT_MULTI_CURRENCY_FLAG = reqData.PAYMENT_MULTI_CURRENCY_FLAG;
  finalData.SWIFT_CODE = reqData.SWIFT_CODE;
  finalData.ACTIVE_STATUS = reqData.ACTIVE_STATUS;
  finalData.LAST_UPDATED_BY = userId;
  finalData.LAST_UPDATE_DATE = currentTime;

  if (willUpdate) {
    if (isEmpty(finalData))
      return res.status(200).send({
        success: true,
        status: 200,
        message: "Update successfully done.",
      });

    // update
    let result = await bankModel.updateById(id, finalData);
    if (!result || result.rowsAffected == undefined || result.rowsAffected < 1)
      return res.status(500).send({
        success: false,
        status: 500,
        message: "Something Wrong in system database.",
      });
  } else {
    finalData.USER_ID = userId;
    finalData.CREATED_BY = userId;
    finalData.CREATION_DATE = currentTime;

    let result = await bankModel.addNew(finalData);
    if (!result || result.rowsAffected == undefined || result.rowsAffected < 1)
      return res.status(500).send({
        success: false,
        status: 500,
        message: "Something Wrong in system database.",
      });
  }

  return res.status(200).send({
    success: true,
    status: 200,
    message: willUpdate
      ? "Supplier bank info update successfully done"
      : "Supplier bank info successfully add",
  });
});

router.get("/list", [verifyToken], async (req, res) => {
  let userId = req.decoded.USER_ID;

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

  // for (const orgRow of queryResult.rows) {

  //     result.data.push({
  //         ID: orgRow[0],
  //         SUPPLIER_ID: orgRow[1],
  //         ACCOUNT_NAME: orgRow[2],
  //         ACCOUNT_NUMBER: orgRow[3],
  //         BANK_NAME: orgRow[4],
  //         BRANCH_NAME: orgRow[5],
  //         ROUTING_SWIFT_CODE: orgRow[6],
  //         SITE_ID: orgRow[7],
  //         CHEQUE_FILE_NAME: orgRow[8],
  //         CHEQUE_FILE_PATH: orgRow[9],
  //         CREATED_BY: orgRow[10],
  //         CREATION_DATE: orgRow[11],
  //         LAST_UPDATED_BY: orgRow[12],
  //         LAST_UPDATE_DATE: orgRow[13],
  //         ACTIVE_STATUS: orgRow[14],
  //     });
  // }

  return res.status(200).send(result);
});

router.post("/details", [verifyToken], async (req, res) => {
  let userId = req.decoded.USER_ID;
  let id = req.body.id;

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
  // for (const orgRow of queryResult.rows) {

  //     result.data = {
  //         ID: orgRow[0],
  //         SUPPLIER_ID: orgRow[1],
  //         ACCOUNT_NAME: orgRow[2],
  //         ACCOUNT_NUMBER: orgRow[3],
  //         BANK_NAME: orgRow[4],
  //         BRANCH_NAME: orgRow[5],
  //         ROUTING_SWIFT_CODE: orgRow[6],
  //         SITE_ID: orgRow[7],
  //         CHEQUE_FILE_NAME: orgRow[8],
  //         CHEQUE_FILE_PATH: orgRow[9],
  //         CREATED_BY: orgRow[10],
  //         CREATION_DATE: orgRow[11],
  //         LAST_UPDATED_BY: orgRow[12],
  //         LAST_UPDATE_DATE: orgRow[13],
  //     };

  //     break;
  // }

  return res.status(200).send(result);
});

module.exports = router;
