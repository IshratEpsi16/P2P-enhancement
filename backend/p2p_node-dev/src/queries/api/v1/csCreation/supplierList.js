const isEmpty = require("is-empty");
let rfq_header_table_name = "XXP2P_RFQ_HEADER";
let rfq_lines_table_name = "XXP2P_RFQ_LINES_ALL";
let rfq_supp_quot_table_name = "XXP2P_RFQ_SUPPLIER_QUOTATION";
let rfq_supplier_invite_table_name = "XXP2P_RFQ_SUPPLIER_INVITATION";
let dbName = process.env.DATABASE_NAME;

let supplierList = async (RFQ_ID, RFQ_LINE_ID,ORG_ID, offset, limit) => {
  // Create an array of placeholders for RFQ_LINE_ID
  let rfqLineIdPlaceholders = RFQ_LINE_ID.map((id, index) => `${id}`).join(",");

  // Construct the query string with join and bind variables
  let query = 
  `SELECT DISTINCT 
      US.USER_ID,
      US.SUPPLIER_ID,
      US.VENDOR_ID, 
      SOU.VENDOR_SITE_ID,
      BSC.ORGANIZATION_NAME 
      from
      XXP2P.XXP2P_RFQ_SUPPLIER_QUOTATION  SQ, 
      XXP2P.XXP2P_SUPPLIER_BSC_INFO BSC,
      XXP2P.XXP2P_USER US,
      XXP2P.XXP2P_SUPPLIER_SITES_OU SOU,
      XXP2P.XXP2P_RFQ_SUPPLIER_INVITATION INV
      WHERE SQ.RFQ_ID = ${RFQ_ID}
      AND  SQ.RFQ_LINE_ID IN (${rfqLineIdPlaceholders})
      AND SQ.USER_ID = BSC.USER_ID
      AND SQ.USER_ID = US.USER_ID
      AND SOU.USER_ID = US.USER_ID
      AND SOU.ORGANIZATION_ID =  ${ORG_ID}
      AND SOU.ACTIVE_STATUS IN ('ACTIVE','APPROVED')
      AND INV.SITE_ID = SOU.SITE_ID
      AND SOU.VENDOR_SITE_ID is not null 
      OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;
  /*`
      SELECT DISTINCT 
      US.USER_ID,
      US.SUPPLIER_ID,
      BSC.ORGANIZATION_NAME 
      from
      XXP2P.XXP2P_RFQ_SUPPLIER_QUOTATION  SQ, 
      XXP2P.XXP2P_SUPPLIER_BSC_INFO BSC,
      XXP2P.XXP2P_USER US
      WHERE SQ.RFQ_ID = ${RFQ_ID}
      AND  SQ.RFQ_LINE_ID IN (${rfqLineIdPlaceholders})
      AND SQ.USER_ID = BSC.USER_ID
      AND SQ.USER_ID = US.USER_ID
      OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;*/
  // Return the query string and queryParams
  return query;
};

let supplierListTotal = async (RFQ_ID, RFQ_LINE_ID,ORG_ID, offset, limit) => {
  // Create an array of placeholders for RFQ_LINE_ID
  let rfqLineIdPlaceholders = RFQ_LINE_ID.map((id, index) => `${id}`).join(",");
  // Construct the query string with join and bind variables
  let query = `
        SELECT  
        count(DISTINCT US.USER_ID) as TOTAL
        from
        XXP2P.XXP2P_RFQ_SUPPLIER_QUOTATION  SQ, 
        XXP2P.XXP2P_SUPPLIER_BSC_INFO BSC,
        XXP2P.XXP2P_USER US,
        XXP2P.XXP2P_SUPPLIER_SITES_OU SOU
        WHERE SQ.RFQ_ID = ${RFQ_ID}
        AND  SQ.RFQ_LINE_ID IN (${rfqLineIdPlaceholders})
        AND SQ.USER_ID = BSC.USER_ID
        AND SQ.USER_ID = US.USER_ID
        AND SOU.USER_ID = US.USER_ID
      AND SOU.ORGANIZATION_ID =  ${ORG_ID}
      AND SOU.ACTIVE_STATUS = 'ACTIVE'
        OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;

  // Return the query string and queryParams
  return query;
};

let itemListOfSupplier = async (RFQ_ID, RFQ_LINE_ID, SUPPLIER_ID) => {
  console.log(SUPPLIER_ID);
  // Create an array of placeholders for RFQ_LINE_ID
  let rfqLineIdPlaceholders = RFQ_LINE_ID.map((id, index) => `${id}`).join(",");
  // Construct the query string with join and bind variables
  let query = `
    SELECT 
    SQ.*,
    LA.*,
    CA.*,
    (select USER_NAME from xxp2p.xxp2p_user where user_id = ca.RECOMMENDED_BY) as RECOMMENDED_BY_USER_NAME,
(select FULL_NAME from xxp2p.xxp2p_user where user_id = ca.RECOMMENDED_BY) as RECOMMENDED_BY_FULL_NAME,
(select USER_NAME from xxp2p.xxp2p_user where user_id = ca.AWARDED_BY) as AWARDED_BY_USER_NAME,  
(select FULL_NAME from xxp2p.xxp2p_user where user_id = ca.AWARDED_BY) as AWARDED_BY_FULL_NAME,  
CA.AWARDED
    FROM XXP2P.XXP2P_RFQ_LINES_ALL LA
    LEFT JOIN XXP2P.XXP2P_RFQ_SUPPLIER_QUOTATION SQ ON LA.RFQ_LINE_ID = SQ.RFQ_LINE_ID
    AND SQ.LINE_STATUS = 'Y'
    LEFT JOIN XXP2P.XXP2P_CS_LINES_ALL CA ON LA.RFQ_LINE_ID = CA.RFQ_LINE_ID
    AND CA.LINE_STATUS = 'Y'
    AND CA.QUOT_LINE_ID = SQ.QUOT_LINE_ID
    AND CA.RFQ_ID  = SQ.RFQ_ID
    WHERE LA.RFQ_ID = ${RFQ_ID} 
    AND SQ.USER_ID = ${SUPPLIER_ID}
    AND SQ.RFQ_ID = ${RFQ_ID}
    AND SQ.RFQ_LINE_ID IN (${rfqLineIdPlaceholders})
    AND LA.LINE_STATUS = 'Y'
    ORDER BY LA.ITEM_ID
          `;

  // Return the query string and queryParams
  return query;
};

module.exports = {
  supplierList,
  supplierListTotal,
  itemListOfSupplier,
};
