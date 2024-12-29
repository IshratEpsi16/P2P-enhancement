import { create } from "zustand";
import InvoiceInterface from "../interface/InvoiceInterface";

interface State {
  pageNo: number | null;
  selectedInvoice: InvoiceInterface | null;
}

interface Actions {
  setPageNo: (newNumber: number | null) => void;
  setSelectedInvoice: (newSelectedInvoice: InvoiceInterface | null) => void;
}

const useSupplierInvoiceStore = create<State & Actions>((set) => ({
  pageNo: 1, // Initialize it to null or any default value you prefer
  setPageNo: (newNumber) =>
    set(() => {
      // You may perform any other side effects or validation here
      return { pageNo: newNumber };
    }),
  selectedInvoice: null,
  setSelectedInvoice: (newInvoice) =>
    set(() => {
      return { selectedInvoice: newInvoice };
    }),
}));

export default useSupplierInvoiceStore;
