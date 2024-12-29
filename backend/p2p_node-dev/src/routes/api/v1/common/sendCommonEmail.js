const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const bankList = require("./../../../../models/api/v1/common/bankList");
//const getUserRolePermission = require("../authentication/authorization_role_permission");
var nodemailer = require("nodemailer");
const path = require("path");

const isEmpty = require("is-empty");

router.post(`/common-email`, verifyToken, async (req, res) => {
  try {
    let value = {
      message: `Success`,
      status: 200,
    };
    var transport = nodemailer.createTransport({
      host: "smtp.zeptomail.com",
      port: 587,
      auth: {
        user: "emailapikey",
        pass: "wSsVR6118hP2WPp1ymD/LudtzFVRVF/0Q0x0jFr3v374SPDC/cc4wRHPV1T0HvUbFzY8QGZDo78oyxcDhmdajowsmAtUWiiF9mqRe1U4J3x17qnvhDzPWWpalhqAKIsIzwRsnGhkG8Al+g==",
      },
    });
    let reqData = {
      EMAIL_SUBJECT: req.body.EMAIL_SUBJECT,
      EMAIL_TO: req.body.EMAIL_TO,
      EMAIL_BODY: req.body.EMAIL_BODY,
    };
    if (isEmpty(reqData.EMAIL_SUBJECT)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Please Give Country Short Code.",
      });
    }
    if (isEmpty(reqData.EMAIL_TO)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Please Give Receiver Email Address.",
      });
    }
    if (isEmpty(reqData.EMAIL_BODY)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Please Give Email Body.",
      });
    }

    if (!isEmpty(reqData.EMAIL_TO)) {
      if (!Array.isArray(reqData.EMAIL_TO)) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Email to must be array",
        });
      }
      console.log(reqData.EMAIL_TO);
      let tempEmailArray = reqData.EMAIL_TO;
      //console.log(tempEmailArray);

      for (let i = 0; i < tempEmailArray.length; i++) {
        let rowObjectData = tempEmailArray[i];
        //console.log(rowObjectData);
        var mailOptions = {
          from: "mail1@sevenringscement.com",
          to: rowObjectData,
          subject: reqData.EMAIL_SUBJECT,
          //html: reqData.EMAIL_BODY,
          html: `
        <p>${reqData.EMAIL_BODY}</p>
        <img src="cid:footerimage" />
        <p>Email: <a href="mailto:info@sevenringscement.com">info@sevenringscement.com</a>, | Phone: <a href="tel:+880258817690">+880258817690</a>, Web: <a href="http://www.sevenringscement.com">www.sevenringscement.com</a></p>
        <p>Gulshan Centre Point, 13th Floor (South Block), Plot # 23-26, Road # 91, Gulshan – 2, Dhaka – 1212</p>
        `,
          attachments: [
            {
              filename: "src-logo.png",
              //path: "D:/Users/m.hassan/Desktop/SSGIL P2P/src-logo.png",
              //path:"/home/oracle/src-logo.png",
              path: path.resolve(
                __dirname,
                "../../../../common/api/v1/assets/src-logo.png"
              ),
              cid: "footerimage", // same cid value as in the html img src
            },
          ],
        };
        transport.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }

          console.log("Successfully sent");
          // console.log(transport);
          return res.status(200).json(value);
          // if (transport.data.status == 200) {
          //   value.message = transport.data.message;
          //   value.status = transport.data.status;

          //   return res.status(value.status).json(value);
          // } else {
          //   value.message = transport.data.message;
          //   value.status = transport.data.status;

          //   return res.status(value.status).json(value);
          // }
        });
      }
    }
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(`/send-po`, verifyToken, async (req, res) => {
  try {
    let value = {
      message: `Success`,
      status: 200,
    };
    var transport = nodemailer.createTransport({
      host: "smtp.zeptomail.com",
      port: 587,
      auth: {
        user: "emailapikey",
        pass: "wSsVR6118hP2WPp1ymD/LudtzFVRVF/0Q0x0jFr3v374SPDC/cc4wRHPV1T0HvUbFzY8QGZDo78oyxcDhmdajowsmAtUWiiF9mqRe1U4J3x17qnvhDzPWWpalhqAKIsIzwRsnGhkG8Al+g==",
      },
    });
    let reqData = {
      EMAIL_SUBJECT: req.body.EMAIL_SUBJECT,
      EMAIL_TO: req.body.EMAIL_TO,
      EMAIL_BODY: req.body.EMAIL_BODY,
      PO_NUMBER: req.body.PO_NUMBER,
    };
    if (isEmpty(reqData.EMAIL_SUBJECT)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Please Give Country Short Code.",
      });
    }
    if (isEmpty(reqData.EMAIL_TO)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Please Give Receiver Email Address.",
      });
    }
    if (isEmpty(reqData.EMAIL_BODY)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Please Give Email Body.",
      });
    }

    if (!isEmpty(reqData.EMAIL_TO)) {
      if (!Array.isArray(reqData.EMAIL_TO)) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Email to must be array",
        });
      }
      console.log(reqData.EMAIL_TO);
      let tempEmailArray = reqData.EMAIL_TO;
      //console.log(tempEmailArray);
      const maskedPoNumber = `${reqData.PO_NUMBER.slice(0, 2)}XXXXX${reqData.PO_NUMBER.slice(-2)}`;


      for (let i = 0; i < tempEmailArray.length; i++) {
        let rowObjectData = tempEmailArray[i];
        //console.log(rowObjectData);
        var mailOptions = {
          from: "mail1@sevenringscement.com",
          to: rowObjectData,
          subject: reqData.EMAIL_SUBJECT,
          //html: reqData.EMAIL_BODY,
          html: `
        <p>${reqData.EMAIL_BODY}</p>
        <img src="cid:footerimage" />
        <p>Email: <a href="mailto:info@sevenringscement.com">info@sevenringscement.com</a>, | Phone: <a href="tel:+880258817690">+880258817690</a>, Web: <a href="http://www.sevenringscement.com">www.sevenringscement.com</a></p>
        <p>Gulshan Centre Point, 13th Floor (South Block), Plot # 23-26, Road # 91, Gulshan – 2, Dhaka – 1212</p>
        `,
          attachments: [
            {
              filename: `${maskedPoNumber}.pdf`,
              //path: "D:/Users/m.hassan/Desktop/SSGIL P2P/src-logo.png",
              //path:"/home/oracle/src-logo.png",
              path: path.resolve(
                __dirname,
                `../../../../../public/upload/supplier/po/PO_${reqData.PO_NUMBER}.pdf`
              ),
              cid: "po_pdf", // same cid value as in the html img src
            },
            {
              filename: "src-logo.png",
              //path: "D:/Users/m.hassan/Desktop/SSGIL P2P/src-logo.png",
              //path:"/home/oracle/src-logo.png",
              path: path.resolve(
                __dirname,
                "../../../../common/api/v1/assets/src-logo.png"
              ),
              cid: "footerimage", // same cid value as in the html img src
            },
          ],
        };
        transport.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }

          console.log("Successfully sent");
          // console.log(transport);
          return res.status(200).json(value);
          // if (transport.data.status == 200) {
          //   value.message = transport.data.message;
          //   value.status = transport.data.status;

          //   return res.status(value.status).json(value);
          // } else {
          //   value.message = transport.data.message;
          //   value.status = transport.data.status;

          //   return res.status(value.status).json(value);
          // }
        });
      }
    }
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

module.exports = router;
