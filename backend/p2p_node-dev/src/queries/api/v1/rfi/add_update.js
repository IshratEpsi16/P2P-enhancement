let addRfi = async (
  OBJECT_ID,
  OBJECT_TYPE,
  INITIATOR_ID,
  INITIATOR_NOTE,
  VIEWER_ID
) => {
  let query = `
    DECLARE
    RID NUMBER;
BEGIN
    INSERT INTO XXP2P.XXP2P_RFI_INFO (
        OBJECT_ID,
        OBJECT_TYPE,
        INITIATOR_ID,
        INITIATOR_NOTE,
        VIEWER_ID,
        VIEWER_ACTION,
        CREATED_BY
    ) VALUES (
        :OBJECT_ID,
        :OBJECT_TYPE,
        :INITIATOR_ID,
        :INITIATOR_NOTE,
        :VIEWER_ID,
        0,
        :INITIATOR_ID  -- Use :CREATED_BY instead of INITIATOR_ID
    ) RETURNING ID INTO RID;
    COMMIT;

    IF RID IS NOT NULL THEN
        :MESSAGE := 'RFI Send Successfully';
        :STATUS := 200;
    ELSE
        :MESSAGE := 'RFI Send Failed';
        :STATUS := 400;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- Handle exception during commit
        ROLLBACK;
        :MESSAGE := 'Error: ' || SQLERRM;
        :STATUS := 500; -- or another appropriate status code
        RETURN;
END;

    
    `;
  return query;
};

let updateRfi = async (ID, VIEWER_ID, VIEWER_NOTE, VIEWER_ACTION) => {
  let query = `
  DECLARE
  BEGIN
      UPDATE XXP2P.XXP2P_RFI_INFO
      SET
          VIEWER_ID = :VIEWER_ID,
          VIEW_DATE = SYSDATE,
          VIEWER_NOTE = :VIEWER_NOTE,
          VIEWER_ACTION = :VIEWER_ACTION,
          LAST_UPDATED_BY = :VIEWER_ID
      WHERE
          ID = :ID;
          
  
      IF SQL%ROWCOUNT > 0 THEN
      COMMIT;
          :MESSAGE := 'Submitted Successfully';
          :STATUS := 200;
      ELSE
          :MESSAGE := 'Submission Failed';
          :STATUS := 400;
      END IF;
  
  EXCEPTION
      WHEN OTHERS THEN
          -- Handle exception during commit
          ROLLBACK;
          :MESSAGE := 'Error during commit: ' || SQLERRM;
          :STATUS := 500; -- or another appropriate status code
          RETURN;
  END;
  
    `;
  return query;
};

module.exports = {
  addRfi,
  updateRfi,
};
