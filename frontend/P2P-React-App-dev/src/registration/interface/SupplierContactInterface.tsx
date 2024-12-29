interface SupplierContactInterface {
    ID: number;
    SUPPLIER_ID: number | null;
    NAME: string;
    POSITION: string;
    MOB_NUMBER_1: string;
    EMAIL: string;
    NID_PASSPORT_NUMBER: string;
    IS_NID: number;
    NID_PASSPORT_FILE_NAME: string | null;
    SIGNATURE_ORIGINAL_FILE_NAME: string | null;
    SIGNATURE_FILE_NAME: string | null;
    NID_PASSPORT_ORIGINAL_FILE_NAME: string | null;
    IS_AGENT: number;
    CREATED_BY: number;
    CREATION_DATE: string;
    LAST_UPDATED_BY: number;
    LAST_UPDATE_DATE: string;
    MOB_NUMBER_2: string | null;
    USER_ID: number;
}

export default SupplierContactInterface;