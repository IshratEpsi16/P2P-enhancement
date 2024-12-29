

import { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context
interface DocumentPageContextType {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;

}

// Create the context
const DocumentPageContext = createContext<DocumentPageContextType | undefined>(undefined);

// Create a custom hook to access the context
export const useDocumentPageContext = (): DocumentPageContextType => {
  const context = useContext(DocumentPageContext);
  if (!context) {
    throw new Error('useDocumentContext must be used within a DocumentProvider');
  }
  return context;
};

// Create a provider component to wrap around the app
export const DocumentPageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [number, setNumber] = useState<number>(1);


  return (
    <DocumentPageContext.Provider value={{ page: number, setPage: setNumber }}>
      {children}
    </DocumentPageContext.Provider>
  );
};
