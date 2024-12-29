


const UserInfoUpdateService = async (token: string, userId: number, columnName: string, value: string) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}common/user-info-update`;

  console.log("userId: ", userId);
  console.log("columnName: ", columnName);
  console.log("value: ", value);


  const response = await fetch(url,
      {
          method: "POST",

          headers: {

              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,

          },
          body: JSON.stringify({

              USER_ID: userId,
              COLUMN_NAME: columnName,
              VALUE: value

          }),

      }
  );
  const data = await response.json();
  return {
      statusCode: response.status,
      data: data
  };


}
export default UserInfoUpdateService