// const ProfileUpdateApproveRejectService = async (
//   token: string,
//   SUBMISSION_STATUS: string | "",
//   APPROVAL_STATUS: string | "",
//   ACTION_CODE: number | null,
//   SUPPLIER_ID: number | null,
//   STAGE_ID: number | null,
//   NOTE: string | "",
//   STAGE_LEVEL: string | null,
//   ACTION_ID: number
// ) => {
//   const BASE_URL = process.env.REACT_APP_B;
//   const url = `${BASE_URL}supplier-approval/update-profile/approve-reject`;
//   console.log(
//     SUBMISSION_STATUS,
//     APPROVAL_STATUS,
//     ACTION_CODE,
//     SUPPLIER_ID,
//     STAGE_ID,
//     NOTE,
//     STAGE_LEVEL,
//     ACTION_ID
//   );

//   const response = await fetch(url, {
//     method: "POST",

//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({
//       // "APPROVAL_TYPE": "Supplier Approval",// 'Profile Update' this name will be template name
//       SUBMISSION_STATUS: SUBMISSION_STATUS, //
//       APPROVAL_STATUS: APPROVAL_STATUS,

//       ACTION_CODE: ACTION_CODE,
//       SUPPLIER_ID: SUPPLIER_ID,
//       STAGE_ID: STAGE_ID, //Template id
//       NOTE: NOTE,
//       STAGE_LEVEL: STAGE_LEVEL,
//       ACTION_ID: ACTION_ID, // for update it is must
//     }),
//   });
//   const data = await response.json();
//   return {
//     statusCode: response.status,
//     data: data,
//   };
// };
// export default ProfileUpdateApproveRejectService;

const ProfileUpdateApproveRejectService = async (
  token: string,
  SUBMISSION_STATUS: string | "",
  APPROVAL_STATUS: string | "",
  ACTION_CODE: number | null,
  SUPPLIER_ID: number | null,
  STAGE_ID: number | null,
  NOTE: string | "",
  STAGE_LEVEL: string | null,
  ACTION_ID: number,
  profileId: number | null,
  isInitiator: string,
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}supplier-approval/pending/approve-reject`; // old api

  // const url = `${BASE_URL}supplier-approval/pending/approve-reject`;  // new api
  console.log(
    ACTION_ID,
    ACTION_CODE,
    SUPPLIER_ID,
    STAGE_ID,
    NOTE,
    STAGE_LEVEL,
    profileId,
    isInitiator
  );

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      // "APPROVAL_TYPE": "Supplier Approval",// 'Profile Update' this name will be template name

      // for new api body start

      // ACTION_ID: ACTION_ID, // for update it is must
      // ACTION_CODE: ACTION_CODE,
      // SUPPLIER_ID: SUPPLIER_ID,
      // STAGE_ID: STAGE_ID, //Template id
      // NOTE: NOTE,
      // STAGE_LEVEL: STAGE_LEVEL,
      // PROFILE_UPDATE_UID: profileId,
      // for new api body end

      // for old api body start
      SUBMISSION_STATUS: SUBMISSION_STATUS, //
      APPROVAL_STATUS: APPROVAL_STATUS,
      ACTION_CODE: ACTION_CODE,
      SUPPLIER_ID: SUPPLIER_ID,
      STAGE_ID: STAGE_ID, //Template id
      NOTE: NOTE,
      STAGE_LEVEL: STAGE_LEVEL,
      ACTION_ID: ACTION_ID, // for update it is must
      PROFILE_UPDATE_UID: profileId,
      IS_INITIATOR: isInitiator,
      // for old api body end
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default ProfileUpdateApproveRejectService;
