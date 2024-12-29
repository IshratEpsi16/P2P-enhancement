import { create } from "zustand";

interface State {
  prepaymentApprovalPageNo: number | null;
}

interface Actions {
  setPrepaymentApprovalPageNo: (newNumber: number | null) => void;
}

const usePrepaymentApprovalStore = create<State & Actions>((set) => ({
  prepaymentApprovalPageNo: 1, // Initialize it to null or any default value you prefer
  setPrepaymentApprovalPageNo: (newNumber) =>
    set(() => {
      // You may perform any other side effects or validation here
      return { prepaymentApprovalPageNo: newNumber };
    }),
}));

export default usePrepaymentApprovalStore;
