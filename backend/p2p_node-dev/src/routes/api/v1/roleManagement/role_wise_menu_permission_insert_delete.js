const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");

const baseurl = process.env.VERSION_1;

router.post(`/role-menu-per-access`, verifyToken, async (req, res) => {
  let connection;
  let userId;
  try {
    // Create a database connection
    connection = req.dbConnection;
    let { ROLE_ID, MENU_ID, PERMISSION_ID} = req.body;
    userId = req.user ? req.user.USER_ID : null;

    const updateResult = await connection.execute(
      `
      DECLARE
    Z_ROLE_ID NUMBER := :ROLE_ID;
    Z_MENU_ID NUMBER := :MENU_ID;
    Z_PERMISSION_ID NUMBER := :PERMISSION_ID;
    Z_USER_ID NUMBER := :USER_ID;
    IS_ROLE_EXIST NUMBER := 0;
    IS_MENU_EXIST NUMBER := 0;
    IS_PERM_EXIST NUMBER := 0;
BEGIN
    
    -- Check if Z_ROLE_ID exists in ROLE_MASTER
    SELECT COUNT(*) INTO IS_ROLE_EXIST
    FROM XXP2P.XXP2P_ROLE_MASTER
    WHERE ROLE_ID = Z_ROLE_ID;
    
    IF IS_ROLE_EXIST = 0 THEN
    :MESSAGE :='The Role does not exist';
    :STATUS := 200;
    ELSE
        -- Check if MENU_ID is not null and the combination exists in MENU_ROLES
        IF Z_MENU_ID != 0 THEN
            SELECT COUNT(*) INTO IS_MENU_EXIST
            FROM XXP2P.XXP2P_MENU_ROLES
            WHERE MENU_ID = Z_MENU_ID
            AND ROLE_ID = Z_ROLE_ID;

            IF IS_MENU_EXIST = 0 THEN
                -- Insert the combination into MENU_ROLES
                INSERT INTO XXP2P.XXP2P_MENU_ROLES (ROLE_ID, MENU_ID,CREATED_BY,LAST_UPDATED_BY)
                VALUES (Z_ROLE_ID, Z_MENU_ID,Z_USER_ID,Z_USER_ID);
                COMMIT;
                :MESSAGE :='Granted Successfully';
                :STATUS := 200;
            ELSE
                -- Delete the combination from MENU_ROLES
                DELETE FROM XXP2P.XXP2P_MENU_ROLES
                WHERE ROLE_ID = Z_ROLE_ID
                AND MENU_ID = Z_MENU_ID;
                COMMIT;
                :MESSAGE :='Revoke Successfully';
                :STATUS := 200;
            END IF;
        END IF;

        -- Check if PERMISSION_ID is not null and the combination exists in ROLE_PERMISSION_MAPPING
        IF Z_PERMISSION_ID != 0 THEN
            SELECT COUNT(*) INTO IS_PERM_EXIST
            FROM XXP2P.XXP2P_ROLE_PERMISSION_MAPPING
            WHERE PERMISSION_ID = Z_PERMISSION_ID
            AND ROLE_ID = Z_ROLE_ID;

            IF IS_PERM_EXIST = 0 THEN
                -- Insert the combination into ROLE_PERMISSION_MAPPING
                INSERT INTO XXP2P.XXP2P_ROLE_PERMISSION_MAPPING (ROLE_ID, PERMISSION_ID,CREATED_BY,LAST_UPDATED_BY)
                VALUES (Z_ROLE_ID, Z_PERMISSION_ID,Z_USER_ID,Z_USER_ID);
                COMMIT;
                :MESSAGE :='Granted Successfully';
                :STATUS := 200;
            ELSE
                -- Delete the combination from ROLE_PERMISSION_MAPPING
                DELETE FROM XXP2P.XXP2P_ROLE_PERMISSION_MAPPING
                WHERE ROLE_ID = Z_ROLE_ID
                AND PERMISSION_ID = Z_PERMISSION_ID;
                COMMIT;
                :MESSAGE := 'Revoke Successfully';
                :STATUS := 200;
            END IF;
        END IF;
    END IF;
END;

        `,
      {
        ROLE_ID,
        MENU_ID,
        PERMISSION_ID,
        USER_ID: userId,
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
