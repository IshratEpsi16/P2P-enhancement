const RfqlistServiceInPreparation = async (
  token: string,
  fromDate: string,
  toDate: string,
  searchVal: string,
  rfqStatus: string,
  userId: number | null,
  offset: number,
  limit: number | null
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}rfq/rfq-list`;

  console.log("from: ", fromDate);
  console.log("to: ", toDate);
  console.log("userId: ", userId);
  console.log("offset: ", offset);
  console.log("limit: ", limit);

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      FROM_DATE: fromDate,
      TO_DATE: toDate,
      SEARCH_FIELD: searchVal,
      RFQ_STATUS: rfqStatus,
      CREATED_BY: userId,
      OFFSET: offset,
      LIMIT: limit,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default RfqlistServiceInPreparation;
