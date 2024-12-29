import React, { useState, useRef, useEffect } from "react";
import PageTitle from "../../common_component/PageTitle";
import NavigationPan from "../../common_component/NavigationPan";
import CommonButton from "../../common_component/CommonButton";
import DropDown from "../../common_component/DropDown";
import InputLebel from "../../common_component/InputLebel";
import { Steps } from "keep-react";
import { Button, Modal } from "keep-react";
import { CloudArrowUp, Trash } from "phosphor-react";
import CommonInputField from "../../common_component/CommonInputField";
// import useSupplierPoStore from "../store/SupplierPoStore";
import DateRangePicker from "../../common_component/DateRangePicker";
import useSupplierPoStore from "../../po_supplier/store/SupplierPoStore";
// import { usePoPageContext } from "../context/PoPageContext";
import { usePoPageContext } from "../../po/context/PoPageContext";
// import InvoiceAddUpdateService from "../service/InvoiceAddUpdateService";
import InvoiceAddUpdateService from "../../po/service/InvoiceAddUpdateService";
import { useAuth } from "../../login_both/context/AuthContext";
import CommonDropDownSearch from "../../common_component/CommonDropDownSearch";
import ValidationError from "../../Alerts_Component/ValidationError";
import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import moment from "moment";
// import PoUpdateService from "../service/PoUpdateService";
import PoUpdateService from "../../po/service/PoUpdateService";
import WarningModal from "../../common_component/WarningModal";
// import ShipmentTimelineService from "../service/ShipmentTimelineService";
import ShipmentTimelineService from "../../po/service/ShipmentTimelineService";
// import ShipmentTimelineInterface from "../interface/ShipmentTimelineInterface";
import ShipmentTimelineInterface from "../../po/interface/ShipmentTimelineInterface";
import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";
import BankInterface from "../../registration/interface/BankInterface";
import BankListService from "../../registration/service/bank/BankListService";
import SupplierSiteInterface from "../../registration/interface/SupplierSiteInterface";
import SiteListService from "../../registration/service/site_creation/SiteListService";
// import CreateUpdatePrepaymentInvoiceService from "../service/CreateUpdatePrepaymentService";
import CreateUpdatePrepaymentInvoiceService from "../../po/service/CreateUpdatePrepaymentService";
import isoToDateTime from "../../utils/methods/isoToDateTime";
import SiteDetailsService from "../../registration/service/site_creation/SiteDetailsService";
import PoItemListService from "../../po_supplier/service/PoItemListService";
// import PoItemInterface from "../interface/PoItemInterface";
import PoItemInterface from "../../po/interface/PoItemInterface";
import useRfiStore from "../../rfi_in_supplier_registration/store/RfiStore";
import ShipmentAcceptRejectService from "../service/ShipmentAcceptRejectService";
import ShipmentListPoService from "../service/ShipmentListPoService";
import PoInterface from "../../po/interface/PoInterface";
import LogoLoading from "../../Loading_component/LogoLoading";
import SiteDetailsViewForApprovalService from "../../manage_supplier/service/site/SiteDetailsViewForApprovalService";
import CheckShipmentNumberService from "../../po/service/CheckShipmentNumberService";
import ShipmentItemDetailsService from "../../po_supplier/service/ShipmentItemDetailsService";
import ShipmentItemDetailsInterface from "../../po_supplier/interface/ShipmentItemDetailsInterface";
import ShipmentSubmitItemInterface from "../../po_supplier/interface/ShipmentSubmitItemInterface";
import ShipmentAddUpdateService from "../../po_supplier/service/ShipmentAddUpdateService";

const pan = ["Home", "Po List", "PO Item Details"];
const list = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

const options = [
  { value: "accept", label: "Accept" },
  { value: "reject", label: "Reject" },
];

const createInvoiceOption = [
  { value: "prepayment", label: "Prepayment" },
  { value: "standardInvoice", label: "Standard Invoice" },
];

const shipmentOption = [
  { value: "shipmentList", label: "Shipment List" },
  { value: "shipmentNotice", label: "Create Shipment Notice" },
];

interface Bank {
  value: string;
  label: string;
}

interface ConvertedSiteInterface {
  value: string;
  label: string;
}

export default function ShipmentReceiveDetailsPage() {
  //context
  // const { setPoPageNoInContext } = usePoPageContext();
  //context

  //store
  const {
    setPageNo,
    singlePo,
    setSinglePo,
    poHeaderInStore,
    headerTermFilePath,
    singleShipment,
  } = useSupplierPoStore();

  const { setShipmentPageNo } = useRfiStore();
  //store
  //drop
  const [selectedDropDown, setSelectedDropDown] = useState<string>("");
  const handleSelect = (value: string) => {
    console.log(`Selected: ${value}`);
    // setSearchKey(value);
    setSelectedDropDown(value);
    // getData(offset, value);
    // Do something with the selected value
    if (value === "reject") {
      rejectPoModalOpen();
    } else {
      openAcceptModal();
    }
  };
  //drop

  useEffect(() => {
    console.log("ShipmentList: ", singleShipment);
    getPoItemDetails();
    getSinglePo();
    // getSiteDetails();
    
    if(singleShipment?.RFQ_DETAILS.BUYER_DEPARTMENT === "Foreign") {
      getShipmentNumber();
    } else if(singleShipment?.RFQ_DETAILS.BUYER_DEPARTMENT === "Local") {
      getShipmentItemDetails()
    }
  }, []);

  const [siteDetails, setSiteDetails] = useState<SupplierSiteInterface | null>(
    null
  );

  const [poDetails, setPoDetails] = useState<PoItemInterface[]>([]);

  const getPoItemDetails = async () => {
    setIsLoading(true);
    const result = await PoItemListService(token!, singleShipment?.PO_HEADER_ID!, "");
    if (result.data.status === 200) {
      setPoDetails(result.data.data);
      console.log("po item: ", result.data.data);
    } else {
      showErrorToast("Something went wrong");
    }
    console.log("po: ", result.data.status);

    setIsLoading(false);
  };

  const [singlePoDetails, setSinglePoDetails] = useState<PoInterface [] | []>([]);

  const getSinglePo = async () => {
    setIsLoading(true);
    // const result = await ShipmentListPoService(token!, singleShipment?.PO_HEADER_ID!, 1, 10);

    // console.log("single Po: ", result.data.data[0]);
    
    // getSiteDetails(result.data.data[0].SITE_ID);
    // setSinglePoDetails(result.data.data);

    try {
      const result = await ShipmentListPoService(token!, singleShipment?.PO_HEADER_ID!, 1, 10);

      if (result.data && result.data.data.length > 0) {
          const poDetails = result.data.data[0];
          console.log("single Po: ", poDetails);

          // Directly pass SITE_ID from API response to getSiteDetails
          await getSiteDetails(poDetails.SITE_ID);

          setSinglePoDetails(result.data.data); // Set single PO details after fetching the site
      }
  } catch (error) {
      console.error("Error fetching single PO: ", error);
  }
    setIsLoading(false);
  }

  const [shipmentNum, setShipmentNum] = useState<string>("");
  const [grnNum, setGrnNum] = useState<string>("");

  const getShipmentNumber = async () => {
    try {
      const result = await CheckShipmentNumberService(
        token!,
        singleShipment?.PO_NUMBER!
      );
      if (result.data.status === 200) {
        console.log("shipNum: ", result.data.data);
        if (result.data.data.SHIP_NUM === "NA") {
          openModal();
          setShipmentNum(result.data.data.SHIP_NUM);
          // getShipmentItemDetails();
        } else if (result.data.data.GRN !== "" && (singleShipment?.GATE_RCV_STATUS !== "ACCEPTED" && singleShipment?.GATE_RCV_STATUS !== "REJECTED")){
          openModal();
          setGrnNum(result.data.data.GRN);
        }else {
          setShipmentNum(result.data.data.SHIP_NUM);
          getShipmentItemDetails();
        }
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {}
  };

  const openModal = () => {
    const modal = document.getElementById(
      "my_modal_111"
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  const [shipmentItemDetails, setShipmentItemDetails] = useState<ShipmentItemDetailsInterface[]>([]);

  const getShipmentItemDetails = async () => {
    const result = await ShipmentItemDetailsService(token!, singleShipment?.SHIPMENT_ID!);
    setShipmentItemDetails(result.data.data);
    console.log("ship details: ", result.data.data);
  }

  const getSiteDetails = async (siteId: number) => {
    setIsLoading(true);
    // console.log("siteId: ", singlePoDetails[0]!.SITE_ID);
    // const result = await SiteDetailsViewForApprovalService(token!, singleShipment?.USER_ID!, siteId);

    // setSiteDetails(result.data.data);

    try {
      console.log("Fetching site details for SITE_ID: ", siteId);
      const result = await SiteDetailsViewForApprovalService(token!, singleShipment?.USER_ID!, siteId);

      if (result.data && result.data.data) {
          setSiteDetails(result.data.data);
          console.log("Site details: ", result.data.data);
      }
  } catch (error) {
      console.error("Error fetching site details: ", error);
  }

    // console.log("site: ", result.data.data);
    setIsLoading(false);
  };

  // shipment dropdown
  const [selectShipmentDropDown, setSelectShipmentDropDown] =
    useState<string>("");
  const handleShipment = (value: string) => {
    console.log(`Shipment: ${value}`);
    // setSearchKey(value);
    setSelectShipmentDropDown(value);
    // getData(offset, value);
    // Do something with the selected value
    if (value === "shipmentList") {
      setPageNo(3);
    } else if (value === "shipmentNotice") {
      setPageNo(4);
    }
  };
  // shipment dropdown

  const confirmOrder = () => {};
  const createShipmentNotice = () => {
    setPageNo(3);
  };
  const createInvoice = () => {
    const modal = document.getElementById("my_modal_2");
    if (modal instanceof HTMLDialogElement) {
      modal.showModal();
    }
  };

  const closePrepaymentModal = () => {
    const modal = document.getElementById("my_modal_2");
    if (modal instanceof HTMLDialogElement) {
      modal.close();
    }
  };

  const rejectPoModalOpen = () => {
    const modal = document.getElementById("my_modal_1");
    if (modal instanceof HTMLDialogElement) {
      modal.showModal();
    }
  };

  const viewPo = () => {
    const modal = document.getElementById("my_modal_1");
    if (modal instanceof HTMLDialogElement) {
      modal.showModal();
    }
  };
  const viewBuyerGeneralTerm = () => {
    const modal = document.getElementById("my_modal_3");
    if (modal instanceof HTMLDialogElement) {
      modal.showModal();
    }
  };

  //reject modal
  const [showErrorModalX, setShowErrorModalX] = useState(false);
  const onClickErrorModal = () => {
    setShowErrorModalX(!showErrorModalX);
  };
  //reject modal

  //prepayment modal
  const [showPrepaymentModal, setShowPrepaymentModal] = useState(false);
  const onClickPrepaymentModal = () => {
    setShowPrepaymentModal(!showPrepaymentModal);
  };
  //prepayment modal

  //order Id
  const emailRef = useRef<HTMLInputElement | null>(null);
  const [email, setEmail] = useState<string>("");
  const handleEmailChange = (value: string) => {
    setEmail(value);
  };
  //order Id

  //reason
  const [poRejectReason, setPoRejectReason] = useState("");
  const maxLength = 150;

  const handlePoRejectReasonChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    if (value.length <= maxLength) {
      setPoRejectReason(value);
    }
  };
  //reason

  const [prepaymentDescription, setPrepaymentDescription] =
    useState<string>("");

  const handlePrepaymentDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    if (value.length <= maxLength) {
      setPrepaymentDescription(value);
    }
  };

  //accept reject po "REJETED", //ACCEPTED

  const rejectPo = async () => {
    console.log(poRejectReason);

    try {
      const result = await PoUpdateService(
        token!,
        singlePo?.INVITATION_ID!,
        "REJECTED",
        poRejectReason
      );
      if (result.data.status === 200) {
        setIsPoRejected(true);
        showSuccessToast(result.data.message);
        back();
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      console.log(error);
      showErrorToast("Something went wrong while rejecting");
    }
  };

  const [isAcceptPoModalShow, setIsAcceptModalShow] = useState<boolean>(false);

  const closeAcceptModal = () => {
    setIsAcceptModalShow(false);
  };

  const openAcceptModal = () => {
    setIsAcceptModalShow(true);
  };

  const acceptPo = async () => {
    try {
      const result = await PoUpdateService(
        token!,
        singlePo?.INVITATION_ID!,
        "ACCEPTED",
        "ACCEPTED"
      );
      console.log(result.data);

      if (result.data.status === 200) {
        setIsPoAccepted(true);
        showSuccessToast(result.data.message);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      console.log(error);
      showErrorToast("Something went wrong while accepting");
    }
  };

  //accept reject po

  const back = () => {
    setSinglePo(null);
    // setPoPageNoInContext(1);
    setShipmentPageNo(1);
  };

  // invoice date
  const [invoiceDate, setInvoiceDate] = useState({
    startDate: null,
    endDate: null, // Set the endDate to the end of the current year
  });

  const [selectedInvoiceDate, setSelectedInvoiceDate] = useState<string>("");

  const handleInvoiceDateChange = (newValue: any) => {
    console.log("newValue:", newValue);
    setInvoiceDate(newValue);
    setSelectedInvoiceDate(moment(newValue.startDate).format("YYYY-MM-DD"));
  };
  // invoice date

  //gl date

  const [glDate, setGlDate] = useState({
    startDate: null,
    endDate: null, // Set the endDate to the end of the current year
  });

  const [selectedGlDate, setSelectedGlDate] = useState<string>("");

  const handleGlDate = (newValue: any) => {
    setGlDate(newValue);
    setSelectedGlDate(moment(newValue.startDate).format("YYYY-MM-DD"));
  };

  //gl date

  const poNumberRef = useRef<HTMLInputElement | null>(null);
  const [poNumber, setPoNumber] = useState<string>("");
  const handlePoNumberChange = (value: string) => {
    setPoNumber(value);
  };
  const csNumberRef = useRef<HTMLInputElement | null>(null);
  const [csNumber, setCsNumber] = useState<string>("");
  const handleCsNumberChange = (value: string) => {
    setCsNumber(value);
  };

  const ouNameRef = useRef<HTMLInputElement | null>(null);
  const [ouName, setOuName] = useState<string>("");
  const handleOuNameChange = (value: string) => {
    setOuName(value);
  };
  const supplierBenificieryNumberRef = useRef<HTMLInputElement | null>(null);
  const [supplierBenificieryNumber, setSupplierBenificieryNumber] =
    useState<string>("");
  const handleSupplierBenificieryNumberChange = (value: string) => {
    setSupplierBenificieryNumber(value);
  };

  const lcNumberRef = useRef<HTMLInputElement | null>(null);
  const [lcNumber, setLcNumber] = useState<string>("");
  const handleLcNumberChange = (value: string) => {
    setLcNumber(value);
  };

  const blNumberRef = useRef<HTMLInputElement | null>(null);
  const [blNumber, setBlNumber] = useState<string>("");
  const handleBlNumberChange = (value: string) => {
    setBlNumber(value);
  };
  const invoiceNumberRef = useRef<HTMLInputElement | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const handleInvoiceNumberChange = (value: string) => {
    setInvoiceNumber(value);
  };
  const amountRef = useRef<HTMLInputElement | null>(null);
  const [amount, setAmount] = useState<string>("");
  const handleAmountChange = (value: string) => {
    setAmount(value);
  };

  const [ouId, setOuId] = useState<string>("");

  useEffect(() => {
    setData();
    GetBankList();
    getExistingSitelist();
  }, []);

  const setData = () => {
    if (poNumberRef.current) {
      poNumberRef.current.value = singleShipment?.PO_NUMBER.toString()!;
      handlePoNumberChange(singleShipment?.PO_NUMBER.toString()!);
    }
    if (csNumberRef.current) {
      csNumberRef.current.value = "";
      handleCsNumberChange("");
    }
    setOuId(singlePoDetails[0]?.RFQ_DETAILS.ORG_ID.toString()!);
    if (ouNameRef.current) {
      ouNameRef.current.value = singlePoDetails[0]?.OU_NAME!;
      handleOuNameChange(singlePoDetails[0]?.OU_NAME!);
    }
  };

  const [bankList, setBankList] = useState<BankInterface[] | []>([]);
  const [convertedBankList, setConvertedBankList] = useState<Bank[] | []>([]);
  const [bankView, setBankView] = useState<Bank | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const GetBankList = async () => {
    try {
      setIsLoading(true);
      const result = await BankListService(token!);
      if (result.data.status === 200) {
        setIsLoading(false);
        setBankList(result.data.data);
        const converted = result.data.data.map((bank: BankInterface) => ({
          value: bank.ID.toString(),
          label: bank.BANK_NAME,
        }));

        setConvertedBankList(converted);
      } else {
        setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      //handle error
      setIsLoading(false);
      showErrorToast("Something went wrong");
    }
  };

  const [selectedBank, setSelectedBank] = useState<string>("");
  const handleSelectBank = (value: any) => {
    setBankView(value);
    if (value !== null) {
      setSelectedBank(value.value);
    } else {
      setSelectedBank("");
      console.log("cleared");
    }
  };

  // const [siteList, setSiteList] = useState<SupplierSiteInterface[] | []>([]);

  const [convertedSiteList, setConvertedSiteList] = useState<
    ConvertedSiteInterface[] | []
  >([]);

  const [siteView, setSiteView] = useState<ConvertedSiteInterface | null>(null);

  const getExistingSitelist = async () => {
    try {
      const result = await SiteListService(token!);
      if (result.data.status === 200) {
        // setSiteList(result.data.data);
        console.log("siteList: ", result.data.data);
        const convertedList = result.data.data.map(
          (site: SupplierSiteInterface) => ({
            value: site.ID.toString(),
            label: site.ADDRESS_LINE1,
          })
        );
        setConvertedSiteList(convertedList);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Something went wrong");
    }
  };

  // site dropDown
  const [selectedSite, setSelectedSite] = useState<string>("");
  const handleSelectSite = (value: any) => {
    setSiteView(value);
    if (value !== null) {
      setSelectedSite(value.value);
    } else {
      setSelectedSite("");
    }
  };

  const [prepaymentValidation, setPrepaymentValidation] = useState<{
    poNumber?: string;
    csNumber?: string;
    ouName?: string;
    supplierBenificieryNumber?: string;
    lcNumber?: string;
    blNumber?: string;
    invoiceNo?: string;
    invoiceDate?: string;
    amount?: string;
    bank?: string;
    site?: string;
    glDate?: string;
    description?: string;
  }>({});

  const validatePrepayment = () => {
    const errors: {
      poNumber?: string;
      csNumber?: string;
      ouName?: string;
      supplierBenificieryNumber?: string;
      lcNumber?: string;
      blNumber?: string;
      invoiceNo?: string;
      invoiceDate?: string;
      amount?: string;
      bank?: string;
      site?: string;
      glDate?: string;
      description?: string;
    } = {};

    if (!poNumber.trim()) {
      errors.poNumber = "Please Enter PO Number";
    }
    if (!csNumber.trim()) {
      errors.csNumber = "Please Enter CS Number";
    }
    if (!ouName.trim()) {
      errors.ouName = "Please Enter OU Name";
    }
    // if (!supplierBenificieryNumber.trim()) {
    //   errors.supplierBenificieryNumber = "Please Enter Benificiery Number";
    // }
    // if (!lcNumber.trim()) {
    //   errors.lcNumber = "Please Enter LC Number";
    // }
    // if (!blNumber.trim()) {
    //   errors.blNumber = "Please Enter BL Number";
    // }
    if (!invoiceNumber.trim()) {
      errors.invoiceNo = "Please Enter Invoice Number";
    }
    if (selectedInvoiceDate === "") {
      errors.invoiceDate = "Please Select Invoice Date";
    }
    if (!amount.trim()) {
      errors.amount = "Please Enter Amount";
    }
    if (selectedBank === "") {
      errors.bank = "Please Select Bank";
    }
    if (selectedSite === "") {
      errors.site = "Please Select Site";
    }
    if (glDate.startDate === null) {
      errors.glDate = "Please Select GL Date";
    }
    if (prepaymentDescription === "") {
      errors.description = "Please Enter Description";
    }

    setPrepaymentValidation(errors);

    return Object.keys(errors).length === 0;
  };

  // invoice drop
  const [invoiceDropDown, setInvoiceDropDown] = useState<string>("");
  const handleSelectInvoice = (value: string) => {
    console.log(`Selected: ${value}`);
    // setSearchKey(value);
    setInvoiceDropDown(value);
    // getData(offset, value);
    // Do something with the selected value

    if (value === "prepayment") {
      createInvoice();
    } else if (value === "standardInvoice") {
      console.log("dropValue: ", value);

      setPageNo(7);
    }
  };
  // invoice drop

  //auth context

  const { token, userId, vendorId } = useAuth();

  // const createPrepayment = async () => {
  //   if (validatePrepayment()) {
  //     closePrepaymentModal();
  //     try {
  //       const result = await CreateUpdatePrepaymentInvoiceService(
  //         token!,
  //         null,
  //         "PREPAYMENT",
  //         singlePo?.PO_NUMBER.toString()!,
  //         singlePo?.PO_HEADER_ID.toString()!,
  //         singlePo?.RFQ_ID!,
  //         null,
  //         userId,
  //         vendorId?.toString()!,
  //         selectedInvoiceDate,
  //         selectedGlDate,
  //         amount,
  //         invoiceNumber,
  //         ouId,
  //         "SUBMIT",
  //         "IN PROCESS",
  //         selectedSite,
  //         selectedBank,
  //         singlePo?.CURRENCY_CODE!,
  //         prepaymentDescription
  //       );
  //       console.log(result.data);

  //       console.log(result.statusCode);

  //       if (result.data.status === 200) {
  //         showSuccessToast(result.data.message);
  //         setPageNo(1);
  //       } else if (result.statusCode === 500) {
  //         showErrorToast(result.data.error);
  //       } else {
  //         showErrorToast(result.data.message);
  //       }
  //     } catch (error) {
  //       showErrorToast("something went wrong in prepayment");
  //     }
  //   }
  // };

  const createInvoiceApi = async () => {
    // if (validatePrepayment()) {
    console.log("api called 1");
    try {
      const result = await InvoiceAddUpdateService(
        token!,
        null,
        "PREPAYMENT",
        "10131018151",
        1846514,
        null,
        null,
        null,
        null,
        "2024-07-16",
        "2024-07-16",
        "5555",
        null,
        null,
        null,
        null,
        "SAVE",
        null,
        null,
        null,
        null,
        null,
        null
      );
      console.log("api called 2");

      console.log(result.data);

      if (result.data.status === 200) {
        showSuccessToast(result.data.message);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("something went wrong");
    }
    // }
  };

  const navigateToInvoiceList = () => {
    // setPoPageNoInContext(3);
    setPageNo(5);
  };

  //shipment timeline

  //po accept reject

  const [isPoAccepted, setIsPoAccepted] = useState<boolean>(false);
  const [isPoRejected, setIsPoRejected] = useState<boolean>(false);
  const [isPoNew, setIsPoNew] = useState<boolean>(false);

  useEffect(() => {
    if (singlePoDetails[0]?.PO_STATUS === "IN PROCESS") {
      setIsPoNew(true);
    } else if (singlePoDetails[0]?.PO_STATUS === "ACCEPTED") {
      setIsPoAccepted(true);
    } else if (singlePoDetails[0]?.PO_STATUS === "REJECTED") {
      setIsPoRejected(true);
    }
  }, []); //isPoAccepted,isPoRejected,isPoNew

  //po accept reject


  const [selectedOption, setSelectedOption] = useState<{ [key: number]: string }>({});
  const [selectedShipmentId, setSelectedShipmentId] = useState<number | null>(null);
  const [selectedPoNumber, setSelectedPoNumber] = useState<number | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const [selectStatus, setSelectStatus] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [isNoteMandatory, setIsNoteMandatory] = useState<boolean>(false);
  
  const [isAcceptRejectModalOpen, setIsAcceptRejectModalOpen] = useState<boolean>(false);

  const characterLimit = 100;

  const handleStatusChange = async (status: string) => {
    setIsLoading(true);

    setSelectStatus(status);

    if (status === "REJECTED") {
      setIsNoteMandatory(true);
    } else {
      setIsNoteMandatory(false);
    }

    // Open the modal
    setIsAcceptRejectModalOpen(true);

    setIsLoading(false);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 100) {
      setNote(value);
    }
  };

  const isCharacterLimitReached = note.length === characterLimit;

  // const handleModalSubmit = async () => {
  //   if (isNoteMandatory && note.trim() === "") {
  //     showErrorToast("Note is mandatory for Rejection.");
  //     return;
  //   } else {
  //     setIsLoading(true);

  //     try {
  //       console.log(`Shipment ID: ${selectedShipmentId}, Status: ${selectStatus}, Note: ${note}`);
        
  //       const result = await ShipmentAcceptRejectService(token!, selectedShipmentId!, selectedPoNumber!, selectedOrgId!, selectStatus, note);

  //       console.log("shipment receive result: ", result);

  //       if(result.data.status === 200) {
  //         showSuccessToast(result.data.message);
  //         setShipmentPageNo(1);
  //       } else {
  //         showErrorToast(result.data.message);
  //       }
  //     } catch (error) {
  //       showErrorToast("Something went wrong");
  //     }
  //     setIsLoading(false);
  //   }

  //   setIsAcceptRejectModalOpen(false);
  //   setNote(""); // Clear the note input
  // };

  const handleModalSubmit = async () => {
    
    if (isNoteMandatory && note.trim() === "") {
      showErrorToast("Note is mandatory for Rejection.");
      return;
    }

    // if (shipmentItemDetails.length === 0) {
    //   showErrorToast("No shipment item details available.");
    //   return;
    // }

    setIsLoading(true); // Start loading state
    try {
      console.log("Shipment Item Details: ", shipmentItemDetails);

      // Prepare shipment items without modifying the shipping quantity
      // const convertShipmentItems: ShipmentSubmitItemInterface[] = shipmentItemDetails.map((item) => ({
      //   SHIPMENT_LINE_ID: item.SHIPMENT_LINE_ID,
      //   CS_LINE_ID: item.CS_LINE_ID,
      //   ITEM_CODE: item.ITEM_CODE,
      //   ITEM_DESCRIPTION: item.ITEM_DESCRIPTION,
      //   LCM_ENABLE: item.LCM_ENABLE_FLAG,
      //   OFFERED_QUANTITY: item.OFFERED_QUANTITY.toString(),
      //   SHIPPING_QUANTITY: item.SHIPPING_QUANTITY,
      //   PO_HEADER_ID: item.PO_HEADER_ID,
      //   PO_NUMBER: item.PO_NUMBER.toString(),
      //   PO_LINE_ID: item.PO_LINE_ID,
      //   PO_LINE_NUMBER: item.PO_LINE_NUMBER,
      //   SHIP_NUM: shipmentNum,
      // }));

      let convertShipmentItems: ShipmentSubmitItemInterface[];

      if (singleShipment?.RFQ_DETAILS.BUYER_DEPARTMENT === "Local") {
        convertShipmentItems = shipmentItemDetails.map((item) => ({
          SHIPMENT_LINE_ID: item.SHIPMENT_LINE_ID,
          CS_LINE_ID: item.CS_LINE_ID,
          ITEM_CODE: "",
          ITEM_DESCRIPTION: "",
          LCM_ENABLE: "",
          OFFERED_QUANTITY: "",
          SHIPPING_QUANTITY: "",
          PO_HEADER_ID: "",
          PO_NUMBER: "",
          PO_LINE_ID: "",
          PO_LINE_NUMBER: null,
          SHIP_NUM: "NA"
        }));
      } else {
        // Prepare shipment items with actual values
        convertShipmentItems = shipmentItemDetails.map((item) => ({
          SHIPMENT_LINE_ID: item.SHIPMENT_LINE_ID,
          CS_LINE_ID: item.CS_LINE_ID,
          ITEM_CODE: item.ITEM_CODE,
          ITEM_DESCRIPTION: item.ITEM_DESCRIPTION,
          LCM_ENABLE: item.LCM_ENABLE_FLAG,
          OFFERED_QUANTITY: item.OFFERED_QUANTITY.toString(),
          SHIPPING_QUANTITY: item.SHIPPING_QUANTITY,
          PO_HEADER_ID: item.PO_HEADER_ID,
          PO_NUMBER: item.PO_NUMBER.toString(),
          PO_LINE_ID: item.PO_LINE_ID,
          PO_LINE_NUMBER: item.PO_LINE_NUMBER,
          SHIP_NUM: shipmentNum
        }));
      }

      console.log("convert: ", convertShipmentItems);

      // Call the service to accept or reject the shipment with the shipment number
      const result = await ShipmentAddUpdateService(
        token!,
        singleShipment?.SHIPMENT_ID.toString() ?? "",
        singleShipment?.RFQ_ID.toString() ?? "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        singleShipment?.PO_NUMBER.toString() ?? "",
        null,
        "",
        "",
        "",
        singleShipment?.ORG_ID.toString() ?? "",
        shipmentNum && shipmentNum.trim() !== "" ? shipmentNum : "NA",
        note,
        selectStatus,
        convertShipmentItems
      );

      console.log("res: ", result);

      if (result.data.status === 200) {
        showSuccessToast(result.data.message);
        setShipmentPageNo(1);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Something went wrong");
    } finally {
      setIsLoading(false); // Reset loading state
      setIsAcceptRejectModalOpen(false); // Close modal
      setNote(""); // Clear the note input
    }
  };

  const closeResetModal = () => {
    setIsAcceptRejectModalOpen(false);
    setNote("");
  };

  return (
    <div className=" m-8 bg-white">
      <SuccessToast />
      <WarningModal
        isOpen={isAcceptPoModalShow}
        action={acceptPo}
        closeModal={closeAcceptModal}
        message="Do you want to accept this PO ?"
      />
      <div className=" w-full flex items-center justify-between">
        <div className=" flex flex-col items-start">
          <PageTitle titleText="PO Item Details" />
          {/* <NavigationPan list={pan} /> */}
        </div>
        <CommonButton
          titleText="Back"
          onClick={back}
          color="bg-midGreen"
          width="w-20"
          height="h-8"
        />
      </div>

      <div className="h-3"></div>

      { isLoading ? (
        <LogoLoading />
      ) : (
        <>
          {/* {singleShipment!.GATE_RCV_STATUS === "" ? (
            <> */}
              <div className="my-4 w-full flex space-x-8">
                {/* <DropDown
                  options={options}
                  onSelect={handleSelect}
                  width="w-48"
                  sval={selectedDropDown}
                  hint="Order Confirmation"
                  disable={isPoAccepted || isPoRejected ? true : false}
                /> */}
                {/* <CommonButton
                  onClick={createShipmentNotice}
                  titleText="Create Shipment Notice"
                  width="w-44"
                  height="h-10"
                  color="bg-midGreen"
                /> */}

                {/* <DropDown
                  options={shipmentOption}
                  onSelect={handleShipment}
                  width="w-48"
                  sval={selectShipmentDropDown}
                  hint="Shipment" */}
                  {/* // disable={isPoAccepted || isPoRejected ? true : false} */}
                {/* /> */}

                {/* <CommonButton
                  onClick={createInvoice}
                  titleText="Create Invoice"
                  width="w-44"
                  height="h-10"
                /> */}

                {/* <DropDown
                  options={createInvoiceOption}
                  onSelect={handleSelectInvoice}
                  width="w-48"
                  sval={invoiceDropDown}
                  hint="Create Invoice"
                  // disable={isPoAccepted ? false : true}
                /> */}
                {/* <CommonButton
                  onClick={viewPo}
                  titleText="View Po"
                  width="w-44"
                  height="h-10"
                  color="bg-midBlue"
                /> */}
                {/* <CommonButton
                  onClick={navigateToInvoiceList}
                  titleText="Invoice List"
                  width="w-44"
                  height="h-10"
                  color="bg-midBlack"
                /> */}

                {singleShipment?.GATE_RCV_STATUS === "ACCEPTED" || singleShipment?.GATE_RCV_STATUS === "REJECTED" ? (
                  null
                ) : (
                
                  <div className="flex items-center space-x-3">
                    <InputLebel titleText={"Get Receive"} />

                    {/* <CommonButton
                      onClick={() => handleStatusChange("REJECTED")}
                      titleText={"Decline"}
                      height="h-8"
                      width="w-24"
                      color={`bg-[#E20000]`}
                    />
                    <CommonButton
                      onClick={() => handleStatusChange("ACCEPTED")}
                      titleText={"Accept"}
                      height="h-8"
                      width="w-24"
                      color={`bg-[#00A76F]`}
                    /> */}

                    <CommonButton
                      onClick={() => handleStatusChange("REJECTED")}
                      titleText={"Decline"}
                      height="h-8"
                      width="w-24"
                      color={`bg-[#E20000] ${(singleShipment!.RFQ_DETAILS.BUYER_DEPARTMENT === "Foreign" && shipmentNum === "NA") || singleShipment?.GATE_RCV_STATUS === "ACCEPTED" || singleShipment?.GATE_RCV_STATUS === "REJECTED" || grnNum !== "" ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disable={(singleShipment!.RFQ_DETAILS.BUYER_DEPARTMENT === "Foreign" && shipmentNum === "NA") || singleShipment?.GATE_RCV_STATUS === "ACCEPTED" || singleShipment?.GATE_RCV_STATUS === "REJECTED" || grnNum !== ""}
                    />
                    <CommonButton
                      onClick={() => handleStatusChange("ACCEPTED")}
                      titleText={"Accept"}
                      height="h-8"
                      width="w-24"
                      color={`bg-[#00A76F] ${(singleShipment!.RFQ_DETAILS.BUYER_DEPARTMENT === "Foreign" && shipmentNum === "NA") || singleShipment?.GATE_RCV_STATUS === "ACCEPTED" || singleShipment?.GATE_RCV_STATUS === "REJECTED" || grnNum !== "" ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disable={(singleShipment!.RFQ_DETAILS.BUYER_DEPARTMENT === "Foreign" && shipmentNum === "NA") || singleShipment?.GATE_RCV_STATUS === "ACCEPTED" || singleShipment?.GATE_RCV_STATUS === "REJECTED" || grnNum !== ""}
                    />
                  </div>
                )}
              </div>
            {/* </>
          ) : (
            null
          )} */}

          {/* <div className=" my-4">
            <InputLebel titleText={"Track Your product Delivery"} />
          </div> */}

          <div className=" grayCard p-4 w-full flex items-start justify-between mb-8">
            <div className=" flex-1 flex space-x-4">
              <p className=" text-graishColor text-sm font-mon">Shipping From</p>
              <div className=" flex-1 space-y-2">
                <p className=" text-midBlack font-mon font-medium text-sm">
                  {/* ABC Supplier Inc. */}
                  {/* {singlePoDetails[0]?.BILL_TO_LOCATION} */}
                  {siteDetails?.ADDRESS_LINE1}
                </p>
                {/* <p className="text-midBlack font-mon font-medium text-sm">
                  Lorem ipsum dolor sit, Bangladesh
                </p> */}
              </div>
            </div>
            <div className=" flex-1 flex space-x-4">
              <p className=" text-graishColor text-sm font-mon">Deliver to</p>
              <div className=" flex-1 space-y-2">
                <p className=" text-midBlack font-mon font-medium text-sm">
                  {/* ABC Supplier Inc. */}
                  {/* {siteDetails?.ADDRESS_LINE1} */}
                  {singlePoDetails[0]?.BILL_TO_LOCATION}
                </p>
                {/* <p className="text-midBlack font-mon font-medium text-sm">
                  Lorem ipsum dolor sit, Bangladesh
                </p> */}
              </div>
            </div>
            <div className=" flex-1 space-y-2">
              <div className=" w-full flex">
                <p className=" text-graishColor text-sm font-mon w-44">
                  Purchase Order :{" "}
                </p>
                <p className=" text-midBlack font-mon font-medium text-sm">
                  {singlePoDetails[0]?.PO_NUMBER}
                </p>
              </div>
              <div className=" w-full flex">
                <p className=" text-graishColor text-sm font-mon w-44">Amount :</p>
                <p className=" text-midBlack font-mon font-medium text-sm w-44">
                  {!singlePoDetails[0]?.TOTAL_PO_AMOUNT ? "---" : singlePoDetails[0].TOTAL_PO_AMOUNT}
                </p>
              </div>
            </div>
          </div>
          {/* <div className=" mb-4">
            <InputLebel titleText={"Terms"} />
          </div> */}

          <div className=" mb-4">
            <InputLebel titleText={"Buyer Terms"} />
          </div>
          <div className="grayCard p-4 w-full flex items-start justify-between mb-8">
            <div className=" flex-1 space-y-2">
              <div className=" w-full flex">
                <p className=" text-graishColor text-sm font-mon w-44">
                  Bill to Address :{" "}
                </p>
                <p className=" text-midBlack font-mon font-medium text-sm">
                  {singlePoDetails[0]?.BILL_TO_LOCATION}
                </p>
              </div>
              <div className=" w-full flex">
                <p className=" text-graishColor text-sm font-mon w-44">
                  Ship to Address :
                </p>
                <p className=" text-midBlack font-mon font-medium text-sm w-44">
                  {singlePoDetails[0]?.SHIP_TO_LOCATION}
                </p>
              </div>
              <div className=" w-full flex">
                <p className=" text-graishColor text-sm font-mon w-44">FOB :</p>
                <p className=" text-midBlack font-mon font-medium text-sm w-44">
                  {singlePoDetails[0]?.RFQ_DETAILS.FOB === ""
                    ? "---"
                    : singlePoDetails[0]?.RFQ_DETAILS.FOB}
                </p>
              </div>
              <div className=" w-full flex">
                <p className=" text-graishColor text-sm font-mon w-44">
                  Currency :
                </p>
                <p className=" text-midBlack font-mon font-medium text-sm w-44">
                  {!singlePoDetails[0]?.RFQ_DETAILS.CURRENCY_CODE
                    ? "---"
                    : singlePoDetails[0]?.RFQ_DETAILS.CURRENCY_CODE}
                </p>
              </div>
              <div className=" w-full flex">
                <p className=" text-graishColor text-sm font-mon w-44">
                  Invoice Type :
                </p>
                <p className=" text-midBlack font-mon font-medium text-sm w-44">
                  {!singlePoDetails[0]?.RFQ_DETAILS.INVOICE_TYPE
                    ? "---"
                    : singlePoDetails[0]?.RFQ_DETAILS.INVOICE_TYPE}
                </p>
              </div>
              <div className=" w-full flex">
                <p className=" text-graishColor text-sm font-mon w-44">
                  Freight Term :
                </p>
                <p className=" text-midBlack font-mon font-medium text-sm w-44">
                  {!singlePoDetails[0]?.RFQ_DETAILS.FREIGHT_TERM
                    ? "---"
                    : singlePoDetails[0]?.RFQ_DETAILS.FREIGHT_TERM}
                </p>
              </div>
            </div>
            <div className=" flex-1 space-y-2">
              <div className=" w-full flex">
                <p className=" text-graishColor text-sm font-mon w-44">
                  Buyer Term :{" "}
                </p>
                <button
                  onClick={viewBuyerGeneralTerm}
                  className="smallViewButton  font-semibold"
                >
                  view
                </button>
              </div>
              <div className=" w-full flex">
                <p className=" text-graishColor text-sm font-mon w-44">
                  Attachment :
                </p>
                <p className=" text-midBlack font-mon font-medium text-sm w-44">
                  <a
                    target="_blank"
                    href={`${headerTermFilePath}/${singlePoDetails[0]?.RFQ_DETAILS.BUYER_ATTACHMENT_FILE_NAME}`}
                    className="smallViewButton"
                    rel="noreferrer"
                  >
                    view
                  </a>
                </p>
              </div>
              <div className=" w-full flex">
                <p className=" text-graishColor text-sm font-mon w-44">ETR :</p>
                <p className=" text-midBlack font-mon font-medium text-sm w-44">
                  {moment(singlePoDetails[0]?.RFQ_DETAILS.ETR).format("DD-MMMM-YYYY")}
                </p>
              </div>
              <div className=" w-full flex">
                <p className=" text-graishColor text-sm font-mon w-44">
                  VAT Applicable :
                </p>
                <p className=" text-midBlack font-mon font-medium text-sm w-44">
                  <div
                    className={`h-4 w-4 rounded-md border-[1px] border-borderColor flex justify-center items-center ${
                      singlePoDetails[0]?.RFQ_DETAILS.VAT_APPLICABLE_STATUS === "Y"
                        ? "bg-midGreen"
                        : "bg-white"
                    }`}
                  >
                    {singlePoDetails[0]?.RFQ_DETAILS.VAT_APPLICABLE_STATUS === "Y" ? (
                      <img
                        src="/images/check.png"
                        alt="check"
                        className=" w-2 h-2"
                      />
                    ) : null}
                  </div>
                </p>
              </div>
              <div className=" w-full flex">
                <p className=" text-graishColor text-sm font-mon w-44">VAT/TAX :</p>
                <p className=" text-midBlack font-mon font-medium text-sm w-44">
                  {singlePoDetails[0]?.RFQ_DETAILS.VAT_RATE}%
                </p>
              </div>
              <div className=" w-full flex space-x-12">
                <p className=" text-graishColor text-sm font-mon w-[206px] ">
                  Note :
                </p>
                <p className=" text-midBlack font-mon font-medium text-sm w-full">
                  {!singlePoDetails[0]?.RFQ_DETAILS.NOTE_TO_SUPPLIER
                    ? "---"
                    : singlePoDetails[0]?.RFQ_DETAILS.NOTE_TO_SUPPLIER}
                </p>
              </div>
            </div>
          </div>
          <div className=" mb-4">
            <InputLebel titleText={"Supplier Terms"} />
          </div>
          <div className=" grayCard p-4 w-full flex justify-between items-center">
            <div className=" flex-1 space-y-2">
              <div className=" w-full flex">
                <p className=" text-graishColor text-sm font-mon w-44">
                  Bill to Address :{" "}
                </p>
                <p className=" text-midBlack font-mon font-medium text-sm">
                  {/* {singlePo?.RFQ_DETAILS.BILL_TO_LOCATION_NAME} */}
                  {siteDetails?.ADDRESS_LINE1}
                </p>
              </div>
              <div className=" w-full flex">
                <p className=" text-graishColor text-sm font-mon w-44">
                  Currency :
                </p>
                <p className=" text-midBlack font-mon font-medium text-sm w-44">
                  {singlePoDetails[0]?.CURRENCY === "" ? "---" : singlePoDetails[0]?.CURRENCY}
                </p>
              </div>
            </div>
            <div className=" flex-1 space-y-2">
              <div className=" w-full flex">
                <p className=" text-graishColor text-sm font-mon w-44">
                  Quote valid date :{" "}
                </p>
                <p className=" text-midBlack font-mon font-medium text-sm">
                  {singlePoDetails[0]?.QUOT_VALID_DATE === ""
                    ? "---"
                    : isoToDateTime(singlePoDetails[0]?.QUOT_VALID_DATE)}
                </p>
              </div>
              <div className=" w-full flex">
                <p className=" text-graishColor text-sm font-mon w-44">
                  Attachment :
                </p>
                <p className=" text-midBlack font-mon font-medium text-sm w-44">
                  <a // href={`${singlePo!.header_term_file_path}/${singlePo?.RFQ_DETAILS.}`}
                    className=" smallViewButton"
                  >
                    view
                  </a>
                </p>
              </div>

              <div className=" w-full flex space-x-12">
                <p className=" text-graishColor text-sm font-mon w-[206px] ">
                  Note :
                </p>
                <p className=" text-midBlack font-mon font-medium text-sm w-full">
                  {/* Lorem ipsum dolor sit amet consectetur. Netus volutpat interdum
                  dui pharetra. Fermentum et elementum placerat in et dictumst. */}
                  {!singlePoDetails[0]?.SUPPLIER_NOTE ? "---" : singlePoDetails[0]?.SUPPLIER_NOTE}
                </p>
              </div>
            </div>
          </div>
          <div className=" my-8"></div>

          {
            <div className="overflow-auto max-h-[400px] rounded-lg shadow-lg custom-scrollbar">
              <table className="min-w-full divide-y divide-gray-200 rounded-lg">
                <thead className="bg-[#CAF4FF] sticky top-0 ">
                  <tr>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      SL
                    </th>

                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      PR No/Line No
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      Item Description
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      Expected Spec.
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      Expected Brand
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      Available Spec.
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      Available Brand
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      Available Origin
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      Need by Date
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      Promised Date
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      UOM
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      Expected quantity
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      Offered Quantity
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      Tolerance
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      Rate/unit
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      VAT
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      AIT
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      Total Amount
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      Packing Type
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      warranty
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      Remarks
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      Attachment
                    </th>
                  </tr>
                </thead>

                {poDetails.map((po, i) => (
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {i + 1}
                        </div>
                      </td>

                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {`${po.PO_NUMBER}/${po.PR_LINE_NUM}`}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {!po.ITEM_DESCRIPTION ? "---" : po.ITEM_DESCRIPTION}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {!po.ITEM_SPECIFICATION ? "---" : po.ITEM_SPECIFICATION}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {!po.EXPECTED_BRAND_NAME ? "---" : po.EXPECTED_BRAND_NAME}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {!po.AVAILABLE_SPECS ? "---" : po.AVAILABLE_SPECS}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {!po.AVAILABLE_BRAND_NAME
                            ? "---"
                            : po.AVAILABLE_BRAND_NAME}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {!po.AVAILABLE_ORIGIN ? "---" : po.AVAILABLE_ORIGIN}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {!po.NEED_BY_DATE
                            ? "---"
                            : moment(po.NEED_BY_DATE).format("DD-MMMM-YYYY")}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {!po.PROMISE_DATE
                            ? "---"
                            : moment(po.PROMISE_DATE).format("DD-MMMM-YYYY")}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {po.UNIT_MEAS_LOOKUP_CODE === ""
                            ? "---"
                            : po.UNIT_MEAS_LOOKUP_CODE}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {!po.EXPECTED_QUANTITY ? "---" : po.EXPECTED_QUANTITY}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {!po.QUOT_OFFERED_QUANTITY
                            ? "---"
                            : po.QUOT_OFFERED_QUANTITY}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {po.TOLERANCE === null ? "---" : po.TOLERANCE}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {po.UNIT_PRICE}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          <button
                            // onClick={() => {
                            //   handleLcmEnable(i);
                            // }}
                            className={` h-4 w-4  rounded-md ${
                              po.SUPPLIER_VAT_APPLICABLE === "Y"
                                ? "border-none bg-midGreen"
                                : "border-[0.1px] border-borderColor bg-white"
                            } flex justify-center items-center cursor-default`}
                          >
                            <img
                              src="/images/check.png"
                              alt="check"
                              className=" w-2 h-2"
                            />
                          </button>
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {/* AIT */}
                          ---
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {/* Total Amount */}
                          {po.UNIT_PRICE * po.QUOT_OFFERED_QUANTITY}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {!po.PACKING_TYPE ? "---" : po.PACKING_TYPE}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          <button
                            // onClick={() => {
                            //   handleLcmEnable(i);
                            // }}
                            className={` h-4 w-4  rounded-md ${
                              po.WARRANTY_BY_SUPPLIER === "Y"
                                ? "border-none bg-midGreen"
                                : "border-[0.1px] border-borderColor bg-white"
                            } flex justify-center items-center cursor-default`}
                          >
                            <img
                              src="/images/check.png"
                              alt="check"
                              className=" w-2 h-2"
                            />
                          </button>
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {/* Remarks */}
                          ---
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {/* Attachment */}
                          ---
                        </div>
                      </td>
                    </tr>
                  </tbody>
                ))}

                <tfoot className="bg-white sticky bottom-0">
                  <tr>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </tfoot>
              </table>
            </div>
          }

          <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-6">Reject Order!</h3>
              {/* <div className=" w-full flex space-x-4 items-center">
                <div className=" text-sm  text-midBlack w-36 font-mon">
                  Order Id
                </div>
                <div className=" flex-1">
                  <CommonInputField
                    inputRef={emailRef}
                    onChangeData={handleEmailChange}
                    hint="9857643"
                    type="text"
                    width="w-full"
                  />
                </div>
              </div> */}
              {/* <div className=" w-full flex space-x-4 items-center my-4">
                <div className=" text-sm font-mon text-midBlack w-36">
                  Reject Reason
                </div>
                <div className=" flex-1">
                  <DropDown
                    options={options}
                    onSelect={handleSelect}
                    width="w-full"
                    sval={selectedDropDown}
                  />
                </div>
              </div> */}
              <div className=" w-full my-4">
                <div className=" text-sm font-mon text-midBlack w-36 mb-2 font-semibold ">
                  Comments
                </div>

                <div className=" flex-1">
                  <textarea
                    value={poRejectReason}
                    onChange={handlePoRejectReasonChange}
                    placeholder="Enter text (max 150 characters)"
                    maxLength={maxLength}
                    className="block w-full px-4 py-2 border rounded-md focus:outline-none  "
                    style={{ minHeight: "160px" }}
                  />
                  <p className="text-sm text-gray-500 flex justify-end font-mon">
                    {maxLength - poRejectReason.length}/{maxLength}
                  </p>
                </div>
              </div>
              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <div className=" w-full flex items-center space-x-6">
                    <button className=" py-1 px-6 rounded-md border-[1px] border-borderColor font-mon">
                      Close
                    </button>

                    <button
                      onClick={rejectPo}
                      className="py-1 px-6 rounded-md  text-white border-[1px] border-borderColor font-mon bg-[#FF5630]"
                    >
                      Reject Order
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </dialog>

          {/* <dialog id="my_modal_2" className="modal">
            <div className="modal-box modal-middle w-3/5 max-w-none overflow-hidden">
              <button
                className="absolute top-4 right-3 pb-1 text-xl w-6 h-6 rounded-full bg-gray-500 text-white flex items-center justify-center"
                onClick={closePrepaymentModal}
              >
                <p>&times;</p>
              </button>

              <h3 className="font-bold text-lg mb-6">Prepayment Invoice</h3>

              <div className=" overflow-x-auto h-[400px] pb-10">
                <div className=" w-full flex justify-between items-center">
                  <div className=" w-full flex space-x-4 items-center pr-4">
                    <div className=" text-sm  text-midBlack w-20 font-mon">
                      PO No
                    </div>
                    <div className=" flex-1">
                      <CommonInputField
                        inputRef={poNumberRef}
                        onChangeData={handlePoNumberChange}
                        hint="ODR00001"
                        type="text"
                        width="w-full"
                        disable={true}
                      />
                      {prepaymentValidation.poNumber && (
                        <ValidationError title={prepaymentValidation.poNumber} />
                      )}
                    </div>
                  </div>

                  <div className=" w-full flex space-x-4 items-center my-4 pr-4">
                    <div className=" text-sm  text-midBlack w-20 font-mon">
                      CS Number
                    </div>
                    <div className=" flex-1">
                      <CommonInputField
                        inputRef={csNumberRef}
                        onChangeData={handleCsNumberChange}
                        hint="9857643"
                        type="text"
                        width="w-full"
                      />
                      {prepaymentValidation.csNumber && (
                        <ValidationError title={prepaymentValidation.csNumber} />
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-full flex justify-between items-center">
                  <div className=" w-full flex space-x-4 items-center my-4 pr-4">
                    <div className=" text-sm  text-midBlack w-20 font-mon">
                      OU Name
                    </div>
                    <div className=" flex-1">
                      <CommonInputField
                        inputRef={ouNameRef}
                        onChangeData={handleOuNameChange}
                        hint="9857643"
                        type="text"
                        width="w-full"
                        disable={true}
                      />
                      {prepaymentValidation.ouName && (
                        <ValidationError title={prepaymentValidation.ouName} />
                      )}
                    </div>
                  </div>

                  <div className=" w-full flex space-x-4 items-center my-4 pr-4">
                    <div className=" text-sm  text-midBlack w-20 font-mon">
                      Supplier / Benificiery Number
                    </div>
                    <div className=" flex-1">
                      <CommonInputField
                        inputRef={supplierBenificieryNumberRef}
                        onChangeData={handleSupplierBenificieryNumberChange}
                        hint="xxxxxxx"
                        type="text"
                        width="w-full"
                      />
                      {prepaymentValidation.supplierBenificieryNumber && (
                        <ValidationError
                          title={prepaymentValidation.supplierBenificieryNumber}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-full flex justify-between items-center">
                  <div className=" w-full flex space-x-4 items-center my-4 pr-4">
                    <div className=" text-sm  text-midBlack w-20 font-mon">
                      LC Number
                    </div>
                    <div className=" flex-1">
                      <CommonInputField
                        inputRef={lcNumberRef}
                        onChangeData={handleLcNumberChange}
                        hint="xxxxxxx"
                        type="text"
                        width="w-full"
                      />
                      {prepaymentValidation.lcNumber && (
                        <ValidationError title={prepaymentValidation.lcNumber} />
                      )}
                    </div>
                  </div>

                  <div className=" w-full flex space-x-4 items-center my-4 pr-4">
                    <div className=" text-sm  text-midBlack w-20 font-mon">
                      BL Number
                    </div>
                    <div className=" flex-1">
                      <CommonInputField
                        inputRef={blNumberRef}
                        onChangeData={handleBlNumberChange}
                        hint="xxxxxxx"
                        type="text"
                        width="w-full"
                      />
                      {prepaymentValidation.blNumber && (
                        <ValidationError title={prepaymentValidation.blNumber} />
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-full flex justify-between items-center">
                  <div className=" w-full flex space-x-4 items-center my-4 pr-4">
                    <div className=" text-sm  text-midBlack w-20 font-mon">
                      Invoice No
                    </div>
                    <div className=" flex-1">
                      <CommonInputField
                        inputRef={invoiceNumberRef}
                        onChangeData={handleInvoiceNumberChange}
                        hint="xxxxxxx"
                        type="text"
                        width="w-full"
                      />
                      {prepaymentValidation.invoiceNo && (
                        <ValidationError title={prepaymentValidation.invoiceNo} />
                      )}
                    </div>
                  </div>

                  <div className=" w-full flex space-x-4 items-center my-4 pr-4">
                    <div className=" text-sm  text-midBlack w-20 font-mon">
                      Invoice Date
                    </div>
                    <div className=" flex-1">
                      <DateRangePicker
                        placeholder="Select date"
                        value={invoiceDate}
                        onChange={handleInvoiceDateChange}
                        width="w-full"
                        useRange={false}
                        signle={true}
                      />
                      {prepaymentValidation.invoiceDate && (
                        <ValidationError title={prepaymentValidation.invoiceDate} />
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-full flex justify-between items-center">
                  <div className=" w-full flex space-x-4 items-center my-4 pr-4">
                    <div className=" text-sm  text-midBlack w-20 font-mon">
                      Amount
                    </div>
                    <div className=" flex-1">
                      <CommonInputField
                        inputRef={amountRef}
                        onChangeData={handleAmountChange}
                        hint="00.00"
                        type="number"
                        width="w-full"
                      />
                      {prepaymentValidation.amount && (
                        <ValidationError title={prepaymentValidation.amount} />
                      )}
                    </div>
                  </div>
                  <div className=" w-full flex space-x-4 items-center my-4 pr-4">
                    <div className=" text-sm  text-midBlack w-20 font-mon">
                      Bank
                    </div>
                    <div className=" flex-1">
                      <CommonDropDownSearch
                        placeholder="Select Bank"
                        onChange={handleSelectBank}
                        value={bankView}
                        options={convertedBankList}
                        width="w-full"
                        // disable={isDisable}
                      />
                      {prepaymentValidation.bank && (
                        <ValidationError title={prepaymentValidation.bank} />
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-full flex justify-between items-center ">
                  <div className=" w-full flex space-x-4 items-center my-4 pr-4">
                    <div className=" text-sm  text-midBlack w-20 font-mon">
                      GL Date
                    </div>
                    <div className=" flex-1">
                      <DateRangePicker
                        placeholder="Select date"
                        value={glDate}
                        onChange={handleGlDate}
                        width="w-full"
                        useRange={false}
                        signle={true}
                      />
                      {prepaymentValidation.glDate && (
                        <ValidationError title={prepaymentValidation.glDate} />
                      )}
                    </div>
                  </div>
                  <div className=" w-full flex space-x-4 items-center my-4 pr-4">
                    <div className=" text-sm  text-midBlack w-20 font-mon">
                      Site
                    </div>
                    <div className=" flex-1">
                      <CommonDropDownSearch
                        placeholder="Select Site"
                        onChange={handleSelectSite}
                        value={siteView}
                        options={convertedSiteList}
                        width="w-full"
                        // disable={isDisable}
                      />
                      {prepaymentValidation.site && (
                        <ValidationError title={prepaymentValidation.site} />
                      )}
                    </div>
                  </div>
                </div>

                <div className=" w-full pr-4 ">
                  <div className=" text-sm font-mon text-midBlack w-20 mb-2 ">
                    Description
                  </div>
                  <div className=" flex-1">
                    <textarea
                      value={prepaymentDescription}
                      onChange={handlePrepaymentDescriptionChange}
                      placeholder="Enter text (max 150 characters)"
                      maxLength={maxLength}
                      className="block w-full px-4 py-2 border rounded-md focus:outline-none  "
                      style={{ minHeight: "160px" }}
                    />
                    <p className="text-sm text-gray-500 flex justify-end font-mon">
                      {maxLength - prepaymentDescription.length}/{maxLength}
                    </p>
                    {prepaymentValidation.description && (
                      <ValidationError title={prepaymentValidation.description} />
                    )}
                  </div>
                </div>
                <div className=" w-full flex items-center space-x-6 pr-4 mt-4 justify-end">
                  <button
                    onClick={closePrepaymentModal}
                    className=" py-1 px-6 rounded-md border-[1px] border-borderColor font-mon"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={createPrepayment}
                    className="py-1 px-6 rounded-md text-white border-[1px] border-borderColor font-mon bg-[#006C9C]"
                  >
                    Submit
                  </button>
                </div>

                <div className="modal-action">
                  <form method="dialog">
                  </form>
                </div>
              </div>
            </div>
          </dialog> */}

          <dialog id="my_modal_3" className="modal">
            <div className="modal-box w-11/12 max-w-5xl">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
              <h3 className="font-bold text-lg">Buyer General Term!</h3>
              <p className="py-4">{singlePoDetails[0]?.RFQ_DETAILS.BUYER_GENERAL_TERMS}</p>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>

          {isAcceptRejectModalOpen && (
            <div className="fixed inset-0 flex justify-center items-center z-50 bg-opacity-50 bg-gray-700">
              <div className="w-[400px] h-[300px] relative bg-white rounded-[10px]">
                <div className="w-full flex justify-start items-center px-8 top-[30px] absolute text-neutral-700 text-[16px] font-bold font-mon">
                  {isNoteMandatory ? "Reject Shipment" : "Accept Shipment"}
                </div>
                <div className="w-full flex justify-start items-center px-8 top-[70px] absolute text-neutral-700 text-sm font-mon font-medium">
                  Please provide a note:
                </div>
                
                <div className="w-full px-8 mt-[100px]">
                  <textarea
                    value={note}
                    // onChange={(e) => setNote(e.target.value)}
                    onChange={handleNoteChange}
                    maxLength={characterLimit}
                    placeholder="Enter your note here..."
                    className="w-full h-24 p-2 border-[1px] text-sm border-gray-200 rounded-lg focus:outline-none resize-none"
                  />
                </div>

                <div className={`w-full flex justify-end items-end px-8 top-[195px] absolute text-sm ${
                  isCharacterLimitReached ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {note.length}/{characterLimit}
                </div>
                <div className="w-full flex space-x-4 h-7 top-[240px] absolute px-8 justify-end items-center">
                  <button
                    onClick={closeResetModal}
                    className="h-10 w-28 rounded-[8px] bg-white border-[1px] border-borderColor text-md font-medium font-mon text-black"
                  >
                    No
                  </button>
                  <button
                    onClick={handleModalSubmit}
                    className="h-10 w-28 rounded-[8px] bg-midGreen text-white text-md font-medium font-mon"
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* shipment a */}
      <dialog id="my_modal_111" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">
            {grnNum !== ""
              ? `Contact SSGIL to create new shipment for '${singleShipment?.PO_NUMBER}' this purchase order`
              : `Contact SSGIL to create shipment for '${singleShipment?.PO_NUMBER}' this purchase order`
            }
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* {/ if there is a button in form, it will close the modal /} */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
