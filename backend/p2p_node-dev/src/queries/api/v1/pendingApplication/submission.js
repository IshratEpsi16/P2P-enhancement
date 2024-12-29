const isEmpty = require("is-empty");

let approveRejectSubmissionHistory = async (
  APPROVER_ID,
  ACTION_CODE,
  USER_ID,
  STAGE_ID,
  NOTE,
  STAGE_LEVEL
) => {
  let query = `
          
    
    DECLARE
        RID NUMBER;
        
    BEGIN

        INSERT INTO XXP2P.XXP2P_APPROVE_HISTORY (
      ACTION_CODE,
      ACTION_DATE,
      USER_ID,
      APPROVER_ID,
      STAGE_ID,
      NOTE,
      CREATED_BY,
      STAGE_LEVEL,
      LAST_UPDATED_BY
    ) VALUES (
      :ACTION_CODE,
      SYSDATE,
      :USER_ID,
      :APPROVER_ID,
      :STAGE_ID,
      :NOTE,
      :APPROVER_ID,
      :STAGE_LEVEL,
      :APPROVER_ID
    ) RETURNING HISTORY_ID INTO RID;
            COMMIT;
    
            :MESSAGE := 'Approved Successfully';
            :STATUS := 200;
            :ID := RID;
    EXCEPTION
        WHEN OTHERS THEN
            :MESSAGE := 'History submission not successful!: ' || SQLERRM;
            :STATUS := 401;
    END;

        `;
  return query;
};

let approveRejectSubmissionUserTableForReg = async (
  USER_ID,
  STAGE_ID,
  STAGE_LEVEL,
  SUBMISSION_STATUS,
  APPROVAL_STATUS,
  IS_REG_COMPLETE
) => {
  console.log(`USER_ID = ${USER_ID}`);
  console.log(STAGE_ID);
  console.log(STAGE_LEVEL);
  console.log(SUBMISSION_STATUS);
  console.log(APPROVAL_STATUS);
  console.log(IS_REG_COMPLETE);
  let query = 
  `DECLARE
    v_updated_rows_count NUMBER;
    v_final_approval_status VARCHAR2(20);
BEGIN
    -- Check if APPROVAL_STATUS is REJECTED, and if so, set it to 'IN PROCESS'
    IF :APPROVAL_STATUS = 'REJECTED' THEN
        v_final_approval_status := 'IN PROCESS';
    ELSE
        v_final_approval_status := :APPROVAL_STATUS;
    END IF;

    -- Update the XXP2P_USER table
    UPDATE XXP2P.XXP2P_USER
    SET 
        SUBMISSION_STATUS = :SUBMISSION_STATUS,
        APPROVAL_STATUS = v_final_approval_status,
        IS_REG_COMPLETE = :IS_REG_COMPLETE,
        REG_TEMPLATE_STAGE_LEVEL = :STAGE_LEVEL
    WHERE 
        USER_ID = :USER_ID
        AND REG_TEMPLATE_ID = :STAGE_ID;

    -- Check if any rows were updated
    v_updated_rows_count := SQL%ROWCOUNT;

    IF v_updated_rows_count > 0 THEN
        COMMIT;

        -- Success message based on original input APPROVAL_STATUS
        IF :APPROVAL_STATUS = 'APPROVED' THEN
            :MESSAGE := 'Registration Approved Successfully';
            :STATUS := 200;
        ELSIF :APPROVAL_STATUS = 'REJECTED' THEN
            :MESSAGE := 'Registration Rejected.';
            :STATUS := 200;
        ELSE
            :MESSAGE := 'Submission status updated successfully';
            :STATUS := 200;
        END IF;
    ELSE
        -- No rows updated
        :MESSAGE := 'Submission not successful for registration!';
        :STATUS := 400;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        -- Handle exception during update or commit
        ROLLBACK;
        :MESSAGE := 'Error during operation: ' || SQLERRM;
        :STATUS := 500; -- or another appropriate status code
END;


`;
 /* 
  `    
    DECLARE
    v_updated_rows_count NUMBER;
  BEGIN
    -- Update the XXP2P_USER table
    UPDATE XXP2P.XXP2P_USER
    SET SUBMISSION_STATUS = :SUBMISSION_STATUS,
        APPROVAL_STATUS = :APPROVAL_STATUS,
        IS_REG_COMPLETE = :IS_REG_COMPLETE,
        REG_TEMPLATE_STAGE_LEVEL =:STAGE_LEVEL

    WHERE USER_ID = :USER_ID
      AND REG_TEMPLATE_ID = :STAGE_ID
    RETURNING 1 INTO v_updated_rows_count;

    -- Check if any rows were updated
    IF v_updated_rows_count > 0 THEN
      -- Commit inside try block
      BEGIN
          COMMIT;
      EXCEPTION
          WHEN OTHERS THEN
            -- Handle exception during commit
            ROLLBACK;
            :MESSAGE := 'Error during commit: ' || SQLERRM;
            :STATUS := 500; -- or another appropriate status code
            RETURN;
      END;

      -- Success
      :MESSAGE := 'Registration Approved Successfully';
      :STATUS := 200;
    ELSE
      -- Failure
      :MESSAGE := 'Submission not successful for registration!';
      :STATUS := 400;
    END IF;
  END;`; */

  return query;
};

let updateNextLevelUserTableForReg = async (
  USER_ID,
  STAGE_ID,
  STAGE_LEVEL,
  NEXT_LEVEL,
  IS_REG_COMPLETE,
  APPROVAL_STATUS,
  SUBMISSION_STATUS
) => {
  let query = `
      
    DECLARE
    v_updated_rows_count NUMBER;
  BEGIN
    -- Update the XXP2P_USER table
    UPDATE XXP2P.XXP2P_USER
    SET REG_TEMPLATE_STAGE_LEVEL = :NEXT_LEVEL,
    IS_REG_COMPLETE = :IS_REG_COMPLETE,
    APPROVAL_STATUS = :APPROVAL_STATUS,
    SUBMISSION_STATUS = :SUBMISSION_STATUS
    WHERE USER_ID = :USER_ID
    AND REG_TEMPLATE_ID = :STAGE_ID
    RETURNING 1 INTO v_updated_rows_count;

    -- Check if any rows were updated
    IF v_updated_rows_count > 0 THEN
      -- Commit inside try block
      BEGIN
          COMMIT;
      EXCEPTION
          WHEN OTHERS THEN
            -- Handle exception during commit
            ROLLBACK;
            :MESSAGE := 'Error during commit: ' || SQLERRM;
            :STATUS := 500; -- or another appropriate status code
            RETURN;
      END;

      -- Success
      :MESSAGE := 'Registration Stage Updated Successfully';
      :STATUS := 200;
    ELSE
      -- Failure
      :MESSAGE := 'Stage Updated not successful for registration!';
      :STATUS := 400;
    END IF;
  END;


        `;
  return query;
};

let approveRejectSubmissionUserTableForUpdate = async (
  USER_ID,
  STAGE_ID,
  STAGE_LEVEL,
  SUBMISSION_STATUS,
  APPROVAL_STATUS
) => {
  let query = `
      
    DECLARE
    v_update_count NUMBER;
    BEGIN
    -- Update the XXP2P_USER table
    UPDATE XXP2P.XXP2P_USER
    SET SUBMISSION_STATUS = :SUBMISSION_STATUS,
    PROFILE_UPDATE_TEMPLATE_ID = :STAGE_ID,
    PROFILE_UPDATE_TEMPLATE_STAGE_LEVEL = :STAGE_LEVEL,
    PROFILE_UPDATE_STATUS = :APPROVAL_STATUS

    WHERE USER_ID = :USER_ID
    RETURNING 1 INTO v_update_count;

    -- Check if any rows were updated
    IF v_update_count > 0 THEN
      COMMIT;
      :MESSAGE := 'Submitted Successfully';
      :STATUS := 200;
    ELSE
    :MESSAGE := 'Submission not successful for profile update!';
    :STATUS := 400;
    END IF;
    END;

        `;
  return query;
};

let approveRejectSubmissionLogTable = async (
  ACTION_ID,
  STAGE_ID,
  STAGE_LEVEL,
  APPROVER_STATUS
) => {
  console.log(ACTION_ID);
  console.log(STAGE_ID);
  console.log(STAGE_LEVEL);
  console.log(APPROVER_STATUS);
  let query = `
      
    DECLARE
    v_update_count NUMBER;
  BEGIN
    UPDATE XXP2P.UPDATE_LOG_TABLE
    SET
        PROFILE_UPDATE_TEMPLATE_ID = :STAGE_ID,
        PROFILE_UPDATE_TEMPLATE_STAGE_LEVEL = :STAGE_LEVEL,
        APPROVER_STATUS = :APPROVER_STATUS

    WHERE ACTION_ID = :ACTION_ID
    RETURNING 1 INTO v_update_count;
  -- Check if any rows were updated
    IF v_update_count > 0 THEN
    COMMIT;
    :MESSAGE := 'Submitted Successfully On Log Table';
    :STATUS := 200;
    ELSE
    :MESSAGE := 'Submission not successful On Log Table!';
    :STATUS := 400;
    END IF;
  END;


        `;
  return query;
};

let approveRejectSubmissionCheckExist = async (
  SUPPLIER_ID,
  STAGE_ID,
  STAGE_LEVEL,
  APPROVER_ID
) => {
  let query = `
        
    SELECT
    COUNT(HISTORY_ID) AS TOTAL
    FROM
    XXP2P.XXP2P_APPROVE_HISTORY
    WHERE USER_ID =:SUPPLIER_ID
    AND APPROVER_ID =:APPROVER_ID
    AND STAGE_ID =:STAGE_ID
    AND STAGE_LEVEL =:STAGE_LEVEL
    
          `;
  return query;
};

let supplierSyncProcess = async () => {
  let query = `
    DECLARE
  BEGIN    
    -- Call the procedure to create the supplier
    APPS.XX_SUPPLIER_P2P_PKG.CREATE_SUPPLIER;
    
    -- If the procedure call succeeds, set the success message
    
    -- Return the success message
    :MESSAGE := 'Supplier created successfully';
  EXCEPTION
    -- Catch any exceptions that occur during procedure execution
    WHEN OTHERS THEN
    :MESSAGE := 'Supplier not created. Please try again';
      -- Print error message or handle the exception as per your requirement
      DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
  END;
    
          `;
  return query;
};
let getSupplierInfo = async (USER_ID) => {
  let query = 
  `SELECT us.*,
bsc.ORGANIZATION_NAME 
from xxp2p.xxp2p_user us 
left join xxp2p.xxp2p_supplier_bsc_info bsc on bsc.user_id = us.user_id
where us.USER_ID =:USER_ID`;
  return query;
};

module.exports = {
  approveRejectSubmissionHistory,
  approveRejectSubmissionUserTableForReg,
  approveRejectSubmissionLogTable,
  approveRejectSubmissionUserTableForUpdate,
  approveRejectSubmissionCheckExist,
  updateNextLevelUserTableForReg,
  supplierSyncProcess,
  getSupplierInfo,
};

/*
      DECLARE
          v_update_count NUMBER;
      BEGIN
          -- Update the XXP2P_USER table
          UPDATE XXP2P.XXP2P_USER
          SET SUBMISSION_STATUS = :SUBMISSION_STATUS
          WHERE USER_ID = :userId
          RETURNING 1 INTO v_update_count;

          -- Check if any rows were updated
          IF v_update_count > 0 THEN
            COMMIT;
            :MESSAGE := 'Updated Successfully';
            :STATUS := 201;
          ELSE
          :MESSAGE := 'No rows updated';
          :STATUS := 400;
          END IF;
      END;
      */
