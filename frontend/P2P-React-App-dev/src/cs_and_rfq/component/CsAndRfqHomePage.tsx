import React, { useState } from "react";
import useCsAndRfqStore from "../store/csAndRfqStore";
import CsHomePage from "../../cs/component/CsHomePage";
import RfqHomePage from "../../rfq/component/RfqHomePage";
import { RfqPageProvider } from "../../rfq/context/RfqPageContext";

export default function CsAndRfqHomePage() {
  const { csAndRfqpageNo } = useCsAndRfqStore();
  const [isCsPage, setIsCsPage] = useState(true);
  const handlePageChange = () => {
    setIsCsPage(!isCsPage);
  };
  return (
    // <div>
    //   {(() => {
    //     switch (csAndRfqpageNo) {
    //       case 1:
    //         return <CsHomePage />; //RfqListPage
    //       case 2:
    //         return (
    // <RfqPageProvider>
    //   <RfqHomePage />;
    // </RfqPageProvider>
    //         );

    //       default:
    //         return null;
    //     }
    //   })()}
    // </div>

    <div>
      <div className=" my-4 w-full flex space-x-4 items-center px-8">
        <button
          className={`px-4 h-10 flex justify-center flex-row items-center space-x-2 bg-blue-50 rounded-t-md ${
            isCsPage ? "border-b-[1px] border-blackishColor bg-blue-100" : ""
          }`}
          onClick={() => {
            handlePageChange();
          }}
        >
          <p className=" text-sm font-mon text-blackColor">CS List</p>
        </button>
        <button
          className={`px-4 h-10 flex justify-center flex-row items-center space-x-2 bg-orange-50 rounded-t-md ${
            !isCsPage ? "border-b-[1px] border-blackishColor bg-blue-100" : ""
          }`}
          onClick={() => {
            handlePageChange();
          }}
        >
          <p className=" text-sm font-mon text-blackColor">RFQ List</p>
        </button>
      </div>
      {isCsPage ? (
        <CsHomePage />
      ) : (
        <RfqPageProvider>
          <RfqHomePage />;
        </RfqPageProvider>
      )}
    </div>
  );
}
