// import React, { useState, useRef, useEffect, useCallback, memo } from "react";
// import InputLebel from "../../../common_component/InputLebel";
// import Select from "react-tailwindcss-select";
// import CommonInputField from "../../../common_component/CommonInputField";
// import CommonButton from "../../../common_component/CommonButton";
// import ApproveHierarchyTable from "../../../common_component/ApproveHierarchyTable";
// import CommonDropDownSearch from "../../../common_component/CommonDropDownSearch";
// import { useSiteCreationPageContext } from "../../context/SiteCreationPageContext";
// import { useAuth } from "../../../login_both/context/AuthContext";
// import SiteDetailsService from "../../service/site_creation/SiteDetailsService";
// import {
//   BankInterface,
//   SupplierSiteInterface,
// } from "../../interface/RegistrationInterface";
// import SuccessToast, {
//   showSuccessToast,
// } from "../../../Alerts_Component/SuccessToast";
// import ErrorToast, {
//   showErrorToast,
// } from "../../../Alerts_Component/ErrorToast";
// import { useNavigate } from "react-router-dom";
// import { isTokenValid } from "../../../utils/methods/TokenValidityCheck";

// import countries from "../../../jsons/countries";
// import LogoLoading from "../../../Loading_component/LogoLoading";
// import AddUpdateSiteService from "../../service/site_creation/AddUpdateSiteService";
// import ValidationError from "../../../Alerts_Component/ValidationError";
// import PageTitle from "../../../common_component/PageTitle";
// import TextInputField from "../../../common_component/TextInputFieldTwo";
// import CircularProgressIndicator from "../../../Loading_component/CircularProgressIndicator";

// import { OrganizationInterface } from "../../../role_access/interface/OrganizationInterface";
// import OrganizationListService from "../../../role_access/service/OrganizationListService";
// import OrgListForSupplierService from "../../service/site_creation/OrgListForSupplierService";
// import AddOrgToSiteService from "../../service/site_creation/AddOrgToSiteService";
// import WarningModal from "../../../common_component/WarningModal";
// import BankListService from "../../service/bank/BankListService";
// import AddbankToSiteService from "../../service/site_creation/AddbankToSiteService";
// import BankListInSiteService from "../../service/site_creation/BankListInSiteService";
// import { Item } from "@radix-ui/react-select";
// import DeleteBankFromSiteService from "../../service/site_creation/DeletebankFromSiteService";
// import SubmitRegistrationService from "../../service/registration_submission/submitRegistrationService";
// import HierarchyInterface from "../../interface/hierarchy/HierarchyInterface";
// import HierachyListByModuleService from "../../service/approve_hierarchy/HierarchyListByModuleService";
// import SendEmailService from "../../../manage_supplier/service/approve_reject/SendEmailService";
// import ProfileUpdateSubmissionService from "../../service/profile_update_submission/ProfileUpdateSubmissionService";
// import CountryListFromOracleService from "../../service/basic_info/CountryListFromOracle";
// import useRegistrationStore from "../../store/registrationStore";
// import useAuthStore from "../../../login_both/store/authStore";

// const bd: Country = { value: "BD", label: "Bangladesh" };

// interface Country {
//   value: string;
//   label: string;
// }

// interface CountryApi {
//   VALUE: string;
//   LABEL: string;
// }

// interface Bank {
//   value: string;
//   label: string;
// }

// export default function SiteCreationPage() {
//   const addressLine1Ref = useRef<HTMLInputElement | null>(null);
//   const addressLine2Ref = useRef<HTMLInputElement | null>(null);
//   const cityRef = useRef<HTMLInputElement | null>(null);
//   const zipRef = useRef<HTMLInputElement | null>(null);
//   const phoneRef = useRef<HTMLInputElement | null>(null);
//   const emailRef = useRef<HTMLInputElement | null>(null);
//   const [animal, setAnimal] = useState(null);

//   const [addressLine1, setAddressLine1] = useState("");
//   const [addressLine2, setAddressLine2] = useState("");
//   const [city, setCity] = useState("");
//   const [zip, setZip] = useState("");
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//   const [createdSiteId, setCreatedSiteId] = useState<number | null>(null);

//   const [organizationList, setOrganizationList] = useState<
//     OrganizationInterface[] | []
//   >([]);
//   const [selectedOrganizationList, setSelectedOrganizationList] = useState<
//     OrganizationInterface[] | []
//   >([]);

//   const { siteListInStore, isSiteChangeStore, setIsSiteChangeStore } =
//     useRegistrationStore();

//   useEffect(() => {
//     console.log("site store: ", isSiteChangeStore);
//   }, []);

//   console.log("render out side any hook");

//   const [siteDetails, setSiteDetails] = useState<SupplierSiteInterface | null>(
//     null
//   );

//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [submitLoading, setSubmitLoading] = useState<boolean>(false);

//   //countries
//   const [countryList, setCountryList] = useState<Country | null>(null);
//   const [country, setCountry] = useState("");

//   const [countryListFromOracle, setCountryListFromOracle] = useState<
//     Country[] | []
//   >([]);

//   const countryGet = async () => {
//     try {
//       const result = await CountryListFromOracleService(regToken!);
//       console.log(result.data);

//       if (result.data.status === 200) {
//         const transformedData = result.data.data.map((item: CountryApi) => ({
//           value: item.VALUE,
//           label: item.LABEL,
//         }));
//         setCountryListFromOracle(transformedData);
//       } else {
//         showErrorToast(result.data.message);
//       }
//     } catch (error) {
//       showErrorToast("Something went wrong");
//     }
//   };

//   const handleChange = (value: any) => {
//     // console.log("value:", value);
//     setCountryList(value);
//     if (value !== null) {
//       setCountry(value.value);
//     } else if (value == null && country != null) {
//       setCountry("");
//       console.log("cleared");
//     }
//   };
//   //countries

//   const { siteId, setPage, setSiteId, siteLength, setSiteLength } =
//     useSiteCreationPageContext();
//   const { regToken, submissionStatus, isRegCompelte, setSubmissionStatus } =
//     useAuth();

//   const navigate = useNavigate();

//   //token validation
//   useEffect(() => {
//     console.log("render");
//     console.log(siteId);

//     const isTokenExpired = !isTokenValid(regToken!);
//     if (isTokenExpired) {
//       localStorage.removeItem("regToken");
//       showErrorToast("Please Login Again..");
//       setTimeout(() => {
//         navigate("/");
//       }, 1200);
//     } else {
//       console.log("excute in else");
//       setCountryList(bd);
//       setCountry(bd.value);
//       getOrganization();
//       GetBankListFromOracle();
//       getApproverHierachy();
//       countryGet();

//       if (siteId !== null) {
//         getSiteDetails();
//         getBankListFromSite(siteId);
//       }
//     }
//   }, []);
//   //token validation

//   // re-render on set data

//   useEffect(() => {
//     console.log("render");
//     if (siteDetails) {
//       setData();
//     }
//   }, [siteDetails, countryListFromOracle]);

//   //re-render on set data

//   //disabling field
//   const [isDisable, setIsDisable] = useState<boolean>(false);
//   //disabling field

//   //set disable

//   const [isActiveDisable, setIsActiveDisable] = useState<boolean>(false);

//   useEffect(() => {
//     console.log(submissionStatus);

//     if (submissionStatus === "DRAFT") {
//       setIsDisable(false);
//     } else {
//       setIsDisable(true);
//     }
//   }, [submissionStatus]);

//   // //set disable

//   const getSiteDetails = async () => {
//     setIsLoading(true);
//     try {
//       const result = await SiteDetailsService(regToken!, siteId!);
//       if (result.data.status === 200) {
//         setSiteDetails(result.data.data);
//         console.log("siteDetails", result.data.data);
//         setIsLoading(false);
//       } else {
//         setIsLoading(false);
//         showErrorToast(result.data.message);
//       }
//     } catch (error) {
//       setIsLoading(false);
//       showErrorToast("Something went wrong");
//     }
//   };

//   //get org
//   //slected org list
//   const [selectedOrgList, setSelectedOrgList] = useState<
//     OrganizationInterface[]
//   >([]);
//   const [selectedOrgList2, setSelectedOrgList2] = useState<
//     OrganizationInterface[]
//   >([]);

//   // const getOrganization = async () => {
//   //     const result = await OrgListForSupplierService(regToken!,siteId);
//   //     if (result.data.status === 200) {
//   //         setOrganizationList(result.data.data);
//   //        // Explicitly provide the type for 'org' using the OrganizationInterface
//   //     const updatedSelectedOrgList = result.data.data.filter((org: OrganizationInterface) => org.IS_ASSOCIATED === 1);
//   //     setPreSelectedOrgList(updatedSelectedOrgList);
//   //     }

//   // }

//   const getOrganization = async () => {
//     console.log(siteId);

//     const result = await OrgListForSupplierService(regToken!, siteId);

//     if (result.data.status === 200) {
//       setOrganizationList(result.data.data);
//       const selected = result.data.data.filter(
//         (item: OrganizationInterface) => item.IS_ASSOCIATED === 1
//       );
//       console.log(selected);

//       setSelectedOrganizationList(selected);
//       if (selected.length === result.data.data.length) {
//         setIsSelectAll(true);
//       }
//     }
//   };

//   //org grant revoke

//   // org grant revoke
//   const handleGrantRevokeOrganization = (orgIndex: number) => {
//     const updatedOrganizationList = [...organizationList];
//     updatedOrganizationList[orgIndex].IS_ASSOCIATED =
//       updatedOrganizationList[orgIndex].IS_ASSOCIATED === 1 ? 0 : 1;
//     setOrganizationList(updatedOrganizationList);
//     const updatedSelectedOrgList = updatedOrganizationList.filter(
//       (org) => org.IS_ASSOCIATED === 1
//     );

//     setSelectedOrgList(updatedSelectedOrgList);
//   };

//   const addOrgToSelectedSitelist = (org: OrganizationInterface) => {
//     selectedOrgList2.push(org);
//   };

//   //  const handleGrantRevokeOrganization = (orgIndex: number) => {
//   //     const updatedOrganizationList = [...organizationList];
//   //     updatedOrganizationList[orgIndex].IS_ASSOCIATED = updatedOrganizationList[orgIndex].IS_ASSOCIATED === 1 ? 0 : 1;
//   //     setOrganizationList(updatedOrganizationList);
//   //     const updatedSelectedOrgList = updatedOrganizationList.filter(org => org.IS_ASSOCIATED === 1);
//   //     setSelectedOrgList(updatedSelectedOrgList);

//   //     // grantRevokeOrganization(updatedOrganizationList[orgIndex].ORGANIZATION_ID, updatedOrganizationList[orgIndex].SHORT_CODE, updatedOrganizationList[orgIndex].NAME);
//   // }

//   const setData = () => {
//     if (
//       addressLine1Ref.current &&
//       addressLine2Ref.current &&
//       cityRef.current &&
//       zipRef.current &&
//       phoneRef.current &&
//       emailRef.current
//     ) {
//       addressLine1Ref.current.value = siteDetails?.ADDRESS_LINE1 || "";
//       setAddressLine1(siteDetails?.ADDRESS_LINE1!);
//       addressLine2Ref.current.value = siteDetails?.ADDRESS_LINE2 || "";
//       setAddressLine2(siteDetails?.ADDRESS_LINE2!);
//       cityRef.current.value = siteDetails?.CITY_STATE || "";
//       setCity(siteDetails?.CITY_STATE!);
//       if (
//         siteDetails?.ZIP_CODE !== null &&
//         siteDetails?.ZIP_CODE !== undefined
//       ) {
//         zipRef.current.value = siteDetails?.ZIP_CODE.toString() || "";
//         setZip(siteDetails?.ZIP_CODE.toString()!);
//       }

//       phoneRef.current.value = siteDetails?.MOBILE_NUMBER || "";
//       console.log("mobile", siteDetails?.MOBILE_NUMBER);

//       setPhone(siteDetails?.MOBILE_NUMBER!);
//       emailRef.current.value = siteDetails?.EMAIL || "";
//       setEmail(siteDetails?.EMAIL!);
//       console.log(siteDetails?.ACTIVE_STATUS);
//       if (siteDetails?.ACTIVE_STATUS === "DEACTIVE") {
//         setIsActiveDisable(true);
//       }

//       setIsActiveSite(siteDetails?.ACTIVE_STATUS === "ACTIVE" ? true : false);

//       const selectedCountry = countryListFromOracle.find(
//         (option) => option.value === siteDetails?.COUNTRY!
//       );
//       if (selectedCountry) {
//         setCountryList(selectedCountry);
//         setCountry(selectedCountry.value);
//       } else {
//         setCountryList(null);
//       }
//     }
//   };

//   // const setData = () => {
//   //     setAddressLine1(siteDetails?.ADDRESS_LINE1 || "");
//   //     setAddressLine2(siteDetails?.ADDRESS_LINE2 || "");
//   //     setCity(siteDetails?.CITY_STATE || "");
//   //     setZip(siteDetails?.ZIP_CODE.toString() || "");
//   //     setPhone(siteDetails?.MOBILE_NUMBER || "");
//   //     setEmail(siteDetails?.EMAIL || "");

//   //     const selectedCountry = countries.find(option => option.value === siteDetails?.COUNTRY!);
//   //     if (selectedCountry) {
//   //         setCountryList(selectedCountry);
//   //         setCountry(selectedCountry.value);
//   //     } else {
//   //         setCountryList(null);
//   //     }
//   // };

//   // const handleAddressLine1Change = (value: string) => {
//   //     setAddressLine1(value);
//   //     if (addressLine1Ref.current) {
//   //         addressLine1Ref.current.value = value;
//   //     }
//   // }

//   const [errorMessage, setErrorMessage] = useState<string>("");

//   // const handleAddressLine1Change = (value: string) => {

//   //   if(siteId)

//   //   setAddressLine1(value);

//   //   // Convert input value to lowercase and remove extra spaces
//   //   const lowerCaseValue = value.toLowerCase().replace(/\s+/g, '');
//   //   // Set the input value
//   //   // setAddressLine1(lowerCaseValue);
//   //   // Check if the value exists in the siteListInStore
//   //   if (siteListInStore.includes(lowerCaseValue)) {
//   //     setErrorMessage('Site name is already taken');
//   //   } else {
//   //     setErrorMessage('');
//   //   }
//   // };

//   const handleAddressLine1Change = (value: string) => {
//     // If siteId is present, do not allow editing
//     if (siteId) {
//       return;
//     }

//     // Convert input value to lowercase and remove extra spaces for comparison
//     const lowerCaseValue = value.toLowerCase().replace(/\s+/g, "");

//     // Check if the converted value exists in the siteListInStore
//     if (siteListInStore.includes(lowerCaseValue)) {
//       setErrorMessage("Site name is already taken");
//     } else {
//       setErrorMessage("");
//       // Save the original input value if it is not a duplicate
//       setAddressLine1(value);
//     }
//   };

//   const handleAdressLine2Change = (value: string) => {
//     setAddressLine2(value);
//   };

//   const handleCityChange = (value: string) => {
//     setCity(value);
//   };
//   const handleZipChange = (value: string) => {
//     setZip(value);
//   };
//   const handlePhoneChange = (value: string) => {
//     setPhone(value);
//   };
//   const handleEmailChange = (value: string) => {
//     setEmail(value);
//   };

//   //validation

//   const [siteError, setSiteError] = useState<{
//     country?: string;
//     addressLine1?: string;
//     addressLine2?: string;
//     city?: string;
//     zip?: string;
//     phone?: string;
//     email?: string;
//     selectedOrgList?: string;
//   }>({});

//   const validate = () => {
//     const errors: {
//       country?: string;
//       addressLine1?: string;
//       addressLine2?: string;
//       city?: string;
//       zip?: string;
//       phone?: string;
//       email?: string;
//       selectedOrgList?: string;
//     } = {};

//     if (country === "") {
//       errors.country = "Please Select Country";
//     }
//     if (!addressLine1.trim()) {
//       errors.addressLine1 = "Please Enter Site Name";
//     }
//     if (!addressLine2.trim()) {
//       errors.addressLine2 = "Please Enter Site Address";
//     }
//     // if (!city.trim()) {
//     //   errors.city = "Please Enter City";
//     // }
//     // if (!email.trim()) {
//     //   errors.email = "Please Enter Email";
//     // }
//     // if (!phone.trim()) {
//     //   errors.phone = "Please Enter Phone";
//     // }
//     // if (!zip.trim()) {
//     //   errors.zip = "Please Enter Zip";
//     // }
//     if (selectedOrgList.length === 0 && isRegCompelte !== "1") {
//       errors.selectedOrgList = "Please select at lest one organization";
//     }

//     setSiteError(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const { isRegistrationInStore } = useAuthStore();

//   useEffect(() => {
//     console.log("reg", isRegistrationInStore);
//     console.log("siteId", siteId);
//   }, []);

//   const submit = async () => {
//     // if (validate()) {
//     //     console.log(addressLine1Ref.current?.value);
//     //     const result = await AddUpdateSiteService(regToken!, siteId!, country, addressLine1, addressLine2, city, email, phone, zip);
//     //     showErrorToast(result.data.message);
//     // }
//     // else {
//     //     console.log(addressLine1Ref.current?.value);
//     // }

//     // if (validate()) {

//     // }
//     // else{
//     //     console.log('failed validation');

//     // }
//     // console.log(viewBankList);
//     // console.log(selectedBankList?.length);

//     if (validate()) {
//       try {
//         // Check if at least one organization is selected
//         const selectedOrgCount = organizationList.filter(
//           (e) => e.IS_ASSOCIATED === 1
//         ).length;
//         if (selectedOrgCount === 0) {
//           showErrorToast("Please select at least one organization.");
//           return;
//         }

//         setSubmitLoading(true);
//         console.log(addressLine1);

//         let statusValue;
//         if (isRegistrationInStore === 1 && siteId === null) {
//           statusValue = "IN PROCESS";
//         } else {
//           statusValue = isActiveSite ? "ACTIVE" : "DEACTIVE";
//         }

//         setIsSiteChangeStore(true);

//         const result = await AddUpdateSiteService(
//           regToken!,
//           siteId!,
//           country,
//           addressLine1,
//           addressLine2,
//           city,
//           email,
//           phone,
//           zip,
//           // isActiveSite ? "ACTIVE" : "DEACTIVE"
//           statusValue
//         );
//         console.log(result.data);

//         if (result.data.status === 200) {
//           setSubmitLoading(false);
//           setIsActiveDisable(isActiveSite ? false : true);
//           setSiteLength(siteLength + 1);
//           showSuccessToast(result.data.message);
//           AddOrgToSite(siteId == null ? result.data.id : siteId);
//           if (siteId != null) {
//             deleteBankFromSite();
//           }
//           addBankToSite(siteId == null ? result.data.id : siteId);

//           // if (siteId === null) {
//           //     setTimeout(() => {
//           //         setPage(1);
//           //     }, 1200);
//           // }
//           // else {
//           //     getSiteDetails();
//           // }

//           // showSuccessToast(result.data.message);
//           // Do not reset state values here to keep the text field values unchanged.
//         } else {
//           setSubmitLoading(false);
//           showErrorToast(result.data.message);
//         }
//       } catch (error) {
//         setSubmitLoading(false);
//         showErrorToast("something went wrong");
//       }
//     } else {
//       console.log("validate hoi nai");
//     }
//   };

//   const getBankListFromSite = async (createdId: number) => {
//     try {
//       const result = await BankListInSiteService(regToken!, createdId);
//       console.log(result.data.data.length);

//       if (result.data.status === 200) {
//         const transformedData = result.data.data.map((item: any) => ({
//           value: item.ID,
//           label: item.BANK_NAME,
//         }));
//         setViewBankList(transformedData);
//         setSelectedBankList(transformedData);
//         setSelectedBankList2(transformedData);
//       }
//     } catch (error) {
//       showErrorToast("Something went wrong");
//     }
//   };

//   const addBankToSite = async (createdId: number) => {
//     try {
//       for (let i = 0; i < selectedBankList?.length!; i++) {
//         const result = await AddbankToSiteService(
//           regToken!,
//           createdId,
//           parseInt(selectedBankList![i].value)
//         );
//         console.log(result.data);
//       }
//     } catch (error) {
//       setSubmitLoading(false);
//       showErrorToast("something went wrong");
//     }
//   };

//   const deleteBankFromSite = async () => {
//     const notFoundList: Bank[] = selectedBankList2!.filter((bank2) => {
//       // Check if the bank is not present in selectedBankList
//       return !selectedBankList!.some(
//         (bank1) => bank1.value === bank2.value && bank1.label === bank2.label
//       );
//     });
//     console.log(notFoundList);

//     // Update state with the not found list
//     // setSelectedBankList(notFoundList);
//     for (let i = 0; i < notFoundList.length; i++) {
//       const result = await DeleteBankFromSiteService(
//         regToken!,
//         parseInt(notFoundList[i].value)
//       );
//       console.log(result.data);
//     }
//   };

//   const [isAddLoading, setIsAddLoading] = useState(false);

//   const AddOrgToSite = async (createdId: number) => {
//     console.log(createdId);
//     console.log(selectedOrgList.length);

//     try {
//       for (let i = 0; i < selectedOrgList2.length; i++) {
//         const result = await AddOrgToSiteService(
//           regToken!,
//           createdId,
//           selectedOrgList2[i]
//         );
//       }
//       if (siteId === null) {
//         setTimeout(() => {
//           setPage(1);
//         }, 1200);
//       } else {
//         getSiteDetails();
//       }
//     } catch (error) {
//       setSubmitLoading(false);
//       showErrorToast("something went wrong");
//     }
//   };

//   //back to list

//   const backToList = () => {
//     setPage(1);
//     setSiteId(null);
//   };

//   //active deactive site

//   const [isActiveSite, setIsActiveSite] = useState<boolean>(true);

//   const handleActivation = () => {
//     setIsActiveSite(!isActiveSite);
//     openWarningModal();
//   };

//   const [isWarningShow, setIsWarningShow] = useState(false);
//   const openWarningModal = () => {
//     setIsWarningShow(true);
//   };
//   const closeWarningModal = () => {
//     setIsWarningShow(false);
//     setIsActiveSite(isActiveSite ? false : true);
//   };

//   // const doActiveDeactive=()=>{
//   //     submit();
//   // }

//   const [isBankLoading, setIsBankLoading] = useState<boolean>(false);

//   const [bankList, setBankList] = useState<Bank[] | []>([]);
//   const [viewBankList, setViewBankList] = useState<null>(null);
//   const [selectedBankList, setSelectedBankList] = useState<Bank[] | null>(null);
//   const [selectedBankList2, setSelectedBankList2] = useState<Bank[] | null>(
//     null
//   );

//   const handleBankChange = (value: any) => {
//     // console.log("value:", value);
//     setViewBankList(value);
//     if (value !== null) {
//       setSelectedBankList(value);
//       console.log(value);
//     } else if (value == null && viewBankList != null) {
//       setSelectedBankList([]); //country silo
//       console.log("cleared");
//     }
//   };

//   const GetBankListFromOracle = async () => {
//     try {
//       setIsBankLoading(true);
//       const result = await BankListService(regToken!);
//       console.log(result.data.data.length);

//       if (result.data.status === 200) {
//         const transformedData = result.data.data.map((item: BankInterface) => ({
//           value: item.ID,
//           label: item.BANK_NAME,
//         }));
//         setBankList(transformedData);
//         setIsBankLoading(false);
//       } else {
//         setIsBankLoading(false);
//         showErrorToast(result.data.message);
//       }
//     } catch (error) {
//       //handle error
//       setIsBankLoading(false);
//       showErrorToast("Something went wrong");
//     }
//   };

//   //hierarchy and submit

//   //is warning show

//   //hierarchy
//   const [hierarchLoading, setHierarchyLoading] = useState<boolean>(false);
//   const [hierarchyUserProfilePicturePath, setHierarchyUserProfilePicturePath] =
//     useState<string>("");
//   const [hierarchyList, setHierarchyList] = useState<HierarchyInterface[] | []>(
//     []
//   );
//   const getApproverHierachy = async () => {
//     const decodedToken = decodeJWT(regToken!);

//     // Extract USER_ID from the decoded payload
//     const userId = decodedToken?.decodedPayload?.USER_ID;
//     console.log(userId);

//     try {
//       setHierarchyLoading(true);
//       const result = await HierachyListByModuleService(
//         regToken!,
//         userId,
//         isRegCompelte === "1" ? "Profile Update" : "Supplier Approval"
//       );
//       if (result.data.status === 200) {
//         setHierarchyLoading(false);
//         setHierarchyUserProfilePicturePath(result.data.profile_pic);
//         setHierarchyList(result.data.data);
//       } else {
//         setHierarchyLoading(false);
//         showErrorToast(result.data.message);
//       }
//     } catch (error) {
//       setHierarchyLoading(false);
//       showErrorToast("Something went wrong");
//     }
//   };

//   const decodeJWT = (token: string) => {
//     try {
//       // Split the token into header, payload, and signature
//       const [encodedHeader, encodedPayload] = token.split(".");

//       // Function to decode base64url
//       const base64urlDecode = (str: string) => {
//         // Replace '-' with '+', '_' with '/', and pad the string with '=' to make it base64 compliant
//         str = str.replace(/-/g, "+").replace(/_/g, "/");
//         while (str.length % 4) {
//           str += "=";
//         }
//         return window.atob(str);
//       };

//       // Decode base64url-encoded header and payload
//       const decodedHeader = JSON.parse(base64urlDecode(encodedHeader));
//       const decodedPayload = JSON.parse(base64urlDecode(encodedPayload));

//       // Log the decoded header and payload
//       console.log("Decoded Header:", decodedHeader);
//       console.log("Decoded Payload:", decodedPayload);

//       // Ensure the decoded payload has the expected structure
//       if (decodedPayload && decodedPayload.hasOwnProperty("USER_ID")) {
//         const userId = decodedPayload.USER_ID;
//         const isNewUser = decodedPayload.IS_NEW_USER;
//         const approval = decodedPayload.APPROVAL_STATUS;
//         const submissionStatus = decodedPayload.SUBMISSION_STATUS;
//         const isRegComplete = decodedPayload.IS_REG_COMPLETE;
//         const buyerId = decodedPayload.BUYER_ID;
//         const isWlcSwn = decodedPayload.IS_WLC_MSG_SHOWN;
//         const wlcMessage = decodedPayload.WELCOME_MSG;

//         return {
//           decodedHeader,
//           decodedPayload,
//           userId,
//           isNewUser,
//           approval,
//           submissionStatus,
//           isRegComplete,
//           buyerId,
//           isWlcSwn,
//           wlcMessage,
//         };
//       } else {
//         console.error(
//           "Error: Decoded payload does not have the expected structure."
//         );
//         return null;
//       }
//     } catch (error) {
//       console.error("Error decoding JWT:", error);
//       return null;
//     }
//   };

//   // const decodeJWT = (token: string) => {
//   //   try {
//   //     // Split the token into header, payload, and signature (assuming they are separated by dots)
//   //     const [encodedHeader, encodedPayload] = token.split(".");

//   //     // Decode base64-encoded header and payload
//   //     const decodedHeader = JSON.parse(window.atob(encodedHeader));
//   //     const decodedPayload = JSON.parse(window.atob(encodedPayload));

//   //     // Log the decoded header and payload
//   //     console.log("Decoded Header:", decodedHeader);
//   //     console.log("Decoded Payload:", decodedPayload);

//   //     // Make sure that the decoded payload has the expected structure
//   //     if (decodedPayload && decodedPayload.hasOwnProperty("USER_ID")) {
//   //       const userId = decodedPayload.USER_ID;
//   //       const isNewUser = decodedPayload.IS_NEW_USER;
//   //       const approval = decodedPayload.APPROVAL_STATUS;
//   //       const submissionStatus = decodedPayload.SUBMISSION_STATUS;
//   //       const isRegComplete = decodedPayload.IS_REG_COMPLETE;
//   //       // console.log(`userId: ${userId}`);
//   //       return {
//   //         decodedHeader,
//   //         decodedPayload,
//   //         userId,
//   //         isNewUser,
//   //         approval,
//   //         submissionStatus,
//   //         isRegComplete,
//   //       };
//   //     } else {
//   //       console.error(
//   //         "Error: Decoded payload does not have the expected structure."
//   //       );
//   //       return null;
//   //     }
//   //   } catch (error) {
//   //     console.error("Error decoding JWT:", error);
//   //     return null;
//   //   }
//   // };

//   const [isWarningShowSubmit, setIsWarningShowSubmit] =
//     useState<boolean>(false);

//   const showWarning = async () => {
//     setIsWarningShowSubmit(true);
//   };
//   const closeModal = () => {
//     setIsWarningShowSubmit(false);
//   };

//   const [isFinalSubmissionLoading, setIsFinalSubmissionLoading] =
//     useState<boolean>(false);

//   const finalSubmission = async () => {
//     submit();
//     closeModal();
//     setIsFinalSubmissionLoading(true);
//     try {
//       const result = await SubmitRegistrationService(regToken!);
//       if (result.data.status === 201) {
//         setSubmissionStatus("SUBMIT"); //SUBMIT
//         setIsFinalSubmissionLoading(false);
//         showSuccessToast(result.data.message);
//         setIsDisable(true);
//       } else {
//         setIsFinalSubmissionLoading(false);
//         showErrorToast(result.data.message);
//       }
//     } catch (error) {
//       setIsFinalSubmissionLoading(false);
//       showErrorToast("Something went wrong.");
//     }
//     // sendEmail();  //hide korlam back theke felbe tai
//   };

//   const sendEmail = async () => {
//     try {
//       for (let i = 0; i < hierarchyList.length; i++) {
//         if (hierarchyList[i].STAGE_LEVEL === 1) {
//           const result = await SendEmailService(
//             regToken!,
//             hierarchyList[i].EMAIL_ADDRESS,
//             hierarchyList[i].APPROVER_FULL_NAME,
//             "Supplier Approval Request",
//             ", Supplier requested for registration."
//           );
//         }
//       }
//     } catch (error) {
//       showErrorToast("Email send Failed");
//     }
//   };

//   //profile update submission

//   const profileUpdateSubmission = async () => {
//     try {
//       const result = await ProfileUpdateSubmissionService(regToken!);
//       if (result.data.status === 200) {
//         showSuccessToast(result.data.message);
//         setSubmissionStatus("SUBMIT");
//         setIsDisable(true);
//       } else {
//         showErrorToast(result.data.message);
//       }
//     } catch (error) {}
//   };

//   const [isSelectedAll, setIsSelectAll] = useState<boolean>(false);
//   const selectAll = () => {
//     setIsSelectAll(true);

//     for (let i = 0; i < organizationList.length; i++) {
//       if (organizationList[i].IS_ASSOCIATED === 1) {
//         selectedOrgList.push(organizationList[i]);
//       } else {
//         organizationList[i].IS_ASSOCIATED = 1;
//         selectedOrgList.push(organizationList[i]);
//         selectedOrgList2.push(organizationList[i]);
//       }
//     }
//     console.log(organizationList.length);

//     console.log(selectedOrgList.length);
//   };
//   const unselectAll = () => {
//     setIsSelectAll(false);
//     for (let i = 0; i < organizationList.length; i++) {
//       if (organizationList[i].IS_ASSOCIATED === 0) {
//         selectedOrgList.push(organizationList[i]);
//       } else {
//         organizationList[i].IS_ASSOCIATED = 0;
//         selectedOrgList.push(organizationList[i]);
//         selectedOrgList2.push(organizationList[i]);
//       }
//     }
//   };

//   return (
//     <div className="bg-whiteColor">
//       <SuccessToast />
//       <WarningModal
//         isOpen={isWarningShowSubmit}
//         action={
//           isRegCompelte === "1" ? profileUpdateSubmission : finalSubmission
//         }
//         closeModal={closeModal}
//         message="Do you want to submit ?"
//         imgSrc="/images/warning.png"
//       />
//       <WarningModal
//         isOpen={isWarningShow}
//         closeModal={closeWarningModal}
//         action={submit}
//         message={`Do you want to ${
//           !isActiveSite ? "Deactivate" : "Activate"
//         } Site`}
//         imgSrc="/images/warning.png"
//       />
//       {isLoading ? (
//         <div className=" w-full h-screen flex justify-center">
//           <LogoLoading />
//         </div>
//       ) : (
//         <div className=" mb-20 w-full flex flex-col items-start space-y-4">
//           <div className=" w-full flex  justify-between items-center">
//             <PageTitle titleText={"Site Creation"} />
//             {siteLength === 0 ? null : (
//               <CommonButton
//                 onClick={backToList}
//                 titleText="Back"
//                 width="w-24"
//                 height="h-8"
//                 color="bg-midGreen"
//               />
//             )}
//           </div>

//           <div className=" w-full flex flex-row justify-between">
//             <div className=" flex flex-col items-start space-y-2">
//               <div className="flex items-center space-x-1">
//                 <InputLebel titleText={"Country"} />
//                 <span className="text-red-500 font-bold">*</span>
//               </div>
//               <CommonDropDownSearch
//                 placeholder="Select Country"
//                 onChange={handleChange}
//                 value={countryList}
//                 options={countryListFromOracle}
//                 width="w-96"
//                 disable={isDisable || isActiveDisable}
//               />
//               {siteError.country && (
//                 <ValidationError title={siteError.country} />
//               )}
//             </div>
//             <div className="flex flex-col items-start space-y-2">
//               <div className="flex items-center space-x-1">
//                 <InputLebel titleText={"Site Name"} />
//                 <span className="text-red-500 font-bold">*</span>
//               </div>
//               {/* <TextInputField
//                                     hint='Dhaka,Bangladesh'
//                                     onChangeData={(e) => { setAddressLine1(e.target.value) }}
//                                 /> */}
//               <CommonInputField
//                 type="text"
//                 inputRef={addressLine1Ref}
//                 onChangeData={handleAddressLine1Change}
//                 hint="Banani, Dhaka"
//                 disable={isDisable || isActiveDisable || !!siteId}
//                 maxCharacterlength={15}
//               />
//               <p className=" text-xs font-mon">
//                 Maximum 15 letters including space.
//               </p>
//               {siteError.addressLine1 && (
//                 <ValidationError title={siteError.addressLine1} />
//               )}

//               {errorMessage && <ValidationError title={errorMessage} />}
//             </div>
//           </div>
//           <div className="w-full flex flex-row justify-between">
//             <div className="flex flex-col items-start space-y-2">
//               <div className="flex items-center space-x-1">
//                 <InputLebel titleText={"Site Address"} />
//                 <span className="text-red-500 font-bold">*</span>
//               </div>
//               <CommonInputField
//                 type="text"
//                 inputRef={addressLine2Ref}
//                 onChangeData={handleAdressLine2Change}
//                 hint="Dhaka,Bangladesh"
//                 disable={isDisable || isActiveDisable}
//               />
//               {siteError.addressLine2 && (
//                 <ValidationError title={siteError.addressLine2} />
//               )}
//             </div>
//             <div className="flex flex-col items-start space-y-2">
//               <InputLebel titleText={"City/State"} />
//               <CommonInputField
//                 type="text"
//                 inputRef={cityRef}
//                 onChangeData={handleCityChange}
//                 hint="Dhaka"
//                 disable={isDisable || isActiveDisable}
//               />
//               {siteError.city && <ValidationError title={siteError.city} />}
//             </div>
//           </div>
//           <div className="w-full flex flex-row justify-between">
//             <div className="flex flex-col items-start space-y-2">
//               <InputLebel titleText={"Post/ZIP Code"} />
//               <CommonInputField
//                 type="text"
//                 inputRef={zipRef}
//                 onChangeData={handleZipChange}
//                 hint="1234"
//                 disable={isDisable || isActiveDisable}
//               />
//               {siteError.zip && <ValidationError title={siteError.zip} />}
//             </div>
//             <div className="flex flex-col items-start space-y-2">
//               <InputLebel titleText={"Phone"} />
//               <CommonInputField
//                 type="text"
//                 inputRef={phoneRef}
//                 onChangeData={handlePhoneChange}
//                 hint="+880 17XXX8763XX"
//                 disable={isDisable || isActiveDisable}
//               />
//               {siteError.phone && <ValidationError title={siteError.phone} />}
//             </div>
//           </div>
//           <div className="w-full flex flex-row justify-between items-center">
//             <div className="flex flex-col items-start space-y-2">
//               <InputLebel titleText={"Email"} />
//               <CommonInputField
//                 type="text"
//                 inputRef={emailRef}
//                 onChangeData={handleEmailChange}
//                 hint="email@example.com"
//                 disable={isDisable || isActiveDisable}
//               />
//               {siteError.email && <ValidationError title={siteError.email} />}
//             </div>
//             <div className="flex flex-col items-start space-y-2">
//               <InputLebel titleText={"Bank"} />
//               <CommonDropDownSearch
//                 placeholder="Select Banks"
//                 onChange={handleBankChange}
//                 value={viewBankList}
//                 options={bankList}
//                 width="w-96"
//                 disable={isDisable || isActiveDisable}
//                 isMutiSelect={true}
//                 maxSelections={1000}
//               />
//             </div>
//             {/* {
//                       siteDetails?.ID==null?
//                       null:

//                       <div className="form-control w-52">
//     <label className="cursor-pointer label">
//       <span className="label-text">{isActiveSite?"Deactive":"Active"}</span>
//       <input  onChange={handleActivation} type="checkbox" className={`toggle ${isActiveSite?"bg-midGreen border-midGreen":"bg-graishColor"}`} checked={isActiveSite?true:false} />
//     </label>
//   </div>} */}
//           </div>
//           <div className="w-full flex flex-row justify-between items-center">
//             {siteDetails?.ID == null || isRegCompelte !== "1" ? null : (
//               <div className="form-control w-52">
//                 <label className="cursor-pointer label">
//                   <span className="label-text">
//                     {isActiveSite ? "Deactive" : "Active"}
//                   </span>
//                   <input
//                     // disabled={isDisable || isActiveDisable}
//                     type="checkbox"
//                     className="toggle border-gray-300 bg-white"
//                     style={
//                       {
//                         "--tglbg": isActiveSite ? "#00A76F" : "#ececec",
//                       } as React.CSSProperties
//                     }
//                     checked={isActiveSite}
//                     onChange={() => handleActivation()}
//                   />
//                 </label>
//               </div>
//             )}
//           </div>
//           <div className=" h-10"></div>

//           {/* {isRegCompelte === "1" ? (
//             <div>
//               <InputLebel titleText={"Selected Organizations"} />
//               <div className="h-4"></div>
//               <div className=" w-full grid grid-cols-3 gap-6 items-center">
//                 {selectedOrganizationList.map((e, i) => (
//                   <div
//                     key={e.ORGANIZATION_ID}
//                     className=" flex flex-row space-x-2 items-center w-48 px-1   "
//                   >
//                     <button
//                       disabled={true}
//                       onClick={() => {

//                       }}
//                       className={`w-4 h-4 rounded-md
//                                             ${
//                                               e.IS_ASSOCIATED === 1
//                                                 ? "bg-midGreen border-none"
//                                                 : " border-[0.5px] border-borderColor bg-whiteColor"
//                                             }
//                                              flex justify-center items-center   `}
//                     >
//                       {
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           strokeWidth={1.5}
//                           stroke="currentColor"
//                           className="w-3 h-3 text-white"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M4.5 12.75l6 6 9-13.5"
//                           />
//                         </svg>
//                       }
//                     </button>
//                     <p className=" text-blackColor text-sm font-mon font-medium text-start flex-1">
//                       {e.NAME}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ) : null} */}

//           {siteId === null ? (
//             <div className="text-lg text-[#663C00] bg-[#FFF4E5] w-full h-14 px-4 flex items-center rounded-md space-x-2 font-semibold">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth={1.5}
//                 stroke="currentColor"
//                 className="w-7 h-7 text-red-500"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
//                 />
//               </svg>

//               <p>
//                 Before 'Save & Next' you must have to select minimum one
//                 operating unit
//               </p>
//             </div>
//           ) : (
//             ""
//           )}

//           <div className=" w-full flex space-x-4 items-center ">
//             <p className=" font-mon font-medium text-black">Select All</p>
//             <button
//               disabled={isDisable || isActiveDisable}
//               onClick={() => {
//                 isSelectedAll ? unselectAll() : selectAll();
//               }}
//               className={`w-4 h-4 rounded-md
//                                             ${
//                                               isSelectedAll
//                                                 ? "bg-midGreen border-none"
//                                                 : " border-[0.5px] border-borderColor bg-whiteColor"
//                                             }
//                                              flex justify-center items-center   `}
//             >
//               {<img src="/images/check.png" alt="check" className=" w-2 h-2" />}
//             </button>
//           </div>

//           <div className=" w-full grid grid-cols-3 gap-6 items-center">
//             {organizationList.map((e, i) => (
//               <div
//                 key={e.ORGANIZATION_ID}
//                 className=" flex flex-row space-x-2 items-center w-48 px-1   "
//               >
//                 <button
//                   disabled={isDisable || isActiveDisable}
//                   onClick={() => {
//                     handleGrantRevokeOrganization(i);
//                     addOrgToSelectedSitelist(e);
//                   }}
//                   className={`w-4 h-4 rounded-md
//                                             ${
//                                               e.IS_ASSOCIATED === 1
//                                                 ? "bg-midGreen border-none"
//                                                 : " border-[0.5px] border-borderColor bg-whiteColor"
//                                             }
//                                              flex justify-center items-center   `}
//                 >
//                   {
//                     <img
//                       src="/images/check.png"
//                       alt="check"
//                       className=" w-2 h-2"
//                     />
//                   }
//                 </button>
//                 <p className=" text-blackColor text-sm font-mon font-medium text-start flex-1">
//                   {e.NAME}
//                 </p>
//               </div>
//             ))}
//           </div>
//           {siteError.selectedOrgList && (
//             <ValidationError title={siteError.selectedOrgList} />
//           )}
//           <div className=" h-10"></div>

//           <div className="  w-full flex flex-row justify-end items-end space-x-4">
//             {submitLoading ? (
//               <div className=" w-44 flex justify-center items-center">
//                 <CircularProgressIndicator />
//               </div>
//             ) : (
//               <CommonButton
//                 onClick={submit}
//                 titleText={"Save & Next"}
//                 disable={isDisable || isActiveDisable}
//                 width="w-44"
//               />
//             )}

//             {/* {isFinalSubmissionLoading ? (
//               <div className=" w-40 flex justify-center items-center">
//                 <CircularProgressIndicator />
//               </div>
//             ) : (
//               <CommonButton
//                 disable={isDisable}
//                 titleText={"Submit"}
//                 onClick={showWarning}
//                 width="w-40"
//                 color="bg-midGreen"
//               />
//             )} */}
//           </div>

//           {/* <div className=" h-16"></div> */}
//           {/* <div className="w-full  flex justify-center items-center  ring-1 ring-borderColor bg-gray-50">
//             <table className="w-full  px-16  ">
//               <thead className="   ">
//                 <tr className=" w-full h-14 bg-lightGreen rounded-t-md">
//                   <th className="mediumText ">Sequence</th>
//                   <th className="mediumText ">Perfomrmed By</th>
//                   <th className="mediumText ">Date</th>
//                   <th className="mediumText ">Action</th>
//                   <th className="mediumText ">Remarks</th>
//                 </tr>
//               </thead>

//               {hierarchLoading ? (
//                 // <div className=' w-full flex justify-center items-center'>
//                 //     <LogoLoading/>
//                 // </div>
//                 <tbody>
//                   <td></td>
//                   <td></td>
//                   <td>
//                     <LogoLoading />
//                   </td>
//                   <td></td>
//                   <td></td>
//                 </tbody>
//               ) : (
//                 hierarchyList.map((item, index) => (
//                   <tbody>
//                     <tr
//                       key={item.APPROVER_ID}
//                       className={`text-center h-14 ${
//                         index !== 0
//                           ? "border-t border-borderColor h-[0.1px] "
//                           : ""
//                       }`}
//                     >
//                       <td className="smallText h-14">{item.STAGE_LEVEL}</td>
//                       <td className="smallText h-14">
//                         {item.APPROVER_FULL_NAME}
//                       </td>
//                       <td className="smallText h-14">
//                         {item.ACTION_DATE !== "N/A" ? item.ACTION_DATE : "N/A"}
//                       </td>
//                       <td className="font-mon text-sm   font-semibold h-14">
//                         {item.ACTION_CODE === "0" ? (
//                           <p className=" text-sm font-mon text-redColor">
//                             Rejected
//                           </p>
//                         ) : item.ACTION_CODE === "1" ? (
//                           <p className=" text-sm font-mon text-midGreen">
//                             Approved
//                           </p>
//                         ) : (
//                           <p className=" text-sm font-mon  text-yellow-500">
//                             Pending
//                           </p>
//                         )}
//                       </td>
//                       <td className="smallText h-14">
//                         {item.ACTION_NOTE !== "N/A" ? item.ACTION_NOTE : "N/A"}
//                       </td>
//                     </tr>
//                   </tbody>
//                 ))
//               )}
//             </table>
//           </div> */}
//           <div className="h-20"></div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import InputLebel from "../../../common_component/InputLebel";
import Select from "react-tailwindcss-select";
import CommonInputField from "../../../common_component/CommonInputField";
import CommonButton from "../../../common_component/CommonButton";
import ApproveHierarchyTable from "../../../common_component/ApproveHierarchyTable";
import CommonDropDownSearch from "../../../common_component/CommonDropDownSearch";
import { useSiteCreationPageContext } from "../../context/SiteCreationPageContext";
import { useAuth } from "../../../login_both/context/AuthContext";
import SiteDetailsService from "../../service/site_creation/SiteDetailsService";
import {
  BankInterface,
  SupplierSiteInterface,
} from "../../interface/RegistrationInterface";
import SuccessToast, {
  showSuccessToast,
} from "../../../Alerts_Component/SuccessToast";
import ErrorToast, {
  showErrorToast,
} from "../../../Alerts_Component/ErrorToast";
import { useNavigate } from "react-router-dom";
import { isTokenValid } from "../../../utils/methods/TokenValidityCheck";

import countries from "../../../jsons/countries";
import LogoLoading from "../../../Loading_component/LogoLoading";
import AddUpdateSiteService from "../../service/site_creation/AddUpdateSiteService";
import ValidationError from "../../../Alerts_Component/ValidationError";
import PageTitle from "../../../common_component/PageTitle";
import TextInputField from "../../../common_component/TextInputFieldTwo";
import CircularProgressIndicator from "../../../Loading_component/CircularProgressIndicator";

import { OrganizationInterface } from "../../../role_access/interface/OrganizationInterface";
import OrganizationListService from "../../../role_access/service/OrganizationListService";
import OrgListForSupplierService from "../../service/site_creation/OrgListForSupplierService";
import AddOrgToSiteService from "../../service/site_creation/AddOrgToSiteService";
import WarningModal from "../../../common_component/WarningModal";
import BankListService from "../../service/bank/BankListService";
import AddbankToSiteService from "../../service/site_creation/AddbankToSiteService";
import BankListInSiteService from "../../service/site_creation/BankListInSiteService";
import { Item } from "@radix-ui/react-select";
import DeleteBankFromSiteService from "../../service/site_creation/DeletebankFromSiteService";
import SubmitRegistrationService from "../../service/registration_submission/submitRegistrationService";
import HierarchyInterface from "../../interface/hierarchy/HierarchyInterface";
import HierachyListByModuleService from "../../service/approve_hierarchy/HierarchyListByModuleService";
import SendEmailService from "../../../manage_supplier/service/approve_reject/SendEmailService";
import ProfileUpdateSubmissionService from "../../service/profile_update_submission/ProfileUpdateSubmissionService";
import CountryListFromOracleService from "../../service/basic_info/CountryListFromOracle";
import useRegistrationStore from "../../store/registrationStore";
import useAuthStore from "../../../login_both/store/authStore";
import CurrencyListService from "../../service/bank/CurrencyListService";

const bd: Country = { value: "BD", label: "Bangladesh" };

interface Country {
  value: string;
  label: string;
}

interface CountryApi {
  VALUE: string;
  LABEL: string;
}

interface Bank {
  value: string;
  label: string;
}

interface CurrencyFromOracle {
  value: string;
  label: string;
}

interface PaymentCurrencyFromOracle {
  value: string;
  label: string;
}

interface CurrencyData {
  CURRENCY_CODE: string;
  NAME: string;
}

interface PaymentCurrencyData {
  CURRENCY_CODE: string;
  NAME: string;
}

export default function SiteCreationPage() {
  const addressLine1Ref = useRef<HTMLInputElement | null>(null);
  const addressLine2Ref = useRef<HTMLInputElement | null>(null);
  const cityRef = useRef<HTMLInputElement | null>(null);
  const zipRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const [animal, setAnimal] = useState(null);

  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [primarySite, setPrimarySite] = useState("");
  const [createdSiteId, setCreatedSiteId] = useState<number | null>(null);

  const [organizationList, setOrganizationList] = useState<
    OrganizationInterface[] | []
  >([]);
  const [selectedOrganizationList, setSelectedOrganizationList] = useState<
    OrganizationInterface[] | []
  >([]);

  const { siteListInStore, isSiteChangeStore, setIsSiteChangeStore } =
    useRegistrationStore();

  const {
    isRegistrationInStore,
    isProfileUpdateStatusInStore,
    isNewInfoStatusInStore,
  } = useAuthStore();

  useEffect(() => {
    console.log("site store: ", isSiteChangeStore);
  }, []);

  console.log("render out side any hook");

  const [siteDetails, setSiteDetails] = useState<SupplierSiteInterface | null>(
    null
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  //countries
  const [countryList, setCountryList] = useState<Country | null>(null);
  const [country, setCountry] = useState("");

  const [countryListFromOracle, setCountryListFromOracle] = useState<
    Country[] | []
  >([]);

  const countryGet = async () => {
    try {
      const result = await CountryListFromOracleService(regToken!);
      console.log(result.data);

      if (result.data.status === 200) {
        const transformedData = result.data.data.map((item: CountryApi) => ({
          value: item.VALUE,
          label: item.LABEL,
        }));
        setCountryListFromOracle(transformedData);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Something went wrong");
    }
  };

  const handleChange = (value: any) => {
    // console.log("value:", value);
    setCountryList(value);
    if (value !== null) {
      setCountry(value.value);
    } else if (value == null && country != null) {
      setCountry("");
      console.log("cleared");
    }
  };
  //countries

  const { siteId, setPage, setSiteId, siteLength, setSiteLength } =
    useSiteCreationPageContext();
  const { regToken, submissionStatus, isRegCompelte, setSubmissionStatus } =
    useAuth();

  const navigate = useNavigate();

  //token validation
  useEffect(() => {
    console.log("render");
    console.log(siteId);
    console.log("siteLength: ", siteLength);

    const isTokenExpired = !isTokenValid(regToken!);
    if (isTokenExpired) {
      localStorage.removeItem("regToken");
      showErrorToast("Please Login Again..");
      setTimeout(() => {
        navigate("/");
      }, 1200);
    } else {
      console.log("excute in else");
      setCountryList(bd);
      setCountry(bd.value);
      getOrganization();
      GetBankListFromOracle();
      getApproverHierachy();
      countryGet();
      getPaymentCurrency();
      getCurrency();
      if (siteId !== null) {
        getSiteDetails();
        getBankListFromSite(siteId);
      }
    }
  }, []);
  //token validation

  // re-render on set data

  const [currencyListFromOracle, setCurrencyListFromOracle] = useState<
    CurrencyFromOracle[] | []
  >([]);
  const [paymentCurrencyList, setPaymentCurrencyList] = useState<
    PaymentCurrencyFromOracle[] | []
  >([]);

  useEffect(() => {
    console.log("render");
    if (siteDetails) {
      setData();
    }
  }, [
    siteDetails,
    countryListFromOracle,
    currencyListFromOracle,
    paymentCurrencyList,
  ]);

  //re-render on set data

  //disabling field
  const [isDisable, setIsDisable] = useState<boolean>(false);
  //disabling field

  //set disable

  const [isActiveDisable, setIsActiveDisable] = useState<boolean>(false);

  useEffect(() => {
    console.log(submissionStatus);

    if (
      submissionStatus !== "DRAFT" ||
      isProfileUpdateStatusInStore === "IN PROCESS"
    ) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [submissionStatus, isProfileUpdateStatusInStore]);

  //   if (submissionStatus === "DRAFT") {
  //     setIsDisable(false);
  //   } else {
  //     setIsDisable(true);
  //   }
  // }, [submissionStatus]);

  // //set disable

  const getSiteDetails = async () => {
    setIsLoading(true);
    try {
      const result = await SiteDetailsService(regToken!, siteId!);
      if (result.data.status === 200) {
        setSiteDetails(result.data.data);
        console.log("siteDetails", result.data.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      showErrorToast("Something went wrong");
    }
  };

  //get org
  //slected org list
  const [selectedOrgList, setSelectedOrgList] = useState<
    OrganizationInterface[]
  >([]);
  const [selectedOrgList2, setSelectedOrgList2] = useState<
    OrganizationInterface[]
  >([]);

  // const getOrganization = async () => {
  //     const result = await OrgListForSupplierService(regToken!,siteId);
  //     if (result.data.status === 200) {
  //         setOrganizationList(result.data.data);
  //        // Explicitly provide the type for 'org' using the OrganizationInterface
  //     const updatedSelectedOrgList = result.data.data.filter((org: OrganizationInterface) => org.IS_ASSOCIATED === 1);
  //     setPreSelectedOrgList(updatedSelectedOrgList);
  //     }

  // }

  const getOrganization = async () => {
    const result = await OrgListForSupplierService(regToken!, siteId);

    if (result.data.status === 200) {
      setOrganizationList(result.data.data);
      const selected = result.data.data.filter(
        (item: OrganizationInterface) => item.IS_ASSOCIATED === 1
      );
      console.log(selected);

      setSelectedOrganizationList(selected);
      if (selected.length === result.data.data.length) {
        setIsSelectAll(true);
      }
    }
  };

  //org grant revoke

  // org grant revoke
  const handleGrantRevokeOrganization = (orgIndex: number) => {
    const updatedOrganizationList = [...organizationList];
    updatedOrganizationList[orgIndex].IS_ASSOCIATED =
      updatedOrganizationList[orgIndex].IS_ASSOCIATED === 1 ? 0 : 1;
    setOrganizationList(updatedOrganizationList);
    const updatedSelectedOrgList = updatedOrganizationList.filter(
      (org) => org.IS_ASSOCIATED === 1
    );

    // setSelectedOrgList(updatedSelectedOrgList);
    setSelectedOrganizationList(updatedSelectedOrgList);
  };

  const addOrgToSelectedSitelist = (org: OrganizationInterface) => {
    selectedOrgList2.push(org);
  };

  //  const handleGrantRevokeOrganization = (orgIndex: number) => {
  //     const updatedOrganizationList = [...organizationList];
  //     updatedOrganizationList[orgIndex].IS_ASSOCIATED = updatedOrganizationList[orgIndex].IS_ASSOCIATED === 1 ? 0 : 1;
  //     setOrganizationList(updatedOrganizationList);
  //     const updatedSelectedOrgList = updatedOrganizationList.filter(org => org.IS_ASSOCIATED === 1);
  //     setSelectedOrgList(updatedSelectedOrgList);

  //     // grantRevokeOrganization(updatedOrganizationList[orgIndex].ORGANIZATION_ID, updatedOrganizationList[orgIndex].SHORT_CODE, updatedOrganizationList[orgIndex].NAME);
  // }

  // currency code start here
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

  // payment currency

  const [paymentCurrencyFromOracle, setPaymentCurrencyFromOracle] =
    useState<PaymentCurrencyFromOracle | null>(null);

  const getPaymentCurrency = async () => {
    try {
      const result = await CurrencyListService(regToken!);
      console.log(result.data);

      if (result.data.status === 200) {
        const transformedData = result.data.data.map(
          (item: PaymentCurrencyData) => ({
            value: item.CURRENCY_CODE,
            label: item.NAME,
          })
        );
        setPaymentCurrencyList(transformedData);
        // const foundCurrency = transformedData.find(
        //   (item: CurrencyFromOracle) =>
        //     item.value === bankDetails?.data.CURRENCY_CODE
        // );
        // console.log(foundCurrency);

        // // Set the found bank data as the initial value for the dropdown
        // if (foundCurrency) {
        //   setPaymentCurrencyFromOracle(foundCurrency!);
        // }
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Currency load failed");
    }
  };

  const [paymentCurrencyCode, setPaymentCurrencyCode] = useState("");

  const handlePaymentCurrency = (value: any) => {
    // console.log("value:", value);
    setPaymentCurrencyFromOracle(value);
    if (value !== null) {
      console.log(value.value);
      //   getBranch(value.value);
      setPaymentCurrencyCode(value.value);

      //   getBank(value.value);
    } else if (value == null && paymentCurrencyList != null) {
      setPaymentCurrencyCode("");
      console.log("cleared");
    }
  };
  // currency code end here

  const setData = () => {
    if (
      addressLine1Ref.current &&
      addressLine2Ref.current &&
      cityRef.current &&
      zipRef.current &&
      phoneRef.current &&
      emailRef.current
    ) {
      addressLine1Ref.current.value = siteDetails?.ADDRESS_LINE1 || "";
      setAddressLine1(siteDetails?.ADDRESS_LINE1!);
      addressLine2Ref.current.value = siteDetails?.ADDRESS_LINE2 || "";
      setAddressLine2(siteDetails?.ADDRESS_LINE2!);
      cityRef.current.value = siteDetails?.CITY_STATE || "";
      setCity(siteDetails?.CITY_STATE!);
      if (
        siteDetails?.ZIP_CODE !== null &&
        siteDetails?.ZIP_CODE !== undefined
      ) {
        zipRef.current.value = siteDetails?.ZIP_CODE.toString() || "";
        setZip(siteDetails?.ZIP_CODE.toString()!);
      }

      phoneRef.current.value = siteDetails?.MOBILE_NUMBER || "";
      console.log("mobile", siteDetails?.MOBILE_NUMBER);

      setPhone(siteDetails?.MOBILE_NUMBER!);
      emailRef.current.value = siteDetails?.EMAIL || "";
      setEmail(siteDetails?.EMAIL!);
      setPrimarySite(siteDetails?.PRIMARY_SITE);
      console.log(siteDetails?.ACTIVE_STATUS);

      if (siteDetails?.ACTIVE_STATUS === "ACTIVE") {
        setIsActiveSite(true);
      }
      if (siteDetails?.ACTIVE_STATUS === "DEACTIVE") {
        setIsActiveSite(false);
      }
      if (siteDetails?.ACTIVE_STATUS === "IN PROCESS") {
        setInProcess(true);
      }

      // setIsActiveSite(siteDetails?.ACTIVE_STATUS === "ACTIVE" ? true : false);

      const selectedCountry = countryListFromOracle.find(
        (option) => option.value === siteDetails?.COUNTRY!
      );
      if (selectedCountry) {
        setCountryList(selectedCountry);
        setCountry(selectedCountry.value);
      } else {
        setCountryList(null);
      }

      setCurrencyCode(siteDetails?.INVOICE_CURRENCY_CODE);
      const foundCurrency = currencyListFromOracle.find(
        (item: CurrencyFromOracle) =>
          item.value === siteDetails?.INVOICE_CURRENCY_CODE
      );
      console.log(foundCurrency);
      console.log(siteDetails?.INVOICE_CURRENCY_CODE);

      // Set the found bank data as the initial value for the dropdown
      if (foundCurrency) {
        setCurrencyFromOracle(foundCurrency!);
      }

      setPaymentCurrencyCode(siteDetails?.PAYMENT_CURRENCY_CODE);
      const foundPaymentCurrency = paymentCurrencyList.find(
        (item: PaymentCurrencyFromOracle) =>
          item.value === siteDetails?.PAYMENT_CURRENCY_CODE
      );
      console.log(foundPaymentCurrency);

      // Set the found bank data as the initial value for the dropdown
      if (foundPaymentCurrency) {
        setPaymentCurrencyFromOracle(foundPaymentCurrency!);
      }
    }
  };

  // const setData = () => {
  //     setAddressLine1(siteDetails?.ADDRESS_LINE1 || "");
  //     setAddressLine2(siteDetails?.ADDRESS_LINE2 || "");
  //     setCity(siteDetails?.CITY_STATE || "");
  //     setZip(siteDetails?.ZIP_CODE.toString() || "");
  //     setPhone(siteDetails?.MOBILE_NUMBER || "");
  //     setEmail(siteDetails?.EMAIL || "");

  //     const selectedCountry = countries.find(option => option.value === siteDetails?.COUNTRY!);
  //     if (selectedCountry) {
  //         setCountryList(selectedCountry);
  //         setCountry(selectedCountry.value);
  //     } else {
  //         setCountryList(null);
  //     }
  // };

  // const handleAddressLine1Change = (value: string) => {
  //     setAddressLine1(value);
  //     if (addressLine1Ref.current) {
  //         addressLine1Ref.current.value = value;
  //     }
  // }

  const [errorMessage, setErrorMessage] = useState<string>("");

  // const handleAddressLine1Change = (value: string) => {

  //   if(siteId)

  //   setAddressLine1(value);

  //   // Convert input value to lowercase and remove extra spaces
  //   const lowerCaseValue = value.toLowerCase().replace(/\s+/g, '');
  //   // Set the input value
  //   // setAddressLine1(lowerCaseValue);
  //   // Check if the value exists in the siteListInStore
  //   if (siteListInStore.includes(lowerCaseValue)) {
  //     setErrorMessage('Site name is already taken');
  //   } else {
  //     setErrorMessage('');
  //   }
  // };

  const handleAddressLine1Change = (value: string) => {
    // If siteId is present, do not allow editing
    if (siteId) {
      return;
    }

    // Convert input value to lowercase and remove extra spaces for comparison
    const lowerCaseValue = value.toLowerCase().replace(/\s+/g, "");

    // Check if the converted value exists in the siteListInStore
    if (siteListInStore.includes(lowerCaseValue)) {
      setErrorMessage("Site name is already taken");
    } else {
      setErrorMessage("");
      // Save the original input value if it is not a duplicate
      setAddressLine1(value);
    }
  };

  const handleAdressLine2Change = (value: string) => {
    setAddressLine2(value);
  };

  const handleCityChange = (value: string) => {
    setCity(value);
  };
  const handleZipChange = (value: string) => {
    setZip(value);
  };
  const handlePhoneChange = (value: string) => {
    setPhone(value);
  };
  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  //validation

  const [siteError, setSiteError] = useState<{
    country?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    zip?: string;
    phone?: string;
    email?: string;
    selectedOrgList?: string;
    checkbox?: string;
    currencyCode?: string;
    paymentCurrencyCode?: string;
  }>({});

  const validate = () => {
    const errors: {
      country?: string;
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      zip?: string;
      phone?: string;
      email?: string;
      checkbox?: string;
      selectedOrgList?: string;
      currencyCode?: string;
      paymentCurrencyCode?: string;
    } = {};

    if (country === "") {
      errors.country = "Please Select Country";
    }
    if (!addressLine1.trim()) {
      errors.addressLine1 = "Please Enter Site Name";
    }
    if (!addressLine2.trim()) {
      errors.addressLine2 = "Please Enter Site Address";
    }

    if (siteLength === 0 && !isChecked) {
      errors.checkbox = "You must have to select Primary Site";
    }

    if (currencyCode === "") {
      errors.currencyCode = "Please select invoice currency";
    }

    if (paymentCurrencyCode === "") {
      errors.paymentCurrencyCode = "Please select payment currency";
    }

    // if (!city.trim()) {
    //   errors.city = "Please Enter City";
    // }
    // if (!email.trim()) {
    //   errors.email = "Please Enter Email";
    // }
    // if (!phone.trim()) {
    //   errors.phone = "Please Enter Phone";
    // }
    // if (!zip.trim()) {
    //   errors.zip = "Please Enter Zip";
    // }
    if (selectedOrganizationList.length === 0 && isRegCompelte !== "1") {
      errors.selectedOrgList = "Please select at lest one organization";
    }

    setSiteError(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    console.log("reg", isRegistrationInStore);
    console.log("siteId", siteId);
    console.log("checkbox: ", isChecked);
  }, []);

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckbox = () => {
    console.log("isChecked: ", isChecked);
    setIsChecked(!isChecked);
  };

  const submit = async () => {
    // if (validate()) {
    //     console.log(addressLine1Ref.current?.value);
    //     const result = await AddUpdateSiteService(regToken!, siteId!, country, addressLine1, addressLine2, city, email, phone, zip);
    //     showErrorToast(result.data.message);
    // }
    // else {
    //     console.log(addressLine1Ref.current?.value);
    // }

    // if (validate()) {

    // }
    // else{
    //     console.log('failed validation');

    // }
    // console.log(viewBankList);
    // console.log(selectedBankList?.length);

    if (validate()) {
      try {
        // Check if at least one organization is selected
        const selectedOrgCount = organizationList.filter(
          (e) => e.IS_ASSOCIATED === 1
        ).length;
        if (selectedOrgCount === 0) {
          showErrorToast("Please select at least one organization.");
          return;
        }

        setSubmitLoading(true);
        console.log(addressLine1);

        let statusValue = "";
        // if (isRegCompelte === "0") {
        //   statusValue = "ACTIVE";
        // } else if (isRegCompelte === "1" && siteId === null) {
        //   statusValue = "IN PROCESS";
        // } else if (siteDetails?.ACTIVE_STATUS === "ACTIVE") {
        //   statusValue = "ACTIVE";
        // } else if (siteDetails?.ACTIVE_STATUS === "DEACTIVE") {
        //   statusValue = "DEACTIVE";
        // } else if (siteDetails?.ACTIVE_STATUS === "IN PROCESS") {
        //   statusValue = "IN PROCESS";
        // }

        if (isRegCompelte === "0") {
          statusValue = "ACTIVE"; //active silo
        } else if (isRegCompelte === "1" && siteId === null) {
          statusValue = "IN PROCESS";
        } else if (isActiveSite !== null) {
          statusValue = isActiveSite ? "ACTIVE" : "DEACTIVE";
        } else if (isInProcess) {
          statusValue = "IN PROCESS";
        }

        setIsSiteChangeStore(true);

        const result = await AddUpdateSiteService(
          regToken!,
          siteId!,
          country,
          addressLine1,
          addressLine2,
          city,
          email,
          phone,
          zip,
          // isActiveSite ? "ACTIVE" : "DEACTIVE"
          statusValue!,
          isChecked ? "Y" : "",
          currencyCode,
          paymentCurrencyCode
        );
        console.log(result.data);

        if (result.data.status === 200) {
          setSubmitLoading(false);
          setIsActiveDisable(isActiveSite ? false : true);
          setSiteLength(siteLength + 1);
          showSuccessToast(result.data.message);
          AddOrgToSite(siteId == null ? result.data.id : siteId);
          if (siteId != null) {
            deleteBankFromSite();
          }
          addBankToSite(siteId == null ? result.data.id : siteId);

          setPage(1);

          // if (siteId === null) {
          //     setTimeout(() => {
          //         setPage(1);
          //     }, 1200);
          // }
          // else {
          //     getSiteDetails();
          // }

          // showSuccessToast(result.data.message);
          // Do not reset state values here to keep the text field values unchanged.
        } else {
          setSubmitLoading(false);
          showErrorToast(result.data.message);
        }
      } catch (error) {
        setSubmitLoading(false);
        showErrorToast("something went wrong");
      }
    } else {
      console.log("validate hoi nai");
    }
  };

  const getBankListFromSite = async (createdId: number) => {
    try {
      const result = await BankListInSiteService(regToken!, createdId);
      console.log(result.data.data.length);

      if (result.data.status === 200) {
        const transformedData = result.data.data.map((item: any) => ({
          value: item.ID,
          label: item.BANK_NAME,
        }));
        console.log("site bank: ", transformedData);

        setViewBankList(transformedData);
        setSelectedBankList(transformedData);
        setSelectedBankList2(transformedData);
      }
    } catch (error) {
      showErrorToast("Something went wrong");
    }
  };

  const addBankToSite = async (createdId: number) => {
    try {
      for (let i = 0; i < selectedBankList?.length!; i++) {
        const result = await AddbankToSiteService(
          regToken!,
          createdId,
          parseInt(selectedBankList![i].value)
        );
        console.log(result.data);
      }
    } catch (error) {
      setSubmitLoading(false);
      showErrorToast("something went wrong");
    }
  };

  const deleteBankFromSite = async () => {
    const notFoundList: Bank[] = selectedBankList2!.filter((bank2) => {
      // Check if the bank is not present in selectedBankList
      return !selectedBankList!.some(
        (bank1) => bank1.value === bank2.value && bank1.label === bank2.label
      );
    });
    console.log(notFoundList);

    // Update state with the not found list
    // setSelectedBankList(notFoundList);
    for (let i = 0; i < notFoundList.length; i++) {
      const result = await DeleteBankFromSiteService(
        regToken!,
        parseInt(notFoundList[i].value)
      );
      console.log(result.data);
    }
  };

  const [isAddLoading, setIsAddLoading] = useState(false);

  const AddOrgToSite = async (createdId: number) => {
    console.log(createdId);
    console.log(selectedOrgList.length);

    try {
      for (let i = 0; i < selectedOrgList2.length; i++) {
        const result = await AddOrgToSiteService(
          regToken!,
          createdId,
          selectedOrgList2[i]
        );
      }
      if (siteId === null) {
        setTimeout(() => {
          setPage(1);
        }, 1200);
      } else {
        getSiteDetails();
      }
    } catch (error) {
      setSubmitLoading(false);
      showErrorToast("something went wrong");
    }
  };

  //back to list

  const backToList = () => {
    setPage(1);
    setSiteId(null);
  };

  //active deactive site

  const [isActiveSite, setIsActiveSite] = useState<boolean | null>(null);
  const [isInProcess, setInProcess] = useState<boolean>(false);

  const handleActivation = () => {
    setIsActiveSite(!isActiveSite);
    openWarningModal();
  };

  const [isWarningShow, setIsWarningShow] = useState(false);
  const openWarningModal = () => {
    setIsWarningShow(true);
  };
  const closeWarningModal = () => {
    setIsActiveSite(!isActiveSite);
    setIsWarningShow(false);
  };

  // const doActiveDeactive=()=>{
  //     submit();
  // }

  const [isBankLoading, setIsBankLoading] = useState<boolean>(false);

  const [bankList, setBankList] = useState<Bank[] | []>([]);
  const [viewBankList, setViewBankList] = useState<null>(null);
  const [selectedBankList, setSelectedBankList] = useState<Bank[] | null>(null);
  const [selectedBankList2, setSelectedBankList2] = useState<Bank[] | null>(
    null
  );

  const handleBankChange = (value: any) => {
    // console.log("value:", value);
    setViewBankList(value);
    if (value !== null) {
      setSelectedBankList(value);
      console.log(value);
    } else if (value == null && viewBankList != null) {
      setSelectedBankList([]); //country silo
      console.log("cleared");
    }
  };

  const GetBankListFromOracle = async () => {
    try {
      setIsBankLoading(true);
      const result = await BankListService(regToken!);
      console.log(result.data.data);

      if (result.data.status === 200) {

        // for only active bank showing
        const activeBanks = result.data.data.filter((item: BankInterface) => 
          item.ACTIVE_STATUS === "ACTIVE"
        );

        const transformedData = activeBanks.map((item: BankInterface) => ({
          value: item.ID,
          label: item.BANK_NAME,
        }));

        console.log("bankList: ", transformedData);
        setBankList(transformedData);
        setIsBankLoading(false);
      } else {
        setIsBankLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      //handle error
      setIsBankLoading(false);
      showErrorToast("Something went wrong");
    }
  };

  //hierarchy and submit

  //is warning show

  //hierarchy
  const [hierarchLoading, setHierarchyLoading] = useState<boolean>(false);
  const [hierarchyUserProfilePicturePath, setHierarchyUserProfilePicturePath] =
    useState<string>("");
  const [hierarchyList, setHierarchyList] = useState<HierarchyInterface[] | []>(
    []
  );
  const getApproverHierachy = async () => {
    const decodedToken = decodeJWT(regToken!);

    // Extract USER_ID from the decoded payload
    const userId = decodedToken?.decodedPayload?.USER_ID;
    console.log(userId);

    try {
      setHierarchyLoading(true);
      const result = await HierachyListByModuleService(
        regToken!,
        userId,
        isRegCompelte === "1" ? "Profile Update" : "Supplier Approval"
      );
      if (result.data.status === 200) {
        setHierarchyLoading(false);
        setHierarchyUserProfilePicturePath(result.data.profile_pic);
        setHierarchyList(result.data.data);
      } else {
        setHierarchyLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setHierarchyLoading(false);
      showErrorToast("Something went wrong");
    }
  };

  const decodeJWT = (token: string) => {
    try {
      // Split the token into header, payload, and signature
      const [encodedHeader, encodedPayload] = token.split(".");

      // Function to decode base64url
      const base64urlDecode = (str: string) => {
        // Replace '-' with '+', '_' with '/', and pad the string with '=' to make it base64 compliant
        str = str.replace(/-/g, "+").replace(/_/g, "/");
        while (str.length % 4) {
          str += "=";
        }
        return window.atob(str);
      };

      // Decode base64url-encoded header and payload
      const decodedHeader = JSON.parse(base64urlDecode(encodedHeader));
      const decodedPayload = JSON.parse(base64urlDecode(encodedPayload));

      // Log the decoded header and payload
      console.log("Decoded Header:", decodedHeader);
      console.log("Decoded Payload:", decodedPayload);

      // Ensure the decoded payload has the expected structure
      if (decodedPayload && decodedPayload.hasOwnProperty("USER_ID")) {
        const userId = decodedPayload.USER_ID;
        const isNewUser = decodedPayload.IS_NEW_USER;
        const approval = decodedPayload.APPROVAL_STATUS;
        const submissionStatus = decodedPayload.SUBMISSION_STATUS;
        const isRegComplete = decodedPayload.IS_REG_COMPLETE;
        const buyerId = decodedPayload.BUYER_ID;
        const isWlcSwn = decodedPayload.IS_WLC_MSG_SHOWN;
        const wlcMessage = decodedPayload.WELCOME_MSG;

        return {
          decodedHeader,
          decodedPayload,
          userId,
          isNewUser,
          approval,
          submissionStatus,
          isRegComplete,
          buyerId,
          isWlcSwn,
          wlcMessage,
        };
      } else {
        console.error(
          "Error: Decoded payload does not have the expected structure."
        );
        return null;
      }
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  };

  // const decodeJWT = (token: string) => {
  //   try {
  //     // Split the token into header, payload, and signature (assuming they are separated by dots)
  //     const [encodedHeader, encodedPayload] = token.split(".");

  //     // Decode base64-encoded header and payload
  //     const decodedHeader = JSON.parse(window.atob(encodedHeader));
  //     const decodedPayload = JSON.parse(window.atob(encodedPayload));

  //     // Log the decoded header and payload
  //     console.log("Decoded Header:", decodedHeader);
  //     console.log("Decoded Payload:", decodedPayload);

  //     // Make sure that the decoded payload has the expected structure
  //     if (decodedPayload && decodedPayload.hasOwnProperty("USER_ID")) {
  //       const userId = decodedPayload.USER_ID;
  //       const isNewUser = decodedPayload.IS_NEW_USER;
  //       const approval = decodedPayload.APPROVAL_STATUS;
  //       const submissionStatus = decodedPayload.SUBMISSION_STATUS;
  //       const isRegComplete = decodedPayload.IS_REG_COMPLETE;
  //       // console.log(`userId: ${userId}`);
  //       return {
  //         decodedHeader,
  //         decodedPayload,
  //         userId,
  //         isNewUser,
  //         approval,
  //         submissionStatus,
  //         isRegComplete,
  //       };
  //     } else {
  //       console.error(
  //         "Error: Decoded payload does not have the expected structure."
  //       );
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error("Error decoding JWT:", error);
  //     return null;
  //   }
  // };

  const [isWarningShowSubmit, setIsWarningShowSubmit] =
    useState<boolean>(false);

  const showWarning = async () => {
    setIsWarningShowSubmit(true);
  };
  const closeModal = () => {
    setIsWarningShowSubmit(false);
  };

  const [isFinalSubmissionLoading, setIsFinalSubmissionLoading] =
    useState<boolean>(false);

  const finalSubmission = async () => {
    submit();
    closeModal();
    setIsFinalSubmissionLoading(true);
    try {
      const result = await SubmitRegistrationService(regToken!);
      if (result.data.status === 201) {
        setSubmissionStatus("SUBMIT"); //SUBMIT
        setIsFinalSubmissionLoading(false);
        showSuccessToast(result.data.message);
        setIsDisable(true);
      } else {
        setIsFinalSubmissionLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsFinalSubmissionLoading(false);
      showErrorToast("Something went wrong.");
    }
    // sendEmail();  //hide korlam back theke felbe tai
  };

  const sendEmail = async () => {
    try {
      for (let i = 0; i < hierarchyList.length; i++) {
        if (hierarchyList[i].STAGE_LEVEL === 1) {
          const result = await SendEmailService(
            regToken!,
            hierarchyList[i].EMAIL_ADDRESS,
            hierarchyList[i].APPROVER_FULL_NAME,
            "Supplier Approval Request",
            ", Supplier requested for registration."
          );
        }
      }
    } catch (error) {
      showErrorToast("Email send Failed");
    }
  };

  //profile update submission

  const profileUpdateSubmission = async () => {
    try {
      const result = await ProfileUpdateSubmissionService(regToken!);
      if (result.data.status === 200) {
        showSuccessToast(result.data.message);
        setSubmissionStatus("SUBMIT");
        setIsDisable(true);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {}
  };

  const [isSelectedAll, setIsSelectAll] = useState<boolean>(false);
  const selectAll = () => {
    setIsSelectAll(true);

    for (let i = 0; i < organizationList.length; i++) {
      if (organizationList[i].IS_ASSOCIATED === 1) {
        selectedOrgList.push(organizationList[i]);
      } else {
        organizationList[i].IS_ASSOCIATED = 1;
        selectedOrgList.push(organizationList[i]);
        selectedOrgList2.push(organizationList[i]);
      }
    }
    console.log(organizationList.length);

    console.log(selectedOrgList.length);
  };
  const unselectAll = () => {
    setIsSelectAll(false);
    for (let i = 0; i < organizationList.length; i++) {
      if (organizationList[i].IS_ASSOCIATED === 0) {
        selectedOrgList.push(organizationList[i]);
      } else {
        organizationList[i].IS_ASSOCIATED = 0;
        selectedOrgList.push(organizationList[i]);
        selectedOrgList2.push(organizationList[i]);
      }
    }
  };

  return (
    <div className="bg-whiteColor">
      <SuccessToast />
      <WarningModal
        isOpen={isWarningShowSubmit}
        action={
          isRegCompelte === "1" ? profileUpdateSubmission : finalSubmission
        }
        closeModal={closeModal}
        message="Do you want to submit ?"
        imgSrc="/images/warning.png"
      />
      <WarningModal
        isOpen={isWarningShow}
        closeModal={closeWarningModal}
        action={submit}
        message={`Do you want to ${
          !isActiveSite ? "Deactivate" : "Activate"
        } Site`}
        imgSrc="/images/warning.png"
      />
      {isLoading ? (
        <div className=" w-full h-screen flex justify-center">
          <LogoLoading />
        </div>
      ) : (
        <div className=" mb-20 w-full flex flex-col items-start space-y-4">
          <div className=" w-full flex  justify-between items-center">
            <PageTitle titleText={"Site Creation"} />
            {siteLength === 0 ? null : (
              <CommonButton
                onClick={backToList}
                titleText="Back"
                width="w-24"
                height="h-8"
                color="bg-midGreen"
              />
            )}
          </div>

          <div className=" w-full flex flex-row justify-between">
            <div className=" flex flex-col items-start space-y-2">
              <div className="flex items-center space-x-1">
                <InputLebel titleText={"Country"} />
                <span className="text-red-500 font-bold">*</span>
              </div>
              <CommonDropDownSearch
                placeholder="Select Country"
                onChange={handleChange}
                value={countryList}
                options={countryListFromOracle}
                width="w-96"
                disable={isDisable || isActiveDisable}
              />
              {siteError.country && (
                <ValidationError title={siteError.country} />
              )}
            </div>
            <div className="flex flex-col items-start space-y-2">
              <div className="flex items-center space-x-1">
                <InputLebel titleText={"Site Name"} />
                <span className="text-red-500 font-bold">*</span>
              </div>
              {/* <TextInputField
                                    hint='Dhaka,Bangladesh'
                                    onChangeData={(e) => { setAddressLine1(e.target.value) }}
                                /> */}
              <CommonInputField
                type="text"
                inputRef={addressLine1Ref}
                onChangeData={handleAddressLine1Change}
                hint="Banani, Dhaka"
                disable={isDisable || isActiveDisable || !!siteId}
                maxCharacterlength={15}
              />
              <p className=" text-xs font-mon">
                Maximum 15 letters including space.
              </p>
              {siteError.addressLine1 && (
                <ValidationError title={siteError.addressLine1} />
              )}

              {errorMessage && <ValidationError title={errorMessage} />}
            </div>
          </div>
          <div className="w-full flex flex-row justify-between">
            <div className="flex flex-col items-start space-y-2">
              <div className="flex items-center space-x-1">
                <InputLebel titleText={"Site Address"} />
                <span className="text-red-500 font-bold">*</span>
              </div>
              <CommonInputField
                type="text"
                inputRef={addressLine2Ref}
                onChangeData={handleAdressLine2Change}
                hint="Dhaka,Bangladesh"
                disable={isDisable || isActiveDisable}
              />
              {siteError.addressLine2 && (
                <ValidationError title={siteError.addressLine2} />
              )}
            </div>
            <div className="flex flex-col items-start space-y-2">
              <InputLebel titleText={"City/State"} />
              <CommonInputField
                type="text"
                inputRef={cityRef}
                onChangeData={handleCityChange}
                hint="Dhaka"
                disable={isDisable || isActiveDisable}
              />
              {siteError.city && <ValidationError title={siteError.city} />}
            </div>
          </div>
          <div className="w-full flex flex-row justify-between">
            <div className="flex flex-col items-start space-y-2">
              <InputLebel titleText={"Post/ZIP Code"} />
              <CommonInputField
                type="text"
                inputRef={zipRef}
                onChangeData={handleZipChange}
                hint="1234"
                disable={isDisable || isActiveDisable}
              />
              {siteError.zip && <ValidationError title={siteError.zip} />}
            </div>
            <div className="flex flex-col items-start space-y-2">
              <InputLebel titleText={"Phone"} />
              <CommonInputField
                type="text"
                inputRef={phoneRef}
                onChangeData={handlePhoneChange}
                hint="+880 17XXX8763XX"
                disable={isDisable || isActiveDisable}
              />
              {siteError.phone && <ValidationError title={siteError.phone} />}
            </div>
          </div>
          <div className="w-full flex flex-row justify-between items-center">
            <div className="flex flex-col items-start space-y-2">
              <InputLebel titleText={"Email"} />
              <CommonInputField
                type="text"
                inputRef={emailRef}
                onChangeData={handleEmailChange}
                hint="email@example.com"
                disable={isDisable || isActiveDisable}
              />
              {siteError.email && <ValidationError title={siteError.email} />}
            </div>
            <div className="flex flex-col items-start space-y-2">
              <InputLebel titleText={"Bank"} />
              <CommonDropDownSearch
                placeholder="Select Banks"
                onChange={handleBankChange}
                value={viewBankList}
                options={bankList}
                width="w-96"
                disable={isDisable || isActiveDisable}
                isMutiSelect={true}
                maxSelections={1000}
              />
            </div>
            {/* { 
                      siteDetails?.ID==null?
                      null:
                      
                      <div className="form-control w-52">
    <label className="cursor-pointer label">
      <span className="label-text">{isActiveSite?"Deactive":"Active"}</span> 
      <input  onChange={handleActivation} type="checkbox" className={`toggle ${isActiveSite?"bg-midGreen border-midGreen":"bg-graishColor"}`} checked={isActiveSite?true:false} />
    </label>
  </div>} */}
          </div>

          <div className="w-full flex flex-row justify-between items-center">
            <div className=" w-96 flex flex-col items-start space-y-2">
              <div className="flex items-center space-x-1">
                <InputLebel titleText={"Invoice Currency"} />
                <span className="text-red-500 font-bold">*</span>
              </div>
              <CommonDropDownSearch
                placeholder="Select Currency "
                onChange={handleCurrencyFromOracleChange}
                value={currencyFromOracle}
                options={currencyListFromOracle}
                width="w-96"
                disable={isDisable || isActiveDisable}
              />
              {siteError.currencyCode && (
                <ValidationError title={siteError.currencyCode} />
              )}
            </div>

            <div className=" w-96 flex flex-col items-start space-y-2">
              <div className="flex items-center space-x-1">
                <InputLebel titleText={"Payment Currency"} />
                <span className="text-red-500 font-bold">*</span>
              </div>
              <CommonDropDownSearch
                placeholder="Select Currency "
                onChange={handlePaymentCurrency}
                value={paymentCurrencyFromOracle}
                options={paymentCurrencyList}
                width="w-96"
                disable={isDisable || isActiveDisable}
              />
              {siteError.paymentCurrencyCode && (
                <ValidationError title={siteError.paymentCurrencyCode} />
              )}
            </div>
          </div>

          <div className="w-full flex flex-row justify-between items-center">
            {siteDetails?.ID == null || isRegCompelte !== "1" ? null : (
              <div className="form-control w-52">
                <label className="cursor-pointer label">
                  <span className="label-text">
                    {isActiveSite ? "Active" : "Deactive"}
                  </span>
                  <input
                    disabled={isDisable || isInProcess}
                    type="checkbox"
                    className="toggle border-gray-300 bg-white"
                    style={
                      {
                        "--tglbg": isActiveSite ? "#00A76F" : "#ececec",
                      } as React.CSSProperties
                    }
                    checked={isActiveSite ?? false}
                    onChange={() => handleActivation()}
                  />
                </label>
              </div>
            )}
          </div>

          {
            // (isRegCompelte === "0" && siteLength === 0) ||
            // primarySite === "Y"

            siteLength <= 1 ? (
              <>
                <div className="flex items-center space-x-6">
                  <div>
                    <span className="font-mon font-semibold">
                      Primary Site{" "}
                    </span>
                    <span className="text-red-500 font-bold">*</span>
                  </div>

                  <button
                    disabled={
                      isDisable || isActiveDisable || primarySite === "Y"
                    }
                    // onClick={() => {
                    //   isSelectedAll ? unselectAll() : selectAll();
                    // }}
                    onClick={handleCheckbox}
                    className={`w-4 h-4 rounded-md ${
                      isChecked || primarySite === "Y"
                        ? "bg-midGreen border-none"
                        : " border-[0.5px] border-borderColor bg-whiteColor"
                    } flex justify-center items-center`}
                  >
                    {/* {<img src="/images/check.png" alt="check" className=" w-2 h-2" />}
                     */}
                    {(isChecked || primarySite === "Y") && (
                      <img
                        src="/images/check.png"
                        alt="check"
                        className="w-2 h-2"
                      />
                    )}
                  </button>
                </div>

                {siteError.checkbox && (
                  <ValidationError title={siteError.checkbox} />
                )}
              </>
            ) : null
          }

          <div className=" h-10"></div>

          {/* {isRegCompelte === "1" ? (
            <div>
              <InputLebel titleText={"Selected Organizations"} />
              <div className="h-4"></div>
              <div className=" w-full grid grid-cols-3 gap-6 items-center">
                {selectedOrganizationList.map((e, i) => (
                  <div
                    key={e.ORGANIZATION_ID}
                    className=" flex flex-row space-x-2 items-center w-48 px-1   "
                  >
                    <button
                      disabled={true}
                      onClick={() => {
                        
                      }}
                      className={`w-4 h-4 rounded-md
                                            ${
                                              e.IS_ASSOCIATED === 1
                                                ? "bg-midGreen border-none"
                                                : " border-[0.5px] border-borderColor bg-whiteColor"
                                            }
                                             flex justify-center items-center   `}
                    >
                      {
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-3 h-3 text-white"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      }
                    </button>
                    <p className=" text-blackColor text-sm font-mon font-medium text-start flex-1">
                      {e.NAME}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null} */}

          {siteId === null ? (
            <div className="text-lg text-[#663C00] bg-[#FFF4E5] w-full h-14 px-4 flex items-center rounded-md space-x-2 font-semibold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-7 h-7 text-red-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>

              <p>
                Before 'Save & Next' you must have to select minimum one
                operating unit
              </p>
            </div>
          ) : (
            ""
          )}

          {/* <div className=" w-full flex space-x-4 items-center ">
            <p className=" font-mon font-medium text-black">Select All</p>
            <button
              disabled={isDisable || isActiveDisable}
              onClick={() => {
                isSelectedAll ? unselectAll() : selectAll();
              }}
              className={`w-4 h-4 rounded-md
                                            ${
                                              isSelectedAll
                                                ? "bg-midGreen border-none"
                                                : " border-[0.5px] border-borderColor bg-whiteColor"
                                            }
                                             flex justify-center items-center   `}
            >
              {<img src="/images/check.png" alt="check" className=" w-2 h-2" />}
            </button>
          </div> */}

          <div className=" w-full grid grid-cols-3 gap-6 items-center">
            {organizationList.map((e, i) => (
              <div
                key={e.ORGANIZATION_ID}
                className=" flex flex-row space-x-2 items-center w-48 px-1   "
              >
                <button
                  disabled={isDisable || isActiveDisable}
                  onClick={() => {
                    handleGrantRevokeOrganization(i);
                    addOrgToSelectedSitelist(e);
                  }}
                  className={`w-4 h-4 rounded-md
                                            ${
                                              e.IS_ASSOCIATED === 1
                                                ? "bg-midGreen border-none"
                                                : " border-[0.5px] border-borderColor bg-whiteColor"
                                            }
                                             flex justify-center items-center   `}
                >
                  {
                    <img
                      src="/images/check.png"
                      alt="check"
                      className=" w-2 h-2"
                    />
                  }
                </button>
                <p className=" text-blackColor text-sm font-mon font-medium text-start flex-1">
                  {e.NAME}
                </p>
              </div>
            ))}
          </div>
          {siteError.selectedOrgList && (
            <ValidationError title={siteError.selectedOrgList} />
          )}
          <div className=" h-10"></div>

          <div className="  w-full flex flex-row justify-end items-end space-x-4">
            {submitLoading ? (
              <div className=" w-44 flex justify-center items-center">
                <CircularProgressIndicator />
              </div>
            ) : (
              <CommonButton
                onClick={submit}
                titleText={"Save & Next"}
                disable={isDisable || isActiveDisable}
                width="w-44"
              />
            )}

            {/* {isFinalSubmissionLoading ? (
              <div className=" w-40 flex justify-center items-center">
                <CircularProgressIndicator />
              </div>
            ) : (
              <CommonButton
                disable={isDisable}
                titleText={"Submit"}
                onClick={showWarning}
                width="w-40"
                color="bg-midGreen"
              />
            )} */}
          </div>

          {/* <div className=" h-16"></div> */}
          {/* <div className="w-full  flex justify-center items-center  ring-1 ring-borderColor bg-gray-50">
            <table className="w-full  px-16  ">
              <thead className="   ">
                <tr className=" w-full h-14 bg-lightGreen rounded-t-md">
                  <th className="mediumText ">Sequence</th>
                  <th className="mediumText ">Perfomrmed By</th>
                  <th className="mediumText ">Date</th>
                  <th className="mediumText ">Action</th>
                  <th className="mediumText ">Remarks</th>
                </tr>
              </thead>

              {hierarchLoading ? (
                // <div className=' w-full flex justify-center items-center'>
                //     <LogoLoading/>
                // </div>
                <tbody>
                  <td></td>
                  <td></td>
                  <td>
                    <LogoLoading />
                  </td>
                  <td></td>
                  <td></td>
                </tbody>
              ) : (
                hierarchyList.map((item, index) => (
                  <tbody>
                    <tr
                      key={item.APPROVER_ID}
                      className={`text-center h-14 ${
                        index !== 0
                          ? "border-t border-borderColor h-[0.1px] "
                          : ""
                      }`}
                    >
                      <td className="smallText h-14">{item.STAGE_LEVEL}</td>
                      <td className="smallText h-14">
                        {item.APPROVER_FULL_NAME}
                      </td>
                      <td className="smallText h-14">
                        {item.ACTION_DATE !== "N/A" ? item.ACTION_DATE : "N/A"}
                      </td>
                      <td className="font-mon text-sm   font-semibold h-14">
                        {item.ACTION_CODE === "0" ? (
                          <p className=" text-sm font-mon text-redColor">
                            Rejected
                          </p>
                        ) : item.ACTION_CODE === "1" ? (
                          <p className=" text-sm font-mon text-midGreen">
                            Approved
                          </p>
                        ) : (
                          <p className=" text-sm font-mon  text-yellow-500">
                            Pending
                          </p>
                        )}
                      </td>
                      <td className="smallText h-14">
                        {item.ACTION_NOTE !== "N/A" ? item.ACTION_NOTE : "N/A"}
                      </td>
                    </tr>
                  </tbody>
                ))
              )}
            </table>
          </div> */}
          <div className="h-20"></div>
        </div>
      )}
    </div>
  );
}
