const {
  getPool,
  getGeneral,
} = require("../../../../../connections/api/v1/connection");
const queries = require("../../../../../queries/api/v1/pr2po/pr/rfqPreparation");
const oracledb = require("oracledb");

let rfqCreation = async (reqData) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.rfqCreation();
    let result = await connectionP2pORACLE.execute(query, reqData);

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

// let rfqAllList = async (whereData) => {
//   let connectionP2pORACLE = await getPool();

//   try {
//     let query = await queries.rfqAllList();
//     let result = await connectionP2pORACLE.execute(query,whereData);

//     await connectionP2pORACLE.close();
//     return result;
//   } catch (error) {
//     await connectionP2pORACLE.close();
//     return;
//   }
// };

let rfqAllList = async (whereData) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.rfqAllList(whereData);
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query.query, query.params);

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

let rfqHeaderUpdate = async (updateData, whereData) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.rfqHeaderUpdate(updateData, whereData);
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

let rfqLineItemUpdate = async (updateData, whereData) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.rfqLineItemUpdate(updateData, whereData);
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

let rfqDetails = async (whereData, USER_ID, offset, limit) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.rfqDetails(whereData, USER_ID, offset, limit);
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query);

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

let rfqHeaderDetails = async (whereData) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.rfqHeaderDetails(whereData);
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query, whereData);

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

let rfqAllListTotal = async (whereData) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.rfqAllListTotal(whereData);
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query.query, query.params);

    // Close the connection
    await connectionP2pORACLE.close();

    // Return the query result
    return result;
  } catch (error) {
    // Handle errors
    console.error("Error in rfqAllListTotal:", error);

    // Close the connection
    await connectionP2pORACLE.close();

    // Return an error or rethrow the error for handling elsewhere
    throw error;
  }
};

let rfqAllDetailsTotal = async (whereData) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.rfqAllDetailsTotal(whereData);
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query);

    // Close the connection
    await connectionP2pORACLE.close();

    // Return the query result
    return result;
  } catch (error) {
    // Handle errors
    console.error("Error in rfqAllListTotal:", error);

    // Close the connection
    await connectionP2pORACLE.close();

    // Return an error or rethrow the error for handling elsewhere
    throw error;
  }
};

let rfqSupplierList = async (whereData, offset, limit) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.rfqSupplierList(whereData, offset, limit);
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query);

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

let rfqAllSupplierListTotal = async (whereData) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.rfqAllSupplierListTotal(whereData);
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query);

    // Close the connection
    await connectionP2pORACLE.close();

    // Return the query result
    return result;
  } catch (error) {
    // Handle errors
    console.error("Error in rfqAllListTotal:", error);

    // Close the connection
    await connectionP2pORACLE.close();

    // Return an error or rethrow the error for handling elsewhere
    throw error;
  }
};

let addNewRFQHeader = async (info) => {
  let connectionP2pORACLE = await getPool();

  try {
    let keys = Object.keys(info);
    let queryValue = [];

    for (let i = 0; i < keys.length; i++) {
      queryValue.push(info[keys[i]]);
    }
    queryValue.push({ type: oracledb.NUMBER, dir: oracledb.BIND_OUT });

    let query = await queries.addNewRFQHeader(info);
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

let addNewRFQLines = async (info) => {
  let connectionP2pORACLE = await getPool();

  try {
    let keys = Object.keys(info);
    let queryValue = [];

    for (let i = 0; i < keys.length; i++) {
      queryValue.push(info[keys[i]]);
    }
    queryValue.push({ type: oracledb.NUMBER, dir: oracledb.BIND_OUT });

    let query = await queries.addNewRFQLines(info);
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
let addNewRFQInviteSuppliers = async (info) => {
  let connectionP2pORACLE = await getPool();

  try {
    let keys = Object.keys(info);
    let queryValue = [];

    for (let i = 0; i < keys.length; i++) {
      queryValue.push(info[keys[i]]);
    }
    queryValue.push({ type: oracledb.NUMBER, dir: oracledb.BIND_OUT });

    let query = await queries.addNewRFQInviteSuppliers(info);
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

let updateById = async (id = 0, updateData = {}, conn = undefined) => {
  let connection = undefined;

  if (conn !== undefined) connection = conn;
  else connection = await getPool();

  // get object, generate an array and push data value here

  // for update data
  let keysOfUpdateData = Object.keys(updateData);
  let dataParameterUpdateData = [];

  for (let index = 0; index < keysOfUpdateData.length; index++) {
    dataParameterUpdateData.push(updateData[keysOfUpdateData[index]]);
  }

  try {
    let query = await queries.updateById(updateData);
    let result = await connection.execute(
      query,
      [...dataParameterUpdateData, id],
      { autoCommit: true }
    );

    if (conn == undefined) await connection.close();
    return result;
  } catch (error) {
    await connection.close();
    return;
  }
};

let employeeNameById = async (whereData) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.employeeNameById(whereData);
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query, whereData);

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

let locationNameById = async (whereData) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.locationNameById(whereData);
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query, whereData);

    // Close the connection
    await connectionP2pORACLE.close();

    // Return the query result
    return result;
  } catch (error) {
    // Handle errors
    console.error("Error in locationNameById:", error);

    // Close the connection
    await connectionP2pORACLE.close();

    // Return an error or rethrow the error for handling elsewhere
    throw error;
  }
};

let categoryList = async (whereData) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.categoryList(whereData);
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query, whereData);

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

let locationList = async () => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.locationList();
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query);

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

let deleteLineItem = async (data) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.deleteLineItem();
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query, data);
    if (result.rowsAffected > 0) {
      await connectionP2pORACLE.commit();
    } else await connectionP2pORACLE.rollback();

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

let invoiceTypeList = async () => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.invoiceTypeList();
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query);

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

let freightTermsList = async () => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.freightTermsList();
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query);

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

let paymentTermsList = async () => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.paymentTermsList();
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query);

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

let generalTermsList = async () => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.generalTermsList();
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query);

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

let supplierList = async (whereData, OFFSET, LIMIT) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.supplierList(whereData, OFFSET, LIMIT);
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query, whereData);

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

let supplierListTotal = async (whereData) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.supplierListTotal(whereData);
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query, whereData);

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

let supplierNumberFromEBS = async (whereData, OFFSET, LIMIT) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.supplierNumberFromEBS(whereData, OFFSET, LIMIT);
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query, whereData);

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

let supplierNumberFromEBSCount = async (whereData) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.supplierNumberFromEBSCount(whereData);
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query, whereData);

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

let inventoryStock = async (whereData, ORG_ID, ITEM_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.inventoryStock(ORG_ID, ITEM_ID);
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query, whereData);

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

let orgWiseSupplierSite = async (ORG_ID, USER_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.orgWiseSupplierSite(ORG_ID, USER_ID);
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query);

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

let supplierContact = async (USER_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.supplierContact(USER_ID);
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query);

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

let ouWiseStock = async (whereData, ORG_ID, ITEM_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.ouWiseStock(ORG_ID, ITEM_ID);
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query, whereData);

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

let supplierDelete = async (ids) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.supplierDelete(ids);
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

let emailSentStatusUpdate = async (ids) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.emailSentStatusUpdate(ids);
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

let getPOTotalOfSupplier = async (USER_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.getPOTotalOfSupplier(USER_ID);
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query);
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
let rfqInvitedSupplierList = async (whereData, offset, limit) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.rfqInvitedSupplierList(whereData, offset, limit);
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query);

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

let rfqInvitedSupplierListTotal = async (whereData, offset, limit) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.rfqInvitedSupplierListTotal(
      whereData,
      offset,
      limit
    );
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query);

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

let rfqSubmittedDetails = async (whereData, USER_ID, offset, limit) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.rfqSubmittedDetails(
      whereData,
      USER_ID,
      offset,
      limit
    );
    // Execute the query with parameters
    let result = await connectionP2pORACLE.execute(query);
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

module.exports = {
  rfqCreation,
  addNewRFQHeader,
  updateById,
  addNewRFQLines,
  addNewRFQInviteSuppliers,
  getDataByWhereCondition,
  rfqAllList,
  rfqAllListTotal,
  rfqAllDetailsTotal,
  rfqDetails,
  rfqSupplierList,
  rfqAllSupplierListTotal,
  rfqHeaderUpdate,
  rfqLineItemUpdate,
  employeeNameById,
  categoryList,
  supplierList,
  supplierListTotal,
  supplierNumberFromEBS,
  locationList,
  invoiceTypeList,
  deleteLineItem,
  freightTermsList,
  paymentTermsList,
  locationNameById,
  inventoryStock,
  generalTermsList,
  rfqHeaderDetails,
  rfqInvitedSupplierList,
  rfqInvitedSupplierListTotal,
  rfqSubmittedDetails,
  ouWiseStock,
  orgWiseSupplierSite,
  supplierContact,
  supplierNumberFromEBSCount,
  supplierDelete,
  emailSentStatusUpdate,
  getPOTotalOfSupplier,
};
