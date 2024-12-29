const isEmpty = require("is-empty");
let rfq_header_table_name = "TEST_XXP2P_RFQ_HEADER";
let rfq_lines_table_name = "TEST_XXP2P_RFQ_LINES_ALL";
let rfq_supplier_invite_table_name = "TEST_XXP2P_RFQ_SUPPLIER_INVITATION";
let dbName = process.env.DATABASE_NAME;

let ouList = async (whereData) => {
    let USER_ID = whereData.USER_ID;
    
    // Construct the query string with bind variables
    let query = 
    `SELECT 
    HOU.ORGANIZATION_ID,
    HOU.SHORT_CODE,
    HOU.NAME
  FROM 
    XXP2P.XXP2P_USER US,HR_OPERATING_UNITS HOU, GL_PERIOD_STATUSES_V GLPS, GL_LEDGERS GL
   WHERE 1=1
  AND  HOU.BUSINESS_GROUP_ID = US.BUSINESS_GROUP_ID
  AND HOU.SET_OF_BOOKS_ID = GLPS.SET_OF_BOOKS_ID
         AND GL.LEDGER_ID = HOU.SET_OF_BOOKS_ID
         AND HOU.BUSINESS_GROUP_ID = 84
         AND GL.LEDGER_CATEGORY_CODE = 'PRIMARY'
         AND GLPS.SHOW_STATUS = 'Open'
         AND UPPER (GL.NAME) NOT LIKE UPPER ('%TRUST%')
         AND GLPS.APPLICATION_ID = 101
         AND UPPER (GLPS.PERIOD_NAME) = UPPER (TO_CHAR (SYSDATE, 'MON-YY'))
    AND US.USER_ID = :USER_ID
  ORDER BY 
    HOU.ORGANIZATION_ID`;
  //   `SELECT 
  //   HOU.ORGANIZATION_ID,
  //   HOU.SHORT_CODE,
  //   HOU.NAME
  // FROM 
  //   XXP2P.XXP2P_USER US
  // LEFT JOIN 
  //   HR_OPERATING_UNITS HOU 
  // ON 
  //   HOU.BUSINESS_GROUP_ID = US.BUSINESS_GROUP_ID
  // WHERE
  //   US.USER_ID = :USER_ID
  // ORDER BY 
  //   HOU.ORGANIZATION_ID`;
    
    return query;
  };


  module.exports = {
    ouList
  };
  