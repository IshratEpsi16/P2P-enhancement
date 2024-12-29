const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const supplierListModel = require("../../../../models/api/v1/csCreation/supplierList");
//const getUserRolePermission = require("../authentication/authorization_role_permission");
const {
  userPermissionAuthorization,
  userRoleAuthorization,
} = require("../../../../middleware/authorization");
const isEmpty = require("is-empty");

router.post(
  `/list-and-items`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    try {
      let finalData = {};
      let value = {
        message: `Suppliers and Item List`,
        status: 200,
        total_supplier: 0,
        data: [],
      };
      //userId = req.user ? req.user.USER_ID : null;
      let reqData = {
        RFQ_ID: req.body.RFQ_ID,
        RFQ_LINE_ID: req.body.RFQ_LINE_ID,
        ORG_ID: req.body.ORG_ID,
        OFFSET: req.body.OFFSET,
        LIMIT: req.body.LIMIT,
      };
      console.log(reqData);
      if (isEmpty(reqData.RFQ_ID)) {
        return res
          .status(400)
          .send({ message: "Please Give RFQ ID", status: 400 });
      }
      if (isEmpty(reqData.RFQ_LINE_ID)) {
        return res
          .status(400)
          .send({ message: "Please Give RFQ Line ID", status: 400 });
      }
      if (!Array.isArray(reqData.RFQ_LINE_ID)) {
        return res
          .status(400)
          .send({ message: "RFQ Line ID Should Be Array", status: 400 });
      }

      // Total Count
      let queryResultTotal = await supplierListModel.supplierListTotal(
        reqData.RFQ_ID,
        reqData.RFQ_LINE_ID,
        reqData.ORG_ID,
        reqData.OFFSET,
        reqData.LIMIT
      );
      await commonObject.makeArrayObject(queryResultTotal);
      let rowObject = await commonObject.convertArrayToObject(
        queryResultTotal.queryResult.finalData
      );
      value.total_supplier = rowObject.TOTAL;
      // List
      let queryResultList = await supplierListModel.supplierList(
        reqData.RFQ_ID,
        reqData.RFQ_LINE_ID,
        reqData.ORG_ID,
        reqData.OFFSET,
        reqData.LIMIT
      );
      await commonObject.makeArrayObject(queryResultList);
      for (let i = 0; i < queryResultList.queryResult.finalData.length; i++) {
        let itemResult = await supplierListModel.itemListOfSupplier(
          reqData.RFQ_ID,
          reqData.RFQ_LINE_ID,
          queryResultList.queryResult.finalData[i].USER_ID
        );
        await commonObject.makeArrayObject(itemResult);
        queryResultList.queryResult.finalData[i].Items =
          itemResult.queryResult.finalData;
        for (
          let j = 0;
          j < queryResultList.queryResult.finalData[i].Items.length;
          j++
        ) {
          if (
            isEmpty(
              queryResultList.queryResult.finalData[i].Items[j].RECOMMENDED
            )
          ) {
            queryResultList.queryResult.finalData[i].Items[j].RECOMMENDED = "N";
          }
          if (
            isEmpty(queryResultList.queryResult.finalData[i].Items[j].AWARDED)
          ) {
            queryResultList.queryResult.finalData[i].Items[j].AWARDED = "N";
          }
        }
      }

      value.data = queryResultList.queryResult.finalData;

      // Find the maximum number of items and all unique RFQ_LINE_IDs
      const allRfqLineIds = new Set();
      const maxItems = Math.max(
        ...value.data.map((supplier) => {
          supplier.Items.forEach((item) => allRfqLineIds.add(item.RFQ_LINE_ID));
          return supplier.Items.length;
        })
      );

      // Convert Set to sorted array
      const sortedRfqLineIds = Array.from(allRfqLineIds).sort((a, b) => a - b);

      // Function to create a default item
      function createDefaultItem(rfqLineId) {
        return {
          QUOT_LINE_ID: 0,
          RFQ_LINE_ID: rfqLineId,
          RFQ_ID: 0,
          USER_ID: 0,
          WARRANTY_BY_SUPPLIER: "N/A",
          SUPPLIER_VAT_APPLICABLE: "N/A",
          UNIT_PRICE: 0,
          OFFERED_QUANTITY: 0,
          PROMISE_DATE: null,
          SUP_FILE_ORG_NAME: "N/A",
          SUP_FILE_NAME: "N/A",
          CREATION_DATE: null,
          CREATED_BY: "N/A",
          LAST_UPDATED_BY: "N/A",
          LAST_UPDATE_DATE: null,
          AVAILABLE_BRAND_NAME: "N/A",
          AVAILABLE_ORIGIN: "N/A",
          AVAILABLE_SPECS: "N/A",
          TOLERANCE: 0,
          TOTAL_LINE_AMOUNT: 0,
          VAT_TYPE: "N/A",
          VAT_AMOUNT: 0,
          LINE_STATUS: "N/A",
          FREIGHT_CHARGE: "N/A",
          // ... add all other fields with default values
        };
      }

      // Normalize the Items array for each supplier
      value.data = value.data.map((supplier) => {
        const itemMap = new Map(
          supplier.Items.map((item) => [item.RFQ_LINE_ID, item])
        );

        supplier.Items = sortedRfqLineIds.map((rfqLineId) => {
          return itemMap.get(rfqLineId) || createDefaultItem(rfqLineId);
        });

        return supplier;
      });

      //console.log(JSON.stringify(value, null, 2));

      return res.status(200).json(value);
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

module.exports = router;
