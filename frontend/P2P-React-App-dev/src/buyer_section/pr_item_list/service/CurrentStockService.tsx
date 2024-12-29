const CurrentStockService = async (
  token: string,
  orgId: number,
  itemId: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}rfq/inventory-stock`;
  console.log(orgId);
  console.log(itemId);

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
export default CurrentStockService;
