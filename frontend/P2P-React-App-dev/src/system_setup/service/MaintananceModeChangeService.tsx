const MaintananceModeChangeService = async (
  token: string,
  OBJECT_TYPE: string,
  OBJECT_VALUE: string
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}system-setup/supplier-maintenance-mode-change`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      OBJECT_TYPE: OBJECT_TYPE,
      OBJECT_VALUE: OBJECT_VALUE, //"Y"//N
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default MaintananceModeChangeService;
