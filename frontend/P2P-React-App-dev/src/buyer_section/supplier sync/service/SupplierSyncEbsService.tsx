const SupplierSyncEbsService = async (token: string, supplierId: string) => {
  const BASE_URL = process.env.REACT_APP_B;

  const url = `${BASE_URL}common/supplier-sync-from-ebs`;

  console.log("supplierId: ", supplierId);

  const response = await fetch(url,
      {
          method: "POST",

          headers: {

              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,

          },
          body: JSON.stringify({

              "SUPPLIER_ID": supplierId,

          }),

      }
  );
  const data = await response.json();
  return {
      statusCode: response.status,
      data: data
  };


}
export default SupplierSyncEbsService;