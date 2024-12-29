const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");

const baseurl = process.env.VERSION_1;
router.get(`/role_access`, verifyToken, async (req, res) => {
  let connection;

  try {
    // Create a database connection
    connection = req.dbConnection;
    //let {} = req.body;
    // Create an empty result object
    // const result = {
    //   data2: [],
    // };

    let result = {
      message: `Menu and Roles and Permissions`,
      status: 200,
      data: [],
    };

    // Query distinct role types
    const roleResult = await connection.execute(
      `SELECT DISTINCT ROLE_NAME, ROLE_ID,CAN_DELETE FROM XXP2P.XXP2P_ROLE_MASTER`
    );

    for (const roleRow of roleResult.rows) {
      const role =  {
        ROLE_NAME: roleRow[0],
        ROLE_ID: roleRow[1],
          CAN_DELETE: roleRow[2],
          Permission: [],
          Menu: [],
        
      };

      // Query permissions for the current role
      const permissionQuery = `
          SELECT
            P.PERMISSION_ID,
            P.PERMISSION_NAME,
            P.P_DESCRIPTION,
            CASE WHEN RPM.PERMISSION_ID IS NOT NULL THEN 1 ELSE 0 END AS IS_ASSOCIATED
          FROM
          XXP2P.XXP2P_ROLE_PERMISSIONS P
          LEFT JOIN
          XXP2P.XXP2P_ROLE_PERMISSION_MAPPING RPM ON P.PERMISSION_ID = RPM.PERMISSION_ID
                                         AND RPM.ROLE_ID = :role_id`;

      const permissionResult = await connection.execute(permissionQuery, [
        roleRow[1],
      ]);

      for (const permissionRow of permissionResult.rows) {
        role.Permission.push({
          PERMISSION_ID: permissionRow[0],
          PERMISSION_NAME: permissionRow[1],
          DESCRIPTION: permissionRow[2],
          IS_ASSOCIATED: permissionRow[3],
        });
      }

      // Query menus for the current role
      const menuQuery = `
        SELECT
        MM.MENU_ID,
        MM.MENU_NAME,
        MM.IS_ACTIVE,
        MM.ROUTE_NAME,
        MM.MENU_SEQUENCE,
        CASE WHEN MR.MENU_ID IS NOT NULL THEN 1 ELSE 0 END AS IS_ASSOCIATED
    FROM
        XXP2P.XXP2P_MENU_MASTER MM
    LEFT JOIN
        XXP2P.XXP2P_MENU_ROLES MR ON MM.MENU_ID = MR.MENU_ID AND MR.ROLE_ID = :role_id
    ORDER BY
        MM.MENU_SEQUENCE ASC`;

      const menuResult = await connection.execute(menuQuery, [roleRow[1]]);

      for (const menuRow of menuResult.rows) {
        role.Menu.push({
          MENU_ID: menuRow[0],
          MENU_NAME: menuRow[1],
          IS_ACTIVE: menuRow[2],
          ROUTE_NAME: menuRow[3],
          MENU_SEQUENCE: menuRow[4],
          IS_ASSOCIATED: menuRow[5],
        });
      }

      result.data.push(role);
    }

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
});

module.exports = router;
