const {
    getPool,
    getGeneral,
  } = require("../../../../connections/api/v1/connection");
  const queries = require("../../../../queries/api/v1/roleManagement/menu_n_permissions");
  const oracledb = require("oracledb");
  
  let allPermissions = async () => {
    let connectionP2pORACLE = await getPool();
  
    try {
      let query = await queries.allPermissions();
      let result = await connectionP2pORACLE.execute(query);
  
      await connectionP2pORACLE.close();
      return result;
    } catch (error) {
      await connectionP2pORACLE.close();
      return;
    }
  };
  
  let allMenu = async () => {
    let connectionP2pORACLE = await getPool();
    try {
      let query = await queries.allMenu();
      let result = await connectionP2pORACLE.execute(query);
  
      await connectionP2pORACLE.close();
      return result;
    } catch (error) {
      await connectionP2pORACLE.close();
      return;
    }
  };
  
  
  module.exports = {
    allPermissions,
    allMenu,
  };
  