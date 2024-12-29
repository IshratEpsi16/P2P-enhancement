let bankList = async (COUNTRY_CODE) => {
  let query = `
  SELECT HOME_COUNTRY,BANK_PARTY_ID,
  INITCAP(BANK_NAME) AS BANK_NAME FROM CE_BANKS_V
WHERE HOME_COUNTRY = UPPER(:COUNTRY_CODE)
AND upper(BANK_NAME) not LIKE upper('%Open%') 
AND upper(BANK_NAME) not LIKE upper('%CASH%') 
AND upper(BANK_NAME) not LIKE upper('%Clear%')
ORDER BY BANK_NAME ASC
    `;
  return query;
};

let branchList = async (BANK_PARTY_ID) => {
  let query = `
  SELECT 
  INITCAP(BB.BANK_BRANCH_NAME) AS BANK_BRANCH_NAME,
BB.BRANCH_PARTY_ID 
FROM CE_BANK_BRANCHES_V  BB
WHERE BB.BANK_PARTY_ID =:BANK_PARTY_ID
    `;
  return query;
};

let bankNameById = async (COUNTRY_CODE,BANK_PARTY_ID) => {
  let query = `
  SELECT
  INITCAP(BANK_NAME) AS BANK_NAME FROM CE_BANKS_V
WHERE HOME_COUNTRY = UPPER('${COUNTRY_CODE}')
AND upper(BANK_NAME) not LIKE upper('%Open%') 
AND upper(BANK_NAME) not LIKE upper('%CASH%') 
AND upper(BANK_NAME) not LIKE upper('%Clear%')
AND BANK_PARTY_ID = '${BANK_PARTY_ID}'
ORDER BY BANK_NAME ASC
    
    `;
  return query;
};

let branchNameById = async (BANK_PARTY_ID,BRANCH_PARTY_ID) => {
  let query = `
  SELECT 
  INITCAP(BB.BANK_BRANCH_NAME) AS BANK_BRANCH_NAME
FROM CE_BANK_BRANCHES_V  BB
WHERE BB.BANK_PARTY_ID ='${BANK_PARTY_ID}'
AND BB.BRANCH_PARTY_ID = '${BRANCH_PARTY_ID}'
    `;
  return query;
};

module.exports = {
  bankList,
  branchList,
  bankNameById,
  branchNameById,
};
