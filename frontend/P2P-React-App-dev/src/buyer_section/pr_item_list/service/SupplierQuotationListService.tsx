//OraganizationInsertDeleteToUserService

const SupplierQuotationListService = async (
  token: string,
  rfqId: number | null,
  offset: number,
  limit: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}submitted-quotation/invited-suppliers`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      RFQ_ID: rfqId, //
      OFFSET: offset, //
      LIMIT: limit, //
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default SupplierQuotationListService;
