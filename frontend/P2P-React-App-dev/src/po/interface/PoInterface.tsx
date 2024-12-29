// interface RfqDetails {
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
//   PAYMENT_TERM_ID: number;
//   BUYER_GENERAL_TERMS: string;
//   PREPARER_ID: number;
//   PREPARER_STATUS: string;
//   RFQ_STATUS: string;
//   CREATION_DATE: string;
//   CREATED_BY: number;
//   LAST_UPDATED_BY: number;
//   LAST_UPDATE_DATE: string;
//   INVOICE_LOOKUP_TYPE: string;
//   FOB: string;
//   ORG_ID: number;
//   RATE_TYPE: string;
//   RATE_DATE: string;
//   CONVERSION_RATE: string;
//   LINE_TYPE: string;
//   MATCH_OPTION: string;
//   CS_ID: number;
// }

// interface PoInterface {
//   INVITATION_ID: number;
//   RFQ_ID: number;
//   USER_ID: number;
//   VENDOR_ID: string;
//   ADDITIONAL_EMAIL: string;
//   RESPONSE_STATUS: number;
//   RESPONSE_DATE: string;
//   CREATION_DATE: string;
//   CREATED_BY: string;
//   LAST_UPDATED_BY: number;
//   LAST_UPDATE_DATE: string;
//   SUBMISSION_STATUS: string;
//   SUBMISSION_DATE: string;
//   QUOT_VALID_DATE: string;
//   SITE_ID: number;
//   CURRENCY_CODE: string;
//   CAN_EDIT: number;
//   SUP_TERM_FILE: string;
//   SUP_TERM_FILE_ORG_NAME: string;
//   GENERAL_TERMS: string;
//   PO_NUMBER: string;
//   PO_HEADER_ID: number;
//   PO_STATUS: string;
//   PO_REMARKS: string;
//   PO_ACCEPT_DATE: string;
//   SUPPLIER_NOTE: string;
//   EMAIL_SENT_STATUS: number;
//   PO_DATE: string;
//   CONTACT_ID: number;
//   CURRENCY: string;
//   RFQ_DETAILS: RfqDetails;
//   SUPPLIER_ORGANIZATION_NAME: string;
//   SHORT_CODE: string;
//   OU_NAME: string;
//   SHIP_TO_LOCATION: string;
//   BILL_TO_LOCATION: string;
//   TOTAL_PO_AMOUNT: number;
// }

interface RFQDetails {
  RFQ_ID: number;
  RFQ_SUBJECT: string;
  RFQ_TITLE: string;
  RFQ_TYPE: string;
  NEED_BY_DATE: string;
  OPEN_DATE: string;
  CLOSE_DATE: string;
  NOTE_TO_SUPPLIER: string;
  SUPLLIER_CURRENCY_CODE: string;
  SUPLLIER_FREIGHT_CHARGE: string;
  RFQ_ATTACHMENT_FILE_ORG_NAME: string;
  RFQ_ATTACHMENT_FILE_NAME: string;
  BILL_TO_LOCATION_ID: number;
  SHIP_TO_LOCATION_ID: number;
  ETR: string;
  BUYER_ATTACHMENT_FILE_ORG_NAME: string;
  BUYER_ATTACHMENT_FILE_NAME: string;
  CURRENCY_CODE: string;
  VAT_APPLICABLE_STATUS: string;
  VAT_RATE: number;
  INVOICE_TYPE: string;
  FREIGHT_TERM: string;
  PAYMENT_TERM_ID: number;
  BUYER_GENERAL_TERMS: string;
  PREPARER_ID: number;
  PREPARER_STATUS: string;
  RFQ_STATUS: string;
  CREATION_DATE: string;
  CREATED_BY: number;
  LAST_UPDATED_BY: number;
  LAST_UPDATE_DATE: string;
  INVOICE_LOOKUP_TYPE: string;
  FOB: string;
  ORG_ID: number;
  RATE_TYPE: string;
  RATE_DATE: string;
  CONVERSION_RATE: string;
  LINE_TYPE: string;
  MATCH_OPTION: string;
  CS_ID: string;
  BUYER_DEPARTMENT: string;
  APPROVAL_FLOW_TYPE: string;
}

interface PoInterface {
  INVITATION_ID: number;
  RFQ_ID: number;
  USER_ID: number;
  VENDOR_ID: string;
  ADDITIONAL_EMAIL: string;
  RESPONSE_STATUS: number;
  RESPONSE_DATE: string;
  CREATION_DATE: string;
  CREATED_BY: number;
  LAST_UPDATED_BY: number;
  LAST_UPDATE_DATE: string;
  SUBMISSION_STATUS: string;
  SUBMISSION_DATE: string;
  QUOT_VALID_DATE: string;
  SITE_ID: number;
  CURRENCY_CODE: string;
  CAN_EDIT: number;
  SUP_TERM_FILE: string;
  SUP_TERM_FILE_ORG_NAME: string;
  GENERAL_TERMS: string;
  PO_NUMBER: string;
  PO_HEADER_ID: number;
  PO_STATUS: string;
  PO_REMARKS: string;
  PO_ACCEPT_DATE: string;
  SUPPLIER_NOTE: string;
  EMAIL_SENT_STATUS: number;
  PO_DATE: string;
  CONTACT_ID: number;
  PO_FILE_NAME: string;
  PO_FILE_ORG_NAME: string;
  APPROVAL_FLOW_TYPE: string;
  CURRENCY: string;
  RFQ_DETAILS: RFQDetails;
  SUPPLIER_ORGANIZATION_NAME: string;
  SUPPLIER_ID: number;
  BUYER_NAME: string;
  BUYER_MOBILE_NUMBER: string;
  SHORT_CODE: string;
  OU_NAME: string;
  SHIP_TO_LOCATION: string;
  BILL_TO_LOCATION: string;
  TOTAL_PO_AMOUNT: number;
  STATUS: string;
  FEEDBACK: string;
}

export default PoInterface;