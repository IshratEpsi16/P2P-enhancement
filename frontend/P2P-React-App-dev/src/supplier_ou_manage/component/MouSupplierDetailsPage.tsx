import React, { useEffect, useState } from "react";
import PageTitle from "../../common_component/PageTitle";
import CommonButton from "../../common_component/CommonButton";
import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";
import ErrorToast, { showErrorToast } from "../../Alerts_Component/ErrorToast";
import { isTokenValid } from "../../utils/methods/TokenValidityCheck";
import { useAuth } from "../../login_both/context/AuthContext";

import { useNavigate } from "react-router-dom";

import moment from "moment";
import LogoLoading from "../../Loading_component/LogoLoading";
import SupplierSiteInterface from "../../registration/interface/SupplierSiteInterface";

import { useMouPageContext } from "../context/MouPageContext";
import { OrganizationInterface } from "../../role_access/interface/OrganizationInterface";
import SiteOrgViewForApprovalService from "../../manage_supplier/service/site/SiteOrgViewForApprovalService";
import NavigationPan from "../../common_component/NavigationPan";
import OuManageInterface from "../interface/OuManageInterface";
import OuManageHistoryService from "../service/OuManageHistorySevice";

import { Modal, Button } from "keep-react";
import { CloudArrowUp } from "phosphor-react";
import { Textarea } from "keep-react";
import MouAddRemoveService from "../service/MouAddRemoveOuService";
import AddOrgToSiteService from "../../registration/service/site_creation/AddOrgToSiteService";
import MouAddOrgToSiteService from "../service/MouAddOrgToSiteService";
import isoToDateTime from "../../utils/methods/isoToDateTime";

const pan = ["Home", "Suppliers", "Site List", "Organization"];

export default function MouSupplierDetailsPage() {
  const { token, supplierId } = useAuth();
  const navigate = useNavigate();
  const { setPage, siteId } = useMouPageContext();

  const [organizationList, setOrganizationList] = useState<
    OrganizationInterface[] | []
  >([]);

  const [selectedOrgList, setSelectedOrgList] = useState<
    OrganizationInterface[]
  >([]);
  const [selectedOrgList2, setSelectedOrgList2] = useState<
    OrganizationInterface[]
  >([]);

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
      // getExistingalist();
      getOrganization();
      getHistory();
    }
  }, []);
  //token validation

  //history

  const [historyList, setHistoryList] = useState<OuManageInterface[] | []>([]);

  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false);

  const getHistory = async () => {
    try {
      setIsHistoryLoading(true);
      const result = await OuManageHistoryService(token!);
      if (result.data.status === 200) {
        setHistoryList(result.data.data);
        setIsHistoryLoading(false);
      } else {
        setIsHistoryLoading(false);
        showSuccessToast(result.data.message);
      }
    } catch (error) {
      setIsHistoryLoading(false);
      showErrorToast("Sothing went wrong ");
    }
  };

  //get org list

  const getOrganization = async () => {
    const result = await SiteOrgViewForApprovalService(
      token!,
      supplierId!,
      siteId!
    );
    if (result.data.status === 200) {
      setOrganizationList(result.data.data);
      // Explicitly provide the type for 'org' using the OrganizationInterface SiteOrgViewForApprovalService
      // const updatedSelectedOrgList = result.data.data.filter((org: OrganizationInterface) => org.IS_ASSOCIATED === 1);
      // setPreSelectedOrgList(updatedSelectedOrgList);
    }
  };

  //org grant revoke

  // org grant revoke
  const handleGrantRevokeOrganization = async (orgIndex: number) => {
    setOrgIndex(orgIndex);
    onClickNote();

    setActionCode(organizationList[orgIndex].IS_ASSOCIATED === 1 ? 0 : 1);
    setOrgId(organizationList[orgIndex].ORGANIZATION_ID);
  };

  const addOrgToSelectedSitelist = (org: OrganizationInterface) => {
    selectedOrgList2.push(org);
  };

  const back = () => {
    setPage(2);
  };

  //approve modal

  const [noteModal, setNoteModal] = useState<boolean>(false);
  const onClickNote = () => {
    // setActionCode(1);
    setNoteModal(!noteModal);
    if (noteModal === false) {
      setActionCode(null);
      setOrgId(null);
    }
  };

  const [noteValue, setNoteValue] = useState<string>("");

  // Event handler to update the state when the textarea value changes
  const handleApproveValueChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const inputValue = event.target.value;
    if (inputValue.length <= 150) {
      setNoteValue(inputValue);
    } else {
      setNoteValue(inputValue.slice(0, 150));
    }
  };

  //manage org functionality

  const [orgSiteId, setOrgSiteId] = useState<number | null>(null);
  const [orgid, setOrgId] = useState<number | null>(null);
  const [actionCode, setActionCode] = useState<number | null>(null);
  const [orgIndex, setOrgIndex] = useState<number | null>(null);

  const manageOrg = async () => {
    console.log(orgIndex);

    try {
      const result2 = await MouAddOrgToSiteService(
        token!,
        supplierId!,
        siteId,
        organizationList[orgIndex!]
      );
      console.log(result2.data);

      try {
        const result = await MouAddRemoveService(
          token!,
          siteId!,
          organizationList[orgIndex!].ORGANIZATION_ID,
          organizationList[orgIndex!].IS_ASSOCIATED === 1 ? 0 : 1,
          noteValue
        );

        if (result2.data.status === 200) {
          if (result.data.status === 200) {
            setNoteModal(false);
            const updatedOrganizationList = [...organizationList];
            updatedOrganizationList[orgIndex!].IS_ASSOCIATED =
              updatedOrganizationList[orgIndex!].IS_ASSOCIATED === 1 ? 0 : 1;
            setOrganizationList(updatedOrganizationList);
            const updatedSelectedOrgList = updatedOrganizationList.filter(
              (org) => org.IS_ASSOCIATED === 1
            );

            // Remove elements from selectedOrgList that are also in preSelectedOrgList
            // const filteredSelectedOrgList = updatedSelectedOrgList.filter(org =>
            //     !preSelectedOrgList.some(preSelectedOrg => preSelectedOrg.ORGANIZATION_ID === org.ORGANIZATION_ID)
            // );

            setSelectedOrgList(updatedSelectedOrgList);
            // setPreSelectedOrgList(updatedSelectedOrgList);
            showSuccessToast(result.data.message);
            setNoteValue("");
            getOrganization();
            getHistory();
          } else {
            setNoteModal(false);
            showErrorToast(result.data.message);
          }
        }
      } catch (error) {
        showErrorToast("something went wrong");
      }
    } catch (error) {
      setNoteModal(false);
      showErrorToast("somthing went wrong");
    }
  };

  return (
    <div className=" m-8 bg-whiteColor">
      <SuccessToast />
      <div className=" w-full flex justify-between items-center mb-6">
        <div>
          <PageTitle titleText={`Site's Organizations`} />
          {/* <NavigationPan list={pan} /> */}
        </div>
        <CommonButton
          titleText="Back"
          width="w-24"
          color="bg-midGreen"
          onClick={back}
        />
      </div>
      <div className=" h-10"></div>
      {isHistoryLoading ? (
        <div className=" w-full flex justify-center items-center">
          <LogoLoading />
        </div>
      ) : (
        <>
          <div className=" grid grid-cols-3 gap-12 items-center">
            {organizationList.map((e, i) => (
              <div className=" flex flex-row space-x-2 items-center w-48 px-1   ">
                <button
                  onClick={() => {
                    handleGrantRevokeOrganization(i);
                    addOrgToSelectedSitelist(e);
                  }}
                  className={`w-4 h-4 rounded-md
                                            ${
                                              e.IS_ASSOCIATED === 1
                                                ? "bg-midGreen border-none"
                                                : " border-[0.5px] border-borderColor bg-whiteColor"
                                            }
                                             flex justify-center items-center   `}
                >
                  {
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-3 h-3 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  }
                </button>
                <p className=" text-blackColor text-sm font-mon font-medium text-start flex-1">
                  {e.NAME}({e.SHORT_CODE})
                </p>
              </div>
            ))}
          </div>

          <div className=" h-6"></div>
          <p className=" largeText">History</p>
          <div className=" h-4"></div>

          {historyList.length === 0 ? (
            <div className=" w-full flex justify-center items-center">
              <p className=" largeText">No History Found</p>
            </div>
          ) : (
            <div className="overflow-auto max-h-[400px] rounded-lg shadow-lg custom-scrollbar">
              <table className="min-w-full divide-y divide-gray-200 rounded-lg">
                <thead className="bg-[#CAF4FF] sticky top-0 ">
                  <tr>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      SL
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      SUPPLIER NAME
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      SITE NAME
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      ORGANIZATION ID
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      SHORT CODE
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      ORGANIZATION NAME
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      ACTION
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      NOTE
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      CREATED BY ID
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      CREATED BY NAME
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                      CREATION DATE
                    </th>
                  </tr>
                </thead>

                {historyList.map((e, i) => (
                  <tbody key={i} className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {i + 1}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar ">
                        <div className="w-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                          {e.SUPPLIER_NAME != null ? e.SUPPLIER_NAME : "N/A"}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {e.SITE_NAME != null ? e.SITE_NAME : "N/A"}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {e.ORGANIZATION_ID != null
                            ? e.ORGANIZATION_ID
                            : "N/A"}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {e.SHORT_CODE != null ? e.SHORT_CODE : "N/A"}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {e.NAME != null ? e.NAME : "N/A"}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar ">
                        <div className="w-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                          {e.ACTION_CODE != null
                            ? e.ACTION_CODE === 1
                              ? "ADDED"
                              : "DELETED"
                            : "N/A"}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {e.NOTE != null ? e.NOTE : "N/A"}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {e.CREATED_BY != null ? e.CREATED_BY : "N/A"}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {e.CREATED_BY_NAME != null
                            ? e.CREATED_BY_NAME
                            : "N/A"}
                        </div>
                      </td>
                      <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                        <div className="w-full overflow-auto custom-scrollbar text-center">
                          {e.CREATION_DATE != null
                            ? isoToDateTime(e.CREATION_DATE)
                            : "N/A"}
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
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* <div className="overflow-x-auto">
            <table
              className="min-w-full divide-y divide-borderColor border-[0.2px] border-borderColor rounded-md"
              style={{ tableLayout: "fixed" }}
            >
              <thead className="sticky top-0 bg-[#F4F6F8] h-14">
                <tr>
                  <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap ">
                    SL
                  </th>

                  <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                    SUPPLIER NAME
                  </th>

                  <th className="   font-mon  px-6 py-3 text-left text-sm font-medium text-blackColor tracking-wider ">
                    SITE NAME
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                    ORGANIZATION ID
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor   items-start  tracking-wider">
                    SHORT CODE
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                    ORGANIZATION NAME
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                    ACTION
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                    NOTE
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                    CREATED BY ID
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                    CREATED BY NAME
                  </th>
                  <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                    CREATION DATE
                  </th>
                </tr>
              </thead>

              {historyList.map((e, i) => (
                <tbody
                  className="bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]"
                  key={i}
                >
                  <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor whitespace-normal ">
                    {i + 1}
                  </td>

                  <td className="  font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor whitespace-normal">
                    <div className=" w-52">
                      {e.SUPPLIER_NAME != null ? e.SUPPLIER_NAME : "N/A"}
                    </div>
                  </td>

                  <td className=" font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {
                      <div className=" w-52">
                        {e.SITE_NAME != null ? e.SITE_NAME : "N/A"}
                      </div>
                    }
                  </td>
                  <td className=" font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {e.ORGANIZATION_ID != null ? e.ORGANIZATION_ID : "N/A"}
                  </td>
                  <td className=" font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {
                      <div className=" w-52">
                        {e.SHORT_CODE != null ? e.SHORT_CODE : "N/A"}
                      </div>
                    }
                  </td>
                  <td className=" font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {
                      <div className=" w-52">
                        {e.NAME != null ? e.NAME : "N/A"}
                      </div>
                    }
                  </td>
                  <td className=" font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {
                      <div className=" w-52">
                        {e.ACTION_CODE != null
                          ? e.ACTION_CODE === 1
                            ? "ADDED"
                            : "DELETED"
                          : "N/A"}
                      </div>
                    }
                  </td>
                  <td className=" font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {
                      <div className=" w-52">
                        {e.NOTE != null ? e.NOTE : "N/A"}
                      </div>
                    }
                  </td>
                  <td className=" font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {
                      <div className=" w-52">
                        {e.CREATED_BY != null ? e.CREATED_BY : "N/A"}
                      </div>
                    }
                  </td>
                  <td className=" font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {
                      <div className=" w-52">
                        {e.CREATED_BY_NAME != null ? e.CREATED_BY_NAME : "N/A"}
                      </div>
                    }
                  </td>
                  <td className=" font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                    {
                      <div className=" w-52">
                        {e.CREATION_DATE != null
                          ? isoToDateTime(e.CREATION_DATE)
                          : "N/A"}
                      </div>
                    }
                  </td>
                </tbody>
              ))}
            </table>
          </div> */}
        </>
      )}
      {/* approve modal */}
      <Modal
        icon={<CloudArrowUp size={28} color="#1B4DFF" />}
        size="md"
        show={noteModal}
        onClose={onClickNote}
      >
        <Modal.Header>Give A Note</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <Textarea
              id="comment"
              placeholder="Leave a comment..."
              withBg={true}
              color="gray"
              border={true}
              rows={4}
              value={noteValue}
              onChange={handleApproveValueChange}
            />
            <div className=" w-full flex justify-end smallText">
              {noteValue.length}/150
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="outlineGray"
            className=" h-8 font-mon"
            onClick={onClickNote}
          >
            Cancel
          </Button>
          <Button
            type=""
            className="h-8 bg-midGreen text-white font-mon"
            onClick={manageOrg}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      {/* approve modal */}
    </div>
  );
}
