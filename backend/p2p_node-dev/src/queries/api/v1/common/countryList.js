let countryList = async () => {
  let query = `
    SELECT 
TERRITORY_CODE AS VALUE,
INITCAP(NLS_TERRITORY) AS LABEL
FROM FND_TERRITORIES
WHERE NLS_TERRITORY IS NOT NULL
ORDER BY 2
      `;
  return query;
};

let countryNameByValue = async (VALUE) => {
  let query = `
   SELECT 
TERRITORY_CODE AS VALUE,
INITCAP(NLS_TERRITORY) AS LABEL
FROM FND_TERRITORIES
WHERE NLS_TERRITORY IS NOT NULL
and TERRITORY_CODE = UPPER(:VALUE)
ORDER BY 2
      `;
  return query;
};

module.exports = {
  countryList,
  countryNameByValue,
};
