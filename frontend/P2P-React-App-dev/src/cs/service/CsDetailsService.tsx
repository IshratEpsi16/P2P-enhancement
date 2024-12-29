const CsDetailsService = async (
  token: string,

  CS_ID: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}cs/cs-details`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      CS_ID: CS_ID,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default CsDetailsService;
