import React, { useState, useRef, useEffect } from "react";
import PageTitle from "../../common_component/PageTitle";
import NavigationPan from "../../common_component/NavigationPan";

import { useCsApprovalContext } from "../context/CsApprovalContext";
import PendingCsService from "../service/PendingCsService";
import { useAuth } from "../../login_both/context/AuthContext";
import PendingCsInterface from "../interface/PendingCsInterface";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import moment from "moment";
import LogoLoading from "../../Loading_component/LogoLoading";
import NotFoundPage from "../../not_found/component/NotFoundPage";
import DateRangePicker from "../../common_component/DateRangePicker";
import { CSVLink } from "react-csv";
import ArrowLeftIcon from "../../icons/ArrowLeftIcon";
import ArrowRightIcon from "../../icons/ArrowRightIcon";
import useCsApprovalStore from "../store/csApprovalStore";
import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";
const list = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
const pan = ["Home", "CS List"];
export default function CsListPage() {
  //context

  //store
  const {
    setCsApprovalPageNo,
    setCsIdInStore,

    setOrgIdInStore,
    setRfqIdInCsApprovalStore,
    setCsTitleInStore,
    setCsGeneralTermInStore,
    setSingleCs,
  } = useCsApprovalStore();
  //store

  const nextPage = (
    csId: number,
    rfqId: number,
    orgId: number,
    csTitle: string,
    generalTerm: string,
    cs: PendingCsInterface
  ) => {
    setCsIdInStore(csId);
    setRfqIdInCsApprovalStore(rfqId);
    setOrgIdInStore(orgId);
    setCsTitleInStore(csTitle);
    setCsApprovalPageNo(2);
    setCsGeneralTermInStore(generalTerm);
    setSingleCs(cs);
  };

  const { token } = useAuth();
  //context

  //date

  function getCurrentMonthFirstAndLast(): {
    firstDay: string;
    lastDay: string;
  } {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Month is zero-based, so we add 1

    // Get the first day of the current month
    const firstDay = new Date(year, month - 1, 1);
    const formattedFirstDay = formatDate(firstDay);

    // Get the last day of the current month
    const lastDay = new Date(year, month, 0);
    const formattedLastDay = formatDate(lastDay);

    return { firstDay: formattedFirstDay, lastDay: formattedLastDay };
  }

  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero if necessary
    const day = String(date.getDate()).padStart(2, "0"); // Add leading zero if necessary
    return `${year}-${month}-${day}`;
  }

  const { firstDay, lastDay } = getCurrentMonthFirstAndLast();

  const [total, setTotal] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(5);
  const [pageNo2, setPageNo2] = useState<number>(1);
  const [offset, setOffSet] = useState<number>(0);

  //date
  useEffect(() => {
    getPendingCs(firstDay, lastDay, offset, limit);
  }, []);

  const [csList, setCsList] = useState<PendingCsInterface[]>([]);
  const [proPicPath, setProPicPath] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getPendingCs = async (
    fromDate: string,
    toDate: string,
    ofs: number,
    lmt: number
  ) => {
    try {
      setIsLoading(true);

      const result = await PendingCsService(
        token!,
        "",
        "",
        "IN PROCESS",
        ofs,
        lmt
      );
      console.log(result.data);

      if (result.data.status === 200) {
        setProPicPath(result.data.profile_pic);
        setCsList(result.data.data);
        dividePage(result.data.total, limit);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      showErrorToast("Pending CS List Load Failed");
    }
  };

  //pagination

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
            getPendingCs(
              searchStartDate,
              searchEndDate,
              (i - 1) * limit,
              limit
            );
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
  // new pagination end

  const next = async () => {
    let newOff;

    newOff = offset + limit;
    console.log(newOff);
    setOffSet(newOff);

    setPageNo2((pre) => pre + 1);
    console.log(limit);
    // getHistory("", "", newOff, limit);
    getPendingCs(searchStartDate, searchEndDate, newOff, limit);
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
    getPendingCs(searchStartDate, searchEndDate, newOff, limit);
  };

  const dividePage = (number: number, lmt: number) => {
    console.log(number);
    if (typeof number !== "number") {
      throw new Error("Input must be a number");
    }

    const re = Math.ceil(number / lmt);

    setTotal(re);
  };

  //pagination

  // const dividePage = (number: number, lmt: number) => {
  //   console.log(number);
  //   if (typeof number !== "number") {
  //     throw new Error("Input must be a number");
  //   }

  //   const re = Math.ceil(number / lmt);
  //   console.log(number);
  //   console.log(re);
  //   setTotal(re);
  // };

  // const next = () => {
  //   let newOff;

  //   newOff = offset + limit;
  //   console.log(newOff);
  //   setOffSet(newOff);

  //   setPageNo((pre) => pre + 1);
  //   console.log(limit);
  //   getPendingCs(searchStartDate, searchEndDate, newOff, limit);
  //   // getHistory("", "", newOff, limit);
  // };

  // const previous = () => {
  //   let newOff = offset - limit;
  //   console.log(newOff);
  //   if (newOff < 0) {
  //     newOff = 0;
  //     console.log(newOff);
  //   }

  //   setOffSet(newOff);
  //   setPageNo((pre) => pre - 1);
  //   console.log(limit);
  //   getPendingCs(searchStartDate, searchEndDate, newOff, limit);

  //   // getHistory("", "", newOff, limit);
  // };

  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);

    const newLimit = parseInt(event.target.value, 10);
    console.log(newLimit);

    setLimit(newLimit);
    getPendingCs(searchStartDate, searchEndDate, offset, newLimit);
    // getHistory(
    //   isSearch ? searchStartDate : "",
    //   isSearch ? searchEndDate : "",
    //   offset,
    //   newLimit
    // );
  };

  //pagination

  //date picker

  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");

  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: new Date(new Date().getFullYear(), 11, 31), // Set the endDate to the end of the current year
  });

  const handleDateChange = (newValue: any) => {
    setDateRange(newValue);
    // Handle the selected date here
    console.log(newValue);

    setSearchStartDate(moment(newValue.startDate).format("YYYY-MM-DD"));
    setSearchEndDate(moment(newValue.endDate).format("YYYY-MM-DD"));
    const offs = 0;
    setOffSet(offs);
    const lmt = 10;
    setPageNo2(1);
    setLimit(lmt);
    getPendingCs(
      moment(newValue.startDate).format("YYYY-MM-DD"),
      moment(newValue.endDate).format("YYYY-MM-DD"),
      offs,
      lmt
    );

    if (newValue.startDate == null && newValue.endaDate == null) {
      // setIsLoading(false);
      const offs = 0;
      setOffSet(offs);
      const lmt = 10;
      setPageNo2(0);
      setLimit(lmt);
      getPendingCs(firstDay, lastDay, offs, lmt);
      console.log("cleared");
    }
  };

  //date

  //export to excel

  let fileName = moment(Date()).format("DD/MM/YYYY");
  const headers = [
    { label: "CS_ID", key: "CS_ID" },
    { label: "CS_TITLE", key: "CS_TITLE" },
    { label: "ORG_ID", key: "ORG_ID" },
    { label: "NOTE", key: "NOTE" },
    { label: "GENERAL_TERMS", key: "GENERAL_TERMS" },
    { label: "FILE_ORG_NAME", key: "FILE_ORG_NAME" },
    { label: "FILE_NAME", key: "FILE_NAME" },
    { label: "CURRENCY_CODE", key: "CURRENCY_CODE" },
    { label: "TEMPLATE_ID", key: "TEMPLATE_ID" },
    { label: "TEMPLATE_STAGE_LEVEL", key: "TEMPLATE_STAGE_LEVEL" },
    { label: "CS_STATUS", key: "CS_STATUS" },
    { label: "CREATED_BY", key: "CREATED_BY" },
    { label: "CREATION_DATE", key: "CREATION_DATE" },
    { label: "LAST_UPDATED_BY", key: "LAST_UPDATED_BY" },
    { label: "LAST_UPDATE_DATE", key: "LAST_UPDATE_DATE" },
    { label: "RFQ_ID", key: "RFQ_ID" },
    { label: "CREATED_BY_USER_NAME", key: "CREATED_BY_USER_NAME" },
    { label: "CREATED_BY_FULL_NAME", key: "CREATED_BY_FULL_NAME" },
    { label: "PROPIC_FILE_NAME", key: "PROPIC_FILE_NAME" },
    { label: "SHORT_CODE", key: "SHORT_CODE" },
    { label: "NAME", key: "NAME" },
  ];
  //export to excel

  return (
    <div className=" m-8 bg-white">
      <div className=" flex  flex-col items-start">
        <PageTitle titleText="CS List" />
        {/* <NavigationPan list={pan} /> */}
      </div>
      <div className="h-4"></div>
      <div className=" w-full flex flex-row justify-between">
        <div className="">
          <div className=" w-96">
            <DateRangePicker
              onChange={handleDateChange}
              width="w-96"
              placeholder="DD/MM/YYYY"
              value={dateRange}
            />
          </div>
        </div>
        <div>
          {isLoading ? (
            <div className=" w-full flex justify-center items-center">
              <CircularProgressIndicator />
            </div>
          ) : !isLoading && csList.length === 0 ? (
            <div></div>
          ) : (
            <CSVLink
              data={csList}
              headers={headers}
              filename={`cs_list_${fileName}.csv`}
            >
              <div className=" exportToExcel ">Export to Excel</div>
            </CSVLink>
          )}
        </div>
      </div>
      <div className="h-4"></div>
      {isLoading ? (
        <div className=" w-full h-screen flex justify-center items-center">
          <LogoLoading />
        </div>
      ) : !isLoading && csList.length === 0 ? (
        <NotFoundPage />
      ) : (
        <div>
          <div className="overflow-auto max-h-[400px] rounded-lg shadow-lg custom-scrollbar">
            <table className="min-w-full divide-y divide-gray-200 rounded-lg">
              <thead className=" bg-tableHeadColor sticky top-0 ">
                <tr>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    SL
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    CS ID
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    CS Title
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    Created By
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    CS Creation Date
                  </th>
                  {/* <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Action
                </th> */}
                </tr>
              </thead>

              {csList.map((e, i) => (
                <tbody
                  className="bg-white divide-y cursor-pointer divide-gray-200"
                  onClick={() => {
                    nextPage(
                      e.CS_ID,
                      e.RFQ_ID,
                      e.ORG_ID,
                      e.CS_TITLE,
                      e.GENERAL_TERMS,
                      e
                    );
                  }}
                >
                  <tr key={e.CS_ID}>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {i + 1}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar ">
                      <div className="w-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                        {e.CS_ID}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar ">
                      <div className="w-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                        {e.CS_TITLE}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {e.CREATED_BY_FULL_NAME}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {moment(e.CREATION_DATE).format("DD-MMMM-YYYY")}
                      </div>
                    </td>
                  </tr>
                </tbody>
              ))}

              <tfoot className="bg-white sticky bottom-0">
                <tr>
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
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  <th className="px-6 py-3  text-right text-xs font-medium text-gray-500 uppercase tracking-wider justify-center flex">
                    {renderPageNumbers()}
                  </th>
                  <th className="px-6 py-3  text-right text-xs font-medium text-gray-500 uppercase tracking-wider justify-end flex">
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
                </tr>
              </tfoot>
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
                onClick={previous}
                className=" w-6 h-6"
              >
                <ArrowLeftIcon className=" w-full h-full" />
              </button>

              <button disabled={pageNo === total ? true : false} onClick={next}>
                <ArrowRightIcon />
              </button>
            </div>
          </div> */}
        </div>
      )}
      <div className="h-20"></div>
    </div>
  );
}
