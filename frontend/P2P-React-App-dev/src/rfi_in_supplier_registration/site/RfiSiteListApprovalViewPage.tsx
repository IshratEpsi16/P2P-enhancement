import React, { useState, useEffect } from "react";

import EditIcon from "../../icons/EditIcon";

import PageTitle from "../../common_component/PageTitle";
import CommonButton from "../../common_component/CommonButton";

import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";

import { isTokenValid } from "../../utils/methods/TokenValidityCheck";

import { useAuth } from "../../login_both/context/AuthContext";

import { useNavigate } from "react-router-dom";

import moment from "moment";

import LogoLoading from "../../Loading_component/LogoLoading";

import SupplierSiteInterface from "../../registration/interface/SupplierSiteInterface";

import SiteListViewForApprovalService from "../../manage_supplier/service/site/SiteListViewForApprovalService";
import ErrorToast from "../../Alerts_Component/ErrorToast";
import { useRfiSiteApprovalViewContext } from "../context/RfiSiteApprovalViewContext";

export default function RfiSiteListApprovalViewPage() {
  const { setPage, setSiteId, siteLength, setSiteLength } =
    useRfiSiteApprovalViewContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [siteList, setSiteList] = useState<SupplierSiteInterface[] | []>([]);

  const { token, supplierId } = useAuth();
  const navigate = useNavigate();

  //token validation
  useEffect(() => {
    const isTokenExpired = !isTokenValid(token!);
    if (isTokenExpired) {
      localStorage.removeItem("token");
      showErrorToast("Please Login Again..");
      setTimeout(() => {
        navigate("/");
      }, 1200);
    } else {
      getExistingalist();
    }
  }, [siteLength]);
  //token validation

  //navigate to details page
  const navigateToDetails = (siteId: number) => {
    setPage(2);
    setSiteId(siteId);
  };

  //navigate to site creation page
  const navigateToCreate = () => {
    setPage(2);
  };

  //get exsiting list

  const getExistingalist = async () => {
    try {
      setIsLoading(true);
      const result = await SiteListViewForApprovalService(token!, supplierId!);
      if (result.data.status === 200) {
        setIsLoading(false);
        setSiteList(result.data.data);
        setSiteLength(result.data.data.length);
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
    <div className=" bg-whiteColor">
      {
        <>
          <div className=" w-full flex justify-between items-center mb-6">
            <PageTitle titleText="Site List page" />
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
                        SL
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        Country
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        Site Name
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        Address
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        City
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        Zip Code
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        Email
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        Mobile Number
                      </th>
                    </tr>
                  </thead>

                  {siteList.map((e, i) => (
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
                            {e.COUNTRY != null ? e.COUNTRY : "N/A"}
                          </div>
                        </td>
                        <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                          <div className="w-full overflow-auto custom-scrollbar text-center">
                            {e.ADDRESS_LINE1 != null ? e.ADDRESS_LINE1 : "N/A"}
                          </div>
                        </td>
                        <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                          <div className="w-full overflow-auto custom-scrollbar text-center">
                            {e.ADDRESS_LINE2 != null ? e.ADDRESS_LINE2 : "N/A"}
                          </div>
                        </td>
                        <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                          <div className="w-full overflow-auto custom-scrollbar text-center">
                            {e.CITY_STATE != null ? e.CITY_STATE : "N/A"}
                          </div>
                        </td>
                        <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar ">
                          <div className="w-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                            {e.ZIP_CODE != null ? e.ZIP_CODE : "N/A"}
                          </div>
                        </td>
                        <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                          <div className="w-full overflow-auto custom-scrollbar text-center">
                            {e.EMAIL != null ? e.EMAIL : "N/A"}
                          </div>
                        </td>
                        <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                          <div className="w-full overflow-auto custom-scrollbar text-center">
                            {
                              <div className=" w-52">
                                {e.MOBILE_NUMBER != null
                                  ? e.MOBILE_NUMBER
                                  : "N/A"}
                              </div>
                            }
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
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
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
