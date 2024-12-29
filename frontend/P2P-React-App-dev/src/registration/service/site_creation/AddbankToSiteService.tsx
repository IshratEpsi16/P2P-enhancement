const AddbankToSiteService = async (
  token: string,
  siteId: number,
  bankId: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}supplier-registration/site-bank/add`;

  console.log("siteBankId: ", siteId);
  console.log("bankId: ", bankId);

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      SITE_ID: siteId,
      BANK_ID: bankId,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default AddbankToSiteService;
