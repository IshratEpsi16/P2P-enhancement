import { create } from "zustand";
import PoInterface from "../../po/interface/PoInterface";
import InvoiceInterface from "../../po/interface/InvoiceInterface";

interface State {
  pageNo: number | null;
  singlePo: PoInterface | null;
  headerTermFilePath: string | null;
  poHeaderIdInStore: number | null;
  supplierIdInStore: number | null;
}

interface Actions {
  setPageNo: (newNumber: number | null) => void;
  setSinglePo: (newSinglePo: PoInterface | null) => void;
  setHeaderTermFilePath: (headerTermFilePath: string | null) => void;
  setPoHeaderIdInStore: (newHeader: number | null) => void;
  setSupplierIdInStore: (newSupplier: number | null) => void;
}

const useBuyerPoStore = create<State & Actions>((set) => ({
  pageNo: 1, // Initialize it to null or any default value you prefer
  setPageNo: (newNumber) =>
    set(() => {
      // You may perform any other side effects or validation here
      return { pageNo: newNumber };
    }),
  singlePo: null,
  setSinglePo: (newPo) =>
    set(() => {
      return { singlePo: newPo };
    }),
  headerTermFilePath: null,
  setHeaderTermFilePath: (newFile) =>
    set(() => {
      return { headerTermFilePath: newFile };
    }),

  poHeaderIdInStore: null, // Initialize it to null or any default value you prefer
  setPoHeaderIdInStore: (newHeader) =>
    set(() => {
      // You may perform any other side effects or validation here
      return { poHeaderIdInStore: newHeader };
     }),

  supplierIdInStore: null,
  setSupplierIdInStore: (newSupplier) =>
    set(() => {
      // You may perform any other side effects or validation here
      return { supplierIdInStore: newSupplier };
     }),
}));
export default useBuyerPoStore;

// rfqIdInStore: null,
//   setRfqIdInStore: (newid) =>
//     set({
//       rfqIdInStore: newid,
//     }),
//   rfqHea
