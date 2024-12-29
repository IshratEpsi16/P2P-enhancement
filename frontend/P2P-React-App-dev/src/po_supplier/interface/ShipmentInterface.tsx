interface ShipmentInterface {
  SHIPMENT_ID: number;
  USER_ID: string;
  RFQ_ID: number;
  CS_ID: number;
  SHIP_FROM_LOCATION_ID: number;
  BILL_TO_LOCATION_ID: number;
  SHIPMENT_DATE: string;
  EST_DELIVERY_DATE: string;
  LC_NUMBER: string;
  BL_CHALLAN_NUMBER: string;
  VAT_CHALLAN_NUMBER: string;
  DEVLIVERY_CHALLAN_NUMBER: string;
  FILE_ORG_NAME: string;
  FILE_NAME: string;
  STATUS: string;
  CREATED_BY: number;
  CREATION_DATE: string;
  LAST_UPDATED_BY: string | null;
  LAST_UPDATE_DATE: string;
  PO_NUMBER: number;
  EBS_GRN_NO: string;
  GATE_RCV_DATE: string;
  PO_HEADER_ID: string;
  BILL_TO_LOCATION: {
    ORGANIZATION_ID: number;
    SHORT_CODE: string;
    NAME: string;
  };
  SHIP_FROM_LOCATION: {
    ID: number;
    VENDOR_ID: string;
    COUNTRY: string;
    ADDRESS_LINE1: string;
    ADDRESS_LINE2: string;
    CITY_STATE: string;
    ZIP_CODE: number;
    EMAIL: string;
    MOBILE_NUMBER: string;
    CREATED_BY: number;
    CREATION_DATE: string;
    LAST_UPDATED_BY: string | null;
    LAST_UPDATE_DATE: string;
    USER_ID: number;
    ACTIVE_STATUS: string;
    RFQ: string;
    PAYABLE: string;
    PURCHASING: string;
  };
}

export default ShipmentInterface;