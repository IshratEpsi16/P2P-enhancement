import PoItemInterface from "../interface/PoItemInterface";
import ShipmentSubmitItemInterface from "../interface/ShipmentSubmitItemInterface";

const ShipmentAddUpdateService = async (
  token: string,

  shipmentId: string,
  RFQ_ID: string,
  CS_ID: string,
  SHIP_FROM_LOCATION_ID: string,
  BILL_TO_LOCATION_ID: string,

  LC_NUMBER: string,
  BL_CHALLAN_NUMBER: string,
  VAT_CHALLAN_NUMBER: string,
  DEVLIVERY_CHALLAN_NUMBER: string,
  STATUS: string,
  PO_NUMBER: string,
  FILE: File | null,
  SHIPMENT_DATE: string,
  EST_DELIVERY_DATE: string,
  PO_HEADER: string,
  ORG_ID: string,
  SHIP_NUM: string,
  note: string,
  status: string,
  ITEM: ShipmentSubmitItemInterface[]
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}shipment/add-update`;

  console.log("rfqID: ", RFQ_ID);
  console.log("shipmentId: ", shipmentId);
  console.log("CS_ID: ", CS_ID);
  console.log("shipFromID: ", SHIP_FROM_LOCATION_ID);
  console.log("BillToId: ", BILL_TO_LOCATION_ID);
  console.log("LC_NUMBER: ", LC_NUMBER);
  console.log("BL_CHALLAN_NUMBER: ", BL_CHALLAN_NUMBER);
  console.log("VAT_CHALLAN_NUMBER: ", VAT_CHALLAN_NUMBER);
  console.log("DEVLIVERY_CHALLAN_NUMBER: ", DEVLIVERY_CHALLAN_NUMBER);
  console.log("STATUS: ", STATUS);
  console.log("PO_NUMBER: ", PO_NUMBER);
  console.log("FILE: ", FILE);
  console.log("SHIPMENT_DATE: ", SHIPMENT_DATE);
  console.log("EST_DATE: ", EST_DELIVERY_DATE);
  console.log("orgId: ", ORG_ID);
  console.log("SHIP_NUM: ", SHIP_NUM);
  console.log("note: ", note);
  console.log("status: ", status);
  console.log("ITEM: ", ITEM);

  const shipmentDateValue = SHIPMENT_DATE && SHIPMENT_DATE.trim() !== "" ? SHIPMENT_DATE : null;
  const estDeliveryDateValue = EST_DELIVERY_DATE && EST_DELIVERY_DATE.trim() !== "" ? EST_DELIVERY_DATE : null;

  console.log("SHIPMENT_DATE: ", shipmentDateValue);
  console.log("EST_DELIVERY_DATE: ", estDeliveryDateValue);

  // const formData = new FormData();
  // formData.append("RFQ_ID", RFQ_ID);
  // formData.append("CS_ID", CS_ID);
  // formData.append("SHIP_FROM_LOCATION_ID", SHIP_FROM_LOCATION_ID);
  // formData.append("BILL_TO_LOCATION_ID", BILL_TO_LOCATION_ID);
  // formData.append("LC_NUMBER", LC_NUMBER);
  // formData.append("BL_CHALLAN_NUMBER", BL_CHALLAN_NUMBER);
  // formData.append("VAT_CHALLAN_NUMBER", VAT_CHALLAN_NUMBER);
  // formData.append("DEVLIVERY_CHALLAN_NUMBER", DEVLIVERY_CHALLAN_NUMBER);
  // formData.append("STATUS", STATUS);
  // formData.append("PO_NUMBER", PO_NUMBER);
  // // if (FILE != null) {
  // //   formData.append("FILE", FILE);
  // // }
  // formData.append("SHIPMENT_DATE", SHIPMENT_DATE);
  // formData.append("EST_DELIVERY_DATE", EST_DELIVERY_DATE);
  
  // formData.append("PO_HEADER", PO_HEADER);
  // formData.append("ORG_ID", ORG_ID);

  // if (ITEM.length !== 0 || ITEM !== null) {
  //   formData.append("ITEM", JSON.stringify(ITEM));
  // }

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    // body: formData,
    body: JSON.stringify({
      SHIPMENT_ID: shipmentId,
      RFQ_ID: RFQ_ID,
      CS_ID: CS_ID,
      SHIP_FROM_LOCATION_ID: SHIP_FROM_LOCATION_ID,
      BILL_TO_LOCATION_ID: BILL_TO_LOCATION_ID,
      LC_NUMBER: LC_NUMBER,
      BL_CHALLAN_NUMBER: BL_CHALLAN_NUMBER,
      VAT_CHALLAN_NUMBER: VAT_CHALLAN_NUMBER,
      DEVLIVERY_CHALLAN_NUMBER: DEVLIVERY_CHALLAN_NUMBER,
      STATUS: STATUS,
      PO_NUMBER: PO_NUMBER,
      SHIPMENT_DATE: shipmentDateValue,
      EST_DELIVERY_DATE: estDeliveryDateValue,
      PO_HEADER_ID: PO_HEADER,
      GATE_RCV_STATUS: status,
      GATE_RCV_REMARKS: note,
      ORG_ID: ORG_ID,
      SHIP_NUM: SHIP_NUM,
      ITEM: ITEM
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default ShipmentAddUpdateService;
