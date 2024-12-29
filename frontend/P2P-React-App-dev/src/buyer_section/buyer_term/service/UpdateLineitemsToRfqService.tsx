import PrItemInterface from "../../pr_item_list/interface/PrItemInterface";
import SelectedPrItemInterface from "../../pr_item_list/interface/selectedPritemInterface";

const UpdateLineItemToRfqService = async (
  token: string,
  rfqId: number,
  selectedPrItem: PrItemInterface
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}rfq/rfq-line-item-update`;

  const formData = new FormData();
  formData.append("RFQ_ID", rfqId.toString());
  //   formData.append(
  //     "REQUISITION_HEADER_ID",
  //     selectedPrItem.REQUISITION_HEADER_ID.toString()
  //   );
  console.log(selectedPrItem);

  formData.append(
    "REQUISITION_LINE_ID",
    selectedPrItem!.REQUISITION_LINE_ID!.toString()
  );
  if (selectedPrItem.BUYER_FILE) {
    formData.append("BUYER_FILE", selectedPrItem.BUYER_FILE);
  }

  //   formData.append("NEED_BY_DATE", selectedPrItem.NEED_BY_DATE);
  formData.append("ATTRIBUTE_CATEGORY", selectedPrItem!.ATTRIBUTE_CATEGORY!);
  formData.append("AUTHORIZATION_STATUS", selectedPrItem.AUTHORIZATION_STATUS);
  formData.append("BUYER_VAT_APPLICABLE", selectedPrItem.BUYER_VAT_APPLICABLE);
  formData.append("BUYER_FILE_ORG_NAME", selectedPrItem!.BUYER_FILE_ORG_NAME!);
  formData.append(
    "BUYER_FILE_ORG_NAME",
    selectedPrItem.DELIVER_TO_LOCATION_ID.toString()
  );
  formData.append("BUYER_FILE_ORG_NAME", selectedPrItem.ITEM_DESCRIPTION);
  formData.append(
    "DESTINATION_ORGANIZATION_ID",
    selectedPrItem.DESTINATION_ORGANIZATION_ID.toString()
  );
  formData.append("ITEM_CODE", selectedPrItem.ITEM_CODE);
  formData.append("ITEM_ID", selectedPrItem.ITEM_ID.toString());
  formData.append("ITEM_SPECIFICATION", selectedPrItem.ITEM_SPECIFICATION);
  formData.append("LCM_ENABLE_FLAG", selectedPrItem.LCM_ENABLE_FLAG);
  //   formData.append("LINE_NUM", selectedPrItem.LINE_NUM.toString());
  formData.append("NOTE_TO_SUPPLIER", selectedPrItem.NOTE_TO_SUPPLIER);
  //   formData.append("ORG_ID", selectedPrItem.ORG_ID.toString());
  formData.append("PACKING_TYPE", selectedPrItem.PACKING_TYPE);
  formData.append("PROJECT_NAME", selectedPrItem.PROJECT_NAME);
  formData.append("PR_FROM_DFF", selectedPrItem.PR_FROM_DFF);
  //   formData.append("PR_NUMBER", selectedPrItem.PR_NUMBER);
  formData.append(
    "EXPECTED_QUANTITY",
    selectedPrItem.EXPECTED_QUANTITY.toString()
  );
  formData.append(
    "UNIT_MEAS_LOOKUP_CODE",
    selectedPrItem.UNIT_MEAS_LOOKUP_CODE
  );
  formData.append("UNIT_PRICE", selectedPrItem.UNIT_PRICE.toString());
  formData.append(
    "WARRANTY_ASK_BY_BUYER",
    selectedPrItem.WARRANTY_ASK_BY_BUYER
  );
  formData.append("WARRANTY_DETAILS", selectedPrItem.WARRANTY_DETAILS);
  formData.append("LINE_TYPE", selectedPrItem.LINE_TYPE);
  formData.append("LINE_TYPE_ID", selectedPrItem.LINE_TYPE_ID.toString());
  formData.append("LINE_STATUS", selectedPrItem.LINE_STATUS);

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
export default UpdateLineItemToRfqService;

// const UpdateLineItemToRfqService = async (
//   token: string,
//   rfqId: number,
//   selectedPrItem: PrItemInterface
// ) => {
//   const BASE_URL = process.env.REACT_APP_B;
//   const url = `${BASE_URL}rfq/rfq-line-item-update`;

//   const formData = new FormData();
//   formData.append("RFQ_ID", rfqId.toString());

//   // Adding all required fields
//   formData.append(
//     "REQUISITION_LINE_ID",
//     selectedPrItem!.REQUISITION_LINE_ID!.toString()
//   );
//   if (selectedPrItem.BUYER_FILE) {
//     formData.append("BUYER_FILE", selectedPrItem.BUYER_FILE);
//   }
//   formData.append("ATTRIBUTE_CATEGORY", selectedPrItem!.ATTRIBUTE_CATEGORY!);
//   formData.append("AUTHORIZATION_STATUS", selectedPrItem.AUTHORIZATION_STATUS);
//   formData.append("BUYER_VAT_APPLICABLE", selectedPrItem.BUYER_VAT_APPLICABLE);
//   formData.append("BUYER_FILE_ORG_NAME", selectedPrItem!.BUYER_FILE_ORG_NAME!);
//   formData.append(
//     "DELIVER_TO_LOCATION_ID",
//     selectedPrItem.DELIVER_TO_LOCATION_ID.toString()
//   );
//   formData.append("ITEM_DESCRIPTION", selectedPrItem.ITEM_DESCRIPTION);
//   formData.append(
//     "DESTINATION_ORGANIZATION_ID",
//     selectedPrItem.DESTINATION_ORGANIZATION_ID.toString()
//   );
//   formData.append("ITEM_CODE", selectedPrItem.ITEM_CODE);
//   formData.append("ITEM_ID", selectedPrItem.ITEM_ID.toString());
//   formData.append("ITEM_SPECIFICATION", selectedPrItem.ITEM_SPECIFICATION);
//   formData.append("LCM_ENABLE_FLAG", selectedPrItem.LCM_ENABLE_FLAG);
//   formData.append("NOTE_TO_SUPPLIER", selectedPrItem.NOTE_TO_SUPPLIER);
//   formData.append("PACKING_TYPE", selectedPrItem.PACKING_TYPE);
//   formData.append("PROJECT_NAME", selectedPrItem.PROJECT_NAME);
//   formData.append("PR_FROM_DFF", selectedPrItem.PR_FROM_DFF);
//   formData.append(
//     "EXPECTED_QUANTITY",
//     selectedPrItem.EXPECTED_QUANTITY.toString()
//   );
//   formData.append(
//     "UNIT_MEAS_LOOKUP_CODE",
//     selectedPrItem.UNIT_MEAS_LOOKUP_CODE
//   );
//   formData.append("UNIT_PRICE", selectedPrItem.UNIT_PRICE.toString());
//   formData.append(
//     "WARRANTY_ASK_BY_BUYER",
//     selectedPrItem.WARRANTY_ASK_BY_BUYER
//   );
//   formData.append("WARRANTY_DETAILS", selectedPrItem.WARRANTY_DETAILS);
//   formData.append("LINE_TYPE", selectedPrItem.LINE_TYPE);
//   formData.append("LINE_TYPE_ID", selectedPrItem.LINE_TYPE_ID.toString());
//   formData.append("LINE_STATUS", selectedPrItem.LINE_STATUS);

//   // Adding additional fields from the interface
//   formData.append("PROMISE_DATE", selectedPrItem.PROMISE_DATE.toISOString());
//   formData.append("CS_STATUS", selectedPrItem.CS_STATUS.toString());
//   formData.append("LAST_UPDATED_BY", selectedPrItem.LAST_UPDATED_BY.toString());
//   formData.append(
//     "LAST_UPDATE_DATE",
//     selectedPrItem.LAST_UPDATE_DATE.toISOString()
//   );
//   formData.append("USER_NAME", selectedPrItem.USER_NAME);
//   if (selectedPrItem.PREPARER_ID) {
//     formData.append("PREPARER_ID", selectedPrItem.PREPARER_ID.toString());
//   }
//   formData.append("PR_NUMBER", selectedPrItem.PR_NUMBER);
//   if (selectedPrItem.REQUISITION_HEADER_ID) {
//     formData.append(
//       "REQUISITION_HEADER_ID",
//       selectedPrItem.REQUISITION_HEADER_ID.toString()
//     );
//   }
//   if (selectedPrItem.CREATION_DATE) {
//     formData.append("CREATION_DATE", selectedPrItem.CREATION_DATE);
//   }
//   if (selectedPrItem.DESCRIPTION) {
//     formData.append("DESCRIPTION", selectedPrItem.DESCRIPTION);
//   }
//   formData.append("CREATED_BY", selectedPrItem.CREATED_BY.toString());
//   if (selectedPrItem.APPROVED_DATE) {
//     formData.append("APPROVED_DATE", selectedPrItem.APPROVED_DATE);
//   }
//   formData.append("LINE_NUM", selectedPrItem.LINE_NUM.toString());
//   formData.append("CATEGORY_ID", selectedPrItem.CATEGORY_ID.toString());
//   formData.append("NEED_BY_DATE", selectedPrItem.NEED_BY_DATE);
//   formData.append("BRAND", selectedPrItem.BRAND);
//   formData.append("ORIGIN", selectedPrItem.ORIGIN);
//   formData.append("WARRANTY_BY_SUPPLIER", selectedPrItem.WARRANTY_BY_SUPPLIER);
//   formData.append("ATTRIBUTE6", selectedPrItem.ATTRIBUTE6);
//   formData.append("ORG_ID", selectedPrItem.ORG_ID.toString());
//   formData.append("CLOSED_CODE", selectedPrItem.CLOSED_CODE);
//   formData.append("INVENTORY_ORG_NAME", selectedPrItem.INVENTORY_ORG_NAME);
//   formData.append("COUNTER", selectedPrItem.COUNTER.toString());
//   formData.append("REQUESTOR_NAME", selectedPrItem.REQUESTOR_NAME);
//   formData.append("BUYER_FILE_NAME", selectedPrItem.BUYER_FILE_NAME);
//   formData.append("RATE_TYPE", selectedPrItem.RATE_TYPE);
//   formData.append("RATE_DATE", selectedPrItem.RATE_DATE);
//   formData.append("CONVERSION_RATE", selectedPrItem.CONVERSION_RATE);
//   formData.append("MATCH_OPTION", selectedPrItem.MATCH_OPTION);
//   if (selectedPrItem.PR_LINE_NUM) {
//     formData.append("PR_LINE_NUM", selectedPrItem.PR_LINE_NUM.toString());
//   }
//   if (selectedPrItem.EXPECTED_BRAND_NAME) {
//     formData.append("EXPECTED_BRAND_NAME", selectedPrItem.EXPECTED_BRAND_NAME);
//   }
//   if (selectedPrItem.EXPECTED_ORIGIN) {
//     formData.append("EXPECTED_ORIGIN", selectedPrItem.EXPECTED_ORIGIN);
//   }
//   if (selectedPrItem.RATE_TYPE) {
//     formData.append("RATE_TYPE", selectedPrItem.RATE_TYPE);
//   }
//   if (selectedPrItem.RATE_DATE) {
//     formData.append("RATE_DATE", selectedPrItem.RATE_DATE);
//   }
//   if (selectedPrItem.CONVERSION_RATE) {
//     formData.append("CONVERSION_RATE", selectedPrItem.CONVERSION_RATE);
//   }
//   // formData.append("PR_CREATION_DATE", selectedPrItem.PR_CREATION_DATE);

//   // Sending request to the backend
//   const response = await fetch(url, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     body: formData,
//   });

//   const data = await response.json();
//   return {
//     statusCode: response.status,
//     data: data,
//   };
// };

// export default UpdateLineItemToRfqService;
