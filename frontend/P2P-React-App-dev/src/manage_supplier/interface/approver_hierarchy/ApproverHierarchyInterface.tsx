interface Approver {
    STAGE_LEVEL: number;
    STAGE_SEQ: number;
    APPROVER_ID: number;
    APPROVER_FULL_NAME: string;
    APPROVER_USER_NAME: string;
    PROPIC_FILE_NAME: string | null;
    IS_MUST_APPROVE: number;
    EMAIL_ADDRESS: string | null;
    ACTION_CODE: string;
    ACTION_DATE: string | null;
    ACTION_NOTE: string | null;
  }
  
  interface ApproverHierarchyInterface {
    message: string;
    status: number;
    total: number;
    profile_pic: string;
    data: {
      [key: string]: Approver[];
    };
  }

  export default ApproverHierarchyInterface;