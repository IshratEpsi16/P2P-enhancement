const ApproveRejectService = async (
  token: string,
  SUBMISSION_STATUS: string,
  APPROVAL_STATUS: string,
  IS_REG_COMPLETE: number,
  ACTION_CODE: number,
  SUPPLIER_ID: number,
  STAGE_ID: number,
  NOTE: string,
  STAGE_LEVEL: number,
  initiator: string
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}supplier-approval/registration/approve-reject`;

  console.log(SUBMISSION_STATUS);
  console.log(APPROVAL_STATUS);
  console.log(IS_REG_COMPLETE);
  console.log(ACTION_CODE);
  console.log(SUPPLIER_ID);
  console.log(STAGE_ID);

  console.log(NOTE);
  console.log(STAGE_LEVEL);
  console.log(initiator);

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      // "APPROVAL_TYPE": "Supplier Approval",// 'Profile Update' this name will be template name
      SUBMISSION_STATUS: SUBMISSION_STATUS, //
      APPROVAL_STATUS: APPROVAL_STATUS,
      IS_REG_COMPLETE: IS_REG_COMPLETE, // Send 1 when final approve other time 0
      ACTION_CODE: ACTION_CODE,
      SUPPLIER_ID: SUPPLIER_ID,
      STAGE_ID: STAGE_ID, //Template id
      NOTE: NOTE,
      STAGE_LEVEL: STAGE_LEVEL,
      INITIATOR: initiator,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default ApproveRejectService;
