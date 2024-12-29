import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../login_both/context/AuthContext";
import { useNavigate } from "react-router-dom";
import ItemCategoryinterface from "../../registration/interface/CategoryInterface";
import { isTokenValid } from "../../utils/methods/TokenValidityCheck";

import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";

import ErrorToast, { showErrorToast } from "../../Alerts_Component/ErrorToast";

import ItemCategoryListServiceService from "../../registration/service/basic_info/ItemCategoryListService";

import convertKeysToLowerCase from "../../utils/methods/convertKeysToLowerCase";
import LogoLoading from "../../Loading_component/LogoLoading";

import InputLebel from "../../common_component/InputLebel";

import CommonInputField from "../../common_component/CommonInputField";

import CommonDropDownSearch from "../../common_component/CommonDropDownSearch";

import SupplierContactInterface from "../../registration/interface/SupplierContactInterface";

import ContactListViewForApprovalService from "../../manage_supplier/service/contact/ContactListViewForApprovalService";

import PageTitle from "../../common_component/PageTitle";

import CommonButton from "../../common_component/CommonButton";

import EditIcon from "../../icons/EditIcon";

import BankInterface from "../../registration/interface/BankInterface";

import { useRfiBankViewApprovalContext } from "../context/RfiBankApprovalViewContext";

import BankListViewForApprovalService from "../../manage_supplier/service/bank/BankListViewForApprovalService";
import BankDetailsInterface from "../../registration/interface/BankDetailsInterface";
import SupplierSiteInterface from "../../registration/interface/SupplierSiteInterface";
import SiteListViewForApprovalService from "../../manage_supplier/service/site/SiteListViewForApprovalService";
import BankDetailsViewForApprovalService from "../../manage_supplier/service/bank/BankDetailsViewForApprovalService";
import HierarchyInterface from "../../registration/interface/hierarchy/HierarchyInterface";
import HierachyListByModuleService from "../../registration/service/approve_hierarchy/HierarchyListByModuleService";
import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";
import FilePickerInput from "../../common_component/FilePickerInput";
import convertDateFormat from "../../utils/methods/convertDateFormat";
import useRegistrationStore from "../../registration/store/registrationStore";
import BankListFromOracleServiceService from "../../registration/service/bank/BankListServiceFromOracleService";
import BankWiseBranchListService from "../../registration/service/bank/BankWiseBranchListService";
import CurrencyListService from "../../registration/service/bank/CurrencyListService";
import WarningModal from "../../common_component/WarningModal";
import ValidationError from "../../Alerts_Component/ValidationError";

interface BankData {
  HOME_COUNTRY: string;
  BANK_PARTY_ID: number;
  BANK_NAME: string;
}

interface BankFromOracle {
  value: string;
  label: string;
}

interface BranchData {
  BANK_BRANCH_NAME: string;
  BRANCH_PARTY_ID: string;
}

interface BranchFromOracle {
  value: string;
  label: string;
}

interface CurrencyData {
  CURRENCY_CODE: string;
  NAME: string;
}

interface CurrencyFromOracle {
  value: string;
  label: string;
}

export default function RfiBankDetailsApprovalViewPage() {
  const [accountName, setAccountName] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [branchName, setBranchName] = useState<string>("");
  const [swiftCode, setSwiftCode] = useState<string>("");
  const [routingNumber, setRoutingNumber] = useState<string>("");
  const [siteAddress, setSiteAddress] = useState<string>("");
  const [chequeFileName, setChequeFileName] = useState<string | null>(
    "" || null
  );
  const [cheque, setCheque] = useState<File | null>(null);
  const [siteId, setSiteId] = useState<number>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoading2, setIsLoading2] = useState<boolean>(false);
  const [bankDetails, setBankDetails] = useState<BankDetailsInterface | null>(
    null
  );
  const [siteList, setSiteList] = useState<SupplierSiteInterface[] | []>([]);

  const [isBankLoading, setIsBankLoading] = useState<boolean>(false);

  const accountNameRefs = useRef<HTMLInputElement | null>(null);
  const accountNumberRefs = useRef<HTMLInputElement | null>(null);
  const bankNameRefs = useRef<HTMLInputElement | null>(null);
  const branchNameRefs = useRef<HTMLInputElement | null>(null);
  const swiftCodeRefs = useRef<HTMLInputElement | null>(null);
  const routingNumberRefs = useRef<HTMLInputElement | null>(null);

  const { bankAccId, bankAccLength, setBankAccId, setBankAccLength, setPage } =
    useRfiBankViewApprovalContext();
  const {
    token,
    submissionStatus,
    setSubmissionStatus,
    supplierId,
    isRegCompelte,
    supplierCountryCode,
  } = useAuth();
  const navigate = useNavigate();

  //store
  const globalIncorporatedIn = useRegistrationStore(
    (state) => state.globalIncorporatedIn
  );
  //store

  const [bankFromOracleList, setBankFromOracleList] = useState<
    BankFromOracle[] | []
  >([]);
  const [bankFromOracle, setBankFromOracle] = useState<BankFromOracle | null>(
    null
  );

  const getBank = async (code: string) => {
    setIsBankLoading(true);
    try {
      const result = await BankListFromOracleServiceService(token!, code);
      console.log(result.data);

      if (result.data.status === 200) {
        // Transform the data
        const transformedData = result.data.data.map((item: BankData) => ({
          value: item.BANK_PARTY_ID,
          label: item.BANK_NAME,
        }));

        setBankFromOracleList(transformedData);
        setIsBankLoading(false);

        //   const findedData=transformedData.find((item:any)=>(item.label===bankDetails?.data.BANK_NAME));
        //   setBankFromOracle(findedData);
        //   console.log(findedData);
      }
    } catch {
      setIsBankLoading(false);
    }
  };
  const [bankPartyId, setBankPartyId] = useState<string | null>(null);

  const handleBankNameFromOracleChange = (value: any) => {
    // console.log("value:", value);
    setBankFromOracle(value);
    if (value !== null) {
      setBankName(value.label);
      console.log(value.value);
      getBranch(value.value);
      setBankPartyId(value.value);

      //   getBank(value.value);
    } else if (value == null && bankFromOracleList != null) {
      setBankName("");
      setBranchFromOracle(null);
      console.log("cleared");
    }
  };

  const [branchListFromOracle, setBranchListFromOracle] = useState<
    BranchFromOracle[] | []
  >([]);
  const [branchFromOracle, setBranchFromOracle] =
    useState<BranchFromOracle | null>(null);

  const [branchPartyid, setBranchPartyId] = useState<string | null>(null);

  const getBranch = async (partyCode: string) => {
    try {
      const result = await BankWiseBranchListService(token!, partyCode);
      console.log(result.data);

      if (result.data.status === 200) {
        const transformedData = result.data.data.map((item: BranchData) => ({
          value: item.BRANCH_PARTY_ID,
          label: item.BANK_BRANCH_NAME,
        }));
        setBranchListFromOracle(transformedData);
        const foundBranch = transformedData.find(
          (item: BranchFromOracle) =>
            item.label === bankDetails?.data.BRANCH_NAME
        );
        // console.log(foundBranch);

        // Set the found bank data as the initial value for the dropdown
        if (foundBranch) {
          setBranchFromOracle(foundBranch!);
        }
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Branch load failed");
    }
  };

  const handleBranchNameFromOracleChange = (value: any) => {
    // console.log("value:", value);
    setBranchFromOracle(value);
    if (value !== null) {
      setBranchName(value.label);
      console.log(value.value);
      //   getBranch(value.value);
      setBranchPartyId(value.value);

      //   getBank(value.value);
    } else if (value == null && branchListFromOracle != null) {
      setBranchPartyId(""); //branch name silo
      console.log("cleared");
    }
  };

  const [currencyListFromOracle, setCurrencyListFromOracle] = useState<
    CurrencyFromOracle[] | []
  >([]);
  const [currencyFromOracle, setCurrencyFromOracle] =
    useState<CurrencyFromOracle | null>(null);

  const getCurrency = async () => {
    try {
      const result = await CurrencyListService(token!);
      console.log(result.data);

      if (result.data.status === 200) {
        const transformedData = result.data.data.map((item: CurrencyData) => ({
          value: item.CURRENCY_CODE,
          label: item.NAME,
        }));
        setCurrencyListFromOracle(transformedData);
        // const foundCurrency = transformedData.find(
        //   (item: CurrencyFromOracle) =>
        //     item.value === bankDetails?.data.CURRENCY_CODE
        // );
        // console.log(foundCurrency);

        // // Set the found bank data as the initial value for the dropdown
        // if (foundCurrency) {
        //   setCurrencyFromOracle(foundCurrency!);
        // }
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Currency load failed");
    }
  };

  const [currencyCode, setCurrencyCode] = useState("");

  const handleCurrencyFromOracleChange = (value: any) => {
    // console.log("value:", value);
    setCurrencyFromOracle(value);
    if (value !== null) {
      console.log(value.value);
      //   getBranch(value.value);
      setCurrencyCode(value.value);

      //   getBank(value.value);
    } else if (value == null && currencyListFromOracle != null) {
      setCurrencyCode("");
      console.log("cleared");
    }
  };

  // const handleChequeChange = (index: number, files: FileList | null) => {
  //     if (files && files.length > 0) {
  //         const file = files[0];
  //         const updatedCheque = [...cheque];
  //         updatedCheque[index] = file;
  //         setCheque(updatedCheque);
  //     }
  // };

  //first time load if edit bank

  //token validation
  useEffect(() => {
    console.log("render");
    console.log(isRegCompelte);
    console.log(typeof isRegCompelte);
    console.log(globalIncorporatedIn);

    const isTokenExpired = !isTokenValid(token!);
    if (isTokenExpired) {
      localStorage.removeItem("regToken");
      showErrorToast("Please Login Again..");
      setTimeout(() => {
        navigate("/");
      }, 1200);
    } else {
      // getSitelist();

      getBank(supplierCountryCode!);
      getCurrency();
      if (bankAccId != null) {
        getBankDetails();
      }
      // if (bankAccId == null) {
      //     // getSiteDetails();
      //     getSitelist();

      // }
    }
  }, []);
  //token validation

  //get all site added by user

  //edit er somoy bank details anbo

  const getBankDetails = async () => {
    try {
      setIsLoading2(true);
      const result = await BankDetailsViewForApprovalService(
        token!,
        supplierId!,
        bankAccId!
      );
      if (result.data.status === 200) {
        setIsLoading2(false);
        setBankDetails(result.data);
      } else {
        setIsLoading2(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsLoading2(false);
      showErrorToast("Something went wrong");
    }
  };

  //re-render for set data

  useEffect(() => {
    if (bankDetails && bankFromOracleList && branchListFromOracle) {
      setData();
    }
  }, [bankDetails, bankFromOracleList]);

  //   useEffect(() => {
  //     console.log("after branch list");

  //     if (branchListFromOracle) {
  //       setData();
  //     }
  //   }, [branchListFromOracle]);
  //     useEffect(()=>{
  // if(bankFromOracleList){
  //     setData();
  // }
  //     },[bankFromOracleList])
  // useEffect(()=>{
  //     if( siteList){
  //         setData();
  //     }

  // },[siteList]);

  //disabling field
  const [isDisable, setIsDisable] = useState<boolean>(false);
  //disabling field

  //set disable

  useEffect(() => {
    if (
      submissionStatus === "DRAFT" ||
      bankDetails?.data.ACTIVE_STATUS === "ACTIVE"
    ) {
      setIsDisable(false);
    } else {
      setIsDisable(true);
    }
  }, [submissionStatus]);

  // //set disable
  let foundBank;

  const setData = () => {
    console.log("set datat called");

    if (bankDetails && bankFromOracleList && branchListFromOracle) {
      // && bankNameRefs.current && accountNameRefs.current && accountNumberRefs.current && branchNameRefs.current && swiftCodeRefs.current
      if (accountNameRefs.current) {
        accountNameRefs.current.value = bankDetails.data.ACCOUNT_NAME;
      }
      //
      setAccountName(bankDetails.data.ACCOUNT_NAME);
      // bankNameRefs.current.value=bankDetails.data.BANK_NAME;
      if (bankNameRefs.current) {
        bankNameRefs.current.value = bankDetails.data.BANK_NAME;
      }
      setBankName(bankDetails.data.BANK_NAME);
      // accountNumberRefs.current.value=bankDetails.data.ACCOUNT_NUMBER;
      if (accountNumberRefs.current) {
        accountNumberRefs.current.value = bankDetails.data.ACCOUNT_NUMBER;
      }
      setAccountNumber(bankDetails.data.ACCOUNT_NUMBER);
      if (branchNameRefs.current) {
        branchNameRefs.current.value = bankDetails.data.BRANCH_NAME;
      }
      // bankNameRefs.current.value=bankDetails.data.BANK_NAME;
      setBankName(bankDetails.data.BANK_NAME);
      // branchNameRefs.current.value=bankDetails.data.BRANCH_NAME;
      setBranchName(bankDetails.data.BRANCH_NAME);
      if (swiftCodeRefs.current) {
        swiftCodeRefs.current.value = bankDetails.data.SWIFT_CODE;
      }
      // swiftCodeRefs.current.value=bankDetails.data.ROUTING_SWIFT_CODE;
      setSwiftCode(bankDetails.data.ROUTING_SWIFT_CODE);
      if (bankDetails.data.ACTIVE_STATUS === "DEACTIVE") {
        setIsDisable(true);
      }

      if (routingNumberRefs.current) {
        routingNumberRefs.current.value = bankDetails.data.ROUTING_SWIFT_CODE;
      }

      setIsActiveBank(
        bankDetails.data.ACTIVE_STATUS === "ACTIVE" ? true : false
      );
      if (bankDetails.data.CHEQUE_FILE_NAME != null) {
        setChequeFileName(bankDetails.data.CHEQUE_FILE_NAME);
      }
      // Find the bank data in bankFromOracleList based on BANK_NAME

      foundBank = bankFromOracleList.find(
        (item: BankFromOracle) => item.label === bankDetails.data.BANK_NAME
      );

      console.log(foundBank);
      setBankPartyId(bankDetails.data.BANK_PARTY_ID.toString());
      setBranchPartyId(bankDetails.data.BRANCH_PARTY_ID.toString());

      //   getBranch(foundBank?.value!);
      getBranch(bankDetails.data.BANK_PARTY_ID.toString());

      // Set the found bank data as the initial value for the dropdown
      setBankFromOracle(foundBank!);
      // Find the branch data in bankFromOracleList based on BANK_NAME

      // if(siteList){
      //     const matchedSite: SupplierSiteInterface[] =siteList.filter((site)=>site.ID===bankDetails.data.SITE_ID);
      //     setSiteId(matchedSite[0].ID);
      // }

      const foundCurrency = currencyListFromOracle.find(
        (item: CurrencyFromOracle) =>
          item.value === bankDetails?.data.CURRENCY_CODE
      );
      console.log(foundCurrency);

      // Set the found bank data as the initial value for the dropdown
      if (foundCurrency) {
        setCurrencyFromOracle(foundCurrency!);
      }
    }
  };

  //   useEffect(() => {
  //     getBranch(bankDetails?.data.BANK_PARTY_ID.toString()!);
  //   }, [foundBank]);

  const handleAccountNameChange = (value: string) => {
    setAccountName(value);
  };

  const handleAccountNumberChange = (value: string) => {
    setAccountNumber(value);
  };
  const handleBankNameChange = (value: string) => {
    setBankName(value);
  };

  const handleBranchNameChange = (value: string) => {
    setBranchName(value);
  };

  const handleSwiftCodeChange = (value: string) => {
    setSwiftCode(value);
  };
  const handleRoutingNumberChange = (value: string) => {
    setRoutingNumber(value);
  };

  const handleSiteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSiteId = event.target.value;
    // Perform any necessary actions with the selected site ID
    // For example, you can update the state or perform an API call
    setSiteId(parseInt(selectedSiteId));
  };

  const handleCheque = (file: File | null) => {
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file);
      setCheque(file);
    } else {
      // No file selected
      console.log("No file selected");
    }
  };

  //loading for save button
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  // //loadin for final submit

  // const [isSubmitLoading,setIsSubmitLoading]=useState<boolean>(false);

  //back to list page
  const back = () => {
    setPage(1);
    //if bank acc id not null hole korleo hbe
    setBankAccId(null);
  };

  //validation

  const [bankDetailsError, setBankDetailsError] = useState<{
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
    branchName?: string;
    swiftCode?: string;
    chequeFileName?: string;
    siteId?: string;
    routingNumber?: string;
    currencyCode?: string;
  }>({});

  const validate = () => {
    const erros: {
      accountName?: string;
      accountNumber?: string;
      bankName?: string;
      branchName?: string;
      swiftCode?: string;
      chequeFileName?: string;
      siteId?: string;
      routingNumber?: string;
      currencyCode?: string;
    } = {};
    if (!accountName.trim()) {
      erros.accountName = "Please Enter Account Name.";
    }
    if (!accountNumber.trim()) {
      erros.accountNumber = "Please Enter Account Number.";
    }
    if (!bankName.trim()) {
      erros.bankName = "Please Enter Bank Number.";
    }
    if (!branchName.trim()) {
      erros.branchName = "Please Enter Branch Name.";
    }
    if (!swiftCode.trim() && globalIncorporatedIn !== "Bangladesh") {
      erros.swiftCode = "Please Enter Swift Code.";
    }
    if (!routingNumber.trim() && globalIncorporatedIn === "Bangladesh") {
      erros.routingNumber = "Please Enter Routing number.";
    }
    if (currencyCode === "") {
      erros.currencyCode = "Please Select Currency.";
    }

    // if (siteId === null || siteId === undefined) {
    //     erros.siteId = "Please Select a site."
    // }
    if (
      (chequeFileName === null || chequeFileName === "") &&
      cheque === null &&
      globalIncorporatedIn === "Bangladesh"
    ) {
      erros.chequeFileName = "Please Select Cheque File.";
    }

    setBankDetailsError(erros);

    return Object.keys(erros).length === 0;
  };

  //for add and update
  const submit = async () => {
    console.log("bank sumbit");
    console.log(bankName);
  };

  //bank active de active
  const [isActiveBank, setIsActiveBank] = useState<boolean>(true);

  const handleActivation = () => {
    setIsActiveBank(!isActiveBank);
    openWarningModal();
  };

  const [isWarningShow, setIsWarningShow] = useState(false);
  const openWarningModal = () => {
    setIsWarningShow(true);
  };
  const closeWarningModal = () => {
    setIsWarningShow(false);
    setIsActiveBank(isActiveBank ? false : true);
  };
  return (
    <div className="bg-whiteColor">
      <SuccessToast />

      <WarningModal
        isOpen={isWarningShow}
        closeModal={closeWarningModal}
        action={submit}
        message={`Do you want to ${
          !isActiveBank ? "Deactivate" : "Activate"
        } Site`}
        imgSrc="/images/warning.png"
      />

      {isLoading2 ? (
        <div className=" w-full h-screen flex justify-center items-center">
          <LogoLoading />
        </div>
      ) : (
        <>
          <div className=" w-full flex flex-col items-start space-y-4">
            <div className=" w-full flex justify-between items-center">
              <PageTitle titleText="Bank Details" />
              <CommonButton
                onClick={back}
                height="h-8"
                width="w-24"
                titleText="Back"
                color="bg-midGreen"
              />
            </div>

            <div className=" w-full flex flex-row justify-between items-start">
              <div className=" w-full flex flex-col items-start space-y-2">
                <InputLebel titleText={"Account Name"} />
                <CommonInputField
                  type="text"
                  hint="Account Holder Name"
                  onChangeData={handleAccountNameChange}
                  inputRef={accountNameRefs}
                  disable={isDisable}
                />
                {bankDetailsError.accountName && (
                  <ValidationError title={bankDetailsError.accountName} />
                )}
              </div>
              <div className=" w-full flex flex-col items-start space-y-2">
                <InputLebel titleText={"Account Number"} />
                <CommonInputField
                  type="text"
                  hint="Account Number"
                  onChangeData={handleAccountNumberChange}
                  inputRef={accountNumberRefs}
                  disable={isDisable}
                />
                {bankDetailsError.accountNumber && (
                  <ValidationError title={bankDetailsError.accountNumber} />
                )}
              </div>
            </div>

            <div className=" w-full flex flex-row justify-between items-center">
              <div className=" w-full flex flex-col items-start space-y-2">
                <InputLebel titleText={"Bank Name"} />
                <CommonDropDownSearch
                  placeholder="Select Bank Name"
                  onChange={handleBankNameFromOracleChange}
                  value={bankFromOracle}
                  options={bankFromOracleList}
                  width="w-96"
                  disable={isDisable}
                />
                {/* <InputLebel titleText={'Or'} />
                               <CommonInputField type='text' hint='Bank Name' onChangeData={handleBankNameChange} inputRef={bankNameRefs} disable={isDisable}/> */}
                {bankDetailsError.bankName && (
                  <ValidationError title={bankDetailsError.bankName} />
                )}
              </div>
              <div className=" w-full flex flex-col items-start space-y-2">
                <InputLebel titleText={"Branch Name"} />
                {/* <CommonInputField
                  type="text"
                  hint="Branch Name"
                  onChangeData={handleBranchNameChange}
                  inputRef={branchNameRefs}
                  disable={isDisable}
                /> */}
                <CommonDropDownSearch
                  placeholder="Select Branch Name"
                  onChange={handleBranchNameFromOracleChange}
                  value={branchFromOracle}
                  options={branchListFromOracle}
                  width="w-96"
                  disable={isDisable}
                />
                {bankDetailsError.branchName && (
                  <ValidationError title={bankDetailsError.branchName} />
                )}
              </div>
            </div>
            <div className=" w-full flex flex-row justify-between items-center">
              <div className=" w-full flex flex-col items-start space-y-2">
                <InputLebel titleText={"Routing Number / Swift Code"} />
                <CommonInputField
                  type="text"
                  hint="43634634"
                  onChangeData={handleRoutingNumberChange}
                  inputRef={routingNumberRefs}
                  disable={isDisable}
                />
                {bankDetailsError.routingNumber && (
                  <ValidationError title={bankDetailsError.routingNumber} />
                )}
              </div>
              <div className=" w-full flex flex-col items-start space-y-2">
                <InputLebel titleText={"Currency"} />
                <CommonDropDownSearch
                  placeholder="Select Currency "
                  onChange={handleCurrencyFromOracleChange}
                  value={currencyFromOracle}
                  options={currencyListFromOracle}
                  width="w-96"
                  disable={isDisable}
                />
                {bankDetailsError.currencyCode && (
                  <ValidationError title={bankDetailsError.currencyCode} />
                )}
              </div>
            </div>
            <div className=" w-full flex flex-row justify-between items-start">
              {/* <div className=" w-full flex flex-col items-start space-y-2">
                <InputLebel titleText={"Swift Code"} />
                <CommonInputField
                  type="text"
                  hint="8745356"
                  onChangeData={handleSwiftCodeChange}
                  inputRef={swiftCodeRefs}
                  disable={isDisable}
                />
                {bankDetailsError.swiftCode && (
                  <ValidationError title={bankDetailsError.swiftCode} />
                )}
              </div> */}
              <div className=" w-full flex flex-col items-start space-y-2">
                <InputLebel titleText={"Blank Cheque Attachment"} />
                {/* <FilePickerInput  onFileSelect={(e) => handleChequeChange(1, e.target.files[0])}/> */}
                <FilePickerInput
                  mimeType=".pdf, image/*"
                  initialFileName={chequeFileName!}
                  onFileSelect={handleCheque}
                  maxSize={5 * 1024 * 1024}
                  disable={isDisable}
                />
                {bankDetailsError.chequeFileName && (
                  <ValidationError title={bankDetailsError.chequeFileName} />
                )}
                {bankDetails?.supplier_check_file_path != null &&
                bankDetails.data.CHEQUE_FILE_NAME != null ? (
                  <a
                    href={`${bankDetails?.supplier_check_file_path}/${bankDetails.data.CHEQUE_FILE_NAME}`}
                    target="blank"
                    className=" w-96 dashedButton my-4 "
                  >
                    {" "}
                    view{" "}
                  </a>
                ) : null}
              </div>
            </div>
            <div className=" w-full flex flex-row justify-between items-start">
              <div className=" w-full flex flex-col items-start space-y-2">
                {bankDetails?.data.ID == null ||
                isRegCompelte !== "1" ? null : (
                  <div className="form-control w-52">
                    <label className="cursor-pointer label">
                      <span className="label-text">
                        {isActiveBank ? "Deactive" : "Active"}
                      </span>
                      <input
                        onChange={handleActivation}
                        type="checkbox"
                        className={`toggle ${
                          isActiveBank
                            ? "bg-midGreen border-midGreen"
                            : "bg-graishColor"
                        }`}
                        checked={isActiveBank ? true : false}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
            {/* <div className=' w-full flex flex-col items-start space-y-2 '>
                            <InputLebel titleText={'Site Address'} />
                            <div className=' w-96 h-10 rounded-md  bg-inputBg border-[0.5px] border-borderColor shadow-sm'>
                                {
                                   isLoading
                                    ?
                                    <div className=' w-96 flex justify-center items-center'>
                                        <CircularProgressIndicator/>
                                    </div>
                                    :
                                    <select 
                                    disabled={isDisable}
                                    value={siteId}  onChange={handleSiteChange} placeholder='Select Site' name="invitationtype" id="" className=' pl-3 w-[374px] h-9 rounded-md bg-inputBg text-hintColor  focus:outline-none'>
                                    <option value="" disabled selected>Select Site</option>
                                    {
                                        siteList.map((e,i)=>(
                                            <option key={e.ID} value={e.ID} >{e.ADDRESS_LINE1}</option>
                                        ))
                                    }
                                    
                                  

                                </select>}

                            </div>
                            {
                                    bankDetailsError.siteId &&
                                    <ValidationError title={ bankDetailsError.siteId}/>
                                }
                        </div> */}
          </div>

          {/* <div className=" w-full flex flex-row space-x-4 justify-end pr-[86px] mt-12">
            {saveLoading ? (
              <div className=" w-40 flex justify-center items-center">
                <CircularProgressIndicator />
              </div>
            ) : (
              <CommonButton
                titleText={"Save & Continue"}
                onClick={submit}
                width="w-40"
                disable={isDisable}
              />
            )}
          </div> */}
        </>
      )}
    </div>
  );
}
