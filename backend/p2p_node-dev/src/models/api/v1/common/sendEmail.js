const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/common/sendEmail");
const oracledb = require("oracledb");

let sendEmail = async (EMAIL, NAME, SUBJECT, P_BODY) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.sendEmail();
    let result = await connectionP2pORACLE.execute(query, {
      EMAIL: EMAIL,
      NAME: NAME,
      SUBJECT: SUBJECT,
      P_BODY: P_BODY,
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
  sendEmail,
};
