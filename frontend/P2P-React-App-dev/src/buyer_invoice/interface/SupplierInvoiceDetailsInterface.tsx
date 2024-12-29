interface SupplierInvoiceDetailsInterface {
  SHIPMENT_ID: number;
  SHIPMENT_LINE_ID: number;
  SHIPMENT_CS_LINE_ID: number;
  SHIPMENT_OFFERED_QUANTITY: number;
  SHIPMENT_SHIPPING_QUANTITY: number;
  LCM_ENABLE: string;
  SHIPMENT_ITEM_DESCRIPTION: string;
  SHIPMENT_CREATED_BY: number;
  SHIPMENT_CREATION_DATE: string;
  SHIPMENT_ITEM_CODE: string;
  SHIPMENT_PO_HEADER_ID: string;
  SHIPMENT_PO_NUMBER: number;
  EBS_GRN_QTY: number;
  EBS_RECEIVE_QTY: number;
  EBS_ACCEPT_QTY: number;
  EBS_REJECT_QTY: number;
  EBS_DELIVERED_QTY: number;
  EBS_GRN_NO: string;
  EBS_GRN_DATE: string;
  PO_UNIT_PRICE?: string; // Optional since it's an empty string in your example
  CS_CS_LINE_ID: number;
  CS_ID: number;
  CS_RFQ_ID: number;
  CS_RFQ_LINE_ID: number;
  CS_QUOT_LINE_ID: number;
  RECOMMENDED: string;
  RECOMMENDED_BY: number;
  AWARDED: string;
  AWARDED_BY?: string; // Optional since it's an empty string in your example
  NOTE_FROM_BUYER?: string; // Optional since it's an empty string in your example
  CS_CREATED_BY?: string; // Optional since it's an empty string in your example
  CS_CREATION_DATE: string;
  CS_PO_NUMBER?: string; // Optional since it's an empty string in your example
  CS_PO_HEADER_ID?: string; // Optional since it's an empty string in your example
  QUOT_QUOT_LINE_ID: number;
  QUOT_RFQ_LINE_ID: number;
  QUOT_RFQ_ID: number;
  QUOT_USER_ID: number;
  WARRANTY_BY_SUPPLIER: string;
  SUPPLIER_VAT_APPLICABLE: string;
  UNIT_PRICE: number;
  QUOT_OFFERED_QUANTITY: number;
  PROMISE_DATE: string;
  SUP_FILE_ORG_NAME?: string; // Optional since it's an empty string in your example
  SUP_FILE_NAME?: string; // Optional since it's an empty string in your example
  QUOT_CREATION_DATE: string;
  QUOT_CREATED_BY?: string; // Optional since it's an empty string in your example
  AVAILABLE_BRAND_NAME: string;
  AVAILABLE_ORIGIN: string;
  AVAILABLE_SPECS: string;
  TOLERANCE: number;
  ITEM_SPECIFICATION: string;
  EXPECTED_BRAND_NAME?: string; // Optional since it's an empty string in your example
  EXPECTED_ORIGIN?: string; // Optional since it's an empty string in your example
  PACKING_TYPE?: string; // Optional since it's an empty string in your example
  UNIT_MEAS_LOOKUP_CODE: string;
  INVOICE_ID: number;
  INVOICE_QTY: number;
}

export default SupplierInvoiceDetailsInterface;
