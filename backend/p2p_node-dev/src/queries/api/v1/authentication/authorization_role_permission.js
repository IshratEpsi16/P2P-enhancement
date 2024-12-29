const isEmpty = require("is-empty");

let empRoles = async (userId) => {
  let query = `
  select 
ur.USER_ID, 
ur.ROLE_ID,
rm.ROLE_NAME
from
XXP2P.XXP2P_USER_ROLES ur
LEFT JOIN XXP2P.XXP2P_ROLE_MASTER rm ON rm.ROLE_ID = ur.ROLE_ID
where ur.USER_ID = :userId
  `;
  return query;
};

let empRolePermissions = async (userId) => {
  let query = `
  select 
rpm.PERMISSION_ID,
rp.PERMISSION_NAME,
P_DESCRIPTION
from
XXP2P.XXP2P_USER_ROLES ur
LEFT JOIN XXP2P.XXP2P_ROLE_PERMISSION_MAPPING rpm ON rpm.ROLE_ID = ur.ROLE_ID
LEFT JOIN XXP2P.XXP2P_ROLE_PERMISSIONS rp ON rp.PERMISSION_ID = rpm.PERMISSION_ID
where ur.USER_ID = :userId`;
  return query;
};

module.exports = {
  empRoles,
  empRolePermissions,
};
