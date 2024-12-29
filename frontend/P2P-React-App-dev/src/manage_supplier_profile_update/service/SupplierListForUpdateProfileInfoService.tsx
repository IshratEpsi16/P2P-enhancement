const SupplierListForUpdateProfileInfoService = async (
  token: string,
  approvalStatus: string | "",
  searchKey: string | ""
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}supplier-approval/pending-new/profile-new-info-list`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      APPROVAL_STATUS: approvalStatus,
      SEARCH_VALUE: searchKey,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default SupplierListForUpdateProfileInfoService;
