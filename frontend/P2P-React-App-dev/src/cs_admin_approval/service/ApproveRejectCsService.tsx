const ApproveRejectCsService = async (
  token: string,
  CS_ID: number,
  ACTION_CODE: string,
  STAGE_ID: number,
  STAGE_LEVEL: number,
  NOTE: string
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}cs/approve-reject`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      CS_ID: CS_ID,
      ACTION_CODE: ACTION_CODE,
      STAGE_ID: STAGE_ID,
      STAGE_LEVEL: STAGE_LEVEL,
      NOTE: NOTE,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default ApproveRejectCsService;
