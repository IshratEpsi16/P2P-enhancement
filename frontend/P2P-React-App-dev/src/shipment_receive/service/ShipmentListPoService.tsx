

const ShipmentListPoService = async (
  token: string,
  headerId: string | "",
  offset: number,
  limit: number
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}po/list`;

  console.log("header: ", headerId);

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      PO_STATUS: "",
      PO_HEADER_ID: headerId,
      USER_ID: "",
      OFFSET: offset,
      LIMIT: limit,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default ShipmentListPoService;
