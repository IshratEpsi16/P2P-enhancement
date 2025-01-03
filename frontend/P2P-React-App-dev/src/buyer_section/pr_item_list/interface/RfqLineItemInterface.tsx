interface RfqLineItemInterface {
  RFQ_LINE_ID: number;
  RFQ_ID: number;
  REQUISITION_HEADER_ID: number;
  REQUISITION_LINE_ID: number;
  PR_NUMBER: number;
  LINE_NUM: number;
  LINE_TYPE_ID: string;
  ITEM_CODE: string;
  ITEM_DESCRIPTION: string;
  ITEM_SPECIFICATION: string;
  WARRANTY_DETAILS: string;
  PACKING_TYPE: string;
  PROJECT_NAME: string;
  EXPECTED_QUANTITY: number;
  EXPECTED_BRAND_NAME: string;
  EXPECTED_ORIGIN: string;
  LCM_ENABLE_FLAG: string;
  UNIT_MEAS_LOOKUP_CODE: string;
  NEED_BY_DATE: string;
  ORG_ID: number;
  ATTRIBUTE_CATEGORY: string;
  PR_FROM_DFF: string;
  AUTHORIZATION_STATUS: string;
  NOTE_TO_SUPPLIER: string;
  WARRANTY_ASK_BY_BUYER: string;
  BUYER_VAT_APPLICABLE: string;
  DELIVER_TO_LOCATION_ID: number;
  DESTINATION_ORGANIZATION_ID: number;
  CS_STATUS: string;
  CREATION_DATE: string;
  CREATED_BY: number;
  LAST_UPDATED_BY: number;
  LAST_UPDATE_DATE: string;
  BUYER_FILE_ORG_NAME: string;
  BUYER_FILE_NAME: string;
  ITEM_ID: number;
  RATE_TYPE: string;
  RATE_DATE: string;
  CONVERSION_RATE: string;
  QUOT_LINE_ID: string;
  RFQ_LINE_ID_1: string;
  RFQ_ID_1: string;
  USER_ID: string;
  WARRANTY_BY_SUPPLIER: string;
  SUPPLIER_VAT_APPLICABLE: string;
  UNIT_PRICE: string;
  OFFERED_QUANTITY: string;
  PROMISE_DATE: string;
  SUP_FILE_ORG_NAME: string;
  SUP_FILE_NAME: string;
  CREATION_DATE_1: string;
  CREATED_BY_1: string;
  LAST_UPDATED_BY_1: string;
  LAST_UPDATE_DATE_1: string;
  AVAILABLE_BRAND_NAME: string;
  AVAILABLE_ORIGIN: string;
  AVAILABLE_SPECS: string;
  TOLERANCE: string;
}

export default RfqLineItemInterface;
