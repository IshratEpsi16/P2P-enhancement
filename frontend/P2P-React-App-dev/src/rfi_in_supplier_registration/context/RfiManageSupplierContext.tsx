import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

// Define the shape of the context
interface RfiManageSupplierContextType {
    rfiManageSupplierPageNo: number;
    setRfiManageSupplierPageNo: Dispatch<SetStateAction<number>>;
    rfiId:number | null,
    setRfiId:(rfiId: number | null) => void;
    

}

// Create the context
const RfiManageSupplierContext = createContext<RfiManageSupplierContextType | undefined>(undefined);

// Create a custom hook to access the context
export const useRfiManageSupplierContext = (): RfiManageSupplierContextType => {
    const context = useContext(RfiManageSupplierContext);
    if (!context) {
        throw new Error('rfiManageSupplierContext must be used within a DocumentProvider');
    }
    return context;
};

// Create a provider component to wrap around the app
export const RfiManageSupplierProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [number, setNumber] = useState<number>(1);
    const [rfiId, setRfiId] = useState<number | null>(null);
    


    return (
        <RfiManageSupplierContext.Provider
            value={{
                rfiManageSupplierPageNo: number,
                setRfiManageSupplierPageNo: setNumber,
                rfiId,setRfiId
               

            }}
        >
            {children}
        </RfiManageSupplierContext.Provider>
    );
};
