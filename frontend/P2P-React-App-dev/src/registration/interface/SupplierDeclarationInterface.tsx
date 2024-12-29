interface SupplierDeclarationInterface {
    message: string;
    status: number;
    success: boolean;
    data: {
        ID: number;
        SUPPLIER_ID: number | null;
        AUTHOR_TYPE: string;
        SIGNATURE_FILE_NAME: string | null;
        SIGNATURE_FILE_ORIGINAL_NAME: string | null;
        COMPANY_SEAL_FILE_NAME: string | null;
        COMPANY_SEAL_FILE_ORIGINAL_NAME: string | null;
        SIGNATORY_NAME: string;
        IS_AGREED: number;
        CREATED_BY: number;
        CREATION_DATE: string;
        LAST_UPDATED_BY: number;
        LAST_UPDATE_DATE: string;
        USER_ID: number;
    };
    supplier_company_seal_file_path: string;
    supplier_signature_file_path: string;
}

export default SupplierDeclarationInterface;