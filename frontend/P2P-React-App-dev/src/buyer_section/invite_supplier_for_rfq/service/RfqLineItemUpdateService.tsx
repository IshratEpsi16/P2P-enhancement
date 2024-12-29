const RfqLineItemUpdateService = async (
  token: string,
  rfqId: number,
  REQUISITION_LINE_ID: number,
  ITEM_DESCRIPTION: string,
  PR_NUMBER: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}rfq/rfq-line-item-update`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      RFQ_ID: rfqId,
      REQUISITION_LINE_ID: REQUISITION_LINE_ID,
      ITEM_DESCRIPTION: ITEM_DESCRIPTION,
      PR_NUMBER: PR_NUMBER,
    }),
  });

  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};

export default RfqLineItemUpdateService;
