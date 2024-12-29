// import SupplierInterface from "../../buyer_section/invite_supplier_for_rfq/interface/SupplierInterface";
// import PrItemInterface from "../../buyer_section/pr_item_list/interface/PrItemInterface";

interface SupplierInterface {
  SUPPLIER_ID: number;
  EMAIL: string;
  ADDITIONAL_EMAIL: string;
}

interface PrItemInterface {
  REQUISITION_HEADER_ID: number;
  REQUISITION_LINE_ID: number;
  PR_NUMBER: number;
}

// Static data
const staticData = {
  RFQ_SUBJECT: "new shd 123456",
  RFQ_TITLE: "testing",
  RFQ_TYPE: "T",
  NEED_BY_DATE: "30-MAR-24 05:50:50",
  OPEN_DATE: "01-JAN-24 02:45:40",
  CLOSE_DATE: "29-FEB-24 03:33:10",
  ETR: "29-FEB-24 03:33:10",
  RFQ_ATTACHMENT_FILE: null,
  SUPLLIER_CURRENCY_CODE: "BDT",
  BILL_TO_LOCATION_ID: 101,
  SHIP_TO_LOCATION_ID: 102,
  RFQ_STATUS: "SAVE",
  VAT_RATE: 123,
  VAT_APPLICABLE_STATUS: "Y",
  LINE_ITEMS: [
    {
      REQUISITION_HEADER_ID: 373272,
      REQUISITION_LINE_ID: 482750,
      PR_NUMBER: 10911000112,
    },
    {
      REQUISITION_HEADER_ID: 373272,
      REQUISITION_LINE_ID: 482751,
      PR_NUMBER: 10911000112,
    },
    {
      REQUISITION_HEADER_ID: 373272,
      REQUISITION_LINE_ID: 482752,
      PR_NUMBER: 10911000112,
    },
  ],
  INVITED_SUPPLIERS: [
    {
      SUPPLIER_ID: 45,
      EMAIL: "shifatmad99@gmail.com",
      ADDITIONAL_EMAIL: "shifatmad99@gmail.com",
    },
    {
      SUPPLIER_ID: 14,
      EMAIL: "mahmudulhasanshifat91@gmail.com",
      ADDITIONAL_EMAIL: "mahmudulhasanshifat91@gmail.com",
    },
  ],
};

const RfqCreationService = async (
  token: string,
  // RFQ_SUBJECT: string,
  // RFQ_TITLE: string,
  // RFQ_TYPE: string,
  // NEED_BY_DATE: string,
  // OPEN_DATE: string,
  // CLOSE_DATE: string,
  RFQ_ATTACHMENT_FILE: File | null
  // LINE_ITEMS: PrItemInterface[],
  // INVITED_SUPPLIERS: SupplierInterface[]
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}rfq/creation`;

  // const formData = new FormData();

  // formData.append("RFQ_SUBJECT", staticData.RFQ_SUBJECT);
  // formData.append("RFQ_TITLE", staticData.RFQ_TITLE);
  // formData.append("RFQ_TYPE", staticData.RFQ_TYPE);
  // formData.append("NEED_BY_DATE", staticData.NEED_BY_DATE);
  // formData.append("OPEN_DATE", staticData.OPEN_DATE);
  // formData.append("CLOSE_DATE", staticData.CLOSE_DATE);
  // formData.append("ETR", staticData.ETR);
  // if (RFQ_ATTACHMENT_FILE !== null) {
  //   formData.append("RFQ_ATTACHMENT_FILE", RFQ_ATTACHMENT_FILE);
  // }

  // formData.append("SUPLLIER_CURRENCY_CODE", staticData.SUPLLIER_CURRENCY_CODE);
  // formData.append(
  //   "BILL_TO_LOCATION_ID",
  //   staticData.BILL_TO_LOCATION_ID.toString()
  // );
  // formData.append(
  //   "SHIP_TO_LOCATION_ID",
  //   staticData.SHIP_TO_LOCATION_ID.toString()
  // );
  // formData.append("RFQ_STATUS", staticData.RFQ_STATUS);
  // formData.append("VAT_RATE", staticData.VAT_RATE.toString());
  // formData.append("VAT_APPLICABLE_STATUS", staticData.VAT_APPLICABLE_STATUS);

  // formData.append("SUPLLIER_CURRENCY_CODE", staticData.SUPLLIER_CURRENCY_CODE);
  // formData.append(
  //   "BILL_TO_LOCATION_ID",
  //   staticData.BILL_TO_LOCATION_ID.toString()
  // );
  // formData.append(
  //   "SHIP_TO_LOCATION_ID",
  //   staticData.SHIP_TO_LOCATION_ID.toString()
  // );
  // formData.append(
  //   "SHIP_TO_LOCATION_ID",
  //   staticData.SHIP_TO_LOCATION_ID.toString()
  // );
  // formData.append("VAT_RATE", staticData.VAT_RATE.toString());
  // formData.append("VAT_APPLICABLE_STATUS", staticData.VAT_APPLICABLE_STATUS);

  // // for (let i = 0; i < staticData.LINE_ITEMS.length; i++) {
  // //   formData.append("LINE_ITEMS", JSON.stringify(staticData.LINE_ITEMS[i]));
  // // }
  // // for (let i = 0; i < staticData.INVITED_SUPPLIERS.length; i++) {
  // //   formData.append(
  // //     "INVITED_SUPPLIERS",
  // //     JSON.stringify(staticData.INVITED_SUPPLIERS[i])
  // //   );
  // // }

  // // const payload = { LINE_ITEMS: staticData.LINE_ITEMS };
  // const jsonString = JSON.stringify(staticData.LINE_ITEMS);
  // console.log(jsonString);
  // formData.append("LINE_ITEMS", jsonString);
  // console.log(formData.append("LINE_ITEMS", jsonString));

  // const jsonString2 = JSON.stringify(staticData.INVITED_SUPPLIERS);
  // console.log(jsonString2);
  // formData.append("INVITED_SUPPLIERS", jsonString2);
  // console.log(formData.append("INVITED_SUPPLIERS", jsonString2));
  // console.log(formData);

  const payload = {
    RFQ_SUBJECT: "new shd 123456",
    RFQ_TITLE: "testing",
    RFQ_TYPE: "T",
    NEED_BY_DATE: "30-MAR-24 05:50:50",
    OPEN_DATE: "01-JAN-24 02:45:40",
    CLOSE_DATE: "29-FEB-24 03:33:10",
    ETR: "29-FEB-24 03:33:10",
    RFQ_ATTACHMENT_FILE: RFQ_ATTACHMENT_FILE,
    SUPLLIER_CURRENCY_CODE: "BDT",
    BILL_TO_LOCATION_ID: 101,
    SHIP_TO_LOCATION_ID: 102,
    RFQ_STATUS: "SUBMIT",
    VAT_RATE: 123,
    VAT_APPLICABLE_STATUS: "Y",
    LINE_ITEMS: [
      {
        REQUISITION_HEADER_ID: 373272,
        REQUISITION_LINE_ID: 482750,
        PR_NUMBER: 10911000112,
      },
      {
        REQUISITION_HEADER_ID: 373272,
        REQUISITION_LINE_ID: 482751,
        PR_NUMBER: 10911000112,
      },
      {
        REQUISITION_HEADER_ID: 373272,
        REQUISITION_LINE_ID: 482752,
        PR_NUMBER: 10911000112,
      },
    ],
    INVITED_SUPPLIERS: [
      {
        SUPPLIER_ID: 45,
        EMAIL: "shifatmad99@gmail.com",
        ADDITIONAL_EMAIL: "shifatmad99@gmail.com",
      },
      {
        SUPPLIER_ID: 14,
        EMAIL: "mahmudulhasanshifat91@gmail.com",
        ADDITIONAL_EMAIL: "mahmudulhasanshifat91@gmail.com",
      },
    ],
  };

  const formData = JSON.stringify(payload);
  console.log(formData);

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  console.log(formData);

  const data = await response.json();
  console.log(data);

  return {
    statusCode: response.status,
    data: data,
  };
};
export default RfqCreationService;
