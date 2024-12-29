import React, { useState, useEffect } from "react";
import { useSupplierRfqPageContext } from "../context/SupplierRfqPageContext";
import CommonButton from "../../common_component/CommonButton";
import { InputLabel } from "@mui/material";
import InputLebel from "../../common_component/InputLebel";
import CheckIcon from "../../icons/CheckIcon";
import PageTitle from "../../common_component/PageTitle";
import NavigationPan from "../../common_component/NavigationPan";
import { useSupplierRfqIdContext } from "../context/SupplierRfqIdContext";
import useSupplierRfqStore from "../store/supplierRfqStore";
import { useAuth } from "../../login_both/context/AuthContext";
import useAuthStore from "../../login_both/store/authStore";
import SiteListService from "../../registration/service/site_creation/SiteListService";
import SupplierSiteInterface from "../../registration/interface/SupplierSiteInterface";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import RfqHeaderDetailsService from "../../buyer_section/pr_item_list/service/RfqHeaderDetailsService";
import InvoiceTypeInterface from "../../buyer_section/buyer_term/interface/InvoiceTypeInterface";
import InvoiceTypeListService from "../../buyer_section/buyer_term/service/InvoiceTypeService";
import CurrencyListService from "../../registration/service/bank/CurrencyListService";
import FreightTermInterface from "../../buyer_section/buyer_term/interface/FreightTermInterface";
import FreightTermService from "../../buyer_section/buyer_term/service/FreightTermService";
import PaymentTermInterface from "../../buyer_section/buyer_term/interface/PaymentTermInterface";
import PaymentTermService from "../../buyer_section/buyer_term/service/PaymentTermServie";
import moment from "moment";
import FilePickerInput from "../../common_component/FilePickerInput";
import DateRangePicker from "../../common_component/DateRangePicker";
import DropDown from "../../common_component/DropDown";
import CommonDropDownSearch from "../../common_component/CommonDropDownSearch";
import isoToDateTime from "../../utils/methods/isoToDateTime";
import LogoLoading from "../../Loading_component/LogoLoading";
import SelectedRfqItemInterface from "../inteface/SelectedRfqItemInterface";
import UpdateRfqQuotationService from "../service/UpdateRfqQuotationService";
import { showSuccessToast } from "../../Alerts_Component/SuccessToast";
import SupplierQuotationStatusUpdateService from "../service/SupplierQuotationStatusUpdateService";
import useSupplierRfqPageStore from "../store/SupplierRfqPageStore";
import RfqListQuotationStatusUpdateService from "../service/RfqListQuotationStatusUpdateService";
import usePrItemsStore from "../../buyer_section/pr/store/prItemStore";
const pan = [
  "Home",
  "Rfq List",
  "Rfq Item",
  "General Terms",
  "Terms",
  "Preview",
];
export default function ReviewQuotationPage() {
  // const { setSupplierRfqPage } = useSupplierRfqPageContext();
  const { selectedRfq, setSelectedRfq } = useSupplierRfqIdContext();
  const { setPageNoRfq } = useSupplierRfqPageStore();
  // const { selectedRfq, setSelectedRfq } = useSupplierRfqIdContext();

  const isCloseDatePassed =
    selectedRfq?.CLOSE_DATE && new Date(selectedRfq.CLOSE_DATE) < new Date();

  const previous = async () => {
    setPageNoRfq(4);
  };
  const submitQuotation = async () => {
    // setSupplierRfqPage(5);
  };

  // const [termText, setTermText] = useState("");

  // const handleInputChange = (e: any) => {
  //   const inputText = e.target.value;
  //   if (inputText.length <= 1500) {
  //     setTermText(inputText);
  //   } else {
  //     setTermText(inputText.slice(0, 1500));
  //   }
  // };

  // const { setSupplierRfqPage } = useSupplierRfqPageContext();

  // const previous = async () => {
  //   setSupplierRfqPage(3);
  // };
  // const next = async () => {
  //   setSupplierRfqPage(5);
  // };
  useEffect(() => {
    console.log(new Date(selectedRfq!.CLOSE_DATE));
    console.log(new Date());

    console.log(isCloseDatePassed);
  }, []);

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
    isGeneralTermAgree,
    supplierBillToAddressCode,
    supplierBillToAddressName,
    supplierCurrencyCode,
    supplierCurrencyName,
    supplierTermAttachmentFile,
    supplierTermAttachmentFileName,
    quoteValidDateInStore,
    quoteValidDateInStoreForShow,
    supplierNoteToBuyer,
    setRfqItems,

    rfqItems,
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

    console.log("quote date: ", quoteValidDateInStore);

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

      //   getBank(value.value);
    } else if (value == null && siteList != null) {
      setSelectedSiteId("");
      console.log("cleared");
    }
  };

  //site list

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
  const [currencyName, setCurrencyName] = useState<string>("");
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
        // const findCurrency = transformedData.map(
        //   (item: CurrencyFromOracle) =>
        //     item.value.toString() === supplierCurrencyCode.toString()
        // );
        // console.log(supplierCurrencyCode.toString());

        // console.log(findCurrency);
        // setCurrencyName(findCurrency.label);
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
    setQuoteValidDate(newValue);
    // Handle the selected date here
    console.log(moment(newValue.startDate).format("DD-MMM-YY HH:mm:ss"));
    setFormattedQuoteValidDate(
      moment(newValue.startDate).format("DD-MMM-YY HH:mm:ss")
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
    console.log("setted");
    console.log("rfqTypeInStore: ", rfqTypeInStore);

    setData();
  }, [invoiceList, currencyList, freightTermList, paymentTermList]);

  console.log("items: ", rfqItems);

  const setData = () => {
    if (
      rfqHeaderDetailsInStore &&
      invoiceList.length > 0 &&
      currencyList.length > 0
    ) {
      setTermText(supplierNoteToBuyer);
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
      const findCurrency2 = currencyList.find(
        (item: CurrencyData) => item.CURRENCY_CODE === supplierCurrencyCode
      );

      if (findCurrency) {
        setSelectedCurrencyName(findCurrency.NAME);
      } else {
        setSelectedCurrencyName("N/A");
      }
      if (findCurrency2) {
        setCurrencyName(findCurrency2.NAME);
      } else {
        setCurrencyName("N/A");
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

  //from ridoy

  const submitNext = async () => {
    console.log(rfqIdInStore);
    console.log(rfqItems);

    if (rfqItems.length > 0) {
      for (let i = 0; i < rfqItems.length; i++) {
        // console.log(rfqId);
        console.log(rfqItems[i]);

        updateRfqQuotation(rfqIdInStore!, rfqItems[i]);
      }
      updateStatus();
      showSuccessToast("Submitted Successfully");
      setRfqTypeInStore("");
      setRfqTypeInStore(null);
      setSelectedRfq(null);
      // setPageNoRfq(5);
      setPageNoRfq(1);
    }
  };
  const save = async () => {
    console.log(rfqIdInStore);
    console.log(rfqItems);

    if (rfqItems.length > 0) {
      for (let i = 0; i < rfqItems.length; i++) {
        // console.log(rfqId);
        console.log(rfqItems[i]);

        saveRfqQuotation(rfqIdInStore!, rfqItems[i]);
      }
      saveStatus();
      showSuccessToast("Save Successfully");
      setRfqTypeInStore("");
      setRfqTypeInStore(null);
      setSelectedRfq(null);
      // setPageNoRfq(5);
      setPageNoRfq(1);
    }
  };

  //update rfq item
  const updateRfqQuotation = async (
    rfqId: number,
    rfqItem: SelectedRfqItemInterface
  ) => {
    try {
      const result = await UpdateRfqQuotationService(
        token!,
        rfqId,
        "SUBMIT",
        rfqItem
      );
      console.log(result.data);
      console.log(rfqId);

      if (result.data.status === 200) {
      } else {
      }
    } catch (error) {
      console.log(error);
      showErrorToast("Quotation Update Failed");
    }
  };
  //update rfq item
  //update rfq item
  const saveRfqQuotation = async (
    rfqId: number,
    rfqItem: SelectedRfqItemInterface
  ) => {
    try {
      const result = await UpdateRfqQuotationService(
        token!,
        rfqId,
        "SAVE",
        rfqItem
      );
      console.log(result.data);
      console.log(rfqId);

      if (result.data.status === 200) {
      } else {
      }
    } catch (error) {
      console.log(error);
      showErrorToast("Quotation Update Failed");
    }
  };
  //update rfq item

  //supplier-rfq/quotation-status-update

  const updateStatus = async () => {
    try {
      const result = await SupplierQuotationStatusUpdateService(
        token!,
        rfqIdInStore!,
        4,
        "SUBMIT",
        supplierTermAttachmentFile,
        supplierTermAttachmentFileName,
        quoteValidDateInStore,
        supplierBillToAddressCode,
        supplierCurrencyCode,
        supplierNoteToBuyer
      );
      if (result.data.status === 200) {
        const res = await RfqListQuotationStatusUpdateService(
          token!,
          selectedRfq?.RFQ_ID!,
          4,
          "SUBMIT"
        );
      }
      console.log(result.data);
    } catch (error) {}
  };
  const saveStatus = async () => {
    try {
      const result = await SupplierQuotationStatusUpdateService(
        token!,
        rfqIdInStore!,
        5,
        "SAVE",
        supplierTermAttachmentFile,
        supplierTermAttachmentFileName,
        quoteValidDateInStore,
        supplierBillToAddressCode,
        supplierCurrencyCode,
        supplierNoteToBuyer
      );
      if (result.data.status === 200) {
        const res = await RfqListQuotationStatusUpdateService(
          token!,
          selectedRfq?.RFQ_ID!,
          5,
          "SAVE"
        );
      }
      console.log(result.data);
    } catch (error) {}
  };

  //supplier-rfq/quotation-status-update

  //from ridoy

  return (
    <div className=" bg-white m-8">
      <div>
        <PageTitle titleText="Terms" />
        {/* <NavigationPan list={pan} /> */}
      </div>
      <div className=" mt-4"></div>
      <InputLebel titleText={"Header"} />

      {isSiteLoading ? (
        <div className=" flex justify-center items-center">
          <LogoLoading />
        </div>
      ) : (
        <>
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
            </div>
            <div className=" flex-1 flex-col space-y-2 w-full items-start">
              <div className=" w-full flex space-x-2 items-center ">
                <div className=" text-sm w-44 text-graishColor font-mon font-medium">
                  Open date :
                </div>
                <div className="text-sm text-midBlack font-mon font-medium">
                  {isoToDateTime(rfqHeaderDetailsInStore?.details.OPEN_DATE!)}
                </div>
              </div>
              <div className="text-sm w-full flex space-x-2 items-center ">
                <div className="text-sm w-44 text-graishColor font-mon font-medium">
                  Close Date :
                </div>
                <div className="text-sm text-midBlack font-mon font-medium">
                  {isoToDateTime(rfqHeaderDetailsInStore?.details.CLOSE_DATE!)}
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
              <div className="text-sm w-full flex space-x-2 items-center ">
                <div className=" w-44 text-graishColor font-mon font-medium">
                  FOB :
                </div>
                <div className="text-sm text-midBlack font-mon font-medium">
                  N/A
                </div>
              </div>
              <div className="text-sm w-full flex space-x-2 items-center ">
                <div className=" w-44 text-graishColor font-mon font-medium">
                  Currency :
                </div>
                <div className="text-sm text-midBlack font-mon font-medium">
                  {selectedCurrencyName}
                </div>
              </div>
              <div className="text-sm w-full flex space-x-2 items-center ">
                <div className=" w-44 text-graishColor font-mon font-medium">
                  Invoice Type :
                </div>
                <div className="text-sm text-midBlack font-mon font-medium">
                  {invoiceTypeName}
                </div>
              </div>
              <div className="text-sm w-full flex space-x-2 items-center ">
                <div className=" w-44 text-graishColor font-mon font-medium">
                  Freight Term :
                </div>
                <div className="text-sm text-midBlack font-mon font-medium">
                  {selectedFreightTermName}
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
                  ETR :
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
                      rfqHeaderDetailsInStore?.details.VAT_APPLICABLE_STATUS ===
                      "Y"
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
              <div className="text-sm w-full flex space-x-2 items-center ">
                <div className="text-sm w-44 text-graishColor font-mon font-medium">
                  VAT/TAX :
                </div>
                <div className="text-sm text-midBlack font-mon font-medium">
                  {rfqHeaderDetailsInStore?.details.VAT_RATE}%
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
                  Currency :
                </div>
                <div className="text-sm text-midBlack font-mon font-medium">
                  {/* <DropDown
                    options={currencyListFromOracle}
                    onSelect={handleSelectCurrency}
                    sval={currencyCode}
                    width="w-60"
                  /> */}
                  <div className=" w-60">{currencyName}</div>
                </div>
              </div>
            </div>
            <div className=" flex-1 flex-col space-y-2 w-full items-start">
              <div className=" w-full flex space-x-2 items-center ">
                <div className=" text-sm w-44 text-graishColor font-mon font-medium">
                  Quote valid date :
                </div>
                <div className="text-sm text-midBlack font-mon font-medium">
                  <div className="w-60">
                    {/* <DateRangePicker
                      onChange={handleQuoteValidDateChange}
                      width="w-60"
                      placeholder="DD/MM/YYYY"
                      value={quoteValidDate}
                      signle={true}
                      useRange={false}
                    /> */}
                    {quoteValidDateInStoreForShow}
                  </div>
                </div>
              </div>
              <div className="text-sm w-full flex space-x-2 items-center ">
                <div className="text-sm w-44 text-graishColor font-mon font-medium">
                  Attachment :
                </div>
                <div className="text-sm text-midBlack font-mon font-medium">
                  <div className="w-60 ">
                    {/* <FilePickerInput
                      onFileSelect={handleSupplierAttachmentLicense}
                      mimeType=".pdf, image/*"
                      maxSize={2 * 1024 * 1024}
                      width="w-full"
                      // initialFileName={headerFileInitailName}
                    /> */}
                    {supplierTermAttachmentFileName}
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

          <div className="overflow-x-auto">
            <table
              className="min-w-full divide-y divide-gray-200 border-[0.2px] border-borderColor rounded-md"
              style={{ tableLayout: "fixed" }}
            >
              <thead className="sticky top-0 bg-[#F4F6F8] h-14">
                <tr>
                  <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  ">
                    SL
                  </th>
                  <th className=" font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                    Org. name
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                    PR No/PR Line No
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                    Item Description
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                    Expected Spec.
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                    Expected Brand Origin
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                    Available Spec.
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                    Available Brand
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                    Available Origin
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                    Need by Date
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                    Promised Date
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                    UOM
                  </th>

                  <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                    Expected quantity
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                    Offered Quantity
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                    Tolerance
                  </th>

                  {rfqTypeInStore === "T" ? null : (
                    <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                      Rate/unit
                    </th> 
                  )}
                  {rfqTypeInStore === "T" ? null : (
                    <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                      VAT
                    </th>
                  )}
                  {rfqTypeInStore === "T" ? null : (
                    <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                      Amount Including VAT
                    </th>
                  )}
                  <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                    Freight Charge Amount
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                    Packing Type
                  </th>
                  {/* <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                    Warranty
                  </th> */}

                  <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                    Warranty Details
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                    Remarks
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                    Attachment
                  </th>

                  {/* Add more header columns as needed */}
                </tr>
              </thead>

              {/* Table rows go here */}
              {/* Table rows go here */}

              {rfqItems.map((rfq, index) => (
                <tbody className="cursor-pointer bg-white divide-y divide-gray-200 odd:bg-[#F4F6F8] even:bg-white ">
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor font-medium">
                    {index + 1}
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    Org. name
                  </td>
                  <td className=" w-64 font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {rfq.PR_NUMBER}
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {rfq.ITEM_DESCRIPTION === "" ? "N/A" : rfq.ITEM_DESCRIPTION}
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {rfq.ITEM_SPECIFICATION === ""
                      ? "N/A"
                      : rfq.ITEM_SPECIFICATION}
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {rfq.EXPECTED_ORIGIN === "" ? "N/A" : rfq.EXPECTED_ORIGIN}
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {rfq.AVAILABLE_SPECS === "" ? "N/A" : rfq.AVAILABLE_SPECS}
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {rfq.AVAILABLE_BRAND_NAME === ""
                      ? "N/A"
                      : rfq.AVAILABLE_BRAND_NAME}
                  </td>
                  {/* <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {rfq.AVAILABLE_ORIGIN === "" ? "N/A" : rfq.AVAILABLE_ORIGIN}
                  </td> */}
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {rfq.COUNTRY_NAME === "" ? "N/A" : rfq.COUNTRY_NAME}
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {rfq.NEED_BY_DATE === ""
                      ? "N/A"
                      : isoToDateTime(rfq.NEED_BY_DATE)}
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {moment(rfq.PROMISE_DATE).format("DD-MMMM-YYYY")}
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {rfq.UNIT_MEAS_LOOKUP_CODE === ""
                      ? "N/A"
                      : rfq.UNIT_MEAS_LOOKUP_CODE}
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {rfq.EXPECTED_QUANTITY === ""
                      ? "N/A"
                      : rfq.EXPECTED_QUANTITY}
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {rfq.OFFERED_QUANTITY === "" ? "N/A" : rfq.OFFERED_QUANTITY}
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {rfq.TOLERANCE === "" ? "N/A" : <p>{rfq.TOLERANCE}%</p>}
                  </td>
                  {rfqTypeInStore === "T" ? null : (
                    <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                      {rfq.UNIT_PRICE === "" ? "N/A" : rfq.UNIT_PRICE}
                    </td>
                  )}
                  {rfqTypeInStore === "T" ? null : (
                    <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                      <p className="flex items-center space-x-1 w-16">
                        <span>
                          {rfq.VAT_VALUE === "" ? "N/A" : rfq.VAT_VALUE}
                        </span>
                        <span className="text-xs">
                          {rfq.VAT_TYPE === ""
                            ? "---"
                            : rfq.VAT_TYPE === "Percentage"
                            ? `${rfq.VAT_AMOUNT} %`
                            : rfq.VAT_AMOUNT}
                        </span>
                      </p>
                    </td>
                  )}
                  {rfqTypeInStore === "T" ? null : (
                    <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                      {rfq.TOTAL_LINE_AMOUNT === ""
                        ? "N/A"
                        : rfq.TOTAL_LINE_AMOUNT}
                    </td>
                  )}
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {rfq.FREIGHT_CHARGE === "" ? "---" : rfq.FREIGHT_CHARGE}
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {rfq.PACKING_TYPE === "" ? "---" : rfq.PACKING_TYPE}
                  </td>
                  {/* <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {rfq.WARRANTY_BY_SUPPLIER === "Y" ? (
                      <div
                        className={` h-4 w-4 rounded-md border-none bg-midGreen flex justify-center items-center`}
                      >
                        <img
                          src="/images/check.png"
                          alt="check"
                          className=" w-2 h-2"
                        />
                      </div>
                    ) : (
                      <div
                        className={` h-4 w-4  rounded-md border-[0.1px] border-borderColor bg-white flex justify-center items-center`}
                      >
                        <img
                          src="/images/check.png"
                          alt="check"
                          className=" w-2 h-2"
                        />
                      </div>
                    )}
                  </td> */}
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {rfq.SUPPLIER_WARRANTY_DETAILS === "" ? "---" : rfq.SUPPLIER_WARRANTY_DETAILS}
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {rfq.NOTE_TO_SUPPLIER === ""
                      ? "---"
                      : rfq.NOTE_TO_SUPPLIER}
                  </td>
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {rfq.SUPPLIER_FILE instanceof File
                      ? rfq.SUPPLIER_FILE.name.length > 15
                        ? rfq.SUPPLIER_FILE.name.substring(0, 15) + "..."
                        : rfq.SUPPLIER_FILE.name
                      : "N/A"}
                  </td>
                </tbody>
              ))}
            </table>
          </div>

          <div className=" mt-4"></div>
          <div className=" w-full flex flex-row justify-end space-x-6 my-10">
            <CommonButton
              titleText={"Previous"}
              onClick={previous}
              width="w-36"
              color="bg-graishColor"
              height="h-8"
            />

            {isCloseDatePassed ? (
              <div style={{ opacity: 0.5 }}>
                <CommonButton
                  titleText={"Save Quotation"}
                  onClick={save}
                  width="w-36"
                  height="h-8"
                  disable={true}
                />
              </div>
            ) : (
              <CommonButton
                titleText={"Save Quotation"}
                onClick={save}
                width="w-36"
                height="h-8"
              />
            )}

            {isCloseDatePassed ? (
              <div style={{ opacity: 0.5 }}>
                <CommonButton
                  titleText={"Submit Quotation"}
                  onClick={submitNext}
                  width="w-36"
                  color="bg-midGreen"
                  height="h-8"
                  disable={true}
                />
              </div>
            ) : (
              <CommonButton
                titleText={"Submit Quotation"}
                onClick={submitNext}
                width="w-36"
                color="bg-midGreen"
                height="h-8"
              />
            )}
          </div>
          <div className=" h-20"></div>
        </>
      )}
    </div>
  );
}
