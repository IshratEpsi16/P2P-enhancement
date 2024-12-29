import React from "react";
import { useManageSupplierProfileUpdateContext } from "../context/ManageSupplierProfileUpdateContext";
import SupplierListForProfileUpdatePage from "./SupplierListForProfileUpdatePage";
import SupplierUpdateInfoDetailspage from "./SupplierUpdateInfoDetailspage";
import SupplierUpdateNewInfoDetailspage from "./SupplierUpdateNewInfoDetailsPage";
import SupplierNewInfoAddDetails from "./SupplierNewInfoAddDetails";
export default function SupplierListHomeForUpdateSupplier() {
  const { manageSupplierProfileUpdatePageNo } =
    useManageSupplierProfileUpdateContext();
  return (
    <div>
      {(() => {
        switch (manageSupplierProfileUpdatePageNo) {
          case 1:
            return <SupplierListForProfileUpdatePage />;

          case 2:
            return <SupplierUpdateInfoDetailspage />;
          case 3:
            return <SupplierUpdateNewInfoDetailspage />;
          case 4:
            return <SupplierNewInfoAddDetails />;

          default:
            return null;
        }
      })()}
    </div>
  );
}
