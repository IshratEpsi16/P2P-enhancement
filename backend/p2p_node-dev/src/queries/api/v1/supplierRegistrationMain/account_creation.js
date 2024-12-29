const isEmpty = require("is-empty");
let rfq_header_table_name = "XXP2P_RFQ_HEADER";
let rfq_lines_table_name = "XXP2P_RFQ_LINES_ALL";
let rfq_supplier_invite_table_name = "XXP2P_RFQ_SUPPLIER_INVITATION";
let dbName = process.env.DATABASE_NAME;



let accountCreation = async (data = {}) => {
    // let keys = Object.keys(data);
  
    // let query = `insert into ${dbName}.XXP2P_USER (` + keys[0];
    // let valueString = " ( :1";
  
    // for (let i = 1; i < keys.length; i++) {
    //   query += `, ` + keys[i];
    //   valueString += `, :${i + 1}`;
    // }
  
    // query =
    //   query +
    //   `) VALUES ` +
    //   valueString +
    //   `)`;
    // //console.log(query);
    // return query;

    let keys = Object.keys(data);

    let query = `insert into ${dbName}.XXP2P_USER (` + keys[0];
    let valueString = " ( :1";
  
    for (let i = 1; i < keys.length; i++) {
      query += `, ` + keys[i];
      valueString += `, :${i + 1}`;
    }
  
    query = query + `) VALUES ` + valueString + `)`;
    //console.log(query);
    return query;
  };

  let checkEmail = async (EMAIL_ADDRESS) => {
  
    let query = `select EMAIL_ADDRESS from xxp2p.xxp2p_user where email_address = :EMAIL_ADDRESS`;
    console.log(query);
    return query;
  };

  let checkMobile = async (MOBILE_NUMBER) => {
  
    let query = `select MOBILE_NUMBER from xxp2p.xxp2p_user where MOBILE_NUMBER = :MOBILE_NUMBER`;
    console.log(query);
    return query;
  };

module.exports = {
    accountCreation,
    checkEmail,
    checkMobile
  };
  