import React from "react";
import useBuyerInvoiceStore from "../store/buyerInvoiceStore";
import BuyerInvoiceListPage from "./BuyerInvoiceListPage";
import ApproveInvoicepage from "./ApproveInvoicepage";
import PrepaymentApprovalHomePage from "../../pre_payment_approval/component/PrepaymentApprovalHomePage";
import InvoiceToPoDetailsPage from "./InvoiceToPoDetailsPage";

export default function BuyerInvoiceHome() {
  const { pageNo } = useBuyerInvoiceStore();
  return (
    <div>
      {(() => {
        switch (pageNo) {
          case 1:
            return <BuyerInvoiceListPage />;

          case 2:
            return <ApproveInvoicepage />;

          case 3:
            return <PrepaymentApprovalHomePage />;
          case 4:
            return <InvoiceToPoDetailsPage />;

          default:
            return null;
        }
      })()}
    </div>
  );
}
