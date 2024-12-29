import React, { useState, useRef, useEffect } from "react";

import RfiSupplierListPage from "./RfiSupplierListPage";
import RfiSupplierDetailsPage from "./RfiSupplierDetailsPage";
import { useRfiManageSupplierContext } from "../context/RfiManageSupplierContext";
import RfiRequestForRfqPage from "./RfiRequestForRfqPage";
import RfiDetailsForRfqPage from "./RfiDetailsForRfqPage";
import RfiRequestForVatPage from "./RfiRequestForVatPage";
import RfiDetailsForVatPage from "./RfiDetailsForVatPage";
import useRfiStore from "../store/RfiStore";
import RfiRequestForCsPage from "./RfiRequestForCsPage";
import RfiDetailsForCsPage from "./RfiDetailsForCsPage";
import RfiRequestForProfileUpdatePage from "./RfiRequestForProfileUpdatePage";
import RfiDetailsForProfileUpdatePage from "./RfiDetailsForProfileUpdatePage";
import RfiDetailsForSupplierListProfileUpdate from "./RfiDetailsForSupplierListProfileUpdate";
import RfiRequestForNewInfoPage from "./RfiRequestForNewInfoPage";
import RfiNewInfoListPage from "./RfiNewInfoListPage";
import RfiDetailsForNewInfoPage from "./RfiDetailsForNewInfoPage";
import RfiRequestForInvoicePage from "./RfiRequestForInvoicePage";
import RfiDetailsForInvoicePage from "./RfiDetailsForInvoicePage";

export default function RfiHomeSupplierListPage() {
  const { rfiManageSupplierPageNo } = useRfiManageSupplierContext();
  const { rfiTabNo } = useRfiStore();
  return (
    <div>
      {(() => {
        switch (rfiTabNo) {
          case 11:
            return <RfiSupplierListPage />;
          case 22:
            return <RfiSupplierDetailsPage />;
          case 33:
            return <RfiRequestForRfqPage />;
          case 44:
            return <RfiDetailsForRfqPage />;
          case 55:
            return <RfiRequestForVatPage />;
          case 66:
            return <RfiDetailsForVatPage />;
          case 77:
            return <RfiRequestForCsPage />;
          case 88:
            return <RfiDetailsForCsPage />;
          case 99:
            return <RfiRequestForProfileUpdatePage />;
          case 999:
            return <RfiDetailsForProfileUpdatePage />;
          case 111:
            return <RfiRequestForNewInfoPage />;
          case 1111:
            return <RfiNewInfoListPage />;
          case 11111:
            return <RfiDetailsForNewInfoPage />;
          case 222:
            return <RfiRequestForInvoicePage />;
          case 2222:
            return <RfiDetailsForInvoicePage />;

          default:
            return null;
        }
      })()}
    </div>
  );
}
