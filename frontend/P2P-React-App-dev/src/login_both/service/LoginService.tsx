const LoginService = async (userName: string, password: string) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}login`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      EMAIL: userName,
      USER_PASS: password,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default LoginService;
