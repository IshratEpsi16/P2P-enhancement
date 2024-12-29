import SelectedSupplierInterface from "../interface/SelectedSupplierInterface";
import SupplierInterface from "../interface/SupplierInterface";

// interface convertedSupplierInterface {
//   SUPPLIER_ID: number;
//   MOBILE_NUMBER: string;
//   EMAIL: string;
//   ADDITIONAL_EMAIL?: string; // Optional since it's not present in every object
//   CAN_EDIT?: number;
//   SITE_ID: string;
//   CONTACT_ID: string;
//   CONTACT_EMAIL: string;
//   EMAIL_SENT_STATUS: number;
// }


const InviteSupplierForRfqService = async (
  token: string,
  rfqId: number,
  RFQ_TITLE: string,
  RFQ_TYPE: string,
  CLOSE_DATE: string,
  INVITED_SUPPLIERS: SelectedSupplierInterface[],
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}rfq/invite-suppliers-for-rfq`;

  console.log("invited supplier: ", INVITED_SUPPLIERS);

  // Convert INVITED_SUPPLIERS to include EMAIL_SENT_STATUS
  // const convertedSuppliers: convertedSupplierInterface[] = INVITED_SUPPLIERS.map((supplier) => ({
  //   ...supplier,
  //   EMAIL_SENT_STATUS: supplier.EMAIL_SENT_STATUS,
  // }));

  // console.log("convert supplier: ", convertedSuppliers);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      RFQ_ID: rfqId,
      RFQ_TITLE: RFQ_TITLE,
      RFQ_TYPE: RFQ_TYPE,
      CLOSE_DATE: CLOSE_DATE,
      INVITED_SUPPLIERS: INVITED_SUPPLIERS, // Pass the actual array here
    }),
  });

  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};

export default InviteSupplierForRfqService;
