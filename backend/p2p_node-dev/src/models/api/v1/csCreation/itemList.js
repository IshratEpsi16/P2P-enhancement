const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/csCreation/itemList");
const oracledb = require("oracledb");

let itemList = async (data) => {
  let connectionP2pORACLE = await getPool();
  try {
    let query = await queries.itemList();
    console.log(query);
    let result = await connectionP2pORACLE.execute(query, data);
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let itemPoHistory = async (ITEM_ID) => {
  let connectionP2pORACLE = await getPool();
  try {
    let query = await queries.itemPoHistory(ITEM_ID);
    let result = await connectionP2pORACLE.execute(query);
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};
let itemPRHistory = async (
  REQUISITION_HEADER_ID,
  REQUISITION_LINE_ID,
  PR_NUMBER
) => {
  let connectionP2pORACLE = await getPool();
  try {
    let query = await queries.itemPRHistory(
      REQUISITION_HEADER_ID,
      REQUISITION_LINE_ID,
      PR_NUMBER
    );
    let result = await connectionP2pORACLE.execute(query);
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let itemConsumption = async (ORG_ID, ITEM_ID) => {
  let connectionP2pORACLE = await getPool();
  try {
    let query = await queries.itemConsumption(ORG_ID, ITEM_ID);
    let result = await connectionP2pORACLE.execute(query);
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

module.exports = {
  itemList,
  itemPoHistory,
  itemPRHistory,
  itemConsumption
};
