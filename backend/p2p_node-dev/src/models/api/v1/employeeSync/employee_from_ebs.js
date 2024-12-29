const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/employeeSync/employee_from_ebs");
const oracledb = require("oracledb");

let empSyncTotalCount = async (SEARCH_FIELD) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.empSyncTotalCount(SEARCH_FIELD);
    let result = await connectionP2pORACLE.execute(query, {
      SEARCH_FIELD: SEARCH_FIELD,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    console.log('error: ',error);
    await connectionP2pORACLE.close();
    return;
  }
};

let empList = async (SEARCH_FIELD, P_OFFSET, P_LIMIT) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.empList();
    let result = await connectionP2pORACLE.execute(query, {
      SEARCH_FIELD: SEARCH_FIELD,
      P_OFFSET: P_OFFSET,
      P_LIMIT: P_LIMIT,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    console.log('error: ',error);
    await connectionP2pORACLE.close();
    return;
  }
};

module.exports = {
  empSyncTotalCount,
  empList,
};
