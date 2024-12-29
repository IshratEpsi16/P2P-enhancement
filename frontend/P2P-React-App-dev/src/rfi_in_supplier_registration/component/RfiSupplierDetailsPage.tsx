import React, { useState, useRef, useEffect } from "react";
import PageTitle from "../../common_component/PageTitle";
import NavigationPan from "../../common_component/NavigationPan";
import CommonButton from "../../common_component/CommonButton";

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

import { useRfiManageSupplierContext } from "../context/RfiManageSupplierContext";
import RfiBasicInfoPage from "./basic_info/RfiBasicInfoPage";
import RfiDeclarationPage from "./declaration/RfiDeclarationPage";
import { RfiDocumentApprovalViewProvider } from "../context/RfiDocumentPageContext";
import RfiDocumentHome from "./document/RfiDocumentHome";
import { RfiSiteApprovalViewProvider } from "../context/RfiSiteApprovalViewContext";
import RfiSiteHomeAprrovalViewPage from "../site/RfiSiteHomeAprrovalViewPage";
import { RfiContactViewApprovalProvider } from "../context/RfiContactApprovalViewContext";
import RfiContactHomeApprovalViewPage from "../contact/RfiContactHomeApprovalViewPage";
import { RfiBankViewApprovalProvider } from "../context/RfiBankApprovalViewContext";
import RfiBankHomeApprovalViewPage from "../bank/RfiBankHomeApprovalViewPage";
import RfiAddUpdateService from "../../manage_supplier_profile_update/service/rfi/RfiAddUpdateService";
import RfiSupplierListService from "../service/RfiSupplierListService";
import RfiSupplierInterface from "../interface/RfiSupplierInterface";
import isoToDateTime from "../../utils/methods/isoToDateTime";
import UserCircleIcon from "../../icons/userCircleIcon";
import ValidationError from "../../Alerts_Component/ValidationError";
import useRfiStore from "../store/RfiStore";
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
];

export default function RfiSupplierDetailsPage() {
  const [selectedButton, setSelectedButton] = useState<number>(100);
  const [page, setPage] = useState<number>(100);
  const { token, supplierId, userId } = useAuth();

  const handleButton = (buttonId: number) => {
    setSelectedButton(buttonId);
    setPage(buttonId);
  };
  const { setRfiManageSupplierPageNo, rfiId } = useRfiManageSupplierContext();
  const back = () => {
    // setRfiManageSupplierPageNo(1);
    setRfiTabNo(11);
  };

  const { setRfiTabNo } = useRfiStore();

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

  const [isRfiLoading, setIsRfiLoading] = useState<boolean>(false);

  const sendRfi = async () => {
    if (validateRfi()) {
      setApproveModal(false);
      setIsRfiLoading(true);
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
            setIsRfiLoading(false);
            back();
          }, 3100);
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

  useEffect(() => {
    getSupplierList();
  }, []);

  const [supplierList, setSUpplierList] = useState<RfiSupplierInterface[] | []>(
    []
  );

  const [propicPath, setPropicPath] = useState<string>("");

  const getSupplierList = async () => {
    // setIsLoading(true);
    console.log(userId);

    try {
      const result = await RfiSupplierListService(
        token!,
        null,
        userId,
        0,
        supplierId
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
      {isRfiLoading ? (
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
          <div className=" h-4"></div>
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
          <div className=" h-6"></div>
          <div className="w-full  border-[1px] ring-[#424242] px-4 py-4 rounded-md">
            {(() => {
              switch (page) {
                case 100:
                  return <RfiBasicInfoPage />;
                case 110:
                  return (
                    <RfiDocumentApprovalViewProvider>
                      <RfiDocumentHome />
                    </RfiDocumentApprovalViewProvider>
                  );
                case 120:
                  return <RfiDeclarationPage />;

                case 130:
                  return (
                    <RfiContactViewApprovalProvider>
                      <RfiContactHomeApprovalViewPage />
                    </RfiContactViewApprovalProvider>
                  );
                case 140:
                  return (
                    <RfiSiteApprovalViewProvider>
                      <RfiSiteHomeAprrovalViewPage />
                    </RfiSiteApprovalViewProvider>
                  );
                case 150:
                  return (
                    <RfiBankViewApprovalProvider>
                      <RfiBankHomeApprovalViewPage />
                    </RfiBankViewApprovalProvider>
                  );

                default:
                  return null;
              }
            })()}
          </div>
          <div className="w-full my-10">
            {supplierList.map((e, i) => (
              <div
                key={e.ID}
                className=" p-4 w-full  bg-white shadow-sm rounded-md border-[0.1px] border-gray-200 flex space-x-4 items-start
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
                  <p className=" smallText">Query: {e.INITIATOR_NOTE}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className=" w-full my-10 ">
        <CommonButton
          titleText="Feed Back"
          width="w-44"
          color="bg-midGreen"
          onClick={onCLickApprove}
          disable={isRfiLoading}
        />
      </div>

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
