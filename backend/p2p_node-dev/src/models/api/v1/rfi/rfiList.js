const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/rfi/rfiList");
const oracledb = require("oracledb");

let rfiList = async (
  VIEWER_ID,
  VIEWER_ACTION,
  INITIATOR_ID,
  OBJECT_ID,
  OBJECT_TYPE
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.rfiList();
    let result = await connectionP2pORACLE.execute(query, {
      VIEWER_ID: VIEWER_ID,
      VIEWER_ACTION: VIEWER_ACTION,
      INITIATOR_ID: INITIATOR_ID,
      OBJECT_ID: OBJECT_ID,
      OBJECT_TYPE: OBJECT_TYPE,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let rfiTotal = async (
  VIEWER_ID,
  VIEWER_ACTION,
  INITIATOR_ID,
  OBJECT_ID,
  OBJECT_TYPE
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.rfiTotal();
    let result = await connectionP2pORACLE.execute(query, {
      VIEWER_ID: VIEWER_ID,
      VIEWER_ACTION: VIEWER_ACTION,
      INITIATOR_ID: INITIATOR_ID,
      OBJECT_ID: OBJECT_ID,

      OBJECT_TYPE: OBJECT_TYPE,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

module.exports = {
  rfiTotal,
  rfiList,
};
