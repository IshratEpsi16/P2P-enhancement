import { create } from "zustand";

interface State {
  pageNo: number | null;
}

interface Actions {
  setPageNo: (newNumber: number | null) => void;
}

const useGrnStore = create<State & Actions>((set) => ({
  pageNo: 1, // Initialize it to null or any default value you prefer
  setPageNo: (newNumber) =>
    set(() => {
      // You may perform any other side effects or validation here
      return { pageNo: newNumber };
    }),
}));

export default useGrnStore;
