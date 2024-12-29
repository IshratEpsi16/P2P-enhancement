interface InvoiceItemInterface {
  SHIPMENT_ID: number;
  SHIPMENT_LINE_ID: number;
  SHIPMENT_CS_LINE_ID: number;
  SHIPMENT_OFFERED_QUANTITY: string;
  SHIPMENT_SHIPPING_QUANTITY: string;
  LCM_ENABLE: string;
  SHIPMENT_ITEM_DESCRIPTION: string;
  SHIPMENT_CREATED_BY: number;
  SHIPMENT_CREATION_DATE: string;
  SHIPMENT_ITEM_CODE: string;
  SHIPMENT_PO_HEADER_ID: string;
  SHIPMENT_PO_NUMBER: number;
  EBS_GRN_QTY: string;
  EBS_RECEIVE_QTY: string;
  EBS_ACCEPT_QTY: string;
  EBS_REJECT_QTY: string;
  EBS_DELIVERED_QTY: string;
  EBS_GRN_NO: string;
  EBS_GRN_DATE: string;
  PO_UNIT_PRICE: string;
  CS_CS_LINE_ID: number;
  CS_ID: number;
  CS_RFQ_ID: number;
  CS_RFQ_LINE_ID: number;
  CS_QUOT_LINE_ID: number;
  RECOMMENDED: string;
  RECOMMENDED_BY: number;
  AWARDED: string;
  AWARDED_BY: string;
  NOTE_FROM_BUYER: string;
  CS_CREATED_BY: string;
  CS_CREATION_DATE: string;
  CS_PO_NUMBER: string;
  CS_PO_HEADER_ID: number;
  QUOT_QUOT_LINE_ID: number;
  QUOT_RFQ_LINE_ID: number;
  QUOT_RFQ_ID: number;
  QUOT_USER_ID: number;
  WARRANTY_BY_SUPPLIER: string;
  SUPPLIER_VAT_APPLICABLE: string;
  UNIT_PRICE: number;
  QUOT_OFFERED_QUANTITY: number;
  PROMISE_DATE: string;
  SUP_FILE_ORG_NAME: string;
  SUP_FILE_NAME: string;
  QUOT_CREATION_DATE: string;
  QUOT_CREATED_BY: string;
  AVAILABLE_BRAND_NAME: string;
  AVAILABLE_ORIGIN: string;
  AVAILABLE_SPECS: string;
  TOLERANCE: number;
  ITEM_SPECIFICATION: string;
  EXPECTED_BRAND_NAME: string;
  EXPECTED_ORIGIN: string;
  PACKING_TYPE: string;
  UNIT_MEAS_LOOKUP_CODE: string;
  INVOICE_ID: number;
  INVOICE_QTY: number;
  ITEM_CODE: string;
  LINE_TYPE_CODE: string;
  EXPENSE_TYPE: string;
  ACCT_DIST_CONCATENATED: string;
  PO_LINE_NUMBER: number;
  LINE_NUM: number;
}

export default InvoiceItemInterface;