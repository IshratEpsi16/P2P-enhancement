const CreateSupplierAccountService = async (
  username: string,
  email: string,
  mobile: string,
  password: string,
  bgId: number,
  intId: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}account-creation`;

  console.log(username);
  console.log(email);
  console.log(mobile);
  console.log(password);
  console.log(bgId);
  console.log(intId);

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      // "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      USER_NAME: username,
      EMAIL_ADDRESS: email,
      PASSWORD: password,
      MOBILE_NUMBER: mobile,
      BUSINESS_GROUP_ID: bgId,
      INITIATOR_ID: intId,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default CreateSupplierAccountService;
