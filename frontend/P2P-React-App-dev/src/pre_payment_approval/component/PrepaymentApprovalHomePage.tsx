import React from "react";
import usePrepaymentApprovalStore from "../store/prepaymentApprovalStore";
import PrepaymentListPage from "./PrepaymentListPage";
import PrepaymentDetailsPage from "./PrepaymentDetailsPage";

export default function PrepaymentApprovalHomePage() {
  const { prepaymentApprovalPageNo: pageNo } = usePrepaymentApprovalStore();
  return (
    <div>
      {(() => {
        switch (pageNo) {
          case 1:
            return <PrepaymentListPage />;

          case 2:
            return <PrepaymentDetailsPage />;

          default:
            return null;
        }
      })()}
    </div>
  );
}
