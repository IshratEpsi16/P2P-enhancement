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
import { PageThreeInterface } from "../../interface/RegistrationInterface";
import AddUpdatePageThreeService from "../../service/document/page_three/AddUpdatePageThreeService";
import { useNavigate } from "react-router-dom";
import { isTokenValid } from "../../../utils/methods/TokenValidityCheck";
import PageTitle from "../../../common_component/PageTitle";
import ProfileUpdateSubmissionService from "../../service/profile_update_submission/ProfileUpdateSubmissionService";
import WarningModal from "../../../common_component/WarningModal";
import DeleteIcon from "../../../icons/DeleteIcon";
import DocumentFileRemoveService from "../../service/declaration/DocumentFileRemoveService";
import WarningIcon from "../../../icons/WarningIcon";
import fetchFileService from "../../../common_service/fetchFileService";

export default function PageThree() {
  const [pageThreeDetails, setPageThreeDetails] =
    useState<PageThreeInterface | null>(null);

  //loading
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  //loading

  const { page, setPage } = useDocumentPageContext();

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
      GetExistingDocument();
    }
  }, []);

  //get exsiting docuent

  //re-render for set data

  useEffect(() => {
    if (pageThreeDetails) {
      setData();
    }
  }, [pageThreeDetails]);

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
      const result = await ExistingDocumentService(regToken!, 3);
      console.log(result.data.data);

      if (result.data.status === 200) {
        setIsLoading(false);
        // showSuccessToast(result.data.message);
        setPageThreeDetails(result.data);
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
    if (pageThreeDetails) {
      if (pageThreeDetails.data.GOODS_LIST_FILE_NAME != null) {
        setGoodsOrServiceFileName(
          pageThreeDetails.data.GOODS_LIST_ORG_FILE_NAME
        );
      }
      if (
        pageThreeDetails.data.COMPANY_BANK_SOLVENCY_CIRTIFICATE_FILE_NAME !=
        null
      ) {
        setSolvencyOrBankCertificateFileName(
          pageThreeDetails.data
            .COMPANY_BANK_SOLVENCY_CIRTIFICATE_ORIGINAL_FILE_NAME
        );
      }
      if (
        pageThreeDetails.data.EXCELLENCY_SPECIALIED_CIRTIFICATE_FILE_NAME !=
        null
      ) {
        setExcellencyOrSepcializationCertificateFileName(
          pageThreeDetails.data
            .EXCELLENCY_SPECIALIED_CIRTIFICATE_ORIGINAL_FILE_NAME
        );
      }
      if (pageThreeDetails.data.RECOMMENDATION_CIRTIFICATE_FILE_NAME != null) {
        setRecommendationOrPerformanceCertificateFileName(
          pageThreeDetails.data.RECOMMENDATION_CIRTIFICATE_ORIGINAL_FILE_NAME
        );
      }
      if (pageThreeDetails.data.COMPANY_PROFILE_FILE_NAME != null) {
        setCompanyProfileFileName(
          pageThreeDetails.data.COMPANY_PROFILE_ORIGINAL_FILE_NAME
        );
      }
      if (pageThreeDetails.data.QA_CIRTIFICATE_FILE_NAME != null) {
        setQualityCertificateFileName(
          pageThreeDetails.data.QA_CIRTIFICATE_ORIGINAL_FILE_NAME
        );
      }
      if (pageThreeDetails.data.ANNUAL_TURNOVER_FILE_NAME != null) {
        setAnnualTurnoverFileName(
          pageThreeDetails.data.ANNUAL_TURNOVER_ORIGINAL_FILE_NAME
        );
      }
    }
  };

  const [goodsOrServiceFileName, setGoodsOrServiceFileName] = useState<
    string | null
  >("" || null);

  const [goodsOrServiceFile, setGoodsOrServiceFile] = useState<File | null>(
    null
  );

  const handleGoodsOrServices = (file: File | null) => {
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file);
      setGoodsOrServiceFile(file);
    } else {
      // No file selected
      console.log("No file selected");
    }
  };
  const [
    solvencyOrBankCertificateFileName,
    setSolvencyOrBankCertificateFileName,
  ] = useState<string | null>("" || null);

  const [solvencyOrBankCertificateFile, setSolvencyOrBankCertificateFile] =
    useState<File | null>(null);
  const handleSolvencyOrBankCertificate = (file: File | null) => {
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file);
      setSolvencyOrBankCertificateFile(file);
    } else {
      // No file selected
      console.log("No file selected");
    }
  };

  const [
    excellencyOrSepcializationCertificateFileName,
    setExcellencyOrSepcializationCertificateFileName,
  ] = useState<string | null>("" || null);
  const [
    excellencyOrSepcializationCertificateFile,
    setExcellencyOrSepcializationCertificateFile,
  ] = useState<File | null>(null);

  const handleExcellencyOrSepcializationCertificate = (file: File | null) => {
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file);
      setExcellencyOrSepcializationCertificateFile(file);
    } else {
      // No file selected
      console.log("No file selected");
    }
  };

  const [
    recommendationOrPerformanceCertificateFileName,
    setRecommendationOrPerformanceCertificateFileName,
  ] = useState<string | null>("" || null);
  const [
    recommendationOrPerformanceCertificateFile,
    setRecommendationOrPerformanceCertificateFile,
  ] = useState<File | null>(null);

  const handleRecommendationOrPerformanceCertificate = (file: File | null) => {
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file);
      setRecommendationOrPerformanceCertificateFile(file);
    } else {
      // No file selected
      console.log("No file selected");
    }
  };

  const [companyProfileFileName, setCompanyProfileFileName] = useState<
    string | null
  >("" || null);
  const [companyProfileFile, setCompanyProfileFile] = useState<File | null>(
    null
  );

  const handleCompanyProfile = (file: File | null) => {
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file);
      setCompanyProfileFile(file);
    } else {
      // No file selected
      console.log("No file selected");
    }
  };

  const [qualityCertificateFileName, setQualityCertificateFileName] = useState<
    string | null
  >("" || null);
  const [qualityCertificateFile, setQualityCertificateFile] =
    useState<File | null>(null);

  const handleQualityCertificate = (file: File | null) => {
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file);
      setQualityCertificateFile(file);
    } else {
      // No file selected
      console.log("No file selected");
    }
  };

  const [annualTurnoverFileName, setAnnualTurnoverFileName] = useState<
    string | null
  >("" || null);
  const [annualTurnoverFile, setAnnualTurnoverFile] = useState<File | null>(
    null
  );
  const handleAnnualTurnover = (file: File | null) => {
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file);
      setAnnualTurnoverFile(file);
    } else {
      // No file selected
      console.log("No file selected");
    }
  };

  const submitAndNext = async () => {
    setIsSubmitLoading(true);

    try {
      const result = await AddUpdatePageThreeService(
        regToken!,
        goodsOrServiceFile,
        solvencyOrBankCertificateFile,
        excellencyOrSepcializationCertificateFile,
        recommendationOrPerformanceCertificateFile,
        companyProfileFile,
        qualityCertificateFile,
        annualTurnoverFile,
        3
      );

      if (result.data.status === 200) {
        showSuccessToast(result.data.message);
        setTimeout(() => {
          setPage(4);
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
  const previous = () => {
    setPage(2);
  };
  const next = () => {
    setPage(4);
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
        case "goodsService":
          await removeGoodsService(fileToRemove);
          break;

        case "solvencyBank":
          await removeSolvencyBank(fileToRemove);
          break;

        case "excellenceSpecial":
          await removeExcellencySpecialization(fileToRemove);
          break;

        case "recommendation":
          await removeRecommendation(fileToRemove);
          break;

        case "companyProfile":
          await removeCompanyProfile(fileToRemove);
          break;

        case "qualityAssurance":
          await removeQualityAssurance(fileToRemove);
          break;

        case "annualTurnover":
          await removeAnnualTurnover(fileToRemove);
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

  const removeGoodsService = async (removeFileName: string) => {
    // setIsOpenFileRemoveModal(true);

    setIsLoading(true);
    console.log("fileName function: ", removeFileName);

    const result = await DocumentFileRemoveService(
      regToken!,
      "xxp2p_supplier_registration_documents",
      "GOODS_LIST_FILE_NAME",
      "GOODS_LIST_ORG_FILE_NAME",
      removeFileName,
      "goodsListFile"
    );

    // if (result.data.status === 200) {
    //   setGoodsOrServiceFileName(null);
    //   showSuccessToast(result.data.message);
    // } else {
    //   showErrorToast(result.data.message);
    // }

    if (result.data.status === 200) {
      setGoodsOrServiceFileName(null);
      setPageThreeDetails((prevDetails) => {
        if (!prevDetails) return prevDetails;

        const updatedDetails = {
          ...prevDetails,
          goods_list_file_path_name: "",
          data: {
            ...prevDetails.data,
            GOODS_LIST_FILE_NAME: null,
            GOODS_LIST_ORG_FILE_NAME: null,
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

  const removeSolvencyBank = async (removeFileName: string) => {
    // setIsOpenFileRemoveModal(true);

    setIsLoading(true);
    console.log("fileName function: ", removeFileName);

    const result = await DocumentFileRemoveService(
      regToken!,
      "xxp2p_supplier_registration_documents",
      "COMPANY_BANK_SOLVENCY_CIRTIFICATE_FILE_NAME",
      "COMPANY_BANK_SOLVENCY_CIRTIFICATE_ORIGINAL_FILE_NAME",
      removeFileName,
      "companyBankSolvencyCirtificateFile"
    );

    // if (result.data.status === 200) {
    //   setSolvencyOrBankCertificateFileName(null);
    //   showSuccessToast(result.data.message);
    // } else {
    //   showErrorToast(result.data.message);
    // }

    if (result.data.status === 200) {
      setSolvencyOrBankCertificateFileName(null);
      setPageThreeDetails((prevDetails) => {
        if (!prevDetails) return prevDetails;

        const updatedDetails = {
          ...prevDetails,
          company_bank_solvency_cirtificate_file_path_name: "",
          data: {
            ...prevDetails.data,
            COMPANY_BANK_SOLVENCY_CIRTIFICATE_FILE_NAME: null,
            COMPANY_BANK_SOLVENCY_CIRTIFICATE_ORIGINAL_FILE_NAME: null,
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

  const removeExcellencySpecialization = async (removeFileName: string) => {
    // setIsOpenFileRemoveModal(true);

    setIsLoading(true);
    console.log("fileName function: ", removeFileName);

    const result = await DocumentFileRemoveService(
      regToken!,
      "xxp2p_supplier_registration_documents",
      "EXCELLENCY_SPECIALIED_CIRTIFICATE_FILE_NAME",
      "EXCELLENCY_SPECIALIED_CIRTIFICATE_ORIGINAL_FILE_NAME",
      removeFileName,
      "excellencySpecialiedCirtificateFile"
    );

    // if (result.data.status === 200) {
    //   setExcellencyOrSepcializationCertificateFileName(null);
    //   showSuccessToast(result.data.message);
    // } else {
    //   showErrorToast(result.data.message);
    // }

    if (result.data.status === 200) {
      setExcellencyOrSepcializationCertificateFileName(null);
      setPageThreeDetails((prevDetails) => {
        if (!prevDetails) return prevDetails;

        const updatedDetails = {
          ...prevDetails,
          excellency_specialied_cirtificate_file_path_name: "",
          data: {
            ...prevDetails.data,
            EXCELLENCY_SPECIALIED_CIRTIFICATE_FILE_NAME: null,
            EXCELLENCY_SPECIALIED_CIRTIFICATE_ORIGINAL_FILE_NAME: null,
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

  const removeRecommendation = async (removeFileName: string) => {
    // setIsOpenFileRemoveModal(true);

    setIsLoading(true);
    console.log("fileName function: ", removeFileName);

    const result = await DocumentFileRemoveService(
      regToken!,
      "xxp2p_supplier_registration_documents",
      "RECOMMENDATION_CIRTIFICATE_FILE_NAME",
      "RECOMMENDATION_CIRTIFICATE_ORIGINAL_FILE_NAME",
      removeFileName,
      "recommendationCirtificateFile"
    );

    // if (result.data.status === 200) {
    //   setRecommendationOrPerformanceCertificateFileName(null);
    //   showSuccessToast(result.data.message);
    // } else {
    //   showErrorToast(result.data.message);
    // }

    if (result.data.status === 200) {
      setRecommendationOrPerformanceCertificateFileName(null);
      setPageThreeDetails((prevDetails) => {
        if (!prevDetails) return prevDetails;

        const updatedDetails = {
          ...prevDetails,
          recommendation_cirtificate_file_path_name: "",
          data: {
            ...prevDetails.data,
            RECOMMENDATION_CIRTIFICATE_FILE_NAME: null,
            RECOMMENDATION_CIRTIFICATE_ORIGINAL_FILE_NAME: null,
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

  const removeCompanyProfile = async (removeFileName: string) => {
    // setIsOpenFileRemoveModal(true);

    setIsLoading(true);
    console.log("fileName function: ", removeFileName);

    const result = await DocumentFileRemoveService(
      regToken!,
      "xxp2p_supplier_registration_documents",
      "COMPANY_PROFILE_FILE_NAME",
      "COMPANY_PROFILE_ORIGINAL_FILE_NAME",
      removeFileName,
      "companyProfileFile"
    );

    // if (result.data.status === 200) {
    //   setCompanyProfileFileName(null);
    //   showSuccessToast(result.data.message);
    // } else {
    //   showErrorToast(result.data.message);
    // }

    if (result.data.status === 200) {
      setCompanyProfileFileName(null);
      setPageThreeDetails((prevDetails) => {
        if (!prevDetails) return prevDetails;

        const updatedDetails = {
          ...prevDetails,
          company_profile_file_path_name: "",
          data: {
            ...prevDetails.data,
            COMPANY_PROFILE_FILE_NAME: null,
            COMPANY_PROFILE_ORIGINAL_FILE_NAME: null,
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

  const removeQualityAssurance = async (removeFileName: string) => {
    // setIsOpenFileRemoveModal(true);

    setIsLoading(true);
    console.log("fileName function: ", removeFileName);

    const result = await DocumentFileRemoveService(
      regToken!,
      "xxp2p_supplier_registration_documents",
      "QA_CIRTIFICATE_FILE_NAME",
      "QA_CIRTIFICATE_ORIGINAL_FILE_NAME",
      removeFileName,
      "qaCirtificateFile"
    );

    // if (result.data.status === 200) {
    //   setQualityCertificateFileName(null);
    //   showSuccessToast(result.data.message);
    // } else {
    //   showErrorToast(result.data.message);
    // }

    if (result.data.status === 200) {
      setQualityCertificateFileName(null);
      setPageThreeDetails((prevDetails) => {
        if (!prevDetails) return prevDetails;

        const updatedDetails = {
          ...prevDetails,
          qa_cirtificate_file_path_name: "",
          data: {
            ...prevDetails.data,
            QA_CIRTIFICATE_FILE_NAME: null,
            QA_CIRTIFICATE_ORIGINAL_FILE_NAME: null,
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

  const removeAnnualTurnover = async (removeFileName: string) => {
    // setIsOpenFileRemoveModal(true);

    setIsLoading(true);
    console.log("fileName function: ", removeFileName);

    const result = await DocumentFileRemoveService(
      regToken!,
      "xxp2p_supplier_registration_documents",
      "ANNUAL_TURNOVER_FILE_NAME",
      "ANNUAL_TURNOVER_ORIGINAL_FILE_NAME",
      removeFileName,
      "annualTurnoverFile"
    );

    // if (result.data.status === 200) {
    //   setAnnualTurnoverFileName(null);
    //   showSuccessToast(result.data.message);
    // } else {
    //   showErrorToast(result.data.message);
    // }

    if (result.data.status === 200) {
      setAnnualTurnoverFileName(null);
      setPageThreeDetails((prevDetails) => {
        if (!prevDetails) return prevDetails;

        const updatedDetails = {
          ...prevDetails,
          annual_turnover_file_path_name: "",
          data: {
            ...prevDetails.data,
            ANNUAL_TURNOVER_FILE_NAME: null,
            ANNUAL_TURNOVER_ORIGINAL_FILE_NAME: null,
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

  const [fileLoading, setFileLoading] = useState<boolean>(false);

  const [availableGoodsFileLoading, setAvailableGoodsFileLoading] =
    useState<boolean>(false);

  const [bankSolvencyFileLoading, setBankSolvencyFileLoading] =
    useState<boolean>(false);

  const [excellencyFileLoading, setExcellencyFileLoading] =
    useState<boolean>(false);

  const [
    performanceCertificateFileLoading,
    setPerformanceCertificateFileLoading,
  ] = useState<boolean>(false);

  const [companyProfileFileLoading, setCompanyProfileFileLoading] =
    useState<boolean>(false);

  const [qaCertificateFileLoading, setQualityCertificateFileLoading] =
    useState<boolean>(false);

  const [annualTurnOverFileLoading, setAnnualTurnOverFileLoading] =
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
        <div className=" w-full flex h-screen justify-center items-center">
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
            <div className=" w-48 h-[2px] bg-midGreen"></div>
            <div className=" bg-midGreen h-8 w-8 flex justify-center items-center rounded-full border-[2px] border-midGreen text-white font-mon font-medium">
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
          <PageTitle titleText={"Step-3"} />
          <div className=" flex flex-row w-full justify-between items-start">
            <div className=" flex flex-col items-start space-y-2">
              <InputLebel titleText={"List of Available Goods / Service"} />
              <FilePickerInput
                onFileSelect={handleGoodsOrServices}
                initialFileName={goodsOrServiceFileName!}
                mimeType=".pdf, image/*"
                maxSize={5 * 1024 * 1024}
                disable={isDisable}
              />
              {pageThreeDetails?.goods_list_file_path_name != null &&
              pageThreeDetails?.data.GOODS_LIST_FILE_NAME != null &&
              pageThreeDetails?.data.GOODS_LIST_FILE_NAME !== "" ? (
                <div className=" flex items-center space-x-6">
                  {availableGoodsFileLoading ? (
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
                          pageThreeDetails?.goods_list_file_path_name!,
                          pageThreeDetails?.data.GOODS_LIST_FILE_NAME!,
                          setAvailableGoodsFileLoading
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
                          pageThreeDetails?.data.GOODS_LIST_FILE_NAME!,
                          "goodsService"
                        )
                      }
                      className=" py-2 px-2 rounded-md shadow-sm border-borderColor border-[0.5px]"
                    >
                      <DeleteIcon />
                    </button>
                  )}
                </div>
              ) : // <button
              //   onClick={() => handleOpenModal(pageThreeDetails?.data.GOODS_LIST_FILE_NAME!, 'goodsService')}
              //   className=" py-2 w-full  flex justify-center items-center rounded-md shadow-sm border-borderColor border-[0.5px]"
              // >
              //   <DeleteIcon />
              // </button>

              null}
            </div>
            <div className=" flex flex-col items-start space-y-2">
              <InputLebel
                titleText={"Company Solvency Certificate / Bank Certificate"}
              />
              <FilePickerInput
                onFileSelect={handleSolvencyOrBankCertificate}
                initialFileName={solvencyOrBankCertificateFileName!}
                mimeType=".pdf, image/*"
                maxSize={5 * 1024 * 1024}
                disable={isDisable}
              />
              {pageThreeDetails?.company_bank_solvency_cirtificate_file_path_name !=
                null &&
              pageThreeDetails?.data
                .COMPANY_BANK_SOLVENCY_CIRTIFICATE_FILE_NAME != null &&
              pageThreeDetails?.data
                .COMPANY_BANK_SOLVENCY_CIRTIFICATE_FILE_NAME !== "" ? (
                <div className=" flex items-center space-x-6">
                  {bankSolvencyFileLoading ? (
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
                          pageThreeDetails?.company_bank_solvency_cirtificate_file_path_name!,
                          pageThreeDetails?.data
                            .COMPANY_BANK_SOLVENCY_CIRTIFICATE_FILE_NAME!,
                          setBankSolvencyFileLoading
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
                          pageThreeDetails?.data
                            .COMPANY_BANK_SOLVENCY_CIRTIFICATE_FILE_NAME!,
                          "solvencyBank"
                        )
                      }
                      className=" py-2 px-2 rounded-md shadow-sm border-borderColor border-[0.5px]"
                    >
                      <DeleteIcon />
                    </button>
                  )}
                </div>
              ) : // <button
              //   onClick={() => handleOpenModal(pageThreeDetails?.data.COMPANY_BANK_SOLVENCY_CIRTIFICATE_FILE_NAME!, 'solvencyBank')}
              //   className=" py-2 w-full  flex justify-center items-center rounded-md shadow-sm border-borderColor border-[0.5px]"
              // >
              //   <DeleteIcon />
              // </button>

              null}
            </div>
          </div>
          <div className=" flex flex-row w-full justify-between items-start">
            <div className=" flex flex-col items-start space-y-2">
              <InputLebel
                titleText={"Certificates of Excellency, Specializations etc"}
              />
              <FilePickerInput
                onFileSelect={handleExcellencyOrSepcializationCertificate}
                initialFileName={excellencyOrSepcializationCertificateFileName!}
                mimeType=".pdf, image/*"
                maxSize={5 * 1024 * 1024}
                disable={isDisable}
              />
              {pageThreeDetails?.excellency_specialied_cirtificate_file_path_name !=
                null &&
              pageThreeDetails?.data
                .EXCELLENCY_SPECIALIED_CIRTIFICATE_FILE_NAME != null &&
              pageThreeDetails?.data
                .EXCELLENCY_SPECIALIED_CIRTIFICATE_FILE_NAME !== "" ? (
                <div className=" flex items-center space-x-6">
                  {excellencyFileLoading ? (
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
                          pageThreeDetails?.excellency_specialied_cirtificate_file_path_name!,
                          pageThreeDetails?.data
                            .EXCELLENCY_SPECIALIED_CIRTIFICATE_FILE_NAME!,
                          setExcellencyFileLoading
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
                          pageThreeDetails?.data
                            .EXCELLENCY_SPECIALIED_CIRTIFICATE_FILE_NAME!,
                          "excellenceSpecial"
                        )
                      }
                      className=" py-2 px-2 rounded-md shadow-sm border-borderColor border-[0.5px]"
                    >
                      <DeleteIcon />
                    </button>
                  )}
                </div>
              ) : // <button
              //   onClick={() => handleOpenModal(pageThreeDetails?.data.EXCELLENCY_SPECIALIED_CIRTIFICATE_FILE_NAME!, 'excellenceSpecial')}
              //   className=" py-2 w-full  flex justify-center items-center rounded-md shadow-sm border-borderColor border-[0.5px]"
              // >
              //   <DeleteIcon />
              // </button>

              null}
            </div>
            <div className=" flex flex-col items-start space-y-2">
              <InputLebel
                titleText={"Recommendation / Performance Certificate"}
              />
              <FilePickerInput
                onFileSelect={handleRecommendationOrPerformanceCertificate}
                initialFileName={
                  recommendationOrPerformanceCertificateFileName!
                }
                mimeType=".pdf, image/*"
                maxSize={5 * 1024 * 1024}
                disable={isDisable}
              />

              {pageThreeDetails?.recommendation_cirtificate_file_path_name !=
                null &&
              pageThreeDetails?.data.RECOMMENDATION_CIRTIFICATE_FILE_NAME !=
                null &&
              pageThreeDetails?.data.RECOMMENDATION_CIRTIFICATE_FILE_NAME !==
                "" ? (
                <div className=" flex items-center space-x-6">
                  {performanceCertificateFileLoading ? (
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
                          pageThreeDetails.recommendation_cirtificate_file_path_name!,
                          pageThreeDetails.data
                            .RECOMMENDATION_CIRTIFICATE_FILE_NAME!,
                          setPerformanceCertificateFileLoading
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
                          pageThreeDetails?.data
                            .RECOMMENDATION_CIRTIFICATE_FILE_NAME!,
                          "recommendation"
                        )
                      }
                      className=" py-2 px-2 rounded-md shadow-sm border-borderColor border-[0.5px]"
                    >
                      <DeleteIcon />
                    </button>
                  )}
                </div>
              ) : // <button
              //   onClick={() => handleOpenModal(pageThreeDetails?.data.RECOMMENDATION_CIRTIFICATE_FILE_NAME!, 'recommendation')}
              //   className=" py-2 w-full  flex justify-center items-center rounded-md shadow-sm border-borderColor border-[0.5px]"
              // >
              //   <DeleteIcon />
              // </button>

              null}
            </div>
          </div>
          <div className=" flex flex-row w-full justify-between items-start">
            <div className=" flex flex-col items-start space-y-2">
              <InputLebel titleText={"Company Profile"} />
              <FilePickerInput
                onFileSelect={handleCompanyProfile}
                initialFileName={companyProfileFileName!}
                mimeType=".pdf, image/*"
                maxSize={5 * 1024 * 1024}
                disable={isDisable}
              />
              {pageThreeDetails?.company_profile_file_path_name != null &&
              pageThreeDetails?.data.COMPANY_PROFILE_FILE_NAME != null &&
              pageThreeDetails?.data.COMPANY_PROFILE_FILE_NAME !== "" ? (
                <div className=" flex items-center space-x-6">
                  {companyProfileFileLoading ? (
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
                          pageThreeDetails.company_profile_file_path_name!,
                          pageThreeDetails.data.COMPANY_PROFILE_FILE_NAME!,
                          setCompanyProfileFileLoading
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
                          pageThreeDetails?.data.COMPANY_PROFILE_FILE_NAME!,
                          "companyProfile"
                        )
                      }
                      className=" py-2 px-2 rounded-md shadow-sm border-borderColor border-[0.5px]"
                    >
                      <DeleteIcon />
                    </button>
                  )}
                </div>
              ) : // <button
              //   onClick={() => handleOpenModal(pageThreeDetails?.data.COMPANY_PROFILE_FILE_NAME!, 'companyProfile')}
              //   className=" py-2 w-full  flex justify-center items-center rounded-md shadow-sm border-borderColor border-[0.5px]"
              // >
              //   <DeleteIcon />
              // </button>

              null}
            </div>
            <div className=" flex flex-col items-start space-y-2">
              <InputLebel titleText={"Quality Assurance Certificate"} />
              <FilePickerInput
                onFileSelect={handleQualityCertificate}
                initialFileName={qualityCertificateFileName!}
                mimeType=".pdf, image/*"
                maxSize={5 * 1024 * 1024}
                disable={isDisable}
              />
              {pageThreeDetails?.qa_cirtificate_file_path_name != null &&
              pageThreeDetails?.data.QA_CIRTIFICATE_FILE_NAME != null &&
              pageThreeDetails?.data.QA_CIRTIFICATE_FILE_NAME !== "" ? (
                <div className=" flex items-center space-x-6">
                  {qaCertificateFileLoading ? (
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
                          pageThreeDetails.qa_cirtificate_file_path_name!,
                          pageThreeDetails.data.QA_CIRTIFICATE_FILE_NAME!,
                          setQualityCertificateFileLoading
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
                          pageThreeDetails?.data.QA_CIRTIFICATE_FILE_NAME!,
                          "qualityAssurance"
                        )
                      }
                      className=" py-2 px-2 rounded-md shadow-sm border-borderColor border-[0.5px]"
                    >
                      <DeleteIcon />
                    </button>
                  )}
                </div>
              ) : // <button
              //   onClick={() => handleOpenModal(pageThreeDetails?.data.QA_CIRTIFICATE_FILE_NAME!, 'qualityAssurance')}
              //   className=" py-2 w-full  flex justify-center items-center rounded-md shadow-sm border-borderColor border-[0.5px]"
              // >
              //   <DeleteIcon />
              // </button>

              null}
            </div>
          </div>
          <div className=" flex flex-row w-full justify-between items-start">
            <div className=" flex flex-col items-start space-y-2">
              <InputLebel titleText={"Annual Turnover(Non-BD)"} />
              <FilePickerInput
                onFileSelect={handleAnnualTurnover}
                initialFileName={annualTurnoverFileName!}
                mimeType=".pdf, image/*"
                maxSize={5 * 1024 * 1024}
                disable={isDisable}
              />
              {pageThreeDetails?.annual_turnover_file_path_name != null &&
              pageThreeDetails?.data.ANNUAL_TURNOVER_FILE_NAME != null &&
              pageThreeDetails?.data.ANNUAL_TURNOVER_FILE_NAME !== "" ? (
                <div className=" flex items-center space-x-6">
                  {annualTurnOverFileLoading ? (
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
                          pageThreeDetails.annual_turnover_file_path_name!,
                          pageThreeDetails.data.ANNUAL_TURNOVER_FILE_NAME!,
                          setAnnualTurnOverFileLoading
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
                          pageThreeDetails?.data.ANNUAL_TURNOVER_FILE_NAME!,
                          "annualTurnover"
                        )
                      }
                      className=" py-2 px-2 rounded-md shadow-sm border-borderColor border-[0.5px]"
                    >
                      <DeleteIcon />
                    </button>
                  )}
                </div>
              ) : // <button
              //   onClick={() => handleOpenModal(pageThreeDetails?.data.ANNUAL_TURNOVER_FILE_NAME!, 'annualTurnover')}
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
