import React from "react";
import { useSupplierRfqPageContext } from "../context/SupplierRfqPageContext";
import RfqListPageSupplier from "./RfqListPageSupplier";
import RfqItemListFoeSupplier from "./RfqItemListForSupplier";
import RfqGeneralTermsSupplier from "./RfqGeneralTermsSupplier";
import RfqTermsSupplierPage from "./RfqTermsSupplierPage";
import ReviewQuotationPage from "./ReviewQuotationPage";
import useSupplierRfqPageStore from "../store/SupplierRfqPageStore";

export default function RfqHomePageFromSupplier() {
  // const { supplierRfqPage } = useSupplierRfqPageContext();
  const { pageNoRfq: pageNo } = useSupplierRfqPageStore();
  return (
    <div>
      {(() => {
        switch (pageNo) {
          // case 'home':
          //   return <Home/>
          case 1:
            return <RfqListPageSupplier />;

          case 2:
            return <RfqItemListFoeSupplier />;
          case 3:
            return <RfqGeneralTermsSupplier />;
          case 4:
            return <RfqTermsSupplierPage />;
          case 5:
            return <ReviewQuotationPage />;

          default:
            return null;
        }
      })()}
    </div>
  );
}
