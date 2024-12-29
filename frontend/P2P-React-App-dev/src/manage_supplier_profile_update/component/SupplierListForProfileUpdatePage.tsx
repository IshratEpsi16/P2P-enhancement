import React, { useState, useRef, useEffect } from "react";
import PageTitle from "../../common_component/PageTitle";
import NavigationPan from "../../common_component/NavigationPan";

import Popper from "@mui/material/Popper";
import ReusablePaginationComponent from "../../common_component/ReusablePaginationComponent";
import ReusablePopperComponent from "../../common_component/ReusablePopperComponent";
import CommonSearchField from "../../common_component/CommonSearchField";
import { useAuth } from "../../login_both/context/AuthContext";

import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";

import LogoLoading from "../../Loading_component/LogoLoading";

import NotFoundPage from "../../not_found/component/NotFoundPage";
import { CSVLink } from "react-csv";
import moment from "moment";
import SupplierListForUpdateProfileApprovalService from "../service/SupplierListForUpdateApprovalService";
import SupplierInterface from "../../manage_supplier/interface/SupplierInterface";
import { useManageSupplierProfileUpdateContext } from "../context/ManageSupplierProfileUpdateContext";
import HierachyListByModuleService from "../../registration/service/approve_hierarchy/HierarchyListByModuleService";
import HierarchyInterface from "../../registration/interface/hierarchy/HierarchyInterface";
import useProfileUpdateStore from "../store/profileUpdateStore";
import SupplierListForUpdateProfileInfoService from "../service/SupplierListForUpdateProfileInfoService";
import useCountStore from "../../buyer_home/store/countStore";
import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";
import useRfiStore from "../../rfi_in_supplier_registration/store/RfiStore";
const pan = ["Home", "Suppliers"];

export default function SupplierListForProfileUpdatePage() {
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [limit, setLimit] = useState(5);
  const [pageNo, setPageNo] = useState(1);
  // const [isApprovedSupplier, setIsApprovedSupplier] = useState(false);
  // const { appStatus, setAppStatus } = useProfileUpdateStore();

  const { rfiTabNo, setRfiTabNo } = useRfiStore();

  const [searchInput, setSearchInput] = useState<string | "">("");
  const [activeTab, setActiveTab] = useState<"old" | "new">("old");
  const [isApprovedSupplier, setIsApprovedSupplier] = useState(false);
  const [appStatus, setAppStatus] = useState<string>("IN PROCESS");

  const { setManageSupplierProfileUpdatePageNo, setStageId, setStageLevel } =
    useManageSupplierProfileUpdateContext();

  const { token, setSupplierId } = useAuth();

  const navigateTo = (userId: number, profileUid: number, isInitiator: string, stageId: number, stageLevel: number, updateList: SupplierInterface) => {
    setManageSupplierProfileUpdatePageNo(2);
    setSupplierId(userId);
    setProfileUidInStore(profileUid);
    setSupplierIdInStore(userId);
    setIsInitiatorInStore(isInitiator);
    setStageIdInStore(stageId);
    setStageLevelInStore(stageLevel);
    setUpdateListInStore(updateList);
    console.log(userId);
  };
  //store
  const {
    setProfileUpdateSupplierListLength,
    // appStatus,
    // setAppStatus,
    // isApprovedSupplier,
    // setIsApprovedSupplier,
    setSupplierIdInStore,
    setStageIdInStore,
    setStageLevelInStore,
    setProfileUidInStore,
    setProfileNewInfoUidInStore,
    setIsInitiatorInStore,
    setUpdateListInStore,
  } = useProfileUpdateStore();
  //store

  const pending = "IN PROCESS";
  const approved = "APPROVED";

  // useEffect(() => {
  //   getSupplierList(appStatus);
  // }, [appStatus]);

  useEffect(() => {
    // Set initial values when component mounts
    setActiveTab("old");
    setIsApprovedSupplier(false);
    setAppStatus(pending);
    setRfiTabNo(111);
  }, []);

  useEffect(() => {
    if (rfiTabNo === 222) {
      setActiveTab("new");
      setIsApprovedSupplier(true);
      setAppStatus(pending);
    } else {
      setActiveTab("old");
      setIsApprovedSupplier(false);
      setAppStatus(pending);
    }
  }, [rfiTabNo]);

  useEffect(() => {
    if (activeTab === "old") {
      getSupplierList(appStatus);
    } else {
      getSupplierNewInfo(appStatus);
    }
  }, [activeTab, appStatus]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profilePicOnePath, setProfilePicOnePath] = useState<string>("");
  const [profilePicTwoPath, setProfilePicTwoPath] = useState<string>("");
  const [supplierList, setSUpplierList] = useState<SupplierInterface[] | []>(
    []
  );
  const [isLoadingNew, setIsLoadingNew] = useState<boolean>(false);
  const [profilePicOnePathNew, setProfilePicOnePathNew] = useState<string>("");
  const [profilePicTwoPathNew, setProfilePicTwoPathNew] = useState<string>("");
  const [supplierListNew, setSUpplierListNew] = useState<
    SupplierInterface[] | []
  >([]);

  const getSupplierList = async (approvalStatus: string) => {
    setIsLoading(true);
    try {
      const result = await SupplierListForUpdateProfileApprovalService(
        token!,
        approvalStatus,
        searchInput
      );

      console.log(result.data);

      if (result.data.status === 200) {
        setProfilePicOnePath(result.data.profile_pic1);
        setProfilePicTwoPath(result.data.profile_pic2);
        setSUpplierList(result.data.data);
        console.log("Old Info: ", result.data);
        setProfileUpdateSupplierListLength(result.data.data.length);
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

  // aita holo popper er jonno
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;
  //end poppoer
  //pagination
  const next = async () => {};
  const previous = async () => {};
  //pagination

  //search
  const handleSearchInputChange = (val: string) => {
    setSearchInput(val);
  };

  const search = () => {
    getSupplierList("");
  };

  //csv header
  let fileName = moment(Date()).format("DD/MM/YYYY");
  const headers = [
    { label: "SUPPLIER_ID", key: "SUPPLIER_ID" },
    { label: "SUPPLIER_FULL_NAME", key: "SUPPLIER_FULL_NAME" },
    { label: "SUPPLIER_USER_NAME", key: "SUPPLIER_USER_NAME" },
    { label: "EMAIL_ADDRESS", key: "EMAIL_ADDRESS" },
    { label: "APPROVAL_STATUS", key: "APPROVAL_STATUS" },
    { label: "MODULE_ID", key: "MODULE_ID" },
    { label: "STAGE_ID", key: "STAGE_ID" },
    { label: "STAGE_LEVEL", key: "STAGE_LEVEL" },
    { label: "STAGE_SEQ", key: "STAGE_SEQ" },
    { label: "IS_MUST_APPROVE", key: "IS_MUST_APPROVE" },
  ];

  //new value

  const { setProfileSupplierNewAddLength } = useCountStore();

  const getSupplierNewInfo = async (approvalStatus: string) => {
    setIsLoadingNew(true);
    try {
      const result = await SupplierListForUpdateProfileInfoService(
        token!,
        approvalStatus,
        searchInput
      );

      console.log(result.data);

      if (result.data.status === 200) {
        setProfilePicOnePathNew(result.data.profile_pic1);
        setProfilePicTwoPathNew(result.data.profile_pic2);
        setSUpplierListNew(result.data.data);
        console.log("newData: ", result.data);
        setProfileSupplierNewAddLength(result.data.data.length);
        // setProfileUpdateSupplierListLengthNew(result.data.data.length);
        setIsLoadingNew(false);
      } else {
        setIsLoadingNew(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsLoadingNew(false);
      showErrorToast("Something went wrong");
    }
  };

  const navigateTo2 = (
    userId: number,
    stageId: number,
    stageLevel: number,
    newInfoId: number,
    isInitiator: string,
    e: SupplierInterface
  ) => {
    setManageSupplierProfileUpdatePageNo(3);
    setSupplierId(userId);
    setSupplierIdInStore(userId);
    setStageIdInStore(stageId);
    setStageLevelInStore(stageLevel);
    setProfileNewInfoUidInStore(newInfoId);
    setIsInitiatorInStore(isInitiator);
    setUpdateListInStore(e);
    console.log(newInfoId);
  };

  return (
    <div className=" m-8">
      <SuccessToast />
      <div className=" flex w-full justify-between items-center">
        <PageTitle titleText="Supplier List" />
        {/* {!isApprovedSupplier ? (
          isLoading ? (
            <div>
              <CircularProgressIndicator />
            </div>
          ) : !isLoading && supplierList.length === 0 ? null : (
            <CSVLink
              data={supplierList!}
              headers={headers}
              filename={`supplier_list_${fileName}.csv`}
            >
              <div className=" exportToExcel ">Export to Excel</div>
            </CSVLink>
          )
        ) : isLoadingNew ? (
          <div>
            <CircularProgressIndicator />
          </div>
        ) : !isLoadingNew && supplierListNew.length === 0 ? null : (
          <CSVLink
            data={supplierListNew!}
            headers={headers}
            filename={`supplier_list_new_${fileName}.csv`}
          >
            <div className=" exportToExcel ">Export to Excel</div>
          </CSVLink>
        )} */}

        {/* new add this  10-jul-24 */}
        {activeTab === "old" ? (
          isLoading ? (
            <div>{/* <CircularProgressIndicator /> */}</div>
          ) : !isLoading && supplierList.length === 0 ? null : (
            <CSVLink
              data={supplierList!}
              headers={headers}
              filename={`supplier_list_${fileName}.csv`}
            >
              <div className="exportToExcel">Export to Excel</div>
            </CSVLink>
          )
        ) : isLoadingNew ? (
          <div>{/* <CircularProgressIndicator /> */}</div>
        ) : !isLoadingNew && supplierListNew.length === 0 ? null : (
          <CSVLink
            data={supplierListNew!}
            headers={headers}
            filename={`supplier_list_new_${fileName}.csv`}
          >
            <div className="exportToExcel">Export to Excel</div>
          </CSVLink>
        )}
        {/* <NavigationPan list={pan} /> */}
      </div>
      <div className="h-6"></div>
      <div className=" w-full flex justify-end items-center">
        {/* <CommonSearchField
          onChangeData={handleSearchInputChange}
          search={search}
          placeholder="Search Here"
          inputRef={searchInputRef}
          width="w-60"
        /> */}
      </div>
      {/* <div className="h-4"></div> */}
      <div className=" w-full rounded-md bg-whiteColor  border-[0.5px] border-borderColor p-4">
        <div className="flex flex-row items-center px-1 bg-gray-100 rounded-lg relative">
          {/* <button
            onClick={() => {
              setIsApprovedSupplier(!isApprovedSupplier);
              setAppStatus(pending);
            }}
            className={` ${
              !isApprovedSupplier
                ? " rounded-t-md border-b-[2px] border-black"
                : "bg-whiteColor"
            } h-10 w-auto px-4 flex items-center justify-center`}
          >
            <div className=" flex flex-row space-x-1 items-center">
              <p className=" text-xs font-mon font-medium text-black">
                Old Value
              </p>
            </div>
          </button>
          <button
            onClick={() => {
              setIsApprovedSupplier(!isApprovedSupplier);
              setAppStatus(pending);
              getSupplierNewInfo(pending);
            }}
            className={` ${
              isApprovedSupplier
                ? " rounded-t-md border-b-[2px] border-black"
                : "bg-whiteColor"
            } h-10 w-auto px-4 flex items-center justify-center`}
          >
            <div className=" flex flex-row space-x-1 items-center">
              <p className=" text-xs font-mon font-medium text-black">
                New Value
              </p>
            </div>
          </button> */}

          {/* new add 10-jul-24 */}
          <button
            onClick={() => {
              setActiveTab("old");
              setIsApprovedSupplier(false);
              setAppStatus(pending);
              setRfiTabNo(111);
            }}
            className={`${
              activeTab === "old" && rfiTabNo === 111
                ? "text-black relative"
                : "text-gray-500"
            } h-10 w-auto px-4 flex flex-col items-center justify-center`}
          >
            <div className="flex flex-row space-x-1 items-center relative">
              <p className="font-mon font-semibold text-[14px]">
                Change Request
              </p>
            </div>

            {activeTab === "old" && rfiTabNo === 111 && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-36 h-[4px] bg-black mt-1 rounded-full"></div>
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab("new");
              setIsApprovedSupplier(true);
              setAppStatus(pending);
              setRfiTabNo(222);
            }}
            className={`${
              activeTab === "new" && rfiTabNo === 222
                ? "text-black relative"
                : "text-gray-500"
            } h-10 w-auto px-4 flex flex-col items-center justify-center`}
          >
            <div className="flex flex-row space-x-1 items-center relative">
              <p className="font-mon font-semibold text-[14px]">
                New Information
              </p>
            </div>

            {activeTab === "new" && rfiTabNo === 222 && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-36 h-[4px] bg-black mt-1 rounded-full"></div>
            )}
          </button>

          {/* <button
            onClick={() => {
              setIsApprovedSupplier(!isApprovedSupplier);
              setAppStatus(approved);
            }}
            className={` ${
              isApprovedSupplier
                ? "bg-inputBg rounded-t-md border-b-[1px] border-borderColor"
                : "bg-whiteColor"
            } h-10 w-auto px-4 flex items-center justify-center`}
          >
            <div className=" flex flex-row space-x-1 items-center">
              <p className=" text-xs font-mon font-medium text-graishColor">
                Approved
              </p>
            </div>
          </button> */}
        </div>
        <div className="h-3"></div>
        {/* <div className=' h-14 w-full px-8 bg-inputBg flex justify-center items-center border-b-[0.5px] border-borderColor'></div>
                <div className=' w-full h-10 bg-gray-50 flex justify-center items-center'>

                </div> */}

        {/* <div className="overflow-auto max-h-[400px] custom-scrollbar"> */}

        {/* <table
                          className="min-w-full divide-y divide-gray-200 border-[0.2px] border-borderColor rounded-md"
                          style={{ tableLayout: "fixed" }}
                        >
                          <thead className="sticky top-0 bg-[#CAF4FF] h-14"></thead> */}

        {activeTab === "old" ? (
          <div>
            {isLoading ? (
              <div className=" w-full flex justify-center items-center">
                <LogoLoading />
              </div>
            ) : !isLoading && supplierList.length === 0 ? (
              <NotFoundPage />
            ) : (
              <div className="w-full overflow-auto max-h-[400px] rounded-lg shadow-lg custom-scrollbar">
                <table className="min-w-full w-full divide-y divide-gray-200 rounded-lg">
                  <thead className=" bg-tableHeadColor sticky top-0 w-full">
                    <tr className="w-full">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900  tracking-wider font-mon">
                        SL
                      </th>
                      {/* <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900  tracking-wider font-mon">
                        Supplier Name
                      </th> */}
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900  tracking-wider font-mon">
                        Organization
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900  tracking-wider font-mon">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 tracking-wider font-mon">
                        Status
                      </th>
                    </tr>
                  </thead>

                  {supplierList.map((e, i) => (
                    <tbody
                      onClick={() => {
                        navigateTo(e.SUPPLIER_ID, e.PROFILE_UPDATE_UID, e.IS_INITIATOR, e.STAGE_ID, e.STAGE_LEVEL, e);
                      }}
                      key={e.SUPPLIER_ID}
                      className=" cursor-pointer bg-white divide-y divide-gray-200"
                    >
                      <tr>
                        <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor whitespace-nowrap">
                          {/* <div className="w-full overflow-auto custom-scrollbar text-center"> */}
                          {i + 1}
                          {/* </div> */}
                        </td>
                        {/* <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                          
                          {!e.SUPPLIER_FULL_NAME ? "N/A" : e.SUPPLIER_FULL_NAME}
                        </td> */}

                        <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor whitespace-nowrap">
                          {/* <div className="w-full overflow-auto custom-scrollbar text-center"> */}
                          {e.ORGANIZATION_NAME}
                          {/* </div> */}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor whitespace-nowrap">
                          {/* <div className="w-full overflow-auto custom-scrollbar text-center"> */}
                          {e.EMAIL_ADDRESS}
                          {/* </div> */}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-[10px] font-bold text-blackColor whitespace-nowrap">
                          {/* <div className="w-full overflow-auto custom-scrollbar text-center"> */}
                          {/* {e.APPROVAL_STATUS} */}
                          <div className="text-left">
                            <span className=" bg-[#dbf6e5] text-[#118d57] font-semibold  px-3 py-1 rounded-md">
                              {e.APPROVAL_STATUS == null
                                ? "N/A"
                                : e.APPROVAL_STATUS}
                            </span>
                          </div>
                          {/* </div> */}
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
                      {/* <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th> */}
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

              // <div className="overflow-x-auto">
              //   <table
              //     className="min-w-full divide-y divide-gray-200"
              //     style={{ tableLayout: "fixed" }}
              //   >
              //     <thead className="sticky top-0 bg-[#F4F6F8] h-14">
              //       <tr>
              //         <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  ">
              //           SL
              //         </th>
              //         <th className=" font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
              //           Supplier Name
              //         </th>
              //         <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
              //           Email
              //         </th>
              //         <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
              //           Status
              //         </th>
              //         <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
              //           Organization
              //         </th>
              //       </tr>
              //     </thead>

              //     {isLoading ? (
              //       <tbody>
              //         <td></td>
              //         <td></td>
              //         <td>
              //           {" "}
              //           <LogoLoading />
              //         </td>
              //         <td></td>
              //         <td></td>
              //       </tbody>
              //     ) : !isLoading && supplierList.length === 0 ? (
              //       <tbody>
              //         <td></td>
              //         <td></td>
              //         <td>
              //           {" "}
              //           <NotFoundPage />
              //         </td>
              //         <td></td>
              //         <td></td>
              //       </tbody>
              //     ) : (
              //       supplierList.map((e, i) => (
              //         <tbody
              //           onClick={() => {
              //             navigateTo(e.SUPPLIER_ID, e.PROFILE_UPDATE_UID);
              //           }}
              //           className=" cursor-pointer
              //               bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]"
              //           key={e.SUPPLIER_ID}
              //         >
              //           <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor font-medium">
              //             {i + 1}
              //           </td>

              //           <td className=" w-64 font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
              //             {!e.SUPPLIER_FULL_NAME ? "N/A" : e.SUPPLIER_FULL_NAME}
              //           </td>

              //           <td className=" w-64 font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
              //             {e.EMAIL_ADDRESS}
              //           </td>
              //           <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
              //             {e.APPROVAL_STATUS}
              //           </td>
              //           <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
              //             {e.ORGANIZATION_NAME}
              //           </td>
              //         </tbody>
              //       ))
              //     )}

              //     <tfoot className="sticky bottom-0 bg-white">
              //       <tr className=" h-12">
              //         <td></td>
              //       </tr>
              //     </tfoot>
              //   </table>
              // </div>
            )}
          </div>
        ) : (
          <div>
            {/* new value */}

            {isLoadingNew ? (
              <div className=" w-full flex justify-center items-center">
                <LogoLoading />
              </div>
            ) : !isLoadingNew && supplierListNew.length === 0 ? (
              <NotFoundPage />
            ) : (
              <div className="overflow-auto max-h-[400px] rounded-lg shadow-lg custom-scrollbar">
                <table className="min-w-full divide-y divide-gray-200 rounded-lg">
                  <thead className="bg-[#CAF4FF] sticky top-0 ">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900  tracking-wider font-mon">
                        SL
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900  tracking-wider font-mon">
                        Supplier Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900  tracking-wider font-mon">
                        Organization
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900  tracking-wider font-mon">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900  tracking-wider font-mon">
                        Status
                      </th>
                    </tr>
                  </thead>

                  {supplierListNew.map((e, i) => (
                    <tbody
                      onClick={() => {
                        navigateTo2(
                          e.SUPPLIER_ID,
                          e.STAGE_ID,
                          e.STAGE_LEVEL,
                          e.PROFILE_NEW_INFO_UID,
                          e.IS_INITIATOR,
                          e
                        );
                      }}
                      key={e.SUPPLIER_ID}
                      className=" cursor-pointer bg-white divide-y divide-gray-200"
                    >
                      <tr>
                        <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                          {/* <div className="w-full overflow-auto custom-scrollbar text-center"> */}
                          {i + 1}
                          {/* </div> */}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                          {/* <div className="w-full overflow-auto custom-scrollbar text-center flex justify-center items-center"> */}
                          {e.SUPPLIER_USER_NAME == null
                            ? "N/A"
                            : e.SUPPLIER_USER_NAME}
                          {/* </div> */}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                          {/* <div className="w-full overflow-auto custom-scrollbar text-center"> */}
                          {e.ORGANIZATION_NAME}
                          {/* </div> */}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                          {/* <div className="w-full overflow-auto custom-scrollbar text-center"> */}
                          {e.EMAIL_ADDRESS}
                          {/* </div> */}
                        </td>
                        <td className="font-mon h-12 px-3 py-3 text-left  text-[10px] font-bold text-blackColor">
                          {/* <div className="w-full overflow-auto custom-scrollbar text-center"> */}
                          <span className="bg-[#dbf6e5]  text-[#118d57] px-3 py-2  rounded-md">
                            {e.APPROVAL_STATUS == null
                              ? "N/A"
                              : e.APPROVAL_STATUS}
                          </span>
                          {/* </div> */}
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

              // <div className="overflow-x-auto">
              //   <table
              //     className="min-w-full divide-y divide-gray-200"
              //     style={{ tableLayout: "fixed" }}
              //   >
              //     <thead className="sticky top-0 bg-[#F4F6F8] h-14">
              //       <tr>
              //         <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  ">
              //           SL
              //         </th>
              //         <th className=" font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
              //           Supplier Name
              //         </th>
              //         <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
              //           Email
              //         </th>
              //         <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
              //           Status
              //         </th>
              //         <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
              //           Organization
              //         </th>
              //       </tr>
              //     </thead>

              //     {isLoadingNew ? (

              //       <tbody>
              //         <td></td>
              //         <td></td>
              //         <td>
              //           {" "}
              //           <LogoLoading />
              //         </td>
              //         <td></td>
              //         <td></td>
              //       </tbody>
              //     ) : !isLoadingNew && supplierListNew.length === 0 ? (
              //       <tbody>
              //         <td></td>
              //         <td></td>
              //         <td>
              //           {" "}
              //           <NotFoundPage />
              //         </td>
              //         <td></td>
              //         <td></td>
              //       </tbody>
              //     ) : (
              //       supplierListNew.map((e, i) => (
              //         <tbody
              //           onClick={() => {
              //             navigateTo2(e.SUPPLIER_ID, e.STAGE_ID, e.STAGE_LEVEL);
              //           }}
              //           className=" cursor-pointer
              //               bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]"
              //           key={e.SUPPLIER_ID}
              //         >
              //           <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor font-medium">
              //             {i + 1}
              //           </td>

              //           <td className=" w-64 font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
              //             {e.SUPPLIER_USER_NAME == null
              //               ? "N/A"
              //               : e.SUPPLIER_USER_NAME}
              //           </td>

              //           <td className=" w-64 font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
              //             {e.EMAIL_ADDRESS}
              //           </td>
              //           <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">

              //             {e.APPROVAL_STATUS}
              //           </td>
              //           <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
              //             {e.ORGANIZATION_NAME}
              //           </td>
              //         </tbody>
              //       ))
              //     )}
              //   </table>
              // </div>
            )}
          </div>
        )}

        <div className="h-1"></div>
      </div>
    </div>
  );
}

// import React, { useState, useRef, useEffect } from "react";
// import PageTitle from "../../common_component/PageTitle";
// import NavigationPan from "../../common_component/NavigationPan";

// import Popper from "@mui/material/Popper";
// import ReusablePaginationComponent from "../../common_component/ReusablePaginationComponent";
// import ReusablePopperComponent from "../../common_component/ReusablePopperComponent";
// import CommonSearchField from "../../common_component/CommonSearchField";
// import { useAuth } from "../../login_both/context/AuthContext";

// import { showErrorToast } from "../../Alerts_Component/ErrorToast";
// import SuccessToast, {
//   showSuccessToast,
// } from "../../Alerts_Component/SuccessToast";

// import LogoLoading from "../../Loading_component/LogoLoading";

// import NotFoundPage from "../../not_found/component/NotFoundPage";
// import { CSVLink } from "react-csv";
// import moment from "moment";
// import SupplierListForUpdateProfileApprovalService from "../service/SupplierListForUpdateApprovalService";
// import SupplierInterface from "../../manage_supplier/interface/SupplierInterface";
// import { useManageSupplierProfileUpdateContext } from "../context/ManageSupplierProfileUpdateContext";
// import HierachyListByModuleService from "../../registration/service/approve_hierarchy/HierarchyListByModuleService";
// import HierarchyInterface from "../../registration/interface/hierarchy/HierarchyInterface";
// import useProfileUpdateStore from "../store/profileUpdateStore";
// import SupplierListForUpdateProfileInfoService from "../service/SupplierListForUpdateProfileInfoService";
// const pan = ["Home", "Suppliers"];

// export default function SupplierListForProfileUpdatePage() {
//   const searchInputRef = useRef<HTMLInputElement | null>(null);
//   const [limit, setLimit] = useState(5);
//   const [pageNo, setPageNo] = useState(1);
//   // const [isApprovedSupplier, setIsApprovedSupplier] = useState(false);
//   // const { appStatus, setAppStatus } = useProfileUpdateStore();
//   const [searchInput, setSearchInput] = useState<string | "">("");

//   const { setManageSupplierProfileUpdatePageNo, setStageId, setStageLevel } =
//     useManageSupplierProfileUpdateContext();

//   const { token, setSupplierId } = useAuth();

// const navigateTo = (userId: number) => {
//   setManageSupplierProfileUpdatePageNo(2);
//   setSupplierId(userId);
//   setSupplierIdInStore(userId);
//   console.log(userId);
// };
//   //store
//   const {
//     setProfileUpdateSupplierListLength,
//     appStatus,
//     setAppStatus,
//     isApprovedSupplier,
//     setIsApprovedSupplier,
//     setSupplierIdInStore,
//   } = useProfileUpdateStore();
//   //store
//   const pending = "IN PROCESS";
//   const approved = "APPROVED";

//   useEffect(() => {
//     getSupplierList(appStatus);
//   }, [appStatus]);

//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [profilePicOnePath, setProfilePicOnePath] = useState<string>("");
//   const [profilePicTwoPath, setProfilePicTwoPath] = useState<string>("");
//   const [supplierList, setSUpplierList] = useState<SupplierInterface[] | []>(
//     []
//   );

//   // const getSupplierList = async (approvalStatus: string) => {
//   //   setIsLoading(true);
//   //   try {
//   //     const result = await SupplierListForUpdateProfileApprovalService(
//   //       token!,
//   //       approvalStatus,
//   //       searchInput
//   //     );

//   //     console.log(result.data);

//   //     if (result.data.status === 200) {
//   //       setProfilePicOnePath(result.data.profile_pic1);
//   //       setProfilePicTwoPath(result.data.profile_pic2);
//   //       setSUpplierList(result.data.data);
//   //       setProfileUpdateSupplierListLength(result.data.data.length);
//   //       setIsLoading(false);
//   //     } else {
//   //       setIsLoading(false);
//   //       showErrorToast(result.data.message);
//   //     }
//   //   } catch (error) {
//   //     setIsLoading(false);
//   //     showErrorToast("Something went wrong");
//   //   }
//   // };

//   const getSupplierList = async (approvalStatus: string) => {
//     setIsLoading(true);
//     try {
//       const result = await SupplierListForUpdateProfileInfoService(
//         token!,
//         approvalStatus,
//         searchInput
//       );

//       console.log(result.data);

//       if (result.data.status === 200) {
//         setProfilePicOnePath(result.data.profile_pic1);
//         setProfilePicTwoPath(result.data.profile_pic2);
//         setSUpplierList(result.data.data);
//         setProfileUpdateSupplierListLength(result.data.data.length);
//         setIsLoading(false);
//       } else {
//         setIsLoading(false);
//         showErrorToast(result.data.message);
//       }
//     } catch (error) {
//       setIsLoading(false);
//       showErrorToast("Something went wrong");
//     }
//   };

//   // aita holo popper er jonno
//   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

//   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(anchorEl ? null : event.currentTarget);
//   };
//   const open = Boolean(anchorEl);
//   const id = open ? "simple-popper" : undefined;
//   //end poppoer
//   //pagination
//   const next = async () => {};
//   const previous = async () => {};
//   //pagination

//   //search
//   const handleSearchInputChange = (val: string) => {
//     setSearchInput(val);
//   };

//   const search = () => {
//     getSupplierList("");
//   };

//   //csv header
//   let fileName = moment(Date()).format("DD/MM/YYYY");
//   const headers = [
//     { label: "SUPPLIER_ID", key: "SUPPLIER_ID" },
//     { label: "SUPPLIER_FULL_NAME", key: "SUPPLIER_FULL_NAME" },
//     { label: "SUPPLIER_USER_NAME", key: "SUPPLIER_USER_NAME" },
//     { label: "EMAIL_ADDRESS", key: "EMAIL_ADDRESS" },
//     { label: "APPROVAL_STATUS", key: "APPROVAL_STATUS" },
//     { label: "MODULE_ID", key: "MODULE_ID" },
//     { label: "STAGE_ID", key: "STAGE_ID" },
//     { label: "STAGE_LEVEL", key: "STAGE_LEVEL" },
//     { label: "STAGE_SEQ", key: "STAGE_SEQ" },
//     { label: "IS_MUST_APPROVE", key: "IS_MUST_APPROVE" },
//   ];

//   return (
//     <div className=" m-8">
//       <SuccessToast />
//       <div className=" flex flex-col items-start">
//         <PageTitle titleText="Supplier List" />
//         <NavigationPan list={pan} />
//       </div>
//       <div className="h-10"></div>
//       <div className=" w-full flex justify-end items-center">
//         {/* <CommonSearchField
//           onChangeData={handleSearchInputChange}
//           search={search}
//           placeholder="Search Here"
//           inputRef={searchInputRef}
//           width="w-60"
//         /> */}

//         <CSVLink
//           data={supplierList!}
//           headers={headers}
//           filename={`supplier_list_${fileName}.csv`}
//         >
//           {/* <CommonButton
//                                 onClick={download}
//                                 titleText={"Export to Excel"}
//                                 width="w-36"
//                                 height="h-8"
//                                 color="bg-midGreen"
//                             /> */}
//           <div className=" exportToExcel ">Export to Excel</div>
//         </CSVLink>
//       </div>
//       <div className="h-10"></div>
//       <div className=" w-full rounded-md bg-whiteColor  border-[0.5px] border-borderColor ">
//         <div className="p-4 flex flex-row items-center space-x-3">
//           <button
//             onClick={() => {
//               setIsApprovedSupplier(!isApprovedSupplier);
//               setAppStatus(approved);
//             }}
//             className={` ${
//               !isApprovedSupplier
//                 ? "bg-inputBg rounded-t-md border-b-[1px] border-borderColor"
//                 : "bg-whiteColor"
//             } h-10 w-auto px-4 flex items-center justify-center`}
//           >
//             <div className=" flex flex-row space-x-1 items-center">
//               <p className=" text-xs font-mon font-medium text-graishColor">
//                 Old Info
//               </p>
//               {/* <div className='w-5 h-5 rounded-md bg-[#FFE9D5] flex justify-center items-center'>
//                                 <p className=' text-[#FFAB00] font-mon font-medium text-[10px]'>111</p>
//                             </div> */}
//             </div>
//           </button>
//           <button
//             onClick={() => {
//               setIsApprovedSupplier(!isApprovedSupplier);
//               setAppStatus(pending);
//             }}
//             className={` ${
//               isApprovedSupplier
//                 ? "bg-inputBg rounded-t-md border-b-[1px] border-borderColor"
//                 : "bg-whiteColor"
//             } h-10 w-auto px-4 flex items-center justify-center`}
//           >
//             <div className=" flex flex-row space-x-1 items-center">
//               <p className=" text-xs font-mon font-medium text-graishColor">
//                 New Info
//               </p>
//             </div>
//           </button>
//         </div>
//         <div className="h-3"></div>
//         {/* <div className=' h-14 w-full px-8 bg-inputBg flex justify-center items-center border-b-[0.5px] border-borderColor'></div>
//                 <div className=' w-full h-10 bg-gray-50 flex justify-center items-center'>

//                 </div> */}
//         {!isLoading && supplierList.length === 0 ? (
//           <div>
//             <div className=""></div>
//             <div className=" w-full flex justify-center items-center">
//               <img
//                 src="/images/NoDataNew.png"
//                 alt="nodata"
//                 className=" w-[450px] h-[450px]"
//               />
//             </div>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table
//               className="min-w-full divide-y divide-gray-200"
//               style={{ tableLayout: "fixed" }}
//             >
//               <thead className="sticky top-0 bg-[#F4F6F8] h-14">
//                 <tr>
//                   <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  ">
//                     SL
//                   </th>
//                   <th className=" font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                     Supplier Name
//                   </th>
//                   <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                     Email
//                   </th>
//                   <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                     Status
//                   </th>
//                   <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                     Organization
//                   </th>

//                   {/* Add more header columns as needed */}
//                 </tr>
//               </thead>

//               {/* Table rows go here */}
//               {/* Table rows go here */}
//               {isLoading ? (
//                 // <div className=' w-full flex justify-center items-center'>
//                 //     <LogoLoading/>
//                 // </div>
//                 <tbody>
//                   <td></td>
//                   <td></td>
//                   <td>
//                     {" "}
//                     <LogoLoading />
//                   </td>
//                   <td></td>
//                   <td></td>
//                 </tbody>
//               ) : !isLoading && supplierList.length === 0 ? (
//                 <tbody>
//                   <td></td>
//                   <td></td>
//                   <td>
//                     {" "}
//                     <NotFoundPage />
//                   </td>
//                   <td></td>
//                   <td></td>
//                 </tbody>
//               ) : (
//                 supplierList.slice(0, limit).map((e, i) => (
//                   <tbody
//                     onClick={() => {
//                       navigateTo(e.SUPPLIER_ID);
//                     }}
//                     className=" cursor-pointer
//                             bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]"
//                     key={e.SUPPLIER_ID}
//                   >
//                     <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor font-medium">
//                       {i + 1}
//                     </td>

//                     <td className=" w-64 font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
//                       {e.SUPPLIER_USER_NAME == null
//                         ? "N/A"
//                         : e.SUPPLIER_USER_NAME}
//                     </td>

//                     <td className=" w-64 font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
//                       {e.EMAIL_ADDRESS}
//                     </td>
//                     <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
//                       {/* <div className='w-24 flex justify-center items-center px-2 py-1 rounded-md shadow-sm bg-[#CCE2D2] text-[#006E1F] text-xs font-mon font-bold'>
//                                         {e.APPROVAL_STATUS}
//                                     </div> */}
//                       {e.APPROVAL_STATUS}
//                     </td>
//                     <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
//                       {/* <button className='px-2 py-1 rounded-md bg-midBlue font-mon text-xs text-whiteColor font-bold'>Sync to Oracle</button> */}
//                       {e.ORGANIZATION_NAME}
//                     </td>
//                   </tbody>
//                 ))
//               )}
//             </table>
//           </div>
//         )}
//         <div className="h-1"></div>
//       </div>
//     </div>
//   );
// }
