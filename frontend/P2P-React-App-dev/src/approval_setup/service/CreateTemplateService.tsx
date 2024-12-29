




const CreateTemplateService = async (token: string, templateName:string, moduleId:string | null, templateId:number | null, flowType: string, buyerDept: string, currencyCode: string, currencyName: string, orgId: string, orgName: string,
    minAmount: string, maxAmount: string
) => {
    const BASE_URL = process.env.REACT_APP_B;
    const url = `${BASE_URL}approval-template/template/create`;
    // const url = "";

    console.log("template: ", templateName);
    console.log("modId: ", moduleId);
    console.log("tempId: ", templateId);
    console.log("flowType: ", flowType);
    console.log("dept: ", buyerDept);
    console.log("currencyCode: ", currencyCode);
    console.log("currencyName: ", currencyName);
    console.log("orgId: ", orgId);
    console.log("orgName: ", orgName);
    console.log("minAmount: ", minAmount);
    console.log("maxAmount: ", maxAmount);



    const response = await fetch(url,
        {
            method: "POST",

            headers: {

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
            body: JSON.stringify({

                "TEMPLATE_NAME":templateName,
                "MODULE_ID":moduleId,
                "ID": templateId,
                "APPROVAL_FLOW_TYPE": flowType,
                'BUYER_DEPARTMENT': buyerDept,
                "CURRENCY_CODE": currencyCode,
                "CURRENCY_NAME": currencyName,
                "ORG_ID": orgId,
                "ORG_NAME": orgName,
                "MIN_AMOUNT": minAmount,
                "MAX_AMOUNT": maxAmount

            }),

        }
    );
    const data = await response.json();
    return {
        statusCode: response.status,
        data: data
    };


}
export default CreateTemplateService