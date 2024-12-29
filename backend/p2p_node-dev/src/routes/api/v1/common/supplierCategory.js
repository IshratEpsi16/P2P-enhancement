const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const supplierCategory = require("../../../../models/api/v1/common/supplierCategory");
//const getUserRolePermission = require("../authentication/authorization_role_permission");

const isEmpty = require("is-empty");

router.post(`/list`, verifyToken, async (req, res) => {
  try {
    let value = {
      message: `Category List`,
      status: 200,
      data: [],
    };
    let reqData = {
      SUPPLIER_ID: req.body.SUPPLIER_ID,
    };
    if (isEmpty(reqData.SUPPLIER_ID)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Please Give Supplier ID.",
      });
    }

    // Category List
    let queryResult = await supplierCategory.categoryList(reqData.SUPPLIER_ID);
    await commonObject.makeArrayObject(queryResult);
    value.data = queryResult.queryResult.finalData;
    return res.status(200).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post("/add-remove", [verifyToken], async (req, res) => {
  let userId = req.decoded.USER_ID; // now fix, but it will dynamic;

  let reqData = {
    ID: req.body.ID,
    SUPPLIER_ID: req.body.SUPPLIER_ID,
    ORGANIZATION_ID: req.body.ORGANIZATION_ID,
    VENDOR_LIST_NAME: req.body.VENDOR_LIST_NAME,
    STATUS: req.body.STATUS,
  };

  // SUPPLIER_USER_ID,
  // ORGANIZATION_ID,
  // VENDOR_LIST_NAME,
  // STATUS,
  // CREATED_BY,

  let id = req.body.ID;
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

    willUpdate = true;
  }

  if (isEmpty(reqData.SUPPLIER_ID)) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Please Give Supplier ID.",
    });
  }
  if (isEmpty(reqData.ORGANIZATION_ID)) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Please Give ORG ID.",
    });
  }
  if (isEmpty(reqData.VENDOR_LIST_NAME)) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Please Give Category Name.",
    });
  }
  if (isEmpty(reqData.STATUS) && isEmpty(id)) {
    reqData.STATUS = 1;
  }

  finalData.SUPPLIER_USER_ID = reqData.SUPPLIER_ID;
  finalData.ORGANIZATION_ID = reqData.ORGANIZATION_ID;
  finalData.VENDOR_LIST_NAME = reqData.VENDOR_LIST_NAME;
  finalData.STATUS = reqData.STATUS;

  if (willUpdate) {
    console.log(id);
    finalData.LAST_UPDATED_BY = userId;
    if (isEmpty(finalData))
      return res.status(200).send({
        success: true,
        status: 200,
        message: "Update successfully done.",
      });

    // update
    let result = await supplierCategory.updateById(id, userId, reqData.STATUS);
    console.log(result);
    if (!result || result.rowsAffected == undefined || result.rowsAffected < 1)
      return res.status(500).send({
        success: false,
        status: 500,
        message: "Something Wrong in system database.",
      });
  } else {
    finalData.CREATED_BY = userId;
    let isExist = await supplierCategory.categoryIsExist(
      reqData.SUPPLIER_ID,
      reqData.ORGANIZATION_ID,
      reqData.VENDOR_LIST_NAME,
      reqData.STATUS
    );
    await commonObject.makeArrayObject(isExist);
    console.log(isExist.queryResult.finalData);
    let rowObject = await commonObject.convertArrayToObject(isExist.queryResult.finalData);
    console.log(rowObject);
    if (!isEmpty(rowObject)) {
      return res.status(500).send({
        success: false,
        status: 500,
        message: "The Category Already Exist For This Supplier",
      });
    }

    let result = await supplierCategory.addNew(finalData);
    console.log(result);
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
      ? reqData.STATUS == 0
        ? "Supplier Category Removed Successfully"
        : "Supplier Category Added Successfully"
      : "Supplier Category Added Successfully",
  });
});

module.exports = router;
