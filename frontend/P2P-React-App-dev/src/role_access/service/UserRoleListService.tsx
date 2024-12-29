


const UserRoleListService = async (token: string, page: number, limit: number, searchValue: string) => {
    const BASE_URL = process.env.REACT_APP_B;
    const url = `${BASE_URL}user-role-list`;
    console.log(page);
    console.log(limit);


    const response = await fetch(url,
        {
            method: "POST",

            headers: {

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
            body: JSON.stringify({

                "SEARCH_VALUE": searchValue,
                "P_OFFSET": page,
                "P_LIMIT": limit

            }),

        }
    );
    const data = await response.json();
    return {
        statusCode: response.status,
        data: data
    };


}
export default UserRoleListService