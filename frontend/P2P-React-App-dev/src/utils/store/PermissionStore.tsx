// import { create } from "zustand";

// interface State {
//   pageNo: number | null;
//   isByerNameSearchPermission: boolean | null;
// }

// interface Actions {
//   setPageNo: (newNumber: number | null) => void;
//   setIsByerNameSearchPermission: (
//     isByerNameSearchPermission: boolean | null
//   ) => void;
// }

// const usePermissionStore = create<State & Actions>((set) => ({
//   pageNo: 1, // Initialize it to null or any default value you prefer
//   setPageNo: (newNumber) =>
//     set(() => {
//       // You may perform any other side effects or validation here
//       return { pageNo: newNumber };
//     }),
//   isByerNameSearchPermission: false,
//   setIsByerNameSearchPermission: (newIsBuyerName) =>
//     set(() => {
//       return { isByerNameSearchPermission: newIsBuyerName };
//     }),
// }));

// export default usePermissionStore;

import { create } from "zustand";

interface State {
  pageNo: number | null;
  isByerNameSearchPermission: boolean | null;
  isRfqAllViewPermissionInStore: boolean | null;
}

interface Actions {
  setPageNo: (newNumber: number | null) => void;
  setIsByerNameSearchPermission: (
    isByerNameSearchPermission: boolean | null
  ) => void;

  setIsRfqAllViewPermissionInStore: ( isRfqAllViewPermissionInStore: boolean | null ) => void;
}

const usePermissionStore = create<State & Actions>((set) => {
  // Retrieve data from local storage if available
  const storedIsByerNameSearchPermission = localStorage.getItem(
    "isByerNameSearchPermission"
  );
  // const storedIsRfqAllViewPermission = localStorage.getItem(
  //   "isRfqAllViewPermissionInStore"
  // );

  return {
    pageNo: 1, // Initialize it to null or any default value you prefer
    setPageNo: (newNumber) =>
      set(() => {
        // You may perform any other side effects or validation here
        return { pageNo: newNumber };
      }),
    isByerNameSearchPermission: storedIsByerNameSearchPermission
      ? JSON.parse(storedIsByerNameSearchPermission)
      : false,
    setIsByerNameSearchPermission: (newIsBuyerName) => {
      // Save to local storage when the value changes
      localStorage.setItem(
        "isByerNameSearchPermission",
        JSON.stringify(newIsBuyerName)
      );
      set(() => {
        return { isByerNameSearchPermission: newIsBuyerName };
      });
    },

    isRfqAllViewPermissionInStore: false,
    setIsRfqAllViewPermissionInStore: (rfqAllView) => {
      set(() => {
        return { isRfqAllViewPermissionInStore: rfqAllView };
      });
    },
  };
});

export default usePermissionStore;
