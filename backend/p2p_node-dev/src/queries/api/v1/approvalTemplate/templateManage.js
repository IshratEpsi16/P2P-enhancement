const isEmpty = require("is-empty");

let approvalModuleList = async () => {
  let query = `SELECT
  *
  FROM
    XXP2P.XXP2P_APPROVAL_MODULE`;
  return query;
};

let checkNameExist = async (data) => {
 //console.log(data);
 let whereParams = {};
 let whereClause = "WHERE 1=1";

 // Construct the WHERE clause dynamically based on the provided data
 if (!isEmpty(data.APPROVAL_STAGE_NAME)) {
   whereClause += ` AND APPROVAL_STAGE_NAME = NVL(:APPROVAL_STAGE_NAME, APPROVAL_STAGE_NAME)`;
   whereParams.APPROVAL_STAGE_NAME = `${data.APPROVAL_STAGE_NAME}`;
 }
 if (!isEmpty(data.ORG_ID)) {
   whereClause += ` AND ORG_ID = NVL(:ORG_ID, ORG_ID)`;
   whereParams.ORG_ID = `${data.ORG_ID}`;
 }
 if (!isEmpty(data.APPROVAL_FLOW_TYPE)) {
   whereClause += ` AND upper(APPROVAL_FLOW_TYPE) = NVL(upper(:APPROVAL_FLOW_TYPE), APPROVAL_FLOW_TYPE)`;
   whereParams.APPROVAL_FLOW_TYPE = `${data.APPROVAL_FLOW_TYPE}`;
 }
 if (!isEmpty(data.BUYER_DEPARTMENT)) {
   whereClause += ` AND upper(BUYER_DEPARTMENT) = NVL(upper(:BUYER_DEPARTMENT), BUYER_DEPARTMENT)`;
   whereParams.BUYER_DEPARTMENT = `${data.BUYER_DEPARTMENT}`;
 }
 if (!isEmpty(data.MODULE_TYPE_ID)) {
  whereClause += ` AND upper(MODULE_TYPE_ID) = NVL(upper(:MODULE_TYPE_ID), MODULE_TYPE_ID)`;
  whereParams.MODULE_TYPE_ID = `${data.MODULE_TYPE_ID}`;
}
 if (!isEmpty(data.MIN_AMOUNT)) {
   whereClause += ` AND MIN_AMOUNT<= :MIN_AMOUNT`;
   whereParams.MIN_AMOUNT = `${data.MIN_AMOUNT}`;
 }
 if (!isEmpty(data.MIN_AMOUNT)) {
  whereClause += ` AND MAX_AMOUNT>= :MAX_AMOUNT`;
  whereParams.MAX_AMOUNT = `${data.MAX_AMOUNT}`;
}

 // Construct the select query string
 let query = `SELECT AS_ID 
   FROM XXP2P.XXP2P_APPROVAL_STAGES
   ${whereClause}`;
 console.log("Query: ", query);

 // Return the query string and params for testing purposes
 return { query, whereParams };
};

let templateCreate = async (data = {}) => {
  let keys = Object.keys(data);

  let query = `insert into XXP2P.XXP2P_APPROVAL_STAGES (` + keys[0];
  let valueString = " ( :1";

  for (let i = 1; i < keys.length; i++) {
    query += `, ` + keys[i];
    valueString += `, :${i + 1}`;
  }

  query =
    query +
    `) VALUES ` +
    valueString +
    `) RETURNING AS_ID INTO :${keys.length + 1}`;
  console.log(query);
  return query;
};

/* let templateCreate = async (finalData) => {
    let query = `
    DECLARE
    IS_EXIST NUMBER := 0; -- Initialize IS_EXIST
    Z_TEMPLATE_ID NUMBER;
    IS_NAME_EXIST NUMBER; -- Add a variable to check if the ROLE_NAME already exists
  BEGIN
    -- Check if the ROLE_NAME already exists
    SELECT COUNT(*) INTO IS_NAME_EXIST
    FROM XXP2P.XXP2P_APPROVAL_STAGES
    WHERE LOWER(APPROVAL_STAGE_NAME) = LOWER(:APPROVAL_STAGE_NAME);

    IF IS_NAME_EXIST > 0 THEN
        :MESSAGE := 'The Name Already Exists!';
        :STATUS := 200;
    ELSE
        INSERT INTO XXP2P.XXP2P_APPROVAL_STAGES (
          APPROVAL_STAGE_NAME,
          MODULE_TYPE_ID,
          CREATED_BY,
          CAN_DELETE
          ) VALUES (
              :APPROVAL_STAGE_NAME,
              :MODULE_ID,
              :CREATED_BY,
              1
          ) RETURNING AS_ID INTO Z_TEMPLATE_ID;
        COMMIT;

        :MESSAGE := 'New Template Created';
        :TEMPLATE_ID := Z_TEMPLATE_ID;
        :STATUS := 200;
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
        :MESSAGE := 'An error occurred: ' || SQLERRM;
        :STATUS := 401;
  END;
  `;
    return query;
  };
*/

let templateUpdate = async (updateData, whereData) => {
  let updateClause = "";
  let whereClause = "";
  let updateParams = [];
  let whereParams = [];

  // Construct the SET clause based on the properties of updateData
  if (updateData != null && Object.keys(updateData).length > 0) {
    let updates = [];
    Object.keys(updateData).forEach((key) => {
      let value = updateData[key];

      if (value instanceof Date) {
        // If the value matches the date format, parse it into a Date object
        //value = new Date(value);
        // Convert the parsed Date object to the desired string format
        value = formatDate(value);
        console.log(value);
        value = value;
      } else {
        // If it's not a date, keep the original value
        value = `'${value}'`;
      }
      updates.push(`${key} = ${value}`);
      updateParams.push(value);
    });
    updateClause = "SET " + updates.join(", ");
  }

  // Construct the WHERE clause based on the properties of whereData
  if (whereData != null && Object.keys(whereData).length > 0) {
    let conditions = [];
    Object.keys(whereData).forEach((key) => {
      conditions.push(`${key} = ${whereData[key]}`); // Use NVL to handle null values
      whereParams.push(whereData[key]);
    });
    whereClause = "WHERE " + conditions.join(" AND ");
  }

  // Construct the update query string
  let query = `UPDATE XXP2P.XXP2P_APPROVAL_STAGES ${updateClause} ${whereClause}`;

  console.log(query);
  //console.log("Update Params:", updateParams);
  //console.log("Where Params:", whereParams);

  // Here, you would execute the update query with the updateParams and whereParams
  // For example:
  // await connection.execute(query, [...updateParams, ...whereParams]);

  // Return the query string for testing purposes
  return query;
};

/*
let templateUpdate = async (userId, APPROVAL_STAGE_NAME, ID) => {
  let query = `
    DECLARE
    v_row_count NUMBER;
 
 BEGIN
    -- Update statement with a WHERE clause
    UPDATE XXP2P.XXP2P_APPROVAL_STAGES 
    SET APPROVAL_STAGE_NAME = :APPROVAL_STAGE_NAME,
        LAST_UPDATE_BY = :userId
    WHERE AS_ID = :ID;
 
    -- Store the SQL%ROWCOUNT value in a variable
    v_row_count := SQL%ROWCOUNT;
 
    -- Check if any rows were updated
    IF v_row_count > 0 THEN
       -- Set success message and status
       :MESSAGE := 'Updated Successfully';
       :STATUS := 200;
    ELSE
       -- No rows were updated
       :MESSAGE := 'No rows updated';
       :STATUS := 400;
    END IF;
 
    -- Commit after checking the row count
    COMMIT;
 
 EXCEPTION
    WHEN OTHERS THEN
       -- Handle exceptions
       :MESSAGE := 'An error occurred: ' || SQLERRM;
       :STATUS := 401;
 END;
  `;
  return query;
};*/

let templateList = async () => {
  let query = `SELECT
    *
  FROM
    XXP2P.XXP2P_APPROVAL_STAGES
    ORDER BY CREATION_DATE DESC`;
  return query;
};

let templateDelete = async (TEMPLATE_ID) => {
  let query = `
    DECLARE
    IS_NAME_EXIST NUMBER;
    BEGIN
    
          SELECT COUNT(*) INTO IS_NAME_EXIST
          FROM XXP2P.XXP2P_APPROVAL_STAGES
          WHERE AS_ID = :TEMPLATE_ID;
      
          IF IS_NAME_EXIST > 0 THEN
          DELETE FROM XXP2P.XXP2P_STAGE_APPROVERS where STAGE_ID = :TEMPLATE_ID; 
        DELETE FROM XXP2P.XXP2P_APPROVAL_STAGES where AS_ID = :TEMPLATE_ID;
        COMMIT;
        :MESSAGE := 'Deleted Successfully';
        :STATUS := 200;
              
        ELSE
          :MESSAGE := 'Template Not Exists!';
          :STATUS := 200;
        
        END IF;
      EXCEPTION
          WHEN OTHERS THEN
              :MESSAGE := 'An error occurred: ' || SQLERRM;
              :STATUS := 401;
      END;`;
  return query;
};

let templateDetails = async (ID) => {
  let query = `
    SELECT
    XAS.*,
    US.FULL_NAME AS CREATED_BY_FULL_NAME,
    US.USER_NAME AS CREATED_BY_USER_NAME,
    XAS.CREATION_DATE,
    XAS.LAST_UPDATE_BY,
    XAS.LAST_UPDATE_DATE,
    XAS.CAN_DELETE
  FROM
    XXP2P.XXP2P_APPROVAL_STAGES XAS, XXP2P.XXP2P_USER US
  WHERE  XAS.AS_ID = :ID
  AND US.USER_ID = XAS.CREATED_BY`;
  return query;
};

let anyTemplateIDFind = async (data) => {
  //console.log(data);
  let whereParams = {};
  let whereClause = "WHERE 1=1";

  // Construct the WHERE clause dynamically based on the provided data
  if (!isEmpty(data.MODULE_NAME)) {
    whereClause += ` AND AM.MODULE_NAME = NVL(:MODULE_NAME, MODULE_NAME)`;
    whereParams.MODULE_NAME = `${data.MODULE_NAME}`;
  }
  if (!isEmpty(data.ORG_ID)) {
    whereClause += ` AND APS.ORG_ID = NVL(:ORG_ID, ORG_ID)`;
    whereParams.ORG_ID = `${data.ORG_ID}`;
  }
  if (!isEmpty(data.APPROVAL_FLOW_TYPE)) {
    whereClause += ` AND upper(APS.APPROVAL_FLOW_TYPE) = NVL(upper(:APPROVAL_FLOW_TYPE), APPROVAL_FLOW_TYPE)`;
    whereParams.APPROVAL_FLOW_TYPE = `${data.APPROVAL_FLOW_TYPE}`;
  }
  if (!isEmpty(data.BUYER_DEPARTMENT)) {
    whereClause += ` AND upper(APS.BUYER_DEPARTMENT) = NVL(upper(:BUYER_DEPARTMENT), BUYER_DEPARTMENT)`;
    whereParams.BUYER_DEPARTMENT = `${data.BUYER_DEPARTMENT}`;
  }
  if (!isEmpty(data.AMOUNT)) {
    whereClause += ` AND :AMOUNT BETWEEN APS.MIN_AMOUNT AND APS.MAX_AMOUNT`;
    whereParams.AMOUNT = `${data.AMOUNT}`;
  }

  // Construct the select query string
  let query = `SELECT APS.AS_ID 
    FROM XXP2P.XXP2P_APPROVAL_STAGES APS
    JOIN XXP2P.XXP2P_APPROVAL_MODULE AM ON APS.MODULE_TYPE_ID = AM.MODULE_ID
    ${whereClause}`;
  console.log("Query: ", query);

  // Return the query string and params for testing purposes
  return { query, whereParams };
};

module.exports = {
  approvalModuleList,
  templateCreate,
  templateList,
  templateDelete,
  templateDetails,
  templateUpdate,
  checkNameExist,
  anyTemplateIDFind,
};
