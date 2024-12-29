const ProfilePictureUploadService = async (
  token: string,
  proPic: File | null
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}profile/upload`;

  const formData = new FormData();
  if (proPic !== null) {
    formData.append("profile_pic_file", proPic);
  }

  const response = await fetch(url, {
    method: "POST",

    headers: {
      // "Content-Type": "application/json",
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
export default ProfilePictureUploadService;
