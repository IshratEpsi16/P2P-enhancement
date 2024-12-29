const isEmpty = require("is-empty");
let table_name = "XXP2P_SUPPLIER_AGENT_DTLS";
let dbName = process.env.DATABASE_NAME;

let userDetails = async (USER_ID) => {
  let query = `
    SELECT 
       USER_ID, 
       USER_NAME, 
    EMPLOYEE_ID, 
        FULL_NAME, 
        USER_TYPE, 
        APPROVAL_STATUS,
         USER_ACTIVE_STATUS, 
         IS_NEW_USER, 
        LAST_LOGIN_TIME, 
        START_DATE, END_DATE, 
        SUPPLIER_ID, MOBILE_NUMBER, CREATED_BY, CREATION_DATE, LAST_UPDATED_BY, LAST_UPDATE_DATE, BUYER_ID, EMAIL_ADDRESS, SUBMISSION_STATUS, IS_REG_COMPLETE, PROPIC_FILE_NAME, PROPIC_ORG_FILE_NAME, REG_TEMPLATE_ID, REG_TEMPLATE_STAGE_LEVEL, PROFILE_UPDATE_TEMPLATE_ID, PROFILE_UPDATE_TEMPLATE_STAGE_LEVEL, PROFILE_UPDATE_STATUS, BUSINESS_GROUP_ID, PAYMENT_METHOD_CODE, INITIATOR_ID, INITIATOR_STATUS, NEW_INFO_TEMPLATE_ID, NEW_INFO_STAGE_LEVEL, NEW_INFO_STATUS, VENDOR_ID, PROFILE_UPDATE_UID, IS_WLC_MSG_SHOWN, PROFILE_NEW_INFO_UID
         FROM XXP2P.XXP2P_USER
         WHERE USER_ID = :USER_ID
  `;
  return query;
};

let organizationDetails = async (USER_ID) => {
  let query = `
select 
bsc.ORGANIZATION_NAME,
bsc.SUPPLIER_ADDRESS,
bsc.ORGANIZATION_TYPE,
bsc.INCORPORATE_IN,
doc.PROFILE_PIC1_FILE_NAME,
doc.PROFILE_PIC2_FILE_NAME
from xxp2p.xxp2p_supplier_bsc_info bsc
left join xxp2p.xxp2p_supplier_registration_documents doc on doc.user_id = bsc.user_id
where bsc.user_id = :USER_ID

    `;
  return query;
};

module.exports = {
  userDetails,
  organizationDetails,
};
