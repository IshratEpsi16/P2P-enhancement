import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import CommonButton from "../../common_component/CommonButton";
import BasicInformationPage from "./BasicInformationPage";
import DocumentsPage from "./DocumentsPage";
import DeclarationPage from "./DeclarationPage";
import ContactSupplierPage from "./contact/ContactSupplierPage";
import { DocumentPageProvider } from "../context/DocumentPageContext";
import SiteCreationPage from "./site_creation/SiteCreationPage";
import BankDetailsPage from "../bank/BankDetailsPage";
import LogOutIcon from "../../icons/LogOutIcon";
import DeleteModal from "../../common_component/DeleteModal";
import LogOutModal from "../../common_component/LogoutModal";
import { isTokenValid } from "../../utils/methods/TokenValidityCheck";

import { useAuth } from "../../login_both/context/AuthContext";
import { SiteCreationPageProvider } from "../context/SiteCreationPageContext";
import SiteCreationHome from "./site_creation/SiteCreationHome";
import { ContactPageProvider } from "../context/ContactPageContext";
import ContactHome from "./contact/ContactHome";
import { BankPageProvider } from "../context/BankPageContext";
import BankHome from "../bank/BankHome";
import useRegistrationStore from "../store/registrationStore";
import SubmitRegistrationService from "../service/registration_submission/submitRegistrationService";
import WarningModal from "../../common_component/WarningModal";
import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";

import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";
import ErrorToast, { showErrorToast } from "../../Alerts_Component/ErrorToast";
import ApprovalPageInRegistration from "./ApprovalPageInRegistration";
import LogoLoading from "../../Loading_component/LogoLoading";

const menuList = [
  {
    name: "Basic Info",
    id: 1,
  },
  {
    name: "Documents",
    id: 2,
  },
  {
    name: "Declaration",
    id: 3,
  },

  {
    name: "Bank Details",
    id: 4,
  },
  {
    name: "Site Creation",
    id: 5,
  },

  {
    name: "Contact",
    id: 6,
  },
];
const menuList1 = [
  {
    name: "Basic Info",
    id: 1,
  },
  {
    name: "Documents",
    id: 2,
  },
  {
    name: "Declaration",
    id: 3,
  },
  {
    name: "Bank Details",
    id: 4,
  },
  {
    name: "Site Creation",
    id: 5,
  },

  {
    name: "Contact",
    id: 6,
  },
  {
    name: "Approval",
    id: 7,
  },
];

interface MenuInfo {
  name: string;
  id: number;
}

export default function RegistrationPage() {
  const [menu, setMenu] = useState(1);
  const [mList, setMList] = useState<MenuInfo[]>();
  const navigate = useNavigate();
  const { id } = useParams();

  //token
  const {
    regToken,
    setRegToken,
    setIsBuyer,
    submissionStatus,
    setSubmissionStatus,
    setIsRegCompelte,
    isRegCompelte,
    setUserId,
  } = useAuth();
  //token

  useEffect(() => {
    if (submissionStatus === "DRAFT") {
      setMList(menuList1);
    } else {
      setMList(menuList1);
    }
  }, [submissionStatus]);

  useEffect(() => {
    // Check if the id is present in the URL params
    const menuId = parseInt(id ?? "", 10);

    // If the id is valid, set the menu
    if (!isNaN(menuId) && menuId >= 1 && menuId <= 7) {
      setMenu(menuId);
    } else {
      // If id is not valid, set a default menu (e.g., 1)
      setMenu(1);
    }
  }, [id]);

  //token validation
  useEffect(() => {
    const isTokenExpired = !isTokenValid(regToken!);
    if (isTokenExpired) {
      localStorage.removeItem("regToken");
      localStorage.removeItem("submissionStatus");
      localStorage.removeItem("supplierCountryCode");
      navigate("/");
    }
  }, [regToken]);
  //token validation

  const changeMenu = (menu: number) => {
    setMenu(menu);
    navigate(`/register/${menu}`);
    // saveToLocal(menu);
  };

  //logout

  const [isLogOutOpen, setIsLogOutOpen] = useState<boolean>(false);
  const openLogOutModal = () => {
    setIsLogOutOpen(true);
  };
  const closeModal = () => {
    setIsLogOutOpen(false);
  };

  const setGlobalIncorporatedIn = useRegistrationStore(
    (state) => state.setGlobalIncorporatedIn
  );

  const logout = () => {
    localStorage.removeItem("regToken");
    localStorage.removeItem("submissionStatus");
    localStorage.removeItem("isBuyer");
    localStorage.removeItem("isRegCompelte");
    localStorage.removeItem("supplierCountryCode");
    localStorage.removeItem("userId");
    localStorage.removeItem("gin");

    setRegToken(null);
    setIsBuyer(null);
    setSubmissionStatus(null);
    setIsRegCompelte(null);
    setUserId(null);
    setGlobalIncorporatedIn(null);

    navigate("/");
  };

  //disabling field
  const [isDisable, setIsDisable] = useState<boolean>(false);
  //disabling field

  //set disable

  useEffect(() => {
    if (submissionStatus === "DRAFT") {
      setIsDisable(false);
    } else {
      setIsDisable(true);
    }
  }, [submissionStatus]);

  //logout

  //overflow-hidden
  return (
    <div className=" flex   ">
      <SuccessToast />

      {/* <LogOutModal
        isOpen={isLogOutOpen}
        doLogOut={logout}
        closeModal={closeModal}
      /> */}

      <WarningModal
        isOpen={isLogOutOpen}
        action={logout}
        closeModal={closeModal}
      />

      {/* side menu */}

      <div className="w-60 h-screen bg-midBlack   overflow-y-auto">
        <div className=" fixed w-60  flex flex-col items-start justify-between bg-midBlack h-full   ">
          <div className=" flex flex-col space-y-6  mt-20  overflow-y-auto no-scrollbar items-start  mx-4">
            {mList?.length === 0 || mList === undefined ? (
              <div className=" w-full flex justify-center items-center">
                <LogoLoading />
              </div>
            ) : (
              mList!.map((m, i) => (
                <Link
                  to={`/register/${m.id}`}
                  onClick={(e) => {
                    changeMenu(m.id);
                    e.preventDefault();
                  }}
                  className={`text-sm font-mon font-semibold py-2 px-2 w-52 rounded-sm ${
                    menu === m.id
                      ? "text-blackColor bg-offWhiteColor"
                      : "text-whiteColor"
                  }`}
                  key={m.id}
                >
                  {m.name}
                </Link>
              ))
            )}
          </div>
          <div className=" flex-1"></div>
          <button
            onClick={openLogOutModal}
            className="mx-4  mb-4 flex items-center space-x-2 py-2 px-2 w-52 text-whiteColor  text-sm font-mon font-semibold"
          >
            <LogOutIcon className=" h-6 w-6 text-whiteColor" />
            <p>Logout</p>
          </button>
        </div>
      </div>
      {/* end side menu */}
      {/* overflow-y-auto  */}
      <div className=" flex-1 m-8 overflow-y-auto flex flex-col">
        {(() => {
          switch (menu) {
            case 1:
              return <BasicInformationPage />;

            case 2:
              return (
                <DocumentPageProvider>
                  <DocumentsPage />
                </DocumentPageProvider>
              );
            case 3:
              return <DeclarationPage />;

            case 4:
              return (
                <BankPageProvider>
                  <BankHome />
                </BankPageProvider>
              );

            case 6:
              return (
                <ContactPageProvider>
                  <ContactHome />
                </ContactPageProvider>
              );

            case 5:
              return (
                <SiteCreationPageProvider>
                  <SiteCreationHome />
                </SiteCreationPageProvider>
              );
            case 7:
              return <ApprovalPageInRegistration />;
            default:
              return null;
          }
        })()}
      </div>
    </div>
  );
}
