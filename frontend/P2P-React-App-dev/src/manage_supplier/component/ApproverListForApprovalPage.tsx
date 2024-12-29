import React, { useState, useEffect } from "react";
// import HierarchyInterface from "../interface/hierarchy/HierarchyInterface";
import HierarchyInterface from "../../registration/interface/hierarchy/HierarchyInterface";
import { useAuth } from "../../login_both/context/AuthContext";
// import HierachyListByModuleService from "../service/approve_hierarchy/HierarchyListByModuleService";
import HierachyListByModuleService from "../../registration/service/approve_hierarchy/HierarchyListByModuleService";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import SuccessToast from "../../Alerts_Component/SuccessToast";
import LogoLoading from "../../Loading_component/LogoLoading";
import NotFoundPage from "../../not_found/component/NotFoundPage";
import isoToDateTime from "../../utils/methods/isoToDateTime";
import ProfileNewInfoUpdateHierarchyService from "../../manage_supplier_profile_update/service/ProfileNewInfoUpdateHierarchyService";
import useProfileUpdateStore from "../../manage_supplier_profile_update/store/profileUpdateStore";
import { MyInitiatorInterface } from "../../my_info/interface/MyInfoInterface";
import ProfileUpdateHierarchyService from "../../manage_supplier_profile_update/service/ProfileUpdateHierarchyService";
import userRoleStore from "../../role_access/store/userRoleStore";

export default function ApproverListForApprovalPage() {
  //hierarchy
  const [hierarchLoading, setHierarchyLoading] = useState<boolean>(false);
  const [hierarchNewInfoLoading, setHierarchyNewInfoLoading] =
    useState<boolean>(false);
  const [hierarchyUserProfilePicturePath, setHierarchyUserProfilePicturePath] =
    useState<string>("");
  const [hierarchyList, setHierarchyList] = useState<HierarchyInterface[] | []>(
    []
  );
  const [loginInitiatorStatus, setLoginInitiatorStatus] = useState<
    MyInitiatorInterface[] | []
  >([]);
  const [hierarchyNewInfoList, setHierarchyNewInfoList] = useState<
    HierarchyInterface[] | []
  >([]);

  const [activeTab, setActiveTab] = useState<string>("existing");

  const [profileUid, setProfileUid] = useState<number | null>(null);

  const { token, submissionStatus, isRegCompelte, setSubmissionStatus } =
    useAuth();

  // store
  const { profileUidInStore, profileNewInfoUidInStore, initiatorStatus } =
    useProfileUpdateStore();

  useEffect(() => {
    getApproverHierachy();
    console.log("newInfo: ", profileNewInfoUidInStore);
    console.log("init: ", initiatorStatus);
    // if(profileNewInfoUidInStore) {
    console.log("new info call");
    getApproveHierarchyNewInfo();
    // }
    console.log("store: ", profileUidInStore);
    console.log("newInfo: ", profileNewInfoUidInStore);
  }, []);

  const getApproverHierachy = async () => {
    const decodedToken = decodeJWT(token!);
    console.log("token: ", token);
    console.log("token: ", loginInitiatorStatus);

    // Extract USER_ID from the decoded payload
    const userId = decodedToken?.decodedPayload?.USER_ID;
    const isProfileId = decodedToken?.decodedPayload?.PROFILE_UPDATE_UID;

    console.log("proId: ", decodedToken?.decodedPayload?.PROFILE_UPDATE_UID);

    try {
      setHierarchyLoading(true);
      const result = await ProfileUpdateHierarchyService(
        token!,
        userId,
        "Profile Update",
        selectedUserRole?.PROFILE_UPDATE_UID!
      );
      console.log("ex", result.data);

      if (result.data.status === 200) {
        setHierarchyLoading(false);
        setHierarchyUserProfilePicturePath(result.data.profile_pic);
        // Create the initiator status object
        // let updatedHierarchyList = result.data.data;

        // // Check if INITIATOR_STATUS exists and has a value
        // if (
        //   decodedToken?.decodedPayload?.INITIATOR_STATUS &&
        //   Object.keys(decodedToken.decodedPayload.INITIATOR_STATUS).length > 0
        // ) {
        //   const initiatorStatus = {
        //     STAGE_LEVEL: 0,
        //     APPROVER_FULL_NAME:
        //       decodedToken.decodedPayload.INITIATOR_STATUS.FULL_NAME,
        //     ACTION_CODE:
        //       decodedToken.decodedPayload.INITIATOR_STATUS.ACTION_CODE,
        //     ACTION_DATE:
        //       decodedToken.decodedPayload.INITIATOR_STATUS.ACTION_DATE,
        //     ACTION_NOTE: decodedToken.decodedPayload.INITIATOR_STATUS.NOTE,
        //     APPROVER_ID: 0,
        //     APPROVER_USER_NAME:
        //       decodedToken.decodedPayload.INITIATOR_STATUS.USER_NAME,
        //     EMAIL_ADDRESS: "",
        //     IS_MUST_APPROVE: 1,
        //     PROPIC_FILE_NAME: "",
        //     STAGE_ID: 0,
        //     STAGE_SEQ: 0,
        //   };
        //   updatedHierarchyList = [initiatorStatus, ...updatedHierarchyList];
        // }

        const initiatorHierarchy: HierarchyInterface = {
          STAGE_ID: 0,
          STAGE_LEVEL: 0,
          STAGE_SEQ: 0,
          APPROVER_ID: 0,
          APPROVER_FULL_NAME: selectedUserRole!.INITIATOR_STATUS.FULL_NAME,
          APPROVER_USER_NAME: "",
          PROPIC_FILE_NAME: "",
          IS_MUST_APPROVE: 0,
          EMAIL_ADDRESS: "",
          ACTION_CODE:
            selectedUserRole!.INITIATOR_STATUS.ACTION_CODE.toString(),
          ACTION_DATE: selectedUserRole!.INITIATOR_STATUS.ACTION_DATE!,
          ACTION_NOTE: selectedUserRole!.INITIATOR_STATUS.NOTE!,
        };

        const updatedHierarchyList: HierarchyInterface[] = [
          initiatorHierarchy,
          ...result.data.data,
        ];

        setHierarchyList(updatedHierarchyList);
        console.log("updated: ", updatedHierarchyList);
      } else {
        setHierarchyLoading(false);
        // showErrorToast(result.data.message);
      }
    } catch (error) {
      setHierarchyLoading(false);
      // showErrorToast("Something went wrong");
    }
  };

  const { setSelectedUserRole, selectedUserRole } = userRoleStore();

  const getApproveHierarchyNewInfo = async () => {
    const decodedToken = decodeJWT(token!);
    console.log("token: ", isRegCompelte);
    console.log("new id: ", decodedToken?.decodedPayload?.PROFILE_NEW_INFO_UID);

    // Extract USER_ID from the decoded payload
    const userId = decodedToken?.decodedPayload?.USER_ID;
    const isProfileNewInfoId =
      decodedToken?.decodedPayload?.PROFILE_NEW_INFO_UID;

    try {
      setHierarchyNewInfoLoading(true);
      const result = await ProfileNewInfoUpdateHierarchyService(
        token!,
        userId,
        "Profile Update",
        selectedUserRole?.PROFILE_NEW_INFO_UID!
      );

      console.log("newInfo: ", result.data);
      if (result.data.status === 200) {
        setHierarchyNewInfoLoading(false);
        setHierarchyUserProfilePicturePath(result.data.profile_pic);
        const initiatorHierarchy: HierarchyInterface = {
          STAGE_ID: 0,
          STAGE_LEVEL: 0,
          STAGE_SEQ: 0,
          APPROVER_ID: 0,
          APPROVER_FULL_NAME:
            selectedUserRole!.NEW_INFO_INITIATOR_STATUS.FULL_NAME,
          APPROVER_USER_NAME: "",
          PROPIC_FILE_NAME: "",
          IS_MUST_APPROVE: 0,
          EMAIL_ADDRESS: "",
          ACTION_CODE:
            selectedUserRole!.NEW_INFO_INITIATOR_STATUS.ACTION_CODE.toString(),
          ACTION_DATE: selectedUserRole!.NEW_INFO_INITIATOR_STATUS.ACTION_DATE!,
          ACTION_NOTE: selectedUserRole!.NEW_INFO_INITIATOR_STATUS.NOTE!,
        };

        const updatedHierarchyList: HierarchyInterface[] = [
          initiatorHierarchy,
          ...result.data.data,
        ];
        setHierarchyNewInfoList(updatedHierarchyList);
      } else {
        setHierarchyNewInfoLoading(false);
        // showErrorToast(result.data.message);
      }
    } catch (error) {
      setHierarchyNewInfoLoading(false);
      // showErrorToast("Something went wrong");
    }
  };

  // useEffect(() => {
  //   if (
  //     selectedUserRole &&
  //     selectedUserRole.NEW_INFO_INITIATOR_STATUS &&
  //     hierarchyNewInfoList.length === 0
  //   ) {
  //     const initiatorHierarchy: HierarchyInterface = {
  //       STAGE_ID: 0,
  //       STAGE_LEVEL: 0,
  //       STAGE_SEQ: 0,
  //       APPROVER_ID: 0,
  //       APPROVER_FULL_NAME: selectedUserRole.FULL_NAME,
  //       APPROVER_USER_NAME: "",
  //       PROPIC_FILE_NAME: "",
  //       IS_MUST_APPROVE: 0,
  //       EMAIL_ADDRESS: "",
  //       ACTION_CODE:
  //         selectedUserRole.NEW_INFO_INITIATOR_STATUS.ACTION_CODE.toString(),
  //       ACTION_DATE: selectedUserRole.NEW_INFO_INITIATOR_STATUS.ACTION_DATE!,
  //       ACTION_NOTE: selectedUserRole.NEW_INFO_INITIATOR_STATUS.NOTE!,
  //     };

  //     setHierarchyNewInfoList([initiatorHierarchy, ...hierarchyNewInfoList]);
  //   }
  // }, [hierarchyNewInfoList]); // Trigger only when `selectedUserRole` changes

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === "existing") {
      getApproverHierachy();
    } else {
      getApproveHierarchyNewInfo();
    }
  };

  const decodeJWT = (token: string) => {
    try {
      // Split the token into header, payload, and signature
      const [encodedHeader, encodedPayload] = token.split(".");

      // Function to decode base64url
      const base64urlDecode = (str: string) => {
        // Replace '-' with '+', '_' with '/', and pad the string with '=' to make it base64 compliant
        str = str.replace(/-/g, "+").replace(/_/g, "/");
        while (str.length % 4) {
          str += "=";
        }
        return window.atob(str);
      };

      // Decode base64url-encoded header and payload
      const decodedHeader = JSON.parse(base64urlDecode(encodedHeader));
      const decodedPayload = JSON.parse(base64urlDecode(encodedPayload));

      // Log the decoded header and payload
      console.log("Decoded Header:", decodedHeader);
      console.log("Decoded Payload:", decodedPayload);

      // Ensure the decoded payload has the expected structure
      if (decodedPayload && decodedPayload.hasOwnProperty("USER_ID")) {
        const userId = decodedPayload.USER_ID;
        const isNewUser = decodedPayload.IS_NEW_USER;
        const approval = decodedPayload.APPROVAL_STATUS;
        const submissionStatus = decodedPayload.SUBMISSION_STATUS;
        const isRegComplete = decodedPayload.IS_REG_COMPLETE;
        const buyerId = decodedPayload.BUYER_ID;
        const isWlcSwn = decodedPayload.IS_WLC_MSG_SHOWN;
        const wlcMessage = decodedPayload.WELCOME_MSG;
        const initStatus = decodedPayload.INITIATOR_STATUS;

        setLoginInitiatorStatus(decodedPayload.INITIATOR_STATUS);

        return {
          decodedHeader,
          decodedPayload,
          userId,
          isNewUser,
          approval,
          submissionStatus,
          isRegComplete,
          buyerId,
          isWlcSwn,
          wlcMessage,
          initStatus,
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

  return (
    <div className=" mx-8 bg-white">
      <SuccessToast />

      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 pb-2 font-semibold ${
            activeTab === "existing"
              ? "border-b-2 border-blue-500 text-black"
              : "text-gray-500"
          }`}
          onClick={() => handleTabClick("existing")}
        >
          Existing Information Hierarchy
        </button>
        <button
          className={`px-4 pb-2 font-semibold ${
            activeTab === "new"
              ? "border-b-2 border-blue-500 text-black"
              : "text-gray-500"
          }`}
          onClick={() => handleTabClick("new")}
        >
          New Information Hierarchy
        </button>
      </div>

      {activeTab === "existing" ? (
        hierarchLoading ? (
          <div className=" w-full h-screen flex justify-center items-center">
            <LogoLoading />
          </div>
        ) : !hierarchLoading && hierarchyList.length === 0 ? (
          <NotFoundPage />
        ) : (
          <>
            <div className="w-full  flex justify-center items-center  ring-1 ring-borderColor bg-gray-50">
              <table className="w-full  px-16  ">
                <thead className="   ">
                  <tr className=" w-full h-12 bg-lightGreen rounded-t-md">
                    <th className="font-semibold">Sequence</th>
                    <th className="font-semibold">Performed By</th>
                    <th className="font-semibold">Action</th>

                    {hierarchyList.some((item) => item.ACTION_CODE !== "3") && (
                      <>
                        <th className="font-semibold">Date</th>
                        <th className="font-semibold">Remarks</th>
                      </>
                    )}

                    {/* <th className="mediumText ">Date</th>
                    <th className="mediumText ">Remarks</th> */}
                  </tr>
                </thead>

                {hierarchyList.map((item, index) => (
                  <tbody>
                    <tr
                      key={item.APPROVER_ID}
                      className={`text-center h-12 ${
                        index !== 0
                          ? "border-t border-borderColor h-[0.1px] "
                          : ""
                      }`}
                    >
                      <td className="smallText h-12">{item.STAGE_LEVEL + 1}</td>
                      <td className="smallText h-12">
                        {item.APPROVER_FULL_NAME}
                      </td>

                      <td className="font-mon text-sm   font-semibold h-12">
                        {item.ACTION_CODE === "0" ? (
                          <p className=" text-sm font-mon text-redColor">
                            Rejected
                          </p>
                        ) : item.ACTION_CODE === "1" ? (
                          <p className=" text-sm font-mon text-midGreen">
                            Approved
                          </p>
                        ) : (
                          <p className=" text-sm font-mon  text-yellow-500">
                            Pending
                          </p>
                        )}
                      </td>
                      {item.ACTION_CODE !== "3" && (
                        <>
                          <td className="smallText h-12">
                            {item.ACTION_DATE !== "N/A"
                              ? item.ACTION_DATE
                              : "N/A"}
                          </td>
                          <td className="smallText h-12">
                            {item.ACTION_NOTE !== "N/A"
                              ? item.ACTION_NOTE
                              : "N/A"}
                          </td>
                        </>
                      )}

                      {/* <td className="smallText h-14">
                        {item.ACTION_DATE !== "N/A" ? item.ACTION_DATE : "N/A"}
                      </td>
                      <td className="smallText h-14">
                        {item.ACTION_NOTE !== "N/A" ? item.ACTION_NOTE : "N/A"}
                      </td> */}
                    </tr>
                  </tbody>
                ))}
              </table>
            </div>
          </>
        )
      ) : hierarchNewInfoLoading ? (
        <div className=" w-full h-screen flex justify-center items-center">
          <LogoLoading />
        </div>
      ) : !hierarchNewInfoLoading && hierarchyNewInfoList.length === 0 ? (
        <NotFoundPage />
      ) : (
        <>
          <div className="w-full  flex justify-center items-center  ring-1 ring-borderColor bg-gray-50">
            <table className="w-full  px-16  ">
              <thead className="   ">
                <tr className=" w-full h-12 bg-lightGreen rounded-t-md">
                  <th className=" font-semibold">Sequence</th>
                  <th className=" font-semibold">Performed By</th>
                  <th className=" font-semibold">Action</th>

                  {hierarchyNewInfoList.some(
                    (item) => item.ACTION_CODE !== "3"
                  ) && (
                    <>
                      <th className="font-semibold">Date</th>
                      <th className="font-semibold">Remarks</th>
                    </>
                  )}

                  {/* <th className="mediumText ">Date</th>
                    <th className="mediumText ">Remarks</th> */}
                </tr>
              </thead>

              {hierarchyNewInfoList.map((item, index) => (
                <tbody>
                  <tr
                    key={item.APPROVER_ID}
                    className={`text-center h-12 ${
                      index !== 0
                        ? "border-t border-borderColor h-[0.1px] "
                        : ""
                    }`}
                  >
                    <td className="smallText h-12">{item.STAGE_LEVEL + 1}</td>
                    <td className="smallText h-12">
                      {item.APPROVER_FULL_NAME}
                    </td>

                    <td className="font-mon text-sm   font-semibold h-12">
                      {item.ACTION_CODE === "0" ? (
                        <p className=" text-sm font-mon text-redColor">
                          Rejected
                        </p>
                      ) : item.ACTION_CODE === "1" ? (
                        <p className=" text-sm font-mon text-midGreen">
                          Approved
                        </p>
                      ) : (
                        <p className=" text-sm font-mon  text-yellow-500">
                          Pending
                        </p>
                      )}
                    </td>
                    {item.ACTION_CODE !== "3" && (
                      <>
                        <td className="smallText h-12">
                          {item.ACTION_DATE !== "N/A"
                            ? item.ACTION_DATE
                            : "N/A"}
                        </td>
                        <td className="smallText h-12">
                          {item.ACTION_NOTE !== "N/A"
                            ? item.ACTION_NOTE
                            : "N/A"}
                        </td>
                      </>
                    )}

                    {/* <td className="smallText h-14">
                        {item.ACTION_DATE !== "N/A" ? item.ACTION_DATE : "N/A"}
                      </td>
                      <td className="smallText h-14">
                        {item.ACTION_NOTE !== "N/A" ? item.ACTION_NOTE : "N/A"}
                      </td> */}
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
        </>
      )}
    </div>
  );
}
