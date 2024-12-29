const AddUpdatePageFourService = async (
  token: string,
  machine_manpower_list_file: File | null,
  business_premises_file: File | null,
  profile_pic1_file: File | null,
  profile_pic2_file: File | null,
  page_no: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}supplier-registration/document/add`;

  const formData = new FormData();

  if (machine_manpower_list_file !== null) {
    formData.append("machine_manpower_list_file", machine_manpower_list_file);
  }

  if (business_premises_file !== null) {
    formData.append("business_premises_file", business_premises_file!);
  }
  if (profile_pic1_file !== null) {
    formData.append("profile_pic1_file", profile_pic1_file!);
  }
  if (profile_pic2_file !== null) {
    formData.append("profile_pic2_file", profile_pic2_file!);
  }

  formData.append("page_no", page_no.toString());

  const response = await fetch(url, {
    method: "POST",

    headers: {
      // "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default AddUpdatePageFourService;
