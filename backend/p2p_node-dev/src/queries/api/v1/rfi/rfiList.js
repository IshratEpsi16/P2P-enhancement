let rfiList = async (
  VIEWER_ID,
  VIEWER_ACTION,
  INITIATOR_ID,
  OBJECT_ID,
  OBJECT_TYPE
) => {
  let query = `
      SELECT
    RFI.ID,
    RFI.OBJECT_ID,
    (SELECT FULL_NAME from XXP2P.XXP2P_USER where user_id = RFI.OBJECT_ID and RFI.OBJECT_TYPE = 'Supplier Approval') AS SUPPLIER_FULL_NAME,
    (SELECT USER_NAME from XXP2P.XXP2P_USER where user_id = RFI.OBJECT_ID and RFI.OBJECT_TYPE = 'Supplier Approval') AS SUPPLIER_USER_NAME,
    (SELECT ORGANIZATION_NAME from XXP2P.XXP2P_SUPPLIER_BSC_INFO where user_id = RFI.OBJECT_ID and RFI.OBJECT_TYPE = 'Supplier Approval') AS SUPPLIER_ORGANIZATION_NAME,
    RFI.OBJECT_TYPE,
    RFI.INITIATOR_ID,
    (SELECT NVL(PROPIC_FILE_NAME,'N/A') FROM XXP2P.XXP2P_USER WHERE USER_ID = RFI.INITIATOR_ID) as INITIATOR_PRO_PIC,
    (SELECT FULL_NAME from XXP2P.XXP2P_USER where user_id = RFI.INITIATOR_ID) AS INITIATOR_NAME,
    RFI.INITIATION_DATE,
    INITCAP(REPLACE(LOWER(RFI.INITIATOR_NOTE), ' ', '  ')) as INITIATOR_NOTE,
    RFI.VIEWER_ID,
    (SELECT FULL_NAME from XXP2P.XXP2P_USER where user_id = RFI.VIEWER_ID) AS VIEWER_NAME,
     (SELECT NVL(PROPIC_FILE_NAME,'N/A') FROM XXP2P.XXP2P_USER WHERE USER_ID = RFI.VIEWER_ID) as VIEWER_PRO_PIC,
    RFI.VIEW_DATE,
    INITCAP(REPLACE(LOWER(RFI.VIEWER_NOTE), ' ', '  ')) as VIEWER_NOTE,
    RFI.VIEWER_ACTION,
    RFI.TEMPLATE_ID,
    RFI.STAGE_LEVEL

FROM
    XXP2P.XXP2P_RFI_INFO RFI
WHERE RFI.VIEWER_ID = NVL(:VIEWER_ID,RFI.VIEWER_ID)
AND  RFI.VIEWER_ACTION = NVL(:VIEWER_ACTION,RFI.VIEWER_ACTION)
AND RFI.INITIATOR_ID = NVL(:INITIATOR_ID,RFI.INITIATOR_ID)
AND RFI.OBJECT_ID = NVL(:OBJECT_ID,RFI.OBJECT_ID)
AND RFI.OBJECT_TYPE = NVL(:OBJECT_TYPE,RFI.OBJECT_TYPE)
    `;
  return query;
};

let rfiTotal = async (
  VIEWER_ID,
  VIEWER_ACTION,
  INITIATOR_ID,
  OBJECT_ID,
  OBJECT_TYPE
) => {
  let query = `SELECT
    COUNT(RFI.ID) AS TOTAL
FROM
    XXP2P.XXP2P_RFI_INFO RFI
    WHERE RFI.VIEWER_ID = NVL(:VIEWER_ID,RFI.VIEWER_ID)
    AND  RFI.VIEWER_ACTION = NVL(:VIEWER_ACTION,RFI.VIEWER_ACTION)
AND RFI.INITIATOR_ID = NVL(:INITIATOR_ID,RFI.INITIATOR_ID)
AND RFI.OBJECT_ID = NVL(:OBJECT_ID,RFI.OBJECT_ID)
AND RFI.OBJECT_TYPE = NVL(:OBJECT_TYPE,RFI.OBJECT_TYPE)
    `;
  return query;
};

module.exports = {
  rfiList,
  rfiTotal,
};
