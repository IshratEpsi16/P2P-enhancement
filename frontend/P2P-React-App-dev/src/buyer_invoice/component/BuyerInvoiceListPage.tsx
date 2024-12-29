import React, { useState, useRef, useEffect } from "react";
import PageTitle from "../../common_component/PageTitle";
import NavigationPan from "../../common_component/NavigationPan";
import CommonSearchField from "../../common_component/CommonSearchField";
import DateRangePicker from "../../common_component/DateRangePicker";
import useBuyerInvoiceStore from "../store/buyerInvoiceStore";

import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";
import LogoLoading from "../../Loading_component/LogoLoading";
import moment from "moment";
import BuyerInvoiceListService from "../service/BuyerInvoiceListService";
import BuyerInvoiceDetailsService from "../service/BuyerInvoiceDetailsService";
import { useAuth } from "../../login_both/context/AuthContext";
import CommonButton from "../../common_component/CommonButton";
import { CSVLink } from "react-csv";
import ArrowLeftIcon from "../../icons/ArrowLeftIcon";
import ArrowRightIcon from "../../icons/ArrowRightIcon";
import Invoice from "../interface/InvoiceInterface";
import InvoiceInterface from "../../po/interface/InvoiceInterface";
import fetchFileUrlService from "../../common_service/fetchFileUrlService";

const pan = ["Home", "Invoice List"];

export default function BuyerInvoiceListPage() {
  const { token } = useAuth();
  const [total, setTotal] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(5);
  const [pageNo2, setPageNo2] = useState<number>(1);
  const [offset, setOffSet] = useState<number>(0);

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [invoiceList, setInvoiceList] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [profilePicPath, setProfilePicPath] = useState<string>("");
  const {
    selectedInvoiceDetails,
    setSelectedInvoiceDetails,
    invoiceDetails,
    setInvoiceDetails,
    setSelectedInvoiceDetailsBank,
    setSelectedInvoiceDetailsSite,
    setImgPath,
    setInvoiceId,
    setSelectedInvoice,
    setPoTermFilePathInBuyerInvoice,
  } = useBuyerInvoiceStore();

  const handleSearchInputChange = (val: string) => {
    setSearchInput(val);
  };
  console.log(searchInput);

  useEffect(() => {
    AllInvoiceList(offset, limit, selectedInvoiceStatus);
  }, []);

  const [selectedInvoiceStatus, setSelectedInvoiceStatus] =
    useState<string>("IN PROCESS");

  const AllInvoiceList = async (
    ofs: number,
    lmt: number,
    selectedStatus: string
  ) => {
    setIsLoading(true);
    const result = await BuyerInvoiceListService(
      token!,
      selectedStatus,
      searchInput,
      ofs,
      lmt
    );
    console.log(result.data);
    setImgPath(result.data.profile_pic1);
    setProfilePicPath(result.data.profile_pic1);
    setPoTermFilePathInBuyerInvoice(result.data.header_term_file_path);
    console.log(result.data.profile_pic1);
    // Ensure that result.data is an array
    if (Array.isArray(result.data.data)) {
      setInvoiceList(result.data.data);
      dividePage(result.data.total, lmt);
      // setInvoiceDetails(result.data.data);
    } else {
      setInvoiceList([]);
    }
    setIsLoading(false);
  };

  interface ImageUrls {
    [key: number]: string | null;
  }

  const [imageUrls, setImageUrls] = useState<ImageUrls>({});

  // ... other state and functions

  const getImage2 = async (
    filePath: string,
    fileName: string
  ): Promise<string | null> => {
    try {
      const url = await fetchFileUrlService(filePath, fileName, token!);
      return url;
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  };

  useEffect(() => {
    if (invoiceList) {
      const fetchImages = async () => {
        const newImageUrls: ImageUrls = {};
        for (let index = 0; index < invoiceList.length; index++) {
          const element = invoiceList[index];
          const url = await getImage2(
            profilePicPath,
            element.PROFILE_PIC1_FILE_NAME
          );
          newImageUrls[element.INV_ID] = url;
        }
        setImageUrls(newImageUrls);
        // setIsLoading(false);
      };
      fetchImages();
    }
  }, [invoiceList, profilePicPath]);

  const searchInvoiceList = async (ofs: number, lmt: number) => {
    setIsLoading(true);
    const result = await BuyerInvoiceListService(
      token!,
      selectedInvoiceStatus,
      searchInput,
      ofs,
      lmt
    );
    console.log(result.data.data);
    setImgPath(result.data.profile_pic1);
    console.log(result.data.profile_pic1);
    // Ensure that result.data is an array
    if (Array.isArray(result.data.data)) {
      setInvoiceList(result.data.data);
      // setInvoiceDetails(result.data.data);
      dividePage(result.data.total, lmt);
    } else {
      setInvoiceList([]);
    }
    setIsLoading(false);
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
            AllInvoiceList((i - 1) * limit, limit, selectedInvoiceStatus);
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
    AllInvoiceList(newOff, limit, selectedInvoiceStatus);
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
    AllInvoiceList(newOff, limit, selectedInvoiceStatus);
  };

  const dividePage = (number: number, lmt: number) => {
    console.log(number);
    if (typeof number !== "number") {
      throw new Error("Input must be a number");
    }

    const re = Math.ceil(number / lmt);

    setTotal(re);
  };

  console.log(invoiceList);
  // toggle
  const [isSubmitted, setIsSubmitted] = useState<boolean>(true);
  // toggle

  // store
  const { setPageNo } = useBuyerInvoiceStore();
  // store

  const navigateTo = async (item: Invoice) => {
    // setIsLoading(true);
    // setInvoiceDetails(item);
    const id = item?.INV_ID;
    setInvoiceId(id);
    setSelectedInvoice(item);
    console.log(item?.INV_ID);
    // if (token) {
    //   const result = await BuyerInvoiceDetailsService(token, id);
    //   console.log(result.data.site_details);
    //   // setInvoiceDetails(result.data.details);
    //   setSelectedInvoiceDetailsBank(result.data.bank_details);
    //   setSelectedInvoiceDetailsSite(result.data.site_details);
    // }
    // // setIsLoading(false);

    setPageNo(2);
  };
  const handleInvoiceDetails = (item: any) => {
    console.log(item);
  };

  const navigateToPrepaymentList = () => {
    setPageNo(3);
  };

  let fileName = moment(Date()).format("DD/MM/YYYY");
  const headers = [
    { label: "INV_ID", key: "INV_ID" },
    { label: "INVOICE_TYPE", key: "INVOICE_TYPE" },
    { label: "PO_NUMBER", key: "PO_HEADER_ID" },
    { label: "RFQ_ID", key: "RFQ_ID" },
    { label: "CS_ID", key: "CS_ID" },
    { label: "USER_ID", key: "USER_ID" },
    { label: "VENDOR_ID", key: "VENDOR_ID" },
    { label: "INVOICE_DATE", key: "INVOICE_DATE" },
    { label: "GL_DATE", key: "GL_DATE" },
    { label: "TOTAL_AMOUNT", key: "TOTAL_AMOUNT" },
    { label: "INVOICE_NUM", key: "INVOICE_NUM" },
    { label: "EBS_INVOICE_ID", key: "EBS_INVOICE_ID" },
    { label: "ORG_ID", key: "ORG_ID" },
    { label: "ORGANIZATION_ID", key: "ORGANIZATION_ID" },
    { label: "INVOICE_STATUS", key: "INVOICE_STATUS" },
    { label: "APPROVAL_STATUS", key: "APPROVAL_STATUS" },
    { label: "TEMPLATE_ID", key: "TEMPLATE_ID" },
    { label: "TEMPLATE_STAGE_LEVEL", key: "TEMPLATE_STAGE_LEVEL" },
    { label: "SITE_ID", key: "SITE_ID" },
    { label: "BANK_ID", key: "BANK_ID" },
    { label: "CURRENCY_CODE", key: "CURRENCY_CODE" },
    { label: "CREATION_DATE", key: "CREATION_DATE" },
    { label: "CREATED_BY", key: "CREATED_BY" },
    { label: "LAST_UPDATED_BY", key: "LAST_UPDATED_BY" },
    { label: "LAST_UPDATE_DATE", key: "LAST_UPDATE_DATE" },
    { label: "VENDOR_SITE_ID", key: "VENDOR_SITE_ID" },
    { label: "DESCRIPTION", key: "DESCRIPTION" },
    { label: "SOURCE", key: "SOURCE" },
    { label: "PAYMENT_METHOD_CODE", key: "PAYMENT_METHOD_CODE" },
    { label: "TERMS_ID", key: "TERMS_ID" },
    { label: "TERMS_NAME", key: "TERMS_NAME" },
    { label: "EXCHANGE_RATE_TYPE", key: "EXCHANGE_RATE_TYPE" },
    { label: "EXCHANGE_DATE", key: "EXCHANGE_DATE" },
    { label: "INVOICE_CREATION_DATE", key: "INVOICE_CREATION_DATE" },
    { label: "STATUS", key: "STATUS" },
    { label: "FEEDBACK", key: "FEEDBACK" },
    { label: "LAST_PROCESSED_DATETIME", key: "LAST_PROCESSED_DATETIME" },
    { label: "ACCT_PAY_CONCATENATED", key: "ACCT_PAY_CONCATENATED" },
    { label: "SUPPLIER_ID", key: "SUPPLIER_ID" },
    { label: "SUPPLIER_FULL_NAME", key: "SUPPLIER_FULL_NAME" },
    { label: "SUPPLIER_USER_NAME", key: "SUPPLIER_USER_NAME" },
    { label: "ORGANIZATION_NAME", key: "ORGANIZATION_NAME" },
    { label: "EMAIL_ADDRESS", key: "EMAIL_ADDRESS" },
    { label: "PROFILE_PIC1_FILE_NAME", key: "PROFILE_PIC1_FILE_NAME" },
    { label: "PROFILE_PIC2_FILE_NAME", key: "PROFILE_PIC2_FILE_NAME" },
    { label: "ORG_NAME", key: "ORG_NAME" },
    { label: "SHIP_TO_LOCATION_NAME", key: "SHIP_TO_LOCATION_NAME" },
    { label: "CURRENCY_NAME", key: "CURRENCY_NAME" },
    { label: "MODULE_ID", key: "MODULE_ID" },
    { label: "STAGE_ID", key: "STAGE_ID" },
    { label: "STAGE_LEVEL", key: "STAGE_LEVEL" },
    { label: "STAGE_SEQ", key: "STAGE_SEQ" },
    { label: "IS_MUST_APPROVE", key: "IS_MUST_APPROVE" },
  ];

  const changeInvoiceStatus = (invoiceStatus: string) => {
    setSelectedInvoiceStatus(invoiceStatus);
    switch (invoiceStatus) {
      case "IN PROCESS":
        AllInvoiceList(0, limit, "IN PROCESS");
        break;
      case "APPROVED":
        AllInvoiceList(0, limit, "APPROVED");
        break;
      case "REJECTED":
        AllInvoiceList(0, limit, "REJECTED");
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-white m-8">
      <div className="mb-4">
        <PageTitle titleText="Invoice List" />
        {/* <NavigationPan list={pan} /> */}
      </div>

      <div className="w-full flex items-center justify-between mb-4">
        <div className="flex-1 flex space-x-4 items-center">
          <CommonSearchField
            onChangeData={handleSearchInputChange}
            search={() => {
              AllInvoiceList(0, 5, selectedInvoiceStatus);
            }}
            placeholder="Search Here"
            inputRef={searchInputRef}
            width="w-72"
          />
          {/* <CommonButton
            onClick={navigateToPrepaymentList}
            color="bg-midGreen"
            width="w-44"
            titleText="Prepayment List"
          /> */}
          {/* <div className="w-80">
            <DateRangePicker
              placeholder="Date From - To"
              value={approveDates}
              onChange={handleApproveDateChange}
              width="w-80"
            />
          </div> */}
        </div>
        {invoiceList.length === 0 ? null : (
          <CSVLink
            data={invoiceList}
            headers={headers}
            filename={`invoice_list_${fileName}.csv`}
          >
            <div className="exportToExcel ">Export To Excel</div>
          </CSVLink>
        )}
      </div>

      <div className="w-full rounded-md bg-whiteColor border-[0.5px] border-borderColor">
        <div className="flex items-center">
          <div className="p-4 flex flex-row items-center space-x-3 mb-1">
            <button
              onClick={() => {
                changeInvoiceStatus("IN PROCESS");
              }}
              className={`${
                selectedInvoiceStatus === "IN PROCESS"
                  ? "bg-inputBg rounded-t-md border-b-[1px] border-borderColor"
                  : "bg-whiteColor"
              } h-10 w-auto px-4 flex items-center justify-center`}
            >
              <div className="flex flex-row space-x-1 items-center">
                <p className="text-xs font-mon font-medium text-graishColor">
                  Pending
                </p>
                {/* <div className="w-5 h-5 rounded-md bg-[#FFE9D5] flex justify-center items-center">
                  <p className="text-[#FFAB00] font-mon font-medium text-[10px]">
                    {invoiceList.length}
                  </p>
                </div> */}
              </div>
            </button>
            <button
              onClick={() => {
                changeInvoiceStatus("APPROVED");
              }}
              className={`${
                selectedInvoiceStatus === "APPROVED"
                  ? "bg-inputBg rounded-t-md border-b-[1px] border-borderColor"
                  : "bg-whiteColor"
              } h-10 w-auto px-4 flex items-center justify-center`}
            >
              <div className="flex flex-row space-x-1 items-center">
                <p className="text-xs font-mon font-medium text-graishColor">
                  APPROVED
                </p>
                {/* <div className="w-5 h-5 rounded-md bg-[#FFE9D5] flex justify-center items-center">
                  <p className="text-[#FFAB00] font-mon font-medium text-[10px]">
                    {invoiceList.length}
                  </p>
                </div> */}
              </div>
            </button>
            <button
              onClick={() => {
                changeInvoiceStatus("REJECTED");
              }}
              className={`${
                selectedInvoiceStatus === "REJECTED"
                  ? "bg-inputBg rounded-t-md border-b-[1px] border-borderColor"
                  : "bg-whiteColor"
              } h-10 w-auto px-4 flex items-center justify-center`}
            >
              <div className="flex flex-row space-x-1 items-center">
                <p className="text-xs font-mon font-medium text-graishColor">
                  REJECTED
                </p>
                {/* <div className="w-5 h-5 rounded-md bg-[#FFE9D5] flex justify-center items-center">
                  <p className="text-[#FFAB00] font-mon font-medium text-[10px]">
                    {invoiceList.length}
                  </p>
                </div> */}
              </div>
            </button>
            {/* <button
              onClick={() => {
                setIsSubmitted(!isSubmitted);
              }}
              className={`${
                !isSubmitted
                  ? "bg-inputBg rounded-t-md border-b-[1px] border-borderColor"
                  : "bg-whiteColor"
              } h-10 w-auto px-4 flex items-center justify-center`}
            >
              <div className="flex flex-row space-x-1 items-center">
                <p className="text-xs font-mon font-medium text-graishColor">
                  Approved
                </p>
                <div className="w-5 h-5 rounded-md bg-midGreen flex justify-center items-center">
                  <p className="text-whiteColor font-mon font-medium text-[10px]">
                    10
                  </p>
                </div>
              </div>
            </button> */}
          </div>

          {/* <div className="p-4 flex flex-row items-center space-x-3 mb-1">
            <button
              onClick={() => {
                setIsSubmitted(!isSubmitted);
              }}
              className={`${
                isSubmitted
                  ? "bg-inputBg rounded-t-md border-b-[1px] border-borderColor"
                  : "bg-whiteColor"
              } h-10 w-auto px-4 flex items-center justify-center`}
            >
              <div className="flex flex-row space-x-1 items-center">
                <p className="text-xs font-mon font-medium text-graishColor">
                  Pending
                </p>
                <div className="w-5 h-5 rounded-md bg-[#FFE9D5] flex justify-center items-center">
                  <p className="text-[#FFAB00] font-mon font-medium text-[10px]">
                    {invoiceList.length}
                  </p>
                </div>
              </div>
            </button>
          </div> */}
        </div>

        <div className="overflow-auto max-h-[400px] rounded-lg shadow-lg custom-scrollbar">
          {isLoading ? (
            <div className=" w-full flex justify-center items-center">
              <LogoLoading />
            </div>
          ) : invoiceList.length === 0 ? (
            <div className="flex justify-center my-5">
              <p className="font-semibold">Data Not Found</p>
            </div>
          ) : (
            <>
              <table className="min-w-full divide-y divide-gray-200 rounded-lg">
                <thead className="bg-[#CAF4FF] sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900 tracking-wider font-mon">
                      SL
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900 tracking-wider font-mon">
                      Image
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900 tracking-wider font-mon">
                      Supplier Name
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900 tracking-wider font-mon">
                      PO No.
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900 tracking-wider font-mon">
                      Created Date
                    </th>

                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900 tracking-wider font-mon">
                      Status
                    </th>
                  </tr>
                </thead>

                {invoiceList.map((e, i) => (
                  <tbody
                    key={e.INV_ID}
                    onClick={() => {
                      navigateTo(e);
                    }}
                    className="cursor-pointer bg-white divide-y divide-gray-200"
                  >
                    <tr>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {i + 1}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 h-14 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full h-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                          <div className="w-full h-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                            {e.PROFILE_PIC1_FILE_NAME === "" ? (
                              <div className="w-9 h-9 rounded-full border-[1px] border-gray-400 flex items-center justify-center">
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
                                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                                  />
                                </svg>
                              </div>
                            ) : (
                              <div className="w-10 h-10 flex items-center justify-center border-[1px] border-gray-300 rounded-full">
                                <img
                                  src={imageUrls[e.INV_ID]!}
                                  alt="avatar"
                                  className="h-9 w-9 rounded-full bg-cover"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                          {e?.SUPPLIER_FULL_NAME || "---"}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {e?.PO_NUMBER || "---"}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {/* {e?.CREATION_DATE || "---"}{" "} */}
                          {moment(e?.CREATION_DATE).format("DD-MM-YYYY") ||
                            "---"}
                        </div>
                      </td>

                      {/* <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar flex justify-center">
                        <button className="py-1 px-2 bg-[#FFE9D5] rounded-md">
                          <p className="text-sm text-[#BF7E1B] font-mon font-medium">
                            {e?.APPROVAL_STATUS}
                          </p>
                        </button>
                      </td> */}

                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-[10px] custom-scrollbar flex justify-center font-bold text-blackColor">
                        {/* <button className="py-1 px-2 bg-[#FFE9D5] rounded-md">
                          <p className="text-sm text-[#BF7E1B] font-mon font-medium">
                            {e?.APPROVAL_STATUS}
                          </p>
                        </button> */}

                        <span className="bg-[#dbf6e5]  text-[#118d57] px-2 py-1  rounded-md">
                          {e.APPROVAL_STATUS == null
                            ? "N/A"
                            : e.APPROVAL_STATUS}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                ))}

                <tfoot className="bg-white sticky bottom-0">
                  <tr>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
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
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>

                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center">
                      {renderPageNumbers()}
                    </th>

                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider "></th>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
