let templateName = async (STAGE_ID) => {
  let query = `
    SELECT
    APPROVAL_STAGE_NAME
    FROM
     XXP2P.XXP2P_APPROVAL_STAGES
    WHERE AS_ID = :STAGE_ID
    `;
  return query;
};

module.exports = {
  templateName,
};
