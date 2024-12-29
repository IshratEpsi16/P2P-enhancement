import React, { useState, useRef, useEffect } from "react";
import InputLebel from "../../../common_component/InputLebel";

import CommonDropDownSearch from "../../../common_component/CommonDropDownSearch";
import CommonButton from "../../../common_component/CommonButton";
import { useRfqCreateProcessContext } from "../../../buyer_rfq_create/context/RfqCreateContext";
import RfqGeneralTermService from "../service/RfqGeneralTremService";
import { useAuth } from "../../../login_both/context/AuthContext";
import RfqGeneralTermInterface from "../interface/RfqGeneralTermInterface";
import { showErrorToast } from "../../../Alerts_Component/ErrorToast";
import SuccessToast, {
  showSuccessToast,
} from "../../../Alerts_Component/SuccessToast";
import usePrItemsStore from "../../pr/store/prItemStore";
import RfqHeaderDetailsService from "../../pr_item_list/service/RfqHeaderDetailsService";
import LogoLoading from "../../../Loading_component/LogoLoading";

const options = [
  { value: "fox", label: "🦊 Fox" },
  { value: "Butterfly", label: "🦋 Butterfly" },
  { value: "Honeybee", label: "🐝 Honeybee" },
  { value: "Honeybee1", label: "🐝 Honeybee1" },
  { value: "Honeybee2", label: "🐝 Honeybee2" },
  { value: "Honeybee2", label: "🐝 Honeybee2" },
  { value: "Honeybee2", label: "🐝 Honeybee2" },
  { value: "Honeybee2", label: "🐝 Honeybee2" },
  { value: "Honeybee2", label: "🐝 Honeybee2" },
  { value: "Honeybee2", label: "🐝 Honeybee2" },
  { value: "Honeybee2", label: "🐝 Honeybee2" },
  { value: "Honeybee2", label: "🐝 Honeybee2" },
  { value: "Honeybee2", label: "🐝 Honeybee2" },
];

interface GeneralTermDropDown {
  value: string;
  label: string;
}

interface GernalTermDetail {
  value: string;
  label: string;
}

export default function GeneralTermsPage() {
  const termRef = useRef<HTMLInputElement | null>(null);
  // const [termText, setTermText] = useState(ttt);

  const [termText, setTermText] = useState("");

  const handleInputChange = (e: any) => {
    const inputText = e.target.value;
    if (inputText.length <= 4000) {
      setTermText(inputText);
    } else {
      setTermText(inputText.slice(0, 4000));
    }
  };

  const previous = async () => {};
  const next = async () => {};

  //store
  const {
    setSelectedGeneralterm,
    rfqIdInStore,
    setRfqHeaderDetailsInStore,
    rfqHeaderDetailsInStore,
    isCreateRfq,
    setRfqStatusInStore,
    setRfqIdInStore,
    setOrgIdInStore,
    setOrgNameInStore,
    setPrItems,
  } = usePrItemsStore();
  //store
  //context
  const { page, setPage } = useRfqCreateProcessContext();
  const submitAndNext = () => {
    if (termText === "") {
      showErrorToast("Please Enter General Term");
    } else {
      setSelectedGeneralterm(termText);
      setPage(3);
    }
  };
  const previousPage = () => {
    setOrgNameInStore("");
    setRfqStatusInStore("");
    setPrItems([]);
    setPage(6);
    // setRfqIdInStore(null);
  };

  useEffect(() => {
    generalTerm();

    if (!isCreateRfq) {
      console.log("header details call");
      getHeaderDetails();
    }
  }, []);

  const { token } = useAuth();

  const [termList, setTermList] = useState<RfqGeneralTermInterface[] | []>([]);

  const [termDropDownList, setTermDropDownList] = useState<
    GeneralTermDropDown[] | []
  >([]);
  const [termDropDown, setTermDropDow] = useState<GeneralTermDropDown | null>(
    null
  );
  const [selectedMediaId, setSelectedMediaId] = useState<string>("");

  const [termDetailsList, setTermDetailsList] = useState<
    GernalTermDetail[] | []
  >([]);
  const [termDetail, setTermDetail] = useState<GernalTermDetail | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  //rfqHeader details

  const getHeaderDetails = async () => {
    try {
      const result = await RfqHeaderDetailsService(token!, rfqIdInStore!); //rfwIdInStore
      console.log("rfq header details in general term:", result.data);

      if (result.data.status === 200) {
        setRfqHeaderDetailsInStore(result.data);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Rfq Header Details Load Failed");
    }
  };
  //rfqHeader details

  //set general term

  useEffect(() => {
    if (rfqHeaderDetailsInStore) {
      setData();
    }
  }, [rfqHeaderDetailsInStore]);

  const setData = () => {
    if (rfqHeaderDetailsInStore) {
      setTermText(rfqHeaderDetailsInStore.details.BUYER_GENERAL_TERMS);

      setOrgIdInStore(rfqHeaderDetailsInStore.details.ORG_ID.toString());
    }
  };

  //set general term

  const generalTerm = async () => {
    try {
      setIsLoading(true);
      const result = await RfqGeneralTermService(token!);
      if (result.data.status === 200) {
        const transformedData = result.data.data.map(
          (item: RfqGeneralTermInterface) => ({
            value: item.MEDIA_ID,
            label: item.DESCRIPTION,
          })
        );
        setTermDropDownList(transformedData);
        const transformedData2 = result.data.data.map(
          (item: RfqGeneralTermInterface) => ({
            value: item.MEDIA_ID,
            label: item.DATA_VIEW,
          })
        );
        setTermDetailsList(transformedData2);

        setTermList(result.data.data);
        setIsLoading(false);
      } else {
        showSuccessToast(result.data.message);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      showErrorToast("Term Load Failed");
    }
  };

  const handleGeneralTermChange = (value: any) => {
    // console.log("value:", value);
    setTermDropDow(value);
    if (value !== null) {
      setSelectedMediaId(value.value);
      const foundDetails = termDetailsList.find(
        (item) => item.value === value.value
      );

      setTermText(foundDetails!.label);

      console.log(value.value);
    } else if (value == null && selectedMediaId != null) {
      setSelectedMediaId("");
      setTermText("");
      // rfqHeaderDetailsInStore?.details.BUYER_GENERAL_TERMS!
      console.log("cleared");
    } else if (value == null && selectedMediaId == null) {
      setTermText("");
    }
  };

  return (
    <div className=" m-8 bg-white">
      <SuccessToast />
      {isLoading ? (
        <div className=" flex w-full items-center justify-center">
          <LogoLoading />
        </div>
      ) : (
        <div className=" w-full flex flex-col items-start  space-y-6">
          <h1 className="  font-medium text-lg text-blackColor">
            General Terms
          </h1>
          <div className=" w-1/2 flex flex-row space-x-4  items-center">
            <div className=" w-36">
              <InputLebel titleText={"Select Terms"} />
            </div>

            <CommonDropDownSearch
              placeholder="Select A Type"
              onChange={handleGeneralTermChange}
              value={termDropDown}
              width="w-80"
              options={termDropDownList}
            />
          </div>

          <textarea
            // disabled={isCreateRfq ? false : true}
            value={termText}
            onChange={handleInputChange}
            className="w-3/4 h-72 bg-inputBg mt-2 rounded-md shadow-sm focus:outline-none p-8"
          />
          <div className=" w-3/4 flex justify-end items-end">
            <p>{`${termText.length} / 4000`}</p>
          </div>
          <div className="h-6"></div>

          <div className=" w-3/4 flex flex-row justify-end space-x-6 my-10">
            <CommonButton
              titleText={"Previous"}
              onClick={previousPage}
              width="w-36"
              color="bg-graishColor"
            />
            <CommonButton
              titleText={"Continue"}
              onClick={submitAndNext}
              width="w-36"
              color="bg-midGreen"
            />
          </div>

          <div></div>
        </div>
      )}
    </div>
  );
}
