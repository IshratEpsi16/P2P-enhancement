import moment from "moment";
import React, { useState, useRef, useEffect } from "react";
import { useRfqPageContext } from "../context/RfqPageContext";
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
import RfqItemInterface from "../interface/RfqItemInterface";
import RfqItemListService from "../service/RfqItemListService";
import RfqDetailsService from "../../buyer_rfq_create/service/RfqDetailsService";

import { Button } from "keep-react";
import CurrentStockInterface from "../../buyer_section/pr_item_list/interface/CurrentStockInterface";
import CurrentStockService from "../../buyer_section/pr_item_list/service/CurrentStockService";
import LogoLoading from "../../Loading_component/LogoLoading";
import InputLebel from "../../common_component/InputLebel";
import useCsCreationStore from "../../cs/store/CsCreationStore";
import CommonOrgInterface from "../../common_interface/CommonOrgInterface";
import GetOrgListService from "../../common_service/GetOrgListService";

const pan = ["Home", "Rfq List", "Rfq Details"];
const ttt = `Terms that you have to follow`;
const list = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

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

export default function RfqDetailsPage() {
  const rfqTitleRef = useRef<HTMLInputElement | null>(null);
  const rfqSubjectRef = useRef<HTMLInputElement | null>(null);
  const rfqVatPercentageRef = useRef<HTMLInputElement | null>(null);

  const [rfqtitle, setRfqTitle] = useState("");
  const [rfqSubject, setRfqSubject] = useState("");
  const [rfqVatpercentage, setRfqVatPercentage] = useState("");
  // const [openDate, setOpenDate] = React.useState<Dayjs | null>(dayjs(""));
  // const [closeDate, setCloseDate] = React.useState<Dayjs | null>(dayjs(""));

  const [note, setNote] = useState("");

  const handleNote = (e: any) => {
    const inputText = e.target.value;
    setNote(inputText);
  };
  const onRfqTitleCHange = (value: string) => {
    setRfqTitle(value);
  };
  const onRfqSubjectChange = (value: string) => {
    setRfqSubject(value);
  };
  const onRfqVatPercentageChange = (value: string) => {
    setRfqVatPercentage(value);
  };
  // const handleOpenDateChange = (date: Date | null) => {
  //   console.log("Selected date:", date);
  //   // Handle the selected date here
  // };
  const navi = ["Home", "PR", "General Term", "Term"];
  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  const handleSelect = (value: string) => {
    console.log(`Selected: ${value}`);

    // Do something with the selected value
  };

  //useAuth
  const { token, department } = useAuth();
  //useAuth

  useEffect(() => {
    console.log(rfqHeaderDetailsInStore?.details.RFQ_ID);
    console.log(rfqHeaderDetailsInStore?.details.ORG_ID);
    rfqDetailsService();
    getOrgList();
    getLocation();
    getCurrency();
    getInvoiceType();
    getFreightTerm();
    getPaymentTerm();
    getApproverList();
  }, []);

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
            e.value === rfqHeaderDetailsInStore?.details.CURRENCY_CODE
        );
        console.log(findCurrency);

        setCurrencyListFromOracle(transformedData);
        setCurrencyNameInStore(findCurrency.label);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Currency load failed");
    }
  };

  const [currencyCode, setCurrencyCode] = useState("");
  const handleSelectCurrency = (value: string) => {
    console.log(`Selected: ${value}`);
    setCurrencyCode(value);
    // Do something with the selected value
  };

  //currency

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
  //payment term
  // const [currencyFromOracle, setCurrencyFromOracle] =
  //   useState<CurrencyFromOracle | null>(null);
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

  //freight term
  const [freightTermFromoracle, setFreightTermFromoracle] = useState<
    FreightTermFromOracle[] | []
  >([]);
  // const [currencyFromOracle, setCurrencyFromOracle] =
  //   useState<CurrencyFromOracle | null>(null);

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

  const [selectedFreightTerm, setSelectedFreightTerm] = useState("");
  const handleSelectFreightTerm = (value: string) => {
    console.log(`Selected: ${value}`);
    setSelectedFreightTerm(value);
    // Do something with the selected value
  };

  //freight term

  //location

  // const [locationList, setLocationList] = useState<LocationFromOracle[] | []>(
  //   []
  // );
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
        if (!isCreateRfq) {
          const findBillTo: LocationInterface | undefined =
            result.data.data.find(
              (item: LocationInterface) =>
                item.LOCATION_ID ===
                rfqHeaderDetailsInStore?.details.BILL_TO_LOCATION_ID
            );

          let convertedBillTo: LocationFromOracle | undefined;

          if (findBillTo) {
            convertedBillTo = {
              value: findBillTo.LOCATION_ID.toString(),
              label: findBillTo.LOCATION_CODE,
            };
            setLocationBillTo(convertedBillTo);
          }

          const findShipTo: LocationInterface | undefined =
            result.data.data.find(
              (item: LocationInterface) =>
                item.LOCATION_ID ===
                rfqHeaderDetailsInStore?.details.SHIP_TO_LOCATION_ID
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
      } else {
        showErrorToast(result.data.message);
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

  // const { setHeaderAttachment } = usePrItemsStore();
  //useAuth

  //context
  // const { page, setPage } = useRfqCreateProcessContext();
  const { rfqPageNo, setRfqPageNo } = useRfqPageContext();
  const submitAndNext = () => {
    if (selectedRfqLineIdList.length === 0) {
      showErrorToast("Please Select Item To Proced");
    } else {
      console.log(selectedRfqLineIdList);

      setRfqLineIdListInStore(selectedRfqLineIdList);
      setRfqPageNo(3);
    }
  };

  const previousPage = () => {
    setRfqTypeInCsCreationStore(null);
    setApprovalTypeInCsCreation(null);

    setBuyerDeptInCsCreationStore(null);
    setRfqPageNo(1);
  };
  //context

  //backButton
  const back = () => {
    previousPage();
  };
  //backButton

  //open date time

  const [openDate, setOpenDate] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: new Date(new Date().getFullYear(), 11, 31), // Set the endDate to the end of the current year
  });

  const [formattedOpenDate, setFormattedOpenDate] = useState<string>("");
  const [combineOpenDateTime, setCombineOpenDateTime] = useState<string>("");

  const handleOpenDateChange = (newValue: any) => {
    setOpenDate(newValue);
    // Handle the selected date here
    setFormattedOpenDate(moment(newValue.startDate).format("DD-MMM-YY"));
    console.log(moment(newValue.startDate).format("DD-MMM-YY"));
  };

  const [OpenTime, setOpenTime] = useState<string>("");

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
    setCombineOpenDateTime(`${formattedOpenDate} ${formattedTime}`);
    console.log(formattedOpenDate, formattedTime);
  };

  //
  //close date time

  const [formattedCloseDate, setFormattedCloseDate] = useState<string>("");
  const [combineCloseDateTime, setCombineCloseDateTime] = useState<string>("");
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

    console.log(moment(newValue.startDate).format("DD-MMM-YY"));
    setFormattedCloseDate(moment(newValue.startDate).format("DD-MMM-YY"));
    // setCombineCloseDateTime(`${formattedCloseDate} ${formattedTime}`);
  };

  const [closeTime, setCloseTime] = useState<string>("");

  const handleCloseTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputValue = event.target.value; // Assuming inputValue is in "HH:MM" format
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
    setCombineCloseDateTime(`${formattedCloseDate} ${formattedTime}`);
    setCloseTime(formattedTime);
    console.log(formattedTime);
  };

  //

  //need by date

  const [formatedNeedByDate, setFormattedNeedByDate] = useState<string>("");

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
    setFormattedNeedByDate(
      moment(newValue.startDate).format("DD-MMM-YY HH:mm:ss")
    );
  };

  //need by date

  const [headerAttachmentFileName, setHeaderAttachmentFileName] = useState<
    string | null
  >("" || null);
  const [headerAttachmentFile, setHeaderAttachmentFile] = useState<File | null>(
    null
  );
  const [headerMime, setHeaderMime] = useState("");
  const [headebase64, setheaderBase64] = useState("");

  const handleHeaderAttachmentLicense = (file: File | null) => {
    if (file) {
      console.log("Selected file:", file);
      setHeaderAttachmentFile(file);
    } else {
      // No file selected
      console.log("No file selected");
    }
  };

  //header attachment

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
    setSelectedEtrDate(moment(newValue.startDate).format("DD-MMM-YY HH:mm:ss"));
  };

  //etr

  //rfi

  const rfi = () => {
    console.log(prItems);
  };
  //rfi

  //vat approval

  // const vatApproval = () => {};
  //vat approval

  //store
  const {
    prItems,
    prItems2,
    rfqIdInStore,
    setHeaderAttachment,
    setNeedByDateInStore,
    setRfqTypeInStore,
    setRfqCloseDateInStore,
    setRfqOpenDateInStore,
    setRfqSubjectInStore,
    setRfqTitleInStore,
    setFreightTermInStore,
    setPaymentTermInStore,
    setFobInStore,
    setBuyerAttachmentInStore,
    setCurrencyInStore,
    setEtrInStore,
    setBillToAddressInStore,
    setShipToAddressInStore,
    setInvoiceTypeInStore,
    setVatApplicableStatusInStore,
    setVatPercentageInStore,
    setNoteInStore,
    selectedGeneralterm,
    setRfqStatusInStore,
    rfqHeaderDetailsInStore,
    isCreateRfq,
    setIsCreateRfq,
    setFreightTermNameInStore,
    setPaymentTermNameInStore,
    setInvoiceTypeNameInStore,
    freightTermInStore,
    paymentTermInStore,
    invoiceTypeInstore,
    rfqStatusInStore,
    setRfqIdInStore,
    setIsSavepressed,
    isSavepressed,
    orgIdInStore,
    matchOptionInStore,
    rateTypeInStore,
    rateDateInStore,
    conversionRateInStore,
    approvalTypeInStore,
  } = usePrItemsStore();
  //store

  //set headers if it is not null

  useEffect(() => {
    if (!isCreateRfq) {
      setHeaders();
    } else {
      console.log("set hbe na");
    }
  }, [rfqHeaderDetailsInStore, locationList]);

  const [headerFileInitailName, setHeaderFileInitialName] =
    useState<string>("");

  const setHeaders = () => {
    if (rfqHeaderDetailsInStore) {
      const details = rfqHeaderDetailsInStore?.details;
      console.log(rfqHeaderDetailsInStore);

      if (rfqSubjectRef.current) {
        rfqSubjectRef.current.value = details.RFQ_SUBJECT;
        setRfqSubject(details.RFQ_SUBJECT);
      }

      if (rfqTitleRef.current) {
        rfqTitleRef.current.value = details.RFQ_TITLE;
        setRfqTitle(details.RFQ_TITLE);
      }
      console.log(details.RFQ_TYPE);

      if (details.RFQ_TYPE === "B") {
        setisBothRfq(true);
      } else {
        setisBothRfq(false);
      }

      console.log(details.FREIGHT_TERM);

      setSelectedFreightTerm(details.FREIGHT_TERM);
      setNote(details.NOTE_TO_SUPPLIER);
      // setFob()
      setHeaderFileInitialName(details.RFQ_ATTACHMENT_FILE_ORG_NAME);
      console.log(details.RFQ_ATTACHMENT_FILE_ORG_NAME);
      setCurrencyCode(details.CURRENCY_CODE);
      setIsVatApplicable(details.VAT_APPLICABLE_STATUS === "Y" ? true : false);
      if (rfqVatPercentageRef.current) {
        rfqVatPercentageRef.current.value = details.VAT_RATE.toString();
        // setVatPercentageInStore(details.VAT_RATE);
        setRfqVatPercentage(details.VAT_RATE.toString());
      }

      setSelectedPaymentTerm(details.PAYMENT_TERM_ID.toString()); //to string jog korlam
      setLocationCodeBillTo(details.BILL_TO_LOCATION_ID.toString());
      // console.log(details.INVOICE_LOOKUP_TYPE);
      console.log(details.INVOICE_TYPE);

      setSelectedInvoiceType(details.INVOICE_TYPE);
      setBuyerAttachmentFileName(details.BUYER_ATTACHMENT_FILE_ORG_NAME);

      setLocationCodeShipTo(details.SHIP_TO_LOCATION_ID.toString());
      setNote(details.NOTE_TO_SUPPLIER);

      const currentYear = new Date().getFullYear();

      if (details?.NEED_BY_DATE != null) {
        const needByDate = details?.NEED_BY_DATE;

        // Check if tradeOrExportLicenseStartDate is not null before creating a new Date object
        const dateValue = new Date(needByDate!);
        setNeedByDate({
          startDate: dateValue,
          endDate: new Date(currentYear, 11, 31), // Set the endDate to the end of the current year
        });

        //setiing for sendin to api
        //  setAddUpdateEndDate(moment(data?.TRADE_OR_EXPORT_LICENSE_END_DATE).format("YYYY-MM-DD"))
      }

      // handleOpenDateChange(details.OPEN_DATE);

      const openTime = formatTimestampTo24Hour(details.OPEN_DATE);
      console.log(openTime);

      const closeTime = formatTimestampTo24Hour(details.CLOSE_DATE);
      console.log(closeTime);

      setOpenTime(openTime);
      setCloseTime(closeTime);

      if (details?.OPEN_DATE != null) {
        const openDate = details?.OPEN_DATE;

        // Check if tradeOrExportLicenseStartDate is not null before creating a new Date object
        const dateValue = new Date(openDate!);
        setOpenDate({
          startDate: dateValue,
          endDate: new Date(currentYear, 11, 31), // Set the endDate to the end of the current year
        });
        setFormattedOpenDate(moment(dateValue).format("DD-MMM-YY"));

        //setiing for sendin to api
        //  setAddUpdateEndDate(moment(data?.TRADE_OR_EXPORT_LICENSE_END_DATE).format("YYYY-MM-DD"))
      }

      // setCombineOpenDateTime()

      if (details?.CLOSE_DATE != null) {
        const closeDate = details?.CLOSE_DATE;

        // Check if tradeOrExportLicenseStartDate is not null before creating a new Date object
        const dateValue = new Date(closeDate!);
        setCloseDate({
          startDate: dateValue,
          endDate: new Date(currentYear, 11, 31), // Set the endDate to the end of the current year
        });
        setFormattedCloseDate(moment(dateValue).format("DD-MMM-YY"));

        //setiing for sendin to api
        //  setAddUpdateEndDate(moment(data?.TRADE_OR_EXPORT_LICENSE_END_DATE).format("YYYY-MM-DD"))
      }
      if (details?.ETR != null) {
        const ertDate = details?.ETR;

        // Check if tradeOrExportLicenseStartDate is not null before creating a new Date object
        const dateValue = new Date(ertDate!);
        setEtrDate({
          startDate: dateValue,
          endDate: new Date(currentYear, 11, 31), // Set the endDate to the end of the current year
        });

        //set combine date time

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

        const openDateTime = convertTimestamp(details.OPEN_DATE);
        console.log(openDateTime);

        setCombineOpenDateTime(openDateTime);
        const closeDateTime = convertTimestamp(details.CLOSE_DATE);
        console.log(closeDateTime);

        setCombineCloseDateTime(closeDateTime);

        const needByDate = convertTimestamp(details.NEED_BY_DATE);
        setFormattedNeedByDate(needByDate);
        const etrDate = convertTimestamp(details.ETR);

        setSelectedEtrDate(etrDate);

        setSelectedInvoiceType(details.INVOICE_TYPE);

        //set combine date time

        //setiing for sendin to api
        //  setAddUpdateEndDate(moment(data?.TRADE_OR_EXPORT_LICENSE_END_DATE).format("YYYY-MM-DD"))
      }
    }
  };

  //set headers if it is not null

  //set data
  const setData = () => {
    setHeaderAttachment(headerAttachmentFile);
    setNeedByDateInStore(formatedNeedByDate);
    // setRfqTypeInStore(isBothRfq ? "B" : "T");
    setRfqCloseDateInStore(combineCloseDateTime);
    setRfqOpenDateInStore(combineOpenDateTime);
    setRfqSubjectInStore(rfqSubject);
    setRfqTitleInStore(rfqtitle);
    setFreightTermInStore(selectedFreightTerm);
    setPaymentTermInStore(selectedPaymentterm);
    setFobInStore(fob);
    setBuyerAttachmentInStore(buyerAttachmentFile);
    setCurrencyInStore(currencyCode);
    setEtrInStore(selectedEtrDate);
    setBillToAddressInStore(locationCodeBillTo);
    setShipToAddressInStore(locationCodeShipTo);
    // setInvoiceTypeInStore(selectedInvoiceType);
    setVatApplicableStatusInStore(isVatApplicable ? "Y" : "N");
    setVatPercentageInStore(parseInt(rfqVatpercentage));
    console.log(note);

    setNoteInStore(note);
    setFreightTermInStore(selectedFreightTerm);
    setPaymentTermInStore(selectedPaymentterm);
    console.log(selectedInvoiceType);

    setInvoiceTypeInStore(selectedInvoiceType);
  };
  //set data

  //store
  const { loggedInUserName } = useAuthStore();
  //store

  //rfq type

  const [isBothRfq, setisBothRfq] = useState<boolean>(false);

  const handleBothOrTechnicalRfq = () => {
    setisBothRfq(!isBothRfq);
  };

  //rfq type

  //fob
  const fobRef = useRef<HTMLInputElement | null>(null);
  const [fob, setFob] = useState<string>("");
  const handleFobChange = (value: string) => {
    setFob(value);
  };
  //fob

  //buyer attchemnt

  const [buyerAttachmentFileName, setBuyerAttachmentFileName] = useState<
    string | null
  >("" || null);
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

  //vat applicable

  const [isVatApplicable, setIsVatApplicable] = useState<boolean>(false);

  const handleIsVatApplicable = () => {
    setIsVatApplicable(!isVatApplicable);
  };
  //vat applicable
  //save

  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false);

  const saverfq = async () => {
    console.log(prItems.length);

    if (openDate.startDate! >= closeDate.startDate!) {
      showErrorToast("close date has to be greater than open date");
    } else if (etrDate.startDate === null) {
      showErrorToast("Please Enter Etr Date");
    } else if (rfqStatusInStore === "SUBMIT") {
      showErrorToast("This Rfq is already published");
    } else {
      try {
        setIsSaveLoading(true);
        const result = await RfqSaveService(
          token!,
          rfqSubject,
          rfqtitle,
          isBothRfq ? "B" : "T",
          formatedNeedByDate,
          combineOpenDateTime,
          combineCloseDateTime,
          selectedEtrDate,
          headerAttachmentFile,
          // headerMime,
          // headerAttachmentFileName!,
          currencyCode,
          parseInt(locationCodeBillTo),
          parseInt(locationCodeShipTo),
          "SAVE",
          parseInt(rfqVatpercentage),
          isVatApplicable ? "Y" : "N",
          buyerAttachmentFile,
          selectedGeneralterm!,
          //new add
          selectedFreightTerm,
          parseInt(selectedPaymentterm),
          selectedInvoiceType,
          note,
          orgIdInStore,
          matchOptionInStore,
          rateTypeInStore,
          rateDateInStore,
          conversionRateInStore
          // fob
        );
        console.log(result.data);

        if (result.data.status === 200) {
          // showSuccessToast(result.data.message);
          console.log(prItems.length);
          let rfqId = result.data.rfq_id;
          setRfqIdInStore(rfqId);
          // setIsSavepressed(true);

          for (let i = 0; i < prItems.length; i++) {
            console.log(rfqId);
            console.log(prItems[i]);

            saveLineItemToRfq(rfqId, prItems[i]);
          }
          setIsSaveLoading(false);
          showSuccessToast("Rfq Saved Successfully");
        } else {
          setIsSaveLoading(false);
          showErrorToast(result.data.message);
        }
      } catch (error) {
        console.log(error);
        setIsSaveLoading(false);
        showErrorToast("Save Failed. Try Again");
      }
    }
  };
  //save

  //update Rfq
  const updateRfq = async () => {
    console.log(formatedNeedByDate);
    console.log(`${formattedOpenDate} ${OpenTime}`);
    console.log(`${formattedCloseDate} ${closeTime}`);
    console.log(selectedEtrDate);
    if (openDate.startDate! >= closeDate.startDate!) {
      showErrorToast("close date has to be greater than open date");
    } else if (etrDate.startDate === null) {
      showErrorToast("Please Enter Etr Date");
    } else if (rfqStatusInStore === "SUBMIT") {
      showErrorToast("This Rfq is already published");
    }
    // else if (rfqStatusInStore === "SUBMIT") {
    //   showErrorToast("This Rfq is already published");
    // }
    else {
      try {
        setIsSaveLoading(true);
        const result = await RfqHeaderUpdateService(
          token!,

          rfqHeaderDetailsInStore?.details.RFQ_ID!,
          rfqSubject,
          rfqtitle,
          isBothRfq ? "B" : "T",
          formatedNeedByDate,
          `${formattedOpenDate} ${OpenTime}`,
          `${formattedCloseDate} ${closeTime}`,
          selectedEtrDate,
          headerAttachmentFile,
          // headerMime,
          // headerAttachmentFileName!,
          currencyCode,
          parseInt(locationCodeBillTo),
          parseInt(locationCodeShipTo),
          "SAVE",
          parseInt(rfqVatpercentage),
          isVatApplicable ? "Y" : "N",
          buyerAttachmentFile,
          selectedGeneralterm!,
          //new add
          selectedFreightTerm,
          parseInt(selectedPaymentterm),
          selectedInvoiceType,
          note,
          orgIdInStore,
          matchOptionInStore,
          rateTypeInStore,
          rateDateInStore,
          conversionRateInStore,
          department!,
          approvalTypeInStore

          // fob
        );
        console.log(result.data);

        if (result.data.status === 200) {
          // showSuccessToast(result.data.message);
          console.log(prItems.length);
          let rfqId = result.data.rfq_id;
          if (prItems.length > 0) {
            for (let i = 0; i < prItems.length; i++) {
              console.log(rfqIdInStore);
              console.log(prItems[i]);

              saveLineItemToRfq(rfqIdInStore!, prItems[i]);
            }
          }

          //update a rfw id age thekei thakbe but save a o thakbe jodi edit kore rfrq

          if (prItems2.length > 0) {
            for (let i = 0; i < prItems2.length; i++) {
              console.log(rfqId);
              console.log(prItems2[i]);

              updateLineItemToRfq(rfqIdInStore!, prItems2[i]);
            }
          }

          setIsSaveLoading(false);
          // showSuccessToast("Rfq updated Successfully");
          setIsCreateRfq(false);
          showSuccessToast(result.data.message);
        } else {
          setIsSaveLoading(false);
          showErrorToast(result.data.message);
        }
      } catch (error) {
        console.log(error);
        setIsSaveLoading(false);
        showErrorToast("Update Failed. Try Again");
      }
    }
  };
  //update Rfq

  //SaveLineItemToService
  const saveLineItemToRfq = async (
    rfqId: number,
    pritem: PrItemInterface //SelectedPrItemInterface silo
  ) => {
    try {
      const result = await SaveLineItemToService(token!, rfqId, pritem);
      console.log(result.data);

      if (result.data.status === 200) {
      } else {
      }
    } catch (error) {
      console.log(error);
      showErrorToast("line Save Failed");
    }
  };
  //SaveLineItemToService

  //update rfq item
  const updateLineItemToRfq = async (
    rfqId: number,
    pritem: PrItemInterface
  ) => {
    try {
      const result = await UpdateLineItemToRfqService(token!, rfqId, pritem);
      console.log(result.data);

      if (result.data.status === 200) {
      } else {
      }
    } catch (error) {
      console.log(error);
      showErrorToast("Line Update Failed");
    }
  };
  //update rfq item

  //code from ridoy

  //rfi

  const [rfqInfoModal, setRfqInfoModal] = useState<boolean>(false);

  const [viewerId, setViewerId] = useState<number | null>(null);
  const [selectedAsId, setSelectedAsId] = useState<number | null>(null);
  const [approveValue, setApproveValue] = useState<string>("");
  //modal rfi
  const [approverList, setApproverList] = useState<ApproverInterface[] | []>(
    []
  );
  const [approverList2, setApproverList2] = useState<ApproverInterface[] | []>(
    []
  );

  const rfqInfo = () => {
    console.log(prItems);
    setRfqInfoModal(!rfqInfoModal);
  };

  const onClickAdditional = () => {
    setRfqInfoModal(!rfqInfoModal);
    if (rfqInfoModal) {
      setAdditionalValue("");
      setViewerId(null);
    }
  };

  const vatOnClickAdditional = () => {
    setVatInfoModal(!vatInfoModal);
    if (vatInfoModal) {
      setVatAdditionalValue("");
      setViewerId(null);
    }
  };

  const [additionalValue, setAdditionalValue] = useState<string>("");
  const [vatAdditionalValue, setVatAdditionalValue] = useState<string>("");

  // Event handler to update the state when the textarea value changes
  const handleRfqInfoChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const inputValue = event.target.value;

    if (inputValue.length <= 150) {
      setAdditionalValue(inputValue);
    } else {
      setAdditionalValue(inputValue.slice(0, 150));
    }
  };

  const handleVatInfoChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const inputValue = event.target.value;

    if (inputValue.length <= 150) {
      setVatAdditionalValue(inputValue);
    } else {
      setVatAdditionalValue(inputValue.slice(0, 150));
    }
  };

  const handleApproverSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value !== null) {
      const approvers = approverList2.filter((approver) =>
        approver.FULL_NAME.toLowerCase().includes(value)
      );
      setApproverList(approvers);
    } else {
      setApproverList(approverList2);
    }
  };

  const [isApproverLoading, setIsApproverLoading] = useState(false);
  const approverSequenceRef = useRef<HTMLInputElement | null>(null);
  const [approverSequence, setApproverSequence] = useState<string>("");
  const handleApproverSequence = (value: string) => {
    setApproverSequence(value);
  };

  const getApproverList = async () => {
    setIsApproverLoading(true);
    try {
      const result = await EmployeeListService(token!);
      console.log(result.data.profile_pic);

      if (result.data.status === 200) {
        setIsApproverLoading(false);
        // setApproverProfilePicPath(result.data.profile_pic);
        setApproverList(result.data.data);
        setApproverList2(result.data.data);

        // const convertedData = result.data.data.map((module:ModuleInterface) => ({
        //     value: module.MODULE_ID.toString(),
        //     label: module.MODULE_NAME,
        //   }));
        //   setModuleList(convertedData);
      } else {
        setIsApproverLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsApproverLoading(false);
      showErrorToast("Smothing went wrong");
    }
  };

  const [showApproverAddModal, setShowApproverAddModal] = useState(false);
  const openCloseApproverModal = () => {
    setShowApproverAddModal(!showApproverAddModal);
  };

  const handleApproverIdChange = (uId: number) => {
    setViewerId(uId);
    console.log(uId);
  };

  const sendRfi = async () => {
    if (validateRfi()) {
      setRfqInfoModal(false);
      try {
        const result = await RfiAddUpdateService(
          token!,
          null,
          rfqIdInStore,
          "RFQ",
          additionalValue,
          viewerId,
          "",
          0
        );
        if (result.data.status === 200) {
          showSuccessToast(result.data.message);
          setAdditionalValue("");
          setViewerId(null);
          // back();
          setRfqIdInStore(null);
          // setPage(1);
        } else {
          showErrorToast(result.data.message);
        }
      } catch (error) {
        showErrorToast("Something went wrong");
      }
    }
  };
  //rfi

  const sendVat = async () => {
    if (validateVat()) {
      setVatInfoModal(false);
      try {
        const result = await RfiAddUpdateService(
          token!,
          null,
          rfqIdInStore,
          "VAT",
          vatAdditionalValue,
          viewerId,
          "",
          0
        );
        if (result.data.status === 200) {
          showSuccessToast(result.data.message);
          setVatAdditionalValue("");
          setViewerId(null);
          setRfqIdInStore(null);
          // back();
          // setPage(1);
        } else {
          showErrorToast(result.data.message);
        }
      } catch (error) {
        showErrorToast("Something went wrong");
      }
    }
  };

  // validation
  const [stageError, setStageError] = useState<{
    stage?: string;
    approveNote?: string;
  }>({});
  const [rfiError, setRfiError] = useState<{
    rfiNote?: string;
    viewer?: string;
  }>({});

  const [vatError, setVatError] = useState<{
    vatNote?: string;
    viewer?: string;
  }>({});

  const [rejectError, setRejectError] = useState<{
    rejectNote?: string;
  }>({});

  //  {loginError.email && <ValidationError title={loginError.email} />}

  //validation
  const validateStage = () => {
    const errors: { stage?: string; approveNote?: string } = {};

    if (selectedAsId == null) {
      errors.stage = "Please Approval Stage";
    }
    if (!approveValue.trim()) {
      errors.approveNote = "Please Enter Note";
    }

    setStageError(errors);

    return Object.keys(errors).length === 0;
  };
  const validateRfi = () => {
    const errors: { rfiNote?: string; viewer?: string } = {};

    if (!additionalValue.trim()) {
      errors.rfiNote = "Please Enter Note";
    }
    if (viewerId == null) {
      errors.viewer = "Please Select A Viewer";
    }

    setRfiError(errors);

    return Object.keys(errors).length === 0;
  };

  const validateVat = () => {
    const errors: { vatNote?: string; viewer?: string } = {};

    if (!vatAdditionalValue.trim()) {
      errors.vatNote = "Please Enter Note";
    }
    if (viewerId == null) {
      errors.viewer = "Please Select A Viewer";
    }

    setVatError(errors);

    return Object.keys(errors).length === 0;
  };

  const validateReject = () => {
    const errors: { rejectNote?: string } = {};

    if (!additionalValue.trim()) {
      errors.rejectNote = "Please Enter Note";
    }

    setRejectError(errors);

    return Object.keys(errors).length === 0;
  };
  // validation

  //vat approval

  const [vatInfoModal, setVatInfoModal] = useState<boolean>(false);

  const vatApproval = () => {
    console.log(prItems);
    setVatInfoModal(!rfqInfoModal);
  };
  //vat approval

  //rfq item list service
  const [itemList, setItemList] = useState<PrItemInterface[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const getRfqItemList = async () => {
    try {
      setIsLoading(true);
      const result = await RfqItemListService(token!, rfqIdInStore);
      if (result.data.status === 200) {
        setItemList(result.data.data);
        setIsLoading(false);
      } else {
        showErrorToast(result.data.message);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      showErrorToast("Item Load Failed");
    }
  };

  //rfq item list service

  //rfqDetails

  const [buyerLineFilePath, setBuyerLineFilePath] = useState("");
  const [supplierLineFilePath, setSupplierLineFilePath] = useState("");

  const rfqDetailsService = async () => {
    try {
      const result = await RfqDetailsService(token!, rfqIdInStore!, 0, 100000);

      if (result.data.status === 200) {
        // setRfqDetailsInStore(result.data);
        setBuyerLineFilePath(result.data.buyer_line_file);
        setSupplierLineFilePath(result.data.supplier_line_file);
        setItemList(result.data.line_items);

        console.log("item: ", result.data);
      } else {
      }
    } catch (error) {
      showErrorToast("Rfq Details Load Failed");
    }
  };

  //rfqDetails

  //current stock

  const [currentStock, setCurrentStock] = useState<
    CurrentStockInterface[] | []
  >([]);

  const [currentStockLoading, setCurrentStockLoading] =
    useState<boolean>(false);

  const openCurrentStockModal = async (orgId: number, itemId: number) => {
    console.log(orgId);
    console.log(itemId);

    try {
      setCurrentStockLoading(true);
      const result = await CurrentStockService(token!, orgId, itemId);

      if (result.data.status === 200) {
        setCurrentStock(result.data.data);
        console.log(result.data);

        setCurrentStockLoading(false);
      } else {
        showErrorToast(result.data.message);
        setCurrentStockLoading(false);
      }
    } catch (error) {
      showErrorToast("Current Stock Load Failed");
      setCurrentStockLoading(false);
    }

    const modal = document.getElementById(
      "my_modal_3"
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };
  //current stock

  const [selectedRfqLineIdList, setSelectedRfqLineIdList] = useState<number[]>(
    []
  );

  const [isSelectedAll, setIsSelectAll] = useState<boolean>(false);
  const selectAll = () => {
    setIsSelectAll(true);
    const list: number[] = [];
    for (let i = 0; i < itemList.length; i++) {
      list.push(itemList[i].RFQ_LINE_ID);
    }
    setSelectedRfqLineIdList(list);
  };
  const unselectAll = () => {
    setIsSelectAll(false);
    setSelectedRfqLineIdList([]);
  };

  const toggleRfqLineId = (rfqLineId: number) => {
    setSelectedRfqLineIdList((prevList) => {
      // Check if rfqLineId is already in the list
      const index = prevList.indexOf(rfqLineId);
      if (index === -1) {
        // If not, add it to the list
        return [...prevList, rfqLineId];
      } else {
        // If yes, remove it from the list
        const newList = [...prevList];
        newList.splice(index, 1);
        return newList;
      }
    });
  };

  //cs creation store
  const {
    setRfqLineIdListInStore,
    setOrgIdInStore,
    setOrgNameInStore,
    setBuyerGeneralTermInStore,
    setCurrencyNameInStore,
    setRfqIdInCsCreationStore,
    setRfqTypeInCsCreationStore,
    setApprovalTypeInCsCreation,

    setBuyerDeptInCsCreationStore,
  } = useCsCreationStore();
  //cs creation store

  useEffect(() => {
    setBuyerGeneralTermInStore(
      rfqHeaderDetailsInStore?.details.BUYER_GENERAL_TERMS!
    );
    setRfqIdInCsCreationStore(rfqHeaderDetailsInStore?.details.RFQ_ID!);
  }, []);

  const [orgName, setOrgName] = useState<string>("");
  const getOrgList = async () => {
    try {
      const result = await GetOrgListService(token!);
      console.log(result);

      if (result.data.status === 200) {
        const findOrg: CommonOrgInterface = result.data.data.find(
          (org: CommonOrgInterface) =>
            org.ORGANIZATION_ID.toString() ===
            rfqHeaderDetailsInStore?.details.ORG_ID!.toString()
        );

        console.log("find org", findOrg);

        setOrgName(findOrg.NAME);
        setOrgNameInStore(findOrg.NAME);
        setOrgIdInStore(findOrg.ORGANIZATION_ID);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Organization Load Failed");
    }
  };
  //org list

  return (
    <div className=" m-8 bg-white">
      <SuccessToast />
      {isLoading ? (
        <div className=" w-full  flex justify-center items-center">
          <LogoLoading />
        </div>
      ) : (
        <div className="w-full  items-start space-y-4">
          <div className=" w-full flex justify-between items-center">
            <div className=" flex flex-col items-start">
              <h1 className=" text-blackColor font-medium text-lg font-mon">
                Terms
              </h1>
              {/* <NavigationPan list={pan} /> */}
            </div>
            <CommonButton
              onClick={back}
              titleText="Back"
              width="w-24"
              color="bg-midGreen"
            />
          </div>
          <p className=" text-lg font-semibold font-mon text-blackColor">
            Header
          </p>
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
                    {/* <FilePickerInput
                      onFileSelect={handleHeaderAttachmentLicense}
                      mimeType=".pdf, image/*"
                      maxSize={2 * 1024 * 1024}
                      width="w-full"
                      initialFileName={headerFileInitailName}
                      disable={true}
                    /> */}
                    <a
                      href={`${rfqHeaderDetailsInStore?.header_file_path}/${rfqHeaderDetailsInStore?.details.RFQ_ATTACHMENT_FILE_NAME}`}
                      target="_blank"
                      className=" w-full flex justify-center items-center py-2 border-[1px] border-borderColor border-dashed rounded-md"
                      rel="noreferrer"
                    >
                      view
                    </a>
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
                {/* <FilePickerInput
                  onFileSelect={handleBuyerAttachmentFile}
                  // mimeType=".pdf, image/*"
                  initialFileName={buyerAttachmentFileName!}
                  maxSize={2 * 1024 * 1024}
                  width="w-72"
                  disable={true}
                /> */}
                <a
                  href={`${rfqHeaderDetailsInStore?.header_term_file_path}/${rfqHeaderDetailsInStore?.details.BUYER_ATTACHMENT_FILE_NAME}`}
                  target="_blank"
                  className=" w-72 flex justify-center items-center py-2 border-[1px] border-borderColor border-dashed rounded-md"
                  rel="noreferrer"
                >
                  view
                </a>
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

          <p className=" text-lg font-semibold font-mon text-blackColor">
            Note
          </p>
          <textarea
            value={note}
            onChange={handleNote}
            className=" border-[1px] border-borderColor w-full h-24 rounded-md p-4 bg-inputBg focus:outline-none "
            disabled={true}
          />

          <InputLebel titleText={"Item List"} />

          <div className="overflow-auto max-h-[400px] rounded-lg shadow-lg custom-scrollbar">
            <table className="min-w-full divide-y divide-gray-200 rounded-lg">
              <thead className="bg-[#CAF4FF] sticky top-0 ">
                <tr>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    <button
                      onClick={() => {
                        isSelectedAll ? unselectAll() : selectAll();
                      }}
                      className="flex space-x-2 items-center"
                    >
                      <div
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
                      </div>
                    </button>
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    SL
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    PR No/Line No
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    Requester/Username
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    Item Description
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    Specification
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    Expected Brand Name
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    Expected Brand Origin
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    LCM Enabled
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    Vat
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    Warranty
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    UOM
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    Expected Quantity
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    Need By Date
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    Inventory Org Name
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    Current Stock
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    Attachment
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                    Note to Supplier
                  </th>
                </tr>
              </thead>

              {itemList.map((e, i) => (
                <tbody
                  onClick={() => {}}
                  key={e.RFQ_ID}
                  className=" cursor-pointer bg-white divide-y divide-gray-200"
                >
                  <tr>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        <button
                          onClick={() => {
                            toggleRfqLineId(e.RFQ_LINE_ID);
                          }}
                          className={`${
                            selectedRfqLineIdList.some(
                              (emp) => emp === e.RFQ_LINE_ID
                            )
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
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar ">
                      <div className="w-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                        {i + 1}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {e.PR_NUMBER}/{e.LINE_NUM}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {"N/A"}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {!e.ITEM_DESCRIPTION ? "N/A" : e.ITEM_DESCRIPTION}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {!e.ITEM_SPECIFICATION ? "N/A" : !e.ITEM_SPECIFICATION}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {!e.EXPECTED_BRAND_NAME ? "N/A" : e.EXPECTED_BRAND_NAME}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {!e.EXPECTED_ORIGIN ? "N/A" : e.EXPECTED_ORIGIN}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        <div
                          className={` flex justify-center items-center h-4 w-4 ${
                            e.LCM_ENABLE_FLAG === "Y"
                              ? " bg-midGreen border-none"
                              : "border-borderColor border-[1px] bg-white"
                          } rounded-[4px]`}
                        >
                          <img
                            src="/images/check.png"
                            alt="check"
                            className=" w-2 h-2"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        <div
                          className={` flex justify-center items-center h-4 w-4 ${
                            e.BUYER_VAT_APPLICABLE === "Y"
                              ? " bg-midGreen border-none"
                              : "border-borderColor border-[1px] bg-white"
                          } rounded-[4px]`}
                        >
                          <img
                            src="/images/check.png"
                            alt="check"
                            className=" w-2 h-2"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        <div
                          className={` flex justify-center items-center h-4 w-4 ${
                            e.WARRANTY_ASK_BY_BUYER === "Y"
                              ? " bg-midGreen border-none"
                              : "border-borderColor border-[1px] bg-white"
                          } rounded-[4px]`}
                        >
                          <img
                            src="/images/check.png"
                            alt="check"
                            className=" w-2 h-2"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {!e.UNIT_MEAS_LOOKUP_CODE
                          ? "N/A"
                          : e.UNIT_MEAS_LOOKUP_CODE}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {!e.EXPECTED_QUANTITY ? "N/A" : e.EXPECTED_QUANTITY}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {!e.NEED_BY_DATE
                          ? "N/A"
                          : moment(e.NEED_BY_DATE).format("DD-MMMM-YYYY")}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {"N/A"}
                      </div>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <Button
                        onClick={() => {
                          openCurrentStockModal(e.ORG_ID, e.ITEM_ID);
                        }}
                        className="bg-midBlack font-mon text-white text-xs font-medium rounded-md h-8 px-1 "
                      >
                        View
                      </Button>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <a
                        href={`${buyerLineFilePath}/${e.BUYER_FILE}`}
                        target="_blank"
                        className="font-mon text-white bg-slate-900 py-2 px-6 rounded-lg"
                        rel="noreferrer"
                      >
                        View
                      </a>
                    </td>
                    <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                      <div className="w-full overflow-auto custom-scrollbar text-center">
                        {!e.NOTE_TO_SUPPLIER ? "N/A" : e.NOTE_TO_SUPPLIER}
                      </div>
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>

          {/* <div className="overflow-x-auto my-6">
            <table
              className="min-w-full divide-y divide-gray-200 border-[0.2px] border-borderColor rounded-md"
              style={{ tableLayout: "fixed" }}
            >
              <thead className="sticky top-0 bg-[#F4F6F8] h-14">
                <tr>
                  <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  ">
                    <button
                      onClick={() => {
                        isSelectedAll ? unselectAll() : selectAll();
                      }}
                      className="flex space-x-2 items-center"
                    >
                      <div
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
                      </div>
                    </button>
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  ">
                    SL
                  </th>
                  <th className=" font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                    PR No/Line No
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                    Requester/Username
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                    Item Description
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                    Specification
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                    Expected Brand Name
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                    Expected Brand Origin
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                    LCM Enabled
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                    Vat
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                    Warranty
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                    UOM
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                    Expected Quantity
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                    Need By Date
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                    Inventory Org Name
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                    Current Stock
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                    Attachment
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                    Note to Supplier
                  </th>

                 
                </tr>
              </thead>

             
              {itemList.map((e, i) => (
                <tbody
                  onClick={() => {}}
                  className="cursor-pointer bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]"
                  key={i}
                >
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor font-medium">
                    <button
                      onClick={() => {
                        toggleRfqLineId(e.RFQ_LINE_ID);
                      }}
                      className={`${
                        selectedRfqLineIdList.some(
                          (emp) => emp === e.RFQ_LINE_ID
                        )
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
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor font-medium">
                    {i + 1}
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {e.PR_NUMBER}/{e.LINE_NUM}
                  </td>
                  <td className=" w-64 font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {"N/A"}
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {!e.ITEM_DESCRIPTION ? "N/A" : e.ITEM_DESCRIPTION}
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {!e.ITEM_SPECIFICATION ? "N/A" : !e.ITEM_SPECIFICATION}
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {!e.EXPECTED_BRAND_NAME ? "N/A" : e.EXPECTED_BRAND_NAME}
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {!e.EXPECTED_ORIGIN ? "N/A" : e.EXPECTED_ORIGIN}
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    <div
                      className={` flex justify-center items-center h-4 w-4 ${
                        e.LCM_ENABLE_FLAG === "Y"
                          ? " bg-midGreen border-none"
                          : "border-borderColor border-[1px] bg-white"
                      } rounded-[4px]`}
                    >
                      <img
                        src="/images/check.png"
                        alt="check"
                        className=" w-2 h-2"
                      />
                    </div>
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor ">
                    <div
                      className={` flex justify-center items-center h-4 w-4 ${
                        e.BUYER_VAT_APPLICABLE === "Y"
                          ? " bg-midGreen border-none"
                          : "border-borderColor border-[1px] bg-white"
                      } rounded-[4px]`}
                    >
                      <img
                        src="/images/check.png"
                        alt="check"
                        className=" w-2 h-2"
                      />
                    </div>
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    <div
                      className={` flex justify-center items-center h-4 w-4 ${
                        e.WARRANTY_ASK_BY_BUYER === "Y"
                          ? " bg-midGreen border-none"
                          : "border-borderColor border-[1px] bg-white"
                      } rounded-[4px]`}
                    >
                      <img
                        src="/images/check.png"
                        alt="check"
                        className=" w-2 h-2"
                      />
                    </div>
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {!e.UNIT_MEAS_LOOKUP_CODE ? "N/A" : e.UNIT_MEAS_LOOKUP_CODE}
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {!e.EXPECTED_QUANTITY ? "N/A" : e.EXPECTED_QUANTITY}
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {!e.NEED_BY_DATE
                      ? "N/A"
                      : moment(e.NEED_BY_DATE).format("DD-MMMM-YYYY")}
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {"N/A"}
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    <Button
                      onClick={() => {
                        openCurrentStockModal(e.ORG_ID, e.ITEM_ID);
                      }}
                      className="bg-midBlack font-mon text-white text-xs font-medium rounded-md h-8 px-1 "
                    >
                      View
                    </Button>
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    <a
                      href={`${buyerLineFilePath}/${e.BUYER_FILE}`}
                      className="font-mon text-white bg-slate-900 py-2 px-6 rounded-lg"
                    >
                      View
                    </a>
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {!e.NOTE_TO_SUPPLIER ? "N/A" : e.NOTE_TO_SUPPLIER}
                  </td>
                </tbody>
              ))}
            </table>
          </div> */}

          <div className=" h-10"></div>
          <div className=" w-full flex justify-start items-center space-x-6">
            <CommonButton
              titleText="Previous"
              onClick={previousPage}
              color="bg-graishColor"
              width="w-28"
            />
            <CommonButton
              titleText="Continue"
              onClick={submitAndNext}
              color="bg-midGreen"
              width="w-28"
            />
          </div>
          <div className=" h-10"></div>
        </div>
      )}

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box modal-middle w-3/4 max-w-none">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          <div className="h-10"></div>

          {currentStockLoading ? (
            <div className=" w-full h-full flex justify-center items-center">
              <LogoLoading />
            </div>
          ) : (
            <div className=" overflow-x-auto ">
              <table
                className="min-w-full divide-y divide-gray-200 border-[0.2px] border-borderColor shadow rounded-md"
                style={{ tableLayout: "fixed" }}
              >
                <thead className="sticky top-0 bg-[#F4F6F8] h-14 text-center">
                  <tr>
                    <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                      Current Onhand
                    </th>
                  </tr>
                </thead>

                <tbody className="cursor-pointer bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]">
                  {currentStock.map((e, index) => {
                    return (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                      >
                        <td className=" font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {e.ON_HAND}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {/* // ))} */}
              </table>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
}
