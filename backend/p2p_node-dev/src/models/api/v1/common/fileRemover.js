const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/common/fileRemover");
const oracledb = require("oracledb");

let fileRemover = async (data) => {
  let colName = data.COLUMN_NAME;
  let user_id = data.USER_ID;
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.fileRemover(data);
    let result = await connectionP2pORACLE.execute(query);
    await connectionP2pORACLE.commit();
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

module.exports = {
  fileRemover,
};
