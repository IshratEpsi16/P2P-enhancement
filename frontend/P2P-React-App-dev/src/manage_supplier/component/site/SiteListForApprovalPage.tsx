import React, { useState, useEffect } from "react";

import EditIcon from "../../../icons/EditIcon";
import PageTitle from "../../../common_component/PageTitle";
import CommonButton from "../../../common_component/CommonButton";
import SuccessToast, {
  showSuccessToast,
} from "../../../Alerts_Component/SuccessToast";
import ErrorToast, {
  showErrorToast,
} from "../../../Alerts_Component/ErrorToast";
import { isTokenValid } from "../../../utils/methods/TokenValidityCheck";
import { useAuth } from "../../../login_both/context/AuthContext";

import { useNavigate } from "react-router-dom";

import moment from "moment";
import LogoLoading from "../../../Loading_component/LogoLoading";
import SupplierSiteInterface from "../../../registration/interface/SupplierSiteInterface";

import { useSiteApprovalViewContext } from "../../interface/contact/SiteApprovalViewContext";
import SiteListViewForApprovalService from "../../service/site/SiteListViewForApprovalService";

export default function SiteListForApprovalPage() {
  const { setPage, setSiteId, siteLength, setSiteLength } =
    useSiteApprovalViewContext();

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
                        COUNTRY
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        SITE NAME
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        SITE ADDRESS
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        CITY STATE
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        ZIP CODE
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        EMAIL
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        MOBILE NUMBER
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
                        <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                          <div className="w-full overflow-auto custom-scrollbar text-center">
                            {e.CITY_STATE != null ? e.CITY_STATE : "N/A"}
                          </div>
                        </td>
                        <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                          <div className="w-full overflow-auto custom-scrollbar text-center">
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
                            {e.MOBILE_NUMBER != null ? e.MOBILE_NUMBER : "N/A"}
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
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
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

              {/* <div className="overflow-x-auto">
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
                        COUNTRY
                      </th>
                      <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                        SITE NAME
                      </th>
                      <th className="   font-mon  px-6 py-3 text-left text-sm font-medium text-blackColor tracking-wider ">
                        SITE ADDRESS
                      </th>
                      <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                        CITY STATE
                      </th>
                      <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor   items-start  tracking-wider">
                        ZIP CODE
                      </th>
                      <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                        EMAIL
                      </th>
                      <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                        MOBILE NUMBER
                      </th>

                      
                    </tr>
                  </thead>

                 
                  {siteList.map((e, i) => (
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
                          {e.COUNTRY != null ? e.COUNTRY : "N/A"}
                        </div>
                      </td>
                      <td className="  font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor whitespace-normal">
                        <div className=" w-52">
                          {e.ADDRESS_LINE1 != null ? e.ADDRESS_LINE1 : "N/A"}
                        </div>
                      </td>

                      <td className=" font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  ">
                        <div className=" w-52">
                          {e.ADDRESS_LINE2 != null ? e.ADDRESS_LINE2 : "N/A"}
                        </div>
                      </td>
                      <td className=" font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                        {
                          <div className=" w-52">
                            {e.CITY_STATE != null ? e.CITY_STATE : "N/A"}
                          </div>
                        }
                      </td>
                      <td className=" font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                        {e.ZIP_CODE != null ? e.ZIP_CODE : "N/A"}
                      </td>
                      <td className=" font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                        {
                          <div className=" w-52">
                            {e.EMAIL != null ? e.EMAIL : "N/A"}
                          </div>
                        }
                      </td>
                      <td className=" font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                        {
                          <div className=" w-52">
                            {e.MOBILE_NUMBER != null ? e.MOBILE_NUMBER : "N/A"}
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
      }
    </div>
  );
}
