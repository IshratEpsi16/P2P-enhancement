const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/supplierProfileUpdate/profile_update_submit");
const oracledb = require("oracledb");

let submitUpdate = async (
  APPROVER_STATUS, ACTION_TAKEN_BY
) => {
  let connectionP2pORACLE = await getPool();

  try {
    console.log(ACTION_TAKEN_BY);
    let query = await queries.submitUpdate(APPROVER_STATUS, ACTION_TAKEN_BY);
    let result = await connectionP2pORACLE.execute(query, {
      APPROVER_STATUS: APPROVER_STATUS,
      ACTION_TAKEN_BY: ACTION_TAKEN_BY,
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
  submitUpdate,
};
