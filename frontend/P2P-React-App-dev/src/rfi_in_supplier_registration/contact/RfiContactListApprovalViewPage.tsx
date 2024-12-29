import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../login_both/context/AuthContext";
import { useNavigate } from "react-router-dom";
import ItemCategoryinterface from "../../registration/interface/CategoryInterface";

import { isTokenValid } from "../../utils/methods/TokenValidityCheck";

import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";

import ErrorToast, { showErrorToast } from "../../Alerts_Component/ErrorToast";

import BasicInfoViewForApprovalService from "../../manage_supplier/service/basic_info/BasicInfoViewForApprovalService";

import ItemCategoryListServiceService from "../../registration/service/basic_info/ItemCategoryListService";

import convertKeysToLowerCase from "../../utils/methods/convertKeysToLowerCase";

import LogoLoading from "../../Loading_component/LogoLoading";

import InputLebel from "../../common_component/InputLebel";

import CommonInputField from "../../common_component/CommonInputField";

import CommonDropDownSearch from "../../common_component/CommonDropDownSearch";
import { useRfiContactApprovalViewContext } from "../context/RfiContactApprovalViewContext";

import SupplierContactInterface from "../../registration/interface/SupplierContactInterface";

import ContactListViewForApprovalService from "../../manage_supplier/service/contact/ContactListViewForApprovalService";

import PageTitle from "../../common_component/PageTitle";

import CommonButton from "../../common_component/CommonButton";
import EditIcon from "../../icons/EditIcon";

export default function RfiContactListApprovalViewPage() {
  const { setPage, setContactId, setContactLength, contactLength } =
    useRfiContactApprovalViewContext();
  const { token, supplierId } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [contactList, setContactList] = useState<
    SupplierContactInterface[] | []
  >([]);

  //first time data load

  useEffect(() => {
    const isTokenExpired = !isTokenValid(token!);
    if (isTokenExpired) {
      localStorage.removeItem("token");
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
      const result = await ContactListViewForApprovalService(
        token!,
        supplierId!
      );

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
  return (
    <div className="  bg-whiteColor">
      <SuccessToast />
      {
        <>
          <div className=" w-full flex justify-between items-center mb-6">
            <PageTitle titleText="Contact List" />
            {/* {
                                contactLength < 5
                                ?
                                <CommonButton onClick={navigateToCreate} titleText='Create a contact' width='w-40' height='h-8' color='bg-midGreen' />
                                :
                                <p className=' mediumText'>Maximum Number of Cantact Added</p> 

                            } */}
          </div>

          {isLoading ? (
            <div className=" flex justify-center items-center w-full h-screen">
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
                        Name
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        Position
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        Mobile Number 1
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        Mobile Number 2
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        Email
                      </th>
                    </tr>
                  </thead>

                  {contactList.map((e, i) => (
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
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
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
