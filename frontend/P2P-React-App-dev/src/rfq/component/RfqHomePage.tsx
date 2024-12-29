import React from "react";
import { useRfqPageContext } from "../context/RfqPageContext";
import RfqListPage from "./RfqListPage";
import RfqItemListPage from "./RfqItemListPage";
import CreateCsPage from "../../cs/component/CreateCsPage";
import CsPreviewPage from "../../cs/component/CsPreviewPage";
import RfqDetailsPage from "./RfqDetailsPage";

export default function RfqHomePage() {
  const { rfqPageNo } = useRfqPageContext();
  return (
    <div>
      {(() => {
        switch (rfqPageNo) {
          // case 'home':
          //   return <Home/>
          // case 1:
          //     return <RfqListPage />
          //RfqItemListPage
          //CreateCsPage
          // CsPreviewPage
          case 1:
            return <RfqListPage />; //RfqListPage
          case 2:
            return <RfqDetailsPage />;
          case 3:
            return <CreateCsPage />;
          case 4:
            return <CsPreviewPage />;

          default:
            return null;
        }
      })()}
    </div>
  );
}
