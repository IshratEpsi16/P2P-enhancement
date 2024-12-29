const RfqListSupplierService = async (
  token: string,
  rfqStatus: string,
  responseStatus: string,
  offset: number,
  limit: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}supplier-rfq/list`;

  console.log(rfqStatus, responseStatus);

  // const url = `http://10.27.1.83:3000/api/v1/supplier-rfq/list`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      RFQ_STATUS: "",
      RESPONSE_STATUS: responseStatus, //New=0, Open=''
      STATE: rfqStatus,
      OFFSET: offset,
      LIMIT: limit,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default RfqListSupplierService;
