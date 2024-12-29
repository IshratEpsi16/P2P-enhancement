const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../../common/api/v1/common");
const isEmpty = require("is-empty");
const logger = require("../../../../../common/api/v1/logger");
const poModel = require("../../../../../models/api/v1/pr2po/po/po");
const axios = require("axios");
const ouModel = require("./../../../../../models/api/v1/common/orgNameById");
const rfqModel = require("../../../../../models/api/v1/pr2po/pr/rfqPreparation");
const currencyList = require("../../../../../models/api/v1/common/currencyList");
const p2pCache = require("../../../../../common/api/v1/cache");
const pendingInvoiceModel = require("../../../../../models/api/v1/pendingApplication/pendingInvoice");
require("dotenv").config();

router.post(`/list`, verifyToken, async (req, res) => {
  let rfqHeaderFile = `${process.env.backend_url}${process.env.rfq_header_file_path_name}`;
  let rfqHeaderTermFile = `${process.env.backend_url}${process.env.rfq_header_term_file_path_name}`;
  let poPath = `${process.env.backend_url}${process.env.po_file_path_name}`;
  let finalData = {};
  let whereData = {};
  let columns = [];
  userId = req.user ? req.user.USER_ID : null;
  let token = req.headers.authorization;
  token = req.headers.authorization.split(" ")[1];
  try {
    let value = {
      message: ``,
      status: 200,
      total: 0,
      header_file_path: rfqHeaderFile,
      header_term_file_path: rfqHeaderTermFile,
      po_file_path: poPath,
      data: [],
    };
    let reqData = {
      PO_HEADER_ID: req.body.PO_HEADER_ID,
      PO_NUMBER: req.body.PO_NUMBER,
      PO_STATUS: req.body.PO_STATUS,
      USER_ID: req.body.USER_ID,
      FROM_DATE: req.body.FROM_DATE,
      TO_DATE: req.body.TO_DATE,
      OFFSET: req.body.OFFSET,
      LIMIT: req.body.LIMIT,
    };
    console.log(reqData);

    if (reqData.OFFSET == null || reqData.OFFSET == "") {
      value.message = "PLease give offset.";
      value.status = 400;
      return res.status(value.status).json(value);
    }
    if (isEmpty(reqData.LIMIT)) {
      value.message = "PLease give limit.";
      value.status = 400;
      return res.status(value.status).json(value);
    }
    if (reqData.OFFSET == 1) reqData.OFFSET = 0;
    finalData.OFFSET = Number(reqData.OFFSET);
    finalData.LIMIT = Number(reqData.LIMIT);

    Object.entries(reqData).forEach(([key, value]) => {
      if (!isEmpty(value) && key != "OFFSET" && key != "LIMIT") {
        finalData[key] = value;
        columns.push(key);
      }
    });

    columns.forEach((key) => {
      whereData[key] = finalData[key];
    });

    let listQuery,
      totalQuery = {};

    [listQuery, totalQuery] = await Promise.all([
      poModel.byWhere(finalData),
      poModel.byWhereTotalCount(finalData),
    ]);
    await Promise.all([
      commonObject.makeArrayObject(totalQuery),
      commonObject.makeArrayObject(listQuery),
    ]);
    const list = listQuery.queryResult.finalData;
    console.log("Initial list length:", list.length);
    let total = await commonObject.convertArrayToObject(
      totalQuery.queryResult.finalData
    );
    value.total = total.TOTAL;

    // Location Cache
    const cachedLocationArray = p2pCache.get("locationArray") || [];
    const locationMap = new Map(
      cachedLocationArray.map((location) => [location.LOCATION_ID, location])
    );

    // Helper function to get location details
    const getLocationDetails = async (locationId) => {
      if (locationMap.has(locationId)) {
        return locationMap.get(locationId);
      } else {
        const queryResult = await pendingInvoiceModel.locationNBuyerName(
          locationId
        );
        await commonObject.makeArrayObject(queryResult);
        const details = await commonObject.convertArrayToObject(
          queryResult.queryResult.finalData
        );
        locationMap.set(locationId, details); // Update cache
        return details;
      }
    };

    // Process each item in the list concurrently
    const enhancedList = await Promise.all(
      list.map(async (item) => {
        // Currency for the item
        const [currencyResult, rfqResult, poAmountResult, supplierDetails] =
          await Promise.all([
            currencyList.currencyNameById(item.CURRENCY_CODE),
            rfqModel.rfqHeaderDetails({ RFQ_ID: item.RFQ_ID }),
            poModel.totalPOAmount(item.PO_HEADER_ID),
            poModel.supplierDetails(item.USER_ID, item.CREATED_BY),
          ]);

        await Promise.all([
          commonObject.makeArrayObject(currencyResult),
          commonObject.makeArrayObject(rfqResult),
          commonObject.makeArrayObject(poAmountResult),
          commonObject.makeArrayObject(supplierDetails),
        ]);

        const [
          rowObjectCurrency,
          rowObject,
          totalPOAmountObject,
          supplierDetailsObject,
        ] = await Promise.all([
          commonObject.convertArrayToObject(
            currencyResult.queryResult.finalData
          ),
          commonObject.convertArrayToObject(rfqResult.queryResult.finalData),
          commonObject.convertArrayToObject(
            poAmountResult.queryResult.finalData
          ),
          commonObject.convertArrayToObject(
            supplierDetails.queryResult.finalData
          ),
        ]);

        // Currency for RFQ details
        const rfqCurrencyResult = await currencyList.currencyNameById(
          rowObject.SUPLLIER_CURRENCY_CODE
        );
        await commonObject.makeArrayObject(rfqCurrencyResult);
        const rowObjectCurrencyDetails =
          await commonObject.convertArrayToObject(
            rfqCurrencyResult.queryResult.finalData
          );

        // OU Name
        const ouNameResult = await ouModel.ouListByID(rowObject.ORG_ID);
        await commonObject.makeArrayObject(ouNameResult);
        const ouNameObject = await commonObject.convertArrayToObject(
          ouNameResult.queryResult.finalData
        );

        // Shipping and Billing Details
        const [shippingDetails, billingDetails] = await Promise.all([
          getLocationDetails(rowObject.SHIP_TO_LOCATION_ID),
          getLocationDetails(rowObject.BILL_TO_LOCATION_ID),
        ]);

        return {
          ...item,
          CURRENCY: rowObjectCurrency.CURRENCY_NAME,
          RFQ_DETAILS: {
            ...rowObject,
            CURRENCY: rowObjectCurrencyDetails.CURRENCY_NAME,
          },
          SUPPLIER_ORGANIZATION_NAME: supplierDetailsObject.SUPPLIER_ORGANIZATION_NAME,
          SUPPLIER_ID: supplierDetailsObject.SUPPLIER_ID,
          BUYER_NAME: supplierDetailsObject.BUYER_NAME,
          BUYER_MOBILE_NUMBER: supplierDetailsObject.BUYER_MOBILE_NUMBER,
          SHORT_CODE: ouNameObject.SHORT_CODE,
          OU_NAME: ouNameObject.NAME,
          SHIP_TO_LOCATION: shippingDetails.LOCATION_CODE,
          BILL_TO_LOCATION: billingDetails.LOCATION_CODE,
          TOTAL_PO_AMOUNT: totalPOAmountObject.TOTAL_VALUE,
        };
      })
    );

    value.data = enhancedList;
    value.message = "PO List";
    value.status = 200;
    return res.status(value.status).json(value);
  } catch (error) {
    logger.info(error);
    logger.error(error);
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(`/update`, verifyToken, async (req, res) => {
  let whereData = {};
  let updateData = {};
  userId = req.user ? req.user.USER_ID : null;
  try {
    let value = {
      message: ``,
      status: 200,
    };
    let reqData = {
      INVITATION_ID: req.body.INVITATION_ID,
      PO_STATUS: req.body.PO_STATUS,
      PO_REMARKS: req.body.PO_REMARKS,
    };
    console.log(reqData);

    if (isEmpty(reqData.INVITATION_ID)) {
      value.message = "PLease Give Invitation ID.";
      value.status = 400;
      return res.status(value.status).json(value);
    }
    if (isEmpty(reqData.PO_STATUS)) {
      value.message = "PLease Give PO Status.";
      value.status = 400;
      return res.status(value.status).json(value);
    }

    if (reqData.PO_STATUS == "REJECTED") {
      if (isEmpty(reqData.PO_REMARKS)) {
        value.message = "PLease Give Reason For Rejection.";
        value.status = 400;
        return res.status(value.status).json(value);
      }
    }
    updateData.PO_STATUS = reqData.PO_STATUS;
    updateData.PO_REMARKS = reqData.PO_REMARKS;
    whereData.INVITATION_ID = reqData.INVITATION_ID;

    //! Data
    let queryResultUpdate = await poModel.poUpdate(updateData, whereData);

    console.log(queryResultUpdate);
    value.message =
      queryResultUpdate.rowsAffected > 0
        ? "Information Updated Successfully"
        : "Information Not Updated! Pease Try Again.";
    value.status = queryResultUpdate.rowsAffected > 0 ? 200 : 500;
    return res.status(value.status).json(value);
  } catch (error) {
    logger.info(error);
    logger.error(error);
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(`/details`, verifyToken, async (req, res) => {
  let finalData = {};
  let whereData = {};
  let columns = [];
  userId = req.user ? req.user.USER_ID : null;
  try {
    let value = {
      message: ``,
      status: 200,
      total: 0,
      data: [],
    };
    let reqData = {
      SHIPMENT_PO_HEADER_ID: req.body.PO_HEADER_ID,
      SHIPMENT_PO_NUMBER: req.body.PO_NUMBER,
      SHIPMENT_ID: req.body.SHIPMENT_ID,
      OFFSET: req.body.OFFSET,
      LIMIT: req.body.LIMIT,
    };
    console.log(reqData);

    if (reqData.OFFSET == null || reqData.OFFSET == "") {
      value.message = "PLease give offset.";
      value.status = 400;
      return res.status(value.status).json(value);
    }
    if (isEmpty(reqData.LIMIT)) {
      value.message = "PLease give limit.";
      value.status = 400;
      return res.status(value.status).json(value);
    }
    if (reqData.OFFSET == 1) reqData.OFFSET = 0;
    finalData.OFFSET = Number(reqData.OFFSET);
    finalData.LIMIT = Number(reqData.LIMIT);

    Object.entries(reqData).forEach(([key, value]) => {
      if (!isEmpty(value) && key != "OFFSET" && key != "LIMIT") {
        finalData[key] = value;
        columns.push(key);
      }
    });

    columns.forEach((key) => {
      whereData[key] = finalData[key];
    });

    //! Total
    let queryResultTotal = await poModel.detailsByWhereTotalCount(finalData);
    console.log(queryResultTotal);
    await commonObject.makeArrayObject(queryResultTotal);
    let total = await commonObject.convertArrayToObject(
      queryResultTotal.queryResult.finalData
    );
    value.total = total.TOTAL;
    console.log(finalData);
    //! Data
    let queryResult = await poModel.detailsByWhere(finalData);
    //console.log(queryResult);
    await commonObject.makeArrayObject(queryResult);

    value.data = queryResult.queryResult.finalData;
    value.message = "PO Details";
    value.status = 200;
    return res.status(value.status).json(value);
  } catch (error) {
    logger.info(error);
    logger.error(error);
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(`/item-details`, verifyToken, async (req, res) => {
  let finalData = {};
  let whereData = {};
  let columns = [];
  let buyerLineFile = `${process.env.backend_url}${process.env.rfq_buyer_lines_file_path_name}`;
  let supplierLineFile = `${process.env.backend_url}${process.env.rfq_supplier_lines_file_path_name}`;
  userId = req.user ? req.user.USER_ID : null;
  try {
    let value = {
      message: ``,
      status: 200,
      total: 0,
      buyer_line_file: buyerLineFile,
      supplier_line_file: supplierLineFile,
      data: [],
    };
    let reqData = {
      PO_HEADER_ID: req.body.PO_HEADER_ID,
      PO_NUMBER: req.body.PO_NUMBER,
      SHIPMENT_ID: req.body.SHIPMENT_ID,
      OFFSET: req.body.OFFSET,
      LIMIT: req.body.LIMIT,
    };
    console.log(reqData);

    if (reqData.OFFSET == null || reqData.OFFSET == "") {
      value.message = "PLease give offset.";
      value.status = 400;
      return res.status(value.status).json(value);
    }
    if (isEmpty(reqData.LIMIT)) {
      value.message = "PLease give limit.";
      value.status = 400;
      return res.status(value.status).json(value);
    }
    if (reqData.OFFSET == 1) reqData.OFFSET = 0;
    finalData.OFFSET = Number(reqData.OFFSET);
    finalData.LIMIT = Number(reqData.LIMIT);

    Object.entries(reqData).forEach(([key, value]) => {
      if (!isEmpty(value) && key != "OFFSET" && key != "LIMIT") {
        finalData[key] = value;
        columns.push(key);
      }
    });

    columns.forEach((key) => {
      whereData[key] = finalData[key];
    });

    //! Total
    let queryResultTotal = await poModel.itemDetailsByWhereTotalCount(
      finalData
    );
    console.log(queryResultTotal);
    await commonObject.makeArrayObject(queryResultTotal);
    let total = await commonObject.convertArrayToObject(
      queryResultTotal.queryResult.finalData
    );
    value.total = total.TOTAL;
    console.log(finalData);
    //! Data
    let queryResult = await poModel.itemDetailsByWhere(finalData);
    //console.log(queryResult);
    await commonObject.makeArrayObject(queryResult);

    for (let i = 0; i < queryResult.queryResult.finalData.length; i++) {
      // OU Name
      let ouNameResult = await ouModel.ouListByID(
        queryResult.queryResult.finalData[i].ORG_ID
      );
      await commonObject.makeArrayObject(ouNameResult);
      let ouNameObject = await commonObject.convertArrayToObject(
        ouNameResult.queryResult.finalData
      );
      queryResult.queryResult.finalData[i].OU_NAME = ouNameObject.NAME;
    }

    value.data = queryResult.queryResult.finalData;
    value.message = "PO Item Details";
    value.status = 200;
    return res.status(value.status).json(value);
  } catch (error) {
    logger.info(error);
    logger.error(error);
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(`/po-status-change`, verifyToken, async (req, res) => {
  let whereData = {};
  let updateData = {};
  userId = req.user ? req.user.USER_ID : null;
  try {
    let value = {
      message: ``,
      status: 200,
    };
    let reqData = {
      PO_STATUS: req.body.PO_STATUS,
      USER_ID: req.body.SUPPLIER_ID,
      PO_HEADER_ID: req.body.PO_HEADER_ID,
      PO_NUMBER: req.body.PO_NUMBER,
    };
    console.log(reqData);

    if (isEmpty(reqData.PO_STATUS)) {
      value.message = "PLease Give PO Status.";
      value.status = 400;
      return res.status(value.status).json(value);
    }

    updateData.PO_STATUS = reqData.PO_STATUS;
    updateData.LAST_UPDATED_BY = userId;
    whereData.USER_ID = reqData.USER_ID;
    whereData.PO_HEADER_ID = reqData.PO_HEADER_ID;
    whereData.PO_NUMBER = reqData.PO_NUMBER;

    //! Data
    let queryResultUpdate = await poModel.poStatusUpdate(updateData, whereData);

    console.log(queryResultUpdate);
    value.message =
      queryResultUpdate.rowsAffected > 0
        ? "Information Updated Successfully"
        : "Information Not Updated! Pease Try Again.";
    value.status = queryResultUpdate.rowsAffected > 0 ? 200 : 500;
    return res.status(value.status).json(value);
  } catch (error) {
    logger.info(error);
    logger.error(error);
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

module.exports = router;
