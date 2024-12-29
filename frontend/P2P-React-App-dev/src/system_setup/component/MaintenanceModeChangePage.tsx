import React, { useEffect, useState } from "react";
import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";

import PageTitle from "../../common_component/PageTitle";
import MaintananceModeChangeService from "../service/MaintananceModeChangeService";
import { useAuth } from "../../login_both/context/AuthContext";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import WarningModal from "../../common_component/WarningModal";
import SupplierMaintananceModeChangeService from "../service/SupplierMaintananceModeService";

export default function MaintenanceModeChangePage() {
  const { token } = useAuth();
  const [isMaintanance, setIsMaintanance] = useState(false);

  useEffect(() => {
    getMode();
  }, []);

  const getMode = async () => {
    try {
      const result2 = await SupplierMaintananceModeChangeService(
        token!,
        "SUPPLIER_MAINTENANCE_MODE"
      );
      if (result2.data.data.OBJECT_VALUE === "N") {
        setIsMaintanance(false);
      } else {
        setIsMaintanance(true);
      }
    } catch (error) {}
  };

  const handleActivation = () => {
    setIsMaintanance(!isMaintanance);
    console.log(isMaintanance);
    if (!isMaintanance) {
      mainTainanceOn();
    } else {
      mainTainanceOff();
    }
  };

  const mainTainanceOn = async () => {
    try {
      const result = await MaintananceModeChangeService(
        token!,
        "SUPPLIER_MAINTENANCE_MODE",
        "Y"
      );
      if (result.data.status === 200) {
        showSuccessToast(result.data.message);
      } else {
        showErrorToast(result.data.message);
        setIsMaintanance(false);
      }
    } catch (error) {
      showErrorToast("Maintanance Mode ON Failed.");
    }
  };
  const mainTainanceOff = async () => {
    try {
      const result = await MaintananceModeChangeService(
        token!,
        "SUPPLIER_MAINTENANCE_MODE",
        "N"
      );
      if (result.data.status === 200) {
        showSuccessToast(result.data.message);
      } else {
        showErrorToast(result.data.message);
        setIsMaintanance(true);
      }
    } catch (error) {
      showErrorToast("Maintanance Mode OFF Failed.");
    }
  };

  const [isActiveBank, setIsActiveBank] = useState<boolean>(true);
  const handleActivation1 = () => {
    setIsActiveBank(!isActiveBank);
    openWarningModal();
  };

  const [isWarningShow, setIsWarningShow] = useState(false);
  const openWarningModal = () => {
    setIsWarningShow(true);
  };
  const closeWarningModal = () => {
    setIsWarningShow(false);
    setIsActiveBank(isActiveBank ? false : true);
  };

  return (
    <div>
      <SuccessToast />
      <WarningModal
        isOpen={isWarningShow}
        closeModal={closeWarningModal}
        action={handleActivation}
        message={`Do you want to change mode ?`}
        imgSrc="/images/warning.png"
      />
      <div className=" my-5 w-full  py-8 px-4 bg-white shadow-md rounded-lg border-[1px] border-borderColor space-y-1">
        <div className=" w-full h-12 flex justify-between items-center border-[1px] border-neonBlue rounded-lg px-4">
          <p className=" font-medium font-mon text-neonBlue">
            Supplier Maintanance Mode
          </p>
          <input
            onChange={handleActivation1}
            type="checkbox"
            className={`toggle ${
              isMaintanance ? "bg-neonBlue border-neonBlue" : "bg-graishColor"
            }`}
            checked={isMaintanance ? true : false}
          />
        </div>
        <p className=" w-full text-sm">
          *By turning the, "Maintenance Mode" ON, your supplier site will be
          disabled until you turn this mode OFF.Only the Buyer section will be
          functional.
        </p>
      </div>
    </div>
  );
}
