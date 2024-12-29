import { create } from "zustand";
import SupplierInterface from "../interface/SupplierInterface";

interface State {
  manageSupplierListLength: number | null;
  initiator: string | null;
  isRegisterApprovedSupplier: boolean;
  registerAppStatus: string;
  singleSupplierSupplier: SupplierInterface | null;
  stageIdManageSupplierStore: number | null;
  stageLevelManageSupplierStore: number | null;
}

interface Actions {
  setManageSupplierListLength: (newNumber: number | null) => void;
  setInitiator: (val: string | null) => void;
  setisRegisterApprovedSupplier: (isRegisterApprovedSupplier: boolean) => void;
  setRegisterAppStatus: (registerAppStatus: string) => void;
  setSingleSupplier: (selectedSupplier: SupplierInterface | null) => void;
  setStageIdManageSupplierStore: (stageIdNew: number | null) => void;
  setStageLevelManageSupplierStore: (stageLevelNew: number | null) => void;
}

const useManageSupplierStore = create<State & Actions>((set) => ({
  stageLevelManageSupplierStore: null,
  setStageLevelManageSupplierStore: (newLevel) =>
    set(() => {
      return { stageLevelManageSupplierStore: newLevel };
    }),
  stageIdManageSupplierStore: null,
  setStageIdManageSupplierStore: (newSid) =>
    set(() => {
      return { stageIdManageSupplierStore: newSid };
    }),
  manageSupplierListLength: 0,
  initiator: null,
  // Initialize it to null or any default value you prefer
  setManageSupplierListLength: (newNumber) =>
    set(() => {
      // You may perform any other side effects or validation here
      return { manageSupplierListLength: newNumber };
    }),
  setInitiator: (val) =>
    set(() => {
      // You may perform any other side effects or validation here
      return { initiator: val };
    }),
  isRegisterApprovedSupplier: true,
  setisRegisterApprovedSupplier: (newTab) =>
    set(() => {
      return { isRegisterApprovedSupplier: newTab };
    }),
  registerAppStatus: "IN PROCESS",
  setRegisterAppStatus: (newTab) =>
    set(() => {
      return { registerAppStatus: newTab };
    }),
  singleSupplierSupplier: null,
  setSingleSupplier: (newSup) =>
    set(() => {
      return { singleSupplierSupplier: newSup };
    }),
}));

export default useManageSupplierStore;
