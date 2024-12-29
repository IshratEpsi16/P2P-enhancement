const isEmpty = require("is-empty");
const moment = require("moment");
const bcrypt = require("bcrypt");
const saltRounds = 10; // Cost factor to determine hashing rounds
var nodemailer = require("nodemailer");

let characterLimitCheck = async (
  value = "",
  modelField = "",
  willAllowExtraSpace = false
) => {
  let originalValue = value;
  // remove extra space

  if (!willAllowExtraSpace) {
    value = value.replace(/\s+/g, " ");
  }

  if (typeof value === "string") value = value.trim();
  // console.log(value.length);

  // unknown space special character remove
  value = value.replace("ㅤ", " ");

  if (isEmpty(value) || value == null || value == undefined) {
    return {
      success: false,
      message: `${modelField} is empty. `,
      data: value,
    };
  }

  let data = [
    {
      modelField: "ACCOUNT NAME",
      maxLength: 255,
      minLength: 3,
      isAllowStartWithNumeric: true,
      isAllowStartWithSpecialCharacter: true,
      willItUpperCase: false,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0,
    },

    {
      modelField: "ACCOUNT NUMBER",
      maxLength: 255,
      minLength: 9,
      isAllowStartWithNumeric: true,
      isAllowStartWithSpecialCharacter: true,
      willItUpperCase: false,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0,
    },

    {
      modelField: "NAME",
      maxLength: 255,
      minLength: 3,
      isAllowStartWithNumeric: true,
      isAllowStartWithSpecialCharacter: true,
      willItUpperCase: false,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0,
    },

    {
      modelField: "BANK NAME",
      maxLength: 255,
      minLength: 3,
      isAllowStartWithNumeric: true,
      isAllowStartWithSpecialCharacter: true,
      willItUpperCase: false,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0,
    },

    {
      modelField: "BRANCH NAME",
      maxLength: 255,
      minLength: 5,
      isAllowStartWithNumeric: true,
      isAllowStartWithSpecialCharacter: true,
      willItUpperCase: false,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0,
    },
    {
      modelField: "ROUTING_SWIFT_CODE",
      maxLength: 155,
      minLength: 9,
      isAllowStartWithNumeric: true,
      isAllowStartWithSpecialCharacter: true,
      willItUpperCase: false,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0,
    },
    {
      modelField: "COUNTRY",
      maxLength: 155,
      minLength: 2,
      isAllowStartWithNumeric: true,
      isAllowStartWithSpecialCharacter: true,
      willItUpperCase: false,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0,
    },
    {
      modelField: "ADDRESS_LINE1",
      maxLength: 350,
      minLength: 1,
      isAllowStartWithNumeric: true,
      isAllowStartWithSpecialCharacter: true,
      willItUpperCase: false,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0,
    },
    {
      modelField: "ADDRESS_LINE2",
      maxLength: 255,
      minLength: 1,
      isAllowStartWithNumeric: true,
      isAllowStartWithSpecialCharacter: true,
      willItUpperCase: false,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0,
    },
    {
      modelField: "CITY_STATE",
      maxLength: 255,
      minLength: 1,
      isAllowStartWithNumeric: true,
      isAllowStartWithSpecialCharacter: true,
      willItUpperCase: false,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0,
    },
    {
      modelField: "SIGNATORY NAME",
      maxLength: 255,
      minLength: 3,
      isAllowStartWithNumeric: true,
      isAllowStartWithSpecialCharacter: true,
      willItUpperCase: false,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0,
    },

    {
      modelField: "Organization name",
      maxLength: 255,
      minLength: 3,
      isAllowStartWithNumeric: true,
      isAllowStartWithSpecialCharacter: true,
      willItUpperCase: false,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0,
    },

    {
      modelField: "Organization Type",
      maxLength: 255,
      minLength: 3,
      isAllowStartWithNumeric: true,
      isAllowStartWithSpecialCharacter: true,
      willItUpperCase: false,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0,
    },

    {
      modelField: "Item Category",
      maxLength: 255,
      minLength: 1,
      isAllowStartWithNumeric: true,
      isAllowStartWithSpecialCharacter: true,
      willItUpperCase: false,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0,
    },

    {
      modelField: "Supplier Address",
      maxLength: 255,
      minLength: 3,
      isAllowStartWithNumeric: true,
      isAllowStartWithSpecialCharacter: true,
      willItUpperCase: false,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0,
    },

    {
      modelField: "Incorporate in",
      maxLength: 255,
      minLength: 3,
      isAllowStartWithNumeric: true,
      isAllowStartWithSpecialCharacter: true,
      willItUpperCase: false,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0,
    },

    {
      modelField: "POSITION",
      maxLength: 255,
      minLength: 2,
      isAllowStartWithNumeric: true,
      isAllowStartWithSpecialCharacter: true,
      willItUpperCase: false,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0,
    },

    {
      modelField: "Agent name",
      maxLength: 255,
      minLength: 2,
      isAllowStartWithNumeric: true,
      isAllowStartWithSpecialCharacter: true,
      willItUpperCase: false,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0,
    },

    {
      modelField: "Agent address",
      maxLength: 255,
      minLength: 10,
      isAllowStartWithNumeric: true,
      isAllowStartWithSpecialCharacter: true,
      willItUpperCase: false,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0,
    },

    {
      modelField: "Agent contact person position",
      maxLength: 155,
      minLength: 2,
      isAllowStartWithNumeric: true,
      isAllowStartWithSpecialCharacter: true,
      willItUpperCase: false,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0,
    },
    {
      modelField: "Agent contact person name",
      maxLength: 255,
      minLength: 10,
      isAllowStartWithNumeric: true,
      isAllowStartWithSpecialCharacter: true,
      willItUpperCase: false,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0,
    },
    {
      modelField: "Approval Template Name",
      maxLength: 255,
      minLength: 10,
      isAllowStartWithNumeric: true,
      isAllowStartWithSpecialCharacter: false,
      willItUpperCase: true,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0,
    },
    {
      modelField: "APPROVAL NOTE",
      maxLength: 150,
      minLength: 0,
      isAllowStartWithNumeric: true,
      isAllowStartWithSpecialCharacter: false,
      willItUpperCase: true,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0,
    },
    {
      modelField: "INITIATOR NOTE",
      maxLength: 240,
      minLength: 0,
      isAllowStartWithNumeric: true,
      isAllowStartWithSpecialCharacter: false,
      willItUpperCase: true,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0,
    },
    {
      modelField: "VIEWER NOTE",
      maxLength: 240,
      minLength: 0,
      isAllowStartWithNumeric: true,
      isAllowStartWithSpecialCharacter: false,
      willItUpperCase: true,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0,
    },
  ];

  let index = await data.find(
    (element) => element.modelField.toUpperCase() == modelField.toUpperCase()
  );

  if (index === undefined) {
    return {
      success: false,
      message: `${modelField} is unknown model field. `,
      data: value,
    };
  } else {
    data = index;
  }

  if (data.isAllowSpace === false) {
    if (originalValue.indexOf(" ") > -1) {
      return {
        success: false,
        message: `Space is not allowed in ${data.modelField}. `,
        data: originalValue,
      };
    }
  }

  if (
    value.length < data.minLength ||
    (value.length > data.maxLength && data.maxLength != -1)
  ) {
    return {
      success: false,
      message:
        data.maxLength == -1
          ? `${data.modelField} Length should be at least ${data.minLength} `
          : `${data.modelField} Length should be between ${data.minLength} to ${data.maxLength}. `,
      data: originalValue,
    };
  }

  if (data.isAllowStartWithSpecialCharacter == false) {
    if (
      (value.charCodeAt(0) >= 32 && value.charCodeAt(0) <= 47) ||
      (value.charCodeAt(0) >= 58 && value.charCodeAt(0) <= 64) ||
      (value.charCodeAt(0) >= 91 && value.charCodeAt(0) <= 96) ||
      (value.charCodeAt(0) >= 123 && value.charCodeAt(0) <= 126)
    )
      return {
        success: false,
        message: `${data.modelField} never start with special character. `,
        data: originalValue,
      };
  }

  if (data.isAllowStartWithNumeric == false) {
    if (value.charCodeAt(0) >= 48 && value.charCodeAt(0) <= 57) {
      return {
        success: false,
        message: `${data.modelField} never start with number. `,
        data: originalValue,
      };
    }
  }

  if (data.willItUpperCase == true) {
    let tempData = "";

    for (let j = 0; j < value.length; j++) {
      if (
        (value.charCodeAt(j) >= 65 && value.charCodeAt(j) <= 90) ||
        (value.charCodeAt(j) >= 97 && value.charCodeAt(j) <= 122)
      )
        tempData += value[j].toUpperCase();
      else tempData += value[j];
    }

    value = tempData;
  }

  // minimum character type check
  let totalUpperCharacter = 0,
    totalLowerCharacter = 0,
    totalNumberCharacter = 0,
    totalSpecialCharacter = 0;

  for (let i = 0; i < value.length; i++) {
    if (value[i] >= "A" && value[i] <= "Z") totalUpperCharacter++;
    else if (value[i] >= "a" && value[i] <= "z") totalLowerCharacter++;
    else if (value[i] >= "0" && value[i] <= "9") totalNumberCharacter++;
    else totalSpecialCharacter++;
  }

  if (data.isMustUserSpecialCharacter === true && totalSpecialCharacter == 0) {
    return {
      success: false,
      message: `${data.modelField} must have special character. `,
      data: originalValue,
    };
  }

  if (data.isMustUserUpperCharacter === true && totalUpperCharacter == 0) {
    return {
      success: false,
      message: `${data.modelField} must have upper character. `,
      data: originalValue,
    };
  }

  if (data.isMustUserLowerCharacter === true && totalLowerCharacter == 0) {
    return {
      success: false,
      message: `${data.modelField} must have lower character. `,
      data: originalValue,
    };
  }

  if (
    data.isMustUserNumberCharacter === true &&
    totalNumberCharacter < data.minimumNumberCharacter
  ) {
    return {
      success: false,
      message: `${data.modelField} must have use ${data.minimumNumberCharacter} number character. `,
      data: originalValue,
    };
  }

  return {
    success: true,
    message: "",
    data: value,
  };
};

let randomStringGenerate = async (length = 10) => {
  return new Promise((resolve, reject) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let randomString = "";
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      randomString += characters.charAt(
        Math.floor(Math.random() * charactersLength)
      );
    }

    return resolve(randomString);
  });
};

let getTodayDateTime = async () => {
  let date = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Dhaka",
    })
  );
  return date;
};

let getCustomDate = async (
  date = new Date(),
  extraDay = 0,
  extraMonth = 0,
  extraYear = 0
) => {
  try {
    let customDate = new Date(date);
    customDate.setDate(customDate.getDate() + extraDay);
    customDate.setMonth(customDate.getMonth() + extraMonth);
    customDate.setFullYear(customDate.getFullYear() + extraYear);

    date =
      ("00" + customDate.getDate()).slice(-2) +
      "-" +
      ("00" + (customDate.getMonth() + 1)).slice(-2) +
      "-" +
      customDate.getFullYear();

    return date;
  } catch (error) {
    return await getTodayDate();
  }
};

let checkItsNumber = async (value) => {
  let result = {
    success: false,
    data: value,
  };

  try {
    if (typeof value === "string") {
      result.data = parseFloat(value);
    }

    if (
      !isNaN(value) ||
      (value !== "" && value !== null && value !== undefined)
    ) {
      if (
        (typeof value === "number" && value >= 0) ||
        (typeof value === "string" &&
          (value == parseInt(value) || value == parseFloat(value)))
      ) {
        result.success = true;
      }
    }
  } catch (error) {}

  //console.log(result);
  return result;
};

let compareTwoDate = async (
  date1 = "2012-12-12",
  date2 = "2012-12-1",
  want_true_false = true
) => {
  // if date1 >= date2 , then will get true

  try {
    const fast_date = moment(date1); // format the data and convert ISO Format
    const last_date = moment(date2);
    const duration = moment.duration(fast_date.diff(last_date));

    const days = {
      days: duration.asDays(),
      hours: duration.asHours(),
    };

    if (want_true_false === true) {
      return days.days > -1 && days.hours > -1 ? true : false;
    } else {
      return days;
    }
  } catch (error) {
    return 0;
  }
};

let isValidPhoneNumberOfBD = async (phoneNumber) => {
  // var pattern = /^(?:\+88|0088)?(?:\d{11}|\d{13})$/;

  var pattern = /(^(\+8801|8801|01|008801))[1|3-9]{1}(\d){8}$/;

  return pattern.test(phoneNumber);
};

let isValidEmail = async (email) => {
  var pattern = /\S+@\S+\.\S+/; // old one
  //var pattern = /\S+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/; // new one
  return pattern.test(email);
};

let isValidPhoneNumber = async (phoneNumber) => {
  var phoneNumberPattern = /(^(\+8801|8801|01|008801))[1|3-9]{1}(\d){8}$/;
  return phoneNumberPattern.test(phoneNumber);
};

let processDbDataToArrayObject = async (data = {}) => {
  // queryResult should be reference type

  let queryResult = data.queryResult;

  try {
    let finalProcessData = [];

    for (const orgRow of queryResult.rows) {
      let tempProcessData = {};
      for (let index = 0; index < queryResult.metaData.length; index++) {
        const element = queryResult.metaData[index];
        tempProcessData[element.name] = orgRow[index];
      }

      finalProcessData.push(tempProcessData);
    }

    queryResult.finalData = finalProcessData;
    queryResult.totalData = finalProcessData.length;

    return true;
  } catch (error) {
    queryResult.finalData = [];
    queryResult.totalData = 0;
    return false;
  }
};

let makeArrayObject = async (data = {}) => {
  try {
    let finalProcessData = [];
    const columnNames = data.metaData.map((column) => column.name);

    data.rows.map((row) => {
      const rowObject = {};
      columnNames.forEach((columnName, index) => {
        //rowObject[columnName] = row[index];
        rowObject[columnName] =
          row[index] === null || row[index] === "" ? "" : row[index];
      });
      finalProcessData.push(rowObject);
    });

    if (!data.queryResult) {
      data.queryResult = {};
    }

    data.queryResult.finalData = finalProcessData;
    data.queryResult.totalData = finalProcessData.length;

    return true;
  } catch (error) {
    if (!data.queryResult) {
      data.queryResult = {};
    }

    data.queryResult.finalData = [];
    data.queryResult.totalData = 0;

    return false;
  }
};

let convertArrayToObject = async (array = []) => {
  // Check if the array is not empty
  if (array && array.length > 0) {
    // The array has at least one element
    const resultObject = {};

    // Iterate over the properties of the first element
    for (const property in array[0]) {
      if (array[0].hasOwnProperty(property)) {
        // Add the property to the result object
        resultObject[property] = array[0][property];
      }
    }

    return resultObject;
  } else {
    // The array is empty or undefined, return an empty object
    return {};
  }
};

let emailChecker = async (email) => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
};

let passwordChecker = async (password) => {
  const passwordRegex = /^[a-zA-Z0-9_@#$%]+$/;
  return passwordRegex.test(password);
};

let hashPassword = async (password) => {
  try {
    // Generate salt
    const salt = await bcrypt.genSalt(saltRounds);
    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
};

let comparePasswords = async (plainTextPassword, hashedPassword) => {
  try {
    // Compare the passwords
    const match = await bcrypt.compare(plainTextPassword, hashedPassword);
    return match;
  } catch (error) {
    throw error;
  }
};

let sendEmail = async (subject, body, emailTo, imgPath) => {
  try {
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
      to: emailTo,
      subject: subject,
      //html: reqData.EMAIL_BODY,
      html: `
    <p>${body}</p>
    <img src="cid:footerimage" />
    <p>Email: <a href="mailto:info@sevenringscement.com">info@sevenringscement.com</a>, | Phone: <a href="tel:+880258817690">+880258817690</a>, Web: <a href="http://www.sevenringscement.com">www.sevenringscement.com</a></p>
    <p>Gulshan Centre Point, 13th Floor (South Block), Plot # 23-26, Road # 91, Gulshan – 2, Dhaka – 1212</p>
    `,
      attachments: [
        {
          filename: "src-logo.png",
          path: imgPath, // "D:/Users/m.hassan/Desktop/SSGIL P2P/src-logo.png",
          //path:"/home/oracle/src-logo.png",
          cid: "footerimage", // same cid value as in the html img src
        },
      ],
    };
    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      //console.log("Successfully sent");
      //console.log(transport);
      //return res.status(200).json(value);
    });
    return transport;
  } catch (error) {
    throw error;
  }
};

let dateFormatForOracle = async (inputDate) => {
  // Convert inputDate to a Date object
  const date = new Date(inputDate);

  // Months mapping
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  // Extract components
  const day = date.getUTCDate();
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");

  // Formatted string
  const formattedDate = `TO_DATE('${day}/${month}/${year} ${hours}:${minutes}:${seconds}', 'DD/MON/YYYY HH24:MI:SS')`;
  console.log(formattedDate);
  return formattedDate;
};

module.exports = {
  characterLimitCheck,
  randomStringGenerate,
  getCustomDate,
  compareTwoDate,
  getTodayDateTime,
  checkItsNumber,
  isValidPhoneNumberOfBD,
  isValidEmail,
  isValidPhoneNumber,
  processDbDataToArrayObject,
  makeArrayObject,
  emailChecker,
  passwordChecker,
  convertArrayToObject,
  hashPassword,
  comparePasswords,
  sendEmail,
  dateFormatForOracle
};
