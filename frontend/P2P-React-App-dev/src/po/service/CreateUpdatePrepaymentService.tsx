const CreateUpdatePrepaymentInvoiceService = async (
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
  //   ebsInvoiceId: number | null,
  orgId: string | null,
  //   organizationId: number | null,
  invoiceStatus: string | null,
  approvalStatus: string | null,
  // templateId: number | null,
  // templateStageLevel: number | null,
  siteId: string | null,
  bankId: string | null,
  currencyCode: string | null,
  description: string | null,
  lcNumber: string | null,
  blnumber: string | null,
  benificiaryNumber: string | null,
  approverFlowType: string | null,
  buyerDepartment: string | null,
  PAYMENT_METHOD_NAME: string | null,
  PAYMENT_METHOD_CODE: string | null,
  conversionRate: string,
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}invoice/supplier/invoice-add-update`;

  console.log("conv rate: ", conversionRate);

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      INV_ID: invoiceId,
      INVOICE_TYPE: invoiceType,
      PO_NUMBER: poNumber,
      PO_HEADER_ID: poHeaderId,
      RFQ_ID: rfqId,
      CS_ID: csId,
      USER_ID: userId,
      VENDOR_ID: vendorId,
      INVOICE_DATE: invoiceDate,
      // GL_DATE: glDate,
      TOTAL_AMOUNT: totalAmount,
      INVOICE_NUM: invoiceNumber,
      //   EBS_INVOICE_ID: ebsInvoiceId,
      ORG_ID: orgId,
      //   ORGANIZATION_ID: organizationId,
      INVOICE_STATUS: invoiceStatus,
      APPROVAL_STATUS: approvalStatus,
      // TEMPLATE_ID: templateId,
      // TEMPLATE_STAGE_LEVEL: templateStageLevel,
      SITE_ID: siteId,
      BANK_ID: bankId,
      CURRENCY_CODE: currencyCode,
      DESCRIPTION: description,
      LC_NUMBER: lcNumber,
      BL_NUMBER: blnumber,
      BENEFICIARY_NUMBER: benificiaryNumber,
      APPROVAL_FLOW_TYPE: approverFlowType,
      BUYER_DEPARTMENT: buyerDepartment,
      PAYMENT_METHOD_NAME: PAYMENT_METHOD_NAME,
      PAYMENT_METHOD_CODE: PAYMENT_METHOD_CODE,
      CONVERSION_RATE: conversionRate
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default CreateUpdatePrepaymentInvoiceService;
