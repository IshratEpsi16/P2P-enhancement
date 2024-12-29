const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/csCreation/csApproval");
const oracledb = require("oracledb");

let csHeaderUpdate = async (updateData, whereData) => {
  let connectionP2pORACLE = await getPool();

  try {
    // Get the query and parameters
    let query = await queries.csHeaderUpdate(updateData, whereData);
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

let poCreate = async (ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.poCreate(ID);
    let result = await connectionP2pORACLE.execute(query, {
      MESSAGE: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 4000,
      },
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let poDetails = async (ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.poDetails(ID);
    let result = await connectionP2pORACLE.execute(query);

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let rfqHeaderDetails = async (ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.rfqHeaderDetails(ID);
    let result = await connectionP2pORACLE.execute(query);
    
    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    console.log(error);
    await connectionP2pORACLE.close();
    return;
  }
};

let rfqItemDetails = async (CS_ID, PO_HD_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.rfqItemDetails(CS_ID, PO_HD_ID);
    let result = await connectionP2pORACLE.execute(query);

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

// let insertHistory = async (info) => {
//   let connectionP2pORACLE = await getPool();

//   try {
//     let keys = Object.keys(info);
//     let queryValue = [];

//     for (let i = 0; i < keys.length; i++) {
//       queryValue.push(info[keys[i]]);
//     }
//     //queryValue.push({ type: oracledb.NUMBER, dir: oracledb.BIND_OUT });
//     console.log(queryValue);

//     let query = await queries.insertHistory(info);
//     console.log(query);
//     let result = await connectionP2pORACLE.execute(query, queryValue, {
//       autoCommit: true,
//     });

//     await connectionP2pORACLE.close();
//     return result;
//   } catch (error) {
//     await connectionP2pORACLE.close();
//     return;
//   }
// };

// let insertHistory = async (info) => {
//     let connectionP2pORACLE = await getPool();

//     try {
//     //   let keys = Object.keys(info);
//     //   let queryValue = [];

//     //   for (let i = 0; i < keys.length; i++) {
//     //     queryValue.push(info[keys[i]]);
//     //   }

//       let query = await queries.insertHistory(info);
//       console.log(query);
//       let result = await connectionP2pORACLE.execute(query, info,{
//         autoCommit: true,
//       });
//       await connectionP2pORACLE.close();
//       return result;
//     } catch (error) {
//       await connectionP2pORACLE.close();
//       return;
//     }
//   };

let insertHistory = async (info) => {
  let connectionP2pORACLE = await getPool();

  try {
    let keys = Object.keys(info);
    let queryValue = [];

    for (let i = 0; i < keys.length; i++) {
      queryValue.push(info[keys[i]]);
    }
    queryValue.push({ type: oracledb.NUMBER, dir: oracledb.BIND_OUT });

    let query = await queries.insertHistory(info);
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

module.exports = {
  csHeaderUpdate,
  insertHistory,
  poCreate,
  poDetails,
  rfqHeaderDetails,
  rfqItemDetails,
};
