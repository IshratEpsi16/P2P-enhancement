const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/common/supplierCategory");
const oracledb = require("oracledb");

let categoryList = async (SUPPLIER_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.categoryList();
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

let categoryIsExist = async (
  SUPPLIER_ID,
  ORGANIZATION_ID,
  VENDOR_LIST_NAME,
  STATUS
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.categoryIsExist();
    let result = await connectionP2pORACLE.execute(query, {
      SUPPLIER_ID: SUPPLIER_ID,
      ORGANIZATION_ID: ORGANIZATION_ID,
      VENDOR_LIST_NAME: VENDOR_LIST_NAME,
      STATUS: STATUS,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let addNew = async (info) => {
  let connectionP2pORACLE = await getPool();

  try {
    let keys = Object.keys(info);
    let queryValue = [];

    for (let i = 0; i < keys.length; i++) {
      queryValue.push(info[keys[i]]);
    }

    let query = await queries.addNew(info);
    let result = await connectionP2pORACLE.execute(query, queryValue, {
      autoCommit: true,
    });
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let updateById = async (id, USER_ID, STATUS) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.updateById(id);
    let result = await connectionP2pORACLE.execute(
      query,
      {
        ID: id,
        USER_ID: USER_ID,
        STATUS: STATUS,
      },
      { autoCommit: true }
    );

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

module.exports = {
  categoryList,
  addNew,
  updateById,
  categoryIsExist,
};
