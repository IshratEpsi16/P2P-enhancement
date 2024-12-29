import React, { useState, useEffect, useRef } from "react";
import PageTitle from "../../common_component/PageTitle";
import NavigationPan from "../../common_component/NavigationPan";
import CommonButton from "../../common_component/CommonButton";
import ReusablePopperComponent from "../../common_component/ReusablePopperComponent";
import ReusablePaginationComponent from "../../common_component/ReusablePaginationComponent";

import InputLebel from "../../common_component/InputLebel";

import ItemWiseQuotationService from "../../cs/service/ItemWiseQuotationService";
import { useAuth } from "../../login_both/context/AuthContext";
import usePrItemsStore from "../../buyer_section/pr/store/prItemStore";

import {
  QuotationsInterface,
  QuotationItem,
  QuotationData,
} from "../../cs/interface/QuotationsInterface";

import PoHistoryInterface from "../../cs/interface/PoHistoryInterface";

import ItemWisePoHistoryService from "../../cs/service/ItemWisePoHistoryService";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import moment from "moment";

import ConvertedItemForCsCreation from "../../cs/interface/ConvertedItemForCsCreation";

import PrHistoryInterface from "../../cs/interface/PrHistoryInterface";

import ItemWisePrHistoryService from "../../cs/service/ItemWisePrHistoryService";
import HierarchyInterface from "../../registration/interface/hierarchy/HierarchyInterface";
import HierachyListByModuleService from "../../registration/service/approve_hierarchy/HierarchyListByModuleService";

import SupplierInterfaceInRfq from "../../cs/interface/SupplierInterfaceInRfq";

import InvitedSupplierListInARfqService from "../../cs/service/InvitedSupplierListInARfqService";

import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";
import CommonInputField from "../../common_component/CommonInputField";

import SupplierWiseTermSetService from "../../cs/service/supplierWiseTermSetService";

import GetOrgListService from "../../common_service/GetOrgListService";
import CommonOrgInterface from "../../common_interface/CommonOrgInterface";
import CurrencyListService from "../../registration/service/bank/CurrencyListService";
import useCsApprovalStore from "../store/csApprovalStore";
import CsHierarchyService from "../../cs/service/CsHierarchyService";
import { Modal, Button } from "keep-react";
import { CloudArrowUp } from "phosphor-react";
import { Textarea } from "keep-react";
import ValidationError from "../../Alerts_Component/ValidationError";
import ApproveRejectCsService from "../service/ApproveRejectCsService";
import ApproveHistoryInterface from "../interface/ApproveHistoryInterface";
import ApproveHistoryByModuleService from "../../cs/service/ApproveHistoryByModuleService";
import isoToDateTime from "../../utils/methods/isoToDateTime";
import NotFoundPage from "../../not_found/component/NotFoundPage";
import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";
import ApproverInterface from "../../approval_setup/interface/ApproverInterface";
import EmployeeListService from "../../approval_setup/service/EmployeeListService";
import RfiAddUpdateService from "../../manage_supplier_profile_update/service/rfi/RfiAddUpdateService";
import SearchIcon from "../../icons/SearchIcon";

const pan = ["CS List", "CS Details"];
interface CurrencyFromOracle {
  value: string;
  label: string;
}

interface CurrencyData {
  CURRENCY_CODE: string;
  NAME: string;
}

export default function ApproveCsPage() {
  // const [limit, setLimit] = useState(5);
  // const [pageNo, setPageNo] = useState(1);
  //cs creation store
  //   const {
  //     rfqLineIdListInStore,
  // setConvertedItemsForCsCreationAndUpdateInStore,
  // setQuotationDataListInStore,
  // setQuotationListInStore,
  // setListlengthInStore,
  // setOrgIdInStore,
  // buyerGeneralTermInStore,
  // currencyNameInStore,
  // orgNameInStore,
  // setCsGeneralTermInStore,
  // rfqIdInCsCreationStore,
  // setSupplierListInStore,
  // csGeneralTermInStore,
  // setOrgNameInStore,
  // setCurrencyNameInStore,
  // setCsTitleInStore,
  // csTitleInStore,
  //   } = useCsCreationStore();

  const {
    rfqLineIdInStore,

    setConvertedItemsForCsCreationAndUpdateInStore,
    setQuotationDataListInStore,
    setQuotationListInStore,
    setListlengthInStore,
    setOrgIdInStore,
    buyerGeneralTermInStore,
    currencyNameInStore,
    orgNameInStore,
    setCsGeneralTermInStore,
    rfqIdInCsApprovalStore,
    setSupplierListInStore,
    csGeneralTermInStore,
    setOrgNameInStore,
    setCurrencyNameInStore,
    setCsTitleInStore,
    csTitleInStore,
    orgIdInStore,
    csIdInStore,
    csCurrencyCodeInStore,
    setCsIdInStore,
    setCsApprovalPageNo,
    singleCs,
  } = useCsApprovalStore();

  const [csTitle, setCsTitle] = useState<string>("");

  const csTitleRef = useRef<HTMLInputElement | null>(null);

  const handleCsTitile = (value: string) => {
    setCsTitle(value);
  };

  // const { rfqHeaderDetailsInStore, setOrgIdInStore } = usePrItemsStore();
  //cs creation store
  useEffect(() => {
    // setCsTitle(csTitleInStore!);
    // if (csTitleRef.current) {
    //   csTitleRef.current.value = csTitleInStore!;
    // }

    console.log("rfqId: ", rfqIdInCsApprovalStore);

    setCsTitle(csTitleInStore!);
    if (csTitleRef.current) {
      csTitleRef.current.value = csTitleInStore!;
    }
    getOrgList();
    getCurrency();
    // approveHistoryGet();
  }, []);

  //currency

  const [currencyListFromOracle, setCurrencyListFromOracle] = useState<
    CurrencyFromOracle[] | []
  >([]);
  // const [currencyFromOracle, setCurrencyFromOracle] =
  //   useState<CurrencyFromOracle | null>(null);

  const [currencyName, setCurrencyName] = useState("");

  const getCurrency = async () => {
    try {
      const result = await CurrencyListService(token!);
      console.log(result.data);
      console.log(csCurrencyCodeInStore);

      if (result.data.status === 200) {
        const transformedData = result.data.data.map((item: CurrencyData) => ({
          value: item.CURRENCY_CODE,
          label: item.NAME,
        }));
        const findCurrency = transformedData.find(
          (e: CurrencyFromOracle) => e.value === csCurrencyCodeInStore
        );
        console.log(findCurrency);
        setCurrencyName(findCurrency.label);

        setCurrencyListFromOracle(transformedData);
        // setCurrencyNameInStore(findCurrency.label);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Currency load failed");
    }
  };

  const [orgName, setOrgName] = useState<string>("");
  const [orgId, setOrgId] = useState<number | null>(null);

  const getOrgList = async () => {
    try {
      const result = await GetOrgListService(token!);
      console.log(result);
      console.log(orgIdInStore);

      if (result.data.status === 200) {
        const findOrg: CommonOrgInterface = result.data.data.find(
          (org: CommonOrgInterface) => org.ORGANIZATION_ID === orgIdInStore
        );

        console.log("find org", findOrg);

        setOrgName(findOrg.NAME);
        setOrgId(findOrg.ORGANIZATION_ID);
        setOrgNameInStore(findOrg.NAME);
        setOrgIdInStore(findOrg.ORGANIZATION_ID);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Organization Load Failed");
    }
  };
  //org list

  //cs term
  const [openClose, setOpenClose] = useState(false);
  const [termText, setTermText] = useState(
    csGeneralTermInStore !== null ? csGeneralTermInStore : ""
  );

  const handleInputChange = (e: any) => {
    const inputText = e.target.value;
    if (inputText.length <= 3000) {
      setTermText(inputText);
    } else {
      setTermText(inputText.slice(0, 3000));
    }
  };

  const cancel = () => {
    setOpenClose(false);
  };

  const save = async () => {
    setCsGeneralTermInStore(termText);
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
  const previous = async () => {
    back();
  };
  const download = async () => {};

  // const preview = () => {
  //   setConvertedItemsForCsCreationAndUpdateInStore(selectedItemList);
  //   nextPage();
  // };

  const termModalShow = () => {
    setOpenClose(true);
  };

  //context

  const back = () => {
    setCsApprovalPageNo(2);
  };
  const nextPage = () => {};

  //context

  //usePrItemsStore

  //usePrItemsStore

  //useAuth
  const { token, userId, department } = useAuth();
  //useAuth

  //store
  //store

  useEffect(() => {
    console.log(rfqLineIdInStore!);
    getItemWiseQuotations();
    getApproverHierachy();
    getSupplierList();
    // setTermText(csGeneralTermInStore!);
    console.log(csGeneralTermInStore);
  }, []);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  //get item wise quotations

  const [loopLength, setLoopLength] = useState<number>(0);

  const [poPrlen, setPoPrLen] = useState<number>(0);

  const [quotationList, setQuotationList] =
    useState<QuotationsInterface | null>(null); //QuotationData

  const [quotationDataList, setQuotationDataList] = useState<QuotationData[]>(
    []
  );

  const getItemWiseQuotations = async () => {
    console.log();

    try {
      setIsLoading(true);

      const result = await ItemWiseQuotationService(
        token!,
        rfqIdInCsApprovalStore!,
        rfqLineIdInStore!,
        orgIdInStore!,
        0,
        10000
      );
      console.log(result);

      if (result.data.status === 200) {
        console.log(result.data);

        setQuotationList(result.data);
        setQuotationListInStore(result.data);
        setQuotationDataList(result.data.data);
        setQuotationDataListInStore(result.data.data);
        setLoopLength(result.data.data[0].Items.length);
        console.log(result.data.data.length);
        setPoPrLen(result.data.data.length);
        console.log("item len", result.data.data[0].Items.length);

        setListlengthInStore(result.data.data[0].Items.length);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  //get item wise quotations

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

  //handle recommend

  // const handleRecommended = (index: number) => {
  //   console.log(index);

  //   const newQuotationDataList = [...quotationDataList];
  //   console.log(newQuotationDataList[index].Items[index].RECOMMENDED);
  //   newQuotationDataList[index].Items[index].RECOMMENDED =
  //     newQuotationDataList[index].Items[index].RECOMMENDED === "N" ? "Y" : "N";
  //   console.log(newQuotationDataList[index].Items[index].RECOMMENDED);

  //   setQuotationDataList(newQuotationDataList);
  // };

  const [selectedItemList, setSelectedItemList] = useState<
    ConvertedItemForCsCreation[]
  >([]);

  const handleRecommended = (quotationIndex: number, itemIndex: number) => {
    const newQuotationDataList = [...quotationDataList];

    // Toggle the RECOMMENDED field
    const currentItem = newQuotationDataList[quotationIndex].Items[itemIndex];
    console.log(currentItem);

    currentItem.RECOMMENDED = currentItem.RECOMMENDED === "N" ? "Y" : "N";

    console.log(
      newQuotationDataList[quotationIndex].Items[itemIndex].RFQ_LINE_ID
    );
    // console.log(newQuotationDataList[quotationIndex].Items[itemIndex]);
    console.log(newQuotationDataList[quotationIndex].Items[itemIndex]);

    // Update quotationDataList state
    setQuotationDataList(newQuotationDataList);

    // Convert the item to ConvertedItemForCsCreation
    const convertedItem: ConvertedItemForCsCreation = {
      RFQ_ID: currentItem.RFQ_ID.toString(),
      RFQ_LINE_ID: currentItem.RFQ_LINE_ID.toString(),
      QUOT_LINE_ID: currentItem.QUOT_LINE_ID.toString(),
      RECOMMENDED: currentItem.RECOMMENDED,
      NOTE_FROM_BUYER: currentItem.NOTE_TO_SUPPLIER, // Provide a value or map it accordingly
      AWARDED: currentItem.AWARDED, // Provide a value or map it accordingly
      NOTE_TO_APPROVER: currentItem.NOTE_TO_APPROVER,

      USER_ID: newQuotationDataList[quotationIndex].USER_ID.toString(),
      ORG_ID: orgIdInStore!,
      VENDOR_ID: newQuotationDataList[quotationIndex].VENDOR_ID.toString(),
      VENDOR_SITE_ID:
        newQuotationDataList[quotationIndex].VENDOR_SITE_ID.toString(),
      CS_LINE_ID: currentItem.CS_LINE_ID,
      AWARD_QUANTITY: currentItem.AWARD_QUANTITY,
    };
    console.log(convertedItem);

    // Update selectedItemList state with the converted item
    setSelectedItemList((prevItemList) => {
      const updatedList = [...prevItemList];
      updatedList[quotationIndex] = convertedItem;
      return updatedList;
    });
  };

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
  const [approvedId, setApproverId] = useState<number | null>(null);
  const [stageId, setStageId] = useState<number | null>(null);
  const [stageLevel, setStagelevel] = useState<number | null>(null);
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
        csIdInStore!
      );
      console.log(result);

      if (result.data.status === 200) {
        setHierarchyUserProfilePicturePath(result.data.profile_pic);
        setHierarchyList(result.data.data);
        const find: HierarchyInterface = result.data.data.find(
          (item: HierarchyInterface) => item.APPROVER_ID === userId
        );
        console.log("find approver", find.APPROVER_ID);
        setApproverId(find.APPROVER_ID);
        setStageId(find.STAGE_ID);
        setStagelevel(find.STAGE_LEVEL);
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

  //supplier list get
  const termRefs = useRef<HTMLInputElement[]>([]);

  const [termList, setTermList] = useState<string[]>([]);

  const [supplierList, setSupplierList] = useState<SupplierInterfaceInRfq[]>(
    []
  );

  const getSupplierList = async () => {
    try {
      const result = await InvitedSupplierListInARfqService(
        token!,
        rfqIdInCsApprovalStore!
      );
      if (result.data.status === 200) {
        setSupplierList(result.data.data);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Supplier Load Failed");
    }
  };

  useEffect(() => {
    setData();
  }, [supplierList]);

  const setData = () => {
    if (supplierList) {
      const newTermList = supplierList.map((term) => term.GENERAL_TERMS);
      setTermList(newTermList);
      if (termRefs.current) {
        termRefs.current = newTermList.map((term, index) => {
          return termRefs.current[index] || React.createRef<HTMLInputElement>();
        });
      }
    }
  };

  const handleTermChange = (value: string, index: number) => {
    const newTerms = [...termList];
    newTerms[index] = value;
    setTermList(newTerms);
    const newSupplierList = [...supplierList];
    newSupplierList[index].GENERAL_TERMS = value;
    setSupplierList(newSupplierList);
  };

  //supplier list get

  //approve rject

  const approve = () => {
    onCLickApprove();
  };

  const [isApproveLoading, setIsApproveLoading] = useState<boolean>(false);
  const [isRejectLoading, setIsRejectLoading] = useState<boolean>(false);

  const DoApprove = async () => {
    if (validateApprove()) {
      onCLickApprove();
      setIsApproveLoading(true);
      console.log(singleCs?.TEMPLATE_ID);
      console.log(singleCs?.TEMPLATE_STAGE_LEVEL);

      try {
        const result = await ApproveRejectCsService(
          token!,
          csIdInStore!,
          "1",
          singleCs?.TEMPLATE_ID!,
          singleCs?.TEMPLATE_STAGE_LEVEL!,
          approveValue!
        );
        console.log(result);

        if (result.data.history_status === 200) {
          showSuccessToast("CS Approved Succesfully");
          setCsTitleInStore(null);
          setConvertedItemsForCsCreationAndUpdateInStore(null);
          setCsGeneralTermInStore(null);
          setSupplierListInStore(null);
          setCurrencyNameInStore(null);
          setStageId(null);
          setStagelevel(null);
          setApproverId(null);
          setApproveValue("");
          setCsIdInStore(null);
          setIsApproveLoading(false);

          setCsApprovalPageNo(1);
        } else {
          setIsApproveLoading(false);
          showErrorToast(result.data.message);
        }
      } catch (error) {
        setIsApproveLoading(false);
        showErrorToast("CS Approval Failed");
      }
    }
  };

  const reject = () => {
    onCLickReject();
  };
  const DoReject = async () => {
    if (validateReject()) {
      onCLickReject();
      setIsRejectLoading(true);
      try {
        const result = await ApproveRejectCsService(
          token!,
          csIdInStore!,
          "0",
          singleCs?.TEMPLATE_ID!,
          singleCs?.TEMPLATE_STAGE_LEVEL!,
          rejectValue!
        );
        console.log(result);

        if (result.data.history_status === 200) {
          showSuccessToast("CS Rejected Succesfully");
          setCsTitleInStore(null);
          setConvertedItemsForCsCreationAndUpdateInStore(null);
          setCsGeneralTermInStore(null);
          setSupplierListInStore(null);
          setCurrencyNameInStore(null);
          setStageId(null);
          setStagelevel(null);
          setApproverId(null);
          setRejectValue("");
          setCsIdInStore(null);
          setIsRejectLoading(false);
          setCsApprovalPageNo(1);
        } else {
          setIsRejectLoading(false);
          showErrorToast(result.data.message);
        }
      } catch (error) {
        setIsRejectLoading(false);
        showErrorToast("CS Rejected Failed");
      }
    }
  };

  const [isCancelLoading, setIsCancelLoading] = useState<boolean>(false);

  const DoCancel = async () => {
    if (validateCancel()) {
      onCLickCancel();
      setIsCancelLoading(true);
      try {
        const result = await ApproveRejectCsService(
          token!,
          csIdInStore!,
          "2",
          singleCs?.TEMPLATE_ID!,
          singleCs?.TEMPLATE_STAGE_LEVEL!,
          cancelValue!
        );
        console.log(result);

        if (result.data.history_status === 200) {
          showSuccessToast("CS Canceled Succesfully");
          setCsTitleInStore(null);
          setConvertedItemsForCsCreationAndUpdateInStore(null);
          setCsGeneralTermInStore(null);
          setSupplierListInStore(null);
          setCurrencyNameInStore(null);
          setStageId(null);
          setStagelevel(null);
          setApproverId(null);
          setRejectValue("");
          setCsIdInStore(null);
          setIsCancelLoading(false);
          setCsApprovalPageNo(1);
        } else {
          setIsCancelLoading(false);
          showErrorToast(result.data.message);
        }
      } catch (error) {
        setIsCancelLoading(false);
        showErrorToast("CS Cancelation Failed");
      }
    }
  };

  //validation

  const [approveError, setApproveError] = useState<{ note?: string }>({});
  const [rejectError, setRejectError] = useState<{ note?: string }>({});
  const [cancelError, setCancelError] = useState<{ note?: string }>({});

  //  {loginError.email && <ValidationError title={loginError.email} />}

  //validation
  const validateApprove = () => {
    const errors: { note?: string } = {};

    if (!approveValue.trim()) {
      errors.note = "Please Enter Note";
    }

    setApproveError(errors);

    return Object.keys(errors).length === 0;
  };
  const validateReject = () => {
    const errors: { note?: string } = {};

    if (!rejectValue.trim()) {
      errors.note = "Please Enter Note";
    }

    setRejectError(errors);

    return Object.keys(errors).length === 0;
  };
  const validateCancel = () => {
    const errors: { note?: string } = {};

    if (!cancelValue.trim()) {
      errors.note = "Please Enter Note";
    }

    setCancelError(errors);

    return Object.keys(errors).length === 0;
  };

  const [approveModal, setApproveModal] = useState<boolean>(false);
  const onCLickApprove = () => {
    // setActionCode(1);
    setApproveModal(!approveModal);
    if (!approveModal) {
      setApproveValue("");
    }
  };

  const [approveValue, setApproveValue] = useState<string>("");

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

  //reject modal

  const [rejectModal, setRejectModal] = useState<boolean>(false);
  const onCLickReject = () => {
    // setActionCode(0);
    setRejectModal(!rejectModal);
    if (!rejectModal) {
      setRejectValue("");
    }
  };

  const [rejectValue, setRejectValue] = useState<string>("");

  // Event handler to update the state when the textarea value changes
  const handleRejectValueChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const inputValue = event.target.value;

    // Check if the input value exceeds the maximum character length (150)
    if (inputValue.length <= 150) {
      setRejectValue(inputValue);
    } else {
      // Truncate the input value to the first 150 characters
      setRejectValue(inputValue.slice(0, 150));
    }
  };

  //validation

  const [cancelValue, setCancelValue] = useState<string>("");

  const [cancelModal, setCancelModal] = useState<boolean>(false);

  const onCLickCancel = () => {
    // setActionCode(0);
    setCancelModal(!cancelModal);
    if (!cancelModal) {
      setCancelValue("");
    }
  };

  const handleCancelValueChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const inputValue = event.target.value;

    // Check if the input value exceeds the maximum character length (150)
    if (inputValue.length <= 150) {
      setCancelValue(inputValue);
    } else {
      // Truncate the input value to the first 150 characters
      setCancelValue(inputValue.slice(0, 150));
    }
  };

  //approve rject

  //approve history

  const openModalHistory = () => {
    const modal = document.getElementById("my_modal_5") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  //approve history

  // const [approveHistory, setApproveHistory] = useState<
  //   ApproveHistoryInterface[] | []
  // >([]);

  // const approveHistoryGet = async () => {
  //   try {
  //     const result = await ApproveHistoryByModuleService(
  //       token!,
  //       csIdInStore!,
  //       "CS"
  //     );
  //     if (result.data.status === 200) {
  //       setApproveHistory(result.data.data);
  //     } else {
  //       showErrorToast(result.data.message);
  //     }
  //   } catch (error) {
  //     showErrorToast("Approve History Load Failed");
  //   }
  // };

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
  }, [quotationDataList]); // This effect will run whenever `quotationDataList` changes

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

  // function calculateVAT(
  //   ratePerUnit: number,
  //   vatPercentage: number,
  //   offeredQty: number
  // ): number {
  //   const totalAmount = ratePerUnit * offeredQty;
  //   const vatAmount = (vatPercentage / 100) * totalAmount;
  //   return vatAmount;
  // }

  // function calculateAmount(totalVat: number, offeredQty: number): number {
  //   const vatAmt = totalVat * offeredQty;
  //   return vatAmt;
  // }

  // function calculateTotal(
  //   ratePerUnit: number,
  //   vatPercentage: number,
  //   offeredQty: number,
  //   vatType: string
  // ): number {
  //   const totalAmount = ratePerUnit * offeredQty;
  //   const vatAmount =
  //     vatType === "Percentage"
  //       ? calculateVAT(ratePerUnit, vatPercentage, offeredQty)
  //       : calculateAmount(vatPercentage, offeredQty);
  //   return totalAmount + vatAmount; // Adding VAT to the total
  // }

  // cs rfi start

  const [rfqInfoModal, setRfqInfoModal] = useState<boolean>(false);
  const [additionalValue, setAdditionalValue] = useState<string>("");
  const [viewerId, setViewerId] = useState<number | null>(null);
  const [isApproverLoading, setIsApproverLoading] = useState(false);
  const [approverList, setApproverList] = useState<ApproverInterface[] | []>(
    []
  );
  const [approverList2, setApproverList2] = useState<ApproverInterface[] | []>(
    []
  );
  const [rfiError, setRfiError] = useState<{
    rfiNote?: string;
    viewer?: string;
  }>({});

  useEffect(() => {
    getApproverList();
    console.log("rfqId: ", rfqIdInCsApprovalStore);
  }, []);

  const rfiInfo = () => {
    setRfqInfoModal(!rfqInfoModal);
  };

  const onClickAdditional = () => {
    setRfqInfoModal(!rfqInfoModal);
    if (rfqInfoModal) {
      setAdditionalValue("");
      setViewerId(null);
    }
  };

  const handleRfqInfoChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const inputValue = event.target.value;

    if (inputValue.length <= 150) {
      setAdditionalValue(inputValue);
    } else {
      setAdditionalValue(inputValue.slice(0, 150));
    }
  };

  const handleApproverSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value !== null) {
      const approvers = approverList2.filter((approver) =>
        approver.FULL_NAME.toLowerCase().includes(value)
      );
      setApproverList(approvers);
    } else {
      setApproverList(approverList2);
    }
  };

  const getApproverList = async () => {
    setIsApproverLoading(true);
    try {
      const result = await EmployeeListService(token!);
      console.log(result.data.profile_pic);

      if (result.data.status === 200) {
        setIsApproverLoading(false);
        // setApproverProfilePicPath(result.data.profile_pic);
        setApproverList(result.data.data);
        setApproverList2(result.data.data);

        // const convertedData = result.data.data.map((module:ModuleInterface) => ({
        //     value: module.MODULE_ID.toString(),
        //     label: module.MODULE_NAME,
        //   }));
        //   setModuleList(convertedData);
      } else {
        setIsApproverLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsApproverLoading(false);
      showErrorToast("Smothing went wrong");
    }
  };

  const [showApproverAddModal, setShowApproverAddModal] = useState(false);
  const openCloseApproverModal = () => {
    setShowApproverAddModal(!showApproverAddModal);
  };

  const handleApproverIdChange = (uId: number) => {
    setViewerId(uId);
    console.log(uId);
  };

  const validateRfi = () => {
    const errors: { rfiNote?: string; viewer?: string } = {};

    if (!additionalValue.trim()) {
      errors.rfiNote = "Please Enter Note";
    }
    if (viewerId == null) {
      errors.viewer = "Please Select A Viewer";
    }

    setRfiError(errors);

    return Object.keys(errors).length === 0;
  };

  const sendRfi = async () => {
    if (validateRfi()) {
      setRfqInfoModal(false);
      try {
        const result = await RfiAddUpdateService(
          token!,
          null,
          rfqIdInCsApprovalStore,
          "CS",
          additionalValue,
          viewerId,
          "",
          0
        );
        if (result.data.status === 200) {
          showSuccessToast(result.data.message);
          setAdditionalValue("");
          setViewerId(null);
          // back();
        } else {
          showErrorToast(result.data.message);
        }
      } catch (error) {
        showErrorToast("Something went wrong");
      }
    }
  };

  // cs rfi end

  return (
    <div className="m-8">
      <SuccessToast />
      <div className=" flex flex-col items-start">
        <PageTitle titleText="CS Creation" />
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
            onChangeData={handleCsTitile}
            inputRef={csTitleRef}
            hint="Give CS Title"
            type="text"
            width="w-96"
            height="h-10"
            disable={true}
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
                  {singleCs?.CS_ID}
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
                  {isoToDateTime(singleCs?.CREATION_DATE!)}
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
                  {currencyName}
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
                  {singleCs?.RFQ_TYPE === "T" ? "Technical" : "Both"}
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
                <p className=" text-sm text-blackColor font-mon">Comments</p>
              </div>
              <div className=" h-10 w-[1px] bg-borderColor"></div>
              <div className="w-2"></div>
              <div className=" h-10 flex-1 bg-whiteColor flex justify-start items-center">
                <p className=" text-sm text-blackColor font-mon text-start">
                  {singleCs?.NOTE}
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
        {/* hierarcy silo */}
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
              {quotationList?.data[0]?.Items.map((e, i) => (
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
                                    ? "N/A"
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
                                  {"N/A"}
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
                                {/* <p className=" text-sm font-mon font-medium text-blackColor whitespace-normal">
                                  {`${e.YEARLY}/${e.HALF_YEARLY}/${e.QUARTERLY}`}
                                </p> */}
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
              {quotationList?.data[0]?.Items.map((e, i) => (
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
                  {[...Array(loopLength)].map((_, index) => (
                    <div key={index}>
                      <div className="h-[1px] border border-borderColor"></div>
                      <div className="h-20 w-40 flex justify-center px-4 items-center bg-lightGreen">
                        <p className=" text-sm  text-blackColor font-mon font-medium  flex justify-center items-center ">
                          Item Description
                        </p>
                      </div>
                      <div className="h-[1px] border border-borderColor"></div>
                      <div className="h-10 w-40 flex justify-center px-4 items-center bg-lightGreen">
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
                                ? "N/A"
                                : item.Items[i].ITEM_DESCRIPTION}
                            </div>
                            <div className="h-[1px] border border-borderColor"></div>
                            <div className="w-56 h-10 flex justify-center items-center bg-green-100  whitespace-normal px-1 ">
                              {!item.Items[i].AVAILABLE_SPECS
                                ? "N/A"
                                : item.Items[i].AVAILABLE_SPECS}
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
                              {`${item.Items[i].VAT_AMOUNT} ${
                                item.Items[i].VAT_TYPE === "Percentage"
                                  ? "%"
                                  : ""
                              }`}
                            </div>

                            <div className="h-[1px] border border-borderColor"></div>
                            <div className="w-56 h-10 flex justify-center items-center bg-green-100 ">
                              {/* {calculateTotal(
                                parseFloat(item.Items[i].UNIT_PRICE),
                                item.Items[i].VAT_AMOUNT,
                                parseFloat(item.Items[i].OFFERED_QUANTITY),
                                item.Items[i].VAT_TYPE
                              )} */}

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
                                // onClick={() => {
                                //   handleRecommended(quotationIndex, i);
                                // }}
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
                  {quotationDataList.map((item, quotationIndex) => {
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
          onClick={previous}
          titleText={"Previous"}
          width="w-28"
          height="h-8"
          color="bg-graishColor"
        />
        {isCancelLoading ? (
          <div className=" w-28 flex justify-center items-center">
            <CircularProgressIndicator />
          </div>
        ) : (
          <CommonButton
            onClick={onCLickCancel}
            titleText={"Cancel"}
            width="w-28"
            height="h-8"
          />
        )}

        <CommonButton
          onClick={rfiInfo}
          titleText={"Request for Information"}
          width="w-48"
          height="h-8"
          color=" bg-midBlack "
        />

        {isRejectLoading ? (
          <div className=" w-28 flex justify-center items-center">
            <CircularProgressIndicator />
          </div>
        ) : (
          <CommonButton
            onClick={reject}
            titleText={"Reject"}
            width="w-28"
            height="h-8"
            color="bg-redColor"
          />
        )}

        {isApproveLoading ? (
          <div className=" w-28 flex justify-center items-center">
            <CircularProgressIndicator />
          </div>
        ) : (
          <CommonButton
            onClick={approve}
            titleText={"Approve"}
            width="w-28"
            height="h-8"
            color="bg-midGreen"
          />
        )}
      </div>
      <div className=" h-20"></div>
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
            value={termText}
            onChange={handleInputChange}
            className="w-full h-80 mx-20  bg-inputBg mt-2 rounded-md shadow-sm focus:outline-none p-8"
          />
          <div className=" w-full  flex items-end justify-end font-mon text-sm">
            {termText.length}/3000
          </div>

          <div className="h-6"></div>
          <div className="w-full justify-start items-start">
            <InputLebel titleText={"Special Terms"} />
          </div>
          <div className="h-6"></div>
          {supplierList.map((sup, index) => (
            <div key={sup.USER_ID} className="w-full my-2">
              <div className=" w-full flex flex-row">
                <div className="  w-44 flex justify-center bg-offWhiteColor items-center border-r-[0.2px] border-b-[0.2px]  border-borderColor">
                  <p className=" text-sm text-blackColor font-mon font-medium">
                    {sup.ORGANIZATION_NAME}
                  </p>
                </div>
                <div className=" flex-1  border-borderColor flex justify-center items-center">
                  {/* <p className=" pl-4 text-sm text-blackColor font-mon ">
                Lorem ipsum dolor sit amet consectetur. Ante vivamus potenti
                purus maecenas eget aliquam arcu. Amet tincidunt arcu morbi
                luctus nulla.
              </p> */}

                  <CommonInputField
                    disable={true}
                    type="text"
                    width="w-full"
                    hint="term"
                    // maxCharacterlength={150}
                    onChangeData={(value) => handleTermChange(value, index)}
                    inputRef={{
                      current: termRefs.current[index],
                    }}
                    value={termList[index]}
                  />
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
              color="bg-red-600"
            />
            {/* <CommonButton
              onClick={save}
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
          <textarea disabled={true} className=" w-full h-[340px] p-4">
            {buyerGeneralTermInStore}
          </textarea>
          {/* <p className="py-4">{buyerGeneralTermInStore}</p> */}
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
      {/* approve modal */}
      <Modal
        icon={<CloudArrowUp size={28} color="#1B4DFF" />}
        size="md"
        show={approveModal}
        onClose={onCLickApprove}
      >
        <Modal.Header>Give A Note</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
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
            {approveError.note && <ValidationError title={approveError.note} />}
            <div className=" w-full flex justify-end smallText">
              {approveValue.length}/150
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
            onClick={DoApprove}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      {/* approve modal */}

      {/* reject modal */}
      <Modal
        icon={<CloudArrowUp size={28} color="#1B4DFF" />}
        size="md"
        show={rejectModal}
        onClose={onCLickReject}
      >
        <Modal.Header>Give A Note</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <Textarea
              id="comment"
              placeholder="Leave a comment..."
              withBg={true}
              color="gray"
              border={true}
              rows={4}
              value={rejectValue}
              onChange={handleRejectValueChange}
            />
            {rejectError.note && <ValidationError title={rejectError.note} />}
            <div className=" w-full flex justify-end smallText">
              {rejectValue.length}/150
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="outlineGray"
            className=" h-8 font-mon"
            onClick={onCLickReject}
          >
            Cancel
          </Button>
          <Button
            type=""
            className="h-8 bg-midGreen text-white font-mon"
            onClick={DoReject}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        icon={<CloudArrowUp size={28} color="#1B4DFF" />}
        size="md"
        show={cancelModal}
        onClose={onCLickCancel}
      >
        <Modal.Header>Give A Note</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <Textarea
              id="comment"
              placeholder="Leave a comment..."
              withBg={true}
              color="gray"
              border={true}
              rows={4}
              value={cancelValue}
              onChange={handleCancelValueChange}
            />
            {cancelError.note && <ValidationError title={cancelError.note} />}
            <div className=" w-full flex justify-end smallText">
              {cancelValue.length}/150
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="outlineGray"
            className=" h-8 font-mon"
            onClick={onCLickCancel}
          >
            Cancel
          </Button>
          <Button
            type=""
            className="h-8 bg-midGreen text-white font-mon"
            onClick={DoCancel}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      {/* reject modal */}

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

      {/* rfi Modal start for cs */}
      <Modal
        // icon={<CloudArrowUp size={28} color="#1B4DFF" />}
        size="md"
        show={rfqInfoModal}
        onClose={onClickAdditional}
      >
        <Modal.Header>Describe Your Need</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <Textarea
                id="comment"
                placeholder="Leave a comment..."
                withBg={true}
                color="gray"
                border={true}
                rows={3}
                value={additionalValue}
                onChange={handleRfqInfoChange}
              />

              <div className="flex justify-between items-center">
                <div className="w-full">
                  {rfiError.rfiNote && (
                    <ValidationError title={rfiError.rfiNote} />
                  )}
                </div>
                <div className=" w-full flex justify-end smallText">
                  {additionalValue.length}/150
                </div>
              </div>
            </div>
            {/* <div className=" w-full flex justify-end smallText">
                {additionalValue.length}/150
              </div>
              {rfiError.rfiNote && <ValidationError title={rfiError.rfiNote} />} */}

            <div className=" w-full h-10 flex items-center space-x-[0.1px]">
              <input
                onChange={handleApproverSearch}
                type="text"
                className=" flex-1 h-full border-[0.5px] border-borderColor outline-[0.1px] outline-midBlue px-2 placeholder:text-graishColor placeholder:text-sm placeholder:font-mon"
                placeholder="Search Employee"
              />
              <button
                disabled={true}
                className=" px-4 h-full flex justify-center items-center bg-midBlue rounded-[2px]"
              >
                <SearchIcon className=" text-whiteColor" />
              </button>
            </div>
            <div className=" w-full h-40 overflow-y-auto">
              {approverList.map((e, i) => (
                <button
                  onClick={() => {
                    handleApproverIdChange(e.USER_ID);
                  }}
                  key={e.USER_ID}
                  className={`w-full h-10 shadow-sm px-2 my-2  border-[1px]   justify-start ${
                    viewerId === e.USER_ID
                      ? " bg-midGreen text-whiteColor font-mon text-sm"
                      : "smallText bg-whiteColor"
                  }  items-center rounded-[2px] flex space-x-1`}
                >
                  {e.FULL_NAME}
                </button>
              ))}

              <div className="h-4"></div>

              {rfiError.viewer && <ValidationError title={rfiError.viewer} />}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="outlineGray"
            className=" h-8 font-mon"
            onClick={onClickAdditional}
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

      {/* rfi Modal for cs */}
    </div>
  );
}
