const ChangePasswordService = async (password: string, phoneNo: string) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}update-password`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      // "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      MOBILE_NUMBER: phoneNo,
      PASSWORD: password,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default ChangePasswordService;
