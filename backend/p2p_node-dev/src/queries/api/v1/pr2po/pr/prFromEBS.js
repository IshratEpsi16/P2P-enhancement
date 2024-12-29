let prFromEBSList = async (
  BUYER_ID,
  ORG_ID,
  PR_NUMBER,
  ITEM_NAME,
  DATE_FROM,
  DATE_TO,
  REQUESTOR_NAME,
  BUYER_NAME,
  OFFSET,
  LIMIT
) => {
  let query = `
 SELECT *
  FROM xxp2p_prdetails_v 
  WHERE     1=1
   AND (:PR_NUMBER iS NULL OR (UPPER(pr_number) LIKE '%'|| UPPER(:PR_NUMBER) || '%'))   
   AND (:BUYER_ID iS NULL OR (suggested_buyer_id = :BUYER_ID)) 
   AND (:ORG_ID IS NULL OR (org_id =:ORG_ID))
       AND UPPER (item_description) LIKE '%'||NVL (upper(:ITEM_NAME), upper(item_description))||'%'
       AND TRUNC (pr_creation_date) BETWEEN TRUNC (
                                                NVL (
                                                    TO_DATE ( :DATE_FROM,
                                                             'YYYY-MM-DD'),
                                                    pr_creation_date))
                                        AND TRUNC (
                                                NVL (
                                                    TO_DATE ( :DATE_TO,
                                                             'YYYY-MM-DD'),
                                                    pr_creation_date))
       AND (:REQUESTOR_NAME iS NULL OR (UPPER(requestor_name) LIKE '%'|| UPPER(:REQUESTOR_NAME) || '%'))                                          
       AND (:BUYER_NAME iS NULL OR (UPPER(Buyer_name) LIKE '%'|| UPPER(:BUYER_NAME) || '%'))  
       ORDER BY LINE_NUM
       OFFSET :OFFSET ROWS 
       FETCH NEXT :LIMIT ROWS ONLY
      
    `;
  return query;
};

let prFromEBSTotal = async (
  BUYER_ID,
  ORG_ID,
  PR_NUMBER,
  ITEM_NAME,
  DATE_FROM,
  DATE_TO,
  REQUESTOR_NAME,
  BUYER_NAME
) => {
  let query = `
  SELECT COUNT(PR_NUMBER) as TOTAL
   FROM xxp2p_prdetails_v 
  WHERE     1=1
   AND (:PR_NUMBER iS NULL OR (UPPER(pr_number) LIKE '%'|| UPPER(:PR_NUMBER) || '%'))   
   AND (:BUYER_ID iS NULL OR (suggested_buyer_id = :BUYER_ID)) 
   AND (:ORG_ID IS NULL OR (org_id =:ORG_ID))
       AND UPPER (item_description) LIKE '%'||NVL (upper(:ITEM_NAME), upper(item_description))||'%'
       AND TRUNC (pr_creation_date) BETWEEN TRUNC (
                                                NVL (
                                                    TO_DATE ( :DATE_FROM,
                                                             'YYYY-MM-DD'),
                                                    pr_creation_date))
                                        AND TRUNC (
                                                NVL (
                                                    TO_DATE ( :DATE_TO,
                                                             'YYYY-MM-DD'),
                                                    pr_creation_date))
       AND (:REQUESTOR_NAME iS NULL OR (UPPER(requestor_name) LIKE '%'|| UPPER(:REQUESTOR_NAME) || '%'))                                          
       AND (:BUYER_NAME iS NULL OR (UPPER(Buyer_name) LIKE '%'|| UPPER(:BUYER_NAME) || '%'))  
    `;
  return query;
};

let locationNameById = async (DELIVER_TO_LOCATION_ID) => {
  let query = `select LOCATION_ID,LOCATION_CODE
  from hr_locations_v
  where  LOCATION_ID = :DELIVER_TO_LOCATION_ID`;
  return query;
};

module.exports = {
  prFromEBSList,
  prFromEBSTotal,
  locationNameById,
};

/*
SELECT 
  DISTINCT
  PRH.PREPARER_ID,
    FU.USER_NAME,
     PAPF.FULL_NAME AS FULL_NAME,
       PRH.SEGMENT1                   PR_NUMBER,
       PRL.REQUISITION_HEADER_ID,
       PRL.REQUISITION_LINE_ID,
       PRH.CREATION_DATE,
       PRH.DESCRIPTION AS ITEM_DESCRIPTION,
       PRH.CREATED_BY,
       PRH.AUTHORIZATION_STATUS,
       PRH.APPROVED_DATE,
       PRH.ATTRIBUTE1                 AS PR_FROM_DFF,
       PRL.LINE_NUM,
       CATEGORY_ID,
       PRL.ITEM_ID,
       ITEM.DESCRIPTION,
       ITEM.CONCATENATED_SEGMENTS     AS ITEM_CODE,
       PRL.UNIT_MEAS_LOOKUP_CODE,
       PRL.UNIT_PRICE,
       PRL.QUANTITY AS EXPECTED_QUANTITY,
       PRL.NEED_BY_DATE,
       prl.note_to_agent as NOTE_TO_SUPPLIER, 
       prl.note_to_receiver,
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
       prl.REQS_IN_POOL_FLAG,
prl.ON_RFQ_FLAG,
prl.LINE_LOCATION_ID,
       (select hou.name 
         from mtl_parameters_view mp ,hr_all_organization_units hou
         where 1=1
         and mp.organization_id=PRL.ORG_ID)as INVENTORY_ORG_NAME,
       PRH.CLOSED_CODE,
       (select decode(enabled_flag,'Y','Y','','N')
       from mtl_item_categories_v
      where     1 = 1
            and inventory_item_id = prl.item_id
            and organization_id = prl.destination_organization_id
            and category_set_id = 1100000041
            and category_set_name = 'LCM_Category_Set') LCM_ENABLE_FLAG
   FROM APPS.PO_REQUISITION_HEADERS_ALL  PRH,
       APPS.PO_REQUISITION_LINES_ALL    PRL,
       APPS.MTL_SYSTEM_ITEMS_B_KFV      ITEM,
       HR.PER_ALL_PEOPLE_F PAPF,
       APPLSYS.FND_USER FU
   WHERE     1 = 1
       AND PRH.REQUISITION_HEADER_ID = PRL.REQUISITION_HEADER_ID
       AND PRL.ITEM_ID = ITEM.INVENTORY_ITEM_ID
       AND PRL.DESTINATION_ORGANIZATION_ID = ITEM.ORGANIZATION_ID
       AND PRH.AUTHORIZATION_STATUS = 'APPROVED'
       AND PRH.TYPE_LOOKUP_CODE = 'PURCHASE'
       AND PRH.CLOSED_CODE IS NULL
       AND PRH.CANCEL_FLAG IS NULL
       AND PRL.LINE_LOCATION_ID IS NULL
       AND REQS_IN_POOL_FLAG IS NULL
       AND ON_RFQ_FLAG IS NULL
       AND PAPF.PERSON_ID = PRH.PREPARER_ID
       AND FU.EMPLOYEE_ID = PRH.PREPARER_ID
       AND PRL.SUGGESTED_BUYER_ID = NVL(:BUYER_ID,PRL.SUGGESTED_BUYER_ID)
       and  PRH.ORG_ID = NVL(:ORG_ID,PRH.ORG_ID)
       AND (PRH.SEGMENT1 LIKE '%' || NVL(:PR_NUMBER, PRH.SEGMENT1) || '%')
       AND (UPPER(ITEM.DESCRIPTION) LIKE '%' || NVL(UPPER(:ITEM_NAME), ITEM.DESCRIPTION) || '%')
       AND TRUNC(PRH.CREATION_DATE) BETWEEN 
         TRUNC(NVL(TO_DATE(:DATE_FROM, 'YYYY-MM-DD'), PRH.CREATION_DATE))
         AND 
         TRUNC(NVL(TO_DATE(:DATE_TO, 'YYYY-MM-DD'), PRH.CREATION_DATE))
        AND (
       UPPER(FU.USER_NAME) LIKE '%' || NVL(TO_CHAR(:SEARCH_FIELD), UPPER(FU.USER_NAME)) || '%'
       OR UPPER(PAPF.FULL_NAME) LIKE '%' || NVL(TO_CHAR(:SEARCH_FIELD), UPPER(PAPF.FULL_NAME)) || '%'
   )
   
       ORDER BY 9,6
       OFFSET :OFFSET ROWS 
       FETCH NEXT :LIMIT ROWS ONLYSELECT 
  DISTINCT
  PRH.PREPARER_ID,
    FU.USER_NAME,
     PAPF.FULL_NAME AS FULL_NAME,
       PRH.SEGMENT1                   PR_NUMBER,
       PRL.REQUISITION_HEADER_ID,
       PRL.REQUISITION_LINE_ID,
       PRH.CREATION_DATE,
       PRH.DESCRIPTION AS ITEM_DESCRIPTION,
       PRH.CREATED_BY,
       PRH.AUTHORIZATION_STATUS,
       PRH.APPROVED_DATE,
       PRH.ATTRIBUTE1                 AS PR_FROM_DFF,
       PRL.LINE_NUM,
       CATEGORY_ID,
       PRL.ITEM_ID,
       ITEM.DESCRIPTION,
       ITEM.CONCATENATED_SEGMENTS     AS ITEM_CODE,
       PRL.UNIT_MEAS_LOOKUP_CODE,
       PRL.UNIT_PRICE,
       PRL.QUANTITY AS EXPECTED_QUANTITY,
       PRL.NEED_BY_DATE,
       prl.note_to_agent as NOTE_TO_SUPPLIER, 
       prl.note_to_receiver,
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
       prl.REQS_IN_POOL_FLAG,
prl.ON_RFQ_FLAG,
prl.LINE_LOCATION_ID,
       (select hou.name 
         from mtl_parameters_view mp ,hr_all_organization_units hou
         where 1=1
         and mp.organization_id=PRL.ORG_ID)as INVENTORY_ORG_NAME,
       PRH.CLOSED_CODE,
       (select decode(enabled_flag,'Y','Y','','N')
       from mtl_item_categories_v
      where     1 = 1
            and inventory_item_id = prl.item_id
            and organization_id = prl.destination_organization_id
            and category_set_id = 1100000041
            and category_set_name = 'LCM_Category_Set') LCM_ENABLE_FLAG
   FROM APPS.PO_REQUISITION_HEADERS_ALL  PRH,
       APPS.PO_REQUISITION_LINES_ALL    PRL,
       APPS.MTL_SYSTEM_ITEMS_B_KFV      ITEM,
       HR.PER_ALL_PEOPLE_F PAPF,
       APPLSYS.FND_USER FU
   WHERE     1 = 1
       AND PRH.REQUISITION_HEADER_ID = PRL.REQUISITION_HEADER_ID
       AND PRL.ITEM_ID = ITEM.INVENTORY_ITEM_ID
       AND PRL.DESTINATION_ORGANIZATION_ID = ITEM.ORGANIZATION_ID
       AND PRH.AUTHORIZATION_STATUS = 'APPROVED'
       AND PRH.TYPE_LOOKUP_CODE = 'PURCHASE'
       AND PRH.CLOSED_CODE IS NULL
       AND PRH.CANCEL_FLAG IS NULL
       AND PRL.LINE_LOCATION_ID IS NULL
       AND REQS_IN_POOL_FLAG IS NULL
       AND ON_RFQ_FLAG IS NULL
       AND PAPF.PERSON_ID = PRH.PREPARER_ID
       AND FU.EMPLOYEE_ID = PRH.PREPARER_ID
       AND PRL.SUGGESTED_BUYER_ID = NVL(:BUYER_ID,PRL.SUGGESTED_BUYER_ID)
       and  PRH.ORG_ID = NVL(:ORG_ID,PRH.ORG_ID)
       AND (PRH.SEGMENT1 LIKE '%' || NVL(:PR_NUMBER, PRH.SEGMENT1) || '%')
       AND (UPPER(ITEM.DESCRIPTION) LIKE '%' || NVL(UPPER(:ITEM_NAME), ITEM.DESCRIPTION) || '%')
       AND TRUNC(PRH.CREATION_DATE) BETWEEN 
         TRUNC(NVL(TO_DATE(:DATE_FROM, 'YYYY-MM-DD'), PRH.CREATION_DATE))
         AND 
         TRUNC(NVL(TO_DATE(:DATE_TO, 'YYYY-MM-DD'), PRH.CREATION_DATE))
        AND (
       UPPER(FU.USER_NAME) LIKE '%' || NVL(TO_CHAR(:SEARCH_FIELD), UPPER(FU.USER_NAME)) || '%'
       OR UPPER(PAPF.FULL_NAME) LIKE '%' || NVL(TO_CHAR(:SEARCH_FIELD), UPPER(PAPF.FULL_NAME)) || '%'
   )
   
       ORDER BY 9,6
       OFFSET :OFFSET ROWS 
       FETCH NEXT :LIMIT ROWS ONLY
*/
