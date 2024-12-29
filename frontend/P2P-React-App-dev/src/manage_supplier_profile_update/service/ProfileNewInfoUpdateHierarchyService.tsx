

const ProfileNewInfoUpdateHierarchyService = async (
  token: string,
  supplierId: number,
  functionName: string,
  profileNewInfoUid: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}hierarchy/profile-new-info-list`;

  console.log("supplier Id: ", supplierId);
  console.log("function: ", functionName);
  console.log("hierarchy Id: ", profileNewInfoUid);

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      SUPPLIER_ID: supplierId,
      MODULE_NAME: functionName,
      PROFILE_NEW_INFO_UID: profileNewInfoUid,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default ProfileNewInfoUpdateHierarchyService;
