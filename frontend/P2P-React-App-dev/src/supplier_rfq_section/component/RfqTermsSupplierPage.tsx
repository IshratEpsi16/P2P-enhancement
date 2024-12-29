import React, { useState, useEffect } from "react";
import { useSupplierRfqPageContext } from "../context/SupplierRfqPageContext";
import PageTitle from "../../common_component/PageTitle";
import NavigationPan from "../../common_component/NavigationPan";
import InputLebel from "../../common_component/InputLebel";
import CheckIcon from "../../icons/CheckIcon";
import CommonButton from "../../common_component/CommonButton";
import useSupplierRfqStore from "../store/supplierRfqStore";
import SuccessToast from "../../Alerts_Component/SuccessToast";
import { useAuth } from "../../login_both/context/AuthContext";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import RfqHeaderDetailsService from "../../buyer_section/pr_item_list/service/RfqHeaderDetailsService";
import LogoLoading from "../../Loading_component/LogoLoading";
import useAuthStore from "../../login_both/store/authStore";
import isoToDateTime from "../../utils/methods/isoToDateTime";
import InvoiceTypeListService from "../../buyer_section/buyer_term/service/InvoiceTypeService";
import InvoiceTypeInterface from "../../buyer_section/buyer_term/interface/InvoiceTypeInterface";
import CurrencyListService from "../../registration/service/bank/CurrencyListService";
import FreightTermInterface from "../../buyer_section/buyer_term/interface/FreightTermInterface";
import FreightTermService from "../../buyer_section/buyer_term/service/FreightTermService";
import PaymentTermService from "../../buyer_section/buyer_term/service/PaymentTermServie";
import PaymentTermInterface from "../../buyer_section/buyer_term/interface/PaymentTermInterface";
import moment from "moment";
import DateRangePicker from "../../common_component/DateRangePicker";
import FilePickerInput from "../../common_component/FilePickerInput";
import LocationListService from "../../buyer_section/buyer_term/service/LocationListService";
import LocationInterface from "../../buyer_section/buyer_term/interface/LocationListInterface";
import CommonDropDownSearch from "../../common_component/CommonDropDownSearch";
import DropDown from "../../common_component/DropDown";
import SupplierSiteInterface from "../../registration/interface/SupplierSiteInterface";
import SiteListService from "../../registration/service/site_creation/SiteListService";
import useSupplierRfqPageStore from "../store/SupplierRfqPageStore";
import usePrItemsStore from "../../buyer_section/pr/store/prItemStore";

const pan = ["Home", "Rfq List", "Rfq Item", "General Terms", "Terms"];

export default function RfqTermsSupplierPage() {
  // const { setSupplierRfqPage } = useSupplierRfqPageContext();
  const { setPageNoRfq } = useSupplierRfqPageStore();
  const previous = async () => {
    setPageNoRfq(3);
  };

  const next = async () => {
    console.log("q date: ", quoteValidDate.startDate);
    if (!quoteValidDate.startDate) {
      showErrorToast("Please select Quote Valid Date");
      return;
    } else if (currencyCode === "") {
      showErrorToast("Please select Currency");
      return;
    } else {
      setToStore();
      setPageNoRfq(5);
    }
  };

  const [termText, setTermText] = useState("");

  const handleInputChange = (e: any) => {
    const inputText = e.target.value;
    if (inputText.length <= 1500) {
      setTermText(inputText);
    } else {
      setTermText(inputText.slice(0, 1500));
    }
  };

  //store
  const {
    rfqTitleInStore,
    setRfqTitleInStore,
    rfqSubjectInStore,
    setRfqSubjectInStore,
    rfqOpenDateInStore,
    setRfqOpenDateInStore,
    rfqCloseDateInStore,
    setRfqCloseDateInStore,
    rfqTypeInStore,
    setRfqTypeInStore,
    prItems,
    setPrItems,
    prItems2,
    setPrItems2,
    needByDateInStore,
    setNeedByDateInStore,
    headerAttachment,
    setHeaderAttachment,
    freightTermInStore,
    setFreightTermInStore,
    freightTermNameInStore,
    setFreightTermNameInStore,
    paymentTermInStore,
    setPaymentTermInStore,
    paymentTermNameInStore,
    setPaymentTermNameInStore,
    fobInStore,
    setFobInStore,
    buyerAttachmentInStore,
    setBuyerAttachmentInStore,
    currencyInStore,
    setCurrencyInStore,
    etrInStore,
    setEtrInStore,
    billToAddressInStore,
    setBillToAddressInStore,
    shipToAddressInStore,
    setShipToAddressInStore,
    invoiceTypeInstore,
    setInvoiceTypeInStore,
    invoiceTypeNameInstore,
    setInvoiceTypeNameInStore,
    vatApplicableStatusInStore,
    setVatApplicableStatusInStore,
    vatPercentageInStore,
    setVatPercentageInStore,
    noteInStore,
    setNoteInStore,
    totalprItemNumberInStore,
    setTotalprItemNumberInStore,
    rfqDetailsInStore,
    setRfqDetailsInStore,
    selectedGeneralterm,
    setSelectedGeneralterm,
    invitedSuppliers,
    setInvitedSuppliers,
    invitedSuppliers2,
    setInvitedSuppliers2,
    isCreateRfq,
    setIsCreateRfq,
    rfqIdInStore,
    setRfqIdInStore,
    rfqHeaderDetailsInStore,
    setRfqHeaderDetailsInStore,
    rfqStatusInStore,
    setRfqStatusInStore,
    setSupplierBillToAddressCode,
    setSupplierBillToAddressName,
    setSupplierCurrencyCode,
    setSupplierCurrencyName,
    setSupplierTermAttachmentFile,
    setSupplierTermAttachmentFileName,
    setQuoteValidDateInStore,
    setQuoteValidDateInStoreForShow,
    setSupplierNoteToBuyer,
    rfqResponseStatusInStore,
  } = useSupplierRfqStore();

  const { rfqObjectDetailsInStore } = usePrItemsStore();

  //store

  //auth context
  const { token } = useAuth();
  //auth context

  //store2
  const { loggedInUserName } = useAuthStore();
  //store2

  useEffect(() => {
    console.log("object: ", rfqObjectDetailsInStore);
    console.log("rfqResponse: ", rfqResponseStatusInStore);

    getHeaderDetails();
    getCurrency();
    getFreightTerm();
    getPaymentTerm();

    getSitelist();
  }, []);

  //site list
  interface LocationFromOracle {
    value: string;
    label: string;
  }
  const [siteList, setSiteList] = useState<LocationFromOracle[] | []>([]);
  const [selectedSite, setSelectedSite] = useState<LocationFromOracle | null>(
    null
  );
  const [selectedSiteId, setSelectedSiteId] = useState<string>("");
  const [isSiteLoading, setIsSiteLoading] = useState<boolean>(false);
  const getSitelist = async () => {
    try {
      setIsSiteLoading(true);
      const result = await SiteListService(token!);
      if (result.data.status === 200) {
        const transformedData = result.data.data.map(
          (item: SupplierSiteInterface) => ({
            value: item.ID,
            label: item.ADDRESS_LINE1,
          })
        );
        setSiteList(transformedData);
        console.log(result.data.data);
        setIsSiteLoading(false);
      } else {
        showErrorToast(result.data.message);
        setIsSiteLoading(false);
      }
    } catch (error) {
      showErrorToast("Something went wrong");
      setIsSiteLoading(false);
    }
  };

  const handleSiteChange = (value: any) => {
    // console.log("value:", value);
    setSelectedSite(value);
    if (value !== null) {
      console.log(value.value);
      //   getBranch(value.value);
      setSelectedSiteId(value.value);
      setSupplierBillToAddressName(value.label);

      //   getBank(value.value);
    } else if (value == null && siteList != null) {
      setSelectedSiteId("");
      console.log("cleared");
    }
  };

  //site list

  const [siteNameSupplier, setSiteNameSupplier] = useState<string>("");

  useEffect(() => {
    if (rfqResponseStatusInStore === 4 || rfqResponseStatusInStore === 5) {
      setSupplierTermData();
    }
  }, []);

  const setSupplierTermData = () => {
    if (rfqObjectDetailsInStore) {
      console.log("rfq: ", rfqObjectDetailsInStore);

      setCurrencyCode(rfqObjectDetailsInStore.CURRENCY_CODE);
      // setSiteNameSupplier(rfqObjectDetailsInStore.ADDRESS_LINE1);
      // NOTE_TO_BUYER
      setTermText(rfqObjectDetailsInStore.NOTE_TO_BUYER);

      setFormattedQuoteValidDate(
        rfqObjectDetailsInStore?.QUOT_VALID_DATE
          ? moment(rfqObjectDetailsInStore.QUOT_VALID_DATE).format("DD-MMM-YY HH:mm:ss")
          : ''
      );

      const currentYear = new Date().getFullYear();


      if (rfqObjectDetailsInStore?.QUOT_VALID_DATE != null) {
        const needByDate = rfqObjectDetailsInStore?.QUOT_VALID_DATE;

        // Check if tradeOrExportLicenseStartDate is not null before creating a new Date object
        const dateValue = new Date(needByDate!);
        setQuoteValidDate({
          startDate: dateValue,
          endDate: new Date(currentYear, 11, 31), // Set the endDate to the end of the current year
        });

        setQuoteValidDateInStore(rfqObjectDetailsInStore?.QUOT_VALID_DATE);

        //setiing for sendin to api
        //  setAddUpdateEndDate(moment(data?.TRADE_OR_EXPORT_LICENSE_END_DATE).format("YYYY-MM-DD"))
      }
    }
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // rfqHeader details

  const getHeaderDetails = async () => {
    try {
      const result = await RfqHeaderDetailsService(token!, rfqIdInStore!); //rfwIdInStore
      if (result.data.status === 200) {
        setRfqHeaderDetailsInStore(result.data);
        getInvoiceType();
        setIsLoading(false);
      } else {
        showErrorToast(result.data.message);
        setIsLoading(false);
      }
    } catch (error) {
      showErrorToast("Rfq Header Details Load Failed");
      setIsLoading(false);
    }
  };
  // rfqHeader details

  //invoice
  const [invoiceList, setInvoiceList] = useState<InvoiceTypeInterface[] | []>(
    []
  );

  const [invoiceTypeName, setInvoiceTypeName] = useState<string>("");

  const getInvoiceType = async () => {
    try {
      const result = await InvoiceTypeListService(token!);
      console.log(result.data);

      if (result.data.status === 200) {
        setInvoiceList(result.data.data);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Invoice type load failed");
    }
  };

  //invoice

  //currency

  interface CurrencyData {
    CURRENCY_CODE: string;
    NAME: string;
  }

  const [currencyList, setCurrencyList] = useState<CurrencyData[] | []>([]);
  const [selectedCurrencyName, setSelectedCurrencyName] = useState<string>("");
  interface CurrencyFromOracle {
    value: string;
    label: string;
  }
  const [currencyListFromOracle, setCurrencyListFromOracle] = useState<
    CurrencyFromOracle[] | []
  >([]);
  const getCurrency = async () => {
    try {
      const result = await CurrencyListService(token!);
      console.log(result.data);

      if (result.data.status === 200) {
        setCurrencyList(result.data.data);
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
    // Do something with the selected value
  };

  //currency

  //freight term

  const [freightTermList, setFreightTermList] = useState<
    FreightTermInterface[] | []
  >([]);
  const [selectedFreightTermName, setSelectedFreightTermName] =
    useState<string>("");

  const getFreightTerm = async () => {
    try {
      const result = await FreightTermService(token!);
      console.log(result.data);

      if (result.data.status === 200) {
        // const transformedData = result.data.data.map(
        //   (item: FreightTermInterface) => ({
        //     value: item.LOOKUP_CODE,
        //     label: item.MEANING,
        //   })
        // );

        // setFreightTermFromoracle(transformedData);
        setFreightTermList(result.data.data);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Freight term load failed");
    }
  };

  //freight term

  //payment term

  const [paymentTermList, setPaymentTermList] = useState<
    PaymentTermInterface[] | []
  >([]);
  const [selectedPaymentTermName, setSelectedPaymentTermName] = useState("");

  const getPaymentTerm = async () => {
    try {
      const result = await PaymentTermService(token!);
      console.log(result.data);

      if (result.data.status === 200) {
        setPaymentTermList(result.data.data);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Freight term load failed");
    }
  };

  //payment term

  //need by date

  const [formatedQuoteValidDate, setFormattedQuoteValidDate] =
    useState<string>("");

  const [quoteValidDate, setQuoteValidDate] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: new Date(new Date().getFullYear(), 11, 31), // Set the endDate to the end of the current year
  });

  const handleQuoteValidDateChange = (newValue: any) => {
    const today = moment().startOf("day"); // Today's date with time set to 00:00
    const selectedDate = moment(newValue.startDate); // The selected date from the picker

    // Check if the selected date is before today
    if (selectedDate.isBefore(today)) {
      showErrorToast(
        "Invalid date selection: Please select today's date or a future date."
      );

      setQuoteValidDate({
        startDate: null,
        endDate: null,
      });
      setFormattedQuoteValidDate("");

      return;
    }

    setQuoteValidDate(newValue);
    // Handle the selected date here
    console.log(moment(newValue.startDate).format("DD-MMM-YY HH:mm:ss"));
    setFormattedQuoteValidDate(
      moment(newValue.startDate).format("DD-MMM-YY HH:mm:ss")
    );
    setQuoteValidDateInStoreForShow(
      moment(newValue.startDate).format("DD-MMM-YY")
    );
  };

  //need by date

  //file

  const [supplierAttachmentFile, setSupplierAttachmentFile] =
    useState<File | null>(null);
  const handleSupplierAttachmentLicense = (file: File | null) => {
    if (file) {
      console.log("Selected file:", file);
      setSupplierAttachmentFile(file);
    } else {
      // No file selected
      console.log("No file selected");
    }
  };

  const setToStore = () => {
    setSupplierBillToAddressCode(rfqObjectDetailsInStore!.SITE_ID.toString());
    setSupplierCurrencyCode(currencyCode);
    setSupplierTermAttachmentFile(supplierAttachmentFile);
    setSupplierTermAttachmentFileName(supplierAttachmentFile?.name!);
    setQuoteValidDateInStore(formatedQuoteValidDate);
    setSupplierNoteToBuyer(termText);
  };
  //header attachment

  // const [locationList, setLocationList] = useState<LocationFromOracle[]>([]);

  // const [locationBillTo, setLocationBillTo] =
  //   useState<LocationFromOracle | null>(null);
  // const [locationShipTo, setLocationShipTo] =
  //   useState<LocationFromOracle | null>(null);

  // const [locationCodeBillTo, setLocationCodeBillTo] = useState<string>("");

  // const handleBillToFromOracleChange = (value: any) => {
  //   // console.log("value:", value);
  //   setLocationBillTo(value);
  //   if (value !== null) {
  //     console.log(value.value);
  //     //   getBranch(value.value);
  //     setLocationCodeBillTo(value.value);

  //     //   getBank(value.value);
  //   } else if (value == null && locationList != null) {
  //     setLocationCodeBillTo("");
  //     console.log("cleared");
  //   }
  // };

  // const getLocation = async () => {
  //   try {
  //     const result = await LocationListService(token!);
  //     console.log(result.data);

  //     if (result.data.status === 200) {
  //       const transformedData = result.data.data.map(
  //         (item: LocationInterface) => ({
  //           value: item.LOCATION_ID,
  //           label: item.LOCATION_CODE,
  //         })
  //       );

  //       setLocationList(transformedData);
  //     } else {
  //       showErrorToast(result.data.message);
  //     }
  //   } catch (error) {
  //     showErrorToast("Currency location failed");
  //   }
  // };

  useEffect(() => {
    console.log("setted", rfqHeaderDetailsInStore);

    setData();
  }, [invoiceList, currencyList, freightTermList, paymentTermList]);

  const setData = () => {
    if (
      rfqHeaderDetailsInStore &&
      invoiceList.length > 0 &&
      currencyList.length > 0
    ) {
      const details = rfqHeaderDetailsInStore.details;
      const findVoice = invoiceList.find(
        (item: InvoiceTypeInterface) =>
          item.LOOKUP_CODE === details.INVOICE_TYPE!
      );
      console.log(findVoice);

      if (findVoice) {
        setInvoiceTypeName(findVoice!.MEANING);
      } else {
        setInvoiceTypeName("N/A");
      }

      const findCurrency = currencyList.find(
        (item: CurrencyData) => item.CURRENCY_CODE === details.CURRENCY_CODE
      );
      if (findCurrency) {
        setSelectedCurrencyName(findCurrency.NAME);
      } else {
        setSelectedCurrencyName("N/A");
      }

      const freightTerm = freightTermList.find(
        (item: FreightTermInterface) =>
          item.LOOKUP_CODE === details.FREIGHT_TERM
      );
      if (freightTerm) {
        setSelectedFreightTermName(freightTerm.MEANING);
      } else {
        setSelectedFreightTermName("N/A");
      }

      const findPaymentterm = paymentTermList.find(
        (item: PaymentTermInterface) =>
          item.TERM_ID.toString() === details.PAYMENT_TERM_ID.toString()
      );
      if (findPaymentterm) {
        setSelectedPaymentTermName(findPaymentterm.NAME);
      } else {
        setSelectedPaymentTermName("N/A");
      }
    }
  };

  return (
    <div className=" bg-white m-8">
      <SuccessToast />
      {isSiteLoading ? (
        <div className=" w-full flex justify-center items-center">
          <LogoLoading />
        </div>
      ) : (
        <>
          <div>
            <PageTitle titleText="Supplier General Terms" />
            {/* <NavigationPan list={pan} /> */}
          </div>
          {isLoading ? (
            <div className=" w-full flex justify-center items-center">
              <LogoLoading />
            </div>
          ) : (
            <>
              <div className=" mt-4"></div>
              <InputLebel titleText={"Header"} />

              <div className=" grayCard p-8 flex w-full space-x-16">
                <div className=" flex-1 flex-col space-y-2 w-full items-start">
                  <div className=" w-full flex space-x-2 items-center ">
                    <div className=" text-sm w-44 text-graishColor font-mon font-medium">
                      RFQ ID :
                    </div>
                    <div className="text-sm text-midBlack font-mon font-medium">
                      {rfqHeaderDetailsInStore?.details.RFQ_ID}
                    </div>
                  </div>
                  <div className="text-sm w-full flex space-x-2 items-center ">
                    <div className="text-sm w-44 text-graishColor font-mon font-medium">
                      Supplier Name :
                    </div>
                    <div className="text-sm text-midBlack font-mon font-medium">
                      {loggedInUserName}
                    </div>
                  </div>
                  <div className="text-sm w-full flex space-x-2 items-center ">
                    <div className=" w-44 text-graishColor font-mon font-medium">
                      Total Amount :
                    </div>
                    <div className="text-sm text-midBlack font-mon font-medium">
                      N/A
                    </div>
                  </div>

                  <div className=" w-full flex space-x-2 items-center ">
                    <div className=" text-sm w-44 text-graishColor font-mon font-medium">
                      Organization :
                    </div>
                    <div className="text-sm text-midBlack font-mon font-medium">
                      {rfqHeaderDetailsInStore?.details.OU_DETAILS?.NAME}
                    </div>
                  </div>
                </div>
                <div className=" flex-1 flex-col space-y-2 w-full items-start">
                  <div className=" w-full flex space-x-2 items-center ">
                    <div className=" text-sm w-44 text-graishColor font-mon font-medium">
                      Open date :
                    </div>
                    <div className="text-sm text-midBlack font-mon font-medium">
                      {isoToDateTime(
                        rfqHeaderDetailsInStore?.details.OPEN_DATE!
                      )}
                    </div>
                  </div>
                  <div className="text-sm w-full flex space-x-2 items-center ">
                    <div className="text-sm w-44 text-graishColor font-mon font-medium">
                      Close Date :
                    </div>
                    <div className="text-sm text-midBlack font-mon font-medium">
                      {isoToDateTime(
                        rfqHeaderDetailsInStore?.details.CLOSE_DATE!
                      )}
                    </div>
                  </div>
                  <div className="text-sm w-full flex space-x-2 items-center ">
                    <div className="text-sm w-44 text-graishColor font-mon font-medium">
                      Attachment :
                    </div>
                    <div className="text-sm text-midBlack font-mon font-medium">
                      <a
                        href={`${rfqHeaderDetailsInStore?.header_file_path}/${rfqHeaderDetailsInStore?.details.RFQ_ATTACHMENT_FILE_NAME}`}
                        target="blank"
                        className="  border-dashed border-[1px] border-borderColor py-1 px-4 rounded-md "
                      >
                        view
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" mt-6"></div>
              <InputLebel titleText={"Buyer Terms"} />
              <div className=" grayCard p-8 flex w-full space-x-16">
                <div className=" flex-1 flex-col space-y-2 w-full items-start">
                  <div className=" w-full flex space-x-2 items-center ">
                    <div className=" text-sm w-44 text-graishColor font-mon font-medium">
                      Bill to Address :
                    </div>
                    <div className="text-sm text-midBlack font-mon font-medium">
                      {rfqHeaderDetailsInStore?.details.BILL_TO_LOCATION_NAME!}
                    </div>
                  </div>
                  <div className="text-sm w-full flex space-x-2 items-center ">
                    <div className="text-sm w-44 text-graishColor font-mon font-medium">
                      Ship to Address :
                    </div>
                    <div className="text-sm text-midBlack font-mon font-medium">
                      {rfqHeaderDetailsInStore?.details.SHIP_TO_LOCATION_NAME!}
                    </div>
                  </div>
                  {/* <div className="text-sm w-full flex space-x-2 items-center ">
                    <div className=" w-44 text-graishColor font-mon font-medium">
                      FOB :
                    </div>
                    <div className="text-sm text-midBlack font-mon font-medium">
                      N/A
                    </div>
                  </div> */}
                  <div className="text-sm w-full flex space-x-2 items-center ">
                    <div className=" w-44 text-graishColor font-mon font-medium">
                      Currency :
                    </div>
                    <div className="text-sm text-midBlack font-mon font-medium">
                      {selectedCurrencyName}
                    </div>
                  </div>
                  {/* <div className="text-sm w-full flex space-x-2 items-center ">
                    <div className=" w-44 text-graishColor font-mon font-medium">
                      Invoice Type :
                    </div>
                    <div className="text-sm text-midBlack font-mon font-medium">
                      {invoiceTypeName}
                    </div>
                  </div> */}
                  <div className="text-sm w-full flex space-x-2 items-center ">
                    <div className=" w-44 text-graishColor font-mon font-medium">
                      Freight/Inco Terms :
                    </div>
                    <div className="text-sm text-midBlack font-mon font-medium">
                      {selectedFreightTermName}
                    </div>
                  </div>

                  <div className="text-sm w-full flex space-x-[88px] items-center ">
                    <div className="text-sm w-44  text-graishColor font-mon font-medium">
                      Note :
                    </div>
                    <div className="text-sm w-full  text-start text-midBlack font-mon font-medium">
                      {rfqHeaderDetailsInStore?.details.NOTE_TO_SUPPLIER}
                    </div>
                  </div>
                </div>
                <div className=" flex-1 flex-col space-y-2 w-full items-start">
                  <div className=" w-full flex space-x-2 items-center ">
                    <div className=" text-sm w-44 text-graishColor font-mon font-medium">
                      Payment Term :
                    </div>
                    <div className="text-sm text-midBlack font-mon font-medium">
                      {/* <button className="  border-dashed border-[1px] border-borderColor h-6 w-20 rounded-md ">
                    view
                  </button> */}
                      {selectedPaymentTermName}
                    </div>
                  </div>
                  <div className="text-sm w-full flex space-x-2 items-center ">
                    <div className="text-sm w-44 text-graishColor font-mon font-medium">
                      Attachment :
                    </div>
                    <div className="text-sm text-midBlack font-mon font-medium">
                      <a
                        href={`${rfqHeaderDetailsInStore?.header_term_file_path}/${rfqHeaderDetailsInStore?.details.BUYER_ATTACHMENT_FILE_NAME}`}
                        target="blank"
                        className="  border-dashed border-[1px] border-borderColor py-1 px-4 rounded-md "
                      >
                        view
                      </a>
                    </div>
                  </div>
                  <div className="text-sm w-full flex space-x-2 items-center ">
                    <div className="text-sm w-44 text-graishColor font-mon font-medium">
                      ETR/ETD :
                    </div>
                    <div className="text-sm text-midBlack font-mon font-medium">
                      {moment(rfqHeaderDetailsInStore?.details.ETR).format(
                        "DD-MMMM-YYYY"
                      )}
                    </div>
                  </div>
                  <div className="text-sm w-full flex space-x-2 items-center ">
                    <div className="text-sm w-44 text-graishColor font-mon font-medium">
                      VAT Applicable :
                    </div>
                    <div className="text-sm text-midBlack font-mon font-medium">
                      <button
                        className={`h-4 w-4 rounded-md flex justify-center items-center   ${
                          rfqHeaderDetailsInStore?.details
                            .VAT_APPLICABLE_STATUS === "Y"
                            ? " bg-midGreen border-none"
                            : "border-[1px] border-borderColor bg-white"
                        }`}
                      >
                        <img
                          src="/images/check.png"
                          alt="check"
                          className=" w-2 h-2"
                        />
                      </button>
                    </div>
                  </div>
                  {/* <div className="text-sm w-full flex space-x-2 items-center ">
                    <div className="text-sm w-44 text-graishColor font-mon font-medium">
                      VAT/TAX :
                    </div>
                    <div className="text-sm text-midBlack font-mon font-medium">
                      {rfqHeaderDetailsInStore?.details.VAT_RATE}%
                    </div>
                  </div> */}
                  {/* <div className="text-sm w-full flex space-x-[88px] items-center ">
                    <div className="text-sm w-44  text-graishColor font-mon font-medium">
                      Note :
                    </div>
                    <div className="text-sm w-full  text-start text-midBlack font-mon font-medium">
                      {rfqHeaderDetailsInStore?.details.NOTE_TO_SUPPLIER}
                    </div>
                  </div> */}
                </div>
              </div>
              <div className=" mt-4"></div>
              <InputLebel titleText={"Supplier Terms"} />
              <div className=" mt-4"></div>
              <div className=" grayCard p-8 flex w-full space-x-16">
                <div className=" flex-1 flex-col space-y-2 w-full items-start">
                  <div className=" w-full flex space-x-2 items-center ">
                    <div className=" text-sm w-44 text-graishColor font-mon font-medium">
                      Bill to Address :
                    </div>
                    <div className="text-sm text-midBlack font-mon font-medium">
                      <div className=" w-60  ">
                        {/* <CommonDropDownSearch
                          placeholder="Select Bill To Address "
                          onChange={handleSiteChange}
                          value={selectedSite}
                          options={siteList}
                          width="w-full"
                        /> */}

                        {rfqObjectDetailsInStore!.ADDRESS_LINE1}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm w-full flex space-x-2 items-center ">
                    <div className="text-sm w-44 text-graishColor font-mon font-medium">
                      Currency : <span className="text-red-500">*</span>
                    </div>
                    <div className="text-sm text-midBlack font-mon font-medium">
                      <DropDown
                        options={currencyListFromOracle}
                        onSelect={handleSelectCurrency}
                        sval={currencyCode}
                        width="w-60"
                      />
                    </div>
                  </div>
                </div>
                <div className=" flex-1 flex-col space-y-2 w-full items-start">
                  <div className=" w-full flex space-x-2 items-center ">
                    <div className=" text-sm w-44 text-graishColor font-mon font-medium">
                      Quote valid date : <span className="text-red-500">*</span>
                    </div>
                    <div className="text-sm text-midBlack font-mon font-medium">
                      <div className="w-60">
                        <DateRangePicker
                          onChange={handleQuoteValidDateChange}
                          width="w-60"
                          placeholder="DD/MM/YYYY"
                          value={quoteValidDate}
                          signle={true}
                          useRange={false}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-sm w-full flex space-x-2 items-center ">
                    <div className="text-sm w-44 text-graishColor font-mon font-medium">
                      Attachment :
                    </div>
                    <div className="text-sm text-midBlack font-mon font-medium">
                      <div className="w-60 h-10">
                        <FilePickerInput
                          onFileSelect={handleSupplierAttachmentLicense}
                          mimeType=".pdf, image/*"
                          maxSize={2 * 1024 * 1024}
                          width="w-full"
                          // initialFileName={headerFileInitailName}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" mt-4"></div>
              <InputLebel titleText={"Note"} />
              <div className=" mt-2"></div>
              <textarea
                value={termText}
                onChange={handleInputChange}
                className="w-full h-32 bg-inputBg mt-2 rounded-md shadow-sm focus:outline-none p-8 border-[1px] border-borderColor"
              />
              <div className=" mt-4"></div>
              <div className=" w-full flex flex-row justify-end space-x-6 my-10">
                <CommonButton
                  titleText={"Previous"}
                  onClick={previous}
                  width="w-36"
                  color="bg-graishColor"
                  height="h-8"
                />
                <CommonButton
                  titleText={"Preview"}
                  onClick={next}
                  width="w-36"
                  color="bg-midGreen"
                  height="h-8"
                />
              </div>
              <div className=" h-20"></div>
            </>
          )}
        </>
      )}
    </div>
  );
}
