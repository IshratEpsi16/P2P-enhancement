const express = require("express");
const router = express.Router();
router.use(express.json());
const oracledb = require("oracledb");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const baseurl = process.env.VERSION_1;
router.post(`/login-old`, async (req, res) => {
  let connection;
  let USER_ID;
  let APPROVAL_STATUS;
  let USER_ACTIVE_STATUS;
  let IS_NEW_USER;
  let START_DATE;
  let END_DATE;
  let EMPLOYEE_ID;
  let SUPPLIER_ID;
  let USER_TYPE;
  let USER_NAME;
  let FULL_NAME;
  const today = new Date();
  try {
    connection = req.dbConnection;
    let { EMAIL, USER_PASS } = req.body; // Get username and password from request body

    // Make USER_NAME lowercase
    //EMAIL = EMAIL.toUpperCase();

    // Validate USER_NAME and USER_PASS
    if (!EMAIL || !USER_PASS) {
      let value = {
        message: "Username and password are required!",
        status: 400,
      };
      return res.status(400).json(value);
    }

    // Additional validation logic (allow only letters, numbers, and underscores)
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^[a-zA-Z0-9_@#$%]+$/;

    if (!emailPattern.test(EMAIL) || !passwordRegex.test(USER_PASS)) {
      let value = {
        message: "Invalid email or password format!",
        status: 400,
      };
      return res.status(400).json(value);
    }

    // Declare variables to store the result
    let l_hashed_password;
    let salt_password;

    try {
      // Check if the username exists and get the hashed password and salt
      const result = await connection.execute(
        `SELECT USER_PASSWORD, SALT_PASSWORD,
        USER_ID,
        APPROVAL_STATUS,
        USER_ACTIVE_STATUS,
        IS_NEW_USER,
        START_DATE,
        END_DATE,
        EMPLOYEE_ID,
        SUPPLIER_ID,
        USER_TYPE,
        USER_NAME,
        FULL_NAME
         FROM XXP2P.XXP2P_USER
         WHERE EMAIL_ADDRESS = :EMAIL`,
        [EMAIL]
      );

      if (result.rows.length === 0) {
        // User not found
        let value = {
          message: `User not found!`,
          status: 401,
        };

        //res.status(200).json(value);
        return res.status(401).json(value);
      }

      // Extract hashed password and salt
      l_hashed_password = result.rows[0][0];
      salt_password = result.rows[0][1];
      USER_ID = result.rows[0][2];
      APPROVAL_STATUS = result.rows[0][3];
      USER_ACTIVE_STATUS = result.rows[0][4];
      IS_NEW_USER = result.rows[0][5];
      START_DATE = result.rows[0][6];
      END_DATE = result.rows[0][7];
      EMPLOYEE_ID = result.rows[0][8];
      SUPPLIER_ID = result.rows[0][9];
      USER_TYPE = result.rows[0][10];
      USER_NAME = result.rows[0][11];
      FULL_NAME = result.rows[0][12];
    } catch (err) {
      // Handle database query error
      console.error("Error querying database:", err);
      return res.status(500).json({ error: "Database query error" });
    }

    // Hash the provided password with the salt and check if it matches the stored password
    const hashed_password = await connection.execute(
      `DECLARE
      BEGIN
         :hashed_password := DBMS_CRYPTO.HASH(
           src => UTL_I18N.STRING_TO_RAW(:USER_PASS || RAWTOHEX(:salt_password), 'AL32UTF8'),
           typ => DBMS_CRYPTO.HASH_SH512
         );
       END;`,
      {
        hashed_password: {
          dir: oracledb.BIND_OUT,
          type: oracledb.STRING,
          maxSize: 4000,
        },
        USER_PASS: USER_PASS,
        salt_password: salt_password,
      }
    );

    //Checking the user is active or not
    if (USER_ACTIVE_STATUS == 0) {
      let value = {
        message: `User Is Not Active`,
        status: 401,
      };
      return res.status(401).json(value);
    } else if (START_DATE <= today && today >= END_DATE) {
      console.log(START_DATE);
      console.log(END_DATE);
      let value = {
        message: `User activation date is expire`,
        status: 401,
      };
      return res.status(401).json(value);
    } else if (APPROVAL_STATUS != "APPROVED" && USER_TYPE == "Buyer") {
      let value = {
        message: `User is not Approved`,
        status: 401,
      };
      return res.status(401).json(value);
    } else if (hashed_password.outBinds.hashed_password === l_hashed_password) {
      const payload = {
        USER_ID: USER_ID,
        APPROVAL_STATUS: APPROVAL_STATUS,
        USER_ACTIVE_STATUS: USER_ACTIVE_STATUS,
        IS_NEW_USER: IS_NEW_USER,
        EMPLOYEE_ID: EMPLOYEE_ID,
        SUPPLIER_ID: SUPPLIER_ID,
        USER_TYPE: USER_TYPE,
        USER_NAME: USER_NAME,
        FULL_NAME: FULL_NAME
        // Add more data as needed
      };
      //const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: `${process.env.JWT_EXPIR}`,
      });

      const currentDate = Date.now();
      const result = await connection.execute(
        `DECLARE
        BEGIN
        update 
         xxp2p.XXP2P_USER 
         set LAST_LOGIN_TIME = sysdate
         where USER_ID = :USER_ID;
         COMMIT;
        END;`,
        { USER_ID }
      );

      console.error(`SYSDATE UPDATED: ${USER_ID}`, result);

      // Password matches
      let value = {
        message: `Login Successful`,
        status: 200,
        token: token,
        isBuyer: USER_TYPE === "Buyer" ? 1 : 0,
      };
      return res.status(200).json(value);
    } else {
      // Password does not match
      let value = {
        message: "Password does not match!",
        status: 401,
      };
      return res.status(401).json(value);
    }
  } catch (error) {
    console.error("Error during login:", error);
    let value = {
      message: `${error}`,
      status: 500,
    };
    res.status(500).json(value);
  } finally {
    if (connection) {
      try {
        // Close the database connection
        await connection.close();
      } catch (err) {
        console.error("Error closing database connection:", err);
      }
    }
  }
});

module.exports = router;
