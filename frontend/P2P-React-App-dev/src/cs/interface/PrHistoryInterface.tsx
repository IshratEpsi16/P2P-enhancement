interface PrHistoryInterface {
  PREPARER_ID: number;
  PR_NUMBER: string;
  REQUISITION_HEADER_ID: number;
  REQUISITION_LINE_ID: number;
  CREATION_DATE: string;
  ITEM_DESCRIPTION: string;
  CREATED_BY: number;
  AUTHORIZATION_STATUS: string;
  APPROVED_DATE: string;
  PR_FROM_DFF: string;
  LINE_NUM: number;
  CATEGORY_ID: number;
  ITEM_ID: number;
  ITEM_CODE: string;
  UNIT_MEAS_LOOKUP_CODE: string;
  UNIT_PRICE: number;
  EXPECTED_QUANTITY: number;
  NEED_BY_DATE: string;
  DELIVER_TO_LOCATION_ID: number;
  DESTINATION_ORGANIZATION_ID: number;
  ATTRIBUTE_CATEGORY: string;
  BRAND: string;
  ORIGIN: string;
  ITEM_SPECIFICATION: string;
  WARRANTY_DETAILS: string;
  PACKING_TYPE: string;
  ATTRIBUTE6: string;
  PROJECT_NAME: string;
  ORG_ID: number;
  INVENTORY_ORG_NAME: string;
  LCM_ENABLED_FLAG: string;
  CLOSED_CODE: string;
  ON_HAND: number;
  YEARLY: number;
  HALF_YEARLY: number;
  QUARTERLY: number;
  TASK_NAME: string;
  PROJECT_DETAILS: string;
}

export default PrHistoryInterface;