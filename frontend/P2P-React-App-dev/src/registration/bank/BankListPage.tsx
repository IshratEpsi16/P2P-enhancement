import React, { useState, useEffect } from "react";
import { useBankPageContext } from "../context/BankPageContext";
import { BankInterface } from "../interface/RegistrationInterface";
import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";
import ErrorToast, { showErrorToast } from "../../Alerts_Component/ErrorToast";
import BankListService from "../service/bank/BankListService";
import { useAuth } from "../../login_both/context/AuthContext";
import { isTokenValid } from "../../utils/methods/TokenValidityCheck";
import { useNavigate } from "react-router-dom";
import BankDetailsPage from "./BankDetailsPage";
import PageTitle from "../../common_component/PageTitle";
import CommonButton from "../../common_component/CommonButton";
import LogoLoading from "../../Loading_component/LogoLoading";
import EditIcon from "../../icons/EditIcon";
import ProfileUpdateSubmissionService from "../service/profile_update_submission/ProfileUpdateSubmissionService";
import WarningModal from "../../common_component/WarningModal";
import DocumentFileRemoveService from "../service/declaration/DocumentFileRemoveService";
import useAuthStore from "../../login_both/store/authStore";

export default function BankListPage() {
  const {
    page,
    setPage,
    bankAccId,
    setBankAccId,
    bankAccLength,
    setBankAccLength,
  } = useBankPageContext();
  const {
    regToken,
    submissionStatus,
    isRegCompelte,
    token,
    setSubmissionStatus,
  } = useAuth();

  const { isRegistrationInStore, isProfileUpdateStatusInStore, isNewInfoStatusInStore } = useAuthStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bankList, setBankList] = useState<BankInterface[] | []>([]);

  const navigate = useNavigate();

  //first time api call

  useEffect(() => {
    console.log("proStatus: ", isProfileUpdateStatusInStore);
    console.log("newInfoStatus: ", isNewInfoStatusInStore);
  }, []);

  useEffect(() => {
    const isTokenExpired = !isTokenValid(regToken!);
    if (isTokenExpired) {
      localStorage.removeItem("regToken");
      showErrorToast("Please Login Again..");
      setTimeout(() => {
        navigate("/");
      }, 1200);
    } else {
      GetBankList();
    }
  }, [bankAccLength]);

  const GetBankList = async () => {
    try {
      setIsLoading(true);
      const result = await BankListService(regToken!);
      if (result.data.status === 200) {
        setIsLoading(false);
        setBankList(result.data.data);
        setBankAccLength(result.data.data.length);
      } else {
        setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      //handle error
      setIsLoading(false);
      showErrorToast("Something went wrong");
    }
  };

  //navigate to details page
  const navigateToDetails = (bankAccId: number) => {
    setPage(2);
    setBankAccId(bankAccId);
  };

  //navigate to site creation page
  const navigateToCreate = () => {
    setPage(2);
  };

  //get exsiting list

  const nextpage = () => {
    navigate(`/register/5`);
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

  //file delete

  return (
    <div className=" bg-whiteColor justify-between flex flex-col h-screen">
      <SuccessToast />
      <WarningModal
        isOpen={isWarningShowSubmit}
        action={profileUpdateSubmission}
        closeModal={closeModalSubmit}
        message="Do you want to submit ?"
        imgSrc="/images/warning.png"
      />
      {
        //    bankList.length===0
        !isLoading && bankAccLength === 0 ? (
          <BankDetailsPage />
        ) : (
          <>
            <div className=" w-full flex justify-between items-center mb-6">
              <PageTitle titleText="Bank List page" />
              {
                // bankList.length < 2
                // bankAccLength<2
                // ?

                <CommonButton
                  onClick={navigateToCreate}
                  titleText="Add New Bank"
                  width="w-32"
                  height="h-8"
                  color={`bg-midGreen ${isNewInfoStatusInStore === "IN PROCESS" || submissionStatus !== "DRAFT" ? 'opacity-50' : ''}`}
                  disable={isNewInfoStatusInStore === "IN PROCESS" || submissionStatus !== "DRAFT"}
                />
                // :
                // <p className=' mediumText'>Maximum Number of bank Added</p>
              }
            </div>
            {isLoading ? (
              <div className=" w-full h-screen flex justify-center items-center">
                <LogoLoading />
              </div>
            ) : (
              <>
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
                          ACCOUNT NAME
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900  tracking-wider font-mon">
                          BANK NAME
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900  tracking-wider font-mon">
                          BRANCH NAME
                        </th>
                      </tr>
                    </thead>

                    {bankList.map((e, i) => (
                      <tbody
                        key={e.ID}
                        className="bg-white divide-y divide-gray-200"
                      >
                        <tr>
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
                              {e.ACCOUNT_NAME != null ? e.ACCOUNT_NAME : "N/A"}
                            </div>
                          </td>
                          <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                            <div className="w-full overflow-auto custom-scrollbar text-center">
                              {e.BANK_NAME != null ? e.BANK_NAME : "N/A"}
                            </div>
                          </td>
                          <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                            <div className="w-full overflow-auto custom-scrollbar text-center">
                              {e.BRANCH_NAME != null ? e.BRANCH_NAME : "N/A"}
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

                {isRegCompelte !== "1" && (
                  <div className="w-full pr-8 flex justify-end items-end mb-16 mt-10 ">
                    <CommonButton
                      titleText="Next"
                      width="w-28"
                      onClick={nextpage}
                    />
                  </div>
                )}
                {/* <div className=" overflow-x-auto">
                  <table
                    className="min-w-full divide-y divide-borderColor border-[0.2px] border-borderColor rounded-md"
                    style={{ tableLayout: "fixed" }}
                  >
                    <thead className=" sticky top-0 bg-[#F4F6F8] h-14">
                      <tr>
                        <td className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  ">
                          Action
                        </td>
                        <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap ">
                          SL
                        </th>
                        <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                          ACCOUNT NAME
                        </th>
                        <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                          BANK NAME
                        </th>
                        <th className="   font-mon  px-6 py-3 text-left text-sm font-medium text-blackColor tracking-wider ">
                          BRANCH NAME
                        </th>
                      </tr>
                    </thead>
                    {bankList.map((e, i) => (
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
                        <td className=" font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                          {e.ACCOUNT_NAME != null ? e.ACCOUNT_NAME : "N/A"}
                        </td>
                        <td className=" font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                          {e.BANK_NAME != null ? e.BANK_NAME : "N/A"}
                        </td>
                        <td className=" font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                          {e.BRANCH_NAME != null ? e.BRANCH_NAME : "N/A"}
                        </td>
                      </tbody>
                    ))}
                  </table>
                </div> */}
              </>
            )}
          </>
        )
      }

      <div className=" flex-1"></div>
      <div>
        {isRegCompelte === "1" ? (
          <div className=" w-full flex justify-end "></div>
        ) : null}
      </div>

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
  );
}
