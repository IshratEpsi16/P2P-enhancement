const isEmpty = require("is-empty");

let myInfoUserCheck = async (userId) => {
  let query = 
  `
  SELECT
  us.USER_ID,
  us.USER_NAME,
  CASE 
    WHEN us.USER_TYPE = 'Supplier' THEN bsc.ORGANIZATION_NAME
    ELSE us.FULL_NAME
  END AS FULL_NAME,
  us.EMAIL_ADDRESS,
  us.USER_TYPE,
  us.EMPLOYEE_ID,
  us.BUYER_ID,
  us.VENDOR_ID,
  us.SUPPLIER_ID,
  us.MOBILE_NUMBER,
  us.PROFILE_UPDATE_STATUS,
  us.NEW_INFO_STATUS,
  us.BUSINESS_GROUP_ID,
  us.DEPARTMENT,
  (SELECT NAME FROM per_business_groups WHERE BUSINESS_GROUP_ID = us.BUSINESS_GROUP_ID) AS BUSINESS_GROUP_NAME,
  CASE
    WHEN us.USER_TYPE = 'Supplier' THEN srd.PROFILE_PIC1_FILE_NAME
    ELSE us.PROPIC_FILE_NAME
  END AS PROFILE_PIC_FILE_NAME,
  bsc.ORGANIZATION_NAME
FROM
  XXP2P.XXP2P_USER us
LEFT JOIN XXP2P.XXP2P_SUPPLIER_REGISTRATION_DOCUMENTS srd ON us.USER_ID = srd.USER_ID
LEFT JOIN XXP2P.XXP2P_SUPPLIER_BSC_INFO bsc ON bsc.USER_ID = us.USER_ID
WHERE
  us.USER_ID = :userId
  `
  // `SELECT 
  // USER_ID,
  // USER_NAME,
  // FULL_NAME,
  // EMAIL_ADDRESS,
  // USER_TYPE,
  // PROPIC_FILE_NAME,
  // PROPIC_ORG_FILE_NAME
  //  FROM XXP2P.XXP2P_USER
  //  WHERE USER_ID = :userId`
   ;
  return query;
};

let myInfoUserMenu = async (userId, DEVICE) => {
  let query = `SELECT 
  MR.MENU_ID,
  MM.MENU_NAME
  FROM 
  XXP2P.XXP2P_USER_ROLES UR 
  LEFT JOIN XXP2P.XXP2P_MENU_ROLES MR ON MR.ROLE_ID = UR.ROLE_ID
  LEFT JOIN XXP2P.XXP2P_MENU_MASTER MM ON MM.MENU_ID = MR.MENU_ID
      AND MM.IS_ACTIVE = 1
      AND MM.DEVICE = UPPER(:DEVICE)
  WHERE UR.USER_ID = :userId
  ORDER BY MM.MENU_SEQUENCE`;
  return query;
};

let myInfoUserPermission = async (userId) => {
  let query = `SELECT
  rpm.PERMISSION_ID,
  rp.PERMISSION_NAME,
  rp.P_DESCRIPTION
FROM
  XXP2P.XXP2P_USER_ROLES ur
JOIN
  XXP2P.XXP2P_ROLE_PERMISSION_MAPPING rpm ON ur.ROLE_ID = rpm.ROLE_ID
JOIN
  XXP2P.XXP2P_ROLE_PERMISSIONS rp ON rpm.PERMISSION_ID = rp.PERMISSION_ID
WHERE
  ur.USER_ID = :userId`;
  return query;
};

module.exports = {
  myInfoUserCheck,
  myInfoUserMenu,
  myInfoUserPermission,
};