const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const {
  userRoleAuthorization,
  userPermissionAuthorization,
} = require("../../../../middleware/authorization");

const baseurl = process.env.VERSION_1;
router.post(
  `/insert-delete-org`,
  verifyToken,
  userRoleAuthorization,
  userPermissionAuthorization(["EmpOUAccess"]),
  async (req, res) => {
    let connection;

    try {
      // Create a database connection
      connection = req.dbConnection;
      let { USER_ID, ORGANIZATION_ID, SHORT_CODE, NAME } = req.body;
      userId = req.user ? req.user.USER_ID : null;

      // Query permissions for the current role
      const orgQuery = `
   
        DECLARE
        v_user_id XXP2P.XXP2P_EMPLOYEE_ORG_ACCESS.USER_ID%TYPE := :USER_ID;
        v_org_id XXP2P.XXP2P_EMPLOYEE_ORG_ACCESS.ORGANIZATION_ID%TYPE := :ORGANIZATION_ID;
        v_short_code XXP2P.XXP2P_EMPLOYEE_ORG_ACCESS.SHORT_CODE%TYPE := :SHORT_CODE;
        v_name XXP2P.XXP2P_EMPLOYEE_ORG_ACCESS.NAME%TYPE := :NAME;
        v_error_msg VARCHAR2(100);
        IS_EXIST NUMBER := 0;

        BEGIN
        BEGIN
            SELECT 1
            INTO IS_EXIST
            FROM XXP2P.XXP2P_EMPLOYEE_ORG_ACCESS
            WHERE USER_ID = v_user_id AND ORGANIZATION_ID = v_org_id;

        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                IS_EXIST := 0;
        END;

        IF IS_EXIST = 0 THEN
            INSERT INTO XXP2P.XXP2P_EMPLOYEE_ORG_ACCESS (
                USER_ID,
                ORGANIZATION_ID,
                SHORT_CODE,
                NAME,
                CREATED_BY
            ) VALUES (
                v_user_id,
                v_org_id,
                v_short_code,
                v_name,
                :userId
            );
            :MESSAGE := 'Access Granted Successfully';
            :STATUS := 200;
        ELSIF IS_EXIST = 1 THEN 
            DELETE FROM XXP2P.XXP2P_EMPLOYEE_ORG_ACCESS
            WHERE USER_ID = v_user_id AND ORGANIZATION_ID = v_org_id;
            :MESSAGE := 'Access Revoke Successfully';
            :STATUS := 200;
        END IF;

        COMMIT;

        EXCEPTION
        WHEN OTHERS THEN
            v_error_msg := SQLERRM;
            :MESSAGE := 'Error: ' || v_error_msg;
            :STATUS := 400;
        END;
      `;
      const orgResult = await connection.execute(orgQuery, {
        userId: userId,
        USER_ID,
        ORGANIZATION_ID,
        SHORT_CODE,
        NAME,
        MESSAGE: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        STATUS: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      });

      let value = {
        message: orgResult.outBinds.MESSAGE,
        status: orgResult.outBinds.STATUS,
      };

      return res.status(200).json(value);
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
