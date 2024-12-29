const AddUpdateDeclarationService = async (
  token: string,
  authorType: string,
  name: string,
  isAgreed: string,
  signature: File | null,
  seal: File | null
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}supplier-registration/declaration/add`;

  console.log(url);

  const formData = new FormData();
  formData.append("author_type", authorType);
  formData.append("signatory_name", name);
  formData.append("is_agreed", isAgreed);
  if (signature !== null) {
    formData.append("signature_file", signature!);
  }
  if (seal !== null) {
    formData.append("company_seal", seal!);
  }

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
export default AddUpdateDeclarationService;
