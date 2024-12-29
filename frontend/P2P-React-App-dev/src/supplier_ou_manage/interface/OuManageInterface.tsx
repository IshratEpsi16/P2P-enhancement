interface OuManageInterface {
    ID: number;
    SUPPLIER_NAME: string;
    SITE_ID: number;
    SITE_NAME: string;
    ORGANIZATION_ID: number;
    SHORT_CODE: string;
    NAME: string;
    ACTION_CODE: number;
    NOTE: string;
    CREATED_BY: number;
    CREATED_BY_NAME: string;
    CREATION_DATE: string; // You might want to use a Date type here if you parse the string into a Date object
}

export default OuManageInterface;