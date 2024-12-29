import React, { useEffect, useState } from "react";
import PageTitle from "../../common_component/PageTitle";
import { usePoPageContext } from "../../po/context/PoPageContext";
import CommonButton from "../../common_component/CommonButton";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import InvoiceListService from "../../po/service/InvoiceListService";
import { useAuth } from "../../login_both/context/AuthContext";
import InvoiceInterface from "../../po/interface/InvoiceInterface";
import LogoLoading from "../../Loading_component/LogoLoading";
import NotFoundPage from "../../not_found/component/NotFoundPage";
import { log } from "node:console";
import ArrowLeftIcon from "../../icons/ArrowLeftIcon";
import ArrowRightIcon from "../../icons/ArrowRightIcon";
import useSupplierPoStore from "../../po_supplier/store/SupplierPoStore";
import useBuyerPoStore from "../store/BuyerPoStore";

export default function SupplierInvoiceListPage() {
  const [total, setTotal] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(5);
  const [pageNo2, setPageNo2] = useState<number>(1);
  const [offset, setOffSet] = useState<number>(1);
  //token
  const { token, userId } = useAuth();
  //token

  const { setSingleInvoice, setMushokFilePath } =
    useSupplierPoStore();

  const { setPageNo, supplierIdInStore } = useBuyerPoStore()

  const back = () => {
    // setPoPageNoInContext(2);
    setPageNo(2);
  };

  const navigateToDetails = (item: InvoiceInterface) => {
    setSingleInvoice(item);
    setPageNo(6);
  };

  useEffect(() => {
    console.log("supplier store: ", supplierIdInStore);
    getInvoiceList(offset, limit, selectedPoStatus);
  }, []);

  //pagination

  const next = async () => {
    let newOff;

    newOff = offset + limit;
    console.log(newOff);
    setOffSet(newOff);

    setPageNo2((pre) => pre + 1);
    console.log(limit);
    // getHistory("", "", newOff, limit);
    getInvoiceList(newOff, limit, selectedPoStatus);
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
    getInvoiceList(newOff, limit, selectedPoStatus);
  };

  const dividePage = (number: number, lmt: number) => {
    console.log(number);
    if (typeof number !== "number") {
      throw new Error("Input must be a number");
    }

    const re = Math.ceil(number / lmt);

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
            getInvoiceList((i - 1) * limit, limit, selectedPoStatus);
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
  //pagination

  const [invoiceList, setInvoiceList] = useState<InvoiceInterface[] | []>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [selectedPoStatus, setSelectedPoStatus] =
    useState<string>("IN PROCESS");

  const getInvoiceList = async (ofs: number, lmt: number, ps: string) => {
    console.log("offset");

    console.log(ofs);
    console.log(ps);

    console.log(userId);

    try {
      setIsLoading(true);
      const result = await InvoiceListService(
        token!,
        null,
        ps,
        supplierIdInStore!,
        ofs,
        lmt,
        "DESC",
        "",
        "",
        "",
        ""
      );
      console.log(result.data);

      if (result.data.status === 200) {
        setInvoiceList(result.data.data);
        dividePage(result.data.total, lmt);
        setMushokFilePath(result.data.file_path);
        setIsLoading(false);
      } else {
        showErrorToast(result.data.message);
        setIsLoading(false);
      }
    } catch (error) {
      showErrorToast("Something went wrong");
      setIsLoading(false);
    }
  };

  const changePoStatus = (poStatus: string) => {
    setSelectedPoStatus(poStatus);
    switch (poStatus) {
      case "IN PROCESS":
        getInvoiceList(1, limit, "IN PROCESS");
        break;
      case "APPROVED":
        getInvoiceList(1, limit, "APPROVED");
        break;
      case "REJECTED":
        getInvoiceList(1, limit, "REJECTED");
        break;
      default:
        break;
    }
  };

  return (
    <div className=" bg-white m-8">
      <div className=" w-full flex justify-between items-center mb-4">
        <PageTitle titleText="Invoice List" />
        <CommonButton
          onClick={back}
          titleText="Back"
          color="bg-midGreen"
          height="h-8"
          width="w-20"
        />
      </div>

      <div className=" my-4 w-full flex space-x-4 items-center">
        <button
          className={`px-4 h-10 flex justify-center flex-row items-center space-x-2 bg-blue-50 rounded-t-md ${
            selectedPoStatus === "IN PROCESS"
              ? "border-b-[1px] border-blackishColor bg-blue-100"
              : ""
          }`}
          onClick={() => {
            changePoStatus("IN PROCESS");
          }}
        >
          <p className=" text-sm font-mon text-blackColor">New</p>
        </button>
        <button
          className={`px-4 h-10 flex justify-center flex-row items-center space-x-2 bg-orange-50 rounded-t-md ${
            selectedPoStatus === "APPROVED"
              ? "border-b-[1px] border-blackishColor bg-blue-100"
              : ""
          }`}
          onClick={() => {
            changePoStatus("APPROVED");
          }}
        >
          <p className=" text-sm font-mon text-blackColor">Approved</p>
        </button>
        <button
          className={`px-4 h-10 flex justify-center flex-row items-center space-x-2 bg-gray-50 rounded-t-md ${
            selectedPoStatus === "REJECTED"
              ? "border-b-[1px] border-blackishColor bg-blue-100"
              : ""
          }`}
          onClick={() => {
            changePoStatus("REJECTED");
          }}
        >
          <p className=" text-sm font-mon text-blackColor">Rejected</p>
        </button>
      </div>

      {isLoading ? (
        <div className=" w-full flex justify-center items-center">
          <LogoLoading />
        </div>
      ) : !isLoading && invoiceList.length === 0 ? (
        <div>
          <NotFoundPage />
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
                  Invoice ID
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Invoice Number
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Invoice Type
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  PO Number
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  PO Header ID
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  RFQ ID
                </th>
                {/* <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  CS Id
                </th> */}
              </tr>
            </thead>

            {invoiceList.map((e, i) => (
              <tbody
                onClick={() => {
                  navigateToDetails(e);
                }}
                key={e.INV_ID}
                className=" cursor-pointer bg-white divide-y divide-gray-200"
              >
                <tr>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {i + 1}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {e.INV_ID}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {e.INVOICE_NUM}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar ">
                    <div className="w-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                      {e.INVOICE_TYPE}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {e.PO_NUMBER}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {e.PO_HEADER_ID}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {e.RFQ_ID}
                    </div>
                  </td>
                  {/* <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {!e.CS_ID ? "N/A" : e.CS_ID}
                    </div>
                  </td> */}
                </tr>
              </tbody>
            ))}

            <tfoot className="bg-white sticky bottom-0">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider ">
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
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {" "}
                  {renderPageNumbers()}
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>

                {/* <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider "></th> */}
                {/* <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th> */}
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
      )}
    </div>
  );
}
