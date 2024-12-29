


const SiteOrgViewForApprovalService = async (token: string,userId:number,siteId:number) => {
    const BASE_URL = process.env.REACT_APP_B;
    const url = `${BASE_URL}supplier-approval/site-creation/site-ou-list`;


    const response = await fetch(url,
        {
            method: "POST",

            headers: {

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
            body: JSON.stringify({

                "USER_ID":userId,
                "SITE_ID": siteId
              

            }),

        }
    );
    const data = await response.json();
    return {
        statusCode: response.status,
        data: data
    };


}
export default SiteOrgViewForApprovalService