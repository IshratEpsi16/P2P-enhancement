interface QuotationsInterface {
  message: string;
  status: number;
  total_supplier: number;
  data: QuotationData[];
}

interface QuotationData {
  USER_ID: number;
  SUPPLIER_ID: number;
  ORGANIZATION_NAME: string;
  VENDOR_ID: number; // Add this line
  VENDOR_SITE_ID: number;
  Items: QuotationItem[];
}

interface QuotationItem {
  QUOT_LINE_ID: number;
  RFQ_LINE_ID: number;
  RFQ_ID: number;
  USER_ID: number;
  WARRANTY_BY_SUPPLIER: string;
  SUPPLIER_VAT_APPLICABLE: string;
  UNIT_PRICE: string; // Change to appropriate type if known
  OFFERED_QUANTITY: string; // Change to appropriate type if known
  PROMISE_DATE: string; // Change to Date type if needed
  SUP_FILE_ORG_NAME: string;
  SUP_FILE_NAME: string;
  CREATION_DATE: string; // Change to Date type if needed
  CREATED_BY: string; // Change to appropriate type if known
  LAST_UPDATED_BY: string; // Change to appropriate type if known
  LAST_UPDATE_DATE: string; // Change to Date type if needed
  AVAILABLE_BRAND_NAME: string;
  AVAILABLE_ORIGIN: string;
  AVAILABLE_SPECS: string;
  RFQ_LINE_ID_1: number;
  RFQ_ID_1: number;
  REQUISITION_HEADER_ID: number;
  REQUISITION_LINE_ID: number;
  PR_NUMBER: number;
  LINE_NUM: number;
  LINE_TYPE_ID: string; // Change to appropriate type if known
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
  NEED_BY_DATE: string; // Change to Date type if needed
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
  CREATION_DATE_1: string; // Change to Date type if needed
  CREATED_BY_1: number;
  LAST_UPDATED_BY_1: string; // Change to appropriate type if known
  LAST_UPDATE_DATE_1: string; // Change to Date type if needed
  BUYER_FILE_ORG_NAME: string;
  BUYER_FILE_NAME: string;
  ITEM_ID: number;
  RECOMMENDED: string;
  AWARDED: string;
  TOTAL: string;
  QUOT_TOTAL: string;
  NOTE_TO_APPROVER: string;
  CS_LINE_ID: number;
  TOLERANCE: number;
  AWARD_QUANTITY: string;
  VAT_TYPE: string;
  VAT_AMOUNT: number;
  CS_ID: number;
  CREATION_DATE_2: string;
  COUNTRY_CODE: string;
  COUNTRY_NAME: string;
}

export type { QuotationsInterface, QuotationItem, QuotationData };
