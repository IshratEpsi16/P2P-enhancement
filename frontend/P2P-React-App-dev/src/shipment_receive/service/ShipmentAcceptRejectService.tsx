


const ShipmentAcceptRejectService = async (token: string, shipId: number, shipmentPo: number, shipmentOrgId: number, shipmentReceive: string, shipmentRemarks: string) => {

  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}shipment/gate-receive`;

  console.log("token: ", token);
  console.log("shipment id: ", shipId);
  console.log("shipment Po: ", shipmentPo);
  console.log("shipment org: ", shipmentOrgId);
  console.log("shipment status: ", shipmentReceive);
  console.log("shipment note: ", shipmentRemarks);

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      SHIPMENT_ID: shipId,
      GATE_RCV_STATUS: shipmentReceive,
      GATE_RCV_REMARKS: shipmentRemarks,
      PO_NUMBER: shipmentPo,
      ORG_ID: shipmentOrgId,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default ShipmentAcceptRejectService;
