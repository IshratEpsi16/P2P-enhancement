const SupplierMaintananceModeChangeService = async (
  token: string,

  OBJECT_VALUE: string
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}system-setup/supplier-maintenance-mode`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      OBJECT_VALUE: OBJECT_VALUE, //"Y"//N
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default SupplierMaintananceModeChangeService;
