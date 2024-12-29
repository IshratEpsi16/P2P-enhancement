const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/csCreation/supplierList");
const oracledb = require("oracledb");

let supplierList = async (RFQ_ID, RFQ_LINE_ID, ORG_ID, OFFSET, LIMIT) => {
  let connectionP2pORACLE = await getPool();
  try {
    let query = await queries.supplierList(
      RFQ_ID,
      RFQ_LINE_ID,
      ORG_ID,
      OFFSET,
      LIMIT
    );
    //console.log(query);
    let result = await connectionP2pORACLE.execute(query);
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let supplierListTotal = async (RFQ_ID, RFQ_LINE_ID,ORG_ID, OFFSET, LIMIT) => {
  let connectionP2pORACLE = await getPool();
  try {
    let query = await queries.supplierListTotal(
      RFQ_ID,
      RFQ_LINE_ID,
      ORG_ID,
      OFFSET,
      LIMIT
    );
    //console.log(query);
    let result = await connectionP2pORACLE.execute(query);
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let itemListOfSupplier = async (RFQ_ID, RFQ_LINE_ID, SUPPLIER_ID) => {
  let connectionP2pORACLE = await getPool();
  try {
    let query = await queries.itemListOfSupplier(
      RFQ_ID,
      RFQ_LINE_ID,
      SUPPLIER_ID
    );
    //console.log(query);
    let result = await connectionP2pORACLE.execute(query);
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

module.exports = {
  supplierList,
  supplierListTotal,
  itemListOfSupplier,
};
