const PrItemDetailsBuyerService = async (
  token: string,
  rfqStatus: string,
  offset: number,
  limit: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}rfq/rfq-list`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      RFQ_ID: "",
      RFQ_SUBJECT: "",
      RFQ_TITLE: "",
      RFQ_STATUS: rfqStatus,
      RFQ_TYPE: "",
      NEED_BY_DATE: "",
      OPEN_DATE: "",
      CLOSE_DATE: "",
      NOTE_TO_SUPPLIER: "",
      SUPLLIER_CURRENCY_CODE: "",
      SUPLLIER_FREIGHT_CHARGE: "",
      RFQ_ATTACHMENT_FILE_ORG_NAME: "",
      RFQ_ATTACHMENT_FILE_NAME: "",
      BILL_TO_LOCATION_ID: "",
      SHIP_TO_LOCATION_ID: "",
      ETR: "",
      BUYER_ATTACHMENT_FILE_ORG_NAME: "",
      BUYER_ATTACHMENT_FILE_NAME: "",
      CURRENCY_CODE: "",
      VAT_APPLICABLE_STATUS: "",
      VAT_RATE: "",
      INVOICE_TYPE: "",
      FREIGHT_TERM: "",
      PAYMENT_TERM_ID: "",
      BUYER_GENERAL_TERMS: "",
      PREPARER_ID: "",
      PREPARER_STATUS: "",
      OFFSET: offset,
      LIMIT: limit,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default PrItemDetailsBuyerService;
