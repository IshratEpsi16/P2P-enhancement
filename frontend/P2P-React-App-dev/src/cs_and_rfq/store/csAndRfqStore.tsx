import { create } from "zustand";

interface State {
  csAndRfqpageNo: number | null;
  csIdInCsAndRfq: number | null;
}

interface Actions {
  setCsAndRfqPageNo: (newNumber: number | null) => void;
  setCsIdInCsAndRfq: (newNumber2: number | null) => void;
}

const useCsAndRfqStore = create<State & Actions>((set) => ({
  csAndRfqpageNo: 1, // Initialize it to null or any default value you prefer
  setCsAndRfqPageNo: (newNumber) =>
    set(() => {
      // You may perform any other side effects or validation here
      return { csAndRfqpageNo: newNumber };
    }),
  csIdInCsAndRfq: null,
  setCsIdInCsAndRfq: (newNumber) =>
    set(() => {
      // You may perform any other side effects or validation here
      return { csIdInCsAndRfq: newNumber };
    }),
}));

export default useCsAndRfqStore;
