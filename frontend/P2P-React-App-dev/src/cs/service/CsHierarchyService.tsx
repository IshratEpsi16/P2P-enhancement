const CsHierarchyService = async (
  token: string,
  MODULE_NAME: string,
  CS_ID: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}hierarchy/cs-list`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      MODULE_NAME: MODULE_NAME,
      OBJECT_ID: CS_ID, // cs id
      OBJECT_TYPE_CODE: "CS",
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default CsHierarchyService;
