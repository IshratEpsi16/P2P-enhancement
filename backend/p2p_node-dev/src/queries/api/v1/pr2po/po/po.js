const isEmpty = require("is-empty");

let byWhere = async (data) => {
  //console.log(data);
  let whereClause = "WHERE 1=1";
  let whereParams = {};
  let offsetLimit = "";

  // Construct the WHERE clause dynamically based on the provided data
  if (!isEmpty(data.PO_STATUS)) {
    whereClause += ` AND PO_STATUS = NVL(:PO_STATUS, PO_STATUS)`;
    whereParams.PO_STATUS = `${data.PO_STATUS}`;
  }
  if (!isEmpty(data.USER_ID)) {
    whereClause += ` AND USER_ID = NVL(:USER_ID, USER_ID)`;
    whereParams.USER_ID = `${data.USER_ID}`;
  }
  if (!isEmpty(data.PO_HEADER_ID)) {
    whereClause += ` AND PO_HEADER_ID LIKE NVL(:PO_HEADER_ID, PO_HEADER_ID)`;
    whereParams.PO_HEADER_ID = `%${data.PO_HEADER_ID}%`;
  }

  if (!isEmpty(data.FROM_DATE && data.TO_DATE)) {
    whereClause += ` AND TRUNC(SHIPMENT_DATE) BETWEEN NVL(TO_DATE(:FROM_DATE, 'YYYY-MM-DD'), SHIPMENT_DATE) 
                       AND NVL(TO_DATE(:TO_DATE, 'YYYY-MM-DD'), SHIPMENT_DATE)`;
    whereParams.FROM_DATE = data.FROM_DATE;
    whereParams.TO_DATE = data.TO_DATE;
  }
  offsetLimit += ` OFFSET :OFFSET ROWS 
      FETCH NEXT :LIMIT ROWS ONLY`;
  whereParams.OFFSET = data.OFFSET;
  whereParams.LIMIT = data.LIMIT;

  // Construct the select query string
  let query = `SELECT * 
    FROM xxp2p.xxp2p_rfq_supplier_invitation
    ${whereClause}`;
  query = query + "ORDER BY PO_DATE DESC";
  query = query + offsetLimit;
  console.log(query);

  // Return the query string and params for testing purposes
  return { query, whereParams };
};

let byWhereTotalCount = async (data) => {
  //console.log(data);
  let whereClause = "WHERE 1=1";
  let whereParams = {};
  let offsetLimit = "";

  // Construct the WHERE clause dynamically based on the provided data
  if (!isEmpty(data.PO_STATUS)) {
    whereClause += ` AND PO_STATUS = NVL(:PO_STATUS, PO_STATUS)`;
    whereParams.PO_STATUS = `${data.PO_STATUS}`;
  }
  if (!isEmpty(data.USER_ID)) {
    whereClause += ` AND USER_ID = NVL(:USER_ID, USER_ID)`;
    whereParams.USER_ID = `${data.USER_ID}`;
  }
  if (!isEmpty(data.PO_HEADER_ID)) {
    whereClause += ` AND PO_HEADER_ID LIKE NVL(:PO_HEADER_ID, PO_HEADER_ID)`;
    whereParams.PO_HEADER_ID = `%${data.PO_HEADER_ID}%`;
  }

  if (!isEmpty(data.FROM_DATE && data.TO_DATE)) {
    whereClause += ` AND TRUNC(SHIPMENT_DATE) BETWEEN NVL(TO_DATE(:FROM_DATE, 'YYYY-MM-DD'), SHIPMENT_DATE) 
                       AND NVL(TO_DATE(:TO_DATE, 'YYYY-MM-DD'), SHIPMENT_DATE)`;
    whereParams.FROM_DATE = data.FROM_DATE;
    whereParams.TO_DATE = data.TO_DATE;
  }

  // Construct the select query string
  let query = `SELECT COUNT(INVITATION_ID) AS TOTAL
    FROM xxp2p.xxp2p_rfq_supplier_invitation
    ${whereClause}`;
  query = query + offsetLimit;
  //console.log(query);

  // Return the query string and params for testing purposes
  return { query, whereParams };
};

let detailsByWhere = async (data) => {
  //console.log(data);
  let whereClause = "WHERE 1=1";
  let whereParams = {};
  let offsetLimit = "";

  // Construct the WHERE clause dynamically based on the provided data
  if (!isEmpty(data.SHIPMENT_PO_HEADER_ID)) {
    whereClause += ` AND SHIPMENT_PO_HEADER_ID = NVL(:SHIPMENT_PO_HEADER_ID, SHIPMENT_PO_HEADER_ID)`;
    whereParams.SHIPMENT_PO_HEADER_ID = `${data.SHIPMENT_PO_HEADER_ID}`;
  }
  if (!isEmpty(data.SHIPMENT_PO_NUMBER)) {
    whereClause += ` AND SHIPMENT_PO_NUMBER = NVL(:SHIPMENT_PO_NUMBER, SHIPMENT_PO_NUMBER)`;
    whereParams.SHIPMENT_PO_NUMBER = `${data.SHIPMENT_PO_NUMBER}`;
  }
  if (!isEmpty(data.SHIPMENT_ID)) {
    whereClause += ` AND SHIPMENT_ID = NVL(:SHIPMENT_ID, SHIPMENT_ID)`;
    whereParams.SHIPMENT_ID = `${data.SHIPMENT_ID}`;
  }

  offsetLimit += ` OFFSET :OFFSET ROWS 
      FETCH NEXT :LIMIT ROWS ONLY`;
  whereParams.OFFSET = data.OFFSET;
  whereParams.LIMIT = data.LIMIT;

  // Construct the select query string
  let query = `SELECT * 
    FROM xxp2p.XXP2P_SHIPMENT_TO_QUOTATION_VIEW
    ${whereClause}`;
  query = query + offsetLimit;
  console.log(query);

  // Return the query string and params for testing purposes
  return { query, whereParams };
};
let detailsByWhereTotalCount = async (data) => {
  //console.log(data);
  let whereClause = "WHERE 1=1";
  let whereParams = {};
  let offsetLimit = "";

  // Construct the WHERE clause dynamically based on the provided data
  if (!isEmpty(data.SHIPMENT_PO_HEADER_ID)) {
    whereClause += ` AND SHIPMENT_PO_HEADER_ID = NVL(:SHIPMENT_PO_HEADER_ID, SHIPMENT_PO_HEADER_ID)`;
    whereParams.SHIPMENT_PO_HEADER_ID = `${data.SHIPMENT_PO_HEADER_ID}`;
  }
  if (!isEmpty(data.SHIPMENT_PO_NUMBER)) {
    whereClause += ` AND SHIPMENT_PO_NUMBER = NVL(:SHIPMENT_PO_NUMBER, SHIPMENT_PO_NUMBER)`;
    whereParams.SHIPMENT_PO_NUMBER = `${data.SHIPMENT_PO_NUMBER}`;
  }
  if (!isEmpty(data.SHIPMENT_ID)) {
    whereClause += ` AND SHIPMENT_ID = NVL(:SHIPMENT_ID, SHIPMENT_ID)`;
    whereParams.SHIPMENT_ID = `${data.SHIPMENT_ID}`;
  }

  // Construct the select query string
  let query = `SELECT COUNT(*) AS TOTAL
    FROM xxp2p.XXP2P_SHIPMENT_TO_QUOTATION_VIEW
    ${whereClause}`;
  query = query + offsetLimit;
  console.log(query);

  // Return the query string and params for testing purposes
  return { query, whereParams };
};

let itemDetailsByWhere = async (data) => {
  //console.log(data);
  let whereClause = "WHERE 1=1";
  let whereParams = {};
  let offsetLimit = "";

  // Construct the WHERE clause dynamically based on the provided data
  if (!isEmpty(data.PO_HEADER_ID)) {
    whereClause += ` AND PO_HEADER_ID = NVL(:PO_HEADER_ID, PO_HEADER_ID)`;
    whereParams.PO_HEADER_ID = `${data.PO_HEADER_ID}`;
  }
  if (!isEmpty(data.PO_NUMBER)) {
    whereClause += ` AND PO_NUMBER = NVL(:PO_NUMBER, PO_NUMBER)`;
    whereParams.PO_NUMBER = `${data.PO_NUMBER}`;
  }
  if (!isEmpty(data.SHIPMENT_ID)) {
    whereClause += ` AND SHIPMENT_ID = NVL(:SHIPMENT_ID, SHIPMENT_ID)`;
    whereParams.SHIPMENT_ID = `${data.SHIPMENT_ID}`;
  }

  offsetLimit += ` OFFSET :OFFSET ROWS 
      FETCH NEXT :LIMIT ROWS ONLY`;
  whereParams.OFFSET = data.OFFSET;
  whereParams.LIMIT = data.LIMIT;

  // Construct the select query string
  let query = `SELECT * 
    FROM XXP2P.XXP2P_PO_ITEM_DETAILS_VIEW
    ${whereClause}`;
  query = query + offsetLimit;
  console.log(query);

  // Return the query string and params for testing purposes
  return { query, whereParams };
};
let itemDetailsByWhereTotalCount = async (data) => {
  //console.log(data);
  let whereClause = "WHERE 1=1";
  let whereParams = {};
  let offsetLimit = "";

  // Construct the WHERE clause dynamically based on the provided data
  if (!isEmpty(data.PO_HEADER_ID)) {
    whereClause += ` AND PO_HEADER_ID = NVL(:PO_HEADER_ID, PO_HEADER_ID)`;
    whereParams.PO_HEADER_ID = `${data.PO_HEADER_ID}`;
  }
  if (!isEmpty(data.PO_NUMBER)) {
    whereClause += ` AND PO_NUMBER = NVL(:PO_NUMBER, PO_NUMBER)`;
    whereParams.PO_NUMBER = `${data.PO_NUMBER}`;
  }
  if (!isEmpty(data.SHIPMENT_ID)) {
    whereClause += ` AND SHIPMENT_ID = NVL(:SHIPMENT_ID, SHIPMENT_ID)`;
    whereParams.SHIPMENT_ID = `${data.SHIPMENT_ID}`;
  }

  // Construct the select query string
  let query = `SELECT COUNT(*) AS TOTAL
    FROM XXP2P.XXP2P_PO_ITEM_DETAILS_VIEW
    ${whereClause}`;
  query = query + offsetLimit;
  console.log(query);

  // Return the query string and params for testing purposes
  return { query, whereParams };
};

let poUpdate = async (updateData, whereData) => {
  let updateClause = "";
  let whereClause = "";
  let updateParams = [];
  let whereParams = [];

  // Construct the SET clause based on the properties of updateData
  if (updateData != null && Object.keys(updateData).length > 0) {
    let updates = [];
    Object.keys(updateData).forEach((key) => {
      let value = updateData[key];
      if (value instanceof Date) {
        // Adjust the date by subtracting 6 hours
        value.setHours(value.getHours() - 6);
        // If the value is a Date object, format it as needed
        value = `TO_DATE('${value
          .toISOString()
          .slice(0, 19)}', 'YYYY-MM-DD"T"HH24:MI:SS')`;
      } else if (
        typeof value === "string" &&
        value.match(/^\d{2}\/[a-zA-Z]{3}\/\d{2} \d{2}:\d{2}:\d{2}$/)
      ) {
        // If the value matches the date format "25/MAR/24 10:25:21", parse it into a Date object and then format it
        value = new Date(value);
        value = `TO_DATE('${value
          .toISOString()
          .slice(0, 19)}', 'YYYY-MM-DD"T"HH24:MI:SS')`;
      } else {
        // If it's not a date or doesn't match the format, keep the original value
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
  let query = `UPDATE xxp2p.xxp2p_rfq_supplier_invitation ${updateClause} ${whereClause}`;

  console.log(query);
  console.log("Update Params:", updateParams);
  console.log("Where Params:", whereParams);

  // Return the query string for testing purposes
  return query;
};

let totalPOAmount = async (PO_HEADER_ID) => {
  let query = `SELECT 
    SUM(rsquot.OFFERED_QUANTITY * rsquot.UNIT_PRICE) AS TOTAL_VALUE
FROM 
    xxp2p.xxp2p_cs_lines_all csall
LEFT JOIN 
    xxp2p.xxp2p_rfq_supplier_quotation rsquot 
    ON rsquot.QUOT_LINE_ID = csall.QUOT_LINE_ID
WHERE 
    csall.AWARDED = 'Y'
    AND csall.PO_HEADER_ID = ${PO_HEADER_ID}
GROUP BY 
    csall.PO_HEADER_ID`;
  return query;
};

let supplierDetails = async (USER_ID,BUYER_ID) => {
  let query = 
  `
  WITH user_data AS (
    SELECT 
        user_id,
        full_name,
        mobile_number,
        supplier_id,
        VENDOR_ID
    FROM 
        xxp2p.xxp2p_user
    WHERE 
        user_id IN (${BUYER_ID}, ${USER_ID})
),
supplier_info AS (
    SELECT 
        user_id,
        ORGANIZATION_NAME
    FROM 
        xxp2p.xxp2p_supplier_bsc_info
    WHERE 
        user_id = ${USER_ID}
)
SELECT 
    u1.full_name AS buyer_name,
    u1.mobile_number AS buyer_mobile_number,
    u2.supplier_id,
    u2.VENDOR_ID,
    si.ORGANIZATION_NAME AS supplier_organization_name
FROM 
    user_data u1
CROSS JOIN 
    user_data u2
LEFT JOIN
    supplier_info si ON u2.user_id = si.user_id
WHERE 
    u1.user_id = ${BUYER_ID}
    AND u2.user_id = ${USER_ID}
  `;

  return query;
};

let poStatusUpdate = async (updateData, whereData) => {
  let updateClause = "";
  let whereClause = "";
  let updateParams = [];
  let whereParams = [];

  // Construct the SET clause based on the properties of updateData
  if (updateData != null && Object.keys(updateData).length > 0) {
    let updates = [];
    Object.keys(updateData).forEach((key) => {
      let value = updateData[key];
      if (value instanceof Date) {
        // Adjust the date by subtracting 6 hours
        value.setHours(value.getHours() - 6);
        // If the value is a Date object, format it as needed
        value = `TO_DATE('${value
          .toISOString()
          .slice(0, 19)}', 'YYYY-MM-DD"T"HH24:MI:SS')`;
      } else if (
        typeof value === "string" &&
        value.match(/^\d{2}\/[a-zA-Z]{3}\/\d{2} \d{2}:\d{2}:\d{2}$/)
      ) {
        // If the value matches the date format "25/MAR/24 10:25:21", parse it into a Date object and then format it
        value = new Date(value);
        value = `TO_DATE('${value
          .toISOString()
          .slice(0, 19)}', 'YYYY-MM-DD"T"HH24:MI:SS')`;
      } else {
        // If it's not a date or doesn't match the format, keep the original value
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
  let query = `UPDATE xxp2p.xxp2p_rfq_supplier_invitation ${updateClause} ${whereClause}`;

  console.log(query);
  console.log("Update Params:", updateParams);
  console.log("Where Params:", whereParams);

  // Return the query string for testing purposes
  return query;
};

module.exports = {
  byWhere,
  byWhereTotalCount,
  poUpdate,
  detailsByWhereTotalCount,
  detailsByWhere,
  itemDetailsByWhere,
  itemDetailsByWhereTotalCount,
  totalPOAmount,
  poStatusUpdate,
  supplierDetails
};
