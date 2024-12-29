import { create } from "zustand";
import TemplateInterface from "../interface/TemplateInterface";

interface State {
  approvalTemplateInStore: TemplateInterface | null;
}

interface Actions {

  setApprovalTemplateInStore: (newSingleTemplate: TemplateInterface | null) => void;
}

const useApprovalSetupStore = create<State & Actions>((set) => ({
  approvalTemplateInStore: null,
  setApprovalTemplateInStore: (newTemplate) =>
    set(() => {
      return { approvalTemplateInStore: newTemplate };
    }),
}));
export default useApprovalSetupStore;
