const DeleteInviteSupplierService = async (
  token: string,
  suppliers: Array<{ INVITATION_ID: string; EMAIL: string; EMAIL_SENT_STATUS: string }>
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}rfq/supplier-delete`;

  console.log("delete: ", suppliers);

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      INVITATION_ID: suppliers
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default DeleteInviteSupplierService;
