const isEmpty = require("is-empty");
let rfq_header_table_name = "TEST_XXP2P_RFQ_HEADER";
let rfq_lines_table_name = "TEST_XXP2P_RFQ_LINES_ALL";
let rfq_supplier_invite_table_name = "TEST_XXP2P_RFQ_SUPPLIER_INVITATION";
let dbName = process.env.DATABASE_NAME;

let ouListByID = async (ORG_ID) => {
    
    // Construct the query string with bind variables
    let query = 
    `SELECT 
     HOU.ORGANIZATION_ID,
     HOU.SHORT_CODE,
     HOU.NAME
 FROM 
     HR_OPERATING_UNITS HOU
 WHERE HOU.ORGANIZATION_ID = '${ORG_ID}'
 ORDER BY 
     HOU.ORGANIZATION_ID`;
     ;
    console.log(query);
    return query;
  };


  let leDetailsByOrgID = async (ORG_ID) => {
    
    // Construct the query string with bind variables
    let query = 
     `select 
   XX_P2P_PKG.GET_LEGAL_ENTITY_FROM_ORG_ID(${ORG_ID}) as LE_NAME,
    XX_P2P_PKG.GET_LEGAL_ENTITY_ADDRESS_FROM_ORG_ID(${ORG_ID}) as LE_ADDRESS,
    XX_P2P_PKG.GET_LEGAL_ENTITY_BIN_FROM_ORG_ID(${ORG_ID}) as LE_BIN
    from dual`;
    return query;
  };


  module.exports = {
    ouListByID,
    leDetailsByOrgID
  };
  