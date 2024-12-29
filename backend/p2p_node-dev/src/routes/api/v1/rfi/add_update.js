const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const addUpdateModel = require("./../../../../models/api/v1/rfi/add_update");
//const getUserRolePermission = require("../authentication/authorization_role_permission");
const {
  userPermissionAuthorization,
  userRoleAuthorization,
} = require("../../../../middleware/authorization");
const isEmpty = require("is-empty");

router.post(
  `/add-update`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    try {
      let willUpdate = false;
      let value = {
        message: ``,
        status: 200,
      };
      userId = req.user ? req.user.USER_ID : null;
      let reqData = {
        ID: req.body.ID,
        OBJECT_ID: req.body.OBJECT_ID,
        OBJECT_TYPE: req.body.OBJECT_TYPE,
        INITIATOR_NOTE: req.body.INITIATOR_NOTE,
        VIEWER_ID: req.body.VIEWER_ID,
        VIEWER_NOTE: req.body.VIEWER_NOTE,
        VIEWER_ACTION: req.body.VIEWER_ACTION,
      };
      if (!isEmpty(reqData.ID)) {
        willUpdate = true;
        reqData.VIEWER_ID = userId;
      }
      reqData.INITIATOR_ID = userId;

      const requiredFields = {
        OBJECT_ID: "Please Give Application ID or Supplier ID.",
        VIEWER_ID: "Please Give Viewer ID",
      };

      for (const field in requiredFields) {
        if (isEmpty(reqData[field]) && isEmpty(reqData.ID)) {
          return res.status(400).send({
            success: false,
            status: 400,
            message: requiredFields[field],
          });
        }
      }

      if (!isEmpty(reqData.INITIATION_DATE)) {
        let validateDataCheck = await commonObject.characterLimitCheck(
          reqData.INITIATION_DATE,
          "INITIATOR NOTE"
        );

        if (validateDataCheck.success == false)
          return res.status(400).send({
            success: false,
            status: 400,
            message: validateDataCheck.message,
          });
        reqData.INITIATOR_NOTE = validateDataCheck.data;
      }

      if (!isEmpty(reqData.VIEWER_NOTE)) {
        let validateDataCheck = await commonObject.characterLimitCheck(
          reqData.VIEWER_NOTE,
          "VIEWER NOTE"
        );

        if (validateDataCheck.success == false)
          return res.status(400).send({
            success: false,
            status: 400,
            message: validateDataCheck.message,
          });
        reqData.VIEWER_NOTE = validateDataCheck.data;
      }

      // Add
      if (isEmpty(reqData.ID)) {
        let queryResult = await addUpdateModel.addRfi(
          reqData.OBJECT_ID,
          reqData.OBJECT_TYPE,
          userId,
          reqData.INITIATOR_NOTE,
          reqData.VIEWER_ID
        );
        console.log(queryResult);
        value.message = queryResult.outBinds.MESSAGE;
        value.status = queryResult.outBinds.STATUS;
        return res.status(200).json(value);
      }
      if(willUpdate){
        
        let queryResult = await addUpdateModel.updateRfi(
            reqData.ID,
            reqData.VIEWER_ID,
            reqData.VIEWER_NOTE,
            reqData.VIEWER_ACTION
          );
          console.log(queryResult);
          value.message = queryResult.outBinds.MESSAGE;
          value.status = queryResult.outBinds.STATUS;
          return res.status(200).json(value);
      }
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

module.exports = router;
