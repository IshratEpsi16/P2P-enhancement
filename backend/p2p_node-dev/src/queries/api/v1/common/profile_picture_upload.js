let table_name = "XXP2P.XXP2P_USER";
let dbName = process.env.DATABASE_NAME

let checkUser = async (USER_ID) => {
  let query = 
  `
    SELECT 
    USER_ID,
    PROPIC_FILE_NAME,
    PROPIC_ORG_FILE_NAME
    FROM
    XXP2P.XXP2P_USER
    WHERE USER_ID = :USER_ID
  `;
  return query;
};


let updateById = async (data) => {
    let keys = Object.keys(data);
    let flag = 0;
  
    let query = `update ${dbName}.${table_name} set ` + keys[0] + ` = :${flag++}`;
  
    for (let i = 1; i < keys.length; i++, flag++) {
      query += `, ` + keys[i] + ` = :${flag}`;
    }
  
    query += ` where USER_ID = :${flag}`;
    console.log(`Q= ${query}`);
    return query;
  };

  let updateProfilePic = async (data = {}) => {
    let keys = Object.keys(data);
  
    // Ensure that USER_ID, PROPIC_FILE_NAME, and PROPIC_ORG_FILE_NAME are provided
    if (!keys.includes('USER_ID') || !keys.includes('PROPIC_FILE_NAME') || !keys.includes('PROPIC_ORG_FILE_NAME')) {
      throw new Error('USER_ID, PROPIC_FILE_NAME, and PROPIC_ORG_FILE_NAME are required fields.');
    }
  
    let setClause = keys.map((key, index) => `${key} = :${index + 1}`).join(', ');
  
    let query = `
      DECLARE
        BEGIN
          UPDATE XXP2P.XXP2P_USER
          SET ${setClause}
          WHERE USER_ID = :${keys.indexOf('USER_ID') + 1};
          COMMIT;
        END;
    `;
  
    //console.log(query);
    return query;
  };
  
  module.exports = {
    updateById,
    updateProfilePic,
    checkUser
};
