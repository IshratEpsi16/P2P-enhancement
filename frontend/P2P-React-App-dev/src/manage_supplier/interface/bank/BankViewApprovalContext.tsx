

import { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context
interface BankViewApprovalContextType {
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    bankAccId: number | null;
    setBankAccId: React.Dispatch<React.SetStateAction<number | null>>;

    bankAccLength: number;
    setBankAccLength: React.Dispatch<React.SetStateAction<number>>;

}

// Create the context
const BankViewApprovalContext = createContext<BankViewApprovalContextType | undefined>(undefined);

// Create a custom hook to access the context
export const useBankViewApprovalContext = (): BankViewApprovalContextType => {
    const context = useContext(BankViewApprovalContext);
    if (!context) {
        throw new Error('useBankViewApprovalContext must be used within a DocumentProvider');
    }
    return context;
};

// Create a provider component to wrap around the app
export const BankViewApprovalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [page, setPage] = useState<number>(1);
    const [bankAccId, setBankAccId] = useState<number | null>(null);
    const [bankAccLength, setBankAccLength] = useState<number>(0);


    return (
        <BankViewApprovalContext.Provider value={{ page, setPage, bankAccId, setBankAccId, bankAccLength, setBankAccLength }}>
            {children}
        </BankViewApprovalContext.Provider>
    );
};
