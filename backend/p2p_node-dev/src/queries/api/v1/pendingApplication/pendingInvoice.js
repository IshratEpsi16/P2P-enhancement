let pendingInvoiceLocal = async (
  APPROVER_ID,
  APPROVAL_STATUS,
  SEARCH_VALUE,
  OFFSET,
  LIMIT
) => {
  let query = `
    SELECT
    INV.*,
    US.USER_ID AS SUPPLIER_ID,
    US.FULL_NAME AS SUPPLIER_FULL_NAME,
    US.USER_NAME AS SUPPLIER_USER_NAME,
    BSC.ORGANIZATION_NAME,
    US.EMAIL_ADDRESS,
    RD.PROFILE_PIC1_FILE_NAME,
    RD.PROFILE_PIC2_FILE_NAME,
    ( SELECT 
      HOU.NAME
  FROM 
      HR_OPERATING_UNITS HOU
  WHERE HOU.ORGANIZATION_ID = INV.ORG_ID)AS ORG_NAME,
   ( select LOCATION_CODE
    from hr_locations_v
    where STYLE='BD_GLB' and LOCATION_ID = INV.ORGANIZATION_ID)AS SHIP_TO_LOCATION_NAME,
  (SELECT FCTL.NAME AS CURRENCY_NAME 
    FROM FND_CURRENCIES FC,FND_CURRENCIES_TL FCTL
    WHERE 1 = 1
    AND FC.CURRENCY_CODE=FCTL.CURRENCY_CODE
    AND ENABLED_FLAG = 'Y'
    AND (   END_DATE_ACTIVE IS NULL
    OR TRUNC (END_DATE_ACTIVE) > TRUNC (SYSDATE)
    )
    AND FC.CURRENCY_CODE = INV.CURRENCY_CODE)CURRENCY_NAME,
    AM.MODULE_ID,
    SA.STAGE_ID,
    SA.STAGE_LEVEL,
    SA.STAGE_SEQ,
    SA.IS_MUST_APPROVE,
    XX_P2P_PKG.GET_LEGAL_ENTITY_FROM_ORG_ID(INV.org_id) as LE_NAME,
    XX_P2P_PKG.GET_LEGAL_ENTITY_ADDRESS_FROM_ORG_ID(INV.org_id) as LE_ADDRESS,
    XX_P2P_PKG.GET_LEGAL_ENTITY_BIN_FROM_ORG_ID(INV.org_id) as LE_BIN,
    'N' AS BUYER,
    'Local Invoice Approval' AS MODULE_NAME
    FROM
    XXP2P.XXP2P_STAGE_APPROVERS SA,
    XXP2P.XXP2P_APPROVAL_STAGES XAS,
    XXP2P.XXP2P_APPROVAL_MODULE AM,
    XXP2P.XXP2P_INVOICE_HEADER INV,
    XXP2P.XXP2P_SUPPLIER_BSC_INFO BSC,
    XXP2P.XXP2P_USER US,
    XXP2P.XXP2P_SUPPLIER_REGISTRATION_DOCUMENTS RD
    WHERE SA.USER_ID = :APPROVER_ID
    AND XAS.MODULE_TYPE_ID = AM.MODULE_ID
    AND LOWER(AM.MODULE_NAME) = LOWER('Local Invoice Approval')
    AND XAS.AS_ID = SA.STAGE_ID
    AND INV.TEMPLATE_ID = SA.STAGE_ID
    AND INV.TEMPLATE_STAGE_LEVEL = SA.STAGE_LEVEL
    AND INV.APPROVAL_STATUS = NVL(:APPROVAL_STATUS,INV.APPROVAL_STATUS)
    AND INV.INVOICE_STATUS = 'SUBMIT'
    AND INV.BUYER_APPROVAL_STATUS = 'APPROVED'
     AND INV.USER_ID = BSC.USER_ID(+)
    AND INV.USER_ID = US.USER_ID
    AND INV.USER_ID = RD.USER_ID(+)
    AND (
      LOWER(us.USER_NAME) LIKE '%' || LOWER(NVL(:SEARCH_VALUE, us.USER_NAME)) || '%'
      OR LOWER(bsc.ORGANIZATION_NAME) LIKE '%' || LOWER(NVL(:SEARCH_VALUE, bsc.ORGANIZATION_NAME)) || '%'
      OR LOWER(us.EMAIL_ADDRESS) LIKE '%' || LOWER(NVL(:SEARCH_VALUE, us.EMAIL_ADDRESS)) || '%'
  )
   ORDER BY INV.CREATION_DATE DESC
   OFFSET :OFFSET ROWS 
   FETCH NEXT :LIMIT ROWS ONLY
    `;
  return query;
};

let pendingInvoiceForeign = async (
  APPROVER_ID,
  APPROVAL_STATUS,
  SEARCH_VALUE,
  OFFSET,
  LIMIT
) => {
  let query = `
    SELECT
    INV.*,
    US.USER_ID AS SUPPLIER_ID,
    US.FULL_NAME AS SUPPLIER_FULL_NAME,
    US.USER_NAME AS SUPPLIER_USER_NAME,
    BSC.ORGANIZATION_NAME,
    US.EMAIL_ADDRESS,
    RD.PROFILE_PIC1_FILE_NAME,
    RD.PROFILE_PIC2_FILE_NAME,
    ( SELECT 
      HOU.NAME
  FROM 
      HR_OPERATING_UNITS HOU
  WHERE HOU.ORGANIZATION_ID = INV.ORG_ID)AS ORG_NAME,
   ( select LOCATION_CODE
    from hr_locations_v
    where STYLE='BD_GLB' and LOCATION_ID = INV.ORGANIZATION_ID)AS SHIP_TO_LOCATION_NAME,
  (SELECT FCTL.NAME AS CURRENCY_NAME 
    FROM FND_CURRENCIES FC,FND_CURRENCIES_TL FCTL
    WHERE 1 = 1
    AND FC.CURRENCY_CODE=FCTL.CURRENCY_CODE
    AND ENABLED_FLAG = 'Y'
    AND (   END_DATE_ACTIVE IS NULL
    OR TRUNC (END_DATE_ACTIVE) > TRUNC (SYSDATE)
    )
    AND FC.CURRENCY_CODE = INV.CURRENCY_CODE)CURRENCY_NAME,
    AM.MODULE_ID,
    SA.STAGE_ID,
    SA.STAGE_LEVEL,
    SA.STAGE_SEQ,
    SA.IS_MUST_APPROVE,
    XX_P2P_PKG.GET_LEGAL_ENTITY_FROM_ORG_ID(INV.org_id) as LE_NAME,
    XX_P2P_PKG.GET_LEGAL_ENTITY_ADDRESS_FROM_ORG_ID(INV.org_id) as LE_ADDRESS,
    XX_P2P_PKG.GET_LEGAL_ENTITY_BIN_FROM_ORG_ID(INV.org_id) as LE_BIN,
    'N' AS BUYER,
    'Foreign Invoice Approval' AS MODULE_NAME
    FROM
    XXP2P.XXP2P_STAGE_APPROVERS SA,
    XXP2P.XXP2P_APPROVAL_STAGES XAS,
    XXP2P.XXP2P_APPROVAL_MODULE AM,
    XXP2P.XXP2P_INVOICE_HEADER INV,
    XXP2P.XXP2P_SUPPLIER_BSC_INFO BSC,
    XXP2P.XXP2P_USER US,
    XXP2P.XXP2P_SUPPLIER_REGISTRATION_DOCUMENTS RD
    WHERE SA.USER_ID = :APPROVER_ID
    AND XAS.MODULE_TYPE_ID = AM.MODULE_ID
    AND LOWER(AM.MODULE_NAME) = LOWER('Foreign Invoice Approval')
    AND XAS.AS_ID = SA.STAGE_ID
    AND INV.TEMPLATE_ID = SA.STAGE_ID
    AND INV.TEMPLATE_STAGE_LEVEL = SA.STAGE_LEVEL
    AND INV.APPROVAL_STATUS = NVL(:APPROVAL_STATUS,INV.APPROVAL_STATUS)
    AND INV.INVOICE_STATUS = 'SUBMIT'
    AND INV.BUYER_APPROVAL_STATUS = 'APPROVED'
     AND INV.USER_ID = BSC.USER_ID(+)
    AND INV.USER_ID = US.USER_ID
    AND INV.USER_ID = RD.USER_ID(+)
    AND (
      LOWER(us.USER_NAME) LIKE '%' || LOWER(NVL(:SEARCH_VALUE, us.USER_NAME)) || '%'
      OR LOWER(bsc.ORGANIZATION_NAME) LIKE '%' || LOWER(NVL(:SEARCH_VALUE, bsc.ORGANIZATION_NAME)) || '%'
      OR LOWER(us.EMAIL_ADDRESS) LIKE '%' || LOWER(NVL(:SEARCH_VALUE, us.EMAIL_ADDRESS)) || '%'
  )
   ORDER BY INV.CREATION_DATE DESC
   OFFSET :OFFSET ROWS 
   FETCH NEXT :LIMIT ROWS ONLY
    `;
  return query;
};

let pendingBuyerInvoice = async (
  APPROVER_ID,
  APPROVAL_STATUS,
  SEARCH_VALUE,
  OFFSET,
  LIMIT
) => {
  let query = `
    SELECT
    INV.*,
    US.USER_ID AS SUPPLIER_ID,
    US.FULL_NAME AS SUPPLIER_FULL_NAME,
    US.USER_NAME AS SUPPLIER_USER_NAME,
    BSC.ORGANIZATION_NAME,
    US.EMAIL_ADDRESS,
    RD.PROFILE_PIC1_FILE_NAME,
    RD.PROFILE_PIC2_FILE_NAME,
    ( SELECT 
      HOU.NAME
  FROM 
      HR_OPERATING_UNITS HOU
  WHERE HOU.ORGANIZATION_ID = INV.ORG_ID)AS ORG_NAME,
   ( select LOCATION_CODE
    from hr_locations_v
    where STYLE='BD_GLB' and LOCATION_ID = INV.ORGANIZATION_ID)AS SHIP_TO_LOCATION_NAME,
  (SELECT FCTL.NAME AS CURRENCY_NAME 
    FROM FND_CURRENCIES FC,FND_CURRENCIES_TL FCTL
    WHERE 1 = 1
    AND FC.CURRENCY_CODE=FCTL.CURRENCY_CODE
    AND ENABLED_FLAG = 'Y'
    AND (   END_DATE_ACTIVE IS NULL
    OR TRUNC (END_DATE_ACTIVE) > TRUNC (SYSDATE)
    )
    AND FC.CURRENCY_CODE = INV.CURRENCY_CODE)CURRENCY_NAME,
    'Y' AS BUYER,
    XX_P2P_PKG.GET_LEGAL_ENTITY_FROM_ORG_ID(INV.org_id) as LE_NAME,
    XX_P2P_PKG.GET_LEGAL_ENTITY_ADDRESS_FROM_ORG_ID(INV.org_id) as LE_ADDRESS,
    XX_P2P_PKG.GET_LEGAL_ENTITY_BIN_FROM_ORG_ID(INV.org_id) as LE_BIN
    FROM
    XXP2P.XXP2P_INVOICE_HEADER INV,
    XXP2P.XXP2P_SUPPLIER_BSC_INFO BSC,
    XXP2P.XXP2P_USER US,
    XXP2P.XXP2P_SUPPLIER_REGISTRATION_DOCUMENTS RD
    WHERE INV.BUYER_USER_ID = :APPROVER_ID
    AND INV.BUYER_APPROVAL_STATUS = NVL(:APPROVAL_STATUS,INV.BUYER_APPROVAL_STATUS)
    AND INV.INVOICE_STATUS = 'SUBMIT'
    AND INV.APPROVAL_STATUS = 'IN PROCESS'
    AND INV.USER_ID = BSC.USER_ID(+)
    AND INV.USER_ID = US.USER_ID
    AND INV.USER_ID = RD.USER_ID(+)
    AND (
      LOWER(us.USER_NAME) LIKE '%' || LOWER(NVL(:SEARCH_VALUE, us.USER_NAME)) || '%'
      OR LOWER(bsc.ORGANIZATION_NAME) LIKE '%' || LOWER(NVL(:SEARCH_VALUE, bsc.ORGANIZATION_NAME)) || '%'
      OR LOWER(us.EMAIL_ADDRESS) LIKE '%' || LOWER(NVL(:SEARCH_VALUE, us.EMAIL_ADDRESS)) || '%'
  )
   ORDER BY INV.CREATION_DATE DESC
   OFFSET :OFFSET ROWS 
   FETCH NEXT :LIMIT ROWS ONLY
    `;
  return query;
};

let pendingInvoiceLocalTotal = async (
  APPROVER_ID,
  APPROVAL_STATUS,
  SEARCH_VALUE
) => {
  let query = `
      SELECT
    count(INV.INV_ID) TOTAL
    
    FROM
    XXP2P.XXP2P_STAGE_APPROVERS SA,
    XXP2P.XXP2P_APPROVAL_STAGES XAS,
    XXP2P.XXP2P_APPROVAL_MODULE AM,
    XXP2P.XXP2P_INVOICE_HEADER INV,
    XXP2P.XXP2P_SUPPLIER_BSC_INFO BSC,
    XXP2P.XXP2P_USER US,
    XXP2P.XXP2P_SUPPLIER_REGISTRATION_DOCUMENTS RD
    WHERE SA.USER_ID = :APPROVER_ID
    AND XAS.MODULE_TYPE_ID = AM.MODULE_ID
    AND LOWER(AM.MODULE_NAME) = LOWER('Local Invoice Approval')
    AND XAS.AS_ID = SA.STAGE_ID
    AND INV.TEMPLATE_ID = SA.STAGE_ID
    AND INV.TEMPLATE_STAGE_LEVEL = SA.STAGE_LEVEL
    AND INV.APPROVAL_STATUS = NVL(:APPROVAL_STATUS,INV.APPROVAL_STATUS)
    AND INV.INVOICE_STATUS = 'SUBMIT'
    AND INV.BUYER_APPROVAL_STATUS = 'APPROVED'
    AND INV.USER_ID = BSC.USER_ID(+)
    AND INV.USER_ID = US.USER_ID
    AND INV.USER_ID = RD.USER_ID(+)
    AND (
      LOWER(us.USER_NAME) LIKE '%' || LOWER(NVL(:SEARCH_VALUE, us.USER_NAME)) || '%'
      OR LOWER(bsc.ORGANIZATION_NAME) LIKE '%' || LOWER(NVL(:SEARCH_VALUE, bsc.ORGANIZATION_NAME)) || '%'
      OR LOWER(us.EMAIL_ADDRESS) LIKE '%' || LOWER(NVL(:SEARCH_VALUE, us.EMAIL_ADDRESS)) || '%'
  )
   
      `;
  return query;
};

let pendingInvoiceForeignTotal = async (
  APPROVER_ID,
  APPROVAL_STATUS,
  SEARCH_VALUE
) => {
  let query = `
      SELECT
    count(INV.INV_ID) TOTAL
    
    FROM
    XXP2P.XXP2P_STAGE_APPROVERS SA,
    XXP2P.XXP2P_APPROVAL_STAGES XAS,
    XXP2P.XXP2P_APPROVAL_MODULE AM,
    XXP2P.XXP2P_INVOICE_HEADER INV,
    XXP2P.XXP2P_SUPPLIER_BSC_INFO BSC,
    XXP2P.XXP2P_USER US,
    XXP2P.XXP2P_SUPPLIER_REGISTRATION_DOCUMENTS RD
    WHERE SA.USER_ID = :APPROVER_ID
    AND XAS.MODULE_TYPE_ID = AM.MODULE_ID
    AND LOWER(AM.MODULE_NAME) = LOWER('Foreign Invoice Approval')
    AND XAS.AS_ID = SA.STAGE_ID
    AND INV.TEMPLATE_ID = SA.STAGE_ID
    AND INV.TEMPLATE_STAGE_LEVEL = SA.STAGE_LEVEL
    AND INV.APPROVAL_STATUS = NVL(:APPROVAL_STATUS,INV.APPROVAL_STATUS)
    AND INV.INVOICE_STATUS = 'SUBMIT'
    AND INV.BUYER_APPROVAL_STATUS = 'APPROVED'
     AND INV.USER_ID = BSC.USER_ID(+)
    AND INV.USER_ID = US.USER_ID
    AND INV.USER_ID = RD.USER_ID(+)
    AND (
      LOWER(us.USER_NAME) LIKE '%' || LOWER(NVL(:SEARCH_VALUE, us.USER_NAME)) || '%'
      OR LOWER(bsc.ORGANIZATION_NAME) LIKE '%' || LOWER(NVL(:SEARCH_VALUE, bsc.ORGANIZATION_NAME)) || '%'
      OR LOWER(us.EMAIL_ADDRESS) LIKE '%' || LOWER(NVL(:SEARCH_VALUE, us.EMAIL_ADDRESS)) || '%'
  )
   
      `;
  return query;
};

let pendingBuyerTotal = async (APPROVER_ID, APPROVAL_STATUS, SEARCH_VALUE) => {
  let query = `
      SELECT
    COUNT(INV_ID) AS TOTAL
    FROM
    XXP2P.XXP2P_INVOICE_HEADER INV,
    XXP2P.XXP2P_SUPPLIER_BSC_INFO BSC,
    XXP2P.XXP2P_USER US,
    XXP2P.XXP2P_SUPPLIER_REGISTRATION_DOCUMENTS RD
    WHERE INV.BUYER_USER_ID = :APPROVER_ID
    AND INV.BUYER_APPROVAL_STATUS = NVL(:APPROVAL_STATUS,INV.BUYER_APPROVAL_STATUS)
    AND INV.INVOICE_STATUS = 'SUBMIT'
    AND INV.APPROVAL_STATUS = 'IN PROCESS'
    AND INV.USER_ID = BSC.USER_ID(+)
    AND INV.USER_ID = US.USER_ID
    AND INV.USER_ID = RD.USER_ID(+)
    AND (
      LOWER(us.USER_NAME) LIKE '%' || LOWER(NVL(:SEARCH_VALUE, us.USER_NAME)) || '%'
      OR LOWER(bsc.ORGANIZATION_NAME) LIKE '%' || LOWER(NVL(:SEARCH_VALUE, bsc.ORGANIZATION_NAME)) || '%'
      OR LOWER(us.EMAIL_ADDRESS) LIKE '%' || LOWER(NVL(:SEARCH_VALUE, us.EMAIL_ADDRESS)) || '%'
  )
   
      `;
  return query;
};

let details = async (INV_ID) => {
  let query = `
      select * from XXP2P.XXP2P_INVOICE_DETAILS_VIEW where INV_ID = :INV_ID
      `;
  //XXP2P_INVOICE_HEADER
  return query;
};

let itemDetails = async (INV_ID) => {
  
  let query = 
  `
 WITH rfq_data AS (
    SELECT 
        ITEM_CODE,
        RFQ_ID,
        RFQ_LINE_ID,
        ITEM_DESCRIPTION,
        ITEM_SPECIFICATION,
        UNIT_MEAS_LOOKUP_CODE,
        BUYER_VAT_APPLICABLE
    FROM xxp2p.xxp2p_rfq_lines_all
),
invoice_data AS (
    SELECT 
        po_number,
        item_code,
        INV_ID,
        SUM(INVOICE_QTY) AS PRE_BILL_QTY
    FROM xxp2p.xxp2p_invoice_lines_all
    GROUP BY po_number, item_code, INV_ID
)

SELECT 
    inhd.USER_ID,
    inhd.RFQ_ID,
    csall.CS_LINE_ID,
    INVL.ID,
    INVL.INV_ID,
    INVL.SHIPMENT_ID,
    INVL.SHIPMENT_LINE_ID,
    INVL.ITEM_CODE,
    rfq.ITEM_DESCRIPTION,
    rfq.ITEM_SPECIFICATION,
    rfq.UNIT_MEAS_LOOKUP_CODE AS UOM,
    rfq.BUYER_VAT_APPLICABLE,
    INVL.PO_HEADER_ID,
    INVL.PO_NUMBER,
    csall.AWARD_QUANTITY,
    INVL.INVOICE_QTY,
    inv_data.PRE_BILL_QTY,
    INVL.DESCRIPTION,
    INVL.LINE_TYPE_CODE,
    INVL.LINE_AMOUNT,
    INVL.UNIT_PRICE,
    INVL.ORG_ID,
    INVL.EXPENSE_TYPE,
    shall.OFFERED_QUANTITY,
    shall.SHIPPING_QUANTITY,
    shall.LCM_ENABLE,
    shall.EBS_GRN_QTY,
    shall.EBS_RECEIVE_QTY,
    shall.EBS_ACCEPT_QTY,
    shall.EBS_REJECT_QTY,
    shall.EBS_DELIVERED_QTY,
    shall.PO_LINE_NUMBER,
    shall.PO_LINE_ID,
    shall.EBS_GRN_NO,
    shall.COMMENTS,
    squot.FREIGHT_CHARGE

FROM 
    xxp2p.xxp2p_invoice_lines_all INVL 
LEFT JOIN 
    xxp2p.xxp2p_invoice_header inhd ON inhd.INV_ID = INVL.INV_ID
LEFT JOIN 
    xxp2p.xxp2p_shipment_lines_all shall ON shall.SHIPMENT_LINE_ID = INVL.SHIPMENT_LINE_ID
LEFT JOIN 
    xxp2p.xxp2p_cs_lines_all csall ON csall.RFQ_ID = inhd.RFQ_ID
                                    AND csall.USER_ID = inhd.USER_ID
                                    AND shall.CS_LINE_ID = csall.CS_LINE_ID
                                    AND csall.RECOMMENDED = 'Y'
                                    AND csall.LINE_STATUS = 'Y'
LEFT JOIN 
    rfq_data rfq ON rfq.ITEM_CODE = INVL.ITEM_CODE 
                 AND rfq.RFQ_ID = inhd.RFQ_ID
                 AND rfq.RFQ_LINE_ID = csall.RFQ_LINE_ID
LEFT JOIN 
    invoice_data inv_data ON inv_data.po_number = INVL.po_number 
                          AND inv_data.item_code = INVL.ITEM_CODE
                          AND inv_data.INV_ID = INVL.INV_ID
LEFT JOIN 
    xxp2p.xxp2p_rfq_supplier_quotation squot 
    ON squot.QUOT_LINE_ID = csall.QUOT_LINE_ID                      
WHERE 
    INVL.inv_id = :INV_ID
    ORDER BY INVL.ID
  `;
  
  /*let query = `
    select 
    inhd.USER_ID,
    inhd.RFQ_ID,
    csall.CS_LINE_ID,
    INVL.ID,
    INVL.INV_ID,
    INVL.SHIPMENT_ID,
    INVL.SHIPMENT_LINE_ID,
    INVL.ITEM_CODE,
    (select distinct ITEM_DESCRIPTION from xxp2p.xxp2p_rfq_lines_all where ITEM_CODE= INVL.ITEM_CODE and rfq_id = inhd.RFQ_ID) ITEM_DESCRIPTION,
    (select distinct ITEM_SPECIFICATION from xxp2p.xxp2p_rfq_lines_all where ITEM_CODE= INVL.ITEM_CODE and rfq_id = inhd.RFQ_ID) ITEM_SPECIFICATION,
    (select distinct UNIT_MEAS_LOOKUP_CODE from xxp2p.xxp2p_rfq_lines_all where ITEM_CODE= INVL.ITEM_CODE and rfq_id = inhd.RFQ_ID) UOM,
    (select distinct BUYER_VAT_APPLICABLE from xxp2p.xxp2p_rfq_lines_all where ITEM_CODE= INVL.ITEM_CODE and rfq_id = inhd.RFQ_ID) BUYER_VAT_APPLICABLE,
    INVL.PO_HEADER_ID,
    INVL.PO_NUMBER,
    csall.AWARD_QUANTITY,
    INVL.INVOICE_QTY,
    (select sum(INVOICE_QTY) from xxp2p.xxp2p_invoice_lines_all 
    where po_number = INVL.po_number and item_code = INVL.ITEM_CODE
    and inhd.INV_ID = INVL.INV_ID
    --and inhd.STATUS = 'P'
    ) PRE_BILL_QTY,
    INVL.DESCRIPTION,
    INVL.LINE_TYPE_CODE,
    INVL.LINE_AMOUNT,
    INVL.ORG_ID,
    
    INVL.EXPENSE_TYPE,
    shall.OFFERED_QUANTITY,
    
    shall.SHIPPING_QUANTITY,
    shall.LCM_ENABLE,
    shall.EBS_GRN_QTY,
    shall.EBS_RECEIVE_QTY,
    shall.EBS_ACCEPT_QTY,
    shall.EBS_REJECT_QTY,
    shall.EBS_DELIVERED_QTY,
    shall.UNIT_PRICE,
    shall.PO_LINE_NUMBER,
    shall.PO_LINE_ID,
    shall.EBS_GRN_NO,
    shall.COMMENTS

    from xxp2p.xxp2p_invoice_lines_all INVL 
    left join xxp2p.xxp2p_invoice_header inhd
    on inhd.INV_ID = INVL.INV_ID
    left join xxp2p.xxp2p_shipment_lines_all shall
    on shall.SHIPMENT_LINE_ID = INVL.SHIPMENT_LINE_ID
    LEFT JOIN xxp2p.xxp2p_cs_lines_all csall 
    ON csall.RFQ_ID = inhd.RFQ_ID
    AND  csall.USER_ID = inhd.USER_ID
    and shall.CS_LINE_ID = csall.CS_LINE_ID
    AND csall.RECOMMENDED = 'Y'
    AND csall.LINE_STATUS = 'Y'
    where invl.inv_id = :INV_ID
      `;*/
  //XXP2P_INVOICE_HEADER
  return query;
};

let approveReject = async (
  INV_ID,
  ACTION_CODE,
  SUPPLIER_ID,
  APPROVER_ID,
  MODULE_NAME,
  STAGE_LEVEL,
  STAGE_ID,
  NOTE,
  V_IS_BUYER
) => {
  let query = `
   DECLARE
      V_MESSAGE VARCHAR2(4000);
      V_STATUS  VARCHAR2(10);
      V_FINAL_APPROVER  VARCHAR2(10);
  BEGIN
      -- Call the procedure
      XXP2P.XXP2P_INVOICE_APPROVE(
          :INV_ID,
          :ACTION_CODE,
          :SUPPLIER_ID,
          :APPROVER_ID,
          :MODULE_NAME,
          :STAGE_LEVEL,
          :STAGE_ID,
          :NOTE,
          :V_IS_BUYER,
          V_MESSAGE,
          V_STATUS,
          V_FINAL_APPROVER
      );
      -- Output the messages
            :MESSAGE :=  V_MESSAGE;
            :STATUS := V_STATUS;
            :FINAL_APPROVER  := V_FINAL_APPROVER;
  END;
      `;
  return query;
};

let invoiceSyncForPrepayment = async (
  APPROVAL_STATUS,
  INV_ID,
  INV_TYPE,
  PO_NUMBER,
  INVOICE_NUM,
  INVOICE_DATE,
  GL_DATE,
  PAYMENT_METHOD_CODE,
  TOTAL_AMOUNT,
  VENDOR_ID,
  VENDOR_SITE_ID,
  ORG_ID,
  DESCRIPTION
) => {
  let query = `
  declare
    begin
    APPS.XXP2P_AP_INVOICE_CONV_PKG.CREATE_PREPAYMENT_INVOICE
                (  
      :APPROVAL_STATUS,
      :INV_ID,
      :INV_TYPE,
      :PO_NUMBER,
      :INVOICE_NUM,
      :INVOICE_DATE,
      :GL_DATE,
      :PAYMENT_METHOD_CODE,
      :TOTAL_AMOUNT,
      :TOTAL_AMOUNT,
      :VENDOR_ID,
      :VENDOR_SITE_ID,
      :ORG_ID,
      :DESCRIPTION,
      :DESCRIPTION);
    end;
      `;
  return query;
};

let invoiceSyncForStandard = async (INV_ID, INV_TYPE, PO_NUMBER, ORG_ID) => {
  let query = `
  declare
    begin
    APPS.XXP2P_AP_INVOICE_CONV_PKG.CREATE_PO_MATCH_INVOICE
                (  
      :INV_TYPE,
      :INV_ID,
      :PO_NUMBER,
      :ORG_ID);
    end;
      `;
  return query;
};

let locationNBuyerName = async (ID) => {
  let query = `    
select  loc.LOCATION_ID, loc.LOCATION_CODE
  from hr_locations_v loc
  where loc.STYLE='BD_GLB'
  and loc.LOCATION_ID = ${ID}
      `;
  return query;
  /*
  select US.USER_ID, US.BUYER_ID,US.FULL_NAME AS BUYER_NAME,US.USER_NAME AS BUYER_USER_NAME, loc.LOCATION_ID, loc.LOCATION_CODE
  from hr_locations_v loc
  LEFT JOIN XXP2P.XXP2P_RFQ_HEADER RFQHD ON RFQHD.RFQ_ID  = ${ID}
  LEFT JOIN XXP2P.XXP2P_USER US ON US.USER_ID  = RFQHD.CREATED_BY
  where loc.STYLE='BD_GLB'
  and loc.LOCATION_ID = RFQHD.SHIP_TO_LOCATION_ID
  */
};

let initiatorStatus = async (INITIATOR_ID, INV_ID) => {
  let query = `SELECT 
    us.FULL_NAME AS APPROVER_FULL_NAME,
    us.PROPIC_FILE_NAME,
    NVL(TO_NUMBER(ah.ACTION_CODE),3)ACTION_CODE,
    NVL(TO_CHAR(ah.ACTION_DATE, 'DD-MON-YYYY HH:MI AM'), '--') AS ACTION_DATE,
    NVL(TO_CHAR(ah.NOTE),'--')NOTE
    from  xxp2p.xxp2p_user us
    left join xxp2p.xxp2p_approve_history ah ON us.user_id = ah.CREATED_BY
    and ah.object_id = :INV_ID
AND 
    ah.object_type_code = 'INV'
where us.user_id = :INITIATOR_ID
    ORDER BY 
    ah.HISTORY_ID DESC
FETCH FIRST ROW ONLY`;
  return query;
};

module.exports = {
  pendingInvoiceLocal,
  pendingInvoiceLocalTotal,
  details,
  approveReject,
  invoiceSyncForPrepayment,
  invoiceSyncForStandard,
  locationNBuyerName,
  pendingBuyerTotal,
  pendingBuyerInvoice,
  initiatorStatus,
  pendingInvoiceForeignTotal,
  pendingInvoiceForeign,
  itemDetails,
};