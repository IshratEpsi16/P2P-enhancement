import React, { useRef, useState, useEffect } from "react";
import InputLebel from "../../common_component/InputLebel";
import CommonInputField from "../../common_component/CommonInputField";
import CommonButton from "../../common_component/CommonButton";

import Select from "react-tailwindcss-select";
import CommonDropDownSearch from "../../common_component/CommonDropDownSearch";
import SendInvitationService from "../service/SendInvitationService";
import SuccessModal from "../../common_component/SuccessModal";
import { useNavigate } from "react-router-dom";
import ErrorModal from "../../common_component/ErrorModal";
import { useAuth } from "../../login_both/context/AuthContext";
import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";
import ErrorToast, { showErrorToast } from "../../Alerts_Component/ErrorToast";
import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";
import ValidationError from "../../Alerts_Component/ValidationError";

import ItemCategoryinterface from "../../registration/interface/CategoryInterface";
import ItemCategoryListServiceService from "../../registration/service/basic_info/ItemCategoryListService";
import convertKeysToLowerCase from "../../utils/methods/convertKeysToLowerCase";

const options = [
  { value: "Hardware", label: "Hardware" },
  { value: "Mechanical", label: "Mechanical" },
  { value: "Electronic", label: "Electronic" },
];
export default function InvitationPage() {
  const supplierNameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const mobileNoRef = useRef<HTMLInputElement | null>(null);

  const [email, setEmail] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [itemCategory, setItemCategory] =
    useState<ItemCategoryinterface | null>(null);

  const [categoryList, setCategoryList] = useState<
    ItemCategoryinterface[] | []
  >([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [mobileNo, setMobileNo] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inviteError, setInviteError] = useState<{
    supplierName?: string;
    email?: string;
    categoryId?: string;
    mobileNo?: string;
  }>({});
  const [btn, setBtn] = useState<number>(1);
  const navigate = useNavigate();

  const { token, bgId } = useAuth();

  console.log("render outside");

  //validation
  const validateInvite = () => {
    const errors: {
      supplierName?: string;
      email?: string;
      categoryId?: string;
      mobileNo?: string;
    } = {};

    if (!email.trim()) {
      errors.email = "Please Enter Email";
    }
    if (!supplierName.trim()) {
      errors.supplierName = "Please Enter Supplier Name";
    }
    if (!mobileNo.trim()) {
      errors.mobileNo = "Please Enter mobile number";
    }
    // if (categoryId === '') {
    //     errors.categoryId = 'Please Select Category';
    // }

    setInviteError(errors);

    return Object.keys(errors).length === 0;
  };

  // item category change
  const [categoryId, setCategoryId] = useState("");
  const handleChange = (value: any) => {
    // console.log("value:", value);
    setItemCategory(value);
    // setCategory(value.value);
    if (value !== null) {
      console.log(value.value);

      setCategoryId(value.value);
    } else if (value == null && categoryId != null) {
      setCategoryId("");
      console.log("cleared");
    }
  };

  // item category change

  const handleSupplierNameChange = (value: string) => {
    setSupplierName(value);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    console.log(email);
  };

  const handleMobileNo = (value: string) => {
    setMobileNo(value);
  };

  const sendInvitation = async () => {
    if (validateInvite()) {
      setIsLoading(true);
      const result = await SendInvitationService(
        token!,
        supplierName,
        email,
        categoryId,
        mobileNo,
        bgId!
      );
      console.log(result.statusCode);
      console.log(result.data.message);
      if (result.data.status === 200) {
        setIsLoading(false);
        clearData();
        showSuccessToast(result.data.message);
      } else {
        showErrorToast(result.data.message);
        setIsLoading(false);
      }
    } else {
      console.log("validation failed");
    }
  };

  //get Category

  const [isCategoryLoading, setIsCategoryLoading] = useState<boolean>(false);

  //first time category call

  useEffect(() => {
    console.log(bgId);

    getCategoryList();
  }, []);

  const getCategoryList = async () => {
    setIsCategoryLoading(true);

    try {
      const result = await ItemCategoryListServiceService(token!);
      console.log(result.data.data);
      if (result.data.status === 200) {
        const LowerKeys = convertKeysToLowerCase(result.data.data);
        setCategoryList(LowerKeys);
        setIsCategoryLoading(false);
      } else {
        setIsCategoryLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsCategoryLoading(false);
      showErrorToast("Something went wrong");
    }
  };

  const clearData = () => {
    setSupplierName("");
    setEmail("");
    setMobileNo("");
    setItemCategory(null);
    setCategoryId("");
    if (supplierNameRef.current && emailRef.current) {
      supplierNameRef.current.value = "";
      emailRef.current.value = "";
      if (mobileNoRef.current) {
        mobileNoRef.current.value = "";
      }
    }
  };

  return (
    <div className="w-full   flex justify-center items-center">
      <SuccessToast />

      <div className=" flex flex-col items-start">
        <div className=" flex flex-col items-start space-y-1 mb-6">
          <h3 className=" text-3xl font-bold text-blackColor font-mon">
            Supplier Invitation
          </h3>
        </div>
        <div className=" flex flex-col items-start space-y-4">
          <div className=" flex flex-col items-start space-y-2">
            <InputLebel titleText="Supplier Name" />
            <CommonInputField
              inputRef={supplierNameRef}
              onChangeData={handleSupplierNameChange}
              hint="Supplier Name"
              type="text"
            />
            {inviteError.supplierName && (
              <ValidationError title={inviteError.supplierName} />
            )}
          </div>
          <div className=" flex flex-col items-start space-y-2">
            <InputLebel titleText="Mail Address" />
            <CommonInputField
              inputRef={emailRef}
              onChangeData={handleEmailChange}
              hint="Supplier Email"
              type="text"
            />
            {inviteError.email && <ValidationError title={inviteError.email} />}
          </div>
          <div className=" flex flex-col items-start space-y-2">
            <InputLebel titleText="Mobile No" />
            <CommonInputField
              inputRef={mobileNoRef}
              onChangeData={handleMobileNo}
              hint="Mobile No"
              type="number"
            />
            {inviteError.mobileNo && (
              <ValidationError title={inviteError.mobileNo} />
            )}
          </div>

          <div className=" mt-2"></div>

          {isLoading ? (
            <div className=" w-full flex justify-center items-center">
              <CircularProgressIndicator />
            </div>
          ) : (
            <CommonButton
              titleText="Send Invitation"
              onClick={sendInvitation}
              color="bg-shinyBlackColor"
              height="h-10"
            />
          )}
        </div>
        <div className="h-4"></div>
      </div>
    </div>
  );
}
