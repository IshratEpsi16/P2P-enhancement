const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../../../common/api/v1/common");
const model = require("../../../../../../models/api/v1/common/systemSetup/banner/banner");
//const getUserRolePermission = require("../authentication/authorization_role_permission");
const isEmpty = require("is-empty");
const {
  userPermissionAuthorization,
  userRoleAuthorization,
} = require("../../../../../../middleware/authorization");
const fileUploaderCommonObject = require("../../../../../../common/api/v1/fileUploader");

router.post(
  `/add-update`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    userId = req.user ? req.user.USER_ID : null;
    let finalData = {};
    let whereData = {};
    let updateData = {};
    
    try {
      let value = {
        message: ``,
        status: 200,
      };

      let reqData = {
        ID: req.body.ID,
        BANNER_SEQUENCE: req.body.BANNER_SEQUENCE,
        BANNER_TYPE: req.body.BANNER_TYPE,
        BANNER_IMG: req.body.BANNER_IMG,
        SHOW_FOR: req.body.SHOW_FOR,
        IS_ACTIVE: req.body.IS_ACTIVE,
      };

      if (isEmpty(reqData.BANNER_SEQUENCE)) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Please Give Banner Sequence.",
        });
      }

      // if (isEmpty(reqData.BANNER_TYPE)) {
      //     return res.status(400).send({
      //       success: false,
      //       status: 400,
      //       message: "Please Give Banner Type.",
      //     });
      //   }
      if (isEmpty(reqData.SHOW_FOR)) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Please Give Banner Show For.",
        });
      }

      finalData.BANNER_SEQUENCE = reqData.BANNER_SEQUENCE;
      finalData.SHOW_FOR = reqData.SHOW_FOR;
      finalData.BANNER_TYPE = reqData.BANNER_TYPE;
      finalData.CREATED_BY = userId;
      finalData.IS_ACTIVE = 1;

      if (
        isEmpty(reqData.ID) &&
        req.files &&
        Object.keys(req.files).length > 0 &&
        req.files.BANNER_IMG
      ) {
        let queryResultSequenceCheck = await model.sequenceCheck(
          reqData.BANNER_SEQUENCE
        );
        //console.log(queryResultSequenceCheck);
        await commonObject.makeArrayObject(queryResultSequenceCheck);
        if (!isEmpty(queryResultSequenceCheck.queryResult.finalData.length)) {
          return res.status(400).send({
            success: false,
            status: 400,
            message: `Sequence ${reqData.BANNER_SEQUENCE} Already Exist. Please Select Different Sequence.`,
          });
        } else {
          let fileUploadCode = {};

          fileUploadCode = await fileUploaderCommonObject.uploadFile(
            req,
            "BANNER_IMG",
            "BANNER_IMG"
          );

          if (fileUploadCode.success == false)
            return res.status(400).send({
              success: false,
              status: 400,
              message: fileUploadCode.message,
            });

          finalData.IMG_NAME = fileUploadCode.fileName;
          //finalData.PROPIC_ORG_FILE_NAME = fileUploadCode.fileOriginalName;
          let queryResult = await model.addNew(finalData);
          console.log(queryResult.lastRowid);

          if (!isEmpty(queryResult.lastRowid)) {
            value.message = "New Banner Added.";
            value.status = 200;
            return res.status(value.status).json(value);
          } else {
            value.message = "Banner Not Added. Please Try Again";
            value.status = 500;
            return res.status(value.status).json(value);
          }
        }
      } else if (!isEmpty(reqData.ID)) {
        whereData.ID = reqData.ID;
        updateData.LAST_UPDATED_BY = userId;
        updateData.IS_ACTIVE = reqData.IS_ACTIVE;
        let queryResult = await model.update(updateData, whereData);
        console.log(queryResult.lastRowid);

        if (!isEmpty(queryResult.lastRowid)) {
          value.message = "Banner Updated Successfully.";
          value.status = 200;
          return res.status(value.status).json(value);
        } else {
          value.message = "Banner Not Updated. Please Try Again";
          value.status = 500;
          return res.status(value.status).json(value);
        }
      }
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

router.post(
  `/banner-list`,
  verifyToken,
  async (req, res) => {
    try {
        let bannerPath = `${process.env.backend_url}${process.env.banner_file_path_name}`;
      let finalData = {};
      let finalDataTotal = {};
      let userId = req.user ? req.user.USER_ID : null;
      let value = {
        message: ``,
        status: 200,
        path: bannerPath,
        total:0,
        data: [],
      };

      let reqData = {
        SHOW_FOR: req.body.SHOW_FOR,
        IS_ACTIVE: req.body.IS_ACTIVE,
        BANNER_TYPE: req.body.BANNER_TYPE,
        OFFSET: req.body.OFFSET,
        LIMIT: req.body.LIMIT
      };

      finalData.SHOW_FOR = reqData.SHOW_FOR;
      finalData.IS_ACTIVE = reqData.IS_ACTIVE;
      finalData.BANNER_TYPE = reqData.BANNER_TYPE;
      finalData.P_OFFSET = reqData.OFFSET;
      finalData.P_LIMIT = reqData.LIMIT;

      //Total
      finalDataTotal.SHOW_FOR = reqData.SHOW_FOR;
      finalDataTotal.IS_ACTIVE = reqData.IS_ACTIVE;
      finalDataTotal.BANNER_TYPE = reqData.BANNER_TYPE;

      let queryResultTotal = await model.bannerListTotal(finalDataTotal);
      //console.log(queryResult);
      await commonObject.makeArrayObject(queryResultTotal);
      let rowObject = await commonObject.convertArrayToObject(queryResultTotal.queryResult.finalData);
      value.total = rowObject.TOTAL;


      //List
      let queryResult = await model.bannerList(finalData);
      //console.log(queryResult);
      await commonObject.makeArrayObject(queryResult);

      value.data = queryResult.queryResult.finalData;
      value.message = "Banner List";
      value.status = 200;
      return res.status(value.status).json(value);
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

router.post(
  `/banner-delete`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    try {
      let finalData = {};
      let userId = req.user ? req.user.USER_ID : null;
      let value = {
        message: ``,
        status: 200,
      };

      let reqData = {
        ID: req.body.ID,
        FILE_NAME: req.body.FILE_NAME,
      };

      if (isEmpty(reqData.ID)) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Please Give ID.",
        });
      }
      if (isEmpty(reqData.FILE_NAME)) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Please Give Banner File Name.",
        });
      }

      finalData.ID = reqData.ID;

      let fileUploadCode = {};

      fileUploadCode = await fileUploaderCommonObject.fileRemove(
        reqData.FILE_NAME,
        "BANNER_IMG"
      );

      let queryResult = await model.bannerDelete(finalData);
      console.log(queryResult);
      value.message = "Banner Removed Successfully.";
      value.status = 200;
      return res.status(value.status).json(value);
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

module.exports = router;
