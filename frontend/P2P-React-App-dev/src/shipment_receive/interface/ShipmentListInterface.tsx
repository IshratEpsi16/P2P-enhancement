interface ShipmentListInterface {
  SHIPMENT_ID: number;
  USER_ID: number;
  RFQ_ID: number;
  CS_ID: number;
  SHIP_FROM_LOCATION_ID: string;
  BILL_TO_LOCATION_ID: string;
  SHIPMENT_DATE: string;
  EST_DELIVERY_DATE: string;
  LC_NUMBER: string;
  BL_CHALLAN_NUMBER: string;
  VAT_CHALLAN_NUMBER: string;
  DELIVERY_CHALLAN_NUMBER: string;
  FILE_ORG_NAME: string;
  FILE_NAME: string;
  STATUS: string;
  CREATED_BY: string;
  CREATION_DATE: string;
  LAST_UPDATED_BY: string;
  LAST_UPDATE_DATE: string;
  PO_NUMBER: number;
  PO_HEADER_ID: string;
  GATE_RCV_STATUS: string;
  GATE_RCV_REMARKS: string;
  GATE_RCV_DATE: string;
  RECEIVED_BY: string;
  EBS_GRN_NO: string;
  EBS_GRN_DATE: string;
  UPDATE_STATUS: string;
  ORG_ID: number;
  BILL_TO_LOCATION: {};
  SHIP_FROM_LOCATION: {
    ID: number;
    VENDOR_ID: number;
    COUNTRY: string;
    ADDRESS_LINE1: string;
    ADDRESS_LINE2: string;
    CITY_STATE: string;
    ZIP_CODE: string;
    EMAIL: string;
    MOBILE_NUMBER: string;
    CREATED_BY: string;
    CREATION_DATE: string;
    LAST_UPDATED_BY: string;
    LAST_UPDATE_DATE: string;
    USER_ID: number;
    ACTIVE_STATUS: string;
    RFQ: string;
    PAYABLE: string;
    PURCHASING: string;
    PRIMARY_SITE: string;
    INVOICE_CURRENCY_CODE: string;
    PAYMENT_CURRENCY_CODE: string;
  }
  RFQ_DETAILS: {
    BUYER_DEPARTMENT: string;
  }
}

export default ShipmentListInterface;
