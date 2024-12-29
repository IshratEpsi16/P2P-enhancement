import React from "react";
import useCsCreationStore from "../store/CsCreationStore";
import SavedCsListPage from "./SavedCsListPage";
import CsDetailsPage from "./CsDetailsPage";
import SavedCsPreviewPage from "./SavedCsPreviewPage";
import SavedItemInCsPage from "./SavedItemInCsPage";
import RfqListPage from "../../rfq/component/RfqListPage";
import PoListInCsPage from "./PoListInCsPage";

export default function CsHomePage() {
  const { csPageNo } = useCsCreationStore();
  return (
    <div>
      {(() => {
        switch (csPageNo) {
          case 1:
            return <SavedCsListPage />; //RfqListPage
          case 2:
            return <SavedItemInCsPage />; //RfqListPage
          case 3:
            return <CsDetailsPage />;
          case 4:
            return <SavedCsPreviewPage />;
          case 5:
            return <PoListInCsPage />;

          default:
            return null;
        }
      })()}
    </div>
  );
}
