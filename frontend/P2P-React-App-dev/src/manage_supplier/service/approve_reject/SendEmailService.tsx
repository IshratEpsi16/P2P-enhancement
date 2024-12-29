


const SendEmailService = async (token: string,EMAIL:string,NAME:string,SUBJECT:string,BODY:string) => {
    const BASE_URL = process.env.REACT_APP_B;
    const url = `${BASE_URL}common/email-send`;


    const response = await fetch(url,
        {
            method: "POST",

            headers: {

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
            body: JSON.stringify({

                "EMAIL":EMAIL,
                "NAME":NAME,
                "SUBJECT":SUBJECT,
                "BODY": BODY
          
              

            }),

        }
    );
    const data = await response.json();
    return {
        statusCode: response.status,
        data: data
    };


}
export default SendEmailService