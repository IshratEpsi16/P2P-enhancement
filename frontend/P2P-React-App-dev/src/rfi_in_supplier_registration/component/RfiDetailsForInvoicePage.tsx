// RfiDetailsForInvoicePage

import React, { useState, useRef, useEffect } from "react";
// import useBuyerInvoiceStore from "../store/buyerInvoiceStore";
import useBuyerInvoiceStore from "../../buyer_invoice/store/buyerInvoiceStore";
import PageTitle from "../../common_component/PageTitle";
import NavigationPan from "../../common_component/NavigationPan";
import DownloadIcon from "../../icons/DownloadIcon";
import CommonButton from "../../common_component/CommonButton";
import moment from "moment";

import isoToDateTime from "../../utils/methods/isoToDateTime";
import { CloudArrowUp } from "phosphor-react";

import { Button, Modal, Textarea } from "keep-react";
import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";
// import ApprovalHierarchyModuleListService from "../service/ApprovalHierarchyModuleListService";
import ApprovalHierarchyModuleListService from "../../buyer_invoice/service/ApprovalHierarchyModuleListService";
// import InvoiceApproveService from "../service/InvoiceApproveService";
import InvoiceApproveService from "../../buyer_invoice/service/InvoiceApproveService";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import LogoLoading from "../../Loading_component/LogoLoading";
// import SupplierInvoiceDetailsInterface from "../interface/SupplierInvoiceDetailsInterface";
import SupplierInvoiceDetailsInterface from "../../buyer_invoice/interface/SupplierInvoiceDetailsInterface";
// import SupplierInvoiceDetailsService from "../service/SupplierInvoiceDetailsService";
import SupplierInvoiceDetailsService from "../../buyer_invoice/service/SupplierInvoiceDetailsService";
// import PendingInvoiceDetailsInterface from "../interface/PendingInvoiceDetailsInterface ";
import PendingInvoiceDetailsInterface from "../../buyer_invoice/interface/PendingInvoiceDetailsInterface ";
// import BuyerInvoiceDetailsService from "../service/BuyerInvoiceDetailsService";
import BuyerInvoiceDetailsService from "../../buyer_invoice/service/BuyerInvoiceDetailsService";
import { useAuth } from "../../login_both/context/AuthContext";
import ArrowLeftIcon from "../../icons/ArrowLeftIcon";
import ArrowRightIcon from "../../icons/ArrowRightIcon";
// import InvoiceItemInterface from "../interface/InvoiceItemInterface";
import InvoiceItemInterface from "../../buyer_invoice/interface/InvoiceItemInterface";
import SiteDetailsViewForApprovalService from "../../manage_supplier/service/site/SiteDetailsViewForApprovalService";
import SupplierSiteInterface from "../../registration/interface/SupplierSiteInterface";
import HierachyListByModuleService from "../../registration/service/approve_hierarchy/HierarchyListByModuleService";

import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";
// import InvoiceApprovalHierarchyService from "../service/InvoiceApprovalHierarchy";
import InvoiceApprovalHierarchyService from "../../buyer_invoice/service/InvoiceApprovalHierarchy";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  PDFDownloadLink,
} from "@react-pdf/renderer";
// import PendingInvoiceItemListService from "../service/PendingInvoiceItemListService";
import PendingInvoiceItemListService from "../../buyer_invoice/service/PendingInvoiceItemListService";
import ApproverInterface from "../../approval_setup/interface/ApproverInterface";
import EmployeeListService from "../../approval_setup/service/EmployeeListService";
import RfiAddUpdateService from "../../manage_supplier_profile_update/service/rfi/RfiAddUpdateService";
import ValidationError from "../../Alerts_Component/ValidationError";
import SearchIcon from "../../icons/SearchIcon";
import usePrItemsStore from "../../buyer_section/pr/store/prItemStore";
import useRfiStore from "../store/RfiStore";
import BuyerInvoiceListService from "../../buyer_invoice/service/BuyerInvoiceListService";
import Invoice from "../../buyer_invoice/interface/InvoiceInterface";
import RfiBuyerInvoiceListService from "../service/RfiBuyerInvoiceListService";

const list = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
interface ApproverDetails {
  STAGE_ID: number;
  STAGE_LEVEL: number;
  STAGE_SEQ: number;
  APPROVER_ID: number;
  APPROVER_FULL_NAME: string;
  APPROVER_USER_NAME: string;
  PROPIC_FILE_NAME: string;
  IS_MUST_APPROVE: number;
  EMAIL_ADDRESS: string;
  ACTION_CODE: string;
  ACTION_DATE: string;
  ACTION_NOTE: string;
}

interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  invoiceStatus: string;
  invoiceType: string;
  summaryNarration: string;
  voucherNumber: string;
  invoiceAmount: string;
  exchangeRate: string;
  source: string;
  paymentMethod: string;
  glDate: string;
  supplierID: string;
  supplierName: string;
  supplierAddress: string;
  invoiceCurrency: string;
  supplierSite: string;
  fullName: string;
  payeeBankAC: string;
  accountDetails: Array<{
    accountCode: string;
    codeDescription: string;
    analysis: string;
    amount: string;
  }>;
  totalBDT: string;
  inWords: string;
}

const pan = ["Home", "Invoice List", "Approve Invoice"];
export default function RfiDetailsForInvoicePage() {
  const [imgPath, setImgPath] = useState("");
  const [hierarchyList, setHierarchyList] = useState<ApproverDetails[]>([]);
  const [approveModal, setApproveModal] = useState<boolean>(false);
  let data: InvoiceData;
  const onCLickApprove = () => {
    // setActionCode(1);
    setApproveModal(true);
  };

  const closeApproveModal = () => {
    setApproveModal(false);
    setApproveValue("");
  };

  const [remarks, setRemarks] = useState("");
  const [approveValue, setApproveValue] = useState<string>("");

  console.log(approveValue);
  //store
  const {
    setPageNo,
    selectedInvoiceDetails,
    selectedInvoiceDetailsBank,
    selectedInvoiceDetailsSite,
    // invoiceDetails,
    // setInvoiceDetails,
    setSelectedInvoiceDetails,
    setSelectedInvoiceDetailsBank,
    setSelectedInvoiceDetailsSite,
    selectedInvoice,
    setSelectedInvoice,
    setInvoiceId,
    invoiceId,
    setPoTermFilePathInBuyerInvoice,
  } = useBuyerInvoiceStore();

  const { setRfqIdInStore, rfqIdInStore } = usePrItemsStore();

  const {
    setRfiSupplierListlength,
    setRfiTabNo,
    rfiTabNo,
    setStageLevelInStore,
    setTemplateIdInStore,
  } = useRfiStore();

  // console.log("bank", selectedInvoiceDetailsBank);
  // console.log("site", selectedInvoiceDetailsSite);
  // console.log("details", invoiceDetails);
  //store

  const { token } = useAuth();

  useEffect(() => {
    // if (token) {
    //   allApprovalHierarchyList(token, invoiceDetails.SUPPLIER_ID);
    // }
    console.log("rfqId:", rfqIdInStore);

    getSingleInvoice();

    getDetails();
    allApprovalHierarchyList();
  }, []);

  const [total, setTotal] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(5);
  const [pageNo2, setPageNo2] = useState<number>(1);
  const [offset, setOffSet] = useState<number>(1);

  const [invoiceItemList, setInvoiceItemList] = useState<
    InvoiceItemInterface[] | []
  >([]);
  const [isItemLoading, setIsItemLoading] = useState<boolean>(false);

  const [invoiceDetails, setInvoiceDetails] =
    useState<PendingInvoiceDetailsInterface | null>(null);

  const getDetails = async () => {
    try {
      setIsItemLoading(true);

      const result = await BuyerInvoiceDetailsService(token!, rfqIdInStore!);

      if (result.statusCode === 200) {
        setInvoiceDetails(result.data);
        if (result.data.data.INVOICE_TYPE === "STANDARD") {
          getInvoiceItem(offset, limit);
        }
        setIsItemLoading(false);
      } else {
        showErrorToast(result.data.message);

        setIsItemLoading(false);
      }
    } catch (error) {
      setIsItemLoading(false);
      showErrorToast("Details Load Failed");
    }
  };

  const getInvoiceItem = async (ofs: number, lmt: number) => {
    try {
      // setIsItemLoading(true);
      const result = await SupplierInvoiceDetailsService(
        token!,
        rfqIdInStore!,
        ofs,
        lmt
      );
      if (result.statusCode === 200) {
        setInvoiceItemList(result.data.data);
        dividePage(result.data.total, lmt);
        setIsItemLoading(false);
      } else {
        showErrorToast(result.data.message);
        setIsItemLoading(false);
      }
    } catch (error) {
      showErrorToast("Something went wrong");
      setIsItemLoading(false);
    }
  };

  const [profilePicPath, setProfilePicPath] = useState<string>("");
  const [invoiceList, setInvoiceList] = useState<Invoice[]>([]);

  const getSingleInvoice = async () => {
    setIsLoading(true);
    const result = await RfiBuyerInvoiceListService(
      token!,
      rfqIdInStore?.toString() || "",
      "",
      1,
      100
    );
    console.log(result.data);
    setImgPath(result.data.profile_pic1);
    setProfilePicPath(result.data.profile_pic1);
    setPoTermFilePathInBuyerInvoice(result.data.header_term_file_path);
    console.log("single invoice details", result.data);
    // Ensure that result.data is an array
    if (Array.isArray(result.data.data)) {
      setInvoiceList(result.data.data);
      // dividePage(result.data.total, lmt);
      // setInvoiceDetails(result.data.data);
    } else {
      setInvoiceList([]);
    }
    setIsLoading(false);
  };

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
            getInvoiceItem((i - 1) * limit, limit);
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
  // new pagination end

  const next = async () => {
    let newOff;

    newOff = offset + limit;
    console.log(newOff);
    setOffSet(newOff);

    setPageNo2((pre) => pre + 1);
    console.log(limit);
    // getHistory("", "", newOff, limit);
    getInvoiceItem(newOff, limit);
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
    getInvoiceItem(newOff, limit);
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

  // const allApprovalHierarchyList = async () => {
  //   const result = await InvoiceApprovalHierarchyService(
  //     token!,
  //     selectedInvoice?.SUPPLIER_ID!,
  //     selectedInvoice?.BUYER_DEPARTMENT === "Local" ||
  //       !selectedInvoice?.BUYER_DEPARTMENT
  //       ? "Local Invoice Approval"
  //       : "Local Invoice Approval",
  //     selectedInvoice?.INV_ID!
  //   );
  //   console.log(selectedInvoice?.SUPPLIER_ID);

  //   console.log(result);
  //   setHierarchyList(result.data.data);
  //   setImgPath(result.data.profile_pic);
  // };

  const allApprovalHierarchyList = async () => {
    const result = await InvoiceApprovalHierarchyService(
      token!,
      selectedInvoice?.SUPPLIER_ID!,
      selectedInvoice?.BUYER_DEPARTMENT === "Local" ||
        !selectedInvoice?.BUYER_DEPARTMENT
        ? "Local Invoice Approval"
        : "Foreign Invoice Approval",
      selectedInvoice?.INV_ID!
    );
    console.log(selectedInvoice?.SUPPLIER_ID);
    console.log(result);

    // Create a new ApproverDetails object from BUYER_STATUS
    const buyerStatusApprover: ApproverDetails = {
      STAGE_ID: 0, // Default value, adjust as needed
      STAGE_LEVEL: 0, // Default value, adjust as needed
      STAGE_SEQ: 0, // Default value, adjust as needed
      APPROVER_ID: 0, // Default value, adjust as needed
      APPROVER_FULL_NAME: selectedInvoice?.BUYER_STATUS.APPROVER_FULL_NAME!,
      APPROVER_USER_NAME: "", // Default value, adjust as needed
      PROPIC_FILE_NAME: selectedInvoice?.BUYER_STATUS.PROPIC_FILE_NAME!, // Default value, adjust as needed
      IS_MUST_APPROVE: 0, // Default value, adjust as needed
      EMAIL_ADDRESS: "", // Default value, adjust as needed
      ACTION_CODE: selectedInvoice?.BUYER_STATUS.ACTION_CODE?.toString()!, // Convert to string to match the interface
      ACTION_DATE: selectedInvoice?.BUYER_STATUS.ACTION_DATE!,
      ACTION_NOTE: selectedInvoice?.BUYER_STATUS.NOTE!, // Assuming ACTION_NOTE corresponds to NOTE
    };

    // Create a new array with the buyerStatusApprover at the beginning
    const updatedHierarchyList: ApproverDetails[] = [
      buyerStatusApprover,
      ...result.data.data,
    ];

    setHierarchyList(updatedHierarchyList);
    setImgPath(result.data.profile_pic);
  };

  //back
  const back = () => {
    setInvoiceId(null);
    setSelectedInvoice(null);
    // setPageNo(222);
    setRfiTabNo(222);
  };
  const handleApproveValueChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const inputValue = event.target.value;
    if (inputValue.length <= 150) {
      setApproveValue(inputValue);
    } else {
      setApproveValue(inputValue.slice(0, 150));
    }
  };
  //reject modal

  const [rejectModal, setRejectModal] = useState<boolean>(false);
  const onCLickReject = () => {
    // setActionCode(0);
    setRejectModal(true);
  };

  const closeRejectModal = () => {
    setRejectModal(false);
    setRejectValue("");
  };

  const [rejectValue, setRejectValue] = useState<string>("");
  const handleRejectValueChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const inputValue = event.target.value;

    // Check if the input value exceeds the maximum character length (150)
    if (inputValue.length <= 150) {
      setRejectValue(inputValue);
    } else {
      // Truncate the input value to the first 150 characters
      setRejectValue(inputValue.slice(0, 150));
    }
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleApprove = async () => {
    setIsLoading(true);
    closeApproveModal();
    if (token) {
      const supplier_id = selectedInvoice!.SUPPLIER_ID;
      const stage_id = selectedInvoice!.TEMPLATE_ID; //stage id silo
      const stage_level = selectedInvoice!.TEMPLATE_STAGE_LEVEL; //satge level silo
      const invoice_id = selectedInvoice!.INV_ID;
      const result = await InvoiceApproveService(
        token,
        1,
        supplier_id,
        stage_id,
        approveValue,
        stage_level,
        invoice_id,
        selectedInvoice?.BUYER!,
        selectedInvoice?.BUYER_DEPARTMENT === "Local"
          ? "Local Invoice Approval"
          : "Foreign Invoice Approval"
      );
      console.log(result);
      if (result.statusCode === 200) {
        showSuccessToast(result.data.message);
        back();
      } else {
        setIsLoading(false);
        showErrorToast(result.data.message);
      }
    }
  };

  const handleReject = async () => {
    closeRejectModal();
    setIsLoading(true);

    if (token) {
      const supplier_id = selectedInvoice!.SUPPLIER_ID;
      const stage_id = selectedInvoice!.TEMPLATE_ID;
      const stage_level = selectedInvoice!.TEMPLATE_STAGE_LEVEL;
      const invoice_id = selectedInvoice!.INV_ID;
      const result = await InvoiceApproveService(
        token,
        2,
        supplier_id,
        stage_id,
        rejectValue,
        stage_level,
        invoice_id,
        selectedInvoice?.BUYER!,
        selectedInvoice?.BUYER_DEPARTMENT === "Local"
          ? "Local Invoice Approval"
          : "Foreign Invoice Approval"
      );
      console.log(result);
      if (result.statusCode === 200) {
        showSuccessToast(result.data.message);
        back();
      } else {
        showErrorToast(result.data.message);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    console.log(selectedInvoice?.BUYER_STATUS);

    getSiteDetails(selectedInvoice?.SITE_ID!);
  }, []);

  const [siteDetails, setSiteDetails] = useState<SupplierSiteInterface | null>(
    null
  );

  const getSiteDetails = async (siteId: number) => {
    try {
      console.log("Fetching site details for SITE_ID: ", siteId);
      const result = await SiteDetailsViewForApprovalService(
        token!,
        selectedInvoice?.USER_ID!,
        siteId
      );

      if (result.data && result.data.data) {
        setSiteDetails(result.data.data);
        console.log("Site details: ", result.data.data);
      }
    } catch (error) {
      console.error("Error fetching site details: ", error);
    }

    // console.log("site: ", result.data.data);
  };

  // Define styles
  const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 12 },
    header: { marginBottom: 20, textAlign: "center" },
    table: { width: "100%" },
    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#bfbfbf",
      borderBottomStyle: "solid",
    },
    tableCol: { width: "25%", padding: 5 },
    tableCell: { margin: "auto", marginTop: 5, fontSize: 10 },
    title: { fontSize: 10, marginBottom: 10, fontWeight: "bold" },
    subtitle: { fontSize: 14, marginBottom: 10 },
    bold: { fontWeight: "bold" },
    mt20: { marginTop: 20 },
    mt50: { marginTop: 50 },
    flexRow: { flexDirection: "row", justifyContent: "space-between" },
  });

  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Seven Circle (Bangladesh) Ltd.</Text>
          <Text style={styles.subtitle}>SCBL CEMENT</Text>
          <Text>Char MirpurKaligong, Gazipur</Text>
          <Text style={[styles.bold, styles.mt20]}>
            INVOICE DISTRIBUTION DETAILS
          </Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Invoice Number</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>SCBL/KMI/100/930/1</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Payment Method</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>BEFTN</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Invoice Date</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>23-MAR-22</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>GL Date</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>23-MAR-22</Text>
            </View>
          </View>
          {/* Add more rows for Invoice Status, Type, etc. */}
        </View>

        <View style={[styles.table, styles.mt20]}>
          <View style={[styles.tableRow, styles.bold]}>
            <View style={styles.tableCol}>
              <Text>Account Code</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>Code Description</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>Analysis</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>Amount</Text>
            </View>
          </View>
          {/* Add account code rows here */}
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text>101.0000.000.0000000.206</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>
                Seven Circle (Bangladesh) Ltd. -No Cost Center-No Location-No
                Profit Center-...
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text>1013101342310131013423...</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>47,570.00</Text>
            </View>
          </View>
          {/* Add more account code rows */}
        </View>

        <View style={styles.mt20}>
          <Text style={styles.bold}>Total BDT: 1,165,057.00</Text>
          <Text>
            In Words: BDT Eleven Lakh Sixty-Five Thousand Fifty-Seven Only
          </Text>
        </View>

        <View style={[styles.flexRow, styles.mt50]}>
          <Text>Prepared By</Text>
          <Text>Checked By</Text>
          <Text>GM(F&A)</Text>
          <Text>CFO/Director</Text>
          <Text>Payee</Text>
        </View>
      </Page>
    </Document>
  );

  interface InvoiceItemInterface2 {
    USER_ID: number;
    RFQ_ID: number;
    CS_LINE_ID: number;
    ID: number;
    INV_ID: number;
    SHIPMENT_ID: number;
    SHIPMENT_LINE_ID: number;
    ITEM_CODE: string;
    ITEM_DESCRIPTION: string;
    ITEM_SPECIFICATION: string;
    UOM: string;
    BUYER_VAT_APPLICABLE: string;
    PO_HEADER_ID: string;
    PO_NUMBER: number;
    AWARD_QUANTITY: number;
    INVOICE_QTY: number;
    PRE_BILL_QTY: number;
    DESCRIPTION: string;
    LINE_TYPE_CODE: string;
    LINE_AMOUNT: number;
    ORG_ID: number;
    EXPENSE_TYPE: string;
    OFFERED_QUANTITY: number;
    SHIPPING_QUANTITY: number;
    LCM_ENABLE: string;
    EBS_GRN_QTY: number;
    EBS_RECEIVE_QTY: number;
    EBS_ACCEPT_QTY: number;
    EBS_REJECT_QTY: number;
    EBS_DELIVERED_QTY: number;
    UNIT_PRICE: number;
    PO_LINE_NUMBER: number;
    PO_LINE_ID: number;
    EBS_GRN_NO: string;
    COMMENTS: string;
  }

  const [invoiceList2, setInvoiceList2] = useState<
    InvoiceItemInterface2[] | []
  >([]);

  useEffect(() => {
    getInvoice2();
  }, []);

  const getInvoice2 = async () => {
    try {
      const result = await PendingInvoiceItemListService(
        token!,
        selectedInvoice?.INV_ID!
      );
      console.log(result.data.data);

      if (result.statusCode === 200) {
        setInvoiceList2(result.data.data);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // invoice rfi start

  const [rfqInfoModal, setRfqInfoModal] = useState<boolean>(false);
  const [additionalValue, setAdditionalValue] = useState<string>("");
  const [viewerId, setViewerId] = useState<number | null>(null);
  const [isApproverLoading, setIsApproverLoading] = useState(false);
  const [approverList, setApproverList] = useState<ApproverInterface[] | []>(
    []
  );
  const [approverList2, setApproverList2] = useState<ApproverInterface[] | []>(
    []
  );
  const [rfiError, setRfiError] = useState<{
    rfiNote?: string;
    viewer?: string;
  }>({});

  useEffect(() => {
    getApproverList();
    console.log("rfqId: ", selectedInvoice?.RFQ_ID);
  }, []);

  const rfiInfo = () => {
    setRfqInfoModal(!rfqInfoModal);
  };

  const onClickAdditional = () => {
    setRfqInfoModal(!rfqInfoModal);
    if (rfqInfoModal) {
      setAdditionalValue("");
      setViewerId(null);
    }
  };

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

  const sendRfi = async () => {
    if (validateRfi()) {
      setRfqInfoModal(false);
      try {
        const result = await RfiAddUpdateService(
          token!,
          null,
          selectedInvoice?.INV_ID ?? null,
          "INVOICE",
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
        } else {
          showErrorToast(result.data.message);
        }
      } catch (error) {
        showErrorToast("Something went wrong");
      }
    }
  };

  // invoice rfi end

  return (
    <div className=" bg-white m-8">
      <SuccessToast />
      <div className=" mb-4">
        <PageTitle titleText="Approve Invoice" />
        {/* <NavigationPan list={pan} /> */}
      </div>

      {/* <div className=" w-full ">
        <PDFDownloadLink document={<MyDocument />} fileName="invoice.pdf">
          asfaef
        </PDFDownloadLink>
        <PDFViewer width="100%" height={600}>
          <MyDocument />
        </PDFViewer>
      </div> */}

      {isLoading || isItemLoading ? (
        <div className=" w-full justify-center items-center">
          <LogoLoading />
        </div>
      ) : (
        <>
          <div className=" w-full flex flex-row-reverse items-center justify-start gap-4 space-x-4 mb-4">
            <CommonButton
              titleText="Back"
              onClick={back}
              width="w-44"
              color="bg-midGreen"
            />
            {/* <button
              onClick={() => {}}
              className=" w-44 bg-inputBg h-8 flex items-center space-x-2 justify-center border-graishColor border-[1px] rounded-[4px]"
            >
              <div className=" h-3 w-3">
                <DownloadIcon className=" w-full h-full text-neonBlue" />
              </div>
              <p className=" text-sm font-mon text-neonBlue">Download as PDF</p>
            </button> */}
            {/* <div className=" exportToExcel">Export to Excel</div> */}
          </div>

          <div className="   ">
            <div className="   ">
              <div className=" w-full flex justify-center items-center mb-4">
                <div className=" flex flex-col items-center">
                  <p className=" text-sm font-semibold text-midBlack font-mon">
                    {selectedInvoice?.LE_NAME}
                  </p>
                  <p className=" text-sm  text-midBlack font-mon">
                    {selectedInvoice?.ORG_NAME}
                  </p>
                  <p className=" text-[12px]  text-midBlack font-mon">
                    {selectedInvoice?.LE_ADDRESS}
                  </p>
                  <p className=" text-sm font-semibold text-midBlack font-mon">
                    INVOICE DISTRIBUTION DETAILS
                  </p>
                  {/* <p className=" text-sm font-medium text-midBlack font-mon">
                    {selectedInvoiceDetailsSite?.ADDRESS_LINE1}
                  </p> */}
                </div>
              </div>
            </div>
            <div className=" w-full flex items-start ">
              <div className=" flex-1 flex items-start">
                <div className=" w-36  bg-blue-100 border-[1px] border-black">
                  <div className=" h-10 flex justify-start items-center  w-full border-b-[1px] border-black px-2">
                    <p className=" text-sm font-mon font-semibold">
                      Invoice Number
                    </p>
                  </div>
                  <div className=" h-10 flex justify-start items-center w-full border-b-[1px] border-black px-2">
                    <p className=" text-sm font-mon font-semibold">
                      Invoice Date
                    </p>
                  </div>
                  <div className=" h-10 flex justify-start items-center  w-full border-b-[1px] border-black px-2">
                    <p className=" text-sm font-mon font-semibold">
                      Invoice Status
                    </p>
                  </div>
                  <div className="h-10 flex justify-start items-center  w-full border-b-[1px] border-black px-2">
                    <p className=" text-sm font-mon font-semibold">
                      Invoice Type
                    </p>
                  </div>
                  <div className="h-20   w-full border-b-[1px] border-black px-2">
                    <p className=" text-sm font-mon font-semibold">
                      Summary Narration
                    </p>
                  </div>
                  <div className="h-10 flex justify-start items-center  w-full border-b-[1px] border-black px-2">
                    <p className=" text-sm font-mon font-semibold">
                      Inoice Currency
                    </p>
                  </div>
                  <div className="h-10 flex justify-start items-center  w-full border-b-[1px] border-black px-2">
                    <p className=" text-sm font-mon font-semibold">
                      Invoice Amount
                    </p>
                  </div>
                  <div className="h-10 flex justify-start items-center  w-full  px-2">
                    <p className=" text-sm font-mon font-semibold">
                      Exchange Rate
                    </p>
                  </div>
                  {/* <div className="h-10 flex justify-start items-center  w-full   px-2">
                    <p className=" text-sm font-mon font-semibold">Source</p>
                  </div> */}
                </div>
                <div className=" flex-1 ">
                  <div className=" w-full h-[40.5px] border-r-[1px] border-b-[1px] border-t-[1px] border-black px-2 items-center flex justify-start">
                    <p
                      onClick={() => {
                        setPageNo(4);
                      }}
                      className=" text-sm font-mon   text-sky-700 cursor-pointer hover:underline "
                    >
                      {!selectedInvoice?.INVOICE_NUM
                        ? "---"
                        : selectedInvoice?.INVOICE_NUM}
                    </p>
                  </div>
                  <div className=" w-full h-10 border-r-[1px] border-b-[1px]  border-black px-2 items-center flex justify-start ">
                    <p className=" text-sm font-mon  text-black ">
                      {!selectedInvoice?.INVOICE_DATE
                        ? "---"
                        : moment(selectedInvoice?.INVOICE_DATE).format(
                            "DD-MMMM-YYYY"
                          )}
                    </p>
                  </div>
                  <div className=" w-full h-10 border-r-[1px] border-b-[1px]  border-black px-2 items-center flex justify-start">
                    <p className=" text-sm font-mon  text-black ">
                      {!selectedInvoice?.INVOICE_STATUS
                        ? "---"
                        : selectedInvoice?.INVOICE_STATUS}
                    </p>
                  </div>
                  <div className=" w-full h-10 border-r-[1px] border-b-[1px]  border-black px-2 items-center flex justify-start">
                    <p className=" text-sm font-mon  text-black ">
                      {!selectedInvoice?.INVOICE_TYPE
                        ? "---"
                        : selectedInvoice?.INVOICE_TYPE}
                    </p>
                  </div>
                  <div className=" w-full h-20 border-r-[1px] border-b-[1px]  border-black px-2 items-start flex justify-start">
                    <p className=" text-sm font-mon  text-black ">
                      {!selectedInvoice?.DESCRIPTION
                        ? "---"
                        : selectedInvoice?.DESCRIPTION}
                    </p>
                  </div>
                  <div className=" w-full h-10 border-r-[1px] border-b-[1px]  border-black px-2 items-center flex justify-start">
                    <p className=" text-sm font-mon  text-black ">
                      {selectedInvoice?.CURRENCY_NAME}
                    </p>
                  </div>
                  <div className=" w-full h-10 border-r-[1px] border-b-[1px]  border-black px-2 items-center flex justify-start">
                    <p className=" text-sm font-mon  text-black ">
                      {selectedInvoice?.TOTAL_AMOUNT}
                    </p>
                  </div>
                  <div className=" w-full h-[40.5px] border-r-[1px] border-b-[1px]  border-black px-2 items-center flex justify-start">
                    <p className=" text-sm font-mon   text-black ">
                      {
                        // selectedInvoice?.EXCHANGE_RATE
                        !selectedInvoice?.CONVERSION_RATE
                          ? "N/A"
                          : selectedInvoice?.CONVERSION_RATE
                      }
                    </p>
                  </div>
                  {/* <div className=" w-full h-[40.5px] border-r-[1px] border-b-[1px]  border-black px-2 items-center flex justify-start">
                    <p className=" text-sm font-mon  text-black ">N/A</p>
                  </div> */}
                </div>
              </div>
              <div className=" flex-1 flex">
                <div className=" w-36  bg-blue-100 border-r-[1px]  border-b-[1px]  border-t-[1px] border-black">
                  <div className=" h-10 flex justify-start items-center  w-full border-b-[1px] border-black px-2">
                    <p className=" text-sm font-mon font-semibold">
                      Payment Method
                    </p>
                  </div>
                  <div className=" h-10 flex justify-start items-center w-full border-b-[1px] border-black px-2">
                    <p className=" text-sm font-mon font-semibold">GL Date</p>
                  </div>
                  <div className=" h-10 flex justify-start items-center  w-full border-b-[1px] border-black px-2">
                    <p className=" text-sm font-mon font-semibold">
                      Supplier ID
                    </p>
                  </div>
                  <div className="h-10 flex justify-start items-center  w-full border-b-[1px] border-black px-2">
                    <p className=" text-sm font-mon font-semibold">
                      Supplier Name
                    </p>
                  </div>
                  <div className="h-20   w-full border-b-[1px] border-black px-2">
                    <p className=" text-sm font-mon font-semibold">
                      Supplier Address
                    </p>
                  </div>
                  {/* <div className="h-10 flex justify-start items-center  w-full border-b-[1px] border-black px-2">
                    <p className=" text-sm font-mon font-semibold">
                      Inoice Currency
                    </p>
                  </div> */}
                  <div className="h-10 flex justify-start items-center  w-full border-b-[1px] border-black px-2">
                    <p className=" text-sm font-mon font-semibold">
                      Supplier Site
                    </p>
                  </div>
                  <div className="h-10 flex justify-start items-center  w-full border-b-[1px] border-black px-2">
                    <p className=" text-sm font-mon font-semibold">Full Name</p>
                  </div>
                  <div className="h-10 flex justify-start items-center  w-full   px-2">
                    <p className=" text-sm font-mon font-semibold">
                      Payee Bank A/C
                    </p>
                  </div>
                </div>

                <div className=" flex-1 ">
                  <div className=" w-full h-[40.5px] border-r-[1px] border-b-[1px] border-t-[1px] border-black px-2 items-center flex justify-start">
                    <p className=" text-sm font-mon  text-black ">
                      {selectedInvoice?.PAYMENT_METHOD_CODE}
                    </p>
                  </div>
                  <div className=" w-full h-10 border-r-[1px] border-b-[1px]  border-black px-2 items-center flex justify-start ">
                    <p className=" text-sm font-mon  text-black ">
                      {!selectedInvoice?.GL_DATE
                        ? "---"
                        : moment(selectedInvoice.GL_DATE).format(
                            "DD-MMMM-YYYY"
                          )}
                    </p>
                  </div>
                  <div className=" w-full h-10 border-r-[1px] border-b-[1px]  border-black px-2 items-center flex justify-start">
                    <p className=" text-sm font-mon  text-black ">
                      {selectedInvoice?.SUPPLIER_ID}
                    </p>
                  </div>
                  <div className=" w-full h-10 border-r-[1px] border-b-[1px]  border-black px-2 items-center flex justify-start">
                    <p className=" text-sm font-mon  text-black ">
                      {selectedInvoice?.SUPPLIER_FULL_NAME}
                    </p>
                  </div>
                  <div className=" w-full h-20 border-r-[1px] border-b-[1px]  border-black px-2 items-start flex justify-start">
                    <p className=" text-sm font-mon  text-black ">
                      {siteDetails?.ADDRESS_LINE2}
                    </p>
                  </div>
                  {/* <div className=" w-full h-10 border-r-[1px] border-b-[1px]  border-black px-2 items-center flex justify-start">
                    <p className=" text-sm font-mon  text-black ">
                      
                    </p>
                  </div> */}
                  <div className=" w-full h-10 border-r-[1px] border-b-[1px]  border-black px-2 items-center flex justify-start">
                    <p className=" text-sm font-mon  text-black ">
                      {siteDetails?.ADDRESS_LINE1}
                    </p>
                  </div>
                  <div className=" w-full h-10 border-r-[1px] border-b-[1px]  border-black px-2 items-center flex justify-start">
                    <p className=" text-sm font-mon  text-black ">
                      {selectedInvoice?.SUPPLIER_FULL_NAME}
                    </p>
                  </div>
                  <div className=" w-full h-[40.5px] border-r-[1px] border-b-[1px]  border-black px-2 items-center flex justify-start">
                    <p className=" text-sm font-mon  text-black ">
                      {`${selectedInvoice?.BANK_DETAILS.BANK_NAME} | ${selectedInvoice?.BANK_DETAILS.ACCOUNT_NAME}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className=" w-full flex justify-between items-start">
              <div className=" flex-1 border-[0.5px] border-borderColor ">
                <div className="flex-1 bg-borderColor h-[0.5px]"></div>
                <div className=" flex-1 flex items-center ">
                  <div className=" w-28 h-10 bg-inputBg flex justify-start items-center px-2">
                    <p className=" text-midBlack text-sm font-mon font-semibold">
                      Organization Name
                    </p>
                  </div>
                  <div className=" flex-1 px-2">
                    <p className=" text-sm font-mon text-midBlack">
                      {selectedInvoice?.ORG_NAME}
                    </p>
                  </div>
                </div>
                <div className="flex-1 bg-borderColor h-[0.5px]"></div>
                <div className=" flex-1 flex justify-between items-center">
                  <div className=" flex-1 flex items-center ">
                    <div className=" w-28 h-10 bg-inputBg flex justify-start items-center px-2 ">
                      <p className=" text-midBlack text-sm font-mon font-semibold">
                        Order Ref
                      </p>
                    </div>

                    <div className=" flex-1 px-2">
                      <p className=" text-sm font-mon text-midBlack">
                        {selectedInvoice?.PO_NUMBER}
                      </p>
                    </div>
                  </div>
                  <div className=" flex-1 flex items-center ">
                    <div className=" w-20 h-10 bg-inputBg flex justify-start items-center px-2">
                      <p className=" text-midBlack text-sm font-mon font-semibold">
                        Date
                      </p>
                    </div>
                    <div className=" flex-1 px-2">
                      <p className=" text-sm font-mon text-midBlack">
                        {moment(selectedInvoice?.CREATION_DATE).format(
                          "DD-MM-YYYY"
                        ) || "---"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-borderColor h-[0.5px]"></div>
                <div className="w-full bg-borderColor h-[0.5px]"></div>

                <div className=" flex-1 flex items-center ">
                  <div className=" w-28 h-10 bg-inputBg flex justify-start items-center px-2">
                    <p className=" text-midBlack text-sm font-mon font-semibold">
                      Buyer Name
                    </p>
                  </div>
                  <div className=" flex-1 px-2">
                    <p className=" text-sm font-mon text-midBlack">
                      {invoiceDetails?.data.BUYER_NAME}
                    </p>
                  </div>
                </div>
                <div className="flex-1 bg-borderColor h-[0.5px]"></div>
                <div className=" flex-1 flex justify-between items-center">
                  <div className=" flex-1 flex items-center ">
                    <div className=" w-28 h-10 bg-inputBg flex justify-start items-center px-2 ">
                      <p className=" text-midBlack text-sm font-mon font-semibold">
                        Total Amount
                      </p>
                    </div>

                    <div className=" flex-1 px-2">
                      <p className=" text-sm font-mon text-midBlack">
                        {selectedInvoice?.TOTAL_AMOUNT}
                      </p>
                    </div>
                  </div>
                  <div className=" flex-1 flex items-center ">
                    <div className=" w-20 h-10 bg-inputBg flex justify-start items-center px-2">
                      <p className=" text-midBlack text-sm font-mon font-semibold">
                        Currency
                      </p>
                    </div>
                    <div className=" flex-1 px-2">
                      <p className=" text-sm font-mon text-midBlack">
                        {selectedInvoice?.CURRENCY_NAME}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              
              <div className=" w-28"></div>
              <div className=" flex-1 border-[0.5px] border-borderColor ">
                <div className=" flex-1 flex items-center ">
                  <div className=" flex-1 h-10  bg-red-100 flex justify-start items-center px-2">
                    <p className=" text-midBlack text-sm font-mon font-semibold">
                      Supplier
                    </p>
                  </div>
                 
                </div>
                <div className="flex-1 bg-borderColor h-[0.5px]"></div>

                <div className=" flex-1 flex justify-between items-center">
                  <div className=" flex-1 flex items-center ">
                    <div className=" w-28 h-10 bg-inputBg flex justify-start items-center px-2 ">
                      <p className=" text-midBlack text-sm font-mon font-semibold">
                        Invoice Ref
                      </p>
                    </div>

                    <div className=" flex-1 px-2">
                      <p className=" text-sm font-mon text-midBlack">
                        {selectedInvoice?.INVOICE_TYPE}
                      </p>
                    </div>
                  </div>
                  <div className=" flex-1 flex items-center ">
                    <div className=" w-20 h-10 bg-inputBg flex justify-start items-center px-2">
                      <p className=" text-midBlack text-sm font-mon font-semibold">
                        Invoice No
                      </p>
                    </div>
                    <div className=" flex-1 px-2">
                      <p className=" text-sm font-mon text-midBlack">
                        {selectedInvoice?.INVOICE_NUM}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-full bg-borderColor h-[0.5px]"></div>
                <div className=" flex-1 flex justify-between items-center">
                  <div className=" flex-1 flex items-center ">
                    <div className=" w-28 h-10 bg-inputBg flex justify-start items-center px-2 ">
                      <p className=" text-midBlack text-sm font-mon font-semibold">
                        Challan Ref
                      </p>
                    </div>

                    <div className=" flex-1 px-2"></div>
                  </div>
                  <div className=" flex-1 flex items-center ">
                    <div className=" w-20 h-10 bg-inputBg flex justify-start items-center px-2">
                      <p className=" text-midBlack text-sm font-mon font-semibold">
                        Date
                      </p>
                    </div>
                    <div className=" flex-1 px-2"></div>
                  </div>
                </div>

                <div className="w-full bg-borderColor h-[0.5px]"></div>

                <div className="flex-1 bg-borderColor h-[0.5px]"></div>
                <div className=" flex-1 flex justify-between items-center">
                  <div className=" flex-1 flex items-center ">
                    <div className=" w-28 h-10 bg-inputBg flex justify-start items-center px-2 ">
                      <p className=" text-midBlack text-sm font-mon font-semibold">
                        Mushok Ref
                      </p>
                    </div>

                    <div className=" flex-1 px-2">
                      {!invoiceDetails?.data.MUSHOK_FILE_NAME ? (
                        "---"
                      ) : (
                        <a
                          href={`${invoiceDetails?.file_path}/${invoiceDetails?.data.MUSHOK_FILE_NAME}`}
                          target="_blank"
                          className=" px-1 py-[1px] border-[1px] border-dashed border-midBlack flex justify-center items-center rounded-md text-midBlack font-mon"
                          rel="noreferrer"
                        >
                          view
                        </a>
                      )}
                    </div>
                  </div>
                  <div className=" flex-1 flex items-center ">
                    <div className=" w-12 h-10 bg-inputBg flex justify-start items-center px-2">
                      <p className=" text-midBlack text-sm font-mon font-semibold">
                        Date
                      </p>
                    </div>
                    <div className=" flex-1 px-2"></div>
                  </div>
                  
                </div>
                <div className="flex-1 bg-borderColor h-[0.5px]"></div>
                <div className=" flex-1 flex items-center ">
                  <div className=" w-28 h-10 bg-inputBg flex justify-start items-center px-2">
                    <p className=" text-midBlack text-sm font-mon font-semibold">
                      Billing Address
                    </p>
                  </div>
                  <div className=" flex-1 px-2">
                    {selectedInvoiceDetailsSite?.ADDRESS_LINE1}
                  </div>
                </div>
                <div className="flex-1 bg-borderColor h-[0.5px]"></div>
                <div className=" flex-1 flex items-center ">
                  <div className=" w-28 h-10 bg-inputBg flex justify-start items-center px-2">
                    <p className=" text-midBlack text-sm font-mon font-semibold">
                      Bank Details
                    </p>
                  </div>
                  <div className=" flex-1 px-2">
                    {invoiceDetails?.data.SUPPLIER_BANK_NAME}
                  </div>
                </div>
                <div className="flex-1 bg-borderColor h-[0.5px]"></div>
                <div className="flex-1 bg-borderColor h-[0.5px]"></div>
                <div className=" flex-1 flex items-center ">
                  <div className=" w-28 h-10 bg-inputBg flex justify-start items-center px-2">
                    <p className=" text-midBlack text-sm font-mon font-semibold">
                      Shipping Address
                    </p>
                  </div>
                  <div className=" flex-1 px-2">
                    {invoiceDetails?.shipping_details.LOCATION_CODE}
                  </div>
                </div>
              </div>
            </div> */}
            <div className=" my-8">
              {selectedInvoice?.INVOICE_TYPE !==
              "STANDARD" ? null : invoiceItemList.length === 0 ? (
                <div className=" w-full flex justify-center items-center">
                  <p className=" largeText">No Item Found</p>
                </div>
              ) : (
                <div className="overflow-auto max-h-[400px] rounded-lg shadow-lg custom-scrollbar">
                  <table className="min-w-full divide-y divide-gray-200 rounded-lg">
                    <thead className="bg-[#CAF4FF] sticky top-0 ">
                      <tr>
                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                          SL
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                          Item Description
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                          Specification
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                          UOM
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                          Order Quantity
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                          GRN Quantity
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                          Pre bill Qty
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                          Qty Unbilled
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                          Qty rejected
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                          Invoice Qty
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                          Unit Price
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                          Vat
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                          Total Price
                        </th>
                      </tr>
                    </thead>

                    {invoiceList2.map((e, i) => (
                      <tbody
                        key={i}
                        className="bg-white divide-y divide-gray-200"
                      >
                        <tr>
                          <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                            <div className="w-full overflow-auto custom-scrollbar text-center">
                              {i + 1}
                            </div>
                          </td>
                          <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar ">
                            <div className="w-80 overflow-auto custom-scrollbar text-center flex justify-center items-center">
                              {!e.ITEM_DESCRIPTION ? "-" : e.ITEM_DESCRIPTION}
                            </div>
                          </td>
                          <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                            <div className="w-80 overflow-auto custom-scrollbar text-center">
                              {!e.ITEM_SPECIFICATION
                                ? "-"
                                : e.ITEM_SPECIFICATION}
                            </div>
                          </td>
                          <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                            <div className="w-full overflow-auto custom-scrollbar text-center">
                              {!e.UOM ? "-" : e.UOM}
                            </div>
                          </td>
                          <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                            <div className="w-full overflow-auto custom-scrollbar text-center">
                              {!e.OFFERED_QUANTITY ? "-" : e.OFFERED_QUANTITY}
                            </div>
                          </td>
                          <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                            <div className="w-full overflow-auto custom-scrollbar text-center">
                              {!e.EBS_GRN_QTY ? "-" : e.EBS_GRN_QTY}
                            </div>
                          </td>
                          <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                            <div className="w-full overflow-auto custom-scrollbar text-center">
                              {!e.PRE_BILL_QTY ? "---" : e.PRE_BILL_QTY}
                            </div>
                          </td>
                          <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                            <div className="w-full overflow-auto custom-scrollbar text-center">
                              {e.AWARD_QUANTITY - e.PRE_BILL_QTY}
                            </div>
                          </td>
                          <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                            <div className="w-full overflow-auto custom-scrollbar text-center">
                              {!e.EBS_REJECT_QTY ? "-" : e.EBS_REJECT_QTY}
                            </div>
                          </td>
                          <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                            <div className="w-full overflow-auto custom-scrollbar text-center">
                              {!e.INVOICE_QTY ? "-" : e.INVOICE_QTY}
                            </div>
                          </td>
                          <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                            <div className="w-full overflow-auto custom-scrollbar text-center">
                              {!e.UNIT_PRICE ? "-" : e.UNIT_PRICE}
                            </div>
                          </td>
                          <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                            <div className="w-full overflow-auto custom-scrollbar text-center">
                              <div
                                className={` border-[1px] border-borderColor w-4 h-4 rounded-[4px] flex justify-center items-center ${
                                  e.BUYER_VAT_APPLICABLE === "Y"
                                    ? "bg-midGreen"
                                    : "bg-white"
                                }`}
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
                              {e.UNIT_PRICE *
                                (e.OFFERED_QUANTITY ? e.OFFERED_QUANTITY : 1)}
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
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>

            {/* <div className=" w-full flex items-start justify-between">
              <div className=" flex-1  border-[0.5px] border-borderColor">
                <div className=" w-full flex ">
                  <div className="w-28 text-midBlack text-sm font-mon h-10 bg-inputBg px-2">
                    Total Sold Amount
                  </div>
                  <div className=" flex-1"></div>
                </div>
                <div className="flex-1 bg-borderColor h-[0.5px]"></div>
                <div className=" w-full flex ">
                  <div className="w-28 text-midBlack text-sm font-mon h-10 bg-inputBg px-2">
                    Total Received Amount
                  </div>
                  <div className=" flex-1"></div>
                </div>
                <div className="flex-1 bg-borderColor h-[0.5px]"></div>
                <div className=" w-full flex ">
                  <div className="w-28 text-midBlack text-sm font-mon h-10 bg-inputBg px-2">
                    Ledger Balance
                  </div>
                  <div className=" flex-1"></div>
                </div>
              </div>
              <div className="w-6"></div>
              <div className=" flex-1  border-[0.5px] border-borderColor">
                <div className=" w-full flex ">
                  <div className="w-28 text-midBlack text-sm font-mon h-10 bg-inputBg px-2 flex justify-center items-center">
                    Deducated
                  </div>
                  <div className=" flex-1 flex justify-center items-center text-midBlack text-sm font-mon h-10 px-2">
                    Amount
                  </div>
                </div>
                <div className="flex-1 bg-borderColor h-[0.5px]"></div>
                <div className=" w-full flex ">
                  <div className="w-28 text-midBlack text-sm font-mon h-10 bg-inputBg px-2 flex justify-center items-center">
                    VDS
                  </div>
                  <div className=" flex-1"></div>
                </div>
                <div className="flex-1 bg-borderColor h-[0.5px]"></div>
                <div className=" w-full flex ">
                  <div className="w-28 text-midBlack text-sm font-mon h-10 bg-inputBg px-2 flex justify-center items-center">
                    TDS
                  </div>
                  <div className=" flex-1"></div>
                </div>
                <div className="flex-1 bg-borderColor h-[0.5px]"></div>
                <div className="flex-1 bg-borderColor h-[0.5px]"></div>
                <div className=" w-full flex ">
                  <div className="w-28 text-midBlack text-sm font-mon h-10 bg-inputBg px-2 flex justify-center items-center">
                    Security
                  </div>
                  <div className=" flex-1"></div>
                </div>
                <div className="flex-1 bg-borderColor h-[0.5px]"></div>
                <div className=" w-full flex ">
                  <div className="w-28 text-midBlack text-sm font-mon h-10 bg-inputBg px-2 flex justify-center items-center">
                    <div className="w-full flex flex-col items-center">
                      <p className="text-midBlack text-sm font-mon">Total</p>
                      <p className="text-midBlack text-sm font-mon">
                        Deducated
                      </p>
                    </div>
                  </div>
                  <div className=" flex-1"></div>
                </div>
              </div>
              <div className="w-6"></div>
              <div className=" flex-1 space-y-1">
                <div className=" w-full flex items-center justify-between">
                  <div className="text-midBlack text-sm font-mon">Subtotal</div>
                  <div className="text-midBlack text-sm font-mon">100</div>
                </div>
                <div className=" w-full flex items-center justify-between">
                  <div className="text-midBlack text-sm font-mon">Discount</div>
                  <div className="text-midBlack text-sm font-mon">100</div>
                </div>
                <div className=" w-full flex items-center justify-between">
                  <div className="text-midBlack text-sm font-mon">
                    Loading Charge
                  </div>
                  <div className="text-midBlack text-sm font-mon">100</div>
                </div>
                <div className=" w-full flex items-center justify-between">
                  <div className="text-midBlack text-sm font-mon">
                    Transport
                  </div>
                  <div className="text-midBlack text-sm font-mon">100</div>
                </div>
                <div className=" w-full flex items-center justify-between">
                  <div className="text-midBlack text-sm font-mon">
                    Miscellaneous
                  </div>
                  <div className="text-midBlack text-sm font-mon">100</div>
                </div>
                <div className=" w-full flex items-center justify-between">
                  <div className="text-midBlack text-sm font-mon">
                    Gross Total
                  </div>
                  <div className="text-midBlack text-sm font-mon">100</div>
                </div>

                <div className=" w-full flex items-center justify-between">
                  <div className="text-midBlack text-sm font-mon">Penalty</div>
                  <div className="text-midBlack text-sm font-mon">100</div>
                </div>
                <div className=" w-full flex items-center justify-between">
                  <div className="text-midBlack text-sm font-mon">
                    Prepayment Adjustment
                  </div>
                  <div className="text-midBlack text-sm font-mon">100</div>
                </div>
                <div className=" w-full flex items-center justify-between">
                  <div className="text-midBlack text-sm font-mon">
                    Deducted as Payable
                  </div>
                  <div className="text-midBlack text-sm font-mon">100</div>
                </div>
                <div className=" w-full flex items-center justify-between">
                  <div className="text-midBlack text-sm font-mon">
                    Net Payable
                  </div>
                  <div className="text-midBlack text-sm font-mon">100</div>
                </div>
              </div>
            </div> */}
          </div>
          {/* approval hierarchy */}
          <div></div>
          <div className="py-4">
            {hierarchyList.length === 0 ? (
              <div className=" w-full flex justify-center items-center font-mon">
                No Hierarchy Found
              </div>
            ) : (
              <div className="border border-solid p-4 rounded-lg">
                <h2 className="text-lg font-bold mb-4">Approval Hierarchy</h2>
                <table className="min-w-full bg-white rounded-md">
                  <thead className="rounded-md">
                    <tr className="bg-[#CAF4FF] rounded-md text-sm">
                      <th className="py-4 px-4 border-b text-[#637381] text-left font-semibold">
                        SL
                      </th>
                      <th className="py-4 px-4 border-b  text-left font-semibold">
                        Name
                      </th>
                      <th className="py-4 px-4 border-b text-[#637381] text-left font-semibold">
                        Date
                      </th>
                      <th className="py-4 px-4 border-b  text-[#637381] text-left font-semibold">
                        Note
                      </th>
                      <th className="py-4 px-4 border-b text-[#637381] text-left font-semibold">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {hierarchyList.map((approval, i) => (
                      <tr key={i} className="border-b">
                        <td className="py-2 px-4 text-left">{i + 1}</td>
                        <td className="py-2 px-4">
                          <div className="flex gap-2 items-center justify-start">
                            {approval.PROPIC_FILE_NAME ? (
                              <div>
                                <img
                                  src={
                                    `${imgPath}/` + approval.PROPIC_FILE_NAME
                                  }
                                  alt=""
                                  className="w-10 h-10 rounded-full"
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.5"
                                  stroke="currentColor"
                                  className="size-6"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                  />
                                </svg>
                              </div>
                            )}
                            <div>
                              <p>
                                {!approval.APPROVER_FULL_NAME
                                  ? "---"
                                  : approval.APPROVER_FULL_NAME}
                              </p>
                              <p className="text-[#637381] text-sm">
                                {approval.EMAIL_ADDRESS}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-2 px-4 text-left">
                          {!approval.ACTION_DATE ||
                          approval.ACTION_DATE === "--"
                            ? "---"
                            : isoToDateTime(approval.ACTION_DATE)}
                        </td>
                        <td className="py-2 px-4 text-left">
                          {approval.ACTION_NOTE ? approval.ACTION_NOTE : "---"}
                        </td>
                        {approval.ACTION_CODE === "0" ? (
                          <td className="py-2 px-4  font-semibold">
                            <div className="flex justify-start items-center rounded-md">
                              <p className="bg-[#ffe4de] text-[#ca534d] text-sm rounded-md px-3 py-1">
                                Rejected
                              </p>
                            </div>
                          </td>
                        ) : approval.ACTION_CODE === "1" ? (
                          <td className="py-2 px-4  font-semibold">
                            <div className="flex justify-start items-center rounded-md">
                              <p className="bg-[#dbf6e5] text-[#118d57] text-sm rounded-md px-3 py-1">
                                Approved
                              </p>
                            </div>
                          </td>
                        ) : (
                          <td className="py-2 px-4  font-semibold">
                            <div className="flex justify-start items-center rounded-md">
                              <p className="bg-[#fff1d6] text-[#b97206] text-sm rounded-md px-3 py-1">
                                Pending
                              </p>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className=" w-full flex justify-end mt-5 space-x-4">
              <button
                onClick={onCLickReject}
                className=" w-36 bg-[#FFE4DE] text-[#ca534d] rounded-md font-semibold font-mon"
              >
                Deny
              </button>

              <CommonButton
                onClick={rfiInfo}
                titleText={"Request for Information"}
                width="w-48"
                height="h-8"
                color=" bg-midBlack "
              />

              <CommonButton
                titleText="Approve"
                width="w-36"
                onClick={onCLickApprove}
                color="bg-midGreen"
              />
            </div>
          </div>
        </>
      )}
      {/* approve modal */}
      <Modal
        icon={<CloudArrowUp size={28} color="#1B4DFF" />}
        size="md"
        show={approveModal}
        onClose={onCLickApprove}
      >
        <Modal.Header>Give A Note</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <Textarea
              id="comment"
              placeholder="Leave a comment..."
              withBg={true}
              color="gray"
              border={true}
              rows={4}
              value={approveValue}
              onChange={handleApproveValueChange}
            />
            <div className=" w-full flex justify-end smallText">
              {approveValue.length}/150
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="outlineGray"
            className=" h-8 font-mon"
            onClick={closeApproveModal}
          >
            Cancel
          </Button>
          <Button
            type=""
            className="h-8 bg-midGreen text-white font-mon"
            onClick={handleApprove}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      {/* approve modal */}

      {/* reject modal */}
      <Modal
        icon={<CloudArrowUp size={28} color="#1B4DFF" />}
        size="md"
        show={rejectModal}
        onClose={onCLickReject}
      >
        <Modal.Header>Give A Note</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <Textarea
              id="comment"
              placeholder="Leave a comment..."
              withBg={true}
              color="gray"
              border={true}
              rows={4}
              value={rejectValue}
              onChange={handleRejectValueChange}
            />
            <div className=" w-full flex justify-end smallText">
              {rejectValue.length}/150
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="outlineGray"
            className=" h-8 font-mon"
            onClick={closeRejectModal}
          >
            Cancel
          </Button>
          <Button
            type=""
            className="h-8 bg-midGreen text-white font-mon"
            onClick={handleReject}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      {/* reject modal */}

      {/* rfi Modal start for invoice */}
      <Modal
        // icon={<CloudArrowUp size={28} color="#1B4DFF" />}
        size="md"
        show={rfqInfoModal}
        onClose={onClickAdditional}
      >
        <Modal.Header>Describe Your Need</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
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

              <div className="flex justify-between items-center">
                <div className="w-full">
                  {rfiError.rfiNote && (
                    <ValidationError title={rfiError.rfiNote} />
                  )}
                </div>
                <div className=" w-full flex justify-end smallText">
                  {additionalValue.length}/150
                </div>
              </div>
            </div>
            {/* <div className=" w-full flex justify-end smallText">
                {additionalValue.length}/150
              </div>
              {rfiError.rfiNote && <ValidationError title={rfiError.rfiNote} />} */}

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

              <div className="h-4"></div>

              {rfiError.viewer && <ValidationError title={rfiError.viewer} />}
            </div>
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

      {/* rfi Modal for invoice */}
    </div>
  );
}
