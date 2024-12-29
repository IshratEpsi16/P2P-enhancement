const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");

const baseurl = process.env.VERSION_1;

router.post(`/resend-otp`, async (req, res) => {
  let connection;

  try {
    // Create a database connection
    connection = req.dbConnection;
    let {MOBILE_NUMBER } = req.body;

    // Query distinct role types
    const userResult = await connection.execute(
      `
      
        DECLARE

        Z_MOB_NUM VARCHAR2(100) :=:MOBILE_NUMBER;
        IS_EMAIL_OTP_EXIST NUMBER;
        v_random_number NUMBER;
        Z_NUM VARCHAR2(100);
        BEGIN

        -- Check if email exists or not
        SELECT COUNT(*)
        INTO IS_EMAIL_OTP_EXIST
        FROM XXP2P.XXP2P_PASS_RECOVERY_OTP
        WHERE  PHONE_NUMBER = Z_MOB_NUM;

        IF IS_EMAIL_OTP_EXIST > 0 THEN
        DELETE FROM XXP2P.XXP2P_PASS_RECOVERY_OTP 
        where  PHONE_NUMBER = Z_MOB_NUM;
        v_random_number := FLOOR(DBMS_RANDOM.VALUE(1000, 10000));
        INSERT INTO XXP2P.XXP2P_PASS_RECOVERY_OTP (otp,PHONE_NUMBER) 
        VALUES (v_random_number,Z_MOB_NUM);
        COMMIT;
        BEGIN
        xxp2p.send_otp_sms(Z_MOB_NUM,v_random_number);
        
        EXCEPTION
            WHEN OTHERS THEN
            -- Handle the exception
            :MESSAGE :=  'OTP sending failed';
            :STATUS := 401;
            
            RETURN;
        END;
        :MESSAGE :=  'OTP Re-Send';
        :STATUS := 200;
        RETURN;
        END IF;

        IF IS_EMAIL_OTP_EXIST = 0 THEN
        v_random_number := FLOOR(DBMS_RANDOM.VALUE(1000, 10000));
        INSERT INTO XXP2P.XXP2P_PASS_RECOVERY_OTP (otp,PHONE_NUMBER) 
        VALUES (v_random_number,Z_MOB_NUM);
        xxp2p.send_otp_sms(Z_MOB_NUM,v_random_number);
        COMMIT;
        :MESSAGE := 'OTP Sent';
        :STATUS := 200;
        RETURN;
        END IF;

        EXCEPTION
        WHEN OTHERS THEN
        -- Handle any other exception that may occur
        :MESSAGE := 'An error occurred';
        :STATUS := 401;
        RETURN;
        END;
      `,
      {
        MOBILE_NUMBER,
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
