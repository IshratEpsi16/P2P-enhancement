const SupplierInvoiceDetailsService = async (
  token: string,
  INVOICE_ID: number,
  OFFSET: number,
  LIMIT: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}invoice/supplier/details`;
  console.log(INVOICE_ID);
  console.log(OFFSET);
  console.log(LIMIT);

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      INVOICE_ID: INVOICE_ID,
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
export default SupplierInvoiceDetailsService;
