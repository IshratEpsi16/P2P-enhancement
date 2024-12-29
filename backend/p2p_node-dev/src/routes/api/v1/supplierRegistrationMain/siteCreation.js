const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();

const supplierSiteCreationModel = require("../../../../models/api/v1/supplierRegistrationSiteCreation");
const commonObject = require("../../../../common/api/v1/common");
const currencyList = require("./../../../../models/api/v1/common/currencyList");
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");

router.get("/list", [verifyToken], async (req, res) => {
  let userId = req.decoded.USER_ID;
  let result = {
    message: `Supplier contact List`,
    status: 200,
    success: true,
    data: [],
  };

  let queryResult = await supplierSiteCreationModel.getDataByWhereCondition({
    user_id: userId,
  });

  await commonObject.processDbDataToArrayObject({ queryResult }); // pass reference

  if (!(isEmpty(queryResult) || isEmpty(queryResult.rows)))
    for (let i = 0; i < queryResult.finalData.length; i++) {
      // Invoice Currency
      if (!isEmpty(queryResult.finalData[i].INVOICE_CURRENCY_CODE)) {
        let queryResultInvoice_currency_code =
          await currencyList.currencyNameById(
            queryResult.finalData[i].INVOICE_CURRENCY_CODE
          );
        await commonObject.makeArrayObject(queryResultInvoice_currency_code);
        let rowObjectInvoice = await commonObject.convertArrayToObject(
          queryResultInvoice_currency_code.queryResult.finalData
        );
        queryResult.finalData[i].INVOICE_CURRENCY =
          rowObjectInvoice.CURRENCY_NAME;
      }
      //Payment Currency
      if (!isEmpty(queryResult.finalData[i].PAYMENT_CURRENCY_CODE)) {
        let queryResultPayment_currency_code =
          await currencyList.currencyNameById(
            queryResult.finalData[i].PAYMENT_CURRENCY_CODE
          );
        await commonObject.makeArrayObject(queryResultPayment_currency_code);
        let rowObjectPayment = await commonObject.convertArrayToObject(
          queryResultPayment_currency_code.queryResult.finalData
        );
        queryResult.finalData[i].PAYMENT_CURRENCY =
          rowObjectPayment.CURRENCY_NAME;
      }
    }
  result.data = queryResult.finalData;

  return res.status(200).send(result);
});

router.post("/details", [verifyToken], async (req, res) => {
  let userId = req.decoded.USER_ID;
  let id = isEmpty(req.body.id) ? 0 : req.body.id;

  console.log(id);

  let result = {
    message: `Supplier site details`,
    status: 200,
    success: true,
    data: {},
  };

  let queryResult = await supplierSiteCreationModel.getDataByWhereCondition(
    { user_id: userId, id: id },
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
    COUNTRY: req.body.country,
    ADDRESS_LINE1: req.body.address_link_1,
    ADDRESS_LINE2: req.body.address_link_2,
    CITY_STATE: req.body.city_status,
    ZIP_CODE: req.body.zip_code,
    EMAIL: req.body.email,
    MOBILE_NUMBER: req.body.mobile_number,
    ACTIVE_STATUS: req.body.active_status,
    PRIMARY_SITE: req.body.primary_site,
    INVOICE_CURRENCY_CODE: req.body.invoice_currency_code,
    PAYMENT_CURRENCY_CODE: req.body.payment_currency_code,
  };

  let id = req.body.id;
  let willUpdate = false;
  let finalData = {};
  let currentTime = await commonObject.getTodayDateTime();
  let siteId;

  if (!isEmpty(id)) {
    let queryResult = await supplierSiteCreationModel.getDataByWhereCondition(
      { user_id: userId, ID: id },
      { id: "DESC" },
      1,
      0,
      ["id"]
    );

    if (!isEmpty(queryResult) && !isEmpty(queryResult.rows)) {
      willUpdate = true;
      // for (const orgRow of queryResult.rows) { id = orgRow[0]; break; }
    }
  }

  let validateDataCheck = await commonObject.characterLimitCheck(
    reqData.COUNTRY,
    "COUNTRY"
  );

  if (validateDataCheck.success == false)
    return res.status(400).send({
      success: false,
      status: 400,
      message: validateDataCheck.message,
    });
  finalData.COUNTRY = validateDataCheck.data;
  //TODO ADDRESS_LINE1 validation
  // validateDataCheck = await commonObject.characterLimitCheck(
  //   reqData.ADDRESS_LINE1,
  //   "ADDRESS_LINE1"
  // );
  // if (validateDataCheck.success == false)
  //   return res.status(400).send({
  //     success: false,
  //     status: 400,
  //     message: validateDataCheck.message,
  //   });
  finalData.ADDRESS_LINE1 = reqData.ADDRESS_LINE1;

  validateDataCheck = await commonObject.characterLimitCheck(
    reqData.ADDRESS_LINE2,
    "ADDRESS_LINE2"
  );
  if (validateDataCheck.success == false)
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Site Address Can Not Be Empty", //validateDataCheck.message,
    });
  finalData.ADDRESS_LINE2 = validateDataCheck.data;

  // validateDataCheck = await commonObject.characterLimitCheck(
  //   reqData.CITY_STATE,
  //   "CITY_STATE"
  // );
  // if (validateDataCheck.success == false)
  //   return res.status(400).send({
  //     success: false,
  //     status: 400,
  //     message: validateDataCheck.message,
  //   });
  finalData.CITY_STATE = reqData.CITY_STATE;

  /*if (isEmpty(reqData.ZIP_CODE))
    return res
      .status(400)
      .send({ success: false, status: 400, message: "Please give zip code." });

  let validateId = await commonObject.checkItsNumber(reqData.ZIP_CODE);
  if (validateId.success == false)
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Zip code should be number.",
    });*/
  //finalData.ZIP_CODE = validateId.data;
  finalData.ZIP_CODE = reqData.ZIP_CODE;

  // email

  /* if (isEmpty(reqData.EMAIL)) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Please give email address.",
    });
  } else {
    let validateEmail = await commonObject.isValidEmail(reqData.EMAIL);
    if (validateEmail == false)
      return res
        .status(400)
        .send({ success: false, status: 400, message: "Email is not valid" });
    finalData.EMAIL = reqData.EMAIL;
  }*/

  finalData.EMAIL = reqData.EMAIL;

  /* if (isEmpty(reqData.MOBILE_NUMBER))
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Please give mobile number.",
    });

  let validateMobileNumber = await commonObject.isValidPhoneNumber(
    reqData.MOBILE_NUMBER
  );

  if (validateMobileNumber == false)
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Mobile number is not valid",
    });*/

  finalData.MOBILE_NUMBER = reqData.MOBILE_NUMBER;
  finalData.ACTIVE_STATUS = reqData.ACTIVE_STATUS;
  finalData.PRIMARY_SITE = reqData.PRIMARY_SITE;
  finalData.INVOICE_CURRENCY_CODE = reqData.INVOICE_CURRENCY_CODE;
  finalData.PAYMENT_CURRENCY_CODE = reqData.PAYMENT_CURRENCY_CODE;

  Object.entries(finalData).forEach(([key, value]) => {
    if (!isEmpty(value)) {
      finalData[key] = value;
    }
  });

  if (willUpdate) {
    if (isEmpty(finalData))
      return res.status(200).send({
        success: true,
        status: 200,
        message: "Update successfully done.",
      });

    // update
    let result = await supplierSiteCreationModel.updateById(id, finalData);
    if (!result || result.rowsAffected == undefined || result.rowsAffected < 1)
      return res.status(500).send({
        success: false,
        status: 500,
        message: "Something Wrong in system database.",
      });
  } else {
    let addressLineCheck = await supplierSiteCreationModel.addressLineCheck(
      userId,
      reqData.ADDRESS_LINE1
    );
    console.log(addressLineCheck);
    await commonObject.makeArrayObject(addressLineCheck);
    if (!isEmpty(addressLineCheck.queryResult.finalData)) {
      return res.status(500).send({
        success: false,
        status: 500,
        message: "Site Name Already Exist.",
      });
    }
    finalData.USER_ID = userId;
    finalData.CREATED_BY = userId;
    finalData.CREATION_DATE = currentTime;

    console.log(finalData);

    let result = await supplierSiteCreationModel.addNew(finalData);
    siteId = result.outBinds[0][0];
    //console.log(siteId);

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
    ...(siteId !== null && { id: siteId }),
    message: willUpdate
      ? "Supplier site info update successfully done"
      : "Supplier site info successfully add.",
  });
});

router.post("/site-ou", verifyToken, async (req, res) => {
  let userId = req.decoded.USER_ID;
  let reqData = {
    SITE_ID: req.body.SITE_ID,
    SHORT_CODE: req.body.SHORT_CODE,
    NAME: req.body.NAME,
    ORGANIZATION_ID: req.body.ORGANIZATION_ID,
  };

  let result = {
    message: ``,
    status: 200,
  };
  if (isEmpty(reqData.SITE_ID)) {
    return res.status(400).send({ message: "Enter Site ID", status: 400 });
  }
  if (isEmpty(reqData.SHORT_CODE)) {
    return res.status(400).send({ message: "Enter Short Code", status: 400 });
  }
  if (isEmpty(reqData.NAME)) {
    return res.status(400).send({ message: "Enter Name", status: 400 });
  }
  if (isEmpty(reqData.ORGANIZATION_ID)) {
    return res
      .status(400)
      .send({ message: "Enter Organization ID", status: 400 });
  }

  let queryResult = await supplierSiteCreationModel.siteOU(
    userId,
    reqData.SITE_ID,
    reqData.SHORT_CODE,
    reqData.NAME,
    reqData.ORGANIZATION_ID
  );
  result.message = queryResult.outBinds.MESSAGE;
  result.status = queryResult.outBinds.STATUS;

  return res.status(200).send(result);
});

router.post("/site-ou-by-approver", verifyToken, async (req, res) => {
  let userId = req.decoded.USER_ID;
  let reqData = {
    SUPPLIER_ID: req.body.SUPPLIER_ID,
    SITE_ID: req.body.SITE_ID,
    SHORT_CODE: req.body.SHORT_CODE,
    NAME: req.body.NAME,
    ORGANIZATION_ID: req.body.ORGANIZATION_ID,
  };

  let result = {
    message: ``,
    status: 200,
  };
  if (isEmpty(reqData.SUPPLIER_ID)) {
    return res.status(400).send({ message: "Enter Supplier ID", status: 400 });
  }
  if (isEmpty(reqData.SITE_ID)) {
    return res.status(400).send({ message: "Enter Site ID", status: 400 });
  }
  if (isEmpty(reqData.SHORT_CODE)) {
    return res.status(400).send({ message: "Enter Short Code", status: 400 });
  }
  if (isEmpty(reqData.NAME)) {
    return res.status(400).send({ message: "Enter Name", status: 400 });
  }
  if (isEmpty(reqData.ORGANIZATION_ID)) {
    return res
      .status(400)
      .send({ message: "Enter Organization ID", status: 400 });
  }

  let queryResult = await supplierSiteCreationModel.siteOUByApprover(
    reqData.SUPPLIER_ID,
    reqData.SITE_ID,
    reqData.SHORT_CODE,
    reqData.NAME,
    reqData.ORGANIZATION_ID,
    userId
  );
  result.message = queryResult.outBinds.MESSAGE;
  result.status = queryResult.outBinds.STATUS;

  return res.status(200).send(result);
});

router.post("/site-ou-list", verifyToken, async (req, res) => {
  let userId = req.decoded.USER_ID;
  let reqData = {
    SITE_ID: req.body.SITE_ID,
  };

  let result = {
    message: `Site Operating Unit List`,
    status: 200,
    data: [],
  };
  // if (isEmpty(reqData.SITE_ID)) {
  //   return res
  //     .status(400)
  //     .send({ message: "Enter Site ID", status: 400, success: false });
  // }
  if (isEmpty(reqData.SITE_ID)) {
    let queryResult = await supplierSiteCreationModel.siteOUListWithOutSite(
      userId
    );
    console.log(queryResult);

    await commonObject.makeArrayObject(queryResult);
    result.data = queryResult.queryResult.finalData;
    return res.status(200).send(result);
  } else {
    let queryResult = await supplierSiteCreationModel.siteOUList(
      userId,
      reqData.SITE_ID
    );
    console.log(queryResult);

    await commonObject.makeArrayObject(queryResult);
    result.data = queryResult.queryResult.finalData;
    return res.status(200).send(result);
  }
});

router.post("/delete-site", verifyToken, async (req, res) => {
  let userId = req.decoded.USER_ID;
  let reqData = {
    SITE_ID: req.body.SITE_ID,
  };

  let result = {
    message: ``,
    status: 200,
  };
  // if (isEmpty(reqData.SITE_ID)) {
  //   return res
  //     .status(400)
  //     .send({ message: "Enter Site ID", status: 400, success: false });
  // }

  let queryResult = await supplierSiteCreationModel.siteDelete(reqData.SITE_ID);
  console.log(queryResult);

  return res.status(200).send(result);
});

module.exports = router;
