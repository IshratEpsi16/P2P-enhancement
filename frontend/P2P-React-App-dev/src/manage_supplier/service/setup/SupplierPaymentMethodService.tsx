



const SupplierPaymentMethodService = async (token: string,supplierId:number) => {
    const BASE_URL = process.env.REACT_APP_B;
    const url = `${BASE_URL}payment-methods/suppliers-payment-method`;


    const response = await fetch(url,
        {
            method: "POST",

            headers: {

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
            body: JSON.stringify({

                "SUPPLIER_ID": supplierId
              

            }),

        }
    );
    const data = await response.json();
    return {
        statusCode: response.status,
        data: data
    };


}
export default SupplierPaymentMethodService