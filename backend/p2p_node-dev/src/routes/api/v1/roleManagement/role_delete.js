const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");

const baseurl = process.env.VERSION_1;

router.post(`/role-deletion`, verifyToken, async (req, res) => {
  let connection;
  let userId;
  try {
    // Create a database connection
    connection = req.dbConnection;
    let { ROLE_ID } = req.body;
    userId = req.user ? req.user.USER_ID : null;

    const updateResult = await connection.execute(
      `
      DECLARE
    Z_ROLE_ID NUMBER := :ROLE_ID;
    IS_ROLE_EXIST NUMBER := 0;
    IS_ROLE_EXIST_ON_USER_ROLES NUMBER := 0;
    IS_ROLE_EXIST_ON_MENU_ROLES NUMBER := 0;
    IS_ROLE_PERMISSION_MAPPING NUMBER := 0;
    BEGIN
        -- Check if the ROLE_ID already exists
        SELECT COUNT(*) INTO IS_ROLE_EXIST
        FROM XXP2P.XXP2P_ROLE_MASTER
        WHERE ROLE_ID = Z_ROLE_ID
        AND CAN_DELETE = 1;

        IF IS_ROLE_EXIST = 0 THEN
        :MESSAGE:= 'Role Not Exists!';
            :STATUS := 400;
        ELSE
            
                    DELETE FROM XXP2P.XXP2P_USER_ROLES WHERE ROLE_ID = Z_ROLE_ID;
                    DELETE FROM XXP2P.XXP2P_MENU_ROLES WHERE ROLE_ID = Z_ROLE_ID;
                    DELETE FROM XXP2P.XXP2P_ROLE_PERMISSION_MAPPING WHERE ROLE_ID = Z_ROLE_ID;
                    DELETE FROM XXP2P.XXP2P_ROLE_MASTER WHERE ROLE_ID = Z_ROLE_ID;
                    INSERT INTO XXP2P.XXP2P_DELETED_LOG 
                    (OBJECT_TYPE, OBJECT_ID, DELETED_BY)
                    VALUES
                    ('ROLE', Z_ROLE_ID, :userId);
                    COMMIT;
                    :MESSAGE:= 'Role Deleted';
                    :STATUS := 200;
              
                -- Close the IF statement
        END IF; -- Close the outer IF statement
    
    END;

        `,
      {
        userId,
        ROLE_ID,
        MESSAGE: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        STATUS: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      }
    );

    // Access the result using updateResult.outBinds.RESULT
    const resultValue = updateResult.outBinds.RESULT;

    let value = {
      message: updateResult.outBinds.MESSAGE,
      status: updateResult.outBinds.STATUS,
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
