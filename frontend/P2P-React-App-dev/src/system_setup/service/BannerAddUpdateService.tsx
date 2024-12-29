const BannerAddUpdateService = async (
  token: string,
  ID: number | null,
  BANNER_SEQUENCE: number,
  BANNER_TYPE: string, //N,
  SHOW_FOR: string,
  IS_ACTIVE: number | null
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}system-setup/banner/add-update`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ID: ID,
      BANNER_SEQUENCE: BANNER_SEQUENCE,
      BANNER_TYPE: BANNER_TYPE, //N,
      SHOW_FOR: SHOW_FOR,
      IS_ACTIVE: IS_ACTIVE,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default BannerAddUpdateService;
