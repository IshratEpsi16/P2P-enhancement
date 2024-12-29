const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/common/paymentMethodList");
const oracledb = require("oracledb");

let paymentMethodList = async () => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.paymentMethodList();
    let result = await connectionP2pORACLE.execute(query);

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let addPaymentMethod = async (userId, SUPPLIER_ID, CODE) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.addPaymentMethod();
    let result = await connectionP2pORACLE.execute(query, {
      userId: userId,
      SUPPLIER_ID: SUPPLIER_ID,
      CODE: CODE,
      MESSAGE: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
      STATUS: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let supplierPaymentMethod = async (SUPPLIER_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.supplierPaymentMethod();
    let result = await connectionP2pORACLE.execute(query, {
      SUPPLIER_ID: SUPPLIER_ID,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

module.exports = {
  paymentMethodList,
  addPaymentMethod,
  supplierPaymentMethod,
};
