const {
  getPool,
  getGeneral,
} = require("../../../../../../connections/api/v1/connection");
const queries = require("../../../../../../queries/api/v1/common/systemSetup/banner/banner");
const oracledb = require("oracledb");

let sequenceCheck = async (seq) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.sequenceCheck(seq);
    let result = await connectionP2pORACLE.execute(query);

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let bannerList = async (data) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.bannerList(data);
    let result = await connectionP2pORACLE.execute(query, {
      SHOW_FOR: data.SHOW_FOR,
      IS_ACTIVE: data.IS_ACTIVE,
      BANNER_TYPE: data.BANNER_TYPE,
      P_OFFSET: data.P_OFFSET,
      P_LIMIT: data.P_LIMIT,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let bannerListTotal = async (data) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.bannerListTotal(data);
    let result = await connectionP2pORACLE.execute(query, {
      SHOW_FOR: data.SHOW_FOR,
      IS_ACTIVE: data.IS_ACTIVE,
      BANNER_TYPE: data.BANNER_TYPE
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let bannerDelete = async (data) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.bannerDelete(data);
    let result = await connectionP2pORACLE.execute(
      query,
      {
        ID: data.ID,
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

let addNew = async (info) => {
  let connectionP2pORACLE = await getPool();

  try {
    let keys = Object.keys(info);
    let queryValue = [];

    for (let i = 0; i < keys.length; i++) {
      queryValue.push(info[keys[i]]);
    }
    //console.log(queryValue);
    queryValue.push({ type: oracledb.NUMBER, dir: oracledb.BIND_OUT });

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

let update = async (updateData, whereData) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.update(updateData, whereData);
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query);
    await connectionP2pORACLE.commit();
    // Close the connection
    await connectionP2pORACLE.close();

    // Return the query result
    return result;
  } catch (error) {
    // Handle errors
    console.error("Error in update:", error);

    // Close the connection
    await connectionP2pORACLE.close();

    // Return an error or rethrow the error for handling elsewhere
    throw error;
  }
};

module.exports = {
  update,
  addNew,
  sequenceCheck,
  bannerList,
  bannerDelete,
  bannerListTotal
};
