// interface ProfileUpdateDataInterface {
//     ACTION_ID: number;
//     ACTION_DATE: string;
//     SUPPLIER_ID: string;
//     EMAIL_ADDRESS: string;
//     ORGANIZATION_NAME: string;
//     TABLE_NAME: string;
//     COLUMN_NAME: string;
//     OLD_VALUE: string;
//     NEW_VALUE: string;
//     APPROVER_STATUS: string;
//     PK_COLUMN_VALUE: number;
//     PROFILE_UPDATE_TEMPLATE_ID: string;
//     PROFILE_UPDATE_TEMPLATE_STAGE_LEVEL: string;
//     FILE_PATH?: string; // FILE_PATH is optional based on your data
//   }

//   export default ProfileUpdateDataInterface

interface ProfileUpdateDataInterface {
  ACTION_ID: number;
  ACTION_DATE: string;
  SUPPLIER_ID: string;
  EMAIL_ADDRESS: string;
  ORGANIZATION_NAME: string;
  TABLE_NAME: string;
  COLUMN_NAME: string;
  OLD_VALUE: string;
  NEW_VALUE: string;
  APPROVER_STATUS: string;
  PK_COLUMN_VALUE: number;
  PROFILE_UPDATE_TEMPLATE_ID: string;
  PROFILE_UPDATE_TEMPLATE_STAGE_LEVEL: string;
  FILE_PATH?: string; // FILE_PATH is optional based on your data
  TABLE_DATA: {
    BANK_NAME: string;
    ACCOUNT_NAME: string;
    ACCOUNT_NUMBER: string;
    BRANCH_NAME: string;
    ROUTING_SWIFT_CODE: string;
    CURRENCY_NAME: string;
    NAME: string;
    POSITION: string;
    MOB_NUMBER_1: string;
    MOB_NUMBER_2: string;
    NID_PASSPORT_NUMBER: string;
    IS_NID: number;
    EMAIL: string;
    NID_PASSPORT_FILE_NAME: string;
    COUNTRY_NAME: string;
    ADDRESS_LINE1: string;
    ADDRESS_LINE2: string;
    CITY_STATE: string;
    ZIP_CODE: number;
    MOBILE_NUMBER: string;
    SWIFT_CODE: string;
    CHEQUE_FILE_NAME: string | null;
    SIGNATURE_FILE_NAME: string | null;
    ID: number;
    USER_ID: number;
  };
  DETAILS: {
    BANK_NAME: string;
  }
  supplier_check_file_path: string | null;
}

export default ProfileUpdateDataInterface;
