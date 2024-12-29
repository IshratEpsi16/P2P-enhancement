import React, { useState, useEffect } from "react";
import PageTitle from "../../common_component/PageTitle";
import NavigationPan from "../../common_component/NavigationPan";
import useSupplierPoStore from "../store/SupplierPoStore";
import CommonButton from "../../common_component/CommonButton";
import DateRangePicker from "../../common_component/DateRangePicker";
import CommonInputField from "../../common_component/CommonInputField";
import FilePickerInput from "../../common_component/FilePickerInput";
import moment from "moment";
import { useAuth } from "../../login_both/context/AuthContext";
import PoItemInterface from "../interface/PoItemInterface";
import SuccessToast from "../../Alerts_Component/SuccessToast";
import PoItemListService from "../service/PoItemListService";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import LogoLoading from "../../Loading_component/LogoLoading";
import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";
import ShipmentListService from "../service/ShipmentListService";
import ShipmentInterface from "../interface/ShipmentInterface";
import isoToDateTime from "../../utils/methods/isoToDateTime";
import ArrowLeftIcon from "../../icons/ArrowLeftIcon";
import ArrowRightIcon from "../../icons/ArrowRightIcon";
import NotFoundPage from "../../not_found/component/NotFoundPage";

export default function ShipmentListPage() {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shipmentList, setShipmentList] = useState<ShipmentInterface[]>([]);

  const { setPageNo, setShipmentIdInStore, setGrnNumberInStore, poHeaderInStore } = useSupplierPoStore();

  const { token, userId } = useAuth();

  // for pagination start

  const [total, setTotal] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [offset, setOffSet] = useState<number>(0);

  // for pagination end

  useEffect(() => {
    getShipmentList(offset, limit);
    console.log("userId", userId);
    console.log("header ID: ", poHeaderInStore);
  }, [])

  const getShipmentList = async(offset: number, limit: number) => {
    setIsLoading(true);

    const result = await ShipmentListService(token!,poHeaderInStore!, offset, limit);
    console.log("data: ", result.data.data);
    setShipmentList(result.data.data);
    dividePage(result.data.total, limit);

    setIsLoading(false);
  }

  const next = async () => {
    let newOff;

    newOff = offset + limit;
    console.log(newOff);
    setOffSet(newOff);

    setPageNum((pre) => pre + 1);
    console.log(limit);
    // getHistory("", "", newOff, limit);
    getShipmentList(newOff, limit);
  };

  const previous = async () => {
    let newOff = offset - limit;
    console.log(newOff);
    if (newOff < 0) {
      newOff = 0;
      console.log(newOff);
    }

    setOffSet(newOff);
    setPageNum((pre) => pre - 1);
    console.log(limit);

    getShipmentList(newOff, limit);
  };

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

  // new pagination start
  const renderPageNumbers = () => {
    const totalPages = total ?? 0;
    const pageWindow = 5;
    const halfWindow = Math.floor(pageWindow / 2);
    let startPage = Math.max(1, pageNum - halfWindow);
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
            setPageNum(i);
            setOffSet((i - 1) * limit);
            getShipmentList((i - 1) * limit, limit);
          }}
          className={`w-6 h-6 text-[12px] border rounded-md ${
            pageNum === i ? "border-sky-400" : "border-transparent"
          }`}
          disabled={pageNum === i}
        >
          {i}
        </button>
      );
    }
    return pages;
  };
  // new pagination end

  const back = () => {
    setPageNo(2);
  };

  const navigateTo = (shipmentIdStore: number, grnNumber: string) => {
    setShipmentIdInStore(shipmentIdStore);
    setGrnNumberInStore(grnNumber);
    setPageNo(8);
  }

  

  return (
    <div className=" m-8 bg-white">
      <SuccessToast />
      <div className=" w-full flex items-center justify-between">
        <div className=" flex flex-col items-start mb-4">
          <PageTitle titleText="Shipment List" />
          {/* <NavigationPan list={pan} /> */}
        </div>
        <CommonButton
          titleText="Back"
          onClick={back}
          color="bg-midGreen"
          width="w-20"
          height="h-8"
        />
      </div>

      <div className="h-4"></div>

      <div
        className="rounded-xl "
        style={{
          boxShadow: "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -2px",
        }}
      >

        { isLoading ? (
            <LogoLoading />
          )  : shipmentList.length === 0 ? (
            <div>
              <NotFoundPage />
            </div>
          ) : (
            <>
              <div className="overflow-auto max-h-[400px] custom-scrollbar">
                <table className="min-w-full divide-y divide-gray-200 border-[0.2px] border-borderColor rounded-md" style={{ tableLayout: "fixed" }}>
                  <thead className="sticky top-0 bg-[#CAF4FF] h-14">
                    <tr>
                      <th className=" font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor whitespace-nowrap">
                        SL
                      </th>
                      <th className=" font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Shipment ID
                      </th>
                      <th className=" font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Shipment Date
                      </th>
                      <th className=" font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        PO Number
                      </th>
                      <th className=" font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        PO Header ID
                      </th>
                      <th className=" font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        GRN Number
                      </th>
                      <th className=" font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Gate Receive Date
                      </th>
                    

                      {/*
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Est. Delivery Date
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        LC Number
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        BL Challan Number
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Vat Challan Number
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Delivery Challan Number
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Shipment Status
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Bill Location
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Address 1
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor w-60">
                        Address 2
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor  whitespace-nowrap">
                        City/State
                      </th> */}

                      {/* Add more header columns as needed */}
                    </tr>
                  </thead>

                  <tbody>
                    {shipmentList.map((item, index) => (
                      <tr onClick={() => {
                        navigateTo(item.SHIPMENT_ID, item.EBS_GRN_NO);
                      }} className={`cursor-pointer w-full divide-y divide-gray-200 odd:bg-white even:bg-gray-50`} key={index}>
                        <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor border-b-[.4px] border-gray-200">
                          {/* {index + 1} */}
                          {pageNum === 1
                            ? pageNum + index
                            : offset + 1 + index}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {item.SHIPMENT_ID}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          { item.SHIPMENT_DATE === "" ? "N/A" : isoToDateTime(item.SHIPMENT_DATE)}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {item.PO_NUMBER}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {item.PO_HEADER_ID === "" ? "---" : item.PO_HEADER_ID}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {item.EBS_GRN_NO === "" ? "---" : item.EBS_GRN_NO}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          { item.GATE_RCV_DATE === "" ? "---" : isoToDateTime(item.GATE_RCV_DATE)}
                        </td>
                        {/* <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          { item.EST_DELIVERY_DATE === "" ? "N/A" : isoToDateTime(item.EST_DELIVERY_DATE)}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {item.LC_NUMBER === "" ? "N/A" : item.LC_NUMBER}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {item.BL_CHALLAN_NUMBER === "" ? "N/A" : item.BL_CHALLAN_NUMBER}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {item.VAT_CHALLAN_NUMBER === "" ? "N/A" : item.VAT_CHALLAN_NUMBER}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {item.DEVLIVERY_CHALLAN_NUMBER === "" ? "N/A" : item.DEVLIVERY_CHALLAN_NUMBER}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-center text-[12px] text-blackColor">
                          <span className={`px-2 py-1 rounded-md font-semibold  ${ 
                            item.STATUS === 'SHIPPED' ? 'bg-[#fff1d6] text-[#b97206]' :
                            item.STATUS === 'RECEIVED' ? 'bg-[#dbf6e5] text-[#118d57]' :
                            ''
                          }`}
                          // style={{ width: '6rem', height: '1.75rem' }}
                          >
                            {item.STATUS}
                          </span>
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {item.BILL_TO_LOCATION.NAME === "" ? "N/A" : item.BILL_TO_LOCATION.NAME}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {item.SHIP_FROM_LOCATION.ADDRESS_LINE1 === "" ? "N/A" : item.SHIP_FROM_LOCATION.ADDRESS_LINE1}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {item.SHIP_FROM_LOCATION.ADDRESS_LINE2 === "" ? "N/A" : item.SHIP_FROM_LOCATION.ADDRESS_LINE2}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {item.SHIP_FROM_LOCATION.CITY_STATE === "" ? "N/A" : item.SHIP_FROM_LOCATION.CITY_STATE}
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-white sticky bottom-0 w-full flex items-center justify-between px-6 mt-4">
                <div className="w-1/4">
                  {pageNum !== 1 && (
                    <button
                      // disabled={pageNo === 1 ? true : false}
                      onClick={previous}
                      className=" px-4 py-2 rounded-md flex space-x-2 items-center border-[0.5px] border-borderColor "
                      style={{
                        boxShadow: "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
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
                  {pageNum !== total && (
                    <button
                      // disabled={pageNo === total ? true : false}
                      onClick={next}
                      className=" px-4 py-2 rounded-md flex space-x-2 items-center shadow-md border-[0.5px] border-borderColor "
                      style={{
                        boxShadow: "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
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
            </>
          )
        }
      </div>
    </div>
  );
}
