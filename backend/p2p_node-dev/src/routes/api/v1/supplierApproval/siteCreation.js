const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();

const supplierSiteCreationModel = require("../../../../models/api/v1/supplierApproval/supplierRegistrationSiteCreation");
const commonObject = require("../../../../common/api/v1/common");

const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const {
  userRoleAuthorization,
} = require("../../../../middleware/authorization");

router.post("/list", [verifyToken, userRoleAuthorization], async (req, res) => {
  let userId = req.body.USER_ID;
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
    result.data = queryResult.finalData;

  return res.status(200).send(result);
});

router.post(
  "/details",
  [verifyToken, userRoleAuthorization],
  async (req, res) => {
    let userId = req.body.USER_ID;
    let id = isEmpty(req.body.id) ? 0 : req.body.id;

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
  }
);
/*
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

  validateDataCheck = await commonObject.characterLimitCheck(
    reqData.ADDRESS_LINE1,
    "ADDRESS_LINE1"
  );
  if (validateDataCheck.success == false)
    return res.status(400).send({
      success: false,
      status: 400,
      message: validateDataCheck.message,
    });
  finalData.ADDRESS_LINE1 = validateDataCheck.data;

  validateDataCheck = await commonObject.characterLimitCheck(
    reqData.ADDRESS_LINE2,
    "ADDRESS_LINE2"
  );
  if (validateDataCheck.success == false)
    return res.status(400).send({
      success: false,
      status: 400,
      message: validateDataCheck.message,
    });
  finalData.ADDRESS_LINE2 = validateDataCheck.data;

  validateDataCheck = await commonObject.characterLimitCheck(
    reqData.CITY_STATE,
    "CITY_STATE"
  );
  if (validateDataCheck.success == false)
    return res.status(400).send({
      success: false,
      status: 400,
      message: validateDataCheck.message,
    });
  finalData.CITY_STATE = validateDataCheck.data;

  if (isEmpty(reqData.ZIP_CODE))
    return res
      .status(400)
      .send({ success: false, status: 400, message: "Please give zip code." });

  let validateId = await commonObject.checkItsNumber(reqData.ZIP_CODE);
  if (validateId.success == false)
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Zip code should be number.",
    });
  finalData.ZIP_CODE = validateId.data;

  // email

  if (isEmpty(reqData.EMAIL)) {
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
  }

  if (isEmpty(reqData.MOBILE_NUMBER))
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
    });
  finalData.MOBILE_NUMBER = reqData.MOBILE_NUMBER;

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
    let result = await supplierSiteCreationModel.updateById(id, finalData);
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
    id: willUpdate ? null : siteId,
    message: willUpdate
      ? "Supplier site info update successfully done"
      : "Supplier site info successfully add.",
    
  });
});
*/

router.post(
  "/site-ou",
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    let userId = req.body.USER_ID;
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
  }
);

router.post(
  "/site-ou-list",
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    //let userId = req.body.USER_ID;
    let reqData = {
      userId: req.body.USER_ID,
      SITE_ID: req.body.SITE_ID,
    };
    let result = {
      message: `Site Operating Unit List`,
      status: 200,
      data: [],
    };
    if (isEmpty(reqData.SITE_ID)) {
      return res
        .status(400)
        .send({ message: "Enter Site ID", status: 400, success: false });
    }

    let queryResult = await supplierSiteCreationModel.siteOUList(
      reqData.userId,
      reqData.SITE_ID
    );

    await commonObject.makeArrayObject(queryResult);
    result.data = queryResult.queryResult.finalData;
    return res.status(200).send(result);
  }
);

router.post(
  "/site-rfq-payable-purchase-selection",
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    let userId = req.body.USER_ID;
    let reqData = {
      ID: req.body.ID,
      RFQ: req.body.RFQ,
      PAYABLE: req.body.PAYABLE,
      PURCHASING: req.body.PURCHASING,
    };
    LAST_UPDATED_BY = userId;
    let result = {
      message: ``,
      status: 200,
    };
    let finalData = {};
    if (isEmpty(reqData.ID)) {
      return res
        .status(400)
        .send({ message: "Enter Site ID", status: 400, success: false });
    }
    //finalData.ID = reqData.ID;
    finalData.RFQ = reqData.RFQ;
    finalData.PAYABLE = reqData.PAYABLE;
    finalData.PURCHASING = reqData.PURCHASING;
    finalData.LAST_UPDATED_BY = userId;

    let queryResult = await supplierSiteCreationModel.updateRFQPayablePurchaseById(reqData.ID,finalData);
    if (!queryResult || queryResult.rowsAffected == undefined || queryResult.rowsAffected < 1)
    return res.status(500).send({ "success": false, "status": 500, "message": "Something Wrong in system database." });
    return res.status(200).send({
      "success": true,
      "status": 200,
      "message": "Information updated successfully"
  });
    return res.status(200).send(result);
  }
);
module.exports = router;
