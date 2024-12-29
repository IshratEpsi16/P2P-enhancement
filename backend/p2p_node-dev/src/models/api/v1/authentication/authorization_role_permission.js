const {
    getPool,
    getGeneral,
  } = require("../../../../connections/api/v1/connection");
  const queries = require("../../../../queries/api/v1/authentication/authorization_role_permission");
  const oracledb = require("oracledb");
  
  let empRoles = async (
    userId
  ) => {
    let connectionP2pORACLE = await getPool();
  
    try {
      let query = await queries.empRoles();
      let result = await connectionP2pORACLE.execute(query, {
        userId: userId,
      });
  
      await connectionP2pORACLE.close();
      return result;
    } catch (error) {
      await connectionP2pORACLE.close();
      return;
    }
  };

  let empRolePermissions = async (
    userId
  ) => {
    let connectionP2pORACLE = await getPool();
  
    try {
      let query = await queries.empRolePermissions();
      let result = await connectionP2pORACLE.execute(query, {
        userId: userId,
      });
  
      await connectionP2pORACLE.close();
      return result;
    } catch (error) {
      await connectionP2pORACLE.close();
      return;
    }
  };
  
  module.exports = {
    empRoles,
    empRolePermissions
  };
  