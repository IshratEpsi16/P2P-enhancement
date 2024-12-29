import { create } from "zustand";
import Invoice from "../interface/InvoiceInterface";

interface State {
  pageNo: number | null;
  selectedInvoiceDetails: any; // Define the type of selectedInvoiceDetails according to your data structure
  selectedInvoiceDetailsBank: any; // Define the type of selectedInvoiceDetailsBank according to your data structure
  selectedInvoiceDetailsSite: any; // Define the type of selectedInvoiceDetailsSite according to your data structure
  invoiceDetails: any; // Define the type of invoiceDetails according to your data structure
  imgPath: any; // Define the type of invoiceDetails according to your data structure
  pendingInvoiceLength: number | null;
  invoiceId: number | null;
  selectedInvoice: Invoice | null;
  poTermFilePathInBuyerInvoice: string | null;
}

interface Actions extends State {
  setPageNo: (newNumber: number | null) => void;
  setSelectedInvoiceDetails: (details: any) => void; // Define the type of 'details' according to your data structure
  setSelectedInvoiceDetailsBank: (details: any) => void; // Define the type of 'details' according to your data structure
  setSelectedInvoiceDetailsSite: (details: any) => void; // Define the type of 'details' according to your data structure
  setInvoiceDetails: (details: any) => void; // Define the type of 'details' according to your data structure
  setImgPath: (details: any) => void; // Define the type of 'details' according to your data structure
  setPendingInvoiceLength: (newLength: number | null) => void;
  setInvoiceId: (newInvId: number | null) => void;
  setSelectedInvoice: (newSelectedInvoice: Invoice | null) => void;
  setPoTermFilePathInBuyerInvoice: (newPath: string | null) => void;
}

const useBuyerInvoiceStore = create<State & Actions>((set) => ({
  poTermFilePathInBuyerInvoice: null,
  setPoTermFilePathInBuyerInvoice: (newPath) =>
    set(() => ({
      poTermFilePathInBuyerInvoice: newPath,
    })),
  pageNo: 1, // Initialize it to null or any default value you prefer
  selectedInvoiceDetails: null, // Initial value for selectedInvoiceDetails
  selectedInvoiceDetailsBank: null, // Initial value for selectedInvoiceDetailsBank
  selectedInvoiceDetailsSite: null, // Initial value for selectedInvoiceDetailsSite
  invoiceDetails: null, // Initial value for invoiceDetails
  imgPath: null, // Initial value for invoiceDetails
  pendingInvoiceLength: null,
  invoiceId: null,
  selectedInvoice: null,
  setPendingInvoiceLength: (newLen) =>
    set(() => ({
      pendingInvoiceLength: newLen,
    })),
  setPageNo: (newNumber) =>
    set(() => ({
      pageNo: newNumber,
    })),
  setSelectedInvoiceDetails: (details) =>
    set(() => ({
      selectedInvoiceDetails: details,
    })),
  setSelectedInvoiceDetailsBank: (details) =>
    set(() => ({
      selectedInvoiceDetailsBank: details,
    })),
  setSelectedInvoiceDetailsSite: (details) =>
    set(() => ({
      selectedInvoiceDetailsSite: details,
    })),
  setInvoiceDetails: (details) =>
    set(() => ({
      invoiceDetails: details,
    })),
  setImgPath: (details) =>
    set(() => ({
      imgPath: details,
    })),
  setInvoiceId: (newInv) =>
    set(() => ({
      invoiceId: newInv,
    })),
  setSelectedInvoice: (newSelectedInv) =>
    set(() => ({
      selectedInvoice: newSelectedInv,
    })),
}));

export default useBuyerInvoiceStore;
