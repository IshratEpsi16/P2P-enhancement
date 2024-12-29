



const InvitationViewService = async (token: string, email: string) => {
    const BASE_URL = process.env.REACT_APP_B;
    const url = `${BASE_URL}invitation-view`;

    console.log('token', token);
    console.log('email', email);



    const response = await fetch(url,
        {
            method: "POST",

            headers: {

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
            body: JSON.stringify({

                "EMAIL": email,

            }),

        }
    );
    const data = await response.json();
    return {
        statusCode: response.status,
        data: data
    };


}
export default InvitationViewService
