interface RfqListInterface {
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
  BILL_TO_LOCATION_ID: string;
  SHIP_TO_LOCATION_ID: string;
  ETR: string;
  BUYER_ATTACHMENT_FILE_ORG_NAME: string;
  BUYER_ATTACHMENT_FILE_NAME: string;
  CURRENCY_CODE: string;
  VAT_APPLICABLE_STATUS: string;
  VAT_RATE: string;
  INVOICE_TYPE: string;
  FREIGHT_TERM: string;
  PAYMENT_TERM_ID: string;
  BUYER_GENERAL_TERMS: string;
  PREPARER_ID: number;
  PREPARER_STATUS: string;
  CREATION_DATE: string;
  CREATED_BY: number;
  LAST_UPDATED_BY: string;
  LAST_UPDATE_DATE: string;
}

export default RfqListInterface;
