const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/supplierShipment/shipment");
const oracledb = require("oracledb");
let poItemList = async (info) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.poItemList(info);
    let result = await connectionP2pORACLE.execute(query, info);
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};
//PO_NUMBER, PO_HEADER_ID
let shipmentList = async (data) => {
  let connectionP2pORACLE = await getPool();

  try {
    let keys = Object.keys(info);
    let queryValue = [];

    for (let i = 0; i < keys.length; i++) {
      queryValue.push(info[keys[i]]);
    }
    let query = await queries.shipmentList(data);
    let result = await connectionP2pORACLE.execute(query, queryValue);
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

/*let addNew = async (info, itemList) => {
  let connectionP2pORACLE = await getPool();

  try {
    let keys = Object.keys(info);
    let queryValue = [];

    for (let i = 0; i < keys.length; i++) {
      queryValue.push(info[keys[i]]);
    }
    queryValue.push({ type: oracledb.NUMBER, dir: oracledb.BIND_OUT });

    let query = await queries.addNew(info);
    let result = await connectionP2pORACLE.execute(query, queryValue);
    const id = result.outBinds[0][0];
    for (let i = 0; i < itemList.length; i++) {
      itemList[i].SHIPMENT_ID = id;
      let item = itemList[i];
      const queryResultItem = await addNewLines(item);
    }
    await connectionP2pORACLE.commit();
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.rollback();
    await connectionP2pORACLE.close();
    return;
  }
};*/

const addNew = async (info, itemList) => {
  let connectionP2pORACLE;
  let itemCount = 0;

  try {
    // Get the database connection
    connectionP2pORACLE = await getPool();

    // Prepare query values
    const queryValue = [...Object.values(info), { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }];
    const query = await queries.addNew(info);

    // Execute the main query and get the ID
    const result = await connectionP2pORACLE.execute(query, queryValue);
    const shipmentId = result.outBinds[0][0];

    // If ID is null, throw an error early
    if (!shipmentId) {
      throw new Error("Failed to insert main record: ID is null");
    }

    // Process line items in parallel
    const lineItemResults = await Promise.all(
      itemList.map(async (item) => {
        const updatedItem = { ...item, SHIPMENT_ID: shipmentId };
        const lineItemResult = await addNewLines(updatedItem);
        return lineItemResult.rowsAffected > 0;  // Returns a boolean indicating success
      })
    );

    // Check if all line items were successfully processed
    const allItemsProcessed = lineItemResults.every(success => success);
    if (allItemsProcessed) {
      await connectionP2pORACLE.commit();
    } else {
      await connectionP2pORACLE.rollback();
    }

    return result;
  } catch (error) {
    console.error("Error in addNew:", error);
    if (connectionP2pORACLE) {
      await connectionP2pORACLE.rollback();
    }
    throw error;
  } finally {
    if (connectionP2pORACLE) {
      try {
        await connectionP2pORACLE.close();
      } catch (closeError) {
        console.error("Error closing database connection:", closeError);
      }
    }
  }
};


let addNewLines = async (info) => {
  let connectionP2pORACLE = await getPool();

  try {
    let keys = Object.keys(info);
    let queryValue = [];

    for (let i = 0; i < keys.length; i++) {
      queryValue.push(info[keys[i]]);
    }
    //queryValue.push({ type: oracledb.NUMBER, dir: oracledb.BIND_OUT });

    let query = await queries.addNewLines(info);
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

let updateData = async (updateData, whereData) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.updateData(updateData, whereData);
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query);
    await connectionP2pORACLE.commit();
    // Close the connection
    await connectionP2pORACLE.close();

    // Return the query result
    return result;
  } catch (error) {
    // Handle errors
    console.error("Error in Invoice Update Reset:", error);

    // Close the connection
    await connectionP2pORACLE.close();

    // Return an error or rethrow the error for handling elsewhere
    throw error;
  }
};

let updateDataLines = async (updateData, whereData) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.updateDataLines(updateData, whereData);
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query);
    await connectionP2pORACLE.commit();
    // Close the connection
    await connectionP2pORACLE.close();

    // Return the query result
    return result;
  } catch (error) {
    // Handle errors
    console.error("Error in Invoice Update Reset:", error);

    // Close the connection
    await connectionP2pORACLE.close();

    // Return an error or rethrow the error for handling elsewhere
    throw error;
  }
};

let getShipmentNumberFromEBS = async (PO_NUMBER) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.getShipmentNumberFromEBS(PO_NUMBER);
    let result = await connectionP2pORACLE.execute(query);
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let getShipmentItemsFromEBS = async (PO_NUMBER) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.getShipmentItemsFromEBS(PO_NUMBER);
    let result = await connectionP2pORACLE.execute(query);
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let deleteShipment = async (info) => {
  let connectionP2pORACLE = await getPool();

  try {
    let keys = Object.keys(info);
    let queryValue = [];

    for (let i = 0; i < keys.length; i++) {
      queryValue.push(info[keys[i]]);
    }
    //queryValue.push({ type: oracledb.NUMBER, dir: oracledb.BIND_OUT });

    let query = await queries.deleteShipment(info);
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

let shipmentDetails = async (id) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.shipmentDetails(id);
    let result = await connectionP2pORACLE.execute(query);
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let shipmentItem = async (id) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.shipmentItem(id);
    let result = await connectionP2pORACLE.execute(query);
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};
let shipmentTimeline = async (id) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.shipmentTimeline(id);
    let result = await connectionP2pORACLE.execute(query);
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let byWhereTotalCount = async (data) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.byWhereTotalCount(data);
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
let byWhere = async (data) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.byWhere(data);
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

let shipmentUpdate = async (updateData, whereData) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.shipmentUpdate(updateData, whereData);
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query);
    await connectionP2pORACLE.commit();
    // Close the connection
    await connectionP2pORACLE.close();

    // Return the query result
    return result;
  } catch (error) {
    // Handle errors
    console.error("Error in rfqAllList:", error);

    // Close the connection
    await connectionP2pORACLE.close();

    // Return an error or rethrow the error for handling elsewhere
    throw error;
  }
};


let createGRN = async (info) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.createGRN(info);
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query);
    await connectionP2pORACLE.commit();
    // Close the connection
    await connectionP2pORACLE.close();

    // Return the query result
    return result;
  } catch (error) {
    // Handle errors
    console.error("Error in rfqAllList:", error);

    // Close the connection
    await connectionP2pORACLE.close();

    // Return an error or rethrow the error for handling elsewhere
    throw error;
  }
};

let getDataByWhereCondition = async (
  where = {},
  orderBy = {},
  limit = 2000,
  offset = 0,
  columnList = []
) => {
  // get object, generate an array and push data value here
  let keys = Object.keys(where);

  let dataParameter = [];

  for (let index = 0; index < keys.length; index++) {
    if (Array.isArray(where[keys[index]]) && where[keys[index]].length > 1) {
      dataParameter.push(where[keys[index]][0], where[keys[index]][1]); // where date between  ? and ?  [ so we pass multiple data]
    } else if (
      typeof where[keys[index]] === "object" &&
      !Array.isArray(where[keys[index]]) &&
      where[keys[index]] !== null
    ) {
      let key2 = Object.keys(where[keys[index]]);

      for (let indexKey = 0; indexKey < key2.length; indexKey++) {
        let tempSubKeyValue = where[keys[index]][key2[indexKey]];
        if (
          key2[indexKey].toUpperCase() === "OR" &&
          Array.isArray(tempSubKeyValue)
        ) {
          for (
            let indexValue = 0;
            indexValue < tempSubKeyValue.length;
            indexValue++
          ) {
            dataParameter.push(tempSubKeyValue[indexValue]);
          }
        } else if (key2[indexKey].toUpperCase() === "OR") {
          dataParameter.push(tempSubKeyValue);
        } else if (key2[indexKey].toUpperCase() === "LIKE") {
          dataParameter.push("%" + tempSubKeyValue + "%");
        } else if (["IN", "NOT IN"].includes(key2[indexKey].toUpperCase())) {
          dataParameter.push(tempSubKeyValue);
        } else if (
          ["IN QUERY", "NOT IN QUERY"].includes(key2[indexKey].toUpperCase())
        ) {
          // General Code manage my  query file
        } else if (
          ["GTE", "GT", "LTE", "LT", "NOT EQ"].includes(
            key2[indexKey].toUpperCase()
          )
        ) {
          dataParameter.push(tempSubKeyValue);
        }
      }
    } else {
      dataParameter.push(where[keys[index]]);
    }
  }

  let connectionP2pORACLE = await getPool();
  try {
    let query = await queries.getDataByWhereCondition(
      where,
      orderBy,
      limit,
      offset,
      columnList
    );
    // console.log(query);
    // console.log(dataParameter);

    let result = await connectionP2pORACLE.execute(query, dataParameter);

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

module.exports = {
  addNew,
  poItemList,
  addNewLines,
  deleteShipment,
  shipmentList,
  getDataByWhereCondition,
  shipmentDetails,
  byWhere,
  byWhereTotalCount,
  shipmentUpdate,
  shipmentTimeline,
  createGRN,
  shipmentItem,
  getShipmentNumberFromEBS,
  getShipmentItemsFromEBS,
  updateData,
  updateDataLines
};
