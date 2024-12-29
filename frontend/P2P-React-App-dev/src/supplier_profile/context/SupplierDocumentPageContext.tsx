

import { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context
interface SupplierDocumentPageContextType {
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
}

// Create the context
const SupplierDocumentPageContext = createContext<SupplierDocumentPageContextType | undefined>(undefined);

// Create a custom hook to access the context
export const useSupplierDocumentPageContext = (): SupplierDocumentPageContextType => {
    const context = useContext(SupplierDocumentPageContext);
    if (!context) {
        throw new Error('useSupplierDocumentContext must be used within a SupplierDocumentProvider');
    }
    return context;
};

// Create a provider component to wrap around the app
export const SupplierDocumentPageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [number, setNumber] = useState<number>(1);

    return (
        <SupplierDocumentPageContext.Provider value={{ page: number, setPage: setNumber }}>
            {children}
        </SupplierDocumentPageContext.Provider>
    );
};
