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
import PageTwoInterface from "../../../registration/interface/PageTwoInterface";
import fetchFileService from "../../../common_service/fetchFileService";
import CircularProgressIndicator from "../../../Loading_component/CircularProgressIndicator";

export default function PageTwoViewForApproval() {
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
      const result = await DocumentViewForApprovalService(
        token!,
        supplierId!,
        2
      );
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
          pageTwoDetails.data.INCORPORATION_NUMBER || "";
        setIncorporationNumber(pageTwoDetails.data.INCORPORATION_NUMBER!);
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

  const [memorandumOfAssociationFileName, setMemorandumOfAssociationFileName] =
    useState<string | null>(null);

  const [memorandumOfAssociationFile, setMemorandumOfAssociationFile] =
    useState<File | null>(null);

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

  const [articlesOfAssociationFileName, setArticlesOfAssociationFileName] =
    useState<string | null>(null);
  const [articlesOfAssociationFile, setArticlesOfAssociationFile] =
    useState<File | null>(null);

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
    //     setIsSubmitLoading(true);
    //    try{
    //     const result=await AddUpdatePageTwoService(token!,incorporationNumber,incorporationOfCertificateFile,memorandumOfAssociationFile,listOfAuthorizedSignatoriesFile,articlesOfAssociationFile,listiOfProminentClientsFile,2);
    //     if(result.data.status===200){
    //         setIsSubmitLoading(false);
    //         showSuccessToast(result.data.message);
    //         setTimeout(()=>{
    //             setPage(3);
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

  //navigate to previous page
  const previous = () => {
    setPage(1);
  };

  //navigate to next page
  const next = () => {
    setPage(3);
  };

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

    // const tokenSelection = isRegCompelte === "1" ? token : regToken;
    fetchFileService(filePath, fileName, token!, setLoading);
  };

  return (
    <div className="bg-whiteColor">
      <SuccessToast />
      <PageTitle titleText={"Step-2"} />
      <div className="h-2"></div>
      {isLoading ? (
        <div className=" w-full h-screen flex justify-center items-center">
          <LogoLoading />
        </div>
      ) : (
        <div className=" flex flex-col item start space-y-8 w-full ">
          {/* <InputLebel titleText={"Upload all the  required files. All file will be safe and secured by the admin."} /> */}

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
              />
              {pageTwoDetails?.incorporation_cirtificate_file_path_name !=
                null &&
              pageTwoDetails?.data.INCORPORATION_CIRTIFICATE_FILE_NAME !=
                null &&
              pageTwoDetails?.data.INCORPORATION_CIRTIFICATE_FILE_NAME !==
                "" ? (
                <div>
                  {certificationOfIncrpFileLoading ? (
                    <div className="w-96 flex justify-center items-center">
                      <CircularProgressIndicator />
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        handleViewFile(
                          pageTwoDetails?.incorporation_cirtificate_file_path_name!,
                          pageTwoDetails?.data
                            .INCORPORATION_CIRTIFICATE_FILE_NAME!,
                          setCertificationOfIncrpFileLoading
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
              //   href={`${pageTwoDetails?.incorporation_cirtificate_file_path_name!}/${
              //     pageTwoDetails?.data.INCORPORATION_CIRTIFICATE_FILE_NAME
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
          <div className=" flex flex-row w-full justify-between items-center">
            <div className=" flex flex-col items-start space-y-2">
              <InputLebel titleText={"Memorandum of Association"} />
              <FilePickerInput
                onFileSelect={handleMemorandumOfAssociation}
                initialFileName={memorandumOfAssociationFileName!}
                mimeType=".pdf, image/*"
                maxSize={5 * 1024 * 1024}
                disable={isDisable}
              />
              {pageTwoDetails?.memorandum_association_file_path_name != null &&
              pageTwoDetails?.data.MEMORANDUM_ASSOCIATION_FILE_NAME != null &&
              pageTwoDetails?.data.MEMORANDUM_ASSOCIATION_FILE_NAME !== "" ? (
                <div>
                  {memorandumFileLoading ? (
                    <div className="w-96 flex justify-center items-center">
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
                      className="w-96 dashedButton my-4"
                    >
                      {" "}
                      view
                    </button>
                  )}
                </div>
              ) : // <a
              //   href={`${pageTwoDetails?.memorandum_association_file_path_name!}/${
              //     pageTwoDetails?.data.MEMORANDUM_ASSOCIATION_FILE_NAME
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
              <InputLebel titleText={"List of Authorized Signatories"} />
              <FilePickerInput
                onFileSelect={handleListOfAuthorizedSignatories}
                initialFileName={listOfAuthorizedSignatoriesFileName!}
                mimeType=".pdf, image/*"
                maxSize={5 * 1024 * 1024}
                disable={isDisable}
              />
              {pageTwoDetails?.authorized_signs_file_path_name != null &&
              pageTwoDetails?.data.AUTHORIZED_SIGNS_FILE_NAME != null &&
              pageTwoDetails?.data.AUTHORIZED_SIGNS_FILE_NAME !== "" ? (
                <div>
                  {signatoriesFileLoading ? (
                    <div className="w-96 flex justify-center items-center">
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
                      className="w-96 dashedButton my-4"
                    >
                      {" "}
                      view
                    </button>
                  )}
                </div>
              ) : // <a
              //   href={`${pageTwoDetails?.authorized_signs_file_path_name!}/${
              //     pageTwoDetails?.data.AUTHORIZED_SIGNS_FILE_NAME
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
          <div className=" flex flex-row w-full justify-between items-center">
            <div className=" flex flex-col items-start space-y-2">
              <InputLebel titleText={"Articles of Association"} />
              <FilePickerInput
                onFileSelect={handleArticlesOfAssociation}
                initialFileName={articlesOfAssociationFileName!}
                mimeType=".pdf, image/*"
                maxSize={5 * 1024 * 1024}
                disable={isDisable}
              />
              {pageTwoDetails?.article_association_file_path_name != null &&
              pageTwoDetails?.data.ARTICLE_ASSOCIATION_FILE_NAME != null &&
              pageTwoDetails?.data.ARTICLE_ASSOCIATION_FILE_NAME !== "" ? (
                <div>
                  {articleOfAssociationFileLoading ? (
                    <div className="w-96 flex justify-center items-center">
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
                      className="w-96 dashedButton my-4"
                    >
                      {" "}
                      view
                    </button>
                  )}
                </div>
              ) : // <a
              //   href={`${pageTwoDetails?.article_association_file_path_name!}/${
              //     pageTwoDetails?.data.ARTICLE_ASSOCIATION_FILE_NAME
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
              <InputLebel titleText={"List of Prominent Clients"} />
              <FilePickerInput
                onFileSelect={handleListiOfProminentClientsFile}
                initialFileName={listiOfProminentClientsFileName!}
                mimeType=".pdf, image/*"
                maxSize={5 * 1024 * 1024}
                disable={isDisable}
              />
              {pageTwoDetails?.prominent_clients_file_path_name != null &&
              pageTwoDetails?.data.PROMINENT_CLIENTS_FILE_NAME != null &&
              pageTwoDetails?.data.PROMINENT_CLIENTS_FILE_NAME !== "" ? (
                <div>
                  {clientFileLoading ? (
                    <div className="w-96 flex justify-center items-center">
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
                      className="w-96 dashedButton my-4"
                    >
                      {" "}
                      view
                    </button>
                  )}
                </div>
              ) : // <a
              //   href={`${pageTwoDetails?.prominent_clients_file_path_name!}/${
              //     pageTwoDetails?.data.PROMINENT_CLIENTS_FILE_NAME
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

          <div className=" my-8"></div>
          <div className=" w-full flex flex-row justify-end space-x-8 items-center">
            <CommonButton
              titleText={"Previous"}
              color="bg-graishColor"
              onClick={previous}
              width="w-48"
            />

            <CommonButton titleText={"Next"} onClick={next} width="w-48" />
          </div>
        </div>
      )}
    </div>
  );
}
