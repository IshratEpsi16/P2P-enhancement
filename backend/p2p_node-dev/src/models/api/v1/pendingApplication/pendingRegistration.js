const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/pendingApplication/pendingRegistration");
const oracledb = require("oracledb");

let pendingRegistration = async (APPROVER_ID, APPROVAL_STATUS,SEARCH_VALUE) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.pendingRegistration();
    let result = await connectionP2pORACLE.execute(query, {
      APPROVER_ID: APPROVER_ID,
      APPROVAL_STATUS: APPROVAL_STATUS,
      SEARCH_VALUE:SEARCH_VALUE
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let initiatorPendingRegistration = async (APPROVER_ID, APPROVAL_STATUS,SEARCH_VALUE) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.initiatorPendingRegistration();
    let result = await connectionP2pORACLE.execute(query, {
      APPROVER_ID: APPROVER_ID,
      APPROVAL_STATUS: APPROVAL_STATUS,
      SEARCH_VALUE:SEARCH_VALUE
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};
let pendingRegistrationTotal = async (APPROVER_ID, APPROVAL_STATUS,SEARCH_VALUE) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.pendingRegistrationTotal();
    let result = await connectionP2pORACLE.execute(query, {
      APPROVER_ID: APPROVER_ID,
      APPROVAL_STATUS: APPROVAL_STATUS,
      SEARCH_VALUE:SEARCH_VALUE
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let initiatorPendingRegistrationTotal = async (APPROVER_ID, APPROVAL_STATUS,SEARCH_VALUE) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.initiatorPendingRegistrationTotal();
    let result = await connectionP2pORACLE.execute(query, {
      APPROVER_ID: APPROVER_ID,
      APPROVAL_STATUS: APPROVAL_STATUS,
      SEARCH_VALUE:SEARCH_VALUE
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};



module.exports = {
  pendingRegistration,
  pendingRegistrationTotal,
  initiatorPendingRegistration,
  initiatorPendingRegistrationTotal,
};
