import React, { useState, useRef, useEffect } from "react";
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
import SuccessToast, { showSuccessToast } from "../../Alerts_Component/SuccessToast";
import PoItemListService from "../service/PoItemListService";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import LogoLoading from "../../Loading_component/LogoLoading";
import NotFoundPage from "../../not_found/component/NotFoundPage";
import ShipmentAddUpdateService from "../service/ShipmentAddUpdateService";
import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";
import RfqHeaderDetailsService from "../../buyer_section/pr_item_list/service/RfqHeaderDetailsService";
import RfqHeaderDetailsInterface from "../../buyer_section/pr_item_list/interface/RfqHeaderDetailsInterface";
import SiteListService from "../../registration/service/site_creation/SiteListService";
import SupplierSiteInterface from "../../registration/interface/SupplierSiteInterface";
import InputLebel from "../../common_component/InputLebel";
import CommonDropDownSearch from "../../common_component/CommonDropDownSearch";
import ValidationError from "../../Alerts_Component/ValidationError";
import ShipmentSubmitItemInterface from "../interface/ShipmentSubmitItemInterface";
import CreateShipmentItemService from "../service/CreateShipmentItemService";
const pan = ["Home", "Po List", "PO Item Details", "Create Submit Notice"];
const list = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];


interface Site {
  value: string;
  label: string;
}

export default function CreateShipmentNotice() {
  const { setPageNo, poHeaderInStore, poNumberInStore, singlePo } = useSupplierPoStore();

  const { token } = useAuth();

  const back = () => {
    setPageNo(2);
  };

  //shipping date
  const [ShippingDate, setShippingDate] = useState({
    startDate: null,
    endDate: null, // Set the endDate to the end of the current year
  });

  const [convertedShippingDate, setConvertedShippingDate] =
    useState<string>("");

  const handleShippingDateChange = (newValue: any) => {
    console.log("newValue:", newValue);
    if(newValue.startDate) {
      setShippingDate(newValue);
      setConvertedShippingDate(moment(newValue.startDate).format("YYYY-MM-DD"));
      console.log(moment(newValue.startDate).format("YYYY-MM-DD"));
    } else {
      setConvertedShippingDate("");
    }
  };
  //shipping date

  //lc number
  const lcNumberRef = useRef<HTMLInputElement | null>(null);
  const [LCNumber, setLCNumber] = useState<string>("");
  const handlelcNumberChange = (value: string) => {
    setLCNumber(value);
  };
  //lc number

  //challan number
  const deliveryChallanNumberRef = useRef<HTMLInputElement | null>(null);
  const [deliveryChallanNumber, setDeliveryChallanNumber] =
    useState<string>("");
  const handleDeliveryChallanNumberChange = (value: string) => {
    setDeliveryChallanNumber(value);
  };
  //challan number

  // bl challan number
  const blChallanNumberRef = useRef<HTMLInputElement | null>(null);
  const [blChalanNumber, setBlChalanNumber] = useState("");

  const handleBlChalanNumberChange = (value: string) => {
    setBlChalanNumber(value);
  };

  // bl challan number

  //est Delivery date
  const [estDeliveryDate, setEstDeliveryDate] = useState({
    startDate: null,
    endDate: null, // Set the endDate to the end of the current year
  });

  const [convertedEstDeliveryDate, setConvertedEstDeliveryDate] =
    useState<string>("");

  const handleEstDeliveryDateChange = (newValue: any) => {
    if(newValue.startDate) {
      console.log("newValue:", newValue);
      setEstDeliveryDate(newValue);
      setConvertedEstDeliveryDate(
        moment(newValue.startDate).format("YYYY-MM-DD")
      );
    } else {
      setConvertedEstDeliveryDate("");
    }
  };
  //est Delivery date

  //attachment
  const [attachmentFileName, setAttachmentFileName] = useState<string | null>(null
  );
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  const handleAttachment = (file: File | null) => {
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file);
      setAttachmentFile(file);
    } else {
      // No file selected
      console.log("No file selected");
    }
  };

  //attachment

  //vatchallanNumber
  const vatChallanNumberRef = useRef<HTMLInputElement | null>(null);
  const [vatChallanNumber, setVatChallanNumber] = useState<string>("");
  const handleVatChallanNumberChange = (value: string) => {
    setVatChallanNumber(value);
  };
  //vatchallanNumber

  const noteToSupplierRefs = useRef<HTMLInputElement[]>([]);

  const [noteToSupplierList, setNoteToSupplierList] = useState<string[] | []>(
    []
  );

  // const handleNoteToSupplierChange = (value: string, index: number) => {
  //   const newNotes = [...noteToSupplierList];
  //   newNotes[index] = value;
  //   setNoteToSupplierList(newNotes);
  //   const newPrItem = [...prItemList];
  //   newPrItem[index].NOTE_TO_SUPPLIER = value;
  //   setPrItemList(newPrItem);
  // };

  const [itemList, setItemList] = useState<PoItemInterface[] | []>([]);
  const [selectedItemList, setSelectedItemList] = useState<
    PoItemInterface[] | []
  >([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rfqHeaderId, setRfqHeaderId] = useState<number | null>(null);
  const [rfqHeaderDetails, setRfqHeaderDetails] = useState<RfqHeaderDetailsInterface | null>(null);
  const [convertedSiteList, setConvertedSiteList] = useState<Site[]>([]);
  
  const [siteView, setSiteView] = useState<null>(null);
  
  const [selectedSiteList, setSelectedSiteList] = useState<Site[]>([]);


  useEffect(() => {
    getPoItem();
    getSiteList();
    getShipmentItem();

    console.log("poHeader: ", poHeaderInStore);
    console.log("poNumber: ", poNumberInStore);
    console.log("singlePo: ", singlePo);

    // getRfqHeaderDetails();
  }, []);

  useEffect(() => {
    if (rfqHeaderId !== null) {
      getRfqHeaderDetails();
    }
  }, [rfqHeaderId]);

  // const PO_HEADER_ID = 2197815
  // ;
  // const PO_NUMBER = 10331008385;

  const PO_HEADER_ID = 1846514;
  const PO_NUMBER = 10131018151;

  const shippingQuantityRefs = useRef<HTMLInputElement[]>([]);

  const [shippingQuantityList, setShippingQuantityList] = useState<
    string[] | []
  >([]);

  const getPoItem = async () => {
    try {
      setIsLoading(true);

      const result = await PoItemListService(token!, poHeaderInStore!, poNumberInStore!);
      if (result.data.status === 200) {
        result.data.data.forEach((item: PoItemInterface) => {
          item.SHIPPING_QUANTITY = "";
          // item.PO_NUMBER = 10131018151;
        });

        // setItemList(result.data.data);
        console.log(result.data.data);
        setRfqHeaderId(result.data.data[0].RFQ_ID);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("something went wrong");
      setIsLoading(false);
    }
  };

  const getShipmentItem = async () => {
    setIsLoading(true);

    const result = await CreateShipmentItemService(token!, poNumberInStore!);

    if(result.data.status === 200) {
      setItemList(result.data.data);
      setIsLoading(false);
    }

    console.log("shipmentItem: ", result);

    setIsLoading(false);
  }

  const getRfqHeaderDetails = async () => {
    try {
      setIsLoading(true);
      const result = await RfqHeaderDetailsService(token!, rfqHeaderId!);

      if (result.data.details) {
        setRfqHeaderDetails(result.data);
        console.log(result.data.details)
      }

      setIsLoading(false);
    } catch (error) {
      showErrorToast("Something went wrong");
      setIsLoading(false);
    }
  }

  const getSiteList = async () => {
    try {
      // setIsLoading(true);
      const result = await SiteListService(token!);

      if (result.data.status === 200) {
        const filteredData = result.data.data.filter(
          (item: SupplierSiteInterface) => item.ACTIVE_STATUS === "ACTIVE"
        );

        const transformedData = filteredData.map(
          (item: SupplierSiteInterface) => ({
            value: item.ID,
            label: item.ADDRESS_LINE1,
          })
        );
        setConvertedSiteList(transformedData);
      } else {
        // setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      // setIsLoading(false);
      showErrorToast("Something went wrong");
    }
  };

  const [siteId, setSiteId] = useState<string>("");

  const handleSiteChange = (value: any) => {
    // console.log("value:", value);
    setSiteView(value);
    if (value !== null) {
      setSelectedSiteList(value);
      console.log(value.value);

      // getOrganization(value.value);
      setSiteId(value.value);
      console.log(value);
    } else if (value == null && siteView != null) {
      setSelectedSiteList([]); //country silo
      // setOrganizationList([]);
      setSiteId("");
      console.log("cleared");
    }
  };

  // old handleShippingQuantity
  // const handleShippingQuantity = (value: string, index: number) => {
  //   const newShippingQuantity = [...shippingQuantityList];
  //   const newItemList = [...itemList];
  //   if (newItemList[index].OFFERED_QUANTITY < parseInt(value)) {
  //     showErrorToast("You can not ship greater than offered quantity");
  //     // shippingQuantityRefs.current[index].value = "";
  //   }
  //   newShippingQuantity[index] = value;
  //   setShippingQuantityList(newShippingQuantity);

  //   newItemList[index].SHIPPING_QUANTITY = value;
  //   setItemList(newItemList);
  // };

  // new handleShippingQuantity
  // const handleShippingQuantity = (value: string, index: number) => {
  //   const newShippingQuantity = [...shippingQuantityList];
  //   const newItemList = [...itemList];
    
  //   const offeredQuantity = parseInt(newItemList[index].SHIPMENT_OFFERED_QUANTITY, 10) || 0;
  //   const shippedQuantity = parseInt(newItemList[index].SHIPPING_QUANTITY, 10) || 0;
  //   const quotOfferedQuantity = parseInt(newItemList[index].QUOT_OFFERED_QUANTITY, 10) || 0;

  //   const isOfferedQuantityEmpty = newItemList[index].SHIPMENT_OFFERED_QUANTITY === "";

  //   const remainingQuantity = isOfferedQuantityEmpty
  //     ? quotOfferedQuantity - shippedQuantity
  //     : offeredQuantity - shippedQuantity;

  //   if (isOfferedQuantityEmpty && quotOfferedQuantity < shippedQuantity) {
  //     showErrorToast("Quoted Quantity cannot be less than Shipped Quantity.");
  //     newShippingQuantity[index] = "";
  //     setShippingQuantityList(newShippingQuantity);
  //     return;
  //   }
  
  //   const numericValue = parseInt(value, 10);
  
  //   if (numericValue > remainingQuantity) {
  //     showErrorToast(`Your remaining shipping quantity is ${remainingQuantity}.`);
  //     // Clear the input field by updating the state or controlled component value
  //     newShippingQuantity[index] = "";
  //     setShippingQuantityList(newShippingQuantity);
  //   } else {
  //     newShippingQuantity[index] = value;
  //     setShippingQuantityList(newShippingQuantity);
  
  //     newItemList[index].SHIPPING_QUANTITY = value;
  //     setItemList(newItemList);
  //   }
  // };


  // const handleShippingQuantity = (value: string, index: number) => {
  //   const newShippingQuantity = [...shippingQuantityList];
  //   const newItemList = [...itemList];
    
  //   const shipmentOfferedQuantity = parseInt(newItemList[index].SHIPMENT_OFFERED_QUANTITY, 10) || 0;
  //   const shipmentShippingQuantity = parseInt(newItemList[index].SHIPPING_QUANTITY, 10) || 0;
  //   const quotOfferedQuantity = parseInt(newItemList[index].AWARD_QUANTITY, 10) || 0;
  
  //   const newInputValue = parseInt(value, 10) || 0;
  
  //   let errorMessage = '';
  
  //   // if (shipmentOfferedQuantity > 0) {
  //   //   // If SHIPMENT_OFFERED_QUANTITY has a value
  //   //   if (newInputValue > shipmentOfferedQuantity - shipmentShippingQuantity) {
  //   //     errorMessage = `Your remaining shipping quantity is ${shipmentOfferedQuantity - shipmentShippingQuantity}`;
  //   //   }
  //   // } else {
  //     // If SHIPMENT_OFFERED_QUANTITY is empty, use QUOT_OFFERED_QUANTITY
  //     if (newInputValue > quotOfferedQuantity - shipmentShippingQuantity) {
  //       errorMessage = `Your remaining shipping quantity is ${quotOfferedQuantity - shipmentShippingQuantity}`;
  //     }
  //   // }
  
  //   if (errorMessage) {
  //     showErrorToast(errorMessage);
  //     newShippingQuantity[index] = "";
  //   } else {
  //     newShippingQuantity[index] = value;
  //     newItemList[index].SHIPPING_QUANTITY = value;
  //   }
  
  //   setShippingQuantityList(newShippingQuantity);
  //   setItemList(newItemList);
  // };


  const [newShippingValueList, setNewShippingValueList] = useState<string[]>([]);

  const handleShippingQuantity = (value: string, index: number) => {
    const newItemList = [...itemList];
    const newInputValueList = [...newShippingValueList]; // Temporary input value storage
    
    const shipmentShippingQuantity = parseInt(newItemList[index].SHIPPING_QUANTITY, 10) || 0;
    const quotOfferedQuantity = parseInt(newItemList[index].AWARD_QUANTITY, 10) || 0;

    const newInputValue = parseInt(value, 10) || 0;
    
    let errorMessage = '';

    if (newInputValue > quotOfferedQuantity - shipmentShippingQuantity) {
      errorMessage = `Your remaining shipping quantity is ${quotOfferedQuantity - shipmentShippingQuantity}`;
    }

    if (errorMessage) {
      showErrorToast(errorMessage);
      // Reset the input field value if there's an error
      newInputValueList[index] = "";
    } else {
      // Update input field value temporarily
      newInputValueList[index] = value;
    }

    setNewShippingValueList(newInputValueList);
};
  
  

  useEffect(() => {
    setData();
  }, [itemList]);

  const setData = () => {
    if (itemList) {
      const newShipping = itemList.map((item) => item.SHIPPING_QUANTITY);
      setShippingQuantityList(newShipping);

      if (shippingQuantityRefs.current) {
        shippingQuantityRefs.current = newShipping.map((spec, index) => {
          return (
            shippingQuantityRefs.current[index] ||
            React.createRef<HTMLInputElement>()
          );
        });
      }
    }
  };

  const [isSelectAll, setIsSelectAll] = useState<boolean>(false);

  const selectAll = () => {
    setIsSelectAll(true);
    setSelectedItemList(itemList);
  };

  const unSelectAll = () => {
    setIsSelectAll(false);
    setSelectedItemList([]);
  };

  const toggleItemSelection = (item: PoItemInterface) => {
    setSelectedItemList((prevSelectedList) => {
      const isItemSelected = prevSelectedList.some(
        (e) => e.CS_LINE_ID === item.CS_LINE_ID
      );

      if (isItemSelected) {
        return prevSelectedList.filter(
          (it) => it.CS_LINE_ID !== item.CS_LINE_ID
        );
      } else {
        return [...prevSelectedList, item as PoItemInterface];
      }
    });
  };


  // validation
  const [shipmentError, setShipmentError] = useState<{
    siteId?: string;
    convertedShippingDate?: string;
    convertedEstDeliveryDate?: string;
  }>({});

  const validate = () => {
    const errors: {
      siteId?: string;
      convertedShippingDate?: string;
      convertedEstDeliveryDate?: string;
    } = {};

    if (siteId === "") {
      errors.siteId = "Please select Site";
    }

    if (convertedShippingDate === "") {
      errors.convertedShippingDate = "Please select shipping date";
    }
    if (convertedEstDeliveryDate === "") {
      errors.convertedEstDeliveryDate = "Please select est. delivery date";
    }
    setShipmentError(errors);
    return Object.keys(errors).length === 0;
  };

  //confirm shipment

  const [isConfirmLoading, setIsConfirmLoading] = useState<boolean>(false);

  const confirmShipment = async () => {
    console.log("items: ", selectedItemList);
    if(validate()) {
      
      if (selectedItemList.length > 0) {
        const missingShippingQuantities: number[] = [];
        const validatedShippingQuantities: string[] = [];

        selectedItemList.forEach((item, index) => {
          const itemIndex = itemList.findIndex(listItem => listItem.CS_LINE_ID === item.CS_LINE_ID);
          if (!newShippingValueList[itemIndex] || newShippingValueList[itemIndex].trim() === '') {
            missingShippingQuantities.push(index + 1);
          } else {
            validatedShippingQuantities[index] = newShippingValueList[itemIndex];
          }
        });
  
        if (missingShippingQuantities.length > 0) {
          const errorMessage = `Missing shipping quantity on item number ${missingShippingQuantities.join(', ')}`;
          showErrorToast(errorMessage);
          setIsLoading(false);
          setIsConfirmLoading(false);
          return;
        }

        console.log("Selected Items:", selectedItemList);

  

        // Assuming `selectedItemList` contains the selected items
        // const rfqIds = selectedItemList.map((item) => item.RFQ_ID).join(',');
        // const csIds = selectedItemList.map((item) => item.CS_ID).join(',');

        // if(selectedItemList.length > 0) {

          const billToId = rfqHeaderDetails?.details.BILL_TO_LOCATION_ID.toString();
          const orgId = rfqHeaderDetails?.details.ORG_ID.toString();

          const selectedItem = selectedItemList[0]; // Get the first selected item
          const rfqId = selectedItem.RFQ_LINE_ID?.toString();
          const csId = selectedItem.CS_ID?.toString();
          const poHeaderId = "1846514";

          const convertShipmentItems: ShipmentSubmitItemInterface[] = selectedItemList.map((item, i) => ({
            SHIPMENT_LINE_ID: item.SHIPMENT_LINE_ID,
            CS_LINE_ID: item.CS_LINE_ID,
            ITEM_CODE: item.ITEM_CODE,
            ITEM_DESCRIPTION: item.ITEM_DESCRIPTION,
            LCM_ENABLE: item.LCM_ENABLE_FLAG,
            OFFERED_QUANTITY: item.AWARD_QUANTITY.toString(),
            SHIPPING_QUANTITY: validatedShippingQuantities[i],
            PO_HEADER_ID: poHeaderInStore,
            PO_NUMBER: poNumberInStore,
            PO_LINE_ID: item.PO_LINE_ID,
            PO_LINE_NUMBER: item.PO_LINE_NUM,
            SHIP_NUM: item.SHIP_NUM,
          }));
          try {
            setIsLoading(true);
            setIsConfirmLoading(true);

            const result = await ShipmentAddUpdateService(
              token!,
              "",
              singlePo?.RFQ_ID!.toString() || "", //rfq id
              csId, //cs id
              siteId, //ship from location id
              billToId!, //bill to location id
              LCNumber,
              blChalanNumber,
              vatChallanNumber,
              deliveryChallanNumber,
              "SHIPPED",
              poNumberInStore, //po number
              attachmentFile,
              convertedShippingDate,
              convertedEstDeliveryDate,
              poHeaderInStore,  // po header
              orgId!,
              "",
              "",
              "",
              convertShipmentItems
            );

            if (result.data.status === 200) {
              showSuccessToast(result.data.message);
              setPageNo(1);
              getPoItem();
              setIsLoading(false);
              setIsConfirmLoading(false);
            } else {
              setIsLoading(false);
              setIsConfirmLoading(false);
              showErrorToast(result.data.message);
            }
          } catch (error) {
            showErrorToast("Something went wrong in shipment confirmation");
            setIsLoading(false);
            setIsConfirmLoading(false);
          }
        } else {
          showErrorToast("No item selected");
          setIsLoading(false);
          setIsConfirmLoading(false);
        }
      } else {
      console.log("validation failed");
    }
  };
  //confirm shipment

  // shipment List
  const shipmentList = () => {
    console.log("shipment List");
    setPageNo(4);
  }

  return (
    <div className=" m-8 bg-white">
      <SuccessToast />
      <div className=" w-full flex items-center justify-between">
        <div className=" flex flex-col items-start mb-4">
          <PageTitle titleText="Create Shipment Notice" />
          {/* <NavigationPan list={pan} /> */}
        </div>

        <div className="flex justify-between items-center space-x-4">
          {/* <CommonButton
            titleText="Shipment List"
            onClick={shipmentList}
            color="bg-midGreen"
            width="w-32"
            height="h-8"
          /> */}

          <CommonButton
            titleText="Back"
            onClick={back}
            color="bg-midGreen"
            width="w-20"
            height="h-8"
          />
        </div>
      </div>

      {/* <div className="h-4"></div> */}

      <div className="w-full flex">
        {/* <h3 className="text-lg font-semibold">Shipping Form</h3> */}

        {/* <CommonButton
          titleText="Shipment List"
          onClick={shipmentList}
          color="bg-midGreen"
          width="w-32"
          height="h-8"
        /> */}
      </div>

      <div className=" grayCard p-4 w-full flex items-start justify-between mb-8">
        <div className="w-full space-y-2">
          <div className="flex space-x-3 w-full">
            <p className="w-28 text-black text-sm font-mon">Shipping From <span className="text-red-500">*</span></p>
            <div className="space-y-2">
              {/* <p className=" text-midBlack font-mon font-medium text-sm">
                ABC Supplier Inc.
              </p>
              <p className="text-midBlack font-mon font-medium text-sm">
                Lorem ipsum dolor sit, Bangladesh
              </p> */}

              <div className="w-full flex justify-between items-start">
                <div className="">
                  {/* <InputLebel titleText={"Site"} /> */}
                  <CommonDropDownSearch
                    placeholder="Select Sites"
                    onChange={handleSiteChange}
                    value={siteView}
                    options={convertedSiteList}
                    width="w-56"
                    // disable={isDisable}
                    isMutiSelect={false}
                    maxSelections={1}
                  />
                  <p className="mb-1"></p>
                  {shipmentError.siteId && (
                    <ValidationError title={shipmentError.siteId} />
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3 w-full items-center">
            <p className="w-28 text-black text-sm font-mon">Organization</p>

            <p className="font-semibold">{singlePo?.OU_NAME}</p>
          </div>
        </div>
        <div className="flex space-x-3 w-full">
          <p className=" text-black text-sm font-mon">Deliver to</p>
          <div className=" space-y-2">
            <p className=" text-midBlack font-mon font-medium text-sm">
              {/* {rfqHeaderDetails?.details.BILL_TO_LOCATION_NAME} */}
              {rfqHeaderDetails?.details.SHIP_TO_LOCATION_NAME}
            </p>
            {/* <p className="text-midBlack font-mon font-medium text-sm">
              {rfqHeaderDetails?.details.SHIP_TO_LOCATION_NAME}
            </p> */}
          </div>
        </div>
      </div>
      <div className="grayCard p-4 w-full flex items-start justify-between mb-8">
        <div className=" flex-1 space-y-6">
          <div>
            <div className=" w-full flex space-x-4 items-center">
              <p className="w-28 text-black text-sm font-mon">
                Shipping date
                <span className="text-red-500"> *</span>
              </p>
              <div className=" flex-1">
                <DateRangePicker
                  placeholder="Select date"
                  value={ShippingDate}
                  onChange={handleShippingDateChange}
                  width="w-full"
                  useRange={false}
                  signle={true}
                />
              </div>
            </div>

            <p className="mb-1"></p>
            <div className="h-3">
              {shipmentError.convertedShippingDate && (
                <ValidationError title={shipmentError.convertedShippingDate} />
              )}
            </div>
          </div>
          <div className="w-full  flex space-x-4 items-center">
            <p className="w-28 text-black text-sm font-mon">LC Number</p>
            <div className=" flex-1">
              <CommonInputField
                inputRef={lcNumberRef}
                onChangeData={handlelcNumberChange}
                hint="Enter LC number"
                type="text"
                width="w-full"
              />
            </div>
          </div>
          <div className="w-full  flex space-x-4 items-center">
            <p className="w-28 text-black text-sm font-mon">
              Delivery Challan Number
            </p>
            <div className=" flex-1">
              <CommonInputField
                inputRef={deliveryChallanNumberRef}
                onChangeData={handleDeliveryChallanNumberChange}
                hint="Enter challan number"
                type="text"
                width="w-full"
              />
            </div>
          </div>
        </div>
        <div className=" w-4"></div>
        <div className=" flex-1 space-y-6">
          <div>
            <div className=" w-full flex space-x-4 items-center">
              <p className="w-28 text-black text-sm font-mon">
                Estimated Delivery Date
                <span className="text-red-500"> *</span>
              </p>
              <div className=" flex-1">
                <DateRangePicker
                  placeholder="Select date"
                  value={estDeliveryDate}
                  onChange={handleEstDeliveryDateChange}
                  useRange={false}
                  signle={true}
                  width="w-full"
                />
              </div>
            </div>

            <p className="mb-1"></p>
            <div className="h-3">
              {shipmentError.convertedEstDeliveryDate && (
                <ValidationError title={shipmentError.convertedEstDeliveryDate} />
              )}
            </div>
          </div>
          <div className="w-full  flex space-x-4 items-center">
            <p className="w-28 text-black text-sm font-mon">
              BL/Challan Number
            </p>
            <div className=" flex-1">
              <CommonInputField
                inputRef={blChallanNumberRef}
                onChangeData={handleBlChalanNumberChange}
                hint="Enter BL/challan number"
                type="text"
                width="w-full"
              />
            </div>
          </div>
        </div>
        <div className=" w-4"></div>
        <div className=" flex-1 space-y-4">
          <div className=" w-full flex space-x-4 items-center">
            <p className="w-24 text-black text-sm font-mon">Attachment</p>
            <div className=" flex-1">
              <FilePickerInput
                onFileSelect={handleAttachment}
                mimeType=".pdf, image/*"
                initialFileName={attachmentFileName!}
                maxSize={5 * 1024 * 1024}
                width="w-[186px]"
                fontSize="text-[12px]"
                widthBlack="w-20"
              />
            </div>
          </div>

          <div className="h-2"></div>
          <div className="w-full  flex space-x-4 items-center">
            <p className="w-24 text-black text-sm font-mon">
              Vat Challan Number
            </p>
            <div className=" flex-1">
              <CommonInputField
                inputRef={vatChallanNumberRef}
                onChangeData={handleVatChallanNumberChange}
                hint="Enter vat challan number"
                type="text"
                width="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className=" w-full flex justify-center items-center">
          <LogoLoading />
        </div>
      ) : !isLoading && itemList.length === 0 ? (
        <NotFoundPage />
      ) : (
        <div className="overflow-auto max-h-[400px] rounded-lg shadow-lg custom-scrollbar">
          <table className="min-w-full divide-y divide-gray-200 rounded-lg">
            <thead className="bg-[#CAF4FF] sticky top-0 ">
              <tr>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  <button
                    onClick={() => {
                      isSelectAll ? unSelectAll() : selectAll();
                    }}
                    className={`${
                      isSelectAll
                        ? "bg-midGreen "
                        : "bg-whiteColor border-[1px] border-borderColor"
                    } rounded-[4px] w-4 h-4 flex justify-center items-center`}
                  >
                    <img
                      src="/images/check.png"
                      alt="check"
                      className=" w-2 h-2"
                    />
                  </button>
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Sl
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  PO No.
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  LCM
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Item Description
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Award Quantity
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Shipped Quantity
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Shipping Quantity <span className="text-red-500">*</span>
                </th>
              </tr>
            </thead>

            {itemList.map((e, i) => (
              <tbody
                key={e.CS_LINE_ID}
                className="bg-white divide-y divide-gray-200"
              >
                <tr>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      <button
                        onClick={() => {
                          toggleItemSelection(e);
                        }}
                        className={`${
                          selectedItemList.some(
                            (emp) => emp.CS_LINE_ID === e.CS_LINE_ID
                          )
                            ? "bg-midGreen "
                            : "bg-whiteColor border-[1px] border-borderColor"
                        } rounded-[4px] w-4 h-4 flex justify-center items-center`}
                      >
                        <img
                          src="/images/check.png"
                          alt="check"
                          className=" w-2 h-2"
                        />
                      </button>
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {i + 1}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar ">
                    <div className="w-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                      {poNumberInStore}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar text-center">
                    <div className=" flex flex-row space-x-2 justify-center items-center">
                      <button
                        // onClick={() => {
                        //   handleLcmEnable(i);
                        // }}
                        className={` h-4 w-4  rounded-md ${
                          e.LCM_ENABLE_FLAG === "Y"
                            ? "border-none bg-midGreen"
                            : "border-[0.1px] border-borderColor bg-white"
                          } flex justify-center items-center cursor-default`}
                      >
                        <img
                          src="/images/check.png"
                          alt="check"
                          className=" w-2 h-2"
                        />
                      </button>
                    </div>
                  </td>
                  <td className="overflow-auto text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    {e.ITEM_DESCRIPTION === "" ? "---" : e.ITEM_DESCRIPTION}
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {e.AWARD_QUANTITY === null ? "---" : e.AWARD_QUANTITY}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {e.SHIPPING_QUANTITY === "" ? "---" : e.SHIPPING_QUANTITY}  
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      <CommonInputField
                        // disable={
                        //   itemList[i].OFFERED_QUANTITY <
                        //   parseInt(shippingQuantityList[i])
                        //     ? true
                        //     : false
                        // }
                        type="text"
                        width="w-44"
                        hint="Enter Quantity"
                        maxCharacterlength={150}
                        onChangeData={(value) =>
                          handleShippingQuantity(value, i)
                        }
                        inputRef={{
                          current: shippingQuantityRefs.current[i],
                        }}
                        value={newShippingValueList[i] || ""}
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            ))}

            <tfoot className="bg-white sticky bottom-0">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center">
                  {/* <button
                    disabled={localPageNo === 1 ? true : false}
                    onClick={previous}
                    className=" px-4 py-2 rounded-md flex space-x-2 items-center shadow-md border-[0.5px] border-borderColor "
                  >
                    <div className="w-4 h-4 ">
                      <ArrowLeftIcon className=" w-full h-full " />
                    </div>
                    <p className=" text-sm">Previous</p>
                  </button> */}
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center">
                  {/* <button
                    disabled={localPageNo === total ? true : false}
                    onClick={next}
                    className=" px-4 py-2 rounded-md flex space-x-2 items-center shadow-md border-[0.5px] border-borderColor "
                  >
                    <p className=" text-sm">Next</p>
                    <div className="w-4 h-4 ">
                      <ArrowRightIcon className=" w-full h-full " />
                    </div>
                  </button> */}
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
      <div className=" my-20 w-full flex justify-end items-end">
        {isConfirmLoading ? (
          <div className=" w-48 flex justify-center items-center">
            <CircularProgressIndicator />
          </div>
        ) : (
          <div className={`${selectedItemList.length === 0 ? "opacity-50" : ""}`}>
            <CommonButton
              onClick={confirmShipment}
              titleText="Confirm Shipment"
              color="bg-midGreen"
              width="w-48"
              height="h-8"
              disable={selectedItemList.length === 0}
            />
          </div>
        )}
      </div>
    </div>
  );
}
