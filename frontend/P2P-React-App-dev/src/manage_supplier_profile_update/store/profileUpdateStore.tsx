import { create } from "zustand";
import ProfileUpdateDataInterface from "../interface/ProfileUpdateDataInterface";
import { MyInitiatorInterface } from "../../my_info/interface/MyInfoInterface";
import SupplierInterface from "../../manage_supplier/interface/SupplierInterface";

interface State {
  profileUpdateSupplierListLength: number | null;
  appStatus: string;
  isApprovedSupplier: boolean;
  isNeedApprovedSupplier: boolean;
  isBuyerSelectionDisable: boolean;
  supplierIdInStore: number | null;
  bankItem: ProfileUpdateDataInterface | null;
  stageIdInStore: number | null;
  stageLevelInStore: number | null;
  bankChequePathInStore: string | null;
  nidPassportPathInStore: string | null;
  signaturePathInStore: string | null;
  etinPathInStore: string | null;
  profileUidInStore: number | null;
  profileNewInfoUidInStore: number | null;
  siteIdInStore: number | null;
  initiatorStatus: MyInitiatorInterface | null
  isInitiatorInStore: string;
  updateListInStore: SupplierInterface | null;
}

interface Actions {
  setProfileUpdateSupplierListLength: (newNumber: number | null) => void;
  setAppStatus: (appStatus: string) => void;
  setIsApprovedSupplier: (isApprovedSupplier: boolean) => void;
  setIsNeedApprovedSupplier: (isNeedApprovedSupplier: boolean) => void;
  setIsBuyerSelectionDisable: (isBuyerSelectionDisable: boolean) => void;
  setSupplierIdInStore: (supplierIdInStore: number | null) => void;
  setBankItem: (item: ProfileUpdateDataInterface | null) => void;
  setStageIdInStore: (stageIdInStore: number | null) => void;
  setStageLevelInStore: (stageLevelInStore: number | null) => void;
  setBankChequePathInStore: (bankChequePathInStore: string | null) => void;

  setNidPassportPathInStore: (nidPassportPathInStore: string | null) => void;
  setSinaturePathInStore: (signaturePathInStore: string | null) => void;
  setEtinPathInStore: (etinPathInStore: string | null) => void;
  setProfileUidInStore: (profileUidInStore: number | null) => void;
  setProfileNewInfoUidInStore: (profileNewInfoUidInStore: number | null) => void;
  setSiteIdInStore: (siteIdInStore: number | null) => void;

  setInitiatorStatus: (initStatus: MyInitiatorInterface | null) => void;
  setIsInitiatorInStore: (isInitiatorInStore: string) => void;

  setUpdateListInStore: (newUpdateList: SupplierInterface | null) => void;
}

const useProfileUpdateStore = create<State & Actions>((set) => ({
  profileUpdateSupplierListLength: 0, // Initialize it to null or any default value you prefer
  setProfileUpdateSupplierListLength: (newNumber) =>
    set(() => {
      // You may perform any other side effects or validation here
      return { profileUpdateSupplierListLength: newNumber };
    }),
  appStatus: "IN PROCESS",
  setAppStatus: (newTab) =>
    set(() => {
      return { appStatus: newTab };
    }),
  isApprovedSupplier: false,
  setIsApprovedSupplier: (newTab) =>
    set(() => {
      return { isApprovedSupplier: newTab };
    }),
  isNeedApprovedSupplier: true,
  setIsNeedApprovedSupplier: (newTab) =>
    set(() => {
      return { isNeedApprovedSupplier: newTab };
    }),
  isBuyerSelectionDisable: false,
  setIsBuyerSelectionDisable: (newBuyerSelection) =>
    set(() => {
      return { isBuyerSelectionDisable: newBuyerSelection };
    }),
  supplierIdInStore: null,
  setSupplierIdInStore: (newId) =>
    set(() => {
      return { supplierIdInStore: newId };
    }),
  bankItem: null, // Initialize clickedItem to null
  setBankItem: (item) => set(() => ({ bankItem: item })),
  stageIdInStore: null,
  setStageIdInStore: (newId) =>
    set(() => {
      return { stageIdInStore: newId };
    }),
  stageLevelInStore: null,
  setStageLevelInStore: (newLevel) =>
    set(() => {
      return { stageLevelInStore: newLevel };
    }),
  bankChequePathInStore: null,
  setBankChequePathInStore: (newPath) =>
    set(() => {
      return { bankChequePathInStore: newPath };
    }),
  nidPassportPathInStore: null,
  setNidPassportPathInStore: (newPath) =>
    set(() => {
      return { nidPassportPathInStore: newPath };
    }),
  signaturePathInStore: null,
  setSinaturePathInStore: (newPath) =>
    set(() => {
      return { signaturePathInStore: newPath };
    }),
  etinPathInStore: null,
  setEtinPathInStore: (newPath) =>
    set(() => {
      return { etinPathInStore: newPath };
    }),
  profileUidInStore: null,
  setProfileUidInStore: (newProfileId) =>
    set(() => {
      return { profileUidInStore: newProfileId };
    }),
  profileNewInfoUidInStore: null,
  setProfileNewInfoUidInStore: (newInfoUid) =>
    set(() => {
      return { profileNewInfoUidInStore: newInfoUid };
    }),
    siteIdInStore: null,
  setSiteIdInStore: (newSiteId) =>
    set(() => {
      return { siteIdInStore: newSiteId };
    }),
  initiatorStatus: null, // Initialize clickedItem to null
  setInitiatorStatus: (intStatus) => set(() => ({ initiatorStatus: intStatus })),

  isInitiatorInStore: "",
  setIsInitiatorInStore: (newIsInit) =>
    set(() => {
      return { isInitiatorInStore: newIsInit };
    }),
  
  updateListInStore: null,
  setUpdateListInStore: (newUpList) =>
    set(() => {
      return {updateListInStore: newUpList};
    }),
}));

export default useProfileUpdateStore;
