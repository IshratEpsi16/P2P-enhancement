const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const {
  userRoleAuthorization,
} = require("../../../../middleware/authorization");
const commonObject = require("../../../../common/api/v1/common");
const isEmpty = require("is-empty");
const baseurl = process.env.VERSION_1;
router.post(
  `/org-list`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    let connection;

    try {
      // Create a database connection
      connection = req.dbConnection;
      //let { USER_ID } = req.body;
      userId = req.user ? req.user.USER_ID : null;
      // Create an empty result object
      // const result = {
      //   data2: [],
      // };

      let reqData = {
        USER_ID: req.body.USER_ID,
      };

      if (isEmpty(reqData.USER_ID)) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Please Give User ID.",
        });
      }

      let result = {
        message: `Organization List`,
        status: 200,
        data: [],
      };
      console.log(reqData.USER_ID);
      // Query permissions for the current role
      let orgQuery = `
   
SELECT 
    HOU.ORGANIZATION_ID,
    HOU.SHORT_CODE,
    HOU.NAME,
    CASE WHEN EOA.USER_ID IS NOT NULL AND EOA.ORGANIZATION_ID IS NOT NULL THEN 1 ELSE 0 END AS IS_ASSOCIATED
FROM 
    HR_OPERATING_UNITS HOU
JOIN 
    GL_PERIOD_STATUSES_V GLPS ON HOU.SET_OF_BOOKS_ID = GLPS.SET_OF_BOOKS_ID
JOIN 
    GL_LEDGERS GL ON GL.LEDGER_ID = HOU.SET_OF_BOOKS_ID
LEFT JOIN 
    XXP2P.XXP2P_EMPLOYEE_ORG_ACCESS EOA 
    ON EOA.USER_ID = ${reqData.USER_ID} AND HOU.ORGANIZATION_ID = EOA.ORGANIZATION_ID
WHERE 
    HOU.BUSINESS_GROUP_ID = 84
    AND GL.LEDGER_CATEGORY_CODE = 'PRIMARY'
    AND GLPS.SHOW_STATUS = 'Open'
    AND UPPER(GL.NAME) NOT LIKE UPPER('%TRUST%')
    AND GLPS.APPLICATION_ID = 101
    AND UPPER(GLPS.PERIOD_NAME) = UPPER(TO_CHAR(SYSDATE, 'MON-YY'))
ORDER BY 
    HOU.ORGANIZATION_ID

      `;
      let orgResult = await connection.execute(orgQuery);

      /*for (const orgRow of orgResult.rows) {
        result.data.push({
          ORGANIZATION_ID: orgRow[0],
          SHORT_CODE: orgRow[1],
          NAME: orgRow[2],
          IS_ASSOCIATED: orgRow[3],
        });
      }*/
      await commonObject.makeArrayObject(orgResult);
      result.data = orgResult.queryResult.finalData;

      res.status(200).json(result);
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    } finally {
      if (connection) {
        try {
          await connection.close();
          console.log("Oracle Database connection closed.");
        } catch (err) {
          console.error("Error closing Oracle Database connection:", err);
        }
      }
    }
  }
);

module.exports = router;


/*
 
SELECT 
    HOU.ORGANIZATION_ID,
    HOU.SHORT_CODE,
    HOU.NAME,
    CASE WHEN EOA.USER_ID IS NOT NULL AND EOA.ORGANIZATION_ID IS NOT NULL THEN 1 ELSE 0 END AS IS_ASSOCIATED
FROM 
    HR_OPERATING_UNITS HOU
JOIN 
    GL_PERIOD_STATUSES_V GLPS ON HOU.SET_OF_BOOKS_ID = GLPS.SET_OF_BOOKS_ID
JOIN 
    GL_LEDGERS GL ON GL.LEDGER_ID = HOU.SET_OF_BOOKS_ID
LEFT JOIN 
    XXP2P.XXP2P_EMPLOYEE_ORG_ACCESS EOA 
    ON EOA.USER_ID = ${reqData.USER_ID} AND HOU.ORGANIZATION_ID = EOA.ORGANIZATION_ID
WHERE 
    HOU.BUSINESS_GROUP_ID = 84
    AND GL.LEDGER_CATEGORY_CODE = 'PRIMARY'
    AND GLPS.SHOW_STATUS = 'Open'
    AND UPPER(GL.NAME) NOT LIKE UPPER('%TRUST%')
    AND GLPS.APPLICATION_ID = 101
    AND UPPER(GLPS.PERIOD_NAME) = UPPER(TO_CHAR(SYSDATE, 'MON-YY'))
ORDER BY 
    HOU.ORGANIZATION_ID
*/


/*SELECT 
        HOU.ORGANIZATION_ID,
        HOU.SHORT_CODE,
        HOU.NAME,
        CASE WHEN EOA.USER_ID IS NOT NULL AND EOA.ORGANIZATION_ID IS NOT NULL THEN 1 ELSE 0 END AS IS_ASSOCIATED
    FROM 
        HR_OPERATING_UNITS HOU
    LEFT JOIN 
        XXP2P.XXP2P_EMPLOYEE_ORG_ACCESS EOA 
    ON 
        EOA.USER_ID = ${reqData.USER_ID} AND HOU.ORGANIZATION_ID = EOA.ORGANIZATION_ID
    ORDER BY 
        HOU.ORGANIZATION_ID
*/