import { useEffect, useRef, useState } from "react";
import CommonSearchField from "../../../common_component/CommonSearchField";
import PageTitle from "../../../common_component/PageTitle";
import CommonButton from "../../../common_component/CommonButton";
import SupplierSyncEbsService from "../service/SupplierSyncEbsService";
import { useAuth } from "../../../login_both/context/AuthContext";
import SuccessToast, { showSuccessToast } from "../../../Alerts_Component/SuccessToast";
import { showErrorToast } from "../../../Alerts_Component/ErrorToast";


export default function SupplierSyncEbsPage() {

  const { token } = useAuth();

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  
  const [searchValue, setSearchValue] = useState("");

  const handleSearchInputChange = (val: string) => {
    setSearchValue(val);
  };

  const searchSupplier = async () => {
    console.log("searching ebs: ", searchValue);

    const result = await SupplierSyncEbsService(token!, searchValue);

    console.log("result:", result);

    if(result.statusCode === 200) {
      showSuccessToast(result.data.message);
    } else {
      showErrorToast(result.data.message);
    }

  };

  // for enter button click to send, start
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        searchSupplier();
      }
    };

    const inputElement = searchInputRef.current;
    if (inputElement) {
      inputElement.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [searchValue]);

  // for enter button click to send, end
  
  

  return (
    <div className="bg-white m-8">

    <SuccessToast />

      <div className=" w-full flex justify-between items-center">
        <div className=" flex flex-col items-start">
          <PageTitle titleText="Supplier Sync" />
        </div>
      </div>

      <div className="h-6"></div>

      {/* <CommonSearchField
        onChangeData={handleSearchInputChange}
        search={searchSupplier}
        placeholder="Search Here"
        inputRef={searchInputRef}
        width="w-72"
      /> */}

      <div className=" flex flex-row space-x-2 items-start">
        <input
          type="text"
          placeholder="Search here"
          ref={searchInputRef}
          value={searchValue}
          onChange={(e) => handleSearchInputChange(e.target.value)}
          className="w-60 p-2 border-[0.5px] bg-white border-borderColor rounded-md focus:outline-none"
        />
        <div>
          <CommonButton
            onClick={searchSupplier}
            titleText={"Sync from EBS"}
            width="w-32"
            height="h-10"
            color="bg-midGreen"
          />
        </div>
      </div>
      
      {/* <div className=" h-20"></div> */}
    </div>
  );
}
