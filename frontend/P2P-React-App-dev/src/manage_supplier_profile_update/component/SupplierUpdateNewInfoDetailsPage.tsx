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
import ProfileUpdateData from "../interface/ProfileUpdateDataInterface";
import ProfileUpdateDataInterface from "../interface/ProfileUpdateDataInterface";
import SupplierProfileUpdateDetailsService from "../service/SupplierProfileUpdateDetailsService";
import CommonButton from "../../common_component/CommonButton";
import CheckIcon from "../../icons/CheckIcon";

import ProfileUpdateApproveRejectService from "../service/approve-reject/ProfileUpdateApproveRejectService";

import {
  columnNameDescriptionLookup,
  getDescription,
} from "../utils/ColumnDescriptionLookup";
import BasicInfoViewForApprovalPage from "../../manage_supplier/component/basic_info/BasicInfoViewForApprovalPage";
import { DocumentApprovalViewProvider } from "../../manage_supplier/interface/document/DocumentApprovalViewContext";
import DocumentHomeApprovalPage from "../../manage_supplier/component/document/DocumentHomeApprovalPage";
import DeclarationViewforApprovalPage from "../../manage_supplier/component/declaration/DeclarationViewforApprovalPage";
import { ContactViewApprovalProvider } from "../../manage_supplier/interface/contact/ContactApprovalViewContext";
import RfiContactHomeApprovalViewPage from "../../rfi_in_supplier_registration/contact/RfiContactHomeApprovalViewPage";
import { SiteApprovalViewProvider } from "../../manage_supplier/interface/contact/SiteApprovalViewContext";
import SiteHomeForApproval from "../../manage_supplier/component/site/SiteHomeForApproval";
import { BankViewApprovalProvider } from "../../manage_supplier/interface/bank/BankViewApprovalContext";
import BankHomeViewForApprovalPage from "../../manage_supplier/component/bank/BankHomeViewForApprovalPage";
import SetupFromBuyerPage from "../../manage_supplier/component/setup_from_buyer/SetupFromBuyerPage";
import ContactHomeForApprovalView from "../../manage_supplier/component/contact/ContactHomeForApprovalView";
import useProfileUpdateStore from "../store/profileUpdateStore";
import SupplierProfileInfoDetailsService from "../service/SupplierProfileInfoDetailsService";
import SupplierNewValueAddAprrovalService from "../service/SupplierNewValueAddAprrovalService";
import InputLebel from "../../common_component/InputLebel";
import ProfileNewInfoUpdateHierarchyService from "../service/ProfileNewInfoUpdateHierarchyService";
import { Modal, Button, Textarea } from "keep-react";
import { CloudArrowUp } from "phosphor-react";
import ApproverInterface from "../../approval_setup/interface/ApproverInterface";
import EmployeeListService from "../../approval_setup/service/EmployeeListService";
import RfiAddUpdateService from "../service/rfi/RfiAddUpdateService";
import ValidationError from "../../Alerts_Component/ValidationError";
import SearchIcon from "../../icons/SearchIcon";
import UserCircleIcon from "../../icons/userCircleIcon";
import isoToDateTime from "../../utils/methods/isoToDateTime";
import RfiSupplierListService from "../../rfi_in_supplier_registration/service/RfiSupplierListService";
import RfiSupplierInterface from "../../rfi_in_supplier_registration/interface/RfiSupplierInterface";
import fetchFileUrlService from "../../common_service/fetchFileUrlService";

// const pan = ["Home", "Update Details"];

const buttonList = [
  {
    id: 100,
    name: "Basic Information",
  },
  {
    id: 110,
    name: "Documents",
  },
  {
    id: 120,
    name: "Declaration",
  },
  {
    id: 130,
    name: "Contact",
  },

  {
    id: 150,
    name: "Bank Details",
  },
  {
    id: 140,
    name: "Site",
  },
  // {
  //   name: `Buyer's Selection`,
  //   id: 160,
  // },
];

export default function SupplierUpdateNewInfoDetailspage() {
  const { token, supplierId, userId } = useAuth();

  // function getDescription(name: string): string {
  //   // Convert name to lowercase for case-insensitive matching
  //   name = name.toLowerCase();

  //   // Check if the name exists in the lookup table
  //   if (name in columnNameDescriptionLookup) {
  //     return columnNameDescriptionLookup[name];
  //   } else {
  //     return `Description not found for ${name}`;
  //   }
  // }

  useEffect(() => {
    // getApproverHierachy();
    setIsBuyerSelectionDisable(true);
    console.log("id: ", supplierIdInStore);
  }, []);

  //hierarchy

  const [hierarchLoading, setHierarchyLoading] = useState<boolean>(false);

  const [hierarchyUserProfilePicturePath, setHierarchyUserProfilePicturePath] =
    useState<string>("");
  const [hierarchyList, setHierarchyList] = useState<HierarchyInterface[] | []>(
    []
  );

  const [hierarchNewInfoLoading, setHierarchyNewInfoLoading] =
    useState<boolean>(false);
  const [hierarchyNewInfoList, setHierarchyNewInfoList] = useState<
    HierarchyInterface[] | []
  >([]);

  useEffect(() => {
    getApproverHierachy();
    console.log("newInfo: ", profileNewInfoUidInStore);
    if (profileNewInfoUidInStore) {
      getApproveHierarchyNewInfo();
    }
  }, []);

  const getApproverHierachy = async () => {
    // const decodedToken = decodeJWT(token!);

    // Extract USER_ID from the decoded payload
    // const userId = decodedToken?.decodedPayload?.USER_ID;
    try {
      setHierarchyLoading(true);
      const result = await HierachyListByModuleService(
        token!,
        supplierId!,
        "Profile Update"
      );
      console.log(result);

      if (result.data.status === 200) {
        setHierarchyLoading(false);
        setHierarchyUserProfilePicturePath(result.data.profile_pic);
        setHierarchyList(result.data.data);
      } else {
        setHierarchyLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setHierarchyLoading(false);
      showErrorToast("Something went wrong");
    }
  };

  const getApproveHierarchyNewInfo = async () => {
    try {
      setHierarchyNewInfoLoading(true);
      const result = await ProfileNewInfoUpdateHierarchyService(
        token!,
        supplierId!,
        "Profile Update",
        profileNewInfoUidInStore!
      );

      console.log("newInfo: ", result);
      if (result.data.status === 200) {
        setHierarchyNewInfoLoading(false);
        setHierarchyUserProfilePicturePath(result.data.profile_pic);
        // setHierarchyNewInfoList(result.data.data);

        let fetchedHierarchyList = result.data.data;

        if (updateListInStore) {
          const initiatorStatus = {
            // APPROVER_ID: updateListInStore.INITIATOR_ID,
            STAGE_LEVEL: updateListInStore.STAGE_LEVEL,  // Use the same stage level from the updateList
            APPROVER_FULL_NAME: updateListInStore.INITIATOR_STATUS?.FULL_NAME,
            ACTION_CODE: updateListInStore.INITIATOR_STATUS?.ACTION_CODE,
            ACTION_DATE: updateListInStore.INITIATOR_STATUS?.ACTION_DATE,
            ACTION_NOTE: updateListInStore.INITIATOR_STATUS?.NOTE,
          };
  
          // Add initiator to first index
          fetchedHierarchyList.unshift(initiatorStatus);
        }

        // Add initiatorStatus to the beginning of the hierarchyList
        // fetchedHierarchyList.unshift(initiatorStatus);

        // Update the state with the updated hierarchyList
        setHierarchyNewInfoList(fetchedHierarchyList);

        // Optionally log the updated list
        console.log("Updated hierarchyList: ", fetchedHierarchyList);
      } else {
        setHierarchyNewInfoLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setHierarchyNewInfoLoading(false);
      showErrorToast("Something went wrong");
    }
  };

  const [stageId, setStageId] = useState<number | null>(null);
  const [stageLevel, setStageLevel] = useState<number | null>(null);

  const [selectedHierarch, setSelectedHierarchy] =
    useState<HierarchyInterface | null>(null);

  const setHierarchy = () => {
    if (userId && hierarchyList) {
      const selectedHierarch = hierarchyList.find(
        (hierarchy) => hierarchy.APPROVER_ID === userId
      );
      setSelectedHierarchy(selectedHierarch || null);
    }
  };

  useEffect(() => {
    if (hierarchyList) {
      // setHierarchy();
      console.log("set selected");
    }
  }, [hierarchyList]);

  useEffect(() => {
    getUpdateDetails();
    if (selectedHierarch) {
      console.log("set hie");
      setStageId(selectedHierarch.STAGE_ID || null);
      setStageLevel(selectedHierarch.STAGE_LEVEL || null);
    }
  }, [selectedHierarch]);

  //   useEffect(()=>{
  //     if(stageId && stageLevel){

  //     }
  //   },[])

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [updatedList, setUpdatedList] = useState<
    ProfileUpdateDataInterface[] | []
  >([]);
  const [selectedUpdatedList, setSelectedUpdatedList] = useState<
    ProfileUpdateDataInterface[] | []
  >([]);

  const [isSelectAll, setIsSelectAll] = useState<boolean>(false);

  const selectAll = () => {
    setIsSelectAll(true);
    setSelectedUpdatedList([...selectedUpdatedList, ...updatedList]);
  };

  const unselectAll = () => {
    setIsSelectAll(false);
    setSelectedUpdatedList([]);
  };
  const toggleFieldSelection = (field: ProfileUpdateDataInterface) => {
    setSelectedUpdatedList((prevSelected) => {
      const isSelected = prevSelected.some(
        (fld) => fld.ACTION_ID === field.ACTION_ID
      );

      if (isSelected) {
        // If the field is already selected, remove it from the selection
        return prevSelected.filter((fld) => fld.ACTION_ID !== field.ACTION_ID);
      } else {
        // If the field is not selected, add it to the selection
        return [...prevSelected, field];
      }
    });
  };

  //   const toggleFieldSelection = (field: ProfileUpdateDataInterface) => {
  //     setSelectedUpdatedList((prevSelected)=>{
  //         const isFieldSelcted=prevSelected.some((fld)=>fld.SUPPLIER_ID===field.SUPPLIER_ID);
  //         if(isFieldSelcted){
  //             return prevSelected.filter((fld)=>fld.SUPPLIER_ID !==field.SUPPLIER_ID);
  //         }
  //         else{
  //             return [...prevSelected, field];
  //         }
  //     })
  // };

  // const getUpdateDetails = async (stageId: number, stageLevel: number) => {
  //   setIsLoading(true);
  //   try {
  //     const result = await SupplierProfileUpdateDetailsService(
  //       token!,
  //       stageId!,
  //       stageLevel!,
  //       supplierId!,
  //       "IN PROCESS"
  //     );
  //     console.log(result.data);

  //     if (result.data.status === 200) {
  //       console.log(result.data.data.length);

  //       setUpdatedList(result.data.data);
  //       console.log("update data: ", result.data.data)
  //       setIsLoading(false);
  //     } else {
  //       setIsLoading(false);
  //       showErrorToast(result.data.message);
  //     }
  //   } catch (error) {
  //     setIsLoading(false);
  //     showErrorToast("Something went wrong");
  //   }
  // };

  const getUpdateDetails = async () => {
    setIsLoading(true);
    try {
      const result = await SupplierProfileInfoDetailsService(
        token!,
        supplierIdInStore!,
        "IN PROCESS"
      );
      console.log(result.data);

      if (result.data.status === 200) {
        console.log(result.data.data.length);
        // setBankChequePath(result.data.bank_cheque);
        // setNidPassportPath(result.data.);
        setBankChequePathInStore(result.data.bank_cheque);
        setNidPassportPathInStore(result.data.nid_passport);
        setSinaturePathInStore(result.data.signature_file);
        setEtinPathInStore(result.data.etin_file);
        setUpdatedList(result.data.data);
        setSelectedUpdatedList(result.data.data);
        console.log("update data: ", result.data.data);
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

  const { setManageSupplierProfileUpdatePageNo } =
    useManageSupplierProfileUpdateContext();

  const back = () => {
    setIsBuyerSelectionDisable(false);
    setSupplierIdInStore(null);
    setManageSupplierProfileUpdatePageNo(1);
  };

  //hierarchy

  //validation

  //  {loginError.email && <ValidationError title={loginError.email} />}

  //  const approve=async()=>{
  //   console.log(supplierId);
  //   console.log(selectedUpdatedList.length);

  //   let result;
  //   for(let i=0;selectedUpdatedList.length;i++){
  //     let level=selectedUpdatedList[i].PROFILE_UPDATE_TEMPLATE_STAGE_LEVEL;
  //      result=await ProfileUpdateApproveRejectService(token!,"SUBMIT","IN PROCESS",0,0,supplierId,stageId,approveValue,level,selectedUpdatedList[i].ACTION_ID);
  //      console.log(selectedUpdatedList[i].PROFILE_UPDATE_TEMPLATE_STAGE_LEVEL);

  //      console.log(result.data);

  //   }

  //   showSuccessToast(result?.data.message);

  //  }

  //   const approve = async () => {
  //     if (validateApprove()) {
  //       console.log(supplierId);
  //       console.log(selectedUpdatedList.length);
  //       setApproveModal(false);

  //       let result;

  //       for (let i = 0; i < selectedUpdatedList.length; i++) {
  //         if (
  //           selectedUpdatedList[i] &&
  //           selectedUpdatedList[i].PROFILE_UPDATE_TEMPLATE_STAGE_LEVEL
  //         ) {
  //           let level =
  //             selectedUpdatedList[i].PROFILE_UPDATE_TEMPLATE_STAGE_LEVEL;

  //           // result = await ProfileUpdateApproveRejectService(
  //           //   token!,
  //           //   "SUBMIT",
  //           //   "IN PROCESS",
  //           //   0,
  //           //   1,
  //           //   supplierId,
  //           //   stageId,
  //           //   approveValue,
  //           //   level,
  //           //   selectedUpdatedList[i].ACTION_ID
  //           // );
  //           // // console.log(selectedUpdatedList[i].PROFILE_UPDATE_TEMPLATE_STAGE_LEVEL);
  //           // console.log(result.data.message);
  //           // console.log(result.data);
  //         }
  //       }

  //       showSuccessToast("Submitted Successfully");
  //       back();
  //     }
  //   };

  //approve modal

  //supplier profile show
  const [selectedButton, setSelectedButton] = useState<number>(100);
  const [page, setPage] = useState<number>(100);

  const {
    setIsBuyerSelectionDisable,
    setBankItem,
    supplierIdInStore,
    stageIdInStore,
    setSupplierIdInStore,
    stageLevelInStore,
    setStageIdInStore,
    setStageLevelInStore,
    setBankChequePathInStore,
    setNidPassportPathInStore,
    setSinaturePathInStore,
    setEtinPathInStore,
    profileNewInfoUidInStore,
    setSiteIdInStore,
    setIsInitiatorInStore,
    isInitiatorInStore,
    updateListInStore
  } = useProfileUpdateStore();

  const handleButton = (buttonId: number) => {
    setSelectedButton(buttonId);
    setPage(buttonId);
  };

  //supplier profile show

  // const { setBankItem } = useProfileUpdateStore
  const navigateTo = (bankId: number, siteId: number, supId: number) => {
    const clickedItem = updatedList.find((item) => item.ACTION_ID === bankId);

    console.log("siteId: ", siteId, supId);

    setSiteIdInStore(siteId);
    setSupplierIdInStore(supId);

    if (clickedItem) {
      console.log("item: ", clickedItem);
      setBankItem(clickedItem);
    }

    setManageSupplierProfileUpdatePageNo(4);
  };

  // approve deny
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

    console.log("Current approval note:", inputValue);
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
  const [approveError, setApproveError] = useState<{ note?: string }>({});
  const [rejectError, setRejectError] = useState<{ note?: string }>({});
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

    setApproveError(errors);

    return Object.keys(errors).length === 0;
  };

  //validation

  //setManageSupplierProfileUpdatePageNo

  const approve = async () => {
    if (validateApprove()) {
      try {
        onCLickApprove();

        console.log("approval Note: ", approveValue);

        if (updatedList && updatedList.length > 0) {
          for (const item of updatedList) {
            const result = await SupplierNewValueAddAprrovalService(
              token!,
              1,
              supplierIdInStore!,
              stageIdInStore!,
              stageLevelInStore!,
              item.PK_COLUMN_VALUE,
              item.TABLE_NAME,
              approveValue,
              profileNewInfoUidInStore!,
              item.ACTION_ID,
              isInitiatorInStore
            );
            console.log(result);
          }

          setSupplierIdInStore(null);
          setStageIdInStore(null);
          setStageLevelInStore(null);
          setBankItem(null);

          showSuccessToast("Approved Successfully");
          setManageSupplierProfileUpdatePageNo(1);
        } else {
          throw new Error("No data in updatedList");
        }
      } catch (error) {
        showErrorToast("Approve Failed");
      }
    }
  };

  const deny = async () => {
    if (validateReject()) {
      onCLickReject();
      try {
        onCLickApprove();
        
        console.log("reject Note: ", rejectValue);

        if (updatedList && updatedList.length > 0) {
          for (const item of updatedList) {
            const result = await SupplierNewValueAddAprrovalService(
              token!,
              0,
              supplierIdInStore!,
              stageIdInStore!,
              stageLevelInStore!,
              item?.PK_COLUMN_VALUE!,
              item?.TABLE_NAME!,
              rejectValue,
              profileNewInfoUidInStore!,
              item?.ACTION_ID,
              isInitiatorInStore
            );
            console.log(result);
          }

          setSupplierIdInStore(null);
          setStageIdInStore(null);
          setStageLevelInStore(null);
          setBankItem(null);

          showSuccessToast("Rejected Successfully");
          setManageSupplierProfileUpdatePageNo(1);
        } else {
          throw new Error("No data in updatedList");
        }
      } catch (error) {
        showErrorToast("Reject Failed");
      }
    }
  };

  // request for information start (rfi)
  const [rfqInfoModal, setRfqInfoModal] = useState<boolean>(false);

  const [viewerId, setViewerId] = useState<number | null>(null);
  const [selectedAsId, setSelectedAsId] = useState<number | null>(null);
  // const [approveValue, setApproveValue] = useState<string>("");
  //modal rfi
  const [approverList, setApproverList] = useState<ApproverInterface[] | []>(
    []
  );
  const [approverList2, setApproverList2] = useState<ApproverInterface[] | []>(
    []
  );
  const [additionalValue, setAdditionalValue] = useState<string>("");
  const [isApproverLoading, setIsApproverLoading] = useState(false);
  const [rfiError, setRfiError] = useState<{
    rfiNote?: string;
    viewer?: string;
  }>({});

  useEffect(() => {
    getApproverList();
  }, []);

  const openRfiModal = () => {
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
      showErrorToast("Something went wrong");
    }
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
          supplierIdInStore,
          "NEW_INFO",
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
          // setRfqIdInStore(null);
          setPage(1);
        } else {
          showErrorToast(result.data.message);
        }
      } catch (error) {
        showErrorToast("Something went wrong");
      }
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
    console.log("supId, ", supplierIdInStore);

    try {
      const result = await RfiSupplierListService(
        token!,
        userId,
        null,
        null,
        supplierIdInStore
      );
      console.log(result.data);

      if (result.data.status === 200) {
        console.log(result.data.data);
        setPropicPath(result.data.PROFILE_PIC);

        const csData = result.data.data.filter(
          (item: RfiSupplierInterface) => item.OBJECT_TYPE === "NEW_INFO"
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
    <div className=" m-8">
      <SuccessToast />
      <div className=" w-full flex justify-between items-center mb-4">
        <PageTitle titleText="Supplier Updated Data" />
        <CommonButton
          titleText="Back"
          width="w-24"
          color="bg-midGreen"
          onClick={back}
        />
      </div>
      {isLoading ? (
        <div className=" w-full flex justify-center items-center ">
          <LogoLoading />
        </div>
      ) : (
        <>
          {!isLoading && updatedList.length === 0 ? (
            <div className=" w-full h-40 flex justify-center items-center">
              <p className=" text-sm font-mon font-bold text-black">
                No Data Found
              </p>
            </div>
          ) : (
            <div className="overflow-auto max-h-[400px] rounded-lg shadow-lg custom-scrollbar">
              <table className="min-w-full divide-y divide-gray-200 rounded-lg">
                <thead className="bg-[#CAF4FF] sticky top-0 ">
                  <tr>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      Label Name
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      Name
                    </th>
                  </tr>
                </thead>

                {updatedList.map((e, i) => (
                  <tbody
                    onClick={() => {
                      navigateTo(
                        e.ACTION_ID,
                        e.TABLE_DATA.ID,
                        e.TABLE_DATA.USER_ID
                      );
                    }}
                    className="bg-white divide-y divide-gray-200 cursor-pointer"
                  >
                    <tr>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {e.TABLE_NAME === "XXP2P_SUPPLIER_BANK"
                            ? "New bank info added"
                            : e.TABLE_NAME ===
                              "XXP2P_SUPPLIER_CONTACT_PERSON_DTLS"
                            ? "New contact info added"
                            : e.TABLE_NAME === "XXP2P_SUPPLIER_SITE"
                            ? "New site info added"
                            : null}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar ">
                        <div className="w-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                          {e.TABLE_NAME === "XXP2P_SUPPLIER_BANK"
                            ? e.TABLE_DATA.BANK_NAME
                            : e.TABLE_NAME ===
                              "XXP2P_SUPPLIER_CONTACT_PERSON_DTLS"
                            ? e.TABLE_DATA.NAME
                            : e.TABLE_NAME === "XXP2P_SUPPLIER_SITE"
                            ? e.TABLE_DATA.ADDRESS_LINE1
                            : null}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                ))}

                <tfoot className="bg-white sticky bottom-0">
                  <tr>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* approve modal */}
          <div className=" w-full flex justify-end space-x-4 my-4">
            <CommonButton
              onClick={openRfiModal}
              titleText={"Request for Information"}
              width="w-48"
              height="h-8"
              color=" bg-midBlack "
            />

            <button onClick={onCLickReject} className=" denyButton w-36">
              Deny
            </button>

            <CommonButton
              titleText="Approve"
              width="w-36"
              onClick={onCLickApprove}
              color="bg-midGreen"
            />
          </div>

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
                          {e.VIEW_DATE === ""
                            ? "---"
                            : isoToDateTime(e.VIEW_DATE)}
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
                onClick={approve}
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
                onClick={deny}
              >
                Confirm
              </Button>
            </Modal.Footer>
          </Modal>
          {/* reject modal */}
          <div className="h-2"></div>
          <div className="w-full   flex justify-center items-center  ring-1 ring-borderColor bg-gray-50">
            <table className="w-full  px-16  ">
              <thead className="   ">
                <tr className=" w-full h-12 bg-lightGreen rounded-t-md">
                  <th className="mediumText ">Sequence</th>
                  <th className="mediumText ">Performed By</th>
                  <th className="mediumText ">Action</th>

                  {hierarchyNewInfoList.some(
                    (item) => item.ACTION_CODE !== "3"
                  ) && (
                    <>
                      <th className="font-semibold">Date</th>
                      <th className="font-semibold">Remarks</th>
                    </>
                  )}

                  {/* <th className="mediumText ">Date</th>
                  <th className="mediumText ">Remarks</th> */}
                </tr>
              </thead>

              {hierarchyNewInfoList.map((item, index) => (
                <tbody>
                  <tr
                    key={item.APPROVER_ID}
                    className={`text-center h-12 ${
                      index !== 0
                        ? "border-t border-borderColor h-[0.1px] "
                        : ""
                    }`}
                  >
                    <td className="smallText h-12">{index + 1}</td>
                    <td className="smallText h-12">
                      {item.APPROVER_FULL_NAME}
                    </td>

                    <td className="font-mon text-sm   font-semibold h-12">
                      {item.ACTION_CODE.toString() === "0" ? (
                        <p className=" text-sm font-mon text-redColor">
                          Rejected
                        </p>
                      ) : item.ACTION_CODE.toString() === "1" ? (
                        <p className=" text-sm font-mon text-midGreen">
                          Approved
                        </p>
                      ) : (
                        <p className=" text-sm font-mon  text-yellow-500">
                          Pending
                        </p>
                      )}
                    </td>
                    {item.ACTION_CODE.toString() !== "3" && (
                      <>
                        <td className="smallText h-12">
                          {item.ACTION_DATE !== "N/A"
                            ? item.ACTION_DATE
                            : "N/A"}
                        </td>
                        <td className="smallText h-12">
                          {item.ACTION_NOTE !== "N/A"
                            ? item.ACTION_NOTE
                            : "N/A"}
                        </td>
                      </>
                    )}

                    {/* <td className="smallText h-14">
                      {item.ACTION_DATE !== "N/A" ? item.ACTION_DATE : "N/A"}
                    </td>
                    <td className="smallText h-14">
                      {item.ACTION_NOTE !== "N/A" ? item.ACTION_NOTE : "N/A"}
                    </td> */}
                  </tr>
                </tbody>
              ))}
            </table>
          </div>

          <div className=" mt-4">
            <InputLebel titleText={"Supplier Profile"} />
          </div>

          <div className=" my-4">
            <div className=" w-full overflow-x-auto flex space-x-4  py-1 px-[1px]">
              {buttonList.map((btn, i) => (
                <button
                  onClick={() => {
                    handleButton(btn.id);
                  }}
                  key={btn.id}
                  className={`w-40 h-10 flex justify-center items-center text-midBlack  rounded-[4px] font-mon font-medium text-sm  ${
                    selectedButton === btn.id
                      ? " bg-midBlue text-whiteColor"
                      : " ring-[1px] ring-borderColor bg-inputBg"
                  }`}
                >
                  {btn.name}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full  border-[1px] ring-[#424242] px-4 py-4 rounded-md">
            {(() => {
              switch (page) {
                case 100:
                  return <BasicInfoViewForApprovalPage />;
                case 110:
                  return (
                    <DocumentApprovalViewProvider>
                      <DocumentHomeApprovalPage />
                    </DocumentApprovalViewProvider>
                  );
                case 120:
                  return <DeclarationViewforApprovalPage />;

                case 130:
                  return (
                    <ContactViewApprovalProvider>
                      <ContactHomeForApprovalView />
                    </ContactViewApprovalProvider>
                  );
                case 140:
                  return (
                    <SiteApprovalViewProvider>
                      <SiteHomeForApproval />
                    </SiteApprovalViewProvider>
                  );
                case 150:
                  return (
                    <BankViewApprovalProvider>
                      <BankHomeViewForApprovalPage />
                    </BankViewApprovalProvider>
                  );
                case 160:
                  return <SetupFromBuyerPage />;

                default:
                  return null;
              }
            })()}
          </div>

          {/*  */}
          {/* {updatedList.map((e, i) => (
            <div className=" w-full my-8">
              {e.FILE_PATH ? (
                <div className=" flex flex-col space-y-2 ">
                  <a
                    className=" dashedButton w-96 "
                    href={`${e.FILE_PATH}/${e.OLD_VALUE}`}
                    target="blank"
                  >
                    <p className="text-rose-500 font-mon">old file</p>
                  </a>
                  <a
                    className=" dashedButton w-96 "
                    href={`${e.FILE_PATH}/${e.NEW_VALUE}`}
                    target="blank"
                  >
                    {" "}
                    <p className=" text-midGreen font-mon">new file</p>
                  </a>
                </div>
              ) : (
                <div className=" space-y-2">
                  <p className=" py-2 w-96 border-[1px] border-redColor flex justify-center items-center rounded-md">
                    Old: {e.OLD_VALUE}
                  </p>

                  <p className=" py-2 w-96 border-[1px] border-midGreen flex justify-center items-center rounded-md">
                    New: {e.NEW_VALUE}
                  </p>
                </div>
              )}
            </div>
          ))} */}
        </>
      )}

      {/* rfi modal start */}
      <Modal
        icon={<CloudArrowUp size={28} color="#1B4DFF" />}
        size="md"
        show={rfqInfoModal}
        onClose={onClickAdditional}
      >
        <Modal.Header>Describe Your Need</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
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
                className="text-sm resize-none"
              />

              <div className="w-full flex justify-between items-center">
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
            </div>
            {rfiError.viewer && <ValidationError title={rfiError.viewer} />}
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

      {/* rfi modal end */}
    </div>
  );
}
