const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/supplierSiteOUManage/add");
const oracledb = require("oracledb");


let addNew = async (info) => {

    let connectionP2pORACLE = await getPool();

    try {

        let keys = Object.keys(info);
        let queryValue = [];

        for (let i = 0; i < keys.length; i++) { queryValue.push(info[keys[i]]); }

        let query = await queries.addNew(info);
        let result = await connectionP2pORACLE.execute(query, queryValue, { autoCommit: true });
        await connectionP2pORACLE.close();
        return result;


    } catch (error) {
        await connectionP2pORACLE.close();
        return;
    }
}

let history = async (P_OFFSET, P_LIMIT) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.history();
    let result = await connectionP2pORACLE.execute(query, {
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

module.exports = {
  addNew,
  history,
};
