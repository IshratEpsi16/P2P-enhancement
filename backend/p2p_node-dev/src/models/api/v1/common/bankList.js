const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/common/bankList");
const oracledb = require("oracledb");

let bankList = async (COUNTRY_CODE) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.bankList();
    let result = await connectionP2pORACLE.execute(query, {
      COUNTRY_CODE: COUNTRY_CODE,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let branchList = async (BANK_PARTY_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.branchList();
    let result = await connectionP2pORACLE.execute(query, {
      BANK_PARTY_ID: BANK_PARTY_ID,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let bankNameById = async (COUNTRY_CODE, BANK_PARTY_ID) => {
  console.log('query');
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.bankNameById(COUNTRY_CODE, BANK_PARTY_ID);
    console.log(query);
    let result = await connectionP2pORACLE.execute(query);

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let branchNameById = async (BANK_PARTY_ID, BRANCH_PARTY_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.branchNameById(BANK_PARTY_ID, BRANCH_PARTY_ID);
    let result = await connectionP2pORACLE.execute(query);

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

module.exports = {
  bankList,
  branchList,
  bankNameById,
  branchNameById,
};
