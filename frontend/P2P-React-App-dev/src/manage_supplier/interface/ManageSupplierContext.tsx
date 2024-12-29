import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

// Define the shape of the context
interface ManageSupplierContextType {
    manageSupplierPageNo: number;
    setManageSupplierPageNo: Dispatch<SetStateAction<number>>;
    

}

// Create the context
const ManageSupplierContext = createContext<ManageSupplierContextType | undefined>(undefined);

// Create a custom hook to access the context
export const useManageSupplierContext = (): ManageSupplierContextType => {
    const context = useContext(ManageSupplierContext);
    if (!context) {
        throw new Error('manageSupplierContext must be used within a DocumentProvider');
    }
    return context;
};

// Create a provider component to wrap around the app
export const ManageSupplierProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [number, setNumber] = useState<number>(1);
    


    return (
        <ManageSupplierContext.Provider
            value={{
                manageSupplierPageNo: number,
                setManageSupplierPageNo: setNumber,
               

            }}
        >
            {children}
        </ManageSupplierContext.Provider>
    );
};
