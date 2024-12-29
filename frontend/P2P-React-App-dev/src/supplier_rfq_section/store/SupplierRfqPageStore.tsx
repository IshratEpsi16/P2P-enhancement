// import { create } from "zustand";

// interface State {
//   pageNo: number | null;
//   appStatus: string;
// }

// interface Actions {
//   setPageNoRfq: (newNumber: number | null) => void;
//   setAppStatus: (appStatus: string) => void;
// }

// const useSupplierRfqPageStore = create<State & Actions>((set) => ({
//   pageNo: 1, // Initialize it to null or any default value you prefer
//   setPageNoRfq: (newNumber) =>
//     set(() => {
//       // You may perform any other side effects or validation here
//       return { pageNo: newNumber };
//     }),

//   appStatus: "NEW",
//   setAppStatus: (status) =>
//     set(() => {
//       return { appStatus: status };
//     }),
// }));

// export default useSupplierRfqPageStore;
import { create } from "zustand";

interface State {
  pageNoRfq: number | null;
  appStatus: string;
}

interface Actions {
  setPageNoRfq: (newNumber: number | null) => void;
  setAppStatus: (appStatus: string) => void;
  handleButtonClick: (rfqStatus: string) => void; // Declare handleButtonClick function here
}

const useSupplierRfqPageStore = create<State & Actions>((set) => ({
  pageNoRfq: 1,
  setPageNoRfq: (newNumber) =>
    set(() => {
      return { pageNoRfq: newNumber };
    }),

  appStatus: "NEW",
  setAppStatus: (status) =>
    set(() => {
      return { appStatus: status };
    }),

  handleButtonClick: (rfqStatus) => {
    set({ appStatus: rfqStatus }); // Update the status
  },
}));

export default useSupplierRfqPageStore;
