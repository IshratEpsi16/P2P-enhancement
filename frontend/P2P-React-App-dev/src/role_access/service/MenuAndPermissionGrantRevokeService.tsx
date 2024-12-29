


const MenuAndPermissionGrantRevokeService = async (token: string, roleId: number | null, menuId: number | null, permissionId: number | null) => {
    const BASE_URL = process.env.REACT_APP_B;
    const url = `${BASE_URL}role-menu-per-access`;
    console.log(`roleId: ${roleId}`);
    console.log(`menuId: ${menuId}`);
    console.log(`permissionId: ${permissionId}`);



    const response = await fetch(url,
        {
            method: "POST",

            headers: {

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
            body: JSON.stringify({

                "ROLE_ID": roleId,
                "MENU_ID": menuId,
                "PERMISSION_ID": permissionId

            }),

        }
    );
    const data = await response.json();
    return {
        statusCode: response.status,
        data: data
    };


}
export default MenuAndPermissionGrantRevokeService