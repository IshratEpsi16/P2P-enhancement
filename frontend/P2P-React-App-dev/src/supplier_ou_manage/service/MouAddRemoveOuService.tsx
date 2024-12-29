


const MouAddRemoveService = async (token: string,siteId:number,orgId:number,actionCode:number,note:string) => {
    const BASE_URL = process.env.REACT_APP_B;
    const url = `${BASE_URL}supplier-site-ou-manage/history/add`;


    const response = await fetch(url,
        {
            method: "POST",

            headers: {

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
            body: JSON.stringify({

                "SITE_ID": siteId,
    "ORGANIZATION_ID": orgId,
    "ACTION_CODE": actionCode,
    "NOTE": note
              

            }),

        }
    );
    const data = await response.json();
    return {
        statusCode: response.status,
        data: data
    };


}
export default MouAddRemoveService