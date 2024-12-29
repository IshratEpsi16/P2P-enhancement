/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useRef, useState } from "react";
import PageTitle from "../../common_component/PageTitle";
import NavigationPan from "../../common_component/NavigationPan";
import InputLebel from "../../common_component/InputLebel";
import CommonButton from "../../common_component/CommonButton";
import DropDown from "../../common_component/DropDown";
import CommonSearchField from "../../common_component/CommonSearchField";
import DateRangePicker from "../../common_component/DateRangePicker";
import ReusablePopperComponent from "../../common_component/ReusablePopperComponent";
import ReusablePaginationComponent from "../../common_component/ReusablePaginationComponent";
import CheckIcon from "../../icons/CheckIcon";
import { useSupplierRfqPageContext } from "../context/SupplierRfqPageContext";
import CurrencyListService from "../../registration/service/bank/CurrencyListService";
import { useAuth } from "../../login_both/context/AuthContext";
import { useSupplierRfqIdContext } from "../context/SupplierRfqIdContext";
import RfqItemDetailsService from "../service/RfqItemDetailsService";
// import RfqItemListSupplier from "../interface/RfqItemListInterface";
import RfqItemListSupplier from "../inteface/RfqItemListSupplier";

import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import CommonInputField from "../../common_component/CommonInputField";
import WarningModal from "../../common_component/WarningModal";
import FilePickerInput from "../../common_component/FilePickerInput";
import RfqListQuotationStatusUpdateService from "../service/RfqListQuotationStatusUpdateService";
import { showSuccessToast } from "../../Alerts_Component/SuccessToast";
// import SelectedRfqItemInterface from "../interface/SelectedRfqItemInterface";

import SelectedRfqItemInterface from "../inteface/SelectedRfqItemInterface";

import moment from "moment";

import LogoLoading from "../../Loading_component/LogoLoading";
import useSupplierRfqStore from "../store/supplierRfqStore";
import useSupplierRfqPageStore from "../store/SupplierRfqPageStore";
import RfqListItemSupplier from "../inteface/RfqListItemSupplier";
import RfqObjectDetailsService from "../service/RfqObjectDetailsService";
import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";
import { CSVLink } from "react-csv";
import SupplierQuotationDetailsInterface from "../../buyer_section/pr_item_list/interface/SupplierQuotationDetailsInterface";
import SupplierQuotationDetailsService from "../../buyer_section/pr_item_list/service/SupplierQuotationDetailsService";
import { Item } from "@radix-ui/react-select";
import usePrItemsStore from "../../buyer_section/pr/store/prItemStore";
import CountryListFromOracleService from "../../registration/service/basic_info/CountryListFromOracle";
import fetchFileUrlService from "../../common_service/fetchFileUrlService";

const list = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
const pan = ["Home", "RFQ List", "RFQ Item List"];
const initialNeedByDatesArray = list.map(() => ({
  startDate: new Date(),
  endDate: new Date(),
}));

export default function RfqItemListFoeSupplier() {
  //search

  // Define the Option interface
  interface Option {
    value: string;
    label: string;
  }

  interface CurrencyData {
    CURRENCY_CODE: string;
    NAME: string;
  }

  interface CountryData {
    VALUE: string;
    LABEL: string;
  }

  type vatOption = {
    value: string;
    label: string;
  };

  type RfqItem = {
    OFFERED_QUANTITY: string;
    UNIT_PRICE: string;
    VAT_TYPE: string;
    VAT_AMOUNT: string;
    TOTAL_LINE_AMOUNT: string;
  };

  interface PromiseDate {
    startDate: Date | null;
    endDate: Date | null;
  }

  // Define the type for the state object
  type SelectedCheckboxesState = Record<number, boolean>;

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [limit, setLimit] = useState(5);
  const [pageNo, setPageNo] = useState(1);
  const [currencyList, setCurrencyList] = useState<Option[]>([]);
  const [countryList, setCountryList] = useState<Option[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [rfqItemList, setRfqItemList] = useState<RfqItemListSupplier[] | []>(
    []
  );
  const emailRef = useRef<HTMLInputElement | null>(null);
  const [email, setEmail] = useState<string>("");
  // prepayment date
  const [promiseDates, setPromiseDates] = useState<PromiseDate[]>(
    rfqItemList.map(() => ({
      startDate: null,
      endDate: null, // Set the endDate to the end of the current year
    }))
  );
  const [selectedCheckboxes, setSelectedCheckboxes] =
    useState<SelectedCheckboxesState>({});
  const [selectedItemList, setSelectedItemList] = useState<
    RfqItemListSupplier[]
  >([]);
  const [isRejectOpen, setIsRejectOpen] = useState<boolean>(false);
  const [isUndoOpen, setIsUndoOpen] = useState<boolean>(false);
  const [submissionStatus, setSubmissionStatus] = useState("");

  // const [prItemList, setPrItemList] = useState<RfqItemListSupplier[] | []>([]);

  const { selectedRfq, setSelectedRfq } = useSupplierRfqIdContext();

  const [isAccepted, setIsAccepted] = useState<boolean>(false);

  const { token, userId } = useAuth();

  //store
  const { setRfqObjectDetailsInStore } = usePrItemsStore();

  useEffect(() => {
    console.log("status", selectedRfq?.RESPONSE_STATUS);

    if (selectedRfq == null) {
      console.log("get object call");

      getObject();
    } else {
      setIsAccepted(selectedRfq.RESPONSE_STATUS === 1 ? true : false);
    }
    getCurrency();

    getCountryList();

    console.log("RFQ ID:", rfqIdInStore);
    console.log("RFQ type:", rfqTypeInStore);
  }, []);

  //shadid add for object add

  const [rfqObjectDetails, setRfqObjectDetails] =
    useState<RfqListItemSupplier | null>(null);

  const getObject = async () => {
    try {
      const result = await RfqObjectDetailsService(
        token!,
        rfqIdInStore!,
        userId!
      );

      console.log(result.data);

      if (result.data.status === 200) {
        setRfqObjectDetails(result.data.data);
        setRfqObjectDetailsInStore(result.data.data);
        if (result.data.data.RESPONSE_STATUS === 2) {
          //shadid url click
          const res = await RfqListQuotationStatusUpdateService(
            token!,
            selectedRfq?.RFQ_ID!,
            selectedRfq?.RESPONSE_STATUS! === 0
              ? 2
              : selectedRfq?.RESPONSE_STATUS!,
            selectedRfq?.SUBMISSION_STATUS!
          );
          //shadid url click
        }
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {}
  };

  const objectDetailsSet = () => {
    if (rfqObjectDetails != null) {
      console.log("call object details");
      console.log(rfqObjectDetails);
      setSelectedRfq(rfqObjectDetails);

      setIsAccepted(rfqObjectDetails.RESPONSE_STATUS === 1 ? true : false);
    }
  };

  useEffect(() => {
    console.log("set selected");

    objectDetailsSet();
  }, [rfqObjectDetails]);

  useEffect(() => {
    console.log("item call");

    getRfqList();
  }, [selectedRfq]);

  //shadid add for object add

  //shadid ADD
  const [rfqHeaderFilePath, setRfqHeaderFilePath] = useState<string>("");
  const [rfqHeaderTermFilePath, setRfqHeaderTermFilePath] =
    useState<string>("");
  const [buyerLineFilepath, setBuyerLineFilepath] = useState<string>("");
  const [supplierLineFilepath, setSupplierLineFilepath] = useState<string>("");
  //shadid ADD

  const getRfqList = async () => {
    // setIsLoading(true);
    if (selectedRfq) {
      const result = await RfqItemDetailsService(
        token!,
        selectedRfq.RFQ_ID,
        userId!,
        0,
        10000
      );
      console.log(selectedRfq.RFQ_ID);
      console.log(userId);

      console.log(selectedRfq);
      console.log(result.data);

      if (result.data.status === 200) {
        const lineItems = result.data.line_items.map(
          (item: RfqItemListSupplier) => ({
            ...item,
            TOTAL_LINE_AMOUNT: "0",
            VAT_TYPE: "Percentage", // Set VAT_TYPE to 'Percentage' initially
            VAT_AMOUNT: "0",
            SUPPLIER_VAT_APPLICABLE: "N",
            WARRANTY_BY_SUPPLIER: "N",
            OFFERED_QUANTITY: item.EXPECTED_QUANTITY.toString() || "",
          })
        );
        setRfqHeaderFilePath(result.data.rfq_header_file);
        setRfqHeaderTermFilePath(result.data.rfq_header_term_file);
        setBuyerLineFilepath(result.data.buyer_line_file);
        setSupplierLineFilepath(result.data.supplier_line_file);

        setRfqItemList(lineItems);
        // Set the VAT types for all items to "Percentage"
        setVatTypes(lineItems.map(() => "Percentage"));

        // Initialize offerQuantity with EXPECTED_QUANTITY values
        setOfferQuantity(
          lineItems.map(
            (item: RfqItemListSupplier) =>
              item.EXPECTED_QUANTITY.toString() || ""
          )
        );

        console.log("newData: ", result.data.line_items);

        // Set submissionStatus state here
        if (result.data.line_items.length > 0) {
          setSubmissionStatus(result.data.line_items[0].SUBMISSION_STATUS);
        }

        // setIsLoading(false);
      } else {
        showErrorToast(result.data.message);
      }

      console.log("id details: ", result.data.line_items);
    }

    // setIsLoading(false);
  };

  // console.log("sub status: ", submissionStatus);

  // Calculate today's date
  const today = new Date();
  // console.log("today", today);

  // Get the close date if selectedRfq is not null
  // console.log(new Date(selectedRfq?.CLOSE_DATE!));
  // console.log(new Date());
  let closeDate = new Date(selectedRfq?.CLOSE_DATE!);
  closeDate.setHours(closeDate.getHours());
  // console.log("close date", closeDate);

  // const closeDate = selectedRfq?.CLOSE_DATE
  //   ? new Date(selectedRfq.CLOSE_DATE)
  //   : null;
  const isCloseDatePassed = closeDate && closeDate <= today;
  // console.log("is closed", isCloseDatePassed);
  //is close false mane akhono close date ase ni

  let openDate = new Date(selectedRfq?.OPEN_DATE!);
  openDate.setHours(openDate.getHours());
  const isOpenDatePassed = openDate && openDate <= today;
  // console.log("open date", openDate);
  // console.log("is open", isOpenDatePassed);

  const canEdit = () => {
    return (
      canEditQuotationInStore === 1 && !isCloseDatePassed && isOpenDatePassed
    );
  };

  useEffect(() => {
    console.log("canEdit: ", canEdit());
  }, []);

  const getCurrency = async () => {
    const result = await CurrencyListService(token!);

    console.log("currency: ", result.data.data);

    if (result.data.status === 200) {
      // Convert API data to Option format
      const options: Option[] = result.data.data.map(
        (currency: CurrencyData) => ({
          value: currency.CURRENCY_CODE,
          label: currency.NAME,
        })
      );

      // Set the converted options to state
      setCurrencyList(options);
    }
  };

  const getCountryList = async () => {
    const result = await CountryListFromOracleService(token!);

    console.log("country: ", result.data.data);

    if (result.data.status === 200) {
      // Convert API data to Option format
      const options: Option[] = result.data.data.map(
        (country: CountryData) => ({
          value: country.VALUE,
          label: country.LABEL,
        })
      );

      // Set the converted options to state
      setCountryList(options);

      console.log(options);
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  const handleSearchInputChange = (val: string) => {
    setSearchInput(val);
  };

  const search = async () => {};

  //search

  // const handlePromiseDateChange = (newValue: PromiseDate, index: number) => {
  //   console.log("newValue:", newValue);
  //   const newPromiseDates = [...promiseDates];
  //   newPromiseDates[index] = newValue;
  //   setPromiseDates(newPromiseDates);
  // };
  // prepayment date

  // Function to handle checkbox click
  const handleCheckboxClick = (index: number) => {
    setSelectedCheckboxes((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle the checkbox state for the clicked row
    }));
  };

  // const toggleprItemSelection = (employee: RfqItemListSupplier) => {
  //   setSelectedItemList((prevSelectedList) => {
  //     const isEmployeeSelected = prevSelectedList.some(
  //       (emp) => emp.PR_NUMBER === employee.PR_NUMBER
  //     );

  //     if (isEmployeeSelected) {
  //       // If the employee is already selected, remove it
  //       return prevSelectedList.filter(
  //         (emp) => emp.PR_NUMBER !== employee.PR_NUMBER
  //       );
  //     } else {
  //       // If the employee is not selected, add it
  //       return [...prevSelectedList, employee];
  //     }
  //   });
  // };

  const toggleprItemSelection = (employee: RfqItemListSupplier) => {
    setSelectedRfqItemList((prevSelectedList) => {
      const isEmployeeSelected = prevSelectedList.some(
        (emp) => emp.REQUISITION_LINE_ID === employee.REQUISITION_LINE_ID
      );

      if (isEmployeeSelected) {
        // If the employee is already selected, remove it
        return prevSelectedList.filter(
          (emp) => emp.REQUISITION_LINE_ID !== employee.REQUISITION_LINE_ID
        );
      } else {
        // If the employee is not selected, add it
        return [
          ...prevSelectedList,
          employee as unknown as SelectedRfqItemInterface,
        ];
        // Ensure employee is casted to SelectedPrItemInterface
      }
    });
  };

  // const toggleprItemSelection2 = (
  //   employee: SupplierQuotationDetailsInterface
  // ) => {
  //   setSelectedRfqItemList2((prevSelectedList) => {
  //     const isEmployeeSelected = prevSelectedList.some(
  //       (emp) => emp.REQUISITION_LINE_ID === employee.REQUISITION_LINE_ID
  //     );

  //     if (isEmployeeSelected) {
  //       // If the employee is already selected, remove it
  //       return prevSelectedList.filter(
  //         (emp) => emp.REQUISITION_LINE_ID !== employee.REQUISITION_LINE_ID
  //       );
  //     } else {
  //       // If the employee is not selected, add it
  //       return [
  //         ...prevSelectedList,
  //         employee as unknown as SelectedRfqItemInterface,
  //       ];
  //       // Ensure employee is casted to SelectedPrItemInterface
  //     }
  //   });
  // };

  const toggleprItemSelection2 = (
    employee: SupplierQuotationDetailsInterface
  ) => {
    setSelectedRfqItemList2((prevSelectedList) => {
      const isEmployeeSelected = prevSelectedList.some(
        (emp) => emp.REQUISITION_LINE_ID === employee.REQUISITION_LINE_ID
      );

      if (isEmployeeSelected) {
        // If the employee is already selected, remove it
        return prevSelectedList.filter(
          (emp) => emp.REQUISITION_LINE_ID !== employee.REQUISITION_LINE_ID
        );
      } else {
        // If the employee is not selected, add it with the current offered quantity
        const offeredQuantity =
          quotationList.find(
            (item) => item.REQUISITION_LINE_ID === employee.REQUISITION_LINE_ID
          )?.OFFERED_QUANTITY || 0; // Default to 0 if not found

        const newEmployee = {
          ...employee,
          OFFERED_QUANTITY: offeredQuantity, // Include current offered quantity
        } as unknown as SelectedRfqItemInterface;

        return [...prevSelectedList, newEmployee];
      }
    });
  };

  //   const toggleprItemSelection2 = (employee: SupplierQuotationDetailsInterface) => {
  //     setSelectedRfqItemList2((prevSelectedList) => {
  //         const isEmployeeSelected = prevSelectedList.some(
  //             (emp) => emp.REQUISITION_LINE_ID === employee.REQUISITION_LINE_ID
  //         );

  //         if (isEmployeeSelected) {
  //             // If the employee is already selected, remove it
  //             return prevSelectedList.filter(
  //                 (emp) => emp.REQUISITION_LINE_ID !== employee.REQUISITION_LINE_ID
  //             );
  //         } else {
  //             // If the employee is not selected, ensure it includes the latest values
  //             const updatedEmployee = quotationList.find(
  //                 (item) => item.REQUISITION_LINE_ID === employee.REQUISITION_LINE_ID
  //             );

  //             return [...prevSelectedList, updatedEmployee];
  //         }
  //     });
  // };

  //date rang

  const [approveDates, setApproveDates] = useState({
    startDate: null,
    endDate: null, // Set the endDate to the end of the current year
  });

  const handleApproveDateChange = (newValue: any) => {
    console.log("newValue:", newValue);
    setApproveDates(newValue);
  };

  //date range

  // aita holo popper er jonno
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;
  //end poppoer

  //pagination
  //   const next = async () => {};
  //   const previous = async () => {};
  //pagination  === 2 ? 1 : resStatus === 1 ? 2 : resStatus

  const download = async () => {};

  const accept = async () => {
    // const res = await RfqListQuotationStatusUpdateService(token!, selectedRfq?.RFQ_ID!, selectedRfq?.RESPONSE_STATUS === 2 ? 1 : selectedRfq?.RESPONSE_STATUS === 1 ? 2 : selectedRfq?.RESPONSE_STATUS === 0 ? 1 : selectedRfq?.RESPONSE_STATUS!, selectedRfq?.SUBMISSION_STATUS!);

    const res = await RfqListQuotationStatusUpdateService(
      token!,
      selectedRfq?.RFQ_ID!,
      1,
      selectedRfq?.SUBMISSION_STATUS!
    );
    if (!selectedRfq) {
      setIsLoading(false);
      return;
    }

    if (res.data.status === 200) {
      showSuccessToast("Accepted Successfully");
      selectedRfq.RESPONSE_STATUS = 1;
      setIsAccepted(true);
    }
  };

  const openRejectModal = async () => {
    setIsRejectOpen(true);
  };

  const closeModal = () => {
    setIsRejectOpen(false);
  };

  const rejectModal = async () => {
    // console.log("reject done");
  };

  const reject = async () => {
    // setIsLoading(true);
    const res = await RfqListQuotationStatusUpdateService(
      token!,
      selectedRfq?.RFQ_ID!,
      3,
      selectedRfq?.SUBMISSION_STATUS!
    );
    if (!selectedRfq) {
      setIsLoading(false);
      return;
    }

    if (res.data.status === 200) {
      selectedRfq.RESPONSE_STATUS = 3;
      showSuccessToast(res.data.message);
    }
    // setIsLoading(false);
  };

  const undo = async () => {
    // setIsLoading(true);
    const res = await RfqListQuotationStatusUpdateService(
      token!,
      selectedRfq?.RFQ_ID!,
      1,
      selectedRfq?.SUBMISSION_STATUS!
    );
    if (!selectedRfq) {
      setIsLoading(false);
      return;
    }

    if (res.data.status === 200) {
      selectedRfq.RESPONSE_STATUS = 1;
      showSuccessToast(res.data.message);
    }
    // setIsLoading(false);
  };

  const undoReject = async () => {
    setIsUndoOpen(true);
  };

  const closeUndoModal = () => {
    setIsUndoOpen(false);
  };

  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  const [currencyCode, setCurrencyCode] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("");
  const [currencyName, setCurrencyName] = useState<string>("");

  const handleCountryChange = (value: string, index: number) => {
    console.log("country: ", value);

    const selectedCountry = countryList.find(
      (country) => country.value === value
    );

    if (selectedCountry) {
      const newRfqItemList = [...rfqItemList];

      setCountryCode(selectedCountry.value);

      // Update the CURRENCY_CODE and CURRENCY_NAME in the rfqItemList at the given index
      newRfqItemList[index].COUNTRY_CODE = selectedCountry.value;
      newRfqItemList[index].COUNTRY_NAME = selectedCountry.label;

      // Log the updated values
      console.log("Updated COUNTRY_CODE: ", newRfqItemList[index].COUNTRY_CODE);
      console.log("Updated COUNTRY_NAME: ", newRfqItemList[index].COUNTRY_NAME);

      // Update the state with the new rfqItemList
      setRfqItemList(newRfqItemList);
    }

    setSelectedCurrency(value);
  };

  //pagination

  // Function to convert a single SupplierQuotationDetailsInterface to SelectedRfqItemInterface
  function convertToSelectedRfqItem(
    supplierQuotation: SupplierQuotationDetailsInterface
  ): SelectedRfqItemInterface {
    return {
      RFQ_LINE_ID: supplierQuotation.RFQ_LINE_ID,
      RFQ_ID: supplierQuotation.RFQ_ID,
      REQUISITION_HEADER_ID: supplierQuotation.REQUISITION_HEADER_ID,
      REQUISITION_LINE_ID: supplierQuotation.REQUISITION_LINE_ID,
      PR_NUMBER: supplierQuotation.PR_NUMBER,
      LINE_NUM: supplierQuotation.LINE_NUM.toString(), // Convert number to string
      LINE_TYPE_ID: supplierQuotation.LINE_TYPE_ID,
      ITEM_CODE: supplierQuotation.ITEM_CODE,
      ITEM_DESCRIPTION: supplierQuotation.ITEM_DESCRIPTION,
      ITEM_SPECIFICATION: supplierQuotation.ITEM_SPECIFICATION,
      WARRANTY_DETAILS: supplierQuotation.WARRANTY_DETAILS,
      SUPPLIER_WARRANTY_DETAILS: supplierQuotation.SUPPLIER_WARRANTY_DETAILS,
      PACKING_TYPE: supplierQuotation.PACKING_TYPE,
      PROJECT_NAME: supplierQuotation.PROJECT_NAME,
      EXPECTED_QUANTITY: supplierQuotation.EXPECTED_QUANTITY.toString(), // Convert number to string
      EXPECTED_BRAND_NAME: supplierQuotation.EXPECTED_BRAND_NAME,
      EXPECTED_ORIGIN: supplierQuotation.EXPECTED_ORIGIN,
      LCM_ENABLE_FLAG: supplierQuotation.LCM_ENABLE_FLAG,
      UNIT_MEAS_LOOKUP_CODE: supplierQuotation.UNIT_MEAS_LOOKUP_CODE,
      NEED_BY_DATE: supplierQuotation.NEED_BY_DATE,
      ORG_ID: supplierQuotation.ORG_ID.toString(), // Convert number to string
      ATTRIBUTE_CATEGORY: supplierQuotation.ATTRIBUTE_CATEGORY,
      PR_FROM_DFF: supplierQuotation.PR_FROM_DFF,
      AUTHORIZATION_STATUS: supplierQuotation.AUTHORIZATION_STATUS,
      NOTE_TO_SUPPLIER: supplierQuotation.NOTE_TO_SUPPLIER,
      WARRANTY_ASK_BY_BUYER: supplierQuotation.WARRANTY_ASK_BY_BUYER,
      WARRANTY_BY_SUPPLIER: supplierQuotation.WARRANTY_BY_SUPPLIER,
      BUYER_VAT_APPLICABLE: supplierQuotation.BUYER_VAT_APPLICABLE,
      SUPPLIER_VAT_APPLICABLE: supplierQuotation.SUPPLIER_VAT_APPLICABLE,
      UNIT_PRICE: supplierQuotation.UNIT_PRICE,
      OFFERED_QUANTITY: supplierQuotation.OFFERED_QUANTITY.toString(), // Convert number to string
      // OFFERED_QUANTITY: supplierQuotation.OFFERED_QUANTITY
      //   ? supplierQuotation.OFFERED_QUANTITY.toString() // If user input is present
      //   : supplierQuotation.EXPECTED_QUANTITY.toString(),

      PROMISE_DATE: supplierQuotation.PROMISE_DATE,
      DELIVER_TO_LOCATION_ID:
        supplierQuotation.DELIVER_TO_LOCATION_ID.toString(), // Convert number to string
      DESTINATION_ORGANIZATION_ID:
        supplierQuotation.DESTINATION_ORGANIZATION_ID.toString(), // Convert number to string
      CS_STATUS: supplierQuotation.CS_STATUS,
      CREATION_DATE: supplierQuotation.CREATION_DATE,
      CREATED_BY: supplierQuotation.CREATED_BY.toString(), // Convert number to string
      LAST_UPDATED_BY: supplierQuotation.LAST_UPDATED_BY,
      LAST_UPDATE_DATE: supplierQuotation.LAST_UPDATE_DATE,
      BUYER_FILE_ORG_NAME: supplierQuotation.BUYER_FILE_ORG_NAME,
      BUYER_FILE_NAME: supplierQuotation.BUYER_FILE_NAME,
      SUP_FILE_ORG_NAME: supplierQuotation.SUP_FILE_ORG_NAME,
      SUPPLIER_FILE: supplierQuotation.SUPPLIER_FILE ?? "",

      ITEM_ID: supplierQuotation.ITEM_ID.toString(), // Convert number to string
      AVAILABLE_SPECS: supplierQuotation.AVAILABLE_SPECS,
      AVAILABLE_ORIGIN: supplierQuotation.AVAILABLE_ORIGIN,
      AVAILABLE_BRAND_NAME: supplierQuotation.AVAILABLE_BRAND_NAME,
      QUOT_LINE_ID: supplierQuotation.QUOT_LINE_ID,
      AMOUNT_INCLUDING_VAT: supplierQuotation.AMOUNT_INCLUDING_VAT ?? "",
      TOTAL_LINE_AMOUNT: supplierQuotation.TOTAL_LINE_AMOUNT ?? "", // Assuming this is a new field not present in SupplierQuotationDetailsInterface
      VAT_TYPE: supplierQuotation.VAT_TYPE ?? "", // Assuming this is a new field not present in SupplierQuotationDetailsInterface
      VAT_VALUE: supplierQuotation.VAT_VALUE ?? "", // Assuming this is a new field not present in SupplierQuotationDetailsInterface
      VAT_AMOUNT: supplierQuotation.VAT_AMOUNT ?? "", // Assuming this is a new field not present in SupplierQuotationDetailsInterface
      TOLERANCE: supplierQuotation.TOLERANCE,
      FREIGHT_CHARGE: supplierQuotation.FREIGHT_CHARGE,
      COUNTRY_CODE: supplierQuotation.COUNTRY_CODE,
      COUNTRY_NAME: supplierQuotation.COUNTRY_NAME,
    };
  }

  function convertArrayToSelectedRfqItems(
    supplierQuotations: SupplierQuotationDetailsInterface[]
  ): SelectedRfqItemInterface[] {
    return supplierQuotations.map(convertToSelectedRfqItem);
  }

  // submit button
  // const submitNext = async () => {
  //   // setSupplierRfqPage(3);

  //   console.log(selectedRfqItemList.length);
  //   console.log(selectedRfqItemList);
  //   console.log("spec: ", availableSpec);
  //   console.log("brand: ", availableBrand);
  //   console.log("Origin: ", availableOrigin);

  //   // Check if no items are selected
  //   if (selectedRfqItemList.length === 0) {
  //     showErrorToast("Please select at least one item before continuing.");
  //     return;
  //   }

  //   if (selectedRfqItemList.length !== 0) {
  //     const hasInvalidDates = selectedRfqItemList.some(
  //       (item) => item.PROMISE_DATE === "Invalid date"
  //     );
  //     // const hasInvalidDates = selectedPrItemList.some(
  //     //   (item) =>
  //     //     item.NEED_BY_DATE === "Invalid date" &&
  //     //     prItemList.some(
  //     //       (prItem) => prItem.REQUISITION_LINE_ID === item.REQUISITION_LINE_ID
  //     //     )
  //     // );
  //     console.log(hasInvalidDates);

  //     if (!hasInvalidDates) {
  //       // If there are no invalid dates, proceed to page 2

  //       // Validate inputs
  //       for (let i = 0; i < selectedRfqItemList.length; i++) {
  //         const item = selectedRfqItemList[i];

  //         // Check for missing fields
  //         if (!availableSpec[i] || availableSpec[i].trim() === "") {
  //           showErrorToast(`Please give input Available Spec for item at ${i + 1}`);
  //           return;
  //         }

  //         if (!availableBrand[i] || availableBrand[i].trim() === "") {
  //           showErrorToast(`Please give input Available Brand for item at ${i + 1}`);
  //           return;
  //         }

  //         if (!availableOrigin[i] || availableOrigin[i].trim() === "") {
  //           showErrorToast(`Please give input Available Origin for item at ${i + 1}`);
  //           return;
  //         }

  //         if (!offerQuantity[i] || offerQuantity[i].trim() === "") {
  //           showErrorToast(`Please give input Offer Quantity for item at ${i + 1}`);
  //           return;
  //         }

  //         if (!unitPrice[i] || unitPrice[i].trim() === "") {
  //           showErrorToast(`Please give input Unit Price for item at ${i + 1}`);
  //           return;
  //         }

  //         // Additional validation for offer quantity
  //         const expectedQuantity = parseFloat(selectedRfqItemList[i].EXPECTED_QUANTITY);
  //         const offerQty = parseFloat(offerQuantity[i]);

  //         console.log("Expect: ", expectedQuantity);

  //         if (isNaN(expectedQuantity) || isNaN(offerQty)) {
  //           showErrorToast(`Invalid quantity values for item at ${i + 1}`);
  //           return;
  //         }

  //         if (offerQty > expectedQuantity) {
  //           showErrorToast(`Offer quantity cannot be more than expected quantity for item ${i + 1}`);
  //           return;
  //         }
  //       }

  //       // setPrItems2(selectedPrItemList2);
  //       if (rfqResponseStatusInStore === 4 && canEditQuotationInStore === 1) {
  //         // setRfqItems(selectedItemsNew);
  //         const listofConverted = convertArrayToSelectedRfqItems(quotationList);
  //         setRfqItems(listofConverted);
  //       } else {
  //         setRfqItems(selectedRfqItemList);
  //         setPageNoRfq(3);
  //       }
  //     }
  //   }
  // };

  const submitNext = async () => {
    // setSupplierRfqPage(3);

    console.log(selectedRfqItemList.length);
    console.log(selectedRfqItemList);
    console.log("spec: ", availableSpec);
    console.log("brand: ", availableBrand);
    console.log("Origin: ", availableOrigin);

    // Check if no items are selected
    if (selectedRfqItemList.length === 0) {
      showErrorToast("Please select at least one item before continuing.");
      return;
    }

    // New Promise Date Validation
    for (let i = 0; i < selectedRfqItemList.length; i++) {
      const item = selectedRfqItemList[i];
      const itemIndex = rfqItemList.findIndex(
        (rfqItem) => rfqItem.REQUISITION_LINE_ID === item.REQUISITION_LINE_ID
      );

      // Check if promise date is missing or invalid
      if (
        !rfqItemList[itemIndex]?.PROMISE_DATE ||
        rfqItemList[itemIndex]?.PROMISE_DATE.trim() === ""
      ) {
        showErrorToast(
          `Please select a promise date for selected item ${i + 1}`
        );
        return;
      }
    }

    if (selectedRfqItemList.length !== 0) {
      const hasInvalidDates = selectedRfqItemList.some(
        (item) => item.PROMISE_DATE === "Invalid date"
      );
      // const hasInvalidDates = selectedPrItemList.some(
      //   (item) =>
      //     item.NEED_BY_DATE === "Invalid date" &&
      //     prItemList.some(
      //       (prItem) => prItem.REQUISITION_LINE_ID === item.REQUISITION_LINE_ID
      //     )
      // );
      console.log(hasInvalidDates);

      if (!hasInvalidDates) {
        // If there are no invalid dates, proceed to page 2

        // Validate inputs
        for (let i = 0; i < selectedRfqItemList.length; i++) {
          const item = selectedRfqItemList[i];
          const itemIndex = rfqItemList.findIndex(
            (rfqItem) =>
              rfqItem.REQUISITION_LINE_ID === item.REQUISITION_LINE_ID
          );

          if (itemIndex === -1) {
            showErrorToast(`Item not found in rfqItemList`);
            return;
          }

          // Check for missing fields
          if (
            !availableSpec[itemIndex] ||
            availableSpec[itemIndex].trim() === ""
          ) {
            showErrorToast(
              `Please give input Available Spec for selected item ${i + 1}`
            );
            return;
          }

          if (
            !availableBrand[itemIndex] ||
            availableBrand[itemIndex].trim() === ""
          ) {
            showErrorToast(
              `Please give input Available Brand for selected item ${i + 1}`
            );
            return;
          }

          // if (
          //   !availableOrigin[itemIndex] ||
          //   availableOrigin[itemIndex].trim() === ""
          // ) {
          //   showErrorToast(
          //     `Please give input Available Origin for selected item ${i + 1}`
          //   );
          //   return;
          // }

          if (
            !rfqItemList[itemIndex]?.COUNTRY_CODE ||
            rfqItemList[itemIndex].COUNTRY_CODE.trim() === ""
          ) {
            showErrorToast(`Please select a Origin for selected item ${i + 1}`);
            return;
          }

          if (
            !offerQuantity[itemIndex] ||
            offerQuantity[itemIndex].trim() === ""
          ) {
            showErrorToast(
              `Please give input Offer Quantity for selected item ${i + 1}`
            );
            return;
          }

          if (rfqTypeInStore === "B") {
            if (!unitPrice[itemIndex] || unitPrice[itemIndex].trim() === "") {
              showErrorToast(
                `Please give input Unit Price for selected item ${i + 1}`
              );
              return;
            }
          }

          // Additional validation for offer quantity
          const expectedQuantity = parseFloat(item.EXPECTED_QUANTITY);
          const offerQty = parseFloat(offerQuantity[itemIndex]);

          console.log("Expect: ", expectedQuantity);

          if (isNaN(expectedQuantity) || isNaN(offerQty)) {
            showErrorToast(
              `Invalid quantity values for selected item ${i + 1}`
            );
            return;
          }

          if (offerQty > expectedQuantity) {
            showErrorToast(
              `Offer quantity cannot be more than expected quantity for selected item ${
                i + 1
              }`
            );
            return;
          }
        }

        // setPrItems2(selectedPrItemList2);
        if (rfqResponseStatusInStore === 4 && canEditQuotationInStore === 1) {
          // setRfqItems(selectedItemsNew);
          const listofConverted = convertArrayToSelectedRfqItems(quotationList);
          setRfqItems(listofConverted);
        } else {
          setRfqItems(selectedRfqItemList);
          setPageNoRfq(3);
        }
      }
    }
  };

  const submitNext2 = async () => {
    // setSupplierRfqPage(3);

    console.log(selectedRfqItemList2.length);
    console.log(selectedRfqItemList2);
    console.log("spec: ", availableSpec);
    console.log("brand: ", availableBrand);
    console.log("Origin: ", availableOrigin);
    console.log("offerQ2: ", offerQuantity);

    // Check if no items are selected
    if (selectedRfqItemList2.length === 0) {
      showErrorToast("Please select at least one item before continuing.");
      return;
    }

    if (selectedRfqItemList2.length !== 0) {
      const hasInvalidDates = selectedRfqItemList2.some(
        (item) => item.PROMISE_DATE === "Invalid date"
      );
      // const hasInvalidDates = selectedPrItemList.some(
      //   (item) =>
      //     item.NEED_BY_DATE === "Invalid date" &&
      //     prItemList.some(
      //       (prItem) => prItem.REQUISITION_LINE_ID === item.REQUISITION_LINE_ID
      //     )
      // );
      console.log(hasInvalidDates);

      if (!hasInvalidDates) {
        // If there are no invalid dates, proceed to page 2

        // Validate inputs
        for (let i = 0; i < selectedRfqItemList2.length; i++) {
          const item = selectedRfqItemList2[i];
          const itemIndex = rfqItemList.findIndex(
            (rfqItem) =>
              rfqItem.REQUISITION_LINE_ID === item.REQUISITION_LINE_ID
          );

          console.log("index: ", itemIndex);

          if (itemIndex === -1) {
            showErrorToast(`Item not found in rfqItemList`);
            return;
          }

          console.log("offer", item.OFFERED_QUANTITY[itemIndex]);

          // Check for missing fields
          if (!item.AVAILABLE_SPECS || item.AVAILABLE_SPECS.trim() === "") {
            showErrorToast(
              `Please give input Available Spec for selected item ${i + 1}`
            );
            return;
          }

          if (
            !item.AVAILABLE_BRAND_NAME ||
            item.AVAILABLE_BRAND_NAME.trim() === ""
          ) {
            showErrorToast(
              `Please give input Available Brand for selected item ${i + 1}`
            );
            return;
          }

          // if (!item.AVAILABLE_ORIGIN || item.AVAILABLE_ORIGIN.trim() === "") {
          //   showErrorToast(`Please give input Available Origin for selected item ${i + 1}`);
          //   return;
          // }

          if (!item.COUNTRY_CODE || item.COUNTRY_CODE.trim() === "") {
            showErrorToast(`Please select Origin for selected item ${i + 1}`);
            return;
          }

          if (!item.PROMISE_DATE || item.PROMISE_DATE.trim() === "") {
            showErrorToast(
              `Please select Promise Date for selected item ${i + 1}`
            );
            return;
          }

          // if (!item.PROMISE_DATE || item.PROMISE_DATE.trim() === "") {
          //   showErrorToast(
          //     `Please select valid Promise Date for selected item ${i + 1}`
          //   );
          //   return;
          // }

          if (
            item.OFFERED_QUANTITY === undefined ||
            item.OFFERED_QUANTITY === null ||
            parseFloat(item.OFFERED_QUANTITY) <= 0
          ) {
            showErrorToast(
              `Please provide a valid Offer Quantity for selected item ${i + 1}`
            );
            return;
          }

          if (rfqTypeInStore === "B") {
            // Ensure UNIT_PRICE is checked and converted to number if it is a string
            const unitPrice = parseFloat(item.UNIT_PRICE);

            if (isNaN(unitPrice) || unitPrice <= 0) {
              showErrorToast(
                `Please give input Unit Price for selected item ${i + 1}`
              );
              return;
            }
          }

          // Additional validation for offer quantity
          const expectedQuantity = parseFloat(item.EXPECTED_QUANTITY);
          // const offerQty = parseFloat(item.OFFERED_QUANTITY);
          const offerQty = parseFloat(offeredQuantityList2[i]);

          console.log("Expect: ", expectedQuantity);
          console.log("offer: ", offerQty);
          console.log("offer: ", parseFloat(item.OFFERED_QUANTITY).toFixed(2));
          console.log(
            "offer: ",
            parseFloat(parseFloat(item.OFFERED_QUANTITY).toFixed(2))
          );

          // if (isNaN(expectedQuantity) || isNaN(offerQty)) {
          //   showErrorToast(
          //     `Invalid quantity values for selected item ${i + 1}`
          //   );
          //   return;
          // }

          if (
            parseFloat(parseFloat(item.OFFERED_QUANTITY).toFixed(2)) >
            expectedQuantity
          ) {
            showErrorToast(
              `Offer quantity cannot be more than expected quantity for selected item ${
                i + 1
              }`
            );
            return;
          }
        }

        // setPrItems2(selectedPrItemList2);
        // if (rfqResponseStatusInStore === 4 && canEditQuotationInStore === 1) {
        //   // setRfqItems(selectedItemsNew);
        //   const listofConverted = convertArrayToSelectedRfqItems(quotationList);
        //   setRfqItems(listofConverted);
        // } else {
        //   setRfqItems(selectedRfqItemList2);
        //   setPageNoRfq(3);
        // }

        if (canEditQuotationInStore === 1) {
          setRfqItems(selectedRfqItemList2);
          setPageNoRfq(3);
        } else {
          showErrorToast("You don't have permission for edit");
        }
      }
    }
  };

  const previous = async () => {
    setRfqTypeInStore(null);
    setRfqResponseStatusInStore(null);
    setPageNoRfq(1);
  };

  //context
  // const { supplierRfqPage, setSupplierRfqPage } = useSupplierRfqPageContext();
  const { setPageNoRfq } = useSupplierRfqPageStore();
  const navigateTo = () => {
    setPageNoRfq(2);
  };

  //attachment

  // Initialize an array to hold selected files for each row
  const [selectedFiles, setSelectedFiles] = useState<(File | null)[]>(
    Array(limit).fill(null)
  );

  // Function to handle file selection for a specific row
  const handleAttachmentFile = (file: File | null, rowIndex: number) => {
    const newPrItemList = [...rfqItemList];
    newPrItemList[rowIndex].SUPPLIER_FILE = file;
    setRfqItemList(newPrItemList);

    if (file) {
      // Handle the selected file here
      console.log(`Selected file for row ${rowIndex}:`, file);
    } else {
      // No file selected for this row
      console.log(`No file selected for row ${rowIndex}`);
    }
  };
  //attachment
  const handleAttachmentFile2 = (file: File | null, rowIndex: number) => {
    const newPrItemList = [...quotationList];
    newPrItemList[rowIndex].SUPPLIER_FILE = file!;
    setQuotationList(newPrItemList);

    if (file) {
      // Handle the selected file here
      console.log(`Selected file for row ${rowIndex}:`, file);
    } else {
      // No file selected for this row
      console.log(`No file selected for row ${rowIndex}`);
    }
  };
  //attachment

  // warranty
  const handleWarrantyEnable = (index: number) => {
    const newPrItemList = [...rfqItemList];
    newPrItemList[index].WARRANTY_BY_SUPPLIER =
      newPrItemList[index].WARRANTY_BY_SUPPLIER === "N" ? "Y" : "N";
    setRfqItemList(newPrItemList);

    console.log("warranty: ", newPrItemList[index].WARRANTY_BY_SUPPLIER);
  };

  // warranty

  // vat
  const handleVatEnable = (index: number) => {
    const newPrItemList = [...rfqItemList];
    newPrItemList[index].SUPPLIER_VAT_APPLICABLE =
      newPrItemList[index].SUPPLIER_VAT_APPLICABLE === "N" ? "Y" : "N";
    setRfqItemList(newPrItemList);

    console.log("vat: ", newPrItemList[index].SUPPLIER_VAT_APPLICABLE);
  };

  // const handleVatEnable2 = (index: number) => {
  //   const newPrItemList = [...quotationList];
  //   newPrItemList[index].SUPPLIER_VAT_APPLICABLE =
  //     newPrItemList[index].SUPPLIER_VAT_APPLICABLE === "N" ? "Y" : "N";
  //   setQuotationList(newPrItemList);

  //   console.log("vat: ", newPrItemList[index].SUPPLIER_VAT_APPLICABLE);
  // };

  // vat

  // quotation
  const [isSelectedAll, setIsSelectAll] = useState<boolean>(false);
  const [selectedRfqItemList, setSelectedRfqItemList] = useState<
    SelectedRfqItemInterface[] | []
  >([]);
  const [selectedRfqItemList2, setSelectedRfqItemList2] = useState<
    SelectedRfqItemInterface[] | []
  >([]);

  // const selectAll = () => {
  //   setIsSelectAll(true);
  //   const selectedItems: SelectedRfqItemInterface[] = rfqItemList.map(
  //     (item) => ({
  //       // ATTRIBUTE_CATEGORY: item.ATTRIBUTE_CATEGORY || "",
  //       RFQ_LINE_ID: item.RFQ_LINE_ID,
  //       // BUYER_FILE_NAME: item.BUYER_FILE_NAME || "",
  //       // BUYER_FILE_NAME:
  //       //   typeof item.BUYER_FILE_NAME === "string" ? item.BUYER_FILE_NAME : "",
  //       RFQ_ID: item.RFQ_ID,
  //       REQUISITION_HEADER_ID: item.REQUISITION_HEADER_ID,
  //       REQUISITION_LINE_ID: item.REQUISITION_LINE_ID,
  //       PR_NUMBER: item.PR_NUMBER,
  //       LINE_NUM: item.LINE_NUM,
  //       LINE_TYPE_ID: item.LINE_TYPE_ID,
  //       ITEM_CODE: item.ITEM_CODE,
  //       ITEM_DESCRIPTION: item.ITEM_DESCRIPTION,
  //       ITEM_SPECIFICATION: item.ITEM_SPECIFICATION,
  //       WARRANTY_DETAILS: item.WARRANTY_DETAILS,
  //       PACKING_TYPE: item.PACKING_TYPE,
  //       PROJECT_NAME: item.PROJECT_NAME,
  //       EXPECTED_QUANTITY: item.EXPECTED_QUANTITY,
  //       EXPECTED_BRAND_NAME: item.EXPECTED_BRAND_NAME,
  //       EXPECTED_ORIGIN: item.EXPECTED_ORIGIN,
  //       LCM_ENABLE_FLAG: item.LCM_ENABLE_FLAG,
  //       UNIT_MEAS_LOOKUP_CODE: item.UNIT_MEAS_LOOKUP_CODE,
  //       NEED_BY_DATE: item.NEED_BY_DATE,
  //       ORG_ID: item.ORG_ID,
  //       ATTRIBUTE_CATEGORY: item.ATTRIBUTE_CATEGORY,
  //       PR_FROM_DFF: item.PR_FROM_DFF,
  //       AUTHORIZATION_STATUS: item.AUTHORIZATION_STATUS,
  //       NOTE_TO_SUPPLIER: item.NOTE_TO_SUPPLIER,
  //       WARRANTY_ASK_BY_BUYER: item.WARRANTY_ASK_BY_BUYER,
  //       WARRANTY_BY_SUPPLIER: item.WARRANTY_BY_SUPPLIER,
  //       BUYER_VAT_APPLICABLE: item.BUYER_VAT_APPLICABLE,
  //       SUPPLIER_VAT_APPLICABLE: item.SUPPLIER_VAT_APPLICABLE,
  //       UNIT_PRICE: item.UNIT_PRICE,
  //       OFFERED_QUANTITY: item.OFFERED_QUANTITY,
  //       PROMISE_DATE: item.PROMISE_DATE,
  //       DELIVER_TO_LOCATION_ID: item.DELIVER_TO_LOCATION_ID,
  //       DESTINATION_ORGANIZATION_ID: item.DESTINATION_ORGANIZATION_ID,
  //       CS_STATUS: item.CS_STATUS,
  //       CREATION_DATE: item.CREATION_DATE,
  //       CREATED_BY: item.CREATED_BY,
  //       LAST_UPDATED_BY: item.LAST_UPDATED_BY,
  //       LAST_UPDATE_DATE: item.LAST_UPDATE_DATE,
  //       BUYER_FILE_ORG_NAME: item.BUYER_FILE_ORG_NAME,
  //       BUYER_FILE_NAME: item.BUYER_FILE_NAME,
  //       SUP_FILE_ORG_NAME: item.SUP_FILE_ORG_NAME,
  //       SUPPLIER_FILE: item.SUPPLIER_FILE,
  //       AVAILABLE_SPECS: item.AVAILABLE_SPECS,
  //       AVAILABLE_ORIGIN: item.AVAILABLE_ORIGIN,
  //       AVAILABLE_BRAND_NAME: item.AVAILABLE_BRAND_NAME,
  //       ITEM_ID: item.ITEM_ID,
  //       QUOT_LINE_ID: item.QUOT_LINE_ID,
  //       AMOUNT_INCLUDING_VAT: item.AMOUNT_INCLUDING_VAT,
  //       VAT_TYPE: item.VAT_TYPE,
  //       VAT_VALUE: item.VAT_VALUE,
  //       TOLERANCE: item.TOLERANCE,
  //       // MIMETYPE: "", // Default value for missing property
  //       // ORIGINAL_FILE_NAME: "", // Default value for missing property
  //     })
  //   );
  //   setSelectedRfqItemList(selectedItems);
  // };

  const unselectAll = () => {
    setIsSelectAll(false);
    setSelectedRfqItemList([]);
  };

  // const toggleprItemSelection2 = (employee: SelectedRfqItemInterface) => {
  //   setSelectedRfqItemList2((prevSelectedList2) => {
  //     const isEmployeeSelected2 = prevSelectedList2.some(
  //       (emp) => emp.REQUISITION_LINE_ID === employee.REQUISITION_LINE_ID
  //     );

  //     if (isEmployeeSelected2) {
  //       // If the employee is already selected, remove it
  //       return prevSelectedList2.filter(
  //         (emp) => emp.REQUISITION_LINE_ID !== employee.REQUISITION_LINE_ID
  //       );
  //     } else {
  //       // If the employee is not selected, add it
  //       return [
  //         ...prevSelectedList2,
  //         employee as unknown as SelectedRfqItemInterface,
  //       ];
  //       // Ensure employee is casted to SelectedPrItemInterface
  //     }
  //   });
  // };

  const availableSpecRef = useRef<HTMLInputElement[]>([]);
  const availableBrandRef = useRef<HTMLInputElement[]>([]);
  const availableOriginRef = useRef<HTMLInputElement[]>([]);
  const offerQuantityRef = useRef<HTMLInputElement[]>([]);
  const unitPriceRef = useRef<HTMLInputElement[]>([]);
  const includeVatRef = useRef<HTMLInputElement[]>([]);
  const warrantyDetailsRef = useRef<HTMLInputElement[]>([]);
  const intialPromiseDate = list.map(() => ({
    startDate: null,
    endDate: null,
  }));

  const {
    setRfqItems,
    rfqIdInStore,
    rfqTypeInStore,
    setRfqTypeInStore,
    rfqResponseStatusInStore,
    setRfqResponseStatusInStore,
    canEditQuotationInStore,
    rfqSubjectInStore,
    rfqStatusInStore,
  } = useSupplierRfqStore();
  //store

  useEffect(() => {
    console.log("rfqResponseStatusInStore: ", rfqResponseStatusInStore);
    console.log("rfqstatus: ", rfqStatusInStore);

    if (rfqResponseStatusInStore === 4 || rfqResponseStatusInStore === 5) {
      getSupplierDetails();
    }

    console.log("can Edit: ", canEditQuotationInStore);
  }, []);

  const [quotationList, setQuotationList] = useState<
    SupplierQuotationDetailsInterface[] | []
  >([]);

  const getSupplierDetails = async () => {
    setIsLoading(true);

    const result = await SupplierQuotationDetailsService(
      token!,
      rfqIdInStore,
      userId,
      0,
      1000
    );

    console.log("Quotation Details: ", result.data.line_items);
    if (result.data.status === 200) {
      console.log(result.data.line_items);

      setQuotationList(result.data.line_items);
    }
    setIsLoading(false);
  };

  //shadid code for edit rfq

  useEffect(() => {
    setEditData();
  }, [quotationList]);

  const specificationRefs2 = useRef<HTMLInputElement[]>([]);
  const brandRefs2 = useRef<HTMLInputElement[]>([]);
  const originRefs2 = useRef<HTMLInputElement[]>([]);
  const offeredQuantityRefs2 = useRef<HTMLInputElement[]>([]);
  const toleranceRefs2 = useRef<HTMLInputElement[]>([]);
  const toleranceRefs = useRef<HTMLInputElement[]>([]);
  const freightChargeAmountRefs = useRef<HTMLInputElement[]>([]);
  const unitPriceRefs2 = useRef<HTMLInputElement[]>([]);
  const freightChargeAmountRef2 = useRef<HTMLInputElement[]>([]);
  const warrantyDetailsRef2 = useRef<HTMLInputElement[]>([]);
  const countryRefs2 = useRef<HTMLInputElement[]>([]);

  const [specificationList2, setSpecificationList2] = useState<string[]>([]);
  const [availableSpecList2, setAvailableSpecList2] = useState<string[]>([]);
  const [brandList2, setBrandList2] = useState<string[]>([]);
  const [originList2, setOriginList2] = useState<string[]>([]);
  const [countryCodeList2, setCountryCodeList2] = useState<string[]>([]);
  const [countryNameList2, setCountryNameList2] = useState<string[]>([]);
  const [offeredQuantityList2, setOfferedQuantityList2] = useState<string[]>(
    []
  );
  const [warrantyDetailsList2, setWarrantyDetailsList2] = useState<string[]>(
    []
  );
  const [unitPriceList2, setUnitPriceList2] = useState<string[]>([]);
  const [freightChargeAmount2, setFreightChargeAmount2] = useState<string[]>(
    []
  );
  const [toleranceList2, setToleranceList2] = useState<string[]>([]);
  const [toleranceList, setToleranceList] = useState<string[]>([]);
  const [freightChargeAmountList, setFreightChargeAmountList] = useState<
    string[]
  >([]);
  // const [promiseDatesArray2, setPromiseDatesArray2] = useState(
  //   initialNeedByDatesArray
  // );
  const [promiseDatesArray2, setPromiseDatesArray2] = useState<
    { startDate: Date | null; endDate: Date | null }[]
  >(initialNeedByDatesArray);

  // const handleSpecificationChange2 = (value: string, index: number) => {
  //   const newSpecificationList2 = [...specificationList2];
  //   newSpecificationList2[index] = value;
  //   const newQuotationList2 = [...quotationList];
  //   newQuotationList2[index].AVAILABLE_SPECS = value;
  //   setSpecificationList2(newSpecificationList2);
  //   setAvailableSpec(newSpecificationList2);
  //   console.log("available: ", newSpecificationList2);
  //   setQuotationList(newQuotationList2);
  // };

  const handleSpecificationChange2 = (value: string, index: number) => {
    const newQuotationList2 = [...quotationList];
    newQuotationList2[index].AVAILABLE_SPECS = value;

    setQuotationList(newQuotationList2);

    setSelectedRfqItemList2((prevSelectedList) => {
      return prevSelectedList.map((item) =>
        item.REQUISITION_LINE_ID ===
        newQuotationList2[index].REQUISITION_LINE_ID
          ? { ...item, AVAILABLE_SPECS: value }
          : item
      );
    });
  };

  // const handleBrandList2 = (value: string, index: number) => {
  //   const newBrandList2 = [...brandList2];
  //   newBrandList2[index] = value;
  //   const newQuotationList2 = [...quotationList];
  //   newQuotationList2[index].AVAILABLE_BRAND_NAME = value;
  //   setBrandList2(newBrandList2);
  //   setAvailableBrand(newBrandList2);
  //   setQuotationList(newQuotationList2);
  // };

  const handleBrandList2 = (value: string, index: number) => {
    const newQuotationList2 = [...quotationList];
    newQuotationList2[index].AVAILABLE_BRAND_NAME = value;

    setQuotationList(newQuotationList2);

    setSelectedRfqItemList2((prevSelectedList) => {
      return prevSelectedList.map((item) =>
        item.REQUISITION_LINE_ID ===
        newQuotationList2[index].REQUISITION_LINE_ID
          ? { ...item, AVAILABLE_BRAND_NAME: value }
          : item
      );
    });
  };

  // const handleOriginList2 = (value: string, index: number) => {
  //   const newOriginList2 = [...originList2];
  //   newOriginList2[index] = value;
  //   const newQuotationList2 = [...quotationList];
  //   newQuotationList2[index].AVAILABLE_ORIGIN = value;
  //   setOriginList2(newOriginList2);
  //   setAvailableOrigin(newOriginList2);
  //   setQuotationList(newQuotationList2);
  // };

  const handleOriginList2 = (value: string, index: number) => {
    const newQuotationList2 = [...quotationList];
    newQuotationList2[index].AVAILABLE_ORIGIN = value;

    setQuotationList(newQuotationList2);

    setSelectedRfqItemList2((prevSelectedList) => {
      return prevSelectedList.map((item) =>
        item.REQUISITION_LINE_ID ===
        newQuotationList2[index].REQUISITION_LINE_ID
          ? { ...item, AVAILABLE_ORIGIN: value }
          : item
      );
    });
  };

  const handleCountryChange2 = (value: string, index: number) => {
    console.log("country: ", value);

    console.log("countryList: ", countryList);

    const selectedCountry = countryList.find(
      (country) => country.value === value
    );

    if (selectedCountry) {
      console.log("name: ", selectedCountry);

      const newQuotationList2 = [...quotationList];

      // Update the COUNTRY_CODE and COUNTRY_NAME in the quotationList at the given index
      newQuotationList2[index].COUNTRY_CODE = selectedCountry!.value;
      newQuotationList2[index].COUNTRY_NAME = selectedCountry!.label;

      // Update the state with the new quotationList
      setQuotationList(newQuotationList2);

      // Update the selected RFQ item list
      setSelectedRfqItemList2((prevSelectedList) => {
        return prevSelectedList.map((item) =>
          item.REQUISITION_LINE_ID ===
          newQuotationList2[index].REQUISITION_LINE_ID
            ? {
                ...item,
                COUNTRY_CODE: selectedCountry!.value,
                COUNTRY_NAME: selectedCountry!.label,
              }
            : item
        );
      });
    }
  };

  const handleWarrantyDetails2 = (value: string, index: number) => {
    const newQuotationList2 = [...quotationList];
    newQuotationList2[index].SUPPLIER_WARRANTY_DETAILS = value;

    setQuotationList(newQuotationList2);

    setSelectedRfqItemList2((prevSelectedList) => {
      return prevSelectedList.map((item) =>
        item.REQUISITION_LINE_ID ===
        newQuotationList2[index].REQUISITION_LINE_ID
          ? { ...item, SUPPLIER_WARRANTY_DETAILS: value }
          : item
      );
    });
  };

  // const handlePromiseDateChange2 = (newValue: any, rowIndex: number) => {
  //   const updatedNeedByDatesArray2 = [...promiseDatesArray2];
  //   updatedNeedByDatesArray2[rowIndex] = newValue;
  //   const newQuotationList = [...quotationList];
  //   newQuotationList[rowIndex].PROMISE_DATE = moment(newValue.startDate).format(
  //     "DD-MMM-YY HH:mm:ss"
  //   );
  //   console.log(moment(newValue.startDate).format("DD-MMM-YY HH:mm:ss"));

  //   setPromiseDatesArray2(updatedNeedByDatesArray2);
  //   setPromiseDate(updatedNeedByDatesArray2);
  //   setQuotationList(newQuotationList);
  // };

  const handlePromiseDateChange2 = (newValue: any, rowIndex: number) => {
    const selectedDate = moment(newValue.startDate);
    const today = moment().startOf("day");

    if (!newValue.startDate) {
      // User canceled the date selection
      // showErrorToast("Promise Date has been canceled.");

      const updatedDatesArray = [...promiseDatesArray2];
      updatedDatesArray[rowIndex] = { startDate: null, endDate: null }; // Clear dates in the array

      setPromiseDatesArray2(updatedDatesArray);

      const updatedQuotationList = [...quotationList];
      updatedQuotationList[rowIndex].PROMISE_DATE = ""; // Set PROMISE_DATE to empty string

      setQuotationList(updatedQuotationList);

      setSelectedRfqItemList2((prevSelectedList) => {
        return prevSelectedList.map((item) =>
          item.REQUISITION_LINE_ID ===
          updatedQuotationList[rowIndex].REQUISITION_LINE_ID
            ? { ...item, PROMISE_DATE: "" } // Set to empty string
            : item
        );
      });
      return;
    }

    if (selectedDate.isBefore(today)) {
      showErrorToast(
        "Invalid date selection: Please select today's date or a future date."
      );

      const updatedDatesArray = [...promiseDatesArray2];
      updatedDatesArray[rowIndex] = { startDate: null, endDate: null };

      setPromiseDatesArray2(updatedDatesArray);

      const updatedQuotationList = [...quotationList];
      updatedQuotationList[rowIndex].PROMISE_DATE = "";

      setQuotationList(updatedQuotationList);

      setSelectedRfqItemList2((prevSelectedList) => {
        return prevSelectedList.map((item) =>
          item.REQUISITION_LINE_ID ===
          updatedQuotationList[rowIndex].REQUISITION_LINE_ID
            ? { ...item, PROMISE_DATE: "" }
            : item
        );
      });
      return;
    }

    const newQuotationList2 = [...quotationList];
    newQuotationList2[rowIndex].PROMISE_DATE = moment(
      newValue.startDate
    ).format("DD-MMM-YY HH:mm:ss");

    setQuotationList(newQuotationList2);

    setSelectedRfqItemList2((prevSelectedList) => {
      return prevSelectedList.map((item) =>
        item.REQUISITION_LINE_ID ===
        newQuotationList2[rowIndex].REQUISITION_LINE_ID
          ? { ...item, PROMISE_DATE: newQuotationList2[rowIndex].PROMISE_DATE }
          : item
      );
    });
  };

  // const handleOfferedQuantity2 = (value: string, index: number) => {

  //   if(isNaN(parseFloat(value))){
  //     console.log('nan');
  //     const newOfferedQuantityList2 = [...offeredQuantityList2];
  //     newOfferedQuantityList2[index] = '';

  //     setOfferedQuantityList2(newOfferedQuantityList2);

  //     const newQuotationList2 = [...quotationList];
  //     newQuotationList2[index].OFFERED_QUANTITY = 0;
  //     offeredQuantityRefs2.current[index].value='';
  //     console.log("float: ", parseFloat(value));

  //     // setOfferQuantity(newOfferedQuantityList2);
  //     setQuotationList(newQuotationList2);
  //   }
  //   else{
  //     console.log("new offer: ", value);
  //     console.log("float: ", parseFloat(value));
  //     const newOfferedQuantityList2 = [...offeredQuantityList2];
  //     newOfferedQuantityList2[index] = value;

  //     setOfferedQuantityList2(newOfferedQuantityList2);
  //     console.log("list: ", newOfferedQuantityList2[index])

  //     const newQuotationList2 = [...quotationList];
  //     newQuotationList2[index].OFFERED_QUANTITY = parseFloat(value);
  //     console.log("float: ", parseFloat(value));

  //     // setOfferQuantity(newOfferedQuantityList2);
  //     setQuotationList(newQuotationList2);
  //   }
  // };

  const handleOfferedQuantity2 = (value: string, index: number) => {
    const newQuotationList2 = [...quotationList]; // Create a new copy of quotationList
    const expectedQuantity = newQuotationList2[index].EXPECTED_QUANTITY;

    if (isNaN(parseFloat(value))) {
      console.log("nan");

      // Update offeredQuantityList2
      const newOfferedQuantityList2 = [...offeredQuantityList2];
      newOfferedQuantityList2[index] = "";
      setOfferedQuantityList2(newOfferedQuantityList2);

      // Update quotationList
      newQuotationList2[index] = {
        ...newQuotationList2[index],
        OFFERED_QUANTITY: 0, // Assuming OFFERED_QUANTITY should be a number
      };
      setQuotationList(newQuotationList2);
    } else {
      console.log("new offer: ", value);

      if (parseFloat(value) > expectedQuantity) {
        showErrorToast(
          `Please enter a quantity less than or equal to ${expectedQuantity}.`
        );

        // Reset the offered quantity to an empty string
        const newOfferedQuantityList2 = [...offeredQuantityList2];
        newOfferedQuantityList2[index] = "";
        setOfferedQuantityList2(newOfferedQuantityList2);

        // Update quotationList
        newQuotationList2[index] = {
          ...newQuotationList2[index],
          OFFERED_QUANTITY: 0,
        };
        setQuotationList(newQuotationList2);
        return; // Exit the function early
      }

      // Update offeredQuantityList2
      const newOfferedQuantityList2 = [...offeredQuantityList2];
      newOfferedQuantityList2[index] = value;
      setOfferedQuantityList2(newOfferedQuantityList2);

      // Update quotationList
      newQuotationList2[index] = {
        ...newQuotationList2[index],
        OFFERED_QUANTITY: parseFloat(value), // Assuming OFFERED_QUANTITY should be a number
      };
      setQuotationList(newQuotationList2);
    }

    // Update the selected items if they are affected
    setSelectedRfqItemList2((prevSelectedList) => {
      return prevSelectedList.map((item) => {
        if (
          item.REQUISITION_LINE_ID ===
          newQuotationList2[index].REQUISITION_LINE_ID
        ) {
          return {
            ...item,
            OFFERED_QUANTITY: (parseFloat(value) || 0).toString(), // Convert to string if needed
          };
        }
        return item; // Return unchanged items
      });
    });
  };

  // const handleUnitPriceChange2 = (value: string, index: number) => {
  //   const newUnitpriceList2 = [...unitPriceList2];
  //   newUnitpriceList2[index] = value;
  //   const newQuotationList2 = [...quotationList];
  //   newQuotationList2[index].UNIT_PRICE = value;
  //   setUnitPriceList2(newUnitpriceList2);
  //   setUnitPrice(newUnitpriceList2);
  //   setQuotationList(newQuotationList2);
  // };

  const handleUnitPriceChange2 = (value: string, index: number) => {
    const newQuotationList2 = [...quotationList];
    newQuotationList2[index].UNIT_PRICE = value;

    setQuotationList(newQuotationList2);

    setSelectedRfqItemList2((prevSelectedList) => {
      return prevSelectedList.map((item) =>
        item.REQUISITION_LINE_ID ===
        newQuotationList2[index].REQUISITION_LINE_ID
          ? { ...item, UNIT_PRICE: value }
          : item
      );
    });
  };

  const handleFreightChargeAmount2 = (value: string, index: number) => {
    const newQuotationList2 = [...quotationList];
    newQuotationList2[index].FREIGHT_CHARGE = value;

    setQuotationList(newQuotationList2);

    setSelectedRfqItemList2((prevSelectedList) => {
      return prevSelectedList.map((item) =>
        item.REQUISITION_LINE_ID ===
        newQuotationList2[index].REQUISITION_LINE_ID
          ? { ...item, FREIGHT_CHARGE: value }
          : item
      );
    });
  };

  // const handleToleranceChange2 = (value: string, index: number) => {
  //   const newToleranceList2 = [...toleranceList2];
  //   newToleranceList2[index] = value;
  //   const newQuotationList2 = [...quotationList];
  //   newQuotationList2[index].TOLERANCE = value;
  //   setToleranceList2(newToleranceList2);
  //   setToleranceList(newToleranceList2);
  //   setQuotationList(newQuotationList2);
  // };

  const handleToleranceChange2 = (value: string, index: number) => {
    const newQuotationList2 = [...quotationList];
    newQuotationList2[index].TOLERANCE = value;

    setQuotationList(newQuotationList2);

    setSelectedRfqItemList2((prevSelectedList) => {
      return prevSelectedList.map((item) =>
        item.REQUISITION_LINE_ID ===
        newQuotationList2[index].REQUISITION_LINE_ID
          ? { ...item, TOLERANCE: value }
          : item
      );
    });
  };

  // const handleWarrantyEnable2 = (index: number) => {
  //   const newQuotationList = [...quotationList];
  //   newQuotationList[index].WARRANTY_BY_SUPPLIER =
  //     newQuotationList[index].WARRANTY_BY_SUPPLIER === "N" ? "Y" : "N";
  //   setQuotationList(newQuotationList);
  // };

  const handleWarrantyEnable2 = (index: number) => {
    const newQuotationList2 = [...quotationList];
    const warrantyValue =
      newQuotationList2[index].WARRANTY_BY_SUPPLIER === "N" ? "Y" : "N";
    newQuotationList2[index].WARRANTY_BY_SUPPLIER = warrantyValue;

    setQuotationList(newQuotationList2);

    setSelectedRfqItemList2((prevSelectedList) => {
      return prevSelectedList.map((item) =>
        item.REQUISITION_LINE_ID ===
        newQuotationList2[index].REQUISITION_LINE_ID
          ? { ...item, WARRANTY_BY_SUPPLIER: warrantyValue }
          : item
      );
    });
  };

  const handleVatEnable2 = (index: number) => {
    const newQuotationList2 = [...quotationList];
    const vatEnable2 =
      newQuotationList2[index].SUPPLIER_VAT_APPLICABLE === "N" ? "Y" : "N";
    newQuotationList2[index].SUPPLIER_VAT_APPLICABLE = vatEnable2;

    setQuotationList(newQuotationList2);

    console.log("vat: ", newQuotationList2[index].SUPPLIER_VAT_APPLICABLE);

    setSelectedRfqItemList2((prevSelectedList) => {
      return prevSelectedList.map((item) =>
        item.REQUISITION_LINE_ID ===
        newQuotationList2[index].REQUISITION_LINE_ID
          ? { ...item, SUPPLIER_VAT_APPLICABLE: vatEnable2 }
          : item
      );
    });
  };

  const setEditData = () => {
    if (quotationList) {
      const newSpecificationList2 = quotationList.map(
        (item) => item.AVAILABLE_SPECS
      );

      setSpecificationList2(newSpecificationList2);

      if (specificationRefs2.current) {
        specificationRefs2.current = newSpecificationList2.map(
          (spec, index) => {
            return (
              specificationRefs2.current[index] ||
              React.createRef<HTMLInputElement>()
            );
          }
        );
      }

      //available brand

      const newBrandList2 = quotationList.map(
        (item) => item.AVAILABLE_BRAND_NAME
      );

      setBrandList2(newBrandList2);

      if (brandRefs2.current) {
        brandRefs2.current = newBrandList2.map((spec, index) => {
          return (
            brandRefs2.current[index] || React.createRef<HTMLInputElement>()
          );
        });
      }

      const newOriginList2 = quotationList.map((item) => item.AVAILABLE_ORIGIN);
      setOriginList2(newOriginList2);

      if (originRefs2.current) {
        originRefs2.current = newOriginList2.map((spec, index) => {
          return (
            originRefs2.current[index] || React.createRef<HTMLInputElement>()
          );
        });
      }

      // Set country information
      const newCountryList2 = quotationList.map((item) => ({
        code: item.COUNTRY_CODE,
        name: item.COUNTRY_NAME,
      }));

      // Assuming you need separate states for country code and name
      const countryCodes = newCountryList2.map((item) => item.code);
      const countryNames = newCountryList2.map((item) => item.name);

      // Set the states for country codes and names
      setCountryCodeList2(countryCodes); // You might want to create a state for country codes
      setCountryNameList2(countryNames); // You might want to create a state for country names

      // Initialize refs for countries if needed
      if (countryRefs2.current) {
        countryRefs2.current = newCountryList2.map(
          (spec, index) =>
            countryRefs2.current[index] || React.createRef<HTMLInputElement>()
        );
      }

      const newWarrantyDetails2 = quotationList.map(
        (item) => item.SUPPLIER_WARRANTY_DETAILS
      );
      setWarrantyDetailsList2(newWarrantyDetails2);

      if (warrantyDetailsRef2.current) {
        warrantyDetailsRef2.current = newWarrantyDetails2.map(
          (warranty, index) => {
            return (
              warrantyDetailsRef2.current[index] ||
              React.createRef<HTMLInputElement>()
            );
          }
        );
      }

      //promise by date
      const dateArray2 = quotationList.map((item) => ({
        startDate: new Date(item.PROMISE_DATE),
        endDate: new Date(item.PROMISE_DATE),
      }));
      setPromiseDatesArray2(dateArray2);
      //promise by date

      // const newOfferedQuantityList2 = quotationList.map((item) =>{
      //   // item.OFFERED_QUANTITY.toString();

      //   const quantity = item.OFFERED_QUANTITY;
      //   // Convert to string, but use empty string if it's 0 or NaN
      //   return (quantity && quantity !== 0) ? quantity.toString() : '';
      // });
      const newOfferOtyList2 = quotationList.map((item) =>
        item.OFFERED_QUANTITY.toString()
      );
      setOfferedQuantityList2(newOfferOtyList2);

      if (offeredQuantityRefs2.current) {
        offeredQuantityRefs2.current = newOfferOtyList2.map((spec, index) => {
          return (
            offeredQuantityRefs2.current[index] ||
            React.createRef<HTMLInputElement>()
          );
        });
      }

      //tolerance bad ase

      const newUnitPriceList2 = quotationList.map((item) => item.UNIT_PRICE);
      setUnitPriceList2(newUnitPriceList2);

      if (unitPriceRefs2.current) {
        unitPriceRefs2.current = newUnitPriceList2.map((spec, index) => {
          return (
            unitPriceRefs2.current[index] || React.createRef<HTMLInputElement>()
          );
        });
      }

      const newTolerance2 = quotationList.map((item) => item.TOLERANCE);
      setToleranceList2(newTolerance2);
      if (toleranceRefs2.current) {
        toleranceRefs2.current = newTolerance2.map((spec, index) => {
          return (
            toleranceRefs2.current[index] || React.createRef<HTMLInputElement>()
          );
        });
      }

      // Initialize VAT types and VAT values
      const selectedVatTypes = quotationList
        .map((item) => item.VAT_TYPE)
        .filter((type): type is string => type !== undefined);

      setVatTypes2(selectedVatTypes);

      const vatAmounts = quotationList
        .map((item) => item.VAT_AMOUNT)
        .filter((amount): amount is string => amount !== undefined);

      setVatValues2(vatAmounts); // Ensure this is consistent with vatValues2

      if (includeVatRef.current) {
        includeVatRef.current = vatAmounts.map((spec, index) => {
          return (
            includeVatRef.current[index] || React.createRef<HTMLInputElement>()
          );
        });
      }

      const newFreightChargeList2 = quotationList.map(
        (item) => item.FREIGHT_CHARGE
      );
      setFreightChargeAmount2(newFreightChargeList2);

      if (freightChargeAmountRef2.current) {
        freightChargeAmountRef2.current = newFreightChargeList2.map(
          (spec, index) => {
            return (
              freightChargeAmountRef2.current[index] ||
              React.createRef<HTMLInputElement>()
            );
          }
        );
      }
    }
  };

  const [am, setAm] = useState<string>("");

  //   if (type === "Percentage") {
  //     const percentage = parseValue / 100;
  //     const vatAmount = price * percentage;
  //     finalValue = (price + vatAmount) * quantity;
  //   } else if (type === "Amount") {
  //     finalValue = (price + parseValue) * quantity;
  //   }

  // useEffect(() => {
  //   const newVatAmounts: string[] = []; // Initialize a new array

  //   let cal = 0;

  //   for (let i = 0; i < quotationList.length; i++) {
  //     if (quotationList[i].VAT_TYPE === "Percentage") {
  //       const perVal = parseFloat(quotationList[i].VAT_AMOUNT!) / 100;
  //       const p = parseFloat(quotationList[i].UNIT_PRICE!) * perVal;
  //       cal =
  //         (parseFloat(quotationList[i].UNIT_PRICE!) + p) *
  //         quotationList[i].OFFERED_QUANTITY;
  //     } else {
  //       cal =
  //         (parseFloat(quotationList[i].UNIT_PRICE!) +
  //           parseFloat(quotationList[i].VAT_AMOUNT!)) *
  //         quotationList[i].OFFERED_QUANTITY;
  //     }

  //     newVatAmounts.push(cal.toFixed(2)); // Push the calculated value as a string
  //   }

  //   // const newQuotationDataList=[...quotationList];

  //   // for (let i = 0; i < newVatAmounts.length; i++) {
  //   //   newQuotationDataList[i].TOTAL_LINE_AMOUNT = newVatAmounts[i];

  //   // }

  //   // setQuotationList(newQuotationDataList);

  //   setVatAmounts2(newVatAmounts); // Set the state with the new array
  // }, [quotationList]);

  const calculateVatAmounts = useCallback(() => {
    return quotationList.map((item) => {
      let cal = 0;
      if (item.VAT_TYPE === "Percentage") {
        const perVal = parseFloat(item.VAT_AMOUNT!) / 100;
        const p = parseFloat(item.UNIT_PRICE!) * perVal;
        cal = (parseFloat(item.UNIT_PRICE!) + p) * item.OFFERED_QUANTITY;
      } else {
        cal =
          (parseFloat(item.UNIT_PRICE!) + parseFloat(item.VAT_AMOUNT!)) *
          item.OFFERED_QUANTITY;
      }
      return cal.toFixed(2);
    });
  }, [quotationList]);

  //shadid code for edit rfq

  const [availableSpec, setAvailableSpec] = useState<string[]>([]);
  const [availableBrand, setAvailableBrand] = useState<string[]>([]);
  const [availableOrigin, setAvailableOrigin] = useState<string[]>([]);
  const [includeVat, setIncludeVat] = useState<string[]>([]);
  const [warrantyDetails, setWarrantyDetails] = useState<string[]>([]);
  const [promiseDate, setPromiseDate] =
    useState<{ startDate: Date | null; endDate: Date | null }[]>(
      intialPromiseDate
    );
  const [offerQuantity, setOfferQuantity] = useState<string[]>([]);
  const [unitPrice, setUnitPrice] = useState<string[]>([]);

  const handleAvailableSpecChange = (value: string, index: number) => {
    const newSpecification = [...availableSpec];
    newSpecification[index] = value;
    const newPrItem = [...rfqItemList];
    newPrItem[index].AVAILABLE_SPECS = value;
    console.log(newPrItem[index].AVAILABLE_SPECS);

    setAvailableSpec(newSpecification);
    setRfqItemList(newPrItem);
  };

  const handleWarrantyDetailsChange = (value: string, index: number) => {
    const newSpecification = [...warrantyDetails];
    newSpecification[index] = value;
    const newPrItem = [...rfqItemList];
    newPrItem[index].SUPPLIER_WARRANTY_DETAILS = value;
    console.log(newPrItem[index].SUPPLIER_WARRANTY_DETAILS);

    setWarrantyDetails(newSpecification);
    setRfqItemList(newPrItem);
  };

  // const handleAvailableSpecChange = (value: string, index: number) => {
  //   const newSpecification = [...availableSpec];
  //   newSpecification[index] = value;

  //   setAvailableSpec(newSpecification);

  //   // Update the corresponding item in the selected list if it's selected
  //   const selectedItem = selectedRfqItemList.find(
  //     (item) => item.REQUISITION_LINE_ID === rfqItemList[index].REQUISITION_LINE_ID
  //   );
  //   if (selectedItem) {
  //     selectedItem.AVAILABLE_SPECS = value;
  //     setSelectedRfqItemList([...selectedRfqItemList]); // Trigger re-render
  //   }

  //   // Update rfqItemList
  //   const newPrItem = [...rfqItemList];
  //   newPrItem[index].AVAILABLE_SPECS = value;
  //   setRfqItemList(newPrItem);
  // };

  const handleAvailableBrandChange = (value: string, index: number) => {
    const newSpecification = [...availableBrand];
    newSpecification[index] = value;

    const newPrItem = [...rfqItemList];
    newPrItem[index].AVAILABLE_BRAND_NAME = value;
    console.log(newPrItem[index].AVAILABLE_BRAND_NAME);

    setAvailableBrand(newSpecification);
    setRfqItemList(newPrItem);
  };

  const handleAvailableOriginChange = (value: string, index: number) => {
    const newSpecification = [...availableOrigin];
    newSpecification[index] = value;
    const newPrItem = [...rfqItemList];
    newPrItem[index].AVAILABLE_ORIGIN = value;
    console.log(newPrItem[index].AVAILABLE_ORIGIN);

    setAvailableOrigin(newSpecification);
    setRfqItemList(newPrItem);
  };

  // const handlePromiseDateChange = (newValue: any, rowIndex: number) => {
  //   const updatedPromiseDatesArray = [...promiseDate];
  //   updatedPromiseDatesArray[rowIndex] = newValue;
  //   const newPrItem = [...rfqItemList];
  //   newPrItem[rowIndex].PROMISE_DATE = moment(newValue.startDate).format(
  //     "DD-MMM-YY HH:mm:ss"
  //   );
  //   console.log(moment(newValue.startDate).format("DD-MMM-YY HH:mm:ss"));

  //   setPromiseDate(updatedPromiseDatesArray);
  //   setRfqItemList(newPrItem);
  // };

  const handlePromiseDateChange = (newValue: any, rowIndex: number) => {
    const selectedDate = moment(newValue.startDate);
    const today = moment().startOf("day");

    if (selectedDate.isBefore(today)) {
      showErrorToast(
        "Invalid date selection: Please select today's date or a future date."
      );

      const updatedPromiseDatesArray = [...promiseDate];
      updatedPromiseDatesArray[rowIndex] = { startDate: null, endDate: null };

      setPromiseDate(updatedPromiseDatesArray);

      const updatedRfqItemList = [...rfqItemList];
      updatedRfqItemList[rowIndex].PROMISE_DATE = "";

      setRfqItemList(updatedRfqItemList);

      return;
    }

    const updatedPromiseDatesArray = [...promiseDate];
    updatedPromiseDatesArray[rowIndex] = newValue;
    const newPrItem = [...rfqItemList];
    newPrItem[rowIndex].PROMISE_DATE = moment(newValue.startDate).format(
      "DD-MMM-YY HH:mm:ss"
    );
    console.log(moment(newValue.startDate).format("DD-MMM-YY HH:mm:ss"));

    setPromiseDate(updatedPromiseDatesArray);
    setRfqItemList(newPrItem);
  };

  // const handleOfferQuantityChange = (value: string, index: number) => {
  //   const newSpecification = [...offerQuantity];
  //   newSpecification[index] = value;
  //   const newPrItem = [...rfqItemList];
  //   newPrItem[index].OFFERED_QUANTITY = value;
  //   console.log(newPrItem[index].OFFERED_QUANTITY);

  //   setOfferQuantity(newSpecification);
  //   setRfqItemList(newPrItem);
  // };

  // const [isInitialized, setIsInitialized] = useState(false);

  // useEffect(() => {
  //   if (!isInitialized && rfqItemList.length > 0) {
  //     // Initialize offerQuantity with EXPECTED_QUANTITY values
  //     const initialOfferQuantity = rfqItemList.map(item => item.EXPECTED_QUANTITY);
  //     setOfferQuantity(initialOfferQuantity);

  //     // Also update OFFERED_QUANTITY in rfqItemList
  //     const updatedRfqItemList = rfqItemList.map(item => ({
  //       ...item,
  //       OFFERED_QUANTITY: item.EXPECTED_QUANTITY
  //     }));
  //     setRfqItemList(updatedRfqItemList);

  //     // Mark as initialized to avoid running this again
  //     setIsInitialized(true);
  //   }
  // }, [rfqItemList, isInitialized]);

  const handleOfferQuantityChange = (value: string, index: number) => {
    // Creating new copies of offerQuantity and rfqItemList for safe state updates
    const newOfferQuantity = [...offerQuantity];
    const newRfqItemList = [...rfqItemList];

    // Assuming EXPECTED_QUANTITY is a property of newRfqItemList[index]
    const expectedQuantity = parseFloat(
      newRfqItemList[index].EXPECTED_QUANTITY
    );

    // Check if the input value is not a valid number
    if (isNaN(parseFloat(value))) {
      console.log("Input is not a valid number.");

      // Reset the offered quantity to an empty string
      newOfferQuantity[index] = "";
      setOfferQuantity(newOfferQuantity);

      // Update the OFFERED_QUANTITY to 0 in rfqItemList
      newRfqItemList[index].OFFERED_QUANTITY = "0";
      setRfqItemList(newRfqItemList);
    } else {
      // Check if the input value exceeds the expected quantity
      if (parseFloat(value) > expectedQuantity) {
        showErrorToast(
          `Please enter a quantity less than or equal to ${expectedQuantity}.`
        );

        // Reset the offered quantity to an empty string
        newOfferQuantity[index] = "";
        setOfferQuantity(newOfferQuantity);

        // Update the OFFERED_QUANTITY to 0 in rfqItemList
        newRfqItemList[index].OFFERED_QUANTITY = "0";
        setRfqItemList(newRfqItemList);

        return; // Exit the function early
      }

      // If the input value is valid, update offerQuantity and rfqItemList
      newOfferQuantity[index] = value;
      setOfferQuantity(newOfferQuantity);

      // Update OFFERED_QUANTITY in rfqItemList
      newRfqItemList[index].OFFERED_QUANTITY = value;
      setRfqItemList(newRfqItemList);

      console.log(
        "Updated OFFERED_QUANTITY: ",
        newRfqItemList[index].OFFERED_QUANTITY
      );
    }
  };

  const handleToleranceChange = (value: string, index: number) => {
    const newTolerance = [...toleranceList];
    newTolerance[index] = value;
    const newPrItem = [...rfqItemList];
    newPrItem[index].TOLERANCE = value;
    console.log(value);
    console.log(newPrItem[index].TOLERANCE);
    console.log(newPrItem);

    setToleranceList(newTolerance);
    setRfqItemList(newPrItem);
  };

  const handleFreightChargeAmountChange = (value: string, index: number) => {
    const newFreightCharge = [...freightChargeAmountList];
    newFreightCharge[index] = value;
    const newPrItem = [...rfqItemList];
    newPrItem[index].FREIGHT_CHARGE = value;
    console.log(value);
    console.log(newPrItem[index].FREIGHT_CHARGE);
    console.log(newPrItem);

    setFreightChargeAmountList(newFreightCharge);
    setRfqItemList(newPrItem);
  };

  const handleUnitPriceChange = (value: string, index: number) => {
    const newSpecification = [...unitPrice];
    newSpecification[index] = value;
    const newPrItem = [...rfqItemList];
    newPrItem[index].UNIT_PRICE = value;
    console.log(newPrItem[index].UNIT_PRICE);

    const newVatValues = [...vatValues];
    newVatValues[index] = "";
    setVatValues(newVatValues);

    const quantity = parseFloat(rfqItemList[index].OFFERED_QUANTITY) || 0;
    const finalValue = parseFloat(value) * quantity;

    const newVatAmounts = [...vatAmounts];
    newVatAmounts[index] = isNaN(finalValue) ? "0.00" : finalValue.toFixed(2);
    setVatAmounts(newVatAmounts);

    setUnitPrice(newSpecification);
    setRfqItemList(newPrItem);

    const newRfqItem = [...rfqItemList];
    // newRfqItem[index].VAT_AMOUNT = value;
    newRfqItem[index].TOTAL_LINE_AMOUNT = isNaN(finalValue)
      ? "0.00"
      : finalValue.toFixed(2);
  };

  const handleIncludeVatChange = (value: string, index: number) => {
    const newSpecification = [...includeVat];
    newSpecification[index] = value;
    const newPrItem = [...rfqItemList];
    newPrItem[index].UNIT_PRICE = value;
    console.log(newPrItem[index].UNIT_PRICE);

    setIncludeVat(newSpecification);
    setRfqItemList(newPrItem);
  };

  // quotation

  // vat calculation
  // const vatOption: Option[] = [
  //   { value: "Percentage", label: "Percentage" },
  //   { value: "Amount", label: "Amount" },
  // ];

  // const [vatValue, setVatValue] = useState<string[]>(rfqItemList.map(() => ""));
  // const initialVatAmounts = rfqItemList.map(() => "0");
  // const [vatAmounts, setVatAmounts] = useState<string[]>(initialVatAmounts);

  // // const initialVatTypes = rfqItemList.map(() => '');

  // const [vatTypes, setVatTypes] = useState<string[]>([
  //   "Percentage",
  //   "Percentage",
  // ]);

  // const handleVatTypeChange = (value: string, index: number) => {
  //   const newVatAmounts = [...vatAmounts];
  //   newVatAmounts[index] = "";
  //   setVatAmounts(newVatAmounts);

  //   const newVatValue = [...vatValue];
  //   newVatValue[index] = "";
  //   setVatValue(newVatValue);

  //   const newVatTypes = [...vatTypes];
  //   newVatTypes[index] = value;
  //   const newRfqItem = [...rfqItemList];
  //   newRfqItem[index].VAT_TYPE = value;

  //   setVatTypes(newVatTypes);
  //   setRfqItemList(newRfqItem);
  //   // After updating vatTypes, you might also want to recalculate the VAT amount for this row
  //   // Call handleVatChange here to recalculate the VAT amount
  //   // handleVatChange(includeVat[index], index);
  // };

  // const handleVatChange = (value: string, index: number) => {
  //   // setVatValue(value)
  //   console.log("v, in", value, index);
  //   const quantity = parseFloat(offerQuantity[index]);
  //   const price = parseFloat(unitPrice[index]);
  //   const parseValue = parseFloat(value); // Convert input value to a number

  //   console.log("q, p: ", quantity, price);

  //   if (vatTypes[index] === "Percentage") {
  //     const percentage = parseValue / 100;
  //     const percentageAdd = price * percentage;
  //     const add = price + percentageAdd;
  //     const finalValue = add * quantity;
  //     console.log(add * quantity);

  //     const newVatAmounts = [...vatAmounts];
  //     newVatAmounts[index] = finalValue.toString();
  //     const newRfqItem = [...rfqItemList];
  //     newRfqItem[index].AMOUNT_INCLUDING_VAT = finalValue.toString();

  //     setVatAmounts(newVatAmounts);
  //     setRfqItemList(newRfqItem);
  //   } else if (vatTypes[index] === "Amount") {
  //     const addValue = price + parseValue;
  //     const finalValue = addValue * quantity;

  //     console.log(addValue * quantity);

  //     const newVatAmounts = [...vatAmounts];
  //     newVatAmounts[index] = finalValue.toString();
  //     const newRfqItem = [...rfqItemList];
  //     newRfqItem[index].AMOUNT_INCLUDING_VAT = finalValue.toString();

  //     setVatAmounts(newVatAmounts);
  //     setRfqItemList(newRfqItem);
  //   }

  //   const newIncludeVat = [...vatValue];
  //   newIncludeVat[index] = value;
  //   const newRfqItem = [...rfqItemList];
  //   newRfqItem[index].VAT_VALUE = value;

  //   setVatValue(newIncludeVat);
  //   setRfqItemList(newRfqItem);
  // };

  // const [totalVatAmount, setTotalVatAmount] = useState(0);
  // const [currentlyEditedRow, setCurrentlyEditedRow] = useState(null);

  // const calculateTotalVatAmount = () => {
  //   const filteredVatAmounts = vatAmounts.filter(
  //     (amount, index) =>
  //       index !== currentlyEditedRow && !isNaN(parseFloat(amount))
  //   );
  //   const total = filteredVatAmounts.reduce(
  //     (acc, curr) => acc + parseFloat(curr),
  //     0
  //   );
  //   setTotalVatAmount(isNaN(total) ? 0 : total);
  //   console.log(total);
  // };

  // // Update total VAT amount whenever vatAmounts changes
  // useEffect(() => {
  //   calculateTotalVatAmount();
  // }, [vatAmounts, currentlyEditedRow]);

  // const vatOptions: Option[] = [
  //   { value: "Percentage", label: "Percentage" },
  //   { value: "Amount", label: "Amount" },
  // ];

  // const [vatValues, setVatValues] = useState<string[]>(rfqItemList.map(() => ""));
  // const [vatAmounts, setVatAmounts] = useState<string[]>(rfqItemList.map(() => "0"));
  // // const [vatTypes, setVatTypes] = useState<string[]>(rfqItemList.map(() => "Percentage"));
  // const [vatTypes, setVatTypes] = useState<string[]>([
  //   "Percentage",
  //   "Percentage",
  // ]);

  // const [totalVatAmount, setTotalVatAmount] = useState(0);

  const [vatValues, setVatValues] = useState<string[]>([]);
  const [vatAmounts, setVatAmounts] = useState<string[]>([]);
  const [vatTypes, setVatTypes] = useState<string[]>([]);
  // const [vatTypes, setVatTypes] = useState(["Percentage"]);
  const [totalVatAmount, setTotalVatAmount] = useState(0);
  const [vatValues2, setVatValues2] = useState<string[]>([]);
  const [vatAmounts2, setVatAmounts2] = useState<string[]>([]);
  const [vatTypes2, setVatTypes2] = useState<string[]>([]);
  const [totalVatAmount2, setTotalVatAmount2] = useState(0);

  const vatOptions = [
    { value: "Percentage", label: "Percentage" },
    { value: "Amount", label: "Amount" },
  ];

  // useEffect(() => {
  //   initializeVATData();
  // }, [rfqItemList]);

  const initializeVATData = () => {
    const initialVatTypes = rfqItemList.map(
      (item) => item.VAT_TYPE || "Percentage"
    );
    const initialVatValues = rfqItemList.map((item) => item.VAT_AMOUNT || "");
    const initialVatAmounts = rfqItemList.map(() => "0");

    setVatTypes(initialVatTypes);
    setVatValues(initialVatValues);
    setVatAmounts(initialVatAmounts);

    // Initialize calculations for all items
    rfqItemList.forEach((item, index) => {
      handleVatChange(item.VAT_AMOUNT || "", index, initialVatTypes[index]);
    });
  };

  // const includeVatRef = useRef<(HTMLInputElement | null)[]>([]);

  // useEffect(() => {
  //   // Initialize rfqItemList with "Percentage" VAT_TYPE if not already set
  //   const updatedRfqItemList = rfqItemList.map(item => ({
  //     ...item,
  //     VAT_TYPE: item.VAT_TYPE || "Percentage"
  //   }));
  //   setRfqItemList(updatedRfqItemList);

  //   // Recalculate VAT amounts for all items
  //   updatedRfqItemList.forEach((item, index) => {
  //     handleVatChange(item.VAT_VALUE, index);
  //   });
  // }, []);

  // useEffect(() => {
  //   // Initialize with "Percentage" for each item
  //   setVatTypes(rfqItemList.map(() => "Percentage"));
  // }, [rfqItemList]);

  const handleVatTypeChange = (value: string, index: number) => {
    const newVatTypes = [...vatTypes];
    newVatTypes[index] = value;
    setVatTypes(newVatTypes);

    const newRfqItemList = [...rfqItemList];
    newRfqItemList[index].VAT_TYPE = value;
    setRfqItemList(newRfqItemList);

    // Reset VAT value when type changes
    const newVatValues = [...vatValues];
    newVatValues[index] = "";
    setVatValues(newVatValues);

    // Recalculate VAT amount
    handleVatChange("", index, value);
  };

  // useEffect(() => {
  //   console.log("vatValues2 updated:", vatValues2);
  // }, [vatValues2]);

  const handleVatTypeChange2 = (value: string, index: number) => {
    console.log(value);

    const newVatTypes = [...vatTypes];
    newVatTypes[index] = value;
    setVatTypes(newVatTypes);

    const newRfqItemList = [...quotationList];
    newRfqItemList[index].VAT_TYPE = value;
    setQuotationList(newRfqItemList);

    setSelectedRfqItemList2((prevSelectedList) => {
      return prevSelectedList.map((item) =>
        item.REQUISITION_LINE_ID === newRfqItemList[index].REQUISITION_LINE_ID
          ? { ...item, VAT_TYPE: value }
          : item
      );
    });

    // Reset VAT value when type changes
    const newVatValues = [...vatValues];
    newVatValues[index] = "";
    setVatValues(newVatValues);

    // Recalculate VAT amount
    handleVatChange2("", index, value);
  };

  const handleVatChange = (
    value: string,
    index: number,
    type: string = vatTypes[index]
  ) => {
    const quantity = parseFloat(rfqItemList[index].OFFERED_QUANTITY) || 0;
    const price = parseFloat(rfqItemList[index].UNIT_PRICE) || 0;
    const parseValue = parseFloat(value) || 0;

    let finalValue = 0;

    if (type === "Percentage") {
      const percentage = parseValue / 100;
      const vatAmount = price * percentage;
      finalValue = (price + vatAmount) * quantity;
    } else if (type === "Amount") {
      finalValue = (price + parseValue) * quantity;
    }

    const newVatAmounts = [...vatAmounts];
    newVatAmounts[index] = isNaN(finalValue) ? "0.00" : finalValue.toFixed(2);
    setVatAmounts(newVatAmounts);

    const newVatValues = [...vatValues];
    newVatValues[index] = value;
    setVatValues(newVatValues);

    const newRfqItem = [...rfqItemList];
    newRfqItem[index].VAT_AMOUNT = value;
    newRfqItem[index].TOTAL_LINE_AMOUNT = isNaN(finalValue)
      ? "0.00"
      : finalValue.toFixed(2);
    setRfqItemList(newRfqItem);
  };
  // const handleVatChange2 = (
  //   value: string,
  //   index: number,
  //   type: string = vatTypes[index]
  // ) => {
  //   if (value !== "") {
  //     const quantity: number = quotationList[index].OFFERED_QUANTITY || 0;
  //     const price = parseFloat(quotationList[index].UNIT_PRICE) || 0;
  //     const parseValue = parseFloat(value) || 0; // Ensure value is parsed as a number

  //     let finalValue = 0;

  //     if (type === "Percentage" || type === "") {
  //       const percentage = parseValue / 100;
  //       const vatAmount = price * percentage;
  //       finalValue = (price + vatAmount) * quantity;
  //     } else if (type === "Amount") {
  //       finalValue = (price + parseValue) * quantity;
  //     }

  //     const newVatAmounts = [...vatAmounts];
  //     newVatAmounts[index] = isNaN(finalValue) ? "0.00" : finalValue.toFixed(2);
  //     setVatAmounts2(newVatAmounts);

  //     const newVatValues = [...vatValues];
  //     newVatValues[index] = value;
  //     setVatValues2(newVatValues);

  //     const newRfqItem = [...quotationList];
  //     newRfqItem[index].VAT_AMOUNT = isNaN(parseValue)
  //       ? "0.00"
  //       : parseValue.toFixed(2); // Convert to string
  //     newRfqItem[index].TOTAL_LINE_AMOUNT = isNaN(finalValue)
  //       ? "0.00"
  //       : finalValue.toFixed(2);
  //     setQuotationList(newRfqItem);
  //   } else {
  //     console.log("value string na");
  //   }
  // };

  const handleVatChange2 = (
    value: string,
    index: number,
    type: string = vatTypes2[index] // Ensure you use vatTypes2 here
  ) => {
    const newQuatationList = [...quotationList];
    newQuatationList[index].VAT_AMOUNT = value;
    setQuotationList(newQuatationList);

    setSelectedRfqItemList2((prevSelectedList) => {
      return prevSelectedList.map((item) =>
        item.REQUISITION_LINE_ID === newQuatationList[index].REQUISITION_LINE_ID
          ? { ...item, VAT_AMOUNT: value }
          : item
      );
    });
    // const quantity: number = quotationList[index].OFFERED_QUANTITY || 0;
    // const price = parseFloat(quotationList[index].UNIT_PRICE) || 0;

    // let finalValue = 0;

    // if (value !== "") {
    //   const parseValue = parseFloat(value) || 0;

    //   if (type === "Percentage") {
    //     const percentage = parseValue / 100;
    //     const vatAmount = price * percentage;
    //     finalValue = (price + vatAmount) * quantity;
    //   } else if (type === "Amount") {
    //     finalValue = (price + parseValue) * quantity;
    //   }

    //   const newVatAmounts = [...vatAmounts2];
    //   newVatAmounts[index] = isNaN(finalValue) ? "" : finalValue.toFixed(2);
    //   setVatAmounts2(newVatAmounts);

    //   const newVatValues = [...vatValues2];
    //   newVatValues[index] = value; // Set the value that was passed
    //   setVatValues2(newVatValues);

    //   const newRfqItem = [...quotationList];
    //   newRfqItem[index].VAT_AMOUNT = isNaN(parseValue)
    //     ? ""
    //     : parseValue.toFixed(2);
    //   newRfqItem[index].TOTAL_LINE_AMOUNT = isNaN(finalValue)
    //     ? ""
    //     : finalValue.toFixed(2);
    //   setQuotationList(newRfqItem);
    // } else {
    //   // Reset VAT value and amount when value is empty
    //   const newVatAmounts = [...vatAmounts2];
    //   newVatAmounts[index] = "";
    //   setVatAmounts2(newVatAmounts);

    //   const newVatValues = [...vatValues2];
    //   newVatValues[index] = ""; // Clear the VAT value
    //   setVatValues2(newVatValues);

    //   const newRfqItem = [...quotationList];
    //   newRfqItem[index].VAT_AMOUNT = ""; // Reset VAT amount
    //   newRfqItem[index].TOTAL_LINE_AMOUNT = (price * quantity).toFixed(2); // Reset total
    //   setQuotationList(newRfqItem);
    // }
  };

  useEffect(() => {
    const total = vatAmounts.reduce((acc, curr) => acc + parseFloat(curr), 0);
    setTotalVatAmount(total);
  }, [vatAmounts]);

  // vat calculation

  //export to excel

  let fileName = moment(Date()).format("DD/MM/YYYY");
  const headers = [
    { label: "RFQ_LINE_ID", key: "RFQ_LINE_ID" },
    { label: "RFQ_ID", key: "RFQ_ID" },
    { label: "REQUISITION_HEADER_ID", key: "REQUISITION_HEADER_ID" },
    { label: "REQUISITION_LINE_ID", key: "REQUISITION_LINE_ID" },
    { label: "PR_NUMBER", key: "PR_NUMBER" },
    { label: "LINE_NUM", key: "LINE_NUM" },
    { label: "LINE_TYPE_ID", key: "LINE_TYPE_ID" },
    { label: "ITEM_CODE", key: "ITEM_CODE" },
    { label: "ITEM_DESCRIPTION", key: "ITEM_DESCRIPTION" },
    { label: "ITEM_SPECIFICATION", key: "ITEM_SPECIFICATION" },
    { label: "WARRANTY_DETAILS", key: "SUPPLIER_WARRANTY_DETAILS" },
    { label: "PACKING_TYPE", key: "PACKING_TYPE" },
    { label: "PROJECT_NAME", key: "PROJECT_NAME" },
    { label: "EXPECTED_QUANTITY", key: "EXPECTED_QUANTITY" },
    { label: "EXPECTED_BRAND_NAME", key: "EXPECTED_BRAND_NAME" },
    { label: "EXPECTED_ORIGIN", key: "EXPECTED_ORIGIN" },
    { label: "LCM_ENABLE_FLAG", key: "LCM_ENABLE_FLAG" },
    { label: "UNIT_MEAS_LOOKUP_CODE", key: "UNIT_MEAS_LOOKUP_CODE" },
    { label: "NEED_BY_DATE", key: "NEED_BY_DATE" },
    { label: "ORG_ID", key: "ORG_ID" },
    { label: "ATTRIBUTE_CATEGORY", key: "ATTRIBUTE_CATEGORY" },
    { label: "PR_FROM_DFF", key: "PR_FROM_DFF" },
    { label: "AUTHORIZATION_STATUS", key: "AUTHORIZATION_STATUS" },
    { label: "NOTE_TO_SUPPLIER", key: "NOTE_TO_SUPPLIER" },
    { label: "WARRANTY_ASK_BY_BUYER", key: "WARRANTY_ASK_BY_BUYER" },
    { label: "BUYER_VAT_APPLICABLE", key: "BUYER_VAT_APPLICABLE" },
    { label: "DELIVER_TO_LOCATION_ID", key: "DELIVER_TO_LOCATION_ID" },
    {
      label: "DESTINATION_ORGANIZATION_ID",
      key: "DESTINATION_ORGANIZATION_ID",
    },
    { label: "CS_STATUS", key: "CS_STATUS" },
    { label: "CREATION_DATE", key: "CREATION_DATE" },
    { label: "CREATED_BY", key: "CREATED_BY" },
    { label: "LAST_UPDATED_BY", key: "LAST_UPDATED_BY" },
    { label: "LAST_UPDATE_DATE", key: "LAST_UPDATE_DATE" },
    { label: "BUYER_FILE_ORG_NAME", key: "BUYER_FILE_ORG_NAME" },
    { label: "BUYER_FILE_NAME", key: "BUYER_FILE_NAME" },
    { label: "ITEM_ID", key: "ITEM_ID" },
    { label: "QUOT_LINE_ID", key: "QUOT_LINE_ID" },
    { label: "RFQ_LINE_ID_1", key: "RFQ_LINE_ID_1" },
    { label: "RFQ_ID_1", key: "RFQ_ID_1" },
    { label: "USER_ID", key: "USER_ID" },
    { label: "WARRANTY_BY_SUPPLIER", key: "WARRANTY_BY_SUPPLIER" },
    { label: "SUPPLIER_VAT_APPLICABLE", key: "SUPPLIER_VAT_APPLICABLE" },
    { label: "UNIT_PRICE", key: "UNIT_PRICE" },
    { label: "OFFERED_QUANTITY", key: "OFFERED_QUANTITY" },
    { label: "PROMISE_DATE", key: "PROMISE_DATE" },
    { label: "SUP_FILE_ORG_NAME", key: "SUP_FILE_ORG_NAME" },
    { label: "SUP_FILE_NAME", key: "SUP_FILE_NAME" },
    { label: "CREATION_DATE_1", key: "CREATION_DATE_1" },
    { label: "CREATED_BY_1", key: "CREATED_BY_1" },
    { label: "LAST_UPDATED_BY_1", key: "LAST_UPDATED_BY_1" },
    { label: "LAST_UPDATE_DATE_1", key: "LAST_UPDATE_DATE_1" },
    { label: "AVAILABLE_BRAND_NAME", key: "AVAILABLE_BRAND_NAME" },
    { label: "AVAILABLE_ORIGIN", key: "AVAILABLE_ORIGIN" },
    { label: "AVAILABLE_SPECS", key: "AVAILABLE_SPECS" },
  ];

  //export to excel

  useEffect(() => {
    const newVatAmounts = calculateVatAmounts();

    // Check if the new VAT amounts are different from the current ones
    const hasChanged = newVatAmounts.some(
      (amount, index) => amount !== vatAmounts2[index]
    );

    if (hasChanged) {
      setVatAmounts2(newVatAmounts);

      const newQuotationList = quotationList.map((item, index) => ({
        ...item,
        TOTAL_LINE_AMOUNT: newVatAmounts[index],
      }));

      setSelectedRfqItemList2((prevSelectedList) => {
        return prevSelectedList.map((item, idx) =>
          item.REQUISITION_LINE_ID === newQuotationList[idx].REQUISITION_LINE_ID
            ? { ...item, TOTAL_LINE_AMOUNT: newVatAmounts[idx] }
            : item
        );
      });

      setQuotationList(newQuotationList);
    }
  }, [quotationList, calculateVatAmounts, vatAmounts2]);

  //image view

  // interface ImageUrls {
  //   [key: number]: string | null;
  // }

  // const [imageUrls, setImageUrls] = useState<ImageUrls>({});

  // // ... other state and functions

  // const getImage2 = async (
  //   filePath: string,
  //   fileName: string
  // ): Promise<string | null> => {
  //   try {
  //     const url = await fetchFileUrlService(filePath, fileName, token!);
  //     return url;
  //   } catch (error) {
  //     console.error("Error fetching image:", error);
  //     return null;
  //   }
  // };

  // useEffect(() => {
  //   if (quotationList) {
  //     const fetchImages = async () => {
  //       const newImageUrls: ImageUrls = {};
  //       for (let index = 0; index < quotationList.length; index++) {
  //         const element = quotationList[index];
  //         const url = await getImage2(
  //           buyerLineFilepath,
  //           element.BUYER_FILE_NAME
  //         );
  //         newImageUrls[element.RFQ_LINE_ID] = url;
  //       }
  //       setImageUrls(newImageUrls);
  //       // setIsLoading(false);
  //     };
  //     fetchImages();
  //   }
  // }, [quotationList, buyerLineFilepath]);
  // interface ImageUrls2 {
  //   [key: number]: string | null;
  // }

  // const [imageUrls2, setImageUrls2] = useState<ImageUrls>({});

  // // ... other state and functions

  // const getImage3 = async (
  //   filePath: string,
  //   fileName: string
  // ): Promise<string | null> => {
  //   try {
  //     const url = await fetchFileUrlService(filePath, fileName, token!);
  //     return url;
  //   } catch (error) {
  //     console.error("Error fetching image:", error);
  //     return null;
  //   }
  // };

  // useEffect(() => {
  //   if (rfqItemList) {
  //     const fetchImages = async () => {
  //       const newImageUrls: ImageUrls = {};
  //       for (let index = 0; index < rfqItemList.length; index++) {
  //         const element = rfqItemList[index];
  //         const url = await getImage2(
  //           buyerLineFilepath,
  //           element.BUYER_FILE_NAME
  //         );
  //         newImageUrls[element.RFQ_LINE_ID] = url;
  //       }
  //       setImageUrls(newImageUrls);
  //       // setIsLoading(false);
  //     };
  //     fetchImages();
  //   }
  // }, [rfqItemList, buyerLineFilepath]);

  interface ImageUrls {
    [key: number]: string | null;
  }

  const [imageUrls3, setImageUrls3] = useState<ImageUrls>({});
  const [imageUrls4, setImageUrls4] = useState<ImageUrls>({});

  // ... other state and functions

  const getImage3 = async (
    filePath: string,
    fileName: string
  ): Promise<string | null> => {
    try {
      console.log(`${filePath}/${fileName}`);

      const url = await fetchFileUrlService(filePath, fileName, token!);
      return url;
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  };

  useEffect(() => {
    if (quotationList) {
      const fetchImages = async () => {
        const newImageUrls: ImageUrls = {};
        for (let index = 0; index < quotationList.length; index++) {
          const element = quotationList[index];
          const url = await getImage3(
            buyerLineFilepath,
            element.BUYER_FILE_NAME
          );
          console.log(url);

          newImageUrls[element.ITEM_ID] = url;
        }
        setImageUrls3(newImageUrls);
        // setIsLoading(false);
      };
      fetchImages();
    }
  }, [quotationList, buyerLineFilepath]);

  useEffect(() => {
    if (rfqItemList) {
      const fetchImages = async () => {
        const newImageUrls: ImageUrls = {};
        for (let index = 0; index < rfqItemList.length; index++) {
          const element = rfqItemList[index];
          const url = await getImage3(
            buyerLineFilepath,
            element.BUYER_FILE_NAME
          );
          console.log(url);

          newImageUrls[element.RFQ_LINE_ID] = url;
        }
        setImageUrls4(newImageUrls);
        // setIsLoading(false);
      };
      fetchImages();
    }
  }, [rfqItemList, buyerLineFilepath]);

  return (
    <div className=" m-8">
      <WarningModal
        isOpen={isRejectOpen}
        action={reject} // Use the 'action' property instead of 'doDelete'
        closeModal={closeModal}
        message="Are you sure you want to reject this?"
      />

      <WarningModal
        isOpen={isUndoOpen}
        action={undo} // Use the 'action' property instead of 'doDelete'
        closeModal={closeUndoModal}
        message="Are you sure you want to Undo this?"
      />

      <div className=" flex flex-col items-start">
        <PageTitle titleText="RFQ Item List" />
        {/* <NavigationPan list={pan} /> */}
      </div>
      <div className=" h-2"></div>

      <div className="flex items-end justify-between">
        {selectedRfq?.RESPONSE_STATUS !== 1 &&
          // Render the block only if RESPONSE_STATUS is not 1
          (selectedRfq?.RESPONSE_STATUS === 0 ||
            selectedRfq?.RESPONSE_STATUS === 2) && (
            <div className="w-1/2 h-20 bg-offWhiteColor border-[1px] px-4 border-borderColor rounded-md flex justify-start items-center flex-row space-x-4">
              <InputLebel titleText={"Do you want to Participate?"} />
              <CommonButton
                onClick={() => {
                  openRejectModal();
                }}
                titleText={"Reject"}
                height="h-8"
                width="w-24"
                color="bg-[#E20000]"
              />
              <CommonButton
                onClick={accept}
                titleText={"Accept"}
                height="h-8"
                width="w-24"
                color="bg-[#00A76F]"
              />
            </div>
          )}

        {selectedRfq?.RESPONSE_STATUS !== 1 &&
          selectedRfq?.RESPONSE_STATUS === 3 && (
            <div className="w-7/12 h-20 bg-offWhiteColor border-[1px] px-4 border-borderColor rounded-md flex justify-start items-center flex-row space-x-4">
              <InputLebel
                titleText={"Do you want to Undo your Rejection and Accept?"}
              />
              {/* <CommonButton
              onClick={() => { openRejectModal();}}
              titleText={"Reject"}
              height="h-8"
              width="w-24"
              color="bg-[#E20000]"
            /> */}
              <CommonButton
                onClick={undoReject}
                titleText={"Undo Rejection"}
                height="h-8"
                width="w-32"
                color="bg-[#00A76F]"
              />
            </div>
          )}

        <div className=" h-8"></div>
        <div className=" flex flex-row justify-end items-center">
          {selectedRfq?.RESPONSE_STATUS !== 1 &&
          // Render the block only if RESPONSE_STATUS is not 1
          (selectedRfq?.RESPONSE_STATUS === 0 ||
            selectedRfq?.RESPONSE_STATUS === 2) ? null : (
            <CSVLink
              aria-disabled={true}
              data={rfqItemList}
              headers={headers}
              filename={`rfq_item_list_${fileName}.csv`}
            >
              <div className="exportToExcel">Export to Excel</div>
            </CSVLink>
          )}
        </div>
      </div>

      <div className=" h-8"></div>

      {rfqItemList.length === 0 ? (
        <LogoLoading />
      ) : (
        <>
          {quotationList.length !== 0 ? (
            <div className="overflow-x-auto">
              <div className="overflow-x-auto">
                <table
                  className="min-w-full divide-y divide-gray-200 border-[0.2px] border-borderColor rounded-md"
                  style={{ tableLayout: "fixed" }}
                >
                  <thead className="sticky top-0 bg-[#F4F6F8] h-14 z-20">
                    <tr>
                      <th
                        className={`font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  `}
                      ></th>
                      <th
                        className={`font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  `}
                      >
                        SL
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  ">
                        PR No/PR Line No2
                      </th>
                      {/* <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        RFQ Subject
                      </th> */}

                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Item Description
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Expected Spec
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Expected Brand Origin
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Available Spec. <span className="text-red-500">*</span>
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Available Brand <span className="text-red-500">*</span>
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Available Origin <span className="text-red-500">*</span>
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Need by Date
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Promised Date <span className="text-red-500">*</span>
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        UOM
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Expected quantity
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Offered Quantity <span className="text-red-500">*</span>
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Tolerance
                      </th>
                      {rfqTypeInStore === "T" ? null : (
                        <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                          Rate/unit <span className="text-red-500">*</span>
                        </th>
                      )}

                      {rfqTypeInStore === "T" ? null : (
                        <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                          VAT Yes/No
                        </th>
                      )}
                      {rfqTypeInStore === "T" ? null : (
                        <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                          VAT
                        </th>
                      )}
                      {rfqTypeInStore === "T" ? null : (
                        <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                          Amount Including VAT
                        </th>
                      )}
                      {rfqTypeInStore === "T" ? null : (
                        <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                          Freight Charge Amount
                        </th>
                      )}
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Packing Type
                      </th>
                      {/* <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Warranty
                      </th> */}
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Warranty Details
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Remarks
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Buyer Attachment
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Add Attachment
                      </th>

                      {/* Add more header columns as needed */}
                    </tr>
                  </thead>

                  {/* Table rows go here */}
                  {/* Table rows go here */}
                  {/* {list.slice(0, limit).map((e, i) => ( */}
                  {quotationList.map((rfq, index) => (
                    <tbody
                      onClick={() => {}}
                      key={index}
                      className={
                        !canEdit() ? "opacity-50 pointer-events-none" : ""
                      }
                    >
                      <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor font-medium">
                        <button
                          onClick={() => {
                            toggleprItemSelection2(rfq);
                            // if (isAccepted) {
                            //   //
                            // } else {
                            //   showErrorToast("Please Accept First");
                            // }
                          }}
                          className={`${
                            selectedRfqItemList2.some(
                              (emp) =>
                                emp.REQUISITION_LINE_ID ===
                                rfq.REQUISITION_LINE_ID
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
                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor font-medium">
                        {index + 1}
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        {rfq.PR_NUMBER}/{rfq.LINE_NUM}
                      </td>
                      {/* <td className="  font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        {rfqSubjectInStore}
                      </td> */}
                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        {rfq.ITEM_DESCRIPTION === ""
                          ? "N/A"
                          : rfq.ITEM_DESCRIPTION}
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        {rfq.ITEM_SPECIFICATION === ""
                          ? "N/A"
                          : rfq.ITEM_SPECIFICATION}
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        {!rfq.EXPECTED_ORIGIN ? "N/A" : rfq.EXPECTED_ORIGIN}
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        <CommonInputField
                          type="text"
                          width="w-44"
                          hint="Available Spec"
                          maxCharacterlength={150}
                          onChangeData={(value) =>
                            handleSpecificationChange2(value, index)
                          }
                          inputRef={{
                            current: specificationRefs2.current[index],
                          }}
                          value={specificationList2[index]}
                        />
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        <CommonInputField
                          type="text"
                          width="w-44"
                          hint="Available Brand"
                          maxCharacterlength={150}
                          onChangeData={(value) =>
                            handleBrandList2(value, index)
                          }
                          inputRef={{
                            current: brandRefs2.current[index],
                          }}
                          value={brandList2[index]}
                        />
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        {/* <CommonInputField
                          type="text"
                          width="w-44"
                          hint="Available Origin"
                          maxCharacterlength={150}
                          onChangeData={(value) =>
                            handleOriginList2(value, index)
                          }
                          inputRef={{
                            current: originRefs2.current[index],
                          }}
                          value={originList2[index]}
                        /> */}

                        <DropDown
                          hint="Select Country"
                          options={countryList}
                          onSelect={(value) =>
                            handleCountryChange2(value, index)
                          }
                          sval={rfq.COUNTRY_CODE}
                          width="w-44"
                        />
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        {rfq.NEED_BY_DATE === ""
                          ? "N/A"
                          : moment(rfq.NEED_BY_DATE).format("DD-MMMM-YYYY")}
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor z-10">
                        <DateRangePicker
                          signle={true}
                          useRange={false}
                          placeholder="Date"
                          width="w-36"
                          value={promiseDatesArray2[index]} // Pass the dates from the state
                          onChange={(newValue) =>
                            handlePromiseDateChange2(newValue, index)
                          } // Update the state on change
                        />
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        {rfq.UNIT_MEAS_LOOKUP_CODE === ""
                          ? "N/A"
                          : rfq.UNIT_MEAS_LOOKUP_CODE}
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        {!rfq.EXPECTED_QUANTITY ? "N/A" : rfq.EXPECTED_QUANTITY}
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        <CommonInputField
                          hint="00"
                          type="text"
                          width="w-16"
                          height="h-8"
                          onChangeData={(value) =>
                            handleOfferedQuantity2(value, index)
                          }
                          inputRef={{
                            current: offeredQuantityRefs2.current[index],
                          }}
                          value={offeredQuantityList2[index]}
                        />
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        <CommonInputField
                          hint="00"
                          type="text"
                          width="w-16"
                          height="h-8"
                          onChangeData={(value) =>
                            handleToleranceChange2(value, index)
                          }
                          inputRef={{
                            current: toleranceRefs2.current[index],
                          }}
                          value={toleranceList2[index]}
                        />
                      </td>
                      {rfqTypeInStore === "T" ? null : (
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          <CommonInputField
                            hint="00.00"
                            type="text"
                            width="w-16"
                            height="h-8"
                            onChangeData={(value) =>
                              handleUnitPriceChange2(value, index)
                            }
                            inputRef={{
                              current: unitPriceRefs2.current[index],
                            }}
                            value={unitPriceList2[index]}
                            disable={rfqTypeInStore === "T" ? true : false}
                          />
                        </td>
                      )}
                      {rfqTypeInStore === "T" ? null : (
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          <div className=" flex flex-row space-x-2 items-center justify-center">
                            <button
                              disabled={rfqTypeInStore === "T" ? true : false}
                              onClick={() => {
                                handleVatEnable2(index);
                              }}
                              className={` h-4 w-4  rounded-md ${
                                rfq.SUPPLIER_VAT_APPLICABLE === "Y"
                                  ? "border-none bg-midGreen"
                                  : "border-[0.1px] border-borderColor bg-white"
                              } flex justify-center items-center`}
                            >
                              <img
                                src="/images/check.png"
                                alt="check"
                                className=" w-2 h-2"
                              />
                            </button>
                          </div>
                        </td>
                      )}

                      {rfqTypeInStore === "T" ? null : (
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          <div className="flex items-center">
                            <DropDown
                              options={vatOptions}
                              onSelect={(value) =>
                                handleVatTypeChange2(value, index)
                              }
                              width="w-32 h-8"
                              sval={vatTypes2[index]} // Use vatTypes2 which is updated from the API
                              hint="VAT Type"
                              disable={rfqTypeInStore === "T" ? true : false}
                            />

                            <CommonInputField
                              hint={
                                vatTypes2[index] === "Percentage"
                                  ? "%"
                                  : "Amount"
                              } // Use vatTypes2 here as well
                              type="text"
                              width="w-16"
                              height="h-8"
                              onChangeData={(value) =>
                                handleVatChange2(value, index)
                              }
                              inputRef={{
                                current: includeVatRef.current[index],
                              }}
                              value={vatValues2[index]}
                              disable={rfqTypeInStore === "T"}
                            />
                          </div>
                        </td>
                      )}
                      {rfqTypeInStore === "T" ? null : (
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {isNaN(parseFloat(vatAmounts2[index])) ||
                          vatAmounts2[index] === ""
                            ? "0"
                            : vatAmounts2[index]}
                        </td>
                      )}

                      {/* <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        <CommonInputField
                          hint="00.00"
                          type="text"
                          width="w-16"
                          height="h-8"
                          onChangeData={(value) =>
                            handleIncludeVatChange(value, index)
                          }
                          inputRef={{
                            current: includeVatRef.current[index],
                          }}
                          value={includeVat[index]}
                        />
                      </td> */}

                      {rfqTypeInStore === "T" ? null : (
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          <CommonInputField
                            hint="00.00"
                            type="text"
                            width="w-16"
                            height="h-8"
                            onChangeData={(value) =>
                              handleFreightChargeAmount2(value, index)
                            }
                            inputRef={{
                              current: freightChargeAmountRef2.current[index],
                            }}
                            value={freightChargeAmount2[index]}
                            // disable={rfqTypeInStore === "T" ? true : false}
                          />
                        </td>
                      )}

                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        {!rfq.PACKING_TYPE ? "---" : rfq.PACKING_TYPE}
                      </td>
                      {/* <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        <div className=" flex flex-row space-x-2 items-center justify-center">
                          <button
                            onClick={() => {
                              handleWarrantyEnable2(index);
                            }}
                            className={` h-4 w-4  rounded-md ${
                              rfq.WARRANTY_BY_SUPPLIER === "Y"
                                ? "border-none bg-midGreen"
                                : "border-[0.1px] border-borderColor bg-white"
                            } flex justify-center items-center`}
                          >
                            <img
                              src="/images/check.png"
                              alt="check"
                              className=" w-2 h-2"
                            />
                          </button>
                        </div>
                      </td> */}

                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        <CommonInputField
                          type="text"
                          width="w-44"
                          hint="Warranty details"
                          maxCharacterlength={150}
                          onChangeData={(value) =>
                            handleWarrantyDetails2(value, index)
                          }
                          inputRef={{
                            current: warrantyDetailsRef2.current[index],
                          }}
                          value={warrantyDetailsList2[index]}
                        />
                      </td>

                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        {rfq.NOTE_TO_SUPPLIER === ""
                          ? "---"
                          : rfq.NOTE_TO_SUPPLIER}
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        <a
                          className="dashedButton"
                          href={`${imageUrls3[rfq.ITEM_ID]!}`}
                          target="blank"
                        >
                          View
                        </a>
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-[14px] text-blackColor">
                        <FilePickerInput
                          mimeType=".pdf, image/*"
                          fontSize="text-sm"
                          width="w-full"
                          onFileSelect={(newFile: File | null) =>
                            handleAttachmentFile2(newFile!, index)
                          }
                          maxSize={2 * 1024 * 1024}
                        />
                      </td>
                    </tbody>
                  ))}
                </table>
              </div>
              <div className=" my-10 w-full flex justify-end items-end space-x-6">
                <CommonButton
                  titleText="Previous"
                  color="bg-graishColor"
                  onClick={previous}
                  height="h-8"
                  width="w-32"
                />

                {!canEdit() ? null : (
                  <CommonButton
                    titleText={"Continue"}
                    onClick={submitNext2}
                    color="bg-midGreen"
                    height="h-8"
                    width="w-32"
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="overflow-x-auto">
                <table
                  className="min-w-full divide-y divide-gray-200 border-[0.2px] border-borderColor rounded-md"
                  style={{ tableLayout: "fixed" }}
                >
                  <thead className="sticky top-0 bg-[#F4F6F8] h-14 z-20">
                    <tr>
                      <th
                        className={`font-mon px-6 py-3 text-left text-sm font-medium text-blackColor {isCloseDatePassed ? 'opacity-50 pointer-events-none' : ''} `}
                      ></th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  ">
                        SL
                      </th>
                      <th className=" font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        PR No/PR Line No1
                      </th>
                      {/* <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        RFQ Subject
                      </th> */}
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Item Description
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Expected Spec
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Expected Brand Origin
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Available Spec. <span className="text-red-500">*</span>
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Available Brand <span className="text-red-500">*</span>
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Available Origin <span className="text-red-500">*</span>
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Need by Date
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Promised Date <span className="text-red-500">*</span>
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        UOM
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Expected quantity
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Offered Quantity <span className="text-red-500">*</span>
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Tolerance
                      </th>
                      {rfqTypeInStore === "T" ? null : (
                        <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                          Rate/unit <span className="text-red-500">*</span>
                        </th>
                      )}

                      {rfqTypeInStore === "T" ? null : (
                        <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                          VAT Yes/No
                        </th>
                      )}

                      {rfqTypeInStore === "T" ? null : (
                        <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                          VAT
                        </th>
                      )}

                      {rfqTypeInStore === "T" ? null : (
                        <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                          Amount Including VAT
                        </th>
                      )}
                      {rfqTypeInStore === "T" ? null : (
                        <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                          Freight Charge amount
                        </th>
                      )}
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Packing Type
                      </th>
                      {/* <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Warranty
                      </th> */}
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Warranty Details
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Remarks
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Buyer Attachment
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Add Attachment
                      </th>

                      {/* Add more header columns as needed */}
                    </tr>
                  </thead>

                  {/* Table rows go here */}
                  {/* Table rows go here */}
                  {/* {list.slice(0, limit).map((e, i) => ( */}
                  {rfqItemList.map((rfq, index) => (
                    <tbody
                      onClick={() => {}}
                      className={`
                    cursor-pointer ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-100"
                    } divide-y divide-gray-200 ${
                        !canEdit() ? "opacity-50 pointer-events-none" : ""
                      }`}
                      key={index}
                    >
                      <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor font-medium">
                        <button
                          onClick={() => {
                            if (isAccepted) {
                              toggleprItemSelection(rfq);
                            } else {
                              showErrorToast("Please Accept First");
                            }
                          }}
                          className={`${
                            selectedRfqItemList.some(
                              (emp) =>
                                emp.REQUISITION_LINE_ID ===
                                rfq.REQUISITION_LINE_ID
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
                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor font-medium">
                        {index + 1}
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        {rfq.PR_NUMBER}
                      </td>
                      {/* <td className="  font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        {rfqSubjectInStore}
                      </td> */}
                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        {rfq.ITEM_DESCRIPTION === ""
                          ? "N/A"
                          : rfq.ITEM_DESCRIPTION}
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        {rfq.ITEM_SPECIFICATION === ""
                          ? "N/A"
                          : rfq.ITEM_SPECIFICATION}
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        {rfq.EXPECTED_ORIGIN === ""
                          ? "N/A"
                          : rfq.EXPECTED_ORIGIN}
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        <CommonInputField
                          hint="Available Spec..."
                          type="text"
                          width="w-36"
                          height="h-8"
                          onChangeData={(value) =>
                            handleAvailableSpecChange(value, index)
                          }
                          inputRef={{
                            current: availableSpecRef.current[index],
                          }}
                          value={availableSpec[index]}
                        />
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        <CommonInputField
                          hint="Available Brand..."
                          type="text"
                          width="w-36"
                          height="h-8"
                          onChangeData={(value) =>
                            handleAvailableBrandChange(value, index)
                          }
                          inputRef={{
                            current: availableBrandRef.current[index],
                          }}
                          value={availableBrand[index]}
                        />
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        {/* <CommonInputField
                          hint="Available Origin..."
                          type="text"
                          width="w-36"
                          height="h-8"
                          onChangeData={(value) =>
                            handleAvailableOriginChange(value, index)
                          }
                          inputRef={{
                            current: availableOriginRef.current[index],
                          }}
                          value={availableOrigin[index] || ""}
                        /> */}

                        <DropDown
                          hint="Select Country"
                          options={countryList}
                          onSelect={(value) =>
                            handleCountryChange(value, index)
                          }
                          sval={rfq.COUNTRY_CODE}
                          width="w-44"
                        />
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        {rfq.NEED_BY_DATE === ""
                          ? "N/A"
                          : moment(rfq.NEED_BY_DATE).format("DD-MMMM-YYYY")}
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor z-10">
                        {/* <DateRangePicker
                        placeholder="Select date"
                        value={promiseDate}
                        onChange={handlePromiseDateChange}
                        width="w-36"
                        height="h-8"
                        useRange={false}
                        signle={true}
                      /> */}

                        <DateRangePicker
                          placeholder="Select date"
                          value={
                            promiseDate[index] ?? {
                              startDate: null,
                              endDate: null,
                            }
                          }
                          onChange={(newValue) =>
                            handlePromiseDateChange(newValue, index)
                          }
                          width="w-36"
                          height="h-8"
                          useRange={false}
                          signle={true}
                        />
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        {rfq.UNIT_MEAS_LOOKUP_CODE === ""
                          ? "N/A"
                          : rfq.UNIT_MEAS_LOOKUP_CODE}
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        {rfq.EXPECTED_QUANTITY === ""
                          ? "N/A"
                          : rfq.EXPECTED_QUANTITY}
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        <CommonInputField
                          hint="00"
                          type="text"
                          width="w-16"
                          height="h-8"
                          onChangeData={(value) =>
                            handleOfferQuantityChange(value, index)
                          }
                          inputRef={{
                            current: offerQuantityRef.current[index],
                          }}
                          value={offerQuantity[index]}
                        />
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        <CommonInputField
                          hint="1%"
                          type="text"
                          width="w-16"
                          height="h-8"
                          onChangeData={(value) =>
                            handleToleranceChange(value, index)
                          }
                          inputRef={{
                            current: toleranceRefs.current[index],
                          }}
                          value={toleranceList[index]}
                        />
                      </td>
                      {rfqTypeInStore === "T" ? null : (
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          <CommonInputField
                            hint="00.00"
                            type="text"
                            width="w-16"
                            height="h-8"
                            onChangeData={(value) =>
                              handleUnitPriceChange(value, index)
                            }
                            inputRef={{
                              current: unitPriceRef.current[index],
                            }}
                            value={unitPrice[index]}
                            disable={rfqTypeInStore === "T" ? true : false}
                          />
                        </td>
                      )}
                      {rfqTypeInStore === "T" ? null : (
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          <div className=" flex flex-row space-x-2 items-center justify-center">
                            <button
                              disabled={rfqTypeInStore === "T" ? true : false}
                              onClick={() => {
                                handleVatEnable(index);
                              }}
                              className={` h-4 w-4  rounded-md ${
                                rfq.SUPPLIER_VAT_APPLICABLE === "Y"
                                  ? "border-none bg-midGreen"
                                  : "border-[0.1px] border-borderColor bg-white"
                              } flex justify-center items-center`}
                            >
                              <img
                                src="/images/check.png"
                                alt="check"
                                className=" w-2 h-2"
                              />
                            </button>
                          </div>
                        </td>
                      )}

                      {rfqTypeInStore === "T" ? null : (
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          <div className="flex items-center">
                            <DropDown
                              options={vatOptions}
                              onSelect={(value) =>
                                handleVatTypeChange(value, index)
                              }
                              width="w-32 h-8"
                              sval={vatTypes[index]} // Use the VAT type specific to this row
                              hint="VAT Type"
                              disable={rfqTypeInStore === "T" ? true : false}
                            />

                            <CommonInputField
                              hint={
                                vatTypes[index] === "Percentage"
                                  ? "%"
                                  : "Amount"
                              }
                              type="text"
                              width="w-16"
                              height="h-8"
                              onChangeData={(value) =>
                                handleVatChange(value, index)
                              }
                              inputRef={{
                                current: includeVatRef.current[index],
                              }}
                              value={vatValues[index]}
                              disable={rfqTypeInStore === "T"}
                            />
                          </div>
                        </td>
                      )}

                      {rfqTypeInStore === "T" ? null : (
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {isNaN(parseFloat(vatAmounts[index])) ||
                          vatAmounts[index] === ""
                            ? "0"
                            : vatAmounts[index]}
                        </td>
                      )}

                      {/* <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor"> */}
                      {/* <CommonInputField
                        hint="00.00"
                        type="text"
                        width="w-16"
                        height="h-8"
                        onChangeData={(value) =>
                          handleIncludeVatChange(value, index)
                        }
                        inputRef={{
                          current: includeVatRef.current[index],
                        }}
                        value={includeVat[index]}
                      /> */}
                      {/* </td> */}

                      {rfqTypeInStore === "T" ? null : (
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          <CommonInputField
                            hint="00.00"
                            type="text"
                            width="w-16"
                            height="h-8"
                            onChangeData={(value) =>
                              handleFreightChargeAmountChange(value, index)
                            }
                            inputRef={{
                              current: freightChargeAmountRefs.current[index],
                            }}
                            value={freightChargeAmountList[index]}
                          />
                        </td>
                      )}
                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        {rfq.PACKING_TYPE === "" ? "---" : rfq.PACKING_TYPE}
                      </td>
                      {/* <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        <div className=" flex flex-row space-x-2 items-center justify-center">
                          <button
                            onClick={() => {
                              handleWarrantyEnable(index);
                            }}
                            className={` h-4 w-4  rounded-md ${
                              rfq.WARRANTY_BY_SUPPLIER === "Y"
                                ? "border-none bg-midGreen"
                                : "border-[0.1px] border-borderColor bg-white"
                            } flex justify-center items-center`}
                          >
                            <img
                              src="/images/check.png"
                              alt="check"
                              className=" w-2 h-2"
                            />
                          </button>
                        </div>
                      </td> */}

                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        <CommonInputField
                          hint="Warranty details"
                          type="text"
                          width="w-36"
                          height="h-8"
                          onChangeData={(value) =>
                            handleWarrantyDetailsChange(value, index)
                          }
                          inputRef={{
                            current: warrantyDetailsRef.current[index],
                          }}
                          value={warrantyDetails[index]}
                        />
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        {rfq.NOTE_TO_SUPPLIER === ""
                          ? "---"
                          : rfq.NOTE_TO_SUPPLIER}
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                        <a
                          className="dashedButton"
                          // href={`${buyerLineFilepath}/${rfq.BUYER_FILE_NAME}`}
                          href={imageUrls4[rfq.RFQ_LINE_ID]!}
                          target="blank"
                        >
                          View
                        </a>
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-[14px] text-blackColor">
                        <FilePickerInput
                          mimeType=".pdf, image/*"
                          fontSize="text-sm"
                          width="w-full"
                          onFileSelect={(newFile: File | null) =>
                            handleAttachmentFile(newFile!, index)
                          }
                          maxSize={2 * 1024 * 1024}
                        />
                      </td>
                    </tbody>
                  ))}
                </table>
              </div>
              <div className=" my-10 w-full flex justify-end items-end space-x-6">
                <CommonButton
                  titleText="Previous"
                  color="bg-graishColor"
                  onClick={previous}
                  height="h-8"
                  width="w-32"
                />
                <CommonButton
                  titleText={"Continue"}
                  onClick={submitNext}
                  color="bg-midGreen"
                  height="h-8"
                  width="w-32"
                />
              </div>
            </div>
          )}
        </>
      )}

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box modal-middle w-2/6 max-w-none">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          {/* <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click on ✕ button to close</p> */}

          <div className="h-6"></div>

          <div>
            <div className="">
              <h3 className="font-semibold text-lg">
                Are you sure you want to reject?
              </h3>

              <div className="h-4"></div>

              <div className="flex items-center justify-end space-x-3">
                <CommonButton
                  onClick={accept}
                  titleText={"No"}
                  height="h-8"
                  width="w-24"
                  color="bg-[#00A76F]"
                />

                <CommonButton
                  onClick={rejectModal}
                  titleText={"Yes"}
                  height="h-8"
                  width="w-24"
                  color="bg-[#E20000]"
                />
                {/* <button className="border-[2px] border-[#FF5630] rounded-md h-8 w-24">Reject</button> */}
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}
