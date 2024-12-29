import React, { useRef, useState } from "react";
import PageTitle from "../../common_component/PageTitle";
import NavigationPan from "../../common_component/NavigationPan";
import CommonSearchField from "../../common_component/CommonSearchField";
import DateRangePicker from "../../common_component/DateRangePicker";
import useGrnStore from "../store/grnStore";
const pan = ["Home", "GRN List"];
const list = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

export default function GrnListPage() {
  // store
  const { setPageNo } = useGrnStore();
  // store

  //search

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [searchInput, setSearchInput] = useState("");

  const handleSearchInputChange = (val: string) => {
    setSearchInput(val);
  };

  const search = async () => {};

  //search

  //date range
  const [approveDates, setApproveDates] = useState({
    startDate: null,
    endDate: null, // Set the endDate to the end of the current year
  });

  const handleApproveDateChange = (newValue: any) => {
    console.log("newValue:", newValue);
    setApproveDates(newValue);
  };

  //date range

  const navigateToDetails = () => {
    setPageNo(2);
  };
  return (
    <div className=" m-8 bg-white">
      <div>
        <PageTitle titleText="GRN List" />
        {/* <NavigationPan list={pan} /> */}
      </div>
      <div className=" my-6 w-full flex justify-between items-center">
        <div className=" flex-1 flex space-x-4 items-center">
          <CommonSearchField
            onChangeData={handleSearchInputChange}
            search={search}
            placeholder="Search Here"
            inputRef={searchInputRef}
            width="w-80"
          />
          <div className=" w-80">
            <DateRangePicker
              placeholder="Date From - To"
              value={approveDates}
              onChange={handleApproveDateChange}
              width="w-80"
            />
          </div>
        </div>
        <div className="exportToExcel">Export to Excel</div>
      </div>
      <div className=" h-6"></div>

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
                GRN No
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                PO ID
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Quantity
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Date
              </th>

              {/* Add more header columns as needed */}
            </tr>
          </thead>

          {/* Table rows go here */}
          {/* Table rows go here */}
          {list.map((e, i) => (
            <tbody
              onClick={() => {
                navigateToDetails();
              }}
              className="cursor-pointer bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]"
              key={i}
            >
              <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor font-medium">
                {i + 1}
              </td>
              <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                GRN00001
              </td>
              <td className=" w-64 font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                PO09867
              </td>
              <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                10000
              </td>
              <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                DD/MM/YYYY
              </td>
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
}
