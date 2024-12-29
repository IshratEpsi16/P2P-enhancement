require('dotenv').config();

let filePathFinder = async (columnName) => {
    const filePaths = {
      'TRADE_OR_EXPORT_LICENSE_FILE_NAME': process.env.trade_or_export_license_file_path_name,
      'ETIN_FILE_NAME': process.env.etin_file_path_name,
      'EBIN_FILE_NAME': process.env.ebin_file_path_name,
      'TAX_RTN_ACKN_SLIP_FILE_NAME': process.env.tax_rtn_ackn_slip_file_path_name,
      'INCORPORATION_CIRTIFICATE_FILE_NAME': process.env.incorporation_cirtificate_file_path_name,
      'MEMORANDUM_ASSOCIATION_FILE_NAME': process.env.memorandum_association_file_path_name,
      'AUTHORIZED_SIGNS_FILE_NAME': process.env.authorized_signs_file_path_name,
      'ARTICLE_ASSOCIATION_FILE_NAME': process.env.article_association_file_path_name,
      'PROMINENT_CLIENTS_FILE_NAME': process.env.prominent_clients_file_path_name,
      'ANNUAL_TURNOVER_FILE_NAME': process.env.annual_turnover_file_path_name,
      'QA_CIRTIFICATE_FILE_NAME': process.env.qa_cirtificate_file_path_name,
      'COMPANY_PROFILE_FILE_NAME': process.env.company_profile_file_path_name,
      'RECOMMENDATION_CIRTIFICATE_FILE_NAME': process.env.recommendation_cirtificate_file_path_name,
      'EXCELLENCY_SPECIALIED_CIRTIFICATE_FILE_NAME': process.env.excellency_specialied_cirtificate_file_path_name,
      'GOODS_LIST_FILE_NAME': process.env.goods_list_file_path_name,
      'COMPANY_BANK_SOLVENCY_CIRTIFICATE_FILE_NAME': process.env.company_bank_solvency_cirtificate_file_path_name,
      'MACHINE_MANPOWER_LIST_FILE_NAME': process.env.machine_manpower_list_file_path_name,
      'BUSINESS_PREMISES_FILE_NAME': process.env.business_premises_file_path_name,
      'PROFILE_PIC1_FILE_NAME': process.env.profile_pic1_file_path_name,
      'PROFILE_PIC2_FILE_NAME': process.env.profile_pic2_file_path_name,
      'CHEQUE_FILE_NAME': process.env.supplier_check_file_path_name,
      'SIGNATURE_ORIGINAL_FILE_NAME': process.env.supplier_signature_file_path_name,
      'NID_PASSPORT_FILE_NAME': process.env.nid_or_passport_file_path_name,
      'TIN_FILE_NAME': process.env.etin_file_path_name,
      'SIGNATURE_FILE_NAME': process.env.supplier_signature_file_path_name,
      'COMPANY_SEAL_FILE_NAME': process.env.supplier_company_seal_file_path_name
    };
    
    
    const filePath = filePaths[columnName];
  
    if (filePath) {
      return `${process.env.backend_url}${filePath}`;
    } else {
      return 'No file path found!';
    }
  };
  
  module.exports = {
    filePathFinder
  };
  