import React, { useState, useEffect } from "react";

import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";

import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import RfqListPageSupplier from "../../supplier_rfq_section/component/RfqListPageSupplier";
import RfqHomePageFromSupplier from "../../supplier_rfq_section/component/RfqHomePageForSupplier";
import { PoPageProvider } from "../../po/context/PoPageContext";
import PoHomePage from "../../po/component/PoHomePage";
import { useAuth } from "../../login_both/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { isTokenValid } from "../../utils/methods/TokenValidityCheck";

import {
  SupplierRfqPageProvider,
  useSupplierRfqPageContext,
} from "../../supplier_rfq_section/context/SupplierRfqPageContext";

import {
  MyMenuInterface,
  MyPermissionInterface,
  MyInfoInterface,
} from "../../my_info/interface/MyInfoInterface";
import MyInfoService from "../../my_info/service/MyInfoService";
import { useMenuContext } from "../../my_info/context/MenuContext";
import { domain } from "../../utils/domainPath";
import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";
import ErrorToast, { showErrorToast } from "../../Alerts_Component/ErrorToast";
import SupplierProfilePage from "../../supplier_profile/component/SupplierProfilePage";
import SearchIcon from "../../icons/SearchIcon";
import { Link, useParams } from "react-router-dom";
import BarRightIcon from "../../icons/BarRightIcon";
import BarLeftIcon from "../../icons/BarLeftIcon";
import BellIcon from "../../icons/BellIcon";
import WarningModal from "../../common_component/WarningModal";
import ProfileUpdateSubmissionService from "../../registration/service/profile_update_submission/ProfileUpdateSubmissionService";
import { showSuccessToast } from "../../Alerts_Component/SuccessToast";
import LogOutModal from "../../common_component/LogoutModal";
import TechnicalQuotationSubmissionPage from "../../supplier_rfq_section/component/TechnicalQuotationSubmissionPage";
import BuyerPoHome from "../../po_buyer/component/BuyerPoHome";
import RfqItemListFoeSupplier from "../../supplier_rfq_section/component/RfqItemListForSupplier";
import { SupplierRfqIdProvider } from "../../supplier_rfq_section/context/SupplierRfqIdContext";
import RfqListSupplierService from "../../supplier_rfq_section/service/RfqListSupplierService";
import useAuthStore from "../../login_both/store/authStore";
import useSupplierRfqStore from "../../supplier_rfq_section/store/supplierRfqStore";
import useSupplierRfqPageStore from "../../supplier_rfq_section/store/SupplierRfqPageStore";
import isoToDateTime from "../../utils/methods/isoToDateTime";
import NotificationReadService from "../../buyer_home/service/NotificationReadService";
import NotificationService from "../../buyer_home/service/NotificationService";
import { FaUserCircle } from "react-icons/fa";
import { IoIosNotificationsOutline } from "react-icons/io";
import InfiniteScroll from "react-infinite-scroll-component";
import { Oval } from "react-loader-spinner";
import NotificationMarkAllReadService from "../../buyer_home/service/NotificationMarkAllReadService";
import WelcomeModal from "../../common_component/WelcomeModal";
import Supplierhome from "./Supplierhome";
import ShipmentReceiveListPage from "../../shipment_receive/component/ShipmentReceiveListPage";
import GrnHomePage from "../../grn/component/GrnHomePage";
import useSupplierPoStore from "../../po_supplier/store/SupplierPoStore";
import useRfiStore from "../../rfi_in_supplier_registration/store/RfiStore";
import fetchFileUrlService from "../../common_service/fetchFileUrlService";

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
  740: "M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z",
  710: "M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z",

  800: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z",
};

export default function SupplierHomePage() {
  const [menuList, setMenuList] = useState<MyMenuInterface[] | []>([]);
  const [menuList2, setMenuList2] = useState<MyMenuInterface[] | []>([]);
  const [permissionList, setPermissionList] = useState<
    MyPermissionInterface[] | []
  >([]);
  const [myInfo, setMyInfo] = useState<MyInfoInterface | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSmall, setIsSmall] = useState<boolean>(false);
  const [rfqListLength, setRfqListLength] = useState(0);
  const [rfqListNew, setRfqListNew] = useState<
    {
      RFQ_SUBJECT: string;
      OPEN_DATE: string;
    }[]
  >([]);
  const [rfqListOpen, setRfqListOpen] = useState<
    {
      RFQ_SUBJECT: string;
      OPEN_DATE: string;
    }[]
  >([]);

  const [rfqListOpenLength, setRfqListOpenLength] = useState<number>(0);

  const [rfqListAll, setRfqListAll] = useState<
    {
      RFQ_SUBJECT: string;
      OPEN_DATE: string;
    }[]
  >([]);
  const { appStatus, setAppStatus, handleButtonClick } =
    useSupplierRfqPageStore();
  const {
    token,
    setIsBuyer,
    setToken,
    userId,
    setUserId,
    setRegToken,
    setIsRegCompelte,
    setSubmissionStatus,
    setBgId,
    setBuyerId,
    setVendorId,
    submissionStatus,
  } = useAuth();
  const navigate = useNavigate();
  const { smId } = useParams();
  const { menu, setMenu } = useMenuContext();
  // SupplierHomePage.tsx

  const [unseenTotal, setUnseenTotal] = useState<number>();
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
      SHOW_MSG: string;
      SUPPLIER_ORGANIZATION_NAME: string;
    }[]
  >([]);

  const [profilePicPath, setProfilePicPath] = useState<
    {
      profile_pic: string;
    }[]
  >([]);

  //store
  const {
    setLoggedInUserName,
    isWlcMsgSwn,
    wlcMessage,
    setIsWlcMsgSwn,
    setWlcMessage,
    setIsProfileUpdateStatusInStore,
    setIsNewInfoStatusInStore,
  } = useAuthStore();
  //store
  useEffect(() => {
    console.log(`userId in home: ${userId}`);
    console.log("smId", smId);

    const isTokenExpired = !isTokenValid(token!);
    // console.log(isTokenExpired);
    if (isTokenExpired) {
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("isBuyer");
        localStorage.removeItem("isRegCompelte");
        localStorage.removeItem("submissionStatus");
        localStorage.removeItem("regToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("bgId");
        localStorage.removeItem("vendorId");

        setToken(null);
        setIsBuyer(null);
        setUserId(null);
        setVendorId(null);
        setRegToken(null);
        setIsRegCompelte(null);
        setSubmissionStatus(null);
        navigate("/");
      }, 999);

      showErrorToast("Session Expired, Please Login");

      console.log("expired");
    } else {
      getMyInfo();
      console.log(isTokenExpired);
    }

    // Perform any other initialization based on the token

    // getMenu(); // You can uncomment this line if needed
  }, []);

  useEffect(() => {
    // getRfqListLength("NEW", "0");
    // getRfqListNew("NEW", "0");
    // getRfqListOpen("OPEN");
    // getRfqListAll("ALL");
  }, []);

  const getRfqListAll = async (status: string) => {
    try {
      setIsLoading(true);
      const result = await RfqListSupplierService(token!, status, "", 0, 1000);

      if (result.data.status === 200) {
        setIsLoading(false);

        console.log("rfqListall: ", result.data.data);

        setRfqListAll(result.data.data);
        // const convertedData = result.data.data.map(
        //   (org: CommonOrgInterface) => ({
        //     value: org.ORGANIZATION_ID.toString(),
        //     label: org.NAME,
        //   })
        // );
        // setConvertedOrgList(convertedData);
        setIsLoading(false);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Organization Load Failed");
    }
  };
  const getRfqListOpen = async (status: string) => {
    try {
      setIsLoading(true);
      const result = await RfqListSupplierService(token!, status, "", 0, 1000);
      const sortedRfqList = result.data.data.sort(
        (a: { OPEN_DATE: string }, b: { OPEN_DATE: string }) => {
          return (
            new Date(b.OPEN_DATE).getTime() - new Date(a.OPEN_DATE).getTime()
          );
        }
      );
      setRfqListOpenLength(result.data.data.length);

      if (result.data.status === 200) {
        setIsLoading(false);

        console.log("rfqListopen: ", result.data.data.length);

        setRfqListOpen(sortedRfqList);
        setRfqListOpenLength(result.data.data.length);
        // const convertedData = result.data.data.map(
        //   (org: CommonOrgInterface) => ({
        //     value: org.ORGANIZATION_ID.toString(),
        //     label: org.NAME,
        //   })
        // );
        // setConvertedOrgList(convertedData);
        setIsLoading(false);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Organization Load Failed");
    }
  };
  const getRfqListNew = async (status: string, value: string) => {
    try {
      setIsLoading(true);
      const result = await RfqListSupplierService(
        token!,
        status,
        value,
        0,
        1000
      );
      const sortedRfqList = result.data.data.sort(
        (a: { OPEN_DATE: string }, b: { OPEN_DATE: string }) => {
          return (
            new Date(b.OPEN_DATE).getTime() - new Date(a.OPEN_DATE).getTime()
          );
        }
      );

      if (result.data.status === 200) {
        setIsLoading(false);

        console.log("rfqListnew: ", result.data.data.length);

        setRfqListNew(sortedRfqList);
        // const convertedData = result.data.data.map(
        //   (org: CommonOrgInterface) => ({
        //     value: org.ORGANIZATION_ID.toString(),
        //     label: org.NAME,
        //   })
        // );
        // setConvertedOrgList(convertedData);
        setIsLoading(false);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Organization Load Failed");
    }
  };
  const getRfqListLength = async (status: string, value: string) => {
    try {
      setIsLoading(true);
      const result = await RfqListSupplierService(
        token!,
        status,
        value,
        0,
        1000
      );

      if (result.data.status === 200) {
        setIsLoading(false);
        console.log("rfqListLength: ", result.data.data.length);
        console.log("rfqList: ", result.data.data);

        setRfqListLength(result.data.data.length);
        // const convertedData = result.data.data.map(
        //   (org: CommonOrgInterface) => ({
        //     value: org.ORGANIZATION_ID.toString(),
        //     label: org.NAME,
        //   })
        // );
        // setConvertedOrgList(convertedData);
        setIsLoading(false);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Organization Load Failed");
    }
  };

  const navigateToRoute = (menuNo: number) => {
    // Navigate to the route associated with the notification
    setMenu(menuNo); // Use window.location.href for full page reload
  };

  // new notification start

  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    getNotification(0);
  }, []);

  const getNotification = async (newPage: number) => {
    const result = await NotificationService(token!, newPage, 20);

    // setNotificationList(result.data.data);
    console.log("notification: ", result.data);
    console.log("notification: ", result);

    const newNotifications = result.data.data;
    setNotificationList((prevNotifications) => [
      ...prevNotifications,
      ...newNotifications,
    ]);

    setProfilePicPath(result.data.profile_pic);
    // setUnseenTotalNotificationInStore(result.data.unseen);
    setUnseenTotal(result.data.unseen);

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

    console.log("notification success: ", unseenTotal);

    setNotificationList(updatedNotifications);
    // navigateToRoute(680);
    // setRfiTabNo(33);
  };

  // const getTimeAgo = (dateString: string) => {
  //   console.log('time; ', dateString);
  //   const now = new Date();
  //   const date = new Date(dateString);
  //   const secondsAgo = Math.floor((Number(now) - Number(date)) / 1000);

  //   const intervals = [
  //     { label: 'year', seconds: 31536000 },
  //     { label: 'month', seconds: 2592000 },
  //     { label: 'day', seconds: 86400 },
  //     { label: 'hour', seconds: 3600 },
  //     { label: 'minute', seconds: 60 },
  //     { label: 'second', seconds: 1 },
  //   ];

  //   for (const interval of intervals) {
  //     const count = Math.floor(secondsAgo / interval.seconds);
  //     if (count > 0) {
  //       return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
  //     }
  //   }

  //   return 'just now';
  // };

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

  const getMyInfo = async () => {
    setIsLoading(true);
    const result = await MyInfoService(token!);
    if (result.data.status === 200) {
      setMenuList(result.data.Menu);
      setMenuList2(result.data.Menu);
      setPermissionList(result.data.Permission);
      setMyInfo(result.data);
      setBgId(result.data.data.BUSINESS_GROUP_ID);
      console.log(result.data.data.PROFILE_UPDATE_STATUS);

      setIsProfileUpdateStatusInStore(result.data.data.PROFILE_UPDATE_STATUS);
      setIsNewInfoStatusInStore(result.data.data.NEW_INFO_STATUS);
      console.log("my info: ", result.data);

      // console.log(result.data.data.BUSINESS_GROUP_ID);
      setVendorId(result.data.data.VENDOR_ID);
      setLoggedInUserName(result.data.data.FULL_NAME);

      localStorage.setItem(
        "bgId",
        result.data.data.BUSINESS_GROUP_ID.toString()
      );

      setIsLoading(false);
      if (
        result.data.data.PROFILE_UPDATE_STATUS === "INCOMPLETE" ||
        result.data.data.NEW_INFO_STATUS === "INCOMPLETE" ||
        submissionStatus === "DARFT"
      ) {
        // showErrorToast("You have updated your profile, please submit for approval");
        console.log(submissionStatus);

        openWarningModal();
      }
    } else {
      setIsLoading(false);
    }
  };

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isBuyer");
    localStorage.removeItem("isRegCompelte");
    localStorage.removeItem("submissionStatus");
    localStorage.removeItem("regToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("buyerId");
    localStorage.removeItem("vendorId");
    setMenu(500);
    setToken(null);
    setIsBuyer(null);
    setRegToken(null);
    setIsRegCompelte(null);
    setSubmissionStatus(null);
    setUserId(null);
    setVendorId(null);
    setBuyerId(null);
    clearStoreOrContext();
    navigate("/");
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

  // useEffect(() => {
  //   // getMenu();
  // }, []);
  // // const userId = "B001";

  //token vangbo

  const [menuIdInToken, setMenuIdInToken] = useState<number | null>(null);

  //store
  const {
    setRfqIdInStore,
    setRfqTypeInStore,
    setRfqCloseDateInStore,
    setRfqTitleInStore,
  } = useSupplierRfqStore();
  const { setPageNoRfq } = useSupplierRfqPageStore();
  //store

  //context
  // const { setSupplierRfqPage } = useSupplierRfqPageContext();
  //context

  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    // Get the token from the URL
    const token = new URLSearchParams(window.location.search).get("token");

    const isTokenExpired = !isTokenValid(token!);
    if (isTokenExpired) {
      setIsExpired(true);
    } else {
      if (token) {
        try {
          const decodedToken = decodeJWT(token);

          // Extract USER_ID from the decoded payload
          const rfqId = decodedToken?.decodedPayload?.RFQ_ID;
          const rfqTitle = decodedToken?.decodedPayload?.RFQ_TITLE;
          const rfqType = decodedToken?.decodedPayload?.RFQ_TYPE;
          const rfqCloseDate = decodedToken?.decodedPayload?.CLOSE_DATE;
          const menuId = decodedToken?.decodedPayload?.MENU_ID;
          // console.log(menuId);
          // console.log(typeof menuId);
          setRfqIdInStore(rfqId);
          setRfqCloseDateInStore(rfqCloseDate);
          setRfqTitleInStore(rfqTitle);
          setRfqTypeInStore(rfqType);

          // setMenu(menuId);
          setMenuIdInToken(menuId);
          // setSupplierRfqPage(2);
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    }
  }, []);

  const decodeJWT = (token: string) => {
    try {
      // Split the token into header, payload, and signature (assuming they are separated by dots)
      const [encodedHeader, encodedPayload] = token.split(".");

      // Decode base64-encoded header and payload
      const decodedHeader = JSON.parse(window.atob(encodedHeader));
      const decodedPayload = JSON.parse(window.atob(encodedPayload));

      // Log the decoded header and payload
      console.log("Decoded Header:", decodedHeader);
      console.log("Decoded Payload:", decodedPayload);

      // Make sure that the decoded payload has the expected structure
      if (
        decodedPayload &&
        decodedPayload.hasOwnProperty("RFQ_ID") &&
        decodedPayload.hasOwnProperty("RFQ_TITLE") &&
        decodedPayload.hasOwnProperty("RFQ_TYPE") &&
        decodedPayload.hasOwnProperty("CLOSE_DATE") &&
        decodedPayload.hasOwnProperty("MENU_ID")
      ) {
        const rfqId = decodedPayload.RFQ_ID;
        const rfqTitle = decodedPayload.RFQ_TITLE;
        const rfqType = decodedPayload.RFQ_TYPE;
        const rfqCloseDate = decodedPayload.CLOSE_DATE;
        const menuId = decodedPayload.MENU_ID;

        return {
          decodedHeader,
          decodedPayload,
          rfqId,
          rfqTitle,
          rfqType,
          rfqCloseDate,
          menuId,
        };
      } else {
        console.error(
          "Error: Decoded payload does not have the expected structure."
        );
        return null;
      }
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  };

  //token vangbo

  const handleIsSmall = () => {
    setIsSmall(!isSmall);
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

  const { setPageNo } = useSupplierPoStore();

  const { setShipmentPageNo } = useRfiStore();

  const clearStoreOrContext = () => {
    setPageNo(1);
    setPageNoRfq(1);
    setShipmentPageNo(1);
  };

  const list = (
    <Box
      sx={{ width: 400 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <div className="mt-4 pb-2 px-3 border-b-[.5px] border-gray-200 flex items-center justify-between">
        <h1 className="text-[16px] font-bold text-left">Notification</h1>

        <h2
          className="font-semibold text-[12px] text-blue-500 cursor-pointer"
          onClick={handleMarkAll}
        >
          Mark all as read
        </h2>
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
          />
        </svg> */}
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

      {/* new notification start */}

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
                height="40"
                width="80"
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
              // onClick={() => {
              // navigateToRoute();
              // setAppStatus("NEW");
              // handleButtonClick("NEW");
              // }}
              onClick={() => {
                handleNotificationClick(i, item?.ID);
              }}
              className={`py-4 px-3 cursor-pointer border-b-[.5px] border-gray-200 divide-y font-mon ${item.IS_READ === 0 ? "bg-[#ebf2fa]" : ""
                }`}
            >
              {/* <div className="flex items-center gap-1">
                <Avatar alt="avatar" src="images/man.png" />
                <p className="text-sm">
                  <span className="text-[#2e3191] font-semibold">NEW</span> RFQ{" "}
                  <span className="text-[#2e3191] font-semibold">
                    {item?.RFQ_SUBJECT}
                  </span>{" "}
                  published at {isoToDateTime(item.OPEN_DATE)}
                </p>
              </div> */}

              {item.OBJECT_TYPE === "new_rfq" && (
                <div
                  onClick={() => {
                    navigateToRoute(740);
                    //   setRfiTabNo(33);
                    //   // setRfiManageSupplierPageNo(3);
                    //   // setIsActiveButtonRegistration(false);
                    //   // setIsActiveButtonRFQ(true);
                    //   // setIsActiveButtonVAT(false);
                  }}
                  className="flex items-start justify-between space-x-3"
                >
                  <div className="flex items-start space-x-3">
                    {/* {item.PROPIC_FILE_NAME ? 
                      <img className="w-12 h-12 rounded-full" src={`${profilePicPath}/${item.PROPIC_FILE_NAME}`} alt="avatar" />
                    :
                      <FaUserCircle className="w-12 h-12 text-gray-300" />
                    } */}

                    {item.OBJECT_TYPE === "new_rfq" && (
                      <img src="images/logo.png" className="w-10 h-10" alt="" />
                    )}

                    <div className="w-60">
                      <h1 className="text-[12px]">
                        <span
                          className="text-[rgb(25,25,25)]"
                          dangerouslySetInnerHTML={{ __html: item?.SHOW_MSG }}
                        />
                      </h1>
                      {/* <p>{NotificationLookup["Title"]}</p> */}
                    </div>
                  </div>

                  <div className="">
                    <p className="text-[11px] text-slate-400">
                      {getTimeAgo(item.CREATION_DATE)}
                    </p>
                  </div>
                </div>
              )}

              {item.OBJECT_TYPE === "prof_update" && (
                <div
                  // onClick={() => {
                  // navigateToRoute(660);
                  // setRfiTabNo(11);
                  //   // setRfiManageSupplierPageNo(3);
                  //   // setIsActiveButtonRegistration(false);
                  //   // setIsActiveButtonRFQ(true);
                  //   // setIsActiveButtonVAT(false);
                  // }}
                  className="flex items-start justify-between space-x-3"
                >
                  <div className="flex items-start space-x-3">
                    {item.PROPIC_FILE_NAME ? (
                      <img
                        className="w-9 h-9 rounded-full"
                        src={`${profilePicPath}/${item.PROPIC_FILE_NAME}`}
                        alt="avatar"
                      />
                    ) : (
                      <FaUserCircle className="w-9 h-9 text-gray-300" />
                    )}

                    <div className="w-56">
                      <h1 className="text-[12px]">
                        <span
                          className="text-[rgb(25,25,25)]"
                          dangerouslySetInnerHTML={{ __html: item?.SHOW_MSG }}
                        />
                      </h1>
                      {/* <p>{NotificationLookup["Title"]}</p> */}
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
                  // onClick={() => {
                  // navigateToRoute(660);
                  // setRfiTabNo(11);
                  //   // setRfiManageSupplierPageNo(3);
                  //   // setIsActiveButtonRegistration(false);
                  //   // setIsActiveButtonRFQ(true);
                  //   // setIsActiveButtonVAT(false);
                  // }}
                  className="flex items-start justify-between space-x-3"
                >
                  <div className="flex items-start space-x-3">
                    {item.PROPIC_FILE_NAME ? (
                      <img
                        className="w-9 h-9 rounded-full"
                        src={`${profilePicPath}/${item.PROPIC_FILE_NAME}`}
                        alt="avatar"
                      />
                    ) : (
                      <FaUserCircle className="w-9 h-9 text-gray-300" />
                    )}

                    <div className="w-56">
                      <h1 className="text-[12px]">
                        <span
                          className="text-[rgb(25,25,25)]"
                          dangerouslySetInnerHTML={{ __html: item?.SHOW_MSG }}
                        />
                      </h1>
                      {/* <p>{NotificationLookup["Title"]}</p> */}
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
                <div
                  // onClick={() => {
                  // navigateToRoute(660);
                  // setRfiTabNo(11);
                  //   // setRfiManageSupplierPageNo(3);
                  //   // setIsActiveButtonRegistration(false);
                  //   // setIsActiveButtonRFQ(true);
                  //   // setIsActiveButtonVAT(false);
                  // }}
                  className="flex items-start justify-between space-x-3"
                >
                  <div className="flex items-start space-x-3">
                    {item.PROPIC_FILE_NAME ? (
                      <img
                        className="w-9 h-9 rounded-full"
                        src={`${profilePicPath}/${item.PROPIC_FILE_NAME}`}
                        alt="avatar"
                      />
                    ) : (
                      <FaUserCircle className="w-9 h-9 text-gray-300" />
                    )}

                    <div className="w-56">
                      <h1 className="text-[12px]">
                        <span
                          className="text-[rgb(25,25,25)]"
                          dangerouslySetInnerHTML={{ __html: item?.SHOW_MSG }}
                        />
                      </h1>
                      {/* <p>{NotificationLookup["Title"]}</p> */}
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
                <div
                  // onClick={() => {
                  // navigateToRoute(660);
                  // setRfiTabNo(11);
                  //   // setRfiManageSupplierPageNo(3);
                  //   // setIsActiveButtonRegistration(false);
                  //   // setIsActiveButtonRFQ(true);
                  //   // setIsActiveButtonVAT(false);
                  // }}
                  className="flex items-start justify-between space-x-3"
                >
                  <div className="flex items-start space-x-3">
                    {item.PROPIC_FILE_NAME ? (
                      <img
                        className="w-9 h-9 rounded-full"
                        src={`${profilePicPath}/${item.PROPIC_FILE_NAME}`}
                        alt="avatar"
                      />
                    ) : (
                      <FaUserCircle className="w-9 h-9 text-gray-300" />
                    )}

                    <div className="w-56">
                      <h1 className="text-[12px]">
                        <span
                          className="text-[rgb(25,25,25)]"
                          dangerouslySetInnerHTML={{ __html: item?.SHOW_MSG }}
                        />
                      </h1>
                      {/* <p>{NotificationLookup["Title"]}</p> */}
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
                <div
                  // onClick={() => {
                  // navigateToRoute(660);
                  // setRfiTabNo(11);
                  //   // setRfiManageSupplierPageNo(3);
                  //   // setIsActiveButtonRegistration(false);
                  //   // setIsActiveButtonRFQ(true);
                  //   // setIsActiveButtonVAT(false);
                  // }}
                  className="flex items-start justify-between space-x-3"
                >
                  <div className="flex items-start space-x-3">
                    {item.PROPIC_FILE_NAME ? (
                      <img
                        className="w-9 h-9 rounded-full"
                        src={`${profilePicPath}/${item.PROPIC_FILE_NAME}`}
                        alt="avatar"
                      />
                    ) : (
                      <FaUserCircle className="w-9 h-9 text-gray-300" />
                    )}

                    <div className="w-56">
                      <h1 className="text-[12px]">
                        <span
                          className="text-[rgb(25,25,25)]"
                          dangerouslySetInnerHTML={{ __html: item?.SHOW_MSG }}
                        />
                      </h1>
                      {/* <p>{NotificationLookup["Title"]}</p> */}
                    </div>
                  </div>

                  <div className="">
                    <p className="text-[12px] text-slate-400">
                      {getTimeAgo(item.CREATION_DATE)}
                    </p>
                  </div>
                </div>
              )}

              {item.OBJECT_TYPE === "prof_new_info_app" && (
                <div
                  // onClick={() => {
                  // navigateToRoute(660);
                  // setRfiTabNo(11);
                  //   // setRfiManageSupplierPageNo(3);
                  //   // setIsActiveButtonRegistration(false);
                  //   // setIsActiveButtonRFQ(true);
                  //   // setIsActiveButtonVAT(false);
                  // }}
                  className="flex items-start justify-between space-x-3"
                >
                  <div className="flex items-start space-x-3">
                    {item.PROPIC_FILE_NAME ? (
                      <img
                        className="w-9 h-9 rounded-full"
                        src={`${profilePicPath}/${item.PROPIC_FILE_NAME}`}
                        alt="avatar"
                      />
                    ) : (
                      <FaUserCircle className="w-9 h-9 text-gray-300" />
                    )}

                    <div className="w-56">
                      <h1 className="text-[12px]">
                        <span
                          className="text-[rgb(25,25,25)]"
                          dangerouslySetInnerHTML={{ __html: item?.SHOW_MSG }}
                        />
                      </h1>
                      {/* <p>{NotificationLookup["Title"]}</p> */}
                    </div>
                  </div>

                  <div className="">
                    <p className="text-[12px] text-slate-400">
                      {getTimeAgo(item.CREATION_DATE)}
                    </p>
                  </div>
                </div>
              )}

              {item.OBJECT_TYPE === "rfi" && (
                <div
                  // onClick={() => {
                  // navigateToRoute(660);
                  // setRfiTabNo(11);
                  //   // setRfiManageSupplierPageNo(3);
                  //   // setIsActiveButtonRegistration(false);
                  //   // setIsActiveButtonRFQ(true);
                  //   // setIsActiveButtonVAT(false);
                  // }}
                  className="flex items-start justify-between space-x-3"
                >
                  <div className="flex items-start space-x-3">
                    {item.PROPIC_FILE_NAME ? (
                      <img
                        className="w-9 h-9 rounded-full"
                        src={`${profilePicPath}/${item.PROPIC_FILE_NAME}`}
                        alt="avatar"
                      />
                    ) : (
                      <FaUserCircle className="w-9 h-9 text-gray-300" />
                    )}

                    <div className="w-56">
                      <h1 className="text-[12px]">
                        <span
                          className="text-[rgb(25,25,25)]"
                          dangerouslySetInnerHTML={{ __html: item?.SHOW_MSG }}
                        />
                      </h1>
                      {/* <p>{NotificationLookup["Title"]}</p> */}
                    </div>
                  </div>

                  <div className="">
                    <p className="text-[12px] text-slate-400">
                      {getTimeAgo(item.CREATION_DATE)}
                    </p>
                  </div>
                </div>
              )}

              {item.OBJECT_TYPE === "vat" && (
                <div
                  // onClick={() => {
                  // navigateToRoute(660);
                  // setRfiTabNo(11);
                  //   // setRfiManageSupplierPageNo(3);
                  //   // setIsActiveButtonRegistration(false);
                  //   // setIsActiveButtonRFQ(true);
                  //   // setIsActiveButtonVAT(false);
                  // }}
                  className="flex items-start justify-between space-x-3"
                >
                  <div className="flex items-start space-x-3">
                    {item.PROPIC_FILE_NAME ? (
                      <img
                        className="w-9 h-9 rounded-full"
                        src={`${profilePicPath}/${item.PROPIC_FILE_NAME}`}
                        alt="avatar"
                      />
                    ) : (
                      <FaUserCircle className="w-9 h-9 text-gray-300" />
                    )}

                    <div className="w-56">
                      <h1 className="text-[12px]">
                        <span
                          className="text-[rgb(25,25,25)]"
                          dangerouslySetInnerHTML={{ __html: item?.SHOW_MSG }}
                        />
                      </h1>
                      {/* <p>{NotificationLookup["Title"]}</p> */}
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
                  // onClick={() => {
                  // navigateToRoute(660);
                  // setRfiTabNo(11);
                  //   // setRfiManageSupplierPageNo(3);
                  //   // setIsActiveButtonRegistration(false);
                  //   // setIsActiveButtonRFQ(true);
                  //   // setIsActiveButtonVAT(false);
                  // }}
                  className="flex items-start justify-between space-x-3"
                >
                  <div className="flex items-start space-x-3">
                    {item.PROPIC_FILE_NAME ? (
                      <img
                        className="w-9 h-9 rounded-full"
                        src={`${profilePicPath}/${item.PROPIC_FILE_NAME}`}
                        alt="avatar"
                      />
                    ) : (
                      <FaUserCircle className="w-9 h-9 text-gray-300" />
                    )}

                    <div className="w-56">
                      <h1 className="text-[12px]">
                        <span
                          className="text-[rgb(25,25,25)]"
                          dangerouslySetInnerHTML={{ __html: item?.SHOW_MSG }}
                        />
                      </h1>
                      {/* <p>{NotificationLookup["Title"]}</p> */}
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
                  // onClick={() => {
                  // navigateToRoute(660);
                  // setRfiTabNo(11);
                  //   // setRfiManageSupplierPageNo(3);
                  //   // setIsActiveButtonRegistration(false);
                  //   // setIsActiveButtonRFQ(true);
                  //   // setIsActiveButtonVAT(false);
                  // }}
                  className="flex items-start justify-between space-x-3"
                >
                  <div className="flex items-start space-x-3">
                    {item.PROPIC_FILE_NAME ? (
                      <img
                        className="w-9 h-9 rounded-full"
                        src={`${profilePicPath}/${item.PROPIC_FILE_NAME}`}
                        alt="avatar"
                      />
                    ) : (
                      <FaUserCircle className="w-9 h-9 text-gray-300" />
                    )}

                    <div className="w-56">
                      <h1 className="text-[12px]">
                        <span
                          className="text-[rgb(25,25,25)]"
                          dangerouslySetInnerHTML={{ __html: item?.SHOW_MSG }}
                        />
                      </h1>
                      {/* <p>{NotificationLookup["Title"]}</p> */}
                    </div>
                  </div>

                  <div className="">
                    <p className="text-[12px] text-slate-400">
                      {getTimeAgo(item.CREATION_DATE)}
                    </p>
                  </div>
                </div>
              )}

              {item.OBJECT_TYPE === "new_po" && (
                <div
                  onClick={() => {
                    navigateToRoute(710);
                    //   setRfiTabNo(33);
                    //   // setRfiManageSupplierPageNo(3);
                    //   // setIsActiveButtonRegistration(false);
                    //   // setIsActiveButtonRFQ(true);
                    //   // setIsActiveButtonVAT(false);
                  }}
                  className="flex items-start justify-between space-x-3"
                >
                  <div className="flex items-start space-x-3">
                    {/* {item.PROPIC_FILE_NAME ? 
                      <img className="w-12 h-12 rounded-full" src={`${profilePicPath}/${item.PROPIC_FILE_NAME}`} alt="avatar" />
                    :
                      <FaUserCircle className="w-12 h-12 text-gray-300" />
                    } */}

                    {item.OBJECT_TYPE === "new_po" && (
                      <img src="images/logo.png" className="w-10 h-10" alt="" />
                    )}

                    <div className="w-56">
                      <h1 className="text-[12px]">
                        <span
                          className="text-[rgb(25,25,25)]"
                          dangerouslySetInnerHTML={{ __html: item?.SHOW_MSG }}
                        />
                      </h1>
                      {/* <p>{NotificationLookup["Title"]}</p> */}
                    </div>
                  </div>

                  <div className="">
                    <p className="text-[11px] text-slate-400">
                      {getTimeAgo(item.CREATION_DATE)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </InfiniteScroll>
      </div>
      {/* {rfqListOpen.map((item, index) => (
        <div
          key={index}
          onClick={() => {
            navigateToRoute();
            // setAppStatus("OPEN");
            handleButtonClick("OPEN");
          }}
          className="my-4 cursor-pointer px-2 mx-1 hover:bg-slate-50 divide-y"
        >
          <div className="flex items-center gap-1">
            <Avatar alt="avatar" src="images/man.png" />
            <p className="text-sm">
              <span className="text-[#2e3191] text font-semibold">OPEN</span>{" "}
              RFQ{" "}
              <span className="text-[#2e3191] font-semibold">
                {item?.RFQ_SUBJECT}
              </span>{" "}
              has Opened at {isoToDateTime(item.OPEN_DATE)}
            </p>
          </div>
        </div>
      ))} */}
      {/* {rfqListAll.map((item, index) => (
        <div
          key={index}
          onClick={() => {
            navigateToRoute();
            // setAppStatus("ALL");
            handleButtonClick("ALL");
          }}
          className="my-4 cursor-pointer px-2 mx-1 hover:bg-slate-50 divide-y"
        >
          <div className="flex items-center gap-1">
            <Avatar alt="avatar" src="images/man.png" />
            <p>{item?.RFQ_SUBJECT}</p>
          </div>
        </div>
      ))} */}
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
    const menuId = parseInt(smId ?? "", 10);

    if (isExpired) {
      // showErrorToast(`RFQ Date Has Expired`);
    } else {
      // If the id is valid, set the menu
      if (!isNaN(menuId) && menuId >= 500 && menuId <= 100000) {
        setMenu(menuId);
      } else if (
        !isNaN(menuIdInToken!) &&
        menuIdInToken! >= 500 &&
        menuIdInToken! <= 100000
      ) {
        setMenu(menuIdInToken!);
        setPageNoRfq(2);
      } else {
        // If id is not valid, set a default menu (e.g., 1)
        setMenu(500);
      }
    }
  }, [smId, menuIdInToken]);

  const [isWarningShow, setIsWarningShow] = useState(false);
  const openWarningModal = () => {
    setIsWarningShow(true);
  };
  const closeWarningModal = () => {
    setIsWarningShow(false);
  };

  const profileUpdateSubmission = async () => {
    try {
      const result = await ProfileUpdateSubmissionService(token!);
      console.log(result.data);

      if (result.data.status === 200) {
        showSuccessToast(result.data.message);
        console.log("called here");

        setSubmissionStatus("SUBMIT");
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) { }
  };

  const [isLogOutOpen, setIsLogOutOpen] = useState<boolean>(false);
  const openLogOutModal = () => {
    setIsLogOutOpen(true);
  };
  const closeModal = () => {
    setIsLogOutOpen(false);
  };

  //welcome modal

  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);

  useEffect(() => {
    console.log(isWlcMsgSwn);
    console.log(wlcMessage);
    if (isWlcMsgSwn === 0) {
      setIsWelcomeModalOpen(true);
    }
    // setTimeout(() => {
    //   setIsWelcomeModalOpen(false);
    // }, 5000);
  }, []);

  useEffect(() => {
    if (myInfo) {
      getImage();
    }
  }, [myInfo]);

  const [profilePicSrc, setProfilePicSrc] = useState<string | null>(null);

  const getImage = async () => {
    const url = await fetchFileUrlService(
      myInfo?.profile_pic_supplier!,
      myInfo?.data.PROFILE_PIC_FILE_NAME!,
      token!
    );
    console.log("url img:", url);

    setProfilePicSrc(url);
  };

  return (
    <div className="w-full flex flex-col">
      {/* <LogOutModal
        isOpen={isLogOutOpen}
        doLogOut={logOut}
        closeModal={closeModal}
      /> */}
      <WelcomeModal
        isOpen={isWelcomeModalOpen}
        onClose={() => setIsWelcomeModalOpen(false)}
        name={wlcMessage!}
      />
      <WarningModal
        isOpen={isLogOutOpen}
        action={logOut}
        closeModal={closeModal}
      />
      <WarningModal
        isOpen={isWarningShow}
        closeModal={closeWarningModal}
        action={profileUpdateSubmission}
        message="You have updated your profile, please submit for approval."
      />
      <ErrorToast />
      {/* navbar */}
      <div className="fixed top-0 w-full h-16  flex  justify-between items-center z-50  bg-white border-b-[0.5px] border-borderColor shadow-sm">
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
        <div className="relative w-full h-full flex flex-row-reverse items-center pr-20 space-x-reverse space-x-8">
          <button
            onClick={handleClick}
            className={
              open
                ? "border-2 border-red-500 rounded-full p-[1px]"
                : "border-gray-100 border-2 rounded-full p-[1px]"
            }
          >
            {/* <Avatar
              alt="avatar"
              src="images/man.png"
              // src={`${myInfo?.profile_pic_supplier}/${myInfo?.data.PROFILE_PIC_FILE_NAME}`}
            /> */}

            {myInfo?.data.PROFILE_PIC_FILE_NAME === "" ? (
              <FaUserCircle className="w-9 h-9 text-gray-300" />
            ) : (
              <img
                // src={`${myInfo?.profile_pic_supplier}/${myInfo?.data.PROFILE_PIC_FILE_NAME}`}
                src={profilePicSrc!}
                alt="avatar"
                className="w-9 h-9 rounded-full"
              />
            )}

            {/* <FaUserCircle className="w-9 h-9 text-gray-300" /> */}

            {profileOpen && (
              <span className="w-4 h-4 absolute border-[.9px] border-[rgba(145,158,171,0.12)] backdrop-blur-[16px] bg-[#f2fbfc] bottom-[2px] rounded-sm transform rotate-45 right-[90px] z-50"></span>

              // <span className={`absolute bottom-[-3px] right-[9px] w-0 h-0 border-solid border-l-transparent border-r-transparent border-b-gray-100 border-l-[10px] border-r-[10px] border-b-[20px]`}></span>
            )}
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
            <div className=" flex flex-col items-start py-2  w-44  rounded-lg backdrop-blur-lg bg-opacity-50">
              <p className="px-4 text-[16px] text-blackColor font-medium font-mon">
                {myInfo?.data.FULL_NAME}
              </p>
              <p className="px-4 text-sm text-graishColor font-mon">
                {myInfo?.data.USER_NAME}
              </p>
              <p className="px-4 text-sm text-graishColor font-mon">
                {myInfo?.data.EMPLOYEE_ID}
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

      {/* end navbar */}

      <div className="flex flex-row mt-16 overflow-hidden">
        {/* Side menu */}
        <div
          className={`${isSmall ? "w-24 " : "w-60"}  h-screen overflow-y-auto`}
        >
          {/* Side menu content */}
          <div className="relative h-screen overflow-visible">
            <div
              className={`fixed h-screen no-scrollbar  overflow-y-auto overflow-visible  bg-whiteColor ${isSmall ? "w-24 " : "w-60"
                } border-[0.5px] border-r-borderColor border-t-0 border-l-0 border-b-0`}
            >
              <div className="sticky top-[0px] left-0 px-4 py-2 bg-white">
                <div className=" flex flex-row w-full space-x-[2px]  ring-1 h-10 ring-borderColor rounded-md  items-center pl-[4px] bg-white">
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

              <div className="w-full  mt-2 px-4 flex flex-col items-start space-y-[10px]">
                {isLoading ? (
                  <div className=" w-full h-screen flex justify-center items-center">
                    <CircularProgressIndicator />
                  </div>
                ) : (
                  <>
                    {menuList.map((m, i) => (
                      <Link
                        to={`/supplier-home/${m.MENU_ID}`}
                        key={m.MENU_ID}
                        onClick={(e) => {
                          e.preventDefault();
                          clearStoreOrContext();
                          setMenu(m.MENU_ID);
                        }}
                        className={`py-2 w-full flex  ${menu === m.MENU_ID
                          ? "bg-[#ec1c24] hover:bg-[#FF0000] text-white"
                          : "hover:bg-[#FF0000]"
                          }  rounded-md  
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
                            <div className=" w-full flex items-center space-x-10">
                              <p
                                className={`${menu === m.MENU_ID
                                  ? " text-white"
                                  : "text-midBlack"
                                  } font-medium font-mon text-sm  text-start`}
                              >
                                {m.MENU_NAME}
                              </p>

                              {m.MENU_ID === 740 &&
                                rfqListLength + rfqListOpenLength > 0 ? (
                                <p className=" py-1 px-2 flex rounded-[100px] bg-redColor font-mon font-semibold justify-center items-center text-white text-xs">
                                  {m.MENU_ID === 740
                                    ? `${rfqListLength + rfqListOpenLength}`
                                    : null}
                                </p>
                              ) : null}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}

                    {/* <button
                      onClick={() => {
                        setMenu(5000);
                      }}
                      className="text-sm"
                    >
                      <h5 className="font-bold">Gate Received</h5>
                    </button> */}

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

                      {isSmall ? null : <p className=" font-mon">Logout</p>}
                    </button>
                  </>
                )}
                <div className=" h-32"></div>
              </div>
            </div>
          </div>
        </div>
        {/* end side menu */}

        {/* page area */}
        <div className="flex-1 overflow-y-auto">
          {(() => {
            switch (menu) {
              // case 710:
              //   return (
              //     // <SupplierRfqPageProvider>
              //     //   <RfqHomePageFromSupplier />
              //     // </SupplierRfqPageProvider>
              //     // <TechnicalQuotationSubmissionPage />
              //     <SupplierPoHome />
              //   );
              case 710:
                return (
                  <PoPageProvider>
                    <PoHomePage />
                  </PoPageProvider>
                );
              case 620:
                return <SupplierProfilePage />;
              case 740:
                return (
                  <SupplierRfqPageProvider>
                    <SupplierRfqIdProvider>
                      <RfqHomePageFromSupplier />
                    </SupplierRfqIdProvider>
                  </SupplierRfqPageProvider>
                );
              case 500:
                return <Supplierhome />;
              case 800:
                return <ShipmentReceiveListPage />;

              default:
                return null;
            }
          })()}
        </div>
        {/* end page area */}
      </div>
    </div>
  );
}
