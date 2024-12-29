import React from "react";
import { usePoPageContext } from "../context/PoPageContext";
import PoListPage from "./PoListPage";
import PoDetailsPage from "./PoDetailsPage";
import SupplierInvoiceListPage from "./SupplierInvoiceListPage";

import SupplierInvoiceDetailsPage from "./SupplierInvoiceDetailsPage";
import CreateShipmentNotice from "../../po_supplier/component/CreateShipmentNotice";
import useSupplierPoStore from "../../po_supplier/store/SupplierPoStore";
import ShipmentListPage from "../../po_supplier/component/ShipmentListPage";
import PoStandardInvoicePage from "./PoStandardInvoicePage";
import ShipmentItemDetailsPage from "../../po_supplier/component/ShipmenItemDetailsPage";

export default function PoHomePage() {
  // const { poPageNoInContext: poPageNo } = usePoPageContext();
  const { pageNo } = useSupplierPoStore();
  return (
    <div>
      {(() => {
        switch (pageNo) {
          // case 'home':
          //   return <Home/>
          case 1:
            return <PoListPage />;

          case 2:
            return <PoDetailsPage />;

          case 3:
            return <ShipmentListPage />;

          case 4:
            return <CreateShipmentNotice />;

          case 5:
            return <SupplierInvoiceListPage />;

          case 6:
            return <SupplierInvoiceDetailsPage />;

          case 7:
            return <PoStandardInvoicePage />;

          case 8:
            return <ShipmentItemDetailsPage />;

          // // case 3:
          // //     return <CreateCsPage />
          // // case 4:
          // //     return <CsPreviewPage />

          default:
            return null;
        }
      })()}
    </div>
  );
}
