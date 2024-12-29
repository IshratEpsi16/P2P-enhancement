const isEmpty = require("is-empty");
let supplier_invite_table_name = "XXP2P_SUPPLIER_INVITATION_HISTORY";
let dbName = process.env.DATABASE_NAME;

let addNew = async (data = {}) => {
    let keys = Object.keys(data);
  
    let query = `insert into ${dbName}.${supplier_invite_table_name} (` + keys[0];
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
    //console.log(query);
    return query;
  };


  
let getDataByWhereCondition = async (data = {}, orderBy = {}, limit, offset, columnList = []) => {
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

  let query = `Select ${columns} from ${dbName}.XXP2P_USER`;

  if (keys.length > 0) {

      if (Array.isArray(data[keys[0]])) {
          query += ` where ${keys[0]} BETWEEN :1 and :2`;
          flag = 3;
      } else if (typeof data[keys[0]] === 'object' && !Array.isArray(data[keys[0]]) && data[keys[0]] !== null) {

          let key2 = Object.keys(data[keys[0]]);

          for (let indexKey = 0; indexKey < key2.length; indexKey++) {
              let tempSubKeyValue = data[keys[0]][key2[indexKey]];
              if (key2[indexKey].toUpperCase() === "OR" && Array.isArray(tempSubKeyValue)) {
                  query += ` where ( ${keys[0]} = :1`;
                  for (let indexValue = 1; indexValue < tempSubKeyValue.length; indexValue++) {
                      query += ` or ` + keys[0] + ` = :1`;
                  }
                  query += ` ) `;

              } else if (key2[indexKey].toUpperCase() === "OR") {
                  query += ` where ${key2[indexKey].toLowerCase()} ` + keys[0] + ` = :1`;
              } else if (key2[indexKey].toUpperCase() === "LIKE") {
                  query += ` where ${keys[0]} like :1`;
              } else if (["IN", "NOT IN"].includes(key2[indexKey].toUpperCase())) {
                  query += ` where ${keys[0]}  ${key2[indexKey].toUpperCase()} ( :1) `;
              } else if (["IN QUERY"].includes(key2[indexKey].toUpperCase())) {
                  query += ` where  ${keys[0]}  IN ( ${data[keys[0]][key2[indexKey]]} ) `;
              } else if (["NOT IN QUERY"].includes(key2[indexKey].toUpperCase())) {
                  query += ` where  ${keys[0]}  NOT IN ( ${data[keys[0]][key2[indexKey]]} ) `;
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
          query += ` where ${keys[0]} = :1`
      }

      for (let i = 1; i < keys.length; i++, flag++) {

          if (Array.isArray(data[keys[i]])) {
              query += ` and ` + keys[i] + `  BETWEEN  :${flag} and :${flag}`;
              flag++;
          } else if (typeof data[keys[i]] === 'object' && !Array.isArray(data[keys[i]]) && data[keys[i]] !== null) {

              let key2 = Object.keys(data[keys[i]]);

              for (let indexKey = 0; indexKey < key2.length; indexKey++) {
                  let tempSubKeyValue = data[keys[i]][key2[indexKey]];
                  if (key2[indexKey].toUpperCase() === "OR" && Array.isArray(tempSubKeyValue)) {
                      query += ` or ( ${keys[i]} = :${flag}`;
                      for (let indexValue = 1; indexValue < tempSubKeyValue.length; indexValue++) {
                          query += ` or ` + keys[i] + ` = :${flag}`;
                      }
                      query += ` ) `;

                  } else if (key2[indexKey].toUpperCase() === "OR") {
                      query += ` or ${key2[indexKey].toLowerCase()} ` + keys[i] + ` = :${flag}`;
                  } else if (key2[indexKey].toUpperCase() === "LIKE") {
                      query += ` and  ${keys[i]} like :${flag}`;
                  } else if (["IN", "NOT IN"].includes(key2[indexKey].toUpperCase())) {
                      query += ` and  ${keys[i]}  ${key2[indexKey].toUpperCase()} ( :${flag}) `;
                  } else if (["IN QUERY"].includes(key2[indexKey].toUpperCase())) {
                      query += ` and  ${keys[i]}  IN ( ${data[keys[i]][key2[indexKey]]} ) `;
                  } else if (["NOT IN QUERY"].includes(key2[indexKey].toUpperCase())) {
                      query += ` and  ${keys[i]}  NOT IN ( ${data[keys[i]][key2[indexKey]]} ) `;
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
  let query = `UPDATE ${dbName}.XXP2P_USER ${updateClause} ${whereClause}`;

  console.log(query);
  //console.log("Update Params:", updateParams);
  //console.log("Where Params:", whereParams);

  // Here, you would execute the update query with the updateParams and whereParams
  // For example:
  // await connection.execute(query, [...updateParams, ...whereParams]);

  // Return the query string for testing purposes
  return query;
};


  module.exports = {
    addNew,
    getDataByWhereCondition,
    updateData
}