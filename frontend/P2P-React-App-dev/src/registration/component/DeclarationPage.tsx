import React, { useState, useRef, useEffect } from "react";
import FilePickerInput from "../../common_component/FilePickerInput";
import CommonButton from "../../common_component/CommonButton";
import CommonInputField from "../../common_component/CommonInputField";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import { useAuth } from "../../login_both/context/AuthContext";

import { SupplierDeclarationInterface } from "../interface/RegistrationInterface";

import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";

import ErrorToast, { showErrorToast } from "../../Alerts_Component/ErrorToast";
import ExistingDeclarationService from "../service/declaration/ExistingDeclarationService";
import LogoLoading from "../../Loading_component/LogoLoading";

import AddUpdateDeclarationService from "../service/declaration/AddUpdateDeclarationService";
import ValidationError from "../../Alerts_Component/ValidationError";
import { isTokenValid } from "../../utils/methods/TokenValidityCheck";

import { useNavigate } from "react-router-dom";
import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";
import CheckIcon from "../../icons/CheckIcon";
import ProfileUpdateSubmissionService from "../service/profile_update_submission/ProfileUpdateSubmissionService";
import WarningModal from "../../common_component/WarningModal";
import DeleteIcon from "../../icons/DeleteIcon";
import DocumentFileRemoveService from "../service/declaration/DocumentFileRemoveService";
import WarningIcon from "../../icons/WarningIcon";
import fetchFileService from "../../common_service/fetchFileService";

export default function DeclarationPage() {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const [isAgree, setIsAgree] = useState(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [declarationInfo, setDeclarationInfo] =
    useState<SupplierDeclarationInterface | null>(null);

  const navigate = useNavigate();

  //token and submission status
  const {
    regToken,
    submissionStatus,
    isRegCompelte,
    token,
    setSubmissionStatus,
  } = useAuth();
  //token and submission status

  //name

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

  //set disable

  //show signature

  const [signatureFileName, setSignatureFileName] = useState<string | null>(
    "" || null
  );

  //show signature

  //show seal
  const [sealFileName, setSealFileName] = useState<string | null>("" || null);
  //show seal

  //get exisiting data api call

  const getExistingDeclaration = async () => {
    setIsLoading(true);
    try {
      const result = await ExistingDeclarationService(regToken!);
      if (result.data.status === 200) {
        setDeclarationInfo(result.data);
        setIsLoading(false);
      } else {
        showErrorToast(result.data.message);
        setIsLoading(false);
      }
    } catch (error) {
      //handle error
      setIsLoading(false);
    }
  };

  //get exisiting data api call

  // re-render based on basic info change to show setted data on field
  useEffect(() => {
    if (declarationInfo) {
      setData();
    }
  }, [declarationInfo]);

  //token validation
  useEffect(() => {
    const isTokenExpired = !isTokenValid(regToken!);
    if (isTokenExpired) {
      localStorage.removeItem("regToken");
      showErrorToast("Please Login Again..");
      setTimeout(() => {
        navigate("/");
      }, 3200);
    } else {
      getExistingDeclaration();
    }
  }, []);
  //token validation

  // method to set data after grtting from api
  // test korte hobe jodi first time data na thake

  const setData = () => {
    if (declarationInfo && nameRef.current) {
      nameRef.current.value = declarationInfo.data.SIGNATORY_NAME;
      setName(declarationInfo.data.SIGNATORY_NAME);
      setAuthorityType(declarationInfo.data.AUTHOR_TYPE);
      setIsAgree(declarationInfo.data.IS_AGREED === 1 ? true : false);
      if (declarationInfo.data.SIGNATURE_FILE_ORIGINAL_NAME != null) {
        setSignatureFileName(declarationInfo.data.SIGNATURE_FILE_ORIGINAL_NAME);
      }
      if (declarationInfo.data.COMPANY_SEAL_FILE_ORIGINAL_NAME != null) {
        setSealFileName(declarationInfo.data.COMPANY_SEAL_FILE_ORIGINAL_NAME);
      }
    }
  };

  //authority type

  const [authorityType, setAuthorityType] = useState<string | null>("" || null);

  const handleAuthorityChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAuthorityType(event.target.value);
  };

  //authority type
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [sealFile, setSealFile] = useState<File | null>(null);
  const [signatureClear, setSignatureClear] = useState<boolean>(false);
  const [sealClear, setSealClear] = useState<boolean>(false);

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
        case "companySeal":
          await removeCompanySeal(fileToRemove);
          break;

        case "signatureSeal":
          await removeSignatureSeal(fileToRemove);
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

  // const removeSignatureFile = () => {
  //   setSignatureClear(true);
  //   setSignatureFile(null);
  //   setSignatureFileName(null);
  //   setImagePreview2(null);
  //   if (declarationInfo!.data.SIGNATURE_FILE_ORIGINAL_NAME != null) {
  //     setSignatureFileName(null);
  //   }
  // };

  const removeCompanySeal = async (removeFileName: string) => {
    // setIsOpenFileRemoveModal(true);

    setIsLoading(true);
    console.log("fileName function: ", removeFileName);

    const result = await DocumentFileRemoveService(
      regToken!,
      "xxp2p_registration_declaration",
      "COMPANY_SEAL_FILE_NAME",
      "COMPANY_SEAL_FILE_ORIGINAL_NAME",
      removeFileName,
      "companySeal"
    );

    // if (result.data.status === 200) {
    //   setSealFileName(null);
    //   showSuccessToast(result.data.message);
    // } else {
    //   showErrorToast(result.data.message);
    // }

    if (result.data.status === 200) {
      setSealFileName(null);
      setDeclarationInfo((prevDetails) => {
        if (!prevDetails) return prevDetails;

        const updatedDetails = {
          ...prevDetails,
          supplier_company_seal_file_path: "",
          data: {
            ...prevDetails.data,
            COMPANY_SEAL_FILE_NAME: null,
            COMPANY_SEAL_FILE_ORIGINAL_NAME: null,
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

  // const removeSealFile = () => {
  //   setSealClear(true);
  //   setSealFile(null);
  //   setSealFileName(null);
  //   setImagePreview(null);
  //   if (declarationInfo!.data.COMPANY_SEAL_FILE_ORIGINAL_NAME != null) {
  //     setSealFileName(null);
  //   }
  // };

  const removeSignatureSeal = async (removeFileName: string) => {
    // setIsOpenFileRemoveModal(true);

    setIsLoading(true);
    console.log("fileName function: ", removeFileName);

    const result = await DocumentFileRemoveService(
      regToken!,
      "xxp2p_registration_declaration",
      "SIGNATURE_FILE_NAME",
      "SIGNATURE_FILE_ORIGINAL_NAME",
      removeFileName,
      "signatureFile"
    );

    // if (result.data.status === 200) {
    //   setSignatureFileName(null);
    //   showSuccessToast(result.data.message);
    // } else {
    //   showErrorToast(result.data.message);
    // }

    if (result.data.status === 200) {
      setSignatureFileName(null);
      setDeclarationInfo((prevDetails) => {
        if (!prevDetails) return prevDetails;

        const updatedDetails = {
          ...prevDetails,
          supplier_signature_file_path: "",
          data: {
            ...prevDetails.data,
            SIGNATURE_FILE_NAME: null,
            SIGNATURE_FILE_ORIGINAL_NAME: null,
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

  const handleSignature = (file: File | null) => {
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file);
      setSignatureFile(file);
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
    }
  };

  const handleSeal = (file: File | null) => {
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file);
      setSealFile(file);
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
    }
  };

  //name
  const [name, setName] = useState<string>("");
  const handleNameChange = (name: string) => {
    setName(name);
  };

  //name

  //validation

  const [declarationError, setDeclarationError] = useState<{
    name?: string;
    authorityType?: string;
    isAgree?: string;
    signatureFile?: string;
    sealFile?: string;
    signatory?: string;
  }>({});

  const validate = () => {
    const erros: {
      name?: string;
      authorityType?: string;
      isAgree?: string;
      signatureFile?: string;
      sealFile?: string;
      signatory?: string;
    } = {};
    // if (!name.trim()) {
    //   erros.name = "Please Enter Name.";
    // }
    if (authorityType === "" || authorityType === null) {
      erros.authorityType = "Please Select Ownership.";
    }
    if (isAgree === false) {
      erros.isAgree = "Agree to continue registration.";
    }
    if (!name.trim()) {
      erros.signatory = "Please Enter Name of Signatory";
    }
    // if (
    //   (signatureFileName === null || signatureFileName === "") &&
    //   signatureFile === null
    // ) {
    //   erros.signatureFile = "Please Select Signature File.";
    // }
    // if ((sealFileName === null || sealFileName === "") && sealFile === null) {
    //   erros.sealFile = "Please Select Seal File.";
    // }

    setDeclarationError(erros);

    return Object.keys(erros).length === 0;
  };

  //validation

  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

  const submit = async () => {
    if (validate()) {
      setIsSubmitLoading(true);
      try {
        const result = await AddUpdateDeclarationService(
          regToken!,
          authorityType!,
          name,
          isAgree ? "1" : "0",
          signatureFile,
          sealFile
        );
        console.log(result);

        if (result.data.success === true) {
          showSuccessToast(result.data.message);
          getExistingDeclaration();
          if (isRegCompelte !== "1") {
            setTimeout(() => {
              navigate(`/register/4`);
              setIsSubmitLoading(false);
            }, 3200);
          }
        } else {
          setIsSubmitLoading(false);
          showErrorToast(result.data.message);
        }
      } catch (error) {
        //handleError
        setIsSubmitLoading(false);
        showErrorToast("Something went wrong, try again.");
      }
    }
  };

  //image preview
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imagePreview2, setImagePreview2] = useState<string | null>(null);

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

  const [signatureFileLoading, setSignatureFileLoading] =
    useState<boolean>(false);
  const [sealFileLoading, setSealFileLoading] = useState<boolean>(false);

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
        <div className=" flex w-full h-screen items-center justify-center">
          <LogoLoading />
        </div>
      ) : (
        <div className=" w-full  flex flex-col items-start">
          <h3 className=" font-bold text-lg text-hintColor font-mon">
            Declaration
          </h3>
          <p className=" mt-4  text-sm font-medium text-hintColor font-mon">
            We hereby certify that all of the information stated herein, and the
            documents furnished are true, correct and complete. Further, we
            acknowledge that the relationship between us and SSGIL in connection
            with selling of our products/services to SCBL will be governed by
            the purchase contract(s) to be entered into between the parties.
          </p>
          <p className=" mt-4 text-sm font-medium text-hintColor mb-4 font-mon">
            We hereby confirm that our company is owned by following persons and
            not related directly/ indirectly by any Director or staff members of
            your company.
          </p>
          {/* <p className=' mt-8 mb-2 font-medium text-hintColor text-sm'>Owner/Partner/ Director</p> */}

          <FormControl>
            {/* <FormLabel>Gender</FormLabel> */}
            <RadioGroup
              defaultValue="Owner"
              name="controlled-radio-buttons-group"
              value={authorityType}
              onChange={handleAuthorityChange}
              sx={{ my: 1 }}
            >
              <div className=" flex flex-row space-x-4">
                <Radio disabled={isDisable} value="1" label="Owner" />
                <Radio disabled={isDisable} value="2" label="Partner" />
                <Radio disabled={isDisable} value="3" label="Authority" />
              </div>
            </RadioGroup>
          </FormControl>
          {declarationError.authorityType && (
            <ValidationError title={declarationError.authorityType} />
          )}

          <div className="w-full flex flex-row justify-between mt-4 ">
            <div className=" flex flex-col items-start">
              <p className="mb-2 font-medium text-hintColor text-[16px] font-mon">
                Signature with Date & Seal
              </p>
              <FilePickerInput
                mimeType=" image/*"
                width="w-96"
                onFileSelect={handleSignature}
                initialFileName={signatureFileName!}
                maxSize={5 * 1024 * 1024}
                disable={isDisable}
                clearFile={sealClear}
              />
              {declarationError.signatureFile && (
                <ValidationError title={declarationError.signatureFile} />
              )}
              <div className=" w-full flex  items-start space-x-4">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className=" mt-2 w-44 h-24 rounded-md p-2 border-2 border-midGreen shadow-md"
                  />
                )}
                {/* {declarationInfo?.supplier_signature_file_path != null &&
                  declarationInfo.data.SIGNATURE_FILE_NAME != null && (
                    <img
                      src={`${declarationInfo?.supplier_signature_file_path!}/${declarationInfo
                        ?.data.SIGNATURE_FILE_NAME!}`}
                      alt="Preview"
                      className={`mt-2 w-44 h-24 rounded-md p-2 border-2 ${
                        imagePreview ? "border-red-500" : "border-borderColor"
                      }  shadow-md`}
                    />
                  )} */}
              </div>

              <div className="h-2"></div>

              {declarationInfo?.supplier_signature_file_path != null &&
              declarationInfo.data.SIGNATURE_FILE_NAME != null ? (
                <div className=" flex items-center space-x-6">
                  {signatureFileLoading ? (
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
                          declarationInfo?.supplier_signature_file_path!,
                          declarationInfo?.data.SIGNATURE_FILE_NAME!,
                          setSignatureFileLoading
                        );
                      }}
                      className={`${
                        isRegCompelte === "1" ? "w-96" : "w-80"
                      }  dashedButton my-4 `}
                    >
                      {" "}
                      view signature
                    </button>
                  )}
                  {isRegCompelte === "1" ? null : (
                    <button
                      onClick={() =>
                        handleOpenModal(
                          declarationInfo?.data.SIGNATURE_FILE_NAME!,
                          "signatureSeal"
                        )
                      }
                      className=" py-2 px-2 rounded-md shadow-sm border-borderColor border-[0.5px]"
                    >
                      <DeleteIcon />
                    </button>
                  )}
                </div>
              ) : // <button
              //   onClick={() => handleOpenModal(declarationInfo?.data.SIGNATURE_FILE_NAME!, 'signatureSeal')}
              //   className=" py-2 w-full  flex justify-center items-center rounded-md shadow-sm border-borderColor border-[0.5px]"
              // >
              //   <DeleteIcon />
              // </button>

              null}
              <p className="mb-2 mt-6 font-medium text-hintColor text-[16px] font-mon  ">
                Name of Signatory <span className=" text-red-500">*</span>
              </p>
              <CommonInputField
                inputRef={nameRef}
                onChangeData={handleNameChange}
                hint="ex: Mohsin Khan"
                type="text"
                disable={isDisable}
              />
              {declarationError.signatory && (
                <ValidationError title={declarationError.signatory} />
              )}
              <div className=" mt-8 flex flex-row space-x-4 items-center">
                <button
                  disabled={isDisable}
                  onClick={() => {
                    setIsAgree(!isAgree);
                  }}
                  className={`w-5 h-5 ${
                    isAgree
                      ? "bg-[#00A76F] "
                      : "bg-whiteColor border-[0.5px] border-hintColor"
                  } rounded-[4px] shadow-sm flex justify-center items-center `}
                >
                  <div className=" w-4 h-4  flex justify-center items-centerm">
                    <CheckIcon className=" w-full h-full text-whiteColor" />
                  </div>
                </button>
                <p className=" mt-[2px] font-semibold text-sm font-mon text-hintColor">
                  I agree with all the terms & conditions.
                </p>
              </div>
              {declarationError.isAgree && (
                <ValidationError title={declarationError.isAgree} />
              )}
            </div>
            <div className=" flex flex-col items-start">
              <p className="mb-2 font-medium text-hintColor text-[16px] font-mon ">
                Company Seal
              </p>
              <FilePickerInput
                mimeType="image/*"
                width="w-96"
                onFileSelect={handleSeal}
                initialFileName={sealFileName!}
                maxSize={5 * 1024 * 1024}
                disable={isDisable}
              />
              {declarationError.sealFile && (
                <ValidationError title={declarationError.sealFile} />
              )}

              <div className=" w-full flex  items-start space-x-4">
                {imagePreview2 && (
                  <img
                    src={imagePreview2}
                    alt="Preview"
                    className=" mt-2 w-44 h-24 rounded-md p-2 border-2 border-midGreen shadow-md"
                  />
                )}
                {/* {declarationInfo?.supplier_company_seal_file_path != null &&
                  declarationInfo.data.COMPANY_SEAL_FILE_NAME != null && (
                    <img
                      src={`${declarationInfo?.supplier_company_seal_file_path!}/${declarationInfo
                        ?.data.COMPANY_SEAL_FILE_NAME!}`}
                      alt="Preview"
                      className={`mt-2 w-44 h-24 rounded-md p-2 border-2 ${
                        imagePreview2 ? "border-red-500" : "border-borderColor"
                      }  shadow-md`}
                    />
                  )} */}
              </div>

              <div className="h-2"></div>

              {declarationInfo?.supplier_company_seal_file_path != null &&
              declarationInfo.data.COMPANY_SEAL_FILE_NAME != null ? (
                <div className=" flex items-center space-x-6">
                  {sealFileLoading ? (
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
                          declarationInfo?.supplier_company_seal_file_path!,
                          declarationInfo?.data.COMPANY_SEAL_FILE_NAME!,
                          setSealFileLoading
                        );
                      }}
                      className={`${
                        isRegCompelte === "1" ? "w-96" : "w-80"
                      }  dashedButton my-4 `}
                    >
                      {" "}
                      view seal
                    </button>
                  )}
                  {isRegCompelte === "1" ? null : (
                    <button
                      onClick={() =>
                        handleOpenModal(
                          declarationInfo?.data.COMPANY_SEAL_FILE_NAME!,
                          "companySeal"
                        )
                      }
                      className=" py-2 px-2 rounded-md shadow-sm border-borderColor border-[0.5px]"
                    >
                      <DeleteIcon />
                    </button>
                  )}
                </div>
              ) : // <button
              //   onClick={() => handleOpenModal(declarationInfo?.data.COMPANY_SEAL_FILE_NAME!, 'companySeal')}
              //   className=" py-2 w-full  flex justify-center items-center rounded-md shadow-sm border-borderColor border-[0.5px]"
              // >
              //   <DeleteIcon />
              // </button>

              null}

              <div className=" mt-48"></div>
              <div className=" w-full flex space-x-6 justify-end items-end">
                {isSubmitLoading ? (
                  <div className=" w-48 flex justify-center items-center">
                    <CircularProgressIndicator />
                  </div>
                ) : (
                  <CommonButton
                    disable={isDisable}
                    titleText={"Save & Next"}
                    onClick={submit}
                    width="w-48"
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
