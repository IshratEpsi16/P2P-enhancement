// export interface UserRoleListInterface {
//     message: string;
//     status: number;
//     total: number;
//     data: UserRoleData[];
// }

// export interface UserRoleData {
//     USER_ID: number;
//     USER_NAME: string;
//     EMPLOYEE_NAME: string;
//     FULL_NAME: string;
//     SUPPLIER_ID: string;
//     USER_TYPE: string | null;
//     ROLE_NAMES: string;
// }

export interface UserRoleListInterface {
  message: string;
  status: number;
  total: number;
  data: UserRoleData[];
}

export interface UserRoleData {
  USER_ID: number;
  USER_NAME: string;
  FULL_NAME: string;
  USER_TYPE: string;
  SUPPLIER_ID: number;
  VENDOR_ID: number;
  PROFILE_UPDATE_UID: number;
  PROFILE_NEW_INFO_UID: number;
  INITIATOR_ID: number;
  NEW_INFO_INITIATOR_ID: number;
  ROLE_NAMES: string;
  INITIATOR_STATUS: InitiatorStatus;
  NEW_INFO_INITIATOR_STATUS: InitiatorStatus;
}

interface InitiatorStatus {
  FULL_NAME: string;
  ACTION_CODE: number;
  ACTION_DATE: string;
  NOTE: string;
}
