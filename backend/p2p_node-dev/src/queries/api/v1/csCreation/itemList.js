const isEmpty = require("is-empty");
let rfq_header_table_name = "XXP2P_RFQ_HEADER";
let rfq_lines_table_name = "XXP2P_RFQ_LINES_ALL";
let rfq_supp_quot_table_name = "XXP2P_RFQ_SUPPLIER_QUOTATION";
let rfq_supplier_invite_table_name = "XXP2P_RFQ_SUPPLIER_INVITATION";
let dbName = process.env.DATABASE_NAME;

let itemList = async (data) => {
  let query = `
    SELECT * from  ${dbName}.${rfq_lines_table_name} WHERE RFQ_ID = :RFQ_ID
        `;
  return query;
};
let itemPoHistory = async (ITEM_ID) => {
  let query = `
  SELECT pha.segment1 AS po_number,
  pha.creation_date,
  pha.approved_date,
  msi.inventory_item_id,
  msi.concatenated_segments AS item_code,
  msi.description,
  pl.unit_meas_lookup_code,
  pl.unit_price
FROM po_headers_all pha, po_lines_all pl, mtl_system_items_b_kfv msi
WHERE 1 = 1
AND pha.po_header_id = pl.po_header_id
AND pl.item_id = msi.inventory_item_id
AND msi.inventory_item_id = NVL(${ITEM_ID}, msi.inventory_item_id)
AND pha.authorization_status = 'APPROVED'
AND pha.approved_flag = 'Y'
AND pha.cancel_flag = 'N'
ORDER BY pha.creation_date DESC
FETCH FIRST 5 ROWS ONLY
        `;
  return query;
};

let itemPRHistory = async (
  REQUISITION_HEADER_ID,
  REQUISITION_LINE_ID,
  PR_NUMBER
) => {
  let query = 
  `SELECT PRH.PREPARER_ID,
    PRH.SEGMENT1         AS PR_NUMBER,
    PRL.REQUISITION_HEADER_ID,
    PRL.REQUISITION_LINE_ID,
    PRH.CREATION_DATE,
    ITEM.DESCRIPTION AS ITEM_DESCRIPTION,
    PRH.CREATED_BY,
    PRH.AUTHORIZATION_STATUS,
    PRH.APPROVED_DATE,
    PRH.ATTRIBUTE1                 AS PR_FROM_DFF,
    PRL.LINE_NUM,
    CATEGORY_ID,
    PRL.ITEM_ID,
    ITEM.CONCATENATED_SEGMENTS     AS ITEM_CODE,
    PRL.UNIT_MEAS_LOOKUP_CODE,
    PRL.UNIT_PRICE,
    PRL.QUANTITY AS EXPECTED_QUANTITY,
    PRL.NEED_BY_DATE,
    PRL.DELIVER_TO_LOCATION_ID,
    PRL.SUGGESTED_VENDOR_PRODUCT_CODE AS STOCK_AS_PER_PR_DATE,
    SSGL_P2P_PROJECT (PRL.REQUISITION_LINE_ID)   AS PROJECT_DETAILS,
    ssgl_p2p_task(PRL.REQUISITION_LINE_ID) AS TASK_NAME,
    PRL.DESTINATION_ORGANIZATION_ID,
    PRL.ATTRIBUTE_CATEGORY,
    PRL.ATTRIBUTE1                 AS BRAND,
    PRL.ATTRIBUTE2                 AS ORIGIN,
    PRL.ATTRIBUTE3                 AS ITEM_SPECIFICATION,
    PRL.ATTRIBUTE4                 AS WARRANTY_DETAILS,
    PRL.ATTRIBUTE5                 AS PACKING_TYPE,
    PRL.ATTRIBUTE6,
    PRL.ATTRIBUTE9                 AS PROJECT_NAME,
    PRL.ORG_ID,
    (select mp.ORGANIZATION_NAME 
      from org_organization_definitions mp 
      where 1=1
      and mp.organization_id=PRL.DESTINATION_ORGANIZATION_ID)as INVENTORY_ORG_NAME,
     (select mtp.LCM_ENABLED_FLAG 
      from MTL_PARAMETERS mtp 
      where 1=1
      and mtp.organization_id=PRL.DESTINATION_ORGANIZATION_ID)as LCM_ENABLED_FLAG,  
    PRH.CLOSED_CODE,
    (select apps.xx_onhand_quantity (ITEM.INVENTORY_ITEM_ID,PRL.DESTINATION_ORGANIZATION_ID) On_hand from dual) AS ON_HAND
FROM APPS.PO_REQUISITION_HEADERS_ALL  PRH,
    APPS.PO_REQUISITION_LINES_ALL    PRL,
    APPS.MTL_SYSTEM_ITEMS_B_KFV      ITEM
WHERE     1 = 1
    AND PRH.REQUISITION_HEADER_ID = PRL.REQUISITION_HEADER_ID
    AND PRL.ITEM_ID = ITEM.INVENTORY_ITEM_ID
    AND PRL.DESTINATION_ORGANIZATION_ID = ITEM.ORGANIZATION_ID
    AND PRH.AUTHORIZATION_STATUS = 'APPROVED'
    AND PRH.TYPE_LOOKUP_CODE = 'PURCHASE'
    AND PRH.CLOSED_CODE IS NULL
    AND PRH.CANCEL_FLAG IS NULL
    AND PRH.REQUISITION_HEADER_ID = ${REQUISITION_HEADER_ID}
    AND PRL.REQUISITION_LINE_ID = ${REQUISITION_LINE_ID}
    and  PRH.SEGMENT1 = NVL(${PR_NUMBER},PRH.SEGMENT1)
`;
  /*`
  SELECT PRH.PREPARER_ID,
    PRH.SEGMENT1                   PR_NUMBER,
    PRL.REQUISITION_HEADER_ID,
    PRL.REQUISITION_LINE_ID,
    PRH.CREATION_DATE,
    ITEM.DESCRIPTION AS ITEM_DESCRIPTION,
    PRH.CREATED_BY,
    PRH.AUTHORIZATION_STATUS,
    PRH.APPROVED_DATE,
    PRH.ATTRIBUTE1                 AS PR_FROM_DFF,
    PRL.LINE_NUM,
    CATEGORY_ID,
    PRL.ITEM_ID,
    ITEM.CONCATENATED_SEGMENTS     AS ITEM_CODE,
    PRL.UNIT_MEAS_LOOKUP_CODE,
    PRL.UNIT_PRICE,
    PRL.QUANTITY AS EXPECTED_QUANTITY,
    PRL.NEED_BY_DATE,
    PRL.DELIVER_TO_LOCATION_ID,
    PRL.DESTINATION_ORGANIZATION_ID,
    PRL.ATTRIBUTE_CATEGORY,
    PRL.ATTRIBUTE1                 AS BRAND,
    PRL.ATTRIBUTE2                 AS ORIGIN,
    PRL.ATTRIBUTE3                 AS ITEM_SPECIFICATION,
    PRL.ATTRIBUTE4                 AS WARRANTY_DETAILS,
    PRL.ATTRIBUTE5                 AS PACKING_TYPE,
    PRL.ATTRIBUTE6,
    PRL.ATTRIBUTE9                 AS PROJECT_NAME,
    PRL.ORG_ID,
    (select mp.ORGANIZATION_NAME 
      from org_organization_definitions mp 
      where 1=1
      and mp.organization_id=PRL.DESTINATION_ORGANIZATION_ID)as INVENTORY_ORG_NAME,
     (select mtp.LCM_ENABLED_FLAG 
      from MTL_PARAMETERS mtp 
      where 1=1
      and mtp.organization_id=PRL.DESTINATION_ORGANIZATION_ID)as LCM_ENABLED_FLAG,  
    PRH.CLOSED_CODE,
    (select apps.xx_onhand_quantity (ITEM.INVENTORY_ITEM_ID,PRL.DESTINATION_ORGANIZATION_ID) On_hand from dual) AS ON_HAND
FROM APPS.PO_REQUISITION_HEADERS_ALL  PRH,
    APPS.PO_REQUISITION_LINES_ALL    PRL,
    APPS.MTL_SYSTEM_ITEMS_B_KFV      ITEM
WHERE     1 = 1
   AND PRH.REQUISITION_HEADER_ID = ${REQUISITION_HEADER_ID}
    AND PRL.REQUISITION_LINE_ID = ${REQUISITION_LINE_ID}
    AND PRL.ITEM_ID = ITEM.INVENTORY_ITEM_ID
    AND PRL.DESTINATION_ORGANIZATION_ID = ITEM.ORGANIZATION_ID
    AND PRH.AUTHORIZATION_STATUS = 'APPROVED'
    AND PRH.TYPE_LOOKUP_CODE = 'PURCHASE'
    AND PRH.CLOSED_CODE IS NULL
    AND PRH.CANCEL_FLAG IS NULL
    and  PRH.SEGMENT1 = NVL(${PR_NUMBER},PRH.SEGMENT1)
        `;*/
  return query;
};

let itemConsumption = async (ORG_ID, ITEM_ID) => {
  let query = `   
   select p2p_get_consumption (${ITEM_ID},${ORG_ID},365) as YEARLY, p2p_get_consumption (${ITEM_ID},${ORG_ID},180) as HALF_YEARLY,
   p2p_get_consumption (1${ITEM_ID},${ORG_ID},90) as QUARTERLY  
   from dual`;
   return query;
};

module.exports = {
  itemList,
  itemPoHistory,
  itemPRHistory,
  itemConsumption,
};
