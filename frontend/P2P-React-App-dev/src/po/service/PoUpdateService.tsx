const PoUpdateService = async (
  token: string,
  invitationId: number,
  poStatus: string,
  poRemarks: string
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}po/update`;
  console.log(poRemarks);

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      INVITATION_ID: invitationId,
      PO_STATUS: poStatus, //"REJETED"
      PO_REMARKS: poRemarks,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default PoUpdateService;
