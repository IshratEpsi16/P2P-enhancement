import PrItemInterface from "../../pr_item_list/interface/PrItemInterface";
import SelectedPrItemInterface from "../../pr_item_list/interface/selectedPritemInterface";

const RfqHeaderUpdateService = async (
  token: string,
  RFQ_ID: number,
  RFQ_SUBJECT: string,
  RFQ_TITLE: string,
  RFQ_TYPE: string,
  NEED_BY_DATE: string,
  OPEN_DATE: string,
  CLOSE_DATE: string,
  ETR: string,
  RFQ_ATTACHMENT_FILE: File | null,
  // headeMime: string,
  // headerFilename: string,
  CURRENCY_CODE: string,
  BILL_TO_LOCATION_ID: number,
  SHIP_TO_LOCATION_ID: number,
  RFQ_STATUS: string,
  VAT_RATE: number,
  VAT_APPLICABLE_STATUS: string,
  BUYER_ATTACHMENT_FILE_NAME: File | null,
  BUYER_GENERAL_TERMS: string,

  //new add korsi
  FREIGHT_TERM: string,
  PAYMENT_TERM_ID: number,
  // INVOICE_LOOKUP_TYPE: string,
  INVOICE_TYPE: string,
  NOTE_TO_SUPPLIER: string,
  ORG_ID: string,
  matchOption: string,
  rateType: string,
  rateDate: string,
  conversionRate: string,
  buyerDepartment: string,
  approvalType: string
  // FOB: string
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}rfq/rfq-header-update`;
  // const url = `http://localhost:3000/rfq/save`;

  console.log(INVOICE_TYPE);
  console.log(matchOption);
  console.log(rateType);
  console.log(rateDate);
  console.log(conversionRate);

  // Create a new FormData object
  const formData = new FormData();

  // Append top-level fields to FormData RFQ_ID
  formData.append("RFQ_ID", RFQ_ID.toString());
  formData.append("RFQ_SUBJECT", RFQ_SUBJECT);
  formData.append("RFQ_TITLE", RFQ_TITLE);
  formData.append("RFQ_TYPE", RFQ_TYPE);
  formData.append("NEED_BY_DATE", NEED_BY_DATE);
  formData.append("OPEN_DATE", OPEN_DATE);
  formData.append("CLOSE_DATE", CLOSE_DATE);
  formData.append("ETR", ETR);
  if (RFQ_ATTACHMENT_FILE) {
    formData.append("RFQ_ATTACHMENT_FILE", RFQ_ATTACHMENT_FILE);
  }
  // Assuming 'RFQ_ATTACHMENT_FILE' is a File object
  formData.append("CURRENCY_CODE", CURRENCY_CODE);
  formData.append("BILL_TO_LOCATION_ID", BILL_TO_LOCATION_ID.toString());
  formData.append("SHIP_TO_LOCATION_ID", SHIP_TO_LOCATION_ID.toString());
  formData.append("RFQ_STATUS", RFQ_STATUS);
  formData.append("VAT_RATE", VAT_RATE.toString());
  formData.append("VAT_APPLICABLE_STATUS", VAT_APPLICABLE_STATUS);
  if (BUYER_ATTACHMENT_FILE_NAME) {
    formData.append("BUYER_ATTACHMENT_FILE_NAME", BUYER_ATTACHMENT_FILE_NAME);
  }
  formData.append("BUYER_GENERAL_TERMS", BUYER_GENERAL_TERMS);
  formData.append("FREIGHT_TERM", FREIGHT_TERM);
  formData.append("PAYMENT_TERM_ID", PAYMENT_TERM_ID.toString());
  formData.append("INVOICE_TYPE", INVOICE_TYPE);
  formData.append("NOTE_TO_SUPPLIER", NOTE_TO_SUPPLIER);
  formData.append("ORG_ID", ORG_ID);
  formData.append("RATE_TYPE", rateType);
  formData.append("RATE_DATE", rateDate);
  formData.append("CONVERSION_RATE", conversionRate);
  formData.append("MATCH_OPTION", matchOption);
  formData.append("BUYER_DEPARTMENT", buyerDepartment);
  formData.append("APPROVAL_FLOW_TYPE", approvalType);

  // formData.append("FOB", FOB);

  console.log(INVOICE_TYPE);

  const response = await fetch(url, {
    method: "POST",

    headers: {
      // "Content-Type": "application/json",
      // "Content-Type": "multipart/form-data",

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
export default RfqHeaderUpdateService;
