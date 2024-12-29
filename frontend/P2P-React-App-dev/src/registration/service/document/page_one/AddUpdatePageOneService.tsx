const AddUpdatePageOneService = async (
  token: string,
  trade_or_export_license_number: string,
  trade_or_export_license_start_date: string,
  trade_or_export_license_end_date: string,
  trade_or_export_license_file: File | null,
  etin_number: string,
  tax_rtn_ackn_slip_file: File | null,
  ebin_file: File | null,
  etin_file: File | null,
  tax_rtn_assmnt_year: string,
  ebin_number: string,
  page_no: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}supplier-registration/document/add`;

  console.log(url);

  const formData = new FormData();
  if (
    trade_or_export_license_number &&
    trade_or_export_license_number !== undefined
  ) {
    formData.append(
      "trade_or_export_license_number",
      trade_or_export_license_number
    );
  }

  if (
    trade_or_export_license_start_date &&
    trade_or_export_license_start_date !== null
  ) {
    formData.append(
      "trade_or_export_license_start_date",
      trade_or_export_license_start_date
    );
  }

  if (
    trade_or_export_license_end_date &&
    trade_or_export_license_end_date !== undefined
  ) {
    formData.append(
      "trade_or_export_license_end_date",
      trade_or_export_license_end_date
    );
  }

  if (trade_or_export_license_file !== null) {
    formData.append(
      "trade_or_export_license_file",
      trade_or_export_license_file
    );
  }

  if (etin_number && etin_number !== undefined) {
    formData.append("etin_number", etin_number);
  }

  if (tax_rtn_ackn_slip_file !== null) {
    formData.append("tax_rtn_ackn_slip_file", tax_rtn_ackn_slip_file!);
  }
  if (ebin_file !== null) {
    formData.append("ebin_file", ebin_file!);
  }
  if (etin_file !== null) {
    formData.append("etin_file", etin_file!);
  }

  console.log("v", tax_rtn_assmnt_year);
  console.log(typeof tax_rtn_assmnt_year);
  if (
    tax_rtn_assmnt_year &&
    tax_rtn_assmnt_year !== undefined &&
    tax_rtn_assmnt_year !== "" &&
    tax_rtn_assmnt_year !== "null" // Check for "null" string
  ) {
    formData.append("tax_rtn_assmnt_year", tax_rtn_assmnt_year);
  }

  if (ebin_number && ebin_number !== undefined) {
    formData.append("ebin_number", ebin_number);
  }

  if (page_no && page_no !== undefined) {
    formData.append("page_no", page_no.toString());
  }

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
export default AddUpdatePageOneService;
