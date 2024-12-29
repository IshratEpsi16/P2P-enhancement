const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/common/currencyList");
const oracledb = require("oracledb");

let currencyList = async (BANK_PARTY_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.currencyList();
    let result = await connectionP2pORACLE.execute(query);

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let currencyNameById = async (CURRENCY_CODE) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.currencyNameById(CURRENCY_CODE);
    let result = await connectionP2pORACLE.execute(query, {
      CURRENCY_CODE: CURRENCY_CODE,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

module.exports = {
  currencyList,
  currencyNameById,
};
