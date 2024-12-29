
const AddRfqPayablePurchasingService = async (token: string, id: number ,  rfq: string, payable: string, purchasing: string) => {
    const BASE_URL = process.env.REACT_APP_B;
    const url = `${BASE_URL}supplier-approval/site-creation/site-rfq-payable-purchase-selection`;

    console.log(id, rfq, payable, purchasing);

    let decode;
    
        decode = JSON.stringify({
            "ID": id,
            "RFQ": rfq,
            "PAYABLE": payable,
            "PURCHASING": purchasing
        });
    

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: decode,
    });

    const data = await response.json();
    return {
        statusCode: response.status,
        data: data
    };
}

export default AddRfqPayablePurchasingService;
