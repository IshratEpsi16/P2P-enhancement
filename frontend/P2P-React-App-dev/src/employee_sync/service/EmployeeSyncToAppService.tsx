//EmployeeSyncToAppService
import moment from "moment";
import { EmployeeInterface } from "../interface/EmployeeInterface";

const EmployeeSyncToAppService = async (
  token: string,
  employee: EmployeeInterface
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}sync-to-web`;
  console.log(employee);

  // moment(employee.START_DATE).format("YYYY,-MM-DD")

  console.log(employee.BUSINESS_GROUP_ID);
  console.log(employee.EMPLOYEE_ID);
  console.log(employee.USER_NAME);
  console.log(employee.BUYER_ID);
  console.log(employee.FULL_NAME);
  console.log(employee.START_DATE);
  console.log(employee.END_DATE);
  console.log(employee.EMAIL_ADDRESS);
  console.log(employee.DEPARTMENT);
  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      BUSINESS_GROUP_ID: employee.BUSINESS_GROUP_ID,
      EMPLOYEE_ID: employee.EMPLOYEE_ID,
      USER_NAME: employee.USER_NAME,
      BUYER_ID: employee.BUYER_ID,
      EMPLOYEE_NAME: employee.FULL_NAME,
      START_DATE: employee.START_DATE,
      END_DATE: employee.END_DATE,
      EMAIL_ADDRESS: employee.EMAIL_ADDRESS,
      DEPARTMENT: employee.DEPARTMENT,
    }),
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default EmployeeSyncToAppService;
