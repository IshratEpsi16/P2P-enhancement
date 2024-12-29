interface PageThreeInterface {
    message: string;
    status: number;
    success: boolean;
    data: {
      GOODS_LIST_FILE_NAME: string | null;
      GOODS_LIST_ORG_FILE_NAME: string | null;
      COMPANY_BANK_SOLVENCY_CIRTIFICATE_FILE_NAME: string | null;
      COMPANY_BANK_SOLVENCY_CIRTIFICATE_ORIGINAL_FILE_NAME: string | null;
      EXCELLENCY_SPECIALIED_CIRTIFICATE_FILE_NAME: string | null;
      EXCELLENCY_SPECIALIED_CIRTIFICATE_ORIGINAL_FILE_NAME: string | null;
      RECOMMENDATION_CIRTIFICATE_FILE_NAME: string | null;
      RECOMMENDATION_CIRTIFICATE_ORIGINAL_FILE_NAME: string | null;
      COMPANY_PROFILE_FILE_NAME: string | null;
      COMPANY_PROFILE_ORIGINAL_FILE_NAME: string | null;
      QA_CIRTIFICATE_FILE_NAME: string | null;
      QA_CIRTIFICATE_ORIGINAL_FILE_NAME: string | null;
      ANNUAL_TURNOVER_FILE_NAME: string | null;
      ANNUAL_TURNOVER_ORIGINAL_FILE_NAME: string | null;
    };
    annual_turnover_file_path_name: string;
    qa_cirtificate_file_path_name: string;
    company_profile_file_path_name: string;
    recommendation_cirtificate_file_path_name: string;
    excellency_specialied_cirtificate_file_path_name: string;
    company_bank_solvency_cirtificate_file_path_name: string;
    goods_list_file_path_name: string;
  }

  export default PageThreeInterface;