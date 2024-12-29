import ConvertedItemForCsCreation from "../interface/ConvertedItemForCsCreation";

const UpdateCsService = async (
  token: string,
  CS_ID: number | null,
  RFQ_ID: number,
  ORG_ID: number,
  CS_STATUS: string,
  CS_TITLE: string,
  GENERAL_TERMS: string,
  NOTE: string,
  ITEMS: ConvertedItemForCsCreation[],
  CS_TOTAL_AMOUNT: string,
  BUYER_DEPARTMENT: string,
  APPROVAL_FLOW_TYPE: string,
  CONVERSION_RATE: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}cs/create-update`;
  console.log(CS_ID);
  console.log(RFQ_ID);
  console.log(ORG_ID);
  console.log(CS_STATUS);
  console.log(CS_TITLE);
  console.log(GENERAL_TERMS);
  console.log(ITEMS);
  console.log(CONVERSION_RATE);

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      CS_ID: CS_ID,
      RFQ_ID: RFQ_ID,
      ORG_ID: ORG_ID,
      CS_STATUS: CS_STATUS,

      CS_TITLE: CS_TITLE,
      GENERAL_TERMS: GENERAL_TERMS,
      NOTE: NOTE,
      ITEMS: ITEMS,
      CS_TOTAL_AMOUNT: CS_TOTAL_AMOUNT,
      BUYER_DEPARTMENT: BUYER_DEPARTMENT,
      APPROVAL_FLOW_TYPE: APPROVAL_FLOW_TYPE,
      CONVERSION_RATE: CONVERSION_RATE,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default UpdateCsService;
