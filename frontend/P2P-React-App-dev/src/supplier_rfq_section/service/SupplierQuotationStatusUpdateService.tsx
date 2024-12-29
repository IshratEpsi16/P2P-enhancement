const SupplierQuotationStatusUpdateService = async (
  token: string,
  RFQ_ID: number,
  resStatus: number,
  SUBMISSION_STATUS: string,
  SUPPLIER_TERM_FILE: File | null,
  OLD_FILE_NAME: string | null,
  QUOT_VALID_DATE: string,
  SITE_ID: string,
  CURRENCY_CODE: string,
  NOTE_TO_BUYER: string
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}supplier-rfq/quotation-status-update`;

  console.log(RFQ_ID)
  console.log(resStatus)
  console.log(SUBMISSION_STATUS)
  console.log(SUPPLIER_TERM_FILE)
  console.log(OLD_FILE_NAME)
  console.log(QUOT_VALID_DATE)
  console.log(SITE_ID)
  console.log(CURRENCY_CODE)
  console.log(NOTE_TO_BUYER)

  const formData = new FormData();
  formData.append("RFQ_ID", RFQ_ID.toString());
  formData.append("RESPONSE_STATUS", resStatus.toString());
  formData.append("SUBMISSION_STATUS", SUBMISSION_STATUS);
  if (SUPPLIER_TERM_FILE != null) {
    formData.append("SUPPLIER_TERM_FILE", SUPPLIER_TERM_FILE);
  }
  if (OLD_FILE_NAME != null) {
    formData.append("OLD_FILE_NAME", OLD_FILE_NAME);
  }

  formData.append("QUOT_VALID_DATE", QUOT_VALID_DATE);
  formData.append("SITE_ID", SITE_ID);
  formData.append("CURRENCY_CODE", CURRENCY_CODE);
  formData.append("NOTE_TO_BUYER", NOTE_TO_BUYER);
  console.log(RFQ_ID);
  console.log(SUBMISSION_STATUS);

  const response = await fetch(url, {
    method: "POST",

    headers: {
      // "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default SupplierQuotationStatusUpdateService;
