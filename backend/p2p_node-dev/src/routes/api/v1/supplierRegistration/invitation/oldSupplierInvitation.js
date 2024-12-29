const express = require("express");
const router = express.Router();
router.use(express.json());
const oracledb = require("oracledb");
const jwt = require("jsonwebtoken");
const verifyToken = require("../../../../../middleware/jwtValidation");
const model = require("./../../../../../models/api/v1/supplierRegistration/invitation/oldSupplierInvitation");
const {
  userPermissionAuthorization,
  userRoleAuthorization,
} = require("../../../../../middleware/authorization");
const axios = require("axios");
require("dotenv").config();
const commonObject = require("../../../../../common/api/v1/common");
const isEmpty = require("is-empty");
const baseurl = process.env.VERSION_1;

router.post(
  `/old-supplier-invite`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    let connection;
    let token = req.headers.authorization;
    token = req.headers.authorization.split(" ")[1];
    let value = {
      message: "",
      status: 0,
    };

    try {
      let tempList;
      let finalData = {};
      let reqData = {
        SUPPLIERS: req.body.SUPPLIERS,
        // ORGANIZATION_NAME: req.body.ORGANIZATION_NAME,
        // EMAIL: req.body.EMAIL,
        // MOBILE_NUMBER: req.body.MOBILE_NUMBER,
        // SUPPLIER_ID: req.body.SUPPLIER_ID,
      };

      if (!Array.isArray(reqData.SUPPLIERS)) {
        return res
          .status(400)
          .send({ message: "Suppliers Should Be Array.", status: 400 });
      }
      tempList = reqData.SUPPLIERS.length;

      userId = req.user ? req.user.USER_ID : null;

      for (let i = 0; i < tempList; i++) {
        console.log(reqData.SUPPLIERS[i].SUPPLIER_ID);
        let getUser = await model.getDataByWhereCondition({
          SUPPLIER_ID: reqData.SUPPLIERS[i].SUPPLIER_ID,
        });

        await commonObject.makeArrayObject(getUser);
        console.log(getUser.queryResult.finalData[i].INITIATOR_ID);
        if (
          isEmpty(getUser.queryResult.finalData[i].INITIATOR_ID) ||
          getUser.queryResult.finalData[i].INITIATOR_ID === undefined
        ) {
          let updateResult = await model.updateData(
            {
              INITIATOR_ID: userId,
              NEW_INFO_INITIATOR_ID: userId
            },
            {
              SUPPLIER_ID: reqData.SUPPLIERS[i].SUPPLIER_ID,
            }
          );
        }
        //console.log(reqData.SUPPLIERS[i]);
        finalData.SUPPLIER_NAME = reqData.SUPPLIERS[i].ORGANIZATION_NAME;
        finalData.SUPPLIER_INVITATION_TYPE = "EXISTING";
        finalData.INVITED_EMAIL = reqData.SUPPLIERS[i].EMAIL;
        finalData.INVITED_BY_BUYER_ID = userId;
        finalData.CREATED_BY = userId;
        finalData.IS_VIEWED = 0;
        finalData.MOBILE_NUMBER = reqData.SUPPLIERS[i].MOBILE_NUMBER;

        const payload = {
          // ORGANIZATION_NAME: reqData.ORGANIZATION_NAME,
          // EMAIL: reqData.EMAIL,
          //TYPE: reqData.TYPE,
          //PASSWORD: "123456",
          SUPPLIER_ID: reqData.SUPPLIERS[i].SUPPLIER_ID,
          //INITIATOR_ID: userId,
          //BUSINESS_GROUP_ID: reqData.BUSINESS_GROUP_ID,
          // Add more data as needed
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
          expiresIn: `168h`,
        });
        const link = `${process.env.web_url}/?token=` + token;
        //console.log(link);
        // Define the request headers with the token
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Adjust the content type if needed
        };
        let body = `Dear ${reqData.SUPPLIERS[i].ORGANIZATION_NAME},<br><br>
          We are excited to invite you to join our Procure-to-Pay (P2P) system, designed to enhance our collaboration and streamline our procurement processes. By logging into our P2P system, you will gain access to a range of features that will make it easier for us to work together, including order management, invoice submission, and real-time tracking of transactions.<br><br>
                Kindly proceed to the link provided below: "${link}"><br><br>
                We look forward to your active participation and to continuing our successful partnership through this new platform.`;

        // Define the payload data
        const payloadAxios = {
          EMAIL_TO: [reqData.SUPPLIERS[i].EMAIL],
          EMAIL_SUBJECT: "Invitation to Access SSGIL P2P System",
          EMAIL_BODY: body,
        };

        // Make a POST request to another endpoint with payload data
        let response = await axios.post(
          "http://localhost:3000/api/v1/common/common-email",
          payloadAxios,
          { headers }
        );

        //Return the response from the other endpoint
        console.log(response.data);

        //Query distinct role types
        let queryResult = await model.addNew(finalData);
        //console.log(queryResult);

        if (response.data.status == 200) {
          value = {
            message: "Invitation Email Send Successfully.",
            status: 200,
          };
          /*
          if (queryResult.rowsAffected > 0) {
            const payloadAxios = {
              api_key: "C20016295afbbcbdb11db6.91485486",
              senderid: "SevenRings",
              type: "text",
              scheduledDateTime: "",
              msg: `Click: ${link}`,
              contacts: `880${reqData.SUPPLIERS[i].MOBILE_NUMBER}`,
            };
            // Make a POST request to another endpoint with payload data
            let responseSMS = await axios.post(
              "http://barta.leotechbd.com/smsapi",
              payloadAxios
            );
          }*/
        } else if (response.data.status != 200) {
          value = {
            message: "Invitation Email Not Send! Please Try Again.",
            status: 200,
          };
          //return res.status(value.status).json(value);
        }
      }
      return res.status(value.status).json(value);
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: `Database query error ${error}` });
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
