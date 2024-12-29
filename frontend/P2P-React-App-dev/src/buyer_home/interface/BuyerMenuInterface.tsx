interface BuyerMenuInterface {
    MENU_DETAILS: Array<{
        MENU_ID: number;
        MENU_NAME: string;
        IS_ACTIVE: number;
        ICON_NAME: string;
        NAVIGATE_TO_PAGE: string;
        SEQUENCE: number;
        ROLE_ID: string;
    }>;
    ACCESS_DETAILS: Array<{
        ROLE_ID: string;
        ROLE_NAME: string;
        PERMISSION_ID: string;
        PERMISSION_NAME: string;
        DESCRIPTION: string;
    }>;
}

export default BuyerMenuInterface;  