
const CreateShipmentItemService = async (
  token: string,
  PO_NUMBER: string | ""
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}shipment/shipment-item`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      PO_NUMBER: PO_NUMBER,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default CreateShipmentItemService;
