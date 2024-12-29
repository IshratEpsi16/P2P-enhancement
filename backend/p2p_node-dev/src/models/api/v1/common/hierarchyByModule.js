const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/common/hierarchyByModule");
const oracledb = require("oracledb");

let approverList = async (SUPPLIER_ID, MODULE_NAME) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.approverList();
    let result = await connectionP2pORACLE.execute(query, {
      SUPPLIER_ID: SUPPLIER_ID,
      MODULE_NAME: MODULE_NAME,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let invoiceApproverList = async (SUPPLIER_ID, MODULE_NAME, INV_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.invoiceApproverList(
      SUPPLIER_ID,
      MODULE_NAME,
      INV_ID,
    );
    let result = await connectionP2pORACLE.execute(query, {
      SUPPLIER_ID: SUPPLIER_ID,
      MODULE_NAME: MODULE_NAME,
      INV_ID: INV_ID
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let approverListCS = async (MODULE_NAME, OBJECT_ID, OBJECT_TYPE_CODE) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.approverListCS();
    let result = await connectionP2pORACLE.execute(query, {
      MODULE_NAME: MODULE_NAME,
      OBJECT_ID: OBJECT_ID,
      OBJECT_TYPE_CODE: OBJECT_TYPE_CODE,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let approverListProfileUpdate = async (
  SUPPLIER_ID,
  MODULE_NAME,
  PROFILE_UPDATE_UID
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.approverListProfileUpdate();
    let result = await connectionP2pORACLE.execute(query, {
      SUPPLIER_ID: SUPPLIER_ID,
      MODULE_NAME: MODULE_NAME,
      PROFILE_UPDATE_UID: PROFILE_UPDATE_UID,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let approverListProfileNewInfo = async (
  SUPPLIER_ID,
  MODULE_NAME,
  PROFILE_NEW_INFO_UID
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.approverListProfileNewInfo();
    let result = await connectionP2pORACLE.execute(query, {
      SUPPLIER_ID: SUPPLIER_ID,
      MODULE_NAME: MODULE_NAME,
      PROFILE_NEW_INFO_UID: PROFILE_NEW_INFO_UID,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

module.exports = {
  approverList,
  approverListCS,
  approverListProfileUpdate,
  approverListProfileNewInfo,
  invoiceApproverList
};
