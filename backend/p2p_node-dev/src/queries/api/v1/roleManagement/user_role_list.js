const isEmpty = require("is-empty");
let table_name = "XXP2P_SUPPLIER_AGENT_DTLS";
let dbName = process.env.DATABASE_NAME


let getTotalCount = async (data) =>{
    let keys = Object.keys(data);
    let flag = 0;

    let query = `
    SELECT COUNT(*) AS TOTAL_ROWS
    FROM XXP2P.XXP2P_USER us
    LEFT JOIN XXP2P.XXP2P_USER_ROLES ur ON us.USER_ID = ur.USER_ID
    LEFT JOIN XXP2P.XXP2P_ROLE_MASTER rm ON rm.ROLE_ID = ur.ROLE_ID
    WHERE UPPER(us.FULL_NAME) LIKE '%' || UPPER(NVL(:SEARCH_VALUE, '')) || '%'
      OR us.USER_ID LIKE '%' || NVL(:SEARCH_VALUE, '') || '%'
      OR UPPER(us.USER_TYPE) LIKE '%' || UPPER(NVL(:SEARCH_VALUE, '')) || '%'
      AND APPROVAL_STATUS = 'APPROVED'
              AND USER_ACTIVE_STATUS = 1
              AND IS_NEW_USER =0
  `;
};

module.exports = {
    getTotalCount
}