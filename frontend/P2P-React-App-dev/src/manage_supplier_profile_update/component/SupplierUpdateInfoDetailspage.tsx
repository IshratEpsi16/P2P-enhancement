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

import { Modal, Button } from "keep-react";
import { CloudArrowUp } from "phosphor-react";
import { Textarea } from "keep-react";
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
import InputLebel from "../../common_component/InputLebel";
import ProfileUpdateHierarchyService from "../service/ProfileUpdateHierarchyService";
import ProfileNewInfoUpdateHierarchyService from "../service/ProfileNewInfoUpdateHierarchyService";
import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";
import ApproverInterface from "../../approval_setup/interface/ApproverInterface";
import EmployeeListService from "../../approval_setup/service/EmployeeListService";
import RfiAddUpdateService from "../service/rfi/RfiAddUpdateService";
import ValidationError from "../../Alerts_Component/ValidationError";
import SearchIcon from "../../icons/SearchIcon";
import RfiSupplierInterface from "../../rfi_in_supplier_registration/interface/RfiSupplierInterface";
import RfiSupplierListService from "../../rfi_in_supplier_registration/service/RfiSupplierListService";
import UserCircleIcon from "../../icons/userCircleIcon";
import isoToDateTime from "../../utils/methods/isoToDateTime";
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
    id: 150,
    name: "Bank Details",
  },
  {
    id: 140,
    name: "Site",
  },
  {
    id: 130,
    name: "Contact",
  },
  // {
  //   name: `Buyer's Selection`,
  //   id: 160,
  // },
];

export default function SupplierUpdateInfoDetailspage() {
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
    getApproverHierarchy();
    // getApproveHierarchyNewInfo();
    setIsBuyerSelectionDisable(true);
    getApproverList();
  }, []);

  //hierarchy

  const [hierarchLoading, setHierarchyLoading] = useState<boolean>(false);

  const [hierarchyUserProfilePicturePath, setHierarchyUserProfilePicturePath] =
    useState<string>("");
  const [hierarchyList, setHierarchyList] = useState<HierarchyInterface[] | []>(
    []
  );
  const getApproverHierarchy = async () => {
    // const decodedToken = decodeJWT(token!);

    // Extract USER_ID from the decoded payload
    // const userId = decodedToken?.decodedPayload?.USER_ID;

    console.log(supplierId);

    try {
      setHierarchyLoading(true);
      setIsLoading(true);
      const result = await ProfileUpdateHierarchyService(
        token!,
        supplierId!,
        "Profile Update",
        profileUidInStore!
      );
      if (result.data.status === 200) {
        setHierarchyLoading(false);
        setIsLoading(false);

        let fetchedHierarchyList = result.data.data;

        setHierarchyUserProfilePicturePath(result.data.profile_pic);
        // setHierarchyList(result.data.data);

        // Extract the INITIATOR_STATUS from updateListInStore
        if (updateListInStore) {
          const initiatorStatus = {
            // APPROVER_ID: updateListInStore.INITIATOR_ID,
            STAGE_LEVEL: updateListInStore.STAGE_LEVEL, // Use the same stage level from the updateList
            APPROVER_FULL_NAME: updateListInStore.INITIATOR_STATUS?.FULL_NAME,
            ACTION_CODE: updateListInStore.INITIATOR_STATUS?.ACTION_CODE,
            ACTION_DATE: updateListInStore.INITIATOR_STATUS?.ACTION_DATE,
            ACTION_NOTE: updateListInStore.INITIATOR_STATUS?.NOTE,
          };

          // Add initiatorStatus to the beginning of the hierarchyList
          fetchedHierarchyList.unshift(initiatorStatus);
        }

        // Add initiatorStatus to the beginning of the hierarchyList
        // fetchedHierarchyList.unshift(initiatorStatus);

        // Update the state with the updated hierarchyList
        setHierarchyList(fetchedHierarchyList);

        // Optionally log the updated list
        console.log("Updated hierarchyList: ", fetchedHierarchyList);
        console.log("hierarchyList: ", result.data);
      } else {
        setHierarchyLoading(false);
        setIsLoading(false);
        // showErrorToast(result.data.message);
      }
    } catch (error) {
      setHierarchyLoading(false);
      setIsLoading(false);
      // showErrorToast("Something went wrong");
    }
  };

  // const getApproveHierarchyNewInfo = async () => {

  //   try {
  //     setHierarchyNewInfoLoading(true);
  //     const result = await ProfileNewInfoUpdateHierarchyService(
  //       token!,
  //       supplierId!,
  //       "Profile Update",
  //       isProfileNewInfoId!
  //     );

  //     console.log("newInfo: ", result);
  //     if (result.data.status === 200) {
  //       setHierarchyNewInfoLoading(false);
  //       setHierarchyUserProfilePicturePath(result.data.profile_pic);
  //       setHierarchyNewInfoList(result.data.data);
  //     } else {
  //       setHierarchyNewInfoLoading(false);
  //       showErrorToast(result.data.message);
  //     }
  //   } catch (error) {
  //     setHierarchyNewInfoLoading(false);
  //     showErrorToast("Something went wrong");
  //   }
  // };

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
      setHierarchy();
      console.log("set selected");
    }
  }, [hierarchyList]);

  // useEffect(() => {
  // if (selectedHierarch) {
  //   console.log("set hie");
  //   setStageId(selectedHierarch.STAGE_ID || null);
  //   setStageLevel(selectedHierarch.STAGE_LEVEL || null);
  //   getUpdateDetails(selectedHierarch.STAGE_ID, selectedHierarch.STAGE_LEVEL);
  // }
  // }, [selectedHierarch]);

  useEffect(() => {
    getUpdateDetails();
  }, []);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [updatedList, setUpdatedList] = useState<
    ProfileUpdateDataInterface[] | []
  >([]);
  // const [selectedUpdatedList, setSelectedUpdatedList] = useState<
  //   ProfileUpdateDataInterface[] | []
  // >([]);

  // const [isSelectAll, setIsSelectAll] = useState<boolean>(false);

  // const selectAll = () => {
  //   setIsSelectAll(true);
  //   setSelectedUpdatedList([...selectedUpdatedList, ...updatedList]);
  // };

  // const unselectAll = () => {
  //   setIsSelectAll(false);
  //   setSelectedUpdatedList([]);
  // };
  // const toggleFieldSelection = (field: ProfileUpdateDataInterface) => {
  //   setSelectedUpdatedList((prevSelected) => {
  //     const isSelected = prevSelected.some(
  //       (fld) => fld.ACTION_ID === field.ACTION_ID
  //     );

  //     if (isSelected) {
  //       // If the field is already selected, remove it from the selection
  //       return prevSelected.filter((fld) => fld.ACTION_ID !== field.ACTION_ID);
  //     } else {
  //       // If the field is not selected, add it to the selection
  //       return [...prevSelected, field];
  //     }
  //   });
  // };

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

  const getUpdateDetails = async () => {
    setIsLoading(true);
    try {
      const result = await SupplierProfileUpdateDetailsService(
        token!,
        stageIdInStore!,
        stageLevelInStore!,
        supplierId!,
        "IN PROCESS"
      );
      console.log(result.data);

      if (result.data.status === 200) {
        console.log("updateList: ", result.data.data);

        setUpdatedList(result.data.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      showErrorToast("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const { setManageSupplierProfileUpdatePageNo } =
    useManageSupplierProfileUpdateContext();

  const back = () => {
    setManageSupplierProfileUpdatePageNo(1);
    setIsBuyerSelectionDisable(false);
  };

  //hierarchy

  //validation

  const [approveError, setApproveError] = useState<{ note?: string }>({});
  const [rejectError, setRejectError] = useState<{ note?: string }>({});

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

  //validation

  const [isRejectLoading, setIsRejectLoading] = useState<boolean>(false);

  const deny = async () => {
    if (validateReject()) {
      console.log(supplierId);
      console.log(updatedList.length);
      setRejectModal(false);
      setIsRejectLoading(true);
      let result;

      for (let i = 0; i < updatedList.length; i++) {
        if (
          updatedList[i] &&
          updatedList[i].PROFILE_UPDATE_TEMPLATE_STAGE_LEVEL
        ) {
          console.log(updatedList[i].ACTION_ID);

          let level = updatedList[i].PROFILE_UPDATE_TEMPLATE_STAGE_LEVEL;
          result = await ProfileUpdateApproveRejectService(
            token!,
            "SUBMIT",
            "REJECTED",

            2,
            supplierId,
            stageIdInStore,
            rejectValue,
            stageLevelInStore?.toString() ?? "",
            updatedList[i].ACTION_ID,
            profileUidInStore,
            isInitiatorInStore
          );
          console.log(updatedList[i].PROFILE_UPDATE_TEMPLATE_STAGE_LEVEL);

          console.log(result.data);
        }
      }
      setIsRejectLoading(false);

      showSuccessToast("Submitted Successfully");
      back();
    }
  };

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

  const [isApproveLoading, setIsApproveLoading] = useState<boolean>(false);

  const approve = async () => {
    if (validateApprove()) {
      console.log(supplierId);
      console.log(updatedList.length);
      setApproveModal(false);
      setIsApproveLoading(true);

      let result;

      for (let i = 0; i < updatedList.length; i++) {
        if (
          updatedList[i] &&
          updatedList[i].PROFILE_UPDATE_TEMPLATE_STAGE_LEVEL
        ) {
          let level = updatedList[i].PROFILE_UPDATE_TEMPLATE_STAGE_LEVEL;
          result = await ProfileUpdateApproveRejectService(
            token!,
            "SUBMIT",
            "IN PROCESS",

            1,
            supplierId,
            stageIdInStore,
            approveValue,
            stageLevelInStore?.toString() ?? "",
            updatedList[i].ACTION_ID,
            profileUidInStore,
            isInitiatorInStore
          );
          // console.log(selectedUpdatedList[i].PROFILE_UPDATE_TEMPLATE_STAGE_LEVEL);
          console.log(result.data.message);
          console.log(result.data);
        }
      }

      // if (result?.data.status === "200") {
      //   setIsApproveLoading(false);
      //   showSuccessToast(result?.data.message);
      // } else {
      //   setIsApproveLoading(false);
      //   showErrorToast(result?.data.message);
      // }

      if (result?.data.update_status === 200) {
        setIsApproveLoading(false);
        showSuccessToast(result?.data.update_message);
      } else {
        setIsApproveLoading(false);
        showErrorToast(result?.data?.update_message);
      }
      back();
    }
  };

  //approve modal

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

  //supplier profile show
  const [selectedButton, setSelectedButton] = useState<number>(100);
  const [page, setPage] = useState<number>(100);

  const {
    setIsBuyerSelectionDisable,
    profileUidInStore,
    supplierIdInStore,
    isInitiatorInStore,
    stageIdInStore,
    stageLevelInStore,
    updateListInStore,
  } = useProfileUpdateStore();

  const handleButton = (buttonId: number) => {
    setSelectedButton(buttonId);
    setPage(buttonId);
  };

  //supplier profile show

  useEffect(() => {
    console.log("isInitiator: ", isInitiatorInStore);
    console.log("stageIdInStore: ", stageIdInStore);
    console.log("stageLevelInStore: ", stageLevelInStore);
    console.log("updateListInStore: ", updateListInStore);
  }, []);

  // request for information (rfi)
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
          "PROFILE_UPDATE",
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
          (item: RfiSupplierInterface) => item.OBJECT_TYPE === "PROFILE_UPDATE"
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

  interface ImageUrls {
    [key: number]: string | null;
  }

  const [imageUrls, setImageUrls] = useState<ImageUrls>({});
  const [imageUrls2, setImageUrls2] = useState<ImageUrls>({});

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
    if (updatedList) {
      const fetchImages = async () => {
        const newImageUrls: ImageUrls = {};
        for (let index = 0; index < updatedList.length; index++) {
          const element = updatedList[index];
          const url = await getImage2(element.FILE_PATH!, element.OLD_VALUE);
          newImageUrls[element.ACTION_ID] = url;
        }
        setImageUrls(newImageUrls);
        // setIsLoading(false);
      };
      fetchImages();
    }
  }, [updatedList]);

  useEffect(() => {
    if (updatedList) {
      const fetchImages = async () => {
        const newImageUrls: ImageUrls = {};
        for (let index = 0; index < updatedList.length; index++) {
          const element = updatedList[index];
          const url = await getImage2(element.FILE_PATH!, element.NEW_VALUE);
          newImageUrls[element.ACTION_ID] = url;
        }
        setImageUrls2(newImageUrls);
        // setIsLoading(false);
      };
      fetchImages();
    }
  }, [updatedList]);

  const [imageUrls3, setImageUrls3] = useState<ImageUrls>({});
  const [imageUrls4, setImageUrls4] = useState<ImageUrls>({});

  const getImage3 = async (
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
        setImageUrls3(newImageUrls);
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
        setImageUrls4(newImageUrls);
        // setIsLoading(false);
      };
      fetchImages();
    }
  }, [supplierList, propicPath]);

  return (
    <div className=" m-8">
      <SuccessToast />
      <div className=" w-full flex justify-between items-center">
        <PageTitle titleText="Supplier Profile Update Data" />
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
      ) : updatedList.length === 0 ? (
        <div className=" w-full h-40 flex justify-center items-center">
          <p className=" largeText">No Data Found</p>
        </div>
      ) : (
        <>
          {isApproveLoading || isRejectLoading ? (
            <div className=" w-full flex justify-center items-center ">
              <LogoLoading />
            </div>
          ) : (
            <div className="overflow-auto max-h-[400px] rounded-lg shadow-lg custom-scrollbar my-4">
              <table className="min-w-full divide-y divide-gray-200 rounded-lg">
                <thead className="bg-[#CAF4FF] sticky top-0 ">
                  <tr>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon"></th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      SL
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      Label Name
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      Old value
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      New Value
                    </th>
                  </tr>
                </thead>

                {updatedList.map((e, i) => (
                  <tbody
                    key={e.SUPPLIER_ID}
                    className="bg-white divide-y divide-gray-200"
                  >
                    <tr>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center"></div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {i + 1}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar ">
                        <div className="w-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                          {e.DETAILS && e.DETAILS.BANK_NAME
                            ? `${e.DETAILS.BANK_NAME} (${getDescription(
                                `${e.TABLE_NAME}_${e.COLUMN_NAME}`
                              )})`
                            : getDescription(
                                `${e.TABLE_NAME}_${e.COLUMN_NAME}`
                              )}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full  overflow-auto custom-scrollbar text-center flex justify-center items-center">
                          {e.FILE_PATH ? (
                            <a
                              href={`${imageUrls[e.ACTION_ID]}`}
                              className=" dashedButton w-40 "
                              // href={`${e.FILE_PATH}/${e.OLD_VALUE}`}
                              target="_blank"
                            >
                              <p className="text-rose-500 font-mon">View</p>
                            </a>
                          ) : (
                            <p className=" "> {e.OLD_VALUE}</p>
                          )}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                          {e.FILE_PATH ? (
                            <a
                              className=" dashedButton w-40 "
                              href={`${imageUrls2[e.ACTION_ID]}`}
                              target="_blank"
                            >
                              {" "}
                              <p className=" text-midGreen font-mon">View</p>
                            </a>
                          ) : (
                            <p className=" rounded-md">{e.NEW_VALUE}</p>
                          )}
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
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          <div className=" w-full flex justify-end space-x-4">
            <CommonButton
              onClick={openRfiModal}
              titleText={"Request for Information"}
              width="w-48"
              height="h-8"
              color=" bg-midBlack "
            />

            <button
              disabled={isRejectLoading}
              onClick={onCLickReject}
              className=" w-36 bg-[#FFE4DE] text-[#ca534d] rounded-md font-semibold font-mon h-8"
            >
              Deny
            </button>

            <CommonButton
              titleText="Approve"
              width="w-36"
              onClick={onCLickApprove}
              color="bg-midGreen"
              disable={isApproveLoading}
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
                                src={imageUrls3[e.ID] ?? ""}
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
                                src={imageUrls4[e.INITIATOR_ID] ?? ""}
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

          <div className=" my-4">
            <div className="w-full  flex justify-center items-center  ring-1 ring-borderColor bg-gray-50">
              <table className="w-full  px-16 ">
                <thead className="   ">
                  <tr className=" w-full h-12 bg-lightGreen rounded-t-md">
                    <th className="font-semibold">Sequence</th>
                    <th className="font-semibold">Performed By</th>
                    <th className="font-semibold">Action</th>

                    {hierarchyList.some((item) => item.ACTION_CODE !== "3") && (
                      <>
                        <th className="font-semibold">Date</th>
                        <th className="font-semibold">Remarks</th>
                      </>
                    )}
                    {/* <th className="mediumText ">Date</th>
                    <th className="mediumText ">Remarks</th> */}
                  </tr>
                </thead>

                {hierarchyList.map((item, index) => (
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
                      {/* <td className="smallText h-14">
                        {item.ACTION_DATE !== "N/A" ? item.ACTION_DATE : "N/A"}
                      </td> */}
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
                            {item.ACTION_DATE !== "---"
                              ? item.ACTION_DATE
                              : "N/A"}
                          </td>
                          <td className="smallText h-12">
                            {item.ACTION_NOTE !== "---"
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
          {/* {
                updatedList.map((e,i)=>(
                    <div className=' w-full my-8'>
                        {
                            e.FILE_PATH
                            ?
                           <div className=' flex flex-col space-y-2 '>

                             <a className=' dashedButton w-96 ' href={`${e.FILE_PATH}/${e.OLD_VALUE}`} target='blank'><p className='text-rose-500 font-mon'>old file</p></a>
                             <a className=' dashedButton w-96 ' href={`${e.FILE_PATH}/${e.NEW_VALUE}`} target='blank'> <p className=' text-midGreen font-mon'>new file</p></a>
                           </div>
                            :
                            <div className=' space-y-2'>

                                <p  className=' py-2 w-96 border-[1px] border-redColor flex justify-center items-center rounded-md'>Old: {e.OLD_VALUE}</p>

                                <p className=' py-2 w-96 border-[1px] border-midGreen flex justify-center items-center rounded-md'>New: {e.NEW_VALUE}</p>

                            </div>
                        }
                    </div>
                ))
            } */}
        </>
      )}

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
