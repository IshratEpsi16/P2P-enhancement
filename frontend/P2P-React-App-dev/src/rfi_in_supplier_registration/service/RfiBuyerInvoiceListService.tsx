// RfiBuyerInvoiceListService

const RfiBuyerInvoiceListService = async (
  token: string,
  INV_ID: string,
  APPROVAL_STATUS: string,
  OFFSET: number,
  LIMIT: number
) => {
  console.log(token, INV_ID, OFFSET);
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}supplier-approval/pending-invoice/list`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      INV_ID: INV_ID,
      APPROVAL_STATUS: APPROVAL_STATUS,
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
export default RfiBuyerInvoiceListService;
