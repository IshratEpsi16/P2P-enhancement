




const DeleteApproverSequenceService = async (token: string,sequenceId:number) => {
    const BASE_URL = process.env.REACT_APP_B;
    const url = `${BASE_URL}approval-template/template/approver-remove`;

    console.log(sequenceId);
    




    const response = await fetch(url,
        {
            method: "POST",

            headers: {

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
            body: JSON.stringify({

                "ID": sequenceId

            }),

        }
    );
    const data = await response.json();
    return {
        statusCode: response.status,
        data: data
    };


}
export default DeleteApproverSequenceService