interface PageOneInterface {
    message: string;
    status: number;
    success: boolean;
    data: {
        TRADE_OR_EXPORT_LICENSE_NUMBER: number;
        TRADE_OR_EXPORT_LICENSE_START_DATE: string | null;
        TRADE_OR_EXPORT_LICENSE_END_DATE: string | null;
        TRADE_OR_EXPORT_LICENSE_FILE_NAME: string | null;
        TRADE_OR_EXPORT_LICENSE_ORIGINAL_FILE_NAME: string | null;
        ETIN_NUMBER: number;
        ETIN_FILE_NAME: string | null | "";
        ETIN_ORG_FILE_NAME: string | null | "";
        EBIN_NUMBER: number | null | "";
        EBIN_FILE_NAME: string | null | "";
        EBIN_ORG_FILE_NAME: string | null | "";
        TAX_RTN_ASSMNT_YEAR: string;
        TAX_RTN_ACKN_SLIP_FILE_NAME: string | null | "";
        TAX_RTN_ACKN_SLIP_ORIGINAL_FILE_NAME: string | null | "";
    };
    trade_or_export_license_file_path_name: string;
    etin_file_path_name: string;
    ebin_file_path_name: string;
    tax_rtn_ackn_slip_file_path_name: string;
}

export default PageOneInterface;