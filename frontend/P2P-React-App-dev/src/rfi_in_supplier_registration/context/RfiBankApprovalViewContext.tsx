

import { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context
interface RfiBankViewApprovalContextType {
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    bankAccId: number | null;
    setBankAccId: React.Dispatch<React.SetStateAction<number | null>>;

    bankAccLength: number;
    setBankAccLength: React.Dispatch<React.SetStateAction<number>>;

}

// Create the context
const RfiBankViewApprovalContext = createContext<RfiBankViewApprovalContextType | undefined>(undefined);

// Create a custom hook to access the context
export const useRfiBankViewApprovalContext = (): RfiBankViewApprovalContextType => {
    const context = useContext(RfiBankViewApprovalContext);
    if (!context) {
        throw new Error('useRfiBankViewApprovalContext must be used within a DocumentProvider');
    }
    return context;
};

// Create a provider component to wrap around the app
export const RfiBankViewApprovalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [page, setPage] = useState<number>(1);
    const [bankAccId, setBankAccId] = useState<number | null>(null);
    const [bankAccLength, setBankAccLength] = useState<number>(0);


    return (
        <RfiBankViewApprovalContext.Provider value={{ page, setPage, bankAccId, setBankAccId, bankAccLength, setBankAccLength }}>
            {children}
        </RfiBankViewApprovalContext.Provider>
    );
};
