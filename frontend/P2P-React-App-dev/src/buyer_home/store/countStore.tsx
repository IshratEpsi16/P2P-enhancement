import { create } from "zustand";

interface State {
  registerSupplierLength: number | null;
  rfiSupplierLength: number | null;
  profileUpdateSupplierLength: number | null;
  profileNewAddSupplierLength: number | null;
}

interface Actions {
  setRegisterSupplierLength: (newNumber: number | null) => void;
  setRfiSupplierLength: (newNumber: number | null) => void;
  setProfileSupplierLength: (newNumber: number | null) => void;
  setProfileSupplierNewAddLength: (
    profileNewAddSupplierLength: number | null
  ) => void;
}

const useCountStore = create<State & Actions>((set) => ({
  registerSupplierLength: 0, // Initialize it to null or any default value you prefer
  rfiSupplierLength: 0,
  profileUpdateSupplierLength: 0,
  setRegisterSupplierLength: (newNumber) =>
    set(() => {
      // You may perform any other side effects or validation here
      return { registerSupplierLength: newNumber };
    }),
  setRfiSupplierLength: (newNumber) =>
    set(() => {
      // You may perform any other side effects or validation here
      return { rfiSupplierLength: newNumber };
    }),
  setProfileSupplierLength: (newNumber) =>
    set(() => {
      // You may perform any other side effects or validation here
      return { profileUpdateSupplierLength: newNumber };
    }),
  profileNewAddSupplierLength: 0,
  setProfileSupplierNewAddLength: (newlen) =>
    set(() => {
      return { profileNewAddSupplierLength: newlen };
    }),
}));

export default useCountStore;
