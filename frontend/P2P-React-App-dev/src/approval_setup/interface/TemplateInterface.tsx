interface TemplateInterface {
    AS_ID: number;
    APPROVAL_STAGE_NAME: string;
    MODULE_TYPE_ID: number;
    OU_ID: number | null;
    LE_ID: number | null;
    CREATED_BY: number;
    CREATION_DATE: string;
    LAST_UPDATE_BY: number | null;
    LAST_UPDATE_DATE: string;
    CAN_DELETE: number;
    APPROVAL_FLOW_TYPE: string;
    BUYER_DEPARTMENT: string;
    CURRENCY_CODE: string;
    CURRENCY_NAME: string;
    MAX_AMOUNT: string;
    MIN_AMOUNT: string;
    ORG_ID: string;
    ORG_NAME: string;
  }

  export default TemplateInterface