const InvoiceAddUpdateService = async (
  token: string,
  invoiceId: number | null,
  invoiceType: string,
  poNumber: string | null,
  poHeaderId: number | null,
  rfqId: number | null,
  csId: number | null,
  userId: number | null,
  vendorId: number | null,
  invoiceDate: string | null,
  glDate: string | null,
  totalAmount: string | null,

  invoiceNumber: number | null,
  ebsInvoiceId: number | null,
  orgId: number | null,
  organizationId: number | null,
  invoiceStatus: string | null,
  approvalStatus: string | null,
  templateId: number | null,
  templateStageLevel: number | null,
  siteId: number | null,
  bankId: number | null,
  currencyCode: string | null
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}invoice/supplier/invoice-add-update`;

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
      GL_DATE: glDate,
      TOTAL_AMOUNT: totalAmount,
      INVOICE_NUM: invoiceNumber,
      EBS_INVOICE_ID: ebsInvoiceId,
      ORG_ID: orgId,
      ORGANIZATION_ID: organizationId,
      INVOICE_STATUS: invoiceStatus,
      APPROVAL_STATUS: approvalStatus,
      TEMPLATE_ID: templateId,
      TEMPLATE_STAGE_LEVEL: templateStageLevel,
      SITE_ID: siteId,
      BANK_ID: bankId,
      CURRENCY_CODE: currencyCode,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default InvoiceAddUpdateService;
