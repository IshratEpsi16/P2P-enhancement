const isEmpty = require("is-empty");
let table_name = "XXP2P_SUPPLIER_AGENT_DTLS";
let dbName = process.env.DATABASE_NAME



let getRoles = async () =>{
    let query = `select ROLE_ID,ROLE_NAME,CREATED_BY,CREATION_DATE,LAST_UPDATED_BY, to_char(LAST_UPDATE_DATE,'DD-MM-YYYY') as LAST_UPDATE_DATE from xxp2p.xxp2p_role_master`;
    return query;
};

module.exports = {
    getRoles
}