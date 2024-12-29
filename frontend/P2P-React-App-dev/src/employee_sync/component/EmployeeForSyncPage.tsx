import React, { useEffect, useState, useRef } from "react";
import { EmployeeInterface } from "../interface/EmployeeInterface";
import EmployeeFromEbsService from "../service/EmployeeFromEbsService";
import { useAuth } from "../../login_both/context/AuthContext";
import PageTitle from "../../common_component/PageTitle";
import NavigationPan from "../../common_component/NavigationPan";
import ReusablePopperComponent from "../../common_component/ReusablePopperComponent";
import ReusablePaginationComponent from "../../common_component/ReusablePaginationComponent";
import moment from "moment";
import CommonSearchField from "../../common_component/CommonSearchField";
import { CSVLink } from "react-csv";
import TableSkeletonLoader from "../../Loading_component/skeleton_loader/TableSkeletonLoader";
import NotFoundPage from "../../not_found/component/NotFoundPage";
import CommonButton from "../../common_component/CommonButton";
import EmployeeSyncToAppService from "../service/EmployeeSyncToAppService";
import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";
import ErrorToast, { showErrorToast } from "../../Alerts_Component/ErrorToast";
import CheckIcon from "../../icons/CheckIcon";
import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";

import LogoLoading from "../../Loading_component/LogoLoading";
import ArrowRightIcon from "../../icons/ArrowRightIcon";
import ArrowLeftIcon from "../../icons/ArrowLeftIcon";
const pan = ["Home", "Employees"];

export default function EmployeeForSyncPage() {
  const empSearchRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [employeeList, setEmployeeList] = useState<EmployeeInterface[]>([]);

  const [total, setTotal] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(5);
  const [pageNo2, setPageNo2] = useState<number>(1);
  const [offset, setOffSet] = useState<number>(0);

  const [selectedEmployeeList, setSelectedEmployeeList] = useState<
    EmployeeInterface[] | []
  >([]);
  // const [total, setTotal] = useState<number | null>(null);
  const [empId, setEmpId] = useState<string | null>(null);
  const [isSelectedAll, setIsSelectAll] = useState<boolean>(false);
  const { token } = useAuth();
  const [failedList, setFailedList] = useState<number[]>([]);
  const [isSyncAllLoading, setIsSyncAllLoading] = useState<boolean>(false);
  useEffect(() => {
    getEmployee(offset, limit);
  }, []);

  // const getEmployee = async (offs: number) => {
  //     setIsLoading(true);
  //     const result = await EmployeeFromEbsService(token!, empId!, offs, limit);
  //     // console.log(result.data.total);

  //     if (result.data.status === 200) {
  //         setTotal(result.data.total);
  //         setEmployeeList(result.data.data[0].Employees);
  //         if (isSelectedAll) {
  //             setSelectedEmployeeList(result.data.data[0].Employees);
  //         }
  //         setIsLoading(false);
  //     }
  //     else {
  //         setIsLoading(false);
  //     }
  // }

  const getEmployee = async (offs: number, lmt: number) => {
    setIsLoading(true);
    try {
      const result = await EmployeeFromEbsService(token!, empId!, offs, lmt);
      if (result.data.status === 200) {
        dividePage(result.data.total, limit);
        setEmployeeList(result.data.data);
        console.log("sync: ", result.data)
        if (isSelectedAll) {
          setSelectedEmployeeList(result.data.data);
        }
      }
      // other logic
    } catch (error) {
      // handle error
      showErrorToast("something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  //pagination

  const dividePage = (number: number, lmt: number) => {
    console.log(number);
    if (typeof number !== "number") {
      throw new Error("Input must be a number");
    }

    const re = Math.ceil(number / lmt);

    setTotal(re);
  };

  // new pagination start
  const renderPageNumbers = () => {
    const totalPages = total ?? 0;
    const pageWindow = 5;
    const halfWindow = Math.floor(pageWindow / 2);
    let startPage = Math.max(1, pageNo2 - halfWindow);
    let endPage = Math.min(totalPages, startPage + pageWindow - 1);

    if (endPage - startPage + 1 < pageWindow) {
      startPage = Math.max(1, endPage - pageWindow + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => {
            setPageNo2(i);
            setOffSet((i - 1) * limit);
            getEmployee((i - 1) * limit, limit);
          }}
          className={`w-6 h-6 text-[12px] border rounded-md ${
            pageNo2 === i ? "border-sky-400" : "border-transparent"
          }`}
          disabled={pageNo2 === i}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  const next = async () => {
    let newOff;

    newOff = offset + limit;
    console.log(newOff);
    setOffSet(newOff);

    setPageNo2((pre) => pre + 1);
    console.log(limit);
    // getHistory("", "", newOff, limit);
    getEmployee(newOff, limit);
  };

  const previous = async () => {
    let newOff = offset - limit;
    console.log(newOff);
    if (newOff < 0) {
      newOff = 0;
      console.log(newOff);
    }

    setOffSet(newOff);
    setPageNo2((pre) => pre - 1);
    console.log(limit);

    // getHistory("", "", newOff, limit);
    getEmployee(newOff, limit);
  };

  //pagination

  const handleSearchValChange = (val: string) => {
    setEmpId(val);
  };
  const search = async () => {
    getEmployee(0, 5); //0 silo
    setEmpId(null);
  };

  //sync
  const sync = async (employee: EmployeeInterface) => {
    const result = await EmployeeSyncToAppService(token!, employee);

    if (result.data.status === 201 || result.data.status === 200) {
      showSuccessToast(result.data.message);
    } else {
      showSuccessToast(result.data.message);
    }
  };

  const syncAll = async () => {
    setIsSyncAllLoading(true);
    for (const emp of selectedEmployeeList) {
      const result = await EmployeeSyncToAppService(token!, emp);
      console.log(result.data.status);

      // Do something with the result if needed
      if (result.data.status !== 201 && result.data.status !== 200) {
        setFailedList((prevList) => [...prevList, emp.EMPLOYEE_ID]);
        showErrorToast(`Failed to sync ${emp.EMPLOYEE_ID}`);
      }
    }

    setIsSyncAllLoading(false);
    showSuccessToast(
      `Total ${
        selectedEmployeeList.length - failedList.length
      } employee synced successfully`
    );
  };

  const selectAll = () => {
    setIsSelectAll(true);
    setSelectedEmployeeList([...selectedEmployeeList, ...employeeList]);
  };
  const unselectAll = () => {
    setIsSelectAll(false);
    setSelectedEmployeeList([]);
  };

  const toggleEmployeeSelection = (employee: EmployeeInterface) => {
    setSelectedEmployeeList((prevSelectedList) => {
      const isEmployeeSelected = prevSelectedList.some(
        (emp) => emp.BUYER_ID === employee.BUYER_ID
      );

      if (isEmployeeSelected) {
        // If the employee is already selected, remove it
        return prevSelectedList.filter(
          (emp) => emp.BUYER_ID !== employee.BUYER_ID
        );
      } else {
        // If the employee is not selected, add it
        return [...prevSelectedList, employee];
      }
    });
  };

  //csv header
  let fileName = moment(Date()).format("DD/MM/YYYY");
  const headers = [
    { label: "EMPLOYEE_ID", key: "EMPLOYEE_ID" },
    { label: "BUYER_ID", key: "BUYER_ID" },
    { label: "USER_NAME", key: "USER_NAME" },
    { label: "FULL_NAME", key: "FULL_NAME" },
    { label: "EMAIL_ADDRESS", key: "EMAIL_ADDRESS" },
    { label: "START_DATE", key: "START_DATE" },
    { label: "END_DATE", key: "END_DATE" },
  ];
  return (
    <div className=" m-8 bg-white">
      <SuccessToast />
      <div className=" flex flex-col items-start">
        <PageTitle titleText="Employee Sync" />
      </div>

      <div className="h-3"></div>
      {isLoading ? (
        <div className=" w-full">
          {/* <TableSkeletonLoader /> */}
          <LogoLoading />
        </div>
      ) : !isLoading && employeeList.length === 0 ? (
        <NotFoundPage />
      ) : (
        <>
          <div className=" flex flex-row justify-between items-center">
            <CommonSearchField
              onChangeData={handleSearchValChange}
              search={search}
              placeholder="Search here...."
              inputRef={empSearchRef}
              width="w-60"
            />
            {isLoading ? (
              <div className=" w-full flex justify-center items-center">
                <CircularProgressIndicator />
              </div>
            ) : !isLoading && employeeList.length === 0 ? (
              <div></div>
            ) : (
              <CSVLink
                data={employeeList!}
                headers={headers}
                filename={`employee_list_${fileName}.csv`}
              >
                <div className=" exportToExcel ">Export to Excel</div>
              </CSVLink>
            )}
          </div>
          <div className="h-2"></div>
          {isSelectedAll && (
            <CommonButton
              titleText="Sync All"
              width="min-w-[120px]"
              onClick={syncAll}
            />
          )}
          {/* <div className="w-full flex space-x-2 items-center">
            <button
              onClick={() => {
                isSelectedAll ? unselectAll() : selectAll();
              }}
              className="flex space-x-2 items-center"
            >
              <div
                className={`${
                  isSelectedAll
                    ? "bg-midGreen "
                    : "bg-whiteColor border-[1px] border-borderColor"
                } rounded-[4px] w-4 h-4 flex justify-center items-center`}
              >
                <img src="/images/check.png" alt="check" className=" w-2 h-2" />
              </div>
              <p className=" text-midBlack font-mon text-sm font-semibold mt-[1px]">
                Select All
              </p>
            </button>
            <div className="w-4"></div>
            {isSyncAllLoading ? (
              <CircularProgressIndicator />
            ) : (
              
            )}
          </div> */}
          <div className="h-4"></div>

          <div className="overflow-auto max-h-[400px] rounded-lg shadow-lg custom-scrollbar">
            <table className="min-w-full divide-y divide-gray-200 rounded-lg">
              <thead className="bg-[#CAF4FF] sticky top-0 ">
                <tr>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    <button
                      onClick={() => {
                        isSelectedAll ? unselectAll() : selectAll();
                      }}
                      className="flex space-x-2 items-center"
                    >
                      <div
                        className={`${
                          isSelectedAll
                            ? "bg-midGreen "
                            : "bg-whiteColor border-[1px] border-borderColor"
                        } rounded-[4px] w-4 h-4 flex justify-center items-center`}
                      >
                        <img
                          src="/images/check.png"
                          alt="check"
                          className=" w-2 h-2"
                        />
                      </div>
                    </button>
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    SL
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    EMPLOYEE ID
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    BUYER ID
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    USER NAME
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    FULL NAME
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    DEPARTMENT
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    EMAIL ADDRESS
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    START DATE
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    END DATE
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon"></th>
                </tr>
              </thead>

              {employeeList.map((e, i) => (
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr key={e.BUYER_ID}>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        <button
                          onClick={() => {
                            toggleEmployeeSelection(e);
                          }}
                          className={`${
                            selectedEmployeeList.some(
                              (emp) => emp.BUYER_ID === e.BUYER_ID
                            )
                              ? "bg-midGreen "
                              : "bg-whiteColor border-[1px] border-borderColor"
                          } rounded-[4px] w-4 h-4 flex justify-center items-center`}
                        >
                          <img
                            src="/images/check.png"
                            alt="check"
                            className=" w-2 h-2"
                          />
                        </button>
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {/* {pageNo === 1 ? pageNo + i : offset + 1 + i} */}
                        {i + 1}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar ">
                      <div className="w-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                        {e.EMPLOYEE_ID ? e.EMPLOYEE_ID : "N/A"}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {e.BUYER_ID ? e.BUYER_ID : "N/A"}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {e.USER_NAME ? e.USER_NAME : "N/A"}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-56 overflow-auto custom-scrollbar text-center">
                        {e.FULL_NAME ? e.FULL_NAME : "N/A"}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-56 overflow-auto custom-scrollbar text-center">
                        {e.DEPARTMENT ? e.DEPARTMENT : "N/A"}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {e.EMAIL_ADDRESS ? e.EMAIL_ADDRESS : "N/A"}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {e.START_DATE
                          ? moment(e.START_DATE).format("DD-MM-YYYY")
                          : "N/A"}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {e.END_DATE
                          ? moment(e.END_DATE).format("DD-MM-YYYY")
                          : "N/A"}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        <button
                          onClick={() => {
                            sync(e);
                          }}
                          className="px-2 py-1 rounded-md bg-midBlue font-mon text-xs text-whiteColor font-bold"
                        >
                          Sync To Web
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              ))}

              <tfoot className="bg-white sticky bottom-0">
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center">
                    {pageNo2 !== 1 && (
                      <button
                        // disabled={pageNo === 1 ? true : false}
                        onClick={previous}
                        className=" px-4 py-2 rounded-md flex space-x-2 items-center border-[0.5px] border-borderColor "
                        style={{
                          boxShadow:
                            "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
                        }}
                      >
                        <div className="w-4 h-4 ">
                          <ArrowLeftIcon className=" w-full h-full " />
                        </div>
                        <p className=" text-[12px] font-mon">Previous</p>
                      </button>
                    )}
                  </th>
                  <th className=" py-3  text-xs font-medium text-gray-500 uppercase tracking-wider text-center ">
                    {renderPageNumbers()}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {pageNo2 !== total && (
                      <button
                        // disabled={pageNo === total ? true : false}
                        onClick={next}
                        className=" px-4 py-2 rounded-md flex space-x-2 items-center shadow-md border-[0.5px] border-borderColor "
                        style={{
                          boxShadow:
                            "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
                        }}
                      >
                        <p className=" text-[12px] font-mon">Next</p>
                        <div className="w-4 h-4 ">
                          <ArrowRightIcon className=" w-full h-full " />
                        </div>
                      </button>
                    )}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* <div className="overflow-x-auto">
            <table
              className="min-w-full divide-y divide-borderColor border-[0.2px] border-borderColor rounded-md"
              style={{ tableLayout: "fixed" }}
            >
              <thead className="sticky top-0 bg-[#F4F6F8] h-14">
                <tr>
                  <td className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  "></td>
                  <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap ">
                    SL
                  </th>
                  <th className=" font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                    EMPLOYEE ID
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                    BUYER ID
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                    USER NAME
                  </th>
                  <th className="   font-mon  px-6 py-3 text-left text-sm font-medium text-blackColor whitespace-nowrap ">
                    FULL NAME
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                    EMAIL ADDRESS
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor   items-start  whitespace-nowrap">
                    START DATE
                  </th>
                  <th className="font-mon px-8 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                    END DATE
                  </th>
                  <th className="font-mon px-16 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap"></th>

                  
                </tr>
              </thead>

          
              {employeeList.map((e, i) => (
                <tbody
                  className="bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]"
                  key={i}
                >
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor font-medium">
                    <button
                      onClick={() => {
                        toggleEmployeeSelection(e);
                      }}
                      className={`${
                        selectedEmployeeList.some(
                          (emp) => emp.BUYER_ID === e.BUYER_ID
                        )
                          ? "bg-midGreen "
                          : "bg-whiteColor border-[1px] border-borderColor"
                      } rounded-[4px] w-4 h-4 flex justify-center items-center`}
                    >
                      <img
                        src="/images/check.png"
                        alt="check"
                        className=" w-2 h-2"
                      />
                    </button>
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor whitespace-normal ">
                    <div className="">
                      {pageNo === 1 ? pageNo + i : offset + 1 + i}
                    </div>
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor ">
                    {e.EMPLOYEE_ID ? e.EMPLOYEE_ID : "N/A"}
                  </td>
                  <td className=" font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {e.BUYER_ID ? e.BUYER_ID : "N/A"}
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {e.USER_NAME ? e.USER_NAME : "N/A"}
                   
                  </td>
                  <td className="  font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor whitespace-normal">
                    <div className=" w-52">
                      {e.FULL_NAME ? e.FULL_NAME : "N/A"}
                    </div>
                  </td>
                  
                  <td className=" font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  ">
                    {e.EMAIL_ADDRESS ? e.EMAIL_ADDRESS : "N/A"}
                  </td>
                  <td className=" font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {e.START_DATE
                      ? moment(e.START_DATE).format("DD-MM-YYYY")
                      : "N/A"}
                  </td>
                  <td className=" font-mon h-12 pl-8 py-3 text-left text-[14px] text-blackColor">
                    {e.END_DATE
                      ? moment(e.END_DATE).format("DD-MM-YYYY")
                      : "N/A"}
                  </td>
                  <td className="font-mon h-12 px-16 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                    <button
                      onClick={() => {
                        sync(e);
                      }}
                      className="px-2 py-1 rounded-md bg-midBlue font-mon text-xs text-whiteColor font-bold"
                    >
                      Sync To Web
                    </button>
                  </td>
                </tbody>
              ))}
              <tfoot>
                <td></td>
                <td className=""></td>

                <td className="pl-6 py-3 whitespace-normal   ">
                  <div className=" w-[136px]">
                    <ReusablePopperComponent
                      id={id}
                      open={open}
                      anchorEl={anchorEl}
                      handleClick={handleClick}
                      setLimit={setLimit}
                      limit={limit}
                    />
                  </div>
                </td>
                <td className=" py-3   pr-6  whitespace-normal ">
                  <div className=" w-36">
                    <ReusablePaginationComponent
                      pageNo={pageNo === 1 ? pageNo : offset + 1}
                      limit={
                        offset === 0
                          ? offset + limit
                          : newOffset! !== undefined
                          ? newOffset
                          : offset + limit
                      }
                      total={total!}
                      // list={list}
                      previous={previous}
                      next={next}
                    />
                  </div>
                </td>
              </tfoot>
            </table>
          </div> */}
        </>
      )}
    </div>
  );
}
