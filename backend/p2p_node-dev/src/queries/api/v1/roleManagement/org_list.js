const isEmpty = require("is-empty");

let getOrganizations = async (userId) => {
  let query = `SELECT 
    HOU.ORGANIZATION_ID,
    HOU.SHORT_CODE,
    HOU.NAME,
    CASE WHEN EOA.USER_ID IS NOT NULL AND EOA.ORGANIZATION_ID IS NOT NULL THEN 1 ELSE 0 END AS IS_ASSOCIATED
FROM 
    HR_OPERATING_UNITS HOU
LEFT JOIN 
    XXP2P.XXP2P_EMPLOYEE_ORG_ACCESS EOA 
ON 
    EOA.USER_ID = :userId AND HOU.ORGANIZATION_ID = EOA.ORGANIZATION_ID
ORDER BY 
    HOU.ORGANIZATION_ID`;
  return query;
};

module.exports = {
  getOrganizations,
};
