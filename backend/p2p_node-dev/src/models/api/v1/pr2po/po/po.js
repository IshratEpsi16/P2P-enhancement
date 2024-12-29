const {
  getPool,
  getGeneral,
} = require("../../../../../connections/api/v1/connection");
const queries = require("../../../../../queries/api/v1/pr2po/po/po");
const oracledb = require("oracledb");

let byWhere = async (data) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.byWhere(data);
    let result = await connectionP2pORACLE.execute(
      query.query,
      query.whereParams
    );
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    console.error("Error executing query:", error);
    throw error;
  }
};

let byWhereTotalCount = async (data) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.byWhereTotalCount(data);
    let result = await connectionP2pORACLE.execute(
      query.query,
      query.whereParams
    );
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    console.error("Error executing query:", error);
    throw error;
  }
};

let detailsByWhere = async (data) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.detailsByWhere(data);
    let result = await connectionP2pORACLE.execute(
      query.query,
      query.whereParams
    );
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    console.error("Error executing query:", error);
    throw error;
  }
};

let detailsByWhereTotalCount = async (data) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.detailsByWhereTotalCount(data);
    let result = await connectionP2pORACLE.execute(
      query.query,
      query.whereParams
    );
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    console.error("Error executing query:", error);
    throw error;
  }
};

let itemDetailsByWhere = async (data) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.itemDetailsByWhere(data);
    let result = await connectionP2pORACLE.execute(
      query.query,
      query.whereParams
    );
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    console.error("Error executing query:", error);
    throw error;
  }
};

let itemDetailsByWhereTotalCount = async (data) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.itemDetailsByWhereTotalCount(data);
    let result = await connectionP2pORACLE.execute(
      query.query,
      query.whereParams
    );
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    console.error("Error executing query:", error);
    throw error;
  }
};

let poUpdate = async (updateData, whereData) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.poUpdate(updateData, whereData);
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

let totalPOAmount = async (PO_HEADER_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.totalPOAmount(PO_HEADER_ID);
    let result = await connectionP2pORACLE.execute(query);
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    console.error("Error executing query:", error);
    throw error;
  }
};
let supplierDetails = async (USER_ID, BUYER_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.supplierDetails(USER_ID, BUYER_ID);
    let result = await connectionP2pORACLE.execute(query);
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    console.error("Error executing query:", error);
    throw error;
  }
};

let poStatusUpdate = async (updateData, whereData) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.poStatusUpdate(updateData, whereData);
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
  byWhere,
  byWhereTotalCount,
  poUpdate,
  detailsByWhereTotalCount,
  detailsByWhere,
  itemDetailsByWhere,
  itemDetailsByWhereTotalCount,
  totalPOAmount,
  poStatusUpdate,
  supplierDetails,
};
