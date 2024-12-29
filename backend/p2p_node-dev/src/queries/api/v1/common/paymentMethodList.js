let paymentMethodList = async () => {
  let query = `
    SELECT PAYMENT_METHOD_CODE,PAYMENT_METHOD_NAME,DESCRIPTION
FROM IBY_PAYMENT_METHODS_TL
ORDER BY 1
      `;
  return query;
};

let addPaymentMethod = async (userId, SUPPLIER_ID, CODE) => {
  let query = `
    
DECLARE
BEGIN
  UPDATE XXP2P.XXP2P_USER
  SET PAYMENT_METHOD_CODE = :CODE, LAST_UPDATED_BY = :userId
  WHERE USER_ID = :SUPPLIER_ID;

IF SQL%ROWCOUNT > 0 THEN
      COMMIT;
          :MESSAGE := 'Payment Method Added Successfully';
          :STATUS := 200;
      ELSE
          :MESSAGE := 'Failed Add Payment Method';
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

let supplierPaymentMethod = async (SUPPLIER_ID) => {
  let query = `
  SELECT 
  NVL(PM.PAYMENT_METHOD_CODE,'N/A') AS PAYMENT_METHOD_CODE,
  NVL(PM.PAYMENT_METHOD_NAME,'N/A') AS PAYMENT_METHOD_NAME,
  NVL(PM.DESCRIPTION,'N/A') AS DESCRIPTION
  FROM  XXP2P.XXP2P_USER US
  LEFT JOIN IBY_PAYMENT_METHODS_TL PM ON PM.PAYMENT_METHOD_CODE = US.PAYMENT_METHOD_CODE
  WHERE US.USER_ID = :SUPPLIER_ID
      `;
  return query;
};

module.exports = {
  paymentMethodList,
  addPaymentMethod,
  supplierPaymentMethod,
};
