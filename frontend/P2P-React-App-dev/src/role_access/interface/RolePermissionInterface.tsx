
export interface RolePermissionInterface {
    message: string;
    status: number;
    data: RoleDatum[];
}

export interface RoleDatum {
    ROLE_NAME: string;
    ROLE_ID: number;
    CAN_DELETE: number;
    Permission: RolePermission[];
    Menu: RoleMenu[];
}

export interface RoleMenu {
    MENU_ID: number;
    MENU_NAME: string;
    IS_ACTIVE: number;
    ROUTE_NAME: null | string;
    MENU_SEQUENCE: number;
    IS_ASSOCIATED: number;
}

export interface RolePermission {
    PERMISSION_ID: number;
    PERMISSION_NAME: string;
    DESCRIPTION: string;
    IS_ASSOCIATED: number;
}

