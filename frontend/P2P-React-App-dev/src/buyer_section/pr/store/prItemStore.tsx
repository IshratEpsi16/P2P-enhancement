import { create } from "zustand";
import PrItemInterface from "../../pr_item_list/interface/PrItemInterface";
import SelectedPrItemInterface from "../../pr_item_list/interface/selectedPritemInterface";
import SelectedSupplierInterface from "../../invite_supplier_for_rfq/interface/SelectedSupplierInterface";
import RfqHeaderDetailsInterface from "../../pr_item_list/interface/RfqHeaderDetailsInterface";
import RfqDetailsInterface from "../../pr_item_list/interface/RfqDetailsInterface";
import SelectedRfqItemInterface from "../../../supplier_rfq_section/inteface/SelectedRfqItemInterface";
import RfqListItemSupplier from "../../../supplier_rfq_section/inteface/RfqListItemSupplier";

// Define the store state interface
interface PrItemsState {
  rfqTitleInStore: string | null;
  setRfqTitleInStore: (rfqTitleInStore: string | null) => void;
  rfqSubjectInStore: string | null;
  setRfqSubjectInStore: (rfqSubjectInStore: string | null) => void;
  rfqOpenDateInStore: string | null;
  setRfqOpenDateInStore: (rfqOpenDateInStore: string | null) => void;
  rfqCloseDateInStore: string | null;
  setRfqCloseDateInStore: (rfqCloseDateInStore: string | null) => void;
  rfqTypeInStore: string | null;
  setRfqTypeInStore: (rfqTypeInStore: string | null) => void;
  prItems: PrItemInterface[]; //SelectedPrItemInterface silo
  setPrItems: (items: PrItemInterface[]) => void;
  prItems2: PrItemInterface[];
  setPrItems2: (items2: PrItemInterface[]) => void;
  needByDateInStore: string | null;
  setNeedByDateInStore: (needByDateInStore: string | null) => void;

  matchOptionInStore: string | "";
  setMatchOptionInStore: (matchItemInStore: string | "") => void;
  rateTypeInStore: string | "";
  setRateTypeInStore: (rateTypeInStore: string | "") => void;
  rateDateInStore: string | "";
  setRateDateInStore: (rateDateInStore: string | "") => void;
  conversionRateInStore: string | "";
  setConversionRateInStore: (conversionRateInStore: string | "") => void;

  headerAttachment: File | null;
  setHeaderAttachment: (headerAttachment: File | null) => void;

  //buyer term

  freightTermInStore: string | null;
  setFreightTermInStore: (freightTermInStore: string | null) => void;
  freightTermNameInStore: string | null;
  setFreightTermNameInStore: (freightTermNameInStore: string | null) => void;

  paymentTermInStore: string | null;
  setPaymentTermInStore: (paymentTermInStore: string | null) => void;
  paymentTermNameInStore: string | null;
  setPaymentTermNameInStore: (paymentTermNameInStore: string | null) => void;

  fobInStore: string | null;
  setFobInStore: (fobInStore: string | null) => void;
  buyerAttachmentInStore: File | null;
  setBuyerAttachmentInStore: (buyerAttachmentInStore: File | null) => void;
  currencyInStore: string | null;
  setCurrencyInStore: (currencyInStore: string | null) => void;
  etrInStore: string | null;
  setEtrInStore: (etrInStore: string | null) => void;
  billToAddressInStore: string | null;
  setBillToAddressInStore: (billToAddressInStore: string | null) => void;
  shipToAddressInStore: string | null;
  setShipToAddressInStore: (shipToAddressInStore: string | null) => void;

  invoiceTypeInstore: string | null;
  setInvoiceTypeInStore: (invoiceTypeInstore: string | null) => void;
  invoiceTypeNameInstore: string | null;
  setInvoiceTypeNameInStore: (invoiceTypeNameInstore: string | null) => void;

  vatApplicableStatusInStore: string | null;
  setVatApplicableStatusInStore: (
    vatApplicableStatusInStore: string | null
  ) => void;
  vatPercentageInStore: number | null;
  setVatPercentageInStore: (vatPercentageInStore: number | null) => void;
  noteInStore: string | null;
  setNoteInStore: (noteInStore: string | null) => void;

  totalprItemNumberInStore: number | null;
  setTotalprItemNumberInStore: (
    totalprItemNumberInStore: number | null
  ) => void;

  rfqDetailsInStore: RfqDetailsInterface | null;
  setRfqDetailsInStore: (rfqDetailsInStore: RfqDetailsInterface | null) => void;

  //general term

  selectedGeneralterm: string | null;
  setSelectedGeneralterm: (selectedGeneralterm: string | null) => void;

  //general term

  //selected supplier

  // suppliers: SelectedSupplierInterface[];
  // setSuppliers: (suppliers: SelectedSupplierInterface[]) => void;

  invitedSuppliers: SelectedSupplierInterface[];
  setInvitedSuppliers: (suppliers: SelectedSupplierInterface[]) => void;
  invitedSuppliers2: SelectedSupplierInterface[];
  setInvitedSuppliers2: (suppliers2: SelectedSupplierInterface[]) => void;

  isCreateRfq: boolean;
  setIsCreateRfq: (isCreateRfq: boolean) => void;

  rfqIdInStore: number | null;
  setRfqIdInStore: (rfqIdInStore: number | null) => void;
  rfqHeaderDetailsInStore: RfqHeaderDetailsInterface | null;
  setRfqHeaderDetailsInStore: (
    rfqHeaderDetailsInStore: RfqHeaderDetailsInterface | null
  ) => void;
  rfqObjectDetailsInStore: RfqListItemSupplier | null;
  setRfqObjectDetailsInStore: (
    rfqObjectDetailsInStore: RfqListItemSupplier | null
  ) => void;
  rfqStatusInStore: string | "";
  setRfqStatusInStore: (rfqStatusInStore: string | "") => void;
  isSavepressed: boolean;
  setIsSavepressed: (isSavepressed: boolean) => void;
  userIdInStore: number | null;
  setUserIdInStore: (userIdInStore: number | null) => void;
  rfqItems: SelectedRfqItemInterface[];
  setRfqItems: (items: SelectedRfqItemInterface[]) => void;
  orgIdInStore: string | "";
  setOrgIdInStore: (orgIdInStore: string | "") => void;
  savedPrItemLength: number | null;
  setSavedPritemLength: (savedPrItemLength: number | null) => void;
  closeDateInStore: string | "";
  setCloseDateInStore: (closeDateInStore: string | "") => void;
  orgNameInStore: string | "";
  setOrgNameInStore: (orgNameInStore: string | "") => void;
  approvalTypeInStore: string | "";
  setApprovalTypeInStore: (approvalTypeInStore: string | "") => void;
  csIdInPrItemsStore: number | null;
  setCsIdInPrItemsStore: (newId: number | null) => void;
  rfqOrgIdInStore: number | null;
  setRfqOrgIdInStore: (newOrgId: number | null) => void;
}

// Create the Zustand store
const usePrItemsStore = create<PrItemsState>((set) => ({
  rfqOrgIdInStore: null,
  setRfqOrgIdInStore: (newOrgId) =>
    set({
      rfqOrgIdInStore: newOrgId,
    }),
  csIdInPrItemsStore: null,
  setCsIdInPrItemsStore: (newCsId) =>
    set({
      csIdInPrItemsStore: newCsId,
    }),
  approvalTypeInStore: "",
  setApprovalTypeInStore: (newType) =>
    set({
      approvalTypeInStore: newType,
    }),
  orgNameInStore: "",
  setOrgNameInStore: (orgname) => set({ orgNameInStore: orgname }),
  prItems: [],
  // Action to set PR items
  setPrItems: (items) => set({ prItems: items }),
  // Action to set header attachment
  prItems2: [],
  // Action to set PR items
  setPrItems2: (items2) => set({ prItems2: items2 }),
  // Action to set header attachment
  invitedSuppliers: [],
  setInvitedSuppliers: (suppliers) =>
    set({
      invitedSuppliers: suppliers,
    }),
  invitedSuppliers2: [],
  setInvitedSuppliers2: (suppliers2) =>
    set({
      invitedSuppliers2: suppliers2,
    }),
  headerAttachment: null,
  setHeaderAttachment: (file) => set({ headerAttachment: file }),
  rfqTitleInStore: "",
  setRfqTitleInStore: (newTitle) => set({ rfqTitleInStore: newTitle }),
  rfqSubjectInStore: "",
  setRfqSubjectInStore: (newSubject) => set({ rfqSubjectInStore: newSubject }),
  rfqOpenDateInStore: "",
  setRfqOpenDateInStore: (newOpenDate) =>
    set({
      rfqOpenDateInStore: newOpenDate,
    }),
  rfqCloseDateInStore: "",
  setRfqCloseDateInStore: (newCloseDate) =>
    set({
      rfqCloseDateInStore: newCloseDate,
    }),
  rfqTypeInStore: "",
  setRfqTypeInStore: (newRfqType) => set({ rfqTypeInStore: newRfqType }),
  needByDateInStore: "",
  setNeedByDateInStore: (newNeedByDate) =>
    set({
      needByDateInStore: newNeedByDate,
    }),

  //buyer term
  freightTermInStore: "",
  setFreightTermInStore: (newFrieghtTerm) =>
    set({
      freightTermInStore: newFrieghtTerm,
    }),
  freightTermNameInStore: "",
  setFreightTermNameInStore: (newFreightTermName) =>
    set({
      freightTermNameInStore: newFreightTermName,
    }),

  paymentTermInStore: "",
  setPaymentTermInStore: (newPaymentTerm) =>
    set({
      paymentTermInStore: newPaymentTerm,
    }),
  paymentTermNameInStore: "",
  setPaymentTermNameInStore: (newPaymentTermName) =>
    set({
      paymentTermNameInStore: newPaymentTermName,
    }),
  fobInStore: "",
  setFobInStore: (newFob) =>
    set({
      fobInStore: newFob,
    }),
  buyerAttachmentInStore: null,
  setBuyerAttachmentInStore: (newBuyerAttchment) =>
    set({
      buyerAttachmentInStore: newBuyerAttchment,
    }),
  currencyInStore: "",
  setCurrencyInStore: (newCurrency) =>
    set({
      currencyInStore: newCurrency,
    }),
  etrInStore: "",
  setEtrInStore: (newEtr) =>
    set({
      etrInStore: newEtr,
    }),
  billToAddressInStore: "",
  setBillToAddressInStore: (newBillToStore) =>
    set({
      billToAddressInStore: newBillToStore,
    }),
  shipToAddressInStore: "",
  setShipToAddressInStore: (newShipToAddress) =>
    set({
      shipToAddressInStore: newShipToAddress,
    }),
  invoiceTypeInstore: "",
  setInvoiceTypeInStore: (newInvoice) =>
    set({
      invoiceTypeInstore: newInvoice,
    }),
  invoiceTypeNameInstore: "",
  setInvoiceTypeNameInStore: (newInvoiceName) =>
    set({
      invoiceTypeNameInstore: newInvoiceName,
    }),
  vatApplicableStatusInStore: "",
  setVatApplicableStatusInStore: (newVatStatus) =>
    set({
      vatApplicableStatusInStore: newVatStatus,
    }),
  vatPercentageInStore: 0,
  setVatPercentageInStore: (newVatper) =>
    set({
      vatPercentageInStore: newVatper,
    }),
  noteInStore: "",
  setNoteInStore: (newNote) =>
    set({
      noteInStore: newNote,
    }),
  // suppliers: [],
  // setSuppliers: (newSupplierList) =>
  //   set({
  //     suppliers: newSupplierList,
  //   }),
  selectedGeneralterm: "",
  setSelectedGeneralterm: (newGeneralTerm) =>
    set({
      selectedGeneralterm: newGeneralTerm,
    }),
  isCreateRfq: false,
  setIsCreateRfq: (newIsCreateRfq) =>
    set({
      isCreateRfq: newIsCreateRfq,
    }),
  rfqIdInStore: null,
  setRfqIdInStore: (newid) =>
    set({
      rfqIdInStore: newid,
    }),
  rfqHeaderDetailsInStore: null,
  setRfqHeaderDetailsInStore: (newRfqHeaderDetails) =>
    set({
      rfqHeaderDetailsInStore: newRfqHeaderDetails,
    }),
  rfqObjectDetailsInStore: null,
  setRfqObjectDetailsInStore: (newRfqObjectDetails) =>
    set({
      rfqObjectDetailsInStore: newRfqObjectDetails,
    }),
  totalprItemNumberInStore: null,
  setTotalprItemNumberInStore: (newTotalPrItemNumber) =>
    set({
      totalprItemNumberInStore: newTotalPrItemNumber,
    }),
  rfqDetailsInStore: null,
  setRfqDetailsInStore: (newRfqDetails) =>
    set({
      rfqDetailsInStore: newRfqDetails,
    }),
  rfqStatusInStore: "",
  setRfqStatusInStore: (newRfqStatus) =>
    set({
      rfqStatusInStore: newRfqStatus,
    }),

  isSavepressed: false,
  setIsSavepressed: (newisSsave) =>
    set({
      isSavepressed: newisSsave,
    }),

  userIdInStore: null,
  setUserIdInStore: (newid) =>
    set({
      userIdInStore: newid,
    }),
  rfqItems: [],
  // Action to set PR items
  setRfqItems: (items) => set({ rfqItems: items }),
  orgIdInStore: "",
  setOrgIdInStore: (newId) =>
    set({
      orgIdInStore: newId,
    }),
  matchOptionInStore: "",
  setMatchOptionInStore: (newMatch) =>
    set({
      matchOptionInStore: newMatch,
    }),
  rateTypeInStore: "",
  setRateTypeInStore: (newRateType) =>
    set({
      rateTypeInStore: newRateType,
    }),
  rateDateInStore: "",
  setRateDateInStore: (newRateDate) =>
    set({
      rateDateInStore: newRateDate,
    }),
  conversionRateInStore: "",
  setConversionRateInStore: (newConversionRate) =>
    set({
      conversionRateInStore: newConversionRate,
    }),
  savedPrItemLength: null,
  setSavedPritemLength: (newLength) =>
    set({
      savedPrItemLength: newLength,
    }),

  closeDateInStore: "",
  setCloseDateInStore: (newDate) =>
    set({
      closeDateInStore: newDate,
    }),
}));

export default usePrItemsStore;
