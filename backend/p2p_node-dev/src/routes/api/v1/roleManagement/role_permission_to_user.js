const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");

const baseurl = process.env.VERSION_1;

router.post(`/role-permission-to-user`, verifyToken, async (req, res) => {
  let connection;

  try {
    // Create a database connection
    connection = req.dbConnection;
    let {ROLE_ID,USER_ID } = req.body;
    userId = req.user ? req.user.USER_ID : null;

    const updateResult = await connection.execute(
      `
      DECLARE
    Z_ROLE_ID NUMBER := :ROLE_ID;
    Z_USER_ID NUMBER := :USER_ID;
    IS_EXIST NUMBER :=0;
        BEGIN
            
            
            SELECT COUNT(*) INTO IS_EXIST
                FROM XXP2P.XXP2P_USER_ROLES
                WHERE ROLE_ID = Z_ROLE_ID
                AND USER_ID = :USER_ID;

            IF IS_EXIST = 0 THEN
                -- Insert if it doesn't exist
                INSERT INTO XXP2P.XXP2P_USER_ROLES (ROLE_ID, USER_ID,CREATED_BY,LAST_UPDATED_BY)
                VALUES (Z_ROLE_ID, Z_USER_ID, :userId,:userId);
                COMMIT;

                :MESSAGE :=  'Granted Successfully';
                :STATUS := 200;
            ELSE
                -- Delete if it exists
                DELETE FROM XXP2P.XXP2P_USER_ROLES
                WHERE ROLE_ID = Z_ROLE_ID
                AND USER_ID = Z_USER_ID;
                --User role delete history
                INSERT INTO XXP2P.XXP2P_DELETED_LOG 
                        (OBJECT_TYPE, OBJECT_ID, DELETED_BY)
                        VALUES
                        ('USER ROLE: '||Z_USER_ID||'', Z_ROLE_ID, :userId);
                COMMIT;

                :MESSAGE := 'Revoke Successfully';
                :STATUS := 200;
            END IF;
        EXCEPTION
            WHEN OTHERS THEN
                ROLLBACK;
                :MESSAGE :=  'An error occurred';
                :STATUS := 500;
        END;
        `,
      {
        ROLE_ID,
        USER_ID,
        userId,
        MESSAGE: { dir: oracledb.BIND_OUT, type: oracledb.MESSAGE },
        STATUS: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      }
    );


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
