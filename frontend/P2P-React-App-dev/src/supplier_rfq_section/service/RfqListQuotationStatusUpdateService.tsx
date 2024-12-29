const RfqListQuotationStatusUpdateService = async (
  token: string,
  rfqId: number,
  resStatus: number,
  submissionStatus: string
) => {
  console.log("substates: ", submissionStatus);
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}supplier-rfq/quotation-status-update`;

  console.log(
    "RFQ_ID",
    rfqId,
    "RESPONSE_STATUS",
    resStatus,
    "SUBMISSION_STATUS",
    submissionStatus
  );

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      RFQ_ID: rfqId,
      RESPONSE_STATUS: resStatus,
      SUBMISSION_STATUS: submissionStatus,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default RfqListQuotationStatusUpdateService;
