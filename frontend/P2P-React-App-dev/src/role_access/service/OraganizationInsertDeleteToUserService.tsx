//OraganizationInsertDeleteToUserService




const OraganizationInsertDeleteToUserService = async (token: string, userId: number, orgId: number, shortCode: string, name: string) => {
    const BASE_URL = process.env.REACT_APP_B;
    const url = `${BASE_URL}insert-delete-org`;


    const response = await fetch(url,
        {
            method: "POST",

            headers: {

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
            body: JSON.stringify({

                "USER_ID": userId,
                "ORGANIZATION_ID": orgId,
                "SHORT_CODE": shortCode,
                "NAME": name

            }),

        }
    );
    const data = await response.json();
    return {
        statusCode: response.status,
        data: data
    };


}
export default OraganizationInsertDeleteToUserService