//OraganizationInsertDeleteToUserService

const NotificationReadService = async (token: string, id: number | null) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}notification/notifications-read`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ID: id,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default NotificationReadService;
