const ApproveHistoryByModuleService = async (
  token: string,

  OBJECT_ID: number,
  OBJECT_TYPE_CODE: string
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}approval/approve-history-by-module`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      OBJECT_ID: OBJECT_ID, //cs id
      OBJECT_TYPE_CODE: OBJECT_TYPE_CODE,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default ApproveHistoryByModuleService;
