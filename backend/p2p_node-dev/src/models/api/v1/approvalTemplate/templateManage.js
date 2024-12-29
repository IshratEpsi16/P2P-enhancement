const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/approvalTemplate/templateManage");
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

let checkNameExist = async (name) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.checkNameExist(name);
    let result = await connectionP2pORACLE.execute(query.query, query.whereParams);

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    console.log(error);
    await connectionP2pORACLE.close();
    return;
  }
};

let templateCreate = async (data) => {
  let connectionP2pORACLE = await getPool();

  try {
    let keys = Object.keys(data);

    const queryValue = [
      ...Object.values(data),
      { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
    ];

    let query = await queries.templateCreate(data);
    let result = await connectionP2pORACLE.execute(query, queryValue, {
      autoCommit: true,
    });
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    console.log("error: ", error);
    await connectionP2pORACLE.close();
    return;
  }
};
/*
  let templateCreate = async (finalData) => {
    let connectionP2pORACLE = await getPool();

    try {
      let query = await queries.templateCreate(finalData);
      let result = await connectionP2pORACLE.execute(query, {
        MESSAGE: { dir: oracledb.BIND_OUT, type: oracledb.MESSAGE },
        TEMPLATE_ID: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        STATUS: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        finalData
      });

      await connectionP2pORACLE.close();
      return result;
    } catch (error) {
      await connectionP2pORACLE.close();
      return;
    }
  };*/

let templateUpdate = async (updateData, whereData) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.templateUpdate(updateData, whereData);
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query);
    await connectionP2pORACLE.commit();
    // Close the connection
    await connectionP2pORACLE.close();

    // Return the query result
    return result;
  } catch (error) {
    // Handle errors
    console.error("Error in Invoice Template Update:", error);

    // Close the connection
    await connectionP2pORACLE.close();

    // Return an error or rethrow the error for handling elsewhere
    throw error;
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

let templateDetails = async (ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.templateDetails();
    let result = await connectionP2pORACLE.execute(query, {
      ID: ID,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let anyTemplateIDFind = async (data) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.anyTemplateIDFind(data);
    let result = await connectionP2pORACLE.execute(
      query.query,
      query.whereParams
    );
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    console.error("Error executing query:", error);
    throw error;
  }
};

module.exports = {
  approvalModuleList,
  templateCreate,
  templateList,
  templateDelete,
  templateDetails,
  templateUpdate,
  checkNameExist,
  anyTemplateIDFind,
};
