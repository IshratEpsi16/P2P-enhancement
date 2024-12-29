interface PageFourInterface {
    message: string;
    status: number;
    success: boolean;
    data: {
      MACHINE_MANPOWER_LIST_FILE_NAME: string | null;
      MACHINE_MANPOWER_LIST_ORIGINAL_FILE_NAME: string | null;
      BUSINESS_PREMISES_FILE_NAME: string | null;
      BUSINESS_PREMISES_ORIGINAL_FILE_NAME: string | null;
      PROFILE_PIC1_FILE_NAME: string | null;
      PROFILE_PIC1_ORIGINAL_FILE_NAME: string | null;
      PROFILE_PIC2_FILE_NAME: string | null;
      PROFILE_PIC2_ORIGINAL_FILE_NAME: string | null;
    };
    machine_manpower_list_file_path_name: string;
    business_premises_file_path_name: string;
    profile_pic1_file_path_name: string;
    profile_pic2_file_path_name: string;
  }
  
 export default PageFourInterface
  