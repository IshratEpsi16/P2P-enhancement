const { getPool, getGeneral } = require('./../../../../connections/api/v1/connection');
const queries = require('../../../../queries/api/v1/supplierApproval/supplierRegistrationSiteCreation');
const oracledb = require("oracledb");
// Promises Method

let getList = async () => {
  let connectionP2pORACLE = await getPool();
  try {
    let query = await queries.getList();
    let result = await connectionP2pORACLE.execute(query);

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let getById = async (id = 0) => {
  let connectionP2pORACLE = await getPool();

  return new Promise((resolve, reject) => {
    connectionP2pORACLE.execute(
      queries.getById(),
      [id],
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

let addNew = async (info) => {
  let connectionP2pORACLE = await getPool();

  try {
    let keys = Object.keys(info);
    let queryValue = [];

    for (let i = 0; i < keys.length; i++) {
      queryValue.push(info[keys[i]]);
    }
    queryValue.push({ type: oracledb.NUMBER, dir: oracledb.BIND_OUT })

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

let updateById = async (id = 0, updateData = {}, conn = undefined) => {
  let connection = undefined;

  if (conn !== undefined) connection = conn;
  else connection = await getPool();

  // get object, generate an array and push data value here

  // for update data
  let keysOfUpdateData = Object.keys(updateData);
  let dataParameterUpdateData = [];

  for (let index = 0; index < keysOfUpdateData.length; index++) {
    dataParameterUpdateData.push(updateData[keysOfUpdateData[index]]);
  }

  try {
    let query = await queries.updateById(updateData);
    let result = await connection.execute(
      query,
      [...dataParameterUpdateData, id],
      { autoCommit: true }
    );

    if (conn == undefined) await connection.close();
    return result;
  } catch (error) {
    await connection.close();
    return;
  }
};

let getDataByWhereCondition = async (
  where = {},
  orderBy = {},
  limit = 2000,
  offset = 0,
  columnList = []
) => {
  // get object, generate an array and push data value here
  let keys = Object.keys(where);

  let dataParameter = [];

  for (let index = 0; index < keys.length; index++) {
    if (Array.isArray(where[keys[index]]) && where[keys[index]].length > 1) {
      dataParameter.push(where[keys[index]][0], where[keys[index]][1]); // where date between  ? and ?  [ so we pass multiple data]
    } else if (
      typeof where[keys[index]] === "object" &&
      !Array.isArray(where[keys[index]]) &&
      where[keys[index]] !== null
    ) {
      let key2 = Object.keys(where[keys[index]]);

      for (let indexKey = 0; indexKey < key2.length; indexKey++) {
        let tempSubKeyValue = where[keys[index]][key2[indexKey]];
        if (
          key2[indexKey].toUpperCase() === "OR" &&
          Array.isArray(tempSubKeyValue)
        ) {
          for (
            let indexValue = 0;
            indexValue < tempSubKeyValue.length;
            indexValue++
          ) {
            dataParameter.push(tempSubKeyValue[indexValue]);
          }
        } else if (key2[indexKey].toUpperCase() === "OR") {
          dataParameter.push(tempSubKeyValue);
        } else if (key2[indexKey].toUpperCase() === "LIKE") {
          dataParameter.push("%" + tempSubKeyValue + "%");
        } else if (["IN", "NOT IN"].includes(key2[indexKey].toUpperCase())) {
          dataParameter.push(tempSubKeyValue);
        } else if (
          ["IN QUERY", "NOT IN QUERY"].includes(key2[indexKey].toUpperCase())
        ) {
          // General Code manage my  query file
        } else if (
          ["GTE", "GT", "LTE", "LT", "NOT EQ"].includes(
            key2[indexKey].toUpperCase()
          )
        ) {
          dataParameter.push(tempSubKeyValue);
        }
      }
    } else {
      dataParameter.push(where[keys[index]]);
    }
  }

  let connectionP2pORACLE = await getPool();
  try {
    let query = await queries.getDataByWhereCondition(
      where,
      orderBy,
      limit,
      offset,
      columnList
    );

    let result = await connectionP2pORACLE.execute(query, dataParameter);

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let siteOU = async (USER_ID,
  SITE_ID,
  SHORT_CODE,
  NAME,
  ORGANIZATION_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.siteOU();
    let result = await connectionP2pORACLE.execute(query, {
      USER_ID,
      SITE_ID,
      SHORT_CODE,
      NAME,
      ORGANIZATION_ID,
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
let siteOUList = async (USER_ID, SITE_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.siteOUList();
    let result = await connectionP2pORACLE.execute(query, {
      USER_ID,
      SITE_ID,
    });
    
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};


let updateRFQPayablePurchaseById = async (id = 0, updateData = {}, conn = undefined) => {

  let connection = undefined;

  if (conn !== undefined) connection = conn;
  else connection = await getPool();

  // get object, generate an array and push data value here

  // for update data
  let keysOfUpdateData = Object.keys(updateData);
  let dataParameterUpdateData = [];

  for (let index = 0; index < keysOfUpdateData.length; index++) {
      dataParameterUpdateData.push(updateData[keysOfUpdateData[index]]);
  }


  try {
      let query = await queries.updateRFQPayablePurchaseById(updateData);
      let result = await connection.execute(query, [...dataParameterUpdateData, id], { autoCommit: true });

      if (conn == undefined) await connection.close();
      return result;

  } catch (error) {
      await connection.close();
      return;
  }
}
module.exports = {
  getList,
  getById,
  addNew,
  getDataByWhereCondition,
  updateById,
  siteOU,
  siteOUList,
  updateRFQPayablePurchaseById,
};
