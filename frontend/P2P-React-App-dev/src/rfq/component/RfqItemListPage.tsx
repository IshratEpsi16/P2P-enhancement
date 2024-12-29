import React, { useRef, useState } from "react";
import PageTitle from "../../common_component/PageTitle";
import NavigationPan from "../../common_component/NavigationPan";
import CommonSearchField from "../../common_component/CommonSearchField";
import CommonButton from "../../common_component/CommonButton";
import { useRfqPageContext } from "../context/RfqPageContext";
import ReusablePopperComponent from "../../common_component/ReusablePopperComponent";
import ReusablePaginationComponent from "../../common_component/ReusablePaginationComponent";
const pan = ["Home", "Rfq List", "Rfq Item List"];
const list = [
  1,
  1,
  1,
  1,
  23,
  2,
  34,
  34,
  ,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  64,
  4,
  56,
  6,
  7,
  8,
];
export default function RfqItemListPage() {
  const [limit, setLimit] = useState(5);
  const [pageNo, setPageNo] = useState(1);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [searchInput, setSearchInput] = useState("");

  //search
  const handleSearchInputChange = (val: string) => {
    setSearchInput(val);
  };

  const search = async () => {};

  //search

  //context
  const { rfqPageNo, setRfqPageNo } = useRfqPageContext();
  // const back = () => {
  //     setRfqPageNo(1);
  // }
  const nextPage = () => {
    setRfqPageNo(2);
  };

  //context

  const createCS = async () => {
    nextPage();
  };

  const download = async () => {};

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
  return (
    <div className=" m-8">
      <div className=" flex flex-col items-start">
        <PageTitle titleText="RFQ List" />
        {/* <NavigationPan list={pan} /> */}
      </div>
      <div className="h-4"></div>
      <div className=" flex flex-row justify-between items-center">
        <CommonSearchField
          onChangeData={handleSearchInputChange}
          search={search}
          placeholder="Search Here"
          inputRef={searchInputRef}
          width="w-80"
        />

        <CommonButton
          onClick={download}
          titleText={"Export to Excel"}
          width="w-36"
          color="bg-midGreen"
        />
      </div>
      <div className=" h-6"></div>
      <div className="overflow-x-auto">
        <table className=" border-[0.5px] border-gray-200  ">
          <thead className=" bg-[#F4F6F8] shadow-sm h-14">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-blackColor font-mon   tracking-wider"></th>
              <th className="px-6 py-3 text-left text-sm font-medium text-blackColor font-mon   tracking-wider">
                SL
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-blackColor font-mon   tracking-wider">
                PR No/Line No
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-blackColor font-mon   tracking-wider">
                Item Description
              </th>
              <th className="w-64 px-6 py-3 text-left text-sm font-medium text-blackColor font-mon   tracking-wider">
                Specification
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-blackColor font-mon   tracking-wider">
                Expected Brand Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-blackColor font-mon   tracking-wider">
                Expected Brand Origin
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-blackColor font-mon   tracking-wider">
                Warranty
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-blackColor font-mon   tracking-wider">
                UOM
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-blackColor font-mon   tracking-wider">
                Expected Quantity
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-blackColor font-mon   tracking-wider">
                Need By Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-blackColor font-mon   tracking-wider">
                Organization Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-blackColor font-mon   tracking-wider">
                Attachment
              </th>
            </tr>
          </thead>
          <tbody className=" divide-y divide-borderColor ">
            {list.slice(0, limit).map((e, index) => {
              return (
                <tr key={index} className="bg-white hover:bg-offWhiteColor">
                  <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                    <button className=" h-4 w-4 border-[0.1px] border-borderColor rounded-md"></button>
                  </td>

                  <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                    PR098675656/900
                  </td>
                  <td className="w-64  px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                    Item name 01 Item name 01
                  </td>
                  <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                    kjmnhbgfdsgdhf
                  </td>
                  <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                    Sample Name Here
                  </td>
                  <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                    Sample Name Here
                  </td>
                  <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                    <p>Applicable</p>
                  </td>
                  <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                    Kilogram
                  </td>
                  <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                    2000
                  </td>
                  <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                    sghgdjfkgjhrgrfqe
                  </td>
                  <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                    organization name
                  </td>
                  <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                    ghfjhgjkhlkjh
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="h-14 bg-whiteColor border-t-[1px] border-borderColor">
              <td></td>
              <td></td>
              <td>
                <ReusablePopperComponent
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  handleClick={handleClick}
                  setLimit={setLimit}
                  limit={limit}
                />
              </td>
              <td className=" py-3      ">
                <ReusablePaginationComponent
                  pageNo={pageNo}
                  limit={limit}
                  // list={list}
                  previous={previous}
                  next={next}
                />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className=" h-10"></div>
      <div className=" flex flex-row justify-end space-x-6">
        <CommonButton
          onClick={createCS}
          titleText={"Create CS"}
          width="w-28"
          color="bg-midGreen"
        />
      </div>
      <div className="h-20"></div>
    </div>
  );
}
