const RfqEditPermissionService = async (
  token: string,
  RFQ_ID: number,
  SUPPLIER_ID: number,
  CAN_EDIT: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}supplier-rfq/rfq-edit-permission`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      RFQ_ID: RFQ_ID,
      SUPPLIER_ID: SUPPLIER_ID,
      CAN_EDIT: CAN_EDIT,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default RfqEditPermissionService;
