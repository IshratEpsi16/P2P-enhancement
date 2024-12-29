import React, { useState, useRef, useEffect } from "react";
import PageTitle from "../../common_component/PageTitle";
import NavigationPan from "../../common_component/NavigationPan";

import Popper from "@mui/material/Popper";
import ReusablePaginationComponent from "../../common_component/ReusablePaginationComponent";
import ReusablePopperComponent from "../../common_component/ReusablePopperComponent";
import CommonSearchField from "../../common_component/CommonSearchField";
import { useAuth } from "../../login_both/context/AuthContext";

import SupplierInterface from "../../manage_supplier/interface/SupplierInterface";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";

import LogoLoading from "../../Loading_component/LogoLoading";

import NotFoundPage from "../../not_found/component/NotFoundPage";
import { CSVLink } from "react-csv";
import moment from "moment";
import { useRfiManageSupplierContext } from "../context/RfiManageSupplierContext";
import RfiSupplierListService from "../service/RfiSupplierListService";
import RfiSupplierInterface from "../interface/RfiSupplierInterface";
import convertDateFormat from "../../utils/methods/convertDateFormat";
import useRfiStore from "../store/RfiStore";
import usePrItemsStore from "../../buyer_section/pr/store/prItemStore";

const pan = ["Home", "Suppliers"];
export default function RfiRequestForProfileUpdatePage() {
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [limit, setLimit] = useState(5);
  const [pageNo, setPageNo] = useState(1);
  const [isApprovedSupplier, setIsApprovedSupplier] = useState(false);

  const [searchInput, setSearchInput] = useState<string | "">("");

  const [isActiveButtonRegistration, setIsActiveButtonRegistration] =
    useState(false);
  const [isActiveButtonRFQ, setIsActiveButtonRFQ] = useState(false);
  const [isActiveButtonVAT, setIsActiveButtonVAT] = useState(false);

  const [rfqTotalData, setRfqTotalData] = useState(0);
  const [regTotalData, setRegTotalData] = useState(0);
  const [vatTotalData, setVatTotalData] = useState(0);
  const [csTotalData, setCsTotalData] = useState(0);
  const [profileUpdateTotal, setProfileUpdateTotal] = useState(0);
  const [newInfoTotal, setNewInfoTotal] = useState(0);
  const [invoiceTotal, setInvoiceTotal] = useState(0);

  const { setRfiManageSupplierPageNo, setRfiId } =
    useRfiManageSupplierContext();

  const { token, userId, setSupplierId } = useAuth();

  //store
  const {
    setRfiSupplierListlength,
    setRfiTabNo,
    rfiTabNo,
    setStageLevelInStore,
    setTemplateIdInStore,
  } = useRfiStore();
  //store

  //store
  const { setIsCreateRfq, setRfqIdInStore } = usePrItemsStore();
  //store

  const navigateTo = (
    userId: number,
    rfiId: number,
    stageLevel: number,
    tempId: number
  ) => {
    // setRfiManageSupplierPageNo(6);

    setSupplierId(userId);
    setRfqIdInStore(userId);
    setRfiId(rfiId);
    setStageLevelInStore(stageLevel);
    setTemplateIdInStore(tempId);
    console.log(stageLevel);
    console.log(tempId);

    setRfiTabNo(999);
  };

  const pending = "IN PROCESS";
  const approved = "APPROVED";

  useEffect(() => {
    getSupplierList();
  }, []);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profilePicOnePath, setProfilePicOnePath] = useState<string>("");
  const [profilePicTwoPath, setProfilePicTwoPath] = useState<string>("");
  const [supplierList, setSUpplierList] = useState<RfiSupplierInterface[] | []>(
    []
  );

  const getSupplierList = async () => {
    setIsLoading(true);
    console.log(userId);

    try {
      const result = await RfiSupplierListService(
        token!,
        null,
        userId,
        0,
        null
      );
      console.log("114");

      console.log(result.data);

      if (result.data.status === 200) {
        console.log(result.data.data);

        const vatFilteredData = result.data.data.filter(
          (item: RfiSupplierInterface) => item.OBJECT_TYPE === "VAT"
        );

        if (vatFilteredData.length > 0) {
          setVatTotalData(vatFilteredData.length);
        }

        const filteredData = result.data.data.filter(
          (item: RfiSupplierInterface) => item.OBJECT_TYPE === "RFQ"
        );

        if (filteredData.length > 0) {
          // setSUpplierList(filteredData);
          setRfqTotalData(filteredData.length);
        }

        const csFilteredData = result.data.data.filter(
          (item: RfiSupplierInterface) => item.OBJECT_TYPE === "CS"
        );

        if (csFilteredData.length > 0) {
          setCsTotalData(csFilteredData.length);
        }

        const profileUpdateFilteredData = result.data.data.filter(
          (item: RfiSupplierInterface) => item.OBJECT_TYPE === "PROFILE_UPDATE"
        );

        if (profileUpdateFilteredData.length > 0) {
          console.log("supplier: ", profileUpdateFilteredData);
          setSUpplierList(profileUpdateFilteredData);
          setProfileUpdateTotal(profileUpdateFilteredData.length);
        }

        const newInfoFilteredData = result.data.data.filter(
          (item: RfiSupplierInterface) => item.OBJECT_TYPE === "NEW_INFO"
        );

        if (newInfoFilteredData.length > 0) {
          setNewInfoTotal(newInfoFilteredData.length);
        }

        const regFilteredData = result.data.data.filter(
          (item: RfiSupplierInterface) => item.OBJECT_TYPE === "Supplier Approval"
        );

        if (regFilteredData.length > 0) {
          setRegTotalData(regFilteredData.length);
        }

        const invoiceFilteredData = result.data.data.filter(
          (item: RfiSupplierInterface) => item.OBJECT_TYPE === "INVOICE"
        );

        if (invoiceFilteredData.length > 0) {
          setInvoiceTotal(invoiceFilteredData.length);
        }

        // setSUpplierList(result.data.data);
        setRfiSupplierListlength(result.data.data.length);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      showErrorToast("Something went wrong");
    }
    // try{

    //     const result=await RegisteredSupplierListNeedToApproveService(token!,approvalStatus,searchInput);
    //     if(result.data.status===200){
    //         setProfilePicOnePath(result.data.profile_pic1);
    //         setProfilePicTwoPath(result.data.profile_pic2);
    //         setSUpplierList(result.data.data);
    //         setIsLoading(false);

    //     }
    //     else{
    //         setIsLoading(false);
    //         showErrorToast(result.data.message);

    //     }

    // }
    // catch(error){
    //     setIsLoading(false);
    //     showErrorToast("Something went wrong");
    // }
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
    // getSupplierList();
  };

  const gotoRegistration = () => {
    setRfiManageSupplierPageNo(1);
  };

  const gotoRfq = () => {
    setRfiManageSupplierPageNo(3);
  };

  //csv header
  let fileName = moment(Date()).format("DD/MM/YYYY");
  const headers = [
    { label: "ID", key: "ID" },
    { label: "OBJECT_ID", key: "OBJECT_ID" },
    { label: "SUPPLIER_FULL_NAME", key: "SUPPLIER_FULL_NAME" },
    { label: "SUPPLIER_USER_NAME", key: "SUPPLIER_USER_NAME" },
    { label: "SUPPLIER_ORGANIZATION_NAME", key: "SUPPLIER_ORGANIZATION_NAME" },
    { label: "OBJECT_TYPE", key: "OBJECT_TYPE" },
    { label: "INITIATOR_ID", key: "INITIATOR_ID" },
    { label: "INITIATOR_NAME", key: "INITIATOR_NAME" },
    { label: "INITIATION_DATE", key: "INITIATION_DATE" },
    { label: "VIEWER_ID", key: "VIEWER_ID" },
    { label: "VIEWER_NAME", key: "VIEWER_NAME" },
    { label: "VIEW_DATE", key: "VIEW_DATE" },
    { label: "VIEWER_NOTE", key: "VIEWER_NOTE" },
    { label: "VIEWER_ACTION", key: "VIEWER_ACTION" },
  ];
  return (
    <div className=" mt-8 mx-8">
      <SuccessToast />
      <div className="flex items-center justify-between">
        <div className=" flex flex-col items-start">
          <PageTitle titleText="RFI Request" />
          {/* <NavigationPan list={pan} /> */}
        </div>

        {/* {supplierList.length === 0 ? null : (
          <CSVLink
            data={supplierList!}
            headers={headers}
            filename={`supplier_list_${fileName}.csv`}
          >
            <div className=" exportToExcel ">Export to Excel</div>
          </CSVLink>
        )} */}
      </div>
      {/* <div className="h-10"></div> */}
      <div className=" w-full flex justify-between items-center">
        {/* <CommonSearchField onChangeData={handleSearchInputChange} search={search} placeholder='Search Here' inputRef={searchInputRef} width='w-60' /> */}
        <div></div>
        {/* <CSVLink
          data={supplierList!}
          headers={headers}
          filename={`supplier_list_${fileName}.csv`}
        >
          <div className=" exportToExcel ">Export to Excel</div>
        </CSVLink> */}
      </div>
      <div className="h-10"></div>

      {isLoading ? (
        <LogoLoading />
      ) : (
        <div>
          <div className=" w-full rounded-md bg-whiteColor  border-[0.5px] border-borderColor ">
            {/* <div className="h-3"></div> */}
            {/* <div className=' h-14 w-full px-8 bg-inputBg flex justify-center items-center border-b-[0.5px] border-borderColor'></div>
                    <div className=' w-full h-10 bg-gray-50 flex justify-center items-center'>

                    </div> */}

            <div className="p-4 flex flex-row items-center space-x-3">
              <button
                onClick={() => {
                  // setIsActiveButtonRegistration(!isActiveButtonRegistration);
                  // gotoRegistration();
                  setRfiTabNo(11);
                }}
                className={` ${
                  rfiTabNo === 11
                    ? "bg-blue-50 rounded-t-md border-b-[1px] border-borderColor"
                    : "bg-whiteColor"
                } h-10 w-auto px-4 flex items-center justify-center`}
              >
                <div className="flex items-center space-x-2">
                  <p className=" text-sm font-mon font-medium text-blackColor">
                    Supplier Registration
                  </p>

                  <p className=" h-6 px-[6px] bg-blue-500 rounded-[4px] flex justify-center items-center text-whiteColor font-mon text-xs">
                    {regTotalData}
                  </p>
                </div>
              </button>

              <button
                onClick={() => {
                  // setIsActiveButtonRFQ(!isActiveButtonRFQ);
                  // gotoRfq();
                  setRfiTabNo(33);
                }}
                className={` ${
                  rfiTabNo === 33
                    ? "bg-blue-50 rounded-t-md border-b-[1px] border-blackishColor"
                    : "bg-whiteColor"
                } h-10 w-auto px-4 flex items-center justify-center`}
              >
                <div className="flex items-center space-x-2">
                  <p className=" text-sm font-mon font-medium text-blackColor">
                    RFQ
                  </p>

                  <p className=" h-6 px-[6px] bg-blue-500 rounded-[4px] flex justify-center items-center text-whiteColor font-mon text-xs">
                    {rfqTotalData}
                  </p>
                </div>
              </button>

              <button
                onClick={() => {
                  // setIsActiveButtonVAT(!isActiveButtonVAT);
                  // setIsActiveButtonRegistration(false);
                  // setIsActiveButtonRFQ(false);

                  setRfiTabNo(55);
                }}
                className={` ${
                  rfiTabNo === 55
                    ? "bg-blue-50 rounded-t-md border-b-[1px] border-blackishColor"
                    : "bg-whiteColor"
                } h-10 w-auto px-4 flex items-center justify-center`}
              >
                <div className="flex items-center space-x-2">
                  <p className=" text-sm font-mon font-medium text-blackColor">
                    VAT
                  </p>

                  <p className=" h-6 px-[6px] bg-blue-500 rounded-[4px] flex justify-center items-center text-whiteColor font-mon text-xs">
                    {vatTotalData}
                  </p>
                </div>
              </button>

              <button
                onClick={() => {
                  // setIsActiveButtonVAT(!isActiveButtonVAT);
                  // setIsActiveButtonRegistration(false);
                  // setIsActiveButtonRFQ(false);

                  setRfiTabNo(77);
                }}
                className={` ${
                  rfiTabNo === 77
                    ? "bg-blue-50 rounded-t-md border-b-[1px] border-blackishColor"
                    : "bg-whiteColor"
                } h-10 w-auto px-4 flex items-center justify-center`}
              >
                <div className="flex items-center space-x-2">
                  <p className=" text-sm font-mon font-medium text-blackColor">
                    CS
                  </p>

                  <p className=" h-6 px-[6px] bg-blue-500 rounded-[4px] flex justify-center items-center text-whiteColor font-mon text-xs">
                    {csTotalData}
                  </p>
                </div>
              </button>

              <button
                onClick={() => {
                  // setIsActiveButtonVAT(!isActiveButtonVAT);
                  // setIsActiveButtonRegistration(false);
                  // setIsActiveButtonRFQ(false);

                  setRfiTabNo(99);
                }}
                className={` ${
                  rfiTabNo === 99
                    ? "bg-blue-50 rounded-t-md border-b-[1px] border-blackishColor"
                    : "bg-whiteColor"
                } h-10 w-auto px-4 flex items-center justify-center`}
              >
                <div className="flex items-center space-x-2">
                  <p className=" text-sm font-mon font-medium text-blackColor">
                    Supplier Profile Update
                  </p>

                  <p className=" h-6 px-[6px] bg-blue-500 rounded-[4px] flex justify-center items-center text-whiteColor font-mon text-xs">
                    {profileUpdateTotal}
                  </p>
                </div>
              </button>

              <button
                onClick={() => {
                  // setIsActiveButtonVAT(!isActiveButtonVAT);
                  // setIsActiveButtonRegistration(false);
                  // setIsActiveButtonRFQ(false);

                  setRfiTabNo(111);
                }}
                className={` ${
                  rfiTabNo === 1111
                    ? "bg-blue-50 rounded-t-md border-b-[1px] border-blackishColor"
                    : "bg-whiteColor"
                } h-10 w-auto px-4 flex items-center justify-center`}
              >
                <div className="flex items-center space-x-2">
                  <p className=" text-sm font-mon font-medium text-blackColor">
                    Supplier New Info
                  </p>

                  <p className=" h-6 px-[6px] bg-blue-500 rounded-[4px] flex justify-center items-center text-whiteColor font-mon text-xs">
                    {newInfoTotal}
                  </p>
                </div>
              </button>

              {/* <button
                onClick={() => {
                  // setIsActiveButtonVAT(!isActiveButtonVAT);
                  // setIsActiveButtonRegistration(false);
                  // setIsActiveButtonRFQ(false);

                  setRfiTabNo(222);
                }}
                className={` ${
                  rfiTabNo === 222
                    ? "bg-blue-50 rounded-t-md border-b-[1px] border-blackishColor"
                    : "bg-whiteColor"
                } h-10 w-auto px-4 flex items-center justify-center`}
              >
                <div className="flex items-center space-x-2">
                  <p className=" text-sm font-mon font-medium text-blackColor">
                    Invoice
                  </p>

                  <p className=" h-6 px-[6px] bg-blue-500 rounded-[4px] flex justify-center items-center text-whiteColor font-mon text-xs">
                    {invoiceTotal}
                  </p>
                </div>
              </button> */}
            </div>

            {supplierList.length === 0 ? (
              <div>
                <div className="h-12"></div>
                <NotFoundPage />
              </div>
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
                          Supplier ID
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                          Initiator Name
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                          Initiator Date
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                          Initiator Note
                        </th>
                      </tr>
                    </thead>

                    {supplierList.map((e, i) => (
                      <tbody
                        onClick={() => {
                          navigateTo(
                            e.OBJECT_ID,
                            e.ID,
                            e.STAGE_LEVEL,
                            e.TEMPLATE_ID
                          );
                        }}
                        key={e.ID}
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
                              {e.OBJECT_ID}
                            </div>
                          </td>
                          <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                            <div className="w-full overflow-auto custom-scrollbar text-center">
                              {e.INITIATOR_NAME}
                            </div>
                          </td>
                          <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                            <div className="w-full overflow-auto custom-scrollbar text-center">
                              {convertDateFormat(e.INITIATION_DATE)}
                            </div>
                          </td>
                          <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                            <div className="w-full overflow-auto custom-scrollbar text-center">
                              {e.INITIATOR_NOTE}
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

                {/* <div className="overflow-x-auto">
                  <table
                    className="min-w-full divide-y divide-gray-200"
                    style={{ tableLayout: "fixed" }}
                  >
                    <thead className="sticky top-0 bg-[#F4F6F8] h-14">
                      <tr>
                        <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  ">
                          SL
                        </th>
                        <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                          RFQ Id
                        </th>
                        <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                          Initaitor Name
                        </th>
                        <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                          Initaitor Date
                        </th>
                        <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                          Initaitor Note
                        </th>

                      
                      </tr>
                    </thead>

                    {supplierList.slice(0, limit).map((e, i) => (
                      <tbody
                        onClick={() => {
                          navigateTo(e.OBJECT_ID, e.ID);
                        }}
                        className=" cursor-pointer
                                    bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]"
                        key={e.ID}
                      >
                        <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor font-medium">
                          {i + 1}
                        </td>

                        <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                        
                          {e.OBJECT_ID}
                        </td>

                        <td className=" w-64 font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                          {e.INITIATOR_NAME}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                         
                          {convertDateFormat(e.INITIATION_DATE)}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                         
                          {e.INITIATOR_NOTE}
                        </td>
                      </tbody>
                    ))}

                    <tfoot className="sticky bottom-0 bg-white">
                      <tr className=" h-12">
                        <td></td>
                       
                      </tr>
                    </tfoot>
                  </table>
                </div> */}
              </>
            )}
            <div className="h-1"></div>
          </div>
        </div>
      )}
    </div>
  );
}
