import { create } from "zustand";

// Define the store state interface
interface authState {
  loggedInUserName: string | null;
  setLoggedInUserName: (headerAttachment: string | null) => void; // Corrected signature
  isWlcMsgSwn: number | null;
  setIsWlcMsgSwn: (isWlcMsgSwn: number | null) => void;
  wlcMessage: string | null;
  setWlcMessage: (wlcMessage: string | null) => void;

  isRegistrationInStore: number | null;
  setIsRegistrationInStore: (isRegistrationInStore: number | null) => void;

  isProfileUpdateStatusInStore: string | null;
  setIsProfileUpdateStatusInStore: (isProfileUpdateStatusInStore: string | null) => void;
  isNewInfoStatusInStore: string | null;
  setIsNewInfoStatusInStore: (isNewInfoStatusInStore: string | null) => void;
}

// Create the Zustand store
const useAuthStore = create<authState>((set) => ({
  loggedInUserName: null,
  setLoggedInUserName: (string) => set({ loggedInUserName: string }),
  isWlcMsgSwn: null,
  setIsWlcMsgSwn: (number) => set({ isWlcMsgSwn: number }),
  wlcMessage: null,
  setWlcMessage: (string) => set({ wlcMessage: string }),
  isRegistrationInStore: null,
  setIsRegistrationInStore: (number) => set({isRegistrationInStore: number }),

  isProfileUpdateStatusInStore: null,
  setIsProfileUpdateStatusInStore: (string) => set({isProfileUpdateStatusInStore: string}),
  isNewInfoStatusInStore: null,
  setIsNewInfoStatusInStore: (string) => set({isNewInfoStatusInStore: string}),
}));

export default useAuthStore;
