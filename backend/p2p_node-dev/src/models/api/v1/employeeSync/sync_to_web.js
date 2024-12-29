const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/employeeSync/sync_to_web");
const oracledb = require("oracledb");

/*let empInsert = async (
  userId,
  USER_NAME,
  EMPLOYEE_ID,
  FULL_NAME,
  START_DATE,
  END_DATE,
  BUYER_ID,
  EMAIL_ADDRESS,
  BUSINESS_GROUP_ID,
  USER_PASSWORD
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.empInsert(
      userId,
      USER_NAME,
      EMPLOYEE_ID,
      FULL_NAME,
      START_DATE,
      END_DATE,
      BUYER_ID,
      EMAIL_ADDRESS,
      BUSINESS_GROUP_ID,
      USER_PASSWORD
    );
    let result = await connectionP2pORACLE.execute(query, {
      userId: userId,
      USER_NAME: USER_NAME,
      EMPLOYEE_ID: EMPLOYEE_ID,
      FULL_NAME: FULL_NAME,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
      BUYER_ID: BUYER_ID,
      EMAIL_ADDRESS: EMAIL_ADDRESS,
      BUSINESS_GROUP_ID: BUSINESS_GROUP_ID,
      USER_PASSWORD: USER_PASSWORD,
      MESSAGE: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
      STATUS: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};*/
let empInsert = async (info) => {
  console.log('info: ',info);
 
  let connectionP2pORACLE = await getPool();

  try {
    let keys = Object.keys(info);
    let queryValue = [];

    for (let i = 0; i < keys.length; i++) {
      queryValue.push(info[keys[i]]);
    }
    queryValue.push({ type: oracledb.NUMBER, dir: oracledb.BIND_OUT });

    let query = await queries.empInsert(info);
    let result = await connectionP2pORACLE.execute(query, queryValue);

    if(result.rowsAffected>0){
      await connectionP2pORACLE.commit();
    }
    else connectionP2pORACLE.rollback();
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    console.log('error: ',error);
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

let findUser = async (BUYER_ID) => {
  let connectionP2pORACLE = await getPool();
  try {
    let query = await queries.findUser(BUYER_ID);
    let result = await connectionP2pORACLE.execute(query);
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

module.exports = {
  empInsert,
  findUser,
  update,
};
