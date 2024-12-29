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
import useSupplierPoStore from "../../po_supplier/store/SupplierPoStore";
import useBuyerPoStore from "../store/BuyerPoStore";
import { useAuth } from "../../login_both/context/AuthContext";
import SupplierSiteInterface from "../../registration/interface/SupplierSiteInterface";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import SiteListService from "../../registration/service/site_creation/SiteListService";
import BankInterface from "../../registration/interface/BankInterface";
import BankListService from "../../registration/service/bank/BankListService";
import moment from "moment";
import PoItemInterface from "../../po/interface/PoItemInterface";
import SiteDetailsService from "../../registration/service/site_creation/SiteDetailsService";
import PoItemListService from "../../po_supplier/service/PoItemListService";
import isoToDateTime from "../../utils/methods/isoToDateTime";
import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";
import SiteDetailsViewForApprovalService from "../../manage_supplier/service/site/SiteDetailsViewForApprovalService";
import PoStatusChangeService from "../service/PoStatusChangeService";
import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";

const pan = ["Home", "Po List", "PO Item Details"];
const list = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

const options = [
  { value: "all", label: "ALL" },
  { value: "buyer", label: "Buyer" },
  { value: "supplier", label: "Supplier" },
  { value: "admin", label: "Admin" },
];

interface Bank {
  value: string;
  label: string;
}

interface ConvertedSiteInterface {
  value: string;
  label: string;
}

export default function BuyerPoDetailsPage() {
  //drop
  // const [selectedDropDown, setSelectedDropDown] = useState<string>("");
  // const handleSelect = (value: string) => {
  //   console.log(`Selected: ${value}`);
  //   // setSearchKey(value);
  //   setSelectedDropDown(value);
  //   // getData(offset, value);
  //   // Do something with the selected value
  // };
  // //drop

  // const confirmOrder = () => {};
  // const createShipmentNotice = () => {
  //   setPageNo(3);
  // };
  // const createInvoice = () => {};
  // const viewPo = () => {
  //   const modal = document.getElementById("my_modal_1");
  //   if (modal instanceof HTMLDialogElement) {
  //     modal.showModal();
  //   }
  // };

  // //reject modal
  // const [showErrorModalX, setShowErrorModalX] = useState(false);
  // const onClickErrorModal = () => {
  //   setShowErrorModalX(!showErrorModalX);
  // };
  // //reject modal

  // //order Id
  // const emailRef = useRef<HTMLInputElement | null>(null);
  // const [email, setEmail] = useState<string>("");
  // const handleEmailChange = (value: string) => {
  //   setEmail(value);
  // };
  // //order Id

  // //reason
  // const [value, setValue] = useState("");
  // const maxLength = 150;

  // const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   const { value } = event.target;
  //   if (value.length <= maxLength) {
  //     setValue(value);
  //   }
  // };
  // //reason

  //store
  const { setPageNo, singlePo, setSinglePo, headerTermFilePath, setPoHeaderIdInStore } =
    useBuyerPoStore();

    const { setPoHeaderInStore } = useSupplierPoStore();
  //store

  const back = () => {
    setSinglePo(null);
    setPageNo(1);
  };

  const shipmentList = () => {
    setPageNo(3);
    setPoHeaderInStore(singlePo!.PO_HEADER_ID.toString());
  }
  
  const invoiceList = () => {
    setPageNo(5);
    setPoHeaderInStore(singlePo!.PO_HEADER_ID.toString());
  }

  //copy code

  useEffect(() => {
    console.log("poList: ", singlePo);
    getSiteDetails();
    getPoItemDetails();
  }, []);

  const [siteDetails, setSiteDetails] = useState<SupplierSiteInterface | null>(
    null
  );

  const getSiteDetails = async () => {
    setIsLoading(true);
    console.log(singlePo?.SITE_ID);

    const result = await SiteDetailsViewForApprovalService(
      token!,
      singlePo?.USER_ID!,
      singlePo!.SITE_ID
    );

    setSiteDetails(result.data.data);

    console.log("site: ", result.data.data);
    setIsLoading(false);
  };

  const [poDetails, setPoDetails] = useState<PoItemInterface[]>([]);

  const [buyerLineFilePath, setBuyerLineFilePath] = useState<string>("");

  const getPoItemDetails = async () => {
    setIsLoading(true);
    const result = await PoItemListService(
      token!,
      singlePo?.PO_HEADER_ID!.toString()!,
      ""
    );
    if (result.data.status === 200) {
      setBuyerLineFilePath(result.data.buyer_line_file);
      setPoDetails(result.data.data);
      console.log("poDetails: ", result.data.data);
    } else {
      showErrorToast("Something went wrong");
    }
    console.log("po: ", result.data.status);

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

  //accept reject po "REJETED", //ACCEPTED

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
      poNumberRef.current.value = singlePo?.PO_NUMBER!;
      handlePoNumberChange(singlePo?.PO_NUMBER!);
    }
    if (csNumberRef.current) {
      csNumberRef.current.value = "";
      handleCsNumberChange("");
    }
    setOuId(singlePo?.RFQ_DETAILS.ORG_ID.toString()!);
    if (ouNameRef.current) {
      ouNameRef.current.value = singlePo?.OU_NAME!;
      handleOuNameChange(singlePo?.OU_NAME!);
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

  const { token, userId, supplierId, vendorId } = useAuth();

  useEffect(() => {
    console.log("userID: ", userId);
    console.log("supplierId: ", supplierId);
  }, []);

  //shipment timeline

  //po accept reject

  //po accept reject

  //copy code
  const [isResendLoading, setIsResendLoading] = useState<boolean>(false);

  const resendPo = async () => {
    try {
      setIsResendLoading(true);
      const result = await PoStatusChangeService(
        token!,
        "IN PROCESS",
        singlePo?.USER_ID!,
        singlePo?.PO_HEADER_ID!,
        singlePo?.PO_NUMBER!
      );
      if (result.statusCode === 200) {
        setIsResendLoading(false);
        showSuccessToast(result.data.message);
        back();
      } else {
        setIsResendLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsResendLoading(false);
      showErrorToast("Po Resend Failed");
    }
  };

  return (
    <div className=" m-8 bg-white">
      <SuccessToast />

      <div className=" w-full flex items-center justify-between">
        <div className=" flex flex-col items-start">
          <PageTitle titleText="PO Item Details" />
          {/* <NavigationPan list={pan} /> */}
        </div>

        <div className="flex items-center justify-between space-x-2">
          {/* <CommonButton
            titleText="Invoice List"
            onClick={back}
            color="bg-midGreen"
            width="w-28"
            height="h-8"
          /> */}
          
          <CommonButton
            titleText="Invoice List"
            onClick={invoiceList}
            color="bg-midBlack"
            width="w-32"
            height="h-8"
          />
          <CommonButton
            titleText="Shipment List"
            onClick={shipmentList}
            color="bg-midBlack"
            width="w-32"
            height="h-8"
          />
          
          <CommonButton
            titleText="Back"
            onClick={back}
            color="bg-midGreen"
            width="w-20"
            height="h-8"
          />
        </div>
      </div>

      {/* <div className=" my-4">
        <InputLebel titleText={"Track Your product Delivery"} />
      </div> */}
      {singlePo?.PO_STATUS !== "REJECTED" ? null : (
        <div className=" my-4 w-full p-4 grayCard flex space-x-2 items-center">
          <p className=" text-sm font-mon text-midBlack font-semibold">
            Reject Reason:
          </p>
          <p className=" flex-1 text-sm font-mon text-midBlack">
            {singlePo?.PO_REMARKS}
          </p>
          {isResendLoading ? (
            <div className=" w-40 flex justify-center items-center">
              <CircularProgressIndicator />
            </div>
          ) : (
            <CommonButton
              titleText="Resend PO"
              onClick={resendPo}
              width="w-40"
            />
          )}
        </div>
      )}
      <div className=" grayCard p-4 w-full flex items-start justify-between mb-8">
        <div className=" flex-1 space-y-2">
          <div className=" w-full flex space-x-2">
            <p className=" text-graishColor text-sm font-mon ">
              Shipping From :{" "}
            </p>
            <p className=" text-midBlack font-mon font-medium text-sm">
              {siteDetails?.ADDRESS_LINE1}
            </p>
          </div>
          <div className=" w-full flex space-x-2">
            <p className=" text-graishColor text-sm font-mon ">CS No :</p>
            <p className=" text-midBlack font-mon font-medium text-sm ">
              {!singlePo?.RFQ_DETAILS.CS_ID
                ? "---"
                : singlePo.RFQ_DETAILS.CS_ID}
            </p>
          </div>
        </div>

        <div className=" flex-1 space-y-2">
          <div className=" w-full flex space-x-2">
            <p className=" text-graishColor text-sm font-mon ">Deliver to : </p>
            <p className=" text-midBlack font-mon font-medium text-sm">
              {singlePo?.BILL_TO_LOCATION}
            </p>
          </div>
          <div className=" w-full flex space-x-2">
            <p className=" text-graishColor text-sm font-mon ">RFQ No :</p>
            <p className=" text-midBlack font-mon font-medium text-sm ">
              {!singlePo?.RFQ_ID ? "---" : singlePo.RFQ_ID}
            </p>
          </div>
        </div>
        {/* <div className=" flex-1 flex space-x-4">
          <p className=" text-graishColor text-sm font-mon">Deliver to</p>
          <div className=" flex-1 space-y-2">
            <p className=" text-midBlack font-mon font-medium text-sm">
              
              {singlePo?.BILL_TO_LOCATION}
            </p>
            
          </div>
        </div> */}
        <div className=" flex-1 space-y-2">
          <div className=" w-full flex space-x-2">
            <p className=" text-graishColor text-sm font-mon ">
              Purchase Order :{" "}
            </p>
            <p className=" text-midBlack font-mon font-medium text-sm">
              {singlePo?.PO_NUMBER}
            </p>
          </div>
          <div className=" w-full flex space-x-2">
            <p className=" text-graishColor text-sm font-mon ">Amount :</p>
            <p className=" text-midBlack font-mon font-medium text-sm ">
              {!singlePo?.TOTAL_PO_AMOUNT ? "---" : singlePo.TOTAL_PO_AMOUNT}
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
              {singlePo?.BILL_TO_LOCATION}
            </p>
          </div>
          <div className=" w-full flex">
            <p className=" text-graishColor text-sm font-mon w-44">
              Ship to Address :
            </p>
            <p className=" text-midBlack font-mon font-medium text-sm w-44">
              {singlePo?.SHIP_TO_LOCATION}
            </p>
          </div>
          {/* <div className=" w-full flex">
            <p className=" text-graishColor text-sm font-mon w-44">FOB :</p>
            <p className=" text-midBlack font-mon font-medium text-sm w-44">
              {singlePo?.RFQ_DETAILS.FOB === ""
                ? "N/A"
                : singlePo?.RFQ_DETAILS.FOB}
            </p>
          </div> */}
          <div className=" w-full flex">
            <p className=" text-graishColor text-sm font-mon w-44">
              Currency :
            </p>
            <p className=" text-midBlack font-mon font-medium text-sm w-44">
              {!singlePo?.RFQ_DETAILS.CURRENCY_CODE
                ? "N/A"
                : singlePo?.RFQ_DETAILS.CURRENCY_CODE}
            </p>
          </div>
          {/* <div className=" w-full flex">
            <p className=" text-graishColor text-sm font-mon w-44">
              Invoice Type :
            </p>
            <p className=" text-midBlack font-mon font-medium text-sm w-44">
              {singlePo?.RFQ_DETAILS.INVOICE_TYPE}
            </p>
          </div> */}
          <div className=" w-full flex">
            <p className=" text-graishColor text-sm font-mon w-44">
              Freight/Inco Term :
            </p>
            <p className=" text-midBlack font-mon font-medium text-sm w-44">
              {singlePo?.RFQ_DETAILS.FREIGHT_TERM}
            </p>
          </div>

          <div className=" w-full flex space-x-12">
            <p className=" text-graishColor text-sm font-mon w-[206px] ">
              Note :
            </p>
            <p className=" text-midBlack font-mon font-medium text-sm w-full">
              {singlePo?.RFQ_DETAILS.NOTE_TO_SUPPLIER}
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
                href={`${headerTermFilePath}/${singlePo?.RFQ_DETAILS.BUYER_ATTACHMENT_FILE_NAME}`}
                className="smallViewButton"
                rel="noreferrer"
              >
                view
              </a>
            </p>
          </div>
          <div className=" w-full flex">
            <p className=" text-graishColor text-sm font-mon w-44">ETR/ETD :</p>
            <p className=" text-midBlack font-mon font-medium text-sm w-44">
              {moment(singlePo?.RFQ_DETAILS.ETR).format("DD-MMMM-YYYY")}
            </p>
          </div>
          <div className=" w-full flex">
            <p className=" text-graishColor text-sm font-mon w-44">
              VAT Applicable :
            </p>
            <p className=" text-midBlack font-mon font-medium text-sm w-44">
              <div
                className={`h-4 w-4 rounded-md border-[1px] border-borderColor flex justify-center items-center ${
                  singlePo?.RFQ_DETAILS.VAT_APPLICABLE_STATUS === "Y"
                    ? "bg-midGreen"
                    : "bg-white"
                }`}
              >
                {singlePo?.RFQ_DETAILS.VAT_APPLICABLE_STATUS === "Y" ? (
                  <img
                    src="/images/check.png"
                    alt="check"
                    className=" w-2 h-2"
                  />
                ) : null}
              </div>
            </p>
          </div>
          {/* <div className=" w-full flex">
            <p className=" text-graishColor text-sm font-mon w-44">VAT/TAX :</p>
            <p className=" text-midBlack font-mon font-medium text-sm w-44">
              {singlePo?.RFQ_DETAILS.VAT_RATE}%
            </p>
          </div> */}
          {/* <div className=" w-full flex space-x-12">
            <p className=" text-graishColor text-sm font-mon w-[206px] ">
              Note :
            </p>
            <p className=" text-midBlack font-mon font-medium text-sm w-full">
              {singlePo?.RFQ_DETAILS.NOTE_TO_SUPPLIER}
            </p>
          </div> */}
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
              {singlePo?.CURRENCY === "" ? "---" : singlePo?.CURRENCY}
            </p>
          </div>
        </div>
        <div className=" flex-1 space-y-2">
          <div className=" w-full flex">
            <p className=" text-graishColor text-sm font-mon w-44">
              Quote valid date :{" "}
            </p>
            <p className=" text-midBlack font-mon font-medium text-sm">
              {singlePo?.QUOT_VALID_DATE === ""
                ? "---"
                : isoToDateTime(singlePo!.QUOT_VALID_DATE)}
            </p>
          </div>
          <div className=" w-full flex">
            <p className=" text-graishColor text-sm font-mon w-44">
              Attachment :
            </p>
            <p className=" text-midBlack font-mon font-medium text-sm w-44">
              <a
                href={`${headerTermFilePath}/${singlePo?.SUP_TERM_FILE}`}
                target="_blank"
                className=" smallViewButton"
                rel="noreferrer"
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
              {!singlePo?.SUPPLIER_NOTE ? "N/A" : singlePo.SUPPLIER_NOTE}
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
                  Org. name
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
                {/* <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Expected quantity
                </th> */}
                {/* <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Offered Quantity
                </th> */}
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Award Quantity
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
                {/* <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  AIT
                </th> */}
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
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar ">
                    <div className="w-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                      {/* Org. name */}
                      {!po.OU_NAME ? "---" : po.OU_NAME}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {/* PR No/Line No */}
                      {`${po.PR_NUMBER}/${po.PR_LINE_NUM}`}
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
                      {po.EXPECTED_BRAND_NAME === "" ? "---" : po.EXPECTED_BRAND_NAME}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {po.AVAILABLE_SPECS === "" ? "---" : po.AVAILABLE_SPECS}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {po.AVAILABLE_BRAND_NAME === "" ? "---" : po.AVAILABLE_BRAND_NAME}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {po.AVAILABLE_ORIGIN === "" ? "---" : po.AVAILABLE_ORIGIN}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {/* {po.NEED_BY_DATE === "" ? "---" : isoToDateTime(po.NEED_BY_DATE)} */}
                      {!po.NEED_BY_DATE
                        ? "---"
                        : moment(po.NEED_BY_DATE).format("DD-MMMM-YYYY")}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {po.PROMISE_DATE === ""
                        ? "---"
                        : isoToDateTime(po.PROMISE_DATE)}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {po.UNIT_MEAS_LOOKUP_CODE === ""
                        ? "---"
                        : po.UNIT_MEAS_LOOKUP_CODE}
                    </div>
                  </td>
                  {/* <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {!po.EXPECTED_QUANTITY ? "---" : po.EXPECTED_QUANTITY}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {po.QUOT_OFFERED_QUANTITY}
                    </div>
                  </td> */}

                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {po.AWARD_QUANTITY}
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
                  {/* <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                     
                      ---
                    </div>
                  </td> */}
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {/* Total Amount */}
                      {po.UNIT_PRICE * po.QUOT_OFFERED_QUANTITY}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {po.PACKING_TYPE === "" ? "---" : po.PACKING_TYPE}
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
                      {!po.NOTE_FROM_BUYER ? "---" : po.NOTE_FROM_BUYER}
                    </div>
                  </td>
                  <td className="overflow-auto px-6  whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full  overflow-auto custom-scrollbar text-center h-10 flex justify-center items-start mt-4">
                      {/* Attachment */}
                      {!po.BUYER_FILE_NAME ? (
                        "---"
                      ) : (
                        <a
                          href={`${buyerLineFilePath}/${po.BUYER_FILE_NAME}`}
                          className=" border-[1px] border-borderColor rounded-md px-1 py-[2px] font-mon border-dashed"
                          target="_blank"
                          rel="noreferrer"
                        >
                          view
                        </a>
                      )}
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
              </tr>
            </tfoot>
          </table>
        </div>
      }
    </div>
  );
}
