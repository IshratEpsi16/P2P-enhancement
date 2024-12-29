import SelectedRfqItemInterface from "../inteface/SelectedRfqItemInterface";
import moment from 'moment';

const UpdateRfqQuotationService = async (
  token: string,
  rfqId: number,
  submissionStatus: string,
  selectedRfqItem: SelectedRfqItemInterface
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}supplier-rfq/add-update-quotation`;

  console.log(rfqId);
  console.log(submissionStatus);
  console.log(selectedRfqItem);
  console.log(selectedRfqItem.QUOT_LINE_ID.toString());
  console.log(selectedRfqItem.SUPPLIER_FILE);
  console.log(selectedRfqItem.RFQ_LINE_ID.toString());
  console.log(selectedRfqItem.NEED_BY_DATE);
  console.log(selectedRfqItem.REQUISITION_HEADER_ID);
  console.log(selectedRfqItem.AUTHORIZATION_STATUS);
  console.log(selectedRfqItem.WARRANTY_BY_SUPPLIER);
  console.log(selectedRfqItem.BUYER_FILE_ORG_NAME);
  console.log(selectedRfqItem.DELIVER_TO_LOCATION_ID);
  console.log(selectedRfqItem.ITEM_DESCRIPTION);
  console.log(selectedRfqItem.DESTINATION_ORGANIZATION_ID);
  console.log(selectedRfqItem.ITEM_CODE);
  console.log(selectedRfqItem.ITEM_ID);
  console.log(selectedRfqItem.ITEM_SPECIFICATION);
  console.log(selectedRfqItem.LCM_ENABLE_FLAG);
  console.log(selectedRfqItem.NOTE_TO_SUPPLIER);
  console.log(selectedRfqItem.PACKING_TYPE);
  console.log(selectedRfqItem.PROJECT_NAME);
  console.log(selectedRfqItem.PR_FROM_DFF);
  console.log(selectedRfqItem.PR_NUMBER);
  console.log(selectedRfqItem.EXPECTED_QUANTITY);
  console.log(selectedRfqItem.EXPECTED_ORIGIN);
  console.log(selectedRfqItem.UNIT_MEAS_LOOKUP_CODE);
  console.log(selectedRfqItem.UNIT_PRICE);
  console.log(selectedRfqItem.WARRANTY_ASK_BY_BUYER);
  console.log(selectedRfqItem.WARRANTY_DETAILS);
  console.log(selectedRfqItem.AVAILABLE_SPECS);
  console.log(selectedRfqItem.AVAILABLE_ORIGIN);
  console.log(selectedRfqItem.AVAILABLE_BRAND_NAME);
  console.log(selectedRfqItem.OFFERED_QUANTITY);
  console.log(moment(selectedRfqItem.PROMISE_DATE).format('YYYY-MM-DD'));
  console.log(selectedRfqItem.TOLERANCE);
  console.log(selectedRfqItem.TOTAL_LINE_AMOUNT);
  console.log(selectedRfqItem.FREIGHT_CHARGE);
  console.log(selectedRfqItem.COUNTRY_CODE);
  console.log(selectedRfqItem.COUNTRY_NAME);

  if (selectedRfqItem.TOTAL_LINE_AMOUNT && selectedRfqItem.TOTAL_LINE_AMOUNT !== "NaN") {
    console.log("TOTAL_LINE_AMOUNT", selectedRfqItem.TOTAL_LINE_AMOUNT);
  } else {
    console.log("TOTAL_LINE_AMOUNT", ""); // Send empty string if it's null or empty
  }

  console.log(selectedRfqItem.VAT_AMOUNT);
  console.log(selectedRfqItem.VAT_TYPE);

  const formData = new FormData();
  // formData.append("RFQ_ID", rfqId.toString());

  if (rfqId !== null && rfqId !== undefined) {
    formData.append("RFQ_ID", rfqId.toString());
  } else {
    // Handle the case when rfqId is null or undefined
    // For example, you could set a default value or throw an error
    // formData.append("RFQ_ID", "");
    // or
    // throw new Error("rfqId is null or undefined");
  }

  //   formData.append(
  //     "REQUISITION_HEADER_ID",
  //     selectedPrItem.REQUISITION_HEADER_ID.toString()
  //   );
  formData.append(
    "REQUISITION_LINE_ID",
    selectedRfqItem.REQUISITION_LINE_ID.toString()
  );

  formData.append("SUBMISSION_STATUS", submissionStatus);

  if (
    selectedRfqItem.QUOT_LINE_ID !== null &&
    selectedRfqItem.QUOT_LINE_ID !== undefined
  ) {
    formData.append("QUOT_LINE_ID", selectedRfqItem.QUOT_LINE_ID.toString());
  }

  if (selectedRfqItem.SUPPLIER_FILE) {
    formData.append("SUPPLIER_FILE", selectedRfqItem.SUPPLIER_FILE);
  }

  formData.append("RFQ_LINE_ID", selectedRfqItem.RFQ_LINE_ID.toString());
  formData.append("NEED_BY_DATE", selectedRfqItem.NEED_BY_DATE);
  formData.append(
    "REQUISITION_HEADER_ID",
    selectedRfqItem.REQUISITION_HEADER_ID.toString()
  );
  formData.append("AUTHORIZATION_STATUS", selectedRfqItem.AUTHORIZATION_STATUS);
  formData.append(
    "SUPPLIER_VAT_APPLICABLE",
    selectedRfqItem.SUPPLIER_VAT_APPLICABLE
  );
  formData.append("WARRANTY_BY_SUPPLIER", selectedRfqItem.WARRANTY_BY_SUPPLIER);
  formData.append("BUYER_FILE_ORG_NAME", selectedRfqItem.BUYER_FILE_ORG_NAME);
  formData.append(
    "DELIVER_TO_LOCATION_ID",
    selectedRfqItem.DELIVER_TO_LOCATION_ID.toString()
  );
  formData.append("ITEM_DESCRIPTION", selectedRfqItem.ITEM_DESCRIPTION);
  formData.append(
    "DESTINATION_ORGANIZATION_ID",
    selectedRfqItem.DESTINATION_ORGANIZATION_ID.toString()
  );
  formData.append("ITEM_CODE", selectedRfqItem.ITEM_CODE);
  formData.append("ITEM_ID", selectedRfqItem.ITEM_ID.toString());
  formData.append("ITEM_SPECIFICATION", selectedRfqItem.ITEM_SPECIFICATION);
  formData.append("LCM_ENABLE_FLAG", selectedRfqItem.LCM_ENABLE_FLAG);
  //   formData.append("LINE_NUM", selectedRfqItem.LINE_NUM.toString());
  formData.append("NOTE_TO_SUPPLIER", selectedRfqItem.NOTE_TO_SUPPLIER);
  //   formData.append("ORG_ID", selectedRfqItem.ORG_ID.toString());
  formData.append("PACKING_TYPE", selectedRfqItem.PACKING_TYPE);
  formData.append("PROJECT_NAME", selectedRfqItem.PROJECT_NAME);
  formData.append("PR_FROM_DFF", selectedRfqItem.PR_FROM_DFF);
  formData.append("PR_NUMBER", selectedRfqItem.PR_NUMBER.toString());
  formData.append(
    "EXPECTED_QUANTITY",
    selectedRfqItem.EXPECTED_QUANTITY.toString()
  );
  formData.append(
    "EXPECTED_ORIGIN",
    selectedRfqItem.EXPECTED_ORIGIN.toString()
  );
  formData.append(
    "UNIT_MEAS_LOOKUP_CODE",
    selectedRfqItem.UNIT_MEAS_LOOKUP_CODE
  );
  formData.append("UNIT_PRICE", selectedRfqItem.UNIT_PRICE.toString());
  formData.append(
    "WARRANTY_ASK_BY_BUYER",
    selectedRfqItem.WARRANTY_ASK_BY_BUYER
  );
  formData.append("WARRANTY_DETAILS", selectedRfqItem.SUPPLIER_WARRANTY_DETAILS);
  formData.append("AVAILABLE_SPECS", selectedRfqItem.AVAILABLE_SPECS);
  // formData.append("AVAILABLE_ORIGIN", selectedRfqItem.AVAILABLE_ORIGIN);
  formData.append("COUNTRY_CODE", selectedRfqItem.COUNTRY_CODE);
  formData.append("COUNTRY_NAME", selectedRfqItem.COUNTRY_NAME);
  formData.append("AVAILABLE_BRAND_NAME", selectedRfqItem.AVAILABLE_BRAND_NAME);
  formData.append("PROMISE_DATE", moment(selectedRfqItem.PROMISE_DATE).format('YYYY-MM-DD'));
  formData.append("OFFERED_QUANTITY", selectedRfqItem.OFFERED_QUANTITY);
  formData.append("TOLERANCE", selectedRfqItem.TOLERANCE);
  // formData.append("TOTAL_LINE_AMOUNT", selectedRfqItem.TOTAL_LINE_AMOUNT);
  if (selectedRfqItem.TOTAL_LINE_AMOUNT && selectedRfqItem.TOTAL_LINE_AMOUNT !== "NaN") {
    formData.append("TOTAL_LINE_AMOUNT", selectedRfqItem.TOTAL_LINE_AMOUNT);
  } else {
    formData.append("TOTAL_LINE_AMOUNT", ""); // Send empty string if it's null or empty
  }
  formData.append("FREIGHT_CHARGE", selectedRfqItem.FREIGHT_CHARGE);
  
  formData.append("VAT_AMOUNT", selectedRfqItem.VAT_AMOUNT);
  formData.append("VAT_TYPE", selectedRfqItem.VAT_TYPE);

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
export default UpdateRfqQuotationService;
