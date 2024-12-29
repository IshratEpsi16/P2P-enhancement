import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import logo from "../../../public/logo512.png";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import DeclarationPage from "../../registration/component/DeclarationPage";

import GeneralTermsPage from "../../buyer_section/general_terms/components/GeneralTermsPage";
import BuyerRfqTermPage from "../../buyer_section/buyer_term/component/BuyerRfqTermPage";
import BuyerHome from "./BuyerHome";
import CreateRolePage from "../../role_access/component/CreateRolePage";
import RfqUnlockPage from "../../rfq_unlock/component/RfqUnlockPage";
import SupplierListPage from "../../manage_supplier/component/SupplierListPage";
import GetBuyerMenuService from "../service/GetBuyerMenuService";

import BuyerMenuInterface from "../interface/BuyerMenuInterface";
import ApprovedPrPage from "../../buyer_section/pr/component/ApprovedPrPage";
import RoleMenuPermissionManager from "../../role_access/component/RoleMenuPermissionManager";
import PrItemListPage from "../../buyer_section/pr_item_list/component/PrItemListPage";
import PageTitle from "../../common_component/PageTitle";
import { Dashboard } from "@mui/icons-material";
import InviteSupplierForRfqPage from "../../buyer_section/invite_supplier_for_rfq/component/InviteSupplierForRfqPage";
import RfqPreviewPage from "../../buyer_section/rfq_preview/component/RfqPreviewPage";
import BuyerRfqCreateProcessPage from "../../buyer_rfq_create/component/BuyerRfqCreateProcessPage";
import {
  RfqCreateProcessProvider,
  useRfqCreateProcessContext,
} from "../../buyer_rfq_create/context/RfqCreateContext";
import RfqListPage from "../../rfq/component/RfqListPage";
import {
  RfqPageProvider,
  useRfqPageContext,
} from "../../rfq/context/RfqPageContext";
import RfqHomePage from "../../rfq/component/RfqHomePage";
import CsListPage from "../../cs_admin_approval/component/CsListPage";
import { CsApprovalProvider } from "../../cs_admin_approval/context/CsApprovalContext";
import CsApprovalHomePage from "../../cs_admin_approval/component/CsApprovalHomePage";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../login_both/context/AuthContext";
import { isTokenValid } from "../../utils/methods/TokenValidityCheck";

import {
  RoleAccessProvider,
  useRoleAccessContext,
} from "../../role_access/context/RoleAccessContext";
import UserRolePage from "../../role_access/component/UserRolePage";
import RoleManagementHome from "../../role_access/component/RoleManagementHome";
import MyInfoService from "../../my_info/service/MyInfoService";
import {
  MyMenuInterface,
  MyPermissionInterface,
  MyInfoInterface,
} from "../../my_info/interface/MyInfoInterface";
import InvitationPage from "../../invitation/component/InvitationPage";
import { useMenuContext } from "../../my_info/context/MenuContext";
import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";

import ErrorToast, { showErrorToast } from "../../Alerts_Component/ErrorToast";
import EmployeeForSyncPage from "../../employee_sync/component/EmployeeForSyncPage";
import {
  ManageSupplierProvider,
  useManageSupplierContext,
} from "../../manage_supplier/interface/ManageSupplierContext";
import ManageSupplierHome from "../../manage_supplier/component/ManageSupplierHome";
import SupplierProfilePage from "../../supplier_profile/component/SupplierProfilePage";
import SearchIcon from "../../icons/SearchIcon";

import InviteHomePage from "../../invitation/component/InviteHomePage";
import { Link, useParams } from "react-router-dom";
import BarRightIcon from "../../icons/BarRightIcon";
import BarLeftIcon from "../../icons/BarLeftIcon";
import BellIcon from "../../icons/BellIcon";
import ApprovalSetupPage from "../../approval_setup/component/ApprovalSetupPage";
import {
  ApprovalSetupProvider,
  useApprovalSetupContext,
} from "../../approval_setup/context/ApprovalSetupContext";
import ApprovalSetupHomePage from "../../approval_setup/component/ApprovalSetupHomePage";
import deleteFromLocalStorage from "../../utils/methods/deleteFromLocalStorage";
import {
  ManageSupplierProfileUpdateProvider,
  useManageSupplierProfileUpdateContext,
} from "../../manage_supplier_profile_update/context/ManageSupplierProfileUpdateContext";
import SupplierListHomeForUpdateSupplier from "../../manage_supplier_profile_update/component/SupplierListHomeForUpdateSupplier";
import {
  RfiManageSupplierProvider,
  useRfiManageSupplierContext,
} from "../../rfi_in_supplier_registration/context/RfiManageSupplierContext";
import RfiHomeSupplierListPage from "../../rfi_in_supplier_registration/component/RfiHomeSupplierListPage";
import {
  MouPageProvider,
  useMouPageContext,
} from "../../supplier_ou_manage/context/MouPageContext";
import SupplierOuManageHomePage from "../../supplier_ou_manage/component/SupplierOuManageHomePage";
import { PoPageProvider } from "../../po/context/PoPageContext";
import PoHomePage from "../../po/component/PoHomePage";
import LogOutModal from "../../common_component/LogoutModal";
import GrnHomePage from "../../grn/component/GrnHomePage";
import RfiSupplierInterface from "../../rfi_in_supplier_registration/interface/RfiSupplierInterface";
import RfiSupplierListService from "../../rfi_in_supplier_registration/service/RfiSupplierListService";
import useRfiStore from "../../rfi_in_supplier_registration/store/RfiStore";
import RegisteredSupplierListNeedToApproveService from "../../manage_supplier/service/RegisteredSupplierListNeedToApproveService";
import useManageSupplierStore from "../../manage_supplier/store/manageSupplierStore";
import useProfileUpdateStore from "../../manage_supplier_profile_update/store/profileUpdateStore";
import SupplierListForUpdateProfileApprovalService from "../../manage_supplier_profile_update/service/SupplierListForUpdateApprovalService";
import BuyerProfilePage from "../../buyer_profile/component/BuyerProfilePage";
import BuyerInvoiceHome from "../../buyer_invoice/component/BuyerInvoiceHome";
import { log, profile } from "console";
import useAuthStore from "../../login_both/store/authStore";
import usePrItemsStore from "../../buyer_section/pr/store/prItemStore";
import {
  getNotificationDescription,
  NotificationLookup,
} from "../../manage_supplier_profile_update/utils/NotificationLookup";
import SupplierInterface from "../../manage_supplier/interface/SupplierInterface";
import CsAndRfqHomePage from "../../cs_and_rfq/component/CsAndRfqHomePage";
import usePermissionStore from "../../utils/store/PermissionStore";
import useCountStore from "../store/countStore";
import SupplierListForProfileUpdatePage from "../../manage_supplier_profile_update/component/SupplierListForProfileUpdatePage";
import SupplierListForUpdateProfileInfoService from "../../manage_supplier_profile_update/service/SupplierListForUpdateProfileInfoService";
import SystemSetupPage from "../../system_setup/component/SystemSetupPage";
import { FaUserCircle } from "react-icons/fa";
import NotificationService from "../service/NotificationService";
import NotificationReadService from "../service/NotificationReadService";
import { IoIosNotificationsOutline } from "react-icons/io";
import ArrowUpIcon from "../../icons/ArrowUpIcon";
import InfiniteScroll from "react-infinite-scroll-component";
import { Player } from "@lottiefiles/react-lottie-player";
import loaderJson from "../../jsons/loader.json";
import { Oval } from "react-loader-spinner";
import NotificationMarkAllReadService from "../service/NotificationMarkAllReadService";
import WarningModal from "../../common_component/WarningModal";
import CreateShipmentNotice from "../../po_supplier/component/CreateShipmentNotice";
import BuyerPoHome from "../../po_buyer/component/BuyerPoHome";
import ShipmentReceiveListPage from "../../shipment_receive/component/ShipmentReceiveListPage";
import useBuyerInvoiceStore from "../../buyer_invoice/store/buyerInvoiceStore";
import BuyerInvoiceListService from "../../buyer_invoice/service/BuyerInvoiceListService";
import useCsApprovalStore from "../../cs_admin_approval/store/csApprovalStore";
import PendingCsService from "../../cs_admin_approval/service/PendingCsService";
import ShipmentAcceptReceiveHomePage from "../../shipment_receive/component/ShipmentAcceptReceiveHomePage";
import useBuyerPoStore from "../../po_buyer/store/BuyerPoStore";
import useCsAndRfqStore from "../../cs_and_rfq/store/csAndRfqStore";
import useCsCreationStore from "../../cs/store/CsCreationStore";
import fetchFileUrlService from "../../common_service/fetchFileUrlService";
import SupplierSyncEbsPage from "../../buyer_section/supplier sync/component/SupplierSyncEbsPage";

const menuIcons: { [key: number]: string } = {
  520: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5",
  530: "M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25",
  560: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
  570: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
  550: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z",
  500: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25",
  540: "M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46",
  510: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5",
  580: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z",
  600: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5",
  610: "M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3",
  620: "M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z",
  630: "M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z",

  640: "M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25",
  660: "M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25",
  680: "m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z",
  700: "m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z",
  710: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z",
  720: "M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75",
  730: "M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25",
  760: "M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z",
  780: "M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z",
  790: "M15 6.34691H6.99996M15 11.27H6.99996M15 16.1931H9.66663M1.66663 1.42383H20.3333V23.5777L18.9573 22.4897C18.474 22.1073 17.8585 21.8972 17.222 21.8972C16.5854 21.8972 15.9699 22.1073 15.4866 22.4897L14.1106 23.5777L12.736 22.4897C12.2526 22.107 11.6368 21.8966 11 21.8966C10.3631 21.8966 9.74735 22.107 9.26396 22.4897L7.88929 23.5777L6.51329 22.4897C6.02999 22.1073 5.41447 21.8972 4.77796 21.8972C4.14145 21.8972 3.52593 22.1073 3.04263 22.4897L1.66663 23.5777V1.42383Z",
  800: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z",
  810: "M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3",
};

export default function BuyerHomePage() {
  // const [menu, setMenu] = useState(1);
  const [menuList, setMenuList] = useState<MyMenuInterface[] | []>([]);
  const [menuList2, setMenuList2] = useState<MyMenuInterface[] | []>([]);
  const [permissionList, setPermissionList] = useState<
    MyPermissionInterface[] | []
  >([]);
  const [myInfo, setMyInfo] = useState<MyInfoInterface | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [supplierListProfileUpdate, setSUpplierListProfileUpdate] = useState<
    {
      ORGANIZATION_NAME: string;
    }[]
  >([]);
  const [
    registersupplierListProfileUpdate,
    setRegisterSUpplierListProfileUpdate,
  ] = useState<
    {
      ORGANIZATION_NAME: string;
    }[]
  >([]);

  const {
    token,
    setIsBuyer,
    setToken,
    setUserId,
    userId,
    setBgId,
    setSupplierId,
    setBuyerId,
    setDepartment,
  } = useAuth();
  const { menu, setMenu } = useMenuContext();
  const [isSmall, setIsSmall] = useState<boolean>(false);
  const navigate = useNavigate();
  const { bmId } = useParams();
  const [unseenTotal, setUnseenTotal] = useState<number>();
  const [supplierList, setSupplierList] = useState<
    {
      ID: number;
      INITIATION_DATE: string;
      INITIATOR_ID: number;
      INITIATOR_NAME: string;
      INITIATOR_NOTE: string;
      INITIATOR_PRO_PIC: string;
      OBJECT_ID: number;
      OBJECT_TYPE: string;
      SUPPLIER_FULL_NAME: string;
      SUPPLIER_ORGANIZATION_NAME: string;
      SUPPLIER_USER_NAME: string;
      VIEWER_ACTION: number;
      VIEWER_ID: number;
      VIEWER_NAME: string;
      VIEWER_NOTE: string;
      VIEWER_PRO_PIC: string;
      VIEW_DATE: string;
      PROPIC_FILE_NAME: string;
      PROFILE_PIC1_FILE_NAME: string;
      PROFILE_PIC2_FILE_NAME: string;
      SHOW_MSG: string;
    }[]
  >([]);

  const [notificationList, setNotificationList] = useState<
    {
      CREATED_BY: string;
      CREATION_DATE: string;
      FOR_USER_FULL_NAME: string;
      FOR_USER_ID: number;
      FOR_USER_USER_NAME: string;
      ID: number;
      IS_READ: number;
      LAST_UPDATED_BY: string;
      LAST_UPDATE_DATE: string;
      MESSAGE: string;
      OBJECT_ID: number;
      OBJECT_TYPE: string;
      OBJECT_TYPE2: string;
      OWNER_FULL_NAME: string;
      OWNER_ID: number;
      PROPIC_FILE_NAME: string;
      PROFILE_PIC1_FILE_NAME: string;
      PROFILE_PIC2_FILE_NAME: string;

      SHOW_MSG: string;
      SUPPLIER_ORGANIZATION_NAME: string;
    }[]
  >([]);

  const [profilePicPath, setProfilePicPath] = useState<string>("");
  const [profilePicPath1, setProfilePicPath1] = useState<string>("");
  const [profilePicPath2, setProfilePicPath2] = useState<string>("");
  // console.log(supplierList.length);
  // const navigate = useNavigate();
  // const {
  //   isActiveButtonRegistration,
  //   setIsActiveButtonRegistration,
  //   isActiveButtonRFQ,
  //   setIsActiveButtonRFQ,
  //   isActiveButtonVAT,
  //   setIsActiveButtonVAT,
  // } = useRfiManageSupplierContext();

  const { setRfqIdInStore } = usePrItemsStore(); //setRfqObjectIdInStore

  //store
  const { setLoggedInUserName } = useAuthStore();
  const { setRfiTabNo, rfiTabNo } = useRfiStore();
  //store
  const { appStatus, setAppStatus, setIsApprovedSupplier, isApprovedSupplier } =
    useProfileUpdateStore();
  const {
    isRegisterApprovedSupplier,
    setisRegisterApprovedSupplier,
    registerAppStatus,
    setRegisterAppStatus,
  } = useManageSupplierStore();
  useEffect(() => {
    const isTokenExpired = !isTokenValid(token!);
    // console.log(isTokenExpired);
    if (isTokenExpired) {
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("isBuyer");
        localStorage.removeItem("userId");
        localStorage.removeItem("bgId");
        localStorage.removeItem("buyerId");
        localStorage.removeItem("department");
        // deleteFromLocalStorage("isBuyer");
        setToken(null);
        setIsBuyer(null);
        setUserId(null);
        setBuyerId(null);
        setDepartment(null);
        navigate("/");
      }, 999);

      showErrorToast("Session Expired, Please Login");

      setTimeout(() => { }, 1100);

      console.log("expired");
    } else {
      getMyInfo();
      allFunctionCall();
      console.log(isTokenExpired);
    }

    console.log(token);

    // Perform any other initialization based on the token

    // getMenu(); // You can uncomment this line if needed
  }, []);

  const allFunctionCall = async () => {
    getRfiSupplierList();
    getSupplierList();
    getUpdateSupplierList();
    getSupplierNewInfo();
  };

  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (open: any) => (event: any) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ right: open });
  };

  //permission store

  const { setIsByerNameSearchPermission, setIsRfqAllViewPermissionInStore } = usePermissionStore();

  interface Permission {
    PERMISSION_ID: number;
    PERMISSION_NAME: string;
    P_DESCRIPTION: string;
  }

  //permission store

  const getMyInfo = async () => {
    setIsLoading(true);
    const result = await MyInfoService(token!);
    if (result.data.status) {
      setMenuList(result.data.Menu);
      setMenuList2(result.data.Menu);
      setPermissionList(result.data.Permission);
      setMyInfo(result.data);

      setBgId(result.data.data.BUSINESS_GROUP_ID);
      console.log(result.data);
      // myInfo?.data.FULL_NAME
      setLoggedInUserName(result.data.data.FULL_NAME);
      setUserId(result.data.data.USER_ID);

      localStorage.setItem(
        "bgId",
        result.data.data.BUSINESS_GROUP_ID.toString()
      );
      console.log("department", result.data.data.DEPARTMENT);

      localStorage.setItem("department", result.data.data.DEPARTMENT);
      setDepartment(result.data.data.DEPARTMENT || "");

      const isBuyer = checkPermission(result.data.Permission, "BuyerSearch");
      setIsByerNameSearchPermission(isBuyer);

      const isRfqALlView = checkPermission(result.data.Permission, "AllRFQView");
      setIsRfqAllViewPermissionInStore(isRfqALlView);

      console.log("rfqP", result.data.Permission);
      console.log("rfqPermission: ", isRfqALlView);

      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  //image url

  useEffect(() => {
    if (myInfo) {
      getImage();
    }
  }, [myInfo]);

  const [profilePicSrc, setProfilePicSrc] = useState<string | null>(null);

  const getImage = async () => {
    const url = await fetchFileUrlService(
      myInfo?.profile_pic_buyer!,
      myInfo?.data.PROFILE_PIC_FILE_NAME!,
      token!
    );
    console.log("url img:", url);

    setProfilePicSrc(url);
  };

  interface NotificationItem {
    CREATED_BY: string;
    CREATION_DATE: string;
    FOR_USER_FULL_NAME: string;
    FOR_USER_ID: number;
    FOR_USER_USER_NAME: string;
    ID: number;
    IS_READ: number;
    LAST_UPDATED_BY: string;
    LAST_UPDATE_DATE: string;
    MESSAGE: string;
    OBJECT_ID: number;
    OBJECT_TYPE: string;
    OBJECT_TYPE2: string;
    OWNER_FULL_NAME: string;
    OWNER_ID: number;
    PROPIC_FILE_NAME: string;
    PROFILE_PIC1_FILE_NAME: string;
    PROFILE_PIC2_FILE_NAME: string;

    SHOW_MSG: string;
    SUPPLIER_ORGANIZATION_NAME: string;
  }

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
    const fetchImages = async () => {
      const newImageUrls: ImageUrls = {};
      for (const item of notificationList) {
        let imageUrl: string | null = null;
        if (item.PROPIC_FILE_NAME) {
          imageUrl = await getImage2(profilePicPath, item.PROPIC_FILE_NAME);
        } else if (item.PROFILE_PIC1_FILE_NAME) {
          imageUrl = await getImage2(
            profilePicPath1,
            item.PROFILE_PIC1_FILE_NAME
          );
        } else if (item.PROFILE_PIC2_FILE_NAME) {
          imageUrl = await getImage2(
            profilePicPath2,
            item.PROFILE_PIC2_FILE_NAME
          );
        }
        newImageUrls[item.ID] = imageUrl;
      }
      setImageUrls(newImageUrls);
    };

    fetchImages();
  }, [notificationList, profilePicPath, profilePicPath1, profilePicPath2]);

  function checkPermission(
    permissions: Permission[],
    permissionName: string
  ): boolean {
    for (const permission of permissions) {
      if (permission.PERMISSION_NAME === permissionName) {
        return true;
      }
    }
    return false;
  }

  //rfilength
  const { rfiSupplierListlength, setRfiSupplierListlength } = useRfiStore();

  const getRfiSupplierList = async () => {
    setIsLoading(true);
    console.log(userId);

    try {
      const result = await RfiSupplierListService(
        token!,
        null,
        userId,
        0,
        null
      );
      console.log(result.data);

      if (result.data.status === 200) {
        console.log(result.data.data);
        setSupplierList(result.data.data);

        setRfiSupplierListlength(result.data.data.length);
        console.log("rfi list len", result.data.data.length);

        setIsLoading(false);
      } else {
        setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      showErrorToast("Something went wrong");
    }
  };

  console.log(supplierList);

  //rfiLength

  //manager supplier list length

  const pending = "IN PROCESS";
  const approved = "APPROVED";

  const { manageSupplierListLength, setManageSupplierListLength } =
    useManageSupplierStore();

  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  // new notification start here
  useEffect(() => {
    getNotification(0);
  }, []);

  const getNotification = async (newPage: number) => {
    const result = await NotificationService(token!, newPage, 20);
    console.log("Notification: ", result.data);

    // setNotificationList(result.data.data);

    const newNotifications = result.data.data;

    setNotificationList((prevNotifications) => [
      ...prevNotifications,
      ...newNotifications,
    ]);

    setProfilePicPath(result.data.profile_pic);
    setProfilePicPath1(result.data.profile_pic1);
    setProfilePicPath2(result.data.profile_pic2);
    // setUnseenTotalNotificationInStore(result.data.unseen);
    setUnseenTotal(result.data.unseen);
    console.log("unseen total:", result.data);

    if (newNotifications.length < 20) {
      setHasMore(false);
    }
  };

  const fetchMoreData = () => {
    // setPage(prevPage => prevPage + 1);
    // getNotification(page + 1);

    const nextPage = page + 20;
    setPage(nextPage);
    getNotification(nextPage);
  };

  const handleNotificationClick = async (index: number, id: number) => {
    const updatedNotifications = [...notificationList];
    updatedNotifications[index].IS_READ = 1;

    const result = await NotificationReadService(token!, id);

    console.log("handleNotificationClick: ", updatedNotifications);

    setNotificationList(updatedNotifications);
    // navigateToRoute(680);
    // setRfiTabNo(33);
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

    // Less than 1 hour ago
    if (secondsAgo < 3600) {
      const minutesAgo = Math.floor(secondsAgo / 60);
      return `${minutesAgo} ${minutesAgo !== 1 ? "minutes" : "minute"} ago`;
    }

    // Less than 24 hours ago
    if (secondsAgo < 86400) {
      const hoursAgo = Math.floor(secondsAgo / 3600);
      return `${hoursAgo} ${hoursAgo !== 1 ? "hours" : "hour"} ago`;
    }

    // Between 24 and 48 hours ago
    if (secondsAgo >= 86400 && secondsAgo < 172800) {
      return "Yesterday";
    }

    // Date format for older dates
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  // new notification end

  const getSupplierList = async () => {
    // setIsLoading(true);
    try {
      const result = await RegisteredSupplierListNeedToApproveService(
        token!,
        "IN PROCESS",
        ""
      );
      setRegisterSUpplierListProfileUpdate(result.data.data);
      if (result.data.status === 200) {
        setRegisterSUpplierListProfileUpdate(result.data.data);
        setManageSupplierListLength(result.data.data.length);
        console.log("regitration list", result.data.data.length);
      } else {
        // setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      // setIsLoading(false);
      showErrorToast("Something went wrong");
    }
  };

  //manager supplier list length

  // const { setRfiManageSupplierPageNo, setRfiId, rfiManageSupplierPageNo } =
  //   useRfiManageSupplierContext();

  const navigateTo = (userId: number, rfiId: number) => {
    console.log("userId: ", userId);
    console.log("rfiId: ", rfiId);
    console.log("clicked");
    // setRfiManageSupplierPageNo(2);
    // setSupplierId(userId);
    // setRfqIdInStore(userId);
    // setRfiId(objId);
    // setRfqObjectIdInStore(objId);

    // setRfiManageSupplierPageNo(2);
    // setSupplierId(userId);
    // setRfiId(rfiId);
  };
  // console.log(rfiManageSupplierPageNo);
  //profile update supplier list length

  const {
    profileUpdateSupplierListLength,
    setProfileUpdateSupplierListLength,
    // setUnseenTotalNotificationInStore,
    // unseenTotalNotificationInStore,
  } = useProfileUpdateStore();

  // const getRegisterSupplierList = async (approvalStatus: string) => {
  //   setIsLoading(true);
  //   try {
  //     const result = await RegisteredSupplierListNeedToApproveService(
  //       token!,
  //       "IN PROCESS",
  //       ""
  //     );
  //     console.log(result.data.data);
  //     setRegisterSUpplierListProfileUpdate(result.data.data);
  //     if (result.data.status === 200) {
  //       // setProfilePicOnePath(result.data.profile_pic1);
  //       // setProfilePicTwoPath(result.data.profile_pic2);
  //       setRegisterSUpplierListProfileUpdate(result.data.data);
  //       setManageSupplierListLength(result.data.data.length);
  //       setIsLoading(false);
  //     } else {
  //       setIsLoading(false);
  //       showErrorToast(result.data.message);
  //     }
  //   } catch (error) {
  //     setIsLoading(false);
  //     showErrorToast("Something went wrong");
  //   }
  // };

  const getUpdateSupplierList = async () => {
    // console.log("executed");

    setIsLoading(true);
    try {
      const result = await SupplierListForUpdateProfileApprovalService(
        token!,
        "IN PROCESS",
        ""
      );

      console.log(result.data.data);
      setSUpplierListProfileUpdate(result.data.data);

      if (result.data.status === 200) {
        setIsLoading(false);

        setSUpplierListProfileUpdate(result.data.data);
        setProfileUpdateSupplierListLength(result.data.data.length);
        console.log("profile update len", result.data.data.length);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      showErrorToast("Something went wrong");
    }
  };
  // const gotoVat = () => {
  //   setRfiManageSupplierPageNo(5);
  // };

  const { setProfileSupplierNewAddLength, profileNewAddSupplierLength } =
    useCountStore();

  const getSupplierNewInfo = async () => {
    try {
      const result = await SupplierListForUpdateProfileInfoService(
        token!,
        "IN PROCESS",
        ""
      );

      console.log(result.data);

      if (result.data.status === 200) {
        setProfileSupplierNewAddLength(result.data.data.length);
        // setProfileUpdateSupplierListLengthNew(result.data.data.length);
        console.log("new info len: ", result.data.data.length);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Something went wrong");
    }
  };

  const handleMarkAll = async () => {
    setIsLoading(true);
    const result = await NotificationMarkAllReadService(token!);

    const updatedNotificationList = notificationList.map((notification) => ({
      ...notification,
      IS_READ: 1, // Mark all notifications as read
    }));

    setNotificationList(updatedNotificationList);

    setUnseenTotal(0);

    console.log("mark all", result);
    setIsLoading(false);
  };

  const navigateToRoute = (route: number) => {
    // Navigate to the route associated with the notification
    setMenu(route); // Use window.location.href for full page reload
  };
  // const navigateToRoute = (routeTo: string) => {
  //   navigate(routeTo);
  // };
  console.log(registersupplierListProfileUpdate);
  //profile update supplier list length
  console.log(supplierListProfileUpdate);
  const list = (
    <Box
      sx={{ width: 400 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <div className=" mt-4 pb-2 px-3 border-b-[0.5px] border-gray-200 flex items-center justify-between">
        <h1 className="text-[16px] font-bold text-left">Notification</h1>

        <h2
          className="font-semibold text-[12px] text-blue-500 cursor-pointer"
          onClick={handleMarkAll}
        >
          Mark all as read
        </h2>
      </div>
      {/* {getNotificationDescription} */}
      {/* <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} //
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}

      {/* new notification start here */}
      <div
        id="parentScrollDiv"
        className=" h-full bg-white"
        style={{ overflow: "auto" }}
      >
        <InfiniteScroll
          dataLength={notificationList.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={
            <p>
              <Oval
                visible={true}
                height="30"
                width="full"
                color="red"
                secondaryColor="gray"
                strokeWidth={3}
                strokeWidthSecondary={3}
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </p>
          }
          // endMessage={<p>No more data</p>}
          scrollableTarget="parentScrollDiv"
        >
          {notificationList.map((item, i) => (
            <div
              key={i}
              className={`py-4 px-3 cursor-pointer border-b-[.5px] border-gray-200 divide-y font-mon ${item.IS_READ === 0 ? "bg-[#ebf2fa]" : ""
                }`}
              onClick={() => handleNotificationClick(i, item.ID)}
            >
              {item.OBJECT_TYPE === "rfi" && (
                <div
                  onClick={() => {
                    navigateToRoute(680);
                    setRfiTabNo(11);
                  }}
                  className="flex items-start justify-between space-x-3"
                >
                  <div className="flex items-start space-x-3">
                    {imageUrls[item.ID] ? (
                      <img
                        className="w-9 h-9 rounded-full"
                        src={imageUrls[item.ID]!}
                        alt="avatar"
                      />
                    ) : (
                      <FaUserCircle className="w-9 h-9 text-gray-300" />
                    )}
                    <div className="w-56">
                      <h1 className="text-[12px]">
                        <span
                          className="text-[rgb(25,25,25)]"
                          dangerouslySetInnerHTML={{ __html: item.SHOW_MSG }}
                        />
                      </h1>
                    </div>
                  </div>
                  <div className="">
                    <p className="text-[11px] text-slate-400">
                      {getTimeAgo(item.CREATION_DATE)}
                    </p>
                  </div>
                </div>
              )}

              {item.OBJECT_TYPE === "vat" && (
                <div
                  onClick={() => {
                    navigateToRoute(680);
                    setRfiTabNo(55);
                  }}
                  className="flex items-start justify-between space-x-3"
                >
                  <div className="flex items-start space-x-3">
                    {imageUrls[item.ID] ? (
                      <img
                        className="w-9 h-9 rounded-full"
                        src={imageUrls[item.ID]!}
                        alt="avatar"
                      />
                    ) : (
                      <FaUserCircle className="w-9 h-9 text-gray-300" />
                    )}
                    <div className="w-56">
                      <h1 className="text-[12px]">
                        <span
                          className="text-[rgb(25,25,25)]"
                          dangerouslySetInnerHTML={{ __html: item.SHOW_MSG }}
                        />
                      </h1>
                    </div>
                  </div>
                  <div className="">
                    <p className="text-[12px] text-slate-400">
                      {getTimeAgo(item.CREATION_DATE)}
                    </p>
                  </div>
                </div>
              )}

              {item.OBJECT_TYPE2 === "cs" && (
                <div
                  onClick={() => {
                    navigateToRoute(680);
                    setRfiTabNo(77);
                  }}
                  className="flex items-start justify-between space-x-3"
                >
                  <div className="flex items-start space-x-3">
                    {imageUrls[item.ID] ? (
                      <img
                        className="w-9 h-9 rounded-full"
                        src={imageUrls[item.ID]!}
                        alt="avatar"
                      />
                    ) : (
                      <FaUserCircle className="w-9 h-9 text-gray-300" />
                    )}
                    <div className="w-56">
                      <h1 className="text-[12px]">
                        <span
                          className="text-[rgb(25,25,25)]"
                          dangerouslySetInnerHTML={{ __html: item.SHOW_MSG }}
                        />
                      </h1>
                    </div>
                  </div>
                  <div className="">
                    <p className="text-[12px] text-slate-400">
                      {getTimeAgo(item.CREATION_DATE)}
                    </p>
                  </div>
                </div>
              )}

              {item.OBJECT_TYPE === "new_rfq" && (
                <div
                  onClick={() => {
                    navigateToRoute(680);
                    setRfiTabNo(33);
                  }}
                  className="flex items-start justify-between space-x-3"
                >
                  <div className="flex items-start space-x-3">
                    <img src="images/logo.png" className="w-10 h-10" alt="" />
                    <div className="w-56">
                      <h1 className="text-[12px]">
                        <span
                          className="text-[rgb(25,25,25)]"
                          dangerouslySetInnerHTML={{ __html: item.SHOW_MSG }}
                        />
                      </h1>
                    </div>
                  </div>
                  <div className="">
                    <p className="text-[12px] text-slate-400">
                      {getTimeAgo(item.CREATION_DATE)}
                    </p>
                  </div>
                </div>
              )}

              {item.OBJECT_TYPE === "supplier_approval" && (
                <div
                  onClick={() => {
                    navigateToRoute(640);
                    setRfiTabNo(11);
                  }}
                  className="flex items-start justify-between space-x-3"
                >
                  <div className="flex items-start space-x-3">
                    {imageUrls[item.ID] ? (
                      <img
                        className="w-9 h-9 rounded-full"
                        src={imageUrls[item.ID]!}
                        alt="avatar"
                      />
                    ) : (
                      <FaUserCircle className="w-9 h-9 text-gray-300" />
                    )}
                    <div className="w-56">
                      <h1 className="text-[12px]">
                        <span
                          className="text-[rgb(25,25,25)]"
                          dangerouslySetInnerHTML={{ __html: item.SHOW_MSG }}
                        />
                      </h1>
                    </div>
                  </div>
                  <div className="">
                    <p className="text-[12px] text-slate-400">
                      {getTimeAgo(item.CREATION_DATE)}
                    </p>
                  </div>
                </div>
              )}

              {item.OBJECT_TYPE === "prof_update" && (
                <div
                  onClick={() => {
                    navigateToRoute(660);
                  }}
                  className="flex items-start justify-between space-x-3"
                >
                  <div className="flex items-start space-x-3">
                    {imageUrls[item.ID] ? (
                      <img
                        className="w-9 h-9 rounded-full"
                        src={imageUrls[item.ID]!}
                        alt="avatar"
                      />
                    ) : (
                      <FaUserCircle className="w-9 h-9 text-gray-300" />
                    )}
                    <div className="w-56">
                      <h1 className="text-[12px]">
                        <span
                          className="text-[rgb(25,25,25)]"
                          dangerouslySetInnerHTML={{ __html: item.SHOW_MSG }}
                        />
                      </h1>
                    </div>
                  </div>
                  <div className="">
                    <p className="text-[12px] text-slate-400">
                      {getTimeAgo(item.CREATION_DATE)}
                    </p>
                  </div>
                </div>
              )}

              {item.OBJECT_TYPE === "rfi_reply" && (
                <div
                  onClick={() => {
                    navigateToRoute(730);
                    // setRfiTabNo(11);
                    //   // setRfiManageSupplierPageNo(3);
                    //   // setIsActiveButtonRegistration(false);
                    //   // setIsActiveButtonRFQ(true);
                    //   // setIsActiveButtonVAT(false);
                  }}
                  className="flex items-start justify-between space-x-3"
                >
                  <div className="flex items-start space-x-3">
                    {imageUrls[item.ID] ? (
                      <img
                        className="w-9 h-9 rounded-full"
                        src={imageUrls[item.ID]!}
                        alt="avatar"
                      />
                    ) : (
                      <FaUserCircle className="w-9 h-9 text-gray-300" />
                    )}
                    <div className="w-56">
                      <h1 className="text-[12px]">
                        <span
                          className="text-[rgb(25,25,25)]"
                          dangerouslySetInnerHTML={{ __html: item.SHOW_MSG }}
                        />
                      </h1>
                    </div>
                  </div>
                  <div className="">
                    <p className="text-[12px] text-slate-400">
                      {getTimeAgo(item.CREATION_DATE)}
                    </p>
                  </div>
                </div>
              )}

              {item.OBJECT_TYPE === "prof_new_info" && (
                <div
                  onClick={() => {
                    navigateToRoute(660);
                    setRfiTabNo(222);
                  }}
                  className="flex items-start justify-between space-x-3"
                >
                  <div className="flex items-start space-x-3">
                    {imageUrls[item.ID] ? (
                      <img
                        className="w-9 h-9 rounded-full"
                        src={imageUrls[item.ID]!}
                        alt="avatar"
                      />
                    ) : (
                      <FaUserCircle className="w-9 h-9 text-gray-300" />
                    )}
                    <div className="w-56">
                      <h1 className="text-[12px]">
                        <span
                          className="text-[rgb(25,25,25)]"
                          dangerouslySetInnerHTML={{ __html: item.SHOW_MSG }}
                        />
                      </h1>
                    </div>
                  </div>
                  <div className="">
                    <p className="text-[12px] text-slate-400">
                      {getTimeAgo(item.CREATION_DATE)}
                    </p>
                  </div>
                </div>
              )}

              {item.OBJECT_TYPE === "INVOICE" && (
                <div
                  onClick={() => {
                    navigateToRoute(680);
                    setRfiTabNo(222);
                  }}
                  className="flex items-start justify-between space-x-3"
                >
                  <div className="flex items-start space-x-3">
                    {imageUrls[item.ID] ? (
                      <img
                        className="w-9 h-9 rounded-full"
                        src={imageUrls[item.ID]!}
                        alt="avatar"
                      />
                    ) : (
                      <FaUserCircle className="w-9 h-9 text-gray-300" />
                    )}
                    <div className="w-56">
                      <h1 className="text-[12px]">
                        <span
                          className="text-[rgb(25,25,25)]"
                          dangerouslySetInnerHTML={{ __html: item.SHOW_MSG }}
                        />
                      </h1>
                    </div>
                  </div>
                  <div className="">
                    <p className="text-[12px] text-slate-400">
                      {getTimeAgo(item.CREATION_DATE)}
                    </p>
                  </div>
                </div>
              )}

              {item.OBJECT_TYPE === "prof_new_info_app " && (
                <div className="flex items-start justify-between space-x-3">
                  <div className="flex items-start space-x-3">
                    {imageUrls[item.ID] ? (
                      <img
                        className="w-9 h-9 rounded-full"
                        src={imageUrls[item.ID]!}
                        alt="avatar"
                      />
                    ) : (
                      <FaUserCircle className="w-9 h-9 text-gray-300" />
                    )}
                    <div className="w-56">
                      <h1 className="text-[12px]">
                        <span
                          className="text-[rgb(25,25,25)]"
                          dangerouslySetInnerHTML={{ __html: item.SHOW_MSG }}
                        />
                      </h1>
                    </div>
                  </div>
                  <div className="">
                    <p className="text-[12px] text-slate-400">
                      {getTimeAgo(item.CREATION_DATE)}
                    </p>
                  </div>
                </div>
              )}

              {item.OBJECT_TYPE === "prof_new_info_rej" && (
                <div className="flex items-start justify-between space-x-3">
                  <div className="flex items-start space-x-3">
                    {imageUrls[item.ID] ? (
                      <img
                        className="w-9 h-9 rounded-full"
                        src={imageUrls[item.ID]!}
                        alt="avatar"
                      />
                    ) : (
                      <FaUserCircle className="w-9 h-9 text-gray-300" />
                    )}
                    <div className="w-56">
                      <h1 className="text-[12px]">
                        <span
                          className="text-[rgb(25,25,25)]"
                          dangerouslySetInnerHTML={{ __html: item.SHOW_MSG }}
                        />
                      </h1>
                    </div>
                  </div>
                  <div className="">
                    <p className="text-[12px] text-slate-400">
                      {getTimeAgo(item.CREATION_DATE)}
                    </p>
                  </div>
                </div>
              )}

              {item.OBJECT_TYPE === "prof_update_rej" && (
                <div className="flex items-start justify-between space-x-3">
                  <div className="flex items-start space-x-3">
                    {imageUrls[item.ID] ? (
                      <img
                        className="w-9 h-9 rounded-full"
                        src={imageUrls[item.ID]!}
                        alt="avatar"
                      />
                    ) : (
                      <FaUserCircle className="w-9 h-9 text-gray-300" />
                    )}
                    <div className="w-56">
                      <h1 className="text-[12px]">
                        <span
                          className="text-[rgb(25,25,25)]"
                          dangerouslySetInnerHTML={{ __html: item.SHOW_MSG }}
                        />
                      </h1>
                    </div>
                  </div>
                  <div className="">
                    <p className="text-[12px] text-slate-400">
                      {getTimeAgo(item.CREATION_DATE)}
                    </p>
                  </div>
                </div>
              )}

              {item.OBJECT_TYPE === "prof_update_app" && (
                <div className="flex items-start justify-between space-x-3">
                  <div className="flex items-start space-x-3">
                    {imageUrls[item.ID] ? (
                      <img
                        className="w-9 h-9 rounded-full"
                        src={imageUrls[item.ID]!}
                        alt="avatar"
                      />
                    ) : (
                      <FaUserCircle className="w-9 h-9 text-gray-300" />
                    )}
                    <div className="w-56">
                      <h1 className="text-[12px]">
                        <span
                          className="text-[rgb(25,25,25)]"
                          dangerouslySetInnerHTML={{ __html: item.SHOW_MSG }}
                        />
                      </h1>
                    </div>
                  </div>
                  <div className="">
                    <p className="text-[12px] text-slate-400">
                      {getTimeAgo(item.CREATION_DATE)}
                    </p>
                  </div>
                </div>
              )}

              {item.OBJECT_TYPE === "new_po_rejected" && (
                <div className="flex items-start justify-between space-x-3">
                  <div
                    onClick={() => {
                      navigateToRoute(710);
                      // setRfiTabNo(33);
                      //   // setRfiManageSupplierPageNo(3);
                      //   // setIsActiveButtonRegistration(false);
                      //   // setIsActiveButtonRFQ(true);
                      //   // setIsActiveButtonVAT(false);
                    }}
                    className="flex items-start justify-between space-x-3"
                  >
                    <div className="flex items-start space-x-3">
                      {imageUrls[item.ID] ? (
                        <img
                          className="w-9 h-9 rounded-full"
                          src={imageUrls[item.ID]!}
                          alt="avatar"
                        />
                      ) : (
                        <FaUserCircle className="w-9 h-9 text-gray-300" />
                      )}
                      <div className="w-56">
                        <h1 className="text-[12px]">
                          <span
                            className="text-[rgb(25,25,25)]"
                            dangerouslySetInnerHTML={{ __html: item.SHOW_MSG }}
                          />
                        </h1>
                      </div>
                    </div>
                    <div className="">
                      <p className="text-[12px] text-slate-400">
                        {getTimeAgo(item.CREATION_DATE)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </InfiniteScroll>
      </div>

      {/* new notification end */}

      <div className="h-10"></div>

      {/* <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} //
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </Box>
  );

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const [profileOpen, setProfileOpen] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setProfileOpen(!profileOpen);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setProfileOpen(false);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isBuyer");
    localStorage.removeItem("userId");
    localStorage.removeItem("isByerNameSearchPermission");
    localStorage.removeItem("department");
    setIsRfqAllViewPermissionInStore(null);
    setMenu(500);
    setToken(null);
    setIsBuyer(null);
    setUserId(null);
    setDepartment(null);
    clearStoreAndContext();
    navigate("/");
  };

  const handleIsSmall = () => {
    setIsSmall(!isSmall);
  };

  const handleMenuChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value !== null) {
      const menus = menuList2.filter((menu) =>
        menu.MENU_NAME.toLowerCase().includes(value)
      );
      setMenuList(menus);
    } else {
      setMenuList(menuList2);
    }
  };

  useEffect(() => {
    // Check if the id is present in the URL params
    const menuId = parseInt(bmId ?? "", 10);

    // If the id is valid, set the menu
    if (!isNaN(menuId) && menuId >= 500 && menuId <= 100000) {
      setMenu(menuId);
    } else {
      // If id is not valid, set a default menu (e.g., 1)
      setMenu(500);
    }
  }, [bmId]);

  //logout

  const [isLogOutOpen, setIsLogOutOpen] = useState<boolean>(false);
  const openLogOutModal = () => {
    setIsLogOutOpen(true);
  };
  const closeModal = () => {
    setIsLogOutOpen(false);
  };

  useEffect(() => {
    AllInvoiceList();
    getPendingCs();
  }, []);

  const { pendingInvoiceLength, setPendingInvoiceLength } =
    useBuyerInvoiceStore();

  const AllInvoiceList = async () => {
    const result = await BuyerInvoiceListService(
      token!,
      "IN PROCESS",
      "",
      0,
      100
    );
    if (result.statusCode === 200) {
      setPendingInvoiceLength(result.data.data.length);
    }
  };

  const { setPendingCsListLength, pendingCsListLength } = useCsApprovalStore();

  const getPendingCs = async () => {
    try {
      setIsLoading(true);

      const result = await PendingCsService(
        token!,
        "",
        "",
        "IN PROCESS",
        0,
        1000
      );
      console.log(result.data);

      if (result.data.status === 200) {
        setPendingCsListLength(result.data.data.length);
      } else {
      }
    } catch (error) {
      setIsLoading(false);
      showErrorToast("Pending CS List Load Failed");
    }
  };

  //clear store and context

  const { setPage: setRfqCreateProcessPageNo } = useRfqCreateProcessContext();

  // const { setPage: setRfqCreateProcessPageNo } = useRfqCreateProcessContext();

  const { setRfqPageNo } = useRfqPageContext();

  const { setManageSupplierPageNo } = useManageSupplierContext();

  const { setRoleAccessPageNo } = useRoleAccessContext();

  const { setApprovalSetupPageNo } = useApprovalSetupContext();

  // const { setManageSupplierPageNo } = useManageSupplierContext();

  const { setManageSupplierProfileUpdatePageNo } =
    useManageSupplierProfileUpdateContext();

  const { setRfiManageSupplierPageNo } = useRfiManageSupplierContext();

  const { setPage: setMouPageNo } = useMouPageContext();

  const { setPageNo: setBuyerPoPageNo } = useBuyerPoStore();

  const { setCsAndRfqPageNo } = useCsAndRfqStore();

  const { setCsApprovalPageNo } = useCsApprovalStore();

  const { setPageNo: setBuyerInvoicePageNo } = useBuyerInvoiceStore();

  const { setShipmentPageNo } = useRfiStore();
  const { setCsPageNo } = useCsCreationStore();

  const clearStoreAndContext = () => {
    setCsPageNo(1);
    setRfqCreateProcessPageNo(1);
    setRfqPageNo(1);
    setManageSupplierPageNo(1);
    setRoleAccessPageNo(1);
    setApprovalSetupPageNo(1);
    setManageSupplierProfileUpdatePageNo(1);
    setRfiManageSupplierPageNo(1);
    setMouPageNo(1);
    setBuyerPoPageNo(1);
    setCsAndRfqPageNo(1);
    setCsApprovalPageNo(1);
    setBuyerInvoicePageNo(1);
    setShipmentPageNo(1);
  };

  return (
    <div>
      <ErrorToast />
      {/* <LogOutModal
        isOpen={isLogOutOpen}
        doLogOut={logOut}
        closeModal={closeModal}
      /> */}
      <WarningModal
        isOpen={isLogOutOpen}
        closeModal={closeModal}
        action={logOut}
      />
      {/* Navbar */}
      <div className="fixed top-0 w-full h-16  flex  justify-between items-center z-50 bg-white border-b-[0.5px] border-borderColor shadow-sm">
        <div className="mx-4  w-52">
          <img
            src="images/seven_rings_logo.png"
            alt="logo"
            className="w-52 h-16"
          />




          {/* <button
            onClick={handleIsSmall}
            className=" w-10 h-10 flex justify-center items-center bg-gray-200 rounded-full"
          >
            {isSmall ? <BarRightIcon /> : <BarLeftIcon />}
          </button> */}
        </div>



        <div className="flex space-x-4 text-sky-900 hidden sm:ml-6 sm:block" style={{ marginLeft: '2%' }}>
          <svg style={{ marginTop: '-5%' }} fill='currentcolor' xmlns="http://www.w3.org/2000/svg" height="20px" width="10px" viewBox="0 0 192 512">
            <path d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V448c0 17.7 14.3 32 32 32s32-14.3 32-32V64zm128 0c0-17.7-14.3-32-32-32s-32 14.3-32 32V448c0 17.7 14.3 32 32 32s32-14.3 32-32V64z" />
          </svg>
          <p className='text-sm text-blue-800' style={{ marginTop: '-40%' }}> {myInfo?.data.USER_NAME}</p>
        </div>
        <div className="relative w-full h-full flex flex-row-reverse items-center pr-20 space-x-reverse space-x-8">

          <button
            onClick={handleClick}
            className={
              open
                ? "border-2 border-red-500 rounded-full p-[1px]"
                : "border-gray-300 border-2 rounded-full p-[1px]"
            }
          >

            {/* <Avatar alt="avatar" src="images/man.png" /> */}

            {myInfo?.data.PROFILE_PIC_FILE_NAME === "" ? (
              <FaUserCircle className="w-9 h-9 text-gray-300" />
            ) : (
              <img
                src={`${profilePicSrc}`}
                alt="avatar"
                className="w-9 h-9 rounded-full"
              />
            )}

            {profileOpen && (
              <span className="w-4 h-4 absolute border-[.9px] border-[rgba(145,158,171,0.12)] backdrop-blur-[4px] bg-[#f2fbfc] bottom-[2px] rounded-sm transform rotate-45 right-[90px] z-50"></span>
            )}

            {/* {open && ""} */}
          </button>

          <button onClick={toggleDrawer(true)}>
            <Badge
              classes={{ badge: "bg-[#ef3d45] text-white" }}
              badgeContent={unseenTotal! > 0 ? unseenTotal : "0"}
            >
              {/* <BellIcon /> */}
              <IoIosNotificationsOutline className="w-6 h-6" />
            </Badge>
          </button>

          <Drawer
            anchor="right"
            open={state.right}
            onClose={toggleDrawer(false)}
          >
            {list}
          </Drawer>

          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                zIndex: 0,
                // boxShadow: '0px 4px 9px -1px rgba(0, 0, 0, 0.2)', // Add shadow on bottom and left
                boxShadow:
                  "rgba(145, 158, 171, 0.24) 0px 0px 2px 0px, rgba(145, 158, 171, 0.24) -20px 20px 40px -4px",
                borderRadius: "10px",
                backdropFilter: "blur(20px)",
                backgroundImage:
                  "url(/images/cyan_blur.png), url(/images/red_blur.png)", // add background gradient img
                backgroundRepeat: "no-repeat, no-repeat",
                backgroundPosition: "right top, left bottom", // for background position
                backgroundSize: "70%, 60%", //for background gradient img size
              },
            }}
          // style={{ marginTop: "8px" }}
          >
            <div className=" flex flex-col items-start py-2 w-44  rounded-lg backdrop-blur-lg bg-opacity-50 ">
              {/* <span className="w-4 h-4 absolute border border-solid border-[rgba(145,158,171,0.12)] backdrop-blur-[6px] bg-black top-[-6.5px] transform rotate-45 right-[57px]"></span> */}

              <p className="px-4 text-[16px] text-blackColor font-medium font-mon">
                {myInfo?.data.FULL_NAME}
              </p>
              <p className="px-4 text-sm text-graishColor font-mon">
                {myInfo?.data.USER_NAME}
              </p>

              <div className="w-full px-1 my-2 flex flex-col space-y-2 items-start">
                <div className=" w-full h-[0.2px]  bg-borderColor my-1"></div>

                <button
                  onClick={() => {
                    navigateToRoute(620);
                  }}
                  className="px-3 font-mon text-start text-hintColor w-full h-8 hover:bg-offWhiteColor hover:rounded-sm"
                >
                  Profile
                </button>
                <div className=" w-full h-[0.2px]  bg-borderColor my-1"></div>
                <button
                  onClick={logOut}
                  className="px-3 font-mon text-start text-[#FF5630] w-full h-8 hover:bg-offWhiteColor hover:rounded-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </Popover>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex flex-row mt-16 overflow-hidden">
        {/* Side menu */}
        <div
          className={`${isSmall ? "w-24 " : "w-60"}  h-screen overflow-y-auto`}
        >
          {/* Side menu content */}
          <div className="relative h-screen overflow-visible">
            <div
              className={`fixed h-screen no-scrollbar overflow-y-auto overflow-visible bg-whiteColor ${isSmall ? "w-24 " : "w-60"
                } border-[0.5px] border-r-borderColor border-t-0 border-l-0 border-b-0`}
            >
              <div className="sticky top-[0px] left-0 px-4 py-2 bg-white">
                <div className=" flex flex-row w-full space-x-[2px] mb-2 ring-1 h-10 ring-borderColor rounded-md  items-center pl-[4px] bg-white">
                  <SearchIcon />

                  <input
                    onChange={handleMenuChange}
                    className=" w-full px-1 focus:outline-none bg-white"
                  />
                </div>

                <div
                  className={`fixed top-[80px] ${isSmall ? "left-[84px]" : "left-[227px]"
                    }`}
                >
                  <button
                    onClick={handleIsSmall}
                    className=" w-6 h-6 flex justify-center items-center border-[.5px] border-gray-200 text-gray-600 rounded-full bg-white"
                  >
                    {isSmall ? (
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
                          d="m8.25 4.5 7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    ) : (
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
                          d="M15.75 19.5 8.25 12l7.5-7.5"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="w-full bg-white px-4 flex flex-col items-start space-y-[10px] shadow-sm">
                {isLoading ? (
                  <div className=" w-full h-screen flex justify-center items-center">
                    <CircularProgressIndicator />
                  </div>
                ) : (
                  <>
                    {menuList.map((m, i) => (
                      <Link
                        to={`/buyer-home/${m.MENU_ID}`}
                        key={m.MENU_ID}
                        onClick={(e) => {
                          e.preventDefault();
                          clearStoreAndContext();
                          setMenu(m.MENU_ID);
                        }}
                        className={`py-2 w-full flex  ${menu === m.MENU_ID
                          ? "bg-[#ec1c24] hover:bg-[#FF0000] text-white"
                          : "hover:bg-[#FF0000] "
                          }  rounded-md hover:text-white
                                                  justify-start items-center 
                                                  `}
                      >
                        <div
                          className={`${isSmall ? "px-5" : "px-4"
                            }  flex flex-row space-x-2 items-center`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className={`w-6 h-6 ${menu === m.MENU_ID
                              ? " text-white"
                              : "text-midBlack"
                              }`}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d={menuIcons[m.MENU_ID]}
                            />
                          </svg>

                          {!isSmall && (
                            <div className=" w-full flex items-center space-x-2">
                              <p
                                className={`${menu === m.MENU_ID
                                  ? " text-white"
                                  : "text-midBlack"
                                  } font-medium font-mon text-sm  text-start`}
                              >
                                {m.MENU_NAME}
                              </p>

                              <div>
                                {(m.MENU_ID === 680 &&
                                  rfiSupplierListlength! > 0) ||
                                  (m.MENU_ID === 640 &&
                                    manageSupplierListLength! +
                                    profileNewAddSupplierLength! >
                                    0) ||
                                  (m.MENU_ID === 660 &&
                                    profileUpdateSupplierListLength! > 0) ||
                                  (m.MENU_ID === 790 &&
                                    pendingInvoiceLength! > 0) ||
                                  (m.MENU_ID === 760 &&
                                    pendingCsListLength! > 0) ? (
                                  <p className=" py-1 px-2 flex rounded-[100px] bg-redColor font-mon font-semibold justify-center items-center text-white text-xs">
                                    {m.MENU_ID === 680
                                      ? `${rfiSupplierListlength}`
                                      : m.MENU_ID === 640
                                        ? `${manageSupplierListLength! +
                                        profileNewAddSupplierLength!
                                        }`
                                        : m.MENU_ID === 660
                                          ? `${profileUpdateSupplierListLength!}`
                                          : m.MENU_ID === 790
                                            ? `${pendingInvoiceLength}`
                                            : m.MENU_ID === 760
                                              ? `${pendingCsListLength}`
                                              : ""}
                                  </p>
                                ) : null}
                              </div>
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                    <button
                      onClick={openLogOutModal}
                      className=" w-full flex space-x-2 items-center font-mon h-10  hover:bg-red-200 text-sm rounded-md px-4 text-redColor "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-redColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                        />
                      </svg>

                      <p>Logout</p>
                    </button>
                  </>
                )}

                <div className="h-32"></div>
              </div>
            </div>
          </div>
          {/* End side menu */}
        </div>

        {/* Page Content */}
        <div className="flex-1  overflow-y-auto">
          {(() => {
            switch (menu) {

              case 730:
                return (
                  <RfqCreateProcessProvider>
                    <BuyerRfqCreateProcessPage />
                  </RfqCreateProcessProvider>
                ); //hide hbe
              case 520:
                return (
                  <RfqPageProvider>
                    <RfqHomePage />
                  </RfqPageProvider>
                ); //hide hbe
              case 500:
                return <BuyerHome />;
              case 540:
                return <InviteHomePage />;
              //                     "MENU_ID": 550,
              // "MENU_NAME": "MANAGE SUPPLIER"
              // "MENU_ID": 530,
              // "MENU_NAME": "QUOTATION"
              case 560:
                return (
                  <ManageSupplierProvider>
                    <ManageSupplierHome />
                  </ManageSupplierProvider>
                ); //hide hbe
              // case 570:
              //   return (
              //     <CsApprovalProvider>
              //       <CsApprovalHomePage />
              //     </CsApprovalProvider>
              //   ); //hide hbe
              case 580:
                return (
                  <RoleAccessProvider>
                    <RoleManagementHome />
                  </RoleAccessProvider>
                );
              case 600:
                return <RoleMenuPermissionManager />;
              case 610:
                return <EmployeeForSyncPage />;
              case 620:
                return <BuyerProfilePage />;
              // case 620:
              //     return <SupplierProfilePage />; //hide hbe
              case 630:
                return (
                  <ApprovalSetupProvider>
                    <ApprovalSetupHomePage />
                  </ApprovalSetupProvider>
                );
              case 640:
                return (
                  <ManageSupplierProvider>
                    <ManageSupplierHome />
                  </ManageSupplierProvider>
                );
              case 660:
                return (
                  <ManageSupplierProfileUpdateProvider>
                    <SupplierListHomeForUpdateSupplier />
                  </ManageSupplierProfileUpdateProvider>
                );
              case 680:
                return (
                  <RfiManageSupplierProvider>
                    <RfiHomeSupplierListPage />
                  </RfiManageSupplierProvider>
                );
              case 700:
                return (
                  <MouPageProvider>
                    <SupplierOuManageHomePage />
                  </MouPageProvider>
                );
              case 710:
                return (
                  // <PoPageProvider>
                  //   <PoHomePage />
                  // </PoPageProvider>
                  // <CreateShipmentNotice />
                  <BuyerPoHome />
                );
              case 570:
                return <CsAndRfqHomePage />;
              case 760:
                return <CsApprovalHomePage />;
              case 780:
                return <SystemSetupPage />;
              case 790:
                return <BuyerInvoiceHome />;
              case 800:
                return <ShipmentAcceptReceiveHomePage />;
              case 810:
                return <SupplierSyncEbsPage />;


              default:
                return null;
            }
          })()}
        </div>
      </div>
    </div>
  );
}

// className={`w-6 h-6 ${menu === 2 ? " text-darkGreen" : "text-grayColor"}`}

//hemel code
