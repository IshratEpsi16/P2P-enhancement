import React, { useRef, useState, useEffect } from "react";
import PageTitle from "../../common_component/PageTitle";
import NavigationPan from "../../common_component/NavigationPan";
import CommonSearchField from "../../common_component/CommonSearchField";
import DateRangePicker from "../../common_component/DateRangePicker";
import { usePoPageContext } from "../context/PoPageContext";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import PoListService from "../service/PoListService";
import { useAuth } from "../../login_both/context/AuthContext";
import PoInterface from "../interface/PoInterface";
import ArrowRightIcon from "../../icons/ArrowRightIcon";
import ArrowLeftIcon from "../../icons/ArrowLeftIcon";
import LogoLoading from "../../Loading_component/LogoLoading";
import NotFoundPage from "../../not_found/component/NotFoundPage";
import useSupplierPoStore from "../../po_supplier/store/SupplierPoStore";
import moment from "moment";
import { CSVLink } from "react-csv";
import isoToDateTime from "../../utils/methods/isoToDateTime";
const pan = ["Home", "Po List"];
const list = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
export default function PoListPage() {
  const {
    setSinglePo,
    setPageNo,
    setPoNumberInStore,
    setPoHeaderInStore,
    setHeaderTermFilePath,
  } = useSupplierPoStore();
  const { token, userId } = useAuth();
  //context
  const { setPoPageNoInContext: setPoPageNo } = usePoPageContext();
  //context

  //search

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [searchInput, setSearchInput] = useState("");

  const handleSearchInputChange = (val: string) => {
    setSearchInput(val);
  };

  const search = async () => {};
  //search

  //date range
  const [approveDates, setApproveDates] = useState({
    startDate: null,
    endDate: null, // Set the endDate to the end of the current year
  });

  const handleApproveDateChange = (newValue: any) => {
    console.log("newValue:", newValue);
    setApproveDates(newValue);
  };

  //date range

  const navigateToDetails = (po: PoInterface) => {
    setSinglePo(po);
    // setPoPageNo(2);
    setPoNumberInStore(po.PO_NUMBER);
    setPoHeaderInStore(po.PO_HEADER_ID.toString());
    setPageNo(2);
  };

  const [total, setTotal] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(5);
  const [pageNo2, setPageNo2] = useState<number>(1);
  const [offset, setOffSet] = useState<number>(1);

  const [poList, setPoList] = useState<PoInterface[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [selectedPoStatus, setSelectedPoStatus] =
    useState<string>("IN PROCESS");

  useEffect(() => {
    getPoList(offset, limit, selectedPoStatus);
  }, []);

  const getPoList = async (ofs: number, lmt: number, ps: string) => {
    try {
      setIsLoading(true);
      const result = await PoListService(token!, ps, userId!, ofs, lmt); //IN PROCESS
      if (result.data.status === 200) {
        setHeaderTermFilePath(result.data.header_file_path);
        setPoList(result.data.data);
        console.log("poList: ", result.data);
        dividePage(result.data.total, lmt);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      showErrorToast("Something went wrong");
    }
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
            getPoList((i - 1) * limit, limit, selectedPoStatus);
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
    getPoList(newOff, limit, selectedPoStatus);
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
    getPoList(newOff, limit, selectedPoStatus);
  };

  const dividePage = (number: number, lmt: number) => {
    console.log(number);
    if (typeof number !== "number") {
      throw new Error("Input must be a number");
    }

    const re = Math.ceil(number / lmt);

    setTotal(re);
  };

  const changePoStatus = (poStatus: string) => {
    setSelectedPoStatus(poStatus);
    switch (poStatus) {
      case "IN PROCESS":
        getPoList(1, limit, "IN PROCESS");
        break;
      case "ACCEPTED":
        getPoList(1, limit, "ACCEPTED");
        break;
      case "REJECTED":
        getPoList(1, limit, "REJECTED");
        break;
      default:
        break;
    }
  };

  let fileName = moment(Date()).format("DD/MM/YYYY");
  const headers = [
    { label: "INVITATION_ID", key: "INVITATION_ID" },
    { label: "RFQ_ID", key: "RFQ_ID" },
    { label: "USER_ID", key: "USER_ID" },
    { label: "VENDOR_ID", key: "VENDOR_ID" },
    { label: "ADDITIONAL_EMAIL", key: "ADDITIONAL_EMAIL" },
    { label: "RESPONSE_STATUS", key: "RESPONSE_STATUS" },
    { label: "RESPONSE_DATE", key: "RESPONSE_DATE" },
    { label: "CREATION_DATE", key: "CREATION_DATE" },
    { label: "CREATED_BY", key: "CREATED_BY" },
    { label: "LAST_UPDATED_BY", key: "LAST_UPDATED_BY" },
    { label: "LAST_UPDATE_DATE", key: "LAST_UPDATE_DATE" },
    { label: "SUBMISSION_STATUS", key: "SUBMISSION_STATUS" },
    { label: "SUBMISSION_DATE", key: "SUBMISSION_DATE" },
    { label: "QUOT_VALID_DATE", key: "QUOT_VALID_DATE" },
    { label: "SITE_ID", key: "SITE_ID" },
    { label: "CURRENCY_CODE", key: "CURRENCY_CODE" },
    { label: "CAN_EDIT", key: "CAN_EDIT" },
    { label: "SUP_TERM_FILE", key: "SUP_TERM_FILE" },
    { label: "SUP_TERM_FILE_ORG_NAME", key: "SUP_TERM_FILE_ORG_NAME" },
    { label: "GENERAL_TERMS", key: "GENERAL_TERMS" },
    { label: "PO_NUMBER", key: "PO_NUMBER" },
    { label: "PO_HEADER_ID", key: "PO_HEADER_ID" },
    { label: "PO_STATUS", key: "PO_STATUS" },
    { label: "PO_REMARKS", key: "PO_REMARKS" },
    { label: "PO_ACCEPT_DATE", key: "PO_ACCEPT_DATE" },
    { label: "SUPPLIER_NOTE", key: "SUPPLIER_NOTE" },
    { label: "EMAIL_SENT_STATUS", key: "EMAIL_SENT_STATUS" },
    { label: "PO_DATE", key: "PO_DATE" },
    { label: "CONTACT_ID", key: "CONTACT_ID" },
    { label: "CURRENCY", key: "CURRENCY" },
    { label: "RFQ_DETAILS", key: "RFQ_DETAILS" },
    { label: "SHIP_TO_LOCATION", key: "SHIP_TO_LOCATION" },
    { label: "TOTAL_PO_AMOUNT", key: "TOTAL_PO_AMOUNT" },
    { label: "SHORT_CODE", key: "SHORT_CODE" },
    { label: "NAME", key: "NAME" },
    { label: "BILL_TO_LOCATION", key: "BILL_TO_LOCATION" },
  ];

  return (
    <div className=" m-8 bg-white">
      <div className=" flex flex-col items-start">
        <PageTitle titleText="PO List" />
        {/* <NavigationPan list={pan} /> */}
      </div>

      <div className=" w-full flex justify-between my-6 items-center">
        <div className=" flex-1 flex space-x-4">
          <CommonSearchField
            onChangeData={handleSearchInputChange}
            search={search}
            placeholder="Search as Order No , Org Name, Amount"
            inputRef={searchInputRef}
            width="w-80"
          />
          <div className=" w-80">
            <DateRangePicker
              placeholder="Date From - To"
              value={approveDates}
              onChange={handleApproveDateChange}
              width="w-80"
            />
          </div>
        </div>
        {/* TODO: export to excel */}
        {poList.length === 0 ? null : (
          <CSVLink
            data={poList!}
            headers={headers}
            filename={`po_list_${fileName}.csv`}
          >
            <div className=" exportToExcel ">Export to Excel</div>
          </CSVLink>
        )}
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
            selectedPoStatus === "ACCEPTED"
              ? "border-b-[1px] border-blackishColor bg-blue-100"
              : ""
          }`}
          onClick={() => {
            changePoStatus("ACCEPTED");
          }}
        >
          <p className=" text-sm font-mon text-blackColor">Accepted</p>
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
      ) : !isLoading && poList.length === 0 ? (
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
                  Purchase Order
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Organization
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Amount
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  PO Sync date
                </th>
              </tr>
            </thead>

            {poList.map((e, i) => (
              <tbody
                key={i}
                onClick={() => {
                  navigateToDetails(e);
                }}
                className="bg-white divide-y divide-gray-200 cursor-pointer"
              >
                <tr>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {i + 1}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar ">
                    <div className="w-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                      {!e.PO_NUMBER ? "N/A" : e.PO_NUMBER}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {e.OU_NAME === ""
                        ? "---"
                        : e.OU_NAME}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {!e.TOTAL_PO_AMOUNT ? "---" : e.TOTAL_PO_AMOUNT}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {isoToDateTime(e.PO_DATE)}
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
      )}
    </div>
  );
}
