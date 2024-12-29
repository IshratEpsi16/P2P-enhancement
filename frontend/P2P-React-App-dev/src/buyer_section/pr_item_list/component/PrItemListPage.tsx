import React, { RefObject, useRef, useState, useEffect } from "react";
import PageTitle from "../../../common_component/PageTitle";
import NavigationPan from "../../../common_component/NavigationPan";
import InputLebel from "../../../common_component/InputLebel";
import DropDown from "../../../common_component/DropDown";
import CommonInputField from "../../../common_component/CommonInputField";
// import moment from "moment/moment";
import Datepicker from "react-tailwindcss-datepicker";
import DateRangePicker from "../../../common_component/DateRangePicker";
import CommonButton from "../../../common_component/CommonButton";
import Popper from "@mui/material/Popper";
import ReusableDatePicker from "../../../common_component/ReusableDatePicker";
import FilePickerInput from "../../../common_component/FilePickerInput";
import ReusablePopperComponent from "../../../common_component/ReusablePopperComponent";
import ReusablePaginationComponent from "../../../common_component/ReusablePaginationComponent";
import { useRfqCreateProcessContext } from "../../../buyer_rfq_create/context/RfqCreateContext";
import { Button } from "keep-react";
import prItemListService from "../service/PrItemListService";
import { useAuth } from "../../../login_both/context/AuthContext";
import { showErrorToast } from "../../../Alerts_Component/ErrorToast";
import SuccessToast, {
  showSuccessToast,
} from "../../../Alerts_Component/SuccessToast";
import PrItemInterface from "../interface/PrItemInterface";
import ArrowLeftIcon from "../../../icons/ArrowLeftIcon";
import ArrowRightIcon from "../../../icons/ArrowRightIcon";
import LogoLoading from "../../../Loading_component/LogoLoading";
import NotFoundPage from "../../../not_found/component/NotFoundPage";
import GetOrgListService from "../../../common_service/GetOrgListService";
import CommonOrgInterface from "../../../common_interface/CommonOrgInterface";
import usePrItemsStore from "../../pr/store/prItemStore";
import WarningModal from "../../../common_component/WarningModal";
import moment from "moment-timezone";
import CurrentStockService from "../service/CurrentStockService";
import CurrentStockInterface from "../interface/CurrentStockInterface";
import SelectedPrItemInterface from "../interface/selectedPritemInterface";
import ValidationError from "../../../Alerts_Component/ValidationError";
import RfqDetailsService from "../service/RfqDetailsService";
import { CSVLink } from "react-csv";
import RfiSupplierInterface from "../../../rfi_in_supplier_registration/interface/RfiSupplierInterface";
import RfiSupplierListService from "../../../rfi_in_supplier_registration/service/RfiSupplierListService";
import UserCircleIcon from "../../../icons/userCircleIcon";
import isoToDateTime from "../../../utils/methods/isoToDateTime";
import DeleteLineItemService from "../../buyer_term/service/DeleteLineItemService";
import CircularProgressIndicator from "../../../Loading_component/CircularProgressIndicator";
import ArrowDownIcon from "../../../icons/ArrowDownIcon";
import ArrowUpIcon from "../../../icons/ArrowUpIcon";
import usePermissionStore from "../../../utils/store/PermissionStore";
import { button } from "@material-tailwind/react";
import OrganizationListService from "../../../role_access/service/OrganizationListService";
import { find } from "lodash";
import fetchFileUrlService from "../../../common_service/fetchFileUrlService";

const list = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
// Initialize an array to hold the state for each row's approveDates
const initialNeedByDatesArray = list.map(() => ({
  startDate: new Date(),
  endDate: new Date(),
}));
const initialNeedByDatesArray2 = list.map(() => ({
  startDate: new Date(),
  endDate: new Date(),
}));
const pan = ["Home", "PR Item List"];
export default function PrItemListPage() {
  const prNumberRef = useRef<HTMLInputElement | null>(null);
  const prNumberRef2 = useRef<HTMLInputElement | null>(null);
  const itemNameRef = useRef<HTMLInputElement | null>(null);
  const itemNameRef2 = useRef<HTMLInputElement | null>(null);
  const requesterNameRef = useRef<HTMLInputElement | null>(null);
  const requesterNameRef2 = useRef<HTMLInputElement | null>(null);
  const buyerNameRef = useRef<HTMLInputElement | null>(null);
  const buyerNameRef2 = useRef<HTMLInputElement | null>(null);

  const specificationRefs = useRef<HTMLInputElement[]>([]);
  const specificationRefs2 = useRef<HTMLInputElement[]>([]);

  const [total, setTotal] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(10);
  const [pageNo, setPageNo] = useState<number>(1);
  const [offset, setOffSet] = useState<number>(0);
  const [prNumber, setPrNumber] = useState<string>("");
  const [itemName, setItemName] = useState<string>("");
  const [requesterName, setRequesterName] = useState<string>("");
  const [buyerName, setBuyerName] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoading2, setIsLoading2] = useState<boolean>(false);
  const [prItemList, setPrItemList] = useState<PrItemInterface[] | []>([]);
  const [sortBy, setSortBy] = useState<keyof PrItemInterface | null>(null);

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [allPrItemList, setAllPrItemList] = useState<PrItemInterface[] | []>(
    []
  );
  const [prItemList2, setPrItemList2] = useState<PrItemInterface[] | []>([]);
  const [selectedPrItemList, setSelectedPrItemList] = useState<
    PrItemInterface[] | []
  >([]); //SelectedPrItemInterface silo akhn chage korsi
  const [selectedPrItemList2, setSelectedPrItemList2] = useState<
    PrItemInterface[] | []
  >([]);
  //SelectedPrItemInterface silo akhn chage korsi
  const [isSelectedAll, setIsSelectAll] = useState<boolean>(false);
  const [isSelectedAll2, setIsSelectAll2] = useState<boolean>(false);

  const [specificationList, setSpecificationList] = useState<string[]>([]);
  const [specificationList2, setSpecificationList2] = useState<string[]>([]);
  const [rfqAttachmentFileList, setRfqAttachmentFileList] = useState<
    File[] | []
  >([]);
  const [rfqAttachmentFileList2, setRfqAttachmentFileList2] = useState<
    File[] | []
  >([]);
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [vatAppicableFromBuyer, setvatApplicableFromBuyer] = useState<string[]>(
    []
  );
  const [vatAppicableFromBuyer2, setvatApplicableFromBuyer2] = useState<
    string[]
  >([]);

  // const [specification, setSpecification] = useState<string[]>(Array().fill(''));

  //useAuth
  const { token, userId, buyerId } = useAuth();
  //useAuth

  useEffect(() => {
    //todo: aikhne user id pathate hbe
    // getprItem(parseInt(selectedOrgId), offset, limit);

    if (!isCreateRfq) {
      rfqDetailsService();
    }
    getOrgList();
    // if (prItems.length > 0) {
    //   setSelectedPrItemList(prItems);
    // }
  }, []);

  useEffect(() => {
    if (prItemList && prItemList2) {
      subtract();
    }
  }, [prItemList2]);

  const subtract = () => {
    if (prItemList.length > 0 && prItemList2.length > 0) {
      console.log("subtracted");
      console.log(prItemList);
      console.log(prItemList2);

      const filteredData = prItemList.filter(
        (dataItem: PrItemInterface) =>
          !prItemList2.some(
            (lineItem: PrItemInterface) =>
              lineItem.REQUISITION_HEADER_ID === dataItem.REQUISITION_HEADER_ID
          )
      );
      console.log(prItemList2);

      console.log(filteredData);

      console.log(filteredData.length);

      setPrItemList(filteredData);
    }
  };

  // const subtract = () => {
  //   if (prItemList.length > 0 && prItemList2.length > 0) {
  //     console.log("subtracted");
  //     console.log(prItemList);
  //     console.log(prItemList2);

  //     const filteredData = prItemList.filter((dataItem: PrItemInterface) =>
  //       prItemList2.some(
  //         (lineItem: PrItemInterface) =>
  //           lineItem.REQUISITION_HEADER_ID === dataItem.REQUISITION_HEADER_ID

  //         // &&
  //         // lineItem.REQUISITION_LINE_ID === dataItem.REQUISITION_LINE_ID
  //       )
  //     );
  //     console.log(prItemList2);

  //     console.log(filteredData);

  //     console.log(filteredData.length);

  //     setPrItemList(filteredData);
  //   }
  // };

  //get org list

  interface Org {
    value: string;
    label: string;
  }

  const [orgList, setOrgList] = useState<CommonOrgInterface[] | []>([]);
  const [convertedOrgList, setConvertedOrgList] = useState<Org[] | []>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");

  const handleSelect = (value: string) => {
    console.log(`Selected: ${value}`);
    setSelectedOrgId(value);
    // Do something with the selected value
    setOrgIdInStore(value);
    const findOrg = orgList.find(
      (org) => org.ORGANIZATION_ID.toString() === value
    );
    console.log(findOrg);
    setOrgNameInStore(findOrg?.NAME!);
  };

  // const getOrgList = async () => {
  //   try {
  //     const result = await GetOrgListService(token!);

  //     if (result.data.status === 200) {
  //       setOrgList(result.data.data);
  //       const convertedData = result.data.data.map(
  //         (org: CommonOrgInterface) => ({
  //           value: org.ORGANIZATION_ID.toString(),
  //           label: org.NAME,
  //         })
  //       );
  //       setConvertedOrgList(convertedData);
  //     } else {
  //       showErrorToast(result.data.message);
  //     }
  //   } catch (error) {
  //     showErrorToast("Organization Load Failed");
  //   }
  // };

  const getOrgList = async () => {
    try {
      const result = await OrganizationListService(token!, userId!);

      if (result.data.status === 200) {
        const data = result.data.data;

        // Filter the organization list where IS_ASSOCIATED is 1
        const filteredOrgList = data.filter(
          (org: CommonOrgInterface) => org.IS_ASSOCIATED === 1
        );

        setOrgList(filteredOrgList);

        const convertedData = filteredOrgList.map(
          (org: CommonOrgInterface) => ({
            value: org.ORGANIZATION_ID.toString(),
            label: org.NAME,
          })
        );

        if (!isCreateRfq) {
          const findOrg = convertedData.find(
            (item: any) => item.value === rfqOrgIdInStore?.toString()
          );
          setSelectedOrgId(findOrg.value);
        }

        setConvertedOrgList(convertedData);

        // setOrgList(result.data.data);

        // const convertedData = result.data.data.map(
        //   (org: CommonOrgInterface) => ({
        //     value: org.ORGANIZATION_ID.toString(),
        //     label: org.NAME,
        //   })
        // );
        // setConvertedOrgList(convertedData);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Organization Load Failed");
    }
  };

  //get org list

  const [supplierLineFilePath, setSupplierLineFilePath] = useState("");

  const rfqDetailsService = async () => {
    try {
      setIsLoading2(true);
      const result = await RfqDetailsService(token!, rfqIdInStore!, 0, 100000);

      if (result.data.status === 200) {
        console.log(result.data);
        // setSupplierLineFilePath(result.data.supplier_line_file);
        setSupplierLineFilePath(result.data.buyer_line_file);
        setRfqDetailsInStore(result.data);
        setPrItemList2(result.data.line_items);
        console.log("line item", result.data.line_items);

        setPrItems2(result.data.line_items);
        setIsLoading2(false);
      } else {
        setIsLoading2(false);
      }
    } catch (error) {
      showErrorToast("Rfq Details Load Failed");
      setIsLoading2(false);
    }
  };

  //rfq details

  //rfq details

  //validation
  const [prItemError, setPrItemError] = useState<{ organization?: string }>({});

  const validateSearch = () => {
    const errors: { organization?: string } = {};

    if (!selectedOrgId) {
      errors.organization = "Please Select Organization";
    }

    setPrItemError(errors);

    return Object.keys(errors).length === 0;
  };

  //validation

  //search

  const search = async () => {
    if (validateSearch()) {
      // getprItem(62, parseInt(selectedOrgId), parseInt(prNumber), offset, limit);
      // getprItem(parseInt(selectedOrgId));
      console.log("search clicked");

      getprItem(parseInt(selectedOrgId), offset, limit);
      getAllPritem(parseInt(selectedOrgId), 0, 99999);
    }
  };
  //search

  //api call for pr item

  //now working with four

  const [isAllLoading, setIsAllLoading] = useState<boolean>(false);
  const getAllPritem = async (
    orgId: number | null,
    ofs: number,
    lmt: number
  ) => {
    console.log("get call all pr item");
    console.log(orgId);
    console.log(ofs);
    console.log(lmt);

    try {
      setIsAllLoading(true);
      const result = await prItemListService(
        token!,
        buyerId,
        orgId,
        parseInt(prNumber),
        fromDate,
        toDate,
        requesterName,
        itemName,
        buyerName,

        ofs,
        lmt
      );
      console.log("all pr item result", result.data);

      if (result.data.status === 200) {
        result.data.data.forEach((item: PrItemInterface) => {
          item.BUYER_VAT_APPLICABLE = "N";
          // item.LCM_ENABLE_FLAG = "N";
          item.WARRANTY_ASK_BY_BUYER = "N";
          item.NOTE_TO_SUPPLIER = "";
          // item.BUYER_FILE_NAME = "";
          item.NEED_BY_DATE = moment(item.NEED_BY_DATE).format(
            "DD-MMM-YY HH:mm:ss"
          );
          item.BUYER_FILE = null;
          // item.BASE64_BUYER = "";
          // item.MIMETYPE = "";
          // item.ORIGINAL_FILE_NAME = "";

          // You can set the value here if it's known, otherwise leave it empty
        });
        setAllPrItemList(result.data.data);
        setIsAllLoading(false);
      }
    } catch (error) {
      showErrorToast("All Item Load Failed");
      setIsAllLoading(false);
    }
  };
  let n = 0;

  const getprItem = async (orgId: number | null, ofs: number, lmt: number) => {
    setIsLoading(true);

    try {
      const result = await prItemListService(
        token!,
        buyerName === "" ? buyerId : null,
        orgId,
        parseInt(prNumber),
        fromDate,
        toDate,
        requesterName,
        itemName,
        buyerName,

        ofs,
        lmt
      );
      console.log(buyerId);
      console.log(orgId);
      console.log(fromDate);
      console.log(toDate);

      console.log("pr item result", result.data);
      console.log("ofs", ofs);
      console.log("lmt", lmt);

      if (result.data.status === 200) {
        // const dataCon = result.data.data.forEach((item: PrItemInterface) => {
        //   item.BUYER_VAT_APPLICABLE = "N";
        //   // item.LCM_ENABLE_FLAG = "N";
        //   item.WARRANTY_ASK_BY_BUYER = "N";
        //   item.NOTE_TO_SUPPLIER = "";
        //   // item.BUYER_FILE_NAME = "";
        //   item.NEED_BY_DATE = moment(item.NEED_BY_DATE).format(
        //     "DD-MMM-YY HH:mm:ss"
        //   );
        //   item.BUYER_FILE = null;
        //   item.COUNTER = n;
        //   n++;
        // });
        // console.log(dataCon);
        // console.log(dataCon);

        const dataCon = result.data.data.map(
          (item: PrItemInterface, index: number) => ({
            ...item,
            BUYER_VAT_APPLICABLE: "N",
            WARRANTY_ASK_BY_BUYER: "N",
            NOTE_TO_SUPPLIER: "",
            NEED_BY_DATE: moment(item.NEED_BY_DATE).format(
              "DD-MMM-YY HH:mm:ss"
            ),
            BUYER_FILE: null,
            COUNTER: index,
          })
        );

        console.log(dataCon);

        const dataCon2 = dataCon.filter(
          (item: PrItemInterface) => item.LINE_STATUS !== "C"
        );

        console.log(dataCon2);

        // Set the filtered list.
        setPrItemList(dataCon2);
        // setPrItemList(result.data.data);

        if (isSelectedAll) {
          //SelectedPrItemInterface silo akhn change
          const selectedItems: PrItemInterface[] = result.data.data.map(
            (item: PrItemInterface) => ({
              ATTRIBUTE_CATEGORY: item.ATTRIBUTE_CATEGORY || "",
              AUTHORIZATION_STATUS: item.AUTHORIZATION_STATUS,
              // BUYER_FILE_NAME: item.BUYER_FILE_NAME || null,
              DELIVER_TO_LOCATION_ID: item.DELIVER_TO_LOCATION_ID,
              ITEM_DESCRIPTION: item.ITEM_DESCRIPTION,
              DESTINATION_ORGANIZATION_ID: item.DESTINATION_ORGANIZATION_ID,
              ITEM_CODE: item.ITEM_CODE,
              ITEM_ID: item.ITEM_ID,
              ITEM_SPECIFICATION: item.ITEM_SPECIFICATION,
              LCM_ENABLE_FLAG: item.LCM_ENABLE_FLAG,
              LINE_NUM: item.LINE_NUM,
              NEED_BY_DATE: item.NEED_BY_DATE,
              NOTE_TO_SUPPLIER: item.NOTE_TO_SUPPLIER,
              ORG_ID: item.ORG_ID,
              PACKING_TYPE: item.PACKING_TYPE,
              PROJECT_NAME: item.PROJECT_NAME,
              PR_FROM_DFF: item.PR_FROM_DFF,
              PR_NUMBER: item.PR_NUMBER,
              EXPECTED_QUANTITY: item.EXPECTED_QUANTITY,
              REQUISITION_HEADER_ID: item.REQUISITION_HEADER_ID || 0, // Provide a default value if undefined
              REQUISITION_LINE_ID: item.REQUISITION_LINE_ID || 0, // Provide a default value if undefined
              UNIT_MEAS_LOOKUP_CODE: item.UNIT_MEAS_LOOKUP_CODE,
              UNIT_PRICE: item.UNIT_PRICE,
              WARRANTY_ASK_BY_BUYER: item.WARRANTY_ASK_BY_BUYER || "", // Provide default value
              WARRANTY_DETAILS: item.WARRANTY_DETAILS || "", // Provide default value
              BUYER_VAT_APPLICABLE: item.BUYER_VAT_APPLICABLE || "", // Provide default value or handle optional
              BUYER_FILE_ORG_NAME: item.INVENTORY_ORG_NAME || "", // Provide default value or handle optional
              LINE_TYPE: item.LINE_TYPE,
              LINE_TYPE_ID: item.LINE_TYPE_ID,
            })
          );
          // setSelectedPrItemList(selectedItems);
          setSelectedPrItemList((prevSelectedItems) => [
            ...prevSelectedItems,
            ...selectedItems,
          ]);
        }

        dividePage(result.data.total, limit);
        setIsLoading(false);
      } else {
        showErrorToast(result.data.message);

        setIsLoading(false);
      }
    } catch (error) {
      showErrorToast("Pr Item Load Failed");
      setIsLoading(false);
    }
  };
  //api call for pr item

  //delete

  const [prItemIndex, setPrItemIndex] = useState<number | null>(null);
  const [prItemIndex2, setPrItemIndex2] = useState<number | null>(null);
  // const [indexWisePrNumber,setIndexWisePrNumber]=useState<string | null>(null);

  const deletePrItem = () => {
    const newPrItems = [...prItemList];
    const deletedItem = newPrItems[prItemIndex!];
    console.log(deletedItem);

    const newSelectedItem = [...selectedPrItemList];
    const findFromSelected = newSelectedItem.filter(
      (item) =>
        item.PR_NUMBER !== deletedItem.PR_NUMBER ||
        item.LINE_NUM !== deletedItem.LINE_NUM
    );

    console.log(findFromSelected);

    newPrItems.splice(prItemIndex!, 1);
    setPrItemList(newPrItems);
    setSelectedPrItemList(findFromSelected);
  };
  const deletePrItem2 = () => {
    const newPrItems2 = [...prItemList2];
    const deletedItem2 = newPrItems2[prItemIndex2!];
    console.log(deletedItem2);

    const newSelectedItem2 = [...selectedPrItemList2];
    const findFromSelected2 = newSelectedItem2.filter(
      (item) =>
        item.PR_NUMBER !== deletedItem2.PR_NUMBER ||
        item.LINE_NUM !== deletedItem2.LINE_NUM
    );

    console.log(findFromSelected2);

    newPrItems2.splice(prItemIndex!, 1);
    setPrItemList2(newPrItems2);
    setSelectedPrItemList2(findFromSelected2);
  };

  const getPrItemInfo = (index: number) => {
    setPrItemIndex(index);
  };
  const getPrItemInfo2 = (index: number) => {
    setPrItemIndex(index);
  };

  //delete

  //pagination

  const next = async () => {
    let newOff;

    newOff = offset + limit;
    console.log(newOff);
    setOffSet(newOff);

    setPageNo((pre) => pre + 1);
    console.log(limit);
    // getHistory("", "", newOff, limit);
    // getprItem(
    //   parseInt(buyerName),
    //   parseInt(selectedOrgId),
    //   parseInt(prNumber),
    //   newOff,
    //   limit
    // );
    getprItem(parseInt(selectedOrgId), newOff, limit);
  };

  const searchNext = () => {
    const newOff = offset + limit;
    setOffSet(newOff);
    setPageNo((pre) => pre + 1);
    // getHistory(searchStartDate, searchEndDate, newOff, limit);
  };

  const previous = async () => {
    let newOff = offset - limit;
    console.log(newOff);
    if (newOff < 0) {
      newOff = 0;
      console.log(newOff);
    }

    setOffSet(newOff);
    setPageNo((pre) => pre - 1);
    console.log(limit);
    getprItem(parseInt(selectedOrgId), newOff, limit);

    // getHistory("", "", newOff, limit);
    // getprItem(
    //   parseInt(buyerName),
    //   parseInt(selectedOrgId),
    //   parseInt(prNumber),
    //   newOff,
    //   limit
    // );
    getprItem(parseInt(selectedOrgId), newOff, limit);
  };

  const searchPrevious = () => {
    let newOff = offset - limit;
    if (newOff < 0) {
      newOff = 0;
      console.log(newOff);
    }
    setOffSet(newOff);
    setPageNo((pre) => pre - 1);
    // getHistory(searchStartDate, searchEndDate, newOff, limit);
  };

  const dividePage = (number: number, lmt: number) => {
    console.log(number);
    if (typeof number !== "number") {
      throw new Error("Input must be a number");
    }
    setTotalprItemNumberInStore(number);

    const re = Math.ceil(number / lmt);
    console.log(number);
    console.log(re);
    setTotal(re);
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);

    const newLimit = parseInt(event.target.value, 10);
    console.log(newLimit);

    setLimit(newLimit);
    getprItem(parseInt(selectedOrgId), offset, newLimit);
    // getprItem(parseInt(buyerName), null, null, offset, newLimit);
    // getHistory(
    //   isSearch ? searchStartDate : "",
    //   isSearch ? searchEndDate : "",
    //   offset,
    //   newLimit
    // );
  };

  //pagination

  //set data
  useEffect(() => {
    setData();
  }, [prItemList, prItemList2]);

  //note to supplier
  const noteToSupplierRefs = useRef<HTMLInputElement[]>([]);
  const noteToSupplierRefs2 = useRef<HTMLInputElement[]>([]);
  const [noteToSupplierList, setNoteToSupplierList] = useState<string[] | []>(
    []
  );
  const [noteToSupplierList2, setNoteToSupplierList2] = useState<string[] | []>(
    []
  );

  //time format

  function convertToDhakaTime(timestamp: string): string {
    const isoDateRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).*$/;
    const [, year, month, day, hours, minutes, seconds] =
      timestamp.match(isoDateRegex)!;

    // Adjust UTC date to Dhaka timezone (UTC+6)
    const dhakaOffsetMinutes = 6 * 60;
    const utcDate = new Date(
      Date.UTC(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes),
        parseInt(seconds)
      )
    );
    const dhakaDate = new Date(utcDate.getTime() + dhakaOffsetMinutes * 60000);

    // Format date and time
    const formattedDate = `${dhakaDate.getUTCDate()}-${getMonthName(
      dhakaDate.getUTCMonth() + 1
    )}-${String(dhakaDate.getUTCFullYear()).slice(2)}`;
    const formattedTime = `${padZero(dhakaDate.getUTCHours())}:${padZero(
      dhakaDate.getUTCMinutes()
    )}:${padZero(dhakaDate.getUTCSeconds())}`;

    return `${formattedDate} ${formattedTime}`;
  }

  function getMonthName(month: number): string {
    const monthNames = [
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
    return monthNames[month - 1];
  }

  function padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  //time format

  //note to supplier

  const setData = () => {
    if (prItemList) {
      //note to supplier
      const newNote = prItemList.map((item) => item.NOTE_TO_SUPPLIER);
      setNoteToSupplierList(newNote);

      if (noteToSupplierRefs.current) {
        noteToSupplierRefs.current = newNote.map((spec, index) => {
          return (
            noteToSupplierRefs.current[index] ||
            React.createRef<HTMLInputElement>()
          );
        });
      }
      //note to supplier

      const newSpecificationList = prItemList.map(
        (item) => item.ITEM_SPECIFICATION
      );

      setSpecificationList(newSpecificationList);

      if (specificationRefs.current) {
        specificationRefs.current = newSpecificationList.map((spec, index) => {
          return (
            specificationRefs.current[index] ||
            React.createRef<HTMLInputElement>()
          );
        });
      }

      //need by date
      const dateArray = prItemList.map((item) => ({
        startDate: new Date(item.NEED_BY_DATE),
        endDate: new Date(item.NEED_BY_DATE),
      }));
      setNeedByDatesArray(dateArray);
      //need by date

      const vatApplicableValues = prItemList.map(
        (item) => item.BUYER_VAT_APPLICABLE || ""
      ); // Use default value if BUYER_VAT_APPLICABLE is undefined
      setvatApplicableFromBuyer(vatApplicableValues);
    }
    if (prItemList2) {
      //note to supplier
      const newNote2 = prItemList2.map((item) => item.NOTE_TO_SUPPLIER);
      setNoteToSupplierList2(newNote2);

      if (noteToSupplierRefs.current) {
        noteToSupplierRefs2.current = newNote2.map((spec, index) => {
          return (
            noteToSupplierRefs2.current[index] ||
            React.createRef<HTMLInputElement>()
          );
        });
      }
      //note to supplier

      const newSpecificationList2 = prItemList2.map(
        (item) => item.ITEM_SPECIFICATION
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

      //need by date
      const dateArray2 = prItemList2.map((item) => ({
        startDate: new Date(item.NEED_BY_DATE),
        endDate: new Date(item.NEED_BY_DATE),
      }));
      setNeedByDatesArray2(dateArray2);
      //need by date

      const vatApplicableValues2 = prItemList2.map(
        (item) => item.BUYER_VAT_APPLICABLE || ""
      ); // Use default value if BUYER_VAT_APPLICABLE is undefined
      setvatApplicableFromBuyer2(vatApplicableValues2);
    }
  };

  //set data

  // approve date range
  const [approveDates, setApproveDates] = useState({
    startDate: null,
    endDate: null, // Set the endDate to the end of the current year
  });

  const [toDate, setToDate] = useState("");
  const [fromDate, setFromDate] = useState("");

  const handleApproveDateChange = (newValue: any) => {
    console.log("newValue:", newValue);
    setApproveDates(newValue);

    setFromDate(newValue.startDate);
    setToDate(newValue.endDate);
    console.log(newValue.startDate);
    console.log(newValue.endDate);
  };

  // approve date range

  // SPECIFICATION

  const handleSpecificationChange = (value: string, index: number) => {
    const newSpecification = [...specificationList];
    newSpecification[index] = value;
    const newPrItem = [...prItemList];
    newPrItem[index].ITEM_SPECIFICATION = value;
    console.log(newPrItem[index].ITEM_SPECIFICATION);

    setSpecificationList(newSpecification);
    setPrItemList(newPrItem);
  };

  const handleSpecificationChange2 = (value: string, index: number) => {
    const newSpecification2 = [...specificationList2];
    newSpecification2[index] = value;
    const newPrItem2 = [...prItemList2];
    newPrItem2[index].ITEM_SPECIFICATION = value;
    console.log(newPrItem2[index].ITEM_SPECIFICATION);

    setSpecificationList2(newSpecification2);
    setPrItemList2(newPrItem2);
  };
  // SPECIFICATION

  //vat applicable

  const handleBuyerVat = (index: number) => {
    const newPrItemList = [...prItemList];
    newPrItemList[index].BUYER_VAT_APPLICABLE =
      newPrItemList[index].BUYER_VAT_APPLICABLE === "N" ? "Y" : "N";
    setPrItemList(newPrItemList);
  };
  const handleBuyerVat2 = (index: number) => {
    const newPrItemList2 = [...prItemList2];
    newPrItemList2[index].BUYER_VAT_APPLICABLE =
      newPrItemList2[index].BUYER_VAT_APPLICABLE === "N" ? "Y" : "N";
    setPrItemList2(newPrItemList2);
  };
  //vat applicable
  //warrenty applicable

  const handleWarrentyApplicable = (index: number) => {
    const newPrItemList = [...prItemList];
    newPrItemList[index].WARRANTY_ASK_BY_BUYER =
      newPrItemList[index].WARRANTY_ASK_BY_BUYER === "N" ? "Y" : "N";
    setPrItemList(newPrItemList);
  };
  const handleWarrentyApplicable2 = (index: number) => {
    const newPrItemList2 = [...prItemList2];
    newPrItemList2[index].WARRANTY_ASK_BY_BUYER =
      newPrItemList2[index].WARRANTY_ASK_BY_BUYER === "N" ? "Y" : "N";
    setPrItemList2(newPrItemList2);
  };
  //vat warrenty

  //lcm
  const handleLcmEnable = (index: number) => {
    const newPrItemList = [...prItemList];
    newPrItemList[index].LCM_ENABLE_FLAG =
      newPrItemList[index].LCM_ENABLE_FLAG === "N" ? "Y" : "N";
    setPrItemList(newPrItemList);
  };
  const handleLcmEnable2 = (index: number) => {
    const newPritemList2 = [...prItemList2];
    newPritemList2[index].LCM_ENABLE_FLAG =
      newPritemList2[index].LCM_ENABLE_FLAG === "N" ? "Y" : "N";
    setPrItemList2(newPritemList2);
  };

  //lcm

  // Function to handle file selection for a specific row
  const handleAttachmentFile = (file: File | null, rowIndex: number) => {
    const newPrItemList = [...prItemList];
    newPrItemList[rowIndex].BUYER_FILE = file;
    setPrItemList(newPrItemList);

    if (file) {
      // Handle the selected file here
      console.log(`Selected file for row ${rowIndex}:`, file);
    } else {
      // No file selected for this row
      console.log(`No file selected for row ${rowIndex}`);
    }
  };
  const handleAttachmentFile2 = (file: File | null, rowIndex: number) => {
    const newPrItemList2 = [...prItemList2];
    newPrItemList2[rowIndex].BUYER_FILE = file;
    setPrItemList2(newPrItemList2);

    if (file) {
      // Handle the selected file here
      console.log(`Selected file for row ${rowIndex}:`, file);
    } else {
      // No file selected for this row
      console.log(`No file selected for row ${rowIndex}`);
    }
  };
  //attchment

  //attachment
  // const handlAttachmentSelect = (file: File, index: number) => {
  //   // Extract file name and MIME type from the picked file
  //   const fileName = file.name;
  //   const mimeType = file.type;

  //   // Extract file extension from MIME type
  //   let fileExtension = "";
  //   if (mimeType) {
  //     const mimeTypeParts = mimeType.split("/");
  //     if (mimeTypeParts.length === 2) {
  //       fileExtension = mimeTypeParts[1];
  //       console.log(fileExtension);
  //     }
  //   }

  //   const reader = new FileReader();

  //   reader.onloadend = () => {
  //     // Convert the picked file to base64 string
  //     const base64String = reader.result as string; // Explicitly cast to string
  //     console.log(base64String);

  //     // Update the data array with the base64 string
  //     const newData = [...prItemList];
  //     newData[index].FILE = base64String;
  //     newData[index].ORIGINAL_FILE_NAME = fileName; // Set the filename
  //     newData[index].MIMETYPE = fileExtension; // Set the file extension as MIME type
  //     setPrItemList(newData);
  //   };

  //   if (file) {
  //     reader.readAsDataURL(file);
  //   }
  // };

  //attachment

  //validation

  // const [prItemError, setPrItemError] = useState<{ needByDate?: string }>({});

  // const validate = () => {
  //   const errors: { needByDate?: string } = {};

  //   for (let i = 0; i < selectedPrItemList.length; i++) {
  //     if (
  //       selectedPrItemList[i].NEED_BY_DATE == null ||
  //       selectedPrItemList[i].NEED_BY_DATE === undefined
  //     ) {
  //       errors.needByDate = "Enter Need By Date";
  //     }
  //   }

  //   setPrItemError(errors);

  //   return Object.keys(errors).length === 0;
  // };

  const [prItemErrors, setPrItemErrors] = useState<
    Array<{ needByDate?: string }>
  >(new Array(selectedPrItemList.length).fill({}));
  const [validateButtonPressed, setValidateButtonPressed] = useState(false);

  const validate = () => {
    const errorsArray: Array<{ needByDate?: string }> = new Array(
      selectedPrItemList.length
    ).fill({});
    for (let i = 0; i < selectedPrItemList.length; i++) {
      if (selectedPrItemList[i].NEED_BY_DATE === "Invalid date") {
        errorsArray[i].needByDate = "Enter Need By Date";
      }
    }
    console.log(errorsArray); // Check the content of errorsArray
    setPrItemErrors(errorsArray);
    return errorsArray.every((errors) => Object.keys(errors).length === 0);
  };
  // const validate = () => {

  //   // const errorsArray = new Array(prItemList.length).fill({});
  //   // for (let i = 0; i < prItemList.length; i++) {
  //   //   const needByDate = needByDatesArray[i].startDate; // Accessing startDate from dateArray
  //   //   if (!needByDate) {
  //   //     errorsArray[i].needByDate = "Enter Need By Date";
  //   //   }
  //   // }
  //   // setPrItemErrors(errorsArray);
  //   // return errorsArray.every((errors) => Object.keys(errors).length === 0);
  // };

  //validation

  //need by date
  const [needByDatesArray, setNeedByDatesArray] = useState(
    initialNeedByDatesArray
  );
  const [needByDatesArray2, setNeedByDatesArray2] = useState(
    initialNeedByDatesArray
  );

  // Function to handle date change for a specific row
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNeedByDateChange = (newValue: any, rowIndex: number) => {
    const updatedNeedByDatesArray = [...needByDatesArray];
    updatedNeedByDatesArray[rowIndex] = newValue;
    const newPrItem = [...prItemList];
    newPrItem[rowIndex].NEED_BY_DATE = moment(newValue.startDate).format(
      "DD-MMM-YY HH:mm:ss"
    );
    console.log(moment(newValue.startDate).format("DD-MMM-YY HH:mm:ss"));

    setNeedByDatesArray(updatedNeedByDatesArray);
    setPrItemList(newPrItem);
  };
  const handleNeedByDateChange2 = (newValue: any, rowIndex: number) => {
    const updatedNeedByDatesArray2 = [...needByDatesArray2];
    updatedNeedByDatesArray2[rowIndex] = newValue;
    const newPrItem2 = [...prItemList2];
    newPrItem2[rowIndex].NEED_BY_DATE = moment(newValue.startDate).format(
      "DD-MMM-YY HH:mm:ss"
    );
    console.log(moment(newValue.startDate).format("DD-MMM-YY HH:mm:ss"));

    setNeedByDatesArray2(updatedNeedByDatesArray2);
    setPrItemList2(newPrItem2);
  };
  //need by date

  //attchment

  // Initialize an array to hold selected files for each row
  const [selectedFiles, setSelectedFiles] = useState<(File | null)[]>(
    Array(limit).fill(null)
  );

  // // Function to handle file selection for a specific row
  // const handleAttachmentFile = (file: File | null, rowIndex: number) => {
  //   const updatedSelectedFiles = [...selectedFiles];
  //   updatedSelectedFiles[rowIndex] = file;
  //   setSelectedFiles(updatedSelectedFiles);

  //   if (file) {
  //     // Handle the selected file here
  //     console.log(`Selected file for row ${rowIndex}:`, file);
  //   } else {
  //     // No file selected for this row
  //     console.log(`No file selected for row ${rowIndex}`);
  //   }
  // };
  // //attchment

  const handleItemNameChange = (value: string) => {
    setItemName(value);
  };
  const handleRequesterNameChange = (value: string) => {
    setRequesterName(value);
  };
  const handleBuyerNameChange = (value: string) => {
    setBuyerName(value);
  };
  const handlePrNumberChange = (value: string) => {
    setPrNumber(value);
  };

  const handleNoteToSupplierChange = (value: string, index: number) => {
    const newNotes = [...noteToSupplierList];
    newNotes[index] = value;
    setNoteToSupplierList(newNotes);
    const newPrItem = [...prItemList];
    newPrItem[index].NOTE_TO_SUPPLIER = value;
    setPrItemList(newPrItem);
  };
  const handleNoteToSupplierChange2 = (value: string, index: number) => {
    const newNotes2 = [...noteToSupplierList2];
    newNotes2[index] = value;
    setNoteToSupplierList2(newNotes2);
    const newPrItem2 = [...prItemList2];
    newPrItem2[index].NOTE_TO_SUPPLIER = value;
    setPrItemList2(newPrItem2);
  };

  // export to excel
  const download = async () => {};

  //context
  const { page, setPage } = useRfqCreateProcessContext();
  const submitAndNext = () => {
    if (isCreateRfq) {
      setValidateButtonPressed(true);
      // Check if there are any invalid dates
      console.log(isCreateRfq);

      console.log(selectedPrItemList.length);
      console.log(selectedPrItemList);

      if (selectedPrItemList.length !== 0) {
        const hasInvalidDates = selectedPrItemList.some(
          (item) => item.NEED_BY_DATE === "Invalid date"
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

          // setPrItems(selectedPrItemList);
          // setPrItems2(selectedPrItemList2);
          setPage(2);
        } else {
          showErrorToast("Select Need By Date Please");
        }
      } else if (selectedPrItemList.length === 0) {
        showErrorToast("Select Items Please");
      }
    } else {
      console.log(selectedPrItemList);

      setSavedPritemLength(prItemList2.length);
      // setPrItems2(selectedPrItemList2);
      // setPrItems(selectedPrItemList);
      // setPrItems2(selectedPrItemList2);
      setPage(2);
    }
  };

  // const previousPage = () => {
  //     setPage(1);
  // }

  //current stock

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
  //current stock

  //select/unselect

  const selectAll = () => {
    setIsSelectAll(true);
    //SelectedPrItemInterface silo ankhn change korsi
    // const selectedItems: PrItemInterface[] = prItemList.map((item) => ({
    //   ATTRIBUTE_CATEGORY: item.ATTRIBUTE_CATEGORY || "",
    //   AUTHORIZATION_STATUS: item.AUTHORIZATION_STATUS,
    //   // BUYER_FILE_NAME: item.BUYER_FILE_NAME || "",
    //   // BUYER_FILE_NAME:
    //   //   typeof item.BUYER_FILE_NAME === "string" ? item.BUYER_FILE_NAME : "",
    //   DELIVER_TO_LOCATION_ID: item.DELIVER_TO_LOCATION_ID,
    //   ITEM_DESCRIPTION: item.ITEM_DESCRIPTION,
    //   DESTINATION_ORGANIZATION_ID: item.DESTINATION_ORGANIZATION_ID,
    //   ITEM_CODE: item.ITEM_CODE,
    //   ITEM_ID: item.ITEM_ID,
    //   ITEM_SPECIFICATION: item.ITEM_SPECIFICATION,
    //   LCM_ENABLE_FLAG: item.LCM_ENABLE_FLAG,
    //   LINE_NUM: item.LINE_NUM,
    //   NEED_BY_DATE: item.NEED_BY_DATE,
    //   NOTE_TO_SUPPLIER: item.NOTE_TO_SUPPLIER,
    //   ORG_ID: item.ORG_ID,
    //   PACKING_TYPE: item.PACKING_TYPE,
    //   PROJECT_NAME: item.PROJECT_NAME,
    //   PR_FROM_DFF: item.PR_FROM_DFF,
    //   PR_NUMBER: item.PR_NUMBER,
    //   EXPECTED_QUANTITY: item.EXPECTED_QUANTITY,
    //   REQUISITION_HEADER_ID: item.REQUISITION_HEADER_ID || 0, // Provide a default value if undefined
    //   REQUISITION_LINE_ID: item.REQUISITION_LINE_ID || 0, // Provide a default value if undefined
    //   UNIT_MEAS_LOOKUP_CODE: item.UNIT_MEAS_LOOKUP_CODE,
    //   UNIT_PRICE: item.UNIT_PRICE,
    //   WARRANTY_ASK_BY_BUYER: item.WARRANTY_ASK_BY_BUYER || "", // Provide default value
    //   WARRANTY_DETAILS: item.WARRANTY_DETAILS || "", // Provide default value
    //   BUYER_VAT_APPLICABLE: item.BUYER_VAT_APPLICABLE || "", // Provide default value or handle optional
    //   BUYER_FILE_ORG_NAME: item.INVENTORY_ORG_NAME || "", // Provide default value or handle optional
    //   BUYER_FILE: item.BUYER_FILE, // Default value for missing property
    //   // MIMETYPE: "", // Default value for missing property
    //   // ORIGINAL_FILE_NAME: "", // Default value for missing property

    // }));
    // setSelectedPrItemList(selectedItems);
    setSelectedPrItemList(prItemList);
    setPrItems(prItemList);
  };
  const selectAll2 = () => {
    setIsSelectAll2(true);
    // const selectedItems2: SelectedPrItemInterface[] = prItemList.map(
    //   (item) => ({
    //     ATTRIBUTE_CATEGORY: item.ATTRIBUTE_CATEGORY || "",
    //     AUTHORIZATION_STATUS: item.AUTHORIZATION_STATUS,
    //     // BUYER_FILE_NAME: item.BUYER_FILE_NAME || "",
    //     // BUYER_FILE_NAME:
    //     //   typeof item.BUYER_FILE_NAME === "string" ? item.BUYER_FILE_NAME : "",
    //     DELIVER_TO_LOCATION_ID: item.DELIVER_TO_LOCATION_ID,
    //     ITEM_DESCRIPTION: item.ITEM_DESCRIPTION,
    //     DESTINATION_ORGANIZATION_ID: item.DESTINATION_ORGANIZATION_ID,
    //     ITEM_CODE: item.ITEM_CODE,
    //     ITEM_ID: item.ITEM_ID,
    //     ITEM_SPECIFICATION: item.ITEM_SPECIFICATION,
    //     LCM_ENABLE_FLAG: item.LCM_ENABLE_FLAG,
    //     LINE_NUM: item.LINE_NUM,
    //     NEED_BY_DATE: item.NEED_BY_DATE,
    //     NOTE_TO_SUPPLIER: item.NOTE_TO_SUPPLIER,
    //     ORG_ID: item.ORG_ID,
    //     PACKING_TYPE: item.PACKING_TYPE,
    //     PROJECT_NAME: item.PROJECT_NAME,
    //     PR_FROM_DFF: item.PR_FROM_DFF,
    //     PR_NUMBER: item.PR_NUMBER,
    //     EXPECTED_QUANTITY: item.EXPECTED_QUANTITY,
    //     REQUISITION_HEADER_ID: item.REQUISITION_HEADER_ID || 0, // Provide a default value if undefined
    //     REQUISITION_LINE_ID: item.REQUISITION_LINE_ID || 0, // Provide a default value if undefined
    //     UNIT_MEAS_LOOKUP_CODE: item.UNIT_MEAS_LOOKUP_CODE,
    //     UNIT_PRICE: item.UNIT_PRICE,
    //     WARRANTY_ASK_BY_BUYER: item.WARRANTY_ASK_BY_BUYER || "", // Provide default value
    //     WARRANTY_DETAILS: item.WARRANTY_DETAILS || "", // Provide default value
    //     BUYER_VAT_APPLICABLE: item.BUYER_VAT_APPLICABLE || "", // Provide default value or handle optional
    //     BUYER_FILE_ORG_NAME: item.INVENTORY_ORG_NAME || "", // Provide default value or handle optional
    //     BUYER_FILE: item.BUYER_FILE, // Default value for missing property
    //     // MIMETYPE: "", // Default value for missing property
    //     // ORIGINAL_FILE_NAME: "", // Default value for missing property
    //   })
    // );
    setSelectedPrItemList2(prItemList2);
  };

  const unselectAll = () => {
    setIsSelectAll(false);
    setSelectedPrItemList([]);
    setPrItems([]);
  };
  const unselectAll2 = () => {
    setIsSelectAll2(false);
    setSelectedPrItemList2([]);
  };

  // const toggleprItemSelection = (employee: PrItemInterface) => {
  //   setSelectedPrItemList((prevSelectedList) => {
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

  // const toggleprItemSelection = (employee: PrItemInterface) => {
  //   setSelectedPrItemList((prevSelectedList) => {
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
  //         employee as unknown as SelectedPrItemInterface,
  //       ];
  //       // Ensure employee is casted to SelectedPrItemInterface
  //     }
  //   });
  // };

  // const toggleprItemSelection = (employee: PrItemInterface) => {
  //   setSelectedPrItemList((prevSelectedList) => {
  //     const isEmployeeSelected = prevSelectedList.some(
  //       (emp) => emp.COUNTER === employee.COUNTER
  //     );

  //     if (isEmployeeSelected) {
  //       // If the employee is already selected, remove it
  //       return prevSelectedList.filter(
  //         (emp) => emp.COUNTER !== employee.COUNTER
  //       );
  //     } else {
  //       // If the employee is not selected, add it
  //       return [
  //         ...prevSelectedList,
  //         employee as PrItemInterface, // Assuming SelectedPrItemInterface is compatible with PrItemInterface
  //       ];
  //     }
  //   });
  //   setPrItems(selectedPrItemList);
  // };

  const toggleprItemSelection = (employee: PrItemInterface) => {
    setSelectedPrItemList((prevSelectedList) => {
      const isEmployeeSelected = prevSelectedList.some(
        (emp) => emp.COUNTER === employee.COUNTER
      );

      let updatedList: PrItemInterface[];
      if (isEmployeeSelected) {
        // If the employee is already selected, remove it
        updatedList = prevSelectedList.filter(
          (emp) => emp.COUNTER !== employee.COUNTER
        );
      } else {
        // If the employee is not selected, add it
        updatedList = [...prevSelectedList, employee];
      }

      // Update `prItems` with the updated selected list
      setPrItems(updatedList);
      return updatedList;
    });
  };

  // const toggleprItemSelection2 = (employee: PrItemInterface) => {
  //   setSelectedPrItemList2((prevSelectedList2) => {
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
  //         employee as unknown as SelectedPrItemInterface,
  //       ];
  //       // Ensure employee is casted to SelectedPrItemInterface
  //     }
  //   });
  // };

  const toggleprItemSelection2 = (employee: PrItemInterface) => {
    setSelectedPrItemList2((prevSelectedList2) => {
      const isEmployeeSelected2 = prevSelectedList2.some(
        (emp) => emp.COUNTER === employee.COUNTER
      );

      if (isEmployeeSelected2) {
        // If the employee is already selected, remove it
        return prevSelectedList2.filter(
          (emp) => emp.COUNTER !== employee.COUNTER
        ) as PrItemInterface[]; // Ensure the return type is PrItemInterface[]
      } else {
        // If the employee is not selected, add it
        return [
          ...prevSelectedList2,
          employee, // No need to cast if PrItemInterface is compatible with SelectedPrItemInterface
        ];
      }
    });
  };

  //select/unselect

  //store
  const {
    setPrItems,
    setTotalprItemNumberInStore,
    isCreateRfq,
    setIsCreateRfq,
    setRfqStatusInStore,
    rfqHeaderDetailsInStore,
    rfqIdInStore,
    setRfqDetailsInStore,
    rfqDetailsInStore,
    setPrItems2,
    prItems,
    prItems2,
    rfqStatusInStore,
    setOrgIdInStore,
    savedPrItemLength,
    setSavedPritemLength,
    setOrgNameInStore,
    csIdInPrItemsStore,
    setCsIdInPrItemsStore,
    rfqOrgIdInStore,

    setRfqOrgIdInStore,
  } = usePrItemsStore();
  //store

  useEffect(() => {
    console.log("rfqId: ", rfqIdInStore);
    console.log("rfqId: ", isCreateRfq);
  }, []);

  //warning modal

  const [isWarningShow, setIsWarningShow] = useState(false);
  const openWarningModal = () => {
    setIsWarningShow(true);
  };
  const closeWarningModal = () => {
    setIsWarningShow(false);
    setPrItemIndex(null);
  };
  const [isWarningShow2, setIsWarningShow2] = useState(false);
  const openWarningModal2 = () => {
    setIsWarningShow2(true);
  };
  const closeWarningModal2 = () => {
    setIsWarningShow2(false);
    setPrItemIndex2(null);
    setRfqLineId(null);
  };

  //warning modal

  //rfq line item delete
  const [rfqLineId, setRfqLineId] = useState<number | null>(null);
  const deleteRfqLineItem = async () => {
    try {
      const result = await DeleteLineItemService(token!, rfqLineId!);
      if (result.data.status === 200) {
        // getprItem(62, null, null, offset, limit);
        showSuccessToast(result.data.message);
        getOrgList();
        rfqDetailsService();
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Delete Failed");
    }
  };
  //rfq line item delete

  //current stock

  //current stock
  const back = () => {
    setRfqStatusInStore("");
    setCsIdInPrItemsStore(null);

    setIsCreateRfq(false);
    setRfqOrgIdInStore(null);
    setPage(1);
  };

  //static pagination

  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(prItemList2.length / itemsPerPage);
  const currentPage = Math.ceil((startIndex + 1) / itemsPerPage);

  const handleNext = () => {
    if (startIndex + itemsPerPage < prItemList2.length) {
      setStartIndex(startIndex + itemsPerPage);
    }
  };

  const handlePrevious = () => {
    if (startIndex - itemsPerPage >= 0) {
      setStartIndex(startIndex - itemsPerPage);
    }
  };
  //static pagination

  //export to excel

  let fileName = moment(Date()).format("DD/MM/YYYY");

  const headers = [
    { label: "PREPARER_ID", key: "PREPARER_ID" },
    { label: "PR_NUMBER", key: "PR_NUMBER" },
    { label: "REQUISITION_HEADER_ID", key: "REQUISITION_HEADER_ID" },
    { label: "REQUISITION_LINE_ID", key: "REQUISITION_LINE_ID" },
    { label: "CREATION_DATE", key: "CREATION_DATE" },
    { label: "ITEM_DESCRIPTION", key: "ITEM_DESCRIPTION" },
    { label: "CREATED_BY", key: "CREATED_BY" },
    { label: "AUTHORIZATION_STATUS", key: "AUTHORIZATION_STATUS" },
    { label: "APPROVED_DATE", key: "APPROVED_DATE" },
    { label: "PR_FROM_DFF", key: "PR_FROM_DFF" },
    { label: "LINE_NUM", key: "LINE_NUM" },
    { label: "CATEGORY_ID", key: "CATEGORY_ID" },
    { label: "ITEM_ID", key: "ITEM_ID" },
    { label: "ITEM_CODE", key: "ITEM_CODE" },
    { label: "UNIT_MEAS_LOOKUP_CODE", key: "UNIT_MEAS_LOOKUP_CODE" },
    { label: "UNIT_PRICE", key: "UNIT_PRICE" },
    { label: "EXPECTED_QUANTITY", key: "EXPECTED_QUANTITY" },
    { label: "NEED_BY_DATE", key: "NEED_BY_DATE" },
    { label: "DELIVER_TO_LOCATION_ID", key: "DELIVER_TO_LOCATION_ID" },
    {
      label: "DESTINATION_ORGANIZATION_ID",
      key: "DESTINATION_ORGANIZATION_ID",
    },
    { label: "ATTRIBUTE_CATEGORY", key: "ATTRIBUTE_CATEGORY" },
    { label: "BRAND", key: "BRAND" },
    { label: "ORIGIN", key: "ORIGIN" },
    { label: "ITEM_SPECIFICATION", key: "ITEM_SPECIFICATION" },
    { label: "WARRANTY_DETAILS", key: "WARRANTY_DETAILS" },
    { label: "PACKING_TYPE", key: "PACKING_TYPE" },
    { label: "ATTRIBUTE6", key: "ATTRIBUTE6" },
    { label: "PROJECT_NAME", key: "PROJECT_NAME" },
    { label: "ORG_ID", key: "ORG_ID" },
    { label: "INVENTORY_ORG_NAME", key: "INVENTORY_ORG_NAME" },
    { label: "CLOSED_CODE", key: "CLOSED_CODE" },
    { label: "DELIVER_TO_LOCATION_NAME", key: "DELIVER_TO_LOCATION_NAME" },
    { label: "LINE_TYPE", key: "LINE_TYPE" },
    { label: "LINE_TYPE_ID", key: "LINE_TYPE_ID" },
  ];

  //export to excel

  //code from ridoy

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

  const [imageUrls3, setImageUrls3] = useState<ImageUrls>({});

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
    if (prItemList2) {
      const fetchImages = async () => {
        const newImageUrls: ImageUrls = {};
        for (let index = 0; index < prItemList2.length; index++) {
          const element = prItemList2[index];
          const url = await getImage3(
            supplierLineFilePath,
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
  }, [prItemList2, supplierLineFilePath]);

  const getRfqList = async () => {
    // setIsLoading(true);

    console.log("userId: ", userId);
    console.log("supId, ", rfqIdInStore);

    try {
      const result = await RfiSupplierListService(
        token!,
        userId,
        null,
        null,
        rfqIdInStore
      );
      console.log(result.data);

      if (result.data.status === 200) {
        console.log(result.data.data);
        setPropicPath(result.data.PROFILE_PIC);

        // setSUpplierList(result.data.data);
        // setIsLoading(false);

        const filteredData = result.data.data.filter(
          (item: RfiSupplierInterface) =>
            item.OBJECT_TYPE === "VAT" || item.OBJECT_TYPE === "RFQ"
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

  //code from ridoy

  function hasInvalidDate(selectedPrItemList: any[], e: any): boolean {
    for (const emp of selectedPrItemList) {
      if (
        emp.REQUISITION_LINE_ID === e.REQUISITION_LINE_ID &&
        emp.NEED_BY_DATE === "Invalid date"
      ) {
        return true; // Invalid date found, return true
      }
    }
    return false; // No invalid date found
  }

  const sortData = () => {
    const sortedData = prItemList.slice().sort((a, b) => {
      if (sortBy !== null) {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return aValue.localeCompare(bValue);
        } else if (typeof aValue === "number" && typeof bValue === "number") {
          return aValue - bValue;
        }
      }
      return 0;
    });

    return sortOrder === "asc" ? sortedData : sortedData.reverse();
  };

  const handleSort = (field: keyof PrItemInterface) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  //permission store
  const { isByerNameSearchPermission, setIsByerNameSearchPermission } =
    usePermissionStore();

  const handleTogglePermission = () => {
    setIsByerNameSearchPermission(!isByerNameSearchPermission); // Toggle the permission
  };
  //permission store

  //title component
  interface TitleTextProps {
    text: string;
  }

  const TitleText: React.FC<TitleTextProps> = ({ text }) => {
    return <p className=" font-mon text-[12px] font-semibold">{text}</p>;
  };
  //title component

  return (
    <div className="mx-8 my-2">
      <SuccessToast />
      {/* <p>
        Buyer Name Search Permission:{" "}
        {isByerNameSearchPermission ? "Allowed" : "Not Allowed"}
      </p>
      <button onClick={handleTogglePermission}>
        Toggle Buyer Name Search Permission
      </button> */}
      <WarningModal
        isOpen={isWarningShow}
        closeModal={closeWarningModal}
        action={deletePrItem}
        message="Do you want to remove ?"
        imgSrc="/images/warning.png"
      />
      <WarningModal
        isOpen={isWarningShow2}
        closeModal={closeWarningModal2}
        action={deleteRfqLineItem}
        message="Do You Want To Delete"
        imgSrc="/images/warning.png"
      />

      {
        <>
          <div className=" w-full flex items-center justify-between">
            <div className=" flex flex-col items-start">
              <PageTitle titleText="PR Item List" />
              {/* <NavigationPan list={pan} /> */}
            </div>
          </div>
          <div className="h-6"></div>
          {rfqStatusInStore === "SUBMIT" ? null : (
            <div className=" w-full p-4 bg-offWhiteColor rounded-md border-[0.2px] border-borderColor flex flex-row justify-between">
              <div className=" flex flex-col items-start space-y-1">
                <TitleText text="Organization Name" />
                <DropDown
                  disable={isCreateRfq ? false : true}
                  options={convertedOrgList}
                  onSelect={handleSelect}
                  width="w-52"
                  height="h-8"
                  sval={selectedOrgId}
                />
                {prItemError.organization && (
                  <ValidationError title={prItemError.organization} />
                )}
                <div className=" h-1"></div>

                <TitleText text="Item Name" />
                <CommonInputField
                  inputRef={itemNameRef}
                  onChangeData={handleItemNameChange}
                  type="text"
                  hint="search"
                  width="w-52"
                  height="h-8"
                />
              </div>
              {/* first row */}
              <div className=" flex flex-col items-start space-y-1 z-30">
                <TitleText text="PR Approve Date" />
                <DateRangePicker
                  placeholder="Date From - To"
                  value={approveDates}
                  width="w-52"
                  height="h-8"
                  onChange={handleApproveDateChange}
                />
                <div className=" h-1"></div>

                <TitleText text="Requester Name" />
                <CommonInputField
                  inputRef={requesterNameRef}
                  onChangeData={handleRequesterNameChange}
                  type="text"
                  hint="search"
                  width="w-52"
                  height="h-8"
                />
              </div>

              {/* second row */}
              <div className=" flex flex-col items-start space-y-1">
                <TitleText text="PR Number" />
                <CommonInputField
                  onChangeData={handlePrNumberChange}
                  width="w-52"
                  height="h-8"
                  type="number"
                  hint="search"
                  inputRef={prNumberRef}
                />
                <div className=" h-1"></div>
                {isByerNameSearchPermission ? (
                  <div>
                    <TitleText text="Buyer Name" />
                    <CommonInputField
                      inputRef={buyerNameRef}
                      onChangeData={handleBuyerNameChange}
                      type="text"
                      hint="search"
                      width="w-52"
                      height="h-8"
                    />
                  </div>
                ) : null}
                <div className=" h-4"></div>
                <CommonButton
                  onClick={search}
                  width="w-52"
                  height="h-8"
                  titleText={"Search"}
                  color="bg-midBlue"
                />
              </div>
              {/* third row */}
            </div>
          )}
          <div className="h-4"></div>
          <div className=" w-full flex flex-row  justify-between  items-start">
            {/* <div className="flex-1 p-4 bg-offWhiteColor rounded-md border-[0.2px] border-borderColor flex flex-row space-x-2 items-center ">
              <p className=" text-sm font-mon font-medium text-graishColor">
                PR ID:
              </p>
              <p className=" text-sm font-mon font-medium text-blackColor">
                REF987655467
              </p>
            </div> */}
            <div></div>
            {/* <div className=" flex space-x-6 items-center">
              
            </div> */}
          </div>
          <div className="h-2"></div>
          {
            <>
              {isLoading2 ? (
                <div className="w-full h-screen flex justify-center items-center">
                  <LogoLoading />
                </div>
              ) : (
                <>
                  {isCreateRfq ? null : (
                    <>
                      {prItemList2.length === 0 ? null : (
                        <h1 className=" my-4 text-midBlack font-mon font-semibold">
                          Saved Line Items
                        </h1>
                      )}

                      {prItemList2.length === 0 ? null : (
                        <div className="overflow-auto max-h-[400px] rounded-lg shadow-lg custom-scrollbar">
                          <table className="min-w-full divide-y divide-gray-200 rounded-lg">
                            <thead className="bg-[#CAF4FF] sticky top-0 z-20 ">
                              <tr>
                                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                                  {/* <button
                                    disabled={
                                      rfqStatusInStore === "SUBMIT"
                                        ? true
                                        : false
                                    }
                                    onClick={() => {
                                      isSelectedAll2
                                        ? unselectAll2()
                                        : selectAll2();
                                    }}
                                    className={`${
                                      isSelectedAll2
                                        ? "bg-midGreen "
                                        : "bg-whiteColor border-[1px] border-borderColor"
                                    } rounded-[4px] w-4 h-4 flex justify-center items-center`}
                                  >
                                    <img
                                      src="/images/check.png"
                                      alt="check"
                                      className=" w-2 h-2"
                                    />
                                  </button> */}
                                </th>
                                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                                  SL
                                </th>
                                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                                  PR No/Line No
                                </th>
                                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                                  Requester Name
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
                                  VAT
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
                                  PR Creation Date
                                </th>
                                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                                  PR Approved Date
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
                                  Note To Supplier
                                </th>
                                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon"></th>
                              </tr>
                            </thead>

                            {prItemList2.map((e, index) => (
                              <tbody
                                key={e.ITEM_ID}
                                className={`${
                                  e.LINE_STATUS === "C"
                                    ? "opacity-50 pointer-events-none"
                                    : ""
                                } bg-white divide-y divide-gray-200 `}
                              >
                                <tr>
                                  {/* <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      <button
                                        disabled={
                                          rfqStatusInStore === "SUBMIT"
                                            ? true
                                            : false
                                        }
                                        onClick={() => {
                                          toggleprItemSelection2(e);
                                        }}
                                        className={`${
                                          selectedPrItemList2.some(
                                            (emp) => emp.COUNTER === e.COUNTER
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
                                  </td> */}
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar "></td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar ">
                                    <div className="w-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                                      {pageNo === 1
                                        ? pageNo + index
                                        : offset + 1 + index}
                                    </div>
                                  </td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      {e.PR_NUMBER}/{e.LINE_NUM}
                                    </div>
                                  </td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-72 overflow-auto custom-scrollbar text-center">
                                      {!e.REQUESTOR_NAME
                                        ? "N/A"
                                        : e.REQUESTOR_NAME}
                                    </div>
                                  </td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-72 overflow-auto custom-scrollbar text-center">
                                      {!e.DESCRIPTION ? "N/A" : e.DESCRIPTION}
                                    </div>
                                  </td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      <CommonInputField
                                        type="text"
                                        width="w-44"
                                        hint="Specification"
                                        maxCharacterlength={150}
                                        onChangeData={(value) =>
                                          handleSpecificationChange2(
                                            value,
                                            index
                                          )
                                        }
                                        inputRef={{
                                          current:
                                            specificationRefs2.current[index],
                                        }}
                                        value={specificationList2[index]}
                                      />
                                    </div>
                                  </td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      {e.EXPECTED_BRAND_NAME
                                        ? "N/A"
                                        : e.EXPECTED_BRAND_NAME}
                                    </div>
                                  </td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      {/* {e.EXPECTED_BRAND_NAME === "" ? "N/A" : e.EXPECTED_BRAND_NAME} */}
                                      {e.EXPECTED_ORIGIN === ""
                                        ? "N/A"
                                        : e.EXPECTED_ORIGIN}
                                    </div>
                                  </td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      <button
                                        disabled={true}
                                        className={` h-4 w-4  rounded-md ${
                                          e.LCM_ENABLE_FLAG === "Y"
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
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      <button
                                        onClick={() => {
                                          handleBuyerVat2(index);
                                        }}
                                        className={` h-4 w-4  rounded-md ${
                                          e.BUYER_VAT_APPLICABLE === "Y"
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
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      <div className=" flex flex-row space-x-2 items-center">
                                        <button
                                          onClick={() => {
                                            handleWarrentyApplicable2(index);
                                          }}
                                          className={`h-4 w-4  rounded-md ${
                                            e.WARRANTY_ASK_BY_BUYER === "Y"
                                              ? "bg-midGreen border-none"
                                              : "border-[0.1px] border-borderColor bg-white"
                                          } flex justify-center items-center`}
                                        >
                                          <img
                                            src="/images/check.png"
                                            alt="check"
                                            className=" w-2 h-2"
                                          />
                                        </button>
                                        <p className=" font-mon">Applicable</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      {e.UNIT_MEAS_LOOKUP_CODE === ""
                                        ? "N/A"
                                        : e.UNIT_MEAS_LOOKUP_CODE}
                                    </div>
                                  </td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      {e.EXPECTED_QUANTITY}
                                    </div>
                                  </td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      {moment(e.CREATION_DATE).format(
                                        "DD-MMMM-YYYY"
                                      )}
                                    </div>
                                  </td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      {moment(e.APPROVED_DATE).format(
                                        "DD-MMMM-YYYY"
                                      )}
                                    </div>
                                  </td>
                                  <td className=" z-10 px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full  text-center">
                                      <DateRangePicker
                                        signle={true}
                                        useRange={false}
                                        placeholder="Date"
                                        width="w-36"
                                        value={needByDatesArray2[index]} // Pass the dates from the state
                                        onChange={(newValue) =>
                                          handleNeedByDateChange2(
                                            newValue,
                                            index
                                          )
                                        } // Update the state on change
                                      />

                                      {selectedPrItemList2.map((emp) =>
                                        emp.REQUISITION_LINE_ID ===
                                          e.REQUISITION_LINE_ID &&
                                        emp.NEED_BY_DATE === "Invalid date" ? (
                                          <ValidationError
                                            key={emp.REQUISITION_LINE_ID}
                                            title="Select Date"
                                          />
                                        ) : null
                                      )}

                                      {/* {validateButtonPressed &&
                                  prItemList[index].NEED_BY_DATE ===
                                    "Invalid date" && (
                                    <ValidationError title="Enter Need by Date" />
                                  )} */}
                                      {/* {prItemErrors[index]?.needByDate && (
                                  <ValidationError
                                    title={
                                      prItemErrors[index]?.needByDate ?? ""
                                    }
                                  />
                                )} */}
                                    </div>
                                  </td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      {!e.INVENTORY_ORG_NAME
                                        ? "N/A"
                                        : e.INVENTORY_ORG_NAME}
                                    </div>
                                  </td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      <button
                                        onClick={() => {
                                          openCurrentStockModal(
                                            e.DESTINATION_ORGANIZATION_ID,
                                            e.ITEM_ID
                                          );
                                        }}
                                        className="bg-midBlack font-mon text-white text-xs font-medium rounded-md py-2 px-4 "
                                      >
                                        View
                                      </button>
                                    </div>
                                  </td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      <div className=" w-full flex  space-x-2 items-center">
                                        <FilePickerInput
                                          fontSize="text-sm"
                                          width="w-full"
                                          onFileSelect={(
                                            newFile: File | null
                                          ) =>
                                            handleAttachmentFile2(
                                              newFile!,
                                              index
                                            )
                                          }
                                          initialFileName={
                                            e.BUYER_FILE_ORG_NAME ?? ""
                                          }
                                          maxSize={2 * 1024 * 1024}
                                          mimeType=".pdf, image/*"
                                        />
                                        {e.BUYER_FILE_ORG_NAME ? (
                                          <a
                                            // href={`${supplierLineFilePath}/${e.BUYER_FILE_NAME}`}
                                            href={`${imageUrls3[e.ITEM_ID]}`}
                                            target="_blank"
                                            className=" border-[1px] border-dashed border-borderColor px-2 py-2 rounded-md"
                                          >
                                            view
                                          </a>
                                        ) : null}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      <CommonInputField
                                        type="text"
                                        width="w-44"
                                        hint="note"
                                        maxCharacterlength={150}
                                        onChangeData={(value) =>
                                          handleNoteToSupplierChange2(
                                            value,
                                            index
                                          )
                                        }
                                        inputRef={{
                                          current:
                                            noteToSupplierRefs2.current[index],
                                        }}
                                        value={noteToSupplierList2[index]}
                                      />
                                    </div>
                                  </td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      <button
                                        onClick={() => {
                                          if (csIdInPrItemsStore) {
                                            showErrorToast(
                                              "CS is Created, Please Delete From CS"
                                            );
                                          } else {
                                            getPrItemInfo2(index);
                                            openWarningModal2();
                                            // deleteRfqLineItem(e.RFQ_LINE_ID);
                                            setRfqLineId(e.RFQ_LINE_ID);
                                          }
                                        }}
                                        className=" text-xs text-redColor bg-red-200 h-6 px-2 rounded-md tracking-wide "
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            ))}

                            <tfoot className="bg-white sticky bottom-0">
                              <tr>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>

                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      )}

                      {
                        prItemList2.length === 0 ? (
                          <div className=" w-full flex justify-center items-center">
                            <h1 className=" my-4 text-midBlack font-mon font-semibold">
                              No Saved Item Found
                            </h1>
                          </div>
                        ) : null
                        // <div className=" w-full flex justify-center items-center my-2">
                        //   <div className=" flex space-x-4 items-center">
                        //     <p className=" smallText">Row Per Page: 5 |</p>
                        //     <div className=" smallText">
                        //       {currentPage} of {totalPages}
                        //     </div>
                        //     <button
                        //       onClick={handlePrevious}
                        //       disabled={startIndex === 0}
                        //       className=" smallText"
                        //     >
                        //       {<ArrowLeftIcon />}
                        //     </button>
                        //     <button
                        //       className=" smallText"
                        //       onClick={handleNext}
                        //       disabled={
                        //         startIndex + itemsPerPage >= prItemList2.length
                        //       }
                        //     >
                        //       {<ArrowRightIcon />}
                        //     </button>
                        //     <ul>
                        //       {prItemList2
                        //         .slice(startIndex, startIndex + itemsPerPage)
                        //         .map((item, index) => (
                        //           <li key={index}>
                        //             {/* Render item properties here */}
                        //           </li>
                        //         ))}
                        //     </ul>
                        //   </div>
                        // </div>
                      }
                    </>
                  )}
                  <div className=" h-4"></div>
                  {
                    // rfqStatusInStore === "SUBMIT" ? null :

                    isLoading ? (
                      <div className="w-full h-full flex justify-center items-center">
                        <LogoLoading />
                      </div>
                    ) : !isLoading && prItemList.length === 0 ? (
                      <div className=" w-full flex justify-center items-center">
                        {/* <p className=" largeText">No Data Found</p> */}
                      </div>
                    ) : (
                      <div>
                        <h1 className=" w-full flex justify-between items-center  mb-4 text-midBlack font-mon font-semibold">
                          <p>New Line Items</p>
                          <div className=" flex space-x-2 items-center">
                            {selectedPrItemList.length === 0 ? null : (
                              <CSVLink
                                data={selectedPrItemList!}
                                headers={headers}
                                filename={`pr_item_list_${fileName}.csv`}
                              >
                                <div className=" exportToExcel ">
                                  On Selection Export
                                </div>
                              </CSVLink>
                            )}
                            {allPrItemList.length === 0 ? null : (
                              <CSVLink
                                data={allPrItemList!}
                                headers={headers}
                                filename={`All_pr_item_list_${fileName}.csv`}
                              >
                                <div className=" exportToExcel ">
                                  All Export to Excel
                                </div>
                              </CSVLink>
                            )}
                          </div>
                        </h1>
                        <div className="  overflow-auto max-h-[400px] rounded-lg shadow-lg custom-scrollbar">
                          <table className="min-w-full divide-y divide-gray-200 rounded-lg">
                            <thead className="bg-[#CAF4FF] sticky top-0 z-20 ">
                              <tr>
                                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                                  <button
                                    onClick={() => {
                                      isSelectedAll
                                        ? unselectAll()
                                        : selectAll();
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
                                  Sl
                                </th>
                                <th
                                  onClick={() => handleSort("PR_NUMBER")}
                                  className=" cursor-pointer px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon"
                                >
                                  <div className=" flex space-x-2 items-center">
                                    <p> PR Number/Line</p>
                                    {sortBy === "PR_NUMBER" && (
                                      <div>
                                        {sortOrder === "asc" ? (
                                          <ArrowDownIcon />
                                        ) : (
                                          <ArrowUpIcon />
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </th>
                                <th
                                  onClick={() => handleSort("USER_NAME")}
                                  className=" cursor-pointer px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon"
                                >
                                  <div className=" flex space-x-2 items-center justify-center">
                                    <p> Requester Name</p>
                                    {sortBy === "REQUESTOR_NAME" && (
                                      <div>
                                        {sortOrder === "asc" ? (
                                          <ArrowDownIcon />
                                        ) : (
                                          <ArrowUpIcon />
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </th>
                                <th
                                  onClick={() => handleSort("ITEM_DESCRIPTION")}
                                  className="cursor-pointer px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon"
                                >
                                  <div className=" flex space-x-2 items-center justify-center">
                                    <p> Item Description</p>
                                    {sortBy === "ITEM_DESCRIPTION" && (
                                      <div>
                                        {sortOrder === "asc" ? (
                                          <ArrowDownIcon />
                                        ) : (
                                          <ArrowUpIcon />
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </th>
                                <th
                                  onClick={() =>
                                    handleSort("ITEM_SPECIFICATION")
                                  }
                                  className=" cursor-pointer px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon"
                                >
                                  <div className=" flex space-x-2 items-center">
                                    <p> Specification</p>
                                    {sortBy === "ITEM_SPECIFICATION" && (
                                      <div>
                                        {sortOrder === "asc" ? (
                                          <ArrowDownIcon />
                                        ) : (
                                          <ArrowUpIcon />
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </th>
                                <th
                                  onClick={() => handleSort("BRAND")}
                                  className=" cursor-pointer px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon"
                                >
                                  <div className=" flex space-x-2 items-center">
                                    <p> Expected Brand Name</p>
                                    {sortBy === "BRAND" && (
                                      <div>
                                        {sortOrder === "asc" ? (
                                          <ArrowDownIcon />
                                        ) : (
                                          <ArrowUpIcon />
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </th>
                                <th
                                  onClick={() => handleSort("ORIGIN")}
                                  className=" cursor-pointer px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon"
                                >
                                  <div className=" flex space-x-2 items-center">
                                    <p> Expected Brand Origin</p>
                                    {sortBy === "ORIGIN" && (
                                      <div>
                                        {sortOrder === "asc" ? (
                                          <ArrowDownIcon />
                                        ) : (
                                          <ArrowUpIcon />
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </th>
                                <th
                                  onClick={() => handleSort("LCM_ENABLE_FLAG")}
                                  className=" cursor-pointer px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon"
                                >
                                  <div className=" flex space-x-2 items-center">
                                    <p> LCM Enabled</p>
                                    {sortBy === "LCM_ENABLE_FLAG" && (
                                      <div>
                                        {sortOrder === "asc" ? (
                                          <ArrowDownIcon />
                                        ) : (
                                          <ArrowUpIcon />
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </th>
                                <th
                                  // onClick={() => handleSort("LCM_ENABLE_FLAG")}

                                  className="  px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon"
                                >
                                  <div className=" flex space-x-2 items-center">
                                    VAT
                                    {/* <div className=" flex space-x-2 items-center">
                                  <p>Vat</p>
                                  {sortBy === "LCM_ENABLE_FLAG" && (
                                    <div>
                                      {sortOrder === "asc" ? (
                                        <ArrowDownIcon />
                                      ) : (
                                        <ArrowUpIcon />
                                      )}
                                    </div>
                                  )}
                                </div> */}
                                  </div>
                                </th>

                                <th className="  px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                                  Warranty
                                </th>
                                <th
                                  onClick={() =>
                                    handleSort("UNIT_MEAS_LOOKUP_CODE")
                                  }
                                  className=" cursor-pointer px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon"
                                >
                                  <div className=" flex space-x-2 items-center">
                                    <p>UOM</p>
                                    {sortBy === "UNIT_MEAS_LOOKUP_CODE" && (
                                      <div>
                                        {sortOrder === "asc" ? (
                                          <ArrowDownIcon />
                                        ) : (
                                          <ArrowUpIcon />
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </th>
                                <th
                                  onClick={() =>
                                    handleSort("EXPECTED_QUANTITY")
                                  }
                                  className=" cursor-pointer px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon"
                                >
                                  <div className=" flex space-x-2 items-center">
                                    <p>Expected Quantity</p>
                                    {sortBy === "EXPECTED_QUANTITY" && (
                                      <div>
                                        {sortOrder === "asc" ? (
                                          <ArrowDownIcon />
                                        ) : (
                                          <ArrowUpIcon />
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </th>

                                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                                  Unit Price
                                </th>
                                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                                  Total
                                </th>

                                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                                  PR Creation Date
                                </th>
                                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                                  PR Approved Date
                                </th>

                                <th
                                  onClick={() => handleSort("NEED_BY_DATE")}
                                  className=" cursor-pointer px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon"
                                >
                                  <div className=" flex space-x-2 items-center">
                                    <p>Need By Date</p>
                                    {sortBy === "NEED_BY_DATE" && (
                                      <div>
                                        {sortOrder === "asc" ? (
                                          <ArrowDownIcon />
                                        ) : (
                                          <ArrowUpIcon />
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </th>
                                <th
                                  onClick={() =>
                                    handleSort("INVENTORY_ORG_NAME")
                                  }
                                  className=" cursor-pointer px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon"
                                >
                                  <div className=" flex space-x-2 items-center">
                                    <p> Inventory Org Name</p>
                                    {sortBy === "INVENTORY_ORG_NAME" && (
                                      <div>
                                        {sortOrder === "asc" ? (
                                          <ArrowDownIcon />
                                        ) : (
                                          <ArrowUpIcon />
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </th>
                                <th className=" px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                                  Current Stock
                                </th>
                                <th className="  px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                                  Attachment
                                </th>
                                <th
                                  onClick={() => handleSort("NOTE_TO_SUPPLIER")}
                                  className=" cursor-pointer px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon"
                                >
                                  <div className=" flex space-x-2 items-center">
                                    <p>Note To Supplier</p>
                                    {sortBy === "NOTE_TO_SUPPLIER" && (
                                      <div>
                                        {sortOrder === "asc" ? (
                                          <ArrowDownIcon />
                                        ) : (
                                          <ArrowUpIcon />
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </th>
                                <th className="  px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon"></th>
                              </tr>
                            </thead>

                            {sortData().map((e, index) => (
                              <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      <button
                                        onClick={() => {
                                          toggleprItemSelection(e);
                                        }}
                                        className={`${
                                          selectedPrItemList.some(
                                            (emp) => emp.COUNTER === e.COUNTER
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
                                      {pageNo === 1
                                        ? pageNo + index
                                        : offset + 1 + index}
                                    </div>
                                  </td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      <p>
                                        {e.PR_NUMBER}/{e.LINE_NUM}
                                      </p>
                                    </div>
                                  </td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-72 overflow-auto custom-scrollbar text-center">
                                      <p>{e.REQUESTOR_NAME}</p>
                                    </div>
                                  </td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      <p>
                                        {e.ITEM_DESCRIPTION === ""
                                          ? "N/A"
                                          : e.ITEM_DESCRIPTION}
                                      </p>
                                    </div>
                                  </td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center  ">
                                      <CommonInputField
                                        type="text"
                                        width="w-44"
                                        hint="Specification"
                                        maxCharacterlength={150}
                                        onChangeData={(value) =>
                                          handleSpecificationChange(
                                            value,
                                            index
                                          )
                                        }
                                        inputRef={{
                                          current:
                                            specificationRefs.current[index],
                                        }}
                                        value={specificationList[index]}
                                      />
                                    </div>
                                  </td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      {e.BRAND === "" ? "N/A" : e.BRAND}
                                    </div>
                                  </td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      {/* {e.EXPECTED_BRAND_NAME === "" ? "N/A" : e.EXPECTED_BRAND_NAME} */}
                                      {e.ORIGIN === "" ? "N/A" : e.ORIGIN}
                                    </div>
                                  </td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      <div className=" flex flex-row space-x-2 items-center">
                                        <button
                                          disabled={true}
                                          onClick={() => {
                                            // handleLcmEnable(index);
                                          }}
                                          className={` h-4 w-4  rounded-md ${
                                            e.LCM_ENABLE_FLAG === "Y"
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
                                    </div>
                                  </td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      <div className=" flex flex-row space-x-2 items-center">
                                        <button
                                          onClick={() => {
                                            handleBuyerVat(index);
                                          }}
                                          className={` h-4 w-4  rounded-md ${
                                            e.BUYER_VAT_APPLICABLE === "Y"
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
                                    </div>
                                  </td>

                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      <div className=" flex flex-row space-x-2 items-center">
                                        <button
                                          onClick={() => {
                                            handleWarrentyApplicable(index);
                                          }}
                                          className={`h-4 w-4  rounded-md ${
                                            e.WARRANTY_ASK_BY_BUYER === "Y"
                                              ? "bg-midGreen border-none"
                                              : "border-[0.1px] border-borderColor bg-white"
                                          } flex justify-center items-center`}
                                        >
                                          <img
                                            src="/images/check.png"
                                            alt="check"
                                            className=" w-2 h-2"
                                          />
                                        </button>
                                        <p>Applicable</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      {e.UNIT_MEAS_LOOKUP_CODE === ""
                                        ? "N/A"
                                        : e.UNIT_MEAS_LOOKUP_CODE}
                                    </div>
                                  </td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      {e.EXPECTED_QUANTITY}
                                    </div>
                                  </td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      {e.UNIT_PRICE}
                                    </div>
                                  </td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      {e.UNIT_PRICE * e.EXPECTED_QUANTITY}
                                    </div>
                                  </td>

                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      {moment(e.PR_CREATION_DATE).format(
                                        "DD-MMMM-YYYY"
                                      )}
                                    </div>
                                  </td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      {moment(e.APPROVED_DATE).format(
                                        "DD-MMMM-YYYY"
                                      )}
                                    </div>
                                  </td>
                                  <td className=" z-10 px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full  text-center">
                                      <DateRangePicker
                                        signle={true}
                                        useRange={false}
                                        placeholder="Date"
                                        width="w-36"
                                        value={needByDatesArray[index]} // Pass the dates from the state
                                        onChange={(newValue) =>
                                          handleNeedByDateChange(
                                            newValue,
                                            index
                                          )
                                        } // Update the state on change
                                      />

                                      {/* {selectedPrItemList.map((emp) =>
                                      emp.REQUISITION_LINE_ID ===
                                        e.REQUISITION_LINE_ID &&
                                      emp.NEED_BY_DATE === "Invalid date" ? (
                                        <ValidationError
                                          key={emp.REQUISITION_LINE_ID}
                                          title="Select Date"
                                        />
                                      ) : null
                                    )} */}
                                      {hasInvalidDate(
                                        selectedPrItemList,
                                        e.REQUISITION_LINE_ID
                                      ) ? (
                                        <ValidationError
                                          title={
                                            prItemErrors[index]?.needByDate ??
                                            ""
                                          }
                                        />
                                      ) : null}

                                      {/* {validateButtonPressed &&
                                  prItemList[index].NEED_BY_DATE ===
                                    "Invalid date" && (
                                    <ValidationError title="Enter Need by Date" />
                                  )} */}
                                      {/* {prItemErrors[index]?.needByDate && (
                                  <ValidationError
                                    title={
                                      prItemErrors[index]?.needByDate ?? ""
                                    }
                                  />
                                )} */}
                                    </div>
                                  </td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      {!e.INVENTORY_ORG_NAME
                                        ? "N/A"
                                        : e.INVENTORY_ORG_NAME}
                                    </div>
                                  </td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      <button
                                        onClick={() => {
                                          openCurrentStockModal(
                                            e.DESTINATION_ORGANIZATION_ID,
                                            e.ITEM_ID
                                          );
                                        }}
                                        className="bg-midBlack font-mon text-white text-xs font-medium rounded-md py-2 px-4 "
                                      >
                                        View
                                      </button>
                                    </div>
                                  </td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      <FilePickerInput
                                        fontSize="text-sm"
                                        width="w-full"
                                        onFileSelect={(newFile: File | null) =>
                                          handleAttachmentFile(newFile!, index)
                                        }
                                        maxSize={2 * 1024 * 1024}
                                        mimeType=".pdf, image/*"
                                      />
                                    </div>
                                  </td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      <CommonInputField
                                        type="text"
                                        width="w-44"
                                        hint="note"
                                        maxCharacterlength={150}
                                        onChangeData={(value) =>
                                          handleNoteToSupplierChange(
                                            value,
                                            index
                                          )
                                        }
                                        inputRef={{
                                          current:
                                            noteToSupplierRefs.current[index],
                                        }}
                                        value={noteToSupplierList[index]}
                                      />
                                    </div>
                                  </td>
                                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                                    <div className="w-full overflow-auto custom-scrollbar text-center">
                                      <button
                                        onClick={() => {
                                          getPrItemInfo(index);
                                          openWarningModal();
                                        }}
                                        className=" text-xs text-redColor bg-red-200 h-6 px-2 rounded-md tracking-wide "
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            ))}

                            <tfoot className="bg-white sticky bottom-0">
                              <tr>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
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
                      </div>
                    )
                  }
                  <div className=" h-2"></div>
                  {prItemList.length === 0 ? null : (
                    <>
                      <div className=" h-4"></div>
                      {rfqStatusInStore === "SUBMIT" ? null : (
                        <div className=" w-full flex justify-center items-center my-2">
                          <div className=" flex space-x-2">
                            <p className=" smallText">Rows per page: </p>
                            <select
                              value={limit}
                              onChange={handleLimitChange}
                              className="  w-10"
                            >
                              <option value="10">10</option>
                              <option value="20">20</option>
                              <option value="30">30</option>
                              <option value="40">40</option>
                              <option value="50">50</option>
                            </select>
                            <div>
                              {pageNo} of {total}
                            </div>

                            <button
                              disabled={pageNo === 1 ? true : false}
                              onClick={isSearch ? searchPrevious : previous}
                              className=" w-5 h-5 mt-1"
                            >
                              <ArrowLeftIcon className=" w-full h-full" />
                            </button>

                            <button
                              disabled={pageNo === total ? true : false}
                              onClick={isSearch ? searchNext : next}
                              className=" w-5 h-5 mt-1"
                            >
                              <ArrowRightIcon className=" w-full h-full" />
                            </button>
                          </div>
                        </div>
                      )}
                      {/* <div>rfi</div> */}
                    </>
                  )}
                  <div className=" h-2"></div>

                  {isCreateRfq ? null : (
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
                                    <p>Query:</p>
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
                  )}

                  {/* <div className=" h-12"></div> */}
                  {/* <div className=" flex flex-row justify-end space-x-6 items-center">
                   
                    <CommonButton
                      onClick={submitAndNext}
                      titleText={"Continue"}
                      height="h-8"
                      width="w-36"
                      color="bg-midGreen"
                    />
                  </div>

                  <div className=" h-20"></div>
                  <button
                    onClick={() => {
                      console.log(selectedPrItemList2.length);
                    }}
                  >
                    Click
                  </button> */}
                  {/* <div className=" h-20"></div> */}
                </>
              )}
            </>
          }

          {
            // prItemList2.length !== 0 ? null : !isLoading &&
            //   prItemList.length === 0 ? (
            //   <div className=" w-full h-32  flex justify-center items-center">
            //     <p className="largeText">No Data Found</p>

            //   </div>
            // ) :

            <>
              <></>
            </>
          }
          <>
            <div className=" h-12"></div>

            <div className=" flex flex-row justify-end space-x-6 items-center">
              <CommonButton
                titleText="Previous"
                onClick={back}
                color="bg-graishColor"
                width="w-36"
              />
              {allPrItemList.length === 0 && prItemList2.length === 0 ? null : (
                <CommonButton
                  onClick={submitAndNext}
                  titleText={"Continue"}
                  width="w-36"
                  color="bg-midGreen"
                />
              )}
            </div>

            {/* <div className=" h-20"></div>
                  <button
                    onClick={() => {
                      console.log(selectedPrItemList[9].NEED_BY_DATE);
                    }}
                  >
                    Click
                  </button> */}
            <div className=" h-20"></div>
          </>
        </>
      }
      {/* current stock modal */}
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box modal-middle w-72 max-w-none">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          {/* <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click on ✕ button to close</p> */}

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
                    {/* <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  ">
                      Organization Code
                    </th> */}
                    {/* <th className=" font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                      Inventory Id
                    </th> */}
                    <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                      Current Onhand
                    </th>
                    {/* <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                      Primary UOM Code
                    </th>
                    <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                      Organization Name
                    </th>
                    <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                      Description
                    </th> */}
                    {/* Add more header columns as needed */}
                  </tr>
                </thead>

                {/* Table rows go here */}
                {/* Table rows go here */}
                {/* {list.slice(0, limit).map((e, i) => ( */}
                <tbody className="cursor-pointer bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]">
                  {currentStock.map((e, index) => {
                    return (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                      >
                        {/* <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor font-medium">
                          {!e.ORGANIZATION_CODE ? "N/A" : e.ORGANIZATION_CODE}
                        </td> */}
                        {/* <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {e.INVENTORY_ITEM_ID}
                        </td> */}
                        <td className=" font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {e.ON_HAND}
                        </td>
                        {/* <td className=" font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {e.PRIMARY_UOM_CODE === ""
                            ? "N/A"
                            : e.PRIMARY_UOM_CODE}
                        </td>
                        <td className=" font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {e.ORGANIZATION_NAME === ""
                            ? "N/A"
                            : e.ORGANIZATION_NAME}
                        </td>
                        <td className=" font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {e.ITEM_DESCRIPTION === ""
                            ? "N/A"
                            : e.ITEM_DESCRIPTION}
                        </td> */}
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
      {/* current stock modal */}
    </div>
  );
}
