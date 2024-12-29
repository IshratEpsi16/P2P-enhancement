const {
    getPool,
    getGeneral,
  } = require("../../../../connections/api/v1/connection");
  const queries = require("../../../../queries/api/v1/common/approveHistoryByModule");
  const oracledb = require("oracledb");
  
  let historyByModule = async (data) => {
    let connectionP2pORACLE = await getPool();
  
    try {
      let query = await queries.historyByModule(data);
      let result = await connectionP2pORACLE.execute(query);
  
      await connectionP2pORACLE.close();
      return result;
    } catch (error) {
      await connectionP2pORACLE.close();
      return;
    }
  };
  
 
  
  module.exports = {
    historyByModule
  };
  