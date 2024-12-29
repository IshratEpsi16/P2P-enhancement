const {
  getPool,
  getGeneral,
} = require("../../../../../connections/api/v1/connection");
const queries = require("../../../../../queries/api/v1/common/notification/notificationHandler");
const oracledb = require("oracledb");

let notificationUnseenList = async (data) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.notificationUnseenList(data);
    let result = await connectionP2pORACLE.execute(query, {
      USER_ID: data.USER_ID,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let notificationList = async (data) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.notificationList(data);
    let result = await connectionP2pORACLE.execute(query, {
      USER_ID: data.USER_ID,
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


let markAllNotification = async (updateData, whereData) => {
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
  notificationList,
  notificationUnseenList,
  markAllNotification
};
