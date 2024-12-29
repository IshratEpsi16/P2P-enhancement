import PrItemInterface from "../../pr_item_list/interface/PrItemInterface";
import SelectedPrItemInterface from "../../pr_item_list/interface/selectedPritemInterface";

const SaveLineItemToService = async (
  token: string,
  rfqId: number,
  selectedPrItem: PrItemInterface //SelectedPrItemInterface silo
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}rfq/insert-line-item`;

  const formData = new FormData();
  formData.append("RFQ_ID", rfqId.toString());
  console.log("RFQ_ID", rfqId);

  formData.append(
    "REQUISITION_HEADER_ID",
    selectedPrItem.REQUISITION_HEADER_ID!.toString()
  );
  console.log("REQUISITION_HEADER_ID", selectedPrItem.REQUISITION_HEADER_ID);
  formData.append(
    "REQUISITION_LINE_ID",
    selectedPrItem.REQUISITION_LINE_ID!.toString()
  );
  console.log("REQUISITION_LINE_ID", selectedPrItem.REQUISITION_LINE_ID);

  if (
    selectedPrItem.BUYER_FILE !== null ||
    selectedPrItem.BUYER_FILE !== undefined
  ) {
    formData.append("BUYER_FILE", selectedPrItem.BUYER_FILE!);
    console.log("BUYER_FILE", selectedPrItem.BUYER_FILE);
  }

  formData.append("NEED_BY_DATE", selectedPrItem.NEED_BY_DATE);
  console.log("NEED_BY_DATE", selectedPrItem.NEED_BY_DATE);

  formData.append("ATTRIBUTE_CATEGORY", selectedPrItem.ATTRIBUTE_CATEGORY!);
  console.log("ATTRIBUTE_CATEGORY", selectedPrItem.ATTRIBUTE_CATEGORY);

  formData.append("AUTHORIZATION_STATUS", selectedPrItem.AUTHORIZATION_STATUS);
  console.log("AUTHORIZATION_STATUS", selectedPrItem.AUTHORIZATION_STATUS);

  formData.append("BUYER_VAT_APPLICABLE", selectedPrItem.BUYER_VAT_APPLICABLE);
  console.log("BUYER_VAT_APPLICABLE", selectedPrItem.BUYER_VAT_APPLICABLE);

  if (
    selectedPrItem.BUYER_FILE_ORG_NAME !== null ||
    selectedPrItem.BUYER_FILE_ORG_NAME !== undefined
  ) {
    formData.append("BUYER_FILE_ORG_NAME", selectedPrItem.BUYER_FILE_ORG_NAME!);
    console.log("BUYER_FILE_ORG_NAME", selectedPrItem.BUYER_FILE_ORG_NAME);
  }

  formData.append(
    "DELIVER_TO_LOCATION_ID",
    selectedPrItem.DELIVER_TO_LOCATION_ID.toString()
  );
  console.log(
    "DELIVER_TO_LOCATION_ID",
    selectedPrItem.DELIVER_TO_LOCATION_ID.toString()
  );

  formData.append("ITEM_DESCRIPTION", selectedPrItem.ITEM_DESCRIPTION);
  console.log("ITEM_DESCRIPTION", selectedPrItem.ITEM_DESCRIPTION);

  formData.append(
    "DESTINATION_ORGANIZATION_ID",
    selectedPrItem.DESTINATION_ORGANIZATION_ID.toString()
  );
  console.log(
    "DESTINATION_ORGANIZATION_ID",
    selectedPrItem.DESTINATION_ORGANIZATION_ID.toString()
  );

  formData.append("ITEM_CODE", selectedPrItem.ITEM_CODE);
  console.log("ITEM_CODE", selectedPrItem.ITEM_CODE);

  formData.append("ITEM_ID", selectedPrItem.ITEM_ID.toString());
  console.log("ITEM_ID", selectedPrItem.ITEM_ID.toString());

  formData.append("ITEM_SPECIFICATION", selectedPrItem.ITEM_SPECIFICATION);
  console.log("ITEM_SPECIFICATION", selectedPrItem.ITEM_SPECIFICATION);

  formData.append("LCM_ENABLE_FLAG", selectedPrItem.LCM_ENABLE_FLAG);
  console.log("LCM_ENABLE_FLAG", selectedPrItem.LCM_ENABLE_FLAG);

  formData.append("LINE_NUM", selectedPrItem.LINE_NUM.toString());
  console.log("LINE_NUM", selectedPrItem.LINE_NUM.toString());

  formData.append("NOTE_TO_SUPPLIER", selectedPrItem.NOTE_TO_SUPPLIER);
  console.log("NOTE_TO_SUPPLIER", selectedPrItem.NOTE_TO_SUPPLIER);

  formData.append("ORG_ID", selectedPrItem.ORG_ID.toString());
  console.log("ORG_ID", selectedPrItem.ORG_ID.toString());

  formData.append("PACKING_TYPE", selectedPrItem.PACKING_TYPE);
  console.log("PACKING_TYPE", selectedPrItem.PACKING_TYPE);

  formData.append("PROJECT_NAME", selectedPrItem.PROJECT_NAME);
  console.log("PROJECT_NAME", selectedPrItem.PROJECT_NAME);

  formData.append("PR_FROM_DFF", selectedPrItem.PR_FROM_DFF);
  console.log("PR_FROM_DFF", selectedPrItem.PR_FROM_DFF);

  formData.append("PR_NUMBER", selectedPrItem.PR_NUMBER);
  console.log("PR_NUMBER", selectedPrItem.PR_NUMBER);

  formData.append(
    "EXPECTED_QUANTITY",
    selectedPrItem.EXPECTED_QUANTITY.toString()
  );
  console.log("EXPECTED_QUANTITY", selectedPrItem.EXPECTED_QUANTITY.toString());

  formData.append(
    "UNIT_MEAS_LOOKUP_CODE",
    selectedPrItem.UNIT_MEAS_LOOKUP_CODE
  );
  console.log("UNIT_MEAS_LOOKUP_CODE", selectedPrItem.UNIT_MEAS_LOOKUP_CODE);

  formData.append("LINE_TYPE", selectedPrItem.LINE_TYPE);
  formData.append("LINE_STATUS", selectedPrItem.LINE_STATUS);
  formData.append("LINE_TYPE_ID", selectedPrItem.LINE_TYPE_ID.toString());

  // formData.append("UNIT_PRICE", selectedPrItem.UNIT_PRICE.toString());
  // console.log("UNIT_PRICE", selectedPrItem.UNIT_PRICE.toString());

  formData.append(
    "WARRANTY_ASK_BY_BUYER",
    selectedPrItem.WARRANTY_ASK_BY_BUYER
  );
  console.log("WARRANTY_ASK_BY_BUYER", selectedPrItem.WARRANTY_ASK_BY_BUYER);

  formData.append("WARRANTY_DETAILS", selectedPrItem.WARRANTY_DETAILS);
  console.log("WARRANTY_DETAILS", selectedPrItem.WARRANTY_DETAILS);

  formData.append("RATE_TYPE", selectedPrItem.RATE_TYPE);
  formData.append("RATE_DATE", selectedPrItem.RATE_DATE);
  formData.append("CONVERSION_RATE", selectedPrItem.CONVERSION_RATE);
  formData.append("MATCH_OPTION", selectedPrItem.MATCH_OPTION);

  if (selectedPrItem.PR_LINE_NUM) {
    formData.append("PR_LINE_NUM", selectedPrItem.PR_LINE_NUM.toString());
  }
  if (selectedPrItem.EXPECTED_BRAND_NAME) {
    formData.append("EXPECTED_BRAND_NAME", selectedPrItem.EXPECTED_BRAND_NAME);
  }
  if (selectedPrItem.EXPECTED_ORIGIN) {
    formData.append("EXPECTED_ORIGIN", selectedPrItem.EXPECTED_ORIGIN);
  }

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
export default SaveLineItemToService;
