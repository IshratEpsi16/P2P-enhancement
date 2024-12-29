




const ApproverSequenceListService = async (token: string,templateId:number) => {
    const BASE_URL = process.env.REACT_APP_B;
    const url = `${BASE_URL}approval-template/template/approver-list`;

    console.log(templateId);
    




    const response = await fetch(url,
        {
            method: "POST",

            headers: {

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
            body: JSON.stringify({

                "STAGE_ID": templateId

            }),

        }
    );
    const data = await response.json();
    return {
        statusCode: response.status,
        data: data
    };


}
export default ApproverSequenceListService