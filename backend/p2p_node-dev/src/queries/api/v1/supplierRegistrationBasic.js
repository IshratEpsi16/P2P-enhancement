const isEmpty = require("is-empty");
let table_name = "XXP2P_SUPPLIER_BSC_INFO";
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
  // console.log(query);

  return query;
};

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

  let query = `Select ${columns} from ${dbName}.${table_name} `;

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

let itemCategoryList = async () => {
  let query = `SELECT LOOKUP_CODE AS value, MEANING as label
    FROM FND_LOOKUP_VALUES_VL 
    WHERE LOOKUP_TYPE = 'VENDOR TYPE'
    AND   ENABLED_FLAG = 'Y'
    AND   TRUNC(SYSDATE) BETWEEN NVL(START_DATE_ACTIVE, 
    TRUNC(SYSDATE)) 
    AND NVL(END_DATE_ACTIVE, TRUNC(SYSDATE))`;
  return query;
};

let organizationTypeList = async () => {
  let query = `SELECT 
  LOOKUP_CODE AS VALUE,
  MEANING AS LABEL
  FROM FND_LOOKUP_VALUES_VL
  WHERE LOOKUP_TYPE = 'VENDOR TYPE'
  AND ENABLED_FLAG = 'Y'
  AND MEANING 
  IN ('Proprietorship','Partnership','Private Limited Company','Limited Company','Government','Others')
  ORDER BY 1 DESC`;
  return query;
};

module.exports = {
  getList,
  getById,
  addNew,
  updateById,
  getDataByWhereCondition,
  itemCategoryList,
  organizationTypeList,
};