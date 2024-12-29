import React, { useRef, useState } from "react";
import PageTitle from "../../common_component/PageTitle";
import NavigationPan from "../../common_component/NavigationPan";
import CommonSearchField from "../../common_component/CommonSearchField";
import CommonButton from "../../common_component/CommonButton";
import DropDown from "../../common_component/DropDown";
import ReusablePaginationComponent from "../../common_component/ReusablePaginationComponent";
import ReusablePopperComponent from "../../common_component/ReusablePopperComponent";
const list = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
const pan = ["Home", "CS List"];
export default function BuyerCsListPage() {
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [searchInput, setSearchInput] = useState("");

  const [limit, setLimit] = useState(5);
  const [pageNo, setPageNo] = useState(1);

  // aita holo popper er jonno
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;
  //end poppoer

  //pagination
  const next = async () => {};
  const previous = async () => {};

  const handleSearchInputChange = (val: string) => {
    setSearchInput(val);
  };

  const search = async () => {};

  const download = async () => {};

  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];
  const handleSelect = (value: string) => {
    console.log(`Selected: ${value}`);
    // Do something with the selected value
  };

  return (
    <div className=" m-8">
      <div className=" flex  flex-col items-start">
        <PageTitle titleText="CS List" />
        {/* <NavigationPan list={pan} /> */}
      </div>
      <div className="h-6"></div>
      <div className=" w-full flex flex-row justify-between">
        <div className="w-1/2 flex flex-row space-x-10 items-center">
          <CommonSearchField
            onChangeData={handleSearchInputChange}
            search={search}
            placeholder="Search Here"
            inputRef={searchInputRef}
            width="w-60"
          />
          <DropDown options={options} onSelect={handleSelect} width="w-60" />
        </div>

        <div className="exportToExcel">Export To Excel</div>
      </div>
      <div className="h-6"></div>
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
                CS ID
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Created By
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                Status
              </th>

              {/* Add more header columns as needed */}
            </tr>
          </thead>

          {/* Table rows go here */}
          {/* Table rows go here */}
          {list.slice(0, limit).map((e, i) => (
            <tbody
              className="cursor-pointer bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]"
              key={i}
            >
              <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor font-medium">
                {i + 1}
              </td>
              <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                CS98574546758896
              </td>
              <td className=" w-64 font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                Saidur Rahman Durjoy
              </td>
              <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                {(i + 1) % 2 === 0 ? (
                  <div className=" text-xs text-green-800 font-semibold py-1  w-20 flex justify-center bg-green-200 rounded-md">
                    Approved
                  </div>
                ) : (
                  <div className=" text-xs text-red-800 font-semibold py-1  w-20 flex justify-center bg-red-200 rounded-md">
                    Rejected
                  </div>
                )}
              </td>
            </tbody>
          ))}

          <tfoot className="sticky bottom-0 bg-white">
            <tr className=" h-12">
              <td></td>
              <td className="pl-6 py-3    ">
                <div className=" flex flex-row items-center space-x-2">
                  <ReusablePopperComponent
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    handleClick={handleClick}
                    setLimit={setLimit}
                    limit={limit}
                  />
                  <ReusablePaginationComponent
                    pageNo={pageNo}
                    limit={limit}
                    // list={list}
                    previous={previous}
                    next={next}
                  />
                </div>
              </td>

              {/* Add more footer columns as needed */}
            </tr>
          </tfoot>
        </table>
      </div>
      <div className=" h-20"></div>
    </div>
  );
}
