const RfqDetailsService = async (
  token: string,
  RFQ_ID: number,
  OFFSET: number,

  LIMIT: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}rfq/rfq-details`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      RFQ_ID: RFQ_ID,
      OFFSET: OFFSET,
      LIMIT: LIMIT,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default RfqDetailsService;
