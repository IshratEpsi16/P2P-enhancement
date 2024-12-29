import { create } from "zustand";

interface State {
  rfiSupplierListlength: number | null;
  rfiTabNo: number;
  shipmentPageNo: number | null;
  stageLevelInStore: number | null;
  templateIdInStore: number | null;
}

interface Actions {
  setRfiSupplierListlength: (newNumber: number | null) => void;
  setRfiTabNo: (rfiTabNo: number) => void;
  setShipmentPageNo: (shipmentPageNo: number) => void;
  setStageLevelInStore: (stageLevelInStore: number | null) => void;
  setTemplateIdInStore: (templateIdInStore: number | null) => void;
}

const useRfiStore = create<State & Actions>((set) => ({
  rfiSupplierListlength: 0, // Initialize it to null or any default value you prefer
  setRfiSupplierListlength: (newNumber) =>
    set(() => {
      // You may perform any other side effects or validation here
      return { rfiSupplierListlength: newNumber };
    }),
  rfiTabNo: 11,
  setRfiTabNo: (newTab) =>
    set(() => {
      return { rfiTabNo: newTab };
    }),
  shipmentPageNo: 1,
  setShipmentPageNo: (newShipmentPage) => 
    set(() => {
      return{ shipmentPageNo: newShipmentPage };
    }),

  stageLevelInStore: 1,
  setStageLevelInStore:(newStageLevel) => 
    set(() => {
      return { stageLevelInStore: newStageLevel };
    }),
  
  templateIdInStore: 1,
  setTemplateIdInStore:(newTempId) => 
    set(() => {
      return { templateIdInStore: newTempId };
    }),
}));

export default useRfiStore;
