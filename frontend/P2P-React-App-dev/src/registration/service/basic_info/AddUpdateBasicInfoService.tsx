const AddUpdateBasicInformationService = async (
  token: string,
  orgName: string,
  address: string,
  incorporatedIn: string,
  orgId: string,
  categoryId: string
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}supplier-registration/basic-info/add`;

  console.log(orgName, address, incorporatedIn, categoryId);

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      organization_name: orgName,
      supplier_address: address,
      incorporate_in: incorporatedIn,
      organization_type: orgId,
      category_id: categoryId,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default AddUpdateBasicInformationService;
