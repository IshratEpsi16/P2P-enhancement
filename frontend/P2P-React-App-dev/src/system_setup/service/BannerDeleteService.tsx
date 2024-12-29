const BannerDeleteService = async (
  token: string,
  ID: number,
  FILE_NAME: string
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}system-setup/banner/banner-delete`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ID: ID,
      FILE_NAME: FILE_NAME,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default BannerDeleteService;
