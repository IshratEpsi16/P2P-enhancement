import { OrganizationInterface } from "../../../role_access/interface/OrganizationInterface";





const AddOrgToSiteService = async (token: string,siteId:number | null,org:OrganizationInterface) => {
    const BASE_URL = process.env.REACT_APP_B;
    const url = `${BASE_URL}supplier-registration/site-creation/site-ou`;

    console.log(org);
    




    const response = await fetch(url,
        {
            method: "POST",

            headers: {

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
            body: JSON.stringify({

                "SITE_ID": siteId,
                "SHORT_CODE": org.SHORT_CODE,
                "NAME": org.NAME,
                "ORGANIZATION_ID": org.ORGANIZATION_ID

            }),

        }
    );
    const data = await response.json();
    return {
        statusCode: response.status,
        data: data
    };


}
export default AddOrgToSiteService