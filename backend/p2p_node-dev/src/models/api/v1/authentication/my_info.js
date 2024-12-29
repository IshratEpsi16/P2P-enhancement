const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/authentication/my_info");
const oracledb = require("oracledb");

let myInfoUserCheck = async (userId) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.myInfoUserCheck();
    let result = await connectionP2pORACLE.execute(query, { userId: userId });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let myInfoUserMenu = async (userId, DEVICE) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.myInfoUserMenu();
    let result = await connectionP2pORACLE.execute(query, {
        userId: userId,
        DEVICE: DEVICE,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let myInfoUserPermission = async (userId) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.myInfoUserPermission();
    let result = await connectionP2pORACLE.execute(query, {
        userId: userId,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

module.exports = {
  myInfoUserCheck,
  myInfoUserMenu,
  myInfoUserPermission,
};
