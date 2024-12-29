import React, { useEffect, useState } from "react";
import PageTitle from "../../common_component/PageTitle";
import { useAuth } from "../../login_both/context/AuthContext";
// import { usePoPageContext } from "../context/PoPageContext";
import { usePoPageContext } from "../../po/context/PoPageContext";
import DownloadIcon from "../../icons/DownloadIcon";
import CommonButton from "../../common_component/CommonButton";
import useSupplierPoStore from "../../po_supplier/store/SupplierPoStore";
import SupplierInvoiceDetailsService from "../../buyer_invoice/service/SupplierInvoiceDetailsService";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import PendingInvoiceDetailsInterface from "../../buyer_invoice/interface/PendingInvoiceDetailsInterface ";
import BuyerInvoiceDetailsService from "../../buyer_invoice/service/BuyerInvoiceDetailsService";
import SupplierInvoiceDetailsInterface from "../../buyer_invoice/interface/SupplierInvoiceDetailsInterface";
import moment from "moment";
import InvoiceItemInterface from "../../po/interface/invoiceItemInterface";
import isoToDateTime from "../../utils/methods/isoToDateTime";
import InvoiceApprovalHierarchyService from "../../buyer_invoice/service/InvoiceApprovalHierarchy";
import PendingInvoiceItemListService from "../../buyer_invoice/service/PendingInvoiceItemListService";
import fetchFileUrlService from "../../common_service/fetchFileUrlService";
import useBuyerPoStore from "../store/BuyerPoStore";

interface ApproverDetails {
  STAGE_ID: number;
  STAGE_LEVEL: number;
  STAGE_SEQ: number;
  APPROVER_ID: number;
  APPROVER_FULL_NAME: string;
  APPROVER_USER_NAME: string;
  PROPIC_FILE_NAME: string;
  IS_MUST_APPROVE: number;
  EMAIL_ADDRESS: string;
  ACTION_CODE: string;
  ACTION_DATE: string;
  ACTION_NOTE: string;
}

export default function BuyerInvoiceDetailsPage() {
  //token
  const { token, userId } = useAuth();
  //token
  // const { setPoPageNoInContext } = usePoPageContext();

  const { mushokFilePath, singleInvoice, setSingleInvoice, setMushokFilePath } =
    useSupplierPoStore();

  const {
    setPageNo,
    singlePo,
    setSinglePo,
    headerTermFilePath,
    setPoHeaderIdInStore,
  } = useBuyerPoStore();

  const back = () => {
    setMushokFilePath(null);
    setSingleInvoice(null);
    setPageNo(5);
  };

  useEffect(() => {
    allApprovalHierarchyList();
    getDetails();
    // allApprovalHierarchyList();
    console.log("currency: ", singleInvoice);
  }, []);

  const [total, setTotal] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(1000);
  const [pageNo2, setPageNo2] = useState<number>(1);
  const [offset, setOffSet] = useState<number>(1);

  const [invoiceItemList, setInvoiceItemList] = useState<
    InvoiceItemInterface[] | []
  >([]);
  const [isItemLoading, setIsItemLoading] = useState<boolean>(false);

  const [invoiceDetails, setInvoiceDetails] =
    useState<PendingInvoiceDetailsInterface | null>(null);

  const getDetails = async () => {
    try {
      setIsItemLoading(true);

      const result = await BuyerInvoiceDetailsService(
        token!,
        singleInvoice!.INV_ID!
      );

      if (result.statusCode === 200) {
        setInvoiceDetails(result.data);
        console.log("invoiceDetails: ", result.data);
        if (result.data.data.INVOICE_TYPE === "STANDARD") {
          getInvoiceItem(offset, limit);
        }
        setIsItemLoading(false);
      } else {
        showErrorToast(result.data.message);

        setIsItemLoading(false);
      }
    } catch (error) {
      setIsItemLoading(false);
      showErrorToast("Details Load Failed");
    }
  };

  const getInvoiceItem = async (ofs: number, lmt: number) => {
    try {
      // setIsItemLoading(true);
      console.log(singleInvoice!.INV_ID);
      console.log(ofs);
      console.log(lmt);

      const result = await SupplierInvoiceDetailsService(
        token!,
        singleInvoice!.INV_ID,
        ofs,
        lmt
      );
      if (result.statusCode === 200) {
        setInvoiceItemList(result.data.data);
        dividePage(result.data.total, lmt);
        setIsItemLoading(false);
      } else {
        showErrorToast(result.data.message);
        setIsItemLoading(false);
      }
    } catch (error) {
      showErrorToast("Something went wrong");
      setIsItemLoading(false);
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
            getInvoiceItem((i - 1) * limit, limit);
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
    getInvoiceItem(newOff, limit);
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
    getInvoiceItem(newOff, limit);
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const description = singleInvoice?.DESCRIPTION || "---";

  const CHAR_LIMIT = 10;

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const isLongDescription = description.length > CHAR_LIMIT;

  const truncatedDescription = isLongDescription
    ? `${description.substring(0, CHAR_LIMIT)}...`
    : description;

  const [imgPath, setImgPath] = useState("");

  const [hierarchyList, setHierarchyList] = useState<ApproverDetails[]>([]);

  const allApprovalHierarchyList = async () => {
    const result = await InvoiceApprovalHierarchyService(
      token!,
      singleInvoice?.USER_ID!,
      singleInvoice?.BUYER_DEPARTMENT === "Local" ||
        !singleInvoice?.BUYER_DEPARTMENT
        ? "Local Invoice Approval"
        : "Foreign Invoice Approval",
      singleInvoice?.INV_ID!
    );
    console.log(singleInvoice?.USER_ID);
    console.log(result);

    // Create a new ApproverDetails object from BUYER_STATUS
    const buyerStatusApprover: ApproverDetails = {
      STAGE_ID: 0, // Default value, adjust as needed
      STAGE_LEVEL: 0, // Default value, adjust as needed
      STAGE_SEQ: 0, // Default value, adjust as needed
      APPROVER_ID: 0, // Default value, adjust as needed
      APPROVER_FULL_NAME: singleInvoice?.BUYER_STATUS.APPROVER_FULL_NAME!,
      APPROVER_USER_NAME: "", // Default value, adjust as needed
      PROPIC_FILE_NAME: singleInvoice?.BUYER_STATUS.PROPIC_FILE_NAME!, // Default value, adjust as needed
      IS_MUST_APPROVE: 0, // Default value, adjust as needed
      EMAIL_ADDRESS: "", // Default value, adjust as needed
      ACTION_CODE: singleInvoice?.BUYER_STATUS.ACTION_CODE?.toString()!, // Convert to string to match the interface
      ACTION_DATE: singleInvoice?.BUYER_STATUS.ACTION_DATE!,
      ACTION_NOTE: singleInvoice?.BUYER_STATUS.NOTE!, // Assuming ACTION_NOTE corresponds to NOTE
    };

    // Create a new array with the buyerStatusApprover at the beginning
    const updatedHierarchyList: ApproverDetails[] = [
      buyerStatusApprover,
      ...result.data.data,
    ];

    setHierarchyList(updatedHierarchyList);
    setImgPath(result.data.profile_pic);
  };

  interface InvoiceItemInterface2 {
    USER_ID: number;
    RFQ_ID: number;
    CS_LINE_ID: number;
    ID: number;
    INV_ID: number;
    SHIPMENT_ID: number;
    SHIPMENT_LINE_ID: number;
    ITEM_CODE: string;
    ITEM_DESCRIPTION: string;
    ITEM_SPECIFICATION: string;
    UOM: string;
    BUYER_VAT_APPLICABLE: string;
    PO_HEADER_ID: string;
    PO_NUMBER: number;
    AWARD_QUANTITY: number;
    INVOICE_QTY: number;
    PRE_BILL_QTY: number;
    DESCRIPTION: string;
    LINE_TYPE_CODE: string;
    LINE_AMOUNT: number;
    ORG_ID: number;
    EXPENSE_TYPE: string;
    OFFERED_QUANTITY: number;
    SHIPPING_QUANTITY: number;
    LCM_ENABLE: string;
    EBS_GRN_QTY: number;
    EBS_RECEIVE_QTY: number;
    EBS_ACCEPT_QTY: number;
    EBS_REJECT_QTY: number;
    EBS_DELIVERED_QTY: number;
    UNIT_PRICE: number;
    PO_LINE_NUMBER: number;
    PO_LINE_ID: number;
    EBS_GRN_NO: string;
    COMMENTS: string;
  }

  const [invoiceList2, setInvoiceList2] = useState<
    InvoiceItemInterface2[] | []
  >([]);

  useEffect(() => {
    getInvoice2();
  }, []);

  const getInvoice2 = async () => {
    try {
      const result = await PendingInvoiceItemListService(
        token!,
        singleInvoice?.INV_ID!
      );

      if (result.statusCode === 200) {
        setInvoiceList2(result.data.data);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      console.log(error);
    }
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
    if (hierarchyList) {
      const fetchImages = async () => {
        const newImageUrls: ImageUrls = {};
        for (let index = 0; index < hierarchyList.length; index++) {
          const element = hierarchyList[index];
          const url = await getImage2(imgPath, element.PROPIC_FILE_NAME!);
          newImageUrls[element.APPROVER_ID] = url;
        }
        setImageUrls(newImageUrls);
        // setIsLoading(false);
      };
      fetchImages();
    }
  }, [hierarchyList, imgPath]);

  const [totalAmount, setTotalAmount] = useState<string>("");

  useEffect(() => {
    let sum = 0;

    for (let index = 0; index < invoiceList2.length; index++) {
      const element = invoiceList2[index];
      sum = sum + element.AWARD_QUANTITY * element.UNIT_PRICE;
    }
    setTotalAmount(sum.toString());
  }, [invoiceList2]);

  const retry = () => {
    console.log("retry button click");
  };

  return (
    <div className=" bg-white m-8">
      <PageTitle titleText="Invoice Details" />
      <div className=" my-4 w-full flex justify-between items-center">
        {/* left */}
        <div className=" flex space-x-2 items-center">
          {/* <button className=" w-44 h-8 flex justify-center items-center rounded-md border-[1px] border-black text-sm font-mon text-midBlack">
            View Summary
          </button>
          <button className=" w-44 h-8 flex justify-center items-center rounded-md border-[1px] border-black text-sm font-mon text-midBlack">
            View Pre Payment
          </button> */}
        </div>
        {/* left */}

        {/* right */}

        <div className=" flex space-x-2 items-center">
          {/* <button className=" flex space-x-2 items-center p-2 rounded-md  bg-gray-100 text-[#006C9C] font-mon text-sm ">
            <div className=" w-4 h-4">
              <DownloadIcon className=" w-full h-full text-[#006C9C]" />
            </div>
            <p>Download as PDF</p>
          </button> */}
          {/* <div className=" exportToExcel">Export To Excel</div> */}

          {singleInvoice?.STATUS !== "P" &&
            singleInvoice?.APPROVAL_STATUS === "APPROVED" &&
            singleInvoice?.BUYER_APPROVAL_STATUS === "APPROVED" && (
              <div className="flex items-center space-x-2">
                <div>
                  <div className="">
                    {singleInvoice?.FEEDBACK === "" ? (
                      <div className="px-2 py-1 border-[1.5px] border-red-600 rounded-md flex items-center space-x-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5 text-red-600"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                          />
                        </svg>

                        <p>{"Invoice sync to failed EBS"}</p>
                      </div>
                    ) : (
                      singleInvoice?.FEEDBACK
                    )}
                  </div>
                </div>

                <CommonButton
                  onClick={retry}
                  titleText="Invoice sync to EBS"
                  color="bg-midBlack"
                  height="h-8"
                  width="w-40"
                />
              </div>
            )}

          <CommonButton
            onClick={back}
            titleText="Back"
            color="bg-midGreen"
            height="h-8"
            width="w-36"
          />
        </div>

        {/* right */}
      </div>
      <div className=" w-full p-4 rounded-md bg-gray-100 border-[1px] border-borderColor flex justify-between items-start">
        {/* column */}
        {/* <div>
          <div className=" mb-10">
            <p className=" text-xs font-mon text-midBlack">Buyer Name</p>
            <p className=" text-sm font-mon text-midBlack">
              {!singleInvoice?.BUYER_NAME ? "---" : singleInvoice?.BUYER_NAME}
            </p>
          </div>
          <div>
            <p className=" text-xs font-mon text-midBlack">Trading Partner</p>
            <p className=" text-sm font-mon text-midBlack">{invoiceDetails?.data.supp}</p>
          </div>
        </div> */}
        {/* column */}
        {/* column */}
        <div>
          <div className=" mb-10">
            <p className=" text-xs font-mon text-midBlack">Contact Number</p>
            <p className=" text-sm font-mon text-midBlack">
              {!singleInvoice?.MOB_NUMBER_1
                ? "---"
                : singleInvoice?.MOB_NUMBER_1}
            </p>
          </div>
          <div>
            <p className=" text-xs font-mon text-midBlack">Supplier Number</p>
            <p className=" text-sm font-mon text-midBlack">
              {!singleInvoice?.SUPPLIER_SITE_MOBILE_NUMBER
                ? "---"
                : singleInvoice?.SUPPLIER_SITE_MOBILE_NUMBER}
            </p>
          </div>
        </div>
        {/* column */}
        {/* column */}
        <div>
          <div className=" mb-10">
            <p className=" text-xs font-mon text-midBlack">Operating Unit</p>
            <p className=" text-sm font-mon text-midBlack">
              {!singleInvoice?.ORG_DETAILS.NAME
                ? "---"
                : singleInvoice?.ORG_DETAILS.NAME}
            </p>
          </div>
          <div>
            <p className=" text-xs font-mon text-midBlack">Supplier Site</p>
            <p className=" text-sm font-mon text-midBlack">
              {!singleInvoice?.SUPPLIER_SITE_ADDRESS_LINE2
                ? "---"
                : singleInvoice?.SUPPLIER_SITE_ADDRESS_LINE2}
            </p>
          </div>
        </div>
        {/* column */}
        {/* column */}
        <div>
          <div className=" mb-10">
            <p className=" text-xs font-mon text-midBlack">Invoice Currency</p>
            <p className=" text-sm font-mon text-midBlack">
              {!singleInvoice?.CURRENCY_CODE
                ? "---" //age currency name silo age
                : singleInvoice?.CURRENCY_CODE}
            </p>
          </div>
          <div>
            <p className=" text-xs font-mon text-midBlack">
              Mushok/VDS/TDS Att.
            </p>
            {!singleInvoice?.MUSHOK_FILE_NAME ? (
              "---"
            ) : (
              <a
                href={`${mushokFilePath}/${singleInvoice?.MUSHOK_FILE_NAME}`}
                target="_blank"
                className=" py-[2px] px-4 border-[1px] border-dashed border-borderColor rounded-md text-midBlack font-mon"
                rel="noreferrer"
              >
                view
              </a>
            )}
          </div>
        </div>
        {/* column */}
      </div>
      <div className="w-full overflow-x-auto px-4 py-8 my-4 rounded-md bg-gray-100 border-[1px] border-borderColor">
        <div className="flex space-x-7 items-center min-w-max">
          {/* column */}
          <div className="flex-shrink-0">
            <p className="text-xs font-mon text-midBlack">Payment Status</p>
            <p className="text-sm font-mon text-midBlack">
              {!invoiceDetails?.data.EBS_PAYMENT_STATUS
                ? "---"
                : invoiceDetails?.data.EBS_PAYMENT_STATUS}
            </p>
          </div>

          {/* column */}
          <div className="flex-shrink-0">
            <p className="text-xs font-mon text-midBlack">Invoice Type</p>
            <p className="text-sm font-mon text-midBlack">
              {!singleInvoice?.INVOICE_TYPE
                ? "---"
                : singleInvoice?.INVOICE_TYPE}
            </p>
          </div>

          {/* column */}
          <div className="flex-shrink-0 w-28">
            <p className="text-xs font-mon text-midBlack">Description</p>
            <p className="text-sm font-mon text-midBlack">
              {/* {!singleInvoice?.DESCRIPTION ? "---" : singleInvoice?.DESCRIPTION} */}

              {description !== "---" ? (
                <>
                  {truncatedDescription}
                  {isLongDescription && (
                    <span
                      className="text-blue-500 cursor-pointer ml-1"
                      onClick={toggleModal}
                    >
                      See More
                    </span>
                  )}
                </>
              ) : (
                description
              )}
            </p>
          </div>

          {/* column */}
          <div className="flex-shrink-0">
            <p className="text-xs font-mon text-midBlack">Invoice Date</p>
            <p className="text-sm font-mon text-midBlack">
              {singleInvoice?.INVOICE_DATE
                ? moment(singleInvoice?.INVOICE_DATE).format("MM-DD-YYYY")
                : "---"}
            </p>
          </div>

          {/* column */}
          <div className="flex-shrink-0">
            <p className="text-xs font-mon text-midBlack">Invoice Num</p>
            <p className="text-sm font-mon text-midBlack">
              {!singleInvoice?.INVOICE_NUM ? "---" : singleInvoice?.INVOICE_NUM}
            </p>
          </div>

          {/* column */}
          {/* <div className="flex-shrink-0">
            <p className="text-xs font-mon text-midBlack">Vat</p>
            <p className="text-sm font-mon text-midBlack">15%</p>
          </div> */}

          {/* column */}
          {/* <div className="flex-shrink-0">
            <p className="text-xs font-mon text-midBlack">Tax</p>
            <p className="text-sm font-mon text-midBlack">3%</p>
          </div> */}

          {/* column */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <p className="text-xs font-mon text-midBlack">Invoice Amount</p>
            <p className="text-sm font-mon text-midBlack">
              {!singleInvoice?.TOTAL_AMOUNT
                ? "---"
                : singleInvoice?.TOTAL_AMOUNT}
            </p>
          </div>

          {/* column */}
          <div className="flex-shrink-0">
            <p className="text-xs font-mon text-midBlack">Payee Bank Name</p>
            <p className="text-sm font-mon text-midBlack">
              {!singleInvoice?.SUPPLIER_BANK_NAME
                ? "---"
                : singleInvoice?.SUPPLIER_BANK_NAME}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full overflow-x-auto px-4 py-8 my-4 rounded-md bg-gray-100 border-[1px] border-borderColor">
        <div className="flex space-x-7 items-center min-w-max">
          <div className="flex-shrink-0 flex flex-col items-center">
            <p className="text-xs font-mon text-midBlack">Request Status</p>
            <p className="text-sm font-mon text-midBlack">
              {!invoiceDetails?.data.APPROVAL_STATUS
                ? "---"
                : invoiceDetails?.data.APPROVAL_STATUS}
            </p>
          </div>
          <div className="flex-shrink-0 flex flex-col items-center">
            <p className="text-xs font-mon text-midBlack">Payment Status</p>
            <p className="text-sm font-mon text-midBlack">
              {!invoiceDetails?.data.EBS_PAYMENT_STATUS
                ? "---"
                : invoiceDetails?.data.EBS_PAYMENT_STATUS}
            </p>
          </div>
          <div className="flex-shrink-0 flex flex-col items-center">
            <p className="text-xs font-mon text-midBlack">Paid Amount</p>
            <p className="text-sm font-mon text-midBlack">
              {!invoiceDetails?.data.EBS_PAYMENT_AMOUNT
                ? "---"
                : invoiceDetails?.data.EBS_PAYMENT_AMOUNT}
            </p>
          </div>
          <div className="flex-shrink-0 flex flex-col items-center">
            <p className="text-xs font-mon text-midBlack">
              EBS Approval Status
            </p>
            <p className="text-sm font-mon text-midBlack">
              {!invoiceDetails?.data.EBS_APPROVAL_STATUS
                ? "---"
                : invoiceDetails?.data.EBS_APPROVAL_STATUS}
            </p>
          </div>
          {singleInvoice?.INVOICE_TYPE === "STANDARD" ? (
            <div className="flex-shrink-0 flex flex-col items-center">
              <p className="text-xs font-mon text-midBlack">
                Cash or bank paid amount
              </p>
              <p className="text-sm font-mon text-midBlack">
                {!invoiceDetails?.data.CASH_OR_BANK_PAYMENT
                  ? "---"
                  : invoiceDetails?.data.CASH_OR_BANK_PAYMENT}
              </p>
            </div>
          ) : null}
          {singleInvoice?.INVOICE_TYPE === "STANDARD" ? (
            <div className="flex-shrink-0 flex flex-col items-center">
              <p className="text-xs font-mon text-midBlack">Unpaid Amount</p>
              <p className="text-sm font-mon text-midBlack">
                {!invoiceDetails?.data.UNPAID_AMOUNT
                  ? "---"
                  : invoiceDetails?.data.UNPAID_AMOUNT}
              </p>
            </div>
          ) : null}
          {singleInvoice?.INVOICE_TYPE === "STANDARD" ? (
            <div className="flex-shrink-0 flex flex-col items-center">
              <p className="text-xs font-mon text-midBlack">
                Prepayment Adjusted
              </p>
              <p className="text-sm font-mon text-midBlack">
                {!invoiceDetails?.data.PREPAY_ADJUSTED_AMOUNT
                  ? "---"
                  : invoiceDetails?.data.PREPAY_ADJUSTED_AMOUNT}
              </p>
            </div>
          ) : null}

          {singleInvoice?.INVOICE_TYPE !== "STANDARD" ? (
            <div className="flex-shrink-0 flex flex-col items-center">
              <p className="text-xs font-mon text-midBlack">Adjusted amount</p>
              <p className="text-sm font-mon text-midBlack">
                {!invoiceDetails?.data.PREPAY_ADJUSTED_AMOUNT
                  ? "0"
                  : invoiceDetails.data.PREPAY_ADJUSTED_AMOUNT}
              </p>
            </div>
          ) : null}

          {singleInvoice?.INVOICE_TYPE !== "STANDARD" ? (
            <div className="flex-shrink-0 flex flex-col items-center">
              <p className="text-xs font-mon text-midBlack">
                Available Prepayment Amount
              </p>
              <p className="text-sm font-mon text-midBlack">
                {!invoiceDetails?.data.PREPAY_AVAILABLE_AMOUNT
                  ? "0"
                  : invoiceDetails?.data.PREPAY_AVAILABLE_AMOUNT}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {singleInvoice?.INVOICE_TYPE !==
      "STANDARD" ? null : invoiceItemList.length === 0 ? (
        <div className=" w-full flex justify-center items-center">
          <p className=" largeText">No Item Found</p>
        </div>
      ) : (
        <div className="overflow-auto max-h-[400px] rounded-lg shadow-lg custom-scrollbar">
          <table className="min-w-full divide-y divide-gray-200 rounded-lg">
            <thead className="bg-[#CAF4FF] sticky top-0 ">
              <tr>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  SL
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Item Description
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Specification
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  UOM
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Offer Quantity
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Award Quantity
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  GRN Quantity
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Pre bill Qty
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Qty Unbilled
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Qty rejected
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Unit Price
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Vat
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Total Price
                </th>
              </tr>
            </thead>

            {invoiceList2.map((e, i) => (
              <tbody key={i} className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {i + 1}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar ">
                    <div className="w-80 overflow-auto custom-scrollbar text-center flex justify-center items-center">
                      {!e.ITEM_DESCRIPTION ? "-" : e.ITEM_DESCRIPTION}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-80 overflow-auto custom-scrollbar text-center">
                      {!e.ITEM_SPECIFICATION ? "-" : e.ITEM_SPECIFICATION}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {!e.UOM ? "-" : e.UOM}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {!e.OFFERED_QUANTITY ? "-" : e.OFFERED_QUANTITY}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {!e.AWARD_QUANTITY ? "-" : e.AWARD_QUANTITY}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {!e.EBS_GRN_QTY ? "-" : e.EBS_GRN_QTY}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {!e.PRE_BILL_QTY ? "-" : e.PRE_BILL_QTY}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {e.AWARD_QUANTITY - e.PRE_BILL_QTY}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {!e.EBS_REJECT_QTY ? "-" : e.EBS_REJECT_QTY}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {!e.UNIT_PRICE ? "-" : e.UNIT_PRICE}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      <div
                        className={` border-[1px] border-borderColor w-4 h-4 rounded-[4px] flex justify-center items-center ${
                          e.BUYER_VAT_APPLICABLE === "Y"
                            ? "bg-midGreen"
                            : "bg-white"
                        }`}
                      >
                        <img
                          src="/images/check.png"
                          alt="check"
                          className=" w-2 h-2"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {e.AWARD_QUANTITY * e.UNIT_PRICE}
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
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {totalAmount}
                </th>

                {/* <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grand Total
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  999
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  777
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  666
                </th> */}
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <div className="py-4">
        {hierarchyList.length === 0 ? (
          <div className=" w-full flex justify-center items-center font-mon">
            No Hierarchy Found
          </div>
        ) : (
          <div className="border border-solid p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Approval Hierarchy</h2>
            <table className="min-w-full bg-white rounded-md">
              <thead className="rounded-md">
                <tr className="bg-[#CAF4FF] rounded-md text-sm">
                  <th className="py-4 px-4 border-b  text-left font-semibold">
                    SL
                  </th>
                  <th className="py-4 px-4 border-b  text-left font-semibold">
                    Name
                  </th>
                  <th className="py-4 px-4 border-b  text-left font-semibold">
                    Date
                  </th>
                  <th className="py-4 px-4 border-b  text-left font-semibold">
                    Note
                  </th>
                  <th className="py-4 px-4 border-b  text-left font-semibold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {hierarchyList.map((approval, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-2 px-4 text-left">{i + 1}</td>
                    <td className="py-2 px-4">
                      <div className="flex gap-2 items-center justify-start">
                        {approval.PROPIC_FILE_NAME ? (
                          <div>
                            <img
                              // src={`${imgPath}/` + approval.PROPIC_FILE_NAME}
                              src={imageUrls[approval.APPROVER_ID]!}
                              alt=""
                              className="w-10 h-10 rounded-full"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              className="size-6"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                              />
                            </svg>
                          </div>
                        )}
                        <div>
                          <p>
                            {!approval.APPROVER_FULL_NAME
                              ? "---"
                              : approval.APPROVER_FULL_NAME}
                          </p>
                          <p className="text-[#637381] text-sm">
                            {approval.EMAIL_ADDRESS}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-4 text-left">
                      {!approval.ACTION_DATE || approval.ACTION_DATE === "--"
                        ? "---"
                        : isoToDateTime(approval.ACTION_DATE)}
                    </td>
                    <td className="py-2 px-4 text-left">
                      {approval.ACTION_NOTE ? approval.ACTION_NOTE : "---"}
                    </td>
                    {approval.ACTION_CODE === "0" ? (
                      <td className="py-2 px-4  font-semibold">
                        <div className="flex justify-start items-center rounded-md">
                          <p className="bg-[#ffe4de] text-[#ca534d] text-sm rounded-md px-3 py-1">
                            Rejected
                          </p>
                        </div>
                      </td>
                    ) : approval.ACTION_CODE === "1" ? (
                      <td className="py-2 px-4  font-semibold">
                        <div className="flex justify-start items-center rounded-md">
                          <p className="bg-[#dbf6e5] text-[#118d57] text-sm rounded-md px-3 py-1">
                            Approved
                          </p>
                        </div>
                      </td>
                    ) : (
                      <td className="py-2 px-4  font-semibold">
                        <div className="flex justify-start items-center rounded-md">
                          <p className="bg-[#fff1d6] text-[#b97206] text-sm rounded-md px-3 py-1">
                            Pending
                          </p>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded shadow-lg max-w-lg w-full">
            <div className="w-full flex justify-between items-center">
              <h2 className="text-lg font-bold mb-2">Description</h2>
              <button
                className="bg-gray-300 w-6 h-6 rounded-full flex items-center justify-center"
                onClick={toggleModal}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-sm text-midBlack">{description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
