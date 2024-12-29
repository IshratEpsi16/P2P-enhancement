const NotificationMarkAllReadService = async (token: string) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}notification/mark-all-notifications`;

  console.log("mark all service");

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default NotificationMarkAllReadService;
