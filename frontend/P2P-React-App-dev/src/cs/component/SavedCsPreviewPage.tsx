import React, { useState, useEffect, useRef } from "react";

import InputLebel from "../../common_component/InputLebel";
import CommonButton from "../../common_component/CommonButton";
import PageTitle from "../../common_component/PageTitle";
import NavigationPan from "../../common_component/NavigationPan";
import useCsCreationStore from "../store/CsCreationStore";
import PoHistoryInterface from "../interface/PoHistoryInterface";
import { useAuth } from "../../login_both/context/AuthContext";
import ItemWisePoHistoryService from "../service/ItemWisePoHistoryService";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";
import moment from "moment";
import CsCreateUpdateService from "../service/CsCreateUpdateService";
import PrHistoryInterface from "../interface/PrHistoryInterface";
import ItemWisePrHistoryService from "../service/ItemWisePrHistoryService";
import HierarchyInterface from "../../registration/interface/hierarchy/HierarchyInterface";
import HierachyListByModuleService from "../../registration/service/approve_hierarchy/HierarchyListByModuleService";
import CsSaveService from "../service/csSaveService";
import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";
import SupplierWiseTermSetService from "../service/supplierWiseTermSetService";
import UpdateCsService from "../service/UpdateCsService";
import CommonInputField from "../../common_component/CommonInputField";
import CsHierarchyService from "../service/CsHierarchyService";
import isoToDateTime from "../../utils/methods/isoToDateTime";
import OrgWiseStockInterface from "../interface/OrgWiseStockInterface";
import LogoLoading from "../../Loading_component/LogoLoading";
import OrgWiseStockService from "../service/OrgWiseStockService";
import usePrItemsStore from "../../buyer_section/pr/store/prItemStore";
const pan = ["CS List", "CS Details", "CS Preview"];

export default function SavedCsPreviewPage() {
  const [limit, setLimit] = useState(5);
  const [pageNo, setPageNo] = useState(1);

  //cs term
  const [openClose, setOpenClose] = useState(false);
  const [termText, setTermText] = useState("");

  const handleInputChange = (e: any) => {
    const inputText = e.target.value;
    if (inputText.length <= 1500) {
      setTermText(inputText);
    } else {
      setTermText(inputText.slice(0, 1500));
    }
  };

  const cancel = () => {
    setOpenClose(false);
  };

  //cs term
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
  const download = async () => {};

  const termModalShow = () => {
    setOpenClose(true);
  };

  //context

  const back = () => {
    setCsPageNo(3);
  };
  const nextPage = () => {
    // setRfqPageNo(4);
  };

  //context

  //auth
  const { token, userId, department } = useAuth();

  //auth

  //store

  const { rfqHeaderDetailsInStore } = usePrItemsStore();

  const {
    quotationDataListInStore,
    convertedItemsForCsCreationAndUpdateInStore,
    ListlengthInStore,
    quotationListInStore,
    buyerGeneralTermInStore,
    currencyNameInStore,
    orgNameInStore,
    csGeneralTermInStore,
    orgIdInStore,
    rfqIdInCsCreationStore,
    supplierListInStore,
    setCsPageNo,
    savedCsIdInStore,
    setSavedCsIdInStore,
    setRfqIdInCsCreationStore,
    setRfqLineIdListInStore,
    setConvertedItemsForCsCreationAndUpdateInStore,
    csTitleInStore,
    setCsTitleInStore,
    csCreationDateInStore,
    csNoteInStore,
    buyerDeptInCsCreationStore,

    approvalTypeInCsCreation,

    setApprovalTypeInCsCreation,

    setBuyerDeptInCsCreationStore,
    rfqTypeInCsCreationStore,
  } = useCsCreationStore();

  //store

  const [saveLoading, setSaveLoading] = useState(false);

  const save = async () => {
    try {
      setSaveLoading(true);
      console.log(rfqIdInCsCreationStore);
      console.log(orgIdInStore);
      console.log(csTitleInStore);
      console.log(csTitleInStore);
      console.log(convertedItemsForCsCreationAndUpdateInStore);

      const result = await CsSaveService(
        token!,
        rfqIdInCsCreationStore!,
        orgIdInStore!,
        "SAVE",
        csTitleInStore!,
        csGeneralTermInStore!,
        csNoteInStore!,
        convertedItemsForCsCreationAndUpdateInStore!,
        totalAmount,
        buyerDeptInCsCreationStore!,
        approvalTypeInCsCreation!,
        rfqHeaderDetailsInStore?.details.CONVERSION_RATE!
      );
      if (result.data.status === 200) {
        setTermsToSuppliers();
        setSaveLoading(false);
        showSuccessToast(result.data.message);
        setSavedCsIdInStore(null);
        setRfqIdInCsCreationStore(null);
        setRfqLineIdListInStore(null);
        setConvertedItemsForCsCreationAndUpdateInStore(null);
        setCsTitleInStore(null);

        setCsPageNo(1);
      } else {
        setSaveLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setSaveLoading(false);
      showErrorToast("Cs Save Failed");
    }
  };

  const update = async () => {
    console.log(convertedItemsForCsCreationAndUpdateInStore);

    try {
      setSaveLoading(true);
      const result = await UpdateCsService(
        token!,
        savedCsIdInStore,
        rfqIdInCsCreationStore!,
        orgIdInStore!,
        "SAVE",
        csTitleInStore!,
        csGeneralTermInStore!,
        csNoteInStore!,
        convertedItemsForCsCreationAndUpdateInStore!,
        totalAmount,
        buyerDeptInCsCreationStore!,
        approvalTypeInCsCreation!,
        rfqHeaderDetailsInStore?.details.CONVERSION_RATE!
      );
      if (result.data.status === 200) {
        setTermsToSuppliers();
        setSaveLoading(false);
        showSuccessToast(result.data.message);
        setSavedCsIdInStore(null);
        setRfqIdInCsCreationStore(null);
        setRfqLineIdListInStore(null);
        setConvertedItemsForCsCreationAndUpdateInStore(null);
        setCsTitleInStore(null);
        setBuyerDeptInCsCreationStore(null);
        setApprovalTypeInCsCreation(null);
        setCsPageNo(1);
      } else {
        setSaveLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setSaveLoading(false);
      showErrorToast("Cs Save Failed");
    }
  };

  // const [isSubmitLoading,setIsSubmitLoading]=useState(false);

  const submit = async () => {
    try {
      setIsSubmitLoading(true);
      const result = await UpdateCsService(
        token!,
        savedCsIdInStore,
        rfqIdInCsCreationStore!,
        orgIdInStore!,
        "IN PROCESS",
        csTitleInStore!,
        csGeneralTermInStore!,
        csNoteInStore!,
        convertedItemsForCsCreationAndUpdateInStore!,
        totalAmount,
        buyerDeptInCsCreationStore!,
        approvalTypeInCsCreation!,
        rfqHeaderDetailsInStore?.details.CONVERSION_RATE!
      );
      if (result.data.status === 200) {
        setTermsToSuppliers();
        setIsSubmitLoading(false);
        // showSuccessToast(result.data.message);
        showSuccessToast("CS Submitted Successfully");
        setSavedCsIdInStore(null);
        setRfqIdInCsCreationStore(null);
        setRfqLineIdListInStore(null);
        setConvertedItemsForCsCreationAndUpdateInStore(null);
        setCsTitleInStore(null);
        setBuyerDeptInCsCreationStore(null);
        setApprovalTypeInCsCreation(null);
        setCsPageNo(1);
      } else {
        setIsSubmitLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsSubmitLoading(false);
      showErrorToast("Cs Sumit Failed");
    }
  };

  useEffect(() => {
    console.log(department);

    setCsTitle(csTitleInStore!);
    if (csTitleRef.current) {
      csTitleRef.current.value = csTitleInStore!;
    }
    getApproverHierachy();
  }, []);

  const [csTitle, setCsTitle] = useState<string>("");

  const csTitleRef = useRef<HTMLInputElement | null>(null);

  const handleCsTitile = (value: string) => {
    setCsTitle(value);
  };

  //get item wise po history
  const [poHistoryList, setPoHistoryList] = useState<PoHistoryInterface[]>([]);

  const getItemWisePoHistory = async (itemId: number) => {
    try {
      const result = await ItemWisePoHistoryService(token!, itemId);
      if (result.data.status === 200) {
        setPoHistoryList(result.data.data);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Po History Load Failed");
    }
  };

  const [openIndex, setOpenIndex] = useState<number>(-1);
  const toggleCollapse = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };
  const [openIndex2, setOpenIndex2] = useState<number>(-1);
  const toggleCollapse2 = (index2: number) => {
    setOpenIndex2(openIndex2 === index2 ? -1 : index2);
  };
  //get item wise po history

  //cs create

  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

  const createUpdateRfq = async () => {
    try {
      setIsSubmitLoading(true);

      // const result=CsCreateUpdateService(token!,)
    } catch (error) {
      setIsSubmitLoading(false);
      showErrorToast("Something Went Wrong In CS");
    }
  };

  //cs create

  //pr history
  const [prHistory, setPrHistory] = useState<PrHistoryInterface[]>([]);

  const getPrHistory = async (
    reqHeaderId: number,
    reqLineId: number,
    prNumber: number,
    orgId: number,
    itemId: number
  ) => {
    try {
      const result = await ItemWisePrHistoryService(
        token!,
        reqHeaderId,
        reqLineId,
        prNumber,
        orgId,
        itemId
      );
      if (result.data.status === 200) {
        setPrHistory(result.data.data);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Pr History Loading Failed");
    }
  };
  //pr history

  //hierarchy

  const openModalForHierarchy = () => {
    const modal = document.getElementById("my_modal_12") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  const [hierarchyUserProfilePicturePath, setHierarchyUserProfilePicturePath] =
    useState<string>("");
  const [hierarchyList, setHierarchyList] = useState<HierarchyInterface[] | []>(
    []
  );
  const getApproverHierachy = async () => {
    try {
      // const result = await HierachyListByModuleService(
      //   token!,
      //   userId!,
      //   "CS Approval"
      // );
      const result = await CsHierarchyService(
        token!,
        department === "Local"
          ? "Local CS Approval"
          : "Supplier Foreign CS Approval",
        savedCsIdInStore!
      );
      console.log(result);

      if (result.data.status === 200) {
        setHierarchyUserProfilePicturePath(result.data.profile_pic);
        setHierarchyList(result.data.data);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Something went wrong");
    }
  };

  //hierarchy

  //buyer general term

  const openModal = () => {
    const modal = document.getElementById("my_modal_1") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  const closeModal = () => {
    const modal = document.getElementById("my_modal_1") as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  };

  //buyer general term

  //save supplier list

  const setTermsToSuppliers = async () => {
    try {
      for (let i = 0; i < supplierListInStore!.length; i++) {
        const result = await SupplierWiseTermSetService(
          token!,
          supplierListInStore![i].INVITATION_ID,
          supplierListInStore![i].GENERAL_TERMS
        );
        console.log(result.data);
      }
    } catch (error) {
      showErrorToast("Supplier Wise Term Save Failed");
    }
  };

  //save supplier list

  const [stockLoading, setStockLoading] = useState<boolean>(false);

  const [stockList, setStockList] = useState<OrgWiseStockInterface[] | []>([]);

  const getorgWiseStock = async (orgId: number, itemId: number) => {
    console.log(orgId);
    console.log(itemId);

    try {
      setStockLoading(true);
      const result = await OrgWiseStockService(token!, orgId, itemId);
      console.log(result.data);

      if (result.data.status === 200) {
        setStockList(result.data.data);
        setStockLoading(false);
      } else {
        showErrorToast(result.data.message);
        setStockLoading(false);
      }
    } catch (error) {
      setStockLoading(false);
      showErrorToast("Stock Load Failed");
    }

    const modal = document.getElementById(
      "my_modal_3"
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  const [totalAmount, setTotalAmount] = useState<string>("");

  useEffect(() => {
    let s: number = 0;
    const itemList = [];

    for (let i = 0; i < quotationDataListInStore!.length; i++) {
      for (let j = 0; j < quotationDataListInStore![i].Items!.length; j++) {
        const ber = quotationDataListInStore![i].Items[j];

        if (ber.RECOMMENDED === "Y") {
          itemList.push(ber);
        }
      }
    }

    for (let i = 0; i < itemList.length; i++) {
      const item = itemList[i];
      const quantity = parseFloat(item.AWARD_QUANTITY) || 0;
      const unitPrice = parseFloat(item.UNIT_PRICE) || 0;
      const vatAmount = item.VAT_AMOUNT || 0;
      const vatType = item.VAT_TYPE;

      let itemTotal = quantity * unitPrice;

      if (vatType === "Percentage") {
        itemTotal += itemTotal * (vatAmount / 100);
      } else {
        itemTotal += quantity * vatAmount;
      }

      s += itemTotal;
    }

    setTotalAmount(s.toFixed(2));
  }, [quotationDataListInStore]); // This effect will run whenever `quotationDataList` changes

  function calculateVAT(
    ratePerUnit: number,
    vatPercentage: number,
    offeredQty: number
  ): number {
    const totalAmount = ratePerUnit * offeredQty;
    const vatAmount = (vatPercentage / 100) * totalAmount;
    return vatAmount;
  }

  function calculateAmount(totalVat: number, offeredQty: number): number {
    const vatAmt = totalVat * offeredQty;
    return vatAmt;
  }

  function calculateTotal(
    ratePerUnit: number,
    vatPercentage: number,
    offeredQty: number,
    vatType: string
  ): number {
    const totalAmount = ratePerUnit * offeredQty;
    const vatAmount =
      vatType === "Percentage"
        ? calculateVAT(ratePerUnit, vatPercentage, offeredQty)
        : calculateAmount(vatPercentage, offeredQty);
    return totalAmount + vatAmount; // Adding VAT to the total
  }

  return (
    <div className="m-8  bg-white">
      <SuccessToast />
      <div className=" flex flex-col items-start">
        <PageTitle titleText="CS Preview" />
        {/* <NavigationPan list={pan} /> */}
      </div>
      <div className=" h-6"></div>
      <div className="flex  flex-row justify-between items-start">
        <CommonButton
          titleText={"CS Terms"}
          onClick={termModalShow}
          height="h-8"
          width="w-24"
        />
        <CommonButton
          onClick={openModalForHierarchy}
          color="bg-midGreen"
          titleText="Approval History"
          width="w-40"
        />
        <div className="  flex items-center space-x-4">
          <InputLebel titleText={"CS Title:"} />
          <CommonInputField
            disable={true}
            onChangeData={handleCsTitile}
            inputRef={csTitleRef}
            hint="Give CS Title"
            type="text"
            width="w-96"
            height="h-10"
          />
        </div>
        {/* <CommonButton
          titleText={"Export to Excel"}
          onClick={download}
          height="h-8"
          width="w-32"
          color="bg-midGreen"
        /> */}
      </div>
      <div className=" h-6"></div>
      <div className=" flex flex-row space-x-2 items-center">
        <div className=" flex-1   border-[0.1px] border-borderColor   ">
          <div>
            <div className=" flex flex-row  items-center">
              <div className=" h-10 w-44 bg-offWhiteColor flex justify-start pl-4 items-center">
                <p className=" text-sm text-blackColor font-mon">
                  Operating Unit
                </p>
              </div>
              <div className=" h-10 w-[1px] bg-borderColor"></div>
              <div className="w-2"></div>
              <div className=" h-10 flex-1 bg-whiteColor flex justify-start items-center">
                <p className=" text-sm text-blackColor font-mon text-start">
                  {orgNameInStore}
                </p>
              </div>
            </div>
            <div className="w-full h-[1px] bg-borderColor"></div>
          </div>
          <div>
            <div className=" flex flex-row  items-center">
              <div className=" h-10 w-44 bg-offWhiteColor flex justify-start pl-4 items-center">
                <p className=" text-sm text-blackColor font-mon">
                  Document Number
                </p>
              </div>
              <div className=" h-10 w-[1px] bg-borderColor"></div>
              <div className="w-2"></div>
              <div className=" h-10 flex-1 bg-whiteColor flex justify-start items-center">
                <p className=" text-sm text-blackColor font-mon text-start">
                  {savedCsIdInStore}
                </p>
              </div>
            </div>
            <div className="w-full h-[1px] bg-borderColor"></div>
          </div>
          <div>
            <div className=" flex flex-row  items-center">
              <div className=" h-10 w-44 bg-offWhiteColor flex justify-start pl-4 items-center">
                <p className=" text-sm text-blackColor font-mon">
                  Document Date
                </p>
              </div>
              <div className=" h-10 w-[1px] bg-borderColor"></div>
              <div className="w-2"></div>
              <div className=" h-10 flex-1 bg-whiteColor flex justify-start items-center">
                <p className=" text-sm text-blackColor font-mon text-start">
                  {isoToDateTime(csCreationDateInStore!)}
                </p>
              </div>
            </div>
            <div className="w-full h-[1px] bg-borderColor"></div>
          </div>
          <div>
            <div className=" flex flex-row  items-center">
              <div className=" h-10 w-44 bg-offWhiteColor flex justify-start pl-4 items-center">
                <p className=" text-sm text-blackColor font-mon">
                  Total Amount
                </p>
              </div>
              <div className=" h-10 w-[1px] bg-borderColor"></div>
              <div className="w-2"></div>
              <div className=" h-10 flex-1 bg-whiteColor flex justify-start items-center">
                <p className=" text-sm text-blackColor font-mon text-start">
                  {totalAmount}
                </p>
              </div>
            </div>
            <div className="w-full h-[1px] bg-borderColor"></div>
          </div>

          <div>
            <div className=" flex flex-row  items-center">
              <div className=" h-10 w-44 bg-offWhiteColor flex justify-start pl-4 items-center">
                <p className=" text-sm text-blackColor font-mon">Currency</p>
              </div>
              <div className=" h-10 w-[1px] bg-borderColor"></div>
              <div className="w-2"></div>
              <div className=" h-10 flex-1 bg-whiteColor flex justify-start items-center">
                <p className=" text-sm text-blackColor font-mon text-start">
                  {currencyNameInStore}
                </p>
              </div>
            </div>
            <div className="w-full h-[1px] bg-borderColor"></div>
          </div>
          <div>
            <div className=" flex flex-row  items-center">
              <div className=" h-10 w-44 bg-offWhiteColor flex justify-start pl-4 items-center">
                <p className=" text-sm text-blackColor font-mon">RFQ Type</p>
              </div>
              <div className=" h-10 w-[1px] bg-borderColor"></div>
              <div className="w-2"></div>
              <div className=" h-10 flex-1 bg-whiteColor flex justify-start items-center">
                <p className=" text-sm text-blackColor font-mon text-start">
                  {rfqTypeInCsCreationStore === "T" ? "Technical" : "Both"}
                </p>
              </div>
            </div>
            <div className="w-full h-[1px] bg-borderColor"></div>
          </div>
          <div>
            {/* <div className=" flex flex-row  items-center">
              <div className=" h-10 w-44 bg-offWhiteColor flex justify-start pl-4 items-center">
                <p className=" text-sm text-blackColor font-mon">
                  Total Amount
                </p>
              </div>
              <div className=" h-10 w-[1px] bg-borderColor"></div>
              <div className="w-2"></div>
              <div className=" h-10 flex-1 bg-whiteColor flex justify-start items-center">
                <p className=" text-sm text-blackColor font-mon text-start">
                  {"N/A"}
                </p>
              </div>
            </div>
            <div className="w-full h-[1px] bg-borderColor"></div> */}
          </div>
          <div>
            <div className=" flex flex-row  items-center">
              <div className=" h-10 w-44 bg-offWhiteColor flex justify-start pl-4 items-center">
                <p className=" text-sm text-blackColor font-mon">Comments</p>
              </div>
              <div className=" h-10 w-[1px] bg-borderColor"></div>
              <div className="w-2"></div>
              <div className=" h-10 flex-1 bg-whiteColor flex justify-start items-center">
                <p className=" text-sm text-blackColor font-mon text-start">
                  {csNoteInStore}
                </p>
              </div>
            </div>
            <div className="w-full h-[1px] bg-borderColor"></div>
          </div>
          <div className=" flex flex-row  items-center">
            <div className=" h-10 w-44 pl-4 bg-offWhiteColor flex justify-start items-center">
              <p className=" text-sm text-blackColor font-mon text-start">
                General Terms
              </p>
            </div>
            <div className=" h-10 w-[1px] bg-borderColor"></div>
            <div className="w-2"></div>
            <div className=" h-10 flex-1 bg-whiteColor flex justify-start items-center">
              <p
                onClick={openModal}
                className=" text-sm text-midGreen cursor-pointer underline font-mon text-start"
              >
                View
              </p>
            </div>
          </div>
          {/* <div className='w-full h-[1px] bg-borderColor'></div> */}
        </div>
      </div>
      <div className=" h-6"></div>
      <div className="overflow-x-auto">
        <table
          className="min-w-full divide-y divide-gray-200"
          style={{ tableLayout: "fixed" }}
        >
          <thead className="sticky top-0  bg-offWhiteColor h-14">
            <tr>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor   ">
                PR History
              </th>
              <th className=" font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  ">
                PO History
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  ">
                CS Matrix
              </th>

              {/* Add more header columns as needed */}
            </tr>
          </thead>

          {/* Table rows go here */}

          <tbody className="bg-white divide-y divide-gray-200 ">
            <td className="font-mon bg-orange-50 w-72 px-6 py-3 whitespace-nowrap font-medium">
              <div className="flex flex-col items-start space-y-1 w-72">
                {quotationListInStore?.data[0].Items.map((e, i) => (
                  <div>
                    <div className=" w-72  ">
                      <div className=" h-4"></div>
                      <div className=" w-full overflow-x-auto  mb-80 mt-40 ">
                        <button
                          onClick={() => {
                            getPrHistory(
                              e.REQUISITION_HEADER_ID,
                              e.REQUISITION_LINE_ID,
                              e.PR_NUMBER,
                              e.ORG_ID,
                              e.ITEM_ID
                            );
                            console.log(e.ITEM_ID);

                            toggleCollapse2(i);
                          }}
                          className=" w-full flex justify-center  flex-row space-x-1 items-center mb-4"
                        >
                          <div className=" h-4 w-4 rounded-[2px] bg-borderColor flex justify-center items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-3 h-3"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6v12m6-6H6"
                              />
                            </svg>
                          </div>
                          <p className=" text-xs text-graishColor font-mon font-medium">
                            PR History
                          </p>
                        </button>
                        {openIndex2 === i && (
                          <div className="">
                            {prHistory.map((e, i) => (
                              <div className=" space-y-1 ">
                                <div
                                  className="flex flex-row items-start space-x-2 w-72"
                                  key={i}
                                >
                                  <p className="text-sm font-mon font-medium text-blackColor">
                                    {"OrgName"}:
                                  </p>
                                  <p className=" text-sm font-mon font-medium text-blackColor whitespace-normal">
                                    {!e.INVENTORY_ORG_NAME
                                      ? "N/A"
                                      : e.INVENTORY_ORG_NAME}
                                  </p>
                                </div>
                                <div
                                  className="flex flex-row items-start space-x-2 w-72"
                                  key={i}
                                >
                                  <p className="text-sm font-mon font-medium text-blackColor">
                                    {"PRNo/Line No"}:
                                  </p>
                                  <p className=" text-sm font-mon font-medium text-blackColor whitespace-normal">
                                    {e.PR_NUMBER}/{e.LINE_NUM}
                                  </p>
                                </div>
                                <div
                                  className="flex flex-row items-start space-x-2 w-72"
                                  key={i}
                                >
                                  <p className="text-sm font-mon font-medium text-blackColor">
                                    {"Item Description"}:
                                  </p>
                                  <p className=" text-sm font-mon font-medium text-blackColor whitespace-normal">
                                    {!e.ITEM_DESCRIPTION
                                      ? "N/A"
                                      : e.ITEM_DESCRIPTION}
                                  </p>
                                </div>
                                <div
                                  className="flex flex-row items-center space-x-2 w-72"
                                  key={i}
                                >
                                  <p className="text-sm font-mon font-medium text-blackColor">
                                    {"Expected Spec"}:
                                  </p>
                                  <p className=" text-sm font-mon font-medium text-blackColor whitespace-normal">
                                    {!e.ITEM_SPECIFICATION
                                      ? "N/A"
                                      : e.ITEM_SPECIFICATION}
                                  </p>
                                </div>
                                <div
                                  className="flex flex-row items-center space-x-2 w-72"
                                  key={i}
                                >
                                  <p className="text-sm font-mon font-medium text-blackColor">
                                    {"Exp. Brand Origin"}:
                                  </p>
                                  <p className=" text-sm font-mon font-medium text-blackColor whitespace-normal">
                                    {!e.BRAND ? "N/A" : e.BRAND}
                                  </p>
                                </div>
                                <div
                                  className="flex flex-row items-center space-x-2 w-72"
                                  key={i}
                                >
                                  <p className="text-sm font-mon font-medium text-blackColor">
                                    {"Need By date"}:
                                  </p>
                                  <p className=" text-sm font-mon font-medium text-blackColor whitespace-normal">
                                    {!e.NEED_BY_DATE
                                      ? "N/A"
                                      : moment(e.NEED_BY_DATE).format(
                                          "DD-MMMM-YYYY"
                                        )}
                                  </p>
                                </div>
                                <div
                                  className="flex flex-row items-center space-x-2 w-72"
                                  key={i}
                                >
                                  <p className="text-sm font-mon font-medium text-blackColor">
                                    {"UOM"}:
                                  </p>
                                  <p className=" text-sm font-mon font-medium text-blackColor whitespace-normal">
                                    {!e.UNIT_MEAS_LOOKUP_CODE
                                      ? "N/A"
                                      : e.UNIT_MEAS_LOOKUP_CODE}
                                  </p>
                                </div>
                                <div
                                  className="flex flex-row items-center space-x-2 w-72"
                                  key={i}
                                >
                                  <p className="text-sm font-mon font-medium text-blackColor">
                                    {"Expected quantity"}:
                                  </p>
                                  <p className=" text-sm font-mon font-medium text-blackColor whitespace-normal">
                                    {!e.EXPECTED_QUANTITY
                                      ? "N/A"
                                      : e.EXPECTED_QUANTITY}
                                  </p>
                                </div>
                                <div
                                  className="flex flex-row items-center space-x-2 w-72"
                                  key={i}
                                >
                                  <p className="text-sm font-mon font-medium text-blackColor">
                                    {"Attachment"}:
                                  </p>
                                  <p className=" text-sm font-mon font-medium text-blackColor whitespace-normal">
                                    {"N/A"}
                                  </p>
                                </div>
                                <div
                                  className="flex flex-row items-center space-x-2 w-72"
                                  key={i}
                                >
                                  <p className="text-sm font-mon font-medium text-blackColor">
                                    {"Stock as per PR date"}:
                                  </p>
                                  <p className=" text-sm font-mon font-medium text-blackColor whitespace-normal">
                                    {"N/A"}
                                  </p>
                                </div>
                                <div
                                  className="flex flex-row items-center space-x-2 w-72"
                                  key={i}
                                >
                                  <p className="text-sm font-mon font-medium text-blackColor">
                                    {"Org wise stock"}:
                                  </p>
                                  <p className=" text-sm font-mon font-medium text-blackColor whitespace-normal">
                                    <button
                                      onClick={() => {
                                        getorgWiseStock(e.ORG_ID, e.ITEM_ID);
                                      }}
                                      className=" h-8 w-16 border-dashed border-[1px] border-borderColor rounded-md"
                                    >
                                      view
                                    </button>
                                  </p>
                                </div>
                                <div
                                  className="flex flex-row items-center space-x-2 w-72"
                                  key={i}
                                >
                                  <p className="text-sm font-mon font-medium text-blackColor">
                                    {"Current stock"}:
                                  </p>
                                  <p className=" text-sm font-mon font-medium text-blackColor whitespace-normal">
                                    {!e.ON_HAND ? "N/A" : e.ON_HAND}
                                  </p>
                                </div>
                                <div className=" w-72" key={i}>
                                  <p className="text-sm font-mon font-medium text-blackColor">
                                    {"1 Yr/6 Mon/3 Mon Consumption"}:
                                  </p>

                                  <div className="overflow-x-auto">
                                    <table className="min-w-full table-auto border border-gray-300">
                                      <thead>
                                        <tr className="bg-gray-100 text-left">
                                          <th className="px-4 py-2 border-b border-gray-300 text-sm">
                                            1 Yr
                                          </th>
                                          <th className="px-4 py-2 border-b border-gray-300 text-sm">
                                            6 Mon
                                          </th>
                                          <th className="px-4 py-2 border-b border-gray-300 text-sm">
                                            3 Mon
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr className="hover:bg-gray-50">
                                          <td className="px-4 py-2 border-b border-gray-300 text-sm">
                                            {e.YEARLY}
                                          </td>
                                          <td className="px-4 py-2 border-b border-gray-300 text-sm">
                                            {e.HALF_YEARLY}
                                          </td>
                                          <td className="px-4 py-2 border-b border-gray-300 text-sm">
                                            {e.QUARTERLY}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                                <div
                                  className="flex flex-row items-center space-x-2 w-72"
                                  key={i}
                                >
                                  <p className="text-sm font-mon font-medium text-blackColor">
                                    {"LCM Enabled"}:
                                  </p>
                                  <p className=" text-sm font-mon font-medium text-blackColor whitespace-normal">
                                    {!e.LCM_ENABLED_FLAG
                                      ? "N/A"
                                      : e.LCM_ENABLED_FLAG}
                                  </p>
                                </div>
                                <div
                                  className="flex flex-row items-center space-x-2 w-72"
                                  key={i}
                                >
                                  <p className="text-sm font-mon font-medium text-blackColor">
                                    {"Project Name"}:
                                  </p>
                                  <p className=" text-sm font-mon font-medium text-blackColor whitespace-normal">
                                    {!e.PROJECT_NAME ? "N/A" : e.PROJECT_NAME}
                                  </p>
                                </div>
                                <div
                                  className="flex flex-row items-center space-x-2 w-72"
                                  key={i}
                                >
                                  <p className="text-sm font-mon font-medium text-blackColor">
                                    {"Task Name"}:
                                  </p>
                                  <p className=" text-sm font-mon font-medium text-blackColor whitespace-normal">
                                    {!e.TASK_NAME ? "N/A" : e.TASK_NAME}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mb-4"></p>
            </td>

            <td className="font-mon w-72  px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
              {quotationListInStore?.data[0].Items.map((e, i) => (
                <div>
                  <div className=" w-72  ">
                    <div className=" h-4"></div>
                    <div className=" w-full overflow-x-auto  mb-80 mt-40">
                      <button
                        onClick={() => {
                          getItemWisePoHistory(e.ITEM_ID);
                          toggleCollapse(i);
                        }}
                        className=" w-full flex justify-center  flex-row space-x-1 items-center mb-4"
                      >
                        <div className=" h-4 w-4 rounded-[2px] bg-borderColor flex justify-center items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-3 h-3"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6v12m6-6H6"
                            />
                          </svg>
                        </div>
                        <p className=" text-xs text-graishColor font-mon font-medium">
                          PO History
                        </p>
                      </button>
                      {openIndex === i && (
                        <div className="">
                          <table
                            className="min-w-full divide-y divide-gray-200 "
                            style={{ tableLayout: "fixed" }}
                          >
                            <thead className="sticky top-0  bg-lightGreen h-10">
                              <tr>
                                <th className="font-mon px-6 py-1 text-left text-[12px] font-medium text-blackColor  ">
                                  PO No
                                </th>
                                <th className=" font-mon px-6 py-1 text-left text-[12px] font-medium text-blackColor  tracking-wider">
                                  PO Approve Date
                                </th>
                                <th className="font-mon px-6 py-1 text-left text-[12px] font-medium text-blackColor  tracking-wider">
                                  PO Rate
                                </th>

                                {/* Add more header columns as needed */}
                              </tr>
                            </thead>

                            {/* Table rows go here */}
                            {/* Table rows go here */}
                            {poHistoryList.map((e, i) => (
                              <tbody
                                className="bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]"
                                key={i}
                              >
                                <td className="font-mon h-11 px-6 py-3 text-left text-xs text-blackColor  whitespace-nowrap ">
                                  {e.PO_NUMBER}
                                </td>
                                <td className="font-mon h-11 px-6 py-3 text-left text-xs text-blackColor  whitespace-nowrap">
                                  {moment(e.APPROVED_DATE).format(
                                    "DD-MMMM-YYYY"
                                  )}
                                </td>
                                <td className=" w-64 font-mon h-11 px-6 py-3 text-left text-xs text-blackColor  whitespace-nowrap">
                                  {e.UNIT_PRICE.toFixed(2)}
                                </td>
                              </tbody>
                            ))}
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </td>
            <td className=" font-mon  px-6 pb-3  text-left text-[14px] text-blackColor  whitespace-nowrap ">
              <div className=" w-full flex space-x-3 items-start">
                <div className=" w-full   ">
                  <div className="h-10 w-40 flex justify-center px-4 items-center bg-lightGreen">
                    <p className=" text-sm text-blackColor font-mon font-medium">
                      Company Name
                    </p>
                  </div>
                  {[...Array(ListlengthInStore)].map((_, index) => (
                    <div key={index}>
                      <div className="h-[1px] border border-borderColor"></div>
                      <div className="h-20 w-40 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm text-blackColor font-mon font-medium">
                          Item Description
                        </p>
                      </div>
                      <div className="h-[1px] border border-borderColor"></div>
                      <div className="h-28 w-40 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm text-blackColor font-mon font-medium">
                          Available Spec
                        </p>
                      </div>
                      <div className="h-[1px] border border-borderColor"></div>
                      <div className="h-10 w-40 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm text-blackColor font-mon font-medium">
                          Available Brand
                        </p>
                      </div>
                      <div className="h-[1px] border border-borderColor"></div>
                      <div className="h-10 w-40 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm text-blackColor font-mon font-medium">
                          Available Origin
                        </p>
                      </div>
                      <div className="h-[1px] border border-borderColor"></div>
                      <div className="h-10 w-40 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm text-blackColor font-mon font-medium">
                          UOM
                        </p>
                      </div>
                      <div className="h-[1px] border border-borderColor"></div>
                      <div className="h-10 w-40 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm text-blackColor font-mon font-medium">
                          Expected QTY
                        </p>
                      </div>
                      <div className="h-[1px] border border-borderColor"></div>
                      <div className="h-10 w-40 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm text-blackColor font-mon font-medium">
                          Offered QTY
                        </p>
                      </div>
                      <div className="h-[1px] border border-borderColor"></div>
                      <div className="h-10 w-40 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm text-blackColor font-mon font-medium">
                          Award QTY
                        </p>
                      </div>
                      <div className="h-[1px] border border-borderColor"></div>
                      <div className="h-10 w-40 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm text-blackColor font-mon font-medium">
                          Tolerance
                        </p>
                      </div>
                      <div className="h-[1px] border border-borderColor"></div>
                      <div className="h-10 w-40 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm text-blackColor font-mon font-medium">
                          Rate/unit
                        </p>
                      </div>
                      <div className="h-[1px] border border-borderColor"></div>
                      <div className="h-10 w-40 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm text-blackColor font-mon font-medium">
                          VAT
                        </p>
                      </div>
                      <div className="h-[1px] border border-borderColor"></div>

                      <div className="h-10 w-40 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm text-blackColor font-mon font-medium">
                          Total Amount
                        </p>
                      </div>
                      <div className="h-[1px] border border-borderColor"></div>
                      <div className="h-10 w-40 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm text-blackColor font-mon font-medium">
                          Packing Type
                        </p>
                      </div>
                      <div className="h-[1px] border border-borderColor"></div>
                      <div className="h-10 w-40 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm text-blackColor font-mon font-medium">
                          Warranty
                        </p>
                      </div>
                      <div className="h-[1px] border border-borderColor"></div>
                      <div className="h-10 w-40 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm text-blackColor font-mon font-medium">
                          Recommendation Notes
                        </p>
                      </div>
                      <div className="h-[1px] border border-borderColor"></div>
                      <div className="h-10 w-40 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm text-blackColor font-mon font-medium">
                          Recommend
                        </p>
                      </div>
                      <div className="h-[1px] border border-borderColor"></div>
                      {/* <div className="h-10 w-40 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm text-blackColor font-mon font-medium">
                          Award
                        </p>
                      </div> */}
                      <div className=" h-2"></div>
                    </div>
                  ))}
                </div>
                {/* end left */}
                <div>
                  <div className=" w-full flex flex-row  space-x-2">
                    {quotationDataListInStore!.map((item, quotationIndex) => (
                      <div key={item.SUPPLIER_ID}>
                        <div className=" w-56 h-10 flex justify-center items-center bg-green-100">
                          {item.ORGANIZATION_NAME}
                        </div>
                        <div className="h-[1px] border border-borderColor"></div>
                        {[...Array(item.Items.length)].map((_, i) => (
                          <div key={i}>
                            <div className="w-56  h-20 px-1 flex justify-center items-center bg-green-100 whitespace-normal ">
                              {!item.Items[i].ITEM_DESCRIPTION
                                ? "N/A"
                                : item.Items[i].ITEM_DESCRIPTION}
                            </div>
                            <div className="h-[1px] border border-borderColor"></div>
                            <div className="w-56 h-28 flex justify-center items-center bg-green-100  whitespace-normal px-1 ">
                              {!item.Items[i].ITEM_SPECIFICATION
                                ? "N/A"
                                : item.Items[i].ITEM_SPECIFICATION}
                            </div>
                            <div className="h-[1px] border border-borderColor"></div>
                            <div className="w-56 h-10 flex justify-center items-center bg-green-100 ">
                              {!item.Items[i].AVAILABLE_BRAND_NAME
                                ? "N/A"
                                : item.Items[i].AVAILABLE_BRAND_NAME}
                            </div>
                            <div className="h-[1px] border border-borderColor"></div>
                            <div className="w-56 h-10 flex justify-center items-center bg-green-100 ">
                              {!item.Items[i].COUNTRY_NAME
                                ? "N/A"
                                : item.Items[i].COUNTRY_NAME}
                            </div>
                            <div className="h-[1px] border border-borderColor"></div>
                            <div className="w-56 h-10 flex justify-center items-center bg-green-100 ">
                              {!item.Items[i].UNIT_MEAS_LOOKUP_CODE
                                ? "N/A"
                                : item.Items[i].UNIT_MEAS_LOOKUP_CODE}
                            </div>
                            <div className="h-[1px] border border-borderColor"></div>
                            <div className="w-56 h-10 flex justify-center items-center bg-green-100 ">
                              {!item.Items[i].EXPECTED_QUANTITY
                                ? "N/A"
                                : item.Items[i].EXPECTED_QUANTITY}
                            </div>
                            <div className="h-[1px] border border-borderColor"></div>
                            <div className="w-56 h-10 flex justify-center items-center bg-green-100 ">
                              {!item.Items[i].OFFERED_QUANTITY
                                ? "N/A"
                                : item.Items[i].OFFERED_QUANTITY}
                            </div>
                            <div className="h-[1px] border border-borderColor"></div>
                            <div className="w-56 h-10 flex justify-center items-center bg-green-100 ">
                              {!item.Items[i].AWARD_QUANTITY
                                ? "N/A"
                                : item.Items[i].AWARD_QUANTITY}
                            </div>
                            <div className="h-[1px] border border-borderColor"></div>
                            <div className="w-56 h-10 flex justify-center items-center bg-green-100 ">
                              {!item.Items[i].TOLERANCE
                                ? "N/A"
                                : `${item.Items[i].TOLERANCE}%`}
                            </div>
                            <div className="h-[1px] border border-borderColor"></div>
                            <div className="w-56 h-10 flex justify-center items-center bg-green-100 ">
                              {!item.Items[i].UNIT_PRICE
                                ? "N/A"
                                : item.Items[i].UNIT_PRICE}
                            </div>
                            <div className="h-[1px] border border-borderColor"></div>
                            <div className="w-56 h-10 flex justify-center items-center bg-green-100 ">
                              {`${
                                !item.Items[i].VAT_AMOUNT
                                  ? "N/A"
                                  : item.Items[i].VAT_AMOUNT
                              } ${
                                item.Items[i].VAT_TYPE === "Percentage"
                                  ? "%"
                                  : ""
                              }`}
                            </div>
                            <div className="h-[1px] border border-borderColor"></div>

                            <div className="w-56 h-10 flex justify-center items-center bg-green-100 ">
                              {calculateTotal(
                                parseFloat(item.Items[i].UNIT_PRICE),
                                item.Items[i].VAT_AMOUNT,
                                parseFloat(item.Items[i].AWARD_QUANTITY),
                                item.Items[i].VAT_TYPE
                              )}
                            </div>
                            <div className="h-[1px] border border-borderColor"></div>
                            <div className="w-56 h-10 flex justify-center items-center bg-green-100 ">
                              {!item.Items[i].PACKING_TYPE
                                ? "N/A"
                                : item.Items[i].PACKING_TYPE}
                            </div>
                            <div className="h-[1px] border border-borderColor"></div>
                            <div className="w-56 h-10 flex justify-center items-center bg-green-100 ">
                              {!item.Items[i].WARRANTY_BY_SUPPLIER
                                ? "N/A"
                                : item.Items[i].WARRANTY_BY_SUPPLIER === "Y"
                                ? "Yes"
                                : "No"}
                            </div>
                            <div className="h-[1px] border border-borderColor"></div>
                            <div className="w-56 h-10 flex justify-center items-center bg-green-100 ">
                              {!item.Items[i].NOTE_TO_APPROVER
                                ? "N/A"
                                : item.Items[i].NOTE_TO_APPROVER}
                            </div>
                            <div className="h-[1px] border border-borderColor"></div>
                            <div className="w-56 h-10 flex justify-center items-center bg-green-100 ">
                              <button
                                onClick={() => {
                                  // handleRecommended(quotationIndex, i);
                                }}
                                className={`h-4 w-4 flex justify-center items-center ${
                                  item.Items[i].RECOMMENDED === "Y"
                                    ? "border-none bg-midGreen"
                                    : "  border-[1px] border-borderColor bg-white"
                                } rounded-[4px]`}
                              >
                                <img
                                  src="/images/check.png"
                                  alt="check"
                                  className=" w-2 h-2"
                                />
                              </button>
                            </div>
                            <div className="h-[1px] border border-borderColor"></div>
                            {/* <div className="w-56 h-10 flex justify-center items-center bg-green-100 ">
                              {"N/A"}
                            </div> */}
                            {/* <div className="h-[1px] border border-borderColor"></div> */}
                            <div className=" h-2"></div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </td>
          </tbody>
          <tfoot>
            <td className=" w-72  px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap"></td>
            <td className=" w-72 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap"></td>
            <td className=" font-mon  px-6 pb-3  text-left text-[14px] text-blackColor  whitespace-nowrap ">
              <div className="  w-full flex items-center space-x-3">
                <div className="">
                  <div className="w-40  h-10  flex justify-center items-center bg-green-100 whitespace-normal ">
                    Supplier Total
                  </div>
                  <div className="h-[1px] border border-borderColor"></div>
                  <div className="w-40  h-10 flex justify-center items-center bg-green-100 whitespace-normal ">
                    Supplier Quot Total
                  </div>
                </div>
                <div className="flex-1 flex flex-row space-x-2">
                  {quotationDataListInStore!.map((item, quotationIndex) => {
                    const totalSum = item.Items.reduce((sum, currentItem) => {
                      const offeredQuantity =
                        parseFloat(currentItem.OFFERED_QUANTITY) || 0;
                      const unitPrice = parseFloat(currentItem.UNIT_PRICE) || 0;
                      return sum + offeredQuantity * unitPrice;
                    }, 0);

                    const recommendedSum = item.Items.reduce(
                      (sum, currentItem) => {
                        if (currentItem.RECOMMENDED === "Y") {
                          const awardQuantity =
                            parseFloat(currentItem.AWARD_QUANTITY) || 0;
                          const unitPrice =
                            parseFloat(currentItem.UNIT_PRICE) || 0;
                          const vatAmount = currentItem.VAT_AMOUNT || 0;
                          const vatType = currentItem.VAT_TYPE;

                          let itemTotal = awardQuantity * unitPrice;

                          if (vatType === "Percentage") {
                            itemTotal += itemTotal * (vatAmount / 100);
                          } else {
                            itemTotal += awardQuantity * vatAmount;
                          }

                          return sum + itemTotal;
                        }
                        return sum;
                      },
                      0
                    );

                    return (
                      <div key={item.SUPPLIER_ID}>
                        <div className="">
                          <div className="w-56 h-10 flex justify-center items-center bg-green-100 whitespace-normal">
                            {recommendedSum}
                          </div>
                          <div className="h-[1px] border border-borderColor"></div>
                          <div className="w-56 h-10 flex justify-center items-center bg-green-100 whitespace-normal">
                            {`${totalSum}`}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </td>
          </tfoot>
        </table>
      </div>
      <div className=" h-10"></div>
      <div className=" flex flex-row justify-end space-x-6">
        <CommonButton
          onClick={back}
          titleText={"Previous"}
          width="w-48"
          height="h-8"
          color="bg-graishColor"
        />
        {saveLoading ? (
          <div className=" w-48 flex justify-center items-center">
            <CircularProgressIndicator />
          </div>
        ) : (
          <CommonButton
            onClick={savedCsIdInStore == null ? save : update}
            titleText={"Save CS"}
            width="w-48"
            height="h-8"
            // disable={rfqTypeInCsCreationStore === "T" ? true : false}
          />
        )}
        {isSubmitLoading ? (
          <div className=" w-48 flex justify-center items-center">
            <CircularProgressIndicator />
          </div>
        ) : (
          <CommonButton
            onClick={submit}
            titleText={"Submit CS"}
            width="w-48"
            height="h-8"
            color="bg-midGreen"
            disable={rfqTypeInCsCreationStore === "T" ? true : false}
          />
        )}
      </div>
      <div className=" h-20"></div>
      <dialog id="my_modal_12" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          <div className=" flex-1 overflow-x-auto p-4">
            <div className="">
              <table
                className="min-w-full divide-y divide-gray-200"
                style={{ tableLayout: "fixed" }}
              >
                <thead className="sticky top-0  bg-lightGreen h-10">
                  <tr>
                    <th className="font-mon px-6 py-1 text-left text-sm font-medium text-blackColor  ">
                      SL
                    </th>
                    <th className=" font-mon px-6 py-1 text-left text-sm font-medium text-blackColor  tracking-wider">
                      Date
                    </th>
                    <th className="font-mon px-6 py-1 text-left text-sm font-medium text-blackColor  tracking-wider">
                      Action
                    </th>
                    <th className="font-mon px-6 py-1 text-left text-sm font-medium text-blackColor  tracking-wider">
                      Performed By
                    </th>
                    <th className="font-mon px-6 py-1 text-left text-sm font-medium text-blackColor  tracking-wider">
                      Remarks
                    </th>

                    {/* Add more header columns as needed */}
                  </tr>
                </thead>

                {/* Table rows go here */}
                {/* Table rows go here */}
                {hierarchyList.map((e, i) => (
                  <tbody
                    className="bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]"
                    key={i}
                  >
                    <td className="font-mon h-11 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap font-medium">
                      {i + 1}
                    </td>
                    <td className="font-mon h-11 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                      {e.ACTION_DATE === ""
                        ? "N/A"
                        : isoToDateTime(e.ACTION_DATE)}
                    </td>
                    <td className=" w-64 font-mon h-11 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                      {e.ACTION_CODE === "0" ? (
                        <p className=" text-sm font-mon text-redColor">
                          Rejected
                        </p>
                      ) : e.ACTION_CODE === "1" ? (
                        <p className=" text-sm font-mon text-midGreen">
                          Approved
                        </p>
                      ) : (
                        <p className=" text-sm font-mon  text-yellow-500">
                          Pending
                        </p>
                      )}
                    </td>
                    <td className="font-mon h-11 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                      {e.APPROVER_FULL_NAME === ""
                        ? "N/A"
                        : e.APPROVER_FULL_NAME}
                    </td>
                    <td className="font-mon h-11 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                      {e.ACTION_NOTE === "" ? "N/A" : e.ACTION_NOTE}
                    </td>
                  </tbody>
                ))}
              </table>
            </div>
          </div>
        </div>
      </dialog>

      <input
        type="checkbox"
        id="my-modal-11"
        className="modal-toggle"
        checked={openClose}
      />
      <div className="modal">
        <div className="modal-box relative w-3/4 overflow-x-hidden max-w-7xl flex flex-col justify-center items-center">
          {/* <label htmlFor="my-modal-11" onClick={(e)=>{setOpenCLose(false); setPicUrl('')}} className="btn btn-sm btn-circle absolute right-2 top-2">✕</label> */}
          <div className=" w-full flex items-start justify-start">
            <InputLebel titleText={"CS General Term"} />
          </div>

          <textarea
            disabled={true}
            value={csGeneralTermInStore!}
            className="w-full h-80 mx-20  bg-inputBg mt-2 rounded-md shadow-sm focus:outline-none p-8"
          />
          <div className=" w-full  flex items-end justify-end font-mon text-sm">
            {csGeneralTermInStore!.length}/1500
          </div>

          <div className="h-6"></div>
          <div className="w-full justify-start items-start">
            <InputLebel titleText={"Special Terms"} />
          </div>
          <div className="h-6"></div>
          {supplierListInStore?.map((e, i) => (
            <div key={e.USER_ID} className="w-full">
              <div className=" w-full flex flex-row">
                <div className="  w-44 flex justify-center bg-offWhiteColor items-center border-r-[0.2px] border-b-[0.2px] border-t-[0.2px]  border-borderColor py-2">
                  <p className=" text-sm text-blackColor font-mon font-medium">
                    {e.ORGANIZATION_NAME}
                  </p>
                </div>
                <div
                  className={`
                flex-1  border-borderColor flex justify-center items-center">
                <p className=" pl-4 text-sm text-blackColor font-mon pr-4 py-2 ${
                  i === 0
                    ? "border-t-[0.2px] border-b-[0.2px]"
                    : "border-b-[0.2px]"
                }
                `}
                >
                  <p className=" pl-4 text-sm text-blackColor font-mon pr-4 ">
                    {e.GENERAL_TERMS}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div className=" h-12"></div>
          <div className=" w-full h-10 flex justify-center items-center flex-row space-x-4">
            <CommonButton
              onClick={cancel}
              titleText={"Close"}
              height="h-8"
              width="w-28"
            />
            {/* <CommonButton
              onClick={openClose}
              titleText={"Save"}
              height="h-8"
              width="w-28"
              color="bg-midGreen"
            /> */}
          </div>
          <div className=" h-12"></div>
        </div>
      </div>

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Buyer RFQ General Term</h3>
          {/* <p className="py-4">{buyerGeneralTermInStore}</p> */}
          <textarea disabled={true} className=" w-full h-[340px] p-4">
            {buyerGeneralTermInStore}
          </textarea>
          <div className="modal-action">
            <form onSubmit={closeModal} method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button type="button" className="btn" onClick={closeModal}>
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box modal-middle w-[420px] max-w-none">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          <div className="h-10"></div>

          {stockLoading ? (
            <div className=" w-full h-full flex justify-center items-center">
              <LogoLoading />
            </div>
          ) : (
            <div className=" overflow-x-auto ">
              <table
                className="min-w-full divide-y divide-gray-200 border-[0.2px] border-borderColor shadow rounded-md"
                style={{ tableLayout: "fixed" }}
              >
                <thead className="sticky top-0 bg-[#F4F6F8] h-14 text-center">
                  <tr>
                    <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                      Org Id
                    </th>
                    <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                      Organization Name
                    </th>
                    <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                      Current Onhand
                    </th>
                  </tr>
                </thead>

                <tbody className="cursor-pointer bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]">
                  {stockList.map((e, index) => {
                    return (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                      >
                        <td className=" font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {!e.QUANTITY ? "" : e.ORGANIZATION_CODE}
                        </td>
                        <td className=" font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {!e.QUANTITY ? "" : e.ORGANIZATION_NAME}
                        </td>
                        <td className=" font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {!e.QUANTITY ? "" : e.QUANTITY}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {/* // ))} */}
              </table>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
}
