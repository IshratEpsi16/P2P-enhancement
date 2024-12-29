const PoListService = async (
  token: string,
  status: string,
  userId: number | null,
  offset: number,
  limit: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}po/list`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      PO_STATUS: status,
      USER_ID: userId,
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
export default PoListService;
