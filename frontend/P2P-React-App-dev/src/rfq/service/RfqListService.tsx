//OraganizationInsertDeleteToUserService

const RfqListService = async (
  token: string,
  RFQ_ID: number | null,
  RFQ_SUBJECT: string | null,
  RFQ_TITLE: string | null,
  RFQ_TYPE: string | null,
  NEED_BY_DATE: string | null,
  OPEN_DATE: string | null,
  CLOSE_DATE: string | null,
  NOTE_TO_SUPPLIER: string | null,
  SUPLLIER_CURRENCY_CODE: string | null,
  SUPLLIER_FREIGHT_CHARGE: string | null,
  RFQ_ATTACHMENT_FILE_ORG_NAME: string | null,
  RFQ_ATTACHMENT_FILE_NAME: string | null,
  BILL_TO_LOCATION_ID: string | null,
  SHIP_TO_LOCATION_ID: string | null,
  ETR: string | null,
  BUYER_ATTACHMENT_FILE_ORG_NAME: string | null,
  BUYER_ATTACHMENT_FILE_NAME: string | null,
  CURRENCY_CODE: string | null,
  VAT_APPLICABLE_STATUS: string | null,
  VAT_RATE: string | null,
  INVOICE_TYPE: string | null,
  FREIGHT_TERM: string | null,
  PAYMENT_TERM_ID: number | null,
  BUYER_GENERAL_TERMS: string | null,
  PREPARER_ID: number | null,
  PREPARER_STATUS: string | null,
  CREATED_BY: string | null,
  OFFSET: number,
  LIMIT: number
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
      RFQ_ID: RFQ_ID,
      RFQ_SUBJECT: RFQ_SUBJECT,
      RFQ_TITLE: RFQ_TITLE,
      RFQ_TYPE: RFQ_TYPE,
      NEED_BY_DATE: NEED_BY_DATE,
      OPEN_DATE: OPEN_DATE,
      CLOSE_DATE: CLOSE_DATE,
      NOTE_TO_SUPPLIER: NOTE_TO_SUPPLIER,
      SUPLLIER_CURRENCY_CODE: SUPLLIER_CURRENCY_CODE,
      SUPLLIER_FREIGHT_CHARGE: SUPLLIER_FREIGHT_CHARGE,
      RFQ_ATTACHMENT_FILE_ORG_NAME: RFQ_ATTACHMENT_FILE_ORG_NAME,
      RFQ_ATTACHMENT_FILE_NAME: RFQ_ATTACHMENT_FILE_NAME,
      BILL_TO_LOCATION_ID: BILL_TO_LOCATION_ID,
      SHIP_TO_LOCATION_ID: SHIP_TO_LOCATION_ID,
      ETR: ETR,
      BUYER_ATTACHMENT_FILE_ORG_NAME: BUYER_ATTACHMENT_FILE_ORG_NAME,
      BUYER_ATTACHMENT_FILE_NAME: BUYER_ATTACHMENT_FILE_NAME,
      CURRENCY_CODE: CURRENCY_CODE,
      VAT_APPLICABLE_STATUS: VAT_APPLICABLE_STATUS,
      VAT_RATE: VAT_RATE,
      INVOICE_TYPE: INVOICE_TYPE,
      FREIGHT_TERM: FREIGHT_TERM,
      PAYMENT_TERM_ID: PAYMENT_TERM_ID,
      BUYER_GENERAL_TERMS: BUYER_GENERAL_TERMS,
      PREPARER_ID: PREPARER_ID,
      PREPARER_STATUS: PREPARER_STATUS,
      CREATED_BY: CREATED_BY,
      OFFSET: OFFSET,
      LIMIT: LIMIT,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default RfqListService;
