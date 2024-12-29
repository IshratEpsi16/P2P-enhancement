import React, { useState, useRef } from "react";
import PageTitle from "../../common_component/PageTitle";
import NavigationPan from "../../common_component/NavigationPan";
import CommonButton from "../../common_component/CommonButton";
import InputLebel from "../../common_component/InputLebel";
import DropDown from "../../common_component/DropDown";
import CommonSearchField from "../../common_component/CommonSearchField";
import DateRangePicker from "../../common_component/DateRangePicker";

const pan = ["Home", "RRQ", "RFQ Item List"];

const options = [
  { value: "", label: "ALL" },
  { value: "buyer", label: "Buyer" },
  { value: "supplier", label: "Supplier" },
  { value: "admin", label: "Admin" },
];

export default function TechnicalQuotationSubmissionPage() {
  const [selectedDropDown, setSelectedDropDown] = useState<string>("");

  //drop
  const handleSelect = (value: string) => {
    console.log(`Selected: ${value}`);
    // setSearchKey(value);
    setSelectedDropDown(value);
    // getData(offset, value);
    // Do something with the selected value
  };
  //drop

  //search
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [searchInput, setSearchInput] = useState("");

  const handleSearchInputChange = (val: string) => {
    setSearchInput(val);
  };

  const search = async () => {};
  //search

  //date

  const [approveDates, setApproveDates] = useState({
    startDate: null,
    endDate: null, // Set the endDate to the end of the current year
  });

  const handleApproveDateChange = (newValue: any) => {
    console.log("newValue:", newValue);
    setApproveDates(newValue);
  };
  //date

  const accept = () => {};

  const reject = () => {};
  return (
    <div className=" bg-white m-8">
      <div className=" mb-8">
        <PageTitle titleText="RFQ Item List" />
        {/* <NavigationPan list={pan} /> */}
      </div>
      <div className=" w-full flex items-center space-x-4 mb-8">
        <p className=" mediumText">Do you want to participate ?</p>
        <CommonButton
          onClick={accept}
          titleText="Accept"
          width="w-32"
          height="h-10"
          color="bg-midBlue"
        />
        <button onClick={reject} className=" denyButton  w-32">
          Reject
        </button>
      </div>
      <InputLebel titleText={"Header"} />
      <div className=" grayCard p-4 w-full flex justify-between items-start">
        <div className="flex-1 space-y-2">
          <div className=" w-full  flex space-x-4 items-start">
            <div className=" w-32">
              <p className=" text-graishColor text-sm">RFQ ID :</p>
            </div>
            <div className=" flex-1">
              <p className=" text-midBlack text-sm">REF00123456789</p>
            </div>
          </div>
          <div className=" w-full  flex space-x-4 items-center">
            <div className=" w-32">
              <p className=" text-graishColor text-sm">Prepared Date :</p>
            </div>
            <div className=" flex-1">
              <p className=" text-midBlack text-sm">Sample name here</p>
            </div>
          </div>
          <div className=" w-full  flex space-x-4 items-center">
            <div className=" w-32">
              <p className=" text-graishColor text-sm">Organization Name :</p>
            </div>
            <div className=" flex-1">
              <p className=" text-midBlack text-sm">Sample name here</p>
            </div>
          </div>
          <div className=" w-full  flex space-x-4 items-center">
            <div className=" w-32">
              <p className=" text-graishColor text-sm">Attachment :</p>
            </div>
            <div className=" flex-1">
              <p className=" text-midBlack text-sm">
                <button className=" smallViewButton">view</button>
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <div className=" w-full  flex space-x-4 items-start">
            <div className=" w-32">
              <p className=" text-graishColor text-sm">Currency :</p>
            </div>
            <div className=" flex-1">
              <p className=" text-midBlack text-sm">
                <DropDown
                  options={options}
                  onSelect={handleSelect}
                  width="w-full"
                  sval={selectedDropDown}
                />
              </p>
            </div>
          </div>
          <div className=" w-full  flex space-x-4 items-center">
            <div className=" w-32">
              <p className=" text-graishColor text-sm">Total Amount :</p>
            </div>
            <div className=" flex-1">
              <p className=" text-midBlack text-sm">Sample name here</p>
            </div>
          </div>
          <div className=" w-full  flex space-x-4 items-center">
            <div className=" w-32">
              <p className=" text-graishColor text-sm">
                Frieght charge Amount :
              </p>
            </div>
            <div className=" flex-1">
              <p className=" text-midBlack text-sm">Sample name here</p>
            </div>
          </div>
          <div className=" w-full  flex space-x-4 items-center">
            <div className=" w-32">
              <p className=" text-graishColor text-sm">RFQ Type :</p>
            </div>
            <div className=" flex-1">
              <p className=" text-midBlack text-sm">technical</p>
            </div>
          </div>
        </div>

        <div className=" flex-1 flex space-x-4 items-start justify-end">
          <p className=" text-midBlack text-sm">Selected 3</p>
          <p className=" text-midBlack text-sm">Non Selected 7</p>
        </div>
      </div>
      <div className=" w-full my-8 flex items-center justify-between">
        <div className=" flex-1 flex space-x-4 items-center">
          <CommonSearchField
            onChangeData={handleSearchInputChange}
            search={search}
            placeholder="Search Here"
            inputRef={searchInputRef}
            width="w-64"
          />
          <div className=" w-64">
            <DateRangePicker
              placeholder="Date From - To"
              width="w-full"
              value={approveDates}
              onChange={handleApproveDateChange}
            />
          </div>
        </div>
        <div className="exportToExcel">Export To Excel</div>
      </div>

      <div className="overflow-x-auto">
        <table
          className="min-w-full divide-y divide-gray-200 border-[0.2px] border-borderColor rounded-md"
          style={{ tableLayout: "fixed" }}
        >
          <thead className="sticky top-0 bg-[#F4F6F8] h-14">
            <tr>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  ">
                SL
              </th>
              <th className=" font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                PR No/PR Line No
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                RFQ Subject
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Item Description
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Expected Spec.
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Expected Brand Origin
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Available Spec.
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Available Brand
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Available Origin
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Need by Date
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Promised Date
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                UOM
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Expected quantity
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Offered Quantity
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Tolerance
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                VAT Yes/No
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                VAT
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Amount Including VAT
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Freight Charge amount
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Packing Type
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                warranty
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Remarks
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Buyer Attachment
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Add Attachement
              </th>

              {/* Add more header columns as needed */}
            </tr>
          </thead>

          {/* Table rows go here */}
          {/* Table rows go here */}
          {/* {list.slice(0, limit).map((e, i) => ( */}
          <tbody className="cursor-pointer bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]">
            <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor font-medium">
              {1}
            </td>
            <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
              PR No/PR Line No
            </td>
            <td className=" w-64 font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
              RFQ Subject
            </td>
            <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
              Item Description
            </td>
            <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
              Expected Spec.
            </td>
            <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
              Expected Brand Origin
            </td>
            <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
              Available Spec.
            </td>
            <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
              Available Brand
            </td>
            <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
              Available Origin
            </td>
            <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
              Need by Date
            </td>
            <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
              Promised Date
            </td>
            <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
              UOM
            </td>
            <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
              Expected quantity
            </td>
            <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
              Offered Quantity
            </td>
            <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
              Tolerance
            </td>
            <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
              VAT Yes/No
            </td>
            <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
              VAT
            </td>
            <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
              Amount Including VAT
            </td>
            <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
              Freight Charge amount
            </td>
            <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
              Packing Type
            </td>
            <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
              warranty
            </td>
            <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
              Remarks
            </td>
            <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
              Buyer Attachment
            </td>
            <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
              Add Attachement
            </td>
          </tbody>
          {/* ))} */}
        </table>
      </div>
    </div>
  );
}
