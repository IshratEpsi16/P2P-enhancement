const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/csCreation/csCreation");
const oracledb = require("oracledb");

let addNewCSHeader = async (info) => {
  let connectionP2pORACLE = await getPool();

  try {
    let keys = Object.keys(info);
    let queryValue = [];

    for (let i = 0; i < keys.length; i++) {
      queryValue.push(info[keys[i]]);
    }
    queryValue.push({ type: oracledb.NUMBER, dir: oracledb.BIND_OUT });

    let query = await queries.addNewCSHeader(info);
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

let addNewCSLineItem = async (info) => {
  let connectionP2pORACLE = await getPool();

  try {
    let keys = Object.keys(info);
    let queryValue = [];

    for (let i = 0; i < keys.length; i++) {
      queryValue.push(info[keys[i]]);
    }
    queryValue.push({ type: oracledb.NUMBER, dir: oracledb.BIND_OUT });

    let query = await queries.addNewCSLineItem(info);
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

let csListTotal = async (FROM_DATE, TO_DATE, CS_STATUS, SEARCH_FIELD) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.csListTotal(
      FROM_DATE,
      TO_DATE,
      CS_STATUS,
      SEARCH_FIELD
    );
    let result = await connectionP2pORACLE.execute(query, {
      FROM_DATE: FROM_DATE,
      TO_DATE: TO_DATE,
      CS_STATUS: CS_STATUS,
      SEARCH_FIELD: SEARCH_FIELD,
    });
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};
let csList = async (FROM_DATE, TO_DATE, CS_STATUS,SEARCH_FIELD, OFFSET, LIMIT) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.csList(
      FROM_DATE,
      TO_DATE,
      CS_STATUS,
      SEARCH_FIELD,
      OFFSET,
      LIMIT
    );
    let result = await connectionP2pORACLE.execute(query, {
      FROM_DATE: FROM_DATE,
      TO_DATE: TO_DATE,
      CS_STATUS: CS_STATUS,
      SEARCH_FIELD: SEARCH_FIELD,
      OFFSET: OFFSET,
      LIMIT: LIMIT,
    });
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let csPendingList = async (
  APPROVER_ID,
  FROM_DATE,
  TO_DATE,
  CS_STATUS,
  OFFSET,
  LIMIT
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.csPendingList(
      APPROVER_ID,
      FROM_DATE,
      TO_DATE,
      CS_STATUS,
      OFFSET,
      LIMIT
    );
    let result = await connectionP2pORACLE.execute(query, {
      APPROVER_ID: APPROVER_ID,
      FROM_DATE: FROM_DATE,
      TO_DATE: TO_DATE,
      CS_STATUS: CS_STATUS,
      OFFSET: OFFSET,
      LIMIT: LIMIT,
    });
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};
let csPendingListTotal = async (APPROVER_ID, FROM_DATE, TO_DATE, CS_STATUS) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.csPendingListTotal(
      APPROVER_ID,
      FROM_DATE,
      TO_DATE,
      CS_STATUS
    );
    let result = await connectionP2pORACLE.execute(query, {
      APPROVER_ID: APPROVER_ID,
      FROM_DATE: FROM_DATE,
      TO_DATE: TO_DATE,
      CS_STATUS: CS_STATUS,
    });
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let csUpdate = async (updateData, whereData) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.csUpdate(updateData, whereData);
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query);
    await connectionP2pORACLE.commit();
    // Close the connection
    await connectionP2pORACLE.close();

    // Return the query result
    return result;
  } catch (error) {
    // Handle errors
    console.error("Error in rfqHeaderUpdate:", error);

    // Close the connection
    await connectionP2pORACLE.close();

    // Return an error or rethrow the error for handling elsewhere
    throw error;
  }
};

let csLineUpdate = async (updateData, whereData) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.csLineUpdate(updateData, whereData);
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query);
    await connectionP2pORACLE.commit();
    // Close the connection
    await connectionP2pORACLE.close();

    // Return the query result
    return result;
  } catch (error) {
    // Handle errors
    console.error("Error in rfqHeaderUpdate:", error);

    // Close the connection
    await connectionP2pORACLE.close();

    // Return an error or rethrow the error for handling elsewhere
    throw error;
  }
};

let supplierList = async (RFQ_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.supplierList(RFQ_ID);
    let result = await connectionP2pORACLE.execute(query);
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let supplierCSTermUpdate = async (updateData, whereData) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.supplierCSTermUpdate(updateData, whereData);
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query);
    await connectionP2pORACLE.commit();
    // Close the connection
    await connectionP2pORACLE.close();

    // Return the query result
    return result;
  } catch (error) {
    // Handle errors
    console.error("Error in rfqHeaderUpdate:", error);

    // Close the connection
    await connectionP2pORACLE.close();

    // Return an error or rethrow the error for handling elsewhere
    throw error;
  }
};

let csDetails = async (CS_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.csDetails(CS_ID);
    let result = await connectionP2pORACLE.execute(query);
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let csDetailsItemTotal = async (CS_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.csDetailsItemTotal(CS_ID);
    let result = await connectionP2pORACLE.execute(query);
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let csItemDelete = async (CS_LINE_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.csItemDelete(CS_LINE_ID);
    let result = await connectionP2pORACLE.execute(query);
    await connectionP2pORACLE.commit();
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let csItemStatusUpdate = async (RFQ_LINE_ID, STATUS) => {
  console.log(RFQ_LINE_ID);
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.csItemStatusUpdate(RFQ_LINE_ID, STATUS);
    let result = await connectionP2pORACLE.execute(query);
    await connectionP2pORACLE.commit();
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};
let poList = async (CS_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.poList(CS_ID);
    let result = await connectionP2pORACLE.execute(query);
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let csTemplateFind = async (data) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.csTemplateFind(data);
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
  addNewCSHeader,
  addNewCSLineItem,
  csList,
  csPendingList,
  csUpdate,
  csLineUpdate,
  supplierList,
  supplierCSTermUpdate,
  csListTotal,
  csDetails,
  csDetailsItemTotal,
  csItemDelete,
  csItemStatusUpdate,
  csPendingListTotal,
  poList,
  csTemplateFind,
};
