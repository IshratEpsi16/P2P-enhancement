const SupplierListService = async (
  token: string,
  useActiveStatus: number | null,
  approvalStatus: string | "",
  submissionStatus: string | "",
  isRegCompelte: number | null,
  searchKey: string | "",
  offset: number | null,
  limit: number | null
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}supplier/list`;

  console.log("offset:", offset);
  console.log("limit", limit);

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      USER_ACTIVE_STATUS: useActiveStatus,
      APPROVAL_STATUS: approvalStatus,
      SUBMISSION_STATUS: submissionStatus,
      IS_REG_COMPLETE: isRegCompelte,
      SEARCH_VALUE: searchKey,
      OFFSET: offset,
      LIMIT: limit
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default SupplierListService;
