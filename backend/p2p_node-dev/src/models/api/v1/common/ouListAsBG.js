const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/common/ouListAsBG");
const oracledb = require("oracledb");

let ouList = async (whereData) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.ouList(whereData);
    let result = await connectionP2pORACLE.execute(query, whereData);

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

module.exports = {
    ouList,
};
