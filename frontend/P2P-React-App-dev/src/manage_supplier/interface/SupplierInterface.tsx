interface SupplierInterface {
  SUPPLIER_ID: number;
  SUPPLIER_FULL_NAME: string;
  SUPPLIER_USER_NAME: string;
  ORGANIZATION_NAME: string;
  PROFILE_PIC1_FILE_NAME: string;
  PROFILE_PIC2_FILE_NAME: string;
  EMAIL_ADDRESS: string;
  APPROVAL_STATUS: string; // Adjust the possible values accordingly
  MODULE_ID: number;
  STAGE_ID: number;
  STAGE_LEVEL: number;
  STAGE_SEQ: number;
  IS_MUST_APPROVE: number;
  INITIATOR: string;
  PROFILE_UPDATE_UID: number;
  PROFILE_NEW_INFO_UID: number;
  IS_INITIATOR: string;
  INITIATOR_STATUS: {
    ACTION_CODE: number;
    ACTION_DATE: string;
    FULL_NAME: string;
    NOTE: string;
  }
}

export default SupplierInterface;
