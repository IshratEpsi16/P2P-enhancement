import React, { useRef, useState } from "react";
import useGrnStore from "../store/grnStore";
import PageTitle from "../../common_component/PageTitle";
import NavigationPan from "../../common_component/NavigationPan";
import CommonSearchField from "../../common_component/CommonSearchField";

const pan = ["Home", "GRN List", "GRN Item Details"];
const list = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

export default function GrnDetailsPage() {
  //store
  const { setPageNo } = useGrnStore();
  //store

  //search

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [searchInput, setSearchInput] = useState("");

  const handleSearchInputChange = (val: string) => {
    setSearchInput(val);
  };

  const search = async () => {};
  //search

  const back = () => {
    setPageNo(1);
  };

  return (
    <div className=" m-8 bg-white">
      <div className=" flex flex-col items-start">
        <PageTitle titleText="GRN Item Details" />
        {/* <NavigationPan list={pan} /> */}
      </div>

      <div className=" w-full flex justify-between my-6 items-center">
        <CommonSearchField
          onChangeData={handleSearchInputChange}
          search={search}
          placeholder="Search as Order No , Org Name, Amount"
          inputRef={searchInputRef}
          width="w-80"
        />

        <div className="exportToExcel">Export to Excel</div>
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
                GRN No
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                PO No
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Invoice No.
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                PO Qty
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                GRN Qty
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Accepted Qty
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Delivery Qty
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Billed Qty
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Unbilled Qty
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Rejected Qty
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Supplier Name
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Item Description
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Org Name
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Payment Status
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Challan No
              </th>

              {/* Add more header columns as needed */}
            </tr>
          </thead>

          {/* Table rows go here */}
          {/* Table rows go here */}
          {list.map((e, i) => (
            <tbody
              onClick={() => {}}
              className="cursor-pointer bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]"
              key={i}
            >
              <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor font-medium">
                {i + 1}
              </td>
              <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                GRN0001
              </td>
              <td className="  font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                PO0001
              </td>
              <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                inv0001
              </td>
              <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                10
              </td>
              <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                10
              </td>
              <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                8
              </td>
              <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                8
              </td>
              <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                8
              </td>
              <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                8
              </td>
              <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                2
              </td>
              <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                sample name
              </td>
              <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                item description
              </td>
              <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                org name
              </td>
              <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                Paid
              </td>
              <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                078909877
              </td>
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
}
