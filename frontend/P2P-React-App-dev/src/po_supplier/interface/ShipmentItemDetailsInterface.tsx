interface ShipmentItemDetailsInterface {
  SHIPMENT_LINE_ID: number;
  SHIPMENT_ID: number;
  CS_LINE_ID: number;
  OFFERED_QUANTITY: number;
  SHIPPING_QUANTITY: string;
  LCM_ENABLE: string;
  ITEM_DESCRIPTION: string;
  CREATED_BY: string;
  CREATION_DATE: string;
  LAST_UPDATED_BY: string;
  LAST_UPDATE_DATE: string;
  ITEM_CODE: string;
  PO_HEADER_ID: string;
  PO_NUMBER: number;
  EBS_GRN_QTY: string;
  EBS_RECEIVE_QTY: string;
  EBS_ACCEPT_QTY: string;
  EBS_REJECT_QTY: string;
  EBS_DELIVERED_QTY: string;
  COMMENTS: string;
  SHIP_NUM: string;
  LCM_ENABLE_FLAG: string;
  AWARD_QUANTITY: string;
  PO_LINE_ID: string;
  PO_LINE_NUM: string;
  PO_LINE_NUMBER: number;
}

export default ShipmentItemDetailsInterface;
