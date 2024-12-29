const {
    getPool,
    getGeneral,
  } = require("../../../../connections/api/v1/connection");
  const queries = require("../../../../queries/api/v1/roleManagement/user_active_deactivation");
  const oracledb = require("oracledb");

let submissionStatusUpdate = async (updateData, whereData) => {
    let connectionP2pORACLE = await getPool();
  
    try {
      // Get the query and parameters
      let query = await queries.submissionStatusUpdate(updateData, whereData);
      // Execute the query with parameters
      let result = await connectionP2pORACLE.execute(query);
      await connectionP2pORACLE.commit();
      // Close the connection
      await connectionP2pORACLE.close();
  
      // Return the query result
      return result;
    } catch (error) {
      // Handle errors
      console.error("Error in rfqAllList:", error);
  
      // Close the connection
      await connectionP2pORACLE.close();
  
      // Return an error or rethrow the error for handling elsewhere
      throw error;
    }
  };

  module.exports = {
    submissionStatusUpdate,
  };