import { create } from "zustand";
import ConvertedItemForCsCreation from "../interface/ConvertedItemForCsCreation";
import {
  QuotationData,
  QuotationsInterface,
} from "../interface/QuotationsInterface";
import SupplierInterfaceInRfq from "../interface/SupplierInterfaceInRfq";

interface State {
  rfqLineIdListInStore: number[] | null;
  convertedItemsForCsCreationAndUpdateInStore:
    | ConvertedItemForCsCreation[]
    | null;
  quotationDataListInStore: QuotationData[] | null;
  quotationListInStore: QuotationsInterface | null;
  ListlengthInStore: number | null;
  orgIdInStore: number | null;
  orgNameInStore: string | null;
  buyerGeneralTermInStore: string | null;
  currencyNameInStore: string | null;
  csGeneralTermInStore: string | null;
  rfqIdInCsCreationStore: number | null;
  supplierListInStore: SupplierInterfaceInRfq[] | null;
  csPageNo: number | null;
  savedCsIdInStore: number | null;
  csTitleInStore: string | null;
  csCreationDateInStore: string | null;
  csNoteInStore: string | null;
  csStatusInStore: string | "";

  csUserIdInStore: number | null;
  csVendorIdInStore: number | null;
  csVendorSiteIdInStore: number | null;
  rfqTypeInCsCreationStore: string | null;
  buyerDeptInCsCreationStore: string | null;
  approvalTypeInCsCreation: string | null;
}

interface Actions {
  setApprovalTypeInCsCreation: (newt: string | null) => void;
  setBuyerDeptInCsCreationStore: (newDept: string | null) => void;
  setRfqLineIdListInStore: (newNumber: number[] | null) => void;
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
  setOrgIdInStore: (orgIdInStore: number | null) => void;
  setOrgNameInStore: (orgName: string | null) => void;
  setBuyerGeneralTermInStore: (buyerGeneralTermInStore: string | null) => void;
  setCurrencyNameInStore: (currencyNameInStore: string | null) => void;
  setCsGeneralTermInStore: (csGeneralTermInStore: string | null) => void;
  setRfqIdInCsCreationStore: (rfqIdInCsCreationStore: number | null) => void;
  setSupplierListInStore: (
    supplierListInStore: SupplierInterfaceInRfq[] | null
  ) => void;
  setCsPageNo: (csPageNo: number | null) => void;
  setSavedCsIdInStore: (savedCsIdInStore: number | null) => void;
  setCsTitleInStore: (csTitleInStore: string | null) => void;
  setCsCreationDateInStore: (csCreationDateInStore: string | null) => void;
  setCsNoteInStore: (csNoteInStore: string | null) => void;
  setCsStatusInStore: (csStatusInStore: string | "") => void;

  setCsUserIdInStore: (csUserIdInStore: number | null) => void;
  setCsVendorIdInStore: (csVendorIdInStore: number | null) => void;
  setCsVendorSiteIdInStore: (csVendorSiteIdInStore: number | null) => void;
  setRfqTypeInCsCreationStore: (
    rfqTypeInCsCreationStore: string | null
  ) => void;
}

const useCsCreationStore = create<State & Actions>((set) => ({
  approvalTypeInCsCreation: null,
  setApprovalTypeInCsCreation: (newType) =>
    set(() => ({
      approvalTypeInCsCreation: newType,
    })),
  buyerDeptInCsCreationStore: null,
  setBuyerDeptInCsCreationStore: (newd) =>
    set(() => ({
      buyerDeptInCsCreationStore: newd,
    })),
  rfqLineIdListInStore: [], // Initialize it to null or any default value you prefer
  setRfqLineIdListInStore: (newNumber) =>
    set(() => ({
      rfqLineIdListInStore: newNumber,
    })),
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
  orgIdInStore: null,
  setOrgIdInStore: (newOrgId) =>
    set(() => ({
      orgIdInStore: newOrgId,
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
  rfqIdInCsCreationStore: null,
  setRfqIdInCsCreationStore: (newId) =>
    set(() => ({
      rfqIdInCsCreationStore: newId,
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
  savedCsIdInStore: null,
  setSavedCsIdInStore: (newCsId) =>
    set(() => ({
      savedCsIdInStore: newCsId,
    })),
  csTitleInStore: "",
  setCsTitleInStore: (newtitle) =>
    set(() => ({
      csTitleInStore: newtitle,
    })),
  csCreationDateInStore: null,
  setCsCreationDateInStore: (newDate) =>
    set(() => ({
      csCreationDateInStore: newDate,
    })),
  csNoteInStore: null,
  setCsNoteInStore: (newCsNote) =>
    set(() => ({
      csNoteInStore: newCsNote,
    })),
  csStatusInStore: "",
  setCsStatusInStore: (newCsStatus) =>
    set(() => ({
      csStatusInStore: newCsStatus,
    })),

  csUserIdInStore: null,
  setCsUserIdInStore: (newCsUserId) =>
    set(() => ({
      csUserIdInStore: newCsUserId,
    })),
  csVendorIdInStore: null,
  setCsVendorIdInStore: (newVendorId) =>
    set(() => ({
      csUserIdInStore: newVendorId,
    })),
  csVendorSiteIdInStore: null,
  setCsVendorSiteIdInStore: (newVendorSiteId) =>
    set(() => ({
      csVendorSiteIdInStore: newVendorSiteId,
    })),
  rfqTypeInCsCreationStore: null,
  setRfqTypeInCsCreationStore: (newType) =>
    set(() => ({
      rfqTypeInCsCreationStore: newType,
    })),
}));

export default useCsCreationStore;
