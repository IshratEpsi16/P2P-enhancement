const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/rfi/add_update");
const oracledb = require("oracledb");

let addRfi = async (
  OBJECT_ID,
  OBJECT_TYPE,
  INITIATOR_ID,
  INITIATOR_NOTE,
  VIEWER_ID
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.addRfi();
    let result = await connectionP2pORACLE.execute(query, {
      OBJECT_ID: OBJECT_ID,
      OBJECT_TYPE: OBJECT_TYPE,
      INITIATOR_ID: INITIATOR_ID,
      INITIATOR_NOTE: INITIATOR_NOTE,
      VIEWER_ID: VIEWER_ID,
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
let updateRfi = async (ID, VIEWER_ID, VIEWER_NOTE, VIEWER_ACTION) => {
  let connectionP2pORACLE = await getPool();
  try {
    let query = await queries.updateRfi();
    let result = await connectionP2pORACLE.execute(query, {
      ID: ID,
      VIEWER_ID: VIEWER_ID,
      VIEWER_NOTE: VIEWER_NOTE,
      VIEWER_ACTION: VIEWER_ACTION,
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

module.exports = {
  addRfi,
  updateRfi,
};
