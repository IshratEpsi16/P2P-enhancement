//NewUserPasswordChangeService

const NewUserPasswordChangeService = async (
  token: string,
  password: string
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}new-user-update-password`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      PASSWORD: password,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default NewUserPasswordChangeService;
