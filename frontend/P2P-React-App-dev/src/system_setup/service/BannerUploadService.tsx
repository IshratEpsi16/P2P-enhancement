const BannerUploadService = async (
  token: string,

  BANNER_SEQUENCE: string,
  BANNER_TYPE: string, //N,
  SHOW_FOR: string,

  BANNER_IMG: File | null
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}system-setup/banner/add-update`;
  const formData = new FormData();

  formData.append("BANNER_SEQUENCE", BANNER_SEQUENCE);
  formData.append("BANNER_TYPE", BANNER_TYPE);
  formData.append("SHOW_FOR", SHOW_FOR);

  if (BANNER_IMG !== null) {
    formData.append("BANNER_IMG", BANNER_IMG!);
  }

  console.log(BANNER_SEQUENCE);
  console.log(BANNER_TYPE);
  console.log(SHOW_FOR);
  console.log(BANNER_IMG);

  const response = await fetch(url, {
    method: "POST",

    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default BannerUploadService;
