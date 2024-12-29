import React, { useState, useRef, useEffect } from "react";
import useRfiStore from "../../rfi_in_supplier_registration/store/RfiStore";
import ShipmentReceiveListPage from "./ShipmentReceiveListPage";
import ShipmentReceiveDetailsPage from "./ShipmentReceiveDetailsPage";

export default function ShipmentAcceptReceiveHomePage() {
  const { shipmentPageNo } = useRfiStore();
  return (
    <div>
      {(() => {
        switch (shipmentPageNo) {
          case 1:
            return <ShipmentReceiveListPage />;
          case 2:
            return <ShipmentReceiveDetailsPage />;

          default:
            return null;
        }
      })()}
    </div>
  );
}
