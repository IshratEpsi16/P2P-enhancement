const AddSiteToContactService = async (
  token: string,
  contactId: number,
  siteId: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}supplier-registration/contact/contact-site-add`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      CONTACT_ID: contactId,
      SITE_ID: siteId,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default AddSiteToContactService;
