const CsItemDeleteService = async (
  token: string,

  CS_LINE_ID: number[],
  RFQ_LINE_ID: number[]
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}cs/cs-item-delete`;

  console.log(CS_LINE_ID);
  console.log(RFQ_LINE_ID);

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      //IN PROCESS //SAVE
      CS_LINE_ID: CS_LINE_ID,
      RFQ_LINE_ID: RFQ_LINE_ID,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default CsItemDeleteService;
