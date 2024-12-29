const ItemWiseQuotationService = async (
  token: string,
  rfqId: number,
  rfqLineIdArray: number[],
  orgId: number,
  offset: number,
  limit: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}cs/supplier/list-and-items`;

  console.log("org: ", orgId);
  console.log("lineId: ", rfqLineIdArray);

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      RFQ_ID: rfqId,
      RFQ_LINE_ID: rfqLineIdArray,
      ORG_ID: orgId,
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
export default ItemWiseQuotationService;
