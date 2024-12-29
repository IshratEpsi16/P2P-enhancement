const express = require("express");
const router = express.Router();
router.use(express.json());
const oracledb = require("oracledb");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const verifyToken = require('../../../../../middleware/jwtValidation');

const baseurl = process.env.VERSION_1;
router.post(`/supplierRegistration/supplier-basic-info-insertion`,verifyToken, async (req, res) => {
  let connection;
  try {
    connection = req.dbConnection;
    let {
      USER_ID,
      SUPPLIER_ID,
      ORG_NAME,
      SUP_ADDRESS,
      COUNTRY,
      ORG_TYPE_ID
    } = req.body; // Get data from request body

    try {
      // Check if the username exists and get the hashed password and salt
      const result = await connection.execute(
        // Your PL/SQL block here
        `
        DECLARE
          -- Declare variables to capture results
          V_RESULT NUMBER;
          V_USER_ID NUMBER;
        BEGIN
          -- Try to select the USER_ID from the table based on the input USER_ID
          BEGIN
            SELECT USER_ID INTO V_USER_ID FROM XXP2P.XXP2P_SUPPLIER_BSC_INFO WHERE USER_ID = :USER_ID;
          EXCEPTION
            WHEN NO_DATA_FOUND THEN
              V_USER_ID := NULL; -- Set V_USER_ID to NULL if no data is found
          END;

          -- Check if a row with the given USER_ID exists
          IF V_USER_ID IS NULL THEN
            -- If no row exists, perform an INSERT
            INSERT INTO XXP2P.XXP2P_SUPPLIER_BSC_INFO 
            (USER_ID, SUPPLIER_ID, ORG_NAME, SUP_ADDRESS, COUNTRY, ORG_TYPE_ID, CREATED_BY, LAST_UPDATED_BY)
            VALUES
            (:USER_ID, :SUPPLIER_ID, :ORG_NAME, :SUP_ADDRESS, :COUNTRY, :ORG_TYPE_ID, :USER_ID, :USER_ID);
            V_RESULT := 1; -- Set V_RESULT to 1 to indicate an insert operation
          ELSE
            -- If a row exists, perform an UPDATE
            UPDATE XXP2P.XXP2P_SUPPLIER_BSC_INFO
            SET
              ORG_NAME = :ORG_NAME,
              SUP_ADDRESS = :SUP_ADDRESS,
              COUNTRY = :COUNTRY,
              ORG_TYPE_ID = :ORG_TYPE_ID,
              CREATED_BY = :USER_ID,
              LAST_UPDATED_BY = :USER_ID
            WHERE USER_ID = :USER_ID;
            V_RESULT := 2; -- Set V_RESULT to 2 to indicate an update operation
          END IF;

          COMMIT; -- Commit the transaction

          :RESULT := V_RESULT; -- Return the result to the caller
        END;
        `,
        // Bind variables and output parameters
        {
          USER_ID,
          SUPPLIER_ID,
          ORG_NAME,
          SUP_ADDRESS,
          COUNTRY,
          ORG_TYPE_ID,
          RESULT: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        }
      );

      if (result.outBinds.RESULT === 1) {
        let value = {
            message: `Insert successful`,
            status: 200
          };
        // Insert operation was successful
        return res.status(200).json(value);
      } else if (result.outBinds.RESULT === 2) {
        let value = {
            message: `Update successful`,
            status: 200
          };
        // Update operation was successful
        return res.status(200).json(value);
      } else {
        // Neither insert nor update was performed
        return res.status(500).json({ error: "No operation performed" });
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