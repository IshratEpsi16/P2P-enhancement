import React, { useEffect, useState, useRef } from "react";
import ApprovedSupplierInterface from "../../supplier_ou_manage/interface/ApprovedSupplierInterface";
import { useAuth } from "../../login_both/context/AuthContext";
import SupplierListService from "../../supplier_ou_manage/service/SupplierListService";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import CommonSearchField from "../../common_component/CommonSearchField";
import { CSVLink } from "react-csv";
import moment from "moment";
import NotFoundPage from "../../not_found/component/NotFoundPage";
import LogoLoading from "../../Loading_component/LogoLoading";
import CommonButton from "../../common_component/CommonButton";
import ConvertedOldSupplierInterface from "../interface/ConvertedOldSupplierInterface";
import OldSupplierInvitationService from "../service/OldSupplierInvitationService";
import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";
import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";
import ArrowRightIcon from "../../icons/ArrowRightIcon";
import ArrowLeftIcon from "../../icons/ArrowLeftIcon";

export default function InviteExistingSupplierPage() {
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const { token } = useAuth();

  const [selectedStatus, setSelectedStatus] = useState<string>("APPROVED");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  useEffect(() => {
    getSupplierList(offset, limit, selectedStatus);
  }, []);

  const [supplierList, setSUpplierList] = useState<
    ApprovedSupplierInterface[] | []
  >([]);

  const [selectedSupplierList, setSelectedSupplierList] = useState<
    ApprovedSupplierInterface[] | []
  >([]);
  const [profilePicOnePath, setProfilePicOnePath] = useState<string>("");
  const [profilePicTwoPath, setProfilePicTwoPath] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // for pagination
  const [total, setTotal] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(10);
  const [pageNo, setPageNo] = useState<number>(1);
  const [offset, setOffSet] = useState<number>(1);

  const getSupplierList = async (offsetStart: number, limitEnd: number, approvalStatus: string) => {
    setIsLoading(true);
    try {
      const result = await SupplierListService(
        token!,
        1,
        approvalStatus,
        "",
        1,
        searchInput,
        offsetStart,
        limitEnd
      );
      if (result.data.status === 200) {
        setProfilePicOnePath(result.data.profile_pic1);
        setProfilePicTwoPath(result.data.profile_pic2);
        dividePage(result.data.total, limit);
        setSUpplierList(result.data.data);
        console.log("data: ", result.data.data);
        result.data.data.forEach((supplier: ApprovedSupplierInterface) => {
          console.log("SUPPLIER_INVITATION_TYPE:", supplier.SUPPLIER_INVITATION_TYPE);
        });

        if (isSelectedAll) {
          setSelectedSupplierList([...result.data.data]);
        }
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

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setIsDropdownOpen(false); // Close dropdown after selection
    getSupplierList(offset, limit, status); // Fetch data based on the selected status
  };

  const handleSearchInputChange = (val: string) => {
    setSearchInput(val);
  };

  const search = async () => {
    getSupplierList(offset, limit, selectedStatus);
  };

  // pagination start

  const next = async () => {
    let newOff;

    newOff = offset + limit;
    console.log(newOff);
    setOffSet(newOff);

    setPageNo((pre) => pre + 1);
    console.log(limit);
    // getHistory("", "", newOff, limit);
    getSupplierList(newOff, limit, selectedStatus);
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
    getSupplierList(newOff, limit, selectedStatus);
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
            const newOffset = i === 1 ? 1 : (i - 1) * limit + 1;
            setOffSet(newOffset);
            getSupplierList(newOffset, limit, selectedStatus);
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
  // new pagination end

  // pagination end

  let fileName = moment(Date()).format("DD/MM/YYYY");
  const headers = [
    { label: "USER_ID", key: "USER_ID" },
    { label: "USER_NAME", key: "USER_NAME" },
    { label: "FULL_NAME", key: "FULL_NAME" },
    { label: "ORGANIZATION_NAME", key: "ORGANIZATION_NAME" },
    { label: "APPROVAL_STATUS", key: "APPROVAL_STATUS" },
    { label: "EMAIL_ADDRESS", key: "EMAIL_ADDRESS" },
    { label: "SUBMISSION_STATUS", key: "SUBMISSION_STATUS" },
    { label: "IS_REG_COMPLETE", key: "IS_REG_COMPLETE" },
    { label: "PROFILE_PIC1_FILE_NAME", key: "PROFILE_PIC1_FILE_NAME" },
    { label: "PROFILE_PIC2_FILE_NAME", key: "PROFILE_PIC2_FILE_NAME" },
    { label: "SUPPLIER_INVITATION_TYPE", key: "SUPPLIER_INVITATION_TYPE" },
  ];

  const [isSelectedAll, setIsSelectAll] = useState<boolean>(false);

  const selectAll = () => {
    setIsSelectAll(true);
    setSelectedSupplierList([...selectedSupplierList, ...supplierList]);
  };
  const unselectAll = () => {
    setIsSelectAll(false);
    setSelectedSupplierList([]);
  };

  const convertToOldSupplier = (
    supplier: ApprovedSupplierInterface
  ): ConvertedOldSupplierInterface => {
    return {
      ORGANIZATION_NAME: supplier.ORGANIZATION_NAME,
      EMAIL: supplier.EMAIL_ADDRESS,
      MOBILE_NUMBER: supplier.MOBILE_NUMBER.slice(1), // Remove the first character
      SUPPLIER_ID: supplier.SUPPLIER_ID,

    };
  };

  const convertToOldSuppliersArray = (
    suppliers: ApprovedSupplierInterface[]
  ): ConvertedOldSupplierInterface[] => {
    return suppliers.map(convertToOldSupplier);
  };

  const toggleSupplierSelection = (supplier: ApprovedSupplierInterface) => {
    setSelectedSupplierList((prevSelectedList) => {
      const isEmployeeSelected = prevSelectedList.some(
        (sup) => sup.USER_ID === supplier.USER_ID
      );

      if (isEmployeeSelected) {
        // If the employee is already selected, remove it
        return prevSelectedList.filter(
          (sup) => sup.USER_ID !== supplier.USER_ID
        );
      } else {
        // If the employee is not selected, add it
        return [...prevSelectedList, supplier];
      }
    });
  };

  const [singleInvitationLoading, setSingleInvitationLoading] =
    useState<boolean>(false);

  const [bulkinvitationLoading, setBulkInvitationLoading] =
    useState<boolean>(false);

  const sendInvitation = async (item: ApprovedSupplierInterface) => {
    setSingleInvitationLoading(true);
    const converted = convertToOldSupplier(item);
    const convertedArray = [converted];

    try {
      const result = await OldSupplierInvitationService(token!, convertedArray);

      console.log(result);

      if (result.data.status === 200) {
        setSingleInvitationLoading(false);
        showSuccessToast(result.data.message);
      }
    } catch (error) {
      setSingleInvitationLoading(false);
      showErrorToast("Invitation send Failed");
    }
  };

  const [indexNo, setIndexNo] = useState<number | null>(null);

  const handleIndexChange = (ind: number) => {
    setIndexNo(ind);
  };

  const sendBulkInvitation = async () => {
    setBulkInvitationLoading(true);
    const convertedArray = convertToOldSuppliersArray(selectedSupplierList);

    try {
      const result = await OldSupplierInvitationService(token!, convertedArray);
      console.log(result);

      if (result.data.status === 200) {
        setBulkInvitationLoading(false);
        showSuccessToast(result.data.message);
      }
    } catch (error) {
      setBulkInvitationLoading(false);
      showErrorToast("Invitation send Failed");
    }
  };

  return (
    <div className="  bg-white">
      <SuccessToast />
      <div className=" my-6 w-full flex justify-between items-center px-5">
        <div className="flex items-center space-x-3">
          <CommonSearchField
            onChangeData={handleSearchInputChange}
            search={search}
            placeholder="Search Here"
            inputRef={searchInputRef}
            width="w-60"
          />

          <div className="dropdown dropdown-end z-40">
            <div
              tabIndex={0}
              role="button"
              className="w-40 h-11 border-[1px] border-gray-200 rounded-lg flex items-center justify-center space-x-2"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <p className="font-semibold w-20">
                {selectedStatus === "APPROVED" ? "Approved" : selectedStatus === "IN PROCESS" ? "Pending" : "Rejected"}
              </p>

              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>

            {isDropdownOpen && (
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-20 w-36 p-2"
                style={{
                  zIndex: 0,
                  boxShadow:
                    "rgba(145, 158, 171, 0.24) 0px 0px 2px 0px, rgba(145, 158, 171, 0.24) -20px 20px 40px -4px",
                  borderRadius: "10px",
                  backdropFilter: "blur(20px)",
                  backgroundImage: "url(/images/cyan_blur.png), url(/images/red_blur.png)",
                  backgroundRepeat: "no-repeat, no-repeat",
                  backgroundPosition: "right top, left bottom",
                  backgroundSize: "80%, 80%",
                }}
              >
                <li>
                  <button
                    className={`text-left w-full font-semibold text-gray-600 ${selectedStatus === "APPROVED" ? "bg-gray-100" : ""}`}
                    onClick={() => handleStatusChange("APPROVED")}
                  >
                    Approved
                  </button>
                </li>

                <li>
                  <button
                    className={`text-left w-full font-semibold text-gray-600 ${selectedStatus === "IN PROCESS" ? "bg-gray-100" : ""}`}
                    onClick={() => handleStatusChange("IN PROCESS")}
                  >
                    Pending
                  </button>
                </li>

                <li>
                  <button
                    className={`text-left w-full font-semibold text-gray-600 ${selectedStatus === "REJECTED" ? "bg-gray-100" : ""}`}
                    onClick={() => handleStatusChange("REJECTED")}
                  >
                    Reject
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
        {supplierList.length === 0 ? null : (
          <CSVLink
            data={supplierList!}
            headers={headers}
            filename={`supplier_list_${fileName}.csv`}
          >
            <div className=" exportToExcel  flex items-center">
              Export to Excel
            </div>
          </CSVLink>
        )}
      </div>

      {isLoading ? (
        <div className=" w-full flex justify-center items-center">
          <LogoLoading />
        </div>
      ) : !isLoading && supplierList.length === 0 ? (
        <NotFoundPage />
      ) : (
        <>
          <div className=" my-5">
            {selectedSupplierList.length === 0 ? null : (
              <div>
                {bulkinvitationLoading ? (
                  <div className=" w-36 flex justify-center items-center">
                    <CircularProgressIndicator />
                  </div>
                ) : (
                  <CommonButton
                    titleText="Send All Invitation"
                    onClick={sendBulkInvitation}
                    width="w-36"
                  />
                )}
              </div>
            )}
          </div>
          <div className="overflow-auto max-h-[400px] custom-scrollbar">
            <table
              className="min-w-full divide-y divide-gray-200"
              style={{ tableLayout: "fixed" }}
            >
              <thead className="sticky top-0 bg-[#CAF4FF] h-14 z-30">
                <tr>
                  <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  ">
                    <button
                      onClick={() => {
                        isSelectedAll ? unselectAll() : selectAll();
                      }}
                      className="flex space-x-2 items-center"
                    >
                      <div
                        className={`${isSelectedAll
                          ? "bg-midGreen "
                          : "bg-whiteColor border-[1px] border-borderColor"
                          } rounded-[4px] w-4 h-4 flex justify-center items-center`}
                      >
                        <img
                          src="/images/check.png"
                          alt="check"
                          className=" w-2 h-2"
                        />
                      </div>
                    </button>
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-[12px] font-semibold text-blackColor  ">
                    SL
                  </th>
                  {/* <th className="font-mon px-6 py-3 text-left text-[12px] font-semibold text-blackColor  ">
                    User Id
                  </th> */}
                  <th className="font-mon px-6 py-3 text-left text-[12px] font-semibold text-blackColor  ">
                    Supplier ID
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-[12px] font-semibold text-blackColor  ">
                    Supplier Invitation Type
                  </th>
                  {/* <th className="font-mon px-6 py-3 text-left text-[12px] font-semibold text-blackColor  ">
                    User Name
                  </th> */}
                  <th className=" font-mon px-6 py-3 text-left text-[12px] font-semibold text-blackColor  tracking-wider">
                    Organization Name
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-[12px] font-semibold text-blackColor  tracking-wider">
                    Email
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-[12px] font-semibold text-blackColor  tracking-wider">
                    Status
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-[12px] font-semibold text-blackColor  tracking-wider">
                    Organization
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-[12px] font-semibold text-blackColor  tracking-wider">
                    Buyer Name
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-[12px] font-semibold text-blackColor  tracking-wider">
                    Sent Time
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-[12px] font-semibold text-blackColor tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>

              {supplierList.map((e, i) => (
                <tbody
                  className=" cursor-pointer
                            bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]"
                  key={e.SUPPLIER_ID}
                >
                  <td className="font-mon h-12 px-6 py-3 text-left text-[12px] text-blackColor font-medium">
                    <button
                      onClick={() => {
                        toggleSupplierSelection(e);
                      }}
                      className={`${selectedSupplierList.some(
                        (emp) => emp.USER_ID === e.USER_ID
                      )
                        ? "bg-midGreen "
                        : "bg-whiteColor border-[1px] border-borderColor"
                        } rounded-[4px] w-4 h-4 flex justify-center items-center`}
                    >
                      <img
                        src="/images/check.png"
                        alt="check"
                        className=" w-2 h-2"
                      />
                    </button>
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[12px] text-blackColor font-medium">
                    {offset + i}
                  </td>

                  {/* <td className=" w-64 font-mon h-12 px-6 py-3 text-left text-[12px] text-blackColor">
                    {e.USER_ID == null ? "N/A" : e.USER_ID}
                  </td> */}
                  <td className=" font-mon h-12 px-6 py-3 text-left text-[12px] text-blackColor">
                    {e.SUPPLIER_ID == null ? "N/A" : e.SUPPLIER_ID}
                  </td>
                  <td className=" font-mon h-12 px-6 py-3 text-left text-[12px] text-blackColor">

                    {e.SUPPLIER_INVITATION_TYPE === "" ? "N/A" : e.SUPPLIER_INVITATION_TYPE}
                  </td>
                  {/* <td className=" w-64 font-mon h-12 px-6 py-3 text-left text-[12px] text-blackColor">
                    {e.USER_NAME == null ? "N/A" : e.USER_NAME}
                  </td> */}

                  <td className="  font-mon h-12 px-6 py-3 text-left text-[12px] text-blackColor">
                    {e.ORGANIZATION_NAME === "" ? "N/A" : e.ORGANIZATION_NAME}
                  </td>

                  <td className="font-mon h-12 px-6 py-3 text-left text-[12px] text-blackColor">
                    {e.EMAIL_ADDRESS === "" ? "---" : e.EMAIL_ADDRESS}
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[10px] text-blackColor">
                    {/* <div className='w-24 flex justify-center items-center px-2 py-1 rounded-md shadow-sm bg-[#CCE2D2] text-[#006E1F] text-xs font-mon font-bold'>
                                        {e.APPROVAL_STATUS}
                                    </div> */}
                    <div className="w-24">
                      <span className=" bg-[#dbf6e5] text-[#118d57] font-semibold  px-3 py-1 rounded-md">
                        {e.APPROVAL_STATUS == null
                          ? "N/A"
                          : e.APPROVAL_STATUS
                        }
                      </span>
                    </div>
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[12px] text-blackColor">
                    {/* <button className='px-2 py-1 rounded-md bg-midBlue font-mon text-xs text-whiteColor font-bold'>Sync to Oracle</button> */}
                    {e.ORGANIZATION_NAME == null ? "N/A" : e.ORGANIZATION_NAME}
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[12px] text-blackColor">
                    {/* <button className='px-2 py-1 rounded-md bg-midBlue font-mon text-xs text-whiteColor font-bold'>Sync to Oracle</button> */}
                    <div className="w-20">
                      {e.BUYER_NAME == null ? "N/A" : e.BUYER_NAME}
                    </div>
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[12px] text-blackColor">
                    <div className="w-24">
                      {e.EMAIL_SENT_TIME == null ? "N/A" : e.EMAIL_SENT_TIME}
                    </div>
                  </td>
                  <td className=" font-mon h-12 px-6 py-3 text-left text-[12px] text-blackColor">
                    {singleInvitationLoading && indexNo === i ? (
                      <div className=" w-20 flex justify-center items-center">
                        <CircularProgressIndicator />
                      </div>
                    ) : (
                      <div className={`${e.EMAIL_ADDRESS === "" ? " z-10 opacity-60 cursor-not-allowed" : "opacity-100"
                        }`}>
                        <CommonButton
                          titleText="Send"
                          onClick={() => {
                            sendInvitation(e);
                            handleIndexChange(i);
                          }}
                          height="h-8"
                          width="w-20"
                          color={e.EMAIL_ADDRESS === "" ? "bg-gray-300 z-10" : "bg-[#40A578]"}
                          disable={e.EMAIL_ADDRESS === ""}
                        />
                      </div>
                    )}
                  </td>
                </tbody>
              ))}
            </table>
          </div>

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

          {/* <div className="h-10"></div> */}
        </>
      )}
    </div>
  );
}
