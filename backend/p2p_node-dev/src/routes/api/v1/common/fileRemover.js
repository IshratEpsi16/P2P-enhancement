const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const model = require("../../../../models/api/v1/common/fileRemover");
const fileUploaderCommonObject = require("../../../../common/api/v1/fileUploader");
//const getUserRolePermission = require("../authentication/authorization_role_permission");

const isEmpty = require("is-empty");

router.post(`/file-remove`, verifyToken, async (req, res) => {
  try {
    userId = req.user ? req.user.USER_ID : null;
    let finalData = {};
    let value = {
      message: ``,
      status: 200,
    };
    let reqData = {
      TABLE_NAME: req.body.TABLE_NAME,
      COLUMN_NAME: req.body.COLUMN_NAME,
      ORG_COLUMN_NAME: req.body.ORG_COLUMN_NAME,
      FILE_NAME: req.body.FILE_NAME,
      FILE_TYPE_CODE: req.body.FILE_TYPE_CODE,
    };
    if (isEmpty(reqData.TABLE_NAME)) {
      value.message = "Please Give Table Name.";
      value.status = 500;
      return res.status(value.status).json(value);
    }
    if (isEmpty(reqData.COLUMN_NAME)) {
      value.message = "Please Give Column Name.";
      value.status = 500;
      return res.status(value.status).json(value);
    }
    if (isEmpty(reqData.FILE_NAME)) {
      value.message = "Please Give File Name.";
      value.status = 500;
      return res.status(value.status).json(value);
    }
    if (isEmpty(reqData.FILE_TYPE_CODE)) {
      value.message = "Please Give File Type Code.";
      value.status = 500;
      return res.status(value.status).json(value);
    }
    if (isEmpty(reqData.ORG_COLUMN_NAME)) {
      value.message = "Please Give Original File Column Name.";
      value.status = 500;
      return res.status(value.status).json(value);
    }

    fileUploadCode = await fileUploaderCommonObject.fileRemove(
      reqData.FILE_NAME,
      reqData.FILE_TYPE_CODE
    );

    finalData.USER_ID = userId;
    finalData.TABLE_NAME = reqData.TABLE_NAME;
    finalData.COLUMN_NAME = reqData.COLUMN_NAME;
    finalData.ORG_COLUMN_NAME = reqData.ORG_COLUMN_NAME;
    finalData.FILE_NAME = reqData.FILE_NAME;

    if (fileUploadCode.success == true) {
      let queryResult = await model.fileRemover(finalData);
      console.log(queryResult);
      if (queryResult.rowsAffected > 0) {
        value.message = "File Removed Successfully.";
        value.status = 200;
        return res.status(value.status).json(value);
      }
      if (queryResult.rowsAffected > 0) {
        value.message = "File Removed Successfully.";
        value.status = 200;
        return res.status(value.status).json(value);
      }
    } else if (fileUploadCode.success == false) {
      value.message = fileUploadCode.message;
      value.status = 500;
      return res.status(value.status).json(value);
    }
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

module.exports = router;
