const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/approvalTemplate/stageApproverAddUpdate");
const oracledb = require("oracledb");

let approvalModuleList = async () => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.approvalModuleList();
    let result = await connectionP2pORACLE.execute(query);

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let stageApproverAdd = async (
  STAGE_ID,
  EMPLOYEE_ID,
  STAGE_LEVEL,
  STAGE_SEQ,
  IS_MUST_APPROVE,
  STATUS
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.stageApproverAdd();
    let result = await connectionP2pORACLE.execute(query, {
      STAGE_ID: STAGE_ID,
      EMPLOYEE_ID: EMPLOYEE_ID,
      STAGE_LEVEL: STAGE_LEVEL,
      STAGE_SEQ: STAGE_SEQ,
      IS_MUST_APPROVE: IS_MUST_APPROVE,
      STATUS: STATUS,
      MESSAGE: { dir: oracledb.BIND_OUT, type: oracledb.MESSAGE },
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

let stageApproverUpdate = async (
  ID,
  STAGE_ID,
  EMPLOYEE_ID,
  STAGE_LEVEL,
  STAGE_SEQ,
  IS_MUST_APPROVE,
  STATUS
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.stageApproverUpdate();
    let result = await connectionP2pORACLE.execute(query, {
      ID: ID,
      STAGE_ID: STAGE_ID,
      EMPLOYEE_ID: EMPLOYEE_ID,
      STAGE_LEVEL: STAGE_LEVEL,
      STAGE_SEQ: STAGE_SEQ,
      IS_MUST_APPROVE: IS_MUST_APPROVE,
      STATUS: STATUS,
      MESSAGE: { dir: oracledb.BIND_OUT, type: oracledb.MESSAGE },
      STATUS: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let approverList = async (STAGE_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.approverList();
    let result = await connectionP2pORACLE.execute(query, {
      STAGE_ID: STAGE_ID,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};
let approverDelete = async (ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.approverDelete();
    let result = await connectionP2pORACLE.execute(query, {
      MESSAGE: { dir: oracledb.BIND_OUT, type: oracledb.MESSAGE },
      STATUS: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      ID: ID,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let templateDelete = async (TEMPLATE_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.templateDelete();
    let result = await connectionP2pORACLE.execute(query, {
      MESSAGE: { dir: oracledb.BIND_OUT, type: oracledb.MESSAGE },
      STATUS: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      TEMPLATE_ID: TEMPLATE_ID,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

module.exports = {
  stageApproverAdd,
  approverList,
  templateDelete,
  stageApproverUpdate,
  approverDelete,
};
