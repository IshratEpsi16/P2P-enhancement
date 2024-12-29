import React, { useState, useRef, useEffect } from "react";
import PageTitle from "../../common_component/PageTitle";
import NavigationPan from "../../common_component/NavigationPan";
import ReusablePopperComponent from "../../common_component/ReusablePopperComponent";
import ReusablePaginationComponent from "../../common_component/ReusablePaginationComponent";
import CommonButton from "../../common_component/CommonButton";
import CommonSearchField from "../../common_component/CommonSearchField";
import DateRangePicker from "../../common_component/DateRangePicker";
import { useSupplierRfqPageContext } from "../context/SupplierRfqPageContext";
import { useAuth } from "../../login_both/context/AuthContext";
import RfqListSupplierService from "../service/RfqListSupplierService";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
// import RfqListItemSupplier from "../interface/RfqListInterface";
import RfqListItemSupplier from "../inteface/RfqListItemSupplier";
import moment from "moment";
import LogoLoading from "../../Loading_component/LogoLoading";
import isoToDateTime from "../../utils/methods/isoToDateTime";
import RfqListQuotationStatusUpdateService from "../service/RfqListQuotationStatusUpdateService";
import NoDataFound from "../../utils/methods/component/NoDataFound";
import { useSupplierRfqIdContext } from "../context/SupplierRfqIdContext";
import ArrowLeftIcon from "../../icons/ArrowLeftIcon";
import ArrowRightIcon from "../../icons/ArrowRightIcon";
import useSupplierRfqStore from "../store/supplierRfqStore";
import useSupplierRfqPageStore from "../store/SupplierRfqPageStore";

const list = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, , 1, 1, 1, 1, 1, 1, 1, 1];
const pan = ["Home", "RFQ List"];

export default function RfqListPageSupplier() {
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [approveDates, setApproveDates] = useState({
    startDate: null,
    endDate: null, // Set the endDate to the end of the current year
  });

  //auth
  const { regToken } = useAuth();
  //auth

  const [rfqList, setRfqList] = useState<RfqListItemSupplier[] | []>([]);
  const [newTotal, setNewTotal] = useState(0);
  const [openTotal, setOpenTotal] = useState(0);
  const [allTotal, setAllTotal] = useState(0);
  const { appStatus, setAppStatus, handleButtonClick } =
    useSupplierRfqPageStore();
  const [isLoading, setIsLoading] = useState(false);
  const { selectedRfq, setSelectedRfq } = useSupplierRfqIdContext();

  const [total, setTotal] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(10);
  const [pageNo, setPageNo] = useState<number>(1);
  const [offset, setOffSet] = useState<number>(0);
  const [isSearch, setIsSearch] = useState<boolean>(false);

  useEffect(() => {
    getRfqList("NEW", offset, limit);
    getRfqList("OPEN", offset, limit);
    getRfqList("ALL", offset, limit);
  }, []);

  //store
  const {
    setRfqIdInStore,
    setRfqTypeInStore,
    setRfqResponseStatusInStore,
    setCanEditQuotationInStore,
    setRfqSubjectInStore,
    setRfqStatusInStore,
  } = useSupplierRfqStore();
  //store

  const getRfqList = async (status: string, offset: number, limit: number) => {
    setAppStatus(status);
    try {
      setIsLoading(true);
      const value = status === "NEW" ? "0" : "";
      const result = await RfqListSupplierService(
        regToken!,
        status,
        value,
        offset,
        limit
      );

      if (result.data.status === 200) {
        setRfqList(result.data.data);
        dividePage(result.data.total, limit);
        setIsLoading(false);

        if (status === "NEW") {
          setNewTotal(result.data.total);
        } else if (status === "OPEN") {
          setOpenTotal(result.data.total);
        } else if (status === "ALL") {
          setAllTotal(result.data.total);
        }
        console.log("rfqList: ", result.data.data);
        // const convertedData = result.data.data.map(
        //   (org: CommonOrgInterface) => ({
        //     value: org.ORGANIZATION_ID.toString(),
        //     label: org.NAME,
        //   })
        // );
        // setConvertedOrgList(convertedData);
        setIsLoading(false);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Organization Load Failed");
    }
  };

  // useEffect(() => {
  //   getRfqList(appStatus, offset, limit);
  // }, []);

  // const handleButtonClick = async (rfqStatus: string) => {
  //   setAppStatus(rfqStatus);
  //   await getRfqList(rfqStatus, offset, limit);
  // };

  const handleApproveDateChange = (newValue: any) => {
    console.log("newValue:", newValue);
    setApproveDates(newValue);
  };

  const handleSearchInputChange = (val: string) => {
    setSearchInput(val);
  };

  const search = async () => {};

  const download = async () => {};

  // aita holo popper er jonno
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;
  //end poppoer

  //pagination
  // const next = async () => {};
  // const previous = async () => {};

  //context
  // const { supplierRfqPage, setSupplierRfqPage } = useSupplierRfqPageContext();

  const { setPageNoRfq } = useSupplierRfqPageStore();

  const navigateTo = async (rfq: RfqListItemSupplier) => {
    console.log(rfq.RFQ_ID);
    setRfqIdInStore(rfq.RFQ_ID);
    setRfqTypeInStore(rfq.RFQ_TYPE);
    setRfqResponseStatusInStore(rfq.RESPONSE_STATUS);
    setCanEditQuotationInStore(rfq.CAN_EDIT);
    setRfqSubjectInStore(rfq.RFQ_SUBJECT);
    setRfqStatusInStore(rfq.SUBMISSION_STATUS);
    console.log(rfq.RFQ_SUBJECT);

    const rfqResStatus = rfq.RESPONSE_STATUS === 0 ? 2 : rfq.RESPONSE_STATUS;
    console.log(rfqResStatus);

    const result = await RfqListQuotationStatusUpdateService(
      regToken!,
      rfq.RFQ_ID,
      rfqResStatus,
      rfq.SUBMISSION_STATUS
    );
    console.log(result);

    // const result = await RfqListQuotationStatusUpdateService(
    //   regToken!,
    //   rfq.RFQ_ID,
    //   2,
    //   rfq.SUBMISSION_STATUS
    // );
    // console.log(result);

    // Set the RFQ ID using the context
    setSelectedRfq(rfq);

    setPageNoRfq(2);
  };

  const next = async () => {
    let newOff;

    newOff = offset + limit;
    console.log(newOff);
    setOffSet(newOff);

    setPageNo((pre) => pre + 1);
    console.log(limit);
    // getHistory("", "", newOff, limit);
    getRfqList(appStatus, newOff, limit);
  };

  const searchNext = () => {
    const newOff = offset + limit;
    setOffSet(newOff);
    setPageNo((pre) => pre + 1);
    // getHistory(searchStartDate, searchEndDate, newOff, limit);
  };

  const previous = async () => {
    let newOff = offset - limit;
    console.log(newOff);
    if (newOff < 0) {
      newOff = 0;
      console.log(newOff);
    }

    setOffSet(newOff);
    setPageNo((pre) => pre - 1);
    console.log(limit);

    // getHistory("", "", newOff, limit);
    getRfqList(appStatus, newOff, limit);
  };

  const searchPrevious = () => {
    let newOff = offset - limit;
    if (newOff < 0) {
      newOff = 0;
      console.log(newOff);
    }
    setOffSet(newOff);
    setPageNo((pre) => pre - 1);
    // getHistory(searchStartDate, searchEndDate, newOff, limit);
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

  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);

    const newLimit = parseInt(event.target.value, 10);
    console.log(newLimit);

    setLimit(newLimit);
    // getprItem(parseInt(buyerName), null, null, offset, newLimit);
    getRfqList(appStatus, offset, newLimit);
    // getHistory(
    //   isSearch ? searchStartDate : "",
    //   isSearch ? searchEndDate : "",
    //   offset,
    //   newLimit
    // );
  };

  // Remaining Time start

  const add12hour = (isoDateString: string): string => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const date = new Date(isoDateString);
    // date.setUTCHours(date.getUTCHours() + 12); // subtract 6 hours

    const day = String(date.getDate()).padStart(2, "0");
    const monthIndex = date.getMonth();
    const month = monthNames[monthIndex];
    const year = date.getFullYear();

    let hours = date.getUTCHours(); // Get hours in UTC
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const period = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be considered as 12

    return `${day}-${month}-${year} ${hours}:${minutes} ${period}`;
  };

  const calculateRemainingTime = (isoDateString: string): string => {
    // console.log("rem time: ", isoDateString);

    const closeDate = new Date(isoDateString);
    const currentDate = new Date();

    const timeDifference = closeDate.getTime() - currentDate.getTime();

    if (timeDifference <= 0) {
      return "0 days";
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    if (days > 0) {
      return `${days} days ${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    } else {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
  };

  useEffect(() => {
    // Interval to update remaining time every second
    const intervalId = setInterval(() => {
      // Iterate through the rfqList and update each remaining time
      setRfqList((prevRfqList) =>
        prevRfqList.map((rfq) => ({
          ...rfq,
          remainingTime: calculateRemainingTime(add12hour(rfq.CLOSE_DATE)),
        }))
      );
    }, 1000);

    // Cleanup the interval
    return () => clearInterval(intervalId);
  }, [rfqList]);

  // Remaining Time end

  return (
    <div className=" m-8">
      <div className=" flex flex-col items-start">
        <PageTitle titleText="RFQ List" />
        {/* <NavigationPan list={pan} /> */}
      </div>
      <div className="h-6"></div>
      {/* <div className=" w-full flex flex-row justify-between items-center">
        <div className="w-1/2  flex flex-row items-center space-x-4">
          <CommonSearchField
            onChangeData={handleSearchInputChange}
            search={search}
            placeholder="Search Here"
            inputRef={searchInputRef}
            width="w-60"
          />
          <DateRangePicker
            placeholder="Date From - To"
            value={approveDates}
            onChange={handleApproveDateChange}
          />
        </div>
        <CommonButton
          onClick={download}
          titleText={"Export to Excel"}
          height="h-8"
          width="w-32"
        />
      </div> */}
      <div className="h-6"></div>
      {/* <div className=" w-full space-x-2 flex items-center">
        <button className={`px-4 h-10 flex justify-center flex-row items-center space-x-2 bg-blue-50 rounded-t-md ${appStatus === 'NEW' ? 'border-b-[1px] border-blackishColor bg-blue-100' : ''}`} onClick={() => handleButtonClick('NEW')}>
          <p className=" text-sm font-mon text-blackColor">New</p>
          <div className=" h-6 px-[6px] bg-blue-500 rounded-[4px] flex justify-center items-center text-whiteColor font-mon text-xs">
            {newTotal}
          </div>
        </button>
        <button className={`px-4 h-10 flex justify-center flex-row items-center space-x-2 bg-orange-50 rounded-t-md ${appStatus === 'OPEN' ? 'border-b-[1px] border-blackishColor bg-blue-100' : ''}`} onClick={() => handleButtonClick('OPEN')}>
          <p className=" text-sm font-mon text-blackColor">Open</p>
          <div className=" h-6 px-[6px] bg-orange-500 rounded-[4px] flex justify-center items-center text-whiteColor font-mon text-xs">
            {openTotal}
          </div>
        </button>
        <button className=" px-4 h-10 flex justify-center flex-row  items-center  space-x-2 bg-green-50 border-b-[1px] border-blackishColor rounded-t-md">
          <p className=" text-sm font-mon text-blackColor">Submitted</p>
          <div className=" h-6 px-[6px] bg-green-500 rounded-[4px] flex justify-center items-center text-whiteColor font-mon text-xs">
            10
          </div>
        </button>
        <button className={`px-4 h-10 flex justify-center flex-row items-center space-x-2 bg-gray-50 rounded-t-md ${appStatus === 'ALL' ? 'border-b-[1px] border-blackishColor bg-blue-100' : ''}`} onClick={() => handleButtonClick('ALL')}>
          <p className=" text-sm font-mon text-blackColor">All</p>
          <div className=" h-6 px-[6px] bg-gray-500 rounded-[4px] flex justify-center items-center text-whiteColor font-mon text-xs">
            {allTotal}
          </div>
        </button>
      </div>

      <div className="h-6"></div> */}

      {isLoading ? (
        <LogoLoading />
      ) : (
        <div>
          <div className=" w-full space-x-2 flex items-center">
            <button
              className={`px-4 h-10 flex justify-center flex-row items-center space-x-2 bg-blue-50 rounded-t-md ${
                appStatus === "NEW"
                  ? "border-b-[1px] border-blackishColor bg-blue-100"
                  : ""
              }`}
              onClick={() => {
                handleButtonClick("NEW");
                getRfqList("NEW", offset, limit);
              }}
            >
              <p className=" text-sm font-mon text-blackColor">New</p>
              <div className=" h-6 px-[6px] bg-blue-500 rounded-[4px] flex justify-center items-center text-whiteColor font-mon text-xs">
                {newTotal}
              </div>
            </button>
            <button
              className={`px-4 h-10 flex justify-center flex-row items-center space-x-2 bg-orange-50 rounded-t-md ${
                appStatus === "OPEN"
                  ? "border-b-[1px] border-blackishColor bg-blue-100"
                  : ""
              }`}
              onClick={() => {
                handleButtonClick("OPEN");
                getRfqList("OPEN", offset, limit);
              }}
            >
              <p className=" text-sm font-mon text-blackColor">Open</p>
              <div className=" h-6 px-[6px] bg-orange-500 rounded-[4px] flex justify-center items-center text-whiteColor font-mon text-xs">
                {openTotal}
              </div>
            </button>
            {/* <button className=" px-4 h-10 flex justify-center flex-row  items-center  space-x-2 bg-green-50 border-b-[1px] border-blackishColor rounded-t-md">
              <p className=" text-sm font-mon text-blackColor">Submitted</p>
              <div className=" h-6 px-[6px] bg-green-500 rounded-[4px] flex justify-center items-center text-whiteColor font-mon text-xs">
                10
              </div>
            </button> */}
            <button
              className={`px-4 h-10 flex justify-center flex-row items-center space-x-2 bg-gray-50 rounded-t-md ${
                appStatus === "ALL"
                  ? "border-b-[1px] border-blackishColor bg-blue-100"
                  : ""
              }`}
              onClick={() => {
                handleButtonClick("ALL");
                getRfqList("ALL", offset, limit);
              }}
            >
              <p className=" text-sm font-mon text-blackColor">All</p>
              <div className=" h-6 px-[6px] bg-gray-500 rounded-[4px] flex justify-center items-center text-whiteColor font-mon text-xs">
                {allTotal}
              </div>
            </button>
          </div>

          <div className="h-3"></div>

          {rfqList.length === 0 ? (
            <div>
              <div className="h-12"></div>
              <div className=" w-full flex justify-center items-center">
                <img
                  src="/images/NoDataNew.png"
                  alt="nodata"
                  className=" w-[450px] h-[450px]"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-auto max-h-[400px] rounded-lg shadow-lg custom-scrollbar">
                <table className="min-w-full divide-y divide-gray-200 rounded-lg">
                  <thead className="bg-[#CAF4FF] sticky top-0 ">
                    <tr>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        SL
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        RFQ Id
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        RFQ Subject
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        Type
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        Publish Date
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        Close Date
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        Remaining Time
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        Buyer Name
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        Status
                      </th>
                    </tr>
                  </thead>

                  {rfqList.map((rfq, index) => (
                    <tbody
                      key={rfq.RFQ_ID}
                      className="bg-white divide-y divide-gray-200"
                    >
                      <tr
                        onClick={() => {
                          navigateTo(rfq);
                        }}
                        className={`cursor-pointer ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } divide-y divide-gray-200`}
                      >
                        <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                          <div className="w-full overflow-auto custom-scrollbar text-center">
                            {pageNo === 1 ? pageNo + index : offset + 1 + index}
                          </div>
                        </td>
                        <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar ">
                          <div className="w-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                            {rfq.RFQ_ID}
                          </div>
                        </td>
                        <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                          <div className="w-full overflow-auto custom-scrollbar text-center">
                            {rfq.RFQ_SUBJECT}
                          </div>
                        </td>
                        <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                          <div className="w-full overflow-auto custom-scrollbar text-center">
                            {rfq.RFQ_TYPE === "T" ? "Technical" : "Both"}
                          </div>
                        </td>
                        <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                          <div className="w-full overflow-auto custom-scrollbar text-center">
                            {isoToDateTime(rfq.OPEN_DATE)}
                          </div>
                        </td>
                        <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                          <div className="w-full overflow-auto custom-scrollbar text-center">
                            {isoToDateTime(rfq.CLOSE_DATE)}
                          </div>
                        </td>
                        <td className="overflow-auto px-6 py-4 whitespace-nowrap text-[14px] text-gray-500 custom-scrollbar">
                          <div
                            className={`w-full overflow-auto font-semibold custom-scrollbar text-center ${
                              rfq.remainingTime === "0 days"
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            {rfq.remainingTime}
                          </div>
                        </td>
                        <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                          <div className="w-full overflow-auto custom-scrollbar text-center">
                            {!rfq.BUYER_NAME ? "N/A" : rfq.BUYER_NAME}
                          </div>
                        </td>
                        <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                          <div className="w-full overflow-auto custom-scrollbar text-center">
                            {rfq.RESPONSE_STATUS === 0 && appStatus === "NEW" && (
                              <div className="text-xs font-mon font-semibold text-[#006C9C] py-1 px-2 rounded-md flex justify-start bg-[#CCE2EB]">
                                New
                              </div>
                            )}

                            {rfq.remainingTime !== "0 days" && appStatus === "OPEN" && (
                              <div className="text-xs font-mon font-semibold text-[#BF7E1B] py-1 px-2 rounded-md flex justify-start bg-[#FFE9D5]">
                                Open
                              </div>
                            )}

                            {appStatus === "SUBMIT" && (
                              <div className="text-xs font-mon font-semibold text-[#006E1F] py-1 px-2 rounded-md flex justify-center bg-[#CCE2D2]">
                                Submitted
                              </div>
                            )}

                            {appStatus === "ALL" && (
                              <div className="text-xs font-mon font-semibold py-1 rounded-md flex justify-start">
                                {rfq.RESPONSE_STATUS === 0 && (
                                  <div className="bg-[#CCE2EB] text-[#006C9C] py-1 px-2 rounded-md flex justify-start">
                                    New
                                  </div>
                                )}
                                {rfq.RESPONSE_STATUS === 2 && (
                                  <div className="bg-[#FFE9D5] text-[#BF7E1B] py-1 px-2 rounded-md flex justify-start">
                                    Open
                                  </div>
                                )}
                                {rfq.RESPONSE_STATUS === 4 && (
                                  <div className="bg-[#FFE9D5] text-[#BF7E1B] py-1 px-2 rounded-md flex justify-start">
                                    Submit
                                  </div>
                                )}
                                {rfq.RESPONSE_STATUS === 1 && (
                                  <div className="bg-[#FFE9D5] text-[#BF7E1B] py-1 px-2 rounded-md flex justify-start">
                                    Accept
                                  </div>
                                )}
                                {rfq.RESPONSE_STATUS === 5 && (
                                  <div className="bg-[#CCE2EB] text-[#006C9C]  py-1 px-2 rounded-md flex justify-start">
                                    Save
                                  </div>
                                )}
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
                        {/* <button
                    disabled={localPageNo === 1 ? true : false}
                    onClick={previous}
                    className=" px-4 py-2 rounded-md flex space-x-2 items-center shadow-md border-[0.5px] border-borderColor "
                  >
                    <div className="w-4 h-4 ">
                      <ArrowLeftIcon className=" w-full h-full " />
                    </div>
                    <p className=" text-sm">Previous</p>
                  </button> */}
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center">
                        {/* <button
                    disabled={localPageNo === total ? true : false}
                    onClick={next}
                    className=" px-4 py-2 rounded-md flex space-x-2 items-center shadow-md border-[0.5px] border-borderColor "
                  >
                    <p className=" text-sm">Next</p>
                    <div className="w-4 h-4 ">
                      <ArrowRightIcon className=" w-full h-full " />
                    </div>
                  </button> */}
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* <div className="overflow-x-auto">
                <table
                  className="min-w-full divide-y divide-gray-200 border-[0.2px] border-borderColor rounded-md"
                  style={{ tableLayout: "fixed" }}
                >
                  <thead className="sticky top-0 bg-[#F4F6F8] h-14">
                    <tr>
                      <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  ">
                        SL
                      </th>
                      <th className=" font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                        RFQ ID
                      </th>
                      <th className=" font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                        RFQ SUBJECT
                      </th>
                      <th className=" font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Type
                      </th>
                      <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Publish Date
                      </th>
                      <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Close Date
                      </th>
                      <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Buyer Name
                      </th>
                      <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Status
                      </th>

                      
                    </tr>
                  </thead>

               

                  <tbody>
                    {rfqList.map((rfq, index) => (
                      <tr
                        onClick={() => {
                          navigateTo(rfq);
                        }}
                        className={`cursor-pointer ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-100"
                        } divide-y divide-gray-200`}
                        key={index}
                      >
                        <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor font-medium">
                          {pageNo === 1 ? pageNo + index : offset + 1 + index}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                          {rfq.RFQ_ID}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                          {rfq.RFQ_SUBJECT}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                          {rfq.RFQ_TYPE === "T" ? "Technical" : "Both"}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                          {isoToDateTime(rfq.OPEN_DATE)}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                          {isoToDateTime(rfq.CLOSE_DATE)}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                          {!rfq.BUYER_NAME ? "N/A" : rfq.BUYER_NAME}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                          

                          {rfq.RESPONSE_STATUS === 0 && appStatus === "NEW" && (
                            <div className="text-xs font-mon font-semibold text-[#006C9C] py-1 px-2 rounded-md flex justify-start bg-[#CCE2EB]">
                              New
                            </div>
                          )}

                          {rfq.RESPONSE_STATUS === 2 &&
                            appStatus === "OPEN" && (
                              <div className="text-xs font-mon font-semibold text-[#BF7E1B] py-1 px-2 rounded-md flex justify-start bg-[#FFE9D5]">
                                Open
                              </div>
                            )}

                          {appStatus === "SUBMIT" && (
                            <div className="text-xs font-mon font-semibold text-[#006E1F] py-1 px-2 rounded-md flex justify-center bg-[#CCE2D2]">
                              Submitted
                            </div>
                          )}

                          {appStatus === "ALL" && (
                            <div className="text-xs font-mon font-semibold py-1 rounded-md flex justify-start">
                              {rfq.RESPONSE_STATUS === 0 && (
                                <div className="bg-[#CCE2EB] text-[#006C9C] py-1 px-2 rounded-md flex justify-start">
                                  New
                                </div>
                              )}
                              {rfq.RESPONSE_STATUS === 2 && (
                                <div className="bg-[#FFE9D5] text-[#BF7E1B] py-1 px-2 rounded-md flex justify-start">
                                  Open
                                </div>
                              )}
                              {rfq.RESPONSE_STATUS === 4 && (
                                <div className="bg-[#FFE9D5] text-[#BF7E1B] py-1 px-2 rounded-md flex justify-start">
                                  Submit
                                </div>
                              )}
                              {rfq.RESPONSE_STATUS === 1 && (
                                <div className="bg-[#FFE9D5] text-[#BF7E1B] py-1 px-2 rounded-md flex justify-start">
                                  Accept
                                </div>
                              )}
                            </div>
                          )}

                        
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div> */}

              <div className=" h-12"></div>
              <div className=" w-full flex justify-center items-center my-2">
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
              </div>
              <div className=" h-12"></div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
