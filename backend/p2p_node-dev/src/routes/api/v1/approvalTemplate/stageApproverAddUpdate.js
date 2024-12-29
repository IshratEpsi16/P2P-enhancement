const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const commonObject = require("../../../../common/api/v1/common");
const stageModel = require("./../../../../models/api/v1/approvalTemplate/stageApproverAddUpdate");
const oracledb = require("oracledb");
const {
  userRoleAuthorization,
} = require("../../../../middleware/authorization");
const isEmpty = require("is-empty");

router.post(
  `/stage-approver-add-update`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    try {
      let willUpdate = false;
      let reqData = {
        ID: req.body.ID,
        STAGE_ID: req.body.STAGE_ID,
        EMPLOYEE_ID: req.body.EMPLOYEE_ID,
        STAGE_LEVEL: req.body.STAGE_LEVEL,
        STAGE_SEQ: req.body.STAGE_SEQ,
        IS_MUST_APPROVE: req.body.IS_MUST_APPROVE,
        STATUS: req.body.STATUS,
      };
      if (!isEmpty(reqData.ID)) {
        willUpdate = true;
      }
      let userId;
      userId = req.user ? req.user.USER_ID : null;

      if (!willUpdate) {
        let value = {
          message: `Added`,
          status: 200,
          id: 0,
        };
        console.log(reqData);

        let userQueryResult = await stageModel.stageApproverAdd(
          reqData.STAGE_ID,
          reqData.EMPLOYEE_ID,
          reqData.STAGE_LEVEL,
          reqData.STAGE_SEQ,
          reqData.IS_MUST_APPROVE,
          reqData.STATUS
        );
        value.message = userQueryResult.outBinds.MESSAGE;
        value.status = userQueryResult.outBinds.STATUS;
        value.id = userQueryResult.outBinds.ID;

        return res.status(200).json(value);
      } else if (willUpdate) {
        let value = {
          message: `Update`,
          status: 200,
        };
        console.log(reqData);

        let userQueryResult = await stageModel.stageApproverUpdate(
          reqData.ID,
          reqData.STAGE_ID,
          reqData.EMPLOYEE_ID,
          reqData.STAGE_LEVEL,
          reqData.STAGE_SEQ,
          reqData.IS_MUST_APPROVE,
          reqData.STATUS
        );
        value.message = userQueryResult.outBinds.MESSAGE;
        value.status = userQueryResult.outBinds.STATUS;

        return res.status(200).json(value);
      }
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

router.post(
  `/approver-list`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    try {
      let filepath = `${process.env.backend_url}${process.env.profile_pic_file_path_name}`;
      let reqData = {
        STAGE_ID: req.body.STAGE_ID,
      };
      if (isEmpty(reqData.STAGE_ID)) {
        let value = {
          message: `Enter Stage ID`,
          status: 400,
        };
        return res.status(400).json(value);
      } else {
        let value = {
          message: `Approver List`,
          status: 200,
          profile_pic: filepath,
          data: [],
        };

        let userQueryResult = await stageModel.approverList(reqData.STAGE_ID);
        await commonObject.makeArrayObject(userQueryResult);
        value.data = userQueryResult.queryResult.finalData;
        return res.status(200).json(value);
      }
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

router.post(`/delete`, verifyToken, async (req, res) => {
  try {
    let reqBody = { TEMPLATE_ID: req.body.TEMPLATE_ID };

    let value = {
      message: ``,
      status: 200,
    };

    let userQueryResult = await templateModel.templateDelete(
      reqBody.TEMPLATE_ID
    );
    //console.log(userQueryResult);
    value.message = userQueryResult.outBinds.MESSAGE;
    value.status = userQueryResult.outBinds.STATUS;
    return res.status(200).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(
  `/approver-remove`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    try {
      let reqData = { ID: req.body.ID };
      if (isEmpty(reqData.ID)) {
        let value = {
          message: `Enter ID for Remove Approver`,
          status: 400,
        };
        return res.status(400).json(value);
      } else {
        let value = {
          message: ``,
          status: 200,
        };

        let userQueryResult = await stageModel.approverDelete(reqData.ID);
        //console.log(userQueryResult);
        value.message = userQueryResult.outBinds.MESSAGE;
        value.status = userQueryResult.outBinds.STATUS;
        return res.status(200).json(value);
      }
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

module.exports = router;
