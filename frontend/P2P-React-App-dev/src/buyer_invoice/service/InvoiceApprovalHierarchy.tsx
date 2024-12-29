const InvoiceApprovalHierarchyService = async (
  token: string,
  id: number,
  MODULE_NAME: string,
  invId: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}hierarchy/invoice-hierarchy`;

  console.log(id);
  console.log(MODULE_NAME);
  console.log(invId);

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      SUPPLIER_ID: id,
      MODULE_NAME: MODULE_NAME,
      INV_ID: invId,
    }),
  });
  const data = await response.json();
  console.log(data);
  return {
    statusCode: response.status,
    data: data,
  };
};
export default InvoiceApprovalHierarchyService;
