
let submissionStatusUpdate = async (updateData, whereData) => {
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
    let query = `UPDATE xxp2p.xxp2p_user ${updateClause} ${whereClause}`;
  
    console.log(query);
    console.log("Update Params:", updateParams);
    console.log("Where Params:", whereParams);
  
    // Return the query string for testing purposes
    return query;
  };

  module.exports = {
    submissionStatusUpdate,
  };