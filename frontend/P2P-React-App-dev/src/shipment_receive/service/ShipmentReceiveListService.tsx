
const ShipmentReceiveListService = async (token: string, shipmentStatus: string, offset: number, limit: number) => {

  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}shipment/list`;

  console.log("token: ", token);
  console.log("offset: ", offset);
  console.log("limit: ", limit);
  console.log("shipmentStatus: ", shipmentStatus);

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      USER_ID: "",
      PO_HEADER_ID: "",
      PO_NUMBER: "",
      LC_NUMBER: "",
      BL_CHALLAN_NUMBER: "",
      VAT_CHALLAN_NUMBER: "",
      DEVLIVERY_CHALLAN_NUMBER: "",
      GATE_RCV_STATUS: shipmentStatus,
      STATUS: "",
      FROM_DATE: "",
      TO_DATE: "",
      OFFSET: offset,
      LIMIT: limit
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default ShipmentReceiveListService;
