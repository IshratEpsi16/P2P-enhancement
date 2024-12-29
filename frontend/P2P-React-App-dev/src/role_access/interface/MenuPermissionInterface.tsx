

export interface MenuPermissionInterface {
    message: string;
    status: number;
    data: {
        Permission: PermissionInterface[];
        Menu: MenuInterface[];
    }[];
}

export interface PermissionInterface {
    PERMISSION_ID: number;
    PERMISSION_NAME: string;
    P_DESCRIPTION: string;
}

export interface MenuInterface {
    MENU_ID: number;
    MENU_NAME: string;
}