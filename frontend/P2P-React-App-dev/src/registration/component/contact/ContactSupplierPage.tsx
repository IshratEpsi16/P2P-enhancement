import React, { useState, useRef, useEffect } from "react";
import CheckIcon from "../../../icons/CheckIcon";
import InputLebel from "../../../common_component/InputLebel";
import CommonInputField from "../../../common_component/CommonInputField";
import FilePickerInput from "../../../common_component/FilePickerInput";
import CommonButton from "../../../common_component/CommonButton";
import DateRangePicker from "../../../common_component/DateRangePicker";

import { useContactPageContext } from "../../context/ContactPageContext";

import {
  SupplierContactDetailsInterface,
  SupplierSiteInterface,
} from "../../interface/RegistrationInterface";
import { useAuth } from "../../../login_both/context/AuthContext";
import { useNavigate } from "react-router-dom";
import SuccessToast, {
  showSuccessToast,
} from "../../../Alerts_Component/SuccessToast";
import ErrorToast, {
  showErrorToast,
} from "../../../Alerts_Component/ErrorToast";
import { isTokenValid } from "../../../utils/methods/TokenValidityCheck";
import SupplierContactDetailsService from "../../service/contact/SupplierContactDetailsService";
import LogoLoading from "../../../Loading_component/LogoLoading";
import moment from "moment";
import AddUpdateContactDetailsService from "../../service/contact/AddUpdateContactDetailsService";
import CircularProgressIndicator from "../../../Loading_component/CircularProgressIndicator";
import WarningModal from "../../../common_component/WarningModal";
import ProfileUpdateSubmissionService from "../../service/profile_update_submission/ProfileUpdateSubmissionService";
import ValidationError from "../../../Alerts_Component/ValidationError";
import useAuthStore from "../../../login_both/store/authStore";
import useRegistrationStore from "../../store/registrationStore";
import { OrganizationInterface } from "../../../role_access/interface/OrganizationInterface";
import ContactOuListService from "./service/ContactOuListService";
import SiteListService from "../../service/site_creation/SiteListService";
import CommonDropDownSearch from "../../../common_component/CommonDropDownSearch";
import OrgListForSupplierService from "../../service/site_creation/OrgListForSupplierService";
import SiteListInContactService from "./service/SiteListInContactService";
import AddSiteToContactService from "./service/AddSiteToContactService";
import DocumentFileRemoveService from "../../service/declaration/DocumentFileRemoveService";
import DeleteIcon from "../../../icons/DeleteIcon";
import fetchFileService from "../../../common_service/fetchFileService";

interface Site {
  value: string;
  label: string;
}

export default function ContactSupplierPage() {
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

  const { isRegistrationInStore, isProfileUpdateStatusInStore, isNewInfoStatusInStore } = useAuthStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { contactId, setPage, setContactId, contactLength, setContactLength } =
    useContactPageContext();

  const { isContactChangeStore, setIsContactChangeStore } =
    useRegistrationStore();

  useEffect(() => {
    console.log("condition: ", isContactChangeStore);
  }, []);

  const {
    regToken,
    submissionStatus,
    token,
    isRegCompelte,
    setSubmissionStatus,
  } = useAuth();

  const navigate = useNavigate();

  //token validation
  useEffect(() => {
    console.log(typeof contactId);
    console.log("contact ID: ", contactId);

    const isTokenExpired = !isTokenValid(regToken!);
    if (isTokenExpired) {
      localStorage.removeItem("regToken");
      showErrorToast("Please Login Again..");
      setTimeout(() => {
        navigate("/");
      }, 3200);
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
      const result = await SupplierContactDetailsService(regToken!, contactId!);
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

  const getSiteList = async () => {
    try {
      const result = await SiteListInContactService(regToken!, contactId!);

      console.log("siteList: ", result.data.data);

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

  //disabling field
  const [isDisable, setIsDisable] = useState<boolean>(false);
  //disabling field

  //set disable

  //   if (submissionStatus === "DRAFT") {
  //     setIsDisable(false);
  //   } else {
  //     setIsDisable(true);
  //   }
  // }, [submissionStatus]);

  useEffect(() => {
    console.log(submissionStatus);

    if (submissionStatus !== "DRAFT" || isProfileUpdateStatusInStore === "IN PROCESS") {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [submissionStatus, isProfileUpdateStatusInStore]);

  // useEffect(() => {
  //   if (isNewInfoStatusInStore === "INCOMPLETE") {
  //     setIsDisable(true);
  //   } else {
  //     setIsDisable(false);
  //   }
  // }, [isNewInfoStatusInStore]);

  // //set disable

  //site list

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
      const result = await SiteListService(regToken!);
      if (result.data.status === 200) {

        // for only active site showing
        const activeSite = result.data.data.filter(
          (item: SupplierSiteInterface) => item.ACTIVE_STATUS === "ACTIVE"
        );

        const transformedData = activeSite.map(
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

  //site list

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
      if (contactDetails?.data.MOB_NUMBER_1 === null) {
        console.log("null hoise");
      } else {
        console.log("null hoi nai");
        contactNumber1Ref.current.value =
          contactDetails?.data.MOB_NUMBER_1 || "";
        console.log("contact no 1", contactDetails?.data.MOB_NUMBER_1);
        console.log("type of", contactDetails?.data.MOB_NUMBER_1);

        setContactNumber1(contactDetails?.data?.MOB_NUMBER_1!);
      }

      contactNumber2Ref.current.value = contactDetails?.data.MOB_NUMBER_2 || "";
      setContactNumber2(contactDetails?.data?.MOB_NUMBER_2!);
      console.log(contactDetails?.data?.NID_PASSPORT_NUMBER);
      console.log(typeof contactDetails?.data?.NID_PASSPORT_NUMBER);

      if (contactDetails?.data?.NID_PASSPORT_NUMBER !== null) {
        nidOrPassportRef.current.value =
          contactDetails?.data.NID_PASSPORT_NUMBER || "";
        setNidOrPassport(contactDetails?.data?.NID_PASSPORT_NUMBER!);
      }

      contactEmailRef.current.value = contactDetails?.data.EMAIL || "";
      setContactEmail(contactDetails?.data?.EMAIL!);
      console.log(contactDetails?.data.IS_NID);

      setIsNid(contactDetails?.data.IS_NID === 1 ? true : false);
      setIsPassport(contactDetails?.data.IS_NID === 0 ? true : false);
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
      // contactDetails?.data.AGENT_DETAILS !== null ||
      // contactDetails?.data.AGENT_DETAILS !== undefined

      contactDetails?.data.IS_AGENT === 1
    ) {
      // &&
      // agentNameRef.current &&
      // addressRef.current &&
      // bdPermissionNoRef.current &&
      // ircRef.current &&
      // binRef.current &&
      // contactPersonRef.current &&
      // agentPositionRef.current &&
      // mobileNumberRef.current &&
      // agentEmailRef.current &&
      // agentSinceRef.current
      if (agentNameRef.current) {
        agentNameRef.current.value =
          contactDetails?.data.AGENT_DETAILS.AGENT_NAME || "";
        setAgentName(contactDetails?.data.AGENT_DETAILS.AGENT_NAME!);
      }
      if (addressRef.current) {
        addressRef.current.value =
          contactDetails?.data.AGENT_DETAILS.AGENT_ADDRESS || "";
        setAgentAddress(contactDetails?.data.AGENT_DETAILS.AGENT_ADDRESS!);
      }
      if (bdPermissionNoRef.current) {
        bdPermissionNoRef.current.value =
          contactDetails?.data.AGENT_DETAILS.BD_PERMISSION_NO || "";
        setBdPermissionNo(contactDetails?.data.AGENT_DETAILS.BD_PERMISSION_NO!);
      }

      if (ircRef.current) {
        ircRef.current.value = contactDetails?.data.AGENT_DETAILS.IRC || "";
        setIrc(contactDetails?.data.AGENT_DETAILS.IRC!);
      }
      if (binRef.current) {
        binRef.current.value = contactDetails?.data.AGENT_DETAILS.BIN || "";
        setBin(contactDetails?.data.AGENT_DETAILS.BIN!);
      }

      // console.log(contactDetails?.data.AGENT_DETAILS.CONTACT_PERSON_NAME);
      if (contactPersonRef.current) {
        contactPersonRef.current.value =
          contactDetails?.data.AGENT_DETAILS.CONTACT_PERSON_NAME || "";

        setAgentContactPerson(
          contactDetails?.data.AGENT_DETAILS.CONTACT_PERSON_NAME!
        );
      }

      // console.log();
      if (agentPositionRef.current) {
        agentPositionRef.current.value =
          contactDetails?.data.AGENT_DETAILS.CONTACT_PERSON_POSITION || "";
        setAgentPosition(
          contactDetails?.data.AGENT_DETAILS.CONTACT_PERSON_POSITION!
        );
      }

      if (mobileNumberRef.current) {
        mobileNumberRef.current.value =
          contactDetails?.data.AGENT_DETAILS.BD_PHONE_NUMBER || "";
        setAgentMobileNumber(
          contactDetails?.data.AGENT_DETAILS.BD_PHONE_NUMBER!
        );
      }

      if (agentEmailRef.current) {
        agentEmailRef.current.value =
          contactDetails?.data.AGENT_DETAILS.EMAIL || "";
        setAgentEmail(contactDetails?.data.AGENT_DETAILS.EMAIL!);
      }

      // agentSinceRef.current.value =
      //     moment(contactDetails?.data.AGENT_DETAILS.AGENT_SINCE_DATE).format(
      //         "DD/MM/YYYY"
      //     ) || "";
      // setAgentSince(
      //     moment(contactDetails?.data.AGENT_DETAILS.AGENT_SINCE_DATE).format(
      //         "DD/MM/YYYY"
      //     )
      // );
      // Check if tradeOrExportLicenseStartDate is not null before creating a new Date object
      const currentYear = new Date().getFullYear();

      if (contactDetails?.data.AGENT_DETAILS.AGENT_SINCE_DATE != null) {
        const agentsnc = contactDetails?.data.AGENT_DETAILS.AGENT_SINCE_DATE;
        console.log(contactDetails?.data.AGENT_DETAILS.AGENT_SINCE_DATE);

        // Check if tradeOrExportLicenseStartDate is not null before creating a new Date object
        const startDateValue = new Date(agentsnc!);

        // const endDateValue = new Date(currentYear, 11, 31); // Set the endDate to the end of the current year

        setStartDate({
          startDate: startDateValue,
          endDate: new Date(currentYear, 11, 31),
        });
        // setAgentSince()
        setAgentSince(
          moment(contactDetails?.data.AGENT_DETAILS.AGENT_SINCE_DATE).format(
            "DD/MM/YYYY"
          )
        );
      }

      if (contactDetails?.data.AGENT_DETAILS.TIN_FILE_NAME) {
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

  // const handleAgentSinceChange = (value: string) => {
  //   setAgentSince(value);
  // };

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

  const [contactError, setContactError] = useState<{
    contactName?: string;
    contactNumber1?: string;
    siteId?: string;
  }>({});

  const validate = () => {
    const errors: {
      contactName?: string;
      contactNumber1?: string;
      siteId?: string;
    } = {};

    if (contactName === "") {
      errors.contactName = "Please Enter Contact Name";
    }

    if (contactNumber1 === "") {
      errors.contactNumber1 = "Please Enter Contact Number 1";
    }
    if (siteId === "") {
      errors.siteId = "Please Select Site";
    }
    setContactError(errors);
    return Object.keys(errors).length === 0;
  };

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

  // const [contactId,setContactId]=useState()

  // useEffect(() => {
  //   getOrganization();
  // }, []);

  const [isOrganizationLoading, setIsOrganizationLoading] =
    useState<boolean>(false);

  const getOrganization = async (siteId: number) => {
    console.log(siteId);

    // const result = await ContactOuListService(regToken!, contactId);
    setIsOrganizationLoading(true);
    const result = await OrgListForSupplierService(regToken!, siteId);

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

  // org grant revoke
  const handleGrantRevokeOrganization = (orgIndex: number) => {
    const updatedOrganizationList = [...organizationList];
    updatedOrganizationList[orgIndex].IS_ASSOCIATED =
      updatedOrganizationList[orgIndex].IS_ASSOCIATED === 1 ? 0 : 1;
    setOrganizationList(updatedOrganizationList);
    const updatedSelectedOrgList = updatedOrganizationList.filter(
      (org) => org.IS_ASSOCIATED === 1
    );

    setSelectedOrgList(updatedSelectedOrgList);
  };

  const addOrgToSelectedSitelist = (org: OrganizationInterface) => {
    selectedOrgList2.push(org);
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

  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

  const submitFirst = async () => {
    if (validate()) {
      setIsSubmitLoading(true);

      setIsContactChangeStore(true);

      try {
        let result;

        let statusValue;
        if (isRegistrationInStore === 1 && contactId === null) {
          statusValue = "IN PROCESS";
        } else {
          statusValue = "ACTIVE";
        }

        if (contactId !== null) {
          // If contactId is not null, include it in the function call
          result = await AddUpdateContactDetailsService(
            regToken!,
            contactId,
            contactName,
            contactEmail,
            position,
            contactNumber1,
            contactNumber2,
            nidOrPassport,
            isNid ? "1" : "0",
            nidPassportFile,
            signatureFile,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            tinFile,
            // isRegistrationInStore === 0 ? "APPROVED" : "IN PROCESS"
            statusValue
          );
        } else {
          // If contactId is null, call the function without it
          result = await AddUpdateContactDetailsService(
            regToken!,
            null,
            contactName,
            contactEmail,
            position,
            contactNumber1,
            contactNumber2,
            nidOrPassport,
            isNid ? "1" : "0",
            nidPassportFile,
            signatureFile,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            tinFile,
            // isRegistrationInStore === 0 ? "APPROVED" : "IN PROCESS"
            statusValue
          );
        }
        console.log(result);

        if (result.data.status === 200) {
          if (contactId === null) {
            addSiteToContact(result.data.id);
          } else {
            addSiteToContact(contactId);
          }

          setIsSubmitLoading(false);
          setContactLength(contactLength + 1);
          showSuccessToast(result.data.message);
          setPage(1);
          // setTimeout(() => {
          //   setPage(1);
          // }, 3200);
          // if (contactId === null) {

          // }
          // else {
          //     getContactDetails();
          // }
        } else {
          setIsSubmitLoading(false);
          showErrorToast(result.data.message);

          // if (contactId !== null) {
          //     getContactDetails();
          //     log
          // }
        }
      } catch (error) {
        setIsSubmitLoading(false);
        showErrorToast("Something went wrong");
      }
    } else {
      console.log("validation failed");
    }
  };

  useEffect(() => {
    console.log("reg: ", isRegistrationInStore);
    console.log("proStatus: ", isProfileUpdateStatusInStore);
    console.log("newInfoStatus: ", isNewInfoStatusInStore);
  }, []);

  const submit = async () => {
    if (validate()) {
      console.log(agentConatctPerson);
      console.log(agentSince);

      setIsSubmitLoading(true);

      setIsContactChangeStore(true);

      try {
        let statusValue;
        if (isRegistrationInStore === 1 && contactId === null) {
          statusValue = "IN PROCESS";
        } else {
          statusValue = "ACTIVE";
        }

        const result = await AddUpdateContactDetailsService(
          regToken!,
          contactId !== null ? contactId : null,
          contactName,
          contactEmail,
          position,
          contactNumber1,
          contactNumber2,
          nidOrPassport,
          isNid ? "1" : "0",
          nidPassportFile,
          signatureFile,
          isAgent ? "1" : "0",
          AgentName,
          agentEmail,
          agentAddress,
          agentSince,
          agentConatctPerson,
          agentPosition,
          agentMobileNumber,
          irc,
          bin,
          bdPremissionNo,
          tinFile,
          // isRegistrationInStore === 0 ? "APPROVED" : "IN PROCESS"
          statusValue
        );
        console.log(result);

        if (result.data.status === 200) {
          if (contactId === null) {
            addSiteToContact(result.data.id);
          } else {
            addSiteToContact(contactId);
          }
          setIsSubmitLoading(false);
          showSuccessToast(result.data.message);
          setPage(1);
          // setTimeout(() => {
          //   setPage(1);
          // }, 3200);
          // if (contactId === null) {

          // }
          // else {
          //     getContactDetails();
          //     // setTimeout(() => {
          //     //     setPage(1);
          //     // }, 1200);

          // }
        } else {
          setIsSubmitLoading(false);
          showErrorToast(result.data.message);
        }
      } catch (error) {
        setIsSubmitLoading(false);
        showErrorToast("Something went wrong");
      }
    } else {
      console.log("validation failed");
    }
  };

  //back

  const back = () => {
    setPage(1);
    setContactId(null);
  };

  //agent since er date picker

  const [searchStartDate, setSearchStartDate] = useState("");
  const [startDate, setStartDate] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: new Date(new Date().getFullYear(), 11, 31), // Set the endDate to the end of the current year
  });

  const handleStartDateChange = (newValue: any) => {
    setStartDate(newValue);
    // Handle the selected date here
    setAgentSince(moment(newValue.startDate).format("DD/MM/YYYY"));
    // setSearchEndDate(moment(newValue.endDate).format("YYYY-MM-DD"))
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

  //add site to contact

  const addSiteToContact = async (cntId: number) => {
    try {
      const result = await AddSiteToContactService(
        regToken!,
        cntId!,
        parseInt(siteId)
      );
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  //file delete

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
        case "nidOrPassportFile":
          await removeNidPassport(fileToRemove);
          break;

        case "signatureFile":
          await removeSignature(fileToRemove);
          break;
        case "etinFile":
          await removeTin(fileToRemove);
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

  const removeNidPassport = async (removeFileName: string) => {
    // setIsOpenFileRemoveModal(true);

    setIsLoading(true);
    console.log("fileName function: ", removeFileName);

    const result = await DocumentFileRemoveService(
      regToken!,
      "XXP2P_SUPPLIER_CONTACT_PERSON_DTLS",
      "NID_PASSPORT_FILE_NAME",
      "NID_PASSPORT_ORIGINAL_FILE_NAME",
      removeFileName,
      "nidOrPassportFile"
    );

    // if (result.data.status === 200) {
    //   setSealFileName(null);
    //   showSuccessToast(result.data.message);
    // } else {
    //   showErrorToast(result.data.message);
    // }

    if (result.data.status === 200) {
      setNidPassportFileName(null);
      setContactDetails((prevDetails) => {
        if (!prevDetails) return prevDetails;

        const updatedDetails = {
          ...prevDetails,
          nid_or_passport_file_path: "",
          data: {
            ...prevDetails.data,
            NID_PASSPORT_FILE_NAME: null,
            NID_PASSPORT_ORIGINAL_FILE_NAME: null,
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
  const removeSignature = async (removeFileName: string) => {
    // setIsOpenFileRemoveModal(true);

    setIsLoading(true);
    console.log("fileName function: ", removeFileName);

    const result = await DocumentFileRemoveService(
      regToken!,
      "XXP2P_SUPPLIER_CONTACT_PERSON_DTLS",
      "SIGNATURE_ORIGINAL_FILE_NAME",
      "SIGNATURE_FILE_NAME",
      removeFileName,
      "signatureFile"
    );

    // if (result.data.status === 200) {
    //   setSealFileName(null);
    //   showSuccessToast(result.data.message);
    // } else {
    //   showErrorToast(result.data.message);
    // }

    if (result.data.status === 200) {
      setNidPassportFileName(null);
      setContactDetails((prevDetails) => {
        if (!prevDetails) return prevDetails;

        const updatedDetails = {
          ...prevDetails,
          supplier_signature_file_path: "",
          data: {
            ...prevDetails.data,
            SIGNATURE_FILE_NAME: null,
            SIGNATURE_ORIGINAL_FILE_NAME: null,
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
  const removeTin = async (removeFileName: string) => {
    // setIsOpenFileRemoveModal(true);

    setIsLoading(true);
    console.log("fileName function: ", removeFileName);

    const result = await DocumentFileRemoveService(
      regToken!,
      "XXP2P_SUPPLIER_AGENT_DTLS",
      "TIN_FILE_ORIGINAL_NAME",
      "TIN_FILE_NAME",
      removeFileName,
      "etinFile"
    );

    // if (result.data.status === 200) {
    //   setSealFileName(null);
    //   showSuccessToast(result.data.message);
    // } else {
    //   showErrorToast(result.data.message);
    // }

    if (result.data.status === 200) {
      setNidPassportFileName(null);
      setContactDetails((prevDetails) => {
        if (!prevDetails) return prevDetails;

        const updatedDetails = {
          ...prevDetails,
          etin_file_path: "",
          data: {
            ...prevDetails.data,
            TIN_FILE_NAME: null,
            TIN_FILE_ORIGINAL_NAME: null,
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

  //file

  const [nidFileLoading, setNidFileLoading] = useState<boolean>(false);
  const [signatureFileLoading, setSignatureFileLoading] =
    useState<boolean>(false);
  const [tinFileLoading, setTinFileLoading] = useState<boolean>(false);

  const handleViewFile = (
    filePath: string,
    fileName: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const tokenSelection = isRegCompelte === "1" ? token : regToken;
    fetchFileService(filePath, fileName, tokenSelection!, setLoading);
  };

  return (
    <div className="bg-whiteColor  ">
      <SuccessToast />
      <WarningModal
        isOpen={isOpenFileRemoveModal}
        closeModal={handleCloseModal}
        action={handleConfirmDelete}
        message="Are you sure you want to delete this?"
      />
      <WarningModal
        isOpen={isWarningShowSubmit}
        action={profileUpdateSubmission}
        closeModal={closeModalSubmit}
        message="Do you want to submit ?"
        imgSrc="/images/warning.png"
      />
      {isLoading ? (
        <div className=" w-full  flex justify-center items-center">
          <LogoLoading />
        </div>
      ) : (
        <>
          <div className=" w-full flex justify-between items-center mb-8">
            {contactDetails != null && contactDetails.data.IS_AGENT === 0 ? (
              <div></div>
            ) : (
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
            )}

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
            <p className=" mediumText">Contact Person</p>
            <div className=" mt-4 w-full flex justify-between items-start">
              <div className=" flex-1">
                <div className="flex items-center space-x-1">
                  <InputLebel titleText={"Name"} />
                  <span className="text-red-500 font-bold">*</span>
                </div>

                <p className="mb-1"></p>
                <CommonInputField
                  inputRef={contactNameRef}
                  onChangeData={handleContactNameChange}
                  hint="Enter Name"
                  type="text"
                  width="w-full"
                  disable={isDisable}
                />

                <p className="mb-1"></p>
                {contactError.contactName && (
                  <ValidationError title={contactError.contactName} />
                )}
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
                <div className="flex items-center space-x-1">
                  <InputLebel titleText={"Contact Number 1"} />
                  <span className="text-red-500 font-bold">*</span>
                </div>

                <p className="mb-1"></p>
                <CommonInputField
                  inputRef={contactNumber1Ref}
                  onChangeData={handleContactNumber1Change}
                  hint="03767XXXX32"
                  type="text"
                  width="w-full"
                  disable={isDisable}
                />
                <p className="mb-1"></p>
                {contactError.contactNumber1 && (
                  <ValidationError title={contactError.contactNumber1} />
                )}
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
            <div className=" mt-4  w-full flex justify-between items-start">
              <div className=" flex-1">
                <InputLebel titleText={"NID/Passport File"} />
                <p className="mb-1"></p>
                <FilePickerInput
                  mimeType=".pdf, image/*"
                  onFileSelect={handleNidOrPassportFile}
                  width="w-full"
                  initialFileName={nidPassportFileName!}
                  maxSize={5 * 1024 * 1024}
                  disable={isDisable}
                />
                {contactDetails?.data.NID_PASSPORT_FILE_NAME ? (
                  <div className=" flex items-center space-x-6">
                    {nidFileLoading ? (
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
                            contactDetails.nid_or_passport_file_path,
                            contactDetails.data.NID_PASSPORT_FILE_NAME!,
                            setNidFileLoading
                          );
                        }}
                        className={`${
                          isRegCompelte === "1" ? "w-96" : "w-80"
                        }  dashedButton my-4 `}
                      >
                        {" "}
                        view
                      </button>
                    )}
                    {isRegCompelte === "1" ? null : (
                      <button
                        onClick={() =>
                          handleOpenModal(
                            contactDetails?.data.NID_PASSPORT_FILE_NAME!,
                            "nidOrPassportFile"
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
                {contactDetails?.data.SIGNATURE_FILE_NAME ? (
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
                            contactDetails.supplier_signature_file_path,
                            contactDetails.data.SIGNATURE_FILE_NAME!,
                            setSignatureFileLoading
                          );
                        }}
                        className={`${
                          isRegCompelte === "1" ? "w-96" : "w-80"
                        }  dashedButton my-4 `}
                      >
                        {" "}
                        view
                      </button>
                    )}
                    {isRegCompelte === "1" ? null : (
                      <button
                        onClick={() =>
                          handleOpenModal(
                            contactDetails?.data.SIGNATURE_FILE_NAME!,
                            "signatureFile"
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

            <div className="mt-4 mb-4 w-full flex justify-between items-start">
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
                {contactError.siteId && (
                  <ValidationError title={contactError.siteId} />
                )}
              </div>

              <div className=" w-56"></div>

              <div className=" flex-1"></div>
            </div>

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

            {/* <div className="w-full flex justify-end space-x-6 items-center">
              {!isAgent && (
                <div className=" ">
                  {isSubmitLoading ? (
                    <div className=" w-48 flex justify-center items-center">
                      <CircularProgressIndicator />
                    </div>
                  ) : (
                    <CommonButton
                      titleText={"Save & Continue"}
                      onClick={submitFirst}
                      disable={isDisable}
                      width="w-48"
                    />
                  )}
                </div>
              )}

              
            </div> */}
          </div>
          {isAgent && (
            <div className=" mt-8">
              {/* <p className=" mediumText">Agent Details</p> */}
              <InputLebel titleText={"Agent Details"} />

              <div className=" mt-4 w-full flex justify-between items-start">
                <div className=" flex-1">
                  <div className="flex items-center space-x-1">
                    <InputLebel titleText={"Agent Name"} />
                    <span className="text-red-500 font-bold">*</span>
                  </div>
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
                  <div></div>

                  <div className="flex items-center space-x-1">
                    <InputLebel titleText={"Agent Registered Address"} />
                    <span className="text-red-500 font-bold">*</span>
                  </div>
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
                  {/* <CommonInputField
                                        inputRef={agentSinceRef}
                                        onChangeData={handleAgentSinceChange}
                                        hint="DD/MM/YYYY"
                                        type="text"
                                        width="w-full"
                                        disable={isDisable}
                                    /> */}
                  <DateRangePicker
                    onChange={handleStartDateChange}
                    width="w-full"
                    placeholder="DD/MM/YYYY"
                    value={startDate}
                    useRange={false}
                    signle={true}
                    disable={isDisable}
                  />
                </div>
                <div className=" w-56"></div>
                <div className=" flex-1">
                  <InputLebel
                    titleText={"Bangladesh Permission No/ Indentor ID "}
                  />
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
                  <div className="flex items-center space-x-1">
                    <InputLebel titleText={"Email ID"} />
                    <span className="text-red-500 font-bold">*</span>
                  </div>
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
                  <div className="flex items-center space-x-1">
                    <InputLebel titleText={"Contact Person Name"} />
                    <span className="text-red-500 font-bold">*</span>
                  </div>
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
                  <div className="flex items-center space-x-1">
                    <InputLebel titleText={"Position"} />
                    <span className="text-red-500 font-bold">*</span>
                  </div>
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
                  <div className="flex items-center space-x-1">
                    <InputLebel titleText={"Mobile Number"} />
                    <span className="text-red-500 font-bold">*</span>
                  </div>
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
                  {contactDetails?.data.AGENT_DETAILS.TIN_FILE_NAME ? (
                    <div className=" flex items-center space-x-6">
                      {tinFileLoading ? (
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
                              contactDetails.etin_file_path,
                              contactDetails?.data.AGENT_DETAILS.TIN_FILE_NAME!,
                              setTinFileLoading
                            );
                          }}
                          className={`${
                            isRegCompelte === "1" ? "w-96" : "w-80"
                          }  dashedButton my-4 `}
                        >
                          {" "}
                          view
                        </button>
                      )}

                      {isRegCompelte === "1" ? null : (
                        <button
                          onClick={() =>
                            handleOpenModal(
                              contactDetails?.data.AGENT_DETAILS.TIN_FILE_NAME!,
                              "etinFile"
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

                <div className=" w-56"></div>
                <div className=" flex-1"></div>
              </div>
            </div>
          )}

          <div className=" my-4">
            {/* org */}
            {/* {contactId === null ? (
              <div className="text-lg text-[#663C00] bg-[#FFF4E5] w-full h-14 px-4 flex items-center rounded-md space-x-2 font-semibold ">
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
            )} */}

            {/* <div className="h-4"></div> */}

            {/* <div className=" w-full flex space-x-4 items-center ">
              <p className=" font-mon font-medium text-black">Select All</p>
              <button
                disabled={isDisable}
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
                {
                  <img
                    src="/images/check.png"
                    alt="check"
                    className=" w-2 h-2"
                  />
                }
              </button>
            </div> */}

            {/* {siteError.selectedOrgList && (
            <ValidationError title={siteError.selectedOrgList} />
          )} */}
            <div className=" h-10"></div>
            {/* org */}
          </div>
          {isAgent ? (
            <div className=" w-full flex justify-end space-x-6 items-center my-20">
              {isSubmitLoading ? (
                <div className=" w-48 flex justify-end items-end">
                  <CircularProgressIndicator />
                </div>
              ) : (
                <CommonButton
                  disable={isDisable}
                  onClick={submit}
                  titleText={"Save & Next"}
                  width="w-48"
                />
              )}
            </div>
          ) : (
            //without agent submit

            <div className=" w-full flex justify-end items-end ">
              {isSubmitLoading ? (
                <div className=" w-48 flex justify-center items-center">
                  <CircularProgressIndicator />
                </div>
              ) : (
                <CommonButton
                  titleText={"Save & Continue"}
                  onClick={submitFirst}
                  disable={isDisable}
                  width="w-48"
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
