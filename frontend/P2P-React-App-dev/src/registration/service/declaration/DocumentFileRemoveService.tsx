


const DocumentFileRemoveService = async (token: string, tableName: string, columnName:string, orgColumnName: string, fileName: string, typeCode: string) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}common/file-remove`;

  console.log("file: ", fileName);
  console.log("token: ", token);


  const response = await fetch(url,
    {
      method: "POST",

          headers: {

              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,

          },
          body: JSON.stringify({

              "TABLE_NAME": tableName,
              "COLUMN_NAME": columnName,
              "ORG_COLUMN_NAME": orgColumnName,
              "FILE_NAME": fileName,
              "FILE_TYPE_CODE": typeCode
          }),

      }
  );
  const data = await response.json();
  return {
      statusCode: response.status,
      data: data
  };


}
export default DocumentFileRemoveService