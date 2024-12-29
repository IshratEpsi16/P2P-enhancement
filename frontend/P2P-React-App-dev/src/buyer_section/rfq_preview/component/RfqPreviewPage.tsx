// import React, { useEffect, useState } from "react";
// import PageTitle from "../../../common_component/PageTitle";
// import InputLebel from "../../../common_component/InputLebel";
// import CommonButton from "../../../common_component/CommonButton";
// import { useRfqCreateProcessContext } from "../../../buyer_rfq_create/context/RfqCreateContext";
// import usePrItemsStore from "../../pr/store/prItemStore";
// import convertDateFormat from "../../../utils/methods/convertDateFormat";
// import isoToDateTime from "../../../utils/methods/isoToDateTime";
// import { useAuth } from "../../../login_both/context/AuthContext";
// import useAuthStore from "../../../login_both/store/authStore";
// import RfqCreateService from "../../buyer_term/service/RfqCreateService";
// import { showErrorToast } from "../../../Alerts_Component/ErrorToast";
// import SelectedPrItemInterface from "../../pr_item_list/interface/selectedPritemInterface";
// import SaveLineItemToService from "../../buyer_term/service/SavelineItemsToRfqService";
// import InviteSupplierForRfqService from "../../invite_supplier_for_rfq/service/InviteSupplierForRfqService";
// import SelectedSupplierInterface from "../../invite_supplier_for_rfq/interface/SelectedSupplierInterface";
// import CircularProgressIndicator from "../../../Loading_component/CircularProgressIndicator";
// import SuccessToast, {
//   showSuccessToast,
// } from "../../../Alerts_Component/SuccessToast";
// import LocationListService from "../../buyer_term/service/LocationListService";
// import LocationInterface from "../../buyer_term/interface/LocationListInterface";
// import FreightTermService from "../../buyer_term/service/FreightTermService";
// import FreightTermInterface from "../../buyer_term/interface/FreightTermInterface";
// import PaymentTermService from "../../buyer_term/service/PaymentTermServie";
// import PaymentTermInterface from "../../buyer_term/interface/PaymentTermInterface";
// import InvoiceTypeListService from "../../buyer_term/service/InvoiceTypeService";
// import InvoiceTypeInterface from "../../buyer_term/interface/InvoiceTypeInterface";
// import UpdateLineItemToRfqService from "../../buyer_term/service/UpdateLineitemsToRfqService";
// import PrItemInterface from "../../pr_item_list/interface/PrItemInterface";
// import RfqHeaderUpdateService from "../../buyer_term/service/RfqHeaderUpdateService";
// import SupplierInterface from "../../invite_supplier_for_rfq/interface/SupplierInterface";
// import RfqEditPermissionService from "../service/RfqEditPermissionService";
// const list = [1, 1, 1, 1, 11, 1, 1, 1, 1, 11, 1, 1, 1, 1];
// interface LocationFromOracle {
//   value: string;
//   label: string;
// }

// interface FreightTermFromOracle {
//   value: string;
//   label: string;
// }
// export default function RfqPreviewPage() {
//   useEffect(() => {
//     setPreviouslyInvitedSupplierList(rfqDetailsInStore?.supplier_list!);
//     getLocation();
//     getFreightTerm();
//     getPaymentTerm();
//     getInvoiceType();
//   }, []);

//   const [locationList, setLocationList] = useState<LocationFromOracle[]>([]);

//   const [locationBillTo, setLocationBillTo] =
//     useState<LocationFromOracle | null>(null);
//   const [locationShipTo, setLocationShipTo] =
//     useState<LocationFromOracle | null>(null);

//   const [billToAddress, setBillToAddress] = useState<string>("");
//   const [shipToAddress, setShipToAddress] = useState<string>("");

//   const getLocation = async () => {
//     console.log(billToAddressInStore);
//     console.log(shipToAddressInStore);

//     try {
//       const result = await LocationListService(token!);
//       console.log(result.data);

//       if (result.data.status === 200) {
//         // const transformedData = result.data.data.map(
//         //   (item: LocationInterface) => ({
//         //     value: item.LOCATION_ID,
//         //     label: item.LOCATION_CODE,
//         //   })
//         // );

//         // setLocationList(transformedData);

//         const findBillTo: LocationInterface | undefined = result.data.data.find(
//           (item: LocationInterface) =>
//             item.LOCATION_ID === parseInt(billToAddressInStore!)
//         );
//         console.log(findBillTo);

//         setBillToAddress(findBillTo?.LOCATION_CODE!);

//         let convertedBillTo: LocationFromOracle | undefined;

//         if (findBillTo) {
//           convertedBillTo = {
//             value: findBillTo.LOCATION_ID.toString(),
//             label: findBillTo.LOCATION_CODE,
//           };
//           setLocationBillTo(convertedBillTo);
//         }

//         const findShipTo: LocationInterface | undefined = result.data.data.find(
//           (item: LocationInterface) =>
//             item.LOCATION_ID === parseInt(shipToAddressInStore!)
//         );
//         console.log(findShipTo);

//         setShipToAddress(findShipTo?.LOCATION_CODE!);

//         let convertedShipTo: LocationFromOracle | undefined;

//         if (findShipTo) {
//           convertedShipTo = {
//             value: findShipTo.LOCATION_ID.toString(),
//             label: findShipTo.LOCATION_CODE,
//           };
//           setLocationShipTo(convertedShipTo);
//         }
//       }
//     } catch (error) {
//       showErrorToast("Currency location failed");
//     }
//   };

//   //freight term
//   //freight term
//   const [freightTermFromoracle, setFreightTermFromoracle] = useState<
//     FreightTermFromOracle[] | []
//   >([]);
//   // const [currencyFromOracle, setCurrencyFromOracle] =
//   //   useState<CurrencyFromOracle | null>(null);

//   const [freightTermName, setFreightTermName] = useState("");

//   const getFreightTerm = async () => {
//     try {
//       const result = await FreightTermService(token!);
//       console.log(result.data);

//       if (result.data.status === 200) {
//         const findFreightName: FreightTermInterface | undefined =
//           result.data.data.find(
//             (item: FreightTermInterface) =>
//               item.LOOKUP_CODE.toString() === freightTermInStore
//           );
//         setFreightTermName(findFreightName?.MEANING!);
//       } else {
//         showErrorToast(result.data.message);
//       }
//     } catch (error) {
//       showErrorToast("Freight term load failed");
//     }
//   };
//   //freight term

//   //payment term

//   const [paymentTermName, setPaymentTermName] = useState<string>("");

//   // const getPaymentTerm = async () => {
//   //   try {
//   //     const result = await PaymentTermService(token!);
//   //     console.log(result.data);

//   //     if (result.data.status === 200) {
//   //       const findPaymentName: PaymentTermInterface | undefined =
//   //         result.data.data.find(
//   //           (item: PaymentTermInterface) =>
//   //             item.TERM_ID.toString() === paymentTermInStore
//   //         );
//   //       console.log(paymentTermInStore);

//   //       console.log(findPaymentName);

//   //       setPaymentTermName(findPaymentName?.NAME!);
//   //     } else {
//   //       showErrorToast(result.data.message);
//   //     }
//   //   } catch (error) {
//   //     showErrorToast("Freight term load failed");
//   //   }
//   // };

//   const getPaymentTerm = async () => {
//     try {
//       const result = await PaymentTermService(token!);
//       console.log("Response from PaymentTermService:", result.data);

//       if (result.data.status === 200) {
//         const findPaymentName: PaymentTermInterface | undefined =
//           result.data.data.find(
//             (item: PaymentTermInterface) =>
//               item.TERM_ID === parseInt(paymentTermInStore!, 10)
//           );

//         console.log("Payment Term ID in Store:", paymentTermInStore);
//         console.log("Found Payment Term:", findPaymentName);

//         if (findPaymentName) {
//           setPaymentTermName(findPaymentName.NAME);
//         } else {
//           console.log("Payment term not found!");
//           // Handle case when payment term is not found
//         }
//       } else {
//         showErrorToast(result.data.message);
//       }
//     } catch (error) {
//       console.error("Error occurred while fetching payment terms:", error);
//       showErrorToast("Freight term load failed");
//     }
//   };

//   //payment term

//   //invoice term

//   const [invoiceName, setInvoiceName] = useState<string>("");

//   const getInvoiceType = async () => {
//     try {
//       const result = await InvoiceTypeListService(token!);
//       console.log(result.data);

//       if (result.data.status === 200) {
//         const findInvoiceName: InvoiceTypeInterface | undefined =
//           result.data.data.find(
//             (item: InvoiceTypeInterface) =>
//               item.LOOKUP_CODE.toString() === invoiceTypeInstore
//           );
//         setInvoiceName(findInvoiceName?.MEANING!);
//       } else {
//         showErrorToast(result.data.message);
//       }
//     } catch (error) {
//       showErrorToast("Invoice type load failed");
//     }
//   };

//   //invoice term

//   //store
//   const {
//     headerAttachment,
//     prItems,
//     prItems2,
//     totalprItemNumberInStore,
//     rfqTitleInStore,
//     rfqSubjectInStore,
//     rfqOpenDateInStore,
//     rfqCloseDateInStore,
//     rfqTypeInStore,
//     needByDateInStore,
//     freightTermInStore,
//     paymentTermInStore,
//     fobInStore,
//     buyerAttachmentInStore,
//     currencyInStore,
//     etrInStore,
//     billToAddressInStore,
//     shipToAddressInStore,
//     invoiceTypeInstore,
//     vatApplicableStatusInStore,
//     vatPercentageInStore,
//     noteInStore,
//     selectedGeneralterm,
//     invitedSuppliers,
//     setInvitedSuppliers,
//     isCreateRfq,
//     rfqDetailsInStore,
//     rfqIdInStore,
//     rfqStatusInStore,
//     setRfqStatusInStore,
//     setRfqIdInStore,
//     setIsCreateRfq,
//     // freightTermNameInStore,
//     // paymentTermNameInStore,
//     // invoiceTypeNameInstore,
//   } = usePrItemsStore();
//   //store

//   const [previouslyInvitedSupplierList, setPreviouslyInvitedSupplierList] =
//     useState<SupplierInterface[] | []>([]);

//   //auth context
//   const { token } = useAuth();
//   //auth context
//   const back = () => {
//     previousPage();
//     setRfqStatusInStore("");
//   };

//   //publish api
//   const [isLoaing, setIsLoading] = useState<boolean>(false);
//   const publish = async () => {
//     if (rfqStatusInStore === "SUBMIT") {
//       updateRfq();
//     } else {
//       try {
//         setIsLoading(true);
//         const result = await RfqCreateService(
//           token!,

//           rfqSubjectInStore!,
//           rfqTitleInStore!,
//           rfqTypeInStore!,
//           needByDateInStore!,
//           rfqOpenDateInStore!,
//           rfqCloseDateInStore!,
//           etrInStore!,
//           headerAttachment,
//           // headerMime,
//           // headerAttachmentFileName!,
//           currencyInStore!,
//           parseInt(billToAddressInStore!),
//           parseInt(shipToAddressInStore!),
//           "SUBMIT",
//           vatPercentageInStore!,
//           vatApplicableStatusInStore!,
//           buyerAttachmentInStore,
//           selectedGeneralterm!,
//           //new add
//           freightTermInStore!,
//           parseInt(paymentTermInStore!),
//           invoiceTypeInstore!,
//           noteInStore!
//         );
//         console.log(result.data);

//         if (result.data.status === 200) {
//           let rfqId = result.data.rfq_id;
//           console.log(result.data);

//           for (let i = 0; i < prItems.length; i++) {
//             console.log(rfqId);
//             console.log(prItems[i]);

//             saveLineItemToRfq(rfqId, prItems[i]);
//           }

//           // if (!isCreateRfq) {
//           //   for (let i = 0; i < prItems2.length; i++) {
//           //     // console.log(rfqId);
//           //     // console.log(prItems2[i]);

//           //     updateLineItemToRfq(rfqIdInStore!, prItems2[i]);
//           //   }
//           // }
//           inviteSupplierToRfq(
//             rfqId,
//             rfqTypeInStore!,
//             rfqCloseDateInStore!,
//             invitedSuppliers
//           );
//           setIsLoading(false);
//           setRfqStatusInStore("");
//           showSuccessToast("Rfq Published Successfully");
//           setRfqIdInStore(null);
//           setIsCreateRfq(false);
//           setRfqStatusInStore("");
//           setPage(1);
//         } else {
//           setIsLoading(false);
//           showErrorToast(result.data.message);
//         }
//       } catch (error) {
//         setIsLoading(false);
//         showErrorToast("Rfq publish Failed");
//       }
//     }
//   };

//   //update Rfq
//   const updateRfq = async () => {
//     try {
//       const result = await RfqHeaderUpdateService(
//         token!,

//         rfqIdInStore!,
//         rfqSubjectInStore!,
//         rfqTitleInStore!,
//         rfqTypeInStore!,
//         needByDateInStore!,
//         rfqOpenDateInStore!,
//         rfqCloseDateInStore!,
//         etrInStore!,
//         headerAttachment,
//         // headerMime,
//         // headerAttachmentFileName!,
//         currencyInStore!,
//         parseInt(billToAddressInStore!),
//         parseInt(shipToAddressInStore!),
//         "SUBMIT",
//         vatPercentageInStore!,
//         vatApplicableStatusInStore!,
//         buyerAttachmentInStore,
//         selectedGeneralterm!,
//         //new add
//         freightTermInStore!,
//         parseInt(paymentTermInStore!),
//         invoiceTypeInstore!,
//         noteInStore!

//         // fob
//       );
//       console.log(result.data);

//       if (result.data.status === 200) {
//         // showSuccessToast(result.data.message);
//         console.log(result.data);
//         inviteSupplierToRfq(
//           rfqIdInStore!,
//           rfqTypeInStore!,
//           rfqCloseDateInStore!,
//           invitedSuppliers
//         );
//         setIsLoading(false);
//         showSuccessToast("Rfq Published Successfully");
//         setRfqIdInStore(null);
//         setRfqStatusInStore("");
//         setIsCreateRfq(false);
//         setPage(1);
//       } else {
//         showErrorToast(result.data.message);
//       }
//     } catch (error) {
//       console.log(error);

//       showErrorToast("Update Failed. Try Again");
//     }
//   };
//   //update Rfq

//   //update rfq item
//   const updateLineItemToRfq = async (
//     rfqId: number,
//     pritem: PrItemInterface
//   ) => {
//     try {
//       const result = await UpdateLineItemToRfqService(token!, rfqId, pritem);
//       console.log(result.data);

//       if (result.data.status === 200) {
//       } else {
//       }
//     } catch (error) {
//       console.log(error);
//       showErrorToast("Line Update Failed");
//     }
//   };
//   //update rfq item

//   //SaveLineItemToService
//   const saveLineItemToRfq = async (
//     rfqId: number,
//     pritem: PrItemInterface //SelectedPrItemInterface silo
//   ) => {
//     try {
//       const result = await SaveLineItemToService(token!, rfqId, pritem);
//       console.log(result.data);

//       if (result.data.status === 200) {
//       } else {
//       }
//     } catch (error) {
//       console.log(error);
//       showErrorToast("Rfq Save Failed");
//     }
//   };
//   //SaveLineItemToService

//   //INVITE SUPPLIER
//   const inviteSupplierToRfq = async (
//     rfqId: number,
//     RFQ_TYPE: string,
//     CLOSE_DATE: string,
//     invitedSuppliers: SelectedSupplierInterface[]
//   ) => {
//     try {
//       const result = await InviteSupplierForRfqService(
//         token!,
//         rfqId,
//         RFQ_TYPE,
//         CLOSE_DATE,
//         invitedSuppliers
//       );
//       console.log(result.data);

//       if (result.data.status === 200) {
//       } else {
//       }
//     } catch (error) {
//       console.log(error);
//       showErrorToast("Invite Supplier Failed");
//     }
//   };

//   //INVITE SUPPLIER

//   //context
//   const { page, setPage } = useRfqCreateProcessContext();
//   // const submitAndNext = () => {
//   //     setPage(6);
//   // }
//   const previousPage = () => {
//     setPage(4);
//   };

//   //context
//   const { loggedInUserName } = useAuthStore();
//   //context

//   const convertTo12HourFormat = (timestamp: string): string => {
//     const date = new Date(timestamp);
//     const hours = date.getHours();
//     const minutes = date.getMinutes();
//     const seconds = date.getSeconds();
//     const ampm = hours >= 12 ? "PM" : "AM";
//     const formattedHours = hours % 12 || 12; // Handle 0 hour
//     const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
//     const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
//     return `${date.getDate()}-${date.toLocaleString("default", {
//       month: "short",
//     })}-${date
//       .getFullYear()
//       .toString()
//       .slice(
//         2
//       )} ${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
//   };

//   function convertToTSXFormat(dateTimeString: string): string {
//     const dateTime = new Date(dateTimeString);
//     const year = dateTime.getFullYear().toString().slice(-2);
//     const month = getMonthAbbreviation(dateTime.getMonth() + 1);
//     const day = dateTime.getDate().toString().padStart(2, "0");
//     return `${day}-${month}-${year}`;
//   }

//   function getMonthAbbreviation(month: number): string {
//     const monthsAbbreviations = [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//     ];
//     return monthsAbbreviations[month - 1];
//   }

//   const handleCanEdit = (index: number) => {
//     const newPreviouslySelectedSupplierList = [
//       ...previouslyInvitedSupplierList,
//     ];
//     newPreviouslySelectedSupplierList[index].CAN_EDIT =
//       newPreviouslySelectedSupplierList[index].CAN_EDIT === 0 ? 1 : 0;
//     console.log("can edit", newPreviouslySelectedSupplierList[index].CAN_EDIT);
//     changePermission(
//       newPreviouslySelectedSupplierList[index].USER_ID,
//       newPreviouslySelectedSupplierList[index].CAN_EDIT!
//     );

//     // setPrItemList(newPrItemList);
//     setPreviouslyInvitedSupplierList(newPreviouslySelectedSupplierList);
//   };

//   const changePermission = async (supplierId: number, canEdit: number) => {
//     try {
//       const result = await RfqEditPermissionService(
//         token!,
//         rfqIdInStore!,
//         supplierId,
//         canEdit
//       );

//       if (result.data.status === 200) {
//         showSuccessToast(result.data.message);
//       } else {
//         showErrorToast(result.data.message);
//       }
//     } catch (error) {
//       showErrorToast("Edit Permission Change Failed");
//     }
//   };

//   return (
//     <div className=" m-8">
//       <SuccessToast />
//       <div className=" w-full py-10 px-4 bg-inputBg shadow-sm rounded-md ">
//         <PageTitle titleText="Preview" />
//         <div className="h-4"></div>
//         <InputLebel titleText={"Header"} />
//         <div className=" h-4"></div>
//         <div className=" p-4 w-full bg-whiteColor border-[0.5px] border-borderColor rounded-md">
//           <div className=" flex flex-row space-x-12  items-center">
//             <div className=" w-28 text-sm font-mon text-graishColor font-medium">
//               Rfq Title
//             </div>
//             <div className=" w-52 text-sm font-mon text-blackColor font-medium">
//               {rfqTitleInStore}
//             </div>
//             <div className=" w-36 text-sm font-mon text-graishColor font-medium">
//               Open Date
//             </div>
//             <div className=" w-52 text-sm font-mon text-blackColor font-medium flex flex-row space-x-4 items-center">
//               <div>{convertTo12HourFormat(rfqOpenDateInStore!)}</div>
//             </div>
//           </div>
//           <div className="h-3"></div>
//           <div className=" flex flex-row space-x-12  items-center">
//             <div className=" w-28 text-sm font-mon text-graishColor font-medium">
//               Rfq Subject
//             </div>
//             <div className=" w-52 text-sm font-mon text-blackColor font-medium">
//               {rfqSubjectInStore}
//             </div>
//             <div className=" w-36 text-sm font-mon text-graishColor font-medium">
//               Close Date
//             </div>
//             <div className=" w-52 text-sm font-mon text-blackColor font-medium flex flex-row space-x-4 items-center">
//               <div>{convertTo12HourFormat(rfqCloseDateInStore!)}</div>
//               {/* <div>11:00 AM</div> */}
//             </div>
//           </div>
//           <div className="h-3"></div>
//           <div className=" flex flex-row space-x-12  items-center">
//             <div className=" w-28 text-sm font-mon text-graishColor font-medium">
//               Prepared By
//             </div>
//             <div className=" w-52 text-sm font-mon text-blackColor font-medium">
//               {loggedInUserName}
//             </div>
//             <div className=" w-36 text-sm font-mon text-graishColor font-medium">
//               Type
//             </div>
//             <div className=" w-52 text-sm font-mon text-blackColor font-medium flex flex-row space-x-4 items-center">
//               <div className=" flex-1 flex flex-row space-x-2 items-center">
//                 <div
//                   className={`${
//                     rfqTypeInStore === "T"
//                       ? " bg-midGreen"
//                       : " border-[1px] border-borderColor "
//                   } rounded-[4px] h-4 w-4 flex justify-center items-center`}
//                 >
//                   <img
//                     src="/images/check.png"
//                     alt="check"
//                     className=" w-2 h-2"
//                   />
//                 </div>
//                 <p>Technical</p>
//               </div>
//               <div className=" flex-1 flex flex-row space-x-2 items-center">
//                 <div
//                   className={`${
//                     rfqTypeInStore === "B"
//                       ? " bg-midGreen"
//                       : " border-[1px] border-borderColor "
//                   } rounded-[4px] h-4 w-4 flex justify-center items-center`}
//                 >
//                   <img
//                     src="/images/check.png"
//                     alt="check"
//                     className=" w-2 h-2"
//                   />
//                 </div>
//                 <p>Both</p>
//               </div>
//               {/* <div>11:00 AM</div> */}
//             </div>
//           </div>
//           <div className="h-3"></div>
//           <div className=" flex flex-row space-x-12  items-center">
//             <div className=" w-28 text-sm font-mon text-graishColor font-medium">
//               Need by date
//             </div>
//             <div className=" w-52 text-sm font-mon text-blackColor font-medium">
//               {convertToTSXFormat(needByDateInStore!)}
//             </div>
//             <div className=" w-36 text-sm font-mon text-graishColor font-medium">
//               Attachment
//             </div>
//             <div className=" w-52 text-sm font-mon text-blackColor font-medium flex flex-row space-x-4 items-center">
//               <div>
//                 {headerAttachment?.name === undefined
//                   ? "N/A"
//                   : headerAttachment?.name}
//               </div>
//               {/* <div>11:00 AM</div> */}
//             </div>
//           </div>
//         </div>
//         <div className="h-4"></div>
//         <InputLebel titleText={"Buyer Terms"} />
//         <div className=" h-4"></div>
//         <div className=" border-[1px] border-borderColor p-8 rounded-md shadow-sm bg-inputBg w-full   items-start space-y-6 ">
//           <div className=" w-full flex flex-row justify-between items-center">
//             <div className="flex flex-row space-x-4 items-center">
//               <p className="w-36  text-grayColor text-sm font-medium font-mon">
//                 Freight Term
//               </p>
//               {freightTermName}
//             </div>
//             <div className="flex flex-row space-x-4 items-center">
//               <p className="w-28 text-grayColor text-sm font-medium font-mon ">
//                 Payment Term
//               </p>

//               <div className=" w-72">{paymentTermName}</div>
//             </div>
//           </div>
//           <div className=" w-full flex flex-row justify-between items-center">
//             <div className="flex flex-row space-x-4 items-center">
//               <p className="w-36  text-grayColor text-sm font-medium font-mon">
//                 FOB
//               </p>
//               {fobInStore === "" ? "N/A" : fobInStore}
//             </div>
//             <div className="flex flex-row space-x-4 items-center">
//               <p className="w-28 text-grayColor text-sm font-medium font-mon ">
//                 Attachment
//               </p>

//               <div className=" w-72">
//                 {buyerAttachmentInStore?.name === undefined
//                   ? "N/A"
//                   : buyerAttachmentInStore?.name}
//               </div>
//             </div>
//           </div>
//           <div className=" w-full flex flex-row justify-between items-center">
//             <div className="flex flex-row space-x-4 items-center">
//               <p className="w-36  text-grayColor text-sm font-medium font-mon">
//                 Curreny
//               </p>
//               {currencyInStore}
//             </div>
//             <div className="flex flex-row space-x-4 items-center">
//               <p className="w-28 text-grayColor text-sm font-medium font-mon ">
//                 ETR
//               </p>

//               <div className=" w-72">{convertToTSXFormat(etrInStore!)}</div>
//             </div>
//           </div>
//           <div className=" w-full flex flex-row justify-between items-center">
//             <div className="flex flex-row space-x-4 items-center">
//               <p className="w-36  text-grayColor text-sm font-medium font-mon">
//                 Bill To Address
//               </p>
//               {billToAddress}
//             </div>
//             <div className="flex flex-row space-x-4 items-center">
//               <p className="w-28 text-grayColor text-sm font-medium font-mon ">
//                 Ship To Address
//               </p>

//               <div className=" w-72">{shipToAddress}</div>
//             </div>
//           </div>

//           <div className="w-full flex flex-row justify-between items-center">
//             <div className="flex flex-row space-x-4 items-center">
//               <p className="w-36 text-grayColor text-sm font-medium font-mon">
//                 Invoice Type
//               </p>
//               {invoiceName}
//             </div>
//             <div className="flex flex-row space-x-4 items-center">
//               <p className="w-28 text-grayColor text-sm font-medium font-mon">
//                 VAT Applicable
//               </p>
//               <div className=" w-72">
//                 <button
//                   className={`w-4 h-4 rounded-md border-[0.5px] border-borderColor flex justify-center items-center ${
//                     vatApplicableStatusInStore === "Y"
//                       ? "bg-midGreen border-none"
//                       : null
//                   }`}
//                 >
//                   {vatApplicableStatusInStore === "Y" ? (
//                     <img
//                       src="/images/check.png"
//                       alt="check"
//                       className=" w-2 h-2"
//                     />
//                   ) : null}
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div className=" w-full flex flex-row justify-between items-center">
//             <div className="flex flex-row space-x-4 items-center">
//               <p className="w-36  text-grayColor text-sm font-medium font-mon"></p>
//               <p></p>
//             </div>
//             <div className="flex flex-row space-x-4 items-center">
//               <p className="w-28 text-grayColor text-sm font-medium font-mon ">
//                 VAT
//               </p>

//               <div className=" w-72">{vatPercentageInStore}%</div>
//             </div>
//           </div>
//         </div>

//         {/* <div className=" p-4 w-full bg-whiteColor border-[0.5px] border-borderColor rounded-md">
//           <div className=" flex flex-row space-x-12  items-center">
//             <div className=" w-28 text-sm font-mon text-graishColor font-medium">
//               Bill to Address
//             </div>
//             <div className=" w-52 text-sm font-mon text-blackColor font-medium">
//               address dsve rt rthtrhth 4h 445 4h4 4
//             </div>
//             <div className=" w-36 text-sm font-mon text-graishColor font-medium">
//               Currency
//             </div>
//             <div className=" w-52 text-sm font-mon text-blackColor font-medium flex flex-row space-x-4 items-center">
//               BDT
//             </div>
//           </div>
//           <div className="h-3"></div>
//           <div className=" flex flex-row space-x-12  items-center">
//             <div className=" w-28 text-sm font-mon text-graishColor font-medium">
//               Freight Term
//             </div>
//             <div className=" w-52 text-sm font-mon text-blackColor font-medium">
//               Sample Name here
//             </div>
//             <div className=" w-36 text-sm font-mon text-graishColor font-medium">
//               Close Date
//             </div>
//             <div className=" w-52 text-sm font-mon text-blackColor font-medium flex flex-row space-x-4 items-center">
//               img000979887.png
//             </div>
//           </div>
//           <div className="h-3"></div>
//           <div className=" flex flex-row space-x-12  items-center">
//             <div className=" w-28 text-sm font-mon text-graishColor font-medium">
//               FOB
//             </div>
//             <div className=" w-52 text-sm font-mon text-blackColor font-medium">
//               Sample Name here
//             </div>
//           </div>
//         </div> */}
//         <div className="h-4"></div>
//         <InputLebel titleText={"Note"} />
//         <div className=" h-4"></div>
//         <div className=" p-4 w-full bg-whiteColor border-[0.5px] border-borderColor rounded-md">
//           <p className="text-sm font-mon text-blackColor font-medium">
//             {!noteInStore ? "N/A" : noteInStore}
//           </p>
//         </div>
//         <div className="h-4"></div>
//         {isCreateRfq ? null : (
//           <div>
//             {rfqDetailsInStore?.supplier_list.length === 0 ? (
//               <div className=" w-full flex  justify-center items-center">
//                 <h1 className=" text-sm font-mon font-semibold text-midBlack">
//                   No Previous Supplier Found
//                 </h1>
//               </div>
//             ) : (
//               <div>
//                 <InputLebel titleText={"Previously Invited Supplier"} />
//                 <div className=" h-4"></div>

//                 <div className="overflow-x-auto">
//                   <table
//                     className="min-w-full divide-y divide-gray-200"
//                     style={{ tableLayout: "fixed" }}
//                   >
//                     <thead className="sticky top-0 bg-[#FFF5DB] h-14">
//                       <tr>
//                         <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  ">
//                           SL
//                         </th>
//                         <th className=" font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                           Supplier Name
//                         </th>
//                         <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                           Registration Id
//                         </th>

//                         <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                           Award Times
//                         </th>
//                         <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                           Last Award Date
//                         </th>

//                         <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                           Additional Contact Mail
//                         </th>
//                         <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                           RFQ Edit Permission
//                         </th>
//                       </tr>
//                     </thead>

//                     {rfqDetailsInStore?.supplier_list.length &&
//                       previouslyInvitedSupplierList.map((e, i) => (
//                         <tbody
//                           className="bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]"
//                           key={i}
//                         >
//                           <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap font-medium">
//                             {i + 1}
//                           </td>
//                           <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
//                             {e.SUPPLIER_NAME}
//                           </td>
//                           <td className="  font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
//                             {e.USER_ID}
//                           </td>

//                           <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
//                             N/A
//                           </td>
//                           <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
//                             N/A
//                           </td>

//                           <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
//                             {!e.ADDITIONAL_EMAIL ? "N/A" : e.ADDITIONAL_EMAIL}
//                           </td>
//                           <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
//                             <input
//                               onClick={() => {
//                                 handleCanEdit(i);
//                               }}
//                               type="checkbox"
//                               className="toggle toggle-success"
//                               checked={e.CAN_EDIT === 1 ? true : false}
//                             />
//                           </td>
//                         </tbody>
//                       ))}
//                   </table>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         <div className="h-4"></div>

//         {invitedSuppliers.length === 0 ? (
//           <div className=" w-full flex  justify-center items-center">
//             <h1 className=" text-sm font-mon font-semibold text-midBlack">
//               No Supplier Found
//             </h1>
//           </div>
//         ) : (
//           <div>
//             <InputLebel
//               titleText={`${
//                 !isCreateRfq ? "New Invited Supplier" : "Invited Supplier"
//               }`}
//             />
//             <div className=" h-4"></div>

//             <div className="overflow-x-auto">
//               <table
//                 className="min-w-full divide-y divide-gray-200"
//                 style={{ tableLayout: "fixed" }}
//               >
//                 <thead className="sticky top-0 bg-[#FFF5DB] h-14">
//                   <tr>
//                     <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  ">
//                       SL
//                     </th>
//                     <th className=" font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                       Supplier Name
//                     </th>
//                     <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                       Registration Id
//                     </th>
//                     {/* <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                       Suppliyer Type
//                     </th> */}
//                     <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                       Award Times
//                     </th>
//                     <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                       Last Award Date
//                     </th>

//                     <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                       Email
//                     </th>
//                     <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                       Additional Contact Mail
//                     </th>

//                     {/* Add more header columns as needed */}
//                   </tr>
//                 </thead>

//                 {/* Table rows go here */}
//                 {/* Table rows go here */}
//                 {invitedSuppliers.map((e, i) => (
//                   <tbody
//                     className="bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]"
//                     key={i}
//                   >
//                     <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap font-medium">
//                       {i + 1}
//                     </td>
//                     <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
//                       {e.SUPPLIER_NAME}
//                     </td>
//                     <td className="  font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
//                       {e.SUPPLIER_ID}
//                     </td>
//                     {/* <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
//                       not interface
//                     </td> */}
//                     <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
//                       N/A
//                     </td>
//                     <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
//                       N/A
//                     </td>

//                     <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
//                       {e.EMAIL}
//                     </td>
//                     <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
//                       {!e.ADDITIONAL_EMAIL ? "N/A" : e.ADDITIONAL_EMAIL}
//                     </td>
//                   </tbody>
//                 ))}
//               </table>
//             </div>
//           </div>
//         )}
//         <div>
//           {isCreateRfq ? null : prItems2.length === 0 ? (
//             <div className=" w-full flex justify-center items-center"></div>
//           ) : (
//             <>
//               <div className=" h-6"></div>
//               <InputLebel titleText={"Previously Selected Item"} />
//               <div className=" h-6"></div>
//               <div className="overflow-x-auto">
//                 <table
//                   className="min-w-full divide-y divide-gray-200"
//                   style={{ tableLayout: "fixed" }}
//                 >
//                   <thead className="sticky top-0 bg-[#F4F6F8] h-14">
//                     <tr>
//                       <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  ">
//                         SL
//                       </th>
//                       <th className=" font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                         PR No/Line No
//                       </th>
//                       <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                         Item description
//                       </th>
//                       <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                         Specification
//                       </th>
//                       {/* <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                         Brand Name
//                       </th> */}
//                       <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                         Expected Brand Name
//                       </th>
//                       <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                         warranty
//                       </th>
//                       <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                         UOM
//                       </th>
//                       <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                         Expected quantity
//                       </th>
//                       <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                         Need By date
//                       </th>
//                       <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                         Organization Name
//                       </th>
//                       <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                         Attachment
//                       </th>

//                       {/* Add more header columns as needed */}
//                     </tr>
//                   </thead>

//                   {/* Table rows go here */}
//                   {/* Table rows go here */}
//                   {prItems2.map((e, i) => (
//                     <tbody
//                       className="bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]"
//                       key={i}
//                     >
//                       <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap font-medium">
//                         {i + 1}
//                       </td>
//                       <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
//                         {`${e.PR_NUMBER}/${e.LINE_NUM}`}
//                       </td>
//                       <td className="  font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
//                         {!e.ITEM_DESCRIPTION ? "N/A" : e.ITEM_DESCRIPTION}
//                       </td>
//                       <td className=" w-64 font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  ">
//                         <div className=" w-64">
//                           {!e.ITEM_SPECIFICATION ? "N/A" : e.ITEM_SPECIFICATION}
//                         </div>
//                       </td>
//                       {/* <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
//                         {"not in interface"}
//                       </td> */}
//                       <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
//                         {"N/A"}
//                       </td>
//                       <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
//                         {e.WARRANTY_ASK_BY_BUYER === "Y"
//                           ? "Applicable"
//                           : "Not Applicable"}
//                       </td>
//                       <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
//                         {!e.UNIT_MEAS_LOOKUP_CODE
//                           ? "N/A"
//                           : e.UNIT_MEAS_LOOKUP_CODE}
//                       </td>
//                       <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
//                         {!e.EXPECTED_QUANTITY ? "N/A" : e.EXPECTED_QUANTITY}
//                       </td>
//                       <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
//                         {isoToDateTime(e.NEED_BY_DATE)}
//                       </td>
//                       <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
//                         {e.INVENTORY_ORG_NAME ? e.INVENTORY_ORG_NAME : "N/A"}
//                       </td>
//                       <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
//                         {!e.BUYER_FILE?.name ? "N/A" : e.BUYER_FILE?.name}
//                       </td>
//                     </tbody>
//                   ))}
//                 </table>
//               </div>
//             </>
//           )}
//         </div>
//         <div className="h-6"></div>
//         {prItems.length === 0 ? (
//           <div className=" w-full flex justify-center items-center">
//             {/* <h1 className=" text-sm font-mon font-semibold text-midBlack">
//               No Item Selected
//             </h1> */}
//           </div>
//         ) : (
//           <>
//             <div className=" mb-4">
//               <InputLebel
//                 titleText={`${
//                   !isCreateRfq ? "New selected Item" : "selected Item"
//                 }`}
//               />
//             </div>
//             <div className=" w-full flex flex-row items-center space-x-4">
//               <InputLebel titleText={`Selected ${prItems.length} Items`} />
//               <InputLebel
//                 titleText={`Non selected ${
//                   totalprItemNumberInStore! - prItems.length
//                 }  Items`}
//               />
//             </div>
//             <div className=" h-6"></div>
//             <div className="overflow-x-auto">
//               <table
//                 className="min-w-full divide-y divide-gray-200"
//                 style={{ tableLayout: "fixed" }}
//               >
//                 <thead className="sticky top-0 bg-[#F4F6F8] h-14">
//                   <tr>
//                     <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  ">
//                       SL
//                     </th>
//                     <th className=" font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                       PR No/Line No
//                     </th>
//                     <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                       Item description
//                     </th>
//                     <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                       Specification
//                     </th>
//                     {/* <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                       Brand Name
//                     </th> */}
//                     <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                       Expected Brand Name
//                     </th>
//                     <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                       warranty
//                     </th>
//                     <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                       UOM
//                     </th>
//                     <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                       Expected quantity
//                     </th>
//                     <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                       Need By date
//                     </th>
//                     <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                       Organization Name
//                     </th>
//                     <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
//                       Attachment
//                     </th>

//                     {/* Add more header columns as needed */}
//                   </tr>
//                 </thead>

//                 {/* Table rows go here */}
//                 {/* Table rows go here */}
//                 {prItems.map((e, i) => (
//                   <tbody
//                     className="bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]"
//                     key={i}
//                   >
//                     <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap font-medium">
//                       {i + 1}
//                     </td>
//                     <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
//                       {`${e.PR_NUMBER}/${e.LINE_NUM}`}
//                     </td>
//                     <td className="  font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
//                       {!e.ITEM_DESCRIPTION ? "N/A" : e.ITEM_DESCRIPTION}
//                     </td>
//                     <td className=" w-64 font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  ">
//                       <div className=" w-64">
//                         {!e.ITEM_SPECIFICATION ? "N/A" : e.ITEM_SPECIFICATION}
//                       </div>
//                     </td>
//                     {/* <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
//                       {"not in interface"}
//                     </td> */}
//                     <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
//                       {"N/A"}
//                     </td>
//                     <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
//                       {e.WARRANTY_ASK_BY_BUYER === "Y"
//                         ? "Applicable"
//                         : "Not Applicable"}
//                     </td>
//                     <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
//                       {!e.UNIT_MEAS_LOOKUP_CODE
//                         ? "N/A"
//                         : e.UNIT_MEAS_LOOKUP_CODE}
//                     </td>
//                     <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
//                       {!e.EXPECTED_QUANTITY ? "N/A" : e.EXPECTED_QUANTITY}
//                     </td>
//                     <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
//                       {isoToDateTime(e.NEED_BY_DATE)}
//                     </td>
//                     <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
//                       {e.INVENTORY_ORG_NAME ? e.INVENTORY_ORG_NAME : "N/A"}
//                     </td>
//                     <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
//                       {!e.BUYER_FILE?.name ? "N/A" : e.BUYER_FILE?.name}
//                     </td>
//                   </tbody>
//                 ))}
//               </table>
//             </div>
//           </>
//         )}
//         <div className="h-10"></div>
//         <div className=" flex flex-row justify-end items-end space-x-6">
//           <CommonButton
//             titleText={"Back"}
//             onClick={back}
//             width="w-32"
//             height="h-8"
//             color="bg-blackishColor"
//           />
//           {isLoaing ? (
//             <div className=" w-32 flex justify-center items-center">
//               <CircularProgressIndicator />
//             </div>
//           ) : (
//             <CommonButton
//               titleText={"Publish"}
//               onClick={publish}
//               width="w-32"
//               height="h-8"
//               color="bg-midGreen"
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import PageTitle from "../../../common_component/PageTitle";
import InputLebel from "../../../common_component/InputLebel";
import CommonButton from "../../../common_component/CommonButton";
import { useRfqCreateProcessContext } from "../../../buyer_rfq_create/context/RfqCreateContext";
import usePrItemsStore from "../../pr/store/prItemStore";
import convertDateFormat from "../../../utils/methods/convertDateFormat";
import isoToDateTime from "../../../utils/methods/isoToDateTime";
import { useAuth } from "../../../login_both/context/AuthContext";
import useAuthStore from "../../../login_both/store/authStore";
import RfqCreateService from "../../buyer_term/service/RfqCreateService";
import { showErrorToast } from "../../../Alerts_Component/ErrorToast";
import SelectedPrItemInterface from "../../pr_item_list/interface/selectedPritemInterface";
import SaveLineItemToService from "../../buyer_term/service/SavelineItemsToRfqService";
import InviteSupplierForRfqService from "../../invite_supplier_for_rfq/service/InviteSupplierForRfqService";
import SelectedSupplierInterface from "../../invite_supplier_for_rfq/interface/SelectedSupplierInterface";
import CircularProgressIndicator from "../../../Loading_component/CircularProgressIndicator";
import SuccessToast, {
  showSuccessToast,
} from "../../../Alerts_Component/SuccessToast";
import LocationListService from "../../buyer_term/service/LocationListService";
import LocationInterface from "../../buyer_term/interface/LocationListInterface";
import FreightTermService from "../../buyer_term/service/FreightTermService";
import FreightTermInterface from "../../buyer_term/interface/FreightTermInterface";
import PaymentTermService from "../../buyer_term/service/PaymentTermServie";
import PaymentTermInterface from "../../buyer_term/interface/PaymentTermInterface";
import InvoiceTypeListService from "../../buyer_term/service/InvoiceTypeService";
import InvoiceTypeInterface from "../../buyer_term/interface/InvoiceTypeInterface";
import UpdateLineItemToRfqService from "../../buyer_term/service/UpdateLineitemsToRfqService";
import PrItemInterface from "../../pr_item_list/interface/PrItemInterface";
import RfqHeaderUpdateService from "../../buyer_term/service/RfqHeaderUpdateService";
import SupplierInterface from "../../invite_supplier_for_rfq/interface/SupplierInterface";
import RfqEditPermissionService from "../service/RfqEditPermissionService";
import PreviouslySelectedSupplierInterface from "../interface/PreviouslySelectedSupplierInterface";
import DeleteIcon from "../../../icons/DeleteIcon";
import WarningModal from "../../../common_component/WarningModal";
import DeleteInviteSupplierService from "../service/DeleteInviteSupplierService";
import LogoLoading from "../../../Loading_component/LogoLoading";
import RfqDetailsService from "../../pr_item_list/service/RfqDetailsService";
import RfqSaveService from "../../buyer_term/service/RfqSaveService";
import SelectedSupplierUpdateInterface from "../../invite_supplier_for_rfq/interface/SelectedSupplierUpdateInterface";
import moment from "moment";
const list = [1, 1, 1, 1, 11, 1, 1, 1, 1, 11, 1, 1, 1, 1];
interface LocationFromOracle {
  value: string;
  label: string;
}

interface FreightTermFromOracle {
  value: string;
  label: string;
}
export default function RfqPreviewPage() {
  useEffect(() => {
    setPreviouslyInvitedSupplierList(rfqDetailsInStore?.supplier_list!);
    getLocation();
    getFreightTerm();
    getPaymentTerm();
    getInvoiceType();
  }, []);

  const [locationList, setLocationList] = useState<LocationFromOracle[]>([]);

  const [locationBillTo, setLocationBillTo] =
    useState<LocationFromOracle | null>(null);
  const [locationShipTo, setLocationShipTo] =
    useState<LocationFromOracle | null>(null);

  const [billToAddress, setBillToAddress] = useState<string>("");
  const [shipToAddress, setShipToAddress] = useState<string>("");

  const getLocation = async () => {
    console.log(billToAddressInStore);
    console.log(shipToAddressInStore);

    try {
      const result = await LocationListService(token!);
      console.log(result.data);

      if (result.data.status === 200) {
        // const transformedData = result.data.data.map(
        //   (item: LocationInterface) => ({
        //     value: item.LOCATION_ID,
        //     label: item.LOCATION_CODE,
        //   })
        // );

        // setLocationList(transformedData);

        const findBillTo: LocationInterface | undefined = result.data.data.find(
          (item: LocationInterface) =>
            item.LOCATION_ID === parseInt(billToAddressInStore!)
        );
        console.log(findBillTo);

        setBillToAddress(findBillTo?.LOCATION_CODE!);

        let convertedBillTo: LocationFromOracle | undefined;

        if (findBillTo) {
          convertedBillTo = {
            value: findBillTo.LOCATION_ID.toString(),
            label: findBillTo.LOCATION_CODE,
          };
          setLocationBillTo(convertedBillTo);
        }

        const findShipTo: LocationInterface | undefined = result.data.data.find(
          (item: LocationInterface) =>
            item.LOCATION_ID === parseInt(shipToAddressInStore!)
        );
        console.log(findShipTo);

        setShipToAddress(findShipTo?.LOCATION_CODE!);

        let convertedShipTo: LocationFromOracle | undefined;

        if (findShipTo) {
          convertedShipTo = {
            value: findShipTo.LOCATION_ID.toString(),
            label: findShipTo.LOCATION_CODE,
          };
          setLocationShipTo(convertedShipTo);
        }
      }
    } catch (error) {
      showErrorToast("Currency location failed");
    }
  };

  //freight term
  //freight term
  const [freightTermFromoracle, setFreightTermFromoracle] = useState<
    FreightTermFromOracle[] | []
  >([]);
  // const [currencyFromOracle, setCurrencyFromOracle] =
  //   useState<CurrencyFromOracle | null>(null);

  const [freightTermName, setFreightTermName] = useState("");

  const getFreightTerm = async () => {
    try {
      const result = await FreightTermService(token!);
      console.log(result.data);

      if (result.data.status === 200) {
        const findFreightName: FreightTermInterface | undefined =
          result.data.data.find(
            (item: FreightTermInterface) =>
              item.LOOKUP_CODE.toString() === freightTermInStore
          );
        setFreightTermName(findFreightName?.MEANING!);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Freight term load failed");
    }
  };
  //freight term

  //payment term

  const [paymentTermName, setPaymentTermName] = useState<string>("");

  // const getPaymentTerm = async () => {
  //   try {
  //     const result = await PaymentTermService(token!);
  //     console.log(result.data);

  //     if (result.data.status === 200) {
  //       const findPaymentName: PaymentTermInterface | undefined =
  //         result.data.data.find(
  //           (item: PaymentTermInterface) =>
  //             item.TERM_ID.toString() === paymentTermInStore
  //         );
  //       console.log(paymentTermInStore);

  //       console.log(findPaymentName);

  //       setPaymentTermName(findPaymentName?.NAME!);
  //     } else {
  //       showErrorToast(result.data.message);
  //     }
  //   } catch (error) {
  //     showErrorToast("Freight term load failed");
  //   }
  // };

  const getPaymentTerm = async () => {
    try {
      const result = await PaymentTermService(token!);
      console.log("Response from PaymentTermService:", result.data);

      if (result.data.status === 200) {
        const findPaymentName: PaymentTermInterface | undefined =
          result.data.data.find(
            (item: PaymentTermInterface) =>
              item.TERM_ID === parseInt(paymentTermInStore!, 10)
          );

        console.log("Payment Term ID in Store:", paymentTermInStore);
        console.log("Found Payment Term:", findPaymentName);

        if (findPaymentName) {
          setPaymentTermName(findPaymentName.NAME);
        } else {
          console.log("Payment term not found!");
          // Handle case when payment term is not found
        }
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      console.error("Error occurred while fetching payment terms:", error);
      showErrorToast("Freight term load failed");
    }
  };

  //payment term

  //invoice term

  const [invoiceName, setInvoiceName] = useState<string>("");

  const getInvoiceType = async () => {
    try {
      const result = await InvoiceTypeListService(token!);
      console.log(result.data);

      if (result.data.status === 200) {
        const findInvoiceName: InvoiceTypeInterface | undefined =
          result.data.data.find(
            (item: InvoiceTypeInterface) =>
              item.LOOKUP_CODE.toString() === invoiceTypeInstore
          );
        setInvoiceName(findInvoiceName?.MEANING!);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Invoice type load failed");
    }
  };

  //invoice term

  //store
  const {
    headerAttachment,
    prItems,
    prItems2,
    totalprItemNumberInStore,
    rfqTitleInStore,
    rfqSubjectInStore,
    rfqOpenDateInStore,
    rfqCloseDateInStore,
    rfqTypeInStore,
    needByDateInStore,
    freightTermInStore,
    paymentTermInStore,
    fobInStore,
    buyerAttachmentInStore,
    currencyInStore,
    etrInStore,
    billToAddressInStore,
    shipToAddressInStore,
    invoiceTypeInstore,
    vatApplicableStatusInStore,
    vatPercentageInStore,
    noteInStore,
    selectedGeneralterm,
    setSelectedGeneralterm,
    setOrgIdInStore,

    invitedSuppliers,
    setInvitedSuppliers,
    isCreateRfq,
    rfqDetailsInStore,
    rfqIdInStore,
    rfqStatusInStore,
    setRfqStatusInStore,
    setRfqIdInStore,
    setIsCreateRfq,
    isSavepressed,
    setIsSavepressed,
    orgIdInStore,
    matchOptionInStore,
    rateTypeInStore,
    rateDateInStore,
    conversionRateInStore,
    savedPrItemLength,
    setSavedPritemLength,
    approvalTypeInStore,
    setApprovalTypeInStore,
    setOrgNameInStore,
    setPrItems,
    setPrItems2,

    // freightTermNameInStore,
    // paymentTermNameInStore,
    // invoiceTypeNameInstore,
  } = usePrItemsStore();
  //store

  useEffect(() => {
    console.log("p saved", prItems2);
  }, []);

  const [previouslyInvitedSupplierList, setPreviouslyInvitedSupplierList] =
    useState<PreviouslySelectedSupplierInterface[] | []>([]);

  //auth context
  const { token, department } = useAuth();
  //auth context
  const back = () => {
    previousPage();
    setRfqStatusInStore("");
    setInvitedSuppliers([]);
  };
  const [labelText, setLabelText] = useState<string>("");
  const [notFoundText, setNotFoundText] = useState<string>("");

  useEffect(() => {
    console.log("invited supplier: ", invitedSuppliers);
    console.log("rfqType: ", rfqTypeInStore);

    console.log("rfq details: ", rfqDetailsInStore);
    console.log("dept. ", department);

    if (rfqDetailsInStore?.supplier_list?.length ?? 0 > 0) {
      if (rfqDetailsInStore?.supplier_list[0]?.EMAIL_SENT_STATUS === 1) {
        setLabelText("Previously Invited Supplier");
        setNotFoundText("Previously Invited Supplier Not Found");
      } else {
        setLabelText("Previously Saved Supplier");
        setNotFoundText("Previously Saved Supplier Not Found");
      }
    }
  }, [rfqDetailsInStore]);

  //publish api

  let conprItem: PrItemInterface[] = [];
  let conprItem2: PrItemInterface[] = [];

  const [isLoaing, setIsLoading] = useState<boolean>(false);

  const publish = async () => {
    console.log(vatPercentageInStore);

    if (prItems.length > 0) {
      conprItem = prItems.map((e, i) => ({
        RFQ_LINE_ID: e.RFQ_LINE_ID,
        RFQ_ID: e.RFQ_ID,
        LINE_TYPE_ID: e.LINE_TYPE_ID,
        ITEM_DESCRIPTION: e.ITEM_DESCRIPTION,
        EXPECTED_QUANTITY: e.EXPECTED_QUANTITY,
        EXPECTED_BRAND_NAME: e.EXPECTED_BRAND_NAME,
        EXPECTED_ORIGIN: e.EXPECTED_ORIGIN,
        LCM_ENABLE_FLAG:
          department === "Local" && e.LCM_ENABLE_FLAG === "Y"
            ? "N"
            : e.LCM_ENABLE_FLAG,
        NOTE_TO_SUPPLIER: e.NOTE_TO_SUPPLIER,
        WARRANTY_ASK_BY_BUYER: e.WARRANTY_ASK_BY_BUYER,
        WARRANTY_BY_SUPPLIER: e.WARRANTY_BY_SUPPLIER,
        BUYER_VAT_APPLICABLE: e.BUYER_VAT_APPLICABLE,
        SUPPLIER_VAT_APPLICABLE: e.SUPPLIER_VAT_APPLICABLE,
        OFFERED_QUANTITY: e.OFFERED_QUANTITY,
        PROMISE_DATE: e.PROMISE_DATE,
        CS_STATUS: e.CS_STATUS,
        LAST_UPDATED_BY: e.LAST_UPDATED_BY,
        LAST_UPDATE_DATE: e.LAST_UPDATE_DATE,
        USER_NAME: e.USER_NAME,
        PREPARER_ID: e.PREPARER_ID,
        PR_NUMBER: e.PR_NUMBER,
        REQUISITION_HEADER_ID: e.REQUISITION_HEADER_ID,
        REQUISITION_LINE_ID: e.REQUISITION_LINE_ID,
        CREATION_DATE: e.CREATION_DATE,
        DESCRIPTION: e.DESCRIPTION,
        CREATED_BY: e.CREATED_BY,
        AUTHORIZATION_STATUS: e.AUTHORIZATION_STATUS,
        APPROVED_DATE: e.APPROVED_DATE,
        PR_FROM_DFF: e.PR_FROM_DFF,
        LINE_NUM: i + 1, //i pathalam
        CATEGORY_ID: e.CATEGORY_ID,
        ITEM_ID: e.ITEM_ID,
        ITEM_CODE: e.ITEM_CODE,
        UNIT_MEAS_LOOKUP_CODE: e.UNIT_MEAS_LOOKUP_CODE,
        UNIT_PRICE: e.UNIT_PRICE,
        QUANTITY: e.QUANTITY,
        NEED_BY_DATE: e.NEED_BY_DATE,
        DELIVER_TO_LOCATION_ID: e.DELIVER_TO_LOCATION_ID,
        DESTINATION_ORGANIZATION_ID: e.DESTINATION_ORGANIZATION_ID,
        ATTRIBUTE_CATEGORY: e.ATTRIBUTE_CATEGORY,
        BRAND: e.BRAND,
        ORIGIN: e.ORIGIN,
        ITEM_SPECIFICATION: e.ITEM_SPECIFICATION,
        WARRANTY_DETAILS: e.WARRANTY_DETAILS,
        PACKING_TYPE: e.PACKING_TYPE,
        ATTRIBUTE6: e.ATTRIBUTE6,
        PROJECT_NAME: e.PROJECT_NAME,
        ORG_ID: e.ORG_ID,
        CLOSED_CODE: e.CLOSED_CODE,
        INVENTORY_ORG_NAME: e.INVENTORY_ORG_NAME,
        // BUYER_FILE_NAME: String,
        BUYER_FILE: e.BUYER_FILE,
        BUYER_FILE_ORG_NAME: e.BUYER_FILE_ORG_NAME,
        COUNTER: e.COUNTER,
        REQUESTOR_NAME: e.REQUESTOR_NAME,
        BUYER_FILE_NAME: e.BUYER_FILE_NAME,
        RATE_TYPE: rateTypeInStore,
        RATE_DATE: moment(rateDateInStore).format("DD-MMM-YY HH:mm:ss"),
        CONVERSION_RATE: conversionRateInStore,
        MATCH_OPTION: matchOptionInStore,
        PR_LINE_NUM: e.PR_LINE_NUM,
        PR_CREATION_DATE: e.PR_CREATION_DATE,
        LINE_STATUS: "Y",
        LINE_TYPE: e.LINE_TYPE,
      }));
    }

    if (rfqIdInStore != null) {
      console.log("update a dhukbe");

      updateRfq();
    } else {
      try {
        setIsLoading(true);
        const result = await RfqCreateService(
          token!,

          rfqSubjectInStore!,
          rfqTitleInStore!,
          rfqTypeInStore!,
          needByDateInStore!,
          rfqOpenDateInStore!,
          rfqCloseDateInStore!,
          etrInStore!,
          headerAttachment,
          // headerMime,
          // headerAttachmentFileName!,
          currencyInStore!,
          parseInt(billToAddressInStore!),
          parseInt(shipToAddressInStore!),
          "SUBMIT",
          Number.isNaN(vatPercentageInStore) ? 0 : vatPercentageInStore!,
          vatApplicableStatusInStore!,
          buyerAttachmentInStore,
          selectedGeneralterm!,
          //new add
          freightTermInStore!,
          parseInt(paymentTermInStore!),
          invoiceTypeInstore!,
          noteInStore!,
          orgIdInStore,
          matchOptionInStore,
          rateTypeInStore,
          rateDateInStore,
          conversionRateInStore,
          department!,
          approvalTypeInStore
        );
        console.log(result.data);

        if (result.data.status === 200) {
          let rfqId = result.data.rfq_id;
          console.log(result.data);

          console.log("create er somoy", conprItem.length);

          if (conprItem.length !== 0) {
            for (let i = 0; i < conprItem.length; i++) {
              console.log(rfqId);
              console.log(conprItem[i]);

              saveLineItemToRfq(rfqId, conprItem[i]);
            }
          }

          // if (conprItem2.length !== 0) {
          //   for (let i = 0; i < conprItem2.length; i++) {
          //     console.log(rfqId);
          //     console.log(conprItem2[i]);

          //     saveLineItemToRfq(rfqId, conprItem2[i]);
          //   }
          // }

          // if (!isCreateRfq) {
          //   for (let i = 0; i < prItems2.length; i++) {
          //     // console.log(rfqId);
          //     // console.log(prItems2[i]);

          //     updateLineItemToRfq(rfqIdInStore!, prItems2[i]);
          //   }
          // }

          const convertedSuppliers = invitedSuppliers.map((supplier) => ({
            ...supplier,
            SUPPLIER_ID: supplier.USER_ID,
            EMAIL_SENT_STATUS: 1,
          }));

          console.log("publish convert: ", convertedSuppliers);

          inviteSupplierToRfq(
            rfqId,
            rfqTitleInStore!,
            rfqTypeInStore!,
            rfqCloseDateInStore!,
            convertedSuppliers
          );
          setIsLoading(false);
          setRfqStatusInStore("");
          showSuccessToast("Rfq Published Successfully");
          setRfqIdInStore(null);
          setIsCreateRfq(false);
          setRfqStatusInStore("");
          setSelectedGeneralterm("");
          setOrgIdInStore("");
          setSavedPritemLength(null);
          setInvitedSuppliers([]);
          setOrgNameInStore("");
          setApprovalTypeInStore("");
          setPrItems([]);
          setPrItems2([]);
          setPage(1);
        } else {
          setIsLoading(false);
          showErrorToast(result.data.message);
        }
      } catch (error) {
        setIsLoading(false);
        showErrorToast("Rfq publish Failed");
      }
    }
  };
  const publish2 = async () => {
    console.log(vatPercentageInStore);

    if (prItems.length > 0) {
      conprItem = prItems.map((e, i) => ({
        RFQ_LINE_ID: e.RFQ_LINE_ID,
        RFQ_ID: e.RFQ_ID,
        LINE_TYPE_ID: e.LINE_TYPE_ID,
        ITEM_DESCRIPTION: e.ITEM_DESCRIPTION,
        EXPECTED_QUANTITY: e.EXPECTED_QUANTITY,
        EXPECTED_BRAND_NAME: e.EXPECTED_BRAND_NAME,
        EXPECTED_ORIGIN: e.EXPECTED_ORIGIN,
        LCM_ENABLE_FLAG:
          department === "Local" && e.LCM_ENABLE_FLAG === "Y"
            ? "N"
            : e.LCM_ENABLE_FLAG,
        NOTE_TO_SUPPLIER: e.NOTE_TO_SUPPLIER,
        WARRANTY_ASK_BY_BUYER: e.WARRANTY_ASK_BY_BUYER,
        WARRANTY_BY_SUPPLIER: e.WARRANTY_BY_SUPPLIER,
        BUYER_VAT_APPLICABLE: e.BUYER_VAT_APPLICABLE,
        SUPPLIER_VAT_APPLICABLE: e.SUPPLIER_VAT_APPLICABLE,
        OFFERED_QUANTITY: e.OFFERED_QUANTITY,
        PROMISE_DATE: e.PROMISE_DATE,
        CS_STATUS: e.CS_STATUS,
        LAST_UPDATED_BY: e.LAST_UPDATED_BY,
        LAST_UPDATE_DATE: e.LAST_UPDATE_DATE,
        USER_NAME: e.USER_NAME,
        PREPARER_ID: e.PREPARER_ID,
        PR_NUMBER: e.PR_NUMBER,
        REQUISITION_HEADER_ID: e.REQUISITION_HEADER_ID,
        REQUISITION_LINE_ID: e.REQUISITION_LINE_ID,
        CREATION_DATE: e.CREATION_DATE,
        DESCRIPTION: e.DESCRIPTION,
        CREATED_BY: e.CREATED_BY,
        AUTHORIZATION_STATUS: e.AUTHORIZATION_STATUS,
        APPROVED_DATE: e.APPROVED_DATE,
        PR_FROM_DFF: e.PR_FROM_DFF,
        LINE_NUM: i + 1, //i pathalam
        CATEGORY_ID: e.CATEGORY_ID,
        ITEM_ID: e.ITEM_ID,
        ITEM_CODE: e.ITEM_CODE,
        UNIT_MEAS_LOOKUP_CODE: e.UNIT_MEAS_LOOKUP_CODE,
        UNIT_PRICE: e.UNIT_PRICE,
        QUANTITY: e.QUANTITY,
        NEED_BY_DATE: e.NEED_BY_DATE,
        DELIVER_TO_LOCATION_ID: e.DELIVER_TO_LOCATION_ID,
        DESTINATION_ORGANIZATION_ID: e.DESTINATION_ORGANIZATION_ID,
        ATTRIBUTE_CATEGORY: e.ATTRIBUTE_CATEGORY,
        BRAND: e.BRAND,
        ORIGIN: e.ORIGIN,
        ITEM_SPECIFICATION: e.ITEM_SPECIFICATION,
        WARRANTY_DETAILS: e.WARRANTY_DETAILS,
        PACKING_TYPE: e.PACKING_TYPE,
        ATTRIBUTE6: e.ATTRIBUTE6,
        PROJECT_NAME: e.PROJECT_NAME,
        ORG_ID: e.ORG_ID,
        CLOSED_CODE: e.CLOSED_CODE,
        INVENTORY_ORG_NAME: e.INVENTORY_ORG_NAME,
        // BUYER_FILE_NAME: String,
        BUYER_FILE: e.BUYER_FILE,
        BUYER_FILE_ORG_NAME: e.BUYER_FILE_ORG_NAME,
        COUNTER: e.COUNTER,
        REQUESTOR_NAME: e.REQUESTOR_NAME,
        BUYER_FILE_NAME: e.BUYER_FILE_NAME,
        RATE_TYPE: rateTypeInStore,
        RATE_DATE: moment(rateDateInStore).format("DD-MMM-YY HH:mm:ss"),
        CONVERSION_RATE: conversionRateInStore,
        MATCH_OPTION: matchOptionInStore,
        PR_LINE_NUM: e.PR_LINE_NUM,
        PR_CREATION_DATE: e.PR_CREATION_DATE,
        LINE_STATUS: "Y",
        LINE_TYPE: e.LINE_TYPE,
      }));
    }
    // if (prItems2.length > 0) {
    //   conprItem2 = prItems2.map((e, i) => ({
    //     RFQ_LINE_ID: e.RFQ_LINE_ID,
    //     RFQ_ID: e.RFQ_ID,
    //     LINE_TYPE_ID: e.LINE_TYPE_ID,
    //     ITEM_DESCRIPTION: e.ITEM_DESCRIPTION,
    //     EXPECTED_QUANTITY: e.EXPECTED_QUANTITY,
    //     EXPECTED_BRAND_NAME: e.EXPECTED_BRAND_NAME,
    //     EXPECTED_ORIGIN: e.EXPECTED_ORIGIN,
    //     LCM_ENABLE_FLAG: e.LCM_ENABLE_FLAG,
    //     NOTE_TO_SUPPLIER: e.NOTE_TO_SUPPLIER,
    //     WARRANTY_ASK_BY_BUYER: e.WARRANTY_ASK_BY_BUYER,
    //     WARRANTY_BY_SUPPLIER: e.WARRANTY_BY_SUPPLIER,
    //     BUYER_VAT_APPLICABLE: e.BUYER_VAT_APPLICABLE,
    //     SUPPLIER_VAT_APPLICABLE: e.SUPPLIER_VAT_APPLICABLE,
    //     OFFERED_QUANTITY: e.OFFERED_QUANTITY,
    //     PROMISE_DATE: e.PROMISE_DATE,
    //     CS_STATUS: e.CS_STATUS,
    //     LAST_UPDATED_BY: e.LAST_UPDATED_BY,
    //     LAST_UPDATE_DATE: e.LAST_UPDATE_DATE,
    //     USER_NAME: e.USER_NAME,
    //     PREPARER_ID: e.PREPARER_ID,
    //     PR_NUMBER: e.PR_NUMBER,
    //     REQUISITION_HEADER_ID: e.REQUISITION_HEADER_ID,
    //     REQUISITION_LINE_ID: e.REQUISITION_LINE_ID,
    //     CREATION_DATE: e.CREATION_DATE,
    //     DESCRIPTION: e.DESCRIPTION,
    //     CREATED_BY: e.CREATED_BY,
    //     AUTHORIZATION_STATUS: e.AUTHORIZATION_STATUS,
    //     APPROVED_DATE: e.APPROVED_DATE,
    //     PR_FROM_DFF: e.PR_FROM_DFF,
    //     LINE_NUM: 1,
    //     CATEGORY_ID: e.CATEGORY_ID,
    //     ITEM_ID: e.ITEM_ID,
    //     ITEM_CODE: e.ITEM_CODE,
    //     UNIT_MEAS_LOOKUP_CODE: e.UNIT_MEAS_LOOKUP_CODE,
    //     UNIT_PRICE: e.UNIT_PRICE,
    //     QUANTITY: e.QUANTITY,
    //     NEED_BY_DATE: e.NEED_BY_DATE,
    //     DELIVER_TO_LOCATION_ID: e.DELIVER_TO_LOCATION_ID,
    //     DESTINATION_ORGANIZATION_ID: e.DESTINATION_ORGANIZATION_ID,
    //     ATTRIBUTE_CATEGORY: e.ATTRIBUTE_CATEGORY,
    //     BRAND: e.BRAND,
    //     ORIGIN: e.ORIGIN,
    //     ITEM_SPECIFICATION: e.ITEM_SPECIFICATION,
    //     WARRANTY_DETAILS: e.WARRANTY_DETAILS,
    //     PACKING_TYPE: e.PACKING_TYPE,
    //     ATTRIBUTE6: e.ATTRIBUTE6,
    //     PROJECT_NAME: e.PROJECT_NAME,
    //     ORG_ID: e.ORG_ID,
    //     CLOSED_CODE: e.CLOSED_CODE,
    //     INVENTORY_ORG_NAME: e.INVENTORY_ORG_NAME,
    //     // BUYER_FILE_NAME: String,
    //     BUYER_FILE: e.BUYER_FILE,
    //     BUYER_FILE_ORG_NAME: e.BUYER_FILE_ORG_NAME,
    //     COUNTER: e.COUNTER,
    //     REQUESTOR_NAME: e.REQUESTOR_NAME,
    //     BUYER_FILE_NAME: e.BUYER_FILE_NAME,
    //     RATE_TYPE: e.RATE_TYPE,
    //     RATE_DATE: e.RATE_DATE,
    //     CONVERSION_RATE: e.CONVERSION_RATE,
    //     MATCH_OPTION: matchOptionInStore,
    //     PR_LINE_NUM: e.PR_LINE_NUM,
    //   }));
    // }

    if (rfqIdInStore != null) {
      console.log("update a dhukbe");

      updateRfq2();
    } else {
      try {
        setSaveLoading(true);
        const result = await RfqCreateService(
          token!,

          rfqSubjectInStore!,
          rfqTitleInStore!,
          rfqTypeInStore!,
          needByDateInStore!,
          rfqOpenDateInStore!,
          rfqCloseDateInStore!,
          etrInStore!,
          headerAttachment,
          // headerMime,
          // headerAttachmentFileName!,
          currencyInStore!,
          parseInt(billToAddressInStore!),
          parseInt(shipToAddressInStore!),
          "SAVE",
          Number.isNaN(vatPercentageInStore) ? 0 : vatPercentageInStore!,
          vatApplicableStatusInStore!,
          buyerAttachmentInStore,
          selectedGeneralterm!,
          //new add
          freightTermInStore!,
          parseInt(paymentTermInStore!),
          invoiceTypeInstore!,
          noteInStore!,
          orgIdInStore,
          matchOptionInStore,
          rateTypeInStore,
          rateDateInStore,
          conversionRateInStore,
          department!,
          approvalTypeInStore
        );
        console.log(result.data);

        if (result.data.status === 200) {
          let rfqId = result.data.rfq_id;
          console.log(result.data);

          console.log("create er somoy", conprItem.length);

          if (conprItem.length !== 0) {
            for (let i = 0; i < conprItem.length; i++) {
              console.log(rfqId);
              console.log(conprItem[i]);

              saveLineItemToRfq(rfqId, conprItem[i]);
            }
          }

          // if (conprItem2.length !== 0) {
          //   for (let i = 0; i < conprItem2.length; i++) {
          //     console.log(rfqId);
          //     console.log(conprItem2[i]);

          //     saveLineItemToRfq(rfqId, conprItem2[i]);
          //   }
          // }

          // if (!isCreateRfq) {
          //   for (let i = 0; i < prItems2.length; i++) {
          //     // console.log(rfqId);
          //     // console.log(prItems2[i]);

          //     updateLineItemToRfq(rfqIdInStore!, prItems2[i]);
          //   }
          // }

          const convertedSuppliers = invitedSuppliers.map((supplier) => ({
            ...supplier,

            SUPPLIER_ID: supplier.USER_ID,
            EMAIL_SENT_STATUS: 0,
          }));

          console.log("publish convert: ", convertedSuppliers);

          inviteSupplierToRfq(
            rfqId,
            rfqTitleInStore!,
            rfqTypeInStore!,
            rfqCloseDateInStore!,
            convertedSuppliers
          );
          setSaveLoading(false);
          setRfqStatusInStore("");
          showSuccessToast("Rfq Saved Successfully");
          setRfqIdInStore(null);
          setIsCreateRfq(false);
          setRfqStatusInStore("");
          setSelectedGeneralterm("");
          setOrgIdInStore("");
          setSavedPritemLength(null);
          setInvitedSuppliers([]);
          setApprovalTypeInStore("");
          setOrgNameInStore("");
          setPrItems([]);
          setPrItems2([]);
          setPage(1);
        } else {
          setSaveLoading(false);
          showErrorToast(result.data.message);
        }
      } catch (error) {
        setSaveLoading(false);
        showErrorToast("Rfq Saved Failed");
      }
    }
  };

  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const savePublish = async () => {
    console.log(vatPercentageInStore);

    if (prItems.length > 0) {
      conprItem = prItems.map((e, i) => ({
        RFQ_LINE_ID: e.RFQ_LINE_ID,
        RFQ_ID: e.RFQ_ID,
        LINE_TYPE_ID: e.LINE_TYPE_ID,
        ITEM_DESCRIPTION: e.ITEM_DESCRIPTION,
        EXPECTED_QUANTITY: e.EXPECTED_QUANTITY,
        EXPECTED_BRAND_NAME: e.EXPECTED_BRAND_NAME,
        EXPECTED_ORIGIN: e.EXPECTED_ORIGIN,
        LCM_ENABLE_FLAG: e.LCM_ENABLE_FLAG,
        NOTE_TO_SUPPLIER: e.NOTE_TO_SUPPLIER,
        WARRANTY_ASK_BY_BUYER: e.WARRANTY_ASK_BY_BUYER,
        WARRANTY_BY_SUPPLIER: e.WARRANTY_BY_SUPPLIER,
        BUYER_VAT_APPLICABLE: e.BUYER_VAT_APPLICABLE,
        SUPPLIER_VAT_APPLICABLE: e.SUPPLIER_VAT_APPLICABLE,
        OFFERED_QUANTITY: e.OFFERED_QUANTITY,
        PROMISE_DATE: e.PROMISE_DATE,
        CS_STATUS: e.CS_STATUS,
        LAST_UPDATED_BY: e.LAST_UPDATED_BY,
        LAST_UPDATE_DATE: e.LAST_UPDATE_DATE,
        USER_NAME: e.USER_NAME,
        PREPARER_ID: e.PREPARER_ID,
        PR_NUMBER: e.PR_NUMBER,
        REQUISITION_HEADER_ID: e.REQUISITION_HEADER_ID,
        REQUISITION_LINE_ID: e.REQUISITION_LINE_ID,
        CREATION_DATE: e.CREATION_DATE,
        DESCRIPTION: e.DESCRIPTION,
        CREATED_BY: e.CREATED_BY,
        AUTHORIZATION_STATUS: e.AUTHORIZATION_STATUS,
        APPROVED_DATE: e.APPROVED_DATE,
        PR_FROM_DFF: e.PR_FROM_DFF,
        LINE_NUM: i + 1, //i pathalam
        CATEGORY_ID: e.CATEGORY_ID,
        ITEM_ID: e.ITEM_ID,
        ITEM_CODE: e.ITEM_CODE,
        UNIT_MEAS_LOOKUP_CODE: e.UNIT_MEAS_LOOKUP_CODE,
        UNIT_PRICE: e.UNIT_PRICE,
        QUANTITY: e.QUANTITY,
        NEED_BY_DATE: e.NEED_BY_DATE,
        DELIVER_TO_LOCATION_ID: e.DELIVER_TO_LOCATION_ID,
        DESTINATION_ORGANIZATION_ID: e.DESTINATION_ORGANIZATION_ID,
        ATTRIBUTE_CATEGORY: e.ATTRIBUTE_CATEGORY,
        BRAND: e.BRAND,
        ORIGIN: e.ORIGIN,
        ITEM_SPECIFICATION: e.ITEM_SPECIFICATION,
        WARRANTY_DETAILS: e.WARRANTY_DETAILS,
        PACKING_TYPE: e.PACKING_TYPE,
        ATTRIBUTE6: e.ATTRIBUTE6,
        PROJECT_NAME: e.PROJECT_NAME,
        ORG_ID: e.ORG_ID,
        CLOSED_CODE: e.CLOSED_CODE,
        INVENTORY_ORG_NAME: e.INVENTORY_ORG_NAME,
        // BUYER_FILE_NAME: String,
        BUYER_FILE: e.BUYER_FILE,
        BUYER_FILE_ORG_NAME: e.BUYER_FILE_ORG_NAME,
        COUNTER: e.COUNTER,
        REQUESTOR_NAME: e.REQUESTOR_NAME,
        BUYER_FILE_NAME: e.BUYER_FILE_NAME,
        RATE_TYPE: rateTypeInStore,
        RATE_DATE: moment(rateDateInStore).format("DD-MMM-YY HH:mm:ss"),
        CONVERSION_RATE: conversionRateInStore,
        MATCH_OPTION: matchOptionInStore,
        PR_LINE_NUM: e.LINE_NUM,
        PR_CREATION_DATE: e.PR_CREATION_DATE,
        LINE_STATUS: "Y",
        LINE_TYPE: e.LINE_TYPE,
      }));
    }
    // if (prItems2.length > 0) {
    //   conprItem2 = prItems2.map((e, i) => ({
    //     RFQ_LINE_ID: e.RFQ_LINE_ID,
    //     RFQ_ID: e.RFQ_ID,
    //     LINE_TYPE_ID: e.LINE_TYPE_ID,
    //     ITEM_DESCRIPTION: e.ITEM_DESCRIPTION,
    //     EXPECTED_QUANTITY: e.EXPECTED_QUANTITY,
    //     EXPECTED_BRAND_NAME: e.EXPECTED_BRAND_NAME,
    //     EXPECTED_ORIGIN: e.EXPECTED_ORIGIN,
    //     LCM_ENABLE_FLAG: e.LCM_ENABLE_FLAG,
    //     NOTE_TO_SUPPLIER: e.NOTE_TO_SUPPLIER,
    //     WARRANTY_ASK_BY_BUYER: e.WARRANTY_ASK_BY_BUYER,
    //     WARRANTY_BY_SUPPLIER: e.WARRANTY_BY_SUPPLIER,
    //     BUYER_VAT_APPLICABLE: e.BUYER_VAT_APPLICABLE,
    //     SUPPLIER_VAT_APPLICABLE: e.SUPPLIER_VAT_APPLICABLE,
    //     OFFERED_QUANTITY: e.OFFERED_QUANTITY,
    //     PROMISE_DATE: e.PROMISE_DATE,
    //     CS_STATUS: e.CS_STATUS,
    //     LAST_UPDATED_BY: e.LAST_UPDATED_BY,
    //     LAST_UPDATE_DATE: e.LAST_UPDATE_DATE,
    //     USER_NAME: e.USER_NAME,
    //     PREPARER_ID: e.PREPARER_ID,
    //     PR_NUMBER: e.PR_NUMBER,
    //     REQUISITION_HEADER_ID: e.REQUISITION_HEADER_ID,
    //     REQUISITION_LINE_ID: e.REQUISITION_LINE_ID,
    //     CREATION_DATE: e.CREATION_DATE,
    //     DESCRIPTION: e.DESCRIPTION,
    //     CREATED_BY: e.CREATED_BY,
    //     AUTHORIZATION_STATUS: e.AUTHORIZATION_STATUS,
    //     APPROVED_DATE: e.APPROVED_DATE,
    //     PR_FROM_DFF: e.PR_FROM_DFF,
    //     LINE_NUM: 1,
    //     CATEGORY_ID: e.CATEGORY_ID,
    //     ITEM_ID: e.ITEM_ID,
    //     ITEM_CODE: e.ITEM_CODE,
    //     UNIT_MEAS_LOOKUP_CODE: e.UNIT_MEAS_LOOKUP_CODE,
    //     UNIT_PRICE: e.UNIT_PRICE,
    //     QUANTITY: e.QUANTITY,
    //     NEED_BY_DATE: e.NEED_BY_DATE,
    //     DELIVER_TO_LOCATION_ID: e.DELIVER_TO_LOCATION_ID,
    //     DESTINATION_ORGANIZATION_ID: e.DESTINATION_ORGANIZATION_ID,
    //     ATTRIBUTE_CATEGORY: e.ATTRIBUTE_CATEGORY,
    //     BRAND: e.BRAND,
    //     ORIGIN: e.ORIGIN,
    //     ITEM_SPECIFICATION: e.ITEM_SPECIFICATION,
    //     WARRANTY_DETAILS: e.WARRANTY_DETAILS,
    //     PACKING_TYPE: e.PACKING_TYPE,
    //     ATTRIBUTE6: e.ATTRIBUTE6,
    //     PROJECT_NAME: e.PROJECT_NAME,
    //     ORG_ID: e.ORG_ID,
    //     CLOSED_CODE: e.CLOSED_CODE,
    //     INVENTORY_ORG_NAME: e.INVENTORY_ORG_NAME,
    //     // BUYER_FILE_NAME: String,
    //     BUYER_FILE: e.BUYER_FILE,
    //     BUYER_FILE_ORG_NAME: e.BUYER_FILE_ORG_NAME,
    //     COUNTER: e.COUNTER,
    //     REQUESTOR_NAME: e.REQUESTOR_NAME,
    //     BUYER_FILE_NAME: e.BUYER_FILE_NAME,
    //     RATE_TYPE: e.RATE_TYPE,
    //     RATE_DATE: e.RATE_DATE,
    //     CONVERSION_RATE: e.CONVERSION_RATE,
    //     MATCH_OPTION: matchOptionInStore,
    //     PR_LINE_NUM: e.PR_LINE_NUM,
    //   }));
    // }

    // if (rfqIdInStore != null) {
    //   console.log("update a dhukbe");

    //   updateRfq();
    // } else {
    try {
      setSaveLoading(true);
      const result = await RfqSaveService(
        token!,

        rfqSubjectInStore!,
        rfqTitleInStore!,
        rfqTypeInStore!,
        needByDateInStore!,
        rfqOpenDateInStore!,
        rfqCloseDateInStore!,
        etrInStore!,
        headerAttachment,
        // headerMime,
        // headerAttachmentFileName!,
        currencyInStore!,
        parseInt(billToAddressInStore!),
        parseInt(shipToAddressInStore!),
        "SAVE",
        Number.isNaN(vatPercentageInStore) ? 0 : vatPercentageInStore!,
        vatApplicableStatusInStore!,
        buyerAttachmentInStore,
        selectedGeneralterm!,
        //new add
        freightTermInStore!,
        parseInt(paymentTermInStore!),
        invoiceTypeInstore!,
        noteInStore!,
        orgIdInStore,
        matchOptionInStore,
        rateTypeInStore,
        rateDateInStore,
        conversionRateInStore
      );
      console.log(result.data);

      if (result.data.status === 200) {
        let rfqId = result.data.rfq_id;
        console.log(result.data);
        showSuccessToast(result.data.message);
        console.log("create er somoy", conprItem.length);

        if (conprItem.length !== 0) {
          for (let i = 0; i < conprItem.length; i++) {
            console.log(rfqId);
            console.log(conprItem[i]);

            saveLineItemToRfq(rfqId, conprItem[i]);
          }
        }

        // if (conprItem2.length !== 0) {
        //   for (let i = 0; i < conprItem2.length; i++) {
        //     console.log(rfqId);
        //     console.log(conprItem2[i]);

        //     saveLineItemToRfq(rfqId, conprItem2[i]);
        //   }
        // }

        // if (!isCreateRfq) {
        //   for (let i = 0; i < prItems2.length; i++) {
        //     // console.log(rfqId);
        //     // console.log(prItems2[i]);

        //     updateLineItemToRfq(rfqIdInStore!, prItems2[i]);
        //   }
        // }

        const convertedSuppliers = invitedSuppliers.map((supplier) => ({
          ...supplier,
          SUPPLIER_ID: supplier.USER_ID,
          EMAIL_SENT_STATUS: 0,
        }));

        console.log("converted supplier: ", convertedSuppliers);

        inviteSupplierToRfq(
          rfqIdInStore!,
          rfqTitleInStore!,
          rfqTypeInStore!,
          rfqCloseDateInStore!,
          // invitedSuppliers,
          convertedSuppliers
        );
        setSaveLoading(false);
        setRfqStatusInStore("");
        showSuccessToast("Rfq Saved Successfully");
        setRfqIdInStore(null);
        setIsCreateRfq(false);
        setRfqStatusInStore("");
        setSelectedGeneralterm("");
        setOrgIdInStore("");
        setSavedPritemLength(null);
        setPage(1);
      } else {
        setSaveLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setSaveLoading(false);
      showErrorToast("Rfq save Failed");
    }
    // }
  };

  //update Rfq

  let conPrItem3: PrItemInterface[] = [];
  let conPrItem4: PrItemInterface[] = [];

  const updateRfq = async () => {
    if (prItems.length > 0) {
      conPrItem3 = prItems.map((e, i) => ({
        RFQ_LINE_ID: e.RFQ_LINE_ID,
        RFQ_ID: e.RFQ_ID,
        LINE_TYPE_ID: e.LINE_TYPE_ID,
        ITEM_DESCRIPTION: e.ITEM_DESCRIPTION,
        EXPECTED_QUANTITY: e.EXPECTED_QUANTITY,
        EXPECTED_BRAND_NAME: e.EXPECTED_BRAND_NAME,
        EXPECTED_ORIGIN: e.EXPECTED_ORIGIN,
        LCM_ENABLE_FLAG:
          department === "Local" && e.LCM_ENABLE_FLAG === "Y"
            ? "N"
            : e.LCM_ENABLE_FLAG,
        NOTE_TO_SUPPLIER: e.NOTE_TO_SUPPLIER,
        WARRANTY_ASK_BY_BUYER: e.WARRANTY_ASK_BY_BUYER,
        WARRANTY_BY_SUPPLIER: e.WARRANTY_BY_SUPPLIER,
        BUYER_VAT_APPLICABLE: e.BUYER_VAT_APPLICABLE,
        SUPPLIER_VAT_APPLICABLE: e.SUPPLIER_VAT_APPLICABLE,
        OFFERED_QUANTITY: e.OFFERED_QUANTITY,
        PROMISE_DATE: e.PROMISE_DATE,
        CS_STATUS: e.CS_STATUS,
        LAST_UPDATED_BY: e.LAST_UPDATED_BY,
        LAST_UPDATE_DATE: e.LAST_UPDATE_DATE,
        USER_NAME: e.USER_NAME,
        PREPARER_ID: e.PREPARER_ID,
        PR_NUMBER: e.PR_NUMBER,
        REQUISITION_HEADER_ID: e.REQUISITION_HEADER_ID,
        REQUISITION_LINE_ID: e.REQUISITION_LINE_ID,
        CREATION_DATE: e.CREATION_DATE,
        DESCRIPTION: e.DESCRIPTION,
        CREATED_BY: e.CREATED_BY,
        AUTHORIZATION_STATUS: e.AUTHORIZATION_STATUS,
        APPROVED_DATE: e.APPROVED_DATE,
        PR_FROM_DFF: e.PR_FROM_DFF,
        LINE_NUM: savedPrItemLength! + i + 1,
        CATEGORY_ID: e.CATEGORY_ID,
        ITEM_ID: e.ITEM_ID,
        ITEM_CODE: e.ITEM_CODE,
        UNIT_MEAS_LOOKUP_CODE: e.UNIT_MEAS_LOOKUP_CODE,
        UNIT_PRICE: e.UNIT_PRICE,
        QUANTITY: e.QUANTITY,
        NEED_BY_DATE: e.NEED_BY_DATE,
        DELIVER_TO_LOCATION_ID: e.DELIVER_TO_LOCATION_ID,
        DESTINATION_ORGANIZATION_ID: e.DESTINATION_ORGANIZATION_ID,
        ATTRIBUTE_CATEGORY: e.ATTRIBUTE_CATEGORY,
        BRAND: e.BRAND,
        ORIGIN: e.ORIGIN,
        ITEM_SPECIFICATION: e.ITEM_SPECIFICATION,
        WARRANTY_DETAILS: e.WARRANTY_DETAILS,
        PACKING_TYPE: e.PACKING_TYPE,
        ATTRIBUTE6: e.ATTRIBUTE6,
        PROJECT_NAME: e.PROJECT_NAME,
        ORG_ID: e.ORG_ID,
        CLOSED_CODE: e.CLOSED_CODE,
        INVENTORY_ORG_NAME: e.INVENTORY_ORG_NAME,
        // BUYER_FILE_NAME: String,
        BUYER_FILE: e.BUYER_FILE,
        BUYER_FILE_ORG_NAME: e.BUYER_FILE_ORG_NAME,
        COUNTER: e.COUNTER,
        REQUESTOR_NAME: e.REQUESTOR_NAME,
        BUYER_FILE_NAME: e.BUYER_FILE_NAME,
        RATE_TYPE: rateTypeInStore,
        RATE_DATE: moment(rateDateInStore).format("YYYY-MM-DD"),
        CONVERSION_RATE: conversionRateInStore,
        MATCH_OPTION: matchOptionInStore,
        PR_LINE_NUM: e.PR_LINE_NUM,
        PR_CREATION_DATE: e.PR_CREATION_DATE,
        LINE_STATUS: "Y",
        LINE_TYPE: e.LINE_TYPE,
      }));
    }
    if (prItems2.length > 0) {
      conPrItem4 = prItems2.map((e, i) => ({
        RFQ_LINE_ID: e.RFQ_LINE_ID,
        RFQ_ID: e.RFQ_ID,
        LINE_TYPE_ID: e.LINE_TYPE_ID,
        ITEM_DESCRIPTION: e.ITEM_DESCRIPTION,
        EXPECTED_QUANTITY: e.EXPECTED_QUANTITY,
        EXPECTED_BRAND_NAME: e.EXPECTED_BRAND_NAME,
        EXPECTED_ORIGIN: e.EXPECTED_ORIGIN,
        LCM_ENABLE_FLAG:
          department === "Local" && e.LCM_ENABLE_FLAG === "Y"
            ? "N"
            : e.LCM_ENABLE_FLAG,
        NOTE_TO_SUPPLIER: e.NOTE_TO_SUPPLIER,
        WARRANTY_ASK_BY_BUYER: e.WARRANTY_ASK_BY_BUYER,
        WARRANTY_BY_SUPPLIER: e.WARRANTY_BY_SUPPLIER,
        BUYER_VAT_APPLICABLE: e.BUYER_VAT_APPLICABLE,
        SUPPLIER_VAT_APPLICABLE: e.SUPPLIER_VAT_APPLICABLE,
        OFFERED_QUANTITY: e.OFFERED_QUANTITY,
        PROMISE_DATE: e.PROMISE_DATE,
        CS_STATUS: e.CS_STATUS,
        LAST_UPDATED_BY: e.LAST_UPDATED_BY,
        LAST_UPDATE_DATE: e.LAST_UPDATE_DATE,
        USER_NAME: e.USER_NAME,
        PREPARER_ID: e.PREPARER_ID,
        PR_NUMBER: e.PR_NUMBER,
        REQUISITION_HEADER_ID: e.REQUISITION_HEADER_ID,
        REQUISITION_LINE_ID: e.REQUISITION_LINE_ID,
        CREATION_DATE: e.CREATION_DATE,
        DESCRIPTION: e.DESCRIPTION,
        CREATED_BY: e.CREATED_BY,
        AUTHORIZATION_STATUS: e.AUTHORIZATION_STATUS,
        APPROVED_DATE: e.APPROVED_DATE,
        PR_FROM_DFF: e.PR_FROM_DFF,
        LINE_NUM: i + 1,
        CATEGORY_ID: e.CATEGORY_ID,
        ITEM_ID: e.ITEM_ID,
        ITEM_CODE: e.ITEM_CODE,
        UNIT_MEAS_LOOKUP_CODE: e.UNIT_MEAS_LOOKUP_CODE,
        UNIT_PRICE: e.UNIT_PRICE,
        QUANTITY: e.QUANTITY,
        NEED_BY_DATE: e.NEED_BY_DATE,
        DELIVER_TO_LOCATION_ID: e.DELIVER_TO_LOCATION_ID,
        DESTINATION_ORGANIZATION_ID: e.DESTINATION_ORGANIZATION_ID,
        ATTRIBUTE_CATEGORY: e.ATTRIBUTE_CATEGORY,
        BRAND: e.BRAND,
        ORIGIN: e.ORIGIN,
        ITEM_SPECIFICATION: e.ITEM_SPECIFICATION,
        WARRANTY_DETAILS: e.WARRANTY_DETAILS,
        PACKING_TYPE: e.PACKING_TYPE,
        ATTRIBUTE6: e.ATTRIBUTE6,
        PROJECT_NAME: e.PROJECT_NAME,
        ORG_ID: e.ORG_ID,
        CLOSED_CODE: e.CLOSED_CODE,
        INVENTORY_ORG_NAME: e.INVENTORY_ORG_NAME,
        // BUYER_FILE_NAME: String,
        BUYER_FILE: e.BUYER_FILE,
        BUYER_FILE_ORG_NAME: e.BUYER_FILE_ORG_NAME,
        COUNTER: e.COUNTER,
        REQUESTOR_NAME: e.REQUESTOR_NAME,
        BUYER_FILE_NAME: e.BUYER_FILE_NAME,
        RATE_TYPE: rateTypeInStore,
        RATE_DATE: moment(rateDateInStore).format("DD-MMM-YY HH:mm:ss"),
        CONVERSION_RATE: conversionRateInStore,
        MATCH_OPTION: matchOptionInStore,
        PR_LINE_NUM: e.LINE_NUM,
        PR_CREATION_DATE: e.PR_CREATION_DATE,
        LINE_STATUS: "Y",
        LINE_TYPE: e.LINE_TYPE,
      }));
    }

    console.log("close date on update", rfqCloseDateInStore);

    try {
      const result = await RfqHeaderUpdateService(
        token!,

        rfqIdInStore!,
        rfqSubjectInStore!,
        rfqTitleInStore!,
        rfqTypeInStore!,
        needByDateInStore!,
        rfqOpenDateInStore!,
        rfqCloseDateInStore!,
        etrInStore!,
        headerAttachment,
        // headerMime,
        // headerAttachmentFileName!,
        currencyInStore!,
        parseInt(billToAddressInStore!),
        parseInt(shipToAddressInStore!),
        "SUBMIT",
        Number.isNaN(vatPercentageInStore) ? 0 : vatPercentageInStore!,
        vatApplicableStatusInStore!,
        buyerAttachmentInStore,
        selectedGeneralterm!,
        //new add
        freightTermInStore!,
        parseInt(paymentTermInStore!),
        invoiceTypeInstore!,
        noteInStore!,
        orgIdInStore,
        matchOptionInStore,
        rateTypeInStore,
        rateDateInStore,
        conversionRateInStore,
        department!,
        approvalTypeInStore

        // fob
      );
      console.log(result.data);
      // setIsSavepressed(false);

      if (result.data.status === 200) {
        // showSuccessToast(result.data.message);

        // if (conPrItem3.length !== 0) {
        //   for (let i = 0; i < conPrItem3.length; i++) {
        //     console.log(rfqIdInStore);
        //     console.log(conPrItem3[i]);

        //     saveLineItemToRfq(rfqIdInStore!, conPrItem3[i]);
        //   }
        // }

        console.log("update er somoy", conPrItem4.length);

        if (conPrItem3.length !== 0) {
          for (let i = 0; i < conPrItem3.length; i++) {
            console.log(rfqIdInStore);
            console.log(conPrItem4[i]);

            saveLineItemToRfq(rfqIdInStore!, conPrItem3[i]);
          }
        }
        if (conPrItem4.length !== 0) {
          for (let i = 0; i < conPrItem4.length; i++) {
            console.log(rfqIdInStore);
            console.log(conPrItem4[i]);

            updateLineItemToRfq(rfqIdInStore!, conPrItem4[i]);
          }
        }

        // if (conPrItem3.length !== 0) {
        //   for (let i = 0; i < conPrItem3.length; i++) {
        //     console.log(rfqIdInStore);
        //     console.log(conPrItem4[i]);

        //     saveLineItemToRfq(rfqIdInStore!, conPrItem3[i]);
        //   }
        // }

        //todo jar 1 LEADRY ASE take email pathabo na

        const findedEmailForSent = previouslyInvitedSupplierList.filter(
          (sup) => sup.EMAIL_SENT_STATUS === 0
        );
        console.log(findedEmailForSent);

        if (findedEmailForSent.length > 0) {
          const convs = findedEmailForSent.map((sup) => ({
            SUPPLIER_ID: sup.USER_ID,

            EMAIL: !sup.EMAIL ? sup.ADDITIONAL_EMAIL : sup.EMAIL, // Assign default or fetch actual data if available
            ADDITIONAL_EMAIL: sup.ADDITIONAL_EMAIL || null, // Optional

            INVITATION_ID: sup.INVITATION_ID,
            EMAIL_SENT_STATUS: 1, // Explicitly setting this as required
          }));

          inviteSupplierToRfq(
            rfqIdInStore!,
            rfqTitleInStore!,
            rfqTypeInStore!,
            rfqCloseDateInStore!,
            convs // Ensuring the array is of type SelectedSupplierInterface[]
          );
        }

        if (invitedSuppliers.length > 0) {
          const convertedSuppliers = invitedSuppliers.map((sup) => ({
            SUPPLIER_ID: sup.USER_ID,
            EMAIL: sup.EMAIL,
            ADDITIONAL_EMAIL: sup.ADDITIONAL_EMAIL || null, // Optional

            INVITATION_ID: null,
            EMAIL_SENT_STATUS: 1, // Explicitly setting this as required
          }));

          console.log("update: ", convertedSuppliers);

          console.log(result.data);
          inviteSupplierToRfq(
            rfqIdInStore!,
            rfqTitleInStore!,
            rfqTypeInStore!,
            rfqCloseDateInStore!,
            convertedSuppliers
          );
        }

        setIsLoading(false);
        showSuccessToast("Rfq Published Successfully");
        setRfqIdInStore(null);
        setRfqStatusInStore("");
        setSelectedGeneralterm("");
        setIsCreateRfq(false);
        setSavedPritemLength(null);
        setInvitedSuppliers([]);
        setOrgNameInStore("");
        setApprovalTypeInStore("");
        setPrItems([]);
        setPrItems2([]);
        setPage(1);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      console.log(error);

      showErrorToast("Published Failed. Try Again");
    }
  };
  const updateRfq2 = async () => {
    if (prItems.length > 0) {
      conPrItem3 = prItems.map((e, i) => ({
        RFQ_LINE_ID: e.RFQ_LINE_ID,
        RFQ_ID: e.RFQ_ID,
        LINE_TYPE_ID: e.LINE_TYPE_ID,

        ITEM_DESCRIPTION: e.ITEM_DESCRIPTION,
        EXPECTED_QUANTITY: e.EXPECTED_QUANTITY,
        EXPECTED_BRAND_NAME: e.EXPECTED_BRAND_NAME,
        EXPECTED_ORIGIN: e.EXPECTED_ORIGIN,
        LCM_ENABLE_FLAG:
          department === "Local" && e.LCM_ENABLE_FLAG === "Y"
            ? "N"
            : e.LCM_ENABLE_FLAG,
        NOTE_TO_SUPPLIER: e.NOTE_TO_SUPPLIER,
        WARRANTY_ASK_BY_BUYER: e.WARRANTY_ASK_BY_BUYER,
        WARRANTY_BY_SUPPLIER: e.WARRANTY_BY_SUPPLIER,
        BUYER_VAT_APPLICABLE: e.BUYER_VAT_APPLICABLE,
        SUPPLIER_VAT_APPLICABLE: e.SUPPLIER_VAT_APPLICABLE,
        OFFERED_QUANTITY: e.OFFERED_QUANTITY,
        PROMISE_DATE: e.PROMISE_DATE,
        CS_STATUS: e.CS_STATUS,
        LAST_UPDATED_BY: e.LAST_UPDATED_BY,
        LAST_UPDATE_DATE: e.LAST_UPDATE_DATE,
        USER_NAME: e.USER_NAME,
        PREPARER_ID: e.PREPARER_ID,
        PR_NUMBER: e.PR_NUMBER,
        REQUISITION_HEADER_ID: e.REQUISITION_HEADER_ID,
        REQUISITION_LINE_ID: e.REQUISITION_LINE_ID,
        CREATION_DATE: e.CREATION_DATE,
        DESCRIPTION: e.DESCRIPTION,
        CREATED_BY: e.CREATED_BY,
        AUTHORIZATION_STATUS: e.AUTHORIZATION_STATUS,
        APPROVED_DATE: e.APPROVED_DATE,
        PR_FROM_DFF: e.PR_FROM_DFF,
        LINE_NUM: savedPrItemLength! + i + 1,
        CATEGORY_ID: e.CATEGORY_ID,
        ITEM_ID: e.ITEM_ID,
        ITEM_CODE: e.ITEM_CODE,
        UNIT_MEAS_LOOKUP_CODE: e.UNIT_MEAS_LOOKUP_CODE,
        UNIT_PRICE: e.UNIT_PRICE,
        QUANTITY: e.QUANTITY,
        NEED_BY_DATE: e.NEED_BY_DATE,
        DELIVER_TO_LOCATION_ID: e.DELIVER_TO_LOCATION_ID,
        DESTINATION_ORGANIZATION_ID: e.DESTINATION_ORGANIZATION_ID,
        ATTRIBUTE_CATEGORY: e.ATTRIBUTE_CATEGORY,
        BRAND: e.BRAND,
        ORIGIN: e.ORIGIN,
        ITEM_SPECIFICATION: e.ITEM_SPECIFICATION,
        WARRANTY_DETAILS: e.WARRANTY_DETAILS,
        PACKING_TYPE: e.PACKING_TYPE,
        ATTRIBUTE6: e.ATTRIBUTE6,
        PROJECT_NAME: e.PROJECT_NAME,
        ORG_ID: e.ORG_ID,
        CLOSED_CODE: e.CLOSED_CODE,
        INVENTORY_ORG_NAME: e.INVENTORY_ORG_NAME,
        // BUYER_FILE_NAME: String,
        BUYER_FILE: e.BUYER_FILE,
        BUYER_FILE_ORG_NAME: e.BUYER_FILE_ORG_NAME,
        COUNTER: e.COUNTER,
        REQUESTOR_NAME: e.REQUESTOR_NAME,
        BUYER_FILE_NAME: e.BUYER_FILE_NAME,
        RATE_TYPE: rateTypeInStore,
        RATE_DATE: moment(rateDateInStore).format("DD-MMM-YY HH:mm:ss"),
        CONVERSION_RATE: conversionRateInStore,
        MATCH_OPTION: matchOptionInStore,
        PR_LINE_NUM: e.PR_LINE_NUM,
        PR_CREATION_DATE: e.PR_CREATION_DATE,
        LINE_STATUS: "Y",
        LINE_TYPE: e.LINE_TYPE,
      }));
    }
    console.log(conPrItem3);

    if (prItems2.length > 0) {
      conPrItem4 = prItems2.map((e, i) => ({
        RFQ_LINE_ID: e.RFQ_LINE_ID,
        RFQ_ID: e.RFQ_ID,
        LINE_TYPE_ID: e.LINE_TYPE_ID,
        ITEM_DESCRIPTION: e.ITEM_DESCRIPTION,
        EXPECTED_QUANTITY: e.EXPECTED_QUANTITY,
        EXPECTED_BRAND_NAME: e.EXPECTED_BRAND_NAME,
        EXPECTED_ORIGIN: e.EXPECTED_ORIGIN,
        LCM_ENABLE_FLAG:
          department === "Local" && e.LCM_ENABLE_FLAG === "Y"
            ? "N"
            : e.LCM_ENABLE_FLAG,
        NOTE_TO_SUPPLIER: e.NOTE_TO_SUPPLIER,
        WARRANTY_ASK_BY_BUYER: e.WARRANTY_ASK_BY_BUYER,
        WARRANTY_BY_SUPPLIER: e.WARRANTY_BY_SUPPLIER,
        BUYER_VAT_APPLICABLE: e.BUYER_VAT_APPLICABLE,
        SUPPLIER_VAT_APPLICABLE: e.SUPPLIER_VAT_APPLICABLE,
        OFFERED_QUANTITY: e.OFFERED_QUANTITY,
        PROMISE_DATE: e.PROMISE_DATE,
        CS_STATUS: e.CS_STATUS,
        LAST_UPDATED_BY: e.LAST_UPDATED_BY,
        LAST_UPDATE_DATE: e.LAST_UPDATE_DATE,
        USER_NAME: e.USER_NAME,
        PREPARER_ID: e.PREPARER_ID,
        PR_NUMBER: e.PR_NUMBER,
        REQUISITION_HEADER_ID: e.REQUISITION_HEADER_ID,
        REQUISITION_LINE_ID: e.REQUISITION_LINE_ID,
        CREATION_DATE: e.CREATION_DATE,
        DESCRIPTION: e.DESCRIPTION,
        CREATED_BY: e.CREATED_BY,
        AUTHORIZATION_STATUS: e.AUTHORIZATION_STATUS,
        APPROVED_DATE: e.APPROVED_DATE,
        PR_FROM_DFF: e.PR_FROM_DFF,
        LINE_NUM: i + 1,
        CATEGORY_ID: e.CATEGORY_ID,
        ITEM_ID: e.ITEM_ID,
        ITEM_CODE: e.ITEM_CODE,
        UNIT_MEAS_LOOKUP_CODE: e.UNIT_MEAS_LOOKUP_CODE,
        UNIT_PRICE: e.UNIT_PRICE,
        QUANTITY: e.QUANTITY,
        NEED_BY_DATE: e.NEED_BY_DATE,
        DELIVER_TO_LOCATION_ID: e.DELIVER_TO_LOCATION_ID,
        DESTINATION_ORGANIZATION_ID: e.DESTINATION_ORGANIZATION_ID,
        ATTRIBUTE_CATEGORY: e.ATTRIBUTE_CATEGORY,
        BRAND: e.BRAND,
        ORIGIN: e.ORIGIN,
        ITEM_SPECIFICATION: e.ITEM_SPECIFICATION,
        WARRANTY_DETAILS: e.WARRANTY_DETAILS,
        PACKING_TYPE: e.PACKING_TYPE,
        ATTRIBUTE6: e.ATTRIBUTE6,
        PROJECT_NAME: e.PROJECT_NAME,
        ORG_ID: e.ORG_ID,
        CLOSED_CODE: e.CLOSED_CODE,
        INVENTORY_ORG_NAME: e.INVENTORY_ORG_NAME,
        // BUYER_FILE_NAME: String,
        BUYER_FILE: e.BUYER_FILE,
        BUYER_FILE_ORG_NAME: e.BUYER_FILE_ORG_NAME,
        COUNTER: e.COUNTER,
        REQUESTOR_NAME: e.REQUESTOR_NAME,
        BUYER_FILE_NAME: e.BUYER_FILE_NAME,
        RATE_TYPE: rateTypeInStore,
        RATE_DATE: moment(rateDateInStore).format("DD-MMM-YY HH:mm:ss"),
        CONVERSION_RATE: conversionRateInStore,
        MATCH_OPTION: matchOptionInStore,
        PR_LINE_NUM: e.LINE_NUM,
        PR_CREATION_DATE: e.PR_CREATION_DATE,
        LINE_STATUS: "Y",
        LINE_TYPE: e.LINE_TYPE,
      }));
    }

    console.log(conPrItem4);

    console.log("close date on update", rfqCloseDateInStore);

    try {
      const result = await RfqHeaderUpdateService(
        token!,

        rfqIdInStore!,
        rfqSubjectInStore!,
        rfqTitleInStore!,
        rfqTypeInStore!,
        needByDateInStore!,
        rfqOpenDateInStore!,
        rfqCloseDateInStore!,
        etrInStore!,
        headerAttachment,
        // headerMime,
        // headerAttachmentFileName!,
        currencyInStore!,
        parseInt(billToAddressInStore!),
        parseInt(shipToAddressInStore!),
        "SAVE",
        Number.isNaN(vatPercentageInStore) ? 0 : vatPercentageInStore!,
        vatApplicableStatusInStore!,
        buyerAttachmentInStore,
        selectedGeneralterm!,
        //new add
        freightTermInStore!,
        parseInt(paymentTermInStore!),
        invoiceTypeInstore!,
        noteInStore!,
        orgIdInStore,
        matchOptionInStore,
        rateTypeInStore,
        rateDateInStore,
        conversionRateInStore,
        department!,
        approvalTypeInStore

        // fob
      );
      console.log(result.data);
      // setIsSavepressed(false);

      if (result.data.status === 200) {
        // showSuccessToast(result.data.message);

        // if (conPrItem3.length !== 0) {
        //   for (let i = 0; i < conPrItem3.length; i++) {
        //     console.log(rfqIdInStore);
        //     console.log(conPrItem3[i]);

        //     saveLineItemToRfq(rfqIdInStore!, conPrItem3[i]);
        //   }
        // }

        console.log("update er somoy", conPrItem4.length);

        if (conPrItem3.length !== 0) {
          for (let i = 0; i < conPrItem3.length; i++) {
            console.log(rfqIdInStore);
            console.log(conPrItem4[i]);

            saveLineItemToRfq(rfqIdInStore!, conPrItem3[i]);
          }
        }
        if (conPrItem4.length !== 0) {
          for (let i = 0; i < conPrItem4.length; i++) {
            console.log(rfqIdInStore);
            console.log(conPrItem4[i]);

            updateLineItemToRfq(rfqIdInStore!, conPrItem4[i]);
          }
        }

        if (invitedSuppliers.length > 0) {
          const convertedSuppliers = invitedSuppliers.map((supplier) => ({
            ...supplier,
            SUPPLIER_ID: supplier.USER_ID,
            EMAIL_SENT_STATUS: 0,
          }));

          console.log("update: ", convertedSuppliers);

          console.log(result.data);
          inviteSupplierToRfq(
            rfqIdInStore!,
            rfqTitleInStore!,
            rfqTypeInStore!,
            rfqCloseDateInStore!,
            convertedSuppliers
          );
        }

        setIsLoading(false);
        showSuccessToast("Rfq Saved Successfully");
        // if (rfqIdInStore === null) {
        // } else {
        //   showSuccessToast("Rfq Updated Successfully");
        // }

        setRfqIdInStore(null);
        setRfqStatusInStore("");
        setSelectedGeneralterm("");
        setIsCreateRfq(false);
        setSavedPritemLength(null);
        setInvitedSuppliers([]);
        setOrgNameInStore("");
        setApprovalTypeInStore("");
        setPrItems([]);
        setPrItems2([]);
        setPage(1);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      console.log(error);

      showErrorToast("Save Failed. Try Again");
    }
  };
  //update Rfq

  //update rfq item
  const updateLineItemToRfq = async (
    rfqId: number,
    pritem: PrItemInterface
  ) => {
    console.log(pritem);

    try {
      const result = await UpdateLineItemToRfqService(token!, rfqId, pritem);
      console.log(result.data);

      if (result.data.status === 200) {
      } else {
      }
    } catch (error) {
      console.log(error);
      showErrorToast("Line Update Failed");
    }
  };
  //update rfq item

  //SaveLineItemToService
  const saveLineItemToRfq = async (
    rfqId: number,
    pritem: PrItemInterface //SelectedPrItemInterface silo
  ) => {
    try {
      const result = await SaveLineItemToService(token!, rfqId, pritem);
      console.log(result.data);

      if (result.data.status === 200) {
      } else {
      }
    } catch (error) {
      console.log(error);
      showErrorToast("Rfq Save Failed");
    }
  };
  //SaveLineItemToService

  //INVITE SUPPLIER
  const inviteSupplierToRfq = async (
    rfqId: number,
    RFQ_TITLE: string,
    RFQ_TYPE: string,
    CLOSE_DATE: string,
    invitedSuppliers: any[]
    // invitedSuppliers: SelectedSupplierInterface[]
  ) => {
    try {
      const result = await InviteSupplierForRfqService(
        token!,
        rfqId,
        RFQ_TITLE,
        RFQ_TYPE,
        CLOSE_DATE,
        invitedSuppliers
      );
      console.log(result.data);

      if (result.data.status === 200) {
        setInvitedSuppliers([]);
      } else {
      }
    } catch (error) {
      console.log(error);
      showErrorToast("Invite Supplier Failed");
    }
  };

  //INVITE SUPPLIER

  //context
  const { page, setPage } = useRfqCreateProcessContext();
  // const submitAndNext = () => {
  //     setPage(6);
  // }
  const previousPage = () => {
    setPage(4);
  };

  //context
  const { loggedInUserName } = useAuthStore();
  //context

  const convertTo12HourFormat = (timestamp: string): string => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Handle 0 hour
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${date.getDate()}-${date.toLocaleString("default", {
      month: "short",
    })}-${date
      .getFullYear()
      .toString()
      .slice(
        2
      )} ${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
  };

  function convertToTSXFormat(dateTimeString: string): string {
    const dateTime = new Date(dateTimeString);
    const year = dateTime.getFullYear().toString().slice(-2);
    const month = getMonthAbbreviation(dateTime.getMonth() + 1);
    const day = dateTime.getDate().toString().padStart(2, "0");
    return `${day}-${month}-${year}`;
  }

  function getMonthAbbreviation(month: number): string {
    const monthsAbbreviations = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return monthsAbbreviations[month - 1];
  }

  const handleCanEdit = (index: number) => {
    const newPreviouslySelectedSupplierList = [
      ...previouslyInvitedSupplierList,
    ];
    newPreviouslySelectedSupplierList[index].CAN_EDIT =
      newPreviouslySelectedSupplierList[index].CAN_EDIT === 0 ? 1 : 0;
    console.log("can edit", newPreviouslySelectedSupplierList[index].CAN_EDIT);
    changePermission(
      newPreviouslySelectedSupplierList[index].USER_ID,
      newPreviouslySelectedSupplierList[index].CAN_EDIT!
    );

    // setPrItemList(newPrItemList);
    setPreviouslyInvitedSupplierList(newPreviouslySelectedSupplierList);
  };

  const changePermission = async (supplierId: number, canEdit: number) => {
    try {
      const result = await RfqEditPermissionService(
        token!,
        rfqIdInStore!,
        supplierId,
        canEdit
      );

      if (result.data.status === 200) {
        showSuccessToast(result.data.message);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Edit Permission Change Failed");
    }
  };

  // delete supplier start

  const [isWarningShow, setIsWarningShow] = useState(false);
  const [selectedSupplier, setSelectedSupplier] =
    useState<PreviouslySelectedSupplierInterface | null>(null);

  const openWarningModal = () => {
    setIsWarningShow(true);
  };

  const closeWarningModal = () => {
    setIsWarningShow(false);
  };

  const removeSupplierInfo = (supInfo: PreviouslySelectedSupplierInterface) => {
    console.log("info: ", supInfo);
    setSelectedSupplier(supInfo);
  };

  const removeSupplier = async () => {
    setIsLoading(true);
    console.log("remove");

    const result = await DeleteInviteSupplierService(token!, [
      {
        INVITATION_ID: selectedSupplier?.INVITATION_ID?.toString() ?? "",
        EMAIL: selectedSupplier?.ADDITIONAL_EMAIL.toString() ?? "",
        EMAIL_SENT_STATUS:
          selectedSupplier?.EMAIL_SENT_STATUS?.toString() ?? "",
      },
    ]);
    console.log("result: ", result.statusCode);
    if (result.statusCode === 200) {
      showSuccessToast(result.data.message);
      // setPreviouslyInvitedSupplierList(rfqDetailsInStore?.supplier_list!);
      getRfqDetails();
    } else {
      showErrorToast(result.data.message);
    }

    setIsLoading(false);
  };

  const getRfqDetails = async () => {
    try {
      setIsLoading(true);
      const result = await RfqDetailsService(token!, rfqIdInStore!, 0, 100000);

      if (result.data.status === 200) {
        console.log(result.data);
        console.log(result.data.supplier_list);

        setPreviouslyInvitedSupplierList(result.data.supplier_list);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      showErrorToast("Rfq Details Load Failed");
      setIsLoading(false);
    }
  };

  // delete supplier end

  return (
    <div className=" m-8">
      <SuccessToast />

      <WarningModal
        isOpen={isWarningShow}
        closeModal={closeWarningModal}
        action={removeSupplier}
        message="Do You Want To Delete"
        imgSrc="/images/warning.png"
      />

      <div className=" w-full py-4 px-4 bg-inputBg shadow-sm rounded-md ">
        <PageTitle titleText="Preview" />
        <div className="h-4"></div>
        <InputLebel titleText={"Header"} />
        <div className=" h-4"></div>
        <div className=" p-4 w-full bg-whiteColor border-[0.5px] border-borderColor rounded-md">
          <div className=" flex flex-row space-x-12  items-center">
            <div className=" w-28 text-sm font-mon text-graishColor font-medium">
              Rfq Title
            </div>
            <div className=" w-52 text-sm font-mon text-blackColor font-medium">
              {rfqTitleInStore}
            </div>
            <div className=" w-36 text-sm font-mon text-graishColor font-medium">
              Open Date
            </div>
            <div className=" w-52 text-sm font-mon text-blackColor font-medium flex flex-row space-x-4 items-center">
              <div>{convertTo12HourFormat(rfqOpenDateInStore!)}</div>
            </div>
          </div>
          <div className="h-3"></div>
          <div className=" flex flex-row space-x-12  items-center">
            <div className=" w-28 text-sm font-mon text-graishColor font-medium">
              Rfq Subject
            </div>
            <div className=" w-52 text-sm font-mon text-blackColor font-medium">
              {rfqSubjectInStore}
            </div>
            <div className=" w-36 text-sm font-mon text-graishColor font-medium">
              Close Date
            </div>
            <div className=" w-52 text-sm font-mon text-blackColor font-medium flex flex-row space-x-4 items-center">
              <div>{convertTo12HourFormat(rfqCloseDateInStore!)}</div>
              {/* <div>11:00 AM</div> */}
            </div>
          </div>
          <div className="h-3"></div>
          <div className=" flex flex-row space-x-12  items-center">
            <div className=" w-28 text-sm font-mon text-graishColor font-medium">
              Prepared By
            </div>
            <div className=" w-52 text-sm font-mon text-blackColor font-medium">
              {loggedInUserName}
            </div>
            <div className=" w-36 text-sm font-mon text-graishColor font-medium">
              Type
            </div>
            <div className=" w-52 text-sm font-mon text-blackColor font-medium flex flex-row space-x-4 items-center">
              <div className=" flex-1 flex flex-row space-x-2 items-center">
                <div
                  className={`${
                    rfqTypeInStore === "T"
                      ? " bg-midGreen"
                      : " border-[1px] border-borderColor "
                  } rounded-[4px] h-4 w-4 flex justify-center items-center`}
                >
                  <img
                    src="/images/check.png"
                    alt="check"
                    className=" w-2 h-2"
                  />
                </div>
                <p>Technical</p>
              </div>
              <div className=" flex-1 flex flex-row space-x-2 items-center">
                <div
                  className={`${
                    rfqTypeInStore === "B"
                      ? " bg-midGreen"
                      : " border-[1px] border-borderColor "
                  } rounded-[4px] h-4 w-4 flex justify-center items-center`}
                >
                  <img
                    src="/images/check.png"
                    alt="check"
                    className=" w-2 h-2"
                  />
                </div>
                <p>Both</p>
              </div>
              {/* <div>11:00 AM</div> */}
            </div>
          </div>
          <div className="h-3"></div>
          <div className=" flex flex-row space-x-12  items-center">
            <div className=" w-28 text-sm font-mon text-graishColor font-medium">
              Need by date
            </div>
            <div className=" w-52 text-sm font-mon text-blackColor font-medium">
              {convertToTSXFormat(needByDateInStore!)}
            </div>
            <div className=" w-36 text-sm font-mon text-graishColor font-medium">
              Attachment
            </div>
            <div className=" w-52 text-sm font-mon text-blackColor font-medium flex flex-row space-x-4 items-center">
              <div>
                {headerAttachment?.name === undefined
                  ? "N/A"
                  : headerAttachment?.name}
              </div>
              {/* <div>11:00 AM</div> */}
            </div>
          </div>
        </div>
        <div className="h-4"></div>
        <InputLebel titleText={"Buyer Terms"} />
        <div className=" h-4"></div>
        <div className=" border-[1px] border-borderColor p-8 rounded-md shadow-sm bg-inputBg w-full   items-start space-y-6 ">
          <div className=" w-full flex flex-row justify-between items-center">
            <div className="flex flex-row space-x-4 items-center">
              <p className="w-36  text-grayColor text-sm font-medium font-mon">
                Freight Term
              </p>
              {freightTermName}
            </div>
            <div className="flex flex-row space-x-4 items-center">
              <p className="w-28 text-grayColor text-sm font-medium font-mon ">
                Payment Term
              </p>

              <div className=" w-72">{paymentTermName}</div>
            </div>
          </div>
          <div className=" w-full flex flex-row justify-between items-center">
            <div className="flex flex-row space-x-4 items-center">
              <p className="w-36  text-grayColor text-sm font-medium font-mon">
                FOB
              </p>
              {fobInStore === "" ? "N/A" : fobInStore}
            </div>
            <div className="flex flex-row space-x-4 items-center">
              <p className="w-28 text-grayColor text-sm font-medium font-mon ">
                Attachment
              </p>

              <div className=" w-72">
                {buyerAttachmentInStore?.name === undefined
                  ? "N/A"
                  : buyerAttachmentInStore?.name}
              </div>
            </div>
          </div>
          <div className=" w-full flex flex-row justify-between items-center">
            <div className="flex flex-row space-x-4 items-center">
              <p className="w-36  text-grayColor text-sm font-medium font-mon">
                Currency
              </p>
              {currencyInStore}
            </div>
            <div className="flex flex-row space-x-4 items-center">
              <p className="w-28 text-grayColor text-sm font-medium font-mon ">
                ETR
              </p>

              <div className=" w-72">
                {etrInStore === null || !etrInStore
                  ? "---"
                  : convertToTSXFormat(etrInStore!)}
              </div>
            </div>
          </div>
          <div className=" w-full flex flex-row justify-between items-center">
            <div className="flex flex-row space-x-4 items-center">
              <p className="w-36  text-grayColor text-sm font-medium font-mon">
                Match Option
              </p>
              {matchOptionInStore}
            </div>

            <div className="flex flex-row space-x-4 items-center">
              <p className="w-28 text-grayColor text-sm font-medium font-mon ">
                Rate Type
              </p>

              <div className=" w-72">
                {rateTypeInStore === "" ? "---" : rateTypeInStore}
              </div>
              {/* <div className=" w-72">{convertToTSXFormat(etrInStore!)}</div> */}
            </div>
          </div>
          <div className=" w-full flex flex-row justify-between items-center">
            <div className="flex flex-row space-x-4 items-center">
              <p className="w-36  text-grayColor text-sm font-medium font-mon">
                Rate Date
              </p>

              {rateDateInStore === ""
                ? "---"
                : convertToTSXFormat(rateDateInStore!)}
            </div>
            <div className="flex flex-row space-x-4 items-center">
              <p className="w-28 text-grayColor text-sm font-medium font-mon ">
                Conversion Rate
              </p>

              <div className=" w-72">
                {conversionRateInStore === "" ? "---" : conversionRateInStore}
              </div>
              {/* <div className=" w-72">{convertToTSXFormat(etrInStore!)}</div> */}
            </div>
          </div>
          <div className=" w-full flex flex-row justify-between items-center">
            <div className="flex flex-row space-x-4 items-center">
              <p className="w-36  text-grayColor text-sm font-medium font-mon">
                Bill To Address
              </p>
              {billToAddress}
            </div>
            <div className="flex flex-row space-x-4 items-center">
              <p className="w-28 text-grayColor text-sm font-medium font-mon ">
                Ship To Address
              </p>

              <div className=" w-72">{shipToAddress}</div>
            </div>
          </div>

          <div className="w-full flex flex-row justify-between items-center">
            {/* <div className="flex flex-row space-x-4 items-center">
              <p className="w-36 text-grayColor text-sm font-medium font-mon">
                Invoice Type
              </p>
              {invoiceName}
            </div> */}
            <div className="flex flex-row space-x-4 items-center">
              <p className="w-28 text-grayColor text-sm font-medium font-mon">
                VAT Applicable
              </p>
              <div className=" w-72">
                <button
                  className={`w-4 h-4 rounded-md border-[0.5px] border-borderColor flex justify-center items-center ${
                    vatApplicableStatusInStore === "Y"
                      ? "bg-midGreen border-none"
                      : null
                  }`}
                >
                  {vatApplicableStatusInStore === "Y" ? (
                    <img
                      src="/images/check.png"
                      alt="check"
                      className=" w-2 h-2"
                    />
                  ) : null}
                </button>
              </div>
            </div>
          </div>
          <div className=" w-full flex flex-row justify-between items-center">
            <div className="flex flex-row space-x-4 items-center">
              <p className="w-36  text-grayColor text-sm font-medium font-mon"></p>
              <p></p>
            </div>
            <div className="flex flex-row space-x-4 items-center">
              <p className="w-28 text-grayColor text-sm font-medium font-mon ">
                VAT
              </p>

              <div className=" w-72">
                {Number.isNaN(vatPercentageInStore)
                  ? `${"N/A"}`
                  : `${vatPercentageInStore}%`}
              </div>
            </div>
          </div>
        </div>

        {/* <div className=" p-4 w-full bg-whiteColor border-[0.5px] border-borderColor rounded-md">
          <div className=" flex flex-row space-x-12  items-center">
            <div className=" w-28 text-sm font-mon text-graishColor font-medium">
              Bill to Address
            </div>
            <div className=" w-52 text-sm font-mon text-blackColor font-medium">
              address dsve rt rthtrhth 4h 445 4h4 4
            </div>
            <div className=" w-36 text-sm font-mon text-graishColor font-medium">
              Currency
            </div>
            <div className=" w-52 text-sm font-mon text-blackColor font-medium flex flex-row space-x-4 items-center">
              BDT
            </div>
          </div>
          <div className="h-3"></div>
          <div className=" flex flex-row space-x-12  items-center">
            <div className=" w-28 text-sm font-mon text-graishColor font-medium">
              Freight Term
            </div>
            <div className=" w-52 text-sm font-mon text-blackColor font-medium">
              Sample Name here
            </div>
            <div className=" w-36 text-sm font-mon text-graishColor font-medium">
              Close Date
            </div>
            <div className=" w-52 text-sm font-mon text-blackColor font-medium flex flex-row space-x-4 items-center">
              img000979887.png
            </div>
          </div>
          <div className="h-3"></div>
          <div className=" flex flex-row space-x-12  items-center">
            <div className=" w-28 text-sm font-mon text-graishColor font-medium">
              FOB
            </div>
            <div className=" w-52 text-sm font-mon text-blackColor font-medium">
              Sample Name here
            </div>
          </div>
        </div> */}
        <div className="h-4"></div>
        <InputLebel titleText={"Note"} />
        <div className=" h-4"></div>
        <div className=" p-4 w-full bg-whiteColor border-[0.5px] border-borderColor rounded-md">
          <p className="text-sm font-mon text-blackColor font-medium">
            {!noteInStore ? "N/A" : noteInStore}
          </p>
        </div>
        <div className="h-4"></div>
        {isCreateRfq ? null : (
          <div>
            {isLoaing ? (
              <div className=" w-full flex justify-center items-center">
                <LogoLoading />
              </div>
            ) : (
              <>
                {rfqDetailsInStore?.supplier_list.length === 0 ? (
                  <div className=" w-full flex  justify-center items-center">
                    <h1 className=" text-sm font-mon font-semibold text-midBlack">
                      {notFoundText}
                    </h1>
                  </div>
                ) : (
                  <div>
                    <InputLebel titleText={labelText} />
                    <div className=" h-4"></div>

                    <div className="overflow-x-auto">
                      <table
                        className="min-w-full divide-y divide-gray-200"
                        style={{ tableLayout: "fixed" }}
                      >
                        <thead className="sticky top-0 bg-[#FFF5DB] h-14">
                          <tr>
                            <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  ">
                              SL
                            </th>
                            <th className=" font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                              Response Status
                            </th>
                            <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                              Supplier ID
                            </th>

                            <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                              Award Times
                            </th>
                            <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                              Last Award Date
                            </th>

                            <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                              Additional Contact Mail
                            </th>
                            <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                              RFQ Edit Permission
                            </th>

                            <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                              Action
                            </th>
                          </tr>
                        </thead>

                        {rfqDetailsInStore?.supplier_list.length &&
                          previouslyInvitedSupplierList.map((e, i) => (
                            <tbody
                              className="bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]"
                              key={i}
                            >
                              <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap font-medium">
                                {i + 1}
                              </td>
                              <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                                {e.RESPONSE_STATUS === 0
                                  ? "Not Viewed"
                                  : e.RESPONSE_STATUS === 1
                                  ? "Accepted"
                                  : e.RESPONSE_STATUS === 2
                                  ? "Viewed"
                                  : e.RESPONSE_STATUS === 3
                                  ? "Rejected"
                                  : e.RESPONSE_STATUS === 4
                                  ? "Submit"
                                  : e.RESPONSE_STATUS === 5
                                  ? "Saved"
                                  : ""}
                              </td>
                              <td className="  font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                                {e.REGISTRATION_ID}
                              </td>

                              <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                                {!e.TOTAL_PO === null ? "---" : e.TOTAL_PO}
                              </td>
                              <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                                {e.PO_DATE === ""
                                  ? "---"
                                  : isoToDateTime(e.PO_DATE)}
                              </td>

                              <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                                {!e.ADDITIONAL_EMAIL
                                  ? "N/A"
                                  : e.ADDITIONAL_EMAIL}
                              </td>
                              <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                                <input
                                  onClick={() => {
                                    handleCanEdit(i);
                                  }}
                                  type="checkbox"
                                  className="toggle toggle-success"
                                  checked={e.CAN_EDIT === 1 ? true : false}
                                />
                              </td>

                              <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                                <button
                                  className={`flex items-center justify-center ${
                                    e.EMAIL_SENT_STATUS === 1
                                      ? "cursor-not-allowed opacity-50"
                                      : "text-red-500"
                                  }`}
                                  disabled={e.EMAIL_SENT_STATUS === 1}
                                  onClick={() => {
                                    openWarningModal();
                                    removeSupplierInfo(e);
                                  }}
                                >
                                  <DeleteIcon />
                                </button>
                              </td>
                            </tbody>
                          ))}
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <div className="h-4"></div>

        {invitedSuppliers.length === 0 ? null : ( // </div> //   </h1> //     No Supplier Found //   <h1 className=" text-sm font-mon font-semibold text-midBlack"> // <div className=" w-full flex  justify-center items-center">
          <div>
            <InputLebel
              titleText={`${
                !isCreateRfq ? "New Invited Supplier" : "Invited Supplier"
              }`}
            />
            <div className=" h-4"></div>

            <div className="overflow-x-auto">
              <table
                className="min-w-full divide-y divide-gray-200"
                style={{ tableLayout: "fixed" }}
              >
                <thead className="sticky top-0 bg-[#FFF5DB] h-14">
                  <tr>
                    <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  ">
                      SL
                    </th>
                    <th className=" font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                      Supplier Name
                    </th>
                    <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                      Supplier ID
                    </th>
                    {/* <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                      Suppliyer Type
                    </th> */}
                    <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                      Award Times
                    </th>
                    <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                      Last Award Date
                    </th>
                    <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                      Supplier Site
                    </th>
                    <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                      Contact
                    </th>

                    <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                      Contact Email
                    </th>
                    <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                      Additional Contact Mail
                    </th>

                    {/* Add more header columns as needed */}
                  </tr>
                </thead>

                {/* Table rows go here */}
                {/* Table rows go here */}
                {invitedSuppliers.map((e, i) => (
                  <tbody
                    className="bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]"
                    key={i}
                  >
                    <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap font-medium">
                      {i + 1}
                    </td>
                    <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                      {e.SUPPLIER_NAME === "" ? "---" : e.SUPPLIER_NAME}
                    </td>
                    <td className="  font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                      {e.REGISTRATION_ID === null ? "---" : e.REGISTRATION_ID}
                    </td>
                    {/* <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                      not interface
                    </td> */}
                    <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                      {!e.TOTAL_PO === null ? "---" : e.TOTAL_PO}
                    </td>
                    <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                      {e.PO_DATE === "" ? "---" : isoToDateTime(e.PO_DATE)}
                    </td>
                    <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                      {e.SITE_NAME === "" ? "---" : e.SITE_NAME}
                    </td>
                    <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                      {e.NAME === "" ? "---" : e.NAME}
                    </td>

                    <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                      {e.CONTACT_EMAIL === "" ? "---" : e.CONTACT_EMAIL}
                    </td>
                    <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                      {/* {!e.ADDITIONAL_EMAIL ? "N/A" : e.ADDITIONAL_EMAIL} */}
                      {!e.ADDITIONAL_EMAIL ? "---" : e.ADDITIONAL_EMAIL}
                    </td>
                  </tbody>
                ))}
              </table>
            </div>
          </div>
        )}
        <div>
          {isCreateRfq ? null : prItems2.length === 0 ? (
            <div className=" w-full flex justify-center items-center"></div>
          ) : (
            <>
              <div className=" h-6"></div>
              <InputLebel titleText={"Previously Selected Item"} />
              <div className=" h-6"></div>
              <div className="overflow-x-auto">
                <table
                  className="min-w-full divide-y divide-gray-200"
                  style={{ tableLayout: "fixed" }}
                >
                  <thead className="sticky top-0 bg-[#F4F6F8] h-14">
                    <tr>
                      <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  ">
                        SL
                      </th>
                      <th className=" font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                        PR No/Line No
                      </th>
                      <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                        Item description
                      </th>
                      <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                        Specification
                      </th>
                      {/* <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                        Brand Name
                      </th> */}
                      <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                        Expected Brand Name
                      </th>
                      <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                        warranty
                      </th>
                      <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                        UOM
                      </th>
                      <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                        Expected quantity
                      </th>
                      <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                        Need By date
                      </th>
                      <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                        Organization Name
                      </th>
                      <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                        Attachment
                      </th>

                      {/* Add more header columns as needed */}
                    </tr>
                  </thead>

                  {/* Table rows go here */}
                  {/* Table rows go here */}
                  {prItems2.map((e, i) => (
                    <tbody
                      className="bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]"
                      key={i}
                    >
                      <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap font-medium">
                        {i + 1}
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                        {`${e.PR_NUMBER}/${e.LINE_NUM}`}
                      </td>
                      <td className="  font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                        {!e.ITEM_DESCRIPTION ? "N/A" : e.ITEM_DESCRIPTION}
                      </td>
                      <td className=" w-64 font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  ">
                        <div className=" w-64">
                          {!e.ITEM_SPECIFICATION ? "N/A" : e.ITEM_SPECIFICATION}
                        </div>
                      </td>
                      {/* <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                        {"not in interface"}
                      </td> */}
                      <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                        {"N/A"}
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                        {e.WARRANTY_ASK_BY_BUYER === "Y"
                          ? "Applicable"
                          : "Not Applicable"}
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                        {!e.UNIT_MEAS_LOOKUP_CODE
                          ? "N/A"
                          : e.UNIT_MEAS_LOOKUP_CODE}
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                        {!e.EXPECTED_QUANTITY ? "N/A" : e.EXPECTED_QUANTITY}
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                        {isoToDateTime(e.NEED_BY_DATE)}
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                        {e.INVENTORY_ORG_NAME ? e.INVENTORY_ORG_NAME : "N/A"}
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                        {!e.BUYER_FILE?.name ? "N/A" : e.BUYER_FILE?.name}
                      </td>
                    </tbody>
                  ))}
                </table>
              </div>
            </>
          )}
        </div>
        <div className="h-6"></div>
        {prItems.length === 0 ? (
          <div className=" w-full flex justify-center items-center">
            {/* <h1 className=" text-sm font-mon font-semibold text-midBlack">
              No Item Selected
            </h1> */}
          </div>
        ) : (
          <>
            <div className=" mb-4">
              <InputLebel
                titleText={`${
                  !isCreateRfq ? "New selected Item" : "Selected Item"
                }`}
              />
            </div>
            <div className=" w-full flex flex-row items-center space-x-4">
              <InputLebel titleText={`Selected ${prItems.length} Items`} />
              <InputLebel
                titleText={`Non selected ${
                  totalprItemNumberInStore! - prItems.length
                }  Items`}
              />
            </div>
            <div className=" h-6"></div>
            <div className="overflow-x-auto">
              <table
                className="min-w-full divide-y divide-gray-200"
                style={{ tableLayout: "fixed" }}
              >
                <thead className="sticky top-0 bg-[#F4F6F8] h-14">
                  <tr>
                    <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  ">
                      SL
                    </th>
                    <th className=" font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                      PR No/Line No
                    </th>
                    <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                      Item description
                    </th>
                    <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                      Specification
                    </th>
                    {/* <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                      Brand Name
                    </th> */}
                    <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                      Expected Brand Name
                    </th>
                    <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                      warranty
                    </th>
                    <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                      UOM
                    </th>
                    <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                      Expected quantity
                    </th>
                    <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                      Need By date
                    </th>
                    <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                      Organization Name
                    </th>
                    <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                      Attachment
                    </th>

                    {/* Add more header columns as needed */}
                  </tr>
                </thead>

                {/* Table rows go here */}
                {/* Table rows go here */}
                {prItems.map((e, i) => (
                  <tbody
                    className="bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]"
                    key={i}
                  >
                    <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap font-medium">
                      {i + 1}
                    </td>
                    <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                      {`${e.PR_NUMBER}/${e.LINE_NUM}`}
                    </td>
                    <td className="  font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                      {!e.ITEM_DESCRIPTION ? "N/A" : e.ITEM_DESCRIPTION}
                    </td>
                    <td className=" w-64 font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  ">
                      <div className=" w-64">
                        {!e.ITEM_SPECIFICATION ? "N/A" : e.ITEM_SPECIFICATION}
                      </div>
                    </td>
                    {/* <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                      {"not in interface"}
                    </td> */}
                    <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                      {"N/A"}
                    </td>
                    <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                      {e.WARRANTY_ASK_BY_BUYER === "Y"
                        ? "Applicable"
                        : "Not Applicable"}
                    </td>
                    <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                      {!e.UNIT_MEAS_LOOKUP_CODE
                        ? "N/A"
                        : e.UNIT_MEAS_LOOKUP_CODE}
                    </td>
                    <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                      {!e.EXPECTED_QUANTITY ? "N/A" : e.EXPECTED_QUANTITY}
                    </td>
                    <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                      {isoToDateTime(e.NEED_BY_DATE)}
                    </td>
                    <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                      {e.INVENTORY_ORG_NAME ? e.INVENTORY_ORG_NAME : "N/A"}
                    </td>
                    <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                      {!e.BUYER_FILE?.name ? "N/A" : e.BUYER_FILE?.name}
                    </td>
                  </tbody>
                ))}
              </table>
            </div>
          </>
        )}
        <div className="h-4"></div>
        <div className=" flex flex-row justify-end items-end space-x-6">
          <CommonButton
            titleText={"Back"}
            onClick={back}
            width="w-32"
            color="bg-blackishColor"
          />

          {saveLoading ? (
            <div className=" w-32 flex justify-center items-center">
              <CircularProgressIndicator />
            </div>
          ) : (
            <CommonButton
              titleText={"Save"} //`${rfqIdInStore != null ? "Re-Publish" :
              onClick={publish2}
              width="w-32"
              color="bg-midBlack"
            />
          )}

          {isLoaing ? (
            <div className=" w-32 flex justify-center items-center">
              <CircularProgressIndicator />
            </div>
          ) : (
            <CommonButton
              titleText={"Publish"} //`${rfqIdInStore != null ? "Re-Publish" :
              onClick={publish}
              width="w-32"
              color="bg-midGreen"
            />
          )}
        </div>
      </div>
    </div>
  );
}
