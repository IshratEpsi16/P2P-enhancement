



const GetBuyerMenuService = async (userId: string) => {
    const url = `${process.env.REACT_APP_B}user_menu_and_access_list`;

    // console.log(SNAME, SEMAIL, STYPE);

    const response = await fetch(url,
        {
            method: "POST",
            // mode: "no-cors",
            // mode: "cors",
            headers: {

                "Content-Type": "application/json",
                'Authorization': 'Basic ' + btoa(`${process.env.REACT_APP_U}:${process.env.REACT_APP_P}`),

            },
            body: JSON.stringify({


                "USER_ID": userId

            }),
        }
    );
    // if (!response.ok) {
    //     throw new Error("fetching is not successful");
    //   }
    const data = await response.json();

    console.log(`send: ${data}`);

    return {
        statusCode: response.status,
        data: data
    };


}
export default GetBuyerMenuService
