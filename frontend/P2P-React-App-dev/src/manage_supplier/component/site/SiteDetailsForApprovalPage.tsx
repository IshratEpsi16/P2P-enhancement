import React, { useState, useRef, useEffect } from "react";
import InputLebel from "../../../common_component/InputLebel";
import Select from "react-tailwindcss-select";
import CommonInputField from "../../../common_component/CommonInputField";
import CommonButton from "../../../common_component/CommonButton";
import ApproveHierarchyTable from "../../../common_component/ApproveHierarchyTable";
import CommonDropDownSearch from "../../../common_component/CommonDropDownSearch";

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

import ValidationError from "../../../Alerts_Component/ValidationError";
import PageTitle from "../../../common_component/PageTitle";
import TextInputField from "../../../common_component/TextInputFieldTwo";
import CircularProgressIndicator from "../../../Loading_component/CircularProgressIndicator";

import { OrganizationInterface } from "../../../role_access/interface/OrganizationInterface";
import OrganizationListService from "../../../role_access/service/OrganizationListService";
import SupplierSiteInterface from "../../../registration/interface/SupplierSiteInterface";
import { useAuth } from "../../../login_both/context/AuthContext";
import { useSiteApprovalViewContext } from "../../interface/contact/SiteApprovalViewContext";
import SiteDetailsViewForApprovalService from "../../service/site/SiteDetailsViewForApprovalService";
import OrgListForSupplierService from "../../../registration/service/site_creation/OrgListForSupplierService";
import SiteOrgViewForApprovalService from "../../service/site/SiteOrgViewForApprovalService";
import CountryListFromOracleService from "../../../registration/service/basic_info/CountryListFromOracle";
import HierachyListByModuleService from "../../../registration/service/approve_hierarchy/HierarchyListByModuleService";
import HierarchyInterface from "../../../registration/interface/hierarchy/HierarchyInterface";
import BankListService from "../../../registration/service/bank/BankListService";
import BankInterface from "../../../registration/interface/BankInterface";
import BankListInSiteService from "../../../registration/service/site_creation/BankListInSiteService";
import BankInSiteApprovalService from "../../service/site/BankInSiteApprovalService";

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

export default function SiteDetailsForApprovalPage() {
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
  const [createdSiteId, setCreatedSiteId] = useState<number | null>(null);

  const [organizationList, setOrganizationList] = useState<
    OrganizationInterface[] | []
  >([]);

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
      const result = await CountryListFromOracleService(token!);
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
    useSiteApprovalViewContext();
  const { token, submissionStatus, supplierId } = useAuth();

  const navigate = useNavigate();

  //token validation
  useEffect(() => {
    console.log("render");

    const isTokenExpired = !isTokenValid(token!);
    if (isTokenExpired) {
      localStorage.removeItem("token");
      showErrorToast("Please Login Again..");
      setTimeout(() => {
        navigate("/");
      }, 1200);
    } else {
      getOrganization();
      countryGet();
      getApproverHierachy();
      GetBankListFromOracle();
      if (siteId !== null) {
        getSiteDetails();
        getBankListFromSite(siteId);
      }
    }
  }, []);
  //token validation

  // re-render on set data

  useEffect(() => {
    console.log("render");
    if (siteDetails) {
      setData();
    }
  }, [siteDetails, countryListFromOracle]);

  //re-render on set data

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

  const getSiteDetails = async () => {
    setIsLoading(true);
    try {
      const result = await SiteDetailsViewForApprovalService(
        token!,
        supplierId!,
        siteId!
      );
      if (result.data.status === 200) {
        setSiteDetails(result.data.data);
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
  //     const result = await OrgListForSupplierService(token!,siteId);
  //     if (result.data.status === 200) {
  //         setOrganizationList(result.data.data);
  //        // Explicitly provide the type for 'org' using the OrganizationInterface
  //     const updatedSelectedOrgList = result.data.data.filter((org: OrganizationInterface) => org.IS_ASSOCIATED === 1);
  //     setPreSelectedOrgList(updatedSelectedOrgList);
  //     }

  // }

  const [hierarchLoading, setHierarchyLoading] = useState<boolean>(false);
  const [hierarchyUserProfilePicturePath, setHierarchyUserProfilePicturePath] =
    useState<string>("");
  const [hierarchyList, setHierarchyList] = useState<HierarchyInterface[] | []>(
    []
  );
  const getApproverHierachy = async () => {
    // const decodedToken = decodeJWT(token!);

    // Extract USER_ID from the decoded payload
    // const userId = decodedToken?.decodedPayload?.USER_ID;
    try {
      setHierarchyLoading(true);
      const result = await HierachyListByModuleService(
        token!,
        supplierId!,
        "Supplier Approval"
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

  const getOrganization = async () => {
    const result = await SiteOrgViewForApprovalService(
      token!,
      supplierId!,
      siteId!
    );
    if (result.data.status === 200) {
      setOrganizationList(result.data.data);
      console.log("organization: ", result.data.data);
      // Explicitly provide the type for 'org' using the OrganizationInterface SiteOrgViewForApprovalService
      // const updatedSelectedOrgList = result.data.data.filter((org: OrganizationInterface) => org.IS_ASSOCIATED === 1);
      // setPreSelectedOrgList(updatedSelectedOrgList);
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

    // Remove elements from selectedOrgList that are also in preSelectedOrgList
    // const filteredSelectedOrgList = updatedSelectedOrgList.filter(org =>
    //     !preSelectedOrgList.some(preSelectedOrg => preSelectedOrg.ORGANIZATION_ID === org.ORGANIZATION_ID)
    // );

    setSelectedOrgList(updatedSelectedOrgList);
    // setPreSelectedOrgList(updatedSelectedOrgList);
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
      setAddressLine1(siteDetails?.ADDRESS_LINE1 || "");
      addressLine2Ref.current.value = siteDetails?.ADDRESS_LINE2 || "";
      setAddressLine2(siteDetails?.ADDRESS_LINE2 || "");
      cityRef.current.value = siteDetails?.CITY_STATE || "";
      setCity(siteDetails?.CITY_STATE || "");
      if (siteDetails?.ZIP_CODE) {
        zipRef.current.value = siteDetails?.ZIP_CODE?.toString() || "";
        setZip(siteDetails?.ZIP_CODE.toString() || "");
      }

      phoneRef.current.value = siteDetails?.MOBILE_NUMBER || "";
      console.log("mobile", siteDetails?.MOBILE_NUMBER);

      setPhone(siteDetails?.MOBILE_NUMBER || "");
      emailRef.current.value = siteDetails?.EMAIL || "";
      setEmail(siteDetails?.EMAIL || "");

      const selectedCountry = countryListFromOracle.find(
        (option) => option.value === siteDetails?.COUNTRY!
      );
      if (selectedCountry) {
        setCountryList(selectedCountry);
        setCountry(selectedCountry.value);
      } else {
        setCountryList(null);
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
  const handleAddressLine1Change = (value: string) => {
    setAddressLine1(value);
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
      selectedOrgList?: string;
    } = {};

    if (country === "") {
      errors.country = "Please Select Country";
    }
    if (!addressLine1.trim()) {
      errors.addressLine1 = "Please Enter Address Line1";
    }
    if (!addressLine2.trim()) {
      errors.addressLine2 = "Please Enter Address Line2";
    }
    if (!city.trim()) {
      errors.city = "Please Enter City";
    }
    if (!email.trim()) {
      errors.email = "Please Enter Email";
    }
    if (!phone.trim()) {
      errors.phone = "Please Enter Phone";
    }
    if (!zip.trim()) {
      errors.zip = "Please Enter Zip";
    }
    if (selectedOrgList.length === 0) {
      errors.selectedOrgList = "Please select at lest one organization";
    }

    setSiteError(errors);
    return Object.keys(errors).length === 0;
  };

  const submit = async () => {
    // if (validate()) {
    //     console.log(addressLine1Ref.current?.value);
    //     const result = await AddUpdateSiteService(token!, siteId!, country, addressLine1, addressLine2, city, email, phone, zip);
    //     showErrorToast(result.data.message);
    // }
    // else {
    //     console.log(addressLine1Ref.current?.value);
    // }
    // if (validate()) {
    //     try {
    //         setSubmitLoading(true);
    //         const result = await AddUpdateSiteService(token!, siteId!, country, addressLine1, addressLine2, city, email, phone, zip);
    //         if (result.data.status === 200) {
    //             setSubmitLoading(false);
    //             setSiteLength(siteLength + 1);
    //             showSuccessToast(result.data.message);
    //             AddOrgToSite(siteId==null?result.data.id:siteId);
    //             console.log();
    //             // if (siteId === null) {
    //             //     setTimeout(() => {
    //             //         setPage(1);
    //             //     }, 1200);
    //             // }
    //             // else {
    //             //     getSiteDetails();
    //             // }
    //             // showSuccessToast(result.data.message);
    //             // Do not reset state values here to keep the text field values unchanged.
    //         } else {
    //             setSubmitLoading(false);
    //             showErrorToast(result.data.message);
    //         }
    //     } catch (error) {
    //         setSubmitLoading(false);
    //         showErrorToast("something went wrong");
    //     }
    // }
  };

  const AddOrgToSite = async (createdId: number) => {
    // console.log(createdId);
    // console.log(selectedOrgList.length);
    // try{
    //     for(let i=0;i<selectedOrgList2.length;i++){
    //         const result=await AddOrgToSiteService(token!,createdId,selectedOrgList2[i]);
    //     }
    //     if (siteId === null) {
    //         setTimeout(() => {
    //             setPage(1);
    //         }, 1200);
    //     }
    //     else {
    //         getSiteDetails();
    //     }
    // }
    // catch(error){
    //     setSubmitLoading(false);
    //     showErrorToast("something went wrong");
    // }
  };

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
      const result = await BankListService(token!);
      console.log(result.data.data.length);

      if (result.data.status === 200) {
        const transformedData = result.data.data.map((item: BankInterface) => ({
          value: item.ID,
          label: item.BANK_NAME,
        }));
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

  const getBankListFromSite = async (createdId: number) => {
    console.log(createdId);

    try {
      const result = await BankInSiteApprovalService(
        token!,
        supplierId!,
        createdId
      );
      console.log(result.data);

      console.log(result.data.data.length);

      if (result.data.status === 200) {
        const transformedData = result.data.data.map((item: any) => ({
          value: item.ID,
          label: item.BANK_NAME,
        }));
        setViewBankList(transformedData);
        setSelectedBankList(transformedData);
        setSelectedBankList2(transformedData);
      }
    } catch (error) {
      showErrorToast("Something went wrong");
    }
  };

  //back to list

  const backToList = () => {
    setPage(1);
    setSiteId(null);
  };
  return (
    <div className="bg-whiteColor">
      <SuccessToast />
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
              <InputLebel titleText={"Country"} />
              <CommonDropDownSearch
                placeholder="Select Country"
                onChange={handleChange}
                value={countryList}
                options={countryListFromOracle}
                width="w-96"
                disable={isDisable}
              />
              {siteError.country && (
                <ValidationError title={siteError.country} />
              )}
            </div>
            <div className="flex flex-col items-start space-y-2">
              <InputLebel titleText={"Address Line-1"} />
              {/* <TextInputField
                                    hint='Dhaka,Bangladesh'
                                    onChangeData={(e) => { setAddressLine1(e.target.value) }}
                                /> */}
              <CommonInputField
                type="text"
                inputRef={addressLine1Ref}
                onChangeData={handleAddressLine1Change}
                hint="Dhaka,Bangladesh"
                disable={isDisable}
              />
              {siteError.addressLine1 && (
                <ValidationError title={siteError.addressLine1} />
              )}
            </div>
          </div>
          <div className="w-full flex flex-row justify-between">
            <div className="flex flex-col items-start space-y-2">
              <InputLebel titleText={"Address Line-2"} />
              <CommonInputField
                type="text"
                inputRef={addressLine2Ref}
                onChangeData={handleAdressLine2Change}
                hint="Dhaka,Bangladesh"
                disable={isDisable}
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
                disable={isDisable}
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
                disable={isDisable}
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
                disable={isDisable}
              />
              {siteError.phone && <ValidationError title={siteError.phone} />}
            </div>
          </div>

          <div className="w-full flex flex-row justify-between">
            <div className="flex flex-col items-start space-y-2">
              <InputLebel titleText={"Email"} />
              <CommonInputField
                type="text"
                inputRef={emailRef}
                onChangeData={handleEmailChange}
                hint="email@example.com"
                disable={isDisable}
              />
              {siteError.email && <ValidationError title={siteError.email} />}
            </div>
            <div className="flex flex-col items-start space-y-2">
              <InputLebel titleText={"Bank"} />
              <CommonDropDownSearch
                placeholder="Select Max Two Banks"
                onChange={handleBankChange}
                value={viewBankList}
                options={bankList}
                width="w-96"
                disable={isDisable}
                isMutiSelect={true}
                maxSelections={1000}
              />
            </div>
          </div>

          <div className=" h-10"></div>

          <div>
            <p className="font-semibold">Selected company for to do business</p>
          </div>

          <div className="w-full grid grid-cols-4 gap-6 items-center border-[0.5px] border-gray-200 px-3 py-3 rounded-xl shadow-sm">
            {organizationList.map((e, i) => (
              <>
                {e.IS_ASSOCIATED === 1 && (
                  <div className=" flex flex-row space-x-2 items-center w-48 px-1   ">
                    <button
                      disabled={isDisable}
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
                      {e.NAME}({e.SHORT_CODE})
                    </p>
                  </div>
                )}
              </>
            ))}
          </div>
          {siteError.selectedOrgList && (
            <ValidationError title={siteError.selectedOrgList} />
          )}
          <div className=" h-10"></div>

          <div className="w-full  flex justify-center items-center  ring-1 ring-borderColor bg-gray-50">
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
          </div>
          <div className=" h-10"></div>

          <div className="  w-full flex flex-row justify-end items-end"></div>
        </div>
      )}
    </div>
  );
}
