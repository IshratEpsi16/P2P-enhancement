export interface SingleUserRoleInterface {
    message: string;
    status: number;
    data: SingleUserRoleData[];
}

export interface SingleUserRoleData {
    USER_ID: number;
    USER_NAME: string;
    FULL_NAME: string;
    USER_TYPE: string;
    USER_ACTIVE_STATUS: number;
    Role: UserRole[];
    SUBMISSION_STATUS: string;
    LAST_LOGIN_TIME: string;
    PROFILE_PIC1_FILE_NAME: string;
    PROFILE_PIC2_FILE_NAME: string;
    ORGANIZATION_NAME: string;
    MOBILE_NUMBER: string;
    SUPPLIER_ID: string;
    EMAIL_ADDRESS: string;
    VENDOR_ID: string;
    INCORPORATE_IN: string;
    ORGANIZATION_TYPE: string;
    PROPIC_FILE_NAME: string;
}

export interface UserRole {
    ROLE_ID: number;
    ROLE_NAME: string;
    IS_ASSOCIATED: number;
    RolePermissions: RolePermission[];
}

export interface RolePermission {
    PERMISSION_ID: number;
    PERMISSION_NAME: string;
    P_DESCRIPTION: string;
}