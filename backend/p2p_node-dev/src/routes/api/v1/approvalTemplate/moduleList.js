const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const commonObject = require("../../../../common/api/v1/common");
const templateModel = require("./../../../../models/api/v1/approvalTemplate/templateManage");


router.get(`/list`, verifyToken, async (req, res) => {
  try {

    // let { DEVICE } = req.body;
    // let userId;
    // userId = req.user ? req.user.USER_ID : null;

    let value = {
      message: `Approval Module List`,
      status: 200,
      data: []
    };

    let userQueryResult = await templateModel.approvalModuleList();
    await commonObject.makeArrayObject(userQueryResult);
    value.data = userQueryResult.queryResult.finalData;
    return res.status(200).json(value);
    
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  } 
});

module.exports = router;
