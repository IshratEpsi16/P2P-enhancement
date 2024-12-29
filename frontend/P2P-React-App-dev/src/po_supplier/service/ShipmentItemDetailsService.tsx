const ShipmentItemDetailsService = async ( token: string, shipmentId: number ) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}shipment/shipment-details`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      SHIPMENT_ID: shipmentId,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default ShipmentItemDetailsService;
