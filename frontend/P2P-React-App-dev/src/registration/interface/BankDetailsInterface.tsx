interface BankDetailsInterface {
  message: string;
  status: number;
  success: boolean;
  data: {
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
    CREATION_DATE: string;
    LAST_UPDATED_BY: number;
    LAST_UPDATE_DATE: string;
    ACTIVE_STATUS: string;
    BANK_PARTY_ID: number;
    BRANCH_PARTY_ID: number;
    CURRENCY_CODE: string;
    MULTI_CURRENCY_ALLOWED_FLAG: string;
    PAYMENT_MULTI_CURRENCY_FLAG: string;
    SWIFT_CODE: string;
  };
  supplier_check_file_path: string;
}

export default BankDetailsInterface;
