const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const commonObject = require("../../../../common/api/v1/common");
const templateModel = require("./../../../../models/api/v1/approvalTemplate/templateManage");
const oracledb = require("oracledb");
const isEmpty = require("is-empty");
const {
  userRoleAuthorization,
} = require("../../../../middleware/authorization");
router.post(`/create`, verifyToken, userRoleAuthorization, async (req, res) => {
  try {
    let userId;
    userId = req.user ? req.user.USER_ID : null;
    let value = {
      message: ``,
      status: 200,
    };
    let updateData = {};
    let whereData = {};
    let finalData = {};
    let reqData = {
      APPROVAL_STAGE_NAME: req.body.TEMPLATE_NAME,
      MODULE_TYPE_ID: req.body.MODULE_ID,
      ID: req.body.ID,
      APPROVAL_FLOW_TYPE: req.body.APPROVAL_FLOW_TYPE,
      BUYER_DEPARTMENT: req.body.BUYER_DEPARTMENT,
      CURRENCY_CODE: req.body.CURRENCY_CODE,
      CURRENCY_NAME: req.body.CURRENCY_NAME,
      ORG_ID: req.body.ORG_ID,
      ORG_NAME: req.body.ORG_NAME,
      MIN_AMOUNT: req.body.MIN_AMOUNT,
      MAX_AMOUNT: req.body.MAX_AMOUNT,
    };

    if (!isEmpty(reqData.MIN_AMOUNT) || !isEmpty(reqData.MIN_AMOUNT)) {
      if (reqData.MIN_AMOUNT >= reqData.MAX_AMOUNT) {
        value.message = "Minimum Amount Should Be Less Then Max Amount.";
        value.status = 400;
        return res.status(value.status).json(value);
      }
    }

    Object.entries(reqData).forEach(([key, value]) => {
      // Check if value is not undefined, null, or an empty string
      if (value !== undefined && value !== null && value !== "") {
        finalData[key] = value;
      }
    });

    finalData.CREATED_BY = userId;
    console.log('finalData: ',finalData);
    //Check Name Exist
    let checkNameResult,checkName = {};
    checkName.APPROVAL_FLOW_TYPE = finalData.APPROVAL_FLOW_TYPE;
    checkName.MODULE_TYPE_ID = finalData.MODULE_TYPE_ID;
    checkName.ORG_ID = finalData.ORG_ID;
    checkName.BUYER_DEPARTMENT = finalData.BUYER_DEPARTMENT;
    checkName.MIN_AMOUNT = finalData.MAX_AMOUNT;
    checkName.MAX_AMOUNT = finalData.MAX_AMOUNT;
    if (isEmpty(reqData.ID)) {
      try {
        checkNameResult = await templateModel.checkNameExist(
          checkName
        );
        console.log('Name: ',checkNameResult);

        await commonObject.makeArrayObject(checkNameResult);
      } catch (error) {
        value.message = error;
        value.status = 400;
        return res.status(value.status).json(value);
      }
      if (!isEmpty(checkNameResult.queryResult.finalData)) {
        value.message = "The selected combination already exists. Please choose a different one.";
        value.status = 400;
        return res.status(value.status).json(value);
      }
    }

    if (isEmpty(reqData.ID)) {
      let userQueryResult = await templateModel.templateCreate(finalData);
      console.log(userQueryResult);
      if (
        !isEmpty(userQueryResult.outBinds[0][0]) ||
        userQueryResult.outBinds[0][0] != undefined
      ) {
        value.message = "Template Created Successfully.";
        value.status = 200;
        value.templateId = userQueryResult.outBinds[0][0];
        return res.status(value.status).json(value);
      } else {
        value.message = "Template Not Created.";
        value.status = 400;
        return res.status(value.status).json(value);
      }
    } else if (!isEmpty(reqData.ID)) {
      Object.entries(finalData).forEach(([key, value]) => {
        // Check if value is not undefined, null, or an empty string
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          key != "ID"
        ) {
          updateData[key] = value;
        }
      });
      whereData.AS_ID = reqData.ID;

      let userQueryResult = await templateModel.templateUpdate(
        updateData,
        whereData
      );
      if (userQueryResult.rowsAffected > 0 || userQueryResult != undefined) {
        value.message = "Template Updated Successfully.";
        value.status = 200;
        return res.status(value.status).json(value);
      } else {
        value.message = "Template Not Update.";
        value.status = 400;
        return res.status(value.status).json(value);
      }
    }
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.get(`/list`, verifyToken, userRoleAuthorization, async (req, res) => {
  try {
    let value = {
      message: `Template List`,
      status: 200,
      data: [],
    };

    let userQueryResult = await templateModel.templateList();
    await commonObject.makeArrayObject(userQueryResult);
    value.data = userQueryResult.queryResult.finalData;
    return res.status(200).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(`/delete`, verifyToken, userRoleAuthorization, async (req, res) => {
  try {
    let reqData = { ID: req.body.ID };

    let value = {
      message: ``,
      status: 200,
    };
    if (isEmpty(reqData.ID)) {
      let value = {
        message: `Enter ID`,
        status: 400,
      };
      return res.status(400).json(value);
    } else {
      let userQueryResult = await templateModel.templateDelete(reqData.ID);
      //console.log(userQueryResult);
      value.message = userQueryResult.outBinds.MESSAGE;
      value.status = userQueryResult.outBinds.STATUS;
      return res.status(200).json(value);
    }
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(
  `/details`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    try {
      let reqBody = { ID: req.body.ID };

      let value = {
        message: `Template Details`,
        status: 200,
        data: {},
      };

      let userQueryResult = await templateModel.templateDetails(reqBody.ID);
      //console.log(userQueryResult);
      await commonObject.makeArrayObject(userQueryResult);

      let rowObject = await commonObject.convertArrayToObject(
        userQueryResult.queryResult.finalData
      );
      value.data = rowObject;
      console.log(rowObject);
      return res.status(200).json(value);
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

//! not completed
router.post(
  `/template-id-found`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    try {
      let reqBody = { ID: req.body.ID };

      let value = {
        message: `Template Details`,
        status: 200,
        data: {},
      };

      let userQueryResult = await templateModel.anyTemplateIDFind(reqBody.ID);
      //console.log(userQueryResult);
      await commonObject.makeArrayObject(userQueryResult);

      let rowObject = await commonObject.convertArrayToObject(
        userQueryResult.queryResult.finalData
      );
      value.data = rowObject;
      console.log(rowObject);
      return res.status(200).json(value);
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

module.exports = router;
