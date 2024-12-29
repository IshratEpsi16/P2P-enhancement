let sendEmail = async (EMAIL, NAME, SUBJECT, P_BODY) => {
  let query = `
        
    DECLARE
    BEGIN
    XXP2P.REG_UPDATE_EMAIL(:EMAIL,:NAME,:SUBJECT,:P_BODY);
        :MESSAGE := 'Email Sent to Approver';
        :STATUS := 200;
        EXCEPTION
            WHEN OTHERS THEN
            -- Handle exception during commit
            ROLLBACK;
            :MESSAGE := 'Error during email send: ' || SQLERRM;
            :STATUS := 500; -- or another appropriate status code
            RETURN; 
    end;
        `;
  return query;
};

module.exports = {
  sendEmail,
};
