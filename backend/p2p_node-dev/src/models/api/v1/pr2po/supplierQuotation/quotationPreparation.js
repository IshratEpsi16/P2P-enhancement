const {
    getPool,
    getGeneral,
  } = require("../../../../../connections/api/v1/connection");
  const queries = require("../../../../../queries/api/v1/pr2po/supplierQuotation/quotationPreparation");
  const oracledb = require("oracledb");

let responseUpdate = async (updateData, whereData) => {
    let connectionP2pORACLE = await getPool();
  
    try {
      // Get the query and parameters
      let query = await queries.responseUpdate(updateData, whereData);
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

  let addQuotLineItem = async (info) => {
    let connectionP2pORACLE = await getPool();
  
    try {
      let keys = Object.keys(info);
      let queryValue = [];
  
      for (let i = 0; i < keys.length; i++) {
        queryValue.push(info[keys[i]]);
      }
      queryValue.push({ type: oracledb.NUMBER, dir: oracledb.BIND_OUT });
  
      let query = await queries.addQuotLineItem(info);
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
  let quotationLineItemUpdate = async (updateData, whereData) => {
    let connectionP2pORACLE = await getPool();
  
    try {
      // Get the query and parameters
      let query = await queries.quotationLineItemUpdate(updateData, whereData);
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
    responseUpdate,
    addQuotLineItem,
    quotationLineItemUpdate,
  };