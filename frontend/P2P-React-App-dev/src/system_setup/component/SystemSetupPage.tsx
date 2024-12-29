import React, { useEffect, useState } from "react";
import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";
import PageTitle from "../../common_component/PageTitle";
import MaintananceModeChangeService from "../service/MaintananceModeChangeService";
import { useAuth } from "../../login_both/context/AuthContext";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import MaintenanceModeChangePage from "./MaintenanceModeChangePage";
import BannerHomePage from "./BannerHomePage";

const tList = [
  {
    id: 1,
    name: "Maintenance Mode",
  },
  {
    id: 2,
    name: "Banner Setting",
  },
];

interface TabInterface {
  id: number;
  name: string;
}

export default function SystemSetupPage() {
  const [tabList, setTabList] = useState<TabInterface[]>(tList);

  const [selectedTab, setSelectedTab] = useState<number | null>(1);

  const handleTabList = (id: number) => {
    setSelectedTab(id);
  };

  return (
    <div className=" m-8  bg-white">
      {/* <MaintananceModePage /> */}
      <SuccessToast />

      <PageTitle titleText="System Setup" />

      <div className=" w-full my-5 flex space-x-6">
        {tabList.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => {
              handleTabList(tab.id);
            }}
            className={`py-1 px-4 rounded-[10px] border-[1px] border-borderColor test-sm font-mon text-midBlack font-medium ${
              selectedTab === tab.id ? " bg-purple-100" : " bg-white"
            } `}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div className="w-full   border-borderColor border-[1px] p-4 rounded-[8px]">
        {(() => {
          switch (selectedTab) {
            case 1:
              return <MaintenanceModeChangePage />;
            case 2:
              return <BannerHomePage />;

            default:
              return null;
          }
        })()}
      </div>
    </div>
  );
}
