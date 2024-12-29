const {
  getPool,
  getGeneral,
} = require("../../../../../connections/api/v1/connection");
const queries = require("../../../../../queries/api/v1/pr2po/pr/prFromEBS");
const oracledb = require("oracledb");

let prFromEBSList = async (
  BUYER_ID,
  ORG_ID,
  PR_NUMBER,
  ITEM_NAME,
  DATE_FROM,
  DATE_TO,
  REQUESTOR_NAME,
  BUYER_NAME,
  OFFSET,
  LIMIT
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.prFromEBSList(
      BUYER_ID,
      ORG_ID,
      PR_NUMBER,
      ITEM_NAME,
      DATE_FROM,
      DATE_TO,
      REQUESTOR_NAME,
      BUYER_NAME,
      OFFSET,
      LIMIT
    );
    let result = await connectionP2pORACLE.execute(query, {
      BUYER_ID: BUYER_ID,
      ORG_ID: ORG_ID,
      PR_NUMBER: PR_NUMBER,
      ITEM_NAME: ITEM_NAME,
      DATE_FROM: DATE_FROM,
      DATE_TO: DATE_TO,
      REQUESTOR_NAME: REQUESTOR_NAME,
      BUYER_NAME: BUYER_NAME,
      OFFSET: OFFSET,
      LIMIT: LIMIT,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let prFromEBSTotal = async (
  BUYER_ID,
  ORG_ID,
  PR_NUMBER,
  ITEM_NAME,
  DATE_FROM,
  DATE_TO,
  REQUESTOR_NAME,
  BUYER_NAME
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.prFromEBSTotal(
      BUYER_ID,
      ORG_ID,
      PR_NUMBER,
      ITEM_NAME,
      DATE_FROM,
      DATE_TO,
      REQUESTOR_NAME,
      BUYER_NAME
    );
    let result = await connectionP2pORACLE.execute(query, {
      BUYER_ID: BUYER_ID,
      ORG_ID: ORG_ID,
      PR_NUMBER: PR_NUMBER,
      ITEM_NAME: ITEM_NAME,
      DATE_FROM: DATE_FROM,
      DATE_TO: DATE_TO,
      REQUESTOR_NAME: REQUESTOR_NAME,
      BUYER_NAME: BUYER_NAME,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let locationNameById = async (whereData) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.locationNameById(whereData);
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query, whereData);

    // Close the connection
    await connectionP2pORACLE.close();

    // Return the query result
    return result;
  } catch (error) {
    // Handle errors
    console.error("Error in locationNameById:", error);

    // Close the connection
    await connectionP2pORACLE.close();

    // Return an error or rethrow the error for handling elsewhere
    throw error;
  }
};

module.exports = {
  prFromEBSList,
  prFromEBSTotal,
  locationNameById,
};
