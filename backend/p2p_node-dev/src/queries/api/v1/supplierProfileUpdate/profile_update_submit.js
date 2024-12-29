

let submitUpdate = async (APPROVER_STATUS, ACTION_TAKEN_BY) => {
  let query = 
  `
DECLARE
  v_update_status varchar2(30);
  v_new_status varchar2(30);
BEGIN
  SELECT PROFILE_UPDATE_STATUS, NEW_INFO_STATUS 
  INTO v_update_status, v_new_status
  FROM xxp2p.xxp2p_user 
  WHERE USER_ID = :ACTION_TAKEN_BY; 

  -- Update Status--
  IF v_update_status = 'INCOMPLETE' THEN
    UPDATE XXP2P.XXP2P_USER
    SET PROFILE_UPDATE_STATUS = :APPROVER_STATUS,
        SUBMISSION_STATUS = 'SUBMIT',
        INITIATOR_STATUS = 'IN PROCESS'
    WHERE USER_ID = :ACTION_TAKEN_BY;
  END IF; 

  -- New Status --
  IF v_new_status = 'INCOMPLETE' THEN
    UPDATE XXP2P.XXP2P_USER
    SET NEW_INFO_STATUS = :APPROVER_STATUS,
        SUBMISSION_STATUS = 'SUBMIT',
        NEW_INFO_INITIATOR_STATUS = 'IN PROCESS'
    WHERE USER_ID = :ACTION_TAKEN_BY;
  END IF; 

  -- Both Status --
  IF v_update_status = 'INCOMPLETE' AND v_new_status = 'INCOMPLETE' THEN
    UPDATE XXP2P.XXP2P_USER
    SET PROFILE_UPDATE_STATUS = :APPROVER_STATUS,
        NEW_INFO_STATUS = :APPROVER_STATUS,
        SUBMISSION_STATUS = 'SUBMIT',
        INITIATOR_STATUS = 'IN PROCESS',
        NEW_INFO_INITIATOR_STATUS = 'IN PROCESS'
    WHERE USER_ID = :ACTION_TAKEN_BY;
  END IF;

  -- Commit the transaction
  COMMIT;

  :MESSAGE := 'Submitted Successfully';
  :STATUS := 200;
EXCEPTION
  WHEN OTHERS THEN
    -- Handle exception during commit
    ROLLBACK;
    :MESSAGE := 'Error during commit: ' || SQLERRM;
    :STATUS := 500; -- or another appropriate status code
END;

`;
  return query;
};

module.exports = {
  submitUpdate,
};

/*
-- Update the first table
UPDATE XXP2P.UPDATE_LOG_TABLE
SET
    APPROVER_STATUS = :APPROVER_STATUS
WHERE
    ACTION_TAKEN_BY = :ACTION_TAKEN_BY;

    */

/*
DECLARE
BEGIN

    -- Update the second table
    UPDATE XXP2P.XXP2P_USER
    SET
        PROFILE_UPDATE_STATUS = :APPROVER_STATUS,
        SUBMISSION_STATUS = 'SUBMIT'
    WHERE
        USER_ID = :ACTION_TAKEN_BY;

    -- Check if both updates were successful
    IF SQL%ROWCOUNT > 0 THEN
        -- Both updates were successful, commit the transaction
        COMMIT;
        :MESSAGE := 'Submitted Successfully';
        :STATUS := 200;
    ELSE
        -- At least one update failed, rollback the transaction
        ROLLBACK;
        :MESSAGE := 'Submission Failed';
        :STATUS := 400;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- Handle exception during commit
        ROLLBACK;
        :MESSAGE := 'Error during commit: ' || SQLERRM;
        :STATUS := 500; -- or another appropriate status code
END;
*/    