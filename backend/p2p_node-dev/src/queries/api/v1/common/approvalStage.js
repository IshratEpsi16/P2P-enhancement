let approvalStageList = async () => {
  let query = `
    select 
AS_ID,
APPROVAL_STAGE_NAME
from XXP2P.XXP2P_APPROVAL_STAGES
      `;
  return query;
};

let approvalStageUpdate = async (AS_ID,SUPPLIER_ID) => {
  let query = 
  `
 
  UPDATE XXP2P.XXP2P_USER
  SET REG_TEMPLATE_ID = :AS_ID,
      REG_TEMPLATE_STAGE_LEVEL = 1,
      INITIATOR_STATUS = 'APPROVED'
  WHERE USER_ID = :SUPPLIER_ID
      `;
  return query;
};

module.exports = {
  approvalStageList,
  approvalStageUpdate
};
