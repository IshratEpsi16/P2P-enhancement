import React, { useRef, useState, useEffect } from "react";
import NavigationPan from "../../common_component/NavigationPan";
import CommonButton from "../../common_component/CommonButton";
import CommonInputField from "../../common_component/CommonInputField";
import { useRoleAccessContext } from "../context/RoleAccessContext";
import { useAuth } from "../../login_both/context/AuthContext";
import { SingleUserRoleData } from "../interface/SingleUserRoleInterface";
import SingleUserRoleService from "../service/SingleUserRoleService";
import TableSkeletonLoader from "../../Loading_component/skeleton_loader/TableSkeletonLoader";
import NotFoundPage from "../../not_found/component/NotFoundPage";
import Tooltip from "@mui/material/Tooltip";
import UserLockUnlockRoleService from "../service/UserLockUnlockService";
import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";
import ErrorToast, { showErrorToast } from "../../Alerts_Component/ErrorToast";
import RolePermissionToUserRoleService from "../service/RolePermissionToUserService";
import RoleCreationService from "../service/RoleCreationService";
import AllMenuPermissionGetService from "../service/AllMenuPermissionGetService";
import {
  MenuInterface,
  PermissionInterface,
} from "../interface/MenuPermissionInterface";
import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";
import MenuAndPermissionGrantRevokeService from "../service/MenuAndPermissionGrantRevokeService";
import { OrganizationInterface } from "../interface/OrganizationInterface";
import OrganizationListService from "../service/OrganizationListService";
import OraganizationInsertDeleteToUserService from "../service/OraganizationInsertDeleteToUserService";
import LogoLoading from "../../Loading_component/LogoLoading";
import { FaUserCircle } from "react-icons/fa";
import isoToDateTime from "../../utils/methods/isoToDateTime";
import { Modal } from "keep-react";
import UserResetPasswordService from "../service/UserResetPasswordService";
import WarningIcon from "../../icons/WarningIcon";
import SupplierDraftSubmitPermissionService from "../service/SupplierDraftSubmitPermissionService";
import UserInfoUpdateService from "../service/UserInfoUpdateService";
import InputLebel from "../../common_component/InputLebel";
import BasicInfoViewForApprovalPage from "../../manage_supplier/component/basic_info/BasicInfoViewForApprovalPage";
import { DocumentApprovalViewProvider } from "../../manage_supplier/interface/document/DocumentApprovalViewContext";
import DocumentHomeApprovalPage from "../../manage_supplier/component/document/DocumentHomeApprovalPage";
import DeclarationViewforApprovalPage from "../../manage_supplier/component/declaration/DeclarationViewforApprovalPage";
import { ContactViewApprovalProvider } from "../../manage_supplier/interface/contact/ContactApprovalViewContext";
import ContactHomeForApprovalView from "../../manage_supplier/component/contact/ContactHomeForApprovalView";
import { SiteApprovalViewProvider } from "../../manage_supplier/interface/contact/SiteApprovalViewContext";
import SiteHomeForApproval from "../../manage_supplier/component/site/SiteHomeForApproval";
import { BankViewApprovalProvider } from "../../manage_supplier/interface/bank/BankViewApprovalContext";
import BankHomeViewForApprovalPage from "../../manage_supplier/component/bank/BankHomeViewForApprovalPage";
import SetupFromBuyerPage from "../../manage_supplier/component/setup_from_buyer/SetupFromBuyerPage";
import fetchFileUrlService from "../../common_service/fetchFileUrlService";
import ApproverListForApprovalPage from "../../manage_supplier/component/ApproverListForApprovalPage";
const navi = ["Dashboard", "User Role & Access"];
const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// for supplier profile
const buttonList = [
  {
    id: 100,
    name: "Basic Information",
  },
  {
    id: 110,
    name: "Documents",
  },
  {
    id: 120,
    name: "Declaration",
  },

  {
    id: 150,
    name: "Bank Details",
  },
  {
    id: 140,
    name: "Site",
  },
  {
    id: 130,
    name: "Contact",
  },
  {
    id: 170,
    name: "Approval",
  },
  // {
  //   name: `Buyer's Selection`,
  //   id: 160,
  // },
];

export default function CreateRolePage() {
  const roleRef = useRef<HTMLInputElement | null>(null);
  const [roleName, setRoleName] = useState<string>("");
  const [userRoleInfo, setUserRoleInfo] = useState<SingleUserRoleData[] | []>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRoleCreationLoading, setIsRoleCreationLoading] =
    useState<boolean>(false);

  const [menuList, setMenuList] = useState<MenuInterface[] | []>([]);
  const [permissionList, setPermissionList] = useState<
    PermissionInterface[] | []
  >([]);
  const [selectedMenuList, setSelectedMenuList] = useState<
    MenuInterface[] | []
  >([]);
  const [selectedPermissionList, setSelectedPermissionList] = useState<
    PermissionInterface[] | []
  >([]);

  const [createdRoleId, setCreatedRoleId] = useState<number | null>(null);

  const [organizationList, setOrganizationList] = useState<
    OrganizationInterface[] | []
  >([]);
  const [profilePicOnePath, setProfilePicOnePath] = useState<string>("");
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState<boolean>(false);

  //here userId means clicked user's id not admin's id

  //context
  const { setRoleAccessPageNo, userId } = useRoleAccessContext();
  const { token, supplierId } = useAuth();
  //context

  const phoneNumberRefs = useRef<HTMLInputElement | null>(null);
  const emailNumberRefs = useRef<HTMLInputElement | null>(null);

  const [approvalStatus, setApprovalStatus] = useState<string>("");

  // const [phoneNumber, setPhoneNumber] = useState<string>("");
  // const [emailNumber, setEmailNumber] = useState<string>("");

  useEffect(() => {
    console.log(`user id in cr: ${userId}`);
    console.log(`supplier Id auth: ${supplierId}`);

    getUserRoleData();
  }, []);

  const getUserRoleData = async () => {
    setIsLoading(true);
    const result = await SingleUserRoleService(token!, userId!);

    console.log(result.data.status);
    setUserRoleInfo(result.data.data);
    setProfilePicOnePath(result.data.profile_pic1);
    console.log(result.data);
    console.log("approve: ", result.data.data[0].APPROVAL_STATUS);
    setActiveStatus(result.data.data[0].USER_ACTIVE_STATUS);
    setApprovalStatus(result.data.data[0].APPROVAL_STATUS);
    getOrganization();
    setIsLoading(false);
  };
  // userId!
  const getOrganization = async () => {
    const result = await OrganizationListService(token!, supplierId!);
    if (result.data.status === 200) {
      setOrganizationList(result.data.data);
    }
  };

  // user info updated (phone & email)

  // for phone

  const [phoneNumber, setPhoneNumber] = useState(
    userRoleInfo[0]?.MOBILE_NUMBER || ""
  );
  const [phoneError, setPhoneError] = useState("");
  const [isPhoneButtonDisabled, setIsPhoneButtonDisabled] = useState(true);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [originalPhoneNumber, setOriginalPhoneNumber] = useState(
    userRoleInfo[0]?.MOBILE_NUMBER || ""
  );

  const handlePhoneNumber = (value: string) => {
    // setPhoneNumber(value);

    const numberRegex = /^\+?[0-9]*$/;
    if (!numberRegex.test(value)) {
      setPhoneError("Please enter valid number.");
      setIsPhoneButtonDisabled(true);
    } else {
      setPhoneError("");
      setIsPhoneButtonDisabled(value === "" || value === originalPhoneNumber); // Disable if input is empty
    }
    setPhoneNumber(value);
  };

  const handleEditClick = () => {
    if (userRoleInfo && userRoleInfo.length > 0) {
      setPhoneNumber(userRoleInfo[0].MOBILE_NUMBER || ""); // Set the current phone number in the input field
      setOriginalPhoneNumber(userRoleInfo[0].MOBILE_NUMBER || ""); // Set the original phone number
    }
    setIsEditingPhone(true);
  };

  const savePhoneNumber = async () => {
    console.log("phone: ", phoneNumber);

    setIsLoading(true);
    const result = await UserInfoUpdateService(
      token!,
      userId!,
      "MOBILE_NUMBER",
      phoneNumber
    );
    console.log("res: ", result.data);

    if (result.data.status === 200) {
      showSuccessToast(result.data.message);

      getUserRoleData();
    } else {
      showErrorToast(result.data.message);
      setPhoneNumber("");
    }

    setIsEditingPhone(false);
    setIsLoading(false);
  };

  // const phoneNumberDisabled = !phoneNumber;

  // for email
  const [emailNumber, setEmailNumber] = useState(
    userRoleInfo[0]?.EMAIL_ADDRESS || ""
  );
  const [emailError, setEmailError] = useState("");
  const [emailNumberDisabled, setEmailNumberDisabled] = useState(true);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [originalEmail, setOriginalEmail] = useState(
    userRoleInfo[0]?.EMAIL_ADDRESS || ""
  );

  const handleEmailNumber = (value: string) => {
    setEmailNumber(value);

    // email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email");
      setEmailNumberDisabled(true);
    } else {
      setEmailError("");
      setEmailNumberDisabled(value === "" || value === originalEmail);
    }
  };

  const handleEditEmail = () => {
    if (userRoleInfo && userRoleInfo.length > 0) {
      setEmailNumber(userRoleInfo[0].EMAIL_ADDRESS || ""); // Set the current phone number in the input field
      setOriginalEmail(userRoleInfo[0].EMAIL_ADDRESS || ""); // Set the original phone number
    }
    setIsEditingEmail(true);
  };

  const saveEmailNumber = async () => {
    console.log("email: ", emailNumber);
    setIsLoading(true);
    const result = await UserInfoUpdateService(
      token!,
      userId!,
      "EMAIL_ADDRESS",
      emailNumber
    );

    if (result.data.status === 200) {
      showSuccessToast(result.data.message);

      getUserRoleData();
    } else {
      showErrorToast(result.data.message);
      setEmailNumber("");
    }

    setIsEditingEmail(false);

    setIsLoading(false);
  };

  // const emailNumberDisabled = !emailNumber;

  const handleChangeRole = (value: string) => {
    setRoleName(value);
    if (roleRef.current) {
      roleRef.current.value = value;
    }
  };
  // const roleSave = () => { };
  // const menuSave = () => { };

  //create roles
  const createRole = async () => {
    // "message": "Inserted",
    // "status": 200,
    // "role_id": 221
    setIsRoleCreationLoading(true);
    const result = await RoleCreationService(token!, roleName);
    if (result.data.status === 200) {
      showSuccessToast(result.data.message);
      setCreatedRoleId(result.data.role_id);
      getMenuPermission();
    } else {
      showErrorToast(result.data.message);
      setIsRoleCreationLoading(false);
    }
  };

  //get all menu permission

  const getMenuPermission = async () => {
    const result = await AllMenuPermissionGetService(token!);
    console.log(result.data);
    console.log(result.data.data[0].Menu);
    console.log(result.data.data[0].Permission);

    if (result.data.status === 200) {
      setMenuList(result.data.data[0].Menu);
      setPermissionList(result.data.data[0].Permission);
      setIsRoleCreationLoading(false);
    } else {
      setIsRoleCreationLoading(false);
      showErrorToast("Something went wrong");
    }
  };

  // role grant revoke
  const handleGrantRevokeRole = (roleIndex: number) => {
    // Create a copy of the data to avoid mutating the original state
    const updatedUserRoleInfo = [...userRoleInfo];

    // Toggle the IS_ASSOCIATED property for the specified roleIndex
    updatedUserRoleInfo[0].Role[roleIndex].IS_ASSOCIATED =
      updatedUserRoleInfo[0].Role[roleIndex].IS_ASSOCIATED === 1 ? 0 : 1;

    // Update the state with the modified data
    setUserRoleInfo(updatedUserRoleInfo);
    grantRevokeRole(updatedUserRoleInfo[0].Role[roleIndex].ROLE_ID);
  };

  const grantRevokeRole = async (roleId: number) => {
    const result = await RolePermissionToUserRoleService(
      token!,
      roleId,
      userId!
    );
    if (result.data.status === 200) {
      showSuccessToast(result.data.message);
    } else {
      showErrorToast(result.data.message);
    }
  };

  //org grant revoke

  const handleGrantRevokeOrganization = (orgIndex: number) => {
    const updatedOrganizationList = [...organizationList];
    updatedOrganizationList[orgIndex].IS_ASSOCIATED =
      updatedOrganizationList[orgIndex].IS_ASSOCIATED === 1 ? 0 : 1;
    setOrganizationList(updatedOrganizationList);
    grantRevokeOrganization(
      updatedOrganizationList[orgIndex].ORGANIZATION_ID,
      updatedOrganizationList[orgIndex].SHORT_CODE,
      updatedOrganizationList[orgIndex].NAME
    );
  };

  const grantRevokeOrganization = async (
    orgId: number,
    shortCode: string,
    orgName: string
  ) => {
    const result = await OraganizationInsertDeleteToUserService(
      token!,
      userId!,
      orgId,
      shortCode,
      orgName
    );
    if (result.data.status === 200) {
      showSuccessToast(result.data.message);
    } else {
      showErrorToast(result.data.message);
    }
  };

  //active deactive
  const [activeStatus, setActiveStatus] = useState<number | null>(null);

  const doActiveInactive = async () => {
    const newStatus = activeStatus === 1 ? 0 : 1;
    const re = await UserLockUnlockRoleService(token!, userId!, newStatus);
    if (re.data.status === 200) {
      showSuccessToast(
        `${
          !userRoleInfo[0].FULL_NAME
            ? `${userRoleInfo[0].USER_NAME}`
            : userRoleInfo[0].FULL_NAME == null
        } ${re.data.message} successfully`
      );
    } else {
      showErrorToast(` ${re.data.message} `);
    }
  };

  const handleActiveDeactive = () => {
    const newStatus = activeStatus === 1 ? 0 : 1;
    setActiveStatus(newStatus);
    doActiveInactive();
  };
  //active deactive

  // supplier draft and submit mood start
  // const handleActivation = (index: number) => {
  //   console.log("index: ", index);
  //   const newUserRoleInfo = [...userRoleInfo];
  //   newUserRoleInfo[index].SUBMISSION_STATUS = newUserRoleInfo[index].SUBMISSION_STATUS === "DRAFT" ? "SUBMIT" : "DRAFT";
  //   setUserRoleInfo(newUserRoleInfo);
  //   console.log("Updated userRoleInfo: ", newUserRoleInfo);
  //   // updateUserRole(newUserRoleInfo[index]);
  // };
  // supplier draft and submit mood end

  //role permission and menu
  const addToSelectedPermission = (permission: PermissionInterface) => {
    // Use the spread operator to create a new array with the existing elements
    // and add the new permission to it
    setSelectedPermissionList((prevList) => [...prevList, permission]);
  };

  const removeFromSelectedPermission = (
    permissionToRemove: PermissionInterface
  ) => {
    // Use filter to create a new array that excludes the permission to remove
    setSelectedPermissionList((prevList) =>
      prevList.filter((permission) => permission !== permissionToRemove)
    );
  };

  const togglePermission = (permission: PermissionInterface) => {
    // Check if the permission is already in the selectedPermissionList
    const isSelected = selectedPermissionList.some(
      (selectedPermission) => selectedPermission === permission
    );

    if (isSelected) {
      // If the permission is already selected, remove it
      removeFromSelectedPermission(permission);
      setPermissionToRole(permission);
    } else {
      // If the permission is not selected, add it
      addToSelectedPermission(permission);
      setPermissionToRole(permission);
    }
  };

  const setPermissionToRole = async (permission: PermissionInterface) => {
    const result = await MenuAndPermissionGrantRevokeService(
      token!,
      createdRoleId,
      null,
      permission.PERMISSION_ID
    );
    if (result.data.status === 200) {
      showSuccessToast(result.data.message);
    } else {
      removeFromSelectedPermission(permission);
      showErrorToast(result.data.message);
    }
  };

  //role permission and menu

  const addToSelectedMenu = (menu: MenuInterface) => {
    // Use the spread operator to create a new array with the existing elements
    // and add the new menu to it
    setSelectedMenuList((prevList) => [...prevList, menu]);
  };

  const removeFromSelectedMenu = (menuToRemove: MenuInterface) => {
    // Use filter to create a new array that excludes the menu to remove
    setSelectedMenuList((prevList) =>
      prevList.filter((permission) => permission !== menuToRemove)
    );
  };

  const toggleMenu = (menu: MenuInterface) => {
    // Check if the permission is already in the selectedPermissionList
    const isSelected = selectedMenuList.some(
      (selectedPermission) => selectedPermission === menu
    );

    if (isSelected) {
      // If the menu is already selected, remove it
      removeFromSelectedMenu(menu);
      setMenuToRole(menu);
    } else {
      // If the menu is not selected, add it
      addToSelectedMenu(menu);
      setMenuToRole(menu);
    }
  };

  const setMenuToRole = async (menu: MenuInterface) => {
    const result = await MenuAndPermissionGrantRevokeService(
      token!,
      createdRoleId,
      menu.MENU_ID,
      null
    );
    if (result.data.status === 200) {
      showSuccessToast(result.data.message);
    } else {
      removeFromSelectedMenu(menu);
      showErrorToast(result.data.message);
    }
  };

  //context
  const back = () => {
    setRoleAccessPageNo(1);
  };
  //context

  const openResetModal = () => {
    setIsResetPasswordModalOpen(true);
  };

  const closeResetModal = () => {
    setIsResetPasswordModalOpen(false);
  };

  const confirmResetPassword = async () => {
    closeResetModal();

    setIsLoading(true);
    const result = await UserResetPasswordService(
      token!,
      userRoleInfo[0].USER_ID
    );

    if (result.data.status === 200) {
      showSuccessToast(result.data.message);
    } else {
      showErrorToast(result.data.message);
    }

    setIsLoading(false);
  };

  // supplier edit permission start
  const [isEditPermission, setIsEditPermission] = useState<boolean>(true);

  useEffect(() => {
    if (userRoleInfo && userRoleInfo[0] && userRoleInfo[0].SUBMISSION_STATUS) {
      setIsEditPermission(userRoleInfo[0].SUBMISSION_STATUS === "DRAFT");
    }
  }, [userRoleInfo]);

  const handleEditPermission = async (newPermissionState: boolean) => {
    setIsLoading(true);

    setIsEditPermission(newPermissionState);

    const actionType = newPermissionState ? "DRAFT" : "SUBMIT";

    const result = await SupplierDraftSubmitPermissionService(
      token!,
      userId!,
      actionType
    );

    if (result.data.status === 200) {
      showSuccessToast(result.data.message);
    } else {
      showErrorToast(result.data.message);
    }
    setIsLoading(false);
  };

  // supplier edit permission end

  // for supplier profile
  const [selectedButton, setSelectedButton] = useState<number>(100);
  const [page, setPage] = useState<number>(100);

  const handleButton = (buttonId: number) => {
    setSelectedButton(buttonId);
    setPage(buttonId);
  };

  // for using tab

  // const [activeTab, setActiveTab] = useState(userRoleInfo[0]?.USER_TYPE === "Supplier" ? "SupplierProfile" : "BusinessUnit");

  type TabType = "SupplierProfile" | "BusinessUnit" | null;

  const userType =
    userRoleInfo && userRoleInfo.length > 0 ? userRoleInfo[0].USER_TYPE : null;

  const [activeTab, setActiveTab] = useState<TabType>(null);

  useEffect(() => {
    if (userType === "Supplier") {
      setActiveTab("SupplierProfile");
    } else {
      setActiveTab("BusinessUnit");
    }
  }, [userType]);

  const [profilePicSrc, setProfilePicSrc] = useState<string | null>(null);

  useEffect(() => {
    if (userRoleInfo && userRoleInfo.length > 0) {
      getImage();
    }
  }, [userRoleInfo, profilePicOnePath]);

  const getImage = async () => {
    if (
      userRoleInfo &&
      userRoleInfo.length > 0 &&
      userRoleInfo[0].PROFILE_PIC1_FILE_NAME
    ) {
      try {
        const url = await fetchFileUrlService(
          profilePicOnePath!,
          userRoleInfo[0].PROFILE_PIC1_FILE_NAME,
          token!
        );
        console.log("profilePicOnePath:", profilePicOnePath);
        console.log(
          "PROFILE_PIC1_FILE_NAME:",
          userRoleInfo[0].PROFILE_PIC1_FILE_NAME
        );
        console.log("url img:", url);
        setProfilePicSrc(url);
      } catch (error) {
        console.error("Error fetching image URL:", error);
      }
    } else {
      console.log(
        "User role info or profile picture filename is not available"
      );
    }
  };

  return (
    <div className=" m-8">
      <SuccessToast />
      {isLoading ? (
        <div>
          <LogoLoading />
        </div>
      ) : !isLoading && userRoleInfo?.length === 0 ? (
        <NotFoundPage />
      ) : (
        <>
          <div className=" flex flex-col items-start">
            <div className=" w-full flex justify-between items-center">
              <p className=" text-blackColor font-semibold text-lg font-mon">
                User Role & Access
              </p>
              <CommonButton
                onClick={back}
                titleText={"Back"}
                width="w-20"
                height="h-8"
                color="bg-midGreen"
              />
            </div>
            {/* <NavigationPan list={navi} /> */}
          </div>
          <div className=" h-6"></div>

          <div className="border-[.5px] border-gray-200 px-4 py-3 rounded-xl flex items-center justify-start space-x-4 shadow-sm">
            <div>
              {userRoleInfo[0].PROFILE_PIC1_FILE_NAME === "" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-20 h-20 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              ) : (
                <div className="h-16 w-[66px] border-[2px] border-green-500 rounded-full flex item-center justify-center">
                  <img
                    // src={`${profilePicOnePath}/${userRoleInfo[0].PROFILE_PIC1_FILE_NAME}`}
                    src={profilePicSrc!}
                    alt="avatar"
                    className="h-[59px] w-[61px] rounded-full flex items-center justify-center mt-[.5px]"
                  />
                </div>
              )}
            </div>

            <div className="w-full flex justify-between items-start">
              <div>
                <div className=" flex flex-row items-center space-x-4 ">
                  {/* <p className=" text-blackishColor text-sm font-mon">Name:</p> */}
                  <p className="space-x-3">
                    {userRoleInfo[0].USER_TYPE === "Buyer" ? (
                      <span className=" text-blackColor text-[16px] font-mon font-semibold">
                        {userRoleInfo[0].FULL_NAME === ""
                          ? "---"
                          : userRoleInfo[0].FULL_NAME}
                      </span>
                    ) : (
                      <span className=" text-blackColor text-[16px] font-mon font-semibold">
                        {userRoleInfo[0].ORGANIZATION_NAME === ""
                          ? "---"
                          : userRoleInfo[0].ORGANIZATION_NAME}
                      </span>
                    )}

                    {approvalStatus === "IN PROCESS" ? (
                      <span className="text-xs font-semibold bg-[#fff1d6] text-[#302e2c] px-2 py-1 rounded-md">
                        Not Approved
                      </span>
                    ) : approvalStatus === "APPROVED" ? (
                      <span className="text-xs font-semibold bg-[#dbf6e5] text-[#118d57] px-2 py-1 rounded-md">
                        Approved
                      </span>
                    ) : (
                      <span className="text-xs font-semibold bg-[#ffe4de] text-[#ca534d] px-2 py-1 rounded-md">
                        Rejected
                      </span>
                    )}
                  </p>
                </div>
                {/* <div className=" flex flex-row items-center space-x-4 ">
                  <p className=" text-gray-500 text-md font-mon font-medium">
                    {userRoleInfo[0].USER_NAME}({userRoleInfo[0].USER_ID})
                  </p>
                </div> */}
                <div className=" flex flex-row items-center space-x-4 mt-1">
                  {/* <p className=" text-blackishColor text-sm font-mon">User Status:</p> */}
                  <p className=" text-black text-[12px] font-mon font-semibold bg-[#dbf6e5] px-2 py-1 rounded-md">
                    {userRoleInfo[0].USER_TYPE}
                  </p>
                </div>
              </div>

              <div>
                <p className="font-semibold text-gray-800 text-sm">
                  Last Login Time
                </p>
                <p className="text-gray-700 text-sm mt-1 bg-[#def0ff] px-3 py-1 rounded-md flex items-center justify-center">
                  {/* {isoToDateTime(userRoleInfo[0].LAST_LOGIN_TIME)} */}
                  {userRoleInfo[0].LAST_LOGIN_TIME === ""
                    ? "---"
                    : isoToDateTime(userRoleInfo[0].LAST_LOGIN_TIME)}
                </p>
              </div>
            </div>
          </div>

          <div className=" h-6"></div>

          <div className="border-[.5px] border-gray-200 px-4 py-3 rounded-xl shadow-sm">
            <p className="text-[14px] text-black font-semibold font-mon">
              Personal Information
            </p>

            <div className="h-4"></div>

            <div className="flex items-start justify-between">
              <div className="space-y-2 w-2/5">
                {userRoleInfo[0].FULL_NAME === "" ? (
                  ""
                ) : (
                  <div>
                    <p className="text-gray-400">Full Name </p>
                    <p>{userRoleInfo[0].FULL_NAME}</p>
                  </div>
                )}

                <div>
                  <p className="text-gray-400">Phone </p>
                  <p>
                    {isEditingPhone || userRoleInfo[0].MOBILE_NUMBER === "" ? (
                      <div>
                        <div className="flex items-center space-x-2">
                          <CommonInputField
                            type="text"
                            hint="Phone Number"
                            onChangeData={handlePhoneNumber}
                            inputRef={phoneNumberRefs}
                            value={phoneNumber}
                            width="w-44"
                            height="h-8"
                            // disable={isDisable || isActiveDisable}
                          />
                          <div
                            className={`${
                              isPhoneButtonDisabled ? "opacity-50" : ""
                            }`}
                          >
                            <CommonButton
                              onClick={savePhoneNumber}
                              titleText={
                                userRoleInfo[0].MOBILE_NUMBER === ""
                                  ? "Save"
                                  : "Update"
                              }
                              width="w-16"
                              height="h-8"
                              color="bg-midGreen"
                              disable={isPhoneButtonDisabled}
                            />
                          </div>
                        </div>

                        {phoneError && (
                          <p className="text-red-500 text-sm">{phoneError}</p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center space-x-6">
                        <p>{userRoleInfo[0].MOBILE_NUMBER}</p>

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 cursor-pointer"
                          onClick={handleEditClick}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                          />
                        </svg>
                      </div>
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">Email </p>
                  <p>
                    {isEditingEmail || userRoleInfo[0].EMAIL_ADDRESS === "" ? (
                      <div>
                        <div className="flex items-center space-x-2">
                          <CommonInputField
                            type="text"
                            hint="Email Number"
                            onChangeData={handleEmailNumber}
                            inputRef={emailNumberRefs}
                            value={emailNumber}
                            width="w-44"
                            height="h-8"
                            // disable={isDisable || isActiveDisable}
                          />
                          <div
                            className={`${
                              emailNumberDisabled ? "opacity-50" : ""
                            }`}
                          >
                            <CommonButton
                              onClick={saveEmailNumber}
                              titleText={
                                userRoleInfo[0].EMAIL_ADDRESS === ""
                                  ? "Save"
                                  : "Update"
                              }
                              width="w-16"
                              height="h-8"
                              color="bg-midGreen"
                              disable={emailNumberDisabled}
                            />
                          </div>
                        </div>

                        {emailError && (
                          <p className="text-red-500 text-sm">{emailError}</p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center space-x-6">
                        <p>{userRoleInfo[0].EMAIL_ADDRESS}</p>

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 cursor-pointer"
                          onClick={handleEditEmail}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                          />
                        </svg>
                      </div>
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">Incorporated In </p>
                  <p>
                    {userRoleInfo[0].INCORPORATE_IN === ""
                      ? "N/A"
                      : userRoleInfo[0].INCORPORATE_IN}
                  </p>
                </div>
              </div>

              <div className="space-y-2 w-2/5">
                <div>
                  <p className="text-gray-400">Supplier ID/Segment1 </p>
                  <p>
                    {userRoleInfo[0].SUPPLIER_ID === ""
                      ? "N/A"
                      : userRoleInfo[0].SUPPLIER_ID}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">Vendor ID </p>
                  <p>
                    {userRoleInfo[0].VENDOR_ID === ""
                      ? "N/A"
                      : userRoleInfo[0].VENDOR_ID}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">Organization Type </p>
                  <p>
                    {userRoleInfo[0].ORGANIZATION_TYPE === ""
                      ? "N/A"
                      : userRoleInfo[0].ORGANIZATION_TYPE}
                  </p>
                </div>
              </div>

              <div className=" w-1/5"></div>
            </div>
          </div>

          <div className=" h-6"></div>

          <div className="border-[.5px] border-gray-200 px-4 py-3 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[14px] text-black font-semibold font-mon">
                User Active/Deactive
              </p>
              <div className="h-4"></div>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="activeDeactivate"
                    checked={activeStatus === 1}
                    onChange={handleActiveDeactive}
                    className="accent-green-600" // Added radio button color green-600
                  />
                  <p className="text-xs font-medium text-black font-mon">
                    Active
                  </p>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="activeDeactivate"
                    checked={activeStatus !== 1}
                    className="accent-green-600" // Added radio button color green-600
                    onChange={handleActiveDeactive}
                  />
                  <p className="text-xs font-medium text-black font-mon">
                    Deactive
                  </p>
                </label>
              </div>
            </div>

            {userRoleInfo[0].USER_TYPE === "Supplier" && (
              <div>
                <p className="text-[14px] text-black font-semibold font-mon">
                  User Edit Permission
                </p>

                <div className="h-4"></div>

                <div className="flex space-x-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditPermission(true)}
                      className={`w-4 h-4 rounded-[4px] ${
                        isEditPermission === true
                          ? "bg-midGreen border-none"
                          : "border-[1px] border-borderColor bg-whiteColor"
                      } flex justify-center items-center`}
                    >
                      {isEditPermission === true && (
                        <img
                          src="/images/check.png"
                          alt="check"
                          className="w-2 h-2"
                        />
                      )}
                    </button>
                    <p className="text-xs font-medium text-black font-mon">
                      Unlock
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditPermission(false)}
                      className={`w-4 h-4 rounded-[4px] ${
                        isEditPermission === false
                          ? "bg-midGreen border-none"
                          : "border-[1px] border-borderColor bg-whiteColor"
                      } flex justify-center items-center`}
                    >
                      {isEditPermission === false && (
                        <img
                          src="/images/check.png"
                          alt="check"
                          className="w-2 h-2"
                        />
                      )}
                    </button>
                    <p className="text-xs font-medium text-black font-mon">
                      Lock
                    </p>
                  </div>
                </div>

                {/* <div className="w-full flex flex-row justify-between items-center">
                  <div className="flex items-center">
                    <span className="label-text w-24">
                      {isEditPermission ? "Unlock" : "Lock"}
                    </span>
                    <input
                      // disabled={isDisable || isActiveDisable}
                      type="checkbox"
                      className="toggle border-gray-300 bg-white"
                      style={
                        {
                          "--tglbg": isEditPermission ? "#00A76F" : "#ececec",
                        } as React.CSSProperties
                      }
                      checked={isEditPermission}
                      onChange={() => handleEditPermission()}
                    />
                  </div>
                </div> */}
              </div>
            )}

            <button
              onClick={openResetModal}
              className="px-4 py-2 bg-[#FDE49E] rounded-md text-black text-[14px] font-semibold"
            >
              Reset Password
            </button>
          </div>

          {/* {userRoleInfo[0].USER_TYPE === "Supplier" && (
            <>
              <div className="h-6"></div>
              <div>
                <p className="text-[18px] text-black font-semibold">Supplier Draft/Submit</p>
                <div className="h-3"></div>
                <div className="flex items-center space-x-10">
                  <p>Draft / Submit</p>
                  <input
                    type="checkbox"
                    className="toggle border-gray-300 bg-white"
                    style={
                      {
                        "--tglbg": userRoleInfo[0].SUBMISSION_STATUS === "DRAFT" ? "#00A76F" : "#ececec",
                      } as React.CSSProperties
                    }
                    checked={userRoleInfo[0].SUBMISSION_STATUS === "DRAFT"}
                    onChange={() => handleActivation(0)}  // Assuming the status toggle is for the first user in the list
                  />
                </div>
              </div>
            </>
          )} */}

          <div className=" h-6"></div>

          <div className="border-[.5px] border-gray-200 px-4 py-3 rounded-xl shadow-sm">
            <p className=" text-blackColor text-[14px] font-mon font-semibold">
              Roles For {userRoleInfo[0].FULL_NAME}
            </p>
            <div className=" h-5"></div>
            <div className=" grid grid-cols-5 gap-6 items-enter">
              {userRoleInfo[0].Role.map((e, i) => (
                <div className=" flex flex-row space-x-2 items-center w-40 ">
                  <button
                    onClick={() => {
                      handleGrantRevokeRole(i);
                    }}
                    className={`w-4 h-4 rounded-[4px] ${
                      e.IS_ASSOCIATED === 1
                        ? "bg-midGreen border-none"
                        : " border-[1px] border-borderColor bg-whiteColor"
                    }
                      flex justify-center items-center
                    `}
                  >
                    {
                      <img
                        src="/images/check.png"
                        alt="check"
                        className=" w-2 h-2"
                      />
                    }
                  </button>
                  <p className=" text-blackColor text-sm font-mon font-medium text-start">
                    {e.ROLE_NAME}
                  </p>
                  <Tooltip
                    title={e.RolePermissions.map((p, i) => (
                      <div key={p.PERMISSION_ID}>{p.PERMISSION_NAME}</div>
                    ))}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                      />
                    </svg>
                  </Tooltip>
                </div>
              ))}
            </div>
          </div>
          <div className=" h-8"></div>

          {userRoleInfo[0].USER_TYPE === "Supplier" ? (
            <>
              <div className="flex items-center w-full bg-gray-100 rounded-lg px-2">
                {userType === "Supplier" && (
                  <button
                    className={`py-2 px-4 ${
                      activeTab === "SupplierProfile"
                        ? "font-bold border-b-[3px] border-blue-500"
                        : "font-bold text-gray-400"
                    }`}
                    onClick={() => setActiveTab("SupplierProfile")}
                  >
                    Supplier Profile
                  </button>
                )}
                {/* <div className="border-l-[.5px] border-gray-300">
                  <button
                    className={`py-2 px-4 ${
                      activeTab === 'BusinessUnit' ? 'font-bold border-b-[3px] border-blue-500' : 'font-bold text-gray-400'
                    }`}
                    onClick={() => setActiveTab('BusinessUnit')}
                  >
                    Business Unit
                  </button>
                </div> */}
              </div>

              <div className="">
                {activeTab === "SupplierProfile" && userType === "Supplier" && (
                  <div className="mt-4">
                    {/* <InputLebel titleText={"Supplier Profile"} /> */}
                    <div className="my-4">
                      <div className="w-full overflow-x-auto flex space-x-4 py-1 px-[1px]">
                        {buttonList.map((btn) => (
                          <button
                            key={btn.id}
                            onClick={() => handleButton(btn.id)}
                            className={`w-40 h-10 flex justify-center items-center text-midBlack rounded-[4px] font-mon font-medium text-sm ${
                              selectedButton === btn.id
                                ? "bg-midBlue text-whiteColor"
                                : "ring-[1px] ring-borderColor bg-inputBg"
                            }`}
                          >
                            {btn.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="w-full border-[1px] ring-[#424242] px-4 py-4 rounded-md">
                      {(() => {
                        switch (page) {
                          case 100:
                            return <BasicInfoViewForApprovalPage />;
                          case 110:
                            return (
                              <DocumentApprovalViewProvider>
                                <DocumentHomeApprovalPage />
                              </DocumentApprovalViewProvider>
                            );
                          case 120:
                            return <DeclarationViewforApprovalPage />;
                          case 130:
                            return (
                              <ContactViewApprovalProvider>
                                <ContactHomeForApprovalView />
                              </ContactViewApprovalProvider>
                            );
                          case 140:
                            return (
                              <SiteApprovalViewProvider>
                                <SiteHomeForApproval />
                              </SiteApprovalViewProvider>
                            );
                          case 150:
                            return (
                              <BankViewApprovalProvider>
                                <BankHomeViewForApprovalPage />
                              </BankViewApprovalProvider>
                            );

                          case 170:
                            return <ApproverListForApprovalPage />;

                          case 160:
                            return <SetupFromBuyerPage />;
                          default:
                            return null;
                        }
                      })()}
                    </div>
                  </div>
                )}

                {/* {activeTab === "BusinessUnit" && (
                  <div className="border-[.5px] border-gray-200 mt-2 px-4 py-3 rounded-xl shadow-sm">
                    <p className="text-blackColor text-[16px] font-mon font-semibold">
                      Selected Company For {userRoleInfo[0].FULL_NAME} to do business
                    </p>
                    <div className="h-5"></div>
                    <div className="grid grid-cols-4 gap-6 items-start">
                      {organizationList.map((e, i) => (
                        <div key={e.ORGANIZATION_ID} className="flex flex-row space-x-2 items-start w-48 px-1">
                          <button
                            onClick={() => handleGrantRevokeOrganization(i)}
                            className={`w-4 h-4 rounded-[4px] ${
                              e.IS_ASSOCIATED === 1
                                ? "bg-midGreen border-none"
                                : "border-[1px] border-borderColor bg-whiteColor"
                            } flex justify-center items-center mt-1`}
                          >
                            <img src="/images/check.png" alt="check" className="w-2 h-2" />
                          </button>
                          <p className="text-blackColor text-[12px] font-mon font-medium text-start flex-1">
                            {e.NAME} ({e.SHORT_CODE})
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )} */}
              </div>
            </>
          ) : (
            <>
              <div className="border-[.5px] border-gray-200 px-4 py-3 rounded-xl shadow-sm">
                <p className=" text-blackColor text-[16px] font-mon font-semibold">
                  Selected Company For {userRoleInfo[0].FULL_NAME} to do
                  business
                </p>
                <div className=" h-5"></div>
                <div className=" grid grid-cols-4 gap-6 items-start">
                  {organizationList.map((e, i) => (
                    <div
                      key={e.ORGANIZATION_ID}
                      className=" flex flex-row space-x-2 items-start w-48 px-1  "
                    >
                      <button
                        onClick={() => {
                          handleGrantRevokeOrganization(i);
                        }}
                        className={`w-4 h-4 rounded-[4px] ${
                          e.IS_ASSOCIATED === 1
                            ? "bg-midGreen border-none"
                            : " border-[1px] border-borderColor bg-whiteColor"
                        }
                        flex justify-center items-center mt-1  `}
                      >
                        {
                          <img
                            src="/images/check.png"
                            alt="check"
                            className=" w-2 h-2"
                          />
                        }
                      </button>
                      <p className=" text-blackColor text-[12px] font-mon font-medium text-start flex-1">
                        {e.NAME}({e.SHORT_CODE})
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* <div className=" mt-4">
            <InputLebel titleText={"Supplier Profile"} />
          </div>

          <div className=" my-4">
            <div className=" w-full overflow-x-auto flex space-x-4  py-1 px-[1px]">
              {buttonList.map((btn, i) => (
                <button
                  onClick={() => {
                    handleButton(btn.id);
                  }}
                  key={btn.id}
                  className={`w-40 h-10 flex justify-center items-center text-midBlack  rounded-[4px] font-mon font-medium text-sm  ${
                    selectedButton === btn.id
                      ? " bg-midBlue text-whiteColor"
                      : " ring-[1px] ring-borderColor bg-inputBg"
                  }`}
                >
                  {btn.name}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full  border-[1px] ring-[#424242] px-4 py-4 rounded-md">
            {(() => {
              switch (page) {
                case 100:
                  return <BasicInfoViewForApprovalPage />;
                case 110:
                  return (
                    <DocumentApprovalViewProvider>
                      <DocumentHomeApprovalPage />
                    </DocumentApprovalViewProvider>
                  );
                case 120:
                  return <DeclarationViewforApprovalPage />;

                case 130:
                  return (
                    <ContactViewApprovalProvider>
                      <ContactHomeForApprovalView />
                    </ContactViewApprovalProvider>
                  );
                case 140:
                  return (
                    <SiteApprovalViewProvider>
                      <SiteHomeForApproval />
                    </SiteApprovalViewProvider>
                  );
                case 150:
                  return (
                    <BankViewApprovalProvider>
                      <BankHomeViewForApprovalPage />
                    </BankViewApprovalProvider>
                  );
                case 160:
                  return <SetupFromBuyerPage />;

                default:
                  return null;
              }
            })()}
          </div> */}

          {/* <div className="border-[.5px] border-gray-200 px-4 py-3 rounded-xl shadow-sm">
            <p className=" text-blackColor text-[16px] font-mon font-semibold">
              Selected Company For {userRoleInfo[0].FULL_NAME} to do business
            </p>
            <div className=" h-5"></div>
            <div className=" grid grid-cols-4 gap-6 items-start">
              {organizationList.map((e, i) => (
                <div
                  key={e.ORGANIZATION_ID}
                  className=" flex flex-row space-x-2 items-start w-48 px-1  "
                >
                  <button
                    onClick={() => {
                      handleGrantRevokeOrganization(i);
                    }}
                    className={`w-4 h-4 rounded-[4px] ${
                      e.IS_ASSOCIATED === 1
                        ? "bg-midGreen border-none"
                        : " border-[1px] border-borderColor bg-whiteColor"
                    }
                    flex justify-center items-center mt-1  `}
                  >
                    {
                      <img
                        src="/images/check.png"
                        alt="check"
                        className=" w-2 h-2"
                      />
                    }
                  </button>
                  <p className=" text-blackColor text-[12px] font-mon font-medium text-start flex-1">
                    {e.NAME}({e.SHORT_CODE})
                  </p>
                </div>
              ))}
            </div>
          </div> */}

          <div className=" h-12"></div>
          {/* <CommonButton onClick={roleSave} titleText={"Save"} width='w-20' color='bg-midGreen' height='h-8' />
                            <div className=' h-16'></div>
                            <p className=' text-blackColor text-[16px] font-mon font-semibold'>User Menu</p>
                            <div className=' h-5'></div>
                            <div className=' grid grid-cols-5 gap-6'>
                                {
                                    list.map((e, i) => (
                                        <button className=' flex flex-row space-x-3 items-center'>
                                            <div onClick={() => { }} className={`w-4 h-4 rounded-md border-[0.5px] border-borderColor flex justify-center items-center  bg-midGreen border-none `}>
                                                {

                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 text-white">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                    </svg>

                                                }
                                            </div>
                                            <p className=' text-blackColor text-sm font-mon font-medium'>
                                                Dashboard
                                            </p>

                                        </button>
                                    ))
                                }
                            </div>
                            <div className=' h-12'></div>
                            <CommonButton onClick={menuSave} titleText={"Save"} width='w-20' height='h-8' color='bg-midGreen' />
                            <div className=' h-16'></div> */}
          {/* <p className=" text-blackColor text-[16px] font-mon font-semibold">
            Create Role
          </p>
          <div className="h-4"></div>
          <div className=" flex flex-row space-x-4 items-center">
            <CommonInputField
              onChangeData={handleChangeRole}
              hint="My Role"
              type="text"
              inputRef={roleRef}
            />
            <CommonButton
              onClick={createRole}
              titleText={"Create Role"}
              width="w-36"
              color="bg-blue-500"
            />
          </div> */}
          <div className=" h-6"></div>
          {/* <div className=' flex flex-row space-x-10 items-center'>
                                <button className=' flex flex-row space-x-3 items-center'>
                                    <div onClick={() => { }} className={`w-4 h-4 rounded-md border-[0.5px] border-borderColor flex justify-center items-center    `}>
                                        {

                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 text-white">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>

                                        }
                                    </div>
                                    <p className=' text-graishColor text-sm font-mon font-medium'>
                                        Select All
                                    </p>

                                </button>
                                <button className=' flex flex-row space-x-3 items-center'>
                                    <div onClick={() => { }} className={`w-4 h-4 rounded-md border-[0.5px] border-borderColor flex justify-center items-center   `}>
                                        {

                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 text-white">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>

                                        }
                                    </div>
                                    <p className=' text-graishColor text-sm font-mon font-medium'>
                                        Unselect All
                                    </p>

                                </button>
                            </div>
                            <div className=' h-8'></div> */}
          {isRoleCreationLoading ? (
            <div className=" w-full flex justify-center items-center">
              <CircularProgressIndicator />
            </div>
          ) : !isRoleCreationLoading && menuList.length === 0 ? null : (
            <>
              <p className=" text-blackColor text-[16px] font-mon font-semibold">
                Permission
              </p>
              <div className=" h-8"></div>
              <div className=" grid grid-cols-5 gap-6">
                {permissionList?.map((e, i) => (
                  <div className=" w-40 flex flex-row space-x-2 items-center">
                    <button
                      onClick={() => {
                        togglePermission(e);
                      }}
                      className={`w-4 h-4 rounded-[4px]  flex justify-center items-center  
                      ${
                        selectedPermissionList.some(
                          (permission) =>
                            permission.PERMISSION_ID === e.PERMISSION_ID
                        )
                          ? "bg-midGreen border-none"
                          : "border-[1px] border-borderColor bg-whiteColor"
                      }
                      `}
                    >
                      {
                        <img
                          src="/images/check.png"
                          alt="check"
                          className=" w-2 h-2"
                        />
                      }
                    </button>
                    <p className=" text-blackColor text-sm font-mon font-medium text-start">
                      {e.PERMISSION_NAME}
                    </p>
                  </div>
                ))}
              </div>
              <div className=" h-8"></div>
              <p className=" text-blackColor text-[16px] font-mon font-semibold">
                Menu
              </p>
              <div className=" h-8"></div>
              <div className=" grid grid-cols-5 gap-6">
                {menuList?.map((e, i) => (
                  <div className=" w-40 flex flex-row space-x-3 items-center">
                    <button
                      onClick={() => {
                        toggleMenu(e);
                      }}
                      className={`w-4 h-4 rounded-md  flex justify-center items-center   ${
                        selectedMenuList.some(
                          (menu) => menu.MENU_ID === e.MENU_ID
                        )
                          ? "bg-midGreen border-none"
                          : "border-[0.5px] border-borderColor bg-whiteColor"
                      }
                                        
                                            `}
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
                    <p className=" text-blackColor text-sm font-mon font-medium text-start">
                      {e.MENU_NAME}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
          {/* <div className=' h-12'></div>

                            <CommonButton onClick={roleSave} titleText={"Save"} width='w-20' height='h-8' color='bg-midGreen' /> */}

          <div className=" h-20"></div>
        </>
      )}

      {/* reset password modal start */}

      {/* <Modal show={isResetPasswordModalOpen} position="center"> */}

      {isResetPasswordModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-opacity-50 bg-gray-700">
          <div className="w-[491.5px] h-[240px] relative bg-white rounded-[10px]">
            <div className="w-[283px] h-[83px] flex justify-center items-start left-[104.5px] top-[15px] absolute rounded-full">
              <div className="mt-6 h-14 w-14 rounded-full bg-red-100 flex justify-center items-center">
                <WarningIcon className="text-red-400" />
              </div>
            </div>
            <div className="w-full flex justify-center items-center top-[100px] absolute text-neutral-700 text-[16px] font-bold font-mon">
              Warning !!!
            </div>
            <div className="w-full flex justify-center items-center px-8 top-[130px] absolute text-neutral-700 text-sm font-mon font-medium">
              Are you sure you want to reset password?
            </div>

            <div className="w-full flex space-x-4 h-7 top-[181px] absolute px-4 justify-center items-center">
              <button
                onClick={confirmResetPassword}
                className="h-10 w-28 rounded-[8px] bg-red-500 text-white text-md font-medium font-mon"
              >
                Yes
              </button>
              <button
                onClick={closeResetModal}
                className="h-10 w-28 rounded-[8px] bg-white border-[1px] border-borderColor text-md font-medium font-mon text-black"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {/* </Modal> */}

      {/* reset password modal end */}
    </div>
  );
}
