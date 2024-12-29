import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../../login_both/context/AuthContext";
import PageTitle from "../../../common_component/PageTitle";
import NavigationPan from "../../../common_component/NavigationPan";
import CommonButton from "../../../common_component/CommonButton";
import { useRfqCreateProcessContext } from "../../../buyer_rfq_create/context/RfqCreateContext";
import LogoLoading from "../../../Loading_component/LogoLoading";
import RfqlistServiceInPreparation from "../service/RfqListServiceInPreparation";
import RfqInterfaceInPreparation from "../interface/RfqinterfaceInPreparation";

import { showErrorToast } from "../../../Alerts_Component/ErrorToast";
import isoToDateTime from "../../../utils/methods/isoToDateTime";
import ArrowLeftIcon from "../../../icons/ArrowLeftIcon";
import ArrowRightIcon from "../../../icons/ArrowRightIcon";
import usePrItemsStore from "../../pr/store/prItemStore";
import InfoModal from "../../../common_component/InfoModal";
import usePermissionStore from "../../../utils/store/PermissionStore";

const pan = ["Home", "RFQ Preparation"];

export default function RfqListInPreparation() {
  //auth
  const { token, department, userId } = useAuth();
  //

  //store
  const {
    setIsCreateRfq,
    setRfqIdInStore,
    setRfqHeaderDetailsInStore,
    setCloseDateInStore,
    setCsIdInPrItemsStore,
    setRfqOrgIdInStore,
  } = usePrItemsStore();

  const { isRfqAllViewPermissionInStore, setIsRfqAllViewPermissionInStore } =
    usePermissionStore();
  //store
  //context
  const { page, setPage } = useRfqCreateProcessContext();

  const [savedTotal, setSavedTotal] = useState(0);
  const [openTotal, setOpenTotal] = useState(0);
  const [allTotal, setAllTotal] = useState(0);
  const [submitTotal, setSubmitTotal] = useState(0);
  const [quotationTotal, setQuotationTotal] = useState(0);
  const [csTotal, setCsTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [rfqStatus, setRfqStatus] = useState("SAVE");
  const [rfqList, setRfqList] = useState<RfqInterfaceInPreparation[] | []>([]);

  const [total, setTotal] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(10);
  const [pageNo, setPageNo] = useState<number>(1);
  const [offset, setOffSet] = useState<number>(0);
  const [isSearch, setIsSearch] = useState<boolean>(false);

  useEffect(() => {
    console.log("userId: ", userId);
    console.log("rfqView: ", isRfqAllViewPermissionInStore);

    const fetchData = async () => {
      await getRfqList("SUBMIT", offset, limit);
      await getRfqList("SAVE", offset, limit);
    };

    fetchData();
  }, []);

  const getRfqList = async (status: string, offset: number, limit: number) => {
    setRfqStatus(status);
    try {
      setIsLoading(true);
      // const value = status === 'NEW' ? '0' : '';
      const result = await RfqlistServiceInPreparation(
        token!,
        "",
        "",
        "",
        status,
        isRfqAllViewPermissionInStore ? null : userId!,
        offset,
        limit
      );

      if (result.data.status === 200) {
        if (status === "SAVE") {
          setSavedTotal(result.data.total);
          setRfqList(result.data.data);
          dividePage(result.data.total, limit);
          setIsLoading(false);
        }
        // else if (status === 'OPEN') {
        //   setOpenTotal(result.data.total);
        // }
        else if (status === "SUBMIT") {
          // if (isCsDone) {
          //   const csCreatedList = result.data.data.map(
          //     (item: any) => item.CS_ID
          //   );
          //   console.log(csCreatedList);

          //   console.log(csCreatedList.length);
          //   setCsTotal(csCreatedList.length);
          //   setRfqList(csCreatedList);
          // }

          setSubmitTotal(result.data.total);
          setRfqList(result.data.data);
          dividePage(result.data.total, limit);
          setIsLoading(false);
        } else if (status === "QUOTATION") {
          setQuotationTotal(result.data.total);
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
  const getRfqListCsCreated = async (
    status: string,
    offset: number,
    limit: number
  ) => {
    setRfqStatus(status);
    try {
      setIsLoading(true);
      // const value = status === 'NEW' ? '0' : '';
      const result = await RfqlistServiceInPreparation(
        token!,
        "",
        "",
        "",
        "SUBMIT",
        isRfqAllViewPermissionInStore ? null : userId!,
        offset,
        limit
      );

      if (result.data.status === 200) {
        setRfqList(result.data.data);

        if (isCsDone) {
          const csCreatedList = result.data.data.map((item: any) => item.CS_ID);
          console.log(csCreatedList);

          console.log(csCreatedList.length);
          setCsTotal(csCreatedList.length);
          setRfqList(csCreatedList);
        }

        setIsLoading(false);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Organization Load Failed");
    }
  };

  const [isSave, setIsSave] = useState<boolean>(true);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [isQuotation, setIsQuotation] = useState<boolean>(false);
  const [isCsDone, setIsCsDone] = useState<boolean>(false);

  const handleIsCs = () => {
    setIsSave(false);
    setIsSubmit(false);
    setIsQuotation(false);
    setIsCsDone(true);
  };

  const handleIsSave = () => {
    setIsSave(true);
    setIsSubmit(false);
    setIsQuotation(false);
    setIsCsDone(false);
  };

  const handleIsSubmit = () => {
    setIsSave(false);
    setIsSubmit(true);
    setIsQuotation(false);
    setIsCsDone(false);
  };

  const handleIsQuotation = () => {
    setIsSave(false);
    setIsSubmit(false);
    setIsQuotation(true);
  };

  const handleButtonClick = async (rfqStatus: string) => {
    console.log(rfqStatus);

    setRfqStatus(rfqStatus); // Update the status
    await getRfqList(rfqStatus, offset, limit);
  };

  const navigateTo = async (
    rfqId: number,
    closeDate: string,
    csId: number,
    orgId: number
  ) => {
    // const result = await RfqListQuotationStatusUpdateService(regToken!, rfqId);

    setCsIdInPrItemsStore(csId);
    setRfqIdInStore(rfqId);
    setRfqOrgIdInStore(orgId);

    const closeTime = isoToDateTime(closeDate);

    setCloseDateInStore(closeTime);

    if (isQuotation) {
      setPage(7);
    } else {
      setPage(6);
    }
  };

  const [isInfoModal, setIsInfoModal] = useState<boolean>(false);

  const openInfoModal = () => {
    setIsInfoModal(true);
  };

  const closeInfoModal = () => {
    setIsInfoModal(false);
  };

  const createNewPr = () => {
    console.log(department);

    if (!department) {
      openInfoModal();
    } else {
      setIsCreateRfq(true);
      setRfqIdInStore(null);
      setRfqHeaderDetailsInStore(null);
      setPage(6);
    }
  };

  const next = async () => {
    let newOff;

    newOff = offset + limit;
    console.log(newOff);
    setOffSet(newOff);

    setPageNo((pre) => pre + 1);
    console.log(limit);
    // getHistory("", "", newOff, limit);
    getRfqList(rfqStatus, newOff, limit);
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
    getRfqList(rfqStatus, newOff, limit);
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
    getRfqList(rfqStatus, offset, newLimit);
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
            getRfqList(rfqStatus, (i - 1) * limit, limit);
          }}
          className={`w-6 h-6 text-[12px] border rounded-md ${
            pageNo === i ? "border-sky-400" : "border-transparent"
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

  return (
    <div className=" m-8">
      <InfoModal
        message="You do not have department, Please update your profile in P2P."
        isOpen={isInfoModal}
        closeModal={closeInfoModal}
      />
      <div className=" flex justify-between items-center">
        <PageTitle titleText="RFQ Preparation" />
        {/* <NavigationPan list={pan} /> */}

        <div
          className="w-44 h-8 bg-midGreen flex items-center justify-center rounded-md space-x-1 text-white cursor-pointer"
          onClick={createNewPr}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>

          <p className="font-mon text-sm">Create New RFQ</p>
        </div>
      </div>

      <div className="h-6"></div>

      {isLoading ? (
        <LogoLoading />
      ) : (
        <>
          {/* <CommonButton
            onClick={createNewPr}
            titleText="Create New RFQ"
            width="w-44"
            height="h-10"
            color="bg-midGreen"
          /> */}

          <div
            className="rounded-xl"
            style={{
              boxShadow:
                "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -2px",
            }}
          >
            <div className="w-full my-4">
              <div className=" w-full space-x-2 flex items-center border-b-[.5px] border-gray-100">
                <button
                  className={`px-4 h-10 flex justify-center flex-row  items-center  space-x-2 transition-all duration-300 ease-in-out ${
                    isSave
                      ? "border-b-[2px] border-blackishColor"
                      : " border-none"
                  }  rounded-t-md`}
                  onClick={() => {
                    handleButtonClick("SAVE");
                    handleIsSave();
                  }}
                >
                  <p
                    className={`text-sm font-semibold font-mon ${
                      isSave ? " text-[#323b45]" : "text-[#6d7c89]"
                    } `}
                  >
                    Save
                  </p>

                  <div
                    className={`font-semibold h-6 px-[6px] rounded-[4px] flex justify-center items-center font-mon text-xs ${
                      isSave
                        ? "bg-blue-500 text-white"
                        : "bg-[#e3ebfd] text-[#383abd]"
                    }`}
                  >
                    {savedTotal}
                  </div>
                </button>

                <button
                  className={`px-4 h-10 flex justify-center flex-row  items-center  space-x-2 transition-all duration-300 ease-in-out ${
                    isSubmit
                      ? " border-b-[2px] border-blackishColor"
                      : "border-none"
                  } rounded-t-md`}
                  onClick={() => {
                    handleButtonClick("SUBMIT");
                    handleIsSubmit();
                  }}
                >
                  <p
                    className={`text-sm font-semibold font-mon ${
                      isSubmit ? " text-[#323b45]" : "text-[#6d7c89]"
                    } `}
                  >
                    Published RFQ
                  </p>

                  <div
                    className={`font-semibold h-6 px-[6px] rounded-[4px] flex justify-center items-center font-mon text-xs ${
                      isSubmit
                        ? "bg-[#22c55e] text-white"
                        : "bg-[#dbf6e5] text-[#118d57]"
                    }`}
                  >
                    {submitTotal}
                  </div>
                </button>
                {/* <button
                  className={`px-4 h-10 flex justify-center flex-row  items-center  space-x-2 transition-all duration-300 ease-in-out ${
                    isCsDone
                      ? " border-b-[2px] border-blackishColor"
                      : "border-none"
                  } rounded-t-md`}
                  onClick={() => {
                    handleButtonClick("SUBMIT");
                    handleIsCs();
                  }}
                >
                  <p
                    className={`text-sm font-semibold font-mon ${
                      isCsDone ? " text-[#323b45]" : "text-[#6d7c89]"
                    } `}
                  >
                    Cs Created
                  </p>

                  <div
                    className={`font-semibold h-6 px-[6px] rounded-[4px] flex justify-center items-center font-mon text-xs ${
                      isCsDone
                        ? "bg-[#22c55e] text-white"
                        : "bg-[#dbf6e5] text-[#118d57]"
                    }`}
                  >
                    {csTotal}
                  </div>
                </button> */}

                <button
                  className={`px-4 h-10 flex justify-center flex-row  items-center  space-x-2 transition-all duration-300 ease-in-out ${
                    isQuotation
                      ? "border-b-[2px] border-blackishColor"
                      : "border-none"
                  } rounded-t-md`}
                  onClick={() => {
                    handleButtonClick("SUBMIT");
                    handleIsQuotation();
                  }}
                >
                  <p
                    className={`text-sm font-semibold font-mon ${
                      isQuotation ? " text-[#323b45]" : "text-[#6d7c89]"
                    } `}
                  >
                    Supplier's Quotation
                  </p>
                  <div
                    className={`font-semibold h-6 px-[6px] rounded-[4px] flex justify-center items-center font-mon text-xs ${
                      isQuotation
                        ? "bg-orange-500 text-white"
                        : "bg-[#fde6d9] text-[#af6337]"
                    }`}
                  >
                    {submitTotal}
                  </div>
                </button>
              </div>

              <div className="h-3"></div>

              {
                <div>
                  {rfqList.length === 0 ? (
                    <div>
                      <div className="h-12"></div>
                      <div className=" w-full flex justify-center items-center">
                        <p className=" largeText">No Rfq Found</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-auto max-h-[400px] custom-scrollbar">
                        <table
                          className="min-w-full divide-y divide-gray-200 border-[0.2px] border-borderColor rounded-md"
                          style={{ tableLayout: "fixed" }}
                        >
                          <thead className="sticky top-0 bg-[#CAF4FF] h-14">
                            <tr>
                              <th className=" font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor whitespace-nowrap">
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

                              {rfqList.some(
                                (rfq) => rfq.RFQ_STATUS !== "SAVE"
                              ) && (
                                <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor whitespace-nowrap">
                                  Remaining Time
                                </th>
                              )}
                              <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                                Buyer Name
                              </th>
                              <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                                Status
                              </th>

                              {/* Add more header columns as needed */}
                            </tr>
                          </thead>

                          <tbody>
                            {rfqList.map((rfq, index) => (
                              <tr
                                onClick={() => {
                                  navigateTo(
                                    rfq.RFQ_ID,
                                    rfq.CLOSE_DATE,
                                    rfq.CS_ID,
                                    rfq.ORG_ID
                                  );
                                }}
                                className={`cursor-pointer w-full divide-y divide-gray-200 odd:bg-white even:bg-gray-50`}
                                key={index}
                              >
                                <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor border-b-[.4px] border-gray-200">
                                  {/* {index + 1} */}
                                  {pageNo === 1
                                    ? pageNo + index
                                    : offset + 1 + index}
                                </td>
                                <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                                  {rfq.RFQ_ID}
                                </td>
                                <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                                  {rfq.RFQ_SUBJECT === ""
                                    ? "N/A"
                                    : rfq.RFQ_SUBJECT}
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

                                {rfq.RFQ_STATUS !== "SAVE" && (
                                  <td
                                    className={`font-mon h-12 px-6 py-3 text-left text-[14px] ${
                                      rfq.remainingTime === "0 days"
                                        ? "text-red-500"
                                        : "text-green-500"
                                    }`}
                                  >
                                    {rfq.remainingTime}
                                  </td>
                                )}
                                <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                                  {rfq.BUYER_NAME === ""
                                    ? "N/A"
                                    : rfq.BUYER_NAME}
                                </td>
                                <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                                  {rfq.RFQ_STATUS === "SAVE" && (
                                    <div className="text-xs font-mon font-semibold text-[#006C9C] py-1 px-2 rounded-md flex justify-center bg-[#CCE2EB]">
                                      Save
                                    </div>
                                  )}

                                  <div className="text-xs font-mon font-semibold py-1 px-2 rounded-md flex justify-center">
                                    {rfq.RFQ_STATUS === "SUBMIT" && (
                                      <>
                                        {new Date(rfq.CLOSE_DATE) <=
                                          new Date() && ( // Compare close date with current date
                                          <div className="bg-red-500 text-whiteColor py-1 px-2 rounded-md flex justify-center">
                                            Close
                                          </div>
                                        )}
                                        {new Date(rfq.CLOSE_DATE) >
                                          new Date() && ( // Compare close date with current date
                                          <div className="bg-green-500 text-whiteColor py-1 px-2 rounded-md flex justify-center">
                                            Open
                                          </div>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* <div className=" h-12"></div> */}
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

                      {/* new pagination start */}

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
                      {/* new pagination end */}

                      <div className=" h-4"></div>
                    </>
                  )}
                </div>
              }
            </div>
          </div>
        </>
      )}
    </div>
  );
}
