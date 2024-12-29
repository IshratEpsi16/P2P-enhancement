const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const bankList = require("./../../../../models/api/v1/common/bankList");
//const getUserRolePermission = require("../authentication/authorization_role_permission");
//const PDFDocument = require('pdfkit');
const isEmpty = require("is-empty");
const fileUploaderCommonObject = require("../../../../common/api/v1/fileUploader");
const fs = require('fs');
var path = require("path");
//const createPDF = require("../../../../common/api/v1/createPO");


router.post(`/bank-list`, verifyToken, async (req, res) => {
  try {
    let value = {
      message: `Bank List`,
      status: 200,
      data: [],
    };
    let reqData = {
      COUNTRY_CODE: req.body.COUNTRY_CODE,
    };
    if (isEmpty(reqData.COUNTRY_CODE)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Please Give Country Short Code.",
      });
    }

    // Bank List
    let queryResult = await bankList.bankList(reqData.COUNTRY_CODE);
    await commonObject.makeArrayObject(queryResult);
    value.data = queryResult.queryResult.finalData;
    return res.status(200).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(`/branch-list`, verifyToken, async (req, res) => {
  try {
    let value = {
      message: `Branch List`,
      status: 200,
      data: [],
    };
    let reqData = {
      BANK_PARTY_ID: req.body.BANK_PARTY_ID,
    };
    if (isEmpty(reqData.BANK_PARTY_ID)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Please Give Branch Party ID.",
      });
    }

    // Bank List
    let queryResult = await bankList.branchList(reqData.BANK_PARTY_ID);
    await commonObject.makeArrayObject(queryResult);
    
    value.data = queryResult.queryResult.finalData;
    return res.status(200).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(`/bank-name-by-id`, verifyToken, async (req, res) => {
  try {
    let value = {
      message: `Bank Name`,
      status: 200,
      data: {},
    };
    let reqData = {
      COUNTRY_CODE: req.body.COUNTRY_CODE,
      BANK_PARTY_ID: req.body.BANK_PARTY_ID,
    };
    if (isEmpty(reqData.COUNTRY_CODE)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Please Give Country Short Code.",
      });
    }

    if (isEmpty(reqData.BANK_PARTY_ID)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Please Give Bank Party ID.",
      });
    }

    // Bank List
    let queryResult = await bankList.bankNameById(
      reqData.COUNTRY_CODE,
      reqData.BANK_PARTY_ID
    );
    await commonObject.makeArrayObject(queryResult);
    value.data = queryResult.queryResult.finalData;
    let rowObject = await commonObject.convertArrayToObject(queryResult.queryResult.finalData);
    value.data = rowObject
    return res.status(200).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(`/branch-name-by-id`, verifyToken, async (req, res) => {
  try {
    let value = {
      message: `Branch Name`,
      status: 200,
      data: {},
    };
    let reqData = {
      BANK_PARTY_ID: req.body.BANK_PARTY_ID,
      BRANCH_PARTY_ID: req.body.BRANCH_PARTY_ID,
    };
    if (isEmpty(reqData.BANK_PARTY_ID)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Please Give Branch Party ID.",
      });
    }

    // Bank List
    let queryResult = await bankList.branchNameById(
      reqData.BANK_PARTY_ID,
      reqData.BRANCH_PARTY_ID
    );
    await commonObject.makeArrayObject(queryResult);
    let rowObject = await commonObject.convertArrayToObject(queryResult.queryResult.finalData);
    value.data = rowObject;
    return res.status(200).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});



// Create the public/po directory if it doesn't exist
//const publicPoDir = path.join('D:','P2P_Node', 'public', 'po');
const publicPoDir = ("public/upload/supplier/po/");
if (!fs.existsSync(publicPoDir)) {
  fs.mkdirSync(publicPoDir, { recursive: true });
}


router.get('/download-invoice',async (req,res) => {

  // let pdf =await createPDF.createInvoiceTable2();
  // console.log(pdf);
  let today = new Date();
  // Generate a unique filename using a timestamp
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
  const filename = `${timestamp}.pdf`;
  const filePath = path.join(publicPoDir, filename);
  console.log(filePath);

  // Create a new PDF document
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  // Pipe the PDF into a writable stream and save it to the file system
  //doc.pipe(fs.createWriteStream(filePath));

  // Add the invoice title
  doc.fontSize(20).text('INVOICE', { align: 'center' });

  // Add the header with company information
  doc
    .fontSize(10)
    .text('Company Name', 50, 100)
    .text('Address Line 1', 50, 115)
    .text('Address Line 2', 50, 130)
    .text('City, State, ZIP Code', 50, 145)
    .text('Phone: (555) 555-5555', 50, 160)
    .text('Email: info@company.com', 50, 175);

  // Add the invoice details
  doc
    .fontSize(10)
    .text('Invoice Number: 12345', 400, 100)
    .text(`Invoice Date: ${today}`, 400, 115)
    .text('Due Date: 15/01/2022', 400, 130);

  // Add the billing information
  doc
    .fontSize(10)
    .text('Bill To:', 50, 220)
    .text('Customer Name', 50, 235)
    .text('Customer Address Line 1', 50, 250)
    .text('Customer Address Line 2', 50, 265)
    .text('City, State, ZIP Code', 50, 280);

  // Define the invoice table headers
  const invoiceTableTop = 330;
  doc.fontSize(10);
  generateTableRow(
    doc,
    invoiceTableTop,
    'Item',
    'Description',
    'Unit Cost',
    'Quantity',
    'Line Total'
  );
  generateHr(doc, invoiceTableTop + 20);

  // Add the table rows with sample data
  const items = [
    { item: 'Item 1', description: 'Description 1', unitCost: 50, quantity: 2, lineTotal: 100 },
    { item: 'Item 2', description: 'Description 2', unitCost: 30, quantity: 3, lineTotal: 90 },
  ];

  let position = invoiceTableTop + 30;
  items.forEach(item => {
    generateTableRow(
      doc,
      position,
      item.item,
      item.description,
      item.unitCost,
      item.quantity,
      item.lineTotal
    );
    position += 20;
  });

  // Add the total amount
  generateHr(doc, position + 20);
  doc
    .fontSize(10)
    .text('Total:', 400, position + 25)
    .text('$190.00', 450, position + 25);

  // Add footer
  doc
    .fontSize(10)
    .text('Thank you for your business!', { align: 'center', width: '100%', y: 750 });

  // Finalize the PDF and end the stream
  doc.end();

  // Send the download link to the client
  doc.on('end', () => {
    res.json(`/po/${filename}`);
  });
});

function generateTableRow(doc, y, item, description, unitCost, quantity, lineTotal) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: 'right' })
    .text(quantity, 370, y, { width: 90, align: 'right' })
    .text(lineTotal, 0, y, { align: 'right' });
}

function generateHr(doc, y) {
  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}


module.exports = router;
