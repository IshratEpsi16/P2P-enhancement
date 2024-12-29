const ProfileUpdateHierarchyService = async (
  token: string,
  supplierId: number,
  functionName: string,
  profileUid: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}hierarchy/profile-update-list`;

  console.log("hierarchy Id: ", profileUid);

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      SUPPLIER_ID: supplierId,
      MODULE_NAME: functionName,
      PROFILE_UPDATE_UID: profileUid,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default ProfileUpdateHierarchyService;
