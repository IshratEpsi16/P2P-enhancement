import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../login_both/context/AuthContext";
import { useRfiManageSupplierContext } from "../context/RfiManageSupplierContext";
import usePrItemsStore from "../../buyer_section/pr/store/prItemStore";
import CommonButton from "../../common_component/CommonButton";
import PrItemInterface from "../../buyer_section/pr_item_list/interface/PrItemInterface";
import SelectedPrItemInterface from "../../buyer_section/pr_item_list/interface/selectedPritemInterface";
import CommonInputField from "../../common_component/CommonInputField";
import DateRangePicker from "../../common_component/DateRangePicker";
import ValidationError from "../../Alerts_Component/ValidationError";
import { Button, Modal, Textarea } from "keep-react";
import FilePickerInput from "../../common_component/FilePickerInput";
import moment from "moment";
import { CloudArrowUp } from "phosphor-react";
import CurrentStockInterface from "../../buyer_section/pr_item_list/interface/CurrentStockInterface";
import CurrentStockService from "../../buyer_section/pr_item_list/service/CurrentStockService";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import CommonOrgInterface from "../../common_interface/CommonOrgInterface";
import GetOrgListService from "../../common_service/GetOrgListService";
import RfqDetailsService from "../../buyer_rfq_create/service/RfqDetailsService";
import prItemListService from "../../buyer_section/pr_item_list/service/PrItemListService";
import { useRfqCreateProcessContext } from "../../buyer_rfq_create/context/RfqCreateContext";
import LogoLoading from "../../Loading_component/LogoLoading";
import { showSuccessToast } from "../../Alerts_Component/SuccessToast";
import RfiAddUpdateService from "../../manage_supplier_profile_update/service/rfi/RfiAddUpdateService";
import UserCircleIcon from "../../icons/userCircleIcon";
import RfiSupplierInterface from "../interface/RfiSupplierInterface";
import RfiSupplierListService from "../service/RfiSupplierListService";
import isoToDateTime from "../../utils/methods/isoToDateTime";
import useProfileUpdateStore from "../../manage_supplier_profile_update/store/profileUpdateStore";
import useRfiStore from "../store/RfiStore";
import fetchFileUrlService from "../../common_service/fetchFileUrlService";

const list = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];

const initialNeedByDatesArray = list.map(() => ({
  startDate: new Date(),
  endDate: new Date(),
}));
const initialNeedByDatesArray2 = list.map(() => ({
  startDate: new Date(),
  endDate: new Date(),
}));

export default function RfiDetailsForRfqPage() {
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
  const [prItemList, setPrItemList] = useState<PrItemInterface[] | []>([]);
  const [prItemList2, setPrItemList2] = useState<PrItemInterface[] | []>([]);
  const [selectedPrItemList, setSelectedPrItemList] = useState<
    SelectedPrItemInterface[] | []
  >([]);
  const [selectedPrItemList2, setSelectedPrItemList2] = useState<
    SelectedPrItemInterface[] | []
  >([]);
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

  const { setRfiManageSupplierPageNo, setRfiId, rfiId } =
    useRfiManageSupplierContext();

  const [supplierList, setSUpplierList] = useState<RfiSupplierInterface[] | []>(
    []
  );

  const [propicPath, setPropicPath] = useState<string>("");

  // const [specification, setSpecification] = useState<string[]>(Array().fill(''));

  //useAuth
  const { token, userId } = useAuth();
  //useAuth

  useEffect(() => {
    //todo: aikhne user id pathate hbe
    getprItem(62, null, null, offset, limit);
    getOrgList();
  }, []);

  useEffect(() => {
    getRfqList();

    console.log("rifId: ", rfiId);
  }, []);

  useEffect(() => {
    if (!isCreateRfq) {
      rfqDetailsService();
    }
  }, []);

  //subtract list for elimenting duplicity

  useEffect(() => {
    if (prItemList.length > 0 && prItemList2.length > 0) {
      subtractLists();
    }
  }, [prItemList, prItemList2]);

  const subtractLists = () => {
    // Filter out items from prItemList that are not in prItemList2
    const updatedList = prItemList.filter(
      (item1) =>
        !prItemList2.some((item2) => item1.RFQ_LINE_ID === item2.RFQ_LINE_ID)
    );
    setPrItemList(updatedList);
  };

  //subtract list

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
  };

  const getOrgList = async () => {
    try {
      const result = await GetOrgListService(token!);

      if (result.data.status === 200) {
        setOrgList(result.data.data);
        const convertedData = result.data.data.map(
          (org: CommonOrgInterface) => ({
            value: org.ORGANIZATION_ID.toString(),
            label: org.NAME,
          })
        );
        setConvertedOrgList(convertedData);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Organization Load Failed");
    }
  };

  //get org list

  const rfqDetailsService = async () => {
    try {
      const result = await RfqDetailsService(token!, rfqIdInStore!, 0, 100000);

      if (result.data.status === 200) {
        setRfqDetailsInStore(result.data);
        setPrItemList2(result.data.line_items);
        if (rfqDetailsInStore != null) {
          const selectedItems1: SelectedPrItemInterface[] =
            result.data.line_items.map((item: PrItemInterface) => ({
              RFQ_ID: item.RFQ_ID,
              ATTRIBUTE_CATEGORY: item.ATTRIBUTE_CATEGORY || "",
              AUTHORIZATION_STATUS: item.AUTHORIZATION_STATUS,
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
              REQUISITION_HEADER_ID: item.REQUISITION_HEADER_ID || 0,
              REQUISITION_LINE_ID: item.REQUISITION_LINE_ID || 0,
              UNIT_MEAS_LOOKUP_CODE: item.UNIT_MEAS_LOOKUP_CODE,
              UNIT_PRICE: item.UNIT_PRICE,
              WARRANTY_ASK_BY_BUYER: item.WARRANTY_ASK_BY_BUYER || "",
              WARRANTY_DETAILS: item.WARRANTY_DETAILS || "",
              BUYER_VAT_APPLICABLE: item.BUYER_VAT_APPLICABLE || "",
              BUYER_FILE_ORG_NAME: item.INVENTORY_ORG_NAME || "",
              BUYER_FILE: null, // Set to null or handle according to your application logic
            }));
          console.log(selectedItems1);

          // setSelectedPrItemList2(selectedItems1);
        }
      } else {
      }
    } catch (error) {
      showErrorToast("Rfq Details Load Failed");
    }
  };

  //rfq details

  //rfq details

  //search

  const search = async () => {
    getprItem(
      parseInt(buyerName),
      parseInt(selectedOrgId),
      parseInt(prNumber),
      offset,
      limit
    );
  };
  //search

  //api call for pr item

  //now working with four

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reqName, setReqName] = useState("");

  const getprItem = async (
    buyerId: number | null,
    orgId: number | null,
    prNumber: number | null,
    offset: number,
    limit: number
  ) => {
    setIsLoading(true);
    try {
      const result = await prItemListService(
        token!,
        buyerId,
        orgId,
        prNumber,
        fromDate,
        toDate,
        reqName,
        itemName,
        buyerName,
        offset,
        limit
      );
      if (result.data.status === 200) {
        // result.data.data.forEach((item: PrItemInterface) => {
        //   delete item.PREPARER_ID;
        //   // delete item.PR_NUMBER;
        //   // delete item.REQUISITION_HEADER_ID;
        //   // delete item.REQUISITION_LINE_ID;
        //   delete item.CREATION_DATE;
        //   delete item.APPROVED_DATE;
        //   delete item.ATTRIBUTE6;
        //   delete item.BRAND;
        //   delete item.ORIGIN;

        //   delete item.CATEGORY_ID;
        //   delete item.ATTRIBUTE_CATEGORY;
        //   delete item.CLOSED_CODE;
        //   delete item.DESCRIPTION;

        //   // delete item.ITEM_ID;

        //   // Add more delete statements for other fields you want to remove
        // });
        result.data.data.forEach((item: PrItemInterface) => {
          item.BUYER_VAT_APPLICABLE = "N";
          item.LCM_ENABLE_FLAG = "N";
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
        setPrItemList(result.data.data);
        if (isSelectedAll) {
          const selectedItems: SelectedPrItemInterface[] = result.data.data.map(
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
            })
          );
          setSelectedPrItemList(selectedItems);
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
  // const getPrItemInfo2 = (index: number) => {
  //   setPrItemIndex(index);
  // };

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
    getprItem(
      parseInt(buyerName),
      parseInt(selectedOrgId),
      parseInt(prNumber),
      newOff,
      limit
    );
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

    // getHistory("", "", newOff, limit);
    getprItem(
      parseInt(buyerName),
      parseInt(selectedOrgId),
      parseInt(prNumber),
      newOff,
      limit
    );
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
    getprItem(parseInt(buyerName), null, null, offset, newLimit);
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

  const handleApproveDateChange = (newValue: any) => {
    console.log("newValue:", newValue);
    setApproveDates(newValue);
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
  // const { page, setPage } = useRfqCreateProcessContext();
  // const submitAndNext = () => {
  //   setValidateButtonPressed(true);
  //   // Check if there are any invalid dates
  //   console.log(selectedPrItemList.length);
  //   console.log(selectedPrItemList);

  //   if (selectedPrItemList.length !== 0) {
  //     const hasInvalidDates = selectedPrItemList.some(
  //       (item) => item.NEED_BY_DATE === "Invalid date"
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
  //       setPage(2);
  //       setPrItems(selectedPrItemList);
  //       setPrItems2(selectedPrItemList2);
  //     }
  //   }
  // };

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
      showErrorToast("Pr Item Load Failed");
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
    const selectedItems: SelectedPrItemInterface[] = prItemList.map((item) => ({
      ATTRIBUTE_CATEGORY: item.ATTRIBUTE_CATEGORY || "",
      AUTHORIZATION_STATUS: item.AUTHORIZATION_STATUS,
      // BUYER_FILE_NAME: item.BUYER_FILE_NAME || "",
      // BUYER_FILE_NAME:
      //   typeof item.BUYER_FILE_NAME === "string" ? item.BUYER_FILE_NAME : "",
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
      BUYER_FILE: item.BUYER_FILE, // Default value for missing property
      // MIMETYPE: "", // Default value for missing property
      // ORIGINAL_FILE_NAME: "", // Default value for missing property
    }));
    setSelectedPrItemList(selectedItems);
  };
  const selectAll2 = () => {
    setIsSelectAll2(true);
    const selectedItems2: SelectedPrItemInterface[] = prItemList.map(
      (item) => ({
        ATTRIBUTE_CATEGORY: item.ATTRIBUTE_CATEGORY || "",
        AUTHORIZATION_STATUS: item.AUTHORIZATION_STATUS,
        // BUYER_FILE_NAME: item.BUYER_FILE_NAME || "",
        // BUYER_FILE_NAME:
        //   typeof item.BUYER_FILE_NAME === "string" ? item.BUYER_FILE_NAME : "",
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
        BUYER_FILE: item.BUYER_FILE, // Default value for missing property
        // MIMETYPE: "", // Default value for missing property
        // ORIGINAL_FILE_NAME: "", // Default value for missing property
      })
    );
    setSelectedPrItemList2(selectedItems2);
  };

  const unselectAll = () => {
    setIsSelectAll(false);
    setSelectedPrItemList([]);
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

  const toggleprItemSelection = (employee: PrItemInterface) => {
    setSelectedPrItemList((prevSelectedList) => {
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
          employee as unknown as SelectedPrItemInterface,
        ];
        // Ensure employee is casted to SelectedPrItemInterface
      }
    });
  };
  const toggleprItemSelection2 = (employee: PrItemInterface) => {
    setSelectedPrItemList2((prevSelectedList2) => {
      const isEmployeeSelected2 = prevSelectedList2.some(
        (emp) => emp.REQUISITION_LINE_ID === employee.REQUISITION_LINE_ID
      );

      if (isEmployeeSelected2) {
        // If the employee is already selected, remove it
        return prevSelectedList2.filter(
          (emp) => emp.REQUISITION_LINE_ID !== employee.REQUISITION_LINE_ID
        );
      } else {
        // If the employee is not selected, add it
        return [
          ...prevSelectedList2,
          employee as unknown as SelectedPrItemInterface,
        ];
        // Ensure employee is casted to SelectedPrItemInterface
      }
    });
  };

  //select/unselect

  //store
  const {
    setPrItems,
    setTotalprItemNumberInStore,
    isCreateRfq,
    rfqHeaderDetailsInStore,
    rfqIdInStore,
    setRfqDetailsInStore,
    rfqDetailsInStore,
    setPrItems2,
  } = usePrItemsStore();
  //store

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
  // const openWarningModal2 = () => {
  //   setIsWarningShow2(true);
  // };
  const closeWarningModal2 = () => {
    setIsWarningShow2(false);
    setPrItemIndex2(null);
  };

  //warning modal

  //current stock

  const { setRfiTabNo } = useRfiStore();

  //current stock
  const back = () => {
    // setRfiManageSupplierPageNo(3);
    setRfiTabNo(33);
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

  //approve modal

  const [approveModal, setApproveModal] = useState<boolean>(false);
  const [approveValue, setApproveValue] = useState<string>("");
  const onCLickApprove = () => {
    // setActionCode(1);
    setApproveModal(!approveModal);
    if (!approveModal) {
      setApproveValue("");
    }
  };

  // Event handler to update the state when the textarea value changes
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

  //validation
  const [rfiError, setRfiError] = useState<{
    approveVal?: string;
    password?: string;
  }>({});

  //  {loginError.email && <ValidationError title={loginError.email} />}

  //validation
  const validateRfi = () => {
    const errors: { approveVal?: string } = {};

    if (!approveValue.trim()) {
      errors.approveVal = "Please Enter Note";
    }

    setRfiError(errors);

    return Object.keys(errors).length === 0;
  };
  //validation

  const sendRfi = async () => {
    if (validateRfi()) {
      setApproveModal(false);
      try {
        const result = await RfiAddUpdateService(
          token!,
          rfiId,
          null,
          "",
          "",
          null,
          approveValue,
          1
        );
        if (result.data.status === 200) {
          showSuccessToast(result.data.message);
          setTimeout(() => {
            back();
          }, 3100);
        } else {
          showErrorToast(result.data.message);
        }
      } catch (error) {
        showErrorToast("Something went wrong");
      }
    }
  };

  const getRfqList = async () => {
    // setIsLoading(true);
    console.log("userId: ", userId);
    console.log("supId, ", rfqIdInStore);

    try {
      const result = await RfiSupplierListService(
        token!,
        null,
        userId,
        0,
        rfqIdInStore
      );
      console.log(result.data);

      if (result.data.status === 200) {
        console.log(result.data.data);
        setPropicPath(result.data.PROFILE_PIC);

        setSUpplierList(result.data.data);
        // setIsLoading(false);
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

  return (
    <div className=" m-8">
      <div className="flex items-center justify-between">
        <h1 className="w-full text-midBlack font-mon font-semibold">
          Line Items
        </h1>

        <div className=" w-full flex justify-end">
          <CommonButton
            onClick={back}
            titleText="Back"
            width="w-24"
            height="h-9"
            color="bg-midGreen"
          />
        </div>
      </div>

      <div className="h-16"></div>
      {isLoading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <LogoLoading />
        </div>
      ) : (
        <>
          <div className=" overflow-x-auto">
            <table className=" border-[0.5px] border-gray-200">
              <thead className=" bg-[#F4F6F8] shadow-sm h-14">
                <tr>
                  {/* <th className="px-6 py-3 text-left text-sm font-semiBold text-grayBlackColor font-mon   tracking-wider">
                    <button
                      onClick={() => {
                        isSelectedAll2 ? unselectAll2() : selectAll2();
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
                    </button>
                  </th> */}
                  <th className="px-6 py-3 text-left text-sm font-semiBold text-grayBlackColor font-mon   tracking-wider">
                    SL
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semiBold text-grayBlackColor font-mon   tracking-wider">
                    PR No/Line No
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semiBold text-grayBlackColor font-mon   tracking-wider">
                    Requester /Username
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semiBold text-grayBlackColor font-mon   whitespace-nowrap w-44 ">
                    Item Description
                  </th>
                  <th className=" px-6 py-3 text-left text-sm font-semiBold text-grayBlackColor font-mon   tracking-wider">
                    Specification
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semiBold text-grayBlackColor font-mon   tracking-wider">
                    Expected Brand Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semiBold text-grayBlackColor font-mon   tracking-wider">
                    Expected Brand Origin
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semiBold text-grayBlackColor font-mon   tracking-wider">
                    LCM Enabled
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semiBold text-grayBlackColor font-mon   tracking-wider">
                    Vat
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semiBold text-grayBlackColor font-mon   tracking-wider">
                    Warranty
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semiBold text-grayBlackColor font-mon   tracking-wider">
                    UOM
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semiBold text-grayBlackColor font-mon   tracking-wider">
                    Expected Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semiBold text-grayBlackColor font-mon   tracking-wider">
                    Need By Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semiBold text-grayBlackColor font-mon   tracking-wider">
                    Inventory Org Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semiBold text-grayBlackColor font-mon   tracking-wider">
                    Current Stock
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semiBold text-grayBlackColor font-mon   tracking-wider">
                    Attachment
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semiBold text-grayBlackColor font-mon   tracking-wider">
                    Note To Supplier
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semiBold text-grayBlackColor font-mon   tracking-wider"></th>
                </tr>
              </thead>
              <tbody className=" divide-y divide-borderColor ">
                {prItemList2.map((e, index) => {
                  return (
                    <tr
                      key={index}
                      className={`odd:bg-white even:bg-gray-50 disable-row opacity-50 pointer-events-none`}
                    >
                      {/* <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                        <button
                          onClick={() => {
                            toggleprItemSelection2(e);
                          }}
                          className={`${
                            selectedPrItemList2.some(
                              (emp) =>
                                emp.REQUISITION_LINE_ID ===
                                e.REQUISITION_LINE_ID
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
                      </td> */}

                      <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                        {pageNo === 1 ? pageNo + index : offset + 1 + index}
                      </td>
                      <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                        <p>
                          {e.PR_NUMBER}/{e.LINE_NUM}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                        <p>{e.CREATED_BY}</p>
                      </td>
                      <td className="   px-6 py-4 text-[14px] text-blackColor font-mon  w-40">
                        <p>
                          {e.ITEM_DESCRIPTION === ""
                            ? "N/A"
                            : e.ITEM_DESCRIPTION}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                        <CommonInputField
                          type="text"
                          width="w-44"
                          hint="Specification"
                          onChangeData={(value) =>
                            handleSpecificationChange2(value, index)
                          }
                          inputRef={{
                            current: specificationRefs2.current[index],
                          }}
                          value={specificationList2[index]}
                        />
                      </td>
                      <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                        {e.EXPECTED_BRAND_NAME === ""
                          ? "N/A"
                          : e.EXPECTED_BRAND_NAME}
                      </td>
                      <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                        {/* {e.EXPECTED_BRAND_NAME === "" ? "N/A" : e.EXPECTED_BRAND_NAME} */}
                        {e.EXPECTED_ORIGIN === "" ? "N/A" : e.EXPECTED_ORIGIN}
                      </td>
                      <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                        <div className=" flex flex-row space-x-2 items-center">
                          <button
                            onClick={() => {
                              handleLcmEnable2(index);
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
                      </td>
                      <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                        <div className=" flex flex-row space-x-2 items-center">
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
                      <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
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
                          <p>Applicable</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                        {e.UNIT_MEAS_LOOKUP_CODE === ""
                          ? "N/A"
                          : e.UNIT_MEAS_LOOKUP_CODE}
                      </td>
                      <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                        {e.EXPECTED_QUANTITY}
                      </td>
                      <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                        <DateRangePicker
                          signle={true}
                          useRange={false}
                          placeholder="Date"
                          width="w-36"
                          value={needByDatesArray2[index]} // Pass the dates from the state
                          onChange={(newValue) =>
                            handleNeedByDateChange2(newValue, index)
                          } // Update the state on change
                        />

                        {selectedPrItemList2.map((emp) =>
                          emp.REQUISITION_LINE_ID === e.REQUISITION_LINE_ID &&
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
                      </td>
                      <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                        {!e.INVENTORY_ORG_NAME ? "N/A" : e.INVENTORY_ORG_NAME}
                      </td>
                      <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                        <Button
                          onClick={() => {
                            openCurrentStockModal(e.ORG_ID, e.ITEM_ID);
                          }}
                          className="bg-midBlack font-mon text-white text-xs font-medium rounded-md h-8 px-1 "
                        >
                          View
                        </Button>
                      </td>

                      <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                        <FilePickerInput
                          fontSize="text-sm"
                          width="w-60"
                          onFileSelect={(newFile: File | null) =>
                            handleAttachmentFile2(newFile!, index)
                          }
                          initialFileName={e.BUYER_FILE_ORG_NAME ?? ""}
                          maxSize={2 * 1024 * 1024}
                        />
                      </td>
                      <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                        <CommonInputField
                          type="text"
                          width="w-44"
                          hint="note"
                          onChangeData={(value) =>
                            handleNoteToSupplierChange2(value, index)
                          }
                          inputRef={{
                            current: noteToSupplierRefs2.current[index],
                          }}
                          value={noteToSupplierList2[index]}
                        />
                      </td>
                      {/* <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                        <button
                          onClick={() => {
                            getPrItemInfo2(index);
                            openWarningModal2();
                          }}
                          className=" text-xs text-redColor bg-red-200 h-6 px-2 rounded-md tracking-wide "
                        >
                          Remove
                        </button>
                      </td> */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="h-10"></div>

          {supplierList.map((e, i) => (
            <div
              key={e.ID}
              className=" p-4 w-full  bg-white shadow-sm rounded-md border-[0.1px] border-gray-200 flex space-x-4 items-start
                      "
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
                <p className=" smallText">Query: {e.INITIATOR_NOTE}</p>
              </div>
            </div>
          ))}

          <div className="h-">
            <div className=" w-full my-10 ">
              <CommonButton
                titleText="Feed Back"
                height="h-10"
                width="w-44"
                color="bg-midGreen"
                onClick={onCLickApprove}
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
            {rfiError.approveVal && (
              <ValidationError title={rfiError.approveVal} />
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="outlineGray"
            className=" h-8 font-mon"
            onClick={onCLickApprove}
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
      {/* approve modal */}

      {/* current stock modal */}
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box modal-middle w-3/4 max-w-none">
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
                          {e.ORGANIZATION_CODE === ""
                            ? "N/A"
                            : e.ORGANIZATION_CODE}
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
