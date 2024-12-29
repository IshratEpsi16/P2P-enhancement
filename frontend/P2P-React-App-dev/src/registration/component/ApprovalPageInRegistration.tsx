import React, { useState, useEffect } from "react";
import HierarchyInterface from "../interface/hierarchy/HierarchyInterface";
import { useAuth } from "../../login_both/context/AuthContext";
import HierachyListByModuleService from "../service/approve_hierarchy/HierarchyListByModuleService";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import SuccessToast from "../../Alerts_Component/SuccessToast";
import LogoLoading from "../../Loading_component/LogoLoading";
import NotFoundPage from "../../not_found/component/NotFoundPage";
import isoToDateTime from "../../utils/methods/isoToDateTime";

export default function ApprovalPageInRegistration() {
  //hierarchy
  const [hierarchLoading, setHierarchyLoading] = useState<boolean>(false);
  const [hierarchyUserProfilePicturePath, setHierarchyUserProfilePicturePath] =
    useState<string>("");
  const [hierarchyList, setHierarchyList] = useState<HierarchyInterface[] | []>(
    []
  );

  const { regToken, submissionStatus, isRegCompelte, setSubmissionStatus } =
    useAuth();

  useEffect(() => {
    getApproverHierachy();
  }, []);

  const getApproverHierachy = async () => {
    const decodedToken = decodeJWT(regToken!);
    console.log(regToken);

    // Extract USER_ID from the decoded payload
    const userId = decodedToken?.decodedPayload?.USER_ID;
    try {
      setHierarchyLoading(true);
      const result = await HierachyListByModuleService(
        regToken!,
        userId,
        isRegCompelte === "1" ? "Profile Update" : "Supplier Approval"
      );
      console.log(result.data);

      if (result.data.status === 200) {
        console.log("resu", result.data);
        setHierarchyLoading(false);
        setHierarchyUserProfilePicturePath(result.data.profile_pic);
        // setHierarchyList(result.data.data);

        // Create the initiator status object
        let updatedHierarchyList = result.data.data;

        // Check if INITIATOR_STATUS exists and has a value
        if (
          decodedToken?.decodedPayload?.INITIATOR_STATUS &&
          Object.keys(decodedToken.decodedPayload.INITIATOR_STATUS).length > 0
        ) {
          const initiatorStatus = {
            STAGE_LEVEL: 0,
            APPROVER_FULL_NAME:
              decodedToken.decodedPayload.INITIATOR_STATUS.FULL_NAME,
            ACTION_CODE:
              decodedToken.decodedPayload.INITIATOR_STATUS.ACTION_CODE,
            ACTION_DATE:
              decodedToken.decodedPayload.INITIATOR_STATUS.ACTION_DATE,
            ACTION_NOTE: decodedToken.decodedPayload.INITIATOR_STATUS.NOTE,
            APPROVER_ID: 0,
            APPROVER_USER_NAME:
              decodedToken.decodedPayload.INITIATOR_STATUS.USER_NAME,
            EMAIL_ADDRESS: "",
            IS_MUST_APPROVE: 1,
            PROPIC_FILE_NAME: "",
            STAGE_ID: 0,
            STAGE_SEQ: 0,
          };
          updatedHierarchyList = [initiatorStatus, ...updatedHierarchyList];
        }

        setHierarchyList(updatedHierarchyList);
      } else {
        setHierarchyLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setHierarchyLoading(false);
      showErrorToast("Something went wrong");
    }
  };

  const decodeJWT = (token: string) => {
    try {
      // Split the token into header, payload, and signature (assuming they are separated by dots)
      const [encodedHeader, encodedPayload] = token.split(".");

      // Function to convert Base64Url to Base64 and add padding if necessary
      const base64UrlToBase64 = (base64Url: string) => {
        let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        switch (base64.length % 4) {
          case 2:
            base64 += "==";
            break;
          case 3:
            base64 += "=";
            break;
          default:
            break;
        }
        return base64;
      };

      // Decode base64-encoded header and payload
      const decodedHeader = JSON.parse(
        window.atob(base64UrlToBase64(encodedHeader))
      );
      const decodedPayload = JSON.parse(
        window.atob(base64UrlToBase64(encodedPayload))
      );

      // Log the decoded header and payload
      console.log("Decoded Header:", decodedHeader);
      console.log("Decoded Payload:", decodedPayload);

      // Make sure that the decoded payload has the expected structure
      if (decodedPayload && decodedPayload.hasOwnProperty("USER_ID")) {
        const userId = decodedPayload.USER_ID;
        const isNewUser = decodedPayload.IS_NEW_USER;
        const approval = decodedPayload.APPROVAL_STATUS;
        const submissionStatus = decodedPayload.SUBMISSION_STATUS;
        const isRegComplete = decodedPayload.IS_REG_COMPLETE;
        return {
          decodedHeader,
          decodedPayload,
          userId,
          isNewUser,
          approval,
          submissionStatus,
          isRegComplete,
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

  // const decodeJWT = (token: string) => {
  //   try {
  //     // Split the token into header, payload, and signature (assuming they are separated by dots)
  //     const [encodedHeader, encodedPayload] = token.split(".");

  //     // Decode base64-encoded header and payload
  //     const decodedHeader = JSON.parse(window.atob(encodedHeader));
  //     const decodedPayload = JSON.parse(window.atob(encodedPayload));

  //     // Log the decoded header and payload
  //     console.log("Decoded Header:", decodedHeader);
  //     console.log("Decoded Payload:", decodedPayload);

  //     // Make sure that the decoded payload has the expected structure
  //     if (decodedPayload && decodedPayload.hasOwnProperty("USER_ID")) {
  //       const userId = decodedPayload.USER_ID;
  //       const isNewUser = decodedPayload.IS_NEW_USER;
  //       const approval = decodedPayload.APPROVAL_STATUS;
  //       const submissionStatus = decodedPayload.SUBMISSION_STATUS;
  //       const isRegComplete = decodedPayload.IS_REG_COMPLETE;
  //       // console.log(`userId: ${userId}`);
  //       return {
  //         decodedHeader,
  //         decodedPayload,
  //         userId,
  //         isNewUser,
  //         approval,
  //         submissionStatus,
  //         isRegComplete,
  //       };
  //     } else {
  //       console.error(
  //         "Error: Decoded payload does not have the expected structure."
  //       );
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error("Error decoding JWT:", error);
  //     return null;
  //   }
  // };
  return (
    <div className=" m-8 bg-white">
      <SuccessToast />
      {hierarchLoading ? (
        <div className=" w-full h-screen flex justify-center items-center">
          <LogoLoading />
        </div>
      ) : !hierarchLoading && hierarchyList.length === 0 ? (
        <NotFoundPage />
      ) : (
        <div className="w-full  flex justify-center items-center  ring-1 ring-borderColor bg-gray-50">
          <table className="w-full  px-16  ">
            <thead className="   ">
              <tr className=" w-full h-14 bg-lightGreen rounded-t-md">
                <th className="mediumText ">Sequence</th>
                <th className="mediumText ">Perfomrmed By</th>
                <th className="mediumText ">Date</th>
                <th className="mediumText ">Action</th>
                <th className="mediumText ">Remarks</th>
              </tr>
            </thead>

            {hierarchyList.map((item, index) => (
              <tbody>
                <tr
                  key={item.APPROVER_ID}
                  className={`text-center h-14 ${
                    index !== 0 ? "border-t border-borderColor h-[0.1px] " : ""
                  }`}
                >
                  <td className="smallText h-14">{item.STAGE_LEVEL + 1}</td>
                  <td className="smallText h-14">{item.APPROVER_FULL_NAME}</td>
                  <td className="smallText h-14">
                    {item.ACTION_DATE === "" || item.ACTION_DATE === "--"
                      ? "---"
                      : isoToDateTime(item.ACTION_DATE)}
                  </td>
                  <td className="font-mon text-sm   font-semibold h-14">
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
                  <td className="smallText h-14">
                    {item.ACTION_NOTE !== "N/A" ? item.ACTION_NOTE : "N/A"}
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      )}
    </div>
  );
}
