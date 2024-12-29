


const RoleCreationService = async (token: string, roleName: string) => {
    const BASE_URL = process.env.REACT_APP_B;
    const url = `${BASE_URL}role-creation`;


    const response = await fetch(url,
        {
            method: "POST",

            headers: {

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
            body: JSON.stringify({

                "ROLE_NAME": roleName

            }),

        }
    );
    const data = await response.json();
    return {
        statusCode: response.status,
        data: data
    };


}
export default RoleCreationService