const {
  getPool,
  getGeneral,
} = require("../../../../../connections/api/v1/connection");
const queries = require("../../../../../queries/api/v1/pr2po/supplierQuotation/rfqList");
const oracledb = require("oracledb");

let rfqList = async (
  data
) => {
  let connectionP2pORACLE = await getPool();
  try {
    let query = await queries.rfqList(data);
    let result = await connectionP2pORACLE.execute(query, data);
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let rfqObjectDetails = async (
  data
) => {
  let connectionP2pORACLE = await getPool();
  try {
    let query = await queries.rfqObjectDetails();
console.log(query);
    let result = await connectionP2pORACLE.execute(query, data);
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let rfqTotal = async (data, USER_ID, RFQ_STATUS, RESPONSE_STATUS) => {
  let connectionP2pORACLE = await getPool();
  try {
    let query = await queries.rfqTotal(data);
    let result = await connectionP2pORACLE.execute(query, data);

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

module.exports = {
  rfqList,
  rfqTotal,
  rfqObjectDetails,
};
