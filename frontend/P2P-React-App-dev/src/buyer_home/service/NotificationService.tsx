//OraganizationInsertDeleteToUserService

const NotificationService = async (
  token: string,
  offset: number | null,
  limit: number | null
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}notification/my-notifications`; //-live

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      OFFSET: offset, //
      LIMIT: limit, // // Object or Supplier ID
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default NotificationService;
