const BannerListService = async (
  token: string,
  BANNER_TYPE: string, //N,
  SHOW_FOR: string,
  IS_ACTIVE: number | null,
  OFFSET: number,
  LIMIT: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}system-setup/banner/banner-list`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      BANNER_TYPE: BANNER_TYPE, //N,
      SHOW_FOR: SHOW_FOR,
      IS_ACTIVE: IS_ACTIVE,
      OFFSET: OFFSET,
      LIMIT: LIMIT,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default BannerListService;
