const {
    getPool,
    getGeneral,
  } = require("../../../../connections/api/v1/connection");
  const queries = require("../../../../queries/api/v1/common/supplierSyncFromEBS");
  const oracledb = require("oracledb");
  
  let supplierSync = async (ID) => {
    let connectionP2pORACLE = await getPool();
  
    try {
      let query = await queries.supplierSync(ID);
  
      let result = await connectionP2pORACLE.execute(query);
  
      await connectionP2pORACLE.close();
      return result;
    } catch (error) {
      await connectionP2pORACLE.close();
      return;
    }
  };

  module.exports = {
    supplierSync,
  };
  