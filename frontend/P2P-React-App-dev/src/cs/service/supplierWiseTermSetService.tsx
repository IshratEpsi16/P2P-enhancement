const SupplierWiseTermSetService = async (
  token: string,

  INVITATION_ID: number,
  GENERAL_TERMS: string
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}cs/supplier-term-set`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      INVITATION_ID: INVITATION_ID,
      GENERAL_TERMS: GENERAL_TERMS,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default SupplierWiseTermSetService;
