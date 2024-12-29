interface SelectedSupplierUpdateInterface {
  USER_ID: number;
  SUPPLIER_NAME: string;
  MOBILE_NUMBER: string;
  EMAIL: string;
  ADDITIONAL_EMAIL?: string; // Optional since it's not present in every object
  CAN_EDIT?: number;
  PO_DATE: string;
  TOTAL_PO: string;
  SITE_ID: string;
  SITE_NAME?: string;
  CONTACT_ID: string;
  NAME: string;
  CONTACT_EMAIL: string;
  INVITATION_ID: number;
  EMAIL_SENT_STATUS: number;
}

export default SelectedSupplierUpdateInterface;
