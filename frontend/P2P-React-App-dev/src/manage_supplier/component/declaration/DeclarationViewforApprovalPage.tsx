import React, { useRef, useState, useEffect } from "react";

import { useAuth } from "../../../login_both/context/AuthContext";
import { useNavigate } from "react-router-dom";
import ItemCategoryinterface from "../../../registration/interface/CategoryInterface";
import { isTokenValid } from "../../../utils/methods/TokenValidityCheck";
import SuccessToast, {
  showSuccessToast,
} from "../../../Alerts_Component/SuccessToast";
import ErrorToast, {
  showErrorToast,
} from "../../../Alerts_Component/ErrorToast";
import BasicInfoViewForApprovalService from "../../service/basic_info/BasicInfoViewForApprovalService";
import ItemCategoryListServiceService from "../../../registration/service/basic_info/ItemCategoryListService";
import convertKeysToLowerCase from "../../../utils/methods/convertKeysToLowerCase";
import { useManageSupplierContext } from "../../interface/ManageSupplierContext";
import LogoLoading from "../../../Loading_component/LogoLoading";
import InputLebel from "../../../common_component/InputLebel";
import CommonInputField from "../../../common_component/CommonInputField";
import CommonDropDownSearch from "../../../common_component/CommonDropDownSearch";
import SupplierDeclarationInterface from "../../../registration/interface/SupplierDeclarationInterface";
import DeclarationViewForApprovalService from "../../service/declaration/DeclarationViewForApprovalService";
import FilePickerInput from "../../../common_component/FilePickerInput";
import CheckIcon from "../../../icons/CheckIcon";
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import FormControl from "@mui/joy/FormControl";
import fetchFileService from "../../../common_service/fetchFileService";
import CircularProgressIndicator from "../../../Loading_component/CircularProgressIndicator";

export default function DeclarationViewforApprovalPage() {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const [isAgree, setIsAgree] = useState(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [declarationInfo, setDeclarationInfo] =
    useState<SupplierDeclarationInterface | null>(null);

  const navigate = useNavigate();

  //token and submission status
  const { token, submissionStatus, supplierId } = useAuth();
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
    null
  );

  //show signature

  //show seal
  const [sealFileName, setSealFileName] = useState<string | null>(null);
  //show seal

  //get exisiting data api call

  const getExistingDeclaration = async () => {
    setIsLoading(true);
    try {
      const result = await DeclarationViewForApprovalService(
        token!,
        supplierId!
      );
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
    const isTokenExpired = !isTokenValid(token!);
    if (isTokenExpired) {
      localStorage.removeItem("token");
      showErrorToast("Please Login Again..");
      setTimeout(() => {
        navigate("/");
      }, 1200);
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

  const [authorityType, setAuthorityType] = useState<string | null>(null);

  const handleAuthorityChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAuthorityType(event.target.value);
  };

  //authority type
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [sealFile, setSealFile] = useState<File | null>(null);
  const handleSignature = (file: File | null) => {
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file);
      setSignatureFile(file);
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
  }>({});

  const validate = () => {
    const erros: {
      name?: string;
      authorityType?: string;
      isAgree?: string;
      signatureFile?: string;
      sealFile?: string;
    } = {};
    if (!name.trim()) {
      erros.name = "Please Enter Name.";
    }
    if (authorityType === "" || authorityType === null) {
      erros.authorityType = "Please Select One.";
    }
    if (isAgree === false) {
      erros.isAgree = "Agree to continue registration.";
    }
    if (
      (signatureFileName === null || signatureFileName === "") &&
      signatureFile === null
    ) {
      erros.signatureFile = "Please Select Signature File.";
    }
    if ((sealFileName === null || sealFileName === "") && sealFile === null) {
      erros.sealFile = "Please Select Seal File.";
    }

    setDeclarationError(erros);

    return Object.keys(erros).length === 0;
  };

  //validation

  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

  const submit = async () => {
    // if (validate()) {
    //     setIsSubmitLoading(true);
    //     try {
    //         const result = await AddUpdateDeclarationService(token!, authorityType!, name, isAgree ? "1" : "0", signatureFile, sealFile);
    //         console.log(result);
    //         if (result.data.success === true) {
    //             setIsSubmitLoading(false);
    //             showSuccessToast(result.data.message);
    //             getExistingDeclaration();
    //         }
    //         else {
    //             setIsSubmitLoading(false);
    //             showErrorToast(result.data.message);
    //         }
    //     }
    //     catch (error) {
    //         //handleError
    //         setIsSubmitLoading(false);
    //         showErrorToast("Something went wrong, try again.")
    //     }
    // }
  };

  const [signatureLoading, setSignatureLoading] = useState<boolean>(false);
  const [sealLoading, setSealLoading] = useState<boolean>(false);

  const handleViewFile = (
    filePath: string,
    fileName: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    fetchFileService(filePath, fileName, token!, setLoading);
  };

  return (
    <div className=" bg-whiteColor">
      <SuccessToast />
      {isLoading ? (
        <div className=" flex w-full h-screen items-center justify-center">
          <LogoLoading />
        </div>
      ) : (
        <div className="  w-full h-screen flex flex-col items-start">
          <h3 className=" font-bold text-lg text-hintColor font-mon">
            Declaration
          </h3>
          <p className=" mt-4  text-sm font-medium text-hintColor font-mon">
            We hereby certify that all of the information stated herein, and the
            documents furnished are true, correct and complete. Further, we
            acknowledge that the relationship between us and SCBL in connection
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

          <div className="w-full flex flex-row justify-between mt-4 ">
            <div className=" flex flex-col items-start">
              <p className="mb-2 font-medium text-hintColor text-[16px] font-mon">
                Signature with Date & Seal
              </p>
              <FilePickerInput
                mimeType=".pdf, image/*"
                width="w-96"
                onFileSelect={handleSignature}
                initialFileName={signatureFileName!}
                maxSize={5 * 1024 * 1024}
                disable={isDisable}
              />

              {signatureLoading ? (
                <div className=" w-full flex justify-center items-center">
                  <CircularProgressIndicator />
                </div>
              ) : declarationInfo?.supplier_signature_file_path != null &&
                declarationInfo.data.SIGNATURE_FILE_NAME != null ? (
                <button
                  // href={`${declarationInfo?.supplier_signature_file_path!}/${declarationInfo
                  //   ?.data.SIGNATURE_FILE_NAME!}`}
                  // target="blank"

                  onClick={() => {
                    handleViewFile(
                      declarationInfo?.supplier_signature_file_path!,
                      declarationInfo?.data.SIGNATURE_FILE_NAME!,
                      setSignatureLoading
                    );
                  }}
                  className=" w-96 dashedButton my-4 "
                >
                  {" "}
                  view signature
                </button>
              ) : null}
              <p className="mb-2 mt-6 font-medium text-hintColor text-[16px] font-mon  ">
                Name of Signatory
              </p>
              <CommonInputField
                inputRef={nameRef}
                onChangeData={handleNameChange}
                hint="ex: Mohsin Khan"
                type="text"
                disable={isDisable}
              />

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
            </div>
            <div className=" flex flex-col items-start">
              <p className="mb-2 font-medium text-hintColor text-[16px] font-mon ">
                Company Seal
              </p>
              <FilePickerInput
                mimeType=".pdf, image/*"
                width="w-96"
                onFileSelect={handleSeal}
                initialFileName={sealFileName!}
                maxSize={5 * 1024 * 1024}
                disable={isDisable}
              />

              {sealLoading ? (
                <div className=" w-full flex justify-center items-center">
                  <CircularProgressIndicator />
                </div>
              ) : declarationInfo?.supplier_company_seal_file_path != null &&
                declarationInfo.data.COMPANY_SEAL_FILE_NAME != null ? (
                <button
                  // href={`${declarationInfo?.supplier_company_seal_file_path!}/${declarationInfo
                  //   ?.data.COMPANY_SEAL_FILE_NAME!}`}
                  // target="blank"
                  onClick={() => {
                    handleViewFile(
                      declarationInfo?.supplier_company_seal_file_path!,
                      declarationInfo?.data.COMPANY_SEAL_FILE_NAME!,
                      setSealLoading
                    );
                  }}
                  className=" w-96 dashedButton my-4 "
                >
                  {" "}
                  view seal
                </button>
              ) : null}

              <div className=" mt-48"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
