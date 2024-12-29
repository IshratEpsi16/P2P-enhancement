// const AddUpdatePageTwoService = async (
//   token: string,
//   incorporation_number: string,
//   incorporation_cirtificate_file: File | null,
//   memorandum_association_file: File | null,
//   authorized_signs_file: File | null,
//   article_association_file: File | null,
//   prominent_clients_file: File | null,
//   page_no: number
// ) => {
//   const BASE_URL = process.env.REACT_APP_B;
//   const url = `${BASE_URL}supplier-registration/document/add`;

//   console.log(incorporation_number);

//   const formData = new FormData();
//   if (incorporation_number !== "") {
//     formData.append("incorporation_number", incorporation_number);
//   }

//   if (incorporation_cirtificate_file !== null) {
//     formData.append(
//       "incorporation_cirtificate_file",
//       incorporation_cirtificate_file
//     );
//   }

//   if (memorandum_association_file !== null) {
//     formData.append(
//       "memorandum_association_file",
//       memorandum_association_file!
//     );
//   }
//   if (authorized_signs_file !== null) {
//     formData.append("authorized_signs_file", authorized_signs_file!);
//   }
//   if (article_association_file !== null) {
//     formData.append("article_association_file", article_association_file!);
//   }
//   if (prominent_clients_file !== null) {
//     formData.append("prominent_clients_file", prominent_clients_file!);
//   }

//   formData.append("page_no", page_no.toString());

//   console.log(formData);

//   const response = await fetch(url, {
//     method: "POST",

//     headers: {
//       // "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: formData,
//   });
//   const data = await response.json();
//   return {
//     statusCode: response.status,
//     data: data,
//   };
// };
// export default AddUpdatePageTwoService;

const AddUpdatePageTwoService = async (
  token: string,
  incorporation_number: string,
  incorporation_cirtificate_file: File | null,
  memorandum_association_file: File | null,
  authorized_signs_file: File | null,
  article_association_file: File | null,
  prominent_clients_file: File | null,
  page_no: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}supplier-registration/document/add`;

  console.log(incorporation_number);

  const formData = new FormData();

  // Always append incorporation_number, even if it's an empty string
  if (incorporation_number && incorporation_number !== undefined) {
    formData.append("incorporation_number", incorporation_number);
  }

  if (incorporation_cirtificate_file !== null) {
    formData.append(
      "incorporation_cirtificate_file",
      incorporation_cirtificate_file
    );
  }

  if (memorandum_association_file !== null) {
    formData.append("memorandum_association_file", memorandum_association_file);
  }
  if (authorized_signs_file !== null) {
    formData.append("authorized_signs_file", authorized_signs_file);
  }
  if (article_association_file !== null) {
    formData.append("article_association_file", article_association_file);
  }
  if (prominent_clients_file !== null) {
    formData.append("prominent_clients_file", prominent_clients_file);
  }

  formData.append("page_no", page_no.toString());

  console.log(formData);

  const response = await fetch(url, {
    method: "POST",
    headers: {
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

export default AddUpdatePageTwoService;
