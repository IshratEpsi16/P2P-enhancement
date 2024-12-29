import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

// Define the shape of the context
interface ManageSupplierProfileUpdateContextType {
    manageSupplierProfileUpdatePageNo: number;
    setManageSupplierProfileUpdatePageNo: Dispatch<SetStateAction<number>>;
    stageId: number | null; 
    setStageId: (stageId: number | null) => void;
    stageLevel: number | null; 
    setStageLevel: (stageLevel: number | null) => void;
    
    

}

// Create the context
const ManageSupplierProfileUpdateContext = createContext<ManageSupplierProfileUpdateContextType | undefined>(undefined);

// Create a custom hook to access the context
export const useManageSupplierProfileUpdateContext = (): ManageSupplierProfileUpdateContextType => {
    const context = useContext(ManageSupplierProfileUpdateContext);
    if (!context) {
        throw new Error('manageSupplierProfileUpdateContext must be used within a DocumentProvider');
    }
    return context;
};

// Create a provider component to wrap around the app
export const ManageSupplierProfileUpdateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [number, setNumber] = useState<number>(1);
    const [stageId,setStageId]=useState<number | null>(null);
    const [stageLevel,setStageLevel]=useState<number | null>(null);


    return (
        <ManageSupplierProfileUpdateContext.Provider
            value={{
                manageSupplierProfileUpdatePageNo: number,
                setManageSupplierProfileUpdatePageNo: setNumber,stageId,setStageId,stageLevel,setStageLevel
               

            }}
        >
            {children}
        </ManageSupplierProfileUpdateContext.Provider>
    );
};
