interface PageTwoInterface {
    message: string;
    status: number;
    success: boolean;
    data: {
      INCORPORATION_NUMBER: null | string;
      INCORPORATION_CIRTIFICATE_FILE_NAME: null | string;
      INCORPORATION_CIRTIFICATE_ORIGINAL_FILE_NAME: null | string;
      MEMORANDUM_ASSOCIATION_FILE_NAME: null | string;
      MEMORANDUM_ASSOCIATION_ORIGINAL_FILE_NAME: null | string;
      AUTHORIZED_SIGNS_FILE_NAME: null | string;
      AUTHORIZED_SIGNS_ORIGINAL_FILE_NAME: null | string;
      ARTICLE_ASSOCIATION_FILE_NAME: null | string;
      ARTICLE_ASSOCIATION_ORIGINAL_FILE_NAME: null | string;
      PROMINENT_CLIENTS_FILE_NAME: null | string;
      PROMINENT_CLIENTS_ORIGINAL_FILE_NAME: null | string;
    };
    incorporation_cirtificate_file_path_name: string;
    memorandum_association_file_path_name: string;
    authorized_signs_file_path_name: string;
    article_association_file_path_name: string;
    prominent_clients_file_path_name: string;
  }

  export default PageTwoInterface;