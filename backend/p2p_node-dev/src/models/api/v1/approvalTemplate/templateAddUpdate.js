const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/approvalTemplate/templateAddUpdate");
const oracledb = require("oracledb");

let approvalModuleList = async () => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.approvalModuleList();
    let result = await connectionP2pORACLE.execute(query);

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let templateCreate = async (data) => {
  let connectionP2pORACLE = await getPool();

  try {
    console.log(data);
    let keys = Object.keys(data);
    let queryValue = [];

    for (let i = 0; i < keys.length; i++) {
      queryValue.push(data[keys[i]]);
    }
    console.log(keys);

    let query = await queries.addNew(data);
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

let templateUpdate = async (id, data = {}) => {
  let connectionP2pORACLE = await getPool();

  try {
    let keys = Object.keys(info);
    let queryValue = [];

    for (let i = 0; i < keys.length; i++) {
      queryValue.push(info[keys[i]]);
    }

    let query = await queries.updateById(data);
    let result = await connectionP2pORACLE.execute(query, queryValue, {
      id: id,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let templateList = async () => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.templateList();
    let result = await connectionP2pORACLE.execute(query);

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let templateDelete = async (TEMPLATE_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.templateDelete();
    let result = await connectionP2pORACLE.execute(query, {
      MESSAGE: { dir: oracledb.BIND_OUT, type: oracledb.MESSAGE },
      STATUS: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      TEMPLATE_ID: TEMPLATE_ID,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

module.exports = {
  approvalModuleList,
  templateCreate,
  templateList,
  templateDelete,
  templateUpdate,
};
