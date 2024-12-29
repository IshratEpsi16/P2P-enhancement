interface PreviouslySelectedSupplierInterface {
  INVITATION_ID: number;
  RFQ_ID: number;
  USER_ID: number;
  SUPPLIER_ID: number;
  SUPPLIER_NUMBER: string;
  ADDITIONAL_EMAIL: string;
  RESPONSE_STATUS: number;
  RESPONSE_DATE: string; // Consider using Date type if applicable
  CREATION_DATE: string; // Consider using Date type if applicable
  CREATED_BY: string; // Assuming this is a user ID or username
  LAST_UPDATED_BY: number;
  LAST_UPDATE_DATE: string; // Consider using Date type if applicable
  SUBMISSION_STATUS: string;
  SUBMISSION_DATE: string; // Consider using Date type if applicable
  QUOT_VALID_DATE: string; // Consider using Date type if applicable
  SITE_ID: string; // Assuming this is an ID
  CURRENCY_CODE: string; // Assuming this is a currency code like "USD", "EUR", etc.
  CAN_EDIT: number; // Assuming this is a boolean value, change type if not
  SUP_TERM_FILE: string; // File path or URL
  SUP_TERM_FILE_ORG_NAME: string; // Original file name
  EMAIL_SENT_STATUS: number;
  TOTAL_PO: number;
  PO_DATE: string;
  EMAIL: string;
  REGISTRATION_ID: number
}

export default PreviouslySelectedSupplierInterface;
