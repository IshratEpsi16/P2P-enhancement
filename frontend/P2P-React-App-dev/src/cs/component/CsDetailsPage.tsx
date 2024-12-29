import React, { useState, useEffect, useRef } from "react";
import PageTitle from "../../common_component/PageTitle";
import NavigationPan from "../../common_component/NavigationPan";
import CommonButton from "../../common_component/CommonButton";
import ReusablePopperComponent from "../../common_component/ReusablePopperComponent";
import ReusablePaginationComponent from "../../common_component/ReusablePaginationComponent";

import InputLebel from "../../common_component/InputLebel";
import useCsCreationStore from "../store/CsCreationStore";
import ItemWiseQuotationService from "../service/ItemWiseQuotationService";
import { useAuth } from "../../login_both/context/AuthContext";
import usePrItemsStore from "../../buyer_section/pr/store/prItemStore";
import {
  QuotationsInterface,
  QuotationItem,
  QuotationData,
} from "../interface/QuotationsInterface";
import PoHistoryInterface from "../interface/PoHistoryInterface";
import ItemWisePoHistoryService from "../service/ItemWisePoHistoryService";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import moment from "moment";
import ConvertedItemForCsCreation from "../interface/ConvertedItemForCsCreation";
import PrHistoryInterface from "../interface/PrHistoryInterface";
import ItemWisePrHistoryService from "../service/ItemWisePrHistoryService";
import HierarchyInterface from "../../registration/interface/hierarchy/HierarchyInterface";

import SupplierInterfaceInRfq from "../interface/SupplierInterfaceInRfq";
import InvitedSupplierListInARfqService from "../service/InvitedSupplierListInARfqService";
import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";
import CommonInputField from "../../common_component/CommonInputField";
import SupplierWiseTermSetService from "../service/supplierWiseTermSetService";
import GetOrgListService from "../../common_service/GetOrgListService";
import CommonOrgInterface from "../../common_interface/CommonOrgInterface";
import CurrencyListService from "../../registration/service/bank/CurrencyListService";
import CsHierarchyService from "../service/CsHierarchyService";
import isoToDateTime from "../../utils/methods/isoToDateTime";
import LogoLoading from "../../Loading_component/LogoLoading";
import OrgWiseStockInterface from "../interface/OrgWiseStockInterface";
import OrgWiseStockService from "../service/OrgWiseStockService";
import EmployeeListService from "../../approval_setup/service/EmployeeListService";
import RfiAddUpdateService from "../../manage_supplier_profile_update/service/rfi/RfiAddUpdateService";
import { Button, Modal, Textarea } from "keep-react";
import ValidationError from "../../Alerts_Component/ValidationError";
import SearchIcon from "../../icons/SearchIcon";
import { CloudArrowUp } from "phosphor-react";
import ApproverInterface from "../../approval_setup/interface/ApproverInterface";

const pan = ["CS List", "CS Details"];
interface CurrencyFromOracle {
  value: string;
  label: string;
}

interface CurrencyData {
  CURRENCY_CODE: string;
  NAME: string;
}

export default function CsDetailsPage() {
  const [limit, setLimit] = useState(5);
  const [pageNo, setPageNo] = useState(1);
  //cs creation store
  const {
    rfqLineIdListInStore,
    setConvertedItemsForCsCreationAndUpdateInStore,
    setQuotationDataListInStore,
    setQuotationListInStore,
    setListlengthInStore,
    setOrgIdInStore,
    buyerGeneralTermInStore,
    currencyNameInStore,
    orgNameInStore,
    orgIdInStore,
    setCsGeneralTermInStore,
    rfqIdInCsCreationStore,
    setSupplierListInStore,
    csGeneralTermInStore,
    setOrgNameInStore,
    setCurrencyNameInStore,
    setCsTitleInStore,
    csTitleInStore,
    savedCsIdInStore,
    csCreationDateInStore,
    csStatusInStore,
    rfqTypeInCsCreationStore,
    csNoteInStore,
    setCsNoteInStore,
  } = useCsCreationStore();

  const [csTitle, setCsTitle] = useState<string>("");

  const csTitleRef = useRef<HTMLInputElement | null>(null);

  const handleCsTitile = (value: string) => {
    setCsTitle(value);
  };

  const { rfqHeaderDetailsInStore, rfqIdInStore } = usePrItemsStore();
  //cs creation store
  useEffect(() => {
    console.log("status: ", csStatusInStore);
    setCsTitle(csTitleInStore!);
    console.log(csNoteInStore);

    setNote(csNoteInStore!);
    if (noteRef.current) {
      noteRef.current.value = csNoteInStore!;
    }

    if (csTitleRef.current) {
      csTitleRef.current.value = csTitleInStore!;
    }
    getOrgList();
    getCurrency();
  }, []);

  //currency

  const [currencyListFromOracle, setCurrencyListFromOracle] = useState<
    CurrencyFromOracle[] | []
  >([]);
  // const [currencyFromOracle, setCurrencyFromOracle] =
  //   useState<CurrencyFromOracle | null>(null);

  const getCurrency = async () => {
    try {
      const result = await CurrencyListService(token!);
      console.log(result.data);

      if (result.data.status === 200) {
        const transformedData = result.data.data.map((item: CurrencyData) => ({
          value: item.CURRENCY_CODE,
          label: item.NAME,
        }));
        const findCurrency = transformedData.find(
          (e: CurrencyFromOracle) =>
            e.value === rfqHeaderDetailsInStore?.details.CURRENCY_CODE
        );
        console.log(findCurrency);

        setCurrencyListFromOracle(transformedData);
        setCurrencyNameInStore(findCurrency.label);
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

      if (result.data.status === 200) {
        const findOrg: CommonOrgInterface = result.data.data.find(
          (org: CommonOrgInterface) =>
            org.ORGANIZATION_ID.toString() ===
            rfqHeaderDetailsInStore?.details.ORG_ID!.toString()
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
    setCsGeneralTermInStore(termText);
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
  const previous = async () => {};
  const download = async () => {};

  // const preview = () => {
  //   setConvertedItemsForCsCreationAndUpdateInStore(selectedItemList);
  //   nextPage();
  // };

  const termModalShow = () => {
    setOpenClose(true);
  };

  //context

  const { setCsPageNo } = useCsCreationStore();
  const back = () => {
    setCsPageNo(2);
  };

  const nextPage = () => {
    if (selectedItemList.length === 0) {
      // const items: QuotationItem[] = [];
      const convertInLoop: ConvertedItemForCsCreation[] = [];
      console.log(quotationDataList.length); //output 2

      for (let i = 0; i < quotationDataList.length; i++) {
        for (let j = 0; j < quotationDataList[i].Items.length; j++) {
          const ber = quotationDataList[i].Items[j]; // Corrected to Items

          console.log(i, j);

          // items.push(ber);
          const con: ConvertedItemForCsCreation = {
            RFQ_ID: ber.RFQ_ID.toString(),
            RFQ_LINE_ID: ber.RFQ_LINE_ID.toString(),
            QUOT_LINE_ID: ber.QUOT_LINE_ID.toString(),
            RECOMMENDED: ber.RECOMMENDED,
            NOTE_FROM_BUYER: ber.NOTE_TO_SUPPLIER, // Provide a value or map it accordingly
            AWARDED: ber.AWARDED, // Provide a value or map it accordingly
            NOTE_TO_APPROVER: ber.NOTE_TO_APPROVER,
            USER_ID: quotationDataList[i].USER_ID.toString(),
            ORG_ID: orgIdInStore!, // Ensure ORG_ID is defined
            VENDOR_ID: quotationDataList[i].VENDOR_ID.toString(), // Ensure VENDOR_ID is defined
            VENDOR_SITE_ID: quotationDataList[i].VENDOR_SITE_ID.toString(),
            CS_LINE_ID: ber.CS_LINE_ID,
            AWARD_QUANTITY: ber.AWARD_QUANTITY,
          };
          console.log("con:", con);

          if (con.RECOMMENDED === "Y") {
            convertInLoop.push(con);
          }
        }
      }

      // console.log(items); //4 item created
      // console.log(items.length); //lenth 4

      // const converted: ConvertedItemForCsCreation[] = [];

      // for (let i = 0; i < items.length; i++) {
      //   const currentItem = items[i];

      //   const quotationData = quotationDataList[i];
      //   console.log("quotationData", quotationData);

      //   const convertedItem: ConvertedItemForCsCreation = {
      //     RFQ_ID: currentItem.RFQ_ID.toString(),
      //     RFQ_LINE_ID: currentItem.RFQ_LINE_ID.toString(),
      //     QUOT_LINE_ID: currentItem.QUOT_LINE_ID.toString(),
      //     RECOMMENDED: currentItem.RECOMMENDED,
      //     NOTE_FROM_BUYER: currentItem.NOTE_TO_SUPPLIER, // Provide a value or map it accordingly
      //     AWARDED: currentItem.AWARDED, // Provide a value or map it accordingly
      //     NOTE_TO_APPROVER: currentItem.NOTE_TO_APPROVER,
      //     USER_ID: currentItem.USER_ID.toString(),
      //     ORG_ID: orgIdInStore!, // Ensure ORG_ID is defined
      //     VENDOR_ID: quotationData.VENDOR_ID.toString(), // Ensure VENDOR_ID is defined
      //     VENDOR_SITE_ID: quotationData.VENDOR_SITE_ID.toString(),
      //   };
      //   converted.push(convertedItem);
      // }
      // console.log(converted);
      setConvertedItemsForCsCreationAndUpdateInStore(convertInLoop);

      // const items2: QuotationItem[] = quotationDataList.flatMap(
      //   (quotationData) => {
      //     return quotationData.Items;
      //   }
      // );

      // console.log(items2);
      // console.log(items2.length);

      setCsGeneralTermInStore(termText);

      setQuotationDataListInStore(quotationDataList);
      setSupplierListInStore(supplierList);
      setCsTitleInStore(csTitle);
      setCsNoteInStore(note);
      setCsPageNo(4);

      // Now 'convertedItems' contains the ConvertedItemForCsCreation objects.
    }
    // else if(){

    // }
    else {
      console.log(selectedItemList);

      console.log(selectedItemList.length);

      setConvertedItemsForCsCreationAndUpdateInStore(selectedItemList);
      setCsGeneralTermInStore(termText);

      setQuotationDataListInStore(quotationDataList);
      setSupplierListInStore(supplierList);
      setCsTitleInStore(csTitle);
      setCsNoteInStore(note);
      setCsPageNo(4);
    }
  };

  //context

  //usePrItemsStore

  //usePrItemsStore

  //useAuth
  const { token, userId, department } = useAuth();
  //useAuth

  //store
  //store

  useEffect(() => {
    if (orgId) {
      console.log(rfqLineIdListInStore);
      getItemWiseQuotations();
      getApproverHierachy();
      getSupplierList();
      // setTermText(csGeneralTermInStore!);
      console.log(csGeneralTermInStore);
    }
  }, [orgId]);

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
    try {
      setIsLoading(true);

      const result = await ItemWiseQuotationService(
        token!,
        rfqIdInCsCreationStore!,
        rfqLineIdListInStore!,
        orgId!,
        0,
        10000
      );
      console.log(result);

      if (result.data.status === 200) {
        console.log(result.data);

        setQuotationList(result.data);
        setQuotationListInStore(result.data);
        console.log(result.data.data.length);

        setQuotationDataList(result.data.data);
        setQuotationDataListInStore(result.data.data);
        setLoopLength(result.data.data[0].Items.length);
        console.log(result.data.data[0].Items.length);

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
    if (!currentItem.OFFERED_QUANTITY) {
      showErrorToast("You can not recommend this supplier");
    } else if (!currentItem.AWARD_QUANTITY) {
      showErrorToast("Please Give Award Quantity first");
    } else {
      const newQuotationDataList = [...quotationDataList];

      // Toggle the RECOMMENDED field
      const currentItem = newQuotationDataList[quotationIndex].Items[itemIndex];
      console.log(currentItem);

      currentItem.RECOMMENDED = currentItem.RECOMMENDED === "N" ? "Y" : "N";
      currentItem.AWARDED = currentItem.AWARDED === "N" ? "Y" : "N";

      console.log(
        newQuotationDataList[quotationIndex].Items[itemIndex].RFQ_LINE_ID
      );
      // console.log(newQuotationDataList[quotationIndex].Items[itemIndex]);
      console.log(newQuotationDataList[quotationIndex].Items[itemIndex]);

      // Update quotationDataList state
      setQuotationDataList(newQuotationDataList);
      console.log(currentItem.CS_LINE_ID);

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
        CS_LINE_ID: !currentItem.CS_LINE_ID ? null : currentItem.CS_LINE_ID,
        AWARD_QUANTITY: currentItem.AWARD_QUANTITY,
      };
      console.log(convertedItem.CS_LINE_ID);

      // Update selectedItemList state with the converted item
      // setSelectedItemList((prevItemList) => {
      //   const updatedList = [...prevItemList];
      //   updatedList[quotationIndex] = convertedItem;
      //   return updatedList;
      // });
      setSelectedItemList((prevItemList) => {
        // Check if the item is already in the list based on RFQ_LINE_ID or any unique identifier
        const existingItemIndex = prevItemList.findIndex(
          (item) => item.RFQ_LINE_ID === convertedItem.RFQ_LINE_ID
        );

        if (existingItemIndex !== -1) {
          // Replace the existing item
          const updatedList = [...prevItemList];
          updatedList[existingItemIndex] = convertedItem;
          return updatedList;
        } else {
          // Add the new item
          return [...prevItemList, convertedItem];
        }
      });
    }
  };

  // const handleRecommended = (quotationIndex: number, itemIndex: number) => {
  //   const newQuotationDataList = [...quotationDataList];

  //   // Check if any item in the same row is already selected
  //   const selectedInRow = newQuotationDataList.some((quotation, qIndex) => {
  //     return quotation.Items.some((item, iIndex) => {
  //       return (
  //         qIndex !== quotationIndex && // Exclude the current item
  //         iIndex === itemIndex && // Same row
  //         item.RECOMMENDED === "Y" // Check if any other item in the row is selected
  //       );
  //     });
  //   });

  //   // If an item is already selected in the same row, prevent further selection
  //   if (selectedInRow) {
  //     showErrorToast(
  //       "Please Unselect first to select another supplier's same Item"
  //     );
  //     return;
  //   }

  //   // Toggle the RECOMMENDED and AWARDED fields for the current item
  //   const currentItem = newQuotationDataList[quotationIndex].Items[itemIndex];
  //   currentItem.RECOMMENDED = currentItem.RECOMMENDED === "N" ? "Y" : "N";
  //   currentItem.AWARDED = currentItem.AWARDED === "N" ? "Y" : "N";

  //   // Update quotationDataList state
  //   setQuotationDataList(newQuotationDataList);

  //   // Convert the item to ConvertedItemForCsCreation
  //   const convertedItem: ConvertedItemForCsCreation = {
  //     RFQ_ID: currentItem.RFQ_ID.toString(),
  //     RFQ_LINE_ID: currentItem.RFQ_LINE_ID.toString(),
  //     QUOT_LINE_ID: currentItem.QUOT_LINE_ID.toString(),
  //     RECOMMENDED: currentItem.RECOMMENDED,
  //     NOTE_FROM_BUYER: currentItem.NOTE_TO_SUPPLIER,
  //     AWARDED: currentItem.AWARDED,
  //     NOTE_TO_APPROVER: currentItem.NOTE_TO_APPROVER,
  //     USER_ID: newQuotationDataList[quotationIndex].USER_ID.toString(),
  //     ORG_ID: orgIdInStore!,
  //     VENDOR_ID: newQuotationDataList[quotationIndex].VENDOR_ID.toString(),
  //     VENDOR_SITE_ID:
  //       newQuotationDataList[quotationIndex].VENDOR_SITE_ID.toString(),
  //     CS_LINE_ID: currentItem.CS_LINE_ID,
  //   };

  //   // Update selectedItemList state with the converted item
  //   setSelectedItemList((prevItemList) => {
  //     const existingItemIndex = prevItemList.findIndex(
  //       (item) => item.RFQ_LINE_ID === convertedItem.RFQ_LINE_ID
  //     );

  //     if (existingItemIndex !== -1) {
  //       const updatedList = [...prevItemList];
  //       updatedList[existingItemIndex] = convertedItem;
  //       return updatedList;
  //     } else {
  //       return [...prevItemList, convertedItem];
  //     }
  //   });
  // };

  const remarksRefs = useRef<HTMLInputElement[]>([]);

  const [remarksList, setRemarksList] = useState<string[] | []>([]);

  // const handleRemarksChange = (
  //   quotationIndex: number,
  //   itemIndex: number,
  //   value: string
  // ) => {
  //   const newQuotationDataList = [...quotationDataList];

  //   // Toggle the RECOMMENDED field
  //   const currentItem = newQuotationDataList[quotationIndex].Items[itemIndex];
  //   console.log(currentItem);

  //   currentItem.NOTE_TO_APPROVER = value;

  //   setQuotationDataList(newQuotationDataList);
  // };

  const handleRemarksChange = (
    quotationIndex: number,
    itemIndex: number,
    value: string
  ) => {
    const newQuotationDataList = [...quotationDataList];

    // Toggle the RECOMMENDED field
    const currentItem = newQuotationDataList[quotationIndex].Items[itemIndex];
    console.log(currentItem);

    currentItem.NOTE_TO_APPROVER = value;
    setQuotationDataList(newQuotationDataList);

    const find = selectedItemList.find(
      (item: ConvertedItemForCsCreation) =>
        item.RFQ_LINE_ID === currentItem.RFQ_LINE_ID.toString() &&
        item.RFQ_ID === currentItem.RFQ_ID.toString() &&
        item.QUOT_LINE_ID === currentItem.QUOT_LINE_ID.toString()
    );

    if (find) {
      const newFind = { ...find }; // Create a shallow copy to avoid mutating the original object
      newFind.NOTE_TO_APPROVER = value;
      setSelectedItemList((prevList) =>
        prevList.map((item) =>
          item.RFQ_LINE_ID === newFind.RFQ_LINE_ID &&
          item.RFQ_ID === newFind.RFQ_ID &&
          item.QUOT_LINE_ID === newFind.QUOT_LINE_ID
            ? newFind
            : item
        )
      );
    } else {
    }
  };

  useEffect(() => {
    setRemarks();
  }, [quotationDataList]);

  const setRemarks = () => {
    if (quotationDataList) {
      const newRemarks = quotationDataList.flatMap((quotation) =>
        quotation.Items.map((item) => item.NOTE_TO_APPROVER || "")
      );
      setRemarksList(newRemarks);
      if (remarksRefs.current) {
        remarksRefs.current = newRemarks.map((spec, index) => {
          return (
            remarksRefs.current[index] || React.createRef<HTMLInputElement>()
          );
        });
      }

      const newAwardOty = quotationDataList.flatMap((quotation) =>
        quotation.Items.map((item) => item.AWARD_QUANTITY || "")
      );

      setAwardOtyList(newAwardOty);

      if (awardRefs.current) {
        awardRefs.current = newAwardOty.map((spec, index) => {
          return (
            awardRefs.current[index] || React.createRef<HTMLInputElement>()
          );
        });
      }
    }
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

  const [hierarchyUserProfilePicturePath, setHierarchyUserProfilePicturePath] =
    useState<string>("");
  const [hierarchyList, setHierarchyList] = useState<HierarchyInterface[] | []>(
    []
  );

  const openModalForHierarchy = () => {
    const modal = document.getElementById("my_modal_12") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };
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
        rfqIdInCsCreationStore!
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

  // useEffect(() => {
  //   let s: number = 0;
  //   const itemList = [];

  //   for (let i = 0; i < quotationDataList.length; i++) {
  //     for (let j = 0; j < quotationDataList[i].Items.length; j++) {
  //       const ber = quotationDataList[i].Items[j];

  //       if (ber.RECOMMENDED === "Y") {
  //         itemList.push(ber);
  //       }
  //     }
  //   }

  //   for (let i = 0; i < itemList.length; i++) {
  //     s +=
  //       (parseFloat(itemList[i].AWARD_QUANTITY) || 0) *
  //       (parseFloat(itemList[i].UNIT_PRICE) || 0);
  //   }

  //   setTotalAmount(s.toString());
  // }, [quotationDataList]); // This effect will run whenever `quotationDataList` changes

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
    console.log("rfqId: ", rfqIdInCsCreationStore);
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
          rfqIdInCsCreationStore,
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

  const awardRefs = useRef<HTMLInputElement[]>([]);

  const [awardOtyList, setAwardOtyList] = useState<string[] | []>([]);

  const handleAwardOtyChange = (
    quotationIndex: number,
    itemIndex: number,
    value: string
  ) => {
    const newQuotationDataList = [...quotationDataList];

    // Get the current item
    const currentItem = newQuotationDataList[quotationIndex].Items[itemIndex];
    let val: number = parseFloat(value) || 0;

    // Update the AWARD_QUANTITY for the current item before summing
    if (val <= parseFloat(currentItem.OFFERED_QUANTITY)) {
      currentItem.AWARD_QUANTITY = val.toString();
    } else {
      currentItem.AWARD_QUANTITY = "";
      showErrorToast("Award Qty cannot be greater than offer Qty");
      setQuotationDataList(newQuotationDataList);
      return; // Exit early if invalid quantity
    }

    // Now, sum the AWARD_QUANTITY for this specific item across all quotations
    let sumOfAwardQty = 0;
    newQuotationDataList.forEach((quotation) => {
      const matchingItem = quotation.Items.find(
        (item) => item.RFQ_LINE_ID === currentItem.RFQ_LINE_ID
      );
      if (matchingItem) {
        sumOfAwardQty += parseFloat(matchingItem.AWARD_QUANTITY) || 0;
      }
    });

    console.log("Total Sum of Award Quantity:", sumOfAwardQty);

    // Check if the sum of AWARD_QUANTITY exceeds EXPECTED_QUANTITY
    if (sumOfAwardQty <= currentItem.EXPECTED_QUANTITY) {
      setQuotationDataList(newQuotationDataList);
    } else {
      currentItem.AWARD_QUANTITY = "";
      showErrorToast("Award Qty sum cannot be greater than expected Qty");
      setQuotationDataList(newQuotationDataList);
    }
  };

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

  const noteRef = useRef<HTMLInputElement | null>(null);

  const [note, setNote] = useState<string>("");
  const handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNote(event.target.value);
  };

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
          {/* <div>
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
                  {"N/A"}
                </p>
              </div>
            </div>
            <div className="w-full h-[1px] bg-borderColor"></div>
          </div> */}
          <div>
            <div className=" flex flex-row  items-center">
              <div className=" h-10 w-44 bg-offWhiteColor flex justify-start pl-4 items-center">
                <p className=" text-sm text-blackColor font-mon">Comments</p>
              </div>
              <div className=" h-10 w-[1px] bg-borderColor"></div>
              <div className="w-2"></div>
              <div className=" h-10 flex-1 bg-whiteColor flex justify-start items-center">
                <p className=" text-sm text-blackColor font-mon text-start">
                  <input
                    type="text"
                    className=" w-full h-full border-none focus:outline-none"
                    placeholder="Enter CS Comment"
                    ref={noteRef}
                    onChange={handleNoteChange}
                  />
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
                            <div className="w-56 h-10 flex justify-center items-center bg-green-100 ">
                              <CommonInputField
                                disable={
                                  rfqTypeInCsCreationStore === "T"
                                    ? true
                                    : false
                                }
                                type="text"
                                width="w-[220px]"
                                hint="Enter award qty"
                                maxCharacterlength={150}
                                onChangeData={(value) =>
                                  handleAwardOtyChange(quotationIndex, i, value)
                                }
                                inputRef={{
                                  current: awardRefs.current[i],
                                }}
                                value={
                                  awardOtyList[
                                    quotationIndex *
                                      quotationDataList[quotationIndex].Items
                                        .length +
                                      i
                                  ] || ""
                                }
                              />
                            </div>

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
                            {/* <div className="h-[1px] border border-borderColor"></div> */}
                            <div className="w-56 h-10 flex justify-center items-center bg-green-100 ">
                              <CommonInputField
                                disable={
                                  rfqTypeInCsCreationStore === "T"
                                    ? true
                                    : false
                                }
                                type="text"
                                width="w-[220px]"
                                hint="Enter remarks"
                                maxCharacterlength={150}
                                onChangeData={(value) =>
                                  handleRemarksChange(quotationIndex, i, value)
                                }
                                inputRef={{
                                  current: remarksRefs.current[i],
                                }}
                                value={
                                  remarksList[
                                    quotationIndex *
                                      quotationDataList[quotationIndex].Items
                                        .length +
                                      i
                                  ] || ""
                                }
                              />
                            </div>
                            {/* <div className="h-[1px] border border-borderColor"></div> */}
                            <div className="w-56 h-10 flex justify-center items-center bg-green-100 ">
                              <button
                                disabled={
                                  rfqTypeInCsCreationStore === "T"
                                    ? true
                                    : false
                                }
                                onClick={() => {
                                  handleRecommended(quotationIndex, i);
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
          onClick={back}
          titleText={"Previous"}
          width="w-28"
          color="bg-graishColor"
        />

        {csStatusInStore === "SAVE" && (
          <CommonButton
            onClick={rfiInfo}
            titleText={"Request for Information"}
            width="w-48"
            height="h-8"
            color=" bg-midBlack "
          />
        )}

        <CommonButton
          onClick={nextPage}
          titleText={"Preview"}
          width="w-28"
          color="bg-midGreen"
        />
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
            <CommonButton onClick={cancel} titleText={"Cancel"} width="w-28" />
            <CommonButton
              onClick={save}
              titleText={"Save"}
              width="w-28"
              color="bg-midGreen"
            />
          </div>
          <div className=" h-12"></div>
        </div>
      </div>

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

      {/* rfi Modal start for cs */}
      <Modal
        icon={<CloudArrowUp size={28} color="#1B4DFF" />}
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
