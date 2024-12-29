import React, { useEffect, useRef, useState } from "react";
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
import { useContactApprovalViewContext } from "../../interface/contact/ContactApprovalViewContext";
import SupplierContactInterface from "../../../registration/interface/SupplierContactInterface";
import ContactListViewForApprovalService from "../../service/contact/ContactListViewForApprovalService";
import PageTitle from "../../../common_component/PageTitle";
import CommonButton from "../../../common_component/CommonButton";
import SupplierContactDetailsInterface from "../../../registration/interface/SupplierContactDetailsInterface";
import moment from "moment";
import SupplierContactDetailsService from "../../../registration/service/contact/SupplierContactDetailsService";
import ContactDetailsViewForApprovalService from "../../service/contact/ContactDetailsViewForApprovalService";
import CheckIcon from "../../../icons/CheckIcon";
import FilePickerInput from "../../../common_component/FilePickerInput";
import { OrganizationInterface } from "../../../role_access/interface/OrganizationInterface";
import OrgListForSupplierService from "../../../registration/service/site_creation/OrgListForSupplierService";
import SiteListInContactService from "../../../registration/component/contact/service/SiteListInContactService";
import SupplierSiteInterface from "../../../registration/interface/SupplierSiteInterface";
import SiteListService from "../../../registration/service/site_creation/SiteListService";
import fetchFileService from "../../../common_service/fetchFileService";
import CircularProgressIndicator from "../../../Loading_component/CircularProgressIndicator";

interface Site {
  value: string;
  label: string;
}

export default function ContactDetailsViewForApproval() {
  const [isAgent, setIsAgent] = useState<boolean>(false);
  const handleAgent = () => {
    setIsAgent(!isAgent);
  };

  // if user disable agent after set data then after enabling agent data has to be set again for that this useEffect
  useEffect(() => {
    console.log("set call");

    if (isAgent) {
      setData();
      console.log("set call 2");
    }
  }, [isAgent]);

  const [contactDetails, setContactDetails] =
    useState<SupplierContactDetailsInterface | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { contactId, setPage, setContactId, contactLength, setContactLength } =
    useContactApprovalViewContext();
  const { token, submissionStatus, supplierId } = useAuth();

  const navigate = useNavigate();

  //token validation
  useEffect(() => {
    console.log(typeof contactId);

    const isTokenExpired = !isTokenValid(token!);
    if (isTokenExpired) {
      localStorage.removeItem("token");
      showErrorToast("Please Login Again..");
      setTimeout(() => {
        navigate("/");
      }, 1200);
    } else {
      if (contactId !== null) {
        getContactDetails();
      }
    }
  }, []);
  //token validation

  useEffect(() => {
    console.log("executed");
    if (contactDetails) {
      setData();
      console.log("executed");
    }
  }, [contactDetails]);

  //get details

  const getContactDetails = async () => {
    setIsLoading(true);
    try {
      const result = await ContactDetailsViewForApprovalService(
        token!,
        supplierId!,
        contactId!
      );
      console.log(result);

      if (result.data.status === 200) {
        setContactDetails(result.data);
        getSiteList();
        setIsLoading(false);
      } else {
        setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Something went wrong");
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

  //contact person

  const contactNameRef = useRef<HTMLInputElement>(null);
  const ContactpositionRef = useRef<HTMLInputElement | null>(null);
  const contactNumber1Ref = useRef<HTMLInputElement | null>(null);
  const contactNumber2Ref = useRef<HTMLInputElement | null>(null);
  const nidOrPassportRef = useRef<HTMLInputElement | null>(null);
  const contactEmailRef = useRef<HTMLInputElement | null>(null);
  const agentSinceRef = useRef<HTMLInputElement | null>(null);

  const [contactName, setContactName] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [contactNumber1, setContactNumber1] = useState<string>("");
  const [contactNumber2, setContactNumber2] = useState<string>("");
  const [nidOrPassport, setNidOrPassport] = useState<string>("");
  const [contactEmail, setContactEmail] = useState<string>("");
  const [isNid, setIsNid] = useState<boolean>(false);
  const [isPassport, setIsPassport] = useState<boolean>(false);

  const handleContactNameChange = (value: string) => {
    setContactName(value);
  };
  const handleContactPositionChange = (value: string) => {
    setPosition(value);
  };
  const handleContactNumber1Change = (value: string) => {
    setContactNumber1(value);
  };
  const handleContactNumber2Change = (value: string) => {
    setContactNumber2(value);
  };
  const handleNidOrPassportChange = (value: string) => {
    setNidOrPassport(value);
  };
  const handleContactEmailChange = (value: string) => {
    setContactEmail(value);
  };
  const handleIsNid = () => {
    setIsNid(!isNid);
    if (!isNid) {
      setIsPassport(false);
    }
  };

  const handleIsPassport = () => {
    setIsPassport(!isPassport);
    if (!isPassport) {
      setIsNid(false);
    }
  };

  const [nidPassportFileName, setNidPassportFileName] = useState<string | null>(
    null
  );
  const [nidPassportFile, setNidPassportFile] = useState<File | null>(null);

  const handleNidOrPassportFile = (file: File | null) => {
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file);
      setNidPassportFile(file);
    } else {
      // No file selected
      console.log("No file selected");
    }
  };

  const [signatureFileName, setSignatureFileName] = useState<string | null>(
    null
  );
  const [signatureFile, setSignatureFile] = useState<File | null>(null);

  const handleNidSignatureFile = (file: File | null) => {
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file);
      setSignatureFile(file);
    } else {
      // No file selected
      console.log("No file selected");
    }
  };

  //contact person

  //setData

  const setData = () => {
    console.log("set called holo");

    if (
      contactDetails !== null &&
      contactNameRef.current &&
      ContactpositionRef.current &&
      contactNumber1Ref.current &&
      contactNumber2Ref.current &&
      nidOrPassportRef.current &&
      contactEmailRef.current
    ) {
      contactNameRef.current.value = contactDetails?.data.NAME || "";
      setContactName(contactDetails?.data?.NAME!);
      ContactpositionRef.current.value = contactDetails?.data.POSITION || "";
      setPosition(contactDetails?.data?.POSITION!);
      contactNumber1Ref.current.value = contactDetails?.data.MOB_NUMBER_1 || "";
      setContactNumber1(contactDetails?.data?.MOB_NUMBER_2!);
      contactNumber2Ref.current.value = contactDetails?.data.MOB_NUMBER_2 || "";
      setContactNumber2(contactDetails?.data?.MOB_NUMBER_2!);

      nidOrPassportRef.current.value =
        contactDetails?.data.NID_PASSPORT_NUMBER || "";
      setNidOrPassport(contactDetails?.data?.NID_PASSPORT_NUMBER!);
      contactEmailRef.current.value = contactDetails?.data.EMAIL || "";
      setContactEmail(contactDetails?.data?.EMAIL!);
      setIsNid(contactDetails?.data.IS_NID === 1 ? true : false);
      setIsAgent(contactDetails?.data.IS_AGENT === 1 ? true : false);
      setIsPassport(contactDetails?.data.IS_NID === 1 ? false : true);
      if (contactDetails.data.NID_PASSPORT_FILE_NAME != null) {
        setNidPassportFileName(
          contactDetails.data.NID_PASSPORT_ORIGINAL_FILE_NAME!
        );
      }
      if (contactDetails.data.SIGNATURE_FILE_NAME != null) {
        setSignatureFileName(contactDetails.data.SIGNATURE_ORIGINAL_FILE_NAME!);
      }
    }

    if (
      contactDetails !== null &&
      agentNameRef.current &&
      addressRef.current &&
      bdPermissionNoRef.current &&
      ircRef.current &&
      binRef.current &&
      contactPersonRef.current &&
      agentPositionRef.current &&
      mobileNumberRef.current &&
      agentEmailRef.current &&
      agentSinceRef.current
    ) {
      agentNameRef.current.value =
        contactDetails?.data.AGENT_DETAILS.AGENT_NAME || "";
      setAgentName(contactDetails?.data.AGENT_DETAILS.AGENT_NAME);
      addressRef.current.value =
        contactDetails?.data.AGENT_DETAILS.AGENT_ADDRESS || "";
      setAgentAddress(contactDetails?.data.AGENT_DETAILS.AGENT_ADDRESS);
      bdPermissionNoRef.current.value =
        contactDetails?.data.AGENT_DETAILS.BD_PERMISSION_NO || "";
      setBdPermissionNo(contactDetails?.data.AGENT_DETAILS.BD_PERMISSION_NO!);
      ircRef.current.value = contactDetails?.data.AGENT_DETAILS.IRC || "";
      setIrc(contactDetails?.data.AGENT_DETAILS.IRC!);
      binRef.current.value = contactDetails?.data.AGENT_DETAILS.BIN || "";
      setBin(contactDetails?.data.AGENT_DETAILS.BIN!);

      console.log(contactDetails?.data.AGENT_DETAILS.CONTACT_PERSON_NAME);

      contactPersonRef.current.value =
        contactDetails?.data.AGENT_DETAILS.CONTACT_PERSON_NAME || "";

      setAgentContactPerson(
        contactDetails?.data.AGENT_DETAILS.CONTACT_PERSON_NAME
      );
      console.log();

      agentPositionRef.current.value =
        contactDetails?.data.AGENT_DETAILS.CONTACT_PERSON_POSITION || "";
      setAgentPosition(
        contactDetails?.data.AGENT_DETAILS.CONTACT_PERSON_POSITION
      );
      mobileNumberRef.current.value =
        contactDetails?.data.AGENT_DETAILS.BD_PHONE_NUMBER || "";
      setAgentMobileNumber(contactDetails?.data.AGENT_DETAILS.BD_PHONE_NUMBER);
      agentEmailRef.current.value =
        contactDetails?.data.AGENT_DETAILS.EMAIL || "";
      setAgentEmail(contactDetails?.data.AGENT_DETAILS.EMAIL);
      agentSinceRef.current.value =
        moment(contactDetails?.data.AGENT_DETAILS.AGENT_SINCE_DATE).format(
          "DD/MM/YYYY"
        ) || "";
      setAgentSince(
        moment(contactDetails?.data.AGENT_DETAILS.AGENT_SINCE_DATE).format(
          "DD/MM/YYYY"
        )
      );
      if (contactDetails?.data.AGENT_DETAILS.TIN_FILE_NAME != null) {
        setTinFileName(
          contactDetails?.data.AGENT_DETAILS.TIN_FILE_ORIGINAL_NAME
        );
      }
    }
  };

  //agent

  const agentNameRef = useRef<HTMLInputElement | null>(null);
  const addressRef = useRef<HTMLInputElement | null>(null);
  const bdPermissionNoRef = useRef<HTMLInputElement | null>(null);
  const ircRef = useRef<HTMLInputElement | null>(null);
  const binRef = useRef<HTMLInputElement | null>(null);
  const contactPersonRef = useRef<HTMLInputElement | null>(null);
  const agentPositionRef = useRef<HTMLInputElement | null>(null);
  const mobileNumberRef = useRef<HTMLInputElement | null>(null);
  const agentEmailRef = useRef<HTMLInputElement | null>(null);

  const [AgentName, setAgentName] = useState<string>("");
  const [agentAddress, setAgentAddress] = useState<string>("");
  const [bdPremissionNo, setBdPermissionNo] = useState<string>("");
  const [irc, setIrc] = useState<string>("");
  const [bin, setBin] = useState<string>("");
  const [agentConatctPerson, setAgentContactPerson] = useState<string>("");
  const [agentMobileNumber, setAgentMobileNumber] = useState<string>("");
  const [agentEmail, setAgentEmail] = useState<string>("");
  const [agentSince, setAgentSince] = useState<string>("");
  const [agentPosition, setAgentPosition] = useState<string>("");

  const handleAgentNameChange = (value: string) => {
    setAgentName(value);
  };
  const handleAgentAddressChange = (value: string) => {
    setAgentAddress(value);
  };
  const handleBdPermissionNo = (value: string) => {
    setBdPermissionNo(value);
  };
  const handleIrcChange = (value: string) => {
    setIrc(value);
  };
  const handleBinChange = (value: string) => {
    setBin(value);
  };
  const handleAgentContactPersonChange = (value: string) => {
    setAgentContactPerson(value);
  };

  const handleAgentMobileNumberChange = (value: string) => {
    setAgentMobileNumber(value);
  };

  const handleAgentEmailChange = (value: string) => {
    setAgentEmail(value);
  };

  const handleAgentSinceChange = (value: string) => {
    setAgentSince(value);
  };

  const handleAgentPositionChange = (value: string) => {
    setAgentPosition(value);
  };

  // const [agentSince, setAgentSince] = useState({
  //     startDate: null,
  //     endDate: null, // Set the endDate to the end of the current year
  // });

  // const handleAgentSinceChange = (newValue: any) => {
  //     setAgentSince(newValue);
  //     // Handle the selected date here
  // };

  //file

  const [tinFileName, setTinFileName] = useState<string | null>(null);
  const [tinFile, setTinFile] = useState<File | null>(null);

  const handleTin = (file: File | null) => {
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file);
      setTinFile(file);
    } else {
      // No file selected
      console.log("No file selected");
    }
  };

  // agent

  //submit

  // const [newContactId, setNewContactId] = useState<number | null>(null);

  // useEffect(() => {
  //     if (newContactId) {
  //         getContactDetails();
  //     }
  // },);

  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

  const submitFirst = async () => {
    // setIsSubmitLoading(true);
    // try {
    //     let result;
    //     if (contactId !== null) {
    //         // If contactId is not null, include it in the function call
    //         result = await AddUpdateContactDetailsService(
    //             token!,
    //             contactId,
    //             contactName,
    //             contactEmail,
    //             position,
    //             contactNumber1,
    //             contactNumber2,
    //             nidOrPassport,
    //             isNid ? "1" : "0",
    //             nidPassportFile,
    //             signatureFile,
    //             '', '', '', '', '', '', '', '', '', '', '', tinFile
    //         );
    //     } else {
    //         // If contactId is null, call the function without it
    //         result = await AddUpdateContactDetailsService(
    //             token!,
    //             null,
    //             contactName,
    //             contactEmail,
    //             position,
    //             contactNumber1,
    //             contactNumber2,
    //             nidOrPassport,
    //             isNid ? "1" : "0",
    //             nidPassportFile,
    //             signatureFile,
    //             '', '', '', '', '', '', '', '', '', '', '', tinFile
    //         );
    //     }
    //     console.log(result);
    //     if (result.data.status === 200) {
    //         setIsSubmitLoading(false);
    //         setContactLength(contactLength + 1);
    //         showSuccessToast(result.data.message);
    //         if (contactId === null) {
    //             setTimeout(() => {
    //                 setPage(1);
    //             }, 1200);
    //         }
    //         else {
    //             getContactDetails();
    //         }
    //     }
    //     else {
    //         setIsSubmitLoading(false);
    //         showErrorToast(result.data.message);
    //         // if (contactId !== null) {
    //         //     getContactDetails();
    //         //     log
    //         // }
    //     }
    // }
    // catch (error) {
    //     setIsSubmitLoading(false);
    //     showErrorToast("Something went wrong");
    // }
  };

  const submit = async () => {
    // console.log(agentConatctPerson);
    // setIsSubmitLoading(true);
    // try {
    //     const result = await AddUpdateContactDetailsService(token!, contactId !== null ? contactId : null, contactName, contactEmail, position, contactNumber1, contactNumber2, nidOrPassport, isNid ? "1" : "0", nidPassportFile, signatureFile, isAgent ? '1' : '0', AgentName, agentEmail, agentAddress, agentSince, agentConatctPerson, agentPosition, agentMobileNumber, irc, bin, bdPremissionNo, tinFile);
    //     console.log(result);
    //     if (result.data.status === 200) {
    //         setIsSubmitLoading(false);
    //         showSuccessToast(result.data.message);
    //         if (contactId === null) {
    //             setTimeout(() => {
    //                 setPage(1);
    //             }, 1200);
    //         }
    //         else {
    //             getContactDetails();
    //         }
    //     }
    //     else {
    //         setIsSubmitLoading(false);
    //         showErrorToast(result.data.message);
    //     }
    // }
    // catch (error) {
    //     setIsSubmitLoading(false);
    //     showErrorToast("Something went wrong");
    // }
  };

  //back

  const back = () => {
    setPage(1);
    setContactId(null);
  };

  //add site to contact

  const [organizationList, setOrganizationList] = useState<
    OrganizationInterface[] | []
  >([]);
  const [selectedOrganizationList, setSelectedOrganizationList] = useState<
    OrganizationInterface[] | []
  >([]);

  const [selectedOrgList, setSelectedOrgList] = useState<
    OrganizationInterface[]
  >([]);

  const [selectedOrgList2, setSelectedOrgList2] = useState<
    OrganizationInterface[]
  >([]);

  const [isOrganizationLoading, setIsOrganizationLoading] =
    useState<boolean>(false);

  useEffect(() => {
    getExistingalist();
  }, []);

  const getOrganization = async (siteId: number) => {
    console.log(siteId);

    // const result = await ContactOuListService(regToken!, contactId);
    setIsOrganizationLoading(true);
    const result = await OrgListForSupplierService(token!, siteId);

    if (result.data.status === 200) {
      // setOrganizationList(result.data.data);
      const selected = result.data.data.filter(
        (item: OrganizationInterface) => item.IS_ASSOCIATED === 1
      );
      setOrganizationList(selected);
      setIsOrganizationLoading(false);
      // console.log(selected);

      // setSelectedOrganizationList(selected);
      // if (selected.length === result.data.data.length) {
      //   setIsSelectAll(true);
      // }
    } else {
      setIsOrganizationLoading(false);
      showErrorToast(result.data.message);
    }
  };

  useEffect(() => {
    getExistingalist();
  }, []);

  const [siteList, setSiteList] = useState<SupplierSiteInterface[] | []>([]);
  const [convertedSiteList, setConvertedSiteList] = useState<Site[]>([]);
  const [siteView, setSiteView] = useState<null>(null);
  const [selectedSiteList, setSelectedSiteList] = useState<Site[]>([]);

  const getExistingalist = async () => {
    try {
      // setIsLoading(true);
      const result = await SiteListService(token!);
      if (result.data.status === 200) {
        const transformedData = result.data.data.map(
          (item: SupplierSiteInterface) => ({
            value: item.ID,
            label: item.ADDRESS_LINE1,
          })
        );

        setConvertedSiteList(transformedData);
        // setIsLoading(false);
        // setSiteList(result.data.data);
        // console.log("siteList: ", result.data.data);
        // setSiteLength(result.data.data.length);

        // Extract ADDRESS_LINE1 values, convert to lowercase, and set to store
        // Extract ADDRESS_LINE1 values, convert to lowercase, remove extra spaces, and set to store
        // const addressList = result.data.data.map(
        //   (item: { ADDRESS_LINE1: string }) =>
        //     item.ADDRESS_LINE1.toLowerCase().trim().replace(/\s+/g, "")
        // );
      } else {
        // setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      // setIsLoading(false);
      showErrorToast("Something went wrong");
    }
  };

  const [siteId, setSiteId] = useState<string>("");

  const handleSiteChange = (value: any) => {
    // console.log("value:", value);
    setSiteView(value);
    if (value !== null) {
      setSelectedSiteList(value);
      console.log(value.value);

      getOrganization(value.value);
      setSiteId(value.value);
      console.log(value);
    } else if (value == null && siteView != null) {
      setSelectedSiteList([]); //country silo
      setOrganizationList([]);
      setSiteId("");
      console.log("cleared");
    }
  };

  const getSiteList = async () => {
    try {
      const result = await SiteListInContactService(token!, contactId!);

      if (result.data.status === 200) {
        const transformedData = result.data.data.map(
          (item: SupplierSiteInterface) => ({
            value: item.SITE_ID,
            label: item.ADDRESS_LINE1,
          })
        );
        console.log(transformedData);
        const obj = transformedData[0];
        console.log(obj);

        setSiteView(obj);
        setSiteId(obj.value);
        getOrganization(parseInt(obj.value));
      }
    } catch (error) {
      console.log(error);
    }
  };

  //view picture

  const [nidPassportLoading, setNidPassportLoading] = useState<boolean>(false);

  const [signatureLoading, setSignatureLoading] = useState<boolean>(false);

  const [etinLoading, setEtinLoading] = useState<boolean>(false);

  const handleViewFile = (
    filePath: string,
    fileName: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    fetchFileService(filePath, fileName, token!, setLoading);
  };

  return (
    <div className="bg-whiteColor my-16">
      <SuccessToast />
      {isLoading ? (
        <div className=" w-full h-screen flex justify-center items-center">
          <LogoLoading />
        </div>
      ) : (
        <>
          <div className=" w-full flex justify-between items-center mb-8">
            <div className="flex space-x-4 items-center ">
              <p className=" mediumText">Are You Agent ?</p>
              <p className=" mediumText">If yes, then click</p>
              <div className=" flex space-x-2 items-center">
                <button
                  disabled={isDisable}
                  onClick={handleAgent}
                  className={`w-4 h-4 flex justify-center items-center rounded-[4px] ${
                    isAgent
                      ? "bg-midGreen ring-0"
                      : "bg-whiteColor ring-[1px] ring-borderColor "
                  }`}
                >
                  <CheckIcon className=" w-3 h-3 text-whiteColor" />
                </button>
                <p className=" mediumText">yes</p>
              </div>
            </div>

            {contactLength === 0 || contactLength === null ? null : (
              <CommonButton
                onClick={back}
                titleText="Back"
                width="w-24"
                height="h-8"
                color="bg-midGreen"
              />
            )}
          </div>
          <div className="  ">
            <p className=" mediumText">Contact Person </p>
            <div className=" mt-4 w-full flex justify-between items-start">
              <div className=" flex-1">
                <InputLebel titleText={"Name"} />
                <p className="mb-1"></p>
                <CommonInputField
                  inputRef={contactNameRef}
                  onChangeData={handleContactNameChange}
                  hint="Enter Name"
                  type="text"
                  width="w-full"
                  disable={isDisable}
                />
              </div>
              <div className=" w-56"></div>
              <div className=" flex-1">
                <InputLebel titleText={"Position"} />
                <p className="mb-1"></p>
                <CommonInputField
                  inputRef={ContactpositionRef}
                  onChangeData={handleContactPositionChange}
                  hint="Enter Position"
                  type="text"
                  width="w-full"
                  disable={isDisable}
                />
              </div>
            </div>
            <div className=" mt-4 w-full flex justify-between items-start">
              <div className=" flex-1">
                <InputLebel titleText={"Contact Number 1"} />
                <p className="mb-1"></p>
                <CommonInputField
                  inputRef={contactNumber1Ref}
                  onChangeData={handleContactNumber1Change}
                  hint="03767XXXX32"
                  type="text"
                  width="w-full"
                  disable={isDisable}
                />
              </div>
              <div className=" w-56"></div>
              <div className=" flex-1">
                <InputLebel titleText={"Contact Number 2"} />
                <p className="mb-1"></p>
                <CommonInputField
                  inputRef={contactNumber2Ref}
                  onChangeData={handleContactNumber2Change}
                  hint="09876XX8765"
                  type="text"
                  width="w-full"
                  disable={isDisable}
                />
              </div>
            </div>
            <div className=" mt-4 w-full flex justify-between items-start">
              <div className=" flex-1">
                <div className=" w-full flex  justify-between items-center">
                  <div className=" w-full flex space-x-10 items-center">
                    <button
                      disabled={isDisable}
                      onClick={handleIsNid}
                      className=" flex space-x-2 items-center"
                    >
                      <div
                        className={`ml-[1px] w-4 h-4 flex justify-center items-center rounded-[4px] ${
                          isNid
                            ? "bg-midGreen ring-0"
                            : "bg-whiteColor ring-[1px] ring-borderColor "
                        }`}
                      >
                        <CheckIcon className=" w-3 h-3 text-whiteColor" />
                      </div>
                      <p className=" smallText">NID Number</p>
                    </button>
                    <button
                      disabled={isDisable}
                      onClick={handleIsPassport}
                      className=" flex space-x-2 items-center"
                    >
                      <div
                        className={`w-4 h-4 flex justify-center items-center rounded-[4px] ${
                          isPassport
                            ? "bg-midGreen ring-0"
                            : "bg-whiteColor ring-[1px] ring-borderColor "
                        }`}
                      >
                        <CheckIcon className=" w-3 h-3 text-whiteColor" />
                      </div>
                      <p className=" smallText">Passport Number</p>
                    </button>
                  </div>
                </div>
                <p className="mb-1"></p>
                <CommonInputField
                  inputRef={nidOrPassportRef}
                  onChangeData={handleNidOrPassportChange}
                  hint="03767XXXX32"
                  type="text"
                  width="w-full"
                  disable={isDisable}
                />
              </div>
              <div className=" w-56"></div>
              <div className=" flex-1">
                <InputLebel titleText={"Email"} />
                <p className="mb-1"></p>
                <CommonInputField
                  inputRef={contactEmailRef}
                  onChangeData={handleContactEmailChange}
                  hint="Email address"
                  type="text"
                  width="w-full"
                  disable={isDisable}
                />
              </div>
            </div>
            <div className=" mt-4 mb-4 w-full flex justify-between items-start">
              <div className=" flex-1">
                <InputLebel titleText={"Nid/Passport File"} />
                <p className="mb-1"></p>
                <FilePickerInput
                  mimeType=".pdf, image/*"
                  onFileSelect={handleNidOrPassportFile}
                  width="w-full"
                  initialFileName={nidPassportFileName!}
                  maxSize={5 * 1024 * 1024}
                  disable={isDisable}
                />
                {nidPassportLoading ? (
                  <div className=" w-full flex justify-center items-center">
                    <CircularProgressIndicator />
                  </div>
                ) : contactDetails?.data.NID_PASSPORT_FILE_NAME ? (
                  <button
                    // href={`${contactDetails.nid_or_passport_file_path}/${contactDetails.data.NID_PASSPORT_FILE_NAME}`}
                    // target="blank"
                    onClick={() => {
                      handleViewFile(
                        contactDetails.nid_or_passport_file_path!,
                        contactDetails.data.NID_PASSPORT_FILE_NAME!,
                        setNidPassportLoading
                      );
                    }}
                    className=" w-full dashedButton my-4 "
                  >
                    {" "}
                    view
                  </button>
                ) : null}
              </div>
              <div className=" w-56"></div>
              <div className=" flex-1">
                <InputLebel titleText={"Signature"} />
                <p className="mb-1"></p>
                <FilePickerInput
                  mimeType=".pdf, image/*"
                  onFileSelect={handleNidSignatureFile}
                  width="w-full"
                  initialFileName={signatureFileName!}
                  maxSize={5 * 1024 * 1024}
                  disable={isDisable}
                />
                {signatureLoading ? (
                  <div className=" w-full flex justify-center items-center">
                    <CircularProgressIndicator />
                  </div>
                ) : contactDetails?.data.SIGNATURE_FILE_NAME ? (
                  <button
                    // href={`${contactDetails.supplier_signature_file_path}/${contactDetails.data.SIGNATURE_FILE_NAME}`}
                    // target="blank"
                    onClick={() => {
                      handleViewFile(
                        contactDetails.supplier_signature_file_path!,
                        contactDetails.data.SIGNATURE_FILE_NAME!,
                        setSignatureLoading
                      );
                    }}
                    className=" w-full dashedButton my-4 "
                  >
                    {" "}
                    view
                  </button>
                ) : null}
              </div>
            </div>
            <div className=" mb-12 w-full flex justify-between items-start">
              <div className=" flex-1">
                <InputLebel titleText={"Site"} />
                <CommonDropDownSearch
                  placeholder="Select Sites"
                  onChange={handleSiteChange}
                  value={siteView}
                  options={convertedSiteList}
                  width="w-96"
                  disable={isDisable}
                  isMutiSelect={false}
                  maxSelections={1}
                />
                <p className="mb-1"></p>
              </div>

              <div className=" w-56"></div>

              <div className=" flex-1"></div>
            </div>
          </div>

          {isAgent && (
            <div className="">
              <p className=" mediumText">Agent Details</p>

              <div className=" mt-4 w-full flex justify-between items-start">
                <div className=" flex-1">
                  <InputLebel titleText={"Agent Name *"} />
                  <p className="mb-1"></p>
                  <CommonInputField
                    inputRef={agentNameRef}
                    onChangeData={handleAgentNameChange}
                    hint="Enter Name"
                    type="text"
                    width="w-full"
                    disable={isDisable}
                  />
                </div>
                <div className=" w-56"></div>
                <div className=" flex-1">
                  <InputLebel titleText={"Agent Registered Address *"} />
                  <p className="mb-1"></p>
                  <CommonInputField
                    inputRef={addressRef}
                    onChangeData={handleAgentAddressChange}
                    hint="Enter Position"
                    type="text"
                    width="w-full"
                    disable={isDisable}
                  />
                </div>
              </div>
              <div className=" mt-4 w-full flex justify-between items-start">
                <div className=" flex-1">
                  <InputLebel titleText={"Agent Since"} />
                  <p className="mb-1"></p>
                  <CommonInputField
                    inputRef={agentSinceRef}
                    onChangeData={handleAgentSinceChange}
                    hint="DD/MM/YYYY"
                    type="text"
                    width="w-full"
                    disable={isDisable}
                  />
                </div>
                <div className=" w-56"></div>
                <div className=" flex-1">
                  <InputLebel titleText={"Bangladesh Permission No"} />
                  <p className="mb-1"></p>
                  <CommonInputField
                    inputRef={bdPermissionNoRef}
                    onChangeData={handleBdPermissionNo}
                    hint="Enter Permission No"
                    type="text"
                    width="w-full"
                    disable={isDisable}
                  />
                </div>
              </div>
              <div className=" mt-4 w-full flex justify-between items-start">
                <div className=" flex-1">
                  <InputLebel titleText={"IRC"} />
                  <p className="mb-1"></p>
                  <CommonInputField
                    inputRef={ircRef}
                    onChangeData={handleIrcChange}
                    hint="Enter IRC"
                    type="text"
                    width="w-full"
                    disable={isDisable}
                  />
                </div>
                <div className=" w-56"></div>
                <div className=" flex-1">
                  <InputLebel titleText={"Email ID *"} />
                  <p className="mb-1"></p>
                  <CommonInputField
                    inputRef={agentEmailRef}
                    onChangeData={handleAgentEmailChange}
                    hint="Enter Email"
                    type="text"
                    width="w-full"
                    disable={isDisable}
                  />
                </div>
              </div>
              <div className=" mt-4 w-full flex justify-between items-start">
                <div className=" flex-1">
                  <InputLebel titleText={"BIN"} />
                  <p className="mb-1"></p>
                  <CommonInputField
                    inputRef={binRef}
                    onChangeData={handleBinChange}
                    hint="Enter BIN"
                    type="text"
                    width="w-full"
                    disable={isDisable}
                  />
                </div>
                <div className=" w-56"></div>
                <div className=" flex-1">
                  <InputLebel titleText={"Contact Person Name*"} />
                  <p className="mb-1"></p>
                  <CommonInputField
                    inputRef={contactPersonRef}
                    onChangeData={handleAgentContactPersonChange}
                    hint="Enter Name"
                    type="text"
                    width="w-full"
                    disable={isDisable}
                  />
                </div>
              </div>
              <div className=" mt-4 w-full flex justify-between items-start">
                <div className=" flex-1">
                  <InputLebel titleText={"Position *"} />
                  <p className="mb-1"></p>
                  <CommonInputField
                    inputRef={agentPositionRef}
                    onChangeData={handleAgentPositionChange}
                    hint="Enter position"
                    type="text"
                    width="w-full"
                    disable={isDisable}
                  />
                </div>
                <div className=" w-56"></div>
                <div className=" flex-1">
                  <InputLebel titleText={"Mobile Number *"} />
                  <p className="mb-1"></p>
                  <CommonInputField
                    inputRef={mobileNumberRef}
                    onChangeData={handleAgentMobileNumberChange}
                    hint="968523647"
                    type="number"
                    width="w-full"
                    disable={isDisable}
                  />
                </div>
              </div>
              <div className=" mt-4 w-full flex justify-between items-start">
                <div className=" flex-1">
                  <InputLebel titleText={"TIN"} />
                  <p className="mb-1"></p>
                  <FilePickerInput
                    onFileSelect={handleTin}
                    width="w-full"
                    initialFileName={tinFileName!}
                    maxSize={5 * 1024 * 1024}
                    disable={isDisable}
                    mimeType=".pdf, image/*"
                  />
                  {etinLoading ? (
                    <div className=" w-full flex justify-center items-center">
                      <CircularProgressIndicator />
                    </div>
                  ) : contactDetails?.data.AGENT_DETAILS.TIN_FILE_NAME ? (
                    <button
                      // href={`${contactDetails.etin_file_path}/${contactDetails?.data.AGENT_DETAILS.TIN_FILE_NAME}`}

                      onClick={() => {
                        handleViewFile(
                          contactDetails.etin_file_path!,
                          contactDetails?.data.AGENT_DETAILS.TIN_FILE_NAME!,
                          setEtinLoading
                        );
                      }}
                      className=" w-full dashedButton my-4 "
                    >
                      {" "}
                      view
                    </button>
                  ) : null}
                </div>

                <div className=" w-56"></div>
                <div className=" flex-1"></div>
              </div>

              <div className=" w-full my-20"></div>
            </div>
          )}

          {isOrganizationLoading ? (
            <div className=" w-full flex justify-center items-center">
              <LogoLoading />
            </div>
          ) : (
            <div className=" w-full grid grid-cols-4 gap-6 items-center">
              {organizationList.map((e, i) => (
                <div
                  key={e.ORGANIZATION_ID}
                  className=" flex flex-row space-x-2 items-center w-48 px-1   "
                >
                  <button
                    // disabled={isDisable}
                    // onClick={() => {
                    //   handleGrantRevokeOrganization(i);
                    //   addOrgToSelectedSitelist(e);
                    // }}
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
          )}
        </>
      )}
    </div>
  );
}
