const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/pendingApplication/pendingNewInfo");
const oracledb = require("oracledb");

let pendingProfileNewInfoAdd = async (
  APPROVER_ID,
  APPROVAL_STATUS,
  SEARCH_VALUE
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.pendingProfileNewInfoAdd();
    let result = await connectionP2pORACLE.execute(query, {
      APPROVER_ID: APPROVER_ID,
      APPROVAL_STATUS: APPROVAL_STATUS,
      SEARCH_VALUE: SEARCH_VALUE,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};
let pendingProfileNewInfoAddTotal = async (
  APPROVER_ID,
  APPROVAL_STATUS,
  SEARCH_VALUE
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.pendingProfileNewInfoAddTotal();
    let result = await connectionP2pORACLE.execute(query, {
      APPROVER_ID: APPROVER_ID,
      APPROVAL_STATUS: APPROVAL_STATUS,
      SEARCH_VALUE: SEARCH_VALUE,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let pendingProfileNewInfoAddInitiator = async (
  APPROVER_ID,
  APPROVAL_STATUS,
  SEARCH_VALUE
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.pendingProfileNewInfoAddInitiator();
    let result = await connectionP2pORACLE.execute(query, {
      APPROVER_ID: APPROVER_ID,
      APPROVAL_STATUS: APPROVAL_STATUS,
      SEARCH_VALUE: SEARCH_VALUE,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};
let pendingProfileNewInfoAddTotalInitiator = async (
  APPROVER_ID,
  APPROVAL_STATUS,
  SEARCH_VALUE
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.pendingProfileNewInfoAddTotalInitiator();
    let result = await connectionP2pORACLE.execute(query, {
      APPROVER_ID: APPROVER_ID,
      APPROVAL_STATUS: APPROVAL_STATUS,
      SEARCH_VALUE: SEARCH_VALUE,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let pendingProfileNewInfoAddDetails = async (SUPPLIER_ID, APPROVER_STATUS) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.pendingProfileNewInfoAddDetails(SUPPLIER_ID, APPROVER_STATUS);
    let result = await connectionP2pORACLE.execute(query);

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let tableDetails = async (SUPPLIER_ID,TABLE_NAME,ID,STATUS) => {
    let connectionP2pORACLE = await getPool();
  
    try {
      let query = await queries.tableDetails(SUPPLIER_ID,TABLE_NAME,ID,STATUS);
      let result = await connectionP2pORACLE.execute(query);
  
      await connectionP2pORACLE.close();
      return result;
    } catch (error) {
      await connectionP2pORACLE.close();
      return;
    }
  };

module.exports = {
  pendingProfileNewInfoAdd,
  pendingProfileNewInfoAddTotal,
  pendingProfileNewInfoAddDetails,
  tableDetails,
  pendingProfileNewInfoAddTotalInitiator,
  pendingProfileNewInfoAddInitiator,
};
