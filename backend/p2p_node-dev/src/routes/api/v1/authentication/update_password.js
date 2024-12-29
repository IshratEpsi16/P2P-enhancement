const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const model = require("../../../../models/api/v1/authentication/update_password");

const baseurl = process.env.VERSION_1;

router.post(`/new-user-update-password`, verifyToken, async (req, res) => {
  let connection;

  try {
    let value = {
      message: "Password Update Successful",
      status: 0,
    };
    let whereData = {};
    let updateData = {};
    // Create a database connection
    connection = req.dbConnection;
    let userId;
    let { PASSWORD } = req.body;

    userId = req.user ? req.user.USER_ID : null;
    console.log("User ID from Token:", userId);
    let hashPassword = await commonObject.hashPassword(PASSWORD);
    console.log(hashPassword);
    whereData.USER_ID = userId;
    updateData.USER_PASSWORD = hashPassword;
    updateData.IS_NEW_USER = 0;
    let queryResult = await model.updatePassword(updateData, whereData);
    console.log(queryResult);
    if (queryResult.rowsAffected > 0) {
      value.message = "Password Update Successful";
      value.status = 200;
      return res.status(value.status).json(value);
    }
    else{
      value.message = "Password Not Updated!";
      value.status = 400;
      return res.status(value.status).json(value);
    }

  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log("Oracle Database connection closed.");
      } catch (err) {
        console.error("Error closing Oracle Database connection:", err);
      }
    }
  }
});

module.exports = router;
