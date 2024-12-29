const isEmpty = require("is-empty");
let cs_header_table_name = "XXP2P_CS_HEADER";
let cs_line_table_name = "XXP2P_CS_LINES_ALL";
let dbName = process.env.DATABASE_NAME;

let addNewCSHeader = async (data = {}) => {
  let keys = Object.keys(data);

  let query = `insert into ${dbName}.${cs_header_table_name} (` + keys[0];
  let valueString = " ( :1";

  for (let i = 1; i < keys.length; i++) {
    query += `, ` + keys[i];
    valueString += `, :${i + 1}`;
  }

  query =
    query +
    `) VALUES ` +
    valueString +
    `) RETURNING CS_ID INTO :${keys.length + 1}`;
  //console.log(query);
  return query;
};

let addNewCSLineItem = async (data = {}) => {
  let keys = Object.keys(data);

  let query = `insert into ${dbName}.${cs_line_table_name} (` + keys[0];
  let valueString = " ( :1";

  for (let i = 1; i < keys.length; i++) {
    query += `, ` + keys[i];
    valueString += `, :${i + 1}`;
  }

  query =
    query +
    `) VALUES ` +
    valueString +
    `) RETURNING CS_LINE_ID INTO :${keys.length + 1}`;
  //console.log(query);
  return query;
};

let csListTotal = async (FROM_DATE, TO_DATE, CS_STATUS, SEARCH_FIELD) => {
  let query = `
    
SELECT 
    COUNT(cs.CS_ID) AS TOTAL
FROM  
    XXP2P.XXP2P_CS_HEADER cs
LEFT JOIN 
    XXP2P.XXP2P_USER usr ON usr.USER_ID = cs.CREATED_BY
WHERE 
    TRUNC(cs.CREATION_DATE) 
    BETWEEN COALESCE(TO_DATE(:FROM_DATE, 'YYYY-MM-DD'), TRUNC(cs.CREATION_DATE)) 
        AND COALESCE(TO_DATE(:TO_DATE, 'YYYY-MM-DD'), TRUNC(cs.CREATION_DATE))
    AND UPPER(cs.CS_STATUS) = NVL(UPPER(:CS_STATUS), UPPER(cs.CS_STATUS))
    AND (UPPER (cs.CS_TITLE) LIKE '%' || NVL (UPPER (:SEARCH_FIELD),UPPER (cs.CS_TITLE)) || '%')
ORDER BY 
    cs.CREATION_DATE DESC
            `;
  return query;
};

let csList = async (
  FROM_DATE,
  TO_DATE,
  CS_STATUS,
  SEARCH_FIELD,
  OFFSET,
  LIMIT
) => {
  let query = `
   
SELECT 
    cs.*,
    RFQ.RFQ_TYPE,    
    usr.USER_NAME as CREATED_BY_USER_NAME,
    usr.FULL_NAME as CREATED_BY_FULL_NAME
FROM  
    XXP2P.XXP2P_CS_HEADER cs
LEFT JOIN 
    XXP2P.XXP2P_USER usr ON usr.USER_ID = cs.CREATED_BY
LEFT JOIN 
    XXP2P.XXP2P_RFQ_HEADER RFQ ON RFQ.RFQ_ID = cs.RFQ_ID
WHERE 
    TRUNC(cs.CREATION_DATE) 
    BETWEEN COALESCE(TO_DATE(:FROM_DATE, 'YYYY-MM-DD'), TRUNC(cs.CREATION_DATE)) 
        AND COALESCE(TO_DATE(:TO_DATE, 'YYYY-MM-DD'), TRUNC(cs.CREATION_DATE))
    AND UPPER(cs.CS_STATUS) = NVL(UPPER(:CS_STATUS), UPPER(cs.CS_STATUS))
    AND (UPPER (cs.CS_TITLE) LIKE '%' || NVL (UPPER (:SEARCH_FIELD),UPPER (cs.CS_TITLE)) || '%')
ORDER BY 
    cs.CREATION_DATE DESC
OFFSET 
    :OFFSET ROWS 
FETCH NEXT 
    :LIMIT ROWS ONLY
            `;
  console.log(query);
  return query;
};

let csPendingList = async (
  APPROVER_ID,
  FROM_DATE,
  TO_DATE,
  CS_STATUS,
  OFFSET,
  LIMIT
) => {
  let query = `
    select cs.*,
RFQ.RFQ_TYPE,
    (select USER_NAME from xxp2p.xxp2p_user where user_id = cs.CREATED_BY) as CREATED_BY_USER_NAME,
    (select FULL_NAME from xxp2p.xxp2p_user where user_id = cs.CREATED_BY) as CREATED_BY_FULL_NAME,
    (select PROPIC_FILE_NAME from xxp2p.xxp2p_user where user_id = cs.CREATED_BY) as PROPIC_FILE_NAME
    from 
    XXP2P.XXP2P_STAGE_APPROVERS SA,
    XXP2P.XXP2P_APPROVAL_MODULE AM,
    XXP2P.XXP2P_APPROVAL_STAGES XAS,
    XXP2P.XXP2P_CS_HEADER cs
    LEFT JOIN 
    XXP2P.XXP2P_RFQ_HEADER RFQ ON RFQ.RFQ_ID = cs.RFQ_ID
    where LOWER(AM.MODULE_NAME) IN ( LOWER('Local CS Approval'), LOWER('Foreign CS Approval'),LOWER('Short CS Approval') )
    AND XAS.MODULE_TYPE_ID = AM.MODULE_ID
    AND SA.USER_ID = :APPROVER_ID
    and SA.STAGE_ID = XAS.AS_ID 
    AND TEMPLATE_ID = SA.STAGE_ID
    AND TEMPLATE_STAGE_LEVEL = SA.STAGE_LEVEL
    AND TRUNC(cs.CREATION_DATE) BETWEEN NVL(TO_DATE(:FROM_DATE, 'YYYY-MM-DD'), TRUNC(cs.CREATION_DATE))
                                     AND NVL(TO_DATE(:TO_DATE, 'YYYY-MM-DD'), TRUNC(cs.CREATION_DATE))
      and CS_STATUS = NVL(:CS_STATUS,CS_STATUS)
        ORDER BY cs.CREATION_DATE DESC
        OFFSET :OFFSET ROWS
      FETCH NEXT :LIMIT ROWS ONLY
            `;
  //console.log(query);
  return query;
};
let csPendingListTotal = async (APPROVER_ID, FROM_DATE, TO_DATE, CS_STATUS) => {
  let query = `
  select count(cs.CS_ID) as TOTAL
    from 
    XXP2P.XXP2P_STAGE_APPROVERS SA,
    XXP2P.XXP2P_APPROVAL_MODULE AM,
    XXP2P.XXP2P_APPROVAL_STAGES XAS,
    XXP2P.XXP2P_CS_HEADER cs
    where LOWER(AM.MODULE_NAME) IN ( LOWER('Local CS Approval'), LOWER('Foreign CS Approval'),LOWER('Short CS Approval') )
    AND XAS.MODULE_TYPE_ID = AM.MODULE_ID
    AND SA.USER_ID = :APPROVER_ID
    and SA.STAGE_ID = XAS.AS_ID 
    AND TEMPLATE_ID = SA.STAGE_ID
    AND TEMPLATE_STAGE_LEVEL = SA.STAGE_LEVEL
    AND TRUNC(cs.CREATION_DATE) BETWEEN NVL(TO_DATE(:FROM_DATE, 'YYYY-MM-DD'), TRUNC(cs.CREATION_DATE))
                                     AND NVL(TO_DATE(:TO_DATE, 'YYYY-MM-DD'), TRUNC(cs.CREATION_DATE))
      and CS_STATUS = NVL(:CS_STATUS,CS_STATUS)
        ORDER BY cs.CREATION_DATE DESC
            `;
  //console.log(query);
  return query;
};

let csUpdate = async (updateData, whereData) => {
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
  let query = `UPDATE ${dbName}.XXP2P_CS_HEADER ${updateClause} ${whereClause}`;

  console.log(query);
  console.log("Update Params:", updateParams);
  console.log("Where Params:", whereParams);

  // Here, you would execute the update query with the updateParams and whereParams
  // For example:
  // await connection.execute(query, [...updateParams, ...whereParams]);

  // Return the query string for testing purposes
  return query;
};

let csLineUpdate = async (updateData, whereData) => {
  let updateClause = "";
  let whereClause = "";
  let updateParams = [];
  let whereParams = [];
  console.log(whereData);

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
  let query = `UPDATE ${dbName}.XXP2P_CS_LINES_ALL ${updateClause} ${whereClause}`;

  console.log(query);
  console.log("Update Params:", updateParams);
  console.log("Where Params:", whereParams);

  // Here, you would execute the update query with the updateParams and whereParams
  // For example:
  // await connection.execute(query, [...updateParams, ...whereParams]);

  // Return the query string for testing purposes
  return query;
};

let supplierList = async (RFQ_ID) => {
  let query = `
  select 
  si.INVITATION_ID,
  si.USER_ID,
  BSC.ORGANIZATION_NAME,
  si.RFQ_ID,
  si.GENERAL_TERMS
from  xxp2p.xxp2p_rfq_supplier_invitation  si
LEFT JOIN XXP2P.XXP2P_SUPPLIER_BSC_INFO BSC ON BSC.USER_ID = si.USER_ID
WHERE si.RFQ_ID = '${RFQ_ID}'
            `;
  console.log(query);
  return query;
};

let supplierCSTermUpdate = async (updateData, whereData) => {
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
  let query = `UPDATE ${dbName}.xxp2p_rfq_supplier_invitation ${updateClause} ${whereClause}`;

  console.log(query);
  console.log("Update Params:", updateParams);
  console.log("Where Params:", whereParams);

  // Here, you would execute the update query with the updateParams and whereParams
  // For example:
  // await connection.execute(query, [...updateParams, ...whereParams]);

  // Return the query string for testing purposes
  return query;
};

let csDetails = async (CS_ID) => {
  let query = `
  select 
  CLAA.*,
LA.*,
SQ.*
  from xxp2p.XXP2P_CS_LINES_ALL CLAA
  LEFT JOIN XXP2P.XXP2P_RFQ_SUPPLIER_QUOTATION SQ ON SQ.QUOT_LINE_ID = CLAA.QUOT_LINE_ID
  LEFT JOIN XXP2P.XXP2P_RFQ_LINES_ALL LA ON LA.RFQ_LINE_ID = CLAA.RFQ_LINE_ID
  AND LA.RFQ_ID =  CLAA.RFQ_ID
  AND LA.CS_STATUS = 1
  where 
  CLAA.cs_id =${CS_ID}
  ORDER BY 1
            `;
  console.log(query);
  return query;
};

let csDetailsItemTotal = async (CS_ID) => {
  let query = `
  select 
  COUNT(CLAA.CS_LINE_ID) AS TOTAL
  from xxp2p.XXP2P_CS_LINES_ALL CLAA
  LEFT JOIN XXP2P.XXP2P_RFQ_SUPPLIER_QUOTATION SQ ON SQ.QUOT_LINE_ID = CLAA.QUOT_LINE_ID
  LEFT JOIN XXP2P.XXP2P_RFQ_LINES_ALL LA ON LA.RFQ_LINE_ID = CLAA.RFQ_LINE_ID
  AND LA.RFQ_ID =  CLAA.RFQ_ID
  AND LA.CS_STATUS = 1
  where 
  CLAA.cs_id =${CS_ID}
  ORDER BY 1
            `;
  console.log(query);
  return query;
};

let csItemDelete = async (CS_LINE_ID) => {
  let rfqLineIdPlaceholders = CS_LINE_ID.map((id, index) => `${id}`).join(",");
  let query = `delete from xxp2p.XXP2P_CS_LINES_ALL where CS_LINE_ID IN (${rfqLineIdPlaceholders})`;
  console.log(query);
  return query;
};

let csItemStatusUpdate = async (RFQ_LINE_ID, STATUS) => {
  let rfqLineIdPlaceholders = RFQ_LINE_ID.map((id, index) => `${id}`).join(",");
  let query = `
  UPDATE xxp2p.XXP2P_RFQ_LINES_ALL SET CS_STATUS = '${STATUS}' where RFQ_LINE_ID IN (${rfqLineIdPlaceholders}) `;
  console.log(query);
  return query;
};

let poList = async (CS_ID) => {
  let query = `SELECT 
  csall.user_id,
  (select ORGANIZATION_NAME from xxp2p.xxp2p_supplier_bsc_info where user_id = csall.user_id) AS SUPPLIER_NAME,
  csall.PO_NUMBER, 
  csall.PO_HEADER_ID, 
  MAX(csall.PO_DATE) AS PO_DATE 
FROM xxp2p.xxp2p_cs_lines_all csall
WHERE cs_id = ${CS_ID}
GROUP BY 
csall.user_id,
  csall.PO_NUMBER, 
  csall.PO_HEADER_ID
  order by csall.PO_NUMBER
  `;
  return query;
};

let csTemplateFind = async (data) => {
  //console.log(data);
  let whereParams = {};
  let whereClause = "WHERE 1=1";

  // Construct the WHERE clause dynamically based on the provided data
  if (!isEmpty(data.MODULE_NAME)) {
    whereClause += ` AND AM.MODULE_NAME = NVL(:MODULE_NAME, MODULE_NAME)`;
    whereParams.MODULE_NAME = `${data.MODULE_NAME}`;
  }
  if (!isEmpty(data.ORG_ID)) {
    whereClause += ` AND APS.ORG_ID = NVL(:ORG_ID, ORG_ID)`;
    whereParams.ORG_ID = `${data.ORG_ID}`;
  }
  if (!isEmpty(data.APPROVAL_FLOW_TYPE)) {
    whereClause += ` AND upper(APS.APPROVAL_FLOW_TYPE) = NVL(upper(:APPROVAL_FLOW_TYPE), APPROVAL_FLOW_TYPE)`;
    whereParams.APPROVAL_FLOW_TYPE = `${data.APPROVAL_FLOW_TYPE}`;
  }
  if (!isEmpty(data.BUYER_DEPARTMENT)) {
    whereClause += ` AND upper(APS.BUYER_DEPARTMENT) = NVL(upper(:BUYER_DEPARTMENT), BUYER_DEPARTMENT)`;
    whereParams.BUYER_DEPARTMENT = `${data.BUYER_DEPARTMENT}`;
  }
  if (!isEmpty(data.AMOUNT)) {
    whereClause += ` AND :AMOUNT BETWEEN APS.MIN_AMOUNT AND APS.MAX_AMOUNT`;
    whereParams.AMOUNT = `${data.AMOUNT}`;
  }

  // Construct the select query string
  let query = 
    `SELECT APS.AS_ID 
    FROM XXP2P.XXP2P_APPROVAL_STAGES APS
    JOIN XXP2P.XXP2P_APPROVAL_MODULE AM ON APS.MODULE_TYPE_ID = AM.MODULE_ID
    ${whereClause}`;
    console.log('Query: ',query);

  // Return the query string and params for testing purposes
  return { query, whereParams };
};

module.exports = {
  addNewCSHeader,
  addNewCSLineItem,
  csList,
  csPendingList,
  csUpdate,
  csLineUpdate,
  supplierList,
  supplierCSTermUpdate,
  csListTotal,
  csDetails,
  csDetailsItemTotal,
  csItemDelete,
  csItemStatusUpdate,
  csPendingListTotal,
  poList,
  csTemplateFind,
};

/*
  SELECT cs.*,    
        (select USER_NAME from xxp2p.xxp2p_user where user_id = cs.CREATED_BY) as CREATED_BY_USER_NAME,
        (select FULL_NAME from xxp2p.xxp2p_user where user_id = cs.CREATED_BY) as CREATED_BY_FULL_NAME
        from  ${dbName}.${cs_header_table_name} cs
        where trunc(cs.CREATION_DATE) 
      between nvl(to_date(:FROM_DATE,'YYYY-MM-DD'), cs.CREATION_DATE) 
      and nvl(to_date(:TO_DATE,'YYYY-MM-DD'), cs.CREATION_DATE)
      and CS_STATUS = NVL(:CS_STATUS,CS_STATUS)
        ORDER BY cs.CREATION_DATE DESC
        OFFSET :OFFSET ROWS 
      FETCH NEXT :LIMIT ROWS ONLY
  */
