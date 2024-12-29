import React, { useRef, useState, useEffect } from "react";
import InputLebel from "../../../common_component/InputLebel";
import FilePickerInput from "../../../common_component/FilePickerInput";
import CommonButton from "../../../common_component/CommonButton";
import { useDocumentPageContext } from "../../context/DocumentPageContext";
import CommonInputField from "../../../common_component/CommonInputField";
import { useAuth } from "../../../login_both/context/AuthContext";
import SuccessToast, {
  showSuccessToast,
} from "../../../Alerts_Component/SuccessToast";
import ErrorToast, {
  showErrorToast,
} from "../../../Alerts_Component/ErrorToast";
import ExistingDocumentService from "../../service/document/ExistingDocumentService";
import LogoLoading from "../../../Loading_component/LogoLoading";
import { PageTwoInterface } from "../../interface/RegistrationInterface";

import moment from "moment";
import AddUpdatePageTwoService from "../../service/document/page_two/AddUpdatePageTwoService";
import CircularProgressIndicator from "../../../Loading_component/CircularProgressIndicator";
import { useNavigate } from "react-router-dom";
import { isTokenValid } from "../../../utils/methods/TokenValidityCheck";
import PageTitle from "../../../common_component/PageTitle";
import ProfileUpdateSubmissionService from "../../service/profile_update_submission/ProfileUpdateSubmissionService";
import WarningModal from "../../../common_component/WarningModal";
import DeleteIcon from "../../../icons/DeleteIcon";
import DocumentFileRemoveService from "../../service/declaration/DocumentFileRemoveService";
import WarningIcon from "../../../icons/WarningIcon";
import fetchFileService from "../../../common_service/fetchFileService";
export default function PageTwo() {
  const incorporationNumberRef = useRef<HTMLInputElement | null>(null);

  const [incorporationNumber, setIncorporationNumber] = useState("");
  const [pageTwoDetails, setPageTwoDetails] = useState<PageTwoInterface | null>(
    null
  );

  const handleChangeIncorporationNumber = (value: string) => {
    setIncorporationNumber(value);
  };

  //loading
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  //loading

  //context
  const { page, setPage } = useDocumentPageContext();
  //context

  //token
  const {
    regToken,
    submissionStatus,
    token,
    isRegCompelte,
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
      getExistingDocument();
    }
  }, []);

  //get exsiting docuent

  //re-render for set data

  useEffect(() => {
    if (pageTwoDetails) {
      setData();
    }
  }, [pageTwoDetails]);

  const getExistingDocument = async () => {
    setIsLoading(true);
    try {
      const result = await ExistingDocumentService(regToken!, 2);
      console.log(result.data);

      if (result.data.status === 200) {
        setIsLoading(false);
        // showSuccessToast(result.data.message);
        setPageTwoDetails(result.data);
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
    if (pageTwoDetails) {
      if (incorporationNumberRef.current) {
        incorporationNumberRef.current.value =
          pageTwoDetails.data.INCORPORATION_NUMBER === "null"
            ? ""
            : pageTwoDetails.data.INCORPORATION_NUMBER!;
        setIncorporationNumber(
          pageTwoDetails.data.INCORPORATION_NUMBER! === null
            ? ""
            : pageTwoDetails.data.INCORPORATION_NUMBER
        );
      }
      if (
        pageTwoDetails.data.INCORPORATION_CIRTIFICATE_ORIGINAL_FILE_NAME != null
      ) {
        setIncorporationOfCertificateFileName(
          pageTwoDetails.data.INCORPORATION_CIRTIFICATE_ORIGINAL_FILE_NAME
        );
      }
      if (pageTwoDetails.data.MEMORANDUM_ASSOCIATION_FILE_NAME != null) {
        setMemorandumOfAssociationFileName(
          pageTwoDetails.data.MEMORANDUM_ASSOCIATION_ORIGINAL_FILE_NAME
        );
      }
      if (pageTwoDetails.data.AUTHORIZED_SIGNS_FILE_NAME != null) {
        setListOfAuthorizedSignatoriesFileName(
          pageTwoDetails.data.AUTHORIZED_SIGNS_ORIGINAL_FILE_NAME
        );
      }
      if (pageTwoDetails.data.ARTICLE_ASSOCIATION_FILE_NAME != null) {
        setArticlesOfAssociationFileName(
          pageTwoDetails.data.ARTICLE_ASSOCIATION_ORIGINAL_FILE_NAME
        );
      }
      if (pageTwoDetails.data.PROMINENT_CLIENTS_FILE_NAME != null) {
        setListiOfProminentClientsFileName(
          pageTwoDetails.data.PROMINENT_CLIENTS_ORIGINAL_FILE_NAME
        );
      }
    }
  };

  const [
    incorporationOfCertificateFileName,
    setIncorporationOfCertificateFileName,
  ] = useState<string | null>(null);

  const [incorporationOfCertificateFile, setIncorporationOfCertificateFile] =
    useState<File | null>(null);

  const [certificateClear, setCertificateClear] = useState<boolean>(false);

  const handleIncorporationOfCertificate = (file: File | null) => {
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file);
      setIncorporationOfCertificateFile(file);
    } else {
      // No file selected
      console.log("No file selected");
    }
  };

  // const removeCertificateFile = () => {
  //   setCertificateClear(true);
  //   setIncorporationOfCertificateFile(null);
  //   setIncorporationOfCertificateFileName(null);
  //   if (pageTwoDetails?.data.INCORPORATION_CIRTIFICATE_FILE_NAME != null) {
  //     setIncorporationOfCertificateFileName(null);
  //   }
  // };

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
        case "incorporation":
          await removeCertificateFile(fileToRemove);
          break;

        case "memorandum":
          await removeMemorandumFile(fileToRemove);
          break;

        case "authorizedSignatures":
          await removeSignatoryFile(fileToRemove);
          break;

        case "article":
          await removeArticle(fileToRemove);
          break;

        case "prominentClients":
          await removeClients(fileToRemove);
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

  const removeCertificateFile = async (removeFileName: string) => {
    // setIsOpenFileRemoveModal(true);

    setIsLoading(true);
    console.log("fileName function: ", removeFileName);

    const result = await DocumentFileRemoveService(
      regToken!,
      "xxp2p_supplier_registration_documents",
      "INCORPORATION_CIRTIFICATE_FILE_NAME",
      "INCORPORATION_CIRTIFICATE_ORIGINAL_FILE_NAME",
      removeFileName,
      "incorporationCirtificateFile"
    );

    // if (result.data.status === 200) {
    //   setIncorporationOfCertificateFileName(null);

    //   showSuccessToast(result.data.message);
    // } else {
    //   showErrorToast(result.data.message);
    // }

    if (result.data.status === 200) {
      setIncorporationOfCertificateFileName(null);
      setPageTwoDetails((prevDetails) => {
        if (!prevDetails) return prevDetails;

        const updatedDetails = {
          ...prevDetails,
          incorporation_cirtificate_file_path_name: "",
          data: {
            ...prevDetails.data,
            INCORPORATION_CIRTIFICATE_FILE_NAME: null,
            INCORPORATION_CIRTIFICATE_ORIGINAL_FILE_NAME: null,
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

  const [memorandumOfAssociationFileName, setMemorandumOfAssociationFileName] =
    useState<string | null>(null);

  const [memorandumOfAssociationFile, setMemorandumOfAssociationFile] =
    useState<File | null>(null);

  const [memorandumClear, setMemorandumClear] = useState(false);

  const handleMemorandumOfAssociation = (file: File | null) => {
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file);
      setMemorandumOfAssociationFile(file);
    } else {
      // No file selected
      console.log("No file selected");
    }
  };

  // const removeMemorandumFile = () => {
  //   setMemorandumClear(true);
  //   setMemorandumOfAssociationFile(null);
  //   setMemorandumOfAssociationFileName(null);
  //   if (pageTwoDetails?.data.MEMORANDUM_ASSOCIATION_FILE_NAME != null) {
  //     setArticlesOfAssociationFileName(null);
  //   }
  // };

  const removeMemorandumFile = async (removeFileName: string) => {
    // setIsOpenFileRemoveModal(true);

    setIsLoading(true);
    console.log("fileName function: ", removeFileName);

    const result = await DocumentFileRemoveService(
      regToken!,
      "xxp2p_supplier_registration_documents",
      "MEMORANDUM_ASSOCIATION_FILE_NAME",
      "MEMORANDUM_ASSOCIATION_ORIGINAL_FILE_NAME",
      removeFileName,
      "memorandumAssociationFile"
    );

    // if (result.data.status === 200) {
    //   setMemorandumOfAssociationFileName(null);
    //   showSuccessToast(result.data.message);
    // } else {
    //   showErrorToast(result.data.message);
    // }

    if (result.data.status === 200) {
      setMemorandumOfAssociationFileName(null);
      setPageTwoDetails((prevDetails) => {
        if (!prevDetails) return prevDetails;

        const updatedDetails = {
          ...prevDetails,
          memorandum_association_file_path_name: "",
          data: {
            ...prevDetails.data,
            MEMORANDUM_ASSOCIATION_FILE_NAME: null,
            MEMORANDUM_ASSOCIATION_ORIGINAL_FILE_NAME: null,
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

  const [articlesOfAssociationFileName, setArticlesOfAssociationFileName] =
    useState<string | null>(null);
  const [articlesOfAssociationFile, setArticlesOfAssociationFile] =
    useState<File | null>(null);

  const [articleClear, setArticleClear] = useState<boolean>(false);

  // const removeArticle = () => {
  //   setArticleClear(true);
  //   setArticlesOfAssociationFile(null);
  //   setArticlesOfAssociationFileName(null);
  //   if (pageTwoDetails?.data.ARTICLE_ASSOCIATION_FILE_NAME != null) {
  //     setArticlesOfAssociationFileName(null);
  //   }
  // };

  const removeArticle = async (removeFileName: string) => {
    // setIsOpenFileRemoveModal(true);

    setIsLoading(true);
    console.log("fileName function: ", removeFileName);

    const result = await DocumentFileRemoveService(
      regToken!,
      "xxp2p_supplier_registration_documents",
      "ARTICLE_ASSOCIATION_FILE_NAME",
      "ARTICLE_ASSOCIATION_ORIGINAL_FILE_NAME",
      removeFileName,
      "articleAssociationFile"
    );

    // if (result.data.status === 200) {
    //   setArticlesOfAssociationFileName(null);
    //   showSuccessToast(result.data.message);
    // } else {
    //   showErrorToast(result.data.message);
    // }

    if (result.data.status === 200) {
      setArticlesOfAssociationFileName(null);
      setPageTwoDetails((prevDetails) => {
        if (!prevDetails) return prevDetails;

        const updatedDetails = {
          ...prevDetails,
          article_association_file_path_name: "",
          data: {
            ...prevDetails.data,
            ARTICLE_ASSOCIATION_FILE_NAME: null,
            ARTICLE_ASSOCIATION_ORIGINAL_FILE_NAME: null,
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

  const handleArticlesOfAssociation = (file: File | null) => {
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file);
      setArticlesOfAssociationFile(file);
    } else {
      // No file selected
      console.log("No file selected");
    }
  };

  const [
    listOfAuthorizedSignatoriesFileName,
    setListOfAuthorizedSignatoriesFileName,
  ] = useState<string | null>(null);

  const [listOfAuthorizedSignatoriesFile, setListOfAuthorizedSignatoriesFile] =
    useState<File | null>(null);

  const [signatoriesClear, setSignatoriesClear] = useState<boolean>(false);

  // const removeSignatoryFile = () => {
  //   setSignatoriesClear(true);
  //   setListOfAuthorizedSignatoriesFileName(null);
  //   setListOfAuthorizedSignatoriesFile(null);
  //   if (pageTwoDetails?.data.AUTHORIZED_SIGNS_FILE_NAME != null) {
  //     setListOfAuthorizedSignatoriesFile(null);
  //   }
  // };

  const removeSignatoryFile = async (removeFileName: string) => {
    // setIsOpenFileRemoveModal(true);

    setIsLoading(true);
    console.log("fileName function: ", removeFileName);

    const result = await DocumentFileRemoveService(
      regToken!,
      "xxp2p_supplier_registration_documents",
      "AUTHORIZED_SIGNS_FILE_NAME",
      "AUTHORIZED_SIGNS_ORIGINAL_FILE_NAME",
      removeFileName,
      "authorizedSignsFile"
    );

    // if (result.data.status === 200) {
    //   setListOfAuthorizedSignatoriesFileName(null);
    //   showSuccessToast(result.data.message);
    // } else {
    //   showErrorToast(result.data.message);
    // }

    if (result.data.status === 200) {
      setListOfAuthorizedSignatoriesFileName(null);
      setPageTwoDetails((prevDetails) => {
        if (!prevDetails) return prevDetails;

        const updatedDetails = {
          ...prevDetails,
          authorized_signs_file_path_name: "",
          data: {
            ...prevDetails.data,
            AUTHORIZED_SIGNS_FILE_NAME: null,
            AUTHORIZED_SIGNS_ORIGINAL_FILE_NAME: null,
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

  const handleListOfAuthorizedSignatories = (file: File | null) => {
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file);
      setListOfAuthorizedSignatoriesFile(file);
    } else {
      // No file selected
      console.log("No file selected");
    }
  };

  const [listiOfProminentClientsFileName, setListiOfProminentClientsFileName] =
    useState<string | null>(null);

  const [listiOfProminentClientsFile, setListiOfProminentClientsFile] =
    useState<File | null>(null);

  const [clientClear, setClientClear] = useState<boolean>(false);

  // const removeClients = () => {
  //   setClientClear(true);
  //   setListiOfProminentClientsFile(null);
  //   setListiOfProminentClientsFileName(null);

  //   if (pageTwoDetails?.data.PROMINENT_CLIENTS_FILE_NAME != null) {
  //     setListiOfProminentClientsFileName(null);
  //   }
  // };

  const removeClients = async (removeFileName: string) => {
    // setIsOpenFileRemoveModal(true);

    setIsLoading(true);
    console.log("fileName function: ", removeFileName);

    const result = await DocumentFileRemoveService(
      regToken!,
      "xxp2p_supplier_registration_documents",
      "PROMINENT_CLIENTS_FILE_NAME",
      "PROMINENT_CLIENTS_ORIGINAL_FILE_NAME",
      removeFileName,
      "prominentClientsFile"
    );

    // if (result.data.status === 200) {
    //   setListiOfProminentClientsFileName(null);
    //   showSuccessToast(result.data.message);
    // } else {
    //   showErrorToast(result.data.message);
    // }

    if (result.data.status === 200) {
      setListiOfProminentClientsFileName(null);
      setPageTwoDetails((prevDetails) => {
        if (!prevDetails) return prevDetails;

        const updatedDetails = {
          ...prevDetails,
          prominent_clients_file_path_name: "",
          data: {
            ...prevDetails.data,
            PROMINENT_CLIENTS_FILE_NAME: null,
            PROMINENT_CLIENTS_ORIGINAL_FILE_NAME: null,
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

  const handleListiOfProminentClientsFile = (file: File | null) => {
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file);
      setListiOfProminentClientsFile(file);
    } else {
      // No file selected
      console.log("No file selected");
    }
  };

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

  const submitAndNext = async () => {
    setIsSubmitLoading(true);

    console.log(incorporationNumber);

    try {
      const result = await AddUpdatePageTwoService(
        regToken!,
        incorporationNumber,
        incorporationOfCertificateFile,
        memorandumOfAssociationFile,
        listOfAuthorizedSignatoriesFile,
        articlesOfAssociationFile,
        listiOfProminentClientsFile,
        2
      );

      if (result.data.status === 200) {
        showSuccessToast(result.data.message);
        setTimeout(() => {
          setPage(3);
          setIsSubmitLoading(false);
        }, 3200);
      } else {
        setIsSubmitLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      //handle error
      setIsSubmitLoading(false);
      showErrorToast("Something went wrong");
    }
  };

  //navigate to previous page
  const previous = () => {
    setPage(1);
  };

  //navigate to next page
  const next = () => {
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

  //file view

  const [fileLoading, setFileLoading] = useState<boolean>(false);

  const [certificationOfIncrpFileLoading, setCertificationOfIncrpFileLoading] =
    useState<boolean>(false);
  const [memorandumFileLoading, setMemorandumFileLoading] =
    useState<boolean>(false);
  const [signatoriesFileLoading, setSignatoriesFileLoading] =
    useState<boolean>(false);
  const [articleOfAssociationFileLoading, setArticleOfAssociationFileLoading] =
    useState<boolean>(false);
  const [clientFileLoading, setClientFileLoading] = useState<boolean>(false);

  const handleViewFile = (
    filePath: string,
    fileName: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    console.log("clicked");

    const tokenSelection = isRegCompelte === "1" ? token : regToken;
    fetchFileService(filePath, fileName, tokenSelection!, setLoading);
  };

  return (
    <div className="bg-whiteColor">
      <SuccessToast />
      <WarningModal
        isOpen={isWarningShowSubmit}
        action={profileUpdateSubmission}
        closeModal={closeModalSubmit}
        message="Do you want to submit ?"
        imgSrc="/images/warning.png"
      />
      {isLoading ? (
        <div className=" w-full h-screen flex justify-center items-center">
          <LogoLoading />
        </div>
      ) : (
        <div className=" flex flex-col item start space-y-8 w-full ">
          <div className=" w-full flex space-x-0 items-center justify-center">
            <div className=" bg-midGreen h-8 w-8 flex justify-center items-center rounded-full border-[2px] border-midGreen text-white font-mon font-medium">
              1
            </div>
            <div className=" w-48 h-[2px] bg-midGreen"></div>
            <div className=" bg-midGreen h-8 w-8 flex justify-center items-center rounded-full border-[2px] border-midGreen text-white font-mon font-medium">
              2
            </div>
            <div className=" w-48 h-[2px] bg-graishColor"></div>
            <div className=" bg-white h-8 w-8 flex justify-center items-center rounded-full border-[2px] border-graishColor text-graishColor font-mon font-medium">
              3
            </div>
            <div className=" w-48 h-[2px] bg-graishColor"></div>
            <div className=" bg-white h-8 w-8 flex justify-center items-center rounded-full border-[2px] border-graishColor text-graishColor font-mon font-medium">
              4
            </div>
          </div>
          <InputLebel
            titleText={
              "Upload all the  required files. All file will be safe and secured by the admin."
            }
          />
          <PageTitle titleText={"Step-2"} />
          <div className=" flex flex-row w-full justify-between items-start">
            <div className=" flex flex-col items-start space-y-2">
              <InputLebel titleText={"Incorporation Number"} />
              <CommonInputField
                type="text"
                hint="0787235762"
                inputRef={incorporationNumberRef}
                onChangeData={handleChangeIncorporationNumber}
                disable={isDisable}
              />
            </div>

            <div className=" flex flex-col items-start space-y-2">
              <InputLebel titleText={"Certificate of Incorporation"} />
              <FilePickerInput
                onFileSelect={handleIncorporationOfCertificate}
                initialFileName={incorporationOfCertificateFileName!}
                mimeType=".pdf, image/*"
                maxSize={5 * 1024 * 1024}
                disable={isDisable}
                clearFile={certificateClear}
              />
              {pageTwoDetails?.incorporation_cirtificate_file_path_name !=
                null &&
              pageTwoDetails?.data.INCORPORATION_CIRTIFICATE_FILE_NAME !=
                null &&
              pageTwoDetails?.data.INCORPORATION_CIRTIFICATE_FILE_NAME !==
                "" ? (
                <div className=" flex  items-center space-x-6">
                  {certificationOfIncrpFileLoading ? (
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
                          pageTwoDetails?.incorporation_cirtificate_file_path_name!,
                          pageTwoDetails?.data
                            .INCORPORATION_CIRTIFICATE_FILE_NAME!,
                          setCertificationOfIncrpFileLoading
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
                          pageTwoDetails?.data
                            .INCORPORATION_CIRTIFICATE_FILE_NAME!,
                          "incorporation"
                        )
                      }
                      className=" py-2 px-2 rounded-md shadow-sm border-borderColor border-[0.5px]"
                    >
                      <DeleteIcon />
                    </button>
                  )}
                </div>
              ) : // <button
              //   onClick={() => handleOpenModal(pageTwoDetails?.data.INCORPORATION_CIRTIFICATE_FILE_NAME!, 'incorporation')}
              //   className=" py-2 w-full  flex justify-center items-center rounded-md shadow-sm border-borderColor border-[0.5px]"
              // >
              //   <DeleteIcon />
              // </button>

              null}
            </div>
          </div>
          <div className=" flex flex-row w-full justify-between items-start">
            <div className=" flex flex-col items-start space-y-2">
              <InputLebel titleText={"Memorandum of Association"} />
              <FilePickerInput
                onFileSelect={handleMemorandumOfAssociation}
                initialFileName={memorandumOfAssociationFileName!}
                mimeType=".pdf, image/*"
                maxSize={5 * 1024 * 1024}
                disable={isDisable}
                clearFile={memorandumClear}
              />
              {pageTwoDetails?.memorandum_association_file_path_name != null &&
              pageTwoDetails?.data.MEMORANDUM_ASSOCIATION_FILE_NAME != null &&
              pageTwoDetails?.data.MEMORANDUM_ASSOCIATION_FILE_NAME !== "" ? (
                <div className=" flex items-center space-x-6">
                  {memorandumFileLoading ? (
                    <div
                      className={`${
                        isRegCompelte === "1" ? "w-96" : "w-80"
                      }   flex justify-center items-center `}
                    >
                      <CircularProgressIndicator />
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        handleViewFile(
                          pageTwoDetails?.memorandum_association_file_path_name!,
                          pageTwoDetails?.data
                            .MEMORANDUM_ASSOCIATION_FILE_NAME!,
                          setMemorandumFileLoading
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
                          pageTwoDetails?.data
                            .MEMORANDUM_ASSOCIATION_FILE_NAME!,
                          "memorandum"
                        )
                      }
                      className=" py-2 px-2 rounded-md shadow-sm border-borderColor border-[0.5px]"
                    >
                      <DeleteIcon />
                    </button>
                  )}
                </div>
              ) : // <button
              //   onClick={() => handleOpenModal(pageTwoDetails?.data.MEMORANDUM_ASSOCIATION_FILE_NAME!, 'memorandum')}
              //   className=" py-2 w-full  flex justify-center items-center rounded-md shadow-sm border-borderColor border-[0.5px]"
              // >
              //   <DeleteIcon />
              // </button>

              null}
            </div>

            <div className=" flex flex-col items-start space-y-2">
              <InputLebel titleText={"List of Authorized Signatories"} />
              <FilePickerInput
                onFileSelect={handleListOfAuthorizedSignatories}
                initialFileName={listOfAuthorizedSignatoriesFileName!}
                mimeType=".pdf, image/*"
                maxSize={5 * 1024 * 1024}
                disable={isDisable}
                clearFile={signatoriesClear}
              />
              {pageTwoDetails?.authorized_signs_file_path_name != null &&
              pageTwoDetails?.data.AUTHORIZED_SIGNS_FILE_NAME != null &&
              pageTwoDetails?.data.AUTHORIZED_SIGNS_FILE_NAME !== "" ? (
                <div className=" flex items-center space-x-6">
                  {signatoriesFileLoading ? (
                    <div
                      className={`${
                        isRegCompelte === "1" ? "w-96" : "w-80"
                      }   flex justify-center items-center `}
                    >
                      <CircularProgressIndicator />
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        handleViewFile(
                          pageTwoDetails?.authorized_signs_file_path_name!,
                          pageTwoDetails?.data.AUTHORIZED_SIGNS_FILE_NAME!,
                          setSignatoriesFileLoading
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
                          pageTwoDetails?.data.AUTHORIZED_SIGNS_FILE_NAME!,
                          "authorizedSignatures"
                        )
                      }
                      className=" py-2 px-2 rounded-md shadow-sm border-borderColor border-[0.5px]"
                    >
                      <DeleteIcon />
                    </button>
                  )}
                </div>
              ) : // <button
              //   onClick={() => handleOpenModal(pageTwoDetails?.data.AUTHORIZED_SIGNS_FILE_NAME!, 'authorizedSignatures')}
              //   className=" py-2 w-full  flex justify-center items-center rounded-md shadow-sm border-borderColor border-[0.5px]"
              // >
              //   <DeleteIcon />
              // </button>

              null}
            </div>
          </div>
          <div className=" flex flex-row w-full justify-between items-start">
            <div className=" flex flex-col items-start space-y-2">
              <InputLebel titleText={"Articles of Association"} />
              <FilePickerInput
                onFileSelect={handleArticlesOfAssociation}
                initialFileName={articlesOfAssociationFileName!}
                mimeType=".pdf, image/*"
                maxSize={5 * 1024 * 1024}
                disable={isDisable}
                clearFile={articleClear}
              />
              {pageTwoDetails?.article_association_file_path_name != null &&
              pageTwoDetails?.data.ARTICLE_ASSOCIATION_FILE_NAME != null &&
              pageTwoDetails?.data.ARTICLE_ASSOCIATION_FILE_NAME !== "" ? (
                <div className=" flex items-center space-x-6">
                  {articleOfAssociationFileLoading ? (
                    <div
                      className={`${
                        isRegCompelte === "1" ? "w-96" : "w-80"
                      }   flex justify-center items-center `}
                    >
                      <CircularProgressIndicator />
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        handleViewFile(
                          pageTwoDetails?.article_association_file_path_name!,
                          pageTwoDetails?.data.ARTICLE_ASSOCIATION_FILE_NAME!,
                          setArticleOfAssociationFileLoading
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
                          pageTwoDetails?.data.ARTICLE_ASSOCIATION_FILE_NAME!,
                          "article"
                        )
                      }
                      className=" py-2 px-2 rounded-md shadow-sm border-borderColor border-[0.5px]"
                    >
                      <DeleteIcon />
                    </button>
                  )}
                </div>
              ) : // <button
              //   onClick={() => handleOpenModal(pageTwoDetails?.data.ARTICLE_ASSOCIATION_FILE_NAME!, 'article')}
              //   className=" py-2 w-full  flex justify-center items-center rounded-md shadow-sm border-borderColor border-[0.5px]"
              // >
              //   <DeleteIcon />
              // </button>

              null}
            </div>
            <div className=" flex flex-col items-start space-y-2">
              <InputLebel titleText={"List of Prominent Clients"} />
              <FilePickerInput
                onFileSelect={handleListiOfProminentClientsFile}
                initialFileName={listiOfProminentClientsFileName!}
                mimeType=".pdf, image/*"
                maxSize={5 * 1024 * 1024}
                disable={isDisable}
                clearFile={clientClear}
              />
              {pageTwoDetails?.prominent_clients_file_path_name != null &&
              pageTwoDetails?.data.PROMINENT_CLIENTS_FILE_NAME != null &&
              pageTwoDetails?.data.PROMINENT_CLIENTS_FILE_NAME !== "" ? (
                <div className=" flex items-center space-x-6">
                  {clientFileLoading ? (
                    <div
                      className={`${
                        isRegCompelte === "1" ? "w-96" : "w-80"
                      }   flex justify-center items-center `}
                    >
                      <CircularProgressIndicator />
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        handleViewFile(
                          pageTwoDetails?.prominent_clients_file_path_name!,
                          pageTwoDetails?.data.PROMINENT_CLIENTS_FILE_NAME!,
                          setClientFileLoading
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
                          pageTwoDetails?.data.PROMINENT_CLIENTS_FILE_NAME!,
                          "prominentClients"
                        )
                      }
                      className=" py-2 px-2 rounded-md shadow-sm border-borderColor border-[0.5px]"
                    >
                      <DeleteIcon />
                    </button>
                  )}
                </div>
              ) : // <button
              //   onClick={() => handleOpenModal(pageTwoDetails?.data.PROMINENT_CLIENTS_FILE_NAME!, 'prominentClients')}
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
              titleText={"Previous"}
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
            {/* <CommonButton titleText={"Next"} onClick={next} width="w-48" /> */}

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
