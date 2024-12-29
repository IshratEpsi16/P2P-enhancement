const isEmpty = require("is-empty");

let approvalModuleList = async () => {
  let query = `SELECT
    *
    FROM
      XXP2P.XXP2P_APPROVAL_MODULE`;
  return query;
};

let stageApproverAdd = async (
  STAGE_ID,
  EMPLOYEE_ID,
  STAGE_LEVEL,
  STAGE_SEQ,
  IS_MUST_APPROVE,
  STATUS,
  CREATED_BY
) => {
  let query = `
      DECLARE
      IS_EXIST NUMBER;
      IS_USER_EXIST NUMBER;
      SID NUMBER;
      BEGIN
        -- Check if the id exist already exists
        SELECT COUNT(*) INTO IS_USER_EXIST
        FROM XXP2P.XXP2P_STAGE_APPROVERS
        WHERE USER_ID = :EMPLOYEE_ID
        AND STAGE_ID = :STAGE_ID
        AND STAGE_LEVEL = :STAGE_LEVEL;  
      IF IS_USER_EXIST > 0 THEN
      :MESSAGE := 'Approver Already Exist';
      :STATUS := 200;
      ELSE
      INSERT INTO XXP2P.XXP2P_STAGE_APPROVERS (
          STAGE_ID,
          USER_ID,
          STAGE_LEVEL,
          STAGE_SEQ,
          IS_MUST_APPROVE,
          STATUS,
          CREATED_BY
      ) VALUES (
          :STAGE_ID,
          :EMPLOYEE_ID,
          :STAGE_LEVEL,
          :STAGE_SEQ,
          :IS_MUST_APPROVE,
          :STATUS,
          :EMPLOYEE_ID
      ) RETURNING ID INTO SID;
      COMMIT;
            :MESSAGE := 'New Approver Added';
            :STATUS := 200;
            :ID := SID;
      END IF;
      EXCEPTION
        WHEN OTHERS THEN
            :MESSAGE := 'An error occurred: ' || SQLERRM;
            :STATUS := 401;
      END;
      
    `;
  return query;
};

let stageApproverUpdate = async (
  ID,
  STAGE_ID,
  EMPLOYEE_ID,
  STAGE_LEVEL,
  STAGE_SEQ,
  IS_MUST_APPROVE,
  STATUS
) => {
  let query = `
      DECLARE
    v_updated_count NUMBER;
  BEGIN
    UPDATE XXP2P.XXP2P_STAGE_APPROVERS
    SET
      STAGE_ID = :STAGE_ID,
      USER_ID = :EMPLOYEE_ID,
      STAGE_LEVEL = :STAGE_LEVEL,
      STAGE_SEQ = :STAGE_SEQ,
      IS_MUST_APPROVE = :IS_MUST_APPROVE,
      STATUS = :STATUS,
      LAST_UPDATE_BY = :EMPLOYEE_ID
    WHERE ID = :ID
    RETURNING 1 INTO v_updated_count;
    COMMIT;  
    IF v_updated_count > 0 THEN
      :MESSAGE := 'Update successful';
      :STATUS := 200;
    ELSE
      :MESSAGE := 'No rows updated';
      :STATUS := 404;
    END IF;
  END;
      
    `;
  return query;
};

let approverList = async (STAGE_ID) => {
  let query = `SELECT
      SP.ID,
      SP.STAGE_ID,
      SP.USER_ID AS APPROVER_ID,
      US.BUYER_ID,
      US.EMAIL_ADDRESS,
      US.FULL_NAME AS APPROVER_FULL_NAME,
      US.USER_NAME AS APPROVER_USER_NAME,
      US.PROPIC_FILE_NAME,
      SP.STAGE_LEVEL,
      SP.STAGE_SEQ,
      SP.IS_MUST_APPROVE,
      SP.ON_VACATION,
      SP.VACATION_START_DATE,
      SP.VACATION_END_DATE,
      SP.STATUS,
      SP.CREATED_BY,
      (SELECT FULL_NAME FROM XXP2P.XXP2P_USER WHERE USER_ID = SP.CREATED_BY) AS CREATED_BY_FULL_NAME,
      (SELECT FULL_NAME FROM XXP2P.XXP2P_USER WHERE USER_ID = SP.CREATED_BY) AS CREATED_BY_USER_NAME,
      SP.CREATION_DATE
  FROM
      XXP2P.XXP2P_STAGE_APPROVERS SP, XXP2P.XXP2P_USER US
  WHERE SP.STAGE_ID = :STAGE_ID
  AND US.USER_ID = SP.USER_ID(+)

  ORDER BY SP.CREATION_DATE`;
  return query;
};

let templateDelete = async (TEMPLATE_ID) => {
  let query = `
      DECLARE
      IS_NAME_EXIST NUMBER;
      BEGIN
      
            SELECT COUNT(*) INTO IS_NAME_EXIST
            FROM XXP2P.XXP2P_APPROVAL_STAGES
            WHERE AS_ID = :TEMPLATE_ID;
        
            IF IS_NAME_EXIST > 0 THEN
            DELETE FROM XXP2P.XXP2P_STAGE_APPROVERS where STAGE_ID = :TEMPLATE_ID; 
          DELETE FROM XXP2P.XXP2P_APPROVAL_STAGES where AS_ID = :TEMPLATE_ID;
          COMMIT;
          :MESSAGE := 'Deleted Successfully';
          :STATUS := 200;
                
          ELSE
            :MESSAGE := 'Template Not Exists!';
            :STATUS := 200;
          
          END IF;
        EXCEPTION
            WHEN OTHERS THEN
                :MESSAGE := 'An error occurred: ' || SQLERRM;
                :STATUS := 401;
        END;`;
  return query;
};

let approverDelete = async (ID) => {
  let query = `
      DECLARE
    v_updated_count NUMBER;
  BEGIN
    DELETE FROM XXP2P.XXP2P_STAGE_APPROVERS
    WHERE ID = :ID
    RETURNING 1 INTO v_updated_count;
    COMMIT;
    IF v_updated_count > 0 THEN
      :MESSAGE := 'Deleted successfully';
      :STATUS := 200;
    ELSE
      :MESSAGE := 'No rows deleted';
      :STATUS := 404;
    END IF;
  END;`;
  return query;
};

module.exports = {
  stageApproverAdd,
  approvalModuleList,
  approverList,
  templateDelete,
  stageApproverUpdate,
  approverDelete,
};
