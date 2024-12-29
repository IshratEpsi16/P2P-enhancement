interface PrItemInterface {
  RFQ_LINE_ID: number;
  RFQ_ID: number;
  LINE_TYPE_ID: number;
  ITEM_DESCRIPTION: string;
  EXPECTED_QUANTITY: number;
  EXPECTED_BRAND_NAME: string;
  EXPECTED_ORIGIN: string;
  LCM_ENABLE_FLAG: string;
  NOTE_TO_SUPPLIER: string;
  WARRANTY_ASK_BY_BUYER: string;
  WARRANTY_BY_SUPPLIER: string;
  BUYER_VAT_APPLICABLE: string;
  SUPPLIER_VAT_APPLICABLE?: string;
  OFFERED_QUANTITY: number;
  PROMISE_DATE: Date;
  CS_STATUS: number;
  LAST_UPDATED_BY: number;
  LAST_UPDATE_DATE: Date;
  USER_NAME: string;
  PREPARER_ID?: number;
  PR_NUMBER: string;
  REQUISITION_HEADER_ID?: number;
  REQUISITION_LINE_ID?: number;
  CREATION_DATE?: string;
  DESCRIPTION?: string;
  CREATED_BY: number;
  AUTHORIZATION_STATUS: string;
  APPROVED_DATE?: string;
  PR_FROM_DFF: string;
  LINE_NUM: number;
  CATEGORY_ID: number;
  ITEM_ID: number;
  ITEM_CODE: string;
  UNIT_MEAS_LOOKUP_CODE: string;
  UNIT_PRICE: number;
  QUANTITY: number;
  NEED_BY_DATE: string;
  DELIVER_TO_LOCATION_ID: number;
  DESTINATION_ORGANIZATION_ID: number;
  ATTRIBUTE_CATEGORY?: string;
  BRAND: string;
  ORIGIN: string;
  ITEM_SPECIFICATION: string;
  WARRANTY_DETAILS: string;
  PACKING_TYPE: string;
  ATTRIBUTE6: string;
  PROJECT_NAME: string;
  ORG_ID: number;
  CLOSED_CODE: string;
  INVENTORY_ORG_NAME: string;
  // BUYER_FILE_NAME: string;
  BUYER_FILE: File | null;
  BUYER_FILE_ORG_NAME: string | null;
  COUNTER: number;
  REQUESTOR_NAME: string;
  BUYER_FILE_NAME: string;
  RATE_TYPE: string;
  RATE_DATE: string;
  CONVERSION_RATE: string;
  MATCH_OPTION: string;
  PR_LINE_NUM: number;
  PR_CREATION_DATE: string;
  LINE_STATUS: string;
  LINE_TYPE: string;

  // MIMETYPE: string;
  // ORIGINAL_FILE_NAME: string;
  // FILE: File | null;
}

export default PrItemInterface;

// interface PrItemInterface {
//   SUGGESTED_BUYER_ID: number;
//   PREPARER_ID: number;
//   USER_NAME: string;
//   FULL_NAME: string;
//   PR_NUMBER: string;
//   REQUISITION_HEADER_ID: number;
//   REQUISITION_LINE_ID: number;
//   CREATION_DATE: string;
//   ITEM_DESCRIPTION: string;
//   CREATED_BY: number;
//   AUTHORIZATION_STATUS: string;
//   APPROVED_DATE: string;
//   PR_FROM_DFF: string;
//   LINE_NUM: number;
//   CATEGORY_ID: number;
//   ITEM_ID: number;
//   DESCRIPTION: string;
//   ITEM_CODE: string;
//   UNIT_MEAS_LOOKUP_CODE: string;
//   UNIT_PRICE: number;
//   EXPECTED_QUANTITY: number;
//   NEED_BY_DATE: string;
//   DELIVER_TO_LOCATION_ID: number;
//   DESTINATION_ORGANIZATION_ID: number;
//   ATTRIBUTE_CATEGORY: string;
//   BRAND: string;
//   ORIGIN: string;
//   ITEM_SPECIFICATION: string;
//   WARRANTY_DETAILS: string;
//   PACKING_TYPE: string;
//   ATTRIBUTE6: string;
//   PROJECT_NAME: string;
//   ORG_ID: number;
//   INVENTORY_ORG_NAME: string;
//   CLOSED_CODE: string;
//   LCM_ENABLE_FLAG: string;
//   DELIVER_TO_LOCATION_NAME: string;
// }

// export default PrItemInterface

// interface PrItemInterface {
//   PREPARER_ID: number;
//   REQUESTOR_NAME: string;
//   SUGGESTED_BUYER_ID: number;
//   BUYER_NAME: string;
//   USER_NAME: string;
//   PR_NUMBER: string;
//   REQUISITION_HEADER_ID: number;
//   REQUISITION_LINE_ID: number;
//   PR_CREATION_DATE: string;
//   PR_ITEM_DESCRIPTION: string;
//   CREATED_BY: number;
//   AUTHORIZATION_STATUS: string;
//   APPROVED_DATE: string;
//   PR_FROM_DFF: string;
//   LINE_NUM: number;
//   CATEGORY_ID: number;
//   ITEM_ID: number;
//   ITEM_DESCRIPTION: string;
//   ITEM_CODE: string;
//   UNIT_MEAS_LOOKUP_CODE: string;
//   UNIT_PRICE: number;
//   EXPECTED_QUANTITY: number;
//   NEED_BY_DATE: string;
//   NOTE_TO_SUPPLIER: string;
//   NOTE_TO_RECEIVER: string;
//   DELIVER_TO_LOCATION_ID: number;
//   DESTINATION_ORGANIZATION_ID: number;
//   ATTRIBUTE_CATEGORY: string;
//   BRAND: string;
//   ORIGIN: string;
//   ITEM_SPECIFICATION: string;
//   WARRANTY_DETAILS: string;
//   PACKING_TYPE: string;
//   ATTRIBUTE6: string;
//   PROJECT_NAME: string;
//   ORG_ID: number;
//   REQS_IN_POOL_FLAG: string;
//   ON_RFQ_FLAG: string;
//   LINE_LOCATION_ID: string;
//   OPERATING_UNIT: string;
//   INVENTORY_ORG_NAME: string;
//   CLOSED_CODE: string;
//   LCM_ENABLE_FLAG: string;
//   DELIVER_TO_LOCATION_NAME: string;
// }
// export default PrItemInterface;
