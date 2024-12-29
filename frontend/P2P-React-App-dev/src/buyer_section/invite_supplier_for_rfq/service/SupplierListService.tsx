const SupplierListService = async (
  token: string,
  headerId: string,
  searchKey: string,
  orgId: string,
  offset: number,
  limit: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}rfq/supplier-list`;

  console.log("org: ", orgId);
  console.log("searchKey: ", searchKey);
  console.log("headerKey: ", headerId);

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      VENDOR_LIST_HEADER_ID: headerId,
      SEARCH_FIELD: searchKey,
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
export default SupplierListService;
