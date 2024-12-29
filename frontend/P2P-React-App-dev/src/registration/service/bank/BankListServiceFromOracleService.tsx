




const BankListFromOracleServiceService = async (token: string, countryCode: string) => {
    const BASE_URL = process.env.REACT_APP_B;
    const url = `${BASE_URL}common/bank-list`;

    const response = await fetch(url,
        {
            method: "POST",

            headers: {

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
            body: JSON.stringify({

                "COUNTRY_CODE": countryCode

            }),

        }
    );
    const data = await response.json();
    return {
        statusCode: response.status,
        data: data
    };


}
export default BankListFromOracleServiceService