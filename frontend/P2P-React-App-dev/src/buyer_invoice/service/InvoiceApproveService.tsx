const InvoiceApproveService = async (
  token: string,
  action_code: number,
  supplier_id: number,
  stage_id: number,
  note: string,
  stage_level: number,
  invoice_id: number,
  IS_BUYER: string,
  MODULE_NAME: string
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}supplier-approval/pending-invoice/approve-reject`;
  console.log(note);

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ACTION_CODE: action_code, //Reject = 2, Approve = 1
      SUPPLIER_ID: supplier_id,
      STAGE_ID: stage_id, //Template id
      NOTE: note,
      STAGE_LEVEL: stage_level,
      INVOICE_ID: invoice_id,
      IS_BUYER: IS_BUYER,
      MODULE_NAME: MODULE_NAME,
    }),
  });
  const data = await response.json();
  console.log(data);
  return {
    statusCode: response.status,
    data: data,
  };
};
export default InvoiceApproveService;
