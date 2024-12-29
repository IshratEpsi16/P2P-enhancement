const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/pendingApplication/pendingProfileUpdate");
const oracledb = require("oracledb");

let pendingProfileUpdate = async (APPROVER_ID, APPROVAL_STATUS,SEARCH_VALUE) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.pendingProfileUpdate();
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
let pendingProfileUpdateTotal = async (APPROVER_ID, APPROVAL_STATUS,SEARCH_VALUE) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.pendingProfileUpdateTotal();
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

let pendingProfileUpdateDetails = async (
  STAGE_ID,
  STAGE_LEVEL,
  SUPPLIER_ID,
  APPROVER_STATUS
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.pendingProfileUpdateDetails();
    let result = await connectionP2pORACLE.execute(query, {
      STAGE_ID: STAGE_ID,
      STAGE_LEVEL: STAGE_LEVEL,
      SUPPLIER_ID:SUPPLIER_ID,
      APPROVER_STATUS:APPROVER_STATUS
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let pendingProfileNewInfoAdd = async (APPROVER_ID, APPROVAL_STATUS,SEARCH_VALUE) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.pendingProfileNewInfoAdd();
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
let pendingProfileNewInfoAddTotal = async (APPROVER_ID, APPROVAL_STATUS,SEARCH_VALUE) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.pendingProfileNewInfoAddTotal();
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

let pendingProfileNewInfoAddDetails = async (
  STAGE_ID,
  STAGE_LEVEL,
  SUPPLIER_ID,
  APPROVER_STATUS
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.pendingProfileNewInfoAddDetails();
    let result = await connectionP2pORACLE.execute(query, {
      STAGE_ID: STAGE_ID,
      STAGE_LEVEL: STAGE_LEVEL,
      SUPPLIER_ID:SUPPLIER_ID,
      APPROVER_STATUS:APPROVER_STATUS
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let pendingProfileUpdateInitiator = async (APPROVER_ID, APPROVAL_STATUS,SEARCH_VALUE) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.pendingProfileUpdateInitiator();
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
let pendingProfileUpdateTotalInitiator = async (APPROVER_ID, APPROVAL_STATUS,SEARCH_VALUE) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.pendingProfileUpdateTotalInitiator();
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

let approveReject = async (
  ACTION_ID,
  ACTION_CODE,
  SUPPLIER_ID,
  APPROVER_ID,
  MODULE_NAME,
  STAGE_LEVEL,
  STAGE_ID,
  NOTE,
  IS_INITIATOR,
  PROFILE_UPDATE_UID
  
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.approveReject(
      ACTION_ID,
      ACTION_CODE,
      SUPPLIER_ID,
      APPROVER_ID,
      MODULE_NAME,
      STAGE_LEVEL,
      STAGE_ID,
      NOTE,
      IS_INITIATOR,
      PROFILE_UPDATE_UID
      
    );
    let result = await connectionP2pORACLE.execute(query, {
      ACTION_ID,
      ACTION_CODE: ACTION_CODE,
      SUPPLIER_ID: SUPPLIER_ID,
      APPROVER_ID: APPROVER_ID,
      MODULE_NAME: MODULE_NAME,
      STAGE_LEVEL: STAGE_LEVEL,
      STAGE_ID: STAGE_ID,
      NOTE: NOTE,
      IS_INITIATOR: IS_INITIATOR,
      PROFILE_UPDATE_UID,
      
      MESSAGE: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 4000,
      },
      STATUS: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 10 },
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

module.exports = {
  pendingProfileUpdate,
  pendingProfileUpdateDetails,
  pendingProfileUpdateTotal,
  pendingProfileNewInfoAdd,
  pendingProfileNewInfoAddTotal,
  pendingProfileNewInfoAddDetails,
  approveReject,
  pendingProfileUpdateInitiator,
      pendingProfileUpdateTotalInitiator
};
