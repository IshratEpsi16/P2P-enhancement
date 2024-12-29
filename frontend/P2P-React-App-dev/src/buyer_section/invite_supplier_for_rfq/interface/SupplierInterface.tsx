interface Site {
  SITE_ID: string;
  ADDRESS_LINE1: string;
  EMAIL: string;
  VENDOR_SITE_ID: string;
  PRIMARY_SITE: string;
}

interface Contact {
  ID: string;
  NAME: string;
  MOB_NUMBER_1: string;
  EMAIL: string;
  VENDOR_CONTACT_ID: string;
}

interface SupplierInterface {
  USER_ID: number;
  SUPPLIER_NAME: string;
  REGISTRATION_ID: number;
  BUYER_ID?: string;
  MOBILE_NUMBER: string;
  EMAIL_ADDRESS: string;
  TRADE_OR_EXPORT_LICENSE_END_DATE: string; // Assuming it's in ISO 8601 format
  TAX_RTN_ASSMNT_YEAR?: string; // Assuming it's optional
  ADDITIONAL_EMAIL: string;
  CAN_EDIT?: number;
  PROFILE_PIC1_FILE_NAME: string;
  PO_DATE: string;
  TOTAL_PO: string;
  SITE_ID: string;
  SITES: Site[];
  CONTACT: Contact[];
  SITE_NAME?: string;
  SUPPLIER_ID: number;
  NAME: string;
  ID: string;
  EMAIL: string;
  INVITATION_ID: number;
}

export default SupplierInterface;
