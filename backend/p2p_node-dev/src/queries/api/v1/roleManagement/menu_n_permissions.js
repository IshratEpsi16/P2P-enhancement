const isEmpty = require("is-empty");

let allPermissions = async () => {
  let query = `SELECT
  P.PERMISSION_ID,
  P.PERMISSION_NAME,
  P.P_DESCRIPTION
FROM
XXP2P.XXP2P_ROLE_PERMISSIONS P`;
  return query;
};

let allMenu = async () => {
  let query = `SELECT
  MM.MENU_ID,
  MM.MENU_NAME
FROM
  XXP2P.XXP2P_MENU_MASTER MM
WHERE
  MM.IS_ACTIVE = 1
ORDER BY
  MM.MENU_SEQUENCE ASC`;
  return query;
};

module.exports = {
    allPermissions,
    allMenu,
};
