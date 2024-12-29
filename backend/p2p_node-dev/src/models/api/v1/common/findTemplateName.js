const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/common/findTemplateName");
const oracledb = require("oracledb");

let templateName = async (STAGE_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.templateName();
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

module.exports = {
  templateName,
};
