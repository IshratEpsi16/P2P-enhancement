const ItemWisePrHistoryService = async (
  token: string,

  REQUISITION_HEADER_ID: number,
  REQUISITION_LINE_ID: number,
  PR_NUMBER: number,
  ORG_ID: number,
  ITEM_ID: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}cs/item/pr-history`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      REQUISITION_HEADER_ID: REQUISITION_HEADER_ID,
      REQUISITION_LINE_ID: REQUISITION_LINE_ID,
      PR_NUMBER: PR_NUMBER,
      ORG_ID: ORG_ID,
      ITEM_ID: ITEM_ID,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default ItemWisePrHistoryService;
