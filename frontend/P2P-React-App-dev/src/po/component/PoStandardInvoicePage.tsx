import { useEffect, useRef, useState } from "react";
import DropDown from "../../common_component/DropDown";
import NavigationPan from "../../common_component/NavigationPan";
import PageTitle from "../../common_component/PageTitle";
import FilePickerInput from "../../common_component/FilePickerInput";
import CommonInputField from "../../common_component/CommonInputField";
import DateRangePicker from "../../common_component/DateRangePicker";
import CommonButton from "../../common_component/CommonButton";
import useSupplierPoStore from "../../po_supplier/store/SupplierPoStore";
import SuccessModal from "../../common_component/SuccessModal";
import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";
import PoItemInterface from "../../po_supplier/interface/PoItemInterface";
import PoDetailsService from "../service/PoDetailsService";
import { useAuth } from "../../login_both/context/AuthContext";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import SupplierSiteInterface from "../../registration/interface/SupplierSiteInterface";
import SiteListService from "../../registration/service/site_creation/SiteListService";
import moment from "moment";
import BankInterface from "../../registration/interface/BankInterface";
import BankListService from "../../registration/service/bank/BankListService";
import { values } from "lodash";
import HierarchyInterface from "../../registration/interface/hierarchy/HierarchyInterface";
import ProfileUpdateHierarchyService from "../../manage_supplier_profile_update/service/ProfileUpdateHierarchyService";
import HierachyListByModuleService from "../../registration/service/approve_hierarchy/HierarchyListByModuleService";
import DeleteIcon from "../../icons/DeleteIcon";
import InvoiceItemInterface from "../interface/invoiceItemInterface";
import React from "react";
import LogoLoading from "../../Loading_component/LogoLoading";
import WarningModal from "../../common_component/WarningModal";
import ArrowLeftIcon from "../../icons/ArrowLeftIcon";
import ArrowRightIcon from "../../icons/ArrowRightIcon";
import CreateStandardInvoiceService from "../service/CreateStandardInvoiceService";
import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";
import AddIcon from "../../icons/AddIcon";
import ConvertedInvoiceItemInterface from "../interface/ConvertedInvoiceItemInterface";
import { v4 as uuidv4 } from "uuid";
import ExpenseTypeInterface from "../interface/ExpenseTypeInterface";
import GetExpenseTypeService from "../service/GetExpenseTypeService";
import InvoiceInterface from "../interface/InvoiceInterface";
import InvoiceListService from "../service/InvoiceListService";
import CommonDropDownSearch from "../../common_component/CommonDropDownSearch";
import PaymentMethodListService from "../../manage_supplier/service/setup/PaymentMethodListService";
const pan = ["Dashboard", "Invoice", "Create Invoice"];

const siteOptions = [
  { value: "dhaka", label: "Dhaka" },
  { value: "rajshahi", label: "Rajshahi" },
  { value: "chittagong", label: "Chittagong" },
  { value: "sylhet", label: "Sylhet" },
];

const expenceType = [
  { value: "TDS", label: "TDS" },
  { value: "VDS", label: "VDS" },
  { value: "Tax", label: "Tax" },
  { value: "Loading Charge", label: "Loading Charge" },
  { value: "Unloading Charge", label: "Unloading Charge" },
];

const selectionType = [{ value: "MISCELLANEOUS", label: "MISCELLANEOUS" }];

interface ConvertedSiteInterface {
  value: string;
  label: string;
}

interface ConvertedBankInterface {
  value: string;
  label: string;
}

interface ConvertedExpenceType {
  value: string;
  label: string;
}

export default function PoStandardInvoicePage() {
  const { token, userId, vendorId } = useAuth();
  const { setPageNo, singlePo, setSinglePo } = useSupplierPoStore();

  const back = () => {
    setPageNo(2);
  };

  // itemType dropDown
  const [itemDropDown, setItemDropDown] = useState<string>("");
  const handleSelectItem = (value: string) => {
    console.log(`Selected: ${value}`);
    // setSearchKey(value);
    setItemDropDown(value);
    // getData(offset, value);
    // Do something with the selected value
  };
  // itemType dropDown

  //order Id

  //order Id

  // invoice date
  const [invoiceDate, setInvoiceDate] = useState({
    startDate: null,
    endDate: null, // Set the endDate to the end of the current year
  });
  const [glDate, setGlDate] = useState({
    startDate: null,
    endDate: null, // Set the endDate to the end of the current year
  });

  const [currentInvoiceDate, setCurrentInvoiceDate] = useState<string>("");
  const [currentGlDate, setCurrentGlDate] = useState<string>("");

  useEffect(() => {
    setCurrentInvoiceDate(moment(Date.now()).format("YYYY-MM-DD"));
    setCurrentGlDate(moment(Date.now()).format("YYYY-MM-DD"));
  }, []);

  const [selectedGlDate, setSelectedGlDate] = useState<string>("");

  const [selectedInvoiceDate, setSelectedInvoiceDate] = useState<string>("");

  const handleInvoiceDateChange = (newValue: any) => {
    console.log("newValue:", newValue);
    setInvoiceDate(newValue);
    setSelectedInvoiceDate(moment(newValue.startDate).format("YYYY-MM-DD"));
  };
  // invoice date

  const handleGlDateChange = (newValue: any) => {
    console.log("newValue:", newValue);
    setGlDate(newValue);
    setSelectedGlDate(moment(newValue.startDate).format("YYYY-MM-DD"));
  };

  const viewSummary = () => {
    const modal = document.getElementById("my_modal_1");
    if (modal instanceof HTMLDialogElement) {
      modal.showModal();
    }
  };
  const viewPrepayment = () => {
    const modal = document.getElementById("my_modal_2");
    if (modal instanceof HTMLDialogElement) {
      modal.showModal();
    }
  };

  const handleDraft = () => {};

  const handlePreview = () => {
    setPageNo(5);
  };

  const [poItemList, setPoItemList] = useState<InvoiceItemInterface[]>([]);
  const [selectedPoItemList, setSelectedPoItemList] = useState<
    InvoiceItemInterface[] | []
  >([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [total, setTotal] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(5);
  const [pageNo2, setPageNo2] = useState<number>(1);
  const [offset, setOffSet] = useState<number>(1);

  useEffect(() => {
    console.log("user id", userId);
    console.log("po h", singlePo?.PO_HEADER_ID);
    console.log("po", singlePo?.PO_NUMBER);
    getInvoiceList();
    getExpenceType();

    getExistingSitelist();
    GetBankList();
    getApproverHierachy();
  }, []);

  const [expenceTypeList, setExpenceTypeList] = useState<
    ExpenseTypeInterface[]
  >([]);
  const [convertedExpenceTypeList, setConvertedExpenceTypeList] = useState<
    ConvertedExpenceType[]
  >([]);

  const getExpenceType = async () => {
    try {
      setIsLoading(true);
      const result = await GetExpenseTypeService(token!);
      if (result.statusCode === 200) {
        const converted = result.data.data.map(
          (item: ExpenseTypeInterface) => ({
            value: item.EXPNSE_TYPE,
            label: item.MEANING,
          })
        );
        setConvertedExpenceTypeList(converted);
        setExpenceTypeList(result.data.data);
      } else {
        showErrorToast("Expence Type Load Failed");
      }
    } catch (error) {
      showErrorToast("Something went wrong");
    }
  };

  useEffect(() => {
    if (convertedExpenceTypeList) {
      getPoDetails(offset, limit);
    }
  }, [convertedExpenceTypeList]);

  const getPoDetails = async (ofs: number, lmt: number) => {
    try {
      // setIsLoading(true); //1846514 singlePo?.PO_HEADER_ID!
      const result = await PoDetailsService(
        token!,
        singlePo?.PO_HEADER_ID!,
        null,
        ofs,
        lmt
      );
      console.log(result.data.data);

      if (result.data.status === 200) {
        const converted = result.data.data.map(
          (item: InvoiceItemInterface) => ({
            AVAILABLE_BRAND_NAME: item.AVAILABLE_BRAND_NAME,
            AVAILABLE_ORIGIN: item.AVAILABLE_ORIGIN,
            AVAILABLE_SPECS: item.AVAILABLE_SPECS,
            AWARDED: item.AVAILABLE_SPECS,
            AWARDED_BY: item.AWARDED_BY,
            CS_CREATED_BY: item.CS_CREATED_BY,
            CS_CREATION_DATE: item.CS_CREATION_DATE,
            CS_CS_LINE_ID: item.CS_CS_LINE_ID,
            CS_ID: item.CS_ID,
            CS_PO_HEADER_ID: item.CS_PO_HEADER_ID,
            CS_PO_NUMBER: item.CS_PO_NUMBER,
            CS_QUOT_LINE_ID: item.CS_QUOT_LINE_ID,
            CS_RFQ_ID: item.CS_RFQ_ID,
            CS_RFQ_LINE_ID: item.CS_RFQ_LINE_ID,
            EBS_ACCEPT_QTY: item.EBS_ACCEPT_QTY,
            EBS_DELIVERED_QTY: item.EBS_DELIVERED_QTY,
            EBS_GRN_DATE: item.EBS_GRN_DATE,
            EBS_GRN_NO: item.EBS_GRN_NO,
            EBS_GRN_QTY: item.EBS_GRN_QTY,
            EBS_RECEIVE_QTY: item.EBS_RECEIVE_QTY,
            EBS_REJECT_QTY: item.EBS_REJECT_QTY,
            EXPECTED_BRAND_NAME: item.EXPECTED_BRAND_NAME,
            EXPECTED_ORIGIN: item.EXPECTED_ORIGIN,
            ITEM_SPECIFICATION: item.ITEM_SPECIFICATION,
            LCM_ENABLE: item.LCM_ENABLE,
            NOTE_FROM_BUYER: item.NOTE_FROM_BUYER,
            PACKING_TYPE: item.PACKING_TYPE,
            PROMISE_DATE: item.PROMISE_DATE,
            QUOT_CREATED_BY: item.QUOT_CREATED_BY,
            QUOT_CREATION_DATE: item.QUOT_CREATION_DATE,
            QUOT_OFFERED_QUANTITY: item.QUOT_OFFERED_QUANTITY,
            QUOT_QUOT_LINE_ID: item.QUOT_QUOT_LINE_ID,
            QUOT_RFQ_ID: item.QUOT_RFQ_ID,
            QUOT_RFQ_LINE_ID: item.QUOT_RFQ_LINE_ID,
            QUOT_USER_ID: item.QUOT_USER_ID,
            RECOMMENDED: item.RECOMMENDED,
            RECOMMENDED_BY: item.RECOMMENDED_BY,
            SHIPMENT_CREATED_BY: item.SHIPMENT_CREATED_BY,
            SHIPMENT_CREATION_DATE: item.SHIPMENT_CREATION_DATE,
            SHIPMENT_CS_LINE_ID: item.SHIPMENT_CS_LINE_ID,
            SHIPMENT_ID: item.SHIPMENT_ID,
            SHIPMENT_ITEM_CODE: item.SHIPMENT_ITEM_CODE,
            SHIPMENT_ITEM_DESCRIPTION: item.SHIPMENT_ITEM_DESCRIPTION,
            SHIPMENT_LINE_ID: item.SHIPMENT_LINE_ID,
            SHIPMENT_OFFERED_QUANTITY: item.SHIPMENT_OFFERED_QUANTITY,
            SHIPMENT_PO_HEADER_ID: item.SHIPMENT_PO_HEADER_ID,
            SHIPMENT_PO_NUMBER: item.SHIPMENT_PO_NUMBER,
            SHIPMENT_SHIPPING_QUANTITY: item.SHIPMENT_SHIPPING_QUANTITY,
            SUPPLIER_VAT_APPLICABLE: item.SUPPLIER_VAT_APPLICABLE,
            SUP_FILE_NAME: item.SUP_FILE_NAME,
            SUP_FILE_ORG_NAME: item.SUP_FILE_ORG_NAME,
            TOLERANCE: item.TOLERANCE,
            UNIT_MEAS_LOOKUP_CODE: item.UNIT_MEAS_LOOKUP_CODE,
            UNIT_PRICE: item.UNIT_PRICE,
            WARRANTY_BY_SUPPLIER: item.WARRANTY_BY_SUPPLIER,
            INVOICE_QTY: "",
            ITEM_DESCRIPTION: "",
            ITEM_TYPE_LIST: selectionType,
            EXPENCE_TYPE_LIST: convertedExpenceTypeList,
            ITEM_TYPE: "",
            EXPENCE_TYPE: "",
            LINE_TYPE_CODE: "ITEM",
            ID: uuidv4().toString(),
            TOTAL_AMOUNT: "",
            PO_LINE_NUMBER: item.PO_LINE_NUMBER,
            ITEM_CODE: item.ITEM_CODE,
            AWARD_QUANTITY: item.AWARD_QUANTITY,
            PRE_BILL_INVOICE_QTY: item.PRE_BILL_INVOICE_QTY,
            PO_UNIT_PRICE: item.PO_UNIT_PRICE,
          })
        );
        console.log(converted);

        setPoItemList(converted);
        dividePage(result.data.total, lmt);
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

  // add to list
  // const addItemToList = () => {
  //   const id = uuidv4();
  //   console.log(id);

  //   const converted: InvoiceItemInterface = {
  //     AVAILABLE_BRAND_NAME: "",
  //     AVAILABLE_ORIGIN: "",
  //     AVAILABLE_SPECS: "",
  //     AWARDED: "",
  //     AWARDED_BY: "",
  //     CS_CREATED_BY: "",
  //     CS_CREATION_DATE: "",
  //     CS_CS_LINE_ID: "",
  //     CS_ID: "",
  //     CS_PO_HEADER_ID: "",
  //     CS_PO_NUMBER: "",
  //     CS_QUOT_LINE_ID: "",
  //     CS_RFQ_ID: "",
  //     CS_RFQ_LINE_ID: "",
  //     EBS_ACCEPT_QTY: "",
  //     EBS_DELIVERED_QTY: "",
  //     EBS_GRN_DATE: "",
  //     EBS_GRN_NO: "",
  //     EBS_GRN_QTY: "",
  //     EBS_RECEIVE_QTY: "",
  //     EBS_REJECT_QTY: "",
  //     EXPECTED_BRAND_NAME: "",
  //     EXPECTED_ORIGIN: "",
  //     ITEM_SPECIFICATION: "",
  //     LCM_ENABLE: "",
  //     NOTE_FROM_BUYER: "",
  //     PACKING_TYPE: "",
  //     PROMISE_DATE: "",
  //     QUOT_CREATED_BY: "",
  //     QUOT_CREATION_DATE: "",
  //     QUOT_OFFERED_QUANTITY: "",
  //     QUOT_QUOT_LINE_ID: "",
  //     QUOT_RFQ_ID: "",
  //     QUOT_RFQ_LINE_ID: "",
  //     QUOT_USER_ID: "",
  //     RECOMMENDED: "",
  //     RECOMMENDED_BY: "",
  //     SHIPMENT_CREATED_BY: "",
  //     SHIPMENT_CREATION_DATE: "",
  //     SHIPMENT_CS_LINE_ID: "",
  //     SHIPMENT_ID: "",
  //     SHIPMENT_ITEM_CODE: "",
  //     SHIPMENT_ITEM_DESCRIPTION: "",
  //     SHIPMENT_LINE_ID: "",
  //     SHIPMENT_OFFERED_QUANTITY: "",
  //     SHIPMENT_PO_HEADER_ID: "",
  //     SHIPMENT_PO_NUMBER: "",
  //     SHIPMENT_SHIPPING_QUANTITY: "",
  //     SUPPLIER_VAT_APPLICABLE: "",
  //     SUP_FILE_NAME: "",
  //     SUP_FILE_ORG_NAME: "",
  //     TOLERANCE: "",
  //     UNIT_MEAS_LOOKUP_CODE: "",
  //     UNIT_PRICE: "",
  //     WARRANTY_BY_SUPPLIER: "",
  //     INVOICE_QTY: "",
  //     ITEM_DESCRIPTION: "",
  //     ITEM_TYPE: selectionType,
  //     EXPENCE_TYPE: convertedExpenceTypeList,
  //     SELECTED_ITEM_TYPE: "",
  //     SELECTED_EXPENCE_TYPE: "",
  //     LINE_TYPE_CODE: "",
  //     ID: id,
  //     TOTAL_AMOUNT: "",
  //   };

  //   setPoItemList([...poItemList, converted]);

  // };

  // add to list

  const addItemToList = () => {
    let id = uuidv4();

    const converted: InvoiceItemInterface = {
      AVAILABLE_BRAND_NAME: "",
      AVAILABLE_ORIGIN: "",
      AVAILABLE_SPECS: "",
      AWARDED: "",
      AWARDED_BY: "",
      CS_CREATED_BY: "",
      CS_CREATION_DATE: "",
      CS_CS_LINE_ID: "",
      CS_ID: "",
      CS_PO_HEADER_ID: "",
      CS_PO_NUMBER: "",
      CS_QUOT_LINE_ID: "",
      CS_RFQ_ID: "",
      CS_RFQ_LINE_ID: "",
      EBS_ACCEPT_QTY: "",
      EBS_DELIVERED_QTY: "",
      EBS_GRN_DATE: "",
      EBS_GRN_NO: "",
      EBS_GRN_QTY: "",
      EBS_RECEIVE_QTY: "",
      EBS_REJECT_QTY: "",
      EXPECTED_BRAND_NAME: "",
      EXPECTED_ORIGIN: "",
      ITEM_SPECIFICATION: "",
      LCM_ENABLE: "",
      NOTE_FROM_BUYER: "",
      PACKING_TYPE: "",
      PROMISE_DATE: "",
      QUOT_CREATED_BY: "",
      QUOT_CREATION_DATE: "",
      QUOT_OFFERED_QUANTITY: "",
      QUOT_QUOT_LINE_ID: "",
      QUOT_RFQ_ID: "",
      QUOT_RFQ_LINE_ID: "",
      QUOT_USER_ID: "",
      RECOMMENDED: "",
      RECOMMENDED_BY: "",
      SHIPMENT_CREATED_BY: "",
      SHIPMENT_CREATION_DATE: "",
      SHIPMENT_CS_LINE_ID: "",
      SHIPMENT_ID: "",
      SHIPMENT_ITEM_CODE: "",
      SHIPMENT_ITEM_DESCRIPTION: "",
      SHIPMENT_LINE_ID: "",
      SHIPMENT_OFFERED_QUANTITY: "",
      SHIPMENT_PO_HEADER_ID: singlePo?.PO_HEADER_ID.toString()!,
      SHIPMENT_PO_NUMBER: singlePo?.PO_NUMBER!,
      SHIPMENT_SHIPPING_QUANTITY: "",
      SUPPLIER_VAT_APPLICABLE: "",
      SUP_FILE_NAME: "",
      SUP_FILE_ORG_NAME: "",
      TOLERANCE: "",
      UNIT_MEAS_LOOKUP_CODE: "",
      UNIT_PRICE: "",
      WARRANTY_BY_SUPPLIER: "",
      INVOICE_QTY: "",
      ITEM_DESCRIPTION: "",
      ITEM_TYPE_LIST: selectionType,
      EXPENCE_TYPE_LIST: convertedExpenceTypeList,
      ITEM_TYPE: "",
      EXPENCE_TYPE: "",
      LINE_TYPE_CODE: "MISCELLANEOUS",
      ID: id, // Use the generated UUID
      TOTAL_AMOUNT: "",
      PO_LINE_NUMBER: 0,
      ITEM_CODE: "",
      AWARD_QUANTITY: "",
      PRE_BILL_INVOICE_QTY: "",
      PO_UNIT_PRICE: "",
    };
    console.log(converted);

    // Add the new item to the list
    setPoItemList([...poItemList, converted]);
    console.log("Current poItemList:", poItemList);
  };

  //site list

  //drop down
  const [selectedItemType, setSelectedItemType] = useState<string[]>([]);
  const [selectedExpenceType, setSelectedExpenceType] = useState<string[]>([]);

  const handleSelectItemType = (value: string, index: number) => {
    const updatedSelectedItemType = [...selectedItemType];
    updatedSelectedItemType[index] = value;
    setSelectedItemType(updatedSelectedItemType);
    const newPoItemList = [...poItemList];
    newPoItemList[index].ITEM_TYPE = value;
    // newPoItemList[index].LINE_TYPE_CODE = value;

    setPoItemList(newPoItemList);
  };
  const handleSelectExpenceType = (value: string, index: number) => {
    const updatedSelectedExpenceType = [...selectedExpenceType];
    updatedSelectedExpenceType[index] = value;
    setSelectedExpenceType(updatedSelectedExpenceType);
    const newPoItemList = [...poItemList];
    newPoItemList[index].EXPENCE_TYPE = value;
    console.log(value);

    setPoItemList(newPoItemList);
  };

  //drop down

  //pagination

  const renderPageNumbers = () => {
    const totalPages = total ?? 0;
    const pageWindow = 5;
    const halfWindow = Math.floor(pageWindow / 2);
    let startPage = Math.max(1, pageNo2 - halfWindow);
    let endPage = Math.min(totalPages, startPage + pageWindow - 1);

    if (endPage - startPage + 1 < pageWindow) {
      startPage = Math.max(1, endPage - pageWindow + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => {
            setPageNo2(i);
            setOffSet((i - 1) * limit);
            getPoDetails((i - 1) * limit, limit);
          }}
          className={`w-6 h-6 text-[12px] border rounded-md ${
            pageNo2 === i ? "border-sky-400" : "border-transparent"
          }`}
          disabled={pageNo2 === i}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  const next = async () => {
    let newOff;

    newOff = offset + limit;
    console.log(newOff);
    setOffSet(newOff);

    setPageNo2((pre) => pre + 1);
    console.log(limit);
    // getHistory("", "", newOff, limit);
    getPoDetails(newOff, limit);
  };

  const previous = async () => {
    let newOff = offset - limit;
    console.log(newOff);
    if (newOff < 0) {
      newOff = 0;
      console.log(newOff);
    }

    setOffSet(newOff);
    setPageNo2((pre) => pre - 1);
    console.log(limit);

    // getHistory("", "", newOff, limit);
    getPoDetails(newOff, limit);
  };

  const dividePage = (number: number, lmt: number) => {
    console.log(number);
    if (typeof number !== "number") {
      throw new Error("Input must be a number");
    }

    const re = Math.ceil(number / lmt);

    setTotal(re);
  };

  //pagination

  const [siteList, setSiteList] = useState<SupplierSiteInterface[] | []>([]);

  const [convertedSiteList, setConvertedSiteList] = useState<
    ConvertedSiteInterface[] | []
  >([]);

  const getExistingSitelist = async () => {
    try {
      setIsLoading(true);
      const result = await SiteListService(token!);
      if (result.data.status === 200) {
        setIsLoading(false);
        setSiteList(result.data.data);
        console.log("siteList: ", result.data.data);
        const convertedList = result.data.data.map(
          (site: SupplierSiteInterface) => ({
            value: site.ID.toString(),
            label: site.ADDRESS_LINE1,
          })
        );
        setConvertedSiteList(convertedList);
      } else {
        setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      showErrorToast("Something went wrong");
    }
  };

  // site dropDown
  const [selectedSite, setSelectedSite] = useState<string>("");
  const handleSelectSite = (value: string) => {
    console.log(`Selected: ${value}`);
    // setSearchKey(value);

    if (selectedPrepaySite) {
      if (value === selectedPrepaySite) {
        setSelectedSite(value);
      } else {
        setSelectedSite("");
        showErrorToast("Please Select Another Site");
      }
    } else {
      setSelectedSite(value);
    }

    // getData(offset, value);
    // Do something with the selected value
  };
  // site dropDown

  //site list

  //mushok attachment
  const [mushokFileName, setMushokFileName] = useState<string | null>(null);
  const [mushokFile, setMushokFile] = useState<File | null>(null);

  const handleMushok = (file: File | null) => {
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file);
      setMushokFile(file);
    } else {
      // No file selected
      console.log("No file selected");
    }
  };
  //attachment

  const headerDescriptionRef = useRef<HTMLInputElement | null>(null);
  const [headerDescription, setHeaderDescription] = useState<string>("");
  const handleHeaderDescriptionChange = (value: string) => {
    setHeaderDescription(value);
  };

  const invoiceNumberRef = useRef<HTMLInputElement | null>(null);
  const prepayAmountRef = useRef<HTMLInputElement | null>(null);

  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [prepayAmount, setPrepayAmount] = useState<string>("");

  const handleInvoiceNumberChange = (value: string) => {
    setInvoiceNumber(value);
  };
  const handlePrepayAmountChange = (value: string) => {
    if (isNaN(parseFloat(value))) {
      console.log("nan");
    } else {
      console.log(selectedPrepayAvailble);
      console.log(value);

      if (parseFloat(value) <= parseFloat(selectedPrepayAvailble)) {
        if (prepayAmountRef.current) {
          prepayAmountRef.current.value = value;
          setPrepayAmount(value);
        }
      } else {
        showErrorToast("This Amount is greater than available amount");
        if (prepayAmountRef.current) {
          prepayAmountRef.current.value = "";
        }
        setPrepayAmount("");
      }
    }
  };

  const vatRef = useRef<HTMLInputElement | null>(null);

  const [vat, setVat] = useState<string>("");

  const handleVatChange = (value: string) => {
    setVat(value);
  };

  const taxRef = useRef<HTMLInputElement | null>(null);

  const [tax, setTax] = useState<string>("");

  const handleTaxChange = (value: string) => {
    setTax(value);
  };
  const invoiceAmountRef = useRef<HTMLInputElement | null>(null);

  const [invoiceAmount, setInvoiceAmount] = useState<string>("");

  const handleInvoiceAmountChange = (value: string) => {
    console.log(value);

    setInvoiceAmount(value);
  };

  const [bankList, setBankList] = useState<BankInterface[] | []>([]);
  const [convertedBankList, setConvertedBankList] = useState<
    ConvertedBankInterface[] | []
  >([]);

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
  const handleSelectBank = (value: string) => {
    console.log(`Selected: ${value}`);
    // setSearchKey(value);
    setSelectedBank(value);
    // getData(offset, value);
    // Do something with the selected value
  };

  //approvaer hierarchy show

  const [hierarchyUserProfilePicturePath, setHierarchyUserProfilePicturePath] =
    useState<string>("");
  const [hierarchyList, setHierarchyList] = useState<HierarchyInterface[] | []>(
    []
  );

  const getApproverHierachy = async () => {
    const decodedToken = decodeJWT(token!);
    console.log("token: ", token);

    // Extract USER_ID from the decoded payload
    const userId = decodedToken?.decodedPayload?.USER_ID;

    try {
      const result = await HierachyListByModuleService(
        token!,
        userId,
        "Invoice Approval"
      );
      if (result.data.status === 200) {
        setHierarchyUserProfilePicturePath(result.data.profile_pic);
        setHierarchyList(result.data.data);
      } else {
        // showErrorToast(result.data.message);
      }
    } catch (error) {
      // showErrorToast("Something went wrong");
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

  //approvaer hierarchy show

  //item list

  const invoiceQuantityRefs = useRef<HTMLInputElement[]>([]);

  const [invoiceQuantityList, setInvoiceQuantityList] = useState<string[] | []>(
    []
  );
  let sum: number = 0;

  const totalAmountRefs = useRef<HTMLInputElement[]>([]);

  const [totalAmountList, setTotalAmountList] = useState<string[]>([]);

  const handleInvoiceQtyChange2 = (value: string, index: number) => {
    const newInvoiceQtyList = [...invoiceQuantityList];

    invoiceQuantityList[index] = value;
    setInvoiceQuantityList(newInvoiceQtyList);

    const newPoItemList = [...poItemList];
    newPoItemList[index].INVOICE_QTY = value;

    if (parseInt(newPoItemList[index].EBS_DELIVERED_QTY) < parseInt(value)) {
      showErrorToast(
        `Invoice Quantity has be less than or equal to delivered quantity on item ${
          index + 1
        }`
      );
      handleInvoiceNumberChange("");
      if (invoiceAmountRef.current) {
        invoiceAmountRef.current.value = "";
      }
    }

    setPoItemList(newPoItemList);
  };

  // const handleInvoiceQtyChange = (value: string, index: number) => {
  //   const newInvoiceQtyList = [...invoiceQuantityList];
  //   newInvoiceQtyList[index] = value;
  //   setInvoiceQuantityList(newInvoiceQtyList);

  //   const newPoItemList = [...poItemList];
  //   newPoItemList[index].INVOICE_QTY = value;

  //   if (parseInt(newPoItemList[index].EBS_DELIVERED_QTY) < parseInt(value)) {
  //     showErrorToast(
  //       `Invoice Quantity has be less than or equal to delivered quantity on item ${
  //         index + 1
  //       }`
  //     );
  //     handleInvoiceNumberChange("");
  //     if (invoiceAmountRef.current) {
  //       invoiceAmountRef.current.value = "";
  //     }
  //   }

  //   // Update selected items if necessary
  //   if (
  //     selectedPoItemList.some((item) => item.ID === newPoItemList[index].ID)
  //   ) {
  //     // Recalculate total sum
  //     let totalSum = 0;
  //     selectedPoItemList.forEach((selectedItem) => {
  //       const invoiceQty = parseFloat(selectedItem.INVOICE_QTY) || 0;
  //       const unitPrice = parseFloat(selectedItem.UNIT_PRICE) || 0;
  //       const tm = parseFloat(selectedItem.TOTAL_AMOUNT) || 0;
  //       const totalAmount = invoiceQty * unitPrice + tm;

  //       totalSum += totalAmount;
  //     });

  //     if (invoiceAmountRef.current) {
  //       invoiceAmountRef.current.value = totalSum.toString();
  //     }

  //     const newTotalAmountList = [...totalAmountList];
  //     newTotalAmountList[index] = totalSum.toString();
  //     setTotalAmountList(newTotalAmountList);

  //     const newPoItemList2 = [...poItemList];
  //     newPoItemList2[index].TOTAL_AMOUNT = totalSum.toString();

  //     handleInvoiceAmountChange(totalSum.toString());
  //     setPoItemList(newPoItemList2);
  //   }

  //   setPoItemList(newPoItemList);
  // };

  // const handleInvoiceQtyChange = (value: string, index: number) => {
  //   const newInvoiceQtyList = [...invoiceQuantityList];
  //   newInvoiceQtyList[index] = value;
  //   setInvoiceQuantityList(newInvoiceQtyList);

  //   const newPoItemList = [...poItemList];
  //   newPoItemList[index].INVOICE_QTY = value;

  //   if (parseInt(newPoItemList[index].EBS_DELIVERED_QTY) < parseInt(value)) {
  //     showErrorToast(
  //       `Invoice Quantity has be less than or equal to delivered quantity on item ${
  //         index + 1
  //       }`
  //     );
  //     handleInvoiceNumberChange("");
  //     if (invoiceAmountRef.current) {
  //       invoiceAmountRef.current.value = "";
  //     }
  //   }

  //   // Calculate the total amount for this specific item
  //   const invoiceQty = parseFloat(value) || 0;
  //   const unitPrice = parseFloat(newPoItemList[index].UNIT_PRICE) || 0;
  //   const totalAmount = invoiceQty * unitPrice;

  //   // Update the TOTAL_AMOUNT for this specific item
  //   newPoItemList[index].TOTAL_AMOUNT = totalAmount.toString();

  //   // Update the totalAmountList
  //   const newTotalAmountList = [...totalAmountList];
  //   newTotalAmountList[index] = totalAmount.toString();
  //   setTotalAmountList(newTotalAmountList);

  //   // Recalculate total sum for all selected items
  //   if (
  //     selectedPoItemList.some((item) => item.ID === newPoItemList[index].ID)
  //   ) {
  //     let totalSum = 0;
  //     selectedPoItemList.forEach((selectedItem) => {
  //       const itemIndex = poItemList.findIndex(
  //         (item) => item.ID === selectedItem.ID
  //       );
  //       if (itemIndex !== -1) {
  //         const invoiceQty =
  //           parseFloat(newPoItemList[itemIndex].INVOICE_QTY) || 0;
  //         const unitPrice =
  //           parseFloat(newPoItemList[itemIndex].UNIT_PRICE) || 0;
  //         const itemTotalAmount = invoiceQty * unitPrice;
  //         totalSum += itemTotalAmount;
  //       }
  //     });

  //     if (invoiceAmountRef.current) {
  //       invoiceAmountRef.current.value = totalSum.toString();
  //     }

  //     handleInvoiceAmountChange(totalSum.toString());
  //   }

  //   setPoItemList(newPoItemList);
  // };

  const handleInvoiceQtyChange = (value: string, index: number) => {
    const newInvoiceQtyList = [...invoiceQuantityList];
    newInvoiceQtyList[index] = value;
    setInvoiceQuantityList(newInvoiceQtyList);

    const newPoItemList = [...poItemList];
    newPoItemList[index].INVOICE_QTY = value;

    const deliveredQty =
      parseFloat(newPoItemList[index].EBS_DELIVERED_QTY) || 0;
    const preBillQty =
      parseFloat(newPoItemList[index].PRE_BILL_INVOICE_QTY) || 0;
    const allowedQty = deliveredQty - preBillQty;

    if (allowedQty < parseInt(value)) {
      showErrorToast(
        `Invoice Quantity has be less than or equal ${allowedQty}  on item no ${
          index + 1
        }`
      );
      newPoItemList[index].INVOICE_QTY = "";

      // handleInvoiceNumberChange("");
      // if (invoiceAmountRef.current) {
      //   invoiceAmountRef.current.value = "";
      // }
    }

    // Calculate the total amount for this specific item
    const invoiceQty = parseFloat(value) || 0;
    const unitPrice = parseFloat(newPoItemList[index].PO_UNIT_PRICE) || 0;
    const totalAmount = invoiceQty * unitPrice;

    // Update the TOTAL_AMOUNT for this specific item
    newPoItemList[index].TOTAL_AMOUNT = totalAmount.toString();

    // Update the totalAmountList
    const newTotalAmountList = [...totalAmountList];
    newTotalAmountList[index] = totalAmount.toString();
    setTotalAmountList(newTotalAmountList);

    // Recalculate total sum for all selected items
    if (
      selectedPoItemList.some((item) => item.ID === newPoItemList[index].ID)
    ) {
      let totalSum = 0;
      selectedPoItemList.forEach((selectedItem) => {
        const itemIndex = poItemList.findIndex(
          (item) => item.ID === selectedItem.ID
        );
        if (itemIndex !== -1) {
          if (newPoItemList[itemIndex].ITEM_CODE) {
            // For items with ITEM_CODE, calculate based on INVOICE_QTY and UNIT_PRICE
            const invoiceQty =
              parseFloat(newPoItemList[itemIndex].INVOICE_QTY) || 0;
            const unitPrice =
              parseFloat(newPoItemList[itemIndex].PO_UNIT_PRICE) || 0;
            totalSum += invoiceQty * unitPrice;
          } else {
            // For miscellaneous items, use the TOTAL_AMOUNT directly
            totalSum += parseFloat(newPoItemList[itemIndex].TOTAL_AMOUNT) || 0;
          }
        }
      });

      if (invoiceAmountRef.current) {
        invoiceAmountRef.current.value = totalSum.toFixed(2);
      }

      handleInvoiceAmountChange(totalSum.toFixed(2));
    }

    setPoItemList(newPoItemList);
  };

  const decriptionRefs = useRef<HTMLInputElement[]>([]);
  const [descriptionList, setDescriptionList] = useState<string[] | []>([]);

  const handleDescriptionChange = (value: string, index: number) => {
    const newDes = [...descriptionList];
    newDes[index] = value;
    setDescriptionList(newDes);
    const newPoItemList = [...poItemList];
    newPoItemList[index].ITEM_DESCRIPTION = value;
    setPoItemList(newPoItemList);
  };

  // const handleTotalAmountChange = (value: string, index: number) => {
  //   const newToatAmount = [...totalAmountList];
  //   newToatAmount[index] = value;
  //   setDescriptionList(newToatAmount);
  //   const newPoItemList = [...poItemList];
  //   newPoItemList[index].TOTAL_AMOUNT = value;
  //   const numberInput = Number(value);
  //   console.log(numberInput);

  //   setPoItemList(newPoItemList);
  // };

  // const handleTotalAmountChange = (value: string, index: number) => {
  //   const newTotalAmountList = [...totalAmountList];
  //   newTotalAmountList[index] = value;
  //   setTotalAmountList(newTotalAmountList);

  //   const newPoItemList = [...poItemList];
  //   newPoItemList[index].TOTAL_AMOUNT = value;

  //   // Recalculate total sum for all selected items
  //   let totalSum = 0;
  //   selectedPoItemList.forEach((selectedItem) => {
  //     const itemIndex = newPoItemList.findIndex(
  //       (item) => item.ID === selectedItem.ID
  //     );
  //     if (itemIndex !== -1) {
  //       if (newPoItemList[itemIndex].ITEM_CODE) {
  //         // For items with ITEM_CODE, calculate based on INVOICE_QTY and UNIT_PRICE
  //         const invoiceQty =
  //           parseFloat(newPoItemList[itemIndex].INVOICE_QTY) || 0;
  //         const unitPrice =
  //           parseFloat(newPoItemList[itemIndex].UNIT_PRICE) || 0;
  //         totalSum += invoiceQty * unitPrice;
  //       } else {
  //         // For miscellaneous items, use the TOTAL_AMOUNT directly
  //         totalSum += parseFloat(newPoItemList[itemIndex].TOTAL_AMOUNT) || 0;
  //       }
  //     }
  //   });

  //   if (invoiceAmountRef.current) {
  //     invoiceAmountRef.current.value = totalSum.toFixed(2);
  //   }

  //   handleInvoiceAmountChange(totalSum.toFixed(2));

  //   setPoItemList(newPoItemList);
  // };

  const handleTotalAmountChange = (value: string, index: number) => {
    const newTotalAmountList = [...totalAmountList];
    newTotalAmountList[index] = value;
    setTotalAmountList(newTotalAmountList);

    const newPoItemList = [...poItemList];
    newPoItemList[index].TOTAL_AMOUNT = value;

    // Recalculate total sum for all selected items
    let totalSum = 0;
    selectedPoItemList.forEach((selectedItem) => {
      const itemIndex = newPoItemList.findIndex(
        (item) => item.ID === selectedItem.ID
      );
      if (itemIndex !== -1) {
        if (newPoItemList[itemIndex].ITEM_CODE) {
          // For items with ITEM_CODE, calculate based on INVOICE_QTY and UNIT_PRICE
          const invoiceQty =
            parseFloat(newPoItemList[itemIndex].INVOICE_QTY) || 0;
          const unitPrice =
            parseFloat(newPoItemList[itemIndex].PO_UNIT_PRICE) || 0;
          totalSum += invoiceQty * unitPrice;
        } else {
          // For miscellaneous items, use the TOTAL_AMOUNT directly
          totalSum += parseFloat(newPoItemList[itemIndex].TOTAL_AMOUNT) || 0;
        }
      }
    });

    if (invoiceAmountRef.current) {
      invoiceAmountRef.current.value = totalSum.toFixed(2);
    }

    handleInvoiceAmountChange(totalSum.toFixed(2));

    setPoItemList(newPoItemList);
  };

  //item list

  useEffect(() => {
    setData();
  }, [poItemList]);

  const setData = () => {
    if (poItemList) {
      const invoiceQty = poItemList.map((item) => item.INVOICE_QTY);
      setInvoiceQuantityList(invoiceQty);

      if (invoiceQuantityRefs.current) {
        invoiceQuantityRefs.current = invoiceQty.map((q, index) => {
          return (
            invoiceQuantityRefs.current[index] ||
            React.createRef<HTMLInputElement>()
          );
        });
      }

      const newDes = poItemList.map((item) => item.ITEM_DESCRIPTION);
      setDescriptionList(newDes);

      if (decriptionRefs.current) {
        decriptionRefs.current = newDes.map((q, index) => {
          return (
            decriptionRefs.current[index] || React.createRef<HTMLInputElement>()
          );
        });
      }

      const newTotal = poItemList.map((item) => item.TOTAL_AMOUNT);
      setTotalAmountList(newTotal);

      if (totalAmountRefs.current) {
        totalAmountRefs.current = newDes.map((q, index) => {
          return (
            totalAmountRefs.current[index] ||
            React.createRef<HTMLInputElement>()
          );
        });
      }
    }
  };

  // const togglePoItemSelection = (employee: InvoiceItemInterface) => {
  //   setSelectedPoItemList((prevSelectedList) => {
  //     const isEmployeeSelected = prevSelectedList.some(
  //       (emp) => emp.ID === employee.ID
  //     );

  //     if (isEmployeeSelected) {
  //       // If the employee is already selected, remove it
  //       return prevSelectedList.filter((emp) => emp.ID !== employee.ID);
  //     } else {
  //       // If the employee is not selected, add it
  //       return [
  //         ...prevSelectedList,
  //         employee as InvoiceItemInterface, // Assuming SelectedPrItemInterface is compatible with PrItemInterface
  //       ];
  //     }
  //   });

  // };

  const togglePoItemSelection = (item: InvoiceItemInterface) => {
    if (item.ITEM_CODE && !item.EBS_GRN_NO) {
      showErrorToast("You can add this product after grn is completed");
    } else {
      setSelectedPoItemList((prevSelectedList) => {
        const isItemSelected = prevSelectedList.some(
          (selectedItem) => selectedItem.ID === item.ID
        );

        let updatedList;
        if (isItemSelected) {
          updatedList = prevSelectedList.filter(
            (selectedItem) => selectedItem.ID !== item.ID
          );
        } else {
          updatedList = [...prevSelectedList, item];
        }

        // Calculate the total sum for selected items
        let totalSum = 0;
        updatedList.forEach((selectedItem) => {
          if (selectedItem.ITEM_CODE) {
            const invoiceQty = parseFloat(selectedItem.INVOICE_QTY) || 0;
            const unitPrice = parseFloat(selectedItem.PO_UNIT_PRICE) || 0;
            totalSum += invoiceQty * unitPrice;
          } else {
            totalSum += parseFloat(selectedItem.TOTAL_AMOUNT) || 0;
          }
        });

        if (invoiceAmountRef.current) {
          invoiceAmountRef.current.value = totalSum.toFixed(2);
        }

        handleInvoiceAmountChange(totalSum.toFixed(2));

        return updatedList;
      });
    }
  };

  const [isSelectedAll, setIsSelectAll] = useState<boolean>(false);

  // const selectAll = () => {
  //   setIsSelectAll(true);
  //   setSelectedPoItemList(poItemList);
  // };
  // const unselectAll = () => {
  //   setIsSelectAll(false);
  //   setSelectedPoItemList([]);
  // };

  const selectAll = () => {
    setIsSelectAll(true);

    // Select all items
    const allItems = [...poItemList];

    // Calculate the total sum for all items
    let totalSum = 0;
    allItems.forEach((item) => {
      if (item.ITEM_CODE) {
        // For items with ITEM_CODE, calculate based on INVOICE_QTY and UNIT_PRICE
        const invoiceQty = parseFloat(item.INVOICE_QTY) || 0;
        const unitPrice = parseFloat(item.PO_UNIT_PRICE) || 0;
        totalSum += invoiceQty * unitPrice;
      } else {
        // For miscellaneous items, use the TOTAL_AMOUNT directly
        totalSum += parseFloat(item.TOTAL_AMOUNT) || 0;
      }
    });

    if (invoiceAmountRef.current) {
      invoiceAmountRef.current.value = totalSum.toFixed(2);
    }

    handleInvoiceAmountChange(totalSum.toFixed(2));

    // Update the selected list to include all items
    setSelectedPoItemList(allItems);

    // Log the total sum
    console.log("Total sum for all items:", totalSum);
  };

  const unselectAll = () => {
    setIsSelectAll(false);

    // Clear the selected items
    setSelectedPoItemList([]);

    // Reset the total sum to 0
    if (invoiceAmountRef.current) {
      invoiceAmountRef.current.value = "0";
    }

    handleInvoiceAmountChange("0");

    // Log the action
    console.log("All items unselected. Total sum reset to 0.");
  };

  const [isWarningShow, setIsWarningShow] = useState(false);
  const openWarningModal = () => {
    setIsWarningShow(true);
  };
  const closeWarningModal = () => {
    setIsWarningShow(false);
    setPoItemIndex(null);
  };

  const [poItemIndex, setPoItemIndex] = useState<number | null>(null);

  const getPoItemInfo = (index: number) => {
    setPoItemIndex(index);
  };

  const deletePoItem = () => {
    const newPrItems = [...poItemList];
    const deletedItem = newPrItems[poItemIndex!];
    console.log(deletedItem);

    const newSelectedItem = [...selectedPoItemList];
    const findFromSelected = newSelectedItem.filter(
      (item) => item.ID !== deletedItem.ID
    );

    console.log(findFromSelected);

    newPrItems.splice(poItemIndex!, 1);
    setPoItemList(newPrItems);
    setSelectedPoItemList(findFromSelected);
  };

  const [isSubmitLoading, setInvoiceLoading] = useState<boolean>(false);

  const submitInvoice = async () => {
    setInvoiceLoading(true);
    setIsSubmit(false);
    let indexList: number[] = [];
    for (let index = 0; index < selectedPoItemList.length; index++) {
      if (
        selectedPoItemList[index].ITEM_CODE !== "" &&
        selectedPoItemList[index].INVOICE_QTY === ""
      ) {
        indexList.push(index + 1);
      }
    }
    console.log(indexList);

    if (indexList.length > 0) {
      showErrorToast(
        `Please give invoice quantity in Item ${indexList.map((e) => `${e}, `)}`
      );
      setInvoiceLoading(false);
    } else {
      const convertedItem = selectedPoItemList.map(
        (item: InvoiceItemInterface) => ({
          SHIPMENT_ID: item.SHIPMENT_ID,
          SHIPMENT_LINE_ID: item.SHIPMENT_LINE_ID,
          ITEM_CODE: item.ITEM_CODE,
          PO_HEADER_ID: item.SHIPMENT_PO_HEADER_ID,
          PO_NUMBER: item.SHIPMENT_PO_NUMBER,
          EBS_DELIVERED_QTY: item.EBS_DELIVERED_QTY,
          INVOICE_QTY: item.INVOICE_QTY,
          UNIT_PRICE: !item.PO_UNIT_PRICE
            ? item.TOTAL_AMOUNT
            : item.PO_UNIT_PRICE,
          EBS_GRN_NO: item.EBS_GRN_NO,
          LINE_TYPE_CODE: item.LINE_TYPE_CODE,
          PO_LINE_NUMBER: item.PO_LINE_NUMBER,

          EXPENSE_TYPE: item.EXPENCE_TYPE,
          LINE_AMOUNT: item.TOTAL_AMOUNT,

          //todo : po line num 0 hbe jokhn miscellaneous type hbe
        })
      );
      try {
        const result = await CreateStandardInvoiceService(
          token!,
          null,
          "STANDARD",
          singlePo?.PO_NUMBER!,
          singlePo?.PO_HEADER_ID!.toString()!,
          singlePo?.RFQ_ID!,
          null,
          userId,
          vendorId?.toString()!,
          currentInvoiceDate,
          // currentGlDate,
          invoiceAmount,
          invoiceNumber,
          "SUBMIT",
          "IN PROCESS",
          selectedSite,
          selectedBank,
          singlePo?.CURRENCY_CODE!,
          headerDescription,
          convertedItem,
          mushokFile,
          singlePo?.RFQ_DETAILS.ORG_ID!,
          selectedPrepayNumber,
          prepayAmount,
          singlePo?.RFQ_DETAILS.BUYER_DEPARTMENT!,
          singlePo?.RFQ_DETAILS.APPROVAL_FLOW_TYPE!,
          selectedPaymentMethodName,
          selectedpamentMethod
        );
        if (result.data.status === 200) {
          showSuccessToast(result.data.message);
          setPageNo(1);
        } else {
          showErrorToast(result.data.message);
          setInvoiceLoading(false);
        }
      } catch (error) {
        setInvoiceLoading(false);
      }
    }

    console.log(selectedPoItemList);
  };

  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const openSubmitModal = () => {
    setIsSubmit(true);
  };

  const closeSubmitModal = () => {
    setIsSubmit(false);
  };

  const [invoiceList, setInvoiceList] = useState<InvoiceInterface[] | []>([]);

  interface ConvertedInvoiceList {
    value: string;
    label: string;
  }

  const [convertedInvoiceList, setConvertedInvoiceList] = useState<
    ConvertedInvoiceList[] | []
  >([]);
  const [convertedInvoice, setConvertedInvoice] =
    useState<ConvertedInvoiceList | null>(null);

  const [selectedPrepayNumber, setSelectedPrepayNumber] = useState<string>("");

  const getInvoiceList = async () => {
    console.log(userId);

    try {
      setIsLoading(true);
      const result = await InvoiceListService(
        token!,
        null,
        "APPROVED",
        userId!,
        1,
        100000,
        "DESC",
        "SUBMIT",
        "APPROVED",
        "PREPAYMENT",
        "P"
      );
      console.log(result.data.data);

      if (result.data.status === 200) {
        setInvoiceList(result.data.data);

        // const filteredList = result.data.data
        //   .filter(
        //     (item: any) =>
        //       item.EBS_INVOICE_STATUS === "Available" &&
        //       item.INVOICE_TYPE === "PREPAYMENT"
        //   )
        //   .map((item: any) => ({
        //     value: item.INVOICE_NUM.toString(),
        //     label: item.INVOICE_NUM.toString(),
        //   }));

        // console.log(filteredList);

        const converteKorlam = result.data.data.map((item: any) => ({
          value: item.INVOICE_NUM.toString(),
          label: item.INVOICE_NUM.toString(),
        }));

        setConvertedInvoiceList(converteKorlam);

        setIsLoading(false);
      } else {
        showErrorToast(result.data.message);
        setIsLoading(false);
      }
    } catch (error) {
      showErrorToast("Something went wrong");
      setIsLoading(false);
    }
  };

  const [selectedPrepayAvailble, setSelectedPrepayAvailable] =
    useState<string>("");

  const [selectedPrepaySite, setSelectedPrepaySite] = useState<string>("");

  const handlePrepayChange = (value: any) => {
    // console.log("value:", value);
    setConvertedInvoice(value);
    // setCategory(value.value);
    if (value !== null) {
      const find = invoiceList.find(
        (item: InvoiceInterface) => item.INVOICE_NUM.toString() === value.value
      );
      console.log("shadid");

      console.log(value.value);
      console.log(find);
      console.log(find?.PREPAY_AVAILABLE_AMOUNT);
      console.log(find?.SITE_ID);

      setSelectedPrepayAvailable(find!.PREPAY_AVAILABLE_AMOUNT.toString());

      if (selectedSite) {
        if (selectedSite === find?.SITE_ID.toString()) {
          setSelectedPrepaySite(selectedSite);
          setSelectedSite("");
          showErrorToast(
            "You Can Not Use This Site, Please Select Another Site."
          );
        }
      } else {
        showErrorToast("Please Select A Site");
      }

      setSelectedPrepayNumber(value.value);
    } else if (value == null && selectedPrepayNumber !== "") {
      setSelectedPrepayNumber("");
      setSelectedPrepayAvailable("");
      console.log("cleared");
    }
  };

  //payment method

  interface PaymentMethodInterface {
    PAYMENT_METHOD_CODE: string;
    PAYMENT_METHOD_NAME: string;
    DESCRIPTION: string;
  }

  interface PaymentMethod {
    value: string;
    label: string;
  }

  //  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentMethodList, setPaymentMethodList] = useState<
    PaymentMethod[] | []
  >([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null
  );
  const [selectedpamentMethod, setSelectedPaytmentMethod] =
    useState<string>("");
  const [selectedPaymentMethodName, setSelectedPaymentMethodName] =
    useState<string>("");

  useEffect(() => {
    getPaymentMethodList();
  }, []);

  const getPaymentMethodList = async () => {
    try {
      const result = await PaymentMethodListService(token!);
      if (result.data.status === 200) {
        const transformedData = result.data.data.map(
          (item: PaymentMethodInterface) => ({
            value: item.PAYMENT_METHOD_CODE,
            label: item.PAYMENT_METHOD_NAME,
          })
        );
        setPaymentMethodList(transformedData);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("something went wrong");
    }
  };

  const handlePaymentMethodChange = (value: any) => {
    // console.log("value:", value);
    setPaymentMethod(value);
    if (value !== null) {
      setSelectedPaytmentMethod(value.value);
      setSelectedPaymentMethodName(value.label);
      // getBank(value.value);
    } else if (value == null && paymentMethodList != null) {
      setSelectedPaytmentMethod("");
      setSelectedPaymentMethodName("");
      console.log("cleared");
    }
  };

  return (
    <div className=" m-8 bg-white">
      <SuccessToast />
      <WarningModal
        isOpen={isSubmit}
        closeModal={closeSubmitModal}
        action={submitInvoice}
        message="Do you submit invoice ?"
      />
      <WarningModal
        isOpen={isWarningShow}
        closeModal={closeWarningModal}
        action={deletePoItem}
        message="Do you want to remove ?"
        imgSrc="/images/warning.png"
      />

      <div className=" w-full flex items-center justify-between">
        <div className=" flex flex-col items-start">
          <PageTitle titleText="Create Standard Invoice" />
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

      <div className="h-9"></div>

      {isLoading ? (
        <div className=" w-full flex justify-center items-center">
          <LogoLoading />
        </div>
      ) : !isLoading && poItemList.length === 0 ? (
        <div className=" flex justify-center items-center w-full h-96">
          <p className=" largeText">No Data Found</p>
        </div>
      ) : (
        <>
          {/* <div className="flex items-center space-x-3">
            <button
              className="border-[2px] text-[#2A2A6C] border-[#2A2A6C] w-44 h-8 flex justify-center items-center rounded-md"
              onClick={viewSummary}
            >
              View Summary
            </button>

            <button
              onClick={viewPrepayment}
              className="border-[2px] text-[#2A2A6C] border-[#2A2A6C] w-44 h-8 flex justify-center items-center rounded-md"
            >
              View Pre Payment
            </button>
          </div> */}

          {/* <div className="h-4"></div> */}

          <div className=" w-full p-4 bg-inputBg rounded-md border-[1px] border-borderColor ">
            <div className=" w-full flex justify-between items-start">
              <div className=" space-y-4">
                <div className=" space-y-1">
                  <p className=" text-sm font-mon">Buyer Name</p>
                  <p className=" text-sm font-mon font-medium">
                    {singlePo?.BUYER_NAME}
                  </p>
                </div>
                <div className=" space-y-1">
                  <p className=" text-sm font-mon">Tranding Partner</p>
                  <p className=" text-sm font-mon font-medium">
                    {singlePo?.SUPPLIER_ORGANIZATION_NAME}
                  </p>
                </div>
              </div>
              <div className=" space-y-4">
                <div className=" space-y-1">
                  <p className=" text-sm font-mon">Contact Number</p>
                  <p className=" text-sm font-mon font-medium">
                    {singlePo?.BUYER_MOBILE_NUMBER}
                  </p>
                </div>
                <div className=" space-y-1">
                  <p className=" text-sm font-mon">Supplier Number</p>
                  <p className=" text-sm font-mon font-medium">
                    {singlePo?.SUPPLIER_ID}
                  </p>
                </div>
              </div>
              <div className=" space-y-4">
                <div className=" space-y-1">
                  <p className=" text-sm font-mon">Operating Unit</p>
                  <p className=" text-sm font-mon font-medium">
                    {singlePo?.OU_NAME}
                  </p>
                </div>
                <div className=" space-y-1">
                  <p className=" text-sm font-mon">Supplier Site</p>
                  <p className=" text-sm font-mon font-medium">
                    <DropDown
                      options={convertedSiteList}
                      onSelect={handleSelectSite}
                      width="w-44 font-semibold"
                      sval={selectedSite}
                      hint="Select Site"
                    />
                  </p>
                </div>
              </div>
              <div className=" space-y-4">
                <div className=" space-y-1">
                  <p className=" text-sm font-mon">Invoice</p>
                  <p className=" text-sm font-mon font-medium">standard</p>
                </div>
                <div className=" space-y-1">
                  <p className=" text-sm font-mon">Mushok/VDS/TDS Att.</p>
                  <p className=" text-sm font-mon font-medium">
                    <FilePickerInput
                      onFileSelect={handleMushok}
                      mimeType=".pdf, image/*"
                      initialFileName={mushokFileName!}
                      maxSize={5 * 1024 * 1024}
                      width="w-full"
                      fontSize="text-[12px]"
                      widthBlack="w-20"
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-4"></div>

          <div className="w-full  h-full p-4 bg-inputBg rounded-md border-[1px] border-borderColor  ">
            <div className="flex justify-between  items-start ">
              <div className="space-y-1 flex-shrink-0 flex flex-col items-center">
                <p className="text-sm font-mon">Payment Status</p>
                <p className="text-sm font-mon font-medium">Unpaid</p>
              </div>
              <div className="space-y-1 flex-shrink-0 flex flex-col items-center">
                <p className="text-sm font-mon">Invoice Type</p>
                <p className="text-sm font-mon font-medium">Standard</p>
              </div>
              <div className="space-y-1 flex-shrink-0 flex flex-col items-center">
                <p className="text-sm font-mon">Description</p>
                <CommonInputField
                  inputRef={headerDescriptionRef}
                  onChangeData={handleHeaderDescriptionChange}
                  hint="Lorem Ipsum Dolor"
                  type="text"
                  width="w-44"
                />
              </div>
              <div className="space-y-1 flex-shrink-0 flex flex-col items-center">
                <p className="text-sm font-mon">Invoice Date</p>
                {/* <DateRangePicker
                  placeholder="Select date"
                  value={invoiceDate}
                  onChange={handleInvoiceDateChange}
                  width="w-44 "
                  useRange={false}
                  signle={true}
                /> */}
                <p className="text-sm font-mon">
                  {moment(Date.now()).format("DD-MMMM-YYYY")}{" "}
                </p>
              </div>
              <div className="space-y-1 flex-shrink-0 flex flex-col items-center z-30">
                <p className="text-sm font-mon">Prepayment</p>

                <CommonDropDownSearch
                  placeholder="Search Here"
                  onChange={handlePrepayChange}
                  value={convertedInvoice}
                  options={convertedInvoiceList}
                  width="w-52"
                />
              </div>
            </div>
            <div className=" h-4"></div>
            <hr></hr>
            <div className=" h-4"></div>
            <div className=" w-full flex justify-between items-start">
              <div className="space-y-1 flex-shrink-0 flex flex-col items-center">
                <p className="text-sm font-mon">Prepay Available</p>
                {/* <DateRangePicker
                  placeholder="Select date"
                  value={glDate}
                  onChange={handleGlDateChange}
                  width="w-44 "
                  useRange={false}
                  signle={true}
                /> */}
                <p className="text-sm font-mon">
                  {!selectedPrepayAvailble ? "---" : selectedPrepayAvailble}
                </p>
              </div>
              <div className="space-y-1 flex-shrink-0 flex flex-col items-center">
                <p className="text-sm font-mon">Prepay Amount</p>
                <CommonInputField
                  inputRef={prepayAmountRef}
                  onChangeData={handlePrepayAmountChange}
                  hint="00.00"
                  type="text"
                  width="w-44"
                />
              </div>
              <div className="space-y-1 flex-shrink-0 flex flex-col items-center">
                <p className="text-sm font-mon">Invoice Number</p>
                <CommonInputField
                  inputRef={invoiceNumberRef}
                  onChangeData={handleInvoiceNumberChange}
                  hint="Enter Your Invoice No"
                  type="text"
                  width="w-44"
                />
              </div>
              {/* <div className="space-y-1 flex-shrink-0 flex flex-col items-center">
                <p className="text-sm font-mon">Vat</p>
                <CommonInputField
                  inputRef={vatRef}
                  onChangeData={handleVatChange}
                  hint="15%"
                  type="text"
                  width="w-16"
                />
              </div>
              <div className="space-y-1 flex-shrink-0 flex flex-col items-center">
                <p className="text-sm font-mon">Tax</p>
                <CommonInputField
                  inputRef={taxRef}
                  onChangeData={handleTaxChange}
                  hint="15%"
                  type="text"
                  width="w-16"
                />
              </div> */}
              <div className="space-y-1 flex-shrink-0 flex flex-col items-center">
                <p className="text-sm font-mon">Invoice Amount</p>
                <CommonInputField
                  inputRef={invoiceAmountRef}
                  onChangeData={handleInvoiceAmountChange}
                  hint="0.00"
                  type="text"
                  width="w-44"
                  disable={true}
                />
              </div>
              <div className="space-y-1 flex-shrink-0 flex flex-col items-center">
                <p className="text-sm font-mon">Payee Bank Name</p>
                <DropDown
                  options={convertedBankList}
                  onSelect={handleSelectBank}
                  width="w-44 font-semibold"
                  sval={selectedBank}
                  hint="Select Bank"
                />
              </div>
            </div>

            <div className=" h-4"></div>
            <hr></hr>
            <div className=" h-4"></div>

            <div className="w-full flex justify-between items-start">
              <div className="space-y-1 flex-shrink-0 flex flex-col items-center z-30">
                <p className="text-sm font-mon">Payment Method</p>
                <CommonDropDownSearch
                  placeholder="Select Method"
                  onChange={handlePaymentMethodChange}
                  value={paymentMethod}
                  options={paymentMethodList}
                  width="w-60"
                />
              </div>
            </div>
          </div>

          <div className="h-5"></div>

          <div className="overflow-auto max-h-[400px] rounded-lg shadow-lg custom-scrollbar">
            <table className="min-w-full divide-y divide-gray-200 rounded-lg">
              <thead className="bg-[#CAF4FF] sticky top-0 z-20  ">
                <tr>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    <button
                      onClick={() => {
                        isSelectedAll ? unselectAll() : selectAll();
                      }}
                      className={`${
                        isSelectedAll
                          ? "bg-midGreen "
                          : "bg-whiteColor border-[1px] border-borderColor"
                      } rounded-[4px] w-4 h-4 flex justify-center items-center`}
                    >
                      <img
                        src="/images/check.png"
                        alt="check"
                        className=" w-2 h-2"
                      />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    SL
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    Type
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    Expence Type
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    Offered Qty
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    Award Qty
                  </th>

                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    GRN Qty
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    Received Qty
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    Accepted Qty
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    Rejected Qty
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    Delivered Qty
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    Pre Bill Invoice Qty
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    {/* Remarks */}
                    Invoice Quantity
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    Unit Price
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    UOM
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    Item Description
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    PO Number
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    Receipt Number
                  </th>

                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    Specification
                  </th>

                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    Action
                  </th>
                </tr>
              </thead>

              {poItemList.map((e, i) => (
                <tbody key={e.ID} className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar ">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        <button
                          onClick={() => {
                            togglePoItemSelection(e);
                          }}
                          className={`${
                            selectedPoItemList.some((emp) => emp.ID === e.ID)
                              ? "bg-midGreen "
                              : "bg-whiteColor border-[1px] border-borderColor"
                          } rounded-[4px] w-4 h-4 flex justify-center items-center`}
                        >
                          <img
                            src="/images/check.png"
                            alt="check"
                            className=" w-2 h-2"
                          />
                        </button>
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {i + 1}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar z-10">
                      <div className="w-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                        <DropDown
                          disable={!e.ITEM_CODE ? false : true}
                          options={e.ITEM_TYPE_LIST}
                          onSelect={(value: any) =>
                            handleSelectItemType(value, i)
                          }
                          width="w-44 font-semibold"
                          sval={selectedItemType[i] || ""}
                          hint="Select Item"
                        />

                        {/* <DropDown
                      options={itemType}
                      onSelect={handleSelectItem}
                      width="w-32 font-semibold"
                      sval={itemDropDown}
                      hint="Select Item"
                    /> */}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar z-10">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        <DropDown
                          // disable={
                          //   e.ITEM_CODE
                          //     ? // ||
                          //       // e.SELECTED_ITEM_TYPE === "ITEM"
                          //       true
                          //     : false
                          // }
                          disable={!e.ITEM_CODE ? false : true}
                          options={e.EXPENCE_TYPE_LIST}
                          onSelect={(value: any) =>
                            handleSelectExpenceType(value, i)
                          }
                          width="w-44 font-semibold"
                          sval={selectedExpenceType[i] || ""}
                          hint="Select Expence"
                        />

                        {/* <DropDown
                      options={itemType}
                      onSelect={handleSelectItem}
                      width="w-32 font-semibold"
                      sval={itemDropDown}
                      hint="Select Expence"
                    /> */}
                      </div>
                    </td>

                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {!e.QUOT_OFFERED_QUANTITY
                          ? "-"
                          : e.QUOT_OFFERED_QUANTITY}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {!e.AWARD_QUANTITY ? "-" : e.AWARD_QUANTITY}
                      </div>
                    </td>

                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {!e.EBS_GRN_QTY ? "-" : e.EBS_GRN_QTY}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {!e.EBS_RECEIVE_QTY ? "-" : e.EBS_RECEIVE_QTY}
                      </div>
                    </td>

                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {!e.EBS_ACCEPT_QTY ? "-" : e.EBS_ACCEPT_QTY}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {!e.EBS_REJECT_QTY ? "-" : e.EBS_REJECT_QTY}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {!e.EBS_DELIVERED_QTY ? "-" : e.EBS_DELIVERED_QTY}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {!e.PRE_BILL_INVOICE_QTY ? "-" : e.PRE_BILL_INVOICE_QTY}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {!e.ITEM_CODE ? (
                          "-"
                        ) : (
                          <CommonInputField
                            inputRef={{
                              current: invoiceQuantityRefs.current[i],
                            }}
                            value={invoiceQuantityList[i]}
                            onChangeData={(value) =>
                              handleInvoiceQtyChange(value, i)
                            }
                            hint="60.00"
                            type="text"
                            width="w-20"
                            disable={
                              !e.ITEM_CODE
                                ? true
                                : false || !e.EBS_DELIVERED_QTY
                            }
                          />
                        )}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {!e.PO_UNIT_PRICE ? "-" : e.PO_UNIT_PRICE}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {e.ITEM_CODE ? (
                          !isNaN(parseInt(e.INVOICE_QTY)) ? (
                            parseInt(e.INVOICE_QTY) * parseInt(e.PO_UNIT_PRICE)
                          ) : (
                            "-"
                          )
                        ) : (
                          <CommonInputField
                            inputRef={{
                              current: totalAmountRefs.current[i],
                            }}
                            value={totalAmountList[i]}
                            onChangeData={(value) =>
                              handleTotalAmountChange(value, i)
                            }
                            hint="60.00"
                            type="text"
                            width="w-20"
                            disable={e.ITEM_CODE ? true : false}
                          />
                        )}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {!e.UNIT_MEAS_LOOKUP_CODE
                          ? "-"
                          : e.UNIT_MEAS_LOOKUP_CODE}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        <CommonInputField
                          inputRef={{
                            current: decriptionRefs.current[i],
                          }}
                          value={descriptionList[i]}
                          onChangeData={(value) =>
                            handleDescriptionChange(value, i)
                          }
                          hint="Enter Description"
                          type="text"
                          width="w-44"
                          // disable={!e.SHIPMENT_ITEM_CODE ? true : false}
                        />
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {!e.CS_PO_NUMBER ? "-" : e.CS_PO_NUMBER}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {!e.EBS_GRN_NO ? "-" : e.EBS_GRN_NO}
                      </div>
                    </td>

                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {!e.AVAILABLE_SPECS ? "-" : e.AVAILABLE_SPECS}
                      </div>
                    </td>

                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        <button
                          onClick={() => {
                            getPoItemInfo(i);
                            openWarningModal();
                          }}
                        >
                          <DeleteIcon className=" h-6 w-6" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              ))}

              <button
                onClick={addItemToList}
                className=" w-4 h-4 mx-6 rounded-[2px] bg-midGreen shadow-sm flex justify-center items-center"
              >
                <AddIcon className=" text-white w-3 h-3" />
              </button>

              <tfoot className="bg-white sticky bottom-0">
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {pageNo2 !== 1 && (
                      <button
                        // disabled={pageNo === 1 ? true : false}
                        onClick={previous}
                        className=" px-4 py-2 rounded-md flex space-x-2 items-center border-[0.5px] border-borderColor "
                        style={{
                          boxShadow:
                            "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
                        }}
                      >
                        <div className="w-4 h-4 ">
                          <ArrowLeftIcon className=" w-full h-full " />
                        </div>
                        <p className=" text-[12px] font-mon">Previous</p>
                      </button>
                    )}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {renderPageNumbers()}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {pageNo2 !== total && (
                      <button
                        // disabled={pageNo === total ? true : false}
                        onClick={next}
                        className=" px-4 py-2 rounded-md flex space-x-2 items-center shadow-md border-[0.5px] border-borderColor "
                        style={{
                          boxShadow:
                            "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
                        }}
                      >
                        <p className=" text-[12px] font-mon">Next</p>
                        <div className="w-4 h-4 ">
                          <ArrowRightIcon className=" w-full h-full " />
                        </div>
                      </button>
                    )}
                  </th>
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
        </>
      )}
      {/* <div className="h-14"></div>

      <PageTitle titleText="Approval Hierarchy" /> */}

      <div className="h-8"></div>

      {/* <div className="overflow-x-auto">
        <table
          className="min-w-full divide-y divide-gray-200 border-[0.2px] border-borderColor rounded-md"
          style={{ tableLayout: "fixed" }}
        >
          <thead className="sticky top-0 bg-[#D2F2E5] h-14">
            <tr>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  ">
                SL
              </th>
              <th className=" font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Performed By
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Date
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Action
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Remarks
              </th>
            </tr>
          </thead>

          {hierarchyList.map((e, i) => (
            <tbody className="cursor-pointer bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]">
              <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor font-medium">
                {1}
              </td>
              <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                {e.APPROVER_FULL_NAME}
              </td>
              <td className=" font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                {moment(e.ACTION_DATE).format("MM-DD-YYYY")}
              </td>
              <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                {e.ACTION_CODE === "0" ? (
                  <p className=" text-sm font-mon text-redColor">Rejected</p>
                ) : e.ACTION_CODE === "1" ? (
                  <p className=" text-sm font-mon text-midGreen">Approved</p>
                ) : (
                  <p className=" text-sm font-mon  text-yellow-500">Pending</p>
                )}
              </td>
              <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                {e.ACTION_NOTE}
              </td>
            </tbody>
          ))}
        </table>
      </div> */}

      <div className="h-10"></div>

      <div className="flex items-center justify-end space-x-6">
        {/* <button
          className="border-[2px] text-[#8F9BAA] border-[#8F9BAA] w-44 h-8 rounded-md"
          onClick={handleDraft}
        >
          Save as Draft
        </button> */}

        {isSubmitLoading ? (
          <div className=" w-44 flex justify-center items-center">
            <CircularProgressIndicator />
          </div>
        ) : (
          <CommonButton
            onClick={openSubmitModal}
            titleText="Submit Invoice"
            width="w-44"
            color="bg-midGreen"
          />
        )}

        {/* <button
          className="border-[2px] text-[#2A2A6C] border-[#2A2A6C] w-44 h-8 rounded-md"
          onClick={handlePreview}
        >
          Preview
        </button> */}
      </div>

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box p-10">
          <table
            className="min-w-full divide-y divide-gray-200 border-[0.2px] border-borderColor shadow rounded-md"
            style={{ tableLayout: "fixed" }}
          >
            <thead className="sticky top-0 bg-[#F4F6F8] h-14 text-center">
              <tr>
                <th className="font-mon px-6 py-3 text-center text-sm font-medium text-blackColor  ">
                  PO Number
                </th>
                <th className=" font-mon px-6 py-3 text-center text-sm font-medium text-blackColor  whitespace-nowrap">
                  Amount
                </th>
                <th className="font-mon px-6 py-3 text-center text-sm font-medium text-blackColor  whitespace-nowrap">
                  Payment date
                </th>
              </tr>
            </thead>

            <tbody className="cursor-pointer bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]">
              <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor font-medium">
                000123
              </td>
              <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                50.00
              </td>
              <td className=" font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                DD/MM/YYYY
              </td>
            </tbody>

            <tbody className="cursor-pointer bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]">
              <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor font-medium">
                000123
              </td>
              <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                50.00
              </td>
              <td className=" font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                DD/MM/YYYY
              </td>
            </tbody>
          </table>

          <div className="h-8"></div>

          <div className="w-full flex justify-center items-center">
            <button className="text-white bg-[#454F5B] w-44 py-2 rounded-md">
              Done
            </button>
          </div>

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <div className=" w-full flex items-center space-x-6 pr-4">
                <button className=" py-1 px-6 rounded-md border-[1px] border-borderColor font-mon">
                  Cancel
                </button>

                {/* <button className="py-1 px-6 rounded-md text-white border-[1px] border-borderColor font-mon bg-[#006C9C]">
                  Submit
                </button> */}
              </div>
            </form>
          </div>
        </div>
      </dialog>

      <dialog id="my_modal_2" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>

            <div className=" p-4">
              {/* header */}
              <div className=" w-full h-16 bg-inputBg flex justify-between items-center">
                <div className="w-36 flex justify-center items-center ">
                  <p className=" text-sm font-mon font-medium">Description</p>
                </div>
                <div className=" flex flex-1 justify-between items-center pr-4">
                  <p className=" text-sm font-mon font-medium">Selection</p>
                  <p className=" text-sm font-mon font-medium">Invoice No.</p>
                  <p className=" text-sm font-mon font-medium">PO Number</p>
                  <p className=" text-sm font-mon font-medium">
                    Pre Payment Amount
                  </p>
                  <p className=" text-sm font-mon font-medium">Adj Amount</p>
                  <p className=" text-sm font-mon font-medium">
                    Adj Percentage
                  </p>
                  <p className=" text-sm font-mon font-medium">Prepay Date</p>
                  <p className=" text-sm font-mon font-medium">Status</p>
                </div>
              </div>
              {/* header */}

              <div className=" w-full flex justify-between items-center">
                <div className="w-36 flex justify-center items-center ">
                  <p className=" text-[12px] font-mon text-center px-4 ">
                    Order Based Prepayment
                  </p>
                </div>
                <div className=" flex-1 flex flex-col space-y-1">
                  <div className=" w-full flex justify-between items-center pr-4">
                    <p className=" text-[12px] font-mon text-center  ">Order</p>
                    <p className=" text-[12px] font-mon text-center  ">
                      INV123
                    </p>
                    <p className=" text-[12px] font-mon text-center  ">
                      000123
                    </p>
                    <p className=" text-[12px] font-mon text-center  ">
                      10,000
                    </p>
                    <p className=" text-[12px] font-mon text-center  ">500</p>
                    <p className=" text-[12px] font-mon text-center  ">50%</p>
                    <p className=" text-[12px] font-mon text-center  ">
                      DD/MM/YYYY
                    </p>
                    <p className=" text-[12px] font-mon text-center  ">
                      Pending
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}
