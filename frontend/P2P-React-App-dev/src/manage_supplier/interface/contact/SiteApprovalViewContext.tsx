

import { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context
interface SiteApprovalViewContextType {
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    siteId: number | null;
    setSiteId: React.Dispatch<React.SetStateAction<number | null>>;

    siteLength: number;
    setSiteLength: React.Dispatch<React.SetStateAction<number>>;

}

// Create the context
const SiteApprovalViewContext = createContext<SiteApprovalViewContextType | undefined>(undefined);

// Create a custom hook to access the context
export const useSiteApprovalViewContext = (): SiteApprovalViewContextType => {
    const context = useContext(SiteApprovalViewContext);
    if (!context) {
        throw new Error('useDocumentContext must be used within a DocumentProvider');
    }
    return context;
};

// Create a provider component to wrap around the app
export const SiteApprovalViewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [number, setNumber] = useState<number>(1);
    const [siteId, setSiteId] = useState<number | null>(null);
    const [siteLength, setSiteLength] = useState<number>(0);


    return (
        <SiteApprovalViewContext.Provider value={{ page: number, setPage: setNumber, siteId, setSiteId, siteLength, setSiteLength }}>
            {children}
        </SiteApprovalViewContext.Provider>
    );
};
