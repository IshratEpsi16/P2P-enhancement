const ApprovalStageUpdateService = async (
  token: string,
  supplierId: number,
  asId: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}approval-stage/update`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      SUPPLIER_ID: supplierId,
      AS_ID: asId,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default ApprovalStageUpdateService;
