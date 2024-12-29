let currencyList = async () => {
  let query = `
        SELECT FC.CURRENCY_CODE,FCTL.NAME 
    FROM FND_CURRENCIES FC,FND_CURRENCIES_TL FCTL
    WHERE 1 = 1
    AND FC.CURRENCY_CODE=FCTL.CURRENCY_CODE
    AND ENABLED_FLAG = 'Y'
    AND (   END_DATE_ACTIVE IS NULL
    OR TRUNC (END_DATE_ACTIVE) > TRUNC (SYSDATE)
    )
        `;
  return query;
};

let currencyNameById = async (CURRENCY_CODE) => {
  let query = `
  SELECT FCTL.NAME AS CURRENCY_NAME 
  FROM FND_CURRENCIES FC,FND_CURRENCIES_TL FCTL
  WHERE 1 = 1
  AND FC.CURRENCY_CODE=FCTL.CURRENCY_CODE
  AND ENABLED_FLAG = 'Y'
  AND (   END_DATE_ACTIVE IS NULL
  OR TRUNC (END_DATE_ACTIVE) > TRUNC (SYSDATE)
  )
  AND FC.CURRENCY_CODE = :CURRENCY_CODE
        `;
  return query;
};

module.exports = {
  currencyList,
  currencyNameById,
};