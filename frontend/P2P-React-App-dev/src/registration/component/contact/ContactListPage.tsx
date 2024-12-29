import React, { useEffect, useState } from "react";

import { useContactPageContext } from "../../context/ContactPageContext";
import ContactListService from "../../service/contact/ContactListService";

import { useAuth } from "../../../login_both/context/AuthContext";
import { useNavigate } from "react-router-dom";

import SuccessToast, {
  showSuccessToast,
} from "../../../Alerts_Component/SuccessToast";

import ErrorToast, {
  showErrorToast,
} from "../../../Alerts_Component/ErrorToast";

import { SupplierContactInterface } from "../../interface/RegistrationInterface";
import PageTitle from "../../../common_component/PageTitle";
import CommonButton from "../../../common_component/CommonButton";
import LogoLoading from "../../../Loading_component/LogoLoading";
import EditIcon from "../../../icons/EditIcon";
import ContactSupplierPage from "./ContactSupplierPage";
import { isTokenValid } from "../../../utils/methods/TokenValidityCheck";
import ProfileUpdateSubmissionService from "../../service/profile_update_submission/ProfileUpdateSubmissionService";
import WarningModal from "../../../common_component/WarningModal";
import SubmitRegistrationService from "../../service/registration_submission/submitRegistrationService";
import useAuthStore from "../../../login_both/store/authStore";

export default function ContactListPage() {
  const { setPage, setContactId, setContactLength, contactLength } =
    useContactPageContext();
  const {
    regToken,
    isRegCompelte,
    token,
    submissionStatus,
    setSubmissionStatus,
  } = useAuth();
  const navigate = useNavigate();

  const { isRegistrationInStore, isProfileUpdateStatusInStore, isNewInfoStatusInStore } = useAuthStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [contactList, setContactList] = useState<
    SupplierContactInterface[] | []
  >([]);

  //first time data load

  useEffect(() => {
    const isTokenExpired = !isTokenValid(regToken!);
    if (isTokenExpired) {
      localStorage.removeItem("regToken");
      showErrorToast("Please Login Again..");
      setTimeout(() => {
        navigate("/");
      }, 1200);
    } else {
      getExitingData();
    }
  }, [contactLength]);

  //navigate to edit

  const navigateToDetails = (contactId: number) => {
    setPage(2);
    setContactId(contactId);
  };

  //navigate to create

  const navigateToCreate = () => {
    setPage(2);
  };

  //existing data load

  const getExitingData = async () => {
    setIsLoading(true);
    try {
      const result = await ContactListService(regToken!);

      if (result.data.status === 200) {
        setIsLoading(false);
        setContactList(result.data.data);
        setContactLength(result.data.data.length);
      } else {
        setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      showErrorToast("Something went wrong");
    }
  };

  const nextpage = () => {
    navigate(`/register/5`);
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

  //set disable

  //final submission

  const submission = async () => {
    closeModalSubmit();
    setIsFinalSubmissionLoading(true);
    try {
      // if()
      const result = await SubmitRegistrationService(regToken!);
      if (result.data.status === 201) {
        setSubmissionStatus("SUBMIT"); //SUBMIT
        setIsFinalSubmissionLoading(false);
        showSuccessToast(result.data.message);
        setIsDisable(true);
        setTimeout(() => {
          navigate(`/register/7`);
        }, 3200);
      } else {
        setIsFinalSubmissionLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsFinalSubmissionLoading(false);
      showErrorToast("Something went wrong.");
    }
    // sendEmail();  //hide korlam back theke felbe tai
  };
  //final submission

  const finalSubmission = () => {
    if (isRegCompelte === "1") {
      profileUpdateSubmission();
    } else {
      submission();
    }
  };

  return (
    <div className=" bg-whiteColor  justify-between flex flex-col ">
      <WarningModal
        isOpen={isWarningShowSubmit}
        action={finalSubmission}
        closeModal={closeModalSubmit}
        message="Do you want to submit ?"
        imgSrc="/images/warning.png"
      />
      {!isLoading && contactLength === 0 ? (
        <ContactSupplierPage />
      ) : (
        <>
          {isLoading ? (
            <div className=" flex justify-center items-center w-full h-screen">
              <LogoLoading />
            </div>
          ) : (
            <>
              <div className=" w-full flex justify-between items-center my-4">
                <PageTitle titleText="Contact List" />
                {contactLength < 5 ? (
                  <CommonButton
                    onClick={navigateToCreate}
                    titleText="Add New contact"
                    width="w-40"
                    color={`bg-midGreen ${isNewInfoStatusInStore === "IN PROCESS" || submissionStatus !== "DRAFT" ? 'opacity-50' : ''}`}
                    disable={isNewInfoStatusInStore === "IN PROCESS" || submissionStatus !== "DRAFT"}
                  />
                ) : (
                  // <p className=" mediumText">Maximum Number of Cantact Added</p>

                  <div className="text-sm text-[#5F2120] bg-[#ffe4e4] w-80 h-10 px-4 flex items-center rounded-md space-x-2 font-bold">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-red-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                      />
                    </svg>

                    <p>Maximum Number of Contact Added</p>
                  </div>
                )}
              </div>
              <div className="overflow-auto max-h-[400px] rounded-lg shadow-lg custom-scrollbar">
                <table className="min-w-full divide-y divide-gray-200 rounded-lg">
                  <thead className="bg-[#CAF4FF] sticky top-0 ">
                    <tr>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900  tracking-wider font-mon">
                        Action
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900  tracking-wider font-mon">
                        SL
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900  tracking-wider font-mon">
                        NAME
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900  tracking-wider font-mon">
                        POSITION
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900  tracking-wider font-mon">
                        MOBILE NUMBER 1
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900  tracking-wider font-mon">
                        MOBILE NUMBER 2
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900  tracking-wider font-mon">
                        EMAIL
                      </th>
                    </tr>
                  </thead>

                  {contactList.map((e, i) => (
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr key={e.ID}>
                        <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                          <div className="w-full overflow-auto custom-scrollbar text-center">
                            <button
                              onClick={() => {
                                navigateToDetails(e.ID);
                              }}
                            >
                              <EditIcon />
                            </button>
                          </div>
                        </td>
                        <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar ">
                          <div className="w-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                            {i + 1}
                          </div>
                        </td>
                        <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                          <div className="w-full overflow-auto custom-scrollbar text-center">
                            {e.NAME != null ? e.NAME : "N/A"}
                          </div>
                        </td>
                        <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                          <div className="w-full overflow-auto custom-scrollbar text-center">
                            {e.POSITION != null ? e.POSITION : "N/A"}
                          </div>
                        </td>
                        <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                          <div className="w-full overflow-auto custom-scrollbar text-center">
                            {e.MOB_NUMBER_1 != null ? e.MOB_NUMBER_1 : "N/A"}
                          </div>
                        </td>
                        <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                          <div className="w-full overflow-auto custom-scrollbar text-center">
                            {e.MOB_NUMBER_2 != null ? e.MOB_NUMBER_2 : "N/A"}
                          </div>
                        </td>
                        <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                          <div className="w-full overflow-auto custom-scrollbar text-center">
                            {e.EMAIL != null ? e.EMAIL : "N/A"}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  ))}

                  <tfoot className="bg-white sticky bottom-0">
                    <tr>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center">
                        {/* <button
                    disabled={localPageNo === 1 ? true : false}
                    onClick={previous}
                    className=" px-4 py-2 rounded-md flex space-x-2 items-center shadow-md border-[0.5px] border-borderColor "
                  >
                    <div className="w-4 h-4 ">
                      <ArrowLeftIcon className=" w-full h-full " />
                    </div>
                    <p className=" text-sm">Previous</p>
                  </button> */}
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center">
                        {/* <button
                    disabled={localPageNo === total ? true : false}
                    onClick={next}
                    className=" px-4 py-2 rounded-md flex space-x-2 items-center shadow-md border-[0.5px] border-borderColor "
                  >
                    <p className=" text-sm">Next</p>
                    <div className="w-4 h-4 ">
                      <ArrowRightIcon className=" w-full h-full " />
                    </div>
                  </button> */}
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>
              {/* <div className="overflow-x-auto bg-white">
                <table
                  className="min-w-full divide-y divide-borderColor border-[0.2px] border-borderColor rounded-md"
                  style={{ tableLayout: "fixed" }}
                >
                  <thead className="sticky top-0 bg-[#F4F6F8] h-14">
                    <tr>
                      <td className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  ">
                        Action
                      </td>
                      <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap ">
                        SL
                      </th>
                     
                      <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                        NAME
                      </th>
                      <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                        POSITION
                      </th>
                      <th className="   font-mon  px-6 py-3 text-left text-sm font-medium text-blackColor tracking-wider ">
                        MOBILE NUMBER 1
                      </th>
                      <th className="   font-mon  px-6 py-3 text-left text-sm font-medium text-blackColor tracking-wider ">
                        MOBILE NUMBER 2
                      </th>
                      <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                        EMAIL
                      </th>

                      
                    </tr>
                  </thead>

                  {contactList.map((e, i) => (
                    <tbody
                      className="bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]"
                      key={i}
                    >
                      <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor font-medium">
                        <button
                          onClick={() => {
                            navigateToDetails(e.ID);
                          }}
                        >
                          <EditIcon />
                        </button>
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor whitespace-normal ">
                        {i + 1}
                      </td>
                      
                      <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                        <div className=" w-40">
                          {e.NAME != null ? e.NAME : "N/A"}
                        </div>

          
                      </td>
                      <td className="  font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor whitespace-normal">
                        <div className=" w-52">
                          {e.POSITION != null ? e.POSITION : "N/A"}
                        </div>
                      </td>
                     
                      <td className=" font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  ">
                        <div className=" w-52">
                          {e.MOB_NUMBER_1 != null ? e.MOB_NUMBER_1 : "N/A"}
                        </div>
                      </td>
                      <td className=" font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  ">
                        <div className=" w-52">
                          {e.MOB_NUMBER_2 != null ? e.MOB_NUMBER_2 : "N/A"}
                        </div>
                      </td>
                      <td className=" font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                        {
                          <div className=" w-52">
                            {e.EMAIL != null ? e.EMAIL : "N/A"}
                          </div>
                          
                        }
                      </td>

                      
                    </tbody>
                  ))}
                </table>
              </div> */}
            </>
          )}
        </>
      )}

      {/* <div className=" flex-1"></div> */}
      <div className=" h-4"></div>

      {/* {isRegCompelte !== "1" && (
        <div className="w-full pr-8 flex justify-end items-end mb-16 mt-10 ">
          <CommonButton titleText="Next" width="w-28" onClick={nextpage} />
        </div>
      )} */}

      {/* {isRegCompelte === "1" ? (
        <CommonButton
          disable={isDisable}
          titleText={"Submit"}
          onClick={showWarning}
          width="w-48"
          color="bg-midGreen"
        />
      ) : null} */}
      <div className=" w-full flex justify-end items-end">
        <CommonButton
          disable={isDisable}
          titleText={"Submit"}
          onClick={showWarning}
          width="w-48"
          color={`bg-midGreen ${submissionStatus !== "DRAFT" ? 'opacity-50' : ''}`}
        />
      </div>
    </div>
  );
}
