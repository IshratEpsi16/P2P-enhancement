import React, { useState, useRef, useEffect } from "react";
import {
  ManageSupplierProvider,
  useManageSupplierContext,
} from "../interface/ManageSupplierContext";
import PageTitle from "../../common_component/PageTitle";
import NavigationPan from "../../common_component/NavigationPan";
import CommonButton from "../../common_component/CommonButton";
import BasicInfoViewForApprovalPage from "./basic_info/BasicInfoViewForApprovalPage";
import DeclarationViewforApprovalPage from "./declaration/DeclarationViewforApprovalPage";
import { ContactViewApprovalProvider } from "../interface/contact/ContactApprovalViewContext";
import ContactHomeForApprovalView from "./contact/ContactHomeForApprovalView";
import { SiteApprovalViewProvider } from "../interface/contact/SiteApprovalViewContext";
import SiteHomeForApproval from "./site/SiteHomeForApproval";
import { BankViewApprovalProvider } from "../interface/bank/BankViewApprovalContext";
import BankHomeViewForApprovalPage from "./bank/BankHomeViewForApprovalPage";
import { DocumentApprovalViewProvider } from "../interface/document/DocumentApprovalViewContext";
import DocumentHomeApprovalPage from "./document/DocumentHomeApprovalPage";
import { Modal, Button } from "keep-react";
import { CloudArrowUp } from "phosphor-react";
import { Textarea } from "keep-react";
import HierarchyInterface from "../../registration/interface/hierarchy/HierarchyInterface";
import { useAuth } from "../../login_both/context/AuthContext";
import HierachyListByModuleService from "../../registration/service/approve_hierarchy/HierarchyListByModuleService";

import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import ApproveRejectService from "../service/approve_reject/ApproveRejectService";
import ApproverInterface from "../../approval_setup/interface/ApproverInterface";
import EmployeeListService from "../../approval_setup/service/EmployeeListService";
import SearchIcon from "../../icons/SearchIcon";
import RfiAddUpdateService from "../../manage_supplier_profile_update/service/rfi/RfiAddUpdateService";
import RfiSupplierListService from "../../rfi_in_supplier_registration/service/RfiSupplierListService";
import RfiSupplierInterface from "../../rfi_in_supplier_registration/interface/RfiSupplierInterface";
import convertDateFormat from "../../utils/methods/convertDateFormat";
import SetupFromBuyerPage from "./setup_from_buyer/SetupFromBuyerPage";
import UserCircleIcon from "../../icons/userCircleIcon";
import isoToDateTime from "../../utils/methods/isoToDateTime";
import useManageSupplierStore from "../store/manageSupplierStore";
import ApprovalStageInterface from "../interface/approval_stage/ApprovalStageInterface";
import ApprovalStageListService from "../service/approval_stage/ApprovalStageListService";
import ApprovalStageUpdateService from "../service/approval_stage/ApprovalStageUpdateService";
import ValidationError from "../../Alerts_Component/ValidationError";
import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";
import LogoLoading from "../../Loading_component/LogoLoading";
import fetchFileUrlService from "../../common_service/fetchFileUrlService";

const pan = ["Home", "Suppliers", "Approve Supplier"];
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

  {
    name: `Buyer's Selection`,
    id: 160,
  },
];

export default function SupplierApprovalPage() {
  const [selectedButton, setSelectedButton] = useState<number>(100);
  const [page, setPage] = useState<number>(100);
  const { token, supplierId, userId } = useAuth();

  const handleButton = (buttonId: number) => {
    setSelectedButton(buttonId);
    setPage(buttonId);
  };
  const { setManageSupplierPageNo } = useManageSupplierContext();
  //store
  const {
    setInitiator,
    initiator,
    singleSupplierSupplier: selectedSupplier,
  } = useManageSupplierStore();
  //store
  const back = () => {
    setManageSupplierPageNo(1);
    setInitiator(null);
  };

  const additionalInfo = () => {
    setAdditionalInfoModal(!additionalInfoModal);
  };

  //request for more info

  const [additionalInfoModal, setAdditionalInfoModal] =
    useState<boolean>(false);

  const onClickAdditional = () => {
    setAdditionalInfoModal(!additionalInfoModal);
    if (additionalInfoModal) {
      setAdditionalValue("");
      setViewerId(null);
    }
  };

  const [additionalValue, setAdditionalValue] = useState<string>("");

  // Event handler to update the state when the textarea value changes
  const handleAdditionalInfoChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const inputValue = event.target.value;

    if (inputValue.length <= 150) {
      setAdditionalValue(inputValue);
    } else {
      setAdditionalValue(inputValue.slice(0, 150));
    }
  };

  //approve modal

  const [approveModal, setApproveModal] = useState<boolean>(false);
  const onCLickApprove = () => {
    setActionCode(1);
    setApproveModal(!approveModal);
    if (!approveModal) {
      setSelectedAsId(null);
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
    setActionCode(0);
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

  //approver stage get korlam
  useEffect(() => {
    console.log(userId);
    console.log(initiator);

    getApproverHierachy();
  }, []);
  const [hierarchLoading, setHierarchyLoading] = useState<boolean>(false);

  const [hierarchyUserProfilePicturePath, setHierarchyUserProfilePicturePath] =
    useState<string>("");
  const [hierarchyList, setHierarchyList] = useState<HierarchyInterface[] | []>(
    []
  );
  const getApproverHierachy = async () => {
    // const decodedToken = decodeJWT(token!);

    // Extract USER_ID from the decoded payload
    // const userId = decodedToken?.decodedPayload?.USER_ID;
    try {
      setHierarchyLoading(true);
      const result = await HierachyListByModuleService(
        token!,
        supplierId!,
        "Supplier Approval"
      );
      if (result.data.status === 200) {
        setHierarchyLoading(false);
        setHierarchyUserProfilePicturePath(result.data.profile_pic);
        setHierarchyList(result.data.data);
      } else {
        setHierarchyLoading(false);
        // showErrorToast(result.data.message);
      }
    } catch (error) {
      setHierarchyLoading(false);
      // showErrorToast("Something went wrong");
    }
  };

  const [stageId, setStageId] = useState<number | null>(null);
  const [stageLevel, setStageLevel] = useState<number | null>(null);
  const [actionCode, setActionCode] = useState<number | null>(null);
  const [mustApproverCheck, setMustApproverCheck] = useState<number | null>(
    null
  );

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

  const [sameLevelHierarch, setSameLevelHierarchy] = useState<
    HierarchyInterface[] | []
  >([]);
  const [nextLevelHierarch, setNextLevelHierarchy] = useState<
    HierarchyInterface[] | []
  >([]);

  useEffect(() => {
    if (selectedHierarch) {
      console.log("set hie");
      setStageId(selectedHierarch.STAGE_ID || null);
      setStageLevel(selectedHierarch.STAGE_LEVEL || null);
    }
  }, [selectedHierarch]);

  // const getAllStageLevelUser=()=>{
  //   const sameList=hierarchyList.filter((hierarchy)=>hierarchy.STAGE_LEVEL===stageLevel );
  //   setSameLevelHierarchy(sameList);
  //   const isThereAnyMustApproverInSameList=sameList.filter((fil)=>fil.IS_MUST_APPROVE===1);
  //   if(!isThereAnyMustApproverInSameList){
  //     const nextList=hierarchyList.filter((hierarchy)=>hierarchy.STAGE_LEVEL===stageLevel!+1 );
  //     setNextLevelHierarchy(nextList);
  //   }
  // }

  // useEffect(()=>{
  //   if(stageLevel){
  //       getAllStageLevelUser();
  //   }
  // },[stageLevel]);

  const approve = () => {
    console.log(stageId, stageLevel, actionCode, selectedHierarch);
  };
  const [isRfiLoading, setIsRfiLoading] = useState<boolean>(false);
  const sendRfi = async () => {
    if (validateRfi()) {
      setAdditionalInfoModal(false);
      setIsRfiLoading(true);
      try {
        const result = await RfiAddUpdateService(
          token!,
          null,
          supplierId,
          "Supplier Approval",
          additionalValue,
          viewerId,
          "",
          0
        );
        if (result.data.status === 200) {
          showSuccessToast(result.data.message);
          setAdditionalValue("");
          setViewerId(null);
          setIsRfiLoading(false);
          back();
        } else {
          setIsRfiLoading(false);
          showErrorToast(result.data.message);
        }
      } catch (error) {
        setIsRfiLoading(false);
        showErrorToast("Something went wrong");
      }
    }
  };

  // validation
  const [stageError, setStageError] = useState<{
    stage?: string;
    approveNote?: string;
  }>({});
  const [rfiError, setRfiError] = useState<{
    rfiNote?: string;
    viewer?: string;
  }>({});
  const [rejectError, setRejectError] = useState<{
    rejectNote?: string;
  }>({});

  //  {loginError.email && <ValidationError title={loginError.email} />}

  //validation
  const validateStage = () => {
    const errors: { stage?: string; approveNote?: string } = {};

    // if (selectedAsId == null && initiator === "Y") {
    //   errors.stage = "Please Approval Stage";
    // }
    if (!approveValue.trim()) {
      errors.approveNote = "Please Enter Note";
    }

    setStageError(errors);

    return Object.keys(errors).length === 0;
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
  const validateReject = () => {
    const errors: { rejectNote?: string } = {};

    if (!rejectValue.trim()) {
      errors.rejectNote = "Please Enter Note";
    }

    setRejectError(errors);

    return Object.keys(errors).length === 0;
  };
  // validation

  const [approvalLoading, setApprovalLoading] = useState<boolean>(false);

  const approveRejectDo = async () => {
    if (validateStage()) {
      setApproveModal(false);
      setApprovalLoading(true);
      approvalStageUpdate();
      try {
        const result = await ApproveRejectService(
          token!,
          "SUBMIT",
          "IN PROCESS",
          0,
          actionCode!,
          supplierId!,
          selectedSupplier?.STAGE_ID!,
          approveValue!,
          selectedSupplier?.STAGE_LEVEL!,
          initiator!
        );
        console.log(result.data);

        // if (result.data.registration_status === 200) {
        //   showSuccessToast(result.data.registration_message);
        //   back();
        // } else if (result.data.status === 200) {
        //   showSuccessToast(result.data.message);
        //   back();
        // } else if (result.data.history_status === 200) {
        //   showSuccessToast(result.data.message);
        //   back();
        // } else {
        //   showErrorToast(result.data.registration_message);
        //   // back();
        // }
        if (result.data.registration_status === 200) {
          showSuccessToast(result.data.registration_message);
          setApprovalLoading(false);

          back();
        } else if (result.data.update_status === 200) {
          showSuccessToast(result.data.update_message);
          setApprovalLoading(false);

          back();
        } else if (result.data.history_status === 200) {
          showSuccessToast(result.data.history_message);
          setApprovalLoading(false);

          back();
        } else {
          setApprovalLoading(false);

          showErrorToast("Some error occurred. Please try again.");
        }
      } catch (error) {
        setApprovalLoading(false);

        showErrorToast("Something went wrong");
      }
    }
  };

  const [isRejectLoading, setIsRejectLoading] = useState<boolean>(false);

  const cancel = async () => {
    if (validateReject()) {
      setRejectModal(false);
      setIsRejectLoading(true);
      try {
        const result = await ApproveRejectService(
          token!,
          "SUBMIT",
          "REJECTED",
          0,
          actionCode!,
          supplierId!,
          selectedSupplier!.STAGE_ID!,
          rejectValue!,
          selectedSupplier?.STAGE_LEVEL!,
          initiator!
        );
        console.log(result.data);

        if (result.data.registration_status === 200) {
          setIsRejectLoading(false);
          showSuccessToast(result.data.registration_message);
          back();
        } else if (result.data.status === 400) {
          //age 200
          setIsRejectLoading(false);
          showErrorToast(result.data.message);
        } else {
          setIsRejectLoading(false);
          showErrorToast(result.data.registration_message);
        }
      } catch (error) {
        setIsRejectLoading(false);
        showErrorToast("Something went wrong");
      }
    }
  };

  // //is approve warning

  // const [isApproveOpen,setIsApproveOpen]=useState<boolean>(false);

  // const openApproveModal=()=>{
  //     setIsApproveOpen(true)
  // }

  // const closeApproveModal=()=>{

  // }

  //modal rfi
  const [approverList, setApproverList] = useState<ApproverInterface[] | []>(
    []
  );
  const [approverList2, setApproverList2] = useState<ApproverInterface[] | []>(
    []
  );

  const [isApproverLoading, setIsApproverLoading] = useState(false);

  useEffect(() => {
    getApproverList();
  }, []);

  const [viewerId, setViewerId] = useState<number | null>(null);
  const handleApproverIdChange = (uId: number) => {
    setViewerId(uId);
    console.log(uId);
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
  const approverSequenceRef = useRef<HTMLInputElement | null>(null);
  const [approverSequence, setApproverSequence] = useState<string>("");
  const handleApproverSequence = (value: string) => {
    setApproverSequence(value);
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

  //rfi note show

  useEffect(() => {
    getSupplierListForRfiMessage();
    getApprovalStageList();
  }, []);

  const [supplierList, setSUpplierList] = useState<RfiSupplierInterface[] | []>(
    []
  );
  const [propicPath, setPropicPath] = useState<string>("");

  const getSupplierListForRfiMessage = async () => {
    console.log(userId);

    try {
      const result = await RfiSupplierListService(
        token!,
        userId,
        null,
        1,
        supplierId
      );
      console.log(result.data);

      if (result.data.status === 200) {
        console.log(result.data.data);

        setSUpplierList(result.data.data);
        setPropicPath(result.data.PROFILE_PIC);
      } else {
        showSuccessToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Something went wrong");
    }
  };

  //aprover stage list
  const [approvalStageList, setApprovalStageList] = useState<
    ApprovalStageInterface[] | []
  >([]);

  const [selectedAsId, setSelectedAsId] = useState<number | null>(null);

  const getApprovalStageList = async () => {
    try {
      const result = await ApprovalStageListService(token!);
      if (result.data.status === 200) {
        setApprovalStageList(result.data.data);
      }
    } catch (error) {
      showErrorToast("Something went wrong");
    }
  };

  //aprover stage list

  //approval stage update

  const approvalStageUpdate = async () => {
    try {
      const result = await ApprovalStageUpdateService(
        token!,
        supplierId!,
        selectedAsId!
      );
      console.log(result.data);

      if (result.data.status === 200) {
        setApprovalStageList(result.data.data);
      }
    } catch (error) {
      showErrorToast("Something went wrong");
    }
  };

  //approval stage update

  //hierarch show

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

      <>
        {approvalLoading || isRejectLoading || isRfiLoading ? (
          <div className=" w-full flex justify-center items-center">
            <LogoLoading />
          </div>
        ) : (
          <>
            <div className=" flex justify-between items-center">
              <div className=" flex flex-col items-start">
                <PageTitle titleText="Approve Supplier" />
                {/* <NavigationPan list={pan} /> */}
              </div>
              <CommonButton
                onClick={back}
                titleText="Back"
                width="w-24"
                color="bg-midGreen"
              />
            </div>
            <div className=" h-6"></div>
            <div className=" w-full overflow-x-auto flex space-x-4  py-1 px-[1px]">
              {buttonList.map((btn, i) => (
                <button
                  onClick={() => {
                    handleButton(btn.id);
                  }}
                  key={btn.id}
                  className={`w-44 h-10 flex justify-center items-center text-midBlack  rounded-[4px] font-mon font-medium text-[13px] px-[5px]  ${
                    selectedButton === btn.id
                      ? " bg-midBlue text-whiteColor"
                      : " ring-[1px] ring-borderColor bg-inputBg"
                  }`}
                >
                  {btn.name}
                </button>
              ))}
            </div>
            <div className=" h-6"></div>
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
            {supplierList.length > 0 ? (
              <div className=" w-full my-6 p-2 bg-white shadow-sm rounded-md border-[0.1px] border-gray-200  ">
                {supplierList.map((e, i) => (
                  <div>
                    <div
                      key={e.ID}
                      className=" p-4 w-full  flex space-x-4 items-start
          "
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

                    <div
                      key={e.ID}
                      className=" p-4 w-full  flex space-x-4 items-start
          "
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
          </>
        )}
        <div className=" flex w-full space-x-4 my-20">
          <button
            disabled={isRejectLoading}
            onClick={onCLickReject}
            className=" w-48 denyButton"
          >
            Deny
          </button>

          <CommonButton
            titleText="Request Additional Info"
            width="w-48"
            onClick={additionalInfo}
            disable={isRfiLoading}
          />

          <CommonButton
            titleText="Approve"
            width="w-48"
            color="bg-midGreen"
            onClick={onCLickApprove}
            disable={approvalLoading}
          />
        </div>
        {/* hierarchy show */}

        <div className="w-full  flex justify-center items-center  ring-1 ring-borderColor bg-gray-50">
          <table className="w-full  px-16  ">
            <thead className="   ">
              <tr className=" w-full h-14 bg-lightGreen rounded-t-md">
                <th className="mediumText ">Sequence</th>
                <th className="mediumText ">Perfomrmed By</th>
                <th className="mediumText ">Date</th>
                <th className="mediumText ">Action</th>
                <th className="mediumText ">Remarks</th>
              </tr>
            </thead>

            {hierarchyList.map((item, index) => (
              <tbody>
                <tr
                  key={item.APPROVER_ID}
                  className={`text-center h-14 ${
                    index !== 0 ? "border-t border-borderColor h-[0.1px] " : ""
                  }`}
                >
                  <td className="smallText h-14">{item.STAGE_LEVEL}</td>
                  <td className="smallText h-14">{item.APPROVER_FULL_NAME}</td>
                  <td className="smallText h-14">
                    {item.ACTION_DATE !== "N/A" ? item.ACTION_DATE : "N/A"}
                  </td>
                  <td className="font-mon text-sm   font-semibold h-14">
                    {item.ACTION_CODE === "0" ? (
                      <p className=" text-sm font-mon text-redColor">
                        Rejected
                      </p>
                    ) : item.ACTION_CODE === "1" ? (
                      <p className=" text-sm font-mon text-midGreen">
                        Approved
                      </p>
                    ) : (
                      <p className=" text-sm font-mon  text-yellow-500">
                        Pending
                      </p>
                    )}
                  </td>
                  <td className="smallText h-14">
                    {item.ACTION_NOTE !== "N/A" ? item.ACTION_NOTE : "N/A"}
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      </>

      {/* reuest for more info modal */}
      <Modal
        icon={<CloudArrowUp size={28} color="#1B4DFF" />}
        size="md"
        show={additionalInfoModal}
        onClose={onClickAdditional}
      >
        <Modal.Header>Describe Your Need To Approve</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <Textarea
              id="comment"
              placeholder="Leave a comment..."
              withBg={true}
              color="gray"
              border={true}
              rows={3}
              value={additionalValue}
              onChange={handleAdditionalInfoChange}
            />
            <div className=" w-full flex justify-end smallText">
              {additionalValue.length}/150
            </div>
            {rfiError.rfiNote && <ValidationError title={rfiError.rfiNote} />}

            <div className=" w-full h-10 flex items-center space-x-[0.1px]">
              <input
                onChange={handleApproverSearch}
                type="text"
                className=" flex-1 h-full border-[0.5px] border-borderColor outline-[0.1px] outline-midBlue px-2 placeholder:text-graishColor placeholder:text-sm placeholder:font-mon"
                placeholder="Search Approver"
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
      {/* reuest for more info modal */}
      {/* approve modal */}
      <Modal
        icon={<CloudArrowUp size={28} color="#1B4DFF" />}
        size="md"
        show={approveModal}
        onClose={onCLickApprove}
      >
        <Modal.Header></Modal.Header>
        <Modal.Body>
          {/* {initiator !== "Y" ? (
            <p></p>
          ) : (
            <p className=" my-4 font-mon text-midBlack font-bold text-md">
              Approval Stages
            </p>
          )}
          {initiator === "Y"
            ? approvalStageList &&
              approvalStageList.map((e, i) => (
                <button
                  onClick={() => {
                    setSelectedAsId(e.AS_ID);
                  }}
                  key={e.AS_ID}
                  className={`w-full flex mt-4 py-2 px-3 justify-between items-center ${
                    selectedAsId === e.AS_ID
                      ? " border-[1px] border-midGreen"
                      : "border-[1px] border-borderColor"
                  } rounded-md `}
                >
                  <p className=" text-sm font-mon text-midBlack">
                    {e.APPROVAL_STAGE_NAME}
                  </p>
                  {selectedAsId === e.AS_ID ? (
                    <div className=" w-6 h-6 rounded-full bg-midGreen flex justify-center items-center">
                      <img
                        src="/images/check.png"
                        alt="check"
                        className=" w-2 h-2"
                      />
                    </div>
                  ) : null}
                </button>
              ))
            : null}

          {stageError.stage && <ValidationError title={stageError.stage} />} */}

          <p className=" my-4 font-mon text-midBlack font-bold text-md">
            Give A Note
          </p>
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
            {stageError.approveNote && (
              <ValidationError title={stageError.approveNote} />
            )}
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
            onClick={approveRejectDo}
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

            {rejectError.rejectNote && (
              <ValidationError title={rejectError.rejectNote} />
            )}
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
            onClick={cancel}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      {/* reject modal */}
    </div>
  );
}
