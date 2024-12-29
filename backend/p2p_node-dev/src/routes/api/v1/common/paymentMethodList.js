const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const paymentMethodList = require("./../../../../models/api/v1/common/paymentMethodList");
const {
  userPermissionAuthorization,
  userRoleAuthorization,
} = require("../../../../middleware/authorization");
const isEmpty = require("is-empty");


router.get(`/list`, verifyToken, async (req, res) => {
  try {
    let value = {
      message: `Payment Methods List`,
      status: 200,
      data: [],
    };

    // Payment Methods List
    let queryResult = await paymentMethodList.paymentMethodList();
    await commonObject.makeArrayObject(queryResult);
    value.data = queryResult.queryResult.finalData;
    return res.status(200).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(`/add`, verifyToken, userRoleAuthorization, async (req, res) => {
  try {
    let userId = req.body.USER_ID;
    let value = {
      message: `Payment Methods`,
      status: 200,
    };

    let reqData = {
      SUPPLIER_ID: req.body.SUPPLIER_ID,
      CODE: req.body.CODE,
    };

    // Payment Methods List
    let queryResult = await paymentMethodList.addPaymentMethod(
      userId,
      reqData.SUPPLIER_ID,
      reqData.CODE
    );
    value.message =queryResult.outBinds.MESSAGE;
    value.status = queryResult.outBinds.STATUS;
    return res.status(value.status).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(`/suppliers-payment-method`, verifyToken, userRoleAuthorization, async (req, res) => {
  try {
    let value = {
      message: `Supplier Payment Methods`,
      status: 200,
      data:{}
    };

    let reqData = {
      SUPPLIER_ID: req.body.SUPPLIER_ID
    };
    if (isEmpty(reqData.SUPPLIER_ID)) {
      return res
        .status(400)
        .send({ message: "Enter Supplier ID", status: 400});
    }

    // Payment Methods List
    let queryResult = await paymentMethodList.supplierPaymentMethod(
      reqData.SUPPLIER_ID,
    );
    console.log(queryResult);
    
    await commonObject.makeArrayObject(queryResult);
    
    let rowObject =await commonObject.convertArrayToObject(queryResult.queryResult.finalData);
    value.data = rowObject;
    return res.status(value.status).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

module.exports = router;
