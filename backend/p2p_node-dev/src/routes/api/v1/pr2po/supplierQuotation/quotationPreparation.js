const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../../common/api/v1/common");
const quotationModel = require("../../../../../models/api/v1/pr2po/supplierQuotation/quotationPreparation");
//const getUserRolePermission = require("../authentication/authorization_role_permission");
const {
  userPermissionAuthorization,
  userRoleAuthorization,
} = require("../../../../../middleware/authorization");
const rfqModel = require("../../../../../models/api/v1/pr2po/pr/rfqPreparation");
const isEmpty = require("is-empty");
const fileUploaderCommonObject = require("../../../../../common/api/v1/fileUploader");

router.post(`/quotation-status-update`, verifyToken, async (req, res) => {
  const months = [
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

  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const monthIndex = today.getMonth(); // Month index starts from 0
  const year = String(today.getFullYear()).slice(-2); // Get last two digits of the year
  let hours = String(today.getHours()).padStart(2, "0");
  const minutes = String(today.getMinutes()).padStart(2, "0");
  const seconds = String(today.getSeconds()).padStart(2, "0");

  // Subtract 6 hours
  hours = String(parseInt(hours) - 6).padStart(2, "0");

  const formattedDate = `${day}/${months[monthIndex]}/${year} ${hours}:${minutes}:${seconds}`;
  console.log(formattedDate);

  try {
    let whereData = {};
    let updateData = {};
    userId = req.user ? req.user.USER_ID : null;
    let value = {
      message: "",
      status: 200,
    };
    whereData.USER_ID = userId;
    let reqData = {
      RFQ_ID: req.body.RFQ_ID,
      RESPONSE_STATUS: req.body.RESPONSE_STATUS,
      SUBMISSION_STATUS: req.body.SUBMISSION_STATUS,
      QUOT_VALID_DATE: req.body.QUOT_VALID_DATE,
      SITE_ID: req.body.SITE_ID,
      CURRENCY_CODE: req.body.CURRENCY_CODE,
      CAN_EDIT: req.body.CAN_EDIT,
      NOTE_TO_BUYER: req.body.NOTE_TO_BUYER,
      SUPPLIER_TERM_FILE: req.body.SUPPLIER_TERM_FILE,
      OLD_FILE_NAME: req.body.OLD_FILE_NAME,
    };
    if (isEmpty(reqData.RFQ_ID)) {
      return res.status(400).send({ message: "Enter RFQ ID", status: 400 });
    }

    Object.entries(reqData).forEach(([key, value]) => {
      if (value && key == "RFQ_ID") {
        whereData[key] = value;
      }
    });

    Object.entries(reqData).forEach(([key, value]) => {
      if (value && key !== "RFQ_ID" && value && key !== "OLD_FILE_NAME") {
        updateData[key] = value;
      }
    });
    if (!isEmpty(updateData.QUOT_VALID_DATE)) {
      let formatDate = (date) => {
        let day = String(date.getDate()).padStart(2, "0");
        let month = getMonthAbbreviation(date.getMonth()); // Month index starts from 0
        let year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
        let hours = String(date.getHours()).padStart(2, "0");
        let minutes = String(date.getMinutes()).padStart(2, "0");
        let seconds = String(date.getSeconds()).padStart(2, "0");
        //---
        // let day = String(date.getDate()).padStart(2, "0");
        // let month = getMonthAbbreviation(date.getMonth());
        // let year = date.getFullYear();
        // let hours = String(date.getHours()).padStart(2, "0");
        // let minutes = String(date.getMinutes()).padStart(2, "0");
        // let seconds = String(date.getSeconds()).padStart(2, "0");

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
      let val = new Date(updateData.QUOT_VALID_DATE);
      //val.setHours(val.getHours() - 6);
      val.setDate(val.getDate() + 1);
      //val.setHours(val.getHours() - 6);
      let formattedDate = formatDate(val);
      console.log(formattedDate);
      updateData.QUOT_VALID_DATE = formattedDate;
    }
    // if (!isEmpty(reqData.SUBMISSION_STATUS)) {
    //   // Create a new Date object to avoid modifying the original date
    //   let submissionDate = new Date(today);
    //   // Add 6 hours to the submission date
    //   submissionDate.setHours(submissionDate.getHours() + 6);
    //   // Assign the updated submission date to updateData
    //   updateData.SUBMISSION_DATE = submissionDate;
    // }
    // let val = new Date();
    // val.setHours(val.getHours() - 6);
    // const formattedDate = val.toISOString().slice(0, 19);
    updateData.RESPONSE_DATE = formattedDate;
    updateData.LAST_UPDATED_BY = userId;
    if (
      req.files &&
      Object.keys(req.files).length > 0 &&
      !isEmpty(req.files.SUPPLIER_TERM_FILE)
    ) {
      fileUploadCode = await fileUploaderCommonObject.uploadFile(
        req,
        "rfqSupplierTermFile",
        "SUPPLIER_TERM_FILE"
      );

      if (fileUploadCode.success == false)
        return res.status(400).send({
          success: false,
          status: 400,
          message: fileUploadCode.message,
        });
      updateData.SUP_TERM_FILE = fileUploadCode.fileName;
      updateData.SUP_TERM_FILE_ORG_NAME = fileUploadCode.fileOriginalName;
    }
    console.log(updateData);

    let queryResultUpdate = await quotationModel.responseUpdate(
      updateData,
      whereData
    );

    value.message =
      queryResultUpdate.rowsAffected > 0
        ? "Information Updated Successfully"
        : "Information Not Updated! Pease Try Again.";
    value.status = queryResultUpdate.rowsAffected > 0 ? 200 : 500;
    if (!isEmpty(reqData.OLD_FILE_NAME) && queryResultUpdate.rowsAffected > 0) {
      rowObjectDetails = await fileUploaderCommonObject.fileRemove(
        reqData.OLD_FILE_NAME,
        "rfqSupplierTermFile"
      );
    }

    return res.status(value.status).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(`/add-update-quotation`, verifyToken, async (req, res) => {
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
  try {
    let finalData = {};
    let whereData = {};
    let updateData = {};
    let value = {
      message: ``,
      status: 200,
    };
    userId = req.user ? req.user.USER_ID : null;
    let reqData = {
      QUOT_LINE_ID: req.body.QUOT_LINE_ID,
      RFQ_LINE_ID: req.body.RFQ_LINE_ID,
      RFQ_ID: req.body.RFQ_ID,
      WARRANTY_BY_SUPPLIER: req.body.WARRANTY_BY_SUPPLIER,
      SUPPLIER_VAT_APPLICABLE: req.body.SUPPLIER_VAT_APPLICABLE,
      UNIT_PRICE: req.body.UNIT_PRICE,
      TOLERANCE: req.body.TOLERANCE,
      OFFERED_QUANTITY: req.body.OFFERED_QUANTITY,
      PROMISE_DATE: req.body.PROMISE_DATE,
      AVAILABLE_BRAND_NAME: req.body.AVAILABLE_BRAND_NAME,
      AVAILABLE_ORIGIN: req.body.AVAILABLE_ORIGIN,
      AVAILABLE_SPECS: req.body.AVAILABLE_SPECS,
      SUPPLIER_FILE: req.body.SUPPLIER_FILE,
      OLD_FILE_NAME: req.body.OLD_FILE_NAME,
      TOTAL_LINE_AMOUNT: req.body.TOTAL_LINE_AMOUNT,
      VAT_TYPE: req.body.VAT_TYPE,
      VAT_AMOUNT: req.body.VAT_AMOUNT,
      FREIGHT_CHARGE: req.body.FREIGHT_CHARGE,
      WARRANTY_DETAILS: req.body.WARRANTY_DETAILS,
      COUNTRY_CODE: req.body.COUNTRY_CODE,
      COUNTRY_NAME: req.body.COUNTRY_NAME,
    };

    if (isEmpty(reqData.RFQ_LINE_ID)) {
      return res
        .status(400)
        .send({ message: "Please Give RFQ Line ID", status: 400 });
    }
    if (isEmpty(reqData.RFQ_ID)) {
      return res
        .status(400)
        .send({ message: "Please Give RFQ ID", status: 400 });
    }

    finalData = { ...reqData };
    finalData.USER_ID = userId;

    console.log(finalData);

    if (!isEmpty(reqData.PROMISE_DATE)) {
      let val = new Date(reqData.PROMISE_DATE);
      val.setHours(val.getHours() - 6);
      finalData.PROMISE_DATE = val;
    }

    // Remove QUOT_LINE_ID, PROMISE_DATE, SUPPLIER_FILE, and properties with undefined values
    finalData = Object.fromEntries(
      Object.entries(finalData).filter(
        ([key, value]) =>
          ![
            undefined,
            "QUOT_LINE_ID",
            "PROMISE_DATE",
            "SUPPLIER_FILE",
            "OLD_FILE_NAME",
          ].includes(value)
      )
    );

    if (!isEmpty(reqData.QUOT_LINE_ID)) {
      Object.entries(reqData).forEach(([key, value]) => {
        if (key == "QUOT_LINE_ID") {
          whereData[key] = value;
        }
      });

      Object.entries(reqData).forEach(([key, value]) => {
        if (
          value &&
          key !== "RFQ_ID" &&
          value &&
          key !== "RFQ_LINE_ID" &&
          value &&
          key !== "QUOT_LINE_ID" &&
          value &&
          key !== "SUPPLIER_FILE" &&
          value &&
          key !== "OLD_FILE_NAME"
        ) {
          updateData[key] = value;
        }
      });
      if (!isEmpty(updateData.PROMISE_DATE)) {
        let val = new Date(updateData.PROMISE_DATE);
        //val.setHours(val.getHours() - 6);
        val.setDate(val.getDate() + 1);
        //val.setHours(val.getHours() - 6);
        let formattedDate = formatDate(val);
        updateData.PROMISE_DATE = formattedDate;
      }
    }

    // Insert
    if (isEmpty(reqData.QUOT_LINE_ID)) {
      if (
        req.files &&
        Object.keys(req.files).length > 0 &&
        req.files.SUPPLIER_FILE
      ) {
        fileUploadCode = await fileUploaderCommonObject.uploadFile(
          req,
          "rfqSupplierLinesFile",
          "SUPPLIER_FILE"
        );

        if (fileUploadCode.success == false)
          return res.status(400).send({
            success: false,
            status: 400,
            message: fileUploadCode.message,
          });
        finalData.SUP_FILE_NAME = fileUploadCode.fileName;
        finalData.SUP_FILE_ORG_NAME = fileUploadCode.fileOriginalName;
      }
      let queryResultList = await quotationModel.addQuotLineItem(finalData);
      console.log(queryResultList);
      if (!isEmpty(queryResultList.outBinds[0][0])) {
        value.message = "Quotation Submitted Successfully.";
        return res.status(200).json(value);
      } else {
        value.message = "Quotation Not Submitted!.";
        return res.status(400).json(value);
      }
    } else if (!isEmpty(reqData.QUOT_LINE_ID)) {
      if (
        req.files &&
        Object.keys(req.files).length > 0 &&
        req.files.SUPPLIER_FILE
      ) {
        fileUploadCode = await fileUploaderCommonObject.uploadFile(
          req,
          "rfqSupplierLinesFile",
          "SUPPLIER_FILE"
        );

        if (fileUploadCode.success == false)
          return res.status(400).send({
            success: false,
            status: 400,
            message: fileUploadCode.message,
          });
        updateData.SUP_FILE_NAME = fileUploadCode.fileName;
        updateData.SUP_FILE_ORG_NAME = fileUploadCode.fileOriginalName;
      }
      let queryResultList = await quotationModel.quotationLineItemUpdate(
        updateData,
        whereData
      );
      console.log(queryResultList);
      //value.message = "Quotation Updated Successfully.";

      value.message =
        queryResultList.rowsAffected > 0
          ? "Quotation Updated Successfully."
          : "Quotation Not Updated! Pease Try Again.";
      value.status = queryResultList.rowsAffected > 0 ? 200 : 500;
      if (!isEmpty(reqData.OLD_FILE_NAME)) {
        rowObjectDetails = await fileUploaderCommonObject.fileRemove(
          reqData.OLD_FILE_NAME,
          "rfqSupplierLinesFile"
        );
      }
      return res.status(value.status).json(value);
    }
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(
  `/rfq-edit-permission`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    try {
      let whereData = {};
      let updateData = {};
      userId = req.user ? req.user.USER_ID : null;
      let value = {
        message: "",
        status: 200,
      };
      let reqData = {
        RFQ_ID: req.body.RFQ_ID,
        USER_ID: req.body.SUPPLIER_ID,
        CAN_EDIT: req.body.CAN_EDIT,
      };
      console.log(reqData);

      if (isEmpty(reqData.RFQ_ID)) {
        return res.status(400).send({ message: "Enter RFQ ID", status: 400 });
      }

      Object.entries(reqData).forEach(([key, value]) => {
        if (value && key == "RFQ_ID") {
          whereData[key] = value;
        }
      });
      whereData.USER_ID = reqData.USER_ID;

      // Object.entries(reqData).forEach(([key, value]) => {
      //   if (value && key !== "RFQ_ID" && value && key !== "USER_ID") {
      //     updateData[key] = value;
      //   }
      // });
      updateData.CAN_EDIT = reqData.CAN_EDIT;
      updateData.LAST_UPDATED_BY = userId;

      console.log(updateData);

      let queryResultUpdate = await quotationModel.responseUpdate(
        updateData,
        whereData
      );

      value.message =
        queryResultUpdate.rowsAffected > 0
          ? "Information Updated Successfully"
          : "Information Not Updated! Pease Try Again.";
      value.status = queryResultUpdate.rowsAffected > 0 ? 200 : 500;

      return res.status(value.status).json(value);
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

module.exports = router;
