const isEmpty = require("is-empty");
let invoice_header_table_name = "XXP2P_INVOICE_HEADER";
let invoice_lines_table_name = "XXP2P_INVOICE_LINES_ALL";
let cs_line_table_name = "XXP2P_CS_LINES_ALL";
let dbName = process.env.DATABASE_NAME;
const commonObject = require("../../../../common/api/v1/common");

let addNewInvHeader = async (data = {}) => {
  let keys = Object.keys(data);

  let query = `insert into ${dbName}.${invoice_header_table_name} (` + keys[0];
  let valueString = " ( :1";

  for (let i = 1; i < keys.length; i++) {
    query += `, ` + keys[i];
    valueString += `, :${i + 1}`;
  }

  query =
    query +
    `) VALUES ` +
    valueString +
    `) RETURNING INV_ID INTO :${keys.length + 1}`;
  console.log(query);
  return query;
};
let addNewInvLines = async (data = {}) => {
  let keys = Object.keys(data);

  let query = `insert into ${dbName}.${invoice_lines_table_name} (` + keys[0];
  let valueString = " ( :1";

  for (let i = 1; i < keys.length; i++) {
    query += `, ` + keys[i];
    valueString += `, :${i + 1}`;
  }

  query =
    query +
    `) VALUES ` +
    valueString +
    `) RETURNING ID INTO :${keys.length + 1}`;
  console.log(query);
  return query;
};
function formatDate(inputDate) {
  // Convert inputDate to a Date object
  const date = new Date(inputDate);

  // Months mapping
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

  // Extract components
  const day = date.getUTCDate();
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");

  // Formatted string
  const formattedDate = `TO_DATE('${day}/${month}/${year} ${hours}:${minutes}:${seconds}', 'DD/MON/YYYY HH24:MI:SS')`;
  console.log(formattedDate);
  return formattedDate;
}
let updateData = async (updateData, whereData) => {
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
        // If the value matches the date format, parse it into a Date object
        //value = new Date(value);
        // Convert the parsed Date object to the desired string format
        value = formatDate(value);
        console.log(value);
        value = value;
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
  let query = `UPDATE ${dbName}.${invoice_header_table_name} ${updateClause} ${whereClause}`;

  console.log(query);
  //console.log("Update Params:", updateParams);
  //console.log("Where Params:", whereParams);

  // Here, you would execute the update query with the updateParams and whereParams
  // For example:
  // await connection.execute(query, [...updateParams, ...whereParams]);

  // Return the query string for testing purposes
  return query;
};

let updateDataLines = async (updateData, whereData) => {
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
        // If the value matches the date format, parse it into a Date object
        //value = new Date(value);
        // Convert the parsed Date object to the desired string format
        value = formatDate(value);
        console.log(value);
        value = value;
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
  let query = `UPDATE ${dbName}.${invoice_lines_table_name} ${updateClause} ${whereClause}`;

  console.log(query);
  //console.log("Update Params:", updateParams);
  //console.log("Where Params:", whereParams);

  // Here, you would execute the update query with the updateParams and whereParams
  // For example:
  // await connection.execute(query, [...updateParams, ...whereParams]);

  // Return the query string for testing purposes
  return query;
};

let byWhere2 = async (whereData) => {
  let whereClause = "";
  let whereParams = {};

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
  let query = `SELECT * from  ${dbName}.${invoice_header_table_name} ${whereClause}`;

  console.log(query);
  //console.log("Update Params:", updateParams);
  //console.log("Where Params:", whereParams);

  // Here, you would execute the update query with the updateParams and whereParams
  // For example:
  // await connection.execute(query, [...updateParams, ...whereParams]);

  // Return the query string for testing purposes
  return query;
};

const userPaymentMethod = async (USER_ID) => {
  let query = `SELECT PAYMENT_METHOD_CODE FROM XXP2P.XXP2P_USER WHERE USER_ID = ${USER_ID}`;
  return query;
};
const paymentTerm = async (id) => {
  let query = `select rh.PAYMENT_TERM_ID,tr.NAME from xxp2p.xxp2p_rfq_header rh 
left join ap_terms_vl tr ON tr.TERM_ID = rh.PAYMENT_TERM_ID
where RFQ_ID = ${id}`;
  return query;
};

const vendorSiteID = async (ORG_ID, SITE_ID) => {
  let query = `select VENDOR_SITE_ID from 
  XXP2P.XXP2P_SUPPLIER_SITES_OU where SITE_ID = ${SITE_ID}
  and ORGANIZATION_ID = ${ORG_ID}`;
  return query;
};

const invoiceNumberCheck = async (USER_ID, INVOICE_NUM) => {
  let query = `select INVOICE_NUM from xxp2p.xxp2p_invoice_header where user_id = ${USER_ID} AND INVOICE_NUM = ${INVOICE_NUM}`;
  return query;
};

const byWhere = async (data) => {
  let whereClause = "WHERE 1=1";
  let whereParams = {};
  let offsetLimit = "";
  let orderByClause = "";

  // Function to check if a value is empty
  const isEmpty = (value) => {
    return (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim().length === 0) ||
      (typeof value === "object" && Object.keys(value).length === 0)
    );
  };

  // Add non-empty data to whereParams, except FROM_DATE and TO_DATE
  Object.entries(data).forEach(([key, value]) => {
    if (
      !isEmpty(value) &&
      key !== "FROM_DATE" &&
      key !== "TO_DATE" &&
      key !== "OFFSET" &&
      key !== "LIMIT" &&
      key !== "ORDER_BY"
    ) {
      whereClause += ` AND ${key} = :${key}`;
      whereParams[key] = value;
    }
  });
  if (!isEmpty(data.USER_ID)) {
    whereClause += ` AND USER_ID = NVL(:USER_ID, USER_ID)`;
    whereParams.USER_ID = `${data.USER_ID}`;
  }
  if (!isEmpty(data.INVOICE_STATUS)) {
    whereClause += ` AND INVOICE_STATUS = NVL(:INVOICE_STATUS, INVOICE_STATUS)`;
    whereParams.INVOICE_STATUS = `${data.INVOICE_STATUS}`;
  }
  if (!isEmpty(data.APPROVAL_STATUS)) {
    whereClause += ` AND APPROVAL_STATUS = NVL(:APPROVAL_STATUS, APPROVAL_STATUS)`;
    whereParams.APPROVAL_STATUS = `${data.APPROVAL_STATUS}`;
  }
  if (!isEmpty(data.BUYER_APPROVAL_STATUS)) {
    whereClause += ` AND BUYER_APPROVAL_STATUS = NVL(:BUYER_APPROVAL_STATUS, BUYER_APPROVAL_STATUS)`;
    whereParams.BUYER_APPROVAL_STATUS = `${data.BUYER_APPROVAL_STATUS}`;
  }
  if (!isEmpty(data.BUYER_USER_ID)) {
    whereClause += ` AND BUYER_USER_ID = NVL(:BUYER_USER_ID, BUYER_USER_ID)`;
    whereParams.BUYER_USER_ID = `${data.BUYER_USER_ID}`;
  }
  if (!isEmpty(data.INVOICE_TYPE)) {
    whereClause += ` AND INVOICE_TYPE = NVL(:INVOICE_TYPE, INVOICE_TYPE)`;
    whereParams.INVOICE_TYPE = `${data.INVOICE_TYPE}`;
  }
  if (!isEmpty(data.STATUS)) {
    whereClause += ` AND STATUS = NVL(:STATUS, STATUS)`;
    whereParams.STATUS = `${data.STATUS}`;
  }

  // Add date range condition if both FROM_DATE and TO_DATE are provided
  if (!isEmpty(data.FROM_DATE) && !isEmpty(data.TO_DATE)) {
    whereClause += ` AND TRUNC(INVOICE_DATE) BETWEEN NVL(TO_DATE(:FROM_DATE, 'YYYY-MM-DD'), INVOICE_DATE) 
                     AND NVL(TO_DATE(:TO_DATE, 'YYYY-MM-DD'), INVOICE_DATE)`;
    whereParams.FROM_DATE = data.FROM_DATE;
    whereParams.TO_DATE = data.TO_DATE;
  }

  // Add ORDER BY clause if provided
  if (!isEmpty(data.ORDER_BY)) {
    orderByClause = ` ORDER BY INV_ID ${data.ORDER_BY}`;
  }

  // Add OFFSET and LIMIT for pagination
  if (!isEmpty(data.OFFSET) && !isEmpty(data.LIMIT)) {
    offsetLimit = ` OFFSET :OFFSET ROWS FETCH NEXT :LIMIT ROWS ONLY`;
    whereParams.OFFSET = data.OFFSET;
    whereParams.LIMIT = data.LIMIT;
  }

  // Construct the select query string
  let query = `SELECT * 
  FROM ${dbName}.XXP2P_INVOICE_DETAILS_VIEW
  ${whereClause}`;
  query += orderByClause + offsetLimit;
  console.log(query);

  // Return the query string and params for testing purposes
  return { query, whereParams };
};

const invoiceDetails = async (id) => {
  let query = `select * from xxp2p.XXP2P_INVOICE_LINES_ALL 
  where INV_ID = ${id} order by ID`;
  return query;

  /*
  let whereClause = "WHERE 1=1";
  let whereParams = {};
  let offsetLimit = "";
  let orderByClause = "";

  // Function to check if a value is empty
  const isEmpty = (value) => {
    return (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim().length === 0) ||
      (typeof value === "object" && Object.keys(value).length === 0)
    );
  };

  // Add non-empty data to whereParams, except FROM_DATE and TO_DATE
  Object.entries(data).forEach(([key, value]) => {
    if (
      !isEmpty(value) &&
      key !== "FROM_DATE" &&
      key !== "TO_DATE" &&
      key !== "OFFSET" &&
      key !== "LIMIT" &&
      key !== "ORDER_BY"
    ) {
      whereClause += ` AND ${key} = :${key}`;
      whereParams[key] = value;
    }
  });

  // Add date range condition if both FROM_DATE and TO_DATE are provided
  if (!isEmpty(data.FROM_DATE) && !isEmpty(data.TO_DATE)) {
    whereClause += ` AND TRUNC(INVOICE_DATE) BETWEEN NVL(TO_DATE(:FROM_DATE, 'YYYY-MM-DD'), INVOICE_DATE) 
                     AND NVL(TO_DATE(:TO_DATE, 'YYYY-MM-DD'), INVOICE_DATE)`;
    whereParams.FROM_DATE = data.FROM_DATE;
    whereParams.TO_DATE = data.TO_DATE;
  }
  

  // Add ORDER BY clause if provided
  if (!isEmpty(data.ORDER_BY)) {
    orderByClause = ` ORDER BY CREATION_DATE ${data.ORDER_BY}`;
  }

  // Add OFFSET and LIMIT for pagination
  if (!isEmpty(data.OFFSET) && !isEmpty(data.LIMIT)) {
    offsetLimit = ` OFFSET :OFFSET ROWS FETCH NEXT :LIMIT ROWS ONLY`;
    whereParams.OFFSET = data.OFFSET;
    whereParams.LIMIT = data.LIMIT;
  }

  // Construct the select query string
  let query = `SELECT * 
  FROM ${dbName}.${invoice_lines_table_name} 
  ${whereClause}`;
  query += orderByClause + offsetLimit;
  console.log(query);

  // Return the query string and params for testing purposes
  return { query, whereParams };*/
};
const byWhereTotalCount = async (data) => {
  let whereClause = "WHERE 1=1";
  let whereParams = {};
  let offsetLimit = "";
  let orderByClause = "";

  // Function to check if a value is empty
  const isEmpty = (value) => {
    return (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim().length === 0) ||
      (typeof value === "object" && Object.keys(value).length === 0)
    );
  };

  // Add non-empty data to whereParams, except FROM_DATE and TO_DATE
  Object.entries(data).forEach(([key, value]) => {
    if (
      !isEmpty(value) &&
      key !== "FROM_DATE" &&
      key !== "TO_DATE" &&
      key !== "OFFSET" &&
      key !== "LIMIT" &&
      key !== "ORDER_BY"
    ) {
      whereClause += ` AND ${key} = :${key}`;
      whereParams[key] = value;
    }
  });

  if (!isEmpty(data.USER_ID)) {
    whereClause += ` AND USER_ID = NVL(:USER_ID, USER_ID)`;
    whereParams.USER_ID = `${data.USER_ID}`;
  }
  if (!isEmpty(data.INVOICE_STATUS)) {
    whereClause += ` AND INVOICE_STATUS = NVL(:INVOICE_STATUS, INVOICE_STATUS)`;
    whereParams.INVOICE_STATUS = `${data.INVOICE_STATUS}`;
  }
  if (!isEmpty(data.APPROVAL_STATUS)) {
    whereClause += ` AND APPROVAL_STATUS = NVL(:APPROVAL_STATUS, APPROVAL_STATUS)`;
    whereParams.APPROVAL_STATUS = `${data.APPROVAL_STATUS}`;
  }
  if (!isEmpty(data.BUYER_APPROVAL_STATUS)) {
    whereClause += ` AND BUYER_APPROVAL_STATUS = NVL(:BUYER_APPROVAL_STATUS, BUYER_APPROVAL_STATUS)`;
    whereParams.BUYER_APPROVAL_STATUS = `${data.BUYER_APPROVAL_STATUS}`;
  }
  if (!isEmpty(data.BUYER_USER_ID)) {
    whereClause += ` AND BUYER_USER_ID = NVL(:BUYER_USER_ID, BUYER_USER_ID)`;
    whereParams.BUYER_USER_ID = `${data.BUYER_USER_ID}`;
  }
  if (!isEmpty(data.INVOICE_TYPE)) {
    whereClause += ` AND INVOICE_TYPE = NVL(:INVOICE_TYPE, INVOICE_TYPE)`;
    whereParams.INVOICE_TYPE = `${data.INVOICE_TYPE}`;
  }
  if (!isEmpty(data.STATUS)) {
    whereClause += ` AND STATUS = NVL(:STATUS, STATUS)`;
    whereParams.STATUS = `${data.STATUS}`;
  }

  // Add date range condition if both FROM_DATE and TO_DATE are provided
  if (!isEmpty(data.FROM_DATE) && !isEmpty(data.TO_DATE)) {
    whereClause += ` AND TRUNC(INVOICE_DATE) BETWEEN NVL(TO_DATE(:FROM_DATE, 'YYYY-MM-DD'), INVOICE_DATE) 
                     AND NVL(TO_DATE(:TO_DATE, 'YYYY-MM-DD'), INVOICE_DATE)`;
    whereParams.FROM_DATE = data.FROM_DATE;
    whereParams.TO_DATE = data.TO_DATE;
  }

  // Construct the select query string
  let query = `SELECT COUNT(INV_ID) AS TOTAL
  FROM ${dbName}.XXP2P_INVOICE_DETAILS_VIEW
  ${whereClause}`;
  console.log(query);

  // Return the query string and params for testing purposes
  return { query, whereParams };
};


let detailsByWhere = async (data) => {
  console.log(data);
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
  if (!isEmpty(data.INVOICE_ID)) {
    whereClause += ` AND INVOICE_ID = NVL(:INVOICE_ID, INVOICE_ID)`;
    whereParams.INVOICE_ID = `${data.INVOICE_ID}`;
  }

  offsetLimit += ` OFFSET :OFFSET ROWS 
      FETCH NEXT :LIMIT ROWS ONLY`;
  whereParams.OFFSET = data.OFFSET;
  whereParams.LIMIT = data.LIMIT;

  // Construct the select query string
  let query = `SELECT * 
    FROM xxp2p.XXP2P_INVOICE_ITEM_DETAILS_VIEW
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
  if (!isEmpty(data.INVOICE_ID)) {
    whereClause += ` AND INVOICE_ID = NVL(:INVOICE_ID, INVOICE_ID)`;
    whereParams.INVOICE_ID = `${data.INVOICE_ID}`;
  }

  // Construct the select query string
  let query = `SELECT COUNT(*) AS TOTAL
    FROM xxp2p.XXP2P_INVOICE_ITEM_DETAILS_VIEW
    ${whereClause}`;
  query = query + offsetLimit;
  console.log(query);

  // Return the query string and params for testing purposes
  return { query, whereParams };
};

let getDataByWhereCondition = async (
  data = {},
  orderBy = {},
  limit,
  offset,
  columnList = []
) => {
  let keys = Object.keys(data);
  let columns = " * ";
  let flag = 2;

  try {
    if (Array.isArray(columnList) && !isEmpty(columnList)) {
      columns = columnList.join(",");
    }
  } catch (error) {
    columns = " * ";
  }

  let query = `Select ${columns} from ${dbName}.${invoice_header_table_name} `;

  if (keys.length > 0) {
    if (Array.isArray(data[keys[0]])) {
      query += ` where ${keys[0]} BETWEEN :1 and :2`;
      flag = 3;
    } else if (
      typeof data[keys[0]] === "object" &&
      !Array.isArray(data[keys[0]]) &&
      data[keys[0]] !== null
    ) {
      let key2 = Object.keys(data[keys[0]]);

      for (let indexKey = 0; indexKey < key2.length; indexKey++) {
        let tempSubKeyValue = data[keys[0]][key2[indexKey]];
        if (
          key2[indexKey].toUpperCase() === "OR" &&
          Array.isArray(tempSubKeyValue)
        ) {
          query += ` where ( ${keys[0]} = :1`;
          for (
            let indexValue = 1;
            indexValue < tempSubKeyValue.length;
            indexValue++
          ) {
            query += ` or ` + keys[0] + ` = :1`;
          }
          query += ` ) `;
        } else if (key2[indexKey].toUpperCase() === "OR") {
          query +=
            ` where ${key2[indexKey].toLowerCase()} ` + keys[0] + ` = :1`;
        } else if (key2[indexKey].toUpperCase() === "LIKE") {
          query += ` where ${keys[0]} like :1`;
        } else if (["IN", "NOT IN"].includes(key2[indexKey].toUpperCase())) {
          query += ` where ${keys[0]}  ${key2[indexKey].toUpperCase()} ( :1) `;
        } else if (["IN QUERY"].includes(key2[indexKey].toUpperCase())) {
          query += ` where  ${keys[0]}  IN ( ${
            data[keys[0]][key2[indexKey]]
          } ) `;
        } else if (["NOT IN QUERY"].includes(key2[indexKey].toUpperCase())) {
          query += ` where  ${keys[0]}  NOT IN ( ${
            data[keys[0]][key2[indexKey]]
          } ) `;
        } else if ("GTE" == key2[indexKey].toUpperCase()) {
          query += ` where  ` + keys[0] + ` >= :1`;
        } else if ("GT" == key2[indexKey].toUpperCase()) {
          query += ` where ` + keys[0] + ` > :1`;
        } else if ("LTE" == key2[indexKey].toUpperCase()) {
          query += ` where ` + keys[0] + ` <= :1`;
        } else if ("LT" == key2[indexKey].toUpperCase()) {
          query += ` where ` + keys[0] + ` < :1`;
        } else if ("NOT EQ" == key2[indexKey].toUpperCase()) {
          query += ` where ` + keys[0] + ` != :1`;
        }
      }
    } else {
      query += ` where ${keys[0]} = :1`;
    }

    for (let i = 1; i < keys.length; i++, flag++) {
      if (Array.isArray(data[keys[i]])) {
        query += ` and ` + keys[i] + `  BETWEEN  :${flag} and :${flag}`;
        flag++;
      } else if (
        typeof data[keys[i]] === "object" &&
        !Array.isArray(data[keys[i]]) &&
        data[keys[i]] !== null
      ) {
        let key2 = Object.keys(data[keys[i]]);

        for (let indexKey = 0; indexKey < key2.length; indexKey++) {
          let tempSubKeyValue = data[keys[i]][key2[indexKey]];
          if (
            key2[indexKey].toUpperCase() === "OR" &&
            Array.isArray(tempSubKeyValue)
          ) {
            query += ` or ( ${keys[i]} = :${flag}`;
            for (
              let indexValue = 1;
              indexValue < tempSubKeyValue.length;
              indexValue++
            ) {
              query += ` or ` + keys[i] + ` = :${flag}`;
            }
            query += ` ) `;
          } else if (key2[indexKey].toUpperCase() === "OR") {
            query +=
              ` or ${key2[indexKey].toLowerCase()} ` + keys[i] + ` = :${flag}`;
          } else if (key2[indexKey].toUpperCase() === "LIKE") {
            query += ` and  ${keys[i]} like :${flag}`;
          } else if (["IN", "NOT IN"].includes(key2[indexKey].toUpperCase())) {
            query += ` and  ${keys[i]}  ${key2[
              indexKey
            ].toUpperCase()} ( :${flag}) `;
          } else if (["IN QUERY"].includes(key2[indexKey].toUpperCase())) {
            query += ` and  ${keys[i]}  IN ( ${
              data[keys[i]][key2[indexKey]]
            } ) `;
          } else if (["NOT IN QUERY"].includes(key2[indexKey].toUpperCase())) {
            query += ` and  ${keys[i]}  NOT IN ( ${
              data[keys[i]][key2[indexKey]]
            } ) `;
          } else if ("GTE" == key2[indexKey].toUpperCase()) {
            query += ` and ` + keys[i] + ` >= :${flag}`;
          } else if ("GT" == key2[indexKey].toUpperCase()) {
            query += ` and ` + keys[i] + ` > :${flag}`;
          } else if ("LTE" == key2[indexKey].toUpperCase()) {
            query += ` and ` + keys[i] + ` <= :${flag}`;
          } else if ("LT" == key2[indexKey].toUpperCase()) {
            query += ` and ` + keys[i] + ` < :${flag}`;
          } else if ("NOT EQ" == key2[indexKey].toUpperCase()) {
            query += ` and ` + keys[i] + ` != :${flag}`;
          }
        }
      } else {
        query += ` and ` + keys[i] + ` = :${flag}`;
      }
    }
  }

  if (!isEmpty(orderBy)) {
    keys = Object.keys(orderBy);
    query += ` order by ${keys[0]} ${orderBy[keys[0]]} `;

    for (let i = 1; i < keys.length; i++) {
      query += `, ${keys[i]} ${orderBy[keys[i]]} `;
    }
  }

  // query += ` LIMIT ${offset}, ${limit}`;
  return query;
};

module.exports = {
  addNewInvHeader,
  getDataByWhereCondition,
  updateData,
  byWhere,
  byWhereTotalCount,
  addNewInvLines,
  updateDataLines,
  invoiceDetails,
  userPaymentMethod,
  paymentTerm,
  vendorSiteID,
  invoiceNumberCheck,
  detailsByWhere,
  detailsByWhereTotalCount
};
