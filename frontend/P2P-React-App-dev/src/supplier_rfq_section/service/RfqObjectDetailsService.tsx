const RfqObjectDetailsService = async (
  token: string,
  rfqId: number,
  supplierId: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}supplier-rfq/object-details`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      RFQ_ID: rfqId,
      SUPPLIER_ID: supplierId,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default RfqObjectDetailsService;
