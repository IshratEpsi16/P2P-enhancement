const InvoiceListService = async (
  token: string,
  invoiceId: number | null,
  approvalStatus: string,
  supplierId: number | null,
  offset: number,
  limit: number,
  orderBy: string,
  INVOICE_STATUS: string,
  BUYER_APPROVAL_STATUS: string,
  INVOICE_TYPE: string,
  STATUS: string
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}invoice/supplier/invoice-list`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      INV_ID: invoiceId,
      APPROVAL_STATUS: approvalStatus,
      SUPPLIER_ID: supplierId,
      OFFSET: offset,
      LIMIT: limit,
      ORDER_BY: orderBy, //ASC, DESC
      INVOICE_STATUS: INVOICE_STATUS,
      BUYER_APPROVAL_STATUS: BUYER_APPROVAL_STATUS,
      INVOICE_TYPE: INVOICE_TYPE,
      STATUS: STATUS,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default InvoiceListService;
