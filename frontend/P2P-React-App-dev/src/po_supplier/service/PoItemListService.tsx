const PoItemListService = async (
  token: string,
  PO_HEADER_ID: string | "",
  PO_NUMBER: string | ""
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}po/item-details`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      PO_HEADER_ID: PO_HEADER_ID,
      PO_NUMBER: PO_NUMBER,
      OFFSET: 1,
      LIMIT: 100
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default PoItemListService;
