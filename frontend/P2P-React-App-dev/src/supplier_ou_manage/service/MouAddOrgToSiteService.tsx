import { OrganizationInterface } from "../../role_access/interface/OrganizationInterface";






const MouAddOrgToSiteService = async (token: string,supplierId:number,siteId:number | null,org:OrganizationInterface) => {
    const BASE_URL = process.env.REACT_APP_B;
    const url = `${BASE_URL}supplier-registration/site-creation/site-ou-by-approver`;

    console.log(org);
    




    const response = await fetch(url,
        {
            method: "POST",

            headers: {

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
            body: JSON.stringify({
                "SUPPLIER_ID":supplierId,
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
export default MouAddOrgToSiteService