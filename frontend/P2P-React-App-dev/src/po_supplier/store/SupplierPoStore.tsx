import { create } from "zustand";
import PoInterface from "../../po/interface/PoInterface";
import InvoiceInterface from "../../po/interface/InvoiceInterface";
import ShipmentListInterface from "../../shipment_receive/interface/ShipmentListInterface";

interface State {
  pageNo: number | null;
  shipmentIdInStore: number | null;
  singlePo: PoInterface | null;
  grnNumberInStore: string;
  poNumberInStore: string;
  poHeaderInStore: string;
  singleInvoice: InvoiceInterface | null;
  mushokFilePath: string | null;
  headerTermFilePath: string | null;
  singleShipment: ShipmentListInterface | null;
}

interface Actions {
  setPageNo: (newNumber: number | null) => void;
  setShipmentIdInStore: (shipmentIdInStore: number | null) => void;

  setSinglePo: (newSinglePo: PoInterface | null) => void;

  setGrnNumberInStore: (newGrnNumber: string) => void;

  setPoNumberInStore: (newPoNumber: string) => void;
  setPoHeaderInStore: (newPoHeader: string) => void;
  setSingleInvoice: (newSingleInvoice: InvoiceInterface | null) => void;
  setMushokFilePath: (newMushokFile: string | null) => void;
  setHeaderTermFilePath: (headerTermFilePath: string | null) => void;

  setSingleShipment: (newSingleShipment: ShipmentListInterface | null) => void;
}

const useSupplierPoStore = create<State & Actions>((set) => ({
  pageNo: 1, // Initialize it to null or any default value you prefer
  setPageNo: (newNumber) =>
    set(() => {
      // You may perform any other side effects or validation here
      return { pageNo: newNumber };
    }),
  shipmentIdInStore: null,
  setShipmentIdInStore: (newShipmentId) =>
    set({
      shipmentIdInStore: newShipmentId,
    }),
  singlePo: null,
  setSinglePo: (newPo) =>
    set(() => {
      return { singlePo: newPo };
    }),

  grnNumberInStore: "",
  setGrnNumberInStore: (newGrnNumber) =>
    set(() => {
      return { grnNumberInStore: newGrnNumber };
    }),

  poNumberInStore: "",
  setPoNumberInStore: (newPoNumber) =>
    set(() => {
      return { poNumberInStore: newPoNumber };
    }),
  poHeaderInStore: "",
  setPoHeaderInStore: (newPoHeader) =>
    set(() => {
      return { poHeaderInStore: newPoHeader };
    }),
  singleInvoice: null,
  setSingleInvoice: (newSingleIn) =>
    set(() => {
      return { singleInvoice: newSingleIn };
    }),
  mushokFilePath: null,
  setMushokFilePath: (newMushokFile) =>
    set(() => {
      return { mushokFilePath: newMushokFile };
    }),
  headerTermFilePath: null,
  setHeaderTermFilePath: (newFile) =>
    set(() => {
      return { headerTermFilePath: newFile };
    }),
    singleShipment: null,
  setSingleShipment: (newShipment) =>
    set(() => {
      return { singleShipment: newShipment };
    }),
}));
export default useSupplierPoStore;

// rfqIdInStore: null,
//   setRfqIdInStore: (newid) =>
//     set({
//       rfqIdInStore: newid,
//     }),
//   rfqHea
