




const ApproverAddUpdateService = async (token: string,approverSequenceId:number | null,templateId:number,employeeId:number,stageLevel:number,stageSequence:number,isMustApprove:number,status:number) => {
    const BASE_URL = process.env.REACT_APP_B;
    const url = `${BASE_URL}approval-template/template/stage-approver-add-update`;




    const response = await fetch(url,
        {
            method: "POST",

            headers: {

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
            body: JSON.stringify({

                "ID": approverSequenceId,
                "STAGE_ID": templateId, //template id
                "EMPLOYEE_ID": employeeId,
                "STAGE_LEVEL": stageLevel,
                "STAGE_SEQ": stageSequence,
                "IS_MUST_APPROVE": isMustApprove,
                "STATUS": status

            }),

        }
    );
    const data = await response.json();
    return {
        statusCode: response.status,
        data: data
    };


}
export default ApproverAddUpdateService