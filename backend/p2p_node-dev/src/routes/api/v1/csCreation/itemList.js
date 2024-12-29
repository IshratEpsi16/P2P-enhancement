const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const csModel = require("../../../../models/api/v1/csCreation/itemList");
//const getUserRolePermission = require("../authentication/authorization_role_permission");
const {
  userPermissionAuthorization,
  userRoleAuthorization,
} = require("../../../../middleware/authorization");
const isEmpty = require("is-empty");

router.post(`/list`, verifyToken, userRoleAuthorization, async (req, res) => {
  try {
    let finalData = {};
    let value = {
      message: `Item List`,
      status: 200,
      total: 0,
      data: [],
    };
    //userId = req.user ? req.user.USER_ID : null;
    let reqData = {
      RFQ_ID: req.body.RFQ_ID,
    };
    if (isEmpty(reqData.RFQ_ID)) {
      return res
        .status(400)
        .send({ message: "Please Give RFQ ID", status: 400 });
    }
    finalData.RFQ_ID = reqData.RFQ_ID;

    // Total Count
    // let queryResultTotal = await csModel.rfiTotal(
    //   reqData.RFQ_ID
    // );
    // await commonObject.makeArrayObject(queryResultTotal);
    // let rowObject = await commonObject.convertArrayToObject(
    //   queryResultTotal.queryResult.finalData
    // );
    //value.total = rowObject.TOTAL;
    // List
    let queryResultList = await csModel.itemList(finalData);
    await commonObject.makeArrayObject(queryResultList);
    value.data = queryResultList.queryResult.finalData;
    value.total = queryResultList.queryResult.finalData.length;
    return res.status(200).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(
  `/po-history`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    try {
      let finalData = {};
      let value = {
        message: `PO History`,
        status: 200,
        data: [],
      };
      //userId = req.user ? req.user.USER_ID : null;
      let reqData = {
        ITEM_ID: req.body.ITEM_ID,
      };
      if (isEmpty(reqData.ITEM_ID)) {
        return res
          .status(400)
          .send({ message: "Please Give Item ID", status: 400 });
      }

      // List
      let queryResultList = await csModel.itemPoHistory(reqData.ITEM_ID);
      await commonObject.makeArrayObject(queryResultList);
      value.data = queryResultList.queryResult.finalData;
      return res.status(200).json(value);
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

router.post(
  `/pr-history`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    try {
      let finalData = {};
      let value = {
        message: `PR History`,
        status: 200,
        data: [],
      };
      //userId = req.user ? req.user.USER_ID : null;
      let reqData = {
        REQUISITION_HEADER_ID: req.body.REQUISITION_HEADER_ID,
        REQUISITION_LINE_ID: req.body.REQUISITION_LINE_ID,
        PR_NUMBER: req.body.PR_NUMBER,
        ORG_ID: req.body.ORG_ID,
        ITEM_ID: req.body.ITEM_ID,
      };
      if (isEmpty(reqData.REQUISITION_HEADER_ID)) {
        return res
          .status(400)
          .send({ message: "Please Requisition Header ID", status: 400 });
      }
      if (isEmpty(reqData.REQUISITION_LINE_ID)) {
        return res
          .status(400)
          .send({ message: "Please Requisition Line ID", status: 400 });
      }
      if (isEmpty(reqData.PR_NUMBER)) {
        return res
          .status(400)
          .send({ message: "Please PR Number", status: 400 });
      }
      if (isEmpty(reqData.ORG_ID)) {
        return res
          .status(400)
          .send({ message: "Please Org ID", status: 400 });
      }
      if (isEmpty(reqData.ITEM_ID)) {
        return res
          .status(400)
          .send({ message: "Please Item ID", status: 400 });
      }

      let prResult,
        consumptionResult = {};
      [prResult, consumptionResult] = await Promise.all([
        csModel.itemPRHistory(
          reqData.REQUISITION_HEADER_ID,
          reqData.REQUISITION_LINE_ID,
          reqData.PR_NUMBER
        ),
        csModel.itemConsumption(reqData.ORG_ID, reqData.ITEM_ID),
      ]);

      await Promise.all([
        commonObject.makeArrayObject(prResult),
        commonObject.makeArrayObject(consumptionResult),
      ]);

      let consumptionObject = await commonObject.convertArrayToObject(
        consumptionResult.queryResult.finalData
      );
      let list = prResult.queryResult.finalData;
      list = list.map((item) => ({
        ...item,
        YEARLY: consumptionObject.YEARLY,
        HALF_YEARLY: consumptionObject.HALF_YEARLY,
        QUARTERLY: consumptionObject.QUARTERLY,
      }));

      value.data = list;
      return res.status(200).json(value);
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

module.exports = router;
