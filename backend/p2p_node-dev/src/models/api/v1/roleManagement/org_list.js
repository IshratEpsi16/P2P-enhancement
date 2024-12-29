const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/roleManagement/org_list");

let getOrganizations = async (userId) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.getOrganizations();
    let result = await connectionP2pORACLE.execute(query, { USER_ID: userId });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

module.exports = {
  getOrganizations,
};
