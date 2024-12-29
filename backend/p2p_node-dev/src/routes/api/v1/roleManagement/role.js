const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const commonObject = require("../../../../common/api/v1/common");
const roleModel = require('../../../../models/api/v1/roleManagement/role');


const baseurl = process.env.VERSION_1;

router.get(`/role`,verifyToken, async (req, res) => {

  try {
    let result = await roleModel.getRoles();
    await commonObject.makeArrayObject(result);
    console.log(result.queryResult.finalData);
    console.log(result.queryResult.totalData);
    


    let value = {
      message: `Roles`,
      status: 200,
      total:result.queryResult.totalData,
      data: result.queryResult.finalData,
    };

    res.status(200).json(value);
  } catch (error) {
    console.error("Error executing Oracle query:", error);
    res.status(500).json({ error: "Database query error" });
  } 
});
module.exports = router;