const HierachyListByModuleService = async (
  token: string,
  supplierId: number,
  functionName: string
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}hierarchy/list-by-module`;

  console.log(supplierId);
  console.log(functionName);

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      SUPPLIER_ID: supplierId,
      MODULE_NAME: functionName,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default HierachyListByModuleService;
