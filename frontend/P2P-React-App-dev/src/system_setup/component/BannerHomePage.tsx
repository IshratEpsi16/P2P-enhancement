import React from "react";
import useBannerUploadStore from "../store/bannerUploadStore";
import BannerListPage from "./BannerListPage";
import BannerUploadPage from "./BannerUploadPage";

export default function BannerHomePage() {
  const { pageNo } = useBannerUploadStore();
  return (
    <div>
      {(() => {
        switch (pageNo) {
          case 1:
            return <BannerListPage />;

          case 2:
            return <BannerUploadPage />;

          default:
            return null;
        }
      })()}
    </div>
  );
}
