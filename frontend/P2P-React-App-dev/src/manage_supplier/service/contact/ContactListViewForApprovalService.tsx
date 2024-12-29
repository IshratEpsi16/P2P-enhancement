


const ContactListViewForApprovalService = async (token: string,userId:number) => {
    const BASE_URL = process.env.REACT_APP_B;
    const url = `${BASE_URL}supplier-approval/contact/list`;


    const response = await fetch(url,
        {
            method: "POST",

            headers: {

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
            body: JSON.stringify({

                "USER_ID":userId
              

            }),

        }
    );
    const data = await response.json();
    return {
        statusCode: response.status,
        data: data
    };


}
export default ContactListViewForApprovalService