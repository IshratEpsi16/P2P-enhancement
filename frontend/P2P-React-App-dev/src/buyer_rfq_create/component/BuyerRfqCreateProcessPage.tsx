import React from "react";
import { useRfqCreateProcessContext } from "../context/RfqCreateContext";
import PrItemListPage from "../../buyer_section/pr_item_list/component/PrItemListPage";
import GeneralTermsPage from "../../buyer_section/general_terms/components/GeneralTermsPage";
import BuyerRfqTermPage from "../../buyer_section/buyer_term/component/BuyerRfqTermPage";
import InviteSupplierForRfqPage from "../../buyer_section/invite_supplier_for_rfq/component/InviteSupplierForRfqPage";
import RfqPreviewPage from "../../buyer_section/rfq_preview/component/RfqPreviewPage";
import ApprovedPrPage from "../../buyer_section/pr/component/ApprovedPrPage";
import RfqListInPreparation from "../../buyer_section/pr_item_list/component/RfqListInPreparation";
import SupplierQuotationListPage from "../../buyer_section/pr_item_list/component/SupplierQuotationListPage";
import SupplierQuotationDetailsPage from "../../buyer_section/pr_item_list/component/SupplierQuotationDetailsPage";

export default function BuyerRfqCreateProcessPage() {
  const { page } = useRfqCreateProcessContext();
  return (
    <div>
      {(() => {
        switch (page) {
          // case 'home':
          //   return <Home/>
          // case 1:
          //     return <ApprovedPrPage />
          case 1:
            return <RfqListInPreparation />;
          case 2:
            return <GeneralTermsPage />;
          case 3:
            return <BuyerRfqTermPage />;
          case 4:
            return <InviteSupplierForRfqPage />;
          case 5:
            return <RfqPreviewPage />;
          case 6:
            return <PrItemListPage />;
          case 7:
            return <SupplierQuotationListPage />;
          case 8:
            return <SupplierQuotationDetailsPage />;

          default:
            return null;
        }
      })()}
    </div>
  );
}
