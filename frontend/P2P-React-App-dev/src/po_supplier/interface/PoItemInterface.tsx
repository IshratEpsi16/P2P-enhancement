interface PoItemInterface {
  CS_LINE_ID: number;
  CS_ID: number;
  RFQ_ID: number;
  RFQ_LINE_ID: number;
  QUOT_LINE_ID: number;
  ITEM_CODE: string;
  ITEM_DESCRIPTION: string;
  LCM_ENABLE_FLAG: string;
  OFFERED_QUANTITY: number;
  SHIPPED_QUANTITY: string;
  SHIPPING_QUANTITY: string;
  PO_NUMBER: number;
  SHIPMENT_SHIPPING_QUANTITY: string;
  QUOT_OFFERED_QUANTITY: string;
  SHIPMENT_OFFERED_QUANTITY: string;
  PO_LINE_ID: string;
  AVAILABLE_BRAND_NAME: string;
  AVAILABLE_ORIGIN: string;
  AVAILABLE_SPECS: string;
  EXPECTED_ORIGIN: string;
  EXPECTED_BRAND_NAME: string;
  TOLERANCE: string;
  QUOT_CREATION_DATE: string;
  PROMISE_DATE: string;
  SUPPLIER_VAT_APPLICABLE: string;
  UNIT_PRICE: string;
  WARRANTY_BY_SUPPLIER: string;
  EBS_GRN_DATE: string;
  EBS_GRN_NO: string;
  EBS_DELIVERED_QTY: string;
  SHIPMENT_CREATION_DATE: string;
  LCM_ENABLE: string;
  ORG_ID: string;
  PO_DATE: string
  AWARDED: string;
  PO_LINE_NUMBER: string;
  AWARD_QUANTITY: string;
  PO_LINE_NUM: number;
  SHIP_NUM: string;
  SHIPMENT_LINE_ID: number | null
}

export default PoItemInterface;
