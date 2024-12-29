const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../../common/api/v1/common");
const rfqModel = require("../../../../../models/api/v1/pr2po/pr/rfqPreparation");
const quotationModel = require("../../../../../models/api/v1/pr2po/supplierQuotation/quotationPreparation");
//const getUserRolePermission = require("../authentication/authorization_role_permission");
const {
  userPermissionAuthorization,
  userRoleAuthorization,
} = require("../../../../../middleware/authorization");
const isEmpty = require("is-empty");
const fileUploaderCommonObject = require("../../../../../common/api/v1/fileUploader");

router.post(`/invited-suppliers`, verifyToken, async (req, res) => {
  try {
    let profile_pic1_file_path_name = `${process.env.backend_url}${process.env.profile_pic1_file_path_name}`;
    let profile_pic2_file_path_name = `${process.env.backend_url}${process.env.profile_pic2_file_path_name}`;
    let rfq_supplier_lines_file_path_name = `${process.env.backend_url}${process.env.rfq_supplier_lines_file_path_name}`;
    
    let finalData = {};
    let value = {
      message: `Invited Suppliers`,
      status: 200,
      profile_pic1_file_path: profile_pic1_file_path_name,
      profile_pic2_file_path: profile_pic2_file_path_name,
      quot_line_file_path: rfq_supplier_lines_file_path_name,
      total_suppliers: 0,
      supplier_list: [],
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

    // Rfq Invited Suppliers Total
    let queryResultTotal = await rfqModel.rfqInvitedSupplierListTotal(
      finalData
    );
    await commonObject.makeArrayObject(queryResultTotal);
    let rowObject = await commonObject.convertArrayToObject(
      queryResultTotal.queryResult.finalData
    );
    value.total_suppliers = rowObject.TOTAL;

    // Rfq Invited Suppliers
    let queryResultSupplierList = await rfqModel.rfqInvitedSupplierList(
      finalData,
      reqData.OFFSET,
      reqData.LIMIT
    );
    //console.log(queryResult);
    await commonObject.makeArrayObject(queryResultSupplierList);
    value.supplier_list = queryResultSupplierList.queryResult.finalData;

    return res.status(200).json(value);
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
      rfq_header_file: rfqHeaderFile,
      rfq_header_term_file: rfqHeaderTermFile,
      supplier_term_file: supplierTermFile,
      buyer_line_file: buyerLineFile,
      supplier_line_file: supplierLineFile,
      total_line_item: 0,
      line_items: [],
    };

    let reqData = {
      RFQ_ID: req.body.RFQ_ID,
      USER_ID: req.body.SUPPLIER_ID,
      OFFSET: req.body.OFFSET,
      LIMIT: req.body.LIMIT,
    };

    if (isEmpty(reqData.RFQ_ID)) {
      return res
        .status(400)
        .send({ message: "Enter RFQ ID", status: 400 });
    }
    if (isEmpty(reqData.USER_ID)) {
      return res
        .status(400)
        .send({ message: "Enter SUPPLIER ID", status: 400 });
    }

    Object.entries(reqData).forEach(([key, value]) => {
      if (value && key !== "OFFSET" && key !== "LIMIT" && key !== "USER_ID") {
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
    let queryResultLineItems = await rfqModel.rfqSubmittedDetails(
      finalData,
      reqData.USER_ID,
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
