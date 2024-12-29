import React, { useRef, useState, useEffect } from "react";
import PageTitle from "../../common_component/PageTitle";
import NavigationPan from "../../common_component/NavigationPan";
import CommonButton from "../../common_component/CommonButton";
import CommonSearchField from "../../common_component/CommonSearchField";
import DateRangePicker from "../../common_component/DateRangePicker";
import ReusablePopperComponent from "../../common_component/ReusablePopperComponent";
import ReusablePaginationComponent from "../../common_component/ReusablePaginationComponent";
import { useRfqPageContext } from "../context/RfqPageContext";
import RfqListInterface from "../interface/RfqListInterface";
import RfqListService from "../service/RfqListService";
import { useAuth } from "../../login_both/context/AuthContext";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import LogoLoading from "../../Loading_component/LogoLoading";
import NotFoundPage from "../../not_found/component/NotFoundPage";
import isoToDateTime from "../../utils/methods/isoToDateTime";
import moment from "moment";
import RfqListInPreparation from "../../buyer_section/pr_item_list/component/RfqListInPreparation";
import RfqlistServiceInPreparation from "../../buyer_section/pr_item_list/service/RfqListServiceInPreparation";
import RfqInterfaceInPreparation from "../../buyer_section/pr_item_list/interface/RfqinterfaceInPreparation";
import ArrowLeftIcon from "../../icons/ArrowLeftIcon";
import ArrowRightIcon from "../../icons/ArrowRightIcon";
import SuccessToast from "../../Alerts_Component/SuccessToast";
import { CSVLink } from "react-csv";
import usePrItemsStore from "../../buyer_section/pr/store/prItemStore";
import RfqHeaderDetailsService from "../../buyer_section/pr_item_list/service/RfqHeaderDetailsService";
import useCsAndRfqStore from "../../cs_and_rfq/store/csAndRfqStore";
import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";
import useCsCreationStore from "../../cs/store/CsCreationStore";
const pan = ["Home", "RFQ List"];

export default function RfqListPage() {
  const rfqSearchRef = useRef<HTMLInputElement | null>(null);
  const [rfqSearchVal, setRfqSearchVal] = useState("");
  const [rfqList, setRfqList] = useState<RfqInterfaceInPreparation[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //pagination

  const [total, setTotal] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(5);
  const [pageNo2, setPageNo2] = useState<number>(1);
  const [offset, setOffSet] = useState<number>(0);

  //pagination

  //auth
  const { token } = useAuth();
  //auth

  //useEffect for fetching data
  useEffect(() => {
    getRfqList(fromDate, toDate, offset, limit);
  }, []);
  //useEffect for fetching data

  //get rfq List

  const getRfqList = async (
    fromDate: string,
    toDate: string,
    offset: number,
    limit: number | null
  ) => {
    try {
      setIsLoading(true);
      const result = await RfqlistServiceInPreparation(
        token!,
        fromDate,
        toDate,
        rfqSearchVal === "" ? "" : rfqSearchVal,
        "SUBMIT",
        null,
        offset,
        limit
      );
      console.log(result.data);

      if (result.data.status === 200) {
        // const onlyClose = result.data.data.filter(
        //   (item: RfqInterfaceInPreparation) => item.CS_ID.toString() === ""
        // );
        const onlyClose = result.data.data.filter(
          (item: any) => new Date(item.CLOSE_DATE) < new Date()
        );

        console.log(onlyClose);

        setRfqList(onlyClose);

        dividePage(result.data.total, limit!);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      showErrorToast("Something Went Wrong");
    }
  };

  //get rfq List

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
            getRfqList(fromDate, toDate, (i - 1) * limit, limit);
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
    getRfqList(fromDate, toDate, newOff, limit);
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
    getRfqList(fromDate, toDate, newOff, limit);
  };

  // const next = () => {
  //   let newOff;

  //   newOff = offset + limit;
  //   console.log(newOff);
  //   setOffSet(newOff);

  //   setPageNo((pre) => pre + 1);
  //   console.log(limit);
  //   // getHistory("", "", newOff, limit);
  //   getRfqList(newOff, limit);
  // };
  // const searchNext = () => {
  //   const newOff = offset + limit;
  //   setOffSet(newOff);
  //   setPageNo((pre) => pre + 1);
  //   // getHistory(searchStartDate, searchEndDate, newOff, limit);
  //   // getRfqList()
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

  //   // getHistory("", "", newOff, limit);
  //   getRfqList(newOff, limit);
  // };
  // const searchPrevious = () => {
  //   let newOff = offset - limit;
  //   if (newOff < 0) {
  //     newOff = 0;
  //     console.log(newOff);
  //   }
  //   setOffSet(newOff);
  //   setPageNo((pre) => pre - 1);
  //   // getHistory(searchStartDate, searchEndDate, newOff, limit);
  // };

  //pagination

  //date range
  const [rfqDates, setRfqDates] = useState({
    startDate: null,
    endDate: null, // Set the endDate to the end of the current year
  });
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const handleRfqDateChange = (newValue: any) => {
    console.log("newValue:", newValue);
    setRfqDates(newValue);

    setFromDate(newValue.startDate);
    setToDate(newValue.endDate);

    getRfqList(newValue.startDate, newValue.endDate, offset, limit);
  };

  //date range

  //search

  const handleRfqSearchValChange = (val: string) => {
    setRfqSearchVal(val);
  };
  //search

  // aita holo popper er jonno
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;
  //end poppoer

  const download = async () => {};
  const search = async () => {
    getRfqList(fromDate, toDate, 0, 5);
  };

  //context
  const { rfqPageNo, setRfqPageNo } = useRfqPageContext();

  const {
    setRfqTypeInCsCreationStore,
    setApprovalTypeInCsCreation,

    setBuyerDeptInCsCreationStore,
  } = useCsCreationStore();

  const navigateToItem = (
    rfqId: number,
    rfqType: string,
    approvalType: string,
    rfqDept: string
  ) => {
    setRfqIdInStore(rfqId);

    console.log(rfqType);

    setRfqTypeInCsCreationStore(rfqType);
    getHeaderDetails(rfqId);
    setApprovalTypeInCsCreation(approvalType);
    setBuyerDeptInCsCreationStore(rfqDept);
  };

  //context

  //rfqHeader details

  const getHeaderDetails = async (rfqId: number) => {
    try {
      const result = await RfqHeaderDetailsService(token!, rfqId); //rfwIdInStore
      if (result.data.status === 200) {
        setRfqHeaderDetailsInStore(result.data);
        setRfqPageNo(2);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Rfq Header Details Load Failed");
    }
  };
  //rfqHeader details

  //CSV HEADER

  //csv header
  let fileName = moment(Date()).format("DD/MM/YYYY");
  const headers = [
    { label: "RFQ_ID", key: "RFQ_ID" },
    { label: "RFQ_SUBJECT", key: "RFQ_SUBJECT" },
    { label: "RFQ_TITLE", key: "RFQ_TITLE" },
    { label: "RFQ_TYPE", key: "RFQ_TYPE" },
    { label: "OPEN_DATE", key: "OPEN_DATE" },
    { label: "CLOSE_DATE", key: "CLOSE_DATE" },
    { label: "PREPARER_ID", key: "PREPARER_ID" },
    { label: "RFQ_STATUS", key: "RFQ_STATUS" },
    { label: "CREATED_BY", key: "CREATED_BY" },
    { label: "BUYER_NAME", key: "BUYER_NAME" },
  ];

  //CSV HEADER

  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);

    const newLimit = parseInt(event.target.value, 10);
    console.log(newLimit);

    setLimit(newLimit);
    // setOffSet(0);
    // setPageNo(1);
    getRfqList("", "", offset, newLimit);
    // getHistory(
    //   isSearch ? searchStartDate : "",
    //   isSearch ? searchEndDate : "",
    //   offset,
    //   newLimit
    // );
  };

  //store

  const { setRfqIdInStore, setRfqHeaderDetailsInStore } = usePrItemsStore();

  const { setCsAndRfqPageNo } = useCsAndRfqStore();

  const backToCsList = () => {
    setCsAndRfqPageNo(1);
  };

  //store

  return (
    <div className=" m-8 bg-white">
      <SuccessToast />

      <PageTitle titleText="RFQ List" />

      <div className="h-4"></div>
      <div className=" flex flex-row justify-between items-center">
        <div className="w-1/2  flex flex-row space-x-4 items-center">
          <CommonSearchField
            onChangeData={handleRfqSearchValChange}
            search={search}
            placeholder="Search Here"
            inputRef={rfqSearchRef}
            width="w-60"
          />
          <DateRangePicker
            placeholder="Date From - To"
            value={rfqDates}
            onChange={handleRfqDateChange}
          />
        </div>
        <div className=" flex space-x-4">
          {rfqList.length === 0 ? null : (
            <CSVLink
              data={rfqList!}
              headers={headers}
              filename={`rfq_list_${fileName}.csv`}
            >
              <div className=" exportToExcel ">Export to Excel</div>
            </CSVLink>
          )}
          {/* <CommonButton
            onClick={backToCsList}
            color="bg-midGreen"
            width="w-36"
            titleText="Saved CS List Page"
          /> */}
        </div>
        {/* {isLoading ? (
          <div className=" w-full flex justify-end items-end">
            <CircularProgressIndicator />
          </div>
        ) : !isLoading && rfqList.length === 0 ? (
          <div></div>
        ) : (
          
        )} */}
        {/* <CommonButton
          onClick={download}
          titleText={"Export to Excel"}
          width="w-36"
          height="h-8"
          color="bg-midGreen"
        /> */}
      </div>
      <div className=" h-6"></div>
      {isLoading ? (
        <div className=" w-full h-screen flex justify-center items-center">
          <LogoLoading />
        </div>
      ) : !isLoading && rfqList.length === 0 ? (
        <NotFoundPage />
      ) : (
        <div className="overflow-auto max-h-[400px] rounded-lg shadow-lg custom-scrollbar">
          <table className="min-w-full divide-y divide-gray-200 rounded-lg">
            <thead className="bg-[#CAF4FF] sticky top-0 ">
              <tr>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  SL
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  RFQ No
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  RFQ Title
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Publish Date
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Close Date
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Status
                </th>
              </tr>
            </thead>

            {rfqList.map((e, i) => (
              <tbody
                key={e.RFQ_ID}
                onClick={() => {
                  navigateToItem(
                    e.RFQ_ID,
                    e.RFQ_TYPE,
                    e.APPROVAL_FLOW_TYPE,
                    e.BUYER_DEPARTMENT
                  );
                }}
                className="bg-white divide-y divide-gray-200 cursor-pointer"
              >
                <tr>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {offset + i + 1}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar ">
                    <div className="w-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                      {e.RFQ_ID}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {e.RFQ_TITLE}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {isoToDateTime(e.OPEN_DATE)}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {isoToDateTime(e.CLOSE_DATE)}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {new Date(e.CLOSE_DATE) < new Date() ? (
                        <div className="bg-red-500 text-whiteColor py-1 px-2 rounded-md flex justify-center">
                          Close
                        </div>
                      ) : (
                        <div className="bg-green-500 text-whiteColor py-1 px-2 rounded-md flex justify-center">
                          Open
                        </div>
                      )}
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
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {renderPageNumbers()}
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center">
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
        //         <th className=" font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
        //           RFQ No
        //         </th>
        //         <th className=" font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
        //           RFQ Title
        //         </th>
        //         <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
        //           Publish Date
        //         </th>
        //         <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
        //           Close Date
        //         </th>
        //         <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
        //           Status
        //         </th>

        //       </tr>
        //     </thead>

        //     {rfqList.map((e, i) => (
        //       <tbody
        //         onClick={() => {
        //           navigateToItem(e.RFQ_ID);

        //         }}
        //         className="cursor-pointer bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]"
        //         key={i}
        //       >
        //         <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor font-medium">
        //           {pageNo === 1 ? pageNo + i : offset + 1 + i}
        //         </td>
        //         <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
        //           {e.RFQ_ID}
        //         </td>
        //         <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
        //           {e.RFQ_TITLE}
        //         </td>
        //         <td className=" w-64 font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
        //           {isoToDateTime(e.OPEN_DATE)}
        //         </td>
        //         <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
        //           {isoToDateTime(e.CLOSE_DATE)}
        //         </td>
        //         <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
        //           {new Date(e.CLOSE_DATE) < new Date() ? (
        //             <div className="bg-red-500 text-whiteColor py-1 px-2 rounded-md flex justify-center">
        //               Close
        //             </div>
        //           ) : (
        //             <div className="bg-green-500 text-whiteColor py-1 px-2 rounded-md flex justify-center">
        //               Open
        //             </div>
        //           )}
        //         </td>
        //       </tbody>
        //     ))}
        //   </table>
        // </div>
      )}
      {/* <div className="h-6"></div>
      <div className=" w-full flex justify-center items-center my-2">
        <div className=" flex space-x-2 items-center">
          <p className=" smallText">Rows per page: </p>
          <select value={limit} onChange={handleLimitChange} className="  w-10">
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
            className=" w-5 h-5 mt-1"
          >
            <ArrowLeftIcon className=" w-full h-full" />
          </button>

          <button
            disabled={pageNo === total ? true : false}
            onClick={isSearch ? searchNext : next}
            className=" w-5 h-5 mt-1"
          >
            <ArrowRightIcon className=" w-full h-full" />
          </button>
        </div>
      </div> */}
      <div className="h-20"></div>
    </div>
  );
}
