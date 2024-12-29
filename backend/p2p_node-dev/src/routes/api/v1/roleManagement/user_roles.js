  const express = require("express");
  const router = express.Router();
  router.use(express.json());
  const verifyToken = require("../../../../middleware/jwtValidation");
  const oracledb = require("oracledb");
  const commonObject = require("../../../../common/api/v1/common");
  const userModel = require("../../../../models/api/v1/roleManagement/user_roles");

  const baseurl = process.env.VERSION_1;

  router.post(`/user-roles`, verifyToken, async (req, res) => {
    let connection;

    try {
      let filepath1 = `${process.env.backend_url}${process.env.profile_pic1_file_path_name}`;
      let filepath2 = `${process.env.backend_url}${process.env.profile_pic2_file_path_name}`;
      // Create a database connection
      connection = req.dbConnection;
      let { USER_ID } = req.body;

      let result = {
        message: `User Roles`,
        status: 200,
        profile_pic1: filepath1,
        profile_pic2: filepath2,
        organization_details: "",
        data: [],
      };
      let orgDetails = await userModel.organizationDetails(USER_ID);
      await commonObject.makeArrayObject(orgDetails);
      let rowObject = await commonObject.convertArrayToObject(
        orgDetails.queryResult.finalData
      );

      result.organization_details = rowObject;

      const userBasicQueryResult = await connection.execute(
        `SELECT 
      US.USER_ID, 
      US.USER_NAME, 
      US.EMPLOYEE_ID, 
      US.FULL_NAME, 
      US.USER_TYPE, 
      US.APPROVAL_STATUS,
      US.USER_ACTIVE_STATUS, 
      US.IS_NEW_USER, 
      US.LAST_LOGIN_TIME, 
      US.START_DATE, 
      US.END_DATE, 
      US.SUPPLIER_ID, 
      US.MOBILE_NUMBER, 
      US.CREATED_BY, 
      US.CREATION_DATE, 
      US.LAST_UPDATED_BY, 
      US.LAST_UPDATE_DATE, 
      US.BUYER_ID, 
      US.EMAIL_ADDRESS, 
      US.SUBMISSION_STATUS, 
      US.IS_REG_COMPLETE, 
      US.PROPIC_FILE_NAME, 
      US.PROFILE_UPDATE_STATUS, 
      US.BUSINESS_GROUP_ID, 
      US.PAYMENT_METHOD_CODE, 
      US.INITIATOR_ID, 
      US.INITIATOR_STATUS, 
      US.NEW_INFO_TEMPLATE_ID, 
      US.NEW_INFO_STAGE_LEVEL, 
      US.NEW_INFO_STATUS, 
      US.VENDOR_ID,
      BSC.ORGANIZATION_NAME,
      BSC.INCORPORATE_IN,
      bsc.ORGANIZATION_TYPE,
      RD.PROFILE_PIC1_FILE_NAME,
      RD.PROFILE_PIC2_FILE_NAME
  FROM 
      XXP2P.XXP2P_USER US
  LEFT JOIN XXP2P.XXP2P_SUPPLIER_BSC_INFO BSC ON    BSC.USER_ID = US.USER_ID
  LEFT JOIN XXP2P.XXP2P_SUPPLIER_REGISTRATION_DOCUMENTS RD ON    RD.USER_ID = US.USER_ID
  WHERE 
      US.USER_ID = :USER_ID`,
        [USER_ID]
      );

      if (userBasicQueryResult.rows.length === 0) {
        // User not found
        let value = {
          message: `User not found!`,
          status: 401,
        };
        //res.status(200).json(value);
        return res.status(401).json(value);
      } else {
        await commonObject.makeArrayObject(userBasicQueryResult);
        let rowObject = await commonObject.convertArrayToObject(
          userBasicQueryResult.queryResult.finalData
        );
        for (
          let i = 0;
          i < userBasicQueryResult.queryResult.finalData.length;
          i++
        ) {
          const role = {
            ...userBasicQueryResult.queryResult.finalData[i],
            Role: [], // If you need to reset or initialize Role separately
          };

          // Query for the role
          const roleByUserQuery = `
        SELECT
      rm.ROLE_ID,
      rm.ROLE_NAME,
      CASE WHEN ur.USER_ID IS NOT NULL THEN 1 ELSE 0 END AS IS_ASSOCIATED
      FROM
          XXP2P.XXP2P_ROLE_MASTER rm
      LEFT JOIN
          XXP2P.XXP2P_USER_ROLES ur ON ur.ROLE_ID = rm.ROLE_ID AND ur.USER_ID = :USER_ID`;

          const permissionByRoleQuery = `
    SELECT DISTINCT
      rp.PERMISSION_ID,
      rp.PERMISSION_NAME,
      rp.P_DESCRIPTION
    FROM
      XXP2P.XXP2P_ROLE_PERMISSIONS rp, XXP2P.XXP2P_ROLE_PERMISSION_MAPPING rpm
    WHERE rp.PERMISSION_ID = rpm.PERMISSION_ID
      AND rpm.ROLE_ID = :role_id`;

          const roleResult = await connection.execute(roleByUserQuery, [USER_ID]);

          for (const roleVal of roleResult.rows) {
            const permissionResult = await connection.execute(
              permissionByRoleQuery,
              [roleVal[0]]
            );

            const roleObject = {
              ROLE_ID: roleVal[0],
              ROLE_NAME: roleVal[1],
              IS_ASSOCIATED: roleVal[2],
              RolePermissions: [],
            };

            for (const permVal of permissionResult.rows) {
              roleObject.RolePermissions.push({
                PERMISSION_ID: permVal[0],
                PERMISSION_NAME: permVal[1],
                P_DESCRIPTION: permVal[2],
              });
            }

            role.Role.push(roleObject);
          }

          result.data.push(role);
        }
        return res.status(200).json(result);
      }
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
