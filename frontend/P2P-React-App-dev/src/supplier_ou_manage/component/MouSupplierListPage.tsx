import React, { useState, useRef, useEffect } from "react";
import PageTitle from "../../common_component/PageTitle";
import NavigationPan from "../../common_component/NavigationPan";

import Popper from "@mui/material/Popper";
import ReusablePaginationComponent from "../../common_component/ReusablePaginationComponent";
import ReusablePopperComponent from "../../common_component/ReusablePopperComponent";
import CommonSearchField from "../../common_component/CommonSearchField";
import { useAuth } from "../../login_both/context/AuthContext";
import { useMouPageContext } from "../context/MouPageContext";

import SupplierInterface from "../../manage_supplier/interface/SupplierInterface";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";
// import RegisteredSupplierListNeedToApproveService from '../service/RegisteredSupplierListNeedToApproveService';
import LogoLoading from "../../Loading_component/LogoLoading";

import NotFoundPage from "../../not_found/component/NotFoundPage";
import { CSVLink } from "react-csv";
import moment from "moment";
import RegisteredSupplierListNeedToApproveService from "../../manage_supplier/service/RegisteredSupplierListNeedToApproveService";
import SupplierListService from "../service/SupplierListService";
import ApprovedSupplierInterface from "../interface/ApprovedSupplierInterface";
import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";
import ArrowLeftIcon from "../../icons/ArrowLeftIcon";
import ArrowRightIcon from "../../icons/ArrowRightIcon";
const pan = ["Home", "Suppliers"];

export default function MouSupplierListPage() {
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  // const [limit, setLimit] = useState(5);
  // const [pageNo, setPageNo] = useState(1);
  const [isApprovedSupplier, setIsApprovedSupplier] = useState(false);

  const [searchInput, setSearchInput] = useState<string | "">("");

  const { setPage } = useMouPageContext();

  const { token, setSupplierId } = useAuth();

  const [total, setTotal] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(10);
  const [pageNo, setPageNo] = useState<number>(1);
  const [offset, setOffSet] = useState<number>(1);

  const navigateTo = (userId: number) => {
    setPage(2);
    setSupplierId(userId);
    console.log(userId);
  };

  const pending = "IN PROCESS";
  const approved = "APPROVED";

  useEffect(() => {
    getSupplierList(offset, limit);
  }, []);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profilePicOnePath, setProfilePicOnePath] = useState<string>("");
  const [profilePicTwoPath, setProfilePicTwoPath] = useState<string>("");
  const [supplierList, setSUpplierList] = useState<
    ApprovedSupplierInterface[] | []
  >([]);

  const getSupplierList = async (offsetStart: number, limitEnd: number) => {
    setIsLoading(true);

    try {
      const result = await SupplierListService(
        token!,
        1,
        "APPROVED",
        "",
        1,
        searchInput,
        offsetStart,
        limitEnd
      );
      if (result.data.status === 200) {
        setProfilePicOnePath(result.data.profile_pic1);
        setProfilePicTwoPath(result.data.profile_pic2);
        console.log("data:", result.data);
        setSUpplierList(result.data.data);
        dividePage(result.data.total, limit);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      showErrorToast("Something went wrong");
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
    getSupplierList(newOff, limit);
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
    getSupplierList(newOff, limit);
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
            const newOffset = i === 1 ? 1 : (i - 1) * limit + 1;
            setOffSet(newOffset);
            getSupplierList(newOffset, limit);
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
  //pagination

  //search
  const handleSearchInputChange = (val: string) => {
    setSearchInput(val);
  };

  const search = () => {
    getSupplierList(offset, limit);
  };

  //csv header
  let fileName = moment(Date()).format("DD/MM/YYYY");
  const headers = [
    { label: "USER ID", key: "USER_ID" },
    { label: "USER NAME", key: "USER_NAME" },
    { label: "FULL NAME", key: "FULL_NAME" },
    { label: "ORGANIZATION NAME", key: "ORGANIZATION_NAME" },
    { label: "SUPPLIER ID", key: "SUPPLIER_ID" },
    { label: "APPROVAL STATUS", key: "APPROVAL_STATUS" },
    { label: "EMAIL ADDRESS", key: "EMAIL_ADDRESS" },
    { label: "SUBMISSION STATUS", key: "SUBMISSION_STATUS" },
    { label: "REG_COMPLETE", key: "IS_REG_COMPLETE" },
    { label: "PROFILE PIC1 FILE NAME", key: "PROFILE_PIC1_FILE_NAME" },
    { label: "PROFILE PIC2 FILE NAME", key: "PROFILE_PIC2_FILE_NAME" },
  ];
  return (
    <div className=" m-8">
      <SuccessToast />
      <div className=" flex flex-col items-start">
        <PageTitle titleText="Supplier List" />
        {/* <NavigationPan list={pan} /> */}
      </div>
      <div className="h-4"></div>
      <div className=" w-full flex justify-between items-center">
        <CommonSearchField
          onChangeData={handleSearchInputChange}
          search={search}
          placeholder="Search Here"
          inputRef={searchInputRef}
          width="w-60"
        />

        {/* {isLoading ? (
          <div className=" flex w-full justify-items-center items-center">
            <CircularProgressIndicator />
          </div>
        ) : !isLoading && supplierList.length === 0 ? (
          <div></div>
        ) : (
          
        )} */}

        {supplierList.length === 0 ? null : (
          <CSVLink
            data={supplierList!}
            headers={headers}
            filename={`supplier_list_${fileName}.csv`}
          >
            <div className=" exportToExcel ">Export to Excel</div>
          </CSVLink>
        )}
      </div>
      <div className="h-4"></div>
      <div className=" ">
        {isLoading ? (
          <div className=" w-full flex justify-center items-center">
            <LogoLoading />
          </div>
        ) : !isLoading && supplierList.length === 0 ? (
          <NotFoundPage />
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
                      Image
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      Organization
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      Email
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      Status
                    </th>
                  </tr>
                </thead>

                {supplierList.map((e, i) => (
                  <tbody
                    onClick={() => {
                      navigateTo(e.USER_ID);
                    }}
                    key={e.SUPPLIER_ID}
                    className=" cursor-pointer bg-white divide-y divide-gray-200"
                  >
                    <tr>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {offset + i}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar ">
                        <div className="w-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                          <div className="w-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                            {e.PROFILE_PIC1_FILE_NAME === "" ? (
                              <div className="w-10 h-10 rounded-full border-[1px] border-gray-400 flex items-center justify-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-6 h-6 "
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                                  />
                                </svg>
                              </div>
                            ) : (
                              <img
                                src={`${profilePicOnePath}/${e.PROFILE_PIC1_FILE_NAME}`}
                                alt="avatar"
                                className="h-9 w-9 rounded-full bg-cover"
                              />
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {!e.ORGANIZATION_NAME ? "N/A" : e.ORGANIZATION_NAME}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {!e.EMAIL_ADDRESS ? "N/A" : e.EMAIL_ADDRESS}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full   text-center">
                          <span className=" bg-[#dbf6e5] text-[#118d57] font-semibold  px-3 py-1 rounded-md">
                            {!e.APPROVAL_STATUS ? "N/A" : e.APPROVAL_STATUS}
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
            </div>
            {/* <div className="overflow-x-auto">
              <table
                className="min-w-full divide-y divide-gray-200"
                style={{ tableLayout: "fixed" }}
              >
                <thead className="sticky top-0 bg-[#F4F6F8] h-14">
                  <tr>
                    <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  ">
                      SL
                    </th>
                    
                    <th className=" font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor tracking-wider">
                      Image
                    </th>
                    <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  tracking-wider">
                      Organization
                    </th>
                    <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  tracking-wider">
                      Email
                    </th>
                    <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>

           
                {isLoading ? (
                  
                  <tbody>
                    <td></td>
                    <td></td>
                    <td>
                      {" "}
                      <LogoLoading />
                    </td>
                    <td></td>
                    <td></td>
                  </tbody>
                ) : !isLoading && supplierList.length === 0 ? (
                  <tbody>
                    <td></td>
                    <td></td>
                    <td>
                      {" "}
                      <NotFoundPage />
                    </td>
                    <td></td>
                    <td></td>
                  </tbody>
                ) : (
                  supplierList.map((e, i) => (
                    <tbody
                      onClick={() => {
                        navigateTo(e.USER_ID);
                      }}
                      className=" cursor-pointer
                              bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]"
                      key={e.SUPPLIER_ID}
                    >
                      <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor font-medium">
                        {offset + i}
                      </td>

                     

                      <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                        <div className="w-full overflow-auto custom-scrollbar text-center flex justify-start items-center">
                          <img
                            src={`${profilePicOnePath}/${e.PROFILE_PIC1_FILE_NAME}`}
                            alt="avatar"
                            className="h-9 w-9 rounded-full bg-cover"
                          />
                        </div>
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                        
                        {e.ORGANIZATION_NAME == null
                          ? "N/A"
                          : e.ORGANIZATION_NAME}
                      </td>

                      <td className=" w-64 font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                        {e.EMAIL_ADDRESS == null ? "N/A" : e.EMAIL_ADDRESS}
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-left text-[10px] font-bold">
                        
                        <span className=" bg-[#dbf6e5] text-[#118d57] px-3 py-2 rounded-md">
                          {e.APPROVAL_STATUS == null
                            ? "N/A"
                            : e.APPROVAL_STATUS}
                        </span>
                      </td>
                    </tbody>
                  ))
                )}

                <tfoot className="sticky bottom-0 bg-white">
                  <tr className=" h-12">
                    <td></td>
                   
                  </tr>
                </tfoot>
              </table>
            </div> */}

            <div className="bg-white sticky bottom-0 w-full flex items-center justify-between px-6 mt-4">
              <div className="w-1/4">
                {pageNo !== 1 && (
                  <button
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
          </>
        )}
        <div className="h-1"></div>
      </div>
    </div>
  );
}
