import React, { useRef, useState } from "react";
import PageTitle from "../../common_component/PageTitle";
import useBuyerInvoiceStore from "../../buyer_invoice/store/buyerInvoiceStore";
import CommonSearchField from "../../common_component/CommonSearchField";
import DateRangePicker from "../../common_component/DateRangePicker";
import CommonButton from "../../common_component/CommonButton";
import usePrepaymentApprovalStore from "../store/prepaymentApprovalStore";

export default function PrepaymentListPage() {
  const { setPageNo } = useBuyerInvoiceStore();
  const back = () => {
    setPageNo(1);
  };

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [searchInput, setSearchInput] = useState("");

  const handleSearchInputChange = (val: string) => {
    setSearchInput(val);
  };

  const search = async () => {};

  const [approveDates, setApproveDates] = useState({
    startDate: null,
    endDate: null, // Set the endDate to the end of the current year
  });

  const handleApproveDateChange = (newValue: any) => {
    console.log("newValue:", newValue);
    setApproveDates(newValue);
  };

  const { setPrepaymentApprovalPageNo } = usePrepaymentApprovalStore();

  const navigateToDetails = () => {
    setPrepaymentApprovalPageNo(2);
  };

  return (
    <div className=" m-8 bg-white">
      <PageTitle titleText="Pre Payment List" />
      <div className=" my-4 w-full flex justify-between items-center">
        {/* left */}
        <div className=" flex space-x-4 items-center">
          <CommonSearchField
            onChangeData={handleSearchInputChange}
            search={search}
            placeholder="Search Here"
            inputRef={searchInputRef}
            width="w-60"
          />
          <div className=" w-60">
            <DateRangePicker
              placeholder="Date From - To"
              value={approveDates}
              onChange={handleApproveDateChange}
              width="w-full"
            />
          </div>
        </div>

        {/* left */}

        {/* right */}
        <div className=" flex space-x-4 items-center">
          <div className="exportToExcel">Export To Excel</div>
          <CommonButton
            onClick={back}
            titleText="Back"
            color="bg-midGreen"
            width="w-36"
          />
        </div>

        {/* right */}
      </div>

      <div className="overflow-auto max-h-[400px] rounded-lg shadow-lg custom-scrollbar">
        <table className="min-w-full divide-y divide-gray-200 rounded-lg">
          <thead className="bg-[#CAF4FF] sticky top-0 ">
            <tr>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                SL
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                Supplier ID
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                Supplier Name
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                Amount
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                OU Name
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                Created Date
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                Approved date
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                Status
              </th>
            </tr>
          </thead>

          <tbody
            onClick={navigateToDetails}
            className=" cursor-pointer bg-white divide-y divide-gray-200"
          >
            <tr>
              <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                <div className="w-full overflow-auto custom-scrollbar text-center">
                  1
                </div>
              </td>
              <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar ">
                <div className="w-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                  sdfwsdf
                </div>
              </td>
              <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                <div className="w-full overflow-auto custom-scrollbar text-center">
                  werfwerf
                </div>
              </td>
              <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                <div className="w-full overflow-auto custom-scrollbar text-center">
                  ryerty
                </div>
              </td>
              <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                <div className="w-full overflow-auto custom-scrollbar text-center">
                  werwe
                </div>
              </td>
              <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                <div className="w-full overflow-auto custom-scrollbar text-center">
                  <div className=" px-2 h-6 rounded-md bg-[#FFE9D5] text-[#BF7E1B] font-semibold text-xs flex justify-center items-center font-mon">
                    Pending
                  </div>
                </div>
              </td>
              <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                <div className="w-full overflow-auto custom-scrollbar text-center">
                  <div className=" px-2 h-6 rounded-md bg-[#F1CCCC] text-[#B71D18] font-semibold text-xs flex justify-center items-center font-mon">
                    Rejected
                  </div>
                </div>
              </td>
              <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                <div className="w-full overflow-auto custom-scrollbar text-center">
                  <div className=" px-2 h-6 rounded-md bg-[#CCE2D2] text-[#006E1F] font-semibold text-xs flex justify-center items-center font-mon">
                    Approved
                  </div>
                </div>
              </td>
            </tr>
          </tbody>

          <tfoot className="bg-white sticky bottom-0">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
