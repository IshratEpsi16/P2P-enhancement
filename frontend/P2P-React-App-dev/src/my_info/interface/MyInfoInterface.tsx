// export interface MyInfoInterface {
//     message: string;
//     status: number;
//     Menu: MyMenuInterface[];
//     Permission: MyPermissionInterface[];
//     USER_ID: number;
//     USER_NAME: string;
//     FULL_NAME: string;
// }

// export interface MyMenuInterface {
//     MENU_ID: number;
//     MENU_NAME: string;
// }

// export interface MyPermissionInterface {
//     PERMISSION_ID: number;
//     PERMISSION_NAME: string;
//     P_DESCRIPTION: string;
// }

export interface MyInfoInterface {
  message: string;
  status: number;
  data: {
    USER_ID: number;
    USER_NAME: string;
    FULL_NAME: string;
    EMAIL_ADDRESS: string;
    USER_TYPE: string;
    EMPLOYEE_ID?: string | number; // Optional as it seems to be empty in the provided JSON
    BUYER_ID?: number | number; // Optional as it seems to be empty in the provided JSON
    MOBILE_NUMBER: number;
    PROFILE_UPDATE_STATUS: string;
    BUSINESS_GROUP_ID: number;
    BUSINESS_GROUP_NAME: string;
    PROFILE_PIC_FILE_NAME: string;
    DEPARTMENT: string;
  };
  profile_pic_supplier: string;
  profile_pic_buyer: string;
  Menu: MyMenuInterface;
  Permission: MyPermissionInterface;
}

export interface MyMenuInterface {
  MENU_ID: number;
  MENU_NAME: string;
}

export interface MyPermissionInterface {
  PERMISSION_ID: number;
  PERMISSION_NAME: string;
  P_DESCRIPTION: string;
}

export interface MyInitiatorInterface {
  ACTION_CODE: string;
  ACTION_DATE: string;
  FULL_NAME: string;
  NOTE: string;
  USER_NAME: string;
}
