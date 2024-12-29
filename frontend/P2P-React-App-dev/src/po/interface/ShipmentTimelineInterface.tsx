interface ShipmentTimelineInterface {
  SHIPMENT_ID: number;
  STATUS: string;
  SHIPMENT_DATE: string; // ISO date string
  GATE_RCV_STATUS: string;
  GATE_RCV_DATE: string; // ISO date string
  GATE_RCV_REMARKS: string;
  PO_STATUS: string;
  PO_ACCEPT_DATE: string; // ISO date string
  SHIPMENT_STATUS_RESULT: number;
  PO_STATUS_RESULT: number;
  GATE_RCV_RESULT: number;
  EBS_GRN_DATE: string;
  GRN_RESULT: number;
}

export default ShipmentTimelineInterface;
