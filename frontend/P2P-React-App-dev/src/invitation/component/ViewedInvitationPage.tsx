import React, { useState, useEffect } from "react";
import moment from "moment";
import ReusablePopperComponent from "../../common_component/ReusablePopperComponent";
import ReusablePaginationComponent from "../../common_component/ReusablePaginationComponent";
import InvitationHistoryService from "../service/InvitationHistoryService";
import { useAuth } from "../../login_both/context/AuthContext";
import { InvitationInterface } from "../interface/InvitationInterface";
import TableSkeletonLoader from "../../Loading_component/skeleton_loader/TableSkeletonLoader";
import NotFoundPage from "../../not_found/component/NotFoundPage";
import LogoLoading from "../../Loading_component/LogoLoading";
import DateRangePicker from "../../common_component/DateRangePicker";
import CommonDropDownSearch from "../../common_component/CommonDropDownSearch";
import CommonButton from "../../common_component/CommonButton";
import { log } from "console";
import ArrowLeftIcon from "../../icons/ArrowLeftIcon";
import ArrowRightIcon from "../../icons/ArrowRightIcon";
import "../../system_setup/css/bannerTableCss.css";
import isoToDateTime from "../../utils/methods/isoToDateTime";
import { CSVLink } from "react-csv";

export default function ViewedInvitationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(10);
  const [pageNo, setPageNo] = useState<number>(1);
  const [offset, setOffSet] = useState<number>(0);
  const [isSearch, setIsSearch] = useState<boolean>(false);

  const [invitationList, setInvitationList] = useState<
    InvitationInterface[] | []
  >([]);

  let newOffset: number;

  const { token } = useAuth();

  function getFirstAndLastDateOfMonth(): {
    firstDate: string;
    lastDate: string;
  } {
    // Get the current date
    const currentDate = new Date();

    // Extract the year and month from the current date
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Note: JavaScript months are 0-indexed

    // Create a new date object for the first day of the current month
    const firstDayOfMonth = new Date(year, month - 1, 1);

    // Create a new date object for the last day of the current month
    const lastDayOfMonth = new Date(year, month, 0);

    // Format the dates as "yyyy-mm-dd"
    const formattedFirstDate = firstDayOfMonth.toISOString().slice(0, 10);
    const formattedLastDate = lastDayOfMonth.toISOString().slice(0, 10);

    return {
      firstDate: formattedFirstDate,
      lastDate: formattedLastDate,
    };
  }

  const { firstDate, lastDate } = getFirstAndLastDateOfMonth();

  useEffect(() => {
    getHistory("", "", offset, limit);
  }, []);

  // const next = async () => {
  //     newOffset = offset + limit;
  //     const newPage = pageNo + 1;
  //     setPageNo(newPage);
  //     setOffSet(newOffset);
  //     // getEmployee(newOffset);
  // }
  // const previous = async () => {
  //     newOffset = offset - limit;
  //     const newPage = pageNo - 1;
  //     setPageNo(newPage);
  //     setOffSet(newOffset);
  //     // getEmployee(newOffset);
  // }

  // aita holo popper er jonno
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;
  //end poppoer
  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");
  const [startDate, setStartDate] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: new Date(new Date().getFullYear(), 11, 31), // Set the endDate to the end of the current year
  });

  const handleStartDateChange = (newValue: any) => {
    setStartDate(newValue);
    // Handle the selected date here
    console.log(newValue);

    setSearchStartDate(moment(newValue.startDate).format("YYYY-MM-DD"));
    setSearchEndDate(moment(newValue.endDate).format("YYYY-MM-DD"));
    if (newValue.startDate == null && newValue.endaDate == null) {
      setIsSearch(false);
      const offs = 0;
      setOffSet(offs);
      const lmt = 10;
      setLimit(lmt);
      getHistory("", "", offs, lmt);
      console.log("cleared");
    }
  };

  const getHistory = async (
    f: string,
    l: string,
    offset: number,
    limit: number
  ) => {
    setIsLoading(true);
    const result = await InvitationHistoryService(token!, f, l, offset, limit); //"2023-12-01" "2023-12-31"
    console.log(result.data.data);

    dividePage(result.data.total, limit);

    if (result.data.status === 200) {
      setIsLoading(false);
      console.log("sent Time: ", result.data.data);
      setInvitationList(result.data.data);
    } else {
      setIsLoading(false);
    }
  };

  const search = () => {
    setIsSearch(true);
    const offs = 0;
    setOffSet(offs);
    const lmt = 10;
    setLimit(lmt);
    setPageNo(1);
    console.log(startDate);
    console.log(searchEndDate);

    getHistory(searchStartDate, searchEndDate, offs, lmt);
  };

  const dividePage = (number: number, lmt: number) => {
    console.log(number);
    if (typeof number !== "number") {
      throw new Error("Input must be a number");
    }

    const re = Math.ceil(number / lmt);
    console.log(number);
    console.log(re);
    setTotal(re);
  };

  const next = () => {
    let newOff;

    newOff = offset + limit;
    console.log(newOff);
    setOffSet(newOff);

    setPageNo((pre) => pre + 1);
    console.log(limit);
    getHistory("", "", newOff, limit);
  };
  const searchNext = () => {
    const newOff = offset + limit;
    setOffSet(newOff);
    setPageNo((pre) => pre + 1);
    getHistory(searchStartDate, searchEndDate, newOff, limit);
  };
  const previous = () => {
    let newOff = offset - limit;
    console.log(newOff);
    if (newOff < 0) {
      newOff = 0;
      console.log(newOff);
    }

    setOffSet(newOff);
    setPageNo((pre) => pre - 1);
    console.log(limit);

    getHistory("", "", newOff, limit);
  };
  const searchPrevious = () => {
    let newOff = offset - limit;
    if (newOff < 0) {
      newOff = 0;
      console.log(newOff);
    }
    console.log(newOff);
    setOffSet(newOff);
    setPageNo((pre) => pre - 1);
    getHistory(searchStartDate, searchEndDate, newOff, limit);
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);

    const newLimit = parseInt(event.target.value, 10);
    console.log(newLimit);

    setLimit(newLimit);
    getHistory(
      isSearch ? searchStartDate : "",
      isSearch ? searchEndDate : "",
      offset,
      newLimit
    );
  };

  // new pagination start
  const renderPageNumbers = () => {
    const totalPages = total ?? 0;
    const pageWindow = 5;
    const halfWindow = Math.floor(pageWindow / 2);
    let startPage = Math.max(1, pageNo - halfWindow);
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
            setPageNo(i);
            setOffSet((i - 1) * limit);
            getHistory("", "", (i - 1) * limit, limit);
          }}
          className={`w-6 h-6 text-[12px] border rounded-md ${pageNo === i ? "border-sky-400" : "border-transparent"
            }`}
          disabled={pageNo === i}
        >
          {i}
        </button>
      );
    }
    return pages;
  };
  // new pagination end

  let fileName = moment(Date()).format("DD/MM/YYYY");

  const headers = [
    { label: "ID", key: "ID" },
    { label: "SUPPLIER_INVITATION_TYPE", key: "SUPPLIER_INVITATION_TYPE" },
    { label: "SUPPLIER_NAME", key: "SUPPLIER_NAME" },
    { label: "SUPPLIER_TYPE", key: "SUPPLIER_TYPE" },
    { label: "INVITED_EMAIL", key: "INVITED_EMAIL" },
    { label: "INVITED_BY_BUYER_ID", key: "INVITED_BY_BUYER_ID" },
    { label: "BUSINESS_GROUP_ID", key: "BUSINESS_GROUP_ID" },
    { label: "FULL_NAME", key: "FULL_NAME" },
    { label: "IS_VIEWED", key: "IS_VIEWED" },
    { label: "VIEW_DATE", key: "VIEW_DATE" },
    { label: "CREATION_DATE", key: "CREATION_DATE" },
  ];

  return (
    <div className=" ">
      {isLoading ? (
        <div className=" w-full">
          <LogoLoading />
        </div>
      ) : !isLoading && invitationList.length === 0 ? (
        <NotFoundPage />
      ) : (
        <>
          <div className=" w-full flex justify-between items-center px-2">
            <div className="w-full flex  space-x-4 my-6 items-start ">
              <div>
                <DateRangePicker
                  onChange={handleStartDateChange}
                  width="w-72"
                  placeholder="DD/MM/YYYY"
                  value={startDate}
                />
              </div>
              <CommonButton
                titleText="Search"
                onClick={search}
                width="w-32"
                color="bg-shinyBlackColor"
              />
            </div>

            {invitationList.length === 0 ? null : (
              <CSVLink
                data={invitationList}
                headers={headers}
                filename={`invitation_history_${fileName}.csv`}
              >
                <div className="exportToExcel">Export To Excel</div>
              </CSVLink>
            )}
          </div>
          <div className="overflow-auto max-h-[400px] custom-scrollbar">
            <table
              className="min-w-full divide-y divide-borderColor border-[0.2px] border-borderColor rounded-md"
              style={{ tableLayout: "fixed" }}
            >
              <thead className="sticky top-0 bg-[#CAF4FF] h-14">
                <tr>
                  <th className="font-mon px-6 py-3 text-left text-[12px] font-semibold text-blackColor  ">
                    SL
                  </th>
                  {/* <th className=" font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                ID
            </th>
            <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                SUPPLIER INVITATION TYPE
            </th> */}
                  <th className="font-mon px-6 py-3 text-left text-[12px] font-semibold text-blackColor  tracking-wider">
                    SUPPLIER NAME
                  </th>
                  {/* <th className="   font-mon  px-6 py-3 text-left text-sm font-medium text-blackColor whitespace-nowrap ">
                SUPPLIER TYPE
            </th> */}
                  <th className="font-mon px-6 py-3 text-left text-[12px] font-semibold text-blackColor  whitespace-nowrap">
                    INVITED EMAIL
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-[12px] font-semibold text-blackColor   items-start  whitespace-nowrap">
                    INVITED BY
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-[12px] font-semibold text-blackColor   items-start  whitespace-nowrap">
                    INVITED Type
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-[12px] font-semibold text-blackColor  whitespace-nowrap  items-start">
                    INVITED TIME
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-[12px] font-semibold text-blackColor  whitespace-nowrap items-start">
                    VIEW STATUS
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-[12px] font-semibold text-blackColor  whitespace-nowrap">
                    VIEW TIME
                  </th>

                  {/* Add more header columns as needed */}
                </tr>
              </thead>

              {/* Table rows go here */}
              {/* Table rows go here */}
              {invitationList.map((e, i) => (
                <tbody
                  className="bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]"
                  key={i}
                >
                  <td className="font-mon h-12 px-6 py-3 text-left text-[12px] text-blackColor font-medium">
                    {pageNo === 1 ? pageNo + i : offset + 1 + i}
                  </td>
                  {/* <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor" >
                {
                    e.ID
                        ?
                        e.ID
                        :
                        "N/A"

                }
            </td>
            <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor" >
                {
                    e.SUPPLIER_INVITATION_TYPE
                        ?
                        e.SUPPLIER_INVITATION_TYPE
                        :
                        "N/A"

                }
            </td> */}
                  <td className=" font-mon h-12 px-6 py-3 text-left text-[12px] text-blackColor">
                    {e.SUPPLIER_NAME ? e.SUPPLIER_NAME : "N/A"}
                  </td>
                  {/* <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor" >
                {
                    e.SUPPLIER_TYPE
                        ?
                        e.SUPPLIER_TYPE
                        :
                        "N/A"

                }
               
            </td> */}
                  <td className="  font-mon h-12 px-6 py-3 text-left text-[12px] text-blackColor whitespace-normal">
                    <div className=" w-52">
                      {e.INVITED_EMAIL ? e.INVITED_EMAIL : "N/A"}
                    </div>
                  </td>
                  {/* <td className='w-96 font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  tracking-wider'>
{
e.FULL_NAME
}
</td> */}
                  <td className=" font-mon h-12 px-6 py-3 text-left text-[12px] text-blackColor  ">
                    <div className=" w-52">
                      {e.INVITED_BY_BUYER_ID || e.FULL_NAME ? (
                        <p>
                          {e.FULL_NAME}({e.INVITED_BY_BUYER_ID})
                        </p>
                      ) : (
                        "N/A"
                      )}
                    </div>
                  </td>
                  {/* <td className="  font-mon h-12 px-6 py-3 text-left text-[12px] text-blackColor whitespace-normal">
                    {e.IS_VIEWED !== null
                      ? e.IS_VIEWED === 0
                        ? "Not Viewed"
                        : " Viewed"
                      : "N/A"}
                  </td> */}
                  <td className=" font-mon h-12 px-6 py-3 text-left text-[12px] text-blackColor">
                    <div className="w-40">
                      {/* {e.CREATION_DATE
                        ? moment(e.CREATION_DATE).format("DD-MM-YYYY")
                        : "N/A"} */}
                      {e.SUPPLIER_INVITATION_TYPE === ""
                        ? "N/A"
                        : (e.SUPPLIER_INVITATION_TYPE)}
                    </div>
                  </td>
                  <td className=" font-mon h-12 px-6 py-3 text-left text-[12px] text-blackColor">
                    <div className="w-40">
                      {/* {e.CREATION_DATE
                        ? moment(e.CREATION_DATE).format("DD-MM-YYYY")
                        : "N/A"} */}
                      {e.CREATION_DATE === ""
                        ? "N/A"
                        : isoToDateTime(e.CREATION_DATE)}
                    </div>
                  </td>
                  <td className="  font-mon h-12 px-6 py-3 text-left text-[12px] font-semibold text-blackColor whitespace-normal">
                    {e.IS_VIEWED !== null ? (
                      e.IS_VIEWED === 0 ? (
                        <p className="h-6 w-20 bg-[#ffe4de] text-[#ca534d] flex items-center justify-center rounded-md">
                          Not Viewed
                        </p>
                      ) : (
                        <p className="h-6 w-20 bg-[#dbf6e5] text-[#118d57] flex items-center justify-center rounded-md">
                          Viewed
                        </p>
                      )
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className=" font-mon h-12 px-6 py-3 text-left text-[12px] text-blackColor">
                    <div className="w-40">
                      {/* {e.VIEW_DATE
                      ? moment(e.VIEW_DATE).format("DD-MM-YYYY")
                      : "N/A"} */}
                      {e.VIEW_DATE === "" ? "N/A" : isoToDateTime(e.VIEW_DATE)}
                    </div>
                  </td>
                </tbody>
              ))}
              {/* <tfoot> */}
              {/* <td className=""></td>
                <td>1</td>
                <td>{"<"}</td>
                <td>{">"}</td>
                <td>of {total}</td> */}
              {/* </tfoot> */}
            </table>
          </div>
          {/* <div className=" w-full flex justify-center items-center my-2">
            <div className=" flex space-x-2">
              <p className=" smallText">Rows per page: </p>
              <select
                value={limit}
                onChange={handleLimitChange}
                className="  w-10"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
              </select>
              <div>
                {pageNo} of {total}
              </div>

              <button
                disabled={pageNo === 1 ? true : false}
                onClick={isSearch ? searchPrevious : previous}
                className=" w-6 h-5 mt-1"
              >
                <ArrowLeftIcon className=" w-full h-full" />
              </button>

              <button
                className=" w-6 h-5 mt-1"
                disabled={pageNo === total ? true : false}
                onClick={isSearch ? searchNext : next}
              >
                <ArrowRightIcon className=" w-full h-full" />
              </button>
            </div>
          </div> */}

          <div className="bg-white sticky bottom-0 w-full flex items-center justify-between px-6 mt-4">
            <div className="w-1/4">
              {pageNo !== 1 && (
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
                  <p className=" text-[12px]">Previous</p>
                </button>
              )}
            </div>

            <div className="flex-grow flex justify-center space-x-2">
              {renderPageNumbers()}
            </div>

            <div className="w-1/4 flex justify-end">
              {pageNo !== total && (
                <button
                  // disabled={pageNo === total ? true : false}
                  onClick={next}
                  className=" px-4 py-2 rounded-md flex space-x-2 items-center shadow-md border-[0.5px] border-borderColor "
                  style={{
                    boxShadow:
                      "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
                  }}
                >
                  <p className=" text-[12px]">Next</p>
                  <div className="w-4 h-4 ">
                    <ArrowRightIcon className=" w-full h-full " />
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* <div className=" h-8 "></div> */}
        </>
      )}
    </div>
  );
}
