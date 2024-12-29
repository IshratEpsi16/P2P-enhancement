


const DeleteRoleService = async (token: string, roleId: number) => {
    const BASE_URL = process.env.REACT_APP_B;
    const url = `${BASE_URL}role-deletion`;


    const response = await fetch(url,
        {
            method: "POST",

            headers: {

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
            body: JSON.stringify({

                "ROLE_ID": roleId

            }),

        }
    );
    const data = await response.json();
    return {
        statusCode: response.status,
        data: data
    };


}
export default DeleteRoleService