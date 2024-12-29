const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const axios = require("axios");
const isEmpty = require("is-empty");
const baseurl = process.env.VERSION_1;

router.post(`/pass_recovery_otp_send`, async (req, res) => {
  let connection;

  try {
    // Create a database connection
    connection = req.dbConnection;
    let { MOBILE_NUMBER } = req.body;
    if (isEmpty(req.body.MOBILE_NUMBER)) {
      let value = {
        message: "Please Enter Mobile Number",
        status: 400,
      };
      return res.status(400).json(value);
    }

    // Query distinct role types
    const userResult = await connection.execute(
      `
      DECLARE
      v_random_number NUMBER;
      Z_MOB_NUM VARCHAR2(100) :=:MOBILE_NUMBER;
      IS_USER_EXIST NUMBER :=0;
      IS_Z_NUM_EXIST NUMBER;
      OTP NUMBER;
      Z_NUM VARCHAR2(100);
    BEGIN

    -- Z_NUM :=Z_MOB_NUM;
    -- Z_MOB_NUM := SUBSTR(Z_MOB_NUM, 1);
      -- Check if Z_EMAIL exists or not
      SELECT COUNT(*)
      INTO IS_USER_EXIST
      FROM XXP2P.XXP2P_USER
      WHERE MOBILE_NUMBER = Z_MOB_NUM;

    IF IS_USER_EXIST = 0
      THEN
      :MESSAGE := 'User Not Found!';
      :STATUS := 401;

    
    ELSE
      IF IS_USER_EXIST > 0 THEN
        v_random_number := FLOOR(DBMS_RANDOM.VALUE(1000, 10000));
        INSERT INTO XXP2P.XXP2P_PASS_RECOVERY_OTP (otp,PHONE_NUMBER) 
        VALUES (v_random_number,Z_MOB_NUM);

        OTP := v_random_number;
        --xxp2p.send_otp_sms(Z_MOB_NUM,v_random_number);
        COMMIT;
        :MESSAGE := 'OTP Sent';
        :OTP := OTP;
        :STATUS := 200;
        RETURN;
      
      END IF;
      END IF;
  EXCEPTION
   WHEN OTHERS THEN
      :MESSAGE := 'Error: ' || SQLERRM;
      :STATUS := 401;
    END;
      `,
      {
        MOBILE_NUMBER,
        MESSAGE: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        OTP: { dir: oracledb.BIND_OUT, type: oracledb.OTP },
        STATUS: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      }
    );

    let value = {
      message: userResult.outBinds.MESSAGE,
      status: userResult.outBinds.STATUS,
    };
    const payloadAxios = {
      api_key: "C20016295afbbcbdb11db6.91485486",
      senderid: "SevenRings",
      type: "text",
      scheduledDateTime: "",
      msg: `${userResult.outBinds.OTP} is your Passowrd Recovery OTP for P2P Application. This OTP is valid for next 2 minutes.`,
      contacts: `880${MOBILE_NUMBER}`,
    };
     // Make a POST request to another endpoint with payload data
     const response = await axios.post(
      "http://barta.leotechbd.com/smsapi",
      payloadAxios
    );

    //Return the response from the other endpoint
    console.log(response.data);
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
