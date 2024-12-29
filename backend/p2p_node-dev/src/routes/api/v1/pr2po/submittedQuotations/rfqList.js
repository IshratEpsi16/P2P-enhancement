const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../../common/api/v1/common");
const quotationModel = require("../../../../../models/api/v1/pr2po/supplierQuotation/rfqList");
//const getUserRolePermission = require("../authentication/authorization_role_permission");
const {
  userPermissionAuthorization,
  userRoleAuthorization,
} = require("../../../../../middleware/authorization");
const rfqModel = require("../../../../../models/api/v1/pr2po/pr/rfqPreparation");
const isEmpty = require("is-empty");
const fs = require("fs");
const path = require("path");
const fileUploaderCommonObject = require("../../../../../common/api/v1/fileUploader");

router.post(`/list`, verifyToken, async (req, res) => {
  const today = new Date();
  try {
    let rfqHeaderFile = `${process.env.backend_url}${process.env.rfq_header_file_path_name}`;
    let rfqHeaderTermFile = `${process.env.backend_url}${process.env.rfq_header_term_file_path_name}`;
    let buyerLineFile = `${process.env.backend_url}${process.env.rfq_buyer_lines_file_path_name}`;
    let supplierLineFile = `${process.env.backend_url}${process.env.rfq_supplier_lines_file_path_name}`;
    let supplierTermFile = `${process.env.backend_url}${process.env.rfq_supplier_term_file_path_name}`;
    const today = new Date();
    let finalData = {};
    userId = req.user ? req.user.USER_ID : null;
    let value = {
      message: "",
      status: 200,
      rfq_header_file: rfqHeaderFile,
      rfq_header_term_file: rfqHeaderTermFile,
      supplier_term_file: supplierTermFile,
      total: 0,
      data: [],
    };
    finalData.USER_ID = userId;
    //userId = req.user ? req.user.USER_ID : null;
    let reqData = {
      RFQ_STATUS: req.body.RFQ_STATUS,
      RESPONSE_STATUS: req.body.RESPONSE_STATUS,
      STATE: req.body.STATE,
      OFFSET: req.body.OFFSET,
      LIMIT: req.body.LIMIT,
    };
    Object.entries(reqData).forEach(([key, value]) => {
      if (key !== "OFFSET" && key !== "LIMIT" && key !== "STATE") {
        finalData[key] = value;
      }
    });

    //! Total
    let queryResultTotal = await quotationModel.rfqTotal(
      finalData,
      userId,
      reqData.RFQ_STATUS,
      reqData.RESPONSE_STATUS
    );
    await commonObject.makeArrayObject(queryResultTotal);
    let rowObject = await commonObject.convertArrayToObject(
      queryResultTotal.queryResult.finalData
    );
    value.total = rowObject.TOTAL;
    // List
    finalData.OFFSET = reqData.OFFSET;
    finalData.LIMIT = reqData.LIMIT;
    let queryResultList = await quotationModel.rfqList(
      finalData,
      userId,
      reqData.RFQ_STATUS,
      reqData.RESPONSE_STATUS,
      reqData.OFFSET,
      reqData.LIMIT
    );

    await commonObject.makeArrayObject(queryResultList);
    if (reqData.RESPONSE_STATUS == 0 && reqData.STATE == "NEW") {
      let tempList = [];
      for (let i = 0; i < queryResultList.queryResult.finalData.length; i++) {
        console.log(queryResultList.queryResult.finalData[i]);

        if (
          queryResultList.queryResult.finalData[i].OPEN_DATE <= today &&
          today >= queryResultList.queryResult.finalData[i].CLOSE_DATE
        ) {
          // console.log(rowObjectList);
          tempList.push(queryResultList.queryResult.finalData[i]);
        }
      }
      value.data = tempList;
      value.status = 200;
      //value.total = tempList.length;
      value.message = "New Quotation List";
      return res.status(value.status).json(value);
    } else if (reqData.STATE == "OPEN") {
      let tempList = [];
      for (let i = 0; i < queryResultList.queryResult.finalData.length; i++) {
        if (
          queryResultList.queryResult.finalData[i].OPEN_DATE <= today &&
          today >= queryResultList.queryResult.finalData[i].CLOSE_DATE
        ) {
          tempList.push(queryResultList.queryResult.finalData[i]);
        }
      }
      value.data = tempList;
      value.status = 200;
      //value.total = tempList.length;
      value.message = "Open Quotation List";
      return res.status(value.status).json(value);
    } else if (reqData.STATE == "ALL") {
      value.data = queryResultList.queryResult.finalData;
      value.status = 200;
      //value.total = queryResultList.queryResult.finalData.length;
      value.message = "All Quotation List";
      return res.status(value.status).json(value);
    }
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(`/details`, verifyToken, async (req, res) => {
  try {
    let rfqHeaderFile = `${process.env.backend_url}${process.env.rfq_header_file_path_name}`;
    let rfqHeaderTermFile = `${process.env.backend_url}${process.env.rfq_header_term_file_path_name}`;
    let buyerLineFile = `${process.env.backend_url}${process.env.rfq_buyer_lines_file_path_name}`;
    let supplierLineFile = `${process.env.backend_url}${process.env.rfq_supplier_lines_file_path_name}`;
    let supplierTermFile = `${process.env.backend_url}${process.env.rfq_supplier_term_file_path_name}`;
    let finalData = {};
    let value = {
      message: `RFQ Details`,
      status: 200,
      buyer_line_file: buyerLineFile,
      supplier_line_file: supplierLineFile,
      total_line_item: 0,
      line_items: [],
    };

    let reqData = {
      RFQ_ID: req.body.RFQ_ID,
      OFFSET: req.body.OFFSET,
      LIMIT: req.body.LIMIT,
    };

    Object.entries(reqData).forEach(([key, value]) => {
      if (value && key !== "OFFSET" && key !== "LIMIT") {
        finalData[key] = value;
      }
    });

    // Rfq Line Item Total
    let queryResultTotal = await rfqModel.rfqAllDetailsTotal(finalData);
    await commonObject.makeArrayObject(queryResultTotal);
    let rowObject = await commonObject.convertArrayToObject(
      queryResultTotal.queryResult.finalData
    );
    value.total_line_item = rowObject.TOTAL;
    // Rfq Line Items
    let queryResultLineItems = await rfqModel.rfqDetails(
      finalData,
      reqData.OFFSET,
      reqData.LIMIT
    );
    //console.log(queryResult);
    await commonObject.makeArrayObject(queryResultLineItems);
    let rowObjectDetails = await commonObject.convertArrayToObject(
      queryResultLineItems.queryResult.finalData
    );
    value.line_items = queryResultLineItems.queryResult.finalData;

    return res.status(200).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

module.exports = router;
