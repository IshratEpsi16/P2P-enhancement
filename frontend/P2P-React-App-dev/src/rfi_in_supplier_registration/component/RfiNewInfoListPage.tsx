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
import SupplierListForUpdateProfileApprovalService from "../../manage_supplier_profile_update/service/SupplierListForUpdateApprovalService";
import SupplierInterface from "../../manage_supplier/interface/SupplierInterface";
import HierachyListByModuleService from "../../registration/service/approve_hierarchy/HierarchyListByModuleService";
import HierarchyInterface from "../../registration/interface/hierarchy/HierarchyInterface";
import ProfileUpdateDataInterface from "../../manage_supplier_profile_update/interface/ProfileUpdateDataInterface";
import SupplierProfileUpdateDetailsService from "../../manage_supplier_profile_update/service/SupplierProfileUpdateDetailsService";
import CommonButton from "../../common_component/CommonButton";
import CheckIcon from "../../icons/CheckIcon";

import ProfileUpdateApproveRejectService from "../../manage_supplier_profile_update/service/approve-reject/ProfileUpdateApproveRejectService";
import {
  columnNameDescriptionLookup,
  getDescription,
} from "../../manage_supplier_profile_update/utils/ColumnDescriptionLookup";
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
// import useProfileUpdateStore from "../store/profileUpdateStore";
import useProfileUpdateStore from "../../manage_supplier_profile_update/store/profileUpdateStore";
import SupplierProfileInfoDetailsService from "../../manage_supplier_profile_update/service/SupplierProfileInfoDetailsService";
import SupplierNewValueAddAprrovalService from "../../manage_supplier_profile_update/service/SupplierNewValueAddAprrovalService";
import InputLebel from "../../common_component/InputLebel";
import ProfileNewInfoUpdateHierarchyService from "../../manage_supplier_profile_update/service/ProfileNewInfoUpdateHierarchyService";
import { Modal, Button, Textarea } from "keep-react";
import { CloudArrowUp } from "phosphor-react";
import ApproverInterface from "../../approval_setup/interface/ApproverInterface";
import EmployeeListService from "../../approval_setup/service/EmployeeListService";
import RfiAddUpdateService from "../../manage_supplier_profile_update/service/rfi/RfiAddUpdateService";
import ValidationError from "../../Alerts_Component/ValidationError";
import SearchIcon from "../../icons/SearchIcon";
import usePrItemsStore from "../../buyer_section/pr/store/prItemStore";
import useRfiStore from "../store/RfiStore";
import UserCircleIcon from "../../icons/userCircleIcon";
import isoToDateTime from "../../utils/methods/isoToDateTime";
import RfiSupplierInterface from "../interface/RfiSupplierInterface";
import { useRfiManageSupplierContext } from "../context/RfiManageSupplierContext";
import RfiSupplierListService from "../service/RfiSupplierListService";
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

export default function RfiNewInfoListPage() {
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
    console.log("objectId: ", rfqIdInStore);
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

  // store
  const { rfqIdInStore } = usePrItemsStore();
  const {
    setRfiSupplierListlength,
    setRfiTabNo,
    rfiTabNo,
    setStageLevelInStore,
    setTemplateIdInStore,
  } = useRfiStore();

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
        setHierarchyNewInfoList(result.data.data);
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
        rfqIdInStore!,
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

  // const { setManageSupplierProfileUpdatePageNo } =
  // useManageSupplierProfileUpdateContext();

  const back = () => {
    setIsBuyerSelectionDisable(false);
    setSupplierIdInStore(null);
    // setManageSupplierProfileUpdatePageNo(1);
    setRfiTabNo(111);
  };

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
    setBankChequePathInStore,
    setNidPassportPathInStore,
    setSinaturePathInStore,
    setEtinPathInStore,
    profileNewInfoUidInStore,
    setSiteIdInStore,
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
    setRfiTabNo(11111);

    setSiteIdInStore(siteId);
    setSupplierIdInStore(supId);

    if (clickedItem) {
      console.log("item: ", clickedItem);
      setBankItem(clickedItem);
    }

    // setManageSupplierProfileUpdatePageNo(4);
  };

  // rfi feedback start

  const [approveModal, setApproveModal] = useState<boolean>(false);
  const [approveValue, setApproveValue] = useState<string>("");
  const onCLickApprove = () => {
    // setActionCode(1);
    setApproveModal(!approveModal);
    if (!approveModal) {
      setApproveValue("");
    }
  };

  useEffect(() => {
    getRfqList();
  }, []);

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

  const { setRfiManageSupplierPageNo, setRfiId, rfiId } =
    useRfiManageSupplierContext();

  const [supplierList, setSUpplierList] = useState<RfiSupplierInterface[] | []>(
    []
  );

  const [propicPath, setPropicPath] = useState<string>("");

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

  const getRfqList = async () => {
    // setIsLoading(true);
    console.log("userId: ", userId);
    console.log("supId, ", rfqIdInStore);

    try {
      const result = await RfiSupplierListService(
        token!,
        null,
        userId,
        0,
        rfqIdInStore
      );
      console.log(result.data);

      if (result.data.status === 200) {
        console.log(result.data.data);
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

  // rfi feedback end

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

          <div className="h-10"></div>

          {supplierList.map((e, i) => (
            <div
              key={e.ID}
              className=" p-4 w-full  bg-white shadow-sm rounded-md border-[0.1px] border-gray-200 flex space-x-4 items-start"
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

                <p className=" smallText">Query: {e.INITIATOR_NOTE}</p>
              </div>
            </div>
          ))}

          <div className="">
            <div className=" w-full my-10 ">
              <CommonButton
                titleText="Feed Back"
                height="h-10"
                width="w-44"
                color="bg-midGreen"
                onClick={onCLickApprove}
              />
            </div>
          </div>
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
            {rfiError.approveVal && (
              <ValidationError title={rfiError.approveVal} />
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
            onClick={sendRfi}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      {/* approve modal */}
    </div>
  );
}
