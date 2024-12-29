import ConvertedOldSupplierInterface from "../interface/ConvertedOldSupplierInterface";

const OldSupplierInvitationService = async (
  token: string,
  SUPPLIERS: ConvertedOldSupplierInterface[]
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}old-supplier-invite`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      SUPPLIERS: SUPPLIERS,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default OldSupplierInvitationService;
