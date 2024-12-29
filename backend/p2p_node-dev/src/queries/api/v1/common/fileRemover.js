const isEmpty = require("is-empty");
let dbName = process.env.DATABASE_NAME;

let fileRemover = async (data) => {
  console.log(data);
    // Construct the query string with bind variables
    let query = `update ${dbName}.${data.TABLE_NAME} 
    set ${data.COLUMN_NAME} = null, 
    ${data.ORG_COLUMN_NAME} = null, 
    LAST_UPDATED_BY = ${data.USER_ID}
    where USER_ID = ${data.USER_ID}`;
    
    console.log(query);
    return query;
  };


  module.exports = {
    fileRemover
  };
  