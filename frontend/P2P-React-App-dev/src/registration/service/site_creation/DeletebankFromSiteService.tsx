




const DeleteBankFromSiteService = async (token: string, bankId:number) => {
    const BASE_URL = process.env.REACT_APP_B;
    const url = `${BASE_URL}supplier-registration/site-bank/delete`;

    const response = await fetch(url,
        {
            method: "POST",

            headers: {

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
            body: JSON.stringify({

                "ID": bankId,
                

            }),

        }
    );
    const data = await response.json();
    return {
        statusCode: response.status,
        data: data
    };


}
export default DeleteBankFromSiteService