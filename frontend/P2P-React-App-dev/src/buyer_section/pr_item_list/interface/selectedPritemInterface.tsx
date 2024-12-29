interface SelectedPrItemInterface {
  RFQ_ID?: number | null;
  ATTRIBUTE_CATEGORY: string;
  AUTHORIZATION_STATUS: string;
  // BUYER_FILE_NAME: string;
  BUYER_VAT_APPLICABLE: string;
  BUYER_FILE_ORG_NAME: string;
  DELIVER_TO_LOCATION_ID: number;
  ITEM_DESCRIPTION: string;
  DESTINATION_ORGANIZATION_ID: number;
  ITEM_CODE: string;
  ITEM_ID: number;
  ITEM_SPECIFICATION: string;
  LCM_ENABLE_FLAG: string;
  LINE_NUM: number;
  NEED_BY_DATE: string;
  NOTE_TO_SUPPLIER: string;
  ORG_ID: number;
  PACKING_TYPE: string;
  PROJECT_NAME: string;
  PR_FROM_DFF: string;
  PR_NUMBER: string;
  EXPECTED_QUANTITY: number;
  REQUISITION_HEADER_ID: number;
  REQUISITION_LINE_ID: number;
  UNIT_MEAS_LOOKUP_CODE: string;
  UNIT_PRICE: number;
  WARRANTY_ASK_BY_BUYER: string;
  WARRANTY_DETAILS: string;
  BUYER_FILE: File | null;
  // FILE: string;
  // MIMETYPE: string;
  // ORIGINAL_FILE_NAME: string;
}

export default SelectedPrItemInterface;
