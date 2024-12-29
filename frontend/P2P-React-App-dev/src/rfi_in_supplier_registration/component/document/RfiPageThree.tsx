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

import { useRfiDocumentApprovalViewContext } from "../../context/RfiDocumentPageContext";
import moment from "moment";
import LogoLoading from "../../../Loading_component/LogoLoading";
import PageOneInterface from "../../../registration/interface/PageOneInterface";

import DocumentViewForApprovalService from "../../../manage_supplier/service/document/DocumentViewFroApprovalService";
import InputLebel from "../../../common_component/InputLebel";
import CommonInputField from "../../../common_component/CommonInputField";
import DateRangePicker from "../../../common_component/DateRangePicker";
import FilePickerInput from "../../../common_component/FilePickerInput";
import PageTwoInterface from "../../../registration/interface/PageTwoInterface";
import PageThreeInterface from "../../../registration/interface/PageThreeInterface";
export default function RfiPageThree() {
  const [pageThreeDetails, setPageThreeDetails] =
    useState<PageThreeInterface | null>(null);

  //loading
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  //loading

  const { page, setPage } = useRfiDocumentApprovalViewContext();

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
      const result = await DocumentViewForApprovalService(
        token!,
        supplierId!,
        3
      );
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
    // setIsSubmitLoading(true);
    // try{
    //  const result=await AddUpdatePageThreeService(token!,goodsOrServiceFile,solvencyOrBankCertificateFile,excellencyOrSepcializationCertificateFile,recommendationOrPerformanceCertificateFile,companyProfileFile,qualityCertificateFile,annualTurnoverFile,3);
    //  if(result.data.status===200){
    //      setIsSubmitLoading(false);
    //      showSuccessToast(result.data.message);
    //      setTimeout(()=>{
    //          setPage(4);
    //      },1200)
    //  }
    //  else{
    //      setIsSubmitLoading(false);
    //  }
    // }
    // catch(error){
    //  //handle error
    //  setIsSubmitLoading(false);
    //  showErrorToast("Something went wrong");
    // }
  };
  const previous = () => {
    setPage(2);
  };
  const next = () => {
    setPage(4);
  };
  return (
    <div className=" bg-whiteColor">
      <SuccessToast />
      <PageTitle titleText={"Step-3"} />
      <div className="h-2"></div>
      {isLoading ? (
        <div className=" w-full flex h-screen justify-center items-center">
          <LogoLoading />
        </div>
      ) : (
        <div className=" flex flex-col item start space-y-8 w-full ">
          {/* <InputLebel titleText={"Upload all the  required files. All file will be safe and secured by the admin."} /> */}

          <div className=" flex flex-row w-full justify-between items-center">
            <div className=" flex flex-col items-start space-y-2">
              <InputLebel titleText={"List of Available Goods / Services"} />
              <FilePickerInput
                onFileSelect={handleGoodsOrServices}
                initialFileName={goodsOrServiceFileName!}
                mimeType=".pdf, image/*"
                maxSize={5 * 1024 * 1024}
                disable={isDisable}
              />
              {pageThreeDetails?.goods_list_file_path_name != null &&
              pageThreeDetails?.data.GOODS_LIST_FILE_NAME != null ? (
                <a
                  href={`${pageThreeDetails?.goods_list_file_path_name!}/${
                    pageThreeDetails?.data.GOODS_LIST_FILE_NAME
                  }`}
                  target="blank"
                  className=" w-96 dashedButton my-4 "
                >
                  {" "}
                  view
                </a>
              ) : null}
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
                .COMPANY_BANK_SOLVENCY_CIRTIFICATE_FILE_NAME != null ? (
                <a
                  href={`${pageThreeDetails?.company_bank_solvency_cirtificate_file_path_name!}/${
                    pageThreeDetails?.data
                      .COMPANY_BANK_SOLVENCY_CIRTIFICATE_FILE_NAME
                  }`}
                  target="blank"
                  className=" w-96 dashedButton my-4 "
                >
                  {" "}
                  view
                </a>
              ) : null}
            </div>
          </div>
          <div className=" flex flex-row w-full justify-between items-center">
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
                .EXCELLENCY_SPECIALIED_CIRTIFICATE_FILE_NAME != null ? (
                <a
                  href={`${pageThreeDetails?.excellency_specialied_cirtificate_file_path_name!}/${
                    pageThreeDetails?.data
                      .EXCELLENCY_SPECIALIED_CIRTIFICATE_FILE_NAME
                  }`}
                  target="blank"
                  className=" w-96 dashedButton my-4 "
                >
                  {" "}
                  view
                </a>
              ) : null}
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
                null ? (
                <a
                  href={`${pageThreeDetails?.recommendation_cirtificate_file_path_name!}/${
                    pageThreeDetails?.data.RECOMMENDATION_CIRTIFICATE_FILE_NAME
                  }`}
                  target="blank"
                  className=" w-96 dashedButton my-4 "
                >
                  {" "}
                  view
                </a>
              ) : null}
            </div>
          </div>
          <div className=" flex flex-row w-full justify-between items-center">
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
              pageThreeDetails?.data.COMPANY_PROFILE_FILE_NAME != null ? (
                <a
                  href={`${pageThreeDetails?.company_profile_file_path_name!}/${
                    pageThreeDetails?.data.COMPANY_PROFILE_FILE_NAME
                  }`}
                  target="blank"
                  className=" w-96 dashedButton my-4 "
                >
                  {" "}
                  view
                </a>
              ) : null}
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
              pageThreeDetails?.data.QA_CIRTIFICATE_FILE_NAME != null ? (
                <a
                  href={`${pageThreeDetails?.qa_cirtificate_file_path_name!}/${
                    pageThreeDetails?.data.QA_CIRTIFICATE_FILE_NAME
                  }`}
                  target="blank"
                  className=" w-96 dashedButton my-4 "
                >
                  {" "}
                  view
                </a>
              ) : null}
            </div>
          </div>
          <div className=" flex flex-row w-full justify-between items-center">
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
              pageThreeDetails?.data.ANNUAL_TURNOVER_FILE_NAME != null ? (
                <a
                  href={`${pageThreeDetails?.annual_turnover_file_path_name!}/${
                    pageThreeDetails?.data.ANNUAL_TURNOVER_FILE_NAME
                  }`}
                  target="blank"
                  className=" w-96 dashedButton my-4 "
                >
                  {" "}
                  view
                </a>
              ) : null}
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
            {/* { 
           isSubmitLoading
           ?
           <div className=' w-48 flex justify-center items-center'>
            <CircularProgressIndicator/>
           </div>
           :
           <CommonButton titleText={"Save & Continue"} onClick={submitAndNext} width='w-48' color='bg-midGreen' disable={isDisable} />} */}
            <CommonButton titleText={"Next"} onClick={next} width="w-48" />
          </div>
        </div>
      )}
    </div>
  );
}
