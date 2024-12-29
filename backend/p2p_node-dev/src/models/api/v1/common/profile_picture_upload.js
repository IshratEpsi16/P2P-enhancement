const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/common/profile_picture_upload");


let checkUser = async (USER_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.checkUser();
    let result = await connectionP2pORACLE.execute(query, {USER_ID});

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let updateById = async (data = {}) => {
  let connectionP2pORACLE = await getPool();

  try {
    let keys = Object.keys(data);
    let queryValue = [];

    for (let i = 0; i < keys.length; i++) {
      queryValue.push(data[keys[i]]);
    }
    //console.log(queryValue);
    let query = await queries.updateProfilePic(data);
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

module.exports = { updateById,checkUser };
