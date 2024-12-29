import React, { useRef, useState, useEffect } from "react";
import InputLebel from "../../../common_component/InputLebel";
import CommonInputField from "../../../common_component/CommonInputField";
import FilePickerInput from "../../../common_component/FilePickerInput";

import CommonButton from "../../../common_component/CommonButton";
import { useDocumentPageContext } from "../../context/DocumentPageContext";
import DateRangePicker from "../../../common_component/DateRangePicker";
import { useAuth } from "../../../login_both/context/AuthContext";

import PageOneInterface from "../../interface/PageOneInterface";

import SuccessToast, {
  showSuccessToast,
} from "../../../Alerts_Component/SuccessToast";
import ErrorToast, {
  showErrorToast,
} from "../../../Alerts_Component/ErrorToast";
import ExistingDocumentService from "../../service/document/ExistingDocumentService";
import LogoLoading from "../../../Loading_component/LogoLoading";

import moment from "moment";
import AddUpdatePageOneService from "../../service/document/page_one/AddUpdatePageOneService";
import CircularProgressIndicator from "../../../Loading_component/CircularProgressIndicator";
import { isTokenValid } from "../../../utils/methods/TokenValidityCheck";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../../common_component/PageTitle";

import { Steps } from "keep-react";
import WarningModal from "../../../common_component/WarningModal";
import ProfileUpdateSubmissionService from "../../service/profile_update_submission/ProfileUpdateSubmissionService";
import ValidationError from "../../../Alerts_Component/ValidationError";
import DeleteIcon from "../../../icons/DeleteIcon";
import DocumentFileRemoveService from "../../service/declaration/DocumentFileRemoveService";
import WarningIcon from "../../../icons/WarningIcon";
import fetchFileService from "../../../common_service/fetchFileService";

export default function PageOne() {
  const registrationNumberRef = useRef<HTMLInputElement | null>(null);
  const etinNumberRef = useRef<HTMLInputElement | null>(null);
  const ebinNumberRef = useRef<HTMLInputElement | null>(null);
  const taxReturnYearRef = useRef<HTMLInputElement | null>(null);
  const [assesmentYear, setAssesmentYear] = useState({
    startDate: null,
    endDate: null, // Set the endDate to the end of the current year
  });

  const [addUpdateStartDate, setAddUpdateStartDate] = useState<string>("");

  const [addUpdateEndDate, setAddUpdateEndDate] = useState<string>("");

  const [startDate, setStartDate] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: new Date(new Date().getFullYear(), 11, 31), // Set the endDate to the end of the current year
  });
  const [startDate2, setStartDate2] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: new Date(new Date().getFullYear() + 100, 11, 31), // Set the endDate to the end of the current year
  });

  const handleStartDateChange = (newValue: any) => {
    console.log("date clear", newValue);
    if (newValue.startDate) {
      setStartDate(newValue);
      // Handle the selected date here
      setAddUpdateStartDate(moment(newValue.startDate).format("YYYY-MM-DD"));
    } else {
      console.log("clear hoise");
      setAddUpdateStartDate("");
    }
  };
  const handleStartDateChange2 = (newValue: any) => {
    if (newValue.startDate) {
      setStartDate2(newValue);
      // Handle the selected date here
      setAddUpdateEndDate(moment(newValue.startDate).format("YYYY-MM-DD"));
    } else {
      setAddUpdateEndDate("");
    }
  };

  const [tradeOrExportNumber, setTradeOrExportNumber] = useState<string>("");
  const [etinNumber, setEtinNumber] = useState<string>("");
  const [ebinNumber, setBtinNumber] = useState<string>("");
  const [taskReturnYear, setTaskReturnYear] = useState<string>("");
  const [pageOneDetails, setPageOneDetails] = useState<PageOneInterface | null>(
    null
  );

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
      GetExistingDocument();
    }
  }, []);

  //get exsiting docuent

  //re-render for set data

  useEffect(() => {
    if (pageOneDetails?.data.EBIN_FILE_NAME !== "") {
      setData();
    }
  }, [pageOneDetails]);

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
      const result = await ExistingDocumentService(regToken!, 1);
      console.log(result.data.data);

      if (result.data.status === 200) {
        setIsLoading(false);
        // showSuccessToast(result.data.message);
        setPageOneDetails(result.data);
      } else {
        setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      showErrorToast("Something went wrong");
    }
  };

  // const setData = () => {
  //     if (pageOneDetails && registrationNumberRef.current && etinNumberRef.current && ebinNumberRef.current && taxReturnYearRef.current) {
  //         registrationNumberRef.current.value = pageOneDetails.data.TRADE_OR_EXPORT_LICENSE_NUMBER.toString() || '';
  //         setTradeOrExportNumber(pageOneDetails.data.TRADE_OR_EXPORT_LICENSE_NUMBER.toString()!);
  //         etinNumberRef.current.value = pageOneDetails?.data.ETIN_NUMBER.toString() || '';
  //         setEtinNumber(pageOneDetails.data.ETIN_NUMBER.toString()!);
  //         ebinNumberRef.current.value = pageOneDetails.data.EBIN_NUMBER?.toString() || '';
  //         setBtinNumber(pageOneDetails.data.EBIN_NUMBER?.toString()!);

  //     }
  // }

  const setData = () => {
    console.log("set called");

    if (pageOneDetails && pageOneDetails.data) {
      const { data } = pageOneDetails;

      if (registrationNumberRef.current) {
        registrationNumberRef.current.value =
          data.TRADE_OR_EXPORT_LICENSE_NUMBER?.toString() || "";
        setTradeOrExportNumber(
          data.TRADE_OR_EXPORT_LICENSE_NUMBER?.toString() || ""
        );
      }

      if (etinNumberRef.current) {
        etinNumberRef.current.value = data.ETIN_NUMBER?.toString() || "";
        setEtinNumber(data.ETIN_NUMBER?.toString() || "");
      }

      if (ebinNumberRef.current) {
        ebinNumberRef.current.value = data.EBIN_NUMBER?.toString() || "";
        setBtinNumber(data.EBIN_NUMBER?.toString() || "");
      }
      if (taxReturnYearRef.current) {
        taxReturnYearRef.current.value =
          data.TAX_RTN_ASSMNT_YEAR === "null" ? "" : data.TAX_RTN_ASSMNT_YEAR;
        setTaskReturnYear(
          data.TAX_RTN_ASSMNT_YEAR === "null" ? "" : data.TAX_RTN_ASSMNT_YEAR
        );
      }
      const currentYear = new Date().getFullYear();

      if (data?.TRADE_OR_EXPORT_LICENSE_START_DATE != null) {
        // const tradeOrExportLicenseStartDate = data?.TRADE_OR_EXPORT_LICENSE_START_DATE;

        // Check if tradeOrExportLicenseStartDate is not null before creating a new Date object
        const tradeOrExportLicenseStartDate =
          data?.TRADE_OR_EXPORT_LICENSE_START_DATE;

        // Check if tradeOrExportLicenseStartDate is not null before creating a new Date object
        const startDateValue = new Date(tradeOrExportLicenseStartDate!);
        // console.log(startDateValue);

        // const endDateValue = new Date(currentYear, 11, 31); // Set the endDate to the end of the current year

        setStartDate({
          startDate: startDateValue,
          endDate: new Date(currentYear + 1000, 11, 31),
        });
        setAddUpdateStartDate(
          moment(data?.TRADE_OR_EXPORT_LICENSE_START_DATE).format("YYYY-MM-DD")
        );
      }
      if (data?.TRADE_OR_EXPORT_LICENSE_END_DATE != null) {
        // const tradeOrExportLicenseStartDate = data?.TRADE_OR_EXPORT_LICENSE_START_DATE;

        // Check if tradeOrExportLicenseStartDate is not null before creating a new Date object
        const tradeOrExportLicenseStartDate =
          data?.TRADE_OR_EXPORT_LICENSE_END_DATE;

        // Check if tradeOrExportLicenseStartDate is not null before creating a new Date object
        const startDateValue = new Date(tradeOrExportLicenseStartDate!);
        // console.log(startDateValue);

        // const endDateValue = new Date(currentYear, 11, 31); // Set the endDate to the end of the current year

        setStartDate2({
          startDate: startDateValue,
          endDate: new Date(currentYear + 1000, 11, 31),
        });
        setAddUpdateEndDate(
          moment(data?.TRADE_OR_EXPORT_LICENSE_END_DATE).format("YYYY-MM-DD")
        );
      }

      //setiing for sendin to api

      //trade linces

      if (data.TRADE_OR_EXPORT_LICENSE_FILE_NAME != null) {
        setTradeLicenseFileName(
          data.TRADE_OR_EXPORT_LICENSE_ORIGINAL_FILE_NAME
        );
      }

      //return slip

      if (data.TAX_RTN_ACKN_SLIP_FILE_NAME != null) {
        setTaxReturnSlipFileName(data.TAX_RTN_ACKN_SLIP_ORIGINAL_FILE_NAME);
      }

      //etin

      if (data.ETIN_FILE_NAME != null) {
        setEtinFileName(data.ETIN_ORG_FILE_NAME);
      }
      //ebin

      if (data.EBIN_FILE_NAME != null) {
        setEbinFileName(data.EBIN_ORG_FILE_NAME);
      }
    }
  };

  const handleTaxAssementYearChange = (newValue: string) => {
    setTaskReturnYear(newValue);
    // setAddUpdateEndDate(moment(startDate.startDate).format("YYYY-MM-DD"))
  };

  const tradeOrExportNumberChange = (value: string) => {
    setTradeOrExportNumber(value);
  };
  const etinNumberChange = (value: string) => {
    setEtinNumber(value);
  };
  const ebinNumberChange = (value: string) => {
    setBtinNumber(value);
  };

  const [taxReturnSlipFileName, setTaxReturnSlipFileName] = useState<
    string | null
  >(null);
  const [taxReturnSlipFile, setTaxReturnSlipFile] = useState<File | null>(null);

  const [clearSlip, setClearSlip] = useState<boolean>(false);

  const handleTaxReturnSlip = (file: File | null) => {
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file);
      setTaxReturnSlipFile(file);
      setTaxReturnSlipFileName(file.name);
      setClearSlip(false);
    } else {
      // No file selected
      console.log("No file selected");
      setTaxReturnSlipFile(null);
      setTaxReturnSlipFileName(null);
      setClearSlip(false);
    }
  };

  // const removeAckowledgementSlip = () => {
  //   console.log("removed");
  //   setClearSlip(true);

  //   setTaxReturnSlipFile(null);

  //   setTaxReturnSlipFileName(null);
  //   setClearSlip(true);
  //   if (pageOneDetails?.data.TAX_RTN_ACKN_SLIP_FILE_NAME != null) {
  //     setTaxReturnSlipFileName(null);
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
        case "acknowledgementSlip":
          await removeAckowledgementSlip(fileToRemove);
          break;

        case "tradeLicense":
          await removeTradeLicense(fileToRemove);
          break;

        case "etinFile":
          await removeEtinFile(fileToRemove);
          break;

        case "ebinFile":
          await removeEbinFile(fileToRemove);
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

  const removeAckowledgementSlip = async (removeFileName: string) => {
    setIsLoading(true);
    console.log("fileName function: ", removeFileName);

    const result = await DocumentFileRemoveService(
      regToken!,
      "xxp2p_supplier_registration_documents",
      "TAX_RTN_ACKN_SLIP_FILE_NAME",
      "TAX_RTN_ACKN_SLIP_ORIGINAL_FILE_NAME",
      removeFileName,
      "taxRtnAcknSlipFile"
    );

    // if (result.data.status === 200) {
    //   setTaxReturnSlipFileName(null);
    //   showSuccessToast(result.data.message);
    // } else {
    //   showErrorToast(result.data.message);
    // }

    if (result.data.status === 200) {
      setTaxReturnSlipFileName(null);
      setPageOneDetails((prevDetails) => {
        if (!prevDetails) return prevDetails;

        const updatedDetails = {
          ...prevDetails,
          tax_rtn_ackn_slip_file_path_name: "",
          data: {
            ...prevDetails.data,
            TAX_RTN_ACKN_SLIP_FILE_NAME: null,
            TAX_RTN_ACKN_SLIP_ORIGINAL_FILE_NAME: null,
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

  const [tradeLicenseFileName, setTradeLicenseFileName] = useState<
    string | null
  >(null);
  const [tradeLicenseFile, setTradeLicenseFile] = useState<File | null>(null);
  const [clearTradeLicense, setClearTradeLinces] = useState<boolean>(false);

  const handleTradeLicense = (file: File | null) => {
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file);
      setTradeLicenseFile(file);
    } else {
      // No file selected
      console.log("No file selected");
    }
  };

  // const removeTradeLicense = () => {
  //   console.log("removed");
  //   setClearTradeLinces(true);

  //   setTradeLicenseFile(null);
  //   setTradeLicenseFileName(null);

  //   setClearSlip(true);
  //   if (pageOneDetails?.data.TRADE_OR_EXPORT_LICENSE_FILE_NAME != null) {
  //     setTradeLicenseFileName(null);
  //   }
  // };

  const removeTradeLicense = async (removeFileName: string) => {
    setIsLoading(true);
    console.log("fileName function: ", removeFileName);

    const result = await DocumentFileRemoveService(
      regToken!,
      "xxp2p_supplier_registration_documents",
      "TRADE_OR_EXPORT_LICENSE_FILE_NAME",
      "TRADE_OR_EXPORT_LICENSE_ORIGINAL_FILE_NAME",
      removeFileName,
      "tradeOrExportLicense"
    );

    // if (result.data.status === 200) {
    //   setTradeLicenseFileName(null);
    //   showSuccessToast(result.data.message);
    // } else {
    //   showErrorToast(result.data.message);
    // }

    if (result.data.status === 200) {
      setTradeLicenseFileName(null);
      setPageOneDetails((prevDetails) => {
        if (!prevDetails) return prevDetails;

        const updatedDetails = {
          ...prevDetails,
          trade_or_export_license_file_path_name: "",
          data: {
            ...prevDetails.data,
            TRADE_OR_EXPORT_LICENSE_FILE_NAME: null,
            TRADE_OR_EXPORT_LICENSE_ORIGINAL_FILE_NAME: null,
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

  const [eTinFileName, setEtinFileName] = useState<string | null>(null);
  const [eTinFile, setEtinFile] = useState<File | null>(null);
  const [etinClear, setEtinClear] = useState<boolean>(false);

  const handleEtin = (file: File | null) => {
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file);
      setEtinFile(file);
    } else {
      // No file selected
      console.log("No file selected");
    }
  };

  // const removeEtinFile = () => {
  //   setEtinFileName(null);
  //   setEtinFile(null);
  //   setEtinClear(true);
  //   if (pageOneDetails?.data.ETIN_ORG_FILE_NAME != null) {
  //     setEtinFileName(null);
  //   }
  // };

  const removeEtinFile = async (removeFileName: string) => {
    setIsLoading(true);
    console.log("fileName function: ", removeFileName);

    const result = await DocumentFileRemoveService(
      regToken!,
      "xxp2p_supplier_registration_documents",
      "ETIN_FILE_NAME",
      "ETIN_ORG_FILE_NAME",
      removeFileName,
      "etinFile"
    );

    // if (result.data.status === 200) {
    //   setEtinFileName(null);
    //   showSuccessToast(result.data.message);
    // } else {
    //   showErrorToast(result.data.message);
    // }

    if (result.data.status === 200) {
      setEtinFileName(null);
      setPageOneDetails((prevDetails) => {
        if (!prevDetails) return prevDetails;

        const updatedDetails = {
          ...prevDetails,
          etin_file_path_name: "",
          data: {
            ...prevDetails.data,
            ETIN_FILE_NAME: null,
            ETIN_ORG_FILE_NAME: null,
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

  const [eBinFileName, setEbinFileName] = useState<string | null>(null);
  const [ebinFile, setEbinFile] = useState<File | null>(null);
  const [ebinClear, setEbinClear] = useState<boolean>(false);

  const handleEbin = (file: File | null) => {
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file);
      setEbinFile(file);
    } else {
      // No file selected
      console.log("No file selected");
    }
  };

  // const removeEbinFile = () => {
  //   setEbinClear(true);
  //   setEbinFile(null);
  //   setEbinFileName(null);
  //   if (pageOneDetails?.data.EBIN_FILE_NAME != null) {
  //     setEbinFileName(null);
  //   }
  // };

  const removeEbinFile = async (removeFileName: string) => {
    setIsLoading(true);
    console.log("fileName function: ", removeFileName);

    const result = await DocumentFileRemoveService(
      regToken!,
      "xxp2p_supplier_registration_documents",
      "EBIN_FILE_NAME",
      "EBIN_ORG_FILE_NAME",
      removeFileName,
      "ebinFile"
    );

    // if (result.data.status === 200) {
    //   setEbinFileName(null);
    //   showSuccessToast(result.data.message);
    // } else {
    //   showErrorToast(result.data.message);
    // }

    if (result.data.status === 200) {
      setEbinFileName(null);
      setPageOneDetails((prevDetails) => {
        if (!prevDetails) return prevDetails;

        const updatedDetails = {
          ...prevDetails,
          ebin_file_path_name: "",
          data: {
            ...prevDetails.data,
            EBIN_FILE_NAME: null,
            EBIN_ORG_FILE_NAME: null,
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

  const [documentError, setDocumentError] = useState<{
    tradeLicenseNumber?: string;
    startDate?: string;
    endDate?: string;
  }>({});

  const validate = () => {
    const errors: {
      tradeLicenseNumber?: string;
      startDate?: string;
      endDate?: string;
    } = {};

    if (!tradeOrExportNumber.trim()) {
      errors.tradeLicenseNumber =
        "Please Enter Trade License/ Export License number";
    }
    if (addUpdateStartDate === "") {
      errors.startDate =
        "Please Select Trade License/ Export License Start Date";
    }
    if (addUpdateEndDate === "") {
      errors.endDate = "Please Select Trade License/ Export License End Date";
    }

    setDocumentError(errors);

    return Object.keys(errors).length === 0;
  };

  const submitAndNext = async () => {
    console.log(addUpdateStartDate);
    console.log(addUpdateEndDate);
    // setPage(2);
    if (validate()) {
      setIsSubmitLoading(true);

      try {
        const result = await AddUpdatePageOneService(
          regToken!,
          tradeOrExportNumber,
          addUpdateStartDate,
          addUpdateEndDate,
          tradeLicenseFile,
          etinNumber,
          taxReturnSlipFile,
          ebinFile,
          eTinFile,
          taskReturnYear,
          ebinNumber,
          1
        );

        console.log(result.data);

        if (result.data.status === 200) {
          showSuccessToast(result.data.message);
          setTimeout(() => {
            setPage(2);
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
    } else {
      console.log("validation failed");
    }
  };

  const nextPage = () => {
    setPage(2);
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

  //file open

  // const fetchFile = async (fileName: string) => {
  //   const response = await fetch(
  //     `http://10.27.1.83:3000/supplier/supplier/po/${fileName}`,
  //     {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${isRegCompelte === "1" ? token : regToken}`,
  //       },
  //     }
  //   );

  //   if (response.status === 200) {
  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(blob);
  //     window.open(url); // Open the file in a new tab
  //   } else {
  //     alert("Unauthorized or file not found");
  //   }
  // };
  //file open

  const [fileLoading, setFileLoading] = useState<boolean>(false);
  const [tradeLicensefileLoading, setTradeLicenseFileLoading] =
    useState<boolean>(false);
  const [taxReturnLicensefileLoading, setTaxReturnLicenseFileLoading] =
    useState<boolean>(false);
  const [etinFileLoading, setEtinFileLoading] = useState<boolean>(false);
  const [eBinFileLoading, setBinFileLoading] = useState<boolean>(false);

  const handleViewFile = (
    filePath: string,
    fileName: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const tokenSelection = isRegCompelte === "1" ? token : regToken;
    fetchFileService(filePath, fileName, tokenSelection!, setLoading);
  };

  return (
    <div className="  bg-whiteColor">
      <SuccessToast />
      <WarningModal
        isOpen={isWarningShowSubmit}
        action={profileUpdateSubmission}
        closeModal={closeModalSubmit}
        message="Do you want to submit ?"
        imgSrc="/images/warning.png"
      />
      {/* <button
        onClick={(e) => {
          e.preventDefault();
          fetchFile("PO_10231009955.pdf");
        }}
      >
        open file
      </button> */}
      {isLoading ? (
        <div className=" w-full flex justify-center items-center">
          <LogoLoading />
        </div>
      ) : (
        <>
          <div className=" flex flex-col item start space-y-8 w-full ">
            <div className=" w-full flex space-x-0 items-center justify-center">
              <div className=" bg-midGreen h-8 w-8 flex justify-center items-center rounded-full border-[2px] border-midGreen text-white font-mon font-medium">
                1
              </div>
              <div className=" w-48 h-[2px] bg-midGreen"></div>
              <div className=" bg-white h-8 w-8 flex justify-center items-center rounded-full border-[2px] border-graishColor text-graishColor font-mon font-medium">
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

            <PageTitle titleText={"Step-1"} />
            <div className=" flex flex-row w-full justify-between items-center">
              <div className=" flex flex-col items-start space-y-2">
                <div className="flex items-center space-x-1">
                  <InputLebel
                    titleText={"Trade License/ Export License number"}
                  />
                  <span className="text-red-500 font-bold">*</span>
                </div>

                <CommonInputField
                  type="text"
                  hint="Chamber of Commerce Number"
                  onChangeData={tradeOrExportNumberChange}
                  inputRef={registrationNumberRef}
                  disable={isDisable}
                />
                {documentError.tradeLicenseNumber && (
                  <ValidationError title={documentError.tradeLicenseNumber} />
                )}
              </div>
              <div className=" flex flex-col items-start space-y-2">
                <InputLebel titleText={"Tax Return Assessment Year"} />
                <CommonInputField
                  inputRef={taxReturnYearRef}
                  onChangeData={handleTaxAssementYearChange}
                  hint="YYYY-YYYY ex: 2022-2024"
                  type="text"
                  disable={isDisable}
                />
              </div>
            </div>
            <div className=" flex flex-row w-full justify-between items-center">
              <div className=" flex flex-col items-start space-y-2">
                <div className="flex items-center space-x-1">
                  <InputLebel
                    titleText={"Trade License/ Export License Start date"}
                  />
                  <span className="text-red-500 font-bold">*</span>
                </div>
                <DateRangePicker
                  onChange={handleStartDateChange}
                  width="w-96"
                  placeholder="DD/MM/YYYY"
                  value={startDate}
                  signle={true}
                  useRange={false}
                  disable={isDisable}
                />
                {documentError.startDate && (
                  <ValidationError title={documentError.startDate} />
                )}
                {/* <DateRangePicker onChange={handleStartDateChange} width='w-96' placeholder='DD/MM/YYYY' value={startDate} signle={true} useRange={false}  /> */}
              </div>
              <div className=" flex flex-col items-start space-y-2">
                <div className="flex items-center space-x-1">
                  <InputLebel
                    titleText={"Trade License/ Export License End date"}
                  />
                  <span className="text-red-500 font-bold">*</span>
                </div>
                {/* <ReusableDatePicker placeholder="DD-MM-YYYY" onChange={handleEndDateChange} /> */}
                {/* <DateRangePicker
                  onChange={handleEndDateChange}
                  width="w-96"
                  placeholder="DD/MM/YYYY"
                  value={}
                  signle={true}
                  useRange={false}
                  disable={isDisable}
                /> */}
                <DateRangePicker
                  onChange={handleStartDateChange2}
                  width="w-96"
                  placeholder="DD/MM/YYYY"
                  value={startDate2}
                  signle={true}
                  useRange={false}
                  disable={isDisable}
                />
                {documentError.endDate && (
                  <ValidationError title={documentError.endDate} />
                )}
              </div>
            </div>
            <div className=" flex flex-row w-full justify-between items-center">
              <div className=" flex flex-col items-start space-y-2">
                <InputLebel titleText={"E-TIN Number"} />
                <CommonInputField
                  type="text"
                  onChangeData={etinNumberChange}
                  hint="978656487"
                  inputRef={etinNumberRef}
                  disable={isDisable}
                />
              </div>
              <div className=" flex flex-col items-start space-y-2">
                <InputLebel titleText={"E-BIN Number"} />
                <CommonInputField
                  type="text"
                  onChangeData={ebinNumberChange}
                  hint="978656487"
                  inputRef={ebinNumberRef}
                  disable={isDisable}
                />
              </div>
            </div>
            <div className=" flex flex-row w-full justify-between items-start">
              <div className=" flex flex-col items-start space-y-2">
                <InputLebel titleText={"Trade License/ Export License"} />

                <FilePickerInput
                  onFileSelect={handleTradeLicense}
                  mimeType=".pdf, image/*"
                  initialFileName={tradeLicenseFileName!}
                  maxSize={5 * 1024 * 1024}
                  disable={isDisable}
                />

                {pageOneDetails?.trade_or_export_license_file_path_name !=
                  null &&
                pageOneDetails?.data.TRADE_OR_EXPORT_LICENSE_FILE_NAME !=
                  null &&
                pageOneDetails?.data.TRADE_OR_EXPORT_LICENSE_FILE_NAME !==
                  "" ? (
                  <div className=" flex items-center space-x-6">
                    {tradeLicensefileLoading ? (
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
                            pageOneDetails?.trade_or_export_license_file_path_name!,
                            pageOneDetails?.data
                              .TRADE_OR_EXPORT_LICENSE_FILE_NAME!,
                            setTradeLicenseFileLoading
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
                            pageOneDetails?.data
                              .TRADE_OR_EXPORT_LICENSE_FILE_NAME!,
                            "tradeLicense"
                          )
                        }
                        className=" py-2 px-2 rounded-md shadow-sm border-borderColor border-[0.5px]"
                      >
                        <DeleteIcon />
                      </button>
                    )}
                  </div>
                ) : // <button
                //   onClick={() => handleOpenModal(pageOneDetails?.data.TRADE_OR_EXPORT_LICENSE_FILE_NAME!, 'tradeLicense')}
                //   className=" py-2 w-full rounded-md shadow-sm border-borderColor border-[0.5px]"
                // >
                //   <DeleteIcon />
                // </button>

                null}
              </div>
              <div className=" flex flex-col items-start space-y-2">
                <InputLebel titleText={"Tax Return Acknowledgement Slip"} />

                <FilePickerInput
                  onFileSelect={handleTaxReturnSlip}
                  mimeType=".pdf, image/*"
                  initialFileName={taxReturnSlipFileName!}
                  maxSize={5 * 1024 * 1024}
                  disable={isDisable}
                  clearFile={clearSlip}
                />

                {pageOneDetails?.tax_rtn_ackn_slip_file_path_name != null &&
                pageOneDetails?.data.TAX_RTN_ACKN_SLIP_FILE_NAME != null &&
                pageOneDetails?.data.TAX_RTN_ACKN_SLIP_FILE_NAME !== "" ? (
                  <div className=" flex items-center space-x-6">
                    {taxReturnLicensefileLoading ? (
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
                            pageOneDetails?.tax_rtn_ackn_slip_file_path_name!,
                            pageOneDetails?.data.TAX_RTN_ACKN_SLIP_FILE_NAME!,
                            setTaxReturnLicenseFileLoading
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
                            pageOneDetails?.data.TAX_RTN_ACKN_SLIP_FILE_NAME!,
                            "acknowledgementSlip"
                          )
                        }
                        className=" py-2 px-2 rounded-md shadow-sm border-borderColor border-[0.5px]"
                      >
                        <DeleteIcon />
                      </button>
                    )}
                  </div>
                ) : // <button
                //   onClick={() => handleOpenModal(pageOneDetails?.data.TAX_RTN_ACKN_SLIP_FILE_NAME!, 'acknowledgementSlip')}
                //   className=" py-2 w-full  flex justify-center items-center rounded-md shadow-sm border-borderColor border-[0.5px]"
                // >
                //   <DeleteIcon />
                // </button>

                null}
              </div>
            </div>

            <div className=" flex flex-row w-full justify-between items-start">
              <div className=" flex flex-col items-start space-y-2">
                <InputLebel titleText={"E-TIN File"} />
                <FilePickerInput
                  onFileSelect={handleEtin}
                  mimeType=".pdf, image/*"
                  initialFileName={eTinFileName!}
                  maxSize={5 * 1024 * 1024}
                  disable={isDisable}
                  clearFile={etinClear}
                />
                {pageOneDetails?.etin_file_path_name != null &&
                pageOneDetails?.data.ETIN_FILE_NAME != null &&
                pageOneDetails?.data.ETIN_FILE_NAME !== "" ? (
                  <div className="flex items-center space-x-6 ">
                    {etinFileLoading ? (
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
                            pageOneDetails?.etin_file_path_name!,
                            pageOneDetails?.data.ETIN_FILE_NAME!,
                            setEtinFileLoading
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
                            pageOneDetails?.data.ETIN_FILE_NAME!,
                            "etinFile"
                          )
                        }
                        className=" py-2 px-2 rounded-md shadow-sm border-borderColor border-[0.5px]"
                      >
                        <DeleteIcon />
                      </button>
                    )}
                  </div>
                ) : // <button
                //   onClick={() => handleOpenModal(pageOneDetails?.data.ETIN_FILE_NAME!, 'etinFile')}
                //   className=" py-2 w-full  flex justify-center items-center rounded-md shadow-sm border-borderColor border-[0.5px]"
                // >
                //   <DeleteIcon />
                // </button>

                null}
              </div>

              <div className=" flex flex-col items-start space-y-2">
                <InputLebel titleText={"E-BIN File"} />
                <FilePickerInput
                  onFileSelect={handleEbin}
                  mimeType=".pdf, image/*"
                  initialFileName={eBinFileName!}
                  maxSize={5 * 1024 * 1024}
                  disable={isDisable}
                  clearFile={ebinClear}
                />
                {pageOneDetails?.ebin_file_path_name != null &&
                pageOneDetails?.data.EBIN_FILE_NAME != null &&
                pageOneDetails?.data.EBIN_FILE_NAME !== "" ? (
                  <div className=" flex space-x-6 items-center">
                    {eBinFileLoading ? (
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
                            pageOneDetails?.ebin_file_path_name!,
                            pageOneDetails?.data.EBIN_FILE_NAME!,
                            setBinFileLoading
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
                            pageOneDetails?.data.EBIN_FILE_NAME!,
                            "ebinFile"
                          )
                        }
                        className=" py-2 px-2 rounded-md shadow-sm border-borderColor border-[0.5px]"
                      >
                        <DeleteIcon />
                      </button>
                    )}
                  </div>
                ) : // <button
                //   onClick={() => handleOpenModal(pageOneDetails?.data.EBIN_FILE_NAME!, 'ebinFile')}
                //   className=" py-2 w-full  flex justify-center items-center rounded-md shadow-sm border-borderColor border-[0.5px]"
                // >
                //   <DeleteIcon />
                // </button>

                null}
              </div>
            </div>
            <div className=" mt-8"></div>
            <div className=" w-full flex flex-row space-x-4 justify-end ">
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
              {/* <CommonButton
                titleText={"Next"}
                onClick={nextPage}
                width="w-48"
              /> */}
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
            <div className=" mt-8"></div>
          </div>
        </>
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
