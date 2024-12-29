interface SupplierContactDetailsInterface {
    message: string;
    status: number;
    success: boolean;
    data: {
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
        AGENT_DETAILS: {
            SUPPLIER_CONTACT_PERSON_ID: number;
            SUPPLIER_ID: number | null;
            AGENT_NAME: string;
            AGENT_ADDRESS: string;
            BD_PHONE_NUMBER: string;
            CONTACT_PERSON_NAME: string;
            CONTACT_PERSON_POSITION: string;
            BD_PERMISSION_NO: string | null;
            AGENT_SINCE_DATE: string;
            EMAIL: string;
            IRC: string | null;
            BIN: string | null;
            TIN_FILE_NAME: string | null;
            TIN_FILE_ORIGINAL_NAME: string | null;
            CREATED_BY: number | null;
            CREATION_DATE: string | null;
            LAST_UPDATED_BY: number;
            LAST_UPDATE_DATE: string;
            ID: number;
        };
    };
    nid_or_passport_file_path: string;
    supplier_signature_file_path: string;
    etin_file_path: string;
}

export default SupplierContactDetailsInterface;