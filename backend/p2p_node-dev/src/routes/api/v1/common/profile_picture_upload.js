const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const profilePicModel = require("./../../../../models/api/v1/common/profile_picture_upload");
const fileUploaderCommonObject = require("../../../../common/api/v1/fileUploader");
const isEmpty = require("is-empty");

router.post("/upload", verifyToken, async (req, res) => {
  let userId = req.decoded.USER_ID;
  let finalData = {};
  let currentTime = await commonObject.getTodayDateTime();
  let value = {
    message: `Success`,
    status: 200,
  };

  let reqData = {
    PROFILEPIC: req.body.profile_pic_file,
  };

  if (
    req.files &&
    Object.keys(req.files).length > 0 &&
    req.files.profile_pic_file
  ) {
    let fileUploadCode = {};

    fileUploadCode = await fileUploaderCommonObject.uploadFile(
      req,
      "profilePicture",
      "profile_pic_file"
    );

    if (fileUploadCode.success == false)
      return res
        .status(400)
        .send({ success: false, status: 400, message: fileUploadCode.message });

    finalData.PROPIC_FILE_NAME = fileUploadCode.fileName;
    finalData.PROPIC_ORG_FILE_NAME = fileUploadCode.fileOriginalName;
    finalData.USER_ID = userId;
    let checkUserResult = await profilePicModel.checkUser(userId);
    await commonObject.makeArrayObject(checkUserResult);
    let rowObject = await commonObject.convertArrayToObject(
      checkUserResult.queryResult.finalData
    );

    console.log(rowObject.PROPIC_FILE_NAME);
    let userInsertionQueryResult = await profilePicModel.updateById(finalData);
    if (!isEmpty(rowObject.PROPIC_FILE_NAME)) {
      fileUploadCode = await fileUploaderCommonObject.fileRemove(
        rowObject.PROPIC_FILE_NAME,
        "profilePicture"
      );
      console.log(fileUploadCode.message);
    }
    //console.log(`Route: ${userInsertionQueryResult}`);
    return res.status(value.status).json(value);
  } else {
    value.message = "Please Choose a Picture";
    value.status = 400;
    return res.status(value.status).json(value);
  }
});

module.exports = router;
