interface ApproveHistoryInterface {
  USER_NAME: string;
  FULL_NAME: string;
  HISTORY_ID: number;
  OBJECT_ID: number;
  OBJECT_TYPE_CODE: string;
  ACTION_CODE: string;
  ACTION_DATE: string;
  USER_ID: string;
  INITIATOR_ID: string;
  APPROVER_ID: number;
  IS_MUST_APPROVE: string;
  STAGE_ID: number;
  NOTE: string;
  CREATED_BY: string;
  CREATION_DATE: string;
  LAST_UPDATED_BY: string;
  LAST_UPDATE_DATE: string;
  MODULE_ID: string;
  STAGE_LEVEL: number;
}

export default ApproveHistoryInterface;
