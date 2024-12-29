import React from "react";
import useGrnStore from "../store/grnStore";
import GrnListPage from "./GrnListPage";
import GrnDetailsPage from "./GrnDetailsPage";

export default function GrnHomePage() {
  const { pageNo } = useGrnStore();
  return (
    <div>
      {(() => {
        switch (pageNo) {
          case 1:
            return <GrnListPage />;

          case 2:
            return <GrnDetailsPage />;

          default:
            return null;
        }
      })()}
    </div>
  );
}
