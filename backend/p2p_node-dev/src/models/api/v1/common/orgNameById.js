const {
    getPool,
    getGeneral,
  } = require("../../../../connections/api/v1/connection");
  const queries = require("../../../../queries/api/v1/common/orgNameById");
  const oracledb = require("oracledb");
  
  let ouListByID = async (ORG_ID) => {
    let connectionP2pORACLE = await getPool();
  
    try {
      let query = await queries.ouListByID(ORG_ID);
      let result = await connectionP2pORACLE.execute(query);
  
      await connectionP2pORACLE.close();
      return result;
    } catch (error) {
      await connectionP2pORACLE.close();
      return;
    }
  };

  let leDetailsByOrgID = async (ORG_ID) => {
    let connectionP2pORACLE = await getPool();
  
    try {
      let query = await queries.leDetailsByOrgID(ORG_ID);
      let result = await connectionP2pORACLE.execute(query);
  
      await connectionP2pORACLE.close();
      return result;
    } catch (error) {
      await connectionP2pORACLE.close();
      return;
    }
  };
  
  module.exports = {
    ouListByID,
    leDetailsByOrgID,
  };
  