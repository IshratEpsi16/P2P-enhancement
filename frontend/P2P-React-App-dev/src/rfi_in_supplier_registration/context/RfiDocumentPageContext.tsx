

import { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context
interface RfiDocumentApprovalViewContextType {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;

}

// Create the context
const RfiDocumentApprovalViewContext = createContext<RfiDocumentApprovalViewContextType | undefined>(undefined);

// Create a custom hook to access the context
export const useRfiDocumentApprovalViewContext = (): RfiDocumentApprovalViewContextType => {
  const context = useContext(RfiDocumentApprovalViewContext);
  if (!context) {
    throw new Error('useDocumentApprovalViewContext must be used within a DocumentProvider');
  }
  return context;
};

// Create a provider component to wrap around the app
export const RfiDocumentApprovalViewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [number, setNumber] = useState<number>(1);


  return (
    <RfiDocumentApprovalViewContext.Provider value={{ page: number, setPage: setNumber }}>
      {children}
    </RfiDocumentApprovalViewContext.Provider>
  );
};
