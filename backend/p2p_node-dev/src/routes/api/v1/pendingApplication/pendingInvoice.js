const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const pendingInvoiceModel = require("../../../../models/api/v1/pendingApplication/pendingInvoice");
const bankList = require("../../../../models/api/v1/common/bankList");
const {
  userRoleAuthorization,
} = require("../../../../middleware/authorization");
const isEmpty = require("is-empty");
const imageFilePathFinder = require("../../../../common/api/v1/imageFilePathFinder");
const currencyList = require("../../../../models/api/v1/common/currencyList");
const countryModel = require("../../../../models/api/v1/common/countryList");
const bankModel = require("../../../../models/api/v1/supplierBank");
const siteModel = require("../../../../models/api/v1/supplierRegistrationSiteCreation");
const p2pCache = require("../../../../common/api/v1/cache");
const rfqModel = require("./../../../../models/api/v1/pr2po/pr/rfqPreparation");

router.post(`/list`, verifyToken, userRoleAuthorization, async (req, res) => {
  let filepath1 = `${process.env.backend_url}${process.env.profile_pic1_file_path_name}`;
  let filepath2 = `${process.env.backend_url}${process.env.profile_pic2_file_path_name}`;
  let filepath = `${process.env.backend_url}${process.env.invoice_mushok_file_path_name}`;
  let rfqHeaderFile = `${process.env.backend_url}${process.env.rfq_header_file_path_name}`;
  let rfqHeaderTermFile = `${process.env.backend_url}${process.env.rfq_header_term_file_path_name}`;

  let reqData = {
    APPROVAL_STATUS: req.body.APPROVAL_STATUS,
    SEARCH_VALUE: req.body.SEARCH_VALUE,
    OFFSET: req.body.OFFSET,
    LIMIT: req.body.LIMIT,
  };
  userId = req.user ? req.user.USER_ID : null;
  try {
    let value = {
      message: `Supplier List of Pending Invoice`,
      status: 200,
      total: 0,
      profile_pic1: filepath1,
      profile_pic2: filepath2,
      invoice_mushok: filepath,
      header_file_path: rfqHeaderFile,
      header_term_file_path: rfqHeaderTermFile,
      data: [],
    };

    //Check Buyer Pending List
    let buyerPendingTotal = await pendingInvoiceModel.pendingBuyerTotal(
      userId,
      reqData.APPROVAL_STATUS,
      reqData.SEARCH_VALUE
    );
    await commonObject.makeArrayObject(buyerPendingTotal);
    let rowObjectBuyer = await commonObject.convertArrayToObject(
      buyerPendingTotal.queryResult.finalData
    );
    value.total = rowObjectBuyer.TOTAL;

    let buyerPendingResult = await pendingInvoiceModel.pendingBuyerInvoice(
      userId,
      reqData.APPROVAL_STATUS,
      reqData.SEARCH_VALUE,
      reqData.OFFSET,
      reqData.LIMIT
    );
    await commonObject.makeArrayObject(buyerPendingResult);
    if (!isEmpty(buyerPendingResult.queryResult.finalData))
      value.data = buyerPendingResult.queryResult.finalData;

    if (isEmpty(buyerPendingResult.queryResult.finalData)) {
      let pendingLocalTotal,
        pendingForeignTotal,
        pendingLocal,
        pendingForeign = {};
      //Calling API
      [pendingLocalTotal, pendingForeignTotal, pendingLocal, pendingForeign] =
        await Promise.all([
          pendingInvoiceModel.pendingInvoiceLocalTotal(
            userId,
            reqData.APPROVAL_STATUS,
            reqData.SEARCH_VALUE
          ),
          pendingInvoiceModel.pendingInvoiceForeignTotal(
            userId,
            reqData.APPROVAL_STATUS,
            reqData.SEARCH_VALUE
          ),
          pendingInvoiceModel.pendingInvoiceLocal(
            userId,
            reqData.APPROVAL_STATUS,
            reqData.SEARCH_VALUE,
            reqData.OFFSET,
            reqData.LIMIT
          ),

          pendingInvoiceModel.pendingInvoiceForeign(
            userId,
            reqData.APPROVAL_STATUS,
            reqData.SEARCH_VALUE,
            reqData.OFFSET,
            reqData.LIMIT
          ),
        ]);

      //Convert to Array
      await Promise.all([
        commonObject.makeArrayObject(pendingLocalTotal),
        commonObject.makeArrayObject(pendingForeignTotal),
        commonObject.makeArrayObject(pendingLocal),
        commonObject.makeArrayObject(pendingForeign),
      ]);
      //Convert to Object
      let pendingLocalTotalObject,
        pendingForeignTotalObject = {};
      [pendingLocalTotalObject, pendingForeignTotalObject] = await Promise.all([
        commonObject.convertArrayToObject(
          pendingLocalTotal.queryResult.finalData
        ),
        commonObject.convertArrayToObject(
          pendingForeignTotal.queryResult.finalData
        ),
      ]);
      value.total =
        pendingLocalTotalObject.TOTAL + pendingForeignTotalObject.TOTAL;
      //List
      value.data = pendingLocal.queryResult.finalData.concat(
        pendingForeign.queryResult.finalData
      );
    }

    const enhancedList = await Promise.all(
      value.data.map(async (item) => {
        const finalData = { RFQ_ID: item.RFQ_ID };
        const [initResult, bankResult, rfqResult] = await Promise.all([
          pendingInvoiceModel.initiatorStatus(item.BUYER_USER_ID, item.INV_ID),
          bankModel.getDataByWhereCondition({
            id: item.BANK_ID,
          }),
          rfqModel.rfqHeaderDetails(finalData),
        ]);

        await Promise.all([
          commonObject.makeArrayObject(initResult),
          commonObject.makeArrayObject(bankResult),
          commonObject.makeArrayObject(rfqResult),
        ]);

        const [initObject, bankObject, rfqObject] = await Promise.all([
          commonObject.convertArrayToObject(initResult.queryResult.finalData),
          commonObject.convertArrayToObject(bankResult.queryResult.finalData),
          commonObject.convertArrayToObject(rfqResult.queryResult.finalData),
        ]);

        return {
          ...item,
          BUYER_STATUS: initObject,
          BANK_DETAILS: bankObject,
          RATE_TYPE: rfqObject.RATE_TYPE,
          RATE_DATE: rfqObject.RATE_DATE,
          CONVERSION_RATE: rfqObject.CONVERSION_RATE,
        };
      })
    );
    value.data = enhancedList;

    /* for (let i = 0; i < value.data.length; i++) {
      let result = await pendingInvoiceModel.initiatorStatus(
        value.data[i].BUYER_USER_ID,
        value.data[i].INV_ID
      );
      await commonObject.makeArrayObject(result);
      let rowObject = await commonObject.convertArrayToObject(
        result.queryResult.finalData
      );
      value.data[i].BUYER_STATUS = rowObject;
    }*/

    return res.status(200).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(`/details`, verifyToken, async (req, res) => {
  let reqData = {
    INV_ID: req.body.INVOICE_ID,
  };
  //userId = req.user ? req.user.USER_ID : null;
  let filepath = `${process.env.backend_url}${process.env.invoice_mushok_file_path_name}`;
  try {
    let value = {
      message: `Invoice Details`,
      status: 200,
      file_path: filepath,
      data: {},
    };
    if (isEmpty(Number(reqData.INV_ID))) {
      let value = {
        message: `Please Give Invoice ID.`,
        status: 400,
      };
      return res.status(400).json(value);
    } else {
      let details = await pendingInvoiceModel.details(reqData.INV_ID);
      //console.log(supplierListQueryResult);

      await commonObject.makeArrayObject(details);
      //console.log(supplierListQueryResult.queryResult.finalData);
      let rowObject = await commonObject.convertArrayToObject(
        details.queryResult.finalData
      );
      value.data = rowObject;
      //!Bank
      /*
        let bankDetails = await bankModel.getDataByWhereCondition(
          rowObject.BANK_ID
        );
        await commonObject.makeArrayObject(bankDetails);
        //console.log(supplierListQueryResult.queryResult.finalData);
        let rowObjectBank = await commonObject.convertArrayToObject(
          bankDetails.queryResult.finalData
        );
        value.bank_details = rowObjectBank;
        */
      //! Site
      /*
        let siteDetails = await siteModel.getDataByWhereCondition(
          rowObject.SITE_ID
        );
        await commonObject.makeArrayObject(siteDetails);
        //console.log(supplierListQueryResult.queryResult.finalData);
        let rowObjectSite = await commonObject.convertArrayToObject(
          siteDetails.queryResult.finalData
        );
        value.site_details = rowObjectSite;
        */
      const cachedLocationArray = p2pCache.get("locationArray");
      console.log("locationArray", cachedLocationArray);
      let locationList = [];
      locationList = cachedLocationArray;

      //! Shipping and Buyer Details
      if (isEmpty(locationList)) {
        let queryResultShipToLocation =
          await pendingInvoiceModel.locationNBuyerName(
            rowObject.SHIP_TO_LOCATION_ID
          );
        await commonObject.makeArrayObject(queryResultShipToLocation);
        let rowObjectBillToLocationName =
          await commonObject.convertArrayToObject(
            queryResultShipToLocation.queryResult.finalData
          );
        value.shipping_details = rowObjectBillToLocationName;
      } else {
        for (let i = 0; i < locationList.length; i++) {
          if (locationList[i].LOCATION_ID == rowObject.SHIP_TO_LOCATION_ID) {
            console.log("shipping_details from cache", locationList[i]);
            value.shipping_details = locationList[i];
          }
        }
      }

      return res.status(200).json(value);
    }
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(`/item-details`, verifyToken, async (req, res) => {
  let reqData = {
    INV_ID: req.body.INVOICE_ID,
  };
  //userId = req.user ? req.user.USER_ID : null;
  let filepath = `${process.env.backend_url}${process.env.invoice_mushok_file_path_name}`;
  try {
    let value = {
      message: `Invoice Details`,
      status: 200,
      file_path: filepath,
      data: [],
    };
    if (isEmpty(Number(reqData.INV_ID))) {
      let value = {
        message: `Please Give Invoice ID.`,
        status: 400,
      };
      return res.status(400).json(value);
    } else {
      let details = await pendingInvoiceModel.itemDetails(reqData.INV_ID);
      //console.log(supplierListQueryResult);

      await commonObject.makeArrayObject(details);

      value.data = details.queryResult.finalData;
      return res.status(200).json(value);
    }
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(
  `/approve-reject`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    let reqData = {
      ACTION_CODE: req.body.ACTION_CODE,
      USER_ID: req.body.SUPPLIER_ID,
      STAGE_ID: req.body.STAGE_ID,
      STAGE_LEVEL: req.body.STAGE_LEVEL,
      INV_ID: req.body.INVOICE_ID,
      NOTE: req.body.NOTE,
      V_IS_BUYER: req.body.IS_BUYER,
      MODULE_NAME: req.body.MODULE_NAME,
    };
    console.log(reqData);
    userId = req.user ? req.user.USER_ID : null;

    try {
      let value = {
        message: ``,
        status: 0,
      };
      if (isEmpty(Number(reqData.INV_ID))) {
        let value = {
          message: `Please Give Invoice ID.`,
          status: 400,
        };
        return res.status(400).json(value);
      }
      if (isEmpty(Number(reqData.USER_ID))) {
        let value = {
          message: `Please Give Supplier ID.`,
          status: 400,
        };
        return res.status(400).json(value);
      }
      if (isEmpty(Number(reqData.STAGE_ID))) {
        let value = {
          message: `Please Give Stage ID.`,
          status: 400,
        };
        return res.status(400).json(value);
      }
      if (isEmpty(Number(reqData.STAGE_LEVEL))) {
        let value = {
          message: `Please Give Stage ID.`,
          status: 400,
        };
        return res.status(400).json(value);
      }
      if (isEmpty(Number(reqData.ACTION_CODE))) {
        let value = {
          message: `Please Give Action Code.`,
          status: 400,
        };
        return res.status(400).json(value);
      } else {
        let validateDataCheck = await commonObject.characterLimitCheck(
          reqData.NOTE,
          "APPROVAL NOTE"
        );

        if (validateDataCheck.success == false)
          return res.status(400).send({
            success: false,
            status: 400,
            message: validateDataCheck.message,
          });
        reqData.NOTE = validateDataCheck.data;

        //! Api Call

        let result = await pendingInvoiceModel.approveReject(
          reqData.INV_ID,
          reqData.ACTION_CODE,
          reqData.USER_ID,
          userId,
          reqData.MODULE_NAME,
          reqData.STAGE_LEVEL,
          reqData.STAGE_ID,
          reqData.NOTE,
          reqData.V_IS_BUYER
        );
        if (result === undefined || result === null) {
          value.message =
            "Invoice not approved, something went wrong. Please try again.";
          value.status = 400;
          return res.status(value.status).json(value);
        }

        //Buyer Approved
        if (
          result.outBinds.STATUS == 200 &&
          result.outBinds.FINAL_APPROVER === "N"
        ) {
          value.message = result.outBinds.MESSAGE;
          value.status = result.outBinds.STATUS;

          return res.status(value.status).json(value);
        }

        if (
          result.outBinds.STATUS == 200 &&
          result.outBinds.FINAL_APPROVER === "Y"
        ) {
          let invDetails = await pendingInvoiceModel.details(reqData.INV_ID);
          await commonObject.makeArrayObject(invDetails);
          let invDetailsObject = await commonObject.convertArrayToObject(
            invDetails.queryResult.finalData
          );
          console.log(invDetailsObject);
          //! PREPAYMENT
          if (
            (invDetailsObject.APPROVAL_STATUS =
              "APPROVED" &&
              invDetailsObject.INVOICE_TYPE.toUpperCase() === "PREPAYMENT")
          ) {
            let invDetailsSync =
              await pendingInvoiceModel.invoiceSyncForPrepayment(
                "APPROVED",
                invDetailsObject.INV_ID,
                invDetailsObject.INVOICE_TYPE,
                invDetailsObject.PO_NUMBER,
                invDetailsObject.INVOICE_NUM,
                invDetailsObject.INVOICE_DATE,
                invDetailsObject.GL_DATE,
                invDetailsObject.PAYMENT_METHOD_CODE,
                invDetailsObject.TOTAL_AMOUNT,
                invDetailsObject.VENDOR_ID,
                invDetailsObject.VENDOR_SITE_ID,
                invDetailsObject.ORG_ID,
                invDetailsObject.DESCRIPTION
              );
            console.log(`PREPAYMENT`);
            console.log("PREPAYMENT Result: ", invDetailsSync);
            console.log(`----------`);
          }
          //!STANDARD

          if (
            (invDetailsObject.APPROVAL_STATUS =
              "APPROVED" &&
              invDetailsObject.INVOICE_TYPE.toUpperCase() === "STANDARD")
          ) {
            let invDetailsSync =
              await pendingInvoiceModel.invoiceSyncForStandard(
                invDetailsObject.INVOICE_TYPE,
                invDetailsObject.INV_ID,
                invDetailsObject.PO_NUMBER,
                invDetailsObject.ORG_ID
              );
            console.log(`STANDARD`);
            console.log("STANDARD Result: ", invDetailsSync);
            console.log(`----------`);
          }
          console.log(result);
          value.message = result.outBinds.MESSAGE;
          value.status = result.outBinds.STATUS;

          return res.status(value.status).json(value);
        }
        if (result.outBinds.STATUS != 200) {
          value.message = result.outBinds.MESSAGE;
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

module.exports = router;
