const isEmpty = require("is-empty");
let dbName = process.env.DATABASE_NAME;
/*let empInsert = async (
  userId,
  USER_NAME,
  EMPLOYEE_ID,
  FULL_NAME,
  START_DATE,
  END_DATE,
  BUYER_ID,
  EMAIL_ADDRESS,
  BUSINESS_GROUP_ID,
  USER_PASSWORD
) => {
  console.log(USER_PASSWORD);
  console.log(BUSINESS_GROUP_ID);
  let query = `
  DECLARE
  Z_USER_NAME XXP2P.XXP2P_USER.USER_NAME%TYPE := :USER_NAME;
  Z_EMPLOYEE_ID XXP2P.XXP2P_USER.EMPLOYEE_ID%TYPE := :EMPLOYEE_ID;
  Z_FULL_NAME XXP2P.XXP2P_USER.FULL_NAME%TYPE := :FULL_NAME;
  Z_START_DATE XXP2P.XXP2P_USER.START_DATE%TYPE := TO_DATE(:START_DATE,'YYYY-MM-DD');
  Z_END_DATE XXP2P.XXP2P_USER.END_DATE%TYPE := TO_DATE(:END_DATE,'YYYY-MM-DD');
  Z_BUYER_ID XXP2P.XXP2P_USER.BUYER_ID%TYPE := :BUYER_ID;
  Z_EMAIL_ADDRESS XXP2P.XXP2P_USER.EMAIL_ADDRESS%TYPE := :EMAIL_ADDRESS;
  Z_BUSINESS_GROUP_ID XXP2P.XXP2P_USER.BUSINESS_GROUP_ID%TYPE := :BUSINESS_GROUP_ID;
  Z_USER_PASSWORD XXP2P.XXP2P_USER.USER_PASSWORD%TYPE := :USER_PASSWORD;
  IS_USER_EXIST NUMBER;
  Z_USER_TYPE XXP2P.XXP2P_USER.USER_TYPE%TYPE;
  NEW_USER_ID NUMBER;

BEGIN
  SELECT COUNT(*)
  INTO IS_USER_EXIST
  FROM XXP2P.XXP2P_USER
  WHERE EMPLOYEE_ID = Z_EMPLOYEE_ID;
  
  IF IS_USER_EXIST > 0 THEN
      UPDATE XXP2P.XXP2P_USER
      SET
          USER_NAME = Z_USER_NAME,
          FULL_NAME = Z_FULL_NAME,
          START_DATE = Z_START_DATE,
          END_DATE = Z_END_DATE,
          EMAIL_ADDRESS = Z_EMAIL_ADDRESS,
          BUSINESS_GROUP_ID = Z_BUSINESS_GROUP_ID,
          LAST_UPDATED_BY = :userId
      WHERE EMPLOYEE_ID = Z_EMPLOYEE_ID;
      :MESSAGE := 'User Updated Successfully';
      :STATUS := 200;

  ELSE
      IF Z_BUYER_ID IS NOT NULL THEN
          Z_USER_TYPE := 'Buyer';
      END IF;
      
      

      -- Insert a new record
      INSERT INTO XXP2P.XXP2P_USER
      (
          USER_NAME,
          USER_PASSWORD,
          EMPLOYEE_ID,
          FULL_NAME,
          USER_TYPE,
          APPROVAL_STATUS,
          USER_ACTIVE_STATUS,
          IS_NEW_USER,
          START_DATE,
          END_DATE,
          CREATED_BY,
          BUYER_ID,
          EMAIL_ADDRESS,
          BUSINESS_GROUP_ID
      )
      VALUES
      (
          Z_USER_NAME,
          Z_USER_PASSWORD,
          Z_EMPLOYEE_ID,
          Z_FULL_NAME,
          NVL(Z_USER_TYPE, NULL),
          'APPROVED',
          0,
          1,
          NVL(Z_START_DATE,null),
          NVL(Z_END_DATE,null),
          :userId,
          Z_BUYER_ID,
          Z_EMAIL_ADDRESS,
          Z_BUSINESS_GROUP_ID
      ) RETURNING USER_ID INTO NEW_USER_ID;
      INSERT INTO XXP2P.XXP2P_USER_ROLES (ROLE_ID, USER_ID,CREATED_BY)
                VALUES (201, NEW_USER_ID, :userId);
      
      COMMIT;
      :MESSAGE := 'User Synced Successfully';
      :STATUS := 201;
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
*/
let empInsert = async (data = {}) => {
  let keys = Object.keys(data);

  let query = `insert into ${dbName}.xxp2p_user (` + keys[0];
  let valueString = " ( :1";

  for (let i = 1; i < keys.length; i++) {
    query += `, ` + keys[i];
    valueString += `, :${i + 1}`;
  }

  query =
    query +
    `) VALUES ` +
    valueString +
    `) RETURNING user_id INTO :${keys.length + 1}`;
  console.log(query);
  return query;
};

let update = async (updateData, whereData) => {
  let updateClause = "";
  let whereClause = "";
  let updateParams = [];
  let whereParams = [];

  // Construct the SET clause based on the properties of updateData
  if (updateData != null && Object.keys(updateData).length > 0) {
    let updates = [];
    // Object.keys(updateData).forEach((key) => {
    //   updates.push(`${key} = '${updateData[key]}'`); // Use NVL to handle null values
    //   updateParams.push(updateData[key]);
    // });
    Object.keys(updateData).forEach((key) => {
      let value = updateData[key];
      if (
        typeof value === "string" &&
        value.match(/^\d{2}\/[a-zA-Z]{3}\/\d{4} \d{2}:\d{2}:\d{2}$/)
      ) {
        // If the value matches the date format, parse it into a Date object
        value = new Date(value);
        // Convert the parsed Date object to the desired string format
        value = `TO_DATE('${value
          .toISOString()
          .slice(0, 19)}', 'YYYY-MM-DD"T"HH24:MI:SS')`;
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
  let query = `UPDATE ${dbName}.xxp2p_user ${updateClause} ${whereClause}`;

  console.log(query);
  console.log("Update Params:", updateParams);
  console.log("Where Params:", whereParams);

  // Here, you would execute the update query with the updateParams and whereParams
  // For example:
  // await connection.execute(query, [...updateParams, ...whereParams]);

  // Return the query string for testing purposes
  return query;
};




let findUser = async (BUYER_ID) => {
  let query = `
  SELECT user_id 
      FROM xxp2p.xxp2p_user 
      WHERE BUYER_ID = ${BUYER_ID}`;
console.log(query);
  return query;
};

module.exports = {
  empInsert,
  findUser,
  update,
};
