const prItemListService = async (
  token: string,
  buyerId: number | null,
  orgId: number | null,
  prNumber: number | null,
  DATE_FROM: string | null,
  DATE_TO: string | null,
  SEARCH_FIELD: string | null,
  ITEM_NAME: string | null,

  BUYER_NAME: string | null,
  offset: number,
  limit: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}approved-pr/list`;
  console.log("buyerId", buyerId);
  console.log("orgId", orgId);

  console.log("formd", DATE_FROM);
  console.log("formt", DATE_TO);
  console.log("prNumber", prNumber);
  console.log(isNaN(prNumber!) ? null : prNumber);

  console.log("SEARCH_FIELD", SEARCH_FIELD);
  console.log("ITEM_NAME", ITEM_NAME);
  console.log("BUYER_NAME", BUYER_NAME);

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      BUYER_ID: buyerId, //buyerid/username
      ORG_ID: orgId,
      PR_NUMBER: isNaN(prNumber!) ? null : prNumber,
      ITEM_NAME: ITEM_NAME,
      DATE_FROM: DATE_FROM,
      DATE_TO: DATE_TO,
      REQUESTOR_NAME: SEARCH_FIELD,

      BUYER_NAME: BUYER_NAME,
      OFFSET: offset,
      LIMIT: limit,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default prItemListService;
