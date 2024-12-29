

let employeeList = async () => {
  let query = 
  `
    SELECT 
    USER_ID,
    USER_NAME,
    FULL_NAME,
    EMAIL_ADDRESS,
    USER_TYPE,
    BUYER_ID,
    EMPLOYEE_ID,
    PROPIC_FILE_NAME,
    PROPIC_ORG_FILE_NAME,
    END_DATE
    FROM
    XXP2P.XXP2P_USER
    WHERE APPROVAL_STATUS = 'APPROVED'
    AND USER_ACTIVE_STATUS = 1
    --AND (END_DATE >= SYSDATE OR END_DATE IS NULL) 
    AND USER_TYPE <> 'Supplier'
    ORDER BY CREATION_DATE
  `;
  return query;
};



module.exports = {
    employeeList
};
