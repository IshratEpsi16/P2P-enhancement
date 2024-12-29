import React, { useEffect, useState } from "react";
import PageTitle from "../../../common_component/PageTitle";
import SuccessToast, {
  showSuccessToast,
} from "../../../Alerts_Component/SuccessToast";
import ErrorToast, {
  showErrorToast,
} from "../../../Alerts_Component/ErrorToast";
import PaymentMethodListService from "../../service/setup/PaymentMethodListService";
import { useAuth } from "../../../login_both/context/AuthContext";
import { Item } from "@radix-ui/react-select";
import InputLebel from "../../../common_component/InputLebel";
import CommonDropDownSearch from "../../../common_component/CommonDropDownSearch";
import SupplierPaymentMethodService from "../../service/setup/SupplierPaymentMethodService";
import CommonButton from "../../../common_component/CommonButton";
import AddPaymentMethodService from "../../service/setup/AddPaymentMethodService";
import CircularProgressIndicator from "../../../Loading_component/CircularProgressIndicator";
import LogoLoading from "../../../Loading_component/LogoLoading";
import SupplierCategoryListService from "../../service/setup/SupplierCategoryListService";
import SupplierCategoryInterface from "../../interface/setup/SupplierCategoryInterface";
import AddCategoryToSupplierService from "../../service/setup/AddCategoryToSupplierService";
import SupplierSiteInterface from "../../../registration/interface/SupplierSiteInterface";
import SiteListViewForApprovalService from "../../service/site/SiteListViewForApprovalService";
import CheckIcon from "../../../icons/CheckIcon";
import AddRfqPayablePurchasingService from "../../service/setup/AddRfqPayablePurchasingService";
import SearchIcon from "../../../icons/SearchIcon";

interface PaymentMethodInterface {
  PAYMENT_METHOD_CODE: string;
  PAYMENT_METHOD_NAME: string;
  DESCRIPTION: string;
}

interface PaymentMethod {
  value: string;
  label: string;
}
interface TransfromedCategory {
  value: string;
  label: string;
}

export default function SetupFromBuyerPage() {
  const { token, supplierId } = useAuth();

  useEffect(() => {
    getPaymentMethodList();
    supplierPaymentMethodGet();
    getCategories();
    getExistingalist();
  }, []);

  //category get
  // const [categoryList,setCategoryList]=useState<TransfromedCategory[] | []>([]);
  // const [viewCategoryList,setViewCategoryList]=useState< null>(null);
  // const [selectedCategoryList,setSelectedCategoryList]=useState<TransfromedCategory[] | null>(null);
  // const [selectedCategoryList2,setSelectedCategoryList2]=useState<TransfromedCategory[] | null>(null);

  // const handleCategoryChange = (value: any) => {
  //     // console.log("value:", value);
  //     setViewCategoryList(value);
  //     if (value !== null) {
  //         setSelectedCategoryList(value);
  //         console.log(value);

  //     }
  //     else if (value == null && viewCategoryList != null) {
  //         setSelectedCategoryList([]);
  //         console.log('cleared');

  //     }

  // };

  // const transformedData=result.data.data.map((item:SupplierCategoryInterface)=>(
  //     {
  //         value:item.ORG_ID,
  //         label:item.VENDOR_LIST_NAME
  //     }
  // ));
  // setCategoryList(transformedData);

  const [categoryList, setCategoryList] = useState<
    SupplierCategoryInterface[] | []
  >([]);
  const [categoryList2, setCategoryList2] = useState<
    SupplierCategoryInterface[] | []
  >([]);
  const [selectedCategoryList, setSelectedCategoryList] = useState<
    SupplierCategoryInterface[] | []
  >([]);
  const [selectedCategoryList2, setSelectedCategoryList2] = useState<
    SupplierCategoryInterface[] | []
  >([]);

  //org grant revoke

  // org grant revoke
  const handleGrantRevokeCategory = (orgIndex: number) => {
    const updatedCategoryList = [...categoryList];
    updatedCategoryList[orgIndex].STATUS =
      updatedCategoryList[orgIndex].STATUS === 1 ? 0 : 1;
    setCategoryList(updatedCategoryList);
    const updatedSelectedOrgList = updatedCategoryList.filter(
      (org) => org.STATUS === 1
    );

    // Remove elements from selectedOrgList that are also in preSelectedOrgList
    // const filteredSelectedOrgList = updatedSelectedOrgList.filter(org =>
    //     !preSelectedOrgList.some(preSelectedOrg => preSelectedOrg.ORGANIZATION_ID === org.ORGANIZATION_ID)
    // );

    setSelectedCategoryList(updatedSelectedOrgList);
    // setPreSelectedOrgList(updatedSelectedOrgList);
  };

  const addOrgToSelectedCategorylist = async (
    cat: SupplierCategoryInterface
  ) => {
    console.log(cat.STATUS);

    try {
      const result = await AddCategoryToSupplierService(
        token!,
        cat.ID,
        supplierId!,
        cat.ORG_ID,
        cat.VENDOR_LIST_NAME,
        cat.STATUS
      );
      if (result.data.status === 200) {
        showSuccessToast(result.data.message);
        // getCategories();
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Something went wrong");
    }

    // setSelectedCategoryList2(prevState => [...prevState, cat]);
  };

  const getCategories = async () => {
    console.log(supplierId);

    try {
      const result = await SupplierCategoryListService(token!, supplierId!);
      if (result.data.status === 200) {
        setCategoryList(result.data.data);
        setCategoryList2(result.data.data);
      }
    } catch (error) {
      showErrorToast("Somthing Went Wrong");
    }
  };

  //payment method
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentMethodList, setPaymentMethodList] = useState<
    PaymentMethod[] | []
  >([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null
  );
  const [selectedpamentMethod, setSelectedPaytmentMethod] =
    useState<string>("");

  const getPaymentMethodList = async () => {
    try {
      setIsLoading(true);
      const result = await PaymentMethodListService(token!);
      if (result.data.status === 200) {
        const transformedData = result.data.data.map(
          (item: PaymentMethodInterface) => ({
            value: item.PAYMENT_METHOD_CODE,
            label: item.PAYMENT_METHOD_NAME,
          })
        );
        setPaymentMethodList(transformedData);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      showErrorToast("something went wrong");
    }
  };

  const [supplierPaymentMethodData, setSupplierPaymentMethodData] =
    useState<PaymentMethodInterface | null>(null);

  const supplierPaymentMethodGet = async () => {
    try {
      const result = await SupplierPaymentMethodService(token!, supplierId!);
      if (result.data.status === 200) {
        setSupplierPaymentMethodData(result.data.data);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Something went wrong");
    }
  };

  useEffect(() => {
    if (paymentMethodList && supplierPaymentMethodData) {
      setData();
    }
  }, [paymentMethodList, supplierPaymentMethodData]);

  const setData = () => {
    if (paymentMethodList && supplierPaymentMethodData) {
      const found = paymentMethodList.find(
        (item: PaymentMethod) =>
          item.value === supplierPaymentMethodData.PAYMENT_METHOD_CODE
      );
      if (found != null || found !== undefined) {
        setPaymentMethod(found);
        setSelectedPaytmentMethod(found.value);
      }
    }
  };

  const handlePaymentMethodChange = (value: any) => {
    // console.log("value:", value);
    setPaymentMethod(value);
    if (value !== null) {
      setSelectedPaytmentMethod(value.value);
      // getBank(value.value);
    } else if (value == null && paymentMethodList != null) {
      setSelectedPaytmentMethod("");
      console.log("cleared");
    }
  };

  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const submit = async () => {
    try {
      setIsSubmitLoading(true);
      const result = await AddPaymentMethodService(
        token!,
        supplierId!,
        selectedpamentMethod
      );
      if (result.data.status === 200) {
        setIsSubmitLoading(false);
        showSuccessToast(result.data.message);
        getPaymentMethodList();
        supplierPaymentMethodGet();
      } else {
        setIsSubmitLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsSubmitLoading(false);
      showErrorToast("Something went wrong");
    }
  };

  //get exsiting list
  const [siteList, setSiteList] = useState<SupplierSiteInterface[] | []>([]);

  //  // org grant revoke
  //  const handleGrantRevokeSite = (siteIndex: number) => {
  //     const updatedSiteList = [...siteList];
  //     updatedSiteList[siteIndex].RFQ = updatedSiteList[siteIndex].RFQ === null ? 1 : null;
  //     setCategoryList(updatedSiteList);
  //     const updatedSelectedOrgList = updatedCategoryList.filter(org => org.STATUS === 1);

  //     // Remove elements from selectedOrgList that are also in preSelectedOrgList
  //     // const filteredSelectedOrgList = updatedSelectedOrgList.filter(org =>
  //     //     !preSelectedOrgList.some(preSelectedOrg => preSelectedOrg.ORGANIZATION_ID === org.ORGANIZATION_ID)
  //     // );

  //     setSelectedCategoryList(updatedSelectedOrgList);
  //     // setPreSelectedOrgList(updatedSelectedOrgList);
  // }

  const getExistingalist = async () => {
    try {
      setIsLoading(true);
      const result = await SiteListViewForApprovalService(token!, supplierId!);
      if (result.data.status === 200) {
        setIsLoading(false);
        setSiteList(result.data.data);
        // setSiteLength(result.data.data.length);
      } else {
        setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      showErrorToast("Something went wrong");
    }
  };
  const toggleValue = (index: number, key: string) => {
    const updatedList = [...siteList];
    updatedList[index][key] = updatedList[index][key] === "N" ? "Y" : "N";
    console.log(updatedList[index]);
    addRfqPayablePurchasing(updatedList[index]);

    setSiteList(updatedList);
  };

  const addRfqPayablePurchasing = async (
    updatedIndex: SupplierSiteInterface
  ) => {
    try {
      const result = await AddRfqPayablePurchasingService(
        token!,
        updatedIndex.ID,
        updatedIndex.RFQ!,
        updatedIndex.PAYABLE!,
        updatedIndex.PURCHASING!
      );
      if (result.data.status === 200) {
        showSuccessToast(result.data.message);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("something went wrong");
    }
  };

  const handleMenuChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value !== null) {
      const menus = categoryList2.filter((menu) =>
        menu.VENDOR_LIST_NAME.toLowerCase().includes(value)
      );
      setCategoryList(menus);
    } else {
      setCategoryList(categoryList2);
    }
  };

  return (
    <div className="  bg-white">
      <SuccessToast />
      {/* <PageTitle titleText='Setup Page'/> */}
      {isLoading ? (
        <div className=" w-full flex justify-center items-center">
          <LogoLoading />
        </div>
      ) : (
        <>
          <div className=" w-full flex justify-between items-start">
            <div className=" w-96 flex flex-col items-start space-y-2">
              <InputLebel titleText={"Payment Method"} />
              <CommonDropDownSearch
                placeholder="Select Method"
                onChange={handlePaymentMethodChange}
                value={paymentMethod}
                options={paymentMethodList}
                width="w-96"
              />
            </div>
          </div>

          <div className=" h-10"></div>
          <div className=" w-full flex justify-between items-center">
            <p className="  font-semibold">Select Category</p>
            <div className=" flex flex-row w-64 space-x-[2px] mb-2 ring-1 h-10 ring-borderColor rounded-md  items-center pl-[4px] bg-white">
              <SearchIcon />

              <input
                onChange={handleMenuChange}
                className=" w-full px-1 focus:outline-none bg-white"
              />
            </div>
          </div>
          <div className=" h-4"></div>
          <div className=" w-full grid grid-cols-3 gap-6 items-center">
            {categoryList.map((e, i) => (
              <div className=" flex flex-row space-x-2 items-center w-48 px-1   ">
                <button
                  // disabled={isDisable}
                  onClick={() => {
                    // handleGrantRevokeOrganization(i);
                    // addOrgToSelectedSitelist(e);
                    handleGrantRevokeCategory(i);
                    addOrgToSelectedCategorylist(e);
                  }}
                  className={`w-4 h-4 rounded-md
                                    ${
                                      e.STATUS === 1
                                        ? "bg-midGreen border-none"
                                        : " border-[0.5px] border-borderColor bg-whiteColor"
                                    }
                                     flex justify-center items-center   `}
                >
                  {
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-3 h-3 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  }
                </button>
                <p className=" text-blackColor text-sm font-mon font-medium text-start flex-1">
                  {e.VENDOR_LIST_NAME}({e.NAME})
                </p>
              </div>
            ))}
          </div>
          <div className=" h-10"></div>

          <p className="  font-semibold">P2P Cycle</p>

          {siteList.map((e, i) => (
            <div className=" w-full flex justify-between items-center my-4 ">
              <p className=" mediumText w-64">
                {i + 1}. {e.ADDRESS_LINE1}
              </p>
              <div className=" w-56"></div>
              <div className=" flex-1 flex justify-center items-start space-x-3">
                <button
                  className=" flex space-x-2 items-center"
                  onClick={() => toggleValue(i, "RFQ")}
                >
                  <div
                    className={`flex h-4 w-4 items-center justify-center ${
                      e.RFQ === "N"
                        ? "border-[1px] border-borderColor bg-white"
                        : "border-none bg-midGreen"
                    } rounded-[4px]`}
                  >
                    <CheckIcon className=" text-white" />
                  </div>
                  <p className="smallText">RFQ</p>
                </button>
                <button
                  className=" flex space-x-2 items-center"
                  onClick={() => toggleValue(i, "PAYABLE")}
                >
                  <div
                    className={`flex h-4 w-4 items-center justify-center ${
                      e.PAYABLE === "N"
                        ? "border-[1px] border-borderColor bg-white"
                        : "border-none bg-midGreen"
                    } rounded-[4px]`}
                  >
                    <CheckIcon className=" text-white" />
                  </div>
                  <p className="smallText">PAYABLE</p>
                </button>
                <button
                  className=" flex space-x-2 items-center"
                  onClick={() => toggleValue(i, "PURCHASING")}
                >
                  <div
                    className={`flex h-4 w-4 items-center justify-center ${
                      e.PURCHASING === "N"
                        ? "border-[1px] border-borderColor bg-white"
                        : "border-none bg-midGreen"
                    } rounded-[4px]`}
                  >
                    <CheckIcon className=" text-white" />
                  </div>
                  <p className="smallText">PURCHASING</p>
                </button>
              </div>
            </div>
          ))}

          <div className=" w-full flex justify-end items-end my-10">
            {isSubmitLoading ? (
              <div className=" w-32 flex justify-center items-center">
                <CircularProgressIndicator />
              </div>
            ) : (
              <CommonButton
                titleText="Save"
                onClick={submit}
                width="w-32"
                height="h-8"
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
