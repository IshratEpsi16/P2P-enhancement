//OraganizationInsertDeleteToUserService




const RfiSupplierListService = async (token: string, INITIATOR_ID: number | null, VIEWER_ID: number | null, VIEWER_ACTION: number | null, OBJECT_ID: number | null) => {
    const BASE_URL = process.env.REACT_APP_B;
    const url = `${BASE_URL}rfi/list`;


    const response = await fetch(url,
        {
            method: "POST",

            headers: {

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
            body: JSON.stringify({

                "INITIATOR_ID": INITIATOR_ID, // 
    "VIEWER_ID": VIEWER_ID, // 
    "VIEWER_ACTION": VIEWER_ACTION, //
    "OBJECT_ID": OBJECT_ID// Object or Supplier ID

            }),

        }
    );
    const data = await response.json();
    return {
        statusCode: response.status,
        data: data
    };


}
export default RfiSupplierListService