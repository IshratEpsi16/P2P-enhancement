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
import PageFourInterface from "../../../registration/interface/PageFourInterface";

export default function RfiPageFour() {
  const { page, setPage } = useRfiDocumentApprovalViewContext();
  // const [imagePreview, setImagePreview] = useState<string | null>(null);
  // const [imagePreview2, setImagePreview2] = useState<string | null>(null);

  const [pageFourDetails, setPageFourDetails] =
    useState<PageFourInterface | null>(null);

  //loading
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  //loading

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
      const result = await DocumentViewForApprovalService(
        token!,
        supplierId!,
        4
      );
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
    useState<string | null>("" || null);
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
  >("" || null);

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
  >("" || null);
  const [photographOneFile, setPhotographOneFile] = useState<File | null>(null);

  const handlePhotographOne = (file: File | null) => {
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file);
      setPhotographOneFile(file);

      // Read the selected file and create a URL for preview
      // const reader = new FileReader();
      // reader.onloadend = () => {
      //     const previewUrl = reader.result as string;
      //     setImagePreview(previewUrl);
      // };
      // reader.readAsDataURL(file);
    } else {
      // No file selected
      console.log("No file selected");
      // setImagePreview(null);
    }
  };

  const [photographTwoFileName, setPhotographTwoFileName] = useState<
    string | null
  >("" || null);
  const [photographTwoFile, setPhotographTwoFile] = useState<File | null>(null);

  const handlePhotographTwo = (file: File | null) => {
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file);
      setPhotographTwoFile(file);
      // Read the selected file and create a URL for preview
      // const reader = new FileReader();
      // reader.onloadend = () => {
      //     const previewUrl = reader.result as string;
      //     setImagePreview2(previewUrl);
      // };
      // reader.readAsDataURL(file);
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
    // if(validate()){
    //     setIsSubmitLoading(true);
    // try{
    //  const result=await AddUpdatePageFourService(token!,machineriesManpowerFile,businessPremisesFile,photographOneFile,photographTwoFile,4);
    //  if(result.data.status===200){
    //      setIsSubmitLoading(false);
    //      showSuccessToast(result.data.message);
    //      setTimeout(()=>{
    //         GetExistingDocument();
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
    // }
    // else{
    //     console.log('validation failed');
    // }
  };
  const previous = () => {
    setPage(3);
  };
  return (
    <div className=" bg-whiteColor">
      <SuccessToast />
      <PageTitle titleText={"Step-4 "} />
      <div className="h-2"></div>
      {isLoading ? (
        <div className=" flex justify-center items-center w-full  h-screen">
          <LogoLoading />
        </div>
      ) : (
        <div className=" flex flex-col item-start space-y-8 w-full ">
          <InputLebel
            titleText={
              "Upload all the  required files. All file will be safe and secured by the admin."
            }
          />

          <div className=" flex flex-row w-full justify-between items-start ">
            <div className=" flex-1 flex flex-col items-start space-y-2">
              {/* <InputLebel titleText={"List of Machineries, Manpower, Competencies"} /> */}
              <FilePickerInput
                onFileSelect={handleMachineriesManpower}
                initialFileName={machineriesManpowerFileName!}
                mimeType=".pdf, image/*"
                maxSize={5 * 1024 * 1024}
                disable={isDisable}
              />
              {pageFourDetails?.machine_manpower_list_file_path_name != null &&
              pageFourDetails?.data.MACHINE_MANPOWER_LIST_FILE_NAME != null ? (
                <a
                  href={`${pageFourDetails?.machine_manpower_list_file_path_name!}/${
                    pageFourDetails?.data.MACHINE_MANPOWER_LIST_FILE_NAME
                  }`}
                  target="blank"
                  className=" w-96 dashedButton my-4 "
                >
                  {" "}
                  view
                </a>
              ) : null}
            </div>
            <div className=" w-36"></div>
            <div className="flex-1 flex flex-col items-start space-y-2  ">
              <InputLebel
                titleText={"Business Premises (rented / owned, with address)"}
              />
              <FilePickerInput
                onFileSelect={handleBusinessPremises}
                mimeType=".pdf, image/*"
                initialFileName={businessPremisesFileName!}
                maxSize={5 * 1024 * 1024}
                disable={isDisable}
              />
              {pageFourDetails?.business_premises_file_path_name != null &&
              pageFourDetails?.data.BUSINESS_PREMISES_FILE_NAME != null ? (
                <a
                  href={`${pageFourDetails?.business_premises_file_path_name!}/${
                    pageFourDetails?.data.BUSINESS_PREMISES_FILE_NAME
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
          <div className=" flex flex-row w-full justify-between items-start ">
            <div className="flex-1 flex flex-col items-start space-y-2 ">
              <InputLebel titleText={"Photograph of Owner-1"} />
              <FilePickerInput
                onFileSelect={handlePhotographOne}
                mimeType=".pdf, image/*"
                initialFileName={photographOneFileName!}
                maxSize={5 * 1024 * 1024}
                disable={isDisable}
              />

              {/* {imagePreview && <img src={imagePreview} alt="Preview" className=' mt-2 w-48 h-52 rounded-md p-2 border-2 border-borderColor shadow-md' />} */}

              {pageFourDetails?.profile_pic1_file_path_name != null &&
              pageFourDetails?.data.PROFILE_PIC1_FILE_NAME != null ? (
                <a
                  href={`${pageFourDetails?.profile_pic1_file_path_name!}/${
                    pageFourDetails?.data.PROFILE_PIC1_FILE_NAME
                  }`}
                  target="blank"
                  className=" w-96 dashedButton my-4 "
                >
                  {" "}
                  view
                </a>
              ) : null}
            </div>
            <div className=" w-36"></div>
            <div className="flex-1 flex flex-col items-start space-y-2 ">
              <InputLebel titleText={"Photograph of Owner-2"} />
              <FilePickerInput
                onFileSelect={handlePhotographTwo}
                mimeType=".pdf, image/*"
                initialFileName={photographTwoFileName!}
                maxSize={5 * 1024 * 1024}
                disable={isDisable}
              />
              {/* {imagePreview2 && <img src={imagePreview2} alt="Preview" className=' mt-2 w-48 h-52 rounded-md p-2 border-2 border-borderColor shadow-md' />} */}
              {pageFourDetails?.profile_pic2_file_path_name != null &&
              pageFourDetails?.data.PROFILE_PIC2_FILE_NAME != null ? (
                <a
                  href={`${pageFourDetails?.profile_pic2_file_path_name!}/${
                    pageFourDetails?.data.PROFILE_PIC2_FILE_NAME
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
              titleText={"previous"}
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
       <CommonButton titleText={"Save & Continue"} onClick={submitAndNext} width='w-48' color='bg-midGreen' disable={isDisable}/>} */}
          </div>
        </div>
      )}
    </div>
  );
}
