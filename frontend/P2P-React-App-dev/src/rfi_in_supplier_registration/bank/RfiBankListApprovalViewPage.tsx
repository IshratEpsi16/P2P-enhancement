import React, { useState, useEffect } from "react";
import { useAuth } from "../../login_both/context/AuthContext";
import { useNavigate } from "react-router-dom";
import ItemCategoryinterface from "../../registration/interface/CategoryInterface";
import { isTokenValid } from "../../utils/methods/TokenValidityCheck";

import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";

import ErrorToast, { showErrorToast } from "../../Alerts_Component/ErrorToast";

import ItemCategoryListServiceService from "../../registration/service/basic_info/ItemCategoryListService";

import convertKeysToLowerCase from "../../utils/methods/convertKeysToLowerCase";
import LogoLoading from "../../Loading_component/LogoLoading";

import InputLebel from "../../common_component/InputLebel";

import CommonInputField from "../../common_component/CommonInputField";

import CommonDropDownSearch from "../../common_component/CommonDropDownSearch";

import SupplierContactInterface from "../../registration/interface/SupplierContactInterface";

import ContactListViewForApprovalService from "../../manage_supplier/service/contact/ContactListViewForApprovalService";

import PageTitle from "../../common_component/PageTitle";

import CommonButton from "../../common_component/CommonButton";

import EditIcon from "../../icons/EditIcon";

import BankInterface from "../../registration/interface/BankInterface";

import { useRfiBankViewApprovalContext } from "../context/RfiBankApprovalViewContext";

import BankListViewForApprovalService from "../../manage_supplier/service/bank/BankListViewForApprovalService";

export default function RfiBankListApprovalViewPage() {
  const {
    page,
    setPage,
    bankAccId,
    setBankAccId,
    bankAccLength,
    setBankAccLength,
  } = useRfiBankViewApprovalContext();
  const { token, submissionStatus, supplierId } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bankList, setBankList] = useState<BankInterface[] | []>([]);

  const navigate = useNavigate();

  //first time api call

  useEffect(() => {
    const isTokenExpired = !isTokenValid(token!);
    if (isTokenExpired) {
      localStorage.removeItem("token");
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
      const result = await BankListViewForApprovalService(token!, supplierId!);
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
  return (
    <div className=" bg-whiteColor">
      <SuccessToast />
      {
        <>
          <div className=" w-full flex justify-between items-center mb-6">
            <PageTitle titleText="Bank List page" />
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
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        Action
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        Sl
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        Account Name
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        Bank Name
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        Branch Name
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
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          )}
        </>
      }
    </div>
  );
}
