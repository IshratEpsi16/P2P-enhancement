// import React, { useState, useRef, useEffect, useCallback } from "react";
// import InputLebel from "../../common_component/InputLebel";
// import CommonInputField from "../../common_component/CommonInputField";
// import FilePickerInput from "../../common_component/FilePickerInput";
// import CommonButton from "../../common_component/CommonButton";
// import ApproveHierarchyTable from "../../common_component/ApproveHierarchyTable";

// import {
//   BankDetailsInterface,
//   SupplierSiteInterface,
// } from "../interface/RegistrationInterface";

// import { useBankPageContext } from "../context/BankPageContext";

// import { useAuth } from "../../login_both/context/AuthContext";
// import { isTokenValid } from "../../utils/methods/TokenValidityCheck";
// import { useNavigate } from "react-router-dom";
// import SuccessToast, {
//   showSuccessToast,
// } from "../../Alerts_Component/SuccessToast";
// import ErrorToast, { showErrorToast } from "../../Alerts_Component/ErrorToast";
// import SiteListService from "../service/site_creation/SiteListService";
// import BankDetailsService from "../service/bank/BankDetailsService";
// import PageTitle from "../../common_component/PageTitle";
// import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";
// import AddUpdateBankDetailsService from "../service/bank/AddUpdateBankDetailsService";
// import LogoLoading from "../../Loading_component/LogoLoading";
// import ValidationError from "../../Alerts_Component/ValidationError";
// import WarningModal from "../../common_component/WarningModal";
// import SubmitRegistrationService from "../service/registration_submission/submitRegistrationService";
// import HierachyListByModuleService from "../service/approve_hierarchy/HierarchyListByModuleService";
// import HierarchyInterface from "../interface/hierarchy/HierarchyInterface";
// import convertDateFormat from "../../utils/methods/convertDateFormat";
// import SendEmailService from "../../manage_supplier/service/approve_reject/SendEmailService";
// import ProfileUpdateSubmissionService from "../service/profile_update_submission/ProfileUpdateSubmissionService";
// import countryListWithCode from "../../jsons/countryListWithCode";
// import CommonDropDownSearch from "../../common_component/CommonDropDownSearch";
// import BankListFromOracleServiceService from "../service/bank/BankListServiceFromOracleService";
// import useRegistrationStore from "../store/registrationStore";
// import BankWiseBranchListService from "../service/bank/BankWiseBranchListService";
// import { red } from "@mui/material/colors";
// import CurrencyListService from "../service/bank/CurrencyListService";
// import useAuthStore from "../../login_both/store/authStore";

// const data = [
//   {
//     id: 1,
//     name: "Ismail Khan",
//     date: "12/12/2022",
//     action: "Approved",
//     remark: "fgfdwu wu fuw fuwgef uuyw gf",
//   },
//   {
//     id: 1,
//     name: "Ismail Khan",
//     date: "12/12/2022",
//     action: "Approved",
//     remark: "fgfdwu wu fuw fuwgef uuyw gf",
//   },
//   {
//     id: 1,
//     name: "Ismail Khan",
//     date: "12/12/2022",
//     action: "Approved",
//     remark: "fgfdwu wu fuw fuwgef uuyw gf",
//   },
// ];

// interface BankData {
//   HOME_COUNTRY: string;
//   BANK_PARTY_ID: number;
//   BANK_NAME: string;
// }

// interface BankFromOracle {
//   value: string;
//   label: string;
// }

// interface BranchData {
//   BANK_BRANCH_NAME: string;
//   BRANCH_PARTY_ID: string;
// }

// interface BranchFromOracle {
//   value: string;
//   label: string;
// }

// interface CurrencyData {
//   CURRENCY_CODE: string;
//   NAME: string;
// }

// interface CurrencyFromOracle {
//   value: string;
//   label: string;
// }

// export default function BankDetailsPage() {
//   // const [components, setComponents] = useState<JSX.Element[]>([
//   //     <BankDetailsPage key="1" />,

//   // ]);
//   // const handleAddComponent = () => {
//   //     const newComponents = [
//   //         ...components,
//   //         <BankDetailsPage key={components.length + 1} />,
//   //     ];
//   //     setComponents(newComponents);
//   // };

//   // const handleRemoveComponent = (index: number) => {
//   //     const newComponents = [...components];
//   //     newComponents.splice(index, 1);
//   //     setComponents(newComponents);
//   // };

//   const [accountName, setAccountName] = useState<string>("");
//   const [accountNumber, setAccountNumber] = useState<string>("");
//   const [bankName, setBankName] = useState<string>("");
//   const [branchName, setBranchName] = useState<string>("");
//   const [swiftCode, setSwiftCode] = useState<string>("");
//   const [routingNumber, setRoutingNumber] = useState<string>("");
//   const [siteAddress, setSiteAddress] = useState<string>("");
//   const [chequeFileName, setChequeFileName] = useState<string | null>(
//     "" || null
//   );
//   const [cheque, setCheque] = useState<File | null>(null);
//   const [siteId, setSiteId] = useState<number>();
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isLoading2, setIsLoading2] = useState<boolean>(false);
//   const [bankDetails, setBankDetails] = useState<BankDetailsInterface | null>(
//     null
//   );
//   const [siteList, setSiteList] = useState<SupplierSiteInterface[] | []>([]);

//   const [isBankLoading, setIsBankLoading] = useState<boolean>(false);

//   const accountNameRefs = useRef<HTMLInputElement | null>(null);
//   const accountNumberRefs = useRef<HTMLInputElement | null>(null);
//   const bankNameRefs = useRef<HTMLInputElement | null>(null);
//   const branchNameRefs = useRef<HTMLInputElement | null>(null);
//   const swiftCodeRefs = useRef<HTMLInputElement | null>(null);
//   const routingNumberRefs = useRef<HTMLInputElement | null>(null);

//   const { bankAccId, bankAccLength, setBankAccId, setBankAccLength, setPage } =
//     useBankPageContext();
//   const {
//     regToken,
//     submissionStatus,
//     setSubmissionStatus,
//     isRegCompelte,
//     supplierCountryCode,
//     token,
//   } = useAuth();
//   const navigate = useNavigate();

//   const { isBankChangeStore, setIsBankChangeStore } = useRegistrationStore();

//   useEffect(() => {
//     console.log("conditionBank: ", isBankChangeStore);
//   }, []);

//   //store
//   const globalIncorporatedIn = useRegistrationStore(
//     (state) => state.globalIncorporatedIn
//   );
//   //store

//   const [bankFromOracleList, setBankFromOracleList] = useState<
//     BankFromOracle[] | []
//   >([]);
//   const [bankFromOracle, setBankFromOracle] = useState<BankFromOracle | null>(
//     null
//   );

//   const getBank = async (code: string) => {
//     setIsBankLoading(true);
//     console.log(code);

//     try {
//       const result = await BankListFromOracleServiceService(regToken!, code);
//       console.log(result.data);

//       if (result.data.status === 200) {
//         // Transform the data
//         const transformedData = result.data.data.map((item: BankData) => ({
//           value: item.BANK_PARTY_ID,
//           label: item.BANK_NAME,
//         }));
//         console.log(transformedData);

//         setBankFromOracleList(transformedData);
//         setIsBankLoading(false);

//         //   const findedData=transformedData.find((item:any)=>(item.label===bankDetails?.data.BANK_NAME));
//         //   setBankFromOracle(findedData);
//         //   console.log(findedData);
//       } else {
//         showErrorToast(result.data.message);
//       }
//     } catch {
//       setIsBankLoading(false);
//     }
//   };
//   const [bankPartyId, setBankPartyId] = useState<string | null>(null);

//   const handleBankNameFromOracleChange = (value: any) => {
//     // console.log("value:", value);
//     setBankFromOracle(value);
//     if (value !== null) {
//       setBankName(value.label);
//       console.log(value.value);
//       getBranch(value.value);
//       setBankPartyId(value.value);

//       //   getBank(value.value);
//     } else if (value == null && bankFromOracleList != null) {
//       setBankName("");
//       setBranchFromOracle(null);
//       console.log("cleared");
//     }
//   };

//   const [branchListFromOracle, setBranchListFromOracle] = useState<
//     BranchFromOracle[] | []
//   >([]);
//   const [branchFromOracle, setBranchFromOracle] =
//     useState<BranchFromOracle | null>(null);

//   const [branchPartyid, setBranchPartyId] = useState<string | null>(null);

//   const getBranch = async (partyCode: string) => {
//     try {
//       const result = await BankWiseBranchListService(regToken!, partyCode);
//       console.log(result.data);

//       if (result.data.status === 200) {
//         const transformedData = result.data.data.map((item: BranchData) => ({
//           value: item.BRANCH_PARTY_ID,
//           label: item.BANK_BRANCH_NAME,
//         }));
//         setBranchListFromOracle(transformedData);
//         const foundBranch = transformedData.find(
//           (item: BranchFromOracle) =>
//             item.label === bankDetails?.data.BRANCH_NAME
//         );
//         // console.log(foundBranch);

//         // Set the found bank data as the initial value for the dropdown
//         if (foundBranch) {
//           setBranchFromOracle(foundBranch!);
//         }
//       } else {
//         showErrorToast(result.data.message);
//       }
//     } catch (error) {
//       showErrorToast("Branch load failed");
//     }
//   };

//   const handleBranchNameFromOracleChange = (value: any) => {
//     // console.log("value:", value);
//     setBranchFromOracle(value);
//     if (value !== null) {
//       setBranchName(value.label);
//       console.log(value.value);
//       //   getBranch(value.value);
//       setBranchPartyId(value.value);

//       //   getBank(value.value);
//     } else if (value == null && branchListFromOracle != null) {
//       setBranchPartyId(""); //branch name silo
//       console.log("cleared");
//     }
//   };

//   const [currencyListFromOracle, setCurrencyListFromOracle] = useState<
//     CurrencyFromOracle[] | []
//   >([]);
//   const [currencyFromOracle, setCurrencyFromOracle] =
//     useState<CurrencyFromOracle | null>(null);

//   const getCurrency = async () => {
//     try {
//       const result = await CurrencyListService(regToken!);
//       console.log(result.data);

//       if (result.data.status === 200) {
//         const transformedData = result.data.data.map((item: CurrencyData) => ({
//           value: item.CURRENCY_CODE,
//           label: item.NAME,
//         }));
//         setCurrencyListFromOracle(transformedData);
//         // const foundCurrency = transformedData.find(
//         //   (item: CurrencyFromOracle) =>
//         //     item.value === bankDetails?.data.CURRENCY_CODE
//         // );
//         // console.log(foundCurrency);

//         // // Set the found bank data as the initial value for the dropdown
//         // if (foundCurrency) {
//         //   setCurrencyFromOracle(foundCurrency!);
//         // }
//       } else {
//         showErrorToast(result.data.message);
//       }
//     } catch (error) {
//       showErrorToast("Currency load failed");
//     }
//   };

//   const [currencyCode, setCurrencyCode] = useState("");

//   const handleCurrencyFromOracleChange = (value: any) => {
//     // console.log("value:", value);
//     setCurrencyFromOracle(value);
//     if (value !== null) {
//       console.log(value.value);
//       //   getBranch(value.value);
//       setCurrencyCode(value.value);

//       //   getBank(value.value);
//     } else if (value == null && currencyListFromOracle != null) {
//       setCurrencyCode("");
//       console.log("cleared");
//     }
//   };

//   // const handleChequeChange = (index: number, files: FileList | null) => {
//   //     if (files && files.length > 0) {
//   //         const file = files[0];
//   //         const updatedCheque = [...cheque];
//   //         updatedCheque[index] = file;
//   //         setCheque(updatedCheque);
//   //     }
//   // };

//   //first time load if edit bank

//   //token validation
//   useEffect(() => {
//     console.log("render");
//     console.log(isRegCompelte);
//     console.log(typeof isRegCompelte);
//     console.log(globalIncorporatedIn);

//     const isTokenExpired = !isTokenValid(regToken!);
//     if (isTokenExpired) {
//       localStorage.removeItem("regToken");
//       showErrorToast("Please Login Again..");
//       setTimeout(() => {
//         navigate("/");
//       }, 1200);
//     } else {
//       // getSitelist();

//       getBank(supplierCountryCode!);
//       getCurrency();
//       if (bankAccId != null) {
//         getBankDetails();
//       }
//       // if (bankAccId == null) {
//       //     // getSiteDetails();
//       //     getSitelist();

//       // }
//     }
//   }, []);
//   //token validation

//   //get all site added by user

//   //site jodi add na kora thake taile errror dekhate hbe

//   const getSitelist = async () => {
//     try {
//       setIsLoading(true);
//       if (bankAccId) {
//         setIsLoading2(true);
//       }
//       const result = await SiteListService(regToken!);
//       if (result.data.status === 200) {
//         setIsLoading(false);
//         setSiteList(result.data.data);
//         console.log(result.data.data);
//       } else {
//         setIsLoading(false);
//         showErrorToast(result.data.message);
//       }
//     } catch (error) {
//       setIsLoading(false);
//       showErrorToast("Something went wrong");
//     }
//   };

//   //edit er somoy bank details anbo

//   const getBankDetails = async () => {
//     try {
//       setIsLoading2(true);
//       const result = await BankDetailsService(regToken!, bankAccId!);
//       console.log(result.data);

//       if (result.data.status === 200) {
//         setIsLoading2(false);
//         setBankDetails(result.data);
//         console.log(result.data.data.BANK_PARTY_ID.toString());
//       } else {
//         setIsLoading2(false);
//         showErrorToast(result.data.message);
//       }
//     } catch (error) {
//       setIsLoading2(false);
//       showErrorToast("Something went wrong");
//     }
//   };

//   //re-render for set data

//   useEffect(() => {
//     if (bankDetails && bankFromOracleList && branchListFromOracle) {
//       setData();
//     }
//   }, [bankDetails, bankFromOracleList]);

//   //   useEffect(() => {
//   //     console.log("after branch list");

//   //     if (branchListFromOracle) {
//   //       setData();
//   //     }
//   //   }, [branchListFromOracle]);
//   //     useEffect(()=>{
//   // if(bankFromOracleList){
//   //     setData();
//   // }
//   //     },[bankFromOracleList])
//   // useEffect(()=>{
//   //     if( siteList){
//   //         setData();
//   //     }

//   // },[siteList]);

//   //disabling field
//   const [isDisable, setIsDisable] = useState<boolean>(false);
//   //disabling field

//   //set disable

//   useEffect(() => {
//     if (
//       submissionStatus === "DRAFT" ||
//       bankDetails?.data.ACTIVE_STATUS === "ACTIVE"
//     ) {
//       setIsDisable(false);
//     } else {
//       setIsDisable(true);
//     }
//   }, [submissionStatus]);

//   // //set disable
//   let foundBank;

//   const setData = () => {
//     console.log("set datat called");

//     if (bankDetails && bankFromOracleList && branchListFromOracle) {
//       // && bankNameRefs.current && accountNameRefs.current && accountNumberRefs.current && branchNameRefs.current && swiftCodeRefs.current
//       if (accountNameRefs.current) {
//         accountNameRefs.current.value = bankDetails.data.ACCOUNT_NAME;
//       }
//       //
//       setAccountName(bankDetails.data.ACCOUNT_NAME);
//       // bankNameRefs.current.value=bankDetails.data.BANK_NAME;
//       if (bankNameRefs.current) {
//         bankNameRefs.current.value = bankDetails.data.BANK_NAME;
//       }
//       setBankName(bankDetails.data.BANK_NAME);
//       // accountNumberRefs.current.value=bankDetails.data.ACCOUNT_NUMBER;
//       if (accountNumberRefs.current) {
//         accountNumberRefs.current.value = bankDetails.data.ACCOUNT_NUMBER;
//       }
//       setAccountNumber(bankDetails.data.ACCOUNT_NUMBER);
//       if (branchNameRefs.current) {
//         branchNameRefs.current.value = bankDetails.data.BRANCH_NAME;
//       }
//       // bankNameRefs.current.value=bankDetails.data.BANK_NAME;
//       setBankName(bankDetails.data.BANK_NAME);
//       // branchNameRefs.current.value=bankDetails.data.BRANCH_NAME;
//       setBranchName(bankDetails.data.BRANCH_NAME);
//       if (swiftCodeRefs.current) {
//         swiftCodeRefs.current.value = bankDetails.data.SWIFT_CODE;
//       }
//       // swiftCodeRefs.current.value=bankDetails.data.ROUTING_SWIFT_CODE;
//       setSwiftCode(bankDetails.data.ROUTING_SWIFT_CODE);
//       if (bankDetails.data.ACTIVE_STATUS === "DEACTIVE") {
//         setIsActiveDisable(true);
//       }

//       if (routingNumberRefs.current) {
//         routingNumberRefs.current.value = bankDetails.data.ROUTING_SWIFT_CODE;
//         setRoutingNumber(bankDetails?.data.ROUTING_SWIFT_CODE);
//       }

//       setIsActiveBank(
//         bankDetails.data.ACTIVE_STATUS === "ACTIVE" ? true : false
//       );
//       if (bankDetails.data.CHEQUE_FILE_NAME != null) {
//         setChequeFileName(bankDetails.data.CHEQUE_FILE_NAME);
//       }
//       // Find the bank data in bankFromOracleList based on BANK_NAME

//       foundBank = bankFromOracleList.find(
//         (item: BankFromOracle) =>
//           item.value.toString() === bankDetails.data.BANK_PARTY_ID.toString()
//       );

//       console.log(foundBank);
//       setBankPartyId(bankDetails.data.BANK_PARTY_ID.toString());
//       setBranchPartyId(bankDetails.data.BRANCH_PARTY_ID.toString());

//       //   getBranch(foundBank?.value!);
//       getBranch(bankDetails.data.BANK_PARTY_ID.toString());

//       // Set the found bank data as the initial value for the dropdown
//       setBankFromOracle(foundBank!);
//       // Find the branch data in bankFromOracleList based on BANK_NAME

//       // if(siteList){
//       //     const matchedSite: SupplierSiteInterface[] =siteList.filter((site)=>site.ID===bankDetails.data.SITE_ID);
//       //     setSiteId(matchedSite[0].ID);
//       // }
//       setCurrencyCode(bankDetails?.data.CURRENCY_CODE);
//       const foundCurrency = currencyListFromOracle.find(
//         (item: CurrencyFromOracle) =>
//           item.value === bankDetails?.data.CURRENCY_CODE
//       );
//       console.log(foundCurrency);

//       // Set the found bank data as the initial value for the dropdown
//       if (foundCurrency) {
//         setCurrencyFromOracle(foundCurrency!);
//       }
//     }
//   };

//   //   useEffect(() => {
//   //     getBranch(bankDetails?.data.BANK_PARTY_ID.toString()!);
//   //   }, [foundBank]);

//   const handleAccountNameChange = (value: string) => {
//     setAccountName(value);
//   };

//   const handleAccountNumberChange = (value: string) => {
//     setAccountNumber(value);
//   };
//   const handleBankNameChange = (value: string) => {
//     setBankName(value);
//   };

//   const handleBranchNameChange = (value: string) => {
//     setBranchName(value);
//   };

//   const handleSwiftCodeChange = (value: string) => {
//     setSwiftCode(value);
//   };
//   const handleRoutingNumberChange = (value: string) => {
//     setRoutingNumber(value);
//   };

//   const handleSiteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedSiteId = event.target.value;
//     // Perform any necessary actions with the selected site ID
//     // For example, you can update the state or perform an API call
//     setSiteId(parseInt(selectedSiteId));
//   };

//   const handleCheque = (file: File | null) => {
//     if (file) {
//       // Handle the selected file here
//       console.log("Selected file:", file);
//       setCheque(file);
//     } else {
//       // No file selected
//       console.log("No file selected");
//     }
//   };

//   //loading for save button
//   const [saveLoading, setSaveLoading] = useState<boolean>(false);

//   // //loadin for final submit

//   // const [isSubmitLoading,setIsSubmitLoading]=useState<boolean>(false);

//   //back to list page
//   const back = () => {
//     setPage(1);
//     //if bank acc id not null hole korleo hbe
//     setBankAccId(null);
//   };

//   //validation

//   const [bankDetailsError, setBankDetailsError] = useState<{
//     accountName?: string;
//     accountNumber?: string;
//     bankName?: string;
//     branchName?: string;
//     swiftCode?: string;
//     chequeFileName?: string;
//     siteId?: string;
//     routingNumber?: string;
//     currencyCode?: string;
//   }>({});

//   const validate = () => {
//     const erros: {
//       accountName?: string;
//       accountNumber?: string;
//       bankName?: string;
//       branchName?: string;
//       swiftCode?: string;
//       chequeFileName?: string;
//       siteId?: string;
//       routingNumber?: string;
//       currencyCode?: string;
//     } = {};
//     if (!accountName.trim()) {
//       erros.accountName = "Please Enter Account Name.";
//     }
//     if (!accountNumber.trim()) {
//       erros.accountNumber = "Please Enter Account Number.";
//     }
//     if (!bankName.trim()) {
//       erros.bankName = "Please Enter Bank Name.";
//     }
//     if (!branchName.trim()) {
//       erros.branchName = "Please Enter Branch Name.";
//     }
//     // if (!swiftCode.trim() && globalIncorporatedIn !== "Bangladesh") {
//     //   erros.swiftCode = "Please Enter Swift Code.";
//     // }
//     if (!routingNumber.trim() && globalIncorporatedIn === "Bangladesh") {
//       erros.routingNumber = "Please Enter Routing number.";
//     }
//     // if (currencyCode === "") {
//     //   erros.currencyCode = "Please Select Currency.";
//     // }

//     // if (siteId === null || siteId === undefined) {
//     //     erros.siteId = "Please Select a site."
//     // }
//     // if (
//     //   (chequeFileName === null || chequeFileName === "") &&
//     //   cheque === null &&
//     //   globalIncorporatedIn === "Bangladesh"
//     // ) {
//     //   erros.chequeFileName = "Please Select Cheque File.";
//     // }

//     setBankDetailsError(erros);

//     return Object.keys(erros).length === 0;
//   };

//   const [isActiveDisable, setIsActiveDisable] = useState<boolean>(false);

//   const { isRegistrationInStore } = useAuthStore();

//   useEffect(() => {
//     console.log("reg: ", isRegistrationInStore);
//     console.log("pending", isActiveBank);
//   }, []);

//   //for add and update
//   const submit = async () => {
//     console.log("bank sumbit");
//     console.log(bankName);

//     if (validate()) {
//       console.log(bankPartyId);

//       console.log(branchPartyid);

//       try {
//         setSaveLoading(true);

//         setIsBankChangeStore(true);

//         let statusValue;
//         if (isRegistrationInStore === 1 && bankAccId === null) {
//           statusValue = "IN PROCESS";
//         } else {
//           statusValue = pendingToggle ? "ACTIVE" : "DEACTIVE";
//         }

//         const result = await AddUpdateBankDetailsService(
//           regToken!,
//           accountName,
//           accountNumber,
//           bankName,
//           branchName,
//           bankAccId == null ? null : bankAccId,
//           null,
//           routingNumber,
//           cheque!,
//           // isActiveBank ? "ACTIVE" : "DEACTIVE",
//           statusValue,
//           bankPartyId!,
//           branchPartyid!,
//           currencyCode,
//           "N",
//           "N"
//           // swiftCode
//         );
//         console.log(result.data);

//         if (result.data.status === 200) {
//           setSaveLoading(false);
//           setIsActiveDisable(isActiveBank ? false : true);
//           setBankAccLength(bankAccLength + 1);
//           showSuccessToast(result.data.message);
//           if (bankAccId === null) {
//             setTimeout(() => {
//               setPage(1);
//             }, 1200);
//           } else {
//             getBankDetails();
//           }

//           // showSuccessToast(result.data.message);
//           // Do not reset state values here to keep the text field values unchanged.
//         } else {
//           setSaveLoading(false);
//           showErrorToast(result.data.message);
//         }
//       } catch (error) {
//         setSaveLoading(false);
//         showErrorToast("something went wrong");
//       }
//     } else {
//       console.log("validation failed");
//     }
//   };

//   //bank active de active
//   const [isActiveBank, setIsActiveBank] = useState<boolean>(true);
//   const [pendingToggle, setPendingToggle] = useState<boolean | null>(null);

//   const handleActivation = () => {
//     // setIsActiveBank(!isActiveBank);
//     setPendingToggle(!isActiveBank);
//     openWarningModal();
//   };

//   const [isWarningShow, setIsWarningShow] = useState(false);

//   const openWarningModal = () => {
//     setIsWarningShow(true);
//   };

//   // const closeWarningModal = () => {
//   //   setIsWarningShow(false);
//   //   setIsActiveBank(isActiveBank ? false : true);
//   // };

//   const closeWarningModal = (confirm: boolean) => {
//     setIsWarningShow(false);
//     if (confirm && pendingToggle !== null) {
//       setIsActiveBank(pendingToggle); // Apply the pending state change if confirmed
//       submit(); // Call the submit function
//     }
//     setPendingToggle(null); // Reset the pending state
//   };

//   //final submission
//   const [isWarningShowSubmit, setIsWarningShowSubmit] =
//     useState<boolean>(false);

//   const showWarning = async () => {
//     setIsWarningShowSubmit(true);
//   };
//   const closeModalSubmit = () => {
//     setIsWarningShowSubmit(false);
//   };

//   const [isFinalSubmissionLoading, setIsFinalSubmissionLoading] =
//     useState<boolean>(false);

//   const profileUpdateSubmission = async () => {
//     try {
//       const result = await ProfileUpdateSubmissionService(token!);
//       console.log(result.data);

//       if (result.data.status === 200) {
//         showSuccessToast(result.data.message);
//         setSubmissionStatus("SUBMIT");
//         setIsDisable(true);
//       } else {
//         showErrorToast(result.data.message);
//       }
//     } catch (error) {}
//   };

//   //final submission

//   return (
//     <div className="bg-whiteColor">
//       <SuccessToast />
//       <WarningModal
//         isOpen={isWarningShowSubmit}
//         action={profileUpdateSubmission}
//         closeModal={closeModalSubmit}
//         message="Do you want to submit ?"
//         imgSrc="/images/warning.png"
//       />
//       <WarningModal
//         isOpen={isWarningShow}
//         closeModal={() => closeWarningModal(false)}
//         action={() => closeWarningModal(true)}
//         message={`Do you want to ${
//           !isActiveBank ? "Activate" : "Deactivate"
//         } Bank`}
//         imgSrc="/images/warning.png"
//       />

//       {isLoading2 ? (
//         <div className=" w-full h-screen flex justify-center items-center">
//           <LogoLoading />
//         </div>
//       ) : (
//         <>
//           <div className=" w-full flex flex-col items-start space-y-4">
//             <div className=" w-full flex justify-between items-center">
//               <PageTitle titleText="Bank Details" />
//               <CommonButton
//                 onClick={back}
//                 height="h-8"
//                 width="w-24"
//                 titleText="Back"
//                 color="bg-midGreen"
//               />
//             </div>

//             <div className=" w-full flex flex-row justify-between items-start">
//               <div className=" w-full flex flex-col items-start space-y-2">
//                 <div className="flex items-center space-x-1">
//                   <InputLebel titleText={"Account Name"} />
//                   <span className="text-red-500 font-bold">*</span>
//                 </div>
//                 <CommonInputField
//                   type="text"
//                   hint="Account Holder Name"
//                   onChangeData={handleAccountNameChange}
//                   inputRef={accountNameRefs}
//                   disable={isDisable || isActiveDisable}
//                 />
//                 {bankDetailsError.accountName && (
//                   <ValidationError title={bankDetailsError.accountName} />
//                 )}
//               </div>
//               <div className=" w-full flex flex-col items-start space-y-2">
//                 <div className="flex items-center space-x-1">
//                   <InputLebel titleText={"Account Number"} />
//                   <span className="text-red-500 font-bold">*</span>
//                 </div>
//                 <CommonInputField
//                   type="text"
//                   hint="Account Number"
//                   onChangeData={handleAccountNumberChange}
//                   inputRef={accountNumberRefs}
//                   disable={isDisable || isActiveDisable}
//                 />
//                 {bankDetailsError.accountNumber && (
//                   <ValidationError title={bankDetailsError.accountNumber} />
//                 )}
//               </div>
//             </div>

//             <div className=" w-full flex flex-row justify-between items-center">
//               <div className=" w-full flex flex-col items-start space-y-2">
//                 <div className="flex items-center space-x-1">
//                   <InputLebel titleText={"Bank Name"} />
//                   <span className="text-red-500 font-bold">*</span>
//                 </div>
//                 <CommonDropDownSearch
//                   placeholder="Select Bank Name"
//                   onChange={handleBankNameFromOracleChange}
//                   value={bankFromOracle}
//                   options={bankFromOracleList}
//                   width="w-96"
//                   disable={isDisable || isActiveDisable}
//                 />
//                 {/* <InputLebel titleText={'Or'} />
//                                <CommonInputField type='text' hint='Bank Name' onChangeData={handleBankNameChange} inputRef={bankNameRefs} disable={isDisable}/> */}
//                 {bankDetailsError.bankName && (
//                   <ValidationError title={bankDetailsError.bankName} />
//                 )}
//               </div>
//               <div className=" w-full flex flex-col items-start space-y-2">
//                 <div className="flex items-center space-x-1">
//                   <InputLebel titleText={"Branch Name"} />
//                   <span className="text-red-500 font-bold">*</span>
//                 </div>
//                 {/* <CommonInputField
//                   type="text"
//                   hint="Branch Name"
//                   onChangeData={handleBranchNameChange}
//                   inputRef={branchNameRefs}
//                   disable={isDisable}
//                 /> */}
//                 <CommonDropDownSearch
//                   placeholder="Select Branch Name"
//                   onChange={handleBranchNameFromOracleChange}
//                   value={branchFromOracle}
//                   options={branchListFromOracle}
//                   width="w-96"
//                   disable={isDisable || isActiveDisable}
//                 />
//                 {bankDetailsError.branchName && (
//                   <ValidationError title={bankDetailsError.branchName} />
//                 )}
//               </div>
//             </div>
//             <div className=" w-full flex flex-row justify-between items-center">
//               <div className=" w-full flex flex-col items-start space-y-2">
//                 <div className="flex items-center space-x-1">
//                   <InputLebel titleText={"Routing Number / Swift Code"} />
//                   <span className="text-red-500 font-bold">*</span>
//                 </div>
//                 <CommonInputField
//                   type="text"
//                   hint="43634634"
//                   onChangeData={handleRoutingNumberChange}
//                   inputRef={routingNumberRefs}
//                   disable={isDisable || isActiveDisable}
//                 />
//                 {bankDetailsError.routingNumber && (
//                   <ValidationError title={bankDetailsError.routingNumber} />
//                 )}
//               </div>
//               <div className=" w-full flex flex-col items-start space-y-2">
//                 <InputLebel titleText={"Currency"} />
//                 <CommonDropDownSearch
//                   placeholder="Select Currency "
//                   onChange={handleCurrencyFromOracleChange}
//                   value={currencyFromOracle}
//                   options={currencyListFromOracle}
//                   width="w-96"
//                   disable={isDisable || isActiveDisable}
//                 />
//                 {bankDetailsError.currencyCode && (
//                   <ValidationError title={bankDetailsError.currencyCode} />
//                 )}
//               </div>
//             </div>
//             <div className=" w-full flex flex-row justify-between items-start">
//               {/* <div className=" w-full flex flex-col items-start space-y-2">
//                 <InputLebel titleText={"Swift Code"} />
//                 <CommonInputField
//                   type="text"
//                   hint="8745356"
//                   onChangeData={handleSwiftCodeChange}
//                   inputRef={swiftCodeRefs}
//                   disable={isDisable || isActiveDisable}
//                 />
//                 {bankDetailsError.swiftCode && (
//                   <ValidationError title={bankDetailsError.swiftCode} />
//                 )}
//               </div> */}
//               <div className=" w-full flex flex-col items-start space-y-2">
//                 <InputLebel titleText={"Blank Cheque Attachment"} />
//                 {/* <FilePickerInput  onFileSelect={(e) => handleChequeChange(1, e.target.files[0])}/> */}
//                 <FilePickerInput
//                   mimeType=".pdf, image/*"
//                   initialFileName={chequeFileName!}
//                   onFileSelect={handleCheque}
//                   maxSize={5 * 1024 * 1024}
//                   disable={isDisable || isActiveDisable}
//                 />
//                 {bankDetailsError.chequeFileName && (
//                   <ValidationError title={bankDetailsError.chequeFileName} />
//                 )}
//                 {bankDetails!.data.CHEQUE_FILE_NAME !== "" ? (
//                   <a
//                     href={`${bankDetails?.supplier_check_file_path}/${
//                       bankDetails!.data.CHEQUE_FILE_NAME
//                     }`}
//                     target="blank"
//                     className=" w-96 dashedButton my-4 "
//                   >
//                     {" "}
//                     view{" "}
//                   </a>
//                 ) : null}
//               </div>
//             </div>
//             <div className=" w-full flex flex-row justify-between items-start">
//               <div className=" w-full flex flex-col items-start space-y-2">
//                 {bankDetails?.data.ID == null ||
//                 isRegCompelte !== "1" ? null : (
//                   <div className="form-control w-52">
//                     <label className="cursor-pointer label">
//                       <span className="label-text">
//                         {isActiveBank ? "Deactive" : "Active"}
//                       </span>
//                       {/* <input
//                         // disabled={isDisable || isActiveDisable}
//                         onChange={handleActivation}
//                         type="checkbox"
//                         className={`toggle ${
//                           isActiveBank
//                             ? "bg-midGreen border-midGreen"
//                             : "bg-graishColor"
//                         }`}
//                         checked={isActiveBank ? true : false}
//                       /> */}

//                       <input
//                         // disabled={isDisable || isActiveDisable}
//                         type="checkbox"
//                         className="toggle border-gray-300 bg-white"
//                         style={
//                           {
//                             "--tglbg": isActiveBank ? "#00A76F" : "#ececec",
//                           } as React.CSSProperties
//                         }
//                         checked={isActiveBank}
//                         onChange={handleActivation}
//                         // disabled={(siteActiveLengthInStore ?? 0) >= 4}
//                         // disabled={!isActiveSite && (siteActiveLengthInStore ?? 0) >= 4}
//                       />
//                     </label>
//                   </div>
//                 )}
//               </div>
//             </div>
//             {/* <div className=' w-full flex flex-col items-start space-y-2 '>
//                             <InputLebel titleText={'Site Address'} />
//                             <div className=' w-96 h-10 rounded-md  bg-inputBg border-[0.5px] border-borderColor shadow-sm'>
//                                 {
//                                    isLoading
//                                     ?
//                                     <div className=' w-96 flex justify-center items-center'>
//                                         <CircularProgressIndicator/>
//                                     </div>
//                                     :
//                                     <select
//                                     disabled={isDisable}
//                                     value={siteId}  onChange={handleSiteChange} placeholder='Select Site' name="invitationtype" id="" className=' pl-3 w-[374px] h-9 rounded-md bg-inputBg text-hintColor  focus:outline-none'>
//                                     <option value="" disabled selected>Select Site</option>
//                                     {
//                                         siteList.map((e,i)=>(
//                                             <option key={e.ID} value={e.ID} >{e.ADDRESS_LINE1}</option>
//                                         ))
//                                     }

//                                 </select>}

//                             </div>
//                             {
//                                     bankDetailsError.siteId &&
//                                     <ValidationError title={ bankDetailsError.siteId}/>
//                                 }
//                         </div> */}
//           </div>

//           <div className=" w-full flex flex-row space-x-6 justify-end pr-[86px] mt-12">
//             {saveLoading ? (
//               <div className=" w-48 flex justify-center items-center">
//                 <CircularProgressIndicator />
//               </div>
//             ) : (
//               <CommonButton
//                 titleText={"Save & Next"}
//                 onClick={submit}
//                 width="w-48"
//                 disable={isDisable || isActiveDisable}
//               />
//             )}
//             {/*
//             {isRegCompelte === "1" ? (
//               <CommonButton
//                 disable={isDisable}
//                 titleText={"Submit"}
//                 onClick={showWarning}
//                 width="w-48"
//                 color="bg-midGreen"
//               />
//             ) : null} */}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// {
//   /* end of component */
// }
// {
//   /* {
//                 components.length < 2 ?
//                     <div className=' w-full flex flex-row justify-end pr-24 mt-12'>
//                         <p className=' text-graishColor text-sm font-mon'>You can add maximum one more Bank Details.</p>
//                     </div> : null
//             }
//             <div className=' w-full flex flex-row  justify-between items-center mt-2 pr-24 '>
//                 <div className=' h-[0.5px] w-full bg-graishColor'>

//                 </div>
//                 <button onClick={() => { components.length < 2 ? handleAddComponent() : handleRemoveComponent(1) }} className='h-10 w-36 bg-graishColor rounded-md shadow-md justify-center items-center flex flex-row space-x-2'>
//                     <p className=' text-whiteColor text-xl mb-1 font-mon'>{components.length < 2 ? "+" : "-"}</p>
//                     <p className=' text-whiteColor text-sm font-mon'>{components.length < 2 ? "Add more" : "Remove"}</p>
//                 </button>
//             </div> */
// }

import React, { useState, useRef, useEffect, useCallback } from "react";
import InputLebel from "../../common_component/InputLebel";
import CommonInputField from "../../common_component/CommonInputField";
import FilePickerInput from "../../common_component/FilePickerInput";
import CommonButton from "../../common_component/CommonButton";
import ApproveHierarchyTable from "../../common_component/ApproveHierarchyTable";

import {
  BankDetailsInterface,
  SupplierSiteInterface,
} from "../interface/RegistrationInterface";

import { useBankPageContext } from "../context/BankPageContext";

import { useAuth } from "../../login_both/context/AuthContext";
import { isTokenValid } from "../../utils/methods/TokenValidityCheck";
import { useNavigate } from "react-router-dom";
import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";
import ErrorToast, { showErrorToast } from "../../Alerts_Component/ErrorToast";
import SiteListService from "../service/site_creation/SiteListService";
import BankDetailsService from "../service/bank/BankDetailsService";
import PageTitle from "../../common_component/PageTitle";
import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";
import AddUpdateBankDetailsService from "../service/bank/AddUpdateBankDetailsService";
import LogoLoading from "../../Loading_component/LogoLoading";
import ValidationError from "../../Alerts_Component/ValidationError";
import WarningModal from "../../common_component/WarningModal";
import SubmitRegistrationService from "../service/registration_submission/submitRegistrationService";
import HierachyListByModuleService from "../service/approve_hierarchy/HierarchyListByModuleService";
import HierarchyInterface from "../interface/hierarchy/HierarchyInterface";
import convertDateFormat from "../../utils/methods/convertDateFormat";
import SendEmailService from "../../manage_supplier/service/approve_reject/SendEmailService";
import ProfileUpdateSubmissionService from "../service/profile_update_submission/ProfileUpdateSubmissionService";
import countryListWithCode from "../../jsons/countryListWithCode";
import CommonDropDownSearch from "../../common_component/CommonDropDownSearch";
import BankListFromOracleServiceService from "../service/bank/BankListServiceFromOracleService";
import useRegistrationStore from "../store/registrationStore";
import BankWiseBranchListService from "../service/bank/BankWiseBranchListService";
import { red } from "@mui/material/colors";
import CurrencyListService from "../service/bank/CurrencyListService";
import useAuthStore from "../../login_both/store/authStore";
import DocumentFileRemoveService from "../service/declaration/DocumentFileRemoveService";
import DeleteIcon from "../../icons/DeleteIcon";
import fetchFileService from "../../common_service/fetchFileService";

const data = [
  {
    id: 1,
    name: "Ismail Khan",
    date: "12/12/2022",
    action: "Approved",
    remark: "fgfdwu wu fuw fuwgef uuyw gf",
  },
  {
    id: 1,
    name: "Ismail Khan",
    date: "12/12/2022",
    action: "Approved",
    remark: "fgfdwu wu fuw fuwgef uuyw gf",
  },
  {
    id: 1,
    name: "Ismail Khan",
    date: "12/12/2022",
    action: "Approved",
    remark: "fgfdwu wu fuw fuwgef uuyw gf",
  },
];

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

export default function BankDetailsPage() {
  // const [components, setComponents] = useState<JSX.Element[]>([
  //     <BankDetailsPage key="1" />,

  // ]);
  // const handleAddComponent = () => {
  //     const newComponents = [
  //         ...components,
  //         <BankDetailsPage key={components.length + 1} />,
  //     ];
  //     setComponents(newComponents);
  // };

  // const handleRemoveComponent = (index: number) => {
  //     const newComponents = [...components];
  //     newComponents.splice(index, 1);
  //     setComponents(newComponents);
  // };

  const [accountName, setAccountName] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [branchName, setBranchName] = useState<string>("");
  const [swiftCode, setSwiftCode] = useState<string>("");
  const [routingNumber, setRoutingNumber] = useState<string>("");
  const [siteAddress, setSiteAddress] = useState<string>("");
  const [chequeFileName, setChequeFileName] = useState<string | null>(null);
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
    useBankPageContext();
  const {
    regToken,
    submissionStatus,
    setSubmissionStatus,
    isRegCompelte,
    supplierCountryCode,
    token,
  } = useAuth();
  const navigate = useNavigate();

  const { isBankChangeStore, setIsBankChangeStore } = useRegistrationStore();

  const {
    isRegistrationInStore,
    isProfileUpdateStatusInStore,
    isNewInfoStatusInStore,
  } = useAuthStore();

  useEffect(() => {
    console.log("conditionBank: ", isBankChangeStore);
  }, []);

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
    console.log(code);

    try {
      const result = await BankListFromOracleServiceService(regToken!, code);
      console.log(result.data);

      if (result.data.status === 200) {
        // Transform the data
        const transformedData = result.data.data.map((item: BankData) => ({
          value: item.BANK_PARTY_ID,
          label: item.BANK_NAME,
        }));
        console.log(transformedData);

        setBankFromOracleList(transformedData);
        setIsBankLoading(false);

        //   const findedData=transformedData.find((item:any)=>(item.label===bankDetails?.data.BANK_NAME));
        //   setBankFromOracle(findedData);
        //   console.log(findedData);
      } else {
        showErrorToast(result.data.message);
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
      const result = await BankWiseBranchListService(regToken!, partyCode);
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
      const result = await CurrencyListService(regToken!);
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

    const isTokenExpired = !isTokenValid(regToken!);
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

  //site jodi add na kora thake taile errror dekhate hbe

  const getSitelist = async () => {
    try {
      setIsLoading(true);
      if (bankAccId) {
        setIsLoading2(true);
      }
      const result = await SiteListService(regToken!);
      if (result.data.status === 200) {
        setIsLoading(false);
        setSiteList(result.data.data);
        console.log(result.data.data);
      } else {
        setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      showErrorToast("Something went wrong");
    }
  };

  //edit er somoy bank details anbo

  const getBankDetails = async () => {
    try {
      setIsLoading2(true);
      const result = await BankDetailsService(regToken!, bankAccId!);
      console.log(result.data);

      if (result.data.status === 200) {
        setIsLoading2(false);
        setBankDetails(result.data);
        console.log(result.data.data.BANK_PARTY_ID.toString());
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

  // useEffect(() => {
  //   if (
  //     submissionStatus === "DRAFT" ||
  //     bankDetails?.data.ACTIVE_STATUS === "ACTIVE"
  //   ) {
  //     setIsDisable(false);
  //   } else {
  //     setIsDisable(true);
  //   }
  // }, [submissionStatus]);

  // useEffect(() => {
  //   console.log(submissionStatus);
  //   console.log(bankDetails?.data.ACTIVE_STATUS);
  //   console.log(isProfileUpdateStatusInStore);

  //   // Check conditions for disabling
  //   if (isRegCompelte === "1") {
  //     if (
  //       submissionStatus === "SUBMIT"
  //       // ||
  //       // bankDetails?.data.ACTIVE_STATUS !== "ACTIVE" ||
  //       // bankDetails?.data.ACTIVE_STATUS === undefined ||
  //       // isProfileUpdateStatusInStore !== "INCOMPLETE"
  //     ) {
  //       setIsDisable(true);
  //       console.log("validation failed");
  //     } else {
  //       setIsDisable(false);
  //     }
  //   } else {
  //     if (submissionStatus === "SUBMIT") {
  //       setIsDisable(true);
  //     } else {
  //       setIsDisable(false);
  //     }
  //   }
  // }, [submissionStatus, isProfileUpdateStatusInStore, bankDetails]);

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
        setIsActiveDisable(true);
      }

      if (routingNumberRefs.current) {
        routingNumberRefs.current.value = bankDetails.data.ROUTING_SWIFT_CODE;
        setRoutingNumber(bankDetails?.data.ROUTING_SWIFT_CODE);
      }

      console.log(bankDetails.data.ACTIVE_STATUS);

      if (bankDetails.data.ACTIVE_STATUS === "ACTIVE") {
        setIsActiveBank(true);
      }

      if (bankDetails.data.ACTIVE_STATUS === "DEACTIVE") {
        setIsActiveBank(false);
      }
      if (bankDetails.data.ACTIVE_STATUS === "IN PROCESS") {
        setIsInProcess(true);
      }

      // setIsActiveBank(
      //   bankDetails.data.ACTIVE_STATUS === "ACTIVE" ? true : false
      // );
      if (bankDetails.data.CHEQUE_FILE_NAME != null) {
        setChequeFileName(bankDetails.data.CHEQUE_FILE_NAME);
      }
      // Find the bank data in bankFromOracleList based on BANK_NAME

      foundBank = bankFromOracleList.find(
        (item: BankFromOracle) =>
          item.value.toString() === bankDetails.data.BANK_PARTY_ID.toString()
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
      setCurrencyCode(bankDetails?.data.CURRENCY_CODE);
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
      erros.bankName = "Please Enter Bank Name.";
    }
    if (!branchName.trim()) {
      erros.branchName = "Please Enter Branch Name.";
    }
    // if (!swiftCode.trim() && globalIncorporatedIn !== "Bangladesh") {
    //   erros.swiftCode = "Please Enter Swift Code.";
    // }
    if (!routingNumber.trim() && globalIncorporatedIn === "Bangladesh") {
      erros.routingNumber = "Please Enter Routing number.";
    }
    // if (currencyCode === "") {
    //   erros.currencyCode = "Please Select Currency.";
    // }

    // if (siteId === null || siteId === undefined) {
    //     erros.siteId = "Please Select a site."
    // }
    // if (
    //   (chequeFileName === null || chequeFileName === "") &&
    //   cheque === null &&
    //   globalIncorporatedIn === "Bangladesh"
    // ) {
    //   erros.chequeFileName = "Please Select Cheque File.";
    // }

    setBankDetailsError(erros);

    return Object.keys(erros).length === 0;
  };

  const [isActiveDisable, setIsActiveDisable] = useState<boolean>(false);

  useEffect(() => {
    console.log("reg: ", isRegistrationInStore);
    console.log("pending", isActiveBank);
    console.log("proStatus: ", isProfileUpdateStatusInStore);
    console.log("newInfoStatus: ", isNewInfoStatusInStore);
  }, []);

  //for add and update
  const submit = async () => {
    console.log("bank sumbit");
    console.log(accountName);
    console.log(accountNumber);
    console.log(bankName);
    console.log(branchName);
    console.log(bankAccId);
    console.log(bankPartyId);

    console.log(branchPartyid);

    if (validate()) {
      try {
        setSaveLoading(true);

        setIsBankChangeStore(true);

        let statusValue = "";
        if (isRegCompelte === "0") {
          statusValue = "ACTIVE"; //active silo
        } else if (isRegCompelte === "1" && bankAccId === null) {
          statusValue = "IN PROCESS";
        } else if (isActiveBank !== null) {
          statusValue = isActiveBank ? "ACTIVE" : "DEACTIVE";
        } else if (isInProcess) {
          statusValue = "IN PROCESS";
        }
        // if (isRegCompelte === "0") {
        //   statusValue = "ACTIVE";
        // } else if (isRegCompelte === "1" && bankAccId === null) {
        //   statusValue = "IN PROCESS";
        // } else if (
        //   bankDetails!.data.ACTIVE_STATUS === "ACTIVE" &&
        //   isActiveBank
        // ) {
        //   statusValue = "DEACTIVE";
        // } else if (
        //   bankDetails!.data.ACTIVE_STATUS === "DEACTIVE" &&
        //   !isActiveBank
        // ) {
        //   statusValue = "ACTIVE";
        // } else if (
        //   bankDetails!.data.ACTIVE_STATUS === "IN PROCESS" &&
        //   isActiveBank
        // ) {
        //   statusValue = "ACTIVE";
        // } else if (
        //   bankDetails!.data.ACTIVE_STATUS === "IN PROCESS" &&
        //   !isActiveBank
        // ) {
        //   statusValue = "DEACTIVE";
        // } else if (
        //   bankDetails!.data.ACTIVE_STATUS === "IN PROCESS" &&
        //   isActiveBank === null
        // ) {
        //   statusValue = "IN PROCESS";
        // } else if (bankDetails!.data.ACTIVE_STATUS === "" && isActiveBank) {
        //   statusValue = "DEACTIVE";
        // } else if (bankDetails!.data.ACTIVE_STATUS === "" && !isActiveBank) {
        //   statusValue = "ACTIVE";
        // }
        console.log("status value", statusValue);

        const result = await AddUpdateBankDetailsService(
          regToken!,
          accountName,
          accountNumber,
          bankName,
          branchName,
          bankAccId == null ? null : bankAccId,
          null,
          routingNumber,
          cheque!,
          // isActiveBank ? "ACTIVE" : "DEACTIVE",
          statusValue!,
          bankPartyId!,
          branchPartyid!,
          currencyCode,
          "N",
          "N"
          // swiftCode
        );
        console.log(result.data);

        if (result.data.status === 200) {
          setSaveLoading(false);
          setIsActiveDisable(isActiveBank ? false : true);
          setBankAccLength(bankAccLength + 1);
          showSuccessToast(result.data.message);
          setPage(1);
          if (bankAccId === null) {
            setTimeout(() => {
              setPage(1);
            }, 1200);
          } else {
            setPage(1);
          }

          // showSuccessToast(result.data.message);
          // Do not reset state values here to keep the text field values unchanged.
        } else {
          setSaveLoading(false);
          showErrorToast(result.data.message);
        }
      } catch (error) {
        setSaveLoading(false);
        showErrorToast("something went wrong");
      }
    } else {
      console.log("validation failed");
    }
  };

  //bank active de active
  const [isActiveBank, setIsActiveBank] = useState<boolean | null>(null);
  const [isInProcess, setIsInProcess] = useState<boolean>(false);

  const handleActivation = () => {
    setIsActiveBank(!isActiveBank);

    openWarningModal();
  };

  const [isWarningShow, setIsWarningShow] = useState(false);

  const openWarningModal = () => {
    setIsWarningShow(true);
  };

  const closeWarningModal = () => {
    setIsActiveBank(!isActiveBank);
    setIsWarningShow(false);
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

  //delete file

  const [isOpenFileRemoveModal, setIsOpenFileRemoveModal] =
    useState<boolean>(false);
  const [fileToRemove, setFileToRemove] = useState<string | null>(null);
  const [fileTypeToRemove, setFileTypeToRemove] = useState<string | null>(null);

  const handleOpenModal = (fileName: string, fileType: string) => {
    setFileToRemove(fileName);
    setFileTypeToRemove(fileType);
    setIsOpenFileRemoveModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenFileRemoveModal(false);
    setFileToRemove(null);
    setFileTypeToRemove(null);
  };

  const removeCheque = async () => {
    // setIsOpenFileRemoveModal(true);

    setIsLoading(true);
    console.log("fileName function: ", fileToRemove);

    const result = await DocumentFileRemoveService(
      regToken!,
      "XXP2P_SUPPLIER_BANK",
      "CHEQUE_FILE_NAME",
      "CHEQUE_FILE_ORIGINAL_NAME",
      fileToRemove!,
      "chequeFile"
    );

    // if (result.data.status === 200) {
    //   setSealFileName(null);
    //   showSuccessToast(result.data.message);
    // } else {
    //   showErrorToast(result.data.message);
    // }

    if (result.data.status === 200) {
      setChequeFileName(null);
      setBankDetails((prevDetails) => {
        if (!prevDetails) return prevDetails;

        const updatedDetails = {
          ...prevDetails,
          supplier_check_file_path: "",
          data: {
            ...prevDetails.data,
            CHEQUE_FILE_NAME: "",
            CHEQUE_FILE_ORIGINAL_NAME: "",
          },
        };
        setIsOpenFileRemoveModal(false);
        setFileToRemove(null);
        setFileTypeToRemove(null);

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

  //file view

  const [chequeFileLoading, setChequeFileLoading] = useState<boolean>(false);

  const handleViewFile = (
    filePath: string,
    fileName: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const tokenSelection = isRegCompelte === "1" ? token : regToken;
    fetchFileService(filePath, fileName, tokenSelection!, setLoading);
  };

  useEffect(() => {
    // This effect runs when submissionStatus or isActiveBank changes
    console.log(submissionStatus);

    if (submissionStatus === "DRAFT") {
      setIsDisable(false);
    } else {
      setIsDisable(true);
    }
  }, [submissionStatus]);

  return (
    <div className="bg-whiteColor">
      <SuccessToast />
      <WarningModal
        isOpen={isOpenFileRemoveModal}
        closeModal={handleCloseModal}
        action={removeCheque}
        message="Are you sure you want to delete this?"
      />
      {/* <WarningModal
        isOpen={isWarningShowSubmit}
        action={profileUpdateSubmission}
        closeModal={closeModalSubmit}
        message="Do you want to submit ?"
        imgSrc="/images/warning.png"
      /> */}
      <WarningModal
        isOpen={isWarningShow}
        closeModal={closeWarningModal}
        action={submit}
        message={`Do you want to ${
          isActiveBank ? "Activate" : "Deactivate"
        } Bank`}
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
                <div className="flex items-center space-x-1">
                  <InputLebel titleText={"Account Name"} />
                  <span className="text-red-500 font-bold">*</span>
                </div>
                <CommonInputField
                  type="text"
                  hint="Account Holder Name"
                  onChangeData={handleAccountNameChange}
                  inputRef={accountNameRefs}
                  disable={isDisable || isActiveDisable}
                />
                {bankDetailsError.accountName && (
                  <ValidationError title={bankDetailsError.accountName} />
                )}
              </div>
              <div className=" w-full flex flex-col items-start space-y-2">
                <div className="flex items-center space-x-1">
                  <InputLebel titleText={"Account Number"} />
                  <span className="text-red-500 font-bold">*</span>
                </div>
                <CommonInputField
                  type="text"
                  hint="Account Number"
                  onChangeData={handleAccountNumberChange}
                  inputRef={accountNumberRefs}
                  disable={isDisable || isActiveDisable}
                />
                {bankDetailsError.accountNumber && (
                  <ValidationError title={bankDetailsError.accountNumber} />
                )}
              </div>
            </div>

            <div className=" w-full flex flex-row justify-between items-center">
              <div className=" w-full flex flex-col items-start space-y-2">
                <div className="flex items-center space-x-1">
                  <InputLebel titleText={"Bank Name"} />
                  <span className="text-red-500 font-bold">*</span>
                </div>
                <CommonDropDownSearch
                  placeholder="Select Bank Name"
                  onChange={handleBankNameFromOracleChange}
                  value={bankFromOracle}
                  options={bankFromOracleList}
                  width="w-96"
                  disable={isDisable || isActiveDisable}
                />
                {/* <InputLebel titleText={'Or'} />
                               <CommonInputField type='text' hint='Bank Name' onChangeData={handleBankNameChange} inputRef={bankNameRefs} disable={isDisable}/> */}
                {bankDetailsError.bankName && (
                  <ValidationError title={bankDetailsError.bankName} />
                )}
              </div>
              <div className=" w-full flex flex-col items-start space-y-2">
                <div className="flex items-center space-x-1">
                  <InputLebel titleText={"Branch Name"} />
                  <span className="text-red-500 font-bold">*</span>
                </div>
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
                  disable={isDisable || isActiveDisable}
                />
                {bankDetailsError.branchName && (
                  <ValidationError title={bankDetailsError.branchName} />
                )}
              </div>
            </div>
            <div className=" w-full flex flex-row justify-between items-center">
              <div className=" w-full flex flex-col items-start space-y-2">
                <div className="flex items-center space-x-1">
                  <InputLebel titleText={"Routing Number / Swift Code"} />
                  <span className="text-red-500 font-bold">*</span>
                </div>
                <CommonInputField
                  type="text"
                  hint="43634634"
                  onChangeData={handleRoutingNumberChange}
                  inputRef={routingNumberRefs}
                  disable={isDisable || isActiveDisable}
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
                  disable={isDisable || isActiveDisable}
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
                  disable={isDisable || isActiveDisable}
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
                  disable={isDisable || isActiveDisable}
                />
                {bankDetailsError.chequeFileName && (
                  <ValidationError title={bankDetailsError.chequeFileName} />
                )}
                {bankDetails && bankDetails.data.CHEQUE_FILE_NAME !== "" ? (
                  <div className=" flex items-center space-x-6">
                    {chequeFileLoading ? (
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
                            bankDetails?.supplier_check_file_path,
                            bankDetails?.data.CHEQUE_FILE_NAME!,
                            setChequeFileLoading
                          );
                        }}
                        className={`${
                          isRegCompelte === "1" ? "w-96" : "w-80"
                        }  dashedButton my-4 `}
                      >
                        {" "}
                        view{" "}
                      </button>
                    )}
                    {isRegCompelte === "1" ? null : (
                      <button
                        onClick={() =>
                          handleOpenModal(
                            bankDetails?.data.CHEQUE_FILE_NAME!,
                            "chequeFile"
                          )
                        }
                        className=" py-2 px-2 rounded-md shadow-sm border-borderColor border-[0.5px]"
                      >
                        <DeleteIcon />
                      </button>
                    )}
                  </div>
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
                        {isActiveBank ? "Active" : "Deactive"}
                      </span>
                      {/* <input
                        // disabled={isDisable || isActiveDisable}
                        onChange={handleActivation}
                        type="checkbox"
                        className={`toggle ${
                          isActiveBank
                            ? "bg-midGreen border-midGreen"
                            : "bg-graishColor"
                        }`}
                        checked={isActiveBank ? true : false}
                      /> */}

                      <input
                        disabled={isDisable || isInProcess}
                        type="checkbox"
                        className="toggle border-gray-300 bg-white"
                        style={
                          {
                            "--tglbg": isActiveBank ? "#00A76F" : "#ececec",
                          } as React.CSSProperties
                        }
                        checked={isActiveBank ?? false}
                        onChange={handleActivation}
                        // disabled={(siteActiveLengthInStore ?? 0) >= 4}
                        // disabled={!isActiveSite && (siteActiveLengthInStore ?? 0) >= 4}
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

          <div className=" w-full flex flex-row space-x-6 justify-end pr-[86px] mt-12">
            {saveLoading ? (
              <div className=" w-48 flex justify-center items-center">
                <CircularProgressIndicator />
              </div>
            ) : (
              <CommonButton
                titleText={"Save & Next"}
                onClick={submit}
                width="w-48"
                disable={isDisable || isActiveDisable}
              />
            )}
            {/* 
            {isRegCompelte === "1" ? (
              <CommonButton
                disable={isDisable}
                titleText={"Submit"}
                onClick={showWarning}
                width="w-48"
                color="bg-midGreen"
              />
            ) : null} */}
          </div>
        </>
      )}
    </div>
  );
}

{
  /* end of component */
}
{
  /* {
                components.length < 2 ?
                    <div className=' w-full flex flex-row justify-end pr-24 mt-12'>
                        <p className=' text-graishColor text-sm font-mon'>You can add maximum one more Bank Details.</p>
                    </div> : null
            }
            <div className=' w-full flex flex-row  justify-between items-center mt-2 pr-24 '>
                <div className=' h-[0.5px] w-full bg-graishColor'>

                </div>
                <button onClick={() => { components.length < 2 ? handleAddComponent() : handleRemoveComponent(1) }} className='h-10 w-36 bg-graishColor rounded-md shadow-md justify-center items-center flex flex-row space-x-2'>
                    <p className=' text-whiteColor text-xl mb-1 font-mon'>{components.length < 2 ? "+" : "-"}</p>
                    <p className=' text-whiteColor text-sm font-mon'>{components.length < 2 ? "Add more" : "Remove"}</p>
                </button>
            </div> */
}
