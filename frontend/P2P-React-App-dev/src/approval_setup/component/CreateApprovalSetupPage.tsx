import React, { useState, useRef, useEffect } from "react";
import PageTitle from "../../common_component/PageTitle";
import { useApprovalSetupContext } from "../context/ApprovalSetupContext";
import CommonButton from "../../common_component/CommonButton";
import InputLebel from "../../common_component/InputLebel";
import CommonInputField from "../../common_component/CommonInputField";
import DropDown from "../../common_component/DropDown";
import EditIcon from "../../icons/EditIcon";

//keep react
import { Button, Modal } from "keep-react";
import {
  CloudArrowUp,
  PlusCircle,
  UploadSimple,
  TrashSimple,
} from "phosphor-react";

//drop down
import { CaretRight } from "phosphor-react";
import { Dropdown, TextInput } from "keep-react";
import SearchIcon from "../../icons/SearchIcon";
//drop down

//keep react

import ApproverInterface from "../interface/ApproverInterface";
import EmployeeListService from "../service/EmployeeListService";
import { useAuth } from "../../login_both/context/AuthContext";
import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";
import ErrorToast, { showErrorToast } from "../../Alerts_Component/ErrorToast";
import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";
import ApproverAddUpdateService from "../service/ApproverAddUpdateService";
import ApproverSequenceInterface from "../interface/ApproverSequenceInterface";
import ApproverSequenceListService from "../service/ApproverSequenceListService";
import LogoLoading from "../../Loading_component/LogoLoading";
import DeleteApproverSequenceService from "../service/DeleteApproverSequenceService";
import DeleteModal from "../../common_component/DeleteModal";
import ModuleListService from "../service/ModuleListService";
import ModuleInterface from "../interface/ModuleInterface";
import TemplateDetailsInterface from "../interface/TemplateDetailsInterface";
import TemplateDetailsService from "../service/TemplateDetailsService";
import CreateTemplateService from "../service/CreateTemplateService";
import CheckIcon from "../../icons/CheckIcon";
import ValidationError from "../../Alerts_Component/ValidationError";
import DeleteIcon from "../../icons/DeleteIcon";
import NewDeleteModal from "../../common_component/NewDeleteModal";
import AddIcon from "../../icons/AddIcon";
import useApprovalSetupStore from "../store/ApprovalSetupStore";
import fetchFileUrlService from "../../common_service/fetchFileUrlService";
const options = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

interface DropDownInterface {
  value: string;
  label: string;
}

const loppList = [1, 2, 3, 4, 4, 4, 4, 4, 4, 4, 4];

export default function CreateApprovalSetupPage() {
  const templateNameRef = useRef<HTMLInputElement | null>(null);
  const approverSequenceRef = useRef<HTMLInputElement | null>(null);
  const approverStatusRef = useRef<HTMLInputElement | null>(null);

  const [templateName, setTemplateName] = useState<string>("");

  //approver
  const [approverSequence, setApproverSequence] = useState<string>("");
  const [approverStatus, setApproverStatus] = useState<string>("");

  const [approverList, setApproverList] = useState<ApproverInterface[] | []>(
    []
  );
  const [approverList2, setApproverList2] = useState<ApproverInterface[] | []>(
    []
  );
  const [approverProfilePicPath, setApproverProfilePicPath] =
    useState<string>("");
  const [isApproverLoading, setIsApproverLoading] = useState<boolean>(false);
  const { token } = useAuth();

  const [profilePicOnePath, setProfilePicOnePath] = useState<string>("");

  // store

  const { approvalTemplateInStore } = useApprovalSetupStore();

  // store

  useEffect(() => {
    console.log(templateId);
    console.log("approval list", approvalTemplateInStore);
    getModuleList();
    getApproverSequenceList();
    getApproverList();
  }, []);

  //template details

  const [templateDetails, setTemplateDetails] =
    useState<TemplateDetailsInterface | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getTemplateDetails = async () => {
    setIsLoading(true);
    try {
      const result = await TemplateDetailsService(token!, templateId!);
      if (result.data.status === 200) {
        setIsLoading(false);

        setTemplateDetails(result.data.data);

        // const convertedData = result.data.data.map(
        //   (module: ModuleInterface) => ({
        //     value: module.MODULE_ID.toString(),
        //     label: module.MODULE_NAME,
        //   })
        // );
        // setModuleList(convertedData);
        const selected = moduleList.find(
          (mod: DropDownInterface) =>
            mod.value === result.data.data.MODULE_TYPE_ID.toString()
        );
        setSelectedTemplateFunction(selected!.value);
      } else {
        setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const setTemplateNameFromDetails = () => {
    if (templateDetails && templateNameRef.current) {
      templateNameRef.current.value =
        templateDetails?.APPROVAL_STAGE_NAME || "";
      setTemplateName(templateDetails?.APPROVAL_STAGE_NAME!);
    }
  };

  useEffect(() => {
    if (templateDetails) {
      setTemplateNameFromDetails();
    }
  }, [templateDetails]);

  const [selectedTemplateFunction, setSelectedTemplateFunction] =
    useState<string>("");

  //drop
  const handleSelectFunction = (value: string) => {
    console.log(`Selected: ${value}`);

    setSelectedTemplateFunction(value);

    // Do something with the selected value
  };
  //drop

  //module list

  const [isModuleLoading, setIsModuleLoading] = useState<boolean>(false);
  const [moduleList, setModuleList] = useState<DropDownInterface[] | []>([]);

  useEffect(() => {
    getTemplateDetails();
  }, [moduleList]);

  const getModuleList = async () => {
    setIsModuleLoading(true);
    try {
      const result = await ModuleListService(token!);
      if (result.data.status === 200) {
        setIsModuleLoading(false);

        const convertedData = result.data.data.map(
          (module: ModuleInterface) => ({
            value: module.MODULE_ID.toString(),
            label: module.MODULE_NAME,
          })
        );

        setModuleList(convertedData);
        //getTemplateDetails();
      } else {
        setIsModuleLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsModuleLoading(false);
    }
  };

  const getApproverList = async () => {
    setIsApproverLoading(true);
    try {
      const result = await EmployeeListService(token!);
      console.log(result.data.profile_pic);

      if (result.data.status === 200) {
        setIsApproverLoading(false);
        setApproverProfilePicPath(result.data.profile_pic);
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

  //update template

  const [isUpdateLoading, setIsUpdateLoading] = useState<boolean>(false);

  const updateTemplate = async () => {
    setIsUpdateLoading(true);
    try {
      const result = await CreateTemplateService(
        token!,
        templateName,
        null,
        templateId,
        approvalTemplateInStore?.APPROVAL_FLOW_TYPE!,
        approvalTemplateInStore?.BUYER_DEPARTMENT!,
        approvalTemplateInStore?.CURRENCY_CODE!,
        approvalTemplateInStore?.CURRENCY_NAME!,
        approvalTemplateInStore?.ORG_ID!,
        approvalTemplateInStore?.ORG_NAME!,
        approvalTemplateInStore?.MIN_AMOUNT!,
        approvalTemplateInStore?.MAX_AMOUNT!
      ); //update a null function, r template id jabe
      if (result.data.status === 200) {
        setIsUpdateLoading(false);
        showSuccessToast(result.data.message);
        getModuleList();
        getApproverSequenceList();
        getApproverList();
        // getTemplateDetails()
      } else {
        setIsCreateTemplateLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsUpdateLoading(false);
      showErrorToast("Somthing went wrong");
    }
  };

  const [isSequenceLoading, setIsSequenceLoading] = useState<boolean>(false);

  const [approverSequenceList, setApproverSequenceList] = useState<
    ApproverSequenceInterface[] | []
  >([]);

  const getApproverSequenceList = async () => {
    setIsSequenceLoading(true);
    try {
      const result = await ApproverSequenceListService(token!, templateId!);
      console.log(result.data);

      if (result.data.status === 200) {
        setIsSequenceLoading(false);
        const sorted = result.data.data.sort(
          (a: any, b: any) => a.STAGE_LEVEL - b.STAGE_LEVEL
        );
        setApproverSequenceList(sorted);
        setProfilePicOnePath(result.data.profile_pic);
      } else {
        setIsSequenceLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsSequenceLoading(false);
      showErrorToast("Smothing went wrong in sequence");
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

  const handleApproverSequence = (value: string) => {
    setApproverSequence(value);
  };
  const handleApproverStatus = (value: string) => {
    setApproverStatus(value);
  };
  //approver

  const handleTemplateChange = (value: string) => {
    setTemplateName(value);
  };

  //modal
  const [showApproverAddModal, setShowApproverAddModal] = useState(false);
  const openCloseApproverModal = () => {
    setShowApproverAddModal(!showApproverAddModal);

    clearAddApproverModal();
  };

  const clearAddApproverModal = () => {
    setApproverId(null);
    setApproverSequence("");
    if (approverSequenceRef.current) {
      approverSequenceRef.current.value = "";
    }
  };
  const [showUserAddModal, setShowUserAddModal] = useState(false);
  const openCloseUserModal = () => {
    setShowUserAddModal(!showUserAddModal);
  };

  //modal

  //drop down
  const handleSelect = (value: string) => {
    console.log(`Selected: ${value}`);
    // Do something with the selected value
  };

  //drop down

  //create template
  const [isTemplateCreateLoading, setIsCreateTemplateLoading] =
    useState<boolean>(false);

  const [approverId, setApproverId] = useState<number | null>(null);
  const handleApproverIdChange = (uId: number) => {
    setApproverId(uId);
    console.log(uId);
  };

  //delete sequence

  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  const openDeleteModal = (sequenceListid: number) => {
    // console.log(id);

    setApproverSequenceListId(sequenceListid);
    setIsDeleteOpen(true);
  };
  const closeModal = () => {
    setApproverSequenceListId(null);
    setIsDeleteOpen(false);
  };
  const deleteApproverSequence = async () => {
    try {
      const result = await DeleteApproverSequenceService(
        token!,
        approverSequenceListId!
      );
      if (result.data.status === 200) {
        showSuccessToast(result.data.message);
        getApproverSequenceList();
      } else {
        showSuccessToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Something went wrong");
    }
  };

  //sequence id edit er somoy pabo and vlaue set korte hbe
  const [approverSequenceListId, setApproverSequenceListId] = useState<
    number | null
  >(null);

  const setSequenceDataToEdit = (
    sequenceListid: number,
    approverId: number,
    sequenceNumber: number,
    isMustApprove: number
  ) => {
    setApproverSequenceListId(sequenceListid);
    setApproverId(approverId);
    if (approverSequenceRef.current) {
      approverSequenceRef.current.value = sequenceNumber.toString();
      setApproverSequence(sequenceNumber.toString());
    }
    if (isMustApprove === 1) {
      setIsMustApprove(true);
    }
    setShowApproverAddModal(true);
  };

  //must approve
  const [isMustApprove, setIsMustApprove] = useState<boolean>(false);
  //must approve

  //validate add approver modal
  const [addApproverError, setAddApproverError] = useState<{
    sequnce?: string;
    approver?: string;
  }>({});

  //validation
  const validateAddApproverModal = () => {
    const errors: { sequnce?: string; approver?: string } = {};

    if (!approverSequence.trim()) {
      errors.sequnce = "Please Enter Sequence No";
    }
    if (approverId === null) {
      errors.approver = "Please Select An Approver";
    }

    setAddApproverError(errors);

    return Object.keys(errors).length === 0;
  };

  const createTemplateApprover = async () => {
    if (validateAddApproverModal()) {
      setIsCreateTemplateLoading(true);
      try {
        const result = await ApproverAddUpdateService(
          token!,
          approverSequenceListId,
          templateId!,
          approverId!,
          parseInt(approverSequence),
          parseInt(approverSequence),
          0, //isMustApprove?1:0,
          1
        );
        if (result.data.status === 200) {
          setIsCreateTemplateLoading(false);
          setShowApproverAddModal(false);
          showSuccessToast(result.data.message);
          //call list
          getApproverSequenceList();
          clearAddApproverModal();
        } else {
          setIsCreateTemplateLoading(false);
          setShowApproverAddModal(false);
          showErrorToast(result.data.message);
        }
      } catch (error) {
        setIsCreateTemplateLoading(false);
        setShowApproverAddModal(false);
        showErrorToast("Something went wrong");
      }
    }
  };

  //create template

  //context
  const { setApprovalSetupPageNo, templateId } = useApprovalSetupContext();
  const backToPreviousPage = () => {
    setApprovalSetupPageNo(1);
  };
  //context

  // handle approver and user add update togghle

  const [isApprover, setIsApprover] = useState<boolean>(true);
  const [isUser, setIsUser] = useState<boolean>(false);

  const handleApproverChange = () => {
    // setIsApprover(!isApprover);
    // if (isUser) {
    //     setIsUser(false);
    // }
  };
  const handleUserChange = () => {
    setIsUser(!isUser);
    if (isApprover) {
      setIsApprover(false);
    }
  };

  //single add approver and user

  const toggleSingleAdd = () => {
    if (isApprover) {
      openCloseApproverModal();
    }
    // else if(isUser){
    //     openCloseUserModal();
    // }
    else {
      return null;
    }
  };

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
    if (approverSequenceList) {
      const fetchImages = async () => {
        const newImageUrls: ImageUrls = {};
        for (let index = 0; index < approverSequenceList.length; index++) {
          const element = approverSequenceList[index];
          const url = await getImage2(
            profilePicOnePath,
            element.PROPIC_FILE_NAME!
          );
          newImageUrls[element.ID] = url;
        }
        setImageUrls(newImageUrls);
        // setIsLoading(false);
      };
      fetchImages();
    }
  }, [approverSequenceList, profilePicOnePath]);

  return (
    <div className=" m-8 bg-whiteColor">
      {
        <>
          <SuccessToast />
          {/* <DeleteModal
            isOpen={isDeleteOpen}
            doDelete={deleteApproverSequence}
            closeModal={closeModal}
            message=" Delete Approver ?"
          /> */}
          <NewDeleteModal
            isOpen={isDeleteOpen}
            action={deleteApproverSequence}
            closeModal={closeModal}
            message=" "
          />
          <div className=" flex items-center justify-between mb-4">
            <PageTitle titleText="Approval Template" />
            <CommonButton
              onClick={backToPreviousPage}
              titleText="Back"
              color="bg-midGreen"
              width="w-24"
            />
          </div>
          <div className=" flex items-center justify-between mb-4">
            <div className=" space-y-1">
              <InputLebel titleText={"Template Name"} />
              <CommonInputField
                inputRef={templateNameRef}
                onChangeData={handleTemplateChange}
                hint="Template Name"
                type="text"
                width="w-96"
                height="py-2"
              />
            </div>
            <div className=" space-y-1">
              <InputLebel titleText={"Select Function"} />
              {isModuleLoading ? (
                <div className=" flex w-96 justify-center items-center">
                  <CircularProgressIndicator />
                </div>
              ) : (
                <DropDown
                  disable={templateId ? true : false}
                  options={moduleList}
                  onSelect={handleSelectFunction}
                  width="w-96"
                  height="h-11"
                  sval={selectedTemplateFunction}
                />
              )}
            </div>
            <div className=" space-y-1">
              <div className="h-5"></div>
              {isUpdateLoading ? (
                <div className=" w-24 flex  justify-center items-center">
                  <CircularProgressIndicator />
                </div>
              ) : (
                <CommonButton
                  onClick={updateTemplate}
                  titleText="Update"
                  color="bg-midGreen"
                  width="w-24"
                  height="h-10"
                />
              )}
            </div>
          </div>

          <div className=" w-full my-4 mt-6 rounded-[2px] ring-[0.5px] ring-midBlack p-[1px] shadow-[2px]">
            <div className=" w-full px-4 my-1  h-12 flex justify-between  items-center bg-whiteColor">
              <div className=" flex-1 h-full py-1  flex flex-row space-x-4 justify-start items-center">
                {/* <button
                  onClick={handleApproverChange}
                  className={`smallText h-full px-2 rounded-t-md bg-blue-100 ${
                    isApprover
                      ? "border-b-[1px] border-midBlack"
                      : "border-none"
                  }`}
                >
                  <p className=" text-sm font-mon text-gray-500">
                    Approval Sequence
                  </p>
                </button> */}
                {/* <button
                            onClick={handleUserChange}
                            className={`smallText h-full px-8 rounded-t-md bg-borderColor ${isUser ? 'border-b-[1px] border-midBlack' : 'border-none'}`}
                        >
                            User
                        </button> */}
              </div>
              <div className="w-56 h-full py-1  flex flex-row space-x-4 justify-end items-center">
                {/* <button
                  onClick={toggleSingleAdd}
                  className="h-full rounded-t-md bg-borderColor px-4"
                >
                  <PlusCircle size={26} color="green" />
                </button> */}
                <button
                  onClick={toggleSingleAdd}
                  className=" flex space-x-2 items-center py-2 px-4  border-[1px] border-borderColor rounded-md bg-blue-100"
                >
                  <div className=" w-5 h-5">
                    <AddIcon className=" text-gray-500 w-full h-full " />
                  </div>
                  <p className=" text-sm text-gray-500 font-mon">
                    Add Approver
                  </p>
                </button>
              </div>
            </div>

            <div className=" w-full px-4 py-2  bg-whiteColor">
              {isApprover ? (
                <>
                  {
                    <div className="overflow-auto max-h-[400px] rounded-lg shadow-lg custom-scrollbar">
                      <table className="min-w-full divide-y divide-gray-200 rounded-lg">
                        <thead className="bg-[#CAF4FF] sticky top-0 ">
                          <tr>
                            <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                              SEQUENCE
                            </th>
                            <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                              Picture
                            </th>
                            <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                              APPROVER NAME
                            </th>
                            <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                              Banner Type
                            </th>
                          </tr>
                        </thead>

                        {approverSequenceList.map((e, i) => (
                          <tbody className="bg-white divide-y divide-gray-200">
                            <tr key={e.ID}>
                              <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                                <div className="w-full overflow-auto custom-scrollbar text-center">
                                  {e.STAGE_LEVEL}
                                </div>
                              </td>
                              <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar ">
                                <div className="w-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                                  {e.PROPIC_FILE_NAME === "" ? (
                                    <div className="w-10 h-10 rounded-full border-[1px] border-gray-400 flex items-center justify-center">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-6 h-6 "
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                                        />
                                      </svg>
                                    </div>
                                  ) : (
                                    <img
                                      // src={`${profilePicOnePath}/${e.PROPIC_FILE_NAME}`}

                                      src={imageUrls[e.ID]!}
                                      alt="avatar"
                                      className=" h-10 w-10 rounded-full bg-cover"
                                    />
                                  )}
                                </div>
                              </td>
                              <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar ">
                                <div className="w-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                                  {!e.APPROVER_FULL_NAME
                                    ? e.APPROVER_USER_NAME
                                    : e.APPROVER_FULL_NAME}{" "}
                                  {e.BUYER_ID && ` (${e.BUYER_ID})`}
                                </div>
                              </td>
                              <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                <div className="w-full overflow-auto custom-scrollbar text-center">
                                  <div className=" w-full flex  justify-center space-x-6">
                                    <button
                                      className=" py-2 px-2 rounded-md shadow-sm border-borderColor border-[0.5px]"
                                      onClick={() => {
                                        setSequenceDataToEdit(
                                          e.ID,
                                          e.APPROVER_ID,
                                          e.STAGE_LEVEL,
                                          e.IS_MUST_APPROVE
                                        );
                                      }}
                                    >
                                      <EditIcon />
                                    </button>

                                    <button
                                      onClick={() => {
                                        openDeleteModal(e.ID);
                                      }}
                                      className=" py-2 px-2 rounded-md shadow-sm border-borderColor border-[0.5px]"
                                    >
                                      <DeleteIcon />
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        ))}

                        <tfoot className="bg-white sticky bottom-0">
                          <tr>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    // <table
                    //   className="min-w-full divide-y divide-borderColor border-[0.2px] border-borderColor rounded-md"
                    //   style={{ tableLayout: "fixed" }}
                    // >
                    //   <thead className=" sticky top-0 bg-[#F4F6F8] h-14">
                    //     <tr>
                    //       <th className="font-mon px-8 py-3 text-center text-sm font-medium text-blackColor  whitespace-nowrap ">
                    //         SEQUENCE
                    //       </th>
                    //       <th className="font-mon px-8 py-3 text-center text-sm font-medium text-blackColor  tracking-wider">
                    //         APPROVER NAME
                    //       </th>

                    //       <th className="   font-mon  px-8 py-3 text-center text-sm font-medium text-blackColor tracking-wider "></th>
                    //     </tr>
                    //   </thead>

                    //   {isSequenceLoading ? (
                    //     <tbody>
                    //       <td></td>
                    //       <td>
                    //         <LogoLoading />
                    //       </td>
                    //       <td></td>
                    //     </tbody>
                    //   ) : !isSequenceLoading &&
                    //     approverSequenceList.length === 0 ? (
                    //     <tbody>
                    //       <td></td>
                    //       <td>
                    //         <p className=" mediumText my-10">
                    //           Add Approver Here.
                    //         </p>
                    //       </td>
                    //       <td></td>
                    //     </tbody>
                    //   ) : (
                    //     approverSequenceList.map((e, i) => (
                    //       <tbody
                    //         key={e.ID}
                    //         className="bg-white divide-y divide-gray-200 hover:bg-lightGreen"
                    //       >
                    //         <td className="font-mon px-8 py-3 text-center text-sm font-medium text-blackColor  whitespace-nowrap ">
                    //           {e.STAGE_LEVEL}
                    //         </td>
                    //         <td className="font-mon px-8 py-3 text-center text-sm font-medium text-blackColor  whitespace-nowrap ">
                    //           {!e.APPROVER_FULL_NAME
                    //             ? e.APPROVER_USER_NAME
                    //             : e.APPROVER_FULL_NAME}
                    //         </td>

                    //         <td
                    //           className="font-mon px-8 py-3 text-end text-sm font-medium text-blackColor
                    //                                 whitespace-nowrap  "
                    //         >
                    //           <div className=" w-full flex  justify-end space-x-6">
                    //             <button
                    //               onClick={() => {
                    //                 setSequenceDataToEdit(
                    //                   e.ID,
                    //                   e.APPROVER_ID,
                    //                   e.STAGE_LEVEL,
                    //                   e.IS_MUST_APPROVE
                    //                 );
                    //               }}
                    //             >
                    //               <EditIcon className=" text-midBlue" />
                    //             </button>
                    //             <button
                    //               onClick={() => {
                    //                 openDeleteModal(e.ID);
                    //               }}
                    //             >
                    //               <TrashSimple size={24} color="red" />
                    //             </button>
                    //           </div>
                    //         </td>
                    //       </tbody>
                    //     ))
                    //   )}
                    // </table>
                  }
                </>
              ) : (
                <>
                  {
                    <table
                      className="min-w-full divide-y divide-borderColor border-[0.2px] border-borderColor rounded-md"
                      style={{ tableLayout: "fixed" }}
                    >
                      <thead className=" sticky top-0 bg-[#F4F6F8] h-14">
                        <tr>
                          <th className="font-mon px-8 py-3 text-center text-sm font-medium text-blackColor  whitespace-nowrap ">
                            SERIAL
                          </th>
                          <th className="font-mon px-8 py-3 text-center text-sm font-medium text-blackColor  tracking-wider">
                            USER NAME
                          </th>

                          <th className="   font-mon  px-8 py-3 text-center text-sm font-medium text-blackColor tracking-wider "></th>
                        </tr>
                      </thead>

                      {approverSequenceList.map((e, i) => (
                        <tbody
                          key={e.ID}
                          className="bg-white divide-y divide-gray-200 hover:bg-lightGreen"
                        >
                          <td className="font-mon px-8 py-3 text-center text-sm font-medium text-blackColor  whitespace-nowrap ">
                            {i + 1}
                          </td>
                          <td className="font-mon px-8 py-3 text-center text-sm font-medium text-blackColor  whitespace-nowrap ">
                            {e.APPROVER_FULL_NAME}
                          </td>
                          <td
                            className="font-mon px-8 py-3 text-end text-sm font-medium text-blackColor 
                                                whitespace-nowrap  "
                          >
                            <div className=" w-full flex  justify-end space-x-6">
                              <button>
                                <EditIcon className=" text-midBlue" />
                              </button>
                              <button>
                                <TrashSimple size={24} color="red" />
                              </button>
                            </div>
                          </td>
                        </tbody>
                      ))}
                    </table>
                  }
                </>
              )}
            </div>
          </div>

          {/* modal code for add approval here */}

          <Modal
            icon={<CloudArrowUp size={28} color="#1B4DFF" />}
            size="lg"
            show={showApproverAddModal}
            position="center"
          >
            <Modal.Header className=" font-mon">
              {approverId ? (
                <p>Update Approval Sequence</p>
              ) : (
                <p>Add Approval Sequence</p>
              )}
            </Modal.Header>
            <Modal.Body>
              <div className="space-y-3 h-180 ">
                <CommonInputField
                  type="text"
                  onChangeData={handleApproverSequence}
                  inputRef={approverSequenceRef}
                  hint="Sequence Number"
                  height="py-2"
                  width="w-full"
                  bgColor="bg-whiteColor"
                />
                {addApproverError.sequnce && (
                  <ValidationError title={addApproverError.sequnce} />
                )}
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
                <div className=" w-full h-48 overflow-y-auto">
                  {approverList.map((e, i) => (
                    <button
                      onClick={() => {
                        handleApproverIdChange(e.USER_ID);
                      }}
                      key={e.USER_ID}
                      className={`w-full h-10 shadow-sm px-2 my-2  border-[1px]   justify-start ${
                        approverId === e.USER_ID
                          ? " bg-midGreen text-whiteColor font-mon text-sm"
                          : "smallText bg-whiteColor"
                      }  items-center rounded-[2px] flex space-x-1`}
                    >
                      {!e.FULL_NAME ? e.USER_NAME : e.FULL_NAME}
                    </button>
                  ))}
                </div>
                {addApproverError.approver && (
                  <ValidationError title={addApproverError.approver} />
                )}
                {/*             
            <button 
            onClick={()=>{setIsMustApprove(!isMustApprove)}}
            className=" w-full flex space-x-2 items-center">
                  <div className={`w-4 h-4 border-[1px]  rounded-[2px] ${isMustApprove?"bg-midGreen border-none":"border-borderColor bg-whiteColor"} flex justify-center items-center`}>
                    <div className=" h-3 w-3">
                    <CheckIcon className=" h-full w-full text-white"/>
                    </div>

                  </div>
                  <p className=" smallText">Must Approve ?</p>
            </button> */}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                type="outlineGray"
                className=" font-mon h-8 font-medium"
                onClick={openCloseApproverModal}
              >
                Cancel
              </Button>
              {isTemplateCreateLoading ? (
                <div className=" ">
                  <CircularProgressIndicator />
                </div>
              ) : (
                <Button
                  className=" bg-midGreen text-whiteColor font-mon h-8 font-medium"
                  onClick={createTemplateApprover}
                >
                  Confirm
                </Button>
              )}
            </Modal.Footer>
          </Modal>

          {/* modal code for add approval here */}
          {/* modal code for add user here */}

          <Modal
            icon={<CloudArrowUp size={28} color="#1B4DFF" />}
            size="lg"
            show={showUserAddModal}
            position="center"
          >
            <Modal.Header className=" font-mon">
              Add User To Template
            </Modal.Header>
            <Modal.Body>
              <div className="space-y-3 h-64 ">
                {/* <CommonInputField type='text' onChangeData={handleApproverSequence} inputRef={approverSequenceRef} hint='Sequence Number' height='py-2' width='w-full' bgColor='bg-whiteColor' /> */}
                <div className=" w-full h-10 flex items-center space-x-[0.1px]">
                  <input
                    type="text"
                    className=" flex-1 h-full border-[0.5px] border-borderColor outline-[0.1px] outline-midBlue px-2 placeholder:text-graishColor placeholder:text-sm placeholder:font-mon"
                    placeholder="Search Approver"
                  />
                  <button className=" px-4 h-full flex justify-center items-center bg-midBlue rounded-[2px]">
                    <SearchIcon className=" text-whiteColor" />
                  </button>
                </div>
                <div className=" w-full h-48 overflow-y-auto">
                  {isApproverLoading ? (
                    <div className=" flex w-full h-48 justify-center items-center">
                      <CircularProgressIndicator />
                    </div>
                  ) : (
                    approverList.map((e, i) => (
                      <button
                        key={i}
                        className={`w-full h-10 shadow-sm px-2 my-2  border-[1px]   justify-start ${
                          approverId === e.USER_ID
                            ? " bg-midGreen text-whiteColor font-mon text-sm"
                            : "smallText bg-whiteColor"
                        }  items-center rounded-[2px] flex space-x-1`}
                      >
                        {/* <img src={`${approverProfilePicPath}/${e.PROPIC_FILE_NAME}`} alt={e.PROPIC_ORG_FILE_NAME}
                                    className=' w-6 h-6 rounded-full'
                                    /> */}
                        {e.FULL_NAME}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                type="outlineGray"
                className=" font-mon h-8 font-medium"
                onClick={openCloseUserModal}
              >
                Cancel
              </Button>
              <Button
                className=" bg-midGreen text-whiteColor font-mon h-8 font-medium"
                onClick={openCloseUserModal}
              >
                Confirm
              </Button>
            </Modal.Footer>
          </Modal>

          {/* modal code for add user here */}
        </>
      }
    </div>
  );
}
