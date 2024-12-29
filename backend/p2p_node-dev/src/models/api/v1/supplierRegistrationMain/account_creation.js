const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/supplierRegistrationMain/account_creation");
const oracledb = require("oracledb");

let accountCreation = async (info) => {
  let connectionP2pORACLE = await getPool();
  
    try {
      let keys = Object.keys(info);
      let queryValue = [];
  
      for (let i = 0; i < keys.length; i++) {
        queryValue.push(info[keys[i]]);
      }
  
      let query = await queries.accountCreation(info);
      //console.log(query);
      let result = await connectionP2pORACLE.execute(query, queryValue, {
        autoCommit: true,
      });
      await connectionP2pORACLE.close();
      return result;
    } catch (error) {
      await connectionP2pORACLE.close();
      return;
    }
};

let checkEmail = async (EMAIL_ADDRESS) => {
  let connectionP2pORACLE = await getPool();

  try {
    
    let query = await queries.checkEmail(EMAIL_ADDRESS);
    let result = await connectionP2pORACLE.execute(query, {
      EMAIL_ADDRESS: EMAIL_ADDRESS,
    });
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let checkMobile = async (MOBILE_NUMBER) => {
  let connectionP2pORACLE = await getPool();

  try {
  
    let query = await queries.checkMobile(MOBILE_NUMBER);
    //console.log(query);
    let result = await connectionP2pORACLE.execute(query,{
      MOBILE_NUMBER: MOBILE_NUMBER,
    });
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

module.exports = {
  accountCreation,
  checkEmail,
  checkMobile,
};
