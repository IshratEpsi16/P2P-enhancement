const isEmpty = require("is-empty");

let tradeExportLicenseExpireList = async () => {
  // Construct the query string with bind variables
  let query = `SELECT 
regdoc.user_id, 
us.email_address,
bsc.ORGANIZATION_NAME,
regdoc.TRADE_OR_EXPORT_LICENSE_END_DATE
FROM xxp2p.xxp2p_supplier_registration_documents regdoc
left join xxp2p.xxp2p_user us on us.user_id = regdoc.user_id
left join xxp2p.xxp2p_supplier_bsc_info bsc on bsc.user_id = regdoc.user_id
WHERE regdoc.TRADE_OR_EXPORT_LICENSE_END_DATE is not null
and regdoc.TRADE_OR_EXPORT_LICENSE_END_DATE BETWEEN SYSDATE AND SYSDATE + 7`;
  return query;
};

module.exports = {
  tradeExportLicenseExpireList,
};
