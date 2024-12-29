




const EmployeeFromEbsService = async (token: string, empId: string, page: number, limit: number) => {
    const BASE_URL = process.env.REACT_APP_B;
    const url = `${BASE_URL}employee_from_ebs`;


    const response = await fetch(url,
        {
            method: "POST",

            headers: {

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
            body: JSON.stringify({

                "SEARCH_FIELD": empId ? empId : null,
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
export default EmployeeFromEbsService