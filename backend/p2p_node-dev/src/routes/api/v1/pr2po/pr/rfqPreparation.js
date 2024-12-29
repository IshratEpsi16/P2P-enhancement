const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../../common/api/v1/common");
const rfqModel = require("../../../../../models/api/v1/pr2po/pr/rfqPreparation");
const supplierSiteCreationModel = require("../../../../../models/api/v1/supplierRegistrationSiteCreation");
const supplierContactModel = require("../../../../../models/api/v1/supplierContact");
//const getUserRolePermission = require("../authentication/authorization_role_permission");
const {
  userPermissionAuthorization,
  userRoleAuthorization,
} = require("../../../../../middleware/authorization");
const isEmpty = require("is-empty");
var nodemailer = require("nodemailer");
const fileUploaderCommonObject = require("../../../../../common/api/v1/fileUploader");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const path = require("path");
const orgNameModel = require("../../../../../models/api/v1/common/orgNameById");

router.post(
  `/creation`,
  verifyToken,
  userRoleAuthorization,
  userPermissionAuthorization(["CreateRFQ"]),
  async (req, res) => {
    try {
      let fileName;
      userId = req.user ? req.user.USER_ID : null;
      let value = {
        message: ``,
        status: 200,
        rfq_id: ``,
      };

      let finalData = {};
      let finalDataSupplierInvite = {};

      let reqData = {
        RFQ_SUBJECT: req.body.RFQ_SUBJECT,
        RFQ_TITLE: req.body.RFQ_TITLE,
        RFQ_TYPE: req.body.RFQ_TYPE,
        NEED_BY_DATE: req.body.NEED_BY_DATE,
        OPEN_DATE: req.body.OPEN_DATE,
        CLOSE_DATE: req.body.CLOSE_DATE,
        CURRENCY_CODE: req.body.CURRENCY_CODE,
        BILL_TO_LOCATION_ID: req.body.BILL_TO_LOCATION_ID,
        SHIP_TO_LOCATION_ID: req.body.SHIP_TO_LOCATION_ID,
        FREIGHT_TERM: req.body.FREIGHT_TERM,
        PAYMENT_TERM_ID: req.body.PAYMENT_TERM_ID,
        ETR: req.body.ETR,
        VAT_APPLICABLE_STATUS: req.body.VAT_APPLICABLE_STATUS,
        INVOICE_TYPE: req.body.INVOICE_TYPE,
        VAT_RATE: req.body.VAT_RATE,
        RFQ_STATUS: req.body.RFQ_STATUS,
        BUYER_GENERAL_TERMS: req.body.BUYER_GENERAL_TERMS,
        NOTE_TO_SUPPLIER: req.body.NOTE_TO_SUPPLIER,
        ORG_ID: req.body.ORG_ID,
        RATE_TYPE: req.body.RATE_TYPE,
        RATE_DATE: req.body.RATE_DATE,
        CONVERSION_RATE: req.body.CONVERSION_RATE,
        MATCH_OPTION: req.body.MATCH_OPTION,
        BUYER_DEPARTMENT: req.body.BUYER_DEPARTMENT,
        APPROVAL_FLOW_TYPE: req.body.APPROVAL_FLOW_TYPE,
      };

      if (isEmpty(reqData.RFQ_SUBJECT)) {
        return res
          .status(400)
          .send({ message: "Enter RFQ Subject", status: 400 });
      }
      if (isEmpty(reqData.RFQ_TITLE)) {
        return res
          .status(400)
          .send({ message: "Enter RFQ Title", status: 400 });
      }
      if (isEmpty(reqData.RFQ_TYPE)) {
        return res
          .status(400)
          .send({ message: "Select RFQ Type", status: 400 });
      }
      if (isEmpty(reqData.NEED_BY_DATE)) {
        return res
          .status(400)
          .send({ message: "Enter Need By Date", status: 400 });
      }
      if (isEmpty(reqData.OPEN_DATE)) {
        return res
          .status(400)
          .send({ message: "Enter RFQ Open Date", status: 400 });
      }
      if (isEmpty(reqData.CLOSE_DATE)) {
        return res
          .status(400)
          .send({ message: "Enter RFQ Close Date", status: 400 });
      }
      if (isEmpty(reqData.ORG_ID)) {
        return res
          .status(400)
          .send({ message: "Please Select Operating Unit", status: 400 });
      }
      if (
        !isEmpty(reqData.BUYER_GENERAL_TERMS) &&
        reqData.BUYER_GENERAL_TERMS.length > 4000
      ) {
        return res.status(400).send({
          message: "General Term not more then 4000 character.",
          status: 400,
        });
      }

      if (isEmpty(reqData.BUYER_DEPARTMENT)) {
        return res.status(400).send({
          message:
            "You do not have department, Please update your profile in P2P.",
          status: 400,
        });
      }

      if (isEmpty(reqData.APPROVAL_FLOW_TYPE)) {
        return res.status(400).send({
          message: "Please Give A Approval Flow.",
          status: 400,
        });
      }

      if (
        reqData.BUYER_DEPARTMENT.toUpperCase() === "Foreign" &&
        isEmpty(reqData.CONVERSION_RATE)
      ) {
        return res.status(400).send({
          message: "Please Give Conversion Rate.",
          status: 400,
        });
      }
      if (
        reqData.BUYER_DEPARTMENT.toUpperCase() === "Foreign" &&
        isEmpty(reqData.RATE_TYPE)
      ) {
        return res.status(400).send({
          message: "Please Give Rate Rate.",
          status: 400,
        });
      }
      if (
        reqData.BUYER_DEPARTMENT.toUpperCase() === "Foreign" &&
        isEmpty(reqData.RATE_DATE)
      ) {
        return res.status(400).send({
          message: "Please Give Rate Date.",
          status: 400,
        });
      }

      Object.entries(reqData).forEach(([key, value]) => {
        if (
          !isEmpty(value) &&
          key != "NEED_BY_DATE" &&
          key != "OPEN_DATE" &&
          key != "CLOSE_DATE" &&
          key != "ETR" &&
          key != "RATE_DATE" &&
          !Array.isArray(value) &&
          key != "BUYER_ATTACHMENT_FILE_NAME" &&
          key != "RFQ_ATTACHMENT_FILE_NAME"
        ) {
          finalData[key] = value;
        } else if (key == "NEED_BY_DATE" && !isEmpty(value)) {
          let val = new Date(value);
          //val.setHours(val.getHours() - 6);
          finalData[key] = val;
        } else if (key == "OPEN_DATE" && !isEmpty(value)) {
          let val = new Date(value);
          //val.setHours(val.getHours() - 6);
          finalData[key] = val;
        } else if (key == "CLOSE_DATE" && !isEmpty(value)) {
          let val = new Date(value);
          //val.setHours(val.getHours() - 6);
          finalData[key] = val;
        } else if (key == "ETR" && !isEmpty(value)) {
          let val = new Date(value);
          //val.setHours(val.getHours() - 6);
          finalData[key] = val;
        } else if (key == "RATE_DATE" && !isEmpty(value)) {
          let val = new Date(value);
          //val.setHours(val.getHours() - 6);
          finalData[key] = val;
        }
      });

      if (
        req.files &&
        Object.keys(req.files).length > 0 &&
        req.files.BUYER_ATTACHMENT_FILE_NAME
      ) {
        console.log(
          "BUYER_ATTACHMENT_FILE_NAME",
          req.files.BUYER_ATTACHMENT_FILE_NAME
        );
        let fileUploadCode = {};

        fileUploadCode = await fileUploaderCommonObject.uploadFile(
          req,
          "rfqBuyerFile",
          "BUYER_ATTACHMENT_FILE_NAME"
        );

        if (fileUploadCode.success == false)
          return res.status(400).send({
            success: false,
            status: 400,
            message: fileUploadCode.message,
          });

        finalData.BUYER_ATTACHMENT_FILE_NAME = fileUploadCode.fileName;
        finalData.BUYER_ATTACHMENT_FILE_ORG_NAME =
          fileUploadCode.fileOriginalName;
      }
      if (
        req.files &&
        Object.keys(req.files).length > 0 &&
        req.files.RFQ_ATTACHMENT_FILE_NAME
      ) {
        let fileUploadCode = {};

        fileUploadCode = await fileUploaderCommonObject.uploadFile(
          req,
          "rfqHeaderFile",
          "RFQ_ATTACHMENT_FILE_NAME"
        );

        if (fileUploadCode.success == false)
          return res.status(400).send({
            success: false,
            status: 400,
            message: fileUploadCode.message,
          });
        finalData.RFQ_ATTACHMENT_FILE_NAME = fileUploadCode.fileName;
        finalData.RFQ_ATTACHMENT_FILE_ORG_NAME =
          fileUploadCode.fileOriginalName;
      }

      /*  if (
        req.files &&
        Object.keys(req.files).length > 0 &&
        (reqData.RFQ_ATTACHMENT_FILE_NAME || reqData.BUYER_ATTACHMENT_FILE_NAME)
      ) {
        let fileUploadCode = {};

        fileUploadCode = await fileUploaderCommonObject.uploadFile(
          req,
          "rfqHeaderFile",
          "RFQ_ATTACHMENT_FILE"
        );
        // fileUploadCode = await fileUploaderCommonObject.uploadBase64ToFile(
        //   reqData.RFQ_ATTACHMENT_FILE_NAME,
        //   reqData.MIMETYPE,
        //   "rfqAllFile",
        //   "RFQ_ATTACHMENT_FILE"
        // );

        if (fileUploadCode.success == false)
          return res.status(400).send({
            success: false,
            status: 400,
            message: fileUploadCode.message,
          });
        console.log(fileUploadCode);

        finalData.RFQ_ATTACHMENT_FILE_NAME = fileUploadCode.fileName;
        finalData.RFQ_ATTACHMENT_FILE_ORG_NAME = reqData.fileOriginalName;

        fileUploadCode = await fileUploaderCommonObject.uploadFile(
          req,
          "rfqBuyerFile",
          "BUYER_ATTACHMENT_FILE_NAME"
        );

        if (fileUploadCode.success == false)
          return res.status(400).send({
            success: false,
            status: 400,
            message: fileUploadCode.message,
          });

        finalData.BUYER_ATTACHMENT_FILE_NAME = fileUploadCode.fileName;
        finalData.BUYER_ATTACHMENT_FILE_ORG_NAME =
          fileUploadCode.fileOriginalName;
      }*/

      finalData.CREATED_BY = userId;
      finalData.PREPARER_ID = userId;
      finalData.PREPARER_STATUS = "INITIATED";
      let { ...newDta } = finalData;
      finalData = newDta;
      console.log(finalData);

      Object.entries(finalData).forEach(([key, value]) => {
        if (!isEmpty(value)) {
          finalData[key] = value;
        }
      });

      // RFQ Creation
      let queryResult = await rfqModel.addNewRFQHeader(finalData);
      console.log(queryResult);
      let rfqId = queryResult.outBinds[0][0];
      console.log(rfqId);
      // await commonObject.makeArrayObject(queryResultList);
      // value.data = queryResultList.queryResult.finalData;
      if (rfqId > 0 && queryResult.lastRowid != null) {
        // Return Message
        value.message =
          reqData.RFQ_STATUS == "SUBMIT" ? "RFQ Published" : "RFQ Saved";
        value.status = 200;
        value.rfq_id = rfqId;
      } else {
        value.message = "RFQ Not Published! Please Try Again.";
        value.status = 500;
        fileUploadCode = await fileUploaderCommonObject.fileRemove(
          fileName,
          "BUYER_LINE_FILE"
        );
      }
      return res.status(value.status).json(value);
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

router.post(
  `/insert-line-item`,
  verifyToken,
  userRoleAuthorization,
  userPermissionAuthorization(["CreateRFQ"]),
  async (req, res) => {
    try {
      userId = req.user ? req.user.USER_ID : null;
      let finalData = {};
      let fileUploadCode = {};
      let value = {
        message: ``,
        status: 200,
      };
      let reqData = {
        RFQ_ID: req.body.RFQ_ID,
        REQUISITION_HEADER_ID: req.body.REQUISITION_HEADER_ID,
        REQUISITION_LINE_ID: req.body.REQUISITION_LINE_ID,
        PR_NUMBER: req.body.PR_NUMBER,
        LINE_NUM: req.body.LINE_NUM,
        LINE_TYPE_ID: req.body.LINE_TYPE_ID,
        ITEM_CODE: req.body.ITEM_CODE,
        ITEM_DESCRIPTION: req.body.ITEM_DESCRIPTION,
        ITEM_SPECIFICATION: req.body.ITEM_SPECIFICATION,
        WARRANTY_DETAILS: req.body.WARRANTY_DETAILS,
        PACKING_TYPE: req.body.PACKING_TYPE,
        PROJECT_NAME: req.body.PROJECT_NAME,
        EXPECTED_QUANTITY: req.body.EXPECTED_QUANTITY,
        EXPECTED_BRAND_NAME: req.body.EXPECTED_BRAND_NAME,
        EXPECTED_ORIGIN: req.body.EXPECTED_ORIGIN,
        LCM_ENABLE_FLAG: req.body.LCM_ENABLE_FLAG,
        UNIT_MEAS_LOOKUP_CODE: req.body.UNIT_MEAS_LOOKUP_CODE,
        NEED_BY_DATE: req.body.NEED_BY_DATE,
        ORG_ID: req.body.ORG_ID,
        ATTRIBUTE_CATEGORY: req.body.ATTRIBUTE_CATEGORY,
        PR_FROM_DFF: req.body.PR_FROM_DFF,
        AUTHORIZATION_STATUS: req.body.AUTHORIZATION_STATUS,
        NOTE_TO_SUPPLIER: req.body.NOTE_TO_SUPPLIER,
        WARRANTY_ASK_BY_BUYER: req.body.WARRANTY_ASK_BY_BUYER,
        BUYER_VAT_APPLICABLE: req.body.BUYER_VAT_APPLICABLE,
        DELIVER_TO_LOCATION_ID: req.body.DELIVER_TO_LOCATION_ID,
        DESTINATION_ORGANIZATION_ID: req.body.DESTINATION_ORGANIZATION_ID,
        CS_STATUS: req.body.CS_STATUS,
        BUYER_FILE_NAME: req.body.BUYER_FILE,
        ITEM_ID: req.body.ITEM_ID,
        RATE_TYPE: req.body.RATE_TYPE,
        RATE_DATE: req.body.RATE_DATE,
        CONVERSION_RATE: req.body.CONVERSION_RATE,
        MATCH_OPTION: req.body.MATCH_OPTION,
        PR_LINE_NUM: req.body.PR_LINE_NUM,
        PR_APPROVED_DATE: req.body.PR_APPROVED_DATE,
        LINE_STATUS: req.body.LINE_STATUS,
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (
          !isEmpty(value) &&
          key != "NEED_BY_DATE" &&
          key != "RATE_DATE" &&
          key != "BUYER_FILE" &&
          key != "PR_APPROVED_DATE"
        ) {
          finalData[key] = value;
        } else if (key == "NEED_BY_DATE" && value != null) {
          let val = new Date(value);
          //val.setHours(val.getHours() - 6);
          finalData[key] = val;
        } else if (key == "RATE_DATE" && value != null) {
          let val = new Date(value);
          //val.setHours(val.getHours() - 6);
          finalData[key] = val;
        } else if (key == "PR_APPROVED_DATE" && value != null) {
          let val = new Date(value);
          //val.setHours(val.getHours() - 6);
          finalData[key] = val;
        }
      });
      finalData.CREATED_BY = userId;

      if (
        req.files &&
        Object.keys(req.files).length > 0 &&
        req.files.BUYER_FILE
      ) {
        fileUploadCode = await fileUploaderCommonObject.uploadFile(
          req,
          "rfqBuyerLinesFile",
          "BUYER_FILE"
        );

        if (fileUploadCode.success == false)
          return res.status(400).send({
            success: false,
            status: 400,
            message: fileUploadCode.message,
          });

        finalData.BUYER_FILE_NAME = fileUploadCode.fileName;
        finalData.BUYER_FILE_ORG_NAME = fileUploadCode.fileOriginalName;
      }
      console.log(finalData);

      let queryResultLines = await rfqModel.addNewRFQLines(finalData);
      console.log(queryResultLines);
      if (queryResultLines.rowsAffected > 0) {
        value.message = "Item Inserted.";
        value.status = 200;
      } else {
        value.message = "Item Not Inserted.";
        value.status = 500;
      }
      return res.status(value.status).json(value);
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

router.post(`/rfq-list`, verifyToken, async (req, res) => {
  try {
    let finalData = {};
    let value = {
      message: `RFQ List`,
      status: 200,
      total: 0,
      data: [],
    };

    let reqData = {
      FROM_DATE: req.body.FROM_DATE,
      TO_DATE: req.body.TO_DATE,
      SEARCH_FIELD: req.body.SEARCH_FIELD,
      RFQ_STATUS: req.body.RFQ_STATUS,
      CREATED_BY: req.body.CREATED_BY,
      OFFSET: req.body.OFFSET,
      LIMIT: req.body.LIMIT,
    };

    // Filter out entries with empty PERMISSION_ID and extract PERMISSION_NAME
    req.userPermission = req.userPermission
      .filter((perm) => perm.PERMISSION_ID !== "")
      .map((perm) => perm.PERMISSION_NAME);

    //console.log("Filtered Per: ", req.userPermission);

    // Check permission if CREATED_BY is not provided
    if (!isEmpty(reqData.CREATED_BY)) {
      const requiredPermission = "AllRFQView";

      // Check if userPermission exists and is an array
      if (!Array.isArray(req.userPermission)) {
        console.error("User permissions are not properly set");
        return res.status(500).json({
          message:
            "Internal server error: User permissions are not properly set",
          status: 500,
        });
      }

      const hasPermission = req.userPermission.some(
        (permission) =>
          permission.toLowerCase() === requiredPermission.toLowerCase()
      );

      //console.log(`Required Permission: ${requiredPermission}`);
      //console.log(`Has Permission: ${hasPermission}`);

      if (!hasPermission) {
        //console.log(`User lacks required permission: ${requiredPermission}`);
        return res.status(403).json({
          message: `You do not have permission to view all RFQ.`,
          status: 403,
        });
      }
    }

    // Rest of your code...

    Object.entries(reqData).forEach(([key, value]) => {
      if (value && key !== "OFFSET" && key !== "LIMIT" && !isEmpty(value)) {
        finalData[key] = value;
      }
    });

    // Rfq List Total
    let queryResultTotal = await rfqModel.rfqAllListTotal(finalData);
    await commonObject.makeArrayObject(queryResultTotal);
    let rowObject = await commonObject.convertArrayToObject(
      queryResultTotal.queryResult.finalData
    );
    value.total = rowObject.TOTAL;
    // Rfq List
    finalData.OFFSET = reqData.OFFSET;
    finalData.LIMIT = reqData.LIMIT;
    console.log(finalData);

    let queryResult = await rfqModel.rfqAllList(finalData);
    //console.log(queryResult);
    await commonObject.makeArrayObject(queryResult);
    value.data = queryResult.queryResult.finalData;

    return res.status(200).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(`/rfq-header-details`, verifyToken, async (req, res) => {
  try {
    let rfqHeaderFile = `${process.env.backend_url}${process.env.rfq_header_file_path_name}`;
    let rfqHeaderTermFile = `${process.env.backend_url}${process.env.rfq_header_term_file_path_name}`;
    let finalData = {};
    let value = {
      message: `RFQ Header Details`,
      status: 200,
      header_file_path: rfqHeaderFile,
      header_term_file_path: rfqHeaderTermFile,
      details: ``,
    };

    let reqData = {
      RFQ_ID: req.body.RFQ_ID,
    };
    finalData.RFQ_ID = reqData.RFQ_ID;
    // Rfq Details
    let queryResult = await rfqModel.rfqHeaderDetails(finalData);
    await commonObject.makeArrayObject(queryResult);
    let rowObject = await commonObject.convertArrayToObject(
      queryResult.queryResult.finalData
    );

    //Bill To Location name
    if (!isEmpty(rowObject.BILL_TO_LOCATION_ID)) {
      let billTo = {};
      billTo.ID = rowObject.BILL_TO_LOCATION_ID;
      let queryResultBillToLocation = await rfqModel.locationNameById(billTo);
      await commonObject.makeArrayObject(queryResultBillToLocation);
      let rowObjectBillToLocationName = await commonObject.convertArrayToObject(
        queryResultBillToLocation.queryResult.finalData
      );
      rowObject.BILL_TO_LOCATION_NAME =
        rowObjectBillToLocationName.LOCATION_CODE;
    }

    //Ship To Location name
    let shipTo = {};
    if (!isEmpty(rowObject.SHIP_TO_LOCATION_ID)) {
      shipTo.ID = rowObject.SHIP_TO_LOCATION_ID;
      let queryResultShipToLocation = await rfqModel.locationNameById(shipTo);
      await commonObject.makeArrayObject(queryResultShipToLocation);
      let rowObjectBShipToLocationName =
        await commonObject.convertArrayToObject(
          queryResultShipToLocation.queryResult.finalData
        );
      rowObject.SHIP_TO_LOCATION_NAME =
        rowObjectBShipToLocationName.LOCATION_CODE;
    }

    let orgNameResult = await orgNameModel.ouListByID(rowObject.ORG_ID);
    await commonObject.makeArrayObject(orgNameResult);
    let orgObject = await commonObject.convertArrayToObject(
      orgNameResult.queryResult.finalData
    );
    rowObject.OU_DETAILS = orgObject;

    value.details = rowObject;
    return res.status(200).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(`/rfq-details`, verifyToken, async (req, res) => {
  let rfqHeaderFile = `${process.env.backend_url}${process.env.rfq_header_file_path_name}`;
  let rfqHeaderTermFile = `${process.env.backend_url}${process.env.rfq_header_term_file_path_name}`;
  let buyerLineFile = `${process.env.backend_url}${process.env.rfq_buyer_lines_file_path_name}`;
  let supplierLineFile = `${process.env.backend_url}${process.env.rfq_supplier_lines_file_path_name}`;
  try {
    let finalData = {};
    let value = {
      message: `RFQ Details`,
      status: 200,
      rfq_header_file: rfqHeaderFile,
      rfq_header_term_file: rfqHeaderTermFile,
      buyer_line_file: buyerLineFile,
      supplier_line_file: supplierLineFile,
      total_line_item: 0,
      total_suppliers: 0,
      line_items: [],
      supplier_list: [],
    };

    let reqData = {
      RFQ_ID: req.body.RFQ_ID,
      OFFSET: req.body.OFFSET,
      LIMIT: req.body.LIMIT,
    };
    if (isEmpty(reqData.RFQ_ID) || isNaN(reqData.RFQ_ID)) {
      let val = {};
      val.message = isEmpty(reqData.RFQ_ID)
        ? "Please Give RFQ ID."
        : "RFQ ID must be a valid number.";
      val.status = 400;

      return res.status(val.status).json(val);
    }

    if (
      reqData.OFFSET === undefined ||
      reqData.OFFSET === null ||
      reqData.LIMIT === undefined ||
      reqData.LIMIT === null
    ) {
      let val = {};
      val.message = "Please Give Offset & Limit.";
      val.status = 400;
      return res.status(val.status).json(val);
    }

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

    // Rfq Invited Suppliers Total
    let queryResultSuppliersTotal = await rfqModel.rfqAllSupplierListTotal(
      finalData
    );
    await commonObject.makeArrayObject(queryResultSuppliersTotal);
    let rowObjectSupplier = await commonObject.convertArrayToObject(
      queryResultSuppliersTotal.queryResult.finalData
    );
    value.total_suppliers = rowObjectSupplier.TOTAL;

    // Rfq Invited Suppliers
    let queryResultSupplierList = await rfqModel.rfqSupplierList(
      finalData,
      reqData.OFFSET,
      reqData.LIMIT
    );
    //console.log(queryResult);
    await commonObject.makeArrayObject(queryResultSupplierList);
    let list = queryResultSupplierList.queryResult.finalData;

    const enhancedList = await Promise.all(
      list.map(async (item) => {
        const [siteResult, contactResult, supplierPOTotal] = await Promise.all([
          supplierSiteCreationModel.getDataByWhereCondition({
            id: item.SITE_ID,
          }),
          supplierContactModel.getDataByWhereCondition({
            id: item.CONTACT_ID,
          }),
          rfqModel.getPOTotalOfSupplier(item.USER_ID),
        ]);

        await Promise.all([
          commonObject.makeArrayObject(siteResult),
          commonObject.makeArrayObject(contactResult),
          commonObject.makeArrayObject(supplierPOTotal),
        ]);

        const [siteObject, contactObject, poTotalObject] = await Promise.all([
          commonObject.convertArrayToObject(siteResult.queryResult.finalData),
          commonObject.convertArrayToObject(
            contactResult.queryResult.finalData
          ),
          commonObject.convertArrayToObject(
            supplierPOTotal.queryResult.finalData
          ),
        ]);

        return {
          ...item,
          TOTAL_PO: poTotalObject.TOTAL_PO,
          PO_DATE: poTotalObject.PO_DATE,
          SITE_DETAILS: siteObject,
          CONTACT_DETAILS: contactObject,
        };
      })
    );
    value.supplier_list = enhancedList;
    //value.supplier_list = queryResultSupplierList.queryResult.finalData;

    return res.status(200).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(
  `/line-item-delete`,
  verifyToken,
  userRoleAuthorization,
  userPermissionAuthorization(["CreateRFQ"]),
  async (req, res) => {
    try {
      let finalData = {};
      let value = {
        message: ``,
        status: 200,
      };
      let reqData = {
        RFQ_LINE_ID: req.body.RFQ_LINE_ID,
      };
      if (isEmpty(reqData.RFQ_LINE_ID)) {
        return res
          .status(400)
          .send({ message: "Enter RFQ Line ID", status: 400 });
      }
      finalData.RFQ_LINE_ID = reqData.RFQ_LINE_ID;
      // List
      let queryResult = await rfqModel.deleteLineItem(finalData);
      console.log(queryResult);
      if (queryResult.rowsAffected > 0) {
        value.message = "Line Item Removed.";
        value.status = 200;
      } else {
        value.message = "Line Item Not Removed!";
        value.status = 500;
      }
      return res.status(value.status).json(value);
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

router.post(
  `/rfq-header-update`,
  verifyToken,
  userPermissionAuthorization(["CreateRFQ"]),
  async (req, res) => {
    try {
      userId = req.user ? req.user.USER_ID : null;
      let finalData = {};
      let finalDataHeader = {};
      let updateData = {};
      let whereData = {};
      let value = {
        message: `Updated`,
        status: 200,
      };

      let formatDate = (date) => {
        let day = String(date.getDate()).padStart(2, "0");
        let month = getMonthAbbreviation(date.getMonth());
        let year = date.getFullYear();
        let hours = String(date.getHours()).padStart(2, "0");
        let minutes = String(date.getMinutes()).padStart(2, "0");
        let seconds = String(date.getSeconds()).padStart(2, "0");

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
      };

      let getMonthAbbreviation = (month) => {
        const monthsAbbreviations = [
          "JAN",
          "FEB",
          "MAR",
          "APR",
          "MAY",
          "JUN",
          "JUL",
          "AUG",
          "SEP",
          "OCT",
          "NOV",
          "DEC",
        ];
        return monthsAbbreviations[month];
      };

      let reqData = {
        RFQ_ID: req.body.RFQ_ID,
        RFQ_SUBJECT: req.body.RFQ_SUBJECT,
        RFQ_TITLE: req.body.RFQ_TITLE,
        RFQ_TYPE: req.body.RFQ_TYPE,
        NEED_BY_DATE: req.body.NEED_BY_DATE,
        OPEN_DATE: req.body.OPEN_DATE,
        CLOSE_DATE: req.body.CLOSE_DATE,
        NOTE_TO_SUPPLIER: req.body.NOTE_TO_SUPPLIER,
        SUPLLIER_CURRENCY_CODE: req.body.SUPLLIER_CURRENCY_CODE,
        SUPLLIER_FREIGHT_CHARGE: req.body.SUPLLIER_FREIGHT_CHARGE,
        RFQ_ATTACHMENT_FILE: req.body.RFQ_ATTACHMENT_FILE,
        BILL_TO_LOCATION_ID: req.body.BILL_TO_LOCATION_ID,
        SHIP_TO_LOCATION_ID: req.body.SHIP_TO_LOCATION_ID,
        ETR: req.body.ETR,
        BUYER_TERM_ATTACHMENT_FILE: req.body.BUYER_TERM_ATTACHMENT_FILE,
        CURRENCY_CODE: req.body.CURRENCY_CODE,
        VAT_APPLICABLE_STATUS: req.body.VAT_APPLICABLE_STATUS,
        VAT_RATE: req.body.VAT_RATE,
        INVOICE_TYPE: req.body.INVOICE_TYPE,
        FREIGHT_TERM: req.body.FREIGHT_TERM,
        PAYMENT_TERM_ID: req.body.PAYMENT_TERM_ID,
        BUYER_GENERAL_TERMS: req.body.BUYER_GENERAL_TERMS,
        PREPARER_ID: req.body.PREPARER_ID,
        PREPARER_STATUS: req.body.PREPARER_STATUS,
        RFQ_STATUS: req.body.RFQ_STATUS,
        ORG_ID: req.body.ORG_ID,
        RATE_TYPE: req.body.RATE_TYPE,
        RATE_DATE: req.body.RATE_DATE,
        CONVERSION_RATE: req.body.CONVERSION_RATE,
        MATCH_OPTION: req.body.MATCH_OPTION,
        BUYER_DEPARTMENT: req.body.BUYER_DEPARTMENT,
        APPROVAL_FLOW_TYPE: req.body.APPROVAL_FLOW_TYPE,
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (
          value &&
          key == "RFQ_ID" &&
          key !== "RFQ_ATTACHMENT_FILE" &&
          key !== "BUYER_TERM_ATTACHMENT_FILE"
        ) {
          whereData[key] = value;
        }
      });

      Object.entries(reqData).forEach(([key, value]) => {
        if (
          value &&
          key !== "RFQ_ID" &&
          key !== "RFQ_ATTACHMENT_FILE" &&
          key !== "BUYER_TERM_ATTACHMENT_FILE"
        ) {
          updateData[key] = value;
        } else if (key == "NEED_BY_DATE" && !isEmpty(value)) {
          let val = new Date(value);
          //val.setHours(val.getHours() - 6);
          updateData[key] = val;
        } else if (key == "OPEN_DATE" && !isEmpty(value)) {
          let val = new Date(value);
          val.setHours(val.getHours() - 6);
          updateData[key] = val;
        } else if (key == "CLOSE_DATE" && !isEmpty(value)) {
          let val = new Date(value);
          //val.setHours(val.getHours() - 6);
          updateData[key] = val;
        } else if (key == "ETR" && !isEmpty(value)) {
          let val = new Date(value);
          //val.setHours(val.getHours() - 6);
          updateData[key] = val;
        }
      });
      if (
        req.files &&
        Object.keys(req.files).length > 0 &&
        req.files.BUYER_FILE
      ) {
        fileUploadCode = await fileUploaderCommonObject.uploadFile(
          req,
          "rfqBuyerLinesFile",
          "BUYER_FILE"
        );

        if (fileUploadCode.success == false)
          return res.status(400).send({
            success: false,
            status: 400,
            message: fileUploadCode.message,
          });

        finalData.BUYER_FILE_NAME = fileUploadCode.fileName;
        finalData.BUYER_FILE_ORG_NAME = fileUploadCode.fileOriginalName;
      }

      finalDataHeader.RFQ_ID = reqData.RFQ_ID;

      // Rfq Details
      let queryResult = await rfqModel.rfqHeaderDetails(finalDataHeader);
      await commonObject.makeArrayObject(queryResult);
      let headerRowObject = await commonObject.convertArrayToObject(
        queryResult.queryResult.finalData
      );

      //console.log(queryResult);
      //console.log(req.files);

      if (
        req.files &&
        Object.keys(req.files).length > 0 &&
        req.files.RFQ_ATTACHMENT_FILE
      ) {
        console.log(`RFQ_ATTACHMENT_FILE`);
        let fileUploadCode = {};

        fileUploadCode = await fileUploaderCommonObject.uploadFile(
          req,
          "rfqHeaderFile",
          "RFQ_ATTACHMENT_FILE"
        );

        if (fileUploadCode.success == false)
          return res.status(400).send({
            success: false,
            status: 400,
            message: fileUploadCode.message,
          });

        updateData.RFQ_ATTACHMENT_FILE_NAME = fileUploadCode.fileName;
        updateData.RFQ_ATTACHMENT_FILE_ORG_NAME =
          fileUploadCode.fileOriginalName;
      }

      if (
        req.files &&
        Object.keys(req.files).length > 0 &&
        req.files.BUYER_TERM_ATTACHMENT_FILE
      ) {
        console.log(`BUYER_TERM_ATTACHMENT_FILE`);
        let fileUploadCode = {};

        fileUploadCode = await fileUploaderCommonObject.uploadFile(
          req,
          "rfqHeaderTermFile",
          "BUYER_TERM_ATTACHMENT_FILE"
        );

        if (fileUploadCode.success == false)
          return res.status(400).send({
            success: false,
            status: 400,
            message: fileUploadCode.message,
          });

        updateData.BUYER_ATTACHMENT_FILE_NAME = fileUploadCode.fileName;
        updateData.BUYER_ATTACHMENT_FILE_ORG_NAME =
          fileUploadCode.fileOriginalName;
      }
      if (!isEmpty(updateData.NEED_BY_DATE)) {
        let val = new Date(updateData.NEED_BY_DATE);
        //val.setHours(val.getHours() - 6);
        //val.setDate(val.getDate() + 1);
        //val.setHours(val.getHours() - 6);
        let formattedDate = formatDate(val);
        updateData.NEED_BY_DATE = formattedDate;
      }
      if (!isEmpty(updateData.CLOSE_DATE)) {
        console.log(updateData.CLOSE_DATE);
        let val = new Date(updateData.CLOSE_DATE);
        // Add one day
        //val.setDate(val.getDate() + 1);
        //val.setHours(val.getHours() - 6);
        let formattedDate = formatDate(val);
        updateData.CLOSE_DATE = formattedDate;
      }
      if (!isEmpty(updateData.OPEN_DATE)) {
        let val = new Date(updateData.OPEN_DATE);
        //val.setDate(val.getDate() + 1);
        //val.setHours(val.getHours() - 6);
        let formattedDate = formatDate(val);
        updateData.OPEN_DATE = formattedDate;
      }
      if (!isEmpty(updateData.ETR)) {
        let val = new Date(updateData.ETR);
        //val.setDate(val.getDate() + 1);
        //val.setHours(val.getHours() - 6);
        let formattedDate = formatDate(val);
        updateData.ETR = formattedDate;
      }
      if (!isEmpty(updateData.RATE_DATE)) {
        let val = new Date(updateData.RATE_DATE);
        //val.setDate(val.getDate() + 1);
        //val.setHours(val.getHours() - 6);
        let formattedDate = formatDate(val);
        updateData.RATE_DATE = formattedDate;
      }

      updateData.LAST_UPDATED_BY = userId;

      console.log(updateData);
      Object.entries(updateData).forEach(([key, value]) => {
        if (!isEmpty(value)) {
          updateData[key] = value;
        }
      });

      // Rfq List Total
      let queryResultUpdate = await rfqModel.rfqHeaderUpdate(
        updateData,
        whereData
      );
      //console.log(queryResultUpdate);
      value.message =
        queryResultUpdate.rowsAffected > 0
          ? "Information Updated Successfully"
          : "Information Not Updated! Pease Try Again.";
      value.status = queryResultUpdate.rowsAffected > 0 ? 200 : 500;

      //Remove Old File
      if (queryResultUpdate.rowsAffected > 0) {
        if (!isEmpty(headerRowObject.RFQ_ATTACHMENT_FILE_NAME)) {
          fileUploadCode = await fileUploaderCommonObject.fileRemove(
            headerRowObject.RFQ_ATTACHMENT_FILE_NAME,
            "rfqHeaderFile"
          );
        }
        if (!isEmpty(headerRowObject.BUYER_ATTACHMENT_FILE_NAME)) {
          fileUploadCode = await fileUploaderCommonObject.fileRemove(
            headerRowObject.BUYER_ATTACHMENT_FILE_NAME,
            "rfqHeaderTermFile"
          );
        }
      }

      return res.status(200).json(value);
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

router.post(`/rfq-line-item-update`, verifyToken, async (req, res) => {
  try {
    userId = req.user ? req.user.USER_ID : null;
    let finalData = {};
    let updateData = {};
    let whereData = {};
    let value = {
      message: `Updated`,
      status: 200,
    };
    let formatDate = (date) => {
      let day = String(date.getDate()).padStart(2, "0");
      let month = getMonthAbbreviation(date.getMonth());
      let year = date.getFullYear();
      let hours = String(date.getHours()).padStart(2, "0");
      let minutes = String(date.getMinutes()).padStart(2, "0");
      let seconds = String(date.getSeconds()).padStart(2, "0");

      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };

    let getMonthAbbreviation = (month) => {
      const monthsAbbreviations = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ];
      return monthsAbbreviations[month];
    };

    let reqData = {
      RFQ_ID: req.body.RFQ_ID,
      REQUISITION_HEADER_ID: req.body.REQUISITION_HEADER_ID,
      REQUISITION_LINE_ID: req.body.REQUISITION_LINE_ID,
      PR_NUMBER: req.body.PR_NUMBER,
      LINE_NUM: req.body.LINE_NUM,
      LINE_TYPE_ID: req.body.LINE_TYPE_ID,
      ITEM_CODE: req.body.ITEM_CODE,
      ITEM_DESCRIPTION: req.body.ITEM_DESCRIPTION,
      ITEM_SPECIFICATION: req.body.ITEM_SPECIFICATION,
      WARRANTY_DETAILS: req.body.WARRANTY_DETAILS,
      PACKING_TYPE: req.body.PACKING_TYPE,
      PROJECT_NAME: req.body.PROJECT_NAME,
      EXPECTED_QUANTITY: req.body.EXPECTED_QUANTITY,
      EXPECTED_BRAND_NAME: req.body.EXPECTED_BRAND_NAME,
      EXPECTED_ORIGIN: req.body.EXPECTED_ORIGIN,
      LCM_ENABLE_FLAG: req.body.LCM_ENABLE_FLAG,
      UNIT_MEAS_LOOKUP_CODE: req.body.UNIT_MEAS_LOOKUP_CODE,
      NEED_BY_DATE: req.body.NEED_BY_DATE,
      ORG_ID: req.body.ORG_ID,
      PR_FROM_DFF: req.body.PR_FROM_DFF,
      AUTHORIZATION_STATUS: req.body.AUTHORIZATION_STATUS,
      NOTE_TO_SUPPLIER: req.body.NOTE_TO_SUPPLIER,
      WARRANTY_ASK_BY_BUYER: req.body.WARRANTY_ASK_BY_BUYER,
      BUYER_VAT_APPLICABLE: req.body.BUYER_VAT_APPLICABLE,
      DELIVER_TO_LOCATION_ID: req.body.DELIVER_TO_LOCATION_ID,
      DESTINATION_ORGANIZATION_ID: req.body.DESTINATION_ORGANIZATION_ID,
      ATTRIBUTE_CATEGORY: req.body.ATTRIBUTE_CATEGORY,
      BUYER_FILE: req.body.BUYER_FILE,
      //SUPPLIER_FILE: req.body.SUPPLIER_FILE,
      RATE_TYPE: req.body.RATE_TYPE,
      RATE_DATE: req.body.RATE_DATE,
      CONVERSION_RATE: req.body.CONVERSION_RATE,
      MATCH_OPTION: req.body.MATCH_OPTION,
      PR_LINE_NUM: req.body.PR_LINE_NUM,
      PR_APPROVED_DATE: req.body.PR_APPROVED_DATE,
      LINE_STATUS: req.body.LINE_STATUS,
    };
    if (isEmpty(reqData.RFQ_ID)) {
      return res.status(400).send({ message: "Enter RFQ ID", status: 400 });
    }
    if (isEmpty(reqData.REQUISITION_LINE_ID)) {
      return res
        .status(400)
        .send({ message: "Enter Requisition Line ID", status: 400 });
    }

    if (!isEmpty(reqData.PR_NUMBER)) {
      return res
        .status(400)
        .send({ message: "Can't Update PR Number", status: 400 });
    }
    if (!isEmpty(reqData.REQUISITION_HEADER_ID)) {
      return res
        .status(400)
        .send({ message: "Can't Update Requisition Header ID", status: 400 });
    }

    if (!isEmpty(reqData.LINE_NUM)) {
      return res
        .status(400)
        .send({ message: "Can't Update Line Number", status: 400 });
    }

    Object.entries(reqData).forEach(([key, value]) => {
      if (key == "RFQ_ID" || key == "REQUISITION_LINE_ID") {
        whereData[key] = value;
      }
    });

    Object.entries(reqData).forEach(([key, value]) => {
      if (
        value &&
        key !== "RFQ_ID" &&
        value &&
        key !== "REQUISITION_LINE_ID" &&
        value &&
        key !== "PR_NUMBER" &&
        value &&
        key !== "REQUISITION_HEADER_ID" &&
        value &&
        key !== "ORG_ID" &&
        value &&
        key !== "BUYER_FILE" &&
        value &&
        key !== "SUPPLIER_FILE" &&
        value &&
        key !== "RATE_DATE" &&
        key !== "PR_APPROVED_DATE"
      ) {
        updateData[key] = value;
      }
    });
    if (!isEmpty(updateData.NEED_BY_DATE)) {
      let val = new Date(updateData.NEED_BY_DATE);
      //val.setHours(val.getHours() - 6);
      //val.setDate(val.getDate() + 1);
      //val.setHours(val.getHours() - 6);
      let formattedDate = formatDate(val);
      updateData.NEED_BY_DATE = formattedDate;
    }
    if (!isEmpty(updateData.RATE_DATE)) {
      let val = new Date(updateData.RATE_DATE);
      //val.setHours(val.getHours() - 6);
      //val.setDate(val.getDate() + 1);
      //val.setHours(val.getHours() - 6);
      let formattedDate = formatDate(val);
      updateData.RATE_DATE = formattedDate;
    }
    if (!isEmpty(updateData.PR_APPROVED_DATE)) {
      let val = new Date(updateData.PR_APPROVED_DATE);
      //val.setHours(val.getHours() - 6);
      //val.setDate(val.getDate() + 1);
      //val.setHours(val.getHours() - 6);
      let formattedDate = formatDate(val);
      updateData.PR_APPROVED_DATE = formattedDate;
    }

    if (
      req.files &&
      Object.keys(req.files).length > 0 &&
      req.files.BUYER_FILE
    ) {
      fileUploadCode = await fileUploaderCommonObject.uploadFile(
        req,
        "rfqBuyerLinesFile",
        "BUYER_FILE"
      );

      if (fileUploadCode.success == false)
        return res.status(400).send({
          success: false,
          status: 400,
          message: fileUploadCode.message,
        });

      updateData.BUYER_FILE_NAME = fileUploadCode.fileName;
      updateData.BUYER_FILE_ORG_NAME = fileUploadCode.fileOriginalName;
    }

    updateData.LAST_UPDATED_BY = userId;
    console.log(updateData);

    // Rfq Update
    let queryResultUpdate = await rfqModel.rfqLineItemUpdate(
      updateData,
      whereData
    );
    console.log(queryResultUpdate);
    value.message =
      queryResultUpdate.rowsAffected > 0
        ? "Information Updated Successfully"
        : "Information Not Updated! Pease Try Again.";
    value.status = queryResultUpdate.rowsAffected > 0 ? 200 : 500;

    // Rfq Line Items
    let queryResultLineItems = await rfqModel.rfqDetails(whereData, 0, 1);
    console.log(queryResultLineItems);
    await commonObject.makeArrayObject(queryResultLineItems);
    let rowObjectDetails = await commonObject.convertArrayToObject(
      queryResultLineItems.queryResult.finalData
    );
    console.log(rowObjectDetails);

    //Remove Old File
    if (rowObjectDetails.rowsAffected > 0) {
      if (!isEmpty(rowObjectDetails.BUYER_FILE_NAME)) {
        fileUploadCode = await fileUploaderCommonObject.fileRemove(
          rowObjectDetails.BUYER_FILE_NAME,
          "rfqBuyerLinesFile"
        );
      }
      if (!isEmpty(rowObjectDetails.SUP_FILE_NAME)) {
        rowObjectDetails = await fileUploaderCommonObject.fileRemove(
          rowObjectDetails.SUP_FILE_NAME,
          "rfqSupplierLinesFile"
        );
      }
    }

    return res.status(200).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(`/invite-suppliers-for-rfq`, verifyToken, async (req, res) => {
  try {
    userId = req.user ? req.user.USER_ID : null;
    let value = {
      message: ``,
      status: 200,
    };
    let finalDataSupplierInvite = {};
    let reqData = {
      RFQ_ID: req.body.RFQ_ID,
      RFQ_TITLE: req.body.RFQ_TITLE,
      RFQ_TYPE: req.body.RFQ_TYPE,
      CLOSE_DATE: req.body.CLOSE_DATE,
      INVITED_SUPPLIERS: req.body.INVITED_SUPPLIERS,
    };
    if (isEmpty(reqData.RFQ_ID)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Please Give RFQ ID",
      });
    }
    if (isEmpty(reqData.CLOSE_DATE)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Please Give Close Date",
      });
    }

    if (isEmpty(reqData.INVITED_SUPPLIERS)) {
      return res
        .status(400)
        .send({ message: "Enter Suppliers For Invitation", status: 400 });
    }
    if (!Array.isArray(reqData.INVITED_SUPPLIERS)) {
      return res
        .status(400)
        .send({ message: "Suppliers List Should Be Array", status: 400 });
    }

    // Supplier Invitation
    let tempSupplierArray = req.body.INVITED_SUPPLIERS;
    let updateSentStatusList = [];

    for (let i = 0; i < tempSupplierArray.length; i++) {
      let rowObjectData = tempSupplierArray[i];

      finalDataSupplierInvite.RFQ_ID = reqData.RFQ_ID;
      finalDataSupplierInvite.USER_ID = rowObjectData.SUPPLIER_ID;
      finalDataSupplierInvite.ADDITIONAL_EMAIL = rowObjectData.EMAIL;
      finalDataSupplierInvite.SITE_ID = rowObjectData.SITE_ID;
      finalDataSupplierInvite.CONTACT_ID = rowObjectData.CONTACT_ID;
      finalDataSupplierInvite.EMAIL_SENT_STATUS =
        rowObjectData.EMAIL_SENT_STATUS;
      finalDataSupplierInvite.RESPONSE_STATUS =
        rowObjectData.RESPONSE_STATUS = 0;
      finalDataSupplierInvite.CREATED_BY = userId;

      //When Only Save
      if (
        isEmpty(rowObjectData.INVITATION_ID) &&
        finalDataSupplierInvite.EMAIL_SENT_STATUS === 0
      ) {
        let queryResultSupplier = await rfqModel.addNewRFQInviteSuppliers(
          finalDataSupplierInvite
        );
      }
      //When Save to Publish
      if (
        !isEmpty(rowObjectData.INVITATION_ID) &&
        finalDataSupplierInvite.EMAIL_SENT_STATUS === 1
      ) {
        updateSentStatusList.push(rowObjectData.INVITATION_ID);
        //Create Payload
        const payload = {
          RFQ_ID: reqData.RFQ_ID,
          RFQ_TITLE: reqData.RFQ_TITLE,
          RFQ_TYPE: reqData.RFQ_TYPE,
          CLOSE_DATE: reqData.CLOSE_DATE,
          MENU_ID: 740,
          // Add more data as needed
        };
        // Convert CLOSE_DATE to a JavaScript Date object
        const closeDate = new Date(reqData.CLOSE_DATE);

        // Calculate the expiration time in seconds (for example, 1 hour from CLOSE_DATE)
        const expirationTime =
          Math.floor(closeDate.getTime() / 1000) + 1 * 60 * 60; // 1 hour in seconds

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
          expiresIn: expirationTime,
        });
        const link = `${process.env.backend_url}/supplier-home?token=` + token;
        //console.log(link);
        let body = `
        <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>RFQ Invitation</title>
      <style>
          .button {
              background-color: #4CAF50;
              border: none;
              color: black;
              padding: 15px 32px;
              text-align: center;
              text-decoration: none;
              display: inline-block;
              font-size: 16px;
              margin: 4px 2px;
              cursor: pointer;
              border-radius: 4px;
          }
      </style>
  </head>
  <body>
      <p>Dear Supplier,</p>
      <p>We are pleased to announce the publication of a new tender/RFQ and invite you to submit your quotation. Your participation is integral to our procurement process, and we value your expertise in this regard.</p>
      <p>Please access the tender/RFQ document by clicking the button below:</p>
      <p>
          <a href="${link}" class="button" style="color: white; text-decoration: none;">View RFQ</a>
      </p>
      <p>Your submission will contribute significantly to our decision-making process, and we anticipate the opportunity to collaborate with you.</p>
      <p>Thank you for considering this invitation, and we look forward to receiving your quotation.</p>
      <p>
          Best regards,<br>
          Seven Rings Cement
      </p>
  </body>
  </html>
        `;
        let img_path = path.resolve(
          __dirname,
          "../../../../../common/api/v1/assets/src-logo.png"
        );

        await commonObject.sendEmail(
          reqData.RFQ_TITLE,
          body,
          rowObjectData.EMAIL,
          img_path
        );
        if (!isEmpty(reqData.ADDITIONAL_EMAIL)) {
          await commonObject.sendEmail(
            reqData.RFQ_TITLE,
            body,
            rowObjectData.ADDITIONAL_EMAIL,
            img_path
          );
        }
        if (!isEmpty(rowObjectData.CONTACT_EMAIL)) {
          await commonObject.sendEmail(
            reqData.RFQ_TITLE,
            body,
            rowObjectData.CONTACT_EMAIL,
            img_path
          );
        }
      }
      // When Direct Publish
      if (
        (isEmpty(rowObjectData.INVITATION_ID) ||
          rowObjectData.INVITATION_ID === undefined ||
          rowObjectData.INVITATION_ID === null) &&
        finalDataSupplierInvite.EMAIL_SENT_STATUS === 1
      ) {
        let queryResultSupplier = await rfqModel.addNewRFQInviteSuppliers(
          finalDataSupplierInvite
        );

        //Create Payload
        const payload = {
          RFQ_ID: reqData.RFQ_ID,
          RFQ_TITLE: reqData.RFQ_TITLE,
          RFQ_TYPE: reqData.RFQ_TYPE,
          CLOSE_DATE: reqData.CLOSE_DATE,
          MENU_ID: 740,
          // Add more data as needed
        };
        // Convert CLOSE_DATE to a JavaScript Date object
        const closeDate = new Date(reqData.CLOSE_DATE);

        // Calculate the expiration time in seconds (for example, 1 hour from CLOSE_DATE)
        const expirationTime =
          Math.floor(closeDate.getTime() / 1000) + 1 * 60 * 60; // 1 hour in seconds

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
          expiresIn: expirationTime,
        });
        const link = `${process.env.backend_url}/supplier-home?token=` + token;
        //console.log(link);
        let body = `Dear Supplier,<br><br>

        We are pleased to announce the publication of a new tender/RFQ and invite you to submit your quotation. Your participation is integral to our procurement process, and we value your expertise in this regard.
        
        Please access the tender/RFQ document via the link provided below:<br>
        "${link}"
        Your submission will contribute significantly to our decision-making process, and we anticipate the opportunity to collaborate with you.
        Thank you for considering this invitation, and we look forward to receiving your quotation.<br><br>
        
        Best regards,<br>
        Seven Rings Cement
        `;
        let img_path = path.resolve(
          __dirname,
          "../../../../../common/api/v1/assets/src-logo.png"
        );

        await commonObject.sendEmail(
          reqData.RFQ_TITLE,
          body,
          rowObjectData.EMAIL,
          img_path
        );
        if (!isEmpty(reqData.ADDITIONAL_EMAIL)) {
          await commonObject.sendEmail(
            reqData.RFQ_TITLE,
            body,
            rowObjectData.ADDITIONAL_EMAIL,
            img_path
          );
        }
        if (!isEmpty(rowObjectData.CONTACT_EMAIL)) {
          await commonObject.sendEmail(
            reqData.RFQ_TITLE,
            body,
            rowObjectData.CONTACT_EMAIL,
            img_path
          );
        }
      }

      // "D:/Users/m.hassan/Desktop/SSGIL P2P/src-logo.png",
      //"/home/oracle/src-logo.png",
    }

    if (!isEmpty(updateSentStatusList)) {
      let updateEmailSentStatusResult = await rfqModel.emailSentStatusUpdate(
        updateSentStatusList
      );
    }
    //console.log("updateEmailSentStatusResult: ", updateEmailSentStatusResult);
    value.message = `Supplier Invitation Sent Successfully.`;
    value.status = 200;
    return res.status(value.status).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(
  `/supplier-delete`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    try {
      let finalData = [];
      let value = {
        message: ``,
        status: 200,
      };
      //userId = req.user ? req.user.USER_ID : null;
      let reqData = {
        INVITATION_ID: req.body.INVITATION_ID,
      };

      if (!Array.isArray(reqData.INVITATION_ID)) {
        return res
          .status(400)
          .send({ message: "It Should Be Array.", status: 400 });
      }
      if (!Array.isArray(reqData.INVITATION_ID)) {
        return res
          .status(400)
          .send({ message: "Invitation ID's Should Be Array.", status: 400 });
      }

      reqData.INVITATION_ID.map(async (item) => {
        if (isEmpty(item.INVITATION_ID)) {
          return res.status(400).send({
            message: `Please Give Invitation ID.`,
            status: 400,
          });
        }
        if (item.EMAIL_SENT_STATUS == 1) {
          return res.status(400).send({
            message: `Already sent email to this: ${item.EMAIL}`,
            status: 400,
          });
        } else {
          finalData.push(item.INVITATION_ID);
        }
      });

      // List
      let queryResultList = await rfqModel.supplierDelete(finalData);
      if (queryResultList.rowsAffected > 0) {
        value.message = "Supplier Removed Successfully.";
        return res.status(200).json(value);
      } else {
        value.message = "Supplier Not Removed. Try Again.";
        return res.status(400).json(value);
      }
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

router.post(
  `/category-list`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    try {
      let finalData = {};
      let value = {
        message: `Category List`,
        status: 200,
        data: [],
      };
      //userId = req.user ? req.user.USER_ID : null;
      let reqData = {
        ORG_ID: req.body.ORG_ID,
      };

      if (isEmpty(reqData.ORG_ID)) {
        return res
          .status(400)
          .send({ message: "Please Give ORG ID", status: 400 });
      }
      finalData.ORG_ID = reqData.ORG_ID;
      // List
      let queryResultList = await rfqModel.categoryList(finalData);
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
  `/supplier-list`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    let filepath1 = `${process.env.backend_url}${process.env.profile_pic1_file_path_name}`;
    let filepath2 = `${process.env.backend_url}${process.env.profile_pic2_file_path_name}`;
    try {
      let finalData = {};
      let filteredList = [];
      let value = {
        message: `Supplier List`,
        status: 200,
        total: 0,
        filepath1: filepath1,
        filepath2: filepath2,
        data: [],
      };
      //userId = req.user ? req.user.USER_ID : null;
      let reqData = {
        VENDOR_LIST_HEADER_ID: req.body.VENDOR_LIST_HEADER_ID,
        SEARCH_FIELD: req.body.SEARCH_FIELD,
        ORG_ID: req.body.ORG_ID,
        OFFSET: req.body.OFFSET,
        LIMIT: req.body.LIMIT,
      };
      //console.log(reqData);
      if (reqData.OFFSET == 1) reqData.OFFSET = 0;

      Object.entries(reqData).forEach(([key, value]) => {
        if (!isEmpty(value) && key != "OFFSET" && key != "LIMIT") {
          finalData[key] = value;
        }
      });

      if (isEmpty(reqData.VENDOR_LIST_HEADER_ID)) {
        finalData.SEARCH_FIELD = reqData.SEARCH_FIELD;
        finalData.ORG_ID = reqData.ORG_ID;

        try {
          // Execute total count and list queries in parallel
          const [queryResultListTotal, queryResultList] = await Promise.all([
            rfqModel.supplierListTotal(finalData),
            rfqModel.supplierList(finalData, reqData.OFFSET, reqData.LIMIT),
          ]);

          // Process total count
          await commonObject.makeArrayObject(queryResultListTotal);
          const rowObjectTotal = await commonObject.convertArrayToObject(
            queryResultListTotal.queryResult.finalData
          );
          value.total = rowObjectTotal.TOTAL;

          // Process list
          await commonObject.makeArrayObject(queryResultList);
          const list = queryResultList.queryResult.finalData;

          // Fetch additional data for each supplier in parallel
          const enhancedList = await Promise.all(
            list.map(async (supplier) => {
              const [orgWiseSupplierSite, supplierContact] = await Promise.all([
                rfqModel.orgWiseSupplierSite(
                  finalData.ORG_ID,
                  supplier.USER_ID
                ),
                rfqModel.supplierContact(supplier.USER_ID),
              ]);

              await Promise.all([
                commonObject.makeArrayObject(orgWiseSupplierSite),
                commonObject.makeArrayObject(supplierContact),
              ]);

              return {
                ...supplier,
                SITES: orgWiseSupplierSite.queryResult.finalData,
                CONTACT: supplierContact.queryResult.finalData,
              };
            })
          );

          value.data = enhancedList;

          return res.status(200).json(value);
        } catch (error) {
          console.error("Error in processing supplier list:", error);
          return res.status(500).json({ error: "Internal server error" });
        }
      } else {
        finalData.SEARCH_FIELD = reqData.SEARCH_FIELD;
        finalData.ORG_ID = reqData.ORG_ID;
        finalData.VENDOR_LIST_HEADER_ID = reqData.VENDOR_LIST_HEADER_ID;
        // Execute total count and list queries in parallel
        const [queryResultListTotal, queryResultList] = await Promise.all([
          rfqModel.supplierNumberFromEBSCount(finalData),
          rfqModel.supplierNumberFromEBS(
            finalData,
            reqData.OFFSET,
            reqData.LIMIT
          ),
        ]);
        // Process total count
        await commonObject.makeArrayObject(queryResultListTotal);
        const rowObjectTotal = await commonObject.convertArrayToObject(
          queryResultListTotal.queryResult.finalData
        );
        value.total = rowObjectTotal.TOTAL;

        // Process list
        await commonObject.makeArrayObject(queryResultList);
        const list2 = queryResultList.queryResult.finalData;

        // Fetch additional data for each supplier in parallel
        const enhancedList = await Promise.all(
          list2.map(async (supplier) => {
            const [orgWiseSupplierSite, supplierContact] = await Promise.all([
              rfqModel.orgWiseSupplierSite(finalData.ORG_ID, supplier.USER_ID),
              rfqModel.supplierContact(supplier.USER_ID),
            ]);

            await Promise.all([
              commonObject.makeArrayObject(orgWiseSupplierSite),
              commonObject.makeArrayObject(supplierContact),
            ]);

            return {
              ...supplier,
              SITES: orgWiseSupplierSite.queryResult.finalData,
              CONTACT: supplierContact.queryResult.finalData,
            };
          })
        );

        value.data = enhancedList;
        return res.status(200).json(value);
      }
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

router.get(`/location-list`, verifyToken, async (req, res) => {
  try {
    let value = {
      message: `Location List`,
      status: 200,
      data: [],
    };
    // List
    let queryResultList = await rfqModel.locationList();
    await commonObject.makeArrayObject(queryResultList);
    value.data = queryResultList.queryResult.finalData;
    return res.status(200).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.get(`/invoice-type-list`, verifyToken, async (req, res) => {
  try {
    let value = {
      message: `Invoice Type List`,
      status: 200,
      data: [],
    };
    // List
    let queryResultList = await rfqModel.invoiceTypeList();
    await commonObject.makeArrayObject(queryResultList);
    value.data = queryResultList.queryResult.finalData;
    return res.status(200).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.get(`/freight-term-list`, verifyToken, async (req, res) => {
  try {
    let value = {
      message: `Freight Terms List`,
      status: 200,
      data: [],
    };
    // List
    let queryResultList = await rfqModel.freightTermsList();
    await commonObject.makeArrayObject(queryResultList);
    value.data = queryResultList.queryResult.finalData;
    return res.status(200).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.get(`/payment-term-list`, verifyToken, async (req, res) => {
  try {
    let value = {
      message: `Payment Terms List`,
      status: 200,
      data: [],
    };
    // List
    let queryResultList = await rfqModel.paymentTermsList();
    await commonObject.makeArrayObject(queryResultList);
    value.data = queryResultList.queryResult.finalData;
    return res.status(200).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.get(
  `/general-term-list`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    try {
      let value = {
        message: `General Terms List`,
        status: 200,
        data: [],
      };
      // List
      let queryResultList = await rfqModel.generalTermsList();
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
  `/inventory-stock`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    try {
      let finalData = {};
      let value = {
        message: ``,
        status: 200,
      };
      let reqData = {
        ORG_ID: req.body.ORG_ID,
        ITEM_ID: req.body.ITEM_ID,
      };
      finalData.ORG_ID = reqData.ORG_ID;
      finalData.ITEM_ID = reqData.ITEM_ID;
      // List
      let queryResultList = await rfqModel.inventoryStock(
        finalData,
        reqData.ORG_ID,
        reqData.ITEM_ID
      );
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
  `/ou-wise-stock`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    try {
      let finalData = {};
      let value = {
        message: ``,
        status: 200,
      };
      let reqData = {
        ORG_ID: req.body.ORG_ID,
        ITEM_ID: req.body.ITEM_ID,
      };
      finalData.ORG_ID = reqData.ORG_ID;
      finalData.ITEM_ID = reqData.ITEM_ID;
      // List
      let queryResultList = await rfqModel.ouWiseStock(
        finalData,
        reqData.ORG_ID,
        reqData.ITEM_ID
      );
      await commonObject.makeArrayObject(queryResultList);
      value.data = queryResultList.queryResult.finalData;
      return res.status(200).json(value);
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

module.exports = router;
