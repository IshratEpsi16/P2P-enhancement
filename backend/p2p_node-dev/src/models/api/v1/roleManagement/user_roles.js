const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/roleManagement/user_roles");

let userDetails = async (USER_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.userDetails(USER_ID);
    let result = await connectionP2pORACLE.execute(query, { USER_ID: USER_ID });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};
let organizationDetails = async (USER_ID) => {
    let connectionP2pORACLE = await getPool();
  
    try {
      let query = await queries.organizationDetails(USER_ID);
      let result = await connectionP2pORACLE.execute(query, { USER_ID: USER_ID });
  
      await connectionP2pORACLE.close();
      return result;
    } catch (error) {
      await connectionP2pORACLE.close();
      return;
    }
  };

module.exports = {
  userDetails,
  organizationDetails
};
