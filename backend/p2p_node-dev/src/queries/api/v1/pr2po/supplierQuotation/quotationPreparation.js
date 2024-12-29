const isEmpty = require("is-empty");
let rfq_header_table_name = "XXP2P_RFQ_HEADER";
let rfq_lines_table_name = "XXP2P_RFQ_LINES_ALL";
let rfq_supplier_invite_table_name = "XXP2P_RFQ_SUPPLIER_INVITATION";
let rfq_supplier_quotation_table_name = "XXP2P_RFQ_SUPPLIER_QUOTATION";

let dbName = process.env.DATABASE_NAME;

/*
let responseUpdate = async (updateData, whereData) => {
  let updateClause = "";
  let whereClause = "";
  let updateParams = [];
  let whereParams = [];
  console.log(updateData);

  // Construct the SET clause based on the properties of updateData
  if (updateData != null && Object.keys(updateData).length > 0) {
    let updates = [];
    // Object.keys(updateData).forEach((key) => {
    //   updates.push(`${key} = '${updateData[key]}'`); // Use NVL to handle null values
    //   updateParams.push(updateData[key]);
    // });
    Object.keys(updateData).forEach((key) => {
      let value = updateData[key];
      if (typeof value === 'string' && value.match(/^\d{2}\/[a-zA-Z]{3}\/\d{4} \d{2}:\d{2}:\d{2}$/)) {
        // If the value matches the date format, parse it into a Date object
        value = new Date(value);
        // Convert the parsed Date object to the desired string format
        value = `TO_DATE('${value.toISOString().slice(0, 19)}', 'YYYY-MM-DD"T"HH24:MI:SS')`;
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
  let query = `UPDATE ${dbName}.${rfq_supplier_invite_table_name} ${updateClause} ${whereClause}`;

  console.log(query);
  console.log("Update Params:", updateParams);
  console.log("Where Params:", whereParams);

  // Here, you would execute the update query with the updateParams and whereParams
  // For example:
  // await connection.execute(query, [...updateParams, ...whereParams]);

  // Return the query string for testing purposes
  return query;
};*/
let responseUpdate = async (updateData, whereData) => {
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
        value = `TO_DATE('${value.toISOString().slice(0, 19)}', 'YYYY-MM-DD"T"HH24:MI:SS')`;
      } else if (typeof value === 'string' && value.match(/^\d{2}\/[a-zA-Z]{3}\/\d{2} \d{2}:\d{2}:\d{2}$/)) {
        // If the value matches the date format "25/MAR/24 10:25:21", parse it into a Date object and then format it
        value = new Date(value);
        value = `TO_DATE('${value.toISOString().slice(0, 19)}', 'YYYY-MM-DD"T"HH24:MI:SS')`;
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
  let query = `UPDATE ${dbName}.${rfq_supplier_invite_table_name} ${updateClause} ${whereClause}`;

  console.log(query);
  console.log("Update Params:", updateParams);
  console.log("Where Params:", whereParams);

  // Return the query string for testing purposes
  return query;
};

let addQuotLineItem = async (data = {}) => {
  let keys = Object.keys(data);

  let query = `insert into ${dbName}.${rfq_supplier_quotation_table_name} (` + keys[0];
  let valueString = " ( :1";

  for (let i = 1; i < keys.length; i++) {
    query += `, ` + keys[i];
    valueString += `, :${i + 1}`;
  }

  query =
    query +
    `) VALUES ` +
    valueString +
    `) RETURNING RFQ_ID INTO :${keys.length + 1}`;
  //console.log(query);
  return query;
};

let quotationLineItemUpdate = async (updateData, whereData) => {
  let updateClause = "";
  let whereClause = "";
  let updateParams = [];
  let whereParams = [];

  // Construct the SET clause based on the properties of updateData
  if (updateData != null && Object.keys(updateData).length > 0) {
    let updates = [];
    // Object.keys(updateData).forEach((key) => {
    //   updates.push(`${key} = '${updateData[key]}'`); // Use NVL to handle null values
    //   updateParams.push(updateData[key]);
    // });
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
  let query = `UPDATE ${dbName}.${rfq_supplier_quotation_table_name} ${updateClause} ${whereClause}`;

  console.log(query);
  console.log("Update Params:", updateParams);
  console.log("Where Params:", whereParams);

  // Here, you would execute the update query with the updateParams and whereParams
  // For example:
  // await connection.execute(query, [...updateParams, ...whereParams]);

  // Return the query string for testing purposes
  return query;
};


module.exports = {
  responseUpdate,
  addQuotLineItem,
  quotationLineItemUpdate,
};
