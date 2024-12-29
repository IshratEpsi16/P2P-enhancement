const PoStatusChangeService = async (
  token: string,
  PO_STATUS: string,
  SUPPLIER_ID: number,
  PO_HEADER_ID: number,
  PO_NUMBER: string
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}po/po-status-change`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      PO_STATUS: PO_STATUS,
      SUPPLIER_ID: SUPPLIER_ID,
      PO_HEADER_ID: PO_HEADER_ID,
      PO_NUMBER: PO_NUMBER,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default PoStatusChangeService;
