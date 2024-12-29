import { create } from "zustand";

interface State {
  globalIncorporatedIn: string | null;
  siteListInStore: string[];

  isContactChangeStore: boolean;
  isBankChangeStore: boolean;
  isSiteChangeStore: boolean;
}

interface Actions {
  setGlobalIncorporatedIn: (newString: string | null) => void;
  setSiteListInStore: (newSiteList: string[]) => void;

  setIsContactChangeStore: (isContactChangeStore: boolean) => void;
  setIsBankChangeStore: (isBankChangeStore: boolean) => void;
  setIsSiteChangeStore: (isSiteChangeStore: boolean) => void;
}

const useRegistrationStore = create<State & Actions>((set) => ({
  globalIncorporatedIn: localStorage.getItem("gin") || "",
  setGlobalIncorporatedIn: (newString) =>
    set(() => {
      localStorage.setItem("gin", newString!);
      return { globalIncorporatedIn: newString };
    }),
  
  siteListInStore: [],
  setSiteListInStore: (newSiteList) =>
    set({
      siteListInStore: newSiteList
    }),

  isContactChangeStore: false,
  setIsContactChangeStore: (newContact) =>
    set(() => {
      return { isContactChangeStore: newContact };
    }),
  isBankChangeStore: false,
  setIsBankChangeStore: (newBank) =>
    set(() => {
      return { isBankChangeStore: newBank };
    }),
  isSiteChangeStore: false,
  setIsSiteChangeStore: (newSite) =>
    set(() => {
      return { isSiteChangeStore: newSite };
    }),
}));

export default useRegistrationStore;
