const CsListService = async (
  token: string,

  FROM_DATE: string,
  TO_DATE: string,
  CS_STATUS: string,
  OFFSET: number,
  LIMIT: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}cs/list`;
  console.log(FROM_DATE);
  console.log(TO_DATE);
  console.log(CS_STATUS);

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      FROM_DATE: FROM_DATE,
      TO_DATE: TO_DATE,
      CS_STATUS: CS_STATUS, //IN PROCESS //SAVE
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
export default CsListService;
