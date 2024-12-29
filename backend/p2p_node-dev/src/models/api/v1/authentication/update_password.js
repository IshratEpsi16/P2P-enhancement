const {
    getPool,
    getGeneral,
  } = require("../../../../connections/api/v1/connection");
  const queries = require("../../../../queries/api/v1/authentication/update_password");
  const oracledb = require("oracledb");

let updatePassword = async (updateData, whereData) => {
    let connectionP2pORACLE = await getPool();
  
    try {
      // Get the query and parameters
      let query = await queries.updatePassword(updateData, whereData);
      // Execute the query with parameters
      let result = await connectionP2pORACLE.execute(query);
      await connectionP2pORACLE.commit();
      // Close the connection
      await connectionP2pORACLE.close();
  
      // Return the query result
      return result;
    } catch (error) {
      // Handle errors
      console.error("Error in rfqHeaderUpdate:", error);
  
      // Close the connection
      await connectionP2pORACLE.close();
  
      // Return an error or rethrow the error for handling elsewhere
      throw error;
    }
  };

  module.exports = {
    updatePassword,
}