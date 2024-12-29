const OrgWiseStockService = async (
  token: string,

  orgId: number,
  itemId: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}rfq/ou-wise-stock`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ORG_ID: orgId,
      ITEM_ID: itemId,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default OrgWiseStockService;
