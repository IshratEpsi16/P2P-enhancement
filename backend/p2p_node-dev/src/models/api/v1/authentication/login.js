const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/authentication/login");
const oracledb = require("oracledb");

let loginWithEmail = async (EMAIL) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.loginWithEmail();
    let result = await connectionP2pORACLE.execute(query, { EMAIL: EMAIL });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let loginWithPassword = async (USER_PASS, salt_password) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.loginWithPassword();
    let result = await connectionP2pORACLE.execute(query, {
      hashed_password: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 4000,
      },
      USER_PASS: USER_PASS,
      salt_password: salt_password,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let loginTimeUpdate = async (USER_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.loginTimeUpdate();
    let result = await connectionP2pORACLE.execute(query, {
      USER_ID: USER_ID,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};
let updateMsgShownStatus = async (USER_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.updateMsgShownStatus();
    let result = await connectionP2pORACLE.execute(query, {
      USER_ID: USER_ID,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let getBasicInfo = async (USER_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.getBasicInfo();
    let result = await connectionP2pORACLE.execute(query, { USER_ID: USER_ID });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let initiatorStatus = async (INITIATOR_ID, USER_ID, object_type_code,PROFILE_UPDATE_UID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.initiatorStatus(
      INITIATOR_ID,
      USER_ID,
      object_type_code,
      PROFILE_UPDATE_UID
    );
    let result = await connectionP2pORACLE.execute(query, {
      USER_ID: USER_ID,
      INITIATOR_ID: INITIATOR_ID,
      object_type_code: object_type_code,
      PROFILE_UPDATE_UID: PROFILE_UPDATE_UID
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

module.exports = {
  loginWithEmail,
  loginWithPassword,
  loginTimeUpdate,
  getBasicInfo,
  updateMsgShownStatus,
  initiatorStatus,
};
