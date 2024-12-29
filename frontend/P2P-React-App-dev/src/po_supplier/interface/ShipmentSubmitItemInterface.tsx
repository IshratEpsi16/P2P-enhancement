interface ShipmentSubmitItemInterface {
  SHIPMENT_LINE_ID: number | null,
  CS_LINE_ID: number | null;
  ITEM_CODE: string;
  ITEM_DESCRIPTION: string;
  LCM_ENABLE: string;
  OFFERED_QUANTITY: string;
  SHIPPING_QUANTITY: string;
  PO_HEADER_ID: string;
  PO_NUMBER: string;
  PO_LINE_ID: string;
  PO_LINE_NUMBER: number | null;
  SHIP_NUM: string;
  // AWARD_QUANTITY: string;
  // CS_ID: number;
  // RFQ_ID: number;
  // RFQ_LINE_ID: number;
  // QUOT_LINE_ID: number;
  // SHIPPED_QUANTITY: number;
}

export default ShipmentSubmitItemInterface;