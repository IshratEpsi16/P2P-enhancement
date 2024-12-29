


const SupplierProfileUpdateDetailsService = async (token: string,STAGE_ID:number,STAGE_LEVEL:number,SUPPLIER_ID:number,approverStatus:string) => {
    const BASE_URL = process.env.REACT_APP_B;
    const url = `${BASE_URL}supplier-approval/pending/details`;

    console.log("stage: ", STAGE_ID);
    console.log("stage: ", STAGE_LEVEL);
    console.log("stage: ", SUPPLIER_ID);
    console.log("stage: ", approverStatus);


    const response = await fetch(url,
        {
            method: "POST",

            headers: {

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
            body: JSON.stringify({

                "STAGE_ID": STAGE_ID,
                "STAGE_LEVEL": STAGE_LEVEL,
                "SUPPLIER_ID": SUPPLIER_ID,
                "APPROVER_STATUS":approverStatus
              

            }),

        }
    );
    const data = await response.json();
    return {
        statusCode: response.status,
        data: data
    };


}
export default SupplierProfileUpdateDetailsService