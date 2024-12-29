

const SendInvitationService = async (token: string, name: string, email: string, type: string | '',mobileNumber:string,bgId:number) => {
    const BASE_URL = process.env.REACT_APP_B;
    const url = `${BASE_URL}supplier-invite`;


    const response = await fetch(url,
        {
            method: "POST",

            headers: {

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
            body: JSON.stringify({

                "NAME": name,
                "EMAIL": email,
                "TYPE": type,
                "MOBILE_NUMBER": mobileNumber,
                "BUSINESS_GROUP_ID":bgId
            }),

        }
    );
    const data = await response.json();
    return {
        statusCode: response.status,
        data: data
    };


}
export default SendInvitationService
