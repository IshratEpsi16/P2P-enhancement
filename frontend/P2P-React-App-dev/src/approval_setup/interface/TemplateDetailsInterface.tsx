interface TemplateDetailsInterface {
    AS_ID: number;
    APPROVAL_STAGE_NAME: string;
    MODULE_TYPE_ID: number;
    OU_ID: number | null;
    LE_ID: number | null;
    CREATED_BY: number;
    CREATED_BY_FULL_NAME: string;
    CREATED_BY_USER_NAME: string;
    CREATION_DATE: string; // Consider using a Date type if appropriate
    LAST_UPDATE_BY: number | null;
    LAST_UPDATE_DATE: string; // Consider using a Date type if appropriate
    CAN_DELETE: number;
  }

  export default TemplateDetailsInterface;