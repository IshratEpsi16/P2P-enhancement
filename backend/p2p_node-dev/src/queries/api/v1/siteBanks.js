const isEmpty = require("is-empty");
let table_name = "XXP2P_SUPPLIER_SITE_BANKS";
let table_name_bank = "XXP2P_SUPPLIER_BANK";

let dbName = process.env.DATABASE_NAME;

let getList = async () => {
  return `SELECT * FROM ${dbName}.${table_name}`;
};

let getById = () => {
  return `SELECT * FROM ${dbName}.${table_name} where  id = :1`;
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

// let addNew = async (data = {}) => {
//     let keys = Object.keys(data);

//     let placeholders = keys.map((key, index) => `:${index + 1}`).join(', ');

//     let plsqlBlock = `
//       DECLARE
//         ZID NUMBER;
//       BEGIN

//         INSERT INTO ${dbName}.${table_name} (${keys.join(', ')})
//         VALUES (${placeholders})
//         RETURNING ID INTO ZID;

//         :ID := ZID;
//       END;
//     `;

//     console.log(plsqlBlock);
//     return plsqlBlock;
//   };

let updateById = async (data) => {
  let keys = Object.keys(data);
  let flag = 0;

  let query = `update ${dbName}.${table_name} set ` + keys[0] + ` = :${flag++}`;

  for (let i = 1; i < keys.length; i++, flag++) {
    query += `, ` + keys[i] + ` = :${flag}`;
  }

  query += ` where id = :${flag}`;
  return query;
};

let getDataByWhereCondition = async (
  data = {},
  orderBy = {},
  limit,
  offset,
  columnList = []
) => {
  let keys = Object.keys(data);
  let columns = " * ";
  let flag = 2;

  try {
    if (Array.isArray(columnList) && !isEmpty(columnList)) {
      columns = columnList.join(",");
    }
  } catch (error) {
    columns = " * ";
  }

  let query = `Select ${columns} from ${dbName}.${table_name_bank} `;

  if (keys.length > 0) {
    if (Array.isArray(data[keys[0]])) {
      query += ` where ${keys[0]} BETWEEN :1 and :2`;
      flag = 3;
    } else if (
      typeof data[keys[0]] === "object" &&
      !Array.isArray(data[keys[0]]) &&
      data[keys[0]] !== null
    ) {
      let key2 = Object.keys(data[keys[0]]);

      for (let indexKey = 0; indexKey < key2.length; indexKey++) {
        let tempSubKeyValue = data[keys[0]][key2[indexKey]];
        if (
          key2[indexKey].toUpperCase() === "OR" &&
          Array.isArray(tempSubKeyValue)
        ) {
          query += ` where ( ${keys[0]} = :1`;
          for (
            let indexValue = 1;
            indexValue < tempSubKeyValue.length;
            indexValue++
          ) {
            query += ` or ` + keys[0] + ` = :1`;
          }
          query += ` ) `;
        } else if (key2[indexKey].toUpperCase() === "OR") {
          query +=
            ` where ${key2[indexKey].toLowerCase()} ` + keys[0] + ` = :1`;
        } else if (key2[indexKey].toUpperCase() === "LIKE") {
          query += ` where ${keys[0]} like :1`;
        } else if (["IN", "NOT IN"].includes(key2[indexKey].toUpperCase())) {
          query += ` where ${keys[0]}  ${key2[indexKey].toUpperCase()} ( :1) `;
        } else if (["IN QUERY"].includes(key2[indexKey].toUpperCase())) {
          query += ` where  ${keys[0]}  IN ( ${
            data[keys[0]][key2[indexKey]]
          } ) `;
        } else if (["NOT IN QUERY"].includes(key2[indexKey].toUpperCase())) {
          query += ` where  ${keys[0]}  NOT IN ( ${
            data[keys[0]][key2[indexKey]]
          } ) `;
        } else if ("GTE" == key2[indexKey].toUpperCase()) {
          query += ` where  ` + keys[0] + ` >= :1`;
        } else if ("GT" == key2[indexKey].toUpperCase()) {
          query += ` where ` + keys[0] + ` > :1`;
        } else if ("LTE" == key2[indexKey].toUpperCase()) {
          query += ` where ` + keys[0] + ` <= :1`;
        } else if ("LT" == key2[indexKey].toUpperCase()) {
          query += ` where ` + keys[0] + ` < :1`;
        } else if ("NOT EQ" == key2[indexKey].toUpperCase()) {
          query += ` where ` + keys[0] + ` != :1`;
        }
      }
    } else {
      query += ` where ${keys[0]} = :1`;
    }

    for (let i = 1; i < keys.length; i++, flag++) {
      if (Array.isArray(data[keys[i]])) {
        query += ` and ` + keys[i] + `  BETWEEN  :${flag} and :${flag}`;
        flag++;
      } else if (
        typeof data[keys[i]] === "object" &&
        !Array.isArray(data[keys[i]]) &&
        data[keys[i]] !== null
      ) {
        let key2 = Object.keys(data[keys[i]]);

        for (let indexKey = 0; indexKey < key2.length; indexKey++) {
          let tempSubKeyValue = data[keys[i]][key2[indexKey]];
          if (
            key2[indexKey].toUpperCase() === "OR" &&
            Array.isArray(tempSubKeyValue)
          ) {
            query += ` or ( ${keys[i]} = :${flag}`;
            for (
              let indexValue = 1;
              indexValue < tempSubKeyValue.length;
              indexValue++
            ) {
              query += ` or ` + keys[i] + ` = :${flag}`;
            }
            query += ` ) `;
          } else if (key2[indexKey].toUpperCase() === "OR") {
            query +=
              ` or ${key2[indexKey].toLowerCase()} ` + keys[i] + ` = :${flag}`;
          } else if (key2[indexKey].toUpperCase() === "LIKE") {
            query += ` and  ${keys[i]} like :${flag}`;
          } else if (["IN", "NOT IN"].includes(key2[indexKey].toUpperCase())) {
            query += ` and  ${keys[i]}  ${key2[
              indexKey
            ].toUpperCase()} ( :${flag}) `;
          } else if (["IN QUERY"].includes(key2[indexKey].toUpperCase())) {
            query += ` and  ${keys[i]}  IN ( ${
              data[keys[i]][key2[indexKey]]
            } ) `;
          } else if (["NOT IN QUERY"].includes(key2[indexKey].toUpperCase())) {
            query += ` and  ${keys[i]}  NOT IN ( ${
              data[keys[i]][key2[indexKey]]
            } ) `;
          } else if ("GTE" == key2[indexKey].toUpperCase()) {
            query += ` and ` + keys[i] + ` >= :${flag}`;
          } else if ("GT" == key2[indexKey].toUpperCase()) {
            query += ` and ` + keys[i] + ` > :${flag}`;
          } else if ("LTE" == key2[indexKey].toUpperCase()) {
            query += ` and ` + keys[i] + ` <= :${flag}`;
          } else if ("LT" == key2[indexKey].toUpperCase()) {
            query += ` and ` + keys[i] + ` < :${flag}`;
          } else if ("NOT EQ" == key2[indexKey].toUpperCase()) {
            query += ` and ` + keys[i] + ` != :${flag}`;
          }
        }
      } else {
        query += ` and ` + keys[i] + ` = :${flag}`;
      }
    }
  }

  if (!isEmpty(orderBy)) {
    keys = Object.keys(orderBy);
    query += ` order by ${keys[0]} ${orderBy[keys[0]]} `;

    for (let i = 1; i < keys.length; i++) {
      query += `, ${keys[i]} ${orderBy[keys[i]]} `;
    }
  }

  // query += ` LIMIT ${offset}, ${limit}`;
  return query;
};

let siteOU = async (USER_ID, SITE_ID, SHORT_CODE, NAME, ORGANIZATION_ID) => {
  let query = `
          DECLARE
          v_userid NUMBER :=:USER_ID;
          v_siteid NUMBER :=:SITE_ID;
          v_orgid NUMBER :=:ORGANIZATION_ID;
          v_name VARCHAR2(240) :=:NAME;
          v_scode VARCHAR2(240) :=:SHORT_CODE;
          IS_EXIST NUMBER := 0;

          BEGIN
          BEGIN
              SELECT 1
              INTO IS_EXIST
              FROM XXP2P.XXP2P_SUPPLIER_SITES_OU
              WHERE USER_ID = v_userid 
              AND SITE_ID = v_siteid
              AND ORGANIZATION_ID = v_orgid;

          EXCEPTION
              WHEN NO_DATA_FOUND THEN
                  IS_EXIST := 0;
          END;

          IF IS_EXIST = 0 THEN
              INSERT INTO XXP2P.XXP2P_SUPPLIER_SITES_OU (
                  USER_ID,
                  SITE_ID,
                  SHORT_CODE,
                  NAME, 
                  ORGANIZATION_ID,
                  CREATED_BY
              ) VALUES (
                  v_userid,
                  v_siteid,
                  v_scode,
                  v_name,
                  v_orgid,
                  v_userid
              );
              :MESSAGE := 'Operating Unit Added Successfully';
              :STATUS := 200;
          ELSIF IS_EXIST = 1 THEN 
              DELETE FROM XXP2P.XXP2P_SUPPLIER_SITES_OU
              WHERE USER_ID = v_userid AND SITE_ID = v_siteid AND ORGANIZATION_ID = v_orgid;
              :MESSAGE := 'Operating Unit Removed Successfully';
              :STATUS := 200;
          END IF;

          COMMIT;

          EXCEPTION
          WHEN OTHERS THEN
              :MESSAGE := SQLERRM;
              :STATUS := 500;
          END;
              `;
  return query;
};

let bankListBySite = async (USER_ID, SITE_ID) => {
  let query = `SELECT
    SB.USER_ID,
    SB.SITE_ID,
    SB.BANK_ID,
    SB.ACTIVE_STATUS,
    SB.CREATED_BY,
    SB.CREATION_DATE,
    SB.ID,
    BNK.BANK_NAME,
    BNK.BRANCH_NAME

FROM
    XXP2P.XXP2P_SUPPLIER_SITE_BANKS SB
LEFT JOIN XXP2P.XXP2P_SUPPLIER_BANK BNK ON    SB.BANK_ID = BNK.ID 
WHERE SB.USER_ID = :USER_ID
AND SB.SITE_ID = :SITE_ID
    
  `;
  return query;
};

let bankDeleteByID = async (ID) => {
  let query = `DELETE FROM XXP2P.XXP2P_SUPPLIER_SITE_BANKS
  WHERE ID = :ID
    
  `;
  return query;
};

let siteOUList = async (USER_ID, SITE_ID) => {
  let query = `SELECT 
    HOU.ORGANIZATION_ID,
    HOU.SHORT_CODE,
    HOU.NAME,
    CASE 
      WHEN SSO.USER_ID IS NOT NULL AND SSO.SITE_ID IS NOT NULL AND SSO.ORGANIZATION_ID IS NOT NULL 
      THEN 1 
      ELSE 0 
    END AS IS_ASSOCIATED
  FROM 
    XXP2P.XXP2P_USER US
  LEFT JOIN 
    HR_OPERATING_UNITS HOU 
  ON 
    HOU.BUSINESS_GROUP_ID = US.BUSINESS_GROUP_ID
  LEFT JOIN 
    XXP2P.XXP2P_SUPPLIER_SITES_OU SSO 
  ON 
    SSO.USER_ID = US.USER_ID 
    AND HOU.ORGANIZATION_ID = SSO.ORGANIZATION_ID
    AND SSO.SITE_ID = NVL(:SITE_ID, NULL)
  WHERE
    US.USER_ID = :USER_ID
  ORDER BY 
    HOU.ORGANIZATION_ID
  `;
  return query;
};

module.exports = {
  getList,
  getById,
  addNew,
  updateById,
  getDataByWhereCondition,
  siteOU,
  siteOUList,
  bankListBySite,
  bankDeleteByID,
};

//! OU List Without BG
/*
  `SELECT 
    HOU.ORGANIZATION_ID,
    HOU.SHORT_CODE,
    HOU.NAME,
    CASE WHEN SSO.USER_ID IS NOT NULL AND SSO.SITE_ID IS NOT NULL AND SSO.ORGANIZATION_ID IS NOT NULL THEN 1 ELSE 0 END AS IS_ASSOCIATED
  FROM 
    HR_OPERATING_UNITS HOU
  LEFT JOIN 
    XXP2P.XXP2P_SUPPLIER_SITES_OU SSO 
  ON 
    SSO.USER_ID = :USER_ID 
    AND HOU.ORGANIZATION_ID = SSO.ORGANIZATION_ID
    AND SSO.SITE_ID = NVL(:SITE_ID,null)
  ORDER BY 
    HOU.ORGANIZATION_ID`*/
