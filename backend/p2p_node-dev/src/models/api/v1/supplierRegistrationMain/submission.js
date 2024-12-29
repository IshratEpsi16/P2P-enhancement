const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/supplierRegistrationMain/submission");
const oracledb = require("oracledb");

let submissionUpdate = async (userId, SUBMISSION_STATUS) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.submissionUpdate();
    let result = await connectionP2pORACLE.execute(query, {
      userId: userId,
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

module.exports = {
  submissionUpdate,
};
