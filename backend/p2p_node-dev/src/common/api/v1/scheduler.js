const cron = require("node-cron");
const schedulerModel = require("../../../models/api/v1/common/schedulerMethods");
const commonObject = require("../../../common/api/v1/common");
const isEmpty = require("is-empty");
const path = require("path");
var nodemailer = require("nodemailer");

function initializeScheduler() {
  // Schedule the task to run every day at 8:34 PM Dhaka time
  cron.schedule(
    "1 0 * * *",
    () => {
      /*
        1. Minute: 32
        2. Hour: 20 (8 PM in 24-hour format)
        3. Day of the month: * (every day)
        4. Month: * (every month)
        5. Day of the week: * (every day of the week)


        Let's break it down further:

        1. '32' in the first position means "at the 32nd minute of the hour"
        2. '20' in the second position means "at the 20th hour of the day" (8 PM in 24-hour time)
        3. '*' in the third position means "every day of the month"
        4. '*' in the fourth position means "every month"
        5. '*' in the last position means "every day of the week" 
        */
      console.log("Running the scheduled task at 12:01 AM Dhaka time");
      tradeExportLicenseExpireListEmailSend();
    },
    {
      scheduled: true,
      timezone: "Asia/Dhaka", // Timezone for Dhaka, Bangladesh
    }
  );

  console.log("Cron job scheduled for 12:01 AM Dhaka time daily");
}

tradeExportLicenseExpireListEmailSend = async () => {
  console.log(
    "Performing the daily task for Trade or Export License Expire Email"
  );
  let supplierListResult = await schedulerModel.tradeExportLicenseExpireList();
  await commonObject.makeArrayObject(supplierListResult);
  if (!isEmpty(supplierListResult.queryResult.finalData)) {
    for (let i = 0; i < supplierListResult.queryResult.finalData.length; i++) {
      if (!isEmpty(supplierListResult.queryResult.finalData[i].EMAIL_ADDRESS)) {
        emailSend(
          supplierListResult.queryResult.finalData[i].ORGANIZATION_NAME,
          supplierListResult.queryResult.finalData[i].EMAIL_ADDRESS
        );
      }
    }
  }

  // Implement your daily task logic here
  // For example: database cleanup, sending daily reports, etc.
  const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" });
  console.log(`Task executed at: ${now} (Dhaka time)`);
};

function emailSend(name, email) {
  var transport = nodemailer.createTransport({
    host: "smtp.zeptomail.com",
    port: 587,
    auth: {
      user: "emailapikey",
      pass: "wSsVR6118hP2WPp1ymD/LudtzFVRVF/0Q0x0jFr3v374SPDC/cc4wRHPV1T0HvUbFzY8QGZDo78oyxcDhmdajowsmAtUWiiF9mqRe1U4J3x17qnvhDzPWWpalhqAKIsIzwRsnGhkG8Al+g==",
    },
  });
  var mailOptions = {
    from: "mail1@sevenringscement.com",
    to: email,
    subject: "Important: Trade License Expiry Notification",
    //html: reqData.EMAIL_BODY,
    html: `
      Dear ${name},<br><br>

        <p>I hope this email finds you well.

        We would like to inform you that your trade license, currently registered with us, is due to expire in the next 7 days. To avoid any disruptions in our business operations and maintain compliance, we kindly request that you renew your trade license at the earliest convenience.

        Once you have renewed the license, please share a copy of the updated document with us to ensure that our records remain up-to-date.

        If you have any questions or require further assistance, please do not hesitate to reach out.

        Thank you for your prompt attention to this matter.

        </p>
      <img src="cid:footerimage" />
      <p>Email: <a href="mailto:info@sevenringscement.com">info@sevenringscement.com</a>, | Phone: <a href="tel:+880258817690">+880258817690</a>, Web: <a href="http://www.sevenringscement.com">www.sevenringscement.com</a></p>
      <p>Gulshan Centre Point, 13th Floor (South Block), Plot # 23-26, Road # 91, Gulshan – 2, Dhaka – 1212</p>
      `,
    attachments: [
      {
        filename: "src-logo.png",
        //path: "D:/Users/m.hassan/Desktop/SSGIL P2P/src-logo.png",
        //path:"/home/oracle/src-logo.png",
        path: path.resolve(__dirname, "./assets/src-logo.png"),
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

module.exports = { initializeScheduler };
