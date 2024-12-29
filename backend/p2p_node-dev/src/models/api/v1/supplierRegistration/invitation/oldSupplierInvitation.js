const {
    getPool,
    getGeneral,
  } = require("../../../../../connections/api/v1/connection");
  const queries = require("../../../../../queries/api/v1/supplierRegistration/invitation/oldSupplierInvitation");
  const oracledb = require("oracledb");

let addNew = async (info) => {
    let connectionP2pORACLE = await getPool();
  
    try {
      let keys = Object.keys(info);
      let queryValue = [];
  
      for (let i = 0; i < keys.length; i++) {
        queryValue.push(info[keys[i]]);
      }
      queryValue.push({ type: oracledb.NUMBER, dir: oracledb.BIND_OUT });
  
      let query = await queries.addNew(info);
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
  let getDataByWhereCondition = async (where = {}, orderBy = {}, limit = 2000, offset = 0, columnList = []) => {

    // get object, generate an array and push data value here
    let keys = Object.keys(where);

    let dataParameter = [];

    for (let index = 0; index < keys.length; index++) {
        if (Array.isArray(where[keys[index]]) && where[keys[index]].length > 1) {
            dataParameter.push(where[keys[index]][0], where[keys[index]][1]);    // where date between  ? and ?  [ so we pass multiple data]

        } else if (typeof where[keys[index]] === 'object' && !Array.isArray(where[keys[index]]) && where[keys[index]] !== null) {

            let key2 = Object.keys(where[keys[index]]);


            for (let indexKey = 0; indexKey < key2.length; indexKey++) {

                let tempSubKeyValue = where[keys[index]][key2[indexKey]];
                if (key2[indexKey].toUpperCase() === "OR" && Array.isArray(tempSubKeyValue)) {
                    for (let indexValue = 0; indexValue < tempSubKeyValue.length; indexValue++) {
                        dataParameter.push(tempSubKeyValue[indexValue]);
                    }
                } else if (key2[indexKey].toUpperCase() === "OR") {
                    dataParameter.push(tempSubKeyValue);
                } else if (key2[indexKey].toUpperCase() === "LIKE") {
                    dataParameter.push('%' + tempSubKeyValue + '%');
                } else if (["IN", "NOT IN"].includes(key2[indexKey].toUpperCase())) {
                    dataParameter.push(tempSubKeyValue);
                } else if (["IN QUERY", "NOT IN QUERY"].includes(key2[indexKey].toUpperCase())) {
                    // General Code manage my  query file
                } else if (["GTE", "GT", "LTE", "LT", "NOT EQ"].includes(key2[indexKey].toUpperCase())) {
                    dataParameter.push(tempSubKeyValue);
                }

            }

        } else {
            dataParameter.push(where[keys[index]]);
        }
    }

    let connectionP2pORACLE = await getPool();
    try {
        let query = await queries.getDataByWhereCondition(where, orderBy, limit, offset, columnList);
        // console.log(query);
        // console.log(dataParameter);

        let result = await connectionP2pORACLE.execute(query, dataParameter);

        await connectionP2pORACLE.close();
        return result;

    } catch (error) {
        await connectionP2pORACLE.close()
        return;
    }
}

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

  module.exports = {
    addNew,
    getDataByWhereCondition,
    updateData
  };