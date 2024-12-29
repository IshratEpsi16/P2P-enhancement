const BankWiseBranchListService = async (token: string, partyId: string) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}common/branch-list`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      BANK_PARTY_ID: partyId,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default BankWiseBranchListService;
