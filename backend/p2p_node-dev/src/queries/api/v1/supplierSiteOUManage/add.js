const isEmpty = require("is-empty");
let table_name = "XXP2P_SUPPLIER_SITES_OU_MANAGE_HISTORY";
let dbName = process.env.DATABASE_NAME;
let history = async (P_OFFSET, P_LIMIT) => {
  let query = `
    SELECT
    mh.ID,
    BSC.ORGANIZATION_NAME AS SUPPLIER_NAME,
    mh.SITE_ID,
    ST.ADDRESS_LINE1 AS SITE_NAME,
    mh.ORGANIZATION_ID,
    HOU.SHORT_CODE,
    HOU.NAME,
    mh.ACTION_CODE,
    mh.NOTE,
    mh.CREATED_BY,
    US.FULL_NAME AS CREATED_BY_NAME,
    mh.CREATION_DATE

FROM
    XXP2P.XXP2P_SUPPLIER_SITES_OU_MANAGE_HISTORY mh
LEFT JOIN 
    HR_OPERATING_UNITS HOU 
  ON  HOU.ORGANIZATION_ID = mh.ORGANIZATION_ID 
LEFT JOIN XXP2P.XXP2P_USER US ON US.USER_ID = mh.CREATED_BY
LEFT JOIN  XXP2P.XXP2P_SUPPLIER_SITE ST ON ST.ID = mh.SITE_ID
LEFT JOIN XXP2P.XXP2P_SUPPLIER_BSC_INFO BSC ON BSC.USER_ID = ST.USER_ID
ORDER BY mh.ID DESC
OFFSET NVL(:P_OFFSET,0) ROWS 
FETCH NEXT NVL(:P_LIMIT, 10)ROWS ONLY
      
    `;
  return query;
};



let addNew = async (data = {}) => {
    let keys = Object.keys(data);

    let query = `insert into ${dbName}.${table_name} (` + keys[0];
    let valueString = " ( :1"

    for (let i = 1; i < keys.length; i++) {
        query += `, ` + keys[i];
        valueString += `, :${i + 1}`;
    }

    query = query + `) VALUES ` + valueString + `)`;
    // console.log(query);

    return query;
}

module.exports = {
  history,
  addNew,
};
