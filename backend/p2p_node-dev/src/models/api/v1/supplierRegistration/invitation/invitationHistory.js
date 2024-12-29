const {
  getPool,
  getGeneral,
} = require("../../../../../connections/api/v1/connection");
const queries = require("../../../../../queries/api/v1/supplierRegistration/invitation/invitationHistory");
const oracledb = require("oracledb");

let invitationHistory = async (DATE_FROM, DATE_TO, P_OFFSET, P_LIMIT) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.invitationHistory();
    let result = await connectionP2pORACLE.execute(query, {
      DATE_FROM: DATE_FROM,
      DATE_TO: DATE_TO,
      P_OFFSET: P_OFFSET,
      P_LIMIT: P_LIMIT,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let invitationHistoryTotal = async (DATE_FROM, DATE_TO) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.invitationHistoryTotal();
    let result = await connectionP2pORACLE.execute(query, {
      DATE_FROM: DATE_FROM,
      DATE_TO: DATE_TO
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

module.exports = {
  invitationHistory,
  invitationHistoryTotal,
};
