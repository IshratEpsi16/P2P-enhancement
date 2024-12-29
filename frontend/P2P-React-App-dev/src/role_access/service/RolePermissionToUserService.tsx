


const RolePermissionToUserRoleService = async (token: string, roleId: number, userId: number,) => {
    const BASE_URL = process.env.REACT_APP_B;
    const url = `${BASE_URL}role-permission-to-user`;
    // console.log(page);



    const response = await fetch(url,
        {
            method: "POST",

            headers: {

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
            body: JSON.stringify({

                "ROLE_ID": roleId,
                "USER_ID": userId

            }),

        }
    );
    const data = await response.json();
    return {
        statusCode: response.status,
        data: data
    };


}
export default RolePermissionToUserRoleService