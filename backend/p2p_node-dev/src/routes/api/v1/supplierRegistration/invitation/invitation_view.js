const express = require("express");
const router = express.Router();
router.use(express.json());
const oracledb = require("oracledb");
const jwt = require("jsonwebtoken");
const verifyToken = require("../../../../../middleware/jwtValidation");

const baseurl = process.env.VERSION_1;

router.post(`/invitation-view`, verifyToken, async (req, res) => {
  let connection;

  try {
    // Create a database connection
    connection = req.dbConnection;
    let {EMAIL} = req.body;


    // Query distinct role types
    const userResult = await connection.execute(
      `
      DECLARE
    -- Declare variables
    v_invited_email VARCHAR2(255) := :EMAIL;
    v_email_count NUMBER := 0;
BEGIN
    -- Check if v_invited_email is empty
    IF v_invited_email IS NULL OR LENGTH(TRIM(v_invited_email)) = 0 THEN
        :MESSAGE := 'Email cannot be empty';
        :STATUS := 400;
    ELSE
        -- Check if v_invited_email is a valid email format (you may need a more sophisticated validation)
        -- For a simple example, this checks if the email contains '@'
        IF INSTR(v_invited_email, '@') > 0 THEN
            -- Check if the email exists in the database
            BEGIN
                SELECT COUNT(*)
                INTO v_email_count
                FROM XXP2P.XXP2P_SUPPLIER_INVITATION_HISTORY
                WHERE INVITED_EMAIL = v_invited_email;

                IF v_email_count > 0 THEN
                    -- Attempt to update the record
                    BEGIN
                        UPDATE XXP2P.XXP2P_SUPPLIER_INVITATION_HISTORY
                        SET
                            VIEW_DATE = SYSDATE, 
                            IS_VIEWED = 1, 
                            LAST_UPDATE_DATE = SYSDATE
                        WHERE INVITED_EMAIL = v_invited_email;

                        -- If the update is successful, commit the transaction
                        COMMIT;
                        
                        :MESSAGE := 'Update successful';
                        :STATUS := 200;
                    EXCEPTION
                        WHEN OTHERS THEN
                            -- If an error occurs during the update, log the error message and rollback the transaction
                            ROLLBACK;
                            :MESSAGE := 'Error updating record: ' || SQLERRM;
                            :STATUS := 500;
                    END;
                ELSE
                    :MESSAGE := 'Email does not exist in the database';
                    :STATUS := 404;
                END IF;
            EXCEPTION
                WHEN OTHERS THEN
                    -- Handle exceptions related to the SELECT statement
                    :MESSAGE := 'Error checking email existence: ' || SQLERRM;
                    :STATUS := 500;
            END;
        ELSE
            :MESSAGE := 'Invalid email format';
            :STATUS := 400;
        END IF;
    END IF;
END;

      `,
      {
        EMAIL: EMAIL,
        MESSAGE: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        STATUS: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      }
    );

    let value = {
      message: userResult.outBinds.MESSAGE,
      status: userResult.outBinds.STATUS,
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
//'m.hassan@fusioninfotechltd.com'
