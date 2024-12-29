const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require('../../../../../middleware/jwtValidation');


const baseurl = process.env.VERSION_1;

router.get(`/supplierRegistration/supplier-org-types`,verifyToken, async (req, res) => {
  let connection; // Declare the connection variable

  try {
    connection = req.dbConnection; // Acquire a database connection
    const result = await connection.execute(
      `SELECT ORG_ID,ORG_NAME from XXP2P.XXP2P_SUPPLIER_ORG_TYPE_MST`
    );

    // Extract column names from the result's metaData
    const columnNames = result.metaData.map((column) => column.name);

    // Map each row to an object with column names as keys and values as values
    const data = result.rows.map((row) => {
      const rowObject = {};
      columnNames.forEach((columnName, index) => {
        rowObject[columnName] = row[index];
      });
      return rowObject;
    });

    let value = {
      message: `Type of Organization`,
      status: 200,
      data: data,
    };

    res.status(200).json(value);
  } catch (error) {
    console.error("Error executing Oracle query:", error);
    res.status(500).json({ error: "Database query error" });
  } finally {
    // Ensure the connection is always closed, whether there was an error or not
    if (connection) {
      try {
        await connection.close(); // Close the connection
        console.log("Oracle Database connection closed.");
      } catch (err) {
        console.error("Error closing Oracle Database connection:", err);
      }
    }
  }
});
module.exports = router;