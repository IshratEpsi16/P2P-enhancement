const AddUpdateSiteService = async (
  token: string,
  id: number,
  country: string,
  address_link_1: string,
  address_link_2: string,
  city_status: string,
  email: string,
  mobile_number: string,
  zip_code: string,
  activeStatus: string,
  primary_check: string,
  invoiceCurrency: string,
  paymentCurrency: string,
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}supplier-registration/site-creation/add`;
  // supplier-registration/site-creation/add

  console.log(url);
  console.log("primary_checkbox: ", primary_check);
  console.log("invoice currency: ", invoiceCurrency);
  console.log("payment currency: ", paymentCurrency);

  console.log("active status: ", activeStatus);

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      country: country,
      address_link_1: address_link_1,
      address_link_2: address_link_2,
      city_status: city_status,
      email: email,
      mobile_number: mobile_number,
      zip_code: zip_code,
      id: id,
      active_status: activeStatus,
      primary_site: primary_check,
      invoice_currency_code: invoiceCurrency,
      payment_currency_code: paymentCurrency
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default AddUpdateSiteService;
