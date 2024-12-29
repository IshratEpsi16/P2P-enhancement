const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const invoiceModel = require("./../../../../models/api/v1/supplierInvoice/invoice");
//const getUserRolePermission = require("../authentication/authorization_role_permission");
const {
  userPermissionAuthorization,
  userRoleAuthorization,
} = require("../../../../middleware/authorization");
const isEmpty = require("is-empty");
const commonModel = require("../../../../models/api/v1/common/orgNameById");
const siteModel = require("../../../../models/api/v1/supplierApproval/supplierRegistrationSiteCreation");
const currencyList = require("./../../../../models/api/v1/common/currencyList");
const bankModel = require("../../../../models/api/v1/supplierBank");
const fileUploaderCommonObject = require("../../../../common/api/v1/fileUploader");
const pendingInvoiceModel = require("../../../../models/api/v1/pendingApplication/pendingInvoice");
const templateModel = require("./../../../../models/api/v1/approvalTemplate/templateManage");
const p2pCache = require("../../../../common/api/v1/cache");
const rfqModel = require("./../../../../models/api/v1/pr2po/pr/rfqPreparation");

router.post(`/invoice-add-update`, verifyToken, async (req, res) => {
  let finalData = {};
  let updateData = {};
  let whereData = {};
  let whereLinesData = {};
  let updateLinesData = {};
  let finalItemData = {};

  try {
    let willUpdate = false;
    let value = {
      message: ``,
      status: 200,
    };
    userId = req.user ? req.user.USER_ID : null;
    let reqData = {
      INV_ID: req.body.INV_ID,
      INVOICE_TYPE: req.body.INVOICE_TYPE,
      PO_NUMBER: req.body.PO_NUMBER,
      PO_HEADER_ID: req.body.PO_HEADER_ID,
      RFQ_ID: req.body.RFQ_ID,
      CS_ID: req.body.CS_ID,
      VENDOR_ID: req.body.VENDOR_ID,
      INVOICE_DATE: req.body.INVOICE_DATE,
      TOTAL_AMOUNT: req.body.TOTAL_AMOUNT,
      INVOICE_NUM: req.body.INVOICE_NUM,
      ORG_ID: req.body.ORG_ID,
      ORGANIZATION_ID: req.body.ORGANIZATION_ID,
      INVOICE_STATUS: req.body.INVOICE_STATUS,
      APPROVAL_STATUS: req.body.APPROVAL_STATUS,
      SITE_ID: req.body.SITE_ID,
      BANK_ID: req.body.BANK_ID,
      CURRENCY_CODE: req.body.CURRENCY_CODE,
      DESCRIPTION: req.body.DESCRIPTION,
      VENDOR_ID: req.body.VENDOR_ID,
      LC_NUMBER: req.body.LC_NUMBER,
      BL_NUMBER: req.body.BL_NUMBER,
      BENEFICIARY_NUMBER: req.body.BENEFICIARY_NUMBER,
      BUYER_DEPARTMENT: req.body.BUYER_DEPARTMENT,
      APPROVAL_FLOW_TYPE: req.body.APPROVAL_FLOW_TYPE,
      APPLY_PREPAY_NUM: req.body.APPLY_PREPAY_NUM,
      PREPAY_APPLY_AMOUNT: req.body.PREPAY_APPLY_AMOUNT,
      PAYMENT_METHOD_NAME: req.body.PAYMENT_METHOD_NAME,
      PAYMENT_METHOD_CODE: req.body.PAYMENT_METHOD_CODE,
      CONVERSION_RATE: req.body.CONVERSION_RATE,
      ITEMS:
        req.body.INVOICE_TYPE === "PREPAYMENT"
          ? []
          : JSON.parse(req.body.ITEMS || "[]"),
    };
    console.log(reqData);

    // for (let i = 0; i < reqData.ITEMS.length; i++) {
    //   let item = reqData.ITEMS[i];
    //   console.log(`Item ${i + 1}:`);
    //   // Perform other operations as needed
    // }
    if (
      reqData.BUYER_DEPARTMENT.toUpperCase() === "FOREIGN" &&
      reqData.APPROVAL_FLOW_TYPE.toUpperCase() === "LONG"
    ) {
      if (isEmpty(CONVERSION_RATE)) {
        return res.status(400).send({
          message: `Please Give Conversion Rate.`,
          status: 400,
        });
      }
    }

    //! Supplier Invoice Number Check
    let queryResultINvoiceNumberCheck = await invoiceModel.invoiceNumberCheck(
      userId,
      reqData.INVOICE_NUM
    );
    await commonObject.makeArrayObject(queryResultINvoiceNumberCheck);
    let rowObjectInvCheck = await commonObject.convertArrayToObject(
      queryResultINvoiceNumberCheck.queryResult.finalData
    );

    if (!isEmpty(rowObjectInvCheck.INVOICE_NUM)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: `Invoice ${reqData.INVOICE_NUM} Already Exist. Please Give Unique Invoice Number.`,
      });
    }

    if (!isEmpty(reqData.INV_ID)) willUpdate = true;

    if (isEmpty(reqData.INVOICE_TYPE)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Please Give Invoice Type. Ex: Prepayment or Standard.",
      });
    }

    // if (
    //   reqData.INVOICE_TYPE != "Prepayment" ||
    //   reqData.INVOICE_TYPE != "Standard"
    // ) {
    //   return res.status(400).send({
    //     success: false,
    //     status: 400,
    //     message: "Please Give Invoice Type. Ex: Prepayment or Standard.",
    //   });
    // }
    if (isEmpty(reqData.PO_NUMBER) || isEmpty(reqData.PO_HEADER_ID)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Please Give PO Number or PO Header ID.",
      });
    }
    if (isEmpty(reqData.TOTAL_AMOUNT)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Please Give Total Amount.",
      });
    }
    if (isEmpty(reqData.INVOICE_DATE)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Please Give Invoice Date.",
      });
    }
    if (isEmpty(reqData.ORG_ID)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Please Give Operating Unit ID.",
      });
    }
    if (isEmpty(reqData.SITE_ID)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Please Give Supplier Site.",
      });
    }
    if (isEmpty(reqData.CURRENCY_CODE)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Please Give Currency Code.",
      });
    }
    if (isEmpty(reqData.VENDOR_ID)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Please Give Vendor ID.",
      });
    }
    if (isEmpty(reqData.BUYER_DEPARTMENT)) {
      return res
        .status(400)
        .send({ message: "Please Give Buyer Department.", status: 400 });
    }
    if (isEmpty(reqData.APPROVAL_FLOW_TYPE)) {
      return res
        .status(400)
        .send({ message: "Please Give Approval Flow Type.", status: 400 });
    }
    if (isEmpty(reqData.PAYMENT_METHOD_CODE)) {
      return res
        .status(400)
        .send({ message: "Please Give Payment Method Code.", status: 400 });
    }
    if (isEmpty(reqData.PAYMENT_METHOD_NAME)) {
      return res
        .status(400)
        .send({ message: "Please Give Payment Method Name.", status: 400 });
    }
    // Convert INVOICE_TYPE to uppercase
    if (reqData.INVOICE_TYPE.toUpperCase() === "STANDARD") {
      if (isEmpty(reqData.ITEMS)) {
        return res
          .status(400)
          .send({ message: "Items Should Not Be Empty.", status: 400 });
      } else if (!Array.isArray(reqData.ITEMS)) {
        return res
          .status(400)
          .send({ message: "Items Should Be Array.", status: 400 });
      }
    }
    // if (
    //   reqData.INVOICE_TYPE.toUpperCase() === "STANDARD" &&
    //   Array.isArray(reqData.ITEMS)
    // ) {
    //   for (let i = 0; i < reqData.ITEMS.length; i++) {}
    // }

    if (reqData.INVOICE_STATUS == "SUBMIT") {
      finalData.APPROVAL_STATUS = "IN PROCESS";
    }

    Object.entries(reqData).forEach(([key, value]) => {
      if (
        !isEmpty(value) &&
        key != "INVOICE_DATE" &&
        key != "GL_DATE" &&
        key != "ITEMS" &&
        key != "invoice_mushok"
      ) {
        finalData[key] = value;
      } else if (key == "INVOICE_DATE" && !isEmpty(value)) {
        let val = new Date(value);
        finalData[key] = val;
      } else if (key == "GL_DATE" && !isEmpty(value)) {
        let val = new Date(value);
        finalData[key] = val;
      }
    });
    //! Approval Template Assign
    let templateObject = {};

    if (
      reqData.BUYER_DEPARTMENT.toUpperCase() === "LOCAL" &&
      reqData.APPROVAL_FLOW_TYPE.toUpperCase() === "LONG"
    ) {
      Object.assign(templateObject, {
        APPROVAL_FLOW_TYPE: finalData.APPROVAL_FLOW_TYPE || undefined,
        BUYER_DEPARTMENT: finalData.BUYER_DEPARTMENT || undefined,
        AMOUNT: finalData.TOTAL_AMOUNT || undefined,
        ORG_ID: finalData.ORG_ID || undefined,
        MODULE_NAME: "Local Invoice Approval",
      });

      // Remove undefined properties
      Object.keys(templateObject).forEach((key) => {
        if (templateObject[key] === undefined) {
          delete templateObject[key];
        }
      });
    }

    if (
      reqData.BUYER_DEPARTMENT.toUpperCase() === "FOREIGN" &&
      reqData.APPROVAL_FLOW_TYPE.toUpperCase() === "LONG"
    ) {
      finalData.TOTAL_AMOUNT = reqData.TOTAL_AMOUNT * reqData.CONVERSION_RATE;
      Object.assign(templateObject, {
        APPROVAL_FLOW_TYPE: finalData.APPROVAL_FLOW_TYPE || undefined,
        BUYER_DEPARTMENT: finalData.BUYER_DEPARTMENT || undefined,
        AMOUNT: finalData.TOTAL_AMOUNT || undefined,
        ORG_ID: finalData.ORG_ID || undefined,
        MODULE_NAME: "Foreign Invoice Approval",
      });

      // Remove undefined properties
      Object.keys(templateObject).forEach((key) => {
        if (templateObject[key] === undefined) {
          delete templateObject[key];
        }
      });
    }
    if (reqData.APPROVAL_FLOW_TYPE.toUpperCase() === "SHORT") {
      Object.assign(templateObject, {
        APPROVAL_FLOW_TYPE: finalData.APPROVAL_FLOW_TYPE || undefined,
        BUYER_DEPARTMENT: finalData.BUYER_DEPARTMENT || undefined,
        ORG_ID: finalData.ORG_ID || undefined,
        MODULE_NAME: "Short Invoice Approval",
      });

      // Remove undefined properties
      Object.keys(templateObject).forEach((key) => {
        if (templateObject[key] === undefined) {
          delete templateObject[key];
        }
      });
    }

    //! Get Approval Template
    if (isEmpty(reqData.CS_ID)) {
      let templateResult = await templateModel.anyTemplateIDFind(
        templateObject
      ); //csModel.csTemplateFind(templateObject);
      console.log("Template: ", templateResult);
      await commonObject.makeArrayObject(templateResult);

      if (isEmpty(templateResult.queryResult.finalData)) {
        return res.status(400).send({
          message: `No Approval Hierarchy Found For ${reqData.BUYER_DEPARTMENT} Invoice! Please Create A Approval Hierarchy First.`,
          status: 400,
          msg_type: "dialog",
        });
      }
      finalData.TEMPLATE_ID = templateResult.queryResult.finalData[0].AS_ID;
      finalData.TEMPLATE_STAGE_LEVEL = 1;
    }
    // Check Items Field
    if (reqData.INVOICE_TYPE.toUpperCase() === "STANDARD") {
      for (let i = 0; i < reqData.ITEMS.length; i++) {
        if (
          isEmpty(reqData.ITEMS[i].LINE_AMOUNT) ||
          reqData.ITEMS[i].LINE_AMOUNT === undefined ||
          reqData.ITEMS[i].LINE_AMOUNT === null
        ) {
          return res
            .status(400)
            .send({ message: "Please Give Line Amount.", status: 400 });
        }
        if (
          isEmpty(reqData.ITEMS[i].UNIT_PRICE) ||
          reqData.ITEMS[i].UNIT_PRICE === undefined ||
          reqData.ITEMS[i].UNIT_PRICE === null
        ) {
          return res
            .status(400)
            .send({ message: "Please Give Item Unit Price.", status: 400 });
        }
        if (
          reqData.ITEMS[i].PO_LINE_NUMBER === undefined ||
          reqData.ITEMS[i].PO_LINE_NUMBER === null
        ) {
          return res
            .status(400)
            .send({ message: "Please Give PO Line Number.", status: 400 });
        }
        if (reqData.ITEMS[i].LINE_TYPE_CODE === "ITEM") {
          if (
            isEmpty(reqData.ITEMS[i].INVOICE_QTY) ||
            reqData.ITEMS[i].INVOICE_QTY === undefined ||
            reqData.ITEMS[i].INVOICE_QTY === null
          ) {
            return res
              .status(400)
              .send({ message: "Please Give Item Quantity.", status: 400 });
          }
        }
      }
    }
    //! Supplier Payment Method
    let queryResult = await invoiceModel.userPaymentMethod(userId);
    await commonObject.makeArrayObject(queryResult);
    let rowObject = await commonObject.convertArrayToObject(
      queryResult.queryResult.finalData
    );
    finalData.PAYMENT_METHOD_CODE = rowObject.PAYMENT_METHOD_CODE;
    //! Payment Term
    let queryResultPaymentTerm = await invoiceModel.paymentTerm(reqData.RFQ_ID);
    await commonObject.makeArrayObject(queryResultPaymentTerm);
    let rowObjectPaymentTerm = await commonObject.convertArrayToObject(
      queryResultPaymentTerm.queryResult.finalData
    );
    //! Vendor Site ID
    let queryResultVendorSiteID = await invoiceModel.vendorSiteID(
      reqData.ORG_ID,
      reqData.SITE_ID
    );
    await commonObject.makeArrayObject(queryResultVendorSiteID);
    let rowObjectVSiteID = await commonObject.convertArrayToObject(
      queryResultVendorSiteID.queryResult.finalData
    );
    finalData.VENDOR_SITE_ID = rowObjectVSiteID.VENDOR_SITE_ID;
    finalData.TERMS_ID = rowObjectPaymentTerm.PAYMENT_TERM_ID;
    finalData.TERMS_NAME = rowObjectPaymentTerm.NAME;
    finalData.SOURCE = "P2P";

    let { ITEMS, ...newDta } = finalData;
    finalData = newDta;

    finalData.CREATED_BY = userId;
    finalData.USER_ID = userId;
    console.log(finalData);

    //! File Upload
    if (
      req.files &&
      Object.keys(req.files).length > 0 &&
      req.files.invoice_mushok
    ) {
      let fileUploadCode = {};

      fileUploadCode = await fileUploaderCommonObject.uploadFile(
        req,
        "invoiceMushok",
        "invoice_mushok"
      );

      if (fileUploadCode.success == false)
        return res.status(400).send({
          success: false,
          status: 400,
          message: fileUploadCode.message,
        });

      finalData.MUSHOK_FILE_NAME = fileUploadCode.fileName;
      finalData.MUSHOK_FILE_ORG_NAME = fileUploadCode.fileOriginalName;
    }
    // Add
    if (isEmpty(reqData.INV_ID) || reqData.INV_ID === undefined) {
      let queryResult = await invoiceModel.addNewInvHeader(finalData);
      //console.log(queryResult);
      console.log(queryResult.outBinds[0][0]);
      if (queryResult.rowsAffected > 0) {
        if (reqData.INVOICE_TYPE.toUpperCase() === "STANDARD") {
          for (let i = 0; i < reqData.ITEMS.length; i++) {
            finalItemData = { ...reqData.ITEMS[i] };
            finalItemData.INV_ID = queryResult.outBinds[0][0];
            finalItemData.LINE_NUM = i + 1;
            finalItemData.RECEIVING_STATUS = "DELIVER";
            finalItemData.ORG_ID = reqData.ORG_ID;
            finalItemData.ACCOUNTING_DATE = finalData.INVOICE_DATE;
            console.log(finalItemData);
            try {
              let queryResultLines = await invoiceModel.addNewInvLines(
                finalItemData
              );
              console.log("queryResultLines", queryResultLines);
            } catch (error) {
              console.log(error);
            }
          }
        }
        value.message = "New Invoice Submitted Successfully.";
        value.status = 200;
        return res.status(value.status).json(value);
      } else {
        value.message = "Invoice Not Created.";
        value.status = 500;
        return res.status(value.status).json(value);
      }
    }
    if (willUpdate) {
      Object.entries(finalData).forEach(([key, value]) => {
        if (!isEmpty(value) && key != "INV_ID") {
          updateData[key] = value;
        }
      });
      // if (!isEmpty(updateData.INVOICE_DATE)) {
      //   let val = Date(updateData.INVOICE_DATE);
      //   updateData.INVOICE_DATE = val;
      // }
      // if (!isEmpty(updateData.GL_DATE)) {
      //   let val = Date(updateData.GL_DATE);
      //   updateData.GL_DATE = val;
      //   console.log(updateData.GL_DATE);
      // }
      updateData.LAST_UPDATED_BY = userId;
      whereData.INV_ID = reqData.INV_ID;
      console.log(updateData);

      let queryResult = await invoiceModel.updateData(updateData, whereData);
      console.log(`queryResult`);
      console.log(queryResult);
      if (queryResult.rowsAffected > 0) {
        value.message = "Invoice Updated.";
        value.status = 200;
        return res.status(value.status).json(value);
      } else {
        value.message = "Invoice Not Updated. Please Try Again.";
        value.status = 500;
        return res.status(value.status).json(value);
      }
    }
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(`/invoice-list`, verifyToken, async (req, res) => {
  //let filepath = `${process.env.backend_url}${process.env.profile_pic_file_path_name}`;
  let filepath = `${process.env.backend_url}${process.env.invoice_mushok_file_path_name}`;
  let rfqHeaderFile = `${process.env.backend_url}${process.env.rfq_header_file_path_name}`;
  let rfqHeaderTermFile = `${process.env.backend_url}${process.env.rfq_header_term_file_path_name}`;
  let finalData = {};
  let whereData = {};
  let columns = [];
  try {
    let value = {
      message: `Invoice List`,
      status: 200,
      //PROFILE_PIC: filepath,
      file_path: filepath,
      header_file_path: rfqHeaderFile,
      header_term_file_path: rfqHeaderTermFile,
      total: 0,
      data: [],
    };
    //userId = req.user ? req.user.USER_ID : null;
    let reqData = {
      INV_ID: req.body.INV_ID,
      USER_ID: req.body.SUPPLIER_ID,
      INVOICE_STATUS: req.body.INVOICE_STATUS,
      APPROVAL_STATUS: req.body.APPROVAL_STATUS,
      BUYER_USER_ID: req.body.BUYER_USER_ID,
      BUYER_APPROVAL_STATUS: req.body.BUYER_APPROVAL_STATUS,
      INVOICE_TYPE: req.body.INVOICE_TYPE,
      STATUS: req.body.STATUS,
      FROM_DATE: req.body.FROM_DATE,
      TO_DATE: req.body.TO_DATE,
      OFFSET: req.body.OFFSET,
      LIMIT: req.body.LIMIT,
      ORDER_BY: req.body.ORDER_BY,
    };
    if (!isEmpty(reqData.INVOICE_TYPE)) {
      (reqData.INVOICE_TYPE = reqData.INVOICE_TYPE.toUpperCase());
    }

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
      if (!isEmpty(value)) {
        finalData[key] = value;
        columns.push(key);
      }
    });

    columns.forEach((key) => {
      whereData[key] = finalData[key];
    });
    // Total Count
    let queryResultTotal = await invoiceModel.byWhereTotalCount(finalData);
    //console.log(queryResultTotal);
    await commonObject.makeArrayObject(queryResultTotal);
    let rowObject = await commonObject.convertArrayToObject(
      queryResultTotal.queryResult.finalData
    );
    value.total = rowObject.TOTAL;
    // List
    //console.log(finalData);
    let queryResult = await invoiceModel.byWhere(finalData);
    //console.log(queryResult);
    await commonObject.makeArrayObject(queryResult);
    //value.data = queryResultList.queryResult.finalData;
    let list = queryResult.queryResult.finalData;
    console.log(list);

    const cachedLocationArray = p2pCache.get("locationArray") || [];
    const locationMap = new Map(
      cachedLocationArray.map((location) => [location.LOCATION_ID, location])
    );
    const cachedCurrencyArray = p2pCache.get("currencyArray") || [];

    const currencyMap = new Map(
      cachedCurrencyArray.map((currency) => [currency.CURRENCY_CODE, currency])
    );

    const optimizedList = await Promise.all(
      list.map(async (item) => {
        // Org Details
        const orgName = await commonModel.ouListByID(item.ORG_ID);
        await commonObject.makeArrayObject(orgName);
        const orgDetails = await commonObject.convertArrayToObject(
          orgName.queryResult.finalData
        );
        let leDetails = await commonModel.leDetailsByOrgID(item.ORG_ID);
        await commonObject.makeArrayObject(leDetails);
        let leObject = await commonObject.convertArrayToObject(
          leDetails.queryResult.finalData
        );

        // Shipping Details
        let shippingDetails;
        if (locationMap.size > 0 && locationMap.has(item.SHIP_TO_LOCATION_ID)) {
          shippingDetails = locationMap.get(item.SHIP_TO_LOCATION_ID);
        } else {
          const queryResultShipToLocation =
            await pendingInvoiceModel.locationNBuyerName(
              item.SHIP_TO_LOCATION_ID
            );
          await commonObject.makeArrayObject(queryResultShipToLocation);
          shippingDetails = await commonObject.convertArrayToObject(
            queryResultShipToLocation.queryResult.finalData
          );
        }

        // Shipping Details
        let currencyDetails;
        if (currencyMap.size > 0 && currencyMap.has(item.CURRENCY_CODE)) {
          currencyDetails = currencyMap.get(item.CURRENCY_CODE);
        } else {
          let queryResultCurrency = await currencyList.currencyNameById(
            item.CURRENCY_CODE
          );
          //console.log("queryResultCurrency: ", queryResultCurrency);
          await commonObject.makeArrayObject(queryResultCurrency);
          currencyDetails = await commonObject.convertArrayToObject(
            queryResultCurrency.queryResult.finalData
          );
        }
        let bakResult = await bankModel.getDataByWhereCondition({
          id: item.BANK_ID,
        });
        await commonObject.makeArrayObject(bakResult);
        let bankObject = await commonObject.convertArrayToObject(
          bakResult.queryResult.finalData
        );
        const finalData = { RFQ_ID: item.RFQ_ID };
        let rfqResult = await rfqModel.rfqHeaderDetails(finalData);
        await commonObject.makeArrayObject(rfqResult);
        let rfqObject = await commonObject.convertArrayToObject(
          rfqResult.queryResult.finalData
        );

        let initResult = await pendingInvoiceModel.initiatorStatus(
          item.BUYER_USER_ID,
          item.INV_ID
        );
        await commonObject.makeArrayObject(initResult);
        let initObject = await commonObject.convertArrayToObject(
          initResult.queryResult.finalData
        );
        return {
          ...item,
          BUYER_STATUS: initObject,
          ORG_DETAILS: orgDetails,
          shipping_details: shippingDetails,
          CURRENCY_NAME: currencyDetails.CURRENCY_NAME,
          LE_DETAILS: leObject,
          BANK_DETAILS: bankObject,
          RATE_TYPE: rfqObject.RATE_TYPE,
          RATE_DATE: rfqObject.RATE_DATE,
          CONVERSION_RATE: rfqObject.CONVERSION_RATE,
        };
      })
    );

    //console.log("optimizedList", optimizedList);

    value.data = optimizedList;
    value.message = "Invoice List";
    value.status = 200;
    return res.status(200).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(`/invoice-details`, verifyToken, async (req, res) => {
  let finalData = {};
  let whereData = {};
  let columns = [];
  try {
    let value = {
      message: ``,
      status: 200,
      total: 0,
      data: [],
    };
    let reqData = {
      INV_ID: req.body.INVOICE_ID,
    };
    console.log(reqData);

    let query = await invoiceModel.invoiceDetails(reqData.INV_ID);
    console.log(query);
    await commonObject.makeArrayObject(query);
    // console.log(query.queryResult.finalData);

    value.data = query.queryResult.finalData;
    value.message = "Invoice Details";
    value.status = 200;
    return res.status(value.status).json(value);
  } catch (error) {
    //logger.info(error);
    //logger.error(error);
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
      shipping_details: {},
      data: [],
    };
    let reqData = {
      INVOICE_ID: req.body.INVOICE_ID,
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
    let queryResultTotal = await invoiceModel.detailsByWhereTotalCount(
      finalData
    );
    //console.log(queryResultTotal);
    await commonObject.makeArrayObject(queryResultTotal);
    let total = await commonObject.convertArrayToObject(
      queryResultTotal.queryResult.finalData
    );
    value.total = total.TOTAL;
    //console.log(finalData);
    //! Data
    let queryResult = await invoiceModel.detailsByWhere(finalData);
    //console.log(queryResult);
    await commonObject.makeArrayObject(queryResult);
    let rowObject = await commonObject.convertArrayToObject(
      queryResult.queryResult.finalData
    );

    //! Shipping and Buyer Details
    /*let queryResultShipToLocation =
      await pendingInvoiceModel.locationNBuyerName(rowObject.CS_RFQ_ID);
    await commonObject.makeArrayObject(queryResultShipToLocation);
    let rowObjectBillToLocationName = await commonObject.convertArrayToObject(
      queryResultShipToLocation.queryResult.finalData
    );
    value.shipping_details = rowObjectBillToLocationName;*/

    value.data = queryResult.queryResult.finalData;
    value.message = "Invoice Details";
    value.status = 200;
    return res.status(value.status).json(value);
  } catch (error) {
    //logger.info(error);
    //logger.error(error);
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});
module.exports = router;
