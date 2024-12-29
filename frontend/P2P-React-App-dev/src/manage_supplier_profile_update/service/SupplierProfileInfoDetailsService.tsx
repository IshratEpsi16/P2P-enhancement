const SupplierProfileInfoDetailsService = async (
  token: string,
  SUPPLIER_ID: number,
  approverStatus: string
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}supplier-approval/pending-new/details`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      SUPPLIER_ID: SUPPLIER_ID,
      APPROVER_STATUS: approverStatus,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default SupplierProfileInfoDetailsService;
