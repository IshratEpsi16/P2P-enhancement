const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");

const baseurl = process.env.VERSION_1;

router.post(`/otp-verification`, async (req, res) => {
  let connection;

  try {
    // Create a database connection
    connection = req.dbConnection;
    let {MOBILE_NUMBER ,OTP} = req.body;

    // Query distinct role types
    const userResult = await connection.execute(
      `
      DECLARE
      Z_MOB_NUM VARCHAR2(100) :=:MOBILE_NUMBER;
      Z_NUM VARCHAR2(100);
      Z_OTP NUMBER :=:OTP;
      IS_OTP_EXIST NUMBER :=0; 
    BEGIN
    
      -- Check if email exists or not
      SELECT COUNT(*)
      INTO IS_OTP_EXIST
      FROM XXP2P.XXP2P_PASS_RECOVERY_OTP
      WHERE PHONE_NUMBER = Z_MOB_NUM
      AND OTP = Z_OTP;
    
      IF IS_OTP_EXIST > 0 THEN
      DELETE FROM XXP2P.XXP2P_PASS_RECOVERY_OTP 
      where PHONE_NUMBER = Z_MOB_NUM 
      AND OTP = Z_OTP;
      COMMIT;
        :MESSAGE := 'OTP Matched';
        :STATUS := 200;
        RETURN;
      END IF;
      
      IF IS_OTP_EXIST = 0 THEN
      :MESSAGE := 'OTP does not match!';
      :STATUS := 401;
        RETURN;
      END IF;
    END;
      `,
      {
        MOBILE_NUMBER,
        OTP,
        MESSAGE: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        STATUS: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      }
    );

    let value = {
      message: userResult.outBinds.MESSAGE ,
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
