interface ConvertedItemForCsCreation {
  RFQ_ID: string;
  RFQ_LINE_ID: string;
  QUOT_LINE_ID: string;
  RECOMMENDED: string;
  NOTE_FROM_BUYER: string;
  AWARDED: string;
  USER_ID: string;
  ORG_ID: number;
  VENDOR_ID: string;
  VENDOR_SITE_ID: string;
  NOTE_TO_APPROVER: string;
  CS_LINE_ID: number | null;
  AWARD_QUANTITY: string;
}

export default ConvertedItemForCsCreation;
