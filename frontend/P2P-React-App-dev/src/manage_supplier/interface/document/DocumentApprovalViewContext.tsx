

import { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context
interface DocumentApprovalViewContextType {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;

}

// Create the context
const DocumentApprovalViewContext = createContext<DocumentApprovalViewContextType | undefined>(undefined);

// Create a custom hook to access the context
export const useDocumentApprovalViewContext = (): DocumentApprovalViewContextType => {
  const context = useContext(DocumentApprovalViewContext);
  if (!context) {
    throw new Error('useDocumentApprovalViewContext must be used within a DocumentProvider');
  }
  return context;
};

// Create a provider component to wrap around the app
export const DocumentApprovalViewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [number, setNumber] = useState<number>(1);


  return (
    <DocumentApprovalViewContext.Provider value={{ page: number, setPage: setNumber }}>
      {children}
    </DocumentApprovalViewContext.Provider>
  );
};
