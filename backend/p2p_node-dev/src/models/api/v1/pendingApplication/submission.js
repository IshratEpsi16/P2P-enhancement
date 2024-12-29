const {
  getPool,
  getGeneral,
} = require("./../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/pendingApplication/submission");

const oracledb = require("oracledb");

let approveRejectSubmissionHistory = async (
  APPROVER_ID,
  ACTION_CODE,
  USER_ID,
  STAGE_ID,
  NOTE,
  STAGE_LEVEL
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.approveRejectSubmissionHistory();
    let result = await connectionP2pORACLE.execute(query, {
      APPROVER_ID: APPROVER_ID,
      ACTION_CODE: ACTION_CODE,
      USER_ID: USER_ID,
      STAGE_ID: STAGE_ID,
      NOTE: NOTE,
      STAGE_LEVEL: STAGE_LEVEL,
      MESSAGE: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
      STATUS: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      ID: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};
let approveRejectSubmissionUserTableForUpdate = async (
  USER_ID,
  STAGE_ID,
  STAGE_LEVEL,
  SUBMISSION_STATUS,
  APPROVAL_STATUS
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.approveRejectSubmissionUserTableForUpdate();
    let result = await connectionP2pORACLE.execute(query, {
      USER_ID: USER_ID,
      STAGE_ID: STAGE_ID,
      STAGE_LEVEL: STAGE_LEVEL,
      SUBMISSION_STATUS: SUBMISSION_STATUS,
      APPROVAL_STATUS: APPROVAL_STATUS,
      MESSAGE: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
      STATUS: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};
let approveRejectSubmissionUserTableForReg = async (
  USER_ID,
  STAGE_ID,
  STAGE_LEVEL,
  SUBMISSION_STATUS,
  APPROVAL_STATUS,
  IS_REG_COMPLETE
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.approveRejectSubmissionUserTableForReg(
      USER_ID,
      STAGE_ID,
      STAGE_LEVEL,
      SUBMISSION_STATUS,
      APPROVAL_STATUS,
      IS_REG_COMPLETE
    );
    let result = await connectionP2pORACLE.execute(query, {
      USER_ID: USER_ID,
      STAGE_ID: STAGE_ID,
      STAGE_LEVEL: STAGE_LEVEL,
      SUBMISSION_STATUS: SUBMISSION_STATUS,
      APPROVAL_STATUS: APPROVAL_STATUS,
      IS_REG_COMPLETE: IS_REG_COMPLETE,
      MESSAGE: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
      STATUS: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let updateNextLevelUserTableForReg = async (
  USER_ID,
  STAGE_ID,
  STAGE_LEVEL,
  NEXT_LEVEL,
  IS_REG_COMPLETE,
  APPROVAL_STATUS,
  SUBMISSION_STATUS
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.updateNextLevelUserTableForReg();
    let result = await connectionP2pORACLE.execute(query, {
      USER_ID: USER_ID,
      STAGE_ID: STAGE_ID,
      STAGE_LEVEL: STAGE_LEVEL,
      NEXT_LEVEL: NEXT_LEVEL,
      IS_REG_COMPLETE: IS_REG_COMPLETE,
      APPROVAL_STATUS: APPROVAL_STATUS,
      SUBMISSION_STATUS: SUBMISSION_STATUS,
      MESSAGE: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
      STATUS: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};
let approveRejectSubmissionLogTable = async (
  ACTION_ID,
  STAGE_ID,
  STAGE_LEVEL,
  APPROVER_STATUS
) => {
  let connectionP2pORACLE = await getPool();

  try {
    console.log(ACTION_ID);
    console.log(STAGE_ID);
    console.log(STAGE_LEVEL);
    console.log(APPROVER_STATUS);
    let query = await queries.approveRejectSubmissionLogTable(
      ACTION_ID,
      STAGE_ID,
      STAGE_LEVEL,
      APPROVER_STATUS
    );
    let result = await connectionP2pORACLE.execute(query, {
      ACTION_ID: ACTION_ID,
      STAGE_ID: STAGE_ID,
      STAGE_LEVEL: STAGE_LEVEL,
      APPROVER_STATUS: APPROVER_STATUS,
      MESSAGE: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
      STATUS: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let approveRejectSubmissionCheckExist = async (
  SUPPLIER_ID,
  STAGE_ID,
  STAGE_LEVEL,
  APPROVER_ID
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.approveRejectSubmissionCheckExist();
    let result = await connectionP2pORACLE.execute(query, {
      SUPPLIER_ID: SUPPLIER_ID,
      STAGE_ID: STAGE_ID,
      STAGE_LEVEL: STAGE_LEVEL,
      APPROVER_ID: APPROVER_ID,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let supplierSyncProcess = async () => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.supplierSyncProcess();
    let result = await connectionP2pORACLE.execute(query,{
      MESSAGE: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let getSupplierInfo = async (USER_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.getSupplierInfo();
    let result = await connectionP2pORACLE.execute(query,{
      USER_ID:USER_ID,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

module.exports = {
  approveRejectSubmissionHistory,
  approveRejectSubmissionUserTableForReg,
  approveRejectSubmissionLogTable,
  approveRejectSubmissionUserTableForUpdate,
  approveRejectSubmissionCheckExist,
  updateNextLevelUserTableForReg,
  supplierSyncProcess,
  getSupplierInfo
};
