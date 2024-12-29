


const RfiAddUpdateService = async (token: string,ID:number | null,OBJECT_ID:number| null,
    OBJECT_TYPE:string | '',INITIATOR_NOTE:string | '',VIEWER_ID:number | null,VIEWER_NOTE:string |'',VIEWER_ACTION:number | null

    ) => {
    const BASE_URL = process.env.REACT_APP_B;
    const url = `${BASE_URL}rfi/add-update`;
    console.log(ID,VIEWER_NOTE);
    


    const response = await fetch(url,
        {
            method: "POST",

            headers: {

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
            body: JSON.stringify({

                "ID": ID,//Put id when update.
                "OBJECT_ID": OBJECT_ID,
                "OBJECT_TYPE": OBJECT_TYPE,// no need when update
                "INITIATOR_NOTE": INITIATOR_NOTE,// when insert
                "VIEWER_ID": VIEWER_ID,// When insert
                "VIEWER_NOTE": VIEWER_NOTE,// when update
                "VIEWER_ACTION": VIEWER_ACTION// insert = 0 and update =1
              

            }),

        }
    );
    const data = await response.json();
    return {
        statusCode: response.status,
        data: data
    };


}
export default RfiAddUpdateService