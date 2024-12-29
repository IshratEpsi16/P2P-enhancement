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
import ShipmentItemDetailsService from "../service/ShipmentItemDetailsService";
import ShipmentItemDetailsInterface from "../interface/ShipmentItemDetailsInterface";
import ShipmentTimelineInterface from "../../po/interface/ShipmentTimelineInterface";
import ShipmentTimelineService from "../../po/service/ShipmentTimelineService";

export default function ShipmentItemDetailsPage() {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shipmentItemDetails, setShipmentItemDetails] = useState<ShipmentItemDetailsInterface[]>([]);

  const { setPageNo, shipmentIdInStore, setShipmentIdInStore, grnNumberInStore, poNumberInStore, poHeaderInStore } = useSupplierPoStore();

  const { token } = useAuth();

  useEffect(() => {
    console.log("storeId: ", shipmentIdInStore);
    console.log("grnNumber: ", grnNumberInStore);
    getShipmentDetails();
  }, [])

  const getShipmentDetails = async() => {
    setIsLoading(true);

    const result = await ShipmentItemDetailsService(token!, shipmentIdInStore!);
    console.log("item details: ", result.data.data);
    setShipmentItemDetails(result.data.data);

    setIsLoading(false);
  }

  const back = () => {
    setPageNo(3);
    setShipmentIdInStore(null);
  };

  const navigateTo = (shipmentIdStore: number) => {
    console.log("ShipmentId store: ", shipmentIdStore);
  }

  // Calculate the total offered quantity
  const totalOfferedQuantity = shipmentItemDetails.reduce((total, item) => {
    return total + item.OFFERED_QUANTITY;
  }, 0);

  // Calculate the total shipping quantity
  const totalShippingQuantity = shipmentItemDetails.reduce((total, item) => {
    const shippingQuantity = item.SHIPPING_QUANTITY ? parseFloat(item.SHIPPING_QUANTITY) : 0;
    return total + shippingQuantity;
  }, 0);

  // Extract PO_HEADER_ID and PO_NUMBER from the first item
  const poHeaderId = shipmentItemDetails.length > 0 ? shipmentItemDetails[0].PO_HEADER_ID : "";
  const poNumber = shipmentItemDetails.length > 0 ? shipmentItemDetails[0].PO_NUMBER : "";

  //shipment timeline

  useEffect(() => {
    getShipmentTimeLine();
  }, []);

  const [isTimelineLoading, setIsTimelineLoading] = useState<boolean>(false);

  const [shipmentTimeline, setShipmentTimeline] =
    useState<ShipmentTimelineInterface | null>(null);
  const [shipmentTimelineList, setShipmentTimelineList] = useState<
    ShipmentTimelineInterface[] | []
  >([]);

  const getShipmentTimeLine = async () => {
    try {
      setIsTimelineLoading(true);

      const result = await ShipmentTimelineService(token!, shipmentIdInStore!);
      if (result.data.status === 200) {
        setShipmentTimelineList(result.data.data);
        setShipmentTimeline(result.data.data[0]);
        console.log(result.data.data[0]);
        setIsTimelineLoading(false);
      } else {
        showErrorToast(result.data.message);
        setIsTimelineLoading(false);
      }
    } catch (error) {
      setIsTimelineLoading(false);
      showErrorToast("Something went wrong in timeline");
    }
  };
  

  return (
    <div className=" m-8 bg-white">
      <SuccessToast />
      <div className=" w-full flex items-center justify-between">
        <div className=" flex flex-col items-start mb-4">
          <PageTitle titleText="Shipment Item Details" />
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

      {/* <div>
        <h3 className="text-lg font-semibold mb-3">Header</h3>

        <div className="w-full bg-offWhiteColor border-borderColor border-[.5px] rounded-md px-4 py-3 space-y-3">
          <div className="flex items-center">
            <p className="w-36 font-semibold text-sm text-[#666d77]">PO Header Id</p>

            <p className="text-midBlack">: {poHeaderId}</p>
          </div>

          <div className="flex items-center">
            <p className="w-36 font-semibold text-sm text-[#666d77]">PO Number</p>

            <p className="text-midBlack">: {poNumber}</p>
          </div>
        </div>
      </div> */}

      {isTimelineLoading ? (
        <div className=" w-full flex justify-center items-center">
          <CircularProgressIndicator />
        </div>
      ) : (
        <div className=" grayCard p-4 flex-col space-y-6 py-3 mb-4 items-center justify-center ">
          <ul className="steps w-full flex justify-center">
            {/* <li
              className={`step ${
                shipmentTimeline?.PO_STATUS_RESULT === 1 ? "step-primary" : ""
              }   w-56 font-mon text-sm`}
            >
              PO Accept
            </li> */}
            <li
              className={`step ${
                shipmentTimeline?.SHIPMENT_STATUS_RESULT === 1
                  ? "step-primary"
                  : ""
              }  w-56 font-mon text-sm`}
            >
              <div>
                <p className="font-mon text-sm">Shipment</p>
                {shipmentTimeline?.SHIPMENT_STATUS_RESULT === 1 ? (
                  <p className="font-mon text-sm ">
                    {/* {moment(shipmentTimeline.SHIPMENT_DATE).format(
                      "DD-MMMM-YYYY hh:mm A"
                    )} */}

                    {shipmentTimeline.SHIPMENT_DATE === "" 
                      ? "---" 
                      : moment(shipmentTimeline.SHIPMENT_DATE).format("DD-MMMM-YYYY hh:mm A")
                    }
                  </p>
                ) : null}
              </div>
            </li>
            <li
              className={`step ${
                shipmentTimeline?.GATE_RCV_RESULT === 1 ? "step-primary" : ""
              } w-56 font-mon text-sm`}
            >
              <div>
                <p className="font-mon text-sm">Gate Received</p>
                {shipmentTimeline?.GATE_RCV_RESULT === 1 ? (
                  <p className="font-mon text-sm">
                    {/* {moment(shipmentTimeline.GATE_RCV_DATE).format(
                      "DD-MMMM-YYYY hh:mm A"
                    )} */}
                    {shipmentTimeline.GATE_RCV_DATE === "" 
                      ? "---" 
                      : moment(shipmentTimeline.GATE_RCV_DATE).format("DD-MMMM-YYYY hh:mm A")
                    }
                  </p>
                ) : null}
              </div>
            </li>
            <li className={`step ${
                shipmentTimeline?.GRN_RESULT === 1
                  ? "step-primary"
                  : ""
              }  w-56 font-mon text-sm`}>
                <div>
                <p className="font-mon text-sm">GRN</p>
                {shipmentTimeline?.GRN_RESULT === 1 ? (
                  <p className="font-mon text-sm">
                    {shipmentTimeline.EBS_GRN_DATE === "" 
                      ? "---" 
                      : moment(shipmentTimeline.EBS_GRN_DATE).format("DD-MMMM-YYYY hh:mm A")
                    }
                  </p>
                ) : null}
              </div>
              </li>
          </ul>
        </div>
      )}

      <div className="h-4"></div>

      { isLoading ? (
          <LogoLoading />
        ) : (
          <>
            { shipmentItemDetails.length === 0 ? 
              <div className=" w-full h-[calc(100vh-200px)] flex items-center justify-center">
                <p className="text-3xl font-bold text-red-500">No Shipment Details Found!</p>
              </div>
            : (
              <>
                <div>
                  {/* <h3 className="text-lg font-semibold mb-3 text-black">Header</h3> */}

                  <div className="w-full rounded-md py-3 flex space-x-6 items-center justify-between">
                    {/* <div className="flex items-center justify-center w-1/3 h-20 bg-white rounded-lg" style={{ boxShadow: 'rgba(145, 158, 171, 0.2) 0px 0px 3px 0px, rgba(145, 158, 171, 0.17) 0px 12px 20px -10px' }}>
                      <div className=" space-y-3">
                        <p className="font-semibold text-sm text-[#484c51]">PO Header ID</p>

                        <p className="text-black font-bold text-[20px]">{poHeaderInStore === "" ? "---" : poHeaderInStore }</p>
                      </div>
                    </div> */}

                    <div className="flex items-center justify-center space-y-4 w-1/3 h-20 bg-white rounded-lg" style={{ boxShadow: 'rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.17) 0px 12px 20px -10px' }}>
                      <div className="space-y-3 text-center">
                        <p className="font-semibold text-sm text-[#484c51]">PO Number</p>

                        <p className="text-black font-bold text-[20px]">{poNumberInStore === "" ? "---" : poNumberInStore}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center space-y-4 w-1/3 h-20 bg-white shadow-md rounded-lg" style={{ boxShadow: 'rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.17) 0px 12px 20px -10px' }}>
                      <div className="space-y-3 text-center">
                        <p className="font-semibold text-sm text-[#484c51]">GRN Number</p>

                        <p className="text-black font-bold text-[20px]">{grnNumberInStore === "" ? "---" : grnNumberInStore}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-3"></div>

                <div className="overflow-auto max-h-[400px] custom-scrollbar rounded-md">
                  <table className="min-w-full divide-y divide-gray-200 border-[0.2px] border-borderColor rounded-md" style={{ tableLayout: "fixed" }}>
                    <thead className="sticky top-0 bg-[#CAF4FF] h-14">
                      <tr>
                        <th className=" font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor whitespace-nowrap">
                          SL
                        </th>
                        <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor whitespace-nowrap">
                          Offered Quantity
                        </th>
                        <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor whitespace-nowrap">
                          Shipping Quantity
                        </th>
                        <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor whitespace-nowrap">
                          Item Code
                        </th>
                        <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor whitespace-nowrap">
                          Item Description
                        </th>
                        <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor whitespace-nowrap">
                          Comments
                        </th>
                        <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor whitespace-nowrap">
                          GRN Quantity
                        </th>
                        <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor whitespace-nowrap">
                          GRN Receive Quantity
                        </th>
                        <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor whitespace-nowrap">
                          GRN Accept Quantity
                        </th>
                        <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor whitespace-nowrap">
                          GRN Reject Quantity
                        </th>
                        <th className="font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor whitespace-nowrap">
                          GRN Delivery Quantity
                        </th>
                        {/* <th className=" font-mon px-6 py-3 text-center text-sm font-semibold text-blackColor whitespace-nowrap">
                          Creation Date
                        </th> */}

                        {/* Add more header columns as needed */}
                      </tr>
                    </thead>

                    <tbody>
                      {shipmentItemDetails.map((item, index) => (
                        <tr onClick={() => {
                          navigateTo(item.SHIPMENT_ID);
                        }} className={`w-full divide-y divide-gray-200 odd:bg-white even:bg-gray-50`} key={index}>
                          <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor border-b-[.4px] border-gray-200">
                            {index + 1}
                            {/* {pageNo === 1
                              ? pageNo + index
                              : offset + 1 + index} */}
                          </td>
                          <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                            {item.OFFERED_QUANTITY}
                          </td>
                          <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                            {item.SHIPPING_QUANTITY === "" ? "---" : (item.SHIPPING_QUANTITY)}
                          </td>
                          <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                            {item.ITEM_CODE === "" ? "---" : (item.ITEM_CODE)}
                          </td>
                          <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                            {item.ITEM_DESCRIPTION === "" ? "---" : (item.ITEM_DESCRIPTION)}
                          </td>
                          <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                            {item.COMMENTS === "" ? "---" : (item.COMMENTS)}
                          </td>
                          <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                            {item.EBS_GRN_QTY === "" ? "---" : (item.EBS_GRN_QTY)}
                          </td>
                          <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                            {item.EBS_RECEIVE_QTY === "" ? "---" : (item.EBS_RECEIVE_QTY)}
                          </td>
                          <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                            {item.EBS_ACCEPT_QTY === "" ? "---" : (item.EBS_ACCEPT_QTY)}
                          </td>
                          <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                            {item.EBS_REJECT_QTY === "" ? "---" : (item.EBS_REJECT_QTY)}
                          </td>
                          <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                            {item.EBS_DELIVERED_QTY === "" ? "---" : (item.EBS_DELIVERED_QTY)}
                          </td>
                          {/* <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                            {isoToDateTime(item.CREATION_DATE)}
                          </td> */}
                        </tr>
                      ))}

                      <tr className="w-full divide-y divide-gray-200">
                        <td className="font-mon font-semibold h-12 px-6 py-3 text-left text-[14px] text-blackColor border-y-[.4px] border-gray-200" colSpan={1}>
                          Total Quantity
                        </td>
                        <td className="font-mon font-semibold h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {totalOfferedQuantity}
                        </td>
                        <td className="font-mon font-semibold h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {totalShippingQuantity}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor" colSpan={7}>
                          {/* Empty cell to match the number of columns */}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )
      }
    </div>
  );
}
