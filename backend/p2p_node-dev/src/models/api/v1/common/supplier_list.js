const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/common/supplier_list");
const oracledb = require("oracledb");

let supplierTotalCount = async (
  USER_ACTIVE_STATUS,
  APPROVAL_STATUS,
  SUBMISSION_STATUS,
  IS_REG_COMPLETE,
  SEARCH_VALUE
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.supplierTotalCount();
    let result = await connectionP2pORACLE.execute(query, {
      USER_ACTIVE_STATUS: USER_ACTIVE_STATUS,
      APPROVAL_STATUS: APPROVAL_STATUS,
      SUBMISSION_STATUS: SUBMISSION_STATUS,
      IS_REG_COMPLETE: IS_REG_COMPLETE,
      SEARCH_VALUE: SEARCH_VALUE,
    });
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let supplierList = async (
  USER_ACTIVE_STATUS,
  APPROVAL_STATUS,
  SUBMISSION_STATUS,
  IS_REG_COMPLETE,
  SEARCH_VALUE,
  OFFSET,
  LIMIT
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.supplierList( USER_ACTIVE_STATUS,
      APPROVAL_STATUS,
      SUBMISSION_STATUS,
      IS_REG_COMPLETE,
      SEARCH_VALUE,
      OFFSET,
      LIMIT);
    let result = await connectionP2pORACLE.execute(query, {
      USER_ACTIVE_STATUS: USER_ACTIVE_STATUS,
      APPROVAL_STATUS: APPROVAL_STATUS,
      SUBMISSION_STATUS: SUBMISSION_STATUS,
      IS_REG_COMPLETE: IS_REG_COMPLETE,
      SEARCH_VALUE: SEARCH_VALUE,
      OFFSET: OFFSET,
      LIMIT: LIMIT,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

module.exports = {
  supplierList,
  supplierTotalCount,
};
