import ConvertedItemForCsCreation from "../interface/ConvertedItemForCsCreation";

const CsCreateUpdateService = async (
  token: string,

  RFQ_ID: number,
  ORG_ID: number,
  CS_STATUS: string,
  CS_TITLE: string,
  ITEMS: ConvertedItemForCsCreation[]
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}cs/create-update`;

  console.log(RFQ_ID);
  console.log(ORG_ID);
  console.log(CS_STATUS);
  console.log(CS_TITLE);

  console.log(ITEMS);

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      RFQ_ID: RFQ_ID,
      ORG_ID: ORG_ID,
      CS_STATUS: CS_STATUS,
      CS_TITLE: CS_TITLE,
      ITEMS: ITEMS,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default CsCreateUpdateService;
