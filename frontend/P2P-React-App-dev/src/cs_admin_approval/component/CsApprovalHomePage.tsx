import React from "react";
import { useCsApprovalContext } from "../context/CsApprovalContext";
import CsListPage from "./CsListPage";
import CsDetailsPageForApprover from "./CsDetailsPageForApprover";
import BuyerCsListPage from "../../cs/component/BuyerCsListPage";
import useCsApprovalStore from "../store/csApprovalStore";
import CsTermForApprovalPage from "./CsTermForApprovalPage";
import ApproveCsPage from "./ApproveCsPage";
import ApproveCsPreviewPage from "./ApproveCsPreviewPage";

export default function CsApprovalHomePage() {
  const { csApprovalPageNo } = useCsApprovalStore();
  return (
    <div>
      {(() => {
        switch (csApprovalPageNo) {
          // case 'home':
          //   return <Home/>
          case 1:
            return <CsListPage />;
          case 2:
            return <CsTermForApprovalPage />;
          case 3:
            return <ApproveCsPage />;
          case 4:
            return <ApproveCsPreviewPage />;

          default:
            return null;
        }
      })()}
    </div>
  );
}
