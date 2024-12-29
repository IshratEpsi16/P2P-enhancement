const express = require("express");
const router = express.Router();
router.use(express.json());
const oracledb = require("oracledb");
const jwt = require("jsonwebtoken");
const verifyToken = require("../../../../../middleware/jwtValidation");
const {
  userPermissionAuthorization,
  userRoleAuthorization,
} = require("../../../../../middleware/authorization");
const axios = require("axios");
require("dotenv").config();
const baseurl = process.env.VERSION_1;

router.post(
  `/supplier-invite`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    let connection;
    let token = req.headers.authorization;
    token = req.headers.authorization.split(" ")[1];

    try {
      // Create a database connection
      connection = req.dbConnection;
      let reqData = {
        NAME: req.body.NAME,
        EMAIL: req.body.EMAIL,
        TYPE: req.body.TYPE,
        MOBILE_NUMBER: req.body.MOBILE_NUMBER,
        BUSINESS_GROUP_ID: req.body.BUSINESS_GROUP_ID,
      };

      userId = req.user ? req.user.USER_ID : null;

      const payload = {
        NAME: reqData.NAME,
        EMAIL: reqData.EMAIL,
        TYPE: reqData.TYPE,
        MOBILE_NUMBER: reqData.MOBILE_NUMBER,
        INITIATOR_ID: userId,
        BUSINESS_GROUP_ID: reqData.BUSINESS_GROUP_ID,
        // Add more data as needed
      };
      const tokenPayload = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: `72h`,
      });
      const link = `${process.env.web_url}/create-account?token=` + tokenPayload;
      console.log(link);
      // Define the request headers with the token
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Adjust the content type if needed
      };
      let body = `Dear ${reqData.NAME},<br><br>
            We cordially invite you to complete your registration for our P2P esteemed platform. Your participation is vital to our community, and we eagerly anticipate your active involvement.<br><br>
            Kindly proceed to the registration link provided below: "${link}"><br><br>
            Your presence will greatly enrich our community, and we look forward to welcoming you aboard.`;

      // Define the payload data
      const payloadAxios = {
        EMAIL_TO: [reqData.EMAIL],
        EMAIL_SUBJECT:
          "Invitation to Complete Your Registration with Seven Rings Cement",
        EMAIL_BODY: body,
      };

      // Make a POST request to another endpoint with payload data
      const response = await axios.post(
        "http://localhost:3000/api/v1/common/common-email",
        payloadAxios,
        { headers }
      );

      // Return the response from the other endpoint
      console.log(response.data);

      // Query distinct role types
      const userResult = await connection.execute(
        `
      DECLARE
       
      BEGIN
        -- Attempt to send the invitation email
        BEGIN
          --XXP2P.INVITATION_EMAIL( :EMAIL, :link);

          -- If the email sending is successful, commit the transaction
          INSERT INTO XXP2P.XXP2P_SUPPLIER_INVITATION_HISTORY (
            SUPPLIER_INVITATION_TYPE,
            SUPPLIER_NAME,
            SUPPLIER_TYPE,
            INVITED_EMAIL,
            INVITED_BY_BUYER_ID,
            IS_VIEWED,
            CREATED_BY,
            CREATION_DATE,
            MOBILE_NUMBER,
            BUSINESS_GROUP_ID
        ) VALUES (
            
            'GENERAL',
            :NAME,
            :TYPE,
            :EMAIL,
            :userId,
            0,
            :userId,
            SYSDATE,
            :MOBILE_NUMBER,
            :BUSINESS_GROUP_ID
        );
          COMMIT;

          :MESSAGE := 'Invitation email sent successfully.';
          :STATUS := 200;
        EXCEPTION
          WHEN OTHERS THEN
            -- Log the error and rollback the transaction
            ROLLBACK;
            :MESSAGE := 'Error sending invitation email: ' || SQLERRM;
            :STATUS := 400;
        END;
      END;
      `,
        {
          EMAIL: reqData.EMAIL,
          //link: link,
          NAME: reqData.NAME,
          TYPE: reqData.TYPE,
          MOBILE_NUMBER: reqData.MOBILE_NUMBER,
          userId: userId,
          BUSINESS_GROUP_ID: reqData.BUSINESS_GROUP_ID,
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
  }
);

module.exports = router;
//'m.hassan@fusioninfotechltd.com'
