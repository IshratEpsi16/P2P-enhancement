const AddUpdatePageThreeService = async (
  token: string,
  goods_list_file: File | null,
  company_bank_solvency_cirtificate_file: File | null,
  excellency_specialied_cirtificate_file: File | null,
  recommendation_cirtificate_file: File | null,
  company_profile_file: File | null,
  qa_cirtificate_file: File | null,
  annual_turnover_file: File | null,
  page_no: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}supplier-registration/document/add`;

  const formData = new FormData();

  if (goods_list_file !== null) {
    formData.append("goods_list_file", goods_list_file);
  }

  if (company_bank_solvency_cirtificate_file !== null) {
    formData.append(
      "company_bank_solvency_cirtificate_file",
      company_bank_solvency_cirtificate_file!
    );
  }
  if (excellency_specialied_cirtificate_file !== null) {
    formData.append(
      "excellency_specialied_cirtificate_file",
      excellency_specialied_cirtificate_file!
    );
  }
  if (recommendation_cirtificate_file !== null) {
    formData.append(
      "recommendation_cirtificate_file",
      recommendation_cirtificate_file!
    );
  }
  if (company_profile_file !== null) {
    formData.append("company_profile_file", company_profile_file!);
  }
  if (qa_cirtificate_file !== null) {
    formData.append("qa_cirtificate_file", qa_cirtificate_file!);
  }
  if (annual_turnover_file !== null) {
    formData.append("annual_turnover_file", annual_turnover_file!);
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
export default AddUpdatePageThreeService;
