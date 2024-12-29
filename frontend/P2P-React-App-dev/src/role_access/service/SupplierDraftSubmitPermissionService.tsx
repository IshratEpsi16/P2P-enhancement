


const SupplierDraftSubmitPermissionService = async (token: string, userId: number, submitStatus: string) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}edit-permission`;

  console.log("user: ", userId);
  console.log("status: ", submitStatus);


  const response = await fetch(url,
      {
          method: "POST",

          headers: {

              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,

          },
          body: JSON.stringify({

              USER_ID: userId,
              SUBMISSION_STATUS: submitStatus

          }),

      }
  );
  const data = await response.json();
  return {
      statusCode: response.status,
      data: data
  };


}
export default SupplierDraftSubmitPermissionService