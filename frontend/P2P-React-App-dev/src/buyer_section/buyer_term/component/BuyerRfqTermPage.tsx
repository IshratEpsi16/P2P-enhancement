import React, { useEffect, useRef, useState } from "react";
import CommonInputField from "../../../common_component/CommonInputField";
import ReusableDatePicker from "../../../common_component/ReusableDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import NavigationPan from "../../../common_component/NavigationPan";
import DropDown from "../../../common_component/DropDown";
import FilePickerInput from "../../../common_component/FilePickerInput";
import CommonButton from "../../../common_component/CommonButton";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useRfqCreateProcessContext } from "../../../buyer_rfq_create/context/RfqCreateContext";
import moment from "moment";
import DateRangePicker from "../../../common_component/DateRangePicker";
import usePrItemsStore from "../../pr/store/prItemStore";
import { useAuth } from "../../../login_both/context/AuthContext";
import CurrencyListService from "../../../registration/service/bank/CurrencyListService";
import { showErrorToast } from "../../../Alerts_Component/ErrorToast";
import CommonDropDownSearch from "../../../common_component/CommonDropDownSearch";
import LocationListService from "../service/LocationListService";
import LocationInterface from "../interface/LocationListInterface";
import InvoiceTypeListService from "../service/InvoiceTypeService";
import InvoiceTypeInterface from "../interface/InvoiceTypeInterface";
import FreightTermService from "../service/FreightTermService";
import FreightTermInterface from "../interface/FreightTermInterface";
import PaymentTermService from "../service/PaymentTermServie";
import PaymentTermInterface from "../interface/PaymentTermInterface";
import useAuthStore from "../../../login_both/store/authStore";
import RfqSaveService from "../service/RfqSaveService";
import SuccessToast, {
  showSuccessToast,
} from "../../../Alerts_Component/SuccessToast";
import CircularProgressIndicator from "../../../Loading_component/CircularProgressIndicator";
import SaveLineItemToService from "../service/SavelineItemsToRfqService";
import SelectedPrItemInterface from "../../pr_item_list/interface/selectedPritemInterface";
import convertToAMPM from "../../../utils/methods/convertToAMPM";
import formatTimestampTo24Hour from "../../../utils/methods/formatTimestampTo24Hour";
import RfqHeaderUpdateService from "../service/RfqHeaderUpdateService";
import UpdateLineItemToRfqService from "../service/UpdateLineitemsToRfqService";
import PrItemInterface from "../../pr_item_list/interface/PrItemInterface";
import EmployeeListService from "../../../approval_setup/service/EmployeeListService";
import RfiAddUpdateService from "../../../manage_supplier_profile_update/service/rfi/RfiAddUpdateService";
import ApproverInterface from "../../../approval_setup/interface/ApproverInterface";
import ValidationError from "../../../Alerts_Component/ValidationError";
import { Modal, Button } from "keep-react";
import { CloudArrowUp } from "phosphor-react";
import { Textarea } from "keep-react";
import SearchIcon from "../../../icons/SearchIcon";
import subtract12HoursFromDate from "../../../utils/methods/subtract12HoursFromDate";
import GetOrgListService from "../../../common_service/GetOrgListService";
import CommonOrgInterface from "../../../common_interface/CommonOrgInterface";
import PageTitle from "../../../common_component/PageTitle";
import { enumConstant } from "../../../utils/methods/enum_constant";
const ttt = `Terms that you have to follow`;

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

const matchOptions = [
  { value: "2WAY", label: "2 WAY" },
  { value: "3WAY", label: "3 WAY" },
  { value: "4WAY", label: "4 WAY" },
];

const rateType = [
  { value: "Corporate", label: "Corporate" },
  { value: "Spot", label: "Spot" },
  { value: "User", label: "User" },
];

const approvalOptions = [
  {
    value: "short",
    label: "Short Approval",
  },
  {
    value: "long",
    label: "Long Approval",
  },
];

export default function BuyerRfqTermPage() {
  const rfqTitleRef = useRef<HTMLInputElement | null>(null);
  const rfqSubjectRef = useRef<HTMLInputElement | null>(null);
  const rfqVatPercentageRef = useRef<HTMLInputElement | null>(null);
  const convRateRef = useRef<HTMLInputElement | null>(null);

  const [rfqtitle, setRfqTitle] = useState("");
  const [rfqSubject, setRfqSubject] = useState("");
  const [rfqVatpercentage, setRfqVatPercentage] = useState("");
  // const [openDate, setOpenDate] = React.useState<Dayjs | null>(dayjs(""));
  // const [closeDate, setCloseDate] = React.useState<Dayjs | null>(dayjs(""));

  const [rateDate, setRateDate] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: new Date(new Date().getFullYear(), 11, 31), // Set the endDate to the end of the current year
  });

  const [selectedRateDate, setSelectedRateDate] = useState<string>("");
  const [selectedRateType, setSelectedRateType] = useState<string>("");
  const [conversionRate, setConversionRate] = useState<string>("");
  const [selectedMatch, setSelectedMatch] = useState<string>("");

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
    console.log("dept", department);

    console.log(rfqHeaderDetailsInStore?.details.RFQ_ID);
    console.log(rfqHeaderDetailsInStore);
    console.log(orgIdInStore);

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
        setCurrencyListFromOracle(transformedData);
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

    if (value === "BDT") {
      // setSelectedRateType("");
      // setSelectedMatch("");
      // setConversionRate("");
      // setSelectedRateDate(""); // Reset selectedRateDate to an empty string
      setRateDate({
        startDate: null, // Reset startDate to null
        endDate: new Date(new Date().getFullYear(), 11, 31), // Keep the endDate at the end of the current year
      });
      if (convRateRef.current) {
        convRateRef.current.value = "";
      }

      // setRateTypeInStore("");
      // setMatchOptionInStore("");
      // setRateTypeInStore("");
      // setRateTypeInStore("");
    }
    // Do something with the selected value
  };

  // const handleCurrencyFromOracleChange = (value: any) => {
  //   // console.log("value:", value);
  //   setCurrencyFromOracle(value);
  //   if (value !== null) {
  //     console.log(value.value);
  //     //   getBranch(value.value);
  //     setCurrencyCode(value.value);

  //     //   getBank(value.value);
  //   } else if (value == null && currencyListFromOracle != null) {
  //     setCurrencyCode("");
  //     console.log("cleared");
  //   }
  // };

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
        // if (!isCreateRfq) {
        //   const findFreight: FreightTermInterface = result.data.data.find(
        //     (item: FreightTermInterface) =>
        //       item.LOOKUP_CODE === freightTermInStore
        //   );
        //   setFreightTermNameInStore(findFreight.MEANING);
        // }
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
  const { page, setPage } = useRfqCreateProcessContext();
  const submitAndNext = () => {
    if (rfqStatusInStore === "SUBMIT") {
      showErrorToast("This Rfq is already published");
    } else if (rfqtitle === "") {
      showErrorToast("Please give RFQ title");
    } else if (rfqSubject === "") {
      showErrorToast("Please give RFQ subject");
    } else if (combineOpenDateTime === "") {
      showErrorToast("Please give Open date");
    } else if (combineCloseDateTime === "") {
      showErrorToast("Please give Close date");
    } else if (openDate.startDate! >= closeDate.startDate!) {
      showErrorToast("Close date has to be greater than Open date");
    } else if (formatedNeedByDate === "") {
      showErrorToast("Please give need by date");
    } else if (selectedFreightTerm === "") {
      showErrorToast("Please select Freight Term");
    } else if (selectedPaymentterm === "") {
      showErrorToast("Please select Payment Term");
    } else if (currencyCode === "") {
      showErrorToast("Please select Currency");
    } else if (etrDate.startDate === null) {
      showErrorToast("Please Enter ETR date");
    } else if (selectedMatch === "") {
      showErrorToast("Please select Match Option");
    } else if (locationCodeBillTo === "") {
      showErrorToast("Please select Bill to Location");
    } else if (locationCodeShipTo === "") {
      showErrorToast("Please select Ship to Location");
    } else if (selectedApprovalType === "") {
      showErrorToast("Please select Approval Type");
    } else if (selectedRateType === "" && department === enumConstant.FOREIGN) {
      showErrorToast("Please select Rate Type");
    } else if (selectedRateDate === "" && department === enumConstant.FOREIGN) {
      showErrorToast("Please select Rate Date");
    } else if (conversionRate === "" && department === enumConstant.FOREIGN) {
      showErrorToast("Please select conv. Rate");
    }

    // else if (currencyCode !== "BDT" && selectedRateType === "") {
    //   showErrorToast("Please select Rate Type");
    // } else if (currencyCode !== "BDT" && rateDate.startDate === null) {
    //   showErrorToast("Please select Rate Date");
    // } else if (currencyCode !== "BDT" && conversionRate === "") {
    //   showErrorToast("Please enter Conversion Rate")
    else {
      setData();
      console.log("ccd", combineCloseDateTime);

      setPage(4);
    }
  };
  const previousPage = () => {
    setOrgNameInStore("");

    setRfqStatusInStore("");
    setPage(2);
    // setRfqIdInStore(null);
  };
  //context

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

  // const handleOpenDateChange = (newValue: any) => {
  //   setOpenDate(newValue);
  //   // Handle the selected date here
  //   setFormattedOpenDate(moment(newValue.startDate).format("DD-MMM-YY"));
  //   console.log(moment(newValue.startDate).format("DD-MMM-YY"));
  //   if (OpenTime !== "") {
  //     setCombineOpenDateTime(
  //       `${moment(newValue.startDate).format("DD-MMM-YY")} ${OpenTime}`
  //     );
  //     console.log(
  //       setCombineOpenDateTime(
  //         `${moment(newValue.startDate).format("DD-MMM-YY")} ${OpenTime}`
  //       )
  //     );
  //   }
  // };

  const handleOpenDateChange = (newValue: any) => {
    setOpenDate(newValue);
    const formattedDate = moment(newValue.startDate).format("DD-MMM-YY");
    setFormattedOpenDate(formattedDate);
    console.log(formattedDate);

    if (OpenTime !== "") {
      const combinedDateTime = `${formattedDate} ${OpenTime}`;
      setCombineOpenDateTime(combinedDateTime);
      console.log(combinedDateTime); // Log the combined value after updating state
    }
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

  // const handleCloseDateChange = (newValue: any) => {
  //   setCloseDate(newValue);
  //   // Handle the selected date here

  //   console.log(moment(newValue.startDate).format("DD-MMM-YY"));
  //   setFormattedCloseDate(moment(newValue.startDate).format("DD-MMM-YY"));
  //   // setCombineCloseDateTime(`${formattedCloseDate} ${formattedTime}`);
  //   if (closeTime !== "") {
  //     setCombineCloseDateTime(
  //       `${moment(newValue.startDate).format("DD-MMM-YY")} ${closeTime}`
  //     );
  //     console.log(
  //       setCombineCloseDateTime(
  //         `${moment(newValue.startDate).format("DD-MMM-YY")} ${closeTime}`
  //       )
  //     );
  //   }
  // };

  const handleCloseDateChange = (newValue: any) => {
    setCloseDate(newValue);
    const formattedDate = moment(newValue.startDate).format("DD-MMM-YY");
    setFormattedCloseDate(formattedDate);
    console.log("Formatted Close Date:", formattedDate);

    if (closeTime !== "") {
      const combinedCloseDateTime = `${formattedDate} ${closeTime}`;
      setCombineCloseDateTime(combinedCloseDateTime);
      console.log("Combined Close Date and Time:", combinedCloseDateTime);
    }
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
    console.log(`${formattedCloseDate} ${formattedTime}`);

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
  >(null);
  const [headerAttachmentFile, setHeaderAttachmentFile] = useState<File | null>(
    null
  );
  const [headerMime, setHeaderMime] = useState("");
  const [headebase64, setheaderBase64] = useState("");

  const handleHeaderAttachmentLicense = (file: File | null) => {
    if (file) {
      // const fileName = file.name;
      // const mimeType = file.type;
      // setHeaderAttachmentFileName(fileName);

      // // Extract file extension from MIME type
      // let fileExtension = "";
      // if (mimeType) {
      //   const mimeTypeParts = mimeType.split("/");
      //   if (mimeTypeParts.length === 2) {
      //     fileExtension = mimeTypeParts[1];
      //     console.log(fileExtension);
      //     setHeaderMime(fileExtension);
      //   }
      // }

      // const reader = new FileReader();

      // reader.onloadend = () => {
      //   // Convert the picked file to base64 string
      //   const base64String = reader.result as string; // Explicitly cast to string
      //   setheaderBase64(base64String);
      //   console.log(base64String);
      // };

      // if (file) {
      //   reader.readAsDataURL(file);
      // }

      // Handle the selected file here
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
    setMatchOptionInStore,
    setRateTypeInStore,
    setRateDateInStore,
    setConversionRateInStore,
    orgNameInStore,
    setOrgNameInStore,
    setApprovalTypeInStore,
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
      console.log("rfq header details: ", details);

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
      setSelectedMatch(details.MATCH_OPTION);
      setSelectedRateType(details.RATE_TYPE);
      // setSelectedRateDate(details.RATE_DATE);

      if (convRateRef.current) {
        convRateRef.current.value = details.CONVERSION_RATE.toString();
        setConversionRate(details.CONVERSION_RATE.toString()); //to string jog korlam
      }
      // setConversionRate(details.CONVERSION_RATE);

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

      if (details?.RATE_DATE != null) {
        const rateDate = details?.RATE_DATE;

        // Check if tradeOrExportLicenseStartDate is not null before creating a new Date object
        const dateValue = new Date(rateDate!);
        setRateDate({
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
      // setRfqCloseDateInStore()

      if (details?.OPEN_DATE != null) {
        const openDate = details?.OPEN_DATE;

        // Check if tradeOrExportLicenseStartDate is not null before creating a new Date object
        console.log(openDate);

        const op = subtract12HoursFromDate(openDate);

        const dateValue = new Date(op!);
        setOpenDate({
          startDate: dateValue,
          endDate: new Date(currentYear, 11, 31), // Set the endDate to the end of the current year
        });
        setFormattedOpenDate(
          moment(
            subtract12HoursFromDate(details?.OPEN_DATE).toISOString()
          ).format("DD-MMM-YY")
        );
        console.log(moment(dateValue).format("DD-MMM-YY"));
        console.log(subtract12HoursFromDate(details?.OPEN_DATE).toISOString());
        console.log(
          moment(
            subtract12HoursFromDate(details?.OPEN_DATE).toISOString()
          ).format("DD-MMM-YY")
        );

        // Convert string to Date object
        // const originalDate = new Date(details?.OPEN_DATE);

        // // Get the timestamp in milliseconds
        // const originalTimestamp = originalDate.getTime();

        // // Subtract 12 hours (12 hours * 60 minutes * 60 seconds * 1000 milliseconds)
        // const newTimestamp = originalTimestamp - 12 * 60 * 60 * 1000;

        // // Create a new Date object with the updated timestamp
        // const newDate = new Date(newTimestamp);

        // // Convert the new Date object back to an ISO string
        // const newDateTimeString = newDate.toISOString();
        // console.log(newDateTimeString);

        //setiing for sendin to api
        //  setAddUpdateEndDate(moment(data?.TRADE_OR_EXPORT_LICENSE_END_DATE).format("YYYY-MM-DD"))
      }

      // setCombineOpenDateTime()

      if (details?.CLOSE_DATE != null) {
        const closeDate = details?.CLOSE_DATE;

        // Check if tradeOrExportLicenseStartDate is not null before creating a new Date object
        const cl = subtract12HoursFromDate(closeDate);
        const dateValue = new Date(cl!);
        setCloseDate({
          startDate: dateValue,
          endDate: new Date(currentYear, 11, 31), // Set the endDate to the end of the current year
        });
        setFormattedCloseDate(
          moment(
            subtract12HoursFromDate(details?.CLOSE_DATE).toISOString()
          ).format("DD-MMM-YY")
        );

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
        if (details.APPROVAL_FLOW_TYPE) {
          setSelectedApprovalType(details.APPROVAL_FLOW_TYPE);
          setApprovalTypeInStore(details.APPROVAL_FLOW_TYPE);
        }

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
    setRfqTypeInStore(isBothRfq ? "B" : "T");
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

    setMatchOptionInStore(selectedMatch);
    setRateTypeInStore(selectedRateType);
    setRateDateInStore(selectedRateDate);
    setConversionRateInStore(conversionRate);
    // setMatchOptionInStore,
    // setRateTypeInStore,
    // setRateDateInStore,
    // setConversionRateInStore
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

    if (rfqStatusInStore === "SUBMIT") {
      showErrorToast("This Rfq is already published");
    } else if (rfqtitle === "") {
      showErrorToast("Please give RFQ title");
    } else if (rfqSubject === "") {
      showErrorToast("Please give RFQ subject");
    } else if (combineOpenDateTime === "") {
      showErrorToast("Please give Open date");
    } else if (combineCloseDateTime === "") {
      showErrorToast("Please give Close date");
    } else if (openDate.startDate! >= closeDate.startDate!) {
      showErrorToast("Close date has to be greater than Open date");
    } else if (formatedNeedByDate === "") {
      showErrorToast("Please give need by date");
    } else if (selectedFreightTerm === "") {
      showErrorToast("Please select Freight Term");
    } else if (selectedPaymentterm === "") {
      showErrorToast("Please select Payment Term");
    } else if (currencyCode === "") {
      showErrorToast("Please select Currency");
    } else if (etrDate.startDate === null) {
      showErrorToast("Please Enter ETR date");
    } else if (selectedMatch === "") {
      showErrorToast("Please select Match Option");
    } else if (locationCodeBillTo === "") {
      showErrorToast("Please select Bill to Location");
    } else if (locationCodeShipTo === "") {
      showErrorToast("Please select Ship to Location");
    }

    // else if(selectedMatch === "") {
    //   showErrorToast("Please select Match Option");
    // } else if (currencyCode === "") {
    //   showErrorToast("Please select Currency");
    // } else if (currencyCode !== "BDT" && selectedRateType === "") {
    //   showErrorToast("Please select Rate Type");
    // } else if (currencyCode !== "BDT" && rateDate.startDate === null) {
    //   showErrorToast("Please select Rate Date");
    // } else if (currencyCode !== "BDT" && conversionRate === "") {
    //   showErrorToast("Please enter Conversion Rate")
    // }
    else {
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
          rfqVatpercentage === "" ? 0 : parseInt(rfqVatpercentage),
          isVatApplicable ? "Y" : "N",
          buyerAttachmentFile,
          selectedGeneralterm!,
          //new add
          selectedFreightTerm,
          parseInt(selectedPaymentterm),
          selectedInvoiceType,
          note,
          orgIdInStore,
          selectedMatch,
          selectedRateType,
          conversionRate,
          selectedRateDate
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

    if (rfqStatusInStore === "SUBMIT") {
      showErrorToast("This Rfq is already published");
    } else if (rfqtitle === "") {
      showErrorToast("Please give RFQ title");
    } else if (rfqSubject === "") {
      showErrorToast("Please give RFQ subject");
    } else if (combineOpenDateTime === "") {
      showErrorToast("Please give Open date");
    } else if (combineCloseDateTime === "") {
      showErrorToast("Please give Close date");
    } else if (openDate.startDate! >= closeDate.startDate!) {
      showErrorToast("Close date has to be greater than Open date");
    } else if (formatedNeedByDate === "") {
      showErrorToast("Please give need by date");
    } else if (selectedFreightTerm === "") {
      showErrorToast("Please select Freight Term");
    } else if (selectedPaymentterm === "") {
      showErrorToast("Please select Payment Term");
    } else if (currencyCode === "") {
      showErrorToast("Please select Currency");
    } else if (etrDate.startDate === null) {
      showErrorToast("Please Enter ETR date");
    } else if (selectedMatch === "") {
      showErrorToast("Please select Match Option");
    } else if (locationCodeBillTo === "") {
      showErrorToast("Please select Bill to Location");
    } else if (locationCodeShipTo === "") {
      showErrorToast("Please select Ship to Location");
    }
    // else if(selectedMatch === "") {
    //   showErrorToast("Please select Match Option");
    // } else if (currencyCode === "") {
    //   showErrorToast("Please select Currency");
    // } else if (currencyCode !== "BDT" && selectedRateType === "") {
    //   showErrorToast("Please select Rate Type");
    // } else if (currencyCode !== "BDT" && rateDate.startDate === null) {
    //   showErrorToast("Please select Rate Date");
    // } else if (currencyCode !== "BDT" && conversionRate === "") {
    //   showErrorToast("Please enter Conversion Rate")
    // }
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
          rfqVatpercentage === "" ? 0 : parseInt(rfqVatpercentage),
          isVatApplicable ? "Y" : "N",
          buyerAttachmentFile,
          selectedGeneralterm!,
          //new add
          selectedFreightTerm,
          parseInt(selectedPaymentterm),
          selectedInvoiceType,
          note,
          orgIdInStore,
          selectedMatch,
          selectedRateType,
          selectedRateDate,
          conversionRate,
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
          // setPage(1);
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
          setPage(1);
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
          setPage(1);
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

  //code from ridoy

  //org list

  const [orgName, setOrgName] = useState<string>("");
  const getOrgList = async () => {
    try {
      const result = await GetOrgListService(token!);
      console.log(result);

      if (result.data.status === 200) {
        const findOrg: CommonOrgInterface = result.data.data.find(
          (org: CommonOrgInterface) =>
            org.ORGANIZATION_ID.toString() === orgIdInStore
        );

        console.log("find org", findOrg);

        setOrgName(findOrg.NAME);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Organization Load Failed");
    }
  };
  //org list
  useEffect(() => {
    setSelectedMatch("4WAY");
  }, []);
  const handleSelectMatch = (value: string) => {
    console.log(`Selected: ${value}`);
    // setSearchKey(value);
    setSelectedMatch(value);
  };
  const [selectedApprovalType, setSelectedApprovalType] = useState<string>("");
  const handleApprovalType = (value: string) => {
    console.log(`Selected: ${value}`);
    // setSearchKey(value);
    setSelectedApprovalType(value);
    setApprovalTypeInStore(value);
  };

  const handleSelectRate = (value: string) => {
    console.log(`Selected: ${value}`);
    // setSearchKey(value);
    setSelectedRateType(value);
  };

  const handleRateDateChange = (newValue: any) => {
    setRateDate(newValue);
    // Handle the selected date here
    setSelectedRateDate(
      moment(newValue.startDate).format("DD-MMM-YY HH:mm:ss")
    );
    console.log(moment(newValue.startDate).format("DD-MMM-YY HH:mm:ss"));
  };

  const onConvRateChange = (value: string) => {
    setConversionRate(value);
    console.log("conv rate: ", value);
  };

  return (
    <div className=" m-8">
      <SuccessToast />
      <div className="w-full flex flex-col items-start space-y-4">
        <PageTitle titleText="Terms" />
        <p className=" text-lg font-semibold font-mon text-blackColor">
          Header
        </p>
        <div className="border-[1px] border-borderColor p-8 rounded-md shadow-sm bg-inputBg w-full flex flex-col items-start space-y-4">
          <div className=" w-full flex flex-row justify-between items-center">
            <div className="flex flex-row space-x-4 items-center">
              <p className=" w-24   text-grayColor text-sm font-medium font-mon">
                RFQ Title<span className="text-red-500"> *</span>
              </p>
              <CommonInputField
                type="text"
                inputRef={rfqTitleRef}
                hint="Enter Title"
                onChangeData={onRfqTitleCHange}
                width="w-60"
              />
            </div>
            <div className=" flex flex-row space-x-4 items-center">
              <p className="w-28  text-grayColor text-sm font-medium font-mon">
                Open Date <span className="text-red-500">*</span>
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
                  />
                </div>
                <div className="">
                  <input
                    type="time"
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
                RFQ Subject <span className="text-red-500">*</span>
              </p>
              <CommonInputField
                type="text"
                inputRef={rfqSubjectRef}
                hint="Enter Subject"
                onChangeData={onRfqSubjectChange}
                width="w-60"
              />
            </div>
            <div className=" flex flex-row space-x-4 items-center">
              <p className="w-28  text-grayColor text-sm font-medium font-mon">
                Close Date <span className="text-red-500">*</span>
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
                  />
                </div>
                <div className="">
                  <input
                    type="time"
                    value={closeTime}
                    onChange={handleCloseTimeChange}
                    className="w-full bg-white border border-gray-300 rounded px-2 h-10 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className=" w-full flex flex-row items-center justify-between">
            <div className=" flex flex-row  space-x-4 items-center">
              <p className="w-24   text-grayColor text-sm font-medium font-mon">
                Prepared by
              </p>

              <p className="text-midBlack text-sm font-medium font-mon w-60">
                {loggedInUserName}
              </p>
            </div>

            <div className=" w-20"></div>

            <div className=" flex flex-row space-x-4 items-center">
              <p className="w-24  text-grayColor text-sm font-medium font-mon">
                <div className="flex-1 flex space-x-2  items-center">
                  <button
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
              <p className="w-24 text-grayColor text-sm font-medium font-mon">
                Need by date<span className="text-red-500">*</span>
              </p>
              <div className="w-60">
                <DateRangePicker
                  onChange={handleNeedByDateChange}
                  width="w-60"
                  placeholder="DD/MM/YYYY"
                  value={needByDate}
                  signle={true}
                  useRange={false}
                />
              </div>
            </div>

            <div className="w-12"></div>

            <div className=" flex flex-row space-x-4 items-center">
              {!isCreateRfq &&
              rfqHeaderDetailsInStore!.details.RFQ_ATTACHMENT_FILE_NAME ? (
                <p className="w-20  text-grayColor text-sm font-medium font-mon">
                  Attachment
                </p>
              ) : (
                <p className="w-24  text-grayColor text-sm font-medium font-mon">
                  Attachment
                </p>
              )}

              {!isCreateRfq &&
              rfqHeaderDetailsInStore!.details.RFQ_ATTACHMENT_FILE_NAME ? (
                <div className="w-full max-w-xs flex space-x-2 items-center">
                  <div className="w-[274px] ">
                    <FilePickerInput
                      onFileSelect={handleHeaderAttachmentLicense}
                      mimeType=".pdf, image/*"
                      maxSize={2 * 1024 * 1024}
                      width="w-full"
                      initialFileName={headerFileInitailName}
                    />
                  </div>
                  {rfqHeaderDetailsInStore!.details.RFQ_ATTACHMENT_FILE_NAME ? (
                    <a
                      target="_blank"
                      href={`${rfqHeaderDetailsInStore!.header_file_path}/${
                        rfqHeaderDetailsInStore!.details
                          .RFQ_ATTACHMENT_FILE_NAME
                      }`}
                      className=" py-2 px-2 border-[1px] border-borderColor border-dashed font-mon rounded-md"
                      rel="noreferrer"
                    >
                      view
                    </a>
                  ) : null}
                </div>
              ) : (
                <div className="w-full max-w-xs flex space-x-2 items-center">
                  <div className="w-[304px] ">
                    <FilePickerInput
                      onFileSelect={handleHeaderAttachmentLicense}
                      mimeType=".pdf, image/*"
                      maxSize={2 * 1024 * 1024}
                      width="w-full"
                      initialFileName={headerFileInitailName}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className=" w-full flex flex-row justify-between items-center">
            <div className=" flex flex-row  space-x-4 items-center">
              <p className="w-24   text-grayColor text-sm font-medium font-mon">
                Organization
              </p>
              <div className="w-72 ">
                <p className=" text-grayColor text-sm font-medium font-mon">
                  {!rfqHeaderDetailsInStore?.details.OU_DETAILS?.NAME
                    ? orgNameInStore
                    : rfqHeaderDetailsInStore?.details.OU_DETAILS?.NAME}
                </p>
              </div>
            </div>
            <div className=" w-32"></div>
            <div className=" w-full flex flex-row space-x-4 items-center">
              <div className="flex flex-row space-x-4 items-center">
                <p className="w-28 text-grayColor text-sm font-medium font-mon ">
                  Approval Type <span className="text-red-500">*</span>
                </p>

                <DropDown
                  options={approvalOptions}
                  onSelect={handleApprovalType}
                  width="w-60"
                  sval={selectedApprovalType}

                  // disable= {currencyCode === "BDT"}
                />
              </div>
            </div>
          </div>
        </div>
        <p className=" text-lg font-semibold font-mon text-blackColor">
          Buyer Term
        </p>
        <div className="border-[1px] border-borderColor p-8 rounded-md shadow-sm bg-inputBg w-full flex flex-col items-start space-y-6">
          <div className=" w-full flex flex-row justify-between items-center">
            <div className="flex flex-row space-x-4 items-center">
              <p className="w-28 text-grayColor text-sm font-medium font-mon">
                Freight Term <span className="text-red-500">*</span>
              </p>
              <DropDown
                options={freightTermFromoracle}
                onSelect={handleSelectFreightTerm}
                width="w-72"
                sval={selectedFreightTerm}
              />
            </div>

            <div className="flex flex-row space-x-4 items-center">
              <p className="w-28 text-grayColor text-sm font-medium font-mon">
                Payment Term <span className="text-red-500">*</span>
              </p>
              <DropDown
                options={paymentTermFromoracle}
                onSelect={handleSelectPaymentTerm}
                width="w-72"
                sval={selectedPaymentterm}
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
                initialFileName={buyerAttachmentFileName!}
                maxSize={2 * 1024 * 1024}
                width="w-72"
              />
            </div>
          </div>

          <div className=" w-full flex flex-row justify-between items-center">
            <div className="flex flex-row space-x-4 items-center">
              <p className="w-28  text-grayColor text-sm font-medium font-mon">
                Currency <span className="text-red-500">*</span>
              </p>
              <DropDown
                options={currencyListFromOracle}
                onSelect={handleSelectCurrency}
                sval={currencyCode}
                width="w-72"
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
                ETR <span className="text-red-500">*</span>
              </p>

              <div className=" w-72">
                <DateRangePicker
                  onChange={handleStartDateChange}
                  width="w-72"
                  placeholder="DD/MM/YYYY"
                  value={etrDate}
                  signle={true}
                  useRange={false}
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
              <p className="w-28 text-grayColor text-sm font-medium font-mon ">
                Match Option <span className="text-red-500">*</span>
              </p>

              <DropDown
                options={matchOptions}
                onSelect={handleSelectMatch}
                width="w-72"
                sval={selectedMatch}
                hint="Match Option"
                // disable= {currencyCode === "BDT"}
              />
            </div>
            <div className="flex flex-row space-x-4 items-center">
              <p className="w-28 text-grayColor text-sm font-medium font-mon ">
                Rate Type{" "}
                {department === enumConstant.FOREIGN ? (
                  <span className="text-red-500">*</span>
                ) : null}
              </p>

              <DropDown
                options={rateType}
                onSelect={handleSelectRate}
                width="w-72"
                sval={selectedRateType}
                hint="Rate type"
                disable={currencyCode === "BDT"}
              />
            </div>
          </div>

          <div className=" w-full flex flex-row justify-between items-center">
            <div className="flex flex-row space-x-4 items-center">
              <p className="w-28 text-grayColor text-sm font-medium font-mon ">
                Rate Date{" "}
                {department === enumConstant.FOREIGN ? (
                  <span className="text-red-500">*</span>
                ) : null}
              </p>

              <div className=" w-72">
                <DateRangePicker
                  onChange={handleRateDateChange}
                  width="w-72"
                  placeholder="DD/MM/YYYY"
                  value={rateDate}
                  signle={true}
                  useRange={false}
                  disable={currencyCode === "BDT"}
                />
              </div>
            </div>

            <div className="flex flex-row space-x-4 items-center">
              <p className="w-28 text-grayColor text-sm font-medium font-mon">
                Conv. Rate{" "}
                {department === enumConstant.FOREIGN ? (
                  <span className="text-red-500">*</span>
                ) : null}
              </p>
              <CommonInputField
                type="text"
                inputRef={convRateRef}
                hint="Enter Rate"
                onChangeData={onConvRateChange}
                width="w-72"
                disable={currencyCode === "BDT"}
              />
            </div>
          </div>

          <div className=" w-full flex flex-row justify-between items-center">
            <div className="flex flex-row space-x-4 items-center">
              <p className=" w-28  text-grayColor text-sm font-medium font-mon">
                Bill to Address <span className="text-red-500">*</span>
              </p>
              <div className=" w-72  ">
                <CommonDropDownSearch
                  placeholder="Select Bill To Address "
                  onChange={handleBillToFromOracleChange}
                  value={locationBillTo}
                  options={locationList}
                  width="w-full"
                />
              </div>
            </div>

            <div className="flex flex-row space-x-4 items-center">
              <p className=" w-[28] text-grayColor text-[14px] font-medium font-mon">
                Ship to Address <span className="text-red-500">*</span>
              </p>
              <div className=" w-72 ">
                <CommonDropDownSearch
                  placeholder="Select Ship To Address "
                  onChange={handleShipToFromOracleChange}
                  value={locationShipTo}
                  options={locationList}
                  width="w-full"
                />
              </div>
            </div>
          </div>
          <div className="w-full flex flex-row justify-between items-center">
            {/* <div className="flex flex-row space-x-4 items-center">
              <p className="w-28 text-grayColor text-sm font-medium font-mon">
                Invoice Type <span className="text-red-500">*</span>
              </p>
              <DropDown
                options={invoiceTypeListFromoracle}
                onSelect={handleSelectInvoiceType}
                width="w-72"
                sval={selectedInvoiceType}
              />
            </div> */}
            <div className="flex flex-row space-x-4 items-center">
              <p className="w-28 text-grayColor text-sm font-medium font-mon">
                VAT Applicable
              </p>
              <div className=" w-72">
                <button
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

            <div className="flex flex-row space-x-4 items-center">
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
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* <div className="w-full flex flex-row justify-between items-center">
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
                  />
                </div>
              </div>
            )}
          </div> */}
        </div>

        <p className=" text-lg font-semibold font-mon text-blackColor">
          Note <span className="text-red-500 text-base">*</span>
        </p>
        <textarea
          value={note}
          onChange={handleNote}
          className=" border-[1px] border-borderColor w-full h-24 rounded-md p-4 bg-inputBg focus:outline-none "
        />

        <div className=" w-full space-y-4 ">
          <div className="w-full flex flex-row space-x-6 justify-start items-start">
            <CommonButton
              onClick={previousPage}
              titleText={"Previous"}
              width="w-48"
              color=" bg-graishColor "
            />
            {/* {isSaveLoading ? (
              <div className=" w-48 flex justify-center items-center">
                <CircularProgressIndicator />
              </div>
            ) : (
              <CommonButton
                onClick={
                  rfqHeaderDetailsInStore?.details.RFQ_ID === undefined
                    ? saverfq
                    : updateRfq
                }
                titleText={
                  rfqHeaderDetailsInStore?.details.RFQ_ID === undefined
                    ? "Save RFQ"
                    : "Update RFQ"
                }
                width="w-48"
                color=" bg-midGreen "
              />
            )} */}
            <CommonButton
              onClick={submitAndNext}
              titleText={"Continue"}
              width="w-48"
              color=" bg-midGreen "
            />
          </div>
          <div className="w-full flex flex-row space-x-6 justify-start items-start">
            <CommonButton
              onClick={rfqInfo}
              titleText={"Request for Information"}
              width="w-48"
              height="h-8"
              color=" bg-midBlack "
            />
            <CommonButton
              onClick={vatApproval}
              titleText={"Vat Approval"}
              width="w-48"
              height="h-8"
              color="bg-midBlue"
            />
          </div>
        </div>

        <div className=" h-20"></div>
      </div>
      {/* request for more info modal */}

      {rfqIdInStore === null || "" ? (
        <Modal
          icon={<CloudArrowUp size={28} color="#1B4DFF" />}
          size="md"
          show={rfqInfoModal}
          onClose={onClickAdditional}
        >
          {/* <Modal.Header>Describe Your Need</Modal.Header> */}
          <Modal.Body>
            <div className="space-y-3 text-center font-mon">
              <div className="w-[full] flex justify-center items-center rounded-full  ">
                <img
                  src={"/images/warning.png"}
                  alt="warning"
                  className="w20 h-20 mt-2"
                />
              </div>

              <div className="space-y-1">
                <h2 className="">Please save the RFQ first.</h2>

                <h4 className="">Then send the RFI.</h4>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="w-full flex justify-end">
              <Button
                type=""
                className=" h-8 font-mon bg-midGreen text-white "
                onClick={onClickAdditional}
              >
                OK
              </Button>
            </div>

            {/* <Button
              type=""
              className="h-8 bg-midGreen text-white font-mon"
              onClick={sendRfi}
            >
              Confirm
            </Button> */}
          </Modal.Footer>
        </Modal>
      ) : (
        <Modal
          icon={<CloudArrowUp size={28} color="#1B4DFF" />}
          size="md"
          show={rfqInfoModal}
          onClose={onClickAdditional}
        >
          <Modal.Header>Describe Your Need</Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              <div>
                <Textarea
                  id="comment"
                  placeholder="Leave a comment..."
                  withBg={true}
                  color="gray"
                  border={true}
                  rows={3}
                  value={additionalValue}
                  onChange={handleRfqInfoChange}
                />
                <div className=" w-full flex justify-end smallText">
                  {additionalValue.length}/150
                </div>
                {rfiError.rfiNote && (
                  <ValidationError title={rfiError.rfiNote} />
                )}
              </div>

              <div className=" w-full h-10 flex items-center space-x-[0.1px]">
                <input
                  onChange={handleApproverSearch}
                  type="text"
                  className=" flex-1 h-full border-[0.5px] border-borderColor outline-[0.1px] outline-midBlue px-2 placeholder:text-graishColor placeholder:text-sm placeholder:font-mon"
                  placeholder="Search Employee"
                />
                <button
                  disabled={true}
                  className=" px-4 h-full flex justify-center items-center bg-midBlue rounded-[2px]"
                >
                  <SearchIcon className=" text-whiteColor" />
                </button>
              </div>
              <div className=" w-full h-40 overflow-y-auto">
                {approverList.map((e, i) => (
                  <button
                    onClick={() => {
                      handleApproverIdChange(e.USER_ID);
                    }}
                    key={e.USER_ID}
                    className={`w-full h-10 shadow-sm px-2 my-2  border-[1px]   justify-start ${
                      viewerId === e.USER_ID
                        ? " bg-midGreen text-whiteColor font-mon text-sm"
                        : "smallText bg-whiteColor"
                    }  items-center rounded-[2px] flex space-x-1`}
                  >
                    {e.FULL_NAME}
                  </button>
                ))}
              </div>
              {rfiError.viewer && <ValidationError title={rfiError.viewer} />}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="outlineGray"
              className=" h-8 font-mon"
              onClick={onClickAdditional}
            >
              Cancel
            </Button>
            <Button
              type=""
              className="h-8 bg-midGreen text-white font-mon"
              onClick={sendRfi}
            >
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {/* request for more info modal */}

      {rfqIdInStore === null || "" ? (
        <Modal
          icon={<CloudArrowUp size={28} color="#1B4DFF" />}
          size="md"
          show={vatInfoModal}
          onClose={vatOnClickAdditional}
        >
          {/* <Modal.Header>Describe Your Need</Modal.Header> */}
          <Modal.Body>
            <div className="space-y-3 text-center font-mon">
              <div className="w-[full] flex justify-center items-center rounded-full  ">
                <img
                  src={"/images/warning.png"}
                  alt="warning"
                  className="w20 h-20 mt-2"
                />
              </div>

              <div className="space-y-1">
                <h2 className="">Please save the RFQ first.</h2>

                <h4 className="">Then send the RFI.</h4>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="w-full flex justify-end">
              <Button
                type=""
                className=" h-8 font-mon bg-midGreen text-white "
                onClick={vatOnClickAdditional}
              >
                OK
              </Button>
            </div>

            {/* <Button
              type=""
              className="h-8 bg-midGreen text-white font-mon"
              onClick={sendRfi}
            >
              Confirm
            </Button> */}
          </Modal.Footer>
        </Modal>
      ) : (
        <Modal
          icon={<CloudArrowUp size={28} color="#1B4DFF" />}
          size="md"
          show={vatInfoModal}
          onClose={vatOnClickAdditional}
        >
          <Modal.Header>Describe Your Need</Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              <Textarea
                id="comment"
                placeholder="Leave a comment..."
                withBg={true}
                color="gray"
                border={true}
                rows={3}
                value={vatAdditionalValue}
                onChange={handleVatInfoChange}
              />
              <div className=" w-full flex justify-end smallText">
                {vatAdditionalValue.length}/150
              </div>
              {vatError.vatNote && <ValidationError title={vatError.vatNote} />}

              <div className=" w-full h-10 flex items-center space-x-[0.1px]">
                <input
                  onChange={handleApproverSearch}
                  type="text"
                  className=" flex-1 h-full border-[0.5px] border-borderColor outline-[0.1px] outline-midBlue px-2 placeholder:text-graishColor placeholder:text-sm placeholder:font-mon"
                  placeholder="Search Employee"
                />
                <button
                  disabled={true}
                  className=" px-4 h-full flex justify-center items-center bg-midBlue rounded-[2px]"
                >
                  <SearchIcon className=" text-whiteColor" />
                </button>
              </div>
              <div className=" w-full h-40 overflow-y-auto">
                {approverList.map((e, i) => (
                  <button
                    onClick={() => {
                      handleApproverIdChange(e.USER_ID);
                    }}
                    key={e.USER_ID}
                    className={`w-full h-10 shadow-sm px-2 my-2  border-[1px]   justify-start ${
                      viewerId === e.USER_ID
                        ? " bg-midGreen text-whiteColor font-mon text-sm"
                        : "smallText bg-whiteColor"
                    }  items-center rounded-[2px] flex space-x-1`}
                  >
                    {e.FULL_NAME}
                  </button>
                ))}
              </div>
              {vatError.viewer && <ValidationError title={vatError.viewer} />}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="outlineGray"
              className=" h-8 font-mon"
              onClick={vatOnClickAdditional}
            >
              Cancel
            </Button>
            <Button
              type=""
              className="h-8 bg-midGreen text-white font-mon"
              onClick={sendVat}
            >
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
