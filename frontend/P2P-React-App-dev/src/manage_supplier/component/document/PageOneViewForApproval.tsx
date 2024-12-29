import React, { useState, useEffect, useRef } from "react";

import EditIcon from "../../../icons/EditIcon";
import PageTitle from "../../../common_component/PageTitle";
import CommonButton from "../../../common_component/CommonButton";
import SuccessToast, {
  showSuccessToast,
} from "../../../Alerts_Component/SuccessToast";
import ErrorToast, {
  showErrorToast,
} from "../../../Alerts_Component/ErrorToast";
import { isTokenValid } from "../../../utils/methods/TokenValidityCheck";
import { useAuth } from "../../../login_both/context/AuthContext";

import { useNavigate } from "react-router-dom";

import { useDocumentApprovalViewContext } from "../../interface/document/DocumentApprovalViewContext";
import moment from "moment";
import LogoLoading from "../../../Loading_component/LogoLoading";
import PageOneInterface from "../../../registration/interface/PageOneInterface";
import DocumentViewForApprovalService from "../../service/document/DocumentViewFroApprovalService";
import InputLebel from "../../../common_component/InputLebel";
import CommonInputField from "../../../common_component/CommonInputField";
import DateRangePicker from "../../../common_component/DateRangePicker";
import FilePickerInput from "../../../common_component/FilePickerInput";
import fetchFileService from "../../../common_service/fetchFileService";
import CircularProgressIndicator from "../../../Loading_component/CircularProgressIndicator";

export default function PageOneViewForApproval() {
  const registrationNumberRef = useRef<HTMLInputElement | null>(null);
  const etinNumberRef = useRef<HTMLInputElement | null>(null);
  const ebinNumberRef = useRef<HTMLInputElement | null>(null);
  const taxReturnYearRef = useRef<HTMLInputElement | null>(null);
  const [assesmentYear, setAssesmentYear] = useState({
    startDate: null,
    endDate: null, // Set the endDate to the end of the current year
  });
  const [startDate, setStartDate] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: new Date(new Date().getFullYear(), 11, 31), // Set the endDate to the end of the current year
  });

  const handleStartDateChange = (newValue: any) => {
    setStartDate(newValue);
    // Handle the selected date here
    setAddUpdateEndDate(moment(startDate.startDate).format("YYYY-MM-DD"));
  };

  const [addUpdateStartDate, setAddUpdateStartDate] = useState("");

  const [endDate, setEndDate] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: new Date(new Date().getFullYear(), 11, 31), // Set the endDate to the end of the current year
  });

  const [addUpdateEndDate, setAddUpdateEndDate] = useState("");

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

  const [tradeLicensefileLoading, setTradeLicenseFileLoading] =
    useState<boolean>(false);
  const [taxReturnLicensefileLoading, setTaxReturnLicenseFileLoading] =
    useState<boolean>(false);
  const [etinFileLoading, setEtinFileLoading] = useState<boolean>(false);
  const [eBinFileLoading, setBinFileLoading] = useState<boolean>(false);

  //loading

  const handleViewFile = (
    filePath: string,
    fileName: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    // const tokenSelection = isRegCompelte === "1" ? token : regToken;
    fetchFileService(filePath, fileName, token!, setLoading);
  };

  //context
  const { page, setPage } = useDocumentApprovalViewContext();
  //context
  //token
  const { token, submissionStatus, supplierId } = useAuth();
  //token

  const navigate = useNavigate();

  //first time get

  useEffect(() => {
    const isTokenExpired = !isTokenValid(token!);
    if (isTokenExpired) {
      localStorage.removeItem("token");
      showErrorToast("Please Login Again..");
      setTimeout(() => {
        navigate("/");
      }, 1200);
    } else {
      GetExistingDocument();
    }
  }, []);

  //get exsiting docuent

  //re-render for set data

  useEffect(() => {
    if (pageOneDetails) {
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
      const result = await DocumentViewForApprovalService(
        token!,
        supplierId!,
        1
      );
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
        taxReturnYearRef.current.value = data.TAX_RTN_ASSMNT_YEAR;
        setTaskReturnYear(data.TAX_RTN_ASSMNT_YEAR);
      }
      const currentYear = new Date().getFullYear();

      if (data?.TRADE_OR_EXPORT_LICENSE_START_DATE != null) {
        // const tradeOrExportLicenseStartDate = data?.TRADE_OR_EXPORT_LICENSE_START_DATE;

        // Check if tradeOrExportLicenseStartDate is not null before creating a new Date object
        const tradeOrExportLicenseStartDate =
          data?.TRADE_OR_EXPORT_LICENSE_START_DATE;

        // Check if tradeOrExportLicenseStartDate is not null before creating a new Date object
        const startDateValue = new Date(tradeOrExportLicenseStartDate!);

        // const endDateValue = new Date(currentYear, 11, 31); // Set the endDate to the end of the current year

        setStartDate({
          startDate: startDateValue,
          endDate: new Date(currentYear, 11, 31),
        });
        setAddUpdateStartDate(
          moment(data?.TRADE_OR_EXPORT_LICENSE_START_DATE).format("YYYY-MM-DD")
        );
      }

      //setiing for sendin to api

      //end date
      if (data?.TRADE_OR_EXPORT_LICENSE_END_DATE != null) {
        const tradeOrExportLicenseEndDate =
          data?.TRADE_OR_EXPORT_LICENSE_END_DATE;

        // Check if tradeOrExportLicenseStartDate is not null before creating a new Date object
        const endDateValue = new Date(tradeOrExportLicenseEndDate!);
        setEndDate({
          startDate: endDateValue,
          endDate: new Date(currentYear, 11, 31), // Set the endDate to the end of the current year
        });

        //setiing for sendin to api
        setAddUpdateEndDate(
          moment(data?.TRADE_OR_EXPORT_LICENSE_END_DATE).format("YYYY-MM-DD")
        );
      }

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

  const handleEndDateChange = (newValue: any) => {
    setEndDate(newValue);
    setAddUpdateEndDate(moment(endDate.startDate).format("YYYY-MM-DD"));
    // Handle the selected date here
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

  const handleTaxReturnSlip = (file: File | null) => {
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file);
      setTaxReturnSlipFile(file);
    } else {
      // No file selected
      console.log("No file selected");
    }
  };

  const [tradeLicenseFileName, setTradeLicenseFileName] = useState<
    string | null
  >(null);
  const [tradeLicenseFile, setTradeLicenseFile] = useState<File | null>(null);

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

  const [eTinFileName, setEtinFileName] = useState<string | null>(null);
  const [eTinFile, setEtinFile] = useState<File | null>(null);

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

  const [eBinFileName, setEbinFileName] = useState<string | null>(null);
  const [ebinFile, setEbinFile] = useState<File | null>(null);

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

  const submitAndNext = async () => {
    // setPage(2);
    //    setIsSubmitLoading(true);
    //    try{
    //     const result=await AddUpdatePageOneService(token!,tradeOrExportNumber,addUpdateStartDate,addUpdateEndDate,tradeLicenseFile,etinNumber,taxReturnSlipFile,ebinFile,eTinFile,taskReturnYear,ebinNumber,1);
    //     if(result.data.status===200){
    //         setIsSubmitLoading(false);
    //         showSuccessToast(result.data.message);
    //         setTimeout(()=>{
    //             setPage(2);
    //         },1200)
    //     }
    //     else{
    //         setIsSubmitLoading(false);
    //     }
    //    }
    //    catch(error){
    //     //handle error
    //     setIsSubmitLoading(false);
    //     showErrorToast("Something went wrong");
    //    }
  };

  const nextPage = () => {
    setPage(2);
  };
  return (
    <div className="  bg-whiteColor">
      <SuccessToast />
      <PageTitle titleText={"Step-1"} />
      <div className="h-2"></div>
      {isLoading ? (
        <div className=" w-full flex justify-center items-center">
          <LogoLoading />
        </div>
      ) : (
        <>
          <div className=" flex flex-col item start space-y-8 w-full ">
            {/* <InputLebel titleText={"Upload all the  required files. All file will be safe and secured by the admin."} /> */}

            <div className=" flex flex-row w-full justify-between items-center">
              <div className=" flex flex-col items-start space-y-2">
                <InputLebel
                  titleText={"Trade License/ Export License number"}
                />
                <CommonInputField
                  type="text"
                  hint="Chamber of Commerce Number"
                  onChangeData={tradeOrExportNumberChange}
                  inputRef={registrationNumberRef}
                  disable={isDisable}
                />
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
                <InputLebel
                  titleText={"Trade License/ Export License Start date"}
                />
                <DateRangePicker
                  onChange={handleStartDateChange}
                  width="w-96"
                  placeholder="DD/MM/YYYY"
                  value={startDate}
                  signle={true}
                  useRange={false}
                  disable={isDisable}
                />
                {/* <DateRangePicker onChange={handleStartDateChange} width='w-96' placeholder='DD/MM/YYYY' value={startDate} signle={true} useRange={false}  /> */}
              </div>
              <div className=" flex flex-col items-start space-y-2">
                <InputLebel
                  titleText={"Trade License/ Export License End date"}
                />
                {/* <ReusableDatePicker placeholder="DD-MM-YYYY" onChange={handleEndDateChange} /> */}
                <DateRangePicker
                  onChange={handleEndDateChange}
                  width="w-96"
                  placeholder="DD/MM/YYYY"
                  value={endDate}
                  signle={true}
                  useRange={false}
                  disable={isDisable}
                />
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
                  <div>
                    {tradeLicensefileLoading ? (
                      <div className="w-96 flex justify-center items-center">
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
                        className="w-96 dashedButton my-4"
                      >
                        {" "}
                        view
                      </button>
                    )}
                  </div>
                ) : // <a
                //   href={`${pageOneDetails?.trade_or_export_license_file_path_name!}/${
                //     pageOneDetails?.data.TRADE_OR_EXPORT_LICENSE_FILE_NAME
                //   }`}
                //   target="blank"
                //   className=" w-96 dashedButton my-4 "
                // >
                //   {" "}
                //   view
                // </a>
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
                />
                {pageOneDetails?.tax_rtn_ackn_slip_file_path_name != null &&
                pageOneDetails?.data.TAX_RTN_ACKN_SLIP_FILE_NAME != null &&
                pageOneDetails?.data.TAX_RTN_ACKN_SLIP_FILE_NAME !== "" ? (
                  <div>
                    {taxReturnLicensefileLoading ? (
                      <div className="w-96 flex justify-center items-center">
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
                        className="w-96 dashedButton my-4"
                      >
                        {" "}
                        view
                      </button>
                    )}
                  </div>
                ) : // <a
                //   href={`${pageOneDetails?.tax_rtn_ackn_slip_file_path_name!}/${
                //     pageOneDetails?.data.TAX_RTN_ACKN_SLIP_FILE_NAME
                //   }`}
                //   target="blank"
                //   className=" w-96 dashedButton my-4 "
                // >
                //   {" "}
                //   view
                // </a>
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
                />
                {pageOneDetails?.etin_file_path_name != null &&
                pageOneDetails?.data.ETIN_FILE_NAME != null &&
                pageOneDetails?.data.ETIN_FILE_NAME !== "" ? (
                  <div>
                    {etinFileLoading ? (
                      <div className="w-96 flex justify-center items-center">
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
                        className="w-96 dashedButton my-4"
                      >
                        {" "}
                        view
                      </button>
                    )}
                  </div>
                ) : // <a
                //   href={`${pageOneDetails?.etin_file_path_name!}/${
                //     pageOneDetails?.data.ETIN_FILE_NAME
                //   }`}
                //   target="blank"
                //   className=" w-96 dashedButton my-4 "
                // >
                //   {" "}
                //   view
                // </a>
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
                />
                {pageOneDetails?.ebin_file_path_name != null &&
                pageOneDetails?.data.EBIN_FILE_NAME != null &&
                pageOneDetails?.data.EBIN_FILE_NAME !== "" ? (
                  <div>
                    {eBinFileLoading ? (
                      <div className="w-96 flex justify-center items-center">
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
                        className="w-96 dashedButton my-4"
                      >
                        {" "}
                        view
                      </button>
                    )}
                  </div>
                ) : // <a
                //   href={`${pageOneDetails?.ebin_file_path_name!}/${
                //     pageOneDetails?.data.EBIN_FILE_NAME
                //   }`}
                //   target="blank"
                //   className=" w-96 dashedButton my-4 "
                // >
                //   {" "}
                //   view
                // </a>
                null}
              </div>
            </div>
            <div className=" mt-8"></div>
            <div className=" w-full flex flex-row space-x-4 justify-end ">
              {/* {
                                isSubmitLoading
                                ?
                                <div className=' w-48 flex justify-center items-center'>
                                    <CircularProgressIndicator/>
                                </div>

                                :
                               
                               <CommonButton titleText={"Save & Continue"} onClick={submitAndNext} width='w-48' color='bg-midGreen' disable={isDisable} />} */}
              <CommonButton
                titleText={"Next"}
                onClick={nextPage}
                width="w-48"
              />
            </div>
            <div className=" mt-8"></div>
          </div>
        </>
      )}
    </div>
  );
}
