

import { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context
interface RfiContactApprovalViewContextType {
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    contactId: number | null;
    setContactId: React.Dispatch<React.SetStateAction<number | null>>;
    contactLength: number;
    setContactLength: React.Dispatch<React.SetStateAction<number>>;

}

// Create the context
const RfiContactViewApprovalContext = createContext<RfiContactApprovalViewContextType | undefined>(undefined);

// Create a custom hook to access the context
export const useRfiContactApprovalViewContext = (): RfiContactApprovalViewContextType => {
    const context = useContext(RfiContactViewApprovalContext);
    if (!context) {
        throw new Error('useRfiContactViewApprovalContext must be used within a ContactProvider');
    }
    return context;
};

// Create a provider component to wrap around the app
export const RfiContactViewApprovalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [number, setNumber] = useState<number>(1);
    const [contactId, setContactId] = useState<number | null>(null);
    const [contactLength, setContactLength] = useState<number>(0);


    return (
        <RfiContactViewApprovalContext.Provider value={{ page: number, setPage: setNumber, contactId, setContactId, contactLength, setContactLength }}>
            {children}
        </RfiContactViewApprovalContext.Provider>
    );
};
