const isEmpty = require("is-empty");
let user_table_name = "XXP2P_USER";
let dbName = process.env.DATABASE_NAME;


let updatePassword = async (updateData, whereData) => {
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
    let query = `UPDATE ${dbName}.${user_table_name} ${updateClause} ${whereClause}`;
  
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
    updatePassword
}