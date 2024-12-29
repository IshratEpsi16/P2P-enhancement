const isEmpty = require("is-empty");

let submissionUpdate = async (userId,SUBMISSION_STATUS) => {
  let query = 
  `
  DECLARE
    v_update_count NUMBER;
BEGIN
    -- Update the XXP2P_USER table
    UPDATE XXP2P.XXP2P_USER
    SET SUBMISSION_STATUS = :SUBMISSION_STATUS, 
    INITIATOR_STATUS = 'IN PROCESS'
    WHERE USER_ID = :userId
    RETURNING 1 INTO v_update_count;

    -- Check if any rows were updated
    IF v_update_count > 0 THEN
      COMMIT;
      :MESSAGE := 'Submission Successful';
      :STATUS := 201;
    ELSE
    :MESSAGE := 'No rows updated';
    :STATUS := 400;
    END IF;
END;

    
  `;
  return query;
};


module.exports = {
  submissionUpdate,
};
