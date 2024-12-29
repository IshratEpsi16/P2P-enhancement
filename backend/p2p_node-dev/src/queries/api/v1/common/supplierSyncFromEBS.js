let supplierSync = async (ID) => {
  let query = `
          declare
       begin
       apps.xx_supplier_p2p_pkg.xxp2p_supplier_data_upload(${ID});
       end;
      `;

  return query;
};

module.exports = {
  supplierSync,
};
