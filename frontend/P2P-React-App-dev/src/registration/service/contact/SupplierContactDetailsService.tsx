




const SupplierContactDetailsService = async (token: string, contactId: number) => {
    const BASE_URL = process.env.REACT_APP_B;
    const url = `${BASE_URL}supplier-registration/contact/details`;

    const response = await fetch(url,
        {
            method: "POST",

            headers: {

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
            body: JSON.stringify({

                "id": contactId

            }),

        }
    );
    const data = await response.json();
    return {
        statusCode: response.status,
        data: data
    };


}
export default SupplierContactDetailsService