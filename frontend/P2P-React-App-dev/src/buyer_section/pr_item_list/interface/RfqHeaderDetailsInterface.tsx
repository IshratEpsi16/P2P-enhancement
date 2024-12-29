// interface RfqHeaderDetailsInterface {
//   message: string;
//   status: number;
//   header_file_path: string;
//   header_term_file_path: string;

//   details: {
//     RFQ_ID: number;
//     RFQ_SUBJECT: string;
//     RFQ_TITLE: string;
//     RFQ_TYPE: string;
//     NEED_BY_DATE: string;
//     OPEN_DATE: string;
//     CLOSE_DATE: string;
//     NOTE_TO_SUPPLIER: string;
//     SUPLLIER_CURRENCY_CODE: string;
//     SUPLLIER_FREIGHT_CHARGE: string;
//     RFQ_ATTACHMENT_FILE_ORG_NAME: string;
//     RFQ_ATTACHMENT_FILE_NAME: string;
//     BILL_TO_LOCATION_ID: number;
//     SHIP_TO_LOCATION_ID: number;
//     ETR: string;
//     BUYER_ATTACHMENT_FILE_ORG_NAME: string;
//     BUYER_ATTACHMENT_FILE_NAME: string;
//     CURRENCY_CODE: string;
//     VAT_APPLICABLE_STATUS: string;
//     VAT_RATE: number;
//     INVOICE_TYPE: string;
//     FREIGHT_TERM: string;
//     PAYMENT_TERM_ID: string;
//     BUYER_GENERAL_TERMS: string;
//     PREPARER_ID: string;
//     PREPARER_STATUS: string;
//     RFQ_STATUS: string;
//     CREATION_DATE: string;
//     CREATED_BY: number;
//     LAST_UPDATED_BY: number;
//     LAST_UPDATE_DATE: string;
//     INVOICE_LOOKUP_TYPE: string;
//     ORG_ID: number;
//     BILL_TO_LOCATION_NAME: string;
//     SHIP_TO_LOCATION_NAME: string;
//     MATCH_OPTION: string;
//     RATE_TYPE: string;
//     RATE_DATE: string;
//     CONVERSION_RATE: string;
//     APPROVAL_FLOW_TYPE: string;
//     OU_DETAILS: {
//       NAME: string;
//       ORGANIZATION_ID: number;
//       SHORT_CODE: string;
//     };
//   };
// }

// export default RfqHeaderDetailsInterface;

interface RfqHeaderDetailsInterface {
  message: string;
  status: number;
  header_file_path: string;
  header_term_file_path: string;
  details: {
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
    CONVERSION_RATE: number;
    LINE_TYPE: string;
    MATCH_OPTION: string;
    CS_ID: string;
    BUYER_DEPARTMENT: string;
    APPROVAL_FLOW_TYPE: string;
    BILL_TO_LOCATION_NAME: string;
    SHIP_TO_LOCATION_NAME: string;
    OU_DETAILS: {
      ORGANIZATION_ID: number;
      SHORT_CODE: string;
      NAME: string;
    };
  };
}

export default RfqHeaderDetailsInterface;
