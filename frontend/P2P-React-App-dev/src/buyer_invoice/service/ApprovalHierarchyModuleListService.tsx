const ApprovalHierarchyModuleListService = async (
  token: string,
  id: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}hierarchy/list-by-module`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      SUPPLIER_ID: id,
      MODULE_NAME: "Local Invoice Approval",
    }),
  });
  const data = await response.json();
  console.log(data);
  return {
    statusCode: response.status,
    data: data,
  };
};
export default ApprovalHierarchyModuleListService;
