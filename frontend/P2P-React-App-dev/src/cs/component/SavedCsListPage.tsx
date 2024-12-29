import React, { useState, useRef, useEffect } from "react";
import CsInterface from "../interface/CsInterface";
import InputLebel from "../../common_component/InputLebel";
import NavigationPan from "../../common_component/NavigationPan";
import useCsAndRfqStore from "../../cs_and_rfq/store/csAndRfqStore";
import CommonButton from "../../common_component/CommonButton";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import CsListService from "../service/CsListService";
import { useAuth } from "../../login_both/context/AuthContext";
import NotFoundPage from "../../not_found/component/NotFoundPage";
import LogoLoading from "../../Loading_component/LogoLoading";
import moment from "moment";
import SuccessToast from "../../Alerts_Component/SuccessToast";
import { CSVLink } from "react-csv";
import DateRangePicker from "../../common_component/DateRangePicker";
import ArrowLeftIcon from "../../icons/ArrowLeftIcon";
import ArrowRightIcon from "../../icons/ArrowRightIcon";
import useCsCreationStore from "../store/CsCreationStore";
import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";
import { button } from "@material-tailwind/react";
import EditIcon from "../../icons/EditIcon";

const pan = ["Home", "Cs List"];
export default function SavedCsListPage() {
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

  //date

  const [csList, setCsList] = useState<CsInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //context
  const { token } = useAuth();
  //context

  //store
  const { setCsAndRfqPageNo, setCsIdInCsAndRfq } = useCsAndRfqStore();
  const {
    setSavedCsIdInStore,
    setCsPageNo,
    setRfqIdInCsCreationStore,
    setCsGeneralTermInStore,
    setCsTitleInStore,
    setCsCreationDateInStore,
    setCsStatusInStore,
    buyerDeptInCsCreationStore,

    approvalTypeInCsCreation,
    setCsNoteInStore,

    setApprovalTypeInCsCreation,

    setBuyerDeptInCsCreationStore,
    setRfqTypeInCsCreationStore,
  } = useCsCreationStore();
  //store

  const navigateToCsItem = (
    csId: number,
    rfqId: number,
    generalTerm: string,
    csTitle: string,
    csCreationDate: string,
    csStatus: string,
    dept: string,
    approvalType: string,
    csNote: string,
    rfqType: string
  ) => {
    if (selectedCsStatus === "CANCELED") {
      showErrorToast("You can not do anything with cancel CS");
    } else {
      console.log(csNote);

      setSavedCsIdInStore(csId);
      setRfqIdInCsCreationStore(rfqId);
      setCsGeneralTermInStore(generalTerm);
      setCsTitleInStore(csTitle);
      setCsCreationDateInStore(csCreationDate);
      setCsStatusInStore(csStatus);
      setBuyerDeptInCsCreationStore(dept);
      setApprovalTypeInCsCreation(approvalType);
      setCsNoteInStore(csNote);
      setRfqTypeInCsCreationStore(rfqType);
      setCsPageNo(2);
    }
  };

  const createCsNavigation = () => {
    setCsAndRfqPageNo(2);
  };

  //pagination
  const [limit, setLimit] = useState<number>(10);
  const [pageNo2, setPageNo2] = useState<number>(1);
  const [offset, setOffSet] = useState<number>(0);
  //pagination
  const [selectedCsStatus, setSelectedCsStatus] = useState<string>("SAVE");

  useEffect(() => {
    console.log(firstDay);
    console.log(lastDay);
    getCsList(offset, limit, selectedCsStatus);
  }, []);

  //status change

  const changeCsStatus = (poStatus: string) => {
    setSelectedCsStatus(poStatus);
    switch (poStatus) {
      case "SAVE":
        getCsList(0, limit, "SAVE");
        break;
      case "REJECTED":
        getCsList(0, limit, "REJECTED");
        break;
      case "APPROVED":
        getCsList(0, limit, "APPROVED");
        break;
      case "CANCELED":
        getCsList(0, limit, "CANCELED");
        break;
      case "PENDING":
        getCsList(0, limit, "IN PROCESS");
        break;
      default:
        break;
    }
  };
  //status change

  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [total, setTotal] = useState<number | null>(null);

  const getCsList = async (ofs: number, lmt: number, css: string) => {
    try {
      setIsLoading(true);

      const result = await CsListService(
        token!,
        searchStartDate,
        searchEndDate,
        css,
        ofs,
        lmt
      );
      console.log(result.data);

      if (result.data.status === 200) {
        setCsList(result.data.data);
        dividePage(result.data.total, limit);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      showErrorToast("CS Load Failed");
    }
  };

  //

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
  ];

  //export to excel

  //date picker

  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: new Date(new Date().getFullYear(), 11, 31), // Set the endDate to the end of the current year
  });

  const handleDateChange = (newValue: any) => {
    console.log(newValue);

    setDateRange(newValue);
    // Handle the selected date here
    console.log(newValue);
    console.log(newValue.startDate);

    newValue.startDate === null
      ? setSearchStartDate("")
      : setSearchStartDate(moment(newValue.startDate).format("YYYY-MM-DD"));
    newValue.endDate === null
      ? setSearchEndDate("")
      : setSearchEndDate(moment(newValue.endDate).format("YYYY-MM-DD"));

    const offs = 0;
    setOffSet(offs);
    const lmt = 10;
    setLimit(lmt);
    // getCsList(firstDay, lastDay, offs, lmt);
    console.log("cleared");
  };

  const search = () => {
    setIsSearch(true);
    setIsLoading(true);
    const offs = 0;
    setOffSet(offs);
    const lmt = 10;
    setLimit(lmt);
    setPageNo2(1);
    // console.log(startDate);
    // console.log(searchEndDate);

    getCsList(offs, lmt, selectedCsStatus);
  };

  // const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   console.log(event.target.value);

  //   const newLimit = parseInt(event.target.value, 10);
  //   console.log(newLimit);

  //   setLimit(newLimit);
  //   getCsList(
  //     isSearch ? searchStartDate : "",
  //     isSearch ? searchEndDate : "",
  //     offset,
  //     newLimit
  //   );
  // };

  //date picker

  //pagination

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
            getCsList((i - 1) * limit, limit, selectedCsStatus);
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
    getCsList(newOff, limit, selectedCsStatus);
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
    getCsList(newOff, limit, selectedCsStatus);
  };

  //pagination

  const naviagteToPoList = (csId: number) => {
    setCsIdInCsAndRfq(csId);
    setCsPageNo(5);
  };

  return (
    <div className=" bg-white m-8">
      <SuccessToast />

      <div className=" w-full flex justify-between  items-center">
        <div>
          <InputLebel titleText={"Saved CS List"} />
          {/* <NavigationPan list={pan} /> */}
        </div>
        {/* {isLoading ? (
          <div>
            <CircularProgressIndicator />
          </div>
        ) : !isLoading && csList.length === 0 ? null : (
          <div>
          
          </div>
        )} */}
      </div>
      {/* <div className=" my-4 w-full flex justify-start items-start">
       
      </div> */}
      <div className=" w-full flex justify-between items-center">
        <div className="  flex  space-x-4 my-4 items-start">
          <div className=" w-96">
            <DateRangePicker
              onChange={handleDateChange}
              width="w-96"
              placeholder="DD/MM/YYYY"
              value={dateRange}
            />
          </div>
          <CommonButton titleText="Search" onClick={search} width="w-32" />
        </div>

        {/* <CommonButton
          onClick={createCsNavigation}
          color="bg-midGreen"
          width="w-48"
          titleText="Create A CS"
        /> */}
      </div>
      <div className=" w-full flex justify-between items-center">
        <div className=" flex space-x-4 items-center">
          <button
            className={`px-4 h-10 flex justify-center flex-row items-center space-x-2 bg-blue-50 rounded-t-md ${
              selectedCsStatus === "SAVE"
                ? "border-b-[1px] border-blackishColor bg-blue-100"
                : ""
            }`}
            onClick={() => {
              changeCsStatus("SAVE");
            }}
          >
            <p className=" text-sm font-mon text-blackColor">SAVED</p>
          </button>
          <button
            className={`px-4 h-10 flex justify-center flex-row items-center space-x-2 bg-green-50 rounded-t-md ${
              selectedCsStatus === "PENDING"
                ? "border-b-[1px] border-blackishColor bg-blue-200"
                : ""
            }`}
            onClick={() => {
              changeCsStatus("PENDING");
            }}
          >
            <p className=" text-sm font-mon text-blackColor">PENDING</p>
          </button>
          <button
            className={`px-4 h-10 flex justify-center flex-row items-center space-x-2 bg-green-50 rounded-t-md ${
              selectedCsStatus === "APPROVED"
                ? "border-b-[1px] border-blackishColor bg-blue-200"
                : ""
            }`}
            onClick={() => {
              changeCsStatus("APPROVED");
            }}
          >
            <p className=" text-sm font-mon text-blackColor">APPROVED</p>
          </button>
          <button
            className={`px-4 h-10 flex justify-center flex-row items-center space-x-2 bg-orange-50 rounded-t-md ${
              selectedCsStatus === "REJECTED"
                ? "border-b-[1px] border-blackishColor bg-blue-100"
                : ""
            }`}
            onClick={() => {
              changeCsStatus("REJECTED");
            }}
          >
            <p className=" text-sm font-mon text-blackColor">REJECTED</p>
          </button>

          <button
            className={`px-4 h-10 flex justify-center flex-row items-center space-x-2 bg-red-50 rounded-t-md ${
              selectedCsStatus === "CANCELED"
                ? "border-b-[1px] border-blackishColor bg-blue-200"
                : ""
            }`}
            onClick={() => {
              changeCsStatus("CANCELED");
            }}
          >
            <p className=" text-sm font-mon text-blackColor">CANCELED</p>
          </button>
        </div>

        {csList.length === 0 ? null : (
          <div className=" w-full flex justify-end items-end">
            <CSVLink
              data={csList!}
              headers={headers}
              filename={`cs_list_${fileName}.csv`}
            >
              <div className=" exportToExcel ">Export to Excel</div>
            </CSVLink>
          </div>
        )}
      </div>

      <div className=" my-4">
        {isLoading ? (
          <div className=" w-full h-screen flex justify-center items-center">
            <LogoLoading />
          </div>
        ) : !isLoading && csList.length === 0 ? (
          <NotFoundPage />
        ) : (
          <div className="overflow-auto max-h-[400px] rounded-lg shadow-lg custom-scrollbar">
            <table className="min-w-full divide-y divide-gray-200 rounded-lg">
              <thead className="bg-[#CAF4FF] sticky top-0 ">
                <tr>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    Action
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    Sl
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    CS Title
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    CS ID
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    Created By
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    CS Creation Date
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    PO List
                  </th>
                </tr>
              </thead>

              {csList.map((e, i) => (
                <tbody
                  onClick={() => {}}
                  key={e.CS_ID}
                  className=" cursor-pointer bg-white divide-y divide-gray-200"
                >
                  <tr>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        <button
                          onClick={() => {
                            if (e.CS_STATUS === "CANCELED") return null;
                            navigateToCsItem(
                              e.CS_ID,
                              e.RFQ_ID,
                              e.GENERAL_TERMS,
                              e.CS_TITLE,
                              e.CREATION_DATE,
                              e.CS_STATUS,
                              e.BUYER_DEPARTMENT,
                              e.APPROVAL_FLOW_TYPE,
                              e.NOTE,
                              e.RFQ_TYPE
                            );
                          }}
                        >
                          <EditIcon />
                        </button>
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {i + 1}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar ">
                      <div className="w-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                        {!e.CS_TITLE ? "N/A" : e.CS_TITLE}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {!e.CS_ID ? "N/A" : e.CS_ID}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {!e.CREATED_BY_FULL_NAME
                          ? "N/A"
                          : e.CREATED_BY_FULL_NAME}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {!moment(e.CREATION_DATE).format("DD-MMMM-YYYY")
                          ? "N/A"
                          : moment(e.CREATION_DATE).format("DD-MMMM-YYYY")}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {!e.CS_STATUS ? "N/A" : e.CS_STATUS}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {e.CS_STATUS === "APPROVED" ? (
                          <button
                            onClick={() => {
                              naviagteToPoList(e.CS_ID);
                            }}
                            className=" py-1 px-4 bg-blue-400 rounded-md text-sm text-white font-mon "
                          >
                            view
                          </button>
                        ) : (
                          "N/A"
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              ))}

              <tfoot className="bg-white sticky bottom-0">
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {" "}
                    {renderPageNumbers()}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
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
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
                </tr>
              </tfoot>
            </table>
          </div>

          // <div className="overflow-x-auto">
          //   <table
          //     className="min-w-full divide-y divide-gray-200 border-[0.2px] border-borderColor rounded-md"
          //     style={{ tableLayout: "fixed" }}
          //   >
          //     <thead className="sticky top-0 bg-[#F4F6F8] h-14">
          //       <tr>
          //         <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  ">
          //           SL
          //         </th>
          //         <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  ">
          //           CS Title
          //         </th>
          //         <th className=" font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
          //           CS ID
          //         </th>
          //         <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
          //           Created By
          //         </th>
          //         <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
          //           CS Creation Date
          //         </th>
          //         <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
          //           Status
          //         </th>

          //       </tr>
          //     </thead>

          //     {csList.map((e, i) => (
          //       <tbody
          //         onClick={() => {
          //           navigateToCsItem(
          //             e.CS_ID,
          //             e.RFQ_ID,
          //             e.GENERAL_TERMS,
          //             e.CS_TITLE,
          //             e.CREATION_DATE
          //           );
          //         }}
          //         className="cursor-pointer bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]"
          //         key={e.CS_ID}
          //       >
          //         <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor font-medium">
          //           {i + 1}
          //         </td>
          //         <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor font-medium">
          //           {e.CS_TITLE}
          //         </td>
          //         <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
          //           {e.CS_ID}
          //         </td>
          //         <td className="  font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
          //           {e.CREATED_BY_FULL_NAME}
          //         </td>
          //         <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
          //           {moment(e.CREATION_DATE).format("DD-MMMM-YYYY")}
          //         </td>
          //         <td className="  font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
          //           {e.CS_STATUS}
          //         </td>
          //       </tbody>
          //     ))}
          //   </table>
          // </div>
        )}
      </div>
    </div>
  );
}
