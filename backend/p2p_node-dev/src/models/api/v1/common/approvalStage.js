const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/common/approvalStage");
const oracledb = require("oracledb");

let approvalStageList = async () => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.approvalStageList();
    let result = await connectionP2pORACLE.execute(query);

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let approvalStageUpdate = async (AS_ID, SUPPLIER_ID) => {
  let connectionP2pORACLE = await getPool();
  try {
    let query = await queries.approvalStageUpdate(AS_ID, SUPPLIER_ID);
    let result = await connectionP2pORACLE.execute(
      query,
      {
        AS_ID: AS_ID,
        SUPPLIER_ID: SUPPLIER_ID,
      },
      {
        autoCommit: true,
      }
    );

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

module.exports = {
  approvalStageList,
  approvalStageUpdate,
};
