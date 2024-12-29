import React, { useEffect, useState } from "react";
import InvitationPage from "./InvitationPage";
import ViewedInvitationPage from "./ViewedInvitationPage";
import InputLebel from "../../common_component/InputLebel";
import NavigationPan from "../../common_component/NavigationPan";
import InviteExistingSupplierPage from "./InviteExistingSupplierPage";
const pan = ["Home", "Invite Supplier"];
export default function InviteHomePage() {
  const [btn, setBtn] = useState<boolean>(false);
  const [btn2, setBtn2] = useState<boolean>(false);
  const [isInviteModal, setIsInviteModal] = useState<boolean>(false);
  const [showInviteExistingSupplier, setShowInviteExistingSupplier] =
    useState<boolean>(false);
  const [showInviteExistingSupplier2, setShowInviteExistingSupplier2] =
    useState<boolean>(false);


  // Effect to handle body scroll lock
  useEffect(() => {
    if (isInviteModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto"; // cleanup on unmount
    };
  }, [isInviteModal]);

  const handleBtnChange = () => {
    setBtn(!btn);
    if (btn2) {
      setBtn2(false);
    }
  };
  const handleBtn2Change = () => { };
  return (
    <div className=" m-8">
      <div className="flex items-center justify-between">
        <InputLebel titleText={"Invite Supplier"} />
        {/* <NavigationPan list={pan} /> */}

        <button
          onClick={() => {
            setIsInviteModal(true);
          }}
          className={`w-40 h-8 flex justify-center items-center space-x-2 text-whiteColor rounded-md font-mon font-medium text-sm  bg-indigo-500`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>

          <p>{"Invite A Supplier"}</p>
        </button>
      </div>

      <div className="h-3 my-4"></div>

      <div
        className="rounded-xl"
        style={{
          boxShadow:
            "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -2px",
        }}
      >
        <div className="w-full">
          <div className="w-full flex justify-start items-center my-4 space-x-6 border-b-[.5px] border-gray-100">
            {/* Invitation History Button */}
            <button
              onClick={() => {
                console.log("Invitation History button clicked");
                setShowInviteExistingSupplier(false);
                setShowInviteExistingSupplier2(false); // Ensure other states are reset
              }}
              className={`w-36 h-11 flex justify-center items-center font-mon font-semibold text-sm ${!showInviteExistingSupplier && !showInviteExistingSupplier2
                  ? "text-gray-700 border-b-2 border-midGreen transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)"
                  : "text-gray-500"
                }`}
            >
              {"Invitation History"}
            </button>

            {/* Invite Existing Supplier Button */}
            <button
              onClick={() => {
                console.log("Invite Existing Supplier button clicked");
                setShowInviteExistingSupplier(true);
                setShowInviteExistingSupplier2(false); // Ensure other states are reset
              }}
              className={`w-44 h-11 flex justify-center items-center font-mon font-semibold text-sm ${showInviteExistingSupplier && !showInviteExistingSupplier2
                  ? "text-gray-700 border-b-2 border-[#5AB2FF] transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)"
                  : "text-gray-500"
                }`}
            >
              {"Invite Existing Supplier"}
            </button>

            {/* Registration Report Button */}
            <button
              onClick={() => {
                console.log("Registration Report button clicked");
                setShowInviteExistingSupplier(false); // Ensure other states are reset
                setShowInviteExistingSupplier2(true);
              }}
              className={`w-44 h-11 flex justify-center items-center font-mon font-semibold text-sm ${showInviteExistingSupplier2
                  ? "text-gray-700 border-b-2 border-[#5AB2FF] transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)"
                  : "text-gray-500"
                }`}
            >
              {"Registration Report"}
            </button>
          </div>

          {/* Content Rendering */}
          <div className="mt-6">
            {showInviteExistingSupplier2 && (
              <div>{"Hello, this is the Registration Report!"}</div>
            )}

            {!showInviteExistingSupplier2 && (
              <div className="w-full">
                {showInviteExistingSupplier ? (
                  <InviteExistingSupplierPage />
                ) : (
                  <ViewedInvitationPage />
                )}
              </div>
            )}
          </div>

          <div className="h-5"></div>
        </div>

      </div>

      {isInviteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[430px] p-6 relative h-auto max-h-[80%]">
            <button
              onClick={() => setIsInviteModal(false)}
              className="absolute top-[1px] right-3 text-gray-700 text-3xl"
            >
              &times;
            </button>

            <InvitationPage />
          </div>
        </div>
      )}
      {/* new code end */}
    </div>
  );
}
