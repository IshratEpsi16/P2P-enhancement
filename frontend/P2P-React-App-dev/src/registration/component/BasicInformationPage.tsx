import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

import InputLebel from "../../common_component/InputLebel";
import CommonInputField from "../../common_component/CommonInputField";
import CommonButton from "../../common_component/CommonButton";
import CommonDropDownSearch from "../../common_component/CommonDropDownSearch";

import { SupplierBasicInfoInterface } from "../interface/RegistrationInterface";

import GetBasicInformationService from "../service/basic_info/GetBasicInfoService";
import LogoLoading from "../../Loading_component/LogoLoading";

import { useAuth } from "../../login_both/context/AuthContext";

import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";

import ErrorToast, { showErrorToast } from "../../Alerts_Component/ErrorToast";
import AddUpdateBasicInformationService from "../service/basic_info/AddUpdateBasicInfoService";
import { isTokenValid } from "../../utils/methods/TokenValidityCheck";

import { useNavigate } from "react-router-dom";
import ValidationError from "../../Alerts_Component/ValidationError";
import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";

import ItemCategoryinterface from "../interface/CategoryInterface";
import ItemCategoryListServiceService from "../service/basic_info/ItemCategoryListService";
import convertKeysToLowerCase from "../../utils/methods/convertKeysToLowerCase";
import countryListWithvalue from "../../jsons/countryListWithCode";
import SupplierCategoryListService from "../../manage_supplier/service/setup/SupplierCategoryListService";
import SupplierCategoryInterface from "../../manage_supplier/interface/setup/SupplierCategoryInterface";
import CountryListFromOracleService from "../service/basic_info/CountryListFromOracle";
import OrganizationListService from "../../role_access/service/OrganizationListService";
import OrganizationTypeService from "../service/basic_info/OrganizationTypeService";
import useRegistrationStore from "../store/registrationStore";
import ProfileUpdateSubmissionService from "../service/profile_update_submission/ProfileUpdateSubmissionService";
import WarningModal from "../../common_component/WarningModal";

interface Country {
  value: string;
  label: string;
}

interface CountryFromOracle {
  value: string;
  label: string;
}

interface CountryApi {
  VALUE: string;
  LABEL: string;
}
interface OrganizationApi {
  VALUE: string;
  LABEL: string;
}

const bd: Country = { value: "BD", label: "Bangladesh" };

const BasicInformationPage: React.FC = () => {
  const organizationNameRef = useRef<HTMLInputElement | null>(null);
  const addressRef = useRef<HTMLInputElement | null>(null);

  const [itemCategory, setItemCategory] =
    useState<ItemCategoryinterface | null>(null);

  const [categoryList, setCategoryList] = useState<
    ItemCategoryinterface[] | []
  >([]);

  const [basicInfo, setBasicInfo] = useState<SupplierBasicInfoInterface | null>(
    null
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  //disabling field
  const [isDisable, setIsDisable] = useState<boolean>(false);
  //disabling field

  console.log("render after entering a letter in common input field");

  //org name

  const [organizationName, setOrganizationName] = useState("");

  // const handleOrganizationNameChange = useMemo(
  //   () => (value: string) => {
  //     setOrganizationName(value);
  //   },
  //   []
  // );

  const handleOrganizationNameChange = (value: string) => {
    setOrganizationName(value);
  };

  //org name

  //address
  const [address, setAddress] = useState("");
  const handleAddressChange = (value: string) => {
    setAddress(value);
  };

  //address

  //store

  const setGlobalIncorporatedIn = useRegistrationStore(
    (state) => state.setGlobalIncorporatedIn
  );

  //store

  //countries

  const [countryList, setCountryList] = useState<Country | null>(null);
  //  const [country, setCountry] = useState('');

  const [countryListFromOracle, setCountryListFromOracle] = useState<Country[]>(
    []
  );

  const countryGet = async () => {
    try {
      const result = await CountryListFromOracleService(regToken!);
      console.log(result.data);

      if (result.data.status === 200) {
        const transformedData = result.data.data.map((item: CountryApi) => ({
          value: item.VALUE,
          label: item.LABEL,
        }));

        // const findBd = transformedData.find((f: any) => f.value === "BD");
        // console.log(findBd);
        // setIncorporatedInU(findBd.label);
        // setCountryList(findBd);
        // console.log(bd.label);

        setCountryListFromOracle(transformedData);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Something went wrong");
    }
  };

  // useEffect(() => {
  //   if (countryListFromOracle.length > 0) {
  //     setBd();
  //   }
  // }, [countryListFromOracle]);

  // const setBd = () => {
  //   const findBd = countryListFromOracle.find(
  //     (item: Country) => item.value === "BD"
  //   );
  //   console.log(findBd);
  //   if (findBd) {
  //     setCountryList(findBd);
  //     setIncorporatedIn(findBd.label);
  //     setGlobalIncorporatedIn(findBd.label.toString());
  //   } else {
  //     setCountryList(null);
  //   }
  // };

  const handleCountryChange = (value: any) => {
    // console.log("value:", value);
    setCountryList(value);
    if (value !== null) {
      setIncorporatedInU(value.label);
      setGlobalIncorporatedIn(value.label.toString());
      console.log(value.value);
    } else if (value == null && incorporatedInU != null) {
      setIncorporatedInU("");
      console.log("cleared");
    }
  };

  const [organizationList, setOrganizationList] = useState<
    OrganizationApi[] | []
  >([]);

  const organizationGet = async () => {
    try {
      const result = await OrganizationTypeService(regToken!);
      console.log(result.data);

      if (result.data.status === 200) {
        setOrganizationList(result.data.data);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Something went wrong");
    }
  };

  //countries

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

  //token get and submission status
  const {
    regToken,
    token,
    submissionStatus,
    setSubmissionStatus,
    setSupplierCountryCode,
    isRegCompelte,
    userId,
  } = useAuth();
  //token get and submission status

  //org type selction
  const [selectedOrgTypeId, setSelectedOrgTypeId] = useState<string>("");

  const handleSelectedOrgTypeIdChange = (event: any) => {
    setSelectedOrgTypeId(event.target.id);
    // console.log(event.target.id);
  };

  //org type selction

  //incorportated in

  const [incorporatedInU, setIncorporatedInU] = useState<string>("");

  // const handleIncorporatedInChange = (event: any) => {
  //   setIncorporatedIn(event.target.value);
  //   // console.log(event.target.value);
  // };

  //incorportated in

  //set disable

  useEffect(() => {
    console.log(submissionStatus);

    if (submissionStatus === "DRAFT") {
      setIsDisable(false);
      console.log("no lock");
    } else {
      setIsDisable(true);
      console.log("called lock");
    }
  }, [submissionStatus]);

  // //set disable

  // //first time api call to get basic info
  // useEffect(() => {
  //     console.log('submission', submissionStatus);

  //     getBasicInfoDetails();

  // }, []);

  //token validation
  useEffect(() => {
    console.log(submissionStatus);
    console.log(regToken);

    const isTokenExpired = !isTokenValid(regToken!);
    if (isTokenExpired) {
      localStorage.removeItem("regToken");
      showErrorToast("Please Login Again..");
      setTimeout(() => {
        navigate("/");
      }, 1200);
    } else {
      // setCountryList(bd);
      // console.log(bd.label);
      // setIncorporatedIn("Bangladesh");
      // if (!basicInfo) {

      // }

      getCategoryList();
      getBasicInfoDetails();
      getCategories();

      // countryGet();
      organizationGet();
    }
  }, []);
  //token validation

  //category
  const [supplierCategoryList, setSupplierCategoryList] = useState<
    SupplierCategoryInterface[] | []
  >([]);
  const [supplierSelectedCategoryList, setSupplierSelectedCategoryList] =
    useState<SupplierCategoryInterface[] | []>([]);

  const getCategories = async () => {
    console.log(userId);

    try {
      const result = await SupplierCategoryListService(regToken!, userId!);
      if (result.data.status === 200) {
        setSupplierCategoryList(result.data.data);
        const selected = result.data.data.filter(
          (item: SupplierCategoryInterface) => item.STATUS === 1
        );
        setSupplierSelectedCategoryList(selected);
      }
    } catch (error) {
      showErrorToast("Somthing Went Wrong");
    }
  };

  // re-render based on basic info change to show setted data on field
  useEffect(() => {
    if (basicInfo) {
      setData();
    }
  }, [basicInfo, categoryList, countryListFromOracle]);

  //actual method to get basic info
  // let info: SupplierBasicInfoInterface | null = null;
  const getBasicInfoDetails = async () => {
    setIsLoading(true);
    try {
      const result = await GetBasicInformationService(regToken!);
      console.log(result.data.data);
      if (result.data.status) {
        setIsLoading(false);
        setBasicInfo(result.data.data);
        // info = result.data.data;
        countryGet();
      } else {
        setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      // Handle error
      setIsLoading(false);
      showErrorToast("Something went wrong ");
    }
  };

  //get Category

  const [isCategoryLoading, setIsCategoryLoading] = useState<boolean>(false);

  const getCategoryList = async () => {
    setIsCategoryLoading(true);
    setIsLoading(true);
    try {
      const result = await ItemCategoryListServiceService(regToken!);
      console.log(result.data.data);
      if (result.data.status === 200) {
        const LowerKeys = convertKeysToLowerCase(result.data.data);
        setCategoryList(LowerKeys);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsCategoryLoading(false);
      showErrorToast("Something went wrong");
    }
  };

  // method to set data after grtting from api
  // test korte hobe jodi first time data na thake

  const setData = () => {
    if (basicInfo && organizationNameRef.current && addressRef.current) {
      organizationNameRef.current.value = basicInfo.ORGANIZATION_NAME || "";
      addressRef.current.value = basicInfo.SUPPLIER_ADDRESS || "";
      setOrganizationName(basicInfo.ORGANIZATION_NAME || "");
      setAddress(basicInfo.SUPPLIER_ADDRESS || "");
      setSelectedOrgTypeId(basicInfo.ORGANIZATION_TYPE || ""); // Use optional chaining to handle null or undefined
      setIncorporatedInU(basicInfo.INCORPORATE_IN || "");
      setGlobalIncorporatedIn(basicInfo.INCORPORATE_IN);
      setCategoryId(basicInfo.CATEGORY_ID?.toString() || "");

      const selectedCategory = categoryList.find(
        (option) => option.value === basicInfo.CATEGORY_ID?.toString()
      );
      if (selectedCategory) {
        setItemCategory(selectedCategory);
      } else {
        setItemCategory(null);
      }

      const selectedCountry = countryListFromOracle.find(
        (option) => option.label === basicInfo.INCORPORATE_IN
      );

      if (selectedCountry) {
        setCountryList(selectedCountry);
        localStorage.setItem("supplierCountryCode", selectedCountry.value);
        setSupplierCountryCode(selectedCountry.value);
        setGlobalIncorporatedIn(selectedCountry.value);
      } else {
        // setCountryList(null);
      }
    }
  };

  //form validation

  const [basicInfoError, setBasicInfoError] = useState<{
    organizationName?: string;
    address?: string;
    incorporatedIn?: string;
    selectedOrgTypeId?: string;
    categoryId?: string;
  }>({});

  const validate = () => {
    const errors: {
      organizationName?: string;
      address?: string;
      incorporatedIn?: string;
      selectedOrgTypeId?: string;
      categoryId?: string;
    } = {};

    if (organizationName === "") {
      errors.organizationName = "Please Enter Organization Name";
    }
    if (!address.trim()) {
      errors.address = "Please Enter Address";
    }
    if (incorporatedInU === "") {
      errors.incorporatedIn = "Please Select Incorporated In";
    }
    if (selectedOrgTypeId === "") {
      errors.selectedOrgTypeId = "Please Select Organization Type";
    }
    // if (categoryId === "") {
    //   errors.categoryId = "Please Select Item Category";
    // }
    setBasicInfoError(errors);
    return Object.keys(errors).length === 0;
  };

  //form validation

  //submit to add update basic info

  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

  const submit = async () => {
    console.log(organizationName);
    console.log(incorporatedInU);

    if (validate()) {
      localStorage.setItem("supplierCountryCode", countryList?.value!);
      setSupplierCountryCode(countryList?.value!);
      setIsSubmitLoading(true);
      try {
        const result = await AddUpdateBasicInformationService(
          regToken!,
          organizationName,
          address,
          incorporatedInU,
          selectedOrgTypeId,
          categoryId
        );
        if (result.data.status === 200) {
          showSuccessToast(result.data.message);
          // getBasicInfoDetails();
          if (isRegCompelte !== "1") {
            setTimeout(() => {
              setIsSubmitLoading(false);
              navigate(`/register/2`);
            }, 2900);
          } else {
            setIsSubmitLoading(false);
          }
        } else {
          setIsSubmitLoading(false);
          showErrorToast(result.data.message);
          // getBasicInfoDetails();
        }
      } catch (error) {
        //handle error
        setIsSubmitLoading(false); // loading end
        showErrorToast(
          `${
            basicInfo !== null
              ? "Failed to submit information"
              : "Failed to update information"
          }`
        ); //failed message show
        //now call existing basic info
        // getBasicInfoDetails();
      }
    }
  };

  //final submission
  const [isWarningShowSubmit, setIsWarningShowSubmit] =
    useState<boolean>(false);

  const showWarning = async () => {
    setIsWarningShowSubmit(true);
  };
  const closeModalSubmit = () => {
    setIsWarningShowSubmit(false);
  };

  const [isFinalSubmissionLoading, setIsFinalSubmissionLoading] =
    useState<boolean>(false);

  const profileUpdateSubmission = async () => {
    try {
      const result = await ProfileUpdateSubmissionService(token!);
      console.log(result.data);

      if (result.data.status === 200) {
        showSuccessToast(result.data.message);
        setSubmissionStatus("SUBMIT");

        setIsDisable(true);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {}
  };
  //final submission

  return (
    <div className=" bg-whiteColor ">
      <SuccessToast />
      <WarningModal
        isOpen={isWarningShowSubmit}
        action={profileUpdateSubmission}
        closeModal={closeModalSubmit}
        message="Do you want to submit ?"
        imgSrc="/images/warning.png"
      />
      <div className=" w-full flex  justify-end">
        {isSubmitLoading ? (
          <div className=" w-48 flex justify-center items-center">
            <CircularProgressIndicator />
          </div>
        ) : (
          <CommonButton
            disable={isDisable || isLoading}
            titleText={"Save & Next"}
            onClick={submit}
            width="w-48"
          />
        )}

        <div>
          {/* {isRegCompelte === "1" ? (
                  <CommonButton
                    disable={isDisable}
                    titleText={"Submit"}
                    onClick={showWarning}
                    width="w-48"
                    color="bg-midGreen"
                  />
                ) : null} */}
        </div>
      </div>
      {isLoading ? (
        <div className=" w-full flex justify-center items-center">
          <LogoLoading />
        </div>
      ) : (
        <div className="    w-full  flex flex-row justify-between items-center">
          {/* left side */}
          <div className=" flex-1 h-screen flex flex-col items-start">
            <div className=" flex flex-col items-start space-y-2">
              <div className="flex items-center space-x-1">
                <InputLebel titleText="Name of Organization" />
                <span className="text-red-500 font-bold">*</span>
              </div>
              <CommonInputField
                inputRef={organizationNameRef}
                onChangeData={handleOrganizationNameChange}
                hint=""
                type="text"
                disable={isRegCompelte === "1" || isDisable ? true : false} //isRegCompelte === "1" ||
              />

              {basicInfoError.organizationName && (
                <ValidationError title={basicInfoError.organizationName} />
              )}
            </div>
            <div className=" mt-6"></div>
            <div className=" flex flex-col items-start space-y-2">
              <InputLebel titleText="Item Category" />
              <CommonDropDownSearch
                placeholder="Search Here"
                onChange={handleChange}
                value={itemCategory}
                options={categoryList}
                width="w-96"
                disable={isDisable}
              />
              {basicInfoError.categoryId && (
                <ValidationError title={basicInfoError.categoryId} />
              )}
            </div>
            <div className=" mt-6"></div>
            <div className="flex items-center space-x-1">
              <InputLebel titleText="Type of Organization" />
              <span className="text-red-500 font-bold">*</span>
            </div>
            <div className=" mt-4"></div>

            {/* <FormControl >
                       
                        <RadioGroup defaultValue="medium" name="radio-buttons-group">

                            <Radio value="a" label="Proprietorship" color="neutral" />
                            <Radio value="v" label="Partnership" color="neutral" />
                            <Radio value="b" label="Private Limited Company" color="neutral" />
                            <Radio value="f" label="Limited Company" color="neutral" />
                            <Radio value="n" label="Government" color="neutral" />
                            <Radio value="m" label="Others" color="neutral" />

                        </RadioGroup>
                    </FormControl> */}

            <div className="form-control bg-white">
              {organizationList.map((e, i) => (
                <label
                  className="label justify-start   "
                  htmlFor={(i + 1).toString()}
                >
                  <input
                    disabled={isDisable}
                    type="radio"
                    id={e.VALUE}
                    checked={selectedOrgTypeId === e.VALUE}
                    onChange={handleSelectedOrgTypeIdChange}
                    name="radio-10"
                    className="radio checked:bg-neonBlue "
                  />
                  <div className=" w-4"> </div>
                  <p className=" text-[16px] text-blackishColor font-mon ">
                    {e.LABEL}
                  </p>
                </label>
              ))}

              {basicInfoError.selectedOrgTypeId && (
                <ValidationError title={basicInfoError.selectedOrgTypeId} />
              )}
              {/* <label className="label justify-start " htmlFor="2">

                                    <input 
                                     disabled={isDisable}
                                    type="radio"
                                        id='Partnership'
                                        checked={selectedOrgTypeId === 'Partnership'}
                                        onChange={handleSelectedOrgTypeIdChange}
                                        name="radio-10" className="radio checked:bg-neonBlue"
                                    />
                                    <div className=' w-4'> </div>
                                    <p className=" text-[16px] text-blackishColor font-mon ">Partnership</p>
                                </label>
                                <label className="label justify-start">

                                    <input 
                                     disabled={isDisable}
                                    type="radio"
                                        id='Private Limited Company'
                                        checked={selectedOrgTypeId === 'Private Limited Company'}
                                        onChange={handleSelectedOrgTypeIdChange}
                                        name="radio-10" className="radio checked:bg-neonBlue" />
                                    <div className=' w-4'> </div>
                                    <p className=" text-[16px] text-blackishColor font-mon">Private Limited Company</p>
                                </label>
                                <label className="label justify-start">

                                    <input 
                                     disabled={isDisable}
                                    type="radio" name="radio-10"
                                        id='Limited Company'
                                        checked={selectedOrgTypeId === 'Limited Company'}
                                        onChange={handleSelectedOrgTypeIdChange}
                                        className="radio checked:bg-neonBlue" />
                                    <div className=' w-4'> </div>
                                    <p className=" text-[16px] text-blackishColor font-mon">Limited Company</p>
                                </label>
                                <label className="label justify-start">

                                    <input 
                                     disabled={isDisable}
                                    type="radio"
                                        id='Goverment'
                                        checked={selectedOrgTypeId === 'Goverment'}
                                        onChange={handleSelectedOrgTypeIdChange}
                                        name="radio-10" className="radio checked:bg-neonBlue" />
                                    <div className=' w-4'> </div>
                                    <p className=" text-[16px] text-blackishColor font-mon">Goverment</p>
                                </label>
                                <label className="label justify-start">

                                    <input
                                     disabled={isDisable}
                                    type="radio"
                                        id='Others'
                                        checked={selectedOrgTypeId === 'Others'}
                                        onChange={handleSelectedOrgTypeIdChange}
                                        name="radio-10" className="radio checked:bg-neonBlue" />
                                    <div className=' w-4'> </div>
                                    <p className=" text-[16px] text-blackishColor font-mon">Others</p>
                                </label> */}
            </div>
          </div>

          {/* end left side */}

          {/* right side */}

          <div className="flex-1 h-screen   flex flex-col  items-start ">
            <div className=" flex flex-col items-start space-y-2">
              <div className="flex items-center space-x-1">
                <InputLebel titleText="Organization Address" />
                <span className="text-red-500 font-bold">*</span>
              </div>
              <CommonInputField
                inputRef={addressRef}
                onChangeData={handleAddressChange}
                hint=""
                type="text"
                disable={isDisable}
              />
              {basicInfoError.address && (
                <ValidationError title={basicInfoError.address} />
              )}
            </div>
            {/* country drop dowon */}
            <div className=" flex flex-col items-start space-y-2 mt-6">
              <div className="flex items-center space-x-1">
                <InputLebel titleText="Incorporated in" />
                <span className="text-red-500 font-bold">*</span>
              </div>
              {/* <div className=' w-96 h-10 rounded-md  bg-inputBg border-[0.5px] border-borderColor '>
                                    <select
                                    disabled={isDisable}
                                        value={incorporatedIn}
                                        onChange={handleIncorporatedInChange}
                                        placeholder='Select Country' name="invitationtype" id="" className=' pl-3 w-[374px] h-9 rounded-md bg-inputBg text-hintColor  focus:outline-none'>
                                        <option value="" disabled selected>Select Country</option>
                                        <option value="Bangladesh" >Bangladesh</option>
                                        <option value="Foreign" >Foreign</option>

                                    </select>
                                </div> */}
              <CommonDropDownSearch
                placeholder="Select Country"
                onChange={handleCountryChange}
                value={countryList}
                options={countryListFromOracle}
                width="w-96"
                disable={isDisable}
              />

              {basicInfoError.incorporatedIn && (
                <ValidationError title={basicInfoError.incorporatedIn} />
              )}

              {/* <p className=' font-mon font-medium'>Category Given By Buyer</p> */}

              {isRegCompelte === "1" ? (
                <>
                  <div className="h-2"></div>
                  <p className=" font-mon font-medium mt-2">
                    {supplierSelectedCategoryList.length === 0 ? (
                      ""
                    ) : (
                      <p>Category Given By Buyer</p>
                    )}
                  </p>
                  {supplierSelectedCategoryList.map((e, i) => (
                    <div>{!e.NAME ? "N/A" : e.NAME}</div>
                  ))}
                </>
              ) : null}
            </div>
            <div className=" h-80"></div>
          </div>

          {/* end right side */}
        </div>
      )}
    </div>
  );
};

export default BasicInformationPage;
