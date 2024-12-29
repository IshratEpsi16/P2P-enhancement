const PendingInvoiceItemListService = async (token: string, id: number) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}supplier-approval/pending-invoice/item-details`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      INVOICE_ID: id,
    }),
  });
  const data = await response.json();
  console.log(data);
  return {
    statusCode: response.status,
    data: data,
  };
};
export default PendingInvoiceItemListService;
