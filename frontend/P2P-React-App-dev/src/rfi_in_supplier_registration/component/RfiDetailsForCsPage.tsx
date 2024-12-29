import moment from "moment";
import CommonButton from "../../common_component/CommonButton";
import { useAuth } from "../../login_both/context/AuthContext";
import useRfiStore from "../store/RfiStore";
import { useEffect, useState } from "react";
import HierarchyInterface from "../../registration/interface/hierarchy/HierarchyInterface";
import HierachyListByModuleService from "../../registration/service/approve_hierarchy/HierarchyListByModuleService";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import useCsCreationStore from "../../cs/store/CsCreationStore";
import GetOrgListService from "../../common_service/GetOrgListService";
import CommonOrgInterface from "../../common_interface/CommonOrgInterface";
import usePrItemsStore from "../../buyer_section/pr/store/prItemStore";
import CurrencyListService from "../../registration/service/bank/CurrencyListService";
import LogoLoading from "../../Loading_component/LogoLoading";
import RfqDetailsService from "../../buyer_rfq_create/service/RfqDetailsService";
import PrItemInterface from "../../buyer_section/pr_item_list/interface/PrItemInterface";
import ItemWiseQuotationService from "../../cs/service/ItemWiseQuotationService";
import {
  QuotationData,
  QuotationsInterface,
} from "../../cs/interface/QuotationsInterface";
import ItemWisePoHistoryService from "../../cs/service/ItemWisePoHistoryService";
import PoHistoryInterface from "../../cs/interface/PoHistoryInterface";
import PrHistoryInterface from "../../cs/interface/PrHistoryInterface";
import ItemWisePrHistoryService from "../../cs/service/ItemWisePrHistoryService";
import UserCircleIcon from "../../icons/userCircleIcon";
import isoToDateTime from "../../utils/methods/isoToDateTime";
import RfiSupplierInterface from "../interface/RfiSupplierInterface";
import { showSuccessToast } from "../../Alerts_Component/SuccessToast";
import RfiSupplierListService from "../service/RfiSupplierListService";
import RfiAddUpdateService from "../../manage_supplier_profile_update/service/rfi/RfiAddUpdateService";
import { Button, Modal, Textarea } from "keep-react";
import ValidationError from "../../Alerts_Component/ValidationError";
import { CloudArrowUp } from "phosphor-react";
import { useRfiManageSupplierContext } from "../context/RfiManageSupplierContext";
import RfqHeaderDetailsService from "../../buyer_section/pr_item_list/service/RfqHeaderDetailsService";
import OrgWiseStockService from "../../cs/service/OrgWiseStockService";
import OrgWiseStockInterface from "../../cs/interface/OrgWiseStockInterface";
import CommonInputField from "../../common_component/CommonInputField";
import fetchFileUrlService from "../../common_service/fetchFileUrlService";
import InputLebel from "../../common_component/InputLebel";

interface CurrencyData {
  CURRENCY_CODE: string;
  NAME: string;
}

interface CurrencyFromOracle {
  value: string;
  label: string;
}

export default function RfiDetailsForCsPage() {
  const [hierarchyList, setHierarchyList] = useState<HierarchyInterface[] | []>(
    []
  );
  const [hierarchyUserProfilePicturePath, setHierarchyUserProfilePicturePath] =
    useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedRfqLineIdList, setSelectedRfqLineIdList] = useState<number[]>(
    []
  );

  // useAuth
  const { token, userId } = useAuth();
  // useAuth

  //store
  const { setRfiSupplierListlength, setRfiTabNo } = useRfiStore();

  const { setOrgNameInStore, setOrgIdInStore, setCurrencyNameInStore } =
    useCsCreationStore();

  const { rfqHeaderDetailsInStore, rfqIdInStore } = usePrItemsStore();
  //store

  const { setRfiManageSupplierPageNo, setRfiId, rfiId } =
    useRfiManageSupplierContext();
    
  const [currencyCode, setCurrencyCode] = useState<string>("");

  useEffect(() => {
    console.log("rfqId: ", rfqIdInStore);
    console.log("rfq details: ", rfqHeaderDetailsInStore);

    getHeaderDetails();
    // getOrgList();
    getRfqList();
    getFeedBack();
    // getCurrency();
    // getItemWiseQuotations();
  }, []);

  useEffect(() => {
    if (currencyCode) {
      getCurrency();
    }
  }, [currencyCode]);

  useEffect(() => {
    // This useEffect will be triggered whenever selectedRfqLineIdList changes
    if (selectedRfqLineIdList.length > 0) {
      getItemWiseQuotations();
    }
  }, [selectedRfqLineIdList]);

  const [generalTerms, setGeneralTerms] = useState<string>("");

  useEffect(() => {
    // Check if rfqHeaderDetailsInStore is null or not
    setIsLoading(true);
    if (rfqHeaderDetailsInStore) {
      // console.log("header details: ", rfqHeaderDetailsInStore);
      // getOrgList();
      getApproverHierachy();
      // getCurrency();

      const terms = rfqHeaderDetailsInStore?.details.BUYER_GENERAL_TERMS;
      if (terms) {
        setGeneralTerms(terms);
      }
      setIsLoading(false); // Set loading state to false when data is available
    }
  }, [rfqHeaderDetailsInStore]);

  const [quotationList, setQuotationList] =
    useState<QuotationsInterface | null>(null);

  // useEffect(() => {
  //   // if (isLoading) {
  //     // Call getPrHistory only if it's not already loaded
  //     // Assuming you have the necessary variables defined here like token, etc.
  //     // console.log("quote list: ", quotationList);
  //     if (quotationList) {
  //       quotationList.data[0].Items.forEach((e) => {
  //         getPrHistory(e.REQUISITION_HEADER_ID, e.REQUISITION_LINE_ID, e.PR_NUMBER);
  //         // console.log("pr value: ", e);
  //       });
  //     }
  //     // setIsLoading(true);
  //   // }
  // }, [quotationList]);

  const [rfqOrgId, setRfqOrgId] = useState<number | null>(null);
  const [rfqHeaderOrgId, setRfqHeaderOrgId] = useState<number | null>(null);
  const [rfqOrgName, setRfqOrgName] = useState<string>("");
  const [buyerGeneralTerms, setBuyerGeneralTerms] = useState<string>("");

  const getHeaderDetails = async () => {
    try {
      const result = await RfqHeaderDetailsService(token!, rfqIdInStore!); //rfwIdInStore
      if (result.data.status === 200) {
        // setRfqHeaderDetailsInStore(result.data);
        setRfqOrgId(result.data.details.ORG_ID);
        getOrgList(result.data.details.ORG_ID);
        setRfqOrgName(result.data.details.OU_DETAILS.NAME);
        setRfqHeaderOrgId(result.data.details.OU_DETAILS.ORGANIZATION_ID);
        setCurrencyCode(result.data.details.CURRENCY_CODE);
        setBuyerGeneralTerms(result.data.details.BUYER_GENERAL_TERMS);
        console.log("rfq org", result.data.details);
        // setBuyerGeneralTermInStore(result.data.details.BUYER_GENERAL_TERMS);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Rfq Header Details Load Failed");
    }
  };

  // Split the terms by newline character '\r\n'
  const termsList = buyerGeneralTerms.split("\r\n").map((term, index) => {
    // check if the term starts with a sub-point indicator (a., b., c.) using regex
    if (/^\s*[a-z]\.\s*/i.test(term)) {
      return (
        <div key={index} className="ml-4 py-2">
          {term}
        </div>
      );
    }
    // If not a sub-point, render normally
    return (
      <div key={index} className="py-2">
        {term}
      </div>
    );
  });

  // Split the terms by newline character '\r\n'
  // const termsList = generalTerms.split('\r\n').map((term, index) => (
  //   <div key={index} className="py-2">{term}</div>
  // ));

  const [orgName, setOrgName] = useState<string>("");
  const [orgId, setOrgId] = useState<number | null>(null);

  const getOrgList = async (orgId: number) => {
    try {
      setIsLoading(true);
      const result = await GetOrgListService(token!);
      console.log(result);

      if (result.data.status === 200) {
        const findOrg: CommonOrgInterface = result.data.data.find(
          (org: CommonOrgInterface) =>
            org.ORGANIZATION_ID.toString() === orgId!.toString()
        );

        console.log("find org", findOrg);

        setOrgName(findOrg.NAME);
        setOrgNameInStore(findOrg.NAME);
        setOrgId(findOrg.ORGANIZATION_ID);
        setOrgIdInStore(findOrg.ORGANIZATION_ID);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      // showErrorToast("Organization Load Failed");
    }
  };

  const [currencyListFromOracle, setCurrencyListFromOracle] = useState<
    CurrencyFromOracle[] | []
  >([]);
  const [currencyName, setCurrencyName] = useState<string>("");

  const getCurrency = async () => {
    try {
      setIsLoading(true);
      const result = await CurrencyListService(token!);
      console.log("currency", result.data);

      if (result.data.status === 200) {
        const transformedData = result.data.data.map((item: CurrencyData) => ({
          value: item.CURRENCY_CODE,
          label: item.NAME,
        }));
        console.log("transCurrency: ", transformedData);
        const findCurrency = transformedData.find(
          (e: CurrencyFromOracle) =>
            e.value === currencyCode
        );
        console.log("findCurrency", findCurrency);

        setCurrencyListFromOracle(transformedData);
        setCurrencyNameInStore(findCurrency.label);
        setCurrencyName(findCurrency.label);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      showErrorToast("Currency load failed");
    }
  };

  const getApproverHierachy = async () => {
    try {
      setIsLoading(true);
      const result = await HierachyListByModuleService(
        token!,
        userId!,
        "CS Approval"
      );
      // console.log(result);

      if (result.data.status === 200) {
        setHierarchyUserProfilePicturePath(result.data.profile_pic);
        setHierarchyList(result.data.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Something went wrong");
      setIsLoading(false);
    }
  };

  const [itemList, setItemList] = useState<PrItemInterface[] | []>([]);
  // const [selectedRfqLineIdList, setSelectedRfqLineIdList] = useState<number[]>(
  //   []
  // );

  const getRfqList = async () => {
    try {
      const result = await RfqDetailsService(token!, rfqIdInStore!, 0, 100000);

      if (result.data.status === 200) {
        // setRfqDetailsInStore(result.data);
        // setBuyerLineFilePath(result.data.buyer_line_file);
        // setSupplierLineFilePath(result.data.supplier_line_file);
        setItemList(result.data.line_items);
        console.log("lineItems: ", result.data);

        const list: number[] = [];
        for (let i = 0; i < result.data.line_items.length; i++) {
          list.push(result.data.line_items[i].RFQ_LINE_ID);
        }
        setSelectedRfqLineIdList(list);
        // console.log("line list: ", list);
      } else {
      }
    } catch (error) {
      showErrorToast("Rfq Details Load Failed");
    }
  };

  // const [quotationList, setQuotationList] = useState<QuotationsInterface | null>(null);
  const [quotationDataList, setQuotationDataList] = useState<QuotationData[]>(
    []
  );
  const [loopLength, setLoopLength] = useState<number>(0);
  const [listLength, setListLength] = useState<number>(0);

  const getItemWiseQuotations = async () => {
    try {
      // setIsLoading(true);
      console.log(rfqHeaderOrgId);

      const result = await ItemWiseQuotationService(
        token!,
        rfqIdInStore!,
        selectedRfqLineIdList,
        rfqHeaderOrgId!,
        0,
        10000
      );
      // console.log(result);

      if (result.data.status === 200) {
        console.log("quotation List: ", result.data);

        setQuotationList(result.data);
        // console.log(result.data)
        // setQuotationListInStore(result.data);
        setQuotationDataList(result.data.data);
        // console.log(result.data.data)
        // setQuotationDataListInStore(result.data.data);
        setLoopLength(result.data.data[0].Items.length);
        // console.log(result.data.data.length);
        // setPoPrLen(result.data.data.length);
        // console.log("item len", result.data.data[0].Items.length);

        setListLength(result.data.data[0].Items.length);
        // setIsLoading(false);
      } else {
        // setIsLoading(false);
      }
    } catch (error) {
      // setIsLoading(false);
    }
  };

  // po history start
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
  // po history end

  //pr history
  const [prHistory, setPrHistory] = useState<PrHistoryInterface[]>([]);

  const getPrHistory = async (
    reqHeaderId: number,
    reqLineId: number,
    prNumber: number,
    orgId: number,
    itemId: number
  ) => {
    console.log("rfqHID: ", reqHeaderId);
    console.log("redLineId: ", reqLineId);
    console.log("prNumber: ", prNumber);
    try {
      const result = await ItemWisePrHistoryService(
        token!,
        reqHeaderId,
        reqLineId,
        prNumber,
        orgId,
        itemId
      );
      console.log("pr history: ", result.data.data);
      if (result.data.status === 200) {
        // setPrHistory(prevPrHistory => [...prevPrHistory, result.data.data]);
        // setPrHistory(result.data.data)
        // setPrHistory([result.data.data]);
        setPrHistory((prevPrHistory) => [
          ...prevPrHistory,
          ...result.data.data,
        ]);
        // console.log("state pr: ", prHistory);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Pr History Loading Failed");
    }
  };
  //pr history

  const [openIndex, setOpenIndex] = useState<number>(-1);
  const toggleCollapse = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };
  const [openIndex2, setOpenIndex2] = useState<number>(-1);
  const toggleCollapse2 = (index2: number) => {
    setOpenIndex2(openIndex2 === index2 ? -1 : index2);
  };

  const back = () => {
    // setRfiManageSupplierPageNo(3);
    setRfiTabNo(77);
  };

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

  // feed back start

  const [supplierList, setSUpplierList] = useState<RfiSupplierInterface[] | []>(
    []
  );
  const [propicPath, setPropicPath] = useState<string>("");

  const getFeedBack = async () => {
    // setIsLoading(true);

    try {
      const result = await RfiSupplierListService(
        token!,
        null,
        userId,
        0,
        rfqIdInStore
      );
      // console.log(result.data);

      if (result.data.status === 200) {
        // console.log(result.data.data);
        setPropicPath(result.data.PROFILE_PIC);

        setSUpplierList(result.data.data);
        // setIsLoading(false);
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

  const [approveModal, setApproveModal] = useState<boolean>(false);
  const [approveValue, setApproveValue] = useState<string>("");
  const onCLickApprove = () => {
    // setActionCode(1);
    setApproveModal(!approveModal);
    if (!approveModal) {
      setApproveValue("");
    }
  };

  // Event handler to update the state when the textarea value changes
  const handleApproveValueChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const inputValue = event.target.value;
    if (inputValue.length <= 150) {
      setApproveValue(inputValue);
    } else {
      setApproveValue(inputValue.slice(0, 150));
    }
  };

  //validation
  const [rfiError, setRfiError] = useState<{
    approveVal?: string;
    password?: string;
  }>({});

  //  {loginError.email && <ValidationError title={loginError.email} />}

  //validation
  const validateRfi = () => {
    const errors: { approveVal?: string } = {};

    if (!approveValue.trim()) {
      errors.approveVal = "Please Enter Note";
    }

    setRfiError(errors);

    return Object.keys(errors).length === 0;
  };
  //validation

  // send feedback start
  const sendRfi = async () => {
    if (validateRfi()) {
      setApproveModal(false);
      try {
        const result = await RfiAddUpdateService(
          token!,
          rfiId,
          null,
          "",
          "",
          null,
          approveValue,
          1
        );
        if (result.data.status === 200) {
          showSuccessToast(result.data.message);
          setTimeout(() => {
            back();
          }, 3100);
        } else {
          showErrorToast(result.data.message);
        }
      } catch (error) {
        showErrorToast("Something went wrong");
      }
    }
  };
  // send feedback end

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

  //image array korbo

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
          const url = await getImage2(propicPath, element.INITIATOR_PRO_PIC);
          newImageUrls[element.ID] = url;
        }
        setImageUrls(newImageUrls);
        // setIsLoading(false);
      };
      fetchImages();
    }
  }, [supplierList, propicPath]);
  const [totalAmount, setTotalAmount] = useState<string>("");

  useEffect(() => {
    let s: number = 0;
    const itemList = [];

    for (let i = 0; i < quotationDataList.length; i++) {
      for (let j = 0; j < quotationDataList[i].Items.length; j++) {
        const ber = quotationDataList[i].Items[j];

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
  }, [quotationDataList]);

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

    console.log("amount: ", totalAmount + vatAmount);
    return totalAmount + vatAmount; // Adding VAT to the total
  }

  return (
    <div className="m-8">
      <div className="flex items-center justify-between">
        <h1 className="w-full text-midBlack font-mon font-semibold">
          Line Items
        </h1>

        <div className=" w-full flex justify-end">
          <CommonButton
            onClick={back}
            titleText="Back"
            width="w-24"
            height="h-9"
            color="bg-midGreen"
          />
        </div>
      </div>

      <div className="h-6"></div>

      <div className="  flex items-center space-x-4">
        <InputLebel titleText={"CS Title:"} />
        
        <p className="border-dashed border-[1px] border-gray-300 px-2 py-1 rounded-md">cs title here</p>
        </div>

      <div className=" h-8"></div>

      {isLoading ? (
        <div className=" w-full h-screen flex justify-center items-center">
          <LogoLoading />
        </div>
      ) : (
        <div className=" flex flex-row space-x-2 items-center">
          <div className=" flex-1 border-[0.1px] border-borderColor rounded-[4px]">
            <div>
              <div className=" flex flex-row items-center">
                <div className=" h-10 w-44 bg-offWhiteColor flex justify-start pl-4 items-center rounded-tl-[4px]">
                  <p className=" text-sm text-blackColor font-mon font-semibold">
                    Operating Unit
                  </p>
                </div>
                <div className=" h-10 w-[1px] bg-borderColor"></div>
                <div className="w-2"></div>
                <div className=" h-10 flex-1 bg-whiteColor flex justify-start items-center rounded-tr-[4px]">
                  <p className=" text-sm text-blackColor font-mon text-start">
                    {rfqOrgName}
                    {/* {"N/A"} */}
                  </p>
                </div>
              </div>
              <div className="w-full h-[1px] bg-borderColor"></div>
            </div>
            <div>
              <div className=" flex flex-row  items-center">
                <div className=" h-10 w-44 bg-offWhiteColor flex justify-start pl-4 items-center">
                  <p className=" text-sm text-blackColor font-mon font-semibold">
                    Document Number
                  </p>
                </div>
                <div className=" h-10 w-[1px] bg-borderColor"></div>
                <div className="w-2"></div>
                <div className=" h-10 flex-1 bg-whiteColor flex justify-start items-center">
                  <p className=" text-sm text-blackColor font-mon text-start">
                    {quotationList?.data[0].Items[0].CS_ID}
                  </p>
                </div>
              </div>
              <div className="w-full h-[1px] bg-borderColor"></div>
            </div>
            <div>
              <div className=" flex flex-row  items-center">
                <div className=" h-10 w-44 bg-offWhiteColor flex justify-start pl-4 items-center">
                  <p className=" text-sm text-blackColor font-mon font-semibold">
                    Document Date
                  </p>
                </div>
                <div className=" h-10 w-[1px] bg-borderColor"></div>
                <div className="w-2"></div>
                <div className=" h-10 flex-1 bg-whiteColor flex justify-start items-center">
                  <p className=" text-sm text-blackColor font-mon text-start">
                    {isoToDateTime(quotationList?.data[0].Items[0]!.CREATION_DATE_2!)}
                  </p>
                </div>
              </div>
              <div className="w-full h-[1px] bg-borderColor"></div>
            </div>
            <div>
              <div className=" flex flex-row  items-center">
                <div className=" h-10 w-44 bg-offWhiteColor flex justify-start pl-4 items-center">
                  <p className=" text-sm text-blackColor font-mon font-semibold">
                    Currency
                  </p>
                </div>
                <div className=" h-10 w-[1px] bg-borderColor"></div>
                <div className="w-2"></div>
                <div className=" h-10 flex-1 bg-whiteColor flex justify-start items-center">
                  <p className=" text-sm text-blackColor font-mon text-start">
                    {/* {currencyNameInStore} */}
                    {currencyName}
                  </p>
                </div>
              </div>
              <div className="w-full h-[1px] bg-borderColor"></div>
            </div>
            <div>
              <div className=" flex flex-row  items-center">
                <div className=" h-10 w-44 bg-offWhiteColor flex justify-start pl-4 items-center">
                  <p className=" text-sm text-blackColor font-mon font-semibold">
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
                  <p className=" text-sm text-blackColor font-mon font-semibold">
                    Comments
                  </p>
                </div>
                <div className=" h-10 w-[1px] bg-borderColor"></div>
                <div className="w-2"></div>
                <div className=" h-10 flex-1 bg-whiteColor flex justify-start items-center">
                  <p className=" text-sm text-blackColor font-mon text-start">
                    {"---"}
                  </p>
                </div>
              </div>
              <div className="w-full h-[1px] bg-borderColor"></div>
            </div>
            <div className=" flex flex-row  items-center">
              <div className=" h-10 w-44 pl-4 bg-offWhiteColor flex justify-start items-center rounded-bl-[4px]">
                <p className=" text-sm text-blackColor font-mon text-start font-semibold">
                  General Terms
                </p>
              </div>
              <div className=" h-10 w-[1px] bg-borderColor"></div>
              <div className="w-2"></div>
              <div className=" h-10 flex-1 bg-whiteColor flex justify-start items-center rounded-br-[4px]">
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
          {/* <div className=" flex-1 overflow-x-auto">
            <div className="">
              <table
                className="min-w-full divide-y divide-gray-200"
                style={{ tableLayout: "fixed" }}
              >
                <thead className="sticky top-0  bg-lightGreen h-10">
                  <tr>
                    <th className="font-mon px-6 py-1 text-left text-sm font-semibold text-blackColor  ">
                      SL
                    </th>
                    <th className="font-mon px-6 py-1 text-left text-sm font-semibold text-blackColor  tracking-wider">
                      Date
                    </th>
                    <th className="font-mon px-6 py-1 text-left text-sm font-semibold text-blackColor  tracking-wider">
                      Action
                    </th>
                    <th className="font-mon px-6 py-1 text-left text-sm font-semibold text-blackColor  tracking-wider">
                      Performed By
                    </th>
                    <th className="font-mon px-6 py-1 text-left text-sm font-semibold text-blackColor  tracking-wider">
                      Remarks
                    </th>
                  </tr>
                </thead>

                {hierarchyList.map((e, i) => (
                  <tbody
                    className="bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]"
                    key={i}
                  >
                    <td className="font-mon h-11 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap font-medium">
                      {i + 1}
                    </td>
                    <td className="font-mon h-11 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                      {e.ACTION_DATE === "N/A"
                        ? e.ACTION_DATE
                        : moment(e.ACTION_DATE).format("DD-MMMM-YYYY")}
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
                      {e.APPROVER_FULL_NAME}
                    </td>
                    <td className="font-mon h-11 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                      {e.ACTION_NOTE}
                    </td>
                  </tbody>
                ))}
              </table>
            </div>
          </div> */}
        </div>
      )}

      <div className=" h-10"></div>

      <div className="overflow-x-auto">
        <table
          className="min-w-full divide-y divide-gray-200"
          style={{ tableLayout: "fixed" }}
        >
          <thead className="sticky top-0  bg-offWhiteColor h-14">
            <tr>
              <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor   ">
                PR History
              </th>
              <th className=" font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  ">
                PO History
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  ">
                RFQ List
              </th>

              {/* Add more header columns as needed */}
            </tr>
          </thead>

          {/* Table rows go here */}

          <tbody className="bg-white divide-y divide-gray-200 ">
            <td className="font-mon bg-orange-50 w-72 px-6 py-3 whitespace-nowrap font-medium">
              {quotationList?.data[0].Items.map((e, i) => (
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
                                className="flex flex-row items-center space-x-2 w-72"
                                key={i}
                              >
                                <p className="text-sm font-mon font-medium text-blackColor">
                                  {"OrgName"}:
                                </p>
                                <p className=" text-sm font-mon font-medium text-blackColor whitespace-normal">
                                  {!e.INVENTORY_ORG_NAME
                                    ? "---"
                                    : e.INVENTORY_ORG_NAME}
                                </p>
                              </div>
                              <div
                                className="flex flex-row items-center space-x-2 w-72"
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
                                className="flex flex-row items-center space-x-2 w-72"
                                key={i}
                              >
                                <p className="text-sm font-mon font-medium text-blackColor">
                                  {"Item Description"}:
                                </p>
                                <p className=" text-sm font-mon font-medium text-blackColor whitespace-normal">
                                  {!e.ITEM_DESCRIPTION
                                    ? "---"
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
                                    ? "---"
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
                                  {!e.BRAND ? "---" : e.BRAND}
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
                                    ? "---"
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
                                    ? "---"
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
                                    ? "---"
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
                                  {"---"}
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
                                  {"---"}
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
                                  {!e.ON_HAND ? "---" : e.ON_HAND}
                                </p>
                              </div>
                              <div
                                className="flex flex-row items-center space-x-2 w-72"
                                key={i}
                              >
                                <p className="text-sm font-mon font-medium text-blackColor">
                                  {"1 Yr/6 Mon/3 Mon Consumption"}:
                                </p>
                                <p className=" text-sm font-mon font-medium text-blackColor whitespace-normal">
                                  {`${e.YEARLY}/${e.HALF_YEARLY}/${e.QUARTERLY}`}
                                </p>
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
                                    ? "---"
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
                                  {!e.PROJECT_NAME ? "---" : e.PROJECT_NAME}
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
                                  {"---"}
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

              {/* <div className="flex flex-col items-start space-y-1 w-72">
                {prHistoryList.map((e, i) => (
                  <div
                    className="flex flex-row items-center space-x-2 w-72"
                    key={i}
                  >
                    <p className="text-sm font-mon font-medium text-blackColor">
                      {e.name}:
                    </p>
                    <p className=" text-sm font-mon font-medium text-blackColor whitespace-normal">
                      {e.value}
                    </p>
                  </div>
                ))}
              </div> */}
              <p className="mb-4"></p>
            </td>

            <td className="font-mon w-72  px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
              {quotationList?.data[0].Items.map((e, i) => (
                <div>
                  <div className=" w-72  ">
                    <div className=" h-4"></div>
                    <div className=" w-full overflow-x-auto  mb-80 mt-40">
                      <button
                        onClick={() => {
                          getItemWisePoHistory(e.ITEM_ID);
                          console.log(e.ITEM_ID);

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
                                  {e.UNIT_PRICE}
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
                  <div className="h-10 w-44 flex justify-center px-4 items-center bg-lightGreen">
                    <p className=" text-sm text-blackColor font-mon font-medium">
                      Company Name
                    </p>
                  </div>
                  {[...Array(loopLength)].map((_, index) => (
                    <div key={index}>
                      <div className="h-[1px] border border-borderColor"></div>
                      <div className="h-20 w-44 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm  text-blackColor font-mon font-medium  flex justify-center items-center ">
                          Item Description
                        </p>
                      </div>
                      <div className="h-[1px] border border-borderColor"></div>
                      <div className="h-10 w-44 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm text-blackColor font-mon font-medium">
                          Available Spec
                        </p>
                      </div>
                      <div className="h-[1px] border border-borderColor"></div>
                      <div className="h-10 w-44 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm text-blackColor font-mon font-medium">
                          Available Brand
                        </p>
                      </div>
                      <div className="h-[1px] border border-borderColor"></div>
                      <div className="h-10 w-44 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm text-blackColor font-mon font-medium">
                          Available Origin
                        </p>
                      </div>
                      <div className="h-[1px] border border-borderColor"></div>
                      <div className="h-10 w-44 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm text-blackColor font-mon font-medium">
                          UOM
                        </p>
                      </div>
                      <div className="h-[1px] border border-borderColor"></div>
                      <div className="h-10 w-44 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm text-blackColor font-mon font-medium">
                          Expected QTY
                        </p>
                      </div>
                      <div className="h-[1px] border border-borderColor"></div>
                      <div className="h-10 w-44 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm text-blackColor font-mon font-medium">
                          Offered QTY
                        </p>
                      </div>
                      <div className="h-[1px] border border-borderColor"></div>
                      <div className="h-10 w-44 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm text-blackColor font-mon font-medium">
                          Award QTY
                        </p>
                      </div>
                      <div className="h-[1px] border border-borderColor"></div>
                      <div className="h-10 w-44 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm text-blackColor font-mon font-medium">
                          Tolerance
                        </p>
                      </div>
                      <div className="h-[1px] border border-borderColor"></div>
                      <div className="h-10 w-44 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm text-blackColor font-mon font-medium">
                          Rate/unit
                        </p>
                      </div>
                      <div className="h-[1px] border border-borderColor"></div>
                      <div className="h-10 w-44 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm text-blackColor font-mon font-medium">
                          VAT %
                        </p>
                      </div>
                      {/* <div className="h-[1px] border border-borderColor"></div>
                      <div className="h-10 w-44 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm text-blackColor font-mon font-medium">
                          AIT
                        </p>
                      </div> */}
                      <div className="h-[1px] border border-borderColor"></div>
                      <div className="h-10 w-44 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm text-blackColor font-mon font-medium">
                          Total Amount
                        </p>
                      </div>
                      <div className="h-[1px] border border-borderColor"></div>
                      <div className="h-10 w-44 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm text-blackColor font-mon font-medium">
                          Packing Type
                        </p>
                      </div>
                      <div className="h-[1px] border border-borderColor"></div>
                      <div className="h-10 w-44 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm text-blackColor font-mon font-medium">
                          Warranty
                        </p>
                      </div>
                      <div className="h-[1px] border border-borderColor"></div>
                      <div className="h-10 w-44 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm text-blackColor font-mon font-medium">
                          Recommendation Notes
                        </p>
                      </div>
                      <div className="h-[1px] border border-borderColor"></div>
                      <div className="h-10 w-44 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm text-blackColor font-mon font-medium">
                          Recommend
                        </p>
                      </div>
                      <div className="h-[1px] border border-borderColor"></div>
                      {/* <div className="h-10 w-44 flex justify-center px-4 items-center bg-lightGreen">
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
                    {quotationDataList.map((item, quotationIndex) => (
                      <div key={item.SUPPLIER_ID}>
                        <div className=" w-56 h-10 flex justify-center items-center bg-green-100">
                          {item.ORGANIZATION_NAME}
                        </div>
                        <div className="h-[1px] border border-borderColor"></div>
                        {[...Array(item.Items.length)].map((_, i) => (
                          <div key={i}>
                            <div className="w-56  h-20 px-1 flex justify-center items-center bg-green-100 whitespace-normal ">
                              {!item.Items[i].ITEM_DESCRIPTION
                                ? "---"
                                : item.Items[i].ITEM_DESCRIPTION}
                            </div>
                            <div className="h-[1px] border border-borderColor"></div>
                            <div className="w-56 h-10 flex justify-center items-center bg-green-100  whitespace-normal px-1 ">
                              {!item.Items[i].AVAILABLE_SPECS
                                ? "---"
                                : item.Items[i].AVAILABLE_SPECS}
                            </div>
                            <div className="h-[1px] border border-borderColor"></div>
                            <div className="w-56 h-10 flex justify-center items-center bg-green-100 ">
                              {!item.Items[i].AVAILABLE_BRAND_NAME
                                ? "---"
                                : item.Items[i].AVAILABLE_BRAND_NAME}
                            </div>
                            <div className="h-[1px] border border-borderColor"></div>
                            <div className="w-56 h-10 flex justify-center items-center bg-green-100 ">
                              {!item.Items[i].AVAILABLE_ORIGIN
                                ? "---"
                                : item.Items[i].AVAILABLE_ORIGIN}
                            </div>
                            <div className="h-[1px] border border-borderColor"></div>
                            <div className="w-56 h-10 flex justify-center items-center bg-green-100 ">
                              {!item.Items[i].UNIT_MEAS_LOOKUP_CODE
                                ? "---"
                                : item.Items[i].UNIT_MEAS_LOOKUP_CODE}
                            </div>
                            <div className="h-[1px] border border-borderColor"></div>
                            <div className="w-56 h-10 flex justify-center items-center bg-green-100 ">
                              {!item.Items[i].EXPECTED_QUANTITY
                                ? "---"
                                : item.Items[i].EXPECTED_QUANTITY}
                            </div>
                            <div className="h-[1px] border border-borderColor"></div>
                            <div className="w-56 h-10 flex justify-center items-center bg-green-100 ">
                              {!item.Items[i].OFFERED_QUANTITY
                                ? "---"
                                : item.Items[i].OFFERED_QUANTITY}
                            </div>
                            <div className="h-[1px] border border-borderColor"></div>
                            <div className="w-56 h-10 flex justify-center items-center bg-green-100 ">
                              {!item.Items[i].AWARD_QUANTITY
                                ? "---"
                                : item.Items[i].AWARD_QUANTITY}
                            </div>
                            <div className="h-[1px] border border-borderColor"></div>
                            <div className="w-56 h-10 flex justify-center items-center bg-green-100 ">
                              {!item.Items[i].TOLERANCE
                                ? "---"
                                : `${item.Items[i].TOLERANCE} %`}
                            </div>
                            <div className="h-[1px] border border-borderColor"></div>
                            <div className="w-56 h-10 flex justify-center items-center bg-green-100 ">
                              {!item.Items[i].UNIT_PRICE
                                ? "---"
                                : item.Items[i].UNIT_PRICE}
                            </div>
                            <div className="h-[1px] border border-borderColor"></div>

                            <div className="w-56 h-10 flex justify-center items-center bg-green-100 ">
                              {`${
                                !item.Items[i].VAT_AMOUNT
                                  ? "---"
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
                                ? "---"
                                : item.Items[i].PACKING_TYPE}
                            </div>
                            <div className="h-[1px] border border-borderColor"></div>
                            <div className="w-56 h-10 flex justify-center items-center bg-green-100 ">
                              {!item.Items[i].WARRANTY_BY_SUPPLIER
                                ? "---"
                                : item.Items[i].WARRANTY_BY_SUPPLIER === "Y"
                                ? "Yes"
                                : "No"}
                            </div>
                            <div className="h-[1px] border border-borderColor"></div>
                            <div className="w-56 h-10 flex justify-center items-center bg-green-100 ">
                              {!item.Items[i].NOTE_TO_APPROVER
                                ? "---"
                                : item.Items[i].NOTE_TO_APPROVER}
                            </div>
                            <div className="h-[1px] border border-borderColor"></div>
                            <div className="w-56 h-10 flex justify-center items-center bg-green-100 ">
                              <button
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
                  <div className="w-44  h-10  flex justify-center items-center bg-green-100 whitespace-normal ">
                    Supplier Total
                  </div>
                  <div className="h-[1px] border border-borderColor"></div>
                  <div className="w-44  h-10 flex justify-center items-center bg-green-100 whitespace-normal ">
                    Supplier Quot Total
                  </div>
                </div>
                <div className="flex-1 flex flex-row space-x-2">
                  {quotationDataList.map((item, quotationIndex) => {
                    const totalSum = item.Items.reduce((sum, currentItem) => {
                      const offeredQuantity = parseFloat(currentItem.OFFERED_QUANTITY) || 0;
                      const unitPrice = parseFloat(currentItem.UNIT_PRICE) || 0;
                      return sum + offeredQuantity * unitPrice;
                    }, 0);

                    const recommendedSum = item.Items.reduce(
                      (sum, currentItem) => {
                        if (currentItem.RECOMMENDED === "Y") {
                          const awardQuantity = parseFloat(currentItem.AWARD_QUANTITY) || 0;
                          const unitPrice = parseFloat(currentItem.UNIT_PRICE) || 0;
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

      {/* feed back start */}

      <div className="h-16"></div>

      {supplierList.map((e, i) => (
        <div
          key={e.ID}
          className=" p-4 w-full  bg-white shadow-sm rounded-md border-[0.1px] border-gray-200 flex space-x-4 items-start"
        >
          <div className=" w-12 h-12 rounded-full">
            {e.INITIATOR_PRO_PIC === "---" ? (
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

            <p className=" smallText">Query: {e.INITIATOR_NOTE}</p>
          </div>
        </div>
      ))}

      <div className="h-6"></div>

      <div className=" w-full mb-10 ">
        <CommonButton
          titleText="Feed Back"
          height="h-10"
          width="w-44"
          color="bg-midGreen"
          onClick={onCLickApprove}
        />
      </div>

      {/* feed back end */}

      {/* general terms modal start */}

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
          <div className="h-4"></div>
          <p>
            {termsList}
          </p>
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

      {/* general terms modal end */}

      {/* feed back modal start */}

      <Modal
        icon={<CloudArrowUp size={28} color="#1B4DFF" />}
        size="md"
        show={approveModal}
        onClose={onCLickApprove}
      >
        <Modal.Header>Give A Note</Modal.Header>
        <Modal.Body>
          <div className="space-y-2">
            <Textarea
              id="comment"
              placeholder="Leave a comment..."
              withBg={true}
              color="gray"
              border={true}
              rows={4}
              value={approveValue}
              onChange={handleApproveValueChange}
            />

            <div className="flex flex-between items-center">
              <div className="w-full">
                {rfiError.approveVal && (
                  <ValidationError title={rfiError.approveVal} />
                )}
              </div>

              <div className=" w-full flex justify-end smallText">
                {approveValue.length}/150
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="outlineGray"
            className=" h-8 font-mon"
            onClick={onCLickApprove}
          >
            Cancel
          </Button>
          <Button
            type=""
            className="h-8 bg-midGreen text-white font-mon"
            onClick={sendRfi}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      {/* approve modal */}

      {/* feed back modal end */}
    </div>
  );
}
