const DeleteLineItemService = async (token: string, lineId: number) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}rfq/line-item-delete`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      RFQ_LINE_ID: lineId,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default DeleteLineItemService;
