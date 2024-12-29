const AddCategoryToSupplierService = async (
  token: string,
  id: number | null,
  supplierId: number,
  orgId: number,
  name: string,
  status: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}supplier-category/add-remove`;

  console.log(id, supplierId, orgId, name, status);

  let decode;
  if (id == null) {
    decode = JSON.stringify({
      SUPPLIER_ID: supplierId,
      ORGANIZATION_ID: orgId,
      VENDOR_LIST_NAME: name,
      STATUS: status,
    });
  } else {
    decode = JSON.stringify({
      ID: id,
      SUPPLIER_ID: supplierId,
      ORGANIZATION_ID: orgId,
      VENDOR_LIST_NAME: name,
      STATUS: status,
    });
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: decode,
  });

  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};

export default AddCategoryToSupplierService;
