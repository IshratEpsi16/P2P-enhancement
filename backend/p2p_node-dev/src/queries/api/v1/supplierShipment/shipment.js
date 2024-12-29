const isEmpty = require("is-empty");
let shipment_header_table_name = "XXP2P_SHIPMENT_HEADER";
let shipment_lines_table_name = "xxp2p_shipment_lines_all";
let table_name_bank = "XXP2P_SUPPLIER_BANK";

let dbName = process.env.DATABASE_NAME;

let poItemList = (data) => {
  let query = `SELECT 
      csl.CS_LINE_ID, 
      csl.CS_ID, 
      csl.RFQ_ID, 
      csl.RFQ_LINE_ID, 
      csl.QUOT_LINE_ID, 
      rfqline.ITEM_CODE,
      rfqline.ITEM_DESCRIPTION,
      rfqline.LCM_ENABLE_FLAG,
      sq.OFFERED_QUANTITY,
      (SELECT SUM(SHIPPING_QUANTITY) FROM xxp2p.xxp2p_shipment_lines_all 
      where CS_LINE_ID = csl.CS_LINE_ID 
      and PO_HEADER_ID = csl.PO_HEADER_ID
      and PO_NUMBER = csl.PO_NUMBER
      ) SHIPPED_QUANTITY
  FROM xxp2p.xxp2p_cs_lines_all csl
  LEFT JOIN xxp2p.xxp2p_rfq_lines_all rfqline 
      ON rfqline.RFQ_LINE_ID = csl.RFQ_LINE_ID
  LEFT JOIN xxp2p.xxp2p_rfq_supplier_quotation sq 
      ON sq.QUOT_LINE_ID = csl.QUOT_LINE_ID
  WHERE csl.PO_HEADER_ID = :PO_HEADER_ID 
    AND csl.PO_NUMBER = :PO_NUMBER 
    AND csl.RECOMMENDED = 'Y'
    AND csl.AWARDED = 'Y'`;
  return query;
};

let getList = async () => {
  return `SELECT * FROM ${dbName}.${shipment_header_table_name}`;
};

let getById = () => {
  return `SELECT * FROM ${dbName}.${shipment_header_table_name} where  id = :1`;
};

let getShipmentNumberFromEBS = (PO_NUMBER) => {
  let query = `SELECT ph.segment1,
       nvl(case when isha.ship_num is not null and isla.ship_line_num is not null
       then  isha.ship_num||'.'||isla.ship_line_num end, 'NA') ship_num
  FROM po_headers_all         ph,
       po_lines_all           pl,
       po_line_locations_all  pll,
       po_distributions_all   pd,
       mtl_parameters         mp,
       inl_ship_headers_all   isha,
       inl_ship_lines_all     isla
 WHERE     ph.po_header_id = pl.po_header_id
       AND pl.po_line_id = pll.po_line_id
       AND pd.line_location_id = pll.line_location_id
       AND pd.po_line_id = pl.po_line_id
       AND isla.ship_header_id = isha.ship_header_id(+)
       AND pll.line_location_id = isla.ship_line_source_id(+)
       AND pll.ship_to_organization_id = mp.organization_id
       AND ph.segment1 = '${PO_NUMBER}'`;
  return query;
};

let getShipmentItemsFromEBS = (PO_NUMBER) => {
  let query = `SELECT ph.segment1,
       msib.segment1 || '.' || msib.segment2 || '.' || msib.segment3 item_code,
       pl.po_line_id,
       pl.line_num,
       txn_qty quantity,
       NVL (CASE WHEN isha.ship_num IS NOT NULL AND isla.ship_line_num IS NOT NULL
               THEN isha.ship_num || '.' || 1 END, 'NA') ship_num
  FROM po_headers_all         ph,
       po_lines_all           pl,
       po_line_locations_all  pll,
       po_distributions_all   pd,
       mtl_parameters         mp,
       inl_ship_headers_all   isha,
       inl_ship_lines_all     isla,
       mtl_system_items_b     msib
 WHERE     ph.po_header_id = pl.po_header_id
       AND pl.po_line_id = pll.po_line_id
       AND pd.line_location_id = pll.line_location_id
       AND pd.po_line_id = pl.po_line_id
       AND msib.inventory_item_id = pl.item_id
       AND pd.destination_organization_id = msib.organization_id
       AND isla.ship_header_id = isha.ship_header_id(+)
       AND pll.line_location_id = isla.ship_line_source_id(+)
       AND pll.ship_to_organization_id = mp.organization_id
       AND ph.segment1 = '${PO_NUMBER}'
    ORDER BY isla.creation_date DESC
    FETCH FIRST 1 ROWS ONLY`;
  return query;
};

let addNew = async (data = {}) => {
  let keys = Object.keys(data);

  let query = `insert into ${dbName}.${shipment_header_table_name} (` + keys[0];
  let valueString = " ( :1";

  for (let i = 1; i < keys.length; i++) {
    query += `, ` + keys[i];
    valueString += `, :${i + 1}`;
  }

  query =
    query +
    `) VALUES ` +
    valueString +
    `) RETURNING SHIPMENT_ID INTO :${keys.length + 1}`;
  console.log(query);
  return query;
};

let addNewLines = async (data) => {
  let keys = Object.keys(data);

  let query = `insert into ${dbName}.${shipment_lines_table_name} (` + keys[0];
  let valueString = " ( :1";

  for (let i = 1; i < keys.length; i++) {
    query += `, ` + keys[i];
    valueString += `, :${i + 1}`;
  }

  query = query + `) VALUES ` + valueString + `)`;
  //console.log(query);
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
  let query = `UPDATE ${dbName}.${shipment_header_table_name} ${updateClause} ${whereClause}`;

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
  let query = `UPDATE ${dbName}.${shipment_lines_table_name} ${updateClause} ${whereClause}`;

  console.log(query);
  //console.log("Update Params:", updateParams);
  //console.log("Where Params:", whereParams);

  // Here, you would execute the update query with the updateParams and whereParams
  // For example:
  // await connection.execute(query, [...updateParams, ...whereParams]);

  // Return the query string for testing purposes
  return query;
};

let deleteShipment = (id) => {
  let query = `delete from xxp2p.xxp2p_shipment_header where SHIPMENT_ID = :id`;
  return query;
};

//PO_NUMBER,PO_HEADER_ID
let shipmentList = (PO_NUMBER, PO_HEADER_ID, FROM_DATE, TO_DATE) => {
  let query = `SELECT * 
  FROM xxp2p.xxp2p_shipment_header 
  WHERE 1=1
    AND PO_NUMBER = NVL(:PO_NUMBER, PO_NUMBER) 
    AND PO_HEADER_ID = NVL(:PO_HEADER_ID, PO_HEADER_ID)
    AND to_char(SHIPMENT_DATE,'YYYY-MM-DD') BETWEEN NVL(to_char(:FROM_DATE),SHIPMENT_DATE) 
    and NVL(to_char(:TO_DATE),SHIPMENT_DATE)
  ORDER BY SHIPMENT_ID DESC
  `;

  //   `select * from xxp2p.xxp2p_shipment_header
  //     where 1=1
  // `;

  //   if (
  //     !isEmpty(searchObject.PO_NUMBER) &&
  //     searchObject.PO_NUMBER !== undefined &&
  //     searchObject.PO_NUMBER !== null
  //   ) {
  //     query += ` AND PO_NUMBER = NVL(${searchObject.PO_NUMBER},PO_NUMBER)`;
  //   }

  //   if (
  //     !isEmpty(searchObject.PO_HEADER_ID) &&
  //     searchObject.PO_HEADER_ID !== undefined &&
  //     searchObject.PO_HEADER_ID !== null
  //   ) {
  //     query += ` AND PO_HEADER_ID = NVL(${searchObject.PO_HEADER_ID},PO_HEADER_ID)`;
  //   }

  //   query += ` ORDER BY SHIPMENT_ID DESC`;
  console.log(query);
  return query;
};

let shipmentDetails = (id) => {
  let query = `select * from xxp2p.xxp2p_shipment_lines_all where SHIPMENT_ID = ${id} order by CREATION_DATE`;
  return query;
};
let shipmentTimeline = (id) => {
  let query = `SELECT DISTINCT
      SH.SHIPMENT_ID,
      SH.STATUS,
      SH.CREATION_DATE AS SHIPMENT_DATE,
      SH.GATE_RCV_STATUS,
      SH.GATE_RCV_DATE,
      SH.GATE_RCV_REMARKS,
      SH.EBS_GRN_NO,
      SH.EBS_GRN_DATE,
      CASE 
          WHEN SH.STATUS = 'SHIPPED' THEN 1 
          WHEN SH.STATUS IS NULL THEN 2
          ELSE NULL 
      END AS SHIPMENT_STATUS_RESULT,
      CASE 
          WHEN SH.GATE_RCV_STATUS = 'ACCEPTED' THEN 1
          WHEN SH.GATE_RCV_STATUS = 'REJECTED' THEN 0
          WHEN SH.GATE_RCV_STATUS IS NULL THEN 2
          ELSE NULL 
      END AS GATE_RCV_RESULT,
      CASE 
          WHEN SH.EBS_GRN_NO IS NOT NULL THEN 1
          WHEN SH.EBS_GRN_NO IS NULL THEN 0
          ELSE NULL 
      END AS GRN_RESULT
  FROM 
      XXP2P.XXP2P_SHIPMENT_HEADER SH
  WHERE 
      SH.SHIPMENT_ID = ${id}`;
  //console.log(query);
  return query;
};

let shipmentItem = (id) => {
  let query = ` select 
    csall.CS_LINE_ID,
    csall.RFQ_LINE_ID,
    csall.QUOT_LINE_ID,
    csall.AWARD_QUANTITY,
    csall.PO_LINE_ID,
    csall.PO_LINE_NUM,
    rfqln.ITEM_CODE,
    rfqln.ITEM_DESCRIPTION,
    rfqln.ITEM_SPECIFICATION,
    rfqln.UNIT_MEAS_LOOKUP_CODE,
    rfqln.LCM_ENABLE_FLAG as LCM_ENABLE,
     rfqln.ITEM_ID,
     (select sum(SHIPPING_QUANTITY) from xxp2p.xxp2p_shipment_lines_all where po_number = csall.po_number and item_code = rfqln.ITEM_CODE) as SHIPPING_QUANTITY
    from xxp2p.xxp2p_cs_lines_all csall
    left join xxp2p.xxp2p_rfq_lines_all rfqln on rfqln.RFQ_LINE_ID = csall.RFQ_LINE_ID
    AND rfqln.LINE_STATUS = 'Y'
    where csall.po_number = ${id}
    AND csall.LINE_STATUS = 'Y'`;
  //console.log(query);
  return query;
};

let byWhereTotalCount = async (data) => {
  //console.log(data);
  let whereClause = "WHERE 1=1";
  let whereParams = {};
  let offsetLimit = "";

  // Construct the WHERE clause dynamically based on the provided data
  if (!isEmpty(data.USER_ID)) {
    whereClause += ` AND USER_ID = NVL(:USER_ID, USER_ID)`;
    whereParams.USER_ID = `${data.USER_ID}`;
  }

  if (!isEmpty(data.PO_NUMBER)) {
    whereClause += ` AND PO_NUMBER = NVL(:PO_NUMBER, PO_NUMBER)`;
    whereParams.PO_NUMBER = `${data.PO_NUMBER}`;
  }
  if (!isEmpty(data.PO_HEADER_ID)) {
    whereClause += ` AND PO_HEADER_ID LIKE NVL(:PO_HEADER_ID, PO_HEADER_ID)`;
    whereParams.PO_HEADER_ID = `%${data.PO_HEADER_ID}%`;
  }
  if (!isEmpty(data.DEVLIVERY_CHALLAN_NUMBER)) {
    whereClause += ` AND DEVLIVERY_CHALLAN_NUMBER LIKE NVL(:DEVLIVERY_CHALLAN_NUMBER, DEVLIVERY_CHALLAN_NUMBER)`;
    whereParams.DEVLIVERY_CHALLAN_NUMBER = `%${data.DEVLIVERY_CHALLAN_NUMBER}%`;
  }
  if (!isEmpty(data.BL_CHALLAN_NUMBER)) {
    whereClause += ` AND BL_CHALLAN_NUMBER LIKE NVL(:BL_CHALLAN_NUMBER, BL_CHALLAN_NUMBER)`;
    whereParams.BL_CHALLAN_NUMBER = `%${data.BL_CHALLAN_NUMBER}%`;
  }
  if (!isEmpty(data.VAT_CHALLAN_NUMBER)) {
    whereClause += ` AND VAT_CHALLAN_NUMBER LIKE NVL(:VAT_CHALLAN_NUMBER, VAT_CHALLAN_NUMBER)`;
    whereParams.VAT_CHALLAN_NUMBER = `%${data.VAT_CHALLAN_NUMBER}%`;
  }
  if (!isEmpty(data.LC_NUMBER)) {
    whereClause += ` AND LC_NUMBER LIKE NVL(:LC_NUMBER, LC_NUMBER)`;
    whereParams.LC_NUMBER = `%${data.LC_NUMBER}%`;
  }
  if (!isEmpty(data.GATE_RCV_STATUS)) {
    whereClause += ` AND GATE_RCV_STATUS LIKE NVL(:GATE_RCV_STATUS, GATE_RCV_STATUS)`;
    whereParams.GATE_RCV_STATUS = `%${data.GATE_RCV_STATUS}%`;
  }
  if (!isEmpty(data.STATUS)) {
    whereClause += ` AND STATUS LIKE NVL(:STATUS, STATUS)`;
    whereParams.STATUS = `%${data.STATUS}%`;
  }

  if (!isEmpty(data.FROM_DATE && data.TO_DATE)) {
    whereClause += ` AND TRUNC(SHIPMENT_DATE) BETWEEN NVL(TO_DATE(:FROM_DATE, 'YYYY-MM-DD'), SHIPMENT_DATE) 
                      AND NVL(TO_DATE(:TO_DATE, 'YYYY-MM-DD'), SHIPMENT_DATE)`;
    whereParams.FROM_DATE = data.FROM_DATE;
    whereParams.TO_DATE = data.TO_DATE;
  }
  // offsetLimit +=
  // ` OFFSET :OFFSET ROWS
  // FETCH NEXT :LIMIT ROWS ONLY`;
  // whereParams.OFFSET = data.OFFSET;
  // whereParams.LIMIT = data.LIMIT;

  // Construct the select query string
  let query = `SELECT COUNT(SHIPMENT_ID) AS TOTAL 
    FROM ${dbName}.${shipment_header_table_name} 
    ${whereClause}`;
  query = query;

  // Return the query string and params for testing purposes
  return { query, whereParams };
};

let byWhere = async (data) => {
  //console.log(data);
  let whereClause = "WHERE 1=1";
  let whereParams = {};
  let offsetLimit = "";

  // Construct the WHERE clause dynamically based on the provided data
  if (!isEmpty(data.USER_ID)) {
    whereClause += ` AND USER_ID = NVL(:USER_ID, USER_ID)`;
    whereParams.USER_ID = `${data.USER_ID}`;
  }

  if (!isEmpty(data.PO_NUMBER)) {
    whereClause += ` AND PO_NUMBER = NVL(:PO_NUMBER, PO_NUMBER)`;
    whereParams.PO_NUMBER = `${data.PO_NUMBER}`;
  }
  if (!isEmpty(data.PO_HEADER_ID)) {
    whereClause += ` AND PO_HEADER_ID LIKE NVL(:PO_HEADER_ID, PO_HEADER_ID)`;
    whereParams.PO_HEADER_ID = `%${data.PO_HEADER_ID}%`;
  }
  if (!isEmpty(data.DEVLIVERY_CHALLAN_NUMBER)) {
    whereClause += ` AND DEVLIVERY_CHALLAN_NUMBER LIKE NVL(:DEVLIVERY_CHALLAN_NUMBER, DEVLIVERY_CHALLAN_NUMBER)`;
    whereParams.DEVLIVERY_CHALLAN_NUMBER = `%${data.DEVLIVERY_CHALLAN_NUMBER}%`;
  }
  if (!isEmpty(data.BL_CHALLAN_NUMBER)) {
    whereClause += ` AND BL_CHALLAN_NUMBER LIKE NVL(:BL_CHALLAN_NUMBER, BL_CHALLAN_NUMBER)`;
    whereParams.BL_CHALLAN_NUMBER = `%${data.BL_CHALLAN_NUMBER}%`;
  }
  if (!isEmpty(data.VAT_CHALLAN_NUMBER)) {
    whereClause += ` AND VAT_CHALLAN_NUMBER LIKE NVL(:VAT_CHALLAN_NUMBER, VAT_CHALLAN_NUMBER)`;
    whereParams.VAT_CHALLAN_NUMBER = `%${data.VAT_CHALLAN_NUMBER}%`;
  }
  if (!isEmpty(data.LC_NUMBER)) {
    whereClause += ` AND LC_NUMBER LIKE NVL(:LC_NUMBER, LC_NUMBER)`;
    whereParams.LC_NUMBER = `%${data.LC_NUMBER}%`;
  }
  if (!isEmpty(data.GATE_RCV_STATUS)) {
    whereClause += ` AND GATE_RCV_STATUS LIKE NVL(:GATE_RCV_STATUS, GATE_RCV_STATUS)`;
    whereParams.GATE_RCV_STATUS = `%${data.GATE_RCV_STATUS}%`;
  }
  if (!isEmpty(data.STATUS)) {
    whereClause += ` AND STATUS LIKE NVL(:STATUS, STATUS)`;
    whereParams.STATUS = `%${data.STATUS}%`;
  }

  if (!isEmpty(data.FROM_DATE && data.TO_DATE)) {
    whereClause += ` AND TRUNC(SHIPMENT_DATE) BETWEEN NVL(TO_DATE(:FROM_DATE, 'YYYY-MM-DD'), SHIPMENT_DATE) 
                      AND NVL(TO_DATE(:TO_DATE, 'YYYY-MM-DD'), SHIPMENT_DATE)`;
    whereParams.FROM_DATE = data.FROM_DATE;
    whereParams.TO_DATE = data.TO_DATE;
  }
  offsetLimit += ` ORDER BY CREATION_DATE DESC OFFSET :OFFSET ROWS 
      FETCH NEXT :LIMIT ROWS ONLY `;
  whereParams.OFFSET = data.OFFSET;
  whereParams.LIMIT = data.LIMIT;

  // Construct the select query string
  let query = `SELECT * 
    FROM ${dbName}.${shipment_header_table_name} 
    ${whereClause}`;
  query = query + offsetLimit;

  // Return the query string and params for testing purposes
  return { query, whereParams };
};

let shipmentUpdate = async (updateData, whereData) => {
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
  let query = `UPDATE xxp2p.xxp2p_shipment_header ${updateClause} ${whereClause}`;

  console.log(query);
  console.log("Update Params:", updateParams);
  console.log("Where Params:", whereParams);

  // Return the query string for testing purposes
  return query;
};

let createGRN = async (info) => {
  let query = `
    DECLARE
    BEGIN
              apps.XX_CREATE_GRN(${info.PO_NUMBER}, ${info.ORG_ID},${info.SHIP_NUM});
              END;`;
  console.log(query);
  return query;
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

  let query = `Select ${columns} from ${dbName}.${shipment_header_table_name} `;

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
  getList,
  getById,
  addNew,
  poItemList,
  addNewLines,
  deleteShipment,
  shipmentList,
  getDataByWhereCondition,
  shipmentDetails,
  byWhere,
  byWhereTotalCount,
  shipmentUpdate,
  shipmentTimeline,
  createGRN,
  shipmentItem,
  getShipmentNumberFromEBS,
  getShipmentItemsFromEBS,
  updateData,
  updateDataLines
};

//! OU List Without BG
/*
    `SELECT 
      HOU.ORGANIZATION_ID,
      HOU.SHORT_CODE,
      HOU.NAME,
      CASE WHEN SSO.USER_ID IS NOT NULL AND SSO.SITE_ID IS NOT NULL AND SSO.ORGANIZATION_ID IS NOT NULL THEN 1 ELSE 0 END AS IS_ASSOCIATED
    FROM 
      HR_OPERATING_UNITS HOU
    LEFT JOIN 
      XXP2P.XXP2P_SUPPLIER_SITES_OU SSO 
    ON 
      SSO.USER_ID = :USER_ID 
      AND HOU.ORGANIZATION_ID = SSO.ORGANIZATION_ID
      AND SSO.SITE_ID = NVL(:SITE_ID,null)
    ORDER BY 
      HOU.ORGANIZATION_ID`*/
