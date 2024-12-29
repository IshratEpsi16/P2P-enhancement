const isEmpty = require("is-empty");

let loginWithEmail = async (EMAIL) => {
  let query = `SELECT *
  FROM XXP2P.XXP2P_USER
  WHERE 
  TO_CHAR(USER_NAME) = TO_CHAR(:EMAIL) 
  or 
  TO_CHAR(SUPPLIER_ID) = TO_CHAR(:EMAIL)
  OR
  EMAIL_ADDRESS = TO_CHAR(:EMAIL)`;
  return query;
};

let loginWithPassword = async (USER_PASS, salt_password) => {
  let query = `DECLARE
    BEGIN
       :hashed_password := DBMS_CRYPTO.HASH(
         src => UTL_I18N.STRING_TO_RAW(:USER_PASS || RAWTOHEX(:salt_password), 'AL32UTF8'),
         typ => DBMS_CRYPTO.HASH_SH512
       );
     END;`;
  return query;
};

let loginTimeUpdate = async (USER_ID) => {
  let query = `DECLARE
    BEGIN
    update 
     xxp2p.XXP2P_USER 
     set LAST_LOGIN_TIME = sysdate
     where USER_ID = :USER_ID;
     COMMIT;
    END;`;
  return query;
};
let updateMsgShownStatus = async (USER_ID) => {
  let query = `DECLARE
    BEGIN
    update 
     xxp2p.XXP2P_USER 
     set IS_WLC_MSG_SHOWN = 1
     where USER_ID = :USER_ID;
     COMMIT;
    END;`;
  return query;
};

let getBasicInfo = async (USER_ID) => {
  let query = `select * FROM XXP2P.XXP2P_SUPPLIER_BSC_INFO 
  where user_id = :USER_ID`;
  return query;
};

let initiatorStatus = async (
  INITIATOR_ID,
  USER_ID,
  object_type_code,
  PROFILE_UPDATE_UID
) => {
  let query = `SELECT 
    us.FULL_NAME,
    NVL(TO_NUMBER(ah.ACTION_CODE),3)ACTION_CODE,
    NVL(TO_CHAR(ah.ACTION_DATE, 'DD-MON-YYYY HH:MI AM'), '--') AS ACTION_DATE,
    NVL(TO_CHAR(ah.NOTE),'--')NOTE
    from  xxp2p.xxp2p_user us
    left join xxp2p.xxp2p_approve_history ah 
    ON us.user_id = ah.APPROVER_ID
    and ah.object_id = :USER_ID
AND 
    ah.object_type_code = :object_type_code
    AND ah.PROFILE_UPDATE_UID =:PROFILE_UPDATE_UID
where 
us.user_id = :INITIATOR_ID
    ORDER BY 
    ah.HISTORY_ID DESC
FETCH FIRST ROW ONLY`;
  return query;
};

module.exports = {
  loginWithEmail,
  loginWithPassword,
  loginTimeUpdate,
  getBasicInfo,
  updateMsgShownStatus,
  initiatorStatus,
};
