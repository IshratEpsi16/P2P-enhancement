const express = require("express");
const router = express.Router();
router.use(express.json());
const oracledb = require("oracledb");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const verifyToken = require('../../../../../middleware/jwtValidation');

const baseurl = process.env.VERSION_1;
router.post(`/supplierRegistration/get-basic-info`,verifyToken, async (req, res) => {
  let connection;
  try {
    connection = req.dbConnection;
    let {
      USER_ID,
      SUPPLIER_ID
    } = req.body; // Get data from request body

    try {
      // Check if the username exists and get the hashed password and salt
      const result = await connection.execute(
        // Your PL/SQL block here
        `
        select 
        sbi.USER_ID,
        sbi.SUPPLIER_ID,
        sbi.SUP_ADDRESS,
        sbi.COUNTRY,  
        sotm.ORG_NAME,
        sbi.CREATED_BY
        from 
        XXP2P.XXP2P_SUPPLIER_BSC_INFO sbi, XXP2P.XXP2P_SUPPLIER_ORG_TYPE_MST sotm
        where sbi.USER_ID =:USER_ID
        and sbi.SUPPLIER_ID =:SUPPLIER_ID
        and sotm.ORG_ID = sbi.ORG_TYPE_ID
        `,
        // Bind variables and output parameters
        {
          USER_ID,
          SUPPLIER_ID,
        }
      );

      if (result.rows.length === 0) {
        // User not found
        let value = {
          message: `No data found!`,
          status: 401
        };
    
        //res.status(200).json(value);
        return res.status(401).json(value);
      } else  {
        let list=[];

        for (const row of result.rows) {
            let rowObject = {};
          
            // Iterate through the columns in each row
            for (let i = 0; i < result.metaData.length; i++) {
              const columnName = result.metaData[i].name;
              const columnValue = row[i];
          
              // Add the column name and value to the rowObject
              rowObject[columnName] = columnValue;
            }
          
            // Add the rowObject to the resultArray
            list.push(rowObject);
          }
        
        // for(const rowresult of result.rows) {
           
        //     const val={
        //         "USER_ID": rowresult[0],
        //         "SUPPLIER_ID":rowresult[1],
        //         "SUP_ADDRESS":rowresult[2],
        //         "COUNTRY":rowresult[3],
        //         "ORG_NAME":rowresult[4],
        //         "CREATED_BY":rowresult[5]
        //     };
        //     list.push(val);
        // };
        let value = {
            message: `Supplier Basic Info`,
            status: 200,
            data: list
          };
        // Update operation was successful
        return res.status(200).json(value);
      } 
    } catch (err) {
      // Handle database query error
      console.error("Error querying database:", err);
      return res.status(500).json({ error: `Database query error ${err}` });
    }
  } finally {
    if (connection) {
      try {
        // Close the database connection
        await connection.close();
      } catch (err) {
        console.error("Error closing database connection:", err);
      }
    }
  }
});

module.exports = router;
