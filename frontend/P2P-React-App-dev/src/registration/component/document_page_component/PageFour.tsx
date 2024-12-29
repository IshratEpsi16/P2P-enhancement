import React, { useRef, useState, useEffect } from "react";
import InputLebel from "../../../common_component/InputLebel";
import FilePickerInput from "../../../common_component/FilePickerInput";
import { useDocumentPageContext } from "../../context/DocumentPageContext";
import CommonButton from "../../../common_component/CommonButton";

import CircularProgressIndicator from "../../../Loading_component/CircularProgressIndicator";
import moment from "moment";
import SuccessToast, {
  showSuccessToast,
} from "../../../Alerts_Component/SuccessToast";
import ErrorToast, {
  showErrorToast,
} from "../../../Alerts_Component/ErrorToast";
import ExistingDocumentService from "../../service/document/ExistingDocumentService";
import LogoLoading from "../../../Loading_component/LogoLoading";
import { useAuth } from "../../../login_both/context/AuthContext";
import { PageFourInterface } from "../../interface/RegistrationInterface";
import AddUpdatePageFourService from "../../service/document/page_four/AddUpdatePageFourService";
import { useNavigate } from "react-router-dom";
import { isTokenValid } from "../../../utils/methods/TokenValidityCheck";
import ValidationError from "../../../Alerts_Component/ValidationError";
import PageTitle from "../../../common_component/PageTitle";
import ProfileUpdateSubmissionService from "../../service/profile_update_submission/ProfileUpdateSubmissionService";
import WarningModal from "../../../common_component/WarningModal";
import DeleteIcon from "../../../icons/DeleteIcon";
import DocumentFileRemoveService from "../../service/declaration/DocumentFileRemoveService";
import WarningIcon from "../../../icons/WarningIcon";
import fetchFileService from "../../../common_service/fetchFileService";

export default function PageFour() {
  const { page, setPage } = useDocumentPageContext();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imagePreview2, setImagePreview2] = useState<string | null>(null);

  const [pageFourDetails, setPageFourDetails] =
    useState<PageFourInterface | null>(null);

  //loading
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  //loading

  //token
  const {
    regToken,
    submissionStatus,
    isRegCompelte,
    token,
    setSubmissionStatus,
  } = useAuth();
  //token

  const navigate = useNavigate();

  //first time get

  useEffect(() => {
    const isTokenExpired = !isTokenValid(regToken!);
    if (isTokenExpired) {
      localStorage.removeItem("regToken");
      showErrorToast("Please Login Again..");
      setTimeout(() => {
        navigate("/");
      }, 3200);
    } else {
      GetExistingDocument();
    }
  }, []);

  //get exsiting docuent

  //re-render for set data

  useEffect(() => {
    if (pageFourDetails) {
      setData();
    }
  }, [pageFourDetails]);

  //disabling field
  const [isDisable, setIsDisable] = useState<boolean>(false);
  //disabling field

  //set disable

  useEffect(() => {
    if (submissionStatus === "DRAFT") {
      setIsDisable(false);
    } else {
      setIsDisable(true);
    }
  }, [submissionStatus]);

  // //set disable

  const GetExistingDocument = async () => {
    setIsLoading(true);
    try {
      const result = await ExistingDocumentService(regToken!, 4);
      console.log(result.data.data);

      if (result.data.status === 200) {
        setIsLoading(false);
        // showSuccessToast(result.data.message);
        setPageFourDetails(result.data);
      } else {
        setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      showErrorToast("Something went wrong");
    }
  };

  const setData = () => {
    if (pageFourDetails) {
      if (pageFourDetails.data.MACHINE_MANPOWER_LIST_FILE_NAME != null) {
        setMachineriesManpowerFileName(
          pageFourDetails.data.MACHINE_MANPOWER_LIST_ORIGINAL_FILE_NAME
        );
      }
      if (pageFourDetails.data.BUSINESS_PREMISES_FILE_NAME != null) {
        setBusinessPremisesFileName(
          pageFourDetails.data.BUSINESS_PREMISES_ORIGINAL_FILE_NAME
        );
      }
      if (pageFourDetails.data.PROFILE_PIC1_FILE_NAME != null) {
        setPhotographOneFileName(
          pageFourDetails.data.PROFILE_PIC1_ORIGINAL_FILE_NAME
        );
      }
      if (pageFourDetails.data.PROFILE_PIC2_FILE_NAME != null) {
        setPhotographTwoFileName(
          pageFourDetails.data.PROFILE_PIC2_ORIGINAL_FILE_NAME
        );
      }
    }
  };

  const [machineriesManpowerFileName, setMachineriesManpowerFileName] =
    useState<string | null>(null);
  const [machineriesManpowerFile, setMachineriesManpowerFile] =
    useState<File | null>(null);

  const handleMachineriesManpower = (file: File | null) => {
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file);
      setMachineriesManpowerFile(file);
    } else {
      // No file selected
      console.log("No file selected");
    }
  };

  const [businessPremisesFileName, setBusinessPremisesFileName] = useState<
    string | null
  >(null);

  const [businessPremisesFile, setBusinessPremisesFile] = useState<File | null>(
    null
  );

  const handleBusinessPremises = (file: File | null) => {
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file);
      setBusinessPremisesFile(file);
    } else {
      // No file selected
      console.log("No file selected");
    }
  };

  const [photographOneFileName, setPhotographOneFileName] = useState<
    string | null
  >(null);
  const [photographOneFile, setPhotographOneFile] = useState<File | null>(null);

  const handlePhotographOne = (file: File | null) => {
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file);
      setPhotographOneFile(file);

      // Read the selected file and create a URL for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result as string;
        setImagePreview(previewUrl);
      };
      reader.readAsDataURL(file);
    } else {
      // No file selected
      console.log("No file selected");
      // setImagePreview(null);
    }
  };

  const [photographTwoFileName, setPhotographTwoFileName] = useState<
    string | null
  >(null);
  const [photographTwoFile, setPhotographTwoFile] = useState<File | null>(null);

  const handlePhotographTwo = (file: File | null) => {
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file);
      setPhotographTwoFile(file);
      // Read the selected file and create a URL for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result as string;
        setImagePreview2(previewUrl);
      };
      reader.readAsDataURL(file);
    } else {
      // No file selected
      console.log("No file selected");
      // setImagePreview2(null);
    }
  };

  //validation

  const [pageFourError, setPageFourError] = useState<{
    photographOneFile?: string;
  }>({});

  const validate = () => {
    const erros: { photographOneFile?: string } = {};

    if (
      (photographOneFileName === null || photographOneFileName === "") &&
      photographOneFile === null
    ) {
      erros.photographOneFile = "Please Select Photograph of Owner-1.";
    }
    setPageFourError(erros);
    return Object.keys(erros).length === 0;
  };

  const submitAndNext = async () => {
    // setPage(4)
    // if (validate()) {
    setIsSubmitLoading(true);

    try {
      const result = await AddUpdatePageFourService(
        regToken!,
        machineriesManpowerFile,
        businessPremisesFile,
        photographOneFile,
        photographTwoFile,
        4
      );

      if (result.data.status === 200) {
        showSuccessToast(result.data.message);
        GetExistingDocument();
        // if (isRegCompelte !== "1") {
        setIsSubmitLoading(false);
        // setTimeout(() => {

        //   navigate(`/register/3`);
        // }, 3100);
        // }
      } else {
        setIsSubmitLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      //handle error
      setIsSubmitLoading(false);
      showErrorToast("Something went wrong");
    }
    // }
    // else {
    //   console.log("validation failed");
    // }
  };
  const previous = () => {
    setPage(3);
  };

  //final submission

  const [isWarningShowSubmit, setIsWarningShowSubmit] =
    useState<boolean>(false);

  const showWarning = async () => {
    setIsWarningShowSubmit(true);
  };
  const closeModalSubmit = () => {
    setIsWarningShowSubmit(false);
  };

  const [isFinalSubmissionLoading, setIsFinalSubmissionLoading] =
    useState<boolean>(false);

  const profileUpdateSubmission = async () => {
    try {
      const result = await ProfileUpdateSubmissionService(token!);
      console.log(result.data);

      if (result.data.status === 200) {
        showSuccessToast(result.data.message);
        setSubmissionStatus("SUBMIT");
        setIsDisable(true);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {}
  };

  //final submission

  // remove file modal start

  const [isOpenFileRemoveModal, setIsOpenFileRemoveModal] =
    useState<boolean>(false);
  const [fileToRemove, setFileToRemove] = useState<string | null>(null);
  const [fileTypeToRemove, setFileTypeToRemove] = useState<string | null>(null);

  const handleOpenModal = (fileName: string, fileType: string) => {
    setFileToRemove(fileName);
    setFileTypeToRemove(fileType);
    setIsOpenFileRemoveModal(true);
  };

  const handleConfirmDelete = async () => {
    if (fileTypeToRemove && fileToRemove) {
      switch (fileTypeToRemove) {
        case "machineries":
          await removeMachineries(fileToRemove);
          break;

        case "businessPremises":
          await removeBusinessPremises(fileToRemove);
          break;

        case "profilePic1":
          await removeProfilePic1(fileToRemove);
          break;

        case "profilePic2":
          await removeProfilePic2(fileToRemove);
          break;

        default:
          break;
      }
    }
    setIsOpenFileRemoveModal(false);
    setFileToRemove(null);
    setFileTypeToRemove(null);
  };

  const handleCloseModal = () => {
    setIsOpenFileRemoveModal(false);
    setFileToRemove(null);
    setFileTypeToRemove(null);
  };

  // remove file modal end

  // remove file start

  const removeMachineries = async (removeFileName: string) => {
    // setIsOpenFileRemoveModal(true);

    setIsLoading(true);
    console.log("fileName function: ", removeFileName);

    const result = await DocumentFileRemoveService(
      regToken!,
      "xxp2p_supplier_registration_documents",
      "MACHINE_MANPOWER_LIST_FILE_NAME",
      "MACHINE_MANPOWER_LIST_ORIGINAL_FILE_NAME",
      removeFileName,
      "machineManpowerListFile"
    );

    // if (result.data.status === 200) {
    //   setMachineriesManpowerFileName(null);
    //   showSuccessToast(result.data.message);
    // } else {
    //   showErrorToast(result.data.message);
    // }

    if (result.data.status === 200) {
      setMachineriesManpowerFileName(null);
      setPageFourDetails((prevDetails) => {
        if (!prevDetails) return prevDetails;

        const updatedDetails = {
          ...prevDetails,
          machine_manpower_list_file_path_name: "",
          data: {
            ...prevDetails.data,
            MACHINE_MANPOWER_LIST_FILE_NAME: null,
            MACHINE_MANPOWER_LIST_ORIGINAL_FILE_NAME: null,
          },
        };

        console.log("update details: ", updatedDetails);
        return updatedDetails;
      });
      showSuccessToast(result.data.message);
    } else {
      showErrorToast(result.data.message);
    }

    console.log("incorporation file name: ", result);

    setIsLoading(false);
  };

  const removeBusinessPremises = async (removeFileName: string) => {
    // setIsOpenFileRemoveModal(true);

    setIsLoading(true);
    console.log("fileName function: ", removeFileName);

    const result = await DocumentFileRemoveService(
      regToken!,
      "xxp2p_supplier_registration_documents",
      "BUSINESS_PREMISES_FILE_NAME",
      "BUSINESS_PREMISES_ORIGINAL_FILE_NAME",
      removeFileName,
      "businessPremisesFile"
    );

    // if (result.data.status === 200) {
    //   setBusinessPremisesFileName(null);
    //   showSuccessToast(result.data.message);
    // } else {
    //   showErrorToast(result.data.message);
    // }

    if (result.data.status === 200) {
      setBusinessPremisesFileName(null);
      setPageFourDetails((prevDetails) => {
        if (!prevDetails) return prevDetails;

        const updatedDetails = {
          ...prevDetails,
          business_premises_file_path_name: "",
          data: {
            ...prevDetails.data,
            BUSINESS_PREMISES_FILE_NAME: null,
            BUSINESS_PREMISES_ORIGINAL_FILE_NAME: null,
          },
        };

        console.log("update details: ", updatedDetails);
        return updatedDetails;
      });
      showSuccessToast(result.data.message);
    } else {
      showErrorToast(result.data.message);
    }

    console.log("incorporation file name: ", result);

    setIsLoading(false);
  };

  const removeProfilePic1 = async (removeFileName: string) => {
    // setIsOpenFileRemoveModal(true);

    setIsLoading(true);
    console.log("fileName function: ", removeFileName);

    const result = await DocumentFileRemoveService(
      regToken!,
      "xxp2p_supplier_registration_documents",
      "PROFILE_PIC1_FILE_NAME",
      "PROFILE_PIC1_ORIGINAL_FILE_NAME",
      removeFileName,
      "profilePic1File"
    );

    // if (result.data.status === 200) {
    //   setPhotographOneFileName(null);
    //   setImagePreview(null);
    //   showSuccessToast(result.data.message);
    // } else {
    //   showErrorToast(result.data.message);
    // }

    if (result.data.status === 200) {
      setPhotographOneFileName(null);
      setImagePreview(null);
      setPageFourDetails((prevDetails) => {
        if (!prevDetails) return prevDetails;

        const updatedDetails = {
          ...prevDetails,
          profile_pic1_file_path_name: "",
          data: {
            ...prevDetails.data,
            PROFILE_PIC1_FILE_NAME: null,
            PROFILE_PIC1_ORIGINAL_FILE_NAME: null,
          },
        };

        console.log("update details: ", updatedDetails);
        return updatedDetails;
      });
      showSuccessToast(result.data.message);
    } else {
      showErrorToast(result.data.message);
    }

    console.log("incorporation file name: ", result);

    setIsLoading(false);
  };

  const removeProfilePic2 = async (removeFileName: string) => {
    // setIsOpenFileRemoveModal(true);

    setIsLoading(true);
    console.log("fileName function: ", removeFileName);

    const result = await DocumentFileRemoveService(
      regToken!,
      "xxp2p_supplier_registration_documents",
      "PROFILE_PIC2_FILE_NAME",
      "PROFILE_PIC2_ORIGINAL_FILE_NAME",
      removeFileName,
      "profilePic2File"
    );

    // if (result.data.status === 200) {
    //   setPhotographTwoFileName(null);
    //   setImagePreview2(null);
    //   showSuccessToast(result.data.message);
    // } else {
    //   showErrorToast(result.data.message);
    // }

    if (result.data.status === 200) {
      setPhotographTwoFileName(null);
      setImagePreview2(null);
      setPageFourDetails((prevDetails) => {
        if (!prevDetails) return prevDetails;

        const updatedDetails = {
          ...prevDetails,
          profile_pic2_file_path_name: "",
          data: {
            ...prevDetails.data,
            PROFILE_PIC2_FILE_NAME: null,
            PROFILE_PIC2_ORIGINAL_FILE_NAME: null,
          },
        };

        console.log("update details: ", updatedDetails);
        return updatedDetails;
      });
      showSuccessToast(result.data.message);
    } else {
      showErrorToast(result.data.message);
    }

    console.log("incorporation file name: ", result);

    setIsLoading(false);
  };

  // remove file end

  //file view

  const [machinariesFileLoading, setMachinariesFileLoading] =
    useState<boolean>(false);
  const [bussinessFileLoading, setBussinessFileLoading] =
    useState<boolean>(false);
  const [photograpghOneFileLoading, setPhotographOneFileLoading] =
    useState<boolean>(false);
  const [photograpghTwoFileLoading, setPhotographTwoFileLoading] =
    useState<boolean>(false);

  const handleViewFile = (
    filePath: string,
    fileName: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const tokenSelection = isRegCompelte === "1" ? token : regToken;
    fetchFileService(filePath, fileName, tokenSelection!, setLoading);
  };

  return (
    <div className=" bg-whiteColor">
      <SuccessToast />
      <WarningModal
        isOpen={isWarningShowSubmit}
        action={profileUpdateSubmission}
        closeModal={closeModalSubmit}
        message="Do you want to submit ?"
        imgSrc="/images/warning.png"
      />
      {isLoading ? (
        <div className=" flex justify-center items-center w-full  h-screen">
          <LogoLoading />
        </div>
      ) : (
        <div className=" flex flex-col item-start space-y-8 w-full ">
          <div className=" w-full flex space-x-0 items-center justify-center">
            <div className=" bg-midGreen h-8 w-8 flex justify-center items-center rounded-full border-[2px] border-midGreen text-white font-mon font-medium">
              1
            </div>
            <div className=" w-48 h-[2px] bg-midGreen"></div>
            <div className=" bg-midGreen h-8 w-8 flex justify-center items-center rounded-full border-[2px] border-midGreen text-white font-mon font-medium">
              2
            </div>
            <div className=" w-48 h-[2px] bg-midGreen"></div>
            <div className=" bg-midGreen h-8 w-8 flex justify-center items-center rounded-full border-[2px] border-midGreen text-white font-mon font-medium">
              3
            </div>
            <div className=" w-48 h-[2px] bg-midGreen"></div>
            <div className=" bg-midGreen h-8 w-8 flex justify-center items-center rounded-full border-[2px] border-midGreen text-white font-mon font-medium">
              4
            </div>
          </div>
          <InputLebel
            titleText={
              "Upload all the  required files. All file will be safe and secured by the admin."
            }
          />
          <PageTitle titleText={"Step-4 "} />
          <div className=" flex flex-row w-full justify-between items-start ">
            <div className=" flex-1 flex flex-col items-start space-y-2">
              <InputLebel
                titleText={"List of Machineries, Manpower, Competencies"}
              />
              <FilePickerInput
                onFileSelect={handleMachineriesManpower}
                initialFileName={machineriesManpowerFileName!}
                mimeType=".pdf, image/*"
                maxSize={5 * 1024 * 1024}
                disable={isDisable}
              />
              {pageFourDetails?.machine_manpower_list_file_path_name != null &&
              pageFourDetails?.data.MACHINE_MANPOWER_LIST_FILE_NAME != null &&
              pageFourDetails?.data.MACHINE_MANPOWER_LIST_FILE_NAME !== "" ? (
                <div className=" flex items-center space-x-6">
                  {machinariesFileLoading ? (
                    <div
                      className={`${
                        isRegCompelte === "1" ? "w-96" : "w-80"
                      }   flex justify-center items-center `}
                    >
                      <CircularProgressIndicator />
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        handleViewFile(
                          pageFourDetails.machine_manpower_list_file_path_name!,
                          pageFourDetails.data.MACHINE_MANPOWER_LIST_FILE_NAME!,
                          setMachinariesFileLoading
                        );
                      }}
                      className={`${
                        isRegCompelte === "1" ? "w-96" : "w-80"
                      }  dashedButton my-4 `}
                    >
                      {" "}
                      view
                    </button>
                  )}

                  {isRegCompelte === "1" ? null : (
                    <button
                      onClick={() =>
                        handleOpenModal(
                          pageFourDetails?.data
                            .MACHINE_MANPOWER_LIST_FILE_NAME!,
                          "machineries"
                        )
                      }
                      className=" py-2 px-2 rounded-md shadow-sm border-borderColor border-[0.5px]"
                    >
                      <DeleteIcon />
                    </button>
                  )}
                </div>
              ) : // <button
              //   onClick={() => handleOpenModal(pageFourDetails?.data.MACHINE_MANPOWER_LIST_FILE_NAME!, 'machineries')}
              //   className=" py-2 w-full  flex justify-center items-center rounded-md shadow-sm border-borderColor border-[0.5px]"
              // >
              //   <DeleteIcon />
              // </button>

              null}
            </div>
            <div className=" w-36"></div>
            <div className="flex-1 flex flex-col items-start space-y-2  ">
              <InputLebel
                titleText={"Business Premises (Rented / Owned, with Address)"}
              />
              <FilePickerInput
                onFileSelect={handleBusinessPremises}
                mimeType=".pdf, image/*"
                initialFileName={businessPremisesFileName!}
                maxSize={5 * 1024 * 1024}
                disable={isDisable}
              />
              {pageFourDetails?.business_premises_file_path_name != null &&
              pageFourDetails?.data.BUSINESS_PREMISES_FILE_NAME != null &&
              pageFourDetails?.data.BUSINESS_PREMISES_FILE_NAME !== "" ? (
                <div className=" flex items-center space-x-6">
                  {bussinessFileLoading ? (
                    <div
                      className={`${
                        isRegCompelte === "1" ? "w-96" : "w-80"
                      }   flex justify-center items-center `}
                    >
                      <CircularProgressIndicator />
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        handleViewFile(
                          pageFourDetails.business_premises_file_path_name!,
                          pageFourDetails.data.BUSINESS_PREMISES_FILE_NAME!,
                          setBussinessFileLoading
                        );
                      }}
                      className={`${
                        isRegCompelte === "1" ? "w-96" : "w-80"
                      }  dashedButton my-4 `}
                    >
                      {" "}
                      view
                    </button>
                  )}

                  {isRegCompelte === "1" ? null : (
                    <button
                      onClick={() =>
                        handleOpenModal(
                          pageFourDetails?.data.BUSINESS_PREMISES_FILE_NAME!,
                          "businessPremises"
                        )
                      }
                      className=" py-2 px-2 rounded-md shadow-sm border-borderColor border-[0.5px]"
                    >
                      <DeleteIcon />
                    </button>
                  )}
                </div>
              ) : // <button
              //   onClick={() => handleOpenModal(pageFourDetails?.data.BUSINESS_PREMISES_FILE_NAME!, 'businessPremises')}
              //   className=" py-2 w-full  flex justify-center items-center rounded-md shadow-sm border-borderColor border-[0.5px]"
              // >
              //   <DeleteIcon />
              // </button>

              null}
            </div>
          </div>
          <div className=" flex flex-row w-full justify-between items-start ">
            <div className="flex-1 flex flex-col items-start space-y-2 ">
              <InputLebel titleText={"Photograph of Owner-1"} />
              <FilePickerInput
                onFileSelect={handlePhotographOne}
                mimeType="image/*"
                initialFileName={photographOneFileName!}
                maxSize={5 * 1024 * 1024}
                disable={isDisable}
              />
              {pageFourError.photographOneFile && (
                <ValidationError title={pageFourError.photographOneFile} />
              )}
              <div className=" w-full flex  items-start space-x-4">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className=" mt-2 w-44 h-48 rounded-md p-2 border-2 border-midGreen shadow-md"
                  />
                )}
                {/* {pageFourDetails?.profile_pic1_file_path_name != null &&
                  pageFourDetails?.data.PROFILE_PIC1_FILE_NAME != null &&
                  pageFourDetails?.data.PROFILE_PIC1_FILE_NAME !== "" && (
                    <img
                      src={`${pageFourDetails?.profile_pic1_file_path_name!}/${
                        pageFourDetails?.data.PROFILE_PIC1_FILE_NAME
                      }`}
                      alt="Preview"
                      className={`mt-2 w-44 h-48 rounded-md p-2 border-2 ${
                        imagePreview ? "border-red-500" : "border-borderColor"
                      }  shadow-md`}
                    />
                  )} */}
              </div>

              {pageFourDetails?.profile_pic1_file_path_name != null &&
              pageFourDetails?.data.PROFILE_PIC1_FILE_NAME != null &&
              pageFourDetails?.data.PROFILE_PIC1_FILE_NAME !== "" ? (
                <div className=" flex items-center space-x-6">
                  {photograpghOneFileLoading ? (
                    <div
                      className={`${
                        isRegCompelte === "1" ? "w-96" : "w-80"
                      }   flex justify-center items-center `}
                    >
                      <CircularProgressIndicator />
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        handleViewFile(
                          pageFourDetails.profile_pic1_file_path_name!,
                          pageFourDetails.data.PROFILE_PIC1_FILE_NAME!,
                          setPhotographOneFileLoading
                        );
                      }}
                      className={`${
                        isRegCompelte === "1" ? "w-96" : "w-80"
                      }  dashedButton my-4 `}
                    >
                      {" "}
                      view
                    </button>
                  )}

                  {isRegCompelte === "1" ? null : (
                    <button
                      onClick={() =>
                        handleOpenModal(
                          pageFourDetails?.data.PROFILE_PIC1_FILE_NAME!,
                          "profilePic1"
                        )
                      }
                      className=" py-2 px-2 rounded-md shadow-sm border-borderColor border-[0.5px]"
                    >
                      <DeleteIcon />
                    </button>
                  )}
                </div>
              ) : // <button
              //   onClick={() => handleOpenModal(pageFourDetails?.data.PROFILE_PIC1_FILE_NAME!, 'profilePic1')}
              //   className=" py-2 w-full  flex justify-center items-center rounded-md shadow-sm border-borderColor border-[0.5px]"
              // >
              //   <DeleteIcon />
              // </button>

              null}
            </div>
            <div className=" w-36"></div>
            <div className="flex-1 flex flex-col items-start space-y-2 ">
              <InputLebel titleText={"Photograph of Owner-2"} />
              <FilePickerInput
                onFileSelect={handlePhotographTwo}
                mimeType="image/*"
                initialFileName={photographTwoFileName!}
                maxSize={5 * 1024 * 1024}
                disable={isDisable}
              />
              <div className=" w-full flex  items-start space-x-4">
                {imagePreview2 && (
                  <img
                    src={imagePreview2}
                    alt="Preview"
                    className=" mt-2 w-48 h-48 rounded-md p-2 border-2 border-midGreen shadow-md"
                  />
                )}
                {/* {pageFourDetails?.profile_pic2_file_path_name != null &&
                  pageFourDetails?.data.PROFILE_PIC2_FILE_NAME != null &&
                  pageFourDetails?.data.PROFILE_PIC2_FILE_NAME !== "" && (
                    <img
                      src={`${pageFourDetails?.profile_pic2_file_path_name!}/${
                        pageFourDetails?.data.PROFILE_PIC2_FILE_NAME
                      }`}
                      alt="Preview"
                      className={`mt-2 w-44 h-48 rounded-md p-2 border-2 ${
                        imagePreview2 ? "border-red-500" : "border-borderColor"
                      }  shadow-md`}
                    />
                  )} */}
              </div>
              {pageFourDetails?.profile_pic2_file_path_name != null &&
              pageFourDetails?.data.PROFILE_PIC2_FILE_NAME != null &&
              pageFourDetails?.data.PROFILE_PIC2_FILE_NAME !== "" ? (
                <div className=" flex items-center space-x-6">
                  {photograpghTwoFileLoading ? (
                    <div
                      className={`${
                        isRegCompelte === "1" ? "w-96" : "w-80"
                      }   flex justify-center items-center `}
                    >
                      <CircularProgressIndicator />
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        handleViewFile(
                          pageFourDetails.profile_pic2_file_path_name!,
                          pageFourDetails.data.PROFILE_PIC2_FILE_NAME!,
                          setPhotographTwoFileLoading
                        );
                      }}
                      className={`${
                        isRegCompelte === "1" ? "w-96" : "w-80"
                      }  dashedButton my-4 `}
                    >
                      {" "}
                      view
                    </button>
                  )}

                  {isRegCompelte === "1" ? null : (
                    <button
                      onClick={() =>
                        handleOpenModal(
                          pageFourDetails?.data.PROFILE_PIC2_FILE_NAME!,
                          "profilePic2"
                        )
                      }
                      className=" py-2 px-2 rounded-md shadow-sm border-borderColor border-[0.5px]"
                    >
                      <DeleteIcon />
                    </button>
                  )}
                </div>
              ) : // <button
              //   onClick={() => handleOpenModal(pageFourDetails?.data.PROFILE_PIC2_FILE_NAME!, 'profilePic2')}
              //   className=" py-2 w-full  flex justify-center items-center rounded-md shadow-sm border-borderColor border-[0.5px]"
              // >
              //   <DeleteIcon />
              // </button>

              null}
            </div>
          </div>

          <div className=" my-8"></div>
          <div className=" w-full flex flex-row justify-end space-x-8 items-center">
            <CommonButton
              titleText={"previous"}
              color="bg-graishColor"
              onClick={previous}
              width="w-48"
            />
            {isSubmitLoading ? (
              <div className=" w-48 flex justify-center items-center">
                <CircularProgressIndicator />
              </div>
            ) : (
              <CommonButton
                titleText={"Save & Next"}
                onClick={submitAndNext}
                width="w-48"
                color="bg-midGreen"
                disable={isDisable}
              />
            )}

            {/* {isRegCompelte === "1" ? (
              <CommonButton
                disable={isDisable}
                titleText={"Submit"}
                onClick={showWarning}
                width="w-48"
                color="bg-midGreen"
              />
            ) : null} */}
          </div>
        </div>
      )}

      {isOpenFileRemoveModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-opacity-50 bg-gray-700">
          <div className="w-[491.5px] h-[240px] relative bg-white rounded-[10px]">
            <div className="w-[283px] h-[83px] flex justify-center items-start left-[104.5px] top-[15px] absolute rounded-full">
              <div className="mt-6 h-14 w-14 rounded-full bg-red-100 flex justify-center items-center">
                <WarningIcon className="text-red-400" />
              </div>
            </div>
            <div className="w-full flex justify-center items-center top-[100px] absolute text-neutral-700 text-[16px] font-bold font-mon">
              Warning !!!
            </div>
            <div className="w-full flex justify-center items-center px-8 top-[130px] absolute text-neutral-700 text-sm font-mon font-medium">
              Are you sure you want to delete this?
            </div>
            <div className="w-full flex space-x-4 h-7 top-[181px] absolute px-4 justify-center items-center">
              <button
                onClick={handleCloseModal}
                className="h-10 w-28 rounded-[8px] bg-white border-[1px] border-borderColor text-md font-medium font-mon text-black"
              >
                No
              </button>
              <button
                onClick={handleConfirmDelete}
                className="h-10 w-28 rounded-[8px] bg-red-500 text-white text-md font-medium font-mon"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
