import React, { useEffect, useState, useRef } from "react";
import useCsCreationStore from "../store/CsCreationStore";
import CsItemInterface from "../interface/CsItemInterface";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import CsDetailsService from "../service/CsDetailsService";
import { useAuth } from "../../login_both/context/AuthContext";
import LogoLoading from "../../Loading_component/LogoLoading";
import NotFoundPage from "../../not_found/component/NotFoundPage";
import moment from "moment";
import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";
import PageTitle from "../../common_component/PageTitle";
import NavigationPan from "../../common_component/NavigationPan";
import CommonButton from "../../common_component/CommonButton";
import ArrowLeftIcon from "../../icons/ArrowLeftIcon";
import ArrowRightIcon from "../../icons/ArrowRightIcon";
import { CSVLink } from "react-csv";
import usePrItemsStore from "../../buyer_section/pr/store/prItemStore";
import RfqHeaderDetailsService from "../../buyer_section/pr_item_list/service/RfqHeaderDetailsService";
import DeleteIcon from "../../icons/DeleteIcon";
import CsItemDeleteService from "../service/CsItemDeleteService";
import WarningModal from "../../common_component/WarningModal";
import isoToDateTime from "../../utils/methods/isoToDateTime";
import UserCircleIcon from "../../icons/userCircleIcon";
import RfiSupplierListService from "../../rfi_in_supplier_registration/service/RfiSupplierListService";
import RfiSupplierInterface from "../../rfi_in_supplier_registration/interface/RfiSupplierInterface";
import fetchFileUrlService from "../../common_service/fetchFileUrlService";
const pan = ["Home", "CS List", "CS item List"];

export default function SavedItemInCsPage() {
  //store
  const {
    savedCsIdInStore,
    setCsPageNo,
    setRfqLineIdListInStore,
    setSavedCsIdInStore,
    setRfqIdInCsCreationStore,
    rfqIdInCsCreationStore,
    setBuyerGeneralTermInStore,
    buyerDeptInCsCreationStore,

    approvalTypeInCsCreation,

    setApprovalTypeInCsCreation,

    setBuyerDeptInCsCreationStore,
    setRfqTypeInCsCreationStore,
  } = useCsCreationStore();

  const { setRfqHeaderDetailsInStore } = usePrItemsStore();
  //store

  const back = () => {
    setRfqLineIdListInStore(null);
    setSavedCsIdInStore(null);
    setRfqIdInCsCreationStore(null);
    setBuyerDeptInCsCreationStore(null);
    setApprovalTypeInCsCreation(null);
    setRfqTypeInCsCreationStore(null);
    setCsPageNo(1);
  };
  const nextPage = () => {
    const rqfLineId: number[] = itemList.map((item) => item.RFQ_LINE_ID);

    // setRfqLineIdListInStore(selectedRfqLineIdList);
    setRfqLineIdListInStore(rqfLineId);
    setCsPageNo(3);
  };

  //context
  const { token, userId } = useAuth();
  //context
  const [itemList, setItemList] = useState<CsItemInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    getCsItem();

    getHeaderDetails();
  }, []);

  //rfqHeader details

  const getHeaderDetails = async () => {
    try {
      const result = await RfqHeaderDetailsService(
        token!,
        rfqIdInCsCreationStore!
      ); //rfwIdInStore
      if (result.data.status === 200) {
        console.log(result.data);

        setRfqHeaderDetailsInStore(result.data);
        setBuyerGeneralTermInStore(result.data.details.BUYER_GENERAL_TERMS);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Rfq Header Details Load Failed");
    }
  };
  //rfqHeader details

  const getCsItem = async () => {
    try {
      setIsLoading(true);
      const result = await CsDetailsService(token!, savedCsIdInStore!);
      console.log(result); //savedCsIdInStore!

      if (result.data.status === 200) {
        setItemList(result.data.data);
        if (isSelectedAll) {
          const list: number[] = [];
          for (let i = 0; i < result.data.data.length; i++) {
            list.push(result.data.data[i].RFQ_LINE_ID);
          }
          setSelectedRfqLineIdList((previousIdList) => [
            ...previousIdList,
            ...list,
          ]);
        }
        dividePage(result.data.total, limit);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      showErrorToast("CS Items Load Failed");
    }
  };
  const [selectedRfqLineIdList, setSelectedRfqLineIdList] = useState<number[]>(
    []
  );
  const [selectedCsLineIdList, setSelectedCsLineIdList] = useState<number[]>(
    []
  );

  const [isSelectedAll, setIsSelectAll] = useState<boolean>(false);
  const selectAll = () => {
    setIsSelectAll(true);
    const list: number[] = [];
    for (let i = 0; i < itemList.length; i++) {
      list.push(itemList[i].RFQ_LINE_ID);
    }
    setSelectedRfqLineIdList(list);
  };
  const unselectAll = () => {
    setIsSelectAll(false);
    setSelectedRfqLineIdList([]);
  };

  const toggleRfqLineId = (rfqLineId: number) => {
    setSelectedRfqLineIdList((prevList) => {
      // Check if rfqLineId is already in the list
      const index = prevList.indexOf(rfqLineId);
      if (index === -1) {
        // If not, add it to the list
        return [...prevList, rfqLineId];
      } else {
        // If yes, remove it from the list
        const newList = [...prevList];
        newList.splice(index, 1);
        return newList;
      }
    });
  };
  const toggleCsLineId = (csLineId: number) => {
    setSelectedCsLineIdList((prevList) => {
      // Check if rfqLineId is already in the list
      const index = prevList.indexOf(csLineId);
      if (index === -1) {
        // If not, add it to the list
        return [...prevList, csLineId];
      } else {
        // If yes, remove it from the list
        const newList = [...prevList];
        newList.splice(index, 1);
        return newList;
      }
    });
  };

  //pagination
  const [total, setTotal] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(10);
  const [pageNo, setPageNo] = useState<number>(1);
  const [offset, setOffSet] = useState<number>(0);
  const [isSearch, setIsSearch] = useState<boolean>(false);

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

  const next = () => {
    let newOff;

    newOff = offset + limit;
    console.log(newOff);
    setOffSet(newOff);

    setPageNo((pre) => pre + 1);
    console.log(limit);
    // getHistory("", "", newOff, limit);
  };

  const previous = () => {
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
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);

    const newLimit = parseInt(event.target.value, 10);
    console.log(newLimit);

    setLimit(newLimit);
    // getHistory(
    //   isSearch ? searchStartDate : "",
    //   isSearch ? searchEndDate : "",
    //   offset,
    //   newLimit
    // );
  };

  //pagination

  //export to excel

  let fileName = moment(Date()).format("DD/MM/YYYY");
  const headers = [
    { label: "CS_LINE_ID", key: "CS_LINE_ID" },
    { label: "CS_ID", key: "CS_ID" },
    { label: "RFQ_ID", key: "RFQ_ID" },
    { label: "RFQ_LINE_ID", key: "RFQ_LINE_ID" },
    { label: "QUOT_LINE_ID", key: "QUOT_LINE_ID" },
    { label: "RECOMMENDED", key: "RECOMMENDED" },
    { label: "RECOMMENDED_BY", key: "RECOMMENDED_BY" },
    { label: "AWARDED", key: "AWARDED" },
    { label: "AWARDED_BY", key: "AWARDED_BY" },
    { label: "NOTE_FROM_BUYER", key: "NOTE_FROM_BUYER" },
    { label: "CREATED_BY", key: "CREATED_BY" },
    { label: "CREATION_DATE", key: "CREATION_DATE" },
    { label: "LAST_UPDATED_BY", key: "LAST_UPDATED_BY" },
    { label: "LAST_UPDATE_DATE", key: "LAST_UPDATE_DATE" },
    { label: "RFQ_LINE_ID_1", key: "RFQ_LINE_ID_1" },
    { label: "RFQ_ID_1", key: "RFQ_ID_1" },
    { label: "REQUISITION_HEADER_ID", key: "REQUISITION_HEADER_ID" },
    { label: "REQUISITION_LINE_ID", key: "REQUISITION_LINE_ID" },
    { label: "PR_NUMBER", key: "PR_NUMBER" },
    { label: "LINE_NUM", key: "LINE_NUM" },
    { label: "LINE_TYPE_ID", key: "LINE_TYPE_ID" },
    { label: "ITEM_CODE", key: "ITEM_CODE" },
    { label: "ITEM_DESCRIPTION", key: "ITEM_DESCRIPTION" },
    { label: "ITEM_SPECIFICATION", key: "ITEM_SPECIFICATION" },
    { label: "WARRANTY_DETAILS", key: "WARRANTY_DETAILS" },
    { label: "PACKING_TYPE", key: "PACKING_TYPE" },
    { label: "PROJECT_NAME", key: "PROJECT_NAME" },
    { label: "EXPECTED_QUANTITY", key: "EXPECTED_QUANTITY" },
    { label: "EXPECTED_BRAND_NAME", key: "EXPECTED_BRAND_NAME" },
    { label: "EXPECTED_ORIGIN", key: "EXPECTED_ORIGIN" },
    { label: "LCM_ENABLE_FLAG", key: "LCM_ENABLE_FLAG" },
    { label: "UNIT_MEAS_LOOKUP_CODE", key: "UNIT_MEAS_LOOKUP_CODE" },
    { label: "NEED_BY_DATE", key: "NEED_BY_DATE" },
    { label: "ORG_ID", key: "ORG_ID" },
    { label: "ATTRIBUTE_CATEGORY", key: "ATTRIBUTE_CATEGORY" },
    { label: "PR_FROM_DFF", key: "PR_FROM_DFF" },
    { label: "AUTHORIZATION_STATUS", key: "AUTHORIZATION_STATUS" },
    { label: "NOTE_TO_SUPPLIER", key: "NOTE_TO_SUPPLIER" },
    { label: "WARRANTY_ASK_BY_BUYER", key: "WARRANTY_ASK_BY_BUYER" },
    { label: "BUYER_VAT_APPLICABLE", key: "BUYER_VAT_APPLICABLE" },
    { label: "DELIVER_TO_LOCATION_ID", key: "DELIVER_TO_LOCATION_ID" },
    {
      label: "DESTINATION_ORGANIZATION_ID",
      key: "DESTINATION_ORGANIZATION_ID",
    },
    { label: "CS_STATUS", key: "CS_STATUS" },
    { label: "CREATION_DATE_1", key: "CREATION_DATE_1" },
    { label: "CREATED_BY_1", key: "CREATED_BY_1" },
    { label: "LAST_UPDATED_BY_1", key: "LAST_UPDATED_BY_1" },
    { label: "LAST_UPDATE_DATE_1", key: "LAST_UPDATE_DATE_1" },
    { label: "BUYER_FILE_ORG_NAME", key: "BUYER_FILE_ORG_NAME" },
    { label: "BUYER_FILE_NAME", key: "BUYER_FILE_NAME" },
    { label: "ITEM_ID", key: "ITEM_ID" },
    { label: "QUOT_LINE_ID_1", key: "QUOT_LINE_ID_1" },
    { label: "RFQ_LINE_ID_2", key: "RFQ_LINE_ID_2" },
    { label: "RFQ_ID_2", key: "RFQ_ID_2" },
    { label: "USER_ID", key: "USER_ID" },
    { label: "WARRANTY_BY_SUPPLIER", key: "WARRANTY_BY_SUPPLIER" },
    { label: "SUPPLIER_VAT_APPLICABLE", key: "SUPPLIER_VAT_APPLICABLE" },
    { label: "UNIT_PRICE", key: "UNIT_PRICE" },
    { label: "OFFERED_QUANTITY", key: "OFFERED_QUANTITY" },
    { label: "PROMISE_DATE", key: "PROMISE_DATE" },
    { label: "SUP_FILE_ORG_NAME", key: "SUP_FILE_ORG_NAME" },
    { label: "SUP_FILE_NAME", key: "SUP_FILE_NAME" },
    { label: "CREATION_DATE_2", key: "CREATION_DATE_2" },
    { label: "CREATED_BY_2", key: "CREATED_BY_2" },
    { label: "LAST_UPDATED_BY_2", key: "LAST_UPDATED_BY_2" },
    { label: "LAST_UPDATE_DATE_2", key: "LAST_UPDATE_DATE_2" },
    { label: "AVAILABLE_BRAND_NAME", key: "AVAILABLE_BRAND_NAME" },
    { label: "AVAILABLE_ORIGIN", key: "AVAILABLE_ORIGIN" },
    { label: "AVAILABLE_SPECS", key: "AVAILABLE_SPECS" },
  ];

  //export to excel

  const [csLineIdList, setCsLineIdList] = useState<number[]>([]);
  const [rfqLineIdList, setRfqLineIdList] = useState<number[]>([]);

  const [singleItem, setSingleitem] = useState<CsItemInterface | null>(null);

  const getSingleItem = (e: CsItemInterface) => {
    setSingleitem(e);

    setCsLineIdList([...csLineIdList, e.CS_LINE_ID]);
    setRfqLineIdList([...rfqLineIdList, e.RFQ_LINE_ID]);
  };

  const [isSingleDeleteOpen, setIsSingleDeleteOpen] = useState<boolean>(false);
  const openSingleDeleteModal = () => {
    setIsSingleDeleteOpen(true);
  };
  const closeSingleDeleteModal = () => {
    setSingleitem(null);
    setIsSingleDeleteOpen(false);
  };

  const singleDelete = async () => {
    try {
      const result = await CsItemDeleteService(
        token!,
        csLineIdList,
        rfqLineIdList
      );
      if (result.statusCode === 200) {
        showSuccessToast(result.data.message);
        getCsItem();

        getHeaderDetails();
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Something Went Wrong While Deleting");
    }
  };

  const [isMultiDeleteOpen, setIsMultiDeleteOpen] = useState<boolean>(false);

  const openIsMultiDeleteModal = () => {
    setIsMultiDeleteOpen(true);
  };
  const closeIsMultiDeleteModal = () => {
    setIsMultiDeleteOpen(false);
  };

  const multiDelete = async () => {
    try {
      const result = await CsItemDeleteService(
        token!,
        selectedCsLineIdList,
        selectedRfqLineIdList
      );
      if (result.statusCode === 200) {
        showSuccessToast(result.data.message);
        getCsItem();

        getHeaderDetails();
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Something Went Wrong While Deleting");
    }
  };

  useEffect(() => {
    getRfqList();
  }, []);

  const [propicPath, setPropicPath] = useState<string>("");

  const [supplierList, setSUpplierList] = useState<RfiSupplierInterface[] | []>(
    []
  );
  const getRfqList = async () => {
    // setIsLoading(true);

    console.log("userId: ", userId);
    console.log("supId, ", rfqIdInCsCreationStore);

    try {
      const result = await RfiSupplierListService(
        token!,
        userId,
        null,
        null,
        rfqIdInCsCreationStore
      );
      console.log(result.data);

      if (result.data.status === 200) {
        console.log(result.data.data);
        setPropicPath(result.data.PROFILE_PIC);

        const csData = result.data.data.filter(
          (item: RfiSupplierInterface) => item.OBJECT_TYPE === "CS"
        );

        if (csData.length > 0) {
          setSUpplierList(csData);
        } else {
          setSUpplierList([]);
        }
      } else {
        // setIsLoading(false);
        showSuccessToast(result.data.message);
      }
    } catch (error) {
      //   setIsLoading(false);
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

  //image array korbo

  interface ImageUrls {
    [key: number]: string | null;
  }

  const [imageUrls, setImageUrls] = useState<ImageUrls>({});
  const [imageUrls2, setImageUrls2] = useState<ImageUrls>({});

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
          const url = await getImage2(propicPath, element.INITIATOR_PRO_PIC);
          newImageUrls[element.ID] = url;
        }
        setImageUrls(newImageUrls);
        // setIsLoading(false);
      };
      fetchImages();
    }
  }, [supplierList, propicPath]);
  useEffect(() => {
    if (supplierList) {
      const fetchImages = async () => {
        const newImageUrls: ImageUrls = {};
        for (let index = 0; index < supplierList.length; index++) {
          const element = supplierList[index];
          const url = await getImage2(propicPath, element.VIEWER_PRO_PIC);
          newImageUrls[element.INITIATOR_ID] = url;
        }
        setImageUrls2(newImageUrls);
        // setIsLoading(false);
      };
      fetchImages();
    }
  }, [supplierList, propicPath]);

  return (
    <div className=" bg-white m-8">
      <SuccessToast />
      <WarningModal
        isOpen={isSingleDeleteOpen}
        closeModal={closeSingleDeleteModal}
        action={singleDelete}
        message="Do you want to Delete ?"
      />
      <WarningModal
        isOpen={isMultiDeleteOpen}
        closeModal={closeIsMultiDeleteModal}
        action={multiDelete}
        message="Do you want to Delete ?"
      />

      <div className=" w-full flex justify-between items-center">
        <div>
          <PageTitle titleText="CS Item List" />
          {/* <NavigationPan list={pan} /> */}
        </div>
        <CommonButton
          onClick={back}
          titleText="Back"
          height="h-8"
          width="w-24"
          color="bg-midGreen"
        />
      </div>
      <div className=" my-6 w-full flex items-center  justify-between">
        {selectedCsLineIdList.length > 0 ? (
          <CommonButton
            width="w-40"
            titleText="Delete Item"
            onClick={openIsMultiDeleteModal}
            color="bg-red-600"
          />
        ) : (
          <div></div>
        )}
        {itemList.length === 0 ? null : (
          <CSVLink
            data={itemList!}
            headers={headers}
            filename={`item_list_${fileName}.csv`}
          >
            <div className=" exportToExcel ">Export to Excel</div>
          </CSVLink>
        )}
      </div>

      {isLoading ? (
        <div className=" w-full h-screen flex justify-center items-center">
          <LogoLoading />
        </div>
      ) : !isLoading && itemList.length === 0 ? (
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
                  PR No/Line No
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Requester/Username
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Item Description
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Specification
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Expected Brand Name
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Expected Brand Origin
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  LCM Enabled
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Vat
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Warranty
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  UOM
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Expected Quantity
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Need By Date
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Inventory Org Name
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Note to Supplier
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Action
                </th>
              </tr>
            </thead>

            {itemList.map((e, i) => (
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar ">
                    <div className="w-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                      {i + 1}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {e.PR_NUMBER}/{e.LINE_NUM}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {"N/A"}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {!e.ITEM_DESCRIPTION ? "N/A" : e.ITEM_DESCRIPTION}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {!e.ITEM_SPECIFICATION ? "N/A" : !e.ITEM_SPECIFICATION}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {!e.EXPECTED_BRAND_NAME ? "N/A" : e.EXPECTED_BRAND_NAME}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {!e.EXPECTED_ORIGIN ? "N/A" : e.EXPECTED_ORIGIN}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      <div
                        className={` flex justify-center items-center h-4 w-4 ${
                          e.LCM_ENABLE_FLAG === "Y"
                            ? " bg-midGreen border-none"
                            : "border-borderColor border-[1px] bg-white"
                        } rounded-[4px]`}
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
                      <div
                        className={` flex justify-center items-center h-4 w-4 ${
                          e.BUYER_VAT_APPLICABLE === "Y"
                            ? " bg-midGreen border-none"
                            : "border-borderColor border-[1px] bg-white"
                        } rounded-[4px]`}
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
                      <div
                        className={` flex justify-center items-center h-4 w-4 ${
                          e.WARRANTY_ASK_BY_BUYER === "Y"
                            ? " bg-midGreen border-none"
                            : "border-borderColor border-[1px] bg-white"
                        } rounded-[4px]`}
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
                      {!e.UNIT_MEAS_LOOKUP_CODE
                        ? "N/A"
                        : e.UNIT_MEAS_LOOKUP_CODE}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {!e.EXPECTED_QUANTITY ? "N/A" : e.EXPECTED_QUANTITY}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {!e.NEED_BY_DATE
                        ? "N/A"
                        : moment(e.NEED_BY_DATE).format("DD-MMMM-YYYY")}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {"N/A"}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {!e.NOTE_TO_SUPPLIER ? "N/A" : e.NOTE_TO_SUPPLIER}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      <button
                        onClick={() => {
                          getSingleItem(e);
                          openSingleDeleteModal();
                        }}
                      >
                        <DeleteIcon className=" w-6 h-6" />
                      </button>
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
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <div className="h-4"></div>

      <div className="w-full my-10">
        {supplierList.length > 0 ? (
          <div>
            {supplierList.map((e, i) => (
              <div
                className=" w-full my-6 p-2 bg-white rounded-md border-[0.1px] border-gray-200"
                style={{
                  boxShadow:
                    "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
                }}
              >
                <div
                  key={e.ID}
                  className=" p-4 w-full flex space-x-4 items-start"
                >
                  <div className=" w-12 h-12 rounded-full">
                    {e.INITIATOR_PRO_PIC === "N/A" ? (
                      <UserCircleIcon className=" w-full h-full" />
                    ) : (
                      <div className="avatar">
                        <div className="w-12 rounded-full border-[2px] border-midGreen">
                          <img
                            // src={`${propicPath}/${e.INITIATOR_PRO_PIC}`}
                            src={imageUrls[e.ID]!}
                            alt="avatar"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="  text-midBlack font-mon font-medium">
                      {e.INITIATOR_NAME}
                    </p>

                    <p className="  font-mon text-sm text-midGreen">
                      {isoToDateTime(e.INITIATION_DATE)}
                    </p>

                    <p className=" smallText flex space-x-2">
                      <p>Query:</p>
                      <p> {e.INITIATOR_NOTE}</p>
                    </p>
                  </div>
                </div>

                <p className=" font-mon text-lg font-semibold mt-4 border-b-[1px] border-gray-400"></p>

                {/* <div className=" my-4 w-full h-[1px] bg-midBlack"></div> */}

                <div
                  key={e.ID}
                  className=" p-4 w-full flex space-x-4 items-start"
                >
                  <div className=" w-12 h-12 rounded-full">
                    {e.INITIATOR_PRO_PIC === "N/A" ? (
                      <UserCircleIcon className=" w-full h-full" />
                    ) : (
                      <div className="avatar">
                        <div className="w-12 rounded-full border-[2px] border-midGreen">
                          <img
                            // src={`${propicPath}/${e.VIEWER_PRO_PIC}`}
                            src={imageUrls2[e.INITIATOR_ID]!}
                            alt="avatar"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="  text-midBlack font-mon font-medium">
                      {e.VIEWER_NAME}
                    </p>
                    <p className="  font-mon text-sm text-midGreen">
                      {e.VIEW_DATE === "" ? "---" : isoToDateTime(e.VIEW_DATE)}
                    </p>
                    <p className=" smallText flex space-x-2">
                      <p className="smallText">Feedback:</p>
                      <p>{` ${e.VIEWER_NOTE}`}</p>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* <div className=" w-full flex justify-center items-center my-2">
        <div className=" flex space-x-2">
          <p className=" smallText">Rows per page: </p>
          <select value={limit} onChange={handleLimitChange} className="  w-10">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
          </select>
          <div>
            {pageNo} of {total}
          </div>

          <button
            disabled={pageNo === 1 ? true : false}
            onClick={previous}
            className=" w-6 h-6"
          >
            <ArrowLeftIcon className=" w-full h-full" />
          </button>

          <button disabled={pageNo === total ? true : false} onClick={next}>
            <ArrowRightIcon />
          </button>
        </div>
      </div> */}

      <div className="mt-10 w-full flex space-x-6 items-center justify-end">
        <CommonButton
          onClick={back}
          titleText="Previous"
          color="bg-graishColor"
          height="h-8"
          width="w-48"
        />
        <CommonButton
          onClick={nextPage}
          titleText="Continue"
          color="bg-midGreen"
          height="h-8"
          width="w-48"
        />
      </div>
      <div className=" h-20"></div>
    </div>
  );
}
