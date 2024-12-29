const BuyerInvoiceListService = async (
  token: string,
  APPROVAL_STATUS: string,
  SEARCH_VALUE: string,
  OFFSET: number,
  LIMIT: number
) => {
  console.log(token, SEARCH_VALUE, OFFSET);
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}supplier-approval/pending-invoice/list`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      APPROVAL_STATUS: APPROVAL_STATUS,
      SEARCH_VALUE: SEARCH_VALUE,
      OFFSET: OFFSET,
      LIMIT: LIMIT,
    }),
  });
  const data = await response.json();
  console.log(data);
  return {
    statusCode: response.status,
    data: data,
  };
};
export default BuyerInvoiceListService;
