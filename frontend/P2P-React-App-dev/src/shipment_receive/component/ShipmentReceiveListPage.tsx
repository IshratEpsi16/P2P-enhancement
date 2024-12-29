import React, { useEffect, useRef, useState } from "react";
import PageTitle from "../../common_component/PageTitle";
import NavigationPan from "../../common_component/NavigationPan";
import CommonSearchField from "../../common_component/CommonSearchField";
import DateRangePicker from "../../common_component/DateRangePicker";
import ShipmentReceiveListService from "../service/ShipmentReceiveListService";
import { useAuth } from "../../login_both/context/AuthContext";
import ShipmentListInterface from "../interface/ShipmentListInterface";
import LogoLoading from "../../Loading_component/LogoLoading";
import isoToDateTime from "../../utils/methods/isoToDateTime";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import ShipmentAcceptRejectService from "../service/ShipmentAcceptRejectService";
import { showSuccessToast } from "../../Alerts_Component/SuccessToast";
import NotFoundPage from "../../not_found/component/NotFoundPage";
import ArrowLeftIcon from "../../icons/ArrowLeftIcon";
import ArrowRightIcon from "../../icons/ArrowRightIcon";
import useRfiStore from "../../rfi_in_supplier_registration/store/RfiStore";
import useSupplierPoStore from "../../po_supplier/store/SupplierPoStore";
const pan = ["Home", "Po List"];
const list = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

export default function ShipmentReceiveListPage() {


  //search
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [searchInput, setSearchInput] = useState("");

  //auth
    const { regToken, token } = useAuth();
  //auth

  const [shipmentList, setShipmentList] = useState<ShipmentListInterface[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAcceptRejectModalOpen, setIsAcceptRejectModalOpen] = useState<boolean>(false);
  const [selectedShipmentId, setSelectedShipmentId] = useState<number | null>(null);

  const [selectedPoNumber, setSelectedPoNumber] = useState<number | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const [selectStatus, setSelectStatus] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [isNoteMandatory, setIsNoteMandatory] = useState<boolean>(false);
  const characterLimit = 100;


  const [total, setTotal] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(10);
  const [pageNo, setPageNo] = useState<number>(1);
  const [offset, setOffSet] = useState<number>(0);

  // store
  const { setShipmentPageNo } = useRfiStore();

  const [selectedShipmentStatus, setSelectedShipmentStatus] = useState<string>("");

  useEffect(() => {
    getShipmentList(selectedShipmentStatus, offset, limit);
  }, []);

  const changeShipmentStatus = (status: string) => {
    setSelectedShipmentStatus(status);
    setOffSet(0);
    getShipmentList(status, 0, limit);
  };

  const getShipmentList = async (shipStatus: string, offsetNew: number, limitNew: number) => {

    setIsLoading(true);
    const result = await ShipmentReceiveListService(token!, shipStatus, offsetNew, limitNew);

    if(result.data.status === 200) {
      const filteredShipment = result.data.data.filter(
        (shipment: ShipmentListInterface) => 
          shipment.GATE_RCV_STATUS === (shipStatus === "" ? "" : shipStatus)
      );
      setShipmentList(filteredShipment);
      // setShipmentList(result.data.data);
      dividePage(result.data.total, limit);
      console.log("result: ", result.data.data);
      console.log("filtered: ", filteredShipment);
    }

    console.log("shipment List: ", result.data.status);

    setIsLoading(false);
  }

  const dividePage = (number: number, lmt: number) => {
    console.log(number);
    if (typeof number !== "number") {
      throw new Error("Input must be a number");
    }

    const re = Math.ceil(number / lmt);
    console.log(number);
    console.log(re);
    setTotal(re);
  };

  const next = async () => {
    let newOff;

    newOff = offset + limit;
    console.log(newOff);
    setOffSet(newOff);

    setPageNo((pre) => pre + 1);
    console.log(limit);
    // getHistory("", "", newOff, limit);
    getShipmentList(selectedShipmentStatus, newOff, limit);
  };

  const previous = async () => {
    let newOff = offset - limit;
    console.log(newOff);
    if (newOff < 0) {
      newOff = 0;
      console.log(newOff);
    }

    setOffSet(newOff);
    setPageNo((pre) => pre - 1);
    console.log(limit);

    // getHistory("", "", newOff, limit);
    getShipmentList(selectedShipmentStatus, newOff, limit);
  };


  const renderPageNumbers = () => {
    const totalPages = total ?? 0;
    const pageWindow = 5;
    const halfWindow = Math.floor(pageWindow / 2);
    let startPage = Math.max(1, pageNo - halfWindow);
    let endPage = Math.min(totalPages, startPage + pageWindow - 1);

    if (endPage - startPage + 1 < pageWindow) {
      startPage = Math.max(1, endPage - pageWindow + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => {
            setPageNo(i);
            const newOffset = i === 1 ? 1 : (i - 1) * limit + 1;
            setOffSet(newOffset);
            getShipmentList(selectedShipmentStatus, newOffset, limit);
          }}
          className={`w-6 h-6 text-[12px] border rounded-md ${
            pageNo === i ? "border-sky-400" : "border-transparent"
          }`}
          disabled={pageNo === i}
        >
          {i}
        </button>
      );
    }
    return pages;
  };
  // new pagination end

  

  const [selectedOption, setSelectedOption] = useState<{ [key: number]: string }>({});

  const handleStatusChange = async (shipmentId: number, shipmentPoNo: number, shipmentOrg: number, status: string) => {
    setIsLoading(true);

    setSelectedOption(prevState => ({
      ...prevState,
      [shipmentId]: status
    }));

    setSelectedShipmentId(shipmentId);
    setSelectedPoNumber(shipmentPoNo);
    setSelectedOrgId(shipmentOrg);
    setSelectStatus(status);

    if (status === "REJECTED") {
      setIsNoteMandatory(true);
    } else {
      setIsNoteMandatory(false);
    }

    // Open the modal
    setIsAcceptRejectModalOpen(true);

    console.log(`Shipment ID: ${shipmentId}, po: ${shipmentPoNo}, org: ${shipmentOrg} Status: ${status}`);

    setIsLoading(false);
  };

  // const handleStatusChange = async (shipmentId: number, status: string) => {
  //   setSelectedShipmentId(shipmentId);
  //   setSelectStatus(status);
  //   if (status === "REJECTED") {
  //     setIsNoteMandatory(true);
  //   } else {
  //     setIsNoteMandatory(false);
  //   }
  //   setIsAcceptRejectModalOpen(true);
  // };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 100) {
      setNote(value);
    }
  };

  const isCharacterLimitReached = note.length === characterLimit;

  const handleModalSubmit = async () => {
    if (isNoteMandatory && note.trim() === "") {
      showErrorToast("Note is mandatory for Rejection.");
      return;
    } else {
      setIsLoading(true);

      try {
        console.log(`Shipment ID: ${selectedShipmentId}, Status: ${selectStatus}, Note: ${note}`);
        
        const result = await ShipmentAcceptRejectService(token!, selectedShipmentId!, selectedPoNumber!, selectedOrgId!, selectStatus, note);

        console.log("shipment receive result: ", result);
        getShipmentList(selectedShipmentStatus, offset, limit);

        if(result.data.status === 200) {
          showSuccessToast(result.data.message);
        } else {
          showErrorToast(result.data.message);
        }
      } catch (error) {
        showErrorToast("Something went wrong");
      }
      setIsLoading(false);
    }

    setIsAcceptRejectModalOpen(false);
    setNote(""); // Clear the note input
  };

  const closeResetModal = () => {
    setIsAcceptRejectModalOpen(false);
    setNote("");
  };


  const handleSearchInputChange = (val: string) => {
    setSearchInput(val);
  };

  const search = async () => {};
  //search

  //date range
  // const [approveDates, setApproveDates] = useState({
  //   startDate: null,
  //   endDate: null, // Set the endDate to the end of the current year
  // });

  // const handleApproveDateChange = (newValue: any) => {
  //   console.log("newValue:", newValue);
  //   setApproveDates(newValue);
  // };
  //date range

  const { setSingleShipment } = useSupplierPoStore();

  const navigateToDetails = (shipmentDetails: ShipmentListInterface) => {
    setShipmentPageNo(2);
    setSingleShipment(shipmentDetails);

    console.log("navigate to Details")
  };

  return (
    <div className=" m-8 bg-white">
      <div className=" flex flex-col items-start">
        <PageTitle titleText="Shipment Receive List" />
        {/* <NavigationPan list={pan} /> */}
      </div>

      {shipmentList?.length !== 0  && (
        <div className=" w-full flex justify-between my-6 items-center">
          <div className=" flex-1 flex space-x-4">
            <CommonSearchField
              onChangeData={handleSearchInputChange}
              search={search}
              placeholder="Search as PO number"
              inputRef={searchInputRef}
              width="w-80"
            />
            {/* <div className=" w-80">
              <DateRangePicker
                placeholder="Date From - To"
                value={approveDates}
                onChange={handleApproveDateChange}
                width="w-80"
              />
            </div> */}
          </div>

          {/* <div className="exportToExcel">Export to Excel</div> */}
        </div>
      )}

      { shipmentList?.length === 0 ? (
        <div className="h-4"></div>
      ) : null }

      <div className="w-full flex justify-between items-center mb-4">
        <div className="flex space-x-4 items-center">
          {/* Pending Tab */}
          <button
            className={`px-4 h-10 flex justify-center items-center bg-gray-50 rounded-t-md ${
              selectedShipmentStatus === ""
                ? " rounded bg-[#f8f6f6] shadow-md"
                : ""
            }`}
            onClick={() => changeShipmentStatus("")}
          >
            <p className="text-sm font-mon text-blackColor">PENDING</p>
          </button>

          {/* Accepted Tab */}
          <button
            className={`px-4 h-10 flex justify-center items-center bg-green-50 rounded-t-md ${
              selectedShipmentStatus === "ACCEPTED"
                ? " rounded bg-[#d4fee4] text-[#118d57] shadow-md"
                : ""
            }`}
            onClick={() => changeShipmentStatus("ACCEPTED")}
          >
            <p className="text-sm font-mon text-blackColor">ACCEPTED</p>
          </button>

          {/* Rejected Tab */}
          <button
            className={`px-4 h-10 flex justify-center items-center bg-red-50 rounded-t-md ${
              selectedShipmentStatus === "REJECTED"
                ? " rounded bg-[#ffe8e8] shadow-md"
                : ""
            }`}
            onClick={() => changeShipmentStatus("REJECTED")}
          >
            <p className="text-sm font-mon text-blackColor">REJECTED</p>
          </button>
        </div>
      </div>

      {isLoading ? (
        <LogoLoading />
      ) : (!isLoading && shipmentList?.length === 0) ? (
        <NotFoundPage />
      ) : (
        <>
          <div className="rounded-xl"
            style={{
              boxShadow:
                "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -2px",
          }}>
            <div className="overflow-auto max-h-[400px] rounded-lg custom-scrollbar z-30">
              <table className="min-w-full divide-y divide-gray-200 rounded-lg">
                <thead className="bg-[#CAF4FF] sticky top-0 z-30">
                  <tr>
                    <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  ">
                      SL
                    </th>
                    <th className=" font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                      Shipment Date
                    </th>
                    <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                      Est. Delivery Date
                    </th>
                    <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                      Vat Challan Number
                    </th>
                    <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                      PO Number
                    </th>
                    <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                      Status
                    </th>
                    {/* <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                      Action
                    </th> */}

                    {/* Add more header columns as needed */}
                  </tr>
                </thead>

                {/* Table rows go here */}
                {/* Table rows go here */}
                {shipmentList.map((shipment, i) => (
                  <tbody
                    onClick={() => {
                      navigateToDetails(shipment);
                    }}
                    className=" bg-white divide-y divide-gray-200 odd:bg-[#F4F6F8] even:bg-white cursor-pointer"
                    key={i}
                  >
                    <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor font-medium">
                      {offset + i}
                    </td>
                    <td className="w-64 font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                      {shipment.SHIPMENT_DATE === "" ? "---" : isoToDateTime(shipment.SHIPMENT_DATE)}
                    </td>
                    <td className=" w-64 font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                      { shipment.EST_DELIVERY_DATE === "" ? "---" : isoToDateTime(shipment.EST_DELIVERY_DATE)}
                    </td>
                    <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                      {shipment.VAT_CHALLAN_NUMBER === "" ? "---" : shipment.VAT_CHALLAN_NUMBER}
                    </td>
                    <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                      {shipment.PO_NUMBER}
                    </td>
                    <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                      {shipment.STATUS === "" ? "---" : shipment.STATUS}
                    </td>

                    {/* <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                      <select
                        onChange={(e) => handleStatusChange(shipment.SHIPMENT_ID, e.target.value)}
                        className="cursor-pointer p-2 border-[1px] border-gray-200 rounded-lg focus:outline-none"
                      >
                        <option value="" disabled selected>Select Action</option>
                        <option value="ACCEPTED">Accept</option>
                        <option value="REJECTED">Reject</option>
                      </select>
                    </td> */}

                    {/* <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor z-10">
                      <div className="dropdown dropdown-end">
                        <div
                          tabIndex={0}
                          role="button"
                          className="w-36 h-10 border-[1px] border-gray-200 rounded-lg flex items-center justify-center space-x-2"
                        >
                          <p>
                            {selectedOption[shipment.SHIPMENT_ID] || "Select Action"}
                          </p>

                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                          </svg>

                        </div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-20 w-32 p-2 shadow">
                          <li>
                            <button
                              className="text-left w-full"
                              onClick={() => handleStatusChange(shipment.SHIPMENT_ID, shipment.PO_NUMBER, shipment.ORG_ID, "ACCEPTED")}
                            >
                              Accept
                            </button>
                          </li>
                          <li>
                            <button
                              className="text-left w-full"
                              onClick={() => handleStatusChange(shipment.SHIPMENT_ID, shipment.PO_NUMBER, shipment.ORG_ID, "REJECTED")}
                            >
                              Reject
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td> */}
                  </tbody>
                ))}
              </table>
            </div>

            <div className="bg-white sticky bottom-0 w-full flex items-center justify-between px-6 mt-4">
              <div className="w-1/4">
                {pageNo !== 1 && (
                  <button
                    // disabled={pageNo === 1 ? true : false}
                    onClick={previous}
                    className=" px-4 py-2 rounded-md flex space-x-2 items-center border-[0.5px] border-borderColor "
                    style={{
                      boxShadow:
                        "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
                    }}
                  >
                    <div className="w-4 h-4 ">
                      <ArrowLeftIcon className=" w-full h-full " />
                    </div>
                    <p className=" text-[12px]">Previous</p>
                  </button>
                )}
              </div>

              <div className="flex-grow flex justify-center space-x-2">
                {renderPageNumbers()}
              </div>

              <div className="w-1/4 flex justify-end">
                {pageNo !== total && (
                  <button
                    // disabled={pageNo === total ? true : false}
                    onClick={next}
                    className=" px-4 py-2 rounded-md flex space-x-2 items-center shadow-md border-[0.5px] border-borderColor "
                    style={{
                      boxShadow:
                        "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
                    }}
                  >
                    <p className=" text-[12px]">Next</p>
                    <div className="w-4 h-4 ">
                      <ArrowRightIcon className=" w-full h-full " />
                    </div>
                  </button>
                )}
              </div>
            </div>
            
            <div className=" h-4"></div>
          </div>
        </>
      )}

      {isAcceptRejectModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-opacity-50 bg-gray-700">
          <div className="w-[400px] h-[300px] relative bg-white rounded-[10px]">
            <div className="w-full flex justify-start items-center px-8 top-[30px] absolute text-neutral-700 text-[16px] font-bold font-mon">
              {isNoteMandatory ? "Reject Shipment" : "Accept Shipment"}
            </div>
            <div className="w-full flex justify-start items-center px-8 top-[70px] absolute text-neutral-700 text-sm font-mon font-medium">
              Please provide a note:
            </div>
            
            <div className="w-full px-8 mt-[100px]">
              <textarea
                value={note}
                // onChange={(e) => setNote(e.target.value)}
                onChange={handleNoteChange}
                maxLength={characterLimit}
                placeholder="Enter your note here..."
                className="w-full h-24 p-2 border-[1px] text-sm border-gray-200 rounded-lg focus:outline-none resize-none"
              />
            </div>

            <div className={`w-full flex justify-end items-end px-8 top-[195px] absolute text-sm ${
              isCharacterLimitReached ? 'text-red-500' : 'text-gray-500'
            }`}>
              {note.length}/{characterLimit}
            </div>
            <div className="w-full flex space-x-4 h-7 top-[240px] absolute px-8 justify-end items-center">
              <button
                onClick={closeResetModal}
                className="h-10 w-28 rounded-[8px] bg-white border-[1px] border-borderColor text-md font-medium font-mon text-black"
              >
                No
              </button>
              <button
                onClick={handleModalSubmit}
                className="h-10 w-28 rounded-[8px] bg-midGreen text-white text-md font-medium font-mon"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
