

const OwnPasswordChangeService = async (token: string, oldPass: string, newPass: string) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}common/change-own-password`;


  const response = await fetch(url,
      {
          method: "POST",

          headers: {

              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,

          },
          body: JSON.stringify({

              "OLD_PASSWORD": oldPass,
              "NEW_PASSWORD": newPass

          }),

      }
  );
  const data = await response.json();
  return {
      statusCode: response.status,
      data: data
  };


}
export default OwnPasswordChangeService