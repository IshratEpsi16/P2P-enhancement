interface BankInterface {
    ID: number;
    SUPPLIER_ID: number | null;
    ACCOUNT_NAME: string;
    ACCOUNT_NUMBER: string;
    BANK_NAME: string;
    BRANCH_NAME: string;
    ROUTING_SWIFT_CODE: string;
    SITE_ID: number;
    CHEQUE_FILE_NAME: string | null;
    CHEQUE_FILE_PATH: string | null;
    CREATED_BY: number;
    CREATION_DATE: string; // You may want to use a Date type if you parse the string to a date object
    LAST_UPDATED_BY: number;
    LAST_UPDATE_DATE: string; // You may want to use a Date type if you parse the string to a date object
    ACTIVE_STATUS: string;
  }

  export default BankInterface;