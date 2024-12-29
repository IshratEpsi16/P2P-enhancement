import PrItemInterface from "./PrItemInterface";
import SupplierInterface from "../../invite_supplier_for_rfq/interface/SupplierInterface";
import PreviouslySelectedSupplierInterface from "../../rfq_preview/interface/PreviouslySelectedSupplierInterface";

interface RfqDetailsInterface {
  message: string;
  status: number;
  total_line_item: number;
  total_suppliers: number;
  line_items: PrItemInterface[];
  supplier_list: PreviouslySelectedSupplierInterface[];
}

// interface PrItemInterface {
//   RFQ_LINE_ID: number;
//   RFQ_ID: number;
//   REQUISITION_HEADER_ID: number;
//   REQUISITION_LINE_ID: number;
//   PR_NUMBER: number;
//   LINE_NUM: number;
//   LINE_TYPE_ID: string;
//   ITEM_CODE: string;
//   ITEM_DESCRIPTION: string;
//   ITEM_SPECIFICATION: string;
//   WARRANTY_DETAILS: string;
//   PACKING_TYPE: string;
//   PROJECT_NAME: string;
//   EXPECTED_QUANTITY: number;
//   EXPECTED_BRAND_NAME: string;
//   EXPECTED_ORIGIN: string;
//   LCM_ENABLE_FLAG: string;
//   UNIT_MEAS_LOOKUP_CODE: string;
//   NEED_BY_DATE: string;
//   ORG_ID: number;
//   ATTRIBUTE_CATEGORY: string;
//   PR_FROM_DFF: string;
//   AUTHORIZATION_STATUS: string;
//   NOTE_TO_SUPPLIER: string;
//   WARRANTY_ASK_BY_BUYER: string;
//   WARRANTY_BY_SUPPLIER: string;
//   BUYER_VAT_APPLICABLE: string;
//   SUPPLIER_VAT_APPLICABLE: string;
//   UNIT_PRICE: number;
//   OFFERED_QUANTITY: string;
//   PROMISE_DATE: string;
//   DELIVER_TO_LOCATION_ID: string;
//   DESTINATION_ORGANIZATION_ID: number;
//   CS_STATUS: string;
//   CREATION_DATE: string;
//   CREATED_BY: number;
//   LAST_UPDATED_BY: string;
//   LAST_UPDATE_DATE: string;
//   BUYER_FILE_ORG_NAME: string;
//   BUYER_FILE_NAME: string;
//   SUP_FILE_ORG_NAME: string;
//   SUP_FILE_NAME: string;
//   ITEM_ID: number;
// }

// interface Supplier {
//   INVITATION_ID: number;
//   RFQ_ID: number;
//   USER_ID: number;
//   SUPPLIER_NUMBER: string;
//   ADDITIONAL_EMAIL: string;
//   RESPONSE_STATUS: number;
//   RESPONSE_DATE: string;
//   CREATION_DATE: string;
//   CREATED_BY: string;
//   LAST_UPDATED_BY: string;
//   LAST_UPDATE_DATE: string;
//   SUBMISSION_STATUS: string;
//   SUBMISSION_DATE: string;
// }

export default RfqDetailsInterface;
