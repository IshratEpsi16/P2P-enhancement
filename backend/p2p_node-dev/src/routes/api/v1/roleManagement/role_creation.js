const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");

const baseurl = process.env.VERSION_1;

router.post(`/role-creation`, verifyToken, async (req, res) => {
  let connection;

  try {
    // Create a database connection
    connection = req.dbConnection;
    let {ROLE_NAME } = req.body;
    userId = req.user ? req.user.USER_ID : null;

    const updateResult = await connection.execute(
      `
      DECLARE
      IS_EXIST NUMBER := 0; -- Initialize IS_EXIST
      Z_ROLE_ID NUMBER;
      IS_NAME_EXIST NUMBER; -- Add a variable to check if the ROLE_NAME already exists
  BEGIN
      -- Check if the ROLE_NAME already exists
      SELECT COUNT(*) INTO IS_NAME_EXIST
      FROM XXP2P.XXP2P_ROLE_MASTER
      WHERE LOWER(ROLE_NAME) = LOWER(:ROLE_NAME);
  
      IF IS_NAME_EXIST > 0 THEN
          :MESSAGE := 'The Name Already Exists!';
          :STATUS := 400;
      ELSE
          -- ROLE_NAME doesn't exist; proceed with the insert
          INSERT INTO XXP2P.XXP2P_ROLE_MASTER (ROLE_NAME, CREATED_BY, LAST_UPDATED_BY, CAN_DELETE) 
          VALUES (:ROLE_NAME, :USER_ID, :USER_ID, 1) RETURNING ROLE_ID INTO Z_ROLE_ID;
          COMMIT;
  
          :MESSAGE := 'New Role Created.';
          :ROLE_ID := Z_ROLE_ID;
          :STATUS := 200;
      END IF;
  EXCEPTION
      WHEN OTHERS THEN
          :MESSAGE := 'An error occurred: ' || SQLERRM;
          :STATUS := 401;
  END;
  

        `,
      {
        USER_ID: userId,
        ROLE_NAME,
        MESSAGE: { dir: oracledb.BIND_OUT, type: oracledb.MESSAGE },
        ROLE_ID: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        STATUS: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      }
    );

    // Access the result using updateResult.outBinds.RESULT
    const resultValue = updateResult.outBinds.RESULT;

    let value = {
      message: updateResult.outBinds.MESSAGE,
      status: updateResult.outBinds.STATUS,
      role_id: updateResult.outBinds.ROLE_ID,
    };

    return res.status(200).json(value);
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
