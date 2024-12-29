// interface RfqListItemSupplier {
//   INVOICE_LOOKUP_TYPE: string;
//   RFQ_ID: number;
//   RFQ_SUBJECT: string;
//   RFQ_TITLE: string;
//   RFQ_TYPE: string;
//   NEED_BY_DATE: string;
//   OPEN_DATE: string;
//   CLOSE_DATE: string;
//   NOTE_TO_SUPPLIER: string;
//   SUPLLIER_CURRENCY_CODE: string;
//   SUPLLIER_FREIGHT_CHARGE: string;
//   RFQ_ATTACHMENT_FILE_ORG_NAME: string;
//   RFQ_ATTACHMENT_FILE_NAME: string;
//   BILL_TO_LOCATION_ID: number;
//   SHIP_TO_LOCATION_ID: number;
//   ETR: string;
//   BUYER_ATTACHMENT_FILE_ORG_NAME: string;
//   BUYER_ATTACHMENT_FILE_NAME: string;
//   CURRENCY_CODE: string;
//   VAT_APPLICABLE_STATUS: string;
//   VAT_RATE: number;
//   INVOICE_TYPE: string;
//   FREIGHT_TERM: string;
//   PAYMENT_TERM_ID: string;
//   BUYER_GENERAL_TERMS: string;
//   PREPARER_ID: number;
//   RESPONSE_STATUS: number;
//   RESPONSE_DATE: string;
//   SUBMISSION_STATUS: string;
//   SUBMISSION_DATE: string;
//   BUYER_NAME: string;
//   PREPARER_STATUS: string;
//   RFQ_STATUS: string;
//   CREATION_DATE: string;
// }

// export default RfqListItemSupplier;

interface RfqListItemSupplier {
  INVOICE_LOOKUP_TYPE: string;
  RFQ_ID: number;
  RFQ_SUBJECT: string;
  RFQ_TITLE: string;
  RFQ_TYPE: string;
  NEED_BY_DATE: string; // ISO 8601 date string
  OPEN_DATE: string; // ISO 8601 date string
  CLOSE_DATE: string; // ISO 8601 date string
  NOTE_TO_SUPPLIER: string;
  // SUPPLIER_CURRENCY_CODE: string;
  SUPPLIER_FREIGHT_CHARGE: string;
  RFQ_ATTACHMENT_FILE_ORG_NAME: string;
  RFQ_ATTACHMENT_FILE_NAME: string;
  BILL_TO_LOCATION_ID: number;
  SHIP_TO_LOCATION_ID: number;
  ETR: string; // ISO 8601 date string
  BUYER_ATTACHMENT_FILE_ORG_NAME: string;
  BUYER_ATTACHMENT_FILE_NAME: string;
  CURRENCY_CODE: string;
  VAT_APPLICABLE_STATUS: string;
  VAT_RATE: number;
  INVOICE_TYPE: string;
  FREIGHT_TERM: string;
  PAYMENT_TERM_ID: number;
  BUYER_GENERAL_TERMS: string;
  PREPARER_ID: string;
  RESPONSE_STATUS: number;
  RESPONSE_DATE: string; // ISO 8601 date string
  SUBMISSION_STATUS: string;
  SUBMISSION_DATE: string; // ISO 8601 date string
  QUOT_VALID_DATE: string; // ISO 8601 date string
  CURRENCY_CODE_1: string;
  SUP_TERM_FILE: string;
  SUP_TERM_FILE_ORG_NAME: string;
  SITE_ID: number;
  ADDRESS_LINE1: string;
  ADDRESS_LINE2: string;
  CITY_STATE: string;
  SUPPLIER_CURRENCY_CODE: string;
  BUYER_NAME: string;
  PREPARER_STATUS: string;
  RFQ_STATUS: string;
  CREATION_DATE: string; // ISO 8601 date string
  CAN_EDIT: number;
  INVITATION_ID: number;
  CURRENCY_NAME: string;
  NOTE_TO_BUYER: string;
  remainingTime: string;
}

export default RfqListItemSupplier;
