const AddOuToContactService = async (
  token: string,
  contactId: number,
  shortCode: string,
  name: string,
  organizationId: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}supplier-registration/contact/contact-ou`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      CONTACT_ID: contactId,
      SHORT_CODE: shortCode,
      NAME: name,
      ORGANIZATION_ID: organizationId,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default AddOuToContactService;
