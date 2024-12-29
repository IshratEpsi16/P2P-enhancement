// This is your main interface for the shipment number API response
export interface ShipmentNumberInterface {
  message: string;
  status: number;
  msg_type: string;
  data: {
    SEGMENT1: string;
    SHIP_NUM: string;
  };
  items: any[];
  item: ShipmentItemInterface[]; // Correct interface used for 'item' array
}

// This is the interface for each shipment item within 'item'
export interface ShipmentItemInterface {
  SEGMENT1: string;
  ITEM_CODE: string;
  PO_LINE_ID: number;
  LINE_NUM: number;
  QUANTITY: string;
  SHIP_NUM: string;
}
