import React, { useState, useRef, RefObject, useEffect } from "react";
import PageTitle from "../../../common_component/PageTitle";
import NavigationPan from "../../../common_component/NavigationPan";
import CommonButton from "../../../common_component/CommonButton";
import InputLebel from "../../../common_component/InputLebel";
import CommonDropDownSearch from "../../../common_component/CommonDropDownSearch";
import CommonSearchField from "../../../common_component/CommonSearchField";
import CommonInputField from "../../../common_component/CommonInputField";
import Popper from "@mui/material/Popper";
import DropDown from "../../../common_component/DropDown";
import ReusablePopperComponent from "../../../common_component/ReusablePopperComponent";
import ReusablePaginationComponent from "../../../common_component/ReusablePaginationComponent";
import { useRfqCreateProcessContext } from "../../../buyer_rfq_create/context/RfqCreateContext";
import { useAuth } from "../../../login_both/context/AuthContext";
import CommonOrgInterface from "../../../common_interface/CommonOrgInterface";
import { showErrorToast } from "../../../Alerts_Component/ErrorToast";
import GetOrgListService from "../../../common_service/GetOrgListService";
import SupplierCategoryInterface from "../interface/SupplierCategoryInterface";
import SuccessToast, {
  showSuccessToast,
} from "../../../Alerts_Component/SuccessToast";
import SupplierCategoryListService from "../service/SupplierCategoryListService";
import SupplierInterface from "../interface/SupplierInterface";
import SupplierListService from "../service/SupplierListService";
import LogoLoading from "../../../Loading_component/LogoLoading";
import NotFoundPage from "../../../not_found/component/NotFoundPage";
import usePrItemsStore from "../../pr/store/prItemStore";
import RfqCreationService from "../../../buyer_rfq_create/service/RfqCreationService";
import { log } from "console";
import { it } from "node:test";
import SelectedSupplierInterface from "../interface/SelectedSupplierInterface";
import { Item } from "@radix-ui/react-select";
import { CSVLink } from "react-csv";
import moment from "moment";
import ArrowLeftIcon from "../../../icons/ArrowLeftIcon";
import ArrowRightIcon from "../../../icons/ArrowRightIcon";
import isoToDateTime from "../../../utils/methods/isoToDateTime";
import fetchFileUrlService from "../../../common_service/fetchFileUrlService";

const pan = ["Home", "RFQ", "Invite Supplier"];

interface Option {
  label: string;
  value: string;
}

interface contactOption {
  label: string;
  value: string;
  mail: string;
}

export default function InviteSupplierForRfqPage() {
  const supplierSearchValRef = useRef<HTMLInputElement | null>(null);
  const [supplierCategory, setSupplierCategory] = useState(null);
  const [supplierSearchVal, setSupplierSearchVal] = useState("");

  const [total, setTotal] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(10);
  const [pageNo, setPageNo] = useState<number>(1);
  const [offset, setOffSet] = useState<number>(1);

  //auth
  const { token } = useAuth();
  //auth

  //store
  const {
    setInvitedSuppliers,
    setRfqIdInStore,
    setRfqStatusInStore,
    orgIdInStore,
    invitedSuppliers,
    setApprovalTypeInStore,
    rfqDetailsInStore,
  } = usePrItemsStore();
  //store

  useEffect(() => {
    // console.log("org: ", orgIdInStore);
    console.log(rfqDetailsInStore?.supplier_list);

    getOrgList();
    getSupplierList("", "", offset, limit);
  }, []);

  // aita holo popper er jonno
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;
  //end poppoer

  const handlesupplierSearchValChange = (val: string) => {
    setSupplierSearchVal(val);
  };

  //for drop down search
  const handleChange = (value: any) => {
    console.log("value:", value);
    setSupplierCategory(value);
  };
  //for drop down search

  // drop down
  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];
  const handleSelect = (value: string) => {
    console.log(`Selected: ${value}`);
    // Do something with the selected value
  };
  // drop down

  const searchSupplier = async () => {
    getSupplierList(
      selectedVendorListHeaderId,
      supplierSearchVal,
      offset,
      limit
    );
    console.log("search: ", supplierSearchVal);
    setSelectedContact([]);
    setSelectedSite([]);
  };

  const download = async () => {};

  // const addSupplier = async () => {
  //   // console.log(headerAttachment);
  //   // console.log(prItems[0]);

  //   // createRfq();
  //   const filteredArray1 = supplierList.filter((item1: SupplierInterface) => {
  //     return selectedSupplierList.some((item2: SelectedSupplierInterface) => item2.SUPPLIER_ID === item1.USER_ID);
  // });

  //   console.log(filteredArray1);

  //   console.log(supplierList[0]);

  //   console.log(selectedSupplierList);
  //   setInvitedSuppliers(filteredArray1);
  //   setPage(5);
  // };

  const addSupplier = async () => {
    // Filter suppliers based on selection criteria

    const filteredArray1 = supplierList.filter((item1) => {
      return selectedSupplierList.some(
        (item2) => item2.USER_ID === item1.USER_ID
      );
    });

    // Map filteredArray1 to SelectedSupplierListInterface
    const selectedSuppliers: SelectedSupplierInterface[] = filteredArray1.map(
      (supplier) => {
        return {
          USER_ID: supplier.USER_ID,
          EMAIL: supplier.EMAIL_ADDRESS,
          // Optionally include ADDITIONAL_EMAIL if present in supplierList
          ADDITIONAL_EMAIL: supplier.ADDITIONAL_EMAIL,
          SUPPLIER_NAME: supplier.SUPPLIER_NAME,
          MOBILE_NUMBER: supplier.MOBILE_NUMBER,
          PO_DATE: supplier.PO_DATE,
          TOTAL_PO: supplier.TOTAL_PO,
          SITE_ID: supplier.SITE_ID,
          SITE_NAME: supplier.SITE_NAME,
          CONTACT_ID: supplier.ID,
          NAME: supplier.NAME,
          INVITATION_ID: supplier.INVITATION_ID,
          CONTACT_EMAIL: supplier.EMAIL,
          REGISTRATION_ID: supplier.REGISTRATION_ID,
        };
      }
    );

    // Set invited suppliers
    // setInvitedSuppliers(selectedSuppliers);

    // Change page
    setPage(5);
  };

  const reset = () => {
    setSelectedSupplierList([]);
    setSelectedOrgId("");
    setConvertedOrg(null);
    setConvertedCategoryList([]);
    setCategory(null);
    setSelectedVendorListHeaderId("");

    getSupplierList("", "", offset, limit);
  };

  //pagination
  // const next = async () => {};
  // const previous = async () => {};
  //context
  const { page, setPage } = useRfqCreateProcessContext();
  const submitAndNext = () => {
    setPage(5);
  };
  const previousPage = () => {
    setRfqStatusInStore("");
    setApprovalTypeInStore("");
    setPage(3);
    // setRfqIdInStore(null);
  };

  interface Org {
    value: string;
    label: string;
  }

  //org list

  const [orgList, setOrgList] = useState<CommonOrgInterface[] | []>([]);
  const [convertedOrgList, setConvertedOrgList] = useState<Org[] | []>([]);
  const [convertedOrg, setConvertedOrg] = useState<Org | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");

  const handleOrgChange = (value: any) => {
    // console.log("value:", value);
    setConvertedOrg(value);
    if (value !== null) {
      setSelectedOrgId(value.value);
      getCategoryList(value.value);
      console.log(value.value);
      console.log(value);

      console.log(value.value);
    } else if (value == null && selectedOrgId != null) {
      setSelectedOrgId("");
      console.log("cleared");
      setConvertedCategoryList([]);
      setCategory(null);
      setSelectedVendorListHeaderId("");
      getSupplierList("", "", offset, limit);
    }
  };

  const getOrgList = async () => {
    try {
      const result = await GetOrgListService(token!);

      if (result.data.status === 200) {
        // setOrgList(result.data.data);
        const convertedData = result.data.data.map(
          (org: CommonOrgInterface) => ({
            value: org.ORGANIZATION_ID.toString(),
            label: org.NAME,
          })
        );
        const findOrg: Org = convertedData.find(
          (org: Org) => org.value.toString() === orgIdInStore
        );
        console.log(findOrg);

        setConvertedOrg(findOrg);
        setSelectedOrgId(findOrg.value);
        getCategoryList(findOrg.value);

        setConvertedOrgList(convertedData);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Organization Load Failed");
    }
  };

  //org list

  //category list

  interface Category {
    value: string;
    label: string;
  }

  const [categoryList, setCategoryList] = useState<
    SupplierCategoryInterface[] | []
  >([]);

  const [converCategoryList, setConvertedCategoryList] = useState<
    Category[] | []
  >([]);

  const [category, setCategory] = useState<Category | null>(null);

  const [selectedVendorListHeaderId, setSelectedVendorListHeaderId] =
    useState("");

  const handleCatChange = (value: any) => {
    // console.log("value:", value);
    setCategory(value);
    if (value !== null) {
      setSelectedVendorListHeaderId(value.value);
      console.log(value.value);
      getSupplierList(value.value, supplierSearchVal, offset, limit);
    } else if (value == null && selectedVendorListHeaderId != null) {
      setSelectedVendorListHeaderId("");
      console.log("cleared");
    }
  };

  const getCategoryList = async (orgId: string) => {
    try {
      const result = await SupplierCategoryListService(token!, orgId);

      if (result.data.status === 200) {
        setOrgList(result.data.data);
        const convertedData = result.data.data.map(
          (cat: SupplierCategoryInterface) => ({
            value: cat.VENDOR_LIST_HEADER_ID.toString(),
            label: cat.VENDOR_LIST_NAME,
          })
        );
        setConvertedCategoryList(convertedData);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Category Load Failed");
    }
  };

  //category list

  //supplier list

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [supplierList, setSupplierList] = useState<SupplierInterface[] | []>(
    []
  );
  const [selectedSupplierList, setSelectedSupplierList] = useState<
    SelectedSupplierInterface[] | []
  >([]);
  const [isSelectedAll, setIsSelectAll] = useState<boolean>(false);

  const [profilePicPath, setProfilePicPath] = useState<string>("");

  const getSupplierList = async (
    headerId: string,
    searchingSupplier: string,
    pageStart: number,
    dataLimit: number
  ) => {
    try {
      setIsLoading(true);
      const result = await SupplierListService(
        token!,
        headerId,
        searchingSupplier,
        orgIdInStore,
        pageStart,
        dataLimit
      );

      if (result.data.status === 200) {
        result.data.data.forEach((item: SupplierInterface) => {
          item.ADDITIONAL_EMAIL = "";
          item.CAN_EDIT = 0;
        });

        dividePage(result.data.total, limit);

        console.log("Supplier: ", result.data);

        if (isSelectedAll) {
          const selectedSupList: SelectedSupplierInterface[] =
            result.data.data.map((item: SupplierInterface) => ({
              SUPPLIER_ID: item.USER_ID,
              EMAIL: item.EMAIL_ADDRESS,
              ADDITIONAL_EMAIL: item.ADDITIONAL_EMAIL,
              CAN_EDIT: item.CAN_EDIT,
            }));

          setSelectedSupplierList(selectedSupList);
        }

        setSupplierList(result.data.data);

        setProfilePicPath(result.data.filepath1);
        // if (isSelectedAll) {
        //   setSelectedSupplierList(result.data.data);
        // }
        setIsLoading(false);
      } else {
        showErrorToast(result.data.message);
        setIsLoading(false);
      }
    } catch (error) {
      showErrorToast("Supplier Load Failed");
      setIsLoading(false);
    }
  };

  //image load

  interface ImageUrls {
    [key: number]: string | null;
  }

  const [imageUrls, setImageUrls] = useState<ImageUrls>({});

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
          const url = await getImage2(
            profilePicPath,
            element.PROFILE_PIC1_FILE_NAME
          );
          newImageUrls[element!.USER_ID] = url;
        }
        setImageUrls(newImageUrls);
        // setIsLoading(false);
      };
      fetchImages();
    }
  }, [supplierList, profilePicPath]);

  //image load

  const dividePage = (number: number, lmt: number) => {
    console.log(number);
    if (typeof number !== "number") {
      throw new Error("Input must be a number");
    }

    const re = Math.ceil(number / lmt);
    console.log(number);
    console.log(re);
    setTotal(re);
  };

  const next = async () => {
    let newOff;

    newOff = offset + limit;
    console.log(newOff);
    setOffSet(newOff);

    setPageNo((pre) => pre + 1);
    console.log(limit);
    // getHistory("", "", newOff, limit);
    getSupplierList("", "", newOff, limit);
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
    getSupplierList("", "", newOff, limit);
  };

  const renderPageNumbers = () => {
    const totalPages = total ?? 0;
    const pageWindow = 5;
    const halfWindow = Math.floor(pageWindow / 2);
    let startPage = Math.max(1, pageNo - halfWindow);
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
            setPageNo(i);
            const newOffset = i === 1 ? 1 : (i - 1) * limit + 1;
            setOffSet(newOffset);
            getSupplierList("", "", newOffset, limit);
          }}
          className={`w-6 h-6 text-[12px] border rounded-md ${
            pageNo === i ? "border-sky-400" : "border-transparent"
          }`}
          disabled={pageNo === i}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  //supplier list

  //select/unselect

  const selectAll = () => {
    setIsSelectAll(true);

    const selectedSupList: SelectedSupplierInterface[] = supplierList.map(
      (item: SupplierInterface) => ({
        USER_ID: item.USER_ID,
        EMAIL: item.EMAIL_ADDRESS,
        ADDITIONAL_EMAIL: item.ADDITIONAL_EMAIL,
        SUPPLIER_NAME: item.SUPPLIER_NAME,
        MOBILE_NUMBER: item.SUPPLIER_NAME,
        CAN_EDIT: item.CAN_EDIT,
        TOTAL_PO: item.TOTAL_PO,
        PO_DATE: item.PO_DATE,
        SITE_ID: item.SITE_ID,
        SITE_NAME: item.SITE_NAME,
        CONTACT_ID: item.ID,
        NAME: item.NAME,
        INVITATION_ID: item.INVITATION_ID,
        CONTACT_EMAIL: item.EMAIL,
        REGISTRATION_ID: item.REGISTRATION_ID,
      })
    );

    setSelectedSupplierList(selectedSupList);
  };
  const unselectAll = () => {
    setIsSelectAll(false);
    setSelectedSupplierList([]);
  };

  // const toggleprSupplierSelection = (employee: SupplierInterface) => {
  //   // Check if the employee is already selected
  //   const isSelected = selectedSupplierList.some(
  //     (item) => item.SUPPLIER_ID === employee.USER_ID
  //   );

  //   if (isSelected) {
  //     // If selected, remove it from the list
  //     setSelectedSupplierList((prevList) =>
  //       prevList.filter((item) => item.SUPPLIER_ID !== employee.USER_ID)
  //     );
  //   } else {
  //     // If not selected, add it to the list
  //     const select: SelectedSupplierInterface = {
  //       SUPPLIER_ID: employee.USER_ID,
  //       EMAIL: employee.EMAIL_ADDRESS,
  //       ADDITIONAL_EMAIL: employee.ADDITIONAL_EMAIL,
  //     };
  //     setSelectedSupplierList((prevList) => [...prevList, select]);
  //   }
  // };

  // const toggleprSupplierSelection = (employee: SupplierInterface) => {
  //   // Check if the employee is already selected
  //   const isSelected = selectedSupplierList.some(
  //     (item) => item.USER_ID === employee.USER_ID
  //   );

  //   // Always include the additional email if provided
  //   const select: SelectedSupplierInterface = {
  //     USER_ID: employee.USER_ID,
  //     EMAIL: employee.EMAIL_ADDRESS,
  //     ADDITIONAL_EMAIL: employee.ADDITIONAL_EMAIL,
  //     SUPPLIER_NAME: employee.SUPPLIER_NAME,
  //     MOBILE_NUMBER: employee.MOBILE_NUMBER,
  //     TOTAL_PO: employee.TOTAL_PO,
  //     PO_DATE: employee.PO_DATE,
  //     SITE_ID: employee.SITE_ID,
  //     SITE_NAME: employee.SITE_NAME,
  //     CONTACT_ID: employee.ID,
  //     NAME: employee.NAME,
  //     INVITATION_ID: employee.INVITATION_ID,
  //     CONTACT_EMAIL: employee.EMAIL,
  //   };

  //   if (isSelected) {
  //     // If selected, remove it from the list
  //     setSelectedSupplierList((prevList) =>
  //       prevList.filter((item) => item.USER_ID !== employee.USER_ID)
  //     );

  //     setInvitedSuppliers(
  //       invitedSuppliers.filter((item) => item.USER_ID !== employee.USER_ID)
  //     );
  //   } else {
  //     // If not selected, add it to the list
  //     setSelectedSupplierList((prevList) => [...prevList, select]);

  //     setInvitedSuppliers([...invitedSuppliers, select]);
  //   }
  // };

  const toggleprSupplierSelection = (
    employee: SupplierInterface,
    index: number
  ) => {
    const isPreSelected = rfqDetailsInStore?.supplier_list.some(
      (item) => item.USER_ID === employee.USER_ID
    );
    console.log(isPreSelected);

    if (isPreSelected) {
      showErrorToast("This supplier is already selected");
    } else {
      // Check if the employee is already selected
      const isSelected = selectedSupplierList.some(
        (item) => item.USER_ID === employee.USER_ID
      );

      // Check if site and contact are selected
      if (!selectedSite[index]) {
        showErrorToast("Please select a site before proceeding.");
        return;
      }

      if (!selectedContact[index]) {
        showErrorToast("Please select a contact before proceeding.");
        return;
      }

      // Always include the additional email if provided
      const select: SelectedSupplierInterface = {
        USER_ID: employee.USER_ID,
        EMAIL: employee.EMAIL_ADDRESS,
        ADDITIONAL_EMAIL: employee.ADDITIONAL_EMAIL,
        SUPPLIER_NAME: employee.SUPPLIER_NAME,
        MOBILE_NUMBER: employee.MOBILE_NUMBER,
        TOTAL_PO: employee.TOTAL_PO,
        PO_DATE: employee.PO_DATE,
        SITE_ID: employee.SITE_ID,
        SITE_NAME: employee.SITE_NAME,
        CONTACT_ID: employee.ID,
        NAME: employee.NAME,
        INVITATION_ID: null,
        CONTACT_EMAIL: employee.EMAIL,
        REGISTRATION_ID: employee.REGISTRATION_ID,
      };
      console.log("selected", select);

      if (isSelected) {
        // If selected, remove it from the list
        setSelectedSupplierList((prevList) =>
          prevList.filter((item) => item.USER_ID !== employee.USER_ID)
        );

        setInvitedSuppliers(
          invitedSuppliers.filter((item) => item.USER_ID !== employee.USER_ID)
        );
      } else {
        // If not selected, add it to the list
        setSelectedSupplierList((prevList) => [...prevList, select]);

        setInvitedSuppliers([...invitedSuppliers, select]);
      }
    }
  };

  //email set

  const emailRef = useRef<HTMLInputElement[]>([]);
  const [emailList, setEmailList] = useState<string[]>([]);
  const additionalEmailRef = useRef<HTMLInputElement[]>([]);

  const [additionalEmailList, setAdditionalEmailList] = useState<string[] | []>(
    []
  );

  // const handleEmailChange = (value: string, index: number) => {
  //   const neWemailList = [...emailList];
  //   neWemailList[index] = value;
  //   const newSupplierList = [...supplierList];
  //   newSupplierList[index].EMAIL_ADDRESS = value;
  //   setEmailList(neWemailList);
  //   setSupplierList(newSupplierList);
  // };
  const handleAdditionalEmailChange = (value: string, index: number) => {
    const neWemailList = [...additionalEmailList];
    neWemailList[index] = value;
    setAdditionalEmailList(neWemailList);
    const newSupplierList = [...supplierList];
    newSupplierList[index].ADDITIONAL_EMAIL = value;
    // setAdditionalEmailList(neWemailList);
    setSupplierList(newSupplierList);
  };

  const [selectedSite, setSelectedSite] = useState<Option[]>([]);
  // const [supplierList, setSupplierList] = useState<SupplierInterface[]>([]);

  const handleSiteChange = (
    value: any,
    index: number,
    site: SupplierInterface
  ) => {
    if (!value || Array.isArray(value)) return;

    // console.log("site id: ", value);
    // console.log("index: ", index);

    const updatedSelectedSite = [...selectedSite];
    updatedSelectedSite[index] = value;
    setSelectedSite(updatedSelectedSite);

    const newSupplierList = [...supplierList];
    newSupplierList[index].SITE_ID = value.value;
    newSupplierList[index].SITE_NAME = value.label;
    // console.log(value.value);

    setSupplierList(newSupplierList);
    // console.log(selectedSupplierList.length);
    // console.log(selectedSupplierList);
    // console.log(site.SUPPLIER_ID);

    if (selectedSupplierList.length !== 0) {
      const findItem = selectedSupplierList.find(
        (item: SelectedSupplierInterface) => item.USER_ID === site.USER_ID
      );
      console.log(findItem);

      if (findItem) {
        findItem.SITE_ID = value.value;
        findItem.SITE_NAME = value.label;
        setSelectedSupplierList((prevList) => [...prevList, findItem]);
      }
    }
  };

  const [selectedContact, setSelectedContact] = useState<contactOption[]>([]);

  const handleContactChange = (
    value: any,
    index: number,
    contact: SupplierInterface
  ) => {
    if (!value || Array.isArray(value)) return;

    // console.log("contact id: ", value);
    // console.log("contact mail: ", value);
    // console.log("index: ", index);

    const updatedSelectedContact = [...selectedContact];
    updatedSelectedContact[index] = value;
    setSelectedContact(updatedSelectedContact);

    const newSupplierList = [...supplierList];
    newSupplierList[index].ID = value.value;
    newSupplierList[index].NAME = value.label;
    newSupplierList[index].EMAIL = value.mail;

    // console.log(value.mail);

    setSupplierList(newSupplierList);
    // console.log(selectedSupplierList.length);
    // console.log(selectedSupplierList);
    // console.log(contact.SUPPLIER_ID);

    if (selectedSupplierList.length !== 0) {
      const findItem = selectedSupplierList.find(
        (item: SelectedSupplierInterface) => item.USER_ID === contact.USER_ID
      );
      console.log(findItem);

      if (findItem) {
        findItem.CONTACT_ID = value.value;
        findItem.NAME = value.label;
        findItem.CONTACT_EMAIL = value.mail;
        setSelectedSupplierList((prevList) => [...prevList, findItem]);
      }
    }
  };

  //email set

  useEffect(() => {
    if (supplierList) {
      setData();
    }
  }, [supplierList]);

  const setData = () => {
    if (supplierList) {
      const emailArray = supplierList.map((item) => item.EMAIL_ADDRESS);
      setEmailList(emailArray);

      emailRef.current = emailArray.map((email, index) => {
        return emailRef.current[index] || React.createRef<HTMLInputElement>();
      });
      const additionalEmailArray = supplierList.map(
        (item) => item.ADDITIONAL_EMAIL
      );
      setAdditionalEmailList(additionalEmailArray);

      if (additionalEmailRef.current) {
        additionalEmailRef.current = additionalEmailArray.map((spec, index) => {
          return (
            additionalEmailRef.current[index] ||
            React.createRef<HTMLInputElement>()
          );
        });
      }

      // additionalEmailRef.current = additionalEmailArray.map((email, index) => {
      //   return (
      //     additionalEmailRef.current[index] ||
      //     React.createRef<HTMLInputElement>()
      //   );
      // });
    }
  };

  //download

  let fileName = moment(Date()).format("DD/MM/YYYY");
  const headers = [
    { label: "USER_ID", key: "USER_ID" },
    { label: "SUPPLIER_NAME", key: "SUPPLIER_NAME" },
    { label: "REGISTRATION_ID", key: "REGISTRATION_ID" },
    { label: "BUYER_ID", key: "BUYER_ID" },
    { label: "MOBILE_NUMBER", key: "MOBILE_NUMBER" },
    { label: "EMAIL_ADDRESS", key: "EMAIL_ADDRESS" },
    {
      label: "TRADE_OR_EXPORT_LICENSE_END_DATE",
      key: "TRADE_OR_EXPORT_LICENSE_END_DATE",
    },
    { label: "TAX_RTN_ASSMNT_YEAR", key: "TAX_RTN_ASSMNT_YEAR" },
  ];

  //download

  return (
    <div className=" m-8">
      <SuccessToast />
      <div className=" flex flex-col  items-start">
        <PageTitle titleText="Supplier List" />
        {/* <NavigationPan list={pan} /> */}
      </div>
      <div className="h-5"></div>

      <div className=" space-y-4">
        <div className=" w-full flex justify-between items-center">
          {/* left */}
          <div className=" flex-1 flex space-x-4 items-center">
            <div className=" w-44">
              {" "}
              <InputLebel titleText={"Supplier Org"} />
            </div>

            <CommonDropDownSearch
              width="w-72"
              placeholder="Search Here"
              onChange={handleOrgChange}
              value={convertedOrg}
              options={convertedOrgList}
              disable={true}
            />
          </div>
          {/* left */}

          <div className=" w-20"></div>

          {/* right */}
          <div className=" flex-1 flex space-x-4 items-center">
            {/* {selectedOrgId === "" ? null : (
            )} */}
            <>
              <div className=" w-32">
                <InputLebel titleText={"Supplier Type"} />
              </div>

              <div className="z-30 w-64">
                <CommonDropDownSearch
                  width="w-full"
                  placeholder="Search Here"
                  onChange={handleCatChange}
                  value={category}
                  options={converCategoryList!}
                />
              </div>
            </>
          </div>
          {/* right */}
        </div>

        <div className="  flex flex-row items-center  justify-between">
          <div className="  flex-1 flex space-x-3 items-center">
            <div className="  w-[130px] ">
              <InputLebel titleText={"Search Supplier"} />
            </div>

            <CommonSearchField
              onChangeData={handlesupplierSearchValChange}
              search={searchSupplier}
              placeholder="Search Here"
              inputRef={supplierSearchValRef}
              width="w-72"
            />
          </div>
          {supplierList.length === 0 ? null : (
            <CSVLink
              data={supplierList!}
              headers={headers}
              filename={`supplier_list_${fileName}.csv`}
            >
              <div className=" exportToExcel ">Export to Excel</div>
            </CSVLink>
          )}
        </div>
      </div>
      <div className="h-5"></div>

      <div
        className="rounded-xl"
        style={{
          boxShadow:
            "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -2px",
        }}
      >
        {isLoading ? (
          <div className=" w-full flex justify-center items-center">
            <LogoLoading />
          </div>
        ) : !isLoading && supplierList.length === 0 ? (
          <NotFoundPage />
        ) : (
          <>
            <div className="overflow-auto max-h-[400px] rounded-lg custom-scrollbar">
              <table
                className="min-w-full divide-y divide-gray-200 border-[0.2px] border-borderColor rounded-md"
                style={{ tableLayout: "fixed" }}
              >
                <thead className="bg-[#CAF4FF] sticky top-0 h-14 z-20">
                  <tr>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      <button
                        onClick={() => {
                          isSelectedAll ? unselectAll() : selectAll();
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
                      SL
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      Image
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      Supplier Name
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      Supplier ID
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      Award Times
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      Last Award Date
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      Supplier Site
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      Email
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      Additional Contact Mail
                    </th>
                  </tr>
                </thead>

                {supplierList.map((e, index) => (
                  <tbody
                    key={e.USER_ID}
                    className="bg-white divide-y divide-gray-200"
                  >
                    <tr>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          <button
                            onClick={() => {
                              toggleprSupplierSelection(e, index);
                            }}
                            className={`${
                              selectedSupplierList.some(
                                (emp) => emp.USER_ID === e.USER_ID
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
                          {/* {index + 1} */}
                          {offset + index}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 h-14 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full h-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                          <div className="w-full h-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                            {e.PROFILE_PIC1_FILE_NAME === "" ? (
                              <div className="w-9 h-9 rounded-full border-[1px] border-gray-400 flex items-center justify-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-5 h-5"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                                  />
                                </svg>
                              </div>
                            ) : (
                              <div className="w-10 h-10 flex items-center justify-center border-[1px] border-gray-300 rounded-full">
                                <img
                                  // src={`${profilePicPath}/${e.PROFILE_PIC1_FILE_NAME}`}
                                  src={imageUrls[e.USER_ID]!}
                                  alt="avatar"
                                  className="h-9 w-9 rounded-full bg-cover"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          <p>
                            {e.SUPPLIER_NAME === "" ? "N/A" : e.SUPPLIER_NAME}
                          </p>
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {!e.REGISTRATION_ID === null
                            ? "---"
                            : e.REGISTRATION_ID}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {!e.TOTAL_PO === null ? "---" : e.TOTAL_PO}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {/* N/A */}
                          {e.PO_DATE === "" ? "---" : isoToDateTime(e.PO_DATE)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="w-full text-center z-10">
                          {/* {e.SITES?.length ? (
                            <CommonDropDownSearch
                              width="w-60"
                              placeholder="Select site"
                              onChange={(value) =>
                                handleSiteChange(value, index, e)
                              }
                              value={selectedSite[index] || null}
                              options={e.SITES.map((site) => ({
                                label: site.ADDRESS_LINE1,
                                value: site.SITE_ID,
                              }))}
                              // disable={true}
                            />
                          ) : (
                            <p>No sites available</p>
                          )} */}

                          {e.SITES?.length ? (
                            <>
                              {e.SITES.length === 1
                                ? // Auto-select the only available site
                                  (() => {
                                    const singleSite = {
                                      label: e.SITES[0].ADDRESS_LINE1,
                                      value: e.SITES[0].SITE_ID,
                                    };
                                    if (!selectedSite[index]) {
                                      // Auto select the site if not already selected
                                      handleSiteChange(singleSite, index, e);
                                    }
                                    return null;
                                  })()
                                : null}
                              <CommonDropDownSearch
                                width="w-60"
                                placeholder="Select site"
                                onChange={(value) =>
                                  handleSiteChange(value, index, e)
                                }
                                value={selectedSite[index] || null}
                                options={e.SITES.map((site) => ({
                                  label: site.ADDRESS_LINE1,
                                  value: site.SITE_ID,
                                }))}
                                // disable={true}
                              />
                            </>
                          ) : (
                            <p>No sites available</p>
                          )}
                        </div>
                      </td>
                      <td className=" px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="w-full text-center z-10">
                          {/* {e.CONTACT?.length ? (
                            <CommonDropDownSearch
                              width="w-60"
                              placeholder="Select contact"
                              onChange={(value) =>
                                handleContactChange(value, index, e)
                              }
                              value={selectedContact[index] || null}
                              options={e.CONTACT.map((contact) => ({
                                label: contact.NAME,
                                value: contact.ID,
                                mail: contact.EMAIL,
                              }))}
                             
                            />
                          ) : (
                            <p>No contact available</p>
                          )} */}

                          {e.CONTACT?.length ? (
                            <>
                              {e.CONTACT.length === 1
                                ? // Auto-select the only available contact
                                  (() => {
                                    const singleContact = {
                                      label: e.CONTACT[0].NAME,
                                      value: e.CONTACT[0].ID,
                                      mail: e.CONTACT[0].EMAIL,
                                    };
                                    if (!selectedContact[index]) {
                                      // Auto select the contact if not already selected
                                      handleContactChange(
                                        singleContact,
                                        index,
                                        e
                                      );
                                    }
                                    return null;
                                  })()
                                : null}
                              <CommonDropDownSearch
                                width="w-60"
                                placeholder="Select contact"
                                onChange={(value) =>
                                  handleContactChange(value, index, e)
                                }
                                value={selectedContact[index] || null}
                                options={e.CONTACT.map((contact) => ({
                                  label: contact.NAME,
                                  value: contact.ID,
                                  mail: contact.EMAIL,
                                }))}
                                // disable={true}
                              />
                            </>
                          ) : (
                            <p>No contact available</p>
                          )}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {e.EMAIL_ADDRESS === "" ? "---" : e.EMAIL_ADDRESS}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          <CommonInputField
                            height="h-8"
                            type="text"
                            width="w-56"
                            hint="sample@gmail.com"
                            onChangeData={(value) =>
                              handleAdditionalEmailChange(value, index)
                            }
                            inputRef={{
                              current: additionalEmailRef.current[index],
                            }}
                            value={additionalEmailList[index]}
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                ))}

                {/* <tfoot className="bg-white sticky bottom-0">
                  <tr>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
                  </tr>
                </tfoot> */}
              </table>
            </div>

            <div className="bg-white sticky bottom-0 w-full flex items-center justify-between px-6 mt-4">
              <div className="w-1/4">
                {pageNo !== 1 && (
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
                    <p className=" text-[12px]">Previous</p>
                  </button>
                )}
              </div>

              <div className="flex-grow flex justify-center space-x-2">
                {renderPageNumbers()}
              </div>

              <div className="w-1/4 flex justify-end">
                {pageNo !== total && (
                  <button
                    // disabled={pageNo === total ? true : false}
                    onClick={next}
                    className=" px-4 py-2 rounded-md flex space-x-2 items-center shadow-md border-[0.5px] border-borderColor "
                    style={{
                      boxShadow:
                        "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
                    }}
                  >
                    <p className=" text-[12px]">Next</p>
                    <div className="w-4 h-4 ">
                      <ArrowRightIcon className=" w-full h-full " />
                    </div>
                  </button>
                )}
              </div>
            </div>
            <div className=" h-4"></div>
          </>
        )}
      </div>

      <div className="h-7"></div>

      <div className=" flex flex-row justify-end space-x-6 items-center">
        <CommonButton
          onClick={previousPage}
          titleText={"Previous"}
          width="w-36"
          height="h-8"
          color="bg-graishColor"
        />
        {supplierList.length === 0 ? null : (
          <button
            onClick={reset}
            className=" w-36 h-8 bg-whiteColor text-sm font-bold font-mon text-graishColor rounded-md border-[2px] border-graishColor"
          >
            Reset
          </button>
        )}
        <CommonButton
          onClick={addSupplier}
          titleText={"Continue"}
          width="w-36"
          height="h-8"
          color="bg-midGreen"
        />
      </div>
      <div className=" h-20"></div>
    </div>
  );
}
