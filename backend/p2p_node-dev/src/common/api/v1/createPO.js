const PDFDocument = require("pdfkit");
const fs = require("fs");
const moment = require("moment");
const path = require("path");
const numberToWords = require("number-to-words");
require("dotenv").config();

// Directory to save the PDF
const publicPoDir = path.resolve(__dirname, `../../../../public/upload/supplier/po/`);
const fontPath = path.resolve(__dirname, `../../../../public/arial/`);

let createInvoiceTable2 = async (rfqhd = {}, items = []) => {
  console.log(`Resolved directory path: ${publicPoDir}`);
  console.log(`Font directory path: ${fontPath}`);

  // Ensure the directory exists
  if (!fs.existsSync(publicPoDir)) {
    fs.mkdirSync(publicPoDir, { recursive: true });
  }

  // Read the Arial font files
  const fontBufferArial = fs.readFileSync(path.resolve(fontPath, 'ARIAL.TTF'));
  const fontBufferArialBold = fs.readFileSync(path.resolve(fontPath, 'ARIALBD.TTF'));

  // Create a new PDF document
  const doc = new PDFDocument({
    size: "A4",
    margin: { top: 72, bottom: 72, left: 54, right: 54 },
  });

  // Register the Arial fonts
  doc.registerFont("Arial", fontBufferArial);
  doc.registerFont("Arial-Bold", fontBufferArialBold);

  // Path to save the PDF
  const filePath = `${publicPoDir}/PO_${rfqhd.PO_NUMBER}.pdf`;
  doc.pipe(fs.createWriteStream(filePath));

  // Helper functions
  function needsNewPage(doc, currY, itemHeight, pageHeight, margin) {
    return currY + itemHeight > pageHeight - margin;
  }

  function addNewPage(doc, startY, headers, colWidths, headerBackgroundColor) {
    doc.addPage();
    addHeader(doc, rfqhd);
    let currY = startY;

    // Redraw the header on the new page
    doc
      .rect(startX, startY, colWidths.reduce((a, b) => a + b, 0), headerHeight)
      .fill(headerBackgroundColor);

    headers.forEach((header, i) => {
      const x = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
      const y = startY;
      const width = colWidths[i];
      const height = headerHeight;

      doc.lineWidth(0.005);
      doc.rect(x, y, width, height).stroke();

      doc
        .fontSize(8)
        .font("Arial-Bold")
        .fillColor("#252525")
        .text(header, x + padding, y + padding, {
          width: width - 2 * padding,
          align: "left",
        });
    });

    return startY + headerHeight;
  }

  // Define header function
function addHeader(doc, rfqhd) {
  doc
    .fontSize(13)
    .font("Arial-Bold")
    .text(`${rfqhd.LE_NAME}`, 54, 35);

  doc
    .fontSize(9)
    .font("Arial")
    .text(`${rfqhd.LE_ADDRESS}`, 54, 50);

  doc
    .lineWidth(0.1)
    .moveTo(54, 65)
    .lineTo(540, 65)
    .stroke();

  doc
    .fontSize(11)
    .font("Arial-Bold")
    .text("PURCHASE ORDER", { align: "center", underline: true }, 70);
}


  // Add header
  addHeader(doc, rfqhd);

  // Add supplier information
  doc.fontSize(8).font("Arial-Bold").text("Supplier: ", 54, 90);
  doc
    .fontSize(8)
    .font("Arial")
    .text(`${rfqhd.ORGANIZATION_NAME}\nPlot: ${rfqhd.SITE_ADDRESS}`, 100, 90);

  // Add supplier Ship To
  doc.fontSize(8).font("Arial-Bold").text("Ship To: ", 54, 120);
  doc
    .fontSize(7)
    .font("Arial")
    .text(`${rfqhd.SHIP_TO_LOCATION_NAME}`, 100, 120);

  // Add Bill To
  doc.fontSize(8).font("Arial-Bold").text("Bill To: ", 54, 140);
  doc
    .fontSize(7)
    .font("Arial")
    .text(`${rfqhd.BILL_TO_LOCATION_NAME}`, 100, 140);

  // Add PO Subject
  doc.fontSize(8).font("Arial-Bold").text("Sub: ", 54, 160);
  doc.fontSize(8).font("Arial-Bold").text(` ${rfqhd.RFQ_SUBJECT}`, 100, 160);

  // Add Item Details Header
  doc
    .fontSize(8)
    .font("Arial-Bold")
    .fillColor("#252525")
    .text("Item Details", 54, 260);
  doc.lineWidth(0.05).moveTo(54, 269).lineTo(100, 269).stroke();

  // Table1 Header (PO details)
  const rightMargin = 54;
  const leftMargin = 54;
  const pageWidth = 595.28; // A4 width in points
  const table1Width = 168.48;
  const start1X = pageWidth - table1Width - rightMargin;
  const start1Y = 90;
  const rowHeight = 18;
  const leftColWidth = 79.92;
  const rightColWidth = 88.56;

  const tableData1 = [
    ["Purchasing Org:", `${rfqhd.ORG_NAME}`],
    ["PO Ref:", `${rfqhd.PO_NUMBER}`],
    ["PO Date:", `${rfqhd.PO_DATE}`],
    ["PO Type:", `Final`],
    ["Revision:", `${rfqhd.REVISION}`],
    ["Revision Date:", `${rfqhd.REVISION_DATE}`],
    ["PO Created by:", `${rfqhd.PO_CREATED_BY}`],
    ["Buyer Phone#:", `${rfqhd.BUYER_PHONE_NUM}`],
    ["Printed on:", `${rfqhd.PRINTED_ON}`],
  ];

  tableData1.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellX = start1X + (colIndex === 0 ? 0 : leftColWidth);
      const cellY = start1Y + rowHeight * rowIndex;

      doc.lineWidth(0.1);
      doc
        .rect(
          cellX,
          cellY,
          colIndex === 0 ? leftColWidth : rightColWidth,
          rowHeight
        )
        .stroke();

      if (colIndex === 0) {
        doc
          .fontSize(8)
          .font("Arial-Bold")
          .fillColor("#252525")
          .text(cell, cellX + 2, cellY + 2, { align: "left" });
      } else {
        doc.text(cell, cellX + 2, cellY + 2, { align: "left" });
      }
    });
  });

  // Table2 Header (Item details)
  const startX = 54;
  const startY = start1Y + tableData1.length * rowHeight + 20;
  const tableWidth = 500;
  const headerHeight = 20.4;
  const padding = 2;
  const headerBackgroundColor = "#DFF5FF";

  const inchMeasurements = [0.33, 0.44, 1.56, 1.75, 0.69, 0.44, 0.69, 1];
  const totalInches = inchMeasurements.reduce((total, inch) => total + inch, 0);
  const ratios = inchMeasurements.map((inch) => inch / totalInches);
  const totalPoints = 500;
  const colWidths = ratios.map((ratio) => Math.round(ratio * totalPoints));

  // Draw background for column headers
  doc
    .rect(
      startX,
      startY,
      colWidths.reduce((a, b) => a + b, 0),
      headerHeight
    )
    .fill(headerBackgroundColor);

  const headers = [
    "SL",
    "Line \nNo.",
    "Items",
    "Description",
    "Quantity",
    "Unit \nPrice",
    "Amount",
    "Note to \nSupplier",
  ];

  headers.forEach((header, i) => {
    const x = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
    const y = startY;
    const width = colWidths[i];
    const height = headerHeight;

    doc.lineWidth(0.005);
    doc.rect(x, y, width, height).stroke();

    doc
      .fontSize(8)
      .font("Arial-Bold")
      .fillColor("#252525")
      .text(header, x + padding, y + padding, {
        width: width - 2 * padding,
        align: "left",
      });
  });

  let currY = startY + headerHeight;
  const pageHeight = doc.page.height;
  const margin = 50;

  // Calculate total amount
  const amount = items
    .reduce(
      (total, item) =>
        total + parseFloat(item.AWARD_QUANTITY * item.UNIT_PRICE),
      0
    )
    .toFixed(2);

  const amountForWord = amount;

  // Format the total amount
  const formattedAmount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  // Data rows
  items.forEach((item, index) => {
    const row = [
      `${index + 1}`,
      `${item.PR_LINE_NUM}`,
      { text: `${item.ITEM_DESCRIPTION}`, font: "Arial-Bold" },
      [
        { text: "Spec: ", font: "Arial-Bold" },
        { text: `${item.ITEM_SPECIFICATION || ""}\n\n`, font: "Arial" },
        { text: "Brand: ", font: "Arial-Bold" },
        { text: `${item.EXPECTED_BRAND_NAME || ""}\n`, font: "Arial" },
        { text: "Origin: ", font: "Arial-Bold" },
        { text: `${item.EXPECTED_ORIGIN || ""}\n`, font: "Arial" },
        { text: "Qty. Tolerance: ", font: "Arial-Bold" },
        { text: `${item.TOLERANCE || ""}\n`, font: "Arial" },
        { text: "PR Number: ", font: "Arial-Bold" },
        { text: `${item.PR_NUMBER || ""}\n`, font: "Arial" },
        { text: "PR Approved Date: ", font: "Arial-Bold" },
        { text: `${item.PR_APPROVED_DATE || ""}`, font: "Arial" },
      ],
      `${item.AWARD_QUANTITY} ${item.UNIT_MEAS_LOOKUP_CODE || ""}`,
      `${parseFloat(item.UNIT_PRICE).toFixed(2)}`,
      `${parseFloat(item.AWARD_QUANTITY * item.UNIT_PRICE).toFixed(2)}`,
      [
        { text: "Delivery Date: ", font: "Arial-Bold" },
        { text: `${item.NEED_BY_DATE || ""}\n\n`, font: "Arial" },
        { text: "Warranty: ", font: "Arial-Bold" },
        { text: `${item.WARRANTY_ASK_BY_BUYER || ""}`, font: "Arial" },
      ],
    ];

    const maxCellHeight = Math.max(
      ...row.map((cell, colIndex) => {
        if (typeof cell === "string") {
          return doc.heightOfString(cell, { width: colWidths[colIndex] });
        } else if (Array.isArray(cell)) {
          return cell.reduce(
            (height, textObj) =>
              height +
              doc.heightOfString(textObj.text, { width: colWidths[colIndex] }),
            0
          );
        } else {
          return doc.heightOfString(cell.text, { width: colWidths[colIndex] });
        }
      })
    );
    const rowHeight = maxCellHeight + 10;

    if (needsNewPage(doc, currY, rowHeight, pageHeight, margin)) {
      currY = addNewPage(doc, startY, headers, colWidths, headerBackgroundColor);
    }

    row.forEach((cell, colIndex) => {
      const x = startX + colWidths.slice(0, colIndex).reduce((a, b) => a + b, 0);
      const y = currY;
      const width = colWidths[colIndex];
      const height = rowHeight;

      doc.lineWidth(0.1);
      doc.rect(x, y, width, height).stroke();

      doc.fontSize(7);

      if (typeof cell === "string") {
        doc.font("Arial").text(cell, x + padding, y + padding, {
          width: width - 2 * padding,
          align: "left",
        });
      } else if (Array.isArray(cell)) {
        let textY = y + padding;

        for (let i = 0; i < cell.length; i += 2) {
          const label = cell[i];
          const value = cell[i + 1];

          doc.font("Arial-Bold").text(label.text, x + padding, textY, {
            width: width - 2 * padding,
            align: "left",
            continued: true,
          });

          doc.font("Arial").text(value.text.trim(), {
            width: width - 2 * padding,
            align: "left",
            continued: false,
          });

          const labelHeight = doc.heightOfString(label.text, {
            width: width - 2 * padding,
          });
          const valueHeight = doc.heightOfString(value.text, {
            width: width - 2 * padding,
          });
          textY += Math.max(labelHeight, valueHeight);
        }
      } else {
        doc.font(cell.font).text(cell.text, x + padding, y + padding, {
          width: width - 2 * padding,
          align: "left",
        });
      }
    });

    currY += rowHeight;
  });

  // Add total section
  const totalRowHeight = 20;
const totalLabelX = 150;
const totalValueX = totalLabelX + 200;
const sectionWidth = 500; // Width for Payment Terms and Freight Terms section
const colWidth = sectionWidth / 2; // Split evenly between two columns
const pageHeightLimit = doc.page.height - margin; // Calculate page height excluding margins
const inWordHeight = 30; // Approximate height for "In Word" section
const termsSectionHeight = 30; // Reduced height for "Payment Terms" and "Freight Terms"

// Helper function to capitalize words
function capitalizeWords(str) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

// Add Total Amount section
const totalRowY = currY + 10;
doc.lineWidth(0.1)
   .rect(totalLabelX, totalRowY, 200, totalRowHeight).stroke();
doc.fontSize(8).font("Arial-Bold").text("Total Amount", totalLabelX + 5, totalRowY + 5);

doc.rect(totalValueX, totalRowY, 150, totalRowHeight).stroke();
doc.fontSize(8).font("Arial-Bold").text(`${formattedAmount}`, totalValueX + 5, totalRowY + 5, { align: "center" });
doc.moveDown(2); // Add space after the Total Amount section

// Update current Y position
currY = totalRowY + totalRowHeight + 10;

// Check if we need to add a new page before adding the next sections
const totalHeightNeeded = inWordHeight + termsSectionHeight;
if (currY + totalHeightNeeded > pageHeightLimit) {
  doc.addPage();
  currY = margin; // Reset Y position for new page
}

// Add "In Word" section
doc.fontSize(7).font("Arial").text(
  `In Word: ${capitalizeWords(numberToWords.toWords(amountForWord))} ${rfqhd.CURRENCY_NAME} Only.`,
  leftMargin,
  currY,
  { align: "left" }
);
currY += inWordHeight; // Update the current Y position

// Add Payment Terms and Freight Terms section
const termsStartX = 54; // Left margin for the section

// Draw the solid line rectangle around the entire section
doc.lineWidth(0.5)
   .rect(termsStartX, currY, sectionWidth, termsSectionHeight)
   .stroke();

// Draw the vertical line between Payment Terms and Freight Terms
doc.moveTo(termsStartX + colWidth, currY)
   .lineTo(termsStartX + colWidth, currY + termsSectionHeight)
   .stroke();

// Add "Payment Terms" label and value, defaulting to empty string if undefined
const paymentTerm = rfqhd.PAYMENT_TERM || '';  // Use empty string if undefined
doc.fontSize(8).font("Arial-Bold").text("Payment Terms: ", termsStartX + 5, currY + 10, { continued: true });
doc.fontSize(7).font("Arial").text(paymentTerm, { continued: true });

// Add "Freight Terms" label and value, defaulting to empty string if undefined
const freightTerm = rfqhd.FREIGHT_TERM || '';  // Use empty string if undefined
doc.fontSize(8).font("Arial-Bold").text("Freight Terms: ", termsStartX + colWidth + 5, currY + 10, { continued: true });
doc.fontSize(7).font("Arial").text(freightTerm);


// Define the gap between Payment Terms and VAT Challan sections
const gapBetweenSections = 10; // Adjust as needed for the gap

// Calculate new starting Y position for VAT Challan after adding gap
currY += termsSectionHeight + gapBetweenSections; // Move the position down by termsSectionHeight and gap

// Define the height for the VAT Challan section
const vatChalanHeight = 40; // Adjust height as needed
const vatChalan = 54; // X position for VAT Challan label
const vatChalanValue = vatChalan + 122; // X position for VAT Challan value

// Calculate the total height needed for VAT Challan section
const vatChalanHeightNeeded = vatChalanHeight;

// Check if there's enough space on the current page; if not, add a new page
if (currY + vatChalanHeightNeeded > pageHeightLimit) {
  doc.addPage();
  currY = margin; // Reset Y position for the new page
}

// Draw VAT Challan Section
doc.lineWidth(0.5)
   .rect(vatChalan, currY, 122, vatChalanHeight) // Draw the rectangle for "Vat Challan Details"
   .stroke();

// Add the label for "Vat Challan Details"
doc.fontSize(8).font("Arial-Bold").text(
  `Vat Challan Details (if \n applicable)`, // Adjust text as needed
  vatChalan + 5,
  currY + 5, // Adjust Y position
  { align: "left" }
);

// Draw the rectangle for VAT Challan value
doc.rect(vatChalanValue, currY, 364, vatChalanHeight).stroke();

// Add the value for VAT Challan
doc.fontSize(8).font("Arial").text(`${rfqhd.LE_BIN}`, vatChalanValue + 5, currY + 5, {
  align: "left",
});

// Update currY for future content
currY += vatChalanHeight + 10; // Add some extra spacing for future elements

// Gap between Vat Challan Details and Terms & Conditions
const gapAfterVatChallan = 20; // 20-point gap

// Update Y position after Vat Challan Details
currY += gapAfterVatChallan;

// Check if there is enough space for Terms & Conditions; if not, add a new page
if (currY + 50 > pageHeightLimit) { // Assuming 50 points for the Terms section content height
  doc.addPage();
  currY = margin; // Reset Y position for the new page
}

// Draw "Terms & Conditions" heading
const termsX = leftMargin;
doc
  .fontSize(10)
  .font("Arial-Bold")
  .text("Terms & Conditions:", termsX, currY, {
    align: "left",
    underline: true,
  });

// Set content Y position with a gap of 15 points after the heading
const contentY = currY + 15;

// Add Terms & Conditions content
const termsContent = `${rfqhd.BUYER_GENERAL_TERMS}`;
doc.fontSize(7).font("Arial").text(termsContent, termsX, contentY, {
  align: "left",
  width: 500,
});

// Update Y position after Terms & Conditions for footer
currY = contentY + doc.heightOfString(termsContent, { width: 500 }) + 20;

// Check if there's enough space for the footer; if not, add a new page
if (currY + 90 > doc.page.height) { // Assuming 90 points for footer height
  doc.addPage();
  currY = doc.page.height - 90; // Set position near the bottom of the new page
} else {
  currY = doc.page.height - 90; // Position the footer near the bottom
}

// Footer
doc
  .fontSize(8)
  .font("Arial-Bold")
  .text(
    "**** This is a system generated document, does not require any signature ****",
    leftMargin,
    currY,
    { align: "left" }
  );


  // End of document
  doc.end();
};

module.exports = {createInvoiceTable2};
