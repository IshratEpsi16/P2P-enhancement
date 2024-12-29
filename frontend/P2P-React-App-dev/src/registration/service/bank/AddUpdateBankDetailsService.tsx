const AddUpdateBankDetailsService = async (
  token: string,
  account_name: string,
  account_number: string,
  bank_name: string,
  branch_name: string,
  bankAccId: number | null,
  site_id: string | null,
  routing_swift_code: string,
  cheque_file: File | null,
  activeStatus: string,
  bankPartyId: string,
  branchPartId: string,
  currencyCode: string,
  multi_currency_allowed_flag: string,
  payment_multi_currency_flag: string
  // swift_code: string
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}supplier-registration/bank/add`;

  console.log(url);

  console.log("activeStatus", activeStatus);

  const formData = new FormData();
  formData.append("account_name", account_name);
  formData.append("account_number", account_number);

  formData.append("bank_name", bank_name);
  formData.append("branch_name", branch_name);
  if (site_id != null) {
    formData.append("site_id", site_id);
  }
  formData.append("routing_swift_code", routing_swift_code);
  if (bankAccId != null) {
    formData.append("id", bankAccId.toString());
  }
  if (cheque_file !== null) {
    formData.append("cheque_file", cheque_file!);
  }
  formData.append("active_status", activeStatus); //"active_status":activeStatus
  formData.append("bank_party_id", bankPartyId); //
  formData.append("branch_party_id", branchPartId); //
  formData.append("currency_code", currencyCode); //
  formData.append("multi_currency_allowed_flag", multi_currency_allowed_flag); //
  formData.append("payment_multi_currency_flag", payment_multi_currency_flag); //
  // formData.append("swift_code", swift_code); //
  // formData.append("active_status", isReg);

  const response = await fetch(url, {
    method: "POST",

    headers: {
      // "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
    // body: JSON.stringify({

    //     "author_type": authorType,
    //     "signatory_name": name,
    //     "is_agreed": isAgreed,
    //     "signature_file": signature,
    //     "company_seal": seal,

    // }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default AddUpdateBankDetailsService;
