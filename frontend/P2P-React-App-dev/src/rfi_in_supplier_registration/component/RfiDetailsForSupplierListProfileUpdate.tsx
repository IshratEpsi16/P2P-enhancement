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
import SupplierListForUpdateProfileApprovalService from "../../manage_supplier_profile_update/service/SupplierListForUpdateApprovalService";
import SupplierInterface from "../../manage_supplier/interface/SupplierInterface";
import { useManageSupplierProfileUpdateContext } from "../../manage_supplier_profile_update/context/ManageSupplierProfileUpdateContext";
import HierachyListByModuleService from "../../registration/service/approve_hierarchy/HierarchyListByModuleService";
import HierarchyInterface from "../../registration/interface/hierarchy/HierarchyInterface";
import useProfileUpdateStore from "../../manage_supplier_profile_update/store/profileUpdateStore";
import SupplierListForUpdateProfileInfoService from "../../manage_supplier_profile_update/service/SupplierListForUpdateProfileInfoService";
import useCountStore from "../../buyer_home/store/countStore";
import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";
import useRfiStore from "../../rfi_in_supplier_registration/store/RfiStore";
const pan = ["Home", "Suppliers"];

export default function RfiDetailsForSupplierListProfileUpdate() {
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

  // const { setManageSupplierProfileUpdatePageNo, setStageId, setStageLevel } =
  //   useManageSupplierProfileUpdateContext();

  const { token, setSupplierId } = useAuth();

  const navigateTo = (userId: number, profileUid: number) => {
    // setManageSupplierProfileUpdatePageNo(2);
    setRfiTabNo(999);
    setSupplierId(userId);
    setProfileUidInStore(profileUid);
    setSupplierIdInStore(userId);
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
  } = useProfileUpdateStore();
  //store

  const pending = "IN PROCESS";
  const approved = "APPROVED";

  // useEffect(() => {
  //   getSupplierList(appStatus);
  // }, [appStatus]);

  useEffect(() => {
    if (rfiTabNo === 234) {
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
    newInfoId: number
  ) => {
    // setManageSupplierProfileUpdatePageNo(3);

    setSupplierId(userId);
    setSupplierIdInStore(userId);
    setStageIdInStore(stageId);
    setStageLevelInStore(stageLevel);
    setProfileNewInfoUidInStore(newInfoId);
    console.log(stageId);
    setRfiTabNo(999);
  };

  return (
    <div className=" m-8">
      <SuccessToast />
      <div className=" flex w-full justify-between items-center">
        <PageTitle titleText="Supplier List" />

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
          {/* new add 10-jul-24 */}
          <button
            onClick={() => {
              setActiveTab("old");
              setIsApprovedSupplier(false);
              setAppStatus(pending);
              setRfiTabNo(123);
            }}
            className={`${
              activeTab === "old" && rfiTabNo === 123
                ? "text-black relative"
                : "text-gray-500"
            } h-10 w-auto px-4 flex flex-col items-center justify-center`}
          >
            <div className="flex flex-row space-x-1 items-center relative">
              <p className="font-mon font-semibold text-[14px]">
                Change Request
              </p>
            </div>

            {activeTab === "old" && rfiTabNo === 123 && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-36 h-[4px] bg-black mt-1 rounded-full"></div>
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab("new");
              setIsApprovedSupplier(true);
              setAppStatus(pending);
              setRfiTabNo(234);
            }}
            className={`${
              activeTab === "new" && rfiTabNo === 234
                ? "text-black relative"
                : "text-gray-500"
            } h-10 w-auto px-4 flex flex-col items-center justify-center`}
          >
            <div className="flex flex-row space-x-1 items-center relative">
              <p className="font-mon font-semibold text-[14px]">
                New Information
              </p>
            </div>

            {activeTab === "new" && rfiTabNo === 234 && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-36 h-[4px] bg-black mt-1 rounded-full"></div>
            )}
          </button>
        </div>
        <div className="h-3"></div>

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
                        navigateTo(e.SUPPLIER_ID, e.PROFILE_UPDATE_UID);
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
                          e.PROFILE_NEW_INFO_UID
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
            )}
          </div>
        )}

        <div className="h-1"></div>
      </div>
    </div>
  );
}
