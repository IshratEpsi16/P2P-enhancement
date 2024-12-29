const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();

const supplierSiteBankModel = require("../../../../models/api/v1/siteBanks");
const commonObject = require("../../../../common/api/v1/common");

const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");

router.post("/list", [verifyToken], async (req, res) => {
  let result = {
    message: `Supplier Site Bank List`,
    status: 200,
    success: true,
    data: [],
  };

  //let userId = req.decoded.USER_ID;
  let reqData = {
    USER_ID: req.body.USER_ID,
    SITE_ID: req.body.SITE_ID,
  };
  if (isEmpty(reqData.USER_ID))
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Please give Supplier ID.",
    });
  if (isEmpty(reqData.SITE_ID))
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Please give Site ID.",
    });

  let queryResultData = await supplierSiteBankModel.bankListBySite(
    reqData.USER_ID,
    reqData.SITE_ID
  );

  await commonObject.makeArrayObject(queryResultData); // pass reference

  result.data = queryResultData.queryResult.finalData;

  return res.status(200).send(result);
});

router.post("/details", [verifyToken], async (req, res) => {
  //let userId = req.decoded.USER_ID;
  let id = isEmpty(req.body.id) ? 0 : req.body.id;

  let result = {
    message: `Supplier Bank details`,
    status: 200,
    success: true,
    data: {},
  };

  let queryResult = await supplierSiteBankModel.getDataByWhereCondition(
    { id: id },
    { id: "DESC" },
    1
  );

  if (isEmpty(queryResult) || queryResult.rows.length < 1)
    return res
      .status(404)
      .send({ success: false, status: 404, message: "No data found" });

  await commonObject.processDbDataToArrayObject({ queryResult }); // pass reference

  result.data = queryResult.finalData[0];
  return res.status(200).send(result);
});

router.post("/add", [verifyToken], async (req, res) => {
  let userId = req.decoded.USER_ID; // now fix, but it will dynamic;

  let reqData = {
    SITE_ID: req.body.SITE_ID,
    BANK_ID: req.body.BANK_ID,
  };

  let finalData = {};
  let currentTime = await commonObject.getTodayDateTime();

  if (isEmpty(reqData.SITE_ID))
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Please give Site ID.",
    });

  if (isEmpty(reqData.BANK_ID))
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Please give Bank ID.",
    });

  finalData.USER_ID = userId;
  finalData.SITE_ID = reqData.SITE_ID;
  finalData.BANK_ID = reqData.BANK_ID;
  finalData.CREATED_BY = userId;
  finalData.ACTIVE_STATUS = "ACTIVE";
  finalData.CREATION_DATE = currentTime;

  finalData.USER_ID = userId;
  finalData.CREATED_BY = userId;
  finalData.CREATION_DATE = currentTime;

  let result = await supplierSiteBankModel.addNew(finalData);

  if (!result || result.rowsAffected == undefined || result.rowsAffected < 1)
    return res.status(500).send({
      success: false,
      status: 500,
      message: "Something Wrong in system database.",
    });

  return res.status(200).send({
    success: true,
    status: 200,
    message: "Supplier site bank added successfully.",
  });
});

router.post("/delete", [verifyToken], async (req, res) => {
  let result = {
    message: `Supplier Site Bank Removed`,
    status: 200,
    success: true,
  };

  let userId = req.decoded.USER_ID;
  let reqData = {
    ID: req.body.ID,
  };
  if (isEmpty(reqData.ID))
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Please give ID.",
    });

  let queryResultData = await supplierSiteBankModel.bankDeleteByID(reqData.ID);

  //console.log(queryResultData.lastRowid);

  if (!isEmpty(queryResultData.lastRowid)) {
    result.message = "Supplier Site Bank Removed";
    return res.status(200).send(result);
  } else {
    result.message = "Supplier Site Bank Not Removed";
    return res.status(200).send(result);
  }
});

module.exports = router;
