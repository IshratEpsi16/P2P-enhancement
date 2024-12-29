const isEmpty = require("is-empty");
let cs_header_table_name = "XXP2P_CS_HEADER";
let rfq_lines_table_name = "XXP2P_RFQ_LINES_ALL";
let cs_lines_table_name = "XXP2P_CS_LINES_ALL";
let rfq_supp_quot_table_name = "XXP2P_RFQ_SUPPLIER_QUOTATION";
let history_table_name = "XXP2P_APPROVE_HISTORY";
let dbName = process.env.DATABASE_NAME;

let csHeaderUpdate = async (updateData, whereData) => {
  let updateClause = "";
  let whereClause = "";
  let updateParams = [];
  let whereParams = [];

  // Construct the SET clause based on the properties of updateData
  if (updateData != null && Object.keys(updateData).length > 0) {
    let updates = [];
    Object.keys(updateData).forEach((key) => {
      let value = updateData[key];
      if (
        typeof value === "string" &&
        value.match(/^\d{2}\/[a-zA-Z]{3}\/\d{4} \d{2}:\d{2}:\d{2}$/)
      ) {
        // If the value matches the date format, parse it into a Date object
        value = new Date(value);
        // Convert the parsed Date object to the desired string format
        value = `TO_DATE('${value
          .toISOString()
          .slice(0, 19)}', 'YYYY-MM-DD"T"HH24:MI:SS')`;
      } else {
        // If it's not a date, keep the original value
        value = `'${value}'`;
      }
      updates.push(`${key} = ${value}`);
      updateParams.push(value);
    });
    updateClause = "SET " + updates.join(", ");
  }

  // Construct the WHERE clause based on the properties of whereData
  if (whereData != null && Object.keys(whereData).length > 0) {
    let conditions = [];
    Object.keys(whereData).forEach((key) => {
      conditions.push(`${key} = ${whereData[key]}`); // Use NVL to handle null values
      whereParams.push(whereData[key]);
    });
    whereClause = "WHERE " + conditions.join(" AND ");
  }

  // Construct the update query string
  let query = `UPDATE ${dbName}.${cs_header_table_name} ${updateClause} ${whereClause}`;

  console.log(query);
  console.log("Update Params:", updateParams);
  console.log("Where Params:", whereParams);

  // Here, you would execute the update query with the updateParams and whereParams
  // For example:
  // await connection.execute(query, [...updateParams, ...whereParams]);

  // Return the query string for testing purposes
  return query;
};

//   let insertHistory = async (data = {}) => {
//     console.log(data);
//     let keys = Object.keys(data);

//     let query = `insert into ${dbName}.${history_table_name} (` + keys[0];
//     let valueString = " ( :1";

//     for (let i = 1; i < keys.length; i++) {
//       query += `, ` + keys[i];
//       valueString += `, :${i + 1}`;
//     }

//     query =
//     query +
//     `) VALUES ` +
//     valueString +
//     `)`;
//     //console.log(query);
//     return query;
//   };

let insertHistory = async (data = {}) => {
  let keys = Object.keys(data);

  let query = `insert into XXP2P.XXP2P_APPROVE_HISTORY (` + keys[0];
  let valueString = " ( :1";

  for (let i = 1; i < keys.length; i++) {
    query += `, ` + keys[i];
    valueString += `, :${i + 1}`;
  }

  query =
    query +
    `) VALUES ` +
    valueString +
    `) RETURNING HISTORY_ID INTO :${keys.length + 1}`;
  console.log(query);
  return query;
};

let poCreate = async (ID) => {
  let query = `
      DECLARE
          V_MESSAGE VARCHAR2(4000);
      BEGIN
          -- Call the procedure
          APPS.xxp2p_cs_to_po_pkg.autocreate_xxp2p_po (${ID}, V_MESSAGE); 
          
          -- Return the message to the calling environment
          :MESSAGE := V_MESSAGE;
      END;
    `;
  console.log("query", query);
  return query;
};

let poDetails = async (ID) => {
  // Construct the query string with join and bind variables
  let query = `
    
  SELECT 
  rh.RFQ_ID,
  rh.USER_ID,
  rh.ADDITIONAL_EMAIL,
  us.EMAIL_ADDRESS,
  bsc.ORGANIZATION_NAME,
  bsc.SUPPLIER_ADDRESS,
  rh.site_id,
  (select ADDRESS_LINE1 from xxp2p.xxp2p_supplier_site where id = rh.site_id) as SITE_ADDRESS,
  csln.PO_HEADER_ID,
  csln.PO_NUMBER
FROM 
  xxp2p.xxp2p_cs_lines_all csln
LEFT JOIN 
  xxp2p.xxp2p_rfq_supplier_invitation rh ON rh.PO_HEADER_ID = csln.PO_HEADER_ID
LEFT JOIN 
  xxp2p.xxp2p_user us ON us.USER_ID = rh.USER_ID
LEFT JOIN 
  xxp2p.xxp2p_supplier_bsc_info bsc ON bsc.USER_ID = rh.USER_ID 
WHERE 
  csln.CS_ID = ${ID}
GROUP BY
  rh.RFQ_ID,
  rh.USER_ID,
  rh.ADDITIONAL_EMAIL,
  us.EMAIL_ADDRESS,
  bsc.ORGANIZATION_NAME,
  bsc.SUPPLIER_ADDRESS,
  rh.site_id,
  csln.PO_HEADER_ID,
  csln.PO_NUMBER
    `;

  return query;
};




let rfqHeaderDetails = async (ID) => {
  // Construct the query string with join and bind variables
  let query = `
    WITH user_data AS (
  SELECT user_id, FULL_NAME, MOBILE_NUMBER
  FROM xxp2p.xxp2p_user
),
location_data AS (
  SELECT LOCATION_ID, LOCATION_CODE
  FROM hr_locations_v
  WHERE STYLE = 'BD_GLB'
),
payment_terms AS (
  SELECT TERM_ID, NAME
  FROM ap_terms_vl
  WHERE ENABLED_FLAG = 'Y'
),
currency_data AS (
  SELECT FC.CURRENCY_CODE, FCTL.NAME AS CURRENCY_NAME
  FROM FND_CURRENCIES FC
  JOIN FND_CURRENCIES_TL FCTL ON FC.CURRENCY_CODE = FCTL.CURRENCY_CODE
  WHERE FC.ENABLED_FLAG = 'Y'
    AND (FC.END_DATE_ACTIVE IS NULL OR TRUNC(FC.END_DATE_ACTIVE) > TRUNC(SYSDATE))
)
SELECT 
  rfqhd.RFQ_ID,
  rfqhd.RFQ_SUBJECT,
  rfqhd.RFQ_TITLE,
  rfqhd.org_id,
  HOU.NAME as ORG_NAME,
  rfqhd.BILL_TO_LOCATION_ID,
  bill_loc.LOCATION_CODE as BILL_TO_LOCATION_NAME,
  rfqhd.SHIP_TO_LOCATION_ID,
  ship_loc.LOCATION_CODE as SHIP_TO_LOCATION_NAME,
  u.FULL_NAME as PO_CREATED_BY,
  u.MOBILE_NUMBER as BUYER_PHONE_NUM,
  TO_CHAR(SYSDATE, 'DD-MON-YYYY') AS PO_DATE,
  TO_CHAR(SYSDATE, 'DD-MON-YYYY') AS PRINTED_ON,
  'FINAL' as PO_TYPE,
  '0' as REVISION,
  '' as REVISION_DATE,
  pt.NAME as PAYMENT_TERM,
  rfqhd.CURRENCY_CODE,
  cd.CURRENCY_NAME,
  XX_P2P_PKG.GET_LEGAL_ENTITY_FROM_ORG_ID(rfqhd.org_id) as LE_NAME,
  XX_P2P_PKG.GET_LEGAL_ENTITY_ADDRESS_FROM_ORG_ID(rfqhd.org_id) as LE_ADDRESS,
  XX_P2P_PKG.GET_LEGAL_ENTITY_BIN_FROM_ORG_ID(rfqhd.org_id) as LE_BIN,
  rfqhd.BUYER_GENERAL_TERMS
FROM 
  xxp2p.xxp2p_rfq_header rfqhd
LEFT JOIN HR_OPERATING_UNITS HOU ON HOU.ORGANIZATION_ID = rfqhd.org_id
LEFT JOIN location_data bill_loc ON bill_loc.LOCATION_ID = rfqhd.BILL_TO_LOCATION_ID
LEFT JOIN location_data ship_loc ON ship_loc.LOCATION_ID = rfqhd.SHIP_TO_LOCATION_ID
LEFT JOIN user_data u ON u.user_id = rfqhd.CREATED_BY
LEFT JOIN payment_terms pt ON pt.TERM_ID = rfqhd.PAYMENT_TERM_ID
LEFT JOIN currency_data cd ON cd.CURRENCY_CODE = rfqhd.CURRENCY_CODE
WHERE 
  rfqhd.rfq_id = ${ID}
    `;
    console.log(query);
  return query;
};

let rfqItemDetails = async (CS_ID,PO_HD_ID) => {
  // Construct the query string with join and bind variables
  let query = `
    SELECT 
csln.CS_LINE_ID,
csln.CS_ID,
csln.RFQ_ID,
csln.RFQ_LINE_ID,
csln.QUOT_LINE_ID,
csln.RECOMMENDED,
csln.RECOMMENDED_BY,
csln.AWARDED,
csln.AWARDED_BY,
csln.NOTE_FROM_BUYER,
csln.PO_NUMBER,
csln.PO_HEADER_ID,
csln.PO_LINE_ID,
csln.VENDOR_ID,
csln.ORG_ID,
csln.VENDOR_SITE_ID,
csln.USER_ID,
csln.AWARD_QUANTITY,
TO_CHAR(csln.PO_DATE, 'DD-MON-YYYY') AS PO_DATE,
squot.WARRANTY_BY_SUPPLIER,
squot.SUPPLIER_VAT_APPLICABLE,
squot.UNIT_PRICE,
squot.OFFERED_QUANTITY,
TO_CHAR(squot.PROMISE_DATE, 'DD-MON-YYYY') AS PROMISE_DATE,
squot.AVAILABLE_BRAND_NAME,
squot.AVAILABLE_ORIGIN,
squot.AVAILABLE_SPECS,
squot.TOLERANCE,
squot.TOTAL_LINE_AMOUNT,
squot.VAT_TYPE,
squot.VAT_AMOUNT,
rall.REQUISITION_HEADER_ID,
rall.REQUISITION_LINE_ID,
rall.PR_NUMBER,
rall.LINE_NUM,
rall.LINE_TYPE_ID,
rall.ITEM_CODE,
rall.ITEM_DESCRIPTION,
rall.ITEM_SPECIFICATION,
rall.WARRANTY_DETAILS,
rall.PACKING_TYPE,
rall.PROJECT_NAME,
rall.EXPECTED_QUANTITY,
rall.EXPECTED_BRAND_NAME,
rall.EXPECTED_ORIGIN,
rall.LCM_ENABLE_FLAG,
rall.UNIT_MEAS_LOOKUP_CODE,
TO_CHAR(rall.NEED_BY_DATE, 'DD-MON-YYYY') AS NEED_BY_DATE,
rall.ORG_ID,
rall.ATTRIBUTE_CATEGORY,
rall.PR_FROM_DFF,
rall.NOTE_TO_SUPPLIER,
rall.WARRANTY_ASK_BY_BUYER,
rall.BUYER_VAT_APPLICABLE,
rall.ITEM_ID,
rall.LINE_TYPE,
rall.PR_LINE_NUM,
TO_CHAR(rall.PR_APPROVED_DATE, 'DD-MON-YYYY') AS PR_APPROVED_DATE
FROM 
  xxp2p.xxp2p_cs_lines_all csln
left join xxp2p.xxp2p_rfq_supplier_quotation squot on squot.QUOT_LINE_ID = csln.QUOT_LINE_ID
left join xxp2p.xxp2p_rfq_lines_all rall on rall.RFQ_LINE_ID = csln.RFQ_LINE_ID
WHERE 1=1
and csln.AWARDED = 'Y'
and csln.LINE_STATUS = 'Y'
and  csln.CS_ID = ${CS_ID}
and csln.po_number = ${PO_HD_ID}
    `;

  return query;
};
module.exports = {
  csHeaderUpdate,
  insertHistory,
  poCreate,
  poDetails,
  rfqHeaderDetails,
  rfqItemDetails
};
