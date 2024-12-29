

import { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context
interface SupplierRfqPageContextType {
    supplierRfqPage: number;
    setSupplierRfqPage: React.Dispatch<React.SetStateAction<number>>;
}

// Create the context
const SupplierRfqPageContext = createContext<SupplierRfqPageContextType | undefined>(undefined);

// Create a custom hook to access the context
export const useSupplierRfqPageContext = (): SupplierRfqPageContextType => {
    const context = useContext(SupplierRfqPageContext);
    if (!context) {
        throw new Error('useSupplierPageContext must be used within a DocumentProvider');
    }
    return context;
};

// Create a provider component to wrap around the app
export const SupplierRfqPageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [number, setNumber] = useState<number>(1);

    return (
        <SupplierRfqPageContext.Provider value={{ supplierRfqPage: number, setSupplierRfqPage: setNumber }}>
            {children}
        </SupplierRfqPageContext.Provider>
    );
};
