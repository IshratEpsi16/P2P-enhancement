const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const isEmpty = require("is-empty");
const commonObject = require("../../../../common/api/v1/common");
const model = require("../../../../models/api/v1/roleManagement/user_active_deactivation");

const baseurl = process.env.VERSION_1;

router.post(`/user-activation`, verifyToken, async (req, res) => {
  let connection;

  try {
    // Create a database connection
    connection = req.dbConnection;
    let { USER_ID, VALUE } = req.body;
    userId = req.user ? req.user.USER_ID : null;

    const updateResult = await connection.execute(
      `
              DECLARE
              Z_USER_ID XXP2P.XXP2P_USER.USER_ID%TYPE :=:USER_ID;
              Z_USER_ACTIVE_STATUS XXP2P.XXP2P_USER.USER_ACTIVE_STATUS%TYPE :=:VALUE;
              Z_USER_EXIST NUMBER:=0;
              Z_USER_APPROVED NUMBER:=0;
              BEGIN

              SELECT COUNT(*) INTO Z_USER_EXIST
              from XXP2P.XXP2P_USER
              WHERE USER_ID = Z_USER_ID;

              SELECT COUNT(*) INTO Z_USER_APPROVED
              from XXP2P.XXP2P_USER
              WHERE APPROVAL_STATUS != 'APPROVED'
              AND USER_ID = Z_USER_ID;

                  IF Z_USER_EXIST = 0
                  THEN
                  :MESSAGE:= 'User Not Exist!';
                  :STATUS := 401;
                  ELSIF Z_USER_APPROVED > 0 AND Z_USER_EXIST > 0
                  THEN
                  :MESSAGE := 'User Not Approved'; 
                  :STATUS := 401;
                  ELSE
                      UPDATE XXP2P.XXP2P_USER SET USER_ACTIVE_STATUS = Z_USER_ACTIVE_STATUS,
                      LAST_UPDATED_BY = :userId
                      WHERE USER_ID = Z_USER_ID;
                      COMMIT;
                      
                      IF Z_USER_ACTIVE_STATUS = 1
                      THEN 
                      :MESSAGE := 'Activated';
                      :STATUS := 200;
                      ELSIF Z_USER_ACTIVE_STATUS = 0
                      THEN 
                      :MESSAGE := 'Deactivated';
                      :STATUS := 200;
                      END IF;
                  
                  END IF;
                  EXCEPTION
        WHEN OTHERS THEN
            :MESSAGE := 'An error occurred: ' || SQLERRM;
            :STATUS := 401;
                  
              END; 
    

          `,
      {
        userId,
        USER_ID,
        VALUE,
        MESSAGE: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        STATUS: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      }
    );

    //   let getUser = await connection.execute(
    //     `select USER_ID from  xxp2p.xxp2p_user
    // where USER_ID = :USER_ID
    // and USER_TYPE = 'Supplier'
    // and  APPROVAL_STATUS = 'APPROVED'
    // and IS_REG_COMPLETE = 1
    //         `,
    //     {
    //       USER_ID,
    //     }
    //   );
    //   //console.log(updateResult.outBinds.MESSAGE);
    //   await commonObject.makeArrayObject(getUser);
    //   let rowObject = await commonObject.convertArrayToObject(
    //     getUser.queryResult.finalData
    //   );
    //   //console.log(rowObject.USER_ID);
    //   if (!isEmpty(rowObject.USER_ID) && VALUE  == 1) {
    //     let result = await connection.execute(
    //       `begin
    //         APPS.xx_supplier_p2p_pkg.active_supplier(:USER_ID);
    //         end;
    //           `,
    //       {
    //         USER_ID,
    //       }
    //     );
    //     console.log(result);
    //   }
    //   if (!isEmpty(rowObject.USER_ID) && VALUE  == 0) {
    //     let result = await connection.execute(
    //       `begin
    //         APPS.xx_supplier_p2p_pkg.inactive_supplier(:USER_ID);
    //         end;
    //           `,
    //       {
    //         USER_ID,
    //       }
    //     );
    //     console.log(result);
    //   }

    let value = {
      message: updateResult.outBinds.MESSAGE,
      status: updateResult.outBinds.STATUS,
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
});


router.post(
  `/edit-permission`,
  verifyToken,
  async (req, res) => {
    let whereData = {};
    let updateData = {};
    userId = req.user ? req.user.USER_ID : null;
    try {
      let value = {
        message: ``,
        status: 200,
      };
      let reqData = {
        USER_ID: req.body.USER_ID,
        SUBMISSION_STATUS: req.body.SUBMISSION_STATUS
      };
      console.log(reqData);

      if (isEmpty(reqData.USER_ID)) {
        value.message = "PLease Give User ID.";
        value.status = 400;
        return res.status(value.status).json(value);
      }
      
      updateData.SUBMISSION_STATUS = reqData.SUBMISSION_STATUS;
      updateData.LAST_UPDATED_BY = userId;
      whereData.USER_ID = reqData.USER_ID;

      //! Data
      let queryResultUpdate = await model.submissionStatusUpdate(updateData, whereData);

      console.log(queryResultUpdate);
      value.message =
        queryResultUpdate.rowsAffected > 0
          ? "Information Updated Successfully"
          : "Information Not Updated! Pease Try Again.";
      value.status = queryResultUpdate.rowsAffected > 0 ? 200 : 500;
      return res.status(value.status).json(value);
    } catch (error) {
      logger.info(error);
      logger.error(error);
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);


module.exports = router;
