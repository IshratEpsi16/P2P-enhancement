import React, { useState, useRef, useEffect } from "react";
import PageTitle from "../../common_component/PageTitle";
import NavigationPan from "../../common_component/NavigationPan";

import Popper from "@mui/material/Popper";
import ReusablePaginationComponent from "../../common_component/ReusablePaginationComponent";
import ReusablePopperComponent from "../../common_component/ReusablePopperComponent";
import CommonSearchField from "../../common_component/CommonSearchField";
import { useAuth } from "../../login_both/context/AuthContext";
import { useManageSupplierContext } from "../interface/ManageSupplierContext";
import SupplierListService from "../service/RegisteredSupplierListNeedToApproveService";
import SupplierInterface from "../interface/SupplierInterface";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";
import RegisteredSupplierListNeedToApproveService from "../service/RegisteredSupplierListNeedToApproveService";
import LogoLoading from "../../Loading_component/LogoLoading";

import NotFoundPage from "../../not_found/component/NotFoundPage";
import { CSVLink } from "react-csv";
import moment from "moment";
import useRegistrationStore from "../../registration/store/registrationStore";
import useManageSupplierStore from "../store/manageSupplierStore";
import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";
import fetchFileUrlService from "../../common_service/fetchFileUrlService";

const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

const pan = ["Home", "Suppliers"];
export default function SupplierListPage() {
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [limit, setLimit] = useState(5);
  const [pageNo, setPageNo] = useState(1);
  // const [isApprovedSupplier, setIsApprovedSupplier] = useState(false);

  const [searchInput, setSearchInput] = useState<string | "">("");

  const { setManageSupplierPageNo } = useManageSupplierContext();

  const { token, setSupplierId } = useAuth();

  //store

  const {
    setManageSupplierListLength,
    setInitiator,
    isRegisterApprovedSupplier,
    setisRegisterApprovedSupplier,
    registerAppStatus,
    setRegisterAppStatus,
    setSingleSupplier: setSelectedSupplier,
    setStageLevelManageSupplierStore,
    setStageIdManageSupplierStore,
  } = useManageSupplierStore();

  //store

  const pending = "IN PROCESS";
  const approved = "APPROVED";

  useEffect(() => {
    getSupplierList(registerAppStatus);
  }, [registerAppStatus]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profilePicOnePath, setProfilePicOnePath] = useState<string>("");
  const [profilePicTwoPath, setProfilePicTwoPath] = useState<string>("");
  const [supplierList, setSUpplierList] = useState<SupplierInterface[] | []>(
    []
  );
  const navigateTo = (selected: SupplierInterface) => {
    setManageSupplierPageNo(2);
    setSupplierId(selected.SUPPLIER_ID);
    setSelectedSupplier(selected);
  };
  const getSupplierList = async (approvalStatus: string) => {
    setIsLoading(true);
    try {
      const result = await RegisteredSupplierListNeedToApproveService(
        token!,
        approvalStatus,
        searchInput
      );
      console.log(result.data.data);
      if (result.data.status === 200) {
        setProfilePicOnePath(result.data.profile_pic1);
        setProfilePicTwoPath(result.data.profile_pic2);
        setSUpplierList(result.data.data);
        setManageSupplierListLength(result.data.data.length);
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

  //images view

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
    if (supplierList) {
      const fetchImages = async () => {
        const newImageUrls: ImageUrls = {};
        for (let index = 0; index < supplierList.length; index++) {
          const element = supplierList[index];
          const url = await getImage2(
            profilePicOnePath,
            element.PROFILE_PIC1_FILE_NAME
          );
          newImageUrls[element.SUPPLIER_ID] = url;
        }
        setImageUrls(newImageUrls);
        // setIsLoading(false);
      };
      fetchImages();
    }
  }, [supplierList, profilePicOnePath]);

  return (
    <div className=" m-8 bg-white">
      <SuccessToast />
      <div className=" flex w-full  justify-between items-center">
        <PageTitle titleText="Supplier List" />
        {supplierList.length === 0 ? null : (
          <CSVLink
            data={supplierList!}
            headers={headers}
            filename={`supplier_list_${fileName}.csv`}
          >
            <div className=" exportToExcel ">Export to Excel</div>
          </CSVLink>
        )}
        {/* {isLoading ? (
          <CircularProgressIndicator />
        ) : !isLoading && supplierList.length === 0 ? null : (
         
        )} */}
        {/* <NavigationPan list={pan} /> */}
      </div>
      <div className="h-4"></div>

      <div className="h-4"></div>
      {isLoading ? (
        <div className=" w-full flex justify-center items-center">
          <LogoLoading />
        </div>
      ) : !isLoading && supplierList.length === 0 ? (
        <NotFoundPage />
      ) : (
        <div className=" w-full rounded-md bg-whiteColor  border-[0.5px] border-borderColor ">
          <div className="p-4 flex flex-row items-center space-x-3">
            <button
              onClick={() => {
                // setisRegisterApprovedSupplier(true);
                setRegisterAppStatus(pending);
              }}
              className={` ${
                isRegisterApprovedSupplier
                  ? " rounded-t-md border-b-[2px] border-black"
                  : "bg-whiteColor"
              } h-10 w-auto px-4 flex items-center justify-center`}
            >
              <div className=" flex flex-row space-x-1 items-center">
                <p className=" text-xs font-mon font-medium text-black">
                  Need Approval
                </p>
                {/* <div className='w-5 h-5 rounded-md bg-[#FFE9D5] flex justify-center items-center'>
                                <p className=' text-[#FFAB00] font-mon font-medium text-[10px]'>111</p>
                            </div> */}
              </div>
            </button>
            {/* <button
            onClick={() => {
              setisRegisterApprovedSupplier(!isRegisterApprovedSupplier);
              setRegisterAppStatus(approved);
            }}
            className={` ${
              isRegisterApprovedSupplier
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
          {
            <div className="overflow-auto max-h-[400px] rounded-lg shadow-lg custom-scrollbar">
              <table className="min-w-full divide-y divide-gray-200 rounded-lg">
                <thead className="bg-[#CAF4FF] sticky top-0 ">
                  <tr>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      SL
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      Picture
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
                      navigateTo(e);
                      setInitiator(e.INITIATOR);
                    }}
                    key={e.SUPPLIER_ID}
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
                          <img
                            // src={`${profilePicOnePath}/${e.PROFILE_PIC1_FILE_NAME}`}
                            src={imageUrls[e.SUPPLIER_ID]!}
                            alt="avatar"
                            className=" h-10 w-10 rounded-full bg-cover"
                          />
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {e.ORGANIZATION_NAME}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {e.EMAIL_ADDRESS}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {e.APPROVAL_STATUS}
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
            //         <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  ">
            //           Picture
            //         </th>
            //         <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
            //           Organization
            //         </th>
            //         <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
            //           Email
            //         </th>
            //         <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
            //           Status
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
            //       supplierList.slice(0, limit).map((e, i) => (
            //         <tbody
            //           onClick={() => {
            //             navigateTo(e.SUPPLIER_ID);
            //             setInitiator(e.INITIATOR);
            //           }}
            //           className=" cursor-pointer
            //                   bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]"
            //           key={e.SUPPLIER_ID}
            //         >
            //           <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor font-medium">
            //             {i + 1}
            //           </td>
            //           <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor font-medium">
            //             <img
            //               src={`${profilePicOnePath}/${e.PROFILE_PIC1_FILE_NAME}`}
            //               alt="avatar"
            //               className=" h-16 w-16 rounded-full bg-cover"
            //             />
            //           </td>

            //           <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">

            //             {e.ORGANIZATION_NAME}
            //           </td>

            //           <td className=" w-64 font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
            //             {e.EMAIL_ADDRESS}
            //           </td>
            //           <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">

            //             {e.APPROVAL_STATUS}
            //           </td>
            //         </tbody>
            //       ))
            //     )}
            //   </table>
            // </div>
          }
          <div className="h-1"></div>
        </div>
      )}
    </div>
  );
}
