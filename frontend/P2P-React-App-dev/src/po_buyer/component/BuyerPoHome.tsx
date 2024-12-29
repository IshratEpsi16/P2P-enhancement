import React from "react";
import useSupplierPoStore from "../../po_supplier/store/SupplierPoStore";
import BuyerPoListPage from "./BuyerPoListPage";
import BuyerPoDetailsPage from "./BuyerPoDetailsPage";
import CreateShipmentNotice from "../../po_supplier/component/CreateShipmentNotice";
import ShipmentListPage from "../../po_supplier/component/ShipmentListPage";
import ShipmentItemDetailsPage from "../../po_supplier/component/ShipmenItemDetailsPage";
import useBuyerPoStore from "../store/BuyerPoStore";
import BuyerShipmentListPage from "./BuyerShipmentListPage";
import BuyerShipmentItemDetailsPage from "./BuyerShipmentItemDetailsPage";
import BuyerInvoiceListPage from "./BuyerInvoiceListPage";
import BuyerInvoiceDetailsPage from "./BuyerInvoiceDetailsPage";

export default function BuyerPoHome() {
  const { pageNo } = useBuyerPoStore();
  return (
    <div>
      {(() => {
        switch (pageNo) {
          case 1:
            return <BuyerPoListPage />;

          case 2:
            return <BuyerPoDetailsPage />;
          // case 3:
          //   return <CreateShipmentNotice />;
          case 3:
            return <BuyerShipmentListPage />;
          case 4:
            return <BuyerShipmentItemDetailsPage />;
          case 5:
            return <BuyerInvoiceListPage />;
          case 6:
            return <BuyerInvoiceDetailsPage />;

          default:
            return null;
        }
      })()}
    </div>
  );
}
