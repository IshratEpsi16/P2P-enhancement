interface SupplierSiteInterface {
    [key: string]: any;
    ID: number;
    SUPPLIER_ID: number | null;
    COUNTRY: string;
    ADDRESS_LINE1: string;
    ADDRESS_LINE2: string;
    CITY_STATE: string;
    ZIP_CODE: number;
    EMAIL: string;
    MOBILE_NUMBER: string;
    CREATED_BY: number;
    CREATION_DATE: string;
    LAST_UPDATED_BY: number;
    LAST_UPDATE_DATE: string;
    USER_ID: number;
    ACTIVE_STATUS:string;
    RFQ: string | null,
    PAYABLE: string | null,
    PURCHASING:string | null
}

export default SupplierSiteInterface;