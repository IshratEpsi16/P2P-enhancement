const SupplierNewValueAddAprrovalService = async (
  token: string,

  ACTION_CODE: number,
  SUPPLIER_ID: number,
  STAGE_ID: number,

  STAGE_LEVEL: number,
  ID: number,

  TABLE_NAME: string,
  NOTE: string,
  profileNewUid: number,
  actionId: number,
  initStatus: string
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}supplier-approval/new-info-approval/approve-reject`;

  console.log("actionCode: ", ACTION_CODE);
  console.log("supplierId: ", SUPPLIER_ID);
  console.log("stageId: ", STAGE_ID);
  console.log("stageLevel: ", STAGE_LEVEL);
  console.log("actionId: ", actionId);
  console.log("id: ", ID);
  console.log("tableName: ", TABLE_NAME);
  console.log("note: ", NOTE);
  console.log("profileNewUid: ", profileNewUid);
  console.log("init: ", initStatus);

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ACTION_CODE: ACTION_CODE, //1
      SUPPLIER_ID: SUPPLIER_ID,
      STAGE_ID: STAGE_ID,
      STAGE_LEVEL: STAGE_LEVEL,
      ACTION_ID: actionId,
      ID: ID,
      TABLE_NAME: TABLE_NAME,
      NOTE: NOTE,
      PROFILE_NEW_INFO_UID: profileNewUid,
      IS_INITIATOR: initStatus
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default SupplierNewValueAddAprrovalService;

// "ACTION_CODE": 1,
// "SUPPLIER_ID": 65,
// "STAGE_ID": 116,
// "STAGE_LEVEL": 3,
// "ID": 369,
// "TABLE_NAME": "XXP2P_SUPPLIER_SITE",
// "NOTE": "New approval Approved by 4"
