import { create } from "zustand";
import { UserRoleData } from "../interface/UserRoleListInterface";

interface State {
  pageNo: number | null;
  selectedUserRole: UserRoleData | null;
}

interface Actions {
  setPageNo: (newNumber: number | null) => void;
  setSelectedUserRole: (newRole: UserRoleData | null) => void;
}

const userRoleStore = create<State & Actions>((set) => ({
  pageNo: 1, // Initialize it to null or any default value you prefer
  setPageNo: (newNumber) =>
    set(() => {
      // You may perform any other side effects or validation here
      return { pageNo: newNumber };
    }),
  selectedUserRole: null,
  setSelectedUserRole: (newRole) =>
    set(() => {
      return { selectedUserRole: newRole };
    }),
}));

export default userRoleStore;
