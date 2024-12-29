import { create } from "zustand";
import ConvertedItemForCsCreation from "../../cs/interface/ConvertedItemForCsCreation";
import {
  QuotationData,
  QuotationsInterface,
} from "../../cs/interface/QuotationsInterface";
import SupplierInterfaceInRfq from "../../cs/interface/SupplierInterfaceInRfq";
import PendingCsInterface from "../interface/PendingCsInterface";

interface State {
  csApprovalPageNo: number | null;
  csIdInStore: number | null;
  rfqIdInStore: number | null;
  orgIdInStore: number | null;
  rfqLineIdInStore: number[] | null;
  convertedItemsForCsCreationAndUpdateInStore:
    | ConvertedItemForCsCreation[]
    | null;
  quotationDataListInStore: QuotationData[] | null;
  quotationListInStore: QuotationsInterface | null;
  ListlengthInStore: number | null;
  // orgIdInStore: number | null;
  orgNameInStore: string | null;
  buyerGeneralTermInStore: string | null;
  currencyNameInStore: string | null;
  csGeneralTermInStore: string | null;
  rfqIdInCsApprovalStore: number | null;
  supplierListInStore: SupplierInterfaceInRfq[] | null;
  csPageNo: number | null;
  // savedCsIdInStore: number | null;
  csTitleInStore: string | null;
  csCurrencyCodeInStore: string | null;
  pendingCsListLength: number | null;
  singleCs: PendingCsInterface | null;
}

interface Actions {
  setSingleCs: (singleCs: PendingCsInterface | null) => void;
  setPendingCsListLength: (pendingCsListLength: number | null) => void;
  setCsApprovalPageNo: (csApprovalPageNo: number | null) => void;
  setCsIdInStore: (csIdInStore: number | null) => void;
  setRfqIdInStore: (rfqIdInStore: number | null) => void;
  setOrgIdInStore: (orgIdInStore: number | null) => void;
  setRfqLineIdInStore: (rfqLineIdInStore: number[] | null) => void;
  setConvertedItemsForCsCreationAndUpdateInStore: (
    convertedItemsForCsCreationAndUpdateInStore:
      | ConvertedItemForCsCreation[]
      | null
  ) => void;
  setQuotationDataListInStore: (
    quotationDataListInStore: QuotationData[] | null
  ) => void;
  setQuotationListInStore: (
    quotationListInStore: QuotationsInterface | null
  ) => void;
  setListlengthInStore: (ListlengthInStore: number | null) => void;

  setOrgNameInStore: (orgName: string | null) => void;
  setBuyerGeneralTermInStore: (buyerGeneralTermInStore: string | null) => void;
  setCurrencyNameInStore: (currencyNameInStore: string | null) => void;
  setCsGeneralTermInStore: (csGeneralTermInStore: string | null) => void;
  setRfqIdInCsApprovalStore: (rfqIdInCsApprovalStore: number | null) => void;
  setSupplierListInStore: (
    supplierListInStore: SupplierInterfaceInRfq[] | null
  ) => void;
  setCsPageNo: (csPageNo: number | null) => void;
  // setSavedCsIdInStore: (savedCsIdInStore: number | null) => void;
  setCsTitleInStore: (csTitleInStore: string | null) => void;
  setCsCurrencyCodeInStore: (csCurrencyCodeInStore: string | null) => void;
}

const useCsApprovalStore = create<State & Actions>((set) => ({
  singleCs: null,
  setSingleCs: (newCs) =>
    set(() => {
      return { singleCs: newCs };
    }),
  csApprovalPageNo: 1, // Initialize it to null or any default value you prefer
  setCsApprovalPageNo: (newNumber) =>
    set(() => {
      // You may perform any other side effects or validation here
      return { csApprovalPageNo: newNumber };
    }),
  csIdInStore: 1,
  setCsIdInStore: (newId) =>
    set(() => {
      return { csIdInStore: newId };
    }),
  rfqIdInStore: null,
  setRfqIdInStore: (newId) =>
    set(() => {
      return { rfqIdInStore: newId };
    }),
  orgIdInStore: null,
  setOrgIdInStore: (newId) =>
    set(() => {
      return { orgIdInStore: newId };
    }),
  rfqLineIdInStore: [],
  setRfqLineIdInStore: (newId) =>
    set(() => {
      return { rfqLineIdInStore: newId };
    }),
  convertedItemsForCsCreationAndUpdateInStore: [],
  setConvertedItemsForCsCreationAndUpdateInStore: (newItems) =>
    set(() => ({
      convertedItemsForCsCreationAndUpdateInStore: newItems,
    })),
  quotationDataListInStore: [],
  setQuotationDataListInStore: (newList) =>
    set(() => ({
      quotationDataListInStore: newList,
    })),
  quotationListInStore: null,
  setQuotationListInStore: (newQuotations) =>
    set(() => ({
      quotationListInStore: newQuotations,
    })),
  ListlengthInStore: null,
  setListlengthInStore: (newLen) =>
    set(() => ({
      ListlengthInStore: newLen,
    })),

  orgNameInStore: null,
  setOrgNameInStore: (newName) =>
    set(() => ({
      orgNameInStore: newName,
    })),
  buyerGeneralTermInStore: null,
  setBuyerGeneralTermInStore: (newterm) =>
    set(() => ({
      buyerGeneralTermInStore: newterm,
    })),
  currencyNameInStore: null,
  setCurrencyNameInStore: (newCurrency) =>
    set(() => ({
      currencyNameInStore: newCurrency,
    })),
  csGeneralTermInStore: null,
  setCsGeneralTermInStore: (newCsterm) =>
    set(() => ({
      csGeneralTermInStore: newCsterm,
    })),
  rfqIdInCsApprovalStore: null,
  setRfqIdInCsApprovalStore: (newId) =>
    set(() => ({
      rfqIdInCsApprovalStore: newId,
    })),
  supplierListInStore: null,
  setSupplierListInStore: (newSupplierList) =>
    set(() => ({
      supplierListInStore: newSupplierList,
    })),
  csPageNo: 1,
  setCsPageNo: (newPageNo) =>
    set(() => ({
      csPageNo: newPageNo,
    })),
  // savedCsIdInStore: null,
  // setSavedCsIdInStore: (newCsId) =>
  //   set(() => ({
  //     savedCsIdInStore: newCsId,
  //   })),
  csTitleInStore: "",
  setCsTitleInStore: (newtitle) =>
    set(() => ({
      csTitleInStore: newtitle,
    })),
  csCurrencyCodeInStore: null,
  setCsCurrencyCodeInStore: (newCode) =>
    set(() => ({
      csCurrencyCodeInStore: newCode,
    })),
  pendingCsListLength: null,
  setPendingCsListLength: (newLength) =>
    set(() => ({
      pendingCsListLength: newLength,
    })),
}));

export default useCsApprovalStore;

// interface PrItemsState {

//     rfqHeaderDetailsInStore: RfqHea | null;
//     setRfqHeaderDetailsInStore: (
//       rfqHeaderDetailsInStore: RfqHeaderDetailsInterface
//     ) => void;

// }
