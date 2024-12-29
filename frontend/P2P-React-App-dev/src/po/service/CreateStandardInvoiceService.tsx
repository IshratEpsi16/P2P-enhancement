// import ConvertedInvoiceItemInterface from "../interface/ConvertedInvoiceItemInterface";

// const CreateStandardInvoiceService = async (
//   token: string,
//   invoiceId: number | null,
//   invoiceType: string,
//   poNumber: string | null,
//   poHeaderId: string | null,
//   rfqId: number | null,
//   csId: number | null,
//   userId: number | null,
//   vendorId: string | null,
//   invoiceDate: string | null,
//   glDate: string | null,
//   totalAmount: string | null,

//   invoiceNumber: string | null,
//   //   ebsInvoiceId: number | null,
//   //
//   //   organizationId: number | null,
//   invoiceStatus: string | null,
//   approvalStatus: string | null,
//   // templateId: number | null,
//   // templateStageLevel: number | null,
//   siteId: string | null,
//   bankId: string | null,
//   currencyCode: string | null,
//   description: string | null,
//   items: ConvertedInvoiceItemInterface[],
//   invoice_mushok: File | null,
//   orgId: number | null
// ) => {
//   const BASE_URL = process.env.REACT_APP_B;
//   const url = `${BASE_URL}invoice/supplier/invoice-add-update`;

//   const formData = new FormData();

//   if (invoiceId !== null) {
//     formData.append("INV_ID", invoiceId.toString());
//   }
//   formData.append("INVOICE_TYPE", invoiceType);
//   if (poNumber !== null) {
//     formData.append("PO_NUMBER", poNumber);
//   }
//   if (poHeaderId !== null) {
//     formData.append("PO_HEADER_ID", poHeaderId);
//   }
//   if (rfqId !== null) {
//     formData.append("RFQ_ID", rfqId.toString());
//   }
//   if (csId !== null) {
//     formData.append("CS_ID", csId.toString());
//   }
//   if (userId !== null) {
//     formData.append("USER_ID", userId.toString());
//   }
//   if (vendorId !== null) {
//     formData.append("VENDOR_ID", vendorId);
//   }
//   if (invoiceDate !== null) {
//     formData.append("INVOICE_DATE", invoiceDate);
//   }
//   if (glDate !== null) {
//     formData.append("GL_DATE", glDate);
//   }
//   if (totalAmount !== null) {
//     formData.append("TOTAL_AMOUNT", totalAmount);
//   }
//   if (invoiceNumber !== null) {
//     formData.append("INVOICE_NUM", invoiceNumber);
//   }
//   if (invoiceStatus !== null) {
//     formData.append("INVOICE_STATUS", invoiceStatus);
//   }
//   if (approvalStatus !== null) {
//     formData.append("APPROVAL_STATUS", approvalStatus);
//   }
//   if (siteId !== null) {
//     formData.append("SITE_ID", siteId);
//   }
//   if (bankId !== null) {
//     formData.append("BANK_ID", bankId);
//   }
//   if (currencyCode !== null) {
//     formData.append("CURRENCY_CODE", currencyCode);
//   }
//   if (description !== null) {
//     formData.append("DESCRIPTION", description);
//   }
//   if (items !== null) {
//     formData.append("ITEMS", JSON.stringify({ items }));
//   }
//   if (invoice_mushok !== null) {
//     formData.append("invoice_mushok", invoice_mushok);
//   }
//   if (orgId !== null) {
//     formData.append("ORG_ID", orgId.toString());
//   }

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
// export default CreateStandardInvoiceService;

import ConvertedInvoiceItemInterface from "../interface/ConvertedInvoiceItemInterface";

const CreateStandardInvoiceService = async (
  token: string,
  invoiceId: number | null,
  invoiceType: string,
  poNumber: string | null,
  poHeaderId: string | null,
  rfqId: number | null,
  csId: number | null,
  userId: number | null,
  vendorId: string | null,
  invoiceDate: string | null,
  // glDate: string | null,
  totalAmount: string | null,
  invoiceNumber: string | null,
  invoiceStatus: string | null,
  approvalStatus: string | null,
  siteId: string | null,
  bankId: string | null,
  currencyCode: string | null,
  description: string | null,
  items: ConvertedInvoiceItemInterface[],
  invoice_mushok: File | null,
  orgId: number | null,
  APPLY_PREPAY_NUM: string,
  PREPAY_APPLY_AMOUNT: string,
  BUYER_DEPARTMENT: string,
  APPROVAL_FLOW_TYPE: string,
  PAYMENT_METHOD_NAME: string,
  PAYMENT_METHOD_CODE: string
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}invoice/supplier/invoice-add-update`;

  const formData = new FormData();

  if (invoiceId !== null) {
    formData.append("INV_ID", invoiceId.toString());
  }
  formData.append("INVOICE_TYPE", invoiceType);
  if (poNumber !== null) {
    formData.append("PO_NUMBER", poNumber);
  }
  if (poHeaderId !== null) {
    formData.append("PO_HEADER_ID", poHeaderId);
  }
  if (rfqId !== null) {
    formData.append("RFQ_ID", rfqId.toString());
  }
  if (csId !== null) {
    formData.append("CS_ID", csId.toString());
  }
  if (userId !== null) {
    formData.append("USER_ID", userId.toString());
  }
  if (vendorId !== null) {
    formData.append("VENDOR_ID", vendorId);
  }
  if (invoiceDate !== null) {
    formData.append("INVOICE_DATE", invoiceDate);
  }
  // if (glDate !== null) {
  //   formData.append("GL_DATE", glDate);
  // }
  if (totalAmount !== null) {
    formData.append("TOTAL_AMOUNT", totalAmount);
  }
  if (invoiceNumber !== null) {
    formData.append("INVOICE_NUM", invoiceNumber);
  }
  if (invoiceStatus !== null) {
    formData.append("INVOICE_STATUS", invoiceStatus);
  }
  if (approvalStatus !== null) {
    formData.append("APPROVAL_STATUS", approvalStatus);
  }
  if (siteId !== null) {
    formData.append("SITE_ID", siteId);
  }
  if (bankId !== null) {
    formData.append("BANK_ID", bankId);
  }
  if (currencyCode !== null) {
    formData.append("CURRENCY_CODE", currencyCode);
  }
  if (description !== null) {
    formData.append("DESCRIPTION", description);
  }

  if (items !== null && items.length > 0) {
    formData.append("ITEMS", JSON.stringify(items));
  }

  if (invoice_mushok !== null) {
    formData.append("invoice_mushok", invoice_mushok);
  }
  if (orgId !== null) {
    formData.append("ORG_ID", orgId.toString());
  }
  if (APPLY_PREPAY_NUM !== null) {
    formData.append("APPLY_PREPAY_NUM", APPLY_PREPAY_NUM.toString());
  }
  if (PREPAY_APPLY_AMOUNT !== null) {
    formData.append("PREPAY_APPLY_AMOUNT", PREPAY_APPLY_AMOUNT.toString());
  }
  if (BUYER_DEPARTMENT !== null) {
    formData.append("BUYER_DEPARTMENT", BUYER_DEPARTMENT.toString());
  }
  if (APPROVAL_FLOW_TYPE !== null) {
    formData.append("APPROVAL_FLOW_TYPE", APPROVAL_FLOW_TYPE.toString());
  }
  if (PAYMENT_METHOD_NAME !== null) {
    formData.append("PAYMENT_METHOD_NAME", PAYMENT_METHOD_NAME.toString());
  }
  if (PAYMENT_METHOD_CODE !== null) {
    formData.append("PAYMENT_METHOD_CODE", PAYMENT_METHOD_CODE.toString());
  }

  console.log(items);
  console.log(JSON.stringify(items));

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

export default CreateStandardInvoiceService;
