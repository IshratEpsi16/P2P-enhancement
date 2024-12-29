const RfqHeaderUpdateService = async (
  token: string,
  rfqId: number,
  RFQ_SUBJECT: string,
  RFQ_TITLE: string
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}rfq/rfq-header-update`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      RFQ_ID: rfqId,
      RFQ_SUBJECT: RFQ_SUBJECT,
      RFQ_TITLE: RFQ_TITLE,
    }),
  });

  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};

export default RfqHeaderUpdateService;
