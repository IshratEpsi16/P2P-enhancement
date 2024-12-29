//OraganizationInsertDeleteToUserService

const RfqItemListService = async (token: string, RFQ_ID: number | null) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}cs/item/list`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      RFQ_ID: RFQ_ID,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default RfqItemListService;
