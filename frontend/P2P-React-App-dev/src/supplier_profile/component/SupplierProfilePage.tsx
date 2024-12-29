import React, { useState, useEffect } from "react";
import PageTitle from "../../common_component/PageTitle";
import NavigationPan from "../../common_component/NavigationPan";

import BasicInformationSupplierProfilePage from "./BasicInformationSupplierProfilePage";
import { SupplierDocumentPageProvider } from "../context/SupplierDocumentPageContext";
import DocumentSupplierProfilePage from "./DocumentSupplierProfilePage";
import DeclarationSupplierProfilePage from "./DeclarationSupplierProfilePage";
import BasicInformationPage from "../../registration/component/BasicInformationPage";

import { useAuth } from "../../login_both/context/AuthContext";
import { DocumentPageProvider } from "../../registration/context/DocumentPageContext";
import DocumentsPage from "../../registration/component/DocumentsPage";
import DeclarationPage from "../../registration/component/DeclarationPage";
import { ContactPageProvider } from "../../registration/context/ContactPageContext";
import ContactHome from "../../registration/component/contact/ContactHome";
import { SiteCreationPageProvider } from "../../registration/context/SiteCreationPageContext";
import SiteCreationHome from "../../registration/component/site_creation/SiteCreationHome";
import { BankPageProvider } from "../../registration/context/BankPageContext";
import BankHome from "../../registration/bank/BankHome";
import ApprovalPage from "./ApprovalPage";
import LogoLoading from "../../Loading_component/LogoLoading";

const pan = ["Home", "Profile"];
const btnList = [
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
    id: 130,
    name: "Contact",
  },

  {
    id: 150,
    name: "Bank Details",
  },
  {
    id: 140,
    name: "Site",
  },
];
const btnList1 = [
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
    id: 130,
    name: "Bank Details",
  },

  {
    id: 140,
    name: "Site",
  },
  {
    id: 150,
    name: "Contact",
  },
  {
    id: 160,
    name: "Approval",
  },
];
interface MenuInfo {
  name: string;
  id: number;
}
export default function SupplierProfilePage() {
  const [selectedButton, setSelectedButton] = useState<number>(100);
  const [page, setPage] = useState<number>(100);

  const [buttonList, setButtonList] = useState<MenuInfo[]>();

  const { submissionStatus } = useAuth();

  useEffect(() => {
    setButtonList(btnList1);
    // if (submissionStatus === "DRAFT") {
    //   setButtonList(btnList);
    // } else {

    // }
  }, [submissionStatus]);

  const handleButton = (buttonId: number) => {
    setSelectedButton(buttonId);
    setPage(buttonId);
  };

  return (
    <div className="mx-8 mb-60">
      <div className=" flex flex-col items-start">
        <PageTitle titleText="User Profile" />
        {/* <NavigationPan list={pan} /> */}
      </div>

      {/* <div className=' w-full h-40 bg-inputBg rounded-md p-4 ring-[1px] ring-borderColor flex justify-between space-x-4 items-center  '>
                <div className=' flex-1 flex space-x-4 items-center'>
                    <img src="/images/user.jpg" alt="user" className=' h-16 w-16 rounded-full ring-2 ring-midGreen' />
                    <div className='flex-1 '>
                        <p className=' mediumText'>Ahsan habib</p>
                        <p className=' smallText'>supplier</p>

                    </div>
                </div>
                <div className=' flex-1 h-full rounded-md bg-lightOrange flex items-center justify-center '>
                    <div className=' flex flex-col items-center'>
                        <p className=' text-chocolate text-lg font-mon font-semibold'>1345</p>
                        <p className=' text-chocolate text-sm font-mon font-semibold'>RFQ</p>

                    </div>
                </div>
                <div className=' flex-1 h-full rounded-md  bg-lightBlue flex items-center justify-center'>
                    <div className=' flex flex-col items-center'>
                        <p className=' text-chocolate text-lg font-mon font-semibold'>1345</p>
                        <p className=' text-chocolate text-sm font-mon font-semibold'>PO</p>

                    </div>
                </div>
                <div className=' flex-1 h-full rounded-md  bg-lightPink flex items-center justify-center'>
                    <div className=' flex flex-col items-center'>
                        <p className=' text-chocolate text-lg font-mon font-semibold'>1345</p>
                        <p className=' text-chocolate text-sm font-mon font-semibold'>INVOICE</p>

                    </div>
                </div>
            </div> */}
      <div className=" h-6"></div>
      <div className=" w-full overflow-x-auto flex space-x-4  py-1 px-[1px]">
        {buttonList?.length === 0 || buttonList === undefined ? (
          <div className=" w-full flex justify-center items-center">
            <LogoLoading />
          </div>
        ) : (
          buttonList!.map((btn, i) => (
            <button
              onClick={() => {
                handleButton(btn.id);
              }}
              key={btn.id}
              className={`w-40 h-10 flex justify-center items-center text-midBlack  rounded-[4px] font-mon font-medium text-[13px]  ${
                selectedButton === btn.id
                  ? " bg-midBlue text-whiteColor"
                  : " ring-[1px] ring-borderColor bg-inputBg"
              }`}
            >
              {btn.name}
            </button>
          ))
        )}
      </div>
      <div className=" h-4"></div>
      <div className="w-full  border-[1px] ring-[#424242] px-4 py-4 rounded-md">
        {(() => {
          switch (page) {
            case 100:
              return <BasicInformationPage />;
            case 110:
              return (
                <DocumentPageProvider>
                  <DocumentsPage />
                </DocumentPageProvider>
              );
            case 120:
              return <DeclarationPage />;

            case 130:
              return (
                // <ContactPageProvider>
                //   <ContactHome />
                // </ContactPageProvider>

                <BankPageProvider>
                  <BankHome />
                </BankPageProvider>
              );
            case 140:
              return (
                <SiteCreationPageProvider>
                  <SiteCreationHome />
                </SiteCreationPageProvider>
              );
            case 150:
              return (
                // <BankPageProvider>
                //   <BankHome />
                // </BankPageProvider>

                <ContactPageProvider>
                  <ContactHome />
                </ContactPageProvider>
              );

            case 160:
              return <ApprovalPage />;

            default:
              return null;
          }
        })()}
      </div>
    </div>
  );
}