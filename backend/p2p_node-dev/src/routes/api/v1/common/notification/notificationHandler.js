const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../../common/api/v1/common");
const model = require("../../../../../models/api/v1/common/notification/notificationHandler");
//const getUserRolePermission = require("../authentication/authorization_role_permission");
const isEmpty = require("is-empty");
const http = require("http");
const WebSocket = require("ws");
const  wsClients  = require("../../../../../middleware/wsClients");

router.post(`/my-notifications`, verifyToken, async (req, res) => {
  userId = req.user ? req.user.USER_ID : null;
  let finalData = {};
  let finalDataUnseen = {};
  let profile_pic = `${process.env.backend_url}${process.env.profile_pic_file_path_name}`;
  let filepath = `${process.env.backend_url}${process.env.profile_pic1_file_path_name}`;
  let filepath1 = `${process.env.backend_url}${process.env.profile_pic_file_path_name}`;
  try {
    let value = {
      message: `Notification List`,
      status: 200,
      profile_pic: profile_pic,
      profile_pic1: filepath,
      profile_pic2: filepath1,
      unseen: 0,
      data: [],
    };
    let reqData = {
      OFFSET: req.body.OFFSET,
      LIMIT: req.body.LIMIT,
    };

    finalData.USER_ID = userId;
    finalData.P_OFFSET = reqData.OFFSET;
    finalData.P_LIMIT = reqData.LIMIT;
    finalDataUnseen.USER_ID = userId;

    let queryResultUnseen = await model.notificationUnseenList(finalDataUnseen);
    await commonObject.makeArrayObject(queryResultUnseen);
    let rowObject = await commonObject.convertArrayToObject(
      queryResultUnseen.queryResult.finalData
    );
    value.unseen = rowObject.UNSEEN;

    let queryResult = await model.notificationList(finalData);
    await commonObject.makeArrayObject(queryResult);
    value.data = queryResult.queryResult.finalData;

    value.status = 200;
    return res.status(value.status).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(`/notifications-read`, verifyToken, async (req, res) => {
  try {
    let whereData = {};
    let updateData = {};
    let userId = req.user ? req.user.USER_ID : null;
    let value = {
      message: ``,
    };

    let reqData = {
      ID: req.body.ID,
    };

    whereData.FOR_USER_ID = userId;
    whereData.ID = reqData.ID;

    updateData.IS_READ = 1;

    let queryResult = await model.update(updateData, whereData);
    console.log(queryResult.lastRowid);

    if (!isEmpty(queryResult.lastRowid)) {
      value.message = "Updated Successfully.";
      value.status = 200;
      return res.status(value.status).json(value);
    } else {
      value.message = "Not Updated. Please Try Again";
      value.status = 500;
      return res.status(value.status).json(value);
    }
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.get(`/mark-all-notifications`, verifyToken, async (req, res) => {
  try {
    let whereData = {};
    let updateData = {};
    let userId = req.user ? req.user.USER_ID : null;
    let value = {
      message: ``,
    };

    whereData.FOR_USER_ID = userId;
    updateData.IS_READ = 1;

    let queryResult = await model.markAllNotification(updateData, whereData);
    console.log(queryResult.lastRowid);

    if (!isEmpty(queryResult.lastRowid)) {
      value.message = "All Notification Marked Seen Successfully.";
      value.status = 200;
      return res.status(value.status).json(value);
    } else {
      value.message = "Not Updated. Please Try Again";
      value.status = 500;
      return res.status(value.status).json(value);
    }
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post("/my-notifications-live", verifyToken, async (req, res) => {
  let userId = req.user ? req.user.USER_ID : null;
  let finalData = {};
  let finalDataUnseen = {};
  let profile_pic = `${process.env.backend_url}${process.env.profile_pic_file_path_name}`;
  let filepath = `${process.env.backend_url}${process.env.profile_pic1_file_path_name}`;
  let filepath1 = `${process.env.backend_url}${process.env.profile_pic_file_path_name}`;

  try {
    let value = {
      message: "Notification List",
      status: 200,
      profile_pic: profile_pic,
      profile_pic1: filepath,
      profile_pic2: filepath1,
      unseen: 0,
      data: [],
    };

    let reqData = {
      OFFSET: req.body.OFFSET,
      LIMIT: req.body.LIMIT,
    };

    finalData.USER_ID = userId;
    finalData.P_OFFSET = reqData.OFFSET;
    finalData.P_LIMIT = reqData.LIMIT;
    finalDataUnseen.USER_ID = userId;

    // Query unseen notifications
    let queryResultUnseen = await model.notificationUnseenList(finalDataUnseen);
    await commonObject.makeArrayObject(queryResultUnseen);
    let rowObject = await commonObject.convertArrayToObject(
      queryResultUnseen.queryResult.finalData
    );
    value.unseen = rowObject.UNSEEN;

    // Query notification list
    let queryResult = await model.notificationList(finalData);
    await commonObject.makeArrayObject(queryResult);
    value.data = queryResult.queryResult.finalData;

    const clients = wsClients.getClients(); // Get the clients array

    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'NOTIFICATION_LIST', data: value.data }));
      }
    });

    // Send the response to the HTTP client
    value.status = 200;
    return res.status(value.status).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

module.exports = router;
