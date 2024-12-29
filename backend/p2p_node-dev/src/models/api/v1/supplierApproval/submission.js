const {
  getPool,
  getGeneral,
} = require("./../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/supplierApproval/submission");

const oracledb = require("oracledb");

let submissionUpdate = async (
  userId,
  SUBMISSION_STATUS,
  APPROVAL_STATUS,
  REG_TEMPLATE_ID,
  REG_TEMPLATE_STAGE_LEVEL,
  PROFILE_UPDATE_TEMPLATE_ID,
  PROFILE_UPDATE_TEMPLATE_STAGE_LEVEL,
  PROFILE_UPDATE_STATUS
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.submissionUpdate();
    let result = await connectionP2pORACLE.execute(query, {
      userId: userId,
      SUBMISSION_STATUS: SUBMISSION_STATUS,
      APPROVAL_STATUS: APPROVAL_STATUS,
      REG_TEMPLATE_ID: REG_TEMPLATE_ID,
      REG_TEMPLATE_STAGE_LEVEL: REG_TEMPLATE_STAGE_LEVEL,
      PROFILE_UPDATE_TEMPLATE_ID: PROFILE_UPDATE_TEMPLATE_ID,
      PROFILE_UPDATE_TEMPLATE_STAGE_LEVEL: PROFILE_UPDATE_TEMPLATE_STAGE_LEVEL,
      PROFILE_UPDATE_STATUS: PROFILE_UPDATE_STATUS,
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
