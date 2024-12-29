




const ModuleListService = async (token: string) => {
    const BASE_URL = process.env.REACT_APP_B;
    const url = `${BASE_URL}approval-template/module/list`;




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
export default ModuleListService