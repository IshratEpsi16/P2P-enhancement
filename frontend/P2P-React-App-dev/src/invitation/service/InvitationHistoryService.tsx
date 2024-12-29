const InvitationHistoryService = async (
  token: string,
  startDate: string,
  endaDate: string,
  offset: number,
  limit: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}invitation-history`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      DATE_FROM: startDate,
      DATE_TO: endaDate,
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
export default InvitationHistoryService;
