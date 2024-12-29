export interface EmployeeInterface {
    EMPLOYEE_ID: number;
    BUYER_ID: number;
    USER_NAME: string;
    FULL_NAME: string;
    EMAIL_ADDRESS: string;
    BUSINESS_GROUP_ID:number;
    BUSINESS_GROUP_NAME:string;
    START_DATE: string; // Assuming this is a date string in ISO format
    END_DATE: string | null; // Nullable date string or null if the end date is not specified
    DEPARTMENT: string;
}