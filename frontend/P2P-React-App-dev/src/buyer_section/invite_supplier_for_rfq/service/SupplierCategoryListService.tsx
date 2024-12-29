const SupplierCategoryListService = async (token: string, orgId: string) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}rfq/category-list`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ORG_ID: orgId,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default SupplierCategoryListService;
