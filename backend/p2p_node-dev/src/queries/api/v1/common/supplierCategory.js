const isEmpty = require("is-empty");
let table_name = "XXP2P_SUPPLIER_CATEGORY_MAPPING";

let dbName = process.env.DATABASE_NAME;

let categoryList = async (SUPPLIER_ID) => {
  let query = ` 
   SELECT DISTINCT
    CM.ID,
    HR.ORGANIZATION_ID AS ORG_ID,
    HR.NAME,
    POVH.VENDOR_LIST_NAME,
    POVH.DESCRIPTION,
    CASE 
        WHEN CM.STATUS IS NULL THEN 0 
        ELSE CM.STATUS 
    END AS STATUS
FROM
    HR_OPERATING_UNITS HR
INNER JOIN
    PO.PO_VENDOR_LIST_HEADERS POVH ON HR.ORGANIZATION_ID = POVH.ORG_ID
LEFT JOIN
    XXP2P.XXP2P_SUPPLIER_SITES_OU SOU ON SOU.ORGANIZATION_ID = HR.ORGANIZATION_ID
    AND SOU.USER_ID = :SUPPLIER_ID  -- Moved this condition to LEFT JOIN
LEFT JOIN
    XXP2P.XXP2P_SUPPLIER_CATEGORY_MAPPING CM ON SOU.USER_ID = CM.SUPPLIER_USER_ID
    AND CM.VENDOR_LIST_NAME = POVH.VENDOR_LIST_NAME
    AND CM.ORGANIZATION_ID = HR.ORGANIZATION_ID
WHERE
    POVH.INACTIVE_DATE IS NULL
    `;
  return query;
};

let categoryIsExist = async (
  SUPPLIER_ID,
  ORGANIZATION_ID,
  VENDOR_LIST_NAME,
  STATUS
) => {
  console.log(STATUS);
  let query = ` 
    SELECT
    ID,
    SUPPLIER_USER_ID,
    ORGANIZATION_ID,
    VENDOR_LIST_NAME,
    STATUS,
    CREATED_BY,
    CREATION_DATE,
    LAST_UPDATE_BY,
    LAST_UPDATE_DATE
FROM
    XXP2P.XXP2P_SUPPLIER_CATEGORY_MAPPING
     WHERE SUPPLIER_USER_ID = :SUPPLIER_ID
    AND ORGANIZATION_ID = :ORGANIZATION_ID
    AND VENDOR_LIST_NAME = :VENDOR_LIST_NAME
    AND STATUS = :STATUS
    `;
  return query;
};

let addNew = async (data = {}) => {
  let keys = Object.keys(data);

  let query = `insert into ${dbName}.${table_name} (` + keys[0];
  let valueString = " ( :1";

  for (let i = 1; i < keys.length; i++) {
    query += `, ` + keys[i];
    valueString += `, :${i + 1}`;
  }

  query = query + `) VALUES ` + valueString + `)`;
  //console.log(query);
  return query;
};

let updateById = async (ID, USER_ID, STATUS) => {
  let query = `
        UPDATE XXP2P.XXP2P_SUPPLIER_CATEGORY_MAPPING
    SET
        STATUS = :STATUS,
        LAST_UPDATE_BY = :USER_ID
    WHERE
            ID = :ID
    `;

  return query;
};

module.exports = {
  categoryList,
  addNew,
  updateById,
  categoryIsExist,
};

/*SELECT DISTINCT
    HR.ORGANIZATION_ID ORG_ID,
    HR.NAME,POVH.VENDOR_LIST_NAME,
    POVH.DESCRIPTION
FROM
    XXP2P.XXP2P_SUPPLIER_SITES_OU SOU,
    PO.PO_VENDOR_LIST_HEADERS POVH, 
    HR_OPERATING_UNITS HR
    WHERE SOU.USER_ID = :SUPPLIER_ID
    AND SOU.ORGANIZATION_ID = HR.ORGANIZATION_ID
    AND HR.ORGANIZATION_ID = POVH.ORG_ID
  AND POVH.INACTIVE_DATE IS NULL*/
