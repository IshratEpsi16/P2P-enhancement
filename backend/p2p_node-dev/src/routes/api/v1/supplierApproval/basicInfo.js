const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();

const supplierBasicModel = require("../../../../models/api/v1/supplierApproval/supplierRegistrationBasic");
const commonObject = require("../../../../common/api/v1/common");
const fileUploaderCommonObject = require("../../../../common/api/v1/fileUploader");

const verifyToken = require("../../../../middleware/jwtValidation");
const {
  userRoleAuthorization,
} = require("../../../../middleware/authorization");


router.post("/existing-details", [verifyToken,userRoleAuthorization], async (req, res) => {
  let userId = req.body.USER_ID;

  let result = {
    message: `Supplier basic details`,
    status: 200,
    success: true,
    data: {},
  };

  let queryResult = await supplierBasicModel.getDataByWhereCondition(
    { user_id: userId },
    { id: "DESC" },
    1
  );

  await commonObject.processDbDataToArrayObject({ queryResult }); // pass reference

  if (isEmpty(queryResult) || isEmpty(queryResult.rows)) {
    result.data = {
      USER_ID: userId,
      ORGANIZATION_NAME: null,
      SUPPLIER_ADDRESS: null,
      ORGANIZATION_TYPE: null,
      INCORPORATE_IN: null,
      CATEGORY_ID: null,
    };
  } else result.data = queryResult.finalData[0];

  return res.status(200).send(result);
});

/*
router.post("/add", [verifyToken], async (req, res) => {
  let userId = req.decoded.USER_ID; // now fix, but it will dynamic;

  let reqData = {
    ORGANIZATION_NAME: req.body.organization_name,
    SUPPLIER_ADDRESS: req.body.supplier_address,
    INCORPORATE_IN: req.body.incorporate_in,
    ORGANIZATION_TYPE: req.body.organization_type,
    CATEGORY_ID: req.body.category_id,
  };

  let id = 0;
  let willUpdate = false;
  let finalData = {};
  let currentTime = await commonObject.getTodayDateTime();

  let queryResult = await supplierBasicModel.getDataByWhereCondition(
    { user_id: userId },
    { id: "DESC" },
    1,
    0,
    ["id"]
  );

  if (!isEmpty(queryResult) && !isEmpty(queryResult.rows)) {
    willUpdate = true;
    for (const orgRow of queryResult.rows) {
      id = orgRow[0];
      break;
    }
  }

  let validateDataCheck = await commonObject.characterLimitCheck(
    reqData.ORGANIZATION_NAME,
    "Organization name"
  );

  if (validateDataCheck.success == false)
    return res
      .status(400)
      .send({
        success: false,
        status: 400,
        message: validateDataCheck.message,
      });
  finalData.ORGANIZATION_NAME = validateDataCheck.data;

  validateDataCheck = await commonObject.characterLimitCheck(
    reqData.SUPPLIER_ADDRESS,
    "Supplier Address"
  );

  if (validateDataCheck.success == false)
    return res
      .status(400)
      .send({
        success: false,
        status: 400,
        message: validateDataCheck.message,
      });
  finalData.SUPPLIER_ADDRESS = validateDataCheck.data;

  validateDataCheck = await commonObject.characterLimitCheck(
    reqData.INCORPORATE_IN,
    "Incorporate in"
  );

  if (validateDataCheck.success == false)
    return res
      .status(400)
      .send({
        success: false,
        status: 400,
        message: validateDataCheck.message,
      });
  finalData.INCORPORATE_IN = validateDataCheck.data;

  //if (isEmpty(reqData.ORGANIZATION_TYPE)) return res.status(400).send({ "success": false, "status": 400, "message": "Please select organization type." });

  //let validateId = await commonObject.checkItsNumber(reqData.ORGANIZATION_TYPE);
  //if (validateId.success == false) return res.status(400).send({ "success": false, "status": 400, "message": "Organization type should be number. Organization type should be 1: Proprietorship, 2: Partnership, 3: Private Limited Company, 4: Limited Company, 5: Government 6: Others." });
  validateDataCheck = await commonObject.characterLimitCheck(
    reqData.ORGANIZATION_TYPE,
    "Organization Type"
  );

  if (validateDataCheck.success == false)
    return res
      .status(400)
      .send({
        success: false,
        status: 400,
        message: validateDataCheck.message,
      });
  finalData.ORGANIZATION_TYPE = validateDataCheck.data;

  //if (![1, 2, 3, 4, 5, 6].includes(finalData.ORG_TYPE_ID)) return res.status(400).send({ "success": false, "status": 400, "message": "Organization type should be 1: Proprietorship, 2: Partnership, 3: Private Limited Company, 4: Limited Company, 5: Government 6: Others." });

  validateDataCheck = await commonObject.characterLimitCheck(
    reqData.CATEGORY_ID,
    "Item Category"
  );

  if (validateDataCheck.success == false)
    return res
      .status(400)
      .send({
        success: false,
        status: 400,
        message: validateDataCheck.message,
      });
  finalData.CATEGORY_ID = validateDataCheck.data;

  //if (isEmpty(reqData.CATEGORY_ID)) return res.status(400).send({ "success": false, "status": 400, "message": "Please select category." });

  // validateId = await commonObject.checkItsNumber(reqData.CATEGORY_ID);
  // if (validateId.success == false) return res.status(400).send({ "success": false, "status": 400, "message": "Category id should be number." });
  // finalData.CATEGORY_ID = validateId.data;

  // need to add category id validation

  finalData.LAST_UPDATED_BY = userId;
  finalData.LAST_UPDATE_DATE = currentTime;

  if (willUpdate) {
    if (isEmpty(finalData))
      return res
        .status(200)
        .send({
          success: true,
          status: 200,
          message: "Update successfully done.",
        });

    // update
    let result = await supplierBasicModel.updateById(id, finalData);
    if (!result || result.rowsAffected == undefined || result.rowsAffected < 1)
      return res
        .status(500)
        .send({
          success: false,
          status: 500,
          message: "Something Wrong in system database.",
        });
  } else {
    finalData.USER_ID = userId;
    finalData.CREATED_BY = userId;
    finalData.CREATION_DATE = currentTime;

    let result = await supplierBasicModel.addNew(finalData);
    if (!result || result.rowsAffected == undefined || result.rowsAffected < 1)
      return res
        .status(500)
        .send({
          success: false,
          status: 500,
          message: "Something Wrong in system database.",
        });
  }

  return res.status(200).send({
    success: true,
    status: 200,
    message: willUpdate
      ? "Basic information update successfully done"
      : "Basic information successfully add.",
  });
});
*/

router.get(`/item-list`, verifyToken,userRoleAuthorization, async (req, res) => {
  try {
    let value = {
        message: `Item Category List`,
        status: 200,
        data: []
      };
  
      let userQueryResult = await supplierBasicModel.itemCategoryList();
      await commonObject.makeArrayObject(userQueryResult);
      value.data = userQueryResult.queryResult.finalData;
      return res.status(200).json(value);
  
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});
module.exports = router;
