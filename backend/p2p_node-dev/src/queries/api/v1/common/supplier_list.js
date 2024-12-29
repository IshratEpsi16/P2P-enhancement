let supplierTotalCount = async (
  USER_ACTIVE_STATUS,
  APPROVAL_STATUS,
  SUBMISSION_STATUS,
  IS_REG_COMPLETE,
  SEARCH_VALUE
) => {
  // let keys = Object.keys(data);
  // if (!keys.includes('USER_ID') || !keys.includes('PROPIC_FILE_NAME') || !keys.includes('PROPIC_ORG_FILE_NAME')) {
  //   throw new Error('USER_ID, PROPIC_FILE_NAME, and PROPIC_ORG_FILE_NAME are required fields.');
  // }
  let query = `
    SELECT
count(us.USER_ID) AS TOTAL
FROM XXP2P.XXP2P_USER us 
LEFT JOIN XXP2P.XXP2P_SUPPLIER_REGISTRATION_DOCUMENTS rgd ON rgd.USER_ID = us.USER_ID
LEFT JOIN XXP2P.XXP2P_SUPPLIER_BSC_INFO bsc ON bsc.USER_ID = us.USER_ID
WHERE us.USER_TYPE = 'Supplier'
AND us.USER_ACTIVE_STATUS = :USER_ACTIVE_STATUS
AND us.APPROVAL_STATUS = NVL(:APPROVAL_STATUS,us.APPROVAL_STATUS)
AND us.SUBMISSION_STATUS = NVL(:SUBMISSION_STATUS,us.SUBMISSION_STATUS)
AND us.IS_REG_COMPLETE = NVL(:IS_REG_COMPLETE,us.IS_REG_COMPLETE)
AND (
        LOWER(us.USER_NAME) LIKE '%' || LOWER(NVL(:SEARCH_VALUE, us.USER_NAME)) || '%'
        OR LOWER(bsc.ORGANIZATION_NAME) LIKE '%' || LOWER(NVL(:SEARCH_VALUE, bsc.ORGANIZATION_NAME)) || '%'
        OR LOWER(us.EMAIL_ADDRESS) LIKE '%' || LOWER(NVL(:SEARCH_VALUE, us.EMAIL_ADDRESS)) || '%'
    )
    `;
  return query;
};

let supplierList = async (
  USER_ACTIVE_STATUS,
  APPROVAL_STATUS,
  SUBMISSION_STATUS,
  IS_REG_COMPLETE,
  SEARCH_VALUE,
  OFFSET,
  LIMIT
) => {
  // let keys = Object.keys(data);
  // if (!keys.includes('USER_ID') || !keys.includes('PROPIC_FILE_NAME') || !keys.includes('PROPIC_ORG_FILE_NAME')) {
  //   throw new Error('USER_ID, PROPIC_FILE_NAME, and PROPIC_ORG_FILE_NAME are required fields.');
  // }
  let query =
   /*`SELECT
  us.USER_ID,
  us.USER_NAME,
  NVL(us.FULL_NAME,'N/A') AS FULL_NAME,
  bsc.ORGANIZATION_NAME,
  NVL(TO_CHAR(us.SUPPLIER_ID),'N/A') AS SUPPLIER_ID,
  us.APPROVAL_STATUS,
  us.USER_ACTIVE_STATUS,
  us.EMAIL_ADDRESS,
  us.MOBILE_NUMBER,
  us.SUBMISSION_STATUS,
  us.IS_REG_COMPLETE,
  rgd.PROFILE_PIC1_FILE_NAME,
  rgd.PROFILE_PIC2_FILE_NAME
  FROM XXP2P.XXP2P_USER us 
  LEFT JOIN XXP2P.XXP2P_SUPPLIER_REGISTRATION_DOCUMENTS rgd ON rgd.USER_ID = us.USER_ID
  LEFT JOIN XXP2P.XXP2P_SUPPLIER_BSC_INFO bsc ON bsc.USER_ID = us.USER_ID
  WHERE us.USER_TYPE = 'Supplier'
  AND us.USER_ACTIVE_STATUS = :USER_ACTIVE_STATUS
  AND us.APPROVAL_STATUS = NVL(:APPROVAL_STATUS,us.APPROVAL_STATUS)
  AND us.SUBMISSION_STATUS = NVL(:SUBMISSION_STATUS,us.SUBMISSION_STATUS)
  AND us.IS_REG_COMPLETE = NVL(:IS_REG_COMPLETE,us.IS_REG_COMPLETE)
  AND (
          LOWER(us.USER_NAME) LIKE '%' || LOWER(NVL(:SEARCH_VALUE, us.USER_NAME)) || '%'
          OR LOWER(bsc.ORGANIZATION_NAME) LIKE '%' || LOWER(NVL(:SEARCH_VALUE, bsc.ORGANIZATION_NAME)) || '%'
          OR LOWER(us.EMAIL_ADDRESS) LIKE '%' || LOWER(NVL(:SEARCH_VALUE, us.EMAIL_ADDRESS)) || '%'
      )
      order by BSC.CREATION_DATE   
      OFFSET :OFFSET ROWS 
    FETCH NEXT :LIMIT ROWS ONLY 
    `;*/
    `SELECT
  us.USER_ID,
  us.USER_NAME,
  NVL(us.FULL_NAME, 'N/A') AS FULL_NAME,
  bsc.ORGANIZATION_NAME,
  NVL(TO_CHAR(us.SUPPLIER_ID), 'N/A') AS SUPPLIER_ID,
  us.APPROVAL_STATUS,
  us.USER_ACTIVE_STATUS,
  us.EMAIL_ADDRESS,
  us.MOBILE_NUMBER,
  us.SUBMISSION_STATUS,
  us.IS_REG_COMPLETE,
  rgd.PROFILE_PIC1_FILE_NAME,
  rgd.PROFILE_PIC2_FILE_NAME,
   NVL(MAX(To_char(sih.CREATION_DATE)), 'Not Sent Yet') AS EMAIL_SENT_TIME,
  nvl(buyer.FULL_NAME,'N/A') AS BUYER_NAME
FROM XXP2P.XXP2P_USER us 
LEFT JOIN XXP2P.XXP2P_SUPPLIER_REGISTRATION_DOCUMENTS rgd ON rgd.USER_ID = us.USER_ID
LEFT JOIN XXP2P.XXP2P_SUPPLIER_BSC_INFO bsc ON bsc.USER_ID = us.USER_ID
LEFT JOIN xxp2p.xxp2p_supplier_invitation_history sih ON sih.INVITED_EMAIL = us.EMAIL_ADDRESS
AND sih.SUPPLIER_INVITATION_TYPE = 'EXISTING'
LEFT JOIN XXP2P.XXP2P_USER buyer ON buyer.USER_ID = sih.INVITED_BY_BUYER_ID  -- Join to get buyer's full name
WHERE us.USER_TYPE = 'Supplier'
AND us.USER_ACTIVE_STATUS = :USER_ACTIVE_STATUS
AND us.APPROVAL_STATUS = NVL(:APPROVAL_STATUS, us.APPROVAL_STATUS)
AND us.SUBMISSION_STATUS = NVL(:SUBMISSION_STATUS, us.SUBMISSION_STATUS)
AND us.IS_REG_COMPLETE = NVL(:IS_REG_COMPLETE, us.IS_REG_COMPLETE)
AND (
    LOWER(us.USER_NAME) LIKE '%' || LOWER(NVL(:SEARCH_VALUE, us.USER_NAME)) || '%'
    OR LOWER(bsc.ORGANIZATION_NAME) LIKE '%' || LOWER(NVL(:SEARCH_VALUE, bsc.ORGANIZATION_NAME)) || '%'
    OR LOWER(us.EMAIL_ADDRESS) LIKE '%' || LOWER(NVL(:SEARCH_VALUE, us.EMAIL_ADDRESS)) || '%'
    OR LOWER(us.SUPPLIER_ID) LIKE '%' || LOWER(NVL(:SEARCH_VALUE, us.SUPPLIER_ID)) || '%'
)
GROUP BY
  us.USER_ID,
  us.USER_NAME,
  us.FULL_NAME,
  bsc.ORGANIZATION_NAME,
  us.SUPPLIER_ID,
  us.APPROVAL_STATUS,
  us.USER_ACTIVE_STATUS,
  us.EMAIL_ADDRESS,
  us.MOBILE_NUMBER,
  us.SUBMISSION_STATUS,
  us.IS_REG_COMPLETE,
  rgd.PROFILE_PIC1_FILE_NAME,
  rgd.PROFILE_PIC2_FILE_NAME,
  buyer.FULL_NAME  -- Group by this column as well
ORDER BY bsc.ORGANIZATION_NAME  
OFFSET :OFFSET ROWS 
FETCH NEXT :LIMIT ROWS ONLY`;
  return query;
  /*
  SELECT
    us.USER_ID,
    us.USER_NAME,
    NVL(us.FULL_NAME,'N/A') AS FULL_NAME,
    bsc.ORGANIZATION_NAME,
    NVL(TO_CHAR(us.SUPPLIER_ID),'N/A') AS SUPPLIER_ID,
    us.APPROVAL_STATUS,
    us.EMAIL_ADDRESS,
    us.SUBMISSION_STATUS,
    us.IS_REG_COMPLETE,
    rgd.PROFILE_PIC1_FILE_NAME,
    rgd.PROFILE_PIC2_FILE_NAME
    FROM XXP2P.XXP2P_USER us 
    LEFT JOIN XXP2P.XXP2P_SUPPLIER_REGISTRATION_DOCUMENTS rgd ON rgd.USER_ID = us.USER_ID
    LEFT JOIN XXP2P.XXP2P_SUPPLIER_BSC_INFO bsc ON bsc.USER_ID = us.USER_ID
    WHERE us.USER_TYPE = 'Supplier'
    AND us.USER_ACTIVE_STATUS = 1
    AND us.APPROVAL_STATUS = NVL(:APPROVAL_STATUS,us.APPROVAL_STATUS)
    AND us.SUBMISSION_STATUS = NVL(:SUBMISSION_STATUS,us.SUBMISSION_STATUS)
    AND us.IS_REG_COMPLETE = NVL(:IS_REG_COMPLETE,us.IS_REG_COMPLETE)
    AND (
            LOWER(us.USER_NAME) LIKE '%' || LOWER(NVL(:SEARCH_VALUE, us.USER_NAME)) || '%'
            OR LOWER(bsc.ORGANIZATION_NAME) LIKE '%' || LOWER(NVL(:SEARCH_VALUE, bsc.ORGANIZATION_NAME)) || '%'
            OR LOWER(us.EMAIL_ADDRESS) LIKE '%' || LOWER(NVL(:SEARCH_VALUE, us.EMAIL_ADDRESS)) || '%'
        )
  */
};

module.exports = {
  supplierList,
  supplierTotalCount,
};