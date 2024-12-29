const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const loginModel = require("./../../../../models/api/v1/authentication/login");
const baseurl = process.env.VERSION_1;

router.post(`/user-role-list`, verifyToken, async (req, res) => {
  let connection;

  try {
    // Create a database connection
    connection = req.dbConnection;
    let { SEARCH_VALUE, P_OFFSET, P_LIMIT } = req.body;
    userId = req.user ? req.user.USER_ID : null;

    let result = {
      message: `User Role List`,
      status: 200,
      total: 0,
      data: [],
    };

    const totalRowCountQuery = `
SELECT COUNT(us.USER_ID) AS TOTAL_ROWS
  FROM XXP2P.XXP2P_USER us
  LEFT JOIN XXP2P.XXP2P_USER_ROLES ur ON us.USER_ID = ur.USER_ID
  LEFT JOIN XXP2P.XXP2P_ROLE_MASTER rm ON rm.ROLE_ID = ur.ROLE_ID
  LEFT JOIN XXP2P.XXP2P_SUPPLIER_BSC_INFO bsc ON bsc.USER_ID = us.USER_ID
  WHERE UPPER(us.FULL_NAME) LIKE '%' || UPPER(NVL(:SEARCH_VALUE, '')) || '%'
    OR us.USER_ID LIKE '%' || NVL(:SEARCH_VALUE, '') || '%'
    OR UPPER(us.USER_TYPE) LIKE '%' || UPPER(NVL(:SEARCH_VALUE, '')) || '%'
    OR UPPER(bsc.ORGANIZATION_NAME) LIKE '%' || UPPER(NVL(:SEARCH_VALUE, '')) || '%'
    AND APPROVAL_STATUS = 'APPROVED'
            AND USER_ACTIVE_STATUS = 1
            AND IS_NEW_USER =0
`;

    const totalRowCountResult = await connection.execute(totalRowCountQuery, {
      SEARCH_VALUE,
    });
    const totalRowCount = totalRowCountResult.rows[0][0];

    result.total = totalRowCount;

    let updateResult = await connection.execute(
      `
           SELECT 
            us.USER_ID,
            us.USER_NAME,
                        CASE 
            WHEN us.USER_TYPE = 'Supplier' THEN bsc.ORGANIZATION_NAME
            ELSE us.FULL_NAME
            END AS FULL_NAME,
            us.USER_TYPE,
            us.SUPPLIER_ID,
            us.VENDOR_ID,
            us.PROFILE_UPDATE_UID,
            us.PROFILE_NEW_INFO_UID,
            us.INITIATOR_ID,
            us.NEW_INFO_INITIATOR_ID,
            NVL(LISTAGG(rm.ROLE_NAME, ', ') WITHIN GROUP (ORDER BY rm.ROLE_NAME), 'N/A') AS ROLE_NAMES
          FROM 
            XXP2P.XXP2P_USER us
            LEFT JOIN 
            XXP2P.XXP2P_USER_ROLES ur ON us.USER_ID = ur.USER_ID
            LEFT JOIN 
            XXP2P.XXP2P_ROLE_MASTER rm ON rm.ROLE_ID = ur.ROLE_ID
            LEFT JOIN 
            XXP2P.XXP2P_SUPPLIER_BSC_INFO bsc ON bsc.USER_ID = us.USER_ID
          WHERE
            UPPER(us.FULL_NAME) LIKE '%' || UPPER(NVL(:SEARCH_VALUE, '')) || '%'
            OR us.USER_ID LIKE '%' || NVL(:SEARCH_VALUE, '') || '%'
            OR UPPER(us.USER_TYPE) LIKE '%' || UPPER(NVL(:SEARCH_VALUE, '')) || '%'
             OR UPPER(us.EMAIL_ADDRESS) LIKE '%' || UPPER(NVL(:SEARCH_VALUE, '')) || '%'
             OR UPPER(us.MOBILE_NUMBER) LIKE '%' || UPPER(NVL(:SEARCH_VALUE, '')) || '%'
             OR UPPER(us.MOBILE_NUMBER) LIKE '%' || UPPER(NVL(:SEARCH_VALUE, '')) || '%'
             OR UPPER(us.SUPPLIER_ID) LIKE '%' || UPPER(NVL(:SEARCH_VALUE, '')) || '%'
             OR UPPER(bsc.ORGANIZATION_NAME) LIKE '%' || UPPER(NVL(:SEARCH_VALUE, '')) || '%'
            AND APPROVAL_STATUS = 'APPROVED'
            --AND USER_ACTIVE_STATUS = 1
            --AND IS_NEW_USER =0
          GROUP BY 
            us.USER_ID, us.USER_NAME, us.FULL_NAME, us.USER_TYPE,us.SUPPLIER_ID,
            us.VENDOR_ID,bsc.ORGANIZATION_NAME,
            us.PROFILE_UPDATE_UID,
            us.PROFILE_NEW_INFO_UID,
            us.INITIATOR_ID,
            us.NEW_INFO_INITIATOR_ID
            OFFSET :P_OFFSET ROWS FETCH NEXT :P_LIMIT ROWS ONLY
          
        `,
      {
        SEARCH_VALUE,
        P_OFFSET,
        P_LIMIT,
      }
    );

    // for (const menuRow of updateResult.rows) {
    //   result.data.push({
    //     USER_ID: menuRow[0],
    //     USER_NAME: menuRow[1],
    //     FULL_NAME: menuRow[2],
    //     USER_TYPE: menuRow[3],
    //     ROLE_NAMES: menuRow[4],
    //   });
    // }

    let queryBasicInfo,
      initiatorStatusResult,
      initiatorStatusResultPUN,
      rowObjectBasic,
      initiatorStatusResultObject,
      initiatorStatusResultObjectPUN = {};

    //console.log(updateResult);
    await commonObject.makeArrayObject(updateResult);
    result.data = updateResult.queryResult.finalData;
    for (let i = 0; i < result.data.length; i++) {
      if (result.data[i].USER_TYPE == "Supplier") {
        [initiatorStatusResult, initiatorStatusResultPUN] = await Promise.all([
          loginModel.initiatorStatus(
            result.data[i].INITIATOR_ID,
            result.data[i].USER_ID,
            "PU",
            result.data[i].PROFILE_UPDATE_UID
          ),
          loginModel.initiatorStatus(
            result.data[i].NEW_INFO_INITIATOR_ID,
            result.data[i].USER_ID,
            "PUN",
            result.data[i].PROFILE_NEW_INFO_UID
          ),
        ]);
        Promise.all([
          commonObject.makeArrayObject(initiatorStatusResult),
          commonObject.makeArrayObject(initiatorStatusResultPUN),
        ]);
        //queryBasicInfo = await loginModel.getBasicInfo(rowObject.USER_ID);

        //await commonObject.makeArrayObject(queryBasicInfo);

        [initiatorStatusResultObject, initiatorStatusResultObjectPUN] =
          await Promise.all([
            commonObject.convertArrayToObject(
              initiatorStatusResult.queryResult.finalData
            ),
            commonObject.convertArrayToObject(
              initiatorStatusResultPUN.queryResult.finalData
            ),
          ]);
      }
      result.data[i].INITIATOR_STATUS = initiatorStatusResultObject,
      result.data[i].NEW_INFO_INITIATOR_STATUS = initiatorStatusResultObjectPUN
    }
    return res.status(200).json(result);
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
});

module.exports = router;
