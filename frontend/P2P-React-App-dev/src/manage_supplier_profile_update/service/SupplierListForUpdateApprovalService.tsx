


const SupplierListForUpdateProfileApprovalService = async (token: string,approvalStatus:string | '',searchKey:string | '') => {
    const BASE_URL = process.env.REACT_APP_B;
    const url = `${BASE_URL}supplier-approval/pending/profile-update-list`;

    console.log("status:", approvalStatus);


    const response = await fetch(url,
        {
            method: "POST",

            headers: {

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
            body: JSON.stringify({

                "APPROVAL_STATUS": approvalStatus,
                "SEARCH_VALUE":searchKey
              

            }),

        }
    );
    const data = await response.json();
    return {
        statusCode: response.status,
        data: data
    };


}
export default SupplierListForUpdateProfileApprovalService