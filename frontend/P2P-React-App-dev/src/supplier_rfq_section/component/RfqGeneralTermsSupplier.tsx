import React, { useState, useRef, useEffect } from "react";
import InputLebel from "../../common_component/InputLebel";
import CommonDropDownSearch from "../../common_component/CommonDropDownSearch";
import CommonButton from "../../common_component/CommonButton";
import { useSupplierRfqPageContext } from "../context/SupplierRfqPageContext";
import useSupplierRfqStore from "../store/supplierRfqStore";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import SuccessToast from "../../Alerts_Component/SuccessToast";
import useSupplierRfqPageStore from "../store/SupplierRfqPageStore";
import { useAuth } from "../../login_both/context/AuthContext";
import RfqHeaderDetailsService from "../../buyer_section/pr_item_list/service/RfqHeaderDetailsService";
import RfqHeaderDetailsInterface from "../../buyer_section/pr_item_list/interface/RfqHeaderDetailsInterface";
import LogoLoading from "../../Loading_component/LogoLoading";

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
const ttt = `Terms that you have to follow.
Lorem ipsum dolor sit amet consectetur. Pretium vulputate phasellus cras placerat eget. Venenatis ultrices nulla pretium et consectetur erat quam. Fermentum sit hac lacus at neque justo aenean morbi dapibus. Tellus magna molestie laoreet cursus. Congue elit velit nullam turpis at eget fusce. Vel nunc turpis sed sit enim varius magnis adipiscing. Quis aliquet etiam lectus augue odio. Laoreet enim egestas id iaculis lectus lacus tincidunt. Suscipit blandit sagittis nibh commodo nisl.
Lorem ipsum dolor sit amet consectetur. Viverra pharetra consectetur sit tempus morbi nisl sed quis. Feugiat fermentum odio eleifend quam non tellus lectus.
`;

export default function RfqGeneralTermsSupplier() {
  const termRef = useRef<HTMLInputElement | null>(null);
  // const [termText, setTermText] = useState(ttt);
  const [animal, setAnimal] = useState(null);
  const handleChange = (value: any) => {
    console.log("value:", value);
    setAnimal(value);
  };
  const [termText, setTermText] = useState<string>("");

  const handleInputChange = (e: any) => {
    const inputText = e.target.value;
    if (inputText.length <= 1500) {
      setTermText(inputText);
    } else {
      setTermText(inputText.slice(0, 1500));
    }
  };

  //store
  const { setIsGeneralTermAgree } = useSupplierRfqStore();
  const { setPageNoRfq } = useSupplierRfqPageStore();
  //store
  // const { setSupplierRfqPage } = useSupplierRfqPageContext();

  const previous = async () => {
    setPageNoRfq(2);
  };
  const next = async () => {
    if (isAgree) {
      setIsGeneralTermAgree(isAgree);
      setPageNoRfq(4);
    } else {
      showErrorToast("Please Accept Terms & Conditions");
    }
  };

  //agree with terms or not

  const [isAgree, setIsAgree] = useState<boolean>(false);
  const handleIsAgree = () => {
    setIsAgree(!isAgree);
  };

  //agree with terms or not

  const { rfqIdInStore } = useSupplierRfqStore();

  const { token } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [headerDetails, setHeaderDetails] =
    useState<RfqHeaderDetailsInterface | null>(null);

  // rfqHeader details

  useEffect(() => {
    getHeaderDetails();
  }, []);

  const getHeaderDetails = async () => {
    try {
      const result = await RfqHeaderDetailsService(token!, rfqIdInStore!); //rfwIdInStore
      if (result.data.status === 200) {
        setHeaderDetails(result.data);

        setIsLoading(false);
      } else {
        showErrorToast(result.data.message);
        setIsLoading(false);
      }
    } catch (error) {
      showErrorToast("Rfq Header Details Load Failed");
      setIsLoading(false);
    }
  };
  // rfqHeader details

  useEffect(() => {
    if (headerDetails) {
      setTermText(headerDetails.details.BUYER_GENERAL_TERMS);
    }
  }, [headerDetails]);

  // Split the terms by newline character '\r\n'
  const termsList = termText.split("\r\n").map((term, index) => {
    // check if the term starts with a sub-point indicator (a., b., c.) using regex
    if (/^\s*[a-z]\.\s*/i.test(term)) {
      return (
        <div key={index} className="ml-4">
          {term}
        </div>
      );
    }
    // If not a sub-point, render normally
    return (
      <div key={index} className="py-1">
        {term}
      </div>
    );
  });

  return (
    <div className=" m-8 bg-white">
      <SuccessToast />

      {isLoading ? (
        <div className=" w-full flex justify-center items-center">
          <LogoLoading />
        </div>
      ) : (
        <div className=" w-full flex flex-col items-start  space-y-6">
          <h1 className="  font-medium text-lg text-blackColor">
            General Terms
          </h1>

          <div className="w-3/4  bg-inputBg mt-2 rounded-md shadow-sm focus:outline-none p-8">
            {termsList}
          </div>
          <div className="h-6"></div>
          <div className=" w-full flex items-center space-x-4">
            <button
              onClick={handleIsAgree}
              className={`h-4 w-4 flex justify-center items-center rounded-[4px] ${
                isAgree
                  ? "bg-midGreen border-none"
                  : "border-[1px] border-borderColor"
              }`}
            >
              <img src="/images/check.png" alt="check" className=" w-2 h-2" />
            </button>
            <p className=" text-midBlack text-sm font-mon font-semibold">
              I agree with all the terms & conditions{" "}
            </p>
          </div>

          <div className="h-6"></div>

          <div className=" w-3/4 flex flex-row justify-end space-x-6 my-10">
            <CommonButton
              titleText={"Previous"}
              onClick={previous}
              width="w-36"
              color="bg-graishColor"
              height="h-8"
            />
            <CommonButton
              titleText={"Continue"}
              onClick={next}
              width="w-36"
              color="bg-midGreen"
              height="h-8"
            />
          </div>

          <div></div>
        </div>
      )}
    </div>
  );
}
