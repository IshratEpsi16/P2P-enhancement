const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const commonObject = require("../../../../common/api/v1/common");
const templateModel = require("./../../../../models/api/v1/approvalTemplate/templateAddUpdate");
const oracledb = require("oracledb");
const isEmpty = require("is-empty");
const {
  userRoleAuthorization,
} = require("../../../../middleware/authorization");

router.post(
  `/add-update`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    try {
      let value = {
        message: ``,
        status: 200,
        templateId: 0,
      };
      let userId;
      userId = req.user ? req.user.USER_ID : null;
      let willUpdate = false;
      let finalData = {};

      let reqBody = {
        AS_ID: req.body.AS_ID,
        APPROVAL_STAGE_NAME: req.body.TEMPLATE_NAME,
        MODULE_ID: req.body.MODULE_ID,
        APPROVAL_FLOW_TYPE: req.body.APPROVAL_FLOW_TYPE,
        CURRENCY_CODE: req.body.CURRENCY_CODE,
        CURRENCY_NAME: req.body.CURRENCY_NAME,
        ORG_ID: req.body.ORG_ID,
        ORG_NAME: req.body.ORG_NAME,
        MIN_AMOUNT: req.body.MIN_AMOUNT,
        MAX_AMOUNT: req.body.MAX_AMOUNT,
      };
      console.log('Req: ',reqBody);

      Object.entries(reqBody).forEach(([key, value]) => {
        // Check if value is not undefined, null, or an empty string
        if (value !== undefined && value !== null && value !== "") {
          finalData[key] = value;
        }
      });

      finalData.CREATED_BY = userId;
      console.log(finalData);

      if (!isEmpty(reqBody.AS_ID)) {
        willUpdate = true;
      }
      if (isEmpty(reqBody.AS_ID)) {
        let userQueryResult = await templateModel.templateCreate(finalData);
        if (
          !isEmpty(userQueryResult.outBinds[0][0]) ||
          userQueryResult.outBinds[0][0] != undefined
        ) {
          value.message = "Template Created Successfully.";
          value.status = 200;
          return res.status(value.status).json(value);
        } else {
          value.message = "Template Not Created.";
          value.status = 400;
          return res.status(value.status).json(value);
        }
      }
      if (willUpdate) {
        let userQueryResult = await templateModel.templateUpdate(
          reqBody.AS_ID,
          finalData
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
  }
);

router.get(`/list`, verifyToken, async (req, res) => {
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

router.post(`/delete`, verifyToken, async (req, res) => {
  try {
    let reqBody = { TEMPLATE_ID: req.body.TEMPLATE_ID };

    let value = {
      message: ``,
      status: 200,
    };

    let userQueryResult = await templateModel.templateDelete(
      reqBody.TEMPLATE_ID
    );
    //console.log(userQueryResult);
    value.message = userQueryResult.outBinds.MESSAGE;
    value.status = userQueryResult.outBinds.STATUS;
    return res.status(200).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

module.exports = router;
