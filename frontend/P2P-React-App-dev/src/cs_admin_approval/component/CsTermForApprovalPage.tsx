import moment from "moment";
import React, { useState, useRef, useEffect } from "react";

import { useAuth } from "../../login_both/context/AuthContext";
import NavigationPan from "../../common_component/NavigationPan";
import CommonInputField from "../../common_component/CommonInputField";
import DateRangePicker from "../../common_component/DateRangePicker";
import FilePickerInput from "../../common_component/FilePickerInput";
import DropDown from "../../common_component/DropDown";
import CommonButton from "../../common_component/CommonButton";
import usePrItemsStore from "../../buyer_section/pr/store/prItemStore";
import CurrencyListService from "../../registration/service/bank/CurrencyListService";
import InvoiceTypeListService from "../../buyer_section/buyer_term/service/InvoiceTypeService";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import InvoiceTypeInterface from "../../buyer_section/buyer_term/interface/InvoiceTypeInterface";
import PaymentTermService from "../../buyer_section/buyer_term/service/PaymentTermServie";
import PaymentTermInterface from "../../buyer_section/buyer_term/interface/PaymentTermInterface";
import FreightTermService from "../../buyer_section/buyer_term/service/FreightTermService";
import FreightTermInterface from "../../buyer_section/buyer_term/interface/FreightTermInterface";
import LocationListService from "../../buyer_section/buyer_term/service/LocationListService";
import LocationInterface from "../../buyer_section/buyer_term/interface/LocationListInterface";
import formatTimestampTo24Hour from "../../utils/methods/formatTimestampTo24Hour";
import useAuthStore from "../../login_both/store/authStore";
import RfqSaveService from "../../buyer_section/buyer_term/service/RfqSaveService";
import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";
import RfqHeaderUpdateService from "../../buyer_section/buyer_term/service/RfqHeaderUpdateService";
import PrItemInterface from "../../buyer_section/pr_item_list/interface/PrItemInterface";
import SaveLineItemToService from "../../buyer_section/buyer_term/service/SavelineItemsToRfqService";
import UpdateLineItemToRfqService from "../../buyer_section/buyer_term/service/UpdateLineitemsToRfqService";
import ApproverInterface from "../../approval_setup/interface/ApproverInterface";
import EmployeeListService from "../../approval_setup/service/EmployeeListService";
import RfiAddUpdateService from "../../manage_supplier_profile_update/service/rfi/RfiAddUpdateService";
import CommonDropDownSearch from "../../common_component/CommonDropDownSearch";
// import RfqItemInterface from "../interface/RfqItemInterface";
// import RfqItemListService from "../service/RfqItemListService";
import RfqItemInterface from "../../rfq/interface/RfqItemInterface";
import RfqItemListService from "../../rfq/service/RfqItemListService";
import RfqDetailsService from "../../buyer_rfq_create/service/RfqDetailsService";

import { Button } from "keep-react";
import CurrentStockInterface from "../../buyer_section/pr_item_list/interface/CurrentStockInterface";
import CurrentStockService from "../../buyer_section/pr_item_list/service/CurrentStockService";
import LogoLoading from "../../Loading_component/LogoLoading";
import InputLebel from "../../common_component/InputLebel";
import useCsCreationStore from "../../cs/store/CsCreationStore";
import CommonOrgInterface from "../../common_interface/CommonOrgInterface";
import GetOrgListService from "../../common_service/GetOrgListService";

import useCsApprovalStore from "../store/csApprovalStore";
import PageTitle from "../../common_component/PageTitle";
import RfqHeaderDetailsInterface from "../../buyer_section/pr_item_list/interface/RfqHeaderDetailsInterface";
import RfqHeaderDetailsService from "../../buyer_section/pr_item_list/service/RfqHeaderDetailsService";
import CsItemInterface from "../../cs/interface/CsItemInterface";
import CsDetailsService from "../../cs/service/CsDetailsService";
import UserCircleIcon from "../../icons/userCircleIcon";
import isoToDateTime from "../../utils/methods/isoToDateTime";
import fetchFileUrlService from "../../common_service/fetchFileUrlService";
import RfiSupplierListService from "../../rfi_in_supplier_registration/service/RfiSupplierListService";
import RfiSupplierInterface from "../../rfi_in_supplier_registration/interface/RfiSupplierInterface";

const pan = ["CS List", "RFQ Terms and Items"];

interface CurrencyData {
  CURRENCY_CODE: string;
  NAME: string;
}

interface CurrencyFromOracle {
  value: string;
  label: string;
}
interface InvoiceFromOracle {
  value: string;
  label: string;
}
interface LocationFromOracle {
  value: string;
  label: string;
}
interface FreightTermFromOracle {
  value: string;
  label: string;
}
interface PaymentTermFromOracle {
  value: string;
  label: string;
}

export default function CsTermForApprovalPage() {
  const {
    setCsApprovalPageNo,
    csIdInStore,
    setCsIdInStore,
    rfqIdInCsApprovalStore,
    setRfqIdInStore,
    orgIdInStore,
    setOrgIdInStore,
    setRfqLineIdInStore,
    setBuyerGeneralTermInStore,
    setCsCurrencyCodeInStore,
  } = useCsApprovalStore();

  const { token, userId } = useAuth();

  //store
  const { loggedInUserName } = useAuthStore();
  //store

  const back = () => {
    setCsIdInStore(null);
    setRfqIdInStore(null);
    setOrgIdInStore(null);
    setCsApprovalPageNo(1);
  };

  const next = () => {
    setCsApprovalPageNo(3);
  };

  useEffect(() => {
    getHeaderDetails();
  }, []);

  //rfqHeader details
  const rfqTitleRef = useRef<HTMLInputElement | null>(null);
  const rfqSubjectRef = useRef<HTMLInputElement | null>(null);
  const rfqVatPercentageRef = useRef<HTMLInputElement | null>(null);
  const onRfqTitleCHange = (value: string) => {};

  const handleOpenDateChange = (newValue: any) => {
    setOpenDate(newValue);
  };
  const onRfqSubjectChange = (value: string) => {};

  const [openDate, setOpenDate] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: new Date(new Date().getFullYear(), 11, 31), // Set the endDate to the end of the current year
  });

  const [OpenTime, setOpenTime] = useState<string>("");

  const [closeDate, setCloseDate] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: new Date(new Date().getFullYear(), 11, 31), // Set the endDate to the end of the current year
  });

  const handleCloseDateChange = (newValue: any) => {
    setCloseDate(newValue);
    // Handle the selected date here

    // setCombineCloseDateTime(`${formattedCloseDate} ${formattedTime}`);
  };

  const [closeTime, setCloseTime] = useState<string>("");

  const handleCloseTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {};

  const [rfqHeaderDetails, setRfqHeaderDetails] =
    useState<RfqHeaderDetailsInterface | null>(null);

  const handleOpenTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value; // Assuming inputValue is in "HH:MM" format
    console.log(inputValue);

    const [hours, minutes] = inputValue.split(":").map(Number);

    // Constructing the time in 24-hour format
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);

    // Formatting the time without AM/PM indicator
    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
    console.log(formattedTime);

    setOpenTime(formattedTime);
  };
  const [isBothRfq, setisBothRfq] = useState<boolean>(false);
  const handleBothOrTechnicalRfq = () => {
    setisBothRfq(!isBothRfq);
  };

  const [needByDate, setNeedByDate] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: new Date(new Date().getFullYear(), 11, 31), // Set the endDate to the end of the current year
  });

  const handleNeedByDateChange = (newValue: any) => {
    setNeedByDate(newValue);
    // Handle the selected date here
    console.log(moment(newValue.startDate).format("DD-MMM-YY HH:mm:ss"));
  };

  const [headerFileInitailName, setHeaderFileInitialName] =
    useState<string>("");

  const handleHeaderAttachmentLicense = (file: File | null) => {
    if (file) {
      console.log("Selected file:", file);
    } else {
      // No file selected
      console.log("No file selected");
    }
  };

  useEffect(() => {
    setHeader();
  }, [rfqHeaderDetails]);

  const setHeader = () => {
    if (rfqHeaderDetails) {
      if (rfqTitleRef.current) {
        rfqTitleRef.current.value = rfqHeaderDetails.details.RFQ_TITLE;
        console.log(rfqHeaderDetails.details.RFQ_TITLE);
      }
      if (rfqSubjectRef.current) {
        rfqSubjectRef.current.value = rfqHeaderDetails.details.RFQ_SUBJECT;
      }

      if (rfqVatPercentageRef.current) {
        rfqVatPercentageRef.current.value =
          rfqHeaderDetails.details.VAT_RATE.toString();
        // setVatPercentageInStore(details.VAT_RATE);
      }
      console.log(rfqHeaderDetails.details.VAT_RATE);
      if (rfqHeaderDetails.details.VAT_RATE) {
        setRfqVatPercentage(rfqHeaderDetails.details.VAT_RATE.toString());
      }

      const currentYear = new Date().getFullYear();

      if (rfqHeaderDetails.details?.OPEN_DATE != null) {
        const openDate = rfqHeaderDetails.details?.OPEN_DATE;

        // Check if tradeOrExportLicenseStartDate is not null before creating a new Date object
        const dateValue = new Date(openDate!);
        setOpenDate({
          startDate: dateValue,
          endDate: new Date(currentYear, 11, 31), // Set the endDate to the end of the current year
        });
      }
      const openTime = formatTimestampTo24Hour(
        rfqHeaderDetails.details.OPEN_DATE
      );
      setOpenTime(openTime);

      if (rfqHeaderDetails.details?.CLOSE_DATE != null) {
        const closeDate = rfqHeaderDetails.details?.CLOSE_DATE;

        // Check if tradeOrExportLicenseStartDate is not null before creating a new Date object
        const dateValue = new Date(closeDate!);
        setCloseDate({
          startDate: dateValue,
          endDate: new Date(currentYear, 11, 31), // Set the endDate to the end of the current year
        });
      }

      const closeTime = formatTimestampTo24Hour(
        rfqHeaderDetails.details.CLOSE_DATE
      );

      setCloseTime(closeTime);

      if (rfqHeaderDetails.details.RFQ_TYPE === "B") {
        setisBothRfq(true);
      } else {
        setisBothRfq(false);
      }

      if (rfqHeaderDetails.details?.NEED_BY_DATE != null) {
        const needByDate = rfqHeaderDetails.details?.NEED_BY_DATE;

        // Check if tradeOrExportLicenseStartDate is not null before creating a new Date object
        const dateValue = new Date(needByDate!);
        setNeedByDate({
          startDate: dateValue,
          endDate: new Date(currentYear, 11, 31), // Set the endDate to the end of the current year
        });

        //setiing for sendin to api
        //  setAddUpdateEndDate(moment(data?.TRADE_OR_EXPORT_LICENSE_END_DATE).format("YYYY-MM-DD"))
      }
      setHeaderFileInitialName(
        rfqHeaderDetails.details.RFQ_ATTACHMENT_FILE_ORG_NAME
      );
      setSelectedFreightTerm(rfqHeaderDetails.details.FREIGHT_TERM);
      setSelectedPaymentTerm(
        rfqHeaderDetails.details.PAYMENT_TERM_ID.toString()
      ); //age string e asto change korsi
      setBuyerAttachmentFileName(
        rfqHeaderDetails.details.BUYER_ATTACHMENT_FILE_ORG_NAME
      );
      setCurrencyCode(rfqHeaderDetails.details.CURRENCY_CODE);
      const etrDate = convertTimestamp(rfqHeaderDetails.details.ETR);

      setSelectedEtrDate(etrDate);
      const ertDate = rfqHeaderDetails.details?.ETR;

      // Check if tradeOrExportLicenseStartDate is not null before creating a new Date object
      const dateValue = new Date(ertDate!);
      setEtrDate({
        startDate: dateValue,
        endDate: new Date(currentYear, 11, 31), // Set the endDate to the end of the current year
      });
      setSelectedInvoiceType(rfqHeaderDetails.details.INVOICE_TYPE);
      setIsVatApplicable(
        rfqHeaderDetails.details.VAT_APPLICABLE_STATUS === "Y" ? true : false
      );
      setNote(rfqHeaderDetails.details.NOTE_TO_SUPPLIER);
      setBuyerGeneralTermInStore(rfqHeaderDetails.details.BUYER_GENERAL_TERMS);
      setCsCurrencyCodeInStore(rfqHeaderDetails.details.CURRENCY_CODE);
    }
  };

  const convertTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const formattedDate = `${padWithZero(
      date.getDate()
    )}-${getMonthAbbreviation(date.getMonth())}-${date
      .getFullYear()
      .toString()
      .slice(2)}`;
    const formattedTime = `${padWithZero(date.getHours())}:${padWithZero(
      date.getMinutes()
    )}:${padWithZero(date.getSeconds())}`;
    return `${formattedDate} ${formattedTime}`;
  };

  const getMonthAbbreviation = (month: number): string => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[month];
  };

  const padWithZero = (value: number): string => {
    return value < 10 ? `0${value}` : value.toString();
  };

  const getHeaderDetails = async () => {
    try {
      setIsLoading(false);
      const result = await RfqHeaderDetailsService(
        token!,
        rfqIdInCsApprovalStore!
      ); //rfwIdInStore
      if (result.data.status === 200) {
        setIsLoading(false);
        setRfqHeaderDetails(result.data);
      } else {
        setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Rfq Header Details Load Failed");
    }
  };
  //rfqHeader details

  useEffect(() => {
    getOrgList();
    getFreightTerm();
    getPaymentTerm();
    getCurrency();
    getLocation();
    getInvoiceType();
  }, [rfqHeaderDetails]);

  const [orgName, setOrgName] = useState<string>("");

  const [orgId, setOrgId] = useState<number | null>(null);
  const getOrgList = async () => {
    try {
      const result = await GetOrgListService(token!);
      console.log(result);

      if (result.data.status === 200) {
        const findOrg: CommonOrgInterface = result.data.data.find(
          (org: CommonOrgInterface) =>
            org.ORGANIZATION_ID.toString() ===
            rfqHeaderDetails?.details.ORG_ID!.toString()
        );

        console.log("find org", findOrg);

        setOrgName(findOrg.NAME);
        setOrgId(findOrg.ORGANIZATION_ID);
        setOrgIdInStore(findOrg.ORGANIZATION_ID);

        // setOrgIdInStore(findOrg.ORGANIZATION_ID);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      // showErrorToast("Organization Load Failed");
    }
  };

  //buyer term

  const [freightTermFromoracle, setFreightTermFromoracle] = useState<
    FreightTermFromOracle[] | []
  >([]);

  const [selectedFreightTerm, setSelectedFreightTerm] = useState("");
  const handleSelectFreightTerm = (value: string) => {
    console.log(`Selected: ${value}`);
    setSelectedFreightTerm(value);
    // Do something with the selected value
  };

  const getFreightTerm = async () => {
    try {
      const result = await FreightTermService(token!);
      console.log(result.data);

      if (result.data.status === 200) {
        const transformedData = result.data.data.map(
          (item: FreightTermInterface) => ({
            value: item.LOOKUP_CODE,
            label: item.MEANING,
          })
        );

        setFreightTermFromoracle(transformedData);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Freight term load failed");
    }
  };

  const [paymentTermFromoracle, setPaymentTermFromoracle] = useState<
    PaymentTermFromOracle[] | []
  >([]);
  const getPaymentTerm = async () => {
    try {
      const result = await PaymentTermService(token!);
      console.log(result.data);

      if (result.data.status === 200) {
        const transformedData = result.data.data.map(
          (item: PaymentTermInterface) => ({
            value: item.TERM_ID.toString(),
            label: item.NAME,
          })
        );
        setPaymentTermFromoracle(transformedData);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Freight term load failed");
    }
  };

  const [selectedPaymentterm, setSelectedPaymentTerm] = useState("");
  const handleSelectPaymentTerm = (value: string) => {
    console.log(`Selected pay: ${value}`);
    setSelectedPaymentTerm(value);
    // Do something with the selected value
  };

  //payment term

  //fob
  const fobRef = useRef<HTMLInputElement | null>(null);
  const [fob, setFob] = useState<string>("");
  const handleFobChange = (value: string) => {
    setFob(value);
  };
  //fob

  //buyer attachment

  const [buyerAttachmentFileName, setBuyerAttachmentFileName] = useState<
    string | null
  >(null);
  const [buyerAttachmentFile, setBuyerAttachmentFile] = useState<File | null>(
    null
  );

  const handleBuyerAttachmentFile = (file: File | null) => {
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file);
      setBuyerAttachmentFile(file);
    } else {
      // No file selected
      console.log("No file selected");
    }
  };
  //buyer attchemnt

  //currency

  const [currencyListFromOracle, setCurrencyListFromOracle] = useState<
    CurrencyFromOracle[] | []
  >([]);
  // const [currencyFromOracle, setCurrencyFromOracle] =
  //   useState<CurrencyFromOracle | null>(null);

  const getCurrency = async () => {
    try {
      const result = await CurrencyListService(token!);
      console.log(result.data);

      if (result.data.status === 200) {
        const transformedData = result.data.data.map((item: CurrencyData) => ({
          value: item.CURRENCY_CODE,
          label: item.NAME,
        }));
        const findCurrency = transformedData.find(
          (e: CurrencyFromOracle) =>
            e.value === rfqHeaderDetails?.details.CURRENCY_CODE
        );
        console.log(findCurrency);

        setCurrencyListFromOracle(transformedData);
        // setCurrencyNameInStore(findCurrency.label);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      // showErrorToast("Currency load failed");
    }
  };

  const [currencyCode, setCurrencyCode] = useState("");
  const handleSelectCurrency = (value: string) => {
    console.log(`Selected: ${value}`);
    setCurrencyCode(value);
    // Do something with the selected value
  };

  //currency

  //etr

  const [etrDate, setEtrDate] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: new Date(new Date().getFullYear(), 11, 31), // Set the endDate to the end of the current year
  });

  const [selectedEtrDate, setSelectedEtrDate] = useState<string>("");

  const handleStartDateChange = (newValue: any) => {
    setEtrDate(newValue);
    // Handle the selected date here
  };

  //etr

  const [locationList, setLocationList] = useState<LocationFromOracle[]>([]);

  const [locationBillTo, setLocationBillTo] =
    useState<LocationFromOracle | null>(null);
  const [locationShipTo, setLocationShipTo] =
    useState<LocationFromOracle | null>(null);

  const [locationCodeBillTo, setLocationCodeBillTo] = useState<string>("");
  const [locationCodeShipTo, setLocationCodeShipTo] = useState<string>("");

  const getLocation = async () => {
    try {
      const result = await LocationListService(token!);
      console.log(result.data);

      if (result.data.status === 200) {
        const transformedData = result.data.data.map(
          (item: LocationInterface) => ({
            value: item.LOCATION_ID,
            label: item.LOCATION_CODE,
          })
        );

        setLocationList(transformedData);

        const findBillTo: LocationInterface | undefined = result.data.data.find(
          (item: LocationInterface) =>
            item.LOCATION_ID === rfqHeaderDetails?.details.BILL_TO_LOCATION_ID
        );

        let convertedBillTo: LocationFromOracle | undefined;

        if (findBillTo) {
          convertedBillTo = {
            value: findBillTo.LOCATION_ID.toString(),
            label: findBillTo.LOCATION_CODE,
          };
          setLocationBillTo(convertedBillTo);
        }

        const findShipTo: LocationInterface | undefined = result.data.data.find(
          (item: LocationInterface) =>
            item.LOCATION_ID === rfqHeaderDetails?.details.SHIP_TO_LOCATION_ID
        );

        let convertedShipTo: LocationFromOracle | undefined;

        if (findShipTo) {
          convertedShipTo = {
            value: findShipTo.LOCATION_ID.toString(),
            label: findShipTo.LOCATION_CODE,
          };
          setLocationShipTo(convertedShipTo);
        }
      }
    } catch (error) {
      showErrorToast("Currency location failed");
    }
  };

  const handleBillToFromOracleChange = (value: any) => {
    // console.log("value:", value);
    setLocationBillTo(value);
    if (value !== null) {
      console.log(value.value);
      //   getBranch(value.value);
      setLocationCodeBillTo(value.value);

      //   getBank(value.value);
    } else if (value == null && locationList != null) {
      setLocationCodeBillTo("");
      console.log("cleared");
    }
  };
  const handleShipToFromOracleChange = (value: any) => {
    // console.log("value:", value);
    setLocationShipTo(value);
    if (value !== null) {
      console.log(value.value);
      //   getBranch(value.value);
      setLocationCodeShipTo(value.value);

      //   getBank(value.value);
    } else if (value == null && locationList != null) {
      setLocationCodeShipTo("");
      console.log("cleared");
    }
  };

  //location

  //invoice

  const [invoiceTypeListFromoracle, setInvoiceTypeListFromoracle] = useState<
    InvoiceFromOracle[] | []
  >([]);
  // const [currencyFromOracle, setCurrencyFromOracle] =
  //   useState<CurrencyFromOracle | null>(null);

  const getInvoiceType = async () => {
    try {
      const result = await InvoiceTypeListService(token!);
      console.log(result.data);

      if (result.data.status === 200) {
        const transformedData = result.data.data.map(
          (item: InvoiceTypeInterface) => ({
            value: item.LOOKUP_CODE,
            label: item.MEANING,
          })
        );
        setInvoiceTypeListFromoracle(transformedData);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Invoice type load failed");
    }
  };

  const [selectedInvoiceType, setSelectedInvoiceType] = useState("");
  const handleSelectInvoiceType = (value: string) => {
    console.log(`Selected: ${value}`);
    setSelectedInvoiceType(value);
    // Do something with the selected value
  };

  //invoice

  //vat applicable

  const [isVatApplicable, setIsVatApplicable] = useState<boolean>(false);

  const handleIsVatApplicable = () => {
    setIsVatApplicable(!isVatApplicable);
  };
  //vat applicable

  const [rfqVatpercentage, setRfqVatPercentage] = useState("");
  const onRfqVatPercentageChange = (value: string) => {
    setRfqVatPercentage(value);
  };

  const [note, setNote] = useState("");

  const handleNote = (e: any) => {
    const inputText = e.target.value;
    setNote(inputText);
  };

  //cs details means cs item list

  useEffect(() => {
    getCsItem();
  }, []);

  const [itemList, setItemList] = useState<CsItemInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getCsItem = async () => {
    try {
      const result = await CsDetailsService(token!, csIdInStore!);
      console.log(result); //savedCsIdInStore!

      if (result.data.status === 200) {
        setItemList(result.data.data);

        const list: number[] = [];
        for (let i = 0; i < result.data.data.length; i++) {
          list.push(result.data.data[i].RFQ_LINE_ID);
        }
        setRfqLineIdInStore(list);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("CS Items Load Failed");
    }
  };
  //cs details means cs item list

  // rfi feedback start

  useEffect(() => {
    getRfqList();
  }, []);

  const [propicPath, setPropicPath] = useState<string>("");

  const [supplierList, setSUpplierList] = useState<RfiSupplierInterface[] | []>(
    []
  );

  //image array korbo

  interface ImageUrls {
    [key: number]: string | null;
  }

  const [imageUrls, setImageUrls] = useState<ImageUrls>({});
  const [imageUrls2, setImageUrls2] = useState<ImageUrls>({});

  // ... other state and functions

  const getImage2 = async (
    filePath: string,
    fileName: string
  ): Promise<string | null> => {
    try {
      const url = await fetchFileUrlService(filePath, fileName, token!);
      return url;
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  };

  useEffect(() => {
    if (supplierList) {
      const fetchImages = async () => {
        const newImageUrls: ImageUrls = {};
        for (let index = 0; index < supplierList.length; index++) {
          const element = supplierList[index];
          const url = await getImage2(propicPath, element.INITIATOR_PRO_PIC);
          newImageUrls[element.ID] = url;
        }
        setImageUrls(newImageUrls);
        // setIsLoading(false);
      };
      fetchImages();
    }
  }, [supplierList, propicPath]);
  useEffect(() => {
    if (supplierList) {
      const fetchImages = async () => {
        const newImageUrls: ImageUrls = {};
        for (let index = 0; index < supplierList.length; index++) {
          const element = supplierList[index];
          const url = await getImage2(propicPath, element.VIEWER_PRO_PIC);
          newImageUrls[element.INITIATOR_ID] = url;
        }
        setImageUrls2(newImageUrls);
        // setIsLoading(false);
      };
      fetchImages();
    }
  }, [supplierList, propicPath]);

  const getRfqList = async () => {
    // setIsLoading(true);

    console.log("userId: ", userId);
    console.log("supId, ", rfqIdInCsApprovalStore);

    try {
      const result = await RfiSupplierListService(
        token!,
        userId,
        null,
        null,
        rfqIdInCsApprovalStore
      );
      console.log(result.data);

      if (result.data.status === 200) {
        console.log(result.data.data);
        setPropicPath(result.data.PROFILE_PIC);

        // setSUpplierList(result.data.data);
        // setIsLoading(false);

        const filteredData = result.data.data.filter(
          (item: RfiSupplierInterface) => item.OBJECT_TYPE === "CS"
        );

        setSUpplierList(filteredData);
      } else {
        // setIsLoading(false);
        showSuccessToast(result.data.message);
      }
    } catch (error) {
      //   setIsLoading(false);
      showErrorToast("Something went wrong");
    }
    // try{

    //     const result=await RegisteredSupplierListNeedToApproveService(token!,approvalStatus,searchInput);
    //     if(result.data.status===200){
    //         setProfilePicOnePath(result.data.profile_pic1);
    //         setProfilePicTwoPath(result.data.profile_pic2);
    //         setSUpplierList(result.data.data);
    //         setIsLoading(false);

    //     }
    //     else{
    //         setIsLoading(false);
    //         showErrorToast(result.data.message);

    //     }

    // }
    // catch(error){
    //     setIsLoading(false);
    //     showErrorToast("Something went wrong");
    // }
  };

  // rfi feedback end

  return (
    <div className=" m-8 bg-white">
      <div className="my-6 w-full flex justify-between items-center">
        <div>
          <PageTitle titleText="RFQ Terms and Items" />
          {/* <NavigationPan list={pan} /> */}
        </div>
        <CommonButton
          onClick={back}
          titleText="Back"
          height="h-8"
          width="w-24"
          color="bg-midGreen"
        />
      </div>
      <p className=" text-lg font-semibold font-mon text-blackColor">Header</p>
      <div className=" h-6"></div>

      {isLoading ? (
        <div className=" w-full flex justify-center items-center">
          <LogoLoading />
        </div>
      ) : (
        <>
          <div className="border-[1px] border-borderColor p-8 rounded-md shadow-sm bg-inputBg w-full flex flex-col items-start space-y-4">
            <div className=" w-full flex flex-row justify-between items-center">
              <div className="flex flex-row space-x-4 items-center">
                <p className=" w-24   text-grayColor text-sm font-medium font-mon">
                  RFQ Title
                </p>
                <CommonInputField
                  type="text"
                  inputRef={rfqTitleRef}
                  hint="Enter Titile"
                  onChangeData={onRfqTitleCHange}
                  width="w-60"
                  disable={true}
                />
              </div>
              <div className=" flex flex-row space-x-4 items-center">
                <p className="w-24  text-grayColor text-sm font-medium font-mon">
                  Open Date
                </p>

                <div className="w-full max-w-xs flex space-x-2 items-center">
                  <div className="w-44 h-10">
                    <DateRangePicker
                      onChange={handleOpenDateChange}
                      width="w-44 h-10"
                      placeholder="DD/MM/YYYY"
                      value={openDate}
                      signle={true}
                      useRange={false}
                      disable={true}
                    />
                  </div>
                  <div className="">
                    <input
                      type="time"
                      disabled={true}
                      value={OpenTime}
                      onChange={handleOpenTimeChange}
                      className="w-full bg-white border border-gray-300 rounded px-2 h-10 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className=" w-full flex flex-row justify-between items-center">
              <div className=" flex flex-row  space-x-4 items-center">
                <p className="w-24   text-grayColor text-sm font-medium font-mon">
                  RFQ Subject
                </p>
                <CommonInputField
                  type="text"
                  inputRef={rfqSubjectRef}
                  hint="Enter Subject"
                  onChangeData={onRfqSubjectChange}
                  width="w-60"
                  disable={true}
                />
              </div>
              <div className=" flex flex-row space-x-4 items-center">
                <p className="w-24  text-grayColor text-sm font-medium font-mon">
                  Close Date
                </p>

                <div className="w-full max-w-xs flex space-x-2 items-center">
                  <div className="w-44 h-10">
                    <DateRangePicker
                      onChange={handleCloseDateChange}
                      width="w-44 h-10"
                      placeholder="DD/MM/YYYY"
                      value={closeDate}
                      signle={true}
                      useRange={false}
                      disable={true}
                    />
                  </div>
                  <div className="">
                    <input
                      type="time"
                      disabled={true}
                      value={closeTime}
                      onChange={handleCloseTimeChange}
                      className="w-full bg-white border border-gray-300 rounded px-2 h-10 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className=" w-full flex flex-row justify-between items-center">
              <div className=" flex flex-row  space-x-4 items-center">
                <p className="w-24   text-grayColor text-sm font-medium font-mon">
                  Prepared by
                </p>

                <p className="text-midBlack text-sm font-medium font-mon">
                  {loggedInUserName}
                </p>
              </div>
              <div className=" flex flex-row space-x-4 items-center">
                <p className="w-24  text-grayColor text-sm font-medium font-mon">
                  <div className="flex-1 flex space-x-2  items-center">
                    <button
                      disabled={true}
                      onClick={handleBothOrTechnicalRfq}
                      className={`w-4 h-4  ${
                        !isBothRfq
                          ? " bg-midGreen border-none"
                          : "border-[1px] border-borderColor bg-white"
                      }  flex justify-center items-center rounded-[4px]`}
                    >
                      <img
                        src="/images/check.png"
                        alt="check"
                        className=" w-2 h-2"
                      />
                    </button>
                    <p className="text-midBlack text-sm font-medium font-mon">
                      Technical
                    </p>
                  </div>
                </p>

                <div className="w-full max-w-xs flex space-x-2 items-center">
                  <div className="w-44 h-10 ">
                    <div className=" w-44 h-10">
                      <div className=" h-full w-full flex space-x-2 justify-start items-center ">
                        <button
                          disabled={true}
                          onClick={handleBothOrTechnicalRfq}
                          className={`w-4 h-4   flex justify-center items-center rounded-[4px] ${
                            isBothRfq
                              ? " bg-midGreen border-none"
                              : " bg-white border-borderColor border-[1px]"
                          }`}
                        >
                          <img
                            src="/images/check.png"
                            alt="check"
                            className=" w-2 h-2"
                          />
                        </button>
                        <p className="text-midBlack text-sm font-medium font-mon">
                          Both
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-[120px]"></div>
                </div>
              </div>
            </div>

            <div className=" w-full flex flex-row justify-between items-center">
              <div className=" flex flex-row  space-x-4 items-center">
                <p className="w-24   text-grayColor text-sm font-medium font-mon">
                  Need by date
                </p>
                <div className="w-60">
                  <DateRangePicker
                    onChange={handleNeedByDateChange}
                    width="w-60"
                    placeholder="DD/MM/YYYY"
                    value={needByDate}
                    signle={true}
                    useRange={false}
                    disable={true}
                  />
                </div>
              </div>
              <div className=" flex flex-row space-x-4 items-center">
                <p className="w-24  text-grayColor text-sm font-medium font-mon">
                  Attachment
                </p>

                <div className="w-full max-w-xs flex space-x-2 items-center">
                  <div className="w-[304px] h-10">
                    <FilePickerInput
                      onFileSelect={handleHeaderAttachmentLicense}
                      mimeType=".pdf, image/*"
                      maxSize={2 * 1024 * 1024}
                      width="w-full"
                      initialFileName={headerFileInitailName}
                      disable={true}
                    />
                  </div>
                  {/* <div className=" w-[120px]"></div> */}
                </div>
              </div>
            </div>
            <div className=" w-full flex flex-row justify-between items-center">
              <div className=" flex flex-row  space-x-4 items-center">
                <p className="w-24   text-grayColor text-sm font-medium font-mon">
                  Organization
                </p>
                <div className="w-60">
                  <p className=" text-grayColor text-sm font-medium font-mon">
                    {orgName}
                  </p>
                </div>
              </div>
              <div className=" w-full flex flex-row space-x-4 items-center"></div>
            </div>
          </div>
          <p className=" text-lg font-semibold font-mon text-blackColor">
            Buyer Term
          </p>
          <div className="h-6"></div>
          <div className="border-[1px] border-borderColor p-8 rounded-md shadow-sm bg-inputBg w-full flex flex-col items-start space-y-6">
            <div className=" w-full flex flex-row justify-between items-center">
              <div className="flex flex-row space-x-4 items-center">
                <p className="w-28 text-grayColor text-sm font-medium font-mon">
                  Freight Term
                </p>
                <DropDown
                  options={freightTermFromoracle}
                  onSelect={handleSelectFreightTerm}
                  width="w-72"
                  sval={selectedFreightTerm}
                  disable={true}
                />
              </div>

              <div className="flex flex-row space-x-4 items-center">
                <p className="w-28 text-grayColor text-sm font-medium font-mon">
                  Payment Term
                </p>
                <DropDown
                  options={paymentTermFromoracle}
                  onSelect={handleSelectPaymentTerm}
                  width="w-72"
                  sval={selectedPaymentterm}
                  disable={true}
                />
              </div>
            </div>
            <div className=" w-full flex flex-row justify-between items-center">
              <div className="flex flex-row space-x-4 items-center">
                <p className="w-28 text-grayColor text-sm font-medium font-mon">
                  FOB
                </p>
                <div className=" w-72">
                  <CommonInputField
                    inputRef={fobRef}
                    onChangeData={handleFobChange}
                    hint="Enter Fob"
                    type="text"
                    width="w-full"
                    disable={true} //todo: future a pathate hbe
                  />
                </div>
              </div>
              <div className="flex flex-row space-x-4 items-center">
                <p className="w-28 text-grayColor text-sm font-medium font-mon">
                  Attachment
                </p>
                <FilePickerInput
                  onFileSelect={handleBuyerAttachmentFile}
                  // mimeType=".pdf, image/*"
                  initialFileName={buyerAttachmentFileName!}
                  maxSize={2 * 1024 * 1024}
                  width="w-72"
                  disable={true}
                />
              </div>
            </div>
            <div className=" w-full flex flex-row justify-between items-center">
              <div className="flex flex-row space-x-4 items-center">
                <p className="w-28  text-grayColor text-sm font-medium font-mon">
                  Currency
                </p>
                <DropDown
                  options={currencyListFromOracle}
                  onSelect={handleSelectCurrency}
                  sval={currencyCode}
                  width="w-72"
                  disable={true}
                />
                {/* <div className=" w-60 h-10 ">
                    <CommonDropDownSearch
                      placeholder="Select Currency "
                      onChange={handleCurrencyFromOracleChange}
                      value={currencyFromOracle}
                      options={currencyListFromOracle}
                      width="w-60"
                    />
                  </div> */}
              </div>
              <div className="flex flex-row space-x-4 items-center">
                <p className="w-28 text-grayColor text-sm font-medium font-mon ">
                  ETR
                </p>

                <div className=" w-72">
                  <DateRangePicker
                    onChange={handleStartDateChange}
                    width="w-72"
                    placeholder="DD/MM/YYYY"
                    value={etrDate}
                    signle={true}
                    useRange={false}
                    disable={true}
                  />
                </div>

                {/* <CommonInputField
                    inputRef={etrRef}
                    onChangeData={handleEtrChange}
                    hint=""
                    type="text"
                    width="w-60"
                  /> */}
              </div>
            </div>
            <div className=" w-full flex flex-row justify-between items-center">
              <div className="flex flex-row space-x-4 items-center">
                <p className=" w-28  text-grayColor text-sm font-medium font-mon">
                  Bill to Address
                </p>
                <div className=" w-72  ">
                  <CommonDropDownSearch
                    placeholder="Select Bill To Address "
                    onChange={handleBillToFromOracleChange}
                    value={locationBillTo}
                    options={locationList}
                    width="w-full"
                    disable={true}
                  />
                </div>
              </div>

              <div className="flex flex-row space-x-4 items-center">
                <p className=" w-28   text-grayColor text-sm font-medium font-mon">
                  Ship to Address
                </p>
                <div className=" w-72 ">
                  <CommonDropDownSearch
                    placeholder="Select Ship To Address "
                    onChange={handleShipToFromOracleChange}
                    value={locationShipTo}
                    options={locationList}
                    width="w-full"
                    disable={true}
                  />
                </div>
              </div>
            </div>
            <div className="w-full flex flex-row justify-between items-center">
              {/* <div className="flex flex-row space-x-4 items-center">
                <p className="w-28 text-grayColor text-sm font-medium font-mon">
                  Invoice Type
                </p>
                <DropDown
                  options={invoiceTypeListFromoracle}
                  onSelect={handleSelectInvoiceType}
                  width="w-72"
                  sval={selectedInvoiceType}
                  disable={true}
                />
              </div> */}
              <div className="flex flex-row space-x-4 items-center">
                <p className="w-28 text-grayColor text-sm font-medium font-mon">
                  VAT Applicable
                </p>
                <div className=" w-72">
                  <button
                    disabled={true}
                    onClick={handleIsVatApplicable}
                    className={`w-4 h-4 rounded-md border-[0.5px] border-borderColor flex justify-center items-center ${
                      isVatApplicable ? "bg-midGreen border-none" : null
                    }`}
                  >
                    {isVatApplicable ? (
                      <img
                        src="/images/check.png"
                        alt="check"
                        className=" w-2 h-2"
                      />
                    ) : null}
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-row justify-between items-center">
              <div className="flex flex-row space-x-4 items-center">
                <div className="w-28"></div>
                <div className=" w-72"></div>
              </div>
              {!isVatApplicable ? null : (
                <div className="flex flex-row space-x-4 items-center">
                  <p className="w-28 text-grayColor text-sm font-medium font-mon">
                    VAT
                  </p>
                  <div className=" w-72">
                    <CommonInputField
                      inputRef={rfqVatPercentageRef}
                      onChangeData={onRfqVatPercentageChange}
                      value={rfqVatpercentage}
                      hint="ex: 5 %"
                      type="text"
                      width="w-full"
                      disable={true}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className=" h-6"></div>
          <p className=" text-lg font-semibold font-mon text-blackColor">
            Note
          </p>
          <textarea
            value={note}
            onChange={handleNote}
            className=" border-[1px] border-borderColor w-full h-24 rounded-md p-4 bg-inputBg focus:outline-none "
            disabled={true}
          />

          {/* rfi feedback start */}

          <div className="h-4"></div>

          <div className="w-full my-10">
            {supplierList.length > 0 ? (
              <div>
                {supplierList.map((e, i) => (
                  <div
                    className=" w-full my-6 p-2 bg-white rounded-md border-[0.1px] border-gray-200"
                    style={{
                      boxShadow:
                        "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
                    }}
                  >
                    <div
                      key={e.ID}
                      className=" p-4 w-full flex space-x-4 items-start"
                    >
                      <div className=" w-12 h-12 rounded-full">
                        {e.INITIATOR_PRO_PIC === "N/A" ? (
                          <UserCircleIcon className=" w-full h-full" />
                        ) : (
                          <div className="avatar">
                            <div className="w-12 rounded-full border-[2px] border-midGreen">
                              <img
                                // src={`${propicPath}/${e.INITIATOR_PRO_PIC}`}
                                src={imageUrls[e.ID]!}
                                alt="avatar"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="  text-midBlack font-mon font-medium">
                          {e.INITIATOR_NAME}
                        </p>

                        <p className="  font-mon text-sm text-midGreen">
                          {isoToDateTime(e.INITIATION_DATE)}
                        </p>

                        <p className=" smallText flex space-x-2">
                          <p>Asked:</p>
                          <p> {e.INITIATOR_NOTE}</p>
                        </p>
                      </div>
                    </div>

                    <p className=" font-mon text-lg font-semibold mt-4 border-b-[1px] border-gray-400"></p>

                    {/* <div className=" my-4 w-full h-[1px] bg-midBlack"></div> */}

                    <div
                      key={e.ID}
                      className=" p-4 w-full flex space-x-4 items-start"
                    >
                      <div className=" w-12 h-12 rounded-full">
                        {e.INITIATOR_PRO_PIC === "N/A" ? (
                          <UserCircleIcon className=" w-full h-full" />
                        ) : (
                          <div className="avatar">
                            <div className="w-12 rounded-full border-[2px] border-midGreen">
                              <img
                                // src={`${propicPath}/${e.VIEWER_PRO_PIC}`}
                                src={imageUrls2[e.INITIATOR_ID]!}
                                alt="avatar"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="  text-midBlack font-mon font-medium">
                          {e.VIEWER_NAME}
                        </p>

                        <p className="  font-mon text-sm text-midGreen">
                          {e.VIEW_DATE === ""
                            ? "---"
                            : isoToDateTime(e.VIEW_DATE)}
                        </p>

                        <p className=" smallText flex space-x-2">
                          <p className="smallText">Feedback:</p>
                          <p>{` ${e.VIEWER_NOTE}`}</p>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* rfi feedback end */}

          <div className="h-10"></div>
          <div className=" w-full flex justify-end items-center space-x-6">
            <CommonButton
              titleText="Previous"
              onClick={back}
              color="bg-graishColor"
              height="h-8"
              width="w-48"
            />
            <CommonButton
              titleText="Continue"
              onClick={next}
              color="bg-midGreen"
              height="h-8"
              width="w-48"
            />
          </div>
          <div className="h-20"></div>
        </>
      )}
    </div>
  );
}
