




const EmployeeListService = async (token: string) => {
    const BASE_URL = process.env.REACT_APP_B;
    const url = `${BASE_URL}common/employees`;




    const response = await fetch(url,
        {
            method: "GET",

            headers: {

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
            // body: JSON.stringify({

            //     "DEVICE": "WEB",

            // }),

        }
    );
    const data = await response.json();
    return {
        statusCode: response.status,
        data: data
    };


}
export default EmployeeListService