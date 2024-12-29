interface ApproverSequenceInterface {
    ID: number;
    STAGE_ID: number;
    APPROVER_ID: number;
    APPROVER_FULL_NAME: string;
    APPROVER_USER_NAME: string;
    PROPIC_FILE_NAME: string | null;
    STAGE_LEVEL: number;
    STAGE_SEQ: number;
    IS_MUST_APPROVE: number;
    ON_VACATION: number | null;
    VACATION_START_DATE: string | null;
    VACATION_END_DATE: string | null;
    STATUS: string;
    CREATED_BY: number;
    CREATED_BY_FULL_NAME: string;
    CREATED_BY_USER_NAME: string;
    CREATION_DATE: string;
    BUYER_ID: string;
  }

  export default ApproverSequenceInterface;